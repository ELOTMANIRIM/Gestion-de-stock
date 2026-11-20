<template>
  <div>
    <h1>Order Success 🎉</h1>

    <div v-if="isLoading">Loading order...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <p>Order #{{ order.id }} has been successfully created!</p>
      <p>Total: ${{ order.total_price }}</p>
      <p>Payment: {{ order.payment?.payment_status || 'unknown' }}</p>
      <p>Status: {{ order.status }}</p>

      <!-- List products -->
      <ul>
        <li v-for="item in order.items" :key="item.id">
          Product: {{ item.product?.name || 'unknown' }} |
          Quantity: {{ item.quantity }} |
          Price: ${{ item.price }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import path from '@/plugins/path'

const route = useRoute()
const sessionId = route.query.session_id as string

const order = ref<any>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  if (!sessionId) {
    error.value = 'No session ID provided'
    isLoading.value = false
    return
  }

  try {
    const response = await path.get(`/orders/payment-success?session_id=${sessionId}`)
    order.value = response.data.order
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error fetching order'
  } finally {
    isLoading.value = false
  }
})
</script>
