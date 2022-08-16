import React from "react";


const Admin = (props) => {














  return (
      <div className="AdminContainer">
          <div className="createProduct">
            <h1>Admin</h1>
            <div id="createProductContainer">
              <form id="product-form">
                <div className="inputs">
                  <label>Product Name:</label>
                  <input id="productName" type="text" placeholder="Enter Product Name" required></input>
                  <br />
                  <label>Price: $</label>
                  <input id="productPrice" type="Number" step="0.01" placeholder="Enter Product Price" required></input>
                  <br />
                  <label>Product Description:</label>
                  <textarea  rows={5} cols={40}
                          placeholder='Enter Product Description Here'>
                      </textarea>
                  <br />
                  <label>Product Photo</label>
                  <input id="productPhoto" type="text" placeholder="Enter Photo URL" required></input>
                  <br />

                </div>
                <div className="submit-button">
                  {/* <button type="submit" onClick={createProduct}>SUBMIT</button>  */}
                </div>
              </form>
            </div>
          </div>
          <br />

          <div className="editProduct">
            <h3>Edit Product</h3>
            <div id='editProductContainer'>
                <form id='editProductForm'>
                    <div className='inputs'>
                    <label>Product Name:</label>
                  <input id="productName" type="text" placeholder="Edit Product Name" required></input>
                  <br />
                  <label>Price: $</label>
                  <input id="productPrice" type="Number" step="0.01" placeholder="Edit Product Price" required></input>
                  <br />
                  <label>Product Description:</label>
                  <textarea  rows={5} cols={40}
                          placeholder='Edit Product Description Here'>
                      </textarea>
                  <br />
                  <label>Product Photo</label>
                  <input id="productPhoto" type="text" placeholder="Enter Photo URL" required></input>
                  <br />
                    </div>
                    <div className='submit-button'>
                        {/* <button type="submit" onClick={submitLogin}>SUBMIT</button> */}
                    </div>
                </form>
            </div>
        </div>

        <div className="deleteProduct">
            <h3>Delete Product</h3>
            <div id='deleteProductContainer'>
                  <form id='deleteProductForm'>
                    <div className='inputs'>
                    <label>Product ID:</label>
                    <input id="producID" type="number" placeholder="Enter ID" required></input>
                    <br />
                    </div>
                      <div className='submit-button'>
                        {/* <button type="submit" onClick={submitLogin}>SUBMIT</button> */}
                      </div>
                  </form>
            </div>
        </div>


      </div>
  );
};

export default Admin;
