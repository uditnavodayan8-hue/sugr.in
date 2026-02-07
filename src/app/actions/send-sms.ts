'use server';

import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID; // Use this if using Verify API
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

export async function sendSms(to: string, body: string) {
    if (!accountSid || !authToken) {
        console.error('Twilio credentials missing');
        return { success: false, error: 'Server configuration error' };
    }

    const client = twilio(accountSid, authToken);

    try {
        // Check if we should use Messaging Service or direct number
        // The prompt mentioned "Messaging Service SID"
        const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

        let messageOptions: any = {
            body,
            to,
        };

        if (messagingServiceSid) {
            messageOptions.messagingServiceSid = messagingServiceSid;
        } else if (fromNumber) {
            messageOptions.from = fromNumber;
        } else {
            // Fallback or error if neither is set? 
            // Twilio might require 'from' or 'messagingServiceSid'
            console.warn("No From number or Messaging Service SID configured.");
        }

        const message = await client.messages.create(messageOptions);

        return { success: true, sid: message.sid };
    } catch (error: any) {
        console.error('Error sending SMS:', error);
        return { success: false, error: error.message };
    }
}
