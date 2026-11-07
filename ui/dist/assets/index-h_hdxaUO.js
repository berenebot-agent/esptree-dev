const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./install-dialog-Cis2fojf.js","./index-CGvrLfvp.js"])))=>i.map(i=>d[i]);
(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function i(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(r){if(r.ep)return;r.ep=!0;const n=i(r);fetch(r.href,n)}})();/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const hn=globalThis,pl=hn.ShadowRoot&&(hn.ShadyCSS===void 0||hn.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,gl=Symbol(),bh=new WeakMap;let Nd=class{constructor(e,i,s){if(this._$cssResult$=!0,s!==gl)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=i}get styleSheet(){let e=this.o;const i=this.t;if(pl&&e===void 0){const s=i!==void 0&&i.length===1;s&&(e=bh.get(i)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&bh.set(i,e))}return e}toString(){return this.cssText}};const cg=t=>new Nd(typeof t=="string"?t:t+"",void 0,gl),de=(t,...e)=>{const i=t.length===1?t[0]:e.reduce((s,r,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+t[n+1],t[0]);return new Nd(i,t,gl)},dg=(t,e)=>{if(pl)t.adoptedStyleSheets=e.map(i=>i instanceof CSSStyleSheet?i:i.styleSheet);else for(const i of e){const s=document.createElement("style"),r=hn.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=i.cssText,t.appendChild(s)}},vh=pl?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let i="";for(const s of e.cssRules)i+=s.cssText;return cg(i)})(t):t;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:ug,defineProperty:fg,getOwnPropertyDescriptor:pg,getOwnPropertyNames:gg,getOwnPropertySymbols:mg,getPrototypeOf:bg}=Object,hi=globalThis,yh=hi.trustedTypes,vg=yh?yh.emptyScript:"",So=hi.reactiveElementPolyfillSupport,js=(t,e)=>t,xn={toAttribute(t,e){switch(e){case Boolean:t=t?vg:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=t!==null;break;case Number:i=t===null?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch{i=null}}return i}},ml=(t,e)=>!ug(t,e),xh={attribute:!0,type:String,converter:xn,reflect:!1,useDefault:!1,hasChanged:ml};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),hi.litPropertyMetadata??(hi.litPropertyMetadata=new WeakMap);let ts=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,i=xh){if(i.state&&(i.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((i=Object.create(i)).wrapped=!0),this.elementProperties.set(e,i),!i.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(e,s,i);r!==void 0&&fg(this.prototype,e,r)}}static getPropertyDescriptor(e,i,s){const{get:r,set:n}=pg(this.prototype,e)??{get(){return this[i]},set(o){this[i]=o}};return{get:r,set(o){const a=r==null?void 0:r.call(this);n==null||n.call(this,o),this.requestUpdate(e,a,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??xh}static _$Ei(){if(this.hasOwnProperty(js("elementProperties")))return;const e=bg(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(js("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(js("properties"))){const i=this.properties,s=[...gg(i),...mg(i)];for(const r of s)this.createProperty(r,i[r])}const e=this[Symbol.metadata];if(e!==null){const i=litPropertyMetadata.get(e);if(i!==void 0)for(const[s,r]of i)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[i,s]of this.elementProperties){const r=this._$Eu(i,s);r!==void 0&&this._$Eh.set(r,i)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const i=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const r of s)i.unshift(vh(r))}else e!==void 0&&i.push(vh(e));return i}static _$Eu(e,i){const s=i.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(i=>this.enableUpdating=i),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(i=>i(this))}addController(e){var i;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((i=e.hostConnected)==null||i.call(e))}removeController(e){var i;(i=this._$EO)==null||i.delete(e)}_$E_(){const e=new Map,i=this.constructor.elementProperties;for(const s of i.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return dg(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(i=>{var s;return(s=i.hostConnected)==null?void 0:s.call(i)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(i=>{var s;return(s=i.hostDisconnected)==null?void 0:s.call(i)})}attributeChangedCallback(e,i,s){this._$AK(e,s)}_$ET(e,i){var n;const s=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,s);if(r!==void 0&&s.reflect===!0){const o=(((n=s.converter)==null?void 0:n.toAttribute)!==void 0?s.converter:xn).toAttribute(i,s.type);this._$Em=e,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(e,i){var n,o;const s=this.constructor,r=s._$Eh.get(e);if(r!==void 0&&this._$Em!==r){const a=s.getPropertyOptions(r),l=typeof a.converter=="function"?{fromAttribute:a.converter}:((n=a.converter)==null?void 0:n.fromAttribute)!==void 0?a.converter:xn;this._$Em=r;const h=l.fromAttribute(i,a.type);this[r]=h??((o=this._$Ej)==null?void 0:o.get(r))??h,this._$Em=null}}requestUpdate(e,i,s,r=!1,n){var o;if(e!==void 0){const a=this.constructor;if(r===!1&&(n=this[e]),s??(s=a.getPropertyOptions(e)),!((s.hasChanged??ml)(n,i)||s.useDefault&&s.reflect&&n===((o=this._$Ej)==null?void 0:o.get(e))&&!this.hasAttribute(a._$Eu(e,s))))return;this.C(e,i,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,i,{useDefault:s,reflect:r,wrapped:n},o){s&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,o??i??this[e]),n!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(i=void 0),this._$AL.set(e,i)),r===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(i){Promise.reject(i)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[n,o]of r){const{wrapped:a}=o,l=this[n];a!==!0||this._$AL.has(n)||l===void 0||this.C(n,void 0,o,l)}}let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),(s=this._$EO)==null||s.forEach(r=>{var n;return(n=r.hostUpdate)==null?void 0:n.call(r)}),this.update(i)):this._$EM()}catch(r){throw e=!1,this._$EM(),r}e&&this._$AE(i)}willUpdate(e){}_$AE(e){var i;(i=this._$EO)==null||i.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(i=>this._$ET(i,this[i]))),this._$EM()}updated(e){}firstUpdated(e){}};ts.elementStyles=[],ts.shadowRootOptions={mode:"open"},ts[js("elementProperties")]=new Map,ts[js("finalized")]=new Map,So==null||So({ReactiveElement:ts}),(hi.reactiveElementVersions??(hi.reactiveElementVersions=[])).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Qs=globalThis,wh=t=>t,wn=Qs.trustedTypes,kh=wn?wn.createPolicy("lit-html",{createHTML:t=>t}):void 0,Ud="$lit$",ri=`lit$${Math.random().toFixed(9).slice(2)}$`,Hd="?"+ri,yg=`<${Hd}>`,qi=document,sr=()=>qi.createComment(""),rr=t=>t===null||typeof t!="object"&&typeof t!="function",bl=Array.isArray,xg=t=>bl(t)||typeof(t==null?void 0:t[Symbol.iterator])=="function",Co=`[ 	
\f\r]`,Is=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Sh=/-->/g,Ch=/>/g,Oi=RegExp(`>|${Co}(?:([^\\s"'>=/]+)(${Co}*=${Co}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),$h=/'/g,Oh=/"/g,Wd=/^(?:script|style|textarea|title)$/i,zd=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),p=zd(1),q=zd(2),xs=Symbol.for("lit-noChange"),v=Symbol.for("lit-nothing"),Ah=new WeakMap,Di=qi.createTreeWalker(qi,129);function qd(t,e){if(!bl(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return kh!==void 0?kh.createHTML(e):e}const wg=(t,e)=>{const i=t.length-1,s=[];let r,n=e===2?"<svg>":e===3?"<math>":"",o=Is;for(let a=0;a<i;a++){const l=t[a];let h,c,d=-1,u=0;for(;u<l.length&&(o.lastIndex=u,c=o.exec(l),c!==null);)u=o.lastIndex,o===Is?c[1]==="!--"?o=Sh:c[1]!==void 0?o=Ch:c[2]!==void 0?(Wd.test(c[2])&&(r=RegExp("</"+c[2],"g")),o=Oi):c[3]!==void 0&&(o=Oi):o===Oi?c[0]===">"?(o=r??Is,d=-1):c[1]===void 0?d=-2:(d=o.lastIndex-c[2].length,h=c[1],o=c[3]===void 0?Oi:c[3]==='"'?Oh:$h):o===Oh||o===$h?o=Oi:o===Sh||o===Ch?o=Is:(o=Oi,r=void 0);const f=o===Oi&&t[a+1].startsWith("/>")?" ":"";n+=o===Is?l+yg:d>=0?(s.push(h),l.slice(0,d)+Ud+l.slice(d)+ri+f):l+ri+(d===-2?a:f)}return[qd(t,n+(t[i]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]};class nr{constructor({strings:e,_$litType$:i},s){let r;this.parts=[];let n=0,o=0;const a=e.length-1,l=this.parts,[h,c]=wg(e,i);if(this.el=nr.createElement(h,s),Di.currentNode=this.el.content,i===2||i===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(r=Di.nextNode())!==null&&l.length<a;){if(r.nodeType===1){if(r.hasAttributes())for(const d of r.getAttributeNames())if(d.endsWith(Ud)){const u=c[o++],f=r.getAttribute(d).split(ri),g=/([.?@])?(.*)/.exec(u);l.push({type:1,index:n,name:g[2],strings:f,ctor:g[1]==="."?Sg:g[1]==="?"?Cg:g[1]==="@"?$g:no}),r.removeAttribute(d)}else d.startsWith(ri)&&(l.push({type:6,index:n}),r.removeAttribute(d));if(Wd.test(r.tagName)){const d=r.textContent.split(ri),u=d.length-1;if(u>0){r.textContent=wn?wn.emptyScript:"";for(let f=0;f<u;f++)r.append(d[f],sr()),Di.nextNode(),l.push({type:2,index:++n});r.append(d[u],sr())}}}else if(r.nodeType===8)if(r.data===Hd)l.push({type:2,index:n});else{let d=-1;for(;(d=r.data.indexOf(ri,d+1))!==-1;)l.push({type:7,index:n}),d+=ri.length-1}n++}}static createElement(e,i){const s=qi.createElement("template");return s.innerHTML=e,s}}function ws(t,e,i=t,s){var o,a;if(e===xs)return e;let r=s!==void 0?(o=i._$Co)==null?void 0:o[s]:i._$Cl;const n=rr(e)?void 0:e._$litDirective$;return(r==null?void 0:r.constructor)!==n&&((a=r==null?void 0:r._$AO)==null||a.call(r,!1),n===void 0?r=void 0:(r=new n(t),r._$AT(t,i,s)),s!==void 0?(i._$Co??(i._$Co=[]))[s]=r:i._$Cl=r),r!==void 0&&(e=ws(t,r._$AS(t,e.values),r,s)),e}class kg{constructor(e,i){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:i},parts:s}=this._$AD,r=((e==null?void 0:e.creationScope)??qi).importNode(i,!0);Di.currentNode=r;let n=Di.nextNode(),o=0,a=0,l=s[0];for(;l!==void 0;){if(o===l.index){let h;l.type===2?h=new Or(n,n.nextSibling,this,e):l.type===1?h=new l.ctor(n,l.name,l.strings,this,e):l.type===6&&(h=new Og(n,this,e)),this._$AV.push(h),l=s[++a]}o!==(l==null?void 0:l.index)&&(n=Di.nextNode(),o++)}return Di.currentNode=qi,r}p(e){let i=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,i),i+=s.strings.length-2):s._$AI(e[i])),i++}}class Or{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,i,s,r){this.type=2,this._$AH=v,this._$AN=void 0,this._$AA=e,this._$AB=i,this._$AM=s,this.options=r,this._$Cv=(r==null?void 0:r.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const i=this._$AM;return i!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=i.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,i=this){e=ws(this,e,i),rr(e)?e===v||e==null||e===""?(this._$AH!==v&&this._$AR(),this._$AH=v):e!==this._$AH&&e!==xs&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):xg(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==v&&rr(this._$AH)?this._$AA.nextSibling.data=e:this.T(qi.createTextNode(e)),this._$AH=e}$(e){var n;const{values:i,_$litType$:s}=e,r=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=nr.createElement(qd(s.h,s.h[0]),this.options)),s);if(((n=this._$AH)==null?void 0:n._$AD)===r)this._$AH.p(i);else{const o=new kg(r,this),a=o.u(this.options);o.p(i),this.T(a),this._$AH=o}}_$AC(e){let i=Ah.get(e.strings);return i===void 0&&Ah.set(e.strings,i=new nr(e)),i}k(e){bl(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,r=0;for(const n of e)r===i.length?i.push(s=new Or(this.O(sr()),this.O(sr()),this,this.options)):s=i[r],s._$AI(n),r++;r<i.length&&(this._$AR(s&&s._$AB.nextSibling,r),i.length=r)}_$AR(e=this._$AA.nextSibling,i){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,i);e!==this._$AB;){const r=wh(e).nextSibling;wh(e).remove(),e=r}}setConnected(e){var i;this._$AM===void 0&&(this._$Cv=e,(i=this._$AP)==null||i.call(this,e))}}class no{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,i,s,r,n){this.type=1,this._$AH=v,this._$AN=void 0,this.element=e,this.name=i,this._$AM=r,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=v}_$AI(e,i=this,s,r){const n=this.strings;let o=!1;if(n===void 0)e=ws(this,e,i,0),o=!rr(e)||e!==this._$AH&&e!==xs,o&&(this._$AH=e);else{const a=e;let l,h;for(e=n[0],l=0;l<n.length-1;l++)h=ws(this,a[s+l],i,l),h===xs&&(h=this._$AH[l]),o||(o=!rr(h)||h!==this._$AH[l]),h===v?e=v:e!==v&&(e+=(h??"")+n[l+1]),this._$AH[l]=h}o&&!r&&this.j(e)}j(e){e===v?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class Sg extends no{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===v?void 0:e}}class Cg extends no{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==v)}}class $g extends no{constructor(e,i,s,r,n){super(e,i,s,r,n),this.type=5}_$AI(e,i=this){if((e=ws(this,e,i,0)??v)===xs)return;const s=this._$AH,r=e===v&&s!==v||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,n=e!==v&&(s===v||r);r&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var i;typeof this._$AH=="function"?this._$AH.call(((i=this.options)==null?void 0:i.host)??this.element,e):this._$AH.handleEvent(e)}}class Og{constructor(e,i,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){ws(this,e)}}const $o=Qs.litHtmlPolyfillSupport;$o==null||$o(nr,Or),(Qs.litHtmlVersions??(Qs.litHtmlVersions=[])).push("3.3.2");const Ag=(t,e,i)=>{const s=(i==null?void 0:i.renderBefore)??e;let r=s._$litPart$;if(r===void 0){const n=(i==null?void 0:i.renderBefore)??null;s._$litPart$=r=new Or(e.insertBefore(sr(),n),n,void 0,i??{})}return r._$AI(t),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Fi=globalThis;let pe=class extends ts{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var i;const e=super.createRenderRoot();return(i=this.renderOptions).renderBefore??(i.renderBefore=e.firstChild),e}update(e){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Ag(i,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return xs}};var Fd;pe._$litElement$=!0,pe.finalized=!0,(Fd=Fi.litElementHydrateSupport)==null||Fd.call(Fi,{LitElement:pe});const Oo=Fi.litElementPolyfillSupport;Oo==null||Oo({LitElement:pe});(Fi.litElementVersions??(Fi.litElementVersions=[])).push("4.2.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Se=t=>(e,i)=>{i!==void 0?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Pg={attribute:!0,type:String,converter:xn,reflect:!1,hasChanged:ml},Tg=(t=Pg,e,i)=>{const{kind:s,metadata:r}=i;let n=globalThis.litPropertyMetadata.get(r);if(n===void 0&&globalThis.litPropertyMetadata.set(r,n=new Map),s==="setter"&&((t=Object.create(t)).wrapped=!0),n.set(i.name,t),s==="accessor"){const{name:o}=i;return{set(a){const l=e.get.call(this);e.set.call(this,a),this.requestUpdate(o,l,t,!0,a)},init(a){return a!==void 0&&this.C(o,void 0,t,a),a}}}if(s==="setter"){const{name:o}=i;return function(a){const l=this[o];e.call(this,a),this.requestUpdate(o,l,t,!0,a)}}throw Error("Unsupported decorator location: "+s)};function ie(t){return(e,i)=>typeof i=="object"?Tg(t,e,i):((s,r,n)=>{const o=r.hasOwnProperty(n);return r.constructor.createProperty(n,s),o?Object.getOwnPropertyDescriptor(r,n):void 0})(t,e,i)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function b(t){return ie({...t,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Mg=(t,e,i)=>(i.configurable=!0,i.enumerable=!0,Reflect.decorate&&typeof e!="object"&&Object.defineProperty(t,e,i),i);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function vl(t,e){return(i,s,r)=>{const n=o=>{var a;return((a=o.renderRoot)==null?void 0:a.querySelector(t))??null};return Mg(i,s,{get(){return n(this)}})}}const Eg=(()=>{const t=document.querySelector('meta[name="x-ingress-path"]');return t&&t.getAttribute("content")?t.getAttribute("content").replace(/\/+$/,""):""})(),_g=15e3,Dg=3e4;let Ir=null,Ao=null;function Et(t){const e=Eg||"";return t.startsWith("/")?e+t:e+"/"+t}function Bg(t,e){if(!t)return null;if(e!=null&&e.includes("application/json"))return JSON.parse(t);try{return JSON.parse(t)}catch{return t}}async function M(t,e){const i=new AbortController,s=setTimeout(()=>i.abort("timeout"),_g);try{const r=await fetch(Et(t),{...e,signal:i.signal,headers:(e==null?void 0:e.body)instanceof FormData?e.headers:{"Content-Type":"application/json",...(e==null?void 0:e.headers)||{}}});clearTimeout(s);const n=await r.text(),o=Bg(n,r.headers.get("content-type"));if(!r.ok){let a=`${r.status} ${r.statusText}`;if(o&&typeof o=="object"){const l=o,h=l.detail,c=l.error;typeof h=="string"&&h?a=h:typeof c=="string"&&c&&(a=c)}else typeof o=="string"&&o&&(a=o);throw new Error(a)}return o}catch(r){if(clearTimeout(s),r instanceof DOMException&&r.name==="AbortError"){const n=i.signal.reason;throw new Error(n==="timeout"?"timeout":"cancelled")}throw r}}const S={config:()=>M("/api/config"),updateConfig:t=>M("/api/config",{method:"PUT",body:JSON.stringify(t)}),discoverBridges:()=>M("/api/bridge/discover").then(t=>Array.isArray(t)?{bridges:t,scanning:!0}:{bridges:t.bridges??[],scanning:!!t.scanning}),triggerScan:()=>M("/api/bridge/scan",{method:"POST"}),getScanLog:()=>M("/api/bridge/scan-log"),getBridges:()=>M("/api/bridges"),scanSerialPorts:()=>M("/api/serial/ports").then(t=>t.ports),addBridge:(t,e=80,i,s,r,n="wifi",o,a=460800)=>M("/api/bridges",{method:"POST",body:JSON.stringify({host:t,port:e,name:i,api_key:s,hostname:r,transport:n,serial_port:o,baud:a})}),updateBridge:(t,e,i,s,r,n)=>M(`/api/bridges/${t}`,{method:"PUT",body:JSON.stringify({name:e,host:i,port:s,api_key:r,ota_password:n})}),bridgeFirmware:t=>M(`/api/bridges/${t}/firmware`),updateBridgeFirmware:t=>M(`/api/bridges/${t}/firmware-update`,{method:"POST"}),bridgeFirmwareLogsUrl:t=>Et(`/api/bridges/${t}/firmware-update/logs`),deleteBridge:t=>M(`/api/bridges/${t}`,{method:"DELETE"}),activateBridge:t=>M(`/api/bridges/${t}/activate`,{method:"PUT"}),deactivateBridge:t=>M(`/api/bridges/${t}/deactivate`,{method:"PUT"}),bridgeReconnect:t=>M(`/api/bridges/${t}/reconnect`,{method:"POST"}),selectBridge:(t,e,i,s,r,n,o)=>M("/api/bridge/select",{method:"POST",body:JSON.stringify({host:t,port:e,name:i,version:s,api_key:r,network_id:n,hostname:o})}),topology:(t=!1)=>{const e=Date.now();return!t&&Ir&&e-Ir.ts<Dg?Promise.resolve(Ir.data):M("/api/bridge/topology.json").then(i=>(Ir={data:i,ts:e},i))},hideDevice:t=>M(`/api/topology/hide/${encodeURIComponent(t)}`,{method:"DELETE"}),removeRemote:t=>M(`/api/topology/remote/${encodeURIComponent(t)}`,{method:"DELETE"}),unhideDevice:t=>M(`/api/topology/unhide/${encodeURIComponent(t)}`,{method:"POST"}),devices:()=>M("/api/devices"),device:t=>M(`/api/devices/${encodeURIComponent(t)}`),currentOta:()=>M("/api/ota/current"),currentOtaForDevice:t=>M(`/api/ota/current?mac=${encodeURIComponent(t)}`),uploadFirmware:(t,e)=>{const i=new FormData;return i.set("mac",t),i.set("file",e),M("/api/ota/upload",{method:"POST",body:i})},startOta:t=>M(`/api/ota/start/${t}`,{method:"POST"}),abortOta:()=>M("/api/ota/abort",{method:"POST"}),cancelPending:t=>M(`/api/ota/pending/${t}`,{method:"DELETE"}),getQueue:()=>M("/api/ota/queue"),getQueuePaused:()=>M("/api/ota/queue/paused"),pauseQueue:()=>M("/api/ota/queue/pause",{method:"POST"}),resumeQueue:()=>M("/api/ota/queue/resume",{method:"POST"}),abortQueuedJob:t=>M(`/api/ota/queue/${t}/abort`,{method:"POST"}),reorderJobUp:t=>M(`/api/ota/queue/${t}/up`,{method:"POST"}),reorderJobDown:t=>M(`/api/ota/queue/${t}/down`,{method:"POST"}),history:t=>M(`/api/ota/history/${encodeURIComponent(t)}`),jobLog:t=>M(`/api/ota/jobs/${t}/log`),retained:()=>M("/api/firmware/retained"),reflash:t=>M(`/api/ota/reflash/${t}`,{method:"POST"}),deleteRetained:t=>M(`/api/firmware/retained/${t}`,{method:"DELETE"}),getConfig:t=>M(`/api/devices/${encodeURIComponent(t)}/config`),saveConfig:(t,e,i)=>M(`/api/devices/${encodeURIComponent(t)}/config`,{method:"PUT",body:JSON.stringify({content:e,scaffold:i})}),deleteConfig:t=>M(`/api/devices/${encodeURIComponent(t)}/config`,{method:"DELETE"}),checkSecrets:t=>M("/api/secrets/check",{method:"POST",body:JSON.stringify({content:t})}),importConfig:(t,e)=>{if(typeof e=="string")return M(`/api/devices/${encodeURIComponent(t)}/config/import`,{method:"POST",body:JSON.stringify({content:e})});const i=new FormData;return i.set("file",e),M(`/api/devices/${encodeURIComponent(t)}/config/import`,{method:"POST",body:i})},getConfigStatus:t=>M(`/api/devices/${encodeURIComponent(t)}/config/status`),compileDevice:(t,e=!1)=>{const i=e?"?auto_flash=true":"";return M(`/api/devices/${encodeURIComponent(t)}/compile${i}`,{method:"POST"})},getCompileStatus:t=>M(`/api/devices/${encodeURIComponent(t)}/compile/status`),cancelCompile:t=>M(`/api/devices/${encodeURIComponent(t)}/compile/cancel`,{method:"POST"}),startCompileFlash:t=>M(`/api/devices/${encodeURIComponent(t)}/compile/start-flash`,{method:"POST"}),getCompileHistory:t=>M(`/api/devices/${encodeURIComponent(t)}/compile/history`),rebootDevice:t=>M(`/api/devices/${encodeURIComponent(t)}/reboot`,{method:"POST"}),setHeartbeatInterval:(t,e)=>M(`/api/devices/${encodeURIComponent(t)}/heartbeat`,{method:"POST",body:JSON.stringify({interval_seconds:e})}),forceRediscover:t=>M(`/api/devices/${encodeURIComponent(t)}/rediscover`,{method:"POST"}),setParentMac:(t,e,i=!0)=>M(`/api/devices/${encodeURIComponent(t)}/parent`,{method:"POST",body:JSON.stringify({parent_mac:e,clear:i})}),setRelay:(t,e)=>M(`/api/devices/${encodeURIComponent(t)}/relay`,{method:"POST",body:JSON.stringify({enable:e})}),getCompileQueue:()=>M("/api/compile/queue"),getCompileHistoryAll:(t=100)=>M(`/api/compile/history?limit=${t}`),abortCompileJob:t=>M(`/api/compile/queue/${t}/abort`,{method:"POST"}),getAllHistory:async(t=100)=>{const[e,i]=await Promise.all([M(`/api/ota/history?limit=${t}`),M(`/api/compile/history?limit=${t}`)]),s=[...e.jobs,...i.jobs];return s.sort((r,n)=>(n.created_at??0)-(r.created_at??0)),{jobs:s.slice(0,t)}},getSecrets:()=>M("/api/secrets"),getChips:()=>M("/api/chips"),getBridgeNetworkCredentials:()=>M("/api/bridge/network-credentials"),saveSecrets:t=>M("/api/secrets",{method:"PUT",body:JSON.stringify({content:t})}),getContainerStatus:()=>M("/api/compile/container/status"),cleanArtifacts:()=>M("/api/compile/artifacts",{method:"DELETE"}),getSerialPorts:()=>M("/api/serial/ports"),startSerialFlash:(t,e)=>M(`/api/devices/${encodeURIComponent(t)}/flash/serial`,{method:"POST",body:JSON.stringify({port:e})}),getSerialFlashStatus:t=>M(`/api/devices/${encodeURIComponent(t)}/flash/serial/status`),cancelSerialFlash:t=>M(`/api/devices/${encodeURIComponent(t)}/flash/serial/cancel`,{method:"POST"}),restartRequired:()=>M("/api/restart-required"),requestRestart:()=>M("/api/restart",{method:"POST"}),setupStatus:()=>M("/api/setup-status"),integrationSetup:()=>M("/api/integration/setup",{method:"POST"}),detectChip:t=>M("/api/bridge/flash-wizard/detect-chip",{method:"POST",body:JSON.stringify({port:t})}),submitFlashWizard:t=>M("/api/bridge/flash-wizard/submit",{method:"POST",body:JSON.stringify(t)}),getFlashWizardStatus:()=>M("/api/bridge/flash-wizard/status"),finalizeFlashWizard:()=>M("/api/bridge/flash-wizard/finalize",{method:"POST"}),streamCompileLogs(t,e,i){const s=Et(`/api/devices/${encodeURIComponent(t)}/compile/logs`),r=new EventSource(s);return r.onmessage=n=>{e(n.data)},r.addEventListener("status",n=>{e(`[status: ${n.data}]`)}),r.addEventListener("exit",n=>{e(`[build exited with code ${n.data}]`)}),r.addEventListener("queue_position",n=>{e(`[queue position: ${n.data}]`)}),r.onerror=i,r},streamSerialFlashLogs(t,e,i,s){const r=Et(`/api/devices/${encodeURIComponent(t)}/flash/serial/logs`),n=new EventSource(r);return n.onmessage=o=>{e(o.data)},n.addEventListener("status",o=>{i(o.data)}),n.onerror=s,n},downloadFactoryBinary(t){return Et(`/api/devices/${encodeURIComponent(t)}/firmware/download`)},downloadCompileBinary(t){return Et(`/api/devices/${encodeURIComponent(t)}/compile/firmware/download`)},downloadJobBinary(t){return Et(`/api/jobs/${t}/firmware/download`)},activityLog(t,e,i){const s=Et("/api/integration/activity"),r=new EventSource(s);return r.addEventListener("line",n=>{t(n.data)}),r.addEventListener("end",()=>{e()}),r.addEventListener("error",n=>{i(n)}),r.onerror=i,r}};function Rg(t){let e=null,i=!1,s=1e3;const r=()=>{if(i)return;const n=Et("/ws/topology");e=new WebSocket(n),e.onopen=()=>{s=1e3},e.onmessage=o=>{try{const a=JSON.parse(o.data);a.type==="bridge.connection"&&typeof a.payload=="object"&&a.payload!==null&&t(a.payload.connected)}catch{}},e.onclose=()=>{i||(setTimeout(r,s),s=Math.min(s*2,1e4))},e.onerror=()=>{e==null||e.close()}};return r(),{close(){i=!0,e==null||e.close()}}}function Lg(t){let e=null,i=!1,s=1e3;const r=()=>{if(i)return;const n=Et("/ws/topology");e=new WebSocket(n),e.onopen=()=>{s=1e3},e.onmessage=o=>{try{const a=JSON.parse(o.data);a&&a.type==="server_id"&&typeof a.value=="string"&&(Ao!==null&&Ao!==a.value&&location.reload(),Ao=a.value),t(a)}catch{}},e.onclose=()=>{i||(setTimeout(r,s),s=Math.min(s*2,1e4))},e.onerror=()=>{e==null||e.close()}};return r(),{close(){i=!0,e==null||e.close()}}}function Z(t){const e=t.replace(/[^0-9A-Fa-f]/g,"");return e.length!==12?t.trim().toUpperCase():e.match(/.{2}/g).join(":").toUpperCase()}function Ni(t){const e=t||0;return e<1024?`${e} B`:e<1024*1024?`${(e/1024).toFixed(1)} KB`:`${(e/1024/1024).toFixed(2)} MB`}function Vi(t){return t?new Date(t*1e3).toLocaleString():"-"}function kn(t){if(!t)return"-";const e=Math.max(0,Math.floor((Date.now()-t*1e3)/1e3));return e<60?`${e}s ago`:e<3600?`${Math.floor(e/60)}m ago`:e<86400?`${Math.floor(e/3600)}h ago`:`${Math.floor(e/86400)}d ago`}function yt(t){if(t==null||t<0)return"";const e=Number(t);if(e<60)return`${Math.round(e)}s`;if(e<3600)return`${Math.floor(e/60)}m ${Math.round(e%60)}s`;if(e<86400){const n=Math.floor(e/3600),o=Math.floor(e%3600/60);return`${n}h ${o}m`}const i=Math.floor(e/86400);if(i<7){const n=e%86400,o=Math.floor(n/3600);return`${i}d ${o}h`}const s=Math.floor(i/7),r=i%7;return`${s}w ${r}d`}const Ig={network:q`<circle cx="12" cy="5" r="2.2"/><circle cx="5" cy="19" r="2.2"/><circle cx="19" cy="19" r="2.2"/><path d="M12 7.2V12M12 12l-5.4 5.2M12 12l5.4 5.2"/>`,jobs:q`<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 5.5l1 1 1.8-2M4 11.5l1 1 1.8-2"/><circle cx="5" cy="18" r="1.2"/>`,activity:q`<path d="M3 12h4l2.5-7 5 14 2.5-7h4"/>`,settings:q`<circle cx="12" cy="12" r="3"/><path d="M12 2.8v2.4M12 18.8v2.4M21.2 12h-2.4M5.2 12H2.8M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7M18.5 18.5l-1.7-1.7M7.2 7.2L5.5 5.5"/>`,plus:q`<path d="M12 5v14M5 12h14"/>`,refresh:q`<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>`,search:q`<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.3-4.3"/>`,chevronRight:q`<path d="M9 5l7 7-7 7"/>`,chevronLeft:q`<path d="M15 5l-7 7 7 7"/>`,chevronDown:q`<path d="M5 9l7 7 7-7"/>`,arrowUp:q`<path d="M12 19V5M6 11l6-6 6 6"/>`,arrowDown:q`<path d="M12 5v14M6 13l6 6 6-6"/>`,key:q`<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3M14 9l2 2"/>`,alert:q`<path d="M12 3.5l9.5 16.5h-19z"/><path d="M12 10v4.5M12 17.4v.1"/>`,info:q`<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6v.1"/>`,check:q`<path d="M5 12.5l4.5 4.5L19 7.5"/>`,checkCircle:q`<circle cx="12" cy="12" r="9"/><path d="M8 12.3l2.8 2.8L16.2 9.6"/>`,close:q`<path d="M6 6l12 12M18 6L6 18"/>`,upload:q`<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/>`,download:q`<path d="M12 4v12M7 11l5 5 5-5"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/>`,pause:q`<path d="M9 5v14M15 5v14"/>`,play:q`<path d="M7 4.5v15l12-7.5z"/>`,stop:q`<rect x="6" y="6" width="12" height="12" rx="1.5"/>`,code:q`<path d="M8.5 7L3.5 12l5 5M15.5 7l5 5-5 5"/>`,chip:q`<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2.5V6M15 2.5V6M9 18v3.5M15 18v3.5M2.5 9H6M2.5 15H6M18 9h3.5M18 15h3.5"/>`,usb:q`<path d="M12 3v14"/><circle cx="12" cy="19" r="2"/><path d="M12 13l-4-3V7M12 11l4-2.5V6"/><rect x="6.6" y="5" width="2.8" height="2.4" rx=".4"/><circle cx="16" cy="5.2" r="1.2"/>`,wifi:q`<path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.3a9.5 9.5 0 0 1 13 0M8.6 15.5a5 5 0 0 1 6.8 0"/><circle cx="12" cy="19" r="1"/>`,bridge:q`<path d="M12 21v-8"/><path d="M8.5 9.5a5 5 0 0 1 7 0M5.8 6.8a9 9 0 0 1 12.4 0"/><circle cx="12" cy="12" r="1.6"/>`,relay:q`<circle cx="5" cy="12" r="2"/><circle cx="19" cy="12" r="2"/><path d="M7 12h3M14 12h3"/><path d="M10.5 9.5l2.5 2.5-2.5 2.5"/>`,power:q`<path d="M12 3v8"/><path d="M6.6 6.6a8 8 0 1 0 10.8 0"/>`,trash:q`<path d="M4 7h16M10 11v6M14 11v6"/><path d="M6 7l1 13h10l1-13M9 7V4h6v3"/>`,eyeOff:q`<path d="M3 3l18 18"/><path d="M10.6 6.1A9.8 9.8 0 0 1 12 6c5 0 8.5 4.3 9.5 6-.5.8-1.5 2.2-2.9 3.5M6.4 7.6C4.6 8.9 3.2 10.7 2.5 12c1 1.7 4.5 6 9.5 6a9.6 9.6 0 0 0 4.4-1.1"/><path d="M9.9 10a3 3 0 0 0 4.1 4.1"/>`,eye:q`<path d="M2.5 12c1-1.7 4.5-6 9.5-6s8.5 4.3 9.5 6c-1 1.7-4.5 6-9.5 6s-8.5-4.3-9.5-6z"/><circle cx="12" cy="12" r="3"/>`,external:q`<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>`,ha:q`<path d="M3.5 11.5L12 4l8.5 7.5"/><path d="M5.5 10v9.5h13V10"/><circle cx="12" cy="14" r="1.6"/><path d="M12 15.6v3.9"/>`,clock:q`<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>`,lock:q`<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>`,build:q`<path d="M14.5 6.5a4 4 0 0 0-5.3 5.3L4 17l3 3 5.2-5.2a4 4 0 0 0 5.3-5.3l-2.6 2.6-2.4-.6-.6-2.4z"/>`,more:q`<circle cx="12" cy="5.5" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="12" cy="18.5" r="1.3"/>`,fullscreen:q`<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>`};function C(t,e){return p`<svg
    class="icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    role=${"presentation"}
    aria-hidden=${"true"}
    aria-label=${""}
  >${Ig[t]}</svg>`}const Vd=p`<svg class="brand-mark" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M16 27V16M16 16L8.5 9.5M16 16l7.5-6.5M16 16V7.5"/>
  <circle cx="16" cy="6" r="2.3" fill="currentColor" stroke="none"/>
  <circle cx="7.5" cy="8.5" r="2.3" fill="currentColor" stroke="none"/>
  <circle cx="24.5" cy="8.5" r="2.3" fill="currentColor" stroke="none"/>
</svg>`,jd=["success","failed","aborted","version_mismatch","rejoin_timeout"];function us(t){return t.friendly_name||t.esphome_name||t.label||t.mac}function yl(t){if(!t.online)return"down";const e=t.rssi;return e==null?"unknown":e>=-67?"strong":e>=-80?"fair":"weak"}const Fg={strong:"Strong",fair:"Fair",weak:"Weak",down:"No link",unknown:"Unknown"};function Sn(t){if(t.from_integration_store&&!t.offline_reason)return"Not seen this session";const e=t.offline_reason||"";switch(e){case"missed_heartbeats":return"Missed heartbeats";case"not_advertised":return"Not reported by bridge";case"":return"Offline";default:return e.replace(/_/g," ").replace(/^./,i=>i.toUpperCase())}}function Ng(t){return t==null?"—":t<5?"just now":`${yt(t)} ago`}function Ug(t,e){if(e)return p`<span class="muted">—</span>`;const i=yl(t);if(i==="down")return p`<span class="muted">—</span>`;const s=i==="strong"?4:i==="fair"?3:i==="weak"?1:0;return p`
    <span class="signal ${i}" title=${t.rssi!=null?`${Fg[i]} signal, ${t.rssi} dBm`:"Signal not reported"}>
      <span class="bars" aria-hidden="true">${[1,2,3,4].map(r=>p`<i class=${r<=s?"on":""}></i>`)}</span>
      <span class="dbm">${t.rssi!=null?`${t.rssi} dBm`:"—"}</span>
    </span>
  `}function Hg(t,e){var o,a,l;const{node:i,isRoot:s}=t;if(s){const h=(o=e.firmware)==null?void 0:o.job;if(h&&!jd.includes(h.status)){const c=h.status==="compiling"?"Building":h.status==="transferring"?`Updating ${h.percent??0}%`:"Updating";return p`<span class="chip info"><span class="spinner sm"></span>${c}</span>`}return i.online?p`<span class="chip ok"><span class="dot ok"></span>Online</span>`:p`<span class="chip danger"><span class="dot danger"></span>Offline</span>`}const r=(a=e.config)==null?void 0:a.config_state,n=e.job;if(r==="compiling")return p`<span class="chip info"><span class="spinner sm"></span>Compiling</span>`;if(n&&["starting","transferring","verifying","transfer_success_waiting_rejoin"].includes(n.status)){const h=n.status==="transferring"?`Uploading ${n.percent??0}%`:n.status==="verifying"?"Verifying":n.status==="transfer_success_waiting_rejoin"?"Rebooting":"Starting upload";return p`<span class="chip info"><span class="spinner sm"></span>${h}</span>`}return(n==null?void 0:n.status)==="queued"?p`<span class="chip warn">Upload queued · #${n.queue_position??1}</span>`:r==="compile_queued"?p`<span class="chip warn">Build queued · #${((l=e.config)==null?void 0:l.queue_position)??1}</span>`:i.online?r==="no_config"?p`<span class="chip warn" title="No YAML stored for this remote yet">Online · no config</span>`:p`<span class="chip ok"><span class="dot ok"></span>Online</span>`:p`<span class="chip danger" title=${Sn(i)}><span class="dot danger"></span>${Sn(i)}</span>`}function Wg(t){if(t.isRoot)return p`<span class="guides" aria-hidden="true"></span>`;const e=yl(t.node);return p`<span class="guides" aria-hidden="true">
    ${t.rails.map(i=>p`<span class="rail ${i?"through":""}"></span>`)}
    <span class="elbow ${t.last?"last":""} ${e}"></span>
  </span>`}function zg(t){window.location.hash=t}function qg(t,e){var d,u,f,g;const{node:i,isRoot:s}=t,r=us(i),n=s?((u=(d=e.firmware)==null?void 0:d.running)==null?void 0:u.version)||i.project_version||i.firmware_version||"":i.project_version||i.firmware_version||"",o=`#/device/${encodeURIComponent(i.mac)}`,a=(f=e.firmware)==null?void 0:f.job,h=!(!!a&&!jd.includes(a.status))&&(e.firmware?e.firmware.can_update:!0),c=((g=e.firmware)==null?void 0:g.blocked_reason)||"";return p`
    <div class="row ${i.online?"":"is-offline"} ${s?"is-root":""}" role="row">
      ${Wg(t)}
      <div class="cell name" role="gridcell">
        <span class="node-icon ${s?"bridge":""}" aria-hidden="true">${C(s?"bridge":i.relay_enabled?"relay":"chip")}</span>
        <span class="identity">
          <a class="title" href=${o} title=${r}>${r}</a>
          <span class="meta">
            ${s?p`<span>Bridge${i.network_id?p` · ${i.network_id}`:v}</span><span class="sep">·</span>`:v}
            ${!s&&i.relay_enabled?p`<span>Relay</span><span class="sep">·</span>`:v}
            <span class="mono">${i.mac}</span>
            ${i.chip_name?p`<span class="sep">·</span><span>${i.chip_name}</span>`:v}
          </span>
        </span>
      </div>
      <div class="facts">
        <div class="cell signal-cell" role="gridcell">${Ug(i,s)}</div>
        <div class="cell num hops" role="gridcell"><span class="m-label">Hops </span>${s?"—":i.hops??"—"}</div>
        <div class="cell seen" role="gridcell">
          ${s?p`<span title="Bridge uptime">Up ${yt(i.uptime_s)||"—"}</span>`:p`<span><span class="m-label">Seen </span>${Ng(i.last_seen_ago)}</span>`}
        </div>
        <div class="cell fw" role="gridcell">${n?p`<span class="ver" title=${i.firmware_build_date?`Built ${i.firmware_build_date}`:""}>${n}</span>`:p`<span class="muted">—</span>`}</div>
        <div class="cell status" role="gridcell">${Hg(t,e)}</div>
      </div>
      <div class="cell actions" role="gridcell">
        ${s?p`<button class="btn sm" ?disabled=${!h} title=${c||"Rebuild the bridge from this add-on and upload over WiFi"}
              @click=${()=>e.onUpdateFirmware(i.mac)}>Update firmware</button>`:i.online?p`<button class="btn sm text" aria-label=${`Edit YAML for ${r}`} @click=${()=>zg(`/device/${encodeURIComponent(i.mac)}/config`)}>${C("code")}YAML</button>`:p`<button class="btn sm text" aria-label=${`Hide ${r}`} title="Move to Hidden devices until it comes back" @click=${()=>e.onHide(i.mac)}>${C("eyeOff")}Hide</button>`}
      </div>
    </div>
  `}const Vg=de`
  .tree { font-size: var(--text-md); }
  .row, .tree-head {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) 124px 48px 104px 84px 200px 120px;
    align-items: center;
    column-gap: 12px;
    padding: 0 16px 0 8px;
  }
  .facts { display: contents; }
  .tree-head {
    min-height: 36px;
    color: var(--muted);
    font-size: var(--text-xs);
    font-weight: 500;
    border-bottom: 1px solid var(--line);
    background: var(--surface-subtle);
  }
  .tree-head .num { text-align: left; }
  .row {
    min-height: 56px;
    border-bottom: 1px solid var(--line);
    transition: background-color 120ms ease;
  }
  .row:last-child { border-bottom: 0; }
  .row:hover { background: var(--surface-hover); }
  .row.is-root { background: var(--surface-subtle); }
  .row.is-root:hover { background: var(--surface-hover); }
  .cell { min-width: 0; }
  .cell.name { display: flex; align-items: stretch; align-self: stretch; gap: 10px; }
  .identity { display: grid; align-content: center; gap: 2px; min-width: 0; padding: 8px 0; min-height: 56px; }
  .meta > :last-child { overflow: hidden; text-overflow: ellipsis; }
  .title {
    color: var(--ink);
    font-weight: 500;
    text-decoration: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .title:hover { color: var(--primary); text-decoration: underline; }
  .is-root .title { font-size: var(--text-lg); }
  .meta {
    display: flex;
    gap: 6px;
    color: var(--muted);
    font-size: var(--text-xs);
    white-space: nowrap;
    overflow: hidden;
  }
  .meta .sep { color: var(--line-strong); }
  .node-icon {
    align-self: flex-start;
    margin-top: 12px;
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    flex: none;
    border-radius: 50%;
    background: var(--surface-subtle);
    color: var(--muted);
  }
  .node-icon svg { width: 18px; height: 18px; }
  .node-icon.bridge { background: var(--primary-soft); color: var(--primary); }
  .is-offline .node-icon { color: var(--danger); background: var(--danger-soft); }
  .is-offline .title { color: var(--ink-2); }
  .muted { color: var(--faint); }
  .m-label { display: none; }
  .num, .seen, .fw { font-variant-numeric: tabular-nums; color: var(--ink-2); }
  .fw .ver { font-size: var(--text-sm); }
  .actions { display: flex; justify-content: flex-end; }
  .actions .btn svg { width: 16px; height: 16px; }
  .chip .spinner.sm { width: 10px; height: 10px; border-width: 1.5px; border-color: currentColor; border-top-color: transparent; }
  .chip { max-width: 100%; overflow: hidden; text-overflow: ellipsis; }

  /* Signal meter */
  .signal { display: inline-flex; align-items: center; gap: 8px; }
  .bars { display: inline-flex; align-items: flex-end; gap: 2px; height: 14px; }
  .bars i { display: block; width: 4px; border-radius: 1px; background: var(--line-strong); }
  .bars i:nth-child(1) { height: 5px; }
  .bars i:nth-child(2) { height: 8px; }
  .bars i:nth-child(3) { height: 11px; }
  .bars i:nth-child(4) { height: 14px; }
  .signal.strong .bars i.on { background: var(--ok-dot); }
  .signal.fair .bars i.on { background: var(--accent-fill); }
  .signal.weak .bars i.on { background: var(--danger); }
  .dbm { color: var(--muted); font-size: var(--text-sm); font-variant-numeric: tabular-nums; }

  /* Guides: rails for ancestors, an elbow into this node coloured by its link */
  .guides { display: flex; flex: none; align-self: stretch; margin-left: 4px; }
  .rail, .elbow { position: relative; width: 22px; flex: none; }
  .rail.through::before {
    content: '';
    position: absolute;
    left: 10px;
    top: 0;
    bottom: 0;
    border-left: 2px solid var(--line-strong);
  }
  .elbow::before {
    content: '';
    position: absolute;
    left: 10px;
    top: 0;
    bottom: 0;
    border-left: 2px solid var(--line-strong);
  }
  .elbow.last::before { bottom: auto; height: 28px; }
  .elbow::after {
    content: '';
    position: absolute;
    left: 10px;
    right: -6px;
    top: 27px;
    border-top: 2px solid var(--link-colour, var(--line-strong));
  }
  .elbow.strong { --link-colour: var(--ok-dot); }
  .elbow.strong::after { border-top-width: 3px; top: 26px; }
  .elbow.fair { --link-colour: var(--accent-fill); }
  .elbow.weak { --link-colour: var(--danger); }
  .elbow.weak::after { border-top-width: 1px; top: 27.5px; }
  .elbow.down::after { border-top-style: dashed; --link-colour: var(--danger); opacity: 0.7; }

  @media (max-width: 1100px) {
    .row, .tree-head { grid-template-columns: auto minmax(0, 1fr) 116px 48px 100px 184px 112px; }
    .fw { display: none; }
  }
  @media (max-width: 860px) {
    .tree-head { display: none; }
    .row {
      grid-template-columns: auto minmax(0, 1fr) auto;
      grid-template-areas: 'guides name actions' 'guides facts facts';
      column-gap: 8px;
      padding: 0 8px 0 4px;
    }
    .guides { grid-area: guides; }
    .cell.name { grid-area: name; }
    .cell.actions { grid-area: actions; }
    .facts {
      grid-area: facts;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px 14px;
      padding: 0 0 12px 42px;
      font-size: var(--text-sm);
    }
    .cell.fw { display: none; }
    .is-root .cell.signal-cell, .is-root .cell.hops { display: none; }
    .m-label { display: inline; color: var(--muted); }
    .meta { flex-wrap: wrap; white-space: normal; row-gap: 0; }
    .title { white-space: normal; overflow-wrap: anywhere; }
  }
`,Me=de`
  :host {
    font-family: var(--font-sans);
    font-size: var(--text-md);
    line-height: 1.45;
    color: var(--ink);
  }
  *, *::before, *::after { box-sizing: border-box; }
  [hidden] { display: none !important; }
  h1, h2, h3, h4, p { margin: 0; }
  a { color: var(--primary); text-underline-offset: 2px; }
  code, .mono {
    font-family: var(--font-mono);
    font-size: 0.92em;
    font-variant-numeric: tabular-nums;
  }
  :focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }
  ::selection { background: var(--primary-soft); color: var(--ink); }

  /* Page frame ---------------------------------------------------------- */
  .page { display: grid; gap: 16px; }
  .page-head {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 12px 16px;
    flex-wrap: wrap;
    padding-top: 4px;
  }
  .page-head h1 {
    font-size: var(--text-2xl);
    font-weight: 500;
    line-height: 1.2;
    letter-spacing: -0.01em;
  }
  .page-head .sub {
    margin-top: 4px;
    color: var(--muted);
    font-size: var(--text-md);
  }
  .page-actions { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
  @media (max-width: 760px) { .page-actions { flex-wrap: nowrap; } }
  .crumbs {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: var(--text-sm);
    color: var(--muted);
    margin-bottom: 6px;
  }
  .crumbs a { color: var(--primary); text-decoration: none; font-weight: 500; }
  .crumbs a:hover { text-decoration: underline; }

  /* Cards --------------------------------------------------------------- */
  .card {
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: var(--radius-lg);
    min-width: 0;
  }
  .card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 16px;
    border-bottom: 1px solid var(--line);
    flex-wrap: wrap;
  }
  .card-head h2, .card-title {
    font-size: var(--text-lg);
    font-weight: 500;
    line-height: 1.3;
  }
  .card-head .sub { color: var(--muted); font-size: var(--text-sm); margin-top: 2px; }
  .card-body { padding: 16px; }
  .card-foot {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    flex-wrap: wrap;
    padding: 12px 16px;
    border-top: 1px solid var(--line);
  }

  /* Buttons ------------------------------------------------------------- */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 36px;
    padding: 0 14px;
    border: 1px solid var(--line-strong);
    border-radius: var(--radius-md);
    background: var(--surface);
    color: var(--ink);
    font: inherit;
    font-size: var(--text-md);
    font-weight: 500;
    line-height: 1;
    white-space: nowrap;
    text-decoration: none;
    cursor: pointer;
    transition: background-color 150ms ease, border-color 150ms ease, color 150ms ease;
  }
  .btn:hover:not(:disabled) { background: var(--surface-hover); }
  .btn:disabled, .btn[aria-disabled='true'] { opacity: 0.5; cursor: not-allowed; }
  .btn svg { width: 18px; height: 18px; flex: none; }
  .btn.primary {
    background: var(--primary);
    border-color: var(--primary);
    color: var(--on-primary);
  }
  .btn.primary:hover:not(:disabled) { background: var(--primary-strong); border-color: var(--primary-strong); }
  .btn.danger { color: var(--danger); border-color: var(--line-strong); }
  .btn.danger:hover:not(:disabled) { background: var(--danger-soft); border-color: var(--danger); }
  .btn.danger-solid { background: var(--danger); border-color: var(--danger); color: var(--on-danger); }
  .btn.danger-solid:hover:not(:disabled) { background: var(--danger-strong); border-color: var(--danger-strong); }
  .btn.text {
    border-color: transparent;
    background: transparent;
    color: var(--primary);
    padding: 0 10px;
  }
  .btn.text:hover:not(:disabled) { background: var(--primary-soft); }
  .btn.sm { min-height: 30px; padding: 0 10px; font-size: var(--text-sm); border-radius: var(--radius-sm); }
  .btn.sm.text { padding: 0 8px; }
  .btn.icon { padding: 0; width: 36px; }
  .btn.sm.icon { width: 30px; }
  .btn.busy { cursor: progress; }

  /* Status chips ---------------------------------------------------------- */
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 22px;
    padding: 0 8px;
    border-radius: 999px;
    background: var(--surface-subtle);
    color: var(--ink-2);
    font-size: var(--text-xs);
    font-weight: 500;
    line-height: 1;
    white-space: nowrap;
  }
  .chip.ok { background: var(--ok-soft); color: var(--ok); }
  .chip.warn { background: var(--accent-soft); color: var(--accent); }
  .chip.danger { background: var(--danger-soft); color: var(--danger); }
  .chip.info { background: var(--info-soft); color: var(--info); }
  .chip.primary { background: var(--primary-soft); color: var(--primary); }
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex: none;
    background: var(--faint);
  }
  .dot.ok { background: var(--ok-dot); }
  .dot.danger { background: var(--danger); }
  .dot.warn { background: var(--accent-fill); }
  .dot.info { background: var(--info); }

  /* Notices ------------------------------------------------------------- */
  .notice {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    padding: 12px 14px;
    border-radius: var(--radius-md);
    background: var(--surface-subtle);
    color: var(--ink-2);
    font-size: var(--text-md);
  }
  .notice svg { width: 20px; height: 20px; flex: none; margin-top: 1px; }
  .notice strong { color: var(--ink); font-weight: 500; }
  .notice.warn { background: var(--accent-soft); }
  .notice.warn svg { color: var(--accent); }
  .notice.danger { background: var(--danger-soft); }
  .notice.danger svg { color: var(--danger); }
  .notice.info { background: var(--info-soft); }
  .notice.info svg { color: var(--info); }
  .notice.ok { background: var(--ok-soft); }
  .notice.ok svg { color: var(--ok); }
  .notice .notice-actions { margin-left: auto; display: flex; gap: 8px; flex-wrap: wrap; }

  /* Forms --------------------------------------------------------------- */
  .field { display: grid; gap: 6px; min-width: 0; }
  .field > label, .label {
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--ink-2);
  }
  .hint { font-size: var(--text-sm); color: var(--muted); }
  .error-text { font-size: var(--text-sm); color: var(--danger); }
  input[type='text'], input[type='number'], input[type='password'], input[type='search'], input:not([type]), select, textarea {
    width: 100%;
    min-height: 40px;
    padding: 8px 12px;
    border: 1px solid var(--line-strong);
    border-radius: var(--radius-md);
    background: var(--surface);
    color: var(--ink);
    font: inherit;
    font-size: var(--text-md);
  }
  textarea { min-height: 96px; resize: vertical; }
  input:hover, select:hover, textarea:hover { border-color: var(--faint); }
  input:focus, select:focus, textarea:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 1px var(--primary);
  }
  input::placeholder, textarea::placeholder { color: var(--faint); }
  input:disabled, select:disabled { opacity: 0.6; cursor: not-allowed; }

  /* Segmented filter ------------------------------------------------------ */
  .segmented {
    display: inline-flex;
    padding: 2px;
    border: 1px solid var(--line-strong);
    border-radius: var(--radius-md);
    background: var(--surface);
  }
  .segmented button {
    min-height: 30px;
    padding: 0 12px;
    border: 0;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--muted);
    font: inherit;
    font-size: var(--text-sm);
    font-weight: 500;
    cursor: pointer;
  }
  .segmented button:hover { color: var(--ink); }
  .segmented button[aria-pressed='true'] { background: var(--primary-soft); color: var(--primary); }

  /* Data tables ------------------------------------------------------------- */
  .table-wrap { overflow-x: auto; }
  table.data { width: 100%; border-collapse: collapse; font-size: var(--text-md); }
  table.data th {
    text-align: left;
    font-size: var(--text-xs);
    font-weight: 500;
    color: var(--muted);
    padding: 10px 16px;
    border-bottom: 1px solid var(--line);
    white-space: nowrap;
  }
  table.data td {
    padding: 12px 16px;
    border-bottom: 1px solid var(--line);
    vertical-align: middle;
  }
  table.data tr:last-child td { border-bottom: 0; }
  table.data td.num { font-variant-numeric: tabular-nums; }
  table.data td.actions { text-align: right; white-space: nowrap; }

  /* Key/value facts --------------------------------------------------------- */
  .facts {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 14px 20px;
    margin: 0;
  }
  .facts div { min-width: 0; }
  .facts dt { font-size: var(--text-xs); color: var(--muted); margin-bottom: 2px; }
  .facts dd {
    margin: 0;
    font-size: var(--text-md);
    color: var(--ink);
    overflow-wrap: anywhere;
    font-variant-numeric: tabular-nums;
  }

  /* Empty / loading -------------------------------------------------------- */
  .empty {
    display: grid;
    justify-items: center;
    gap: 6px;
    padding: 40px 16px;
    text-align: center;
    color: var(--muted);
  }
  .empty svg { width: 32px; height: 32px; color: var(--faint); margin-bottom: 4px; }
  .empty strong { color: var(--ink); font-weight: 500; font-size: var(--text-lg); }
  .empty p { max-width: 46ch; }
  .empty .btn { margin-top: 10px; }
  .empty .btn svg { width: 18px; height: 18px; margin: 0; color: inherit; }
  .spinner {
    width: 18px;
    height: 18px;
    border: 2px solid var(--line-strong);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    flex: none;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Progress ------------------------------------------------------------------ */
  .progress {
    height: 6px;
    border-radius: 999px;
    background: var(--surface-subtle);
    overflow: hidden;
  }
  .progress > span {
    display: block;
    height: 100%;
    background: var(--primary);
    border-radius: inherit;
    transition: width 300ms ease;
  }
  .progress.indeterminate > span {
    width: 35% !important;
    animation: slide 1.2s ease-in-out infinite;
  }
  @keyframes slide { from { transform: translateX(-100%); } to { transform: translateX(300%); } }

  /* Logs ---------------------------------------------------------------------- */
  .log {
    background: var(--log-bg);
    color: var(--log-ink);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    line-height: 1.6;
    border-radius: var(--radius-md);
    padding: 12px 14px;
    overflow: auto;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  /* Dialogs ------------------------------------------------------------------- */
  dialog {
    border: 0;
    padding: 0;
    border-radius: var(--radius-lg);
    background: var(--surface-raised);
    color: var(--ink);
    box-shadow: var(--shadow-md);
    width: min(480px, calc(100vw - 32px));
  }
  dialog::backdrop { background: var(--scrim); }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation: none !important; transition-duration: 1ms !important; }
    .spinner { border-top-color: var(--primary); border-right-color: var(--primary); }
    .progress.indeterminate > span { width: 35% !important; transform: translateX(95%); }
  }
`,xl=de`
  .hist { list-style: none; margin: 0; padding: 0; }
  .hist li {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto 96px auto;
    align-items: center;
    gap: 6px 16px;
    padding: 10px 16px;
    border-top: 1px solid var(--line);
  }
  .hist li:first-child { border-top: 0; }
  .hist .what { display: grid; gap: 2px; min-width: 0; }
  .hist .what strong { font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .hist .what small { color: var(--muted); font-size: var(--text-xs); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .hist .what .err { color: var(--danger); white-space: normal; }
  .hist .when { color: var(--muted); font-size: var(--text-sm); text-align: right; font-variant-numeric: tabular-nums; }
  .hist .row-actions { display: flex; gap: 4px; justify-content: flex-end; }
  .chip-spin { width: 10px !important; height: 10px !important; border-width: 1.5px !important; border-color: currentColor !important; border-top-color: transparent !important; }
  @media (max-width: 640px) {
    .hist li { grid-template-columns: minmax(0, 1fr) auto; }
    .hist .when { text-align: left; }
    .hist .row-actions { grid-column: 1 / -1; justify-content: flex-start; }
  }
`;var jg=Object.defineProperty,Qg=Object.getOwnPropertyDescriptor,Ar=(t,e,i,s)=>{for(var r=s>1?void 0:s?Qg(e,i):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(s?o(e,i,r):o(r))||r);return s&&r&&jg(e,i,r),r};let ji=class extends pe{constructor(){super(...arguments),this.request=null,this.busy=!1,this.failure=""}updated(t){t.has("request")&&(this.request&&!this.dialog.open?(this.failure="",this.dialog.showModal(),requestAnimationFrame(()=>{var e;return(e=this.renderRoot.querySelector(".confirm"))==null?void 0:e.focus()})):!this.request&&this.dialog.open&&this.dialog.close())}close(){this.busy||(this.request=null,this.dispatchEvent(new CustomEvent("closed")))}async confirm(){if(this.request){this.busy=!0,this.failure="";try{await this.request.run(),this.busy=!1,this.close()}catch(t){this.failure=t instanceof Error?t.message:String(t),this.busy=!1}}}render(){const t=this.request;return p`
      <dialog
        aria-labelledby="t"
        aria-describedby="m"
        @cancel=${e=>{e.preventDefault(),this.close()}}
        @click=${e=>{e.target===this.dialog&&this.close()}}
      >
        ${t?p`
          <div class="body">
            <h2 id="t">${t.title}</h2>
            <p id="m">${t.message}</p>
            ${t.detail?p`<div class="notice ${t.danger?"danger":"warn"}">${C("alert")}<span>${t.detail}</span></div>`:v}
            ${this.failure?p`<p class="error-text" role="alert">${this.failure}</p>`:v}
          </div>
          <div class="actions">
            <button class="btn" @click=${()=>this.close()} ?disabled=${this.busy}>Cancel</button>
            <button class="btn confirm ${t.danger?"danger-solid":"primary"}" @click=${()=>void this.confirm()} ?disabled=${this.busy}>
              ${this.busy?p`<span class="spinner"></span>Working…`:t.confirmLabel}
            </button>
          </div>
        `:v}
      </dialog>
    `}};ji.styles=[Me,de`
    .body { display: grid; gap: 12px; padding: 22px 22px 8px; }
    h2 { font-size: var(--text-xl); font-weight: 500; line-height: 1.3; }
    p { color: var(--ink-2); }
    .actions { display: flex; justify-content: flex-end; gap: 8px; padding: 16px 22px 20px; }
    .btn .spinner { width: 14px; height: 14px; border-color: currentColor; border-top-color: transparent; }
  `];Ar([ie({attribute:!1})],ji.prototype,"request",2);Ar([b()],ji.prototype,"busy",2);Ar([b()],ji.prototype,"failure",2);Ar([vl("dialog")],ji.prototype,"dialog",2);ji=Ar([Se("esp-confirm-dialog")],ji);var Kg=Object.defineProperty,Xg=Object.getOwnPropertyDescriptor,nt=(t,e,i,s)=>{for(var r=s>1?void 0:s?Xg(e,i):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(s?o(e,i,r):o(r))||r);return s&&r&&Kg(e,i,r),r};let He=class extends pe{constructor(){super(...arguments),this.addonDown=!1,this.topology=[],this.currentJob=null,this.queueData=null,this.configStatuses=new Map,this.firmwareStatus=null,this.loading=!0,this.error="",this.hiddenExpanded=!1,this.query="",this.filter="all",this.pendingConfirm=null,this.firmwareTimer=null}connectedCallback(){super.connectedCallback(),this.load(),this.stream=Lg(t=>{(t.type==="topology.snapshot"||t.type==="topology.changed"||t.type==="remote.availability"||t.type==="bridge.heartbeat")&&this.load(!1,!0)})}disconnectedCallback(){var t;(t=this.stream)==null||t.close(),this.stopFirmwarePolling(),super.disconnectedCallback()}stopFirmwarePolling(){this.firmwareTimer&&(clearInterval(this.firmwareTimer),this.firmwareTimer=null)}async loadBridgeFirmware(t){var r,n;const e=t.find(o=>o.is_bridge&&o.bridge_uuid);if(!(e!=null&&e.bridge_uuid)){this.firmwareStatus=null,this.stopFirmwarePolling();return}try{this.firmwareStatus=await S.bridgeFirmware(e.bridge_uuid)}catch{this.firmwareStatus=null}const i=((n=(r=this.firmwareStatus)==null?void 0:r.job)==null?void 0:n.status)??"",s=!!i&&!["success","failed","aborted","version_mismatch","rejoin_timeout"].includes(i);s&&!this.firmwareTimer?this.firmwareTimer=setInterval(()=>void this.load(!1,!0),3e3):s||this.stopFirmwarePolling()}firmwareForMac(t){return this.firmwareStatus&&Z(this.firmwareStatus.mac)===Z(t)?this.firmwareStatus:null}async handleUpdateFirmware(t){var o,a,l;const e=this.topology.find(h=>Z(h.mac)===Z(t)),i=((o=this.firmwareStatus)==null?void 0:o.uuid)||(e==null?void 0:e.bridge_uuid);if(!i)return;const s=(e==null?void 0:e.friendly_name)||(e==null?void 0:e.esphome_name)||(e==null?void 0:e.label)||t,r=(l=(a=this.firmwareStatus)==null?void 0:a.running)==null?void 0:l.build_date,n=async()=>{await S.updateBridgeFirmware(i),await this.load(!1,!0)};this.pendingConfirm={title:`Update firmware on ${s}?`,message:"The bridge rebuilds its stored configuration, uploads the new image over WiFi, then reboots.",detail:`The ESP-NOW mesh will be offline for about a minute.${r?` Currently running: built ${r}.`:""} If the new image cannot boot, the bridge must be reflashed over USB.`,confirmLabel:"Update and reboot",run:n}}async load(t=!0,e=!1){t&&(this.loading=!0);try{const[i,s,r]=await Promise.all([S.topology(e),S.currentOta(),S.getQueue()]);this.topology=i,this.currentJob=s.job,this.queueData=r,this.error="";const n=i.filter(l=>(l.hops??0)>0).map(l=>S.getConfigStatus(l.mac).catch(()=>null)),o=await Promise.all(n),a=new Map;o.forEach(l=>{l&&a.set(Z(l.mac),l)}),this.configStatuses=a,this.loadBridgeFirmware(i)}catch(i){this.error=i instanceof Error?i.message:String(i)}finally{this.loading=!1}}async handleHideDevice(t){try{await S.hideDevice(t),await this.load(!1,!0)}catch(e){console.error("Failed to hide device:",e)}}async handleUnhideDevice(t){try{await S.unhideDevice(t),await this.load(!1,!0)}catch(e){console.error("Failed to unhide device:",e)}}async handleRemoveDevice(t){const e=this.topology.find(s=>s.mac===t);if(!(e!=null&&e.hidden)||e.is_bridge)return;const i=e.friendly_name||e.esphome_name||e.label||t;this.pendingConfirm={title:`Delete ${i} permanently?`,message:"This removes the remote from ESP Tree and Home Assistant, including its retained history and firmware records.",detail:"This cannot be undone. If the device is still powered on, it may reappear when it rejoins.",confirmLabel:"Delete permanently",danger:!0,run:async()=>{await S.removeRemote(t),await this.load(!1,!0)}}}jobForMac(t){var s;const e=Z(t);return this.currentJob&&Z(this.currentJob.mac)===e?this.currentJob:(((s=this.queueData)==null?void 0:s.queued_jobs)??[]).find(r=>Z(r.mac)===e)??null}configForMac(t){return this.configStatuses.get(Z(t))??null}childKey(t){return Z(t||"")}buildChildren(){const t=new Map;for(const i of this.topology){const s=this.childKey(i.parent_mac);if(!s)continue;const r=t.get(s)||[];r.push(i),t.set(s,r)}for(const i of t.values())i.sort((s,r)=>(s.friendly_name||s.label||s.esphome_name||s.mac).localeCompare(r.friendly_name||r.label||r.esphome_name||r.mac));return{root:this.topology.find(i=>(i.hops??0)===0)||this.topology.find(i=>!i.parent_mac)||this.topology[0]||null,childMap:t}}flatten(t,e){const i=[{node:t,depth:0,rails:[],last:!0,isRoot:!0}],s=(r,n,o)=>{const a=e.get(this.childKey(r.mac))||[];a.forEach((l,h)=>{const c=h===a.length-1;i.push({node:l,depth:n,rails:o,last:c,isRoot:!1}),s(l,n+1,[...o,!c])})};return s(t,1,[]),i}render(){var w;const{root:t}=this.buildChildren(),e=this.childKey((t==null?void 0:t.mac)||""),i=this.topology.filter(x=>x.hidden?!1:(x.hops??0)>0?!0:!x.is_bridge&&this.childKey(x.mac)!==e),s=this.topology.filter(x=>x.hidden),r=i.filter(x=>!x.is_bridge),n=r.filter(x=>x.online),o=r.length-n.length,a=this.query.trim().toLowerCase(),l=x=>this.filter==="all"||this.filter==="online"&&!!x.online||this.filter==="offline"&&!x.online?a?[x.friendly_name,x.label,x.esphome_name,x.mac,x.chip_name].filter(Boolean).some(D=>String(D).toLowerCase().includes(a)):!0:!1,h=i.filter(x=>!!x.is_bridge||l(x)),c=new Set(h.map(x=>this.childKey(x.mac))),d=new Map;for(const x of h){if(this.childKey(x.mac)===e)continue;let O=this.childKey(x.parent_mac);(!O||!c.has(O))&&(O=e);const D=d.get(O)||[];D.push(x),d.set(O,D)}for(const x of d.values())x.sort((O,D)=>us(O).localeCompare(us(D)));const u=this.currentJob?1:0,f=(((w=this.queueData)==null?void 0:w.queued_jobs)??[]).length,g=h.filter(x=>!x.is_bridge).length,m=this.filter!=="all"||!!a,y=t?this.flatten(t,d):[];return p`
      <div class="page">
        <div class="page-head">
          <div>
            <h1>Network</h1>
            ${t?p`
              <p class="summary" aria-live="polite">
                <span><strong>${n.length}</strong> of ${r.length} remotes online</span>
                ${o>0?p`<button class="summary-link danger" @click=${()=>{this.filter="offline"}}>${o} offline</button>`:v}
                ${u+f>0?p`<a class="summary-link" href="#/queue">${u?"1 job running":""}${u&&f?", ":""}${f?`${f} queued`:""}</a>`:v}
              </p>
            `:v}
          </div>
          <div class="page-actions">
            <button class="btn icon" aria-label="Refresh" title="Refresh" @click=${()=>void this.load(!0,!0)} ?disabled=${this.loading}>
              ${this.loading?p`<span class="spinner"></span>`:C("refresh")}
            </button>
            ${this.addonDown?p`<button class="btn primary" disabled title="Unavailable while the add-on is unreachable">${C("plus")}Add remote</button>`:p`<a class="btn primary" href="#/add-remote">${C("plus")}Add remote</a>`}
          </div>
        </div>

        ${this.error&&!this.addonDown?p`<div class="notice danger" role="alert">${C("alert")}<span><strong>Couldn't read the network.</strong> ${this.error}</span>
          <span class="notice-actions"><button class="btn sm" @click=${()=>void this.load(!0,!0)}>Try again</button></span></div>`:v}

        ${t?p`
          <section class="card" aria-label="Device tree">
            <div class="filters">
              <label class="search">
                ${C("search")}
                <input type="search" aria-label="Search devices" placeholder="Search by name, MAC or chip" .value=${this.query}
                  @input=${x=>{this.query=x.target.value}} />
              </label>
              <div class="segmented" role="group" aria-label="Show">
                ${["all","online","offline"].map(x=>p`
                  <button aria-pressed=${this.filter===x?"true":"false"} @click=${()=>{this.filter=x}}>
                    ${x==="all"?`All ${r.length}`:x==="online"?`Online ${n.length}`:`Offline ${o}`}
                  </button>
                `)}
              </div>
            </div>
            ${r.length===0?p`
                <div class="tree" role="grid" aria-label="Devices">${y.map(x=>this.row(x))}</div>
                <div class="empty">
                  ${C("network")}
                  <strong>No remotes have joined yet</strong>
                  <p>Flash a remote with this bridge's network credentials. It appears here as soon as it joins.</p>
                  <a class="btn primary" href="#/add-remote">${C("plus")}Add remote</a>
                </div>`:p`
                <div class="tree" role="grid" aria-label="Devices">
                  <div class="tree-head" role="row">
                    <span></span><span role="columnheader">Device</span><span role="columnheader">Signal</span><span role="columnheader">Hops</span>
                    <span role="columnheader">Last seen</span><span role="columnheader" class="fw">Firmware</span><span role="columnheader">Status</span><span></span>
                  </div>
                  ${y.map(x=>this.row(x))}
                </div>
                ${m&&g===0?p`
                  <div class="empty">
                    ${C("search")}
                    <strong>No remotes match</strong>
                    <p>Nothing matches “${this.query||this.filter}”. Clear the search or show all remotes.</p>
                    <button class="btn" @click=${()=>{this.query="",this.filter="all"}}>Show all</button>
                  </div>`:v}
              `}
            ${s.length>0?p`
              <div class="hidden-block">
                <button class="hidden-toggle" aria-expanded=${this.hiddenExpanded?"true":"false"} @click=${()=>{this.hiddenExpanded=!this.hiddenExpanded}}>
                  <span class="chev ${this.hiddenExpanded?"open":""}">${C("chevronRight")}</span>
                  Hidden devices <span class="chip">${s.length}</span>
                  <span class="hint">Offline devices kept out of the tree</span>
                </button>
                ${this.hiddenExpanded?p`
                  <ul class="hidden-list">
                    ${s.map(x=>p`
                      <li>
                        <span class="dot danger"></span>
                        <span class="hidden-id">
                          <a href=${`#/device/${encodeURIComponent(x.mac)}`}>${us(x)}</a>
                          <small><span class="mono">${x.mac}</span> · ${Sn(x)}</small>
                        </span>
                        <span class="hidden-actions">
                          <button class="btn sm" @click=${()=>void this.handleUnhideDevice(x.mac)}>Restore</button>
                          ${x.is_bridge?v:p`<button class="btn sm danger" @click=${()=>void this.handleRemoveDevice(x.mac)}>Delete…</button>`}
                        </span>
                      </li>
                    `)}
                  </ul>
                `:v}
              </div>
            `:v}
          </section>
        `:this.loading?p`<div class="card loading" aria-live="polite"><span class="spinner"></span>Reading the bridge topology…</div>`:this.error?v:p`
            <section class="card">
              <div class="empty">
                ${C("bridge")}
                <strong>No bridge data yet</strong>
                <p>The add-on hasn't received a topology from the bridge. Check that the bridge is powered and connected, then try again.</p>
                <button class="btn primary" @click=${()=>void this.load(!0,!0)}>Try again</button>
              </div>
            </section>`}

        <esp-confirm-dialog .request=${this.pendingConfirm} @closed=${()=>{this.pendingConfirm=null}}></esp-confirm-dialog>
      </div>
    `}row(t){return qg(t,{job:this.jobForMac(t.node.mac),config:this.configForMac(t.node.mac),firmware:t.isRoot?this.firmwareForMac(t.node.mac):null,onUpdateFirmware:e=>void this.handleUpdateFirmware(e),onHide:e=>void this.handleHideDevice(e)})}};He.styles=[Me,Vg,de`
    :host { display: block; }
    .summary {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 4px 14px;
      margin-top: 4px;
      color: var(--muted);
    }
    .summary strong { color: var(--ink); font-weight: 500; }
    .summary-link {
      border: 0;
      padding: 0;
      background: none;
      font: inherit;
      color: var(--primary);
      font-weight: 500;
      cursor: pointer;
      text-decoration: none;
    }
    .summary-link:hover { text-decoration: underline; }
    .summary-link.danger { color: var(--danger); }

    .card { overflow: hidden; }
    .filters {
      display: flex;
      gap: 12px;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      padding: 12px 16px;
      border-bottom: 1px solid var(--line);
    }
    .search { position: relative; flex: 1 1 260px; max-width: 360px; }
    .search svg { position: absolute; left: 10px; top: 50%; width: 18px; height: 18px; transform: translateY(-50%); color: var(--faint); pointer-events: none; }
    .search input { padding-left: 36px; min-height: 36px; }

    .loading { display: flex; align-items: center; gap: 12px; padding: 24px 16px; color: var(--muted); }

    .hidden-block { border-top: 1px solid var(--line); }
    .hidden-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      min-height: 48px;
      padding: 0 16px;
      border: 0;
      background: none;
      color: var(--ink);
      font: inherit;
      font-weight: 500;
      text-align: left;
      cursor: pointer;
    }
    .hidden-toggle:hover { background: var(--surface-hover); }
    .hidden-toggle .hint { font-weight: 400; margin-left: 4px; }
    .chev { display: inline-flex; transition: transform 150ms ease; color: var(--muted); }
    .chev svg { width: 18px; height: 18px; }
    .chev.open { transform: rotate(90deg); }
    .hidden-list { list-style: none; margin: 0; padding: 0 0 8px; }
    .hidden-list li {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 16px 8px 42px;
    }
    .hidden-id { display: grid; min-width: 0; flex: 1; }
    .hidden-id a { color: var(--ink); font-weight: 500; text-decoration: none; }
    .hidden-id a:hover { color: var(--primary); text-decoration: underline; }
    .hidden-id small { color: var(--muted); font-size: var(--text-xs); }
    .hidden-actions { display: flex; gap: 8px; }

    @media (max-width: 760px) {
      .page-head { flex-wrap: nowrap; align-items: flex-start; }
      .search { max-width: none; }
      .hidden-toggle .hint { display: none; }
      .hidden-list li { flex-wrap: wrap; padding-left: 16px; }
    }
  `];nt([ie({type:Boolean})],He.prototype,"addonDown",2);nt([b()],He.prototype,"topology",2);nt([b()],He.prototype,"currentJob",2);nt([b()],He.prototype,"queueData",2);nt([b()],He.prototype,"configStatuses",2);nt([b()],He.prototype,"firmwareStatus",2);nt([b()],He.prototype,"loading",2);nt([b()],He.prototype,"error",2);nt([b()],He.prototype,"hiddenExpanded",2);nt([b()],He.prototype,"query",2);nt([b()],He.prototype,"filter",2);nt([b()],He.prototype,"pendingConfirm",2);He=nt([Se("esp-topology-map")],He);var Jg=Object.defineProperty,Yg=Object.getOwnPropertyDescriptor,ot=(t,e,i,s)=>{for(var r=s>1?void 0:s?Yg(e,i):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(s?o(e,i,r):o(r))||r);return s&&r&&Jg(e,i,r),r};const Gg={rejected:"The remote rejected the command.",busy:"The remote is busy. Try again in a few seconds.",timeout:"The remote didn't answer in time. It may be asleep or out of range.",no_session:"The bridge has no session with this remote yet. Wait for it to rejoin, then retry.",not_remote:"This command only applies to remotes.",invalid_payload:"The command was malformed and was not sent.",unsupported:"This remote's firmware doesn't support that command."};let We=class extends pe{constructor(){super(...arguments),this.mac="",this.online=!1,this.isRemote=!1,this.relayNodes=[],this.relayEnabled=!1,this.busy="",this.heartbeatSeconds=60,this.selectedParent="",this.customParentMac="",this.showParentModal=!1,this.confirm=null,this.toast=null}disconnectedCallback(){this.toastTimer&&window.clearTimeout(this.toastTimer),super.disconnectedCallback()}disabled(){return!this.online||!!this.busy}notify(t,e){this.toast={message:t,tone:e},this.toastTimer&&window.clearTimeout(this.toastTimer),this.toastTimer=window.setTimeout(()=>{this.toast=null},6e3)}dispatchChanged(){this.dispatchEvent(new CustomEvent("config-changed",{bubbles:!0,composed:!0}))}async send(t,e,i,s=r=>r==="ok"){this.busy=t;try{const r=await i();(r==null?void 0:r.result)!==void 0&&s(r.result)?(this.notify(r.result==="ok"?e:String(r.result),"ok"),this.dispatchChanged()):(r==null?void 0:r.result)===void 0?(console.error("Unexpected config response:",r),this.notify("The add-on returned an unexpected response.","error")):this.notify(Gg[r.result]??`Command failed: ${r.result}`,"error")}catch(r){this.notify(r instanceof Error?r.message:String(r),"error")}finally{this.busy=""}}reboot(){this.confirm={title:"Reboot this remote?",message:"The remote restarts and rejoins the mesh, usually within a few seconds.",detail:"Its entities are unavailable in Home Assistant until it rejoins.",confirmLabel:"Reboot",run:()=>this.send("reboot","Reboot sent. The remote will rejoin shortly.",()=>S.rebootDevice(this.mac))}}rediscover(){this.confirm={title:"Rediscover the route?",message:"The remote drops its current parent and searches for the best route to the bridge again.",confirmLabel:"Rediscover",run:()=>this.send("rediscover","Rediscover sent. The route may change in the tree.",()=>S.forceRediscover(this.mac))}}setRelay(t){this.send("relay",t?"Relay enabled.":"Relay disabled.",()=>S.setRelay(this.mac,t),e=>!["no_session","timeout","rejected","busy","invalid_payload","not_remote"].includes(e))}applyHeartbeat(){const t=Math.trunc(Number(this.heartbeatSeconds));if(!(t>=5&&t<=3600)){this.notify("Heartbeat must be between 5 and 3600 seconds.","error");return}this.send("heartbeat",`Heartbeat set to ${t} s.`,()=>S.setHeartbeatInterval(this.mac,t))}applyParent(t){const e=Z((this.customParentMac||this.selectedParent).trim());if(!/^[0-9A-F]{2}(:[0-9A-F]{2}){5}$/.test(e)){this.notify("Enter a full MAC address, like AA:BB:CC:DD:EE:FF.","error");return}this.showParentModal=!1,this.send("parent","Preferred parent set.",()=>S.setParentMac(this.mac,e,t))}render(){if(!this.isRemote)return v;const t=this.disabled();return p`
      <div class="card-head">
        <h2>Controls</h2>
        ${this.busy?p`<span class="chip info"><span class="spinner"></span>Sending…</span>`:v}
      </div>
      ${this.online?v:p`<div class="offline notice">${C("info")}<span>Controls are available when the remote is online.</span></div>`}
      <ul class="actions">
        <li>
          <div class="what"><strong>Relay</strong><span>Forward traffic for remotes that can't reach the bridge directly. Currently ${this.relayEnabled?"on":"off"}.</span></div>
          <button class="btn sm" ?disabled=${t} @click=${()=>this.setRelay(!this.relayEnabled)}>${this.relayEnabled?"Turn off":"Turn on"}</button>
        </li>
        <li>
          <div class="what"><strong>Heartbeat</strong><span>How often the remote checks in, 5–3600 seconds.</span></div>
          <form class="inline" @submit=${e=>{e.preventDefault(),this.applyHeartbeat()}}>
            <input type="number" min="5" max="3600" step="1" aria-label="Heartbeat interval in seconds" .value=${String(this.heartbeatSeconds)} ?disabled=${t}
              @input=${e=>{this.heartbeatSeconds=Number(e.target.value)}} />
            <button class="btn sm" type="submit" ?disabled=${t}>Set</button>
          </form>
        </li>
        <li>
          <div class="what"><strong>Preferred parent</strong><span>Route this remote through a specific node when it can reach it.</span></div>
          <button class="btn sm" ?disabled=${t} @click=${()=>{this.showParentModal=!0,this.updateComplete.then(()=>{var e;return(e=this.renderRoot.querySelector("#pp"))==null?void 0:e.focus()})}}>Choose…</button>
        </li>
        <li>
          <div class="what"><strong>Rediscover route</strong><span>Search again for the best path to the bridge.</span></div>
          <button class="btn sm" ?disabled=${t} @click=${()=>this.rediscover()}>Rediscover…</button>
        </li>
        <li>
          <div class="what"><strong>Reboot</strong><span>Restart the remote. It rejoins automatically.</span></div>
          <button class="btn sm danger" ?disabled=${t} @click=${()=>this.reboot()}>${C("power")}Reboot…</button>
        </li>
      </ul>
      ${this.toast?p`<div class="toast notice ${this.toast.tone==="ok"?"ok":"danger"}" role=${this.toast.tone==="ok"?"status":"alert"}>
        ${C(this.toast.tone==="ok"?"checkCircle":"alert")}<span>${this.toast.message}</span></div>`:v}
      ${this.showParentModal?this.renderParentModal():v}
      <esp-confirm-dialog .request=${this.confirm} @closed=${()=>{this.confirm=null}}></esp-confirm-dialog>
    `}renderParentModal(){const t=!!(this.customParentMac.trim()||this.selectedParent),e=this.relayNodes.filter(s=>Z(s.mac)!==Z(this.mac)),i=this.selectedParent==="__custom__";return p`
      <div class="scrim" @click=${s=>{s.target===s.currentTarget&&(this.showParentModal=!1)}}
        @keydown=${s=>{s.key==="Escape"&&(this.showParentModal=!1)}}>
        <section class="modal" role="dialog" aria-modal="true" aria-labelledby="pp-title">
          <h2 id="pp-title">Preferred parent</h2>
          <p>A preference, not a lock: if the remote can't reach this parent it picks another route.</p>
          <div class="field">
            <label for="pp">Parent</label>
            <select id="pp" .value=${this.selectedParent} @change=${s=>{this.selectedParent=s.target.value,this.selectedParent!=="__custom__"&&(this.customParentMac="")}}>
              <option value="">Select a node…</option>
              ${e.map(s=>p`<option value=${Z(s.mac)}>${s.friendly_name||s.esphome_name||s.label||Z(s.mac)}${s.is_bridge?" (bridge)":""}</option>`)}
              <option value="__custom__">Enter a MAC address…</option>
            </select>
          </div>
          ${i?p`
            <div class="field">
              <label for="ppm">MAC address</label>
              <input id="ppm" type="text" autocomplete="off" placeholder="AA:BB:CC:DD:EE:FF" class="mono" .value=${this.customParentMac}
                @input=${s=>{this.customParentMac=s.target.value}} />
            </div>`:v}
          <div class="modal-actions">
            <button class="btn" @click=${()=>{this.showParentModal=!1}}>Cancel</button>
            <button class="btn" ?disabled=${!t||i&&!this.customParentMac.trim()} @click=${()=>this.applyParent(!1)}>Add to list</button>
            <button class="btn primary" ?disabled=${!t||i&&!this.customParentMac.trim()} @click=${()=>this.applyParent(!0)}>Replace parents</button>
          </div>
        </section>
      </div>
    `}};We.styles=[Me,de`
    :host { display: block; }
    .card-head { border-bottom: 0; padding-bottom: 4px; }
    .card-head .spinner { width: 12px; height: 12px; border-color: currentColor; border-top-color: transparent; }
    .offline { margin: 4px 16px 8px; }
    .actions { list-style: none; margin: 0; padding: 0 0 6px; }
    .actions li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 12px 16px;
      border-top: 1px solid var(--line);
    }
    .actions li:first-child { border-top: 0; }
    .what { display: grid; gap: 2px; min-width: 0; }
    .what strong { font-weight: 500; }
    .what span { color: var(--muted); font-size: var(--text-sm); }
    .inline { display: flex; gap: 6px; flex: none; }
    .inline input { width: 88px; min-height: 30px; padding: 4px 8px; }
    .btn.sm svg { width: 16px; height: 16px; }
    .toast { margin: 0 16px 16px; }

    .scrim {
      position: fixed;
      inset: 0;
      z-index: 100;
      display: grid;
      place-items: center;
      padding: 16px;
      background: var(--scrim);
    }
    .modal {
      display: grid;
      gap: 14px;
      width: min(460px, 100%);
      padding: 22px;
      border-radius: var(--radius-lg);
      background: var(--surface-raised);
      box-shadow: var(--shadow-md);
    }
    .modal h2 { font-size: var(--text-xl); font-weight: 500; }
    .modal p { color: var(--ink-2); }
    .modal-actions { display: flex; justify-content: flex-end; gap: 8px; flex-wrap: wrap; margin-top: 4px; }

    @media (max-width: 520px) {
      .actions li { flex-wrap: wrap; }
    }
  `];ot([ie({type:String})],We.prototype,"mac",2);ot([ie({type:Boolean})],We.prototype,"online",2);ot([ie({type:Boolean})],We.prototype,"isRemote",2);ot([ie({type:Array})],We.prototype,"relayNodes",2);ot([ie({type:Boolean})],We.prototype,"relayEnabled",2);ot([b()],We.prototype,"busy",2);ot([b()],We.prototype,"heartbeatSeconds",2);ot([b()],We.prototype,"selectedParent",2);ot([b()],We.prototype,"customParentMac",2);ot([b()],We.prototype,"showParentModal",2);ot([b()],We.prototype,"confirm",2);ot([b()],We.prototype,"toast",2);We=ot([Se("esp-device-config")],We);const Zg={success:["Succeeded","ok"],compile_success:["Built","ok"],failed:["Failed","danger"],aborted:["Aborted","warn"],rejoin_timeout:["Rejoin timeout","danger"],version_mismatch:["Version mismatch","warn"],queued:["Queued","warn"],compile_queued:["Build queued","warn"],compiling:["Building","info"],pending_confirm:["Awaiting confirmation","warn"],starting:["Starting","info"],announcing:["Connecting","info"],transferring:["Uploading","info"],verifying:["Verifying","info"],transfer_success_waiting_rejoin:["Waiting for rejoin","info"]},em=["success","compile_success","failed","aborted","rejoin_timeout","version_mismatch"];function Qd(t){const e=Zg[t];if(e)return{label:e[0],tone:e[1]};const i=t.replace(/_/g," ");return{label:i.charAt(0).toUpperCase()+i.slice(1),tone:"neutral"}}function ni(t,e=""){const{label:i,tone:s}=Qd(t);return p`<span class="chip ${s==="neutral"?"":s}">${s==="info"?p`<span class="spinner chip-spin"></span>`:s==="ok"||s==="danger"?p`<span class="dot ${s}"></span>`:""}${i}${e}</span>`}var tm=Object.defineProperty,im=Object.getOwnPropertyDescriptor,wl=(t,e,i,s)=>{for(var r=s>1?void 0:s?im(e,i):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(s?o(e,i,r):o(r))||r);return s&&r&&tm(e,i,r),r};let or=class extends pe{constructor(){super(...arguments),this.showAbort=!1}abort(){this.dispatchEvent(new CustomEvent("abort",{bubbles:!0,composed:!0}))}render(){const t=Math.max(0,Math.min(100,Number(this.job.percent||0))),e=em.includes(this.job.status),i=this.job.parsed_esphome_name||this.job.esphome_name||this.job.firmware_name||"firmware.ota.bin",s=this.job.current_increment!=null&&this.job.total_increments!=null?`${this.job.current_increment} of ${this.job.total_increments}`:"";return p`
      <section class="panel ${e?this.job.status==="success"?"success":"failure":""}">
        <div class="head">
          <div>
            <span class="what">Uploading ${i}</span>
            <span class="pct">${t}%</span>
          </div>
          ${ni(this.job.status)}
        </div>
        <div class="progress" role="progressbar" aria-label="Upload progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow=${t}>
          <span style="width:${t}%"></span>
        </div>
        <dl class="facts">
          <div><dt>Chunks</dt><dd>${this.job.chunks_sent??0} of ${this.job.total_chunks??"—"}</dd></div>
          <div><dt>Size</dt><dd>${Ni(this.job.firmware_size)}</dd></div>
          <div><dt>Started</dt><dd>${Vi(this.job.started_at)}</dd></div>
          ${this.job.bridge_state?p`<div><dt>Bridge state</dt><dd>${this.job.bridge_state}</dd></div>`:v}
          ${s?p`<div><dt>Increment</dt><dd>${s}</dd></div>`:v}
          ${this.job.retransmit_round?p`<div><dt>Retransmit round</dt><dd>${this.job.retransmit_round}</dd></div>`:v}
        </dl>
        ${this.job.error_msg?p`<p class="error-text">${this.job.error_msg}</p>`:v}
        ${this.showAbort?p`<div><button class="btn sm danger" @click=${this.abort}>Abort upload</button></div>`:v}
      </section>
    `}};or.styles=[Me,de`
    :host { display: block; }
    .panel { display: grid; gap: 12px; padding-top: 14px; border-top: 1px solid var(--line); }
    .head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
    .head > div { display: grid; gap: 2px; min-width: 0; }
    .what { font-weight: 500; overflow-wrap: anywhere; }
    .pct { font-size: var(--text-2xl); font-weight: 400; font-variant-numeric: tabular-nums; line-height: 1.1; }
    .facts { grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); }
  `];wl([ie({type:Object})],or.prototype,"job",2);wl([ie({type:Boolean})],or.prototype,"showAbort",2);or=wl([Se("esp-ota-progress")],or);var sm=Object.defineProperty,rm=Object.getOwnPropertyDescriptor,wt=(t,e,i,s)=>{for(var r=s>1?void 0:s?rm(e,i):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(s?o(e,i,r):o(r))||r);return s&&r&&sm(e,i,r),r};const Ph=new Set(["success","failed","aborted","rejoin_timeout","version_mismatch"]);let st=class extends pe{constructor(){super(...arguments),this.mac="",this.showEditYaml=!1,this.currentJob=null,this.pendingJob=null,this.preflight=null,this.acceptedWarnings=!1,this.busy=!1,this.error="",this.showAbortModal=!1}async upload(t){var s;const e=t.target,i=(s=e.files)==null?void 0:s[0];if(i){this.busy=!0,this.error="",this.acceptedWarnings=!1;try{const r=await S.uploadFirmware(this.mac,i);this.pendingJob=r.job,this.preflight=r.preflight||null,this.dispatchChanged()}catch(r){this.error=r instanceof Error?r.message:String(r)}finally{this.busy=!1,e.value=""}}}async start(){if(this.pendingJob){this.busy=!0,this.error="";try{(await S.startOta(this.pendingJob.id)).job.status==="queued"?(this.pendingJob=null,this.preflight=null,this.dispatchChanged()):(this.pendingJob=null,this.preflight=null,this.dispatchChanged())}catch(t){this.error=t instanceof Error?t.message:String(t)}finally{this.busy=!1}}}goToConfig(){window.location.hash=`/device/${encodeURIComponent(this.mac)}/config`}async abort(){var e,i,s;const t=((e=this.pendingJob)==null?void 0:e.id)??(((i=this.currentJob)==null?void 0:i.status)==="pending_confirm"?(s=this.currentJob)==null?void 0:s.id:null);if(t){this.pendingJob=null,this.preflight=null,this.acceptedWarnings=!1,this.busy=!0,this.error="";try{await S.cancelPending(t),this.dispatchChanged()}catch(r){this.error=r instanceof Error?r.message:String(r)}finally{this.busy=!1}return}try{if((await S.getQueue()).count>0){this.showAbortModal=!0;return}}catch{}this.pendingJob=null,this.preflight=null,this.acceptedWarnings=!1,this.busy=!0,this.error="";try{await S.abortOta(),this.dispatchChanged()}catch(r){this.error=r instanceof Error?r.message:String(r)}finally{this.busy=!1}}async abortQueued(){if(this.currentJob){this.busy=!0,this.error="";try{await S.abortQueuedJob(this.currentJob.id),this.dispatchChanged()}catch(t){this.error=t instanceof Error?t.message:String(t)}finally{this.busy=!1}}}isJobDismissed(t){return sessionStorage.getItem(`esp_tree_ota_dismissed_${t}`)==="1"}dismissAndClear(){var t;((t=this.currentJob)==null?void 0:t.id)!=null&&sessionStorage.setItem(`esp_tree_ota_dismissed_${this.currentJob.id}`,"1"),this.requestUpdate()}dispatchChanged(){this.dispatchEvent(new CustomEvent("ota-changed",{bubbles:!0,composed:!0}))}render(){var h,c,d,u;const t=this.currentJob&&Z(this.currentJob.mac)===Z(this.mac),e=t&&this.currentJob&&Ph.has(this.currentJob.status)?this.currentJob:null,i=t&&((h=this.currentJob)==null?void 0:h.status)==="compile_queued",s=t&&((c=this.currentJob)==null?void 0:c.status)==="compiling",r=t&&((d=this.currentJob)==null?void 0:d.status)==="queued",n=t&&this.currentJob&&!r&&!i&&!s&&this.currentJob.status!=="pending_confirm"&&!Ph.has(this.currentJob.status),o=this.pendingJob,a=!!o&&(!((u=this.preflight)!=null&&u.has_warnings)||this.acceptedWarnings)&&!this.busy,l=!!e&&!this.isJobDismissed(e.id);return p`
      <section class="ota">
        <div class="card-head">
          <h2>Firmware</h2>
          ${t&&this.currentJob&&!e&&!l&&!r&&!i&&!s&&!o&&!n?p`<button class="btn sm danger" ?disabled=${this.busy} @click=${this.abort}>Abort</button>`:v}
        </div>

        ${l&&e?this.renderFlashResult(e):p`
              ${i&&this.currentJob?this.renderCompileQueued(this.currentJob):v}
              ${s&&this.currentJob?this.renderCompiling(this.currentJob):v}
              ${r&&this.currentJob?this.renderQueued(this.currentJob):n&&this.currentJob?p`<esp-ota-progress .job=${this.currentJob} .showAbort=${!0} @abort=${this.abort}></esp-ota-progress>`:v}

              ${!o&&!r&&!n&&!i&&!s?p`
                    ${this.renderRunning()}
                    <div class="idle-controls">
                      ${this.showEditYaml?p`<button class="btn" @click=${this.goToConfig}>${C("code")}Edit YAML &amp; compile</button>`:v}
                      <label class="btn upload ${this.busy?"busy":""}">
                        <input type="file" accept=".ota.bin" ?disabled=${this.busy} @change=${this.upload} />
                        ${this.busy?p`<span class="spinner"></span>Reading firmware…`:p`${C("upload")}Upload .ota.bin`}
                      </label>
                    </div>
                  `:v}

              ${o?this.renderPending(o,a):v}
            `}
        ${this.showAbortModal?this.renderAbortModal():v}
        ${this.error?p`<div class="notice danger error" role="alert">${C("alert")}<span>${this.error}</span></div>`:v}
      </section>
    `}renderRunning(){const t=this.node;if(!t)return v;const e=t.project_version||t.firmware_version;return p`
      <dl class="facts running">
        <div><dt>Running</dt><dd>${e||"Unknown"}${t.project_name?p` <span class="sub">${t.project_name}</span>`:v}</dd></div>
        <div><dt>Built</dt><dd>${t.firmware_build_date||"—"}</dd></div>
        ${t.firmware_version&&t.project_version?p`<div><dt>ESPHome</dt><dd>${t.firmware_version}</dd></div>`:v}
      </dl>
    `}renderQueued(t){const e=t.queue_position??1;return p`
      <div class="queued-wrapper">
        <esp-ota-progress .job=${t}></esp-ota-progress>
        <div class="queued-overlay">
          <span class="queued-icon">${C("clock")}</span>
          <strong>Upload queued</strong>
          <small>Position ${e} in the upload queue</small>
          <button class="btn sm danger" ?disabled=${this.busy} @click=${this.abortQueued}>Abort</button>
        </div>
      </div>
    `}renderCompileQueued(t){const e=(t.queue_position??0)+1;return p`
      <div class="queued-wrapper">
        <div class="queued-overlay compile-overlay">
          <span class="queued-icon">${C("clock")}</span>
          <strong>Build queued</strong>
          <small>Position ${e} in the build queue</small>
          <button class="btn sm danger" ?disabled=${this.busy} @click=${this.abortCompileQueuedJob}>Cancel</button>
        </div>
      </div>
    `}renderCompiling(t){return p`
      <div class="queued-wrapper">
        <div class="queued-overlay compile-overlay compiling-overlay">
          <span class="queued-icon"><span class="spinner"></span></span>
          <strong>Building firmware</strong>
          <a class="view-logs-link" href=${`#/device/${encodeURIComponent(this.mac)}/config`}>View build log</a>
          <button class="btn sm danger" ?disabled=${this.busy} @click=${this.cancelCompile}>Cancel</button>
        </div>
      </div>
    `}async abortCompileQueuedJob(){if(this.currentJob){this.busy=!0,this.error="";try{await S.cancelCompile(this.mac),this.dispatchChanged()}catch(t){this.error=t instanceof Error?t.message:String(t)}finally{this.busy=!1}}}async cancelCompile(){this.busy=!0,this.error="";try{await S.cancelCompile(this.mac),this.dispatchChanged()}catch(t){this.error=t instanceof Error?t.message:String(t)}finally{this.busy=!1}}renderAbortModal(){return p`
      <div class="modal-backdrop" @click=${()=>{this.showAbortModal=!1,this.pendingJob=null,this.preflight=null}}>
        <div class="modal" @click=${t=>t.stopPropagation()}>
          <h3>Other uploads are waiting</h3>
          <p>After aborting this upload, should the next queued job start, or should the queue pause?</p>
          <div class="actions">
            <button class="btn primary" @click=${this.abortAndContinue}>Abort, keep queue running</button>
            <button class="btn" @click=${this.abortAndPause}>Abort and pause queue</button>
            <button @click=${()=>{this.showAbortModal=!1,this.pendingJob=null,this.preflight=null}}>Cancel</button>
          </div>
        </div>
      </div>
    `}async abortAndContinue(){this.showAbortModal=!1,this.pendingJob=null,this.preflight=null,this.busy=!0;try{await S.abortOta(),this.dispatchChanged()}catch(t){this.error=t instanceof Error?t.message:String(t)}finally{this.busy=!1}}async abortAndPause(){this.showAbortModal=!1,this.pendingJob=null,this.preflight=null,this.busy=!0;try{await S.abortOta(),await S.pauseQueue(),this.dispatchChanged()}catch(t){this.error=t instanceof Error?t.message:String(t)}finally{this.busy=!1}}renderPending(t,e){const i=this.preflight,s=t.parsed_esphome_name||t.esphome_name||t.firmware_name||"Selected firmware",n=`chip ${(i!=null&&i.name.match?"match":"mismatch")==="match"?"ok":"danger"}`,o=i!=null&&i.name.match?"Match":"Different",l=`chip ${(i!=null&&i.chip.match?"match":"mismatch")==="match"?"ok":"danger"}`,h=i!=null&&i.chip.match?"Match":"Different",c=(i==null?void 0:i.build_date.status)||"unknown";let d="chip ",u="";return c==="same"?(d+="",u="Same build"):c==="newer"?(d+="ok",u=`Newer · ${i==null?void 0:i.build_date.delta}`):c==="older"&&(d+="warn",u=`Older · ${i==null?void 0:i.build_date.delta}`),i!=null&&i.metadata_unavailable?p`
        <div class="pending">
          <h3>${s}</h3>
          <p class="meta-unavailable">ESP8266 Arduino builds carry no metadata, so name, date and chip can't be checked before flashing.</p>
          <div class="meta-info">
            <span>Size: ${Ni(t.firmware_size)}</span>
            <span>MD5: ${t.firmware_md5||"-"}</span>
          </div>
          <div class="actions">
            <button class="btn primary" ?disabled=${!e} @click=${this.start}>Flash</button>
            <button class="btn" ?disabled=${this.busy} @click=${this.abort}>Cancel</button>
          </div>
        </div>
      `:p`
      <div class="pending">
        <h3>${s}</h3>
        <table class="compare-table">
          <thead>
            <tr><th></th><th>On the remote</th><th>New firmware</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Name</td>
              <td>${(i==null?void 0:i.name.current)||"-"}</td>
              <td>${(i==null?void 0:i.name.new)||"-"}<br><span class="${n}">${o}</span></td>
            </tr>
            <tr>
              <td>Build date</td>
              <td>${(i==null?void 0:i.build_date.current)||"-"}</td>
              <td>${(i==null?void 0:i.build_date.new)||"-"}<br><span class="${d}">${u}</span></td>
            </tr>
            <tr>
              <td>Chip</td>
              <td>${(i==null?void 0:i.chip.current)||"-"}</td>
              <td>${(i==null?void 0:i.chip.new)||"-"}<br><span class="${l}">${h}</span></td>
            </tr>
          </tbody>
        </table>
        <div class="meta-info">
          <span>Size: ${Ni(t.firmware_size)}</span>
          <span>MD5: ${t.firmware_md5||"-"}</span>
        </div>
        ${i!=null&&i.has_warnings?p`
              <div class="warnings">
                ${i.warnings.map(f=>p`<p>${f}</p>`)}
                <label>
                  <input type="checkbox" .checked=${this.acceptedWarnings} @change=${f=>this.acceptedWarnings=f.target.checked} />
                  Flash anyway, I understand the warnings
                </label>
              </div>
            `:v}
        <div class="actions">
          <button class="btn primary" ?disabled=${!e} @click=${this.start}>Flash</button>
          <button class="btn" ?disabled=${this.busy} @click=${this.abort}>Cancel</button>
        </div>
      </div>
    `}renderFlashResult(t){const e=t.status==="success",i=e?"success":"failure",s=e?"Update complete":(()=>{const w=t.status.replaceAll("_"," ");return w.charAt(0).toUpperCase()+w.slice(1)})(),r=e?"The device accepted the new firmware and rejoined the network.":t.error_msg||"The firmware update did not complete successfully.",n=t.parsed_esphome_name||t.esphome_name||t.firmware_name||"-",o=this.node.esphome_name||"-",a=n===o||n==="-"&&o==="-",l=t.parsed_build_date||"-",h=this.node.firmware_build_date||"-",c=l===h||l==="-"&&h==="-",d=t.parsed_chip_name||"-",u=this.node.chip_name||"-",f=d===u||d==="-"&&u==="-",g=t.firmware_md5||"-",m=this.node.firmware_md5||"-",y=g===m||g==="-"&&m==="-";return e?p`
        <div class="flash-result ${i}">
          <div class="result-banner">
            <span class="result-icon">${C("checkCircle")}</span>
            <span class="result-label">${s}</span>
          </div>
          <h3>${n}</h3>
          <p class="result-message">${r}</p>
          <div class="actions">
            <button class="btn primary" @click=${this.dismissAndClear}>Done</button>
          </div>
        </div>
      `:p`
      <div class="flash-result ${i}">
        <div class="result-banner">
          <span class="result-icon">${C("alert")}</span>
          <span class="result-label">${s}</span>
        </div>
        <h3>${n}</h3>
        <p class="result-message">${r}</p>
        <table class="compare-table">
          <thead>
            <tr><th></th><th>Flashed</th><th>Remote now</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Name</td>
              <td>${n}</td>
              <td>${o} ${a?v:p`<span class="chip warn">Changed</span>`}</td>
            </tr>
            <tr>
              <td>Build date</td>
              <td>${l}</td>
              <td>${h} ${c?v:p`<span class="chip warn">Changed</span>`}</td>
            </tr>
            <tr>
              <td>Chip</td>
              <td>${d}</td>
              <td>${u} ${f?v:p`<span class="chip warn">Changed</span>`}</td>
            </tr>
            <tr>
              <td>MD5</td>
              <td>${g}</td>
              <td>${m} ${y?v:p`<span class="chip warn">Changed</span>`}</td>
            </tr>
          </tbody>
        </table>
        <div class="meta-info">
          <span>Size: ${Ni(t.firmware_size)}</span>
          ${t.completed_at?p`<span>Completed: ${Vi(t.completed_at)}</span>`:v}
        </div>
        <div class="actions">
          <button class="btn primary" @click=${this.dismissAndClear}>Done</button>
        </div>
      </div>
    `}};st.styles=[Me,de`
    :host { display: block; }
    .ota { display: grid; }
    .card-head { border-bottom: 0; padding-bottom: 4px; }
    .ota > :not(.card-head) { margin: 0 16px 16px; }
    .running { margin-bottom: 16px; }
    .running .sub { color: var(--muted); font-size: var(--text-sm); }
    .idle-controls { display: flex; flex-wrap: wrap; gap: 8px; }
    .upload { position: relative; overflow: hidden; }
    .upload input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
    .upload:focus-within { outline: 2px solid var(--primary); outline-offset: 2px; }
    .upload .spinner { width: 14px; height: 14px; }

    .queued-wrapper { display: grid; gap: 12px; }
    .queued-overlay {
      display: grid;
      grid-template-columns: auto 1fr auto;
      grid-template-areas: 'icon title action' 'icon sub action';
      align-items: center;
      column-gap: 12px;
      padding: 14px 16px;
      border-top: 1px solid var(--line);
      padding-left: 0; padding-right: 0;
    }
    .compiling-overlay { grid-template-areas: 'icon title action' 'icon sub action'; }
    .queued-icon { grid-area: icon; display: grid; place-items: center; width: 32px; height: 32px; color: var(--accent); }
    .compiling-overlay .queued-icon { color: var(--info); }
    .queued-icon svg { width: 24px; height: 24px; }
    .queued-overlay strong { grid-area: title; font-weight: 500; }
    .queued-overlay small, .queued-overlay .view-logs-link { grid-area: sub; color: var(--muted); font-size: var(--text-sm); }
    .queued-overlay .view-logs-link { color: var(--primary); }
    .queued-overlay .btn { grid-area: action; }

    .pending, .flash-result { display: grid; gap: 12px; }
    .pending h3, .flash-result h3 { font-size: var(--text-lg); font-weight: 500; }
    .compare-table { width: 100%; border-collapse: collapse; font-size: var(--text-sm); }
    .compare-table th { text-align: left; font-weight: 500; color: var(--muted); font-size: var(--text-xs); padding: 6px 8px; border-bottom: 1px solid var(--line); }
    .compare-table td { padding: 8px; border-bottom: 1px solid var(--line); vertical-align: top; overflow-wrap: anywhere; }
    .compare-table td:first-child { color: var(--muted); white-space: nowrap; }
    .compare-table .chip { margin-top: 4px; }
    .meta-info { display: flex; flex-wrap: wrap; gap: 4px 16px; color: var(--muted); font-size: var(--text-sm); overflow-wrap: anywhere; }
    .meta-unavailable { color: var(--muted); }
    .warnings { display: grid; gap: 8px; padding: 12px 14px; border-radius: var(--radius-md); background: var(--accent-soft); color: var(--ink); }
    .warnings label { display: flex; gap: 8px; align-items: center; font-weight: 500; }
    .warnings input { accent-color: var(--primary); width: 16px; height: 16px; }
    .actions { display: flex; flex-wrap: wrap; gap: 8px; }

    .result-banner { display: flex; align-items: center; gap: 8px; font-weight: 500; }
    .result-icon { display: inline-flex; }
    .result-icon svg { width: 22px; height: 22px; }
    .flash-result.success .result-banner { color: var(--ok); }
    .flash-result.failure .result-banner { color: var(--danger); }
    .result-message { color: var(--ink-2); }

    .modal-backdrop { position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; padding: 16px; background: var(--scrim); }
    .modal { display: grid; gap: 12px; width: min(460px, 100%); padding: 22px; border-radius: var(--radius-lg); background: var(--surface-raised); box-shadow: var(--shadow-md); }
    .modal h3 { font-size: var(--text-xl); font-weight: 500; }
    .modal p { color: var(--ink-2); }
    .modal .actions { justify-content: flex-end; margin-top: 4px; }
  `];wt([ie({type:String})],st.prototype,"mac",2);wt([ie({type:Object})],st.prototype,"node",2);wt([ie({type:Boolean})],st.prototype,"showEditYaml",2);wt([ie({type:Object})],st.prototype,"currentJob",2);wt([b()],st.prototype,"pendingJob",2);wt([b()],st.prototype,"preflight",2);wt([b()],st.prototype,"acceptedWarnings",2);wt([b()],st.prototype,"busy",2);wt([b()],st.prototype,"error",2);wt([b()],st.prototype,"showAbortModal",2);st=wt([Se("esp-ota-box")],st);var nm=Object.defineProperty,om=Object.getOwnPropertyDescriptor,Pr=(t,e,i,s)=>{for(var r=s>1?void 0:s?om(e,i):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(s?o(e,i,r):o(r))||r);return s&&r&&nm(e,i,r),r};let Qi=class extends pe{constructor(){super(...arguments),this.jobs=[],this.mac="",this.busyJob=null,this.error=""}retained(t){return!!t.firmware_path&&!!t.retained_until&&t.retained_until>Math.floor(Date.now()/1e3)}viewLog(t){const e=`/device/${encodeURIComponent(this.mac||t.mac)}`;window.location.hash=`/job/${t.id}?from=${encodeURIComponent(e)}`}async reflash(t){this.busyJob=t.id,this.error="";try{const e=await S.reflash(t.id);this.dispatchEvent(new CustomEvent("ota-reflash-result",{bubbles:!0,composed:!0,detail:{job:e.job,preflight:e.preflight}})),this.dispatchChanged()}catch(e){this.error=e instanceof Error?e.message:String(e)}finally{this.busyJob=null}}async deleteRetained(t){this.busyJob=t.id,this.error="";try{await S.deleteRetained(t.id),this.dispatchChanged()}catch(e){this.error=e instanceof Error?e.message:String(e)}finally{this.busyJob=null}}dispatchChanged(){this.dispatchEvent(new CustomEvent("ota-changed",{bubbles:!0,composed:!0}))}render(){return p`
      <div class="card-head"><h2>Upload history</h2></div>
      ${this.error?p`<div class="notice danger pad" role="alert">${C("alert")}<span>${this.error}</span></div>`:v}
      ${this.jobs.length?p`<ul class="hist">
            ${this.jobs.map(t=>{const e=t.completed_at&&t.started_at?yt(t.completed_at-t.started_at):"";return p`
                <li>
                  <span class="what">
                    <strong>${t.parsed_esphome_name||t.esphome_name||t.firmware_name||"firmware.ota.bin"}</strong>
                    <small>${[t.parsed_version?`v${t.parsed_version}`:"",t.parsed_build_date||t.firmware_name||"",t.firmware_size?Ni(t.firmware_size):"",e?`took ${e}`:""].filter(Boolean).join(" · ")}</small>
                    ${t.error_msg?p`<small class="err">${t.error_msg}</small>`:v}
                  </span>
                  ${ni(t.status)}
                  <span class="when" title=${Vi(t.created_at)}>${kn(t.created_at)}</span>
                  <span class="row-actions">
                    <button class="btn sm text" @click=${()=>this.viewLog(t)}>View log</button>
                    ${this.retained(t)?p`
                          <button class="btn sm" ?disabled=${this.busyJob===t.id} @click=${()=>this.reflash(t)}>Flash again</button>
                          <button class="btn sm text" ?disabled=${this.busyJob===t.id} @click=${()=>this.deleteRetained(t)}>Delete binary</button>`:v}
                  </span>
                </li>`})}
          </ul>`:p`<p class="none">No uploads to this remote yet.</p>`}
    `}};Qi.styles=[Me,xl,de`
    :host { display: block; }
    .none { padding: 12px 16px 16px; color: var(--muted); }
    .pad { margin: 12px 16px; }
  `];Pr([ie({type:Array})],Qi.prototype,"jobs",2);Pr([ie({type:String})],Qi.prototype,"mac",2);Pr([b()],Qi.prototype,"busyJob",2);Pr([b()],Qi.prototype,"error",2);Qi=Pr([Se("esp-flash-history")],Qi);var am=Object.defineProperty,lm=Object.getOwnPropertyDescriptor,kl=(t,e,i,s)=>{for(var r=s>1?void 0:s?lm(e,i):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(s?o(e,i,r):o(r))||r);return s&&r&&am(e,i,r),r};let ar=class extends pe{constructor(){super(...arguments),this.jobs=[],this.mac=""}viewJobLog(t){const e=`/device/${encodeURIComponent(this.mac)}`;window.location.hash=`/job/${t.id}?from=${encodeURIComponent(e)}`}render(){const t=this.jobs.filter(e=>e.status==="compile_success"||e.status==="failed");return p`
      <div class="card-head"><h2>Build history</h2></div>
      ${t.length?p`<ul class="hist">
            ${t.map(e=>{const i=e.completed_at&&e.started_at?yt(e.completed_at-e.started_at):"";return p`
                <li>
                  <span class="what">
                    <strong>${e.parsed_esphome_name||e.firmware_name||"Build"}</strong>
                    <small>${[e.parsed_version?`v${e.parsed_version}`:"",e.parsed_build_date||"",i?`took ${i}`:""].filter(Boolean).join(" · ")}</small>
                    ${e.error_msg?p`<small class="err">${e.error_msg}</small>`:v}
                  </span>
                  ${ni(e.status)}
                  <span class="when">${kn(e.created_at)}</span>
                  <span class="row-actions">
                    <button class="btn sm text" @click=${()=>this.viewJobLog(e)}>View log</button>
                    ${e.status==="compile_success"?p`<a class="btn sm text" href=${S.downloadJobBinary(e.id)} target="_blank" rel="noopener">${C("download")}.bin</a>`:v}
                  </span>
                </li>`})}
          </ul>`:p`<p class="none">No builds for this remote yet. Edit its YAML and compile to create one.</p>`}
    `}};ar.styles=[Me,xl,de`
    :host { display: block; }
    .none { padding: 12px 16px 16px; color: var(--muted); }
    .btn svg { width: 16px; height: 16px; }
  `];kl([ie({type:Array})],ar.prototype,"jobs",2);kl([ie({type:String})],ar.prototype,"mac",2);ar=kl([Se("esp-compile-history")],ar);/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const hm=t=>t.strings===void 0,cm={},ZC=(t,e=cm)=>t._$AH=e;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const dm={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4},um=t=>(...e)=>({_$litDirective$:t,values:e});let fm=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,i,s){this._$Ct=e,this._$AM=i,this._$Ci=s}_$AS(e,i){return this.update(e,i)}update(e,i){return this.render(...i)}};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ks=(t,e)=>{var s;const i=t._$AN;if(i===void 0)return!1;for(const r of i)(s=r._$AO)==null||s.call(r,e,!1),Ks(r,e);return!0},Cn=t=>{let e,i;do{if((e=t._$AM)===void 0)break;i=e._$AN,i.delete(t),t=e}while((i==null?void 0:i.size)===0)},Kd=t=>{for(let e;e=t._$AM;t=e){let i=e._$AN;if(i===void 0)e._$AN=i=new Set;else if(i.has(t))break;i.add(t),mm(e)}};function pm(t){this._$AN!==void 0?(Cn(this),this._$AM=t,Kd(this)):this._$AM=t}function gm(t,e=!1,i=0){const s=this._$AH,r=this._$AN;if(r!==void 0&&r.size!==0)if(e)if(Array.isArray(s))for(let n=i;n<s.length;n++)Ks(s[n],!1),Cn(s[n]);else s!=null&&(Ks(s,!1),Cn(s));else Ks(this,t)}const mm=t=>{t.type==dm.CHILD&&(t._$AP??(t._$AP=gm),t._$AQ??(t._$AQ=pm))};class bm extends fm{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,i,s){super._$AT(e,i,s),Kd(this),this.isConnected=e._$AU}_$AO(e,i=!0){var s,r;e!==this.isConnected&&(this.isConnected=e,e?(s=this.reconnected)==null||s.call(this):(r=this.disconnected)==null||r.call(this)),i&&(Ks(this,e),Cn(this))}setValue(e){if(hm(this._$Ct))this._$Ct._$AI(e,this);else{const i=[...this._$Ct._$AH];i[this._$Ci]=e,this._$Ct._$AI(i,this,0)}}disconnected(){}reconnected(){}}const Po=new WeakMap,vm=um(class extends bm{render(t){return v}update(t,[e]){var s;const i=e!==this.G;return i&&this.G!==void 0&&this.rt(void 0),(i||this.lt!==this.ct)&&(this.G=e,this.ht=(s=t.options)==null?void 0:s.host,this.rt(this.ct=t.element)),v}rt(t){if(this.isConnected||(t=void 0),typeof this.G=="function"){const e=this.ht??globalThis;let i=Po.get(e);i===void 0&&(i=new WeakMap,Po.set(e,i)),i.get(this.G)!==void 0&&this.G.call(this.ht,void 0),i.set(this.G,t),t!==void 0&&this.G.call(this.ht,t)}else this.G.value=t}get lt(){var t,e;return typeof this.G=="function"?(t=Po.get(this.ht??globalThis))==null?void 0:t.get(this.G):(e=this.G)==null?void 0:e.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});var ym=Object.defineProperty,xm=Object.getOwnPropertyDescriptor,Es=(t,e,i,s)=>{for(var r=s>1?void 0:s?xm(e,i):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(s?o(e,i,r):o(r))||r);return s&&r&&ym(e,i,r),r};const wm=100;let ui=class extends pe{constructor(){super(...arguments),this.mac="",this.visible=!0,this.stopped=!1,this.logs=[],this.autoScroll=!0,this.eventSource=null,this._macObserved="",this.reconnectAttempts=0,this.reconnectDelay=1e3,this.pendingLogs=[],this.flushTimer=null,this.scrollTarget=null}connectedCallback(){super.connectedCallback(),this.visible&&this.connect()}disconnectedCallback(){this.disconnect(),super.disconnectedCallback()}updated(t){this.hidden=!this.visible,t.has("visible")&&(this.visible?this.connect():(this.flushLogs(),this.disconnect())),t.has("stopped")&&this.stopped&&(this.flushLogs(),this.disconnect()),t.has("mac")&&this.mac!==this._macObserved&&(this.logs=[],this.pendingLogs=[],this.reconnectAttempts=0,this.visible&&this.connect())}connect(){this.stopped||!this.visible||(this.disconnect(),this.mac&&(this._macObserved=this.mac,this.eventSource=S.streamCompileLogs(this.mac,t=>{if(this.pendingLogs.push(t),t==="[build exited with code 0]"||t==="[build exited with code 1]"||t==="[status: idle]"){this.flushLogs(),this.stopped=!0,this.disconnect();return}this.scheduleFlush()},t=>{this.handleStreamError(t)})))}handleStreamError(t){if(this.stopped||!this.visible)return;this.eventSource&&(this.eventSource.close(),this.eventSource=null),this.reconnectAttempts++;const e=this.reconnectDelay*Math.pow(2,Math.min(this.reconnectAttempts-1,10));setTimeout(()=>this.connect(),e)}disconnect(){this.eventSource&&(this.eventSource.close(),this.eventSource=null),this.reconnectAttempts=0}scrollToBottom(){this.scrollTarget&&(this.scrollTarget.scrollTop=this.scrollTarget.scrollHeight)}toggleAutoScroll(){this.autoScroll=!this.autoScroll}clearLogs(){this.logs=[],this.pendingLogs=[]}scheduleFlush(){this.flushTimer||(this.flushTimer=setTimeout(()=>this.flushLogs(),wm))}flushLogs(){if(this.flushTimer&&(clearTimeout(this.flushTimer),this.flushTimer=null),this.pendingLogs.length===0)return;const t=[...this.logs,...this.pendingLogs].slice(-800);this.pendingLogs=[],this.logs=t,this.autoScroll&&this.visible&&this.updateComplete.then(()=>this.scrollToBottom())}render(){return p`
      <div class="log-header">
        <span class="label">Build log</span>
        <div class="controls">
          <button class="ctrl-btn" @click=${this.clearLogs}>Clear</button>
          <button class="ctrl-btn ${this.autoScroll?"active":""}" @click=${this.toggleAutoScroll}>
            ${this.autoScroll?"Following output":"Paused, click to follow"}
          </button>
        </div>
      </div>
      <div class="log-body" ${vm(t=>{this.scrollTarget=t})}>
        ${this.logs.length===0?p`<span class="empty">Waiting for build output…</span>`:p`<pre>${this.logs.join(`
`)}</pre>`}
      </div>
    `}};ui.styles=[Me,de`
    :host {
      display: flex;
      flex-direction: column;
      background: var(--log-bg);
      border-radius: var(--radius-md);
      overflow: hidden;
    }
    :host([hidden]) { display: none; }
    .log-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      padding: 6px 8px 6px 14px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      color: var(--log-muted);
      font-size: var(--text-xs);
    }
    .label { font-weight: 500; }
    .controls { display: flex; gap: 4px; }
    .ctrl-btn {
      min-height: 28px;
      padding: 0 10px;
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: var(--radius-sm);
      background: transparent;
      color: var(--log-ink);
      font: inherit;
      font-size: var(--text-xs);
      cursor: pointer;
    }
    .ctrl-btn:hover { background: rgba(255, 255, 255, 0.08); }
    .ctrl-btn.active { border-color: rgba(255, 255, 255, 0.3); }
    .log-body {
      flex: 1;
      min-height: 160px;
      max-height: 480px;
      overflow: auto;
      padding: 10px 14px;
      color: var(--log-ink);
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      line-height: 1.6;
    }
    pre { margin: 0; white-space: pre-wrap; overflow-wrap: anywhere; font: inherit; }
    .empty { color: var(--log-muted); }
  `];Es([ie({type:String})],ui.prototype,"mac",2);Es([ie({type:Boolean})],ui.prototype,"visible",2);Es([ie({type:Boolean})],ui.prototype,"stopped",2);Es([b()],ui.prototype,"logs",2);Es([b()],ui.prototype,"autoScroll",2);ui=Es([Se("esp-compile-log-viewer")],ui);var km=Object.defineProperty,Sm=Object.getOwnPropertyDescriptor,at=(t,e,i,s)=>{for(var r=s>1?void 0:s?Sm(e,i):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(s?o(e,i,r):o(r))||r);return s&&r&&km(e,i,r),r};const Cm=["queued","starting","transferring","verifying","transfer_success_waiting_rejoin"],To=["compile_queued","compiling"];let ze=class extends pe{constructor(){super(...arguments),this.mac="",this.node=null,this.topology=[],this.currentJob=null,this.history=[],this.compileHistoryList=[],this.compileStatus="idle",this.loading=!0,this.error="",this.haBusy=!1,this.haNotice="",this.compileTimer=null}connectedCallback(){super.connectedCallback(),this.load(),this.schedulePoll()}disconnectedCallback(){this.timer&&window.clearInterval(this.timer),this.compileTimer&&window.clearInterval(this.compileTimer),super.disconnectedCallback()}schedulePoll(){this.timer&&window.clearInterval(this.timer);const e=this.currentJob&&Cm.includes(this.currentJob.status)?2e3:5e3;this.timer=window.setInterval(()=>void this.load(!1),e)}pollCompileStatus(){S.getCompileStatus(this.mac).then(t=>{this.compileStatus=t.status,To.includes(t.status)?this.compileTimer||(this.compileTimer=setInterval(()=>this.pollCompileStatus(),3e3)):this.compileTimer&&(clearInterval(this.compileTimer),this.compileTimer=null)}).catch(()=>{})}handleReflashResult(t){this.otaBox.preflight=t.detail.preflight,this.load(!1)}updated(){this.schedulePoll()}async load(t=!0){t&&(this.loading=!0);try{const[e,i,s,r,n]=await Promise.all([S.topology(),S.currentOtaForDevice(this.mac),S.getQueue(),S.history(this.mac),S.getCompileHistory(this.mac)]);this.topology=e,this.node=e.find(h=>Z(h.mac)===Z(this.mac))||null;const o=Z(this.mac),a=(s.queued_jobs??[]).find(h=>Z(h.mac)===o)??null;i&&i.job&&Z(i.job.mac)===o?this.currentJob=i.job:a?this.currentJob=a:this.currentJob=null,this.history=r.jobs,this.compileHistoryList=n.jobs,this.error="";const l=await S.getCompileStatus(this.mac).catch(()=>null);l&&(this.compileStatus=l.status),To.includes(this.compileStatus)&&this.pollCompileStatus()}catch(e){this.error=e instanceof Error?e.message:String(e)}finally{this.loading=!1}}async addToHomeAssistant(){this.haBusy=!0,this.haNotice="";try{const t=await S.integrationSetup();this.haNotice=t.success?"Home Assistant is adding this remote. It can take a few seconds to appear.":t.error||"Home Assistant didn't accept the request.",await this.load(!1)}catch(t){this.haNotice=t instanceof Error?t.message:String(t)}finally{this.haBusy=!1}}render(){if(this.loading)return p`<div class="card loading" aria-live="polite"><span class="spinner"></span>Loading device…</div>`;if(this.error)return p`<div class="notice danger" role="alert">${C("alert")}<span><strong>Couldn't load this device.</strong> ${this.error}</span>
        <span class="notice-actions"><button class="btn sm" @click=${()=>void this.load()}>Try again</button></span></div>`;if(!this.node)return p`
        <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Network</a>${C("chevronRight")}<span class="mono">${this.mac}</span></nav>
        <section class="card">
          <div class="empty">
            ${C("search")}
            <strong>Device not in the network</strong>
            <p>${this.mac} isn't in the bridge's current topology. It may have been deleted, or it hasn't joined since the add-on restarted.</p>
            <a class="btn" href="#/">Back to network</a>
          </div>
        </section>
      `;const t=this.node,e=!t.is_bridge,i=this.topology.filter(l=>!l.online||Z(l.mac)===Z(t.mac)?!1:!!l.is_bridge||!!l.can_relay||(l.hops??0)>0),s=this.topology.find(l=>Z(l.mac)===Z(t.parent_mac||"")),r=us(t),n=yl(t),o={strong:"Strong",fair:"Fair",weak:"Weak",down:"",unknown:""}[n],a=`/config/devices/device/${t.ha_device_id}`;return p`
      <div class="page">
        <div>
          <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Network</a>${C("chevronRight")}<span aria-current="page">${r}</span></nav>
          <div class="page-head">
            <div class="ident">
              <span class="glyph ${t.online?"":"off"} ${t.is_bridge?"bridge":""}" aria-hidden="true">${C(t.is_bridge?"bridge":t.relay_enabled?"relay":"chip")}</span>
              <div>
                <h1>${r}</h1>
                <p class="sub">
                  ${t.online?p`<span class="chip ok"><span class="dot ok"></span>Online</span>`:p`<span class="chip danger"><span class="dot danger"></span>${Sn(t)}</span>`}
                  <span>${t.is_bridge?"Bridge":t.relay_enabled?"Remote · relay":"Remote"}</span>
                  <span class="mono">${t.mac}</span>
                  ${t.chip_name?p`<span>${t.chip_name}</span>`:v}
                </p>
              </div>
            </div>
            <div class="page-actions">
              ${t.ha_device_id?p`<a class="btn" href=${a} target="_top" rel="noopener">${C("ha")}Open in Home Assistant</a>`:p`<button class="btn" ?disabled=${this.haBusy} @click=${()=>void this.addToHomeAssistant()}>${this.haBusy?p`<span class="spinner"></span>Adding…`:p`${C("ha")}Add to Home Assistant`}</button>`}
              ${e?p`<a class="btn primary" href=${`#/device/${encodeURIComponent(t.mac)}/config`}>${C("code")}Edit YAML</a>`:v}
            </div>
          </div>
        </div>

        ${this.haNotice?p`<div class="notice info" role="status">${C("info")}<span>${this.haNotice}</span></div>`:v}

        <section class="card">
          <dl class="facts summary">
            <div><dt>Last seen</dt><dd>${t.is_bridge?"Now":t.last_seen_ago!=null?`${yt(t.last_seen_ago)||"0s"} ago`:"—"}</dd></div>
            <div><dt>Uptime</dt><dd>${yt(t.uptime_s)||"—"}</dd></div>
            <div><dt>Signal</dt><dd>${t.rssi==null?"—":p`${t.rssi} dBm${o?p` <span class="q ${n}">${o}</span>`:v}`}</dd></div>
            <div><dt>Route</dt><dd>${t.is_bridge?"Root of the mesh":s?p`via <a href=${`#/device/${encodeURIComponent(s.mac)}`}>${us(s)}</a>${(t.hops??0)>0?p` · ${t.hops} hop${t.hops===1?"":"s"}`:v}`:"Unknown (retained)"}</dd></div>
            <div><dt>Firmware</dt><dd>${t.project_version||t.firmware_version||"—"}</dd></div>
            <div><dt>Relay</dt><dd>${t.relay_enabled?"On":t.can_relay?"Available, off":"Not supported"}</dd></div>
          </dl>
        </section>

        <div class="layout ${e?"":"single"}">
          <section class="card">
            <esp-ota-box .mac=${t.mac} .node=${t} .currentJob=${this.currentJob} .showEditYaml=${e} @ota-changed=${()=>void this.load(!1)}></esp-ota-box>
          </section>
          ${e?p`
            <section class="card">
              <esp-device-config
                .mac=${t.mac}
                .online=${!!t.online}
                .isRemote=${e}
                .relayNodes=${i}
                .relayEnabled=${!!t.relay_enabled}
                @config-changed=${()=>void this.load(!1)}
              ></esp-device-config>
            </section>`:v}
        </div>

        ${To.includes(this.compileStatus)||this.compileStatus==="failed"?p`<section class="card log-card">
              <div class="card-head"><h2>${this.compileStatus==="failed"?"Last build failed":"Building firmware"}</h2></div>
              <div class="card-body"><esp-compile-log-viewer .mac=${this.mac} .visible=${!0}></esp-compile-log-viewer></div>
            </section>`:v}

        <div class="layout">
          <section class="card">
            <esp-flash-history .jobs=${this.history} @ota-changed=${()=>void this.load(!1)} @ota-reflash-result=${this.handleReflashResult}></esp-flash-history>
          </section>
          <section class="card">
            <esp-compile-history .jobs=${this.compileHistoryList} .mac=${this.mac}></esp-compile-history>
          </section>
        </div>
      </div>
    `}};ze.styles=[Me,de`
    :host { display: block; }
    .crumbs svg { width: 14px; height: 14px; color: var(--faint); }
    .ident { display: flex; gap: 14px; align-items: center; min-width: 0; }
    .ident > div { min-width: 0; }
    .ident h1 { overflow-wrap: anywhere; }
    .glyph { display: grid; place-items: center; width: 48px; height: 48px; flex: none; border-radius: 50%; background: var(--surface-subtle); color: var(--muted); }
    .glyph svg { width: 26px; height: 26px; }
    .glyph.bridge { background: var(--primary-soft); color: var(--primary); }
    .glyph.off { background: var(--danger-soft); color: var(--danger); }
    .sub { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 12px; }
    .page-actions .btn svg { width: 18px; height: 18px; }
    .page-actions .spinner { width: 14px; height: 14px; }
    .summary { padding: 16px; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
    .q { font-size: var(--text-xs); font-weight: 500; }
    .q.strong { color: var(--ok); }
    .q.fair { color: var(--accent); }
    .q.weak { color: var(--danger); }
    .layout { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr); gap: 16px; align-items: start; }
    .layout.single { grid-template-columns: minmax(0, 1fr); }
    .layout > .card { overflow: hidden; }
    .loading { display: flex; align-items: center; gap: 12px; padding: 24px 16px; color: var(--muted); }
    @media (max-width: 960px) {
      .layout { grid-template-columns: minmax(0, 1fr); }
    }
  `];at([ie({type:String})],ze.prototype,"mac",2);at([b()],ze.prototype,"node",2);at([b()],ze.prototype,"topology",2);at([b()],ze.prototype,"currentJob",2);at([b()],ze.prototype,"history",2);at([b()],ze.prototype,"compileHistoryList",2);at([b()],ze.prototype,"compileStatus",2);at([b()],ze.prototype,"loading",2);at([b()],ze.prototype,"error",2);at([b()],ze.prototype,"haBusy",2);at([b()],ze.prototype,"haNotice",2);at([vl("esp-ota-box")],ze.prototype,"otaBox",2);ze=at([Se("esp-device-detail")],ze);var $m=Object.defineProperty,Om=Object.getOwnPropertyDescriptor,le=(t,e,i,s)=>{for(var r=s>1?void 0:s?Om(e,i):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(s?o(e,i,r):o(r))||r);return s&&r&&$m(e,i,r),r};let te=class extends pe{constructor(){super(...arguments),this.autoInit=!1,this.config=null,this.configuredBridges=[],this.discoveredBridges=[],this.loading=!0,this.discovering=!1,this.saving=!1,this.error="",this.saved="",this.containerStatus=null,this.cleaningArtifacts=!1,this.artifactsMessage="",this.editingBridgeId=null,this.editApiKey="",this.editOtaPassword="",this.newBridgeApiKey="",this.showManualEntry=!1,this.manualHost="",this.manualPort=80,this.manualApiKey="",this.showScanLog=!1,this.scanLogContent="",this.scanLogLoading=!1,this.restarting=!1,this.restartFeedback="",this.confirm=null,this.integrationPollTimer=null}connectedCallback(){super.connectedCallback(),this.load(),this.loadContainerStatus(),this.integrationPollTimer=setInterval(()=>void this.pollIntegrationStatus(),5e3),this.autoInit&&this.discover()}disconnectedCallback(){super.disconnectedCallback(),this.integrationPollTimer&&(clearInterval(this.integrationPollTimer),this.integrationPollTimer=null)}async pollIntegrationStatus(){try{this.config=await S.config()}catch{}}async restartHa(){this.restarting=!0,this.restartFeedback="";try{const t=await S.requestRestart();t.success?this.restartFeedback="Restart requested":this.restartFeedback=t.error||"Restart failed"}catch{this.restartFeedback="Restart failed"}finally{this.restarting=!1,setTimeout(()=>{this.restartFeedback=""},4e3)}}async load(){this.loading=!0,this.error="";try{this.config=await S.config(),this.configuredBridges=await S.getBridges()}catch(t){this.error=t instanceof Error?t.message:String(t)}finally{this.loading=!1}}async loadContainerStatus(){try{this.containerStatus=await S.getContainerStatus()}catch{this.containerStatus=null}}isBridgeConnected(t){var i;if(typeof t.client_connected=="boolean")return t.client_connected;if(!((i=this.config)!=null&&i.active_bridge)||this.config.active_bridge.error)return!1;const e=this.config.active_bridge;return e.uuid===t.uuid||e.host===t.host&&e.port===t.port}bridgeSkippedReason(t){return(t.client_skipped_reason||"").trim()}isBridgeActive(t){return!!t.is_active}isSerial(t){return t.transport==="serial"}bridgeHostname(t){return this.isSerial(t)?"serial":t.hostname||"-"}bridgeAddress(t){return this.isSerial(t)?t.serial_port||"-":t.host||"-"}async discover(){this.discovering=!0,this.error="",this.newBridgeApiKey="";try{const t=await S.discoverBridges();this.discoveredBridges=t.bridges,this.discoveredBridges.length===0&&(this.error="No bridges found. Make sure your bridge is powered on and connected to the same network, then try again. You can also use Manual IP to connect directly.")}catch(t){const e=t instanceof Error?t.message:String(t);e==="timeout"?this.error="Scan timed out. Try again or use View Scan Log to see scanned IPs, or use Manual IP to connect directly.":e==="cancelled"?this.error="":this.error=e}finally{this.discovering=!1}}async triggerScan(){this.discovering=!0,this.error="",this.newBridgeApiKey="";try{const t=await S.triggerScan();!t.success&&t.error&&(this.error=t.error),await this.discover()}catch(t){this.error=t instanceof Error?t.message:String(t)}finally{this.discovering=!1}}async viewScanLog(){if(this.showScanLog){this.showScanLog=!1;return}this.scanLogLoading=!0,this.showScanLog=!0;try{this.scanLogContent=await S.getScanLog()||"(empty)"}catch(t){this.scanLogContent=t instanceof Error?t.message:String(t)}finally{this.scanLogLoading=!1}}async selectBridge(t){if(!this.newBridgeApiKey.trim()){this.error="API key is required";return}this.saving=!0,this.error="",this.saved="";try{await S.selectBridge(t.host,t.port,t.name,t.version,this.newBridgeApiKey,t.network_id,t.hostname),this.saved=`Connected to ${t.name||t.host}`,this.discoveredBridges=[],this.newBridgeApiKey="",await this.load()}catch(e){this.error=e instanceof Error?e.message:String(e)}finally{this.saving=!1}}async addManualBridge(){if(!this.manualHost.trim()){this.error="Host is required";return}if(!this.manualPort||this.manualPort<1||this.manualPort>65535){this.error="Valid port is required";return}this.saving=!0,this.error="",this.saved="";try{await S.addBridge(this.manualHost.trim(),this.manualPort,void 0,this.manualApiKey||"",""),this.saved=`Connected to ${this.manualHost}:${this.manualPort}`,this.showManualEntry=!1,this.manualHost="",this.manualPort=80,this.manualApiKey="",await this.load()}catch(t){this.error=t instanceof Error?t.message:String(t)}finally{this.saving=!1}}async deleteBridge(t){this.saving=!0,this.error="";try{await S.deleteBridge(t.uuid),this.saved="Bridge removed",await this.load()}catch(e){this.error=e instanceof Error?e.message:String(e)}finally{this.saving=!1}}async saveBridgeCredentials(t){if(!this.editApiKey.trim()){this.error="API key is required";return}this.saving=!0,this.error="";try{await S.updateBridge(t.uuid,void 0,void 0,void 0,this.editApiKey,this.editOtaPassword),this.saved=`Credentials updated for ${t.name||t.host}`,this.editingBridgeId=null,this.editApiKey="",this.editOtaPassword="",await this.load()}catch(e){this.error=e instanceof Error?e.message:String(e)}finally{this.saving=!1}}startEditingBridge(t){this.editingBridgeId=t.uuid,this.editApiKey=t.api_key||"",this.editOtaPassword=t.ota_password||""}cancelEditing(){this.editingBridgeId=null,this.editApiKey="",this.editOtaPassword=""}async cleanArtifacts(){this.cleaningArtifacts=!0,this.artifactsMessage="";try{const e=((await S.cleanArtifacts()).total_bytes/(1024*1024)).toFixed(1);this.artifactsMessage=`Cleared ${e} MB of build cache. Next compile will be slower.`,this.loadContainerStatus()}catch(t){this.artifactsMessage=`Error: ${t instanceof Error?t.message:String(t)}`}finally{this.cleaningArtifacts=!1}}async activateBridge(t){this.saving=!0,this.error="",this.saved="";try{await S.activateBridge(t.uuid),this.saved=`Activated ${t.name||t.host}`,await this.load()}catch(e){this.error=e instanceof Error?e.message:String(e)}finally{this.saving=!1}}async deactivateBridge(t){this.saving=!0,this.error="",this.saved="";try{await S.deactivateBridge(t.uuid),this.saved=`Deactivated ${t.name||t.host}`,await this.load()}catch(e){this.error=e instanceof Error?e.message:String(e)}finally{this.saving=!1}}renderIntegrationStatus(){var c;const t=(c=this.config)==null?void 0:c.integration;if(!t)return p`<div class="setting"><span class="what"><span class="spinner"></span></span></div>`;const{installed:e,loaded:i,configured:s,connected:r,bridge_count:n,remote_count:o}=t,a=typeof t.remotes_online=="number",l=a?t.remotes_online:0,h=a?o-l:0;return e?i?s?r?p`
      <div class="status-line">
        <span class="chip ok"><span class="dot ok"></span>Connected</span>
        <span>Version ${t.version||"unknown"}</span>
        ${n>0?p`<span>${n} ${n===1?"bridge":"bridges"}</span>`:v}
        ${a?p`<span>${l} of ${o} remotes online${h>0?p` · <span class="warn-text">${h} offline</span>`:v}</span>`:p`<span>${o} ${o===1?"remote":"remotes"} known</span>`}
      </div>
    `:p`<div class="notice danger">${C("alert")}<span><strong>The integration lost its connection to the add-on.</strong> It reconnects automatically; if it doesn't, reload the integration in Home Assistant.</span></div>`:p`<div class="notice warn">${C("info")}<span><strong>Not set up yet.</strong> In Home Assistant, go to Settings → Devices &amp; services → Add integration, and search for ESP Tree.</span></div>`:p`
        <div class="notice warn">${C("info")}<span><strong>Installed but not loaded yet.</strong> Home Assistant loads the integration on its next restart.</span>
          <span class="notice-actions"><button class="btn sm primary" ?disabled=${this.restarting} @click=${this.restartHa}>${this.restarting?"Restarting…":"Restart Home Assistant"}</button></span>
        </div>
        ${this.restartFeedback?p`<p class="hint">${this.restartFeedback}</p>`:v}
      `:p`<div class="notice danger">${C("alert")}<span><strong>Integration files not found.</strong> Restart Home Assistant to finish installing ESP Tree.</span></div>`}confirmDeleteBridge(t){this.confirm={title:`Remove ${t.name||"this bridge"}?`,message:"ESP Tree forgets this bridge and its credentials. The bridge itself keeps running and can be added again later.",detail:this.isBridgeActive(t)?"This is the active bridge: the network goes offline in ESP Tree until another bridge is activated.":void 0,confirmLabel:"Remove bridge",danger:!0,run:()=>this.deleteBridge(t)}}confirmCleanArtifacts(){this.confirm={title:"Clear the build cache?",message:"Deletes the PlatformIO cache and ESPHome build output. Use it to free disk space or recover from a stale build.",detail:"The next build of every device downloads toolchains again and is much slower.",confirmLabel:"Clear cache",run:()=>this.cleanArtifacts()}}renderBridge(t){const e=this.isBridgeActive(t),i=this.isBridgeConnected(t),s=this.bridgeSkippedReason(t),r=this.editingBridgeId===t.uuid;return p`
      <li class=${e?"active":""}>
        <div class="bridge-row">
          <span class="node-icon ${e?"on":""}" aria-hidden="true">${C(this.isSerial(t)?"usb":"wifi")}</span>
          <span class="what">
            <strong>${t.name||this.bridgeHostname(t)}
              ${e?p`<span class="chip primary">Active</span>`:v}
            </strong>
            <small>
              ${this.isSerial(t)?"Serial":"WiFi"} ·
              <span class="mono">${this.bridgeAddress(t)}${!this.isSerial(t)&&t.port?`:${t.port}`:""}</span>
              ${t.network_id?p` · network ${t.network_id}`:v}
            </small>
          </span>
          <span class="conn">
            ${i?p`<span class="chip ok"><span class="dot ok"></span>Connected</span>`:p`<span class="chip ${e?"danger":""}" title=${s||""}>${e?p`<span class="dot danger"></span>`:v}${e?"Not connected":"Standby"}</span>`}
          </span>
          <span class="row-actions">
            ${r?v:p`
              ${e?p`<button class="btn sm" ?disabled=${this.saving} @click=${()=>this.deactivateBridge(t)}>Deactivate</button>`:p`<button class="btn sm primary" ?disabled=${this.saving} @click=${()=>this.activateBridge(t)}>Activate</button>`}
              <button class="btn sm text" ?disabled=${this.saving} @click=${()=>this.startEditingBridge(t)}>Credentials</button>
              <button class="btn sm text danger-text" ?disabled=${this.saving} aria-label=${`Remove ${t.name||"bridge"}`} @click=${()=>this.confirmDeleteBridge(t)}>${C("trash")}</button>
            `}
          </span>
        </div>
        ${s&&!i&&e?p`<p class="skip">${s}</p>`:v}
        ${r?p`
          <form class="inline-form" @submit=${n=>{n.preventDefault(),this.saveBridgeCredentials(t)}}>
            <div class="field">
              <label for=${`k-${t.uuid}`}>API key</label>
              <input id=${`k-${t.uuid}`} type="password" autocomplete="off" placeholder="Leave blank to keep the current key" .value=${this.editApiKey}
                @input=${n=>this.editApiKey=n.target.value} />
            </div>
            <div class="field">
              <label for=${`o-${t.uuid}`}>OTA password</label>
              <input id=${`o-${t.uuid}`} type="password" autocomplete="off" placeholder="Needed to update the bridge over WiFi" .value=${this.editOtaPassword}
                @input=${n=>this.editOtaPassword=n.target.value} />
            </div>
            <div class="form-actions">
              <button type="button" class="btn" ?disabled=${this.saving} @click=${this.cancelEditing}>Cancel</button>
              <button type="submit" class="btn primary" ?disabled=${this.saving}>Save</button>
            </div>
          </form>
        `:v}
      </li>
    `}render(){var t,e,i,s;return this.loading?p`<div class="card loading"><span class="spinner"></span>Loading settings…</div>`:p`
      <div class="page">
        <div class="page-head">
          <div>
            <h1>Settings</h1>
            <p class="sub">Bridges, the Home Assistant integration, secrets and the build host.</p>
          </div>
        </div>

        ${this.error?p`<div class="notice danger" role="alert">${C("alert")}<span>${this.error}</span></div>`:v}
        ${this.saved?p`<div class="notice ok" role="status">${C("checkCircle")}<span>${this.saved}</span></div>`:v}

        <section class="card" id="settings-connection">
          <div class="card-head">
            <div>
              <h2>Bridges</h2>
              <p class="sub">One bridge is active at a time. Others are kept on standby.</p>
            </div>
            <div class="page-actions">
              <button class="btn sm" @click=${this.viewScanLog}>${this.showScanLog?"Hide scan log":"Scan log"}</button>
              <button class="btn sm" ?disabled=${this.saving} @click=${()=>this.showManualEntry=!this.showManualEntry}>${this.showManualEntry?"Cancel":"Add by address"}</button>
              <button class="btn sm primary" ?disabled=${this.discovering} @click=${this.triggerScan}>
                ${this.discovering?p`<span class="spinner"></span>Searching…`:p`${C("search")}Find bridges`}
              </button>
            </div>
          </div>

          ${this.configuredBridges.length>0?p`<ul class="bridges">${this.configuredBridges.map(r=>this.renderBridge(r))}</ul>`:p`<div class="empty">${C("bridge")}<strong>No bridges yet</strong><p>Find a bridge on your network, or add one by address.</p></div>`}

          ${this.discovering?p`<p class="pad hint">Searching your network for ESP Tree bridges. This takes about 8 seconds.</p>`:v}

          ${this.discoveredBridges.length>0?p`
            <div class="sub-section">
              <h3>Found on your network</h3>
              <ul class="bridges">
                ${this.discoveredBridges.map(r=>p`
                  <li>
                    <div class="bridge-row">
                      <span class="node-icon" aria-hidden="true">${C("wifi")}</span>
                      <span class="what">
                        <strong>${r.name||r.host}</strong>
                        <small><span class="mono">${r.host}:${r.port}</span>${r.hostname?` · ${r.hostname}`:""}${r.network_id?` · network ${r.network_id}`:""}</small>
                      </span>
                      <input class="key" type="password" autocomplete="off" aria-label="API key" placeholder="API key" .value=${this.newBridgeApiKey}
                        @input=${n=>this.newBridgeApiKey=n.target.value} />
                      <span class="row-actions"><button class="btn sm primary" ?disabled=${this.saving} @click=${()=>this.selectBridge(r)}>Use this bridge</button></span>
                    </div>
                  </li>
                `)}
              </ul>
            </div>
          `:v}

          ${this.showManualEntry?p`
            <form class="sub-section manual" @submit=${r=>{r.preventDefault(),this.addManualBridge()}}>
              <h3>Add a bridge by address</h3>
              <div class="manual-grid">
                <div class="field">
                  <label for="mh">Host or IP address</label>
                  <input id="mh" type="text" placeholder="192.168.1.50 or bridge.local" .value=${this.manualHost} @input=${r=>this.manualHost=r.target.value} />
                </div>
                <div class="field">
                  <label for="mp">Port</label>
                  <input id="mp" type="number" min="1" max="65535" .value=${String(this.manualPort)} @input=${r=>this.manualPort=Number(r.target.value||80)} />
                </div>
                <div class="field">
                  <label for="mk">API key</label>
                  <input id="mk" type="password" autocomplete="off" .value=${this.manualApiKey} @input=${r=>this.manualApiKey=r.target.value} />
                </div>
              </div>
              <div class="form-actions"><button type="submit" class="btn primary" ?disabled=${this.saving}>Connect</button></div>
            </form>
          `:v}

          ${this.showScanLog?p`
            <div class="sub-section">
              <h3>Scan log</h3>
              ${this.scanLogLoading?p`<p class="hint"><span class="spinner"></span></p>`:p`<pre class="log">${this.scanLogContent||"No scans yet."}</pre>`}
            </div>
          `:v}
        </section>

        <section class="card" id="settings-integration">
          <div class="card-head">
            <div>
              <h2>Home Assistant integration</h2>
              <p class="sub">Turns remotes into Home Assistant devices and entities.</p>
            </div>
            <a href="#/activity-log" class="btn sm">${C("activity")}Activity</a>
          </div>
          <div class="card-body">${this.renderIntegrationStatus()}</div>
        </section>

        <section class="card">
          <div class="setting">
            <span class="what">
              <strong>Secrets</strong>
              <small>secrets.yaml holds the WiFi and ESP-NOW credentials every build uses.</small>
            </span>
            <a class="btn sm" href="#/secrets?from=${encodeURIComponent("/settings")}">${C("key")}Edit secrets</a>
          </div>
        </section>

        <section class="card" id="settings-build">
          <div class="card-head">
            <div>
              <h2>Build host</h2>
              <p class="sub">The ESPHome toolchain inside the add-on that compiles firmware.</p>
            </div>
          </div>
          <div class="setting">
            <span class="what">
              <strong>ESPHome ${((t=this.containerStatus)==null?void 0:t.tag)||""}</strong>
              <small>${((e=this.containerStatus)==null?void 0:e.error)||((i=this.containerStatus)!=null&&i.available?"Ready to build":"Not available")}</small>
            </span>
            ${(s=this.containerStatus)!=null&&s.available?p`<span class="chip ok"><span class="dot ok"></span>Available</span>`:p`<span class="chip danger"><span class="dot danger"></span>Unavailable</span>`}
          </div>
          <div class="setting">
            <span class="what">
              <strong>Build cache</strong>
              <small>${this.artifactsMessage||"Clear it to free disk space or recover from a stale build. The next build is slower."}</small>
            </span>
            <button class="btn sm" ?disabled=${this.cleaningArtifacts} @click=${()=>this.confirmCleanArtifacts()}>${this.cleaningArtifacts?"Clearing…":"Clear cache…"}</button>
          </div>
        </section>

        <esp-confirm-dialog .request=${this.confirm} @closed=${()=>{this.confirm=null}}></esp-confirm-dialog>
      </div>
    `}};te.styles=[Me,de`
    :host { display: block; }
    .loading { display: flex; align-items: center; gap: 12px; padding: 24px 16px; color: var(--muted); }
    .card { overflow: hidden; }
    .card-head .page-actions .btn svg, .card-head > .btn svg, .setting .btn svg { width: 16px; height: 16px; }
    .card-head .spinner { width: 14px; height: 14px; border-color: currentColor; border-top-color: transparent; }
    .pad { padding: 0 16px 16px; }
    .bridges { list-style: none; margin: 0; padding: 0; }
    .bridges li { border-top: 1px solid var(--line); }
    .bridges li:first-child { border-top: 0; }
    .bridge-row { display: flex; align-items: center; gap: 12px; padding: 12px 16px; flex-wrap: wrap; }
    .node-icon { display: grid; place-items: center; width: 36px; height: 36px; flex: none; border-radius: 50%; background: var(--surface-subtle); color: var(--muted); }
    .node-icon.on { background: var(--primary-soft); color: var(--primary); }
    .node-icon svg { width: 20px; height: 20px; }
    .what { display: grid; gap: 2px; flex: 1 1 220px; min-width: 0; }
    .what strong { display: flex; align-items: center; gap: 8px; font-weight: 500; }
    .what small { color: var(--muted); font-size: var(--text-sm); overflow-wrap: anywhere; }
    .row-actions { display: flex; gap: 4px; align-items: center; margin-left: auto; }
    .danger-text { color: var(--danger); }
    .danger-text:hover:not(:disabled) { background: var(--danger-soft); }
    .row-actions .btn svg { width: 18px; height: 18px; }
    .skip { margin: -6px 16px 12px 64px; color: var(--muted); font-size: var(--text-sm); }
    .key { width: 180px; min-height: 30px; }
    .inline-form { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; padding: 0 16px 16px 64px; }
    .form-actions { grid-column: 1 / -1; display: flex; justify-content: flex-end; gap: 8px; }
    .sub-section { display: grid; gap: 10px; padding: 14px 16px 16px; border-top: 1px solid var(--line); background: var(--surface-subtle); }
    .sub-section h3 { font-size: var(--text-md); font-weight: 500; }
    .sub-section .bridges li { border-color: var(--line); }
    .sub-section .bridge-row { padding: 8px 0; }
    .manual-grid { display: grid; grid-template-columns: minmax(0, 2fr) 110px minmax(0, 1.5fr); gap: 12px; }
    .status-line { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 16px; color: var(--ink-2); }
    .warn-text { color: var(--accent); }
    .setting { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 14px 16px; border-top: 1px solid var(--line); }
    .card > .setting:first-child { border-top: 0; }
    .card-head + .setting { border-top: 0; }
    .hint .spinner { display: inline-block; }
    @media (max-width: 760px) {
      .inline-form { grid-template-columns: minmax(0, 1fr); padding-left: 16px; }
      .manual-grid { grid-template-columns: minmax(0, 1fr); }
      .row-actions { margin-left: 48px; }
      .key { flex: 1 1 100%; width: auto; }
      .skip { margin-left: 16px; }
    }
  `];le([ie({type:Boolean})],te.prototype,"autoInit",2);le([b()],te.prototype,"config",2);le([b()],te.prototype,"configuredBridges",2);le([b()],te.prototype,"discoveredBridges",2);le([b()],te.prototype,"loading",2);le([b()],te.prototype,"discovering",2);le([b()],te.prototype,"saving",2);le([b()],te.prototype,"error",2);le([b()],te.prototype,"saved",2);le([b()],te.prototype,"containerStatus",2);le([b()],te.prototype,"cleaningArtifacts",2);le([b()],te.prototype,"artifactsMessage",2);le([b()],te.prototype,"editingBridgeId",2);le([b()],te.prototype,"editApiKey",2);le([b()],te.prototype,"editOtaPassword",2);le([b()],te.prototype,"newBridgeApiKey",2);le([b()],te.prototype,"showManualEntry",2);le([b()],te.prototype,"manualHost",2);le([b()],te.prototype,"manualPort",2);le([b()],te.prototype,"manualApiKey",2);le([b()],te.prototype,"showScanLog",2);le([b()],te.prototype,"scanLogContent",2);le([b()],te.prototype,"scanLogLoading",2);le([b()],te.prototype,"restarting",2);le([b()],te.prototype,"restartFeedback",2);le([b()],te.prototype,"confirm",2);te=le([Se("esp-settings")],te);var Am=Object.defineProperty,Pm=Object.getOwnPropertyDescriptor,Wt=(t,e,i,s)=>{for(var r=s>1?void 0:s?Pm(e,i):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(s?o(e,i,r):o(r))||r);return s&&r&&Am(e,i,r),r};const Tm=300,Mo=new Set(["success","failed","aborted","rejoin_timeout","version_mismatch"]);let pt=class extends pe{constructor(){super(...arguments),this.queueData=null,this.compileData=null,this.historyJobs=[],this.error="",this.busyJob=null,this.busyAction="",this.showAbortModal=!1,this.historyFilter="all",this.historyLimit=10,this.pollTimer=null,this.historyTimer=null}connectedCallback(){super.connectedCallback(),this.fetchQueue(),this.pollTimer=setInterval(()=>this.fetchQueue(),2e3),this.fetchHistory(),this.historyTimer=setInterval(()=>this.fetchHistory(),5e3)}disconnectedCallback(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null),this.historyTimer&&(clearInterval(this.historyTimer),this.historyTimer=null),super.disconnectedCallback()}async fetchQueue(){try{const[t,e]=await Promise.all([S.getQueue(),S.getCompileQueue()]);this.queueData=t,this.compileData=e}catch{}}async fetchHistory(){try{const t=await S.getAllHistory(100);this.historyJobs=t.jobs}catch{}}async pauseQueue(){this.busyAction="pause",this.error="";try{await S.pauseQueue(),await this.fetchQueue()}catch(t){this.error=t instanceof Error?t.message:String(t)}finally{this.busyAction=""}}async resumeQueue(){this.busyAction="resume",this.error="";try{await S.resumeQueue(),await this.fetchQueue()}catch(t){this.error=t instanceof Error?t.message:String(t)}finally{this.busyAction=""}}async abortQueuedJob(t){this.busyJob=t,this.error="";try{await S.abortQueuedJob(t),await this.fetchQueue()}catch(e){this.error=e instanceof Error?e.message:String(e)}finally{this.busyJob=null}}async abortCompileJob(t){this.busyJob=t,this.error="";try{await S.abortCompileJob(t),await this.fetchQueue()}catch(e){this.error=e instanceof Error?e.message:String(e)}finally{this.busyJob=null}}async moveUp(t){this.busyJob=t,this.error="";try{await S.reorderJobUp(t),await this.fetchQueue()}catch(e){this.error=e instanceof Error?e.message:String(e)}finally{this.busyJob=null}}async moveDown(t){this.busyJob=t,this.error="";try{await S.reorderJobDown(t),await this.fetchQueue()}catch(e){this.error=e instanceof Error?e.message:String(e)}finally{this.busyJob=null}}async abortActiveJob(){this.busyAction="abort-active",this.error="";try{if((await S.getQueue()).count>0){this.showAbortModal=!0;return}await S.abortOta(),await this.fetchQueue()}catch(t){this.error=t instanceof Error?t.message:String(t)}finally{this.busyAction=""}}async abortActiveAndContinue(){this.showAbortModal=!1;try{await S.abortOta(),await this.fetchQueue()}catch(t){this.error=t instanceof Error?t.message:String(t)}}async abortActiveAndPause(){this.showAbortModal=!1;try{await S.abortOta(),await S.pauseQueue(),await this.fetchQueue()}catch(t){this.error=t instanceof Error?t.message:String(t)}}navigateToJob(t){window.location.hash=`/job/${t.id}?from=${encodeURIComponent("/queue")}`}labelFor(t){return t.device_label||t.parsed_esphome_name||t.esphome_name||t.mac}buildDisplayEntries(){const e=[...this.historyJobs.filter(s=>this.historyFilter==="all"?!0:(s.job_type||this.inferJobType(s))===this.historyFilter)].sort((s,r)=>(s.created_at??0)-(r.created_at??0)),i=[];for(let s=0;s<e.length;s++){const r=e[s],n=e[s+1],o=r.job_type||this.inferJobType(r);if(n&&o==="compile"&&(n.job_type||this.inferJobType(n))==="flash"&&r.mac===n.mac&&n.created_at-r.created_at<=Tm){const a=n.status==="success"&&r.status==="compile_success"?"success":"failed";i.push({type:"combined",compileJob:r,flashJob:n,label:this.labelFor(r),status:a,statusLabel:a==="success"?"Success":"Failed",created_at:n.created_at}),s++}else i.push({type:o,job:r,label:this.labelFor(r),status:r.status,statusLabel:r.status==="success"&&o==="flash"?"OTA Upload Success":r.status.replaceAll("_"," "),created_at:r.created_at})}return i.sort((s,r)=>r.created_at-s.created_at),i}inferJobType(t){return t.status==="compile_success"||t.status==="compile_queued"||t.status==="compiling"?"compile":(Mo.has(t.status),"flash")}render(){var d,u;const t=this.queueData,e=!!(t!=null&&t.active_job)&&!Mo.has(t.active_job.status),i=(t==null?void 0:t.queued_jobs)??[],s=(t==null?void 0:t.paused)??!1,r=i.length+(e?1:0),n=((d=this.compileData)==null?void 0:d.active_job)??null,o=((u=this.compileData)==null?void 0:u.queued_jobs)??[],a=o.length+(n?1:0),l=this.buildDisplayEntries(),h=l.slice(0,this.historyLimit),c=l.length;return p`
      <div class="page">
        <div class="page-head">
          <div>
            <h1>Jobs</h1>
            <p class="sub">Builds and uploads run one at a time, so the mesh and the build host are never overloaded.</p>
          </div>
          <div class="page-actions">
            ${s?p`<button class="btn primary" ?disabled=${this.busyAction==="resume"} @click=${this.resumeQueue}>${C("play")}Resume uploads</button>`:p`<button class="btn" ?disabled=${this.busyAction==="pause"} @click=${this.pauseQueue}>${C("pause")}Pause uploads</button>`}
          </div>
        </div>

        ${this.error?p`<div class="notice danger" role="alert">${C("alert")}<span><strong>That didn't work.</strong> ${this.error}</span></div>`:v}
        ${s?p`<div class="notice warn" role="status">${C("pause")}<span><strong>Uploads are paused.</strong> Queued uploads wait until you resume. Builds keep running.</span></div>`:v}

        <div class="queues">
          <section class="card">
            <div class="card-head">
              <h2>Builds</h2>
              <span class="chip ${n?"info":""}">${this.countLabel(n?1:0,o.length)}</span>
            </div>
            ${a===0?p`<p class="none">No builds running. Compile from a remote's YAML page.</p>`:p`<ul class="hist">
                  ${n?this.renderCompileRow(n,!0):v}
                  ${o.map(f=>this.renderCompileRow(f,!1))}
                </ul>`}
          </section>

          <section class="card">
            <div class="card-head">
              <h2>Uploads</h2>
              <span class="chip ${e?"info":s&&r?"warn":""}">${this.countLabel(e?1:0,i.length)}</span>
            </div>
            ${r===0?p`<p class="none">Nothing to upload. Start one from a remote's page or its YAML.</p>`:p`<ul class="hist">
                  ${e&&t.active_job?this.renderOtaRow(t.active_job,1,r,!0):v}
                  ${i.map((f,g)=>this.renderOtaRow(f,g+(e?2:1),r,!1))}
                </ul>`}
          </section>
        </div>

        <section class="card">
          <div class="card-head">
            <h2>History</h2>
            <div class="segmented" role="group" aria-label="Show">
              ${["all","flash","compile"].map(f=>p`
                <button aria-pressed=${this.historyFilter===f?"true":"false"} @click=${()=>{this.historyFilter=f,this.historyLimit=10}}>${f==="all"?"All":f==="flash"?"Uploads":"Builds"}</button>
              `)}
            </div>
          </div>
          ${c===0?p`<div class="empty">${C("jobs")}<strong>No finished jobs yet</strong><p>Completed builds and uploads appear here, with their logs and retained firmware for rollback.</p></div>`:p`
                <ul class="hist">
                  ${h.map(f=>f.type==="combined"?this.renderCombinedRow(f):this.renderHistoryRow(f))}
                </ul>
                ${c>this.historyLimit?p`<div class="more"><button class="btn sm text" @click=${()=>{this.historyLimit+=10}}>Show ${Math.min(10,c-this.historyLimit)} older</button></div>`:v}
              `}
        </section>

        ${this.showAbortModal?this.renderAbortModal():v}
      </div>
    `}countLabel(t,e){return!t&&!e?"Idle":[t?`${t} running`:"",e?`${e} queued`:""].filter(Boolean).join(" · ")}deviceLink(t,e){return p`<a class="dev" href=${`#/device/${encodeURIComponent(t)}`}>${e}</a>`}renderCompileRow(t,e){const i=this.busyJob===t.id;return p`
      <li>
        <span class="what">
          <strong>${this.deviceLink(t.mac,this.labelFor(t))}</strong>
          ${e?p`<span class="progress indeterminate"><span></span></span>`:p`<small>Waiting for the build host</small>`}
        </span>
        ${ni(e?"compiling":"compile_queued")}
        <span></span>
        <span class="row-actions">
          <button class="btn sm text" @click=${()=>this.navigateToJob(t)}>Log</button>
          <button class="btn sm danger" ?disabled=${i} @click=${()=>this.abortCompileJob(t.id)}>${e?"Cancel":"Remove"}</button>
        </span>
      </li>
    `}renderOtaRow(t,e,i,s){const r=this.busyJob===t.id,n=this.labelFor(t);if(s){const o=t.percent??0;return p`
        <li>
          <span class="what">
            <strong>${this.deviceLink(t.mac,n)} <span class="pct">${o}%</span></strong>
            <span class="progress" role="progressbar" aria-label=${`Upload to ${n}`} aria-valuenow=${o} aria-valuemin="0" aria-valuemax="100"><span style="width:${o}%"></span></span>
            <small>${t.firmware_name||"firmware.ota.bin"}${t.bridge_state?` · bridge ${t.bridge_state.replaceAll("_"," ")}`:""}</small>
          </span>
          ${ni(t.status)}
          <span></span>
          <span class="row-actions">
            <button class="btn sm text" @click=${()=>this.navigateToJob(t)}>Log</button>
            <button class="btn sm danger" ?disabled=${this.busyAction==="abort-active"} @click=${this.abortActiveJob}>Abort</button>
          </span>
        </li>
      `}return p`
      <li>
        <span class="what">
          <strong><span class="pos">${e}</span>${this.deviceLink(t.mac,n)}</strong>
          <small>${t.firmware_name||"firmware.ota.bin"}${t.firmware_size?` · ${Ni(t.firmware_size)}`:""}</small>
        </span>
        ${ni("queued")}
        <span class="reorder">
          <button class="btn sm icon text" aria-label=${`Move ${n} up`} ?disabled=${r||e<=2} @click=${()=>this.moveUp(t.id)}>${C("arrowUp")}</button>
          <button class="btn sm icon text" aria-label=${`Move ${n} down`} ?disabled=${r||e>=i} @click=${()=>this.moveDown(t.id)}>${C("arrowDown")}</button>
        </span>
        <span class="row-actions">
          <button class="btn sm text" @click=${()=>this.navigateToJob(t)}>Log</button>
          <button class="btn sm danger" ?disabled=${r} @click=${()=>this.abortQueuedJob(t.id)}>Remove</button>
        </span>
      </li>
    `}typeChip(t){return p`<span class="type">${t==="compile"?"Build":t==="flash"?"Upload":"Build + upload"}</span>`}renderHistoryRow(t){const e=t.job,i=e.completed_at&&e.started_at?yt(e.completed_at-e.started_at):"";return p`
      <li>
        <span class="what">
          <strong>${this.deviceLink(e.mac,t.label)}</strong>
          <small>${this.typeChip(t.type)}${[e.parsed_version?`v${e.parsed_version}`:e.firmware_name||"",i?`took ${i}`:""].filter(Boolean).map(s=>p` · ${s}`)}</small>
          ${e.error_msg&&Mo.has(t.status)&&t.status!=="success"?p`<small class="err">${e.error_msg}</small>`:v}
        </span>
        ${ni(t.status)}
        <span class="when" title=${Vi(e.created_at)}>${kn(e.created_at)}</span>
        <span class="row-actions"><button class="btn sm text" @click=${()=>this.navigateToJob(e)}>Log</button></span>
      </li>
    `}renderCombinedRow(t){const e=t.compileJob,i=t.flashJob,s=e.completed_at&&e.started_at?yt(e.completed_at-e.started_at):"",r=i.completed_at&&i.started_at?yt(i.completed_at-i.started_at):"";return p`
      <li>
        <span class="what">
          <strong>${this.deviceLink(e.mac,t.label)}</strong>
          <small>${this.typeChip("combined")}${e.parsed_version?` · v${e.parsed_version}`:""}${s||r?` · build ${s||"—"}, upload ${r||"—"}`:""}</small>
          ${i.error_msg&&t.status!=="success"?p`<small class="err">${i.error_msg}</small>`:v}
        </span>
        ${ni(t.status)}
        <span class="when" title=${Vi(i.created_at)}>${kn(i.created_at)}</span>
        <span class="row-actions"><button class="btn sm text" @click=${()=>this.navigateToJob(i)}>Log</button></span>
      </li>
    `}renderAbortModal(){return p`
      <div class="scrim" @click=${t=>{t.target===t.currentTarget&&(this.showAbortModal=!1)}}>
        <section class="modal" role="dialog" aria-modal="true" aria-labelledby="abort-title">
          <h2 id="abort-title">Other uploads are waiting</h2>
          <p>After aborting this upload, should the next queued one start, or should uploads pause?</p>
          <div class="modal-actions">
            <button class="btn" @click=${()=>{this.showAbortModal=!1}}>Cancel</button>
            <button class="btn" @click=${this.abortActiveAndPause}>Abort and pause</button>
            <button class="btn primary" @click=${this.abortActiveAndContinue}>Abort, keep going</button>
          </div>
        </section>
      </div>
    `}};pt.styles=[Me,xl,de`
    :host { display: block; }
    .page-actions .btn svg { width: 18px; height: 18px; }
    .queues { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; align-items: start; }
    .card { overflow: hidden; }
    .none { padding: 12px 16px 16px; color: var(--muted); }
    .hist li { grid-template-columns: minmax(0, 1fr) auto auto auto; }
    .hist .what .progress { margin: 4px 0 2px; }
    .dev { color: inherit; text-decoration: none; }
    .dev:hover { color: var(--primary); text-decoration: underline; }
    .pct { margin-left: 6px; color: var(--info); font-weight: 500; font-variant-numeric: tabular-nums; }
    .pos {
      display: inline-grid; place-items: center; min-width: 20px; height: 20px; margin-right: 8px;
      border-radius: 50%; background: var(--surface-subtle); color: var(--muted); font-size: var(--text-xs); font-weight: 500;
    }
    .reorder { display: flex; gap: 2px; }
    .reorder svg, .hist .btn svg { width: 16px; height: 16px; }
    .type { color: var(--ink-2); font-weight: 500; }
    .more { display: flex; justify-content: center; padding: 8px; border-top: 1px solid var(--line); }
    .empty svg { width: 32px; height: 32px; }

    .scrim { position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; padding: 16px; background: var(--scrim); }
    .modal { display: grid; gap: 12px; width: min(480px, 100%); padding: 22px; border-radius: var(--radius-lg); background: var(--surface-raised); box-shadow: var(--shadow-md); }
    .modal h2 { font-size: var(--text-xl); font-weight: 500; }
    .modal p { color: var(--ink-2); }
    .modal-actions { display: flex; justify-content: flex-end; flex-wrap: wrap; gap: 8px; margin-top: 4px; }

    @media (max-width: 960px) {
      .queues { grid-template-columns: minmax(0, 1fr); }
    }
    @media (max-width: 640px) {
      .hist li { grid-template-columns: minmax(0, 1fr) auto; }
    }
  `];Wt([b()],pt.prototype,"queueData",2);Wt([b()],pt.prototype,"compileData",2);Wt([b()],pt.prototype,"historyJobs",2);Wt([b()],pt.prototype,"error",2);Wt([b()],pt.prototype,"busyJob",2);Wt([b()],pt.prototype,"busyAction",2);Wt([b()],pt.prototype,"showAbortModal",2);Wt([b()],pt.prototype,"historyFilter",2);Wt([b()],pt.prototype,"historyLimit",2);pt=Wt([Se("esp-queue-page")],pt);let fa=[],Xd=[];(()=>{let t="lc,34,7n,7,7b,19,,,,2,,2,,,20,b,1c,l,g,,2t,7,2,6,2,2,,4,z,,u,r,2j,b,1m,9,9,,o,4,,9,,3,,5,17,3,3b,f,,w,1j,,,,4,8,4,,3,7,a,2,t,,1m,,,,2,4,8,,9,,a,2,q,,2,2,1l,,4,2,4,2,2,3,3,,u,2,3,,b,2,1l,,4,5,,2,4,,k,2,m,6,,,1m,,,2,,4,8,,7,3,a,2,u,,1n,,,,c,,9,,14,,3,,1l,3,5,3,,4,7,2,b,2,t,,1m,,2,,2,,3,,5,2,7,2,b,2,s,2,1l,2,,,2,4,8,,9,,a,2,t,,20,,4,,2,3,,,8,,29,,2,7,c,8,2q,,2,9,b,6,22,2,r,,,,,,1j,e,,5,,2,5,b,,10,9,,2u,4,,6,,2,2,2,p,2,4,3,g,4,d,,2,2,6,,f,,jj,3,qa,3,t,3,t,2,u,2,1s,2,,7,8,,2,b,9,,19,3,3b,2,y,,3a,3,4,2,9,,6,3,63,2,2,,1m,,,7,,,,,2,8,6,a,2,,1c,h,1r,4,1c,7,,,5,,14,9,c,2,w,4,2,2,,3,1k,,,2,3,,,3,1m,8,2,2,48,3,,d,,7,4,,6,,3,2,5i,1m,,5,ek,,5f,x,2da,3,3x,,2o,w,fe,6,2x,2,n9w,4,,a,w,2,28,2,7k,,3,,4,,p,2,5,,47,2,q,i,d,,12,8,p,b,1a,3,1c,,2,4,2,2,13,,1v,6,2,2,2,2,c,,8,,1b,,1f,,,3,2,2,5,2,,,16,2,8,,6m,,2,,4,,fn4,,kh,g,g,g,a6,2,gt,,6a,,45,5,1ae,3,,2,5,4,14,3,4,,4l,2,fx,4,ar,2,49,b,4w,,1i,f,1k,3,1d,4,2,2,1x,3,10,5,,8,1q,,c,2,1g,9,a,4,2,,2n,3,2,,,2,6,,4g,,3,8,l,2,1l,2,,,,,m,,e,7,3,5,5f,8,2,3,,,n,,29,,2,6,,,2,,,2,,2,6j,,2,4,6,2,,2,r,2,2d,8,2,,,2,2y,,,,2,6,,,2t,3,2,4,,5,77,9,,2,6t,,a,2,,,4,,40,4,2,2,4,,w,a,14,6,2,4,8,,9,6,2,3,1a,d,,2,ba,7,,6,,,2a,m,2,7,,2,,2,3e,6,3,,,2,,7,,,20,2,3,,,,9n,2,f0b,5,1n,7,t4,,1r,4,29,,f5k,2,43q,,,3,4,5,8,8,2,7,u,4,44,3,1iz,1j,4,1e,8,,e,,m,5,,f,11s,7,,h,2,7,,2,,5,79,7,c5,4,15s,7,31,7,240,5,gx7k,2o,3k,6o".split(",").map(e=>e?parseInt(e,36):1);for(let e=0,i=0;e<t.length;e++)(e%2?Xd:fa).push(i=i+t[e])})();function Mm(t){if(t<768)return!1;for(let e=0,i=fa.length;;){let s=e+i>>1;if(t<fa[s])i=s;else if(t>=Xd[s])e=s+1;else return!0;if(e==i)return!1}}function Th(t){return t>=127462&&t<=127487}const Mh=8205;function Em(t,e,i=!0,s=!0){return(i?Jd:_m)(t,e,s)}function Jd(t,e,i){if(e==t.length)return e;e&&Yd(t.charCodeAt(e))&&Gd(t.charCodeAt(e-1))&&e--;let s=Eo(t,e);for(e+=Eh(s);e<t.length;){let r=Eo(t,e);if(s==Mh||r==Mh||i&&Mm(r))e+=Eh(r),s=r;else if(Th(r)){let n=0,o=e-2;for(;o>=0&&Th(Eo(t,o));)n++,o-=2;if(n%2==0)break;e+=2}else break}return e}function _m(t,e,i){for(;e>0;){let s=Jd(t,e-2,i);if(s<e)return s;e--}return 0}function Eo(t,e){let i=t.charCodeAt(e);if(!Gd(i)||e+1==t.length)return i;let s=t.charCodeAt(e+1);return Yd(s)?(i-55296<<10)+(s-56320)+65536:i}function Yd(t){return t>=56320&&t<57344}function Gd(t){return t>=55296&&t<56320}function Eh(t){return t<65536?1:2}class Y{lineAt(e){if(e<0||e>this.length)throw new RangeError(`Invalid position ${e} in document of length ${this.length}`);return this.lineInner(e,!1,1,0)}line(e){if(e<1||e>this.lines)throw new RangeError(`Invalid line number ${e} in ${this.lines}-line document`);return this.lineInner(e,!0,1,0)}replace(e,i,s){[e,i]=ks(this,e,i);let r=[];return this.decompose(0,e,r,2),s.length&&s.decompose(0,s.length,r,3),this.decompose(i,this.length,r,1),_t.from(r,this.length-(i-e)+s.length)}append(e){return this.replace(this.length,this.length,e)}slice(e,i=this.length){[e,i]=ks(this,e,i);let s=[];return this.decompose(e,i,s,0),_t.from(s,i-e)}eq(e){if(e==this)return!0;if(e.length!=this.length||e.lines!=this.lines)return!1;let i=this.scanIdentical(e,1),s=this.length-this.scanIdentical(e,-1),r=new Xs(this),n=new Xs(e);for(let o=i,a=i;;){if(r.next(o),n.next(o),o=0,r.lineBreak!=n.lineBreak||r.done!=n.done||r.value!=n.value)return!1;if(a+=r.value.length,r.done||a>=s)return!0}}iter(e=1){return new Xs(this,e)}iterRange(e,i=this.length){return new Zd(this,e,i)}iterLines(e,i){let s;if(e==null)s=this.iter();else{i==null&&(i=this.lines+1);let r=this.line(e).from;s=this.iterRange(r,Math.max(r,i==this.lines+1?this.length:i<=1?0:this.line(i-1).to))}return new eu(s)}toString(){return this.sliceString(0)}toJSON(){let e=[];return this.flatten(e),e}constructor(){}static of(e){if(e.length==0)throw new RangeError("A document must have at least one line");return e.length==1&&!e[0]?Y.empty:e.length<=32?new be(e):_t.from(be.split(e,[]))}}class be extends Y{constructor(e,i=Dm(e)){super(),this.text=e,this.length=i}get lines(){return this.text.length}get children(){return null}lineInner(e,i,s,r){for(let n=0;;n++){let o=this.text[n],a=r+o.length;if((i?s:a)>=e)return new Bm(r,a,s,o);r=a+1,s++}}decompose(e,i,s,r){let n=e<=0&&i>=this.length?this:new be(_h(this.text,e,i),Math.min(i,this.length)-Math.max(0,e));if(r&1){let o=s.pop(),a=cn(n.text,o.text.slice(),0,n.length);if(a.length<=32)s.push(new be(a,o.length+n.length));else{let l=a.length>>1;s.push(new be(a.slice(0,l)),new be(a.slice(l)))}}else s.push(n)}replace(e,i,s){if(!(s instanceof be))return super.replace(e,i,s);[e,i]=ks(this,e,i);let r=cn(this.text,cn(s.text,_h(this.text,0,e)),i),n=this.length+s.length-(i-e);return r.length<=32?new be(r,n):_t.from(be.split(r,[]),n)}sliceString(e,i=this.length,s=`
`){[e,i]=ks(this,e,i);let r="";for(let n=0,o=0;n<=i&&o<this.text.length;o++){let a=this.text[o],l=n+a.length;n>e&&o&&(r+=s),e<l&&i>n&&(r+=a.slice(Math.max(0,e-n),i-n)),n=l+1}return r}flatten(e){for(let i of this.text)e.push(i)}scanIdentical(){return 0}static split(e,i){let s=[],r=-1;for(let n of e)s.push(n),r+=n.length+1,s.length==32&&(i.push(new be(s,r)),s=[],r=-1);return r>-1&&i.push(new be(s,r)),i}}class _t extends Y{constructor(e,i){super(),this.children=e,this.length=i,this.lines=0;for(let s of e)this.lines+=s.lines}lineInner(e,i,s,r){for(let n=0;;n++){let o=this.children[n],a=r+o.length,l=s+o.lines-1;if((i?l:a)>=e)return o.lineInner(e,i,s,r);r=a+1,s=l+1}}decompose(e,i,s,r){for(let n=0,o=0;o<=i&&n<this.children.length;n++){let a=this.children[n],l=o+a.length;if(e<=l&&i>=o){let h=r&((o<=e?1:0)|(l>=i?2:0));o>=e&&l<=i&&!h?s.push(a):a.decompose(e-o,i-o,s,h)}o=l+1}}replace(e,i,s){if([e,i]=ks(this,e,i),s.lines<this.lines)for(let r=0,n=0;r<this.children.length;r++){let o=this.children[r],a=n+o.length;if(e>=n&&i<=a){let l=o.replace(e-n,i-n,s),h=this.lines-o.lines+l.lines;if(l.lines<h>>4&&l.lines>h>>6){let c=this.children.slice();return c[r]=l,new _t(c,this.length-(i-e)+s.length)}return super.replace(n,a,l)}n=a+1}return super.replace(e,i,s)}sliceString(e,i=this.length,s=`
`){[e,i]=ks(this,e,i);let r="";for(let n=0,o=0;n<this.children.length&&o<=i;n++){let a=this.children[n],l=o+a.length;o>e&&n&&(r+=s),e<l&&i>o&&(r+=a.sliceString(e-o,i-o,s)),o=l+1}return r}flatten(e){for(let i of this.children)i.flatten(e)}scanIdentical(e,i){if(!(e instanceof _t))return 0;let s=0,[r,n,o,a]=i>0?[0,0,this.children.length,e.children.length]:[this.children.length-1,e.children.length-1,-1,-1];for(;;r+=i,n+=i){if(r==o||n==a)return s;let l=this.children[r],h=e.children[n];if(l!=h)return s+l.scanIdentical(h,i);s+=l.length+1}}static from(e,i=e.reduce((s,r)=>s+r.length+1,-1)){let s=0;for(let f of e)s+=f.lines;if(s<32){let f=[];for(let g of e)g.flatten(f);return new be(f,i)}let r=Math.max(32,s>>5),n=r<<1,o=r>>1,a=[],l=0,h=-1,c=[];function d(f){let g;if(f.lines>n&&f instanceof _t)for(let m of f.children)d(m);else f.lines>o&&(l>o||!l)?(u(),a.push(f)):f instanceof be&&l&&(g=c[c.length-1])instanceof be&&f.lines+g.lines<=32?(l+=f.lines,h+=f.length+1,c[c.length-1]=new be(g.text.concat(f.text),g.length+1+f.length)):(l+f.lines>r&&u(),l+=f.lines,h+=f.length+1,c.push(f))}function u(){l!=0&&(a.push(c.length==1?c[0]:_t.from(c,h)),h=-1,l=c.length=0)}for(let f of e)d(f);return u(),a.length==1?a[0]:new _t(a,i)}}Y.empty=new be([""],0);function Dm(t){let e=-1;for(let i of t)e+=i.length+1;return e}function cn(t,e,i=0,s=1e9){for(let r=0,n=0,o=!0;n<t.length&&r<=s;n++){let a=t[n],l=r+a.length;l>=i&&(l>s&&(a=a.slice(0,s-r)),r<i&&(a=a.slice(i-r)),o?(e[e.length-1]+=a,o=!1):e.push(a)),r=l+1}return e}function _h(t,e,i){return cn(t,[""],e,i)}class Xs{constructor(e,i=1){this.dir=i,this.done=!1,this.lineBreak=!1,this.value="",this.nodes=[e],this.offsets=[i>0?1:(e instanceof be?e.text.length:e.children.length)<<1]}nextInner(e,i){for(this.done=this.lineBreak=!1;;){let s=this.nodes.length-1,r=this.nodes[s],n=this.offsets[s],o=n>>1,a=r instanceof be?r.text.length:r.children.length;if(o==(i>0?a:0)){if(s==0)return this.done=!0,this.value="",this;i>0&&this.offsets[s-1]++,this.nodes.pop(),this.offsets.pop()}else if((n&1)==(i>0?0:1)){if(this.offsets[s]+=i,e==0)return this.lineBreak=!0,this.value=`
`,this;e--}else if(r instanceof be){let l=r.text[o+(i<0?-1:0)];if(this.offsets[s]+=i,l.length>Math.max(0,e))return this.value=e==0?l:i>0?l.slice(e):l.slice(0,l.length-e),this;e-=l.length}else{let l=r.children[o+(i<0?-1:0)];e>l.length?(e-=l.length,this.offsets[s]+=i):(i<0&&this.offsets[s]--,this.nodes.push(l),this.offsets.push(i>0?1:(l instanceof be?l.text.length:l.children.length)<<1))}}}next(e=0){return e<0&&(this.nextInner(-e,-this.dir),e=this.value.length),this.nextInner(e,this.dir)}}class Zd{constructor(e,i,s){this.value="",this.done=!1,this.cursor=new Xs(e,i>s?-1:1),this.pos=i>s?e.length:0,this.from=Math.min(i,s),this.to=Math.max(i,s)}nextInner(e,i){if(i<0?this.pos<=this.from:this.pos>=this.to)return this.value="",this.done=!0,this;e+=Math.max(0,i<0?this.pos-this.to:this.from-this.pos);let s=i<0?this.pos-this.from:this.to-this.pos;e>s&&(e=s),s-=e;let{value:r}=this.cursor.next(e);return this.pos+=(r.length+e)*i,this.value=r.length<=s?r:i<0?r.slice(r.length-s):r.slice(0,s),this.done=!this.value,this}next(e=0){return e<0?e=Math.max(e,this.from-this.pos):e>0&&(e=Math.min(e,this.to-this.pos)),this.nextInner(e,this.cursor.dir)}get lineBreak(){return this.cursor.lineBreak&&this.value!=""}}class eu{constructor(e){this.inner=e,this.afterBreak=!0,this.value="",this.done=!1}next(e=0){let{done:i,lineBreak:s,value:r}=this.inner.next(e);return i&&this.afterBreak?(this.value="",this.afterBreak=!1):i?(this.done=!0,this.value=""):s?this.afterBreak?this.value="":(this.afterBreak=!0,this.next()):(this.value=r,this.afterBreak=!1),this}get lineBreak(){return!1}}typeof Symbol<"u"&&(Y.prototype[Symbol.iterator]=function(){return this.iter()},Xs.prototype[Symbol.iterator]=Zd.prototype[Symbol.iterator]=eu.prototype[Symbol.iterator]=function(){return this});class Bm{constructor(e,i,s,r){this.from=e,this.to=i,this.number=s,this.text=r}get length(){return this.to-this.from}}function ks(t,e,i){return e=Math.max(0,Math.min(t.length,e)),[e,Math.max(e,Math.min(t.length,i))]}function $e(t,e,i=!0,s=!0){return Em(t,e,i,s)}function Rm(t){return t>=56320&&t<57344}function Lm(t){return t>=55296&&t<56320}function qe(t,e){let i=t.charCodeAt(e);if(!Lm(i)||e+1==t.length)return i;let s=t.charCodeAt(e+1);return Rm(s)?(i-55296<<10)+(s-56320)+65536:i}function Sl(t){return t<=65535?String.fromCharCode(t):(t-=65536,String.fromCharCode((t>>10)+55296,(t&1023)+56320))}function Dt(t){return t<65536?1:2}const pa=/\r\n?|\n/;var Fe=(function(t){return t[t.Simple=0]="Simple",t[t.TrackDel=1]="TrackDel",t[t.TrackBefore=2]="TrackBefore",t[t.TrackAfter=3]="TrackAfter",t})(Fe||(Fe={}));class Ft{constructor(e){this.sections=e}get length(){let e=0;for(let i=0;i<this.sections.length;i+=2)e+=this.sections[i];return e}get newLength(){let e=0;for(let i=0;i<this.sections.length;i+=2){let s=this.sections[i+1];e+=s<0?this.sections[i]:s}return e}get empty(){return this.sections.length==0||this.sections.length==2&&this.sections[1]<0}iterGaps(e){for(let i=0,s=0,r=0;i<this.sections.length;){let n=this.sections[i++],o=this.sections[i++];o<0?(e(s,r,n),r+=n):r+=o,s+=n}}iterChangedRanges(e,i=!1){ga(this,e,i)}get invertedDesc(){let e=[];for(let i=0;i<this.sections.length;){let s=this.sections[i++],r=this.sections[i++];r<0?e.push(s,r):e.push(r,s)}return new Ft(e)}composeDesc(e){return this.empty?e:e.empty?this:tu(this,e)}mapDesc(e,i=!1){return e.empty?this:ma(this,e,i)}mapPos(e,i=-1,s=Fe.Simple){let r=0,n=0;for(let o=0;o<this.sections.length;){let a=this.sections[o++],l=this.sections[o++],h=r+a;if(l<0){if(h>e)return n+(e-r);n+=a}else{if(s!=Fe.Simple&&h>=e&&(s==Fe.TrackDel&&r<e&&h>e||s==Fe.TrackBefore&&r<e||s==Fe.TrackAfter&&h>e))return null;if(h>e||h==e&&i<0&&!a)return e==r||i<0?n:n+l;n+=l}r=h}if(e>r)throw new RangeError(`Position ${e} is out of range for changeset of length ${r}`);return n}touchesRange(e,i=e){for(let s=0,r=0;s<this.sections.length&&r<=i;){let n=this.sections[s++],o=this.sections[s++],a=r+n;if(o>=0&&r<=i&&a>=e)return r<e&&a>i?"cover":!0;r=a}return!1}toString(){let e="";for(let i=0;i<this.sections.length;){let s=this.sections[i++],r=this.sections[i++];e+=(e?" ":"")+s+(r>=0?":"+r:"")}return e}toJSON(){return this.sections}static fromJSON(e){if(!Array.isArray(e)||e.length%2||e.some(i=>typeof i!="number"))throw new RangeError("Invalid JSON representation of ChangeDesc");return new Ft(e)}static create(e){return new Ft(e)}}class we extends Ft{constructor(e,i){super(e),this.inserted=i}apply(e){if(this.length!=e.length)throw new RangeError("Applying change set to a document with the wrong length");return ga(this,(i,s,r,n,o)=>e=e.replace(r,r+(s-i),o),!1),e}mapDesc(e,i=!1){return ma(this,e,i,!0)}invert(e){let i=this.sections.slice(),s=[];for(let r=0,n=0;r<i.length;r+=2){let o=i[r],a=i[r+1];if(a>=0){i[r]=a,i[r+1]=o;let l=r>>1;for(;s.length<l;)s.push(Y.empty);s.push(o?e.slice(n,n+o):Y.empty)}n+=o}return new we(i,s)}compose(e){return this.empty?e:e.empty?this:tu(this,e,!0)}map(e,i=!1){return e.empty?this:ma(this,e,i,!0)}iterChanges(e,i=!1){ga(this,e,i)}get desc(){return Ft.create(this.sections)}filter(e){let i=[],s=[],r=[],n=new lr(this);e:for(let o=0,a=0;;){let l=o==e.length?1e9:e[o++];for(;a<l||a==l&&n.len==0;){if(n.done)break e;let c=Math.min(n.len,l-a);Ee(r,c,-1);let d=n.ins==-1?-1:n.off==0?n.ins:0;Ee(i,c,d),d>0&&ai(s,i,n.text),n.forward(c),a+=c}let h=e[o++];for(;a<h;){if(n.done)break e;let c=Math.min(n.len,h-a);Ee(i,c,-1),Ee(r,c,n.ins==-1?-1:n.off==0?n.ins:0),n.forward(c),a+=c}}return{changes:new we(i,s),filtered:Ft.create(r)}}toJSON(){let e=[];for(let i=0;i<this.sections.length;i+=2){let s=this.sections[i],r=this.sections[i+1];r<0?e.push(s):r==0?e.push([s]):e.push([s].concat(this.inserted[i>>1].toJSON()))}return e}static of(e,i,s){let r=[],n=[],o=0,a=null;function l(c=!1){if(!c&&!r.length)return;o<i&&Ee(r,i-o,-1);let d=new we(r,n);a=a?a.compose(d.map(a)):d,r=[],n=[],o=0}function h(c){if(Array.isArray(c))for(let d of c)h(d);else if(c instanceof we){if(c.length!=i)throw new RangeError(`Mismatched change set length (got ${c.length}, expected ${i})`);l(),a=a?a.compose(c.map(a)):c}else{let{from:d,to:u=d,insert:f}=c;if(d>u||d<0||u>i)throw new RangeError(`Invalid change range ${d} to ${u} (in doc of length ${i})`);let g=f?typeof f=="string"?Y.of(f.split(s||pa)):f:Y.empty,m=g.length;if(d==u&&m==0)return;d<o&&l(),d>o&&Ee(r,d-o,-1),Ee(r,u-d,m),ai(n,r,g),o=u}}return h(e),l(!a),a}static empty(e){return new we(e?[e,-1]:[],[])}static fromJSON(e){if(!Array.isArray(e))throw new RangeError("Invalid JSON representation of ChangeSet");let i=[],s=[];for(let r=0;r<e.length;r++){let n=e[r];if(typeof n=="number")i.push(n,-1);else{if(!Array.isArray(n)||typeof n[0]!="number"||n.some((o,a)=>a&&typeof o!="string"))throw new RangeError("Invalid JSON representation of ChangeSet");if(n.length==1)i.push(n[0],0);else{for(;s.length<r;)s.push(Y.empty);s[r]=Y.of(n.slice(1)),i.push(n[0],s[r].length)}}}return new we(i,s)}static createSet(e,i){return new we(e,i)}}function Ee(t,e,i,s=!1){if(e==0&&i<=0)return;let r=t.length-2;r>=0&&i<=0&&i==t[r+1]?t[r]+=e:r>=0&&e==0&&t[r]==0?t[r+1]+=i:s?(t[r]+=e,t[r+1]+=i):t.push(e,i)}function ai(t,e,i){if(i.length==0)return;let s=e.length-2>>1;if(s<t.length)t[t.length-1]=t[t.length-1].append(i);else{for(;t.length<s;)t.push(Y.empty);t.push(i)}}function ga(t,e,i){let s=t.inserted;for(let r=0,n=0,o=0;o<t.sections.length;){let a=t.sections[o++],l=t.sections[o++];if(l<0)r+=a,n+=a;else{let h=r,c=n,d=Y.empty;for(;h+=a,c+=l,l&&s&&(d=d.append(s[o-2>>1])),!(i||o==t.sections.length||t.sections[o+1]<0);)a=t.sections[o++],l=t.sections[o++];e(r,h,n,c,d),r=h,n=c}}}function ma(t,e,i,s=!1){let r=[],n=s?[]:null,o=new lr(t),a=new lr(e);for(let l=-1;;){if(o.done&&a.len||a.done&&o.len)throw new Error("Mismatched change set lengths");if(o.ins==-1&&a.ins==-1){let h=Math.min(o.len,a.len);Ee(r,h,-1),o.forward(h),a.forward(h)}else if(a.ins>=0&&(o.ins<0||l==o.i||o.off==0&&(a.len<o.len||a.len==o.len&&!i))){let h=a.len;for(Ee(r,a.ins,-1);h;){let c=Math.min(o.len,h);o.ins>=0&&l<o.i&&o.len<=c&&(Ee(r,0,o.ins),n&&ai(n,r,o.text),l=o.i),o.forward(c),h-=c}a.next()}else if(o.ins>=0){let h=0,c=o.len;for(;c;)if(a.ins==-1){let d=Math.min(c,a.len);h+=d,c-=d,a.forward(d)}else if(a.ins==0&&a.len<c)c-=a.len,a.next();else break;Ee(r,h,l<o.i?o.ins:0),n&&l<o.i&&ai(n,r,o.text),l=o.i,o.forward(o.len-c)}else{if(o.done&&a.done)return n?we.createSet(r,n):Ft.create(r);throw new Error("Mismatched change set lengths")}}}function tu(t,e,i=!1){let s=[],r=i?[]:null,n=new lr(t),o=new lr(e);for(let a=!1;;){if(n.done&&o.done)return r?we.createSet(s,r):Ft.create(s);if(n.ins==0)Ee(s,n.len,0,a),n.next();else if(o.len==0&&!o.done)Ee(s,0,o.ins,a),r&&ai(r,s,o.text),o.next();else{if(n.done||o.done)throw new Error("Mismatched change set lengths");{let l=Math.min(n.len2,o.len),h=s.length;if(n.ins==-1){let c=o.ins==-1?-1:o.off?0:o.ins;Ee(s,l,c,a),r&&c&&ai(r,s,o.text)}else o.ins==-1?(Ee(s,n.off?0:n.len,l,a),r&&ai(r,s,n.textBit(l))):(Ee(s,n.off?0:n.len,o.off?0:o.ins,a),r&&!o.off&&ai(r,s,o.text));a=(n.ins>l||o.ins>=0&&o.len>l)&&(a||s.length>h),n.forward2(l),o.forward(l)}}}}class lr{constructor(e){this.set=e,this.i=0,this.next()}next(){let{sections:e}=this.set;this.i<e.length?(this.len=e[this.i++],this.ins=e[this.i++]):(this.len=0,this.ins=-2),this.off=0}get done(){return this.ins==-2}get len2(){return this.ins<0?this.len:this.ins}get text(){let{inserted:e}=this.set,i=this.i-2>>1;return i>=e.length?Y.empty:e[i]}textBit(e){let{inserted:i}=this.set,s=this.i-2>>1;return s>=i.length&&!e?Y.empty:i[s].slice(this.off,e==null?void 0:this.off+e)}forward(e){e==this.len?this.next():(this.len-=e,this.off+=e)}forward2(e){this.ins==-1?this.forward(e):e==this.ins?this.next():(this.ins-=e,this.off+=e)}}class Bi{constructor(e,i,s){this.from=e,this.to=i,this.flags=s}get anchor(){return this.flags&32?this.to:this.from}get head(){return this.flags&32?this.from:this.to}get empty(){return this.from==this.to}get assoc(){return this.flags&8?-1:this.flags&16?1:0}get bidiLevel(){let e=this.flags&7;return e==7?null:e}get goalColumn(){let e=this.flags>>6;return e==16777215?void 0:e}map(e,i=-1){let s,r;return this.empty?s=r=e.mapPos(this.from,i):(s=e.mapPos(this.from,1),r=e.mapPos(this.to,-1)),s==this.from&&r==this.to?this:new Bi(s,r,this.flags)}extend(e,i=e,s=0){if(e<=this.anchor&&i>=this.anchor)return $.range(e,i,void 0,void 0,s);let r=Math.abs(e-this.anchor)>Math.abs(i-this.anchor)?e:i;return $.range(this.anchor,r,void 0,void 0,s)}eq(e,i=!1){return this.anchor==e.anchor&&this.head==e.head&&this.goalColumn==e.goalColumn&&(!i||!this.empty||this.assoc==e.assoc)}toJSON(){return{anchor:this.anchor,head:this.head}}static fromJSON(e){if(!e||typeof e.anchor!="number"||typeof e.head!="number")throw new RangeError("Invalid JSON representation for SelectionRange");return $.range(e.anchor,e.head)}static create(e,i,s){return new Bi(e,i,s)}}class ${constructor(e,i){this.ranges=e,this.mainIndex=i}map(e,i=-1){return e.empty?this:$.create(this.ranges.map(s=>s.map(e,i)),this.mainIndex)}eq(e,i=!1){if(this.ranges.length!=e.ranges.length||this.mainIndex!=e.mainIndex)return!1;for(let s=0;s<this.ranges.length;s++)if(!this.ranges[s].eq(e.ranges[s],i))return!1;return!0}get main(){return this.ranges[this.mainIndex]}asSingle(){return this.ranges.length==1?this:new $([this.main],0)}addRange(e,i=!0){return $.create([e].concat(this.ranges),i?0:this.mainIndex+1)}replaceRange(e,i=this.mainIndex){let s=this.ranges.slice();return s[i]=e,$.create(s,this.mainIndex)}toJSON(){return{ranges:this.ranges.map(e=>e.toJSON()),main:this.mainIndex}}static fromJSON(e){if(!e||!Array.isArray(e.ranges)||typeof e.main!="number"||e.main>=e.ranges.length)throw new RangeError("Invalid JSON representation for EditorSelection");return new $(e.ranges.map(i=>Bi.fromJSON(i)),e.main)}static single(e,i=e){return new $([$.range(e,i)],0)}static create(e,i=0){if(e.length==0)throw new RangeError("A selection needs at least one range");for(let s=0,r=0;r<e.length;r++){let n=e[r];if(n.empty?n.from<=s:n.from<s)return $.normalized(e.slice(),i);s=n.to}return new $(e,i)}static cursor(e,i=0,s,r){return Bi.create(e,e,(i==0?0:i<0?8:16)|(s==null?7:Math.min(6,s))|(r??16777215)<<6)}static range(e,i,s,r,n){let o=(s??16777215)<<6|(r==null?7:Math.min(6,r));return!n&&e!=i&&(n=i<e?1:-1),i<e?Bi.create(i,e,48|o):Bi.create(e,i,(n?n<0?8:16:0)|o)}static normalized(e,i=0){let s=e[i];e.sort((r,n)=>r.from-n.from),i=e.indexOf(s);for(let r=1;r<e.length;r++){let n=e[r],o=e[r-1];if(n.empty?n.from<=o.to:n.from<o.to){let a=o.from,l=Math.max(n.to,o.to);r<=i&&i--,e.splice(--r,2,n.anchor>n.head?$.range(l,a):$.range(a,l))}}return new $(e,i)}}function iu(t,e){for(let i of t.ranges)if(i.to>e)throw new RangeError("Selection points outside of document")}let Cl=0;class R{constructor(e,i,s,r,n){this.combine=e,this.compareInput=i,this.compare=s,this.isStatic=r,this.id=Cl++,this.default=e([]),this.extensions=typeof n=="function"?n(this):n}get reader(){return this}static define(e={}){return new R(e.combine||(i=>i),e.compareInput||((i,s)=>i===s),e.compare||(e.combine?(i,s)=>i===s:$l),!!e.static,e.enables)}of(e){return new dn([],this,0,e)}compute(e,i){if(this.isStatic)throw new Error("Can't compute a static facet");return new dn(e,this,1,i)}computeN(e,i){if(this.isStatic)throw new Error("Can't compute a static facet");return new dn(e,this,2,i)}from(e,i){return i||(i=s=>s),this.compute([e],s=>i(s.field(e)))}}function $l(t,e){return t==e||t.length==e.length&&t.every((i,s)=>i===e[s])}class dn{constructor(e,i,s,r){this.dependencies=e,this.facet=i,this.type=s,this.value=r,this.id=Cl++}dynamicSlot(e){var i;let s=this.value,r=this.facet.compareInput,n=this.id,o=e[n]>>1,a=this.type==2,l=!1,h=!1,c=[];for(let d of this.dependencies)d=="doc"?l=!0:d=="selection"?h=!0:(((i=e[d.id])!==null&&i!==void 0?i:1)&1)==0&&c.push(e[d.id]);return{create(d){return d.values[o]=s(d),1},update(d,u){if(l&&u.docChanged||h&&(u.docChanged||u.selection)||ba(d,c)){let f=s(d);if(a?!Dh(f,d.values[o],r):!r(f,d.values[o]))return d.values[o]=f,1}return 0},reconfigure:(d,u)=>{let f,g=u.config.address[n];if(g!=null){let m=On(u,g);if(this.dependencies.every(y=>y instanceof R?u.facet(y)===d.facet(y):y instanceof Be?u.field(y,!1)==d.field(y,!1):!0)||(a?Dh(f=s(d),m,r):r(f=s(d),m)))return d.values[o]=m,0}else f=s(d);return d.values[o]=f,1}}}}function Dh(t,e,i){if(t.length!=e.length)return!1;for(let s=0;s<t.length;s++)if(!i(t[s],e[s]))return!1;return!0}function ba(t,e){let i=!1;for(let s of e)Js(t,s)&1&&(i=!0);return i}function Im(t,e,i){let s=i.map(l=>t[l.id]),r=i.map(l=>l.type),n=s.filter(l=>!(l&1)),o=t[e.id]>>1;function a(l){let h=[];for(let c=0;c<s.length;c++){let d=On(l,s[c]);if(r[c]==2)for(let u of d)h.push(u);else h.push(d)}return e.combine(h)}return{create(l){for(let h of s)Js(l,h);return l.values[o]=a(l),1},update(l,h){if(!ba(l,n))return 0;let c=a(l);return e.compare(c,l.values[o])?0:(l.values[o]=c,1)},reconfigure(l,h){let c=ba(l,s),d=h.config.facets[e.id],u=h.facet(e);if(d&&!c&&$l(i,d))return l.values[o]=u,0;let f=a(l);return e.compare(f,u)?(l.values[o]=u,0):(l.values[o]=f,1)}}}const Fr=R.define({static:!0});class Be{constructor(e,i,s,r,n){this.id=e,this.createF=i,this.updateF=s,this.compareF=r,this.spec=n,this.provides=void 0}static define(e){let i=new Be(Cl++,e.create,e.update,e.compare||((s,r)=>s===r),e);return e.provide&&(i.provides=e.provide(i)),i}create(e){let i=e.facet(Fr).find(s=>s.field==this);return((i==null?void 0:i.create)||this.createF)(e)}slot(e){let i=e[this.id]>>1;return{create:s=>(s.values[i]=this.create(s),1),update:(s,r)=>{let n=s.values[i],o=this.updateF(n,r);return this.compareF(n,o)?0:(s.values[i]=o,1)},reconfigure:(s,r)=>{let n=s.facet(Fr),o=r.facet(Fr),a;return(a=n.find(l=>l.field==this))&&a!=o.find(l=>l.field==this)?(s.values[i]=a.create(s),1):r.config.address[this.id]!=null?(s.values[i]=r.field(this),0):(s.values[i]=this.create(s),1)}}}init(e){return[this,Fr.of({field:this,create:e})]}get extension(){return this}}const Mi={lowest:4,low:3,default:2,high:1,highest:0};function Fs(t){return e=>new su(e,t)}const Gi={highest:Fs(Mi.highest),high:Fs(Mi.high),default:Fs(Mi.default),low:Fs(Mi.low),lowest:Fs(Mi.lowest)};class su{constructor(e,i){this.inner=e,this.prec=i}}class oo{of(e){return new va(this,e)}reconfigure(e){return oo.reconfigure.of({compartment:this,extension:e})}get(e){return e.config.compartments.get(this)}}class va{constructor(e,i){this.compartment=e,this.inner=i}}class $n{constructor(e,i,s,r,n,o){for(this.base=e,this.compartments=i,this.dynamicSlots=s,this.address=r,this.staticValues=n,this.facets=o,this.statusTemplate=[];this.statusTemplate.length<s.length;)this.statusTemplate.push(0)}staticFacet(e){let i=this.address[e.id];return i==null?e.default:this.staticValues[i>>1]}static resolve(e,i,s){let r=[],n=Object.create(null),o=new Map;for(let u of Fm(e,i,o))u instanceof Be?r.push(u):(n[u.facet.id]||(n[u.facet.id]=[])).push(u);let a=Object.create(null),l=[],h=[];for(let u of r)a[u.id]=h.length<<1,h.push(f=>u.slot(f));let c=s==null?void 0:s.config.facets;for(let u in n){let f=n[u],g=f[0].facet,m=c&&c[u]||[];if(f.every(y=>y.type==0))if(a[g.id]=l.length<<1|1,$l(m,f))l.push(s.facet(g));else{let y=g.combine(f.map(w=>w.value));l.push(s&&g.compare(y,s.facet(g))?s.facet(g):y)}else{for(let y of f)y.type==0?(a[y.id]=l.length<<1|1,l.push(y.value)):(a[y.id]=h.length<<1,h.push(w=>y.dynamicSlot(w)));a[g.id]=h.length<<1,h.push(y=>Im(y,g,f))}}let d=h.map(u=>u(a));return new $n(e,o,d,a,l,n)}}function Fm(t,e,i){let s=[[],[],[],[],[]],r=new Map;function n(o,a){let l=r.get(o);if(l!=null){if(l<=a)return;let h=s[l].indexOf(o);h>-1&&s[l].splice(h,1),o instanceof va&&i.delete(o.compartment)}if(r.set(o,a),Array.isArray(o))for(let h of o)n(h,a);else if(o instanceof va){if(i.has(o.compartment))throw new RangeError("Duplicate use of compartment in extensions");let h=e.get(o.compartment)||o.inner;i.set(o.compartment,h),n(h,a)}else if(o instanceof su)n(o.inner,o.prec);else if(o instanceof Be)s[a].push(o),o.provides&&n(o.provides,a);else if(o instanceof dn)s[a].push(o),o.facet.extensions&&n(o.facet.extensions,Mi.default);else{let h=o.extension;if(!h)throw new Error(`Unrecognized extension value in extension set (${o}). This sometimes happens because multiple instances of @codemirror/state are loaded, breaking instanceof checks.`);n(h,a)}}return n(t,Mi.default),s.reduce((o,a)=>o.concat(a))}function Js(t,e){if(e&1)return 2;let i=e>>1,s=t.status[i];if(s==4)throw new Error("Cyclic dependency between fields and/or facets");if(s&2)return s;t.status[i]=4;let r=t.computeSlot(t,t.config.dynamicSlots[i]);return t.status[i]=2|r}function On(t,e){return e&1?t.config.staticValues[e>>1]:t.values[e>>1]}const ru=R.define(),ya=R.define({combine:t=>t.some(e=>e),static:!0}),nu=R.define({combine:t=>t.length?t[0]:void 0,static:!0}),ou=R.define(),au=R.define(),lu=R.define(),hu=R.define({combine:t=>t.length?t[0]:!1});class ei{constructor(e,i){this.type=e,this.value=i}static define(){return new Nm}}class Nm{of(e){return new ei(this,e)}}class Um{constructor(e){this.map=e}of(e){return new W(this,e)}}class W{constructor(e,i){this.type=e,this.value=i}map(e){let i=this.type.map(this.value,e);return i===void 0?void 0:i==this.value?this:new W(this.type,i)}is(e){return this.type==e}static define(e={}){return new Um(e.map||(i=>i))}static mapEffects(e,i){if(!e.length)return e;let s=[];for(let r of e){let n=r.map(i);n&&s.push(n)}return s}}W.reconfigure=W.define();W.appendConfig=W.define();class ke{constructor(e,i,s,r,n,o){this.startState=e,this.changes=i,this.selection=s,this.effects=r,this.annotations=n,this.scrollIntoView=o,this._doc=null,this._state=null,s&&iu(s,i.newLength),n.some(a=>a.type==ke.time)||(this.annotations=n.concat(ke.time.of(Date.now())))}static create(e,i,s,r,n,o){return new ke(e,i,s,r,n,o)}get newDoc(){return this._doc||(this._doc=this.changes.apply(this.startState.doc))}get newSelection(){return this.selection||this.startState.selection.map(this.changes)}get state(){return this._state||this.startState.applyTransaction(this),this._state}annotation(e){for(let i of this.annotations)if(i.type==e)return i.value}get docChanged(){return!this.changes.empty}get reconfigured(){return this.startState.config!=this.state.config}isUserEvent(e){let i=this.annotation(ke.userEvent);return!!(i&&(i==e||i.length>e.length&&i.slice(0,e.length)==e&&i[e.length]=="."))}}ke.time=ei.define();ke.userEvent=ei.define();ke.addToHistory=ei.define();ke.remote=ei.define();function Hm(t,e){let i=[];for(let s=0,r=0;;){let n,o;if(s<t.length&&(r==e.length||e[r]>=t[s]))n=t[s++],o=t[s++];else if(r<e.length)n=e[r++],o=e[r++];else return i;!i.length||i[i.length-1]<n?i.push(n,o):i[i.length-1]<o&&(i[i.length-1]=o)}}function cu(t,e,i){var s;let r,n,o;return i?(r=e.changes,n=we.empty(e.changes.length),o=t.changes.compose(e.changes)):(r=e.changes.map(t.changes),n=t.changes.mapDesc(e.changes,!0),o=t.changes.compose(r)),{changes:o,selection:e.selection?e.selection.map(n):(s=t.selection)===null||s===void 0?void 0:s.map(r),effects:W.mapEffects(t.effects,r).concat(W.mapEffects(e.effects,n)),annotations:t.annotations.length?t.annotations.concat(e.annotations):e.annotations,scrollIntoView:t.scrollIntoView||e.scrollIntoView}}function xa(t,e,i){let s=e.selection,r=fs(e.annotations);return e.userEvent&&(r=r.concat(ke.userEvent.of(e.userEvent))),{changes:e.changes instanceof we?e.changes:we.of(e.changes||[],i,t.facet(nu)),selection:s&&(s instanceof $?s:$.single(s.anchor,s.head)),effects:fs(e.effects),annotations:r,scrollIntoView:!!e.scrollIntoView}}function du(t,e,i){let s=xa(t,e.length?e[0]:{},t.doc.length);e.length&&e[0].filter===!1&&(i=!1);for(let n=1;n<e.length;n++){e[n].filter===!1&&(i=!1);let o=!!e[n].sequential;s=cu(s,xa(t,e[n],o?s.changes.newLength:t.doc.length),o)}let r=ke.create(t,s.changes,s.selection,s.effects,s.annotations,s.scrollIntoView);return zm(i?Wm(r):r)}function Wm(t){let e=t.startState,i=!0;for(let r of e.facet(ou)){let n=r(t);if(n===!1){i=!1;break}Array.isArray(n)&&(i=i===!0?n:Hm(i,n))}if(i!==!0){let r,n;if(i===!1)n=t.changes.invertedDesc,r=we.empty(e.doc.length);else{let o=t.changes.filter(i);r=o.changes,n=o.filtered.mapDesc(o.changes).invertedDesc}t=ke.create(e,r,t.selection&&t.selection.map(n),W.mapEffects(t.effects,n),t.annotations,t.scrollIntoView)}let s=e.facet(au);for(let r=s.length-1;r>=0;r--){let n=s[r](t);n instanceof ke?t=n:Array.isArray(n)&&n.length==1&&n[0]instanceof ke?t=n[0]:t=du(e,fs(n),!1)}return t}function zm(t){let e=t.startState,i=e.facet(lu),s=t;for(let r=i.length-1;r>=0;r--){let n=i[r](t);n&&Object.keys(n).length&&(s=cu(s,xa(e,n,t.changes.newLength),!0))}return s==t?t:ke.create(e,t.changes,t.selection,s.effects,s.annotations,s.scrollIntoView)}const qm=[];function fs(t){return t==null?qm:Array.isArray(t)?t:[t]}var fe=(function(t){return t[t.Word=0]="Word",t[t.Space=1]="Space",t[t.Other=2]="Other",t})(fe||(fe={}));const Vm=/[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;let wa;try{wa=new RegExp("[\\p{Alphabetic}\\p{Number}_]","u")}catch{}function jm(t){if(wa)return wa.test(t);for(let e=0;e<t.length;e++){let i=t[e];if(/\w/.test(i)||i>""&&(i.toUpperCase()!=i.toLowerCase()||Vm.test(i)))return!0}return!1}function Qm(t){return e=>{if(!/\S/.test(e))return fe.Space;if(jm(e))return fe.Word;for(let i=0;i<t.length;i++)if(e.indexOf(t[i])>-1)return fe.Word;return fe.Other}}class J{constructor(e,i,s,r,n,o){this.config=e,this.doc=i,this.selection=s,this.values=r,this.status=e.statusTemplate.slice(),this.computeSlot=n,o&&(o._state=this);for(let a=0;a<this.config.dynamicSlots.length;a++)Js(this,a<<1);this.computeSlot=null}field(e,i=!0){let s=this.config.address[e.id];if(s==null){if(i)throw new RangeError("Field is not present in this state");return}return Js(this,s),On(this,s)}update(...e){return du(this,e,!0)}applyTransaction(e){let i=this.config,{base:s,compartments:r}=i;for(let a of e.effects)a.is(oo.reconfigure)?(i&&(r=new Map,i.compartments.forEach((l,h)=>r.set(h,l)),i=null),r.set(a.value.compartment,a.value.extension)):a.is(W.reconfigure)?(i=null,s=a.value):a.is(W.appendConfig)&&(i=null,s=fs(s).concat(a.value));let n;i?n=e.startState.values.slice():(i=$n.resolve(s,r,this),n=new J(i,this.doc,this.selection,i.dynamicSlots.map(()=>null),(l,h)=>h.reconfigure(l,this),null).values);let o=e.startState.facet(ya)?e.newSelection:e.newSelection.asSingle();new J(i,e.newDoc,o,n,(a,l)=>l.update(a,e),e)}replaceSelection(e){return typeof e=="string"&&(e=this.toText(e)),this.changeByRange(i=>({changes:{from:i.from,to:i.to,insert:e},range:$.cursor(i.from+e.length)}))}changeByRange(e){let i=this.selection,s=e(i.ranges[0]),r=this.changes(s.changes),n=[s.range],o=fs(s.effects);for(let a=1;a<i.ranges.length;a++){let l=e(i.ranges[a]),h=this.changes(l.changes),c=h.map(r);for(let u=0;u<a;u++)n[u]=n[u].map(c);let d=r.mapDesc(h,!0);n.push(l.range.map(d)),r=r.compose(c),o=W.mapEffects(o,c).concat(W.mapEffects(fs(l.effects),d))}return{changes:r,selection:$.create(n,i.mainIndex),effects:o}}changes(e=[]){return e instanceof we?e:we.of(e,this.doc.length,this.facet(J.lineSeparator))}toText(e){return Y.of(e.split(this.facet(J.lineSeparator)||pa))}sliceDoc(e=0,i=this.doc.length){return this.doc.sliceString(e,i,this.lineBreak)}facet(e){let i=this.config.address[e.id];return i==null?e.default:(Js(this,i),On(this,i))}toJSON(e){let i={doc:this.sliceDoc(),selection:this.selection.toJSON()};if(e)for(let s in e){let r=e[s];r instanceof Be&&this.config.address[r.id]!=null&&(i[s]=r.spec.toJSON(this.field(e[s]),this))}return i}static fromJSON(e,i={},s){if(!e||typeof e.doc!="string")throw new RangeError("Invalid JSON representation for EditorState");let r=[];if(s){for(let n in s)if(Object.prototype.hasOwnProperty.call(e,n)){let o=s[n],a=e[n];r.push(o.init(l=>o.spec.fromJSON(a,l)))}}return J.create({doc:e.doc,selection:$.fromJSON(e.selection),extensions:i.extensions?r.concat([i.extensions]):r})}static create(e={}){let i=$n.resolve(e.extensions||[],new Map),s=e.doc instanceof Y?e.doc:Y.of((e.doc||"").split(i.staticFacet(J.lineSeparator)||pa)),r=e.selection?e.selection instanceof $?e.selection:$.single(e.selection.anchor,e.selection.head):$.single(0);return iu(r,s.length),i.staticFacet(ya)||(r=r.asSingle()),new J(i,s,r,i.dynamicSlots.map(()=>null),(n,o)=>o.create(n),null)}get tabSize(){return this.facet(J.tabSize)}get lineBreak(){return this.facet(J.lineSeparator)||`
`}get readOnly(){return this.facet(hu)}phrase(e,...i){for(let s of this.facet(J.phrases))if(Object.prototype.hasOwnProperty.call(s,e)){e=s[e];break}return i.length&&(e=e.replace(/\$(\$|\d*)/g,(s,r)=>{if(r=="$")return"$";let n=+(r||1);return!n||n>i.length?s:i[n-1]})),e}languageDataAt(e,i,s=-1){let r=[];for(let n of this.facet(ru))for(let o of n(this,i,s))Object.prototype.hasOwnProperty.call(o,e)&&r.push(o[e]);return r}charCategorizer(e){let i=this.languageDataAt("wordChars",e);return Qm(i.length?i[0]:"")}wordAt(e){let{text:i,from:s,length:r}=this.doc.lineAt(e),n=this.charCategorizer(e),o=e-s,a=e-s;for(;o>0;){let l=$e(i,o,!1);if(n(i.slice(l,o))!=fe.Word)break;o=l}for(;a<r;){let l=$e(i,a);if(n(i.slice(a,l))!=fe.Word)break;a=l}return o==a?null:$.range(o+s,a+s)}}J.allowMultipleSelections=ya;J.tabSize=R.define({combine:t=>t.length?t[0]:4});J.lineSeparator=nu;J.readOnly=hu;J.phrases=R.define({compare(t,e){let i=Object.keys(t),s=Object.keys(e);return i.length==s.length&&i.every(r=>t[r]==e[r])}});J.languageData=ru;J.changeFilter=ou;J.transactionFilter=au;J.transactionExtender=lu;oo.reconfigure=W.define();function zt(t,e,i={}){let s={};for(let r of t)for(let n of Object.keys(r)){let o=r[n],a=s[n];if(a===void 0)s[n]=o;else if(!(a===o||o===void 0))if(Object.hasOwnProperty.call(i,n))s[n]=i[n](a,o);else throw new Error("Config merge conflict for field "+n)}for(let r in e)s[r]===void 0&&(s[r]=e[r]);return s}class fi{eq(e){return this==e}range(e,i=e){return ka.create(e,i,this)}}fi.prototype.startSide=fi.prototype.endSide=0;fi.prototype.point=!1;fi.prototype.mapMode=Fe.TrackDel;function Ol(t,e){return t==e||t.constructor==e.constructor&&t.eq(e)}let ka=class uu{constructor(e,i,s){this.from=e,this.to=i,this.value=s}static create(e,i,s){return new uu(e,i,s)}};function Sa(t,e){return t.from-e.from||t.value.startSide-e.value.startSide}class Al{constructor(e,i,s,r){this.from=e,this.to=i,this.value=s,this.maxPoint=r}get length(){return this.to[this.to.length-1]}findIndex(e,i,s,r=0){let n=s?this.to:this.from;for(let o=r,a=n.length;;){if(o==a)return o;let l=o+a>>1,h=n[l]-e||(s?this.value[l].endSide:this.value[l].startSide)-i;if(l==o)return h>=0?o:a;h>=0?a=l:o=l+1}}between(e,i,s,r){for(let n=this.findIndex(i,-1e9,!0),o=this.findIndex(s,1e9,!1,n);n<o;n++)if(r(this.from[n]+e,this.to[n]+e,this.value[n])===!1)return!1}map(e,i){let s=[],r=[],n=[],o=-1,a=-1;for(let l=0;l<this.value.length;l++){let h=this.value[l],c=this.from[l]+e,d=this.to[l]+e,u,f;if(c==d){let g=i.mapPos(c,h.startSide,h.mapMode);if(g==null||(u=f=g,h.startSide!=h.endSide&&(f=i.mapPos(c,h.endSide),f<u)))continue}else if(u=i.mapPos(c,h.startSide),f=i.mapPos(d,h.endSide),u>f||u==f&&h.startSide>0&&h.endSide<=0)continue;(f-u||h.endSide-h.startSide)<0||(o<0&&(o=u),h.point&&(a=Math.max(a,f-u)),s.push(h),r.push(u-o),n.push(f-o))}return{mapped:s.length?new Al(r,n,s,a):null,pos:o}}}class Q{constructor(e,i,s,r){this.chunkPos=e,this.chunk=i,this.nextLayer=s,this.maxPoint=r}static create(e,i,s,r){return new Q(e,i,s,r)}get length(){let e=this.chunk.length-1;return e<0?0:Math.max(this.chunkEnd(e),this.nextLayer.length)}get size(){if(this.isEmpty)return 0;let e=this.nextLayer.size;for(let i of this.chunk)e+=i.value.length;return e}chunkEnd(e){return this.chunkPos[e]+this.chunk[e].length}update(e){let{add:i=[],sort:s=!1,filterFrom:r=0,filterTo:n=this.length}=e,o=e.filter;if(i.length==0&&!o)return this;if(s&&(i=i.slice().sort(Sa)),this.isEmpty)return i.length?Q.of(i):this;let a=new fu(this,null,-1).goto(0),l=0,h=[],c=new Jt;for(;a.value||l<i.length;)if(l<i.length&&(a.from-i[l].from||a.startSide-i[l].value.startSide)>=0){let d=i[l++];c.addInner(d.from,d.to,d.value)||h.push(d)}else a.rangeIndex==1&&a.chunkIndex<this.chunk.length&&(l==i.length||this.chunkEnd(a.chunkIndex)<i[l].from)&&(!o||r>this.chunkEnd(a.chunkIndex)||n<this.chunkPos[a.chunkIndex])&&c.addChunk(this.chunkPos[a.chunkIndex],this.chunk[a.chunkIndex])?a.nextChunk():((!o||r>a.to||n<a.from||o(a.from,a.to,a.value))&&(c.addInner(a.from,a.to,a.value)||h.push(ka.create(a.from,a.to,a.value))),a.next());return c.finishInner(this.nextLayer.isEmpty&&!h.length?Q.empty:this.nextLayer.update({add:h,filter:o,filterFrom:r,filterTo:n}))}map(e){if(e.empty||this.isEmpty)return this;let i=[],s=[],r=-1;for(let o=0;o<this.chunk.length;o++){let a=this.chunkPos[o],l=this.chunk[o],h=e.touchesRange(a,a+l.length);if(h===!1)r=Math.max(r,l.maxPoint),i.push(l),s.push(e.mapPos(a));else if(h===!0){let{mapped:c,pos:d}=l.map(a,e);c&&(r=Math.max(r,c.maxPoint),i.push(c),s.push(d))}}let n=this.nextLayer.map(e);return i.length==0?n:new Q(s,i,n||Q.empty,r)}between(e,i,s){if(!this.isEmpty){for(let r=0;r<this.chunk.length;r++){let n=this.chunkPos[r],o=this.chunk[r];if(i>=n&&e<=n+o.length&&o.between(n,e-n,i-n,s)===!1)return}this.nextLayer.between(e,i,s)}}iter(e=0){return hr.from([this]).goto(e)}get isEmpty(){return this.nextLayer==this}static iter(e,i=0){return hr.from(e).goto(i)}static compare(e,i,s,r,n=-1){let o=e.filter(d=>d.maxPoint>0||!d.isEmpty&&d.maxPoint>=n),a=i.filter(d=>d.maxPoint>0||!d.isEmpty&&d.maxPoint>=n),l=Bh(o,a,s),h=new Ns(o,l,n),c=new Ns(a,l,n);s.iterGaps((d,u,f)=>Rh(h,d,c,u,f,r)),s.empty&&s.length==0&&Rh(h,0,c,0,0,r)}static eq(e,i,s=0,r){r==null&&(r=999999999);let n=e.filter(c=>!c.isEmpty&&i.indexOf(c)<0),o=i.filter(c=>!c.isEmpty&&e.indexOf(c)<0);if(n.length!=o.length)return!1;if(!n.length)return!0;let a=Bh(n,o),l=new Ns(n,a,0).goto(s),h=new Ns(o,a,0).goto(s);for(;;){if(l.to!=h.to||!Ca(l.active,h.active)||l.point&&(!h.point||!Ol(l.point,h.point)))return!1;if(l.to>r)return!0;l.next(),h.next()}}static spans(e,i,s,r,n=-1){let o=new Ns(e,null,n).goto(i),a=i,l=o.openStart;for(;;){let h=Math.min(o.to,s);if(o.point){let c=o.activeForPoint(o.to),d=o.pointFrom<i?c.length+1:o.point.startSide<0?c.length:Math.min(c.length,l);r.point(a,h,o.point,c,d,o.pointRank),l=Math.min(o.openEnd(h),c.length)}else h>a&&(r.span(a,h,o.active,l),l=o.openEnd(h));if(o.to>s)return l+(o.point&&o.to>s?1:0);a=o.to,o.next()}}static of(e,i=!1){let s=new Jt;for(let r of e instanceof ka?[e]:i?Km(e):e)s.add(r.from,r.to,r.value);return s.finish()}static join(e){if(!e.length)return Q.empty;let i=e[e.length-1];for(let s=e.length-2;s>=0;s--)for(let r=e[s];r!=Q.empty;r=r.nextLayer)i=new Q(r.chunkPos,r.chunk,i,Math.max(r.maxPoint,i.maxPoint));return i}}Q.empty=new Q([],[],null,-1);function Km(t){if(t.length>1)for(let e=t[0],i=1;i<t.length;i++){let s=t[i];if(Sa(e,s)>0)return t.slice().sort(Sa);e=s}return t}Q.empty.nextLayer=Q.empty;class Jt{finishChunk(e){this.chunks.push(new Al(this.from,this.to,this.value,this.maxPoint)),this.chunkPos.push(this.chunkStart),this.chunkStart=-1,this.setMaxPoint=Math.max(this.setMaxPoint,this.maxPoint),this.maxPoint=-1,e&&(this.from=[],this.to=[],this.value=[])}constructor(){this.chunks=[],this.chunkPos=[],this.chunkStart=-1,this.last=null,this.lastFrom=-1e9,this.lastTo=-1e9,this.from=[],this.to=[],this.value=[],this.maxPoint=-1,this.setMaxPoint=-1,this.nextLayer=null}add(e,i,s){this.addInner(e,i,s)||(this.nextLayer||(this.nextLayer=new Jt)).add(e,i,s)}addInner(e,i,s){let r=e-this.lastTo||s.startSide-this.last.endSide;if(r<=0&&(e-this.lastFrom||s.startSide-this.last.startSide)<0)throw new Error("Ranges must be added sorted by `from` position and `startSide`");return r<0?!1:(this.from.length==250&&this.finishChunk(!0),this.chunkStart<0&&(this.chunkStart=e),this.from.push(e-this.chunkStart),this.to.push(i-this.chunkStart),this.last=s,this.lastFrom=e,this.lastTo=i,this.value.push(s),s.point&&(this.maxPoint=Math.max(this.maxPoint,i-e)),!0)}addChunk(e,i){if((e-this.lastTo||i.value[0].startSide-this.last.endSide)<0)return!1;this.from.length&&this.finishChunk(!0),this.setMaxPoint=Math.max(this.setMaxPoint,i.maxPoint),this.chunks.push(i),this.chunkPos.push(e);let s=i.value.length-1;return this.last=i.value[s],this.lastFrom=i.from[s]+e,this.lastTo=i.to[s]+e,!0}finish(){return this.finishInner(Q.empty)}finishInner(e){if(this.from.length&&this.finishChunk(!1),this.chunks.length==0)return e;let i=Q.create(this.chunkPos,this.chunks,this.nextLayer?this.nextLayer.finishInner(e):e,this.setMaxPoint);return this.from=null,i}}function Bh(t,e,i){let s=new Map;for(let n of t)for(let o=0;o<n.chunk.length;o++)n.chunk[o].maxPoint<=0&&s.set(n.chunk[o],n.chunkPos[o]);let r=new Set;for(let n of e)for(let o=0;o<n.chunk.length;o++){let a=s.get(n.chunk[o]);a!=null&&(i?i.mapPos(a):a)==n.chunkPos[o]&&!(i!=null&&i.touchesRange(a,a+n.chunk[o].length))&&r.add(n.chunk[o])}return r}class fu{constructor(e,i,s,r=0){this.layer=e,this.skip=i,this.minPoint=s,this.rank=r}get startSide(){return this.value?this.value.startSide:0}get endSide(){return this.value?this.value.endSide:0}goto(e,i=-1e9){return this.chunkIndex=this.rangeIndex=0,this.gotoInner(e,i,!1),this}gotoInner(e,i,s){for(;this.chunkIndex<this.layer.chunk.length;){let r=this.layer.chunk[this.chunkIndex];if(!(this.skip&&this.skip.has(r)||this.layer.chunkEnd(this.chunkIndex)<e||r.maxPoint<this.minPoint))break;this.chunkIndex++,s=!1}if(this.chunkIndex<this.layer.chunk.length){let r=this.layer.chunk[this.chunkIndex].findIndex(e-this.layer.chunkPos[this.chunkIndex],i,!0);(!s||this.rangeIndex<r)&&this.setRangeIndex(r)}this.next()}forward(e,i){(this.to-e||this.endSide-i)<0&&this.gotoInner(e,i,!0)}next(){for(;;)if(this.chunkIndex==this.layer.chunk.length){this.from=this.to=1e9,this.value=null;break}else{let e=this.layer.chunkPos[this.chunkIndex],i=this.layer.chunk[this.chunkIndex],s=e+i.from[this.rangeIndex];if(this.from=s,this.to=e+i.to[this.rangeIndex],this.value=i.value[this.rangeIndex],this.setRangeIndex(this.rangeIndex+1),this.minPoint<0||this.value.point&&this.to-this.from>=this.minPoint)break}}setRangeIndex(e){if(e==this.layer.chunk[this.chunkIndex].value.length){if(this.chunkIndex++,this.skip)for(;this.chunkIndex<this.layer.chunk.length&&this.skip.has(this.layer.chunk[this.chunkIndex]);)this.chunkIndex++;this.rangeIndex=0}else this.rangeIndex=e}nextChunk(){this.chunkIndex++,this.rangeIndex=0,this.next()}compare(e){return this.from-e.from||this.startSide-e.startSide||this.rank-e.rank||this.to-e.to||this.endSide-e.endSide}}class hr{constructor(e){this.heap=e}static from(e,i=null,s=-1){let r=[];for(let n=0;n<e.length;n++)for(let o=e[n];!o.isEmpty;o=o.nextLayer)o.maxPoint>=s&&r.push(new fu(o,i,s,n));return r.length==1?r[0]:new hr(r)}get startSide(){return this.value?this.value.startSide:0}goto(e,i=-1e9){for(let s of this.heap)s.goto(e,i);for(let s=this.heap.length>>1;s>=0;s--)_o(this.heap,s);return this.next(),this}forward(e,i){for(let s of this.heap)s.forward(e,i);for(let s=this.heap.length>>1;s>=0;s--)_o(this.heap,s);(this.to-e||this.value.endSide-i)<0&&this.next()}next(){if(this.heap.length==0)this.from=this.to=1e9,this.value=null,this.rank=-1;else{let e=this.heap[0];this.from=e.from,this.to=e.to,this.value=e.value,this.rank=e.rank,e.value&&e.next(),_o(this.heap,0)}}}function _o(t,e){for(let i=t[e];;){let s=(e<<1)+1;if(s>=t.length)break;let r=t[s];if(s+1<t.length&&r.compare(t[s+1])>=0&&(r=t[s+1],s++),i.compare(r)<0)break;t[s]=i,t[e]=r,e=s}}class Ns{constructor(e,i,s){this.minPoint=s,this.active=[],this.activeTo=[],this.activeRank=[],this.minActive=-1,this.point=null,this.pointFrom=0,this.pointRank=0,this.to=-1e9,this.endSide=0,this.openStart=-1,this.cursor=hr.from(e,i,s)}goto(e,i=-1e9){return this.cursor.goto(e,i),this.active.length=this.activeTo.length=this.activeRank.length=0,this.minActive=-1,this.to=e,this.endSide=i,this.openStart=-1,this.next(),this}forward(e,i){for(;this.minActive>-1&&(this.activeTo[this.minActive]-e||this.active[this.minActive].endSide-i)<0;)this.removeActive(this.minActive);this.cursor.forward(e,i)}removeActive(e){Nr(this.active,e),Nr(this.activeTo,e),Nr(this.activeRank,e),this.minActive=Lh(this.active,this.activeTo)}addActive(e){let i=0,{value:s,to:r,rank:n}=this.cursor;for(;i<this.activeRank.length&&(n-this.activeRank[i]||r-this.activeTo[i])>0;)i++;Ur(this.active,i,s),Ur(this.activeTo,i,r),Ur(this.activeRank,i,n),e&&Ur(e,i,this.cursor.from),this.minActive=Lh(this.active,this.activeTo)}next(){let e=this.to,i=this.point;this.point=null;let s=this.openStart<0?[]:null;for(;;){let r=this.minActive;if(r>-1&&(this.activeTo[r]-this.cursor.from||this.active[r].endSide-this.cursor.startSide)<0){if(this.activeTo[r]>e){this.to=this.activeTo[r],this.endSide=this.active[r].endSide;break}this.removeActive(r),s&&Nr(s,r)}else if(this.cursor.value)if(this.cursor.from>e){this.to=this.cursor.from,this.endSide=this.cursor.startSide;break}else{let n=this.cursor.value;if(!n.point)this.addActive(s),this.cursor.next();else if(i&&this.cursor.to==this.to&&this.cursor.from<this.cursor.to)this.cursor.next();else{this.point=n,this.pointFrom=this.cursor.from,this.pointRank=this.cursor.rank,this.to=this.cursor.to,this.endSide=n.endSide,this.cursor.next(),this.forward(this.to,this.endSide);break}}else{this.to=this.endSide=1e9;break}}if(s){this.openStart=0;for(let r=s.length-1;r>=0&&s[r]<e;r--)this.openStart++}}activeForPoint(e){if(!this.active.length)return this.active;let i=[];for(let s=this.active.length-1;s>=0&&!(this.activeRank[s]<this.pointRank);s--)(this.activeTo[s]>e||this.activeTo[s]==e&&this.active[s].endSide>=this.point.endSide)&&i.push(this.active[s]);return i.reverse()}openEnd(e){let i=0;for(let s=this.activeTo.length-1;s>=0&&this.activeTo[s]>e;s--)i++;return i}}function Rh(t,e,i,s,r,n){t.goto(e),i.goto(s);let o=s+r,a=s,l=s-e,h=!!n.boundChange;for(let c=!1;;){let d=t.to+l-i.to,u=d||t.endSide-i.endSide,f=u<0?t.to+l:i.to,g=Math.min(f,o);if(t.point||i.point?(t.point&&i.point&&Ol(t.point,i.point)&&Ca(t.activeForPoint(t.to),i.activeForPoint(i.to))||n.comparePoint(a,g,t.point,i.point),c=!1):(c&&n.boundChange(a),g>a&&!Ca(t.active,i.active)&&n.compareRange(a,g,t.active,i.active),h&&g<o&&(d||t.openEnd(f)!=i.openEnd(f))&&(c=!0)),f>o)break;a=f,u<=0&&t.next(),u>=0&&i.next()}}function Ca(t,e){if(t.length!=e.length)return!1;for(let i=0;i<t.length;i++)if(t[i]!=e[i]&&!Ol(t[i],e[i]))return!1;return!0}function Nr(t,e){for(let i=e,s=t.length-1;i<s;i++)t[i]=t[i+1];t.pop()}function Ur(t,e,i){for(let s=t.length-1;s>=e;s--)t[s+1]=t[s];t[e]=i}function Lh(t,e){let i=-1,s=1e9;for(let r=0;r<e.length;r++)(e[r]-s||t[r].endSide-t[i].endSide)<0&&(i=r,s=e[r]);return i}function _s(t,e,i=t.length){let s=0;for(let r=0;r<i&&r<t.length;)t.charCodeAt(r)==9?(s+=e-s%e,r++):(s++,r=$e(t,r));return s}function $a(t,e,i,s){for(let r=0,n=0;;){if(n>=e)return r;if(r==t.length)break;n+=t.charCodeAt(r)==9?i-n%i:1,r=$e(t,r)}return s===!0?-1:t.length}const Oa="ͼ",Ih=typeof Symbol>"u"?"__"+Oa:Symbol.for(Oa),Aa=typeof Symbol>"u"?"__styleSet"+Math.floor(Math.random()*1e8):Symbol("styleSet"),Fh=typeof globalThis<"u"?globalThis:typeof window<"u"?window:{};class pi{constructor(e,i){this.rules=[];let{finish:s}=i||{};function r(o){return/^@/.test(o)?[o]:o.split(/,\s*/)}function n(o,a,l,h){let c=[],d=/^@(\w+)\b/.exec(o[0]),u=d&&d[1]=="keyframes";if(d&&a==null)return l.push(o[0]+";");for(let f in a){let g=a[f];if(/&/.test(f))n(f.split(/,\s*/).map(m=>o.map(y=>m.replace(/&/,y))).reduce((m,y)=>m.concat(y)),g,l);else if(g&&typeof g=="object"){if(!d)throw new RangeError("The value of a property ("+f+") should be a primitive value.");n(r(f),g,c,u)}else g!=null&&c.push(f.replace(/_.*/,"").replace(/[A-Z]/g,m=>"-"+m.toLowerCase())+": "+g+";")}(c.length||u)&&l.push((s&&!d&&!h?o.map(s):o).join(", ")+" {"+c.join(" ")+"}")}for(let o in e)n(r(o),e[o],this.rules)}getRules(){return this.rules.join(`
`)}static newName(){let e=Fh[Ih]||1;return Fh[Ih]=e+1,Oa+e.toString(36)}static mount(e,i,s){let r=e[Aa],n=s&&s.nonce;r?n&&r.setNonce(n):r=new Xm(e,n),r.mount(Array.isArray(i)?i:[i],e)}}let Nh=new Map;class Xm{constructor(e,i){let s=e.ownerDocument||e,r=s.defaultView;if(!e.head&&e.adoptedStyleSheets&&r.CSSStyleSheet){let n=Nh.get(s);if(n)return e[Aa]=n;this.sheet=new r.CSSStyleSheet,Nh.set(s,this)}else this.styleTag=s.createElement("style"),i&&this.styleTag.setAttribute("nonce",i);this.modules=[],e[Aa]=this}mount(e,i){let s=this.sheet,r=0,n=0;for(let o=0;o<e.length;o++){let a=e[o],l=this.modules.indexOf(a);if(l<n&&l>-1&&(this.modules.splice(l,1),n--,l=-1),l==-1){if(this.modules.splice(n++,0,a),s)for(let h=0;h<a.rules.length;h++)s.insertRule(a.rules[h],r++)}else{for(;n<l;)r+=this.modules[n++].rules.length;r+=a.rules.length,n++}}if(s)i.adoptedStyleSheets.indexOf(this.sheet)<0&&(i.adoptedStyleSheets=[this.sheet,...i.adoptedStyleSheets]);else{let o="";for(let l=0;l<this.modules.length;l++)o+=this.modules[l].getRules()+`
`;this.styleTag.textContent=o;let a=i.head||i;this.styleTag.parentNode!=a&&a.insertBefore(this.styleTag,a.firstChild)}}setNonce(e){this.styleTag&&this.styleTag.getAttribute("nonce")!=e&&this.styleTag.setAttribute("nonce",e)}}var gi={8:"Backspace",9:"Tab",10:"Enter",12:"NumLock",13:"Enter",16:"Shift",17:"Control",18:"Alt",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",44:"PrintScreen",45:"Insert",46:"Delete",59:";",61:"=",91:"Meta",92:"Meta",106:"*",107:"+",108:",",109:"-",110:".",111:"/",144:"NumLock",145:"ScrollLock",160:"Shift",161:"Shift",162:"Control",163:"Control",164:"Alt",165:"Alt",173:"-",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"},cr={48:")",49:"!",50:"@",51:"#",52:"$",53:"%",54:"^",55:"&",56:"*",57:"(",59:":",61:"+",173:"_",186:":",187:"+",188:"<",189:"_",190:">",191:"?",192:"~",219:"{",220:"|",221:"}",222:'"'},Jm=typeof navigator<"u"&&/Mac/.test(navigator.platform),Ym=typeof navigator<"u"&&/MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);for(var Pe=0;Pe<10;Pe++)gi[48+Pe]=gi[96+Pe]=String(Pe);for(var Pe=1;Pe<=24;Pe++)gi[Pe+111]="F"+Pe;for(var Pe=65;Pe<=90;Pe++)gi[Pe]=String.fromCharCode(Pe+32),cr[Pe]=String.fromCharCode(Pe);for(var Do in gi)cr.hasOwnProperty(Do)||(cr[Do]=gi[Do]);function Gm(t){var e=Jm&&t.metaKey&&t.shiftKey&&!t.ctrlKey&&!t.altKey||Ym&&t.shiftKey&&t.key&&t.key.length==1||t.key=="Unidentified",i=!e&&t.key||(t.shiftKey?cr:gi)[t.keyCode]||t.key||"Unidentified";return i=="Esc"&&(i="Escape"),i=="Del"&&(i="Delete"),i=="Left"&&(i="ArrowLeft"),i=="Up"&&(i="ArrowUp"),i=="Right"&&(i="ArrowRight"),i=="Down"&&(i="ArrowDown"),i}function se(){var t=arguments[0];typeof t=="string"&&(t=document.createElement(t));var e=1,i=arguments[1];if(i&&typeof i=="object"&&i.nodeType==null&&!Array.isArray(i)){for(var s in i)if(Object.prototype.hasOwnProperty.call(i,s)){var r=i[s];typeof r=="string"?t.setAttribute(s,r):r!=null&&(t[s]=r)}e++}for(;e<arguments.length;e++)pu(t,arguments[e]);return t}function pu(t,e){if(typeof e=="string")t.appendChild(document.createTextNode(e));else if(e!=null)if(e.nodeType!=null)t.appendChild(e);else if(Array.isArray(e))for(var i=0;i<e.length;i++)pu(t,e[i]);else throw new RangeError("Unsupported child node: "+e)}let Ie=typeof navigator<"u"?navigator:{userAgent:"",vendor:"",platform:""},Pa=typeof document<"u"?document:{documentElement:{style:{}}};const Ta=/Edge\/(\d+)/.exec(Ie.userAgent),gu=/MSIE \d/.test(Ie.userAgent),Ma=/Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(Ie.userAgent),ao=!!(gu||Ma||Ta),Uh=!ao&&/gecko\/(\d+)/i.test(Ie.userAgent),Bo=!ao&&/Chrome\/(\d+)/.exec(Ie.userAgent),Hh="webkitFontSmoothing"in Pa.documentElement.style,Ea=!ao&&/Apple Computer/.test(Ie.vendor),Wh=Ea&&(/Mobile\/\w+/.test(Ie.userAgent)||Ie.maxTouchPoints>2);var B={mac:Wh||/Mac/.test(Ie.platform),windows:/Win/.test(Ie.platform),linux:/Linux|X11/.test(Ie.platform),ie:ao,ie_version:gu?Pa.documentMode||6:Ma?+Ma[1]:Ta?+Ta[1]:0,gecko:Uh,gecko_version:Uh?+(/Firefox\/(\d+)/.exec(Ie.userAgent)||[0,0])[1]:0,chrome:!!Bo,chrome_version:Bo?+Bo[1]:0,ios:Wh,android:/Android\b/.test(Ie.userAgent),webkit:Hh,webkit_version:Hh?+(/\bAppleWebKit\/(\d+)/.exec(Ie.userAgent)||[0,0])[1]:0,safari:Ea,safari_version:Ea?+(/\bVersion\/(\d+(\.\d+)?)/.exec(Ie.userAgent)||[0,0])[1]:0,tabSize:Pa.documentElement.style.tabSize!=null?"tab-size":"-moz-tab-size"};function Pl(t,e){for(let i in t)i=="class"&&e.class?e.class+=" "+t.class:i=="style"&&e.style?e.style+=";"+t.style:e[i]=t[i];return e}const An=Object.create(null);function Tl(t,e,i){if(t==e)return!0;t||(t=An),e||(e=An);let s=Object.keys(t),r=Object.keys(e);if(s.length-0!=r.length-0)return!1;for(let n of s)if(n!=i&&(r.indexOf(n)==-1||t[n]!==e[n]))return!1;return!0}function Zm(t,e){for(let i=t.attributes.length-1;i>=0;i--){let s=t.attributes[i].name;e[s]==null&&t.removeAttribute(s)}for(let i in e){let s=e[i];i=="style"?t.style.cssText=s:t.getAttribute(i)!=s&&t.setAttribute(i,s)}}function zh(t,e,i){let s=!1;if(e)for(let r in e)i&&r in i||(s=!0,r=="style"?t.style.cssText="":t.removeAttribute(r));if(i)for(let r in i)e&&e[r]==i[r]||(s=!0,r=="style"?t.style.cssText=i[r]:t.setAttribute(r,i[r]));return s}function eb(t){let e=Object.create(null);for(let i=0;i<t.attributes.length;i++){let s=t.attributes[i];e[s.name]=s.value}return e}class ti{eq(e){return!1}updateDOM(e,i,s){return!1}compare(e){return this==e||this.constructor==e.constructor&&this.eq(e)}get estimatedHeight(){return-1}get lineBreaks(){return 0}ignoreEvent(e){return!0}coordsAt(e,i,s){return null}get isHidden(){return!1}get editable(){return!1}destroy(e){}}var Te=(function(t){return t[t.Text=0]="Text",t[t.WidgetBefore=1]="WidgetBefore",t[t.WidgetAfter=2]="WidgetAfter",t[t.WidgetRange=3]="WidgetRange",t})(Te||(Te={}));class U extends fi{constructor(e,i,s,r){super(),this.startSide=e,this.endSide=i,this.widget=s,this.spec=r}get heightRelevant(){return!1}static mark(e){return new Tr(e)}static widget(e){let i=Math.max(-1e4,Math.min(1e4,e.side||0)),s=!!e.block;return i+=s&&!e.inlineOrder?i>0?3e8:-4e8:i>0?1e8:-1e8,new Ki(e,i,i,s,e.widget||null,!1)}static replace(e){let i=!!e.block,s,r;if(e.isBlockGap)s=-5e8,r=4e8;else{let{start:n,end:o}=mu(e,i);s=(n?i?-3e8:-1:5e8)-1,r=(o?i?2e8:1:-6e8)+1}return new Ki(e,s,r,i,e.widget||null,!0)}static line(e){return new Mr(e)}static set(e,i=!1){return Q.of(e,i)}hasHeight(){return this.widget?this.widget.estimatedHeight>-1:!1}}U.none=Q.empty;class Tr extends U{constructor(e){let{start:i,end:s}=mu(e);super(i?-1:5e8,s?1:-6e8,null,e),this.tagName=e.tagName||"span",this.attrs=e.class&&e.attributes?Pl(e.attributes,{class:e.class}):e.class?{class:e.class}:e.attributes||An}eq(e){return this==e||e instanceof Tr&&this.tagName==e.tagName&&Tl(this.attrs,e.attrs)}range(e,i=e){if(e>=i)throw new RangeError("Mark decorations may not be empty");return super.range(e,i)}}Tr.prototype.point=!1;class Mr extends U{constructor(e){super(-2e8,-2e8,null,e)}eq(e){return e instanceof Mr&&this.spec.class==e.spec.class&&Tl(this.spec.attributes,e.spec.attributes)}range(e,i=e){if(i!=e)throw new RangeError("Line decoration ranges must be zero-length");return super.range(e,i)}}Mr.prototype.mapMode=Fe.TrackBefore;Mr.prototype.point=!0;class Ki extends U{constructor(e,i,s,r,n,o){super(i,s,n,e),this.block=r,this.isReplace=o,this.mapMode=r?i<=0?Fe.TrackBefore:Fe.TrackAfter:Fe.TrackDel}get type(){return this.startSide!=this.endSide?Te.WidgetRange:this.startSide<=0?Te.WidgetBefore:Te.WidgetAfter}get heightRelevant(){return this.block||!!this.widget&&(this.widget.estimatedHeight>=5||this.widget.lineBreaks>0)}eq(e){return e instanceof Ki&&tb(this.widget,e.widget)&&this.block==e.block&&this.startSide==e.startSide&&this.endSide==e.endSide}range(e,i=e){if(this.isReplace&&(e>i||e==i&&this.startSide>0&&this.endSide<=0))throw new RangeError("Invalid range for replacement decoration");if(!this.isReplace&&i!=e)throw new RangeError("Widget decorations can only have zero-length ranges");return super.range(e,i)}}Ki.prototype.point=!0;function mu(t,e=!1){let{inclusiveStart:i,inclusiveEnd:s}=t;return i==null&&(i=t.inclusive),s==null&&(s=t.inclusive),{start:i??e,end:s??e}}function tb(t,e){return t==e||!!(t&&e&&t.compare(e))}function ps(t,e,i,s=0){let r=i.length-1;r>=0&&i[r]+s>=t?i[r]=Math.max(i[r],e):i.push(t,e)}class dr extends fi{constructor(e,i){super(),this.tagName=e,this.attributes=i}eq(e){return e==this||e instanceof dr&&this.tagName==e.tagName&&Tl(this.attributes,e.attributes)}static create(e){return new dr(e.tagName,e.attributes||An)}static set(e,i=!1){return Q.of(e,i)}}dr.prototype.startSide=dr.prototype.endSide=-1;function ur(t){let e;return t.nodeType==11?e=t.getSelection?t:t.ownerDocument:e=t,e.getSelection()}function _a(t,e){return e?t==e||t.contains(e.nodeType!=1?e.parentNode:e):!1}function Ys(t,e){if(!e.anchorNode)return!1;try{return _a(t,e.anchorNode)}catch{return!1}}function un(t){return t.nodeType==3?fr(t,0,t.nodeValue.length).getClientRects():t.nodeType==1?t.getClientRects():[]}function Gs(t,e,i,s){return i?qh(t,e,i,s,-1)||qh(t,e,i,s,1):!1}function mi(t){for(var e=0;;e++)if(t=t.previousSibling,!t)return e}function Pn(t){return t.nodeType==1&&/^(DIV|P|LI|UL|OL|BLOCKQUOTE|DD|DT|H\d|SECTION|PRE)$/.test(t.nodeName)}function qh(t,e,i,s,r){for(;;){if(t==i&&e==s)return!0;if(e==(r<0?0:Yt(t))){if(t.nodeName=="DIV")return!1;let n=t.parentNode;if(!n||n.nodeType!=1)return!1;e=mi(t)+(r<0?0:1),t=n}else if(t.nodeType==1){if(t=t.childNodes[e+(r<0?-1:0)],t.nodeType==1&&t.contentEditable=="false")return!1;e=r<0?Yt(t):0}else return!1}}function Yt(t){return t.nodeType==3?t.nodeValue.length:t.childNodes.length}function Tn(t,e){let i=e?t.left:t.right;return{left:i,right:i,top:t.top,bottom:t.bottom}}function ib(t){let e=t.visualViewport;return e?{left:0,right:e.width,top:0,bottom:e.height}:{left:0,right:t.innerWidth,top:0,bottom:t.innerHeight}}function bu(t,e){let i=e.width/t.offsetWidth,s=e.height/t.offsetHeight;return(i>.995&&i<1.005||!isFinite(i)||Math.abs(e.width-t.offsetWidth)<1)&&(i=1),(s>.995&&s<1.005||!isFinite(s)||Math.abs(e.height-t.offsetHeight)<1)&&(s=1),{scaleX:i,scaleY:s}}function sb(t,e,i,s,r,n,o,a){let l=t.ownerDocument,h=l.defaultView||window;for(let c=t,d=!1;c&&!d;)if(c.nodeType==1){let u,f=c==l.body,g=1,m=1;if(f)u=ib(h);else{if(/^(fixed|sticky)$/.test(getComputedStyle(c).position)&&(d=!0),c.scrollHeight<=c.clientHeight&&c.scrollWidth<=c.clientWidth){c=c.assignedSlot||c.parentNode;continue}let x=c.getBoundingClientRect();({scaleX:g,scaleY:m}=bu(c,x)),u={left:x.left,right:x.left+c.clientWidth*g,top:x.top,bottom:x.top+c.clientHeight*m}}let y=0,w=0;if(r=="nearest")e.top<u.top+o?(w=e.top-(u.top+o),i>0&&e.bottom>u.bottom+w&&(w=e.bottom-u.bottom+o)):e.bottom>u.bottom-o&&(w=e.bottom-u.bottom+o,i<0&&e.top-w<u.top&&(w=e.top-(u.top+o)));else{let x=e.bottom-e.top,O=u.bottom-u.top;w=(r=="center"&&x<=O?e.top+x/2-O/2:r=="start"||r=="center"&&i<0?e.top-o:e.bottom-O+o)-u.top}if(s=="nearest"?e.left<u.left+n?(y=e.left-(u.left+n),i>0&&e.right>u.right+y&&(y=e.right-u.right+n)):e.right>u.right-n&&(y=e.right-u.right+n,i<0&&e.left<u.left+y&&(y=e.left-(u.left+n))):y=(s=="center"?e.left+(e.right-e.left)/2-(u.right-u.left)/2:s=="start"==a?e.left-n:e.right-(u.right-u.left)+n)-u.left,y||w)if(f)h.scrollBy(y,w);else{let x=0,O=0;if(w){let D=c.scrollTop;c.scrollTop+=w/m,O=(c.scrollTop-D)*m}if(y){let D=c.scrollLeft;c.scrollLeft+=y/g,x=(c.scrollLeft-D)*g}e={left:e.left-x,top:e.top-O,right:e.right-x,bottom:e.bottom-O},x&&Math.abs(x-y)<1&&(s="nearest"),O&&Math.abs(O-w)<1&&(r="nearest")}if(f)break;(e.top<u.top||e.bottom>u.bottom||e.left<u.left||e.right>u.right)&&(e={left:Math.max(e.left,u.left),right:Math.min(e.right,u.right),top:Math.max(e.top,u.top),bottom:Math.min(e.bottom,u.bottom)}),c=c.assignedSlot||c.parentNode}else if(c.nodeType==11)c=c.host;else break}function vu(t,e=!0){let i=t.ownerDocument,s=null,r=null;for(let n=t.parentNode;n&&!(n==i.body||(!e||s)&&r);)if(n.nodeType==1)!r&&n.scrollHeight>n.clientHeight&&(r=n),e&&!s&&n.scrollWidth>n.clientWidth&&(s=n),n=n.assignedSlot||n.parentNode;else if(n.nodeType==11)n=n.host;else break;return{x:s,y:r}}class rb{constructor(){this.anchorNode=null,this.anchorOffset=0,this.focusNode=null,this.focusOffset=0}eq(e){return this.anchorNode==e.anchorNode&&this.anchorOffset==e.anchorOffset&&this.focusNode==e.focusNode&&this.focusOffset==e.focusOffset}setRange(e){let{anchorNode:i,focusNode:s}=e;this.set(i,Math.min(e.anchorOffset,i?Yt(i):0),s,Math.min(e.focusOffset,s?Yt(s):0))}set(e,i,s,r){this.anchorNode=e,this.anchorOffset=i,this.focusNode=s,this.focusOffset=r}}let Ti=null;B.safari&&B.safari_version>=26&&(Ti=!1);function yu(t){if(t.setActive)return t.setActive();if(Ti)return t.focus(Ti);let e=[];for(let i=t;i&&(e.push(i,i.scrollTop,i.scrollLeft),i!=i.ownerDocument);i=i.parentNode);if(t.focus(Ti==null?{get preventScroll(){return Ti={preventScroll:!0},!0}}:void 0),!Ti){Ti=!1;for(let i=0;i<e.length;){let s=e[i++],r=e[i++],n=e[i++];s.scrollTop!=r&&(s.scrollTop=r),s.scrollLeft!=n&&(s.scrollLeft=n)}}}let Vh;function fr(t,e,i=e){let s=Vh||(Vh=document.createRange());return s.setEnd(t,i),s.setStart(t,e),s}function gs(t,e,i,s){let r={key:e,code:e,keyCode:i,which:i,cancelable:!0};s&&({altKey:r.altKey,ctrlKey:r.ctrlKey,shiftKey:r.shiftKey,metaKey:r.metaKey}=s);let n=new KeyboardEvent("keydown",r);n.synthetic=!0,t.dispatchEvent(n);let o=new KeyboardEvent("keyup",r);return o.synthetic=!0,t.dispatchEvent(o),n.defaultPrevented||o.defaultPrevented}function nb(t){for(;t;){if(t&&(t.nodeType==9||t.nodeType==11&&t.host))return t;t=t.assignedSlot||t.parentNode}return null}function ob(t,e){let i=e.focusNode,s=e.focusOffset;if(!i||e.anchorNode!=i||e.anchorOffset!=s)return!1;for(s=Math.min(s,Yt(i));;)if(s){if(i.nodeType!=1)return!1;let r=i.childNodes[s-1];r.contentEditable=="false"?s--:(i=r,s=Yt(i))}else{if(i==t)return!0;s=mi(i),i=i.parentNode}}function xu(t){return t instanceof Window?t.pageYOffset>Math.max(0,t.document.documentElement.scrollHeight-t.innerHeight-4):t.scrollTop>Math.max(1,t.scrollHeight-t.clientHeight-4)}function wu(t,e){for(let i=t,s=e;;){if(i.nodeType==3&&s>0)return{node:i,offset:s};if(i.nodeType==1&&s>0){if(i.contentEditable=="false")return null;i=i.childNodes[s-1],s=Yt(i)}else if(i.parentNode&&!Pn(i))s=mi(i),i=i.parentNode;else return null}}function ku(t,e){for(let i=t,s=e;;){if(i.nodeType==3&&s<i.nodeValue.length)return{node:i,offset:s};if(i.nodeType==1&&s<i.childNodes.length){if(i.contentEditable=="false")return null;i=i.childNodes[s],s=0}else if(i.parentNode&&!Pn(i))s=mi(i)+1,i=i.parentNode;else return null}}class bt{constructor(e,i,s=!0){this.node=e,this.offset=i,this.precise=s}static before(e,i){return new bt(e.parentNode,mi(e),i)}static after(e,i){return new bt(e.parentNode,mi(e)+1,i)}}var ae=(function(t){return t[t.LTR=0]="LTR",t[t.RTL=1]="RTL",t})(ae||(ae={}));const Xi=ae.LTR,Ml=ae.RTL;function Su(t){let e=[];for(let i=0;i<t.length;i++)e.push(1<<+t[i]);return e}const ab=Su("88888888888888888888888888888888888666888888787833333333337888888000000000000000000000000008888880000000000000000000000000088888888888888888888888888888888888887866668888088888663380888308888800000000000000000000000800000000000000000000000000000008"),lb=Su("4444448826627288999999999992222222222222222222222222222222222222222222222229999999999999999999994444444444644222822222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222999999949999999229989999223333333333"),Da=Object.create(null),At=[];for(let t of["()","[]","{}"]){let e=t.charCodeAt(0),i=t.charCodeAt(1);Da[e]=i,Da[i]=-e}function Cu(t){return t<=247?ab[t]:1424<=t&&t<=1524?2:1536<=t&&t<=1785?lb[t-1536]:1774<=t&&t<=2220?4:8192<=t&&t<=8204?256:64336<=t&&t<=65023?4:1}const hb=/[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac\ufb50-\ufdff]/;class Rt{get dir(){return this.level%2?Ml:Xi}constructor(e,i,s){this.from=e,this.to=i,this.level=s}side(e,i){return this.dir==i==e?this.to:this.from}forward(e,i){return e==(this.dir==i)}static find(e,i,s,r){let n=-1;for(let o=0;o<e.length;o++){let a=e[o];if(a.from<=i&&a.to>=i){if(a.level==s)return o;(n<0||(r!=0?r<0?a.from<i:a.to>i:e[n].level>a.level))&&(n=o)}}if(n<0)throw new RangeError("Index out of range");return n}}function $u(t,e){if(t.length!=e.length)return!1;for(let i=0;i<t.length;i++){let s=t[i],r=e[i];if(s.from!=r.from||s.to!=r.to||s.direction!=r.direction||!$u(s.inner,r.inner))return!1}return!0}const oe=[];function cb(t,e,i,s,r){for(let n=0;n<=s.length;n++){let o=n?s[n-1].to:e,a=n<s.length?s[n].from:i,l=n?256:r;for(let h=o,c=l,d=l;h<a;h++){let u=Cu(t.charCodeAt(h));u==512?u=c:u==8&&d==4&&(u=16),oe[h]=u==4?2:u,u&7&&(d=u),c=u}for(let h=o,c=l,d=l;h<a;h++){let u=oe[h];if(u==128)h<a-1&&c==oe[h+1]&&c&24?u=oe[h]=c:oe[h]=256;else if(u==64){let f=h+1;for(;f<a&&oe[f]==64;)f++;let g=h&&c==8||f<i&&oe[f]==8?d==1?1:8:256;for(let m=h;m<f;m++)oe[m]=g;h=f-1}else u==8&&d==1&&(oe[h]=1);c=u,u&7&&(d=u)}}}function db(t,e,i,s,r){let n=r==1?2:1;for(let o=0,a=0,l=0;o<=s.length;o++){let h=o?s[o-1].to:e,c=o<s.length?s[o].from:i;for(let d=h,u,f,g;d<c;d++)if(f=Da[u=t.charCodeAt(d)])if(f<0){for(let m=a-3;m>=0;m-=3)if(At[m+1]==-f){let y=At[m+2],w=y&2?r:y&4?y&1?n:r:0;w&&(oe[d]=oe[At[m]]=w),a=m;break}}else{if(At.length==189)break;At[a++]=d,At[a++]=u,At[a++]=l}else if((g=oe[d])==2||g==1){let m=g==r;l=m?0:1;for(let y=a-3;y>=0;y-=3){let w=At[y+2];if(w&2)break;if(m)At[y+2]|=2;else{if(w&4)break;At[y+2]|=4}}}}}function ub(t,e,i,s){for(let r=0,n=s;r<=i.length;r++){let o=r?i[r-1].to:t,a=r<i.length?i[r].from:e;for(let l=o;l<a;){let h=oe[l];if(h==256){let c=l+1;for(;;)if(c==a){if(r==i.length)break;c=i[r++].to,a=r<i.length?i[r].from:e}else if(oe[c]==256)c++;else break;let d=n==1,u=(c<e?oe[c]:s)==1,f=d==u?d?1:2:s;for(let g=c,m=r,y=m?i[m-1].to:t;g>l;)g==y&&(g=i[--m].from,y=m?i[m-1].to:t),oe[--g]=f;l=c}else n=h,l++}}}function Ba(t,e,i,s,r,n,o){let a=s%2?2:1;if(s%2==r%2)for(let l=e,h=0;l<i;){let c=!0,d=!1;if(h==n.length||l<n[h].from){let m=oe[l];m!=a&&(c=!1,d=m==16)}let u=!c&&a==1?[]:null,f=c?s:s+1,g=l;e:for(;;)if(h<n.length&&g==n[h].from){if(d)break e;let m=n[h];if(!c)for(let y=m.to,w=h+1;;){if(y==i)break e;if(w<n.length&&n[w].from==y)y=n[w++].to;else{if(oe[y]==a)break e;break}}if(h++,u)u.push(m);else{m.from>l&&o.push(new Rt(l,m.from,f));let y=m.direction==Xi!=!(f%2);Ra(t,y?s+1:s,r,m.inner,m.from,m.to,o),l=m.to}g=m.to}else{if(g==i||(c?oe[g]!=a:oe[g]==a))break;g++}u?Ba(t,l,g,s+1,r,u,o):l<g&&o.push(new Rt(l,g,f)),l=g}else for(let l=i,h=n.length;l>e;){let c=!0,d=!1;if(!h||l>n[h-1].to){let m=oe[l-1];m!=a&&(c=!1,d=m==16)}let u=!c&&a==1?[]:null,f=c?s:s+1,g=l;e:for(;;)if(h&&g==n[h-1].to){if(d)break e;let m=n[--h];if(!c)for(let y=m.from,w=h;;){if(y==e)break e;if(w&&n[w-1].to==y)y=n[--w].from;else{if(oe[y-1]==a)break e;break}}if(u)u.push(m);else{m.to<l&&o.push(new Rt(m.to,l,f));let y=m.direction==Xi!=!(f%2);Ra(t,y?s+1:s,r,m.inner,m.from,m.to,o),l=m.from}g=m.from}else{if(g==e||(c?oe[g-1]!=a:oe[g-1]==a))break;g--}u?Ba(t,g,l,s+1,r,u,o):g<l&&o.push(new Rt(g,l,f)),l=g}}function Ra(t,e,i,s,r,n,o){let a=e%2?2:1;cb(t,r,n,s,a),db(t,r,n,s,a),ub(r,n,s,a),Ba(t,r,n,e,i,s,o)}function fb(t,e,i){if(!t)return[new Rt(0,0,e==Ml?1:0)];if(e==Xi&&!i.length&&!hb.test(t))return Ou(t.length);if(i.length)for(;t.length>oe.length;)oe[oe.length]=256;let s=[],r=e==Xi?0:1;return Ra(t,r,r,i,0,t.length,s),s}function Ou(t){return[new Rt(0,t,0)]}let Au="";function pb(t,e,i,s,r){var n;let o=s.head-t.from,a=Rt.find(e,o,(n=s.bidiLevel)!==null&&n!==void 0?n:-1,s.assoc),l=e[a],h=l.side(r,i);if(o==h){let u=a+=r?1:-1;if(u<0||u>=e.length)return null;l=e[a=u],o=l.side(!r,i),h=l.side(r,i)}let c=$e(t.text,o,l.forward(r,i));(c<l.from||c>l.to)&&(c=h),Au=t.text.slice(Math.min(o,c),Math.max(o,c));let d=a==(r?e.length-1:0)?null:e[a+(r?1:-1)];return d&&c==h&&d.level+(r?0:1)<l.level?$.cursor(d.side(!r,i)+t.from,d.forward(r,i)?1:-1,d.level):$.cursor(c+t.from,l.forward(r,i)?-1:1,l.level)}function gb(t,e,i){for(let s=e;s<i;s++){let r=Cu(t.charCodeAt(s));if(r==1)return Xi;if(r==2||r==4)return Ml}return Xi}const Pu=R.define(),Tu=R.define(),Mu=R.define(),Eu=R.define(),La=R.define(),_u=R.define(),Du=R.define(),El=R.define(),_l=R.define(),Bu=R.define({combine:t=>t.some(e=>e)}),Ru=R.define({combine:t=>t.some(e=>e)}),Lu=R.define();class ms{constructor(e,i,s,r,n,o=!1){this.range=e,this.y=i,this.x=s,this.yMargin=r,this.xMargin=n,this.isSnapshot=o}map(e){return e.empty?this:new ms(this.range.map(e),this.y,this.x,this.yMargin,this.xMargin,this.isSnapshot)}clip(e){return this.range.to<=e.doc.length?this:new ms($.cursor(e.doc.length),this.y,this.x,this.yMargin,this.xMargin,this.isSnapshot)}}const Hr=W.define({map:(t,e)=>t.map(e)}),Iu=W.define();function Qe(t,e,i){let s=t.facet(Eu);s.length?s[0](e):window.onerror&&window.onerror(String(e),i,void 0,void 0,e)||(i?console.error(i+":",e):console.error(e))}const Qt=R.define({combine:t=>t.length?t[0]:!0});let mb=0;const os=R.define({combine(t){return t.filter((e,i)=>{for(let s=0;s<i;s++)if(t[s].plugin==e.plugin)return!1;return!0})}});class ye{constructor(e,i,s,r,n){this.id=e,this.create=i,this.domEventHandlers=s,this.domEventObservers=r,this.baseExtensions=n(this),this.extension=this.baseExtensions.concat(os.of({plugin:this,arg:void 0}))}of(e){return this.baseExtensions.concat(os.of({plugin:this,arg:e}))}static define(e,i){const{eventHandlers:s,eventObservers:r,provide:n,decorations:o}=i||{};return new ye(mb++,e,s,r,a=>{let l=[];return o&&l.push(lo.of(h=>{let c=h.plugin(a);return c?o(c):U.none})),n&&l.push(n(a)),l})}static fromClass(e,i){return ye.define((s,r)=>new e(s,r),i)}}class Ro{constructor(e){this.spec=e,this.mustUpdate=null,this.value=null}get plugin(){return this.spec&&this.spec.plugin}update(e){if(this.value){if(this.mustUpdate){let i=this.mustUpdate;if(this.mustUpdate=null,this.value.update)try{this.value.update(i)}catch(s){if(Qe(i.state,s,"CodeMirror plugin crashed"),this.value.destroy)try{this.value.destroy()}catch{}this.deactivate()}}}else if(this.spec)try{this.value=this.spec.plugin.create(e,this.spec.arg)}catch(i){Qe(e.state,i,"CodeMirror plugin crashed"),this.deactivate()}return this}destroy(e){var i;if(!((i=this.value)===null||i===void 0)&&i.destroy)try{this.value.destroy()}catch(s){Qe(e.state,s,"CodeMirror plugin crashed")}}deactivate(){this.spec=this.value=null}}const Fu=R.define(),Dl=R.define(),lo=R.define(),Nu=R.define(),Bl=R.define(),Er=R.define(),Uu=R.define();function jh(t,e){let i=t.state.facet(Uu);if(!i.length)return i;let s=i.map(n=>n instanceof Function?n(t):n),r=[];return Q.spans(s,e.from,e.to,{point(){},span(n,o,a,l){let h=n-e.from,c=o-e.from,d=r;for(let u=a.length-1;u>=0;u--,l--){let f=a[u].spec.bidiIsolate,g;if(f==null&&(f=gb(e.text,h,c)),l>0&&d.length&&(g=d[d.length-1]).to==h&&g.direction==f)g.to=c,d=g.inner;else{let m={from:h,to:c,direction:f,inner:[]};d.push(m),d=m.inner}}}}),r}const Hu=R.define();function Rl(t){let e=0,i=0,s=0,r=0;for(let n of t.state.facet(Hu)){let o=n(t);o&&(o.left!=null&&(e=Math.max(e,o.left)),o.right!=null&&(i=Math.max(i,o.right)),o.top!=null&&(s=Math.max(s,o.top)),o.bottom!=null&&(r=Math.max(r,o.bottom)))}return{left:e,right:i,top:s,bottom:r}}const zs=R.define();class ct{constructor(e,i,s,r){this.fromA=e,this.toA=i,this.fromB=s,this.toB=r}join(e){return new ct(Math.min(this.fromA,e.fromA),Math.max(this.toA,e.toA),Math.min(this.fromB,e.fromB),Math.max(this.toB,e.toB))}addToSet(e){let i=e.length,s=this;for(;i>0;i--){let r=e[i-1];if(!(r.fromA>s.toA)){if(r.toA<s.fromA)break;s=s.join(r),e.splice(i-1,1)}}return e.splice(i,0,s),e}static extendWithRanges(e,i){if(i.length==0)return e;let s=[];for(let r=0,n=0,o=0;;){let a=r<e.length?e[r].fromB:1e9,l=n<i.length?i[n]:1e9,h=Math.min(a,l);if(h==1e9)break;let c=h+o,d=h,u=c;for(;;)if(n<i.length&&i[n]<=d){let f=i[n+1];n+=2,d=Math.max(d,f);for(let g=r;g<e.length&&e[g].fromB<=d;g++)o=e[g].toA-e[g].toB;u=Math.max(u,f+o)}else if(r<e.length&&e[r].fromB<=d){let f=e[r++];d=Math.max(d,f.toB),u=Math.max(u,f.toA),o=f.toA-f.toB}else break;s.push(new ct(c,u,h,d))}return s}}class Mn{constructor(e,i,s){this.view=e,this.state=i,this.transactions=s,this.flags=0,this.startState=e.state,this.changes=we.empty(this.startState.doc.length);for(let n of s)this.changes=this.changes.compose(n.changes);let r=[];this.changes.iterChangedRanges((n,o,a,l)=>r.push(new ct(n,o,a,l))),this.changedRanges=r}static create(e,i,s){return new Mn(e,i,s)}get viewportChanged(){return(this.flags&4)>0}get viewportMoved(){return(this.flags&8)>0}get heightChanged(){return(this.flags&2)>0}get geometryChanged(){return this.docChanged||(this.flags&18)>0}get focusChanged(){return(this.flags&1)>0}get docChanged(){return!this.changes.empty}get selectionSet(){return this.transactions.some(e=>e.selection)}get empty(){return this.flags==0&&this.transactions.length==0}}const bb=[];class me{constructor(e,i,s=0){this.dom=e,this.length=i,this.flags=s,this.parent=null,e.cmTile=this}get breakAfter(){return this.flags&1}get children(){return bb}isWidget(){return!1}get isHidden(){return!1}isComposite(){return!1}isLine(){return!1}isText(){return!1}isBlock(){return!1}get domAttrs(){return null}sync(e){if(this.flags|=2,this.flags&4){this.flags&=-5;let i=this.domAttrs;i&&Zm(this.dom,i)}}toString(){return this.constructor.name+(this.children.length?`(${this.children})`:"")+(this.breakAfter?"#":"")}destroy(){this.parent=null}setDOM(e){this.dom=e,e.cmTile=this}get posAtStart(){return this.parent?this.parent.posBefore(this):0}get posAtEnd(){return this.posAtStart+this.length}posBefore(e,i=this.posAtStart){let s=i;for(let r of this.children){if(r==e)return s;s+=r.length+r.breakAfter}throw new RangeError("Invalid child in posBefore")}posAfter(e){return this.posBefore(e)+e.length}covers(e){return!0}coordsIn(e,i){return null}domPosFor(e,i){let s=mi(this.dom),r=this.length?e>0:i>0;return new bt(this.parent.dom,s+(r?1:0),e==0||e==this.length)}markDirty(e){this.flags&=-3,e&&(this.flags|=4),this.parent&&this.parent.flags&2&&this.parent.markDirty(!1)}get overrideDOMText(){return null}get root(){for(let e=this;e;e=e.parent)if(e instanceof co)return e;return null}static get(e){return e.cmTile}}class ho extends me{constructor(e){super(e,0),this._children=[]}isComposite(){return!0}get children(){return this._children}get lastChild(){return this.children.length?this.children[this.children.length-1]:null}append(e){this.children.push(e),e.parent=this}sync(e){if(this.flags&2)return;super.sync(e);let i=this.dom,s=null,r,n=(e==null?void 0:e.node)==i?e:null,o=0;for(let a of this.children){if(a.sync(e),o+=a.length+a.breakAfter,r=s?s.nextSibling:i.firstChild,n&&r!=a.dom&&(n.written=!0),a.dom.parentNode==i)for(;r&&r!=a.dom;)r=Qh(r);else i.insertBefore(a.dom,r);s=a.dom}for(r=s?s.nextSibling:i.firstChild,n&&r&&(n.written=!0);r;)r=Qh(r);this.length=o}}function Qh(t){let e=t.nextSibling;return t.parentNode.removeChild(t),e}class co extends ho{constructor(e,i){super(i),this.view=e}owns(e){for(;e;e=e.parent)if(e==this)return!0;return!1}isBlock(){return!0}nearest(e){for(;;){if(!e)return null;let i=me.get(e);if(i&&this.owns(i))return i;e=e.parentNode}}blockTiles(e){for(let i=[],s=this,r=0,n=0;;)if(r==s.children.length){if(!i.length)return;s=s.parent,s.breakAfter&&n++,r=i.pop()}else{let o=s.children[r++];if(o instanceof Xt)i.push(r),s=o,r=0;else{let a=n+o.length,l=e(o,n);if(l!==void 0)return l;n=a+o.breakAfter}}}resolveBlock(e,i){let s,r=-1,n,o=-1;if(this.blockTiles((a,l)=>{let h=l+a.length;if(e>=l&&e<=h){if(a.isWidget()&&i>=-1&&i<=1){if(a.flags&32)return!0;a.flags&16&&(s=void 0)}(l<e||e==h&&(i<-1?a.length:a.covers(1)))&&(!s||!a.isWidget()&&s.isWidget())&&(s=a,r=e-l),(h>e||e==l&&(i>1?a.length:a.covers(-1)))&&(!n||!a.isWidget()&&n.isWidget())&&(n=a,o=e-l)}}),!s&&!n)throw new Error("No tile at position "+e);return s&&i<0||!n?{tile:s,offset:r}:{tile:n,offset:o}}}class Xt extends ho{constructor(e,i){super(e),this.wrapper=i}isBlock(){return!0}covers(e){return this.children.length?e<0?this.children[0].covers(-1):this.lastChild.covers(1):!1}get domAttrs(){return this.wrapper.attributes}static of(e,i){let s=new Xt(i||document.createElement(e.tagName),e);return i||(s.flags|=4),s}}class Ss extends ho{constructor(e,i){super(e),this.attrs=i}isLine(){return!0}static start(e,i,s){let r=new Ss(i||document.createElement("div"),e);return(!i||!s)&&(r.flags|=4),r}get domAttrs(){return this.attrs}resolveInline(e,i,s){let r=null,n=-1,o=null,a=-1;function l(c,d){for(let u=0,f=0;u<c.children.length&&f<=d;u++){let g=c.children[u],m=f+g.length;m>=d&&(g.isComposite()?l(g,d-f):(!o||o.isHidden&&(i>0||s&&yb(o,g)))&&(m>d||g.flags&32)?(o=g,a=d-f):(f<d||g.flags&16&&!g.isHidden)&&(r=g,n=d-f)),f=m}}l(this,e);let h=(i<0?r:o)||r||o;return h?{tile:h,offset:h==r?n:a}:null}coordsIn(e,i){let s=this.resolveInline(e,i,!0);return s?s.tile.coordsIn(Math.max(0,s.offset),i):vb(this)}domIn(e,i){let s=this.resolveInline(e,i);if(s){let{tile:r,offset:n}=s;if(this.dom.contains(r.dom))return r.isText()?new bt(r.dom,Math.min(r.dom.nodeValue.length,n)):r.domPosFor(n,r.flags&16?1:r.flags&32?-1:i);let o=s.tile.parent,a=!1;for(let l of o.children){if(a)return new bt(l.dom,0);l==s.tile&&(a=!0)}}return new bt(this.dom,0)}}function vb(t){let e=t.dom.lastChild;if(!e)return t.dom.getBoundingClientRect();let i=un(e);return i[i.length-1]||null}function yb(t,e){let i=t.coordsIn(0,1),s=e.coordsIn(0,1);return i&&s&&s.top<i.bottom}class je extends ho{constructor(e,i){super(e),this.mark=i}get domAttrs(){return this.mark.attrs}static of(e,i){let s=new je(i||document.createElement(e.tagName),e);return i||(s.flags|=4),s}}class Ri extends me{constructor(e,i){super(e,i.length),this.text=i}sync(e){this.flags&2||(super.sync(e),this.dom.nodeValue!=this.text&&(e&&e.node==this.dom&&(e.written=!0),this.dom.nodeValue=this.text))}isText(){return!0}toString(){return JSON.stringify(this.text)}coordsIn(e,i){let s=this.dom.nodeValue.length;e>s&&(e=s);let r=e,n=e,o=0;e==0&&i<0||e==s&&i>=0?B.chrome||B.gecko||(e?(r--,o=1):n<s&&(n++,o=-1)):i<0?r--:n<s&&n++;let a=fr(this.dom,r,n).getClientRects();if(!a.length)return null;let l=a[(o?o<0:i>=0)?0:a.length-1];return B.safari&&!o&&l.width==0&&(l=Array.prototype.find.call(a,h=>h.width)||l),o?Tn(l,o<0):l||null}static of(e,i){let s=new Ri(i||document.createTextNode(e),e);return i||(s.flags|=2),s}}class Ji extends me{constructor(e,i,s,r){super(e,i,r),this.widget=s}isWidget(){return!0}get isHidden(){return this.widget.isHidden}covers(e){return this.flags&48?!1:(this.flags&(e<0?64:128))>0}coordsIn(e,i){return this.coordsInWidget(e,i,!1)}coordsInWidget(e,i,s){let r=this.widget.coordsAt(this.dom,e,i);if(r)return r;if(s)return Tn(this.dom.getBoundingClientRect(),this.length?e==0:i<=0);{let n=this.dom.getClientRects(),o=null;if(!n.length)return null;let a=this.flags&16?!0:this.flags&32?!1:e>0;for(let l=a?n.length-1:0;o=n[l],!(e>0?l==0:l==n.length-1||o.top<o.bottom);l+=a?-1:1);return Tn(o,!a)}}get overrideDOMText(){if(!this.length)return Y.empty;let{root:e}=this;if(!e)return Y.empty;let i=this.posAtStart;return e.view.state.doc.slice(i,i+this.length)}destroy(){super.destroy(),this.widget.destroy(this.dom)}static of(e,i,s,r,n){return n||(n=e.toDOM(i),e.editable||(n.contentEditable="false")),new Ji(n,s,e,r)}}class En extends me{constructor(e){let i=document.createElement("img");i.className="cm-widgetBuffer",i.setAttribute("aria-hidden","true"),super(i,0,e)}get isHidden(){return!0}get overrideDOMText(){return Y.empty}coordsIn(e){return this.dom.getBoundingClientRect()}}class xb{constructor(e){this.index=0,this.beforeBreak=!1,this.parents=[],this.tile=e}advance(e,i,s){let{tile:r,index:n,beforeBreak:o,parents:a}=this;for(;e||i>0;)if(r.isComposite())if(o){if(!e)break;s&&s.break(),e--,o=!1}else if(n==r.children.length){if(!e&&!a.length)break;s&&s.leave(r),o=!!r.breakAfter,{tile:r,index:n}=a.pop(),n++}else{let l=r.children[n],h=l.breakAfter;(i>0?l.length<=e:l.length<e)&&(!s||s.skip(l,0,l.length)!==!1||!l.isComposite)?(o=!!h,n++,e-=l.length):(a.push({tile:r,index:n}),r=l,n=0,s&&l.isComposite()&&s.enter(l))}else if(n==r.length)o=!!r.breakAfter,{tile:r,index:n}=a.pop(),n++;else if(e){let l=Math.min(e,r.length-n);s&&s.skip(r,n,n+l),e-=l,n+=l}else break;return this.tile=r,this.index=n,this.beforeBreak=o,this}get root(){return this.parents.length?this.parents[0].tile:this.tile}}class wb{constructor(e,i,s,r){this.from=e,this.to=i,this.wrapper=s,this.rank=r}}class kb{constructor(e,i,s){this.cache=e,this.root=i,this.blockWrappers=s,this.curLine=null,this.lastBlock=null,this.afterWidget=null,this.pos=0,this.wrappers=[],this.wrapperPos=0}addText(e,i,s,r){var n;this.flushBuffer();let o=this.ensureMarks(i,s),a=o.lastChild;if(a&&a.isText()&&!(a.flags&8)&&a.length+e.length<512){this.cache.reused.set(a,2);let l=o.children[o.children.length-1]=new Ri(a.dom,a.text+e);l.parent=o}else o.append(r||Ri.of(e,(n=this.cache.find(Ri))===null||n===void 0?void 0:n.dom));this.pos+=e.length,this.afterWidget=null}addComposition(e,i){let s=this.curLine;s.dom!=i.line.dom&&(s.setDOM(this.cache.reused.has(i.line)?Lo(i.line.dom):i.line.dom),this.cache.reused.set(i.line,2));let r=s;for(let a=i.marks.length-1;a>=0;a--){let l=i.marks[a],h=r.lastChild;if(h instanceof je&&h.mark.eq(l.mark))h.dom!=l.dom&&h.setDOM(Lo(l.dom)),r=h;else{if(this.cache.reused.get(l)){let d=me.get(l.dom);d&&d.setDOM(Lo(l.dom))}let c=je.of(l.mark,l.dom);r.append(c),r=c}this.cache.reused.set(l,2)}let n=me.get(e.text);n&&this.cache.reused.set(n,2);let o=new Ri(e.text,e.text.nodeValue);o.flags|=8,r.append(o)}addInlineWidget(e,i,s){let r=this.afterWidget&&e.flags&48&&(this.afterWidget.flags&48)==(e.flags&48);r||this.flushBuffer();let n=this.ensureMarks(i,s);!r&&!(e.flags&16)&&n.append(this.getBuffer(1)),n.append(e),this.pos+=e.length,this.afterWidget=e}addMark(e,i,s){this.flushBuffer(),this.ensureMarks(i,s).append(e),this.pos+=e.length,this.afterWidget=null}addBlockWidget(e){this.getBlockPos().append(e),this.pos+=e.length,this.lastBlock=e,this.endLine()}continueWidget(e){let i=this.afterWidget||this.lastBlock;i.length+=e,this.pos+=e}addLineStart(e,i){var s;e||(e=Wu);let r=Ss.start(e,i||((s=this.cache.find(Ss))===null||s===void 0?void 0:s.dom),!!i);this.getBlockPos().append(this.lastBlock=this.curLine=r)}addLine(e){this.getBlockPos().append(e),this.pos+=e.length,this.lastBlock=e,this.endLine()}addBreak(){this.lastBlock.flags|=1,this.endLine(),this.pos++}addLineStartIfNotCovered(e){this.blockPosCovered()||this.addLineStart(e)}ensureLine(e){this.curLine||this.addLineStart(e)}ensureMarks(e,i){var s;let r=this.curLine;for(let n=e.length-1;n>=0;n--){let o=e[n],a;if(i>0&&(a=r.lastChild)&&a instanceof je&&a.mark.eq(o))r=a,i--;else{let l=je.of(o,(s=this.cache.find(je,h=>h.mark.eq(o)))===null||s===void 0?void 0:s.dom);r.append(l),r=l,i=0}}return r}endLine(){if(this.curLine){this.flushBuffer();let e=this.curLine.lastChild;(!e||!Kh(this.curLine,!1)||e.dom.nodeName!="BR"&&e.isWidget()&&!(B.ios&&Kh(this.curLine,!0)))&&this.curLine.append(this.cache.findWidget(Io,0,32)||new Ji(Io.toDOM(),0,Io,32)),this.curLine=this.afterWidget=null}}updateBlockWrappers(){this.wrapperPos>this.pos+1e4&&(this.blockWrappers.goto(this.pos),this.wrappers.length=0);for(let e=this.wrappers.length-1;e>=0;e--)this.wrappers[e].to<this.pos&&this.wrappers.splice(e,1);for(let e=this.blockWrappers;e.value&&e.from<=this.pos;e.next())if(e.to>=this.pos){let i=new wb(e.from,e.to,e.value,e.rank),s=this.wrappers.length;for(;s>0&&(this.wrappers[s-1].rank-i.rank||this.wrappers[s-1].to-i.to)<0;)s--;this.wrappers.splice(s,0,i)}this.wrapperPos=this.pos}getBlockPos(){var e;this.updateBlockWrappers();let i=this.root;for(let s of this.wrappers){let r=i.lastChild;if(s.from<this.pos&&r instanceof Xt&&r.wrapper.eq(s.wrapper))i=r;else{let n=Xt.of(s.wrapper,(e=this.cache.find(Xt,o=>o.wrapper.eq(s.wrapper)))===null||e===void 0?void 0:e.dom);i.append(n),i=n}}return i}blockPosCovered(){let e=this.lastBlock;return e!=null&&!e.breakAfter&&(!e.isWidget()||(e.flags&160)>0)}getBuffer(e){let i=2|(e<0?16:32),s=this.cache.find(En,void 0,1);return s&&(s.flags=i),s||new En(i)}flushBuffer(){this.afterWidget&&!(this.afterWidget.flags&32)&&(this.afterWidget.parent.append(this.getBuffer(-1)),this.afterWidget=null)}}class Sb{constructor(e){this.skipCount=0,this.text="",this.textOff=0,this.cursor=e.iter()}skip(e){this.textOff+e<=this.text.length?this.textOff+=e:(this.skipCount+=e-(this.text.length-this.textOff),this.text="",this.textOff=0)}next(e){if(this.textOff==this.text.length){let{value:r,lineBreak:n,done:o}=this.cursor.next(this.skipCount);if(this.skipCount=0,o)throw new Error("Ran out of text content when drawing inline views");this.text=r;let a=this.textOff=Math.min(e,r.length);return n?null:r.slice(0,a)}let i=Math.min(this.text.length,this.textOff+e),s=this.text.slice(this.textOff,i);return this.textOff=i,s}}const _n=[Ji,Ss,Ri,je,En,Xt,co];for(let t=0;t<_n.length;t++)_n[t].bucket=t;class Cb{constructor(e){this.view=e,this.buckets=_n.map(()=>[]),this.index=_n.map(()=>0),this.reused=new Map}add(e){let i=e.constructor.bucket,s=this.buckets[i];s.length<6?s.push(e):s[this.index[i]=(this.index[i]+1)%6]=e}find(e,i,s=2){let r=e.bucket,n=this.buckets[r],o=this.index[r];for(let a=n.length-1;a>=0;a--){let l=(a+o)%n.length,h=n[l];if((!i||i(h))&&!this.reused.has(h))return n.splice(l,1),l<o&&this.index[r]--,this.reused.set(h,s),h}return null}findWidget(e,i,s){let r=this.buckets[0];if(r.length)for(let n=0,o=0;;n++){if(n==r.length){if(o)return null;o=1,n=0}let a=r[n];if(!this.reused.has(a)&&(o==0?a.widget.compare(e):a.widget.constructor==e.constructor&&e.updateDOM(a.dom,this.view,a.widget)))return r.splice(n,1),n<this.index[0]&&this.index[0]--,a.widget==e&&a.length==i&&(a.flags&497)==s?(this.reused.set(a,1),a):(this.reused.set(a,2),new Ji(a.dom,i,e,a.flags&-498|s))}}reuse(e){return this.reused.set(e,1),e}maybeReuse(e,i=2){if(!this.reused.has(e))return this.reused.set(e,i),e.dom}clear(){for(let e=0;e<this.buckets.length;e++)this.buckets[e].length=this.index[e]=0}}class $b{constructor(e,i,s,r,n){this.view=e,this.decorations=r,this.disallowBlockEffectsFor=n,this.openWidget=!1,this.openMarks=0,this.cache=new Cb(e),this.text=new Sb(e.state.doc),this.builder=new kb(this.cache,new co(e,e.contentDOM),Q.iter(s)),this.cache.reused.set(i,2),this.old=new xb(i),this.reuseWalker={skip:(o,a,l)=>{if(this.cache.add(o),o.isComposite())return!1},enter:o=>this.cache.add(o),leave:()=>{},break:()=>{}}}run(e,i){let s=i&&this.getCompositionContext(i.text);for(let r=0,n=0,o=0;;){let a=o<e.length?e[o++]:null,l=a?a.fromA:this.old.root.length;if(l>r){let h=l-r;this.preserve(h,!o,!a),r=l,n+=h}if(!a)break;i&&a.fromA<=i.range.fromA&&a.toA>=i.range.toA?(this.forward(a.fromA,i.range.fromA,i.range.fromA<i.range.toA?1:-1),this.emit(n,i.range.fromB),this.cache.clear(),this.builder.addComposition(i,s),this.text.skip(i.range.toB-i.range.fromB),this.forward(i.range.fromA,a.toA),this.emit(i.range.toB,a.toB)):(this.forward(a.fromA,a.toA),this.emit(n,a.toB)),n=a.toB,r=a.toA}return this.builder.curLine&&this.builder.endLine(),this.builder.root}preserve(e,i,s){let r=Pb(this.old),n=this.openMarks;this.old.advance(e,s?1:-1,{skip:(o,a,l)=>{if(o.isWidget())if(this.openWidget)this.builder.continueWidget(l-a);else{let h=l>0||a<o.length?Ji.of(o.widget,this.view,l-a,o.flags&496,this.cache.maybeReuse(o)):this.cache.reuse(o);h.flags&256?(h.flags&=-2,this.builder.addBlockWidget(h)):(this.builder.ensureLine(null),this.builder.addInlineWidget(h,r,n),n=r.length)}else if(o.isText())this.builder.ensureLine(null),!a&&l==o.length&&!this.cache.reused.has(o)?this.builder.addText(o.text,r,n,this.cache.reuse(o)):(this.cache.add(o),this.builder.addText(o.text.slice(a,l),r,n)),n=r.length;else if(o.isLine())o.flags&=-2,this.cache.reused.set(o,1),this.builder.addLine(o);else if(o instanceof En)this.cache.add(o);else if(o instanceof je)this.builder.ensureLine(null),this.builder.addMark(o,r,n),this.cache.reused.set(o,1),n=r.length;else return!1;this.openWidget=!1},enter:o=>{o.isLine()?this.builder.addLineStart(o.attrs,this.cache.maybeReuse(o)):(this.cache.add(o),o instanceof je&&r.unshift(o.mark)),this.openWidget=!1},leave:o=>{o.isLine()?r.length&&(r.length=n=0):o instanceof je&&(r.shift(),n=Math.min(n,r.length))},break:()=>{this.builder.addBreak(),this.openWidget=!1}}),this.text.skip(e)}emit(e,i){let s=null,r=this.builder,n=0,o=Q.spans(this.decorations,e,i,{point:(a,l,h,c,d,u)=>{if(h instanceof Ki){if(this.disallowBlockEffectsFor[u]){if(h.block)throw new RangeError("Block decorations may not be specified via plugins");if(l>this.view.state.doc.lineAt(a).to)throw new RangeError("Decorations that replace line breaks may not be specified via plugins")}if(n=c.length,d>c.length)r.continueWidget(l-a);else{let f=h.widget||(h.block?Cs.block:Cs.inline),g=Ob(h),m=this.cache.findWidget(f,l-a,g)||Ji.of(f,this.view,l-a,g);h.block?(h.startSide>0&&r.addLineStartIfNotCovered(s),r.addBlockWidget(m)):(r.ensureLine(s),r.addInlineWidget(m,c,d))}s=null}else s=Ab(s,h);l>a&&this.text.skip(l-a)},span:(a,l,h,c)=>{for(let d=a;d<l;){let u=this.text.next(Math.min(512,l-d));u==null?(r.addLineStartIfNotCovered(s),r.addBreak(),d++):(r.ensureLine(s),r.addText(u,h,d==a?c:h.length),d+=u.length),s=null}}});r.addLineStartIfNotCovered(s),this.openWidget=o>n,this.openMarks=o}forward(e,i,s=1){i-e<=10?this.old.advance(i-e,s,this.reuseWalker):(this.old.advance(5,-1,this.reuseWalker),this.old.advance(i-e-10,-1),this.old.advance(5,s,this.reuseWalker))}getCompositionContext(e){let i=[],s=null;for(let r=e.parentNode;;r=r.parentNode){let n=me.get(r);if(r==this.view.contentDOM)break;n instanceof je?i.push(n):n!=null&&n.isLine()?s=n:n instanceof Xt||(r.nodeName=="DIV"&&!s&&r!=this.view.contentDOM?s=new Ss(r,Wu):s||i.push(je.of(new Tr({tagName:r.nodeName.toLowerCase(),attributes:eb(r)}),r)))}return{line:s,marks:i}}}function Kh(t,e){let i=s=>{for(let r of s.children)if((e?r.isText():r.length)||i(r))return!0;return!1};return i(t)}function Ob(t){let e=t.isReplace?(t.startSide<0?64:0)|(t.endSide>0?128:0):t.startSide>0?32:16;return t.block&&(e|=256),e}const Wu={class:"cm-line"};function Ab(t,e){let i=e.spec.attributes,s=e.spec.class;return!i&&!s||(t||(t={class:"cm-line"}),i&&Pl(i,t),s&&(t.class+=" "+s)),t}function Pb(t){let e=[];for(let i=t.parents.length;i>1;i--){let s=i==t.parents.length?t.tile:t.parents[i].tile;s instanceof je&&e.push(s.mark)}return e}function Lo(t){let e=me.get(t);return e&&e.setDOM(t.cloneNode()),t}class Cs extends ti{constructor(e){super(),this.tag=e}eq(e){return e.tag==this.tag}toDOM(){return document.createElement(this.tag)}updateDOM(e){return e.nodeName.toLowerCase()==this.tag}get isHidden(){return!0}}Cs.inline=new Cs("span");Cs.block=new Cs("div");const Io=new class extends ti{toDOM(){return document.createElement("br")}get isHidden(){return!0}get editable(){return!0}};class Xh{constructor(e){this.view=e,this.decorations=[],this.blockWrappers=[],this.dynamicDecorationMap=[!1],this.domChanged=null,this.hasComposition=null,this.editContextFormatting=U.none,this.lastCompositionAfterCursor=!1,this.minWidth=0,this.minWidthFrom=0,this.minWidthTo=0,this.impreciseAnchor=null,this.impreciseHead=null,this.forceSelection=!1,this.lastUpdate=Date.now(),this.updateDeco(),this.tile=new co(e,e.contentDOM),this.updateInner([new ct(0,0,0,e.state.doc.length)],null)}update(e){var i;let s=e.changedRanges;this.minWidth>0&&s.length&&(s.every(({fromA:c,toA:d})=>d<this.minWidthFrom||c>this.minWidthTo)?(this.minWidthFrom=e.changes.mapPos(this.minWidthFrom,1),this.minWidthTo=e.changes.mapPos(this.minWidthTo,1)):this.minWidth=this.minWidthFrom=this.minWidthTo=0),this.updateEditContextFormatting(e);let r=-1;this.view.inputState.composing>=0&&!this.view.observer.editContext&&(!((i=this.domChanged)===null||i===void 0)&&i.newSel?r=this.domChanged.newSel.head:!Ib(e.changes,this.hasComposition)&&!e.selectionSet&&(r=e.state.selection.main.head));let n=r>-1?Mb(this.view,e.changes,r):null;if(this.domChanged=null,this.hasComposition){let{from:c,to:d}=this.hasComposition;s=new ct(c,d,e.changes.mapPos(c,-1),e.changes.mapPos(d,1)).addToSet(s.slice())}this.hasComposition=n?{from:n.range.fromB,to:n.range.toB}:null,(B.ie||B.chrome)&&!n&&e&&e.state.doc.lines!=e.startState.doc.lines&&(this.forceSelection=!0);let o=this.decorations,a=this.blockWrappers;this.updateDeco();let l=Db(o,this.decorations,e.changes);l.length&&(s=ct.extendWithRanges(s,l));let h=Rb(a,this.blockWrappers,e.changes);return h.length&&(s=ct.extendWithRanges(s,h)),n&&!s.some(c=>c.fromA<=n.range.fromA&&c.toA>=n.range.toA)&&(s=n.range.addToSet(s.slice())),this.tile.flags&2&&s.length==0?!1:(this.updateInner(s,n),e.transactions.length&&(this.lastUpdate=Date.now()),!0)}updateInner(e,i){this.view.viewState.mustMeasureContent=!0;let{observer:s}=this.view;s.ignore(()=>{if(i||e.length){let o=this.tile,a=new $b(this.view,o,this.blockWrappers,this.decorations,this.dynamicDecorationMap);i&&me.get(i.text)&&a.cache.reused.set(me.get(i.text),2),this.tile=a.run(e,i),Ia(o,a.cache.reused)}this.tile.dom.style.height=this.view.viewState.contentHeight/this.view.scaleY+"px",this.tile.dom.style.flexBasis=this.minWidth?this.minWidth+"px":"";let n=B.chrome||B.ios?{node:s.selectionRange.focusNode,written:!1}:void 0;this.tile.sync(n),n&&(n.written||s.selectionRange.focusNode!=n.node||!this.tile.dom.contains(n.node))&&(this.forceSelection=!0),this.tile.dom.style.height=""});let r=[];if(this.view.viewport.from||this.view.viewport.to<this.view.state.doc.length)for(let n of this.tile.children)n.isWidget()&&n.widget instanceof Fo&&r.push(n.dom);s.updateGaps(r)}updateEditContextFormatting(e){this.editContextFormatting=this.editContextFormatting.map(e.changes);for(let i of e.transactions)for(let s of i.effects)s.is(Iu)&&(this.editContextFormatting=s.value)}updateSelection(e=!1,i=!1){(e||!this.view.observer.selectionRange.focusNode)&&this.view.observer.readSelectionRange();let{dom:s}=this.tile,r=this.view.root.activeElement,n=r==s,o=!n&&!(this.view.state.facet(Qt)||s.tabIndex>-1)&&Ys(s,this.view.observer.selectionRange)&&!(r&&s.contains(r));if(!(n||i||o))return;let a=this.forceSelection;this.forceSelection=!1;let l=this.view.state.selection.main,h,c;if(l.empty?c=h=this.inlineDOMNearPos(l.anchor,l.assoc||1):(c=this.inlineDOMNearPos(l.head,l.head==l.from?1:-1),h=this.inlineDOMNearPos(l.anchor,l.anchor==l.from?1:-1)),B.gecko&&l.empty&&!this.hasComposition&&Tb(h)){let u=document.createTextNode("");this.view.observer.ignore(()=>h.node.insertBefore(u,h.node.childNodes[h.offset]||null)),h=c=new bt(u,0),a=!0}let d=this.view.observer.selectionRange;(a||!d.focusNode||(!Gs(h.node,h.offset,d.anchorNode,d.anchorOffset)||!Gs(c.node,c.offset,d.focusNode,d.focusOffset))&&!this.suppressWidgetCursorChange(d,l))&&(this.view.observer.ignore(()=>{B.android&&B.chrome&&s.contains(d.focusNode)&&Lb(d.focusNode,s)&&(s.blur(),s.focus({preventScroll:!0}));let u=ur(this.view.root);if(u)if(l.empty){if(B.gecko){let f=Eb(h.node,h.offset);if(f&&f!=3){let g=(f==1?wu:ku)(h.node,h.offset);g&&(h=new bt(g.node,g.offset))}}u.collapse(h.node,h.offset),l.bidiLevel!=null&&u.caretBidiLevel!==void 0&&(u.caretBidiLevel=l.bidiLevel)}else if(u.extend){u.collapse(h.node,h.offset);try{u.extend(c.node,c.offset)}catch{}}else{let f=document.createRange();l.anchor>l.head&&([h,c]=[c,h]),f.setEnd(c.node,c.offset),f.setStart(h.node,h.offset),u.removeAllRanges(),u.addRange(f)}o&&this.view.root.activeElement==s&&(s.blur(),r&&r.focus())}),this.view.observer.setSelectionRange(h,c)),this.impreciseAnchor=h.precise?null:new bt(d.anchorNode,d.anchorOffset),this.impreciseHead=c.precise?null:new bt(d.focusNode,d.focusOffset)}suppressWidgetCursorChange(e,i){return this.hasComposition&&i.empty&&Gs(e.focusNode,e.focusOffset,e.anchorNode,e.anchorOffset)&&this.posFromDOM(e.focusNode,e.focusOffset)==i.head}enforceCursorAssoc(){if(this.hasComposition)return;let{view:e}=this,i=e.state.selection.main,s=ur(e.root),{anchorNode:r,anchorOffset:n}=e.observer.selectionRange;if(!s||!i.empty||!i.assoc||!s.modify)return;let o=this.lineAt(i.head,i.assoc);if(!o)return;let a=o.posAtStart;if(i.head==a||i.head==a+o.length)return;let l=this.coordsAt(i.head,-1),h=this.coordsAt(i.head,1);if(!l||!h||l.bottom>h.top)return;let c=this.domAtPos(i.head+i.assoc,i.assoc);s.collapse(c.node,c.offset),s.modify("move",i.assoc<0?"forward":"backward","lineboundary"),e.observer.readSelectionRange();let d=e.observer.selectionRange;e.docView.posFromDOM(d.anchorNode,d.anchorOffset)!=i.from&&s.collapse(r,n)}posFromDOM(e,i){let s=this.tile.nearest(e);if(!s)return this.tile.dom.compareDocumentPosition(e)&2?0:this.view.state.doc.length;let r=s.posAtStart;if(s.isComposite()){let n;if(e==s.dom)n=s.dom.childNodes[i];else{let o=Yt(e)==0?0:i==0?-1:1;for(;;){let a=e.parentNode;if(a==s.dom)break;o==0&&a.firstChild!=a.lastChild&&(e==a.firstChild?o=-1:o=1),e=a}o<0?n=e:n=e.nextSibling}if(n==s.dom.firstChild)return r;for(;n&&!me.get(n);)n=n.nextSibling;if(!n)return r+s.length;for(let o=0,a=r;;o++){let l=s.children[o];if(l.dom==n)return a;a+=l.length+l.breakAfter}}else return s.isText()?e==s.dom?r+i:r+(i?s.length:0):r}domAtPos(e,i){let{tile:s,offset:r}=this.tile.resolveBlock(e,i);return s.isWidget()?s.domPosFor(e,i):s.domIn(r,i)}inlineDOMNearPos(e,i){let s,r=-1,n=!1,o,a=-1,l=!1;return this.tile.blockTiles((h,c)=>{if(h.isWidget()){if(h.flags&32&&c>=e)return!0;h.flags&16&&(n=!0)}else{let d=c+h.length;if(c<=e&&(s=h,r=e-c,n=d<e),d>=e&&!o&&(o=h,a=e-c,l=c>e),c>e&&o)return!0}}),!s&&!o?this.domAtPos(e,i):(n&&o?s=null:l&&s&&(o=null),s&&i<0||!o?s.domIn(r,i):o.domIn(a,i))}coordsAt(e,i){let{tile:s,offset:r}=this.tile.resolveBlock(e,i);return s.isWidget()?s.widget instanceof Fo?null:s.coordsInWidget(r,i,!0):s.coordsIn(r,i)}lineAt(e,i){let{tile:s}=this.tile.resolveBlock(e,i);return s.isLine()?s:null}coordsForChar(e){let{tile:i,offset:s}=this.tile.resolveBlock(e,1);if(!i.isLine())return null;function r(n,o){if(n.isComposite())for(let a of n.children){if(a.length>=o){let l=r(a,o);if(l)return l}if(o-=a.length,o<0)break}else if(n.isText()&&o<n.length){let a=$e(n.text,o);if(a==o)return null;let l=fr(n.dom,o,a).getClientRects();for(let h=0;h<l.length;h++){let c=l[h];if(h==l.length-1||c.top<c.bottom&&c.left<c.right)return c}}return null}return r(i,s)}measureVisibleLineHeights(e){let i=[],{from:s,to:r}=e,n=this.view.contentDOM.clientWidth,o=n>Math.max(this.view.scrollDOM.clientWidth,this.minWidth)+1,a=-1,l=this.view.textDirection==ae.LTR,h=0,c=(d,u,f)=>{for(let g=0;g<d.children.length&&!(u>r);g++){let m=d.children[g],y=u+m.length,w=m.dom.getBoundingClientRect(),{height:x}=w;if(f&&!g&&(h+=w.top-f.top),m instanceof Xt)y>s&&c(m,u,w);else if(u>=s&&(h>0&&i.push(-h),i.push(x+h),h=0,o)){let O=m.dom.lastChild,D=O?un(O):[];if(D.length){let A=D[D.length-1],P=l?A.right-w.left:w.right-A.left;P>a&&(a=P,this.minWidth=n,this.minWidthFrom=u,this.minWidthTo=y)}}f&&g==d.children.length-1&&(h+=f.bottom-w.bottom),u=y+m.breakAfter}};return c(this.tile,0,null),i}textDirectionAt(e){let{tile:i}=this.tile.resolveBlock(e,1);return getComputedStyle(i.dom).direction=="rtl"?ae.RTL:ae.LTR}measureTextSize(){let e=this.tile.blockTiles(o=>{if(o.isLine()&&o.children.length&&o.length<=20){let a=0,l;for(let h of o.children){if(!h.isText()||/[^ -~]/.test(h.text))return;let c=un(h.dom);if(c.length!=1)return;a+=c[0].width,l=c[0].height}if(a)return{lineHeight:o.dom.getBoundingClientRect().height,charWidth:a/o.length,textHeight:l}}});if(e)return e;let i=document.createElement("div"),s,r,n;return i.className="cm-line",i.style.width="99999px",i.style.position="absolute",i.textContent="abc def ghi jkl mno pqr stu",this.view.observer.ignore(()=>{this.tile.dom.appendChild(i);let o=un(i.firstChild)[0];s=i.getBoundingClientRect().height,r=o&&o.width?o.width/27:7,n=o&&o.height?o.height:s,i.remove()}),{lineHeight:s,charWidth:r,textHeight:n}}computeBlockGapDeco(){let e=[],i=this.view.viewState;for(let s=0,r=0;;r++){let n=r==i.viewports.length?null:i.viewports[r],o=n?n.from-1:this.view.state.doc.length;if(o>s){let a=(i.lineBlockAt(o).bottom-i.lineBlockAt(s).top)/this.view.scaleY;e.push(U.replace({widget:new Fo(a),block:!0,inclusive:!0,isBlockGap:!0}).range(s,o))}if(!n)break;s=n.to+1}return U.set(e)}updateDeco(){let e=1,i=this.view.state.facet(lo).map(n=>(this.dynamicDecorationMap[e++]=typeof n=="function")?n(this.view):n),s=!1,r=this.view.state.facet(Bl).map((n,o)=>{let a=typeof n=="function";return a&&(s=!0),a?n(this.view):n});for(r.length&&(this.dynamicDecorationMap[e++]=s,i.push(Q.join(r))),this.decorations=[this.editContextFormatting,...i,this.computeBlockGapDeco(),this.view.viewState.lineGapDeco];e<this.decorations.length;)this.dynamicDecorationMap[e++]=!1;this.blockWrappers=this.view.state.facet(Nu).map(n=>typeof n=="function"?n(this.view):n)}scrollIntoView(e){var i;if(e.isSnapshot){let c=this.view.viewState.lineBlockAt(e.range.head);this.view.scrollDOM.scrollTop=c.top-e.yMargin,this.view.scrollDOM.scrollLeft=e.xMargin;return}for(let c of this.view.state.facet(Lu))try{if(c(this.view,e.range,e))return!0}catch(d){Qe(this.view.state,d,"scroll handler")}let{range:s}=e,r=this.coordsAt(s.head,(i=s.assoc)!==null&&i!==void 0?i:s.empty?0:s.head>s.anchor?-1:1),n;if(!r)return;!s.empty&&(n=this.coordsAt(s.anchor,s.anchor>s.head?-1:1))&&(r={left:Math.min(r.left,n.left),top:Math.min(r.top,n.top),right:Math.max(r.right,n.right),bottom:Math.max(r.bottom,n.bottom)});let o=Rl(this.view),a={left:r.left-o.left,top:r.top-o.top,right:r.right+o.right,bottom:r.bottom+o.bottom},{offsetWidth:l,offsetHeight:h}=this.view.scrollDOM;if(sb(this.view.scrollDOM,a,s.head<s.anchor?-1:1,e.x,e.y,Math.max(Math.min(e.xMargin,l),-l),Math.max(Math.min(e.yMargin,h),-h),this.view.textDirection==ae.LTR),window.visualViewport&&window.innerHeight-window.visualViewport.height>1&&(r.top>window.pageYOffset+window.visualViewport.offsetTop+window.visualViewport.height||r.bottom<window.pageYOffset+window.visualViewport.offsetTop)){let c=this.view.docView.lineAt(s.head,1);c&&c.dom.scrollIntoView({block:"nearest"})}}lineHasWidget(e){let i=s=>s.isWidget()||s.children.some(i);return i(this.tile.resolveBlock(e,1).tile)}destroy(){Ia(this.tile)}}function Ia(t,e){let i=e==null?void 0:e.get(t);if(i!=1){i==null&&t.destroy();for(let s of t.children)Ia(s,e)}}function Tb(t){return t.node.nodeType==1&&t.node.firstChild&&(t.offset==0||t.node.childNodes[t.offset-1].contentEditable=="false")&&(t.offset==t.node.childNodes.length||t.node.childNodes[t.offset].contentEditable=="false")}function zu(t,e){let i=t.observer.selectionRange;if(!i.focusNode)return null;let s=wu(i.focusNode,i.focusOffset),r=ku(i.focusNode,i.focusOffset),n=s||r;if(r&&s&&r.node!=s.node){let a=me.get(r.node);if(!a||a.isText()&&a.text!=r.node.nodeValue)n=r;else if(t.docView.lastCompositionAfterCursor){let l=me.get(s.node);!l||l.isText()&&l.text!=s.node.nodeValue||(n=r)}}if(t.docView.lastCompositionAfterCursor=n!=s,!n)return null;let o=e-n.offset;return{from:o,to:o+n.node.nodeValue.length,node:n.node}}function Mb(t,e,i){let s=zu(t,i);if(!s)return null;let{node:r,from:n,to:o}=s,a=r.nodeValue;if(/[\n\r]/.test(a)||t.state.doc.sliceString(s.from,s.to)!=a)return null;let l=e.invertedDesc;return{range:new ct(l.mapPos(n),l.mapPos(o),n,o),text:r}}function Eb(t,e){return t.nodeType!=1?0:(e&&t.childNodes[e-1].contentEditable=="false"?1:0)|(e<t.childNodes.length&&t.childNodes[e].contentEditable=="false"?2:0)}let _b=class{constructor(){this.changes=[]}compareRange(e,i){ps(e,i,this.changes)}comparePoint(e,i){ps(e,i,this.changes)}boundChange(e){ps(e,e,this.changes)}};function Db(t,e,i){let s=new _b;return Q.compare(t,e,i,s),s.changes}class Bb{constructor(){this.changes=[]}compareRange(e,i){ps(e,i,this.changes)}comparePoint(){}boundChange(e){ps(e,e,this.changes)}}function Rb(t,e,i){let s=new Bb;return Q.compare(t,e,i,s),s.changes}function Lb(t,e){for(let i=t;i&&i!=e;i=i.assignedSlot||i.parentNode)if(i.nodeType==1&&i.contentEditable=="false")return!0;return!1}function Ib(t,e){let i=!1;return e&&t.iterChangedRanges((s,r)=>{s<e.to&&r>e.from&&(i=!0)}),i}class Fo extends ti{constructor(e){super(),this.height=e}toDOM(){let e=document.createElement("div");return e.className="cm-gap",this.updateDOM(e),e}eq(e){return e.height==this.height}updateDOM(e){return e.style.height=this.height+"px",!0}get editable(){return!0}get estimatedHeight(){return this.height}ignoreEvent(){return!1}}function Fb(t,e,i=1){let s=t.charCategorizer(e),r=t.doc.lineAt(e),n=e-r.from;if(r.length==0)return $.cursor(e);n==0?i=1:n==r.length&&(i=-1);let o=n,a=n;i<0?o=$e(r.text,n,!1):a=$e(r.text,n);let l=s(r.text.slice(o,a));for(;o>0;){let h=$e(r.text,o,!1);if(s(r.text.slice(h,o))!=l)break;o=h}for(;a<r.length;){let h=$e(r.text,a);if(s(r.text.slice(a,h))!=l)break;a=h}return $.range(o+r.from,a+r.from)}function Nb(t,e,i,s,r){let n=Math.round((s-e.left)*t.defaultCharacterWidth);if(t.lineWrapping&&i.height>t.defaultLineHeight*1.5){let a=t.viewState.heightOracle.textHeight,l=Math.floor((r-i.top-(t.defaultLineHeight-a)*.5)/a);n+=l*t.viewState.heightOracle.lineLength}let o=t.state.sliceDoc(i.from,i.to);return i.from+$a(o,n,t.state.tabSize)}function Fa(t,e,i){let s=t.lineBlockAt(e);if(Array.isArray(s.type)){let r;for(let n of s.type){if(n.from>e)break;if(!(n.to<e)){if(n.from<e&&n.to>e)return n;(!r||n.type==Te.Text&&(r.type!=n.type||(i<0?n.from<e:n.to>e)))&&(r=n)}}return r||s}return s}function Ub(t,e,i,s){let r=Fa(t,e.head,e.assoc||-1),n=!s||r.type!=Te.Text||!(t.lineWrapping||r.widgetLineBreaks)?null:t.coordsAtPos(e.assoc<0&&e.head>r.from?e.head-1:e.head);if(n){let o=t.dom.getBoundingClientRect(),a=t.textDirectionAt(r.from),l=t.posAtCoords({x:i==(a==ae.LTR)?o.right-1:o.left+1,y:(n.top+n.bottom)/2});if(l!=null)return $.cursor(l,i?-1:1)}return $.cursor(i?r.to:r.from,i?-1:1)}function Jh(t,e,i,s){let r=t.state.doc.lineAt(e.head),n=t.bidiSpans(r),o=t.textDirectionAt(r.from);for(let a=e,l=null;;){let h=pb(r,n,o,a,i),c=Au;if(!h){if(r.number==(i?t.state.doc.lines:1))return a;c=`
`,r=t.state.doc.line(r.number+(i?1:-1)),n=t.bidiSpans(r),h=t.visualLineSide(r,!i)}if(l){if(!l(c))return a}else{if(!s)return h;l=s(c)}a=h}}function Hb(t,e,i){let s=t.state.charCategorizer(e),r=s(i);return n=>{let o=s(n);return r==fe.Space&&(r=o),r==o}}function Wb(t,e,i,s){let r=e.head,n=i?1:-1;if(r==(i?t.state.doc.length:0))return $.cursor(r,e.assoc);let o=e.goalColumn,a,l=t.contentDOM.getBoundingClientRect(),h=t.coordsAtPos(r,e.assoc||((e.empty?i:e.head==e.from)?1:-1)),c=t.documentTop;if(h)o==null&&(o=h.left-l.left),a=n<0?h.top:h.bottom;else{let g=t.viewState.lineBlockAt(r);o==null&&(o=Math.min(l.right-l.left,t.defaultCharacterWidth*(r-g.from))),a=(n<0?g.top:g.bottom)+c}let d=l.left+o,u=t.viewState.heightOracle.textHeight>>1,f=s??u;for(let g=0;;g+=u){let m=a+(f+g)*n,y=Na(t,{x:d,y:m},!1,n);if(i?m>l.bottom:m<l.top)return $.cursor(y.pos,y.assoc);let w=t.coordsAtPos(y.pos,y.assoc),x=w?(w.top+w.bottom)/2:0;if(!w||(i?x>a:x<a))return $.cursor(y.pos,y.assoc,void 0,o)}}function Zs(t,e,i){for(;;){let s=0;for(let r of t)r.between(e-1,e+1,(n,o,a)=>{if(e>n&&e<o){let l=s||i||(e-n<o-e?-1:1);e=l<0?n:o,s=l}});if(!s)return e}}function qu(t,e){let i=null;for(let s=0;s<e.ranges.length;s++){let r=e.ranges[s],n=null;if(r.empty){let o=Zs(t,r.from,0);o!=r.from&&(n=$.cursor(o,-1))}else{let o=Zs(t,r.from,-1),a=Zs(t,r.to,1);(o!=r.from||a!=r.to)&&(n=$.range(r.from==r.anchor?o:a,r.from==r.head?o:a))}n&&(i||(i=e.ranges.slice()),i[s]=n)}return i?$.create(i,e.mainIndex):e}function No(t,e,i){let s=Zs(t.state.facet(Er).map(r=>r(t)),i.from,e.head>i.from?-1:1);return s==i.from?i:$.cursor(s,s<i.from?1:-1)}class Bt{constructor(e,i){this.pos=e,this.assoc=i}}function Na(t,e,i,s){let r=t.contentDOM.getBoundingClientRect(),n=r.top+t.viewState.paddingTop,{x:o,y:a}=e,l=a-n,h;for(;;){if(l<0)return new Bt(0,1);if(l>t.viewState.docHeight)return new Bt(t.state.doc.length,-1);if(h=t.elementAtHeight(l),s==null)break;if(h.type==Te.Text){if(s<0?h.to<t.viewport.from:h.from>t.viewport.to)break;let u=t.docView.coordsAt(s<0?h.from:h.to,s>0?-1:1);if(u&&(s<0?u.top<=l+n:u.bottom>=l+n))break}let d=t.viewState.heightOracle.textHeight/2;l=s>0?h.bottom+d:h.top-d}if(t.viewport.from>=h.to||t.viewport.to<=h.from){if(i)return null;if(h.type==Te.Text){let d=Nb(t,r,h,o,a);return new Bt(d,d==h.from?1:-1)}}if(h.type!=Te.Text)return l<(h.top+h.bottom)/2?new Bt(h.from,1):new Bt(h.to,-1);let c=t.docView.lineAt(h.from,2);return(!c||c.length!=h.length)&&(c=t.docView.lineAt(h.from,-2)),new zb(t,o,a,t.textDirectionAt(h.from)).scanTile(c,h.from)}class zb{constructor(e,i,s,r){this.view=e,this.x=i,this.y=s,this.baseDir=r,this.line=null,this.spans=null}bidiSpansAt(e){return(!this.line||this.line.from>e||this.line.to<e)&&(this.line=this.view.state.doc.lineAt(e),this.spans=this.view.bidiSpans(this.line)),this}baseDirAt(e,i){let{line:s,spans:r}=this.bidiSpansAt(e);return r[Rt.find(r,e-s.from,-1,i)].level==this.baseDir}dirAt(e,i){let{line:s,spans:r}=this.bidiSpansAt(e);return r[Rt.find(r,e-s.from,-1,i)].dir}bidiIn(e,i){let{spans:s,line:r}=this.bidiSpansAt(e);return s.length>1||s.length&&(s[0].level!=this.baseDir||s[0].to+r.from<i)}scan(e,i){let s=0,r=e.length-1,n=new Set,o=this.bidiIn(e[0],e[r]),a,l,h=-1,c=1e9,d;e:for(;s<r;){let f=r-s,g=s+r>>1;t:if(n.has(g)){let y=s+Math.floor(Math.random()*f);for(let w=0;w<f;w++){if(!n.has(y)){g=y;break t}y++,y==r&&(y=s)}break e}n.add(g);let m=i(g);if(m)for(let y=0;y<m.length;y++){let w=m[y],x=0;if(!(w.width==0&&m.length>1)){if(w.bottom<this.y)(!a||a.bottom<w.bottom)&&(a=w),x=1;else if(w.top>this.y)(!l||l.top>w.top)&&(l=w),x=-1;else{let O=w.left>this.x?this.x-w.left:w.right<this.x?this.x-w.right:0,D=Math.abs(O);D<c&&(h=g,c=D,d=w),O&&(x=O<0==(this.baseDir==ae.LTR)?-1:1)}x==-1&&(!o||this.baseDirAt(e[g],1))?r=g:x==1&&(!o||this.baseDirAt(e[g+1],-1))&&(s=g+1)}}}if(!d){let f=a&&(!l||this.y-a.bottom<l.top-this.y)?a:l;return this.y=(f.top+f.bottom)/2,this.scan(e,i)}if(c){let{top:f,bottom:g}=d;if(a&&a.bottom>(f+f+g)/3)return this.y=a.bottom-1,this.scan(e,i);if(l&&l.top<(f+g+g)/3)return this.y=l.top+1,this.scan(e,i)}let u=(o?this.dirAt(e[h],1):this.baseDir)==ae.LTR;return{i:h,after:this.x>(d.left+d.right)/2==u}}scanText(e,i){let s=[];for(let n=0;n<e.length;n=$e(e.text,n))s.push(i+n);s.push(i+e.length);let r=this.scan(s,n=>{let o=s[n]-i,a=s[n+1]-i;return fr(e.dom,o,a).getClientRects()});return r.after?new Bt(s[r.i+1],-1):new Bt(s[r.i],1)}scanTile(e,i){if(!e.length)return new Bt(i,1);if(e.children.length==1){let a=e.children[0];if(a.isText())return this.scanText(a,i);if(a.isComposite())return this.scanTile(a,i)}let s=[i];for(let a=0,l=i;a<e.children.length;a++)s.push(l+=e.children[a].length);let r=this.scan(s,a=>{let l=e.children[a];return l.flags&48?null:(l.dom.nodeType==1?l.dom:fr(l.dom,0,l.length)).getClientRects()}),n=e.children[r.i],o=s[r.i];return n.isText()?this.scanText(n,o):n.isComposite()?this.scanTile(n,o):r.after?new Bt(s[r.i+1],-1):new Bt(o,1)}}const is="￿";class qb{constructor(e,i){this.points=e,this.view=i,this.text="",this.lineSeparator=i.state.facet(J.lineSeparator)}append(e){this.text+=e}lineBreak(){this.text+=is}readRange(e,i){if(!e)return this;let s=e.parentNode;for(let r=e;;){this.findPointBefore(s,r);let n=this.text.length;this.readNode(r);let o=me.get(r),a=r.nextSibling;if(a==i){o!=null&&o.breakAfter&&!a&&s!=this.view.contentDOM&&this.lineBreak();break}let l=me.get(a);(o&&l?o.breakAfter:(o?o.breakAfter:Pn(r))||Pn(a)&&(r.nodeName!="BR"||o!=null&&o.isWidget())&&this.text.length>n)&&!jb(a,i)&&this.lineBreak(),r=a}return this.findPointBefore(s,i),this}readTextNode(e){let i=e.nodeValue;for(let s of this.points)s.node==e&&(s.pos=this.text.length+Math.min(s.offset,i.length));for(let s=0,r=this.lineSeparator?null:/\r\n?|\n/g;;){let n=-1,o=1,a;if(this.lineSeparator?(n=i.indexOf(this.lineSeparator,s),o=this.lineSeparator.length):(a=r.exec(i))&&(n=a.index,o=a[0].length),this.append(i.slice(s,n<0?i.length:n)),n<0)break;if(this.lineBreak(),o>1)for(let l of this.points)l.node==e&&l.pos>this.text.length&&(l.pos-=o-1);s=n+o}}readNode(e){let i=me.get(e),s=i&&i.overrideDOMText;if(s!=null){this.findPointInside(e,s.length);for(let r=s.iter();!r.next().done;)r.lineBreak?this.lineBreak():this.append(r.value)}else e.nodeType==3?this.readTextNode(e):e.nodeName=="BR"?e.nextSibling&&this.lineBreak():e.nodeType==1&&this.readRange(e.firstChild,null)}findPointBefore(e,i){for(let s of this.points)s.node==e&&e.childNodes[s.offset]==i&&(s.pos=this.text.length)}findPointInside(e,i){for(let s of this.points)(e.nodeType==3?s.node==e:e.contains(s.node))&&(s.pos=this.text.length+(Vb(e,s.node,s.offset)?i:0))}}function Vb(t,e,i){for(;;){if(!e||i<Yt(e))return!1;if(e==t)return!0;i=mi(e)+1,e=e.parentNode}}function jb(t,e){let i;for(;!(t==e||!t);t=t.nextSibling){let s=me.get(t);if(!(s!=null&&s.isWidget()))return!1;s&&(i||(i=[])).push(s)}if(i)for(let s of i){let r=s.overrideDOMText;if(r!=null&&r.length)return!1}return!0}class Yh{constructor(e,i){this.node=e,this.offset=i,this.pos=-1}}class Qb{constructor(e,i,s,r){this.typeOver=r,this.bounds=null,this.text="",this.domChanged=i>-1;let{impreciseHead:n,impreciseAnchor:o}=e.docView,a=e.state.selection;if(e.state.readOnly&&i>-1)this.newSel=null;else if(i>-1&&(this.bounds=Vu(e.docView.tile,i,s,0))){let l=n||o?[]:Xb(e),h=new qb(l,e);h.readRange(this.bounds.startDOM,this.bounds.endDOM),this.text=h.text,this.newSel=Jb(l,this.bounds.from)}else{let l=e.observer.selectionRange,h=n&&n.node==l.focusNode&&n.offset==l.focusOffset||!_a(e.contentDOM,l.focusNode)?a.main.head:e.docView.posFromDOM(l.focusNode,l.focusOffset),c=o&&o.node==l.anchorNode&&o.offset==l.anchorOffset||!_a(e.contentDOM,l.anchorNode)?a.main.anchor:e.docView.posFromDOM(l.anchorNode,l.anchorOffset),d=e.viewport;if((B.ios||B.chrome)&&a.main.empty&&h!=c&&(d.from>0||d.to<e.state.doc.length)){let u=Math.min(h,c),f=Math.max(h,c),g=d.from-u,m=d.to-f;(g==0||g==1||u==0)&&(m==0||m==-1||f==e.state.doc.length)&&(h=0,c=e.state.doc.length)}if(e.inputState.composing>-1&&a.ranges.length>1)this.newSel=a.replaceRange($.range(c,h));else if(e.lineWrapping&&c==h&&!(a.main.empty&&a.main.head==h)&&e.inputState.lastTouchTime>Date.now()-100){let u=e.coordsAtPos(h,-1),f=0;u&&(f=e.inputState.lastTouchY<=u.bottom?-1:1),this.newSel=$.create([$.cursor(h,f)])}else this.newSel=$.single(c,h)}}}function Vu(t,e,i,s){if(t.isComposite()){let r=-1,n=-1,o=-1,a=-1;for(let l=0,h=s,c=s;l<t.children.length;l++){let d=t.children[l],u=h+d.length;if(h<e&&u>i)return Vu(d,e,i,h);if(u>=e&&r==-1&&(r=l,n=h),h>i&&d.dom.parentNode==t.dom){o=l,a=c;break}c=u,h=u+d.breakAfter}return{from:n,to:a<0?s+t.length:a,startDOM:(r?t.children[r-1].dom.nextSibling:null)||t.dom.firstChild,endDOM:o<t.children.length&&o>=0?t.children[o].dom:null}}else return t.isText()?{from:s,to:s+t.length,startDOM:t.dom,endDOM:t.dom.nextSibling}:null}function ju(t,e){let i,{newSel:s}=e,{state:r}=t,n=r.selection.main,o=t.inputState.lastKeyTime>Date.now()-100?t.inputState.lastKeyCode:-1;if(e.bounds){let{from:a,to:l}=e.bounds,h=n.from,c=null;(o===8||B.android&&e.text.length<l-a)&&(h=n.to,c="end");let d=r.doc.sliceString(a,l,is),u,f;!n.empty&&n.from>=a&&n.to<=l&&(e.typeOver||d!=e.text)&&d.slice(0,n.from-a)==e.text.slice(0,n.from-a)&&d.slice(n.to-a)==e.text.slice(u=e.text.length-(d.length-(n.to-a)))?i={from:n.from,to:n.to,insert:Y.of(e.text.slice(n.from-a,u).split(is))}:(f=Qu(d,e.text,h-a,c))&&(B.chrome&&o==13&&f.toB==f.from+2&&e.text.slice(f.from,f.toB)==is+is&&f.toB--,i={from:a+f.from,to:a+f.toA,insert:Y.of(e.text.slice(f.from,f.toB).split(is))})}else s&&(!t.hasFocus&&r.facet(Qt)||Dn(s,n))&&(s=null);if(!i&&!s)return!1;if((B.mac||B.android)&&i&&i.from==i.to&&i.from==n.head-1&&/^\. ?$/.test(i.insert.toString())&&t.contentDOM.getAttribute("autocorrect")=="off"?(s&&i.insert.length==2&&(s=$.single(s.main.anchor-1,s.main.head-1)),i={from:i.from,to:i.to,insert:Y.of([i.insert.toString().replace("."," ")])}):r.doc.lineAt(n.from).to<n.to&&t.docView.lineHasWidget(n.to)&&t.inputState.insertingTextAt>Date.now()-50?i={from:n.from,to:n.to,insert:r.toText(t.inputState.insertingText)}:B.chrome&&i&&i.from==i.to&&i.from==n.head&&i.insert.toString()==`
 `&&t.lineWrapping&&(s&&(s=$.single(s.main.anchor-1,s.main.head-1)),i={from:n.from,to:n.to,insert:Y.of([" "])}),i)return Ll(t,i,s,o);if(s&&!Dn(s,n)){let a=!1,l="select";return t.inputState.lastSelectionTime>Date.now()-50&&(t.inputState.lastSelectionOrigin=="select"&&(a=!0),l=t.inputState.lastSelectionOrigin,l=="select.pointer"&&(s=qu(r.facet(Er).map(h=>h(t)),s))),t.dispatch({selection:s,scrollIntoView:a,userEvent:l}),!0}else return!1}function Ll(t,e,i,s=-1){if(B.ios&&t.inputState.flushIOSKey(e))return!0;let r=t.state.selection.main;if(B.android&&(e.to==r.to&&(e.from==r.from||e.from==r.from-1&&t.state.sliceDoc(e.from,r.from)==" ")&&e.insert.length==1&&e.insert.lines==2&&gs(t.contentDOM,"Enter",13)||(e.from==r.from-1&&e.to==r.to&&e.insert.length==0||s==8&&e.insert.length<e.to-e.from&&e.to>r.head)&&gs(t.contentDOM,"Backspace",8)||e.from==r.from&&e.to==r.to+1&&e.insert.length==0&&gs(t.contentDOM,"Delete",46)))return!0;let n=e.insert.toString();t.inputState.composing>=0&&t.inputState.composing++;let o,a=()=>o||(o=Kb(t,e,i));return t.state.facet(_u).some(l=>l(t,e.from,e.to,n,a))||t.dispatch(a()),!0}function Kb(t,e,i){let s,r=t.state,n=r.selection.main,o=-1;if(e.from==e.to&&e.from<n.from||e.from>n.to){let l=e.from<n.from?-1:1,h=l<0?n.from:n.to,c=Zs(r.facet(Er).map(d=>d(t)),h,l);e.from==c&&(o=c)}if(o>-1)s={changes:e,selection:$.cursor(e.from+e.insert.length,-1)};else if(e.from>=n.from&&e.to<=n.to&&e.to-e.from>=(n.to-n.from)/3&&(!i||i.main.empty&&i.main.from==e.from+e.insert.length)&&t.inputState.composing<0){let l=n.from<e.from?r.sliceDoc(n.from,e.from):"",h=n.to>e.to?r.sliceDoc(e.to,n.to):"";s=r.replaceSelection(t.state.toText(l+e.insert.sliceString(0,void 0,t.state.lineBreak)+h))}else{let l=r.changes(e),h=i&&i.main.to<=l.newLength?i.main:void 0;if(r.selection.ranges.length>1&&(t.inputState.composing>=0||t.inputState.compositionPendingChange)&&e.to<=n.to+10&&e.to>=n.to-10){let c=t.state.sliceDoc(e.from,e.to),d,u=i&&zu(t,i.main.head);if(u){let g=e.insert.length-(e.to-e.from);d={from:u.from,to:u.to-g}}else d=t.state.doc.lineAt(n.head);let f=n.to-e.to;s=r.changeByRange(g=>{if(g.from==n.from&&g.to==n.to)return{changes:l,range:h||g.map(l)};let m=g.to-f,y=m-c.length;if(t.state.sliceDoc(y,m)!=c||m>=d.from&&y<=d.to)return{range:g};let w=r.changes({from:y,to:m,insert:e.insert}),x=g.to-n.to;return{changes:w,range:h?$.range(Math.max(0,h.anchor+x),Math.max(0,h.head+x)):g.map(w)}})}else s={changes:l,selection:h&&r.selection.replaceRange(h)}}let a="input.type";return(t.composing||t.inputState.compositionPendingChange&&t.inputState.compositionEndedAt>Date.now()-50)&&(t.inputState.compositionPendingChange=!1,a+=".compose",t.inputState.compositionFirstChange&&(a+=".start",t.inputState.compositionFirstChange=!1)),r.update(s,{userEvent:a,scrollIntoView:!0})}function Qu(t,e,i,s){let r=Math.min(t.length,e.length),n=0;for(;n<r&&t.charCodeAt(n)==e.charCodeAt(n);)n++;if(n==r&&t.length==e.length)return null;let o=t.length,a=e.length;for(;o>0&&a>0&&t.charCodeAt(o-1)==e.charCodeAt(a-1);)o--,a--;if(s=="end"){let l=Math.max(0,n-Math.min(o,a));i-=o+l-n}if(o<n&&t.length<e.length){let l=i<=n&&i>=o?n-i:0;n-=l,a=n+(a-o),o=n}else if(a<n){let l=i<=n&&i>=a?n-i:0;n-=l,o=n+(o-a),a=n}return{from:n,toA:o,toB:a}}function Xb(t){let e=[];if(t.root.activeElement!=t.contentDOM)return e;let{anchorNode:i,anchorOffset:s,focusNode:r,focusOffset:n}=t.observer.selectionRange;return i&&(e.push(new Yh(i,s)),(r!=i||n!=s)&&e.push(new Yh(r,n))),e}function Jb(t,e){if(t.length==0)return null;let i=t[0].pos,s=t.length==2?t[1].pos:i;return i>-1&&s>-1?$.single(i+e,s+e):null}function Dn(t,e){return e.head==t.main.head&&e.anchor==t.main.anchor}class Yb{setSelectionOrigin(e){this.lastSelectionOrigin=e,this.lastSelectionTime=Date.now()}constructor(e){this.view=e,this.lastKeyCode=0,this.lastKeyTime=0,this.lastTouchTime=0,this.lastTouchX=0,this.lastTouchY=0,this.lastFocusTime=0,this.lastScrollTop=0,this.lastScrollLeft=0,this.lastWheelEvent=0,this.pendingIOSKey=void 0,this.tabFocusMode=-1,this.lastSelectionOrigin=null,this.lastSelectionTime=0,this.lastContextMenu=0,this.scrollHandlers=[],this.handlers=Object.create(null),this.composing=-1,this.compositionFirstChange=null,this.compositionEndedAt=0,this.compositionPendingKey=!1,this.compositionPendingChange=!1,this.insertingText="",this.insertingTextAt=0,this.mouseSelection=null,this.draggedContent=null,this.handleEvent=this.handleEvent.bind(this),this.notifiedFocused=e.hasFocus,B.safari&&e.contentDOM.addEventListener("input",()=>null),B.gecko&&uv(e.contentDOM.ownerDocument)}handleEvent(e){!nv(this.view,e)||this.ignoreDuringComposition(e)||e.type=="keydown"&&this.keydown(e)||(this.view.updateState!=0?Promise.resolve().then(()=>this.runHandlers(e.type,e)):this.runHandlers(e.type,e))}runHandlers(e,i){let s=this.handlers[e];if(s){for(let r of s.observers)r(this.view,i);for(let r of s.handlers){if(i.defaultPrevented)break;if(r(this.view,i)){i.preventDefault();break}}}}ensureHandlers(e){let i=Gb(e),s=this.handlers,r=this.view.contentDOM;for(let n in i)if(n!="scroll"){let o=!i[n].handlers.length,a=s[n];a&&o!=!a.handlers.length&&(r.removeEventListener(n,this.handleEvent),a=null),a||r.addEventListener(n,this.handleEvent,{passive:o})}for(let n in s)n!="scroll"&&!i[n]&&r.removeEventListener(n,this.handleEvent);this.handlers=i}keydown(e){if(this.lastKeyCode=e.keyCode,this.lastKeyTime=Date.now(),e.keyCode==9&&this.tabFocusMode>-1&&(!this.tabFocusMode||Date.now()<=this.tabFocusMode))return!0;if(this.tabFocusMode>0&&e.keyCode!=27&&Xu.indexOf(e.keyCode)<0&&(this.tabFocusMode=-1),B.android&&B.chrome&&!e.synthetic&&(e.keyCode==13||e.keyCode==8))return this.view.observer.delayAndroidKey(e.key,e.keyCode),!0;let i;return B.ios&&!e.synthetic&&!e.altKey&&!e.metaKey&&!e.shiftKey&&((i=Ku.find(s=>s.keyCode==e.keyCode))&&!e.ctrlKey||Zb.indexOf(e.key)>-1&&e.ctrlKey)?(this.pendingIOSKey=i||e,setTimeout(()=>this.flushIOSKey(),250),!0):(e.keyCode!=229&&this.view.observer.forceFlush(),!1)}flushIOSKey(e){let i=this.pendingIOSKey;return!i||i.key=="Enter"&&e&&e.from<e.to&&/^\S+$/.test(e.insert.toString())?!1:(this.pendingIOSKey=void 0,gs(this.view.contentDOM,i.key,i.keyCode,i instanceof KeyboardEvent?i:void 0))}ignoreDuringComposition(e){return!/^key/.test(e.type)||e.synthetic?!1:this.composing>0?!0:B.safari&&!B.ios&&this.compositionPendingKey&&Date.now()-this.compositionEndedAt<100?(this.compositionPendingKey=!1,!0):!1}startMouseSelection(e){this.mouseSelection&&this.mouseSelection.destroy(),this.mouseSelection=e}update(e){this.view.observer.update(e),this.mouseSelection&&this.mouseSelection.update(e),this.draggedContent&&e.docChanged&&(this.draggedContent=this.draggedContent.map(e.changes)),e.transactions.length&&(this.lastKeyCode=this.lastSelectionTime=0)}destroy(){this.mouseSelection&&this.mouseSelection.destroy()}}function Gh(t,e){return(i,s)=>{try{return e.call(t,s,i)}catch(r){Qe(i.state,r)}}}function Gb(t){let e=Object.create(null);function i(s){return e[s]||(e[s]={observers:[],handlers:[]})}for(let s of t){let r=s.spec,n=r&&r.plugin.domEventHandlers,o=r&&r.plugin.domEventObservers;if(n)for(let a in n){let l=n[a];l&&i(a).handlers.push(Gh(s.value,l))}if(o)for(let a in o){let l=o[a];l&&i(a).observers.push(Gh(s.value,l))}}for(let s in xt)i(s).handlers.push(xt[s]);for(let s in Je)i(s).observers.push(Je[s]);return e}const Ku=[{key:"Backspace",keyCode:8,inputType:"deleteContentBackward"},{key:"Enter",keyCode:13,inputType:"insertParagraph"},{key:"Enter",keyCode:13,inputType:"insertLineBreak"},{key:"Delete",keyCode:46,inputType:"deleteContentForward"}],Zb="dthko",Xu=[16,17,18,20,91,92,224,225],Wr=6;function zr(t){return Math.max(0,t)*.7+8}function ev(t,e){return Math.max(Math.abs(t.clientX-e.clientX),Math.abs(t.clientY-e.clientY))}class tv{constructor(e,i,s,r){this.view=e,this.startEvent=i,this.style=s,this.mustSelect=r,this.scrollSpeed={x:0,y:0},this.scrolling=-1,this.lastEvent=i,this.scrollParents=vu(e.contentDOM),this.atoms=e.state.facet(Er).map(o=>o(e));let n=e.contentDOM.ownerDocument;n.addEventListener("mousemove",this.move=this.move.bind(this)),n.addEventListener("mouseup",this.up=this.up.bind(this)),this.extend=i.shiftKey,this.multiple=e.state.facet(J.allowMultipleSelections)&&iv(e,i),this.dragging=rv(e,i)&&Gu(i)==1?null:!1}start(e){this.dragging===!1&&this.select(e)}move(e){if(e.buttons==0)return this.destroy();if(this.dragging||this.dragging==null&&ev(this.startEvent,e)<10)return;this.select(this.lastEvent=e);let i=0,s=0,r=0,n=0,o=this.view.win.innerWidth,a=this.view.win.innerHeight;this.scrollParents.x&&({left:r,right:o}=this.scrollParents.x.getBoundingClientRect()),this.scrollParents.y&&({top:n,bottom:a}=this.scrollParents.y.getBoundingClientRect());let l=Rl(this.view);e.clientX-l.left<=r+Wr?i=-zr(r-e.clientX):e.clientX+l.right>=o-Wr&&(i=zr(e.clientX-o)),e.clientY-l.top<=n+Wr?s=-zr(n-e.clientY):e.clientY+l.bottom>=a-Wr&&(s=zr(e.clientY-a)),this.setScrollSpeed(i,s)}up(e){this.dragging==null&&this.select(this.lastEvent),this.dragging||e.preventDefault(),this.destroy()}destroy(){this.setScrollSpeed(0,0);let e=this.view.contentDOM.ownerDocument;e.removeEventListener("mousemove",this.move),e.removeEventListener("mouseup",this.up),this.view.inputState.mouseSelection=this.view.inputState.draggedContent=null}setScrollSpeed(e,i){this.scrollSpeed={x:e,y:i},e||i?this.scrolling<0&&(this.scrolling=setInterval(()=>this.scroll(),50)):this.scrolling>-1&&(clearInterval(this.scrolling),this.scrolling=-1)}scroll(){let{x:e,y:i}=this.scrollSpeed;e&&this.scrollParents.x&&(this.scrollParents.x.scrollLeft+=e,e=0),i&&this.scrollParents.y&&(this.scrollParents.y.scrollTop+=i,i=0),(e||i)&&this.view.win.scrollBy(e,i),this.dragging===!1&&this.select(this.lastEvent)}select(e){let{view:i}=this,s=qu(this.atoms,this.style.get(e,this.extend,this.multiple));(this.mustSelect||!s.eq(i.state.selection,this.dragging===!1))&&this.view.dispatch({selection:s,userEvent:"select.pointer"}),this.mustSelect=!1}update(e){e.transactions.some(i=>i.isUserEvent("input.type"))?this.destroy():this.style.update(e)&&setTimeout(()=>this.select(this.lastEvent),20)}}function iv(t,e){let i=t.state.facet(Pu);return i.length?i[0](e):B.mac?e.metaKey:e.ctrlKey}function sv(t,e){let i=t.state.facet(Tu);return i.length?i[0](e):B.mac?!e.altKey:!e.ctrlKey}function rv(t,e){let{main:i}=t.state.selection;if(i.empty)return!1;let s=ur(t.root);if(!s||s.rangeCount==0)return!0;let r=s.getRangeAt(0).getClientRects();for(let n=0;n<r.length;n++){let o=r[n];if(o.left<=e.clientX&&o.right>=e.clientX&&o.top<=e.clientY&&o.bottom>=e.clientY)return!0}return!1}function nv(t,e){if(!e.bubbles)return!0;if(e.defaultPrevented)return!1;for(let i=e.target,s;i!=t.contentDOM;i=i.parentNode)if(!i||i.nodeType==11||(s=me.get(i))&&s.isWidget()&&!s.isHidden&&s.widget.ignoreEvent(e))return!1;return!0}const xt=Object.create(null),Je=Object.create(null),Ju=B.ie&&B.ie_version<15||B.ios&&B.webkit_version<604;function ov(t){let e=t.dom.parentNode;if(!e)return;let i=e.appendChild(document.createElement("textarea"));i.style.cssText="position: fixed; left: -10000px; top: 10px",i.focus(),setTimeout(()=>{t.focus(),i.remove(),Yu(t,i.value)},50)}function uo(t,e,i){for(let s of t.facet(e))i=s(i,t);return i}function Yu(t,e){e=uo(t.state,El,e);let{state:i}=t,s,r=1,n=i.toText(e),o=n.lines==i.selection.ranges.length;if(Ua!=null&&i.selection.ranges.every(l=>l.empty)&&Ua==n.toString()){let l=-1;s=i.changeByRange(h=>{let c=i.doc.lineAt(h.from);if(c.from==l)return{range:h};l=c.from;let d=i.toText((o?n.line(r++).text:e)+i.lineBreak);return{changes:{from:c.from,insert:d},range:$.cursor(h.from+d.length)}})}else o?s=i.changeByRange(l=>{let h=n.line(r++);return{changes:{from:l.from,to:l.to,insert:h.text},range:$.cursor(l.from+h.length)}}):s=i.replaceSelection(n);t.dispatch(s,{userEvent:"input.paste",scrollIntoView:!0})}Je.scroll=t=>{t.inputState.lastScrollTop=t.scrollDOM.scrollTop,t.inputState.lastScrollLeft=t.scrollDOM.scrollLeft};Je.wheel=Je.mousewheel=t=>{t.inputState.lastWheelEvent=Date.now()};xt.keydown=(t,e)=>(t.inputState.setSelectionOrigin("select"),e.keyCode==27&&t.inputState.tabFocusMode!=0&&(t.inputState.tabFocusMode=Date.now()+2e3),!1);Je.touchstart=(t,e)=>{let i=t.inputState,s=e.targetTouches[0];i.lastTouchTime=Date.now(),s&&(i.lastTouchX=s.clientX,i.lastTouchY=s.clientY),i.setSelectionOrigin("select.pointer")};Je.touchmove=t=>{t.inputState.setSelectionOrigin("select.pointer")};xt.mousedown=(t,e)=>{if(t.observer.flush(),t.inputState.lastTouchTime>Date.now()-2e3)return!1;let i=null;for(let s of t.state.facet(Mu))if(i=s(t,e),i)break;if(!i&&e.button==0&&(i=lv(t,e)),i){let s=!t.hasFocus;t.inputState.startMouseSelection(new tv(t,e,i,s)),s&&t.observer.ignore(()=>{yu(t.contentDOM);let n=t.root.activeElement;n&&!n.contains(t.contentDOM)&&n.blur()});let r=t.inputState.mouseSelection;if(r)return r.start(e),r.dragging===!1}else t.inputState.setSelectionOrigin("select.pointer");return!1};function Zh(t,e,i,s){if(s==1)return $.cursor(e,i);if(s==2)return Fb(t.state,e,i);{let r=t.docView.lineAt(e,i),n=t.state.doc.lineAt(r?r.posAtEnd:e),o=r?r.posAtStart:n.from,a=r?r.posAtEnd:n.to;return a<t.state.doc.length&&a==n.to&&a++,$.range(o,a)}}const av=B.ie&&B.ie_version<=11;let ec=null,tc=0,ic=0;function Gu(t){if(!av)return t.detail;let e=ec,i=ic;return ec=t,ic=Date.now(),tc=!e||i>Date.now()-400&&Math.abs(e.clientX-t.clientX)<2&&Math.abs(e.clientY-t.clientY)<2?(tc+1)%3:1}function lv(t,e){let i=t.posAndSideAtCoords({x:e.clientX,y:e.clientY},!1),s=Gu(e),r=t.state.selection;return{update(n){n.docChanged&&(i.pos=n.changes.mapPos(i.pos),r=r.map(n.changes))},get(n,o,a){let l=t.posAndSideAtCoords({x:n.clientX,y:n.clientY},!1),h,c=Zh(t,l.pos,l.assoc,s);if(i.pos!=l.pos&&!o){let d=Zh(t,i.pos,i.assoc,s),u=Math.min(d.from,c.from),f=Math.max(d.to,c.to);c=u<c.from?$.range(u,f,c.assoc):$.range(f,u,c.assoc)}return o?r.replaceRange(r.main.extend(c.from,c.to,c.assoc)):a&&s==1&&r.ranges.length>1&&(h=hv(r,l.pos))?h:a?r.addRange(c):$.create([c])}}}function hv(t,e){for(let i=0;i<t.ranges.length;i++){let{from:s,to:r}=t.ranges[i];if(s<=e&&r>=e)return $.create(t.ranges.slice(0,i).concat(t.ranges.slice(i+1)),t.mainIndex==i?0:t.mainIndex-(t.mainIndex>i?1:0))}return null}xt.dragstart=(t,e)=>{let{selection:{main:i}}=t.state;if(e.target.draggable){let r=t.docView.tile.nearest(e.target);if(r&&r.isWidget()){let n=r.posAtStart,o=n+r.length;(n>=i.to||o<=i.from)&&(i=$.range(n,o))}}let{inputState:s}=t;return s.mouseSelection&&(s.mouseSelection.dragging=!0),s.draggedContent=i,e.dataTransfer&&(e.dataTransfer.setData("Text",uo(t.state,_l,t.state.sliceDoc(i.from,i.to))),e.dataTransfer.effectAllowed="copyMove"),!1};xt.dragend=t=>(t.inputState.draggedContent=null,!1);function sc(t,e,i,s){if(i=uo(t.state,El,i),!i)return;let r=t.posAtCoords({x:e.clientX,y:e.clientY},!1),{draggedContent:n}=t.inputState,o=s&&n&&sv(t,e)?{from:n.from,to:n.to}:null,a={from:r,insert:i},l=t.state.changes(o?[o,a]:a);t.focus(),t.dispatch({changes:l,selection:{anchor:l.mapPos(r,-1),head:l.mapPos(r,1)},userEvent:o?"move.drop":"input.drop"}),t.inputState.draggedContent=null}xt.drop=(t,e)=>{if(!e.dataTransfer)return!1;if(t.state.readOnly)return!0;let i=e.dataTransfer.files;if(i&&i.length){let s=Array(i.length),r=0,n=()=>{++r==i.length&&sc(t,e,s.filter(o=>o!=null).join(t.state.lineBreak),!1)};for(let o=0;o<i.length;o++){let a=new FileReader;a.onerror=n,a.onload=()=>{/[\x00-\x08\x0e-\x1f]{2}/.test(a.result)||(s[o]=a.result),n()},a.readAsText(i[o])}return!0}else{let s=e.dataTransfer.getData("Text");if(s)return sc(t,e,s,!0),!0}return!1};xt.paste=(t,e)=>{if(t.state.readOnly)return!0;t.observer.flush();let i=Ju?null:e.clipboardData;return i?(Yu(t,i.getData("text/plain")||i.getData("text/uri-list")),!0):(ov(t),!1)};function cv(t,e){let i=t.dom.parentNode;if(!i)return;let s=i.appendChild(document.createElement("textarea"));s.style.cssText="position: fixed; left: -10000px; top: 10px",s.value=e,s.focus(),s.selectionEnd=e.length,s.selectionStart=0,setTimeout(()=>{s.remove(),t.focus()},50)}function dv(t){let e=[],i=[],s=!1;for(let r of t.selection.ranges)r.empty||(e.push(t.sliceDoc(r.from,r.to)),i.push(r));if(!e.length){let r=-1;for(let{from:n}of t.selection.ranges){let o=t.doc.lineAt(n);o.number>r&&(e.push(o.text),i.push({from:o.from,to:Math.min(t.doc.length,o.to+1)})),r=o.number}s=!0}return{text:uo(t,_l,e.join(t.lineBreak)),ranges:i,linewise:s}}let Ua=null;xt.copy=xt.cut=(t,e)=>{if(!Ys(t.contentDOM,t.observer.selectionRange))return!1;let{text:i,ranges:s,linewise:r}=dv(t.state);if(!i&&!r)return!1;Ua=r?i:null,e.type=="cut"&&!t.state.readOnly&&t.dispatch({changes:s,scrollIntoView:!0,userEvent:"delete.cut"});let n=Ju?null:e.clipboardData;return n?(n.clearData(),n.setData("text/plain",i),!0):(cv(t,i),!1)};const Zu=ei.define();function ef(t,e){let i=[];for(let s of t.facet(Du)){let r=s(t,e);r&&i.push(r)}return i.length?t.update({effects:i,annotations:Zu.of(!0)}):null}function tf(t){setTimeout(()=>{let e=t.hasFocus;if(e!=t.inputState.notifiedFocused){let i=ef(t.state,e);i?t.dispatch(i):t.update([])}},10)}Je.focus=t=>{t.inputState.lastFocusTime=Date.now(),!t.scrollDOM.scrollTop&&(t.inputState.lastScrollTop||t.inputState.lastScrollLeft)&&(t.scrollDOM.scrollTop=t.inputState.lastScrollTop,t.scrollDOM.scrollLeft=t.inputState.lastScrollLeft),tf(t)};Je.blur=t=>{t.observer.clearSelectionRange(),tf(t)};Je.compositionstart=Je.compositionupdate=t=>{t.observer.editContext||(t.inputState.compositionFirstChange==null&&(t.inputState.compositionFirstChange=!0),t.inputState.composing<0&&(t.inputState.composing=0))};Je.compositionend=t=>{t.observer.editContext||(t.inputState.composing=-1,t.inputState.compositionEndedAt=Date.now(),t.inputState.compositionPendingKey=!0,t.inputState.compositionPendingChange=t.observer.pendingRecords().length>0,t.inputState.compositionFirstChange=null,B.chrome&&B.android?t.observer.flushSoon():t.inputState.compositionPendingChange?Promise.resolve().then(()=>t.observer.flush()):setTimeout(()=>{t.inputState.composing<0&&t.docView.hasComposition&&t.update([])},50))};Je.contextmenu=t=>{t.inputState.lastContextMenu=Date.now()};xt.beforeinput=(t,e)=>{var i,s;if((e.inputType=="insertText"||e.inputType=="insertCompositionText")&&(t.inputState.insertingText=e.data,t.inputState.insertingTextAt=Date.now()),e.inputType=="insertReplacementText"&&t.observer.editContext){let n=(i=e.dataTransfer)===null||i===void 0?void 0:i.getData("text/plain"),o=e.getTargetRanges();if(n&&o.length){let a=o[0],l=t.posAtDOM(a.startContainer,a.startOffset),h=t.posAtDOM(a.endContainer,a.endOffset);return Ll(t,{from:l,to:h,insert:t.state.toText(n)},null),!0}}let r;if(B.chrome&&B.android&&(r=Ku.find(n=>n.inputType==e.inputType))&&(t.observer.delayAndroidKey(r.key,r.keyCode),r.key=="Backspace"||r.key=="Delete")){let n=((s=window.visualViewport)===null||s===void 0?void 0:s.height)||0;setTimeout(()=>{var o;(((o=window.visualViewport)===null||o===void 0?void 0:o.height)||0)>n+10&&t.hasFocus&&(t.contentDOM.blur(),t.focus())},100)}return B.ios&&e.inputType=="deleteContentForward"&&t.observer.flushSoon(),B.safari&&e.inputType=="insertText"&&t.inputState.composing>=0&&setTimeout(()=>Je.compositionend(t,e),20),!1};const rc=new Set;function uv(t){rc.has(t)||(rc.add(t),t.addEventListener("copy",()=>{}),t.addEventListener("cut",()=>{}))}const nc=["pre-wrap","normal","pre-line","break-spaces"];let $s=!1;function oc(){$s=!1}class fv{constructor(e){this.lineWrapping=e,this.doc=Y.empty,this.heightSamples={},this.lineHeight=14,this.charWidth=7,this.textHeight=14,this.lineLength=30}heightForGap(e,i){let s=this.doc.lineAt(i).number-this.doc.lineAt(e).number+1;return this.lineWrapping&&(s+=Math.max(0,Math.ceil((i-e-s*this.lineLength*.5)/this.lineLength))),this.lineHeight*s}heightForLine(e){return this.lineWrapping?(1+Math.max(0,Math.ceil((e-this.lineLength)/Math.max(1,this.lineLength-5))))*this.lineHeight:this.lineHeight}setDoc(e){return this.doc=e,this}mustRefreshForWrapping(e){return nc.indexOf(e)>-1!=this.lineWrapping}mustRefreshForHeights(e){let i=!1;for(let s=0;s<e.length;s++){let r=e[s];r<0?s++:this.heightSamples[Math.floor(r*10)]||(i=!0,this.heightSamples[Math.floor(r*10)]=!0)}return i}refresh(e,i,s,r,n,o){let a=nc.indexOf(e)>-1,l=Math.abs(i-this.lineHeight)>.3||this.lineWrapping!=a||Math.abs(s-this.charWidth)>.1;if(this.lineWrapping=a,this.lineHeight=i,this.charWidth=s,this.textHeight=r,this.lineLength=n,l){this.heightSamples={};for(let h=0;h<o.length;h++){let c=o[h];c<0?h++:this.heightSamples[Math.floor(c*10)]=!0}}return l}}class pv{constructor(e,i){this.from=e,this.heights=i,this.index=0}get more(){return this.index<this.heights.length}}class mt{constructor(e,i,s,r,n){this.from=e,this.length=i,this.top=s,this.height=r,this._content=n}get type(){return typeof this._content=="number"?Te.Text:Array.isArray(this._content)?this._content:this._content.type}get to(){return this.from+this.length}get bottom(){return this.top+this.height}get widget(){return this._content instanceof Ki?this._content.widget:null}get widgetLineBreaks(){return typeof this._content=="number"?this._content:0}join(e){let i=(Array.isArray(this._content)?this._content:[this]).concat(Array.isArray(e._content)?e._content:[e]);return new mt(this.from,this.length+e.length,this.top,this.height+e.height,i)}}var ce=(function(t){return t[t.ByPos=0]="ByPos",t[t.ByHeight=1]="ByHeight",t[t.ByPosNoHeight=2]="ByPosNoHeight",t})(ce||(ce={}));const fn=.001;class Ue{constructor(e,i,s=2){this.length=e,this.height=i,this.flags=s}get outdated(){return(this.flags&2)>0}set outdated(e){this.flags=(e?2:0)|this.flags&-3}setHeight(e){this.height!=e&&(Math.abs(this.height-e)>fn&&($s=!0),this.height=e)}replace(e,i,s){return Ue.of(s)}decomposeLeft(e,i){i.push(this)}decomposeRight(e,i){i.push(this)}applyChanges(e,i,s,r){let n=this,o=s.doc;for(let a=r.length-1;a>=0;a--){let{fromA:l,toA:h,fromB:c,toB:d}=r[a],u=n.lineAt(l,ce.ByPosNoHeight,s.setDoc(i),0,0),f=u.to>=h?u:n.lineAt(h,ce.ByPosNoHeight,s,0,0);for(d+=f.to-h,h=f.to;a>0&&u.from<=r[a-1].toA;)l=r[a-1].fromA,c=r[a-1].fromB,a--,l<u.from&&(u=n.lineAt(l,ce.ByPosNoHeight,s,0,0));c+=u.from-l,l=u.from;let g=Il.build(s.setDoc(o),e,c,d);n=Bn(n,n.replace(l,h,g))}return n.updateHeight(s,0)}static empty(){return new tt(0,0,0)}static of(e){if(e.length==1)return e[0];let i=0,s=e.length,r=0,n=0;for(;;)if(i==s)if(r>n*2){let a=e[i-1];a.break?e.splice(--i,1,a.left,null,a.right):e.splice(--i,1,a.left,a.right),s+=1+a.break,r-=a.size}else if(n>r*2){let a=e[s];a.break?e.splice(s,1,a.left,null,a.right):e.splice(s,1,a.left,a.right),s+=2+a.break,n-=a.size}else break;else if(r<n){let a=e[i++];a&&(r+=a.size)}else{let a=e[--s];a&&(n+=a.size)}let o=0;return e[i-1]==null?(o=1,i--):e[i]==null&&(o=1,s++),new mv(Ue.of(e.slice(0,i)),o,Ue.of(e.slice(s)))}}function Bn(t,e){return t==e?t:(t.constructor!=e.constructor&&($s=!0),e)}Ue.prototype.size=1;const gv=U.replace({});class sf extends Ue{constructor(e,i,s){super(e,i),this.deco=s,this.spaceAbove=0}mainBlock(e,i){return new mt(i,this.length,e+this.spaceAbove,this.height-this.spaceAbove,this.deco||0)}blockAt(e,i,s,r){return this.spaceAbove&&e<s+this.spaceAbove?new mt(r,0,s,this.spaceAbove,gv):this.mainBlock(s,r)}lineAt(e,i,s,r,n){let o=this.mainBlock(r,n);return this.spaceAbove?this.blockAt(0,s,r,n).join(o):o}forEachLine(e,i,s,r,n,o){e<=n+this.length&&i>=n&&o(this.lineAt(0,ce.ByPos,s,r,n))}setMeasuredHeight(e){let i=e.heights[e.index++];i<0?(this.spaceAbove=-i,i=e.heights[e.index++]):this.spaceAbove=0,this.setHeight(i)}updateHeight(e,i=0,s=!1,r){return r&&r.from<=i&&r.more&&this.setMeasuredHeight(r),this.outdated=!1,this}toString(){return`block(${this.length})`}}class tt extends sf{constructor(e,i,s){super(e,i,null),this.collapsed=0,this.widgetHeight=0,this.breaks=0,this.spaceAbove=s}mainBlock(e,i){return new mt(i,this.length,e+this.spaceAbove,this.height-this.spaceAbove,this.breaks)}replace(e,i,s){let r=s[0];return s.length==1&&(r instanceof tt||r instanceof Ae&&r.flags&4)&&Math.abs(this.length-r.length)<10?(r instanceof Ae?r=new tt(r.length,this.height,this.spaceAbove):r.height=this.height,this.outdated||(r.outdated=!1),r):Ue.of(s)}updateHeight(e,i=0,s=!1,r){return r&&r.from<=i&&r.more?this.setMeasuredHeight(r):(s||this.outdated)&&(this.spaceAbove=0,this.setHeight(Math.max(this.widgetHeight,e.heightForLine(this.length-this.collapsed))+this.breaks*e.lineHeight)),this.outdated=!1,this}toString(){return`line(${this.length}${this.collapsed?-this.collapsed:""}${this.widgetHeight?":"+this.widgetHeight:""})`}}class Ae extends Ue{constructor(e){super(e,0)}heightMetrics(e,i){let s=e.doc.lineAt(i).number,r=e.doc.lineAt(i+this.length).number,n=r-s+1,o,a=0;if(e.lineWrapping){let l=Math.min(this.height,e.lineHeight*n);o=l/n,this.length>n+1&&(a=(this.height-l)/(this.length-n-1))}else o=this.height/n;return{firstLine:s,lastLine:r,perLine:o,perChar:a}}blockAt(e,i,s,r){let{firstLine:n,lastLine:o,perLine:a,perChar:l}=this.heightMetrics(i,r);if(i.lineWrapping){let h=r+(e<i.lineHeight?0:Math.round(Math.max(0,Math.min(1,(e-s)/this.height))*this.length)),c=i.doc.lineAt(h),d=a+c.length*l,u=Math.max(s,e-d/2);return new mt(c.from,c.length,u,d,0)}else{let h=Math.max(0,Math.min(o-n,Math.floor((e-s)/a))),{from:c,length:d}=i.doc.line(n+h);return new mt(c,d,s+a*h,a,0)}}lineAt(e,i,s,r,n){if(i==ce.ByHeight)return this.blockAt(e,s,r,n);if(i==ce.ByPosNoHeight){let{from:f,to:g}=s.doc.lineAt(e);return new mt(f,g-f,0,0,0)}let{firstLine:o,perLine:a,perChar:l}=this.heightMetrics(s,n),h=s.doc.lineAt(e),c=a+h.length*l,d=h.number-o,u=r+a*d+l*(h.from-n-d);return new mt(h.from,h.length,Math.max(r,Math.min(u,r+this.height-c)),c,0)}forEachLine(e,i,s,r,n,o){e=Math.max(e,n),i=Math.min(i,n+this.length);let{firstLine:a,perLine:l,perChar:h}=this.heightMetrics(s,n);for(let c=e,d=r;c<=i;){let u=s.doc.lineAt(c);if(c==e){let g=u.number-a;d+=l*g+h*(e-n-g)}let f=l+h*u.length;o(new mt(u.from,u.length,d,f,0)),d+=f,c=u.to+1}}replace(e,i,s){let r=this.length-i;if(r>0){let n=s[s.length-1];n instanceof Ae?s[s.length-1]=new Ae(n.length+r):s.push(null,new Ae(r-1))}if(e>0){let n=s[0];n instanceof Ae?s[0]=new Ae(e+n.length):s.unshift(new Ae(e-1),null)}return Ue.of(s)}decomposeLeft(e,i){i.push(new Ae(e-1),null)}decomposeRight(e,i){i.push(null,new Ae(this.length-e-1))}updateHeight(e,i=0,s=!1,r){let n=i+this.length;if(r&&r.from<=i+this.length&&r.more){let o=[],a=Math.max(i,r.from),l=-1;for(r.from>i&&o.push(new Ae(r.from-i-1).updateHeight(e,i));a<=n&&r.more;){let c=e.doc.lineAt(a).length;o.length&&o.push(null);let d=r.heights[r.index++],u=0;d<0&&(u=-d,d=r.heights[r.index++]),l==-1?l=d:Math.abs(d-l)>=fn&&(l=-2);let f=new tt(c,d,u);f.outdated=!1,o.push(f),a+=c+1}a<=n&&o.push(null,new Ae(n-a).updateHeight(e,a));let h=Ue.of(o);return(l<0||Math.abs(h.height-this.height)>=fn||Math.abs(l-this.heightMetrics(e,i).perLine)>=fn)&&($s=!0),Bn(this,h)}else(s||this.outdated)&&(this.setHeight(e.heightForGap(i,i+this.length)),this.outdated=!1);return this}toString(){return`gap(${this.length})`}}class mv extends Ue{constructor(e,i,s){super(e.length+i+s.length,e.height+s.height,i|(e.outdated||s.outdated?2:0)),this.left=e,this.right=s,this.size=e.size+s.size}get break(){return this.flags&1}blockAt(e,i,s,r){let n=s+this.left.height;return e<n?this.left.blockAt(e,i,s,r):this.right.blockAt(e,i,n,r+this.left.length+this.break)}lineAt(e,i,s,r,n){let o=r+this.left.height,a=n+this.left.length+this.break,l=i==ce.ByHeight?e<o:e<a,h=l?this.left.lineAt(e,i,s,r,n):this.right.lineAt(e,i,s,o,a);if(this.break||(l?h.to<a:h.from>a))return h;let c=i==ce.ByPosNoHeight?ce.ByPosNoHeight:ce.ByPos;return l?h.join(this.right.lineAt(a,c,s,o,a)):this.left.lineAt(a,c,s,r,n).join(h)}forEachLine(e,i,s,r,n,o){let a=r+this.left.height,l=n+this.left.length+this.break;if(this.break)e<l&&this.left.forEachLine(e,i,s,r,n,o),i>=l&&this.right.forEachLine(e,i,s,a,l,o);else{let h=this.lineAt(l,ce.ByPos,s,r,n);e<h.from&&this.left.forEachLine(e,h.from-1,s,r,n,o),h.to>=e&&h.from<=i&&o(h),i>h.to&&this.right.forEachLine(h.to+1,i,s,a,l,o)}}replace(e,i,s){let r=this.left.length+this.break;if(i<r)return this.balanced(this.left.replace(e,i,s),this.right);if(e>this.left.length)return this.balanced(this.left,this.right.replace(e-r,i-r,s));let n=[];e>0&&this.decomposeLeft(e,n);let o=n.length;for(let a of s)n.push(a);if(e>0&&ac(n,o-1),i<this.length){let a=n.length;this.decomposeRight(i,n),ac(n,a)}return Ue.of(n)}decomposeLeft(e,i){let s=this.left.length;if(e<=s)return this.left.decomposeLeft(e,i);i.push(this.left),this.break&&(s++,e>=s&&i.push(null)),e>s&&this.right.decomposeLeft(e-s,i)}decomposeRight(e,i){let s=this.left.length,r=s+this.break;if(e>=r)return this.right.decomposeRight(e-r,i);e<s&&this.left.decomposeRight(e,i),this.break&&e<r&&i.push(null),i.push(this.right)}balanced(e,i){return e.size>2*i.size||i.size>2*e.size?Ue.of(this.break?[e,null,i]:[e,i]):(this.left=Bn(this.left,e),this.right=Bn(this.right,i),this.setHeight(e.height+i.height),this.outdated=e.outdated||i.outdated,this.size=e.size+i.size,this.length=e.length+this.break+i.length,this)}updateHeight(e,i=0,s=!1,r){let{left:n,right:o}=this,a=i+n.length+this.break,l=null;return r&&r.from<=i+n.length&&r.more?l=n=n.updateHeight(e,i,s,r):n.updateHeight(e,i,s),r&&r.from<=a+o.length&&r.more?l=o=o.updateHeight(e,a,s,r):o.updateHeight(e,a,s),l?this.balanced(n,o):(this.height=this.left.height+this.right.height,this.outdated=!1,this)}toString(){return this.left+(this.break?" ":"-")+this.right}}function ac(t,e){let i,s;t[e]==null&&(i=t[e-1])instanceof Ae&&(s=t[e+1])instanceof Ae&&t.splice(e-1,3,new Ae(i.length+1+s.length))}const bv=5;class Il{constructor(e,i){this.pos=e,this.oracle=i,this.nodes=[],this.lineStart=-1,this.lineEnd=-1,this.covering=null,this.writtenTo=e}get isCovered(){return this.covering&&this.nodes[this.nodes.length-1]==this.covering}span(e,i){if(this.lineStart>-1){let s=Math.min(i,this.lineEnd),r=this.nodes[this.nodes.length-1];r instanceof tt?r.length+=s-this.pos:(s>this.pos||!this.isCovered)&&this.nodes.push(new tt(s-this.pos,-1,0)),this.writtenTo=s,i>s&&(this.nodes.push(null),this.writtenTo++,this.lineStart=-1)}this.pos=i}point(e,i,s){if(e<i||s.heightRelevant){let r=s.widget?s.widget.estimatedHeight:0,n=s.widget?s.widget.lineBreaks:0;r<0&&(r=this.oracle.lineHeight);let o=i-e;s.block?this.addBlock(new sf(o,r,s)):(o||n||r>=bv)&&this.addLineDeco(r,n,o)}else i>e&&this.span(e,i);this.lineEnd>-1&&this.lineEnd<this.pos&&(this.lineEnd=this.oracle.doc.lineAt(this.pos).to)}enterLine(){if(this.lineStart>-1)return;let{from:e,to:i}=this.oracle.doc.lineAt(this.pos);this.lineStart=e,this.lineEnd=i,this.writtenTo<e&&((this.writtenTo<e-1||this.nodes[this.nodes.length-1]==null)&&this.nodes.push(this.blankContent(this.writtenTo,e-1)),this.nodes.push(null)),this.pos>e&&this.nodes.push(new tt(this.pos-e,-1,0)),this.writtenTo=this.pos}blankContent(e,i){let s=new Ae(i-e);return this.oracle.doc.lineAt(e).to==i&&(s.flags|=4),s}ensureLine(){this.enterLine();let e=this.nodes.length?this.nodes[this.nodes.length-1]:null;if(e instanceof tt)return e;let i=new tt(0,-1,0);return this.nodes.push(i),i}addBlock(e){this.enterLine();let i=e.deco;i&&i.startSide>0&&!this.isCovered&&this.ensureLine(),this.nodes.push(e),this.writtenTo=this.pos=this.pos+e.length,i&&i.endSide>0&&(this.covering=e)}addLineDeco(e,i,s){let r=this.ensureLine();r.length+=s,r.collapsed+=s,r.widgetHeight=Math.max(r.widgetHeight,e),r.breaks+=i,this.writtenTo=this.pos=this.pos+s}finish(e){let i=this.nodes.length==0?null:this.nodes[this.nodes.length-1];this.lineStart>-1&&!(i instanceof tt)&&!this.isCovered?this.nodes.push(new tt(0,-1,0)):(this.writtenTo<this.pos||i==null)&&this.nodes.push(this.blankContent(this.writtenTo,this.pos));let s=e;for(let r of this.nodes)r instanceof tt&&r.updateHeight(this.oracle,s),s+=r?r.length:1;return this.nodes}static build(e,i,s,r){let n=new Il(s,e);return Q.spans(i,s,r,n,0),n.finish(s)}}function vv(t,e,i){let s=new yv;return Q.compare(t,e,i,s,0),s.changes}class yv{constructor(){this.changes=[]}compareRange(){}comparePoint(e,i,s,r){(e<i||s&&s.heightRelevant||r&&r.heightRelevant)&&ps(e,i,this.changes,5)}}function xv(t,e){let i=t.getBoundingClientRect(),s=t.ownerDocument,r=s.defaultView||window,n=Math.max(0,i.left),o=Math.min(r.innerWidth,i.right),a=Math.max(0,i.top),l=Math.min(r.innerHeight,i.bottom);for(let h=t.parentNode;h&&h!=s.body;)if(h.nodeType==1){let c=h,d=window.getComputedStyle(c);if((c.scrollHeight>c.clientHeight||c.scrollWidth>c.clientWidth)&&d.overflow!="visible"){let u=c.getBoundingClientRect();n=Math.max(n,u.left),o=Math.min(o,u.right),a=Math.max(a,u.top),l=Math.min(h==t.parentNode?r.innerHeight:l,u.bottom)}h=d.position=="absolute"||d.position=="fixed"?c.offsetParent:c.parentNode}else if(h.nodeType==11)h=h.host;else break;return{left:n-i.left,right:Math.max(n,o)-i.left,top:a-(i.top+e),bottom:Math.max(a,l)-(i.top+e)}}function wv(t){let e=t.getBoundingClientRect(),i=t.ownerDocument.defaultView||window;return e.left<i.innerWidth&&e.right>0&&e.top<i.innerHeight&&e.bottom>0}function kv(t,e){let i=t.getBoundingClientRect();return{left:0,right:i.right-i.left,top:e,bottom:i.bottom-(i.top+e)}}class Uo{constructor(e,i,s,r){this.from=e,this.to=i,this.size=s,this.displaySize=r}static same(e,i){if(e.length!=i.length)return!1;for(let s=0;s<e.length;s++){let r=e[s],n=i[s];if(r.from!=n.from||r.to!=n.to||r.size!=n.size)return!1}return!0}draw(e,i){return U.replace({widget:new Sv(this.displaySize*(i?e.scaleY:e.scaleX),i)}).range(this.from,this.to)}}class Sv extends ti{constructor(e,i){super(),this.size=e,this.vertical=i}eq(e){return e.size==this.size&&e.vertical==this.vertical}toDOM(){let e=document.createElement("div");return this.vertical?e.style.height=this.size+"px":(e.style.width=this.size+"px",e.style.height="2px",e.style.display="inline-block"),e}get estimatedHeight(){return this.vertical?this.size:-1}}class lc{constructor(e,i){this.view=e,this.state=i,this.pixelViewport={left:0,right:window.innerWidth,top:0,bottom:0},this.inView=!0,this.paddingTop=0,this.paddingBottom=0,this.contentDOMWidth=0,this.contentDOMHeight=0,this.editorHeight=0,this.editorWidth=0,this.scaleX=1,this.scaleY=1,this.scrollOffset=0,this.scrolledToBottom=!1,this.scrollAnchorPos=0,this.scrollAnchorHeight=-1,this.scaler=hc,this.scrollTarget=null,this.printing=!1,this.mustMeasureContent=!0,this.defaultTextDirection=ae.LTR,this.visibleRanges=[],this.mustEnforceCursorAssoc=!1;let s=i.facet(Dl).some(r=>typeof r!="function"&&r.class=="cm-lineWrapping");this.heightOracle=new fv(s),this.stateDeco=cc(i),this.heightMap=Ue.empty().applyChanges(this.stateDeco,Y.empty,this.heightOracle.setDoc(i.doc),[new ct(0,0,0,i.doc.length)]);for(let r=0;r<2&&(this.viewport=this.getViewport(0,null),!!this.updateForViewport());r++);this.updateViewportLines(),this.lineGaps=this.ensureLineGaps([]),this.lineGapDeco=U.set(this.lineGaps.map(r=>r.draw(this,!1))),this.scrollParent=e.scrollDOM,this.computeVisibleRanges()}updateForViewport(){let e=[this.viewport],{main:i}=this.state.selection;for(let s=0;s<=1;s++){let r=s?i.head:i.anchor;if(!e.some(({from:n,to:o})=>r>=n&&r<=o)){let{from:n,to:o}=this.lineBlockAt(r);e.push(new qr(n,o))}}return this.viewports=e.sort((s,r)=>s.from-r.from),this.updateScaler()}updateScaler(){let e=this.scaler;return this.scaler=this.heightMap.height<=7e6?hc:new Fl(this.heightOracle,this.heightMap,this.viewports),e.eq(this.scaler)?0:2}updateViewportLines(){this.viewportLines=[],this.heightMap.forEachLine(this.viewport.from,this.viewport.to,this.heightOracle.setDoc(this.state.doc),0,0,e=>{this.viewportLines.push(qs(e,this.scaler))})}update(e,i=null){this.state=e.state;let s=this.stateDeco;this.stateDeco=cc(this.state);let r=e.changedRanges,n=ct.extendWithRanges(r,vv(s,this.stateDeco,e?e.changes:we.empty(this.state.doc.length))),o=this.heightMap.height,a=this.scrolledToBottom?null:this.scrollAnchorAt(this.scrollOffset);oc(),this.heightMap=this.heightMap.applyChanges(this.stateDeco,e.startState.doc,this.heightOracle.setDoc(this.state.doc),n),(this.heightMap.height!=o||$s)&&(e.flags|=2),a?(this.scrollAnchorPos=e.changes.mapPos(a.from,-1),this.scrollAnchorHeight=a.top):(this.scrollAnchorPos=-1,this.scrollAnchorHeight=o);let l=n.length?this.mapViewport(this.viewport,e.changes):this.viewport;(i&&(i.range.head<l.from||i.range.head>l.to)||!this.viewportIsAppropriate(l))&&(l=this.getViewport(0,i));let h=l.from!=this.viewport.from||l.to!=this.viewport.to;this.viewport=l,e.flags|=this.updateForViewport(),(h||!e.changes.empty||e.flags&2)&&this.updateViewportLines(),(this.lineGaps.length||this.viewport.to-this.viewport.from>4e3)&&this.updateLineGaps(this.ensureLineGaps(this.mapLineGaps(this.lineGaps,e.changes))),e.flags|=this.computeVisibleRanges(e.changes),i&&(this.scrollTarget=i),!this.mustEnforceCursorAssoc&&(e.selectionSet||e.focusChanged)&&e.view.lineWrapping&&e.state.selection.main.empty&&e.state.selection.main.assoc&&!e.state.facet(Ru)&&(this.mustEnforceCursorAssoc=!0)}measure(){let{view:e}=this,i=e.contentDOM,s=window.getComputedStyle(i),r=this.heightOracle,n=s.whiteSpace;this.defaultTextDirection=s.direction=="rtl"?ae.RTL:ae.LTR;let o=this.heightOracle.mustRefreshForWrapping(n)||this.mustMeasureContent==="refresh",a=i.getBoundingClientRect(),l=o||this.mustMeasureContent||this.contentDOMHeight!=a.height;this.contentDOMHeight=a.height,this.mustMeasureContent=!1;let h=0,c=0;if(a.width&&a.height){let{scaleX:A,scaleY:P}=bu(i,a);(A>.005&&Math.abs(this.scaleX-A)>.005||P>.005&&Math.abs(this.scaleY-P)>.005)&&(this.scaleX=A,this.scaleY=P,h|=16,o=l=!0)}let d=(parseInt(s.paddingTop)||0)*this.scaleY,u=(parseInt(s.paddingBottom)||0)*this.scaleY;(this.paddingTop!=d||this.paddingBottom!=u)&&(this.paddingTop=d,this.paddingBottom=u,h|=18),this.editorWidth!=e.scrollDOM.clientWidth&&(r.lineWrapping&&(l=!0),this.editorWidth=e.scrollDOM.clientWidth,h|=16);let f=vu(this.view.contentDOM,!1).y;f!=this.scrollParent&&(this.scrollParent=f,this.scrollAnchorHeight=-1,this.scrollOffset=0);let g=this.getScrollOffset();this.scrollOffset!=g&&(this.scrollAnchorHeight=-1,this.scrollOffset=g),this.scrolledToBottom=xu(this.scrollParent||e.win);let m=(this.printing?kv:xv)(i,this.paddingTop),y=m.top-this.pixelViewport.top,w=m.bottom-this.pixelViewport.bottom;this.pixelViewport=m;let x=this.pixelViewport.bottom>this.pixelViewport.top&&this.pixelViewport.right>this.pixelViewport.left;if(x!=this.inView&&(this.inView=x,x&&(l=!0)),!this.inView&&!this.scrollTarget&&!wv(e.dom))return 0;let O=a.width;if((this.contentDOMWidth!=O||this.editorHeight!=e.scrollDOM.clientHeight)&&(this.contentDOMWidth=a.width,this.editorHeight=e.scrollDOM.clientHeight,h|=16),l){let A=e.docView.measureVisibleLineHeights(this.viewport);if(r.mustRefreshForHeights(A)&&(o=!0),o||r.lineWrapping&&Math.abs(O-this.contentDOMWidth)>r.charWidth){let{lineHeight:P,charWidth:T,textHeight:H}=e.docView.measureTextSize();o=P>0&&r.refresh(n,P,T,H,Math.max(5,O/T),A),o&&(e.docView.minWidth=0,h|=16)}y>0&&w>0?c=Math.max(y,w):y<0&&w<0&&(c=Math.min(y,w)),oc();for(let P of this.viewports){let T=P.from==this.viewport.from?A:e.docView.measureVisibleLineHeights(P);this.heightMap=(o?Ue.empty().applyChanges(this.stateDeco,Y.empty,this.heightOracle,[new ct(0,0,0,e.state.doc.length)]):this.heightMap).updateHeight(r,0,o,new pv(P.from,T))}$s&&(h|=2)}let D=!this.viewportIsAppropriate(this.viewport,c)||this.scrollTarget&&(this.scrollTarget.range.head<this.viewport.from||this.scrollTarget.range.head>this.viewport.to);return D&&(h&2&&(h|=this.updateScaler()),this.viewport=this.getViewport(c,this.scrollTarget),h|=this.updateForViewport()),(h&2||D)&&this.updateViewportLines(),(this.lineGaps.length||this.viewport.to-this.viewport.from>4e3)&&this.updateLineGaps(this.ensureLineGaps(o?[]:this.lineGaps,e)),h|=this.computeVisibleRanges(),this.mustEnforceCursorAssoc&&(this.mustEnforceCursorAssoc=!1,e.docView.enforceCursorAssoc()),h}get visibleTop(){return this.scaler.fromDOM(this.pixelViewport.top)}get visibleBottom(){return this.scaler.fromDOM(this.pixelViewport.bottom)}getViewport(e,i){let s=.5-Math.max(-.5,Math.min(.5,e/1e3/2)),r=this.heightMap,n=this.heightOracle,{visibleTop:o,visibleBottom:a}=this,l=new qr(r.lineAt(o-s*1e3,ce.ByHeight,n,0,0).from,r.lineAt(a+(1-s)*1e3,ce.ByHeight,n,0,0).to);if(i){let{head:h}=i.range;if(h<l.from||h>l.to){let c=Math.min(this.editorHeight,this.pixelViewport.bottom-this.pixelViewport.top),d=r.lineAt(h,ce.ByPos,n,0,0),u;i.y=="center"?u=(d.top+d.bottom)/2-c/2:i.y=="start"||i.y=="nearest"&&h<l.from?u=d.top:u=d.bottom-c,l=new qr(r.lineAt(u-1e3/2,ce.ByHeight,n,0,0).from,r.lineAt(u+c+1e3/2,ce.ByHeight,n,0,0).to)}}return l}mapViewport(e,i){let s=i.mapPos(e.from,-1),r=i.mapPos(e.to,1);return new qr(this.heightMap.lineAt(s,ce.ByPos,this.heightOracle,0,0).from,this.heightMap.lineAt(r,ce.ByPos,this.heightOracle,0,0).to)}viewportIsAppropriate({from:e,to:i},s=0){if(!this.inView)return!0;let{top:r}=this.heightMap.lineAt(e,ce.ByPos,this.heightOracle,0,0),{bottom:n}=this.heightMap.lineAt(i,ce.ByPos,this.heightOracle,0,0),{visibleTop:o,visibleBottom:a}=this;return(e==0||r<=o-Math.max(10,Math.min(-s,250)))&&(i==this.state.doc.length||n>=a+Math.max(10,Math.min(s,250)))&&r>o-2*1e3&&n<a+2*1e3}mapLineGaps(e,i){if(!e.length||i.empty)return e;let s=[];for(let r of e)i.touchesRange(r.from,r.to)||s.push(new Uo(i.mapPos(r.from),i.mapPos(r.to),r.size,r.displaySize));return s}ensureLineGaps(e,i){let s=this.heightOracle.lineWrapping,r=s?1e4:2e3,n=r>>1,o=r<<1;if(this.defaultTextDirection!=ae.LTR&&!s)return[];let a=[],l=(c,d,u,f)=>{if(d-c<n)return;let g=this.state.selection.main,m=[g.from];g.empty||m.push(g.to);for(let w of m)if(w>c&&w<d){l(c,w-10,u,f),l(w+10,d,u,f);return}let y=$v(e,w=>w.from>=u.from&&w.to<=u.to&&Math.abs(w.from-c)<n&&Math.abs(w.to-d)<n&&!m.some(x=>w.from<x&&w.to>x));if(!y){if(d<u.to&&i&&s&&i.visibleRanges.some(O=>O.from<=d&&O.to>=d)){let O=i.moveToLineBoundary($.cursor(d),!1,!0).head;O>c&&(d=O)}let w=this.gapSize(u,c,d,f),x=s||w<2e6?w:2e6;y=new Uo(c,d,w,x)}a.push(y)},h=c=>{if(c.length<o||c.type!=Te.Text)return;let d=Cv(c.from,c.to,this.stateDeco);if(d.total<o)return;let u=this.scrollTarget?this.scrollTarget.range.head:null,f,g;if(s){let m=r/this.heightOracle.lineLength*this.heightOracle.lineHeight,y,w;if(u!=null){let x=jr(d,u),O=((this.visibleBottom-this.visibleTop)/2+m)/c.height;y=x-O,w=x+O}else y=(this.visibleTop-c.top-m)/c.height,w=(this.visibleBottom-c.top+m)/c.height;f=Vr(d,y),g=Vr(d,w)}else{let m=d.total*this.heightOracle.charWidth,y=r*this.heightOracle.charWidth,w=0;if(m>2e6)for(let P of e)P.from>=c.from&&P.from<c.to&&P.size!=P.displaySize&&P.from*this.heightOracle.charWidth+w<this.pixelViewport.left&&(w=P.size-P.displaySize);let x=this.pixelViewport.left+w,O=this.pixelViewport.right+w,D,A;if(u!=null){let P=jr(d,u),T=((O-x)/2+y)/m;D=P-T,A=P+T}else D=(x-y)/m,A=(O+y)/m;f=Vr(d,D),g=Vr(d,A)}f>c.from&&l(c.from,f,c,d),g<c.to&&l(g,c.to,c,d)};for(let c of this.viewportLines)Array.isArray(c.type)?c.type.forEach(h):h(c);return a}gapSize(e,i,s,r){let n=jr(r,s)-jr(r,i);return this.heightOracle.lineWrapping?e.height*n:r.total*this.heightOracle.charWidth*n}updateLineGaps(e){Uo.same(e,this.lineGaps)||(this.lineGaps=e,this.lineGapDeco=U.set(e.map(i=>i.draw(this,this.heightOracle.lineWrapping))))}computeVisibleRanges(e){let i=this.stateDeco;this.lineGaps.length&&(i=i.concat(this.lineGapDeco));let s=[];Q.spans(i,this.viewport.from,this.viewport.to,{span(n,o){s.push({from:n,to:o})},point(){}},20);let r=0;if(s.length!=this.visibleRanges.length)r=12;else for(let n=0;n<s.length&&!(r&8);n++){let o=this.visibleRanges[n],a=s[n];(o.from!=a.from||o.to!=a.to)&&(r|=4,e&&e.mapPos(o.from,-1)==a.from&&e.mapPos(o.to,1)==a.to||(r|=8))}return this.visibleRanges=s,r}lineBlockAt(e){return e>=this.viewport.from&&e<=this.viewport.to&&this.viewportLines.find(i=>i.from<=e&&i.to>=e)||qs(this.heightMap.lineAt(e,ce.ByPos,this.heightOracle,0,0),this.scaler)}lineBlockAtHeight(e){return e>=this.viewportLines[0].top&&e<=this.viewportLines[this.viewportLines.length-1].bottom&&this.viewportLines.find(i=>i.top<=e&&i.bottom>=e)||qs(this.heightMap.lineAt(this.scaler.fromDOM(e),ce.ByHeight,this.heightOracle,0,0),this.scaler)}getScrollOffset(){return(this.scrollParent==this.view.scrollDOM?this.scrollParent.scrollTop:(this.scrollParent?this.scrollParent.getBoundingClientRect().top:0)-this.view.contentDOM.getBoundingClientRect().top)*this.scaleY}scrollAnchorAt(e){let i=this.lineBlockAtHeight(e+8);return i.from>=this.viewport.from||this.viewportLines[0].top-e>200?i:this.viewportLines[0]}elementAtHeight(e){return qs(this.heightMap.blockAt(this.scaler.fromDOM(e),this.heightOracle,0,0),this.scaler)}get docHeight(){return this.scaler.toDOM(this.heightMap.height)}get contentHeight(){return this.docHeight+this.paddingTop+this.paddingBottom}}class qr{constructor(e,i){this.from=e,this.to=i}}function Cv(t,e,i){let s=[],r=t,n=0;return Q.spans(i,t,e,{span(){},point(o,a){o>r&&(s.push({from:r,to:o}),n+=o-r),r=a}},20),r<e&&(s.push({from:r,to:e}),n+=e-r),{total:n,ranges:s}}function Vr({total:t,ranges:e},i){if(i<=0)return e[0].from;if(i>=1)return e[e.length-1].to;let s=Math.floor(t*i);for(let r=0;;r++){let{from:n,to:o}=e[r],a=o-n;if(s<=a)return n+s;s-=a}}function jr(t,e){let i=0;for(let{from:s,to:r}of t.ranges){if(e<=r){i+=e-s;break}i+=r-s}return i/t.total}function $v(t,e){for(let i of t)if(e(i))return i}const hc={toDOM(t){return t},fromDOM(t){return t},scale:1,eq(t){return t==this}};function cc(t){let e=t.facet(lo).filter(s=>typeof s!="function"),i=t.facet(Bl).filter(s=>typeof s!="function");return i.length&&e.push(Q.join(i)),e}class Fl{constructor(e,i,s){let r=0,n=0,o=0;this.viewports=s.map(({from:a,to:l})=>{let h=i.lineAt(a,ce.ByPos,e,0,0).top,c=i.lineAt(l,ce.ByPos,e,0,0).bottom;return r+=c-h,{from:a,to:l,top:h,bottom:c,domTop:0,domBottom:0}}),this.scale=(7e6-r)/(i.height-r);for(let a of this.viewports)a.domTop=o+(a.top-n)*this.scale,o=a.domBottom=a.domTop+(a.bottom-a.top),n=a.bottom}toDOM(e){for(let i=0,s=0,r=0;;i++){let n=i<this.viewports.length?this.viewports[i]:null;if(!n||e<n.top)return r+(e-s)*this.scale;if(e<=n.bottom)return n.domTop+(e-n.top);s=n.bottom,r=n.domBottom}}fromDOM(e){for(let i=0,s=0,r=0;;i++){let n=i<this.viewports.length?this.viewports[i]:null;if(!n||e<n.domTop)return s+(e-r)/this.scale;if(e<=n.domBottom)return n.top+(e-n.domTop);s=n.bottom,r=n.domBottom}}eq(e){return e instanceof Fl?this.scale==e.scale&&this.viewports.length==e.viewports.length&&this.viewports.every((i,s)=>i.from==e.viewports[s].from&&i.to==e.viewports[s].to):!1}}function qs(t,e){if(e.scale==1)return t;let i=e.toDOM(t.top),s=e.toDOM(t.bottom);return new mt(t.from,t.length,i,s-i,Array.isArray(t._content)?t._content.map(r=>qs(r,e)):t._content)}const Qr=R.define({combine:t=>t.join(" ")}),Ha=R.define({combine:t=>t.indexOf(!0)>-1}),Wa=pi.newName(),rf=pi.newName(),nf=pi.newName(),of={"&light":"."+rf,"&dark":"."+nf};function za(t,e,i){return new pi(e,{finish(s){return/&/.test(s)?s.replace(/&\w*/,r=>{if(r=="&")return t;if(!i||!i[r])throw new RangeError(`Unsupported selector: ${r}`);return i[r]}):t+" "+s}})}const Ov=za("."+Wa,{"&":{position:"relative !important",boxSizing:"border-box","&.cm-focused":{outline:"1px dotted #212121"},display:"flex !important",flexDirection:"column"},".cm-scroller":{display:"flex !important",alignItems:"flex-start !important",fontFamily:"monospace",lineHeight:1.4,height:"100%",overflowX:"auto",position:"relative",zIndex:0,overflowAnchor:"none"},".cm-content":{margin:0,flexGrow:2,flexShrink:0,display:"block",whiteSpace:"pre",wordWrap:"normal",boxSizing:"border-box",minHeight:"100%",padding:"4px 0",outline:"none","&[contenteditable=true]":{WebkitUserModify:"read-write-plaintext-only"}},".cm-lineWrapping":{whiteSpace_fallback:"pre-wrap",whiteSpace:"break-spaces",wordBreak:"break-word",overflowWrap:"anywhere",flexShrink:1},"&light .cm-content":{caretColor:"black"},"&dark .cm-content":{caretColor:"white"},".cm-line":{display:"block",padding:"0 2px 0 6px"},".cm-layer":{position:"absolute",left:0,top:0,contain:"size style","& > *":{position:"absolute"}},"&light .cm-selectionBackground":{background:"#d9d9d9"},"&dark .cm-selectionBackground":{background:"#222"},"&light.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground":{background:"#d7d4f0"},"&dark.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground":{background:"#233"},".cm-cursorLayer":{pointerEvents:"none"},"&.cm-focused > .cm-scroller > .cm-cursorLayer":{animation:"steps(1) cm-blink 1.2s infinite"},"@keyframes cm-blink":{"0%":{},"50%":{opacity:0},"100%":{}},"@keyframes cm-blink2":{"0%":{},"50%":{opacity:0},"100%":{}},".cm-cursor, .cm-dropCursor":{borderLeft:"1.2px solid black",marginLeft:"-0.6px",pointerEvents:"none"},".cm-cursor":{display:"none"},"&dark .cm-cursor":{borderLeftColor:"#ddd"},".cm-selectionHandle":{backgroundColor:"currentColor",width:"1.5px"},".cm-selectionHandle-start::before, .cm-selectionHandle-end::before":{content:'""',backgroundColor:"inherit",borderRadius:"50%",width:"8px",height:"8px",position:"absolute",left:"-3.25px"},".cm-selectionHandle-start::before":{top:"-8px"},".cm-selectionHandle-end::before":{bottom:"-8px"},".cm-dropCursor":{position:"absolute"},"&.cm-focused > .cm-scroller > .cm-cursorLayer .cm-cursor":{display:"block"},".cm-iso":{unicodeBidi:"isolate"},".cm-announced":{position:"fixed",top:"-10000px"},"@media print":{".cm-announced":{display:"none"}},"&light .cm-activeLine":{backgroundColor:"#cceeff44"},"&dark .cm-activeLine":{backgroundColor:"#99eeff33"},"&light .cm-specialChar":{color:"red"},"&dark .cm-specialChar":{color:"#f78"},".cm-gutters":{flexShrink:0,display:"flex",height:"100%",boxSizing:"border-box",zIndex:200},".cm-gutters-before":{insetInlineStart:0},".cm-gutters-after":{insetInlineEnd:0},"&light .cm-gutters":{backgroundColor:"#f5f5f5",color:"#6c6c6c",border:"0px solid #ddd","&.cm-gutters-before":{borderRightWidth:"1px"},"&.cm-gutters-after":{borderLeftWidth:"1px"}},"&dark .cm-gutters":{backgroundColor:"#333338",color:"#ccc"},".cm-gutter":{display:"flex !important",flexDirection:"column",flexShrink:0,boxSizing:"border-box",minHeight:"100%",overflow:"hidden"},".cm-gutterElement":{boxSizing:"border-box"},".cm-lineNumbers .cm-gutterElement":{padding:"0 3px 0 5px",minWidth:"20px",textAlign:"right",whiteSpace:"nowrap"},"&light .cm-activeLineGutter":{backgroundColor:"#e2f2ff"},"&dark .cm-activeLineGutter":{backgroundColor:"#222227"},".cm-panels":{boxSizing:"border-box",position:"sticky",left:0,right:0,zIndex:300},"&light .cm-panels":{backgroundColor:"#f5f5f5",color:"black"},"&light .cm-panels-top":{borderBottom:"1px solid #ddd"},"&light .cm-panels-bottom":{borderTop:"1px solid #ddd"},"&dark .cm-panels":{backgroundColor:"#333338",color:"white"},".cm-dialog":{padding:"2px 19px 4px 6px",position:"relative","& label":{fontSize:"80%"}},".cm-dialog-close":{position:"absolute",top:"3px",right:"4px",backgroundColor:"inherit",border:"none",font:"inherit",fontSize:"14px",padding:"0"},".cm-tab":{display:"inline-block",overflow:"hidden",verticalAlign:"bottom"},".cm-widgetBuffer":{verticalAlign:"text-top",height:"1em",width:0,display:"inline"},".cm-placeholder":{color:"#888",display:"inline-block",verticalAlign:"top",userSelect:"none"},".cm-highlightSpace":{backgroundImage:"radial-gradient(circle at 50% 55%, #aaa 20%, transparent 5%)",backgroundPosition:"center"},".cm-highlightTab":{backgroundImage:`url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="20"><path stroke="%23888" stroke-width="1" fill="none" d="M1 10H196L190 5M190 15L196 10M197 4L197 16"/></svg>')`,backgroundSize:"auto 100%",backgroundPosition:"right 90%",backgroundRepeat:"no-repeat"},".cm-trailingSpace":{backgroundColor:"#ff332255"},".cm-button":{verticalAlign:"middle",color:"inherit",fontSize:"70%",padding:".2em 1em",borderRadius:"1px"},"&light .cm-button":{backgroundImage:"linear-gradient(#eff1f5, #d9d9df)",border:"1px solid #888","&:active":{backgroundImage:"linear-gradient(#b4b4b4, #d0d3d6)"}},"&dark .cm-button":{backgroundImage:"linear-gradient(#393939, #111)",border:"1px solid #888","&:active":{backgroundImage:"linear-gradient(#111, #333)"}},".cm-textfield":{verticalAlign:"middle",color:"inherit",fontSize:"70%",border:"1px solid silver",padding:".2em .5em"},"&light .cm-textfield":{backgroundColor:"white"},"&dark .cm-textfield":{border:"1px solid #555",backgroundColor:"inherit"}},of),Av={childList:!0,characterData:!0,subtree:!0,attributes:!0,characterDataOldValue:!0},Ho=B.ie&&B.ie_version<=11;class Pv{constructor(e){this.view=e,this.active=!1,this.editContext=null,this.selectionRange=new rb,this.selectionChanged=!1,this.delayedFlush=-1,this.resizeTimeout=-1,this.queue=[],this.delayedAndroidKey=null,this.flushingAndroidKey=-1,this.lastChange=0,this.scrollTargets=[],this.intersection=null,this.resizeScroll=null,this.intersecting=!1,this.gapIntersection=null,this.gaps=[],this.printQuery=null,this.parentCheck=-1,this.dom=e.contentDOM,this.observer=new MutationObserver(i=>{for(let s of i)this.queue.push(s);(B.ie&&B.ie_version<=11||B.ios&&e.composing)&&i.some(s=>s.type=="childList"&&s.removedNodes.length||s.type=="characterData"&&s.oldValue.length>s.target.nodeValue.length)?this.flushSoon():this.flush()}),window.EditContext&&B.android&&e.constructor.EDIT_CONTEXT!==!1&&!(B.chrome&&B.chrome_version<126)&&(this.editContext=new Mv(e),e.state.facet(Qt)&&(e.contentDOM.editContext=this.editContext.editContext)),Ho&&(this.onCharData=i=>{this.queue.push({target:i.target,type:"characterData",oldValue:i.prevValue}),this.flushSoon()}),this.onSelectionChange=this.onSelectionChange.bind(this),this.onResize=this.onResize.bind(this),this.onPrint=this.onPrint.bind(this),this.onScroll=this.onScroll.bind(this),window.matchMedia&&(this.printQuery=window.matchMedia("print")),typeof ResizeObserver=="function"&&(this.resizeScroll=new ResizeObserver(()=>{var i;((i=this.view.docView)===null||i===void 0?void 0:i.lastUpdate)<Date.now()-75&&this.onResize()}),this.resizeScroll.observe(e.scrollDOM)),this.addWindowListeners(this.win=e.win),this.start(),typeof IntersectionObserver=="function"&&(this.intersection=new IntersectionObserver(i=>{this.parentCheck<0&&(this.parentCheck=setTimeout(this.listenForScroll.bind(this),1e3)),i.length>0&&i[i.length-1].intersectionRatio>0!=this.intersecting&&(this.intersecting=!this.intersecting,this.intersecting!=this.view.inView&&this.onScrollChanged(document.createEvent("Event")))},{threshold:[0,.001]}),this.intersection.observe(this.dom),this.gapIntersection=new IntersectionObserver(i=>{i.length>0&&i[i.length-1].intersectionRatio>0&&this.onScrollChanged(document.createEvent("Event"))},{})),this.listenForScroll(),this.readSelectionRange()}onScrollChanged(e){this.view.inputState.runHandlers("scroll",e),this.intersecting&&this.view.measure()}onScroll(e){this.intersecting&&this.flush(!1),this.editContext&&this.view.requestMeasure(this.editContext.measureReq),this.onScrollChanged(e)}onResize(){this.resizeTimeout<0&&(this.resizeTimeout=setTimeout(()=>{this.resizeTimeout=-1,this.view.requestMeasure()},50))}onPrint(e){(e.type=="change"||!e.type)&&!e.matches||(this.view.viewState.printing=!0,this.view.measure(),setTimeout(()=>{this.view.viewState.printing=!1,this.view.requestMeasure()},500))}updateGaps(e){if(this.gapIntersection&&(e.length!=this.gaps.length||this.gaps.some((i,s)=>i!=e[s]))){this.gapIntersection.disconnect();for(let i of e)this.gapIntersection.observe(i);this.gaps=e}}onSelectionChange(e){let i=this.selectionChanged;if(!this.readSelectionRange()||this.delayedAndroidKey)return;let{view:s}=this,r=this.selectionRange;if(s.state.facet(Qt)?s.root.activeElement!=this.dom:!Ys(this.dom,r))return;let n=r.anchorNode&&s.docView.tile.nearest(r.anchorNode);if(n&&n.isWidget()&&n.widget.ignoreEvent(e)){i||(this.selectionChanged=!1);return}(B.ie&&B.ie_version<=11||B.android&&B.chrome)&&!s.state.selection.main.empty&&r.focusNode&&Gs(r.focusNode,r.focusOffset,r.anchorNode,r.anchorOffset)?this.flushSoon():this.flush(!1)}readSelectionRange(){let{view:e}=this,i=ur(e.root);if(!i)return!1;let s=B.safari&&e.root.nodeType==11&&e.root.activeElement==this.dom&&Tv(this.view,i)||i;if(!s||this.selectionRange.eq(s))return!1;let r=Ys(this.dom,s);return r&&!this.selectionChanged&&e.inputState.lastFocusTime>Date.now()-200&&e.inputState.lastTouchTime<Date.now()-300&&ob(this.dom,s)?(this.view.inputState.lastFocusTime=0,e.docView.updateSelection(),!1):(this.selectionRange.setRange(s),r&&(this.selectionChanged=!0),!0)}setSelectionRange(e,i){this.selectionRange.set(e.node,e.offset,i.node,i.offset),this.selectionChanged=!1}clearSelectionRange(){this.selectionRange.set(null,0,null,0)}listenForScroll(){this.parentCheck=-1;let e=0,i=null;for(let s=this.dom;s;)if(s.nodeType==1)!i&&e<this.scrollTargets.length&&this.scrollTargets[e]==s?e++:i||(i=this.scrollTargets.slice(0,e)),i&&i.push(s),s=s.assignedSlot||s.parentNode;else if(s.nodeType==11)s=s.host;else break;if(e<this.scrollTargets.length&&!i&&(i=this.scrollTargets.slice(0,e)),i){for(let s of this.scrollTargets)s.removeEventListener("scroll",this.onScroll);for(let s of this.scrollTargets=i)s.addEventListener("scroll",this.onScroll)}}ignore(e){if(!this.active)return e();try{return this.stop(),e()}finally{this.start(),this.clear()}}start(){this.active||(this.observer.observe(this.dom,Av),Ho&&this.dom.addEventListener("DOMCharacterDataModified",this.onCharData),this.active=!0)}stop(){this.active&&(this.active=!1,this.observer.disconnect(),Ho&&this.dom.removeEventListener("DOMCharacterDataModified",this.onCharData))}clear(){this.processRecords(),this.queue.length=0,this.selectionChanged=!1}delayAndroidKey(e,i){var s;if(!this.delayedAndroidKey){let r=()=>{let n=this.delayedAndroidKey;n&&(this.clearDelayedAndroidKey(),this.view.inputState.lastKeyCode=n.keyCode,this.view.inputState.lastKeyTime=Date.now(),!this.flush()&&n.force&&gs(this.dom,n.key,n.keyCode))};this.flushingAndroidKey=this.view.win.requestAnimationFrame(r)}(!this.delayedAndroidKey||e=="Enter")&&(this.delayedAndroidKey={key:e,keyCode:i,force:this.lastChange<Date.now()-50||!!(!((s=this.delayedAndroidKey)===null||s===void 0)&&s.force)})}clearDelayedAndroidKey(){this.win.cancelAnimationFrame(this.flushingAndroidKey),this.delayedAndroidKey=null,this.flushingAndroidKey=-1}flushSoon(){this.delayedFlush<0&&(this.delayedFlush=this.view.win.requestAnimationFrame(()=>{this.delayedFlush=-1,this.flush()}))}forceFlush(){this.delayedFlush>=0&&(this.view.win.cancelAnimationFrame(this.delayedFlush),this.delayedFlush=-1),this.flush()}pendingRecords(){for(let e of this.observer.takeRecords())this.queue.push(e);return this.queue}processRecords(){let e=this.pendingRecords();e.length&&(this.queue=[]);let i=-1,s=-1,r=!1;for(let n of e){let o=this.readMutation(n);o&&(o.typeOver&&(r=!0),i==-1?{from:i,to:s}=o:(i=Math.min(o.from,i),s=Math.max(o.to,s)))}return{from:i,to:s,typeOver:r}}readChange(){let{from:e,to:i,typeOver:s}=this.processRecords(),r=this.selectionChanged&&Ys(this.dom,this.selectionRange);if(e<0&&!r)return null;e>-1&&(this.lastChange=Date.now()),this.view.inputState.lastFocusTime=0,this.selectionChanged=!1;let n=new Qb(this.view,e,i,s);return this.view.docView.domChanged={newSel:n.newSel?n.newSel.main:null},n}flush(e=!0){if(this.delayedFlush>=0||this.delayedAndroidKey)return!1;e&&this.readSelectionRange();let i=this.readChange();if(!i)return this.view.requestMeasure(),!1;let s=this.view.state,r=ju(this.view,i);return this.view.state==s&&(i.domChanged||i.newSel&&!Dn(this.view.state.selection,i.newSel.main))&&this.view.update([]),r}readMutation(e){let i=this.view.docView.tile.nearest(e.target);if(!i||i.isWidget())return null;if(i.markDirty(e.type=="attributes"),e.type=="childList"){let s=dc(i,e.previousSibling||e.target.previousSibling,-1),r=dc(i,e.nextSibling||e.target.nextSibling,1);return{from:s?i.posAfter(s):i.posAtStart,to:r?i.posBefore(r):i.posAtEnd,typeOver:!1}}else return e.type=="characterData"?{from:i.posAtStart,to:i.posAtEnd,typeOver:e.target.nodeValue==e.oldValue}:null}setWindow(e){e!=this.win&&(this.removeWindowListeners(this.win),this.win=e,this.addWindowListeners(this.win))}addWindowListeners(e){e.addEventListener("resize",this.onResize),this.printQuery?this.printQuery.addEventListener?this.printQuery.addEventListener("change",this.onPrint):this.printQuery.addListener(this.onPrint):e.addEventListener("beforeprint",this.onPrint),e.addEventListener("scroll",this.onScroll),e.document.addEventListener("selectionchange",this.onSelectionChange)}removeWindowListeners(e){e.removeEventListener("scroll",this.onScroll),e.removeEventListener("resize",this.onResize),this.printQuery?this.printQuery.removeEventListener?this.printQuery.removeEventListener("change",this.onPrint):this.printQuery.removeListener(this.onPrint):e.removeEventListener("beforeprint",this.onPrint),e.document.removeEventListener("selectionchange",this.onSelectionChange)}update(e){this.editContext&&(this.editContext.update(e),e.startState.facet(Qt)!=e.state.facet(Qt)&&(e.view.contentDOM.editContext=e.state.facet(Qt)?this.editContext.editContext:null))}destroy(){var e,i,s;this.stop(),(e=this.intersection)===null||e===void 0||e.disconnect(),(i=this.gapIntersection)===null||i===void 0||i.disconnect(),(s=this.resizeScroll)===null||s===void 0||s.disconnect();for(let r of this.scrollTargets)r.removeEventListener("scroll",this.onScroll);this.removeWindowListeners(this.win),clearTimeout(this.parentCheck),clearTimeout(this.resizeTimeout),this.win.cancelAnimationFrame(this.delayedFlush),this.win.cancelAnimationFrame(this.flushingAndroidKey),this.editContext&&(this.view.contentDOM.editContext=null,this.editContext.destroy())}}function dc(t,e,i){for(;e;){let s=me.get(e);if(s&&s.parent==t)return s;let r=e.parentNode;e=r!=t.dom?r:i>0?e.nextSibling:e.previousSibling}return null}function uc(t,e){let i=e.startContainer,s=e.startOffset,r=e.endContainer,n=e.endOffset,o=t.docView.domAtPos(t.state.selection.main.anchor,1);return Gs(o.node,o.offset,r,n)&&([i,s,r,n]=[r,n,i,s]),{anchorNode:i,anchorOffset:s,focusNode:r,focusOffset:n}}function Tv(t,e){if(e.getComposedRanges){let r=e.getComposedRanges(t.root)[0];if(r)return uc(t,r)}let i=null;function s(r){r.preventDefault(),r.stopImmediatePropagation(),i=r.getTargetRanges()[0]}return t.contentDOM.addEventListener("beforeinput",s,!0),t.dom.ownerDocument.execCommand("indent"),t.contentDOM.removeEventListener("beforeinput",s,!0),i?uc(t,i):null}class Mv{constructor(e){this.from=0,this.to=0,this.pendingContextChange=null,this.handlers=Object.create(null),this.composing=null,this.resetRange(e.state);let i=this.editContext=new window.EditContext({text:e.state.doc.sliceString(this.from,this.to),selectionStart:this.toContextPos(Math.max(this.from,Math.min(this.to,e.state.selection.main.anchor))),selectionEnd:this.toContextPos(e.state.selection.main.head)});this.handlers.textupdate=s=>{let r=e.state.selection.main,{anchor:n,head:o}=r,a=this.toEditorPos(s.updateRangeStart),l=this.toEditorPos(s.updateRangeEnd);e.inputState.composing>=0&&!this.composing&&(this.composing={contextBase:s.updateRangeStart,editorBase:a,drifted:!1});let h=l-a>s.text.length;a==this.from&&n<this.from?a=n:l==this.to&&n>this.to&&(l=n);let c=Qu(e.state.sliceDoc(a,l),s.text,(h?r.from:r.to)-a,h?"end":null);if(!c){let u=$.single(this.toEditorPos(s.selectionStart),this.toEditorPos(s.selectionEnd));Dn(u,r)||e.dispatch({selection:u,userEvent:"select"});return}let d={from:c.from+a,to:c.toA+a,insert:Y.of(s.text.slice(c.from,c.toB).split(`
`))};if((B.mac||B.android)&&d.from==o-1&&/^\. ?$/.test(s.text)&&e.contentDOM.getAttribute("autocorrect")=="off"&&(d={from:a,to:l,insert:Y.of([s.text.replace("."," ")])}),this.pendingContextChange=d,!e.state.readOnly){let u=this.to-this.from+(d.to-d.from+d.insert.length);Ll(e,d,$.single(this.toEditorPos(s.selectionStart,u),this.toEditorPos(s.selectionEnd,u)))}this.pendingContextChange&&(this.revertPending(e.state),this.setSelection(e.state)),d.from<d.to&&!d.insert.length&&e.inputState.composing>=0&&!/[\\p{Alphabetic}\\p{Number}_]/.test(i.text.slice(Math.max(0,s.updateRangeStart-1),Math.min(i.text.length,s.updateRangeStart+1)))&&this.handlers.compositionend(s)},this.handlers.characterboundsupdate=s=>{let r=[],n=null;for(let o=this.toEditorPos(s.rangeStart),a=this.toEditorPos(s.rangeEnd);o<a;o++){let l=e.coordsForChar(o);n=l&&new DOMRect(l.left,l.top,l.right-l.left,l.bottom-l.top)||n||new DOMRect,r.push(n)}i.updateCharacterBounds(s.rangeStart,r)},this.handlers.textformatupdate=s=>{let r=[];for(let n of s.getTextFormats()){let o=n.underlineStyle,a=n.underlineThickness;if(!/none/i.test(o)&&!/none/i.test(a)){let l=this.toEditorPos(n.rangeStart),h=this.toEditorPos(n.rangeEnd);if(l<h){let c=`text-decoration: underline ${/^[a-z]/.test(o)?o+" ":o=="Dashed"?"dashed ":o=="Squiggle"?"wavy ":""}${/thin/i.test(a)?1:2}px`;r.push(U.mark({attributes:{style:c}}).range(l,h))}}}e.dispatch({effects:Iu.of(U.set(r))})},this.handlers.compositionstart=()=>{e.inputState.composing<0&&(e.inputState.composing=0,e.inputState.compositionFirstChange=!0)},this.handlers.compositionend=()=>{if(e.inputState.composing=-1,e.inputState.compositionFirstChange=null,this.composing){let{drifted:s}=this.composing;this.composing=null,s&&this.reset(e.state)}};for(let s in this.handlers)i.addEventListener(s,this.handlers[s]);this.measureReq={read:s=>{this.editContext.updateControlBounds(s.contentDOM.getBoundingClientRect());let r=ur(s.root);r&&r.rangeCount&&this.editContext.updateSelectionBounds(r.getRangeAt(0).getBoundingClientRect())}}}applyEdits(e){let i=0,s=!1,r=this.pendingContextChange;return e.changes.iterChanges((n,o,a,l,h)=>{if(s)return;let c=h.length-(o-n);if(r&&o>=r.to)if(r.from==n&&r.to==o&&r.insert.eq(h)){r=this.pendingContextChange=null,i+=c,this.to+=c;return}else r=null,this.revertPending(e.state);if(n+=i,o+=i,o<=this.from)this.from+=c,this.to+=c;else if(n<this.to){if(n<this.from||o>this.to||this.to-this.from+h.length>3e4){s=!0;return}this.editContext.updateText(this.toContextPos(n),this.toContextPos(o),h.toString()),this.to+=c}i+=c}),r&&!s&&this.revertPending(e.state),!s}update(e){let i=this.pendingContextChange,s=e.startState.selection.main;this.composing&&(this.composing.drifted||!e.changes.touchesRange(s.from,s.to)&&e.transactions.some(r=>!r.isUserEvent("input.type")&&r.changes.touchesRange(this.from,this.to)))?(this.composing.drifted=!0,this.composing.editorBase=e.changes.mapPos(this.composing.editorBase)):!this.applyEdits(e)||!this.rangeIsValid(e.state)?(this.pendingContextChange=null,this.reset(e.state)):(e.docChanged||e.selectionSet||i)&&this.setSelection(e.state),(e.geometryChanged||e.docChanged||e.selectionSet)&&e.view.requestMeasure(this.measureReq)}resetRange(e){let{head:i}=e.selection.main;this.from=Math.max(0,i-1e4),this.to=Math.min(e.doc.length,i+1e4)}reset(e){this.resetRange(e),this.editContext.updateText(0,this.editContext.text.length,e.doc.sliceString(this.from,this.to)),this.setSelection(e)}revertPending(e){let i=this.pendingContextChange;this.pendingContextChange=null,this.editContext.updateText(this.toContextPos(i.from),this.toContextPos(i.from+i.insert.length),e.doc.sliceString(i.from,i.to))}setSelection(e){let{main:i}=e.selection,s=this.toContextPos(Math.max(this.from,Math.min(this.to,i.anchor))),r=this.toContextPos(i.head);(this.editContext.selectionStart!=s||this.editContext.selectionEnd!=r)&&this.editContext.updateSelection(s,r)}rangeIsValid(e){let{head:i}=e.selection.main;return!(this.from>0&&i-this.from<500||this.to<e.doc.length&&this.to-i<500||this.to-this.from>1e4*3)}toEditorPos(e,i=this.to-this.from){e=Math.min(e,i);let s=this.composing;return s&&s.drifted?s.editorBase+(e-s.contextBase):e+this.from}toContextPos(e){let i=this.composing;return i&&i.drifted?i.contextBase+(e-i.editorBase):e-this.from}destroy(){for(let e in this.handlers)this.editContext.removeEventListener(e,this.handlers[e])}}class L{get state(){return this.viewState.state}get viewport(){return this.viewState.viewport}get visibleRanges(){return this.viewState.visibleRanges}get inView(){return this.viewState.inView}get composing(){return!!this.inputState&&this.inputState.composing>0}get compositionStarted(){return!!this.inputState&&this.inputState.composing>=0}get root(){return this._root}get win(){return this.dom.ownerDocument.defaultView||window}constructor(e={}){var i;this.plugins=[],this.pluginMap=new Map,this.editorAttrs={},this.contentAttrs={},this.bidiCache=[],this.destroyed=!1,this.updateState=2,this.measureScheduled=-1,this.measureRequests=[],this.contentDOM=document.createElement("div"),this.scrollDOM=document.createElement("div"),this.scrollDOM.tabIndex=-1,this.scrollDOM.className="cm-scroller",this.scrollDOM.appendChild(this.contentDOM),this.announceDOM=document.createElement("div"),this.announceDOM.className="cm-announced",this.announceDOM.setAttribute("aria-live","polite"),this.dom=document.createElement("div"),this.dom.appendChild(this.announceDOM),this.dom.appendChild(this.scrollDOM),e.parent&&e.parent.appendChild(this.dom);let{dispatch:s}=e;this.dispatchTransactions=e.dispatchTransactions||s&&(r=>r.forEach(n=>s(n,this)))||(r=>this.update(r)),this.dispatch=this.dispatch.bind(this),this._root=e.root||nb(e.parent)||document,this.viewState=new lc(this,e.state||J.create(e)),e.scrollTo&&e.scrollTo.is(Hr)&&(this.viewState.scrollTarget=e.scrollTo.value.clip(this.viewState.state)),this.plugins=this.state.facet(os).map(r=>new Ro(r));for(let r of this.plugins)r.update(this);this.observer=new Pv(this),this.inputState=new Yb(this),this.inputState.ensureHandlers(this.plugins),this.docView=new Xh(this),this.mountStyles(),this.updateAttrs(),this.updateState=0,this.requestMeasure(),!((i=document.fonts)===null||i===void 0)&&i.ready&&document.fonts.ready.then(()=>{this.viewState.mustMeasureContent="refresh",this.requestMeasure()})}dispatch(...e){let i=e.length==1&&e[0]instanceof ke?e:e.length==1&&Array.isArray(e[0])?e[0]:[this.state.update(...e)];this.dispatchTransactions(i,this)}update(e){if(this.updateState!=0)throw new Error("Calls to EditorView.update are not allowed while an update is in progress");let i=!1,s=!1,r,n=this.state;for(let u of e){if(u.startState!=n)throw new RangeError("Trying to update state with a transaction that doesn't start from the previous state.");n=u.state}if(this.destroyed){this.viewState.state=n;return}let o=this.hasFocus,a=0,l=null;e.some(u=>u.annotation(Zu))?(this.inputState.notifiedFocused=o,a=1):o!=this.inputState.notifiedFocused&&(this.inputState.notifiedFocused=o,l=ef(n,o),l||(a=1));let h=this.observer.delayedAndroidKey,c=null;if(h?(this.observer.clearDelayedAndroidKey(),c=this.observer.readChange(),(c&&!this.state.doc.eq(n.doc)||!this.state.selection.eq(n.selection))&&(c=null)):this.observer.clear(),n.facet(J.phrases)!=this.state.facet(J.phrases))return this.setState(n);r=Mn.create(this,n,e),r.flags|=a;let d=this.viewState.scrollTarget;try{this.updateState=2;for(let u of e){if(d&&(d=d.map(u.changes)),u.scrollIntoView){let{main:f}=u.state.selection,{x:g,y:m}=this.state.facet(L.cursorScrollMargin);d=new ms(f.empty?f:$.cursor(f.head,f.head>f.anchor?-1:1),"nearest","nearest",m,g)}for(let f of u.effects)f.is(Hr)&&(d=f.value.clip(this.state))}this.viewState.update(r,d),this.bidiCache=Rn.update(this.bidiCache,r.changes),r.empty||(this.updatePlugins(r),this.inputState.update(r)),i=this.docView.update(r),this.state.facet(zs)!=this.styleModules&&this.mountStyles(),s=this.updateAttrs(),this.showAnnouncements(e),this.docView.updateSelection(i,e.some(u=>u.isUserEvent("select.pointer")))}finally{this.updateState=0}if(r.startState.facet(Qr)!=r.state.facet(Qr)&&(this.viewState.mustMeasureContent=!0),(i||s||d||this.viewState.mustEnforceCursorAssoc||this.viewState.mustMeasureContent)&&this.requestMeasure(),i&&this.docViewUpdate(),!r.empty)for(let u of this.state.facet(La))try{u(r)}catch(f){Qe(this.state,f,"update listener")}(l||c)&&Promise.resolve().then(()=>{l&&this.state==l.startState&&this.dispatch(l),c&&!ju(this,c)&&h.force&&gs(this.contentDOM,h.key,h.keyCode)})}setState(e){if(this.updateState!=0)throw new Error("Calls to EditorView.setState are not allowed while an update is in progress");if(this.destroyed){this.viewState.state=e;return}this.updateState=2;let i=this.hasFocus;try{for(let s of this.plugins)s.destroy(this);this.viewState=new lc(this,e),this.plugins=e.facet(os).map(s=>new Ro(s)),this.pluginMap.clear();for(let s of this.plugins)s.update(this);this.docView.destroy(),this.docView=new Xh(this),this.inputState.ensureHandlers(this.plugins),this.mountStyles(),this.updateAttrs(),this.bidiCache=[]}finally{this.updateState=0}i&&this.focus(),this.requestMeasure()}updatePlugins(e){let i=e.startState.facet(os),s=e.state.facet(os);if(i!=s){let r=[];for(let n of s){let o=i.indexOf(n);if(o<0)r.push(new Ro(n));else{let a=this.plugins[o];a.mustUpdate=e,r.push(a)}}for(let n of this.plugins)n.mustUpdate!=e&&n.destroy(this);this.plugins=r,this.pluginMap.clear()}else for(let r of this.plugins)r.mustUpdate=e;for(let r=0;r<this.plugins.length;r++)this.plugins[r].update(this);i!=s&&this.inputState.ensureHandlers(this.plugins)}docViewUpdate(){for(let e of this.plugins){let i=e.value;if(i&&i.docViewUpdate)try{i.docViewUpdate(this)}catch(s){Qe(this.state,s,"doc view update listener")}}}measure(e=!0){if(this.destroyed)return;if(this.measureScheduled>-1&&this.win.cancelAnimationFrame(this.measureScheduled),this.observer.delayedAndroidKey){this.measureScheduled=-1,this.requestMeasure();return}this.measureScheduled=0,e&&this.observer.forceFlush();let i=null,s=this.viewState.scrollParent,r=this.viewState.getScrollOffset(),{scrollAnchorPos:n,scrollAnchorHeight:o}=this.viewState;Math.abs(r-this.viewState.scrollOffset)>1&&(o=-1),this.viewState.scrollAnchorHeight=-1;try{for(let a=0;;a++){if(o<0)if(xu(s||this.win))n=-1,o=this.viewState.heightMap.height;else{let f=this.viewState.scrollAnchorAt(r);n=f.from,o=f.top}this.updateState=1;let l=this.viewState.measure();if(!l&&!this.measureRequests.length&&this.viewState.scrollTarget==null)break;if(a>5){console.warn(this.measureRequests.length?"Measure loop restarted more than 5 times":"Viewport failed to stabilize");break}let h=[];l&4||([this.measureRequests,h]=[h,this.measureRequests]);let c=h.map(f=>{try{return f.read(this)}catch(g){return Qe(this.state,g),fc}}),d=Mn.create(this,this.state,[]),u=!1;d.flags|=l,i?i.flags|=l:i=d,this.updateState=2,d.empty||(this.updatePlugins(d),this.inputState.update(d),this.updateAttrs(),u=this.docView.update(d),u&&this.docViewUpdate());for(let f=0;f<h.length;f++)if(c[f]!=fc)try{let g=h[f];g.write&&g.write(c[f],this)}catch(g){Qe(this.state,g)}if(u&&this.docView.updateSelection(!0),!d.viewportChanged&&this.measureRequests.length==0){if(this.viewState.editorHeight)if(this.viewState.scrollTarget){this.docView.scrollIntoView(this.viewState.scrollTarget),this.viewState.scrollTarget=null,o=-1;continue}else{let g=((n<0?this.viewState.heightMap.height:this.viewState.lineBlockAt(n).top)-o)/this.scaleY;if((g>1||g<-1)&&(s==this.scrollDOM||this.hasFocus||Math.max(this.inputState.lastWheelEvent,this.inputState.lastTouchTime)>Date.now()-100)){r=r+g,s?s.scrollTop+=g:this.win.scrollBy(0,g),o=-1;continue}}break}}}finally{this.updateState=0,this.measureScheduled=-1}if(i&&!i.empty)for(let a of this.state.facet(La))a(i)}get themeClasses(){return Wa+" "+(this.state.facet(Ha)?nf:rf)+" "+this.state.facet(Qr)}updateAttrs(){let e=pc(this,Fu,{class:"cm-editor"+(this.hasFocus?" cm-focused ":" ")+this.themeClasses}),i={spellcheck:"false",autocorrect:"off",autocapitalize:"off",writingsuggestions:"false",translate:"no",contenteditable:this.state.facet(Qt)?"true":"false",class:"cm-content",style:`${B.tabSize}: ${this.state.tabSize}`,role:"textbox","aria-multiline":"true"};this.state.readOnly&&(i["aria-readonly"]="true"),pc(this,Dl,i);let s=this.observer.ignore(()=>{let r=zh(this.contentDOM,this.contentAttrs,i),n=zh(this.dom,this.editorAttrs,e);return r||n});return this.editorAttrs=e,this.contentAttrs=i,s}showAnnouncements(e){let i=!0;for(let s of e)for(let r of s.effects)if(r.is(L.announce)){i&&(this.announceDOM.textContent=""),i=!1;let n=this.announceDOM.appendChild(document.createElement("div"));n.textContent=r.value}}mountStyles(){this.styleModules=this.state.facet(zs);let e=this.state.facet(L.cspNonce);pi.mount(this.root,this.styleModules.concat(Ov).reverse(),e?{nonce:e}:void 0)}readMeasured(){if(this.updateState==2)throw new Error("Reading the editor layout isn't allowed during an update");this.updateState==0&&this.measureScheduled>-1&&this.measure(!1)}requestMeasure(e){if(this.measureScheduled<0&&(this.measureScheduled=this.win.requestAnimationFrame(()=>this.measure())),e){if(this.measureRequests.indexOf(e)>-1)return;if(e.key!=null){for(let i=0;i<this.measureRequests.length;i++)if(this.measureRequests[i].key===e.key){this.measureRequests[i]=e;return}}this.measureRequests.push(e)}}plugin(e){let i=this.pluginMap.get(e);return(i===void 0||i&&i.plugin!=e)&&this.pluginMap.set(e,i=this.plugins.find(s=>s.plugin==e)||null),i&&i.update(this).value}get documentTop(){return this.contentDOM.getBoundingClientRect().top+this.viewState.paddingTop}get documentPadding(){return{top:this.viewState.paddingTop,bottom:this.viewState.paddingBottom}}get scaleX(){return this.viewState.scaleX}get scaleY(){return this.viewState.scaleY}elementAtHeight(e){return this.readMeasured(),this.viewState.elementAtHeight(e)}lineBlockAtHeight(e){return this.readMeasured(),this.viewState.lineBlockAtHeight(e)}get viewportLineBlocks(){return this.viewState.viewportLines}lineBlockAt(e){return this.viewState.lineBlockAt(e)}get contentHeight(){return this.viewState.contentHeight}moveByChar(e,i,s){return No(this,e,Jh(this,e,i,s))}moveByGroup(e,i){return No(this,e,Jh(this,e,i,s=>Hb(this,e.head,s)))}visualLineSide(e,i){let s=this.bidiSpans(e),r=this.textDirectionAt(e.from),n=s[i?s.length-1:0];return $.cursor(n.side(i,r)+e.from,n.forward(!i,r)?1:-1)}moveToLineBoundary(e,i,s=!0){return Ub(this,e,i,s)}moveVertically(e,i,s){return No(this,e,Wb(this,e,i,s))}domAtPos(e,i=1){return this.docView.domAtPos(e,i)}posAtDOM(e,i=0){return this.docView.posFromDOM(e,i)}posAtCoords(e,i=!0){this.readMeasured();let s=Na(this,e,i);return s&&s.pos}posAndSideAtCoords(e,i=!0){return this.readMeasured(),Na(this,e,i)}coordsAtPos(e,i=1){this.readMeasured();let s=this.docView.coordsAt(e,i);if(!s||s.left==s.right)return s;let r=this.state.doc.lineAt(e),n=this.bidiSpans(r),o=n[Rt.find(n,e-r.from,-1,i)];return Tn(s,o.dir==ae.LTR==i>0)}coordsForChar(e){return this.readMeasured(),this.docView.coordsForChar(e)}get defaultCharacterWidth(){return this.viewState.heightOracle.charWidth}get defaultLineHeight(){return this.viewState.heightOracle.lineHeight}get textDirection(){return this.viewState.defaultTextDirection}textDirectionAt(e){return!this.state.facet(Bu)||e<this.viewport.from||e>this.viewport.to?this.textDirection:(this.readMeasured(),this.docView.textDirectionAt(e))}get lineWrapping(){return this.viewState.heightOracle.lineWrapping}bidiSpans(e){if(e.length>Ev)return Ou(e.length);let i=this.textDirectionAt(e.from),s;for(let n of this.bidiCache)if(n.from==e.from&&n.dir==i&&(n.fresh||$u(n.isolates,s=jh(this,e))))return n.order;s||(s=jh(this,e));let r=fb(e.text,i,s);return this.bidiCache.push(new Rn(e.from,e.to,i,s,!0,r)),r}get hasFocus(){var e;return(this.dom.ownerDocument.hasFocus()||B.safari&&((e=this.inputState)===null||e===void 0?void 0:e.lastContextMenu)>Date.now()-3e4)&&this.root.activeElement==this.contentDOM}focus(){this.observer.ignore(()=>{yu(this.contentDOM),this.docView.updateSelection()})}setRoot(e){this._root!=e&&(this._root=e,this.observer.setWindow((e.nodeType==9?e:e.ownerDocument).defaultView||window),this.mountStyles())}destroy(){this.root.activeElement==this.contentDOM&&this.contentDOM.blur();for(let e of this.plugins)e.destroy(this);this.plugins=[],this.inputState.destroy(),this.docView.destroy(),this.dom.remove(),this.observer.destroy(),this.measureScheduled>-1&&this.win.cancelAnimationFrame(this.measureScheduled),this.destroyed=!0}static scrollIntoView(e,i={}){var s,r,n,o;return Hr.of(new ms(typeof e=="number"?$.cursor(e):e,(s=i.y)!==null&&s!==void 0?s:"nearest",(r=i.x)!==null&&r!==void 0?r:"nearest",(n=i.yMargin)!==null&&n!==void 0?n:5,(o=i.xMargin)!==null&&o!==void 0?o:5))}scrollSnapshot(){let{scrollTop:e,scrollLeft:i}=this.scrollDOM,s=this.viewState.scrollAnchorAt(e);return Hr.of(new ms($.cursor(s.from),"start","start",s.top-e,i,!0))}setTabFocusMode(e){e==null?this.inputState.tabFocusMode=this.inputState.tabFocusMode<0?0:-1:typeof e=="boolean"?this.inputState.tabFocusMode=e?0:-1:this.inputState.tabFocusMode!=0&&(this.inputState.tabFocusMode=Date.now()+e)}static domEventHandlers(e){return ye.define(()=>({}),{eventHandlers:e})}static domEventObservers(e){return ye.define(()=>({}),{eventObservers:e})}static theme(e,i){let s=pi.newName(),r=[Qr.of(s),zs.of(za(`.${s}`,e))];return i&&i.dark&&r.push(Ha.of(!0)),r}static baseTheme(e){return Gi.lowest(zs.of(za("."+Wa,e,of)))}static findFromDOM(e){var i;let s=e.querySelector(".cm-content"),r=s&&me.get(s)||me.get(e);return((i=r==null?void 0:r.root)===null||i===void 0?void 0:i.view)||null}}L.styleModule=zs;L.inputHandler=_u;L.clipboardInputFilter=El;L.clipboardOutputFilter=_l;L.scrollHandler=Lu;L.focusChangeEffect=Du;L.perLineTextDirection=Bu;L.exceptionSink=Eu;L.updateListener=La;L.editable=Qt;L.mouseSelectionStyle=Mu;L.dragMovesSelection=Tu;L.clickAddsSelectionRange=Pu;L.decorations=lo;L.blockWrappers=Nu;L.outerDecorations=Bl;L.atomicRanges=Er;L.bidiIsolatedRanges=Uu;L.cursorScrollMargin=R.define({combine:t=>{let e=5,i=5;for(let s of t)typeof s=="number"?e=i=s:{x:e,y:i}=s;return{x:e,y:i}}});L.scrollMargins=Hu;L.darkTheme=Ha;L.cspNonce=R.define({combine:t=>t.length?t[0]:""});L.contentAttributes=Dl;L.editorAttributes=Fu;L.lineWrapping=L.contentAttributes.of({class:"cm-lineWrapping"});L.announce=W.define();const Ev=4096,fc={};class Rn{constructor(e,i,s,r,n,o){this.from=e,this.to=i,this.dir=s,this.isolates=r,this.fresh=n,this.order=o}static update(e,i){if(i.empty&&!e.some(n=>n.fresh))return e;let s=[],r=e.length?e[e.length-1].dir:ae.LTR;for(let n=Math.max(0,e.length-10);n<e.length;n++){let o=e[n];o.dir==r&&!i.touchesRange(o.from,o.to)&&s.push(new Rn(i.mapPos(o.from,1),i.mapPos(o.to,-1),o.dir,o.isolates,!1,o.order))}return s}}function pc(t,e,i){for(let s=t.state.facet(e),r=s.length-1;r>=0;r--){let n=s[r],o=typeof n=="function"?n(t):n;o&&Pl(o,i)}return i}const _v=B.mac?"mac":B.windows?"win":B.linux?"linux":"key";function Dv(t,e){const i=t.split(/-(?!$)/);let s=i[i.length-1];s=="Space"&&(s=" ");let r,n,o,a;for(let l=0;l<i.length-1;++l){const h=i[l];if(/^(cmd|meta|m)$/i.test(h))a=!0;else if(/^a(lt)?$/i.test(h))r=!0;else if(/^(c|ctrl|control)$/i.test(h))n=!0;else if(/^s(hift)?$/i.test(h))o=!0;else if(/^mod$/i.test(h))e=="mac"?a=!0:n=!0;else throw new Error("Unrecognized modifier name: "+h)}return r&&(s="Alt-"+s),n&&(s="Ctrl-"+s),a&&(s="Meta-"+s),o&&(s="Shift-"+s),s}function Kr(t,e,i){return e.altKey&&(t="Alt-"+t),e.ctrlKey&&(t="Ctrl-"+t),e.metaKey&&(t="Meta-"+t),i!==!1&&e.shiftKey&&(t="Shift-"+t),t}const Bv=Gi.default(L.domEventHandlers({keydown(t,e){return lf(af(e.state),t,e,"editor")}})),Nl=R.define({enables:Bv}),gc=new WeakMap;function af(t){let e=t.facet(Nl),i=gc.get(e);return i||gc.set(e,i=Iv(e.reduce((s,r)=>s.concat(r),[]))),i}function Rv(t,e,i){return lf(af(t.state),e,t,i)}let oi=null;const Lv=4e3;function Iv(t,e=_v){let i=Object.create(null),s=Object.create(null),r=(o,a)=>{let l=s[o];if(l==null)s[o]=a;else if(l!=a)throw new Error("Key binding "+o+" is used both as a regular binding and as a multi-stroke prefix")},n=(o,a,l,h,c)=>{var d,u;let f=i[o]||(i[o]=Object.create(null)),g=a.split(/ (?!$)/).map(w=>Dv(w,e));for(let w=1;w<g.length;w++){let x=g.slice(0,w).join(" ");r(x,!0),f[x]||(f[x]={preventDefault:!0,stopPropagation:!1,run:[O=>{let D=oi={view:O,prefix:x,scope:o};return setTimeout(()=>{oi==D&&(oi=null)},Lv),!0}]})}let m=g.join(" ");r(m,!1);let y=f[m]||(f[m]={preventDefault:!1,stopPropagation:!1,run:((u=(d=f._any)===null||d===void 0?void 0:d.run)===null||u===void 0?void 0:u.slice())||[]});l&&y.run.push(l),h&&(y.preventDefault=!0),c&&(y.stopPropagation=!0)};for(let o of t){let a=o.scope?o.scope.split(" "):["editor"];if(o.any)for(let h of a){let c=i[h]||(i[h]=Object.create(null));c._any||(c._any={preventDefault:!1,stopPropagation:!1,run:[]});let{any:d}=o;for(let u in c)c[u].run.push(f=>d(f,qa))}let l=o[e]||o.key;if(l)for(let h of a)n(h,l,o.run,o.preventDefault,o.stopPropagation),o.shift&&n(h,"Shift-"+l,o.shift,o.preventDefault,o.stopPropagation)}return i}let qa=null;function lf(t,e,i,s){qa=e;let r=Gm(e),n=qe(r,0),o=Dt(n)==r.length&&r!=" ",a="",l=!1,h=!1,c=!1;oi&&oi.view==i&&oi.scope==s&&(a=oi.prefix+" ",Xu.indexOf(e.keyCode)<0&&(h=!0,oi=null));let d=new Set,u=y=>{if(y){for(let w of y.run)if(!d.has(w)&&(d.add(w),w(i)))return y.stopPropagation&&(c=!0),!0;y.preventDefault&&(y.stopPropagation&&(c=!0),h=!0)}return!1},f=t[s],g,m;return f&&(u(f[a+Kr(r,e,!o)])?l=!0:o&&(e.altKey||e.metaKey||e.ctrlKey)&&!(B.windows&&e.ctrlKey&&e.altKey)&&!(B.mac&&e.altKey&&!(e.ctrlKey||e.metaKey))&&(g=gi[e.keyCode])&&g!=r?(u(f[a+Kr(g,e,!0)])||e.shiftKey&&(m=cr[e.keyCode])!=r&&m!=g&&u(f[a+Kr(m,e,!1)]))&&(l=!0):o&&e.shiftKey&&u(f[a+Kr(r,e,!0)])&&(l=!0),!l&&u(f._any)&&(l=!0)),h&&(l=!0),l&&c&&e.stopPropagation(),qa=null,l}class Ui{constructor(e,i,s,r,n){this.className=e,this.left=i,this.top=s,this.width=r,this.height=n}draw(){let e=document.createElement("div");return e.className=this.className,this.adjust(e),e}update(e,i){return i.className!=this.className?!1:(this.adjust(e),!0)}adjust(e){e.style.left=this.left+"px",e.style.top=this.top+"px",this.width!=null&&(e.style.width=this.width+"px"),e.style.height=this.height+"px"}eq(e){return this.left==e.left&&this.top==e.top&&this.width==e.width&&this.height==e.height&&this.className==e.className}static forRange(e,i,s){if(s.empty){let r=e.coordsAtPos(s.head,s.assoc||1);if(!r)return[];let n=hf(e);return[new Ui(i,r.left-n.left,r.top-n.top,null,r.bottom-r.top)]}else return Fv(e,i,s)}}function hf(t){let e=t.scrollDOM.getBoundingClientRect();return{left:(t.textDirection==ae.LTR?e.left:e.right-t.scrollDOM.clientWidth*t.scaleX)-t.scrollDOM.scrollLeft*t.scaleX,top:e.top-t.scrollDOM.scrollTop*t.scaleY}}function mc(t,e,i,s){let r=t.coordsAtPos(e,i*2);if(!r)return s;let n=t.dom.getBoundingClientRect(),o=(r.top+r.bottom)/2,a=t.posAtCoords({x:n.left+1,y:o}),l=t.posAtCoords({x:n.right-1,y:o});return a==null||l==null?s:{from:Math.max(s.from,Math.min(a,l)),to:Math.min(s.to,Math.max(a,l))}}function Fv(t,e,i){if(i.to<=t.viewport.from||i.from>=t.viewport.to)return[];let s=Math.max(i.from,t.viewport.from),r=Math.min(i.to,t.viewport.to),n=t.textDirection==ae.LTR,o=t.contentDOM,a=o.getBoundingClientRect(),l=hf(t),h=o.querySelector(".cm-line"),c=h&&window.getComputedStyle(h),d=a.left+(c?parseInt(c.paddingLeft)+Math.min(0,parseInt(c.textIndent)):0),u=a.right-(c?parseInt(c.paddingRight):0),f=Fa(t,s,1),g=Fa(t,r,-1),m=f.type==Te.Text?f:null,y=g.type==Te.Text?g:null;if(m&&(t.lineWrapping||f.widgetLineBreaks)&&(m=mc(t,s,1,m)),y&&(t.lineWrapping||g.widgetLineBreaks)&&(y=mc(t,r,-1,y)),m&&y&&m.from==y.from&&m.to==y.to)return x(O(i.from,i.to,m));{let A=m?O(i.from,null,m):D(f,!1),P=y?O(null,i.to,y):D(g,!0),T=[];return(m||f).to<(y||g).from-(m&&y?1:0)||f.widgetLineBreaks>1&&A.bottom+t.defaultLineHeight/2<P.top?T.push(w(d,A.bottom,u,P.top)):A.bottom<P.top&&t.elementAtHeight((A.bottom+P.top)/2).type==Te.Text&&(A.bottom=P.top=(A.bottom+P.top)/2),x(A).concat(T).concat(x(P))}function w(A,P,T,H){return new Ui(e,A-l.left,P-l.top,Math.max(0,T-A),H-P)}function x({top:A,bottom:P,horizontal:T}){let H=[];for(let K=0;K<T.length;K+=2)H.push(w(T[K],A,T[K+1],P));return H}function O(A,P,T){let H=1e9,K=-1e9,ne=[];function j(G,he,Le,Ge,$t){let Oe=t.coordsAtPos(G,G==T.to?-2:2),lt=t.coordsAtPos(Le,Le==T.from?2:-2);!Oe||!lt||(H=Math.min(Oe.top,lt.top,H),K=Math.max(Oe.bottom,lt.bottom,K),$t==ae.LTR?ne.push(n&&he?d:Oe.left,n&&Ge?u:lt.right):ne.push(!n&&Ge?d:lt.left,!n&&he?u:Oe.right))}let N=A??T.from,ee=P??T.to;for(let G of t.visibleRanges)if(G.to>N&&G.from<ee)for(let he=Math.max(G.from,N),Le=Math.min(G.to,ee);;){let Ge=t.state.doc.lineAt(he);for(let $t of t.bidiSpans(Ge)){let Oe=$t.from+Ge.from,lt=$t.to+Ge.from;if(Oe>=Le)break;lt>he&&j(Math.max(Oe,he),A==null&&Oe<=N,Math.min(lt,Le),P==null&&lt>=ee,$t.dir)}if(he=Ge.to+1,he>=Le)break}return ne.length==0&&j(N,A==null,ee,P==null,t.textDirection),{top:H,bottom:K,horizontal:ne}}function D(A,P){let T=a.top+(P?A.top:A.bottom);return{top:T,bottom:T,horizontal:[]}}}function Nv(t,e){return t.constructor==e.constructor&&t.eq(e)}class Uv{constructor(e,i){this.view=e,this.layer=i,this.drawn=[],this.scaleX=1,this.scaleY=1,this.measureReq={read:this.measure.bind(this),write:this.draw.bind(this)},this.dom=e.scrollDOM.appendChild(document.createElement("div")),this.dom.classList.add("cm-layer"),i.above&&this.dom.classList.add("cm-layer-above"),i.class&&this.dom.classList.add(i.class),this.scale(),this.dom.setAttribute("aria-hidden","true"),this.setOrder(e.state),e.requestMeasure(this.measureReq),i.mount&&i.mount(this.dom,e)}update(e){e.startState.facet(pn)!=e.state.facet(pn)&&this.setOrder(e.state),(this.layer.update(e,this.dom)||e.geometryChanged)&&(this.scale(),e.view.requestMeasure(this.measureReq))}docViewUpdate(e){this.layer.updateOnDocViewUpdate!==!1&&e.requestMeasure(this.measureReq)}setOrder(e){let i=0,s=e.facet(pn);for(;i<s.length&&s[i]!=this.layer;)i++;this.dom.style.zIndex=String((this.layer.above?150:-1)-i)}measure(){return this.layer.markers(this.view)}scale(){let{scaleX:e,scaleY:i}=this.view;(e!=this.scaleX||i!=this.scaleY)&&(this.scaleX=e,this.scaleY=i,this.dom.style.transform=`scale(${1/e}, ${1/i})`)}draw(e){if(e.length!=this.drawn.length||e.some((i,s)=>!Nv(i,this.drawn[s]))){let i=this.dom.firstChild,s=0;for(let r of e)r.update&&i&&r.constructor&&this.drawn[s].constructor&&r.update(i,this.drawn[s])?(i=i.nextSibling,s++):this.dom.insertBefore(r.draw(),i);for(;i;){let r=i.nextSibling;i.remove(),i=r}this.drawn=e,B.webkit&&(this.dom.style.display=this.dom.firstChild?"":"none")}}destroy(){this.layer.destroy&&this.layer.destroy(this.dom,this.view),this.dom.remove()}}const pn=R.define();function cf(t){return[ye.define(e=>new Uv(e,t)),pn.of(t)]}const Os=R.define({combine(t){return zt(t,{cursorBlinkRate:1200,drawRangeCursor:!0,iosSelectionHandles:!0},{cursorBlinkRate:(e,i)=>Math.min(e,i),drawRangeCursor:(e,i)=>e||i})}});function Hv(t={}){return[Os.of(t),Wv,zv,qv,Ru.of(!0)]}function df(t){return t.startState.facet(Os)!=t.state.facet(Os)}const Wv=cf({above:!0,markers(t){let{state:e}=t,i=e.facet(Os),s=[];for(let r of e.selection.ranges){let n=r==e.selection.main;if(r.empty||i.drawRangeCursor&&!(n&&B.ios&&i.iosSelectionHandles)){let o=n?"cm-cursor cm-cursor-primary":"cm-cursor cm-cursor-secondary",a=r.empty?r:$.cursor(r.head,r.assoc);for(let l of Ui.forRange(t,o,a))s.push(l)}}return s},update(t,e){t.transactions.some(s=>s.selection)&&(e.style.animationName=e.style.animationName=="cm-blink"?"cm-blink2":"cm-blink");let i=df(t);return i&&bc(t.state,e),t.docChanged||t.selectionSet||i},mount(t,e){bc(e.state,t)},class:"cm-cursorLayer"});function bc(t,e){e.style.animationDuration=t.facet(Os).cursorBlinkRate+"ms"}const zv=cf({above:!1,markers(t){let e=[],{main:i,ranges:s}=t.state.selection;for(let r of s)if(!r.empty)for(let n of Ui.forRange(t,"cm-selectionBackground",r))e.push(n);if(B.ios&&!i.empty&&t.state.facet(Os).iosSelectionHandles){for(let r of Ui.forRange(t,"cm-selectionHandle cm-selectionHandle-start",$.cursor(i.from,1)))e.push(r);for(let r of Ui.forRange(t,"cm-selectionHandle cm-selectionHandle-end",$.cursor(i.to,1)))e.push(r)}return e},update(t,e){return t.docChanged||t.selectionSet||t.viewportChanged||df(t)},class:"cm-selectionLayer"}),qv=Gi.highest(L.theme({".cm-line":{"& ::selection, &::selection":{backgroundColor:"transparent !important"},caretColor:"transparent !important"},".cm-content":{caretColor:"transparent !important","& :focus":{caretColor:"initial !important","&::selection, & ::selection":{backgroundColor:"Highlight !important"}}}})),uf=W.define({map(t,e){return t==null?null:e.mapPos(t)}}),Vs=Be.define({create(){return null},update(t,e){return t!=null&&(t=e.changes.mapPos(t)),e.effects.reduce((i,s)=>s.is(uf)?s.value:i,t)}}),Vv=ye.fromClass(class{constructor(t){this.view=t,this.cursor=null,this.measureReq={read:this.readPos.bind(this),write:this.drawCursor.bind(this)}}update(t){var e;let i=t.state.field(Vs);i==null?this.cursor!=null&&((e=this.cursor)===null||e===void 0||e.remove(),this.cursor=null):(this.cursor||(this.cursor=this.view.scrollDOM.appendChild(document.createElement("div")),this.cursor.className="cm-dropCursor"),(t.startState.field(Vs)!=i||t.docChanged||t.geometryChanged)&&this.view.requestMeasure(this.measureReq))}readPos(){let{view:t}=this,e=t.state.field(Vs),i=e!=null&&t.coordsAtPos(e);if(!i)return null;let s=t.scrollDOM.getBoundingClientRect();return{left:i.left-s.left+t.scrollDOM.scrollLeft*t.scaleX,top:i.top-s.top+t.scrollDOM.scrollTop*t.scaleY,height:i.bottom-i.top}}drawCursor(t){if(this.cursor){let{scaleX:e,scaleY:i}=this.view;t?(this.cursor.style.left=t.left/e+"px",this.cursor.style.top=t.top/i+"px",this.cursor.style.height=t.height/i+"px"):this.cursor.style.left="-100000px"}}destroy(){this.cursor&&this.cursor.remove()}setDropPos(t){this.view.state.field(Vs)!=t&&this.view.dispatch({effects:uf.of(t)})}},{eventObservers:{dragover(t){this.setDropPos(this.view.posAtCoords({x:t.clientX,y:t.clientY}))},dragleave(t){(t.target==this.view.contentDOM||!this.view.contentDOM.contains(t.relatedTarget))&&this.setDropPos(null)},dragend(){this.setDropPos(null)},drop(){this.setDropPos(null)}}});function jv(){return[Vs,Vv]}function vc(t,e,i,s,r){e.lastIndex=0;for(let n=t.iterRange(i,s),o=i,a;!n.next().done;o+=n.value.length)if(!n.lineBreak)for(;a=e.exec(n.value);)r(o+a.index,a)}function Qv(t,e){let i=t.visibleRanges;if(i.length==1&&i[0].from==t.viewport.from&&i[0].to==t.viewport.to)return i;let s=[];for(let{from:r,to:n}of i)r=Math.max(t.state.doc.lineAt(r).from,r-e),n=Math.min(t.state.doc.lineAt(n).to,n+e),s.length&&s[s.length-1].to>=r?s[s.length-1].to=n:s.push({from:r,to:n});return s}class Kv{constructor(e){const{regexp:i,decoration:s,decorate:r,boundary:n,maxLength:o=1e3}=e;if(!i.global)throw new RangeError("The regular expression given to MatchDecorator should have its 'g' flag set");if(this.regexp=i,r)this.addMatch=(a,l,h,c)=>r(c,h,h+a[0].length,a,l);else if(typeof s=="function")this.addMatch=(a,l,h,c)=>{let d=s(a,l,h);d&&c(h,h+a[0].length,d)};else if(s)this.addMatch=(a,l,h,c)=>c(h,h+a[0].length,s);else throw new RangeError("Either 'decorate' or 'decoration' should be provided to MatchDecorator");this.boundary=n,this.maxLength=o}createDeco(e){let i=new Jt,s=i.add.bind(i);for(let{from:r,to:n}of Qv(e,this.maxLength))vc(e.state.doc,this.regexp,r,n,(o,a)=>this.addMatch(a,e,o,s));return i.finish()}updateDeco(e,i){let s=1e9,r=-1;return e.docChanged&&e.changes.iterChanges((n,o,a,l)=>{l>=e.view.viewport.from&&a<=e.view.viewport.to&&(s=Math.min(a,s),r=Math.max(l,r))}),e.viewportMoved||r-s>1e3?this.createDeco(e.view):r>-1?this.updateRange(e.view,i.map(e.changes),s,r):i}updateRange(e,i,s,r){for(let n of e.visibleRanges){let o=Math.max(n.from,s),a=Math.min(n.to,r);if(a>=o){let l=e.state.doc.lineAt(o),h=l.to<a?e.state.doc.lineAt(a):l,c=Math.max(n.from,l.from),d=Math.min(n.to,h.to);if(this.boundary){for(;o>l.from;o--)if(this.boundary.test(l.text[o-1-l.from])){c=o;break}for(;a<h.to;a++)if(this.boundary.test(h.text[a-h.from])){d=a;break}}let u=[],f,g=(m,y,w)=>u.push(w.range(m,y));if(l==h)for(this.regexp.lastIndex=c-l.from;(f=this.regexp.exec(l.text))&&f.index<d-l.from;)this.addMatch(f,e,f.index+l.from,g);else vc(e.state.doc,this.regexp,c,d,(m,y)=>this.addMatch(y,e,m,g));i=i.update({filterFrom:c,filterTo:d,filter:(m,y)=>m<c||y>d,add:u})}}return i}}const Va=/x/.unicode!=null?"gu":"g",Xv=new RegExp(`[\0-\b
--­؜​‎‏\u2028\u2029‭‮⁦⁧⁩\uFEFF￹-￼]`,Va),Jv={0:"null",7:"bell",8:"backspace",10:"newline",11:"vertical tab",13:"carriage return",27:"escape",8203:"zero width space",8204:"zero width non-joiner",8205:"zero width joiner",8206:"left-to-right mark",8207:"right-to-left mark",8232:"line separator",8237:"left-to-right override",8238:"right-to-left override",8294:"left-to-right isolate",8295:"right-to-left isolate",8297:"pop directional isolate",8233:"paragraph separator",65279:"zero width no-break space",65532:"object replacement"};let Wo=null;function Yv(){var t;if(Wo==null&&typeof document<"u"&&document.body){let e=document.body.style;Wo=((t=e.tabSize)!==null&&t!==void 0?t:e.MozTabSize)!=null}return Wo||!1}const gn=R.define({combine(t){let e=zt(t,{render:null,specialChars:Xv,addSpecialChars:null});return(e.replaceTabs=!Yv())&&(e.specialChars=new RegExp("	|"+e.specialChars.source,Va)),e.addSpecialChars&&(e.specialChars=new RegExp(e.specialChars.source+"|"+e.addSpecialChars.source,Va)),e}});function Gv(t={}){return[gn.of(t),Zv()]}let yc=null;function Zv(){return yc||(yc=ye.fromClass(class{constructor(t){this.view=t,this.decorations=U.none,this.decorationCache=Object.create(null),this.decorator=this.makeDecorator(t.state.facet(gn)),this.decorations=this.decorator.createDeco(t)}makeDecorator(t){return new Kv({regexp:t.specialChars,decoration:(e,i,s)=>{let{doc:r}=i.state,n=qe(e[0],0);if(n==9){let o=r.lineAt(s),a=i.state.tabSize,l=_s(o.text,a,s-o.from);return U.replace({widget:new s0((a-l%a)*this.view.defaultCharacterWidth/this.view.scaleX)})}return this.decorationCache[n]||(this.decorationCache[n]=U.replace({widget:new i0(t,n)}))},boundary:t.replaceTabs?void 0:/[^]/})}update(t){let e=t.state.facet(gn);t.startState.facet(gn)!=e?(this.decorator=this.makeDecorator(e),this.decorations=this.decorator.createDeco(t.view)):this.decorations=this.decorator.updateDeco(t,this.decorations)}},{decorations:t=>t.decorations}))}const e0="•";function t0(t){return t>=32?e0:t==10?"␤":String.fromCharCode(9216+t)}class i0 extends ti{constructor(e,i){super(),this.options=e,this.code=i}eq(e){return e.code==this.code}toDOM(e){let i=t0(this.code),s=e.state.phrase("Control character")+" "+(Jv[this.code]||"0x"+this.code.toString(16)),r=this.options.render&&this.options.render(this.code,s,i);if(r)return r;let n=document.createElement("span");return n.textContent=i,n.title=s,n.setAttribute("aria-label",s),n.className="cm-specialChar",n}ignoreEvent(){return!1}}class s0 extends ti{constructor(e){super(),this.width=e}eq(e){return e.width==this.width}toDOM(){let e=document.createElement("span");return e.textContent="	",e.className="cm-tab",e.style.width=this.width+"px",e}ignoreEvent(){return!1}}function r0(){return o0}const n0=U.line({class:"cm-activeLine"}),o0=ye.fromClass(class{constructor(t){this.decorations=this.getDeco(t)}update(t){(t.docChanged||t.selectionSet)&&(this.decorations=this.getDeco(t.view))}getDeco(t){let e=-1,i=[];for(let s of t.state.selection.ranges){let r=t.lineBlockAt(s.head);r.from>e&&(i.push(n0.range(r.from)),e=r.from)}return U.set(i)}},{decorations:t=>t.decorations}),ja=2e3;function a0(t,e,i){let s=Math.min(e.line,i.line),r=Math.max(e.line,i.line),n=[];if(e.off>ja||i.off>ja||e.col<0||i.col<0){let o=Math.min(e.off,i.off),a=Math.max(e.off,i.off);for(let l=s;l<=r;l++){let h=t.doc.line(l);h.length<=a&&n.push($.range(h.from+o,h.to+a))}}else{let o=Math.min(e.col,i.col),a=Math.max(e.col,i.col);for(let l=s;l<=r;l++){let h=t.doc.line(l),c=$a(h.text,o,t.tabSize,!0);if(c<0)n.push($.cursor(h.to));else{let d=$a(h.text,a,t.tabSize);n.push($.range(h.from+c,h.from+d))}}}return n}function l0(t,e){let i=t.coordsAtPos(t.viewport.from);return i?Math.round(Math.abs((i.left-e)/t.defaultCharacterWidth)):-1}function xc(t,e){let i=t.posAtCoords({x:e.clientX,y:e.clientY},!1),s=t.state.doc.lineAt(i),r=i-s.from,n=r>ja?-1:r==s.length?l0(t,e.clientX):_s(s.text,t.state.tabSize,i-s.from);return{line:s.number,col:n,off:r}}function h0(t,e){let i=xc(t,e),s=t.state.selection;return i?{update(r){if(r.docChanged){let n=r.changes.mapPos(r.startState.doc.line(i.line).from),o=r.state.doc.lineAt(n);i={line:o.number,col:i.col,off:Math.min(i.off,o.length)},s=s.map(r.changes)}},get(r,n,o){let a=xc(t,r);if(!a)return s;let l=a0(t.state,i,a);return l.length?o?$.create(l.concat(s.ranges)):$.create(l):s}}:null}function c0(t){let e=(i=>i.altKey&&i.button==0);return L.mouseSelectionStyle.of((i,s)=>e(s)?h0(i,s):null)}const d0={Alt:[18,t=>!!t.altKey],Control:[17,t=>!!t.ctrlKey],Shift:[16,t=>!!t.shiftKey],Meta:[91,t=>!!t.metaKey]},u0={style:"cursor: crosshair"};function f0(t={}){let[e,i]=d0[t.key||"Alt"],s=ye.fromClass(class{constructor(r){this.view=r,this.isDown=!1}set(r){this.isDown!=r&&(this.isDown=r,this.view.update([]))}},{eventObservers:{keydown(r){this.set(r.keyCode==e||i(r))},keyup(r){(r.keyCode==e||!i(r))&&this.set(!1)},mousemove(r){this.set(i(r))}}});return[s,L.contentAttributes.of(r=>{var n;return!((n=r.plugin(s))===null||n===void 0)&&n.isDown?u0:null})]}const Xr="-10000px";class ff{constructor(e,i,s,r){this.facet=i,this.createTooltipView=s,this.removeTooltipView=r,this.input=e.state.facet(i),this.tooltips=this.input.filter(o=>o);let n=null;this.tooltipViews=this.tooltips.map(o=>n=s(o,n))}update(e,i){var s;let r=e.state.facet(this.facet),n=r.filter(l=>l);if(r===this.input){for(let l of this.tooltipViews)l.update&&l.update(e);return!1}let o=[],a=i?[]:null;for(let l=0;l<n.length;l++){let h=n[l],c=-1;if(h){for(let d=0;d<this.tooltips.length;d++){let u=this.tooltips[d];u&&u.create==h.create&&(c=d)}if(c<0)o[l]=this.createTooltipView(h,l?o[l-1]:null),a&&(a[l]=!!h.above);else{let d=o[l]=this.tooltipViews[c];a&&(a[l]=i[c]),d.update&&d.update(e)}}}for(let l of this.tooltipViews)o.indexOf(l)<0&&(this.removeTooltipView(l),(s=l.destroy)===null||s===void 0||s.call(l));return i&&(a.forEach((l,h)=>i[h]=l),i.length=a.length),this.input=r,this.tooltips=n,this.tooltipViews=o,!0}}function p0(t){let e=t.dom.ownerDocument.documentElement;return{top:0,left:0,bottom:e.clientHeight,right:e.clientWidth}}const zo=R.define({combine:t=>{var e,i,s;return{position:B.ios?"absolute":((e=t.find(r=>r.position))===null||e===void 0?void 0:e.position)||"fixed",parent:((i=t.find(r=>r.parent))===null||i===void 0?void 0:i.parent)||null,tooltipSpace:((s=t.find(r=>r.tooltipSpace))===null||s===void 0?void 0:s.tooltipSpace)||p0}}}),wc=new WeakMap,Ul=ye.fromClass(class{constructor(t){this.view=t,this.above=[],this.inView=!0,this.madeAbsolute=!1,this.lastTransaction=0,this.measureTimeout=-1;let e=t.state.facet(zo);this.position=e.position,this.parent=e.parent,this.classes=t.themeClasses,this.createContainer(),this.measureReq={read:this.readMeasure.bind(this),write:this.writeMeasure.bind(this),key:this},this.resizeObserver=typeof ResizeObserver=="function"?new ResizeObserver(()=>this.measureSoon()):null,this.manager=new ff(t,Hl,(i,s)=>this.createTooltip(i,s),i=>{this.resizeObserver&&this.resizeObserver.unobserve(i.dom),i.dom.remove()}),this.above=this.manager.tooltips.map(i=>!!i.above),this.intersectionObserver=typeof IntersectionObserver=="function"?new IntersectionObserver(i=>{Date.now()>this.lastTransaction-50&&i.length>0&&i[i.length-1].intersectionRatio<1&&this.measureSoon()},{threshold:[1]}):null,this.observeIntersection(),t.win.addEventListener("resize",this.measureSoon=this.measureSoon.bind(this)),this.maybeMeasure()}createContainer(){this.parent?(this.container=document.createElement("div"),this.container.style.position="relative",this.container.className=this.view.themeClasses,this.parent.appendChild(this.container)):this.container=this.view.dom}observeIntersection(){if(this.intersectionObserver){this.intersectionObserver.disconnect();for(let t of this.manager.tooltipViews)this.intersectionObserver.observe(t.dom)}}measureSoon(){this.measureTimeout<0&&(this.measureTimeout=setTimeout(()=>{this.measureTimeout=-1,this.maybeMeasure()},50))}update(t){t.transactions.length&&(this.lastTransaction=Date.now());let e=this.manager.update(t,this.above);e&&this.observeIntersection();let i=e||t.geometryChanged,s=t.state.facet(zo);if(s.position!=this.position&&!this.madeAbsolute){this.position=s.position;for(let r of this.manager.tooltipViews)r.dom.style.position=this.position;i=!0}if(s.parent!=this.parent){this.parent&&this.container.remove(),this.parent=s.parent,this.createContainer();for(let r of this.manager.tooltipViews)this.container.appendChild(r.dom);i=!0}else this.parent&&this.view.themeClasses!=this.classes&&(this.classes=this.container.className=this.view.themeClasses);i&&this.maybeMeasure()}createTooltip(t,e){let i=t.create(this.view),s=e?e.dom:null;if(i.dom.classList.add("cm-tooltip"),t.arrow&&!i.dom.querySelector(".cm-tooltip > .cm-tooltip-arrow")){let r=document.createElement("div");r.className="cm-tooltip-arrow",i.dom.appendChild(r)}return i.dom.style.position=this.position,i.dom.style.top=Xr,i.dom.style.left="0px",this.container.insertBefore(i.dom,s),i.mount&&i.mount(this.view),this.resizeObserver&&this.resizeObserver.observe(i.dom),i}destroy(){var t,e,i;this.view.win.removeEventListener("resize",this.measureSoon);for(let s of this.manager.tooltipViews)s.dom.remove(),(t=s.destroy)===null||t===void 0||t.call(s);this.parent&&this.container.remove(),(e=this.resizeObserver)===null||e===void 0||e.disconnect(),(i=this.intersectionObserver)===null||i===void 0||i.disconnect(),clearTimeout(this.measureTimeout)}readMeasure(){let t=1,e=1,i=!1;if(this.position=="fixed"&&this.manager.tooltipViews.length){let{dom:n}=this.manager.tooltipViews[0];if(B.safari){let o=n.getBoundingClientRect();i=Math.abs(o.top+1e4)>1||Math.abs(o.left)>1}else i=!!n.offsetParent&&n.offsetParent!=this.container.ownerDocument.body}if(i||this.position=="absolute")if(this.parent){let n=this.parent.getBoundingClientRect();n.width&&n.height&&(t=n.width/this.parent.offsetWidth,e=n.height/this.parent.offsetHeight)}else({scaleX:t,scaleY:e}=this.view.viewState);let s=this.view.scrollDOM.getBoundingClientRect(),r=Rl(this.view);return{visible:{left:s.left+r.left,top:s.top+r.top,right:s.right-r.right,bottom:s.bottom-r.bottom},parent:this.parent?this.container.getBoundingClientRect():this.view.dom.getBoundingClientRect(),pos:this.manager.tooltips.map((n,o)=>{let a=this.manager.tooltipViews[o];return a.getCoords?a.getCoords(n.pos):this.view.coordsAtPos(n.pos)}),size:this.manager.tooltipViews.map(({dom:n})=>n.getBoundingClientRect()),space:this.view.state.facet(zo).tooltipSpace(this.view),scaleX:t,scaleY:e,makeAbsolute:i}}writeMeasure(t){var e;if(t.makeAbsolute){this.madeAbsolute=!0,this.position="absolute";for(let a of this.manager.tooltipViews)a.dom.style.position="absolute"}let{visible:i,space:s,scaleX:r,scaleY:n}=t,o=[];for(let a=0;a<this.manager.tooltips.length;a++){let l=this.manager.tooltips[a],h=this.manager.tooltipViews[a],{dom:c}=h,d=t.pos[a],u=t.size[a];if(!d||l.clip!==!1&&(d.bottom<=Math.max(i.top,s.top)||d.top>=Math.min(i.bottom,s.bottom)||d.right<Math.max(i.left,s.left)-.1||d.left>Math.min(i.right,s.right)+.1)){c.style.top=Xr;continue}let f=l.arrow?h.dom.querySelector(".cm-tooltip-arrow"):null,g=f?7:0,m=u.right-u.left,y=(e=wc.get(h))!==null&&e!==void 0?e:u.bottom-u.top,w=h.offset||m0,x=this.view.textDirection==ae.LTR,O=u.width>s.right-s.left?x?s.left:s.right-u.width:x?Math.max(s.left,Math.min(d.left-(f?14:0)+w.x,s.right-m)):Math.min(Math.max(s.left,d.left-m+(f?14:0)-w.x),s.right-m),D=this.above[a];!l.strictSide&&(D?d.top-y-g-w.y<s.top:d.bottom+y+g+w.y>s.bottom)&&D==s.bottom-d.bottom>d.top-s.top&&(D=this.above[a]=!D);let A=(D?d.top-s.top:s.bottom-d.bottom)-g;if(A<y&&h.resize!==!1){if(A<this.view.defaultLineHeight){c.style.top=Xr;continue}wc.set(h,y),c.style.height=(y=A)/n+"px"}else c.style.height&&(c.style.height="");let P=D?d.top-y-g-w.y:d.bottom+g+w.y,T=O+m;if(h.overlap!==!0)for(let H of o)H.left<T&&H.right>O&&H.top<P+y&&H.bottom>P&&(P=D?H.top-y-2-g:H.bottom+g+2);if(this.position=="absolute"?(c.style.top=(P-t.parent.top)/n+"px",kc(c,(O-t.parent.left)/r)):(c.style.top=P/n+"px",kc(c,O/r)),f){let H=d.left+(x?w.x:-w.x)-(O+14-7);f.style.left=H/r+"px"}h.overlap!==!0&&o.push({left:O,top:P,right:T,bottom:P+y}),c.classList.toggle("cm-tooltip-above",D),c.classList.toggle("cm-tooltip-below",!D),h.positioned&&h.positioned(t.space)}}maybeMeasure(){if(this.manager.tooltips.length&&(this.view.inView&&this.view.requestMeasure(this.measureReq),this.inView!=this.view.inView&&(this.inView=this.view.inView,!this.inView)))for(let t of this.manager.tooltipViews)t.dom.style.top=Xr}},{eventObservers:{scroll(){this.maybeMeasure()}}});function kc(t,e){let i=parseInt(t.style.left,10);(isNaN(i)||Math.abs(e-i)>1)&&(t.style.left=e+"px")}const g0=L.baseTheme({".cm-tooltip":{zIndex:500,boxSizing:"border-box"},"&light .cm-tooltip":{border:"1px solid #bbb",backgroundColor:"#f5f5f5"},"&light .cm-tooltip-section:not(:first-child)":{borderTop:"1px solid #bbb"},"&dark .cm-tooltip":{backgroundColor:"#333338",color:"white"},".cm-tooltip-arrow":{height:"7px",width:"14px",position:"absolute",zIndex:-1,overflow:"hidden","&:before, &:after":{content:"''",position:"absolute",width:0,height:0,borderLeft:"7px solid transparent",borderRight:"7px solid transparent"},".cm-tooltip-above &":{bottom:"-7px","&:before":{borderTop:"7px solid #bbb"},"&:after":{borderTop:"7px solid #f5f5f5",bottom:"1px"}},".cm-tooltip-below &":{top:"-7px","&:before":{borderBottom:"7px solid #bbb"},"&:after":{borderBottom:"7px solid #f5f5f5",top:"1px"}}},"&dark .cm-tooltip .cm-tooltip-arrow":{"&:before":{borderTopColor:"#333338",borderBottomColor:"#333338"},"&:after":{borderTopColor:"transparent",borderBottomColor:"transparent"}}}),m0={x:0,y:0},Hl=R.define({enables:[Ul,g0]}),Ln=R.define({combine:t=>t.reduce((e,i)=>e.concat(i),[])});class fo{static create(e){return new fo(e)}constructor(e){this.view=e,this.mounted=!1,this.dom=document.createElement("div"),this.dom.classList.add("cm-tooltip-hover"),this.manager=new ff(e,Ln,(i,s)=>this.createHostedView(i,s),i=>i.dom.remove())}createHostedView(e,i){let s=e.create(this.view);return s.dom.classList.add("cm-tooltip-section"),this.dom.insertBefore(s.dom,i?i.dom.nextSibling:this.dom.firstChild),this.mounted&&s.mount&&s.mount(this.view),s}mount(e){for(let i of this.manager.tooltipViews)i.mount&&i.mount(e);this.mounted=!0}positioned(e){for(let i of this.manager.tooltipViews)i.positioned&&i.positioned(e)}update(e){this.manager.update(e)}destroy(){var e;for(let i of this.manager.tooltipViews)(e=i.destroy)===null||e===void 0||e.call(i)}passProp(e){let i;for(let s of this.manager.tooltipViews){let r=s[e];if(r!==void 0){if(i===void 0)i=r;else if(i!==r)return}}return i}get offset(){return this.passProp("offset")}get getCoords(){return this.passProp("getCoords")}get overlap(){return this.passProp("overlap")}get resize(){return this.passProp("resize")}}const b0=Hl.compute([Ln],t=>{let e=t.facet(Ln);return e.length===0?null:{pos:Math.min(...e.map(i=>i.pos)),end:Math.max(...e.map(i=>{var s;return(s=i.end)!==null&&s!==void 0?s:i.pos})),create:fo.create,above:e[0].above,arrow:e.some(i=>i.arrow)}});class v0{constructor(e,i,s,r,n){this.view=e,this.source=i,this.field=s,this.setHover=r,this.hoverTime=n,this.hoverTimeout=-1,this.restartTimeout=-1,this.pending=null,this.lastMove={x:0,y:0,target:e.dom,time:0},this.checkHover=this.checkHover.bind(this),e.dom.addEventListener("mouseleave",this.mouseleave=this.mouseleave.bind(this)),e.dom.addEventListener("mousemove",this.mousemove=this.mousemove.bind(this))}update(){this.pending&&(this.pending=null,clearTimeout(this.restartTimeout),this.restartTimeout=setTimeout(()=>this.startHover(),20))}get active(){return this.view.state.field(this.field)}checkHover(){if(this.hoverTimeout=-1,this.active.length)return;let e=Date.now()-this.lastMove.time;e<this.hoverTime?this.hoverTimeout=setTimeout(this.checkHover,this.hoverTime-e):this.startHover()}startHover(){clearTimeout(this.restartTimeout);let{view:e,lastMove:i}=this,s=e.docView.tile.nearest(i.target);if(!s)return;let r,n=1;if(s.isWidget())r=s.posAtStart;else{if(r=e.posAtCoords(i),r==null)return;let a=e.coordsAtPos(r);if(!a||i.y<a.top||i.y>a.bottom||i.x<a.left-e.defaultCharacterWidth||i.x>a.right+e.defaultCharacterWidth)return;let l=e.bidiSpans(e.state.doc.lineAt(r)).find(c=>c.from<=r&&c.to>=r),h=l&&l.dir==ae.RTL?-1:1;n=i.x<a.left?-h:h}let o=this.source(e,r,n);if(o!=null&&o.then){let a=this.pending={pos:r};o.then(l=>{this.pending==a&&(this.pending=null,l&&!(Array.isArray(l)&&!l.length)&&e.dispatch({effects:this.setHover.of(Array.isArray(l)?l:[l])}))},l=>Qe(e.state,l,"hover tooltip"))}else o&&!(Array.isArray(o)&&!o.length)&&e.dispatch({effects:this.setHover.of(Array.isArray(o)?o:[o])})}get tooltip(){let e=this.view.plugin(Ul),i=e?e.manager.tooltips.findIndex(s=>s.create==fo.create):-1;return i>-1?e.manager.tooltipViews[i]:null}mousemove(e){var i,s;this.lastMove={x:e.clientX,y:e.clientY,target:e.target,time:Date.now()},this.hoverTimeout<0&&(this.hoverTimeout=setTimeout(this.checkHover,this.hoverTime));let{active:r,tooltip:n}=this;if(r.length&&n&&!y0(n.dom,e)||this.pending){let{pos:o}=r[0]||this.pending,a=(s=(i=r[0])===null||i===void 0?void 0:i.end)!==null&&s!==void 0?s:o;(o==a?this.view.posAtCoords(this.lastMove)!=o:!x0(this.view,o,a,e.clientX,e.clientY))&&(this.view.dispatch({effects:this.setHover.of([])}),this.pending=null)}}mouseleave(e){clearTimeout(this.hoverTimeout),this.hoverTimeout=-1;let{active:i}=this;if(i.length){let{tooltip:s}=this;s&&s.dom.contains(e.relatedTarget)?this.watchTooltipLeave(s.dom):this.view.dispatch({effects:this.setHover.of([])})}}watchTooltipLeave(e){let i=s=>{e.removeEventListener("mouseleave",i),this.active.length&&!this.view.dom.contains(s.relatedTarget)&&this.view.dispatch({effects:this.setHover.of([])})};e.addEventListener("mouseleave",i)}destroy(){clearTimeout(this.hoverTimeout),clearTimeout(this.restartTimeout),this.view.dom.removeEventListener("mouseleave",this.mouseleave),this.view.dom.removeEventListener("mousemove",this.mousemove)}}const Jr=4;function y0(t,e){let{left:i,right:s,top:r,bottom:n}=t.getBoundingClientRect(),o;if(o=t.querySelector(".cm-tooltip-arrow")){let a=o.getBoundingClientRect();r=Math.min(a.top,r),n=Math.max(a.bottom,n)}return e.clientX>=i-Jr&&e.clientX<=s+Jr&&e.clientY>=r-Jr&&e.clientY<=n+Jr}function x0(t,e,i,s,r,n){let o=t.scrollDOM.getBoundingClientRect(),a=t.documentTop+t.documentPadding.top+t.contentHeight;if(o.left>s||o.right<s||o.top>r||Math.min(o.bottom,a)<r)return!1;let l=t.posAtCoords({x:s,y:r},!1);return l>=e&&l<=i}function w0(t,e={}){let i=W.define(),s=Be.define({create(){return[]},update(r,n){if(r.length&&(e.hideOnChange&&(n.docChanged||n.selection)?r=[]:e.hideOn&&(r=r.filter(o=>!e.hideOn(n,o))),n.docChanged)){let o=[];for(let a of r){let l=n.changes.mapPos(a.pos,-1,Fe.TrackDel);if(l!=null){let h=Object.assign(Object.create(null),a);h.pos=l,h.end!=null&&(h.end=n.changes.mapPos(h.end)),o.push(h)}}r=o}for(let o of n.effects)o.is(i)&&(r=o.value),o.is(k0)&&(r=[]);return r},provide:r=>Ln.from(r)});return{active:s,extension:[s,ye.define(r=>new v0(r,t,s,i,e.hoverTime||300)),b0]}}function pf(t,e){let i=t.plugin(Ul);if(!i)return null;let s=i.manager.tooltips.indexOf(e);return s<0?null:i.manager.tooltipViews[s]}const k0=W.define(),Sc=R.define({combine(t){let e,i;for(let s of t)e=e||s.topContainer,i=i||s.bottomContainer;return{topContainer:e,bottomContainer:i}}});function Wl(t,e){let i=t.plugin(gf),s=i?i.specs.indexOf(e):-1;return s>-1?i.panels[s]:null}const gf=ye.fromClass(class{constructor(t){this.input=t.state.facet(pr),this.specs=this.input.filter(i=>i),this.panels=this.specs.map(i=>i(t));let e=t.state.facet(Sc);this.top=new Yr(t,!0,e.topContainer),this.bottom=new Yr(t,!1,e.bottomContainer),this.top.sync(this.panels.filter(i=>i.top)),this.bottom.sync(this.panels.filter(i=>!i.top));for(let i of this.panels)i.dom.classList.add("cm-panel"),i.mount&&i.mount()}update(t){let e=t.state.facet(Sc);this.top.container!=e.topContainer&&(this.top.sync([]),this.top=new Yr(t.view,!0,e.topContainer)),this.bottom.container!=e.bottomContainer&&(this.bottom.sync([]),this.bottom=new Yr(t.view,!1,e.bottomContainer)),this.top.syncClasses(),this.bottom.syncClasses();let i=t.state.facet(pr);if(i!=this.input){let s=i.filter(l=>l),r=[],n=[],o=[],a=[];for(let l of s){let h=this.specs.indexOf(l),c;h<0?(c=l(t.view),a.push(c)):(c=this.panels[h],c.update&&c.update(t)),r.push(c),(c.top?n:o).push(c)}this.specs=s,this.panels=r,this.top.sync(n),this.bottom.sync(o);for(let l of a)l.dom.classList.add("cm-panel"),l.mount&&l.mount()}else for(let s of this.panels)s.update&&s.update(t)}destroy(){this.top.sync([]),this.bottom.sync([])}},{provide:t=>L.scrollMargins.of(e=>{let i=e.plugin(t);return i&&{top:i.top.scrollMargin(),bottom:i.bottom.scrollMargin()}})});class Yr{constructor(e,i,s){this.view=e,this.top=i,this.container=s,this.dom=void 0,this.classes="",this.panels=[],this.syncClasses()}sync(e){for(let i of this.panels)i.destroy&&e.indexOf(i)<0&&i.destroy();this.panels=e,this.syncDOM()}syncDOM(){if(this.panels.length==0){this.dom&&(this.dom.remove(),this.dom=void 0);return}if(!this.dom){this.dom=document.createElement("div"),this.dom.className=this.top?"cm-panels cm-panels-top":"cm-panels cm-panels-bottom",this.dom.style[this.top?"top":"bottom"]="0";let i=this.container||this.view.dom;i.insertBefore(this.dom,this.top?i.firstChild:null)}let e=this.dom.firstChild;for(let i of this.panels)if(i.dom.parentNode==this.dom){for(;e!=i.dom;)e=Cc(e);e=e.nextSibling}else this.dom.insertBefore(i.dom,e);for(;e;)e=Cc(e)}scrollMargin(){return!this.dom||this.container?0:Math.max(0,this.top?this.dom.getBoundingClientRect().bottom-Math.max(0,this.view.scrollDOM.getBoundingClientRect().top):Math.min(innerHeight,this.view.scrollDOM.getBoundingClientRect().bottom)-this.dom.getBoundingClientRect().top)}syncClasses(){if(!(!this.container||this.classes==this.view.themeClasses)){for(let e of this.classes.split(" "))e&&this.container.classList.remove(e);for(let e of(this.classes=this.view.themeClasses).split(" "))e&&this.container.classList.add(e)}}}function Cc(t){let e=t.nextSibling;return t.remove(),e}const pr=R.define({enables:gf});function S0(t,e){let i,s=new Promise(o=>i=o),r=o=>C0(o,e,i);t.state.field(qo,!1)?t.dispatch({effects:mf.of(r)}):t.dispatch({effects:W.appendConfig.of(qo.init(()=>[r]))});let n=bf.of(r);return{close:n,result:s.then(o=>((t.win.queueMicrotask||(l=>t.win.setTimeout(l,10)))(()=>{t.state.field(qo).indexOf(r)>-1&&t.dispatch({effects:n})}),o))}}const qo=Be.define({create(){return[]},update(t,e){for(let i of e.effects)i.is(mf)?t=[i.value].concat(t):i.is(bf)&&(t=t.filter(s=>s!=i.value));return t},provide:t=>pr.computeN([t],e=>e.field(t))}),mf=W.define(),bf=W.define();function C0(t,e,i){let s=e.content?e.content(t,()=>o(null)):null;if(!s){if(s=se("form"),e.input){let a=se("input",e.input);/^(text|password|number|email|tel|url)$/.test(a.type)&&a.classList.add("cm-textfield"),a.name||(a.name="input"),s.appendChild(se("label",(e.label||"")+": ",a))}else s.appendChild(document.createTextNode(e.label||""));s.appendChild(document.createTextNode(" ")),s.appendChild(se("button",{class:"cm-button",type:"submit"},e.submitLabel||"OK"))}let r=s.nodeName=="FORM"?[s]:s.querySelectorAll("form");for(let a=0;a<r.length;a++){let l=r[a];l.addEventListener("keydown",h=>{h.keyCode==27?(h.preventDefault(),o(null)):h.keyCode==13&&(h.preventDefault(),o(l))}),l.addEventListener("submit",h=>{h.preventDefault(),o(l)})}let n=se("div",s,se("button",{onclick:()=>o(null),"aria-label":t.state.phrase("close"),class:"cm-dialog-close",type:"button"},["×"]));e.class&&(n.className=e.class),n.classList.add("cm-dialog");function o(a){n.contains(n.ownerDocument.activeElement)&&t.focus(),i(a)}return{dom:n,top:e.top,mount:()=>{if(e.focus){let a;typeof e.focus=="string"?a=s.querySelector(e.focus):a=s.querySelector("input")||s.querySelector("button"),a&&"select"in a?a.select():a&&"focus"in a&&a.focus()}}}}class Gt extends fi{compare(e){return this==e||this.constructor==e.constructor&&this.eq(e)}eq(e){return!1}destroy(e){}}Gt.prototype.elementClass="";Gt.prototype.toDOM=void 0;Gt.prototype.mapMode=Fe.TrackBefore;Gt.prototype.startSide=Gt.prototype.endSide=-1;Gt.prototype.point=!0;const mn=R.define(),$0=R.define(),O0={class:"",renderEmptyElements:!1,elementStyle:"",markers:()=>Q.empty,lineMarker:()=>null,widgetMarker:()=>null,lineMarkerChange:null,initialSpacer:null,updateSpacer:null,domEventHandlers:{},side:"before"},er=R.define();function A0(t){return[vf(),er.of({...O0,...t})]}const $c=R.define({combine:t=>t.some(e=>e)});function vf(t){return[P0]}const P0=ye.fromClass(class{constructor(t){this.view=t,this.domAfter=null,this.prevViewport=t.viewport,this.dom=document.createElement("div"),this.dom.className="cm-gutters cm-gutters-before",this.dom.setAttribute("aria-hidden","true"),this.dom.style.minHeight=this.view.contentHeight/this.view.scaleY+"px",this.gutters=t.state.facet(er).map(e=>new Ac(t,e)),this.fixed=!t.state.facet($c);for(let e of this.gutters)e.config.side=="after"?this.getDOMAfter().appendChild(e.dom):this.dom.appendChild(e.dom);this.fixed&&(this.dom.style.position="sticky"),this.syncGutters(!1),t.scrollDOM.insertBefore(this.dom,t.contentDOM)}getDOMAfter(){return this.domAfter||(this.domAfter=document.createElement("div"),this.domAfter.className="cm-gutters cm-gutters-after",this.domAfter.setAttribute("aria-hidden","true"),this.domAfter.style.minHeight=this.view.contentHeight/this.view.scaleY+"px",this.domAfter.style.position=this.fixed?"sticky":"",this.view.scrollDOM.appendChild(this.domAfter)),this.domAfter}update(t){if(this.updateGutters(t)){let e=this.prevViewport,i=t.view.viewport,s=Math.min(e.to,i.to)-Math.max(e.from,i.from);this.syncGutters(s<(i.to-i.from)*.8)}if(t.geometryChanged){let e=this.view.contentHeight/this.view.scaleY+"px";this.dom.style.minHeight=e,this.domAfter&&(this.domAfter.style.minHeight=e)}this.view.state.facet($c)!=!this.fixed&&(this.fixed=!this.fixed,this.dom.style.position=this.fixed?"sticky":"",this.domAfter&&(this.domAfter.style.position=this.fixed?"sticky":"")),this.prevViewport=t.view.viewport}syncGutters(t){let e=this.dom.nextSibling;t&&(this.dom.remove(),this.domAfter&&this.domAfter.remove());let i=Q.iter(this.view.state.facet(mn),this.view.viewport.from),s=[],r=this.gutters.map(n=>new T0(n,this.view.viewport,-this.view.documentPadding.top));for(let n of this.view.viewportLineBlocks)if(s.length&&(s=[]),Array.isArray(n.type)){let o=!0;for(let a of n.type)if(a.type==Te.Text&&o){Qa(i,s,a.from);for(let l of r)l.line(this.view,a,s);o=!1}else if(a.widget)for(let l of r)l.widget(this.view,a)}else if(n.type==Te.Text){Qa(i,s,n.from);for(let o of r)o.line(this.view,n,s)}else if(n.widget)for(let o of r)o.widget(this.view,n);for(let n of r)n.finish();t&&(this.view.scrollDOM.insertBefore(this.dom,e),this.domAfter&&this.view.scrollDOM.appendChild(this.domAfter))}updateGutters(t){let e=t.startState.facet(er),i=t.state.facet(er),s=t.docChanged||t.heightChanged||t.viewportChanged||!Q.eq(t.startState.facet(mn),t.state.facet(mn),t.view.viewport.from,t.view.viewport.to);if(e==i)for(let r of this.gutters)r.update(t)&&(s=!0);else{s=!0;let r=[];for(let n of i){let o=e.indexOf(n);o<0?r.push(new Ac(this.view,n)):(this.gutters[o].update(t),r.push(this.gutters[o]))}for(let n of this.gutters)n.dom.remove(),r.indexOf(n)<0&&n.destroy();for(let n of r)n.config.side=="after"?this.getDOMAfter().appendChild(n.dom):this.dom.appendChild(n.dom);this.gutters=r}return s}destroy(){for(let t of this.gutters)t.destroy();this.dom.remove(),this.domAfter&&this.domAfter.remove()}},{provide:t=>L.scrollMargins.of(e=>{let i=e.plugin(t);if(!i||i.gutters.length==0||!i.fixed)return null;let s=i.dom.offsetWidth*e.scaleX,r=i.domAfter?i.domAfter.offsetWidth*e.scaleX:0;return e.textDirection==ae.LTR?{left:s,right:r}:{right:s,left:r}})});function Oc(t){return Array.isArray(t)?t:[t]}function Qa(t,e,i){for(;t.value&&t.from<=i;)t.from==i&&e.push(t.value),t.next()}class T0{constructor(e,i,s){this.gutter=e,this.height=s,this.i=0,this.cursor=Q.iter(e.markers,i.from)}addElement(e,i,s){let{gutter:r}=this,n=(i.top-this.height)/e.scaleY,o=i.height/e.scaleY;if(this.i==r.elements.length){let a=new yf(e,o,n,s);r.elements.push(a),r.dom.appendChild(a.dom)}else r.elements[this.i].update(e,o,n,s);this.height=i.bottom,this.i++}line(e,i,s){let r=[];Qa(this.cursor,r,i.from),s.length&&(r=r.concat(s));let n=this.gutter.config.lineMarker(e,i,r);n&&r.unshift(n);let o=this.gutter;r.length==0&&!o.config.renderEmptyElements||this.addElement(e,i,r)}widget(e,i){let s=this.gutter.config.widgetMarker(e,i.widget,i),r=s?[s]:null;for(let n of e.state.facet($0)){let o=n(e,i.widget,i);o&&(r||(r=[])).push(o)}r&&this.addElement(e,i,r)}finish(){let e=this.gutter;for(;e.elements.length>this.i;){let i=e.elements.pop();e.dom.removeChild(i.dom),i.destroy()}}}class Ac{constructor(e,i){this.view=e,this.config=i,this.elements=[],this.spacer=null,this.dom=document.createElement("div"),this.dom.className="cm-gutter"+(this.config.class?" "+this.config.class:"");for(let s in i.domEventHandlers)this.dom.addEventListener(s,r=>{let n=r.target,o;if(n!=this.dom&&this.dom.contains(n)){for(;n.parentNode!=this.dom;)n=n.parentNode;let l=n.getBoundingClientRect();o=(l.top+l.bottom)/2}else o=r.clientY;let a=e.lineBlockAtHeight(o-e.documentTop);i.domEventHandlers[s](e,a,r)&&r.preventDefault()});this.markers=Oc(i.markers(e)),i.initialSpacer&&(this.spacer=new yf(e,0,0,[i.initialSpacer(e)]),this.dom.appendChild(this.spacer.dom),this.spacer.dom.style.cssText+="visibility: hidden; pointer-events: none")}update(e){let i=this.markers;if(this.markers=Oc(this.config.markers(e.view)),this.spacer&&this.config.updateSpacer){let r=this.config.updateSpacer(this.spacer.markers[0],e);r!=this.spacer.markers[0]&&this.spacer.update(e.view,0,0,[r])}let s=e.view.viewport;return!Q.eq(this.markers,i,s.from,s.to)||(this.config.lineMarkerChange?this.config.lineMarkerChange(e):!1)}destroy(){for(let e of this.elements)e.destroy()}}class yf{constructor(e,i,s,r){this.height=-1,this.above=0,this.markers=[],this.dom=document.createElement("div"),this.dom.className="cm-gutterElement",this.update(e,i,s,r)}update(e,i,s,r){this.height!=i&&(this.height=i,this.dom.style.height=i+"px"),this.above!=s&&(this.dom.style.marginTop=(this.above=s)?s+"px":""),M0(this.markers,r)||this.setMarkers(e,r)}setMarkers(e,i){let s="cm-gutterElement",r=this.dom.firstChild;for(let n=0,o=0;;){let a=o,l=n<i.length?i[n++]:null,h=!1;if(l){let c=l.elementClass;c&&(s+=" "+c);for(let d=o;d<this.markers.length;d++)if(this.markers[d].compare(l)){a=d,h=!0;break}}else a=this.markers.length;for(;o<a;){let c=this.markers[o++];if(c.toDOM){c.destroy(r);let d=r.nextSibling;r.remove(),r=d}}if(!l)break;l.toDOM&&(h?r=r.nextSibling:this.dom.insertBefore(l.toDOM(e),r)),h&&o++}this.dom.className=s,this.markers=i}destroy(){this.setMarkers(null,[])}}function M0(t,e){if(t.length!=e.length)return!1;for(let i=0;i<t.length;i++)if(!t[i].compare(e[i]))return!1;return!0}const E0=R.define(),_0=R.define(),as=R.define({combine(t){return zt(t,{formatNumber:String,domEventHandlers:{}},{domEventHandlers(e,i){let s=Object.assign({},e);for(let r in i){let n=s[r],o=i[r];s[r]=n?(a,l,h)=>n(a,l,h)||o(a,l,h):o}return s}})}});class Vo extends Gt{constructor(e){super(),this.number=e}eq(e){return this.number==e.number}toDOM(){return document.createTextNode(this.number)}}function jo(t,e){return t.state.facet(as).formatNumber(e,t.state)}const D0=er.compute([as],t=>({class:"cm-lineNumbers",renderEmptyElements:!1,markers(e){return e.state.facet(E0)},lineMarker(e,i,s){return s.some(r=>r.toDOM)?null:new Vo(jo(e,e.state.doc.lineAt(i.from).number))},widgetMarker:(e,i,s)=>{for(let r of e.state.facet(_0)){let n=r(e,i,s);if(n)return n}return null},lineMarkerChange:e=>e.startState.facet(as)!=e.state.facet(as),initialSpacer(e){return new Vo(jo(e,Pc(e.state.doc.lines)))},updateSpacer(e,i){let s=jo(i.view,Pc(i.view.state.doc.lines));return s==e.number?e:new Vo(s)},domEventHandlers:t.facet(as).domEventHandlers,side:"before"}));function B0(t={}){return[as.of(t),vf(),D0]}function Pc(t){let e=9;for(;e<t;)e=e*10+9;return e}const R0=new class extends Gt{constructor(){super(...arguments),this.elementClass="cm-activeLineGutter"}},L0=mn.compute(["selection"],t=>{let e=[],i=-1;for(let s of t.selection.ranges){let r=t.doc.lineAt(s.head).from;r>i&&(i=r,e.push(R0.range(r)))}return Q.of(e)});function I0(){return L0}const xf=1024;let F0=0;class Qo{constructor(e,i){this.from=e,this.to=i}}class V{constructor(e={}){this.id=F0++,this.perNode=!!e.perNode,this.deserialize=e.deserialize||(()=>{throw new Error("This node type doesn't define a deserialize function")}),this.combine=e.combine||null}add(e){if(this.perNode)throw new RangeError("Can't add per-node props to node types");return typeof e!="function"&&(e=Ye.match(e)),i=>{let s=e(i);return s===void 0?null:[this,s]}}}V.closedBy=new V({deserialize:t=>t.split(" ")});V.openedBy=new V({deserialize:t=>t.split(" ")});V.group=new V({deserialize:t=>t.split(" ")});V.isolate=new V({deserialize:t=>{if(t&&t!="rtl"&&t!="ltr"&&t!="auto")throw new RangeError("Invalid value for isolate: "+t);return t||"auto"}});V.contextHash=new V({perNode:!0});V.lookAhead=new V({perNode:!0});V.mounted=new V({perNode:!0});class tr{constructor(e,i,s,r=!1){this.tree=e,this.overlay=i,this.parser=s,this.bracketed=r}static get(e){return e&&e.props&&e.props[V.mounted.id]}}const N0=Object.create(null);class Ye{constructor(e,i,s,r=0){this.name=e,this.props=i,this.id=s,this.flags=r}static define(e){let i=e.props&&e.props.length?Object.create(null):N0,s=(e.top?1:0)|(e.skipped?2:0)|(e.error?4:0)|(e.name==null?8:0),r=new Ye(e.name||"",i,e.id,s);if(e.props){for(let n of e.props)if(Array.isArray(n)||(n=n(r)),n){if(n[0].perNode)throw new RangeError("Can't store a per-node prop on a node type");i[n[0].id]=n[1]}}return r}prop(e){return this.props[e.id]}get isTop(){return(this.flags&1)>0}get isSkipped(){return(this.flags&2)>0}get isError(){return(this.flags&4)>0}get isAnonymous(){return(this.flags&8)>0}is(e){if(typeof e=="string"){if(this.name==e)return!0;let i=this.prop(V.group);return i?i.indexOf(e)>-1:!1}return this.id==e}static match(e){let i=Object.create(null);for(let s in e)for(let r of s.split(" "))i[r]=e[s];return s=>{for(let r=s.prop(V.group),n=-1;n<(r?r.length:0);n++){let o=i[n<0?s.name:r[n]];if(o)return o}}}}Ye.none=new Ye("",Object.create(null),0,8);class zl{constructor(e){this.types=e;for(let i=0;i<e.length;i++)if(e[i].id!=i)throw new RangeError("Node type ids should correspond to array positions when creating a node set")}extend(...e){let i=[];for(let s of this.types){let r=null;for(let n of e){let o=n(s);if(o){r||(r=Object.assign({},s.props));let a=o[1],l=o[0];l.combine&&l.id in r&&(a=l.combine(r[l.id],a)),r[l.id]=a}}i.push(r?new Ye(s.name,r,s.id,s.flags):s)}return new zl(i)}}const Gr=new WeakMap,Tc=new WeakMap;var ge;(function(t){t[t.ExcludeBuffers=1]="ExcludeBuffers",t[t.IncludeAnonymous=2]="IncludeAnonymous",t[t.IgnoreMounts=4]="IgnoreMounts",t[t.IgnoreOverlays=8]="IgnoreOverlays",t[t.EnterBracketed=16]="EnterBracketed"})(ge||(ge={}));class ve{constructor(e,i,s,r,n){if(this.type=e,this.children=i,this.positions=s,this.length=r,this.props=null,n&&n.length){this.props=Object.create(null);for(let[o,a]of n)this.props[typeof o=="number"?o:o.id]=a}}toString(){let e=tr.get(this);if(e&&!e.overlay)return e.tree.toString();let i="";for(let s of this.children){let r=s.toString();r&&(i&&(i+=","),i+=r)}return this.type.name?(/\W/.test(this.type.name)&&!this.type.isError?JSON.stringify(this.type.name):this.type.name)+(i.length?"("+i+")":""):i}cursor(e=0){return new Xa(this.topNode,e)}cursorAt(e,i=0,s=0){let r=Gr.get(this)||this.topNode,n=new Xa(r);return n.moveTo(e,i),Gr.set(this,n._tree),n}get topNode(){return new ft(this,0,0,null)}resolve(e,i=0){let s=gr(Gr.get(this)||this.topNode,e,i,!1);return Gr.set(this,s),s}resolveInner(e,i=0){let s=gr(Tc.get(this)||this.topNode,e,i,!0);return Tc.set(this,s),s}resolveStack(e,i=0){return W0(this,e,i)}iterate(e){let{enter:i,leave:s,from:r=0,to:n=this.length}=e,o=e.mode||0,a=(o&ge.IncludeAnonymous)>0;for(let l=this.cursor(o|ge.IncludeAnonymous);;){let h=!1;if(l.from<=n&&l.to>=r&&(!a&&l.type.isAnonymous||i(l)!==!1)){if(l.firstChild())continue;h=!0}for(;h&&s&&(a||!l.type.isAnonymous)&&s(l),!l.nextSibling();){if(!l.parent())return;h=!0}}}prop(e){return e.perNode?this.props?this.props[e.id]:void 0:this.type.prop(e)}get propValues(){let e=[];if(this.props)for(let i in this.props)e.push([+i,this.props[i]]);return e}balance(e={}){return this.children.length<=8?this:jl(Ye.none,this.children,this.positions,0,this.children.length,0,this.length,(i,s,r)=>new ve(this.type,i,s,r,this.propValues),e.makeTree||((i,s,r)=>new ve(Ye.none,i,s,r)))}static build(e){return z0(e)}}ve.empty=new ve(Ye.none,[],[],0);class ql{constructor(e,i){this.buffer=e,this.index=i}get id(){return this.buffer[this.index-4]}get start(){return this.buffer[this.index-3]}get end(){return this.buffer[this.index-2]}get size(){return this.buffer[this.index-1]}get pos(){return this.index}next(){this.index-=4}fork(){return new ql(this.buffer,this.index)}}class bi{constructor(e,i,s){this.buffer=e,this.length=i,this.set=s}get type(){return Ye.none}toString(){let e=[];for(let i=0;i<this.buffer.length;)e.push(this.childString(i)),i=this.buffer[i+3];return e.join(",")}childString(e){let i=this.buffer[e],s=this.buffer[e+3],r=this.set.types[i],n=r.name;if(/\W/.test(n)&&!r.isError&&(n=JSON.stringify(n)),e+=4,s==e)return n;let o=[];for(;e<s;)o.push(this.childString(e)),e=this.buffer[e+3];return n+"("+o.join(",")+")"}findChild(e,i,s,r,n){let{buffer:o}=this,a=-1;for(let l=e;l!=i&&!(wf(n,r,o[l+1],o[l+2])&&(a=l,s>0));l=o[l+3]);return a}slice(e,i,s){let r=this.buffer,n=new Uint16Array(i-e),o=0;for(let a=e,l=0;a<i;){n[l++]=r[a++],n[l++]=r[a++]-s;let h=n[l++]=r[a++]-s;n[l++]=r[a++]-e,o=Math.max(o,h)}return new bi(n,o,this.set)}}function wf(t,e,i,s){switch(t){case-2:return i<e;case-1:return s>=e&&i<e;case 0:return i<e&&s>e;case 1:return i<=e&&s>e;case 2:return s>e;case 4:return!0}}function gr(t,e,i,s){for(var r;t.from==t.to||(i<1?t.from>=e:t.from>e)||(i>-1?t.to<=e:t.to<e);){let o=!s&&t instanceof ft&&t.index<0?null:t.parent;if(!o)return t;t=o}let n=s?0:ge.IgnoreOverlays;if(s)for(let o=t,a=o.parent;a;o=a,a=o.parent)o instanceof ft&&o.index<0&&((r=a.enter(e,i,n))===null||r===void 0?void 0:r.from)!=o.from&&(t=a);for(;;){let o=t.enter(e,i,n);if(!o)return t;t=o}}class kf{cursor(e=0){return new Xa(this,e)}getChild(e,i=null,s=null){let r=Mc(this,e,i,s);return r.length?r[0]:null}getChildren(e,i=null,s=null){return Mc(this,e,i,s)}resolve(e,i=0){return gr(this,e,i,!1)}resolveInner(e,i=0){return gr(this,e,i,!0)}matchContext(e){return Ka(this.parent,e)}enterUnfinishedNodesBefore(e){let i=this.childBefore(e),s=this;for(;i;){let r=i.lastChild;if(!r||r.to!=i.to)break;r.type.isError&&r.from==r.to?(s=i,i=r.prevSibling):i=r}return s}get node(){return this}get next(){return this.parent}}class ft extends kf{constructor(e,i,s,r){super(),this._tree=e,this.from=i,this.index=s,this._parent=r}get type(){return this._tree.type}get name(){return this._tree.type.name}get to(){return this.from+this._tree.length}nextChild(e,i,s,r,n=0){for(let o=this;;){for(let{children:a,positions:l}=o._tree,h=i>0?a.length:-1;e!=h;e+=i){let c=a[e],d=l[e]+o.from,u;if(!(!(n&ge.EnterBracketed&&c instanceof ve&&(u=tr.get(c))&&!u.overlay&&u.bracketed&&s>=d&&s<=d+c.length)&&!wf(r,s,d,d+c.length))){if(c instanceof bi){if(n&ge.ExcludeBuffers)continue;let f=c.findChild(0,c.buffer.length,i,s-d,r);if(f>-1)return new li(new U0(o,c,e,d),null,f)}else if(n&ge.IncludeAnonymous||!c.type.isAnonymous||Vl(c)){let f;if(!(n&ge.IgnoreMounts)&&(f=tr.get(c))&&!f.overlay)return new ft(f.tree,d,e,o);let g=new ft(c,d,e,o);return n&ge.IncludeAnonymous||!g.type.isAnonymous?g:g.nextChild(i<0?c.children.length-1:0,i,s,r,n)}}}if(n&ge.IncludeAnonymous||!o.type.isAnonymous||(o.index>=0?e=o.index+i:e=i<0?-1:o._parent._tree.children.length,o=o._parent,!o))return null}}get firstChild(){return this.nextChild(0,1,0,4)}get lastChild(){return this.nextChild(this._tree.children.length-1,-1,0,4)}childAfter(e){return this.nextChild(0,1,e,2)}childBefore(e){return this.nextChild(this._tree.children.length-1,-1,e,-2)}prop(e){return this._tree.prop(e)}enter(e,i,s=0){let r;if(!(s&ge.IgnoreOverlays)&&(r=tr.get(this._tree))&&r.overlay){let n=e-this.from,o=s&ge.EnterBracketed&&r.bracketed;for(let{from:a,to:l}of r.overlay)if((i>0||o?a<=n:a<n)&&(i<0||o?l>=n:l>n))return new ft(r.tree,r.overlay[0].from+this.from,-1,this)}return this.nextChild(0,1,e,i,s)}nextSignificantParent(){let e=this;for(;e.type.isAnonymous&&e._parent;)e=e._parent;return e}get parent(){return this._parent?this._parent.nextSignificantParent():null}get nextSibling(){return this._parent&&this.index>=0?this._parent.nextChild(this.index+1,1,0,4):null}get prevSibling(){return this._parent&&this.index>=0?this._parent.nextChild(this.index-1,-1,0,4):null}get tree(){return this._tree}toTree(){return this._tree}toString(){return this._tree.toString()}}function Mc(t,e,i,s){let r=t.cursor(),n=[];if(!r.firstChild())return n;if(i!=null){for(let o=!1;!o;)if(o=r.type.is(i),!r.nextSibling())return n}for(;;){if(s!=null&&r.type.is(s))return n;if(r.type.is(e)&&n.push(r.node),!r.nextSibling())return s==null?n:[]}}function Ka(t,e,i=e.length-1){for(let s=t;i>=0;s=s.parent){if(!s)return!1;if(!s.type.isAnonymous){if(e[i]&&e[i]!=s.name)return!1;i--}}return!0}class U0{constructor(e,i,s,r){this.parent=e,this.buffer=i,this.index=s,this.start=r}}class li extends kf{get name(){return this.type.name}get from(){return this.context.start+this.context.buffer.buffer[this.index+1]}get to(){return this.context.start+this.context.buffer.buffer[this.index+2]}constructor(e,i,s){super(),this.context=e,this._parent=i,this.index=s,this.type=e.buffer.set.types[e.buffer.buffer[s]]}child(e,i,s){let{buffer:r}=this.context,n=r.findChild(this.index+4,r.buffer[this.index+3],e,i-this.context.start,s);return n<0?null:new li(this.context,this,n)}get firstChild(){return this.child(1,0,4)}get lastChild(){return this.child(-1,0,4)}childAfter(e){return this.child(1,e,2)}childBefore(e){return this.child(-1,e,-2)}prop(e){return this.type.prop(e)}enter(e,i,s=0){if(s&ge.ExcludeBuffers)return null;let{buffer:r}=this.context,n=r.findChild(this.index+4,r.buffer[this.index+3],i>0?1:-1,e-this.context.start,i);return n<0?null:new li(this.context,this,n)}get parent(){return this._parent||this.context.parent.nextSignificantParent()}externalSibling(e){return this._parent?null:this.context.parent.nextChild(this.context.index+e,e,0,4)}get nextSibling(){let{buffer:e}=this.context,i=e.buffer[this.index+3];return i<(this._parent?e.buffer[this._parent.index+3]:e.buffer.length)?new li(this.context,this._parent,i):this.externalSibling(1)}get prevSibling(){let{buffer:e}=this.context,i=this._parent?this._parent.index+4:0;return this.index==i?this.externalSibling(-1):new li(this.context,this._parent,e.findChild(i,this.index,-1,0,4))}get tree(){return null}toTree(){let e=[],i=[],{buffer:s}=this.context,r=this.index+4,n=s.buffer[this.index+3];if(n>r){let o=s.buffer[this.index+1];e.push(s.slice(r,n,o)),i.push(0)}return new ve(this.type,e,i,this.to-this.from)}toString(){return this.context.buffer.childString(this.index)}}function Sf(t){if(!t.length)return null;let e=0,i=t[0];for(let n=1;n<t.length;n++){let o=t[n];(o.from>i.from||o.to<i.to)&&(i=o,e=n)}let s=i instanceof ft&&i.index<0?null:i.parent,r=t.slice();return s?r[e]=s:r.splice(e,1),new H0(r,i)}class H0{constructor(e,i){this.heads=e,this.node=i}get next(){return Sf(this.heads)}}function W0(t,e,i){let s=t.resolveInner(e,i),r=null;for(let n=s instanceof ft?s:s.context.parent;n;n=n.parent)if(n.index<0){let o=n.parent;(r||(r=[s])).push(o.resolve(e,i)),n=o}else{let o=tr.get(n.tree);if(o&&o.overlay&&o.overlay[0].from<=e&&o.overlay[o.overlay.length-1].to>=e){let a=new ft(o.tree,o.overlay[0].from+n.from,-1,n);(r||(r=[s])).push(gr(a,e,i,!1))}}return r?Sf(r):s}class Xa{get name(){return this.type.name}constructor(e,i=0){if(this.buffer=null,this.stack=[],this.index=0,this.bufferNode=null,this.mode=i&~ge.EnterBracketed,e instanceof ft)this.yieldNode(e);else{this._tree=e.context.parent,this.buffer=e.context;for(let s=e._parent;s;s=s._parent)this.stack.unshift(s.index);this.bufferNode=e,this.yieldBuf(e.index)}}yieldNode(e){return e?(this._tree=e,this.type=e.type,this.from=e.from,this.to=e.to,!0):!1}yieldBuf(e,i){this.index=e;let{start:s,buffer:r}=this.buffer;return this.type=i||r.set.types[r.buffer[e]],this.from=s+r.buffer[e+1],this.to=s+r.buffer[e+2],!0}yield(e){return e?e instanceof ft?(this.buffer=null,this.yieldNode(e)):(this.buffer=e.context,this.yieldBuf(e.index,e.type)):!1}toString(){return this.buffer?this.buffer.buffer.childString(this.index):this._tree.toString()}enterChild(e,i,s){if(!this.buffer)return this.yield(this._tree.nextChild(e<0?this._tree._tree.children.length-1:0,e,i,s,this.mode));let{buffer:r}=this.buffer,n=r.findChild(this.index+4,r.buffer[this.index+3],e,i-this.buffer.start,s);return n<0?!1:(this.stack.push(this.index),this.yieldBuf(n))}firstChild(){return this.enterChild(1,0,4)}lastChild(){return this.enterChild(-1,0,4)}childAfter(e){return this.enterChild(1,e,2)}childBefore(e){return this.enterChild(-1,e,-2)}enter(e,i,s=this.mode){return this.buffer?s&ge.ExcludeBuffers?!1:this.enterChild(1,e,i):this.yield(this._tree.enter(e,i,s))}parent(){if(!this.buffer)return this.yieldNode(this.mode&ge.IncludeAnonymous?this._tree._parent:this._tree.parent);if(this.stack.length)return this.yieldBuf(this.stack.pop());let e=this.mode&ge.IncludeAnonymous?this.buffer.parent:this.buffer.parent.nextSignificantParent();return this.buffer=null,this.yieldNode(e)}sibling(e){if(!this.buffer)return this._tree._parent?this.yield(this._tree.index<0?null:this._tree._parent.nextChild(this._tree.index+e,e,0,4,this.mode)):!1;let{buffer:i}=this.buffer,s=this.stack.length-1;if(e<0){let r=s<0?0:this.stack[s]+4;if(this.index!=r)return this.yieldBuf(i.findChild(r,this.index,-1,0,4))}else{let r=i.buffer[this.index+3];if(r<(s<0?i.buffer.length:i.buffer[this.stack[s]+3]))return this.yieldBuf(r)}return s<0?this.yield(this.buffer.parent.nextChild(this.buffer.index+e,e,0,4,this.mode)):!1}nextSibling(){return this.sibling(1)}prevSibling(){return this.sibling(-1)}atLastNode(e){let i,s,{buffer:r}=this;if(r){if(e>0){if(this.index<r.buffer.buffer.length)return!1}else for(let n=0;n<this.index;n++)if(r.buffer.buffer[n+3]<this.index)return!1;({index:i,parent:s}=r)}else({index:i,_parent:s}=this._tree);for(;s;{index:i,_parent:s}=s)if(i>-1)for(let n=i+e,o=e<0?-1:s._tree.children.length;n!=o;n+=e){let a=s._tree.children[n];if(this.mode&ge.IncludeAnonymous||a instanceof bi||!a.type.isAnonymous||Vl(a))return!1}return!0}move(e,i){if(i&&this.enterChild(e,0,4))return!0;for(;;){if(this.sibling(e))return!0;if(this.atLastNode(e)||!this.parent())return!1}}next(e=!0){return this.move(1,e)}prev(e=!0){return this.move(-1,e)}moveTo(e,i=0){for(;(this.from==this.to||(i<1?this.from>=e:this.from>e)||(i>-1?this.to<=e:this.to<e))&&this.parent(););for(;this.enterChild(1,e,i););return this}get node(){if(!this.buffer)return this._tree;let e=this.bufferNode,i=null,s=0;if(e&&e.context==this.buffer)e:for(let r=this.index,n=this.stack.length;n>=0;){for(let o=e;o;o=o._parent)if(o.index==r){if(r==this.index)return o;i=o,s=n+1;break e}r=this.stack[--n]}for(let r=s;r<this.stack.length;r++)i=new li(this.buffer,i,this.stack[r]);return this.bufferNode=new li(this.buffer,i,this.index)}get tree(){return this.buffer?null:this._tree._tree}iterate(e,i){for(let s=0;;){let r=!1;if(this.type.isAnonymous||e(this)!==!1){if(this.firstChild()){s++;continue}this.type.isAnonymous||(r=!0)}for(;;){if(r&&i&&i(this),r=this.type.isAnonymous,!s)return;if(this.nextSibling())break;this.parent(),s--,r=!0}}}matchContext(e){if(!this.buffer)return Ka(this.node.parent,e);let{buffer:i}=this.buffer,{types:s}=i.set;for(let r=e.length-1,n=this.stack.length-1;r>=0;n--){if(n<0)return Ka(this._tree,e,r);let o=s[i.buffer[this.stack[n]]];if(!o.isAnonymous){if(e[r]&&e[r]!=o.name)return!1;r--}}return!0}}function Vl(t){return t.children.some(e=>e instanceof bi||!e.type.isAnonymous||Vl(e))}function z0(t){var e;let{buffer:i,nodeSet:s,maxBufferLength:r=xf,reused:n=[],minRepeatType:o=s.types.length}=t,a=Array.isArray(i)?new ql(i,i.length):i,l=s.types,h=0,c=0;function d(A,P,T,H,K,ne){let{id:j,start:N,end:ee,size:G}=a,he=c,Le=h;if(G<0)if(a.next(),G==-1){let qt=n[j];T.push(qt),H.push(N-A);return}else if(G==-3){h=j;return}else if(G==-4){c=j;return}else throw new RangeError(`Unrecognized record size: ${G}`);let Ge=l[j],$t,Oe,lt=N-A;if(ee-N<=r&&(Oe=y(a.pos-P,K))){let qt=new Uint16Array(Oe.size-Oe.skip),ht=a.pos-Oe.size,Ot=qt.length;for(;a.pos>ht;)Ot=w(Oe.start,qt,Ot);$t=new bi(qt,ee-Oe.start,s),lt=Oe.start-A}else{let qt=a.pos-G;a.next();let ht=[],Ot=[],$i=j>=o?j:-1,Zi=0,Lr=ee;for(;a.pos>qt;)$i>=0&&a.id==$i&&a.size>=0?(a.end<=Lr-r&&(g(ht,Ot,N,Zi,a.end,Lr,$i,he,Le),Zi=ht.length,Lr=a.end),a.next()):ne>2500?u(N,qt,ht,Ot):d(N,qt,ht,Ot,$i,ne+1);if($i>=0&&Zi>0&&Zi<ht.length&&g(ht,Ot,N,Zi,N,Lr,$i,he,Le),ht.reverse(),Ot.reverse(),$i>-1&&Zi>0){let mh=f(Ge,Le);$t=jl(Ge,ht,Ot,0,ht.length,0,ee-N,mh,mh)}else $t=m(Ge,ht,Ot,ee-N,he-ee,Le)}T.push($t),H.push(lt)}function u(A,P,T,H){let K=[],ne=0,j=-1;for(;a.pos>P;){let{id:N,start:ee,end:G,size:he}=a;if(he>4)a.next();else{if(j>-1&&ee<j)break;j<0&&(j=G-r),K.push(N,ee,G),ne++,a.next()}}if(ne){let N=new Uint16Array(ne*4),ee=K[K.length-2];for(let G=K.length-3,he=0;G>=0;G-=3)N[he++]=K[G],N[he++]=K[G+1]-ee,N[he++]=K[G+2]-ee,N[he++]=he;T.push(new bi(N,K[2]-ee,s)),H.push(ee-A)}}function f(A,P){return(T,H,K)=>{let ne=0,j=T.length-1,N,ee;if(j>=0&&(N=T[j])instanceof ve){if(!j&&N.type==A&&N.length==K)return N;(ee=N.prop(V.lookAhead))&&(ne=H[j]+N.length+ee)}return m(A,T,H,K,ne,P)}}function g(A,P,T,H,K,ne,j,N,ee){let G=[],he=[];for(;A.length>H;)G.push(A.pop()),he.push(P.pop()+T-K);A.push(m(s.types[j],G,he,ne-K,N-ne,ee)),P.push(K-T)}function m(A,P,T,H,K,ne,j){if(ne){let N=[V.contextHash,ne];j=j?[N].concat(j):[N]}if(K>25){let N=[V.lookAhead,K];j=j?[N].concat(j):[N]}return new ve(A,P,T,H,j)}function y(A,P){let T=a.fork(),H=0,K=0,ne=0,j=T.end-r,N={size:0,start:0,skip:0};e:for(let ee=T.pos-A;T.pos>ee;){let G=T.size;if(T.id==P&&G>=0){N.size=H,N.start=K,N.skip=ne,ne+=4,H+=4,T.next();continue}let he=T.pos-G;if(G<0||he<ee||T.start<j)break;let Le=T.id>=o?4:0,Ge=T.start;for(T.next();T.pos>he;){if(T.size<0)if(T.size==-3||T.size==-4)Le+=4;else break e;else T.id>=o&&(Le+=4);T.next()}K=Ge,H+=G,ne+=Le}return(P<0||H==A)&&(N.size=H,N.start=K,N.skip=ne),N.size>4?N:void 0}function w(A,P,T){let{id:H,start:K,end:ne,size:j}=a;if(a.next(),j>=0&&H<o){let N=T;if(j>4){let ee=a.pos-(j-4);for(;a.pos>ee;)T=w(A,P,T)}P[--T]=N,P[--T]=ne-A,P[--T]=K-A,P[--T]=H}else j==-3?h=H:j==-4&&(c=H);return T}let x=[],O=[];for(;a.pos>0;)d(t.start||0,t.bufferStart||0,x,O,-1,0);let D=(e=t.length)!==null&&e!==void 0?e:x.length?O[0]+x[0].length:0;return new ve(l[t.topID],x.reverse(),O.reverse(),D)}const Ec=new WeakMap;function bn(t,e){if(!t.isAnonymous||e instanceof bi||e.type!=t)return 1;let i=Ec.get(e);if(i==null){i=1;for(let s of e.children){if(s.type!=t||!(s instanceof ve)){i=1;break}i+=bn(t,s)}Ec.set(e,i)}return i}function jl(t,e,i,s,r,n,o,a,l){let h=0;for(let g=s;g<r;g++)h+=bn(t,e[g]);let c=Math.ceil(h*1.5/8),d=[],u=[];function f(g,m,y,w,x){for(let O=y;O<w;){let D=O,A=m[O],P=bn(t,g[O]);for(O++;O<w;O++){let T=bn(t,g[O]);if(P+T>=c)break;P+=T}if(O==D+1){if(P>c){let T=g[D];f(T.children,T.positions,0,T.children.length,m[D]+x);continue}d.push(g[D])}else{let T=m[O-1]+g[O-1].length-A;d.push(jl(t,g,m,D,O,A,T,null,l))}u.push(A+x-n)}}return f(e,i,s,r,0),(a||l)(d,u,o)}class Hi{constructor(e,i,s,r,n=!1,o=!1){this.from=e,this.to=i,this.tree=s,this.offset=r,this.open=(n?1:0)|(o?2:0)}get openStart(){return(this.open&1)>0}get openEnd(){return(this.open&2)>0}static addTree(e,i=[],s=!1){let r=[new Hi(0,e.length,e,0,!1,s)];for(let n of i)n.to>e.length&&r.push(n);return r}static applyChanges(e,i,s=128){if(!i.length)return e;let r=[],n=1,o=e.length?e[0]:null;for(let a=0,l=0,h=0;;a++){let c=a<i.length?i[a]:null,d=c?c.fromA:1e9;if(d-l>=s)for(;o&&o.from<d;){let u=o;if(l>=u.from||d<=u.to||h){let f=Math.max(u.from,l)-h,g=Math.min(u.to,d)-h;u=f>=g?null:new Hi(f,g,u.tree,u.offset+h,a>0,!!c)}if(u&&r.push(u),o.to>d)break;o=n<e.length?e[n++]:null}if(!c)break;l=c.toA,h=c.toA-c.toB}return r}}class Cf{startParse(e,i,s){return typeof e=="string"&&(e=new q0(e)),s=s?s.length?s.map(r=>new Qo(r.from,r.to)):[new Qo(0,0)]:[new Qo(0,e.length)],this.createParse(e,i||[],s)}parse(e,i,s){let r=this.startParse(e,i,s);for(;;){let n=r.advance();if(n)return n}}}class q0{constructor(e){this.string=e}get length(){return this.string.length}chunk(e){return this.string.slice(e)}get lineChunks(){return!1}read(e,i){return this.string.slice(e,i)}}new V({perNode:!0});let V0=0,Vt=class Ja{constructor(e,i,s,r){this.name=e,this.set=i,this.base=s,this.modified=r,this.id=V0++}toString(){let{name:e}=this;for(let i of this.modified)i.name&&(e=`${i.name}(${e})`);return e}static define(e,i){let s=typeof e=="string"?e:"?";if(e instanceof Ja&&(i=e),i!=null&&i.base)throw new Error("Can not derive from a modified tag");let r=new Ja(s,[],null,[]);if(r.set.push(r),i)for(let n of i.set)r.set.push(n);return r}static defineModifier(e){let i=new In(e);return s=>s.modified.indexOf(i)>-1?s:In.get(s.base||s,s.modified.concat(i).sort((r,n)=>r.id-n.id))}},j0=0;class In{constructor(e){this.name=e,this.instances=[],this.id=j0++}static get(e,i){if(!i.length)return e;let s=i[0].instances.find(a=>a.base==e&&Q0(i,a.modified));if(s)return s;let r=[],n=new Vt(e.name,r,e,i);for(let a of i)a.instances.push(n);let o=K0(i);for(let a of e.set)if(!a.modified.length)for(let l of o)r.push(In.get(a,l));return n}}function Q0(t,e){return t.length==e.length&&t.every((i,s)=>i==e[s])}function K0(t){let e=[[]];for(let i=0;i<t.length;i++)for(let s=0,r=e.length;s<r;s++)e.push(e[s].concat(t[i]));return e.sort((i,s)=>s.length-i.length)}function $f(t){let e=Object.create(null);for(let i in t){let s=t[i];Array.isArray(s)||(s=[s]);for(let r of i.split(" "))if(r){let n=[],o=2,a=r;for(let d=0;;){if(a=="..."&&d>0&&d+3==r.length){o=1;break}let u=/^"(?:[^"\\]|\\.)*?"|[^\/!]+/.exec(a);if(!u)throw new RangeError("Invalid path: "+r);if(n.push(u[0]=="*"?"":u[0][0]=='"'?JSON.parse(u[0]):u[0]),d+=u[0].length,d==r.length)break;let f=r[d++];if(d==r.length&&f=="!"){o=0;break}if(f!="/")throw new RangeError("Invalid path: "+r);a=r.slice(d)}let l=n.length-1,h=n[l];if(!h)throw new RangeError("Invalid path: "+r);let c=new mr(s,o,l>0?n.slice(0,l):null);e[h]=c.sort(e[h])}}return Of.add(e)}const Of=new V({combine(t,e){let i,s,r;for(;t||e;){if(!t||e&&t.depth>=e.depth?(r=e,e=e.next):(r=t,t=t.next),i&&i.mode==r.mode&&!r.context&&!i.context)continue;let n=new mr(r.tags,r.mode,r.context);i?i.next=n:s=n,i=n}return s}});class mr{constructor(e,i,s,r){this.tags=e,this.mode=i,this.context=s,this.next=r}get opaque(){return this.mode==0}get inherit(){return this.mode==1}sort(e){return!e||e.depth<this.depth?(this.next=e,this):(e.next=this.sort(e.next),e)}get depth(){return this.context?this.context.length:0}}mr.empty=new mr([],2,null);function Af(t,e){let i=Object.create(null);for(let n of t)if(!Array.isArray(n.tag))i[n.tag.id]=n.class;else for(let o of n.tag)i[o.id]=n.class;let{scope:s,all:r=null}=e||{};return{style:n=>{let o=r;for(let a of n)for(let l of a.set){let h=i[l.id];if(h){o=o?o+" "+h:h;break}}return o},scope:s}}function X0(t,e){let i=null;for(let s of t){let r=s.style(e);r&&(i=i?i+" "+r:r)}return i}function J0(t,e,i,s=0,r=t.length){let n=new Y0(s,Array.isArray(e)?e:[e],i);n.highlightRange(t.cursor(),s,r,"",n.highlighters),n.flush(r)}class Y0{constructor(e,i,s){this.at=e,this.highlighters=i,this.span=s,this.class=""}startSpan(e,i){i!=this.class&&(this.flush(e),e>this.at&&(this.at=e),this.class=i)}flush(e){e>this.at&&this.class&&this.span(this.at,e,this.class)}highlightRange(e,i,s,r,n){let{type:o,from:a,to:l}=e;if(a>=s||l<=i)return;o.isTop&&(n=this.highlighters.filter(f=>!f.scope||f.scope(o)));let h=r,c=G0(e)||mr.empty,d=X0(n,c.tags);if(d&&(h&&(h+=" "),h+=d,c.mode==1&&(r+=(r?" ":"")+d)),this.startSpan(Math.max(i,a),h),c.opaque)return;let u=e.tree&&e.tree.prop(V.mounted);if(u&&u.overlay){let f=e.node.enter(u.overlay[0].from+a,1),g=this.highlighters.filter(y=>!y.scope||y.scope(u.tree.type)),m=e.firstChild();for(let y=0,w=a;;y++){let x=y<u.overlay.length?u.overlay[y]:null,O=x?x.from+a:l,D=Math.max(i,w),A=Math.min(s,O);if(D<A&&m)for(;e.from<A&&(this.highlightRange(e,D,A,r,n),this.startSpan(Math.min(A,e.to),h),!(e.to>=O||!e.nextSibling())););if(!x||O>s)break;w=x.to+a,w>i&&(this.highlightRange(f.cursor(),Math.max(i,x.from+a),Math.min(s,w),"",g),this.startSpan(Math.min(s,w),h))}m&&e.parent()}else if(e.firstChild()){u&&(r="");do if(!(e.to<=i)){if(e.from>=s)break;this.highlightRange(e,i,s,r,n),this.startSpan(Math.min(s,e.to),h)}while(e.nextSibling());e.parent()}}}function G0(t){let e=t.type.prop(Of);for(;e&&e.context&&!t.matchContext(e.context);)e=e.next;return e||null}const _=Vt.define,Zr=_(),ii=_(),_c=_(ii),Dc=_(ii),si=_(),en=_(si),Ko=_(si),Mt=_(),Ai=_(Mt),Pt=_(),Tt=_(),Ya=_(),Us=_(Ya),tn=_(),k={comment:Zr,lineComment:_(Zr),blockComment:_(Zr),docComment:_(Zr),name:ii,variableName:_(ii),typeName:_c,tagName:_(_c),propertyName:Dc,attributeName:_(Dc),className:_(ii),labelName:_(ii),namespace:_(ii),macroName:_(ii),literal:si,string:en,docString:_(en),character:_(en),attributeValue:_(en),number:Ko,integer:_(Ko),float:_(Ko),bool:_(si),regexp:_(si),escape:_(si),color:_(si),url:_(si),keyword:Pt,self:_(Pt),null:_(Pt),atom:_(Pt),unit:_(Pt),modifier:_(Pt),operatorKeyword:_(Pt),controlKeyword:_(Pt),definitionKeyword:_(Pt),moduleKeyword:_(Pt),operator:Tt,derefOperator:_(Tt),arithmeticOperator:_(Tt),logicOperator:_(Tt),bitwiseOperator:_(Tt),compareOperator:_(Tt),updateOperator:_(Tt),definitionOperator:_(Tt),typeOperator:_(Tt),controlOperator:_(Tt),punctuation:Ya,separator:_(Ya),bracket:Us,angleBracket:_(Us),squareBracket:_(Us),paren:_(Us),brace:_(Us),content:Mt,heading:Ai,heading1:_(Ai),heading2:_(Ai),heading3:_(Ai),heading4:_(Ai),heading5:_(Ai),heading6:_(Ai),contentSeparator:_(Mt),list:_(Mt),quote:_(Mt),emphasis:_(Mt),strong:_(Mt),link:_(Mt),monospace:_(Mt),strikethrough:_(Mt),inserted:_(),deleted:_(),changed:_(),invalid:_(),meta:tn,documentMeta:_(tn),annotation:_(tn),processingInstruction:_(tn),definition:Vt.defineModifier("definition"),constant:Vt.defineModifier("constant"),function:Vt.defineModifier("function"),standard:Vt.defineModifier("standard"),local:Vt.defineModifier("local"),special:Vt.defineModifier("special")};for(let t in k){let e=k[t];e instanceof Vt&&(e.name=t)}Af([{tag:k.link,class:"tok-link"},{tag:k.heading,class:"tok-heading"},{tag:k.emphasis,class:"tok-emphasis"},{tag:k.strong,class:"tok-strong"},{tag:k.keyword,class:"tok-keyword"},{tag:k.atom,class:"tok-atom"},{tag:k.bool,class:"tok-bool"},{tag:k.url,class:"tok-url"},{tag:k.labelName,class:"tok-labelName"},{tag:k.inserted,class:"tok-inserted"},{tag:k.deleted,class:"tok-deleted"},{tag:k.literal,class:"tok-literal"},{tag:k.string,class:"tok-string"},{tag:k.number,class:"tok-number"},{tag:[k.regexp,k.escape,k.special(k.string)],class:"tok-string2"},{tag:k.variableName,class:"tok-variableName"},{tag:k.local(k.variableName),class:"tok-variableName tok-local"},{tag:k.definition(k.variableName),class:"tok-variableName tok-definition"},{tag:k.special(k.variableName),class:"tok-variableName2"},{tag:k.definition(k.propertyName),class:"tok-propertyName tok-definition"},{tag:k.typeName,class:"tok-typeName"},{tag:k.namespace,class:"tok-namespace"},{tag:k.className,class:"tok-className"},{tag:k.macroName,class:"tok-macroName"},{tag:k.propertyName,class:"tok-propertyName"},{tag:k.operator,class:"tok-operator"},{tag:k.comment,class:"tok-comment"},{tag:k.meta,class:"tok-meta"},{tag:k.invalid,class:"tok-invalid"},{tag:k.punctuation,class:"tok-punctuation"}]);var Xo;const ls=new V;function Z0(t){return R.define({combine:t?e=>e.concat(t):void 0})}const ey=new V;class vt{constructor(e,i,s=[],r=""){this.data=e,this.name=r,J.prototype.hasOwnProperty("tree")||Object.defineProperty(J.prototype,"tree",{get(){return De(this)}}),this.parser=i,this.extension=[vi.of(this),J.languageData.of((n,o,a)=>{let l=Bc(n,o,a),h=l.type.prop(ls);if(!h)return[];let c=n.facet(h),d=l.type.prop(ey);if(d){let u=l.resolve(o-l.from,a);for(let f of d)if(f.test(u,n)){let g=n.facet(f.facet);return f.type=="replace"?g:g.concat(c)}}return c})].concat(s)}isActiveAt(e,i,s=-1){return Bc(e,i,s).type.prop(ls)==this.data}findRegions(e){let i=e.facet(vi);if((i==null?void 0:i.data)==this.data)return[{from:0,to:e.doc.length}];if(!i||!i.allowsNesting)return[];let s=[],r=(n,o)=>{if(n.prop(ls)==this.data){s.push({from:o,to:o+n.length});return}let a=n.prop(V.mounted);if(a){if(a.tree.prop(ls)==this.data){if(a.overlay)for(let l of a.overlay)s.push({from:l.from+o,to:l.to+o});else s.push({from:o,to:o+n.length});return}else if(a.overlay){let l=s.length;if(r(a.tree,a.overlay[0].from+o),s.length>l)return}}for(let l=0;l<n.children.length;l++){let h=n.children[l];h instanceof ve&&r(h,n.positions[l]+o)}};return r(De(e),0),s}get allowsNesting(){return!0}}vt.setState=W.define();function Bc(t,e,i){let s=t.facet(vi),r=De(t).topNode;if(!s||s.allowsNesting)for(let n=r;n;n=n.enter(e,i,ge.ExcludeBuffers|ge.EnterBracketed))n.type.isTop&&(r=n);return r}class Fn extends vt{constructor(e,i,s){super(e,i,[],s),this.parser=i}static define(e){let i=Z0(e.languageData);return new Fn(i,e.parser.configure({props:[ls.add(s=>s.isTop?i:void 0)]}),e.name)}configure(e,i){return new Fn(this.data,this.parser.configure(e),i||this.name)}get allowsNesting(){return this.parser.hasWrappers()}}function De(t){let e=t.field(vt.state,!1);return e?e.tree:ve.empty}class ty{constructor(e){this.doc=e,this.cursorPos=0,this.string="",this.cursor=e.iter()}get length(){return this.doc.length}syncTo(e){return this.string=this.cursor.next(e-this.cursorPos).value,this.cursorPos=e+this.string.length,this.cursorPos-this.string.length}chunk(e){return this.syncTo(e),this.string}get lineChunks(){return!0}read(e,i){let s=this.cursorPos-this.string.length;return e<s||i>=this.cursorPos?this.doc.sliceString(e,i):this.string.slice(e-s,i-s)}}let Hs=null;class Nn{constructor(e,i,s=[],r,n,o,a,l){this.parser=e,this.state=i,this.fragments=s,this.tree=r,this.treeLen=n,this.viewport=o,this.skipped=a,this.scheduleOn=l,this.parse=null,this.tempSkipped=[]}static create(e,i,s){return new Nn(e,i,[],ve.empty,0,s,[],null)}startParse(){return this.parser.startParse(new ty(this.state.doc),this.fragments)}work(e,i){return i!=null&&i>=this.state.doc.length&&(i=void 0),this.tree!=ve.empty&&this.isDone(i??this.state.doc.length)?(this.takeTree(),!0):this.withContext(()=>{var s;if(typeof e=="number"){let r=Date.now()+e;e=()=>Date.now()>r}for(this.parse||(this.parse=this.startParse()),i!=null&&(this.parse.stoppedAt==null||this.parse.stoppedAt>i)&&i<this.state.doc.length&&this.parse.stopAt(i);;){let r=this.parse.advance();if(r)if(this.fragments=this.withoutTempSkipped(Hi.addTree(r,this.fragments,this.parse.stoppedAt!=null)),this.treeLen=(s=this.parse.stoppedAt)!==null&&s!==void 0?s:this.state.doc.length,this.tree=r,this.parse=null,this.treeLen<(i??this.state.doc.length))this.parse=this.startParse();else return!0;if(e())return!1}})}takeTree(){let e,i;this.parse&&(e=this.parse.parsedPos)>=this.treeLen&&((this.parse.stoppedAt==null||this.parse.stoppedAt>e)&&this.parse.stopAt(e),this.withContext(()=>{for(;!(i=this.parse.advance()););}),this.treeLen=e,this.tree=i,this.fragments=this.withoutTempSkipped(Hi.addTree(this.tree,this.fragments,!0)),this.parse=null)}withContext(e){let i=Hs;Hs=this;try{return e()}finally{Hs=i}}withoutTempSkipped(e){for(let i;i=this.tempSkipped.pop();)e=Rc(e,i.from,i.to);return e}changes(e,i){let{fragments:s,tree:r,treeLen:n,viewport:o,skipped:a}=this;if(this.takeTree(),!e.empty){let l=[];if(e.iterChangedRanges((h,c,d,u)=>l.push({fromA:h,toA:c,fromB:d,toB:u})),s=Hi.applyChanges(s,l),r=ve.empty,n=0,o={from:e.mapPos(o.from,-1),to:e.mapPos(o.to,1)},this.skipped.length){a=[];for(let h of this.skipped){let c=e.mapPos(h.from,1),d=e.mapPos(h.to,-1);c<d&&a.push({from:c,to:d})}}}return new Nn(this.parser,i,s,r,n,o,a,this.scheduleOn)}updateViewport(e){if(this.viewport.from==e.from&&this.viewport.to==e.to)return!1;this.viewport=e;let i=this.skipped.length;for(let s=0;s<this.skipped.length;s++){let{from:r,to:n}=this.skipped[s];r<e.to&&n>e.from&&(this.fragments=Rc(this.fragments,r,n),this.skipped.splice(s--,1))}return this.skipped.length>=i?!1:(this.reset(),!0)}reset(){this.parse&&(this.takeTree(),this.parse=null)}skipUntilInView(e,i){this.skipped.push({from:e,to:i})}static getSkippingParser(e){return new class extends Cf{createParse(i,s,r){let n=r[0].from,o=r[r.length-1].to;return{parsedPos:n,advance(){let l=Hs;if(l){for(let h of r)l.tempSkipped.push(h);e&&(l.scheduleOn=l.scheduleOn?Promise.all([l.scheduleOn,e]):e)}return this.parsedPos=o,new ve(Ye.none,[],[],o-n)},stoppedAt:null,stopAt(){}}}}}isDone(e){e=Math.min(e,this.state.doc.length);let i=this.fragments;return this.treeLen>=e&&i.length&&i[0].from==0&&i[0].to>=e}static get(){return Hs}}function Rc(t,e,i){return Hi.applyChanges(t,[{fromA:e,toA:i,fromB:e,toB:i}])}class As{constructor(e){this.context=e,this.tree=e.tree}apply(e){if(!e.docChanged&&this.tree==this.context.tree)return this;let i=this.context.changes(e.changes,e.state),s=this.context.treeLen==e.startState.doc.length?void 0:Math.max(e.changes.mapPos(this.context.treeLen),i.viewport.to);return i.work(20,s)||i.takeTree(),new As(i)}static init(e){let i=Math.min(3e3,e.doc.length),s=Nn.create(e.facet(vi).parser,e,{from:0,to:i});return s.work(20,i)||s.takeTree(),new As(s)}}vt.state=Be.define({create:As.init,update(t,e){for(let i of e.effects)if(i.is(vt.setState))return i.value;return e.startState.facet(vi)!=e.state.facet(vi)?As.init(e.state):t.apply(e)}});let Pf=t=>{let e=setTimeout(()=>t(),500);return()=>clearTimeout(e)};typeof requestIdleCallback<"u"&&(Pf=t=>{let e=-1,i=setTimeout(()=>{e=requestIdleCallback(t,{timeout:400})},100);return()=>e<0?clearTimeout(i):cancelIdleCallback(e)});const Jo=typeof navigator<"u"&&(!((Xo=navigator.scheduling)===null||Xo===void 0)&&Xo.isInputPending)?()=>navigator.scheduling.isInputPending():null,iy=ye.fromClass(class{constructor(e){this.view=e,this.working=null,this.workScheduled=0,this.chunkEnd=-1,this.chunkBudget=-1,this.work=this.work.bind(this),this.scheduleWork()}update(e){let i=this.view.state.field(vt.state).context;(i.updateViewport(e.view.viewport)||this.view.viewport.to>i.treeLen)&&this.scheduleWork(),(e.docChanged||e.selectionSet)&&(this.view.hasFocus&&(this.chunkBudget+=50),this.scheduleWork()),this.checkAsyncSchedule(i)}scheduleWork(){if(this.working)return;let{state:e}=this.view,i=e.field(vt.state);(i.tree!=i.context.tree||!i.context.isDone(e.doc.length))&&(this.working=Pf(this.work))}work(e){this.working=null;let i=Date.now();if(this.chunkEnd<i&&(this.chunkEnd<0||this.view.hasFocus)&&(this.chunkEnd=i+3e4,this.chunkBudget=3e3),this.chunkBudget<=0)return;let{state:s,viewport:{to:r}}=this.view,n=s.field(vt.state);if(n.tree==n.context.tree&&n.context.isDone(r+1e5))return;let o=Date.now()+Math.min(this.chunkBudget,100,e&&!Jo?Math.max(25,e.timeRemaining()-5):1e9),a=n.context.treeLen<r&&s.doc.length>r+1e3,l=n.context.work(()=>Jo&&Jo()||Date.now()>o,r+(a?0:1e5));this.chunkBudget-=Date.now()-i,(l||this.chunkBudget<=0)&&(n.context.takeTree(),this.view.dispatch({effects:vt.setState.of(new As(n.context))})),this.chunkBudget>0&&!(l&&!a)&&this.scheduleWork(),this.checkAsyncSchedule(n.context)}checkAsyncSchedule(e){e.scheduleOn&&(this.workScheduled++,e.scheduleOn.then(()=>this.scheduleWork()).catch(i=>Qe(this.view.state,i)).then(()=>this.workScheduled--),e.scheduleOn=null)}destroy(){this.working&&this.working()}isWorking(){return!!(this.working||this.workScheduled>0)}},{eventHandlers:{focus(){this.scheduleWork()}}}),vi=R.define({combine(t){return t.length?t[0]:null},enables:t=>[vt.state,iy,L.contentAttributes.compute([t],e=>{let i=e.facet(t);return i&&i.name?{"data-language":i.name}:{}})]});class sy{constructor(e,i=[]){this.language=e,this.support=i,this.extension=[e,i]}}const ry=R.define(),Ql=R.define({combine:t=>{if(!t.length)return"  ";let e=t[0];if(!e||/\S/.test(e)||Array.from(e).some(i=>i!=e[0]))throw new Error("Invalid indent unit: "+JSON.stringify(t[0]));return e}});function Un(t){let e=t.facet(Ql);return e.charCodeAt(0)==9?t.tabSize*e.length:e.length}function br(t,e){let i="",s=t.tabSize,r=t.facet(Ql)[0];if(r=="	"){for(;e>=s;)i+="	",e-=s;r=" "}for(let n=0;n<e;n++)i+=r;return i}function Kl(t,e){t instanceof J&&(t=new po(t));for(let s of t.state.facet(ry)){let r=s(t,e);if(r!==void 0)return r}let i=De(t.state);return i.length>=e?ny(t,i,e):null}class po{constructor(e,i={}){this.state=e,this.options=i,this.unit=Un(e)}lineAt(e,i=1){let s=this.state.doc.lineAt(e),{simulateBreak:r,simulateDoubleBreak:n}=this.options;return r!=null&&r>=s.from&&r<=s.to?n&&r==e?{text:"",from:e}:(i<0?r<e:r<=e)?{text:s.text.slice(r-s.from),from:r}:{text:s.text.slice(0,r-s.from),from:s.from}:s}textAfterPos(e,i=1){if(this.options.simulateDoubleBreak&&e==this.options.simulateBreak)return"";let{text:s,from:r}=this.lineAt(e,i);return s.slice(e-r,Math.min(s.length,e+100-r))}column(e,i=1){let{text:s,from:r}=this.lineAt(e,i),n=this.countColumn(s,e-r),o=this.options.overrideIndentation?this.options.overrideIndentation(r):-1;return o>-1&&(n+=o-this.countColumn(s,s.search(/\S|$/))),n}countColumn(e,i=e.length){return _s(e,this.state.tabSize,i)}lineIndent(e,i=1){let{text:s,from:r}=this.lineAt(e,i),n=this.options.overrideIndentation;if(n){let o=n(r);if(o>-1)return o}return this.countColumn(s,s.search(/\S|$/))}get simulatedBreak(){return this.options.simulateBreak||null}}const Tf=new V;function ny(t,e,i){let s=e.resolveStack(i),r=e.resolveInner(i,-1).resolve(i,0).enterUnfinishedNodesBefore(i);if(r!=s.node){let n=[];for(let o=r;o&&!(o.from<s.node.from||o.to>s.node.to||o.from==s.node.from&&o.type==s.node.type);o=o.parent)n.push(o);for(let o=n.length-1;o>=0;o--)s={node:n[o],next:s}}return Mf(s,t,i)}function Mf(t,e,i){for(let s=t;s;s=s.next){let r=ay(s.node);if(r)return r(Xl.create(e,i,s))}return 0}function oy(t){return t.pos==t.options.simulateBreak&&t.options.simulateDoubleBreak}function ay(t){let e=t.type.prop(Tf);if(e)return e;let i=t.firstChild,s;if(i&&(s=i.type.prop(V.closedBy))){let r=t.lastChild,n=r&&s.indexOf(r.name)>-1;return o=>Ef(o,!0,1,void 0,n&&!oy(o)?r.from:void 0)}return t.parent==null?ly:null}function ly(){return 0}class Xl extends po{constructor(e,i,s){super(e.state,e.options),this.base=e,this.pos=i,this.context=s}get node(){return this.context.node}static create(e,i,s){return new Xl(e,i,s)}get textAfter(){return this.textAfterPos(this.pos)}get baseIndent(){return this.baseIndentFor(this.node)}baseIndentFor(e){let i=this.state.doc.lineAt(e.from);for(;;){let s=e.resolve(i.from);for(;s.parent&&s.parent.from==s.from;)s=s.parent;if(hy(s,e))break;i=this.state.doc.lineAt(s.from)}return this.lineIndent(i.from)}continue(){return Mf(this.context.next,this.base,this.pos)}}function hy(t,e){for(let i=e;i;i=i.parent)if(t==i)return!0;return!1}function cy(t){let e=t.node,i=e.childAfter(e.from),s=e.lastChild;if(!i)return null;let r=t.options.simulateBreak,n=t.state.doc.lineAt(i.from),o=r==null||r<=n.from?n.to:Math.min(n.to,r);for(let a=i.to;;){let l=e.childAfter(a);if(!l||l==s)return null;if(!l.type.isSkipped){if(l.from>=o)return null;let h=/^ */.exec(n.text.slice(i.to-n.from))[0].length;return{from:i.from,to:i.to+h}}a=l.to}}function Lc({closing:t,align:e=!0,units:i=1}){return s=>Ef(s,e,i,t)}function Ef(t,e,i,s,r){let n=t.textAfter,o=n.match(/^\s*/)[0].length,a=s&&n.slice(o,o+s.length)==s||r==t.pos+o,l=e?cy(t):null;return l?a?t.column(l.from):t.column(l.to):t.baseIndent+(a?0:t.unit*i)}const dy=200;function uy(){return J.transactionFilter.of(t=>{if(!t.docChanged||!t.isUserEvent("input.type")&&!t.isUserEvent("input.complete"))return t;let e=t.startState.languageDataAt("indentOnInput",t.startState.selection.main.head);if(!e.length)return t;let i=t.newDoc,{head:s}=t.newSelection.main,r=i.lineAt(s);if(s>r.from+dy)return t;let n=i.sliceString(r.from,s);if(!e.some(h=>h.test(n)))return t;let{state:o}=t,a=-1,l=[];for(let{head:h}of o.selection.ranges){let c=o.doc.lineAt(h);if(c.from==a)continue;a=c.from;let d=Kl(o,c.from);if(d==null)continue;let u=/^\s*/.exec(c.text)[0],f=br(o,d);u!=f&&l.push({from:c.from,to:c.from+u.length,insert:f})}return l.length?[t,{changes:l,sequential:!0}]:t})}const fy=R.define(),_f=new V;function py(t){let e=t.firstChild,i=t.lastChild;return e&&e.to<i.from?{from:e.to,to:i.type.isError?t.to:i.from}:null}function gy(t,e,i){let s=De(t);if(s.length<i)return null;let r=s.resolveStack(i,1),n=null;for(let o=r;o;o=o.next){let a=o.node;if(a.to<=i||a.from>i)continue;if(n&&a.from<e)break;let l=a.type.prop(_f);if(l&&(a.to<s.length-50||s.length==t.doc.length||!my(a))){let h=l(a,t);h&&h.from<=i&&h.from>=e&&h.to>i&&(n=h)}}return n}function my(t){let e=t.lastChild;return e&&e.to==t.to&&e.type.isError}function Hn(t,e,i){for(let s of t.facet(fy)){let r=s(t,e,i);if(r)return r}return gy(t,e,i)}function Df(t,e){let i=e.mapPos(t.from,1),s=e.mapPos(t.to,-1);return i>=s?void 0:{from:i,to:s}}const go=W.define({map:Df}),_r=W.define({map:Df});function Bf(t){let e=[];for(let{head:i}of t.state.selection.ranges)e.some(s=>s.from<=i&&s.to>=i)||e.push(t.lineBlockAt(i));return e}const Yi=Be.define({create(){return U.none},update(t,e){e.isUserEvent("delete")&&e.changes.iterChangedRanges((i,s)=>t=Ic(t,i,s)),t=t.map(e.changes);for(let i of e.effects)if(i.is(go)&&!by(t,i.value.from,i.value.to)){let{preparePlaceholder:s}=e.state.facet(If),r=s?U.replace({widget:new Cy(s(e.state,i.value))}):Fc;t=t.update({add:[r.range(i.value.from,i.value.to)]})}else i.is(_r)&&(t=t.update({filter:(s,r)=>i.value.from!=s||i.value.to!=r,filterFrom:i.value.from,filterTo:i.value.to}));return e.selection&&(t=Ic(t,e.selection.main.head)),t},provide:t=>L.decorations.from(t),toJSON(t,e){let i=[];return t.between(0,e.doc.length,(s,r)=>{i.push(s,r)}),i},fromJSON(t){if(!Array.isArray(t)||t.length%2)throw new RangeError("Invalid JSON for fold state");let e=[];for(let i=0;i<t.length;){let s=t[i++],r=t[i++];if(typeof s!="number"||typeof r!="number")throw new RangeError("Invalid JSON for fold state");e.push(Fc.range(s,r))}return U.set(e,!0)}});function Ic(t,e,i=e){let s=!1;return t.between(e,i,(r,n)=>{r<i&&n>e&&(s=!0)}),s?t.update({filterFrom:e,filterTo:i,filter:(r,n)=>r>=i||n<=e}):t}function Wn(t,e,i){var s;let r=null;return(s=t.field(Yi,!1))===null||s===void 0||s.between(e,i,(n,o)=>{(!r||r.from>n)&&(r={from:n,to:o})}),r}function by(t,e,i){let s=!1;return t.between(e,e,(r,n)=>{r==e&&n==i&&(s=!0)}),s}function Rf(t,e){return t.field(Yi,!1)?e:e.concat(W.appendConfig.of(Ff()))}const vy=t=>{for(let e of Bf(t)){let i=Hn(t.state,e.from,e.to);if(i)return t.dispatch({effects:Rf(t.state,[go.of(i),Lf(t,i)])}),!0}return!1},yy=t=>{if(!t.state.field(Yi,!1))return!1;let e=[];for(let i of Bf(t)){let s=Wn(t.state,i.from,i.to);s&&e.push(_r.of(s),Lf(t,s,!1))}return e.length&&t.dispatch({effects:e}),e.length>0};function Lf(t,e,i=!0){let s=t.state.doc.lineAt(e.from).number,r=t.state.doc.lineAt(e.to).number;return L.announce.of(`${t.state.phrase(i?"Folded lines":"Unfolded lines")} ${s} ${t.state.phrase("to")} ${r}.`)}const xy=t=>{let{state:e}=t,i=[];for(let s=0;s<e.doc.length;){let r=t.lineBlockAt(s),n=Hn(e,r.from,r.to);n&&i.push(go.of(n)),s=(n?t.lineBlockAt(n.to):r).to+1}return i.length&&t.dispatch({effects:Rf(t.state,i)}),!!i.length},wy=t=>{let e=t.state.field(Yi,!1);if(!e||!e.size)return!1;let i=[];return e.between(0,t.state.doc.length,(s,r)=>{i.push(_r.of({from:s,to:r}))}),t.dispatch({effects:i}),!0},ky=[{key:"Ctrl-Shift-[",mac:"Cmd-Alt-[",run:vy},{key:"Ctrl-Shift-]",mac:"Cmd-Alt-]",run:yy},{key:"Ctrl-Alt-[",run:xy},{key:"Ctrl-Alt-]",run:wy}],Sy={placeholderDOM:null,preparePlaceholder:null,placeholderText:"…"},If=R.define({combine(t){return zt(t,Sy)}});function Ff(t){return[Yi,Ay]}function Nf(t,e){let{state:i}=t,s=i.facet(If),r=o=>{let a=t.lineBlockAt(t.posAtDOM(o.target)),l=Wn(t.state,a.from,a.to);l&&t.dispatch({effects:_r.of(l)}),o.preventDefault()};if(s.placeholderDOM)return s.placeholderDOM(t,r,e);let n=document.createElement("span");return n.textContent=s.placeholderText,n.setAttribute("aria-label",i.phrase("folded code")),n.title=i.phrase("unfold"),n.className="cm-foldPlaceholder",n.onclick=r,n}const Fc=U.replace({widget:new class extends ti{toDOM(t){return Nf(t,null)}}});class Cy extends ti{constructor(e){super(),this.value=e}eq(e){return this.value==e.value}toDOM(e){return Nf(e,this.value)}}const $y={openText:"⌄",closedText:"›",markerDOM:null,domEventHandlers:{},foldingChanged:()=>!1};class Yo extends Gt{constructor(e,i){super(),this.config=e,this.open=i}eq(e){return this.config==e.config&&this.open==e.open}toDOM(e){if(this.config.markerDOM)return this.config.markerDOM(this.open);let i=document.createElement("span");return i.textContent=this.open?this.config.openText:this.config.closedText,i.title=e.state.phrase(this.open?"Fold line":"Unfold line"),i}}function Oy(t={}){let e={...$y,...t},i=new Yo(e,!0),s=new Yo(e,!1),r=ye.fromClass(class{constructor(o){this.from=o.viewport.from,this.markers=this.buildMarkers(o)}update(o){(o.docChanged||o.viewportChanged||o.startState.facet(vi)!=o.state.facet(vi)||o.startState.field(Yi,!1)!=o.state.field(Yi,!1)||De(o.startState)!=De(o.state)||e.foldingChanged(o))&&(this.markers=this.buildMarkers(o.view))}buildMarkers(o){let a=new Jt;for(let l of o.viewportLineBlocks){let h=Wn(o.state,l.from,l.to)?s:Hn(o.state,l.from,l.to)?i:null;h&&a.add(l.from,l.from,h)}return a.finish()}}),{domEventHandlers:n}=e;return[r,A0({class:"cm-foldGutter",markers(o){var a;return((a=o.plugin(r))===null||a===void 0?void 0:a.markers)||Q.empty},initialSpacer(){return new Yo(e,!1)},domEventHandlers:{...n,click:(o,a,l)=>{if(n.click&&n.click(o,a,l))return!0;let h=Wn(o.state,a.from,a.to);if(h)return o.dispatch({effects:_r.of(h)}),!0;let c=Hn(o.state,a.from,a.to);return c?(o.dispatch({effects:go.of(c)}),!0):!1}}}),Ff()]}const Ay=L.baseTheme({".cm-foldPlaceholder":{backgroundColor:"#eee",border:"1px solid #ddd",color:"#888",borderRadius:".2em",margin:"0 1px",padding:"0 1px",cursor:"pointer"},".cm-foldGutter span":{padding:"0 1px",cursor:"pointer"}});class Dr{constructor(e,i){this.specs=e;let s;function r(a){let l=pi.newName();return(s||(s=Object.create(null)))["."+l]=a,l}const n=typeof i.all=="string"?i.all:i.all?r(i.all):void 0,o=i.scope;this.scope=o instanceof vt?a=>a.prop(ls)==o.data:o?a=>a==o:void 0,this.style=Af(e.map(a=>({tag:a.tag,class:a.class||r(Object.assign({},a,{tag:null}))})),{all:n}).style,this.module=s?new pi(s):null,this.themeType=i.themeType}static define(e,i){return new Dr(e,i||{})}}const Ga=R.define(),Uf=R.define({combine(t){return t.length?[t[0]]:null}});function Go(t){let e=t.facet(Ga);return e.length?e:t.facet(Uf)}function Hf(t,e){let i=[Ty],s;return t instanceof Dr&&(t.module&&i.push(L.styleModule.of(t.module)),s=t.themeType),e!=null&&e.fallback?i.push(Uf.of(t)):s?i.push(Ga.computeN([L.darkTheme],r=>r.facet(L.darkTheme)==(s=="dark")?[t]:[])):i.push(Ga.of(t)),i}class Py{constructor(e){this.markCache=Object.create(null),this.tree=De(e.state),this.decorations=this.buildDeco(e,Go(e.state)),this.decoratedTo=e.viewport.to}update(e){let i=De(e.state),s=Go(e.state),r=s!=Go(e.startState),{viewport:n}=e.view,o=e.changes.mapPos(this.decoratedTo,1);i.length<n.to&&!r&&i.type==this.tree.type&&o>=n.to?(this.decorations=this.decorations.map(e.changes),this.decoratedTo=o):(i!=this.tree||e.viewportChanged||r)&&(this.tree=i,this.decorations=this.buildDeco(e.view,s),this.decoratedTo=n.to)}buildDeco(e,i){if(!i||!this.tree.length)return U.none;let s=new Jt;for(let{from:r,to:n}of e.visibleRanges)J0(this.tree,i,(o,a,l)=>{s.add(o,a,this.markCache[l]||(this.markCache[l]=U.mark({class:l})))},r,n);return s.finish()}}const Ty=Gi.high(ye.fromClass(Py,{decorations:t=>t.decorations})),My=Dr.define([{tag:k.meta,color:"#404740"},{tag:k.link,textDecoration:"underline"},{tag:k.heading,textDecoration:"underline",fontWeight:"bold"},{tag:k.emphasis,fontStyle:"italic"},{tag:k.strong,fontWeight:"bold"},{tag:k.strikethrough,textDecoration:"line-through"},{tag:k.keyword,color:"#708"},{tag:[k.atom,k.bool,k.url,k.contentSeparator,k.labelName],color:"#219"},{tag:[k.literal,k.inserted],color:"#164"},{tag:[k.string,k.deleted],color:"#a11"},{tag:[k.regexp,k.escape,k.special(k.string)],color:"#e40"},{tag:k.definition(k.variableName),color:"#00f"},{tag:k.local(k.variableName),color:"#30a"},{tag:[k.typeName,k.namespace],color:"#085"},{tag:k.className,color:"#167"},{tag:[k.special(k.variableName),k.macroName],color:"#256"},{tag:k.definition(k.propertyName),color:"#00c"},{tag:k.comment,color:"#940"},{tag:k.invalid,color:"#f00"}]),Ey=L.baseTheme({"&.cm-focused .cm-matchingBracket":{backgroundColor:"#328c8252"},"&.cm-focused .cm-nonmatchingBracket":{backgroundColor:"#bb555544"}}),Wf=1e4,zf="()[]{}",qf=R.define({combine(t){return zt(t,{afterCursor:!0,brackets:zf,maxScanDistance:Wf,renderMatch:By})}}),_y=U.mark({class:"cm-matchingBracket"}),Dy=U.mark({class:"cm-nonmatchingBracket"});function By(t){let e=[],i=t.matched?_y:Dy;return e.push(i.range(t.start.from,t.start.to)),t.end&&e.push(i.range(t.end.from,t.end.to)),e}function Nc(t){let e=[],i=t.facet(qf);for(let s of t.selection.ranges){if(!s.empty)continue;let r=Lt(t,s.head,-1,i)||s.head>0&&Lt(t,s.head-1,1,i)||i.afterCursor&&(Lt(t,s.head,1,i)||s.head<t.doc.length&&Lt(t,s.head+1,-1,i));r&&(e=e.concat(i.renderMatch(r,t)))}return U.set(e,!0)}const Ry=ye.fromClass(class{constructor(t){this.paused=!1,this.decorations=Nc(t.state)}update(t){(t.docChanged||t.selectionSet||this.paused)&&(t.view.composing?(this.decorations=this.decorations.map(t.changes),this.paused=!0):(this.decorations=Nc(t.state),this.paused=!1))}},{decorations:t=>t.decorations}),Ly=[Ry,Ey];function Iy(t={}){return[qf.of(t),Ly]}const Fy=new V;function Za(t,e,i){let s=t.prop(e<0?V.openedBy:V.closedBy);if(s)return s;if(t.name.length==1){let r=i.indexOf(t.name);if(r>-1&&r%2==(e<0?1:0))return[i[r+e]]}return null}function el(t){let e=t.type.prop(Fy);return e?e(t.node):t}function Lt(t,e,i,s={}){let r=s.maxScanDistance||Wf,n=s.brackets||zf,o=De(t),a=o.resolveInner(e,i);for(let l=a;l;l=l.parent){let h=Za(l.type,i,n);if(h&&l.from<l.to){let c=el(l);if(c&&(i>0?e>=c.from&&e<c.to:e>c.from&&e<=c.to))return Ny(t,e,i,l,c,h,n)}}return Uy(t,e,i,o,a.type,r,n)}function Ny(t,e,i,s,r,n,o){let a=s.parent,l={from:r.from,to:r.to},h=0,c=a==null?void 0:a.cursor();if(c&&(i<0?c.childBefore(s.from):c.childAfter(s.to)))do if(i<0?c.to<=s.from:c.from>=s.to){if(h==0&&n.indexOf(c.type.name)>-1&&c.from<c.to){let d=el(c);return{start:l,end:d?{from:d.from,to:d.to}:void 0,matched:!0}}else if(Za(c.type,i,o))h++;else if(Za(c.type,-i,o)){if(h==0){let d=el(c);return{start:l,end:d&&d.from<d.to?{from:d.from,to:d.to}:void 0,matched:!1}}h--}}while(i<0?c.prevSibling():c.nextSibling());return{start:l,matched:!1}}function Uy(t,e,i,s,r,n,o){if(i<0?!e:e==t.doc.length)return null;let a=i<0?t.sliceDoc(e-1,e):t.sliceDoc(e,e+1),l=o.indexOf(a);if(l<0||l%2==0!=i>0)return null;let h={from:i<0?e-1:e,to:i>0?e+1:e},c=t.doc.iterRange(e,i>0?t.doc.length:0),d=0;for(let u=0;!c.next().done&&u<=n;){let f=c.value;i<0&&(u+=f.length);let g=e+u*i;for(let m=i>0?0:f.length-1,y=i>0?f.length:-1;m!=y;m+=i){let w=o.indexOf(f[m]);if(!(w<0||s.resolveInner(g+m,1).type!=r))if(w%2==0==i>0)d++;else{if(d==1)return{start:h,end:{from:g+m,to:g+m+1},matched:w>>1==l>>1};d--}}i>0&&(u+=f.length)}return c.done?{start:h,matched:!1}:null}const Hy=Object.create(null),Uc=[Ye.none],Hc=[],Wc=Object.create(null),Wy=Object.create(null);for(let[t,e]of[["variable","variableName"],["variable-2","variableName.special"],["string-2","string.special"],["def","variableName.definition"],["tag","tagName"],["attribute","attributeName"],["type","typeName"],["builtin","variableName.standard"],["qualifier","modifier"],["error","invalid"],["header","heading"],["property","propertyName"]])Wy[t]=zy(Hy,e);function Zo(t,e){Hc.indexOf(t)>-1||(Hc.push(t),console.warn(e))}function zy(t,e){let i=[];for(let a of e.split(" ")){let l=[];for(let h of a.split(".")){let c=t[h]||k[h];c?typeof c=="function"?l.length?l=l.map(c):Zo(h,`Modifier ${h} used at start of tag`):l.length?Zo(h,`Tag ${h} used as modifier`):l=Array.isArray(c)?c:[c]:Zo(h,`Unknown highlighting tag ${h}`)}for(let h of l)i.push(h)}if(!i.length)return 0;let s=e.replace(/ /g,"_"),r=s+" "+i.map(a=>a.id),n=Wc[r];if(n)return n.id;let o=Wc[r]=Ye.define({id:Uc.length,name:s,props:[$f({[s]:i})]});return Uc.push(o),o.id}ae.RTL,ae.LTR;const qy=t=>{let{state:e}=t,i=e.doc.lineAt(e.selection.main.from),s=Yl(t.state,i.from);return s.line?Vy(t):s.block?Qy(t):!1};function Jl(t,e){return({state:i,dispatch:s})=>{if(i.readOnly)return!1;let r=t(e,i);return r?(s(i.update(r)),!0):!1}}const Vy=Jl(Jy,0),jy=Jl(Vf,0),Qy=Jl((t,e)=>Vf(t,e,Xy(e)),0);function Yl(t,e){let i=t.languageDataAt("commentTokens",e,1);return i.length?i[0]:{}}const Ws=50;function Ky(t,{open:e,close:i},s,r){let n=t.sliceDoc(s-Ws,s),o=t.sliceDoc(r,r+Ws),a=/\s*$/.exec(n)[0].length,l=/^\s*/.exec(o)[0].length,h=n.length-a;if(n.slice(h-e.length,h)==e&&o.slice(l,l+i.length)==i)return{open:{pos:s-a,margin:a&&1},close:{pos:r+l,margin:l&&1}};let c,d;r-s<=2*Ws?c=d=t.sliceDoc(s,r):(c=t.sliceDoc(s,s+Ws),d=t.sliceDoc(r-Ws,r));let u=/^\s*/.exec(c)[0].length,f=/\s*$/.exec(d)[0].length,g=d.length-f-i.length;return c.slice(u,u+e.length)==e&&d.slice(g,g+i.length)==i?{open:{pos:s+u+e.length,margin:/\s/.test(c.charAt(u+e.length))?1:0},close:{pos:r-f-i.length,margin:/\s/.test(d.charAt(g-1))?1:0}}:null}function Xy(t){let e=[];for(let i of t.selection.ranges){let s=t.doc.lineAt(i.from),r=i.to<=s.to?s:t.doc.lineAt(i.to);r.from>s.from&&r.from==i.to&&(r=i.to==s.to+1?s:t.doc.lineAt(i.to-1));let n=e.length-1;n>=0&&e[n].to>s.from?e[n].to=r.to:e.push({from:s.from+/^\s*/.exec(s.text)[0].length,to:r.to})}return e}function Vf(t,e,i=e.selection.ranges){let s=i.map(n=>Yl(e,n.from).block);if(!s.every(n=>n))return null;let r=i.map((n,o)=>Ky(e,s[o],n.from,n.to));if(t!=2&&!r.every(n=>n))return{changes:e.changes(i.map((n,o)=>r[o]?[]:[{from:n.from,insert:s[o].open+" "},{from:n.to,insert:" "+s[o].close}]))};if(t!=1&&r.some(n=>n)){let n=[];for(let o=0,a;o<r.length;o++)if(a=r[o]){let l=s[o],{open:h,close:c}=a;n.push({from:h.pos-l.open.length,to:h.pos+h.margin},{from:c.pos-c.margin,to:c.pos+l.close.length})}return{changes:n}}return null}function Jy(t,e,i=e.selection.ranges){let s=[],r=-1;e:for(let{from:n,to:o}of i){let a=s.length,l=1e9,h;for(let c=n;c<=o;){let d=e.doc.lineAt(c);if(h==null&&(h=Yl(e,d.from).line,!h))continue e;if(d.from>r&&(n==o||o>d.from)){r=d.from;let u=/^\s*/.exec(d.text)[0].length,f=u==d.length,g=d.text.slice(u,u+h.length)==h?u:-1;u<d.text.length&&u<l&&(l=u),s.push({line:d,comment:g,token:h,indent:u,empty:f,single:!1})}c=d.to+1}if(l<1e9)for(let c=a;c<s.length;c++)s[c].indent<s[c].line.text.length&&(s[c].indent=l);s.length==a+1&&(s[a].single=!0)}if(t!=2&&s.some(n=>n.comment<0&&(!n.empty||n.single))){let n=[];for(let{line:a,token:l,indent:h,empty:c,single:d}of s)(d||!c)&&n.push({from:a.from+h,insert:l+" "});let o=e.changes(n);return{changes:o,selection:e.selection.map(o,1)}}else if(t!=1&&s.some(n=>n.comment>=0)){let n=[];for(let{line:o,comment:a,token:l}of s)if(a>=0){let h=o.from+a,c=h+l.length;o.text[c-o.from]==" "&&c++,n.push({from:h,to:c})}return{changes:n}}return null}const tl=ei.define(),Yy=ei.define(),Gy=R.define(),jf=R.define({combine(t){return zt(t,{minDepth:100,newGroupDelay:500,joinToEvent:(e,i)=>i},{minDepth:Math.max,newGroupDelay:Math.min,joinToEvent:(e,i)=>(s,r)=>e(s,r)||i(s,r)})}}),Qf=Be.define({create(){return It.empty},update(t,e){let i=e.state.facet(jf),s=e.annotation(tl);if(s){let l=Ke.fromTransaction(e,s.selection),h=s.side,c=h==0?t.undone:t.done;return l?c=zn(c,c.length,i.minDepth,l):c=Jf(c,e.startState.selection),new It(h==0?s.rest:c,h==0?c:s.rest)}let r=e.annotation(Yy);if((r=="full"||r=="before")&&(t=t.isolate()),e.annotation(ke.addToHistory)===!1)return e.changes.empty?t:t.addMapping(e.changes.desc);let n=Ke.fromTransaction(e),o=e.annotation(ke.time),a=e.annotation(ke.userEvent);return n?t=t.addChanges(n,o,a,i,e):e.selection&&(t=t.addSelection(e.startState.selection,o,a,i.newGroupDelay)),(r=="full"||r=="after")&&(t=t.isolate()),t},toJSON(t){return{done:t.done.map(e=>e.toJSON()),undone:t.undone.map(e=>e.toJSON())}},fromJSON(t){return new It(t.done.map(Ke.fromJSON),t.undone.map(Ke.fromJSON))}});function Zy(t={}){return[Qf,jf.of(t),L.domEventHandlers({beforeinput(e,i){let s=e.inputType=="historyUndo"?Kf:e.inputType=="historyRedo"?il:null;return s?(e.preventDefault(),s(i)):!1}})]}function mo(t,e){return function({state:i,dispatch:s}){if(!e&&i.readOnly)return!1;let r=i.field(Qf,!1);if(!r)return!1;let n=r.pop(t,i,e);return n?(s(n),!0):!1}}const Kf=mo(0,!1),il=mo(1,!1),ex=mo(0,!0),tx=mo(1,!0);class Ke{constructor(e,i,s,r,n){this.changes=e,this.effects=i,this.mapped=s,this.startSelection=r,this.selectionsAfter=n}setSelAfter(e){return new Ke(this.changes,this.effects,this.mapped,this.startSelection,e)}toJSON(){var e,i,s;return{changes:(e=this.changes)===null||e===void 0?void 0:e.toJSON(),mapped:(i=this.mapped)===null||i===void 0?void 0:i.toJSON(),startSelection:(s=this.startSelection)===null||s===void 0?void 0:s.toJSON(),selectionsAfter:this.selectionsAfter.map(r=>r.toJSON())}}static fromJSON(e){return new Ke(e.changes&&we.fromJSON(e.changes),[],e.mapped&&Ft.fromJSON(e.mapped),e.startSelection&&$.fromJSON(e.startSelection),e.selectionsAfter.map($.fromJSON))}static fromTransaction(e,i){let s=dt;for(let r of e.startState.facet(Gy)){let n=r(e);n.length&&(s=s.concat(n))}return!s.length&&e.changes.empty?null:new Ke(e.changes.invert(e.startState.doc),s,void 0,i||e.startState.selection,dt)}static selection(e){return new Ke(void 0,dt,void 0,void 0,e)}}function zn(t,e,i,s){let r=e+1>i+20?e-i-1:0,n=t.slice(r,e);return n.push(s),n}function ix(t,e){let i=[],s=!1;return t.iterChangedRanges((r,n)=>i.push(r,n)),e.iterChangedRanges((r,n,o,a)=>{for(let l=0;l<i.length;){let h=i[l++],c=i[l++];a>=h&&o<=c&&(s=!0)}}),s}function sx(t,e){return t.ranges.length==e.ranges.length&&t.ranges.filter((i,s)=>i.empty!=e.ranges[s].empty).length===0}function Xf(t,e){return t.length?e.length?t.concat(e):t:e}const dt=[],rx=200;function Jf(t,e){if(t.length){let i=t[t.length-1],s=i.selectionsAfter.slice(Math.max(0,i.selectionsAfter.length-rx));return s.length&&s[s.length-1].eq(e)?t:(s.push(e),zn(t,t.length-1,1e9,i.setSelAfter(s)))}else return[Ke.selection([e])]}function nx(t){let e=t[t.length-1],i=t.slice();return i[t.length-1]=e.setSelAfter(e.selectionsAfter.slice(0,e.selectionsAfter.length-1)),i}function ea(t,e){if(!t.length)return t;let i=t.length,s=dt;for(;i;){let r=ox(t[i-1],e,s);if(r.changes&&!r.changes.empty||r.effects.length){let n=t.slice(0,i);return n[i-1]=r,n}else e=r.mapped,i--,s=r.selectionsAfter}return s.length?[Ke.selection(s)]:dt}function ox(t,e,i){let s=Xf(t.selectionsAfter.length?t.selectionsAfter.map(a=>a.map(e)):dt,i);if(!t.changes)return Ke.selection(s);let r=t.changes.map(e),n=e.mapDesc(t.changes,!0),o=t.mapped?t.mapped.composeDesc(n):n;return new Ke(r,W.mapEffects(t.effects,e),o,t.startSelection.map(n),s)}const ax=/^(input\.type|delete)($|\.)/;class It{constructor(e,i,s=0,r=void 0){this.done=e,this.undone=i,this.prevTime=s,this.prevUserEvent=r}isolate(){return this.prevTime?new It(this.done,this.undone):this}addChanges(e,i,s,r,n){let o=this.done,a=o[o.length-1];return a&&a.changes&&!a.changes.empty&&e.changes&&(!s||ax.test(s))&&(!a.selectionsAfter.length&&i-this.prevTime<r.newGroupDelay&&r.joinToEvent(n,ix(a.changes,e.changes))||s=="input.type.compose")?o=zn(o,o.length-1,r.minDepth,new Ke(e.changes.compose(a.changes),Xf(W.mapEffects(e.effects,a.changes),a.effects),a.mapped,a.startSelection,dt)):o=zn(o,o.length,r.minDepth,e),new It(o,dt,i,s)}addSelection(e,i,s,r){let n=this.done.length?this.done[this.done.length-1].selectionsAfter:dt;return n.length>0&&i-this.prevTime<r&&s==this.prevUserEvent&&s&&/^select($|\.)/.test(s)&&sx(n[n.length-1],e)?this:new It(Jf(this.done,e),this.undone,i,s)}addMapping(e){return new It(ea(this.done,e),ea(this.undone,e),this.prevTime,this.prevUserEvent)}pop(e,i,s){let r=e==0?this.done:this.undone;if(r.length==0)return null;let n=r[r.length-1],o=n.selectionsAfter[0]||(n.startSelection?n.startSelection.map(n.changes.invertedDesc,1):i.selection);if(s&&n.selectionsAfter.length)return i.update({selection:n.selectionsAfter[n.selectionsAfter.length-1],annotations:tl.of({side:e,rest:nx(r),selection:o}),userEvent:e==0?"select.undo":"select.redo",scrollIntoView:!0});if(n.changes){let a=r.length==1?dt:r.slice(0,r.length-1);return n.mapped&&(a=ea(a,n.mapped)),i.update({changes:n.changes,selection:n.startSelection,effects:n.effects,annotations:tl.of({side:e,rest:a,selection:o}),filter:!1,userEvent:e==0?"undo":"redo",scrollIntoView:!0})}else return null}}It.empty=new It(dt,dt);const lx=[{key:"Mod-z",run:Kf,preventDefault:!0},{key:"Mod-y",mac:"Mod-Shift-z",run:il,preventDefault:!0},{linux:"Ctrl-Shift-z",run:il,preventDefault:!0},{key:"Mod-u",run:ex,preventDefault:!0},{key:"Alt-u",mac:"Mod-Shift-u",run:tx,preventDefault:!0}];function Ds(t,e){return $.create(t.ranges.map(e),t.mainIndex)}function kt(t,e){return t.update({selection:e,scrollIntoView:!0,userEvent:"select"})}function St({state:t,dispatch:e},i){let s=Ds(t.selection,i);return s.eq(t.selection,!0)?!1:(e(kt(t,s)),!0)}function bo(t,e){return $.cursor(e?t.to:t.from)}function Yf(t,e){return St(t,i=>i.empty?t.moveByChar(i,e):bo(i,e))}function Re(t){return t.textDirectionAt(t.state.selection.main.head)==ae.LTR}const Gf=t=>Yf(t,!Re(t)),Zf=t=>Yf(t,Re(t));function ep(t,e){return St(t,i=>i.empty?t.moveByGroup(i,e):bo(i,e))}const hx=t=>ep(t,!Re(t)),cx=t=>ep(t,Re(t));function dx(t,e,i){if(e.type.prop(i))return!0;let s=e.to-e.from;return s&&(s>2||/[^\s,.;:]/.test(t.sliceDoc(e.from,e.to)))||e.firstChild}function vo(t,e,i){let s=De(t).resolveInner(e.head),r=i?V.closedBy:V.openedBy;for(let l=e.head;;){let h=i?s.childAfter(l):s.childBefore(l);if(!h)break;dx(t,h,r)?s=h:l=i?h.to:h.from}let n=s.type.prop(r),o,a;return n&&(o=i?Lt(t,s.from,1):Lt(t,s.to,-1))&&o.matched?a=i?o.end.to:o.end.from:a=i?s.to:s.from,$.cursor(a,i?-1:1)}const ux=t=>St(t,e=>vo(t.state,e,!Re(t))),fx=t=>St(t,e=>vo(t.state,e,Re(t)));function tp(t,e){return St(t,i=>{if(!i.empty)return bo(i,e);let s=t.moveVertically(i,e);return s.head!=i.head?s:t.moveToLineBoundary(i,e)})}const ip=t=>tp(t,!1),sp=t=>tp(t,!0);function rp(t){let e=t.scrollDOM.clientHeight<t.scrollDOM.scrollHeight-2,i=0,s=0,r;if(e){for(let n of t.state.facet(L.scrollMargins)){let o=n(t);o!=null&&o.top&&(i=Math.max(o==null?void 0:o.top,i)),o!=null&&o.bottom&&(s=Math.max(o==null?void 0:o.bottom,s))}r=t.scrollDOM.clientHeight-i-s}else r=(t.dom.ownerDocument.defaultView||window).innerHeight;return{marginTop:i,marginBottom:s,selfScroll:e,height:Math.max(t.defaultLineHeight,r-5)}}function np(t,e){let i=rp(t),{state:s}=t,r=Ds(s.selection,o=>o.empty?t.moveVertically(o,e,i.height):bo(o,e));if(r.eq(s.selection))return!1;let n;if(i.selfScroll){let o=t.coordsAtPos(s.selection.main.head),a=t.scrollDOM.getBoundingClientRect(),l=a.top+i.marginTop,h=a.bottom-i.marginBottom;o&&o.top>l&&o.bottom<h&&(n=L.scrollIntoView(r.main.head,{y:"start",yMargin:o.top-l}))}return t.dispatch(kt(s,r),{effects:n}),!0}const zc=t=>np(t,!1),sl=t=>np(t,!0);function ki(t,e,i){let s=t.lineBlockAt(e.head),r=t.moveToLineBoundary(e,i);if(r.head==e.head&&r.head!=(i?s.to:s.from)&&(r=t.moveToLineBoundary(e,i,!1)),!i&&r.head==s.from&&s.length){let n=/^\s*/.exec(t.state.sliceDoc(s.from,Math.min(s.from+100,s.to)))[0].length;n&&e.head!=s.from+n&&(r=$.cursor(s.from+n))}return r}const px=t=>St(t,e=>ki(t,e,!0)),gx=t=>St(t,e=>ki(t,e,!1)),mx=t=>St(t,e=>ki(t,e,!Re(t))),bx=t=>St(t,e=>ki(t,e,Re(t))),vx=t=>St(t,e=>$.cursor(t.lineBlockAt(e.head).from,1)),yx=t=>St(t,e=>$.cursor(t.lineBlockAt(e.head).to,-1));function xx(t,e,i){let s=!1,r=Ds(t.selection,n=>{let o=Lt(t,n.head,-1)||Lt(t,n.head,1)||n.head>0&&Lt(t,n.head-1,1)||n.head<t.doc.length&&Lt(t,n.head+1,-1);if(!o||!o.end)return n;s=!0;let a=o.start.from==n.head?o.end.to:o.end.from;return $.cursor(a)});return s?(e(kt(t,r)),!0):!1}const wx=({state:t,dispatch:e})=>xx(t,e);function gt(t,e){let i=Ds(t.state.selection,s=>{let r=e(s);return $.range(s.anchor,r.head,r.goalColumn,r.bidiLevel||void 0,r.assoc)});return i.eq(t.state.selection)?!1:(t.dispatch(kt(t.state,i)),!0)}function op(t,e){return gt(t,i=>t.moveByChar(i,e))}const ap=t=>op(t,!Re(t)),lp=t=>op(t,Re(t));function hp(t,e){return gt(t,i=>t.moveByGroup(i,e))}const kx=t=>hp(t,!Re(t)),Sx=t=>hp(t,Re(t)),Cx=t=>gt(t,e=>vo(t.state,e,!Re(t))),$x=t=>gt(t,e=>vo(t.state,e,Re(t)));function cp(t,e){return gt(t,i=>t.moveVertically(i,e))}const dp=t=>cp(t,!1),up=t=>cp(t,!0);function fp(t,e){return gt(t,i=>t.moveVertically(i,e,rp(t).height))}const qc=t=>fp(t,!1),Vc=t=>fp(t,!0),Ox=t=>gt(t,e=>ki(t,e,!0)),Ax=t=>gt(t,e=>ki(t,e,!1)),Px=t=>gt(t,e=>ki(t,e,!Re(t))),Tx=t=>gt(t,e=>ki(t,e,Re(t))),Mx=t=>gt(t,e=>$.cursor(t.lineBlockAt(e.head).from)),Ex=t=>gt(t,e=>$.cursor(t.lineBlockAt(e.head).to)),jc=({state:t,dispatch:e})=>(e(kt(t,{anchor:0})),!0),Qc=({state:t,dispatch:e})=>(e(kt(t,{anchor:t.doc.length})),!0),Kc=({state:t,dispatch:e})=>(e(kt(t,{anchor:t.selection.main.anchor,head:0})),!0),Xc=({state:t,dispatch:e})=>(e(kt(t,{anchor:t.selection.main.anchor,head:t.doc.length})),!0),_x=({state:t,dispatch:e})=>(e(t.update({selection:{anchor:0,head:t.doc.length},userEvent:"select"})),!0),Dx=({state:t,dispatch:e})=>{let i=yo(t).map(({from:s,to:r})=>$.range(s,Math.min(r+1,t.doc.length)));return e(t.update({selection:$.create(i),userEvent:"select"})),!0},Bx=({state:t,dispatch:e})=>{let i=Ds(t.selection,s=>{let r=De(t),n=r.resolveStack(s.from,1);if(s.empty){let o=r.resolveStack(s.from,-1);o.node.from>=n.node.from&&o.node.to<=n.node.to&&(n=o)}for(let o=n;o;o=o.next){let{node:a}=o;if((a.from<s.from&&a.to>=s.to||a.to>s.to&&a.from<=s.from)&&o.next)return $.range(a.to,a.from)}return s});return i.eq(t.selection)?!1:(e(kt(t,i)),!0)};function pp(t,e){let{state:i}=t,s=i.selection,r=i.selection.ranges.slice();for(let n of i.selection.ranges){let o=i.doc.lineAt(n.head);if(e?o.to<t.state.doc.length:o.from>0)for(let a=n;;){let l=t.moveVertically(a,e);if(l.head<o.from||l.head>o.to){r.some(h=>h.head==l.head)||r.push(l);break}else{if(l.head==a.head)break;a=l}}}return r.length==s.ranges.length?!1:(t.dispatch(kt(i,$.create(r,r.length-1))),!0)}const Rx=t=>pp(t,!1),Lx=t=>pp(t,!0),Ix=({state:t,dispatch:e})=>{let i=t.selection,s=null;return i.ranges.length>1?s=$.create([i.main]):i.main.empty||(s=$.create([$.cursor(i.main.head)])),s?(e(kt(t,s)),!0):!1};function Br(t,e){if(t.state.readOnly)return!1;let i="delete.selection",{state:s}=t,r=s.changeByRange(n=>{let{from:o,to:a}=n;if(o==a){let l=e(n);l<o?(i="delete.backward",l=sn(t,l,!1)):l>o&&(i="delete.forward",l=sn(t,l,!0)),o=Math.min(o,l),a=Math.max(a,l)}else o=sn(t,o,!1),a=sn(t,a,!0);return o==a?{range:n}:{changes:{from:o,to:a},range:$.cursor(o,o<n.head?-1:1)}});return r.changes.empty?!1:(t.dispatch(s.update(r,{scrollIntoView:!0,userEvent:i,effects:i=="delete.selection"?L.announce.of(s.phrase("Selection deleted")):void 0})),!0)}function sn(t,e,i){if(t instanceof L)for(let s of t.state.facet(L.atomicRanges).map(r=>r(t)))s.between(e,e,(r,n)=>{r<e&&n>e&&(e=i?n:r)});return e}const gp=(t,e,i)=>Br(t,s=>{let r=s.from,{state:n}=t,o=n.doc.lineAt(r),a,l;if(i&&!e&&r>o.from&&r<o.from+200&&!/[^ \t]/.test(a=o.text.slice(0,r-o.from))){if(a[a.length-1]=="	")return r-1;let h=_s(a,n.tabSize),c=h%Un(n)||Un(n);for(let d=0;d<c&&a[a.length-1-d]==" ";d++)r--;l=r}else l=$e(o.text,r-o.from,e,e)+o.from,l==r&&o.number!=(e?n.doc.lines:1)?l+=e?1:-1:!e&&/[\ufe00-\ufe0f]/.test(o.text.slice(l-o.from,r-o.from))&&(l=$e(o.text,l-o.from,!1,!1)+o.from);return l}),rl=t=>gp(t,!1,!0),mp=t=>gp(t,!0,!1),bp=(t,e)=>Br(t,i=>{let s=i.head,{state:r}=t,n=r.doc.lineAt(s),o=r.charCategorizer(s);for(let a=null;;){if(s==(e?n.to:n.from)){s==i.head&&n.number!=(e?r.doc.lines:1)&&(s+=e?1:-1);break}let l=$e(n.text,s-n.from,e)+n.from,h=n.text.slice(Math.min(s,l)-n.from,Math.max(s,l)-n.from),c=o(h);if(a!=null&&c!=a)break;(h!=" "||s!=i.head)&&(a=c),s=l}return s}),vp=t=>bp(t,!1),Fx=t=>bp(t,!0),Nx=t=>Br(t,e=>{let i=t.lineBlockAt(e.head).to;return e.head<i?i:Math.min(t.state.doc.length,e.head+1)}),Ux=t=>Br(t,e=>{let i=t.moveToLineBoundary(e,!1).head;return e.head>i?i:Math.max(0,e.head-1)}),Hx=t=>Br(t,e=>{let i=t.moveToLineBoundary(e,!0).head;return e.head<i?i:Math.min(t.state.doc.length,e.head+1)}),Wx=({state:t,dispatch:e})=>{if(t.readOnly)return!1;let i=t.changeByRange(s=>({changes:{from:s.from,to:s.to,insert:Y.of(["",""])},range:$.cursor(s.from)}));return e(t.update(i,{scrollIntoView:!0,userEvent:"input"})),!0},zx=({state:t,dispatch:e})=>{if(t.readOnly)return!1;let i=t.changeByRange(s=>{if(!s.empty||s.from==0||s.from==t.doc.length)return{range:s};let r=s.from,n=t.doc.lineAt(r),o=r==n.from?r-1:$e(n.text,r-n.from,!1)+n.from,a=r==n.to?r+1:$e(n.text,r-n.from,!0)+n.from;return{changes:{from:o,to:a,insert:t.doc.slice(r,a).append(t.doc.slice(o,r))},range:$.cursor(a)}});return i.changes.empty?!1:(e(t.update(i,{scrollIntoView:!0,userEvent:"move.character"})),!0)};function yo(t){let e=[],i=-1;for(let s of t.selection.ranges){let r=t.doc.lineAt(s.from),n=t.doc.lineAt(s.to);if(!s.empty&&s.to==n.from&&(n=t.doc.lineAt(s.to-1)),i>=r.number){let o=e[e.length-1];o.to=n.to,o.ranges.push(s)}else e.push({from:r.from,to:n.to,ranges:[s]});i=n.number+1}return e}function yp(t,e,i){if(t.readOnly)return!1;let s=[],r=[];for(let n of yo(t)){if(i?n.to==t.doc.length:n.from==0)continue;let o=t.doc.lineAt(i?n.to+1:n.from-1),a=o.length+1;if(i){s.push({from:n.to,to:o.to},{from:n.from,insert:o.text+t.lineBreak});for(let l of n.ranges)r.push($.range(Math.min(t.doc.length,l.anchor+a),Math.min(t.doc.length,l.head+a)))}else{s.push({from:o.from,to:n.from},{from:n.to,insert:t.lineBreak+o.text});for(let l of n.ranges)r.push($.range(l.anchor-a,l.head-a))}}return s.length?(e(t.update({changes:s,scrollIntoView:!0,selection:$.create(r,t.selection.mainIndex),userEvent:"move.line"})),!0):!1}const qx=({state:t,dispatch:e})=>yp(t,e,!1),Vx=({state:t,dispatch:e})=>yp(t,e,!0);function xp(t,e,i){if(t.readOnly)return!1;let s=[];for(let n of yo(t))i?s.push({from:n.from,insert:t.doc.slice(n.from,n.to)+t.lineBreak}):s.push({from:n.to,insert:t.lineBreak+t.doc.slice(n.from,n.to)});let r=t.changes(s);return e(t.update({changes:r,selection:t.selection.map(r,i?1:-1),scrollIntoView:!0,userEvent:"input.copyline"})),!0}const jx=({state:t,dispatch:e})=>xp(t,e,!1),Qx=({state:t,dispatch:e})=>xp(t,e,!0),Kx=t=>{if(t.state.readOnly)return!1;let{state:e}=t,i=e.changes(yo(e).map(({from:r,to:n})=>(r>0?r--:n<e.doc.length&&n++,{from:r,to:n}))),s=Ds(e.selection,r=>{let n;if(t.lineWrapping){let o=t.lineBlockAt(r.head),a=t.coordsAtPos(r.head,r.assoc||1);a&&(n=o.bottom+t.documentTop-a.bottom+t.defaultLineHeight/2)}return t.moveVertically(r,!0,n)}).map(i);return t.dispatch({changes:i,selection:s,scrollIntoView:!0,userEvent:"delete.line"}),!0};function Xx(t,e){if(/\(\)|\[\]|\{\}/.test(t.sliceDoc(e-1,e+1)))return{from:e,to:e};let i=De(t).resolveInner(e),s=i.childBefore(e),r=i.childAfter(e),n;return s&&r&&s.to<=e&&r.from>=e&&(n=s.type.prop(V.closedBy))&&n.indexOf(r.name)>-1&&t.doc.lineAt(s.to).from==t.doc.lineAt(r.from).from&&!/\S/.test(t.sliceDoc(s.to,r.from))?{from:s.to,to:r.from}:null}const Jc=wp(!1),Jx=wp(!0);function wp(t){return({state:e,dispatch:i})=>{if(e.readOnly)return!1;let s=e.changeByRange(r=>{let{from:n,to:o}=r,a=e.doc.lineAt(n),l=!t&&n==o&&Xx(e,n);t&&(n=o=(o<=a.to?a:e.doc.lineAt(o)).to);let h=new po(e,{simulateBreak:n,simulateDoubleBreak:!!l}),c=Kl(h,n);for(c==null&&(c=_s(/^\s*/.exec(e.doc.lineAt(n).text)[0],e.tabSize));o<a.to&&/\s/.test(a.text[o-a.from]);)o++;l?{from:n,to:o}=l:n>a.from&&n<a.from+100&&!/\S/.test(a.text.slice(0,n))&&(n=a.from);let d=["",br(e,c)];return l&&d.push(br(e,h.lineIndent(a.from,-1))),{changes:{from:n,to:o,insert:Y.of(d)},range:$.cursor(n+1+d[1].length)}});return i(e.update(s,{scrollIntoView:!0,userEvent:"input"})),!0}}function Gl(t,e){let i=-1;return t.changeByRange(s=>{let r=[];for(let o=s.from;o<=s.to;){let a=t.doc.lineAt(o);a.number>i&&(s.empty||s.to>a.from)&&(e(a,r,s),i=a.number),o=a.to+1}let n=t.changes(r);return{changes:r,range:$.range(n.mapPos(s.anchor,1),n.mapPos(s.head,1))}})}const Yx=({state:t,dispatch:e})=>{if(t.readOnly)return!1;let i=Object.create(null),s=new po(t,{overrideIndentation:n=>{let o=i[n];return o??-1}}),r=Gl(t,(n,o,a)=>{let l=Kl(s,n.from);if(l==null)return;/\S/.test(n.text)||(l=0);let h=/^\s*/.exec(n.text)[0],c=br(t,l);(h!=c||a.from<n.from+h.length)&&(i[n.from]=l,o.push({from:n.from,to:n.from+h.length,insert:c}))});return r.changes.empty||e(t.update(r,{userEvent:"indent"})),!0},Gx=({state:t,dispatch:e})=>t.readOnly?!1:(e(t.update(Gl(t,(i,s)=>{s.push({from:i.from,insert:t.facet(Ql)})}),{userEvent:"input.indent"})),!0),Zx=({state:t,dispatch:e})=>t.readOnly?!1:(e(t.update(Gl(t,(i,s)=>{let r=/^\s*/.exec(i.text)[0];if(!r)return;let n=_s(r,t.tabSize),o=0,a=br(t,Math.max(0,n-Un(t)));for(;o<r.length&&o<a.length&&r.charCodeAt(o)==a.charCodeAt(o);)o++;s.push({from:i.from+o,to:i.from+r.length,insert:a.slice(o)})}),{userEvent:"delete.dedent"})),!0),ew=t=>(t.setTabFocusMode(),!0),tw=[{key:"Ctrl-b",run:Gf,shift:ap,preventDefault:!0},{key:"Ctrl-f",run:Zf,shift:lp},{key:"Ctrl-p",run:ip,shift:dp},{key:"Ctrl-n",run:sp,shift:up},{key:"Ctrl-a",run:vx,shift:Mx},{key:"Ctrl-e",run:yx,shift:Ex},{key:"Ctrl-d",run:mp},{key:"Ctrl-h",run:rl},{key:"Ctrl-k",run:Nx},{key:"Ctrl-Alt-h",run:vp},{key:"Ctrl-o",run:Wx},{key:"Ctrl-t",run:zx},{key:"Ctrl-v",run:sl}],iw=[{key:"ArrowLeft",run:Gf,shift:ap,preventDefault:!0},{key:"Mod-ArrowLeft",mac:"Alt-ArrowLeft",run:hx,shift:kx,preventDefault:!0},{mac:"Cmd-ArrowLeft",run:mx,shift:Px,preventDefault:!0},{key:"ArrowRight",run:Zf,shift:lp,preventDefault:!0},{key:"Mod-ArrowRight",mac:"Alt-ArrowRight",run:cx,shift:Sx,preventDefault:!0},{mac:"Cmd-ArrowRight",run:bx,shift:Tx,preventDefault:!0},{key:"ArrowUp",run:ip,shift:dp,preventDefault:!0},{mac:"Cmd-ArrowUp",run:jc,shift:Kc},{mac:"Ctrl-ArrowUp",run:zc,shift:qc},{key:"ArrowDown",run:sp,shift:up,preventDefault:!0},{mac:"Cmd-ArrowDown",run:Qc,shift:Xc},{mac:"Ctrl-ArrowDown",run:sl,shift:Vc},{key:"PageUp",run:zc,shift:qc},{key:"PageDown",run:sl,shift:Vc},{key:"Home",run:gx,shift:Ax,preventDefault:!0},{key:"Mod-Home",run:jc,shift:Kc},{key:"End",run:px,shift:Ox,preventDefault:!0},{key:"Mod-End",run:Qc,shift:Xc},{key:"Enter",run:Jc,shift:Jc},{key:"Mod-a",run:_x},{key:"Backspace",run:rl,shift:rl,preventDefault:!0},{key:"Delete",run:mp,preventDefault:!0},{key:"Mod-Backspace",mac:"Alt-Backspace",run:vp,preventDefault:!0},{key:"Mod-Delete",mac:"Alt-Delete",run:Fx,preventDefault:!0},{mac:"Mod-Backspace",run:Ux,preventDefault:!0},{mac:"Mod-Delete",run:Hx,preventDefault:!0}].concat(tw.map(t=>({mac:t.key,run:t.run,shift:t.shift}))),sw=[{key:"Alt-ArrowLeft",mac:"Ctrl-ArrowLeft",run:ux,shift:Cx},{key:"Alt-ArrowRight",mac:"Ctrl-ArrowRight",run:fx,shift:$x},{key:"Alt-ArrowUp",run:qx},{key:"Shift-Alt-ArrowUp",run:jx},{key:"Alt-ArrowDown",run:Vx},{key:"Shift-Alt-ArrowDown",run:Qx},{key:"Mod-Alt-ArrowUp",run:Rx},{key:"Mod-Alt-ArrowDown",run:Lx},{key:"Escape",run:Ix},{key:"Mod-Enter",run:Jx},{key:"Alt-l",mac:"Ctrl-l",run:Dx},{key:"Mod-i",run:Bx,preventDefault:!0},{key:"Mod-[",run:Zx},{key:"Mod-]",run:Gx},{key:"Mod-Alt-\\",run:Yx},{key:"Shift-Mod-k",run:Kx},{key:"Shift-Mod-\\",run:wx},{key:"Mod-/",run:qy},{key:"Alt-A",run:jy},{key:"Ctrl-m",mac:"Shift-Alt-m",run:ew}].concat(iw),Yc=typeof String.prototype.normalize=="function"?t=>t.normalize("NFKD"):t=>t;class Ps{constructor(e,i,s=0,r=e.length,n,o){this.test=o,this.value={from:0,to:0,precise:!1},this.done=!1,this.matches=[],this.buffer="",this.bufferPos=0,this.iter=e.iterRange(s,r),this.bufferStart=s,this.normalize=n?a=>n(Yc(a)):Yc,this.query=this.normalize(i)}peek(){if(this.bufferPos==this.buffer.length){if(this.bufferStart+=this.buffer.length,this.iter.next(),this.iter.done)return-1;this.bufferPos=0,this.buffer=this.iter.value}return qe(this.buffer,this.bufferPos)}next(){for(;this.matches.length;)this.matches.pop();return this.nextOverlapping()}nextOverlapping(){for(;;){let e=this.peek();if(e<0)return this.done=!0,this;let i=Sl(e),s=this.bufferStart+this.bufferPos;this.bufferPos+=Dt(e);let r=this.normalize(i);if(r.length)for(let n=0,o=s,a=!0;;n++){let l=r.charCodeAt(n),h=this.match(l,o,a,this.bufferPos+this.bufferStart,n==r.length-1);if(h)return this.value=h,this;if(n==r.length-1)break;a&&n<i.length&&i.charCodeAt(n)==l?o++:a=!1}}}match(e,i,s,r,n){let o=null;for(let a=0;a<this.matches.length;){let l=this.matches[a],h=!1;this.query.charCodeAt(l.index)==e&&(l.index==this.query.length-1?o={from:l.from,to:r,precise:n&&l.precise}:(l.index++,h=!0)),h?a++:this.matches.splice(a,1)}return this.query.charCodeAt(0)==e&&(this.query.length==1?o={from:i,to:r,precise:s&&n}:this.matches.push({from:i,index:1,precise:s})),o&&this.test&&!this.test(o.from,o.to,this.buffer,this.bufferStart)&&(o=null),o}}typeof Symbol<"u"&&(Ps.prototype[Symbol.iterator]=function(){return this});const kp={from:-1,to:-1,match:/.*/.exec(""),precise:!0},Zl="gm"+(/x/.unicode==null?"":"u");class Sp{constructor(e,i,s,r=0,n=e.length){if(this.text=e,this.to=n,this.curLine="",this.done=!1,this.value=kp,/\\[sWDnr]|\n|\r|\[\^/.test(i))return new Cp(e,i,s,r,n);this.re=new RegExp(i,Zl+(s!=null&&s.ignoreCase?"i":"")),this.test=s==null?void 0:s.test,this.iter=e.iter();let o=e.lineAt(r);this.curLineStart=o.from,this.matchPos=qn(e,r),this.getLine(this.curLineStart)}getLine(e){this.iter.next(e),this.iter.lineBreak?this.curLine="":(this.curLine=this.iter.value,this.curLineStart+this.curLine.length>this.to&&(this.curLine=this.curLine.slice(0,this.to-this.curLineStart)),this.iter.next())}nextLine(){this.curLineStart=this.curLineStart+this.curLine.length+1,this.curLineStart>this.to?this.curLine="":this.getLine(0)}next(){for(let e=this.matchPos-this.curLineStart;;){this.re.lastIndex=e;let i=this.matchPos<=this.to&&this.re.exec(this.curLine);if(i){let s=this.curLineStart+i.index,r=s+i[0].length;if(this.matchPos=qn(this.text,r+(s==r?1:0)),s==this.curLineStart+this.curLine.length&&this.nextLine(),(s<r||s>this.value.to)&&(!this.test||this.test(s,r,i)))return this.value={from:s,to:r,precise:!0,match:i},this;e=this.matchPos-this.curLineStart}else if(this.curLineStart+this.curLine.length<this.to)this.nextLine(),e=0;else return this.done=!0,this}}}const ta=new WeakMap;class bs{constructor(e,i){this.from=e,this.text=i}get to(){return this.from+this.text.length}static get(e,i,s){let r=ta.get(e);if(!r||r.from>=s||r.to<=i){let a=new bs(i,e.sliceString(i,s));return ta.set(e,a),a}if(r.from==i&&r.to==s)return r;let{text:n,from:o}=r;return o>i&&(n=e.sliceString(i,o)+n,o=i),r.to<s&&(n+=e.sliceString(r.to,s)),ta.set(e,new bs(o,n)),new bs(i,n.slice(i-o,s-o))}}class Cp{constructor(e,i,s,r,n){this.text=e,this.to=n,this.done=!1,this.value=kp,this.matchPos=qn(e,r),this.re=new RegExp(i,Zl+(s!=null&&s.ignoreCase?"i":"")),this.test=s==null?void 0:s.test,this.flat=bs.get(e,r,this.chunkEnd(r+5e3))}chunkEnd(e){return e>=this.to?this.to:this.text.lineAt(e).to}next(){for(;;){let e=this.re.lastIndex=this.matchPos-this.flat.from,i=this.re.exec(this.flat.text);if(i&&!i[0]&&i.index==e&&(this.re.lastIndex=e+1,i=this.re.exec(this.flat.text)),i){let s=this.flat.from+i.index,r=s+i[0].length;if((this.flat.to>=this.to||i.index+i[0].length<=this.flat.text.length-10)&&(!this.test||this.test(s,r,i)))return this.value={from:s,to:r,precise:!0,match:i},this.matchPos=qn(this.text,r+(s==r?1:0)),this}if(this.flat.to==this.to)return this.done=!0,this;this.flat=bs.get(this.text,this.flat.from,this.chunkEnd(this.flat.from+this.flat.text.length*2))}}}typeof Symbol<"u"&&(Sp.prototype[Symbol.iterator]=Cp.prototype[Symbol.iterator]=function(){return this});function rw(t){try{return new RegExp(t,Zl),!0}catch{return!1}}function qn(t,e){if(e>=t.length)return e;let i=t.lineAt(e),s;for(;e<i.to&&(s=i.text.charCodeAt(e-i.from))>=56320&&s<57344;)e++;return e}const nw=t=>{let{state:e}=t,i=String(e.doc.lineAt(t.state.selection.main.head).number),{close:s,result:r}=S0(t,{label:e.phrase("Go to line"),input:{type:"text",name:"line",value:i},focus:!0,submitLabel:e.phrase("go")});return r.then(n=>{let o=n&&/^([+-])?(\d+)?(:\d+)?(%)?$/.exec(n.elements.line.value);if(!o){t.dispatch({effects:s});return}let a=e.doc.lineAt(e.selection.main.head),[,l,h,c,d]=o,u=c?+c.slice(1):0,f=h?+h:a.number;if(h&&d){let y=f/100;l&&(y=y*(l=="-"?-1:1)+a.number/e.doc.lines),f=Math.round(e.doc.lines*y)}else h&&l&&(f=f*(l=="-"?-1:1)+a.number);let g=e.doc.line(Math.max(1,Math.min(e.doc.lines,f))),m=$.cursor(g.from+Math.max(0,Math.min(u,g.length)));t.dispatch({effects:[s,L.scrollIntoView(m.from,{y:"center"})],selection:m})}),!0},ow={highlightWordAroundCursor:!1,minSelectionLength:1,maxMatches:100,wholeWords:!1},aw=R.define({combine(t){return zt(t,ow,{highlightWordAroundCursor:(e,i)=>e||i,minSelectionLength:Math.min,maxMatches:Math.min})}});function lw(t){return[fw,uw]}const hw=U.mark({class:"cm-selectionMatch"}),cw=U.mark({class:"cm-selectionMatch cm-selectionMatch-main"});function Gc(t,e,i,s){return(i==0||t(e.sliceDoc(i-1,i))!=fe.Word)&&(s==e.doc.length||t(e.sliceDoc(s,s+1))!=fe.Word)}function dw(t,e,i,s){return t(e.sliceDoc(i,i+1))==fe.Word&&t(e.sliceDoc(s-1,s))==fe.Word}const uw=ye.fromClass(class{constructor(t){this.decorations=this.getDeco(t)}update(t){(t.selectionSet||t.docChanged||t.viewportChanged)&&(this.decorations=this.getDeco(t.view))}getDeco(t){let e=t.state.facet(aw),{state:i}=t,s=i.selection;if(s.ranges.length>1)return U.none;let r=s.main,n,o=null;if(r.empty){if(!e.highlightWordAroundCursor)return U.none;let l=i.wordAt(r.head);if(!l)return U.none;o=i.charCategorizer(r.head),n=i.sliceDoc(l.from,l.to)}else{let l=r.to-r.from;if(l<e.minSelectionLength||l>200)return U.none;if(e.wholeWords){if(n=i.sliceDoc(r.from,r.to),o=i.charCategorizer(r.head),!(Gc(o,i,r.from,r.to)&&dw(o,i,r.from,r.to)))return U.none}else if(n=i.sliceDoc(r.from,r.to),!n)return U.none}let a=[];for(let l of t.visibleRanges){let h=new Ps(i.doc,n,l.from,l.to);for(;!h.next().done;){let{from:c,to:d}=h.value;if((!o||Gc(o,i,c,d))&&(r.empty&&c<=r.from&&d>=r.to?a.push(cw.range(c,d)):(c>=r.to||d<=r.from)&&a.push(hw.range(c,d)),a.length>e.maxMatches))return U.none}}return U.set(a)}},{decorations:t=>t.decorations}),fw=L.baseTheme({".cm-selectionMatch":{backgroundColor:"#99ff7780"},".cm-searchMatch .cm-selectionMatch":{backgroundColor:"transparent"}}),pw=({state:t,dispatch:e})=>{let{selection:i}=t,s=$.create(i.ranges.map(r=>t.wordAt(r.head)||$.cursor(r.head)),i.mainIndex);return s.eq(i)?!1:(e(t.update({selection:s})),!0)};function gw(t,e){let{main:i,ranges:s}=t.selection,r=t.wordAt(i.head),n=r&&r.from==i.from&&r.to==i.to;for(let o=!1,a=new Ps(t.doc,e,s[s.length-1].to);;)if(a.next(),a.done){if(o)return null;a=new Ps(t.doc,e,0,Math.max(0,s[s.length-1].from-1)),o=!0}else{if(o&&s.some(l=>l.from==a.value.from))continue;if(n){let l=t.wordAt(a.value.from);if(!l||l.from!=a.value.from||l.to!=a.value.to)continue}return a.value}}const mw=({state:t,dispatch:e})=>{let{ranges:i}=t.selection;if(i.some(n=>n.from===n.to))return pw({state:t,dispatch:e});let s=t.sliceDoc(i[0].from,i[0].to);if(t.selection.ranges.some(n=>t.sliceDoc(n.from,n.to)!=s))return!1;let r=gw(t,s);return r?(e(t.update({selection:t.selection.addRange($.range(r.from,r.to),!1),effects:L.scrollIntoView(r.to)})),!0):!1},Bs=R.define({combine(t){return zt(t,{top:!1,caseSensitive:!1,literal:!1,regexp:!1,wholeWord:!1,createPanel:e=>new Mw(e),scrollToMatch:e=>L.scrollIntoView(e)})}});class $p{constructor(e){this.search=e.search,this.caseSensitive=!!e.caseSensitive,this.literal=!!e.literal,this.regexp=!!e.regexp,this.replace=e.replace||"",this.valid=!!this.search&&(!this.regexp||rw(this.search)),this.unquoted=this.unquote(this.search),this.wholeWord=!!e.wholeWord,this.test=e.test}unquote(e){return this.literal?e:e.replace(/\\([nrt\\])/g,(i,s)=>s=="n"?`
`:s=="r"?"\r":s=="t"?"	":"\\")}eq(e){return this.search==e.search&&this.replace==e.replace&&this.caseSensitive==e.caseSensitive&&this.regexp==e.regexp&&this.wholeWord==e.wholeWord&&this.test==e.test}create(){return this.regexp?new kw(this):new yw(this)}getCursor(e,i=0,s){let r=e.doc?e:J.create({doc:e});return s==null&&(s=r.doc.length),this.regexp?rs(this,r,i,s):ss(this,r,i,s)}}class Op{constructor(e){this.spec=e}}function bw(t,e,i){return(s,r,n,o)=>{if(i&&!i(s,r,n,o))return!1;let a=s>=o&&r<=o+n.length?n.slice(s-o,r-o):e.doc.sliceString(s,r);return t(a,e,s,r)}}function ss(t,e,i,s){let r;return t.wholeWord&&(r=vw(e.doc,e.charCategorizer(e.selection.main.head))),t.test&&(r=bw(t.test,e,r)),new Ps(e.doc,t.unquoted,i,s,t.caseSensitive?void 0:n=>n.toLowerCase(),r)}function vw(t,e){return(i,s,r,n)=>((n>i||n+r.length<s)&&(n=Math.max(0,i-2),r=t.sliceString(n,Math.min(t.length,s+2))),(e(Vn(r,i-n))!=fe.Word||e(jn(r,i-n))!=fe.Word)&&(e(jn(r,s-n))!=fe.Word||e(Vn(r,s-n))!=fe.Word))}class yw extends Op{constructor(e){super(e)}nextMatch(e,i,s){let r=ss(this.spec,e,s,e.doc.length).nextOverlapping();if(r.done){let n=Math.min(e.doc.length,i+this.spec.unquoted.length);r=ss(this.spec,e,0,n).nextOverlapping()}return r.done||r.value.from==i&&r.value.to==s?null:r.value}prevMatchInRange(e,i,s){for(let r=s;;){let n=Math.max(i,r-1e4-this.spec.unquoted.length),o=ss(this.spec,e,n,r),a=null;for(;!o.nextOverlapping().done;)a=o.value;if(a)return a;if(n==i)return null;r-=1e4}}prevMatch(e,i,s){let r=this.prevMatchInRange(e,0,i);return r||(r=this.prevMatchInRange(e,Math.max(0,s-this.spec.unquoted.length),e.doc.length)),r&&(r.from!=i||r.to!=s)?r:null}getReplacement(e){return this.spec.unquote(this.spec.replace)}matchAll(e,i){let s=ss(this.spec,e,0,e.doc.length),r=[];for(;!s.next().done;){if(r.length>=i)return null;r.push(s.value)}return r}highlight(e,i,s,r){let n=ss(this.spec,e,Math.max(0,i-this.spec.unquoted.length),Math.min(s+this.spec.unquoted.length,e.doc.length));for(;!n.next().done;)r(n.value.from,n.value.to)}}function xw(t,e,i){return(s,r,n)=>(!i||i(s,r,n))&&t(n[0],e,s,r)}function rs(t,e,i,s){let r;return t.wholeWord&&(r=ww(e.charCategorizer(e.selection.main.head))),t.test&&(r=xw(t.test,e,r)),new Sp(e.doc,t.search,{ignoreCase:!t.caseSensitive,test:r},i,s)}function Vn(t,e){return t.slice($e(t,e,!1),e)}function jn(t,e){return t.slice(e,$e(t,e))}function ww(t){return(e,i,s)=>!s[0].length||(t(Vn(s.input,s.index))!=fe.Word||t(jn(s.input,s.index))!=fe.Word)&&(t(jn(s.input,s.index+s[0].length))!=fe.Word||t(Vn(s.input,s.index+s[0].length))!=fe.Word)}class kw extends Op{nextMatch(e,i,s){let r=rs(this.spec,e,s,e.doc.length).next();return r.done&&(r=rs(this.spec,e,0,i).next()),r.done?null:r.value}prevMatchInRange(e,i,s){for(let r=1;;r++){let n=Math.max(i,s-r*1e4),o=rs(this.spec,e,n,s),a=null;for(;!o.next().done;)a=o.value;if(a&&(n==i||a.from>n+10))return a;if(n==i)return null}}prevMatch(e,i,s){return this.prevMatchInRange(e,0,i)||this.prevMatchInRange(e,s,e.doc.length)}getReplacement(e){return this.spec.unquote(this.spec.replace).replace(/\$([$&]|\d+)/g,(i,s)=>{if(s=="&")return e.match[0];if(s=="$")return"$";for(let r=s.length;r>0;r--){let n=+s.slice(0,r);if(n>0&&n<e.match.length)return e.match[n]+s.slice(r)}return i})}matchAll(e,i){let s=rs(this.spec,e,0,e.doc.length),r=[];for(;!s.next().done;){if(r.length>=i)return null;r.push(s.value)}return r}highlight(e,i,s,r){let n=rs(this.spec,e,Math.max(0,i-250),Math.min(s+250,e.doc.length));for(;!n.next().done;)r(n.value.from,n.value.to)}}const vr=W.define(),eh=W.define(),ci=Be.define({create(t){return new ia(nl(t).create(),null)},update(t,e){for(let i of e.effects)i.is(vr)?t=new ia(i.value.create(),t.panel):i.is(eh)&&(t=new ia(t.query,i.value?th:null));return t},provide:t=>pr.from(t,e=>e.panel)});class ia{constructor(e,i){this.query=e,this.panel=i}}const Sw=U.mark({class:"cm-searchMatch"}),Cw=U.mark({class:"cm-searchMatch cm-searchMatch-selected"}),$w=ye.fromClass(class{constructor(t){this.view=t,this.decorations=this.highlight(t.state.field(ci))}update(t){let e=t.state.field(ci);(e!=t.startState.field(ci)||t.docChanged||t.selectionSet||t.viewportChanged)&&(this.decorations=this.highlight(e))}highlight({query:t,panel:e}){if(!e||!t.spec.valid)return U.none;let{view:i}=this,s=new Jt;for(let r=0,n=i.visibleRanges,o=n.length;r<o;r++){let{from:a,to:l}=n[r];for(;r<o-1&&l>n[r+1].from-500;)l=n[++r].to;t.highlight(i.state,a,l,(h,c)=>{let d=i.state.selection.ranges.some(u=>u.from==h&&u.to==c);s.add(h,c,d?Cw:Sw)})}return s.finish()}},{decorations:t=>t.decorations});function Rr(t){return e=>{let i=e.state.field(ci,!1);return i&&i.query.spec.valid?t(e,i):Tp(e)}}const Qn=Rr((t,{query:e})=>{let{to:i}=t.state.selection.main,s=e.nextMatch(t.state,i,i);if(!s)return!1;let r=$.single(s.from,s.to),n=t.state.facet(Bs);return t.dispatch({selection:r,effects:[ih(t,s),n.scrollToMatch(r.main,t)],userEvent:"select.search"}),Pp(t),!0}),Kn=Rr((t,{query:e})=>{let{state:i}=t,{from:s}=i.selection.main,r=e.prevMatch(i,s,s);if(!r)return!1;let n=$.single(r.from,r.to),o=t.state.facet(Bs);return t.dispatch({selection:n,effects:[ih(t,r),o.scrollToMatch(n.main,t)],userEvent:"select.search"}),Pp(t),!0}),Ow=Rr((t,{query:e})=>{let i=e.matchAll(t.state,1e3);return!i||!i.length?!1:(t.dispatch({selection:$.create(i.map(s=>$.range(s.from,s.to))),userEvent:"select.search.matches"}),!0)}),Aw=({state:t,dispatch:e})=>{let i=t.selection;if(i.ranges.length>1||i.main.empty)return!1;let{from:s,to:r}=i.main,n=[],o=0;for(let a=new Ps(t.doc,t.sliceDoc(s,r));!a.next().done;){if(n.length>1e3)return!1;a.value.from==s&&(o=n.length),n.push($.range(a.value.from,a.value.to))}return e(t.update({selection:$.create(n,o),userEvent:"select.search.matches"})),!0},Zc=Rr((t,{query:e})=>{let{state:i}=t,{from:s,to:r}=i.selection.main;if(i.readOnly)return!1;let n=e.nextMatch(i,s,s);if(!n)return!1;let o=n,a=[],l,h,c=[];o.precise?o.from==s&&o.to==r&&(h=i.toText(e.getReplacement(o)),a.push({from:o.from,to:o.to,insert:h}),c.push(L.announce.of(i.phrase("replaced match on line $",i.doc.lineAt(s).number)+"."))):o=e.nextMatch(i,o.from,o.to);let d=t.state.changes(a);return o&&(l=$.single(o.from,o.to).map(d),c.push(ih(t,o)),c.push(i.facet(Bs).scrollToMatch(l.main,t))),t.dispatch({changes:d,selection:l,effects:c,userEvent:"input.replace"}),!0}),Pw=Rr((t,{query:e})=>{if(t.state.readOnly)return!1;let i=[];for(let r of e.matchAll(t.state,1e9)){let{from:n,to:o,precise:a}=r;a&&i.push({from:n,to:o,insert:e.getReplacement(r)})}if(!i.length)return!1;let s=t.state.phrase("replaced $ matches",i.length)+".";return t.dispatch({changes:i,effects:L.announce.of(s),userEvent:"input.replace.all"}),!0});function th(t){return t.state.facet(Bs).createPanel(t)}function nl(t,e){var i,s,r,n,o;let a=t.selection.main,l=a.empty||a.to>a.from+100?"":t.sliceDoc(a.from,a.to);if(e&&!l)return e;let h=t.facet(Bs);return new $p({search:((i=e==null?void 0:e.literal)!==null&&i!==void 0?i:h.literal)?l:l.replace(/\n/g,"\\n"),caseSensitive:(s=e==null?void 0:e.caseSensitive)!==null&&s!==void 0?s:h.caseSensitive,literal:(r=e==null?void 0:e.literal)!==null&&r!==void 0?r:h.literal,regexp:(n=e==null?void 0:e.regexp)!==null&&n!==void 0?n:h.regexp,wholeWord:(o=e==null?void 0:e.wholeWord)!==null&&o!==void 0?o:h.wholeWord})}function Ap(t){let e=Wl(t,th);return e&&e.dom.querySelector("[main-field]")}function Pp(t){let e=Ap(t);e&&e==t.root.activeElement&&e.select()}const Tp=t=>{let e=t.state.field(ci,!1);if(e&&e.panel){let i=Ap(t);if(i&&i!=t.root.activeElement){let s=nl(t.state,e.query.spec);s.valid&&t.dispatch({effects:vr.of(s)}),i.focus(),i.select()}}else t.dispatch({effects:[eh.of(!0),e?vr.of(nl(t.state,e.query.spec)):W.appendConfig.of(_w)]});return!0},Mp=t=>{let e=t.state.field(ci,!1);if(!e||!e.panel)return!1;let i=Wl(t,th);return i&&i.dom.contains(t.root.activeElement)&&t.focus(),t.dispatch({effects:eh.of(!1)}),!0},Tw=[{key:"Mod-f",run:Tp,scope:"editor search-panel"},{key:"F3",run:Qn,shift:Kn,scope:"editor search-panel",preventDefault:!0},{key:"Mod-g",run:Qn,shift:Kn,scope:"editor search-panel",preventDefault:!0},{key:"Escape",run:Mp,scope:"editor search-panel"},{key:"Mod-Shift-l",run:Aw},{key:"Mod-Alt-g",run:nw},{key:"Mod-d",run:mw,preventDefault:!0}];class Mw{constructor(e){this.view=e;let i=this.query=e.state.field(ci).query.spec;this.commit=this.commit.bind(this),this.searchField=se("input",{value:i.search,placeholder:Ze(e,"Find"),"aria-label":Ze(e,"Find"),class:"cm-textfield",name:"search",form:"","main-field":"true",onchange:this.commit,onkeyup:this.commit}),this.replaceField=se("input",{value:i.replace,placeholder:Ze(e,"Replace"),"aria-label":Ze(e,"Replace"),class:"cm-textfield",name:"replace",form:"",onchange:this.commit,onkeyup:this.commit}),this.caseField=se("input",{type:"checkbox",name:"case",form:"",checked:i.caseSensitive,onchange:this.commit}),this.reField=se("input",{type:"checkbox",name:"re",form:"",checked:i.regexp,onchange:this.commit}),this.wordField=se("input",{type:"checkbox",name:"word",form:"",checked:i.wholeWord,onchange:this.commit});function s(r,n,o){return se("button",{class:"cm-button",name:r,onclick:n,type:"button"},o)}this.dom=se("div",{onkeydown:r=>this.keydown(r),class:"cm-search"},[this.searchField,s("next",()=>Qn(e),[Ze(e,"next")]),s("prev",()=>Kn(e),[Ze(e,"previous")]),s("select",()=>Ow(e),[Ze(e,"all")]),se("label",null,[this.caseField,Ze(e,"match case")]),se("label",null,[this.reField,Ze(e,"regexp")]),se("label",null,[this.wordField,Ze(e,"by word")]),...e.state.readOnly?[]:[se("br"),this.replaceField,s("replace",()=>Zc(e),[Ze(e,"replace")]),s("replaceAll",()=>Pw(e),[Ze(e,"replace all")])],se("button",{name:"close",onclick:()=>Mp(e),"aria-label":Ze(e,"close"),type:"button"},["×"])])}commit(){let e=new $p({search:this.searchField.value,caseSensitive:this.caseField.checked,regexp:this.reField.checked,wholeWord:this.wordField.checked,replace:this.replaceField.value});e.eq(this.query)||(this.query=e,this.view.dispatch({effects:vr.of(e)}))}keydown(e){Rv(this.view,e,"search-panel")?e.preventDefault():e.keyCode==13&&e.target==this.searchField?(e.preventDefault(),(e.shiftKey?Kn:Qn)(this.view)):e.keyCode==13&&e.target==this.replaceField&&(e.preventDefault(),Zc(this.view))}update(e){for(let i of e.transactions)for(let s of i.effects)s.is(vr)&&!s.value.eq(this.query)&&this.setQuery(s.value)}setQuery(e){this.query=e,this.searchField.value=e.search,this.replaceField.value=e.replace,this.caseField.checked=e.caseSensitive,this.reField.checked=e.regexp,this.wordField.checked=e.wholeWord}mount(){this.searchField.select()}get pos(){return 80}get top(){return this.view.state.facet(Bs).top}}function Ze(t,e){return t.state.phrase(e)}const rn=30,nn=/[\s\.,:;?!]/;function ih(t,{from:e,to:i}){let s=t.state.doc.lineAt(e),r=t.state.doc.lineAt(i).to,n=Math.max(s.from,e-rn),o=Math.min(r,i+rn),a=t.state.sliceDoc(n,o);if(n!=s.from){for(let l=0;l<rn;l++)if(!nn.test(a[l+1])&&nn.test(a[l])){a=a.slice(l);break}}if(o!=r){for(let l=a.length-1;l>a.length-rn;l--)if(!nn.test(a[l-1])&&nn.test(a[l])){a=a.slice(0,l);break}}return L.announce.of(`${t.state.phrase("current match")}. ${a} ${t.state.phrase("on line")} ${s.number}.`)}const Ew=L.baseTheme({".cm-panel.cm-search":{padding:"2px 6px 4px",position:"relative","& [name=close]":{position:"absolute",top:"0",right:"4px",backgroundColor:"inherit",border:"none",font:"inherit",padding:0,margin:0},"& input, & button, & label":{margin:".2em .6em .2em 0"},"& input[type=checkbox]":{marginRight:".2em"},"& label":{fontSize:"80%",whiteSpace:"pre"}},"&light .cm-searchMatch":{backgroundColor:"#ffff0054"},"&dark .cm-searchMatch":{backgroundColor:"#00ffff8a"},"&light .cm-searchMatch-selected":{backgroundColor:"#ff6a0054"},"&dark .cm-searchMatch-selected":{backgroundColor:"#ff00ff8a"}}),_w=[ci,Gi.low($w),Ew];class Ep{constructor(e,i,s,r){this.state=e,this.pos=i,this.explicit=s,this.view=r,this.abortListeners=[],this.abortOnDocChange=!1}tokenBefore(e){let i=De(this.state).resolveInner(this.pos,-1);for(;i&&e.indexOf(i.name)<0;)i=i.parent;return i?{from:i.from,to:this.pos,text:this.state.sliceDoc(i.from,this.pos),type:i.type}:null}matchBefore(e){let i=this.state.doc.lineAt(this.pos),s=Math.max(i.from,this.pos-250),r=i.text.slice(s-i.from,this.pos-i.from),n=r.search(_p(e,!1));return n<0?null:{from:s+n,to:this.pos,text:r.slice(n)}}get aborted(){return this.abortListeners==null}addEventListener(e,i,s){e=="abort"&&this.abortListeners&&(this.abortListeners.push(i),s&&s.onDocChange&&(this.abortOnDocChange=!0))}}function ed(t){let e=Object.keys(t).join(""),i=/\w/.test(e);return i&&(e=e.replace(/\w/g,"")),`[${i?"\\w":""}${e.replace(/[^\w\s]/g,"\\$&")}]`}function Dw(t){let e=Object.create(null),i=Object.create(null);for(let{label:r}of t){e[r[0]]=!0;for(let n=1;n<r.length;n++)i[r[n]]=!0}let s=ed(e)+ed(i)+"*$";return[new RegExp("^"+s),new RegExp(s)]}function Bw(t){let e=t.map(r=>typeof r=="string"?{label:r}:r),[i,s]=e.every(r=>/^\w+$/.test(r.label))?[/\w*$/,/\w+$/]:Dw(e);return r=>{let n=r.matchBefore(s);return n||r.explicit?{from:n?n.from:r.pos,options:e,validFor:i}:null}}class td{constructor(e,i,s,r){this.completion=e,this.source=i,this.match=s,this.score=r}}function Wi(t){return t.selection.main.from}function _p(t,e){var i;let{source:s}=t,r=e&&s[0]!="^",n=s[s.length-1]!="$";return!r&&!n?t:new RegExp(`${r?"^":""}(?:${s})${n?"$":""}`,(i=t.flags)!==null&&i!==void 0?i:t.ignoreCase?"i":"")}const Dp=ei.define();function Rw(t,e,i,s){let{main:r}=t.selection,n=i-r.from,o=s-r.from;return{...t.changeByRange(a=>{if(a!=r&&i!=s&&t.sliceDoc(a.from+n,a.from+o)!=t.sliceDoc(i,s))return{range:a};let l=t.toText(e);return{changes:{from:a.from+n,to:s==r.from?a.to:a.from+o,insert:l},range:$.cursor(a.from+n+l.length)}}),scrollIntoView:!0,userEvent:"input.complete"}}const id=new WeakMap;function Lw(t){if(!Array.isArray(t))return t;let e=id.get(t);return e||id.set(t,e=Bw(t)),e}const Xn=W.define(),yr=W.define();class Iw{constructor(e){this.pattern=e,this.chars=[],this.folded=[],this.any=[],this.precise=[],this.byWord=[],this.score=0,this.matched=[];for(let i=0;i<e.length;){let s=qe(e,i),r=Dt(s);this.chars.push(s);let n=e.slice(i,i+r),o=n.toUpperCase();this.folded.push(qe(o==n?n.toLowerCase():o,0)),i+=r}this.astral=e.length!=this.chars.length}ret(e,i){return this.score=e,this.matched=i,this}match(e){if(this.pattern.length==0)return this.ret(-100,[]);if(e.length<this.pattern.length)return null;let{chars:i,folded:s,any:r,precise:n,byWord:o}=this;if(i.length==1){let x=qe(e,0),O=Dt(x),D=O==e.length?0:-100;if(x!=i[0])if(x==s[0])D+=-200;else return null;return this.ret(D,[0,O])}let a=e.indexOf(this.pattern);if(a==0)return this.ret(e.length==this.pattern.length?0:-100,[0,this.pattern.length]);let l=i.length,h=0;if(a<0){for(let x=0,O=Math.min(e.length,200);x<O&&h<l;){let D=qe(e,x);(D==i[h]||D==s[h])&&(r[h++]=x),x+=Dt(D)}if(h<l)return null}let c=0,d=0,u=!1,f=0,g=-1,m=-1,y=/[a-z]/.test(e),w=!0;for(let x=0,O=Math.min(e.length,200),D=0;x<O&&d<l;){let A=qe(e,x);a<0&&(c<l&&A==i[c]&&(n[c++]=x),f<l&&(A==i[f]||A==s[f]?(f==0&&(g=x),m=x+1,f++):f=0));let P,T=A<255?A>=48&&A<=57||A>=97&&A<=122?2:A>=65&&A<=90?1:0:(P=Sl(A))!=P.toLowerCase()?1:P!=P.toUpperCase()?2:0;(!x||T==1&&y||D==0&&T!=0)&&(i[d]==A||s[d]==A&&(u=!0)?o[d++]=x:o.length&&(w=!1)),D=T,x+=Dt(A)}return d==l&&o[0]==0&&w?this.result(-100+(u?-200:0),o,e):f==l&&g==0?this.ret(-200-e.length+(m==e.length?0:-100),[0,m]):a>-1?this.ret(-700-e.length,[a,a+this.pattern.length]):f==l?this.ret(-900-e.length,[g,m]):d==l?this.result(-100+(u?-200:0)+-700+(w?0:-1100),o,e):i.length==2?null:this.result((r[0]?-700:0)+-200+-1100,r,e)}result(e,i,s){let r=[],n=0;for(let o of i){let a=o+(this.astral?Dt(qe(s,o)):1);n&&r[n-1]==o?r[n-1]=a:(r[n++]=o,r[n++]=a)}return this.ret(e-s.length,r)}}class Fw{constructor(e){this.pattern=e,this.matched=[],this.score=0,this.folded=e.toLowerCase()}match(e){if(e.length<this.pattern.length)return null;let i=e.slice(0,this.pattern.length),s=i==this.pattern?0:i.toLowerCase()==this.folded?-200:null;return s==null?null:(this.matched=[0,i.length],this.score=s+(e.length==this.pattern.length?0:-100),this)}}const Ce=R.define({combine(t){return zt(t,{activateOnTyping:!0,activateOnCompletion:()=>!1,activateOnTypingDelay:100,selectOnOpen:!0,override:null,closeOnBlur:!0,maxRenderedOptions:100,defaultKeymap:!0,tooltipClass:()=>"",optionClass:()=>"",aboveCursor:!1,icons:!0,addToOptions:[],positionInfo:Nw,filterStrict:!1,compareCompletions:(e,i)=>(e.sortText||e.label).localeCompare(i.sortText||i.label),interactionDelay:75,updateSyncTime:100},{defaultKeymap:(e,i)=>e&&i,closeOnBlur:(e,i)=>e&&i,icons:(e,i)=>e&&i,tooltipClass:(e,i)=>s=>sd(e(s),i(s)),optionClass:(e,i)=>s=>sd(e(s),i(s)),addToOptions:(e,i)=>e.concat(i),filterStrict:(e,i)=>e||i})}});function sd(t,e){return t?e?t+" "+e:t:e}function Nw(t,e,i,s,r,n){let o=t.textDirection==ae.RTL,a=o,l=!1,h="top",c,d,u=e.left-r.left,f=r.right-e.right,g=s.right-s.left,m=s.bottom-s.top;if(a&&u<Math.min(g,f)?a=!1:!a&&f<Math.min(g,u)&&(a=!0),g<=(a?u:f))c=Math.max(r.top,Math.min(i.top,r.bottom-m))-e.top,d=Math.min(400,a?u:f);else{l=!0,d=Math.min(400,(o?e.right:r.right-e.left)-30);let x=r.bottom-e.bottom;x>=m||x>e.top?c=i.bottom-e.top:(h="bottom",c=e.bottom-i.top)}let y=(e.bottom-e.top)/n.offsetHeight,w=(e.right-e.left)/n.offsetWidth;return{style:`${h}: ${c/y}px; max-width: ${d/w}px`,class:"cm-completionInfo-"+(l?o?"left-narrow":"right-narrow":a?"left":"right")}}const sh=W.define();function Uw(t){let e=t.addToOptions.slice();return t.icons&&e.push({render(i){let s=document.createElement("div");return s.classList.add("cm-completionIcon"),i.type&&s.classList.add(...i.type.split(/\s+/g).map(r=>"cm-completionIcon-"+r)),s.setAttribute("aria-hidden","true"),s},position:20}),e.push({render(i,s,r,n){let o=document.createElement("span");o.className="cm-completionLabel";let a=i.displayLabel||i.label,l=0;for(let h=0;h<n.length;){let c=n[h++],d=n[h++];c>l&&o.appendChild(document.createTextNode(a.slice(l,c)));let u=o.appendChild(document.createElement("span"));u.appendChild(document.createTextNode(a.slice(c,d))),u.className="cm-completionMatchedText",l=d}return l<a.length&&o.appendChild(document.createTextNode(a.slice(l))),o},position:50},{render(i){if(!i.detail)return null;let s=document.createElement("span");return s.className="cm-completionDetail",s.textContent=i.detail,s},position:80}),e.sort((i,s)=>i.position-s.position).map(i=>i.render)}function sa(t,e,i){if(t<=i)return{from:0,to:t};if(e<0&&(e=0),e<=t>>1){let r=Math.floor(e/i);return{from:r*i,to:(r+1)*i}}let s=Math.floor((t-e)/i);return{from:t-(s+1)*i,to:t-s*i}}class Hw{constructor(e,i,s){this.view=e,this.stateField=i,this.applyCompletion=s,this.info=null,this.infoDestroy=null,this.placeInfoReq={read:()=>this.measureInfo(),write:l=>this.placeInfo(l),key:this},this.space=null,this.currentClass="";let r=e.state.field(i),{options:n,selected:o}=r.open,a=e.state.facet(Ce);this.optionContent=Uw(a),this.optionClass=a.optionClass,this.tooltipClass=a.tooltipClass,this.range=sa(n.length,o,a.maxRenderedOptions),this.dom=document.createElement("div"),this.dom.className="cm-tooltip-autocomplete",this.updateTooltipClass(e.state),this.dom.addEventListener("mousedown",l=>{let{options:h}=e.state.field(i).open;for(let c=l.target,d;c&&c!=this.dom;c=c.parentNode)if(c.nodeName=="LI"&&(d=/-(\d+)$/.exec(c.id))&&+d[1]<h.length){this.applyCompletion(e,h[+d[1]]),l.preventDefault();return}if(l.target==this.list){let c=this.list.classList.contains("cm-completionListIncompleteTop")&&l.clientY<this.list.firstChild.getBoundingClientRect().top?this.range.from-1:this.list.classList.contains("cm-completionListIncompleteBottom")&&l.clientY>this.list.lastChild.getBoundingClientRect().bottom?this.range.to:null;c!=null&&(e.dispatch({effects:sh.of(c)}),l.preventDefault())}}),this.dom.addEventListener("focusout",l=>{let h=e.state.field(this.stateField,!1);h&&h.tooltip&&e.state.facet(Ce).closeOnBlur&&l.relatedTarget!=e.contentDOM&&e.dispatch({effects:yr.of(null)})}),this.showOptions(n,r.id)}mount(){this.updateSel()}showOptions(e,i){this.list&&this.list.remove(),this.list=this.dom.appendChild(this.createListBox(e,i,this.range)),this.list.addEventListener("scroll",()=>{this.info&&this.view.requestMeasure(this.placeInfoReq)})}update(e){var i;let s=e.state.field(this.stateField),r=e.startState.field(this.stateField);if(this.updateTooltipClass(e.state),s!=r){let{options:n,selected:o,disabled:a}=s.open;(!r.open||r.open.options!=n)&&(this.range=sa(n.length,o,e.state.facet(Ce).maxRenderedOptions),this.showOptions(n,s.id)),this.updateSel(),a!=((i=r.open)===null||i===void 0?void 0:i.disabled)&&this.dom.classList.toggle("cm-tooltip-autocomplete-disabled",!!a)}}updateTooltipClass(e){let i=this.tooltipClass(e);if(i!=this.currentClass){for(let s of this.currentClass.split(" "))s&&this.dom.classList.remove(s);for(let s of i.split(" "))s&&this.dom.classList.add(s);this.currentClass=i}}positioned(e){this.space=e,this.info&&this.view.requestMeasure(this.placeInfoReq)}updateSel(){let e=this.view.state.field(this.stateField),i=e.open;(i.selected>-1&&i.selected<this.range.from||i.selected>=this.range.to)&&(this.range=sa(i.options.length,i.selected,this.view.state.facet(Ce).maxRenderedOptions),this.showOptions(i.options,e.id));let s=this.updateSelectedOption(i.selected);if(s){this.destroyInfo();let{completion:r}=i.options[i.selected],{info:n}=r;if(!n)return;let o=typeof n=="string"?document.createTextNode(n):n(r);if(!o)return;"then"in o?o.then(a=>{a&&this.view.state.field(this.stateField,!1)==e&&this.addInfoPane(a,r)}).catch(a=>Qe(this.view.state,a,"completion info")):(this.addInfoPane(o,r),s.setAttribute("aria-describedby",this.info.id))}}addInfoPane(e,i){this.destroyInfo();let s=this.info=document.createElement("div");if(s.className="cm-tooltip cm-completionInfo",s.id="cm-completionInfo-"+Math.floor(Math.random()*65535).toString(16),e.nodeType!=null)s.appendChild(e),this.infoDestroy=null;else{let{dom:r,destroy:n}=e;s.appendChild(r),this.infoDestroy=n||null}this.dom.appendChild(s),this.view.requestMeasure(this.placeInfoReq)}updateSelectedOption(e){let i=null;for(let s=this.list.firstChild,r=this.range.from;s;s=s.nextSibling,r++)s.nodeName!="LI"||!s.id?r--:r==e?s.hasAttribute("aria-selected")||(s.setAttribute("aria-selected","true"),i=s):s.hasAttribute("aria-selected")&&(s.removeAttribute("aria-selected"),s.removeAttribute("aria-describedby"));return i&&zw(this.list,i),i}measureInfo(){let e=this.dom.querySelector("[aria-selected]");if(!e||!this.info)return null;let i=this.dom.getBoundingClientRect(),s=this.info.getBoundingClientRect(),r=e.getBoundingClientRect(),n=this.space;if(!n){let o=this.dom.ownerDocument.documentElement;n={left:0,top:0,right:o.clientWidth,bottom:o.clientHeight}}return r.top>Math.min(n.bottom,i.bottom)-10||r.bottom<Math.max(n.top,i.top)+10?null:this.view.state.facet(Ce).positionInfo(this.view,i,r,s,n,this.dom)}placeInfo(e){this.info&&(e?(e.style&&(this.info.style.cssText=e.style),this.info.className="cm-tooltip cm-completionInfo "+(e.class||"")):this.info.style.cssText="top: -1e6px")}createListBox(e,i,s){const r=document.createElement("ul");r.id=i,r.setAttribute("role","listbox"),r.setAttribute("aria-expanded","true"),r.setAttribute("aria-label",this.view.state.phrase("Completions")),r.addEventListener("mousedown",o=>{o.target==r&&o.preventDefault()});let n=null;for(let o=s.from;o<s.to;o++){let{completion:a,match:l}=e[o],{section:h}=a;if(h){let u=typeof h=="string"?h:h.name;if(u!=n&&(o>s.from||s.from==0))if(n=u,typeof h!="string"&&h.header)r.appendChild(h.header(h));else{let f=r.appendChild(document.createElement("completion-section"));f.textContent=u}}const c=r.appendChild(document.createElement("li"));c.id=i+"-"+o,c.setAttribute("role","option");let d=this.optionClass(a);d&&(c.className=d);for(let u of this.optionContent){let f=u(a,this.view.state,this.view,l);f&&c.appendChild(f)}}return s.from&&r.classList.add("cm-completionListIncompleteTop"),s.to<e.length&&r.classList.add("cm-completionListIncompleteBottom"),r}destroyInfo(){this.info&&(this.infoDestroy&&this.infoDestroy(),this.info.remove(),this.info=null)}destroy(){this.destroyInfo()}}function Ww(t,e){return i=>new Hw(i,t,e)}function zw(t,e){let i=t.getBoundingClientRect(),s=e.getBoundingClientRect(),r=i.height/t.offsetHeight;s.top<i.top?t.scrollTop-=(i.top-s.top)/r:s.bottom>i.bottom&&(t.scrollTop+=(s.bottom-i.bottom)/r)}function rd(t){return(t.boost||0)*100+(t.apply?10:0)+(t.info?5:0)+(t.type?1:0)}function qw(t,e){let i=[],s=null,r=null,n=c=>{i.push(c);let{section:d}=c.completion;if(d){s||(s=[]);let u=typeof d=="string"?d:d.name;s.some(f=>f.name==u)||s.push(typeof d=="string"?{name:u}:d)}},o=e.facet(Ce);for(let c of t)if(c.hasResult()){let d=c.result.getMatch;if(c.result.filter===!1)for(let u of c.result.options)n(new td(u,c.source,d?d(u):[],1e9-i.length));else{let u=e.sliceDoc(c.from,c.to),f,g=o.filterStrict?new Fw(u):new Iw(u);for(let m of c.result.options)if(f=g.match(m.label)){let y=m.displayLabel?d?d(m,f.matched):[]:f.matched,w=f.score+(m.boost||0);if(n(new td(m,c.source,y,w)),typeof m.section=="object"&&m.section.rank==="dynamic"){let{name:x}=m.section;r||(r=Object.create(null)),r[x]=Math.max(w,r[x]||-1e9)}}}}if(s){let c=Object.create(null),d=0,u=(f,g)=>(f.rank==="dynamic"&&g.rank==="dynamic"?r[g.name]-r[f.name]:0)||(typeof f.rank=="number"?f.rank:1e9)-(typeof g.rank=="number"?g.rank:1e9)||(f.name<g.name?-1:1);for(let f of s.sort(u))d-=1e5,c[f.name]=d;for(let f of i){let{section:g}=f.completion;g&&(f.score+=c[typeof g=="string"?g:g.name])}}let a=[],l=null,h=o.compareCompletions;for(let c of i.sort((d,u)=>u.score-d.score||h(d.completion,u.completion))){let d=c.completion;!l||l.label!=d.label||l.detail!=d.detail||l.type!=null&&d.type!=null&&l.type!=d.type||l.apply!=d.apply||l.boost!=d.boost?a.push(c):rd(c.completion)>rd(l)&&(a[a.length-1]=c),l=c.completion}return a}class hs{constructor(e,i,s,r,n,o){this.options=e,this.attrs=i,this.tooltip=s,this.timestamp=r,this.selected=n,this.disabled=o}setSelected(e,i){return e==this.selected||e>=this.options.length?this:new hs(this.options,nd(i,e),this.tooltip,this.timestamp,e,this.disabled)}static build(e,i,s,r,n,o){if(r&&!o&&e.some(h=>h.isPending))return r.setDisabled();let a=qw(e,i);if(!a.length)return r&&e.some(h=>h.isPending)?r.setDisabled():null;let l=i.facet(Ce).selectOnOpen?0:-1;if(r&&r.selected!=l&&r.selected!=-1){let h=r.options[r.selected].completion;for(let c=0;c<a.length;c++)if(a[c].completion==h){l=c;break}}return new hs(a,nd(s,l),{pos:e.reduce((h,c)=>c.hasResult()?Math.min(h,c.from):h,1e8),create:Jw,above:n.aboveCursor},r?r.timestamp:Date.now(),l,!1)}map(e){return new hs(this.options,this.attrs,{...this.tooltip,pos:e.mapPos(this.tooltip.pos)},this.timestamp,this.selected,this.disabled)}setDisabled(){return new hs(this.options,this.attrs,this.tooltip,this.timestamp,this.selected,!0)}}class Jn{constructor(e,i,s){this.active=e,this.id=i,this.open=s}static start(){return new Jn(Kw,"cm-ac-"+Math.floor(Math.random()*2e6).toString(36),null)}update(e){let{state:i}=e,s=i.facet(Ce),n=(s.override||i.languageDataAt("autocomplete",Wi(i)).map(Lw)).map(l=>(this.active.find(c=>c.source==l)||new ut(l,this.active.some(c=>c.state!=0)?1:0)).update(e,s));n.length==this.active.length&&n.every((l,h)=>l==this.active[h])&&(n=this.active);let o=this.open,a=e.effects.some(l=>l.is(rh));o&&e.docChanged&&(o=o.map(e.changes)),e.selection||n.some(l=>l.hasResult()&&e.changes.touchesRange(l.from,l.to))||!Vw(n,this.active)||a?o=hs.build(n,i,this.id,o,s,a):o&&o.disabled&&!n.some(l=>l.isPending)&&(o=null),!o&&n.every(l=>!l.isPending)&&n.some(l=>l.hasResult())&&(n=n.map(l=>l.hasResult()?new ut(l.source,0):l));for(let l of e.effects)l.is(sh)&&(o=o&&o.setSelected(l.value,this.id));return n==this.active&&o==this.open?this:new Jn(n,this.id,o)}get tooltip(){return this.open?this.open.tooltip:null}get attrs(){return this.open?this.open.attrs:this.active.length?jw:Qw}}function Vw(t,e){if(t==e)return!0;for(let i=0,s=0;;){for(;i<t.length&&!t[i].hasResult();)i++;for(;s<e.length&&!e[s].hasResult();)s++;let r=i==t.length,n=s==e.length;if(r||n)return r==n;if(t[i++].result!=e[s++].result)return!1}}const jw={"aria-autocomplete":"list"},Qw={};function nd(t,e){let i={"aria-autocomplete":"list","aria-haspopup":"listbox","aria-controls":t};return e>-1&&(i["aria-activedescendant"]=t+"-"+e),i}const Kw=[];function Bp(t,e){if(t.isUserEvent("input.complete")){let s=t.annotation(Dp);if(s&&e.activateOnCompletion(s))return 12}let i=t.isUserEvent("input.type");return i&&e.activateOnTyping?5:i?1:t.isUserEvent("delete.backward")?2:t.selection?8:t.docChanged?16:0}class ut{constructor(e,i,s=!1){this.source=e,this.state=i,this.explicit=s}hasResult(){return!1}get isPending(){return this.state==1}update(e,i){let s=Bp(e,i),r=this;(s&8||s&16&&this.touches(e))&&(r=new ut(r.source,0)),s&4&&r.state==0&&(r=new ut(this.source,1)),r=r.updateFor(e,s);for(let n of e.effects)if(n.is(Xn))r=new ut(r.source,1,n.value);else if(n.is(yr))r=new ut(r.source,0);else if(n.is(rh))for(let o of n.value)o.source==r.source&&(r=o);return r}updateFor(e,i){return this.map(e.changes)}map(e){return this}touches(e){return e.changes.touchesRange(Wi(e.state))}}class vs extends ut{constructor(e,i,s,r,n,o){super(e,3,i),this.limit=s,this.result=r,this.from=n,this.to=o}hasResult(){return!0}updateFor(e,i){var s;if(!(i&3))return this.map(e.changes);let r=this.result;r.map&&!e.changes.empty&&(r=r.map(r,e.changes));let n=e.changes.mapPos(this.from),o=e.changes.mapPos(this.to,1),a=Wi(e.state);if(a>o||!r||i&2&&(Wi(e.startState)==this.from||a<this.limit))return new ut(this.source,i&4?1:0);let l=e.changes.mapPos(this.limit);return Xw(r.validFor,e.state,n,o)?new vs(this.source,this.explicit,l,r,n,o):r.update&&(r=r.update(r,n,o,new Ep(e.state,a,!1)))?new vs(this.source,this.explicit,l,r,r.from,(s=r.to)!==null&&s!==void 0?s:Wi(e.state)):new ut(this.source,1,this.explicit)}map(e){return e.empty?this:(this.result.map?this.result.map(this.result,e):this.result)?new vs(this.source,this.explicit,e.mapPos(this.limit),this.result,e.mapPos(this.from),e.mapPos(this.to,1)):new ut(this.source,0)}touches(e){return e.changes.touchesRange(this.from,this.to)}}function Xw(t,e,i,s){if(!t)return!1;let r=e.sliceDoc(i,s);return typeof t=="function"?t(r,i,s,e):_p(t,!0).test(r)}const rh=W.define({map(t,e){return t.map(i=>i.map(e))}}),Ve=Be.define({create(){return Jn.start()},update(t,e){return t.update(e)},provide:t=>[Hl.from(t,e=>e.tooltip),L.contentAttributes.from(t,e=>e.attrs)]});function nh(t,e){const i=e.completion.apply||e.completion.label;let s=t.state.field(Ve).active.find(r=>r.source==e.source);return s instanceof vs?(typeof i=="string"?t.dispatch({...Rw(t.state,i,s.from,s.to),annotations:Dp.of(e.completion)}):i(t,e.completion,s.from,s.to),!0):!1}const Jw=Ww(Ve,nh);function on(t,e="option"){return i=>{let s=i.state.field(Ve,!1);if(!s||!s.open||s.open.disabled||Date.now()-s.open.timestamp<i.state.facet(Ce).interactionDelay)return!1;let r=1,n;e=="page"&&(n=pf(i,s.open.tooltip))&&(r=Math.max(2,Math.floor(n.dom.offsetHeight/n.dom.querySelector("li").offsetHeight)-1));let{length:o}=s.open.options,a=s.open.selected>-1?s.open.selected+r*(t?1:-1):t?0:o-1;return a<0?a=e=="page"?0:o-1:a>=o&&(a=e=="page"?o-1:0),i.dispatch({effects:sh.of(a)}),!0}}const Yw=t=>{let e=t.state.field(Ve,!1);return t.state.readOnly||!e||!e.open||e.open.selected<0||e.open.disabled||Date.now()-e.open.timestamp<t.state.facet(Ce).interactionDelay?!1:nh(t,e.open.options[e.open.selected])},ra=t=>t.state.field(Ve,!1)?(t.dispatch({effects:Xn.of(!0)}),!0):!1,Gw=t=>{let e=t.state.field(Ve,!1);return!e||!e.active.some(i=>i.state!=0)?!1:(t.dispatch({effects:yr.of(null)}),!0)};class Zw{constructor(e,i){this.active=e,this.context=i,this.time=Date.now(),this.updates=[],this.done=void 0}}const e1=50,t1=1e3,i1=ye.fromClass(class{constructor(t){this.view=t,this.debounceUpdate=-1,this.running=[],this.debounceAccept=-1,this.pendingStart=!1,this.composing=0;for(let e of t.state.field(Ve).active)e.isPending&&this.startQuery(e)}update(t){let e=t.state.field(Ve),i=t.state.facet(Ce);if(!t.selectionSet&&!t.docChanged&&t.startState.field(Ve)==e)return;let s=t.transactions.some(n=>{let o=Bp(n,i);return o&8||(n.selection||n.docChanged)&&!(o&3)});for(let n=0;n<this.running.length;n++){let o=this.running[n];if(s||o.context.abortOnDocChange&&t.docChanged||o.updates.length+t.transactions.length>e1&&Date.now()-o.time>t1){for(let a of o.context.abortListeners)try{a()}catch(l){Qe(this.view.state,l)}o.context.abortListeners=null,this.running.splice(n--,1)}else o.updates.push(...t.transactions)}this.debounceUpdate>-1&&clearTimeout(this.debounceUpdate),t.transactions.some(n=>n.effects.some(o=>o.is(Xn)))&&(this.pendingStart=!0);let r=this.pendingStart?50:i.activateOnTypingDelay;if(this.debounceUpdate=e.active.some(n=>n.isPending&&!this.running.some(o=>o.active.source==n.source))?setTimeout(()=>this.startUpdate(),r):-1,this.composing!=0)for(let n of t.transactions)n.isUserEvent("input.type")?this.composing=2:this.composing==2&&n.selection&&(this.composing=3)}startUpdate(){this.debounceUpdate=-1,this.pendingStart=!1;let{state:t}=this.view,e=t.field(Ve);for(let i of e.active)i.isPending&&!this.running.some(s=>s.active.source==i.source)&&this.startQuery(i);this.running.length&&e.open&&e.open.disabled&&(this.debounceAccept=setTimeout(()=>this.accept(),this.view.state.facet(Ce).updateSyncTime))}startQuery(t){let{state:e}=this.view,i=Wi(e),s=new Ep(e,i,t.explicit,this.view),r=new Zw(t,s);this.running.push(r),Promise.resolve(t.source(s)).then(n=>{r.context.aborted||(r.done=n||null,this.scheduleAccept())},n=>{this.view.dispatch({effects:yr.of(null)}),Qe(this.view.state,n)})}scheduleAccept(){this.running.every(t=>t.done!==void 0)?this.accept():this.debounceAccept<0&&(this.debounceAccept=setTimeout(()=>this.accept(),this.view.state.facet(Ce).updateSyncTime))}accept(){var t;this.debounceAccept>-1&&clearTimeout(this.debounceAccept),this.debounceAccept=-1;let e=[],i=this.view.state.facet(Ce),s=this.view.state.field(Ve);for(let r=0;r<this.running.length;r++){let n=this.running[r];if(n.done===void 0)continue;if(this.running.splice(r--,1),n.done){let a=Wi(n.updates.length?n.updates[0].startState:this.view.state),l=Math.min(a,n.done.from+(n.active.explicit?0:1)),h=new vs(n.active.source,n.active.explicit,l,n.done,n.done.from,(t=n.done.to)!==null&&t!==void 0?t:a);for(let c of n.updates)h=h.update(c,i);if(h.hasResult()){e.push(h);continue}}let o=s.active.find(a=>a.source==n.active.source);if(o&&o.isPending)if(n.done==null){let a=new ut(n.active.source,0);for(let l of n.updates)a=a.update(l,i);a.isPending||e.push(a)}else this.startQuery(o)}(e.length||s.open&&s.open.disabled)&&this.view.dispatch({effects:rh.of(e)})}},{eventHandlers:{blur(t){let e=this.view.state.field(Ve,!1);if(e&&e.tooltip&&this.view.state.facet(Ce).closeOnBlur){let i=e.open&&pf(this.view,e.open.tooltip);(!i||!i.dom.contains(t.relatedTarget))&&setTimeout(()=>this.view.dispatch({effects:yr.of(null)}),10)}},compositionstart(){this.composing=1},compositionend(){this.composing==3&&setTimeout(()=>this.view.dispatch({effects:Xn.of(!1)}),20),this.composing=0}}}),s1=typeof navigator=="object"&&/Win/.test(navigator.platform),r1=Gi.highest(L.domEventHandlers({keydown(t,e){let i=e.state.field(Ve,!1);if(!i||!i.open||i.open.disabled||i.open.selected<0||t.key.length>1||t.ctrlKey&&!(s1&&t.altKey)||t.metaKey)return!1;let s=i.open.options[i.open.selected],r=i.active.find(o=>o.source==s.source),n=s.completion.commitCharacters||r.result.commitCharacters;return n&&n.indexOf(t.key)>-1&&nh(e,s),!1}})),n1=L.baseTheme({".cm-tooltip.cm-tooltip-autocomplete":{"& > ul":{fontFamily:"monospace",whiteSpace:"nowrap",overflow:"hidden auto",maxWidth_fallback:"700px",maxWidth:"min(700px, 95vw)",minWidth:"250px",maxHeight:"10em",height:"100%",listStyle:"none",margin:0,padding:0,"& > li, & > completion-section":{padding:"1px 3px",lineHeight:1.2},"& > li":{overflowX:"hidden",textOverflow:"ellipsis",cursor:"pointer"},"& > completion-section":{display:"list-item",borderBottom:"1px solid silver",paddingLeft:"0.5em",opacity:.7}}},"&light .cm-tooltip-autocomplete ul li[aria-selected]":{background:"#17c",color:"white"},"&light .cm-tooltip-autocomplete-disabled ul li[aria-selected]":{background:"#777"},"&dark .cm-tooltip-autocomplete ul li[aria-selected]":{background:"#347",color:"white"},"&dark .cm-tooltip-autocomplete-disabled ul li[aria-selected]":{background:"#444"},".cm-completionListIncompleteTop:before, .cm-completionListIncompleteBottom:after":{content:'"···"',opacity:.5,display:"block",textAlign:"center"},".cm-tooltip.cm-completionInfo":{position:"absolute",padding:"3px 9px",width:"max-content",maxWidth:"400px",boxSizing:"border-box",whiteSpace:"pre-line"},".cm-completionInfo.cm-completionInfo-left":{right:"100%"},".cm-completionInfo.cm-completionInfo-right":{left:"100%"},".cm-completionInfo.cm-completionInfo-left-narrow":{right:"30px"},".cm-completionInfo.cm-completionInfo-right-narrow":{left:"30px"},"&light .cm-snippetField":{backgroundColor:"#00000022"},"&dark .cm-snippetField":{backgroundColor:"#ffffff22"},".cm-snippetFieldPosition":{verticalAlign:"text-top",width:0,height:"1.15em",display:"inline-block",margin:"0 -0.7px -.7em",borderLeft:"1.4px dotted #888"},".cm-completionMatchedText":{textDecoration:"underline"},".cm-completionDetail":{marginLeft:"0.5em",fontStyle:"italic"},".cm-completionIcon":{fontSize:"90%",width:".8em",display:"inline-block",textAlign:"center",paddingRight:".6em",opacity:"0.6",boxSizing:"content-box"},".cm-completionIcon-function, .cm-completionIcon-method":{"&:after":{content:"'ƒ'"}},".cm-completionIcon-class":{"&:after":{content:"'○'"}},".cm-completionIcon-interface":{"&:after":{content:"'◌'"}},".cm-completionIcon-variable":{"&:after":{content:"'𝑥'"}},".cm-completionIcon-constant":{"&:after":{content:"'𝐶'"}},".cm-completionIcon-type":{"&:after":{content:"'𝑡'"}},".cm-completionIcon-enum":{"&:after":{content:"'∪'"}},".cm-completionIcon-property":{"&:after":{content:"'□'"}},".cm-completionIcon-keyword":{"&:after":{content:"'🔑︎'"}},".cm-completionIcon-namespace":{"&:after":{content:"'▢'"}},".cm-completionIcon-text":{"&:after":{content:"'abc'",fontSize:"50%",verticalAlign:"middle"}}}),xr={brackets:["(","[","{","'",'"'],before:")]}:;>",stringPrefixes:[]},Li=W.define({map(t,e){let i=e.mapPos(t,-1,Fe.TrackAfter);return i??void 0}}),oh=new class extends fi{};oh.startSide=1;oh.endSide=-1;const Rp=Be.define({create(){return Q.empty},update(t,e){if(t=t.map(e.changes),e.selection){let i=e.state.doc.lineAt(e.selection.main.head);t=t.update({filter:s=>s>=i.from&&s<=i.to})}for(let i of e.effects)i.is(Li)&&(t=t.update({add:[oh.range(i.value,i.value+1)]}));return t}});function o1(){return[l1,Rp]}const na="()[]{}<>«»»«［］｛｝";function Lp(t){for(let e=0;e<na.length;e+=2)if(na.charCodeAt(e)==t)return na.charAt(e+1);return Sl(t<128?t:t+1)}function Ip(t,e){return t.languageDataAt("closeBrackets",e)[0]||xr}const a1=typeof navigator=="object"&&/Android\b/.test(navigator.userAgent),l1=L.inputHandler.of((t,e,i,s)=>{if((a1?t.composing:t.compositionStarted)||t.state.readOnly)return!1;let r=t.state.selection.main;if(s.length>2||s.length==2&&Dt(qe(s,0))==1||e!=r.from||i!=r.to)return!1;let n=d1(t.state,s);return n?(t.dispatch(n),!0):!1}),h1=({state:t,dispatch:e})=>{if(t.readOnly)return!1;let s=Ip(t,t.selection.main.head).brackets||xr.brackets,r=null,n=t.changeByRange(o=>{if(o.empty){let a=u1(t.doc,o.head);for(let l of s)if(l==a&&xo(t.doc,o.head)==Lp(qe(l,0)))return{changes:{from:o.head-l.length,to:o.head+l.length},range:$.cursor(o.head-l.length)}}return{range:r=o}});return r||e(t.update(n,{scrollIntoView:!0,userEvent:"delete.backward"})),!r},c1=[{key:"Backspace",run:h1}];function d1(t,e){let i=Ip(t,t.selection.main.head),s=i.brackets||xr.brackets;for(let r of s){let n=Lp(qe(r,0));if(e==r)return n==r?g1(t,r,s.indexOf(r+r+r)>-1,i):f1(t,r,n,i.before||xr.before);if(e==n&&Fp(t,t.selection.main.from))return p1(t,r,n)}return null}function Fp(t,e){let i=!1;return t.field(Rp).between(0,t.doc.length,s=>{s==e&&(i=!0)}),i}function xo(t,e){let i=t.sliceString(e,e+2);return i.slice(0,Dt(qe(i,0)))}function u1(t,e){let i=t.sliceString(e-2,e);return Dt(qe(i,0))==i.length?i:i.slice(1)}function f1(t,e,i,s){let r=null,n=t.changeByRange(o=>{if(!o.empty)return{changes:[{insert:e,from:o.from},{insert:i,from:o.to}],effects:Li.of(o.to+e.length),range:$.range(o.anchor+e.length,o.head+e.length)};let a=xo(t.doc,o.head);return!a||/\s/.test(a)||s.indexOf(a)>-1?{changes:{insert:e+i,from:o.head},effects:Li.of(o.head+e.length),range:$.cursor(o.head+e.length)}:{range:r=o}});return r?null:t.update(n,{scrollIntoView:!0,userEvent:"input.type"})}function p1(t,e,i){let s=null,r=t.changeByRange(n=>n.empty&&xo(t.doc,n.head)==i?{changes:{from:n.head,to:n.head+i.length,insert:i},range:$.cursor(n.head+i.length)}:s={range:n});return s?null:t.update(r,{scrollIntoView:!0,userEvent:"input.type"})}function g1(t,e,i,s){let r=s.stringPrefixes||xr.stringPrefixes,n=null,o=t.changeByRange(a=>{if(!a.empty)return{changes:[{insert:e,from:a.from},{insert:e,from:a.to}],effects:Li.of(a.to+e.length),range:$.range(a.anchor+e.length,a.head+e.length)};let l=a.head,h=xo(t.doc,l),c;if(h==e){if(od(t,l))return{changes:{insert:e+e,from:l},effects:Li.of(l+e.length),range:$.cursor(l+e.length)};if(Fp(t,l)){let u=i&&t.sliceDoc(l,l+e.length*3)==e+e+e?e+e+e:e;return{changes:{from:l,to:l+u.length,insert:u},range:$.cursor(l+u.length)}}}else{if(i&&t.sliceDoc(l-2*e.length,l)==e+e&&(c=ad(t,l-2*e.length,r))>-1&&od(t,c))return{changes:{insert:e+e+e+e,from:l},effects:Li.of(l+e.length),range:$.cursor(l+e.length)};if(t.charCategorizer(l)(h)!=fe.Word&&ad(t,l,r)>-1&&!m1(t,l,e,r))return{changes:{insert:e+e,from:l},effects:Li.of(l+e.length),range:$.cursor(l+e.length)}}return{range:n=a}});return n?null:t.update(o,{scrollIntoView:!0,userEvent:"input.type"})}function od(t,e){let i=De(t).resolveInner(e+1);return i.parent&&i.from==e}function m1(t,e,i,s){let r=De(t).resolveInner(e,-1),n=s.reduce((o,a)=>Math.max(o,a.length),0);for(let o=0;o<5;o++){let a=t.sliceDoc(r.from,Math.min(r.to,r.from+i.length+n)),l=a.indexOf(i);if(!l||l>-1&&s.indexOf(a.slice(0,l))>-1){let c=r.firstChild;for(;c&&c.from==r.from&&c.to-c.from>i.length+l;){if(t.sliceDoc(c.to-i.length,c.to)==i)return!1;c=c.firstChild}return!0}let h=r.to==e&&r.parent;if(!h)break;r=h}return!1}function ad(t,e,i){let s=t.charCategorizer(e);if(s(t.sliceDoc(e-1,e))!=fe.Word)return e;for(let r of i){let n=e-r.length;if(t.sliceDoc(n,e)==r&&s(t.sliceDoc(n-1,n))!=fe.Word)return n}return-1}function b1(t={}){return[r1,Ve,Ce.of(t),i1,v1,n1]}const Np=[{key:"Ctrl-Space",run:ra},{mac:"Alt-`",run:ra},{mac:"Alt-i",run:ra},{key:"Escape",run:Gw},{key:"ArrowDown",run:on(!0)},{key:"ArrowUp",run:on(!1)},{key:"PageDown",run:on(!0,"page")},{key:"PageUp",run:on(!1,"page")},{key:"Enter",run:Yw}],v1=Gi.highest(Nl.computeN([Ce],t=>t.facet(Ce).defaultKeymap?[Np]:[]));class ld{constructor(e,i,s){this.from=e,this.to=i,this.diagnostic=s}}class Ei{constructor(e,i,s){this.diagnostics=e,this.panel=i,this.selected=s}static init(e,i,s){let r=s.facet(wr).markerFilter;r&&(e=r(e,s));let n=e.slice().sort((f,g)=>f.from-g.from||f.to-g.to),o=new Jt,a=[],l=0,h=s.doc.iter(),c=0,d=s.doc.length;for(let f=0;;){let g=f==n.length?null:n[f];if(!g&&!a.length)break;let m,y;if(a.length)m=l,y=a.reduce((O,D)=>Math.min(O,D.to),g&&g.from>m?g.from:1e8);else{if(m=g.from,m>d)break;y=g.to,a.push(g),f++}for(;f<n.length;){let O=n[f];if(O.from==m&&(O.to>O.from||O.to==m))a.push(O),f++,y=Math.min(O.to,y);else{y=Math.min(O.from,y);break}}y=Math.min(y,d);let w=!1;if(a.some(O=>O.from==m&&(O.to==y||y==d))&&(w=m==y,!w&&y-m<10)){let O=m-(c+h.value.length);O>0&&(h.next(O),c=m);for(let D=m;;){if(D>=y){w=!0;break}if(!h.lineBreak&&c+h.value.length>D)break;D=c+h.value.length,c+=h.value.length,h.next()}}let x=E1(a);if(w)o.add(m,m,U.widget({widget:new A1(x),diagnostics:a.slice()}));else{let O=a.reduce((D,A)=>A.markClass?D+" "+A.markClass:D,"");o.add(m,y,U.mark({class:"cm-lintRange cm-lintRange-"+x+O,diagnostics:a.slice(),inclusiveEnd:a.some(D=>D.to>y)}))}if(l=y,l==d)break;for(let O=0;O<a.length;O++)a[O].to<=l&&a.splice(O--,1)}let u=o.finish();return new Ei(u,i,yi(u))}}function yi(t,e=null,i=0){let s=null;return t.between(i,1e9,(r,n,{spec:o})=>{if(!(e&&o.diagnostics.indexOf(e)<0))if(!s)s=new ld(r,n,e||o.diagnostics[0]);else{if(o.diagnostics.indexOf(s.diagnostic)<0)return!1;s=new ld(s.from,n,s.diagnostic)}}),s}function y1(t,e){let i=e.pos,s=e.end||i,r=t.state.facet(wr).hideOn(t,i,s);if(r!=null)return r;let n=t.startState.doc.lineAt(e.pos);return!!(t.effects.some(o=>o.is(Up))||t.changes.touchesRange(n.from,Math.max(n.to,s)))}function x1(t,e){return t.field(it,!1)?e:e.concat(W.appendConfig.of(_1))}const Up=W.define(),ah=W.define(),Hp=W.define(),it=Be.define({create(){return new Ei(U.none,null,null)},update(t,e){if(e.docChanged&&t.diagnostics.size){let i=t.diagnostics.map(e.changes),s=null,r=t.panel;if(t.selected){let n=e.changes.mapPos(t.selected.from,1);s=yi(i,t.selected.diagnostic,n)||yi(i,null,n)}!i.size&&r&&e.state.facet(wr).autoPanel&&(r=null),t=new Ei(i,r,s)}for(let i of e.effects)if(i.is(Up)){let s=e.state.facet(wr).autoPanel?i.value.length?kr.open:null:t.panel;t=Ei.init(i.value,s,e.state)}else i.is(ah)?t=new Ei(t.diagnostics,i.value?kr.open:null,t.selected):i.is(Hp)&&(t=new Ei(t.diagnostics,t.panel,i.value));return t},provide:t=>[pr.from(t,e=>e.panel),L.decorations.from(t,e=>e.diagnostics)]}),w1=U.mark({class:"cm-lintRange cm-lintRange-active"});function k1(t,e,i){let{diagnostics:s}=t.state.field(it),r,n=-1,o=-1;s.between(e-(i<0?1:0),e+(i>0?1:0),(l,h,{spec:c})=>{if(e>=l&&e<=h&&(l==h||(e>l||i>0)&&(e<h||i<0)))return r=c.diagnostics,n=l,o=h,!1});let a=t.state.facet(wr).tooltipFilter;return r&&a&&(r=a(r,t.state)),r?{pos:n,end:o,above:t.state.doc.lineAt(n).to<o,create(){return{dom:S1(t,r)}}}:null}function S1(t,e){return se("ul",{class:"cm-tooltip-lint"},e.map(i=>zp(t,i,!1)))}const C1=t=>{let e=t.state.field(it,!1);(!e||!e.panel)&&t.dispatch({effects:x1(t.state,[ah.of(!0)])});let i=Wl(t,kr.open);return i&&i.dom.querySelector(".cm-panel-lint ul").focus(),!0},hd=t=>{let e=t.state.field(it,!1);return!e||!e.panel?!1:(t.dispatch({effects:ah.of(!1)}),!0)},$1=t=>{let e=t.state.field(it,!1);if(!e)return!1;let i=t.state.selection.main,s=yi(e.diagnostics,null,i.to+1);return!s&&(s=yi(e.diagnostics,null,0),!s||s.from==i.from&&s.to==i.to)?!1:(t.dispatch({selection:{anchor:s.from,head:s.to},scrollIntoView:!0}),!0)},O1=[{key:"Mod-Shift-m",run:C1,preventDefault:!0},{key:"F8",run:$1}],wr=R.define({combine(t){return{sources:t.map(e=>e.source).filter(e=>e!=null),...zt(t.map(e=>e.config),{delay:750,markerFilter:null,tooltipFilter:null,needsRefresh:null,hideOn:()=>null},{delay:Math.max,markerFilter:cd,tooltipFilter:cd,needsRefresh:(e,i)=>e?i?s=>e(s)||i(s):e:i,hideOn:(e,i)=>e?i?(s,r,n)=>e(s,r,n)||i(s,r,n):e:i,autoPanel:(e,i)=>e||i})}}});function cd(t,e){return t?e?(i,s)=>e(t(i,s),s):t:e}function Wp(t){let e=[];if(t)e:for(let{name:i}of t){for(let s=0;s<i.length;s++){let r=i[s];if(/[a-zA-Z]/.test(r)&&!e.some(n=>n.toLowerCase()==r.toLowerCase())){e.push(r);continue e}}e.push("")}return e}function zp(t,e,i){var s;let r=i?Wp(e.actions):[];return se("li",{class:"cm-diagnostic cm-diagnostic-"+e.severity},se("span",{class:"cm-diagnosticText"},e.renderMessage?e.renderMessage(t):e.message),(s=e.actions)===null||s===void 0?void 0:s.map((n,o)=>{let a=!1,l=f=>{if(f.preventDefault(),a)return;a=!0;let g=yi(t.state.field(it).diagnostics,e);g&&n.apply(t,g.from,g.to)},{name:h}=n,c=r[o]?h.indexOf(r[o]):-1,d=c<0?h:[h.slice(0,c),se("u",h.slice(c,c+1)),h.slice(c+1)],u=n.markClass?" "+n.markClass:"";return se("button",{type:"button",class:"cm-diagnosticAction"+u,onclick:l,onmousedown:l,"aria-label":` Action: ${h}${c<0?"":` (access key "${r[o]})"`}.`},d)}),e.source&&se("div",{class:"cm-diagnosticSource"},e.source))}class A1 extends ti{constructor(e){super(),this.sev=e}eq(e){return e.sev==this.sev}toDOM(){return se("span",{class:"cm-lintPoint cm-lintPoint-"+this.sev})}}class dd{constructor(e,i){this.diagnostic=i,this.id="item_"+Math.floor(Math.random()*4294967295).toString(16),this.dom=zp(e,i,!0),this.dom.id=this.id,this.dom.setAttribute("role","option")}}class kr{constructor(e){this.view=e,this.items=[];let i=r=>{if(!(r.ctrlKey||r.altKey||r.metaKey)){if(r.keyCode==27)hd(this.view),this.view.focus();else if(r.keyCode==38||r.keyCode==33)this.moveSelection((this.selectedIndex-1+this.items.length)%this.items.length);else if(r.keyCode==40||r.keyCode==34)this.moveSelection((this.selectedIndex+1)%this.items.length);else if(r.keyCode==36)this.moveSelection(0);else if(r.keyCode==35)this.moveSelection(this.items.length-1);else if(r.keyCode==13)this.view.focus();else if(r.keyCode>=65&&r.keyCode<=90&&this.selectedIndex>=0){let{diagnostic:n}=this.items[this.selectedIndex],o=Wp(n.actions);for(let a=0;a<o.length;a++)if(o[a].toUpperCase().charCodeAt(0)==r.keyCode){let l=yi(this.view.state.field(it).diagnostics,n);l&&n.actions[a].apply(e,l.from,l.to)}}else return;r.preventDefault()}},s=r=>{for(let n=0;n<this.items.length;n++)this.items[n].dom.contains(r.target)&&this.moveSelection(n)};this.list=se("ul",{tabIndex:0,role:"listbox","aria-label":this.view.state.phrase("Diagnostics"),onkeydown:i,onclick:s}),this.dom=se("div",{class:"cm-panel-lint"},this.list,se("button",{type:"button",name:"close","aria-label":this.view.state.phrase("close"),onclick:()=>hd(this.view)},"×")),this.update()}get selectedIndex(){let e=this.view.state.field(it).selected;if(!e)return-1;for(let i=0;i<this.items.length;i++)if(this.items[i].diagnostic==e.diagnostic)return i;return-1}update(){let{diagnostics:e,selected:i}=this.view.state.field(it),s=0,r=!1,n=null,o=new Set;for(e.between(0,this.view.state.doc.length,(a,l,{spec:h})=>{for(let c of h.diagnostics){if(o.has(c))continue;o.add(c);let d=-1,u;for(let f=s;f<this.items.length;f++)if(this.items[f].diagnostic==c){d=f;break}d<0?(u=new dd(this.view,c),this.items.splice(s,0,u),r=!0):(u=this.items[d],d>s&&(this.items.splice(s,d-s),r=!0)),i&&u.diagnostic==i.diagnostic?u.dom.hasAttribute("aria-selected")||(u.dom.setAttribute("aria-selected","true"),n=u):u.dom.hasAttribute("aria-selected")&&u.dom.removeAttribute("aria-selected"),s++}});s<this.items.length&&!(this.items.length==1&&this.items[0].diagnostic.from<0);)r=!0,this.items.pop();this.items.length==0&&(this.items.push(new dd(this.view,{from:-1,to:-1,severity:"info",message:this.view.state.phrase("No diagnostics")})),r=!0),n?(this.list.setAttribute("aria-activedescendant",n.id),this.view.requestMeasure({key:this,read:()=>({sel:n.dom.getBoundingClientRect(),panel:this.list.getBoundingClientRect()}),write:({sel:a,panel:l})=>{let h=l.height/this.list.offsetHeight;a.top<l.top?this.list.scrollTop-=(l.top-a.top)/h:a.bottom>l.bottom&&(this.list.scrollTop+=(a.bottom-l.bottom)/h)}})):this.selectedIndex<0&&this.list.removeAttribute("aria-activedescendant"),r&&this.sync()}sync(){let e=this.list.firstChild;function i(){let s=e;e=s.nextSibling,s.remove()}for(let s of this.items)if(s.dom.parentNode==this.list){for(;e!=s.dom;)i();e=s.dom.nextSibling}else this.list.insertBefore(s.dom,e);for(;e;)i()}moveSelection(e){if(this.selectedIndex<0)return;let i=this.view.state.field(it),s=yi(i.diagnostics,this.items[e].diagnostic);s&&this.view.dispatch({selection:{anchor:s.from,head:s.to},scrollIntoView:!0,effects:Hp.of(s)})}static open(e){return new kr(e)}}function P1(t,e='viewBox="0 0 40 40"'){return`url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" ${e}>${encodeURIComponent(t)}</svg>')`}function an(t){return P1(`<path d="m0 2.5 l2 -1.5 l1 0 l2 1.5 l1 0" stroke="${t}" fill="none" stroke-width=".7"/>`,'width="6" height="3"')}const T1=L.baseTheme({".cm-diagnostic":{padding:"3px 6px 3px 8px",marginLeft:"-1px",display:"block",whiteSpace:"pre-wrap"},".cm-diagnostic-error":{borderLeft:"5px solid #d11"},".cm-diagnostic-warning":{borderLeft:"5px solid orange"},".cm-diagnostic-info":{borderLeft:"5px solid #999"},".cm-diagnostic-hint":{borderLeft:"5px solid #66d"},".cm-diagnosticAction":{font:"inherit",border:"none",padding:"2px 4px",backgroundColor:"#444",color:"white",borderRadius:"3px",marginLeft:"8px",cursor:"pointer"},".cm-diagnosticSource":{fontSize:"70%",opacity:.7},".cm-lintRange":{backgroundPosition:"left bottom",backgroundRepeat:"repeat-x",paddingBottom:"0.7px"},".cm-lintRange-error":{backgroundImage:an("#d11")},".cm-lintRange-warning":{backgroundImage:an("orange")},".cm-lintRange-info":{backgroundImage:an("#999")},".cm-lintRange-hint":{backgroundImage:an("#66d")},".cm-lintRange-active":{backgroundColor:"#ffdd9980"},".cm-tooltip-lint":{padding:0,margin:0},".cm-lintPoint":{position:"relative","&:after":{content:'""',position:"absolute",bottom:0,left:"-2px",borderLeft:"3px solid transparent",borderRight:"3px solid transparent",borderBottom:"4px solid #d11"}},".cm-lintPoint-warning":{"&:after":{borderBottomColor:"orange"}},".cm-lintPoint-info":{"&:after":{borderBottomColor:"#999"}},".cm-lintPoint-hint":{"&:after":{borderBottomColor:"#66d"}},".cm-panel.cm-panel-lint":{position:"relative","& ul":{maxHeight:"100px",overflowY:"auto","& [aria-selected]":{backgroundColor:"#ddd","& u":{textDecoration:"underline"}},"&:focus [aria-selected]":{background_fallback:"#bdf",backgroundColor:"Highlight",color_fallback:"white",color:"HighlightText"},"& u":{textDecoration:"none"},padding:0,margin:0},"& [name=close]":{position:"absolute",top:"0",right:"2px",background:"inherit",border:"none",font:"inherit",padding:0,margin:0}},"&dark .cm-lintRange-active":{backgroundColor:"#86714a80"},"&dark .cm-panel.cm-panel-lint ul":{"& [aria-selected]":{backgroundColor:"#2e343e"}}});function M1(t){return t=="error"?4:t=="warning"?3:t=="info"?2:1}function E1(t){let e="hint",i=1;for(let s of t){let r=M1(s.severity);r>i&&(i=r,e=s.severity)}return e}const _1=[it,L.decorations.compute([it],t=>{let{selected:e,panel:i}=t.field(it);return!e||!i||e.from==e.to?U.none:U.set([w1.range(e.from,e.to)])}),w0(k1,{hideOn:y1}),T1],D1=[B0(),I0(),Gv(),Zy(),Oy(),Hv(),jv(),J.allowMultipleSelections.of(!0),uy(),Hf(My,{fallback:!0}),Iy(),o1(),b1(),c0(),f0(),r0(),lw(),Nl.of([...c1,...sw,...Tw,...lx,...ky,...Np,...O1])];var ud={};class Yn{constructor(e,i,s,r,n,o,a,l,h,c=0,d){this.p=e,this.stack=i,this.state=s,this.reducePos=r,this.pos=n,this.score=o,this.buffer=a,this.bufferBase=l,this.curContext=h,this.lookAhead=c,this.parent=d}toString(){return`[${this.stack.filter((e,i)=>i%3==0).concat(this.state)}]@${this.pos}${this.score?"!"+this.score:""}`}static start(e,i,s=0){let r=e.parser.context;return new Yn(e,[],i,s,s,0,[],0,r?new fd(r,r.start):null,0,null)}get context(){return this.curContext?this.curContext.context:null}pushState(e,i){this.stack.push(this.state,i,this.bufferBase+this.buffer.length),this.state=e}reduce(e){var i;let s=e>>19,r=e&65535,{parser:n}=this.p,o=this.reducePos<this.pos-25&&this.setLookAhead(this.pos),a=n.dynamicPrecedence(r);if(a&&(this.score+=a),s==0){r<n.minRepeatTerm&&this.reducePos<this.pos&&(this.reducePos=this.pos),this.pushState(n.getGoto(this.state,r,!0),this.reducePos),r<n.minRepeatTerm&&this.storeNode(r,this.reducePos,this.reducePos,o?8:4,!0),this.reduceContext(r,this.reducePos);return}let l=this.stack.length-(s-1)*3-(e&262144?6:0),h=l?this.stack[l-2]:this.p.ranges[0].from;r<n.minRepeatTerm&&h==this.reducePos&&this.reducePos<this.pos&&(this.reducePos=this.pos);let c=this.reducePos-h;c>=2e3&&!(!((i=this.p.parser.nodeSet.types[r])===null||i===void 0)&&i.isAnonymous)&&(h==this.p.lastBigReductionStart?(this.p.bigReductionCount++,this.p.lastBigReductionSize=c):this.p.lastBigReductionSize<c&&(this.p.bigReductionCount=1,this.p.lastBigReductionStart=h,this.p.lastBigReductionSize=c));let d=l?this.stack[l-1]:0,u=this.bufferBase+this.buffer.length-d;if(r<n.minRepeatTerm||e&131072){let f=n.stateFlag(this.state,1)?this.pos:this.reducePos;this.storeNode(r,h,f,u+4,!0)}if(e&262144)this.state=this.stack[l];else{let f=this.stack[l-3];this.state=n.getGoto(f,r,!0)}for(;this.stack.length>l;)this.stack.pop();this.reduceContext(r,h)}storeNode(e,i,s,r=4,n=!1){if(e==0&&(!this.stack.length||this.stack[this.stack.length-1]<this.buffer.length+this.bufferBase)){let o=this.buffer.length;if(o>0&&this.buffer[o-4]==0&&this.buffer[o-1]>-1){if(i==s)return;if(this.buffer[o-2]>=i){this.buffer[o-2]=s;return}}}if(!n||this.pos==s)this.buffer.push(e,i,s,r);else{let o=this.buffer.length;if(o>0&&(this.buffer[o-4]!=0||this.buffer[o-1]<0)){let a=!1;for(let l=o;l>0&&this.buffer[l-2]>s;l-=4)if(this.buffer[l-1]>=0){a=!0;break}if(a)for(;o>0&&this.buffer[o-2]>s;)this.buffer[o]=this.buffer[o-4],this.buffer[o+1]=this.buffer[o-3],this.buffer[o+2]=this.buffer[o-2],this.buffer[o+3]=this.buffer[o-1],o-=4,r>4&&(r-=4)}this.buffer[o]=e,this.buffer[o+1]=i,this.buffer[o+2]=s,this.buffer[o+3]=r}}shift(e,i,s,r){if(e&131072)this.pushState(e&65535,this.pos);else if((e&262144)==0){let n=e,{parser:o}=this.p;this.pos=r;let a=o.stateFlag(n,1);!a&&(r>s||i<=o.maxNode)&&(this.reducePos=r),this.pushState(n,a?s:Math.min(s,this.reducePos)),this.shiftContext(i,s),i<=o.maxNode&&this.buffer.push(i,s,r,4)}else this.pos=r,this.shiftContext(i,s),i<=this.p.parser.maxNode&&this.buffer.push(i,s,r,4)}apply(e,i,s,r){e&65536?this.reduce(e):this.shift(e,i,s,r)}useNode(e,i){let s=this.p.reused.length-1;(s<0||this.p.reused[s]!=e)&&(this.p.reused.push(e),s++);let r=this.pos;this.reducePos=this.pos=r+e.length,this.pushState(i,r),this.buffer.push(s,r,this.reducePos,-1),this.curContext&&this.updateContext(this.curContext.tracker.reuse(this.curContext.context,e,this,this.p.stream.reset(this.pos-e.length)))}split(){let e=this,i=e.buffer.length;for(i&&e.buffer[i-4]==0&&(i-=4);i>0&&e.buffer[i-2]>e.reducePos;)i-=4;let s=e.buffer.slice(i),r=e.bufferBase+i;for(;e&&r==e.bufferBase;)e=e.parent;return new Yn(this.p,this.stack.slice(),this.state,this.reducePos,this.pos,this.score,s,r,this.curContext,this.lookAhead,e)}recoverByDelete(e,i){let s=e<=this.p.parser.maxNode;s&&this.storeNode(e,this.pos,i,4),this.storeNode(0,this.pos,i,s?8:4),this.pos=this.reducePos=i,this.score-=190}canShift(e){for(let i=new B1(this);;){let s=this.p.parser.stateSlot(i.state,4)||this.p.parser.hasAction(i.state,e);if(s==0)return!1;if((s&65536)==0)return!0;i.reduce(s)}}recoverByInsert(e){if(this.stack.length>=300)return[];let i=this.p.parser.nextStates(this.state);if(i.length>8||this.stack.length>=120){let r=[];for(let n=0,o;n<i.length;n+=2)(o=i[n+1])!=this.state&&this.p.parser.hasAction(o,e)&&r.push(i[n],o);if(this.stack.length<120)for(let n=0;r.length<8&&n<i.length;n+=2){let o=i[n+1];r.some((a,l)=>l&1&&a==o)||r.push(i[n],o)}i=r}let s=[];for(let r=0;r<i.length&&s.length<4;r+=2){let n=i[r+1];if(n==this.state)continue;let o=this.split();o.pushState(n,this.pos),o.storeNode(0,o.pos,o.pos,4,!0),o.shiftContext(i[r],this.pos),o.reducePos=this.pos,o.score-=200,s.push(o)}return s}forceReduce(){let{parser:e}=this.p,i=e.stateSlot(this.state,5);if((i&65536)==0)return!1;if(!e.validAction(this.state,i)){let s=i>>19,r=i&65535,n=this.stack.length-s*3;if(n<0||e.getGoto(this.stack[n],r,!1)<0){let o=this.findForcedReduction();if(o==null)return!1;i=o}this.storeNode(0,this.pos,this.pos,4,!0),this.score-=100}return this.reducePos=this.pos,this.reduce(i),!0}findForcedReduction(){let{parser:e}=this.p,i=[],s=(r,n)=>{if(!i.includes(r))return i.push(r),e.allActions(r,o=>{if(!(o&393216))if(o&65536){let a=(o>>19)-n;if(a>1){let l=o&65535,h=this.stack.length-a*3;if(h>=0&&e.getGoto(this.stack[h],l,!1)>=0)return a<<19|65536|l}}else{let a=s(o,n+1);if(a!=null)return a}})};return s(this.state,0)}forceAll(){for(;!this.p.parser.stateFlag(this.state,2);)if(!this.forceReduce()){this.storeNode(0,this.pos,this.pos,4,!0);break}return this}get deadEnd(){if(this.stack.length!=3)return!1;let{parser:e}=this.p;return e.data[e.stateSlot(this.state,1)]==65535&&!e.stateSlot(this.state,4)}restart(){this.storeNode(0,this.pos,this.pos,4,!0),this.state=this.stack[0],this.stack.length=0}sameState(e){if(this.state!=e.state||this.stack.length!=e.stack.length)return!1;for(let i=0;i<this.stack.length;i+=3)if(this.stack[i]!=e.stack[i])return!1;return!0}get parser(){return this.p.parser}dialectEnabled(e){return this.p.parser.dialect.flags[e]}shiftContext(e,i){this.curContext&&this.updateContext(this.curContext.tracker.shift(this.curContext.context,e,this,this.p.stream.reset(i)))}reduceContext(e,i){this.curContext&&this.updateContext(this.curContext.tracker.reduce(this.curContext.context,e,this,this.p.stream.reset(i)))}emitContext(){let e=this.buffer.length-1;(e<0||this.buffer[e]!=-3)&&this.buffer.push(this.curContext.hash,this.pos,this.pos,-3)}emitLookAhead(){let e=this.buffer.length-1;(e<0||this.buffer[e]!=-4)&&this.buffer.push(this.lookAhead,this.pos,this.pos,-4)}updateContext(e){if(e!=this.curContext.context){let i=new fd(this.curContext.tracker,e);i.hash!=this.curContext.hash&&this.emitContext(),this.curContext=i}}setLookAhead(e){return e<=this.lookAhead?!1:(this.emitLookAhead(),this.lookAhead=e,!0)}close(){this.curContext&&this.curContext.tracker.strict&&this.emitContext(),this.lookAhead>0&&this.emitLookAhead()}}class fd{constructor(e,i){this.tracker=e,this.context=i,this.hash=e.strict?e.hash(i):0}}class B1{constructor(e){this.start=e,this.state=e.state,this.stack=e.stack,this.base=this.stack.length}reduce(e){let i=e&65535,s=e>>19;s==0?(this.stack==this.start.stack&&(this.stack=this.stack.slice()),this.stack.push(this.state,0,0),this.base+=3):this.base-=(s-1)*3;let r=this.start.p.parser.getGoto(this.stack[this.base-3],i,!0);this.state=r}}class Gn{constructor(e,i,s){this.stack=e,this.pos=i,this.index=s,this.buffer=e.buffer,this.index==0&&this.maybeNext()}static create(e,i=e.bufferBase+e.buffer.length){return new Gn(e,i,i-e.bufferBase)}maybeNext(){let e=this.stack.parent;e!=null&&(this.index=this.stack.bufferBase-e.bufferBase,this.stack=e,this.buffer=e.buffer)}get id(){return this.buffer[this.index-4]}get start(){return this.buffer[this.index-3]}get end(){return this.buffer[this.index-2]}get size(){return this.buffer[this.index-1]}next(){this.index-=4,this.pos-=4,this.index==0&&this.maybeNext()}fork(){return new Gn(this.stack,this.pos,this.index)}}function ln(t,e=Uint16Array){if(typeof t!="string")return t;let i=null;for(let s=0,r=0;s<t.length;){let n=0;for(;;){let o=t.charCodeAt(s++),a=!1;if(o==126){n=65535;break}o>=92&&o--,o>=34&&o--;let l=o-32;if(l>=46&&(l-=46,a=!0),n+=l,a)break;n*=46}i?i[r++]=n:i=new e(n)}return i}class vn{constructor(){this.start=-1,this.value=-1,this.end=-1,this.extended=-1,this.lookAhead=0,this.mask=0,this.context=0}}const pd=new vn;class R1{constructor(e,i){this.input=e,this.ranges=i,this.chunk="",this.chunkOff=0,this.chunk2="",this.chunk2Pos=0,this.next=-1,this.token=pd,this.rangeIndex=0,this.pos=this.chunkPos=i[0].from,this.range=i[0],this.end=i[i.length-1].to,this.readNext()}resolveOffset(e,i){let s=this.range,r=this.rangeIndex,n=this.pos+e;for(;n<s.from;){if(!r)return null;let o=this.ranges[--r];n-=s.from-o.to,s=o}for(;i<0?n>s.to:n>=s.to;){if(r==this.ranges.length-1)return null;let o=this.ranges[++r];n+=o.from-s.to,s=o}return n}clipPos(e){if(e>=this.range.from&&e<this.range.to)return e;for(let i of this.ranges)if(i.to>e)return Math.max(e,i.from);return this.end}peek(e){let i=this.chunkOff+e,s,r;if(i>=0&&i<this.chunk.length)s=this.pos+e,r=this.chunk.charCodeAt(i);else{let n=this.resolveOffset(e,1);if(n==null)return-1;if(s=n,s>=this.chunk2Pos&&s<this.chunk2Pos+this.chunk2.length)r=this.chunk2.charCodeAt(s-this.chunk2Pos);else{let o=this.rangeIndex,a=this.range;for(;a.to<=s;)a=this.ranges[++o];this.chunk2=this.input.chunk(this.chunk2Pos=s),s+this.chunk2.length>a.to&&(this.chunk2=this.chunk2.slice(0,a.to-s)),r=this.chunk2.charCodeAt(0)}}return s>=this.token.lookAhead&&(this.token.lookAhead=s+1),r}acceptToken(e,i=0){let s=i?this.resolveOffset(i,-1):this.pos;if(s==null||s<this.token.start)throw new RangeError("Token end out of bounds");this.token.value=e,this.token.end=s}acceptTokenTo(e,i){this.token.value=e,this.token.end=i}getChunk(){if(this.pos>=this.chunk2Pos&&this.pos<this.chunk2Pos+this.chunk2.length){let{chunk:e,chunkPos:i}=this;this.chunk=this.chunk2,this.chunkPos=this.chunk2Pos,this.chunk2=e,this.chunk2Pos=i,this.chunkOff=this.pos-this.chunkPos}else{this.chunk2=this.chunk,this.chunk2Pos=this.chunkPos;let e=this.input.chunk(this.pos),i=this.pos+e.length;this.chunk=i>this.range.to?e.slice(0,this.range.to-this.pos):e,this.chunkPos=this.pos,this.chunkOff=0}}readNext(){return this.chunkOff>=this.chunk.length&&(this.getChunk(),this.chunkOff==this.chunk.length)?this.next=-1:this.next=this.chunk.charCodeAt(this.chunkOff)}advance(e=1){for(this.chunkOff+=e;this.pos+e>=this.range.to;){if(this.rangeIndex==this.ranges.length-1)return this.setDone();e-=this.range.to-this.pos,this.range=this.ranges[++this.rangeIndex],this.pos=this.range.from}return this.pos+=e,this.pos>=this.token.lookAhead&&(this.token.lookAhead=this.pos+1),this.readNext()}setDone(){return this.pos=this.chunkPos=this.end,this.range=this.ranges[this.rangeIndex=this.ranges.length-1],this.chunk="",this.next=-1}reset(e,i){if(i?(this.token=i,i.start=e,i.lookAhead=e+1,i.value=i.extended=-1):this.token=pd,this.pos!=e){if(this.pos=e,e==this.end)return this.setDone(),this;for(;e<this.range.from;)this.range=this.ranges[--this.rangeIndex];for(;e>=this.range.to;)this.range=this.ranges[++this.rangeIndex];e>=this.chunkPos&&e<this.chunkPos+this.chunk.length?this.chunkOff=e-this.chunkPos:(this.chunk="",this.chunkOff=0),this.readNext()}return this}read(e,i){if(e>=this.chunkPos&&i<=this.chunkPos+this.chunk.length)return this.chunk.slice(e-this.chunkPos,i-this.chunkPos);if(e>=this.chunk2Pos&&i<=this.chunk2Pos+this.chunk2.length)return this.chunk2.slice(e-this.chunk2Pos,i-this.chunk2Pos);if(e>=this.range.from&&i<=this.range.to)return this.input.read(e,i);let s="";for(let r of this.ranges){if(r.from>=i)break;r.to>e&&(s+=this.input.read(Math.max(r.from,e),Math.min(r.to,i)))}return s}}class ys{constructor(e,i){this.data=e,this.id=i}token(e,i){let{parser:s}=i.p;L1(this.data,e,i,this.id,s.data,s.tokenPrecTable)}}ys.prototype.contextual=ys.prototype.fallback=ys.prototype.extend=!1;ys.prototype.fallback=ys.prototype.extend=!1;class wo{constructor(e,i={}){this.token=e,this.contextual=!!i.contextual,this.fallback=!!i.fallback,this.extend=!!i.extend}}function L1(t,e,i,s,r,n){let o=0,a=1<<s,{dialect:l}=i.p.parser;e:for(;(a&t[o])!=0;){let h=t[o+1];for(let f=o+3;f<h;f+=2)if((t[f+1]&a)>0){let g=t[f];if(l.allows(g)&&(e.token.value==-1||e.token.value==g||I1(g,e.token.value,r,n))){e.acceptToken(g);break}}let c=e.next,d=0,u=t[o+2];if(e.next<0&&u>d&&t[h+u*3-3]==65535){o=t[h+u*3-1];continue e}for(;d<u;){let f=d+u>>1,g=h+f+(f<<1),m=t[g],y=t[g+1]||65536;if(c<m)u=f;else if(c>=y)d=f+1;else{o=t[g+2],e.advance();continue e}}break}}function gd(t,e,i){for(let s=e,r;(r=t[s])!=65535;s++)if(r==i)return s-e;return-1}function I1(t,e,i,s){let r=gd(i,s,e);return r<0||gd(i,s,t)<r}const et=typeof process<"u"&&ud&&/\bparse\b/.test(ud.LOG);let oa=null;function md(t,e,i){let s=t.cursor(ge.IncludeAnonymous);for(s.moveTo(e);;)if(!(i<0?s.childBefore(e):s.childAfter(e)))for(;;){if((i<0?s.to<e:s.from>e)&&!s.type.isError)return i<0?Math.max(0,Math.min(s.to-1,e-25)):Math.min(t.length,Math.max(s.from+1,e+25));if(i<0?s.prevSibling():s.nextSibling())break;if(!s.parent())return i<0?0:t.length}}class F1{constructor(e,i){this.fragments=e,this.nodeSet=i,this.i=0,this.fragment=null,this.safeFrom=-1,this.safeTo=-1,this.trees=[],this.start=[],this.index=[],this.nextFragment()}nextFragment(){let e=this.fragment=this.i==this.fragments.length?null:this.fragments[this.i++];if(e){for(this.safeFrom=e.openStart?md(e.tree,e.from+e.offset,1)-e.offset:e.from,this.safeTo=e.openEnd?md(e.tree,e.to+e.offset,-1)-e.offset:e.to;this.trees.length;)this.trees.pop(),this.start.pop(),this.index.pop();this.trees.push(e.tree),this.start.push(-e.offset),this.index.push(0),this.nextStart=this.safeFrom}else this.nextStart=1e9}nodeAt(e){if(e<this.nextStart)return null;for(;this.fragment&&this.safeTo<=e;)this.nextFragment();if(!this.fragment)return null;for(;;){let i=this.trees.length-1;if(i<0)return this.nextFragment(),null;let s=this.trees[i],r=this.index[i];if(r==s.children.length){this.trees.pop(),this.start.pop(),this.index.pop();continue}let n=s.children[r],o=this.start[i]+s.positions[r];if(o>e)return this.nextStart=o,null;if(n instanceof ve){if(o==e){if(o<this.safeFrom)return null;let a=o+n.length;if(a<=this.safeTo){let l=n.prop(V.lookAhead);if(!l||a+l<this.fragment.to)return n}}this.index[i]++,o+n.length>=Math.max(this.safeFrom,e)&&(this.trees.push(n),this.start.push(o),this.index.push(0))}else this.index[i]++,this.nextStart=o+n.length}}}class N1{constructor(e,i){this.stream=i,this.tokens=[],this.mainToken=null,this.actions=[],this.tokens=e.tokenizers.map(s=>new vn)}getActions(e){let i=0,s=null,{parser:r}=e.p,{tokenizers:n}=r,o=r.stateSlot(e.state,3),a=e.curContext?e.curContext.hash:0,l=0;for(let h=0;h<n.length;h++){if((1<<h&o)==0)continue;let c=n[h],d=this.tokens[h];if(!(s&&!c.fallback)&&((c.contextual||d.start!=e.pos||d.mask!=o||d.context!=a)&&(this.updateCachedToken(d,c,e),d.mask=o,d.context=a),d.lookAhead>d.end+25&&(l=Math.max(d.lookAhead,l)),d.value!=0)){let u=i;if(d.extended>-1&&(i=this.addActions(e,d.extended,d.end,i)),i=this.addActions(e,d.value,d.end,i),!c.extend&&(s=d,i>u))break}}for(;this.actions.length>i;)this.actions.pop();return l&&e.setLookAhead(l),!s&&e.pos==this.stream.end&&(s=new vn,s.value=e.p.parser.eofTerm,s.start=s.end=e.pos,i=this.addActions(e,s.value,s.end,i)),this.mainToken=s,this.actions}getMainToken(e){if(this.mainToken)return this.mainToken;let i=new vn,{pos:s,p:r}=e;return i.start=s,i.end=Math.min(s+1,r.stream.end),i.value=s==r.stream.end?r.parser.eofTerm:0,i}updateCachedToken(e,i,s){let r=this.stream.clipPos(s.pos);if(i.token(this.stream.reset(r,e),s),e.value>-1){let{parser:n}=s.p;for(let o=0;o<n.specialized.length;o++)if(n.specialized[o]==e.value){let a=n.specializers[o](this.stream.read(e.start,e.end),s);if(a>=0&&s.p.parser.dialect.allows(a>>1)){(a&1)==0?e.value=a>>1:e.extended=a>>1;break}}}else e.value=0,e.end=this.stream.clipPos(r+1)}putAction(e,i,s,r){for(let n=0;n<r;n+=3)if(this.actions[n]==e)return r;return this.actions[r++]=e,this.actions[r++]=i,this.actions[r++]=s,r}addActions(e,i,s,r){let{state:n}=e,{parser:o}=e.p,{data:a}=o;for(let l=0;l<2;l++)for(let h=o.stateSlot(n,l?2:1);;h+=3){if(a[h]==65535)if(a[h+1]==1)h=jt(a,h+2);else{r==0&&a[h+1]==2&&(r=this.putAction(jt(a,h+2),i,s,r));break}a[h]==i&&(r=this.putAction(jt(a,h+1),i,s,r))}return r}}class U1{constructor(e,i,s,r){this.parser=e,this.input=i,this.ranges=r,this.recovering=0,this.nextStackID=9812,this.minStackPos=0,this.reused=[],this.stoppedAt=null,this.lastBigReductionStart=-1,this.lastBigReductionSize=0,this.bigReductionCount=0,this.stream=new R1(i,r),this.tokens=new N1(e,this.stream),this.topTerm=e.top[1];let{from:n}=r[0];this.stacks=[Yn.start(this,e.top[0],n)],this.fragments=s.length&&this.stream.end-n>e.bufferLength*4?new F1(s,e.nodeSet):null}get parsedPos(){return this.minStackPos}advance(){let e=this.stacks,i=this.minStackPos,s=this.stacks=[],r,n;if(this.bigReductionCount>300&&e.length==1){let[o]=e;for(;o.forceReduce()&&o.stack.length&&o.stack[o.stack.length-2]>=this.lastBigReductionStart;);this.bigReductionCount=this.lastBigReductionSize=0}for(let o=0;o<e.length;o++){let a=e[o];for(;;){if(this.tokens.mainToken=null,a.pos>i)s.push(a);else{if(this.advanceStack(a,s,e))continue;{r||(r=[],n=[]),r.push(a);let l=this.tokens.getMainToken(a);n.push(l.value,l.end)}}break}}if(!s.length){let o=r&&z1(r);if(o)return et&&console.log("Finish with "+this.stackID(o)),this.stackToTree(o);if(this.parser.strict)throw et&&r&&console.log("Stuck with token "+(this.tokens.mainToken?this.parser.getName(this.tokens.mainToken.value):"none")),new SyntaxError("No parse at "+i);this.recovering||(this.recovering=5)}if(this.recovering&&r){let o=this.stoppedAt!=null&&r[0].pos>this.stoppedAt?r[0]:this.runRecovery(r,n,s);if(o)return et&&console.log("Force-finish "+this.stackID(o)),this.stackToTree(o.forceAll())}if(this.recovering){let o=this.recovering==1?1:this.recovering*3;if(s.length>o)for(s.sort((a,l)=>l.score-a.score);s.length>o;)s.pop();s.some(a=>a.reducePos>i)&&this.recovering--}else if(s.length>1){e:for(let o=0;o<s.length-1;o++){let a=s[o];for(let l=o+1;l<s.length;l++){let h=s[l];if(a.sameState(h)||a.buffer.length>500&&h.buffer.length>500)if((a.score-h.score||a.buffer.length-h.buffer.length)>0)s.splice(l--,1);else{s.splice(o--,1);continue e}}}s.length>12&&(s.sort((o,a)=>a.score-o.score),s.splice(12,s.length-12))}this.minStackPos=s[0].pos;for(let o=1;o<s.length;o++)s[o].pos<this.minStackPos&&(this.minStackPos=s[o].pos);return null}stopAt(e){if(this.stoppedAt!=null&&this.stoppedAt<e)throw new RangeError("Can't move stoppedAt forward");this.stoppedAt=e}advanceStack(e,i,s){let r=e.pos,{parser:n}=this,o=et?this.stackID(e)+" -> ":"";if(this.stoppedAt!=null&&r>this.stoppedAt)return e.forceReduce()?e:null;if(this.fragments){let h=e.curContext&&e.curContext.tracker.strict,c=h?e.curContext.hash:0;for(let d=this.fragments.nodeAt(r);d;){let u=this.parser.nodeSet.types[d.type.id]==d.type?n.getGoto(e.state,d.type.id):-1;if(u>-1&&d.length&&(!h||(d.prop(V.contextHash)||0)==c))return e.useNode(d,u),et&&console.log(o+this.stackID(e)+` (via reuse of ${n.getName(d.type.id)})`),!0;if(!(d instanceof ve)||d.children.length==0||d.positions[0]>0)break;let f=d.children[0];if(f instanceof ve&&d.positions[0]==0)d=f;else break}}let a=n.stateSlot(e.state,4);if(a>0)return e.reduce(a),et&&console.log(o+this.stackID(e)+` (via always-reduce ${n.getName(a&65535)})`),!0;if(e.stack.length>=8400)for(;e.stack.length>6e3&&e.forceReduce(););let l=this.tokens.getActions(e);for(let h=0;h<l.length;){let c=l[h++],d=l[h++],u=l[h++],f=h==l.length||!s,g=f?e:e.split(),m=this.tokens.mainToken;if(g.apply(c,d,m?m.start:g.pos,u),et&&console.log(o+this.stackID(g)+` (via ${(c&65536)==0?"shift":`reduce of ${n.getName(c&65535)}`} for ${n.getName(d)} @ ${r}${g==e?"":", split"})`),f)return!0;g.pos>r?i.push(g):s.push(g)}return!1}advanceFully(e,i){let s=e.pos;for(;;){if(!this.advanceStack(e,null,null))return!1;if(e.pos>s)return bd(e,i),!0}}runRecovery(e,i,s){let r=null,n=!1;for(let o=0;o<e.length;o++){let a=e[o],l=i[o<<1],h=i[(o<<1)+1],c=et?this.stackID(a)+" -> ":"";if(a.deadEnd&&(n||(n=!0,a.restart(),et&&console.log(c+this.stackID(a)+" (restarted)"),this.advanceFully(a,s))))continue;let d=a.split(),u=c;for(let f=0;f<10&&d.forceReduce()&&(et&&console.log(u+this.stackID(d)+" (via force-reduce)"),!this.advanceFully(d,s));f++)et&&(u=this.stackID(d)+" -> ");for(let f of a.recoverByInsert(l))et&&console.log(c+this.stackID(f)+" (via recover-insert)"),this.advanceFully(f,s);this.stream.end>a.pos?(h==a.pos&&(h++,l=0),a.recoverByDelete(l,h),et&&console.log(c+this.stackID(a)+` (via recover-delete ${this.parser.getName(l)})`),bd(a,s)):(!r||r.score<d.score)&&(r=d)}return r}stackToTree(e){return e.close(),ve.build({buffer:Gn.create(e),nodeSet:this.parser.nodeSet,topID:this.topTerm,maxBufferLength:this.parser.bufferLength,reused:this.reused,start:this.ranges[0].from,length:e.pos-this.ranges[0].from,minRepeatType:this.parser.minRepeatTerm})}stackID(e){let i=(oa||(oa=new WeakMap)).get(e);return i||oa.set(e,i=String.fromCodePoint(this.nextStackID++)),i+e}}function bd(t,e){for(let i=0;i<e.length;i++){let s=e[i];if(s.pos==t.pos&&s.sameState(t)){e[i].score<t.score&&(e[i]=t);return}}e.push(t)}class H1{constructor(e,i,s){this.source=e,this.flags=i,this.disabled=s}allows(e){return!this.disabled||this.disabled[e]==0}}const aa=t=>t;class W1{constructor(e){this.start=e.start,this.shift=e.shift||aa,this.reduce=e.reduce||aa,this.reuse=e.reuse||aa,this.hash=e.hash||(()=>0),this.strict=e.strict!==!1}}class Zn extends Cf{constructor(e){if(super(),this.wrappers=[],e.version!=14)throw new RangeError(`Parser version (${e.version}) doesn't match runtime version (14)`);let i=e.nodeNames.split(" ");this.minRepeatTerm=i.length;for(let a=0;a<e.repeatNodeCount;a++)i.push("");let s=Object.keys(e.topRules).map(a=>e.topRules[a][1]),r=[];for(let a=0;a<i.length;a++)r.push([]);function n(a,l,h){r[a].push([l,l.deserialize(String(h))])}if(e.nodeProps)for(let a of e.nodeProps){let l=a[0];typeof l=="string"&&(l=V[l]);for(let h=1;h<a.length;){let c=a[h++];if(c>=0)n(c,l,a[h++]);else{let d=a[h+-c];for(let u=-c;u>0;u--)n(a[h++],l,d);h++}}}this.nodeSet=new zl(i.map((a,l)=>Ye.define({name:l>=this.minRepeatTerm?void 0:a,id:l,props:r[l],top:s.indexOf(l)>-1,error:l==0,skipped:e.skippedNodes&&e.skippedNodes.indexOf(l)>-1}))),e.propSources&&(this.nodeSet=this.nodeSet.extend(...e.propSources)),this.strict=!1,this.bufferLength=xf;let o=ln(e.tokenData);this.context=e.context,this.specializerSpecs=e.specialized||[],this.specialized=new Uint16Array(this.specializerSpecs.length);for(let a=0;a<this.specializerSpecs.length;a++)this.specialized[a]=this.specializerSpecs[a].term;this.specializers=this.specializerSpecs.map(vd),this.states=ln(e.states,Uint32Array),this.data=ln(e.stateData),this.goto=ln(e.goto),this.maxTerm=e.maxTerm,this.tokenizers=e.tokenizers.map(a=>typeof a=="number"?new ys(o,a):a),this.topRules=e.topRules,this.dialects=e.dialects||{},this.dynamicPrecedences=e.dynamicPrecedences||null,this.tokenPrecTable=e.tokenPrec,this.termNames=e.termNames||null,this.maxNode=this.nodeSet.types.length-1,this.dialect=this.parseDialect(),this.top=this.topRules[Object.keys(this.topRules)[0]]}createParse(e,i,s){let r=new U1(this,e,i,s);for(let n of this.wrappers)r=n(r,e,i,s);return r}getGoto(e,i,s=!1){let r=this.goto;if(i>=r[0])return-1;for(let n=r[i+1];;){let o=r[n++],a=o&1,l=r[n++];if(a&&s)return l;for(let h=n+(o>>1);n<h;n++)if(r[n]==e)return l;if(a)return-1}}hasAction(e,i){let s=this.data;for(let r=0;r<2;r++)for(let n=this.stateSlot(e,r?2:1),o;;n+=3){if((o=s[n])==65535)if(s[n+1]==1)o=s[n=jt(s,n+2)];else{if(s[n+1]==2)return jt(s,n+2);break}if(o==i||o==0)return jt(s,n+1)}return 0}stateSlot(e,i){return this.states[e*6+i]}stateFlag(e,i){return(this.stateSlot(e,0)&i)>0}validAction(e,i){return!!this.allActions(e,s=>s==i?!0:null)}allActions(e,i){let s=this.stateSlot(e,4),r=s?i(s):void 0;for(let n=this.stateSlot(e,1);r==null;n+=3){if(this.data[n]==65535)if(this.data[n+1]==1)n=jt(this.data,n+2);else break;r=i(jt(this.data,n+1))}return r}nextStates(e){let i=[];for(let s=this.stateSlot(e,1);;s+=3){if(this.data[s]==65535)if(this.data[s+1]==1)s=jt(this.data,s+2);else break;if((this.data[s+2]&1)==0){let r=this.data[s+1];i.some((n,o)=>o&1&&n==r)||i.push(this.data[s],r)}}return i}configure(e){let i=Object.assign(Object.create(Zn.prototype),this);if(e.props&&(i.nodeSet=this.nodeSet.extend(...e.props)),e.top){let s=this.topRules[e.top];if(!s)throw new RangeError(`Invalid top rule name ${e.top}`);i.top=s}return e.tokenizers&&(i.tokenizers=this.tokenizers.map(s=>{let r=e.tokenizers.find(n=>n.from==s);return r?r.to:s})),e.specializers&&(i.specializers=this.specializers.slice(),i.specializerSpecs=this.specializerSpecs.map((s,r)=>{let n=e.specializers.find(a=>a.from==s.external);if(!n)return s;let o=Object.assign(Object.assign({},s),{external:n.to});return i.specializers[r]=vd(o),o})),e.contextTracker&&(i.context=e.contextTracker),e.dialect&&(i.dialect=this.parseDialect(e.dialect)),e.strict!=null&&(i.strict=e.strict),e.wrap&&(i.wrappers=i.wrappers.concat(e.wrap)),e.bufferLength!=null&&(i.bufferLength=e.bufferLength),i}hasWrappers(){return this.wrappers.length>0}getName(e){return this.termNames?this.termNames[e]:String(e<=this.maxNode&&this.nodeSet.types[e].name||e)}get eofTerm(){return this.maxNode+1}get topNode(){return this.nodeSet.types[this.top[1]]}dynamicPrecedence(e){let i=this.dynamicPrecedences;return i==null?0:i[e]||0}parseDialect(e){let i=Object.keys(this.dialects),s=i.map(()=>!1);if(e)for(let n of e.split(" ")){let o=i.indexOf(n);o>=0&&(s[o]=!0)}let r=null;for(let n=0;n<i.length;n++)if(!s[n])for(let o=this.dialects[i[n]],a;(a=this.data[o++])!=65535;)(r||(r=new Uint8Array(this.maxTerm+1)))[a]=1;return new H1(e,s,r)}static deserialize(e){return new Zn(e)}}function jt(t,e){return t[e]|t[e+1]<<16}function z1(t){let e=null;for(let i of t){let s=i.p.stoppedAt;(i.pos==i.p.stream.end||s!=null&&i.pos>s)&&i.p.parser.stateFlag(i.state,2)&&(!e||e.score<i.score)&&(e=i)}return e}function vd(t){if(t.external){let e=t.extend?1:0;return(i,s)=>t.external(i,s)<<1|e}return t.get}const ns=63,yd=64,q1=1,V1=2,qp=3,j1=4,Vp=5,Q1=6,K1=7,jp=65,X1=66,J1=8,Y1=9,G1=10,Z1=11,ek=12,Qp=13,tk=19,ik=20,sk=29,rk=33,nk=34,ok=47,ak=0,lh=1,ol=2,Sr=3,al=4;class _i{constructor(e,i,s){this.parent=e,this.depth=i,this.type=s,this.hash=(e?e.hash+e.hash<<8:0)+i+(i<<4)+s}}_i.top=new _i(null,-1,ak);function ir(t,e){for(let i=0,s=e-t.pos-1;;s--,i++){let r=t.peek(s);if(Zt(r)||r==-1)return i}}function ll(t){return t==32||t==9}function Zt(t){return t==10||t==13}function Kp(t){return ll(t)||Zt(t)}function Ii(t){return t<0||Kp(t)}const lk=new W1({start:_i.top,reduce(t,e){return t.type==Sr&&(e==ik||e==nk)?t.parent:t},shift(t,e,i,s){if(e==qp)return new _i(t,ir(s,s.pos),lh);if(e==jp||e==Vp)return new _i(t,ir(s,s.pos),ol);if(e==ns)return t.parent;if(e==tk||e==rk)return new _i(t,0,Sr);if(e==Qp&&t.type==al)return t.parent;if(e==ok){let r=/[1-9]/.exec(s.read(s.pos,i.pos));if(r)return new _i(t,t.depth+ +r[0],al)}return t},hash(t){return t.hash}});function Ts(t,e,i=0){return t.peek(i)==e&&t.peek(i+1)==e&&t.peek(i+2)==e&&Ii(t.peek(i+3))}const hk=new wo((t,e)=>{if(t.next==-1&&e.canShift(yd))return t.acceptToken(yd);let i=t.peek(-1);if((Zt(i)||i<0)&&e.context.type!=Sr){if(Ts(t,45))if(e.canShift(ns))t.acceptToken(ns);else return t.acceptToken(q1,3);if(Ts(t,46))if(e.canShift(ns))t.acceptToken(ns);else return t.acceptToken(V1,3);let s=0;for(;t.next==32;)s++,t.advance();(s<e.context.depth||s==e.context.depth&&e.context.type==lh&&(t.next!=45||!Ii(t.peek(1))))&&t.next!=-1&&!Zt(t.next)&&t.next!=35&&t.acceptToken(ns,-s)}},{contextual:!0}),ck=new wo((t,e)=>{if(e.context.type==Sr){t.next==63&&(t.advance(),Ii(t.next)&&t.acceptToken(K1));return}if(t.next==45)t.advance(),Ii(t.next)&&t.acceptToken(e.context.type==lh&&e.context.depth==ir(t,t.pos-1)?j1:qp);else if(t.next==63)t.advance(),Ii(t.next)&&t.acceptToken(e.context.type==ol&&e.context.depth==ir(t,t.pos-1)?Q1:Vp);else{let i=t.pos;for(;;)if(ll(t.next)){if(t.pos==i)return;t.advance()}else if(t.next==33)Xp(t);else if(t.next==38)hl(t);else if(t.next==42){hl(t);break}else if(t.next==39||t.next==34){if(hh(t,!0))break;return}else if(t.next==91||t.next==123){if(!uk(t))return;break}else{Jp(t,!0,!1,0);break}for(;ll(t.next);)t.advance();if(t.next==58){if(t.pos==i&&e.canShift(sk))return;let s=t.peek(1);Ii(s)&&t.acceptTokenTo(e.context.type==ol&&e.context.depth==ir(t,i)?X1:jp,i)}}},{contextual:!0});function dk(t){return t>32&&t<127&&t!=34&&t!=37&&t!=44&&t!=60&&t!=62&&t!=92&&t!=94&&t!=96&&t!=123&&t!=124&&t!=125}function xd(t){return t>=48&&t<=57||t>=97&&t<=102||t>=65&&t<=70}function wd(t,e){return t.next==37?(t.advance(),xd(t.next)&&t.advance(),xd(t.next)&&t.advance(),!0):dk(t.next)||e&&t.next==44?(t.advance(),!0):!1}function Xp(t){if(t.advance(),t.next==60){for(t.advance();;)if(!wd(t,!0)){t.next==62&&t.advance();break}}else for(;wd(t,!1););}function hl(t){for(t.advance();!Ii(t.next)&&eo(t.next)!="f";)t.advance()}function hh(t,e){let i=t.next,s=!1,r=t.pos;for(t.advance();;){let n=t.next;if(n<0)break;if(t.advance(),n==i)if(n==39)if(t.next==39)t.advance();else break;else break;else if(n==92&&i==34)t.next>=0&&t.advance();else if(Zt(n)){if(e)return!1;s=!0}else if(e&&t.pos>=r+1024)return!1}return!s}function uk(t){for(let e=[],i=t.pos+1024;;)if(t.next==91||t.next==123)e.push(t.next),t.advance();else if(t.next==39||t.next==34){if(!hh(t,!0))return!1}else if(t.next==93||t.next==125){if(e[e.length-1]!=t.next-2)return!1;if(e.pop(),t.advance(),!e.length)return!0}else{if(t.next<0||t.pos>i||Zt(t.next))return!1;t.advance()}}const fk="iiisiiissisfissssssssssssisssiiissssssssssssssssssssssssssfsfssissssssssssssssssssssssssssfif";function eo(t){return t<33?"u":t>125?"s":fk[t-33]}function la(t,e){let i=eo(t);return i!="u"&&!(e&&i=="f")}function Jp(t,e,i,s){if(eo(t.next)=="s"||(t.next==63||t.next==58||t.next==45)&&la(t.peek(1),i))t.advance();else return!1;let r=t.pos;for(;;){let n=t.next,o=0,a=s+1;for(;Kp(n);){if(Zt(n)){if(e)return!1;a=0}else a++;n=t.peek(++o)}if(!(n>=0&&(n==58?la(t.peek(o+1),i):n==35?t.peek(o-1)!=32:la(n,i)))||!i&&a<=s||a==0&&!i&&(Ts(t,45,o)||Ts(t,46,o)))break;if(e&&eo(n)=="f")return!1;for(let h=o;h>=0;h--)t.advance();if(e&&t.pos>r+1024)return!1}return!0}const pk=new wo((t,e)=>{if(t.next==33)Xp(t),t.acceptToken(ek);else if(t.next==38||t.next==42){let i=t.next==38?G1:Z1;hl(t),t.acceptToken(i)}else t.next==39||t.next==34?(hh(t,!1),t.acceptToken(Y1)):Jp(t,!1,e.context.type==Sr,e.context.depth)&&t.acceptToken(J1)}),gk=new wo((t,e)=>{let i=e.context.type==al?e.context.depth:-1,s=t.pos;e:for(;;){let r=0,n=t.next;for(;n==32;)n=t.peek(++r);if(!r&&(Ts(t,45,r)||Ts(t,46,r))||!Zt(n)&&(i<0&&(i=Math.max(e.context.depth+1,r)),r<i))break;for(;;){if(t.next<0)break e;let o=Zt(t.next);if(t.advance(),o)continue e;s=t.pos}}t.acceptTokenTo(Qp,s)}),mk=$f({DirectiveName:k.keyword,DirectiveContent:k.attributeValue,"DirectiveEnd DocEnd":k.meta,QuotedLiteral:k.string,BlockLiteralHeader:k.special(k.string),BlockLiteralContent:k.content,Literal:k.content,"Key/Literal Key/QuotedLiteral":k.definition(k.propertyName),"Anchor Alias":k.labelName,Tag:k.typeName,Comment:k.lineComment,": , -":k.separator,"?":k.punctuation,"[ ]":k.squareBracket,"{ }":k.brace}),bk=Zn.deserialize({version:14,states:"5lQ!ZQgOOO#PQfO'#CpO#uQfO'#DOOOQR'#Dv'#DvO$qQgO'#DRO%gQdO'#DUO%nQgO'#DUO&ROaO'#D[OOQR'#Du'#DuO&{QgO'#D^O'rQgO'#D`OOQR'#Dt'#DtO(iOqO'#DbOOQP'#Dj'#DjO(zQaO'#CmO)YQgO'#CmOOQP'#Cm'#CmQ)jQaOOQ)uQgOOQ]QgOOO*PQdO'#CrO*nQdO'#CtOOQO'#Dw'#DwO+]Q`O'#CxO+hQdO'#CwO+rQ`O'#CwOOQO'#Cv'#CvO+wQdO'#CvOOQO'#Cq'#CqO,UQ`O,59[O,^QfO,59[OOQR,59[,59[OOQO'#Cx'#CxO,eQ`O'#DPO,pQdO'#DPOOQO'#Dx'#DxO,zQdO'#DxO-XQ`O,59jO-aQfO,59jOOQR,59j,59jOOQR'#DS'#DSO-hQcO,59mO-sQgO'#DVO.TQ`O'#DVO.YQcO,59pOOQR'#DX'#DXO#|QfO'#DWO.hQcO'#DWOOQR,59v,59vO.yOWO,59vO/OOaO,59vO/WOaO,59vO/cQgO'#D_OOQR,59x,59xO0VQgO'#DaOOQR,59z,59zOOQP,59|,59|O0yOaO,59|O1ROaO,59|O1aOqO,59|OOQP-E7h-E7hO1oQgO,59XOOQP,59X,59XO2PQaO'#DeO2_QgO'#DeO2oQgO'#DkOOQP'#Dk'#DkQ)jQaOOO3PQdO'#CsOOQO,59^,59^O3kQdO'#CuOOQO,59`,59`OOQO,59c,59cO4VQdO,59cO4aQdO'#CzO4kQ`O'#CzOOQO,59b,59bOOQU,5:Q,5:QOOQR1G.v1G.vO4pQ`O1G.vOOQU-E7d-E7dO4xQdO,59kOOQO,59k,59kO5SQdO'#DQO5^Q`O'#DQOOQO,5:d,5:dOOQU,5:R,5:ROOQR1G/U1G/UO5cQ`O1G/UOOQU-E7e-E7eO5kQgO'#DhO5xQcO1G/XOOQR1G/X1G/XOOQR,59q,59qO6TQgO,59qO6eQdO'#DiO6lQgO'#DiO7PQcO1G/[OOQR1G/[1G/[OOQR,59r,59rO#|QfO,59rOOQR1G/b1G/bO7_OWO1G/bO7dOaO1G/bOOQR,59y,59yOOQR,59{,59{OOQP1G/h1G/hO7lOaO1G/hO7tOaO1G/hO8POaO1G/hOOQP1G.s1G.sO8_QgO,5:POOQP,5:P,5:POOQP,5:V,5:VOOQP-E7i-E7iOOQO,59_,59_OOQO,59a,59aOOQO1G.}1G.}OOQO,59f,59fO8oQdO,59fOOQR7+$b7+$bP,XQ`O'#DfOOQO1G/V1G/VOOQO,59l,59lO8yQdO,59lOOQR7+$p7+$pP9TQ`O'#DgOOQR'#DT'#DTOOQR,5:S,5:SOOQR-E7f-E7fOOQR7+$s7+$sOOQR1G/]1G/]O9YQgO'#DYO9jQ`O'#DYOOQR,5:T,5:TO#|QfO'#DZO9oQcO'#DZOOQR-E7g-E7gOOQR7+$v7+$vOOQR1G/^1G/^OOQR7+$|7+$|O:QOWO7+$|OOQP7+%S7+%SO:VOaO7+%SO:_OaO7+%SOOQP1G/k1G/kOOQO1G/Q1G/QOOQO1G/W1G/WOOQR,59t,59tO:jQgO,59tOOQR,59u,59uO#|QfO,59uOOQR<<Hh<<HhOOQP<<Hn<<HnO:zOaO<<HnOOQR1G/`1G/`OOQR1G/a1G/aOOQPAN>YAN>Y",stateData:";S~O!fOS!gOS^OS~OP_OQbORSOTUOWROXROYYOZZO[XOcPOqQO!PVO!V[O!cTO~O`cO~P]OVkOWROXROYeOZfO[dOcPOmhOqQO~OboO~P!bOVtOWROXROYeOZfO[dOcPOmrOqQO~OpwO~P#WORSOTUOWROXROYYOZZO[XOcPOqQO!PVO!cTO~OSvP!avP!bvP~P#|OWROXROYeOZfO[dOcPOqQO~OmzO~P%OOm!OOUzP!azP!bzP!dzP~P#|O^!SO!b!QO!f!TO!g!RO~ORSOTUOWROXROcPOqQO!PVO!cTO~OY!UOP!QXQ!QX!V!QX!`!QXS!QX!a!QX!b!QXU!QXm!QX!d!QX~P&aO[!WOP!SXQ!SX!V!SX!`!SXS!SX!a!SX!b!SXU!SXm!SX!d!SX~P&aO^!ZO!W![O!b!YO!f!]O!g!YO~OP!_O!V[OQaX!`aX~OPaXQaX!VaX!`aX~P#|OP!bOQ!cO!V[O~OP_O!V[O~P#|OWROXROY!fOcPOqQObfXmfXofXpfX~OWROXRO[!hOcPOqQObhXmhXohXphX~ObeXmlXoeX~ObkXokX~P%OOm!kO~Om!lObnPonP~P%OOb!pOo!oO~Ob!pO~P!bOm!sOosXpsX~OosXpsX~P%OOm!uOotPptP~P%OOo!xOp!yO~Op!yO~P#WOS!|O!a#OO!b#OO~OUyX!ayX!byX!dyX~P#|Om#QO~OU#SO!a#UO!b#UO!d#RO~Om#WOUzX!azX!bzX!dzX~O]#XO~O!b#XO!g#YO~O^#ZO!b#XO!g#YO~OP!RXQ!RX!V!RX!`!RXS!RX!a!RX!b!RXU!RXm!RX!d!RX~P&aOP!TXQ!TX!V!TX!`!TXS!TX!a!TX!b!TXU!TXm!TX!d!TX~P&aO!b#^O!g#^O~O^#_O!b#^O!f#`O!g#^O~O^#_O!W#aO!b#^O!g#^O~OPaaQaa!Vaa!`aa~P#|OP#cO!V[OQ!XX!`!XX~OP!XXQ!XX!V!XX!`!XX~P#|OP_O!V[OQ!_X!`!_X~P#|OWROXROcPOqQObgXmgXogXpgX~OWROXROcPOqQObiXmiXoiXpiX~Obkaoka~P%OObnXonX~P%OOm#kO~Ob#lOo!oO~Oosapsa~P%OOotXptX~P%OOm#pO~Oo!xOp#qO~OSwP!awP!bwP~P#|OS!|O!a#vO!b#vO~OUya!aya!bya!dya~P#|Om#xO~P%OOm#{OU}P!a}P!b}P!d}P~P#|OU#SO!a$OO!b$OO!d#RO~O]$QO~O!b$QO!g$RO~O!b$SO!g$SO~O^$TO!b$SO!g$SO~O^$TO!b$SO!f$UO!g$SO~OP!XaQ!Xa!V!Xa!`!Xa~P#|Obnaona~P%OOotapta~P%OOo!xO~OU|X!a|X!b|X!d|X~P#|Om$ZO~Om$]OU}X!a}X!b}X!d}X~O]$^O~O!b$_O!g$_O~O^$`O!b$_O!g$_O~OU|a!a|a!b|a!d|a~P#|O!b$cO!g$cO~O",goto:",]!mPPPPPPPPPPPPPPPPP!nPP!v#v#|$`#|$c$f$j$nP%VPPP!v%Y%^%a%{&O%a&R&U&X&_&b%aP&e&{&e'O'RPP']'a'g'm's'y(XPPPPPPPP(_)e*X+c,VUaObcR#e!c!{ROPQSTUXY_bcdehknrtvz!O!U!W!_!b!c!f!h!k!l!s!u!|#Q#R#S#W#c#k#p#x#{$Z$]QmPR!qnqfPQThknrtv!k!l!s!u#R#k#pR!gdR!ieTlPnTjPnSiPnSqQvQ{TQ!mkQ!trQ!vtR#y#RR!nkTsQvR!wt!RWOSUXY_bcz!O!U!W!_!b!c!|#Q#S#W#c#x#{$Z$]RySR#t!|R|TR|UQ!PUR#|#SR#z#RR#z#SyZOSU_bcz!O!_!b!c!|#Q#S#W#c#x#{$Z$]R!VXR!XYa]O^abc!a!c!eT!da!eQnPR!rnQvQR!{vQ!}yR#u!}Q#T|R#}#TW^Obc!cS!^^!aT!aa!eQ!eaR#f!eW`Obc!cQxSS}U#SQ!`_Q#PzQ#V!OQ#b!_Q#d!bQ#s!|Q#w#QQ$P#WQ$V#cQ$Y#xQ$[#{Q$a$ZR$b$]xZOSU_bcz!O!_!b!c!|#Q#S#W#c#x#{$Z$]Q!VXQ!XYQ#[!UR#]!W!QWOSUXY_bcz!O!U!W!_!b!c!|#Q#S#W#c#x#{$Z$]pfPQThknrtv!k!l!s!u#R#k#pQ!gdQ!ieQ#g!fR#h!hSgPn^pQTkrtv#RQ!jhQ#i!kQ#j!lQ#n!sQ#o!uQ$W#kR$X#pQuQR!zv",nodeNames:"⚠ DirectiveEnd DocEnd - - ? ? ? Literal QuotedLiteral Anchor Alias Tag BlockLiteralContent Comment Stream BOM Document ] [ FlowSequence Item Tagged Anchored Anchored Tagged FlowMapping Pair Key : Pair , } { FlowMapping Pair Pair BlockSequence Item Item BlockMapping Pair Pair Key Pair Pair BlockLiteral BlockLiteralHeader Tagged Anchored Anchored Tagged Directive DirectiveName DirectiveContent Document",maxTerm:74,context:lk,nodeProps:[["isolate",-3,8,9,14,""],["openedBy",18,"[",32,"{"],["closedBy",19,"]",33,"}"]],propSources:[mk],skippedNodes:[0],repeatNodeCount:6,tokenData:"-Y~RnOX#PXY$QYZ$]Z]#P]^$]^p#Ppq$Qqs#Pst$btu#Puv$yv|#P|}&e}![#P![!]'O!]!`#P!`!a'i!a!}#P!}#O*g#O#P#P#P#Q+Q#Q#o#P#o#p+k#p#q'i#q#r,U#r;'S#P;'S;=`#z<%l?HT#P?HT?HU,o?HUO#PQ#UU!WQOY#PZp#Ppq#hq;'S#P;'S;=`#z<%lO#PQ#kTOY#PZs#Pt;'S#P;'S;=`#z<%lO#PQ#}P;=`<%l#P~$VQ!f~XY$Qpq$Q~$bO!g~~$gS^~OY$bZ;'S$b;'S;=`$s<%lO$b~$vP;=`<%l$bR%OX!WQOX%kXY#PZ]%k]^#P^p%kpq#hq;'S%k;'S;=`&_<%lO%kR%rX!WQ!VPOX%kXY#PZ]%k]^#P^p%kpq#hq;'S%k;'S;=`&_<%lO%kR&bP;=`<%l%kR&lUoP!WQOY#PZp#Ppq#hq;'S#P;'S;=`#z<%lO#PR'VUmP!WQOY#PZp#Ppq#hq;'S#P;'S;=`#z<%lO#PR'p[!PP!WQOY#PZp#Ppq#hq{#P{|(f|}#P}!O(f!O!R#P!R![)p![;'S#P;'S;=`#z<%lO#PR(mW!PP!WQOY#PZp#Ppq#hq!R#P!R![)V![;'S#P;'S;=`#z<%lO#PR)^U!PP!WQOY#PZp#Ppq#hq;'S#P;'S;=`#z<%lO#PR)wY!PP!WQOY#PZp#Ppq#hq{#P{|)V|}#P}!O)V!O;'S#P;'S;=`#z<%lO#PR*nUcP!WQOY#PZp#Ppq#hq;'S#P;'S;=`#z<%lO#PR+XUbP!WQOY#PZp#Ppq#hq;'S#P;'S;=`#z<%lO#PR+rUqP!WQOY#PZp#Ppq#hq;'S#P;'S;=`#z<%lO#PR,]UpP!WQOY#PZp#Ppq#hq;'S#P;'S;=`#z<%lO#PR,vU`P!WQOY#PZp#Ppq#hq;'S#P;'S;=`#z<%lO#P",tokenizers:[hk,ck,pk,gk,0,1],topRules:{Stream:[0,15]},tokenPrec:0}),vk=Fn.define({name:"yaml",parser:bk.configure({props:[Tf.add({Stream:t=>{for(let e=t.node.resolve(t.pos,-1);e&&e.to>=t.pos;e=e.parent){if(e.name=="BlockLiteralContent"&&e.from<e.to)return t.baseIndentFor(e);if(e.name=="BlockLiteral")return t.baseIndentFor(e)+t.unit;if(e.name=="BlockSequence"||e.name=="BlockMapping")return t.column(e.firstChild.from,1);if(e.name=="QuotedLiteral")return null;if(e.name=="Literal"){let i=t.column(e.from,1);if(i==t.lineIndent(e.from,1))return i;if(e.to>t.pos)return null}}return null},FlowMapping:Lc({closing:"}"}),FlowSequence:Lc({closing:"]"})}),_f.add({"FlowMapping FlowSequence":py,"Item Pair BlockLiteral":(t,e)=>({from:e.doc.lineAt(t.from).to,to:t.to})})]}),languageData:{commentTokens:{line:"#"},indentOnInput:/^\s*[\]\}]$/}});function yk(){return new sy(vk)}const xk="#e5c07b",kd="#e06c75",wk="#56b6c2",kk="#ffffff",yn="#abb2bf",cl="#7d8799",Sk="#61afef",Ck="#98c379",Sd="#d19a66",$k="#c678dd",Ok="#21252b",Cd="#2c313a",$d="#282c34",ha="#353a42",Ak="#3E4451",Od="#528bff",Pk=L.theme({"&":{color:yn,backgroundColor:$d},".cm-content":{caretColor:Od},".cm-cursor, .cm-dropCursor":{borderLeftColor:Od},"&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":{backgroundColor:Ak},".cm-panels":{backgroundColor:Ok,color:yn},".cm-panels.cm-panels-top":{borderBottom:"2px solid black"},".cm-panels.cm-panels-bottom":{borderTop:"2px solid black"},".cm-searchMatch":{backgroundColor:"#72a1ff59",outline:"1px solid #457dff"},".cm-searchMatch.cm-searchMatch-selected":{backgroundColor:"#6199ff2f"},".cm-activeLine":{backgroundColor:"#6699ff0b"},".cm-selectionMatch":{backgroundColor:"#aafe661a"},"&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket":{backgroundColor:"#bad0f847"},".cm-gutters":{backgroundColor:$d,color:cl,border:"none"},".cm-activeLineGutter":{backgroundColor:Cd},".cm-foldPlaceholder":{backgroundColor:"transparent",border:"none",color:"#ddd"},".cm-tooltip":{border:"none",backgroundColor:ha},".cm-tooltip .cm-tooltip-arrow:before":{borderTopColor:"transparent",borderBottomColor:"transparent"},".cm-tooltip .cm-tooltip-arrow:after":{borderTopColor:ha,borderBottomColor:ha},".cm-tooltip-autocomplete":{"& > ul > li[aria-selected]":{backgroundColor:Cd,color:yn}}},{dark:!0}),Tk=Dr.define([{tag:k.keyword,color:$k},{tag:[k.name,k.deleted,k.character,k.propertyName,k.macroName],color:kd},{tag:[k.function(k.variableName),k.labelName],color:Sk},{tag:[k.color,k.constant(k.name),k.standard(k.name)],color:Sd},{tag:[k.definition(k.name),k.separator],color:yn},{tag:[k.typeName,k.className,k.number,k.changed,k.annotation,k.modifier,k.self,k.namespace],color:xk},{tag:[k.operator,k.operatorKeyword,k.url,k.escape,k.regexp,k.link,k.special(k.string)],color:wk},{tag:[k.meta,k.comment],color:cl},{tag:k.strong,fontWeight:"bold"},{tag:k.emphasis,fontStyle:"italic"},{tag:k.strikethrough,textDecoration:"line-through"},{tag:k.link,color:cl,textDecoration:"underline"},{tag:k.heading,fontWeight:"bold",color:kd},{tag:[k.atom,k.bool,k.special(k.variableName)],color:Sd},{tag:[k.processingInstruction,k.string,k.inserted],color:Ck},{tag:k.invalid,color:kk}]),Mk=[Pk,Hf(Tk)];var Ek=Object.defineProperty,_k=Object.getOwnPropertyDescriptor,ch=(t,e,i,s)=>{for(var r=s>1?void 0:s?_k(e,i):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(s?o(e,i,r):o(r))||r);return s&&r&&Ek(e,i,r),r};function dl(t){if(!t.includes("external_components:")||!t.includes("type: local")||!t.includes("/opt/esp-tree/components"))return!1;const e=t.match(/components:\s*\[([^\]]*)\]/);if(!e)return!1;const i=e[1];return!(!i.includes("esp_tree_common")||!i.includes("esp_tree_remote")&&!i.includes("esp_tree_bridge")&&!i.includes("espnow_82xx_remote"))}function Ad(t){const e=[];return/(^|\s)!include\s/m.test(t)&&e.push("This config uses !include which is not supported. ESPHome compile will fail — only single-file configs are allowed."),/(^|\s)packages:/m.test(t)&&e.push("This config uses packages: which is not supported in V1. Each device must be a single YAML file."),dl(t)||e.push("ESP-Tree external components are not configured. See the required configuration when saving or compiling."),e}let Cr=class extends pe{constructor(){super(...arguments),this.value="",this.readonly=!1,this.editorView=null,this._resizeObserver=null}disconnectedCallback(){this.destroyEditor(),super.disconnectedCallback()}destroyEditor(){this._resizeObserver&&(this._resizeObserver.disconnect(),this._resizeObserver=null),this.editorView&&(this.editorView.destroy(),this.editorView=null)}initEditor(){var i;this.destroyEditor();const t=(i=this.shadowRoot)==null?void 0:i.querySelector(".editor-container");if(!t)return;const e=J.create({doc:this.value,extensions:[D1,yk(),Mk,J.readOnly.of(this.readonly),L.updateListener.of(s=>{s.docChanged&&(this.value=s.state.doc.toString(),this.dispatchEvent(new CustomEvent("content-change",{detail:{content:this.value,warnings:Ad(this.value)},bubbles:!0,composed:!0})))})]});this.editorView=new L({state:e,parent:t}),this._resizeObserver=new ResizeObserver(()=>{var s;(s=this.editorView)==null||s.requestMeasure()}),this._resizeObserver.observe(t)}updated(t){t.has("readonly")?this.initEditor():this.editorView&&t.has("value")&&!t.get("value")&&this.initEditor()}firstUpdated(){this.initEditor()}getContent(){var t;return((t=this.editorView)==null?void 0:t.state.doc.toString())??this.value}getWarnings(){return Ad(this.getContent())}render(){return p`<div class="editor-container"></div>`}};Cr.styles=de`
    :host {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
      min-width: 0;
      max-width: 100%;
      border: 1px solid var(--line);
      border-radius: var(--radius-lg);
      overflow: hidden;
      overflow: clip;
    }
    .editor-container {
      min-height: 0;
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
      background: #282c34;
    }
    .editor-container .cm-editor {
      flex: 1;
      min-height: 0;
      max-width: 100%;
    }
    .editor-container .cm-editor .cm-scroller {
      font-family: var(--font-mono);
      font-size: 13px;
      line-height: 1.5;
      overflow: auto;
    }
  `;ch([ie({type:String})],Cr.prototype,"value",2);ch([ie({type:Boolean})],Cr.prototype,"readonly",2);Cr=ch([Se("esp-config-editor")],Cr);const Dk="modulepreload",Bk=function(t,e){return new URL(t,e).href},Pd={},Yp=function(e,i,s){let r=Promise.resolve();if(i&&i.length>0){let o=function(c){return Promise.all(c.map(d=>Promise.resolve(d).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};const a=document.getElementsByTagName("link"),l=document.querySelector("meta[property=csp-nonce]"),h=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));r=o(i.map(c=>{if(c=Bk(c,s),c in Pd)return;Pd[c]=!0;const d=c.endsWith(".css"),u=d?'[rel="stylesheet"]':"";if(!!s)for(let m=a.length-1;m>=0;m--){const y=a[m];if(y.href===c&&(!d||y.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${c}"]${u}`))return;const g=document.createElement("link");if(g.rel=d?"stylesheet":Dk,d||(g.as="script"),g.crossOrigin="",g.href=c,h&&g.setAttribute("nonce",h),document.head.appendChild(g),d)return new Promise((m,y)=>{g.addEventListener("load",m),g.addEventListener("error",()=>y(new Error(`Unable to preload CSS for ${c}`)))})}))}function n(o){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=o,window.dispatchEvent(a),!a.defaultPrevented)throw o}return r.then(o=>{for(const a of o||[])a.status==="rejected"&&n(a.reason);return e().catch(n)})},Rk=["ESP32-C61","ESP32-C6","ESP32-C5","ESP32-C3","ESP32-C2","ESP32-H2","ESP32-P4","ESP32-S3","ESP32-S2","ESP8266","ESP32"],Lk={baudRate:115200,bufferSize:8192};function Rs(){return typeof window<"u"&&window.isSecureContext&&"serial"in navigator}function dh(t){if(!t)return null;const e=t.trim().toUpperCase().replace(/\s+/g,"");for(const i of Rk)if(e.includes(i)||e.includes(i.replace(/-/g,"")))return i;return null}async function Ik(){if(!Rs()||!navigator.serial)return[];try{return await navigator.serial.getPorts()}catch{return[]}}async function Fk(){return(await Ik()).filter(e=>{try{return!!e.getInfo().usbVendorId}catch{return!1}})}async function Nk(){if(!navigator.serial)throw new Error("Web Serial is not available in this browser.");try{return await navigator.serial.requestPort()}catch(t){if(t instanceof DOMException&&t.name==="NotFoundError")return"cancelled";throw t}}async function to(t={}){if(!Rs()||!navigator.serial)throw new Error("Web Serial is not available in this browser.");if(!t.forcePicker){const e=await Fk();if(e.length===1)return e[0]}return Nk()}async function ul(t){const{Transport:e,ESPLoader:i}=await Yp(async()=>{const{Transport:r,ESPLoader:n}=await import("./index-CGvrLfvp.js");return{Transport:r,ESPLoader:n}},[],import.meta.url),s=new e(t,!0);try{const r=new i({transport:s,baudrate:115200,terminal:{clean:()=>{},writeLine:()=>{},write:()=>{}},debugLogging:!1}),n=String(await r.main());return{detected:n,family:dh(n)}}finally{try{await s.disconnect()}catch{}}}async function uh(t){if(!Rs())throw new Error("Browser USB flashing needs Chrome or Edge on a secure HTTPS page.");let e=t.port??null;if(!e){const l=await to();if(l==="cancelled")return"cancelled";e=l}await Yp(()=>import("./install-dialog-Cis2fojf.js"),__vite__mapDeps([0,1]),import.meta.url),e.readable===null&&await e.open(Lk);const i=document.createElement("ewt-install-dialog");i.port=e,i.manifestPath=t.manifestUrl;let s=!1,r=!1,n=null;const o=()=>{n==null||n.disconnect(),n=null};return(()=>{t.onFinished&&(n=new MutationObserver(()=>{var h;const l=i.getAttribute("state");if(l==="INSTALL"){s=!0;return}s&&!r&&(l==="DASHBOARD"||l==="PROVISION")&&(r=!0,(h=t.onFinished)==null||h.call(t))}),n.observe(i,{attributes:!0,attributeFilter:["state"]}))})(),i.addEventListener("closed",()=>{var l;o(),e.close().catch(()=>{}),(l=t.onClosed)==null||l.call(t)},{once:!0}),document.body.appendChild(i),"opened"}var Uk=Object.defineProperty,Hk=Object.getOwnPropertyDescriptor,ue=(t,e,i,s)=>{for(var r=s>1?void 0:s?Hk(e,i):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(s?o(e,i,r):o(r))||r);return s&&r&&Uk(e,i,r),r};const Wk=new Set(["queued","starting","announcing","transferring","verifying","transfer_success_waiting_rejoin"]),zk=new Set(["success","failed","aborted","rejoin_timeout","version_mismatch"]);function qk(t){const e=t||"";if(/^\s*esp8266\s*:/m.test(e))return"ESP8266";if(!/^\s*esp32\s*:/m.test(e))return null;const i=e.match(/^\s*variant\s*:\s*["']?([A-Za-z0-9_-]+)["']?\s*$/m),s=((i==null?void 0:i[1])||"").toUpperCase().replace(/_/g,"-");return s?s.includes("ESP32-C61")?"ESP32-C61":s.includes("ESP32-C6")?"ESP32-C6":s.includes("ESP32-C5")?"ESP32-C5":s.includes("ESP32-C3")?"ESP32-C3":s.includes("ESP32-C2")?"ESP32-C2":s.includes("ESP32-H2")?"ESP32-H2":s.includes("ESP32-P4")?"ESP32-P4":s.includes("ESP32-S3")?"ESP32-S3":s.includes("ESP32-S2")?"ESP32-S2":"ESP32":"ESP32"}let re=class extends pe{constructor(){super(...arguments),this.mac="",this.state="loading",this.device=null,this.config=null,this.editorContent="",this.saveIndicator="",this.hasUnsavedChanges=!1,this.error="",this.compilePhase="idle",this.topology=[],this.compileJobId=null,this.compileQueuePosition=null,this.preflight=null,this.chipUnknown=!1,this.yamlWarnings=[],this.showExternalComponentsFix=!1,this.showSecretsWarning=!1,this.missingSecrets=[],this.pendingAction=null,this.pendingAutoFlash=!1,this.showCompileLog=!0,this.compileStartedAt=null,this.flashIntent="none",this.browserFlashManifestUrl="",this.browserFlashError="",this.browserFlashOpen=!1,this.browserFlashFirmwareBlobUrl="",this.elapsedTimer=null,this.pollTimer=null,this.devicePollTimer=null}connectedCallback(){super.connectedCallback(),this.load()}disconnectedCallback(){this.stopPolling(),this.stopDevicePolling(),super.disconnectedCallback()}startPolling(){this.pollTimer||(this.pollTimer=setInterval(()=>this.pollCompileStatus(),2e3))}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}stopCompileLogViewer(){this.compileLogViewer&&(this.compileLogViewer.stopped=!0)}startDevicePolling(){this.devicePollTimer||(this.devicePollTimer=setInterval(()=>void this.pollDevice(),3e4))}stopDevicePolling(){this.devicePollTimer&&(clearInterval(this.devicePollTimer),this.devicePollTimer=null)}async pollDevice(){try{const t=await S.device(this.mac);this.device=t||{}}catch{}}get isCompilingActive(){return this.compilePhase==="compiling"||this.compilePhase==="compile_queued"}get browserSupportsUsbFlash(){return Rs()}get browserFlashChipFamily(){var e,i;const t=String(((e=this.preflight)==null?void 0:e.chip.new)||((i=this.device)==null?void 0:i.chip_name)||"");return qk(this.editorContent)||dh(t)}getElapsedTime(){if(!this.compileStartedAt)return"00:00";const t=Math.floor((Date.now()-this.compileStartedAt)/1e3),e=Math.floor(t/60).toString().padStart(2,"0"),i=(t%60).toString().padStart(2,"0");return`${e}:${i}`}startElapsedTimer(){this.stopElapsedTimer(),this.elapsedTimer=setInterval(()=>this.requestUpdate(),1e3)}stopElapsedTimer(){this.elapsedTimer&&(clearInterval(this.elapsedTimer),this.elapsedTimer=null)}async load(){this.state="loading";try{const[t,e,i]=await Promise.all([S.device(this.mac).catch(()=>null),S.getConfig(this.mac).catch(()=>null),S.topology().catch(()=>[])]);this.device=t||{},this.topology=i,this.startDevicePolling(),e&&e.has_config?(this.config=e,this.editorContent=this.config.content,this.hasUnsavedChanges=!1,this.state="editor"):this.state="no_config",await this.pollCompileStatus()}catch{this.state="no_config"}}clearBrowserFlashManifestUrl(){this.browserFlashManifestUrl&&(URL.revokeObjectURL(this.browserFlashManifestUrl),this.browserFlashManifestUrl=""),this.browserFlashFirmwareBlobUrl&&(URL.revokeObjectURL(this.browserFlashFirmwareBlobUrl),this.browserFlashFirmwareBlobUrl="")}async updateBrowserFlashManifestUrl(){var e,i,s,r;if(this.compilePhase!=="compiled")return;const t=this.browserFlashChipFamily;if(!t){this.clearBrowserFlashManifestUrl();return}try{const n=S.downloadFactoryBinary(this.mac),o=await fetch(n);if(!o.ok){this.clearBrowserFlashManifestUrl();return}const a=await o.blob(),l=URL.createObjectURL(a),h={name:String(((e=this.device)==null?void 0:e.esphome_name)||((i=this.device)==null?void 0:i.label)||this.mac),version:String(((s=this.device)==null?void 0:s.project_version)||((r=this.device)==null?void 0:r.firmware_version)||"compiled"),new_install_prompt_erase:!1,new_install_improv_wait_time:0,builds:[{chipFamily:t,parts:[{path:l,offset:0}]}]},c=new Blob([JSON.stringify(h)],{type:"application/json"}),d=URL.createObjectURL(c);this.clearBrowserFlashManifestUrl(),this.browserFlashManifestUrl=d,this.browserFlashFirmwareBlobUrl=l}catch{this.clearBrowserFlashManifestUrl()}}async pollCompileStatus(){try{const t=await S.getCompileStatus(this.mac);t.status==="compile_queued"?(this.compilePhase="compile_queued",this.compileJobId=t.job_id,this.compileQueuePosition=t.queue_position,this.startPolling()):t.status==="compiling"?(this.compilePhase="compiling",this.compileJobId=t.job_id,this.compileQueuePosition=null,this.startPolling()):Wk.has(t.status)?(this.compilePhase="queued_for_flash",this.compileJobId=t.job_id,this.compileQueuePosition=t.queue_position,this.flashIntent="ota",this.startPolling(),window.location.hash=`/device/${encodeURIComponent(this.mac)}`):t.status==="compiled"?(this.compilePhase="compiled",this.compileJobId=t.job_id,this.compileQueuePosition=null,this.stopElapsedTimer(),this.updateBrowserFlashManifestUrl(),this.stopPolling(),this.flashIntent==="ota"&&(window.location.hash=`/device/${encodeURIComponent(this.mac)}`)):zk.has(t.status)&&(this.compilePhase="idle",this.compileJobId=null,this.compileQueuePosition=null,this.compileStartedAt=null,this.flashIntent="none",this.clearBrowserFlashManifestUrl(),this.stopElapsedTimer(),this.stopPolling(),this.stopCompileLogViewer())}catch{}}async createScaffold(){try{const t=await S.saveConfig(this.mac,"",!0);this.config=t,this.editorContent=t.content,this.chipUnknown=t.chip_unknown??!1,this.state="editor"}catch(t){this.error=t instanceof Error?t.message:String(t)}}async importYaml(){const t=document.createElement("input");t.type="file",t.accept=".yaml,.yml",t.onchange=async()=>{var i;const e=(i=t.files)==null?void 0:i[0];if(e)try{const s=await S.importConfig(this.mac,e);this.config=s,this.editorContent=s.content,this.state="editor"}catch(s){this.error=s instanceof Error?s.message:String(s)}},t.click()}async saveConfig(t=!1){if(!t&&!dl(this.editorContent)){this.pendingAction="save",this.showExternalComponentsFix=!0;return}this.saveIndicator="Saving...";try{const e=await S.saveConfig(this.mac,this.editorContent);this.config=e,this.hasUnsavedChanges=!1,this.saveIndicator="Saved",setTimeout(()=>{this.saveIndicator="",this.requestUpdate()},2e3)}catch(e){this.saveIndicator="",this.error=e instanceof Error?e.message:String(e)}}onEditorChange(t){const e=t.detail;this.editorContent=e.content,this.yamlWarnings=e.warnings??[],this.hasUnsavedChanges=this.config?this.editorContent!==this.config.content:!0}get isBridgeDevice(){var t;return!!((t=this.device)!=null&&t.is_bridge)}get isEsp8266Device(){var e;const t=String(((e=this.device)==null?void 0:e.chip_name)??"");return t==="ESP8266"||t==="ESP-01"||t==="ESP-12E"}get remoteComponentName(){return this.isBridgeDevice?"esp_tree_bridge":this.isEsp8266Device?"espnow_82xx_remote":"esp_tree_remote"}get externalComponentsFixYaml(){return`external_components:
  - source:
      type: local
      path: /opt/esp-tree/components
    components: [${this.remoteComponentName}, esp_tree_common]`}insertExternalComponentsFix(){const e=`
external_components:
  - source:
      type: local
      path: /opt/esp-tree/components
    components: [${this.remoteComponentName}, esp_tree_common]
`;let i=this.editorContent;i=this.removeExternalComponentsBlock(i);const s=i.split(`
`);let r=this.findBlockEnd(s,/^esphome:\s*$/);r<0&&(r=0);const n=this.findBlockEnd(s,/^(esp32|esp8266):\s*$/,r);for(n>r&&(r=n);r<s.length&&s[r].trim()==="";)r++;s.splice(r,0,...e.split(`
`)),this.editorContent=s.join(`
`)}removeExternalComponentsBlock(t){const e=t.split(`
`),i=e.findIndex(r=>/^external_components:\s*$/.test(r));if(i<0)return t;let s=i+1;for(;s<e.length&&(e[s].startsWith(" ")||e[s].startsWith("	")||e[s].trim()==="")&&!(e[s].trim()===""&&s+1<e.length&&!e[s+1].startsWith(" ")&&!e[s+1].startsWith("	"));)s++;for(;s<e.length&&e[s].trim()==="";)s++;return e.splice(i,s-i),e.join(`
`)}findBlockEnd(t,e,i=0){const s=t.findIndex((n,o)=>o>=i&&e.test(n));if(s<0)return-1;let r=s+1;for(;r<t.length&&(t[r].startsWith(" ")||t[r].startsWith("	"));)r++;return r}async applyExternalComponentsFix(){this.showExternalComponentsFix=!1,this.insertExternalComponentsFix(),this.yamlWarnings=[],this.hasUnsavedChanges=!0,this.requestUpdate();const t=this.pendingAction,e=this.pendingAutoFlash;this.pendingAction=null,this.pendingAutoFlash=!1,t==="save"?await this.saveConfig(!0):t==="compile"&&await this.queueCompile(e,!0)}async dismissExternalComponentsFix(){this.showExternalComponentsFix=!1;const t=this.pendingAction,e=this.pendingAutoFlash;this.pendingAction=null,this.pendingAutoFlash=!1,t==="save"?await this.saveConfig(!0):t==="compile"&&await this.queueCompile(e,!0)}async dismissSecretsWarning(){this.showSecretsWarning=!1;const t=this.pendingAction,e=this.pendingAutoFlash;this.pendingAction=null,this.pendingAutoFlash=!1,t==="compile"&&await this.queueCompile(e,!0)}goToSecretsFromWarning(){this.showSecretsWarning=!1,this.goToSecrets()}async checkForMissingSecrets(){try{return(await S.checkSecrets(this.editorContent)).missing_secrets}catch{return[]}}async queueCompile(t,e=!1){if(!(this.compilePhase==="compiling"||this.compilePhase==="compile_queued")){if(!e){const i=await this.checkForMissingSecrets();if(i.length>0){this.missingSecrets=i,this.pendingAction="compile",this.pendingAutoFlash=t,this.showSecretsWarning=!0;return}}if(!e&&!dl(this.editorContent)){this.pendingAction="compile",this.pendingAutoFlash=t,this.showExternalComponentsFix=!0;return}this.hasUnsavedChanges&&await this.saveConfig(!0),this.compilePhase="compiling",this.compileStartedAt=Date.now(),this.startElapsedTimer(),this.error="",this.showCompileLog=!0;try{const i=await S.compileDevice(this.mac,t);this.compileJobId=i.job.id,this.preflight=i.preflight||null,i.job.status==="compile_queued"?(this.compilePhase="compile_queued",this.compileQueuePosition=i.queue_position):i.job.status==="compiling"&&(this.compilePhase="compiling",this.compileQueuePosition=null),this.startPolling()}catch(i){this.compilePhase="failed",this.compileStartedAt=null,this.stopElapsedTimer(),this.error=i instanceof Error?i.message:String(i)}}}async triggerCompile(){this.flashIntent="none",await this.queueCompile(!1)}async triggerOtaFlash(){this.flashIntent="ota",await this.queueCompile(!0)}async triggerBrowserFlashFlow(){this.flashIntent="browser",await this.queueCompile(!1)}async openBrowserFlash(){if(this.browserFlashManifestUrl){this.browserFlashError="";try{if(await uh({manifestUrl:this.browserFlashManifestUrl,onClosed:()=>this.onBrowserFlashClosed()})==="cancelled"){this.browserFlashError="No USB device was selected.";return}this.browserFlashOpen=!0}catch(t){this.browserFlashError=t instanceof Error?t.message:String(t)}}}onBrowserFlashClosed(){this.browserFlashOpen=!1}async cancelCompile(){try{await S.cancelCompile(this.mac)}catch{}this.compilePhase="idle",this.compileJobId=null,this.compileQueuePosition=null,this.compileStartedAt=null,this.flashIntent="none",this.clearBrowserFlashManifestUrl(),this.stopElapsedTimer(),this.stopPolling()}goToSecrets(){window.location.hash=`/secrets?from=${encodeURIComponent(window.location.hash)}`}updated(t){(t.has("compilePhase")||t.has("device")||t.has("preflight"))&&this.updateBrowserFlashManifestUrl()}render(){var h,c,d,u,f;const t=String(((h=this.device)==null?void 0:h.esphome_name)||((c=this.device)==null?void 0:c.label)||this.mac),e=String(((d=this.device)==null?void 0:d.chip_name)||"-"),i=this.topology.find(g=>Z(g.mac)===Z(this.mac)),s=(i==null?void 0:i.online)??!!((u=this.device)!=null&&u.online),r=this.device,n=!!(r!=null&&r.is_bridge),o=!n&&((r==null?void 0:r.hops)??0)>0,a=this.browserFlashChipFamily,l=this.compilePhase==="compiled"&&!!this.browserFlashManifestUrl;return p`
      <div class="config-page" data-job-id=${this.compileJobId??""}>
        ${this.showExternalComponentsFix?p`
              <div class="ec-fix-backdrop" @click=${this.dismissExternalComponentsFix}>
                <div class="ec-fix-modal" @click=${g=>g.stopPropagation()}>
                  <h3>Add ESP Tree's external components?</h3>
                  <p>This YAML is missing the <code>external_components</code> block that ESP Tree remotes need to compile:</p>
                  <pre class="ec-fix-snippet">${this.externalComponentsFixYaml}</pre>

                  <div class="ec-fix-actions">
                    <button class="btn primary" @click=${this.applyExternalComponentsFix}>Add the block</button>
                    <button class="btn" @click=${this.dismissExternalComponentsFix}>Cancel</button>
                  </div>
                </div>
              </div>
            `:v}
        ${this.showSecretsWarning?p`
              <div class="ec-fix-backdrop" @click=${this.dismissSecretsWarning}>
                <div class="ec-fix-modal" @click=${g=>g.stopPropagation()}>
                  <h3>Some secrets are missing</h3>
                  <p>This YAML references secrets that aren't defined in secrets.yaml, so the build will fail:</p>
                  <ul class="missing-secrets-list">
                    ${this.missingSecrets.map(g=>p`<li><code>!secret ${g}</code></li>`)}
                  </ul>

                  <div class="ec-fix-actions">
                    <button class="btn" @click=${this.dismissSecretsWarning}>Compile anyway</button>
                    <button class="btn primary" @click=${this.goToSecretsFromWarning}>${C("key")}Edit secrets</button>
                  </div>
                </div>
              </div>
            `:v}
        <div>
          <nav class="crumbs" aria-label="Breadcrumb">
            <a href="#/">Network</a>${C("chevronRight")}
            <a href=${`#/device/${encodeURIComponent(this.mac)}`}>${t}</a>${C("chevronRight")}
            <span aria-current="page">YAML</span>
          </nav>
          <div class="page-head">
            <div>
              <h1>${t}</h1>
              <p class="sub meta">
                <span class="chip ${s?"ok":"danger"}"><span class="dot ${s?"ok":"danger"}"></span>${s?"Online":"Offline"}</span>
                <span>${o?"Remote":n?"Bridge":"Device"}</span>
                <span class="mono">${this.mac}</span>
                <span>${e}</span>
              </p>
            </div>
            <div class="page-actions">
              <button class="btn" @click=${this.goToSecrets}>${C("key")}Secrets</button>
            </div>
          </div>
        </div>

        ${this.state==="loading"?p`<div class="card loading"><span class="spinner"></span>Loading configuration…</div>`:this.state==="no_config"?p`
                <div class="card no-config empty">
                  ${this.chipUnknown?p`
                    <div class="chip-error-banner">
                      ${C("alert")}<span>This remote reported a chip type ESP Tree can't build for. Check the chip before compiling.</span>
                      <button class="btn sm icon text" aria-label="Dismiss" @click=${()=>{this.chipUnknown=!1}}>${C("close")}</button>
                    </div>
                  `:v}
                  ${C("code")}
                  <strong>No YAML for this remote yet</strong>
                  <p>Start from a scaffold filled in from what the bridge knows about this remote, or import an existing ESPHome YAML file.</p>
                  <div class="no-config-actions">
                    <button class="btn primary" @click=${this.createScaffold}>Create from scaffold</button>
                    <button class="btn" @click=${this.importYaml}>${C("upload")}Import YAML</button>
                  </div>
                  ${this.error?p`<p class="error">${this.error}</p>`:v}
                </div>
              `:this.state==="editor"?p`
                    <div class="main-content">
                    ${this.isCompilingActive?p`
                          <div class="compile-focus-view">
                            <div class="compile-status-header">
                              <span class="spinner"></span>
                              <span>${this.compilePhase==="compile_queued"?`Queued at position ${this.compileQueuePosition!==null?this.compileQueuePosition:"?"}`:"Building firmware…"}</span>
                              <span class="compile-elapsed">${this.getElapsedTime()}</span>
                            </div>
                            <esp-compile-log-viewer
                              .mac=${this.mac}
                              .visible=${!0}
                              class="expanded-log"
                            ></esp-compile-log-viewer>
                          </div>
                        `:p`
                          <esp-config-editor
                            .value=${this.editorContent}
                            .readonly=${!1}
                            @content-change=${this.onEditorChange}
                          ></esp-config-editor>

                          ${this.yamlWarnings.length>0?p`<div class="notice warn yaml-warnings">${C("alert")}<div>${this.yamlWarnings.map(g=>p`<p>${g}</p>`)}</div></div>`:v}
                        `}
                    </div>

                    <esp-compile-log-viewer
                      .mac=${this.mac}
                      .visible=${(this.compilePhase==="queued_for_flash"||this.compilePhase==="failed")&&this.showCompileLog}
                      class="bottom-log"
                    ></esp-compile-log-viewer>

                    ${this.compilePhase==="compile_queued"?p`
                        <div class="notice warn queue-banner">
                          ${C("clock")}<span><strong>Build queued</strong> · position ${this.compileQueuePosition!==null?this.compileQueuePosition:"?"}. It starts when the current build finishes.</span>
                          <span class="notice-actions"><button class="btn sm" @click=${this.cancelCompile}>Cancel build</button></span>
                        </div>
                      `:v}

                  <div class="action-bar">
                    <span class="save-state ${this.hasUnsavedChanges?"dirty":""}" aria-live="polite">
                      ${this.compilePhase==="compiling"?p`<span class="spinner"></span>Building…`:this.compilePhase==="compile_queued"?p`Build queued (#${this.compileQueuePosition!==null?this.compileQueuePosition:"?"})`:this.compilePhase==="queued_for_flash"?p`Upload queued or running${this.compileQueuePosition!==null?` (#${this.compileQueuePosition})`:""}`:this.saveIndicator||(this.hasUnsavedChanges?"Unsaved changes":p`${C("check")}Saved`)}
                    </span>
                    <span class="bar-actions">
                      <button class="btn" @click=${this.saveConfig} ?disabled=${!this.hasUnsavedChanges||this.compilePhase==="compiling"||this.compilePhase==="compile_queued"}>Save</button>
                      ${this.compilePhase==="idle"||this.compilePhase==="failed"||this.compilePhase==="compiled"?p`
                            <button class="btn" ?disabled=${!this.config} @click=${this.triggerCompile}>${C("build")}Compile</button>
                            <button class="btn" ?disabled=${!this.config} @click=${this.triggerBrowserFlashFlow} title="Compile, then flash a board plugged into this computer">${C("usb")}Compile &amp; flash by USB</button>
                            <button class="btn primary" ?disabled=${!this.config} @click=${this.triggerOtaFlash} title="Compile, then upload over the ESP-NOW mesh">${C("upload")}Compile &amp; install</button>
                          `:this.compilePhase==="compiling"||this.compilePhase==="compile_queued"?p`<button class="btn danger" @click=${this.cancelCompile}>Cancel build</button>`:v}
                    </span>
                  </div>

                  <div class="browser-flash-panel">
                    ${l?p`
                          <div class="browser-flash-actions">
                            <button
                              class="btn primary"
                              ?disabled=${this.browserFlashOpen}
                              @click=${this.openBrowserFlash}
                            >
                              ${C("usb")}${this.browserFlashOpen?"Flashing…":"Flash by USB now"}
                            </button>
                            <a class="btn" href=${S.downloadFactoryBinary(this.mac)} download>Download factory .bin</a>
                          </div>
                          ${this.browserFlashError?p`<p class="browser-flash-error">${this.browserFlashError}</p>`:v}
                        `:p`
                          <div class="browser-flash-hint hint">
                            ${this.compilePhase==="compiled"&&!a?p`<p>Browser USB flash is unavailable because the chip family could not be determined for this build.</p>`:this.browserSupportsUsbFlash?p`<p>USB flashing becomes available here after a successful build.</p>`:p`<p>Browser USB flash requires Chrome or Edge with Web Serial on an HTTPS page.</p>`}
                            <a class="btn" href=${S.downloadFactoryBinary(this.mac)} download ?hidden=${this.compilePhase!=="compiled"}>Download factory .bin</a>
                          </div>
                        `}
                  </div>

                  ${this.error&&this.compilePhase!=="compiling"?p`<div class="notice danger" role="alert">${C("alert")}<span>${this.error}</span></div>`:v}

                  ${this.compilePhase==="compiled"?p`
                        <div class="success-section">
                          <div class="success-banner">${C("checkCircle")}<strong>Build succeeded</strong><span class="build-info">${t} is ready to install</span></div>
                          ${(f=this.preflight)!=null&&f.has_warnings?p`
                                <div class="warnings">
                                  ${this.preflight.warnings.map(g=>p`<p>${g}</p>`)}
                                </div>
                              `:v}
                          ${this.flashIntent==="browser"?p`<p class="hint">Build complete. Connect the device by USB and use the browser flash control above.</p>`:p`<p class="hint">Install it over the air or by USB from the buttons above, or download the binaries.</p>`}
                          <div class="download-links">
                            <a class="btn" href=${S.downloadFactoryBinary(this.mac)} download>Download .bin</a>
                            <a class="btn" href=${S.downloadCompileBinary(this.mac)} download>Download .ota.bin</a>
                          </div>
                        </div>
                      `:v}

                  ${this.compilePhase==="failed"?p`
                        <div class="fail-section">
                          <div class="fail-banner">
                            <span class="fail-title">${C("alert")}Build failed</span>
                            ${this.showCompileLog?p`<button class="close-logs-link" @click=${()=>{this.showCompileLog=!1}}>Hide logs</button>`:p`<button class="close-logs-link" @click=${()=>{this.showCompileLog=!0}}>Show logs</button>`}
                          </div>
                          <p class="hint">Check the log for the first error, fix the YAML above, then compile again.</p>
                        </div>
                      `:v}
                `:v}
      </div>
    `}};re.styles=[Me,de`
    :host { display: block; }
    .config-page { display: grid; gap: 16px; }
    .config-page > *, .main-content > * { min-width: 0; }
    .crumbs svg { width: 14px; height: 14px; color: var(--faint); }
    .meta { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 12px; }
    .page-actions .btn svg, .bar-actions .btn svg, .no-config .btn svg, .ec-fix-actions .btn svg, .browser-flash-actions .btn svg { width: 18px; height: 18px; }
    .loading { display: flex; align-items: center; gap: 12px; padding: 24px 16px; color: var(--muted); }

    .no-config { padding: 48px 16px; }
    .no-config-actions { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-top: 10px; }
    .chip-error-banner {
      display: flex; align-items: center; gap: 10px; width: 100%; max-width: 640px;
      padding: 10px 12px; border-radius: var(--radius-md); background: var(--accent-soft); color: var(--ink); text-align: left;
    }
    .chip-error-banner > svg { width: 20px; height: 20px; color: var(--accent); flex: none; margin: 0; }
    .chip-error-banner span { flex: 1; }

    .main-content { display: grid; gap: 12px; }
    .yaml-warnings p + p { margin-top: 4px; }
    .compile-focus-view { display: grid; gap: 10px; }
    .compile-status-header { display: flex; align-items: center; gap: 10px; font-weight: 500; }
    .compile-elapsed { margin-left: auto; color: var(--muted); font-variant-numeric: tabular-nums; font-weight: 400; }
    .expanded-log { min-height: 420px; }

    .action-bar {
      position: sticky;
      bottom: 0;
      z-index: 5;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
      padding: 12px 16px;
      border: 1px solid var(--line);
      border-radius: var(--radius-lg);
      background: var(--surface);
      box-shadow: var(--shadow-sm);
    }
    .save-state { display: inline-flex; align-items: center; gap: 6px; color: var(--muted); font-size: var(--text-sm); }
    .save-state svg { width: 16px; height: 16px; color: var(--ok); }
    .save-state.dirty { color: var(--accent); font-weight: 500; }
    .save-state .spinner { width: 14px; height: 14px; }
    .bar-actions { display: flex; flex-wrap: wrap; gap: 8px; }

    .browser-flash-panel:empty { display: none; }
    .browser-flash-hint { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
    .browser-flash-actions { display: flex; gap: 8px; flex-wrap: wrap; }
    .browser-flash-error { color: var(--danger); margin-top: 8px; }

    .success-section, .fail-section { display: grid; gap: 10px; padding: 14px 16px; border-radius: var(--radius-lg); }
    .success-section { background: var(--ok-soft); }
    .fail-section { background: var(--danger-soft); }
    .success-banner { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; color: var(--ok); }
    .success-banner svg { width: 22px; height: 22px; }
    .success-banner strong { font-weight: 500; }
    .build-info { color: var(--ink-2); }
    .warnings { display: grid; gap: 4px; color: var(--accent); }
    .download-links { display: flex; gap: 8px; flex-wrap: wrap; }
    .fail-banner { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .fail-title { display: inline-flex; align-items: center; gap: 8px; color: var(--danger); font-weight: 500; }
    .fail-title svg { width: 20px; height: 20px; }
    .close-logs-link, .btn-link {
      border: 0; background: none; padding: 0; color: var(--primary); font: inherit; font-weight: 500; cursor: pointer;
    }
    .close-logs-link:hover, .btn-link:hover { text-decoration: underline; }
    .error { color: var(--danger); }

    .ec-fix-backdrop { position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; padding: 16px; background: var(--scrim); }
    .ec-fix-modal {
      display: grid; gap: 12px; width: min(560px, 100%); max-height: calc(100vh - 32px); overflow: auto;
      padding: 22px; border-radius: var(--radius-lg); background: var(--surface-raised); box-shadow: var(--shadow-md);
    }
    .ec-fix-modal h3 { font-size: var(--text-xl); font-weight: 500; }
    .ec-fix-modal p { color: var(--ink-2); }
    .ec-fix-snippet { margin: 0; padding: 12px 14px; border-radius: var(--radius-md); background: var(--log-bg); color: var(--log-ink); font-family: var(--font-mono); font-size: var(--text-xs); overflow: auto; }
    .missing-secrets-list { margin: 0; padding-left: 20px; }
    .ec-fix-actions { display: flex; justify-content: flex-end; gap: 8px; flex-wrap: wrap; margin-top: 4px; }

    @media (max-width: 760px) {
      .action-bar { position: static; }
      .bar-actions { width: 100%; }
      .bar-actions .btn { flex: 1 1 auto; }
    }
  `];ue([ie({type:String})],re.prototype,"mac",2);ue([b()],re.prototype,"state",2);ue([b()],re.prototype,"device",2);ue([b()],re.prototype,"config",2);ue([b()],re.prototype,"editorContent",2);ue([b()],re.prototype,"saveIndicator",2);ue([b()],re.prototype,"hasUnsavedChanges",2);ue([b()],re.prototype,"error",2);ue([b()],re.prototype,"compilePhase",2);ue([b()],re.prototype,"topology",2);ue([b()],re.prototype,"compileJobId",2);ue([b()],re.prototype,"compileQueuePosition",2);ue([b()],re.prototype,"preflight",2);ue([b()],re.prototype,"chipUnknown",2);ue([b()],re.prototype,"yamlWarnings",2);ue([b()],re.prototype,"showExternalComponentsFix",2);ue([b()],re.prototype,"showSecretsWarning",2);ue([b()],re.prototype,"missingSecrets",2);ue([b()],re.prototype,"showCompileLog",2);ue([b()],re.prototype,"compileStartedAt",2);ue([b()],re.prototype,"flashIntent",2);ue([b()],re.prototype,"browserFlashManifestUrl",2);ue([b()],re.prototype,"browserFlashError",2);ue([b()],re.prototype,"browserFlashOpen",2);ue([vl("esp-compile-log-viewer")],re.prototype,"compileLogViewer",2);re=ue([Se("esp-config-page")],re);var Vk=Object.defineProperty,jk=Object.getOwnPropertyDescriptor,Ls=(t,e,i,s)=>{for(var r=s>1?void 0:s?jk(e,i):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(s?o(e,i,r):o(r))||r);return s&&r&&Vk(e,i,r),r};let xi=class extends pe{constructor(){super(...arguments),this.from="/",this.content="",this.saved=!1,this.loading=!0,this.error=""}connectedCallback(){super.connectedCallback(),this.load()}async load(){this.loading=!0;try{const t=await S.getSecrets();this.content=t.content,this.error=""}catch(t){this.error=t instanceof Error?t.message:String(t)}finally{this.loading=!1}}async save(){this.saved=!1;try{await S.saveSecrets(this.content),this.saved=!0,this.error="",setTimeout(()=>{this.saved=!1,this.requestUpdate()},2e3)}catch(t){this.error=t instanceof Error?t.message:String(t)}}onInput(t){this.content=t.target.value}render(){const t=(this.from||"").replace(/^#/,""),e=t&&t!=="/"?t:"/settings",i=e.startsWith("/device/")?"YAML":e.startsWith("/settings")?"Settings":"Back";return p`
      <div class="page">
        <div>
          <nav class="crumbs" aria-label="Breadcrumb"><a href="#${e}">${i}</a>${C("chevronRight")}<span aria-current="page">Secrets</span></nav>
          <div class="page-head">
            <div>
              <h1>Secrets</h1>
              <p class="sub">WiFi, OTA and ESP-NOW credentials shared by every build. Changes apply to the next compile.</p>
            </div>
          </div>
        </div>
        ${this.loading?p`<div class="card loading" aria-live="polite"><span class="spinner"></span>Loading secrets…</div>`:p`
              <section class="card editor-card">
                <div class="editor-head">
                  <span class="file-label">${C("lock")}secrets.yaml</span>
                  <span class="hint">${this.content.split(`
`).length} lines</span>
                </div>
                <label class="sr-only" for="secrets-editor">Edit secrets.yaml</label>
                <textarea id="secrets-editor" class="secrets-textarea" .value=${this.content} @input=${this.onInput} spellcheck="false" autocomplete="off" aria-describedby="secret-help"></textarea>
                <div class="editor-foot">
                  <span class="hint" id="secret-help">${C("info")}Stored as plain text, protected by Home Assistant sign-in. The bridge and every remote must share the same network ID and PSK.</span>
                  <span class="foot-actions">
                    <span role="status">
                      ${this.saved?p`<span class="saved">${C("check")}Saved</span>`:v}
                      ${this.error?p`<span class="error-text">${this.error}</span>`:v}
                    </span>
                    <button class="btn primary" @click=${this.save} ?disabled=${this.loading}>Save</button>
                  </span>
                </div>
              </section>
            `}
      </div>
    `}};xi.styles=[Me,de`
    :host { display: block; }
    .crumbs svg { width: 14px; height: 14px; color: var(--faint); }
    .loading { display: flex; align-items: center; gap: 12px; padding: 24px 16px; color: var(--muted); }
    .editor-card { overflow: hidden; }
    .editor-head { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 10px 16px; border-bottom: 1px solid var(--line); }
    .file-label { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: var(--text-sm); font-weight: 500; }
    .file-label svg { width: 16px; height: 16px; color: var(--muted); }
    .secrets-textarea {
      display: block; width: 100%; min-height: 420px; padding: 14px 16px; border: 0; border-radius: 0;
      background: var(--surface); color: var(--ink); font-family: var(--font-mono); font-size: var(--text-sm); line-height: 1.6; resize: vertical; tab-size: 2;
    }
    .secrets-textarea:focus { box-shadow: inset 0 0 0 2px var(--primary); }
    .editor-foot { display: flex; justify-content: space-between; align-items: center; gap: 12px 20px; flex-wrap: wrap; padding: 12px 16px; border-top: 1px solid var(--line); }
    .editor-foot .hint { display: inline-flex; gap: 8px; align-items: flex-start; max-width: 70ch; }
    .editor-foot .hint svg { width: 16px; height: 16px; flex: none; margin-top: 2px; }
    .foot-actions { display: flex; align-items: center; gap: 12px; margin-left: auto; }
    .saved { display: inline-flex; align-items: center; gap: 4px; color: var(--ok); font-size: var(--text-sm); font-weight: 500; }
    .saved svg { width: 16px; height: 16px; }
    .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
  `];Ls([ie({type:String})],xi.prototype,"from",2);Ls([b()],xi.prototype,"content",2);Ls([b()],xi.prototype,"saved",2);Ls([b()],xi.prototype,"loading",2);Ls([b()],xi.prototype,"error",2);xi=Ls([Se("esp-secrets-page")],xi);var Qk=Object.defineProperty,Kk=Object.getOwnPropertyDescriptor,Si=(t,e,i,s)=>{for(var r=s>1?void 0:s?Kk(e,i):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(s?o(e,i,r):o(r))||r);return s&&r&&Qk(e,i,r),r};const Xk={compile_queued:"Queued for compile",compiling:"Compiling",compile_success:"Compile success",queued:"Queued for flash",starting:"Starting",announcing:"Waiting for device accept",transferring:"Transferring",verifying:"Verifying",transfer_success_waiting_rejoin:"Waiting for device rejoin",success:"Success",failed:"Failed",aborted:"Aborted",rejoin_timeout:"Rejoin timeout",version_mismatch:"Version mismatch"},Jk=["compile_success","success","failed","aborted","rejoin_timeout","version_mismatch"];let Ut=class extends pe{constructor(){super(...arguments),this.jobId=0,this.from="/queue",this.job=null,this.logData=null,this.error="",this.loading=!0,this.expandedOutput=new Set,this.pollTimer=null}connectedCallback(){super.connectedCallback()}disconnectedCallback(){this.stopPolling(),super.disconnectedCallback()}updated(t){t.has("jobId")&&this.jobId&&(this.loading=!0,this.error="",this.fetchLog())}startPolling(){this.pollTimer||(this.pollTimer=setInterval(()=>this.fetchLog(),2e3))}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}async fetchJob(){var t;if(this.jobId)try{const e=(t=this.logData)==null?void 0:t.mac;if(e){const s=(await S.history(e)).jobs.find(r=>r.id===this.jobId);this.job=s||null}}catch{}}async fetchLog(){var t,e;if(this.jobId)try{this.logData=await S.jobLog(this.jobId),this.loading=!1,!this.job&&((t=this.logData)!=null&&t.mac)&&await this.fetchJob(),(e=this.logData)!=null&&e.is_terminal?this.stopPolling():this.startPolling()}catch(i){this.error=i instanceof Error?i.message:String(i),this.loading=!1,this.stopPolling()}}toggleOutput(t){const e=new Set(this.expandedOutput);e.has(t)?e.delete(t):e.add(t),this.expandedOutput=e}formatEventTime(t){return new Date(t*1e3).toLocaleTimeString()}renderEvent(t,e){const i=this.formatEventTime(t.ts),s=t.type==="compile_output",r=this.expandedOutput.has(e),o={compile_success:"ok",flash_success:"ok",flash_rejoined:"ok",compile_failed:"danger",flash_failed:"danger",flash_aborted:"danger",flash_version_mismatch:"warn",flash_rejoin_timeout:"warn"}[t.type]||"";return p`
      <div class="event ${s?"event-output":""} ${o}">
        <div class="event-header">
          <span class="event-dot" aria-hidden="true"></span>
          <span class="event-time">${i}</span>
          <span class="event-type">${(()=>{const a=t.type.replace(/^(flash|compile)_/,"$1 ").replaceAll("_"," ");return a.charAt(0).toUpperCase()+a.slice(1)})()}</span>
          ${t.percent!=null?p`<span class="event-detail">${t.percent}%</span>`:v}
          ${t.error?p`<span class="event-error">${t.error}</span>`:v}
          ${t.reason?p`<span class="event-detail">${t.reason}</span>`:v}
          ${t.esphome_name?p`<span class="event-detail">${t.esphome_name}</span>`:v}
          ${t.host?p`<span class="event-detail">at ${t.host}</span>`:v}
          ${t.current_build_date?p`<span class="event-detail">running build: ${t.current_build_date}</span>`:v}
          ${t.firmware_name?p`<span class="event-detail">${t.firmware_name}</span>`:v}
          ${t.duration_s!=null?p`<span class="event-detail">took ${yt(t.duration_s)}</span>`:v}
          ${t.current_md5?p`<span class="event-detail">current running firmware MD5: ${t.current_md5}</span>`:v}
          ${t.md5?p`<span class="event-detail">New firmware MD5: ${t.md5}</span>`:v}
          ${t.rejoined_md5&&t.expected_md5?p`<span class="event-detail">running firmware MD5: ${t.rejoined_md5} expected MD5: ${t.expected_md5}</span>`:v}
          ${t.rejoined_md5&&!t.expected_md5?p`<span class="event-detail">running firmware MD5: ${t.rejoined_md5}</span>`:v}
          ${t.expected_md5&&!t.rejoined_md5?p`<span class="event-detail">expected MD5: ${t.expected_md5}</span>`:v}
          ${t.md5_match?p`<span class="chip ${t.md5_match==="match"?"ok":"warn"}">MD5 ${t.md5_match}</span>`:v}
          ${s?p`<button class="btn sm text toggle" aria-expanded=${r?"true":"false"} @click=${()=>this.toggleOutput(e)}>${r?"Hide output":"Show output"}</button>`:v}
        </div>
        ${s&&r?p`<pre class="log compile-output">${t.output||""}</pre>`:v}
      </div>
    `}render(){const t=this.logData,e=this.job,i=(t==null?void 0:t.log_events)||[],s=(t==null?void 0:t.status)||(e==null?void 0:e.status)||"",r=(t==null?void 0:t.is_terminal)??(e?Jk.includes(e.status):!1),n=(e==null?void 0:e.parsed_esphome_name)||(e==null?void 0:e.esphome_name)||(e==null?void 0:e.firmware_name)||"Firmware",o=this.from||"/queue",a=o.startsWith("/device/"),l=Qd(s);return p`
      <div class="page">
        <div>
          <nav class="crumbs" aria-label="Breadcrumb">
            <a href="#${o}">${a?"Device":"Jobs"}</a>${C("chevronRight")}<span aria-current="page">Job ${this.jobId}</span>
          </nav>
          <div class="page-head">
            <div>
              <h1>${n}</h1>
              <p class="sub meta">
                ${s?p`<span class="chip ${l.tone==="neutral"?"":l.tone}">${Xk[s]||l.label}</span>`:v}
                ${r?v:p`<span class="live"><span class="pulse"></span>Live</span>`}
                ${e?p`<a href=${`#/device/${encodeURIComponent(e.mac)}`} class="mono">${e.mac}</a>`:v}
              </p>
            </div>
          </div>
        </div>

        ${this.error?p`<div class="notice danger" role="alert">${C("alert")}<span>${this.error}</span></div>`:v}
        ${e!=null&&e.error_msg?p`<div class="notice danger" role="status">${C("alert")}<span>${e.error_msg}</span><span class="notice-actions"><a class="btn sm" href=${`#/device/${encodeURIComponent(e.mac)}`}>Open device</a></span></div>`:v}

        ${e?p`
          <section class="card">
            <dl class="facts pad">
              <div><dt>Firmware</dt><dd>${e.firmware_name||"—"}</dd></div>
              <div><dt>Size</dt><dd>${Ni(e.firmware_size)}</dd></div>
              <div><dt>Started</dt><dd>${e.started_at?Vi(e.started_at):"—"}</dd></div>
              <div><dt>Finished</dt><dd>${e.completed_at?Vi(e.completed_at):"—"}</dd></div>
              <div><dt>Duration</dt><dd>${e.started_at&&e.completed_at?yt(e.completed_at-e.started_at):"—"}</dd></div>
              ${e.parsed_version?p`<div><dt>Version</dt><dd>${e.old_firmware_version?`${e.old_firmware_version} → `:""}${e.parsed_version}</dd></div>`:v}
            </dl>
          </section>
        `:v}

        <section class="card">
          <div class="card-head"><h2>Events</h2><span class="hint">${i.length} recorded</span></div>
          <div class="timeline">
            ${this.loading?p`<p class="none"><span class="spinner"></span>Loading events…</p>`:i.length===0?p`<p class="none">No events recorded for this job.</p>`:i.map((h,c)=>this.renderEvent(h,c))}
          </div>
        </section>
      </div>
    `}};Ut.styles=[Me,de`
    :host { display: block; }
    .crumbs svg { width: 14px; height: 14px; color: var(--faint); }
    .meta { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 12px; }
    .meta a { color: var(--muted); }
    .live { display: inline-flex; align-items: center; gap: 6px; color: var(--info); font-size: var(--text-sm); font-weight: 500; }
    .pulse { width: 8px; height: 8px; border-radius: 50%; background: var(--info); animation: pulse 1.6s ease-out infinite; }
    @keyframes pulse { 0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--info) 60%, transparent); } 100% { box-shadow: 0 0 0 8px transparent; } }
    .pad { padding: 16px; }
    .none { display: flex; align-items: center; gap: 10px; padding: 16px; color: var(--muted); }
    .timeline { padding: 8px 0; }
    .event { position: relative; padding: 6px 16px 6px 40px; }
    .event::before { content: ''; position: absolute; left: 21px; top: 0; bottom: 0; border-left: 2px solid var(--line); }
    .event:first-child::before { top: 14px; }
    .event:last-child::before { bottom: calc(100% - 14px); }
    .event-dot { position: absolute; left: 16px; top: 10px; width: 12px; height: 12px; border-radius: 50%; background: var(--surface); border: 2px solid var(--line-strong); }
    .event.ok .event-dot { border-color: var(--ok-dot); background: var(--ok-dot); }
    .event.danger .event-dot { border-color: var(--danger); background: var(--danger); }
    .event.warn .event-dot { border-color: var(--accent-fill); background: var(--accent-fill); }
    .event-header { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; }
    .event-time { color: var(--muted); font-size: var(--text-sm); font-variant-numeric: tabular-nums; min-width: 72px; }
    .event-type { font-weight: 500; }
    .event-detail { color: var(--ink-2); font-size: var(--text-sm); overflow-wrap: anywhere; }
    .event-error { color: var(--danger); font-size: var(--text-sm); }
    .event.danger .event-type { color: var(--danger); }
    .compile-output { margin: 8px 0 4px; max-height: 420px; }
  `];Si([ie({type:Number})],Ut.prototype,"jobId",2);Si([ie({type:String})],Ut.prototype,"from",2);Si([b()],Ut.prototype,"job",2);Si([b()],Ut.prototype,"logData",2);Si([b()],Ut.prototype,"error",2);Si([b()],Ut.prototype,"loading",2);Si([b()],Ut.prototype,"expandedOutput",2);Ut=Si([Se("esp-job-page")],Ut);var Yk=Object.defineProperty,Gk=Object.getOwnPropertyDescriptor,Ci=(t,e,i,s)=>{for(var r=s>1?void 0:s?Gk(e,i):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(s?o(e,i,r):o(r))||r);return s&&r&&Yk(e,i,r),r};function Td(t){return/\b(ERROR|CRITICAL|FATAL)\b/.test(t)?"error":/\bWARN(ING)?\b/.test(t)?"warn":/\bDEBUG\b/.test(t)?"debug":"info"}let Ht=class extends pe{constructor(){super(...arguments),this.logs=[],this.error="",this.loading=!0,this.fullscreen=!1,this.connected=!1,this.query="",this.level="all",this.eventSource=null,this.handleFullscreenChange=()=>{this.fullscreen=!!document.fullscreenElement}}connectedCallback(){super.connectedCallback(),this.connect()}connect(){this.disconnect(),this.loading=!0,this.error="",this.logs=[],this.eventSource=S.activityLog(t=>{this.logs=[t,...this.logs],this.loading=!1,this.connected=!0,this.requestUpdate()},()=>{this.loading=!1},t=>{this.loading=!1,this.logs.length===0&&(this.error="Could not load activity log")})}disconnect(){this.eventSource&&(this.eventSource.close(),this.eventSource=null,this.connected=!1)}clearLogs(){this.logs=[]}downloadLog(){const t=this.logs.join(`
`),e=new Blob([t],{type:"text/plain"}),i=URL.createObjectURL(e),s=document.createElement("a");s.href=i,s.download="activity.log",s.click(),URL.revokeObjectURL(i)}toggleFullscreen(){var t,e;this.fullscreen?(e=document.exitFullscreen)==null||e.call(document):(t=this.requestFullscreen)==null||t.call(this)}firstUpdated(){document.addEventListener("fullscreenchange",this.handleFullscreenChange)}disconnectedCallback(){this.disconnect(),document.removeEventListener("fullscreenchange",this.handleFullscreenChange),super.disconnectedCallback()}renderLine(t){return p`<pre class="log-line ${Td(t)}">${t}</pre>`}render(){const t=this.query.trim().toLowerCase(),e=this.logs.filter(s=>{const r=Td(s);return this.level==="error"&&r!=="error"||this.level==="warn"&&r!=="warn"&&r!=="error"?!1:!t||s.toLowerCase().includes(t)}),i=e.length!==this.logs.length;return p`
      <div class="page">
        <div class="page-head">
          <div>
            <h1>Activity</h1>
            <p class="sub">Live events from the bridge, remotes and the Home Assistant integration. Newest first.</p>
          </div>
          <div class="page-actions">
            <button class="btn" @click=${this.downloadLog} ?disabled=${this.logs.length===0}>${C("download")}Download</button>
            <button class="btn icon" aria-label=${this.fullscreen?"Exit full screen":"Full screen"} title=${this.fullscreen?"Exit full screen":"Full screen"} @click=${this.toggleFullscreen}>${C("fullscreen")}</button>
          </div>
        </div>
        <section class="card log-panel">
          <div class="filters">
            <span class="state"><span class="dot ${this.connected?"ok":""}"></span>${this.connected?"Live":this.loading?"Connecting…":"Disconnected"}</span>
            <label class="search">
              ${C("search")}
              <input type="search" aria-label="Filter events" placeholder="Filter events" .value=${this.query} @input=${s=>{this.query=s.target.value}} />
            </label>
            <div class="segmented" role="group" aria-label="Level">
              ${["all","warn","error"].map(s=>p`<button aria-pressed=${this.level===s?"true":"false"} @click=${()=>{this.level=s}}>${s==="all"?"All":s==="warn"?"Warnings":"Errors"}</button>`)}
            </div>
            <span class="count">${i?`${e.length} of ${this.logs.length}`:`${this.logs.length} events`}</span>
            <button class="btn sm text" @click=${this.clearLogs} ?disabled=${this.logs.length===0}>Clear</button>
          </div>
          <div class="log-body" aria-live="polite">
            ${this.error?p`<div class="log-empty"><strong>${this.error}</strong><span>Check that the add-on is running, then retry.</span><button class="btn sm" @click=${()=>this.connect()}>Retry</button></div>`:this.loading&&this.logs.length===0?p`<div class="log-empty"><span class="spinner"></span><span>Opening the event stream…</span></div>`:this.logs.length===0?p`<div class="log-empty"><strong>No activity yet</strong><span>Events stream in here as remotes connect, update and report state.</span></div>`:e.length===0?p`<div class="log-empty"><strong>No events match</strong><span>Clear the filter to see all ${this.logs.length} events.</span></div>`:e.map(s=>this.renderLine(s))}
          </div>
        </section>
      </div>
    `}};Ht.styles=[Me,de`
    :host { display: block; }
    .page-actions .btn svg { width: 18px; height: 18px; }
    .log-panel { display: flex; flex-direction: column; min-height: 420px; max-height: calc(100vh - 220px); overflow: hidden; }
    .filters { display: flex; align-items: center; gap: 10px 14px; flex-wrap: wrap; padding: 10px 16px; border-bottom: 1px solid var(--line); }
    .state { display: inline-flex; align-items: center; gap: 6px; font-size: var(--text-sm); font-weight: 500; color: var(--ink-2); min-width: 92px; }
    .search { position: relative; flex: 1 1 200px; max-width: 320px; }
    .search svg { position: absolute; left: 10px; top: 50%; width: 18px; height: 18px; transform: translateY(-50%); color: var(--faint); pointer-events: none; }
    .search input { padding-left: 36px; min-height: 36px; }
    .count { margin-left: auto; color: var(--muted); font-size: var(--text-sm); font-variant-numeric: tabular-nums; }
    .log-body { flex: 1; overflow: auto; padding: 8px 0 12px; background: var(--log-bg); }
    .log-line { margin: 0; padding: 1px 16px; color: var(--log-ink); font-family: var(--font-mono); font-size: var(--text-xs); line-height: 1.65; white-space: pre-wrap; overflow-wrap: anywhere; }
    .log-line:hover { background: rgba(255, 255, 255, 0.04); }
    .log-line.warn { color: #f5c46b; }
    .log-line.error { color: #ff9a92; background: rgba(255, 90, 80, 0.08); }
    .log-line.debug { color: var(--log-muted); }
    .log-empty { display: grid; justify-items: center; gap: 6px; min-height: 300px; align-content: center; padding: 30px; text-align: center; color: var(--log-muted); }
    .log-empty strong { color: var(--log-ink); font-weight: 500; font-size: var(--text-lg); }
    .log-empty .btn { margin-top: 8px; }
    :host(:fullscreen) { background: var(--canvas); }
    :host(:fullscreen) .page { height: 100vh; padding: 14px; }
    :host(:fullscreen) .page-head { display: none; }
    :host(:fullscreen) .log-panel { max-height: none; height: 100%; }
    @media (max-width: 760px) {
      .search { max-width: none; order: 5; flex-basis: 100%; }
      .log-panel { max-height: calc(100vh - 260px); min-height: 340px; }
    }
  `];Ci([b()],Ht.prototype,"logs",2);Ci([b()],Ht.prototype,"error",2);Ci([b()],Ht.prototype,"loading",2);Ci([b()],Ht.prototype,"fullscreen",2);Ci([b()],Ht.prototype,"connected",2);Ci([b()],Ht.prototype,"query",2);Ci([b()],Ht.prototype,"level",2);Ht=Ci([Se("esp-activity-log-page")],Ht);/*! js-yaml 4.1.1 https://github.com/nodeca/js-yaml @license MIT */function Gp(t){return typeof t>"u"||t===null}function Zk(t){return typeof t=="object"&&t!==null}function eS(t){return Array.isArray(t)?t:Gp(t)?[]:[t]}function tS(t,e){var i,s,r,n;if(e)for(n=Object.keys(e),i=0,s=n.length;i<s;i+=1)r=n[i],t[r]=e[r];return t}function iS(t,e){var i="",s;for(s=0;s<e;s+=1)i+=t;return i}function sS(t){return t===0&&Number.NEGATIVE_INFINITY===1/t}var rS=Gp,nS=Zk,oS=eS,aS=iS,lS=sS,hS=tS,Ne={isNothing:rS,isObject:nS,toArray:oS,repeat:aS,isNegativeZero:lS,extend:hS};function Zp(t,e){var i="",s=t.reason||"(unknown reason)";return t.mark?(t.mark.name&&(i+='in "'+t.mark.name+'" '),i+="("+(t.mark.line+1)+":"+(t.mark.column+1)+")",!e&&t.mark.snippet&&(i+=`

`+t.mark.snippet),s+" "+i):s}function $r(t,e){Error.call(this),this.name="YAMLException",this.reason=t,this.mark=e,this.message=Zp(this,!1),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=new Error().stack||""}$r.prototype=Object.create(Error.prototype);$r.prototype.constructor=$r;$r.prototype.toString=function(e){return this.name+": "+Zp(this,e)};var Kt=$r;function ca(t,e,i,s,r){var n="",o="",a=Math.floor(r/2)-1;return s-e>a&&(n=" ... ",e=s-a+n.length),i-s>a&&(o=" ...",i=s+a-o.length),{str:n+t.slice(e,i).replace(/\t/g,"→")+o,pos:s-e+n.length}}function da(t,e){return Ne.repeat(" ",e-t.length)+t}function cS(t,e){if(e=Object.create(e||null),!t.buffer)return null;e.maxLength||(e.maxLength=79),typeof e.indent!="number"&&(e.indent=1),typeof e.linesBefore!="number"&&(e.linesBefore=3),typeof e.linesAfter!="number"&&(e.linesAfter=2);for(var i=/\r?\n|\r|\0/g,s=[0],r=[],n,o=-1;n=i.exec(t.buffer);)r.push(n.index),s.push(n.index+n[0].length),t.position<=n.index&&o<0&&(o=s.length-2);o<0&&(o=s.length-1);var a="",l,h,c=Math.min(t.line+e.linesAfter,r.length).toString().length,d=e.maxLength-(e.indent+c+3);for(l=1;l<=e.linesBefore&&!(o-l<0);l++)h=ca(t.buffer,s[o-l],r[o-l],t.position-(s[o]-s[o-l]),d),a=Ne.repeat(" ",e.indent)+da((t.line-l+1).toString(),c)+" | "+h.str+`
`+a;for(h=ca(t.buffer,s[o],r[o],t.position,d),a+=Ne.repeat(" ",e.indent)+da((t.line+1).toString(),c)+" | "+h.str+`
`,a+=Ne.repeat("-",e.indent+c+3+h.pos)+`^
`,l=1;l<=e.linesAfter&&!(o+l>=r.length);l++)h=ca(t.buffer,s[o+l],r[o+l],t.position-(s[o]-s[o+l]),d),a+=Ne.repeat(" ",e.indent)+da((t.line+l+1).toString(),c)+" | "+h.str+`
`;return a.replace(/\n$/,"")}var dS=cS,uS=["kind","multi","resolve","construct","instanceOf","predicate","represent","representName","defaultStyle","styleAliases"],fS=["scalar","sequence","mapping"];function pS(t){var e={};return t!==null&&Object.keys(t).forEach(function(i){t[i].forEach(function(s){e[String(s)]=i})}),e}function gS(t,e){if(e=e||{},Object.keys(e).forEach(function(i){if(uS.indexOf(i)===-1)throw new Kt('Unknown option "'+i+'" is met in definition of "'+t+'" YAML type.')}),this.options=e,this.tag=t,this.kind=e.kind||null,this.resolve=e.resolve||function(){return!0},this.construct=e.construct||function(i){return i},this.instanceOf=e.instanceOf||null,this.predicate=e.predicate||null,this.represent=e.represent||null,this.representName=e.representName||null,this.defaultStyle=e.defaultStyle||null,this.multi=e.multi||!1,this.styleAliases=pS(e.styleAliases||null),fS.indexOf(this.kind)===-1)throw new Kt('Unknown kind "'+this.kind+'" is specified for "'+t+'" YAML type.')}var _e=gS;function Md(t,e){var i=[];return t[e].forEach(function(s){var r=i.length;i.forEach(function(n,o){n.tag===s.tag&&n.kind===s.kind&&n.multi===s.multi&&(r=o)}),i[r]=s}),i}function mS(){var t={scalar:{},sequence:{},mapping:{},fallback:{},multi:{scalar:[],sequence:[],mapping:[],fallback:[]}},e,i;function s(r){r.multi?(t.multi[r.kind].push(r),t.multi.fallback.push(r)):t[r.kind][r.tag]=t.fallback[r.tag]=r}for(e=0,i=arguments.length;e<i;e+=1)arguments[e].forEach(s);return t}function fl(t){return this.extend(t)}fl.prototype.extend=function(e){var i=[],s=[];if(e instanceof _e)s.push(e);else if(Array.isArray(e))s=s.concat(e);else if(e&&(Array.isArray(e.implicit)||Array.isArray(e.explicit)))e.implicit&&(i=i.concat(e.implicit)),e.explicit&&(s=s.concat(e.explicit));else throw new Kt("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");i.forEach(function(n){if(!(n instanceof _e))throw new Kt("Specified list of YAML types (or a single Type object) contains a non-Type object.");if(n.loadKind&&n.loadKind!=="scalar")throw new Kt("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");if(n.multi)throw new Kt("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.")}),s.forEach(function(n){if(!(n instanceof _e))throw new Kt("Specified list of YAML types (or a single Type object) contains a non-Type object.")});var r=Object.create(fl.prototype);return r.implicit=(this.implicit||[]).concat(i),r.explicit=(this.explicit||[]).concat(s),r.compiledImplicit=Md(r,"implicit"),r.compiledExplicit=Md(r,"explicit"),r.compiledTypeMap=mS(r.compiledImplicit,r.compiledExplicit),r};var bS=fl,vS=new _e("tag:yaml.org,2002:str",{kind:"scalar",construct:function(t){return t!==null?t:""}}),yS=new _e("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(t){return t!==null?t:[]}}),xS=new _e("tag:yaml.org,2002:map",{kind:"mapping",construct:function(t){return t!==null?t:{}}}),wS=new bS({explicit:[vS,yS,xS]});function kS(t){if(t===null)return!0;var e=t.length;return e===1&&t==="~"||e===4&&(t==="null"||t==="Null"||t==="NULL")}function SS(){return null}function CS(t){return t===null}var $S=new _e("tag:yaml.org,2002:null",{kind:"scalar",resolve:kS,construct:SS,predicate:CS,represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"},empty:function(){return""}},defaultStyle:"lowercase"});function OS(t){if(t===null)return!1;var e=t.length;return e===4&&(t==="true"||t==="True"||t==="TRUE")||e===5&&(t==="false"||t==="False"||t==="FALSE")}function AS(t){return t==="true"||t==="True"||t==="TRUE"}function PS(t){return Object.prototype.toString.call(t)==="[object Boolean]"}var TS=new _e("tag:yaml.org,2002:bool",{kind:"scalar",resolve:OS,construct:AS,predicate:PS,represent:{lowercase:function(t){return t?"true":"false"},uppercase:function(t){return t?"TRUE":"FALSE"},camelcase:function(t){return t?"True":"False"}},defaultStyle:"lowercase"});function MS(t){return 48<=t&&t<=57||65<=t&&t<=70||97<=t&&t<=102}function ES(t){return 48<=t&&t<=55}function _S(t){return 48<=t&&t<=57}function DS(t){if(t===null)return!1;var e=t.length,i=0,s=!1,r;if(!e)return!1;if(r=t[i],(r==="-"||r==="+")&&(r=t[++i]),r==="0"){if(i+1===e)return!0;if(r=t[++i],r==="b"){for(i++;i<e;i++)if(r=t[i],r!=="_"){if(r!=="0"&&r!=="1")return!1;s=!0}return s&&r!=="_"}if(r==="x"){for(i++;i<e;i++)if(r=t[i],r!=="_"){if(!MS(t.charCodeAt(i)))return!1;s=!0}return s&&r!=="_"}if(r==="o"){for(i++;i<e;i++)if(r=t[i],r!=="_"){if(!ES(t.charCodeAt(i)))return!1;s=!0}return s&&r!=="_"}}if(r==="_")return!1;for(;i<e;i++)if(r=t[i],r!=="_"){if(!_S(t.charCodeAt(i)))return!1;s=!0}return!(!s||r==="_")}function BS(t){var e=t,i=1,s;if(e.indexOf("_")!==-1&&(e=e.replace(/_/g,"")),s=e[0],(s==="-"||s==="+")&&(s==="-"&&(i=-1),e=e.slice(1),s=e[0]),e==="0")return 0;if(s==="0"){if(e[1]==="b")return i*parseInt(e.slice(2),2);if(e[1]==="x")return i*parseInt(e.slice(2),16);if(e[1]==="o")return i*parseInt(e.slice(2),8)}return i*parseInt(e,10)}function RS(t){return Object.prototype.toString.call(t)==="[object Number]"&&t%1===0&&!Ne.isNegativeZero(t)}var LS=new _e("tag:yaml.org,2002:int",{kind:"scalar",resolve:DS,construct:BS,predicate:RS,represent:{binary:function(t){return t>=0?"0b"+t.toString(2):"-0b"+t.toString(2).slice(1)},octal:function(t){return t>=0?"0o"+t.toString(8):"-0o"+t.toString(8).slice(1)},decimal:function(t){return t.toString(10)},hexadecimal:function(t){return t>=0?"0x"+t.toString(16).toUpperCase():"-0x"+t.toString(16).toUpperCase().slice(1)}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}}),IS=new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");function FS(t){return!(t===null||!IS.test(t)||t[t.length-1]==="_")}function NS(t){var e,i;return e=t.replace(/_/g,"").toLowerCase(),i=e[0]==="-"?-1:1,"+-".indexOf(e[0])>=0&&(e=e.slice(1)),e===".inf"?i===1?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:e===".nan"?NaN:i*parseFloat(e,10)}var US=/^[-+]?[0-9]+e/;function HS(t,e){var i;if(isNaN(t))switch(e){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===t)switch(e){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===t)switch(e){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(Ne.isNegativeZero(t))return"-0.0";return i=t.toString(10),US.test(i)?i.replace("e",".e"):i}function WS(t){return Object.prototype.toString.call(t)==="[object Number]"&&(t%1!==0||Ne.isNegativeZero(t))}var zS=new _e("tag:yaml.org,2002:float",{kind:"scalar",resolve:FS,construct:NS,predicate:WS,represent:HS,defaultStyle:"lowercase"}),qS=wS.extend({implicit:[$S,TS,LS,zS]}),VS=qS,eg=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),tg=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");function jS(t){return t===null?!1:eg.exec(t)!==null||tg.exec(t)!==null}function QS(t){var e,i,s,r,n,o,a,l=0,h=null,c,d,u;if(e=eg.exec(t),e===null&&(e=tg.exec(t)),e===null)throw new Error("Date resolve error");if(i=+e[1],s=+e[2]-1,r=+e[3],!e[4])return new Date(Date.UTC(i,s,r));if(n=+e[4],o=+e[5],a=+e[6],e[7]){for(l=e[7].slice(0,3);l.length<3;)l+="0";l=+l}return e[9]&&(c=+e[10],d=+(e[11]||0),h=(c*60+d)*6e4,e[9]==="-"&&(h=-h)),u=new Date(Date.UTC(i,s,r,n,o,a,l)),h&&u.setTime(u.getTime()-h),u}function KS(t){return t.toISOString()}var XS=new _e("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:jS,construct:QS,instanceOf:Date,represent:KS});function JS(t){return t==="<<"||t===null}var YS=new _e("tag:yaml.org,2002:merge",{kind:"scalar",resolve:JS}),fh=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;function GS(t){if(t===null)return!1;var e,i,s=0,r=t.length,n=fh;for(i=0;i<r;i++)if(e=n.indexOf(t.charAt(i)),!(e>64)){if(e<0)return!1;s+=6}return s%8===0}function ZS(t){var e,i,s=t.replace(/[\r\n=]/g,""),r=s.length,n=fh,o=0,a=[];for(e=0;e<r;e++)e%4===0&&e&&(a.push(o>>16&255),a.push(o>>8&255),a.push(o&255)),o=o<<6|n.indexOf(s.charAt(e));return i=r%4*6,i===0?(a.push(o>>16&255),a.push(o>>8&255),a.push(o&255)):i===18?(a.push(o>>10&255),a.push(o>>2&255)):i===12&&a.push(o>>4&255),new Uint8Array(a)}function eC(t){var e="",i=0,s,r,n=t.length,o=fh;for(s=0;s<n;s++)s%3===0&&s&&(e+=o[i>>18&63],e+=o[i>>12&63],e+=o[i>>6&63],e+=o[i&63]),i=(i<<8)+t[s];return r=n%3,r===0?(e+=o[i>>18&63],e+=o[i>>12&63],e+=o[i>>6&63],e+=o[i&63]):r===2?(e+=o[i>>10&63],e+=o[i>>4&63],e+=o[i<<2&63],e+=o[64]):r===1&&(e+=o[i>>2&63],e+=o[i<<4&63],e+=o[64],e+=o[64]),e}function tC(t){return Object.prototype.toString.call(t)==="[object Uint8Array]"}var iC=new _e("tag:yaml.org,2002:binary",{kind:"scalar",resolve:GS,construct:ZS,predicate:tC,represent:eC}),sC=Object.prototype.hasOwnProperty,rC=Object.prototype.toString;function nC(t){if(t===null)return!0;var e=[],i,s,r,n,o,a=t;for(i=0,s=a.length;i<s;i+=1){if(r=a[i],o=!1,rC.call(r)!=="[object Object]")return!1;for(n in r)if(sC.call(r,n))if(!o)o=!0;else return!1;if(!o)return!1;if(e.indexOf(n)===-1)e.push(n);else return!1}return!0}function oC(t){return t!==null?t:[]}var aC=new _e("tag:yaml.org,2002:omap",{kind:"sequence",resolve:nC,construct:oC}),lC=Object.prototype.toString;function hC(t){if(t===null)return!0;var e,i,s,r,n,o=t;for(n=new Array(o.length),e=0,i=o.length;e<i;e+=1){if(s=o[e],lC.call(s)!=="[object Object]"||(r=Object.keys(s),r.length!==1))return!1;n[e]=[r[0],s[r[0]]]}return!0}function cC(t){if(t===null)return[];var e,i,s,r,n,o=t;for(n=new Array(o.length),e=0,i=o.length;e<i;e+=1)s=o[e],r=Object.keys(s),n[e]=[r[0],s[r[0]]];return n}var dC=new _e("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:hC,construct:cC}),uC=Object.prototype.hasOwnProperty;function fC(t){if(t===null)return!0;var e,i=t;for(e in i)if(uC.call(i,e)&&i[e]!==null)return!1;return!0}function pC(t){return t!==null?t:{}}var gC=new _e("tag:yaml.org,2002:set",{kind:"mapping",resolve:fC,construct:pC}),mC=VS.extend({implicit:[XS,YS],explicit:[iC,aC,dC,gC]}),wi=Object.prototype.hasOwnProperty,io=1,ig=2,sg=3,so=4,ua=1,bC=2,Ed=3,vC=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,yC=/[\x85\u2028\u2029]/,xC=/[,\[\]\{\}]/,rg=/^(?:!|!!|![a-z\-]+!)$/i,ng=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;function _d(t){return Object.prototype.toString.call(t)}function Nt(t){return t===10||t===13}function zi(t){return t===9||t===32}function Xe(t){return t===9||t===32||t===10||t===13}function cs(t){return t===44||t===91||t===93||t===123||t===125}function wC(t){var e;return 48<=t&&t<=57?t-48:(e=t|32,97<=e&&e<=102?e-97+10:-1)}function kC(t){return t===120?2:t===117?4:t===85?8:0}function SC(t){return 48<=t&&t<=57?t-48:-1}function Dd(t){return t===48?"\0":t===97?"\x07":t===98?"\b":t===116||t===9?"	":t===110?`
`:t===118?"\v":t===102?"\f":t===114?"\r":t===101?"\x1B":t===32?" ":t===34?'"':t===47?"/":t===92?"\\":t===78?"":t===95?" ":t===76?"\u2028":t===80?"\u2029":""}function CC(t){return t<=65535?String.fromCharCode(t):String.fromCharCode((t-65536>>10)+55296,(t-65536&1023)+56320)}function og(t,e,i){e==="__proto__"?Object.defineProperty(t,e,{configurable:!0,enumerable:!0,writable:!0,value:i}):t[e]=i}var ag=new Array(256),lg=new Array(256);for(var es=0;es<256;es++)ag[es]=Dd(es)?1:0,lg[es]=Dd(es);function $C(t,e){this.input=t,this.filename=e.filename||null,this.schema=e.schema||mC,this.onWarning=e.onWarning||null,this.legacy=e.legacy||!1,this.json=e.json||!1,this.listener=e.listener||null,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=t.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.firstTabInLine=-1,this.documents=[]}function hg(t,e){var i={name:t.filename,buffer:t.input.slice(0,-1),position:t.position,line:t.line,column:t.position-t.lineStart};return i.snippet=dS(i),new Kt(e,i)}function F(t,e){throw hg(t,e)}function ro(t,e){t.onWarning&&t.onWarning.call(null,hg(t,e))}var Bd={YAML:function(e,i,s){var r,n,o;e.version!==null&&F(e,"duplication of %YAML directive"),s.length!==1&&F(e,"YAML directive accepts exactly one argument"),r=/^([0-9]+)\.([0-9]+)$/.exec(s[0]),r===null&&F(e,"ill-formed argument of the YAML directive"),n=parseInt(r[1],10),o=parseInt(r[2],10),n!==1&&F(e,"unacceptable YAML version of the document"),e.version=s[0],e.checkLineBreaks=o<2,o!==1&&o!==2&&ro(e,"unsupported YAML version of the document")},TAG:function(e,i,s){var r,n;s.length!==2&&F(e,"TAG directive accepts exactly two arguments"),r=s[0],n=s[1],rg.test(r)||F(e,"ill-formed tag handle (first argument) of the TAG directive"),wi.call(e.tagMap,r)&&F(e,'there is a previously declared suffix for "'+r+'" tag handle'),ng.test(n)||F(e,"ill-formed tag prefix (second argument) of the TAG directive");try{n=decodeURIComponent(n)}catch{F(e,"tag prefix is malformed: "+n)}e.tagMap[r]=n}};function di(t,e,i,s){var r,n,o,a;if(e<i){if(a=t.input.slice(e,i),s)for(r=0,n=a.length;r<n;r+=1)o=a.charCodeAt(r),o===9||32<=o&&o<=1114111||F(t,"expected valid JSON character");else vC.test(a)&&F(t,"the stream contains non-printable characters");t.result+=a}}function Rd(t,e,i,s){var r,n,o,a;for(Ne.isObject(i)||F(t,"cannot merge mappings; the provided source object is unacceptable"),r=Object.keys(i),o=0,a=r.length;o<a;o+=1)n=r[o],wi.call(e,n)||(og(e,n,i[n]),s[n]=!0)}function ds(t,e,i,s,r,n,o,a,l){var h,c;if(Array.isArray(r))for(r=Array.prototype.slice.call(r),h=0,c=r.length;h<c;h+=1)Array.isArray(r[h])&&F(t,"nested arrays are not supported inside keys"),typeof r=="object"&&_d(r[h])==="[object Object]"&&(r[h]="[object Object]");if(typeof r=="object"&&_d(r)==="[object Object]"&&(r="[object Object]"),r=String(r),e===null&&(e={}),s==="tag:yaml.org,2002:merge")if(Array.isArray(n))for(h=0,c=n.length;h<c;h+=1)Rd(t,e,n[h],i);else Rd(t,e,n,i);else!t.json&&!wi.call(i,r)&&wi.call(e,r)&&(t.line=o||t.line,t.lineStart=a||t.lineStart,t.position=l||t.position,F(t,"duplicated mapping key")),og(e,r,n),delete i[r];return e}function ph(t){var e;e=t.input.charCodeAt(t.position),e===10?t.position++:e===13?(t.position++,t.input.charCodeAt(t.position)===10&&t.position++):F(t,"a line break is expected"),t.line+=1,t.lineStart=t.position,t.firstTabInLine=-1}function xe(t,e,i){for(var s=0,r=t.input.charCodeAt(t.position);r!==0;){for(;zi(r);)r===9&&t.firstTabInLine===-1&&(t.firstTabInLine=t.position),r=t.input.charCodeAt(++t.position);if(e&&r===35)do r=t.input.charCodeAt(++t.position);while(r!==10&&r!==13&&r!==0);if(Nt(r))for(ph(t),r=t.input.charCodeAt(t.position),s++,t.lineIndent=0;r===32;)t.lineIndent++,r=t.input.charCodeAt(++t.position);else break}return i!==-1&&s!==0&&t.lineIndent<i&&ro(t,"deficient indentation"),s}function ko(t){var e=t.position,i;return i=t.input.charCodeAt(e),!!((i===45||i===46)&&i===t.input.charCodeAt(e+1)&&i===t.input.charCodeAt(e+2)&&(e+=3,i=t.input.charCodeAt(e),i===0||Xe(i)))}function gh(t,e){e===1?t.result+=" ":e>1&&(t.result+=Ne.repeat(`
`,e-1))}function OC(t,e,i){var s,r,n,o,a,l,h,c,d=t.kind,u=t.result,f;if(f=t.input.charCodeAt(t.position),Xe(f)||cs(f)||f===35||f===38||f===42||f===33||f===124||f===62||f===39||f===34||f===37||f===64||f===96||(f===63||f===45)&&(r=t.input.charCodeAt(t.position+1),Xe(r)||i&&cs(r)))return!1;for(t.kind="scalar",t.result="",n=o=t.position,a=!1;f!==0;){if(f===58){if(r=t.input.charCodeAt(t.position+1),Xe(r)||i&&cs(r))break}else if(f===35){if(s=t.input.charCodeAt(t.position-1),Xe(s))break}else{if(t.position===t.lineStart&&ko(t)||i&&cs(f))break;if(Nt(f))if(l=t.line,h=t.lineStart,c=t.lineIndent,xe(t,!1,-1),t.lineIndent>=e){a=!0,f=t.input.charCodeAt(t.position);continue}else{t.position=o,t.line=l,t.lineStart=h,t.lineIndent=c;break}}a&&(di(t,n,o,!1),gh(t,t.line-l),n=o=t.position,a=!1),zi(f)||(o=t.position+1),f=t.input.charCodeAt(++t.position)}return di(t,n,o,!1),t.result?!0:(t.kind=d,t.result=u,!1)}function AC(t,e){var i,s,r;if(i=t.input.charCodeAt(t.position),i!==39)return!1;for(t.kind="scalar",t.result="",t.position++,s=r=t.position;(i=t.input.charCodeAt(t.position))!==0;)if(i===39)if(di(t,s,t.position,!0),i=t.input.charCodeAt(++t.position),i===39)s=t.position,t.position++,r=t.position;else return!0;else Nt(i)?(di(t,s,r,!0),gh(t,xe(t,!1,e)),s=r=t.position):t.position===t.lineStart&&ko(t)?F(t,"unexpected end of the document within a single quoted scalar"):(t.position++,r=t.position);F(t,"unexpected end of the stream within a single quoted scalar")}function PC(t,e){var i,s,r,n,o,a;if(a=t.input.charCodeAt(t.position),a!==34)return!1;for(t.kind="scalar",t.result="",t.position++,i=s=t.position;(a=t.input.charCodeAt(t.position))!==0;){if(a===34)return di(t,i,t.position,!0),t.position++,!0;if(a===92){if(di(t,i,t.position,!0),a=t.input.charCodeAt(++t.position),Nt(a))xe(t,!1,e);else if(a<256&&ag[a])t.result+=lg[a],t.position++;else if((o=kC(a))>0){for(r=o,n=0;r>0;r--)a=t.input.charCodeAt(++t.position),(o=wC(a))>=0?n=(n<<4)+o:F(t,"expected hexadecimal character");t.result+=CC(n),t.position++}else F(t,"unknown escape sequence");i=s=t.position}else Nt(a)?(di(t,i,s,!0),gh(t,xe(t,!1,e)),i=s=t.position):t.position===t.lineStart&&ko(t)?F(t,"unexpected end of the document within a double quoted scalar"):(t.position++,s=t.position)}F(t,"unexpected end of the stream within a double quoted scalar")}function TC(t,e){var i=!0,s,r,n,o=t.tag,a,l=t.anchor,h,c,d,u,f,g=Object.create(null),m,y,w,x;if(x=t.input.charCodeAt(t.position),x===91)c=93,f=!1,a=[];else if(x===123)c=125,f=!0,a={};else return!1;for(t.anchor!==null&&(t.anchorMap[t.anchor]=a),x=t.input.charCodeAt(++t.position);x!==0;){if(xe(t,!0,e),x=t.input.charCodeAt(t.position),x===c)return t.position++,t.tag=o,t.anchor=l,t.kind=f?"mapping":"sequence",t.result=a,!0;i?x===44&&F(t,"expected the node content, but found ','"):F(t,"missed comma between flow collection entries"),y=m=w=null,d=u=!1,x===63&&(h=t.input.charCodeAt(t.position+1),Xe(h)&&(d=u=!0,t.position++,xe(t,!0,e))),s=t.line,r=t.lineStart,n=t.position,Ms(t,e,io,!1,!0),y=t.tag,m=t.result,xe(t,!0,e),x=t.input.charCodeAt(t.position),(u||t.line===s)&&x===58&&(d=!0,x=t.input.charCodeAt(++t.position),xe(t,!0,e),Ms(t,e,io,!1,!0),w=t.result),f?ds(t,a,g,y,m,w,s,r,n):d?a.push(ds(t,null,g,y,m,w,s,r,n)):a.push(m),xe(t,!0,e),x=t.input.charCodeAt(t.position),x===44?(i=!0,x=t.input.charCodeAt(++t.position)):i=!1}F(t,"unexpected end of the stream within a flow collection")}function MC(t,e){var i,s,r=ua,n=!1,o=!1,a=e,l=0,h=!1,c,d;if(d=t.input.charCodeAt(t.position),d===124)s=!1;else if(d===62)s=!0;else return!1;for(t.kind="scalar",t.result="";d!==0;)if(d=t.input.charCodeAt(++t.position),d===43||d===45)ua===r?r=d===43?Ed:bC:F(t,"repeat of a chomping mode identifier");else if((c=SC(d))>=0)c===0?F(t,"bad explicit indentation width of a block scalar; it cannot be less than one"):o?F(t,"repeat of an indentation width identifier"):(a=e+c-1,o=!0);else break;if(zi(d)){do d=t.input.charCodeAt(++t.position);while(zi(d));if(d===35)do d=t.input.charCodeAt(++t.position);while(!Nt(d)&&d!==0)}for(;d!==0;){for(ph(t),t.lineIndent=0,d=t.input.charCodeAt(t.position);(!o||t.lineIndent<a)&&d===32;)t.lineIndent++,d=t.input.charCodeAt(++t.position);if(!o&&t.lineIndent>a&&(a=t.lineIndent),Nt(d)){l++;continue}if(t.lineIndent<a){r===Ed?t.result+=Ne.repeat(`
`,n?1+l:l):r===ua&&n&&(t.result+=`
`);break}for(s?zi(d)?(h=!0,t.result+=Ne.repeat(`
`,n?1+l:l)):h?(h=!1,t.result+=Ne.repeat(`
`,l+1)):l===0?n&&(t.result+=" "):t.result+=Ne.repeat(`
`,l):t.result+=Ne.repeat(`
`,n?1+l:l),n=!0,o=!0,l=0,i=t.position;!Nt(d)&&d!==0;)d=t.input.charCodeAt(++t.position);di(t,i,t.position,!1)}return!0}function Ld(t,e){var i,s=t.tag,r=t.anchor,n=[],o,a=!1,l;if(t.firstTabInLine!==-1)return!1;for(t.anchor!==null&&(t.anchorMap[t.anchor]=n),l=t.input.charCodeAt(t.position);l!==0&&(t.firstTabInLine!==-1&&(t.position=t.firstTabInLine,F(t,"tab characters must not be used in indentation")),!(l!==45||(o=t.input.charCodeAt(t.position+1),!Xe(o))));){if(a=!0,t.position++,xe(t,!0,-1)&&t.lineIndent<=e){n.push(null),l=t.input.charCodeAt(t.position);continue}if(i=t.line,Ms(t,e,sg,!1,!0),n.push(t.result),xe(t,!0,-1),l=t.input.charCodeAt(t.position),(t.line===i||t.lineIndent>e)&&l!==0)F(t,"bad indentation of a sequence entry");else if(t.lineIndent<e)break}return a?(t.tag=s,t.anchor=r,t.kind="sequence",t.result=n,!0):!1}function EC(t,e,i){var s,r,n,o,a,l,h=t.tag,c=t.anchor,d={},u=Object.create(null),f=null,g=null,m=null,y=!1,w=!1,x;if(t.firstTabInLine!==-1)return!1;for(t.anchor!==null&&(t.anchorMap[t.anchor]=d),x=t.input.charCodeAt(t.position);x!==0;){if(!y&&t.firstTabInLine!==-1&&(t.position=t.firstTabInLine,F(t,"tab characters must not be used in indentation")),s=t.input.charCodeAt(t.position+1),n=t.line,(x===63||x===58)&&Xe(s))x===63?(y&&(ds(t,d,u,f,g,null,o,a,l),f=g=m=null),w=!0,y=!0,r=!0):y?(y=!1,r=!0):F(t,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),t.position+=1,x=s;else{if(o=t.line,a=t.lineStart,l=t.position,!Ms(t,i,ig,!1,!0))break;if(t.line===n){for(x=t.input.charCodeAt(t.position);zi(x);)x=t.input.charCodeAt(++t.position);if(x===58)x=t.input.charCodeAt(++t.position),Xe(x)||F(t,"a whitespace character is expected after the key-value separator within a block mapping"),y&&(ds(t,d,u,f,g,null,o,a,l),f=g=m=null),w=!0,y=!1,r=!1,f=t.tag,g=t.result;else if(w)F(t,"can not read an implicit mapping pair; a colon is missed");else return t.tag=h,t.anchor=c,!0}else if(w)F(t,"can not read a block mapping entry; a multiline key may not be an implicit key");else return t.tag=h,t.anchor=c,!0}if((t.line===n||t.lineIndent>e)&&(y&&(o=t.line,a=t.lineStart,l=t.position),Ms(t,e,so,!0,r)&&(y?g=t.result:m=t.result),y||(ds(t,d,u,f,g,m,o,a,l),f=g=m=null),xe(t,!0,-1),x=t.input.charCodeAt(t.position)),(t.line===n||t.lineIndent>e)&&x!==0)F(t,"bad indentation of a mapping entry");else if(t.lineIndent<e)break}return y&&ds(t,d,u,f,g,null,o,a,l),w&&(t.tag=h,t.anchor=c,t.kind="mapping",t.result=d),w}function _C(t){var e,i=!1,s=!1,r,n,o;if(o=t.input.charCodeAt(t.position),o!==33)return!1;if(t.tag!==null&&F(t,"duplication of a tag property"),o=t.input.charCodeAt(++t.position),o===60?(i=!0,o=t.input.charCodeAt(++t.position)):o===33?(s=!0,r="!!",o=t.input.charCodeAt(++t.position)):r="!",e=t.position,i){do o=t.input.charCodeAt(++t.position);while(o!==0&&o!==62);t.position<t.length?(n=t.input.slice(e,t.position),o=t.input.charCodeAt(++t.position)):F(t,"unexpected end of the stream within a verbatim tag")}else{for(;o!==0&&!Xe(o);)o===33&&(s?F(t,"tag suffix cannot contain exclamation marks"):(r=t.input.slice(e-1,t.position+1),rg.test(r)||F(t,"named tag handle cannot contain such characters"),s=!0,e=t.position+1)),o=t.input.charCodeAt(++t.position);n=t.input.slice(e,t.position),xC.test(n)&&F(t,"tag suffix cannot contain flow indicator characters")}n&&!ng.test(n)&&F(t,"tag name cannot contain such characters: "+n);try{n=decodeURIComponent(n)}catch{F(t,"tag name is malformed: "+n)}return i?t.tag=n:wi.call(t.tagMap,r)?t.tag=t.tagMap[r]+n:r==="!"?t.tag="!"+n:r==="!!"?t.tag="tag:yaml.org,2002:"+n:F(t,'undeclared tag handle "'+r+'"'),!0}function DC(t){var e,i;if(i=t.input.charCodeAt(t.position),i!==38)return!1;for(t.anchor!==null&&F(t,"duplication of an anchor property"),i=t.input.charCodeAt(++t.position),e=t.position;i!==0&&!Xe(i)&&!cs(i);)i=t.input.charCodeAt(++t.position);return t.position===e&&F(t,"name of an anchor node must contain at least one character"),t.anchor=t.input.slice(e,t.position),!0}function BC(t){var e,i,s;if(s=t.input.charCodeAt(t.position),s!==42)return!1;for(s=t.input.charCodeAt(++t.position),e=t.position;s!==0&&!Xe(s)&&!cs(s);)s=t.input.charCodeAt(++t.position);return t.position===e&&F(t,"name of an alias node must contain at least one character"),i=t.input.slice(e,t.position),wi.call(t.anchorMap,i)||F(t,'unidentified alias "'+i+'"'),t.result=t.anchorMap[i],xe(t,!0,-1),!0}function Ms(t,e,i,s,r){var n,o,a,l=1,h=!1,c=!1,d,u,f,g,m,y;if(t.listener!==null&&t.listener("open",t),t.tag=null,t.anchor=null,t.kind=null,t.result=null,n=o=a=so===i||sg===i,s&&xe(t,!0,-1)&&(h=!0,t.lineIndent>e?l=1:t.lineIndent===e?l=0:t.lineIndent<e&&(l=-1)),l===1)for(;_C(t)||DC(t);)xe(t,!0,-1)?(h=!0,a=n,t.lineIndent>e?l=1:t.lineIndent===e?l=0:t.lineIndent<e&&(l=-1)):a=!1;if(a&&(a=h||r),(l===1||so===i)&&(io===i||ig===i?m=e:m=e+1,y=t.position-t.lineStart,l===1?a&&(Ld(t,y)||EC(t,y,m))||TC(t,m)?c=!0:(o&&MC(t,m)||AC(t,m)||PC(t,m)?c=!0:BC(t)?(c=!0,(t.tag!==null||t.anchor!==null)&&F(t,"alias node should not have any properties")):OC(t,m,io===i)&&(c=!0,t.tag===null&&(t.tag="?")),t.anchor!==null&&(t.anchorMap[t.anchor]=t.result)):l===0&&(c=a&&Ld(t,y))),t.tag===null)t.anchor!==null&&(t.anchorMap[t.anchor]=t.result);else if(t.tag==="?"){for(t.result!==null&&t.kind!=="scalar"&&F(t,'unacceptable node kind for !<?> tag; it should be "scalar", not "'+t.kind+'"'),d=0,u=t.implicitTypes.length;d<u;d+=1)if(g=t.implicitTypes[d],g.resolve(t.result)){t.result=g.construct(t.result),t.tag=g.tag,t.anchor!==null&&(t.anchorMap[t.anchor]=t.result);break}}else if(t.tag!=="!"){if(wi.call(t.typeMap[t.kind||"fallback"],t.tag))g=t.typeMap[t.kind||"fallback"][t.tag];else for(g=null,f=t.typeMap.multi[t.kind||"fallback"],d=0,u=f.length;d<u;d+=1)if(t.tag.slice(0,f[d].tag.length)===f[d].tag){g=f[d];break}g||F(t,"unknown tag !<"+t.tag+">"),t.result!==null&&g.kind!==t.kind&&F(t,"unacceptable node kind for !<"+t.tag+'> tag; it should be "'+g.kind+'", not "'+t.kind+'"'),g.resolve(t.result,t.tag)?(t.result=g.construct(t.result,t.tag),t.anchor!==null&&(t.anchorMap[t.anchor]=t.result)):F(t,"cannot resolve a node with !<"+t.tag+"> explicit tag")}return t.listener!==null&&t.listener("close",t),t.tag!==null||t.anchor!==null||c}function RC(t){var e=t.position,i,s,r,n=!1,o;for(t.version=null,t.checkLineBreaks=t.legacy,t.tagMap=Object.create(null),t.anchorMap=Object.create(null);(o=t.input.charCodeAt(t.position))!==0&&(xe(t,!0,-1),o=t.input.charCodeAt(t.position),!(t.lineIndent>0||o!==37));){for(n=!0,o=t.input.charCodeAt(++t.position),i=t.position;o!==0&&!Xe(o);)o=t.input.charCodeAt(++t.position);for(s=t.input.slice(i,t.position),r=[],s.length<1&&F(t,"directive name must not be less than one character in length");o!==0;){for(;zi(o);)o=t.input.charCodeAt(++t.position);if(o===35){do o=t.input.charCodeAt(++t.position);while(o!==0&&!Nt(o));break}if(Nt(o))break;for(i=t.position;o!==0&&!Xe(o);)o=t.input.charCodeAt(++t.position);r.push(t.input.slice(i,t.position))}o!==0&&ph(t),wi.call(Bd,s)?Bd[s](t,s,r):ro(t,'unknown document directive "'+s+'"')}if(xe(t,!0,-1),t.lineIndent===0&&t.input.charCodeAt(t.position)===45&&t.input.charCodeAt(t.position+1)===45&&t.input.charCodeAt(t.position+2)===45?(t.position+=3,xe(t,!0,-1)):n&&F(t,"directives end mark is expected"),Ms(t,t.lineIndent-1,so,!1,!0),xe(t,!0,-1),t.checkLineBreaks&&yC.test(t.input.slice(e,t.position))&&ro(t,"non-ASCII line breaks are interpreted as content"),t.documents.push(t.result),t.position===t.lineStart&&ko(t)){t.input.charCodeAt(t.position)===46&&(t.position+=3,xe(t,!0,-1));return}if(t.position<t.length-1)F(t,"end of the stream or a document separator is expected");else return}function LC(t,e){t=String(t),e=e||{},t.length!==0&&(t.charCodeAt(t.length-1)!==10&&t.charCodeAt(t.length-1)!==13&&(t+=`
`),t.charCodeAt(0)===65279&&(t=t.slice(1)));var i=new $C(t,e),s=t.indexOf("\0");for(s!==-1&&(i.position=s,F(i,"null byte is not allowed in input")),i.input+="\0";i.input.charCodeAt(i.position)===32;)i.lineIndent+=1,i.position+=1;for(;i.position<i.length-1;)RC(i);return i.documents}function IC(t,e){var i=LC(t,e);if(i.length!==0){if(i.length===1)return i[0];throw new Kt("expected a single document in the stream, but found more")}}var FC=IC,NC={load:FC},UC=NC.load,HC=Object.defineProperty,WC=Object.getOwnPropertyDescriptor,I=(t,e,i,s)=>{for(var r=s>1?void 0:s?WC(e,i):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(s?o(e,i,r):o(r))||r);return s&&r&&HC(e,i,r),r};const Pi={"ESP32-C5":{label:"ESP32-C5 (esp32-c5-devkitc-1)",board_info:{platform:"esp32",board:"esp32-c5-devkitc-1",framework:"esp-idf",variant:"esp32c5"}},"ESP32-C6":{label:"ESP32-C6 (esp32-c6-devkitc)",board_info:{platform:"esp32",board:"esp32-c6-devkitc",framework:"esp-idf",variant:"esp32c6"}},"ESP32-S3":{label:"ESP32-S3 (esp32-s3-devkitc-1)",board_info:{platform:"esp32",board:"esp32-s3-devkitc-1",framework:"esp-idf",variant:"esp32s3"}},"ESP32-C3":{label:"ESP32-C3 (esp32-c3-devkitm-1)",board_info:{platform:"esp32",board:"esp32-c3-devkitm-1",framework:"esp-idf",variant:"esp32c3"}},"ESP32-S2":{label:"ESP32-S2 (esp32-s2-saola)",board_info:{platform:"esp32",board:"esp32-s2-saola",framework:"esp-idf",variant:"esp32s2"}},ESP32:{label:"ESP32 (esp32dev)",board_info:{platform:"esp32",board:"esp32dev",framework:"esp-idf"}},"ESP32-H2":{label:"ESP32-H2 (esp32-h2-devkitm-1)",board_info:{platform:"esp32",board:"esp32-h2-devkitm-1",framework:"esp-idf",variant:"esp32h2"}},"ESP32-C2":{label:"ESP32-C2 (esp32-c2-devkitm-1)",board_info:{platform:"esp32",board:"esp32-c2-devkitm-1",framework:"esp-idf",variant:"esp32c2"}}};let E=class extends pe{constructor(){super(...arguments),this.step1="choose",this.step1Choice="choose",this.step2="disabled",this.step3="disabled",this.discoveredBridges=[],this.bridgeError=null,this.manualHost="",this.manualPort=80,this.manualApiKey="",this.apiKeyInput="",this.selectedBridge=null,this.restartError=null,this.integrationError=null,this.runningIntegrationVersion=null,this.latestIntegrationVersion=null,this.integrationDetected=!1,this.bridgeApiStatus=null,this.statusPollTimer=null,this.integrationPollTimer=null,this.integrationFailures=0,this.pollingSeconds=0,this.discoveryTimer=null,this.discoveryTimeoutTimer=null,this.doneTimer=null,this.validatePollTimer=null,this.validateAttempts=0,this.activeBridgeUuid=null,this.bridgeHost=null,this.bridgePort=80,this.pollStartTime=0,this.lastIntegrationSetupAttemptAt=0,this.flashTab="discover",this.flashStage="config",this.flashName="espnow-bridge",this.flashNetworkId="",this.flashPsk="",this.flashWifiSsid="",this.flashWifiPassword="",this.flashApiKey="",this.flashEspnowMode="lr",this.flashOtaPassword="",this.flashChipName="",this.flashTransport="wifi",this.flashTransportChosen=!1,this.flashPrefilledFields={},this.flashSerialPort="",this.flashSerialPorts=[],this.flashSerialPortScanning=!1,this.flashSerialFlashStatus="",this.flashSerialFlashError="",this.flashSerialFlashTimer=null,this.flashBoardInfo=null,this.flashBrowserDetecting=!1,this.flashBrowserDetectError="",this.flashDetectedChip="",this.flashBrowserPort=null,this.flashBrowserFlashing=!1,this.flashBrowserFlashError="",this.flashSecretsWarning="",this.flashConfigError="",this.flashMac="",this.flashCompileLog="",this.flashCompilePercent=0,this.flashCompileStatus="",this.flashCompileError="",this.flashFlashError="",this.flashDetectElapsed=0,this.flashDetectError="",this.flashBrowserManifestUrl="",this.flashCompilePollTimer=null,this.flashDetectTimer=null,this.flashCompileLogEs=null,this.flashBrowserFirmwareBlobUrl="",this.serialPorts=[],this.serialScanning=!1,this.serialSelectedPort="",this.serialBaud=460800,this.serialApiKey="",this.serialName="",this.serialError=null}connectedCallback(){super.connectedCallback(),this.initFromBridgeConfig()}updated(t){var e;if(super.updated(t),t.has("flashCompileLog")){const i=(e=this.shadowRoot)==null?void 0:e.getElementById("flash-log-viewer");i&&(i.scrollTop=i.scrollHeight)}}async initFromBridgeConfig(){const t=await S.setupStatus();this.captureStatus(t);const e=this.integrationReady(t);t.bridge.configured?(this.activeBridgeUuid=t.bridge.uuid||null,this.bridgeHost=t.bridge.ip||null,t.bridge.connected?(this.step1="complete",this.startConfiguredBridgeFlow(t,e)):(this.step1="pending",this.validateAttempts=0,this.discoveryTimer&&(clearInterval(this.discoveryTimer),this.discoveryTimer=null),this.activeBridgeUuid&&S.bridgeReconnect(this.activeBridgeUuid),this.validatePollTimer=setInterval(()=>void this.pollValidateStatus(),1e3))):(this.step2!=="disabled"&&(this.step2="disabled"),this.step3!=="disabled"&&(this.step3="disabled"),this.step1="choose",this.step1Choice="choose",this.statusPollTimer=setInterval(()=>void this.pollStatus(),E.STATUS_POLL_INTERVAL_MS))}async startConfiguredBridgeFlow(t,e){t.restart.required?["restarting","polling","complete"].includes(this.step2)||(this.step2="ready"):(this.step2="complete",e?(this.step3="complete",this.onAllDone()):this.step3==="disabled"&&this.triggerIntegrationSetup()),this.statusPollTimer=setInterval(()=>void this.pollStatus(),E.STATUS_POLL_INTERVAL_MS)}get browserSupportsUsbFlash(){return typeof window<"u"&&window.isSecureContext&&"serial"in navigator}get flashChipFamily(){return dh(this.flashChipName)}clearFlashBrowserManifestUrl(){this.flashBrowserManifestUrl&&(URL.revokeObjectURL(this.flashBrowserManifestUrl),this.flashBrowserManifestUrl=""),this.flashBrowserFirmwareBlobUrl&&(URL.revokeObjectURL(this.flashBrowserFirmwareBlobUrl),this.flashBrowserFirmwareBlobUrl="")}async updateFlashBrowserManifestUrl(){if(!this.flashMac)return;const t=this.flashChipFamily;if(!t){this.clearFlashBrowserManifestUrl();return}try{const e=await fetch(S.downloadFactoryBinary(this.flashMac));if(!e.ok){this.clearFlashBrowserManifestUrl();return}const i=await e.blob(),s=URL.createObjectURL(i),r={name:this.flashName,version:"compiled",new_install_prompt_erase:!1,new_install_improv_wait_time:0,builds:[{chipFamily:t,parts:[{path:s,offset:0}]}]},n=new Blob([JSON.stringify(r)],{type:"application/json"}),o=URL.createObjectURL(n);this.clearFlashBrowserManifestUrl(),this.flashBrowserManifestUrl=o,this.flashBrowserFirmwareBlobUrl=s}catch{this.clearFlashBrowserManifestUrl()}}async pollValidateStatus(){if(this.step1!=="pending"){this.validatePollTimer&&(clearInterval(this.validatePollTimer),this.validatePollTimer=null);return}this.validateAttempts++;try{const t=await S.setupStatus();if(this.captureStatus(t),t.bridge.connected){this.step1="complete",this.validatePollTimer&&(clearInterval(this.validatePollTimer),this.validatePollTimer=null),this.startConfiguredBridgeFlow(t,this.integrationReady(t));return}}catch{}this.validateAttempts>=3&&(this.validatePollTimer&&(clearInterval(this.validatePollTimer),this.validatePollTimer=null),this.step1="error",this.startDiscovery(),this.statusPollTimer=setInterval(()=>void this.pollStatus(),E.STATUS_POLL_INTERVAL_MS))}disconnectedCallback(){this.statusPollTimer&&(clearInterval(this.statusPollTimer),this.statusPollTimer=null),this.integrationPollTimer&&(clearInterval(this.integrationPollTimer),this.integrationPollTimer=null),this.discoveryTimer&&(clearInterval(this.discoveryTimer),this.discoveryTimer=null),this.discoveryTimeoutTimer&&(clearTimeout(this.discoveryTimeoutTimer),this.discoveryTimeoutTimer=null),this.validatePollTimer&&(clearInterval(this.validatePollTimer),this.validatePollTimer=null),this.doneTimer&&(clearTimeout(this.doneTimer),this.doneTimer=null),this.flashCompilePollTimer&&(clearInterval(this.flashCompilePollTimer),this.flashCompilePollTimer=null),this.flashDetectTimer&&(clearInterval(this.flashDetectTimer),this.flashDetectTimer=null),this.flashCompileLogEs&&(this.flashCompileLogEs.close(),this.flashCompileLogEs=null),this.clearFlashBrowserManifestUrl(),super.disconnectedCallback()}async startDiscovery(){this.discoveryTimer&&(clearInterval(this.discoveryTimer),this.discoveryTimer=null),this.discoveryTimeoutTimer&&(clearTimeout(this.discoveryTimeoutTimer),this.discoveryTimeoutTimer=null),this.step1!=="complete"&&(this.step1="scanning"),this.bridgeError=null,await this.refreshDiscoveredBridges(),S.triggerScan().catch(t=>{const e=t instanceof Error?t.message:String(t);e.toLowerCase().includes("already")||(this.bridgeError=e)}),this.discoveryTimer=setInterval(()=>void this.refreshDiscoveredBridges(),2e3),this.discoveryTimeoutTimer=setTimeout(()=>{this.discoveryTimeoutTimer=null,this.discoveryTimer&&(clearInterval(this.discoveryTimer),this.discoveryTimer=null),this.step1==="scanning"&&(this.step1="error",this.bridgeError="No bridges found. Make sure your bridge is powered on and connected to the same network, then try again.")},E.MAX_DISCOVERY_DURATION_MS)}async refreshDiscoveredBridges(){if(!(this.step1==="complete"||this.step1==="connecting"||this.step1==="pending"))try{const t=await S.discoverBridges();this.discoveredBridges=t.bridges,this.discoveredBridges.length>0?(this.step1="found",this.bridgeError=null,this.discoveryTimer&&(clearInterval(this.discoveryTimer),this.discoveryTimer=null),this.discoveryTimeoutTimer&&(clearTimeout(this.discoveryTimeoutTimer),this.discoveryTimeoutTimer=null)):t.scanning?this.step1!=="error"&&(this.step1="scanning"):(this.step1="error",this.bridgeError="No bridges found. Make sure your bridge is powered on and connected to the same network, then try again.",this.discoveryTimer&&(clearInterval(this.discoveryTimer),this.discoveryTimer=null),this.discoveryTimeoutTimer&&(clearTimeout(this.discoveryTimeoutTimer),this.discoveryTimeoutTimer=null))}catch(t){this.bridgeError=t instanceof Error?t.message:String(t)}}async pollStatus(){try{const t=await S.setupStatus();this.captureStatus(t);const e=this.integrationReady(t);t.bridge.configured&&this.step1!=="pending"?(this.step1="complete",this.discoveryTimer&&(clearInterval(this.discoveryTimer),this.discoveryTimer=null),t.restart.required?["restarting","polling","complete"].includes(this.step2)||(this.step2="ready"):(this.step2="complete",!e&&this.step3==="disabled"&&this.triggerIntegrationSetup())):(this.step2!=="disabled"&&(this.step2="disabled"),this.step3!=="disabled"&&(this.step3="disabled")),t.bridge.configured&&!t.restart.required&&this.step2==="polling"&&(this.step2="complete",this.pollingSeconds=0,!e&&this.step3==="disabled"&&this.triggerIntegrationSetup()),e&&(this.step3="complete",this.integrationFailures=0,this.step1==="complete"&&this.step2==="complete"&&this.onAllDone()),this.step2==="polling"&&(this.pollingSeconds+=E.STATUS_POLL_INTERVAL_S)}catch{}}captureStatus(t){this.runningIntegrationVersion=t.integration.live_version||t.restart.running_version||t.integration.version||t.integration.runtime_version||null,this.latestIntegrationVersion=t.restart.latest_version||t.integration.latest_version||null,this.integrationDetected=!!(t.integration.loaded||t.integration.live_connected||t.integration.runtime_loaded||t.integration.entry_loaded||t.integration.ws_client_connected||t.integration.configured),t.bridge.ws_connected?this.bridgeApiStatus=`Bridge protobuf online: ${t.bridge.ip||t.bridge.hostname||"bridge"}`:this.bridgeApiStatus=null}integrationReady(t){const e=t.integration;return!!(e.configured||e.entry_loaded||e.ws_client_connected||e.loaded&&e.connected)&&!t.restart.required}async connectBridgeBySelect(t){if(!this.apiKeyInput.trim()){this.bridgeError="API key is required";return}this.step1="connecting",this.bridgeError=null;try{await S.selectBridge(t.host,t.port,t.name,t.version,this.apiKeyInput,t.network_id,t.hostname),this.step1="complete",this.step2="ready",this.pollStatus()}catch(e){this.step1="found",this.bridgeError=e instanceof Error?e.message:String(e)}}async connectManualBridge(){if(!this.manualHost.trim()){this.bridgeError="Host is required";return}this.step1="connecting",this.bridgeError=null;try{await S.addBridge(this.manualHost.trim(),this.manualPort,void 0,this.manualApiKey||"",""),this.step1="complete",this.step2="ready",this.pollStatus()}catch(t){this.step1=this.discoveredBridges.length>0?"found":"error",this.bridgeError=t instanceof Error?t.message:String(t)}}selectBridgeForApiKey(t){this.selectedBridge=t,this.discoveryTimer&&(clearInterval(this.discoveryTimer),this.discoveryTimer=null)}async handleRestart(){this.step2="restarting",this.restartError=null;try{const t=await S.requestRestart();t.success?(this.step2="polling",this.pollingSeconds=0):(this.step2="error",this.restartError=t.error||"Restart failed")}catch{this.step2="polling",this.pollingSeconds=0,this.restartError=null}}triggerIntegrationSetup(){["triggering","polling","complete"].includes(this.step3)||(this.step3="triggering",this.integrationError=null,this.integrationFailures=0,this.lastIntegrationSetupAttemptAt=Date.now(),S.integrationSetup().then(async t=>{const e=await S.setupStatus();if(this.captureStatus(e),this.integrationReady(e)){this.step3="complete",this.onAllDone();return}if(t.entry_created&&!t.restart_required){this.step3="complete",this.onAllDone();return}if(t.success&&!t.entry_created&&!t.restart_required){this.step3="fallback",this.integrationError="Integration created — restart Home Assistant first, then add ESP Tree in Devices & Services.";return}t.success?(this.step3="polling",this.pollStartTime=Date.now(),this.integrationPollTimer||(this.integrationPollTimer=setInterval(()=>void this.pollIntegrationForEntry(),E.STATUS_POLL_INTERVAL_MS))):(this.step3="error",this.integrationError=t.error||"Failed to set up integration")}).catch(t=>{this.step3="error",this.integrationError=t instanceof Error?t.message:String(t)}))}async pollIntegrationForEntry(){try{const t=await S.setupStatus();if(this.captureStatus(t),this.integrationFailures=0,this.integrationReady(t)){this.step3="complete",this.integrationPollTimer&&(clearInterval(this.integrationPollTimer),this.integrationPollTimer=null),this.onAllDone();return}const e=Date.now();if(e-this.lastIntegrationSetupAttemptAt>=1e4){this.lastIntegrationSetupAttemptAt=e;const i=await S.integrationSetup();if(i.entry_created&&!i.restart_required){this.step3="complete",this.integrationPollTimer&&(clearInterval(this.integrationPollTimer),this.integrationPollTimer=null),this.onAllDone();return}}Date.now()-this.pollStartTime>E.MAX_POLL_DURATION_MS&&(this.integrationPollTimer&&(clearInterval(this.integrationPollTimer),this.integrationPollTimer=null),this.step3="fallback")}catch{this.integrationFailures++,this.integrationFailures>=10&&(this.integrationPollTimer&&(clearInterval(this.integrationPollTimer),this.integrationPollTimer=null),this.step3="fallback")}}async onAllDone(){this.doneTimer||(this.doneTimer=setTimeout(()=>{this.doneTimer=null,window.location.hash="/"},2e3))}dismiss(){this.doneTimer&&(clearTimeout(this.doneTimer),this.doneTimer=null),this.dispatchEvent(new CustomEvent("setup-dismissed",{bubbles:!0,composed:!0})),window.location.hash="/"}retryDiscovery(){this.startDiscovery()}retryConnection(){this.step1="pending",this.validateAttempts=0,this.activeBridgeUuid&&S.bridgeReconnect(this.activeBridgeUuid),this.statusPollTimer&&(clearInterval(this.statusPollTimer),this.statusPollTimer=null),this.validatePollTimer=setInterval(()=>void this.pollValidateStatus(),1e3)}onChooseExistingBridge(){this.step1Choice="existing",this.flashTab="discover",this.startDiscovery()}onChooseNewBridge(){this.step1Choice="new",this.flashTab="flash",this.flashTransportChosen=!1,this.loadFlashWizardDefaults()}onChooseTransport(t){this.flashTransport=t,this.flashTransportChosen=!0,t==="serial"&&this.scanFlashSerialPorts()}onBackToChoose(){this.step1Choice="choose",this.step1="choose",this.bridgeError=null}async loadFlashWizardDefaults(){try{const t=await S.getSecrets().catch(()=>null);t!=null&&t.content&&this.parseSecretsForFlash(t.content),this.flashApiKey||(this.flashApiKey=this.generateRandomBase64(18)),this.flashOtaPassword||(this.flashOtaPassword=this.generateRandomHex(16))}catch{this.flashApiKey||(this.flashApiKey=this.generateRandomBase64(18)),this.flashOtaPassword||(this.flashOtaPassword=this.generateRandomHex(16))}}parseSecretsForFlash(t){if(!(!t||!t.trim()))try{const e=UC(t);if(!e||typeof e!="object")return;const i=e,s=typeof i.wifi_ssid=="string"?i.wifi_ssid:"",r=typeof i.wifi_password=="string"?i.wifi_password:"",n=typeof i.ota_password=="string"?i.ota_password:"",o=typeof i.bridge_api_key=="string"?i.bridge_api_key:"",a=typeof i.espnow_network_id=="string"?i.espnow_network_id:"",l=typeof i.espnow_psk=="string"?i.espnow_psk:"";if(s&&(this.flashWifiSsid=s),r&&(this.flashWifiPassword=r),n&&(this.flashOtaPassword=n),o&&(this.flashApiKey=o),a&&(this.flashNetworkId=a),l&&(this.flashPsk=l),this.flashPrefilledFields={wifiSsid:!!s,wifiPassword:!!r,otaPassword:!!n,apiKey:!!o,networkId:!!a,psk:!!l},a||l){const h=[a?"Network ID":"",l?"PSK":""].filter(Boolean).join(" and ");this.flashSecretsWarning=`Existing network credentials detected. ${h} pre-filled from your current configuration. Changing the Network ID or PSK will break communication with any existing remotes on this network.`}else this.flashSecretsWarning=""}catch{}}generateRandomBase64(t){const e=new Uint8Array(t);return crypto.getRandomValues(e),btoa(String.fromCharCode(...e)).replace(/[+/=]/g,"").slice(0,24)}generateRandomHex(t){const e=new Uint8Array(t);return crypto.getRandomValues(e),Array.from(e).map(i=>i.toString(16).padStart(2,"0")).join("")}async detectFlashBoardInBrowser(t=!1){this.flashBrowserDetecting=!0,this.flashBrowserDetectError="",this.flashDetectedChip="";try{if(!Rs())throw new Error("Browser USB detection requires a secure HTTPS page in Chrome or Edge");const e=await to({forcePicker:t});if(e==="cancelled"){this.flashBrowserDetecting=!1;return}this.flashBrowserPort=e;const{detected:i,family:s}=await ul(e);if(!s||!Pi[s])throw new Error(`Detected ${i}, but there is no supported board mapping for it`);this.flashChipName=s,this.flashBoardInfo=Pi[s].board_info,this.flashDetectedChip=i}catch(e){this.flashBrowserDetectError=e instanceof Error?e.message:String(e)}finally{this.flashBrowserDetecting=!1}}onFlashChipChange(t){var e;this.flashChipName=t,this.flashBoardInfo=((e=Pi[t])==null?void 0:e.board_info)||null,this.flashDetectedChip="",this.flashBrowserDetectError=""}validateFlashConfig(){const t=[];return this.flashName.trim()||t.push("ESPHome Name is required"),/^[a-z][a-z0-9-]*$/.test(this.flashName.trim())||t.push("ESPHome Name must be lowercase letters, numbers, and hyphens"),this.flashNetworkId.trim()||t.push("ESP-NOW Network ID is required"),this.flashPsk.trim()||t.push("ESP-NOW PSK is required"),!this.flashWifiSsid.trim()&&this.flashTransport==="wifi"&&t.push("WiFi SSID is required"),!this.flashWifiPassword.trim()&&this.flashTransport==="wifi"&&t.push("WiFi Password is required"),!this.flashSerialPort&&this.flashTransport==="serial"&&t.push("Serial port is required for serial transport"),/^[0-9a-fA-F]{64}$/.test(this.flashPsk.trim())||t.push("PSK must be 64 hex characters"),(!this.flashChipName||!Pi[this.flashChipName]||!this.flashBoardInfo)&&t.push("Board selection is required"),t.length>0?(this.flashConfigError=t.join(". ")+".",!1):(this.flashConfigError="",!0)}async onSubmitFlashConfig(){var e;if(!this.validateFlashConfig())return;this.flashStage="compiling",this.flashCompileLog="",this.flashCompilePercent=0,this.flashCompileStatus="",this.flashCompileError="",this.flashFlashError="",this.clearFlashBrowserManifestUrl();const t=this.flashBoardInfo||((e=Pi[this.flashChipName])==null?void 0:e.board_info)||{};try{const i=await S.submitFlashWizard({name:this.flashName.trim(),network_id:this.flashNetworkId.trim(),psk:this.flashPsk.trim(),wifi_ssid:this.flashWifiSsid.trim(),wifi_password:this.flashWifiPassword,api_key:this.flashApiKey,espnow_mode:this.flashEspnowMode,ota_password:this.flashOtaPassword,chip_name:this.flashChipName,board_info:t,transport:this.flashTransport,serial_port:this.flashTransport==="serial"?this.flashSerialPort:""});this.flashMac=i.mac,this.pollCompileStatus(),this.startCompileLogStream()}catch(i){this.flashCompileError=i instanceof Error?i.message:String(i),this.flashStage="error"}}async pollCompileStatus(){if(!(this.flashStage!=="compiling"||!this.flashMac)){try{const t=await S.getCompileStatus(this.flashMac),e=t.status||"";if(e==="idle"&&(this.flashCompileLog+=`[status: idle — waiting for compile job to start]
`),this.flashCompileStatus=e,this.flashCompilePercent=e==="compiled"?100:e==="failed"?0:e==="compile_queued"?t.queue_position!=null?Math.max(5,100-(t.queue_position||1)*10):5:e==="compiling"?Math.max(this.flashCompilePercent,10):Math.max(this.flashCompilePercent,2),e==="compiled"){this.flashCompilePercent=100,this.flashCompilePollTimer&&(clearInterval(this.flashCompilePollTimer),this.flashCompilePollTimer=null),this.flashCompileLogEs&&(this.flashCompileLogEs.close(),this.flashCompileLogEs=null),await this.updateFlashBrowserManifestUrl(),this.flashStage==="compiling"&&(this.flashStage="flashing");return}if(e==="failed"){this.flashCompileError=t.error||"Compilation failed",this.flashStage="error",this.cleanupFlashTimers();return}}catch(t){this.flashCompileLog+=`[poll error: ${t instanceof Error?t.message:String(t)}]
`}this.flashStage==="compiling"&&(this.flashCompilePollTimer=setTimeout(()=>void this.pollCompileStatus(),2e3))}}startCompileLogStream(){this.flashMac&&(this.flashCompileLogEs=S.streamCompileLogs(this.flashMac,t=>{this.flashCompileLog+=t+`
`},t=>{this.flashCompileLog+=`[SSE error: ${t.type||"connection failed"}]
`}))}get flashCompileStatusLabel(){return{idle:"Waiting to start...",compile_queued:"Queued for compilation...",compiling:"Compiling...",compiled:"Compile complete!",failed:"Compilation failed"}[this.flashCompileStatus]||this.flashCompileStatus}async scanFlashSerialPorts(){this.flashSerialPortScanning=!0;try{const t=await S.scanSerialPorts();this.flashSerialPorts=t,t.length===0&&(this.flashSerialFlashError="No serial ports found on the add-on host.")}catch(t){this.flashSerialFlashError=t instanceof Error?t.message:String(t)}finally{this.flashSerialPortScanning=!1}}async startSerialFlashFromWizard(){if(!(!this.flashMac||!this.flashSerialPort)){this.flashSerialFlashError="",this.flashSerialFlashStatus="flashing";try{await S.startSerialFlash(this.flashMac,this.flashSerialPort)}catch(t){this.flashSerialFlashError=t instanceof Error?t.message:String(t),this.flashSerialFlashStatus="failed";return}this.flashSerialFlashTimer=setInterval(()=>void this.pollSerialFlashStatus(),2e3)}}async pollSerialFlashStatus(){if(this.flashMac)try{const t=await S.getSerialFlashStatus(this.flashMac),e=t.status||"idle";this.flashSerialFlashStatus=e,(e==="success"||e==="failed")&&(this.flashSerialFlashTimer&&(clearInterval(this.flashSerialFlashTimer),this.flashSerialFlashTimer=null),e==="failed"&&(this.flashSerialFlashError=t.error||"Serial flash failed"))}catch{}}async flashInBrowser(){if(this.flashBrowserManifestUrl){this.flashBrowserFlashError="",this.flashBrowserFlashing=!0;try{await uh({manifestUrl:this.flashBrowserManifestUrl,port:this.flashBrowserPort,onClosed:()=>{this.flashBrowserFlashing=!1}})==="cancelled"&&(this.flashBrowserFlashError="No USB device was selected.",this.flashBrowserFlashing=!1)}catch(t){this.flashBrowserFlashError=t instanceof Error?t.message:String(t),this.flashBrowserFlashing=!1}}}async startDetection(){if(this.flashStage="detecting",this.flashDetectElapsed=0,this.flashDetectError="",this.flashTransport==="serial")try{await S.finalizeFlashWizard()}catch{}else await S.triggerScan().catch(()=>{});this.flashDetectTimer=setInterval(()=>void this.pollFlashWizardStatus(),2e3)}async pollFlashWizardStatus(){if(this.flashStage!=="detecting"){this.flashDetectTimer&&(clearInterval(this.flashDetectTimer),this.flashDetectTimer=null);return}if(this.flashDetectElapsed+=2,this.flashDetectElapsed>=90){this.flashDetectTimer&&(clearInterval(this.flashDetectTimer),this.flashDetectTimer=null),this.flashDetectError=this.flashTransport==="serial"?"Bridge did not authenticate over serial within 90 seconds. Check the port is correct and the bridge is powered.":"Bridge not found within 90 seconds. Ensure the bridge is powered on and connected to WiFi.",this.flashStage="error";return}try{(await S.getFlashWizardStatus()).bridge_detected&&(this.flashDetectTimer&&(clearInterval(this.flashDetectTimer),this.flashDetectTimer=null),this.flashStage="complete",this.step1="complete",this.step2="ready",this.pollStatus())}catch{}}get flashBackLabel(){return this.flashStage==="detecting"||this.flashStage==="error"&&this.flashDetectError?"Back to flashing":this.flashStage==="flashing"||this.flashStage==="compiling"||this.flashStage==="error"?"Back to configuration":this.flashStage==="config"&&this.flashTransportChosen?"Back to bridge type":"Back"}async handleFlashBack(){if(this.flashStage==="detecting"||this.flashStage==="error"&&this.flashDetectError){this.flashDetectTimer&&(clearInterval(this.flashDetectTimer),this.flashDetectTimer=null),this.flashDetectElapsed=0,this.flashDetectError="",this.flashStage="flashing";return}if(this.flashStage==="flashing"||this.flashStage==="error"){this.resetFlashWizard();return}if(this.flashStage==="compiling"){this.flashMac&&await S.cancelCompile(this.flashMac).catch(()=>{}),this.resetFlashWizard();return}if(this.flashTransportChosen){this.flashTransportChosen=!1;return}this.onBackToChoose()}resetFlashWizard(){this.cleanupFlashTimers(),this.flashStage="config",this.flashCompileLog="",this.flashCompilePercent=0,this.flashCompileStatus="",this.flashCompileError="",this.flashFlashError="",this.flashDetectElapsed=0,this.flashDetectError="",this.flashMac="",this.flashConfigError=""}cleanupFlashTimers(){this.flashCompilePollTimer&&(clearInterval(this.flashCompilePollTimer),this.flashCompilePollTimer=null),this.flashDetectTimer&&(clearInterval(this.flashDetectTimer),this.flashDetectTimer=null),this.flashCompileLogEs&&(this.flashCompileLogEs.close(),this.flashCompileLogEs=null),this.clearFlashBrowserManifestUrl()}render(){return p`
      <div class="setup-bar"><div class="setup-bar-inner">
        <span class="setup-brand">${Vd}ESP Tree</span>
        <button class="dismiss-btn" @click=${this.dismiss}>Skip for now</button>
      </div></div>
      <div class="wizard-page">
        <header class="wizard-header">
          <h1>Connect your network</h1>
          <p class="tagline">Connect an ESP-NOW bridge, then hand the network to Home Assistant. Three steps, a few minutes.</p>
        </header>

        <div class="stepper">
          ${this.renderStep1()}
          ${this.renderStep2()}
          ${this.renderStep3()}
          ${this.renderDone()}
        </div>
      </div>
    `}renderStep1(){const t=this.step1==="complete"&&this.step2!=="disabled";return p`
      <div class="step ${t?"collapsed":""} ${this.step1==="complete"?"done":""} ${this.step1==="error"?"has-error":""}">
        <div class="step-header" @click=${()=>{t&&this.requestUpdate()}}>
          <span class="step-icon">
            ${this.step1==="choose"?"1":this.step1==="scanning"?p`<span class="spinner"></span>`:this.step1==="connecting"?p`<span class="spinner"></span>`:this.step1==="pending"?p`<span class="spinner"></span>`:this.step1==="complete"?C("check"):this.step1==="error"?C("close"):"1"}
          </span>
          <div class="step-title-area">
            <h2>Connect your bridge</h2>
            <p class="step-summary">
              ${this.step1==="choose"?"Choose how to set up your bridge":this.step1==="scanning"?"Searching your network for bridges…":this.step1==="found"?`${this.discoveredBridges.length} bridge(s) found`:this.step1==="connecting"?"Connecting to the bridge…":this.step1==="pending"?"Checking the bridge connection…":this.step1==="complete"?"Bridge connected":this.step1==="error"?this.activeBridgeUuid?"Bridge offline":"No bridges found":""}
            </p>
          </div>
          ${t?p`<span class="collapse-icon">${C("chevronRight")}</span>`:v}
        </div>

        ${t?v:p`
          <div class="step-body">
            ${this.step1==="choose"&&this.step1Choice==="choose"?p`
              <div class="choice-cards">
                <button class="choice-card" @click=${this.onChooseExistingBridge}>
                  <span class="choice-icon">${C("search")}</span>
                  <h3>I already have a bridge</h3>
                  <p>Scan your network for an existing ESP-NOW bridge or enter its address manually.</p>
                </button>
                <button class="choice-card" @click=${this.onChooseNewBridge}>
                  <span class="choice-icon">${C("usb")}</span>
                  <h3>Set up a new bridge</h3>
                  <p>Flash ESP-NOW firmware onto a new ESP32 device and configure it.</p>
                </button>
              </div>
            `:v}

            ${this.step1Choice==="existing"&&this.step1!=="complete"?p`
              <div class="choice-back">
                <button class="btn btn-outline btn-sm" @click=${this.onBackToChoose}>${C("chevronLeft")}Back</button>
              </div>
              <div class="step-tabs">
                <button class="tab ${this.flashTab==="discover"?"active":""}" @click=${()=>this.flashTab="discover"}>Discover</button>
                <button class="tab ${this.flashTab==="manual"?"active":""}" @click=${()=>this.flashTab="manual"}>Manual</button>
                <button class="tab ${this.flashTab==="serial"?"active":""}" @click=${()=>this.flashTab="serial"}>Serial</button>
              </div>
              ${this.flashTab==="discover"?this.renderDiscoverTab():v}
              ${this.flashTab==="manual"?this.renderManualTab():v}
              ${this.flashTab==="serial"?this.renderSerialTab():v}
            `:v}

            ${this.step1Choice==="new"&&this.step1!=="complete"?p`
              <div class="choice-back">
                <button class="btn btn-outline btn-sm" @click=${()=>void this.handleFlashBack()}>${C("chevronLeft")}${this.flashBackLabel}</button>
              </div>
              ${this.renderFlashTab()}
            `:v}

            ${this.step1==="complete"&&this.step2==="disabled"?p`
              <div class="complete-state">
                <span class="check">${C("checkCircle")}</span>
                <span>${this.bridgeApiStatus||"Bridge connected successfully"}</span>
              </div>
            `:v}
          </div>
        `}
      </div>
    `}renderDiscoverTab(){return p`
      ${this.step1==="scanning"||this.step1==="connecting"||this.step1==="pending"?p`
        <div class="scanning-state">
          <span class="spinner large"></span>
          <p>${this.step1==="scanning"?"Searching your network for bridges…":this.step1==="connecting"?"Connecting to the bridge…":"Checking the bridge connection…"}</p>
        </div>
      `:v}

      ${this.step1==="found"?p`
        ${this.discoveredBridges.length>0?p`
          <div class="bridge-list">
            ${this.discoveredBridges.map(t=>p`
              <div class="bridge-card">
                <div class="bridge-info">
                  <strong>${t.name||t.host}</strong>
                  <span>${t.hostname||t.host}:${t.port}</span>
                  ${t.network_id?p`<span class="net-id">Network: ${t.network_id}</span>`:v}
                </div>
                ${this.selectedBridge===t?p`
                  <div class="api-key-row">
                    <input
                      type="password"
                      placeholder="API Key"
                      .value=${this.apiKeyInput}
                      @input=${e=>this.apiKeyInput=e.target.value}
                    />
                    <button class="btn btn-primary" @click=${()=>this.connectBridgeBySelect(t)}>
                      Connect
                    </button>
                  </div>
                `:p`
                  <button class="btn btn-outline" @click=${()=>this.selectBridgeForApiKey(t)}>
                    Connect
                  </button>
                `}
              </div>
            `)}
          </div>
        `:v}
      `:v}

      ${this.step1==="pending"||this.step1==="error"&&this.activeBridgeUuid?p`
        <div class="bridge-list">
            <div class="bridge-card offline">
              <div class="bridge-info">
                <strong>${this.bridgeHost||"Bridge"}</strong>
                <span>${this.bridgeHost?`${this.bridgeHost}:${this.bridgePort}`:""}</span>
                <span class="net-id">Offline</span>
              </div>
              <button class="btn btn-outline" @click=${this.retryConnection}>
                Retry Connection
              </button>
            </div>
        </div>
      `:v}

      ${this.step1==="error"&&!this.activeBridgeUuid?p`
        <div class="error-block">
          <p>${this.bridgeError||"No bridges found on your network."}</p>
          <button class="btn btn-primary" @click=${this.retryDiscovery}>Rescan</button>
          <span class="hint">You can also try the Manual tab to connect by IP address.</span>
        </div>
      `:v}

      ${this.step1!=="connecting"&&this.step1!=="pending"&&this.step1!=="complete"&&!(this.step1==="error"&&!this.activeBridgeUuid)?p`
        ${this.bridgeError?p`
          <div class="error-block">
            <p>${this.bridgeError}</p>
            <button class="btn btn-outline" @click=${this.retryDiscovery}>Retry</button>
          </div>
        `:v}
      `:v}
    `}renderManualTab(){return p`
      <div class="manual-form">
        <label>
          Host / IP
          <input type="text" placeholder="192.168.1.50 or hostname.local" .value=${this.manualHost} @input=${t=>this.manualHost=t.target.value} />
        </label>
        <label>
          Port
          <input type="number" min="1" max="65535" .value=${String(this.manualPort)} @input=${t=>this.manualPort=Number(t.target.value||80)} />
        </label>
        <label>
          API Key
          <input type="password" placeholder="API Key (optional)" .value=${this.manualApiKey} @input=${t=>this.manualApiKey=t.target.value} />
        </label>
        <button class="btn btn-primary" @click=${this.connectManualBridge}>
          Connect
        </button>
      </div>
      ${this.bridgeError?p`
        <div class="error-block">
          <p>${this.bridgeError}</p>
          <button class="btn btn-outline" @click=${this.retryDiscovery}>Retry</button>
        </div>
      `:v}
    `}async scanSerialPorts(){this.serialScanning=!0,this.serialError=null;try{const t=await S.scanSerialPorts();this.serialPorts=t,t.length===0&&(this.serialError="No serial ports found.")}catch(t){this.serialError=t instanceof Error?t.message:String(t)}finally{this.serialScanning=!1}}async connectSerialBridge(){if(!this.serialSelectedPort){this.serialError="Select a serial port";return}this.serialError=null,this.step1="connecting";try{await S.addBridge("",80,this.serialName||void 0,this.serialApiKey||"","","serial",this.serialSelectedPort,this.serialBaud),this.step1="complete",this.step2="ready",this.pollStatus()}catch(t){this.step1="error",this.serialError=t instanceof Error?t.message:String(t)}}renderSerialTab(){return p`
      <div class="manual-form">
        <label>
          Serial Port
          <div class="flash-key-row">
            <select .value=${this.serialSelectedPort} @change=${t=>this.serialSelectedPort=t.target.value}>
              <option value="">-- Select port --</option>
              ${this.serialPorts.map(t=>p`
                <option value=${t.port} ?selected=${this.serialSelectedPort===t.port}>${t.label||t.port}${t.available?"":" (unavailable)"}</option>
              `)}
            </select>
            <button class="btn btn-outline btn-sm" @click=${()=>void this.scanSerialPorts()} ?disabled=${this.serialScanning}>
              ${this.serialScanning?"Scanning...":"Scan Ports"}
            </button>
          </div>
        </label>
        <label>
          Or enter a port / network serial URL
          <input type="text" placeholder="socket://192.168.1.50:7000 or /dev/ttyUSB0"
            .value=${this.serialSelectedPort}
            @input=${t=>this.serialSelectedPort=t.target.value} />
        </label>
        <label>
          Baud Rate
          <input type="number" min="9600" max="921600" .value=${String(this.serialBaud)} @input=${t=>this.serialBaud=Number(t.target.value)||460800} />
        </label>
        <label>
          API Key
          <input type="password" placeholder="API Key (optional)" .value=${this.serialApiKey} @input=${t=>this.serialApiKey=t.target.value} />
        </label>
        <label>
          Name
          <input type="text" placeholder="Bridge name (optional)" .value=${this.serialName} @input=${t=>this.serialName=t.target.value} />
        </label>
        <button class="btn btn-primary" @click=${()=>void this.connectSerialBridge()} ?disabled=${this.serialScanning||!this.serialSelectedPort}>
          Connect
        </button>
      </div>
      ${this.serialError?p`
        <div class="error-block">
          <p>${this.serialError}</p>
          <button class="btn btn-outline" @click=${this.retryDiscovery}>Retry</button>
        </div>
      `:v}
    `}renderFlashTab(){var t;return this.flashStage!=="config"?this.renderFlashProgress():this.flashTransportChosen?p`
      <div class="flash-stage-indicator">
        <span class="stage-dot active">Configure</span>
        <span class="stage-line"></span>
        <span class="stage-dot">Compile</span>
        <span class="stage-line"></span>
        <span class="stage-dot">Flash</span>
        <span class="stage-line"></span>
        <span class="stage-dot">Detect</span>
      </div>

      <div class="flash-form">
        <div class="transport-badge">${this.flashTransport==="serial"?"Serial (USB-UART) transport":"Wi-Fi transport"}</div>

        ${this.flashSecretsWarning?p`
          <div class="flash-warning">${this.flashSecretsWarning}</div>
        `:v}
        ${this.flashConfigError?p`
          <div class="error-block"><p>${this.flashConfigError}</p></div>
        `:v}

        <label>
          ESPHome Name
          <input type="text" placeholder="espnow-bridge" .value=${this.flashName} @input=${e=>this.flashName=e.target.value} />
        </label>

        <label>
          ESP-NOW Network ID ${this.prefillTag("networkId")}
          <input type="text" placeholder="ESP-NOW network name" .value=${this.flashNetworkId} @input=${e=>this.flashNetworkId=e.target.value} />
        </label>

        <label>
          ESP-NOW PSK (64 hex chars) ${this.prefillTag("psk")}
          <div class="flash-key-row">
            <input type="text" placeholder="32-byte hex key" .value=${this.flashPsk} @input=${e=>this.flashPsk=e.target.value} />
            <button class="btn btn-outline btn-sm" @click=${()=>this.flashPsk=this.generateRandomHex(32)}>Generate</button>
          </div>
        </label>

        ${this.flashTransport==="wifi"?p`
          <label>
            WiFi SSID ${this.prefillTag("wifiSsid")}
            <input type="text" placeholder="WiFi network name" .value=${this.flashWifiSsid} @input=${e=>this.flashWifiSsid=e.target.value} />
          </label>

          <label>
            WiFi Password ${this.prefillTag("wifiPassword")}
            <input type="password" placeholder="WiFi password" .value=${this.flashWifiPassword} @input=${e=>this.flashWifiPassword=e.target.value} />
          </label>
        `:p`
          <label>
            Serial Port
            <div class="flash-key-row">
              <select .value=${this.flashSerialPort} @change=${e=>this.flashSerialPort=e.target.value}>
                <option value="">-- Select port --</option>
                ${this.flashSerialPorts.map(e=>p`
                  <option value=${e.port} ?selected=${this.flashSerialPort===e.port}>${e.label||e.port}${e.available?"":" (unavailable)"}</option>
                `)}
              </select>
              <button class="btn btn-outline btn-sm" @click=${()=>void this.scanFlashSerialPorts()} ?disabled=${this.flashSerialPortScanning}>
                ${this.flashSerialPortScanning?"Scanning...":"Rescan"}
              </button>
            </div>
          </label>
          <label>
            Or enter a port / network serial URL
            <input type="text" placeholder="socket://192.168.1.50:7000 or /dev/ttyUSB0"
              .value=${this.flashSerialPort}
              @input=${e=>this.flashSerialPort=e.target.value} />
          </label>
          ${this.flashSerialFlashError?p`
            <div class="flash-warning">${this.flashSerialFlashError}</div>
          `:v}
          <div class="flash-warning">
            Serial transport: no WiFi credentials are needed. The bridge talks to the add-on over its
            UART0 pins (wired to a USB-UART adapter), and the console is pinned to the same UART so
            boot logs and panic backtraces stay readable. If the adapter is on another host, point the
            add-on at it with a <code>socket://host:port</code> URL served by a TCP serial bridge.
          </div>
        `}

        <label>
          ESP-NOW Mode
          <select .value=${this.flashEspnowMode} @change=${e=>this.flashEspnowMode=e.target.value}>
            <option value="lr">Long Range (LR)</option>
            <option value="regular">Regular</option>
          </select>
        </label>

        <label>
          Board
          <div class="flash-key-row">
            <select .value=${this.flashChipName} @change=${e=>this.onFlashChipChange(e.target.value)}>
              <option value="">-- Detect or select board --</option>
              ${Object.entries(Pi).map(([e,i])=>p`
                <option value=${e} ?selected=${this.flashChipName===e}>${i.label}</option>
              `)}
            </select>
            <button class="btn btn-outline btn-sm" @click=${()=>void this.detectFlashBoardInBrowser()} ?disabled=${this.flashBrowserDetecting}>
              ${this.flashBrowserDetecting?"Detecting...":"Detect Connected ESP"}
            </button>
            <button class="btn btn-outline btn-sm" @click=${()=>void this.detectFlashBoardInBrowser(!0)} ?disabled=${this.flashBrowserDetecting}>
              Choose device…
            </button>
          </div>
        </label>

        ${this.flashDetectedChip?p`
          <div class="chip-badge detected">Detected: ${this.flashDetectedChip} → ${((t=Pi[this.flashChipName])==null?void 0:t.label)||this.flashChipName}</div>
        `:v}
        ${this.flashBrowserDetectError?p`
          <div class="flash-warning">Automatic detection failed: ${this.flashBrowserDetectError}. You can select the board manually.</div>
        `:v}

        <div class="flash-warning">
          Connect the new ESP to this computer by USB and click Detect Connected ESP before compiling. Detection uses Web Serial in Chrome/Edge. Manual board selection is available as a fallback.
        </div>

        <details class="advanced-section">
          <summary>Advanced</summary>
          <div class="advanced-body">
            <label>
              API Key ${this.prefillTag("apiKey")} <span class="muted">(will be remembered by addon)</span>
              <div class="flash-key-row">
                <input type="text" placeholder="Auto-generated" .value=${this.flashApiKey} @input=${e=>this.flashApiKey=e.target.value} />
                <button class="btn btn-outline btn-sm" @click=${()=>this.flashApiKey=this.generateRandomBase64(18)}>Generate</button>
              </div>
            </label>

            <label>
              OTA Password ${this.prefillTag("otaPassword")} <span class="muted">(will be remembered by addon)</span>
              <div class="flash-key-row">
                <input type="text" placeholder="Auto-generated" .value=${this.flashOtaPassword} @input=${e=>this.flashOtaPassword=e.target.value} />
                <button class="btn btn-outline btn-sm" @click=${()=>this.flashOtaPassword=this.generateRandomHex(16)}>Generate</button>
              </div>
            </label>
          </div>
        </details>

        <button class="btn btn-primary" @click=${()=>this.onSubmitFlashConfig()} ?disabled=${!this.flashChipName||!this.flashName.trim()}>Compile Bridge Firmware</button>
      </div>
    `:this.renderTransportChoice()}renderTransportChoice(){return p`
      <div class="flash-stage-indicator">
        <span class="stage-dot active">Configure</span>
        <span class="stage-line"></span>
        <span class="stage-dot">Compile</span>
        <span class="stage-line"></span>
        <span class="stage-dot">Flash</span>
        <span class="stage-line"></span>
        <span class="stage-dot">Detect</span>
      </div>

      <div class="choice-cards">
        <button class="choice-card" @click=${()=>this.onChooseTransport("wifi")}>
          <span class="choice-icon">${C("wifi")}</span>
          <h3>Wi-Fi Bridge</h3>
          <p>Connects to the add-on over your Wi-Fi network. You'll need the network name and password.</p>
        </button>
        <button class="choice-card" @click=${()=>this.onChooseTransport("serial")}>
          <span class="choice-icon">${C("usb")}</span>
          <h3>Serial Bridge</h3>
          <p>Connects over a USB-UART link to the add-on. No Wi-Fi credentials needed.</p>
        </button>
      </div>
    `}prefillTag(t){return this.flashPrefilledFields[t]?p`<span class="prefill-tag">pre-filled</span>`:v}renderFlashProgress(){const e=["config","compiling","flashing","detecting","complete"].indexOf(this.flashStage);return p`
      <div class="flash-stage-indicator">
        <span class="stage-dot ${e>0?"done":"active"}">Configure</span>
        <span class="stage-line ${e>0?"done":""}"></span>
        <span class="stage-dot ${e>1?"done":e===1?"active":""}">Compile</span>
        <span class="stage-line ${e>1?"done":""}"></span>
        <span class="stage-dot ${e>2?"done":e===2?"active":""}">Browser Flash</span>
        <span class="stage-line ${e>2?"done":""}"></span>
        <span class="stage-dot ${e>3?"done":e===3?"active":""}">Detect</span>
      </div>

      ${this.flashStage==="compiling"?p`
        <div class="flash-progress-area">
          <h3>Compiling Firmware</h3>
          <p class="muted">Building ESPHome firmware for ${this.flashName}...</p>
          ${this.flashCompileStatus?p`
            <p class="muted compile-status-label">${this.flashCompileStatusLabel}</p>
          `:v}
          ${this.flashCompilePercent>0?p`
            <div class="progress-bar-container">
              <div class="progress-bar" style="width: ${this.flashCompilePercent}%"></div>
            </div>
            <p class="muted">${this.flashCompilePercent}%</p>
          `:v}
          <div class="flash-log-viewer" id="flash-log-viewer">${this.flashCompileLog}</div>
        </div>
      `:v}

      ${this.flashStage==="flashing"?p`
        <div class="flash-progress-area">
          ${this.flashTransport==="serial"?p`
            <h3>Flash over Serial</h3>
            <p class="muted">Firmware is ready. Connect the bridge to the add-on host and flash it over the selected port.</p>
            <div class="transport-badge">Port: ${this.flashSerialPort||"not selected"}</div>
            ${this.flashSerialFlashStatus==="flashing"?p`
              <div class="progress-bar-container"><div class="progress-bar" style="width: 100%"></div></div>
              <p class="muted">Flashing ${this.flashName}...</p>
            `:v}
            ${this.flashSerialFlashStatus==="success"?p`
              <div class="complete-state"><span class="check">${C("checkCircle")}</span><span>Flashed over serial.</span></div>
            `:v}
            ${this.flashSerialFlashStatus==="failed"?p`
              <div class="flash-warning">Serial flash failed: ${this.flashSerialFlashError||"see log"}</div>
            `:v}
            <div class="flash-error-actions">
              <button class="btn btn-outline" @click=${()=>void this.handleFlashBack()}>Back to Configure</button>
              <button class="btn btn-primary"
                @click=${()=>void this.startSerialFlashFromWizard()}
                ?disabled=${!this.flashSerialPort||this.flashSerialFlashStatus==="flashing"}>Flash over Serial</button>
              <button class="btn btn-primary"
                @click=${()=>void this.startDetection()}
                ?disabled=${!this.flashMac||this.flashSerialFlashStatus!=="success"}>I Flashed It, Connect Bridge</button>
            </div>
          `:p`
            <h3>Flash in Browser</h3>
            <p class="muted">Firmware is ready. Connect ${this.flashName} to this computer by USB and flash it from this page.</p>
            <div class="flash-browser-actions">
              ${this.flashBrowserManifestUrl?p`
                <button class="btn btn-primary"
                  @click=${()=>void this.flashInBrowser()}
                  ?disabled=${this.flashBrowserFlashing}>
                  ${this.flashBrowserFlashing?"Flashing…":"Flash via Browser USB"}
                </button>
                ${this.flashBrowserPort?p`
                  <span class="chip-badge">Device already granted — no USB prompt needed.</span>
                `:""}
                ${this.flashBrowserFlashError?p`<div class="flash-warning">${this.flashBrowserFlashError}</div>`:""}
              `:p`
                <div class="flash-warning">
                  Browser USB flashing is not available for this build in the current tab. Download the factory binary and flash it with your preferred tool.
                </div>
              `}
              <a class="btn" href=${this.flashMac?S.downloadFactoryBinary(this.flashMac):"#"} download>Download factory .bin</a>
              <a class="btn" href=${this.flashMac?S.downloadCompileBinary(this.flashMac):"#"} download>Download .ota.bin</a>
            </div>
            <p class="muted">
              ${this.browserSupportsUsbFlash?"When the USB flash finishes and the bridge is powered on, continue to detection.":"Browser USB flashing is unavailable here. Flash the downloaded factory binary locally, then continue to detection."}
            </p>
            <div class="flash-error-actions">
              <button class="btn btn-outline" @click=${()=>void this.handleFlashBack()}>Back to Configure</button>
              <button class="btn btn-primary" @click=${()=>void this.startDetection()} ?disabled=${!this.flashMac}>I Flashed It, Detect Bridge</button>
            </div>
          `}
          ${this.flashCompileLog?p`
            <details class="flash-log-details">
              <summary>View Build Log</summary>
              <div class="flash-log-viewer">${this.flashCompileLog}</div>
            </details>
          `:v}
        </div>
      `:v}

      ${this.flashStage==="detecting"?p`
        <div class="flash-progress-area">
          <h3>${this.flashTransport==="serial"?"Connecting Bridge":"Detecting Bridge"}</h3>
          <p class="muted">${this.flashTransport==="serial"?`Starting the add-on's serial client (${this.flashDetectElapsed}s elapsed)...`:`Waiting for the bridge to come online (${this.flashDetectElapsed}s elapsed)...`}</p>
          <div class="scanning-state">
            <span class="spinner large"></span>
            <p>${this.flashTransport==="serial"?"Waiting for the bridge to authenticate over serial...":"Waiting for bridge to appear on network..."}</p>
          </div>
          <div class="flash-error-actions">
            <button class="btn btn-outline" @click=${()=>void this.handleFlashBack()}>Back to Flash</button>
          </div>
        </div>
      `:v}

      ${this.flashStage==="complete"?p`
        <div class="flash-progress-area">
          <div class="complete-state">
            <span class="check">${C("checkCircle")}</span>
            <span>Bridge detected and connected!</span>
          </div>
        </div>
      `:v}

      ${this.flashStage==="error"?p`
        <div class="flash-progress-area">
          <div class="error-block">
            <p>${this.flashCompileError||this.flashFlashError||this.flashDetectError||"An error occurred"}</p>
            <div class="flash-error-actions">
              <button class="btn btn-outline" @click=${()=>void this.handleFlashBack()}>${this.flashDetectError?"Back to Flash":"Back to Configure"}</button>
              ${this.flashDetectError?p`
                <button class="btn btn-outline" @click=${()=>{this.flashStage="detecting",this.flashDetectError="",this.startDetection()}}>Retry Scan</button>
                <button class="btn btn-outline" @click=${()=>{this.resetFlashWizard(),this.step1Choice="choose",this.step1="choose"}}>Skip</button>
              `:v}
            </div>
          </div>
          ${this.flashCompileLog?p`
            <details class="flash-log-details">
              <summary>View Log</summary>
              <div class="flash-log-viewer">${this.flashCompileLog}</div>
            </details>
          `:v}
        </div>
      `:v}
    `}renderStep2(){const t=this.step2==="complete"&&this.step3!=="disabled",e=this.runningIntegrationVersion||(this.integrationDetected?"detected, version unknown":"not loaded");return p`
      <div class="step ${this.step2==="disabled"?"locked":""} ${t?"collapsed":""} ${this.step2==="complete"?"done":""} ${this.step2==="error"?"has-error":""}">
        <div class="step-header">
          <span class="step-icon">
            ${this.step2==="disabled"?C("lock"):this.step2==="restarting"?p`<span class="spinner"></span>`:this.step2==="polling"?p`<span class="spinner"></span>`:this.step2==="complete"?C("check"):this.step2==="error"?C("close"):"2"}
          </span>
          <div class="step-title-area">
            <h2>Restart Home Assistant</h2>
            <p class="step-summary">
              ${this.step2==="disabled"?"Complete step 1 first":this.step2==="ready"?"Home Assistant needs to restart to activate the integration":this.step2==="restarting"?"Restarting...":this.step2==="polling"?`Waiting for Home Assistant to come back online... (${this.pollingSeconds}s)`:this.step2==="complete"?"Home Assistant restarted successfully":this.step2==="error"?"Restart failed":""}
            </p>
          </div>
          ${t?p`<span class="collapse-icon">${C("chevronRight")}</span>`:v}
        </div>

        ${t?v:p`
          <div class="step-body">
            ${this.step2==="disabled"?p`
              <p class="muted">Connect a bridge first to continue.</p>
            `:v}

            ${this.step2==="ready"?p`
              <p>
                Home Assistant needs to restart to activate the ESP Tree integration
                ${e==="not loaded"?p`
                  — it will be installed as version ${this.latestIntegrationVersion||"latest"}.
                `:p`
                  from ${e} to ${this.latestIntegrationVersion||"latest"}.
                `}
              </p>
              <button class="btn btn-primary" @click=${this.handleRestart}>
                Restart Home Assistant
              </button>
            `:v}

            ${this.step2==="restarting"?p`
              <div class="scanning-state">
                <span class="spinner large"></span>
                <p>Sending restart request...</p>
              </div>
            `:v}

            ${this.step2==="polling"?p`
              <div class="polling-state">
                <span class="spinner large"></span>
                <p>Waiting for Home Assistant to come back online...</p>
                ${this.pollingSeconds>40?p`
                  <p class="muted">Taking longer than expected. Check if Home Assistant restarted successfully.</p>
                `:v}
              </div>
            `:v}

            ${this.step2==="complete"?p`
              <div class="complete-state">
                <span class="check">${C("checkCircle")}</span>
                <span>
                  Home Assistant is running the ESP Tree integration
                  ${this.runningIntegrationVersion?` ${this.runningIntegrationVersion}`:""}
                </span>
              </div>
            `:v}

            ${this.step2==="error"&&this.restartError?p`
              <div class="error-block">
                <p>Restart failed: ${this.restartError}</p>
                <button class="btn btn-outline" @click=${this.handleRestart}>Retry</button>
              </div>
            `:v}
          </div>
        `}
      </div>
    `}renderStep3(){return p`
      <div class="step ${this.step3==="disabled"?"locked":""} ${this.step3==="complete"?"done":""}">
        <div class="step-header">
          <span class="step-icon">
            ${this.step3==="disabled"?C("lock"):this.step3==="triggering"?p`<span class="spinner"></span>`:this.step3==="polling"?p`<span class="spinner"></span>`:this.step3==="complete"?C("check"):this.step3==="fallback"?C("alert"):this.step3==="error"?C("close"):"3"}
          </span>
          <div class="step-title-area">
            <h2>Add the ESP Tree integration</h2>
            <p class="step-summary">
              ${this.step3==="disabled"?"Complete step 2 first":this.step3==="triggering"?"Setting up the ESP Tree integration...":this.step3==="polling"?"Waiting for integration to activate...":this.step3==="complete"?"ESP Tree integration is active":this.step3==="fallback"?"Manual setup required":this.step3==="error"?"Could not set up integration":""}
            </p>
          </div>
        </div>

        <div class="step-body">
          ${this.step3==="disabled"?p`
            <p class="muted">Restart Home Assistant first to continue.</p>
          `:v}

          ${this.step3==="triggering"?p`
            <div class="scanning-state">
              <span class="spinner large"></span>
              <p>Setting up the ESP Tree integration...</p>
            </div>
          `:v}

          ${this.step3==="polling"?p`
            <div class="polling-state">
              <span class="spinner large"></span>
              <p>Waiting for integration to become active...</p>
            </div>
          `:v}

          ${this.step3==="complete"?p`
            <div class="complete-state">
              <span class="check">${C("checkCircle")}</span>
              <span>
                ESP Tree integration is active
                ${this.runningIntegrationVersion?` (${this.runningIntegrationVersion})`:""}
              </span>
            </div>
          `:v}

          ${this.step3==="fallback"?p`
            <div class="fallback-state">
              <p>Integration created — add it in Devices &amp; Services to activate:</p>
              <div class="fallback-actions">
                <button class="btn btn-outline" @click=${()=>window.open("/config/integrations/dashboard","_blank")}>
                  Open Devices &amp; Services
                </button>
                <button class="btn btn-outline" @click=${()=>window.open("/config/integrations/dashboard/add?domain=esp_tree","_blank")}>
                  Add ESP Tree Integration
                </button>
              </div>
              <button class="btn" @click=${()=>{this.integrationFailures=0,this.triggerIntegrationSetup()}}>
                Retry
              </button>
            </div>
          `:v}

          ${this.step3==="error"&&this.integrationError?p`
            <div class="error-block">
              <p>Could not set up integration automatically: ${this.integrationError}</p>
              <div class="fallback-actions">
                <button class="btn btn-outline" @click=${()=>window.open("/config/integrations/dashboard","_blank")}>
                  Open Devices &amp; Services
                </button>
                <button class="btn btn-outline" @click=${()=>window.open("/config/integrations/dashboard/add?domain=esp_tree","_blank")}>
                  Add ESP Tree Integration
                </button>
              </div>
              <button class="btn" @click=${()=>{this.integrationError=null,this.triggerIntegrationSetup()}}>
                Retry
              </button>
            </div>
          `:v}
        </div>
      </div>
    `}renderDone(){return this.step1!=="complete"||this.step2!=="complete"||this.step3!=="complete"?v:p`
      <div class="step done expanded">
        <div class="step-header">
          <span class="step-icon">${C("checkCircle")}</span>
          <div class="step-title-area">
            <h2>Setup Complete!</h2>
            <p class="step-summary">Redirecting to topology map...</p>
          </div>
        </div>
        <div class="step-body done-body">
          <button class="btn btn-primary" @click=${this.dismiss}>Go Now</button>
        </div>
      </div>
    `}};E.MAX_POLL_DURATION_MS=300*1e3;E.MAX_DISCOVERY_DURATION_MS=30*1e3;E.STATUS_POLL_INTERVAL_MS=1e3;E.STATUS_POLL_INTERVAL_S=E.STATUS_POLL_INTERVAL_MS/1e3;E.styles=de`
    :host {
      display: block;
      min-height: 100vh;
      background: var(--canvas);
      color: var(--ink);
      font-family: var(--font-sans);
      -webkit-font-smoothing: antialiased;
    }

    * { box-sizing: border-box; }

    .wizard-page {
      max-width: 680px;
      margin: 0 auto;
      padding: 40px 24px;
    }

    .wizard-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 32px;
      padding-bottom: 20px;
      border-bottom: 2px solid var(--line);
    }

    .wizard-header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
      color: var(--primary);
    }

    .tagline {
      margin: 6px 0 0;
      color: var(--muted);
      font-size: 15px;
    }

    .dismiss-btn {
      border: 1px solid var(--line);
      background: var(--surface);
      color: var(--muted);
      padding: 8px 16px;
      font: inherit;
      font-size: 13px;
      cursor: pointer;
      border-radius: 8px;
      white-space: nowrap;
      transition: all 0.15s;
    }

    .dismiss-btn:hover {
      border-color: var(--muted);
      color: var(--ink);
    }

    .stepper {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .step {
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: 12px;
      box-shadow: var(--shadow);
      overflow: hidden;
      transition: opacity 0.2s;
    }

    .step.locked {
      opacity: 0.55;
    }

    .step.done {
      border-color: var(--ok);
    }

    .step.has-error {
      border-color: var(--danger);
    }

    .step-header {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      padding: 18px 20px;
    }

    .step.collapsed .step-header {
      cursor: pointer;
    }

    .step-icon {
      flex-shrink: 0;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      background: var(--surface-subtle);
      border-radius: 50%;
      margin-top: 2px;
    }

    .step.complete .step-icon,
    .step.done .step-icon {
      background: var(--ok-soft);
    }

    .step-title-area {
      flex: 1;
    }

    .step-title-area h2 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }

    .step-summary {
      margin: 4px 0 0;
      font-size: 13px;
      color: var(--muted);
    }

    .collapse-icon {
      font-size: 12px;
      color: var(--muted);
      margin-top: 6px;
    }

    .step-body {
      padding: 0 20px 20px 70px;
    }

    .step.collapsed .step-body {
      display: none;
    }

    .scanning-state,
    .polling-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px 0;
      gap: 12px;
    }

    .scanning-state p,
    .polling-state p {
      margin: 0;
      font-size: 14px;
      color: var(--muted);
    }

    .complete-state {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 0;
      font-size: 14px;
      font-weight: 500;
      color: var(--ok);
    }

    .step-body.done-body {
      padding: 0 20px 20px 70px;
    }

    .step-body.done-body .btn {
      margin-top: 4px;
    }

    .check {
      font-size: 18px;
    }

    .bridge-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 16px;
    }

    .bridge-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      background: var(--surface-subtle);
      border: 1px solid var(--surface-subtle);
      border-radius: 10px;
      gap: 12px;
      flex-wrap: wrap;
    }

    .bridge-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      font-size: 13px;
    }

    .bridge-info strong {
      font-size: 14px;
    }

    .net-id {
      font-size: var(--text-xs);
      color: var(--muted);
      font-family: monospace;
    }

    .api-key-row {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .api-key-row input {
      padding: 6px 10px;
      font-size: 13px;
      border: 1px solid var(--line);
      border-radius: 6px;
      width: 180px;
    }

    .manual-toggle {
      margin-bottom: 12px;
    }

    .manual-form {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 16px;
      background: var(--surface-subtle);
      border: 1px solid var(--surface-subtle);
      border-radius: 10px;
      margin-bottom: 12px;
    }

    .manual-form label {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 12px;
      font-weight: 600;
      color: var(--muted);
      text-transform: uppercase;
    }

    .manual-form input {
      padding: 8px 12px;
      font-size: 14px;
      border: 1px solid var(--line);
      border-radius: 8px;
      font-family: inherit;
    }

    .error-block {
      margin-top: 12px;
      padding: 12px 16px;
      background: var(--danger-soft);
      border: 1px solid var(--line);
      border-radius: 8px;
    }

    .error-block p {
      margin: 0 0 8px;
      color: var(--danger);
      font-size: 13px;
    }

    .error-block .hint {
      display: block;
      margin-top: 4px;
      font-size: 12px;
      color: var(--muted);
    }

    .fallback-state {
      padding: 16px;
      background: var(--accent-soft);
      border: 1px solid var(--line);
      border-radius: 8px;
      margin-top: 8px;
    }

    .fallback-state p {
      margin: 0 0 12px;
      font-size: 14px;
    }

    .fallback-actions {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
      flex-wrap: wrap;
    }

    .btn {
      border: 1px solid var(--line);
      background: var(--surface);
      color: var(--ink);
      padding: 8px 16px;
      font: inherit;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      border-radius: 8px;
      transition: all 0.15s;
    }

    .btn:hover {
      background: var(--surface-subtle);
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-primary {
      background: var(--primary);
      color: var(--on-primary);
      border-color: var(--primary);
    }

    .btn-primary:hover {
      background: var(--primary);
    }

    .btn-outline {
      border-color: var(--primary);
      color: var(--primary);
      background: transparent;
    }

    .btn-outline:hover {
      background: rgba(11, 59, 75, 0.06);
    }

    .muted {
      color: var(--muted);
      font-size: 13px;
    }

    .spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 3px solid rgba(11, 59, 75, 0.2);
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }

    .spinner.large {
      width: 32px;
      height: 32px;
      border-width: 4px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 600px) {
      .wizard-page {
        padding: 24px 16px;
      }

      .wizard-header {
        flex-direction: column;
        gap: 12px;
      }

      .step-body {
        padding: 0 16px 16px 54px;
      }

      .bridge-card {
        flex-direction: column;
        align-items: flex-start;
      }

      .flash-form label {
        font-size: var(--text-xs);
      }

      .flash-key-row {
        flex-direction: column;
      }

      .flash-port-row {
        flex-direction: column;
      }
    }

    .choice-cards {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }

    .choice-card {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px 16px;
      border: 2px solid var(--line);
      border-radius: 12px;
      background: var(--surface);
      cursor: pointer;
      transition: all 0.15s;
      text-align: center;
      font: inherit;
      color: var(--ink);
    }

    .choice-card:hover {
      border-color: var(--primary);
      background: rgba(0, 0, 0, 0.02);
      transform: translateY(-1px);
    }

    .choice-icon {
      font-size: 32px;
      margin-bottom: 8px;
    }

    .choice-card h3 {
      margin: 0 0 8px 0;
      font-size: 15px;
      font-weight: 600;
    }

    .choice-card p {
      margin: 0;
      font-size: 13px;
      color: var(--muted);
      line-height: 1.4;
    }

    .choice-back {
      margin-bottom: 12px;
    }

    .step-tabs {
      display: flex;
      gap: 0;
      margin-bottom: 16px;
      border-bottom: 2px solid var(--line);
    }

    .tab {
      padding: 10px 18px;
      border: none;
      background: transparent;
      color: var(--muted);
      font: inherit;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
      transition: all 0.15s;
    }

    .tab:hover {
      color: var(--ink);
    }

    .tab.active {
      color: var(--primary);
      border-bottom-color: var(--primary);
    }

    .flash-form {
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 16px;
      background: var(--surface-subtle);
      border: 1px solid var(--surface-subtle);
      border-radius: 10px;
    }

    .flash-form label {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 12px;
      font-weight: 600;
      color: var(--muted);
      text-transform: uppercase;
    }

    .flash-form input,
    .flash-form select {
      padding: 8px 12px;
      font-size: 14px;
      border: 1px solid var(--line);
      border-radius: 8px;
      font-family: inherit;
      background: var(--surface);
    }

    .flash-form select {
      cursor: pointer;
    }

    .flash-warning {
      padding: 10px 14px;
      background: var(--accent-soft);
      border: 1px solid var(--line);
      border-radius: 8px;
      font-size: 13px;
      color: var(--accent);
    }

    .transport-badge {
      display: inline-block;
      align-self: flex-start;
      padding: 4px 10px;
      border-radius: 999px;
      background: var(--info-soft);
      border: 1px solid var(--line);
      color: var(--primary);
      font-size: 12px;
      font-weight: 600;
    }

    .prefill-tag {
      display: inline-block;
      margin-left: 6px;
      padding: 1px 7px;
      border-radius: 999px;
      background: var(--ok-soft);
      border: 1px solid var(--line);
      color: var(--ok);
      font-size: var(--text-xs);
      font-weight: 600;
      text-transform: none;
      letter-spacing: 0.02em;
      vertical-align: middle;
    }

    .advanced-section {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--surface);
      padding: 0 12px;
    }

    .advanced-section summary {
      cursor: pointer;
      padding: 10px 0;
      font-size: 12px;
      font-weight: 600;
      color: var(--muted);
      text-transform: uppercase;
      list-style: none;
    }

    .advanced-section summary::-webkit-details-marker {
      display: none;
    }

    .advanced-section summary::before {
      content: '▸';
      display: inline-block;
      margin-right: 6px;
      transition: transform 0.15s;
    }

    .advanced-section[open] summary::before {
      transform: rotate(90deg);
    }

    .advanced-body {
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding-bottom: 12px;
    }

    .flash-key-row {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .flash-key-row input {
      flex: 1;
    }

    .flash-port-row {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .flash-port-row select {
      flex: 1;
    }

    .btn-sm {
      padding: 4px 10px;
      font-size: 12px;
    }

    .chip-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
    }

    .chip-badge.detected {
      background: var(--ok-soft);
      color: var(--ok);
      border: 1px solid var(--line);
    }

    .chip-badge.detecting {
      background: var(--info-soft);
      color: var(--primary);
      border: 1px solid var(--line);
    }

    .chip-badge.error {
      background: var(--danger-soft);
      color: var(--danger);
      border: 1px solid var(--line);
      flex-wrap: wrap;
    }

    .chip-board-info {
      font-size: var(--text-xs);
      color: var(--muted);
      font-weight: 400;
    }

    .flash-stage-indicator {
      display: flex;
      align-items: center;
      gap: 0;
      margin-bottom: 16px;
      padding: 12px 0;
    }

    .stage-dot {
      font-size: 12px;
      font-weight: 500;
      color: var(--muted);
      padding: 4px 10px;
      border-radius: 12px;
      white-space: nowrap;
    }

    .stage-dot.active {
      color: var(--primary);
      background: var(--info-soft);
      font-weight: 600;
    }

    .stage-dot.done {
      color: var(--ok);
      background: var(--ok-soft);
    }

    .stage-line {
      flex: 1;
      height: 2px;
      background: var(--line);
      min-width: 12px;
    }

    .stage-line.done {
      background: var(--ok);
    }

    .flash-progress-area {
      padding: 16px 0;
    }

    .flash-progress-area h3 {
      margin: 0 0 8px;
      font-size: 16px;
    }

    .flash-log-viewer {
      max-height: 200px;
      overflow-y: auto;
      font-family: monospace;
      font-size: var(--text-xs);
      background: var(--log-bg);
      color: var(--log-ink);
      padding: 12px;
      border-radius: 8px;
      white-space: pre-wrap;
      word-break: break-all;
      margin-top: 12px;
    }

    .compile-status-label {
      font-style: italic;
      margin: 4px 0;
    }

    .flash-error-actions {
      display: flex;
      gap: 8px;
      margin-top: 8px;
      flex-wrap: wrap;
    }

    .flash-log-details {
      margin-top: 12px;
    }

    .flash-log-details summary {
      cursor: pointer;
      font-size: 13px;
      color: var(--muted);
    }

    .progress-bar-container {
      width: 100%;
      height: 8px;
      background: var(--line);
      border-radius: 4px;
      overflow: hidden;
      margin: 8px 0;
    }

    .progress-bar {
      height: 100%;
      background: var(--primary);
      border-radius: 4px;
      transition: width 0.3s;
    }

    /* ---- Setup shell: HA-native, shared tokens ---- */
    .setup-bar { background: var(--toolbar); color: var(--toolbar-ink); }
    .setup-bar-inner { display: flex; align-items: center; justify-content: space-between; gap: 16px; max-width: 760px; height: var(--toolbar-h); margin: 0 auto; padding: 0 24px; }
    .setup-brand { display: inline-flex; align-items: center; gap: 10px; font-size: var(--text-xl); font-weight: 500; }
    .setup-brand .brand-mark { width: 26px; height: 26px; color: var(--toolbar-indicator); }
    .dismiss-btn { min-height: 36px; padding: 0 14px; border: 1px solid rgba(255,255,255,.3); border-radius: var(--radius-md); background: transparent; color: var(--toolbar-ink); font: inherit; font-size: var(--text-md); font-weight: 500; cursor: pointer; }
    .dismiss-btn:hover { background: var(--toolbar-hover); }
    .wizard-page { max-width: 760px; padding: 24px 24px 56px; }
    .wizard-header { display: block; margin-bottom: 20px; padding-bottom: 0; border-bottom: 0; }
    .wizard-header h1 { margin: 0; color: var(--ink); font-size: var(--text-2xl); line-height: 1.2; font-weight: 500; }
    .tagline { margin: 4px 0 0; color: var(--muted); font-size: var(--text-md); line-height: 1.45; }
    .stepper { gap: 12px; }
    .step { border: 1px solid var(--line); border-radius: var(--radius-lg); background: var(--surface); box-shadow: none; }
    .step.disabled, .step.locked { opacity: 0.7; }
    .step-header { padding: 16px; gap: 14px; }
    .step-icon { display: grid; place-items: center; width: 32px; height: 32px; border-radius: 50%; background: var(--surface-subtle); color: var(--muted); font-size: var(--text-md); font-weight: 500; margin-top: 0; }
    .step-icon svg { width: 18px; height: 18px; }
    .step.done .step-icon, .step.complete .step-icon { background: var(--ok-soft); color: var(--ok); }
    .step.has-error .step-icon { background: var(--danger-soft); color: var(--danger); }
    .step-title-area h2 { color: var(--ink); font-size: var(--text-lg); font-weight: 500; letter-spacing: 0; }
    .step-summary { margin-top: 2px; color: var(--muted); font-size: var(--text-sm); }
    .collapse-icon svg { width: 18px; height: 18px; color: var(--muted); }
    .step-body, .step-body.done-body { padding: 0 16px 18px 62px; }
    .choice-cards { display: grid !important; grid-template-columns: 1fr; gap: 0; margin-bottom: 14px; border-top: 1px solid var(--line); }
    .choice-card { display: grid !important; grid-template-columns: 36px 1fr; column-gap: 14px; align-items: center; min-height: 0; padding: 14px 8px; border: 0; border-bottom: 1px solid var(--line); border-radius: 0; background: transparent; color: var(--ink); text-align: left; transition: background-color 150ms ease; }
    .choice-card:hover { background: var(--surface-hover); transform: none; box-shadow: none; }
    .choice-card .choice-icon { grid-row: 1 / 3; }
    .choice-icon { display: grid; place-items: center; width: 36px; height: 36px; margin-bottom: 0; border: 0; border-radius: 50%; background: var(--primary-soft); color: var(--primary); }
    .choice-icon svg { width: 20px; height: 20px; }
    .choice-card h3 { margin: 0 0 4px !important; font-size: var(--text-md) !important; font-weight: 500 !important; }
    .choice-card p { color: var(--muted); font-size: var(--text-sm) !important; line-height: 1.5 !important; }
    .tab { padding: 10px 14px; font-size: var(--text-md); font-weight: 500; color: var(--muted); }
    .tab.active { border-bottom-color: var(--primary); color: var(--primary); }
    .step-tabs { margin-bottom: 14px; border-bottom: 1px solid var(--line); }
    .flash-form, .manual-form { padding: 16px; border: 1px solid var(--line); border-radius: var(--radius-md); background: var(--surface-subtle); }
    .flash-form label, .manual-form label { color: var(--ink-2); font-size: var(--text-sm); font-weight: 500; letter-spacing: 0; text-transform: none; }
    .flash-form input, .flash-form select, .manual-form input, .api-key-row input { min-height: 40px; padding: 8px 12px; border: 1px solid var(--line-strong); border-radius: var(--radius-md); background: var(--surface); color: var(--ink); font: inherit; font-size: var(--text-md); }
    .flash-form input:focus, .flash-form select:focus, .manual-form input:focus, .api-key-row input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 1px var(--primary); }
    .bridge-card { padding: 12px 14px; border: 1px solid var(--line); border-radius: var(--radius-md); background: var(--surface); }
    .bridge-info { font-size: var(--text-sm); color: var(--muted); }
    .bridge-info strong { font-size: var(--text-md); font-weight: 500; color: var(--ink); }
    .btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; min-height: 36px; padding: 0 14px; border: 1px solid var(--line-strong); border-radius: var(--radius-md); background: var(--surface); color: var(--ink); font: inherit; font-size: var(--text-md); font-weight: 500; cursor: pointer; }
    .btn:hover:not(:disabled) { background: var(--surface-hover); }
    .btn:disabled { opacity: .5; cursor: not-allowed; }
    .btn svg { width: 18px; height: 18px; }
    .btn-primary { border-color: var(--primary); background: var(--primary); color: var(--on-primary); }
    .btn-primary:hover:not(:disabled) { background: var(--primary-strong); border-color: var(--primary-strong); }
    .btn-outline { border-color: var(--line-strong); color: var(--ink); background: transparent; }
    .btn-outline:hover:not(:disabled) { background: var(--surface-hover); }
    .btn-sm { min-height: 30px; padding: 0 10px; font-size: var(--text-sm); }
    .btn-sm svg { width: 16px; height: 16px; }
    .transport-badge { padding: 2px 8px; border: 0; border-radius: 999px; background: var(--surface-subtle); color: var(--ink-2); font-size: var(--text-xs); }
    .prefill-tag { background: var(--primary-soft); border-color: transparent; color: var(--primary); font-size: var(--text-xs); }
    .advanced-section { border-color: var(--line); background: var(--surface-subtle); }
    .advanced-section summary { color: var(--ink-2); font-size: var(--text-sm); font-weight: 500; }
    .flash-warning, .fallback-state { border: 0; background: var(--accent-soft); color: var(--ink); font-size: var(--text-md); }
    .error-block { border: 0; background: var(--danger-soft); }
    .error-block p { color: var(--danger); font-size: var(--text-md); }
    .chip-badge { font-size: var(--text-xs); }
    .chip-badge.detected { border-color: transparent; background: var(--ok-soft); color: var(--ok); }
    .chip-badge.detecting { border-color: transparent; background: var(--info-soft); color: var(--info); }
    .chip-badge.error { border-color: transparent; background: var(--danger-soft); color: var(--danger); }
    .stage-dot.active { background: var(--primary-soft); color: var(--primary); }
    .stage-dot.done { background: var(--ok-soft); color: var(--ok); }
    .flash-log-viewer { background: var(--log-bg); color: var(--log-ink); font-family: var(--font-mono); font-size: var(--text-xs); border-radius: var(--radius-md); }
    .progress-bar-container { background: var(--surface-subtle); }
    .check svg { width: 20px; height: 20px; color: var(--ok); }
    :focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
    @media (max-width: 620px) {
      .setup-bar-inner { padding: 0 16px; }
      .wizard-page { padding: 18px 16px 40px; }
      .step-body, .step-body.done-body { padding: 0 16px 16px; }
      .choice-cards { flex-direction: column; }
    }
    @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; } }
  `;I([b()],E.prototype,"step1",2);I([b()],E.prototype,"step1Choice",2);I([b()],E.prototype,"step2",2);I([b()],E.prototype,"step3",2);I([b()],E.prototype,"discoveredBridges",2);I([b()],E.prototype,"bridgeError",2);I([b()],E.prototype,"manualHost",2);I([b()],E.prototype,"manualPort",2);I([b()],E.prototype,"manualApiKey",2);I([b()],E.prototype,"apiKeyInput",2);I([b()],E.prototype,"selectedBridge",2);I([b()],E.prototype,"restartError",2);I([b()],E.prototype,"integrationError",2);I([b()],E.prototype,"runningIntegrationVersion",2);I([b()],E.prototype,"latestIntegrationVersion",2);I([b()],E.prototype,"integrationDetected",2);I([b()],E.prototype,"bridgeApiStatus",2);I([b()],E.prototype,"statusPollTimer",2);I([b()],E.prototype,"integrationPollTimer",2);I([b()],E.prototype,"integrationFailures",2);I([b()],E.prototype,"pollingSeconds",2);I([b()],E.prototype,"flashTab",2);I([b()],E.prototype,"flashStage",2);I([b()],E.prototype,"flashName",2);I([b()],E.prototype,"flashNetworkId",2);I([b()],E.prototype,"flashPsk",2);I([b()],E.prototype,"flashWifiSsid",2);I([b()],E.prototype,"flashWifiPassword",2);I([b()],E.prototype,"flashApiKey",2);I([b()],E.prototype,"flashEspnowMode",2);I([b()],E.prototype,"flashOtaPassword",2);I([b()],E.prototype,"flashChipName",2);I([b()],E.prototype,"flashTransport",2);I([b()],E.prototype,"flashTransportChosen",2);I([b()],E.prototype,"flashPrefilledFields",2);I([b()],E.prototype,"flashSerialPort",2);I([b()],E.prototype,"flashSerialPorts",2);I([b()],E.prototype,"flashSerialPortScanning",2);I([b()],E.prototype,"flashSerialFlashStatus",2);I([b()],E.prototype,"flashSerialFlashError",2);I([b()],E.prototype,"flashBoardInfo",2);I([b()],E.prototype,"flashBrowserDetecting",2);I([b()],E.prototype,"flashBrowserDetectError",2);I([b()],E.prototype,"flashDetectedChip",2);I([b()],E.prototype,"flashBrowserFlashing",2);I([b()],E.prototype,"flashBrowserFlashError",2);I([b()],E.prototype,"flashSecretsWarning",2);I([b()],E.prototype,"flashConfigError",2);I([b()],E.prototype,"flashMac",2);I([b()],E.prototype,"flashCompileLog",2);I([b()],E.prototype,"flashCompilePercent",2);I([b()],E.prototype,"flashCompileStatus",2);I([b()],E.prototype,"flashCompileError",2);I([b()],E.prototype,"flashFlashError",2);I([b()],E.prototype,"flashDetectElapsed",2);I([b()],E.prototype,"flashDetectError",2);I([b()],E.prototype,"flashBrowserManifestUrl",2);I([b()],E.prototype,"serialPorts",2);I([b()],E.prototype,"serialScanning",2);I([b()],E.prototype,"serialSelectedPort",2);I([b()],E.prototype,"serialBaud",2);I([b()],E.prototype,"serialApiKey",2);I([b()],E.prototype,"serialName",2);I([b()],E.prototype,"serialError",2);E=I([Se("esp-setup-wizard")],E);var zC=Object.defineProperty,qC=Object.getOwnPropertyDescriptor,X=(t,e,i,s)=>{for(var r=s>1?void 0:s?qC(e,i):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(s?o(e,i,r):o(r))||r);return s&&r&&zC(e,i,r),r};let z=class extends pe{constructor(){super(...arguments),this.name="espnow-remote",this.chips=[],this.chipName="",this.loadingChips=!1,this.detectingChip=!1,this.chipDetectionError="",this.detectedChipName="",this.networkId="",this.psk="",this.bridgeName="",this.credentialsComplete=!1,this.networkIdSource="",this.pskSource="",this.credentialsMismatch=!1,this.bridgeNetworkId="",this.loadingCredentials=!1,this.stage="config",this.error="",this.mac="",this.esphomeName="",this.compilePercent=0,this.compileStatus="",this.manifestUrl="",this.firmwareBlobUrl="",this.preparingManifest=!1,this.usbSupported=!0,this.flashError="",this.flashing=!1,this.flashNeedsConfirm=!1,this.browserFlashPort=null,this.autoInstall=!1,this.haStatus="checking",this.haDeviceId="",this.haBusy=!1,this.haNotice="",this.haPollTimer=null,this.haPollAttempts=0,this.pollTimer=null}connectedCallback(){super.connectedCallback(),this.usbSupported=this.detectUsbSupport(),this.loadChips(),this.loadCredentials()}disconnectedCallback(){this.clearPoll(),this.clearHaPoll(),this.clearManifestUrls(),super.disconnectedCallback()}detectUsbSupport(){return Rs()}async detectChip(t=!1){this.chipDetectionError="",this.detectedChipName="",this.detectingChip=!0;try{if(!this.detectUsbSupport())throw new Error("USB chip detection requires Chrome or Edge on a secure HTTPS page. You can select the chip manually instead.");const e=await to({forcePicker:t});if(e==="cancelled"){this.detectingChip=!1;return}this.browserFlashPort=e;const{detected:i,family:s}=await ul(e),r=s&&this.chips.find(n=>n.chip_name.toUpperCase()===s);if(!s||!r)throw new Error(`Detected ${i}, but this chip is not in the supported firmware list. Choose a supported chip manually.`);this.chipName=r.chip_name,this.detectedChipName=i}catch(e){this.chipDetectionError=e instanceof Error?e.message:String(e)}finally{this.detectingChip=!1}}clearPoll(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}clearManifestUrls(){this.manifestUrl&&(URL.revokeObjectURL(this.manifestUrl),this.manifestUrl=""),this.firmwareBlobUrl&&(URL.revokeObjectURL(this.firmwareBlobUrl),this.firmwareBlobUrl="")}async loadChips(){this.loadingChips=!0;try{const t=await S.getChips();this.chips=t.chips??[]}catch(t){this.error=t instanceof Error?t.message:String(t)}finally{this.loadingChips=!1}}async loadCredentials(){this.loadingCredentials=!0;try{const t=await S.getBridgeNetworkCredentials();this.networkId=t.network_id??"",this.psk=t.psk??"",this.bridgeName=t.bridge_name??"",this.credentialsComplete=!!t.complete,this.networkIdSource=t.network_id_source??"",this.pskSource=t.psk_source??"",this.credentialsMismatch=!!t.mismatch,this.bridgeNetworkId=t.bridge_network_id??""}catch(t){this.error=t instanceof Error?t.message:String(t)}finally{this.loadingCredentials=!1}}get selectedChip(){return this.chips.find(t=>t.chip_name===this.chipName)}get chipFamily(){return this.chipName||null}canSubmit(t={}){var i;if(((i=this.selectedChip)==null?void 0:i.buildable)===!1)return!1;const e=t.chipOptional?!this.chipName||!!this.selectedChip:!!(this.chipName&&this.selectedChip);return!!(this.name.trim()&&e&&this.networkId.trim()&&this.psk.trim())}async compileAndInstall(){if(this.canSubmit({chipOptional:!0})){this.chipDetectionError="",this.flashError="",this.flashNeedsConfirm=!1;try{const t=this.browserFlashPort??await to();if(t==="cancelled")return;this.browserFlashPort=t,this.detectingChip=!0;const{detected:e,family:i}=await ul(t),s=i&&this.chips.find(r=>r.chip_name.toUpperCase()===i);if(!i||!s)throw new Error(`Detected ${e}, but this chip is not in the supported firmware list. Choose a different device or select a chip and use Compile only.`);if(this.chipName&&this.chipName.toUpperCase()!==i)throw new Error(`The connected board is ${e}, but ${this.chipName} is selected. Choose the matching chip, or pick a different device.`);this.chipName=s.chip_name,this.detectedChipName=e}catch(t){this.chipDetectionError=t instanceof Error?t.message:String(t);return}finally{this.detectingChip=!1}this.autoInstall=!0,await this.submit()}}async submit(){const t=this.selectedChip;if(!(!this.canSubmit()||!t)){this.error="",this.stage="compiling",this.compilePercent=0,this.compileStatus="";try{const e=await S.submitFlashWizard({name:this.name.trim(),network_id:this.networkId.trim(),psk:this.psk.trim(),wifi_ssid:"",wifi_password:"",api_key:"",espnow_mode:"lr",ota_password:"",chip_name:this.chipName,board_info:{platform:t.platform,board:t.board,framework:t.framework,...t.variant?{variant:t.variant}:{}},transport:"espnow",kind:"remote"});this.mac=e.mac,this.esphomeName=e.esphome_name,this.startCompilePoll()}catch(e){this.error=e instanceof Error?e.message:String(e),this.stage="error"}}}startCompilePoll(){this.clearPoll(),this.pollTimer=setInterval(()=>{this.pollCompile()},3e3),this.pollCompile()}async pollCompile(){if(this.mac)try{const t=await S.getCompileStatus(this.mac),e=t.status||"idle";if(this.compileStatus=e,e==="compiled"){this.compilePercent=100,this.clearPoll(),this.stage="ready",this.prepareManifest().then(()=>{this.autoInstall&&this.manifestUrl&&this.browserFlashPort&&this.flashInBrowser()});return}if(e==="failed"){this.clearPoll(),this.error=t.error||"Compilation failed",this.stage="error";return}if(e==="compile_queued"){const i=t.queue_position??1;this.compilePercent=Math.max(5,100-i*10)}else e==="compiling"?this.compilePercent=Math.max(this.compilePercent,10):this.compilePercent=Math.max(this.compilePercent,2)}catch{}}get compileStatusLabel(){const t=this.esphomeName||this.name.trim();return this.compileStatus==="compile_queued"?`Queued to compile ${t}`:this.compileStatus==="idle"?"Waiting for the compiler":`Compiling ${t}`}async prepareManifest(){if(!this.mac)return;const t=this.chipFamily;if(!t){this.error="Could not determine the chip family for browser flashing.";return}this.preparingManifest=!0;try{const e=await fetch(S.downloadFactoryBinary(this.mac));if(!e.ok){this.error="Compiled, but no factory image is available for browser flashing. Check the queue page for the build log.";return}const i=URL.createObjectURL(await e.blob()),s={name:this.esphomeName||this.name.trim(),version:"compiled",new_install_prompt_erase:!1,new_install_improv_wait_time:0,builds:[{chipFamily:t,parts:[{path:i,offset:0}]}]},r=URL.createObjectURL(new Blob([JSON.stringify(s)],{type:"application/json"}));this.clearManifestUrls(),this.manifestUrl=r,this.firmwareBlobUrl=i}catch(e){this.error=e instanceof Error?e.message:String(e)}finally{this.preparingManifest=!1}}async flashInBrowser(){if(this.manifestUrl){this.flashError="",this.flashing=!0;try{await uh({manifestUrl:this.manifestUrl,port:this.browserFlashPort,onFinished:()=>void this.onBrowserFlashDone(),onClosed:()=>{this.stage!=="done"&&(this.flashNeedsConfirm=!0)}})==="cancelled"&&(this.flashError="No USB device was selected.")}catch(t){this.flashError=t instanceof Error?t.message:String(t)}finally{this.flashing=!1}}}async onBrowserFlashDone(){this.clearPoll();try{await S.finalizeFlashWizard()}catch{}this.clearManifestUrls(),this.stage="done",this.watchForHaIntegration()}watchForHaIntegration(){this.clearHaPoll(),this.haStatus="checking",this.haDeviceId="",this.haPollAttempts=0,this.checkHaIntegration(),this.haPollTimer=setInterval(()=>void this.checkHaIntegration(),z.HA_POLL_INTERVAL_MS)}clearHaPoll(){this.haPollTimer&&(clearInterval(this.haPollTimer),this.haPollTimer=null)}async checkHaIntegration(){if(this.mac){this.haPollAttempts+=1;try{const e=(await S.topology(!0)).find(i=>Z(i.mac)===Z(this.mac));if(!e)this.haStatus="waiting-for-join";else if(e.ha_device_id){this.haStatus="managed",this.haDeviceId=e.ha_device_id,this.clearHaPoll();return}else this.haStatus="unmanaged"}catch{this.haStatus="waiting-for-join"}this.haPollAttempts>=z.HA_POLL_MAX_ATTEMPTS&&this.clearHaPoll()}}async addToHomeAssistant(){if(!this.haBusy){this.haBusy=!0,this.haNotice="";try{const t=await S.integrationSetup();!t.success&&t.error&&(this.haNotice=t.error),await this.checkHaIntegration(),this.haStatus!=="managed"&&(this.haPollAttempts=0,this.clearHaPoll(),this.haPollTimer=setInterval(()=>void this.checkHaIntegration(),z.HA_POLL_INTERVAL_MS))}catch(t){this.haNotice=t instanceof Error?t.message:String(t)}finally{this.haBusy=!1}}}startOver(){this.clearPoll(),this.clearHaPoll(),this.stage="config",this.autoInstall=!1,this.error="",this.compileStatus="",this.compilePercent=0,this.mac="",this.esphomeName="",this.haStatus="checking",this.haDeviceId="",this.haNotice=""}renderSteps(){const t=["config","compiling","ready","done"],e=this.stage==="flashing"?"ready":this.stage==="error"?"config":this.stage,i=t.indexOf(e);return p`<ol class="steps" aria-label="Progress">
      ${["Describe","Build","Flash","Join"].map((r,n)=>p`<li class=${n<i?"done":n===i?"current":""} aria-current=${n===i?"step":"false"}>
        <span class="n">${n<i?C("check"):n+1}</span>${r}</li>`)}
    </ol>`}renderHaIntegrationStep(){return this.haStatus==="managed"?p`
        <div class="ha-step ha-ok">
          <span class="ha-icon ok">${C("checkCircle")}</span>
          <div>
            <strong>Added to Home Assistant</strong>
            <p class="hint">
              This remote's entities are available in Home Assistant.
            </p>
            <a class="btn" href=${`/config/devices/device/${this.haDeviceId}`} target="_top" rel="noopener">
              Open device in Home Assistant
            </a>
          </div>
        </div>
      `:this.haStatus==="checking"||this.haStatus==="waiting-for-join"?p`
        <div class="ha-step">
          <span class="ha-icon"><span class="spinner"></span></span>
          <div>
            <strong>Waiting for the remote to join</strong>
            <p class="hint">
              Once the bridge sees it, this step adds it to Home Assistant so its entities appear.
            </p>
          </div>
        </div>
      `:p`
      <div class="ha-step ha-action">
        <span class="ha-icon warn">${C("ha")}</span>
        <div>
          <strong>Last step: add it to Home Assistant</strong>
          <p class="hint">
            The remote is on the mesh, but Home Assistant has no device for it yet, so its
            entities are not available. Add it here — the integration detects it
            automatically. (Adding it from Devices &amp; Services does not work; that page
            can only install the integration itself, which is already installed.)
          </p>
          ${this.haNotice?p`<p class="hint ha-error">${this.haNotice}</p>`:v}
          <button class="btn primary" ?disabled=${this.haBusy} @click=${()=>void this.addToHomeAssistant()}>
            ${this.haBusy?"Adding…":"Add to Home Assistant"}
          </button>
        </div>
      </div>
    `}credentialsLabel(){return this.loadingCredentials?"loading…":this.credentialsComplete?this.bridgeName?`from bridge ${this.bridgeName}`:"from secrets.yaml":"not configured"}sourceLabel(t){return!t||t==="missing"?"missing":`from ${t}`}render(){return p`
      <div class="page remote-page">
        <div>
          <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Network</a>${C("chevronRight")}<span aria-current="page">Add remote</span></nav>
          <div class="page-head">
            <div>
              <h1>Add a remote</h1>
              <p class="sub">Plug a board into this computer by USB. The add-on builds ESP-NOW firmware, your browser writes it, and the remote joins on its own.</p>
            </div>
          </div>
        </div>
        ${this.renderSteps()}
      <section class="card">
        <div class="card-body">
          ${this.error?p`<div class="notice danger" role="alert">${C("alert")}<span>${this.error}</span></div>`:v}

          ${this.stage==="config"?p`
                <label class="field">
                  <span>Device name</span>
                  <input
                    type="text"
                    .value=${this.name}
                    @input=${t=>{this.name=t.target.value}}
                  />
                </label>

                <label class="field">
                  <span>Chip</span>
                  <select
                    .value=${this.chipName}
                    @change=${t=>{this.chipName=t.target.value,this.detectedChipName=""}}
                    ?disabled=${this.loadingChips||this.chips.length===0}
                  >
                    ${this.loadingChips?p`<option value="">Loading chips…</option>`:p`<option value="">Select a chip…</option>`}
                    ${this.chips.map(t=>p`<option value=${t.chip_name} ?disabled=${t.buildable===!1} ?selected=${t.chip_name===this.chipName}>
                            ${t.chip_name} — ${t.board}${t.buildable===!1?" (not buildable)":""}
                          </option>`)}
                  </select>

                  ${this.selectedChip&&this.selectedChip.buildable===!1?p`<span class="hint warn-text">${this.selectedChip.unbuildable_reason}</span>`:v}
                </label>

                <div class="chip-detect">
                  <button class="btn" ?disabled=${this.detectingChip||this.loadingChips} @click=${()=>void this.detectChip()}>
                    ${this.detectingChip?p`<span class="spinner"></span>Detecting…`:p`${C("usb")}Detect from USB`}
                  </button>
                  ${this.usbSupported?p`<button class="btn" ?disabled=${this.detectingChip||this.loadingChips} @click=${()=>void this.detectChip(!0)}>
                        Choose a different device…
                      </button>`:v}
                  ${this.detectedChipName?p`<span class="hint">Detected ${this.detectedChipName}; selected ${this.chipName}.</span>`:v}
                  ${this.chipDetectionError?p`<span class="hint warn-text">${this.chipDetectionError}</span>`:v}
                  ${this.usbSupported?v:p`<span class="hint">Automatic detection needs Chrome or Edge on a secure HTTPS page. Manual chip selection is available.</span>`}
                </div>

                <div class="creds notice ${this.credentialsComplete?"ok":"warn"}">
                  ${C(this.credentialsComplete?"lock":"alert")}
                  <div class="creds-body">
                  <div class="creds-row">
                    <strong>ESP-NOW network</strong>
                    <span>${this.credentialsLabel()}</span>
                  </div>
                  ${this.credentialsComplete?p`<div class="creds-row">
                          <span>Network ID <small class="src">${this.sourceLabel(this.networkIdSource)}</small></span>
                          <code>${this.networkId}</code>
                        </div>
                        <div class="creds-row">
                          <span>PSK <small class="src">${this.sourceLabel(this.pskSource)}</small></span>
                          <code>••••••••</code>
                        </div>`:p`<p class="hint">
                        No ESP-NOW credentials found${this.bridgeName?p` for bridge <strong>${this.bridgeName}</strong>`:v}.
                        A remote cannot join without them — configure a bridge first, or add
                        <code>espnow_network_id</code> and <code>espnow_psk</code> to secrets.yaml.
                      </p>`}
                  ${this.credentialsComplete?p`<p class="hint">
                        Taken from secrets.yaml so the remote matches what the bridge is running.
                      </p>`:v}
                  ${this.credentialsMismatch?p`<p class="hint warn-text mismatch">
                        Note: the saved bridge record says the network ID is
                        <code>${this.bridgeNetworkId}</code>, which disagrees with secrets.yaml.
                        The bridge firmware reads secrets.yaml, so that value is used here — but
                        the record is stale and worth correcting.
                      </p>`:v}
                  </div>
                </div>

                <div class="actions">
                  ${this.usbSupported?p`<button class="btn primary" ?disabled=${!this.canSubmit({chipOptional:!0})||this.detectingChip} @click=${()=>void this.compileAndInstall()}>
                          ${this.detectingChip?"Checking board…":"Compile & install"}
                        </button>
                        <button class="btn" ?disabled=${!this.canSubmit()} @click=${()=>{this.autoInstall=!1,this.submit()}}>
                          Compile only
                        </button>`:p`<button class="btn primary" ?disabled=${!this.canSubmit()} @click=${()=>{this.autoInstall=!1,this.submit()}}>
                          Compile firmware
                        </button>`}
                </div>
              `:v}

          ${this.stage==="compiling"?p`
                <div class="status info">
                  <div class="spinner"></div>
                  <div>
                    <strong
                      >${this.compileStatusLabel}…${this.compilePercent>0?` ${this.compilePercent}%`:""}</strong
                    >
                    <p class="hint">This uses the add-on's own compiler. It can take a few minutes.</p>
                    ${this.autoInstall?p`<p class="hint">It will flash to the selected USB device automatically when the build finishes. Keep the board plugged in.</p>`:v}
                  </div>
                </div>
                <esp-compile-log-viewer .mac=${this.mac} .visible=${!0}></esp-compile-log-viewer>
              `:v}

          ${this.stage==="ready"?p`
                <div class="status ok">
                  ${C("checkCircle")}
                  <div>
                  <strong>Firmware built.</strong>
                  <p class="hint">
                    ${this.autoInstall&&this.flashing?"Flashing to the selected USB device…":"Plug the remote into this computer by USB, then flash it below."}
                  </p>
                  </div>
                </div>
                ${this.preparingManifest?p`<div class="status"><div class="spinner"></div><span>Preparing firmware…</span></div>`:v}
                ${this.manifestUrl?p`
                      <div class="actions">
                        <button class="btn primary" ?disabled=${this.flashing} @click=${()=>void this.flashInBrowser()}>
                          ${this.flashing?p`<span class="spinner"></span>Flashing…`:p`${C("usb")}Flash by USB`}
                        </button>
                      </div>
                      ${this.flashError?p`<div class="notice danger" role="alert">${C("alert")}<span>${this.flashError}</span></div>`:v}
                      ${this.flashNeedsConfirm?p`
                            <div class="actions">
                              <button class="btn primary" @click=${()=>void this.onBrowserFlashDone()}>
                                Continue to Home Assistant setup
                              </button>
                            </div>
                          `:v}
                    `:v}
                ${this.usbSupported?v:p`<div class="notice warn">${C("info")}<span>This browser can't flash over USB. Open the add-on in Chrome or Edge over HTTPS, or download the factory image below.</span></div>`}
                <p class="hint">
                  The button above writes the firmware from this computer. If your browser cannot,
                  use the compiled .bin with your own tool, then continue.
                </p>
                ${this.mac?p`
                      <div class="actions download-actions">
                        <a class="btn" href=${S.downloadFactoryBinary(this.mac)} download>
                          Download factory .bin
                        </a>
                        <a class="btn" href=${S.downloadCompileBinary(this.mac)} download>
                          Download .ota.bin
                        </a>
                        <a class="btn" href=${"#/device/"+encodeURIComponent(this.mac)+"/config"}>
                          Edit YAML
                        </a>
                      </div>
                      <p class="hint">
                        <strong>Download factory .bin</strong> writes the whole image at offset 0
                        (bootloader + partitions + app) and is what a blank device needs — flash it
                        with your own tool at 0x0. The .ota.bin is an update image and cannot be
                        flashed to empty flash.
                      </p>
                    `:v}
              `:v}

          ${this.stage==="done"?p`
                <div class="status ok">
                  ${C("checkCircle")}
                  <div>
                  <strong>${this.esphomeName} is flashed.</strong>
                  <p class="hint">
                    Power the remote. Once it joins, the bridge reports it and it appears in the
                    network view automatically.
                  </p>
                  </div>
                </div>
                ${this.renderHaIntegrationStep()}
                <div class="actions"><a class="btn primary" href="#/">Go to network</a></div>
              `:v}

          ${this.stage==="error"?p`
                <div class="actions"><button class="btn" @click=${()=>this.startOver()}>Start over</button></div>
              `:v}
        </div>
      </section>
      </div>
    `}};z.HA_POLL_INTERVAL_MS=5e3;z.HA_POLL_MAX_ATTEMPTS=12;z.styles=[Me,de`
    :host { display: block; }
    .remote-page { max-width: 760px; }
    .crumbs svg { width: 14px; height: 14px; color: var(--faint); }
    .steps { display: flex; gap: 4px; list-style: none; margin: 0; padding: 0; counter-reset: s; }
    .steps li {
      display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0;
      padding: 8px 0; border-top: 3px solid var(--line); color: var(--muted); font-size: var(--text-sm); font-weight: 500;
    }
    .steps li.current { border-color: var(--primary); color: var(--ink); }
    .steps li.done { border-color: var(--primary); color: var(--ink-2); }
    .steps .n {
      display: grid; place-items: center; width: 22px; height: 22px; flex: none; border-radius: 50%;
      background: var(--surface-subtle); color: var(--muted); font-size: var(--text-xs);
    }
    .steps .current .n { background: var(--primary); color: var(--on-primary); }
    .steps .done .n { background: var(--primary-soft); color: var(--primary); }
    .steps .n svg { width: 14px; height: 14px; }
    .card-body { display: grid; gap: 18px; padding: 20px; }
    label.field { display: grid; gap: 6px; }
    label.field > span { font-size: var(--text-sm); font-weight: 500; color: var(--ink-2); }
    .chip-detect { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; margin-top: -6px; }
    .chip-detect .btn svg, .actions .btn svg { width: 18px; height: 18px; }
    .chip-detect .spinner, .actions .spinner { width: 14px; height: 14px; }
    .warn-text { color: var(--accent); }
    .creds .creds-body { display: grid; gap: 6px; flex: 1; min-width: 0; }
    .creds-row { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
    .creds-row code { font-family: var(--font-mono); font-size: var(--text-sm); }
    .creds .src { color: var(--muted); font-size: var(--text-xs); margin-left: 4px; }
    .creds .mismatch { margin-top: 4px; }
    .actions { display: flex; flex-wrap: wrap; gap: 8px; }
    .download-actions { margin-top: 4px; }
    .status { display: flex; align-items: flex-start; gap: 12px; padding: 14px 16px; border-radius: var(--radius-md); background: var(--surface-subtle); }
    .status.info { background: var(--info-soft); }
    .status.ok { background: var(--ok-soft); }
    .status > svg { width: 22px; height: 22px; flex: none; color: var(--ok); }
    .status strong { font-weight: 500; }
    .status .hint { margin-top: 2px; }
    .ha-step { display: flex; gap: 12px; align-items: flex-start; padding: 14px 16px; border: 1px solid var(--line); border-radius: var(--radius-md); }
    .ha-step > div { display: grid; gap: 8px; justify-items: start; }
    .ha-step strong { font-weight: 500; }
    .ha-icon { display: grid; place-items: center; width: 24px; height: 24px; flex: none; color: var(--muted); }
    .ha-icon.ok { color: var(--ok); }
    .ha-icon.warn { color: var(--accent); }
    .ha-icon svg { width: 22px; height: 22px; }
    .ha-error { color: var(--danger); }
    @media (max-width: 560px) {
      .steps li { flex-direction: column; align-items: flex-start; gap: 4px; font-size: var(--text-xs); }
      .card-body { padding: 16px; }
    }
  `];X([b()],z.prototype,"name",2);X([b()],z.prototype,"chips",2);X([b()],z.prototype,"chipName",2);X([b()],z.prototype,"loadingChips",2);X([b()],z.prototype,"detectingChip",2);X([b()],z.prototype,"chipDetectionError",2);X([b()],z.prototype,"detectedChipName",2);X([b()],z.prototype,"networkId",2);X([b()],z.prototype,"psk",2);X([b()],z.prototype,"bridgeName",2);X([b()],z.prototype,"credentialsComplete",2);X([b()],z.prototype,"networkIdSource",2);X([b()],z.prototype,"pskSource",2);X([b()],z.prototype,"credentialsMismatch",2);X([b()],z.prototype,"bridgeNetworkId",2);X([b()],z.prototype,"loadingCredentials",2);X([b()],z.prototype,"stage",2);X([b()],z.prototype,"error",2);X([b()],z.prototype,"mac",2);X([b()],z.prototype,"esphomeName",2);X([b()],z.prototype,"compilePercent",2);X([b()],z.prototype,"compileStatus",2);X([b()],z.prototype,"manifestUrl",2);X([b()],z.prototype,"firmwareBlobUrl",2);X([b()],z.prototype,"preparingManifest",2);X([b()],z.prototype,"usbSupported",2);X([b()],z.prototype,"flashError",2);X([b()],z.prototype,"flashing",2);X([b()],z.prototype,"flashNeedsConfirm",2);X([b()],z.prototype,"autoInstall",2);X([b()],z.prototype,"haStatus",2);X([b()],z.prototype,"haDeviceId",2);X([b()],z.prototype,"haBusy",2);X([b()],z.prototype,"haNotice",2);z=X([Se("esp-remote-wizard")],z);const VC=de`
  --canvas: #f4f6f6;
  --surface: #ffffff;
  --surface-subtle: #f2f5f5;
  --surface-raised: #ffffff;
  --surface-hover: #eef2f2;
  --ink: #1a1f20;
  --ink-2: #3a4446;
  --muted: #59656a;
  --faint: #66727a;
  --line: #e0e5e6;
  --line-strong: #c9d1d3;

  --toolbar: #0b3b4b;
  --toolbar-ink: #ffffff;
  --toolbar-muted: rgba(255, 255, 255, 0.72);
  --toolbar-hover: rgba(255, 255, 255, 0.1);
  --toolbar-indicator: #f5b041;

  --primary: #0f6e69;
  --primary-strong: #0a5551;
  --primary-soft: #e2f1ef;
  --on-primary: #ffffff;

  --accent: #9a5b00;
  --accent-fill: #f39c12;
  --accent-soft: #fdf0d9;
  --danger: #c0352b;
  --danger-strong: #9f2a22;
  --danger-soft: #fdebe9;
  --on-danger: #ffffff;
  --ok: #2a7a3b;
  --ok-dot: #3fa25a;
  --ok-soft: #e5f3e8;
  --info: #0b6aa6;
  --info-soft: #e2f0fa;

  --log-bg: #12191b;
  --log-ink: #d7e0e1;
  --log-muted: #8a9a9e;

  --shadow-sm: 0 1px 2px rgba(15, 30, 32, 0.06);
  --shadow-md: 0 6px 24px rgba(15, 30, 32, 0.12), 0 1px 3px rgba(15, 30, 32, 0.08);
  --scrim: rgba(10, 20, 22, 0.45);
  color-scheme: light;
`,Id=de`
  --canvas: #111414;
  --surface: #1b1f1f;
  --surface-subtle: #222727;
  --surface-raised: #232828;
  --surface-hover: #283030;
  --ink: #e3e8e8;
  --ink-2: #c2cbcb;
  --muted: #9aa5a6;
  --faint: #909c9d;
  --line: #2c3333;
  --line-strong: #3c4545;

  --toolbar: #0f2a32;
  --toolbar-ink: #e9f1f2;
  --toolbar-muted: rgba(233, 241, 242, 0.7);
  --toolbar-hover: rgba(255, 255, 255, 0.08);
  --toolbar-indicator: #f5b041;

  --primary: #5cc8ba;
  --primary-strong: #7dd8cc;
  --primary-soft: #16302d;
  --on-primary: #062420;

  --accent: #f2b54a;
  --accent-fill: #f2b54a;
  --accent-soft: #33280f;
  --danger: #f28b82;
  --danger-strong: #f6a49d;
  --danger-soft: #3a1e1c;
  --on-danger: #2a0b08;
  --ok: #86cf98;
  --ok-dot: #5fbf77;
  --ok-soft: #173020;
  --info: #82c6f2;
  --info-soft: #132a39;

  --log-bg: #0b0f10;
  --log-ink: #d7e0e1;
  --log-muted: #879598;

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
  --shadow-md: 0 8px 28px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.4);
  --scrim: rgba(0, 0, 0, 0.6);
  color-scheme: dark;
`,jC=de`
  --font-sans: Roboto, "Noto Sans", system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-mono: "Roboto Mono", "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  --text-xs: 12px;
  --text-sm: 13px;
  --text-md: 14px;
  --text-lg: 16px;
  --text-xl: 20px;
  --text-2xl: 24px;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --gutter: 24px;
  --content-max: 1280px;
  --toolbar-h: 56px;
`,QC=de`
  :host {
    ${jC}
    ${VC}
  }
  @media (prefers-color-scheme: dark) {
    :host(:not([theme='light'])) {
      ${Id}
    }
  }
  :host([theme='dark']) {
    ${Id}
  }
  @media (max-width: 760px) {
    :host {
      --gutter: 16px;
    }
  }
`;var KC=Object.defineProperty,XC=Object.getOwnPropertyDescriptor,Ct=(t,e,i,s)=>{for(var r=s>1?void 0:s?XC(e,i):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(s?o(e,i,r):o(r))||r);return s&&r&&KC(e,i,r),r};let rt=class extends pe{constructor(){super(...arguments),this.route=this.readRoute(),this.queueData=null,this.compileData=null,this.addonConnected=!0,this.bridgeConnected=null,this.bridgeConfigured=null,this.integrationLoaded=null,this.integrationConfigured=!1,this.restartRequired=!1,this.bridgeLabel="",this.pollTimer=null,this.bridgeStreamHandle=null,this.setupDismissed=!1,this.syncHaTheme=()=>{var i;let t=null;try{if(window.parent!==window){const s=window.parent.document.documentElement,r=window.parent.getComputedStyle(s).getPropertyValue("--primary-background-color").trim(),n=document.createElement("span");n.style.color=r,document.body.appendChild(n);const o=(i=getComputedStyle(n).color.match(/\d+(\.\d+)?/g))==null?void 0:i.map(Number);n.remove(),r&&o&&o.length>=3&&(t=(.2126*o[0]+.7152*o[1]+.0722*o[2])/255<.5?"dark":"light")}}catch{t=null}t?this.setAttribute("theme",t):this.removeAttribute("theme");const e=document.querySelector('meta[name="color-scheme"]');e==null||e.setAttribute("content",t??"light dark"),document.documentElement.style.background=t==="dark"?"#111414":t==="light"?"#f4f6f6":""},this.themeTimer=null,this.onHashChange=()=>{this.route=this.readRoute()},this.onSetupDismissed=()=>{this.setupDismissed=!0}}connectedCallback(){super.connectedCallback(),this.syncHaTheme(),this.themeTimer=setInterval(this.syncHaTheme,5e3),window.addEventListener("hashchange",this.onHashChange),this.addEventListener("setup-dismissed",this.onSetupDismissed),this.bridgeStreamHandle=Rg(t=>{this.bridgeConnected=t,this.fetchConfig()}),this.fetchQueue(),this.pollTimer=setInterval(()=>{this.fetchQueue(),this.fetchConfig(),this.checkRestartRequired()},3e3),this.fetchConfig(),this.checkRestartRequired(),this.maybeRedirectToSetup()}async checkRestartRequired(){var t,e;try{const i=await S.restartRequired();this.restartRequired=i.restart_required,this.integrationLoaded=((t=i.integration)==null?void 0:t.loaded)??this.integrationLoaded,this.integrationConfigured=((e=i.integration)==null?void 0:e.configured)??this.integrationConfigured}catch{this.restartRequired=!1}this.maybeRedirectToSetup()}async fetchConfig(){var t,e,i;try{const s=await S.config(),r=s.active_bridge;this.integrationLoaded=((t=s.integration)==null?void 0:t.loaded)??null,this.integrationConfigured=((e=s.integration)==null?void 0:e.configured)??!1,this.bridgeLabel=(r==null?void 0:r.name)||(r==null?void 0:r.hostname)||(r==null?void 0:r.host)||"",this.bridgeConfigured=!!(r&&!r.error||(((i=s.bridges)==null?void 0:i.length)??0)>0),this.addonConnected=!0}catch{this.addonConnected=!1}this.maybeRedirectToSetup()}needsSetup(){return this.addonConnected?this.bridgeConfigured===!1||this.restartRequired||!this.integrationConfigured&&this.integrationLoaded===!1:!1}maybeRedirectToSetup(){this.needsSetup()&&this.route.name==="topology"&&!this.setupDismissed&&this.navigate("/setup")}disconnectedCallback(){var t;this.themeTimer&&clearInterval(this.themeTimer),window.removeEventListener("hashchange",this.onHashChange),this.removeEventListener("setup-dismissed",this.onSetupDismissed),this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null),(t=this.bridgeStreamHandle)==null||t.close(),this.bridgeStreamHandle=null,super.disconnectedCallback()}async fetchQueue(){try{const[t,e]=await Promise.all([S.getQueue(),S.getCompileQueue()]);this.queueData=t,this.compileData=e,this.addonConnected=!0}catch{this.addonConnected=!1}}readRoute(){const t=window.location.hash.replace(/^#\/?/,"").replace(/\/+$/,"");if(t.startsWith("device/")){const e=t.slice(7);return e.endsWith("/config")?{name:"device-config",mac:decodeURIComponent(e.replace(/\/config$/,""))}:{name:"device",mac:decodeURIComponent(e)}}if(t.startsWith("job/")){const e=t.slice(4),[i,s]=e.split("?"),r=parseInt(i,10);let n="/queue";return s&&(n=new URLSearchParams(s).get("from")||"/queue"),{name:"job",jobId:r,from:n}}return t==="settings"?{name:"settings"}:t==="queue"?{name:"queue"}:t==="secrets"?{name:"secrets",from:"/"}:t.startsWith("secrets?")?{name:"secrets",from:new URLSearchParams(t.slice(7)).get("from")||"/"}:t==="activity-log"?{name:"activity-log"}:t==="setup"?{name:"setup"}:t==="add-remote"?{name:"remote-wizard"}:{name:"topology"}}navigate(t){window.location.hash=t}activeRoute(){return this.route.name==="topology"||this.route.name==="device"||this.route.name==="device-config"||this.route.name==="remote-wizard"?"network":this.route.name==="queue"||this.route.name==="job"?"queue":this.route.name==="activity-log"?"activity":"settings"}queueSummary(){const t=this.queueData,e=this.compileData,i=(t==null?void 0:t.count)??0,s=(e==null?void 0:e.count)??0,r=!!(t!=null&&t.active_job)||!!(e!=null&&e.active_job);return{label:`${i+s}`,count:i+s,active:r,paused:!!(t!=null&&t.paused)}}renderTab(t,e,i,s=v){const r=this.activeRoute()===t;return p`
      <a class="tab ${r?"current":""}" href="#${i}" aria-current=${r?"page":"false"}>
        <span>${e}</span>${s}
      </a>
    `}renderStatus(){return this.addonConnected?this.bridgeConnected===!1?p`<span class="status bad" role="status"><span class="sdot"></span><span class="status-text">Bridge offline</span></span>`:this.bridgeConfigured===!1?p`<span class="status warn" role="status"><span class="sdot"></span><span class="status-text">No bridge</span></span>`:p`<span class="status ok" role="status" title=${this.bridgeLabel?`Connected to ${this.bridgeLabel}`:"Bridge connected"}>
      <span class="sdot"></span><span class="status-text">${this.bridgeLabel||"Bridge connected"}</span>
    </span>`:p`<span class="status bad" role="status"><span class="sdot"></span><span class="status-text">Add-on unreachable</span></span>`}renderOutage(){return this.addonConnected?this.bridgeConnected===!1?p`<div class="outage" role="status">
        ${C("alert")}
        <span><strong>The add-on can't reach the bridge.</strong> Remotes keep running, but status is stale and jobs are paused until it reconnects.</span>
        <a class="outage-link" href="#/settings">Bridge settings</a>
      </div>`:this.restartRequired?p`<div class="outage notice-warn" role="status">
        ${C("info")}
        <span><strong>Home Assistant needs a restart</strong> to load the updated ESP Tree integration.</span>
        <a class="outage-link" href="#/setup">Finish setup</a>
      </div>`:v:p`<div class="outage" role="alert">
        ${C("alert")}
        <span><strong>Can't reach the ESP Tree add-on.</strong> Retrying every few seconds. If this continues, check the add-on is running in Home Assistant under Settings → Add-ons.</span>
      </div>`}render(){if(this.route.name==="setup")return p`<esp-setup-wizard></esp-setup-wizard>`;const t=this.queueSummary(),e=t.count>0||t.active?p`<span class="tab-count ${t.active?"live":""}" aria-label=${`${t.count} queued${t.active?", one running":""}${t.paused?", paused":""}`}>${t.paused?C("pause"):v}${t.count+(t.active?1:0)}</span>`:v;return p`
      <header class="toolbar">
        <div class="toolbar-inner">
          <a class="brand" href="#/" aria-label="ESP Tree, network">
            ${Vd}<span>ESP Tree</span>
          </a>
          <nav class="tabs" aria-label="ESP Tree">
            ${this.renderTab("network","Network","/")}
            ${this.renderTab("queue","Jobs","/queue",e)}
            ${this.renderTab("activity","Activity","/activity-log")}
            ${this.renderTab("settings","Settings","/settings")}
          </nav>
          <div class="toolbar-end">${this.renderStatus()}</div>
        </div>
      </header>
      ${this.renderOutage()}
      <main class="content">
        ${this.route.name==="remote-wizard"?p`<esp-remote-wizard></esp-remote-wizard>`:this.route.name==="topology"?p`<esp-topology-map .addonDown=${!this.addonConnected} @node-selected=${i=>this.navigate(`/device/${encodeURIComponent(i.detail)}`)}></esp-topology-map>`:this.route.name==="device"?p`<esp-device-detail .mac=${this.route.mac}></esp-device-detail>`:this.route.name==="device-config"?p`<esp-config-page .mac=${this.route.mac}></esp-config-page>`:this.route.name==="job"?p`<esp-job-page .jobId=${this.route.jobId} .from=${this.route.from}></esp-job-page>`:this.route.name==="queue"?p`<esp-queue-page></esp-queue-page>`:this.route.name==="secrets"?p`<esp-secrets-page .from=${this.route.from}></esp-secrets-page>`:this.route.name==="activity-log"?p`<esp-activity-log-page></esp-activity-log-page>`:p`<esp-settings></esp-settings>`}
      </main>
      <footer class="build">ESP Tree UI · ${"9af3a4a"}</footer>
    `}};rt.styles=[QC,Me,de`
    :host {
      display: block;
      min-height: 100vh;
      background: var(--canvas);
      color: var(--ink);
      font-family: var(--font-sans);
      font-size: var(--text-md);
      -webkit-font-smoothing: antialiased;
    }

    .toolbar {
      position: sticky;
      top: 0;
      z-index: 50;
      background: var(--toolbar);
      color: var(--toolbar-ink);
    }
    .toolbar-inner {
      display: flex;
      align-items: stretch;
      gap: 8px 24px;
      height: var(--toolbar-h);
      max-width: calc(var(--content-max) + 2 * var(--gutter));
      margin: 0 auto;
      padding: 0 var(--gutter);
    }
    .brand {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      color: inherit;
      text-decoration: none;
      font-size: var(--text-xl);
      font-weight: 500;
      letter-spacing: -0.01em;
      flex: none;
    }
    .brand .brand-mark { width: 26px; height: 26px; color: var(--toolbar-indicator); }
    .tabs {
      display: flex;
      align-items: stretch;
      gap: 4px;
      min-width: 0;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .tabs::-webkit-scrollbar { display: none; }
    .tab {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 0 14px;
      color: var(--toolbar-muted);
      text-decoration: none;
      font-size: var(--text-md);
      font-weight: 500;
      white-space: nowrap;
      transition: color 150ms ease, background-color 150ms ease;
    }
    .tab:hover { color: var(--toolbar-ink); background: var(--toolbar-hover); }
    .tab.current { color: var(--toolbar-ink); }
    .tab.current::after {
      content: '';
      position: absolute;
      left: 10px;
      right: 10px;
      bottom: 0;
      height: 3px;
      border-radius: 3px 3px 0 0;
      background: var(--toolbar-indicator);
    }
    .tab:focus-visible { outline-color: var(--toolbar-indicator); outline-offset: -4px; }
    .tab-count {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      min-width: 20px;
      height: 20px;
      padding: 0 6px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.16);
      color: var(--toolbar-ink);
      font-size: var(--text-xs);
      font-weight: 600;
      justify-content: center;
      font-variant-numeric: tabular-nums;
    }
    .tab-count.live { background: var(--toolbar-indicator); color: #2b1a00; }
    .tab-count svg { width: 12px; height: 12px; }

    .toolbar-end {
      margin-left: auto;
      display: flex;
      align-items: center;
      min-width: 0;
    }
    .status {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
      color: var(--toolbar-muted);
      font-size: var(--text-sm);
    }
    .status-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .sdot { width: 8px; height: 8px; border-radius: 50%; flex: none; background: #6fd08a; box-shadow: 0 0 0 3px rgba(111, 208, 138, 0.2); }
    .status.bad { color: var(--toolbar-ink); }
    .status.bad .sdot { background: #ff8a80; box-shadow: 0 0 0 3px rgba(255, 138, 128, 0.25); }
    .status.warn .sdot { background: var(--toolbar-indicator); box-shadow: none; }

    .outage {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 10px var(--gutter);
      background: var(--danger-soft);
      color: var(--ink);
      font-size: var(--text-md);
      border-bottom: 1px solid var(--line);
    }
    .outage.notice-warn { background: var(--accent-soft); }
    .outage svg { width: 20px; height: 20px; flex: none; color: var(--danger); margin-top: 1px; }
    .outage.notice-warn svg { color: var(--accent); }
    .outage strong { font-weight: 500; }
    .outage-link { margin-left: auto; white-space: nowrap; font-weight: 500; }

    .content {
      max-width: var(--content-max);
      margin: 0 auto;
      padding: 20px var(--gutter) 32px;
    }
    .build {
      max-width: var(--content-max);
      margin: 0 auto;
      padding: 0 var(--gutter) 24px;
      color: var(--faint);
      font-size: var(--text-xs);
    }

    @media (max-width: 760px) {
      .toolbar-inner {
        flex-wrap: wrap;
        height: auto;
        padding: 0;
        gap: 0;
      }
      .brand { height: 52px; padding: 0 var(--gutter); font-size: var(--text-lg); }
      .toolbar-end { height: 52px; padding-right: var(--gutter); }
      .tabs { order: 3; flex: 1 0 100%; height: 44px; padding: 0 8px; }
      .tab { padding: 0 12px; }
      .content { padding-top: 16px; }
      .status-text { max-width: 40vw; }
    }
  `];Ct([b()],rt.prototype,"route",2);Ct([b()],rt.prototype,"queueData",2);Ct([b()],rt.prototype,"compileData",2);Ct([b()],rt.prototype,"addonConnected",2);Ct([b()],rt.prototype,"bridgeConnected",2);Ct([b()],rt.prototype,"bridgeConfigured",2);Ct([b()],rt.prototype,"integrationLoaded",2);Ct([b()],rt.prototype,"integrationConfigured",2);Ct([b()],rt.prototype,"restartRequired",2);Ct([b()],rt.prototype,"bridgeLabel",2);rt=Ct([Se("espnow-app")],rt);export{v as A,Ag as D,xs as E,Yp as _,pe as a,um as b,fm as c,dm as d,Mg as e,vl as f,p as g,hm as h,de as i,ie as n,ZC as p,b as r,Se as t,q as w};
//# sourceMappingURL=index-h_hdxaUO.js.map
