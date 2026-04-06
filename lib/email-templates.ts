export const getOrderConfirmationEmailHtml = (orderId: string, name: string, items: any[], total: number) => {
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee;">
        <p style="margin: 0; font-weight: bold;">${item.title}</p>
        <p style="margin: 0; font-size: 12px; color: #666666;">Qty: ${item.quantity} × ₹${item.price}</p>
      </td>
      <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; text-align: right; font-weight: bold;">
        ₹${(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `).join('');

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333333; line-height: 1.6;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #000000; margin-bottom: 10px;">Order Confirmed!</h1>
        <p style="color: #666666;">Hi ${name}, your order #${orderId.slice(-6).toUpperCase()} has been successfully placed.</p>
      </div>

      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 10px; margin-bottom: 30px;">
        <h2 style="margin-top: 0; font-size: 18px; border-bottom: 2px solid #eeeeee; padding-bottom: 10px;">Order Summary</h2>
        <table style="width: 100%; border-collapse: collapse;">
          ${itemsHtml}
          <tr>
            <td style="padding: 20px 0 10px; font-size: 18px; font-weight: bold;">Total</td>
            <td style="padding: 20px 0 10px; font-size: 18px; font-weight: bold; text-align: right; color: #b45309;">₹${total.toFixed(2)}</td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; font-size: 12px; color: #999999; margin-top: 40px; border-top: 1px solid #eeeeee; padding-top: 20px;">
        <p>Thank you for shopping with Deeksha Candles!</p>
        <p>If you have any questions, reply to this email.</p>
      </div>
    </div>
  `;
};
