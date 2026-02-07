import { sendSms as sendSmsServerAction } from '@/app/actions/send-sms';

export async function sendSms(to: string, body: string): Promise<{ success: boolean; error?: string }> {
    return await sendSmsServerAction(to, body);
}