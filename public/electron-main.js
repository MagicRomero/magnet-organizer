const { app, BrowserWindow, ipcMain } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");
const url = require("url");
const Store = require("electron-store");

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1200,
    height: 860,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });

  // and load the index.html of the app.
  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : url.format({
          pathname: path.join(__dirname, "../build/index.html"),
          protocol: "file",
          slashes: true,
        })
  );

  // Open the DevTools.
  //win.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const schema = {
  author: {
    type: "array",
    items: {
      type: "object",
      properties: {
        name: {
          type: "string",
          pattern: "([a-zA-Z]|\\s)+",
        },
        category: {
          type: "string",
          default: "friend",
        },
      },
      required: ["name", "category"],
      additionalProperties: false,
    },
  },
  magnets: {
    type: "array",
    items: {
      type: "object",
      properties: {
        name: {
          type: "string",
          pattern: "(\\w|\\s)+",
        },
        image: {
          type: ["string", "null"],
          format: "uri",
        },
        date: {
          type: "string",
          format: "date-time",
          default: new Date().toJSON(),
        },
      },
      required: ["name", "date"],
      additionalProperties: false,
    },
    default: [],
  },
};

const store = new Store({ schema });

ipcMain.handle("getStoreValue", (event, key) => store.get(key));
ipcMain.handle("setStoreValue", (event, key, value) => store.set(key, value));