-- Execute in BEGIN/ROLLBACK; fixtures never persist.
insert into auth.users(id,aud,role,email,email_confirmed_at,created_at,updated_at,raw_app_meta_data,raw_user_meta_data) values('7e141026-0000-4000-8000-000000000009','authenticated','authenticated','rollover-fixture@example.invalid',now(),now(),now(),'{}','{}');
update event_private.campaigns set opens_at=now()-interval '20 days',closes_at=now()-interval '9 days',announces_at=now()-interval '6 days' where id='2026-10';
insert into event_private.entries(campaign_id,user_id,ticket,consent_version) values('2026-10','7e141026-0000-4000-8000-000000000009','ROLLOVERFIXTURE01','2026-10-14-v1');
update event_private.entries set winner=true where ticket='ROLLOVERFIXTURE01';
do $$begin if event_private.rollover_unclaimed()<>0 then raise exception 'early_rollover';end if;end$$;
update event_private.campaigns set opens_at=now()-interval '20 days',closes_at=now()-interval '9 days',announces_at=now()-interval '8 days' where id='2026-10';
select set_config('request.jwt.claims','{"sub":"7e141026-0000-4000-8000-000000000009","role":"authenticated"}',true);
set local role authenticated;
do $$begin begin perform public.claim_member_event('2026-10');raise exception 'late_claim_accepted';exception when others then if sqlerrm<>'event_claim_closed' then raise;end if;end;end$$;
reset role;
do $$begin
 if event_private.rollover_unclaimed()<>1 then raise exception 'missing_rollover';end if;
 if event_private.rollover_unclaimed()<>0 then raise exception 'duplicate_rollover';end if;
 if (select winner_count from event_private.campaigns where id='2026-11')<>3 then raise exception 'next_month_quota';end if;
 if (select count(*) from event_private.prize_slots)<>3 then raise exception 'extra_budget_created';end if;
 if not exists(select 1 from event_private.entries where ticket='ROLLOVERFIXTURE01' and rolled_over_at is not null) then raise exception 'award_not_retired';end if;
end$$;
-- Contact received within the window protects the award even after the deadline.
insert into event_private.entries(campaign_id,user_id,ticket,consent_version) values('2026-11','7e141026-0000-4000-8000-000000000009','CONTACTFIXTURE001','2026-10-14-v1');
update event_private.entries set winner=true,claim_requested_at=now() where ticket='CONTACTFIXTURE001';
update event_private.campaigns set opens_at=now()-interval '20 days',closes_at=now()-interval '9 days',announces_at=now()-interval '8 days' where id='2026-11';
do $$begin if event_private.rollover_unclaimed()<>0 then raise exception 'contacted_prize_rolled';end if;end$$;
update event_private.entries set claim_requested_at=null where ticket='CONTACTFIXTURE001';
do $$begin
 if event_private.rollover_unclaimed()<>1 then raise exception 'conditional_month_missing';end if;
 if not exists(select 1 from event_private.campaigns where id='2026-12' and base_winner_count=0 and winner_count=1) then raise exception 'conditional_month_budget';end if;
 if (select count(*) from event_private.prize_slots)<>3 then raise exception 'extra_budget_created';end if;
end$$;


