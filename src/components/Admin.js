import React from "react";

const Admin = (props) => {
  return (
    <div className="createProduct">
      <h1>Admin</h1>
      <div id="">
        <form id="product-form">
          <div className="inputs">
            <label>Product Name</label>
            <input
              id="login-username"
              type="text"
              placeholder="Enter Username"
              required
            ></input>
            <br />
            <label>Password:</label>
            <input
              id="login-password"
              type="password"
              placeholder="Enter Password"
              required
            ></input>
            <br />
          </div>
          <div className="submit-button">
            {/* <button type="submit" onClick={submitLogin}>SUBMIT</button> */}
          </div>
        </form>
        <div id="register-link-container">
          {/* <Link to="/register" id="register-link">Click here to register!</Link> */}
        </div>
      </div>
    </div>
  );
};

export default Admin;
