"""Collect official public route coordinates and photo-source pages for review."""
import concurrent.futures
import hashlib
import json
import math
from pathlib import Path
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent
ROOT.mkdir(exist_ok=True)

def meters(a, b):
    r = math.pi / 180
    return math.hypot((b[0]-a[0])*r, (b[1]-a[1])*r*math.cos((a[0]+b[0])*r/2))*6371000

def collect(c):
    ident = c['crs_idx']
    url = 'https://www.durunubi.kr/download?' + urllib.parse.urlencode({
        'filePath': c['gpx_src'], 'downloadName': c['crs_Kor_Nm']+'.gpx', 'course_id': ident})
    try:
        raw = urllib.request.urlopen(url, timeout=25).read()
        doc = ET.fromstring(raw)
        parts = []
        for part in doc.iter():
            if part.tag.split('}')[-1] in ('trkseg', 'rte'):
                p = [[float(v.attrib['lat']), float(v.attrib['lon'])] for v in part
                     if v.tag.split('}')[-1] in ('trkpt', 'rtept')]
                if p: parts.append(p)
        assert len(parts) == 1, 'not one connected segment'
        path = parts[0]
        assert len(path) >= 10
        assert all(33 <= a <= 39.5 and 124 <= b <= 132 for a, b in path)
        gaps = [meters(a,b) for a,b in zip(path,path[1:])]
        length = sum(gaps)
        assert max(gaps) <= 220, 'coordinate discontinuity'
        assert .7 <= length/(float(c['crs_Dstnc'])*1000) <= 1.3, 'distance disagreement'
        assert meters(path[0],[float(c['startLat']),float(c['startLon'])]) <= 220
        assert meters(path[-1],[float(c['endLat']),float(c['endLon'])]) <= 220
        (ROOT/(ident+'.gpx')).write_bytes(raw)
        return dict(id='duru_'+ident, facts={k:c[k] for k in ('crs_idx','crs_Kor_Nm','sigun','crs_Dstnc','crs_Totl_Rqrm_Hour','level','cycle','gpx_src','startLat','startLon','endLat','endLon')},
                    path=path, meters=length, maxJump=max(gaps), gpxUrl=url,
                    sha256=hashlib.sha256(raw).hexdigest(), checkedDate='2026-10-09',petStatus='needs_confirmation')
    except Exception as exc:
        return dict(id='duru_'+ident,error=str(exc))

if __name__ == '__main__':
    candidates = json.loads((ROOT/'source-facts.json').read_text())
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex:
        evidence = list(ex.map(collect, candidates))
    (ROOT/'candidates.json').write_text(json.dumps(evidence,ensure_ascii=False,indent=2)+'\n')
    print([(x['id'],x.get('error',round(x['meters']) if 'meters' in x else '')) for x in evidence],flush=True)
