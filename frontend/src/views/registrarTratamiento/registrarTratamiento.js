import React, { useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import avatar from "assets/img/faces/marc.jpg";
import axios from "axios";
import Box from "@material-ui/core/Box";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { TextFields } from "@material-ui/icons";

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
};

const useStyles = makeStyles(styles);

export default function UserProfile() {
  const [values, setValues] = useState({
    nombre: "",
    rut: "",
    direccion: "",
    edad: "",
    saldo: "",
    correo: "",
    sexo: "",
  });

  const updateSelect = (e) => {
    values.sexo = e.target.value;
  };

  const onChange = (e) => {
    e.preventDefault();
    setValues({
      ...values,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(values);
    try {
      const response = await axios.post(
        "http://localhost:3001/api/paciente",
        values
      );

      if (response.status === 201) {
        Swal.fire({
          title: "Paciente Guardado",
          text: "El paciente ha sido guardado exitosamente",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
        setTimeout(() => {
          window.location.reload();
        }, 2500);
      }
    } catch (err) {
      Swal.fire({
        title: "Error al Guardar",
        text: "Hubo un error al guardar al paciente.Inténtalo nuevamente",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  const classes = useStyles();
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Registar Tratamiento al paciente</h4>
            </CardHeader>
            <CardBody>
              <Box display="flex" height="100%" marginTop={3}>
                <GridItem item xs={12} sm={6} md={4}>
                  <TextField
                    label="Nombre del Tratamiento"
                    id="nombre"
                    type="text"
                    fullWidth
                    onChange={onChange}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <TextField
                    label="Descripción"
                    id="direccion"
                    onChange={onChange}
                    fullWidth
                  />
                </GridItem>
                <GridItem item xs={12} sm={6} md={2}>
                  <TextField
                    label="Costo"
                    id="rut"
                    type="text"
                    onChange={onChange}
                    fullWidth
                  />
                </GridItem>
              </Box>
              <Box display="flex" height="100%" marginTop={3}>
                <GridItem xs={12} sm={12} md={3}>
                  <TextField
                    label="Número de Sesiones"
                    id="edad"
                    type="number"
                    onChange={onChange}
                    min={10}
                    max={20}
                    fullWidth
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <InputLabel>Paciente</InputLabel>
                  <Select label="Paciente" onChange={updateSelect} fullWidth>
                    <MenuItem value="Masculino">Masculino</MenuItem>
                    <MenuItem value="Femenino">Femenino</MenuItem>
                    <MenuItem value="Otro">Otro</MenuItem>
                  </Select>
                </GridItem>
              </Box>
            </CardBody>
            <CardFooter>
              <Button color="primary" onClick={handleSubmit}>
                Guardar
              </Button>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
