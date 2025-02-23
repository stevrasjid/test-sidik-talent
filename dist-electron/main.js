import { app as o, BrowserWindow as i } from "electron";
import { fileURLToPath as t } from "url";
import n from "path";
const r = t(import.meta.url), a = n.dirname(r);
let e;
o.whenReady().then(() => {
  e = new i({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: !0
    }
  }), e.loadURL(`file://${n.join(a, "../dist/index.html")}`), e.webContents.openDevTools();
});
o.on("window-all-closed", () => {
  process.platform !== "darwin" && o.quit();
});
