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
        id: {
          type: "string",
        },
        name: {
          type: "string",
          pattern: "([a-zA-Z]|\\s)+",
        },
        category: {
          type: "string",
          default: "friend",
        },
      },
      required: ["id", "name", "category"],
      additionalProperties: false,
    },
  },
  magnets: {
    type: "array",
    items: {
      type: "object",
      properties: {
        id: {
          type: "string",
        },
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
      required: ["id", "name", "date"],
      additionalProperties: true,
    },
    default: [],
  },
};

const store = new Store({ schema });

ipcMain.handle("clearStore", (event, listener) => store.clear());
ipcMain.handle("getStoreValue", (event, item) => store.get(item));
ipcMain.handle("setStoreValue", (event, item, value) => store.set(item, value));
ipcMain.handle("findStoreValue", (event, item, target = null) => {
  const items = store.get(item);
  let result = items;

  if (target) {
    result = items.find((item) => item[target.key] === target.value);
  }

  return result;
});

ipcMain.handle("updateStoreValue", (event, item, newValue) => {
  const items = store.get(item);

  const itemsUpdated = items.map((item) => {
    if (item.id === newValue.id) {
      return newValue;
    }

    return item;
  });

  return store.set(item, itemsUpdated);
});

ipcMain.handle("deleteStoreValue", (event, item, target = null) => {
  if (!target) {
    return store.delete(item);
  }

  const items = store.get(item);

  const itemsWithoutTheTarget = items.filter(
    (item) => item[target.key] === target.value
  );

  return store.set(item, itemsWithoutTheTarget);
});
