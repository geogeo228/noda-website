// Английская версия src/data/articles.js.
// slug, tags и related совпадают с русскими: по слагу связываются языковые
// версии в hreflang, поэтому менять его при переводе нельзя.
const articles = [
  {
    slug: 'shelf-monitoring-ai',
    title: 'How we taught AI to check store shelves instead of 300 people',
    desc: 'A sales rep photographs a shelf and gets a share-of-shelf report seconds later. No guesswork, no errors, no hours of manual work.',
    tags: ['Computer Vision', 'CRM', 'Enterprise'],
    related: ['meeting-transcriber', 'brand-positioning-ai'],
    sections: [
      {
        heading: 'A familiar pain: reports you cannot trust',
        body: 'Picture this: you have 300 sales reps. Each one walks the stores, photographs the fridges and eyeballs how much shelf space your product takes up. Then fills in a report by hand.\n\nOne of them calls it "roughly 40%", another looks at the same fridge and says 25%. You make decisions based on those numbers, but the numbers are subjective. On top of that it eats hours every day that could go into selling.\n\nThe client had already tried other AI solutions and was not happy with the quality. They came to us with one request: make it actually work.'
      },
      {
        heading: 'Photo in, objective report out, in seconds',
        body: 'Now the rep simply photographs the shelf inside the CRM they already use. No separate app, no new interface — the same workflow, minus the manual counting.\n\nThe photo goes to the server, the AI analyses the image and works out the exact share of shelf, both yours and your competitors\'. Based on that, a task appears in the CRM automatically: where to reorder, where a competitor needs pushing back, where everything is fine.\n\nThe manager sees the picture across every location in real time, instead of waiting until end of day.'
      },
      {
        heading: 'Why it holds up',
        body: 'In enterprise you cannot lose data. If the CRM stops responding or a photo fails to process, the request goes into a queue and gets handled later. Nothing disappears, even if the server drops for a second.\n\nThe system was designed to grow: from 300 photos a day at launch to 7,500 once it rolls out across every site.'
      },
      {
        heading: 'What this gives your business',
        body: 'Objective data instead of subjective guesses. Sales reps spend their time selling rather than counting. Managers decide based on facts rather than impressions.\n\nIf you have a similar task — shelf monitoring, merchandising control, retail audits — this adapts to any CRM and any scale.'
      }
    ]
  },
  {
    slug: 'festival-app-ai-calendar',
    title: 'An app for a 2,000-person festival: AI builds the schedule itself',
    desc: 'An attendee says what interests them and gets a personal three-day plan. Not a 40-item PDF, but a living schedule built for them.',
    tags: ['Web App', 'AI', 'Events'],
    related: ['pet-festival-demo', 'wedding-chatbot'],
    sections: [
      {
        heading: 'A PDF schedule does not work',
        body: 'A business festival: 2,000 attendees, 3 days, several venues, dozens of sessions running at once. The organisers hand out a PDF, the guest opens it, sees 40 items in tiny type and goes wherever everyone else is going.\n\nThe result: half the rooms empty, half overflowing. An attendee misses the one session made for them because they never found it in the schedule. They leave disappointed, and the organiser loses their loyalty.'
      },
      {
        heading: 'A personal plan in 30 seconds',
        body: 'The attendee marks their interests — marketing, finance, networking. The AI builds a plan for each day: what to attend, when to break, where to network. The schedule is live: you can move things around and adjust it right on your phone.\n\nThere is also a searchable attendee directory, so you can find people from your industry and arrange to meet between sessions. All of it mobile-first, because nobody opens a laptop at a festival.'
      },
      {
        heading: 'What the organiser gets out of it',
        body: 'An even load across venues, because the AI spreads people by interest rather than by herd instinct. Attendees are happier, because each one gets their own version of the festival. And a happy attendee means repeat sales and referrals.\n\nThe same model fits any conference, corporate event or trade show. If you run an event for 200+ people with parallel sessions, this solves the navigation problem.'
      }
    ]
  },
  {
    slug: 'meeting-transcriber',
    title: 'A meeting transcriber that admits when it is unsure',
    desc: 'Upload a recording of the meeting and get a list of tasks with owners. Anything doubtful is flagged separately so nothing slips through.',
    tags: ['AI', 'Whisper', 'Productivity'],
    related: ['voice-transcription-bot', 'event-agency-task-tracker'],
    sections: [
      {
        heading: 'After the meeting comes silence',
        body: 'Everyone nods during the meeting, everyone leaves, and two days later half of it is forgotten. One person understood it one way, someone else another. Nobody wants to take minutes — it is dull and it pulls you out of the discussion.\n\nIf you have more than five meetings a week, you are definitely losing tasks. Not because the team is bad, but because no human retains everything said over an hour.'
      },
      {
        heading: 'Upload the recording, get the tasks',
        body: 'You upload the audio or video of the meeting. The system transcribes the speech and works out who spoke when. Then the AI produces a short summary and a list of tasks with owners and deadlines.\n\nThe important part: tasks the AI is unsure about go into a separate "Needs review" block. Not buried in the main list with a "possibly" attached, but genuinely set apart. You decide whether they make the cut.\n\nMost tools just hand you a flat list and pretend everything in it is certain. Ours says plainly: I might have got this one wrong. It sounds like a small thing, but it is exactly what makes the tool trustworthy.'
      },
      {
        heading: 'Who needs this',
        body: 'A 20-minute meeting is processed in about 4 minutes. It suits teams with plenty of meetings and no dedicated note-taker: startups, agencies, consultancies, business clubs.\n\nIn the production version tasks will go straight into your task tracker. The flagging mechanism already works and has been tested on real recordings.'
      }
    ]
  },
  {
    slug: 'pharma-feedback-bot',
    title: 'A bot for a pharma company: collecting patient reports the way the law requires',
    desc: 'A step-by-step form in Telegram: category, validated details, file attachments, consent for personal data. Nothing gets lost, everything complies.',
    tags: ['Telegram Bot', 'Enterprise', 'Healthcare'],
    related: ['industrial-orders-bot', 'real-estate-lead-bot'],
    sections: [
      {
        heading: 'Reports were falling between channels',
        body: 'A pharmaceutical company took patient reports by phone, by email and through messengers. The data was scattered across three channels, some of it went missing, and there was no single picture.\n\nIn pharma that is not merely inconvenient, it breaks the law. Every report about a side effect or product quality has to be recorded under Russia\'s personal data legislation (152-FZ). The fines are real, and the reputational risk costs more still.'
      },
      {
        heading: 'One bot instead of three channels',
        body: 'The patient writes to a Telegram bot. The bot walks them through it: category of the report (safety, quality, return), personal details validated as they type — name, phone, email. Up to five files can be attached.\n\nBefore submitting there is a preview of everything entered. Any field can be corrected without starting over. Consent to process personal data is requested explicitly, exactly as the law requires.\n\nThe report reaches the responsible employee instantly, with all the information attached. Nothing is lost, nothing has to be asked twice.'
      },
      {
        heading: 'If you are in a similar position',
        body: 'This is not only about pharma. Any company that handles customer reports and has to comply with data protection law runs into the same problems: data in different places, no single process, no easy way to confirm nothing was lost.\n\nThe bot adapts to other industries and channels — the next stage adds a web version and VKontakte.'
      }
    ]
  },
  {
    slug: 'real-estate-lead-bot',
    title: 'A bot for a broker: qualify, warm up for 14 days, hand over the hot lead',
    desc: 'Two minutes in a bot instead of twenty on a cold client. Two weeks later only the warm ones reach you.',
    tags: ['Telegram Bot', 'Sales', 'Automation'],
    related: ['tour-operator-ai-manager', 'pharma-feedback-bot'],
    sections: [
      {
        heading: 'Dozens of enquiries, one sale in twenty',
        body: 'A real estate broker in a resort region. Plenty of enquiries, but most of them are "just looking, nothing specific yet". Each client took 15-20 minutes of conversation. One in twenty closed.\n\nIf you sell something expensive with a long decision cycle — property, cars, B2B services — you will recognise this. The manager spends 80% of their time on people who will never buy.'
      },
      {
        heading: 'How the bot filters for you',
        body: 'A quick qualification: budget, purpose of purchase, phone number. Two minutes instead of twenty. Straight afterwards, a buyer\'s PDF checklist. The client gets something useful, you get the information.\n\nThen a 14-day series of 7 messages. Each has a job to do: a real purchase story, a myth taken apart, a listing with a price, a client review, a piece of market insight. Not spam — content that helps someone decide.\n\nCode words are woven into the text. When a client writes one of them, the bot hands them to the manager with a full profile. Only people genuinely ready to talk reach you.'
      },
      {
        heading: 'What the business gets',
        body: 'The manager only ever talks to warm clients. The bot works around the clock and never forgets to send the next message.\n\nTarget metrics: 40% pass qualification, 15% are handed over as hot leads. The approach works for any business where the client thinks for more than a week before buying.'
      }
    ]
  },
  {
    slug: 'pet-festival-demo',
    title: 'A working demo instead of slides: the client touched it, the client bought',
    desc: 'Four working modules for a festival. No mockups, no "imagine a button here". Every button does something real.',
    tags: ['Web App', 'AI', 'Events'],
    related: ['festival-app-ai-calendar', 'photozone-generator'],
    sections: [
      {
        heading: 'Why slides do not sell',
        body: 'The organisers of a festival for 800-1200 guests wanted to bring in some technology. We could have shown a deck full of mockups — pretty screens, arrows, "AI goes here". But the client had already sat through a dozen decks like that from other contractors.\n\nThey wanted to touch it. Press a button and see what happens. Not "imagine", but "try it".'
      },
      {
        heading: 'Four modules, all of them working',
        body: 'AI assistant: the guest asks a question and gets an answer in real time. It knows the schedule, the venues, the rules. Letters appear one by one, like a live chat.\n\nRegistration with QR: fill in the form, get a QR code, show it at the entrance.\n\nKnowledge base for the crew: instructions, contacts, site plan. A Guest/Crew switch shows both sides.\n\nSegmented broadcasts with AI-generated copy.\n\nAll of it runs inside the demo. No placeholders, no "this part comes later".'
      },
      {
        heading: 'An approach worth stealing',
        body: 'The client decides based on real experience rather than promises. We confirmed it for ourselves: demo first, contract second converts better than any presentation.\n\nIf you sell something complex and clients hesitate, show them a working prototype. It costs more than slides and less than a lost client.'
      }
    ]
  },
  {
    slug: 'photozone-generator',
    title: 'Photo zone generator: from brand book to finished concept in 5 minutes',
    desc: 'Upload the brand book and get a written concept plus a visual. The designer refines the best option instead of generating them from scratch.',
    tags: ['AI', 'Image Generation', 'Events'],
    related: ['pet-festival-demo', 'wedding-chatbot'],
    sections: [
      {
        heading: 'The designer spends hours on options that get rejected',
        body: 'An event agency builds dozens of photo zones a year. Each concept costs the designer hours: reading the brand book, hunting for references, shaping the idea, sketching it. The client wants 3-5 options, and most of them get rejected.\n\nThe designer ends up generating options instead of perfecting the best one. Creative work turns into an assembly line.'
      },
      {
        heading: 'Brand book in, concept out',
        body: 'The manager uploads the brand book, the brief and photos of the venue. The AI reads all of it and produces a written concept: name, description, elements, colours, mood. In parallel it generates a visual.\n\nIn five minutes the manager has both the text for the client and an image for the deck. Not instead of the designer, but before the designer. The client picks a direction, the designer refines that specific option. Hours saved on both sides.'
      },
      {
        heading: 'Who this is for',
        body: 'For event agencies, decor and production studios. Not only photo zones — stands, set pieces, venue dressing. Anywhere you need to put several visual concepts in front of a client quickly, based on their brand book.'
      }
    ]
  },
  {
    slug: 'wedding-chatbot',
    title: 'A wedding chatbot: 225 guests stopped messaging the coordinator',
    desc: 'The bot knows the programme, the dress code, the transfers, the wishlist. It collects RSVPs. When it does not know, it hands over to a human.',
    tags: ['Chatbot', 'AI', 'WedTech'],
    related: ['festival-app-ai-calendar', 'photozone-generator'],
    sections: [
      {
        heading: '225 guests asking the same questions',
        body: 'A wedding in St Petersburg. 225 guests, 2 days, 3 venues. The coordinator answers the same things dozens of times over: "What time does it start?", "What is the dress code?", "Can we bring the kids?", "How do we get there?", "What should we give?".\n\nPaper invitations with the programme get lost. The coordinator spends hours a day on routine questions instead of actually organising. Meanwhile guests wait for answers and get anxious.'
      },
      {
        heading: 'The bot answers in seconds',
        body: 'The guest asks in plain language and gets an answer straight away. The bot knows everything: the programme day by day, the venues, the dress code, the transfers, the wishlist, the rules about children. It collects RSVPs right there in the chat: confirmation, number of guests, dietary requirements.\n\nIf the question is unusual, it gently hands over to the coordinator. It does not guess and it does not invent.\n\nThe couple manage the content through an admin panel: change a time, add a venue, update the menu. No developer needed, and no us.'
      },
      {
        heading: 'Not only for weddings',
        body: 'The coordinator organises rather than answering "what time does it start". Guests get their information instantly, at any hour.\n\nThe same model works for any private event: an anniversary, a corporate party, a graduation. Anywhere with many guests and one person responsible for communication.'
      }
    ]
  },
  {
    slug: 'brand-positioning-ai',
    title: 'A brand gap analysis in 10 minutes: what you say versus what clients hear',
    desc: 'Upload your brand book and the system gathers reviews, then shows where your positioning matches reality and where it does not.',
    tags: ['AI', 'Analytics', 'SaaS'],
    related: ['shelf-monitoring-ai', 'school-ai-platform'],
    sections: [
      {
        heading: 'The question worth millions that nobody asks',
        body: 'Does what your company says about itself match what clients actually think? If you position yourself as premium and the reviews say "cheap and quick", you have a problem. Or the reverse: clients praise your support and you never even mention it.\n\nTo find out, a brand strategist spends 3-5 days reading the brand book, gathering reviews and comparing them. At that price, most companies simply never ask the question.'
      },
      {
        heading: 'An answer in a minute instead of a week',
        body: 'Upload your brand book or your positioning documents. The system pulls out your values, your differentiators and your promises.\n\nIn parallel it collects up to 500 reviews from public sources. Then it shows you three things:\n\n— Critical gap: you promise it, clients do not see it.\n— Hidden strength: clients praise it, you never mention it.\n— Match: the two line up.\n\nA match index from 0 to 100%, plus an AI chat for follow-up questions about the results. The whole analysis takes under a minute.'
      },
      {
        heading: 'Who needs this right now',
        body: 'Marketers ahead of a rebrand, so they do not change what already works. Strategists, to put an objective picture in front of a client in a single meeting. Founders, to find out whether their vision of the brand matches reality.\n\nWhat used to cost a week of a strategist\'s time now costs ten minutes.'
      }
    ]
  },
  {
    slug: 'school-ai-platform',
    title: 'AI for schoolchildren: works without a VPN, data stays in Russia',
    desc: 'A platform for grades 4-11 with an AI chat and a website builder. The teacher controls access and sees the history.',
    tags: ['EdTech', 'AI', 'Web App'],
    related: ['brand-positioning-ai', 'event-agency-task-tracker'],
    sections: [
      {
        heading: 'Kids already use AI — through a VPN',
        body: 'ChatGPT is blocked in Russia. Claude and Gemini need a VPN and a foreign card. Schools cannot legally bring AI into lessons.\n\nMeanwhile every second high schooler already uses AI models: through a VPN, through friends, through workarounds. With no oversight, no methodology and no sense of the limits.\n\nSchools need a tool that works legally, keeps data in Russia and gives the teacher control.'
      },
      {
        heading: 'Two tools for learning',
        body: 'AI chat: an interface like ChatGPT, adapted for school students. The pupil asks questions, the AI helps them work through the topic. The teacher sees the history for the whole class and knows who is asking what and where the gaps are.\n\nWebsite builder: the child describes an idea in words and the AI generates a working web page. Preview right in the browser, downloadable. Learning by making: the child watches their description turn into code.\n\nThree roles: the pupil works within limits, the teacher manages access, the parent sees their child\'s activity.'
      },
      {
        heading: 'For schools and education platforms',
        body: 'Data is stored inside Russia. The teacher decides how many messages and generations are available per day. The school buys a subscription per class.\n\nIf you run an education platform or a school and want to give students legal access to AI, this is a ready solution that adapts to your curriculum.'
      }
    ]
  },
  {
    slug: 'ai-photo-bot',
    title: 'A bot that turns selfies into trending content. Our own product',
    desc: 'Pick a style, upload a photo, get the result a minute later. From wanting it to having it: 60 seconds.',
    tags: ['Telegram Bot', 'AI', 'B2C'],
    related: ['photozone-generator', 'voice-transcription-bot'],
    sections: [
      {
        heading: 'Why people pay for an Old Money photo',
        body: 'This is our own B2C product rather than a client project. A Telegram bot turns selfies into styled photos: Old Money, Bali Vibes, Tokio Girl, Dark Fashion.\n\nThe purchase trigger is simple: someone sees an example and wants to see themselves in that style. From wanting it to having it takes 60 seconds. No apps, no sign-ups, no waiting — all inside Telegram.'
      },
      {
        heading: 'How it works for the user',
        body: 'On launch you get examples of the best generations and 5 free attempts. A catalogue of styles, free and paid. Upload a selfie and a minute later you have a styled photo that still looks like you.\n\nIf the result disappoints, the generation is refunded automatically along with a bonus attempt. That matters: the user never feels they wasted their money.'
      },
      {
        heading: 'Economics that add up',
        body: 'Packs: 5 generations for 99₽, 15 for 399₽, 40 for 999₽. A subscription at 299₽/month with extended access.\n\nReferrals: bring a friend who pays and you both get a bonus. Reactivation: if a user disappears for 3 days, the bot credits +1 generation and invites them back.\n\nOne generation costs us about 12₽, giving a margin of 60-75%. We reused infrastructure from earlier projects, which halved the development time.'
      }
    ]
  },
  {
    slug: 'industrial-orders-bot',
    title: 'A bot for a manufacturer: a complete order first time',
    desc: 'The client goes through 7 steps in the bot and the manager receives the order with everything filled in. No follow-up questions, nothing lost.',
    tags: ['Telegram Bot', 'Manufacturing', 'Automation'],
    related: ['pharma-feedback-bot', 'real-estate-lead-bot'],
    sections: [
      {
        heading: 'The manager asks three times',
        body: 'A manufacturer of stainless steel equipment. Orders arrive by phone and through messengers. The client says: "I need a table." Which one? What dimensions? Which grade of steel? With edges or without?\n\nThe manager asks two or three more times. The client gets irritated. Some orders get lost in the stream of messages. If you make to order, you know this one.'
      },
      {
        heading: 'The bot asks the right questions',
        body: 'The client writes to the bot and goes through 7 steps: type of item, dimensions, grade of steel, extra options (frame, edges, legs, castors), deadline, comment, confirmation.\n\nEvery order is numbered and stored. The manager gets the full picture first time — no calls, no clarifications. The bot works around the clock, at weekends and on holidays.'
      },
      {
        heading: 'Scaling without a rewrite',
        body: 'The bot is only the interface. All the logic lives on a separate server behind an API. When WhatsApp, Viber or a web form is needed, you connect a new interface. Nothing gets rewritten from scratch.\n\nIt suits any manufacturer whose orders need several parameters: furniture, metalwork, printing, tailoring.'
      }
    ]
  },
  {
    slug: 'voice-transcription-bot',
    title: 'Transcription without the limit: recordings up to 2 GB',
    desc: 'Standard Telegram caps files at 20 MB, so an hour-long recording will not fit. We removed that ceiling.',
    tags: ['Telegram Bot', 'Whisper', 'Productivity'],
    related: ['meeting-transcriber', 'ai-photo-bot'],
    sections: [
      {
        heading: 'The recording does not fit in the bot',
        body: 'Telegram will not accept files over 20 megabytes. An hour-long meeting or podcast is 50-100 MB. Every existing transcription bot lives inside that limit. For a long recording you end up cutting the file into pieces, sending them separately and stitching the results back together.\n\nIf you transcribe long recordings regularly, you know how tedious that is.'
      },
      {
        heading: 'The ceiling is now 2 GB',
        body: 'We use the official Telegram Bot API Server — Telegram\'s own solution, which raises the limit to 2 GB. A hundred times the standard.\n\nSend a voice message, an audio file or a video note of any size and get text back. No splitting, no manual work.'
      },
      {
        heading: 'An internal tool that saves hours',
        body: 'The bot became an internal tool for us — we use it on other projects that need transcription. Instead of rebuilding that feature every time, we plug in the one we have.\n\nIf your team needs transcription without limits, we can deploy the same thing for you.'
      }
    ]
  },
  {
    slug: 'tour-operator-ai-manager',
    title: 'An AI manager in 7 languages: the tourist gets an answer in seconds, not hours',
    desc: 'The bot detects the language, asks one question at a time, gathers the enquiry and hands the manager a finished lead.',
    tags: ['Telegram Bot', 'AI', 'Travel'],
    related: ['real-estate-lead-bot', 'pharma-feedback-bot'],
    sections: [
      {
        heading: 'A tourist will not wait an hour',
        body: 'A tour operator running trips across Russia and Central Asia for foreign visitors. Clients write in Russian, English, Spanish, French, Arabic and Chinese. There is one manager.\n\nA tourist who does not hear back within an hour goes to a competitor. And one manager physically cannot answer in 7 languages around the clock. Every unanswered enquiry is a lost sale.'
      },
      {
        heading: 'The bot holds a conversation like a person',
        body: 'The bot detects the language automatically and replies in it. Not a form with fields, but an actual conversation: one question at a time. Where do you want to go? When? How many of you? A packaged tour or a custom one?\n\nOnce everything is gathered, the manager receives a complete lead card. Not a chat log, not a voice note — a structured enquiry. All that is left is to propose the right tour.'
      },
      {
        heading: 'Works for any business with an international audience',
        body: 'The bot answers 24/7 in 7 languages. The client feels like they are talking to a person. The manager only handles qualified enquiries.\n\nThe same approach works for hotels, tour desks, language schools and medical tourism — anywhere clients arrive from different countries.'
      }
    ]
  },
  {
    slug: 'event-agency-task-tracker',
    title: 'A task tracker the team did not sabotage. For once',
    desc: 'A team of 9 rejected Asana, Notion and Trello. We built a tool they use voluntarily.',
    tags: ['Web App', 'PWA', 'Productivity'],
    related: ['meeting-transcriber', 'school-ai-platform'],
    sections: [
      {
        heading: 'Three failures in a row — sound familiar?',
        body: 'An event agency, 9 people. Tasks lived in messengers and on calls. During tenders, parts of the work were simply forgotten. They tried Asana and dropped it. Notion, dropped it. Trello, dropped it.\n\nEvery time the same reaction: "management is watching us through an app". People sabotage a tool not because they are lazy but because it feels like surveillance. If your team has never stuck with a tracker either, the problem is not the people.'
      },
      {
        heading: 'One rule: assistant, not overseer',
        body: 'No counters for how many tasks you failed. No leaderboards. No red OVERDUE in your face.\n\n"You have 3 tasks today" instead of "You are required to complete 3 tasks". By default everyone sees only their own tasks. The interface is calm and does not push.\n\nThree views: a list, a calendar with drag and drop, and an Eisenhower matrix that shows in ten seconds what is urgent and what can wait. It works offline, so tasks do not vanish when the connection drops.'
      },
      {
        heading: 'Why this one stuck',
        body: 'The team uses it. Not because they have to, but because it is convenient. The design does not pressure anyone, the priority matrix genuinely helps, and offline mode saves the day at venues with no signal.\n\nIf your team sabotages task trackers, the problem may not be discipline. It may be that they need a tool that respects them.'
      }
    ]
  }
]

export default articles
