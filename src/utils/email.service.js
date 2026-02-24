const nodemailer = require("nodemailer");
const { smtp, appDomain } = require("../config/env");

const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.port === 465, // true for 465, false for other ports
    auth: {
        user: smtp.user,
        pass: smtp.pass,
    },
});

/**
 * Send Welcome Email to Bank Admin
 */
exports.sendBankWelcomeEmail = async (bankData, adminData) => {
    try {
        const loginUrl = `https://${bankData.subdomain}.${appDomain}`;

        const mailOptions = {
            from: smtp.from,
            to: adminData.email,
            subject: `Welcome to Finware - ${bankData.name} Node Activated`,
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #009BB0; margin: 0;">Finware Core</h1>
                        <p style="color: #666; font-size: 14px;">Next-Gen Multi-Tenant Banking Infrastructure</p>
                    </div>
                    
                    <h2 style="color: #333;">Welcome, ${adminData.name}!</h2>
                    <p style="color: #555; line-height: 1.6;">
                        Your institution node, <strong>${bankData.name}</strong>, has been successfully provisioned and initialized on our secure network.
                    </p>
                    
                    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #009BB0;">
                        <h3 style="margin-top: 0; color: #333; font-size: 16px;">Node Access Credentials</h3>
                        <p style="margin: 10px 0; font-size: 14px;"><strong>Portal URL:</strong> <a href="${loginUrl}" style="color: #009BB0; text-decoration: none;">${loginUrl}</a></p>
                        <p style="margin: 10px 0; font-size: 14px;"><strong>Admin Email:</strong> ${adminData.email}</p>
                        <p style="margin: 10px 0; font-size: 14px;"><strong>Initial Password:</strong> <span style="background: #eee; padding: 2px 5px; border-radius: 3px;">${adminData.password}</span></p>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${loginUrl}" style="background-color: #009BB0; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Initialize Admin Session</a>
                    </div>
                    
                    <p style="color: #888; font-size: 12px; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
                        This is an automated system message. Please do not reply to this email. 
                        Security Notice: Change your password immediately after your first login.
                    </p>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Welcome Email Sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Email Service Error:", error);
        // We don't throw here to avoid failing the whole bank creation process 
        // if just the email fails, but in production you might want retry logic
        return null;
    }
};
