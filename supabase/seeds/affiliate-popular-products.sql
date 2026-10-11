-- Actual links issued in Coupang Partners on 2026-10-11.
-- Keep former links so historical click reports retain their product names.
insert into private.affiliate_links(link_id,product_id,title,url) values
 ('hLomp2aSSO','sweet-potato-snack','탐사 강아지 고구마말랭이 간식','https://link.coupang.com/a/hLomp2aSSO'),
 ('hLon6IPp9M','daily-pads','탐사 실속형 배변패드','https://link.coupang.com/a/hLon6IPp9M'),
 ('hLoo2HG96W','dog-shampoo','닥터블랭크 강아지 샴푸','https://link.coupang.com/a/hLoo2HG96W'),
 ('hLoo5AmPls','pet-cleaner','유한락스 반려동물 냄새얼룩 제거제','https://link.coupang.com/a/hLoo5AmPls'),
 ('hLote0yBW0','popular-waste-bags','탐사 반려동물 풉백 리필형 배변봉투','https://link.coupang.com/a/hLote0yBW0'),
 ('hLosen1eOy','pet-toothbrush','정글몬스터 덴티소프트 극세사모 칫솔 S','https://link.coupang.com/a/hLosen1eOy')
on conflict(link_id) do update set product_id=excluded.product_id,title=excluded.title,url=excluded.url;
