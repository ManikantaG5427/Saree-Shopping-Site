import Razorpay from 'razorpay';
import crypto from 'crypto';
import { config } from '../config/index.js';
import { AppError } from '../utils/errors.js';

class RazorpayService {
  constructor() {
    this.instance = null;
  }

  getInstance() {
    if (!this.instance) {
      if (!config.razorpay.keyId || !config.razorpay.keySecret) {
        throw new AppError('Razorpay credentials not configured', 500, 'RAZORPAY_NOT_CONFIGURED');
      }
      this.instance = new Razorpay({
        key_id: config.razorpay.keyId,
        key_secret: config.razorpay.keySecret,
      });
    }
    return this.instance;
  }

  async createOrder(options) {
    try {
      const razorpay = this.getInstance();
      const order = await razorpay.orders.create({
        amount: options.amount,
        currency: options.currency,
        receipt: options.receipt,
        notes: options.notes,
        payment_capture: true,
      });
      return order;
    } catch (error) {
      throw new AppError('Failed to create Razorpay order', 500, 'RAZORPAY_ORDER_FAILED', error);
    }
  }

  async verifyPayment(data) {
    try {
      const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = data;
      
      const generatedSignature = crypto
        .createHmac('sha256', config.razorpay.keySecret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      return generatedSignature === razorpaySignature;
    } catch (error) {
      throw new AppError('Payment verification failed', 500, 'VERIFICATION_FAILED', error);
    }
  }

  async getPayment(paymentId) {
    try {
      const razorpay = this.getInstance();
      return await razorpay.payments.fetch(paymentId);
    } catch (error) {
      throw new AppError('Failed to fetch payment', 500, 'PAYMENT_FETCH_FAILED', error);
    }
  }

  async capturePayment(paymentId, amount) {
    try {
      const razorpay = this.getInstance();
      return await razorpay.payments.capture(paymentId, amount);
    } catch (error) {
      throw new AppError('Failed to capture payment', 500, 'CAPTURE_FAILED', error);
    }
  }

  async refundPayment(paymentId, amount) {
    try {
      const razorpay = this.getInstance();
      if (amount) {
        return await razorpay.payments.refund(paymentId, { amount });
      }
      return await razorpay.payments.refund(paymentId);
    } catch (error) {
      throw new AppError('Failed to process refund', 500, 'REFUND_FAILED', error);
    }
  }

  async getOrder(orderId) {
    try {
      const razorpay = this.getInstance();
      return await razorpay.orders.fetch(orderId);
    } catch (error) {
      throw new AppError('Failed to fetch order', 500, 'ORDER_FETCH_FAILED', error);
    }
  }

  async handleWebhook(payload, signature) {
    try {
      const expectedSignature = crypto
        .createHmac('sha256', config.razorpay.webhookSecret)
        .update(payload)
        .digest('hex');

      if (expectedSignature !== signature) {
        throw new AppError('Invalid webhook signature', 400, 'INVALID_WEBHOOK_SIGNATURE');
      }

      return JSON.parse(payload);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Webhook processing failed', 500, 'WEBHOOK_FAILED', error);
    }
  }
}

export const razorpayService = new RazorpayService();
export default razorpayService;
