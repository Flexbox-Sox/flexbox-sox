import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { addSingleProductToCart } from "../axios-services";

const API_URL = 'http://localhost:3000/api'


const Carts = (props) => {
  const { token, cart, setCart, setAlert } = props;

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
  }, []);

  const addItem = async (event) => {
    if (!event.target.dataset.id) {
        setAlert("Item failed to add, please try again!")
    } else {
        await addSingleProductToCart(event.target.dataset.id, token)
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
    }
  }
  

  return (
    <div>
      <h1>MY CART</h1>
      { cart.items ? <div className='cart-container'>
                {cart.items.map((item, index) => {
                    return(
                    <div className='item' key={index}>
                        <div className='item-info'>
                            <h3>{item.name}</h3>
                            <h3>${item.priceAtPurchase}</h3>
                            <h3>Quantity: {item.quantity}</h3>
                        </div>
                        <div className='item-image'>
                            <img src={item.photo} alt={item.description}/>
                        </div>
                        <div className='item-buttons'>
                            <button className='add-item' data-id={item.productId} onClick={addItem}>ADD ANOTHER</button>
                            <button className='remove-item' data-id={item.productId} onClick={removeItem}>REMOVE ITEM</button>
                        </div>
                    </div>
                )})}
            </div> : <div>Cart is empty!</div>}
          <div>
            <Link to="/checkout">GO TO CHECKOUT</Link>
          </div>
    </div>
  )
};

export default Carts;