import React, { useEffect } from "react";
import "../style/Admin.css";

const API_URL = 'http://localhost:3000/api'

const Admin = (props) => {
    const { token, setAlert, users, setUsers, update, setUpdate, products } = props;
    
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
                setAlert("Successfully added a new sock!")
                setUpdate(!update)
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
              setAlert("Socked edited!")
              setUpdate(!update)
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
        if (!result.error) {
            setAlert("Sock deleted!")
            setUpdate(!update)
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
              setUsers(result)
          } else {
              setAlert(result.error.message)
          }
      })
      .catch(console.error)
  }
      getAllUsers();
  }, [])

  function showContainers(event) {
    let target = event.target.id
    let productsContainer = document.getElementById("products-container");
    let createContainer = document.getElementById("create-container");
    let editContainer = document.getElementById("edit-container");
    let deleteContainer = document.getElementById("delete-container");
    let usersContainer = document.getElementById("users-container");
    if (target === "create") {
        createContainer.style.display = "initial";
        editContainer.style.display = "none";
        deleteContainer.style.display = "none";
        usersContainer.style.display = "none";
        productsContainer.style.display = "initial"

    }

    if (target === "edit") {
        createContainer.style.display = "none";
        editContainer.style.display = "initial";
        deleteContainer.style.display = "none";
        usersContainer.style.display = "none";
        productsContainer.style.display = "initial"

    }

    if (target === "delete") {
        createContainer.style.display = "none";
        editContainer.style.display = "none";
        deleteContainer.style.display = "initial";
        usersContainer.style.display = "none";
        productsContainer.style.display = "initial"
    }

    if (target === "users") {
        createContainer.style.display = "none";
        editContainer.style.display = "none";
        deleteContainer.style.display = "none";
        usersContainer.style.display = "initial";
        productsContainer.style.display = "none"
    }
  }

  return (
      <div className="admin-container">
            <div className="header">
                <span id="create" onClick={showContainers}>CREATE PRODUCT</span>
                <span id="edit" onClick={showContainers}>EDIT PRODUCT</span>
                <span id="delete" onClick={showContainers}>DELETE PRODUCT</span>
                <span id="users" onClick={showContainers}>VIEW USERS</span>
            </div>
            <div className="flex-container">

            <div id="products-container">
                { products ? <div>
                    <table className="products-table">
                        <thead>
                            <tr>
                                <th>PRODUCT ID</th>
                                <th>NAME</th>
                                <th>PRICE</th>
                                <th>DESCRIPTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, index) => {
                                return(
                                    <tr key={index}>
                                        <td>{product.id}</td>
                                        <td>{product.name}</td>
                                        <td>{product.price}</td>
                                        <td>{product.description}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div> : <div className="userMessage">Only Admins Can See This Data!</div>}
            </div>
        <div className="admin-forms-container">
            <div id="create-container">
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
                    <br />
                    <div>
                    <button className="admin-submit-button" type="submit" onClick={submitProduct}>ADD NEW PRODUCT</button>
                    </div>
                </form>
                </div>
            </div>
            <br />

            <div id="edit-container">
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
                        <br />
                        <div>
                            <button className='admin-submit-button' type="submit" onClick={submitEditedProduct}>EDIT PRODUCT</button>
                        </div>
                    </form>
                </div>
            </div>

            <div id="delete-container">
                <h3 className="titles">Delete Product</h3>
                <div id='deleteProductContainer'>
                    <form id='deleteProductForm'>
                        <div className='inputs'>
                        <label>Product ID:</label>
                        <input id="deletedProduct" type="text" placeholder="Enter Product ID" required></input>
                        <br />
                        </div>
                        <br />
                        <div>
                            <button className='admin-submit-button' type="button" onClick={submitDeletedProduct}>DELETE PRODUCT</button> 
                        </div>
                    </form>
                </div>
            </div>

        </div>

            </div>                

            <div id="users-container">
                {users.length ? <div className="usersContainer">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>USER ID</th>
                                <th>USERNAME</th>
                                <th>EMAIL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => {
                                return(
                                <tr className='users' key={index}>
                                    <td>{user.id}</td>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>: <div className="userMessage">Only Admins Can See This Data!</div>}
            </div>
        </div>
  );
};

export default Admin;
