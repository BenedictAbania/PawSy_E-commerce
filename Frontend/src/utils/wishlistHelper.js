const API = 'http://localhost:8083/api/wishlist';

export async function getWishlist() {
  const token = localStorage.getItem('authToken');
  if (!token) return [];
  const res = await fetch(API, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error('Failed to fetch wishlist');
  return await res.json();
}

export async function addToWishlist(productId) {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('Not authenticated');
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ product_id: productId })
  });
  return await res.json();
}

export async function removeFromWishlist(productId) {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('Not authenticated');
  // using query param style:
  const res = await fetch(`${API}?product_id=${productId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  return await res.json();
}