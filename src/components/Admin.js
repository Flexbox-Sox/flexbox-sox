import React, { useEffect } from "react";
import "../style/Admin.css";

const API_URL = 'http://localhost:3000/api'

const Admin = (props) => {
    const { token, setAlert, users, setUsers } = props;
    
    
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
            if (!result.error) {
                setAlert(result.message)
            } else {
                setAlert(result.error.message)
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
              setAlert(result.message)
          } else {
              setAlert(result.error.message)
          }
      })
      .catch(console.error)
  }

  const submitDeletedProduct = async (event) => {
    const productIdInput = document.getElementById("deletedProduct").value;
    event.preventDefault();
    
    let productData = {
        id: productIdInput
    };
    
    await deleteProduct(productData)
}

const deleteProduct = async (productData) => {
     await fetch(`${API_URL}/products/${productData.id}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    }).then(response => response.json())
    .then(result => {
        console.log(result)
        if (!result.error) {
            setAlert(result.message)
        } else {
            setAlert(result.error.message)
        }
    })
    .catch(console.error)
}

useEffect(() => {

    const getAllUsers = async () => {
        await fetch(`${API_URL}/users`, {
          method: "GET",
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
      }).then(response => response.json())
      .then(result => {
          if (!result.error) {
            // console.log(result)
              setUsers(result)
          } else {
              setAlert(result.error.message)
          }
      })
      .catch(console.error)
  }

  




      getAllUsers();
      console.log(users)
  }, [])


  


  return (
      <div className="AdminContainer">
            <div>
                <h1 className="header">Admin</h1>
            </div>
          <div className="createProduct">
            <h3 className="titles">Create Product</h3>
            <div id="createProductContainer">
              <form id="product-form">
                <div className="inputs">
                  <label>Product Name:</label>
                  <input id="productName" type="text" placeholder="Enter Product Name" required></input>
                  <br />
                  <label>Price: $</label>
                  <input id="productPrice" type="Number" step="0.01" placeholder="Enter Product Price" required></input>
                  <br />
                  <label>Product Photo</label>
                  <input id="productPhoto" type="text" placeholder="Enter Photo URL" required></input>
                  <br />
                  <label>Product Description:</label>
                  <textarea id="productDescription" rows={2} cols={40}
                          placeholder='Enter Product Description Here'>
                      </textarea>
                  <br />

                </div>
                <div>
                   <button className="submit-button" type="submit" onClick={submitProduct}>SUBMIT</button>
                </div>
              </form>
            </div>
          </div>
          <br />

          <div className="editProduct">
            <h3 className="titles">Edit Product</h3>
            <div id='editProductContainer'>
                <form id='editProductForm'>
                    <div className='inputs'>
                    <label>Product ID:</label>
                  <input id="editProductId" type="text" placeholder="Enter Product ID" required></input>
                  <br />
                    <label>Product Name:</label>
                  <input id="editProductName" type="text" placeholder="Edit Product Name" required></input>
                  <br />
                  <label>Price: $</label>
                  <input id="editProductPrice" type="Number" step="0.01" placeholder="Edit Product Price" required></input>
                  <br />
                  <label>Product Photo</label>
                  <input id="editProductPhoto" type="text" placeholder="Enter Photo URL" required></input>
                  <br />
                  <label>Product Description:</label>
                  <textarea id="editProductDescription" rows={2} cols={40}
                          placeholder='Edit Product Description Here'>
                      </textarea>
                  <br />
                    </div>
                    <div>
                         <button className='submit-button' type="submit" onClick={submitEditedProduct}>SUBMIT</button>
                    </div>
                </form>
            </div>
        </div>

        <div className="deleteProduct">
            <h3 className="titles">Delete Product</h3>
            <div id='deleteProductContainer'>
                <form id='deleteProductForm'>
                    <div className='inputs'>
                    <label>Product ID:</label>
                    <input id="deletedProduct" type="text" placeholder="Enter Product ID" required></input>
                    <br />
                    </div>
                      <div>
                        <button className='delete-button' type="button" onClick={submitDeletedProduct}>DELETE</button> 
                    </div>
                </form>
            </div>
        </div>

        <div className="allUsers">
        <h3 className="titles">All Users</h3>
            {users.length? <div className="usersContainer">
                {users.map((user, index) => {
                    return(
                    <div className='users' key={index}>
                        <div className='users-info'>
                            <h3>{user.username}</h3>
                            <h3>{user.email}</h3>
                            <h3>{user.id}</h3>
                        </div>
                        
                    </div>
                )})}
            </div>: <div className="userMessage">Only Admins Can See This Data!</div>}
        </div>


      </div>
  );
};

export default Admin;
