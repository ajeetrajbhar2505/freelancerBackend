const jwt = require('jsonwebtoken');
const Token = require('../models/Token'); // Import the Token model defined previously
const { sendEmail } = require('../utils/emailService')
const { generateHTMLTemplate }  = require('../models/email_template')
// Function to generate a JWT token
async function generateToken({ userId, email, dateTime }, callback) {
    try {
        const otp = generateOTP(); // Generate OTP
        const tokenData = {
            userId: userId,
            email: email,
            dateTime: dateTime,
            otp: otp
        };
        const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '15m' }); // Sign JWT token with expiry
        await Token.create(tokenData); // Create token data in the database
        const mailOption = {
            from: "ajeetrajbhar2504@gmail.com",
            to: email,
            subject: "Verification Code - Class App",
            html: generateHTMLTemplate(otp),
        };

        sendEmail(mailOption, function(err) {
            if (err) {
                callback(err); // Call the callback with the error
            } else {
                callback(null, token); // Call the callback with null error and the token
            }
        });
    } catch (error) {
        callback(error); // Call the callback with the error
    }
}


async function verifyToken(token) {
    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        throw error;
    }
}


// Function to generate OTP
function generateOTP() {
    const firstDigit = Math.floor(Math.random() * 9) + 1; // Random digit between 1 and 9
    const remainingDigits = Array.from({ length: 3 }, () => Math.floor(Math.random() * 10)); // Array of 3 random digits between 0 and 9
    const otp = parseInt(`${firstDigit}${remainingDigits.join('')}`, 10);
    return otp;
}



module.exports = {
    generateToken,
    verifyToken
};



