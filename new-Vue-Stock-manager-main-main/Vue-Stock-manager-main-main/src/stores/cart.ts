import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";
import api from "@/plugins/axios";

export const useCartStore = defineStore("cart", () => {
  // 🛒 State
  const items = ref<Array<{ product: any; quantity: number }>>([]);

  // ➕ Add product
  const addItem = (product: any, quantity = 1) => {
    const existing = items.value.find((i) => i.product.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.value.push({ product, quantity });
    }
  };

  // ➖ Update quantity
  const updateQuantity = (productId: number, quantity: number) => {
    const item = items.value.find((i) => i.product.id === productId);
    if (!item) return;
    if (quantity <= 0) {
      removeItem(productId);
    } else {
      item.quantity = quantity;
    }
  };

  // ❌ Remove product
  const removeItem = (productId: number) => {
    items.value = items.value.filter((i) => i.product.id !== productId);
  };

  // 🧹 Clear cart
  const clearCart = () => {
    items.value = [];
  };

  // 💰 Total price
  const total = computed(() =>
    items.value.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  );

  // 🔢 Number of items
  const itemsCount = computed(() =>
    items.value.reduce((sum, i) => sum + i.quantity, 0)
  );

const checkout = async () => {
  if (items.value.length === 0) {
    alert("Votre panier est vide !");
    return;
  }

  try {
    const payload = {
      items: items.value.map(i => ({
        product_id: i.product.id,
        quantity: i.quantity,
      })),
    };

    const response = await api.post("/orders/checkout", payload);

    // Redirect to Stripe Checkout
    window.location.href = response.data.url;

  } catch (error: any) {
    console.error("Erreur lors du checkout ❌", error);

    // Show more details:
    if (error.response) {
      // Backend responded with a status code outside 2xx
      console.error("Backend response:", error.response.data);
      alert(`Erreur backend: ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      // Request was made but no response
      console.error("No response from backend:", error.request);
      alert("Pas de réponse du serveur, vérifiez votre backend.");
    } else {
      // Something else happened
      console.error("Erreur Axios:", error.message);
      alert(`Erreur Axios: ${error.message}`);
    }
  }
};


  return {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    total,
    itemsCount,
    checkout,
  };
});
