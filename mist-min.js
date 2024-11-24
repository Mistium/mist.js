window.mist={},mist.equalsObj=function(e,t){if("object"==typeof e&&"object"==typeof t){if(e===t)return!0;let r=Object.keys(e),n=Object.keys(t);if(r.length!==n.length)return!1;for(let i of n){if(!r.includes(i))return!1;const n=typeof e[i],o=typeof t[i];if(n!==o)return!1;if("object"===n&&"object"===o){if(!Object.isSame(e[i],t[i]))return!1}else if(e[i]!==t[i])return!1}return!0}return!1},mist.cloneObj=function(e){if(null===e)return null;if("object"==typeof e){if(Array.isArray(e))return e.map((e=>Object.clone(e)));if(e instanceof RegExp)return new RegExp(e);{let t={};for(let r in e)e.hasOwnProperty(r)&&(t[r]=Object.clone(e[r]));return t}}return e},mist.mergeObj=function(e,t){if("object"==typeof e&&"object"==typeof t){let r=Object.clone(e);for(let n in t)"object"==typeof t[n]?r[n]=Object.merge(e[n],t[n]):r[n]=t[n];return r}return t},mist.stringify=function(e){return"object"==typeof e?JSON.stringify(e):e},mist.parse=function(e){const t=typeof e;if("object"===t)return e;if("string"===t&&(e=e.trim()),"{"===e[0]&&"}"===e[e.length-1]||"["===e[0]&&"]"===e[e.length-1])try{return JSON.parse(p0.replaceAll("\n","\\n"))}catch(e){console.error(e)}},mist.flipObj=function(e){let t={};for(let r in e)t[e[r]]=r;return t},mist.isPrimeNum=function(e){if(e<=1)return!1;if(2==e||3==e)return!0;if(e%2==0||e%3==0)return!1;for(var t=5;t<=Math.sqrt(e);t+=6)if(e%t==0||e%(t+2)==0)return!1;return!0},mist.setCookie=function(e,t,r){const n=new Date;n.setTime(n.getTime()+24*r*60*60*1e3);let i="expires="+n.toUTCString();document.cookie=e+"="+t+";"+i+";path=/"},window.getCookie=function(e){let t=e+"=",r=decodeURIComponent(document.cookie).split(";");for(let e=0;e<r.length;e++){let n=r[e];for(;" "==n.charAt(0);)n=n.substring(1);if(0==n.indexOf(t))return n.substring(t.length,n.length)}return""};
