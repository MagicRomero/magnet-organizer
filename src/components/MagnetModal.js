import React, { Fragment, useEffect, useState } from "react";
import shortid from "shortid";

import DateFnsUtils from "@date-io/date-fns";
import {
  Modal,
  Fade,
  Backdrop,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Input,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  CardActionArea,
} from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import { saveImageToLocalPath } from "../utils";

const MagnetModal = ({
  isOpen,
  handleShowModal,
  handleSubmit,
  selectedMagnet,
}) => {
  useEffect(() => {
    setForm(selectedMagnet);
    setUploadedFile(null);
  }, [selectedMagnet]);

  const [form, setForm] = useState(selectedMagnet);
  const [file, setUploadedFile] = useState(null);

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

  const handleImageUpload = (event) => {
    if (event.target.files[0]) {
      const uploadedFile = event.target.files[0];
      const src = URL.createObjectURL(uploadedFile);

      setUploadedFile({
        data: uploadedFile,
        src,
      });
      setForm({
        ...form,
        image: src,
      });
    } else {
      URL.revokeObjectURL(file.src);
      setUploadedFile(null);
      setForm({
        ...form,
        image: null,
      });
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (file) {
      saveImageToLocalPath(file);
    }

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
        <Paper style={{ width: 600, padding: "2.5em", height: "auto" }}>
          <form onSubmit={handleFormSubmit} noValidate autoComplete="off">
            <FormControl fullWidth>
              <InputLabel htmlFor="name">Nombre iman</InputLabel>
              <Input
                autoFocus
                autoComplete="off"
                onChange={handleInputChange}
                value={form.name}
                name="name"
                id="name"
                aria-describedby="magnet-name"
                type="text"
              />
            </FormControl>

            <FormControl
              fullWidth
              style={{ marginBottom: "1em", padding: "1.5em" }}
            >
              {file ? (
                <Card>
                  <CardActionArea>
                    <CardMedia
                      style={{ height: "200" }}
                      src={file.src}
                      title={file.data.name}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="h2">
                        {file.data.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <Button
                      onClick={() => {
                        URL.revokeObjectURL(file.src);
                        setUploadedFile(null);
                      }}
                      size="small"
                      color="secondary"
                    >
                      Quitar imagen
                    </Button>
                  </CardActions>
                </Card>
              ) : (
                <Fragment>
                  <Input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="upload-image"
                    type="file"
                    onChange={handleImageUpload}
                  />
                  <InputLabel htmlFor="upload-image">
                    <Button
                      variant="contained"
                      color="primary"
                      component="span"
                      startIcon={<PhotoCamera />}
                    >
                      Subir imagen
                    </Button>
                  </InputLabel>
                </Fragment>
              )}
            </FormControl>

            <FormControl fullWidth style={{ margin: "1em" }}>
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
              fullWidth
              style={{ marginTop: "1em" }}
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
