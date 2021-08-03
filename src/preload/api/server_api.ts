import { ipcRenderer, IpcRendererEvent } from "electron";
import { send_file_command, send_file_failed_event, send_file_succeeded_event, server_bind_failed_event, server_bind_succeeded_event, start_server_command, subscribe_to_transfers_command, transfer_completed_event, transfer_incoming_event } from "../../shared/events_commands";

export const server_api = {

    api_name: 'server',

    start_server(): Promise<number>
    {
        return new Promise<number>((resolve, reject) =>
        {
            ipcRenderer.send(start_server_command);

            let on_bind_succeeded: (event: IpcRendererEvent, port: number) => void;
            let on_bind_failed: (event: IpcRendererEvent, reason: Error) => void;

            on_bind_succeeded = (_, port) =>
            {
                ipcRenderer.off(server_bind_failed_event, on_bind_failed);
                resolve(port);
            };

            on_bind_failed = (_, reason) =>
            {
                ipcRenderer.off(server_bind_succeeded_event, on_bind_succeeded);
                reject(reason);
            };

            ipcRenderer.once(server_bind_succeeded_event, on_bind_succeeded);

            ipcRenderer.once(server_bind_failed_event, on_bind_failed);
        });
    },

    send_file_command(file: string, address: string, port: number): Promise<void>
    {
        return new Promise<void>((resolve, reject) =>
        {
            ipcRenderer.send(send_file_command, file, address, port);

            let on_send_succeeded: (event: IpcRendererEvent) => void;
            let on_send_failed: (event: IpcRendererEvent, reason: Error) => void;

            on_send_succeeded = () =>
            {
                ipcRenderer.off(send_file_failed_event, on_send_failed);
                resolve();
            };

            on_send_failed = (_: IpcRendererEvent, reason: Error) =>
            {
                ipcRenderer.off(send_file_succeeded_event, on_send_succeeded);
                reject(reason);
            };

            ipcRenderer.once(send_file_failed_event, on_send_failed);

            ipcRenderer.once(send_file_succeeded_event, on_send_succeeded);
        });
    },

    subscribe_to_incoming_transfers(on_incoming: (filename: string) => void, on_completed: () => void)
    {
        ipcRenderer.send(subscribe_to_transfers_command);

        ipcRenderer.on(transfer_incoming_event, (_, filename) =>
        {
            on_incoming(filename);
        });

        ipcRenderer.on(transfer_completed_event, () =>
        {
            on_completed();
        });
    }
}