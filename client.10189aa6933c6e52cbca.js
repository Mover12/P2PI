(()=>{"use strict";var e,t,n,s,o={237:(e,t,n)=>{n.a(e,(async(e,t)=>{try{n(439);var s=n(537),o=n(593),r=n(336),i=n(454),a=n(927),c=n(619),d=n(641),l=n(649),f=document.querySelector(".canvas"),h=f.getContext("2d"),p=document.querySelector(".position"),u=document.querySelector(".colors"),y=new Map,v=new Array,m=4,b=["#ffffff","#c2c2c2","#858585","#474747","#000000","#11ccff","#70aaea","#3f89e0","#074cf2","#5e30eb","#ff6c5c","#ff2500","#e53b7a","#992450","#381a94","#ffcf49","#ffb43f","#fe8649","#ff5b36","#da5100","#94df44","#5cbf0d","#c3d217","#fcc601","#d38202"],w=new s.A(0,0),C=new s.A(0,0),g=new s.A(1,1);const x=h.canvas.width,A=h.canvas.height,M=64,S=10,E=M*S,T=1,L=16,k=1,O=10,_=Array.from(Array(8),(()=>Math.floor(16*Math.random()).toString(16))).join(""),N=await new Promise(((e,t)=>{const n=new a.A({id:_,url:"ws://127.0.0.1:8000"});n.addEventListener("open",(()=>{e(n)}))})),P=new i.A({id:_}),$=new c.A({socket:N,peer:P}),D=new d.A({socket:N}),J=new l.A({room:D,signalpeer:$});p.innerHTML=`x:${Math.floor(w.x)}, y:${Math.floor(w.y)} s:${g.x}`;for(const F in b){const U=document.createElement("div");U.className="color",U.style.backgroundColor=b[F],U.addEventListener("click",(()=>{m=F})),u.appendChild(U)}function R(e){var t=y.get(e.stringify());null==t&&(t=new o.A(M),v.push(e),y.set(e.stringify(),t),D.open(e.stringify()),v.length>L)&&(e=v.shift(),y.delete(e.stringify()),D.close(e.stringify()))}function Y(e){for(let t=e.y-T;t<=e.y+T;t++)for(let n=e.x-T;n<=e.x+T;n++)R(new s.A(n,t))}function j(e){e.forEach((e=>{for(let o=0;o<M;o++)for(let i=0;i<M;i++){var t=y.get(e.stringify()).cells[o][i],n=r.A.CaToMo(new s.A(i*S+e.x*E,o*S+e.y*E),w,g);-S*g.x<=n.x&&n.x<=x&&-S*g.y<=n.y&&n.y<=A&&(h.fillStyle=b[t],h.fillRect(Math.trunc(n.x),Math.trunc(n.y),Math.trunc(S*g.x),Math.trunc(S*g.y)))}}))}function I(e){4==e.buttons&&C.set(e.offsetX,e.offsetY),q(e),f.addEventListener("mousemove",q)}function X(){f.removeEventListener("mousemove",q)}function q(e){if(4==e.buttons)w.x=w.x-(e.offsetX-C.x)/g.x,w.y=w.y-(e.offsetY-C.y)/g.y,C.set(e.offsetX,e.offsetY),p.innerHTML=`x:${Math.floor(w.x)}, y:${Math.floor(w.y)} s:${g.x}`;else{const t=r.A.CaToCh(r.A.MoToCa(new s.A(e.offsetX,e.offsetY),w,g),E),n=r.A.CaToCe(r.A.MoToCa(new s.A(e.offsetX,e.offsetY),w,g),E,S),o=y.get(t.stringify());null!=o&&(1==e.buttons&&(o.cells[n.y][n.x]=m),J.broadcast(t.stringify(),{event:"set",body:{pos:t.stringify(),chunk:o}}))}}function H(e){var t=r.A.MoToCa(new s.A(e.offsetX,e.offsetY),w,g);e.deltaY<0?g.x<O&&g.y<O&&(g=g.add(new s.A(k,k))):g.x>k&&g.y>k&&(g=g.sub(new s.A(k,k)));var n=r.A.MoToCa(new s.A(e.offsetX,e.offsetY),w,g);w=w.add(t.sub(n)),p.innerHTML=`x:${Math.floor(w.x)}, y:${Math.floor(w.y)} s:${g.x}`}setInterval((()=>{h.fillStyle="white",h.fillRect(0,0,x,A),Y(r.A.CaToCh(new s.A(w.x,w.y),E)),j(v)}),1),f.addEventListener("mousedown",I),f.addEventListener("mouseup",X),f.addEventListener("wheel",H),P.addEventListener("message",(e=>{const[t,n]=e.detail,s=JSON.parse(n.data);"set"==s.event&&y.set(s.body.pos,s.body.chunk)})),t()}catch(z){t(z)}}),1)},150:(e,t,n)=>{n.d(t,{A:()=>a});var s=n(601),o=n.n(s),r=n(314),i=n.n(r)()(o());i.push([e.id,".position {\n    user-select: none;\n}\n\n.colors {\n    height: 20px;\n}\n\n.color {\n    width: 20px;\n    height: 20px;\n    display: inline-block;\n}\n\n.color:hover {\n    transform: scale(1.2);\n}",""]);const a=i},314:e=>{e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n="",s=void 0!==t[5];return t[4]&&(n+="@supports (".concat(t[4],") {")),t[2]&&(n+="@media ".concat(t[2]," {")),s&&(n+="@layer".concat(t[5].length>0?" ".concat(t[5]):""," {")),n+=e(t),s&&(n+="}"),t[2]&&(n+="}"),t[4]&&(n+="}"),n})).join("")},t.i=function(e,n,s,o,r){"string"==typeof e&&(e=[[null,e,void 0]]);var i={};if(s)for(var a=0;a<this.length;a++){var c=this[a][0];null!=c&&(i[c]=!0)}for(var d=0;d<e.length;d++){var l=[].concat(e[d]);s&&i[l[0]]||(void 0!==r&&(void 0===l[5]||(l[1]="@layer".concat(l[5].length>0?" ".concat(l[5]):""," {").concat(l[1],"}")),l[5]=r),n&&(l[2]?(l[1]="@media ".concat(l[2]," {").concat(l[1],"}"),l[2]=n):l[2]=n),o&&(l[4]?(l[1]="@supports (".concat(l[4],") {").concat(l[1],"}"),l[4]=o):l[4]="".concat(o)),t.push(l))}},t}},601:e=>{e.exports=function(e){return e[1]}},439:(e,t,n)=>{var s=n(72),o=n.n(s),r=n(825),i=n.n(r),a=n(659),c=n.n(a),d=n(56),l=n.n(d),f=n(540),h=n.n(f),p=n(113),u=n.n(p),y=n(150),v={};v.styleTagTransform=u(),v.setAttributes=l(),v.insert=c().bind(null,"head"),v.domAPI=i(),v.insertStyleElement=h(),o()(y.A,v),y.A&&y.A.locals&&y.A.locals},72:e=>{var t=[];function n(e){for(var n=-1,s=0;s<t.length;s++)if(t[s].identifier===e){n=s;break}return n}function s(e,s){for(var r={},i=[],a=0;a<e.length;a++){var c=e[a],d=s.base?c[0]+s.base:c[0],l=r[d]||0,f="".concat(d," ").concat(l);r[d]=l+1;var h=n(f),p={css:c[1],media:c[2],sourceMap:c[3],supports:c[4],layer:c[5]};if(-1!==h)t[h].references++,t[h].updater(p);else{var u=o(p,s);s.byIndex=a,t.splice(a,0,{identifier:f,updater:u,references:1})}i.push(f)}return i}function o(e,t){var n=t.domAPI(t);return n.update(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap&&t.supports===e.supports&&t.layer===e.layer)return;n.update(e=t)}else n.remove()}}e.exports=function(e,o){var r=s(e=e||[],o=o||{});return function(e){e=e||[];for(var i=0;i<r.length;i++){var a=n(r[i]);t[a].references--}for(var c=s(e,o),d=0;d<r.length;d++){var l=n(r[d]);0===t[l].references&&(t[l].updater(),t.splice(l,1))}r=c}}},659:e=>{var t={};e.exports=function(e,n){var s=function(e){if(void 0===t[e]){var n=document.querySelector(e);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(e){n=null}t[e]=n}return t[e]}(e);if(!s)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");s.appendChild(n)}},540:e=>{e.exports=function(e){var t=document.createElement("style");return e.setAttributes(t,e.attributes),e.insert(t,e.options),t}},56:(e,t,n)=>{e.exports=function(e){var t=n.nc;t&&e.setAttribute("nonce",t)}},825:e=>{e.exports=function(e){if("undefined"==typeof document)return{update:function(){},remove:function(){}};var t=e.insertStyleElement(e);return{update:function(n){!function(e,t,n){var s="";n.supports&&(s+="@supports (".concat(n.supports,") {")),n.media&&(s+="@media ".concat(n.media," {"));var o=void 0!==n.layer;o&&(s+="@layer".concat(n.layer.length>0?" ".concat(n.layer):""," {")),s+=n.css,o&&(s+="}"),n.media&&(s+="}"),n.supports&&(s+="}");var r=n.sourceMap;r&&"undefined"!=typeof btoa&&(s+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(r))))," */")),t.styleTagTransform(s,e,t.options)}(t,e,n)},remove:function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(t)}}}},113:e=>{e.exports=function(e,t){if(t.styleSheet)t.styleSheet.cssText=e;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(e))}}},593:(e,t,n)=>{n.d(t,{A:()=>s});class s{cells;constructor(e){this.cellCount=e,this.cells=Array(e).fill().map((()=>Array(e).fill(0)))}}},336:(e,t,n)=>{n.d(t,{A:()=>o});var s=n(537);class o{static CaToMo(e,t,n){return e.sub(t).mult(n)}static MoToCa(e,t,n){return e.div(n).add(t)}static CaToCh(e,t){var n=Math.floor(e.x/t),o=Math.floor(e.y/t);return new s.A(n,o)}static CaToCe(e,t,n){var o=Math.floor((e.x-this.CaToCh(e,t).x*t)/n),r=Math.floor((e.y-this.CaToCh(e,t).y*t)/n);return new s.A(o,r)}}},184:(e,t,n)=>{n.d(t,{A:()=>o});class s extends EventTarget{constructor(e){super();for(const t of e)this.init(t)}init(e){Object.defineProperty(this,`on${e}`,{set(t){this.on(e,t)}})}on(e,t){this.addEventListener(e,t)}emit(e,t){this.dispatchEvent(new CustomEvent(e,{detail:t}))}}const o=s},454:(e,t,n)=>{n.d(t,{A:()=>r});var s=n(184);class o extends s.A{constructor(e){super(["open","message","close"]),this.id=e.id,this.peerConnections={},this.dataChannels={}}async createOffer(e){this.peerConnections[e]=new RTCPeerConnection,this.dataChannels[e]=await this.peerConnections[e].createDataChannel(e),this.setupPeerConnection(e),this.setupDataChannel(e);const t=await this.peerConnections[e].createOffer();return await this.peerConnections[e].setLocalDescription(t),await new Promise(((t,n)=>{this.peerConnections[e].onicecandidate=n=>{t(this.peerConnections[e].localDescription)}}))}async createAnswer(e,t){this.peerConnections[e]=new RTCPeerConnection,this.peerConnections[e].addEventListener("datachannel",(t=>{this.dataChannels[e]=t.channel,this.setupDataChannel(e)})),this.setupPeerConnection(e),await this.peerConnections[e].setRemoteDescription(t);const n=await this.peerConnections[e].createAnswer();return await this.peerConnections[e].setLocalDescription(n),n}async setAnswer(e,t){await this.peerConnections[e].setRemoteDescription(t)}setupPeerConnection(e){this.peerConnections[e].addEventListener("connectionstatechange",(t=>{"disconnected"!=t.target.connectionState&&"failed"!=t.target.connectionState||this.close(e)}))}setupDataChannel(e){this.dataChannels[e].addEventListener("open",(t=>{this.emit("open",[e,t])})),this.dataChannels[e].addEventListener("message",(t=>{this.emit("message",[e,t])}))}close(e){this.peerConnections[e]&&(this.dataChannels[e].close(),this.peerConnections[e].close(),delete this.dataChannels[e],delete this.peerConnections[e])}send(e,t){this.dataChannels[e].send(JSON.stringify(t))}}const r=o},641:(e,t,n)=>{n.d(t,{A:()=>r});var s=n(184);class o extends s.A{constructor(e){super(["open","add","delete"]),this.socket=e.socket,this.rooms={},this.socket.addEventListener("message",(async e=>{const t=JSON.parse(e.data);"room"==t.url&&("open"==t.body.event?this.rooms[t.body.rid]=new Set(t.body.ids):"add"==t.body.event?this.rooms[t.body.rid].add(t.body.id):"delete"==t.body.event&&this.rooms[t.body.rid].delete(t.body.id),this.emit(t.body.event,[t.body]))}))}open(e){this.socket.send(JSON.stringify({url:"room",body:{event:"open",rid:e}}))}close(e){delete this.rooms[e],this.socket.send(JSON.stringify({url:"room",body:{event:"delete",rid:e}}))}}const r=o},649:(e,t,n)=>{n.d(t,{A:()=>s});const s=class{constructor(e){this.room=e.room,this.signalpeer=e.signalpeer,this.peers={},this.room.addEventListener("open",(e=>{const[t]=e.detail;for(const e of t.ids)this.signalpeer.peer.peerConnections[e]||(this.signalpeer.open(e),this.peers[e]=new Set),this.peers[e].add(t.rid)})),this.room.addEventListener("add",(e=>{const[t]=e.detail;this.signalpeer.peer.peerConnections[t.id]||(this.peers[t.id]=new Set),this.peers[t.id].add(t.rid)})),this.room.addEventListener("delete",(e=>{const[t]=e.detail;this.peers[t.id].delete(t.rid),0==this.peers[t.id].size&&this.signalpeer.close(t.id)}))}broadcast(e,t){for(const n of this.room.rooms[e])this.signalpeer.peer.send(n,t)}}},927:(e,t,n)=>{n.d(t,{A:()=>o});class s extends WebSocket{constructor(e){super(e.url),this.id=e.id,this.addEventListener("open",(()=>{this.send(JSON.stringify({url:"socket",body:{event:"connect",id:this.id}}))}))}}const o=s},619:(e,t,n)=>{n.d(t,{A:()=>s});const s=class{constructor(e){this.socket=e.socket,this.peer=e.peer,this.socket.addEventListener("message",(async e=>{const t=JSON.parse(e.data);if("signaling"==t.url&&"sdp"==t.body.event)if("offer"==t.body.sdp.type){const e=await this.peer.createAnswer(t.body.id,t.body.sdp);this.socket.send(JSON.stringify({url:"signaling",body:{event:"sdp",id:t.body.id,sdp:e}}))}else"answer"==t.body.sdp.type&&await this.peer.setAnswer(t.body.id,t.body.sdp)}))}async open(e){const t=await this.peer.createOffer(e);this.socket.send(JSON.stringify({url:"signaling",body:{event:"sdp",id:e,sdp:t}}))}close(e){this.peer.close(e)}}},537:(e,t,n)=>{n.d(t,{A:()=>s});class s{x;y;constructor(e,t){this.x=e,this.y=t}set(e,t){this.x=e,this.y=t}add(e){return new s(this.x+e.x,this.y+e.y)}sub(e){return new s(this.x-e.x,this.y-e.y)}mult(e){return new s(this.x*e.x,this.y*e.y)}div(e){return new s(this.x/e.x,this.y/e.y)}stringify(){return`${this.x},${this.y}`}}}},r={};function i(e){var t=r[e];if(void 0!==t)return t.exports;var n=r[e]={id:e,exports:{}};return o[e](n,n.exports,i),n.exports}e="function"==typeof Symbol?Symbol("webpack queues"):"__webpack_queues__",t="function"==typeof Symbol?Symbol("webpack exports"):"__webpack_exports__",n="function"==typeof Symbol?Symbol("webpack error"):"__webpack_error__",s=e=>{e&&e.d<1&&(e.d=1,e.forEach((e=>e.r--)),e.forEach((e=>e.r--?e.r++:e())))},i.a=(o,r,i)=>{var a;i&&((a=[]).d=-1);var c,d,l,f=new Set,h=o.exports,p=new Promise(((e,t)=>{l=t,d=e}));p[t]=h,p[e]=e=>(a&&e(a),f.forEach(e),p.catch((e=>{}))),o.exports=p,r((o=>{var r;c=(o=>o.map((o=>{if(null!==o&&"object"==typeof o){if(o[e])return o;if(o.then){var r=[];r.d=0,o.then((e=>{i[t]=e,s(r)}),(e=>{i[n]=e,s(r)}));var i={};return i[e]=e=>e(r),i}}var a={};return a[e]=e=>{},a[t]=o,a})))(o);var i=()=>c.map((e=>{if(e[n])throw e[n];return e[t]})),d=new Promise((t=>{(r=()=>t(i)).r=0;var n=e=>e!==a&&!f.has(e)&&(f.add(e),e&&!e.d&&(r.r++,e.push(r)));c.map((t=>t[e](n)))}));return r.r?d:i()}),(e=>(e?l(p[n]=e):d(h),s(a)))),a&&a.d<0&&(a.d=0)},i.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return i.d(t,{a:t}),t},i.d=(e,t)=>{for(var n in t)i.o(t,n)&&!i.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},i.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),i.nc=void 0,i(237)})();