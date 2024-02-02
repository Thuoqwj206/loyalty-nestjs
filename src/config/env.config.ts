import 'dotenv/config'
export const SECRET_KEY: string = process.env.ACCESSKEY || 'key'
export const PORT: number = +process.env.PORT || 3000
export const APP_URL: string = process.env.APP_URL || 'http://localhost:3000'
export const ADMIN_ADDRESS: string = process.env.ADMIN_ADDRESS || '2001040199@s.hanu.edu.vn'
export const MAIL_MAILER: string = process.env.MAIL_MAILER || 'smtp'
export const MAIL_HOST: string = process.env.MAIL_HOST || 'smtp.gmail.com'
export const MAIL_USERNAME: string = process.env.MAIL_USERNAME || '587'
export const MAIL_PASSWORD: string = process.env.MAIL_PASSWORD || 'phamvanthuog70@gmail.com'
export const MAIL_ENCRYPTION: string = process.env.MAIL_ENCRYPTION || 'ilxoqoacciodliqv'
export const MAIL_FROM_ADDRESS: string = process.env.MAIL_FROM_ADDRESS || 'TLS'
export const MAIL_FROM_NAME: string = process.env.MAIL_FROM_NAME || '${APP_NAME}'
export const TWILIO_ACCOUNT_SID: string = process.env.TWILIO_ACCOUNT_SID || 'ACd73245bd712d5345d8a72a8472373e41'
export const TWILIO_AUTH_TOKEN: string = process.env.TWILIO_AUTH_TOKEN || '5454cf1bcb882090a75c904451fee5e7'
export const TWILIO_VERIFICATION_SERVICE_SID: string = process.env.TWILIO_VERIFICATION_SERVICE_SID || 'VA06376a7ea9d4cb2ff19f5bded95f9f3c'
export const REDIS_HOST: string = process.env.TWILIO_PHONE_NUMBER || '+18787686710'
export const REDIS_PORT: string = process.env.TWILIO_PHONE_NUMBER || 'key'
export const REDIS_USER: string = process.env.TWILIO_PHONE_NUMBER || 'key'
export const REDIS_PASSWORD: string = process.env.TWILIO_PHONE_NUMBER || 'key'