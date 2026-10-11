import time, urllib.parse, urllib.request
heads=["чат бот","разработка crm","внедрение ии","нейросеть бот телеграм","бот для записи клиентов","ии помощник для бизнеса","автоматизация процессов ии","создание чат бота"]
out=open('raw/bukvarix3.tsv','w',encoding='utf-8'); out.write('seed\tphrase\tbroad\texact\n')
for seed in heads:
    url='http://api.bukvarix.com/v1/keywords/?q=%s&api_key=free&num=1000&format=tsv&header=0&bom=0'%urllib.parse.quote(seed)
    for a in range(4):
        try:
            r=urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=90); body=r.read().decode('utf-8'); break
        except urllib.error.HTTPError as e:
            body=''; 
            if e.code==429: time.sleep(20); continue
            break
        except Exception: body=''; time.sleep(3)
    n=0
    for line in body.splitlines():
        p=line.split('\t')
        if len(p)>=5: out.write('\t'.join([seed,p[0],p[3],p[4]])+'\n'); n+=1
    out.flush(); print(seed,n,flush=True); time.sleep(4)
