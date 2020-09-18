module.exports = (ipcMain, store) => {
  ipcMain.handle("clearStore", (event, listener) => store.clear());
  ipcMain.handle("getStoreValue", (event, item) => store.get(item));
  ipcMain.handle("setStoreValue", (event, item, value) =>
    store.set(item, value)
  );
  ipcMain.handle("findStoreValue", (event, item, target = null) => {
    const items = store.get(item);

    if (target) {
      return items.find((item) => item.id === target.id);
    }

    return items;
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

    const itemsWithoutTheTarget = items.filter((item) => item.id !== target.id);

    return store.set(item, itemsWithoutTheTarget);
  });
};
