import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";


const Logout = (props) => {
    const { setToken, setUserName, setLogText, setAlert, setAdmin } = props;
    const history = useHistory();

    useEffect(() => {
        setToken("");
        setUserName("");
        setAdmin(false);
        setLogText("LOGIN")
        history.push('/')
        setAlert("You have logged out.")
    },[])

    return (<h1>Logout Page</h1>)
}

export default Logout;