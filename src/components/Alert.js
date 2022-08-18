import React from "react";

const Alert = (props) => {
    const { alert } = props;
    
    return (
        <div id="alert-container">
            {alert}
        </div>
    )
};


export const showAlert = () => {
    const removeAlertTimer = () => {
        const removeAlert = () => {
            const alertContainer = document.getElementById('alert-container')
            alertContainer.style.display = 'none';
        }
        setTimeout(removeAlert, 3000)
    }

    const alertContainer = document.getElementById('alert-container');
    alertContainer.style.display = 'block';
    removeAlertTimer();
}

export default Alert;