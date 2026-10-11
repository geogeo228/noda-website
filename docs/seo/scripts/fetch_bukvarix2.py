import time, urllib.parse, urllib.request
heads="""автоматизация бизнеса
автоматизация бизнес процессов
автоматизация документооборота
автоматизация рутины
ии для бизнеса
искусственный интеллект бизнес
нейросеть для бизнеса
ии ассистент
ии агент
ии бот
чат бот
чат бот для бизнеса
телеграм бот
телеграм бот заказать
разработка телеграм бота
разработка ботов
бот для заявок
бот для опроса
мини апп телеграм
telegram mini app
веб приложение разработка
разработка crm
транскрибация
расшифровка аудио
распознавание документов
распознавание паспорта
фотоотчет мерчандайзера
проверка выкладки
приложение для мероприятия
чат бот для мероприятия
аудит бизнес процессов
n8n
внедрение ии
ии для малого бизнеса
telegram бот для бизнеса
менеджер задач для команды
генерация фото нейросеть бот
ии фотобудка""".split('\n')
out=open('raw/bukvarix2.tsv','w',encoding='utf-8'); out.write('seed\tphrase\tbroad\texact\n')
log=open('raw/bukvarix2.log','w')
for seed in heads:
    url='http://api.bukvarix.com/v1/keywords/?q=%s&api_key=free&num=1000&format=tsv&header=0&bom=0'%urllib.parse.quote(seed)
    code=-1;body=''
    for a in range(3):
        try:
            r=urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=90); body=r.read().decode('utf-8'); code=r.status; break
        except urllib.error.HTTPError as e:
            code=e.code
            if code==429: time.sleep(10); continue
            break
        except Exception: time.sleep(3)
    n=0
    for line in body.splitlines():
        p=line.split('\t')
        if len(p)>=5: out.write('\t'.join([seed,p[0],p[3],p[4]])+'\n'); n+=1
    out.flush(); log.write(f'{seed}\t{code}\t{n}\n'); log.flush(); print(seed,code,n,flush=True); time.sleep(1.5)
