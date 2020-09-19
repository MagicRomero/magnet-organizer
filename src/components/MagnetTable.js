import React, { Fragment, useState, useEffect } from "react";
import url from "url";
import { formatDistance } from "date-fns";
import MaterialTable from "material-table";
import DatabaseHandler from "../database/DatabaseHandler";
import MagnetModal from "./MagnetModal";
import { downloadImage, getFileName, fetchLocalStoreData } from "../utils";

const MagnetTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [storeData, setStoreData] = useState({
    magnets: [],
    authors: [],
    countries: [],
  });
  const [selectedMagnet, setSelectedMagnet] = useState(undefined);

  useEffect(() => {
    (() => {
      fetchStoreData(["magnets", "authors", "countries"]);
    })();
  }, []);

  const fetchStoreData = async (keys) => {
    const result = await fetchLocalStoreData(keys);
    console.log("RESULT: ", result);
    setStoreData({ ...storeData, ...result });
  };

  const handleMagnetSubmit = (magnet) => {
    selectedMagnet ? updateMagnet(magnet) : addNewMagnet(magnet);
  };

  const addNewMagnet = async (newMagnet) => {
    const new_magnets = storeData.magnets.concat([newMagnet]);

    await DatabaseHandler.setStoreValue("magnets", new_magnets);
    fetchStoreData(["magnets"]);
  };

  const updateMagnet = async (updatedMagnet) => {
    await DatabaseHandler.updateStoreValue("magnets", updatedMagnet);
    fetchStoreData(["magnets"]);
  };

  const deleteMagnet = async (event, magnetToDelete) => {
    if (window.confirm(`¿Quieres borrar el iman "${magnetToDelete.name}"?`)) {
      await DatabaseHandler.deleteStoreValue("magnets", magnetToDelete);
      fetchStoreData(["magnets"]);
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
          {
            title: "Imagen",
            field: "image",
            render: (rowData) => {
              if (rowData.image) {
                return (
                  <img
                    onClick={(event) =>
                      downloadImage(rowData.image, getFileName(rowData.image))
                    }
                    alt={rowData.name}
                    src={url.format({
                      pathname: rowData.image,
                      protocol: "file",
                      slashes: true,
                    })}
                    style={{
                      cursor: "pointer",
                      width: 150,
                      height: "auto",
                    }}
                  />
                );
              }

              return "no image";
            },
          },
          { title: "País", field: "country" },
          { title: "Nombre", field: "name" },
          {
            title: "Persona",
            field: "author",
          },
          {
            title: "Fecha",
            field: "date",
            render: (rowData) => {
              return formatDistance(new Date(rowData.date), new Date(), {
                addSuffix: true,
              });
            },
          },
        ]}
        data={storeData["magnets"]}
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
        handleSubmit={handleMagnetSubmit}
        countries={storeData.countries}
        authors={storeData.authors}
      />
    </div>
  );
};

export default MagnetTable;
