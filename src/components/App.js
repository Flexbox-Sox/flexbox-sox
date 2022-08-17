import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Products from "./Products";
import { getAPIHealth, fetchAllProducts } from "../axios-services";
import "../style/App.css";
import SingleProduct from "./SingleProduct";
import Register from "./Register";
import Login from "./Login";
import Logout from "./Logout";
import Admin from "./Admin";
import Carts from "./Carts";

const App = () => {
  const [APIHealth, setAPIHealth] = useState("");
  const [products, setProducts] = useState([]);
  const [singleProductId, setSingleProductId] = useState();
  const [userName, setUserName] = useState("");
  const [token, setToken] = useState("");
  const [logText, setLogText] = useState("LOGIN");

  useEffect(() => {
    const getAPIStatus = async () => {
      const { healthy } = await getAPIHealth();
      setAPIHealth(healthy ? "api is up! :D" : "api is down :/");
    };

    const fetchProducts = async () => {
      const allProducts = await fetchAllProducts();
      setProducts(allProducts);
    };

    getAPIStatus();
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
            <Link to="/cart">MY CART</Link>
            <Link
              to={logText === "LOGIN" ? "/login" : "/logout"}
              className="nav-link"
              id="nav-login"
            >
              {logText}
            </Link>
            <Link to="/admin">ADMIN</Link>
          </nav>
        </header>
        <main>
          <Route exact path="/">
            <Products
              products={products}
              setSingleProductId={setSingleProductId}
            />
          </Route>
          <Route exact path="/singleProduct">
            <SingleProduct
              singleProductId={singleProductId}
              products={products}
            />
          </Route>
          <Route exact path="/register">
            <Register
              setUserName={setUserName}
              setToken={setToken}
              setLogText={setLogText}
            />
          </Route>
          <Route exact path="/login">
            <Login
              setUserName={setUserName}
              setToken={setToken}
              setLogText={setLogText}
            />
          </Route>
          <Route exact path="/logout">
            <Logout
              setUserName={setUserName}
              setToken={setToken}
              setLogText={setLogText}
            />
          </Route>
          <Route exact path="/admin">
            <Admin token={token} />
          </Route>
          <Route exact path="/cart">
            <Carts token={token} />
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
