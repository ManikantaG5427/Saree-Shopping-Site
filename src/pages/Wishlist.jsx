import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowLeft, ShieldCheck, Star } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../lib/utils';
import { Button } from '../components/ui/Button';

export function Wishlist() {
  const { wishlist, toggleWishlist, clearWishlist } = useWishlist();
  const { addToCart, isInCart, getCartQuantity } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center py-20 px-4">
        <div className="text-center max-w-md mx-auto p-8 sm:p-10 bg-white border border-stone-200 rounded-xs shadow-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#721224]/10 text-[#721224] flex items-center justify-center">
            <Heart className="w-8 h-8" />
          </div>
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#c5a059] block mb-1">
            My Wishlist (0)
          </span>
          <h1 className="font-serif text-2xl font-bold text-stone-900 mb-2">
            Your Wishlist is Empty
          </h1>
          <p className="text-xs text-stone-600 mb-6 leading-relaxed">
            Explore our curated collections of pure Kanchipuram, Uppada Jamdani, and Banarasi drapes and save your favorite weaves.
          </p>
          <Link to="/products">
            <Button className="bg-[#721224] hover:bg-[#520815] text-[#f5eedf] text-xs uppercase tracking-wider px-6 py-3 rounded-xs">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Discover Handlooms
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-stone-200 mb-8">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#c5a059]">
              Curated Heirlooms
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-stone-900 mt-1">
              My Saved Wishlist
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              {wishlist.length} {wishlist.length === 1 ? 'weave' : 'weaves'} saved • Silk Mark Guarantee
            </p>
          </div>

          <button
            onClick={clearWishlist}
            className="text-xs font-semibold uppercase tracking-wider text-stone-500 hover:text-red-700 transition-colors"
          >
            Clear All
          </button>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => {
            const inCart = isInCart(product.id);
            const cartQty = getCartQuantity(product.id);

            return (
              <div
                key={product.id}
                className="bg-white border border-stone-200 rounded-xs overflow-hidden flex flex-col justify-between group hover:shadow-lg transition-all"
              >
                <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden">
                  <Link to={`/product/${product.id}`} className="block w-full h-full">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  <button
                    onClick={() => toggleWishlist(product)}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white text-stone-600 hover:text-red-600 flex items-center justify-center shadow-xs transition-colors"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4 text-stone-500 hover:text-red-600" />
                  </button>

                  <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-xs border border-stone-200 text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Silk Mark</span>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#c5a059] block mb-0.5">
                      {product.fabric || product.category}
                    </span>
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-serif text-base font-semibold text-stone-900 group-hover:text-[#721224] transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-1 text-xs text-stone-500 mt-1">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span className="font-bold text-stone-800">{product.rating}</span>
                      <span className="text-stone-400">({product.reviewCount})</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-base font-bold text-[#721224]">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-stone-400 line-through ml-1.5">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(product, 1)}
                    className="w-full py-2.5 bg-[#721224] hover:bg-[#520815] text-[#f5eedf] text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span>{inCart ? `In Bag (${cartQty})` : 'Move to Bag'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
