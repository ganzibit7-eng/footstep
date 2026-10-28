import {readFile} from 'node:fs/promises';
import path from 'node:path';
import Access from '../course-pet-access.js';
import {verifiedRoute} from './detail-editorial.mjs';

const plans=[
 {slug:'gyeonggi-lake-gpx-walks',title:'경기 호수 산책길: 공식 GPX 전체 경로와 호반 구간 비교',description:'산정호수·청계호수·호명호수의 등록 거리, 공식 GPX와 선택 구간, 반려견 동반 자료를 비교합니다. 주차·계단·현장 통제는 별도로 확인하세요.',ids:['c362','c363','c397'],intro:'호수 이름이 같아도 안내하는 범위는 다릅니다. 호수 주변 전체 경로인지 긴 둘레길의 일부 구간인지 먼저 확인하면 거리 숫자를 잘못 읽는 일을 줄일 수 있습니다. 아래 세 곳은 발자국의 기존 공식 GPX와 동반 자료가 함께 연결된 경기 지역 코스입니다. 인기순이나 현장 방문 후기 목록은 아닙니다.'},
 {slug:'incheon-gpx-dog-walks',title:'인천 반려견 산책 코스: 계양산·월미산 GPX 자료 비교',description:'인천둘레길 계양산·월미산 코스의 공식 GPX, 등록 거리·난이도, 동반 자료 확인 방법을 정리했습니다. 평지 시간 추정과 실제 보행 시간을 구분하세요.',ids:['c361','c432'],intro:'인천의 산책길을 고를 때는 지도상의 가까운 위치와 실제 코스의 길이를 따로 살펴보세요. 계양산과 월미산 코스는 위치와 구간이 서로 다른 별개의 길입니다. 아래는 기존에 연결된 공식 GPX 자료를 읽고 비교하기 위한 안내이며, 두 코스를 이어 걷는 일정이나 쉬운 평지 코스라는 추천이 아닙니다.'},
 {slug:'yeoju-yeogang-gpx-walks',title:'여주 여강길 반려견 산책: 강천섬길부터 긴 코스까지 비교',description:'여주 여강길 옛나루터길·강천섬길·왕터쌀길·부처울습지길의 공식 GPX와 등록 거리·난이도를 비교합니다. 왕복·귀가와 동반 조건은 상세에서 확인하세요.',ids:['c347','c344','c426','c342'],intro:'같은 여강길이라도 코스별 등록 거리가 크게 다릅니다. 짧은 구간과 긴 코스를 한데 묶어 모두 가벼운 산책이라고 소개하지 않고, 기존 공식 GPX와 등록 정보를 기준으로 비교합니다. 전 구간 완주를 권하는 목록은 아니며 반려견의 상태, 당일 통제와 귀가 동선을 먼저 고려하세요.'}
];
export async function evidenceGuides(root,courses,{updatedAt='2026-10-28'}={}){
 const byId=new Map(courses.map(c=>[String(c.id),c])),guides=[];
 for(const plan of plans){
  const selected=[];
  for(const id of plan.ids){
   const item=byId.get(id);if(!item)continue;
   const pet=Access.get(item);if(!pet)continue;
   const html=await readFile(path.join(root,'courses',id,'index.html'),'utf8');
   const route=verifiedRoute(id,html);if(!route)continue;
   selected.push({id,item,pet,route});
  }
  if(selected.length<2)continue;
  const sections=selected.map(({item,pet,route})=>{
   const fields=[`등록 거리 ${item.distance||'미확인'}`,`등록 난이도 ${item.diff||'미확인'}`,route.segment?`공식 GPX 중 ${route.segment}의 선택 구간입니다. 전체 코스의 거리로 해석하지 마세요.`:'공식 GPX 전체 경로 자료가 연결되어 있습니다.'];
   if(pet.conditions?.['동반시 필요사항'])fields.push('동반 준비사항 원문: '+pet.conditions['동반시 필요사항']+'.');
   if(pet.conditions?.['동반 관련 상세정보'])fields.push('동반 상세 원문: '+pet.conditions['동반 관련 상세정보']);
   fields.push(`동반 자료 대조일: ${pet.checkedDate||'미상'}. 현장 방문일이 아닙니다.`);
   return [item.name,fields.join(' ')];
  });
  guides.push({...plan,updatedAt,sections:[...sections,['숫자와 자료의 범위를 읽는 방법','등록 거리는 페이지에 게시된 참고 거리입니다. 예상 시간은 실제 반려견 동반 보행 기록이 아니며 휴식·경사·보행 속도에 따라 달라집니다. 공식 GPX가 있어도 당일 통제, 반려견 출입 범위, 주차 가능 여부까지 실시간 검증한 것은 아닙니다. 출발·종료 지점과 왕복 이동·귀가 동선을 상세에서 확인하세요.']],tips:['상세의 경로 지도와 GPX 출발·도착 지점을 확인','일부 구간은 전체 둘레길 길이와 구분','동반 조건·계단·경사·쉼터 미확인은 없음으로 해석하지 않기','자료 대조일과 현장 상태를 구분하고 당일 통제 재확인'],links:selected.flatMap(({id,item,pet,route})=>[[item.name+' 상세','/courses/'+id+'/'],[item.name+' 경로 원문',route.source],...(pet.source!==route.source?[[item.name+' 동반 자료',pet.source]]:[])])});
 }
 return guides;
}
