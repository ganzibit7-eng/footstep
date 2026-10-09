-- All fixtures roll back; this never navigates to Coupang or deletes a real account.
begin;
insert into auth.users(id,aud,role,email) values('f0000000-0000-4000-8000-000000000010','authenticated','authenticated','affiliate-test@example.invalid');
insert into public.profiles(owner_id,nickname) values('f0000000-0000-4000-8000-000000000010','클릭 집계 테스트') on conflict(owner_id) do update set nickname=excluded.nickname;
set local role anon;
select set_config('request.jwt.claims','{"role":"anon"}',true);
select set_config('request.headers','{"user-agent":"Mozilla/5.0 Chrome/140.0"}',true);
do $$declare payload jsonb:=jsonb_build_object('event_id','f1000000-0000-4000-8000-000000000001','visitor_id','v1791500000000afftest1','product_id','waste-bags','url','https://link.coupang.com/a/hHjJ8nlsJg','path','/','section','home','placement','home-walk-shopping','source','직접 방문 / 출처 미상');r jsonb;
begin
 r:=public.record_affiliate_click(payload);assert r->>'recorded'='true';
 r:=public.record_affiliate_click(payload);assert r->>'duplicate'='true';
 r:=public.record_affiliate_click(payload||'{"event_id":"f1000000-0000-4000-8000-000000000002","actor_id":"f5cbbb53-cdc8-4c05-8772-1309271b0681"}'::jsonb);assert r->>'recorded'='true';
 begin perform public.record_affiliate_click(payload||'{"url":"https://evil.test/a/x"}'::jsonb);raise exception 'invalid_link_accepted';exception when raise_exception then if sqlerrm<>'unknown_affiliate_link' then raise;end if;end;
 begin perform public.admin_affiliate_summary();raise exception 'anon_summary_accepted';exception when insufficient_privilege then null;end;
end $$;
reset role;
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"f0000000-0000-4000-8000-000000000010","role":"authenticated"}',true);
do $$declare payload jsonb:=jsonb_build_object('event_id','f1000000-0000-4000-8000-000000000003','visitor_id','v1791500000000afftest2','product_id','water-bottle','url','https://link.coupang.com/a/hHjPJ6DMUS','path','/','section','home','placement','home-walk-shopping','source','utm:threads');r jsonb;
begin
 r:=public.record_affiliate_click(payload);assert r->>'recorded'='true';
 r:=public.record_affiliate_click(payload||'{"event_id":"f1000000-0000-4000-8000-000000000004","visitor_id":"v1791500000000afftest3"}'::jsonb);assert r->>'recorded'='true';
 begin perform public.admin_affiliate_summary();raise exception 'member_summary_accepted';exception when insufficient_privilege then null;end;
 begin perform count(*) from private.affiliate_clicks;if found then
  assert (select count(*) from private.affiliate_clicks)=0;
 end if;end;
 begin insert into private.affiliate_clicks(event_id,link_id,visitor_id,path,section,placement,source,browser,device,client_kind)values(gen_random_uuid(),'hHjJ8nlsJg','v1791500000000afftest1','/','home','home-walk-shopping','fake','fake','fake','browser');raise exception 'direct_insert_accepted';exception when insufficient_privilege then null;end;
end $$;
select set_config('request.jwt.claims','{"role":"anon"}',true);
select set_config('request.headers','{"user-agent":"Playwright headless"}',true);
select public.record_affiliate_click('{"event_id":"f1000000-0000-4000-8000-000000000005","visitor_id":"v1791500000000afftest4","product_id":"harness-leash","url":"https://link.coupang.com/a/hHjVHyyABU","path":"/","section":"home","placement":"home-walk-shopping"}');
select set_config('request.jwt.claims','{"sub":"f5cbbb53-cdc8-4c05-8772-1309271b0681","role":"authenticated"}',true);
do $$declare r jsonb;
begin
 r:=public.admin_affiliate_summary();
 assert (r->>'clicks')::int=4;assert (r->>'visitors')::int=3;
 assert (r->>'members')::int=1;assert (r->>'people_total')::int=2;
 assert (r->>'excluded_clicks')::int=1;
 assert (select count(*) from private.affiliate_clicks where event_id='f1000000-0000-4000-8000-000000000002' and actor_id is null)=1;
 r:=public.admin_affiliate_summary(p_link=>'hHjPJ6DMUS',p_audience=>'member');assert (r->>'clicks')::int=2;assert (r->>'people_total')::int=1;
 r:=public.admin_affiliate_summary(p_event_page=>2);assert jsonb_array_length(r->'events')=0;
 r:=public.admin_affiliate_summary(p_include_excluded=>true);assert (r->>'clicks')::int=5;
end $$;
reset role;
-- One event just before KST midnight must belong to yesterday.
update private.affiliate_clicks set created_at=(((now() at time zone 'Asia/Seoul')::date)::timestamp at time zone 'Asia/Seoul')-interval '1 second'
 where event_id='f1000000-0000-4000-8000-000000000002';
set local role authenticated;
do $$declare r jsonb;begin r:=public.admin_affiliate_summary();assert (r->>'clicks')::int=3;end $$;
reset role;
-- Account removal cascades only this disposable transaction fixture.
delete from auth.users where id='f0000000-0000-4000-8000-000000000010';
do $$begin assert (select count(*) from private.affiliate_clicks where actor_id='f0000000-0000-4000-8000-000000000010')=0;end $$;
rollback;
