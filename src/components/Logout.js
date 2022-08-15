import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";


const Logout = (props) => {
    const { setToken, setUserName, setLogText } = props;
    const history = useHistory();

    useEffect(() => {
        setToken("");
        setUserName("");
        setLogText("LOGIN")
        history.push('/')
    },[])

    return (<h1>Logout Page</h1>)
}

export default Logout;