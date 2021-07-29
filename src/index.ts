import { ElectronStarter } from './ElectronStarter';
import { App } from './App';

(async () =>
{
    const app = new App(new ElectronStarter());
    await app.listen();
})();