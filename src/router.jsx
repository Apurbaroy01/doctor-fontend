import {
    createBrowserRouter,
} from "react-router-dom";
import AuthLayout from "./LayOut/AuthLayout";
import Login from "./Page/Login/Login";

const router = createBrowserRouter([
    {
        path: "/login",
        Component: AuthLayout,
        children: [
            {
                index: true,
                Component: Login,
            }
        ]
    },
]);


export default router;