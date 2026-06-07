export type ProgramSlug = 'engineering' | 'coding' | 'ai-tools';

export interface SyllabusWeek {
  week: number;
  title: string;
  detail: string;
}

export interface FAQ {
  q: string;
  a: string;
}

export interface Program {
  slug: ProgramSlug;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  duration: string;
  cadence: string;
  platform: string;
  cohortType: 'fixed' | 'rolling';
  cohortLabel: string;
  startLabel: string;
  prerequisites: string;
  icon: 'circuit' | 'code' | 'spark';
  accentTopic: string;
  outcomes: string[];
  syllabus: SyllabusWeek[];
  instructor: { name: string; role: string; blurb: string };
  faqs: FAQ[];
}

export const PROGRAMS: Program[] = [
  {
    slug: 'engineering',
    name: 'Electrical & Mechanical Engineering',
    shortName: 'Engineering',
    tagline: 'Design and simulate real circuits — no hardware required.',
    description:
      'Build and simulate electromechanical systems entirely in the browser with Tinkercad and Arduino. From your first LED to an original capstone build.',
    duration: '4 weeks',
    cadence: '1 hour / week',
    platform: 'Tinkercad + Arduino (browser, free)',
    cohortType: 'fixed',
    cohortLabel: 'Fixed Cohort',
    startLabel: 'Starts week of July 5, 2026',
    prerequisites: 'None — total beginners welcome.',
    icon: 'circuit',
    accentTopic: 'Tinkercad · Arduino · Sensors',
    outcomes: [
      'Navigate Tinkercad Circuits confidently',
      'Understand series vs parallel and Ohm’s Law',
      'Write and debug Arduino sketches',
      'Use sensors and analog input / output',
      'Design and simulate an original electromechanical system',
    ],
    syllabus: [
      {
        week: 1,
        title: 'Intro to Tinkercad & Circuits',
        detail:
          'Interface tour, build and simulate LED circuits, series vs parallel, resistors, and Ohm’s Law.',
      },
      {
        week: 2,
        title: 'Arduino Basics',
        detail:
          'Microcontroller intro, the Blink sketch, pinMode / digitalWrite / delay, and a 3-LED traffic-light challenge.',
      },
      {
        week: 3,
        title: 'Sensors & Analog Input',
        detail:
          'analogRead() / analogWrite(), potentiometer and photoresistor, voltage dividers, the Serial Monitor, and a Smart Night Light build.',
      },
      {
        week: 4,
        title: 'Capstone',
        detail:
          'Design and simulate an original electromechanical system — a security alarm, temp-controlled fan, automatic plant watering, or motion light. Demo + certificate.',
      },
    ],
    instructor: {
      name: 'Mentor — Hardware & Embedded',
      role: 'Electronics engineer & maker',
      blurb:
        'A practising electronics engineer who has shipped embedded products and taught hundreds of first-time makers. Live each week to debug your circuits with you.',
    },
    faqs: [
      {
        q: 'Do I need to buy an Arduino or any components?',
        a: 'No. Everything runs in Tinkercad’s free browser simulator — you can complete the entire program on a low-end laptop or even a phone.',
      },
      {
        q: 'I’ve never touched electronics. Is that okay?',
        a: 'Absolutely. Week 1 starts from the very beginning. There are no prerequisites.',
      },
      {
        q: 'What do I get at the end?',
        a: 'A simulated, original capstone project you built yourself and a completion certificate.',
      },
    ],
  },
  {
    slug: 'coding',
    name: 'Coding (Python)',
    shortName: 'Coding — Python',
    tagline: 'Go from variables to a shipped project in four weeks.',
    description:
      'Learn Python the practical way — building a small app every single week. Finish with an original project you designed and shipped yourself.',
    duration: '4 weeks',
    cadence: '1 hour / week',
    platform: 'Replit or Google Colab (browser, free)',
    cohortType: 'fixed',
    cohortLabel: 'Fixed Cohort',
    startLabel: 'Starts week of July 5, 2026',
    prerequisites: 'None — total beginners welcome.',
    icon: 'code',
    accentTopic: 'Python · Logic · Projects',
    outcomes: [
      'Use variables, data types, and conditionals',
      'Write loops, lists, and your own functions',
      'Work with dictionaries, file I/O, and error handling',
      'Plan, build, and ship an original program',
    ],
    syllabus: [
      {
        week: 1,
        title: 'Foundations',
        detail:
          'Variables, data types, type conversion, f-strings, if / elif / else, and input(). Build a Personal Profile App.',
      },
      {
        week: 2,
        title: 'Loops, Lists & Functions',
        detail:
          'for / while, break / continue, range(), lists and indexing, def / parameters / return / scope. Build a Student Report Card.',
      },
      {
        week: 3,
        title: 'Dictionaries, File I/O & Errors',
        detail:
          'Key-value pairs, .items(), open() / read() / write() with `with`, and try / except / finally. Build a Contact Book.',
      },
      {
        week: 4,
        title: 'Capstone',
        detail:
          'An original Python project — budget tracker, grade manager, text game, password generator, or quiz engine. 1-minute demo + certificate.',
      },
    ],
    instructor: {
      name: 'Mentor — Software',
      role: 'Software engineer & educator',
      blurb:
        'A working software engineer who loves teaching beginners to think in code. Reviews your weekly builds live and helps you scope a capstone you can be proud of.',
    },
    faqs: [
      {
        q: 'Do I need to install anything?',
        a: 'No installs. We use Replit or Google Colab in the browser, so any device with a browser works.',
      },
      {
        q: 'Is this enough to start building real things?',
        a: 'Yes — by Week 4 you’ll plan and ship an original program end to end. It’s a genuine foundation to keep building on.',
      },
      {
        q: 'What if I miss a live session?',
        a: 'Each week is self-contained with a clear build goal, and your mentor will help you catch up.',
      },
    ],
  },
  {
    slug: 'ai-tools',
    name: 'AI Tools & Applications',
    shortName: 'AI Tools',
    tagline: 'Master the AI tools that make you faster — join any week.',
    description:
      'A practical, hands-on tour of the AI tools reshaping study and work. Each week is a standalone topic, so you can join any time and never feel behind.',
    duration: '12 weeks',
    cadence: '1 hour / week',
    platform: 'Web-based AI tools (mostly free tiers)',
    cohortType: 'rolling',
    cohortLabel: 'Rolling — Join Anytime',
    startLabel: 'Runs continuously from week of July 5, 2026',
    prerequisites: 'None — curiosity is enough.',
    icon: 'spark',
    accentTopic: 'ChatGPT · Midjourney · Automation',
    outcomes: [
      'Use leading AI tools for study and productivity',
      'Write effective prompts that get real results',
      'Automate repetitive work with no-code tools',
      'Create images, video, audio, and presentations with AI',
    ],
    syllabus: [
      { week: 1, title: 'ChatGPT for Productivity', detail: 'Use ChatGPT as a daily study and work assistant.' },
      { week: 2, title: 'Midjourney & Image Generation', detail: 'Generate and refine images from text prompts.' },
      { week: 3, title: 'Perplexity & AI Research', detail: 'Research faster with cited, source-backed answers.' },
      { week: 4, title: 'Microsoft Copilot', detail: 'AI inside Word, Excel, and PowerPoint.' },
      { week: 5, title: 'Notion AI & Knowledge Management', detail: 'Organize notes and knowledge with AI.' },
      { week: 6, title: 'Advanced Prompt Engineering', detail: 'Patterns that reliably get better outputs.' },
      { week: 7, title: 'AI Video Tools', detail: 'Create and edit video with Runway and CapCut.' },
      { week: 8, title: 'Automation with Zapier & Make', detail: 'Connect apps and automate workflows, no code.' },
      { week: 9, title: 'AI Data Analysis', detail: 'Analyze data with Code Interpreter.' },
      { week: 10, title: 'AI Presentations', detail: 'Build decks fast with Gamma and Canva AI.' },
      { week: 11, title: 'GitHub Copilot & AI Coding', detail: 'AI coding assistants for builders.' },
      { week: 12, title: 'AI Audio', detail: 'Voice, music, and transcription with ElevenLabs, Suno, and Whisper.' },
    ],
    instructor: {
      name: 'Mentor — AI & Automation',
      role: 'AI practitioner & productivity coach',
      blurb:
        'Lives in these tools daily and translates the fast-moving AI landscape into practical workflows you can use the same evening. Focus is on using AI well — not the math behind it.',
    },
    faqs: [
      {
        q: 'Can I really join in any week?',
        a: 'Yes. This is a rolling program and every week is a complete, standalone topic. Start whenever suits you and attend the topics you want.',
      },
      {
        q: 'Will this teach me how AI works internally?',
        a: 'No — and that’s intentional. The focus is the practical use of AI tools to get real things done, not the underlying machine learning.',
      },
      {
        q: 'Are the tools free?',
        a: 'Most have capable free tiers we use in class. Where a tool is paid, we’ll point out free alternatives.',
      },
    ],
  },
];

export const PROGRAM_BY_SLUG: Record<ProgramSlug, Program> = PROGRAMS.reduce(
  (acc, p) => {
    acc[p.slug] = p;
    return acc;
  },
  {} as Record<ProgramSlug, Program>,
);

/** Label used in the application dropdown + reused on the backend. */
export const PROGRAM_OPTIONS: { value: ProgramSlug; label: string }[] = [
  { value: 'engineering', label: 'Electrical & Mechanical Engineering' },
  { value: 'coding', label: 'Coding — Python' },
  { value: 'ai-tools', label: 'AI Tools & Applications' },
];
