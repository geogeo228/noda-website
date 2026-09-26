export default {
  htmlLang: 'en',
  locale: 'en-US',

  meta: {
    siteTitle: 'NODA — IT and AI solutions for business',
    siteDesc: 'IT and AI solutions for business. Koldun-Bot for events, chat monitoring, custom automation.',
    ogDesc: 'IT and AI solutions. Koldun-Bot, chat monitoring, custom automation.',
    blogTitle: 'Case studies — NODA',
    blogDesc: 'Case studies from NODA projects: AI solutions, Telegram bots, web apps, business automation.',
    blogOgDesc: 'Case studies from NODA projects: AI solutions, Telegram bots, web apps.',
    giorgiTitle: 'Georgi Kuchava — Founder of NODA',
    giorgiDesc: 'Georgi Kuchava, founder of NODA. Business automation with AI, Telegram bots, consulting.',
    giorgiOgDesc: 'Business automation with AI, Telegram bots, consulting.',
    orgDesc: 'IT and AI solutions for business',
  },

  notFound: {
    title: 'Page not found',
    text: 'There is no such page. The link may be out of date.',
    home: 'Home',
    blog: 'Blog',
  },

  nav: {
    about: 'About',
    products: 'Products',
    cases: 'Cases',
    contact: 'Contact',
    blog: 'Blog',
    cta: 'Discuss your task',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },

  hero: {
    titleMain: 'IT and AI solutions',
    titleDimPrefix: 'for ',
    titleScramble: 'business',
    sub: 'Ready-made products and custom builds, end to end.',
    ctaPrimary: 'Discuss your task for free',
    ctaSecondary: './products',
    stats: [
      { to: 1000, suffix: '+', label: 'photos in one evening' },
      { to: 24, suffix: '/7', label: 'chat monitoring' },
      { to: 0, suffix: '', label: 'manual work' },
    ],
  },

  about: {
    tag: '// 01 · about',
    title: 'Who runs NODA',
    name: 'Georgi Andreev',
    role: 'Founder',
    bio: 'I automate businesses with AI. I build Telegram bots, make processes smarter, and explain complicated things in plain language.',
    keyName: 'name',
    keyRole: 'role',
    keyBio: 'bio',
    keyContact: 'contact',
  },

  benefits: {
    tag: '// 02 · benefits',
    title: 'What you get',
    items: [
      { id: '#01', title: 'Fast launch', desc: 'No months of development, no drawn-out rollouts' },
      { id: '#02', title: 'More time for what matters', desc: 'Routine tasks run on autopilot' },
      { id: '#03', title: 'No lost clients', desc: 'Automatic follow-ups and reminders' },
      { id: '#04', title: 'Less on your plate', desc: 'The system handles the routine while you do the real work' },
    ],
  },

  products: {
    tag: '// 03 · products',
    title: 'What we build',
    sub: '$ ls ./products/ — 5 solutions to choose from',
  },

  process: {
    tag: '// 04 · process',
    title: 'How we work',
    footCmd: 'echo "timelines depend on complexity"',
    footOut: '→ typical project: 2-4 weeks',
    steps: [
      {
        num: '01', time: '⏱ 1-2 days', cmd: '$ ./discuss()',
        title: 'We discuss the task',
        desc: 'You tell me what hurts. I propose a solution.',
        bullets: ['30-60 min call', 'finding the bottlenecks', 'scoping the work'],
      },
      {
        num: '02', time: '⏱ 2-3 days', cmd: '$ ./plan()',
        title: 'We agree on the plan',
        desc: 'I show you how it will work before any code is written.',
        bullets: ['process diagram', 'stack and tools', 'timeline and cost'],
      },
      {
        num: '03', time: '⏱ 1-3 weeks', cmd: '$ ./build()',
        title: 'We build and test',
        desc: 'Development plus checks against real scenarios.',
        bullets: ['prototype in a week', 'demos along the way', 'adjustments as we go'],
      },
      {
        num: '04', time: '⏱ 1 day', cmd: '$ ./deploy()',
        title: 'We hand it over',
        desc: 'Working solution, instructions, support.',
        bullets: ['live in production', 'video walkthrough', '30 days of support'],
      },
    ],
  },

  cases: {
    tag: '// 05 · cases',
    title: 'Cases',
    sub: '→ Swipe right',
    dotLabel: 'Case',
    labelTask: 'task:',
    labelSolution: 'sol:',
    labelResult: 'res:',
  },

  why: {
    tag: '// 06 · why',
    title: 'Why us',
    items: [
      { ch: 'λ', title: 'Fast', desc: 'A working solution without the long wait' },
      { ch: '✓', title: 'It works', desc: 'We test every scenario we can think of' },
      { ch: '~', title: 'Clear', desc: 'No technical jargon' },
      { ch: '∞', title: 'Support', desc: 'We stay in touch after launch' },
    ],
  },

  cta: {
    tag: '// ready',
    titleLine1: 'Got a task —',
    titleLine2: "let's figure it out",
    sub1: "Not sure where to start? That's normal.",
    sub2: 'Tell me the situation and I will propose a solution. First consultation is free.',
    button: 'Message on Telegram',
  },

  footer: {
    sessionActive: 'session active',
    uptime: 'uptime',
    telegram: '→ telegram',
  },

  blog: {
    tag: '// cases',
    title: 'Cases',
    subtitle: 'Real projects. No filler — just the problem, the solution and the result.',
    readCase: '→ Read the case',
    backHome: '← Back home',
  },

  article: {
    backToBlog: '← All cases',
    ctaText: 'Want something similar for your business?',
    ctaButton: 'Discuss your task',
    related: 'Related cases',
    read: '→ Read',
    home: 'Home',
  },

  giorgi: {
    name: 'Georgi Kuchava',
    role: 'Founder of NODA',
    bio: 'I automate businesses with AI. I build Telegram bots, make processes smarter, and explain complicated things in plain language.',
    linkTelegram: 'Telegram',
    linkWrite: 'Message me',
    linkConsult: 'Book a consultation',
    back: '← NODA website',
    jobTitle: 'Founder of NODA',
  },
}
