(()=>{"use strict";var e,t,n,s,o={982:(e,t,n)=>{n.a(e,(async(e,t)=>{try{n(120);var s=n(643),o=n(384),r=n(438),a=n(955),i=document.querySelector(".canvas"),c=i.getContext("2d"),d=document.querySelector(".position"),l=document.querySelector(".colors"),h=new Map,u=new Array,f=4,p=["#ffffff","#c2c2c2","#858585","#474747","#000000","#11ccff","#70aaea","#3f89e0","#074cf2","#5e30eb","#ff6c5c","#ff2500","#e53b7a","#992450","#381a94","#ffcf49","#ffb43f","#fe8649","#ff5b36","#da5100","#94df44","#5cbf0d","#c3d217","#fcc601","#d38202"],y=new s.Z(0,0),m=new s.Z(0,0),v=new s.Z(1,1);const w=c.canvas.width,x=c.canvas.height,C=64,g=10,b=C*g,M=1,Z=16,S=1,T=10,E="127.0.0.1",O=8e3,_=await new Promise(((e,t)=>{const n=new WebSocket(`ws://${E}:${O}`);n.onopen=()=>{e(n)}})),$=new a.Z({wss:_});d.innerHTML=`x:${Math.floor(y.x)}, y:${Math.floor(y.y)} s:${v.x}`;for(const I in p){const R=document.createElement("div");R.className="color",R.style.backgroundColor=p[I],R.addEventListener("click",(()=>{f=I})),l.appendChild(R)}function k(e){var t=h.get(e.stringify());null==t&&(t=new o.Z(C),u.push(e),h.set(e.stringify(),t),$.addroom(e.stringify()),$.openroom(e.stringify()),u.length>Z)&&(e=u.shift(),h.delete(e.stringify()),$.closeroom(e.stringify()))}function L(e){for(let t=e.y-M;t<=e.y+M;t++)for(let n=e.x-M;n<=e.x+M;n++)k(new s.Z(n,t))}function N(e){e.forEach((e=>{for(let o=0;o<C;o++)for(let a=0;a<C;a++){var t=h.get(e.stringify()).cells[o][a],n=r.Z.CaToMo(new s.Z(a*g+e.x*b,o*g+e.y*b),y,v);-g*v.x<=n.x&&n.x<=w&&-g*v.y<=n.y&&n.y<=x&&(c.fillStyle=p[t],c.fillRect(Math.trunc(n.x),Math.trunc(n.y),Math.trunc(g*v.x),Math.trunc(g*v.y)))}}))}function P(e){4==e.buttons&&m.set(e.offsetX,e.offsetY),A(e),i.addEventListener("mousemove",A)}function J(){i.removeEventListener("mousemove",A)}function A(e){if(4==e.buttons)y.x=y.x-(e.offsetX-m.x)/v.x,y.y=y.y-(e.offsetY-m.y)/v.y,m.set(e.offsetX,e.offsetY),d.innerHTML=`x:${Math.floor(y.x)}, y:${Math.floor(y.y)} s:${v.x}`;else{const t=r.Z.CaToCh(r.Z.MoToCa(new s.Z(e.offsetX,e.offsetY),y,v),b),n=r.Z.CaToCe(r.Z.MoToCa(new s.Z(e.offsetX,e.offsetY),y,v),b,g),o=h.get(t.stringify());null!=o&&(1==e.buttons&&(o.cells[n.y][n.x]=f),$.broadcast(t.stringify(),JSON.stringify({event:"set",data:{pos:t.stringify(),chunk:o}})))}}function D(e){var t=r.Z.MoToCa(new s.Z(e.offsetX,e.offsetY),y,v);e.deltaY<0?v.x<T&&v.y<T&&(v=v.add(new s.Z(S,S))):v.x>S&&v.y>S&&(v=v.sub(new s.Z(S,S)));var n=r.Z.MoToCa(new s.Z(e.offsetX,e.offsetY),y,v);y=y.add(t.sub(n)),d.innerHTML=`x:${Math.floor(y.x)}, y:${Math.floor(y.y)} s:${v.x}`}setInterval((()=>{c.fillStyle="white",c.fillRect(0,0,w,x),L(r.Z.CaToCh(new s.Z(y.x,y.y),b)),N(u)}),1),i.addEventListener("mousedown",P),i.addEventListener("mouseup",J),i.addEventListener("wheel",D),$.onrtcopen=e=>{const t=e.detail;$.send(t.uid,JSON.stringify({event:"set",data:{pos:t.rid,chunk:h.get(t.rid)}}))},$.onrtcmessage=e=>{const t=e.detail;"set"==t.event&&h.set(t.data.pos,t.data.chunk)},t()}catch(Y){t(Y)}}),1)},384:(e,t,n)=>{n.d(t,{Z:()=>s});const s=class{cells;constructor(e){this.cellCount=e,this.cells=Array(e).fill().map((()=>Array(e).fill(0)))}}},438:(e,t,n)=>{n.d(t,{Z:()=>o});class s{x;y;constructor(e,t){this.x=e,this.y=t}set(e,t){this.x=e,this.y=t}add(e){return new s(this.x+e.x,this.y+e.y)}sub(e){return new s(this.x-e.x,this.y-e.y)}mult(e){return new s(this.x*e.x,this.y*e.y)}div(e){return new s(this.x/e.x,this.y/e.y)}stringify(){return`${this.x},${this.y}`}}const o=class{static CaToMo(e,t,n){return e.sub(t).mult(n)}static MoToCa(e,t,n){return e.div(n).add(t)}static CaToCh(e,t){var n=Math.floor(e.x/t),o=Math.floor(e.y/t);return new s(n,o)}static CaToCe(e,t,n){var o=Math.floor((e.x-this.CaToCh(e,t).x*t)/n),r=Math.floor((e.y-this.CaToCh(e,t).y*t)/n);return new s(o,r)}}},955:(e,t,n)=>{n.d(t,{Z:()=>o});class s extends EventTarget{events=["room","open","close","sdp","rtcopen","rtcclose","rtcmessage"];constructor(e){super(),this.wss=e.wss,this.rooms={},this.peers={},this.peerConnections={},this.dataChannels={};for(const e in this.events)Object.defineProperty(this,`on${this.events[e]}`,{set(t){this.on(this.events[e],t)}});this.wss.onmessage=async e=>{const t=JSON.parse(e.data);if("room"==t.event)this.emit("room",t.data);else if("open"==t.event){if(t.data.peers)for(const e in t.data.peers)if(this.rooms[t.data.rid][e]=null,this.peers[e]=this.peers[e]||{},this.peers[e][t.data.rid]=null,e in this.peerConnections)this.send(e,JSON.stringify({event:"open",data:{uid:t.data.uid,rid:t.data.rid}}));else{this.peerConnections[e]=new RTCPeerConnection,this.dataChannels[e]=new Promise((async(t,n)=>{const s=await this.peerConnections[e].createDataChannel("messageInput");this.setupdatachannel(s),s.onopen=()=>{t(s)}}));const n=await this.peerConnections[e].createOffer();await this.peerConnections[e].setLocalDescription(n),this.peerConnections[e].onicecandidate=n=>{n.candidate&&this.wss.send(JSON.stringify({event:"sdp",data:{uid:e,rid:t.data.rid,sdp:this.peerConnections[e].localDescription}}))}}this.emit("open",t.data)}else if("close"==t.event)this.close(t.data.uid,t.data.rid);else if("offer"==t.event){this.rooms[t.data.rid][t.data.uid]=null,this.peers[t.data.uid]=this.peers[t.data.uid]||{},this.peers[t.data.uid][t.data.rid]=null,this.peerConnections[t.data.uid]=new RTCPeerConnection,this.dataChannels[t.data.uid]=new Promise((async(e,n)=>{this.peerConnections[t.data.uid].ondatachannel=n=>{this.setupdatachannel(n.channel),e(n.channel),this.emit("rtcopen",t.data)}})),await this.peerConnections[t.data.uid].setRemoteDescription(t.data.sdp);const e=await this.peerConnections[t.data.uid].createAnswer();await this.peerConnections[t.data.uid].setLocalDescription(e),this.peerConnections[t.data.uid].onicecandidate=e=>{e.candidate&&this.wss.send(JSON.stringify({event:"sdp",data:{uid:t.data.uid,rid:t.data.rid,sdp:this.peerConnections[t.data.uid].localDescription}}))},this.emit("sdp",t.data)}else"answer"==t.event&&(await this.peerConnections[t.data.uid].setRemoteDescription(t.data.sdp),this.emit("sdp",t.data))}}setupdatachannel(e){e.onmessage=e=>{const t=JSON.parse(e.data);"open"==t.event?(this.rooms[t.data.rid][t.data.uid]=null,this.peers[t.data.uid]=this.peers[t.data.uid]||{},this.peers[t.data.uid][t.data.room]=null,this.emit("rtcopen",t.data)):this.emit("rtcmessage",t)}}on(e,t){this.addEventListener(e,t)}emit(e,t){this.dispatchEvent(new CustomEvent(e,{detail:t}))}addroom(e,t){this.wss.send(JSON.stringify({event:"room",data:{rid:e,seed:t}}))}openroom(e){this.rooms[e]||(this.rooms[e]={},this.wss.send(JSON.stringify({event:"open",data:{rid:e}})))}closeroom(e){for(const t in this.rooms[e])this.close(t,e);delete this.rooms[e],this.wss.send(JSON.stringify({event:"close",data:{rid:e}}))}async close(e,t){delete this.rooms[t][e],delete this.peers[e][t],0==Object.keys(this.peers[e]).length&&((await this.dataChannels[e]).close(),this.peerConnections[e].close(),delete this.dataChannels[e],delete this.peerConnections[e],delete this.peers[e],this.emit("rtcclose",{uid:e,rid:t})),this.emit("close",{uid:e,rid:t})}async send(e,t){(await this.dataChannels[e]).send(t)}broadcast(e,t){for(const n in this.rooms[e])this.send(n,t)}}const o=s},643:(e,t,n)=>{n.d(t,{Z:()=>o});class s{x;y;constructor(e,t){this.x=e,this.y=t}set(e,t){this.x=e,this.y=t}add(e){return new s(this.x+e.x,this.y+e.y)}sub(e){return new s(this.x-e.x,this.y-e.y)}mult(e){return new s(this.x*e.x,this.y*e.y)}div(e){return new s(this.x/e.x,this.y/e.y)}stringify(){return`${this.x},${this.y}`}}const o=s},518:(e,t,n)=>{n.d(t,{Z:()=>i});var s=n(81),o=n.n(s),r=n(645),a=n.n(r)()(o());a.push([e.id,".position {\n    user-select: none;\n}\n\n.colors {\n    height: 20px;\n}\n\n.color {\n    width: 20px;\n    height: 20px;\n    display: inline-block;\n}\n\n.color:hover {\n    transform: scale(1.2);\n}",""]);const i=a},645:e=>{e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n="",s=void 0!==t[5];return t[4]&&(n+="@supports (".concat(t[4],") {")),t[2]&&(n+="@media ".concat(t[2]," {")),s&&(n+="@layer".concat(t[5].length>0?" ".concat(t[5]):""," {")),n+=e(t),s&&(n+="}"),t[2]&&(n+="}"),t[4]&&(n+="}"),n})).join("")},t.i=function(e,n,s,o,r){"string"==typeof e&&(e=[[null,e,void 0]]);var a={};if(s)for(var i=0;i<this.length;i++){var c=this[i][0];null!=c&&(a[c]=!0)}for(var d=0;d<e.length;d++){var l=[].concat(e[d]);s&&a[l[0]]||(void 0!==r&&(void 0===l[5]||(l[1]="@layer".concat(l[5].length>0?" ".concat(l[5]):""," {").concat(l[1],"}")),l[5]=r),n&&(l[2]?(l[1]="@media ".concat(l[2]," {").concat(l[1],"}"),l[2]=n):l[2]=n),o&&(l[4]?(l[1]="@supports (".concat(l[4],") {").concat(l[1],"}"),l[4]=o):l[4]="".concat(o)),t.push(l))}},t}},81:e=>{e.exports=function(e){return e[1]}},120:(e,t,n)=>{var s=n(379),o=n.n(s),r=n(795),a=n.n(r),i=n(569),c=n.n(i),d=n(565),l=n.n(d),h=n(216),u=n.n(h),f=n(589),p=n.n(f),y=n(518),m={};m.styleTagTransform=p(),m.setAttributes=l(),m.insert=c().bind(null,"head"),m.domAPI=a(),m.insertStyleElement=u(),o()(y.Z,m),y.Z&&y.Z.locals&&y.Z.locals},379:e=>{var t=[];function n(e){for(var n=-1,s=0;s<t.length;s++)if(t[s].identifier===e){n=s;break}return n}function s(e,s){for(var r={},a=[],i=0;i<e.length;i++){var c=e[i],d=s.base?c[0]+s.base:c[0],l=r[d]||0,h="".concat(d," ").concat(l);r[d]=l+1;var u=n(h),f={css:c[1],media:c[2],sourceMap:c[3],supports:c[4],layer:c[5]};if(-1!==u)t[u].references++,t[u].updater(f);else{var p=o(f,s);s.byIndex=i,t.splice(i,0,{identifier:h,updater:p,references:1})}a.push(h)}return a}function o(e,t){var n=t.domAPI(t);return n.update(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap&&t.supports===e.supports&&t.layer===e.layer)return;n.update(e=t)}else n.remove()}}e.exports=function(e,o){var r=s(e=e||[],o=o||{});return function(e){e=e||[];for(var a=0;a<r.length;a++){var i=n(r[a]);t[i].references--}for(var c=s(e,o),d=0;d<r.length;d++){var l=n(r[d]);0===t[l].references&&(t[l].updater(),t.splice(l,1))}r=c}}},569:e=>{var t={};e.exports=function(e,n){var s=function(e){if(void 0===t[e]){var n=document.querySelector(e);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(e){n=null}t[e]=n}return t[e]}(e);if(!s)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");s.appendChild(n)}},216:e=>{e.exports=function(e){var t=document.createElement("style");return e.setAttributes(t,e.attributes),e.insert(t,e.options),t}},565:(e,t,n)=>{e.exports=function(e){var t=n.nc;t&&e.setAttribute("nonce",t)}},795:e=>{e.exports=function(e){if("undefined"==typeof document)return{update:function(){},remove:function(){}};var t=e.insertStyleElement(e);return{update:function(n){!function(e,t,n){var s="";n.supports&&(s+="@supports (".concat(n.supports,") {")),n.media&&(s+="@media ".concat(n.media," {"));var o=void 0!==n.layer;o&&(s+="@layer".concat(n.layer.length>0?" ".concat(n.layer):""," {")),s+=n.css,o&&(s+="}"),n.media&&(s+="}"),n.supports&&(s+="}");var r=n.sourceMap;r&&"undefined"!=typeof btoa&&(s+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(r))))," */")),t.styleTagTransform(s,e,t.options)}(t,e,n)},remove:function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(t)}}}},589:e=>{e.exports=function(e,t){if(t.styleSheet)t.styleSheet.cssText=e;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(e))}}}},r={};function a(e){var t=r[e];if(void 0!==t)return t.exports;var n=r[e]={id:e,exports:{}};return o[e](n,n.exports,a),n.exports}e="function"==typeof Symbol?Symbol("webpack queues"):"__webpack_queues__",t="function"==typeof Symbol?Symbol("webpack exports"):"__webpack_exports__",n="function"==typeof Symbol?Symbol("webpack error"):"__webpack_error__",s=e=>{e&&e.d<1&&(e.d=1,e.forEach((e=>e.r--)),e.forEach((e=>e.r--?e.r++:e())))},a.a=(o,r,a)=>{var i;a&&((i=[]).d=-1);var c,d,l,h=new Set,u=o.exports,f=new Promise(((e,t)=>{l=t,d=e}));f[t]=u,f[e]=e=>(i&&e(i),h.forEach(e),f.catch((e=>{}))),o.exports=f,r((o=>{var r;c=(o=>o.map((o=>{if(null!==o&&"object"==typeof o){if(o[e])return o;if(o.then){var r=[];r.d=0,o.then((e=>{a[t]=e,s(r)}),(e=>{a[n]=e,s(r)}));var a={};return a[e]=e=>e(r),a}}var i={};return i[e]=e=>{},i[t]=o,i})))(o);var a=()=>c.map((e=>{if(e[n])throw e[n];return e[t]})),d=new Promise((t=>{(r=()=>t(a)).r=0;var n=e=>e!==i&&!h.has(e)&&(h.add(e),e&&!e.d&&(r.r++,e.push(r)));c.map((t=>t[e](n)))}));return r.r?d:a()}),(e=>(e?l(f[n]=e):d(u),s(i)))),i&&i.d<0&&(i.d=0)},a.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return a.d(t,{a:t}),t},a.d=(e,t)=>{for(var n in t)a.o(t,n)&&!a.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},a.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),a.nc=void 0,a(982)})();