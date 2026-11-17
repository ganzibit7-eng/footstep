(function(root){
  'use strict';
  // An older admin loader still requests this file. Advertising remains paused.
  root.PawAdvertisingAdmin=Object.freeze({
    mount(element){
      element.textContent='광고·제휴 운영을 중단했습니다.';
      return {dispose(){element.replaceChildren();}};
    }
  });
})(globalThis);
