/**
 * Cart Helper - Handles adding items to cart (backend + localStorage)
 */

const API_URL = "http://localhost:8083/api/cart";

/**
 * Add item to cart (syncs with backend if logged in)
 * @param {Object} product - Product object with id, name, price, image
 * @param {number} quantity - Quantity to add
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const addToCart = async (product, quantity = 1) => {
  try {
    // Check if user is logged in
    const authToken = localStorage.getItem('authToken');
    const currentUser = localStorage.getItem('currentUser');

    if (authToken && currentUser) {
      // User is logged in - sync with backend
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            product_id: product.id,
            quantity: quantity
          })
        });

        if (response.ok) {
          // Also add to localStorage for offline support
          addToLocalStorage(product, quantity);
          return { success: true, message: `${product.name} added to cart!` };
        } else if (response.status === 401) {
          // Token invalid, fall back to localStorage
          addToLocalStorage(product, quantity);
          return { success: true, message: `${product.name} added to cart (offline)!` };
        } else {
          const errorData = await response.json();
          return { success: false, message: errorData.message || 'Failed to add to cart' };
        }
      } catch (err) {
        console.error('Backend error:', err);
        // Fall back to localStorage on network error
        addToLocalStorage(product, quantity);
        return { success: true, message: `${product.name} added to cart (offline)!` };
      }
    } else {
      // User not logged in - use localStorage only
      addToLocalStorage(product, quantity);
      return { success: true, message: `${product.name} added to cart!` };
    }
  } catch (err) {
    console.error('Error in addToCart:', err);
    return { success: false, message: 'Error adding to cart' };
  }
};

/**
 * Add item to localStorage cart
 * @param {Object} product - Product object
 * @param {number} quantity - Quantity to add
 */
const addToLocalStorage = (product, quantity) => {
  const cartRaw = localStorage.getItem("cartItems") || "[]";
  const cart = JSON.parse(cartRaw);
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity
    });
  }

  localStorage.setItem("cartItems", JSON.stringify(cart));
};

/**
 * Get cart from backend or localStorage
 * @returns {Promise<Array>} Array of cart items
 */
export const getCart = async () => {
  try {
    const authToken = localStorage.getItem('authToken');
    const currentUser = localStorage.getItem('currentUser');

    if (authToken && currentUser) {
      const response = await fetch(API_URL, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.items.map(item => ({
          id: item.product_id,
          product_id: item.product_id,
          cart_id: item.id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.image,
          quantity: item.quantity
        }));
      }
    }
  } catch (err) {
    console.error('Error fetching cart:', err);
  }

  // Fall back to localStorage
  const saved = localStorage.getItem("cartItems");
  return saved ? JSON.parse(saved) : [];
};
