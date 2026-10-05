(function(root){
  'use strict';
  const meters=(a,b)=>{
    const rad=Math.PI/180,dlat=(b[0]-a[0])*rad,dlng=(b[1]-a[1])*rad;
    const h=Math.sin(dlat/2)**2+Math.cos(a[0]*rad)*Math.cos(b[0]*rad)*Math.sin(dlng/2)**2;
    return 6371000*2*Math.atan2(Math.sqrt(h),Math.sqrt(Math.max(0,1-h)));
  };
  class Tracker {
    constructor(strideCm=70){
      this.strideCm=Math.min(120,Math.max(30,Number(strideCm)||70));
      this.state='idle';this.parts=[];this.distanceM=0;this.activeMs=0;this.pausedMs=0;
      this.since=0;this.anchor=null;this.lastFix=null;this.lastSeen=null;this.breakNext=true;
    }
    start(now){this.state='running';this.since=now;}
    pause(now){if(this.state!=='running')return;this.activeMs+=Math.max(0,now-this.since);this.state='paused';this.since=now;this.breakNext=true;this.anchor=null;}
    resume(now){if(this.state!=='paused')return;this.pausedMs+=Math.max(0,now-this.since);this.state='running';this.since=now;this.breakNext=true;this.anchor=null;}
    stop(now){if(this.state==='running')this.activeMs+=Math.max(0,now-this.since);if(this.state==='paused')this.pausedMs+=Math.max(0,now-this.since);this.state='done';this.since=now;}
    stats(now){
      const sec=(this.activeMs+(this.state==='running'?Math.max(0,now-this.since):0))/1000;
      const paused=(this.pausedMs+(this.state==='paused'?Math.max(0,now-this.since):0))/1000;
      return {durationSec:sec,pausedSec:paused,elapsedSec:sec+paused,distanceKm:this.distanceM/1000,
        steps:Math.round(this.distanceM/(this.strideCm/100)),strideCm:this.strideCm,
        paceSec:this.distanceM>=50?sec/(this.distanceM/1000):null,
        speedKmh:sec>0?this.distanceM/1000/(sec/3600):0};
    }
    add(pos,now){
      if(this.state!=='running')return 'paused';
      const {latitude:lat,longitude:lng,accuracy}=pos.coords||{};
      const timestamp=Number(pos.timestamp);
      if(!Number.isFinite(lat)||!Number.isFinite(lng)||Math.abs(lat)>90||Math.abs(lng)>180||!Number.isFinite(accuracy)||accuracy<0)return 'invalid';
      if(!Number.isFinite(timestamp)||timestamp<this.since||now-timestamp>20000||timestamp>now+5000||(this.lastSeen!==null&&timestamp<=this.lastSeen))return 'stale';
      this.lastSeen=timestamp;
      if(accuracy>35)return 'accuracy';
      const point=[lat,lng];
      if(this.lastFix!==null&&timestamp-this.lastFix>30000){this.breakNext=true;this.anchor=null;}
      if(this.anchor&&!this.breakNext){
        const distance=meters(this.anchor.point,point),dt=(timestamp-this.anchor.time)/1000;
        if(dt<=0||distance/dt>4.5)return 'jump';
        // Small GPS drift is not counted; displacement accumulates relative to the last accepted point.
        if(distance<Math.max(5,Math.min(12,(accuracy+this.anchor.accuracy)*0.3))){this.lastFix=timestamp;return 'still';}
        this.distanceM+=distance;
      }
      if(this.breakNext||!this.parts.length){this.parts.push([]);this.breakNext=false;}
      this.parts[this.parts.length-1].push(point);
      this.anchor={point,time:timestamp,accuracy};this.lastFix=timestamp;
      return 'accepted';
    }
    snapshot(now){
      const stats=this.stats(now);
      return {version:1,strideCm:this.strideCm,state:this.state,parts:this.parts, distanceM:this.distanceM,activeMs:stats.durationSec*1000,pausedMs:stats.pausedSec*1000,savedAt:now};
    }
    static restore(data,now){
      if(!data||data.version!==1||!["running","paused","done"].includes(data.state)||!Array.isArray(data.parts)||!data.parts.every(part=>Array.isArray(part)&&part.every(p=>Array.isArray(p)&&p.length===2&&Number.isFinite(p[0])&&Number.isFinite(p[1])&&Math.abs(p[0])<=90&&Math.abs(p[1])<=180))||![data.distanceM,data.activeMs,data.pausedMs,data.savedAt].every(n=>Number.isFinite(n)&&n>=0))throw new Error("invalid_walk_draft");
      const tracker=new Tracker(data.strideCm);tracker.parts=data.parts.map(p=>p.map(x=>x.slice()));tracker.distanceM=data.distanceM;tracker.activeMs=data.activeMs;tracker.pausedMs=data.pausedMs;tracker.since=now;tracker.state=data.state==="done"?"done":"paused";return tracker;
    }
    result(now){return {...this.stats(now),path:this.parts.flat().map(p=>p.slice()),parts:this.parts.map(p=>p.map(x=>x.slice()))};}
  }
  const api={Tracker,meters};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  else root.WalkTracker=api;
})(typeof globalThis!=='undefined'?globalThis:this);

