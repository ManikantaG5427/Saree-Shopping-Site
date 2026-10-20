import React, { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  ShoppingBag, 
  Search, 
  Heart, 
  Phone, 
  ChevronDown, 
  MapPin, 
  Truck, 
  Check, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  Video,
  Award
} from 'lucide-react';
import { cn, formatPrice } from '../../lib/utils.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useCart } from '../../contexts/CartContext.jsx';
import { useWishlist } from '../../contexts/WishlistContext.jsx';
import { useLocationContext } from '../../contexts/LocationContext.jsx';
import { products } from '../../data/mockData.js';
import { Button } from '../ui/Button.jsx';
import { Modal } from '../ui/Modal.jsx';
import { Input } from '../ui/Input.jsx';

const megaMenuColumns = [
  {
    title: 'Traditional Weaves',
    subtitle: 'Direct from loom master artisans',
    items: [
      { label: 'Pure Kanjeevaram Pattu', href: '/products?category=Pattu Sarees', badge: 'Silk Mark' },
      { label: 'Uppada Jamdani Silks', href: '/products?category=Uppada Silk Sarees', badge: 'Handloom' },
      { label: 'Banarasi Katan Brocade', href: '/products?fabric=Banarasi' },
      { label: 'Gadwal Handloom Cottons', href: '/products?category=Cotton Sarees' },
      { label: 'Organza & Soft Tissue', href: '/products?category=Fancy Sarees' },
      { label: 'Chanderi & Tussar Silks', href: '/products?category=Pattu Sarees' },
    ],
  },
  {
    title: 'Shop By Occasion',
    subtitle: 'Curated for defining celebrations',
    items: [
      { label: 'Bridal Muhurtham Trousseau', href: '/products?occasion=Wedding Celebrations', badge: 'Royal' },
      { label: 'Festive Dussehra & Diwali', href: '/products?occasion=Festive Elegance' },
      { label: 'Wedding Reception & Sangeet', href: '/products?occasion=Wedding Celebrations' },
      { label: 'Temple Poojas & Ceremonies', href: '/products?occasion=Traditional Gatherings' },
      { label: 'Everyday Handloom Ease', href: '/products?occasion=Everyday Sophistication' },
    ],
  },
  {
    title: 'Atelier & Blouses',
    subtitle: 'Bespoke boutique craftsmanship',
    items: [
      { label: 'Bridal Maggam Work Blouses', href: '/products?category=Ready-Made Blouses', badge: 'Bespoke' },
      { label: 'Ready-Made Padded Blouses', href: '/products?category=Ready-Made Blouses' },
      { label: 'Pure Silk Dress Materials', href: '/products?category=Dress Materials' },
      { label: 'Bespoke Embroidery Inquiry', href: '/#boutique-atelier' },
    ],
  },
  {
    title: 'SLSH Advantages',
    subtitle: 'Heritage buyer guarantees',
    items: [
      { label: 'Budget Silk Store (Under ₹4K)', href: '/products?price=0-4000', badge: 'Offer' },
      { label: '100% Silk Mark Certification', href: '/products?category=Pattu Sarees' },
      { label: '1-on-1 Video Call Drape', href: '/#video-drape' },
      { label: 'Complimentary Fall & Pico Hem', href: '/#buyer-benefits' },
    ],
  },
];

