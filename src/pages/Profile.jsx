import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Lock, Bell, CreditCard, LogOut, Edit2, Trash2, Plus, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { formatDate, cn } from '../lib/utils';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'payment', label: 'Payment Methods', icon: CreditCard },
];

export function Profile() {
  const { user, updateProfile, changePassword, addAddress, updateAddress, deleteAddress, setDefaultAddress, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setProfileError('');
    try {
      await updateProfile(profileForm);
      setProfileSuccess('Profile updated successfully!');
      setTimeout(() => setProfileSuccess(''), 3000);
    } catch {
      setProfileError('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    const success = await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
    if (success) {
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      alert('Password changed successfully!');
    } else {
      alert('Current password is incorrect');
    }
  };

  const handleAddressSubmit = async (e, formData) => {
    e.preventDefault();
    const address = {
      id: editingAddress?.id || 'addr_' + Date.now(),
      ...formData,
    };
    if (editingAddress) {
      await updateAddress(address.id, address);
    } else {
      await addAddress(address);
    }
    setShowAddressModal(false);
    setEditingAddress(null);
  };

  const handleDeleteAddress = async (id) => {
    if (confirm('Are you sure you want to delete this address?')) {
      await deleteAddress(id);
    }
  };

  const handleSetDefault = async (id) => {
    await setDefaultAddress(id);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf7f2]">
        <div className="text-center p-8 bg-white border border-stone-200 rounded-xs shadow-md">
          <h1 className="font-serif text-2xl font-bold mb-3">Please sign in to view your profile</h1>
          <Button onClick={() => navigate('/auth')} className="bg-[#721224] text-white text-xs uppercase tracking-wider">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#c5a059]">
            Patron Dashboard
          </span>
          <h1 className="font-serif text-3xl font-normal text-stone-900 mt-1">My Account</h1>
          <p className="text-stone-600 text-xs mt-1">Manage delivery addresses, credentials, and patron preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <Card className="p-4 border-stone-200 rounded-xs shadow-xs">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-stone-200">
                <div className="w-14 h-14 bg-[#721224] rounded-full flex items-center justify-center text-[#f5eedf] text-xl font-serif font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-stone-900">{user.name}</h3>
                  <p className="text-xs text-stone-500">{user.email}</p>
                </div>
              </div>
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-xs text-xs font-semibold uppercase tracking-wider transition-colors',
                        activeTab === tab.id
                          ? 'bg-[#721224]/10 text-[#721224]'
                          : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                      )}
                    >
                      <Icon className="w-4 h-4 text-[#c5a059]" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
              <div className="mt-6 pt-6 border-t border-stone-200">
                <Button variant="outline" className="w-full justify-start text-red-700 hover:bg-red-50 text-xs uppercase tracking-wider" onClick={logout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </Card>
          </aside>

          {/* Content */}
          <main className="lg:col-span-3 space-y-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <Card className="p-6 border-stone-200 rounded-xs shadow-xs">
                <h2 className="font-serif text-xl font-normal text-stone-900 mb-6 pb-2 border-b border-stone-200">
                  Profile Information
                </h2>
                <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-xl text-xs">
                  {profileSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xs text-emerald-800 text-xs">
                      {profileSuccess}
                    </div>
                  )}
                  {profileError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xs text-red-700 text-xs">
                      {profileError}
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Full Name" value={profileForm.name} onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))} required />
                    <Input label="Email Address" type="email" value={profileForm.email} onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))} required disabled />
                  </div>
                  <Input label="Phone Number" type="tel" value={profileForm.phone} onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))} required maxLength={10} />
                  <div className="pt-4 border-t border-stone-200">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-3">Membership Details</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="text-stone-500">Member Since</p>
                        <p className="font-semibold text-stone-900">{formatDate(user.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-stone-500">Account Type</p>
                        <p className="font-semibold text-stone-900 capitalize">{user.role}</p>
                      </div>
                    </div>
                  </div>
                  <Button type="submit" isLoading={isSaving} className="bg-[#721224] text-white text-xs uppercase tracking-wider">
                    Save Changes
                  </Button>
                </form>
              </Card>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <Card className="p-6 border-stone-200 rounded-xs shadow-xs">
                <div className="flex items-center justify-between mb-6 pb-2 border-b border-stone-200">
                  <h2 className="font-serif text-xl font-normal text-stone-900">Saved Addresses</h2>
                  <Button onClick={() => { setEditingAddress(null); setShowAddressModal(true); }} className="bg-[#721224] text-white text-xs uppercase tracking-wider">
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Add New Address
                  </Button>
                </div>

                {user.addresses.length === 0 ? (
                  <div className="text-center py-12">
                    <MapPin className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                    <h3 className="font-serif text-lg font-medium text-stone-900 mb-1">No addresses saved</h3>
                    <p className="text-stone-500 text-xs mb-4">Add a delivery address to checkout faster</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {user.addresses.map((address) => (
                      <div key={address.id} className="border border-stone-200 rounded-xs p-4 bg-white text-xs">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={cn('w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0', address.isDefault ? 'bg-[#721224] text-white' : 'bg-stone-100 text-stone-600')}>
                              {address.isDefault ? <Check className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-stone-900">{address.name}</p>
                                {address.isDefault && <Badge variant="success" className="text-[10px] uppercase">Default</Badge>}
                              </div>
                              <p className="text-stone-600 text-xs mt-0.5">{address.phone}</p>
                              <p className="text-stone-600 text-xs mt-1">
                                {address.addressLine1}
                                {address.addressLine2 && ', ' + address.addressLine2}
                                <br />
                                {address.city}, {address.state} - {address.pincode}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {!address.isDefault && (
                              <Button variant="ghost" size="sm" onClick={() => handleSetDefault(address.id)} className="text-xs text-[#721224]">
                                Set Default
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" onClick={() => { setEditingAddress(address); setShowAddressModal(true); }}>
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-700 hover:bg-red-50" onClick={() => handleDeleteAddress(address.id)}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <Card className="p-6 max-w-xl border-stone-200 rounded-xs shadow-xs">
                <h2 className="font-serif text-xl font-normal text-stone-900 mb-6 pb-2 border-b border-stone-200">Change Password</h2>
                <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
                  <Input label="Current Password" type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))} required />
                  <Input label="New Password" type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))} required minLength={6} helperText="Minimum 6 characters" />
                  <Input label="Confirm New Password" type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))} required />
                  <Button type="submit" className="bg-[#721224] text-white text-xs uppercase tracking-wider">Change Password</Button>
                </form>
              </Card>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <Card className="p-6 max-w-xl border-stone-200 rounded-xs shadow-xs">
                <h2 className="font-serif text-xl font-normal text-stone-900 mb-6 pb-2 border-b border-stone-200">Notification Preferences</h2>
                <div className="space-y-3 text-xs">
                  {[
                    { title: 'Order & Shipping Alerts', desc: 'SMS & Email notifications when saree is woven and dispatched', enabled: true },
                    { title: 'Festive Weaving Releases', desc: 'First access to Dussehra & Diwali handloom capsules', enabled: true },
                    { title: 'Video Drape Reminders', desc: 'WhatsApp notifications for scheduled personal showroom viewings', enabled: true },
                  ].map((notif, index) => (
                    <label key={index} className="flex items-center justify-between p-3.5 bg-stone-50 border border-stone-200 rounded-xs cursor-pointer">
                      <div>
                        <p className="font-semibold text-stone-900">{notif.title}</p>
                        <p className="text-[11px] text-stone-500 mt-0.5">{notif.desc}</p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked={notif.enabled}
                        className="w-4 h-4 text-[#721224] border-stone-300 rounded-xs focus:ring-[#721224]"
                      />
                    </label>
                  ))}
                </div>
              </Card>
            )}

            {/* Payment Methods Tab */}
            {activeTab === 'payment' && (
              <Card className="p-6 max-w-xl border-stone-200 rounded-xs shadow-xs">
                <h2 className="font-serif text-xl font-normal text-stone-900 mb-6 pb-2 border-b border-stone-200">Saved Payment Methods</h2>
                <div className="text-center py-10">
                  <CreditCard className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                  <h3 className="font-serif text-base font-medium text-stone-900 mb-1">No saved cards</h3>
                  <p className="text-stone-500 text-xs">Cards are securely encrypted via Razorpay during checkout.</p>
                </div>
              </Card>
            )}
          </main>
        </div>
      </div>

      {/* Address Modal */}
      <Modal
        isOpen={showAddressModal}
        onClose={() => { setShowAddressModal(false); setEditingAddress(null); }}
        title={editingAddress ? 'Edit Address' : 'Add New Address'}
        size="lg"
      >
        <AddressForm
          initialData={editingAddress || { id: 'addr_' + Date.now(), name: user.name, phone: user.phone, addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', isDefault: user.addresses.length === 0 }}
          onSubmit={handleAddressSubmit}
          onClose={() => { setShowAddressModal(false); setEditingAddress(null); }}
        />
      </Modal>
    </div>
  );
}

