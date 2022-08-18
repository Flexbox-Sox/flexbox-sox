import React from 'react';
const API_URL = 'http://localhost:3000/api'

const Checkout = (props) => {
    const { setAlert } = props;
    
    const checkoutProduct = async () => {
        const orderStatus = "completed"
         await fetch(`${API_URL}/carts/singleCart`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
               orderStatus
            })
        }).then(response => response.json())
        .then(result => {
            console.log("This is Result!!!", result)
            if (!result.error) {
                setAlert("Order Purchased! Thank you!")
            } else {
                setAlert(result.error.message)
            }
        })
        .catch(console.error)
    }
    return(
        <div className='checkout-container'>
            <h1>CHECKOUT</h1>
            <br></br>
            <div>
                 <button className='submit-button' type="submit" onClick={checkoutProduct}>BUY NOW!</button>
            </div>
            
        </div>
    )
}

export default Checkout;