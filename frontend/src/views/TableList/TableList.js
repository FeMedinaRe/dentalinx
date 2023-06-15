import React, { useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import axios from "axios";

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
};

const useStyles = makeStyles(styles);

export default function TableList() {
  const [tableData, setTableData] = useState([]);

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
  const classes = useStyles();
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Paciente</h4>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="primary"
              tableHead={["Rut", "Nombre", "Edad", "Saldo"]}
              tableData={tableData.map((paciente) => [
                paciente.rut,
                paciente.nombre,
                paciente.edad,
                paciente.saldo,
              ])}
            />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
