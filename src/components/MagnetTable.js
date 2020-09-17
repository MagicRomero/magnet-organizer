import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import DatabaseHandler from "../database/DatabaseHandler";
import MagnetModal from "./MagnetModal";

const MagnetTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [magnets, setMagnets] = useState([]);
  const [selectedMagnet, setSelectedMagnet] = useState(undefined);

  useEffect(() => {
    (async () => {
      await fetchMagnets();
    })();
  }, []);

  const fetchMagnets = async () => {
    const magnets = await DatabaseHandler.getStoreValue("magnets");
    setMagnets(magnets);
  };

  const handleMagnetSubmit = (magnet) => {
    selectedMagnet ? updateMagnet(magnet) : addNewMagnet(magnet);
  };

  const addNewMagnet = async (newMagnet) => {
    const new_magnets = magnets.concat([newMagnet]);

    await DatabaseHandler.setStoreValue("magnets", new_magnets);

    fetchMagnets();
  };

  const updateMagnet = async (updatedMagnet) => {
    await DatabaseHandler.updateStoreValue("magnets", updatedMagnet);
    fetchMagnets();
  };

  const deleteMagnet = async (event, magnetToDelete) => {
    if (window.confirm(`¿Quieres borrar el iman "${magnetToDelete.name}"?`)) {
      await DatabaseHandler.deleteStoreValue("magnets", magnetToDelete);

      const updatedMagnets = magnets.filter(
        (magnet) => magnet.id !== magnetToDelete.id
      );

      setMagnets(updatedMagnets);
    }
  };

  const showModalOnEditMode = (event, selectedMagnet) => {
    setSelectedMagnet(selectedMagnet);
    handleShowModal();
  };

  const handleShowModal = (event) => {
    if (!showModal === false) {
      setSelectedMagnet(undefined);
    }

    setShowModal(!showModal);
  };

  return (
    <div style={{ maxWidth: "100%" }}>
      <MaterialTable
        actions={[
          {
            icon: "add",
            tooltip: "Añadir iman",
            isFreeAction: true,
            onClick: handleShowModal,
          },
          {
            icon: "edit",
            tooltip: "Editar",
            onClick: showModalOnEditMode,
          },
          {
            icon: "delete-forever",
            tooltip: "Quitar este iman",
            onClick: deleteMagnet,
          },
        ]}
        pageSize={10}
        pageSizeOptions={[10, 20, 50]}
        columns={[
          { title: "Imagen", field: "image" },
          { title: "Nombre", field: "name" },
          { title: "Fecha", field: "date" },
        ]}
        data={magnets}
        title="Lista de imanes conseguidos"
        options={{
          actionsColumnIndex: -1,
        }}
      />
      <MagnetModal
        isOpen={showModal}
        handleShowModal={handleShowModal}
        selectedMagnet={selectedMagnet}
        magnets={magnets}
        handleSubmit={handleMagnetSubmit}
      />
    </div>
  );
};

export default MagnetTable;
