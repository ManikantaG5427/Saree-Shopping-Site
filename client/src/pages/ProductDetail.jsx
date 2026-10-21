import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronRight, 
  Heart, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  Star, 
  Check, 
  Video, 
  Scissors, 
  MapPin, 
  X
} from 'lucide-react';
import { getProductById, getProductsByCategory } from '../data/mockData';
import { Button } from '../components/ui/Button';
import { formatPrice, calculateDiscount, cn } from '../lib/utils';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useLocationContext } from '../contexts/LocationContext';
import { ProductCard } from '../components/product/ProductCard';

const trustPillars = [
  { icon: ShieldCheck, title: 'Silk Mark Certified', desc: '100% natural pure silk guarantee' },
  { icon: Scissors, title: 'Complimentary Fall & Pico', desc: 'Pre-stitched & ready to drape' },
  { icon: Truck, title: 'Insured Express Shipping', desc: 'Free all-India delivery over ₹1,999' },
  { icon: RotateCcw, title: '7-Day Easy Exchange', desc: 'Hassle-free support guarantee' },
];

export function ProductDetail() {
  const { id } = useParams();
  const product = getProductById(id || '');
  const relatedProducts = product ? getProductsByCategory(product.category).filter(p => p.id !== product.id).slice(0, 4) : [];
  
  const { addToCart, isInCart, getCartQuantity } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { location, updatePincode } = useLocationContext();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoBooked, setVideoBooked] = useState(false);

  // Pincode input local state
  const [pincodeInput, setPincodeInput] = useState(location.pincode);
  const [pincodeChecked, setPincodeChecked] = useState(true);
  const [pincodeError, setPincodeError] = useState('');

  // Value-Added Services (VAS)
  const [includeFallPico, setIncludeFallPico] = useState(true);
  const [includeMaggamBlouse, setIncludeMaggamBlouse] = useState(false);
  const [includeGiftPacking, setIncludeGiftPacking] = useState(false);

  const inCart = product ? isInCart(product.id) : false;
  const inWishlist = product ? isInWishlist(product.id) : false;
  const cartQuantity = product ? getCartQuantity(product.id) : 0;
  const maxQuantity = product?.stock || 1;
  const discount = product?.originalPrice ? calculateDiscount(product.originalPrice, product.price) : 0;

  useEffect(() => {
    setPincodeInput(location.pincode);
  }, [location.pincode]);

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (updatePincode(pincodeInput)) {
      setPincodeChecked(true);
      setPincodeError('');
    } else {
      setPincodeError('Please enter a valid 6-digit Indian pincode');
    }
  };

  const handleAddToCart = () => {
    if (!product || maxQuantity <= 0) return;
    setIsAdding(true);
    addToCart(product, quantity);
    setTimeout(() => setIsAdding(false), 800);
  };

  const handleBuyNow = () => {
    if (!product || maxQuantity <= 0) return;
    setIsAdding(true);
    addToCart(product, quantity);
    setTimeout(() => {
      setIsAdding(false);
      window.location.href = '/checkout';
    }, 400);
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf7f2]">
        <div className="text-center p-8 bg-white border border-stone-200 rounded-xs shadow-md max-w-md">
          <h1 className="font-serif text-2xl font-bold text-stone-900 mb-2">Weave Not Found</h1>
          <p className="text-stone-600 text-xs mb-6">The requested handloom saree does not exist or has been archived.</p>
          <Link to="/products">
            <Button className="bg-[#721224] text-white text-xs uppercase tracking-wider">
              Browse All Sarees
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#1c1917]">
      {/* Breadcrumb Navigation */}
      <nav className="bg-white border-b border-stone-200" aria-label="Breadcrumb">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center gap-1.5 text-xs text-stone-500">
            <li><Link to="/" className="hover:text-[#721224]">Home</Link></li>
            <li><ChevronRight className="w-3.5 h-3.5 text-stone-300" /></li>
            <li><Link to="/products" className="hover:text-[#721224]">Collections</Link></li>
            <li><ChevronRight className="w-3.5 h-3.5 text-stone-300" /></li>
            <li>
              <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-[#721224]">
                {product.category}
              </Link>
            </li>
            <li><ChevronRight className="w-3.5 h-3.5 text-stone-300" /></li>
            <li className="text-stone-900 font-semibold truncate max-w-xs">{product.name}</li>
          </ol>
        </div>
      </nav>

      {/* Main Product Showcase Section */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Image Gallery (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative aspect-[3/4] rounded-xs overflow-hidden bg-stone-100 border border-stone-200 shadow-md">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover object-top transition-all duration-300"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                  {product.badge && (
                    <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-[#c5a059] text-stone-950 rounded-xs shadow-md">
                      {product.badge}
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-[#721224] text-white rounded-xs shadow-md">
                      {discount}% OFF
                    </span>
                  )}
                </div>

                {/* Silk Mark Seal in Corner */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-xs border border-stone-200 flex items-center gap-1.5 shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-900">
                    Silk Mark
                  </span>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      'flex-shrink-0 w-20 h-24 rounded-xs overflow-hidden border-2 transition-all',
                      index === selectedImage ? 'border-[#721224] ring-1 ring-[#721224]' : 'border-stone-200 hover:border-stone-400 opacity-80 hover:opacity-100'
                    )}
                    aria-label={`View weave angle ${index + 1}`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Live Video Drape Banner */}
              <div className="p-4 bg-[#f5eedf] border border-[#c5a059]/50 rounded-xs flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#721224] text-[#f5eedf] flex items-center justify-center flex-shrink-0 shadow-xs">
                    <Video className="w-4 h-4 text-[#c5a059]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xs sm:text-sm font-bold text-stone-900 leading-snug">
                      See This Exact Drape on WhatsApp Video
                    </h3>
                    <p className="text-[11px] text-stone-600">
                      Live natural daylight verification of zari lustre & pleats.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsVideoModalOpen(true)}
                  className="px-3.5 py-2 bg-[#721224] hover:bg-[#520815] text-[#f5eedf] text-[11px] font-semibold uppercase tracking-wider rounded-xs flex-shrink-0 transition-colors"
                >
                  Book Drape
                </button>
              </div>
            </div>

            {/* Right Column: Buying Details & VAS (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs uppercase tracking-[0.2em] text-[#c5a059] font-bold">
                    {product.fabric || product.category}
                  </span>
                  
                  <div className="flex items-center gap-1.5 bg-white border border-stone-200 px-2.5 py-1 rounded-xs text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span className="font-bold text-stone-900">{product.rating}</span>
                    <span className="text-stone-400">|</span>
                    <span className="text-stone-600">{product.reviewCount} Verified Ratings</span>
                  </div>
                </div>

                <h1 className="font-serif text-2xl sm:text-4xl font-normal text-stone-900 mt-2 leading-tight">
                  {product.name}
                </h1>

                <p className="text-xs text-stone-500 mt-1">
                  SKU: <span className="font-mono text-stone-700">SLSH-{(product.id || '').slice(0, 8).toUpperCase()}</span> • Silk Mark Authorization Tag Attached
                </p>
              </div>

              {/* Price & Savings */}
              <div className="p-4 bg-white border border-stone-200 rounded-xs flex items-baseline gap-4 shadow-xs">
                <span className="font-serif text-3xl sm:text-4xl font-bold text-[#721224]">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-base sm:text-lg text-stone-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {discount > 0 && (
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xs">
                    Save {discount}% ({formatPrice(product.originalPrice - product.price)})
                  </span>
                )}
                <span className="text-[11px] text-stone-500 ml-auto hidden sm:inline">
                  (Inclusive of all taxes & Silk Mark duties)
                </span>
              </div>

              {/* Real-Time Pincode Delivery Estimator */}
              <div className="p-4 bg-white border border-stone-200 rounded-xs space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-800">
                    <Truck className="w-4 h-4 text-[#721224]" />
                    <span>Delivery & COD Availability</span>
                  </div>
                  <span className="text-[11px] text-emerald-800 font-semibold">
                    Free Express Shipping
                  </span>
                </div>

                <form onSubmit={handlePincodeCheck} className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      maxLength={6}
                      value={pincodeInput}
                      onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 6-digit Pincode"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xs font-mono focus:outline-none focus:border-[#721224]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#721224] hover:bg-[#520815] text-[#f5eedf] text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors"
                  >
                    Check
                  </button>
                </form>
                {pincodeError && <p className="text-xs text-red-600">{pincodeError}</p>}

                {pincodeChecked && (
                  <div className="pt-2 border-t border-stone-100 text-xs text-stone-600 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                      <span>
                        Estimated Delivery by <strong className="text-stone-900">{location.estimatedDelivery}</strong> for <strong className="text-stone-900">{location.city} ({location.pincode})</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                      <span>Cash on Delivery (COD) is available at this address.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                      <span>Complimentary hand-knotted fall & pico hemming included with this order.</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Value-Added Services (VAS) Customizations */}
              <div className="p-4 bg-white border border-stone-200 rounded-xs space-y-3 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#721224] block">
                  Customization & Finishing Add-Ons
                </span>

                <div className="space-y-2 text-xs">
                  <label className="flex items-center justify-between p-2.5 bg-stone-50 border border-stone-200 rounded-xs cursor-pointer hover:border-[#721224]">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={includeFallPico}
                        onChange={(e) => setIncludeFallPico(e.target.checked)}
                        className="w-4 h-4 text-[#721224] rounded-xs"
                      />
                      <div>
                        <p className="font-semibold text-stone-900">Complimentary Fall, Pico & Knotted Tassels</p>
                        <p className="text-[10px] text-stone-500">Hand-finished by our master tailors before dispatch</p>
                      </div>
                    </div>
                    <span className="font-bold text-emerald-800 uppercase text-[10px] bg-emerald-100 px-2 py-0.5 rounded-xs">
                      FREE (₹0)
                    </span>
                  </label>

                  <label className="flex items-center justify-between p-2.5 bg-stone-50 border border-stone-200 rounded-xs cursor-pointer hover:border-[#721224]">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={includeMaggamBlouse}
                        onChange={(e) => setIncludeMaggamBlouse(e.target.checked)}
                        className="w-4 h-4 text-[#721224] rounded-xs"
                      />
                      <div>
                        <p className="font-semibold text-stone-900">Custom Maggam Work & Blouse Stitching</p>
                        <p className="text-[10px] text-stone-500">Our stylist coordinates your exact measurements on WhatsApp</p>
                      </div>
                    </div>
                    <span className="font-bold text-[#721224] text-xs">
                      +₹1,499
                    </span>
                  </label>

                  <label className="flex items-center justify-between p-2.5 bg-stone-50 border border-stone-200 rounded-xs cursor-pointer hover:border-[#721224]">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={includeGiftPacking}
                        onChange={(e) => setIncludeGiftPacking(e.target.checked)}
                        className="w-4 h-4 text-[#721224] rounded-xs"
                      />
                      <div>
                        <p className="font-semibold text-stone-900">Royal Wedding Hard-Box Gift Packaging</p>
                        <p className="text-[10px] text-stone-500">Gold foiled keepsake box with personalized note</p>
                      </div>
                    </div>
                    <span className="font-bold text-stone-700 text-xs">
                      +₹199
                    </span>
                  </label>
                </div>
              </div>

              {/* Quantity & Primary Action Buttons */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-700">Quantity:</span>
                  <div className="flex items-center border border-stone-300 rounded-xs bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="px-3 py-1.5 text-stone-600 hover:bg-stone-50 disabled:opacity-40"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-mono font-bold text-xs">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                      disabled={quantity >= maxQuantity}
                      className="px-3 py-1.5 text-stone-600 hover:bg-stone-50 disabled:opacity-40"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  {maxQuantity <= 4 && maxQuantity > 0 && (
                    <span className="text-xs text-amber-700 font-bold">
                      Hurry, only {maxQuantity} pieces left in loom stock!
                    </span>
                  )}
                </div>

                <div className="flex gap-3 flex-wrap">
                  <Button
                    onClick={handleAddToCart}
                    disabled={maxQuantity <= 0 || isAdding}
                    isLoading={isAdding}
                    className="flex-1 min-w-[200px] bg-[#721224] hover:bg-[#520815] text-[#f5eedf] text-xs uppercase tracking-[0.18em] py-4 rounded-xs font-semibold shadow-md flex items-center justify-center gap-2"
                  >
                    {inCart ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>In Shopping Bag ({cartQuantity})</span>
                      </>
                    ) : (
                      <span>Add to Shopping Bag</span>
                    )}
                  </Button>

                  <Button
                    onClick={handleBuyNow}
                    disabled={maxQuantity <= 0 || isAdding}
                    className="flex-1 min-w-[200px] bg-stone-900 hover:bg-black text-white text-xs uppercase tracking-[0.18em] py-4 rounded-xs font-semibold shadow-md"
                  >
                    Instant Buy Now
                  </Button>

                  <button
                    onClick={() => toggleWishlist(product)}
                    className={cn(
                      'p-4 border rounded-xs transition-colors flex items-center justify-center',
                      inWishlist
                        ? 'border-red-300 bg-red-50 text-red-600'
                        : 'border-stone-300 bg-white text-stone-600 hover:bg-stone-50 hover:text-[#721224]'
                    )}
                    aria-label={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    title="Save to Wishlist"
                  >
                    <Heart className={cn('w-5 h-5', inWishlist && 'fill-[#721224] text-[#721224]')} />
                  </button>
                </div>
              </div>

              {/* 4 Trust Pillars Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-stone-200">
                {trustPillars.map((item) => (
                  <div key={item.title} className="p-3 bg-white border border-stone-200 rounded-xs text-center space-y-1">
                    <item.icon className="w-5 h-5 text-[#721224] mx-auto" />
                    <p className="font-serif text-xs font-bold text-stone-900">{item.title}</p>
                    <p className="text-[10px] text-stone-500 leading-tight">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Deep Specifications & Weave Authenticity Tabs */}
          <div className="mt-16 bg-white border border-stone-200 rounded-xs p-6 sm:p-8 shadow-xs">
            <h2 className="font-serif text-2xl font-normal text-stone-900 mb-4 pb-2 border-b border-stone-200">
              Handloom Artistry & Authenticity Specifications
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs text-stone-700">
              <div className="p-4 bg-stone-50 rounded-xs space-y-2">
                <span className="font-bold text-[#721224] uppercase tracking-wider block">Weave & Fabric</span>
                <p><strong>Fabric:</strong> {product.fabric || 'Pure Mulberry Silk'}</p>
                <p><strong>Weaving Technique:</strong> {product.work || 'Pure Gold Zari Jacquard Handloom'}</p>
                <p><strong>Saree Length:</strong> 5.5 Meters (Full Standard Drape)</p>
                <p><strong>Blouse Piece:</strong> Included (0.8 Meters Running / Contrast)</p>
              </div>

              <div className="p-4 bg-stone-50 rounded-xs space-y-2">
                <span className="font-bold text-[#721224] uppercase tracking-wider block">Occasion & Styling</span>
                <p><strong>Best Suited For:</strong> {product.occasion || 'Weddings, Receptions & Grand Festive Occasions'}</p>
                <p><strong>Primary Color:</strong> {product.color || 'Royal Jewel Tone'}</p>
                <p><strong>Zari Purity:</strong> Tested Half-Fine & Tested Pure Metallic Zari</p>
                <p><strong>Fall & Pico:</strong> Complimentary Pre-Hemming Included</p>
              </div>

              <div className="p-4 bg-stone-50 rounded-xs space-y-2">
                <span className="font-bold text-[#721224] uppercase tracking-wider block">Certification & Care</span>
                <p><strong>Silk Mark Authority:</strong> Certified by Silk Mark Organization of India</p>
                <p><strong>Wash Care:</strong> Dry Clean Only. Never machine wash.</p>
                <p><strong>Storage:</strong> Wrap in clean muslin cloth and store in a cool, dry closet.</p>
                <p><strong>Origin:</strong> Direct from Generational Artisan Looms</p>
              </div>
            </div>
          </div>

          {/* Related Sarees */}
          {relatedProducts.length > 0 && (
            <section className="mt-16 pt-12 border-t border-stone-200">
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#c5a059] font-semibold block mb-1">
                    CURATED SUGGESTIONS
                  </span>
                  <h2 className="font-serif text-3xl font-normal text-stone-900 tracking-wide">
                    You May Also Cherish
                  </h2>
                </div>
                <Link
                  to="/products"
                  className="text-xs font-semibold uppercase tracking-wider text-[#721224] hover:underline"
                >
                  View All Weaves →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </section>
          )}
        </div>
      </section>

      {/* 1-on-1 WhatsApp Video Drape Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#faf7f2] max-w-md w-full rounded-xs border border-[#c5a059] shadow-2xl p-6 relative">
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 text-stone-500 hover:text-stone-900"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-4">
              <div className="w-10 h-10 rounded-full bg-[#721224] text-[#f5eedf] flex items-center justify-center mx-auto mb-2">
                <Video className="w-5 h-5 text-[#c5a059]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Book Video Drape for {product.name}
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Our showroom draper will connect with you via WhatsApp Video call to show pleats and daylight colors.
              </p>
            </div>

            {videoBooked ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-lg font-bold text-stone-900">Appointment Confirmed</h4>
                <p className="text-xs text-stone-600">
                  Our showroom draper will connect on WhatsApp within 15 minutes.
                </p>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Your WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    defaultValue="+91 "
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 border border-stone-300 rounded-xs bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Preferred Time Slot
                  </label>
                  <select className="w-full px-3 py-2 border border-stone-300 rounded-xs bg-white text-xs">
                    <option>Immediate / Next 15 Minutes</option>
                    <option>Morning (11:00 AM - 1:00 PM)</option>
                    <option>Afternoon (2:00 PM - 5:00 PM)</option>
                    <option>Evening (6:00 PM - 8:30 PM)</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => setVideoBooked(true)}
                  className="w-full py-3 bg-[#721224] hover:bg-[#520815] text-[#f5eedf] text-xs font-semibold uppercase tracking-wider rounded-xs shadow-md transition-colors mt-2"
                >
                  Schedule Video Call
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
