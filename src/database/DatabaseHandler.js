const { ipcRenderer } = window.require("electron");

class DatabaseHandler {
  static async getStoreValue(key) {
    return await ipcRenderer.invoke("getStoreValue", key);
  }

  static async setStoreValue(key, newValue) {
    return await ipcRenderer.invoke("setStoreValue", key, newValue);
  }

  static async findStoreValue(item, target = null) {
    return await ipcRenderer.invoke("findStoreValue", item, target);
  }

  static async updateStoreValue(item, newValue) {
    return await ipcRenderer.invoke("updateStoreValue", item, newValue);
  }

  static async deleteStoreValue(item, target = false) {
    if (!target) {
      return await ipcRenderer.invoke("deleteStoreValue", item);
    }

    const itemToDelete = await this.findStoreValue(item, target);

    if (itemToDelete) {
      return await ipcRenderer.invoke("deleteStoreValue", item, itemToDelete);
    }

    return null;
  }

  static async clearStore() {
    return await ipcRenderer.invoke("clearStore");
  }
}

export default DatabaseHandler;
