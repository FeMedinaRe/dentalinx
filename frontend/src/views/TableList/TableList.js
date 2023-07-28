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
import { Button } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
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

const useStyles = makeStyles(styles);

const filtro = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

export default function TableList() {
  const [tableData, setTableData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = [
    {
      accessorKey: "rut",
      header: () => <span>Rut</span>,
    },
    {
      accessorKey: "nombre",
      header: () => <span>Nombre</span>,
    },
    {
      accessorKey: "edad",
      header: () => <span>Edad</span>,
    },
    {
      accessorKey: "saldo",
      header: () => <span>Saldo</span>,
    },
    {
      accessorKey: "direccion",
      header: () => <span>Direccion</span>,
    },
  ];

  const [openEliminar, setOpenEliminar] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/pacientes");
        setTableData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

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
    pagination: true,
  });

  const classes = useStyles();

  const [pacienteEdit, setPacienteEdit] = useState({
    edad: "",
    direccion: "",
    saldo: "",
  });

  const onCambio = (e) => {
    setPacienteEdit({
      ...pacienteEdit,
      [e.target.name]: e.target.value,
    });
  };

  const dialogEditarEliminar = (event, row) => {
    console.log(row.original.nombre);
    setPacienteEdit({
      _id: row.original._id,
      rut: row.original.rut,
      nombre: row.original.nombre,
      edad: row.original.edad,
      direccion: row.original.direccion,
      saldo: row.original.saldo,
    });
  };

  const handleDeleteRow = async () => {
    try {
      axios.delete(
        `http://localhost:3001/api/deletePaciente/${pacienteEdit._id}`
      );
      window.location.reload();
    } catch (error) {
      setError("Ocurrió un error al eliminar al paciente.");
    }
  };

  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    console.log(pacienteEdit);

    if (pacienteEdit.saldo < 0) {
      setError("El saldo es incorrecto");
    }

    if (pacienteEdit.direccion.length < 8) {
      setError("La direccion no contiene los suficientes caracteres");
    }

    if (pacienteEdit.edad < 0 || pacienteEdit.edad > 150) {
      setError("La edad es incorrecta");
    }

    const response = await axios.put(
      `http://localhost:3001/api/paciente/${pacienteEdit._id}`,
      pacienteEdit
    );

    console.log(response.data);
    setOpenEditar(false);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}> Pacientes</h4>
            <div> Total de Pacientes: {tableData.length} </div>
          </CardHeader>
          <CardBody>
            <div className={classes.inputContainer}>
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
                        onClick={(event) => {
                          dialogEditarEliminar(event, row);
                          setOpenEliminar(true);
                        }}
                      >
                        <DeleteIcon />
                      </Button>
                      <Dialog
                        open={openEliminar}
                        onClose={() => setOpenEliminar(true)}
                      >
                        <DialogTitle>¿Está seguro de eliminar?</DialogTitle>
                        <DialogContent>
                          <Typography variant="body1">
                            Esta acción eliminará permanentemente los datos.
                          </Typography>
                        </DialogContent>
                        <DialogActions>
                          <Button
                            onClick={() => {
                              setOpenEliminar(false);
                            }}
                            color="secondary"
                          >
                            Cancelar
                          </Button>
                          <Button
                            color="primary"
                            style={{ color: "white", backgroundColor: "red" }}
                            onClick={() => handleDeleteRow()}
                          >
                            Eliminar
                          </Button>
                        </DialogActions>
                      </Dialog>
                      <Button
                        color="primary"
                        onClick={(event) => {
                          dialogEditarEliminar(event, row);
                          setOpenEditar(true);
                        }}
                      >
                        <EditIcon />
                      </Button>
                      <Dialog
                        open={openEditar}
                        onClose={() => setOpenEditar(true)}
                      >
                        <DialogTitle>Editar Paciente</DialogTitle>
                        <DialogContent>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <TextField
                                autoFocus
                                fullWidth
                                label="Nombre"
                                name="nombre"
                                variant="outlined"
                                defaultValue={pacienteEdit.nombre}
                                InputProps={{
                                  readOnly: true,
                                }}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Rut"
                                name="rut"
                                variant="outlined"
                                defaultValue={pacienteEdit.rut}
                                InputProps={{
                                  readOnly: true,
                                }}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Edad"
                                name="edad"
                                variant="outlined"
                                type="number"
                                defaultValue={pacienteEdit.edad}
                                onChange={onCambio}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Dirección"
                                name="direccion"
                                variant="outlined"
                                defaultValue={pacienteEdit.direccion}
                                onChange={onCambio}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Saldo"
                                name="saldo"
                                type="number"
                                variant="outlined"
                                defaultValue={pacienteEdit.saldo}
                                onChange={onCambio}
                              />
                            </Grid>
                          </Grid>
                          {error && (
                            <DialogContentText color="error">
                              {error}
                            </DialogContentText>
                          )}
                        </DialogContent>
                        <DialogActions>
                          <Button
                            onClick={() => {
                              setOpenEditar(false);
                              setError(null);
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button
                            color="primary"
                            variant="contained"
                            onClick={(event) => {
                              handleSubmit(event, row);
                            }}
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
