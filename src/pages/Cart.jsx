import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, Heart, ArrowLeft, MapPin, CheckCircle2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useLocationContext } from '../contexts/LocationContext';
import { formatPrice } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export function Cart() {
  const { items, subtotal, itemCount, updateQuantity, removeFromCart } = useCart();
  const { location, setIsPincodeModalOpen } = useLocationContext();
  
  const shipping = subtotal >= 1999 ? 0 : 199;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;
  const savings = items.reduce((sum, item) => {
    if (item.product.originalPrice) {
      return sum + (item.product.originalPrice - item.product.price) * item.quantity;
    }
    return sum;
  }, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center py-20">
        <div className="text-center max-w-lg mx-auto px-6 py-12 bg-white border border-stone-200 shadow-sm rounded-xs">
          <div className="w-20 h-20 mx-auto mb-6 bg-[#721224]/10 rounded-full flex items-center justify-center border border-[#721224]/20">
            <svg className="w-10 h-10 text-[#721224]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#c5a059] block mb-2">
            Shopping Bag (0)
          </span>
          <h1 className="font-serif text-3xl font-normal text-stone-900 mb-3">
            Your shopping bag is empty
          </h1>
          <p className="text-stone-600 text-sm mb-8 leading-relaxed font-light">
            Discover our curated handloom silks, pure Kanchipuram, and Banarasi drapes.
          </p>
          <Link to="/products">
            <Button size="lg" className="bg-[#721224] hover:bg-[#520815] text-[#f5eedf] text-xs uppercase tracking-widest px-8 py-3 rounded-xs shadow-md">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#c5a059]">
              Checkout Flow
            </span>
            <h1 className="font-serif text-3xl font-normal text-stone-900 mt-1">Shopping Bag</h1>
          </div>
          <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold">{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Delivery Pincode Bar */}
            <div className="p-3.5 bg-white border border-stone-200 rounded-xs flex items-center justify-between text-xs shadow-xs">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#721224]" />
                <div>
                  <span className="font-semibold text-stone-900">Deliver to: {location.pincode} ({location.city})</span>
                  <span className="text-stone-400 mx-1.5">•</span>
                  <span className="text-emerald-800 font-medium">{location.estimatedDelivery}</span>
                </div>
              </div>
              <button
                onClick={() => setIsPincodeModalOpen(true)}
                className="text-xs font-bold text-[#721224] uppercase tracking-wider underline hover:text-[#520815]"
              >
                Change
              </button>
            </div>

            {items.map((item) => (
              <CartItemCard
                key={item.product.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            ))}

            {/* Promo Code */}
            <Card className="p-5 border-stone-200 rounded-xs">
              <h3 className="font-serif text-base font-bold text-stone-900 mb-3">Festive Coupon Code</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="e.g. UTSAV10"
                  className="flex-1 px-3 py-2 text-xs border border-stone-300 rounded-xs uppercase tracking-wider focus:outline-none focus:border-[#721224]"
                />
                <Button variant="outline" className="text-xs uppercase tracking-wider">Apply</Button>
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 p-6 border-stone-200 rounded-xs shadow-xs">
              <h2 className="font-serif text-xl font-normal text-stone-900 mb-6 pb-2 border-b border-stone-200">
                Order Summary
              </h2>
              
              <div className="space-y-3 mb-6 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-600">Subtotal ({itemCount} items)</span>
                  <span className="font-semibold text-stone-900">{formatPrice(subtotal)}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-emerald-800 font-medium">
                    <span>Loom Discount Savings</span>
                    <span>-{formatPrice(savings)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-stone-600">Insured Shipping</span>
                  <span className="font-semibold text-stone-900">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">GST (5%)</span>
                  <span className="font-semibold text-stone-900">{formatPrice(tax)}</span>
                </div>
                <div className="border-t border-stone-200 pt-3">
                  <div className="flex justify-between text-base font-bold">
                    <span className="font-serif text-stone-900">Total Payable</span>
                    <span className="text-[#721224]">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-6 p-3.5 bg-stone-50 border border-stone-200 rounded-xs text-[11px] text-stone-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#c5a059] flex-shrink-0" />
                  <span>Silk Mark SMOI authorization included</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#c5a059] flex-shrink-0" />
                  <span>Complimentary shipping on orders above ₹1,999</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#c5a059] flex-shrink-0" />
                  <span>7-day transparent inspection return guarantee</span>
                </div>
              </div>

              <Link to="/checkout" className="block">
                <Button className="w-full bg-[#721224] hover:bg-[#520815] text-[#f5eedf] uppercase tracking-wider text-xs font-semibold py-4 rounded-xs shadow-md" size="lg">
                  Proceed to Checkout
                </Button>
              </Link>
            </Card>

            <div className="mt-6 text-center">
              <Link to="/products" className="text-[#721224] font-medium hover:underline flex items-center justify-center gap-1 text-xs uppercase tracking-wider">
                <ArrowLeft className="w-3.5 h-3.5" />
                Continue Browsing Catalog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartItemCard({ item, onUpdateQuantity, onRemove }) {
  const { product, quantity } = item;
  const isOutOfStock = product.stock <= 0;
  const maxQty = Math.max(1, product.stock);

  return (
    <Card className="p-4 flex gap-4 border-stone-200 rounded-xs shadow-xs">
      <Link to={`/product/${product.id}`} className="relative w-24 h-32 flex-shrink-0 rounded-xs overflow-hidden bg-stone-100">
        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="error" className="text-xs">Out of Stock</Badge>
          </div>
        )}
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <Link to={`/product/${product.id}`}>
              <h3 className="font-serif text-base font-semibold text-stone-900 hover:text-[#721224] transition-colors line-clamp-2">
                {product.name}
              </h3>
            </Link>
            <p className="text-xs text-stone-500 mt-0.5">{product.category}</p>
            {product.fabric && <p className="text-xs text-[#c5a059] font-medium">{product.fabric}</p>}
            <div className="flex items-center gap-3 mt-2">
              <span className="text-base font-bold text-[#721224]">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-xs text-stone-400 line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>
          </div>
          <button
            onClick={() => onRemove(product.id)}
            className="p-2 text-stone-400 hover:text-red-600 transition-colors flex-shrink-0"
            aria-label="Remove from cart"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center border border-stone-300 rounded-xs">
            <button
              onClick={() => onUpdateQuantity(product.id, quantity - 1)}
              disabled={quantity <= 1 || isOutOfStock}
              className="px-2.5 py-1 text-stone-600 hover:bg-stone-50 disabled:opacity-40"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1;
                onUpdateQuantity(product.id, Math.min(maxQty, Math.max(1, val)));
              }}
              className="w-10 text-center font-mono text-xs border-x border-stone-300 focus:outline-none"
              min={1}
              max={maxQty}
              disabled={isOutOfStock}
            />
            <button
              onClick={() => onUpdateQuantity(product.id, quantity + 1)}
              disabled={quantity >= maxQty || isOutOfStock}
              className="px-2.5 py-1 text-stone-600 hover:bg-stone-50 disabled:opacity-40"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1 text-stone-500 hover:text-[#721224] transition-colors text-xs">
              <Heart className="w-3.5 h-3.5" />
              <span>Save for later</span>
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
