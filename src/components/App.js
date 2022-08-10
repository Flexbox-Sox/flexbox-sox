import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Products from './Products';
import { getAPIHealth } from '../axios-services';
import '../style/App.css';
import SingleProduct from './SingleProduct';

const App = () => {
  const [APIHealth, setAPIHealth] = useState('');
  const [products, setProducts] = useState([]);
  const [singleProductId, setSingleProductId] = useState();

  useEffect(() => {
    // follow this pattern inside your useEffect calls:
    // first, create an async function that will wrap your axios service adapter
    // invoke the adapter, await the response, and set the data
    const getAPIStatus = async () => {
      const { healthy } = await getAPIHealth();
      setAPIHealth(healthy ? 'api is up! :D' : 'api is down :/');
    };

    // second, after you've defined your getter above
    // invoke it immediately after its declaration, inside the useEffect callback
    getAPIStatus();
    setProducts([{id: 1, name: "Annie Sock", description: "Sock with Annie's Photo all over it!", photo: "https://i.ibb.co/xsP4cDh/annie-sock.jpg", price: 5.99}, {id: 2, name: 'Lemon Sock', description: "Purple sock with yellow lemons", photo: "https://i.ibb.co/XttpTFd/lemon-sock.jpg", price: 5.99}])
  }, []);

  useEffect(() => {
    console.log(singleProductId)
  },[singleProductId])

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
