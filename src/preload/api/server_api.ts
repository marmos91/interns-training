import { ipcRenderer, IpcRendererEvent } from "electron";
import { send_file_command, send_file_failed_event, send_file_succeeded_event, server_bound_event, start_server_command, subscribe_to_transfers_command, transfer_completed_event, transfer_incoming_event } from "../../shared/events_commands";

export const server_api = {

    api_name: 'server',

    start_server(): Promise<number>
    {
        return new Promise<number>(resolve =>
        {
            ipcRenderer.send(start_server_command);

            ipcRenderer.once(server_bound_event, (_, arg) =>
            {
                resolve(arg);
            });
        });
    },

    send_file_command(file: string, address: string, port: number): Promise<void>
    {
        return new Promise<void>((resolve, reject) =>
        {
            ipcRenderer.send(send_file_command, file, address, port);

            function on_send_failed(_: IpcRendererEvent, reason: Error): void
            {
                ipcRenderer.off(send_file_succeeded_event, on_send_succeeded);
                reject(reason);
            };

            function on_send_succeeded()
            {
                ipcRenderer.off(send_file_failed_event, on_send_failed);
                resolve();
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