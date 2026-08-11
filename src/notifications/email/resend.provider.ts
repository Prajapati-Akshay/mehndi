import type { EmailMessage, EmailProvider } from '../types';

/** Returns null (not "not configured" thrown) when EMAIL_API_KEY is missing, so the caller
 *  can record the notification as SKIPPED instead of FAILED. */
export function getEmailProvider(): EmailProvider | null {
  const apiKey = process.env.EMAIL_API_KEY;
  const from = process.env.EMAIL_FROM;
  const replyTo = process.env.EMAIL_REPLY_TO || undefined;
  if (!apiKey || !from) return null;

  return {
    async send(message: EmailMessage) {
      const { Resend } = await import('resend');
      const resend = new Resend(apiKey);
      const { data, error } = await resend.emails.send({
        from,
        to: message.to,
        subject: message.subject,
        text: message.text,
        html: message.html,
        replyTo: message.replyTo ?? replyTo,
      });
      if (error) throw new Error(error.message);
      return { providerMessageId: data?.id ?? 'unknown' };
    },
  };
}
