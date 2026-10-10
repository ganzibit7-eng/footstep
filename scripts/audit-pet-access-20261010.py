"""Recheck public operator pet permissions separately from route geometry."""
import json, pathlib, urllib.request, urllib.parse, re, html, concurrent.futures, hashlib, gzip
ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'docs/pet-access-audit-20261010'
OUT.mkdir(exist_ok=True)
def clean(s):
    return re.sub(r'\s+', ' ', html.unescape(re.sub('<[^>]*>', ' ', str(s or '')))).strip()
def fetch(url, params=None):
    req = urllib.request.Request(url, data=urllib.parse.urlencode(params).encode() if params else None, headers={'User-Agent':'Mozilla/5.0'})
    return urllib.request.urlopen(req, timeout=25).read()
courses = json.load(open('/tmp/audit-courses.json')) if pathlib.Path('/tmp/audit-courses.json').exists() else json.load(gzip.open(OUT/'before-courses.json.gz'))
def source(c):
    return re.search(r'공식안내:\s*(https://\S+)', c['description'])[1]
urls = sorted({source(c) for c in courses})
def check(url):
    try:
        if 'gil.seoul.go.kr/' in url:
            data = fetch(url)
            body = clean(data.decode())
            snippets = [body[max(0,m.start()-45):m.end()+150] for m in re.finditer('반려견|반려동물|애완',body)]
            permitted = bool(re.search(r'반려견\s*출입\s*가능', body))
            return {'url':url,'provider':'서울시','positive':permitted,'conditions':snippets,'sourceSha256':hashlib.sha256(data).hexdigest()}
        cotid = re.search(r'cotid=([a-f0-9-]+)',url,re.I)[1]
        endpoint = 'https://korean.visitkorea.or.kr/call'
        pet = json.loads(fetch(endpoint,{'cmd':'FETCH_CONTENT_DETAIL_INFO','cotId':cotid,'fieldType':'10'}))
        detail = json.loads(fetch(endpoint,{'cmd':'TOUR_CONTENT_BODY_DETAIL','cotId':cotid,'locationx':'','locationy':'','stampId':''}))['body']['detail']
        conditions = {x['DISPLAY_TITLE']:clean(x['CONTENT_BODY']) for x in pet['body']['details']}
        positive = detail['contentStatus']==2 and conditions.get('동반구분')=='전구역 동반가능' and bool(conditions.get('동반가능동물')) and '동반 불가' not in conditions.get('동반가능동물','')
        return {'url':url,'provider':'한국관광공사','positive':positive,'conditions':conditions,'title':detail['title'],'publicStatus':detail['contentStatus'],'address':clean((detail.get('addr1') or '')+' '+(detail.get('addr2') or '')),'coordinates':[detail.get('mapY'),detail.get('mapX')]}
    except Exception as e:
        return {'url':url,'positive':False,'error':str(e)}
with concurrent.futures.ThreadPoolExecutor(8) as pool:
    evidence=[]
    for i,result in enumerate(pool.map(check,urls)):
        evidence.append(result)
        if (i+1)%10==0:print('checked',i+1,'/',len(urls),flush=True)
with gzip.open(OUT/'source-evidence.json.gz','wt') as f:json.dump(evidence,f,ensure_ascii=False)
byurl={e['url']:e for e in evidence}
review=[]
for c in courses:
    e=byurl[source(c)]
    review.append({'id':c['id'],'name':c['name'],'source':source(c),'positive':e['positive'],'pathSha256':hashlib.sha256(json.dumps(c['path'],separators=(',',':')).encode()).hexdigest(),'reason':e.get('error') or ('' if e['positive'] else 'Full-route permission requires scope review'),'conditions':e.get('conditions')})
(OUT/'review.json').write_text(json.dumps(review,ensure_ascii=False,indent=2)+'\n')
print('positive',sum(x['positive'] for x in review),'needs scope review',[(x['id'],x['name']) for x in review if not x['positive']],flush=True)
