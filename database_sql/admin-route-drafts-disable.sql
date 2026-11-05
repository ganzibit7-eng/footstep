-- Emergency disable only. Preserve every draft and every existing course.
BEGIN;
REVOKE EXECUTE ON FUNCTION public.admin_route_draft(text,integer),public.admin_route_draft_save(text,integer,jsonb) FROM authenticated;
REVOKE EXECUTE ON FUNCTION private.admin_route_draft(text,integer),private.admin_route_draft_save(text,integer,jsonb) FROM authenticated;
COMMIT;
