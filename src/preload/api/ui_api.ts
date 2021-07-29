import { ipcRenderer, OpenDialogReturnValue } from "electron";
import { dialog_closed_event, open_dialog_command } from "../../shared/events_commands";

export const ui_api = {

    api_name: 'ui',

    open_dialog(): Promise<OpenDialogReturnValue>
    {
        return new Promise<OpenDialogReturnValue>(resolve =>
        {
            ipcRenderer.send(open_dialog_command);

            ipcRenderer.once(dialog_closed_event, (_, arg) =>
            {
                resolve(arg);
            });
        });
    }
}