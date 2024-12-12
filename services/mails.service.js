
const nodemailer = require('nodemailer');

// Configuración del transporte para enviar correos
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

// Función para enviar un correo
const sendEmail = async (to, subject, text, html) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, 
    to, 
    subject, 
    text, 
    html, 
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Correo enviado exitosamente');
  } catch (error) {
    console.error('Error al enviar el correo', error);
  }
};

module.exports = sendEmail;
