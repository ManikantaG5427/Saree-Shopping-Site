import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, CreditCard, Truck, Shield, MapPin, ChevronRight, RotateCcw } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../contexts/OrderContext';
import { formatPrice } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { cn } from '../lib/utils';

const states = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

export function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { createOrder } = useOrders();
  
  const [step, setStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const shipping = subtotal >= 1999 ? 0 : 199;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
    if (user && user.addresses && user.addresses.length > 0) {
      const defaultAddr = user.addresses.find(a => a.isDefault) || user.addresses[0];
      setShippingAddress(defaultAddr);
    }
  }, [items, user, navigate]);

  const validateStep = (currentStep) => {
    const errors = {};
    
    if (currentStep >= 1) {
      if (!shippingAddress) {
        errors.address = 'Please select or add a delivery address';
      }
    }
    
    if (currentStep >= 2) {
      if (!paymentMethod) {
        errors.payment = 'Please select a payment method';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < 3) setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handlePlaceOrder = async () => {
    if (!validateStep(3) || !shippingAddress) return;
    
    setIsProcessing(true);
    
    try {
      let paymentId;
      
      if (paymentMethod === 'razorpay') {
        paymentId = 'pay_' + Date.now().toString(36);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      const order = createOrder(items, shippingAddress, paymentId);
      setOrderId(order.id);
      clearCart();
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Order creation failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const steps = [
    { number: 1, title: 'Delivery Address', icon: MapPin },
    { number: 2, title: 'Payment Method', icon: CreditCard },
    { number: 3, title: 'Review Order', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-[#faf7f2] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-xl mx-auto">
            {steps.map((stepInfo, index) => (
              <React.Fragment key={stepInfo.number}>
                <div className="flex flex-col items-center">
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center font-medium text-xs',
                    step < stepInfo.number ? 'bg-stone-200 text-stone-500' :
                    step === stepInfo.number ? 'bg-[#721224] text-white' :
                    'bg-emerald-800 text-white'
                  )}>
                    {step > stepInfo.number ? <Check className="w-4 h-4" /> : stepInfo.number}
                  </div>
                  <p className={cn(
                    'text-xs font-semibold uppercase tracking-wider mt-2 text-center',
                    step >= stepInfo.number ? 'text-stone-900' : 'text-stone-400'
                  )}>{stepInfo.title}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    'flex-1 h-0.5 mx-3 -mt-5',
                    step > stepInfo.number ? 'bg-emerald-800' : 'bg-stone-200'
                  )} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Steps */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Delivery Address */}
            {step >= 1 && (
              <Card className="p-6 border-stone-200 rounded-xs shadow-xs">
                <div className="flex items-center justify-between mb-6 pb-2 border-b border-stone-200">
                  <h2 className="font-serif text-xl font-bold text-stone-900">Delivery Address</h2>
                  <Badge variant={step === 1 ? 'info' : step > 1 ? 'success' : 'default'} className="text-[10px] uppercase">
                    Step 1
                  </Badge>
                </div>

                {shippingAddress ? (
                  <div className="border border-stone-200 rounded-xs p-4 bg-white">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-[#721224] mt-0.5 flex-shrink-0" />
                        <div className="text-xs space-y-1">
                          <p className="font-bold text-stone-900">{shippingAddress.name}</p>
                          <p className="text-stone-600">{shippingAddress.phone}</p>
                          <p className="text-stone-600">
                            {shippingAddress.addressLine1}
                            {shippingAddress.addressLine2 && ', ' + shippingAddress.addressLine2}
                            <br />
                            {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => { setEditingAddress(shippingAddress); setShowAddressModal(true); }} className="text-xs">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setShowAddressModal(true)} className="text-xs text-[#721224]">
                          Change
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed border-stone-300 rounded-xs">
                    <MapPin className="w-10 h-10 text-stone-400 mx-auto mb-2" />
                    <p className="text-stone-600 text-xs mb-4">No delivery address selected</p>
                    <Button onClick={() => setShowAddressModal(true)} className="bg-[#721224] text-white text-xs uppercase tracking-wider">
                      Add Address
                    </Button>
                  </div>
                )}

                <div className="mt-6">
                  <Button 
                    className="w-full bg-[#721224] hover:bg-[#520815] text-[#f5eedf] text-xs uppercase tracking-wider py-3.5 rounded-xs font-semibold shadow-md" 
                    size="lg"
                    onClick={handleNext}
                    disabled={!shippingAddress}
                  >
                    Continue to Payment
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </Card>
            )}

            {/* Step 2: Payment Method */}
            {step >= 2 && (
              <Card className="p-6 border-stone-200 rounded-xs shadow-xs">
                <div className="flex items-center justify-between mb-6 pb-2 border-b border-stone-200">
                  <h2 className="font-serif text-xl font-bold text-stone-900">Payment Method</h2>
                  <Badge variant={step === 2 ? 'info' : step > 2 ? 'success' : 'default'} className="text-[10px] uppercase">
                    Step 2
                  </Badge>
                </div>

                <div className="space-y-4">
                  <label className={cn(
                    'flex items-center gap-4 p-4 border rounded-xs cursor-pointer transition-colors',
                    paymentMethod === 'razorpay' ? 'border-[#721224] bg-[#721224]/5' : 'border-stone-200 hover:border-stone-300'
                  )}>
                    <input
                      type="radio"
                      name="payment"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={() => setPaymentMethod('razorpay')}
                      className="w-4 h-4 text-[#721224] focus:ring-[#721224]"
                    />
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 bg-white rounded-xs flex items-center justify-center border border-stone-200">
                        <CreditCard className="w-5 h-5 text-[#721224]" />
                      </div>
                      <div>
                        <p className="font-bold text-stone-900 text-xs">Online Payment (UPI, Cards, NetBanking)</p>
                        <p className="text-[11px] text-stone-500">Secure 256-bit encrypted checkout via Razorpay</p>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-xs">Recommended</span>
                  </label>

                  <label className={cn(
                    'flex items-center gap-4 p-4 border rounded-xs cursor-pointer transition-colors',
                    paymentMethod === 'cod' ? 'border-[#721224] bg-[#721224]/5' : 'border-stone-200 hover:border-stone-300'
                  )}>
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="w-4 h-4 text-[#721224] focus:ring-[#721224]"
                    />
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 bg-white rounded-xs flex items-center justify-center border border-stone-200">
                        <Truck className="w-5 h-5 text-[#721224]" />
                      </div>
                      <div>
                        <p className="font-bold text-stone-900 text-xs">Cash on Delivery (COD)</p>
                        <p className="text-[11px] text-stone-500">Pay when your saree arrives at your doorstep</p>
                      </div>
                    </div>
                  </label>
                </div>

                <div className="mt-6 flex gap-4">
                  <Button variant="outline" onClick={handleBack} className="text-xs uppercase tracking-wider">Back</Button>
                  <Button className="flex-1 bg-[#721224] hover:bg-[#520815] text-[#f5eedf] text-xs uppercase tracking-wider py-3.5 rounded-xs font-semibold" size="lg" onClick={handleNext}>
                    Continue to Review
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </Card>
            )}

            {/* Step 3: Review Order */}
            {step >= 3 && (
              <Card className="p-6 border-stone-200 rounded-xs shadow-xs">
                <div className="flex items-center justify-between mb-6 pb-2 border-b border-stone-200">
                  <h2 className="font-serif text-xl font-bold text-stone-900">Review & Confirm</h2>
                  <Badge variant="info" className="text-[10px] uppercase">Step 3</Badge>
                </div>

                <div className="space-y-4 mb-6">
                  <h3 className="font-serif text-sm font-bold text-stone-900">Order Items</h3>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex gap-3 items-center">
                        <img src={item.product.images[0]} alt={item.product.name} className="w-14 h-18 object-cover rounded-xs border border-stone-200" />
                        <div className="flex-1 min-w-0 text-xs">
                          <p className="font-semibold text-stone-900 truncate">{item.product.name}</p>
                          <p className="text-stone-500">Qty: {item.quantity}</p>
                          <p className="font-bold text-[#721224] mt-0.5">{formatPrice(item.product.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-stone-200 pt-4">
                    <h3 className="font-serif text-sm font-bold text-stone-900 mb-2">Delivery Address</h3>
                    {shippingAddress && (
                      <div className="bg-stone-50 rounded-xs p-3 text-xs border border-stone-200">
                        <p className="font-bold text-stone-900">{shippingAddress.name} ({shippingAddress.phone})</p>
                        <p className="text-stone-600 mt-1">
                          {shippingAddress.addressLine1}
                          {shippingAddress.addressLine2 && ', ' + shippingAddress.addressLine2}, {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-stone-200 pt-4">
                    <h3 className="font-serif text-sm font-bold text-stone-900 mb-1">Selected Payment Mode</h3>
                    <p className="text-xs text-stone-600">
                      {paymentMethod === 'razorpay' ? 'Online Payment (Razorpay 256-bit Encrypted)' : 'Cash on Delivery (COD)'}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex gap-4">
                  <Button variant="outline" onClick={handleBack} className="text-xs uppercase tracking-wider">Back</Button>
                  <Button 
                    className="flex-1 bg-[#721224] hover:bg-[#520815] text-[#f5eedf] text-xs uppercase tracking-wider py-4 rounded-xs font-semibold shadow-md" 
                    size="lg" 
                    onClick={handlePlaceOrder}
                    isLoading={isProcessing}
                  >
                    Place Confirmed Order
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 p-6 border-stone-200 rounded-xs shadow-xs">
              <h3 className="font-serif text-lg font-bold text-stone-900 mb-4 pb-2 border-b border-stone-200">
                Summary
              </h3>
              
              <div className="space-y-3 mb-6 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-600">Subtotal ({items.length} items)</span>
                  <span className="font-semibold text-stone-900">{formatPrice(subtotal)}</span>
                </div>
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
                    <span className="font-serif">Total</span>
                    <span className="text-[#721224]">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 p-3 bg-stone-50 rounded-xs text-[11px] text-stone-600 border border-stone-200">
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-[#c5a059] flex-shrink-0" />
                  <span>Silk Mark SMOI authenticity guaranteed</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-3.5 h-3.5 text-[#c5a059] flex-shrink-0" />
                  <span>7-day easy doorstep inspection & returns</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      <AddressModal
        isOpen={showAddressModal}
        onClose={() => { setShowAddressModal(false); setEditingAddress(null); }}
        user={user}
        editingAddress={editingAddress}
        onSave={setShippingAddress}
      />

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => { setShowSuccessModal(false); navigate('/orders'); }}
        title="Order Placed Successfully"
        size="md"
      >
        <div className="text-center py-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-3">
            <Check className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-stone-900 mb-1">Thank you for your order!</h3>
          <p className="text-stone-600 text-xs mb-4">
            Order Reference: <span className="font-mono font-bold text-[#721224]">{orderId}</span>
          </p>
          <p className="text-stone-500 text-xs mb-6">
            A confirmation has been recorded. Your saree will be inspected, finished with fall & tassels, and dispatched shortly.
          </p>
          <Button className="w-full bg-[#721224] text-white text-xs uppercase tracking-wider py-3" onClick={() => { setShowSuccessModal(false); navigate('/orders'); }}>
            View My Orders
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function AddressModal({ isOpen, onClose, user, editingAddress, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingAddress) {
      setFormData(editingAddress);
    } else if (user && user.addresses && user.addresses.length === 0) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: true,
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false,
      });
    }
    setErrors({});
  }, [editingAddress, user, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^[6-9]\d{9}$/.test(formData.phone)) newErrors.phone = 'Enter a valid 10-digit phone number';
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Enter a valid 6-digit pincode';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const address = {
        id: editingAddress?.id || 'addr_' + Date.now(),
        ...formData,
      };
      onSave(address);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingAddress ? 'Edit Address' : 'Add Delivery Address'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            error={errors.name}
            required
          />
          <Input
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            error={errors.phone}
            required
            maxLength={10}
          />
        </div>
        <Input
          label="Address Line 1"
          value={formData.addressLine1}
          onChange={(e) => setFormData(prev => ({ ...prev, addressLine1: e.target.value }))}
          error={errors.addressLine1}
          required
          placeholder="House/Flat No., Building, Street"
        />
        <Input
          label="Address Line 2 (Optional)"
          value={formData.addressLine2}
          onChange={(e) => setFormData(prev => ({ ...prev, addressLine2: e.target.value }))}
          placeholder="Landmark, Area, Sector"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="City"
            value={formData.city}
            onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
            error={errors.city}
            required
          />
          <Select
            label="State"
            value={formData.state}
            onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
            options={states.map(s => ({ value: s, label: s }))}
            placeholder="Select State"
            error={errors.state}
            required
          />
          <Input
            label="Pincode"
            value={formData.pincode}
            onChange={(e) => setFormData(prev => ({ ...prev, pincode: e.target.value }))}
            error={errors.pincode}
            required
            maxLength={6}
          />
        </div>
        <div className="flex gap-3 pt-4">
          <Button variant="outline" type="button" onClick={onClose} className="flex-1 text-xs">Cancel</Button>
          <Button type="submit" className="flex-1 bg-[#721224] text-white text-xs uppercase tracking-wider">{editingAddress ? 'Update Address' : 'Save Address'}</Button>
        </div>
      </form>
    </Modal>
  );
}
