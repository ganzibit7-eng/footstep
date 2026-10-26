// Editorial interface copy, never a claim about an individual venue's policy.
export function listingCopy(type,label=''){
 const kind=type.table==='courses'?'course':type.table==='bins'?'amenity':/캠핑|야영|글램핑/.test(label)?'camping':/숙소|호텔|펜션/.test(label)?'stay':/식당|카페/.test(label)?'dining':/공원|관광/.test(label)?'park':/쇼핑|용품/.test(label)?'retail':'place';
 const copy={
  course:['거리·시간·난이도와 확인된 편의 정보를 비교해 보세요.','경로와 동반 허용 범위는 다릅니다. 상세의 검증 상태와 현장 통제를 확인하세요.'],
  amenity:['배부·수거 용도와 등록 위치를 확인하세요.','실제 설치·봉투 비치·작동 상태는 현장에서 확인하세요.'],
  camping:['사이트별 동반 조건과 시설, 이용 시간을 살펴보세요.','허용 사이트·반려견 제한·추가요금은 예약 전에 운영기관에 확인하세요.'],
  stay:['허용 객실과 반려견 체중 기준, 입퇴실 안내를 확인하세요.','반려견 허용 객실·마릿수·추가요금은 숙소에 확인한 뒤 예약하세요.'],
  dining:['실내·야외 동반 범위와 준비물을 비교해 보세요.','실내·테라스 출입 범위와 영업시간은 방문 전에 확인하세요.'],
  park:['출입 가능 구역과 이용 수칙, 공원 시설을 살펴보세요.','출입 제한 구역과 목줄·입마개 수칙을 확인하고 현장 안내를 따라주세요.'],
  retail:['출입 구역과 방문 정보를 확인하세요.','매장별 이동장·목줄 조건을 확인하세요.'],
  place:['지역과 종류를 좁혀 장소의 이용 조건을 살펴보세요.','장소마다 동반 기준이 다릅니다. 상세의 출처와 확인 범위를 살펴보세요.']
 }[kind];
 return {kind,intro:copy[0],note:copy[1]+' 등록 정보와 현장 운영은 다를 수 있습니다.'};
}
