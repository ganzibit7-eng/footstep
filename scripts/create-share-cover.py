from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
root=Path(__file__).resolve().parent.parent
im=Image.new('RGB',(1200,630),'#f8f5ec');d=ImageDraw.Draw(im)
def font(size,bold=False): return ImageFont.truetype('C:/Windows/Fonts/malgunbd.ttf' if bold else 'C:/Windows/Fonts/malgun.ttf',size)
d.rounded_rectangle((814,-80,1290,710),radius=220,fill='#e1e8db')
d.text((76,62),'발자국',font=font(31,True),fill='#244b3b')
d.line((76,120,720,120),fill='#d6dcce',width=2)
d.text((72,171),'오늘은 어디로',font=font(63,True),fill='#213f32')
d.text((72,259),'함께 걸을까요?',font=font(63,True),fill='#213f32')
d.text((77,377),'강아지 산책길 · 애견동반 장소',font=font(28),fill='#53655a')
d.text((77,530),'balzaguk.com',font=font(24,True),fill='#53655a')
logo=Image.open(root/'icon-512.png').convert('RGBA');logo.thumbnail((310,310))
im.paste(logo,(843,167),logo)
(root/'assets').mkdir(exist_ok=True)
im.save(root/'assets/share-cover-20261017.jpg',quality=94,optimize=True)
