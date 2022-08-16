import React from "react";
//import { useHistory} from 'react-router-dom';
// import '../style/Cart.css';
const API_URL = 'http://localhost:3000/api'





const Carts=()=>{
    // const {} = useHistory('');

    const handlePurchase = async(event)=>{

        await cartItems(event)
    }

    //Can access information through fetch commands
    // We need to fetch: the cart information, item information (which carries the db functions) 
    const cartItems = async () =>{
        await fetch(`${API_URL}/cartItems/products`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: userData.username,
                password: userData.password
            })
        })

        
    }
    return (
        // I want the products to show based on the product you grab first
        // need the product information to show in a uniform way (maybe give it an #id for CSS)
        // **We can make a component to show the total purchase price for the products in cart
        // once we have the product showing then we will need the button to make the purchase
        // for each item we will need a handleDelete 
        // for each item we will need a Qty amount (make it drop down arrow option)
        // for each item in the cart there is the price amount
        <div>
        <h1> This is the carts Page for the items</h1>
            <div>
                <ul>Product Items that arranged for purchase</ul>
                <button onSubmit={handlePurchase}> Proceed to checkout </button>
            </div>
        </div>
    ) 

}

export default Carts; 