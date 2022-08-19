import React from 'react';
import "../style/checkout.css"
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
            <form id="checkout-form">
                <div className="inputs">
                  <label>Card Holder Name:</label>
                  <input id="nameOnCard" type="text" placeholder="Enter Name" required></input>
                  <br />
                  <label>Card Number:</label>
                  <input id="cardNumber" type="text" placeholder="Enter Card Number" required></input>
                  <br />
                  <label>CCV:</label>
                  <input id="CCV" type="text" placeholder="Enter CCV" required></input>
                  <br />
                  <label>Address:</label>
                    <textarea className="address" rows={1} cols={40}
                        placeholder='Enter Adress Here'>
                     </textarea>
                    <br />
                </div>
                <div>
                    <button className='purchaseButton' type="submit" onClick={checkoutProduct}>BUY NOW!</button>
                </div>
                
              </form>
            
        </div>
    )
}

export default Checkout;