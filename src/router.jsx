import {
    createBrowserRouter,
} from "react-router-dom";
import AuthLayout from "./LayOut/AuthLayout";
import Login from "./Page/Login/Login";
import Home from "./Page/Home/Home";
import DashboardLayout from "./LayOut/DashboardLayout";

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
            }
        ]
    },
]);


export default router;