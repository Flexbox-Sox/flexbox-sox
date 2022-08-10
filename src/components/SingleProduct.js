import React from 'react';
import '../style/Products.css';

const SingleProduct = (props) => {
    const { singleProductId, products } = props;

    const singleProduct = products.filter((product) => product.id === singleProductId)
    console.log(singleProduct)

    return (
        <div className='single-product-container'>
            { singleProduct ? <div>
                <div className='single-product-info'>
                    <h2>{singleProduct.name}</h2>
                    <p>{singleProduct.description}</p>
                    <p>{singleProduct.price}</p>
                </div>
                <div className='single-product-image'>
                    <img src={singleProduct.photo} alt={singleProduct.description} />
                </div>
            </div> : <div>This product does not exist</div>}
        </div>
    )
}

export default SingleProduct;