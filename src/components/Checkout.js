import React from 'react';
import { useHistory } from 'react-router-dom';
import "../style/Checkout.css"
const API_URL = 'http://localhost:3000/api'

const Checkout = (props) => {
    const { setAlert, token, cart } = props;
    const history = useHistory();
    let totalCost = 0.00;
    
    const checkoutProduct = async (event) => {
        event.preventDefault()
        const orderStatus = "completed"
        if (token) {
            await fetch(`${API_URL}/carts/singleCart`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                   orderStatus
                })
            }).then(response => response.json())
            .then(result => {
                if (!result.error) {
                    setAlert("Order Purchased! Thank you!")
                } else {
                    setAlert(result.error.message)
                }
            })
            .catch(console.error)
        } else {
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
            if (!result.error) {
                setAlert("Order Purchased! Thank you!")
            } else {
                setAlert(result.error.message)
            }
        })
        .catch(console.error)
        }
    }

    return(
        <div className='checkout-page-container'>
            <h1>CHECKOUT</h1>
            <div className='items-container'>
                <h2 className='h2'>Items</h2>
                { cart.items && cart.items.length ? <div className='cartitems-container'>
                    <table>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Quantity</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                        {cart.items.map((item, index) => {
                            totalCost += item.priceAtPurchase * item.quantity;
                            return(
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.priceAtPurchase * item.quantity}</td>
                                </tr>
                        )})}
                        <tr>
                            <th>Total</th>
                            <th>{totalCost.toFixed(2)}</th>
                        </tr>
                        <tr>
                        </tr>
                        </tbody>
                    </table>
                </div> : <div>Cart is empty!</div>}
                <div className='item-buttons'>
                    <button onClick={() => {history.push('/cart')}}>EDIT CART</button>
                    <button onClick={() => {history.push('/')}}>KEEP SHOPPING</button>
                </div>

            </div>
            <br></br>
            <div className='checkout-container'>
                <form id="checkout-form">
                    <h2 className='h2'>Payment Information</h2>
                    <div className="inputs">
                        <label>Card Holder Name:</label>
                        <input id="nameOnCard" type="text" placeholder="Enter Name"></input>
                        <br />
                        <label>Card Number:</label>
                        <input id="cardNumber" type="text" placeholder="Enter Card Number"></input>
                        <br />
                        <label>CCV:</label>
                        <input id="CCV" type="text" placeholder="Enter CCV"></input>
                        <br />
                        <label>Address:</label>
                        <input className="address" placeholder='Enter Adress Here'></input>
                        <br />
                    </div>
                    <br />
                    <div>
                        <button className='purchaseButton' type="submit" onClick={checkoutProduct}>BUY NOW!</button>
                    </div>
                </form> 
            </div>
        </div>
    )
}

export default Checkout;