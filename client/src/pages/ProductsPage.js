import React from 'react'
import Products from '../components/Products'

function ProductsPage({onAddToCart}) {
  return (
    <div>
      <Products onAddToCart={onAddToCart} />
    </div>
  )
}

export default ProductsPage