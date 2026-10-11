import csv, time, urllib.parse, urllib.request, sys, os
seeds=[l.rstrip('\n').split('\t') for l in open('seeds.tsv',encoding='utf-8') if l.strip()]
out=open('raw/bukvarix.tsv','w',encoding='utf-8')
out.write('seed\tphrase\tbroad\texact\n')
log=open('raw/bukvarix.log','w')
for seed,cl in seeds:
    url='http://api.bukvarix.com/v1/keywords/?q=%s&api_key=free&num=300&format=tsv&header=0&bom=0'%urllib.parse.quote(seed)
    for attempt in range(3):
        try:
            r=urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=60)
            body=r.read().decode('utf-8'); code=r.status; break
        except urllib.error.HTTPError as e:
            code=e.code; body=''
            if code==429: time.sleep(10); continue
            break
        except Exception as e:
            code=-1; body=''; time.sleep(3)
    n=0
    for line in body.splitlines():
        p=line.split('\t')
        if len(p)>=5:
            out.write('\t'.join([seed,p[0],p[3],p[4]])+'\n'); n+=1
    log.write(f'{seed}\t{code}\t{n}\n'); log.flush(); print(seed,code,n,flush=True)
    time.sleep(1.2)
