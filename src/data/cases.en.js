// Английская версия src/data/cases.js. Идентификаторы и медиа совпадают
// с русскими — расходится только текст.
export const cases = [
  {
    id: 'koldun-corp',
    client: 'Diaghilev Group',
    title: 'Koldun-Bot at a corporate party',
    task: 'Something interactive for guests at an event',
    solution: 'An AI photo booth with custom styles',
    results: [
      '1000+ photos in one evening',
      'A genuine wow moment for guests',
      'Styled to your brand or your event',
    ],
    media: { type: 'video', src: '/assets/Колдун_Бот_визуал.mp4', poster: '/assets/poster_koldun.jpg' },
  },
  {
    id: 'photozones',
    client: 'Diaghilev Group',
    title: 'Photo zone generator',
    task: 'Creating one-off photo zones for events',
    solution: 'AI-generated photo zone designs matched to the brand',
    results: [
      'Unique designs in minutes',
      'Fits the style of any event',
    ],
    media: { type: 'video', src: '/assets/photozones-dyagilev.mp4' },
  },
  {
    id: 'podryadchik',
    client: 'Diaghilev Group',
    title: 'Automated contractor data collection',
    task: 'Collect data from contractors without doing it by hand',
    solution: 'Telegram bot + classification + Google Sheets',
    results: [
      'Zero manual work',
      'Data comes in structured',
    ],
    media: { type: 'video', src: '/assets/Podryadchik_bot.mp4', poster: '/assets/poster_podryadchik.jpg' },
  },
  {
    id: 'transcriber',
    title: 'Transcription bot',
    task: 'Turning audio and video into text',
    solution: 'A Telegram bot with AI speech recognition',
    results: [
      'Transcripts in moments',
      'Works with both audio and video',
    ],
    media: { type: 'video', src: '/assets/transcriber-bot.mp4' },
  },
  {
    id: 'festival',
    title: 'Pet Lovers Festival',
    task: 'Something interactive for festival visitors',
    solution: 'Koldun-Bot with themed styles',
    results: [
      'Visitors got involved',
      'Content worth posting on social media',
    ],
    media: { type: 'video', src: '/assets/festival.mp4' },
  },
  {
    id: 'wedding-ai',
    title: 'AI manager for a wedding',
    task: 'Automating wedding organisation',
    solution: 'An AI assistant for managing tasks and guests',
    results: [
      'The routine runs itself',
      'Every task accounted for',
    ],
    media: { type: 'image', src: '/assets/wedding-ai.webp' },
  },
  {
    id: 'order-bot',
    title: 'Bot for handling incoming requests',
    task: 'Accepting and processing requests automatically',
    solution: 'A Telegram bot that routes requests where they belong',
    results: [
      'Requests handled instantly',
      'No manager in the loop',
    ],
    media: { type: 'image', src: '/assets/order-bot.webp' },
  },
  {
    id: 'anb-monitor',
    title: 'ActionNet chat monitoring',
    task: 'Catch requests across 50+ Telegram chats',
    solution: 'ActionNet — automated monitoring plus AI filtering',
    results: [
      'Leads arrive on their own',
      'No need to watch the chats',
    ],
    media: { type: 'image', src: '/assets/anb-screen.webp' },
  },
]
