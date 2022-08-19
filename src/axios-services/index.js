import axios from "axios";

export async function getAPIHealth() {
  try {
    const { data } = await axios.get("/api/health");
    return data;
  } catch (err) {
    return { healthy: false };
  }
}

export async function fetchAllProducts() {
  try {
    const { data } = await axios.get("/api/products");
    return data;
  } catch (error) {
    throw error;
  }
}


export async function fetchSingleProduct(productId) {
  try {
    const { data } = await axios.get(`/api/products/${productId}`);
    return data;
  } catch (error) {
    throw error;
  }
}

export async function addSingleProductToCart(productId, token) {
  try {
    const product = await fetchSingleProduct(productId)
    if (token) {
      await axios.post(`/api/carts/singleCart`, {productId: productId, priceAtPurchase: product.price}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
    } else {
      await axios.post(`/api/carts/singleCart`, {productId: productId, priceAtPurchase: product.price}, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
    }

    return product;

  } catch (error) {
    throw error;
  }
}

export async function logoutUser() {
  try {
    const {data} = await axios.get('/api/users/logout')
    return data
  } catch (error) {
    throw error;
  }
}
