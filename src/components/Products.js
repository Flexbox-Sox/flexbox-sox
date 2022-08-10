import React from 'react';
import '../style/Products.css';



const Products = (props) => {
    const { products } = props;

    return (
        <div>
            <h2>PRODUCTS</h2>
            { products ? <div className='products-container'>
                {products.map((product, index) => {
                    return(
                    <div className='product' key={index}>
                        <h4>{product.name}</h4>
                        <h4>${product.price}</h4>
                        <img src={product.photo} alt={product.description}/>
                    </div>
                )})}
            </div> : <div>No products to display</div>}
        </div>
    )
}

export default Products