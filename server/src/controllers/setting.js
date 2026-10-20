import Setting from '../models/Setting.js';
import { AppError } from '../utils/errors.js';
import { successResponse } from '../utils/response.js';

export const getPublicSettings = async (req, res, next) => {
  try {
    const settings = await Setting.find({ isPublic: true }).lean();
    const formatted = {};
    settings.forEach((s) => {
      formatted[s.key] = s.value;
    });
    res.json(successResponse(formatted));
  } catch (error) {
    next(error);
  }
};

export const getAdminSettings = async (req, res, next) => {
  try {
    const settings = await Setting.find().sort({ group: 1 }).lean();
    res.json(successResponse(settings));
  } catch (error) {
    next(error);
  }
};

export const getSettingByKey = async (req, res, next) => {
  try {
    const setting = await Setting.findOne({ key: req.params.key });
    if (!setting) throw new AppError('Setting not found', 404, 'NOT_FOUND');
    res.json(successResponse(setting));
  } catch (error) {
    next(error);
  }
};

export const createSetting = async (req, res, next) => {
  try {
    const setting = await Setting.create(req.body);
    res.status(201).json(successResponse(setting, 'Setting created successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateSetting = async (req, res, next) => {
  try {
    const setting = await Setting.findOneAndUpdate({ key: req.params.key }, req.body, { new: true });
    if (!setting) throw new AppError('Setting not found', 404, 'NOT_FOUND');
    res.json(successResponse(setting, 'Setting updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const bulkUpdateSettings = async (req, res, next) => {
  try {
    const { settings } = req.body;
    if (Array.isArray(settings)) {
      await Promise.all(
        settings.map((s) =>
          Setting.findOneAndUpdate({ key: s.key }, { value: s.value }, { upsert: true, new: true })
        )
      );
    }
    res.json(successResponse(null, 'Settings updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const deleteSetting = async (req, res, next) => {
  try {
    const setting = await Setting.findOneAndDelete({ key: req.params.key });
    if (!setting) throw new AppError('Setting not found', 404, 'NOT_FOUND');
    res.json(successResponse(null, 'Setting deleted'));
  } catch (error) {
    next(error);
  }
};
