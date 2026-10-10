"""Download only the manually reviewed course/location and reuse-license bindings."""
import re,json,html,hashlib,urllib.request,concurrent.futures,gzip,math
from pathlib import Path
from PIL import Image,ImageOps,ImageDraw
ROOT=Path(__file__).resolve().parents[1]
D=ROOT/'docs/photo-expansion-124-20261009'
INPUTS=ROOT/'.photo-work-124'
INPUTS.mkdir(exist_ok=True)
NAMES={c['id']:c['name'] for c in json.loads((D/'pending-baseline.json').read_text())}
# Each caption identifies the photographed waypoint or landscape rather than claiming the entire route is pictured.
TOUR=[
('c249','2757831','우면산자연생태공원 수변 산책공간'),
('c363','125527','청계호수 수면과 주변 숲 전경'),
('c409','126324','중외공원 야외 공원 공간'),
('c423','2793017','추화산성 경유지 · 봉수대 주변'),
('c351','2614482','구룡소길 경유지 · 구룡소 해안 암석'),
('c353','2633900','연오랑세오녀길 경유지 · 귀비고 주변'),
('c355','126096','연인의길 시작 구간 · 진하해수욕장'),
('c389','1576464','감악산 정상 주변 전망 · 경유지 참고사진'),
('c413','2774430','동해시 대진 해수욕장 · 해변 전경'),
('duru_T_CRS_MNG0000001463','127394','축령산 편백숲 · 주변 숲 경관 참고사진'),
('duru_T_CRS_MNG0000003721','2758472','원수산 둘레길 출발 구간 · 습지생태원 보행 데크'),
('duru_T_CRS_MNG0000003094','3069902','배부른산 숲속 보행 계단 · 경유지 참고사진'),
('duru_T_CRS_MNG0000000023','2702539','매화마을 녹색길 숲길'),
('duru_T_CRS_MNG0000003656','2791454','실안 노을길 경유지 · 실안해안도로 보행로'),
('duru_T_CRS_MNG0000000663','129368','수만리길 경유지 · 수만리들국화마을 주변'),
('duru_T_CRS_MNG0000000664','2754463','화순산림길 주변 · 수만리생태숲공원 참고사진'),
('duru_T_CRS_MNG0000000665','128990','만연산 봄 풍경 · 주변 산 경관 참고사진'),
('c426','2743841','부처울습지길 종착 구간 · 당남리섬 유채꽃 계절 참고사진'),
('duru_T_CRS_MNG0000002276','2434847','비내길 관광공사 안내 사진 · 강변 구간 참고사진'),
('duru_T_CRS_MNG0000003667','2774008','푸른길 경유지 · 푸른길분수공원'),
]
COMMONS=[
('c293',58434821,'긴고랑길에서 바라본 계곡과 동네의 저녁 풍경'),
('c276',53201358,'메타세쿼이아길 보행로 주변 · 야간 벤치와 나무길'),
('c316',54168524,'도란도란 걷는 길 경유지 · 관악정 주변 숲속 시내'),
('duru_T_CRS_MNG0000005101',32668477,'동래읍성 장대길 경유지 · 장영실과학동산'),
('duru_T_CRS_MNG0000001198',116646496,'이청준 소설문학길 경유지 · 회진면 해안 풍경'),
('duru_T_CRS_MNG0000005441',199043674,'성남누비길 청계산 구간 · 전망 보행 공간'),
('duru_T_CRS_MNG0000001099',82359354,'오월인권길 경유지 · 옛 전남도청 외관'),
('duru_T_CRS_MNG0000005390',163465195,'명봉산진달래길 출발 구간 · 동화마을수목원 방문자센터'),
('duru_T_CRS_MNG0000005505',158419307,'경제신화 도보길 경유지 · 대구은행파크 외관'),
('duru_T_CRS_MNG0000005547',83107383,'경기 둘레길 가평 23코스 · 신청평대교 주변 도로 · 2015년 참고사진'),
('duru_T_CRS_MNG0000001076',194090350,'순창 마실길 3코스 경유지 · 장군목 인증센터'),
]
EVIDENCE=json.loads(gzip.decompress((D/'commons-evidence.json.gz').read_bytes()))
PAGES={p['pageid']:p for result in EVIDENCE.values() for p in result['pages']}
SOURCE_PAGES=json.loads(gzip.decompress((D/'source-pages.json.gz').read_bytes()))
raw=[]
for course,ident,caption in TOUR:
 pages=[value for key,value in SOURCE_PAGES.items() if key.endswith('/'+ident+'.html') or key==ident+'.html'];assert pages,ident
 page=pages[0];assert '본 저작물은 한국관광공사에서 작성하여 공공누리 제1유형' in page
 images=list(dict.fromkeys(re.findall(r'<img[^>]*src="(https://tong.visitkorea.or.kr/[^"]+)"[^>]*alt="([^"]*)"',page)))
 assert images,ident
 raw.append(dict(local=course,courses={course:NAMES[course]},place=caption,source=f'https://www.nculture.org/cul/localCultureDetail.do?targetId={ident}&contentType=G',original=images[0][0],author='한국관광공사',date='촬영일 미표기',license='공공누리 제1유형',licenseUrl='https://www.kogl.or.kr/info/licenseType1.do'))
def clean(v):return html.unescape(re.sub('<[^>]*>','',v)).strip()
for course,ident,caption in COMMONS:
 p=PAGES[ident];ii=p['imageinfo'][0];m=ii['extmetadata'];license=clean(m['LicenseShortName']['value']);assert license in ['CC BY 3.0','CC BY-SA 3.0','CC BY-SA 4.0','CC BY 4.0','CC0','Public domain'],license
 r=dict(local=course,courses={course:NAMES[course]},place=caption,source=ii['descriptionurl'],original=ii['url'],download=ii.get('thumburl',ii['url']),author=clean(m.get('Artist',{}).get('value','저자 미표기')),date=clean(m.get('DateTimeOriginal',{}).get('value','촬영일 미표기')),license=license,licenseUrl=clean(m['LicenseUrl']['value']),coordinates=p.get('coordinates'),title=p['title'])
 raw.append(r)
assert len({i for r in raw for i in r['courses']})==len(raw)
def download(r):
 f=INPUTS/(r['local']+'.jpg')
 if not f.exists():
  req=urllib.request.Request(r.get('download',r['original']),headers={'User-Agent':'FootstepPhotoAudit/1.0 (footstepbiz@gmail.com)'})
  f.write_bytes(urllib.request.urlopen(req,timeout=45).read())
 im=Image.open(f);im.load();assert im.width>=400 and im.height>=200
 return r
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:
 for r in ex.map(download,raw):print('Reviewed download',r['local'],flush=True)
(D/'reviewed-batch.json').write_text(json.dumps(raw,ensure_ascii=False,indent=2)+'\n')
# Visual contact sheets are scratch review outputs, not publication assets.
for start in range(0,len(raw),24):
 chunk=raw[start:start+24];sheet=Image.new('RGB',(1200,((len(chunk)+3)//4)*195),'white');draw=ImageDraw.Draw(sheet)
 for k,r in enumerate(chunk):
  im=ImageOps.exif_transpose(Image.open(INPUTS/(r['local']+'.jpg'))).convert('RGB');im.thumbnail((290,165));x=k%4*300;y=k//4*195;sheet.paste(im,(x,y));draw.text((x+4,y+168),r['local'].replace('duru_T_CRS_MNG000000','duru_'),fill='black')
 sheet.save(INPUTS/('review-'+str(start)+'.jpg'))
print('Prepared',len(raw),'verified location bindings')
