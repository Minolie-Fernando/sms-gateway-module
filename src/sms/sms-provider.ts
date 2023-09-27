interface SMSProvider {
    sendSMS(number: string, content: string): boolean;
}