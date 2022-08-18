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
import Account from "./Account";
import Checkout from "./Checkout";

const App = () => {
  const [products, setProducts] = useState([]);
  const [singleProductId, setSingleProductId] = useState();
  const [userName, setUserName] = useState("");
  const [admin, setAdmin] = useState("");
  const [token, setToken] = useState("");
  const [logText, setLogText] = useState("LOGIN");
  const [cart, setCart] = useState({});
  const [alert, setAlert] = useState("");
  const [users, setUsers] = useState([]);
  const isMounted = useRef(false);

  useEffect(() => {
      if (isMounted.current) {
          showAlert()
      } else {
          isMounted.current = true;
      }}, [alert]);

  useEffect(() => {
    const fetchProducts = async () => {
      const allProducts = await fetchAllProducts();
      setProducts(allProducts);
    };

    fetchProducts();
  }, []);

  return (
    <Router>
      <div className="app-container">
        <header>
          <div className="title">
            <h1>FLEXBOX-SOX</h1>
          </div>
          <nav className="nav">
            <Link to="/">HOME</Link>
            <Link to="/cart">MY CART ({cart.items ? cart.items.length: 0})</Link>
            {userName && !admin ? <Link to="/account">ACCOUNT</Link> : null}
            {admin ? <Link to="/admin">ADMIN</Link> : null}
            <Link to={logText === "LOGIN" ? "/login" : "/logout"} className="nav-link" id="nav-login">{logText}</Link>
          </nav>
        </header>
        <main>
          <Route exact path="/">
            <Products
              products={products}
              setSingleProductId={setSingleProductId}
              token={token}
            />
          </Route>
          <Route exact path="/singleProduct">
            <SingleProduct
              singleProductId={singleProductId}
              products={products}
              setAlert={setAlert}
            />
          </Route>
          <Route exact path="/register">
            <Register
              setUserName={setUserName}
              setToken={setToken}
              setLogText={setLogText}
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
          <Route exact path="/account">
            <Account />
          </Route>
          <Route exact path="/admin">
            <Admin 
              token={token} 
              setAlert={setAlert}
              users={users}
              setUsers={setUsers} />
          </Route>
          <Route exact path="/cart">
            <Carts 
              token={token}
              cart={cart}
              setCart={setCart}
              setAlert={setAlert} />
          </Route>
          <Route exact path="/checkout">
            <Checkout 
              token={token}
              cart={cart}
              setAlert={setAlert} />
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
