import { saveAs } from "file-saver";
import DatabaseHandler from "../database/DatabaseHandler";

export const fetchLocalStoreData = async (keys = []) => {
  if (keys && Array.isArray(keys) && keys.length > 0) {
    const result = {};

    const promises = await keys.map(async (key) => {
      const data = await DatabaseHandler.getStoreValue(key);
      result[key] = data;

      return key;
    });

    await Promise.all(promises);

    return result;
  }

  return [];
};

export const saveImageToLocalPath = (file) => {
  const fs = window.require("fs");
  const { app } = window.require("electron").remote;

  const reader = new FileReader();
  reader.readAsDataURL(file.data);

  reader.onload = (event) => {
    const base64Image = event.target.result.split(";base64,").pop();
    fs.writeFile(
      `${app.getAppPath("userData")}/public/images/${file.data.name}`,
      base64Image,
      { encoding: "base64" },
      (err) => {
        if (err) console.error(err);
      }
    );
  };
};

export const downloadImage = (path, name) => {
  return saveAs(path, name);
};

export const getFileName = (path) => path.substr(path.lastIndexOf("/") + 1);
