import { defineStore } from 'pinia'
import { onMounted, ref } from 'vue'
import type { Supplier } from '@/types'
import path from '@/plugins/path'

export const useSuppliersStore = defineStore('suppliers', () => {
  const suppliers = ref<Supplier[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)


  // Fetch all suppliers
  const fetchSuppliers = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await path.get('/admin/suppliers')
      suppliers.value = response.data.users || []
      console.log(suppliers.value)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error loading suppliers'
      suppliers.value = []
    } finally {
      isLoading.value = false
    }
  }

  // Get single supplier
  const getSupplierById = async (id: string) => {
    isLoading.value = true
    try {
      const response = await path.get(`/suppliers/${id}`)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error loading supplier'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Create new supplier
  const createSupplier = async (supplierData: Omit<Supplier, 'id' | 'createdAt'>) => {
    isLoading.value = true
    try {
      const response = await path.post('/suppliers', supplierData)
      suppliers.value.unshift(response.data)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error creating supplier'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Update supplier
  const updateSupplier = async (id: string, supplierData: Partial<Supplier>) => {
    isLoading.value = true
    try {
      const response = await path.put(`/admin/suppliers/${id}`, supplierData)
      const index = suppliers.value.findIndex(s => s.id === id)
      if (index !== -1) suppliers.value[index] = response.data
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error updating supplier'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Delete supplier
  const deleteSupplier = async (id: string) => {
    isLoading.value = true
    try {
      await path.delete(`/suppliers/${id}`)
      suppliers.value = suppliers.value.filter(s => s.id !== id)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error deleting supplier'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    suppliers,
    isLoading,
    error,
    fetchSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier
  }
})
