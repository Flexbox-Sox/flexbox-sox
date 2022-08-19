import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { logoutUser } from "../axios-services";


const Logout = (props) => {
    const { setToken, setUserName, setLogText, setAlert, setAdmin } = props;
    const history = useHistory();

    useEffect(() => {
        setToken("");
        setUserName("");
        setAdmin(false);
        setLogText("LOGIN")
        logoutUser()
        history.push('/')
        setAlert("You have logged out.")
    },[])

    return (<h1>Logout Page</h1>)
}

export default Logout;