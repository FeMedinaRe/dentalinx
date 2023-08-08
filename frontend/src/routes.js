/*!

=========================================================
* Material Dashboard React - v1.10.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import BubbleChart from "@material-ui/icons/BubbleChart";
import LocationOn from "@material-ui/icons/LocationOn";
import Notifications from "@material-ui/icons/Notifications";
//core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import RegistroPacientes from "views/Registro Pacientes/Registro Pacientes";
import Pacientes from "views/Listado Pacientes/Pacientes";
import Inventario from "views/Inventario/Inventario.js"; // INVENTARIO
import Typography from "views/Typography/Typography.js";
import Icons from "views/Icons/Icons.js";
import Maps from "views/Maps/Maps.js";
import NotificationsPage from "views/Notifications/Notifications.js";
import registrarTratamiento from "views/registrarTratamiento/registrarTratamiento.js";
import listadoTratamientos from "views/listaTratamientos/listaTratamientos.js";
import Clinicas from "views/ListadoClinicas/Clinicas.js";
import RegistroClinicas from "views/RegistroClinicas/RegistroClinicas";
// core components/views for RTL layout

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin",
  },
  {
    path: "/registroPacientes",
    name: "Registrar Pacientes",
    icon: Person,
    component: RegistroPacientes,
    layout: "/admin",
  }, 
  {
    path: "/registrarTratamiento",
    name: "Registrar Tratamientos",
    icon: LibraryBooks,
    component: registrarTratamiento,
    layout: "/admin",
  }, 
  {
    path: "/table",
    path: "/pacientes",
    name: "Listado Pacientes",
    icon: "content_paste",
    component: Pacientes,
    layout: "/admin",
  },
  {
    path: "/listadoTratamientos",
    name: "Listado Tratamientos",
    icon: "content_paste",
    component: listadoTratamientos,
    layout: "/admin"
  },
  {
    path: "/clinicas",
    name: "Listado Clinicas",
    icon: LocationOn,
    component: Clinicas,
    layout: "/admin",
  },
  {
    path: "/registroClinicas",
    name: "Registro Clinicas",
    icon: LocationOn,
    component: RegistroClinicas,
    layout: "/admin",
  },
  {
    path: "/inventario",
    name: "Inventario",
    icon: "content_paste",
    component: Inventario,
    layout: "/admin",
  }, 
 
];

export default dashboardRoutes;
