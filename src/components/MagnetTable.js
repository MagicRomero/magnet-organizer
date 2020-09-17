import React, { useState, useEffect } from "react";
import shortid from "shortid";
import {
  Modal,
  Fade,
  Backdrop,
  Paper,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Input,
} from "@material-ui/core";
import MaterialTable from "material-table";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import DatabaseHandler from "../database/DatabaseHandler";

const MagnetTable = () => {
  const [showAddMagnetWindow, setShowMagnetWindow] = useState(false);
  const [magnets, setMagnets] = useState([]);
  const [form, setForm] = useState({
    id: shortid.generate(),
    name: "",
    date: new Date().toJSON(),
    image: null,
  });

  useEffect(() => {
    (async () => {
      const magnets = await DatabaseHandler.getStoreValue("magnets");
      setMagnets(magnets);
    })();
  }, []);

  const addNewMagnet = async (event) => {
    event.preventDefault();

    const new_magnets = magnets.concat([form]);

    console.log(new_magnets);

    await DatabaseHandler.setStoreValue("magnets", new_magnets);

    setMagnets(new_magnets);
    setForm({
      id: shortid.generate(),
      name: "",
      date: new Date().toJSON(),
      image: null,
    });
    setShowMagnetWindow(false);
  };

  const deleteMagnet = async (event, magnetToDelete) => {
    await DatabaseHandler.deleteStoreValue("magnets", magnetToDelete);

    const updatedMagnets = magnets.filter(
      (magnet) => magnet.id !== magnetToDelete.id
    );

    setMagnets(updatedMagnets);
  };

  const handleInputChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleDateChange = (date) => {
    setForm({
      ...form,
      date,
    });
  };

  const showAddAction = (event) => setShowMagnetWindow(!showAddMagnetWindow);

  return (
    <div style={{ maxWidth: "100%" }}>
      <MaterialTable
        actions={[
          {
            icon: "add",
            tooltip: "Añadir iman",
            isFreeAction: true,
            onClick: showAddAction,
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
      />
      <Modal
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-labelledby="new-magnet"
        aria-describedby="new-magnet-action"
        onClose={showAddAction}
        open={showAddMagnetWindow}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={showAddMagnetWindow}>
          <Paper style={{ width: 400, padding: "2em", height: "auto" }}>
            <form onSubmit={addNewMagnet} noValidate autoComplete="off">
              <FormControl fullWidth>
                <InputLabel htmlFor="name">Nombre iman</InputLabel>
                <Input
                  onChange={handleInputChange}
                  value={form.name}
                  name="name"
                  id="name"
                  aria-describedby="magnet-name"
                  type="text"
                />
              </FormControl>

              <FormControl>
                <InputLabel htmlFor="magnet-image">
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                  >
                    <PhotoCamera />
                  </IconButton>
                </InputLabel>
                <Input
                  name="image"
                  type="file"
                  id="magnet-image"
                  accept="image/*"
                  style={{ display: "none" }}
                />
              </FormControl>

              <FormControl fullWidth>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    name="date"
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label="Date picker inline"
                    value={form.date}
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </MuiPickersUtilsProvider>
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                size="medium"
                type="submit"
              >
                Guardar
              </Button>
            </form>
          </Paper>
        </Fade>
      </Modal>
    </div>
  );
};

export default MagnetTable;
