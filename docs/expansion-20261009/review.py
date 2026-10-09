import json
import gzip
import math
from pathlib import Path
import numpy as np
from scipy.spatial import cKDTree

ROOT = Path(__file__).resolve().parent
old = json.loads(gzip.open(ROOT/'baseline-routes.json.gz','rt',encoding='utf-8').read())
candidates = json.loads((ROOT/'candidates.json').read_text())
def xy(p):
    return np.array([[a*111195,b*111195*math.cos(math.radians(36.5))] for a,b in p])
def sample(p):
    out=[p[0]];prev=xy([p[0]])[0]
    for v,t in zip(p[1:],xy(p[1:])):
        if np.linalg.norm(t-prev)>=50:out.append(v);prev=t
    return xy(out)
index = [(c['id'],c['name'],sample(c['path']),cKDTree(xy(c['path']))) for c in old if len(c.get('path') or [])>=2]
accepted=[];decisions=[]
for e in candidates:
    if 'error' in e:
        decisions.append(dict(id=e['id'],decision='hold',reason=e['error'] or 'endpoint mismatch'));continue
    p=e['path'];q=sample(p);tree=cKDTree(xy(p));matches=[]
    for id,name,points,t in index:
        a=float(np.mean(t.query(q)[0]<=60));b=float(np.mean(tree.query(points)[0]<=60))
        if max(a,b)>.30:matches.append(dict(id=id,name=name,newOverlap=a,existingOverlap=b))
    if matches:
        decisions.append(dict(id=e['id'],decision='hold_overlap',matches=matches));continue
    accepted.append(e);index.append((e['id'],e['facts']['crs_Kor_Nm'],q,tree));decisions.append(dict(id=e['id'],decision='accept'))
(ROOT/'accepted.json').write_text(json.dumps(accepted,ensure_ascii=False,indent=2)+'\n')
(ROOT/'decisions.json').write_text(json.dumps(decisions,ensure_ascii=False,indent=2)+'\n')
print([(e['id'],e['facts']['crs_Kor_Nm']) for e in accepted])
print('Accepted',len(accepted),'of',len(candidates))
