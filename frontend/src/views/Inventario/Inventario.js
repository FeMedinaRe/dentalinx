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
  getFilteredRowModel,
} from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";
import { Button, Icon, IconButton } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import DeleteIcon from "@material-ui/icons/Delete";
import Add from "@material-ui/icons/Add";
import Remove from "@material-ui/icons/Remove";
import EditIcon from "@material-ui/icons/Edit";
import TablePagination from "@material-ui/core/TablePagination";
const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": { color: "#FFFFFF" },
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
    "&::placeholder": { color: "#777" },
  },
  buttonContainer: { display: "flex", justifyContent: "flex-end" },
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
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5); // Puedes ajustar el tamaño de página según tu preferencia (por ejemplo, 5, 20, etc.).

  const columns = [
    {
      accessorKey: "nombre",
      header: () => (
        <span>
          {" "}
          <b>PRODUCTO</b>{" "}
        </span>
      ),
    },
    {
      accessorKey: "categoria",
      header: () => (
        <span>
          {" "}
          <b>CATEGORÍA</b>
        </span>
      ),
    },
    {
      accessorKey: "cantidad",
      header: () => (
        <span>
          <b>STOCK</b>
        </span>
      ),
    },
  ];

  const [open, setOpen] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openRemove, setOpenRemove] = useState(false);

  const api = axios.create({
    baseURL: "http://localhost:3001/api/inventario",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get();

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
    state: { globalFilter, pageIndex: currentPage, pageSize },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const classes = useStyles();

  const [inventario, setInventario] = useState({
    nombre: "",
    categoria: "",
    cantidad: "",
  });

  const change = (e) => {
    setInventario({ ...inventario, [e.target.name]: e.target.value });
  };

  const dialog = (row) => {
    setInventario({
      _id: row.original._id,
      nombre: row.original.nombre,
      categoria: row.original.categoria,
      cantidad: row.original.cantidad,
    });
  };

  const Create = async () => {
    try {
      const response = await api.post(`/`, inventario);
      setOpenCreate(false);
      setTimeout(() => {
        window.location.reload();
      });
    } catch (err) {
      setError("Ocurrió un error al actualizar los datos del paciente.");
    }
  };

  const Delete = async () => {
    try {
      const response = await api.delete(`/${inventario._id}`);
      setOpenDelete(false);
      setTimeout(() => {
        window.location.reload();
      });
    } catch (error) {}
  };

  const [error, setError] = useState(null);

  const update = async (action) => {
    try {
      alert(action);
      const response = await api.put(`Action/${action}`, inventario);
      setOpenUpdate(false);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      setError("Error");
    }
  };

  const Submit = async () => {
    try {
      alert(inventario._id);
      const response = await axios.put(
        `http://localhost:3001/api/inventario/${inventario._id}`,
        inventario
      );
      setOpenUpdate(false);
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
            <h4 className={classes.cardTitleWhite}> Inventario</h4>
            <div> Total de productos: {tableData.length} </div>
          </CardHeader>
          <CardBody>
            <div className={classes.inputContainer}>
              <Button
                color="primary"
                onClick={() => {
                  setOpenRemove(true);
                }}
              >
                <Remove />
              </Button>
              <Dialog open={openRemove} onClose={() => setOpenRemove(true)}>
                <DialogTitle style={{ textAlign: "center" }}>
                  {" "}
                  QUITAR{" "}
                </DialogTitle>
                <DialogContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        autoFocus
                        fullWidth
                        label="Producto"
                        name="nombre"
                        variant="outlined"
                        defaultValue=""
                        onChange={change}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        autoFocus
                        fullWidth
                        label="Categoria"
                        name="categoria"
                        variant="outlined"
                        defaultValue=""
                        onChange={change}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Cantidad"
                        name="cantidad"
                        variant="outlined"
                        defaultValue=""
                        onChange={change}
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
                      setOpenRemove(false);
                      setError(null);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => update("remove")}
                  >
                    Guardar
                  </Button>
                </DialogActions>
              </Dialog>

              <Button
                color="primary"
                onClick={() => {
                  setOpenCreate(true);
                }}
              >
                <Add />
              </Button>
              <Dialog open={openCreate} onClose={() => setOpenCreate(true)}>
                <DialogTitle style={{ textAlign: "center" }}>
                  {" "}
                  AÑADIR{" "}
                </DialogTitle>
                <DialogContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        autoFocus
                        fullWidth
                        label="Producto"
                        name="nombre"
                        variant="outlined"
                        defaultValue=""
                        onChange={change}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        autoFocus
                        fullWidth
                        label="Categoria"
                        name="categoria"
                        variant="outlined"
                        defaultValue=""
                        onChange={change}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Cantidad"
                        name="cantidad"
                        variant="outlined"
                        defaultValue=""
                        onChange={change}
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
                      setOpenCreate(false);
                      setError(null);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => Create()}
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
            {/* Agrega los botones de paginación */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 20]} // Opciones para el tamaño de página
              component="div"
              count={tableData.length} // Total de filas
              rowsPerPage={pageSize} // Tamaño de página actual
              page={currentPage} // Página actual
              onChangePage={(e, newPage) => setCurrentPage(newPage)} // Función para cambiar de página
              onChangeRowsPerPage={(e) => {
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
                    <TableCell style={{ textAlign: "right" }}>accion</TableCell>
                  </TableRow>
                ))}
              </TableHead>
              <TableBody>
                {table
                  .getRowModel()
                  .rows.slice(
                    currentPage * pageSize,
                    (currentPage + 1) * pageSize
                  )
                  .map((row) => (
                    <TableRow key={row.id} onClick={() => handleRowClick(row)}>
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
                            dialog(row);
                            setOpenDelete(true);
                          }}
                        >
                          <DeleteIcon />
                        </Button>
                        <Dialog
                          open={openDelete}
                          onClose={() => setOpenDelete(true)}
                        >
                          <DialogTitle>¿Está seguro de eliminar?</DialogTitle>
                          <DialogContent>
                            <Typography variant="body1">
                              {" "}
                              Esta acción eliminará permanentemente los datos.{" "}
                            </Typography>
                          </DialogContent>
                          <DialogActions>
                            <Button
                              onClick={() => setOpenDelete(false)}
                              color="secondary"
                            >
                              Cancelar
                            </Button>
                            <Button
                              color="primary"
                              style={{ color: "white", backgroundColor: "red" }}
                              onClick={() => Delete()}
                            >
                              {" "}
                              Eliminar{" "}
                            </Button>
                          </DialogActions>
                        </Dialog>
                        <Button
                          color="primary"
                          onClick={() => {
                            dialog(row);
                            setOpenUpdate(true);
                          }}
                        >
                          <EditIcon />
                        </Button>
                        <Dialog
                          open={openUpdate}
                          onClose={() => setOpenUpdate(true)}
                        >
                          <DialogTitle>Actualizar Inventario</DialogTitle>
                          <DialogContent>
                            <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <TextField
                                  autoFocus
                                  fullWidth
                                  label="Producto"
                                  name="nombre"
                                  variant="outlined"
                                  defaultValue={inventario.nombre}
                                  onChange={change}
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <TextField
                                  autoFocus
                                  fullWidth
                                  label="Categoria"
                                  name="categoria"
                                  variant="outlined"
                                  defaultValue={inventario.categoria}
                                  onChange={change}
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <TextField
                                  fullWidth
                                  label="Cantidad"
                                  name="cantidad"
                                  variant="outlined"
                                  defaultValue={inventario.cantidad}
                                  onChange={change}
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
                                setOpenUpdate(false);
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
