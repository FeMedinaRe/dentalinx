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
// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import RegistroPacientes from "views/Registro Pacientes/Registro Pacientes";
import Pacientes from "views/Listado Pacientes/Pacientes";
import Inventario from "views/Inventario/Inventario.js"; // INVENTARIO
import Icons from "views/Icons/Icons.js";
import Maps from "views/Maps/Maps.js";
import NotificationsPage from "views/Notifications/Notifications.js";
import ReserveAttention from "views/ReserveAttention/ReserveAttention.js";
import Profesionales from "views/Profesionales/Profesionales.js";
import Profesional from "views/Profesional/Profesional.js"

// core components/views for RTL layout

const dashboardRoutes = [{
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
        path: "/pacientes",
        name: "Listado Pacientes",
        icon: "content_paste",
        component: Pacientes,
        layout: "/admin",
    },
    {
        path: "/inventario",
        name: "Inventario",
        icon: "content_paste",
        component: Inventario,
        layout: "/admin",
    },
    {
      path: "/profesional",
      name: "Registrar profesional",
      icon: Person,
      component: Profesional,
      layout: "/admin",
    },
    {
      path: "/Profesionales",
      name: "Profesionales",
      icon: LibraryBooks,
      component: Profesionales,
      layout: "/admin",
    },
    {
        path: "/icons",
        name: "Icons",
        icon: BubbleChart,
        component: Icons,
        layout: "/admin",
    },
    {
        path: "/maps",
        name: "Maps",
        icon: LocationOn,
        component: Maps,
        layout: "/admin",
    },
    {
        path: "/notifications",
        name: "Notifications",
        icon: Notifications,
        component: NotificationsPage,
        layout: "/admin",
    },
    {
        path: "/reserveattention",
        name: "Reservar Cita",
        icon: Notifications,
        component: ReserveAttention,
        layout: "/admin",
    },
];

export default dashboardRoutes;