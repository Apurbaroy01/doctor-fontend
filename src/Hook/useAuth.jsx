import { useContext } from "react";
import AuthConText from "../Provider/AuthConText";



const useAuth = () => {
    const useAuth = useContext(AuthConText);
    return useAuth;
};

export default useAuth;