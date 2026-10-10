"""Locate licensed Commons photographs near original route coordinates; candidates require visual review."""
import os
import urllib.request,urllib.parse,json,gzip,pathlib,concurrent.futures,html,re,math
ROOT=pathlib.Path(__file__).resolve().parent.parent;OUT=ROOT/os.environ.get('PHOTO_REVIEW_DIR','docs/expansion-20261010');OUT.mkdir(exist_ok=True)
courses=json.load(open(os.environ.get('PHOTO_COURSES',str(OUT/'courses.json'))))
def meters(a,b):
 r=math.pi/180;return math.hypot((b[0]-a[0])*r,(b[1]-a[1])*r*math.cos((a[0]+b[0])*r/2))*6371000
def clean(s):return html.unescape(re.sub('<[^>]*>',' ',str(s or ''))).strip()
def query(c):
 results=[]
 for point in [c['path'][int((len(c['path'])-1)*i/6)] for i in range(7)]:
  p={'action':'query','generator':'geosearch','ggscoord':str(point[0])+'|'+str(point[1]),'ggsradius':'300','ggsnamespace':'6','ggslimit':'15','prop':'imageinfo|coordinates','coprimary':'all','iiprop':'url|extmetadata','iiurlwidth':'900','format':'json'}
  try:
   u='https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode(p)
   req=urllib.request.Request(u,headers={'User-Agent':'FootstepPhotoAudit/1.0 (footstepbiz@gmail.com)'})
   result=json.load(urllib.request.urlopen(req,timeout=20))
   for page in result.get('query',{}).get('pages',{}).values():
    ii=page.get('imageinfo',[{}])[0];m=ii.get('extmetadata',{});license=clean(m.get('LicenseShortName',{}).get('value'))
    if license not in ['CC BY-SA 4.0','CC BY-SA 3.0','CC BY-SA 2.0','CC BY 4.0','CC BY 3.0','CC BY 2.0','CC0','Public domain']:continue
    if not re.search(r'\.(jpg|jpeg|png)$',urllib.parse.urlsplit(ii.get('url','')).path,re.I):continue
    if re.search('portrait|selfie|wedding|demonstration|protest|march|election',page['title'],re.I):continue
    coords=page.get('coordinates',[])
    if not coords and m.get('GPSLatitude') and m.get('GPSLongitude'):
     coords=[{'lat':float(m['GPSLatitude']['value']),'lon':float(m['GPSLongitude']['value'])}]
    if not coords:continue
    q=coords[0];distance=min(meters([q['lat'],q['lon']],v) for v in c['path'])
    if distance>150:continue
    results.append({'course':c['id'],'name':c['name'],'distance':distance,'page':page})
  except Exception as e:results.append({'course':c['id'],'error':str(e)})
 return results
result=[]
with concurrent.futures.ThreadPoolExecutor(8) as pool:
 for i,items in enumerate(pool.map(query,courses),1):
  result.extend(items)
  if i%30==0:
   with gzip.open(OUT/'photo-candidates.json.gz','wt') as f:json.dump(result,f,ensure_ascii=False)
   print('photo routes checked',i,'matches',sum('page' in x for x in result),flush=True)
with gzip.open(OUT/'photo-candidates.json.gz','wt') as f:json.dump(result,f,ensure_ascii=False)
print('photo research finished',len(courses),flush=True)
