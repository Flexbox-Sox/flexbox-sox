import React from "react";
// import Products from "./Products";
//import { useHistory} from 'react-router-dom';
// import '../style/Cart.css';
const API_URL = 'http://localhost:3000/api'


const Carts=()=>{
    
   

    
    const cartItems=async(/*products*/)=>{
        await fetch(`${API_URL}/cartItems/products`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                // cartItems:products
                // productId
            })
        })    
    } 
    

        // const fetchSingleProduct =(product)=>{
        //     try {
        //         const { data } = await axios.get(`api/carts/singleCart/${cartId}`)
        //         return data;
        //       } catch (error) {
        //         console.log(error);
        //     }
        // }


        //Here I want to have the purchase button setup
        const handlePurchase = async(event)=>{

            await cartItems(event)
        }

        //Here I want to have the delete purhcase button to delete cart
        const deletePurchase = async(event) =>{

            await deletePurchase(event)
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
                    <div className='cartItems-for-Purchase'>
                        {/* { singleProduct ? <div>
        <div className='single-item-info'>
            <h2>{singleProduct.name}</h2>
            <h2>{singleProduct.price}</h2>
            <p>{singleProduct.description}</p>
        
        </div>
        <div className='single-product-image'>
            <img src={singleProduct.photo} alt={singleProduct.description} /> */}
                    </div>
                    {/* </div> : <div>This product does not exist</div>} */}
                    <div>
                    <ul>Product Items that arranged for purchase</ul>
                    <button onSubmit={handlePurchase}> Proceed to checkout </button>
                    <button onSubmit={deletePurchase}> Delete Cart </button>
                </div>
                    

            </div>
        ) 

}

export default Carts; 