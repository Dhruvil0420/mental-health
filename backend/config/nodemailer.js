import nodemailer from 'nodemailer';

// Setup email transporter configuration
let transporter = null;

if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false, // TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  console.log('Nodemailer Brevo SMTP Transporter configured successfully');
} else {
  console.warn('Nodemailer Warning: EMAIL_USER and EMAIL_PASS environment variables are not set. Emails will log to server console.');
}

/**
 * Send booking confirmation email
 */
export const sendAppointmentBookingEmail = async (userEmail, appointment) => {
  const mailOptions = {
    from: `"Prescripto Healthcare" <${process.env.EMAIL_USER || 'no-reply@prescripto.com'}>`,
    to: userEmail,
    subject: 'Appointment Booked Successfully - Prescripto',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #5f6fff; text-align: center;">Appointment Booked!</h2>
        <p>Dear Customer,</p>
        <p>Your medical appointment has been successfully scheduled. Here are the details:</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #eee;">Doctor Name:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${appointment.docData.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #eee;">Speciality:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${appointment.docData.speciality}</td>
          </tr>
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #eee;">Date & Time:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${appointment.slotDate} at ${appointment.slotTime}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #eee;">Amount Paid:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">$${appointment.amount}</td>
          </tr>
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #eee;">Payment Status:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${appointment.payment ? 'Paid' : 'Pending'}</td>
          </tr>
        </table>
        <p style="margin-top: 20px;">If you need to make changes, please visit your "My Appointments" panel in the Prescripto App.</p>
        <hr style="border: 0; height: 1px; background: #eee; margin-top: 30px;">
        <p style="font-size: 11px; color: #888; text-align: center;">Prescripto Medical HQ, Suite 500, San Francisco, CA</p>
      </div>
    `
  };

  if (transporter) {
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Confirmation email sent successfully to: ${userEmail}`);
    } catch (error) {
      console.error('Nodemailer Error sending booking email:', error);
    }
  } else {
    console.log('----------------- MOCK EMAIL LOG -----------------');
    console.log(`To: ${userEmail}`);
    console.log(`Subject: ${mailOptions.subject}`);
    console.log(`Body snippet: ${appointment.docData.name} on ${appointment.slotDate}`);
    console.log('--------------------------------------------------');
  }
};

/**
 * Send cancellation email
 */
export const sendAppointmentCancellationEmail = async (userEmail, appointment) => {
  const mailOptions = {
    from: `"Prescripto Healthcare" <${process.env.EMAIL_USER || 'no-reply@prescripto.com'}>`,
    to: userEmail,
    subject: 'Appointment Cancelled - Prescripto',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #d9534f; text-align: center;">Appointment Cancelled</h2>
        <p>Dear Customer,</p>
        <p>Your appointment with <strong>${appointment.docData.name}</strong> scheduled for <strong>${appointment.slotDate} at ${appointment.slotTime}</strong> has been cancelled.</p>
        <p>If a payment was made, refunds will be initiated automatically to your original payment method within 3-5 business days.</p>
        <p>If you have any questions or would like to schedule a new appointment, please feel free to visit our portal.</p>
        <hr style="border: 0; height: 1px; background: #eee; margin-top: 30px;">
        <p style="font-size: 11px; color: #888; text-align: center;">Prescripto Medical HQ, Suite 500, San Francisco, CA</p>
      </div>
    `
  };

  if (transporter) {
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Cancellation email sent successfully to: ${userEmail}`);
    } catch (error) {
      console.error('Nodemailer Error sending cancellation email:', error);
    }
  } else {
    console.log('----------------- MOCK EMAIL LOG -----------------');
    console.log(`To: ${userEmail}`);
    console.log(`Subject: ${mailOptions.subject}`);
    console.log(`Body: Cancelled appointment with ${appointment.docData.name}`);
    console.log('--------------------------------------------------');
  }
};
