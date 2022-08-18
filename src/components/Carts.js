import React, { useEffect } from "react";
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

  //Here I want to have the purchase button setup
  //   const checkout = async (event) => {
  //   };

  //   //Here I want to have the delete purhcase button to delete cart
  //   const deleteCart = async (event) => {
  //   };

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
                            <button className='add-item' data-id={item.cartItemId}>ADD ANOTHER</button>
                            <button className='remove-item'>REMOVE ITEM</button>
                        </div>
                    </div>
                )})}
            </div> : <div>Cart is empty!</div>}
          <div>
            <button>CHECKOUT</button>
          </div>
    </div>
  )
};

export default Carts;