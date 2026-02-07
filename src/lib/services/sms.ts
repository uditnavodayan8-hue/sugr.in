import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

// Initialize Twilio client lazily
let client: twilio.Twilio | null = null;

if (accountSid && authToken) {
    client = twilio(accountSid, authToken);
} else {
    console.warn('Twilio credentials not found. SMS features will be disabled.');
}

export async function sendSms(to: string, body: string): Promise<{ success: boolean; error?: string }> {
    if (!client) {
        console.error('Twilio client not initialized');
        return { success: false, error: 'SMS service not configured' };
    }

    try {
        await client.messages.create({
            body,
            from: fromNumber,
            to,
        });
        return { success: true };
    } catch (error: any) {
        console.error('Error sending SMS:', error);
        return { success: false, error: error.message || 'Failed to send SMS' };
    }
}