function AddressForm({ initialData, onSubmit, onClose }) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

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
      onSubmit(e, formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Full Name" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} error={errors.name} required />
        <Input label="Phone Number" type="tel" value={formData.phone} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} error={errors.phone} required maxLength={10} />
      </div>
      <Input label="Address Line 1" value={formData.addressLine1} onChange={(e) => setFormData(prev => ({ ...prev, addressLine1: e.target.value }))} error={errors.addressLine1} required placeholder="House/Flat No., Building, Street" />
      <Input label="Address Line 2 (Optional)" value={formData.addressLine2} onChange={(e) => setFormData(prev => ({ ...prev, addressLine2: e.target.value }))} placeholder="Landmark, Area, Sector" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input label="City" value={formData.city} onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))} error={errors.city} required />
        <select
          value={formData.state}
          onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
          className="w-full px-3 py-2 border border-stone-300 rounded-xs focus:outline-none focus:border-[#721224] bg-white text-xs"
          required
        >
          <option value="">Select State</option>
          {['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <Input label="Pincode" value={formData.pincode} onChange={(e) => setFormData(prev => ({ ...prev, pincode: e.target.value }))} error={errors.pincode} required maxLength={6} />
      </div>
      <div className="flex gap-3 pt-4">
        <Button variant="outline" type="button" onClick={onClose} className="flex-1 text-xs">Cancel</Button>
        <Button type="submit" className="flex-1 bg-[#721224] text-white text-xs uppercase tracking-wider">{initialData.id ? 'Update Address' : 'Save Address'}</Button>
      </div>
    </form>
  );
}
