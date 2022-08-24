import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Products from "./Products";
import { fetchAllProducts } from "../axios-services";
import "../style/App.css";
import "../style/index.css";

import SingleProduct from "./SingleProduct";
import Register from "./Register";
import Login from "./Login";
import Logout from "./Logout";
import Admin from "./Admin";
import Carts from "./Carts";
import Alert, {showAlert} from "./Alert";
import Checkout from "./Checkout";


const App = () => {
  const [token, setToken] = useState("");
  const [products, setProducts] = useState([]);
  const [singleProductId, setSingleProductId] = useState();
  const [userName, setUserName] = useState("");
  const [admin, setAdmin] = useState("");
  const [logText, setLogText] = useState("LOGIN");
  const [cart, setCart] = useState({});
  const [alert, setAlert] = useState("");
  const [users, setUsers] = useState([]);
  const [update, setUpdate] = useState(false)
  const [stopInterval, setStopInterval] = useState(false)
  const isMounted = useRef(false);

  useEffect(() => {
      if (isMounted.current) {
          showAlert()
      } else {
          isMounted.current = true;
      }}, [alert, update]);

  useEffect(() => {
    const fetchProducts = async () => {
      const allProducts = await fetchAllProducts();
      setProducts(allProducts);
    };

    fetchProducts();
  }, [update]);

  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <div className="title">
            <Link to="/" id="headerh1"><h1 >FLEXBOX-SOX</h1></Link>
            <img id="logo" src="https://i.ibb.co/CQL4cpB/Untitled-design-1-removebg-preview.png" alt='flexbox-sox logo' />
          </div>
          <nav className="nav">
            <Link to="/" id="nav-home">HOME</Link>
            <Link to="/cart" id="nav-cart">MY CART</Link>
            {admin ? <Link to="/admin" id="nav-admin">ADMIN</Link> : null}
            <Link to={logText === "LOGIN" ? "/login" : "/logout"} id="nav-login">{logText}</Link>
          </nav>
        </header>
        <main>
          <Route exact path="/">
            <Products
              products={products}
              setSingleProductId={setSingleProductId}
              token={token}
              setAlert={setAlert}
              update={update}
              setUpdate={setUpdate}
              stopInterval={stopInterval}
              setStopInterval={setStopInterval}
            />
          </Route>
          <Route exact path="/singleProduct">
            <SingleProduct
              singleProductId={singleProductId}
              products={products}
              setAlert={setAlert}
              setUpdate={setUpdate}
              token={token}
              update={update}
            />
          </Route>
          <Route exact path="/register">
            <Register
              setAlert={setAlert}
            />
          </Route>
          <Route exact path="/login">
            <Login
              setUserName={setUserName}
              setToken={setToken}
              setLogText={setLogText}
              setAlert={setAlert}
              setAdmin={setAdmin}
            />
          </Route>
          <Route exact path="/logout">
            <Logout
              setUserName={setUserName}
              setToken={setToken}
              setLogText={setLogText}
              setAlert={setAlert}
              setAdmin={setAdmin}
            />
          </Route>
          <Route exact path="/admin">
            <Admin 
              products={products}
              token={token} 
              setAlert={setAlert}
              users={users}
              setUsers={setUsers}
              update={update}
              setUpdate={setUpdate} />
          </Route>
          <Route exact path="/cart">
            <Carts 
              token={token}
              cart={cart}
              setCart={setCart}
              setAlert={setAlert}
              update={update}
              setUpdate={setUpdate}
              userName={userName} />
          </Route>
          <Route exact path="/checkout">
            <Checkout 
              setAlert={setAlert}
              token={token}
              cart={cart} />
          </Route>
        </main>
        <footer>
          <div className='alert'>
                <Alert alert={alert} />
            </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
