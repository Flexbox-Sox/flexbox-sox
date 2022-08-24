import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import '../style/Products.css';
import { addSingleProductToCart } from '../axios-services';

const Products = (props) => {
    const { products, setSingleProductId, token, setAlert, update, setUpdate, stopInterval, setStopInterval } = props;
    const history = useHistory();

    const myInterval = setInterval(function() {showSlides(plusSlides(1))}, 2000)

    useEffect(() => {
        clearInterval(myInterval)
    },[stopInterval])
    
    const handleClick = (event) => {
        setSingleProductId(event.target.dataset.id)
        setStopInterval(!stopInterval)
        history.push('/singleProduct')
    }

    const addToCart = async (event) => {
        if (!event.target.dataset.id) {
            setAlert("Item failed to add, please try again!")
        } else {
            await addSingleProductToCart(event.target.dataset.id, token)
            setAlert("Sock added to cart!")
            setUpdate(!update);
        }
    }

    let slideIndex = 1;

    function plusSlides(n) {
        showSlides(slideIndex += n);
    }

    function currentSlide(n) {
        showSlides(slideIndex = n);
    }

    function showSlides(n) {
        let i;
        let slides = document.getElementsByClassName("mySlides");
        let dots = document.getElementsByClassName("dot");
        let initial = document.getElementById("initial-display")

        if (initial) {
            document.getElementById("initial-display").style.display = "none";
        }

        if (n > slides.length) {
            slideIndex = 1
        }

        if (n < 1) {
            slideIndex = slides.length
        }

        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }

        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }

        if (slides.length && dots.length) {
            slides[slideIndex-1].style.display = "block";
            dots[slideIndex-1].className += " active";
        }
    }



    return (
        <div>
            <div className='slideshow-container'>
                <div id='initial-display'>
                    <img data-id={1} onClick={(event) => handleClick(event)} src="https://i.ibb.co/dP5cx1T/annie-sock-removebg-preview.png" alt="socks with Annie's face" />
                </div>
                {products ? products.map((product, index) => {
                    return (
                        <div className='mySlides fade' key={index}>
                            <img data-id={product.id} onClick={(event) => handleClick(event)} src={product.photo} alt={product.description} />
                        </div>
                    )
                }) : null}
                <a className="prev" onClick={() => {plusSlides(-1)}}>&#10094;</a>
                <a className="next" onClick={() => {plusSlides(1)}}>&#10095;</a>
            </div>
            <div id='dots'>
                {products ? products.map((product, index) => {
                    return (
                        <span key={index} className='dot' onClick={() => {currentSlide(index+1)}}></span>
                    )
                }) : null}
            </div>
            { products ? <div className='products-container'>
                {products.map((product, index) => {
                    return(
                    <div className='product' key={index}>
                        <div className='product-info'>
                            <h3>{product.name}</h3>
                            <h3>${product.price}</h3>
                        </div>
                        <div className='product-image'>
                            <img data-id={product.id} onClick={(event) => handleClick(event)} src={product.photo} alt={product.description}/>
                        </div>
                        <div className='product-buttons'>
                            <button className='view-product' data-id={product.id} onClick={(event) => handleClick(event)}>VIEW</button>
                            <button className='add-to-cart' onClick={(event) => addToCart(event)} data-id={product.id}><img src="https://i.ibb.co/T807tDQ/addtocart.png" alt="ADD TO CART" data-id={product.id}/></button>
                        </div>
                    </div>
                )})}
            </div> : <div>No products to display</div>}
        </div>
    )
}

export default Products