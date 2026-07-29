"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "./Cartcontext";
import Image from "next/image";
import type { CartProduct } from "@/types/cart";

const CartDrawer: React.FC = () => {
  const { cart, removeFromCart, clearCart, toggleCart, isOpen } = useCart();

  const subtotal = cart.reduce(
    (sum: number, item: CartProduct) => sum + item.price * item.quantity,
    0
  );

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 20 }}
          className="fixed top-0 right-0 w-96 h-full bg-[#0b0b0b] text-white shadow-lg border-l border-gray-700 z-50 flex flex-col"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-700">
            <h2 className="text-lg font-bold text-[#2563EB]">Your Cart</h2>
            <button
              onClick={toggleCart}
              className="text-white hover:text-[#2563EB] text-xl"
            >
              ✕
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
            {cart.length === 0 ? (
              <p className="text-gray-600 text-sm">Your cart is empty.</p>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[auto,1fr,auto] items-center gap-3 border-b border-gray-700 pb-2"
                >
                  {/* Image */}
                  <div className="relative w-14 h-14 flex-shrink-0 rounded overflow-hidden border border-gray-600">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-contain"
                    />
                  </div>

                  {/* Name + Price */}
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{item.name}</span>
                    <span className="text-xs text-gray-600">
                      {item.quantity} × ${item.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-xs text-[#2563EB] hover:text-blue-600"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-700 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-bold text-white">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={clearCart}
                className="flex-1 bg-[#2563EB] text-white py-2 rounded hover:bg-blue-700 transition"
              >
                Clear
              </button>
              <button className="flex-1 bg-white text-black py-2 rounded hover:bg-gray-200 transition font-semibold">
                Checkout
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
