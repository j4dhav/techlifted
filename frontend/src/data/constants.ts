export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir',
  'Ladakh', 'Lakshadweep', 'Puducherry',
];

export const DEVICE_OPTIONS = [
  'Desktop Computer', 'Laptop', 'Tablet', 'Smartphone', 'Other',
] as const;

/** A small set of common country codes; +91 (India) is the default. */
export const COUNTRY_CODES = [
  { code: '+91', label: 'IN +91' },
  { code: '+1', label: 'US +1' },
  { code: '+44', label: 'UK +44' },
  { code: '+971', label: 'AE +971' },
  { code: '+65', label: 'SG +65' },
  { code: '+61', label: 'AU +61' },
  { code: '+977', label: 'NP +977' },
  { code: '+880', label: 'BD +880' },
];

/** AI Tools rolling cohort — selectable start weeks (12 standalone topics). */
export const AI_TOOLS_START_WEEKS = [
  'Week 1 — ChatGPT for Productivity',
  'Week 2 — Midjourney & Image Generation',
  'Week 3 — Perplexity & AI Research',
  'Week 4 — Microsoft Copilot',
  'Week 5 — Notion AI & Knowledge Management',
  'Week 6 — Advanced Prompt Engineering',
  'Week 7 — AI Video Tools',
  'Week 8 — Automation with Zapier & Make',
  'Week 9 — AI Data Analysis',
  'Week 10 — AI Presentations',
  'Week 11 — GitHub Copilot & AI Coding',
  'Week 12 — AI Audio',
];

export const CONTACT = {
  email: 'hello@techlifted.in',
  whatsappNumber: '+91 90000 00000',
  // Public WhatsApp community invite link (placeholder until configured).
  whatsappCommunity: 'https://chat.whatsapp.com/your-invite-code',
  instagram: 'https://instagram.com/',
  linkedin: 'https://linkedin.com/',
  youtube: 'https://youtube.com/',
};

export const STATS = [
  { value: '3', label: 'Programs' },
  { value: '20', label: 'Weeks of Content' },
  { value: 'Live', label: 'Mentors' },
  { value: 'Anytime', label: 'Join AI Tools' },
];
