!function(e){var t={};function n(s){if(t[s])return t[s].exports;var r=t[s]={i:s,l:!1,exports:{}};return e[s].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,s){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(n.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(s,r,function(t){return e[t]}.bind(null,r));return s},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=2)}([function(e,t,n){"use strict";try{self["workbox:precaching:5.1.4"]&&_()}catch(e){}},function(e,t,n){"use strict";try{self["workbox:core:5.1.4"]&&_()}catch(e){}},function(e,t,n){"use strict";n.r(t);n(0);const s=[],r={get:()=>s,add(e){s.push(...e)}};n(1);const c={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:"undefined"!=typeof registration?registration.scope:""},a=e=>[c.prefix,e,c.suffix].filter(e=>e&&e.length>0).join("-"),o=e=>e||a(c.precache),i=(e,...t)=>{let n=e;return t.length>0&&(n+=" :: "+JSON.stringify(t)),n};class h extends Error{constructor(e,t){super(i(e,t)),this.name=e,this.details=t}}const l=new Set;const u=(e,t)=>e.filter(e=>t in e),f=async({request:e,mode:t,plugins:n=[]})=>{const s=u(n,"cacheKeyWillBeUsed");let r=e;for(const e of s)r=await e.cacheKeyWillBeUsed.call(e,{mode:t,request:r}),"string"==typeof r&&(r=new Request(r));return r},d=async({cacheName:e,request:t,event:n,matchOptions:s,plugins:r=[]})=>{const c=await self.caches.open(e),a=await f({plugins:r,request:t,mode:"read"});let o=await c.match(a,s);for(const t of r)if("cachedResponseWillBeUsed"in t){const r=t.cachedResponseWillBeUsed;o=await r.call(t,{cacheName:e,event:n,matchOptions:s,cachedResponse:o,request:a})}return o},p=async({cacheName:e,request:t,response:n,event:s,plugins:r=[],matchOptions:c})=>{const a=await f({plugins:r,request:t,mode:"write"});if(!n)throw new h("cache-put-with-no-response",{url:(o=a.url,new URL(String(o),location.href).href.replace(new RegExp("^"+location.origin),""))});var o;const i=await(async({request:e,response:t,event:n,plugins:s=[]})=>{let r=t,c=!1;for(const t of s)if("cacheWillUpdate"in t){c=!0;const s=t.cacheWillUpdate;if(r=await s.call(t,{request:e,response:r,event:n}),!r)break}return c||(r=r&&200===r.status?r:void 0),r||null})({event:s,plugins:r,response:n,request:a});if(!i)return void 0;const p=await self.caches.open(e),y=u(r,"cacheDidUpdate"),w=y.length>0?await d({cacheName:e,matchOptions:c,request:a}):null;try{await p.put(a,i)}catch(e){throw"QuotaExceededError"===e.name&&await async function(){for(const e of l)await e()}(),e}for(const t of y)await t.cacheDidUpdate.call(t,{cacheName:e,event:s,oldResponse:w,newResponse:i,request:a})},y=async({request:e,fetchOptions:t,event:n,plugins:s=[]})=>{if("string"==typeof e&&(e=new Request(e)),n instanceof FetchEvent&&n.preloadResponse){const e=await n.preloadResponse;if(e)return e}const r=u(s,"fetchDidFail"),c=r.length>0?e.clone():null;try{for(const t of s)if("requestWillFetch"in t){const s=t.requestWillFetch,r=e.clone();e=await s.call(t,{request:r,event:n})}}catch(e){throw new h("plugin-error-request-will-fetch",{thrownError:e})}const a=e.clone();try{let r;r="navigate"===e.mode?await fetch(e):await fetch(e,t);for(const e of s)"fetchDidSucceed"in e&&(r=await e.fetchDidSucceed.call(e,{event:n,request:a,response:r}));return r}catch(e){0;for(const t of r)await t.fetchDidFail.call(t,{error:e,event:n,originalRequest:c.clone(),request:a.clone()});throw e}};let w;async function g(e,t){const n=e.clone(),s={headers:new Headers(n.headers),status:n.status,statusText:n.statusText},r=t?t(s):s,c=function(){if(void 0===w){const e=new Response("");if("body"in e)try{new Response(e.body),w=!0}catch(e){w=!1}w=!1}return w}()?n.body:await n.blob();return new Response(c,r)}function m(e){if(!e)throw new h("add-to-cache-list-unexpected-type",{entry:e});if("string"==typeof e){const t=new URL(e,location.href);return{cacheKey:t.href,url:t.href}}const{revision:t,url:n}=e;if(!n)throw new h("add-to-cache-list-unexpected-type",{entry:e});if(!t){const e=new URL(n,location.href);return{cacheKey:e.href,url:e.href}}const s=new URL(n,location.href),r=new URL(n,location.href);return s.searchParams.set("__WB_REVISION__",t),{cacheKey:s.href,url:r.href}}class R{constructor(e){this._cacheName=o(e),this._urlsToCacheKeys=new Map,this._urlsToCacheModes=new Map,this._cacheKeysToIntegrities=new Map}addToCacheList(e){const t=[];for(const n of e){"string"==typeof n?t.push(n):n&&void 0===n.revision&&t.push(n.url);const{cacheKey:e,url:s}=m(n),r="string"!=typeof n&&n.revision?"reload":"default";if(this._urlsToCacheKeys.has(s)&&this._urlsToCacheKeys.get(s)!==e)throw new h("add-to-cache-list-conflicting-entries",{firstEntry:this._urlsToCacheKeys.get(s),secondEntry:e});if("string"!=typeof n&&n.integrity){if(this._cacheKeysToIntegrities.has(e)&&this._cacheKeysToIntegrities.get(e)!==n.integrity)throw new h("add-to-cache-list-conflicting-integrities",{url:s});this._cacheKeysToIntegrities.set(e,n.integrity)}if(this._urlsToCacheKeys.set(s,e),this._urlsToCacheModes.set(s,r),t.length>0){const e=`Workbox is precaching URLs without revision info: ${t.join(", ")}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;console.warn(e)}}}async install({event:e,plugins:t}={}){const n=[],s=[],r=await self.caches.open(this._cacheName),c=await r.keys(),a=new Set(c.map(e=>e.url));for(const[e,t]of this._urlsToCacheKeys)a.has(t)?s.push(e):n.push({cacheKey:t,url:e});const o=n.map(({cacheKey:n,url:s})=>{const r=this._cacheKeysToIntegrities.get(n),c=this._urlsToCacheModes.get(s);return this._addURLToCache({cacheKey:n,cacheMode:c,event:e,integrity:r,plugins:t,url:s})});await Promise.all(o);return{updatedURLs:n.map(e=>e.url),notUpdatedURLs:s}}async activate(){const e=await self.caches.open(this._cacheName),t=await e.keys(),n=new Set(this._urlsToCacheKeys.values()),s=[];for(const r of t)n.has(r.url)||(await e.delete(r),s.push(r.url));return{deletedURLs:s}}async _addURLToCache({cacheKey:e,url:t,cacheMode:n,event:s,plugins:r,integrity:c}){const a=new Request(t,{integrity:c,cache:n,credentials:"same-origin"});let o,i=await y({event:s,plugins:r,request:a});for(const e of r||[])"cacheWillUpdate"in e&&(o=e);if(!(o?await o.cacheWillUpdate({event:s,request:a,response:i}):i.status<400))throw new h("bad-precaching-response",{url:t,status:i.status});i.redirected&&(i=await g(i)),await p({event:s,plugins:r,response:i,request:e===t?a:new Request(e),cacheName:this._cacheName,matchOptions:{ignoreSearch:!0}})}getURLsToCacheKeys(){return this._urlsToCacheKeys}getCachedURLs(){return[...this._urlsToCacheKeys.keys()]}getCacheKeyForURL(e){const t=new URL(e,location.href);return this._urlsToCacheKeys.get(t.href)}async matchPrecache(e){const t=e instanceof Request?e.url:e,n=this.getCacheKeyForURL(t);if(n){return(await self.caches.open(this._cacheName)).match(n)}}createHandler(e=!0){return async({request:t})=>{try{const e=await this.matchPrecache(t);if(e)return e;throw new h("missing-precache-entry",{cacheName:this._cacheName,url:t instanceof Request?t.url:t})}catch(n){if(e)return fetch(t);throw n}}}createHandlerBoundToURL(e,t=!0){if(!this.getCacheKeyForURL(e))throw new h("non-precached-url",{url:e});const n=this.createHandler(t),s=new Request(e);return()=>n({request:s})}}let v;const _=()=>(v||(v=new R),v);const U=(e,t)=>{const n=_().getURLsToCacheKeys();for(const s of function*(e,{ignoreURLParametersMatching:t,directoryIndex:n,cleanURLs:s,urlManipulation:r}={}){const c=new URL(e,location.href);c.hash="",yield c.href;const a=function(e,t=[]){for(const n of[...e.searchParams.keys()])t.some(e=>e.test(n))&&e.searchParams.delete(n);return e}(c,t);if(yield a.href,n&&a.pathname.endsWith("/")){const e=new URL(a.href);e.pathname+=n,yield e.href}if(s){const e=new URL(a.href);e.pathname+=".html",yield e.href}if(r){const e=r({url:c});for(const t of e)yield t.href}}(e,t)){const e=n.get(s);if(e)return e}};let L=!1;function q(e){L||((({ignoreURLParametersMatching:e=[/^utm_/],directoryIndex:t="index.html",cleanURLs:n=!0,urlManipulation:s}={})=>{const r=o();self.addEventListener("fetch",c=>{const a=U(c.request.url,{cleanURLs:n,directoryIndex:t,ignoreURLParametersMatching:e,urlManipulation:s});if(!a)return void 0;let o=self.caches.open(r).then(e=>e.match(a)).then(e=>e||fetch(a));c.respondWith(o)})})(e),L=!0)}const T=e=>{const t=_(),n=r.get();e.waitUntil(t.install({event:e,plugins:n}).catch(e=>{throw e}))},K=e=>{const t=_();e.waitUntil(t.activate())};var b;(function(e){_().addToCacheList(e),e.length>0&&(self.addEventListener("install",T),self.addEventListener("activate",K))})([{'revision':'9800deef4430f4d5683417a12942236a','url':'assets/.DS_Store'},{'revision':'cf85082e44d2344b50c7e1610252a4ff','url':'assets/audio/350984__cabled-mess__lose-c-03.mp3'},{'revision':'06c5c93c33beb31fd085354fac67a32d','url':'assets/audio/430708_juandamb_running.mp3'},{'revision':'ed8acdf095660d33111a7dd0c62ef013','url':'assets/audio/434756_notarget_wood-step-sample-1.mp3'},{'revision':'41a915643f8e272adaa03358527a345a','url':'assets/audio/click5.mp3'},{'revision':'ed26fabec1c07c4eece4e58048953213','url':'assets/audio/enter-the-box.mp3'},{'revision':'38d372667cf72cfc58ea424493166706','url':'assets/audio/enter-the-door.mp3'},{'revision':'7617adefc7b57285d08b4d520eb21769','url':'assets/audio/find-hidden.mp3'},{'revision':'42a9d1dd1083e796885b09f0f57c4289','url':'assets/audio/next-level.mp3'},{'revision':'19045d66f562991e67bf2355c5215a2a','url':'assets/fonts/AlloyInk-nRLyO.ttf'},{'revision':'7310b00c820e42548c392f6c471ab683','url':'assets/fonts/kenvector_future.ttf'},{'revision':'9d79a2ec01455afa082d23e42f457801','url':'assets/fonts/pixelFont.png'},{'revision':'38c02ad8ccaf9579150bb10d283e2b0c','url':'assets/fonts/pixelFont.xml'},{'revision':'97182b19ce422abd6fb20fb5bc73cae1','url':'assets/img/.DS_Store'},{'revision':'58aebea893e6b94bf2557d557a0dd376','url':'assets/img/background.png'},{'revision':'28757a34bc563f67924bad23d9856f8c','url':'assets/img/big-frame-button-blocked.png'},{'revision':'eb169d5b994d32caa3f056c83643b383','url':'assets/img/big-frame-button-normal.png'},{'revision':'1630f5843018172e8656d9ef8a1bdc1c','url':'assets/img/big-frame-window.png'},{'revision':'1ee30ea3869c6afe330b9acb0964c8a1','url':'assets/img/box-closed.png'},{'revision':'83e9e1f02e0b36bcf5a03e51a7788c11','url':'assets/img/box-opened.png'},{'revision':'08bd53e128068c80373397434b1eebfd','url':'assets/img/box-wrong.png'},{'revision':'8014a20c12b12017809cbb2145f908f1','url':'assets/img/circle-blue.png'},{'revision':'8cc920aa096a19f1df10a5f841b30b2a','url':'assets/img/circle-green-checkmark.png'},{'revision':'dc03d1f55822ffdeb6b8c2bbbe3dd6b9','url':'assets/img/circle-green.png'},{'revision':'81854f64ba73b7046b92b6b9d270cf6b','url':'assets/img/circle-grey.png'},{'revision':'727f68aecbd0b71464aa683776d6df4c','url':'assets/img/circle-red.png'},{'revision':'5ceeee7de70e31917413b5e928fc4b80','url':'assets/img/circle-yellow-checkmark.png'},{'revision':'9d205ff5e04f6635d1dec628c00f7a9d','url':'assets/img/circle-yellow.png'},{'revision':'ca6a3d2dcfcc23d6d8de42b9689ca511','url':'assets/img/close-button-blocked.png'},{'revision':'afb969e5b91d7fc97f7472d4d82331ff','url':'assets/img/close-button-normal.png'},{'revision':'a4fdebc1114de2fe9ba3d0b40aa6523c','url':'assets/img/config-button-blocked.png'},{'revision':'62441b31e030f21a04e6bcf08308e63f','url':'assets/img/config-button-normal.png'},{'revision':'88b5a125de1a9a7ad22d5aaddc498c37','url':'assets/img/door-closed-mid.png'},{'revision':'3c8f30b9974fe9b8674b196a56197143','url':'assets/img/door-closed-top.png'},{'revision':'f3b84cbd42ab10f8faf495a58ae07097','url':'assets/img/door-open-mid.png'},{'revision':'0647efb52619280752c9c0971d19f00d','url':'assets/img/door-open-top.png'},{'revision':'a57ba0ef389b8d15a7b5d61b69c41eeb','url':'assets/img/empty-button-blocked.png'},{'revision':'553d867bc356ff97605001c4bea503f6','url':'assets/img/empty-button-normal.png'},{'revision':'83c4de9cea058c2244e6abba8ba59692','url':'assets/img/finger-point-gesture.png'},{'revision':'913713d51058ac05d204bbd832b6e079','url':'assets/img/frame-char-dialog.png'},{'revision':'16b8b7c0b7f50f57e71d6ca303079b93','url':'assets/img/frame-skill-item-selected.png'},{'revision':'fac2a1fef99c62f7bc53076e8e6f2d7e','url':'assets/img/frame-skill-item-selected1.png'},{'revision':'0cd095b64f29f856cfff50188b04e8b6','url':'assets/img/frame-skill-item.png'},{'revision':'7cc3fe29bd54573ca8134cb974ecc4a7','url':'assets/img/gem-score.png'},{'revision':'31f9d18dff5f7b7bad3b8aff87419b71','url':'assets/img/home-button-blocked.png'},{'revision':'72962b86d9d29e11da536f999cda6ff7','url':'assets/img/home-button-normal.png'},{'revision':'61c79099256c43d26b81117ac5ac0e85','url':'assets/img/icon-checked.png'},{'revision':'0be9d8355ad14ba748057ccf725e6b52','url':'assets/img/icon-x.png'},{'revision':'6d7feed2494fbe2a7aa09fd7da1d14cb','url':'assets/img/info-button-blocked.png'},{'revision':'0d9f572e466d7d7e37700126f8c11720','url':'assets/img/info-button-normal.png'},{'revision':'58f30086c7bfd773028435585b4efa1e','url':'assets/img/left-button-blocked.png'},{'revision':'1791dd1bb9324c933e8b60225cc44819','url':'assets/img/left-button-normal.png'},{'revision':'b906883cb22d12edd8dcf4af833e5789','url':'assets/img/level-button-blocked.png'},{'revision':'6c6fb23a7496c3a2e69db3dd559f6ff2','url':'assets/img/level-button-normal.png'},{'revision':'d8241eec83b171c63f5f7e4a7a99e15d','url':'assets/img/level-complete-dialog.png'},{'revision':'d01b3836f1a3b9d251e541c6a3f00952','url':'assets/img/pause-button-blocked.png'},{'revision':'3f6265710072a949b0eedfbaaa039ed1','url':'assets/img/pause-button-normal.png'},{'revision':'b887c333d5ec8274b78d0851e7b3337b','url':'assets/img/phaser-logo.png'},{'revision':'fc5140affee1373c5e2bdbe9065b98c4','url':'assets/img/restart-button-blocked.png'},{'revision':'07329717dc4401ba9334174fc815b38d','url':'assets/img/restart-button-normal.png'},{'revision':'b7187d7b274587d708f29decacbb09b5','url':'assets/img/right-button-blocked.png'},{'revision':'b76c894f8fd8e72bd585b12fab01737c','url':'assets/img/right-button-normal.png'},{'revision':'fa5526600d5ec12b1c9928dcf66a7dbb','url':'assets/img/round-indicator-inactive.png'},{'revision':'fb43e16ccae92fd74ce75aac7f3cb25d','url':'assets/img/round-indicator-normal.png'},{'revision':'ec08e4a9fac2dfc90eb40cb70b5302f4','url':'assets/img/round_nodetailsOutline.png'},{'revision':'1167abaa56c1676e9f8fc3d3ccf7e20f','url':'assets/img/round_nodetailsOutline.xml'},{'revision':'5587cf9852c0a554af9a39ea992af989','url':'assets/img/sign-exit.png'},{'revision':'7b67e911ff32cc1c7c812126d843f885','url':'assets/img/skill-gem-cost.png'},{'revision':'79a9cc3b3d13811172541fa52c97616e','url':'assets/img/skill-item-box-inactive.png'},{'revision':'a074d5db3889cbab6496b0862975ee56','url':'assets/img/skill-item-box.png'},{'revision':'7d2aaf5b54ab8e278143775c3df7ba1f','url':'assets/img/skill-item-key-inactive.png'},{'revision':'27f6cfb036be6ce70c0ad49f74910300','url':'assets/img/skill-item-key.png'},{'revision':'4068702d967b5d3c13fbe986bc37d40b','url':'assets/img/skill-item-spot-shadow.png'},{'revision':'befe66ec712a154cde64b37815700725','url':'assets/img/skill-item-star-inactive.png'},{'revision':'e7b75d34946bfc6fe1f733610db85a9b','url':'assets/img/skill-item-star.png'},{'revision':'f47b2a29d48f978dba91ca062bd13be2','url':'assets/img/small-frame-level.png'},{'revision':'a24093af533b7e1825acee4b10aee2e6','url':'assets/img/small-frame-window.png'},{'revision':'d34235d280e3de39bb505c839456de28','url':'assets/img/small-frame.png'},{'revision':'f58917975ff499930892b6a3c4ec797e','url':'assets/img/sokoban_tilesheet.png'},{'revision':'a33662dbdb4d313819cb125ca4008e52','url':'assets/img/sound-bg-button-blocked.png'},{'revision':'62022c0a66babc0f21a634ce8b70caa8','url':'assets/img/sound-bg-button-inactive.png'},{'revision':'305c655cb98066e4c2e7531b2296518c','url':'assets/img/sound-bg-button-normal.png'},{'revision':'074ce476d0cbc10bf25c32bac39f1c93','url':'assets/img/sound-button-blocked.png'},{'revision':'2626ef7e2a35cea3d7daa93261649466','url':'assets/img/sound-button-inactive.png'},{'revision':'7935fce256b559279e1e9d27e1d40bac','url':'assets/img/sound-button-normal.png'},{'revision':'7c945329d06675937dbfc6c9bba8b770','url':'assets/img/stars-one.png'},{'revision':'483b4a827ae2feee521e6fdecf14bbfa','url':'assets/img/stars-three.png'},{'revision':'a4656ecb3939976d79bef2bdc556b4af','url':'assets/img/stars-two.png'},{'revision':'b32dc5be6b18f6bc2d43facc4b85dcf5','url':'assets/img/stars-zero.png'},{'revision':'526e047f8c723facd5b03eaa1364fc64','url':'assets/img/world/.DS_Store'},{'revision':'194577a7e20bdcc7afbb718f502c134c','url':'assets/img/world/world-2/.DS_Store'},{'revision':'06ef61c867153d63ec4a5116dfb6daeb','url':'assets/img/world/world-2/dirt-bottom.png'},{'revision':'9e244761d57fa1a3d550fc2536478779','url':'assets/img/world/world-2/dirt-left-bottom.png'},{'revision':'be9031a643701b4216bc4fd28add7f36','url':'assets/img/world/world-2/dirt-left-top.png'},{'revision':'efa7493f8ad40f45f50a9ece4af9baec','url':'assets/img/world/world-2/dirt-left.png'},{'revision':'32241682837db86dfdccab5c01484c09','url':'assets/img/world/world-2/dirt-right-bottom.png'},{'revision':'e14c013317f12aface50e71ab9b9ee1b','url':'assets/img/world/world-2/dirt-right-top.png'},{'revision':'d263baf51879b556b0610dabf9ed21dd','url':'assets/img/world/world-2/dirt-right.png'},{'revision':'4c7488fe7d727c5f3f0f610e1d1036ad','url':'assets/img/world/world-2/dirt-top-right.png'},{'revision':'a8874908bca2d692bdca1177d2d03e7f','url':'assets/img/world/world-2/dirt-top.png'},{'revision':'5ea83d551b5af503458746fe5f2fde92','url':'assets/img/world/world-2/flower-six-points.png'},{'revision':'65884f266d2e93117bf6d7c06faec44c','url':'assets/img/world/world-2/flower-three-points.png'},{'revision':'37b6772246e07458e8d69eecffaeb279','url':'assets/img/world/world-2/grass-top-left.png'},{'revision':'ea57c958ceab23ae4a72e737a0d8b11f','url':'assets/img/world/world-2/grass-top-right.png'},{'revision':'5a2c1d382d05c8c86c82f72f1462362f','url':'assets/img/world/world-2/grass.png'},{'revision':'e844e3a1810b72b2bbe31b4cfe946ad6','url':'assets/img/world/world-2/path-dirt.png'},{'revision':'7dd7379118109d3b0efc6119c5a6e456','url':'assets/img/world/world-2/rock-big.png'},{'revision':'2f94eb85e93b6eafe0983c73dcfb3758','url':'assets/img/world/world-2/rock-small.png'},{'revision':'47f5afa526254d2eb3d13a51cbba7cc4','url':'assets/img/world/world-2/rock-tiny.png'},{'revision':'de5f6d3ff547345fbfeba110c847df26','url':'assets/img/world/world-2/tree-big.png'},{'revision':'a1dadf2953243d60b0549c79db8440a3','url':'assets/img/world/world-2/tree-tiny.png'},{'revision':'57040e5677322118f6d56a1d9e43c5c6','url':'favicon.ico'},{'revision':'2ffbc23293ee8a797bc61e9c02534206','url':'icons/icons-192.png'},{'revision':'8bdcc486cda9b423f50e886f2ddb6604','url':'icons/icons-512.png'},{'revision':'d7f51643768116de91fdf1e73c214af8','url':'index.html'},{'revision':'6c6f3cbd2004e90996fb33363acaab22','url':'main.fd9f5653b4fdca3b7ea4.bundle.js'},{'revision':'4c39eadd66ca0fec868fdc018e647003','url':'manifest.json'},{'revision':'7d8a1168a8c68004d2bded5256ade8bc','url':'vendors.570b62c61f41f8b4d166.bundle.js'}]),q(b)}]);