import React from 'react';
import { useHistory } from 'react-router-dom';
import "../style/checkout.css"
const API_URL = 'http://localhost:3000/api'

const Checkout = (props) => {
    const { setAlert, token, cart } = props;
    const history = useHistory();
    let totalCost = 0.00;
    
    const checkoutProduct = async () => {
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
        <div className='checkout-container'>
            <h1>CHECKOUT</h1>
            <h2>Items</h2>
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
                        <th>{totalCost}</th>
                    </tr>
                    <tr>
                    </tr>
                    </tbody>
                </table>
            </div> : <div>Cart is empty!</div>}
            <br />
            <div>
                <button onClick={() => {history.push('/cart')}}>EDIT CART</button>
                <button onClick={() => {history.push('/')}}>KEEP SHOPPING</button>
            </div>
            <br></br>
            <form id="checkout-form">
                <h2>Payment Information</h2>
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