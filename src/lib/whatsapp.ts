export const WHATSAPP_NUMBER = '916358290268';
export const INSTAGRAM_URL = 'https://instagram.com/mehndibydhara';

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function bookingWhatsappMessage(params: {
  name: string;
  service: string;
  package: string;
  date: string;
  time: string;
  people: number;
  pricePerPerson: number;
  totalPrice: number;
}) {
  return [
    `Hi Mehndi By Dhara! I'd like to book an appointment.`,
    `Name: ${params.name}`,
    `Service: ${params.service} - ${params.package}`,
    `Date: ${params.date}`,
    `Time: ${params.time}`,
    `Number of people: ${params.people}`,
    `Price per person: ₹${params.pricePerPerson}`,
    `Total price: ₹${params.totalPrice}`,
  ].join('\n');
}
