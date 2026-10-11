import glob,re,collections
D={}  # phrase -> dict
def add(p,src,fr=None):
    p=re.sub(r'\s+',' ',p.strip().lower().replace('ё','е'))
    if not p or len(p)>90: return
    d=D.setdefault(p,{'src':set(),'fr':None}); d['src'].add(src)
    if fr and (d['fr'] is None or int(fr.split('/')[0])>int(d['fr'].split('/')[0])): d['fr']=fr
for f in ['raw/bukvarix.tsv','raw/bukvarix2.tsv','raw/bukvarix3.tsv']:
    for i,l in enumerate(open(f,encoding='utf-8')):
        if i==0: continue
        p=l.rstrip('\n').split('\t')
        if len(p)<4 or not p[2].isdigit() or not p[3].isdigit(): continue
        add(p[1],'bukvarix',f'{p[2]}/{p[3]}')
for f in glob.glob('raw/suggest_*.tsv')+['raw/suggest.tsv']:
    for i,l in enumerate(open(f,encoding='utf-8')):
        if i==0: continue
        p=l.rstrip('\n').split('\t')
        if len(p)<3: continue
        add(p[2],p[0]+'-suggest')
rules=[
('транскрибация и протоколы',r'транскриб|расшифров|протокол|аудио в текст|речь в текст|голос в текст|созвон|совещани'),
('документы и распознавание',r'документ|паспорт|распознаван|анкет|ocr|скан'),
('ритейл: выкладка и фотоотчёты',r'выкладк|мерчандайз|фотоотч|полк'),
('мероприятия и ивенты',r'мероприят|фестивал|свадьб|ивент|event|фотозон|фотобудк|конференц'),
('мини-аппы Telegram',r'мини ?-?апп|mini ?app|miniapp'),
('боты: разработка и заказ',r'(бот|бота|боты|ботов|чатбот).*(разработ|заказ|созда|под ключ|услуг|стоимост|цена|купить|сделать)|(разработ|заказ|созда|под ключ|услуг).*(бот|бота|боты|ботов)'),
('боты: общие',r'\bбот|чат-бот|чатбот|боты|ботов|ассистент|помощник|ии агент|ai agent'),
('автоматизация процессов и рутины',r'автоматизац|рутин|бизнес-?процесс|регламент|аудит'),
('ИИ и нейросети для бизнеса',r'\bии\b|нейросет|искусственн|\bai\b|gpt|внедрени'),
('веб-приложения, CRM, трекеры',r'crm|веб-?приложен|трекер|корпоративн|внутренн|приложени|портал|личный кабинет'),
('инструменты: n8n, make, no-code',r'n8n|make\.com|no-?code|zapier|low-?code|интеграц'),
('туризм/недвижимость/фарма/школа',r'туроператор|турагент|риелтор|риэлтор|брокер|недвижим|фарм|пациент|школ|онлайн-?школ|обучени'),
]
BIZ=r'бизнес|компани|предприят|клиент|заяв|продаж|малого|b2b|отдел|менеджер|сотрудник|crm|телеграм|telegram|тг |мини|n8n|сайт'
rows=[]
for p,d in D.items():
    cl=None
    for name,rx in rules:
        if re.search(rx,p): cl=name;break
    if cl is None: continue
    # отсев мусора: нужен контекст бизнеса/ИИ/ботов/автоматизации
    if not re.search(r'автоматиз|бот|\bии\b|нейросет|искусственн|транскриб|расшифр|распознав|crm|мини|mini|n8n|приложен|фотоотч|выкладк|фотозон|фотобудк|протокол|аудит|трекер',p): continue
    rows.append((p,d['fr'] or '','+'.join(sorted(d['src'])),cl))
def key(r):
    b=int(r[1].split('/')[0]) if r[1] else -1
    return (r[3],-b,r[0])
rows.sort(key=key)
with open('2026-10-11-core.tsv','w',encoding='utf-8') as o:
    o.write('фраза\tчастотность_широкая/точная_весь_мир\tисточник\tкластер\n')
    for r in rows: o.write('\t'.join(r)+'\n')
c=collections.Counter(r[3] for r in rows); print(len(D),'уникальных всего;',len(rows),'в core'); 
for k,v in c.most_common(): print(v,k)
print('с цифрами:',sum(1 for r in rows if r[1]),' bukvarix:',sum('bukvarix' in r[2] for r in rows),' yandex:',sum('yandex' in r[2] for r in rows),' google:',sum('google' in r[2] for r in rows),' bing:',sum('bing' in r[2] for r in rows))
