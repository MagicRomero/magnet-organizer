import React, { useState, useEffect } from "react";
const { ipcRenderer } = window.require("electron");

const Dashboard = () => {
  const [magnets, setMagnets] = useState([{ name: "test" }]);

  useEffect(() => {
    (async () => {
      const magnets = await ipcRenderer.invoke("getStoreValue", "magnets");

      setMagnets(magnets);
    })();
  }, []);

  const setFuckingMagnets = async () => {
    const new_magnets = magnets.concat([{ name: "polla iman" }]);
    await ipcRenderer.invoke("setStoreValue", "magnets", new_magnets);
    setMagnets(new_magnets);
  };

  return (
    <div>
      <button onClick={setFuckingMagnets}>
        FUNCIONA PUTO MAGNET O TE REVIENTO
      </button>
      {magnets.map((magnet) => (
        <li key={magnet.name}>{magnet.name}</li>
      ))}
    </div>
  );
};

export default Dashboard;