export function Header() {
  const locationPath = useLocation();
  const { user, logout, isLoading } = useAuth();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { location, isPincodeModalOpen, setIsPincodeModalOpen, updatePincode, quickPincodes } = useLocationContext();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isShopByOpen, setIsShopByOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  
  // Video Drape form state
  const [videoForm, setVideoForm] = useState({
    name: '',
    phone: '',
    category: 'Bridal Kanchipuram Pattu',
    slot: 'Morning (10:00 AM - 1:00 PM)',
  });
  const [videoSubmitted, setVideoSubmitted] = useState(false);

  // Pincode modal local state
  const [pincodeInput, setPincodeInput] = useState('');
  const [pincodeError, setPincodeError] = useState('');

  // Close menus on route change
  useEffect(() => {
    setIsShopByOpen(false);
    setIsSearchOpen(false);
    setIsMenuOpen(false);
  }, [locationPath.pathname, locationPath.search]);

  // Live matching products for real-time search
  const liveSearchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter((p) => 
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.fabric && p.fabric.toLowerCase().includes(q)) ||
        (p.work && p.work.toLowerCase().includes(q)) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      )
      .slice(0, 5);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const handlePincodeSubmit = (e) => {
    e.preventDefault();
    if (updatePincode(pincodeInput)) {
      setPincodeError('');
      setPincodeInput('');
      setIsPincodeModalOpen(false);
    } else {
      setPincodeError('Please enter a valid 6-digit Indian pincode.');
    }
  };

  const handleVideoDrapeSubmit = (e) => {
    e.preventDefault();
    setVideoSubmitted(true);
    setTimeout(() => {
      setIsVideoModalOpen(false);
      setVideoSubmitted(false);
      setVideoForm({
        name: '',
        phone: '',
        category: 'Bridal Kanchipuram Pattu',
        slot: 'Morning (10:00 AM - 1:00 PM)',
      });
    }, 2400);
  };

  return (
    <>
      {/* Accessibility Skip to Content */}
      <a
        href="#MainContent"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-[#721224] focus:text-white focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:shadow-lg focus:outline-none"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 bg-white/98 backdrop-blur-md border-b border-[#e7e0d6] shadow-xs">
        {/* ===================== TOP ANNOUNCEMENT & UTILITY BAR ===================== */}
        <div className="bg-[#480611] text-[#f7f2ea] py-1.5 px-4 sm:px-6 lg:px-8 border-b border-[#c5a059]/30 text-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Left: Silk Mark Announcement */}
            <div className="flex-1 overflow-hidden whitespace-nowrap flex items-center gap-2.5">
              <span className="bg-[#c5a059] text-stone-950 font-bold px-2 py-0.5 rounded-xs text-[9px] tracking-widest uppercase flex items-center gap-1 shadow-xs">
                Silk Mark Guaranteed
              </span>
              <span className="text-stone-200 text-[11px] tracking-wide truncate font-normal">
                Authentic Handloom Pure Silks • Complimentary Fall & Pico Hemming • Insured Priority Courier
              </span>
            </div>

            {/* Right: Location, Concierge & Video Drape Call-to-action */}
            <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0 text-[11px]">
              {/* Delivery Pincode Pill */}
              <button
                onClick={() => setIsPincodeModalOpen(true)}
                className="flex items-center gap-1.5 text-stone-200 hover:text-white bg-[#30030a] hover:bg-[#200206] px-2.5 py-0.5 rounded-xs border border-[#c5a059]/40 transition-colors cursor-pointer"
                title="Change delivery location"
                aria-label={`Deliver to ${location?.pincode}, ${location?.city}`}
              >
                <MapPin className="w-3 h-3 text-[#c5a059]" />
                <span className="font-semibold text-white">Deliver to: {location?.pincode}</span>
                <span className="hidden md:inline text-stone-300 font-normal">({location?.city})</span>
                <span className="text-[10px] uppercase tracking-wider text-[#c5a059] font-bold ml-1 underline underline-offset-2">
                  Change
                </span>
              </button>

              {/* 1-on-1 Video Drape Quick Trigger */}
              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="hidden lg:flex items-center gap-1 text-[#c5a059] hover:text-white transition-colors cursor-pointer font-medium tracking-wide"
                title="Schedule WhatsApp Video Drape"
              >
                <Video className="w-3 h-3" />
                <span>1-on-1 Video Drape</span>
              </button>

              {/* Helpline */}
              <div className="hidden xl:flex items-center gap-2 text-stone-300">
                <span className="text-stone-600">|</span>
                <a
                  href="tel:+919852985299"
                  className="flex items-center gap-1 text-stone-200 hover:text-[#c5a059] transition-colors"
                  title="Direct Concierge Helpline"
                >
                  <Phone className="w-3 h-3 text-[#c5a059]" />
                  <span className="font-medium">+91 98529 85299</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== PRIMARY NAVBAR ===================== */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
          <div className="flex items-center justify-between h-[74px] gap-4">
            {/* Left: Mobile Menu Toggle & Brand Logo */}
            <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
              <button
                className="lg:hidden p-1.5 text-stone-700 hover:text-[#721224] transition-colors cursor-pointer"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              {/* Brand Logo & Wordmark */}
              <Link to="/" className="flex items-center gap-3 group flex-shrink-0" aria-label="Sri Lakshmi Saree House Home">
                <div className="w-10 h-10 rounded-xs bg-[#721224] text-[#f5eedf] flex items-center justify-center font-serif text-lg font-bold border border-[#c5a059]/70 shadow-xs group-hover:bg-[#520815] group-hover:border-[#c5a059] transition-all flex-shrink-0">
                  SL
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-[17px] sm:text-[19px] xl:text-[20px] font-bold tracking-[0.14em] text-[#721224] group-hover:text-[#520815] transition-colors uppercase leading-none">
                    SRI LAKSHMI SAREE HOUSE
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.22em] text-stone-500 font-semibold mt-1">
                    ESTD. 2003 · HERITAGE HANDLOOMS
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: Desktop Navigation Links (Clean, uniform typography, perfectly spaced) */}
            <div className="hidden lg:flex items-center gap-4 xl:gap-6 justify-center flex-1">
              {/* Shop All */}
              <Link
                to="/products"
                className="relative py-2 text-[12px] font-semibold tracking-[0.14em] uppercase text-stone-700 hover:text-[#721224] transition-colors group whitespace-nowrap"
              >
                <span>Shop All</span>
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#c5a059] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>

              {/* Collections Mega Menu Dropdown */}
              <div
                className="relative group/collections py-2"
                onMouseEnter={() => setIsShopByOpen(true)}
                onMouseLeave={() => setIsShopByOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setIsShopByOpen(!isShopByOpen)}
                  className={cn(
                    "relative flex items-center gap-1 text-[12px] font-semibold tracking-[0.14em] uppercase transition-colors cursor-pointer whitespace-nowrap",
                    isShopByOpen ? "text-[#721224]" : "text-stone-700 group-hover/collections:text-[#721224]"
                  )}
                  aria-expanded={isShopByOpen}
                >
                  <span>Collections</span>
                  <ChevronDown className={cn(
                    "w-3.5 h-3.5 transition-transform duration-300 text-stone-400 group-hover/collections:rotate-180 group-hover/collections:text-[#721224]",
                    isShopByOpen && "rotate-180 text-[#721224]"
                  )} />
                  <span className={cn(
                    "absolute bottom-0 left-0 w-full h-[2px] bg-[#c5a059] transition-transform duration-300 origin-left scale-x-0 group-hover/collections:scale-x-100",
                    isShopByOpen && "scale-x-100"
                  )} />
                </button>

                {/* Mega Menu Popup Container with Invisible Hover Bridge */}
                <div
                  className={cn(
                    "absolute top-full -left-20 xl:-left-12 pt-3 z-50 transition-all duration-200 transform",
                    "opacity-0 -translate-y-1 pointer-events-none invisible",
                    "group-hover/collections:opacity-100 group-hover/collections:translate-y-0 group-hover/collections:pointer-events-auto group-hover/collections:visible",
                    isShopByOpen && "opacity-100 translate-y-0 pointer-events-auto visible"
                  )}
                >
                  <div className="w-[820px] xl:w-[860px] bg-white rounded-md shadow-2xl border border-stone-200/90 p-6">
                    <div className="grid grid-cols-4 gap-6">
                      {megaMenuColumns.map((col) => (
                        <div key={col.title} className="space-y-3">
                          <div className="border-b border-stone-100 pb-2">
                            <h4 className="font-serif text-[13.5px] font-bold text-stone-900 tracking-wide uppercase">
                              {col.title}
                            </h4>
                            <p className="text-[10px] text-stone-500 font-medium mt-0.5">
                              {col.subtitle}
                            </p>
                          </div>
                          <ul className="space-y-1.5">
                            {col.items.map((item) => (
                              <li key={item.label}>
                                <Link
                                  to={item.href}
                                  onClick={() => setIsShopByOpen(false)}
                                  className="group/item flex items-center justify-between text-[11.5px] text-stone-600 hover:text-[#721224] hover:translate-x-1 transition-all py-0.5 font-medium"
                                >
                                  <span>{item.label}</span>
                                  {item.badge && (
                                    <span className="text-[9px] uppercase px-1.5 py-0.2 rounded-xs font-semibold bg-[#faf7f2] text-[#c5a059] border border-[#c5a059]/30">
                                      {item.badge}
                                    </span>
                                  )}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    {/* Bottom Promo Strip inside Mega Menu */}
                    <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between bg-[#faf7f2] p-3 rounded-xs text-xs text-stone-700">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#721224] flex-shrink-0" />
                        <span className="text-[11px] font-medium">
                          All pure silks certified by Silk Mark India • Free fall & pico hemming included with every drape.
                        </span>
                      </div>
                      <Link
                        to="/products"
                        onClick={() => setIsShopByOpen(false)}
                        className="text-[#721224] font-semibold uppercase tracking-wider text-[11px] hover:text-[#520815] hover:underline flex items-center gap-1 flex-shrink-0"
                      >
                        <span>View All Catalogs</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pure Pattu Silks */}
              <Link
                to="/products?category=Pattu Sarees"
                className="relative py-2 text-[12px] font-semibold tracking-[0.14em] uppercase text-stone-700 hover:text-[#721224] transition-colors group whitespace-nowrap"
              >
                <span>Pattu Silks</span>
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#c5a059] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>

              {/* Uppada Jamdani */}
              <Link
                to="/products?category=Uppada Silk Sarees"
                className="relative py-2 text-[12px] font-semibold tracking-[0.14em] uppercase text-stone-700 hover:text-[#721224] transition-colors group whitespace-nowrap"
              >
                <span>Uppada</span>
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#c5a059] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>

              {/* Banarasi Brocade */}
              <Link
                to="/products?fabric=Banarasi"
                className="relative py-2 text-[12px] font-semibold tracking-[0.14em] uppercase text-stone-700 hover:text-[#721224] transition-colors group whitespace-nowrap"
              >
                <span>Banarasi</span>
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#c5a059] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>

              {/* New Arrivals */}
              <Link
                to="/products?sort=new"
                className="relative py-2 text-[12px] font-semibold tracking-[0.14em] uppercase text-stone-700 hover:text-[#721224] transition-colors group flex items-center gap-1 whitespace-nowrap"
              >
                <span>New In</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#721224] animate-pulse" />
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#c5a059] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            </div>

            {/* Right: Search, Wishlist, Shopping Bag, Account (Guaranteed no overflow) */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Search Trigger Icon */}
              <button
                className="w-9 h-9 flex items-center justify-center rounded-full text-stone-700 hover:text-[#721224] hover:bg-stone-100 transition-colors cursor-pointer border border-transparent hover:border-stone-200"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Search catalog"
                title="Search Sarees"
              >
                <Search className="w-4.5 h-4.5" />
              </button>

              {/* Wishlist Icon with Floating Badge */}
              <Link
                to="/wishlist"
                className="relative w-9 h-9 flex items-center justify-center rounded-full text-stone-700 hover:text-[#721224] hover:bg-stone-100 transition-colors border border-transparent hover:border-stone-200"
                aria-label={`Wishlist, ${wishlistCount} items`}
                title="My Wishlist"
              >
                <Heart className="w-4.5 h-4.5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#721224] text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Bag Button with Badge */}
              <Link
                to="/cart"
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#721224] hover:bg-[#520815] text-[#f5eedf] rounded-full transition-all shadow-xs hover:shadow-sm cursor-pointer flex-shrink-0"
                aria-label={`Shopping Bag, ${itemCount} items`}
                title="Shopping Bag"
              >
                <ShoppingBag className="w-4 h-4 text-[#c5a059]" />
                <span className="text-[11px] uppercase tracking-wider font-semibold">Bag</span>
                <span className="w-4 h-4 bg-[#c5a059] text-stone-950 text-[10px] font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              </Link>

              {/* User Account / Sign In */}
              {isLoading ? (
                <div className="w-8 h-8 rounded-full bg-stone-200 animate-pulse hidden sm:block" />
              ) : user ? (
                <div className="relative group/user py-2 hidden sm:block flex-shrink-0">
                  <button className="flex items-center gap-1 p-0.5 text-stone-700 hover:text-[#721224] transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-[#721224] text-white flex items-center justify-center text-xs font-bold shadow-xs border border-[#c5a059]/40">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-400 group-hover/user:rotate-180 transition-transform duration-200" />
                  </button>

                  {/* Dropdown Menu Container */}
                  <div className="absolute right-0 top-full pt-2 w-52 opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all duration-200 z-50">
                    <div className="bg-white rounded-md shadow-2xl border border-stone-200 py-1.5 divide-y divide-stone-100">
                      <div className="px-4 py-2 bg-stone-50/70">
                        <p className="text-xs font-bold text-stone-900 truncate">{user.name}</p>
                        <p className="text-[10px] text-stone-500 truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link to="/profile" className="block px-4 py-2 text-xs text-stone-700 hover:bg-[#faf7f2] hover:text-[#721224] font-medium transition-colors">
                          My Profile
                        </Link>
                        <Link to="/orders" className="block px-4 py-2 text-xs text-stone-700 hover:bg-[#faf7f2] hover:text-[#721224] font-medium transition-colors">
                          My Orders
                        </Link>
                        <Link to="/wishlist" className="block px-4 py-2 text-xs text-stone-700 hover:bg-[#faf7f2] hover:text-[#721224] font-medium transition-colors">
                          My Wishlist
                        </Link>
                        {user.role === 'admin' && (
                          <Link to="/admin" className="block px-4 py-2 text-xs text-[#721224] font-semibold hover:bg-[#faf7f2] transition-colors">
                            Admin Dashboard
                          </Link>
                        )}
                      </div>
                      <div className="py-1">
                        <button 
                          onClick={logout} 
                          className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 font-medium transition-colors cursor-pointer"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
                  className="hidden sm:inline-flex items-center px-4 py-1.5 rounded-full border border-[#721224] text-[#721224] hover:bg-[#721224] hover:text-[#f5eedf] transition-all text-[11px] font-semibold tracking-wider uppercase whitespace-nowrap shadow-xs cursor-pointer flex-shrink-0"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>

          {/* ===================== SMART SEARCH DRAWER ===================== */}
          {isSearchOpen && (
            <div className="py-4 border-t border-stone-200/80 bg-stone-50/95 px-4 rounded-b-sm shadow-xl transition-all">
              <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                  <span className="uppercase tracking-widest text-[#721224] font-bold flex items-center gap-1.5 text-[11px]">
                    <Search className="w-3.5 h-3.5 text-[#721224]" />
                    <span>Search Sri Lakshmi Weave Catalog</span>
                  </span>
                  <button 
                    type="button" 
                    onClick={() => setIsSearchOpen(false)}
                    className="text-stone-400 hover:text-stone-700 cursor-pointer p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                      placeholder="Search for Kanjeevaram, Uppada, Banarasi, Gadwal, Maggam Blouse…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-8 py-2.5 rounded-full border-stone-300 focus:border-[#721224] bg-white text-xs tracking-wide shadow-xs"
                      aria-label="Search query"
                      autoFocus
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <Button type="submit" size="sm" className="bg-[#721224] hover:bg-[#520815] text-[#f5eedf] rounded-full px-6 text-xs uppercase tracking-wider font-semibold shadow-xs">
                    Search
                  </Button>
                </div>

                {/* Live Real-Time Matching Product Previews */}
                {liveSearchResults.length > 0 && (
                  <div className="bg-white border border-stone-200 rounded-md p-3 shadow-md divide-y divide-stone-100">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-stone-400 pb-2">
                      Matching Products ({liveSearchResults.length})
                    </p>
                    {liveSearchResults.map((prod) => (
                      <Link
                        key={prod.id}
                        to={`/product/${prod.id}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center justify-between py-2 hover:bg-[#faf7f2] px-2 rounded-xs transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="w-10 h-12 object-cover rounded-xs border border-stone-200"
                          />
                          <div>
                            <p className="text-xs font-semibold text-stone-900 group-hover:text-[#721224] transition-colors">
                              {prod.name}
                            </p>
                            <span className="text-[10px] text-stone-500 uppercase tracking-wider">
                              {prod.fabric || prod.category}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold text-[#721224]">
                            {formatPrice(prod.price)}
                          </span>
                          {prod.originalPrice && (
                            <span className="block text-[10px] text-stone-400 line-through">
                              {formatPrice(prod.originalPrice)}
                            </span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Popular Searches */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-stone-500">
                  <div className="flex items-center gap-1 text-stone-400 font-semibold">
                    <TrendingUp className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span>Popular:</span>
                  </div>
                  {[
                    'Meher Crimson Uppada',
                    'Kanjeevaram Tissue Silk',
                    'Banarasi Zari Brocade',
                    'Gadwal Handloom Cotton',
                    'Bridal Maggam Blouse',
                    'Pure Organza Drape',
                  ].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setSearchQuery(tag);
                        window.location.href = `/products?search=${encodeURIComponent(tag)}`;
                      }}
                      className="px-2.5 py-1 bg-white border border-stone-200 hover:border-[#721224] hover:text-[#721224] rounded-full text-[10px] font-medium transition-colors cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </form>
            </div>
          )}

          {/* ===================== MOBILE NAVIGATION DRAWER ===================== */}
          {isMenuOpen && (
            <div className="lg:hidden py-4 border-t border-stone-200 bg-white space-y-4">
              <form onSubmit={handleSearchSubmit} className="px-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    placeholder="Search sarees, fabrics, blouses…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 rounded-full text-xs mb-2"
                  />
                </div>
                <Button type="submit" className="w-full bg-[#721224] text-white text-xs py-2 rounded-full font-semibold">
                  Search Catalog
                </Button>
              </form>

              {/* Mobile Pincode Delivery Pill */}
              <div className="mx-2 p-3 bg-stone-50 border border-stone-200 rounded-sm flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#721224]" />
                  <div>
                    <p className="font-semibold text-stone-900">Deliver to {location?.pincode}</p>
                    <p className="text-[10px] text-stone-500">{location?.estimatedDelivery}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsPincodeModalOpen(true);
                  }}
                  className="text-xs font-bold text-[#721224] uppercase underline cursor-pointer"
                >
                  Change
                </button>
              </div>

              {/* Mobile Video Drape Button */}
              <div className="px-2">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsVideoModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#faf7f2] border border-[#c5a059] text-[#721224] rounded-sm text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  <Video className="w-4 h-4 text-[#c5a059]" />
                  <span>Book 1-on-1 WhatsApp Video Drape</span>
                </button>
              </div>

              <div className="flex flex-col gap-1 px-2">
                <Link
                  to="/products"
                  className="px-4 py-2 text-xs uppercase font-bold tracking-wider text-stone-800 hover:bg-[#faf7f2] hover:text-[#721224] rounded-xs"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Shop All Collections
                </Link>
                <div className="px-4 py-1 text-[10px] uppercase font-bold tracking-widest text-[#c5a059]">
                  Curated Traditions
                </div>
                {megaMenuColumns[0].items.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="px-6 py-2 text-xs font-medium text-stone-700 hover:bg-[#faf7f2] hover:text-[#721224] rounded-xs flex items-center justify-between"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-xs font-semibold bg-[#faf7f2] text-[#c5a059] border border-[#c5a059]/30">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
                <Link
                  to="/products?sort=new"
                  className="px-4 py-2 text-xs uppercase font-bold tracking-wider text-stone-800 hover:bg-[#faf7f2] hover:text-[#721224] rounded-xs flex items-center justify-between"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>New In</span>
                  <span className="w-2 h-2 rounded-full bg-[#721224]" />
                </Link>
                <a
                  href="/#leaderboard"
                  className="px-4 py-2 text-xs uppercase font-bold tracking-wider text-[#a37929] hover:bg-[#faf7f2] rounded-xs flex items-center gap-1.5"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>Patron Rewards</span>
                </a>
              </div>

              {!user && (
                <div className="px-4 pt-2">
                  <Button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setAuthMode('login');
                      setShowAuthModal(true);
                    }}
                    className="w-full bg-[#721224] text-white text-xs py-2 rounded-full font-semibold uppercase tracking-wider"
                  >
                    Sign In / Register
                  </Button>
                </div>
              )}

              <div className="border-t border-stone-100 pt-3 px-4 flex flex-col gap-2 text-xs">
                <a href="tel:+919852985299" className="flex items-center gap-2 text-stone-700">
                  <Phone className="w-4 h-4 text-[#c5a059]" />
                  <span>Helpline: +91 98529 85299</span>
                </a>
                <a href="mailto:srilakshmistore@gmail.com" className="flex items-center gap-2 text-stone-700">
                  <span className="text-[#c5a059] font-bold">@</span>
                  <span>srilakshmistore@gmail.com</span>
                </a>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* ===================== PINCODE ESTIMATOR MODAL ===================== */}
      {isPincodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#faf7f2] max-w-md w-full rounded-md border border-[#c5a059] shadow-2xl p-6 sm:p-7 relative">
            <button
              onClick={() => setIsPincodeModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-stone-500 hover:text-stone-900 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#721224] text-white flex items-center justify-center flex-shrink-0 shadow-sm border border-[#c5a059]/40">
                <Truck className="w-5 h-5 text-[#c5a059]" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Select Delivery Location
                </h3>
                <p className="text-xs text-stone-600">
                  Enter your 6-digit Indian pincode for instant delivery estimation.
                </p>
              </div>
            </div>

            <form onSubmit={handlePincodeSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Enter Pincode
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincodeInput}
                    onChange={(e) => {
                      setPincodeInput(e.target.value.replace(/\D/g, ''));
                      setPincodeError('');
                    }}
                    placeholder="e.g. 500001"
                    className="flex-1 px-3 py-2 text-sm border border-stone-300 rounded-sm focus:outline-none focus:border-[#721224] bg-white font-mono"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#721224] hover:bg-[#520815] text-[#f5eedf] text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {pincodeError && (
                  <p className="text-xs text-red-600 mt-1">{pincodeError}</p>
                )}
              </div>

              {/* Current Active Location Info */}
              <div className="p-3 bg-white border border-stone-200 rounded-sm text-xs space-y-1.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-900">Current Pincode:</span>
                  <span className="font-mono font-bold text-[#721224]">{location?.pincode} ({location?.city})</span>
                </div>
                <div className="flex items-center justify-between text-stone-600">
                  <span>Estimated Delivery:</span>
                  <span className="font-medium text-emerald-800">{location?.estimatedDelivery}</span>
                </div>
                <div className="flex items-center justify-between text-stone-600">
                  <span>Shipping Fee:</span>
                  <span className="font-semibold text-emerald-800">FREE on this order</span>
                </div>
                <div className="flex items-center justify-between text-stone-600">
                  <span>Cash on Delivery:</span>
                  <span className="font-semibold text-stone-800">Available</span>
                </div>
              </div>

              {/* Quick Select Popular Cities */}
              <div className="pt-2">
                <p className="text-[10px] uppercase font-bold tracking-widest text-stone-400 mb-2">
                  Popular Metro Pincodes
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {(quickPincodes || []).map((item) => (
                    <button
                      key={item.pincode}
                      type="button"
                      onClick={() => {
                        updatePincode(item.pincode);
                        setIsPincodeModalOpen(false);
                      }}
                      className={cn(
                        "text-left p-2.5 rounded-sm border text-xs transition-colors flex items-center justify-between cursor-pointer",
                        location?.pincode === item.pincode
                          ? "border-[#721224] bg-[#721224]/5 text-[#721224] font-semibold"
                          : "border-stone-200 bg-white hover:border-stone-400 text-stone-700"
                      )}
                    >
                      <div>
                        <p className="font-mono font-semibold">{item.pincode}</p>
                        <p className="text-[10px] text-stone-500 truncate">{item.city}</p>
                      </div>
                      {location?.pincode === item.pincode && (
                        <Check className="w-3.5 h-3.5 text-[#721224]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== VIDEO DRAPE INSPECTION MODAL ===================== */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#faf7f2] max-w-lg w-full rounded-md border border-[#c5a059] shadow-2xl p-6 sm:p-8 relative">
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-stone-500 hover:text-stone-900 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full bg-[#721224] text-white flex items-center justify-center flex-shrink-0 shadow-sm border border-[#c5a059]/40">
                <Video className="w-5 h-5 text-[#c5a059]" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#c5a059] font-bold block">
                  Private Boutique Appointment
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                  Book WhatsApp Video Drape
                </h3>
              </div>
            </div>

            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              Inspect true pleat drape, color tone variance, and zari sheen under natural daylight before ordering. Our showroom drape master will connect with you 1-on-1.
            </p>

            {videoSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-sm p-5 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-lg font-bold text-emerald-950">
                  Appointment Scheduled
                </h4>
                <p className="text-xs text-emerald-800">
                  Our showroom draper will connect with you on WhatsApp at <strong className="font-mono">{videoForm.phone}</strong> for the {videoForm.slot}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleVideoDrapeSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={videoForm.name}
                    onChange={(e) => setVideoForm({ ...videoForm, name: e.target.value })}
                    placeholder="e.g. Swarna Sundari"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-sm focus:outline-none focus:border-[#721224] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                    WhatsApp Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={videoForm.phone}
                    onChange={(e) => setVideoForm({ ...videoForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-sm focus:outline-none focus:border-[#721224] bg-white font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Weave Interest
                    </label>
                    <select
                      value={videoForm.category}
                      onChange={(e) => setVideoForm({ ...videoForm, category: e.target.value })}
                      className="w-full px-2.5 py-2 text-xs border border-stone-300 rounded-sm focus:outline-none focus:border-[#721224] bg-white"
                    >
                      <option>Bridal Kanchipuram Pattu</option>
                      <option>Uppada Jamdani Silk</option>
                      <option>Banarasi Katan Brocade</option>
                      <option>Gadwal Handloom Cotton</option>
                      <option>Organza Celebration Drape</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Preferred Slot
                    </label>
                    <select
                      value={videoForm.slot}
                      onChange={(e) => setVideoForm({ ...videoForm, slot: e.target.value })}
                      className="w-full px-2.5 py-2 text-xs border border-stone-300 rounded-sm focus:outline-none focus:border-[#721224] bg-white"
                    >
                      <option>Morning (10:00 AM - 1:00 PM)</option>
                      <option>Afternoon (2:00 PM - 5:00 PM)</option>
                      <option>Evening (5:00 PM - 8:00 PM)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#721224] hover:bg-[#520815] text-[#f5eedf] text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Video className="w-4 h-4 text-[#c5a059]" />
                    <span>Confirm Video Drape Appointment</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <Modal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title={authMode === 'login' ? 'Welcome Back' : 'Create Account'}
        size="md"
      >
        <AuthForm mode={authMode} onModeChange={setAuthMode} onSuccess={() => setShowAuthModal(false)} />
      </Modal>
    </>
  );
}

function AuthForm({ mode, onModeChange, onSuccess }) {
  const { login, register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let success = false;
      if (mode === 'login') {
        success = await login(formData.email, formData.password);
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setIsLoading(false);
          return;
        }
        success = await register(formData.name, formData.email, formData.password, formData.phone);
      }

      if (success) {
        onSuccess();
      } else {
        setError(mode === 'login' ? 'Invalid email or password' : 'Registration failed');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xs text-xs text-red-600">
          {error}
        </div>
      )}

      {mode === 'register' && (
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
          <Input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Swarna Lakshmi"
            className="text-xs"
          />
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
        <Input
          type="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          placeholder="your.email@example.com"
          className="text-xs"
        />
      </div>

      {mode === 'register' && (
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number</label>
          <Input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            className="text-xs"
          />
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-stone-700 mb-1">Password</label>
        <Input
          type="password"
          name="password"
          required
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          className="text-xs"
        />
      </div>

      {mode === 'register' && (
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Confirm Password</label>
          <Input
            type="password"
            name="confirmPassword"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            className="text-xs"
          />
        </div>
      )}

      <Button
        type="submit"
        isLoading={isLoading}
        className="w-full bg-[#721224] hover:bg-[#520815] text-[#f5eedf] text-xs font-semibold uppercase tracking-wider py-3 rounded-full shadow-sm cursor-pointer"
      >
        {mode === 'login' ? 'Sign In' : 'Create Account'}
      </Button>

      <div className="text-center pt-2">
        <button
          type="button"
          onClick={() => {
            setError('');
            onModeChange(mode === 'login' ? 'register' : 'login');
          }}
          className="text-xs text-stone-600 hover:text-[#721224] font-medium cursor-pointer"
        >
          {mode === 'login' ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
        </button>
      </div>
    </form>
  );
}
