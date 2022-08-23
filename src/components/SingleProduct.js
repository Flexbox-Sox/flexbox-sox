import React from 'react';
import '../style/Products.css';
import { addSingleProductToCart } from '../axios-services';

const SingleProduct = (props) => {
    const { singleProductId, products, setAlert, setUpdate, token, update } = props;

    const [singleProduct] = products.filter((product) => product.id === Number(singleProductId))

    const addToCart = async (event) => {
        if (!event.target.dataset.id) {
            setAlert("Item failed to add, please try again!")
            setUpdate(!update)
        } else {
            await addSingleProductToCart(event.target.dataset.id, token)
            setAlert("Sock added to cart!")
            setUpdate(!update);
        }
    }

    return (
        <div className='single-product-container'>
            { singleProduct ? <div>
                <div className='single-product-info'>
                    <h2>{singleProduct.name}</h2>
                    <div className='single-product-add-to-cart'>
                        <span>${singleProduct.price}</span>
                        <button className='add-to-cart' data-id={product.id} onClick={addToCart}><img data-id={singleProduct.id} src="https://i.ibb.co/T807tDQ/addtocart.png" alt="ADD TO CART" /></button>
                    </div>
                    <p>{singleProduct.description}</p>
                </div>
                <div className='single-product-image'>
                    <img src={singleProduct.photo} alt={singleProduct.description} />
                </div>
            </div> : <div>This product does not exist</div>}
        </div>
    )
}

export default SingleProduct;