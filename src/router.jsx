import {
    createBrowserRouter,
} from "react-router-dom";
import AuthLayout from "./LayOut/AuthLayout";
import Login from "./Page/Login/Login";
import Home from "./Page/Home/Home";
import DashboardLayout from "./LayOut/DashboardLayout";
import AppointmentForm from "./Dashboard/Appointment/Appointment";
import PatientList from "./Dashboard/PatientList/PatientList";
import ProfileSettings from "./Dashboard/ProfileSettings/ProfileSettings";
import AppointmentDetails from "./Dashboard/AppointmentDetails/AppointmentDetails";
import PatientSearchForm from "./Dashboard/Demo/PatientSearchForm";


const router = createBrowserRouter([
    {
        path: "/",
        Component: AuthLayout,
        children: [
            {
                path:"/login",
                Component: Login,
            }
        ]
    },
    {
        path: "/Dashboard",
        Component: DashboardLayout,
        children: [
            {
                index: true,
                Component: Home,
            },
            {
                path:"appointment",
                Component: AppointmentForm
                
            },
            {
                path:"patientlist",
                Component: PatientList,
                
            },
            {
                path:"profileSetting",
                Component: ProfileSettings
                
            },
            {
                path:"appointment/:id/:name",
                Component: AppointmentDetails,
                
            },
            {
                path:"patientlist/:id/:name",
                Component: AppointmentDetails,
                
            },
            {
                path:"search",
                Component: PatientSearchForm
                
            },
        ]
    },
]);


export default router;