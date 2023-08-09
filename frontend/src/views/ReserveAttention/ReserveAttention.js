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
import TablePagination from "@material-ui/core/TablePagination";
import Typography from "@material-ui/core/Typography";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";
import { Button, Icon, IconButton } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import DeleteIcon from "@material-ui/icons/Delete";
import Add from "@material-ui/icons/Add";
import Remove from "@material-ui/icons/Remove";
import EditIcon from "@material-ui/icons/Edit";
import moment from 'moment';

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
    marginRight: "20px", 
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
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
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

  const [optionPaciente, setOptionPaciente] = useState([]);
  const [optionDentista, setOptionDentista] = useState([]);
  const [optionTratamiento, setOptionTratamiento] = useState([]);

  //Conexión a la base de datos, se realiza la solicitud HTTP al servidor
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/citas");

        response.data.map((option) => (
          option.fecha = new Date(option.fecha).toLocaleDateString('es-ES')
        )
        )
        setTableData(response.data);

       const responsePaciente = await axios.get("http://localhost:3001/api/citaPacientes");
       const fetchedOptions  = [
        ...new Set(responsePaciente.data.map((item) => item.nombre)),
       ];

       setOptionPaciente(fetchedOptions);

       const responseDentista = await axios.get("http://localhost:3001/api/citaDentistas");

        //Sacamos los nombres de los dentistas y lo agregamos a fetchedOptionDentista
        const fetchedOptionDentista  = [
          ...new Set(responseDentista.data.map((item) => item.nombre)),
        ];
        setOptionDentista(fetchedOptionDentista);

        //Sacamos los nombres de los tratamientos y lo agregamos a fetchedOptionTratamiento

        const responseTratamientos = await axios.get("http://localhost:3001/api/citaTratamientos");

        const fetchedOptionTratamiento  = [
          ...new Set(responseTratamientos.data.map((item) => item.nombre)),
        ];
        setOptionTratamiento(fetchedOptionTratamiento);

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
    state: { globalFilter, pageIndex: currentPage, pageSize
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // Para aplicar los estilos 
  const classes = useStyles();

  const inputDateStyles = {
    width: '99%',
    height: '30px',
    fontSize: '16px',
    padding: '5px 0px 5px 5px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  };

  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const buttonStyle = {
    backgroundColor: hovered ? '#056974' : '#00acc1',
    border: '1px solid #00acc1',
    color: 'white',
    padding: '15px 32px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    cursor: 'pointer',
    float: 'left',
    marginRight: '5px',
    borderRadius: '5px',
    };

  // useState de la Cita medica
  const [editCitaMedica, setEditCitaMedica] = useState({
    paciente_id: "",
    dentista_id:"",
    tratamiento_id:"",
    fecha: "",
    hora: "",
    estado: "",
  });

  const FormateoFecha = (fechaTabla) => {
    const momentDate = moment(fechaTabla, 'DD-MM-YYYY').format('YYYY-MM-DD');
  
  return momentDate;
  }


  const onCambio = (e) => {
    const { name, value } = e.target;
    setEditCitaMedica({ ...editCitaMedica, [name]: value });
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
    if (!citaCrear.fecha || !citaCrear.hora || !citaCrear.estado) {
      setError("Por favor, completa todos los campos antes de crear la cita.");
      return;
    }

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
    paciente_id: "",
    dentista_id: "",
    tratamiento_id: "",
    fecha: "",
    hora: "",
    estado: "",
  });

  // Actualiza la constante citaEliminar con los valores de la cita a eliminar
  const dialogEliminar = (row) => {
    setCitaEliminar({
      _id: row.original._id,
      paciente_id : row.original.paciente_id,
      dentista_id : row.original.dentista_id,
      tratamiento_id : row.original.tratamiento_id,
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
    try {

      const response = await axios.put(
        `http://localhost:3001/api/cita/${editCitaMedica._id}`,
         editCitaMedica
      );
      setOpenCitaEditar(false);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      alert(err);
      setError("Ocurrió un error al actualizar los datos del paciente.");
    }
  };

  const totalPagesWithFivePerPage = Math.ceil(tableData.length / 5);
  // Crear un array de opciones de tamaño de página con múltiplos de 5 hasta llegar a la cantidad total de filas
  const availablePageSizes = Array.from(
    { length: totalPagesWithFivePerPage },
    (_, index) => (index + 1) * 5
  ).filter((size) => size <= tableData.length);

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
            <button
                // color="primary"
                style={buttonStyle}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={(event) => {
                  setOpenCitaAgregar(true);
                }}
              >
                Nueva Cita
                
              </button>
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
                      <input
                        type="date" 
                        required        
                        label="Fecha"
                        name="fecha"
                        variant="outlined"
                        defaultValue=""
                        onChange={handleChange}
                        style = {inputDateStyles}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <input
                        required
                        style={inputDateStyles}                   
                        type="time"
                        label="Hora"
                        name="hora"
                        variant="outlined"
                        defaultValue=""
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Estado</InputLabel>
                        <Select name ="estado" required
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          defaultValue=""
                          onChange={handleChange}
                        >
                          <MenuItem value={"Agendada"}>Agendada</MenuItem>
                          <MenuItem value={"Finalizada"}>Finalizada</MenuItem>
                        </Select>
                      </FormControl>
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
            <TablePagination
              rowsPerPageOptions={availablePageSizes} // Opciones para el tamaño de página
              component="div"
              count={tableData.length} // Total de filas
              rowsPerPage={pageSize} // Tamaño de página actual
              page={currentPage} // Página actual
              onPageChange={(e, newPage) => setCurrentPage(newPage)} // Función para cambiar de página
              onRowsPerPageChange={(e) => {
                setPageSize(parseInt(e.target.value, 10)); // Función para cambiar el tamaño de página
                setCurrentPage(0); // Volver a la página 0 cuando se cambia el tamaño de página
              }}
            />
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
              {table
                  .getRowModel()
                  .rows.slice(
                    currentPage * pageSize,
                    (currentPage + 1) * pageSize
                  ).map((row) => (
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
                        <DialogTitle>¿Está seguro que desea eliminar la cita?</DialogTitle>
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
                            <input
                              type="date" 
                              required        
                              label="Fecha"
                              name="fecha"
                              variant="outlined"
                              defaultValue={FormateoFecha(editCitaMedica.fecha)}
                              onChange={onCambio}
                              style = {inputDateStyles}
                            />
                          </Grid>
                          <Grid item xs={12}>
                          <input
                              type="time" 
                              required        
                              label="Hora"
                              name="hora"
                              variant="outlined"
                              defaultValue={editCitaMedica.hora}
                              onChange={onCambio}
                              style = {inputDateStyles}
                            />
                          </Grid>
                          <Grid item xs={12}>
                          <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Estado</InputLabel>
                        <Select name ="estado"
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          defaultValue={editCitaMedica.estado}
                          onChange={onCambio}
                        >
                          <MenuItem value={"Agendada"}>Agendada</MenuItem>
                          <MenuItem value={"Finalizada"}>Finalizada</MenuItem>
                        </Select>
                      </FormControl>
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
                            onClick={(event) => handleSubmit(event, row)}
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