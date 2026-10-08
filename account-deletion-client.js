(function(root){
  'use strict';
  const messages={
    account_changed:'로그인 계정이 바뀌었어요. 현재 계정을 확인한 뒤 다시 진행해 주세요.',sign_in_required:'다시 로그인한 뒤 탈퇴를 진행해 주세요.',recent_sign_in_required:'본인 확인을 위해 다시 로그인한 뒤 15분 이내에 처리해 주세요.',
    admin_only:'관리자 권한을 확인할 수 없어요.',admin_transfer_required:'관리자·매니저는 권한 이전 후 탈퇴할 수 있어요.',
    deletion_in_progress:'이미 탈퇴 처리 중이에요. 잠시 후 목록을 새로고침해 주세요.',account_missing:'이미 삭제된 계정입니다. 회원 목록을 새로고침해 주세요.',
    auth_unavailable:'로그인 확인 서버에 연결하지 못했어요. 계정은 삭제되지 않았으니 잠시 후 다시 시도해 주세요.',
    permission_unavailable:'관리자 권한을 확인하지 못했어요. 계정은 삭제되지 않았으니 잠시 후 다시 시도해 주세요.',
    storage_cleanup_failed:'업로드 사진 정리를 완료하지 못했어요. 계정은 아직 남아 있습니다. 다시 시도하면 남은 데이터부터 정리합니다.',
    activity_cleanup_failed:'활동 데이터 정리를 완료하지 못했어요. 계정은 아직 남아 있습니다. 다시 로그인한 뒤 재시도해 주세요.',
    session_cleanup_failed:'세션 종료를 확인하지 못했어요. 일부 데이터가 삭제됐을 수 있으니 다시 로그인한 뒤 재시도해 주세요.',
    auth_delete_failed:'일부 데이터는 정리됐지만 로그인 계정 삭제를 완료하지 못했어요. 다시 로그인한 뒤 재시도해 주세요.',
    deletion_start_failed:'탈퇴 처리를 시작하지 못했어요. 잠시 후 다시 시도해 주세요.',service_unavailable:'탈퇴 서버를 사용할 수 없어요. 잠시 후 다시 시도해 주세요.',
    network_error:'연결이 끊겨 삭제 결과를 확인하지 못했어요. 회원 목록이나 로그인 상태를 확인한 뒤 재시도해 주세요.'
  };
  function message(code){return messages[code]||'삭제 완료를 확인하지 못했어요. 일부 삭제됐을 수 있으니 다시 로그인해 재시도하거나 footstepbiz@gmail.com으로 문의해 주세요.';}
  async function request(sb,body){
    let session;
    try{const result=await sb.auth.getSession();if(result.error)return {error:'auth_unavailable'};session=result.data?.session;}catch{return {error:'auth_unavailable'};}
    if(!session?.access_token)return {error:'sign_in_required'};
    const actorId=session.user?.id;
    for(let attempt=0;attempt<2;attempt++){
      let response;try{response=await sb.functions.invoke('delete-account',{body,headers:{Authorization:'Bearer '+session.access_token}});}catch{return {error:'network_error'};}
      if(!response.error)return response.data?.deleted===true?response.data:{error:response.data?.error||'deletion_incomplete'};
      let detail;try{if(response.error.context)detail=await response.error.context.clone().json();}catch{}
      const unauthorized=response.error.context?.status===401;
      if(attempt===0&&unauthorized){
        try{const refreshed=await sb.auth.refreshSession();if(refreshed.error||!refreshed.data?.session?.access_token)return {error:'sign_in_required'};if(actorId&&refreshed.data.session.user?.id!==actorId)return {error:'account_changed'};session=refreshed.data.session;}catch{return {error:'auth_unavailable'};}
        continue; // Authentication was rejected before deletion; never retry a network/cleanup failure automatically.
      }
      return {error:detail?.error||(unauthorized?'sign_in_required':response.error.context?'deletion_incomplete':'network_error')};
    }
    return {error:'sign_in_required'};
  }
  const api={request,message};if(typeof module==='object'&&module.exports)module.exports=api;else root.AccountDeletionClient=api;
})(globalThis);
