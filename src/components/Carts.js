import React, { useEffect } from "react";
//import { useHistory} from 'react-router-dom';
// import '../style/Cart.css';
const API_URL = "http://localhost:3000/api";

const Carts = (props) => {
  const { singleCart, setSingleCart, token } = props;

  useEffect(() => {
    // if(){}

    async function fetchCart() {
      await fetch(`${API_URL}/carts/singleCart`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
        })
        .catch(console.error);
    }
    fetchCart();
  }, []);

  //Here I want to have the purchase button setup
  //   const handlePurchase = async (event) => {
  //     await fetchCart(cartId);
  //     await cartItems(event);
  //   };

  //   //Here I want to have the delete purhcase button to delete cart
  //   const deleteCart = async (event) => {
  //     await deleteCart(event);
  //   };

  return (
    <div>
      <div>
        <h1> This is the items page </h1>
        {/* <button onSubmit={handlePurchase}> Proceed to checkout </button> */}
        {/* <button onSubmit={deleteCart}> Delete Cart </button> */}
      </div>
    </div>
  );
};

export default Carts;
// I want the products to show based on the product you grab first
// need the product information to show in a uniform way (maybe give it an #id for CSS)
// **We can make a component to show the total purchase price for the products in cart
// once we have the product showing then we will need the button to make the purchase
// for each item we will need a handleDelete
// for each item we will need a Qty amount (make it drop down arrow option)
// for each item in the cart there is the price amount

//                 <div>
//                     { singleCart ? <div className='single-cart-items'>{singleCart.map((items, index)=>{return(

//                         <div className='item' key={index}>
//                         <div className='product-info'>
//                             <h3>{items.name}</h3>
//                             <h3>${items.price}</h3>
//                         </div>
//                         <div className='product-image'>
//                             <img src={items.photo} alt={items.description}/>
//                         </div>
//
//

//                 </div> : <div> No items to display</div>

//         )

// {"}"}
