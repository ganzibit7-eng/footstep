import { createClient } from "npm:@supabase/supabase-js@2.57.4";

export async function handleRequest(req, create = createClient, env = Deno.env) {
  const origin = req.headers.get("origin");
  const allowed = new Set(["https://balzaguk.com", "https://www.balzaguk.com"]);
  const headers = {"Content-Type":"application/json","Cache-Control":"no-store","Vary":"Origin",
    "Access-Control-Allow-Headers":"authorization, apikey, content-type, x-client-info",
    "Access-Control-Allow-Methods":"POST, OPTIONS"};
  if(origin && allowed.has(origin)) headers["Access-Control-Allow-Origin"] = origin;
  const reply = (status, body) => new Response(JSON.stringify(body),{status,headers});
  if(origin && !allowed.has(origin)) return reply(403,{error:"origin_not_allowed"});
  if(req.method === "OPTIONS") return new Response(null,{status:204,headers});
  if(req.method !== "POST") return reply(405,{error:"method_not_allowed"});
  const authorization=req.headers.get("authorization") || "";
  if(!authorization.startsWith("Bearer ")) return reply(401,{error:"sign_in_required"});
  let body;
  try { body=await req.json(); } catch { return reply(400,{error:"invalid_request"}); }
  const isAdminRequest=body?.confirm === "DELETE_MEMBER_ACCOUNT";
  if(body?.confirm !== "DELETE_MY_ACCOUNT" && !isAdminRequest) return reply(400,{error:"confirmation_required"});
  const url=env.get("SUPABASE_URL"), key=env.get("SUPABASE_SERVICE_ROLE_KEY");
  if(!url || !key) return reply(503,{error:"service_unavailable"});
  const admin=create(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
  const token=authorization.slice(7);
  const {data:identity,error:authError}=await admin.auth.getUser(token);
  if(authError || !identity?.user || identity.user.is_anonymous)
    return reply(401,{error:"sign_in_required"});
  const user=identity.user;
  let targetId=user.id;
  if(isAdminRequest){
    const {data:authorized,error:permissionError}=await admin.rpc("is_admin",{uid:user.id});
    if(permissionError || authorized !== true) return reply(403,{error:"admin_only"});
    if(typeof body.user_id !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(body.user_id))
      return reply(400,{error:"invalid_target"});
    if(body.user_id===user.id) return reply(409,{error:"admin_transfer_required"});
    targetId=body.user_id;
  }else if(body.user_id && body.user_id!==user.id){
    return reply(403,{error:"invalid_target"});
  }
  // Only a verified administrator may supply a different target account.
  if(Date.now()-Date.parse(user.last_sign_in_at || "") > 15*60*1000 ||
     !Number.isFinite(Date.parse(user.last_sign_in_at || "")))
    return reply(403,{error:"recent_sign_in_required"});
  let started=false;
  try {
    const {error:startError}=await admin.rpc("begin_account_deletion",{p_user_id:targetId});
    if(startError){
      if(startError.message?.includes("admin_transfer_required"))
        return reply(409,{error:"admin_transfer_required"});
      if(startError.message?.includes("deletion_in_progress"))
        return reply(409,{error:"deletion_in_progress"});
      if(startError.message?.includes("account_missing")) return reply(404,{error:"account_missing"});
      throw startError;
    }
    started=true;
    // Bounded execution; failures release the lease so the same account can retry.
    const deadline=Date.now()+45000;
    while(true){
      if(Date.now()>deadline) throw new Error("retry_required");
      const {data:files,error}=await admin.rpc("account_deletion_files",{p_user_id:targetId});
      if(error) throw error;
      if(!files?.length) break;
      const buckets=new Map();
      for(const file of files){
        if(!buckets.has(file.bucket_id)) buckets.set(file.bucket_id,[]);
        buckets.get(file.bucket_id).push(file.name);
      }
      for(const [bucket,names] of buckets){
        const {error:removeError}=await admin.storage.from(bucket).remove(names);
        if(removeError) throw removeError;
      }
    }
    const {error:eraseError}=await admin.rpc("erase_account_activity",{p_user_id:targetId});
    if(eraseError) throw eraseError;
    // deleteUser removes the target's Auth sessions; never sign out the acting admin.
    // Existing account-deletion RLS blocks writes while cleanup is in progress.
    if(!isAdminRequest){
      const {error:signOutError}=await admin.auth.admin.signOut(token,"global");
      if(signOutError) throw signOutError;
    }
    const {error:deleteError}=await admin.auth.admin.deleteUser(targetId,false);
    if(deleteError) throw deleteError;
    const {error:finishError}=await admin.rpc("finish_account_deletion",{p_user_id:targetId,p_success:true});
    if(finishError) return reply(200,{deleted:true,cleanup_pending:true});
    return reply(200,{deleted:true});
  } catch {
    if(started) await admin.rpc("finish_account_deletion",{p_user_id:targetId,p_success:false});
    return reply(503,{error:"deletion_incomplete",
      message:"일부 삭제가 진행됐을 수 있습니다. 다시 로그인하여 재시도하거나 문의해주세요."});
  }
}
Deno.serve(handleRequest);
