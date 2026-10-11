import json, time, urllib.parse, urllib.request, sys
SH=int(sys.argv[1]); N=int(sys.argv[2])
seeds=[l.rstrip('\n').split('\t') for l in open('seeds.tsv',encoding='utf-8') if l.strip()]
seeds=seeds[SH::N]
mods=['','цена','заказать','стоимость','под ключ','спб','санкт-петербург','москва','разработка','на заказ','для малого бизнеса','своими руками','как сделать','бесплатно','что это','примеры','курс','отзывы','компания','услуги']
def get(url):
    for a in range(3):
        try:
            return urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=20).read().decode('utf-8','replace')
        except Exception as e:
            time.sleep(2)
    return None
def ya(q):
    t=get('https://suggest.yandex.ru/suggest-ya.cgi?v=4&part=%s&uil=ru&lr=2&n=10'%urllib.parse.quote(q))
    try: return json.loads(t)[1]
    except: return None
def go(q):
    t=get('https://suggestqueries.google.com/complete/search?client=firefox&hl=ru&gl=ru&q=%s'%urllib.parse.quote(q))
    try: return json.loads(t)[1]
    except: return None
def bi(q):
    t=get('https://api.bing.com/osjson.aspx?query=%s&language=ru'%urllib.parse.quote(q))
    try: return json.loads(t)[1]
    except: return None
engines={'yandex':ya,'google':go,'bing':bi}
out=open('raw/suggest_%d.tsv'%SH,'w',encoding='utf-8'); out.write('engine\tquery\tsuggestion\n')
fails={k:0 for k in engines}; calls={k:0 for k in engines}
for seed,cl in seeds:
    for m in mods:
        q=(seed+' '+m).strip()
        for name,f in engines.items():
            r=f(q); calls[name]+=1
            if r is None: fails[name]+=1; continue
            for s in r:
                if isinstance(s,list): s=s[0]
                out.write(f'{name}\t{q}\t{s}\n')
            time.sleep(0.25)
        out.flush()
    print(seed,calls,fails,flush=True)
