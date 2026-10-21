import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Trophy, 
  ArrowRight, 
  Heart, 
  Star, 
  Check, 
  ShieldCheck, 
  Scissors, 
  Award, 
  X,
  Phone,
  Mail,
  Video,
  CheckCircle,
  MapPin,
  Truck,
  RotateCcw
} from 'lucide-react';
import { products } from '../data/mockData';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useLocationContext } from '../contexts/LocationContext';
import { formatPrice, cn } from '../lib/utils';

// 1. Circular Visual Category Strip (Inspired by Top Handloom Curations)
const circularCategories = [
  {
    name: 'Pure Kanchipuram',
    tag: 'Silk Mark Certified',
    href: '/products?category=Pattu Sarees',
    image: '/images/kanjeevaram_tissue_saree.jpg',
  },
  {
    name: 'Royal Paithani',
    tag: 'Gold Peacock Pallu',
    href: '/products?fabric=Pure Paithani Silk',
    image: '/images/paithani_peacock_saree.jpg',
  },
  {
    name: 'Patan Patola',
    tag: 'Double Ikat Heritage',
    href: '/products?fabric=Double Ikat Pure Mulberry Silk',
    image: '/images/patola_ikat_saree.jpg',
  },
  {
    name: 'Uppada Jamdani',
    tag: 'Featherlight Weave',
    href: '/products?category=Uppada Silk Sarees',
    image: '/images/uppada_jamdani_saree.jpg',
  },
  {
    name: 'Banarasi Katan',
    tag: 'Pure Mulberry Silk',
    href: '/products?fabric=Banarasi',
    image: '/images/banarasi_silk_saree.jpg',
  },
  {
    name: 'Mysore Crepe',
    tag: 'Liquid Gold Sheen',
    href: '/products?category=Pattu Sarees',
    image: '/images/mysore_crepe_silk_saree.jpg',
  },
  {
    name: 'Rani Bandhani',
    tag: 'Gota Patti Embroidery',
    href: '/products?category=Fancy Sarees',
    image: '/images/bandhani_georgette_saree.jpg',
  },
  {
    name: 'Zephyr Chanderi',
    tag: 'Mint Sheer Handloom',
    href: '/products?category=Cotton Sarees',
    image: '/images/chanderi_mint_saree.jpg',
  },
  {
    name: 'Kerala Kasavu',
    tag: '24K Temple Mural',
    href: '/products?category=Cotton Sarees',
    image: '/images/kasavu_kerala_saree.jpg',
  },
  {
    name: 'Wild Tussar',
    tag: 'Hand Kantha Stitch',
    href: '/products?category=Pattu Sarees',
    image: '/images/tussar_silk_handloom.jpg',
  },
  {
    name: 'Lilac Organza',
    tag: 'Scalloped Cutwork',
    href: '/products?category=Fancy Sarees',
    image: '/images/organza_lavender_saree.jpg',
  },
  {
    name: 'Bespoke Maggam',
    tag: 'Aari & Zardozi Craft',
    href: '/products?category=Ready-Made Blouses',
    image: '/images/bridal_maggam_blouse.jpg',
  },
];

// 2. Hero Slides
const heroSlides = [
  {
    badge: 'ESTABLISHED 2003 · HERITAGE SANCTUARY',
    subtitle: 'AUTHENTIC SILK MARK CERTIFIED DRAPES',
    title: 'Elegance Woven Into Every Tradition',
    description:
      'Curated heirloom Kanchipuram, pure Banarasi brocades, and gossamer Uppada Jamdanis direct from master weaving families with genuine Silk Mark certification.',
    primaryBtn: { text: 'Explore Silk Sarees', href: '/products?category=Pattu Sarees' },
    secondaryBtn: { text: 'Book Video Drape', action: 'videoDrape' },
    image: '/images/kanjeevaram_tissue_saree.jpg',
  },
  {
    badge: 'BESPOKE SLSH ATELIER',
    subtitle: 'CRAFTSMANSHIP BEYOND THE DRAPE',
    title: 'Bespoke Blouse & Maggam Craft',
    description:
      'Intricate Aari embroidery, hand-set Kundan stones, Kasab zari cutwork, and custom bridal blouse silhouettes crafted for your defining moments.',
    primaryBtn: { text: 'Explore Atelier Services', action: 'boutique' },
    secondaryBtn: { text: 'Shop Ready Blouses', href: '/products?category=Ready-Made Blouses' },
    image: '/images/bridal_maggam_blouse.jpg',
  },
  {
    badge: 'NEW WEAVING CYCLE · 2025',
    subtitle: 'COASTAL ANDHRA MASTER WEAVES',
    title: 'Meher Crimson Uppada Jamdani',
    description:
      'The poetry of an authentic feather-light weave, adorned with pure zari floral buttas and inspected under natural daylight for flawless finish.',
    primaryBtn: { text: 'Explore Uppada Silks', href: '/products?category=Uppada Silk Sarees' },
    secondaryBtn: { text: 'View All New Arrivals', href: '/products?sort=new' },
    image: '/images/meher_crimson_saree.jpg',
  },
  {
    badge: 'ROYAL HEIRLOOM WEAVES',
    subtitle: 'TIMELESS BENARES MASTERPIECES',
    title: 'Regal Banarasi Brocade Silks',
    description:
      'Heirloom pure zari brocades, woven with pure mulberry silk yarns for grand weddings, auspicious rituals, and family trousseaus.',
    primaryBtn: { text: 'Shop Banarasi Silks', href: '/products?fabric=Banarasi' },
    secondaryBtn: { text: 'All Collections', href: '/products' },
    image: '/images/banarasi_silk_saree.jpg',
  },
];

