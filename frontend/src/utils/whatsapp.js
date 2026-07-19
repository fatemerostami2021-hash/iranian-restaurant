export function buildWhatsAppLink(number, message) {
  const cleanNumber = String(number).replace(/[^\d]/g, '');
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(number, message) {
  const url = buildWhatsAppLink(number, message);
  window.open(url, '_blank');
  return url;
}
