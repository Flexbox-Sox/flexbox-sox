import React from "react";
const API_URL = 'http://localhost:3000/api'

const Admin = (props) => {
    const { token  } = props;
    
    
    const submitProduct = async (event) => {
        const productNameInput = document.getElementById("productName").value;
        const productPriceInput = document.getElementById("productPrice").value;
        const productDescriptionInput = document.getElementById("productDescription").value;
        const productPhotoInput = document.getElementById("productPhoto").value;
        event.preventDefault();
        
        let productData = {
            name: productNameInput,
            price: productPriceInput,
            description: productDescriptionInput,
            photo: productPhotoInput
        };
        
        await createProduct(productData)
    }
    
    const createProduct = async (productData) => {
         await fetch(`${API_URL}/products`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: productData.name,
                price: productData.price,
                description: productData.description,
                photo: productData.photo
            })
        }).then(response => response.json())
        .then(result => {
            console.log(result)
            if (!result.error) {
                console.log(result)
            } else {
                console.log(result.error.message)
            }
        })
        .catch(console.error)
    }

    const submitEditedProduct = async (event) => {
      const productIdInput = document.getElementById("editProductId").value;
      const productNameInput = document.getElementById("editProductName").value;
      const productPriceInput = document.getElementById("editProductPrice").value;
      const productDescriptionInput = document.getElementById("editProductDescription").value;
      const productPhotoInput = document.getElementById("editProductPhoto").value;
      event.preventDefault();
      
      let productData = {
          id: productIdInput,
          name: productNameInput,
          price: productPriceInput,
          description: productDescriptionInput,
          photo: productPhotoInput
      };
      
      await editProduct(productData)
  }
  
  const editProduct = async (productData) => {
    console.log(productData)
       await fetch(`${API_URL}/products/${productData.id}`, {
          method: "PATCH",
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
              name: productData.name,
              price: productData.price,
              description: productData.description,
              photo: productData.photo
          })
      }).then(response => response.json())
      .then(result => {
          console.log(result)
          if (!result.error) {
              console.log(result)
          } else {
              console.log(result.error.message)
          }
      })
      .catch(console.error)
  }























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
                  <textarea id="productDescription" rows={5} cols={40}
                          placeholder='Enter Product Description Here'>
                      </textarea>
                  <br />
                  <label>Product Photo</label>
                  <input id="productPhoto" type="text" placeholder="Enter Photo URL" required></input>
                  <br />

                </div>
                <div className="submit-button">
                   <button type="submit" onClick={submitProduct}>SUBMIT</button>
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
                    <label>Product ID:</label>
                  <input id="editProductId" type="text" placeholder="Edit Product ID" required></input>
                  <br />
                    <label>Product Name:</label>
                  <input id="editProductName" type="text" placeholder="Edit Product Name" required></input>
                  <br />
                  <label>Price: $</label>
                  <input id="editProductPrice" type="Number" step="0.01" placeholder="Edit Product Price" required></input>
                  <br />
                  <label>Product Description:</label>
                  <textarea id="editProductDescription" rows={5} cols={40}
                          placeholder='Edit Product Description Here'>
                      </textarea>
                  <br />
                  <label>Product Photo</label>
                  <input id="editProductPhoto" type="text" placeholder="Enter Photo URL" required></input>
                  <br />
                    </div>
                    <div className='submit-button'>
                         <button type="submit" onClick={submitEditedProduct}>SUBMIT</button>
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
