export const useProductFilter = () => {
  const search = ref('')
  const category = ref('')
  const brand = ref('')
  const minPrice = ref<number | null>(null)
  const maxPrice = ref<number | null>(null)

  return {
    search,
    category,
    brand,
    minPrice,
    maxPrice
  }
}