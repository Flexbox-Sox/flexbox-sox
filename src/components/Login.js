import React from 'react';
import { Link, useHistory } from 'react-router-dom';
const API_URL = 'http://localhost:3000/api'


const Login = (props) => {
    const {  setUserName, setToken, setLogText } = props;
    const history = useHistory()
    
    const submitLogin = async (event) => {
        const userNameInput = document.getElementById('login-username').value;
        const password1Input = document.getElementById('login-password').value;
        event.preventDefault();
        
        let userData = {
            username: userNameInput,
            password: password1Input
        };
        
        await getUserToken(userData)
    }
    
    const getUserToken = async (userData) => {
        console.log("This is login User data", userData)
         await fetch(`${API_URL}/users/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: {
                    username: userData.username,
                    password: userData.password
                }
            })
        }).then(response => response.json())
        .then(result => {
            if (!result.error) {
                setToken(result.token)
                setUserName(result.user.username)
                setLogText("LOGOUT")
                history.push("/")

                console.log(result)
            } else {
               console.log(result)
            }
        })
        .catch(console.error)
    }

    return (
        <div className="login">
            <h1>LOGIN</h1>
            <div id='login-container'>
                <form id='login-form'>
                    <div className='inputs'>
                        <label>Username:</label>
                        <input id='login-username' type='text' placeholder="Enter Username" required></input>
                        <br />
                        <label>Password:</label>
                        <input id='login-password' type='password' placeholder="Enter Password" required></input>
                        <br />
                    </div>
                    <div className='submit-button'>
                        <button type="submit" onClick={submitLogin}>SUBMIT</button>
                    </div>
                </form>
                <div id="register-link-container">
                    <Link to="/register" id="register-link">Click here to register!</Link>
                </div>
            </div>
        </div>
    )
}

export default Login;