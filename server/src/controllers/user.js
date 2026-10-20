import User from '../models/User.js';
import { AppError } from '../utils/errors.js';
import { successResponse, paginatedResponse } from '../utils/response.js';

export const getAddresses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('addresses').lean();
    res.json(successResponse(user?.addresses || []));
  } catch (error) {
    next(error);
  }
};

export const addAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw new AppError('User not found', 404, 'NOT_FOUND');

    const newAddress = {
      ...req.body,
      id: `addr_${Date.now()}`,
    };

    if (newAddress.isDefault) {
      user.addresses.forEach((a) => (a.isDefault = false));
    } else if (user.addresses.length === 0) {
      newAddress.isDefault = true;
    }

    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json(successResponse(newAddress, 'Address added successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw new AppError('User not found', 404, 'NOT_FOUND');

    const address = user.addresses.find((a) => a.id === req.params.id || a._id?.toString() === req.params.id);
    if (!address) throw new AppError('Address not found', 404, 'NOT_FOUND');

    if (req.body.isDefault) {
      user.addresses.forEach((a) => (a.isDefault = false));
    }

    Object.assign(address, req.body);
    await user.save();

    res.json(successResponse(address, 'Address updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw new AppError('User not found', 404, 'NOT_FOUND');

    user.addresses = user.addresses.filter((a) => a.id !== req.params.id && a._id?.toString() !== req.params.id);
    await user.save();

    res.json(successResponse(null, 'Address removed successfully'));
  } catch (error) {
    next(error);
  }
};

export const setDefaultAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw new AppError('User not found', 404, 'NOT_FOUND');

    user.addresses.forEach((a) => {
      a.isDefault = a.id === req.params.id || a._id?.toString() === req.params.id;
    });
    await user.save();

    res.json(successResponse(user.addresses, 'Default address updated'));
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password').lean();
    if (!user) throw new AppError('User not found', 404, 'NOT_FOUND');
    res.json(successResponse(user));
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, notifications } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { ...(name && { name }), ...(phone && { phone }), ...(notifications !== undefined && { notifications }) },
      { new: true }
    ).select('-password');
    res.json(successResponse(user, 'Profile updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const getAdminUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);

    const [users, total] = await Promise.all([
      User.find().select('-password').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      User.countDocuments(),
    ]);

    res.json(paginatedResponse({ users, page, limit, total, totalPages: Math.ceil(total / limit) }));
  } catch (error) {
    next(error);
  }
};

export const getAdminUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password').lean();
    if (!user) throw new AppError('User not found', 404, 'NOT_FOUND');
    res.json(successResponse(user));
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) throw new AppError('User not found', 404, 'NOT_FOUND');
    res.json(successResponse(user, 'User role updated'));
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) throw new AppError('User not found', 404, 'NOT_FOUND');
    res.json(successResponse(null, 'User deleted successfully'));
  } catch (error) {
    next(error);
  }
};
