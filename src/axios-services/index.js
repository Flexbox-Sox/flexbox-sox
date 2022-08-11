import axios from 'axios';

export async function getAPIHealth() {
  try {
    const { data } = await axios.get('/api/health');
    return data;
  } catch (err) {
    console.error(err);
    return { healthy: false };
  }
}

export async function fetchAllProducts() {
  try {
    const { data } = await axios.get('/api/products');
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchSingleProduct(productId) {
  try {
    const { data } = await axios.get(`/api/products/${productId}`)
    return data;
  } catch (error) {
    console.log(error);
  }
}
