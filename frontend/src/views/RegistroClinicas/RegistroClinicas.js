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

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
//import "./DatePickerStyles.css";

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
    nombreClinica: "",
    rutClinica: "",
    direccionClinica: "",
    correoClinica: "",
    telefono: "",
    rutDueno: "",
  });



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
        "http://localhost:3001/api/clinica",
        values
      );

      if (response.status === 201) {
        Swal.fire({
          title: "Clinica Guardada",
          text: "La clinica ha sido guardado exitosamente",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
        setTimeout(() => {
          window.location.reload();
        }, 2500);
      }
    } catch (err) {
      // Mostrar el mensaje de error con Swal.fire
      console.log(err.response.data.message);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response.data.message,
      });
    }
  };
  const classes = useStyles();
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary" position="relative">
              <h4 className={classes.cardTitleWhite}>Registar Clinica Dental</h4>
            </CardHeader>
            <CardBody>
              <Box display="flex" height="100%" marginTop={3}>
                <GridItem item xs={12} sm={6} md={4}>
                  <TextField
                    label="Nombre Clinica"
                    id="nombreClinica"
                    type="text"
                    fullWidth
                    onChange={onChange}
                  />
                </GridItem>
                <GridItem item xs={12} sm={6} md={4}>
                  <TextField
                    label="Rut Clinica"
                    id="rutClinica"
                    type="text"
                    onChange={onChange}
                    fullWidth
                  />
                </GridItem>
              </Box>
              <Box display="flex" height="100%" marginTop={5}>
                <GridItem xs={12} sm={12} md={4}>
                  <TextField
                    label="Correo Clinica"
                    id="correoClinica"
                    type="text"
                    onChange={onChange}
                    fullWidth
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <TextField
                    label="Rut Dueño"
                    id="rutDueno"
                    type="text"
                    onChange={onChange}
                    fullWidth
                  />
                </GridItem>
                <GridItem item xs={12} sm={6} md={4}>
                  <TextField
                    label="Telefono"
                    id="telefono"
                    type="text"
                    onChange={onChange}
                    fullWidth
                  />
                </GridItem>
              </Box>
              <Box display="flex" height="100%" marginTop={3}></Box>
              <Box display="flex" height="100%" marginTop={3}>
                <GridItem xs={12} sm={12} md={5}>
                  <InputLabel>Direccion</InputLabel>
                  <TextField
                    id="direccionClinica"
                    type="text"
                    onChange={onChange}
                    multiline
                    fullWidth
                    inputProps={{
                      multiline: true,
                      rows: 2,
                    }}
                  />
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
