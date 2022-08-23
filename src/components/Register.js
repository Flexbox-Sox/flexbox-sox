import React from 'react';
import { useHistory } from "react-router-dom";
import "../style/LoginRegister.css"
const API_URL = 'http://localhost:3000/api'


const Register = (props) => {
    const { setAlert } = props;
    const history = useHistory();
    
    const postUser = async (userData) => {
        await fetch(`${API_URL}/users/register`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: userData.username,
                password: userData.password,
                email: userData.email
            })
        }).then(response => response.json())
        .then(result => {
            if (!result.error) {
                setAlert(result.message)
                history.push("/login")
            } else {
                setAlert(result.error.message)
            }
        })
        .catch(console.error)
    }

    const submitRegistration = async (event) => {
        const usernameInput = document.getElementById('register-username').value;
        const password1Input = document.getElementById('register-password1').value;
        const password2Input = document.getElementById('register-password2').value;
        const emailInput = document.getElementById('register-email').value;

        let userData = {};
        event.preventDefault();
        
        if (usernameInput === "" || password1Input === "" || password2Input === "" || emailInput === "") {
            setAlert("Make sure to fill out each field.");
        } else if (usernameInput.length < 6 || password1Input.length < 8) {
            setAlert("Username must be at least 6 characters long and password must be at least 8 characters long.")
        } else if (password1Input === password2Input) {
            userData = {
                username: usernameInput,
                password: password1Input,
                email: emailInput
            };

            await postUser(userData);
            
        } else {
            setAlert("The passwords you entered do not match, try again!")
        } 
    }

    return (
        <div className='register-page-container'>
            <h1>REGISTER</h1>
            <div id="form-container">
                <form className='login-register-form'>
                    <div className="inputs">
                        <label>Email:</label>
                        <input id='register-email' type='email' placeholder="Email"></input>
                        <br />
                        <label>Username:</label>
                        <input id='register-username' type='text' placeholder="Create a Username"></input>
                        <br />
                        <label>Password:</label>
                        <input id='register-password1' type='password' placeholder="Create a Password"></input>
                        <br />
                        <label>Confirm Password:</label>
                        <input id='register-password2' type='password' placeholder="Confirm Password"></input>
                        <br />
                    </div>
                    <div className="submit-button">
                        <button type="submit" onClick={submitRegistration}>SUBMIT</button>
                    </div>
                </form>
            </div>
        </div>
        
    )
}

export default Register;