// 3. Shop by Price Stores
const budgetStores = [
  {
    title: 'Under ₹3,999',
    subtitle: 'Everyday Mulmuls & Breathable Cottons',
    tag: 'Daily Grace',
    priceParam: '0-4000',
    image: '/images/cotton_gadwal_saree.jpg',
  },
  {
    title: '₹4,000 - ₹9,999',
    subtitle: 'Festive Chanderi, Soft Silk & Organza',
    tag: 'Celebration Ready',
    priceParam: '4000-10000',
    image: '/images/fancy_saree_organza.jpg',
  },
  {
    title: '₹10,000 - ₹19,999',
    subtitle: 'Pure Uppada Jamdani & Gadwal Pattu',
    tag: 'Handcrafted Luxury',
    priceParam: '10000-20000',
    image: '/images/uppada_jamdani_saree.jpg',
  },
  {
    title: '₹20,000+ Luxury',
    subtitle: 'Bridal Kanchipuram & Pure Gold Zari',
    tag: 'Heirloom Trousseau',
    priceParam: '20000-100000',
    image: '/images/kanjeevaram_tissue_saree.jpg',
  },
];

// 4. Curated Traditions
const curatedCategories = [
  {
    subtitle: 'Heirloom silks for treasured wedding rituals',
    title: 'Kanchipuram Pattu',
    href: '/products?category=Pattu Sarees',
    image: '/images/kanjeevaram_tissue_saree.jpg',
  },
  {
    subtitle: 'Feather-light drapes with intricate zari motifs',
    title: 'Uppada Jamdani',
    href: '/products?category=Uppada Silk Sarees',
    image: '/images/uppada_jamdani_saree.jpg',
  },
  {
    subtitle: 'Breathable organic hand-block and daily cottons',
    title: 'Mulmul & Cottons',
    href: '/products?category=Cotton Sarees',
    image: '/images/cotton_gadwal_saree.jpg',
  },
  {
    subtitle: 'Contemporary party drapes and tissue weaves',
    title: 'Organza & Fancy',
    href: '/products?category=Fancy Sarees',
    image: '/images/fancy_saree_organza.jpg',
  },
  {
    subtitle: 'Unstitched ethnic suits in Chanderi and linen',
    title: 'Dress Materials',
    href: '/products?category=Dress Materials',
    image: '/images/chanderi_dress_material.jpg',
  },
  {
    subtitle: 'Hand-embroidered Aari and bridal silhouettes',
    title: 'Ready Blouses',
    href: '/products?category=Ready-Made Blouses',
    image: '/images/bridal_maggam_blouse.jpg',
  },
];

// 5. Customer Drape Wall & Verified Reviews
const customerDrapes = [
  {
    name: 'Lavanya Swaminathan',
    city: 'Jubilee Hills, Hyderabad',
    saree: 'Padma Blush Silk Saree',
    image: '/images/padma_blush_silk.jpg',
    quote: 'Wore this for my sister’s reception in Hyderabad. The drape was effortless, and the pure zari had a rich antique sheen that looked stunning in family photos.',
    rating: 5,
    verified: true,
  },
  {
    name: 'Dr. Radhika Nambiar',
    city: 'Indiranagar, Bengaluru',
    saree: 'Meher Crimson Uppada Saree',
    image: '/images/meher_crimson_saree.jpg',
    quote: 'The 1-on-1 WhatsApp video drape call gave me 100% confidence before buying. It arrived within 24 hours with fall & pico done cleanly.',
    rating: 5,
    verified: true,
  },
  {
    name: 'Sunitha Krishnamurthy',
    city: 'Mylapore, Chennai',
    saree: 'Regal Banarasi Katan Brocade',
    image: '/images/banarasi_silk_saree.jpg',
    quote: 'Official Silk Mark tag was attached. As a family that values handloom silk, Sri Lakshmi Saree House is now our trusted source for all wedding purchases.',
    rating: 5,
    verified: true,
  },
  {
    name: 'Padmaja K. Rao',
    city: 'Benz Circle, Vijayawada',
    saree: 'Bespoke Maggam Blouse & Tissue Drape',
    image: '/images/bridal_maggam_blouse.jpg',
    quote: 'The custom maggam blouse fitting was exact to my measurements. The zardozi embroidery and beadwork are heirloom quality.',
    rating: 5,
    verified: true,
  },
];

// 6. Royal Patron Rewards
const leaderboardData = [
  {
    rank: 1,
    name: 'Swarna Lakshmi',
    badge: 'TOP PATRON',
    location: 'Guntur, Andhra Pradesh',
    orders: 11,
    spend: 84829,
    tier: 'Gold Tier',
  },
  {
    rank: 2,
    name: 'Chandramouli Puligilla',
    badge: null,
    location: 'Siddipet, Telangana',
    orders: 6,
    spend: 42144,
    tier: 'Silver Tier',
  },
  {
    rank: 3,
    name: 'Devi',
    badge: null,
    location: 'Hyderabad, Telangana',
    orders: 5,
    spend: 41519,
    tier: 'Bronze Tier',
  },
  {
    rank: 4,
    name: 'Srujana',
    badge: null,
    location: 'Hyderabad, Telangana',
    orders: 7,
    spend: 40929,
    tier: 'Elite Member',
  },
  {
    rank: 5,
    name: 'Swapna Reddy',
    badge: null,
    location: 'Kamareddy, Telangana',
    orders: 5,
    spend: 38729,
    tier: 'Elite Member',
  },
];

// 7. Industry Benchmark Buying Advantages (Nalli, Kankatala, Tilfi Standards)
const buyerAdvantages = [
  {
    icon: ShieldCheck,
    title: 'Silk Mark India Certified Pure Silk',
    desc: 'Every genuine silk saree carries an official Silk Mark Organisation of India (SMOI) certified tag, guaranteeing 100% natural silk threads with zero synthetic blending.',
  },
  {
    icon: Video,
    title: '1-on-1 Live WhatsApp Video Drape',
    desc: 'Inspect weave luster, drape fall, and true zari shine under natural daylight before purchasing. Schedule a private video call with our master draper.',
  },
  {
    icon: RotateCcw,
    title: 'Transparent 7-Day Guarantee',
    desc: 'No hidden conditions or ambiguous return windows. Complete doorstep inspection with full 7-day hassle-free returns on all standard catalog drapes.',
  },
  {
    icon: Scissors,
    title: 'Complimentary Fall, Pico & Tassels',
    desc: 'Unlike generic retailers who ship unfinished sarees, every drape arrives ready to wear with complimentary hand-knotted tassels and pure cotton fall.',
  },
];

