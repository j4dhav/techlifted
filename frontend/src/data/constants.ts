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

export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia',
  'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming',
];

export interface Country {
  name: string;
  dial: string;
}

/** Countries with international dial codes (alphabetical). */
export const COUNTRIES: Country[] = [
  { name: 'Afghanistan', dial: '+93' }, { name: 'Albania', dial: '+355' },
  { name: 'Algeria', dial: '+213' }, { name: 'Argentina', dial: '+54' },
  { name: 'Armenia', dial: '+374' }, { name: 'Australia', dial: '+61' },
  { name: 'Austria', dial: '+43' }, { name: 'Azerbaijan', dial: '+994' },
  { name: 'Bahrain', dial: '+973' }, { name: 'Bangladesh', dial: '+880' },
  { name: 'Belarus', dial: '+375' }, { name: 'Belgium', dial: '+32' },
  { name: 'Bolivia', dial: '+591' }, { name: 'Bosnia and Herzegovina', dial: '+387' },
  { name: 'Brazil', dial: '+55' }, { name: 'Bulgaria', dial: '+359' },
  { name: 'Cambodia', dial: '+855' }, { name: 'Cameroon', dial: '+237' },
  { name: 'Canada', dial: '+1' }, { name: 'Chile', dial: '+56' },
  { name: 'China', dial: '+86' }, { name: 'Colombia', dial: '+57' },
  { name: 'Costa Rica', dial: '+506' }, { name: 'Croatia', dial: '+385' },
  { name: 'Cyprus', dial: '+357' }, { name: 'Czechia', dial: '+420' },
  { name: 'Denmark', dial: '+45' }, { name: 'Dominican Republic', dial: '+1' },
  { name: 'Ecuador', dial: '+593' }, { name: 'Egypt', dial: '+20' },
  { name: 'El Salvador', dial: '+503' }, { name: 'Estonia', dial: '+372' },
  { name: 'Ethiopia', dial: '+251' }, { name: 'Finland', dial: '+358' },
  { name: 'France', dial: '+33' }, { name: 'Georgia', dial: '+995' },
  { name: 'Germany', dial: '+49' }, { name: 'Ghana', dial: '+233' },
  { name: 'Greece', dial: '+30' }, { name: 'Guatemala', dial: '+502' },
  { name: 'Hong Kong', dial: '+852' }, { name: 'Hungary', dial: '+36' },
  { name: 'Iceland', dial: '+354' }, { name: 'India', dial: '+91' },
  { name: 'Indonesia', dial: '+62' }, { name: 'Iran', dial: '+98' },
  { name: 'Iraq', dial: '+964' }, { name: 'Ireland', dial: '+353' },
  { name: 'Israel', dial: '+972' }, { name: 'Italy', dial: '+39' },
  { name: 'Japan', dial: '+81' }, { name: 'Jordan', dial: '+962' },
  { name: 'Kazakhstan', dial: '+7' }, { name: 'Kenya', dial: '+254' },
  { name: 'Kuwait', dial: '+965' }, { name: 'Latvia', dial: '+371' },
  { name: 'Lebanon', dial: '+961' }, { name: 'Lithuania', dial: '+370' },
  { name: 'Luxembourg', dial: '+352' }, { name: 'Malaysia', dial: '+60' },
  { name: 'Maldives', dial: '+960' }, { name: 'Malta', dial: '+356' },
  { name: 'Mexico', dial: '+52' }, { name: 'Morocco', dial: '+212' },
  { name: 'Nepal', dial: '+977' }, { name: 'Netherlands', dial: '+31' },
  { name: 'New Zealand', dial: '+64' }, { name: 'Nigeria', dial: '+234' },
  { name: 'Norway', dial: '+47' }, { name: 'Oman', dial: '+968' },
  { name: 'Pakistan', dial: '+92' }, { name: 'Panama', dial: '+507' },
  { name: 'Peru', dial: '+51' }, { name: 'Philippines', dial: '+63' },
  { name: 'Poland', dial: '+48' }, { name: 'Portugal', dial: '+351' },
  { name: 'Qatar', dial: '+974' }, { name: 'Romania', dial: '+40' },
  { name: 'Russia', dial: '+7' }, { name: 'Saudi Arabia', dial: '+966' },
  { name: 'Serbia', dial: '+381' }, { name: 'Singapore', dial: '+65' },
  { name: 'Slovakia', dial: '+421' }, { name: 'Slovenia', dial: '+386' },
  { name: 'South Africa', dial: '+27' }, { name: 'South Korea', dial: '+82' },
  { name: 'Spain', dial: '+34' }, { name: 'Sri Lanka', dial: '+94' },
  { name: 'Sweden', dial: '+46' }, { name: 'Switzerland', dial: '+41' },
  { name: 'Taiwan', dial: '+886' }, { name: 'Tanzania', dial: '+255' },
  { name: 'Thailand', dial: '+66' }, { name: 'Tunisia', dial: '+216' },
  { name: 'Turkey', dial: '+90' }, { name: 'Uganda', dial: '+256' },
  { name: 'Ukraine', dial: '+380' }, { name: 'United Arab Emirates', dial: '+971' },
  { name: 'United Kingdom', dial: '+44' }, { name: 'United States', dial: '+1' },
  { name: 'Uruguay', dial: '+598' }, { name: 'Uzbekistan', dial: '+998' },
  { name: 'Venezuela', dial: '+58' }, { name: 'Vietnam', dial: '+84' },
  { name: 'Yemen', dial: '+967' }, { name: 'Zimbabwe', dial: '+263' },
];

/** Countries that get a state/province dropdown instead of a free-text field. */
export const STATES_BY_COUNTRY: Record<string, string[]> = {
  'United States': US_STATES,
  India: INDIAN_STATES,
};

export const DEVICE_OPTIONS = [
  'Desktop Computer', 'Laptop', 'Tablet', 'Smartphone', 'Other',
] as const;

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
  email: 'techliftedofficial@gmail.com',
  // Public WhatsApp community invite link (overridden by VITE_WHATSAPP_COMMUNITY).
  whatsappCommunity: 'https://chat.whatsapp.com/your-invite-code',
  instagram: 'https://www.instagram.com/techlifted/',
  linkedin: 'https://www.linkedin.com/in/techlifted-36a976416',
  youtube: 'https://www.youtube.com/@TechliftEDofficial',
};

export const STATS = [
  { value: '3', label: 'Programs' },
  { value: '20', label: 'Weeks of Content' },
  { value: 'Live', label: 'Mentors' },
  { value: 'Anytime', label: 'Join AI Tools' },
];
