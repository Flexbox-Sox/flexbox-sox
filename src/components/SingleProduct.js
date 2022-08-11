import React from 'react';
import '../style/Products.css';

const SingleProduct = (props) => {
    const { singleProductId, products } = props;

    const [singleProduct] = products.filter((product) => product.id == singleProductId)

    return (
        <div className='single-product-container'>
            { singleProduct ? <div>
                <div className='single-product-info'>
                    <h2>{singleProduct.name}</h2>
                    <h2>{singleProduct.price}</h2>
                    <p>{singleProduct.description}</p>
                    <div className='single-product-add-to-cart'>
                        <button className='add-to-cart'><img src="https://i.ibb.co/T807tDQ/addtocart.png" alt="ADD TO CART" /></button>
                    </div>
                </div>
                <div className='single-product-image'>
                    <img src={singleProduct.photo} alt={singleProduct.description} />
                </div>
            </div> : <div>This product does not exist</div>}
        </div>
    )
}

export default SingleProduct;