export function Home() {
  const { addToCart, isInCart, getCartQuantity } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { location } = useLocationContext();

  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Tabs for "Most Cherished Traditional Weaves"
  const [activeTab, setActiveTab] = useState('looking');

  // Flash Sale Countdown
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59, hours: prev.hours };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 6, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Modals
  const [isBoutiqueModalOpen, setIsBoutiqueModalOpen] = useState(false);
  const [isVideoDrapeModalOpen, setIsVideoDrapeModalOpen] = useState(false);
  const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState(false);
  const [addedProductId, setAddedProductId] = useState(null);

  // Boutique Form State
  const [boutiqueFormData, setBoutiqueFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'Bridal Maggam Work',
    date: '',
    notes: '',
  });
  const [boutiqueSubmitted, setBoutiqueSubmitted] = useState(false);

  // Video Drape Form State
  const [videoDrapeData, setVideoDrapeData] = useState({
    name: '',
    phone: '',
    sareeInterest: 'Pure Kanchipuram Pattu',
    preferredTime: 'Morning (11:00 AM - 1:00 PM)',
  });
  const [videoDrapeSubmitted, setVideoDrapeSubmitted] = useState(false);

  // Auto-play Carousel
  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Quick Add handler
  const handleQuickAdd = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedProductId(product.id);
    setTimeout(() => {
      setAddedProductId(null);
    }, 1200);
  };

  // Filter products for showcase
  const getTabProducts = () => {
    switch (activeTab) {
      case 'trending':
        return products.filter((p) => p.tags && (p.tags.includes('trending') || p.rating >= 4.9)).slice(0, 4);
      case 'new':
        return products.filter((p) => p.tags && p.tags.includes('new-arrivals')).slice(0, 4);
      case 'picks':
        return products.filter((p) => (p.tags && p.tags.includes('top-picks')) || p.isFeatured).slice(0, 4);
      case 'looking':
      default:
        return [
          products.find((p) => p.name.includes('Meher')) || products[0],
          products.find((p) => p.name.includes('Padma')) || products[1],
          products.find((p) => p.name.includes('Vanya')) || products[2],
          products.find((p) => p.name.includes('Neelam')) || products[3],
        ].filter(Boolean);
    }
  };

  const activeProducts = getTabProducts();

  // Flash Sale Selected Products
  const flashSaleProducts = [
    products.find((p) => p.name.includes('Padma')) || products[1],
    products.find((p) => p.name.includes('Meher')) || products[0],
    products.find((p) => p.name.includes('Neelam')) || products[3],
  ].filter(Boolean);

  const handleBoutiqueSubmit = (e) => {
    e.preventDefault();
    setBoutiqueSubmitted(true);
    setTimeout(() => {
      setBoutiqueSubmitted(false);
      setIsBoutiqueModalOpen(false);
    }, 2500);
  };

  const handleVideoDrapeSubmit = (e) => {
    e.preventDefault();
    setVideoDrapeSubmitted(true);
    setTimeout(() => {
      setVideoDrapeSubmitted(false);
      setIsVideoDrapeModalOpen(false);
    }, 2500);
  };

  return (
    <div className="bg-[#faf7f2] text-[#1c1917] selection:bg-[#721224] selection:text-white">
      {/* ============================================================== */}
      {/* 1. CINEMATIC HERO SLIDER                                       */}
      {/* ============================================================== */}
      <section 
        className="relative w-full h-[620px] sm:h-[680px] lg:h-[720px] overflow-hidden bg-[#181514]"
        onMouseEnter={() => setIsAutoPlay(false)}
        onMouseLeave={() => setIsAutoPlay(true)}
      >
        {heroSlides.map((slide, index) => (
          <div
            key={slide.title}
            className={cn(
              'absolute inset-0 transition-opacity duration-1000 ease-in-out',
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            )}
          >
            {/* Background Image with Gradient Overlay */}
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center transform scale-100 transition-transform duration-10000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#181514]/90 via-[#181514]/55 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181514] via-transparent to-black/30" />
            </div>

            {/* Slide Content */}
            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center pt-8 pb-16">
              <div className="max-w-xl text-white space-y-4 sm:space-y-5">
                {/* Accent Tag */}
                <div className="flex items-center gap-2">
                  <span className="h-px w-8 bg-[#c5a059]" />
                  <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-semibold text-[#c5a059]">
                    {slide.badge}
                  </span>
                </div>

                <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] font-medium text-stone-300">
                  {slide.subtitle}
                </p>

                <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-wide text-[#fdfbf7] leading-[1.12]">
                  {slide.title}
                </h1>

                <p className="text-xs sm:text-sm lg:text-base text-stone-200 leading-relaxed font-light max-w-lg">
                  {slide.description}
                </p>

                {/* Hero Actions */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-3">
                  {slide.primaryBtn.action === 'boutique' ? (
                    <button
                      onClick={() => setIsBoutiqueModalOpen(true)}
                      className="px-6 py-3.5 bg-[#721224] hover:bg-[#520815] text-[#f5eedf] text-xs font-semibold uppercase tracking-[0.18em] rounded-xs border border-[#c5a059]/40 shadow-lg transition-all flex items-center gap-2"
                    >
                      <span>{slide.primaryBtn.text}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <Link
                      to={slide.primaryBtn.href || '/products'}
                      className="px-6 py-3.5 bg-[#721224] hover:bg-[#520815] text-[#f5eedf] text-xs font-semibold uppercase tracking-[0.18em] rounded-xs border border-[#c5a059]/40 shadow-lg transition-all flex items-center gap-2"
                    >
                      <span>{slide.primaryBtn.text}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}

                  {slide.secondaryBtn.action === 'videoDrape' ? (
                    <button
                      onClick={() => setIsVideoDrapeModalOpen(true)}
                      className="px-6 py-3.5 bg-transparent hover:bg-white/10 text-[#fdfbf7] text-xs font-medium uppercase tracking-[0.18em] rounded-xs border border-stone-400 hover:border-white transition-all flex items-center gap-2"
                    >
                      <Video className="w-3.5 h-3.5 text-[#c5a059]" />
                      <span>{slide.secondaryBtn.text}</span>
                    </button>
                  ) : slide.secondaryBtn.action === 'boutique' ? (
                    <button
                      onClick={() => setIsBoutiqueModalOpen(true)}
                      className="px-6 py-3.5 bg-transparent hover:bg-white/10 text-[#fdfbf7] text-xs font-medium uppercase tracking-[0.18em] rounded-xs border border-stone-400 hover:border-white transition-all"
                    >
                      {slide.secondaryBtn.text}
                    </button>
                  ) : (
                    <Link
                      to={slide.secondaryBtn.href || '/products'}
                      className="px-6 py-3.5 bg-transparent hover:bg-white/10 text-[#fdfbf7] text-xs font-medium uppercase tracking-[0.18em] rounded-xs border border-stone-400 hover:border-white transition-all"
                    >
                      {slide.secondaryBtn.text}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Controls */}
        <div className="absolute bottom-8 left-4 sm:left-8 lg:left-12 z-20 flex items-center gap-4 text-white text-xs font-medium tracking-widest">
          <span className="font-serif text-sm text-[#c5a059]">
            {`0${currentSlide + 1}`} <span className="text-stone-400 text-xs">/ 0{heroSlides.length}</span>
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 ml-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={cn(
                  'h-1 transition-all rounded-full',
                  i === currentSlide ? 'w-8 bg-[#c5a059]' : 'w-2 bg-white/40 hover:bg-white/70'
                )}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. CIRCULAR VISUAL CATEGORY STRIP                             */}
      {/* ============================================================== */}
      <section className="bg-white border-b border-stone-200 py-6 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#721224]" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900">
                Explore By Tradition & Weave
              </h2>
            </div>
            <Link
              to="/products"
              className="text-xs font-semibold text-[#721224] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex items-center gap-5 sm:gap-7 overflow-x-auto pb-2 scrollbar-none">
            {circularCategories.map((cat) => (
              <Link
                key={cat.name}
                to={cat.href}
                className="flex flex-col items-center flex-shrink-0 group text-center space-y-1.5 focus:outline-none"
              >
                <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-full p-0.5 bg-gradient-to-tr from-[#c5a059] via-[#721224] to-[#c5a059] group-hover:scale-105 transition-transform duration-300 shadow-sm">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white p-0.5">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
                <div className="w-24">
                  <span className="font-serif text-xs font-semibold text-stone-900 group-hover:text-[#721224] transition-colors line-clamp-1 block leading-tight">
                    {cat.name}
                  </span>
                  <span className="text-[10px] text-stone-400 font-medium block">
                    {cat.tag}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. LIGHTNING FESTIVE FLASH SALE                                */}
      {/* ============================================================== */}
      <section className="bg-gradient-to-r from-[#520815] via-[#721224] to-[#520815] text-[#f5eedf] py-8 sm:py-10 px-4 sm:px-6 lg:px-8 border-y border-[#c5a059]/40">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#c5a059]/30">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[#c5a059] text-stone-950 px-2.5 py-0.5 rounded-xs text-[10px] font-bold uppercase tracking-wider mb-1.5">
                <span>Limited Handloom Allocation</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-white tracking-wide">
                Dussehra & Wedding Season Special Editions
              </h2>
              <p className="text-stone-300 text-xs">
                Handpicked pure zari drapes with festive weaver subsidies • Official Silk Mark certification included.
              </p>
            </div>

            {/* Countdown Box */}
            <div className="flex items-center gap-3 bg-[#33040c]/80 border border-[#c5a059]/40 px-4 py-2.5 rounded-xs shadow-inner">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#c5a059]">
                Offers Expire In:
              </span>
              <div className="flex items-center gap-1.5 font-mono text-sm sm:text-base font-bold text-white">
                <span className="bg-[#181514] px-2 py-1 rounded-xs border border-stone-800">
                  {String(timeLeft.hours).padStart(2, '0')}h
                </span>
                <span>:</span>
                <span className="bg-[#181514] px-2 py-1 rounded-xs border border-stone-800">
                  {String(timeLeft.minutes).padStart(2, '0')}m
                </span>
                <span>:</span>
                <span className="bg-[#181514] px-2 py-1 rounded-xs border border-stone-800 text-[#c5a059]">
                  {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
              </div>
            </div>
          </div>

          {/* Flash Deal Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            {flashSaleProducts.map((product) => {
              const inCart = isInCart(product.id);
              const inWishlist = isInWishlist(product.id);
              const isJustAdded = addedProductId === product.id;

              return (
                <div
                  key={product.id}
                  className="bg-white text-[#1c1917] rounded-xs border border-[#c5a059]/30 overflow-hidden shadow-lg flex flex-col justify-between group hover:border-[#c5a059] transition-all"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                    <Link to={`/product/${product.id}`} className="block w-full h-full">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    <div className="absolute top-2.5 left-2.5 bg-[#721224] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs shadow-xs">
                      Festive Special
                    </div>

                    <button
                      onClick={() => toggleWishlist(product)}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-stone-600 hover:text-[#721224] flex items-center justify-center transition-colors shadow-xs z-10"
                      aria-label="Add to Wishlist"
                    >
                      <Heart className={cn('w-4 h-4', inWishlist && 'fill-[#721224] text-[#721224]')} />
                    </button>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#c5a059]">
                        {product.fabric || product.category}
                      </span>
                      <Link to={`/product/${product.id}`} className="block">
                        <h3 className="font-serif text-base font-semibold text-stone-900 group-hover:text-[#721224] transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                      </Link>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-medium text-stone-600">
                        <span>84% Reserved</span>
                        <span className="text-[#721224] font-bold">Only {product.stock} Left</span>
                      </div>
                      <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#721224] h-full rounded-full w-[84%]" />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-[#721224]">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-stone-400 line-through ml-2">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => handleQuickAdd(product, e)}
                        className={cn(
                          "px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-xs border transition-all flex items-center gap-1",
                          isJustAdded
                            ? "bg-emerald-800 text-white border-emerald-800"
                            : inCart
                            ? "border-[#721224] text-[#721224] bg-[#721224]/5"
                            : "bg-[#721224] text-white hover:bg-[#520815] border-[#721224]"
                        )}
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Claimed</span>
                          </>
                        ) : inCart ? (
                          <span>In Bag ({getCartQuantity(product.id)})</span>
                        ) : (
                          <span>Claim Deal</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. SHOP BY BUDGET STORE                                        */}
      {/* ============================================================== */}
      <section className="py-14 sm:py-18 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#c5a059] uppercase block mb-1">
            Handlooms For Every Celebration
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-stone-900 tracking-wide mb-2">
            Shop By Price Range
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm italic font-serif">
            Authentic master-woven sarees tailored for every budget, from daily mulmuls to bridal trousseaus.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {budgetStores.map((store) => (
            <Link
              key={store.title}
              to={`/products?price=${store.priceParam}`}
              className="group relative h-72 rounded-xs overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 block"
            >
              <img
                src={store.image}
                alt={store.title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

              <div className="absolute top-3 left-3 bg-[#c5a059] text-stone-950 px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase tracking-wider">
                {store.tag}
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                <h3 className="font-serif text-2xl font-bold text-white group-hover:text-[#c5a059] transition-colors">
                  {store.title}
                </h3>
                <p className="text-xs text-stone-300 line-clamp-1">
                  {store.subtitle}
                </p>
                <div className="pt-2 flex items-center gap-1 text-[11px] uppercase tracking-widest text-[#c5a059] font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Explore Store</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. INDUSTRY BENCHMARKS & BUYING ADVANTAGES                      */}
      {/* ============================================================== */}
      <section className="bg-[#f5eedf] border-y border-[#e7e2d9] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#721224] uppercase block mb-1">
              Silk Mark & Handloom Assurance
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-stone-900 tracking-wide">
              The Gold Standard in Silk Saree Buying
            </h2>
            <p className="text-stone-600 text-xs mt-1">
              Adhering to the rigorous standards of India's most prestigious textile houses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {buyerAdvantages.map((adv) => {
              const Icon = adv.icon;
              return (
                <div key={adv.title} className="p-4 bg-white/70 border border-[#e2d9cb] rounded-xs flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xs bg-[#721224] text-[#f5eedf] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                    <Icon className="w-5 h-5 text-[#c5a059]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-sm font-semibold text-stone-900 leading-snug">
                      {adv.title}
                    </h3>
                    <p className="text-[11px] text-stone-600 leading-relaxed mt-1">
                      {adv.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Direct Reachable Actions Bar */}
          <div className="mt-8 pt-6 border-t border-[#e2d9cb] flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-4 text-stone-700">
              <span className="font-semibold text-stone-900">Direct Customer Helpline:</span>
              <a href="tel:+919852985299" className="text-[#721224] font-bold hover:underline">
                +91 98529 85299
              </a>
              <span className="text-stone-400">|</span>
              <a href="mailto:srilakshmistore@gmail.com" className="text-stone-600 hover:text-stone-900">
                srilakshmistore@gmail.com
              </a>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsVideoDrapeModalOpen(true)}
                className="px-4 py-2 bg-[#721224] text-white rounded-xs text-[11px] font-semibold uppercase tracking-wider hover:bg-[#520815] transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Video className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>Book 1-on-1 Video Drape</span>
              </button>
              <a
                href="https://wa.me/919852985299?text=Hello%20Sri%20Lakshmi%20Saree%20House,%20I%20would%20like%20to%20view%20sarees%20and%20ask%20a%20question"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-800 text-white rounded-xs text-[11px] font-semibold uppercase tracking-wider hover:bg-emerald-900 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. MOST CHERISHED TRADITIONAL WEAVES                            */}
      {/* ============================================================== */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#c5a059] uppercase block mb-1">
            Sri Lakshmi Heritage Weaves · Handloom Showcase
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-900 tracking-wide mb-2">
            Most Cherished Traditional Weaves
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm italic font-serif">
            Authentic weaves with transparent pricing and Silk Mark SMOI tags.
          </p>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-6 pt-6 border-b border-stone-200 pb-2">
            {[
              { id: 'trending', label: 'TRENDING WEAVES' },
              { id: 'new', label: 'NEW ARRIVALS' },
              { id: 'picks', label: 'CURATED PICKS' },
              { id: 'looking', label: "SIGNATURE SILKS" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'text-xs tracking-wider font-semibold uppercase pb-2 transition-all relative',
                  activeTab === tab.id
                    ? 'text-[#721224] border-b-2 border-[#721224]'
                    : 'text-stone-500 hover:text-stone-900'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeProducts.map((product) => {
            const inCart = isInCart(product.id);
            const inWishlist = isInWishlist(product.id);
            const isJustAdded = addedProductId === product.id;

            return (
              <div
                key={product.id}
                className="group bg-white rounded-xs border border-stone-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
                  <Link to={`/product/${product.id}`} className="block w-full h-full">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </Link>

                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                    {product.badge && (
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#c5a059] text-stone-900 rounded-xs shadow-xs">
                        {product.badge}
                      </span>
                    )}
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold text-white bg-emerald-800 rounded-xs">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => toggleWishlist(product)}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-stone-600 hover:text-[#721224] flex items-center justify-center transition-colors shadow-xs z-10"
                    aria-label="Add to Wishlist"
                  >
                    <Heart className={cn('w-4 h-4', inWishlist && 'fill-[#721224] text-[#721224]')} />
                  </button>
                </div>

                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#c5a059] block mb-1">
                      {product.fabric || product.category}
                    </span>
                    <Link to={`/product/${product.id}`} className="block">
                      <h3 className="font-serif text-base font-medium text-stone-900 group-hover:text-[#721224] transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-1">
                      <div className="flex items-center text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </div>
                      <span className="font-semibold text-stone-800">{product.rating}</span>
                      <span className="text-[11px] text-stone-400">({product.reviewCount})</span>
                      <span className="text-stone-300">•</span>
                      <span className="text-[11px] text-stone-500 truncate">{product.occasion}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-bold text-[#721224]">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-stone-400 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => handleQuickAdd(product, e)}
                      className={cn(
                        'px-3 py-1.5 text-[11px] font-semibold tracking-wider uppercase rounded-xs border transition-all flex items-center gap-1',
                        isJustAdded
                          ? 'bg-emerald-800 text-white border-emerald-800'
                          : inCart
                          ? 'border-[#721224] text-[#721224] hover:bg-[#721224] hover:text-white'
                          : 'border-[#721224] text-[#721224] hover:bg-[#721224] hover:text-white'
                      )}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Added</span>
                        </>
                      ) : inCart ? (
                        <span>In Bag ({getCartQuantity(product.id)})</span>
                      ) : (
                        <span>Quick add</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 7. VERIFIED CUSTOMER DRAPING GALLERY                            */}
      {/* ============================================================== */}
      <section className="bg-white border-y border-stone-200 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#c5a059] font-bold block mb-1">
              Social Proof · Customer Draping Gallery
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-stone-900 tracking-wide mb-2">
              Loved by Patrons Across India & Overseas
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm italic font-serif">
              Real brides, festive celebrations, and verified handloom collectors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {customerDrapes.map((drape) => (
              <div
                key={drape.name}
                className="p-5 bg-stone-50 border border-stone-200 rounded-xs flex flex-col justify-between space-y-4 hover:border-[#c5a059] transition-all"
              >
                <div className="space-y-3">
                  <div className="relative aspect-[4/3] rounded-xs overflow-hidden border border-stone-200">
                    <img
                      src={drape.image}
                      alt={drape.saree}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-[#721224] text-white text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-xs">
                      Verified Buyer
                    </div>
                  </div>

                  <div className="flex items-center text-amber-500 gap-0.5">
                    {[...Array(drape.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>

                  <p className="text-xs text-stone-700 italic leading-relaxed font-serif">
                    "{drape.quote}"
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-200">
                  <h4 className="font-serif text-sm font-bold text-stone-900 leading-snug">
                    {drape.name}
                  </h4>
                  <p className="text-[11px] text-stone-500">{drape.city}</p>
                  <p className="text-[10px] text-[#721224] font-medium mt-0.5">{drape.saree}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 8. CURATED TRADITIONS - DISCOVER YOUR SIGNATURE SILHOUETTE      */}
      {/* ============================================================== */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#c5a059] uppercase block mb-1">
            Curated Collections
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-900 tracking-wide mb-2">
            Discover Your Signature Tradition
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm italic font-serif">
            An expression of artistry, woven into every silhouette.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {curatedCategories.map((cat) => (
            <Link
              key={cat.title}
              to={cat.href}
              className="group relative h-[360px] sm:h-[400px] rounded-xs overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 block"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-108"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1.5">
                <p className="text-xs italic text-stone-300 font-serif">
                  {cat.subtitle}
                </p>
                <h3 className="font-serif text-2xl font-normal tracking-wide text-white group-hover:text-[#c5a059] transition-colors">
                  {cat.title}
                </h3>
                <div className="pt-2 flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#c5a059] font-medium group-hover:translate-x-1 transition-transform">
                  <span>Shop collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 9. ROYAL PATRON REWARDS                                        */}
      {/* ============================================================== */}
      <section id="leaderboard" className="bg-[#181514] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-y border-[#c5a059]/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#c5a059] font-semibold mb-2">
              <Trophy className="w-4 h-4 text-[#c5a059]" />
              <span>Royal Patron Rewards</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-white tracking-wide mb-2">
              The More You Shop, The More You Earn
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm font-light">
              Celebrating our cherished patrons with bespoke pure silk drapes, VIP showroom privileges, and store gift credits.
            </p>
          </div>

          <div className="bg-[#201c1b] border border-[#c5a059]/40 rounded-xs overflow-hidden shadow-2xl">
            <div className="grid grid-cols-12 px-6 py-3.5 bg-[#520815] text-[11px] font-bold tracking-widest uppercase text-stone-200 border-b border-[#c5a059]/30">
              <div className="col-span-2 sm:col-span-1">Rank</div>
              <div className="col-span-6 sm:col-span-6">Customer Name & Location</div>
              <div className="col-span-2 sm:col-span-2 text-center">Orders</div>
              <div className="col-span-2 sm:col-span-3 text-right">Total Spend</div>
            </div>

            <div className="divide-y divide-stone-800 text-sm">
              {leaderboardData.map((item) => (
                <div
                  key={item.rank}
                  className="grid grid-cols-12 px-6 py-4 items-center hover:bg-stone-800/40 transition-colors"
                >
                  <div className="col-span-2 sm:col-span-1">
                    {item.rank === 1 ? (
                      <div className="w-7 h-7 rounded-full bg-[#c5a059] text-stone-950 flex items-center justify-center font-bold text-xs shadow-md">
                        <Award className="w-4 h-4 text-stone-950" />
                      </div>
                    ) : item.rank === 2 ? (
                      <div className="w-7 h-7 rounded-full bg-stone-300 text-stone-900 flex items-center justify-center font-bold text-xs">
                        2
                      </div>
                    ) : item.rank === 3 ? (
                      <div className="w-7 h-7 rounded-full bg-amber-700 text-white flex items-center justify-center font-bold text-xs">
                        3
                      </div>
                    ) : (
                      <span className="text-stone-400 font-semibold pl-2">{item.rank}</span>
                    )}
                  </div>

                  <div className="col-span-6 sm:col-span-6 pr-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-white tracking-wide">{item.name}</span>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/40 rounded-xs">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-400 mt-0.5">{item.location}</p>
                  </div>

                  <div className="col-span-2 sm:col-span-2 text-center text-xs text-stone-300">
                    <span className="font-semibold text-white">{item.orders}</span> Orders
                  </div>

                  <div className="col-span-2 sm:col-span-3 text-right">
                    <span className="font-serif text-base sm:text-lg font-bold text-[#c5a059]">
                      ₹{item.spend.toLocaleString('en-IN')}
                    </span>
                    <span className="block text-[10px] text-stone-400 uppercase tracking-wider">
                      {item.tier}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-[#181514] border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
              <span>*Leaderboard updates daily at midnight. Top patrons receive bespoke pure silk drapes and store gift credits.</span>
              <button
                onClick={() => setIsLeaderboardModalOpen(true)}
                className="text-[#c5a059] hover:underline uppercase tracking-wider font-semibold flex items-center gap-1 flex-shrink-0"
              >
                <span>Reward Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 10. 20 YEARS OF LEGACY                                         */}
      {/* ============================================================== */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-center">
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] rounded-xs overflow-hidden border border-stone-200 shadow-xl">
              <img
                src="/images/kanjeevaram_tissue_saree.jpg"
                alt="Two Decades of Dedication"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 bg-[#faf7f2]/95 backdrop-blur-sm p-4 border border-[#c5a059]/40 rounded-xs shadow-md">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#721224] block mb-0.5">
                  Heritage Archive · Established 2003
                </span>
                <p className="font-serif text-sm text-stone-900 font-medium">
                  Two Decades of Dedication, Innovation & Handloom Preservation
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#c5a059]">
              Sri Lakshmi Saree House Heritage
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-900 leading-tight">
              20 Years Of Legacy Redefined
            </h2>

            <p className="text-stone-700 text-sm sm:text-base leading-relaxed font-light">
              A journey of artistic excellence and cultural preservation. For two decades, Sri Lakshmi Saree House has been a revered sanctuary for traditional and contemporary weaves, fostering artisan weaving families and inspiring creative craftsmanship. Here's to two decades of dedication, innovation, and authentic handloom pride!
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-white border border-stone-200 rounded-xs">
                <span className="font-serif text-3xl font-bold text-[#721224]">20+</span>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-600 mt-1">
                  Years of Handloom Heritage
                </p>
              </div>

              <div className="p-4 bg-white border border-stone-200 rounded-xs">
                <span className="font-serif text-3xl font-bold text-[#721224]">100%</span>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-600 mt-1">
                  Silk Mark Certified Authentic
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                onClick={() => setIsBoutiqueModalOpen(true)}
                className="px-6 py-3.5 bg-[#721224] hover:bg-[#520815] text-[#f5eedf] text-xs font-semibold uppercase tracking-[0.18em] rounded-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <span>Boutique Inquiry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <Link
                to="/products"
                className="px-6 py-3.5 bg-transparent hover:bg-stone-200 text-stone-900 text-xs font-semibold uppercase tracking-[0.18em] rounded-xs border border-stone-800 transition-all"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 11. SLSH BOUTIQUE ATELIER & MAGGAM INQUIRY                     */}
      {/* ============================================================== */}
      <section id="boutique-atelier" className="bg-[#181514] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-[#c5a059]/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#c5a059] font-semibold block mb-1">
              SLSH Boutique
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-white tracking-wide mb-2">
              Craftsmanship Beyond the Drape
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm font-light mb-6">
              Explore blouse designing, embroidery and custom boutique enquiries for your most meaningful occasions.
            </p>
            <button
              onClick={() => setIsBoutiqueModalOpen(true)}
              className="px-6 py-2.5 border border-[#c5a059] text-[#c5a059] hover:bg-[#c5a059] hover:text-stone-950 text-xs uppercase tracking-[0.18em] font-semibold transition-all inline-flex items-center gap-2"
            >
              <span>Explore All Services</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-[#201c1b] border border-[#c5a059]/30 rounded-xs hover:border-[#c5a059] transition-all space-y-4">
              <span className="text-[11px] font-bold text-[#c5a059] uppercase tracking-widest block">
                01 Custom Design
              </span>
              <h3 className="font-serif text-2xl font-normal text-white">
                Embroidery Blouses
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
                Explore customized blouse concepts with intricate embroidery, cutwork, and bespoke hand-finishing. Tailored to perfection to complement your pure silk drapes.
              </p>
              <button
                onClick={() => setIsBoutiqueModalOpen(true)}
                className="text-xs font-semibold uppercase tracking-wider text-[#c5a059] hover:text-white flex items-center gap-1 pt-2 transition-colors"
              >
                <span>Request Custom Stitching</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="p-8 bg-[#201c1b] border border-[#c5a059]/30 rounded-xs hover:border-[#c5a059] transition-all space-y-4">
              <span className="text-[11px] font-bold text-[#c5a059] uppercase tracking-widest block">
                02 Occasion Wear
              </span>
              <h3 className="font-serif text-2xl font-normal text-white">
                Maggam Work
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
                Traditional bridal and festive design references with intricate Kundan stones, Kasab zari wirework, pearls, and royal zardozi craftsmanship created by master artisans.
              </p>
              <button
                onClick={() => setIsBoutiqueModalOpen(true)}
                className="text-xs font-semibold uppercase tracking-wider text-[#c5a059] hover:text-white flex items-center gap-1 pt-2 transition-colors"
              >
                <span>Book Bridal Consultation</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 12. BOUTIQUE SERVICES CONSULTATION MODAL                       */}
      {/* ============================================================== */}
      {isBoutiqueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#faf7f2] max-w-lg w-full rounded-xs border border-[#c5a059] shadow-2xl overflow-hidden p-6 sm:p-8 relative">
            <button
              onClick={() => setIsBoutiqueModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-stone-500 hover:text-stone-900"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#721224]">
                SLSH Atelier Consultation
              </span>
              <h3 className="font-serif text-2xl text-stone-900 mt-1">
                Custom Blouse & Maggam Design
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Our master stylists and embroidery artisans will coordinate directly with you.
              </p>
            </div>

            {boutiqueSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-xl text-stone-900 font-bold">Inquiry Received</h4>
                <p className="text-xs text-stone-600">
                  Thank you. Our boutique master cutter will contact you within 24 hours on WhatsApp or Phone.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBoutiqueSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={boutiqueFormData.name}
                    onChange={(e) => setBoutiqueFormData({ ...boutiqueFormData, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xs focus:outline-none focus:border-[#721224] bg-white"
                    placeholder="e.g. Ananya Rao"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      required
                      value={boutiqueFormData.phone}
                      onChange={(e) => setBoutiqueFormData({ ...boutiqueFormData, phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xs focus:outline-none focus:border-[#721224] bg-white"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Service Type
                    </label>
                    <select
                      value={boutiqueFormData.service}
                      onChange={(e) => setBoutiqueFormData({ ...boutiqueFormData, service: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xs focus:outline-none focus:border-[#721224] bg-white"
                    >
                      <option>Bridal Maggam Work</option>
                      <option>Custom Hand Embroidery</option>
                      <option>Ready-to-Wear Blouse Fitting</option>
                      <option>Saree Tasseling & Fall Hemming</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Occasion Date / Notes
                  </label>
                  <textarea
                    rows={3}
                    value={boutiqueFormData.notes}
                    onChange={(e) => setBoutiqueFormData({ ...boutiqueFormData, notes: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xs focus:outline-none focus:border-[#721224] bg-white"
                    placeholder="Tell us about your saree, blouse pattern, or wedding date..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#721224] hover:bg-[#520815] text-[#f5eedf] text-xs font-semibold uppercase tracking-[0.18em] rounded-xs shadow-md transition-colors"
                >
                  Submit Consultation Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 13. VIDEO DRAPE BOOKING MODAL (1-on-1 WhatsApp Video)         */}
      {/* ============================================================== */}
      {isVideoDrapeModalOpen && (
        <div id="video-drape" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#faf7f2] max-w-lg w-full rounded-xs border border-[#c5a059] shadow-2xl overflow-hidden p-6 sm:p-8 relative">
            <button
              onClick={() => setIsVideoDrapeModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-stone-500 hover:text-stone-900"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#721224]">
                Personal Showroom Viewing
              </span>
              <h3 className="font-serif text-2xl text-stone-900 mt-1">
                Book a Live 1-on-1 Video Drape
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                View colors in natural daylight, inspect pallu zari luster, and see how the saree pleats with our showroom specialists.
              </p>
            </div>

            {videoDrapeSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-xl text-stone-900 font-bold">Appointment Scheduled</h4>
                <p className="text-xs text-stone-600">
                  Our showroom draper will connect with you via WhatsApp Video call at your preferred slot.
                </p>
              </div>
            ) : (
              <form onSubmit={handleVideoDrapeSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={videoDrapeData.name}
                    onChange={(e) => setVideoDrapeData({ ...videoDrapeData, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xs focus:outline-none focus:border-[#721224] bg-white"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={videoDrapeData.phone}
                    onChange={(e) => setVideoDrapeData({ ...videoDrapeData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xs focus:outline-none focus:border-[#721224] bg-white"
                    placeholder="+91 98529 85299"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Saree Collection
                    </label>
                    <select
                      value={videoDrapeData.sareeInterest}
                      onChange={(e) => setVideoDrapeData({ ...videoDrapeData, sareeInterest: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xs focus:outline-none focus:border-[#721224] bg-white"
                    >
                      <option>Pure Uppada Jamdani Silks</option>
                      <option>Bridal Kanjeevaram Pattu</option>
                      <option>Handloom Banarasi Weaves</option>
                      <option>Gadwal & Chanderi Cottons</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Preferred Time Slot
                    </label>
                    <select
                      value={videoDrapeData.preferredTime}
                      onChange={(e) => setVideoDrapeData({ ...videoDrapeData, preferredTime: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xs focus:outline-none focus:border-[#721224] bg-white"
                    >
                      <option>Morning (11:00 AM - 1:00 PM)</option>
                      <option>Afternoon (2:00 PM - 5:00 PM)</option>
                      <option>Evening (6:00 PM - 8:30 PM)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#721224] hover:bg-[#520815] text-[#f5eedf] text-xs font-semibold uppercase tracking-[0.18em] rounded-xs shadow-md transition-colors"
                >
                  Confirm Video Viewing Slot
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 14. REWARD DETAILS MODAL                                       */}
      {/* ============================================================== */}
      {isLeaderboardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#faf7f2] max-w-xl w-full rounded-xs border border-[#c5a059] shadow-2xl overflow-hidden p-6 sm:p-8 relative">
            <button
              onClick={() => setIsLeaderboardModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-stone-500 hover:text-stone-900"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#c5a059]">
                Patron Rewards & Recognition
              </span>
              <h3 className="font-serif text-2xl text-stone-900 mt-1">
                Royal Patron Reward Program
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Shop your favorite silk sarees and earn recognition, showroom vouchers, and exclusive drapes.
              </p>
            </div>

            <div className="space-y-4 text-xs text-stone-700">
              <div className="p-3 bg-white border border-stone-200 rounded-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#721224] text-sm">
                  <Award className="w-4 h-4 text-[#c5a059]" />
                  <span>Rank 1 · Gold Tier Patron</span>
                </div>
                <p>Pure Gold Zari Kanjeevaram Silk Saree (valued at ₹45,000) + ₹10,000 Sri Lakshmi Saree House Shopping Voucher.</p>
              </div>

              <div className="p-3 bg-white border border-stone-200 rounded-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-stone-800 text-sm">
                  <Award className="w-4 h-4 text-stone-400" />
                  <span>Rank 2 · Silver Tier Patron</span>
                </div>
                <p>Authentic Uppada Jamdani Silk Saree (valued at ₹25,000) + ₹5,000 Shopping Voucher.</p>
              </div>

              <div className="p-3 bg-white border border-stone-200 rounded-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-800 text-sm">
                  <Award className="w-4 h-4 text-amber-700" />
                  <span>Rank 3 · Bronze Tier Patron</span>
                </div>
                <p>Banarasi Handloom Georgette Saree (valued at ₹15,000) + ₹3,000 Shopping Voucher.</p>
              </div>

              <div className="p-3 bg-stone-100 rounded-xs text-[11px] text-stone-500 space-y-1">
                <p className="font-semibold text-stone-700">Program Guidelines:</p>
                <p>• Only delivered and verified non-returned orders qualify towards the spend total.</p>
                <p>• Spend totals update daily at midnight Indian Standard Time.</p>
                <p>• Winners are felicitated with certificates and gift hampers at our flagship store or delivered via insured courier.</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-200 text-center">
              <Link
                to="/products"
                onClick={() => setIsLeaderboardModalOpen(false)}
                className="inline-block px-8 py-3 bg-[#721224] text-[#f5eedf] text-xs font-semibold uppercase tracking-[0.18em] rounded-xs shadow-md"
              >
                Shop Now To Earn Rewards
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 15. FLOATING REACHABILITY ACTION (Instant WhatsApp Helpline)   */}
      {/* ============================================================== */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        <a
          href="https://wa.me/919852985299?text=Hello%20Sri%20Lakshmi%20Saree%20House,%20I%20have%20an%20inquiry%20about%20your%20sarees"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-full shadow-2xl text-xs font-semibold tracking-wide border border-emerald-700 transition-all transform hover:scale-105"
          title="Direct WhatsApp Helpline"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Need Help? Chat on WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
