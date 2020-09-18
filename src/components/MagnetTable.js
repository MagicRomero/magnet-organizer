import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import DatabaseHandler from "../database/DatabaseHandler";
import MagnetModal from "./MagnetModal";
import { saveAs } from "file-saver";

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
      fetchMagnets();
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

  const downloadImage = (event, magnet) => {
    console.log("magnet data: ", magnet);
    if (magnet.image) {
      saveAs(magnet.image, magnet.name + ".png");
    }
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
          {
            title: "Imagen",
            field: "image",
            render: (rowData) => (
              <img
                onClick={(event) => downloadImage(event, rowData)}
                alt={rowData.name}
                src={rowData.image}
                style={{
                  cursor: "pointer",
                  width: 150,
                  height: "auto",
                }}
              />
            ),
          },
          { title: "Nombre", field: "name" },
          { title: "Fecha", field: "date" },
        ]}
        data={magnets}
        title="Lista de imanes conseguidos"
        options={{
          actionsColumnIndex: -1,
        }}
        localization={{
          header: {
            actions: "Acciones",
          },
          body: {
            emptyDataSourceMessage: "No hay imanes guardados",
          },
          pagination: {
            firstAriaLabel: "Primera página",
            previousAriaLabel: "Anterior",
            nextAriaLabel: "Siguiente",
          },
          toolbar: {
            searchTooltip: "Buscar",
            searchAriaLabel: "Buscar",
            searchPlaceholder: "Buscar...",
          },
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
