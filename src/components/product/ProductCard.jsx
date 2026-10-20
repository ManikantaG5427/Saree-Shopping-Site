import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Check, Star, Truck, ShieldCheck } from 'lucide-react';
import { useCart } from '../../contexts/CartContext.jsx';
import { useWishlist } from '../../contexts/WishlistContext.jsx';
import { useLocationContext } from '../../contexts/LocationContext.jsx';
import { formatPrice, calculateDiscount, cn } from '../../lib/utils.js';

export function ProductCard({ product, variant = 'default' }) {
  const { addToCart, isInCart, getCartQuantity } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { location } = useLocationContext();

  const [isAdding, setIsAdding] = useState(false);

  const discount = product.originalPrice ? calculateDiscount(product.originalPrice, product.price) : 0;
  const inCart = isInCart(product.id);
  const inWishlist = isInWishlist(product.id);
  const cartQuantity = getCartQuantity(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 4;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    setIsAdding(true);
    addToCart(product, 1);
    setTimeout(() => setIsAdding(false), 800);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  // Compact Variant
  if (variant === 'compact') {
    return (
      <Link
        to={`/product/${product.id}`}
        className="flex gap-3.5 p-3 bg-white rounded-xs border border-stone-200 hover:border-[#721224] transition-colors group"
      >
        <div className="relative w-16 h-20 flex-shrink-0 overflow-hidden rounded-xs bg-stone-100">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h4 className="text-xs font-semibold text-stone-900 line-clamp-1 group-hover:text-[#721224] transition-colors">
            {product.name}
          </h4>
          <p className="text-[11px] text-stone-500 mt-0.5">{product.fabric || product.category}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-bold text-[#721224]">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-[10px] text-stone-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // Standard Storefront Product Card
  return (
    <div className="group flex flex-col bg-white border border-stone-200 rounded-xs overflow-hidden hover:shadow-xl hover:border-stone-300 transition-all duration-300">
      {/* 1. Image Container with 3:4 aspect ratio */}
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-106"
            loading="lazy"
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.badge && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#c5a059] text-stone-950 rounded-xs shadow-xs">
              {product.badge}
            </span>
          )}

          {discount > 0 && !isOutOfStock && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#721224] text-white rounded-xs shadow-xs">
              {discount}% OFF
            </span>
          )}

          {isLowStock && (
            <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-amber-600 text-white rounded-xs">
              Only {product.stock} Left
            </span>
          )}
        </div>

        {/* Wishlist Heart Action */}
        <button
          onClick={handleToggleWishlist}
          className={cn(
            'absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-xs z-10 cursor-pointer',
            inWishlist
              ? 'bg-red-50 text-red-600 border border-red-200 scale-105'
              : 'bg-white/85 text-stone-600 hover:text-[#721224] hover:bg-white'
          )}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
          title={inWishlist ? 'Saved in Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={cn('w-4 h-4 transition-transform', inWishlist && 'fill-[#721224] text-[#721224] scale-110')} />
        </button>

        {/* Real-time Dispatch Banner */}
        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <div className="bg-[#181514]/90 backdrop-blur-xs text-[#f5eedf] text-[10px] px-2.5 py-1 rounded-xs flex items-center justify-between shadow-md">
            <span className="flex items-center gap-1 font-medium">
              <Truck className="w-3 h-3 text-[#c5a059]" />
              <span>{location?.isExpressAvailable ? 'Express Dispatch' : 'Standard Delivery'}</span>
            </span>
            <span className="text-[#c5a059] font-bold">{location?.pincode}</span>
          </div>
        </div>

        {isOutOfStock && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[1px] flex items-center justify-center">
            <span className="text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 bg-stone-950/90 rounded-xs">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* 2. Product Details */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Fabric / Category & Rating */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
            <span className="font-bold uppercase tracking-wider text-[#c5a059]">
              {product.fabric || product.category}
            </span>
            <div className="flex items-center gap-1 bg-stone-100 px-1.5 py-0.5 rounded-xs text-[10px] font-bold text-stone-800">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>{product.rating}</span>
              <span className="text-stone-400 font-normal">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <Link to={`/product/${product.id}`} className="block group-hover:text-[#721224] transition-colors">
            <h3 className="font-serif text-sm sm:text-base font-medium text-stone-900 line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Silk Mark & Free Fall/Pico tag */}
          <div className="flex items-center gap-2 mt-1.5 text-[10px] text-stone-500">
            <span className="flex items-center gap-1 text-emerald-800 font-semibold">
              <ShieldCheck className="w-3 h-3" />
              <span>Silk Mark Certified</span>
            </span>
            <span className="text-stone-300">•</span>
            <span>Free Fall & Pico</span>
          </div>
        </div>

        {/* 3. Pricing & Actions */}
        <div className="pt-2 border-t border-stone-100">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base sm:text-lg font-bold text-[#721224]">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-stone-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {discount > 0 && (
              <span className="text-[11px] font-bold text-emerald-800">
                ({discount}% off)
              </span>
            )}
          </div>

          {/* Action Button */}
          {isOutOfStock ? (
            <button
              disabled
              className="w-full py-2 text-xs font-semibold text-stone-400 bg-stone-100 rounded-xs cursor-not-allowed"
            >
              Out of Stock
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={cn(
                "w-full py-2.5 text-xs font-semibold uppercase tracking-wider rounded-xs border transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer",
                isAdding
                  ? "bg-emerald-800 text-white border-emerald-800"
                  : inCart
                  ? "border-[#721224] bg-[#721224]/5 text-[#721224] hover:bg-[#721224] hover:text-white"
                  : "bg-[#721224] hover:bg-[#520815] text-[#f5eedf] border-[#721224]"
              )}
            >
              {isAdding ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Added to Bag</span>
                </>
              ) : inCart ? (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>In Bag ({cartQuantity})</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>Add to Bag</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
