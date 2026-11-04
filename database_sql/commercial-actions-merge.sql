-- Pure merge: repeated/stale visit heartbeats cannot duplicate commercial clicks.
CREATE OR REPLACE FUNCTION private.commercial_actions(previous jsonb,incoming jsonb,p_day date) RETURNS jsonb
LANGUAGE plpgsql IMMUTABLE SECURITY INVOKER SET search_path='' AS $$
DECLARE a integer:=least(1000,greatest(0,coalesce((incoming->>'ad_banner')::int,0)));
 t integer:=least(1000,greatest(0,coalesce((incoming->>'trip')::int,0)));
 pa integer:=coalesce((previous->>'ad_banner')::int,0);
 pt integer:=coalesce((previous->>'trip')::int,0);
 day_key text:=to_char(p_day::timestamp,'YYYY-MM-DD');
 daily jsonb:=coalesce(previous->'commercial_daily','{}'::jsonb);
BEGIN
 IF a>pa OR t>pt THEN
  daily:=jsonb_set(daily,ARRAY[day_key],jsonb_build_object(
   'ad_banner',coalesce((daily->day_key->>'ad_banner')::int,0)+greatest(a-pa,0),
   'trip',coalesce((daily->day_key->>'trip')::int,0)+greatest(t-pt,0)));
 END IF;
 RETURN incoming||jsonb_build_object('ad_banner',greatest(a,pa),'trip',greatest(t,pt))
 ||CASE WHEN daily<>'{}'::jsonb THEN jsonb_build_object('commercial_daily',daily) ELSE '{}'::jsonb END;
END $$;
REVOKE ALL ON FUNCTION private.commercial_actions(jsonb,jsonb,date) FROM PUBLIC,anon,authenticated;

