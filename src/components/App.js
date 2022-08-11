import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Products from './Products';
import { getAPIHealth, fetchAllProducts } from '../axios-services';
import '../style/App.css';
import SingleProduct from './SingleProduct';
import Register from './Register';
import Login from './Login';

const App = () => {
  const [APIHealth, setAPIHealth] = useState('');
  const [products, setProducts] = useState([]);
  const [singleProductId, setSingleProductId] = useState();

  useEffect(() => {
    const getAPIStatus = async () => {
      const { healthy } = await getAPIHealth();
      setAPIHealth(healthy ? 'api is up! :D' : 'api is down :/');
    };

    const fetchProducts = async () => {
      const allProducts = await fetchAllProducts();
      setProducts(allProducts)
    }

    getAPIStatus();
    fetchProducts();
  }, []);

  return (
    <Router>
      <div className="app-container">
        <header>
          <div className='title'>
            <h1>FLEXBOX-SOX</h1>
          </div>
          <nav className='nav'>
            <Link to='/'>HOME</Link>
            <Link to='/account'>ACCOUNT</Link>
            <Link to='/login'>LOGIN</Link>
            <Link to='/logout'>LOGOUT</Link>
          </nav>
        </header>
        <main>
          <Route exact path='/'>
            <Products products={products} setSingleProductId={setSingleProductId} />
          </Route>
          <Route exact path='/singleProduct'>
            <SingleProduct singleProductId={singleProductId} products={products} />
          </Route>
          <Route exact path='/register'>
            <Register />
          </Route>
          <Route exact path='/login'>
            <Login />
          </Route>
        </main>
        <footer>
          <h3>Temporary</h3>
          <p>API HEALTH UPDATE: {APIHealth}</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
