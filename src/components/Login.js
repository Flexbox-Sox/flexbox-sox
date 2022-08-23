import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import "../style/LoginRegister.css"
const API_URL = 'https://flexbox-sox.herokuapp.com/api'

const Login = (props) => {
    const {  setUserName, setToken, setLogText, setAlert, setAdmin } = props;
    const history = useHistory()
    
    const submitLogin = async (event) => {
        const userNameInput = document.getElementById('login-username').value;
        const password1Input = document.getElementById('login-password').value;
        event.preventDefault();
        
        let userData = {
            username: userNameInput,
            password: password1Input
        };
        
        await loginUser(userData)
    }
    
    const loginUser = async (userData) => {
         await fetch(`${API_URL}/users/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: userData.username,
                password: userData.password
            })
        }).then(response => response.json())
        .then(result => {
            if (!result.error) {
                setToken(result.token)
                setUserName(result.user.username)
                setAdmin(result.user.isAdmin)
                setLogText("LOGOUT")
                history.push("/")
                setAlert(result.message)
            } else {
                setAlert(result.error.message)
            }
        })
        .catch(console.error)
    }

    return (
        <div className="login-page-container">
            <h1>LOGIN</h1>
            <div id='login-container'>
                <form className='login-register-form'>
                    <div className='inputs'>
                        <label>Username:</label>
                        <input id='login-username' type='text' placeholder="Enter Username" required></input>
                        <br />
                        <label>Password:</label>
                        <input id='login-password' type='password' placeholder="Enter Password" required></input>
                        <br />
                    </div>
                    <div id="register-link-container">
                        <Link to="/register" id="register-link">Need an account? Click here to register!</Link>
                    </div>
                    <div className='submit-button' >
                        <button type="submit" onClick={submitLogin}>SUBMIT</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;