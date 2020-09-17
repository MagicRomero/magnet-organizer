import React, { useEffect, useState } from "react";
import shortid from "shortid";

import DateFnsUtils from "@date-io/date-fns";
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
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import PhotoCamera from "@material-ui/icons/PhotoCamera";

const MagnetModal = ({
  isOpen,
  handleShowModal,
  handleSubmit,
  selectedMagnet,
}) => {
  useEffect(() => {
    setForm(selectedMagnet);
  }, [selectedMagnet]);

  const [form, setForm] = useState(selectedMagnet);

  const handleInputChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleDateChange = (date) => {
    setForm({
      ...form,
      date: new Date(date).toJSON(),
    });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    handleSubmit(form);
    handleShowModal(false);
  };

  return (
    <Modal
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      aria-labelledby="new-magnet"
      aria-describedby="new-magnet-action"
      onClose={handleShowModal}
      open={isOpen}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={isOpen}>
        <Paper style={{ width: 400, padding: "2em", height: "auto" }}>
          <form onSubmit={handleFormSubmit} noValidate autoComplete="off">
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
  );
};

MagnetModal.defaultProps = {
  selectedMagnet: {
    id: shortid.generate(),
    name: "",
    date: new Date().toJSON(),
    image: null,
  },
};

export default MagnetModal;
