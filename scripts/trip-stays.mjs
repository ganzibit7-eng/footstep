import {readFileSync} from 'node:fs';
export const tripStays=JSON.parse(readFileSync(new URL('../trip-stays.json',import.meta.url),'utf8'));
export const tripDisclosure='발자국은 트립닷컴 제휴 활동으로 예약 실적에 따른 수수료를 지급받습니다.';
export function tripBooking(id,{compact=false}={}){
 const stay=tripStays.find(item=>item.id===id);if(!stay)return '';
 const url=new URL(stay.url);if(url.protocol!=='https:'||url.hostname!=='kr.trip.com')throw new Error('Invalid Trip.com destination');
 const href=stay.url.replaceAll('&','&amp;');
 const note=stay.bookingPetPolicy?.startsWith('예약 플랫폼 동반 규정 미확인')?'예약 플랫폼의 동반 규정은 미확인입니다. 펫 객실 판매 여부·체중 제한·추가요금을 숙소에 먼저 확인해 주세요.':'반려견 허용 객실·체중 제한·추가요금은 숙소에 확인 후 예약해 주세요.';
 return `<aside class="trip-booking" aria-label="트립닷컴 제휴 예약"><p class="trip-disclosure">${compact?'트립닷컴 제휴 예약':tripDisclosure}</p><a href="${href}" target="_blank" rel="sponsored noopener noreferrer">트립닷컴에서 객실 확인 <span aria-hidden="true">↗</span></a><p class="trip-pet-note">${note}</p></aside>`;
}
