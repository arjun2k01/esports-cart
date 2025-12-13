// src/pages/CheckoutPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import api from "../lib/axios";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/AppProviders";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { cart, cartTotal, clearCart } = useCart();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }
    if (!cart?.length) {
      navigate("/cart");
      return;
    }
    if (user) {
      setValue("name", user.name || "");
      setValue("email", user.email || "");
    }
  }, [isAuthenticated, cart, user, navigate, setValue]);

  const pricing = useMemo(() => {
    const itemsPrice = cartTotal || 0;
    const shippingPrice = itemsPrice >= 500 ? 0 : 50;
    const taxPrice = Math.round(itemsPrice * 0.18);
    const totalPrice = itemsPrice + shippingPrice + taxPrice;
    return { itemsPrice, shippingPrice, taxPrice, totalPrice };
  }, [cartTotal]);

  const onSubmit = async (formData) => {
    try {
      setLoading(true);

      // COD only (as you asked)
      const paymentMethod = "cod";

      const orderData = {
        orderItems: cart.map((item) => ({
          product: item._id,
          name: item.name,
          image: item.image,
          price: item.price,
          qty: item.qty, // AppProviders uses qty
        })),
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          state: formData.state,
          country: formData.country || "India",
          phone: formData.phone,
        },
        paymentMethod,
        itemsPrice: pricing.itemsPrice,
        taxPrice: pricing.taxPrice,
        shippingPrice: pricing.shippingPrice,
        totalPrice: pricing.totalPrice,
      };

      // ✅ Correct backend route
      const { data } = await api.post("/api/orders", orderData);

      if (data?._id) {
        clearCart();
        toast.success("Order placed successfully!");
        navigate(`/order-confirmation/${data._id}`, { replace: true });
        return;
      }

      toast.error("Order placed but response was unexpected.");
    } catch (error) {
      console.error("Order placement error:", error);
      toast.error(error?.response?.data?.message || "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold">Checkout</h1>
      <p className="mt-1 opacity-70">Cash on Delivery (COD)</p>

      <div className="grid md:grid-cols-2 gap-8 mt-8">
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm opacity-80">Full Name</label>
            <input
              className="w-full mt-1 px-3 py-2 rounded border border-white/10 bg-transparent"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name ? (
              <p className="text-sm mt-1 text-red-300">{errors.name.message}</p>
            ) : null}
          </div>

          <div>
            <label className="text-sm opacity-80">Email</label>
            <input
              className="w-full mt-1 px-3 py-2 rounded border border-white/10 bg-transparent"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email ? (
              <p className="text-sm mt-1 text-red-300">{errors.email.message}</p>
            ) : null}
          </div>

          <div>
            <label className="text-sm opacity-80">Phone</label>
            <input
              className="w-full mt-1 px-3 py-2 rounded border border-white/10 bg-transparent"
              {...register("phone", { required: "Phone is required" })}
            />
            {errors.phone ? (
              <p className="text-sm mt-1 text-red-300">{errors.phone.message}</p>
            ) : null}
          </div>

          <div>
            <label className="text-sm opacity-80">Address</label>
            <input
              className="w-full mt-1 px-3 py-2 rounded border border-white/10 bg-transparent"
              {...register("address", { required: "Address is required" })}
            />
            {errors.address ? (
              <p className="text-sm mt-1 text-red-300">{errors.address.message}</p>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm opacity-80">City</label>
              <input
                className="w-full mt-1 px-3 py-2 rounded border border-white/10 bg-transparent"
                {...register("city", { required: "City is required" })}
              />
              {errors.city ? (
                <p className="text-sm mt-1 text-red-300">{errors.city.message}</p>
              ) : null}
            </div>

            <div>
              <label className="text-sm opacity-80">State</label>
              <input
                className="w-full mt-1 px-3 py-2 rounded border border-white/10 bg-transparent"
                {...register("state", { required: "State is required" })}
              />
              {errors.state ? (
                <p className="text-sm mt-1 text-red-300">{errors.state.message}</p>
              ) : null}
            </div>
          </div>

          <div>
            <label className="text-sm opacity-80">Postal Code</label>
            <input
              className="w-full mt-1 px-3 py-2 rounded border border-white/10 bg-transparent"
              {...register("postalCode", { required: "Postal code is required" })}
            />
            {errors.postalCode ? (
              <p className="text-sm mt-1 text-red-300">{errors.postalCode.message}</p>
            ) : null}
          </div>

          <button
            disabled={loading}
            className="w-full mt-4 px-4 py-3 rounded font-semibold border border-white/10 hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Placing order…" : "Place Order (COD)"}
          </button>
        </form>

        {/* Summary */}
        <div className="rounded-xl border border-white/10 p-4">
          <h2 className="font-semibold">Order Summary</h2>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="opacity-80">Items</span>
              <span>₹{pricing.itemsPrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-80">Shipping</span>
              <span>₹{pricing.shippingPrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-80">Tax (18%)</span>
              <span>₹{pricing.taxPrice}</span>
            </div>
            <div className="flex justify-between font-semibold pt-2 border-t border-white/10">
              <span>Total</span>
              <span>₹{pricing.totalPrice}</span>
            </div>
          </div>

          <div className="mt-4 text-sm opacity-70">
            COD available • Free shipping above ₹500
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
