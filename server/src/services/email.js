import nodemailer from 'nodemailer';
import { config } from '../config/index.js';
import { AppError } from '../utils/errors.js';

class EmailService {
  constructor() {
    this.transporter = null;
  }

  getTransporter() {
    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        host: config.email.host,
        port: config.email.port,
        secure: config.email.secure,
        auth: {
          user: config.email.user,
          pass: config.email.pass,
        },
      });
    }
    return this.transporter;
  }

  async sendEmail(options) {
    try {
      const transporter = this.getTransporter();
      await transporter.sendMail({
        from: config.email.from,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        attachments: options.attachments,
      });
    } catch (error) {
      console.error('Email send failed:', error);
      throw new AppError('Failed to send email', 500, 'EMAIL_FAILED', error);
    }
  }

  async sendWelcomeEmail(email, name) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #721224 0%, #90172e 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px; font-family: Georgia, serif;">Welcome to Sri Lakshmi Saree House</h1>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; margin-bottom: 20px;">Dear ${name},</p>
          <p>Thank you for joining Sri Lakshmi Saree House - your destination for authentic handwoven sarees from master artisans.</p>
          <p>With your account, you can:</p>
          <ul style="padding-left: 20px;">
            <li>Browse our curated collection of certified Silk Mark pure silks and handlooms</li>
            <li>Schedule 1-on-1 WhatsApp video drape inspection sessions</li>
            <li>Track your bespoke orders in real-time</li>
            <li>Manage delivery addresses and personalized measurements</li>
            <li>Save treasured weaves to your wishlist</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${config.frontendUrl}/products" style="background: #721224; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold; letter-spacing: 0.5px;">Explore Collection</a>
          </div>
          <p>If you have any questions, our master draping advisors are here to assist at <a href="mailto:support@srilakshmisarees.com">support@srilakshmisarees.com</a></p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="font-size: 12px; color: #888;">&copy; ${new Date().getFullYear()} Sri Lakshmi Saree House. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: 'Welcome to Sri Lakshmi Saree House',
      html,
    });
  }

  async sendOrderConfirmationEmail(email, name, orderNumber, items, total, shippingAddress) {
    const itemsHtml = items.map((item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toLocaleString('en-IN')}</td>
      </tr>
    `).join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #721224 0%, #90172e 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px; font-family: Georgia, serif;">Order Confirmed</h1>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; margin-bottom: 20px;">Dear ${name},</p>
          <p>Thank you for your order. Your order <strong>#${orderNumber}</strong> has been confirmed and is being hand-inspected for dispatch.</p>
          
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #eee;">
            <h3 style="margin-top: 0; color: #721224;">Order Summary</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #f5f5f5;">
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Item</th>
                  <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
                  <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            <div style="text-align: right; margin-top: 15px; font-size: 18px; font-weight: bold; color: #721224;">
              Total: ₹${total.toLocaleString('en-IN')}
            </div>
          </div>

          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #eee;">
            <h3 style="margin-top: 0; color: #721224;">Shipping Address</h3>
            <p style="margin: 5px 0;">${shippingAddress.name}</p>
            <p style="margin: 5px 0;">${shippingAddress.addressLine1}</p>
            <p style="margin: 5px 0;">${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${config.frontendUrl}/orders" style="background: #721224; color: white; padding: 14px 28px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">View Order Details</a>
          </div>

          <p>We will notify you with the courier tracking credentials when your order ships.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="font-size: 12px; color: #888;">&copy; ${new Date().getFullYear()} Sri Lakshmi Saree House. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: `Order Confirmed - #${orderNumber}`,
      html,
    });
  }

  async sendOrderStatusUpdateEmail(email, name, orderNumber, status, trackingNumber, trackingUrl) {
    const statusMessages = {
      confirmed: 'Your order has been confirmed and is being prepared.',
      processing: 'Your order is undergoing final quality inspection and packaging.',
      shipped: 'Your order has been dispatched via insured priority courier.',
      delivered: 'Your order has been successfully delivered.',
      cancelled: 'Your order has been cancelled.',
    };

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #721224 0%, #90172e 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px; font-family: Georgia, serif;">Order Status Update</h1>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; margin-bottom: 20px;">Dear ${name},</p>
          <p>Your order <strong>#${orderNumber}</strong> status is now:</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="background: #721224; color: white; padding: 8px 18px; border-radius: 4px; font-size: 16px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">${status}</span>
          </div>
          <p>${statusMessages[status] || 'Your order status has been updated.'}</p>
          
          ${trackingNumber ? `
            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; border: 1px solid #eee;">
              <h3 style="margin-top: 0; color: #721224;">Shipment Tracking</h3>
              <p>Consignment Number: <strong>${trackingNumber}</strong></p>
              ${trackingUrl ? `<a href="${trackingUrl}" style="background: #721224; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 10px;">Track Consignment</a>` : ''}
            </div>
          ` : ''}

          <div style="text-align: center; margin: 30px 0;">
            <a href="${config.frontendUrl}/orders" style="background: #721224; color: white; padding: 14px 28px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">View Order</a>
          </div>

          <p>For assistance, contact our concierge at <a href="mailto:support@srilakshmisarees.com">support@srilakshmisarees.com</a></p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="font-size: 12px; color: #888;">&copy; ${new Date().getFullYear()} Sri Lakshmi Saree House. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: `Order #${orderNumber} Update - ${status.toUpperCase()}`,
      html,
    });
  }

  async sendPasswordResetEmail(email, name, resetToken) {
    const resetUrl = `${config.frontendUrl}/reset-password?token=${resetToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #721224 0%, #90172e 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px; font-family: Georgia, serif;">Password Reset Request</h1>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; margin-bottom: 20px;">Dear ${name},</p>
          <p>A password reset was requested for your Sri Lakshmi Saree House account. Click below to set a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: #721224; color: white; padding: 14px 28px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Reset Password</a>
          </div>
          <p style="color: #666; font-size: 13px;">This security link expires in 1 hour. If you did not make this request, you can safely disregard this message.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="font-size: 12px; color: #888;">&copy; ${new Date().getFullYear()} Sri Lakshmi Saree House. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: 'Password Reset - Sri Lakshmi Saree House',
      html,
    });
  }

  async sendReturnRequestEmail(email, name, orderNumber, productName, reason) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #721224 0%, #90172e 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px; font-family: Georgia, serif;">Return Request Logged</h1>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; margin-bottom: 20px;">Dear ${name},</p>
          <p>We have logged your return request for order <strong>#${orderNumber}</strong> under our 7-Day Buyer Inspection Assurance policy.</p>
          
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #eee;">
            <h3 style="margin-top: 0; color: #721224;">Request Details</h3>
            <p><strong>Product:</strong> ${productName}</p>
            <p><strong>Reason:</strong> ${reason}</p>
            <p><strong>Status:</strong> <span style="color: #721224; font-weight: bold;">Under Concierge Review</span></p>
          </div>

          <p>Our quality verification desk will review the details within 24 hours. A complimentary reverse pickup will be scheduled upon approval.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${config.frontendUrl}/orders" style="background: #721224; color: white; padding: 14px 28px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Track Request Status</a>
          </div>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="font-size: 12px; color: #888;">&copy; ${new Date().getFullYear()} Sri Lakshmi Saree House. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: `Return Request Logged - Order #${orderNumber}`,
      html,
    });
  }

  async sendReturnStatusEmail(email, name, orderNumber, productName, status, adminNotes) {
    const statusMessages = {
      approved: 'Your return has been approved. Complimentary doorstep pickup has been initiated.',
      rejected: 'Your return request could not be processed under current inspection criteria.',
      received: 'We have received your returned weave at our master quality desk.',
      refunded: 'Your refund has been disbursed back to the original payment source.',
    };

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #721224 0%, #90172e 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px; font-family: Georgia, serif;">Return Request Update</h1>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; margin-bottom: 20px;">Dear ${name},</p>
          <p>Your return request for order <strong>#${orderNumber}</strong> has been updated.</p>
          
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #eee;">
            <h3 style="margin-top: 0; color: #721224;">Status Summary</h3>
            <p><strong>Product:</strong> ${productName}</p>
            <p><strong>Status:</strong> <span style="color: #721224; font-weight: bold; text-transform: uppercase;">${status}</span></p>
            ${adminNotes ? `<p><strong>Concierge Notes:</strong> ${adminNotes}</p>` : ''}
            <p>${statusMessages[status] || 'Your return status has been updated.'}</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${config.frontendUrl}/orders" style="background: #721224; color: white; padding: 14px 28px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">View Details</a>
          </div>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="font-size: 12px; color: #888;">&copy; ${new Date().getFullYear()} Sri Lakshmi Saree House. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: `Return ${status.toUpperCase()} - Order #${orderNumber}`,
      html,
    });
  }
}

export const emailService = new EmailService();
export default emailService;
