BEGIN;
CREATE TABLE private.course_route_drafts (
 course_id text NOT NULL, revision integer NOT NULL CHECK(revision>0),
 course_name text NOT NULL, payload jsonb NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(), created_by uuid NOT NULL,
 PRIMARY KEY(course_id,revision)
);
ALTER TABLE private.course_route_drafts ENABLE ROW LEVEL SECURITY;
CREATE POLICY route_drafts_rpc_only ON private.course_route_drafts AS RESTRICTIVE FOR ALL TO public USING(false) WITH CHECK(false);
REVOKE ALL ON private.course_route_drafts FROM PUBLIC,anon,authenticated;
CREATE FUNCTION private.admin_route_draft(p_course text,p_revision integer DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE result jsonb;
BEGIN
 IF auth.uid() IS NULL OR NOT coalesce(public.is_admin(auth.uid()::text),false) THEN RAISE EXCEPTION 'admin_only' USING ERRCODE='42501'; END IF;
 IF length(p_course)>100 THEN RAISE EXCEPTION 'invalid_course'; END IF;
 SELECT jsonb_build_object('course_id',c.id,'name',c.name,'latest_revision',coalesce((SELECT max(d.revision) FROM private.course_route_drafts d WHERE d.course_id=c.id),0),
 'draft',(SELECT jsonb_build_object('revision',d.revision,'payload',d.payload,'created_at',d.created_at,'course_name',d.course_name) FROM private.course_route_drafts d WHERE d.course_id=c.id AND (p_revision IS NULL OR d.revision=p_revision) ORDER BY d.revision DESC LIMIT 1),
 'history',coalesce((SELECT jsonb_agg(jsonb_build_object('revision',h.revision,'created_at',h.created_at,'course_name',h.course_name,'note',h.payload->>'note') ORDER BY h.revision DESC) FROM (SELECT * FROM private.course_route_drafts d WHERE d.course_id=c.id ORDER BY d.revision DESC LIMIT 50)h),'[]'::jsonb)) INTO result FROM public.courses c WHERE c.id=p_course AND c.status='approved';
 IF result IS NULL THEN RAISE EXCEPTION 'course_not_public'; END IF;RETURN result;
END $$;
CREATE FUNCTION private.admin_route_draft_save(p_course text,p_expected integer,p_payload jsonb) RETURNS integer
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE latest integer; item jsonb; point jsonb; count_points integer:=0; title text; clean jsonb; checked date;
BEGIN
 IF auth.uid() IS NULL OR NOT coalesce(public.is_admin(auth.uid()::text),false) OR NOT private.account_can_write() THEN RAISE EXCEPTION 'admin_only' USING ERRCODE='42501'; END IF;
 IF p_course IS NULL OR length(p_course)>100 OR p_expected IS NULL OR p_expected<0 OR jsonb_typeof(p_payload) IS DISTINCT FROM 'object' OR octet_length(p_payload::text)>600000 THEN RAISE EXCEPTION 'invalid_payload'; END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended('course-route-draft:'||p_course,0));
 SELECT name INTO title FROM public.courses WHERE id=p_course AND status='approved' FOR KEY SHARE;
 IF title IS NULL THEN RAISE EXCEPTION 'course_not_public'; END IF;
 SELECT coalesce(max(revision),0) INTO latest FROM private.course_route_drafts WHERE course_id=p_course;
 IF latest<>p_expected THEN RAISE EXCEPTION 'revision_conflict' USING ERRCODE='40001'; END IF;
 IF latest>=250 THEN RAISE EXCEPTION 'revision_limit'; END IF;
 IF jsonb_typeof(p_payload->'parts') IS DISTINCT FROM 'array' OR jsonb_array_length(p_payload->'parts') NOT BETWEEN 1 AND 50 THEN RAISE EXCEPTION 'invalid_geometry'; END IF;
 FOR item IN SELECT value FROM jsonb_array_elements(p_payload->'parts') LOOP
  IF jsonb_typeof(item) IS DISTINCT FROM 'array' OR jsonb_array_length(item)<2 THEN RAISE EXCEPTION 'invalid_geometry'; END IF;
  FOR point IN SELECT value FROM jsonb_array_elements(item) LOOP
   count_points:=count_points+1;
   IF count_points>10000 OR jsonb_typeof(point) IS DISTINCT FROM 'array' OR jsonb_array_length(point)<>2 THEN RAISE EXCEPTION 'invalid_geometry'; END IF;
   IF jsonb_typeof(point->0)<>'number' OR jsonb_typeof(point->1)<>'number' THEN RAISE EXCEPTION 'invalid_geometry'; END IF;
   IF (point->>0)::numeric NOT BETWEEN 32 AND 40 OR (point->>1)::numeric NOT BETWEEN 123 AND 133 THEN RAISE EXCEPTION 'invalid_geometry'; END IF;
  END LOOP;
 END LOOP;
 IF length(coalesce(p_payload->>'source_url','')) NOT BETWEEN 9 AND 1500 OR p_payload->>'source_url' !~ '^https://[^/@[:space:]]+([/?#]|$)' OR length(coalesce(p_payload->>'license_url',''))>1500 OR (coalesce(p_payload->>'license_url','')<>'' AND p_payload->>'license_url' !~ '^https://[^/@[:space:]]+([/?#]|$)') OR length(coalesce(p_payload->>'license_note',''))>2000 OR length(coalesce(p_payload->>'note','')) NOT BETWEEN 1 AND 2000 THEN RAISE EXCEPTION 'invalid_evidence'; END IF;
 IF coalesce(p_payload->>'checked_on','') !~ '^\d{4}-\d{2}-\d{2}$' THEN RAISE EXCEPTION 'invalid_date'; END IF;
 checked:=(p_payload->>'checked_on')::date;
 IF checked>(now() AT TIME ZONE 'Asia/Seoul')::date THEN RAISE EXCEPTION 'invalid_date'; END IF;
 IF coalesce(p_payload->>'route_kind','') NOT IN ('unknown','oneway','return','loop') OR coalesce(p_payload->>'review_state','') NOT IN ('draft','evidence_missing','source_conflict') THEN RAISE EXCEPTION 'invalid_state'; END IF;
 clean:=jsonb_build_object('parts',p_payload->'parts','source_url',p_payload->>'source_url','license_url',coalesce(p_payload->>'license_url',''),'license_note',coalesce(p_payload->>'license_note',''),'checked_on',checked,'note',p_payload->>'note','route_kind',p_payload->>'route_kind','review_state',p_payload->>'review_state');
 INSERT INTO private.course_route_drafts(course_id,revision,course_name,payload,created_by) VALUES(p_course,latest+1,title,clean,auth.uid());
 RETURN latest+1;
END $$;
REVOKE ALL ON FUNCTION private.admin_route_draft(text,integer),private.admin_route_draft_save(text,integer,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION private.admin_route_draft(text,integer),private.admin_route_draft_save(text,integer,jsonb) TO authenticated;
CREATE FUNCTION public.admin_route_draft(p_course text,p_revision integer DEFAULT NULL) RETURNS jsonb LANGUAGE sql SECURITY INVOKER SET search_path='' AS $$SELECT private.admin_route_draft(p_course,p_revision)$$;
CREATE FUNCTION public.admin_route_draft_save(p_course text,p_expected integer,p_payload jsonb) RETURNS integer LANGUAGE sql SECURITY INVOKER SET search_path='' AS $$SELECT private.admin_route_draft_save(p_course,p_expected,p_payload)$$;
REVOKE ALL ON FUNCTION public.admin_route_draft(text,integer),public.admin_route_draft_save(text,integer,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.admin_route_draft(text,integer),public.admin_route_draft_save(text,integer,jsonb) TO authenticated;
COMMIT;
