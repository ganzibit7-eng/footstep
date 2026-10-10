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
        if url == 'https://www.suwon.go.kr/sw-www/sw-suwonpark/sw-suwonpark-05/sw-suwonpark-05-03/sw-suwonpark-05-03-01.jsp':
            data = fetch(url)
            body = clean(data.decode())
            names = ['광교호수공원', '서호공원', '만석공원']
            permitted = '반려견과 산책하기 좋은' in body and all(name in body for name in names)
            return {'url':url,'provider':'수원시 공원관리과','positive':permitted,'verifiedIds':['c387','c388','c402'],'conditions':['야외 산책로', '목줄 착용', '배설물 수거', '실내 시설·현장 통제 구역 제외'],'sourceSha256':hashlib.sha256(data).hexdigest()}
        if url == 'https://sjfmc.or.kr/sjpark/sub01_03_02.do':
            data = fetch(url)
            body = clean(data.decode())
            permitted = all(text in body for text in ['반려동물 목줄', '2m 이내 유지', '반려동물 배변처리'])
            return {'url':url,'provider':'세종시설관리공단','positive':permitted,'verifiedIds':['c365'],'conditions':['야외 호수공원 C코스 보행로', '목줄 2m 이내', '배변 처리', '맹견 입마개', '인식표', '입수·실내·어린이 시설 제외'],'sourceSha256':hashlib.sha256(data).hexdigest()}
        if 'korean.visitkorea.or.kr/' not in url:
            return {'url':url,'positive':False,'error':'Operator-specific permission review required'}
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
    review.append({'id':c['id'],'name':c['name'],'source':source(c),'positive':e['positive'] and ('verifiedIds' not in e or c['id'] in e['verifiedIds']),'pathSha256':hashlib.sha256(json.dumps(c['path'],separators=(',',':')).encode()).hexdigest(),'reason':e.get('error') or ('' if e['positive'] else 'Full-route permission requires scope review'),'conditions':e.get('conditions')})
(OUT/'review.json').write_text(json.dumps(review,ensure_ascii=False,indent=2)+'\n')
print('positive',sum(x['positive'] for x in review),'needs scope review',[(x['id'],x['name']) for x in review if not x['positive']],flush=True)
