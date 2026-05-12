// types/product.ts
export interface Product {
  id: number
  name: string
  category: string
  brand: string
  price: number
  stock: number
  status: 'active' | 'inactive'
  image: string
}