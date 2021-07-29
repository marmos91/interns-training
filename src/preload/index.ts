import { contextBridge } from "electron";
import { server_api } from "./api/server_api";
import { ui_api } from "./api/ui_api";

contextBridge.exposeInMainWorld(server_api.api_name, server_api);
contextBridge.exposeInMainWorld(ui_api.api_name, ui_api);