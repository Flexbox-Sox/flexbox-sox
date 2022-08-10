import React from 'react';
import { useHistory } from 'react-router-dom';
import '../style/Products.css';



const Products = (props) => {
    const { products, setSingleProductId } = props;
    const history = useHistory();

    let viewProductButtons = [...document.getElementsByClassName('view-product')]
    for (let i = 0; i < viewProductButtons.length; i++) {
        const button = viewProductButtons[i];
        button.addEventListener('click', () => {
            setSingleProductId(button.dataset.id);
            history.push('/singleProduct');
        });
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
                            <button className='view-product' data-id={product.id}>VIEW SOCK</button>
                            <button className='add-to-cart'><img src="https://i.ibb.co/T807tDQ/addtocart.png" alt="ADD TO CART" /></button>
                        </div>
                    </div>
                )})}
            </div> : <div>No products to display</div>}
        </div>
    )
}

export default Products