import React from "react";
import React from 'react';
import { useHistory,Link } from 'react-router-dom';
import '../style/Cart.css';
import {
    getCartById,
    createCart,
    createCartItem,
    attachCartItemtoCarts,
    attachProducttoCartItems,
    attachCartsToUsers,
    updateCart,
    deleteCart} from require ('/Final_Capstone/flexbox-sox/db/models/cart');

const Carts=(props)=>{
const {} = useHistory('');
const {/*pass down through props: */}= props;
return(
    <h1> This is the Carts Page </h1>
)

}

export default Carts; 