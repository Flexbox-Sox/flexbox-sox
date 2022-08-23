import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { addSingleProductToCart } from "../axios-services";
import '../style/Carts.css'

const API_URL = 'http://localhost:3000/api'


const Carts = (props) => {
  const { token, cart, setCart, setAlert, setUpdate, update, userName } = props;

  useEffect(() => {
    async function fetchCart() {
      if (token) {
        await fetch(`${API_URL}/carts/singleCart`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((result) => {
            if (!result.error) {
              setCart(result)
            } else {
              setAlert(result.error.message)
            }
          })
          .catch(console.error);
      } else {
        await fetch(`${API_URL}/carts/singleCart`, {
          method: "GET"
        })
          .then((response) => response.json())
          .then((result) => {
            if (!result.error) {
              setCart(result)
            } else {
              setAlert(result.error.message)
            }
          })
          .catch(console.error);
      }
    }
    
    fetchCart();
  }, [update]);

  const addItem = async (event) => {
    if (!event.target.dataset.id) {
        setAlert("Item failed to add, please try again!")
    } else {
        await addSingleProductToCart(event.target.dataset.id, token)
        setAlert("Added another item!")
        setUpdate(!update)
    }
  }

  const removeItem = async (event) => {
    const productId = event.target.dataset.id;
    if (token) {
        await fetch(`${API_URL}/carts/singleCart/item`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId
        })
      })
      .then(setAlert("Removed a sock"))
      .then(setUpdate(!update))
    } else {
        await fetch(`${API_URL}/carts/singleCart/item`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId
        })
      })
      .then(setAlert("Removed a sock"))
      .then(setUpdate(!update))
    }
  }
  

  return (
    <div className="mycart-container">
      <div className="cart-header">
        {userName ? <h1>{userName}'s CART</h1> : <h1>MY CART</h1>}
        <Link to="/checkout" id="cart-header-link">CHECKOUT</Link>
      </div>
      { cart.items && cart.items.length ? <div className='cart-container'>
                {cart.items.map((item, index) => {
                    return(
                    <div className='item' key={index}>
                        <div className='item-image'>
                            <img src={item.photo} alt={item.description}/>
                        </div>
                        <div className='item-info'>
                            <h3>{item.name}</h3>
                            <h3>${item.priceAtPurchase}</h3>
                            <h3>Quantity: {item.quantity}</h3>
                        </div>
                        <div className='item-buttons'>
                            <button className='add-item' data-id={item.productId} onClick={addItem}>ADD ANOTHER</button>
                            <button className='remove-item' data-id={item.productId} onClick={removeItem}>REMOVE ITEM</button>
                        </div>
                    </div>
                )})}
            </div> : <div className="text">Cart is empty!</div>}
          <br />
    </div>
  )
};

export default Carts;