import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { env } from '../util/env';

export class SmsService {
  private snsClient: SNSClient | null = null;

  constructor() {
    if (env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY) {
      this.snsClient = new SNSClient({
        region: env.AWS_REGION,
        credentials: {
          accessKeyId: env.AWS_ACCESS_KEY_ID,
          secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
        },
      });
      console.log(
        `[SmsService] Initialized AWS SNS Client in region: ${env.AWS_REGION}`
      );
    } else {
      console.warn(
        '[SmsService] AWS credentials (AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY) not present. SMS notifications will be logged to console in dev mode.'
      );
    }
  }

  /**
   * Sends an SMS message to a phone number using AWS SNS Publish Command.
   * In development mode (NODE_ENV === 'development'), logs the real OTP code to the console for testing.
   */
  async sendSms(
    phoneNumber: string,
    message: string,
    rawOtpCode?: string
  ): Promise<boolean> {
    const sanitizedPhone = phoneNumber.replace(/[^\d+]/g, '');

    // In development mode, log the real OTP to the console for local testing
    if (env.NODE_ENV === 'development') {
      console.log(
        `\n=========================================\n[SmsService DEV MOCK] Mobile Verification OTP\nPhone: ${sanitizedPhone}\nOTP Code: ${rawOtpCode || 'N/A'}\nMessage: "${message}"\n=========================================\n`
      );
    }

    try {
      if (this.snsClient) {
        const command = new PublishCommand({
          Message: message,
          PhoneNumber: sanitizedPhone,
          MessageAttributes: {
            'AWS.SNS.SMS.SMSType': {
              DataType: 'String',
              StringValue: 'Transactional',
            },
          },
        });

        const response = await this.snsClient.send(command);
        console.log(
          `[SmsService] AWS SNS SMS published successfully to ${sanitizedPhone}. MessageId: ${response.MessageId}`
        );
        return true;
      } else {
        if (env.NODE_ENV !== 'development') {
          console.log(
            `[SmsService] AWS credentials not configured. SMS dispatch skipped for ${sanitizedPhone}.`
          );
        }
        return true;
      }
    } catch (error) {
      console.error(
        `[SmsService] Error publishing SMS via AWS SNS to ${sanitizedPhone}:`,
        error
      );
      return false;
    }
  }
}

export const smsService = new SmsService();
