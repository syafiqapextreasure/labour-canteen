/** Prepare a message for the customer's own email or WhatsApp app; never send it. */
export function enquiryTarget(fields, planText = '', mode = 'whatsapp', locale = 'en') {
  const value = key => String(fields[key] || '').trim();
  if (!value('name') || !value('company')) throw new Error('Name and company are required.');
  const ms = locale === 'ms';
  const labels = ms
    ? ['Nama', 'Syarikat', 'E-mel', 'Telefon', 'Bilangan pekerja', 'Keperluan']
    : ['Name', 'Company', 'Email', 'Phone', 'Workforce size', 'Requirements'];
  const keys = ['name', 'company', 'email', 'phone', 'workers', 'message'];
  const greeting = ms
    ? 'Salam Labour Canteen,\n\nSila hubungi saya berkenaan makanan untuk pekerja.'
    : 'Hello Labour Canteen,\n\nPlease contact me about workforce meals.';
  const body = greeting + '\n' + keys.map((key, i) => labels[i] + ': ' + value(key)).join('\n')
    + (fields.includePlan && planText ? '\n\n' + planText : '');
  if (mode === 'email') {
    const subject = (ms ? 'Pertanyaan makanan pekerja — ' : 'Workforce meal enquiry — ') + value('company');
    return 'mailto:mail@labourcanteen.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }
  return 'https://wa.me/60198176003?text=' + encodeURIComponent(body);
}
