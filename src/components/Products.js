import React from 'react';
import { useHistory } from 'react-router-dom';
import '../style/Products.css';
import { addSingleProductToCart } from '../axios-services';

const Products = (props) => {
    const { products, setSingleProductId, token } = props;
    const history = useHistory();
    
    const handleClick = (event) => {
        setSingleProductId(event.target.dataset.id)
        history.push('/singleProduct')
    }

    const addToCart = async (event) => {
        await addSingleProductToCart(event.target.dataset.id, token)
    }

    return (
        <div>
            { products ? <div className='products-container'>
                {products.map((product, index) => {
                    return(
                    <div className='product' key={index}>
                        <div className='product-info'>
                            <h3>{product.name}</h3>
                            <h3>${product.price}</h3>
                        </div>
                        <div className='product-image'>
                            <img src={product.photo} alt={product.description}/>
                        </div>
                        <div className='product-buttons'>
                            <button className='view-product' data-id={product.id} onClick={(event) => handleClick(event)}>VIEW SOCK</button>
                            <button className='add-to-cart' onClick={(event) => addToCart(event)}><img src="https://i.ibb.co/T807tDQ/addtocart.png" alt="ADD TO CART" data-id={product.id}/></button>
                        </div>
                    </div>
                )})}
            </div> : <div>No products to display</div>}
        </div>
    )
}

export default Products