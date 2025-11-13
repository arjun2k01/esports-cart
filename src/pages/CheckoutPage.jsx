// src/pages/CheckoutPage.jsx

import React, { memo, Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { useCart, useOrders, useToast, useAuth } from '../context/AppProviders'
import { CreditCard, Loader2 } from 'lucide-react'

const OrderSummary = React.lazy(() => import('../components/OrderSummary'))

// Memoize cart item render for performance
const CartItems = memo(({ cart }) => (
  <div
    className="space-y-2 max-h-60 overflow-y-auto mb-4 pr-2"
    aria-label="Your cart items"
  >
    {cart.map(item => (
      <div
        key={item._id || item.id}
        className="flex justify-between items-center text-gray-300"
        tabIndex={0}
        aria-label={`Product ${item.name}, Quantity ${item.quantity}, Price ₹${(item.price * item.quantity).toLocaleString('en-IN')}`}
      >
        <div className="flex items-center">
          <img
            src={item.image}
            alt={item.name}
            className="w-12 h-12 rounded-md object-cover mr-3"
          />
          <div>
            <p className="font-medium text-white">{item.name}</p>
            <p className="text-sm">Qty: {item.quantity}</p>
          </div>
        </div>
        <span className="font-medium text-white">
          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
        </span>
      </div>
    ))}
  </div>
))

export default function CheckoutPage({ setPage }) {
  const { cart, cartTotal, clearCart } = useCart()
  const { createOrder } = useOrders()
  const { showToast } = useToast()
  const { user } = useAuth()

  // RHF configuration
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      address: '',
      card: '1234 5678 9012 3456',
      expiry: '12/28',
      cvc: '123'
    }
  })

  // Accessible labels
  const labels = {
    name: 'Full Name',
    email: 'Email Address',
    address: 'Shipping Address',
    card: 'Card Number',
    expiry: 'Card Expiry',
    cvc: 'Card CVC'
  }

  const onSubmit = async data => {
    const orderData = {
      orderItems: cart,
      shippingAddress: { address: data.address },
      paymentMethod: 'MockCreditCard',
      totalPrice: cartTotal,
    }
    const result = await createOrder(orderData)
    if (result.success) {
      clearCart()
      showToast('Order placed successfully!')
      setPage('orderConfirmation')
    } else {
      showToast(result.error || 'Failed to place order', 'error')
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fadeIn" role="main">
      <h1 className="text-4xl font-extrabold text-white text-center mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          id="checkout-form"
          className="lg:col-span-2 bg-gray-800 p-8 rounded-lg shadow-xl space-y-4"
          aria-labelledby="checkout-heading"
        >
          <h2 id="checkout-heading" className="text-2xl font-bold text-white mb-4">Shipping Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                {labels.name}
              </label>
              <input
                {...register('name', { required: "Name is required" })}
                id="name"
                type="text"
                className="w-full rounded focus:ring-2 focus:ring-yellow-400 bg-gray-700 p-2"
                aria-invalid={!!errors.name}
                aria-describedby="name-error"
                autoComplete="name"
              />
              {errors.name && (
                <span id="name-error" className="text-red-400 text-xs">{errors.name.message}</span>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                {labels.email}
              </label>
              <input
                {...register('email', {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Enter a valid email"
                  }
                })}
                id="email"
                type="email"
                className="w-full rounded focus:ring-2 focus:ring-yellow-400 bg-gray-700 p-2"
                aria-invalid={!!errors.email}
                aria-describedby="email-error"
                autoComplete="email"
              />
              {errors.email && (
                <span id="email-error" className="text-red-400 text-xs">{errors.email.message}</span>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">
              {labels.address}
            </label>
            <input
              {...register('address', { required: "Address is required" })}
              id="address"
              type="text"
              className="w-full rounded focus:ring-2 focus:ring-yellow-400 bg-gray-700 p-2"
              aria-invalid={!!errors.address}
              aria-describedby="address-error"
              autoComplete="address"
              placeholder="Noida Sector 27"
            />
            {errors.address && (
              <span id="address-error" className="text-red-400 text-xs">{errors.address.message}</span>
            )}
          </div>
          <h2 className="text-2xl font-bold text-white mb-4 pt-6 border-t border-gray-700">Payment Details</h2>
          <div>
            <label htmlFor="card" className="block text-sm font-medium text-gray-300 mb-1">
              {labels.card}
            </label>
            <input
              {...register('card', {
                required: "Card number is required",
                minLength: { value: 19, message: "Invalid card number" }
              })}
              id="card"
              type="text"
              className="w-full rounded focus:ring-2 focus:ring-yellow-400 bg-gray-700 p-2"
              aria-invalid={!!errors.card}
              aria-describedby="card-error"
              inputMode="numeric"
              autoComplete="cc-number"
            />
            {errors.card && (
              <span id="card-error" className="text-red-400 text-xs">{errors.card.message}</span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiry" className="block text-sm font-medium text-gray-300 mb-1">
                {labels.expiry}
              </label>
              <input
                {...register('expiry', {
                  required: "Expiry is required",
                  pattern: {
                    value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                    message: "Invalid expiry (MM/YY)"
                  }
                })}
                id="expiry"
                type="text"
                className="w-full rounded focus:ring-2 focus:ring-yellow-400 bg-gray-700 p-2"
                aria-invalid={!!errors.expiry}
                aria-describedby="expiry-error"
                autoComplete="cc-exp"
                placeholder="MM/YY"
              />
              {errors.expiry && (
                <span id="expiry-error" className="text-red-400 text-xs">{errors.expiry.message}</span>
              )}
            </div>
            <div>
              <label htmlFor="cvc" className="block text-sm font-medium text-gray-300 mb-1">
                {labels.cvc}
              </label>
              <input
                {...register('cvc', {
                  required: "CVC is required",
                  minLength: { value: 3, message: "Invalid CVC" }
                })}
                id="cvc"
                type="text"
                className="w-full rounded focus:ring-2 focus:ring-yellow-400 bg-gray-700 p-2"
                aria-invalid={!!errors.cvc}
                aria-describedby="cvc-error"
                inputMode="numeric"
                autoComplete="cc-csc"
              />
              {errors.cvc && (
                <span id="cvc-error" className="text-red-400 text-xs">{errors.cvc.message}</span>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="mt-6 w-full bg-yellow-400 text-gray-900 text-lg hover:bg-yellow-300 flex items-center justify-center gap-2 py-2 rounded focus:outline-yellow-400 aria-busy:opacity-70"
            disabled={isSubmitting}
            aria-label="Place Order"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <>
                <CreditCard className="h-5 w-5" /> Place Order
              </>
            )}
          </button>
        </form>
        <div className="lg:col-span-1">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl sticky top-24" aria-label="Order summary section">
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Your Order</h2>
            <CartItems cart={cart} />
            <Suspense fallback={<div>Loading Order Summary...</div>}>
              <OrderSummary cartTotal={cartTotal} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
