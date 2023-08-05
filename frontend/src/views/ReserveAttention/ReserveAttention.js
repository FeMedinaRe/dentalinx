import React, { useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import axios from "axios";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";
import { Button, Icon, IconButton } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import DeleteIcon from "@material-ui/icons/Delete";
import Add from "@material-ui/icons/Add";
import Remove from "@material-ui/icons/Remove";
import EditIcon from "@material-ui/icons/Edit";

// Estilos de la página
const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover": {
      color: "#FFFFFF",
    },
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
  inputContainer: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  input: {
    padding: "8px",
    borderRadius: "4px",
    border: `1px solid`,
    marginRight: "20px", // Espacio a la derecha del input
    fontSize: "14px",
    color: "#777",
    outline: "none",
    "&::placeholder": {
      color: "#777",
    },
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
  },
};

// Aplicamos los estilos
const useStyles = makeStyles(styles);

// Para aplicar filtro de búsqueda
const filtro = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

export default function TableList() {
  const [tableData, setTableData] = useState([]);
  const [datos, setDatos] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // Campos de la tabla
  const columns = [
    // {
    //   accessorKey: "_id",
    //   header: () => <span>Id Cita</span>,
    // },
    {
      accessorKey: "paciente_id",
      header: () => <span>Nombre Paciente</span>,
    },
    {
      accessorKey: "dentista_id",
      header: () => <span>Dentista</span>,
    },
    {
      accessorKey: "tratamiento_id",
      header: () => <span>Tratamiento</span>,
    },
    {
      accessorKey: "fecha",
      header: () => <span>Fecha</span>,
    },
    {
        accessorKey: "hora",
        header: () => <span>Hora</span>,
      },
    {
        accessorKey: "estado",
        header: () => <span>Estado</span>,
      },
  ];

  const [openCitaEliminar, setOpenCitaEliminar] = useState(false);
  const [openCitaEditar, setOpenCitaEditar] = useState(false);
  const [openCitaAgregar, setOpenCitaAgregar] = useState(false);
  const [categoria, setCategoria] = useState([]);

  const [optionPaciente, setOptionPaciente] = useState([]);
  const [optionDentista, setOptionDentista] = useState([]);
  const [optionTratamiento, setOptionTratamiento] = useState([]);
  const [selectedOptionPaciente, setSelectedOptionPaciente] = useState('');

  //Conexión a la base de datos, se realiza la solicitud HTTP al servidor
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/citas");
        setTableData(response.data);

        //Sacamos los nombres de los pacientes y lo agregamos a fetchedOptions
        const fetchedOptions  = [
          ...new Set(response.data.map((item) => item.paciente_id)),
        ];
        
       setOptionPaciente(fetchedOptions);

        //Sacamos los nombres de los dentistas y lo agregamos a fetchedOptionDentista
        const fetchedOptionDentista  = [
          ...new Set(response.data.map((item) => item.dentista_id)),
        ];
        setOptionDentista(fetchedOptionDentista);

        //Sacamos los nombres de los tratamientos y lo agregamos a fetchedOptionTratamiento
        const fetchedOptionTratamiento  = [
          ...new Set(response.data.map((item) => item.tratamiento_id)),
        ];
        setOptionTratamiento(fetchedOptionTratamiento);


        
        setDatos(response.data);

      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  // Como se comportan las tablas
  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: filtro,
  });

  // Para aplicar los estilos 
  const classes = useStyles();

  // useState de la Cita medica
  const [editCitaMedica, setEditCitaMedica] = useState({
    paciente_id: "",
    dentista_id:"",
    tratamiento_id:"",
    fecha: "",
    hora: "",
    estado: "",
  });

  const onCambio = (e) => {
    setEditCitaMedica({
      ...editCitaMedica,
      [e.target.name]: e.target.value,
    });
  };

  const dialogEditar = (event, row) => {
    setEditCitaMedica({
      _id: row.original._id,
      paciente_id: row.original.paciente_id,
      dentista_id: row.original.dentista_id,
      tratamiento_id: row.original.tratamiento_id,
      fecha: row.original.fecha,
      hora: row.original.hora,
      estado: row.original.estado,
    });
  };

  const [citaCrear, setCitaCrear] = useState({
    paciente_id: "",
    dentista_id: "",
    tratamiento_id: "",
    fecha: "",
    hora: "",
    estado: "",
  })

  const crear = async (event) => {
    console.log(citaCrear);
    try {
      const response = await axios.post("http://localhost:3001/api/cita",citaCrear
      );
      setOpenCitaAgregar(false);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      setError("Ocurrió un error al crear la cita.");
    }
  };

  //Para almacenar los datos de la cita a eliminar
  const [citaEliminar, setCitaEliminar] = useState({
    nombre: "",
    fecha: "",
    hora: "",
    estado: "",
  });

  // Actualiza la constante citaEliminar con los valores de la cita a eliminar
  const dialogEliminar = (row) => {
    setCitaEliminar({
      _id: row.original._id,
      fecha: row.original.fecha,
      hora: row.original.hora,
      estado: row.original.estado,
    });
  };

  //Función de eliminar
  const handleDeleteRow = async (event) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/api/deleteCita/${citaEliminar._id}`,
        citaEliminar
      );

      setOpenCitaEliminar(false);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {}
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCitaCrear({ ...citaCrear, [name]: value });
  };

  const [error, setError] = useState(null);

  const handleSubmit = async (event, rowID) => {
    console.log(pacienteEdit._id);
    try {
      const response = await axios.put(
        `http://localhost:3001/api/paciente/${editCitaMedica._id}`,
        // editCitaMedica
      );
      setopenCitaEditar(false);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      setError("Ocurrió un error al actualizar los datos del paciente.");
    }
  };

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}> Citas Agendadas</h4>
            <div> Total de citas agendadas: {tableData.length} </div>
          </CardHeader>
          <CardBody>
            <div className={classes.inputContainer}>

            {/*SECCION AGREGAR*/}
            <Button
                color="primary"
                onClick={(event) => {
                  setOpenCitaAgregar(true);
                }}
              >
                <Add />
              </Button>
              <Dialog disableEnforceFocus open={openCitaAgregar} onClose={() => setOpenCitaAgregar(true)}>
                <DialogTitle style={{ textAlign: "center" }}>
                  {" "}
                  Reservar atención{" "}
                </DialogTitle>
                <DialogContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Paciente</InputLabel>
                            <Select name="paciente_id" 
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              defaultValue = ""
                              onChange={handleChange}
                              >
                                {optionPaciente.map((option,id) => (

                                    <MenuItem key={id} value={option}>
                                      {option}
                                    </MenuItem>)
                                )}
                            </Select>
                    </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Dentista</InputLabel>
                            <Select name="dentista_id" 
                              labelId="demo-simple-select-helper-label"
                              id="demo-simple-select-helper"
                              defaultValue=""
                              onChange={handleChange}>
                                {optionDentista.map((option,id) => (
                                  <MenuItem key={id} value={option}>
                                   {option}
                                  </MenuItem>)
                                  )}
                            </Select>
                    </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Tratamiento</InputLabel>
                            <Select name="tratamiento_id" 
                              labelId="demo-simple-select-helper-label"
                              id="demo-simple-select-helper"
                              defaultValue=""
                              onChange={handleChange}>
                                {optionTratamiento.map((option,id) => (
                                    <MenuItem key={id} value={option}>
                                      {option}
                                    </MenuItem>)
                                )}
                            </Select>
                    </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField          
                        fullWidth
                        label="Fecha"
                        name="fecha"
                        variant="outlined"
                        defaultValue=""
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        
                        fullWidth
                        label="Hora"
                        name="hora"
                        variant="outlined"
                        defaultValue=""
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        
                        fullWidth
                        label="Estado"
                        name="estado"
                        variant="outlined"
                        defaultValue=""
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>{" "}
                  {error && (
                    <DialogContentText color="error">
                      {" "}
                      {error}{" "}
                    </DialogContentText>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => {
                      setOpenCitaAgregar(false);
                      setError(null);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={(event) => crear()}
                  >
                    Guardar
                  </Button>
                </DialogActions>
              </Dialog>
              <input
                type="text"
                placeholder="Buscar"
                onChange={(e) => setGlobalFilter(e.target.value)}
                className={classes.input}
              />
            </div>
            <Table>
              <TableHead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableCell key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableCell>
                    ))}
                    <TableCell style={{ textAlign: "right" }}>
                      Acciones
                    </TableCell>
                  </TableRow>
                ))}
              </TableHead>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                    <TableCell className={classes.buttonContainer}>
                      <Button
                        color="secondary"
                        onClick={() => {
                          dialogEliminar(row);
                          setOpenCitaEliminar(true);
                        }}
                      >
                        <DeleteIcon />
                      </Button>
                      <Dialog
                        open={openCitaEliminar}
                        onClose={() => setOpenCitaEliminar(true)}
                      >
                        <DialogTitle>¿Está seguro de eliminar?</DialogTitle>
                        <DialogContent>
                          <Typography variant="body1">
                            Esta acción eliminará permanentemente los datos.
                          </Typography>
                        </DialogContent>
                        <DialogActions>
                          <Button
                            onClick={() => setOpenCitaEliminar(false)}
                            color="secondary"
                          >
                            Cancelar
                          </Button>
                          <Button
                            color="primary"
                            style={{ color: "white", backgroundColor: "red" }}
                            onClick={(event) => handleDeleteRow(event)}
                          >
                            Eliminar
                          </Button>
                        </DialogActions>
                      </Dialog>

                      {/*SECCION EDITAR*/}
                      <Button
                        color="primary"
                        onClick={(event) => {
                          dialogEditar(event, row);
                          setOpenCitaEditar(true);
                        }}
                      >
                        <EditIcon />
                      </Button>
                      <Dialog disableEnforceFocus open={openCitaEditar} onClose={() => setOpenCitaEditar(true)}>
                        <DialogTitle>Editar Cita</DialogTitle>
                        <DialogContent>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              
                              <FormControl fullWidth>
                                  <InputLabel id="demo-simple-select-label">Paciente</InputLabel>
                                      <Select name="paciente_id" 
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        defaultValue = {editCitaMedica.paciente_id}
                                        onChange={onCambio}
                                        >
                                          {optionPaciente.map((option,id) => (

                                              <MenuItem key={id} value={option}>
                                                {option}
                                              </MenuItem>)
                                          )}
                                      </Select>
                              </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                              <FormControl fullWidth>
                                  <InputLabel id="demo-simple-select-label">Dentista</InputLabel>
                                      <Select name="dentista_id" 
                                        labelId="demo-simple-select-helper-label"
                                        id="demo-simple-select-helper"
                                        defaultValue={editCitaMedica.dentista_id}
                                        onChange={onCambio}>
                                          {optionDentista.map((option,id) => (
                                            <MenuItem key={id} value={option}>
                                            {option}
                                            </MenuItem>)
                                            )}
                                      </Select>
                              </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Tratamiento</InputLabel>
                                    <Select name="tratamiento_id" 
                                      labelId="demo-simple-select-helper-label"
                                      id="demo-simple-select-helper"
                                      defaultValue={editCitaMedica.tratamiento_id}
                                      onChange={onCambio}>
                                        {optionTratamiento.map((option,id) => (
                                            <MenuItem key={id} value={option}>
                                              {option}
                                            </MenuItem>)
                                        )}
                                    </Select>
                            </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                            <TextField          
                              fullWidth
                              label="Fecha"
                              name="fecha"
                              variant="outlined"
                              defaultValue={editCitaMedica.fecha}
                              onChange={onCambio}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              
                              fullWidth
                              label="Hora"
                              name="hora"
                              variant="outlined"
                              defaultValue={editCitaMedica.hora}
                              onChange={onCambio}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              
                              fullWidth
                              label="Estado"
                              name="estado"
                              variant="outlined"
                              defaultValue={editCitaMedica.estado}
                              onChange={onCambio}
                            />
                          </Grid>
                          </Grid>{" "}
                          {error && (
                            <DialogContentText color="error">
                              {" "}
                              {error}{" "}
                            </DialogContentText>
                          )}
                        </DialogContent>
                        <DialogActions>
                          <Button
                            onClick={() => {
                              setOpenCitaEditar(false);
                              setError(null);
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button
                            color="primary"
                            variant="contained"
                            onClick={() => Submit()}
                          >
                            Guardar
                          </Button>
                        </DialogActions>
                      </Dialog>


                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
