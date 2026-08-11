export interface BookingNotificationContext {
  bookingId: string;
  bookingNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  serviceName: string;
  categoryName: string;
  packageLabel: string;
  date: string; // pre-formatted, human readable
  time: string;
  numberOfPeople: number;
  totalAmount: number;
  reason?: string | null;
}

export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}

export interface EmailProvider {
  send(message: EmailMessage): Promise<{ providerMessageId: string }>;
}
