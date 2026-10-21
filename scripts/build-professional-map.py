"""Build lazy map index; only explicitly unmasked official source positions are used."""
import argparse,json,pathlib,sys,hashlib,collections
p=argparse.ArgumentParser();p.add_argument('--source-dir',required=True);p.add_argument('--library-dir');a=p.parse_args()
if a.library_dir:sys.path.insert(0,a.library_dir)
from pyproj import Transformer
root=pathlib.Path(__file__).resolve().parents[1];source=pathlib.Path(a.source_dir)/'professional-map-public-input.json';data=json.loads(source.read_text(encoding='utf-8'));t=Transformer.from_crs(5174,4326,always_xy=True);rows=[];reasons=collections.Counter()
for r in data['rows']:
 lat=lng=None;kind=r['positionSourceKind']
 if r['point']:
  x,y=t.transform(*r['point'])
  if 33<=y<=39 and 124<=x<=132:lat,lng=round(y,6),round(x,6)
  else:reasons['out-of-range-source-coordinate']+=1
 else:reasons['missing-or-masked-source-coordinate']+=1
 rows.append([r['id'],r['name'],lat,lng,r['kinds'],r['region'],kind if lat is not None else None,r['address']])
manifest=json.loads((root/'data/pet-care/manifest.json').read_text(encoding='utf-8'));mapped=sum(r[2]is not None for r in rows)
result={'version':1,'checked':data['checked'],'built':'2026-10-21','total':len(rows),'mapped':mapped,'unmapped':len(rows)-mapped,'fields':['id','name','lat','lng','kinds','region','positionSourceKind','address'],'kinds':manifest['kinds'],'rows':rows,'positionNote':'공개 주소의 공공 좌표만 사용'}
result['positionNote']='공개 주소에 대응하는 공공 등록 좌표입니다. 출입구·실시간 영업·진료 대상은 확인되지 않았습니다.'
dest=root/'data/pet-care/map-index.json';blob=json.dumps(result,ensure_ascii=False,separators=(',',':')).encode('utf-8');dest.write_bytes(blob)
doc=root/'docs/professional-map-20261021';doc.mkdir(exist_ok=True);summary={k:v for k,v in result.items() if k not in ['rows','kinds']};summary.update({'sha256':hashlib.sha256(blob).hexdigest(),'bytes':len(blob),'sourceInputSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'projection':'EPSG:5174 → EPSG:4326 (pyproj, always_xy)','rejected':dict(reasons),'privacy':'Only coordinates attached to an explicitly unmasked official source address are used. Grooming, boarding and transport masked coordinates are never used or reconstructed. Unlocated records stay connected through clearly labelled regional directory links.','kindCounts':[{'kind':k['id'],'total':sum(i in r[4]for r in rows),'mapped':sum(i in r[4]and r[2]is not None for r in rows)}for i,k in enumerate(manifest['kinds'])]});(doc/'summary.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps({k:summary[k]for k in ['total','mapped','unmapped','bytes','kindCounts']},ensure_ascii=False))


# Reapply separately verified public business/building positions after baseline regeneration.
if (root/'data/pet-care/verified-locations.json').exists():
 import subprocess
 subprocess.run(['node',str(root/'scripts/apply-professional-locations.mjs')],cwd=root,check=True)
