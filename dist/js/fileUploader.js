!function i(o,l,s){function c(t,e){if(!l[t]){if(!o[t]){var n="function"==typeof require&&require;if(!e&&n)return n(t,!0);if(d)return d(t,!0);var a=new Error("Cannot find module '"+t+"'");throw a.code="MODULE_NOT_FOUND",a}var r=l[t]={exports:{}};o[t][0].call(r.exports,function(e){return c(o[t][1][e]||e)},r,r.exports,i,o,l,s)}return l[t].exports}for(var d="function"==typeof require&&require,e=0;e<s.length;e++)c(s[e]);return c}({1:[function(e,t,n){"use strict";var a,R=(a=e("deepmerge"))&&a.__esModule?a:{default:a};function k(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=[],a=!0,r=!1,i=void 0;try{for(var o,l=e[Symbol.iterator]();!(a=(o=l.next()).done)&&(n.push(o.value),!t||n.length!==t);a=!0);}catch(e){r=!0,i=e}finally{try{a||null==l.return||l.return()}finally{if(r)throw i}}return n}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}window.FileUploader=function(t,e){var T=this,M=this;this._defaults={lang:"en",useFileIcons:!0,debug:!1,debugLogStyle:"color: #9900ff",name:void 0,pluginName:"FileUploader",useLoadingBars:!0,loadingBarsClasses:[],reloadedFilesClass:"reloadedElement",resultContainerClass:"result",resultFileContainerClass:"uploadedFile",resultPrefix:"fileUploader",resultInputNames:["title","extension","value","size"],defaultFileExt:"",defaultMimeType:"",maxFileSize:50,maxTotalSize:1e3,reloadArray:[],reloadHTML:void 0,linkButtonContent:"L",deleteButtonContent:"X",allowDuplicates:!1,duplicatesWarning:!1,labelsContainers:!1,labelsClasses:{sizeAvailable:"sizeAvailable",currentSize:"currentSize",maxFileSize:"maxFileSize",maxTotalSize:"maxTotalSize"},HTMLTemplate:function(){return'<p class="introMsg"></p>\n                    <div>\n                        <div class="inputContainer">\n                            <input class="fileLoader" type="file" multiple />\n                        </div>\n                        <div class="dropZone"></div>\n                        <div class="filesContainer filesContainerEmpty">\n                            <div class="innerFileThumbs"></div>\n                            <div style="clear:both;"></div>\n                        </div>\n                    </div>\n                    <div class="result"></div>'},onload:function(){},onfileloadStart:function(){},onfileloadEnd:function(){},onfileDelete:function(){},filenameTest:function(){},langs:{en:{intro_msg:"(Add attachments...)",dropZone_msg:"Drop your files here",maxSizeExceeded_msg:"File too large",maxTotalSizeExceeded_msg:"Total size exceeded",duplicated_msg:"File duplicated (skipped)",name_placeHolder:"name"}}};var L=function(e,t){var n=!0,a=!1,r=void 0;try{for(var i,o=l["".concat(e,"Labels")][Symbol.iterator]();!(n=(i=o.next()).done);n=!0)i.value.querySelector(":scope > span").innerHTML=t}catch(e){a=!0,r=e}finally{try{n||null==o.return||o.return()}finally{if(a)throw r}}};this._options=(0,R.default)(this._defaults,e),this.options=function(e){return e?(0,R.default)(T._options,e):T._options},this._round=function(e){return Math.round(100*e)/100},this.get=function(e){switch(e){case"currentTotalSize":return T._round(I);case"currentAvailableSize":return T._round(T._options.maxTotalSize-I)}},this._logger=function(e,t,n){if(T._options.debug){if(t)for(var a=0;a<t;a++)e="➡ "+e;T._options.name&&(e="["+T._options.pluginName+" - "+T._options.name+"] "+e),n?console.log("%c "+e,T._options.debugLogStyle,n):console.log("%c "+e,T._options.debugLogStyle)}},this._fileType=function(e){var t=e.substring(e.lastIndexOf(".")+1,e.length);return 0<=["pdf","jpg","png"].indexOf(t)?t:"unknown-file"},this._fileDelete=function(e,t){var n=t.element,a=e.target.dataset.delete;a||(a=e.target.closest("div[data-delete]").dataset.delete),T._options.useFileIcons&&function(e,t){var n=e.previousElementSibling;if(!t)return n;for(;n;){if(n.matches(t))return n;n=n.previousElementSibling}}(n,"img").remove(),n.remove();var r=z.querySelector('input[name="'.concat(T._options.resultPrefix,"[").concat(a,"][").concat(T._options.resultInputNames[3],']"]')).value;r=T._round(r),I=T._round(I-r);var i=T._options.maxTotalSize-I;i=T._round(i),L("sizeAvailable",i),L("currentSize",I),z.querySelector(':scope > div[data-index="'.concat(a,'"]')).remove(),0===document.querySelector(".innerFileThumbs").children.length&&document.querySelector(".filesContainer").classList.add("filesContainerEmpty"),T._logger("Deleted file N: "+a,2),T._options.onfileDelete(a,I)},this._fileRename=function(e){var t=e.data.element,n=e.target,a=t.querySelector(":scope > .fileExt").innerHTML,r=n.value,i=t.dataset.index,o=z.querySelector('div[data-index="'.concat(i,'"] input')),l=T._options.filenameTest(r,a,C);if(!1===l)return e.preventDefault(),!1;void 0!==l&&!0!==l&&(r=l,n.value=r,o.value=r,n.setSelectionRange(e.data.start,e.data.stop))},this.getData=function(){var e=[];T._logger("RECEIVED SAVE COMMAND:",0);var t=!0,n=!1,a=void 0;try{for(var r,i=z.querySelectorAll(":scope > .".concat(T._options.resultFileContainerClass))[Symbol.iterator]();!(t=(r=i.next()).done);t=!0){var o=r.value.querySelectorAll(":scope > input"),l={title:o[0].value,ext:o[1].value,value:o[2].value};e.push(l)}}catch(e){n=!0,a=e}finally{try{t||null==i.return||i.return()}finally{if(n)throw a}}return T._logger("%O",0,e),e},this._createUploaderContainer=function(e,t,n){if(T._options.useFileIcons){var a='<img src="/images/'.concat(T._fileType(n),'.png" class="fileThumb" />');C.insertAdjacentHTML("beforeend",a)}var r=document.createElement("div");r.className="newElement",r.dataset.index=parseInt(e),r.style.position="relative",C.appendChild(r);var i=document.createElement("div");i.className="fileActions",r.appendChild(i);var o=document.createElement("div");o.className="fileSee",o.innerHTML=T._options.linkButtonContent,i.appendChild(o),o.addEventListener("click",function(e){var t=e.target.closest(".newElement").dataset.index,n=z.querySelector('.uploadedFile[data-index="'.concat(t,'"] textarea')).value;window.open().document.write('<iframe src="'.concat(n,'" frameborder="0" style="border:0; top:0px; display:block; left:0px; bottom:0px; right:0px; width:100%; min-height: 100vh; height:100%;" allowfullscreen></iframe>'))});var l=document.createElement("div");if(l.className="fileDelete",l.dataset.delete=parseInt(e),l.innerHTML=T._options.deleteButtonContent,i.append(l),l.addEventListener("click",function(e){T._fileDelete(e,{element:r})}),T._options.useLoadingBars){var s=T._options.loadingBarsClasses;0<s.length&&(s=s.join(" "));var c=document.createElement("div");c.className="loadBar ".concat(s),c.appendChild(document.createElement("div")),r.prepend(c)}var d=document.createElement("input");d.setAttribute("placeholder","nome"),d.className="fileTitle";var u=document.createElement("div");return u.className="fileExt",r.prepend(u),r.prepend(d),function(e,t,n){t instanceof Array||this._logger("addMultipleListeners requires events to be an array");var a=!0,r=!1,i=void 0;try{for(var o,l=t[Symbol.iterator]();!(a=(o=l.next()).done);a=!0){var s=o.value;e.addEventListener(s,n)}}catch(e){r=!0,i=e}finally{try{a||null==l.return||l.return()}finally{if(r)throw i}}}(d,["keypress","keyup","paste"],function(e){e.data={},e.data.element=r,e.data.start=this.selectionStart,e.data.stop=this.selectionEnd,M._fileRename(e)}),d.value=t,u.innerHTML=n,r},this._createResultContainer=function(e){var t=e.index,n=document.createElement("div");n.className=T._options.resultFileContainerClass,n.dataset.index=t,n.insertAdjacentHTML("beforeend","<div>File: ".concat(t,"</div>")),n.insertAdjacentHTML("beforeend",'<input type="text" name="'.concat(T._options.resultPrefix,"[").concat(t,"][").concat(T._options.resultInputNames[0],']" value="').concat(e.name,'" />')),n.insertAdjacentHTML("beforeend",'<input type="text" name="'.concat(T._options.resultPrefix,"[").concat(t,"][").concat(T._options.resultInputNames[1],']" value="').concat(e.type,'" />')),n.insertAdjacentHTML("beforeend",'<textarea name="'.concat(T._options.resultPrefix,"[").concat(t,"][").concat(T._options.resultInputNames[2],']">').concat(e.result,"</textarea>")),n.insertAdjacentHTML("beforeend",'<input type="text" name="'.concat(T._options.resultPrefix,"[").concat(t,"][").concat(T._options.resultInputNames[3],']" value="').concat(e.size,'" />')),z.appendChild(n)},this._filesRead=function(e){var t,n=e.data.DOM,a=!1,r=0;if(t=e.target.files?(T._logger("files array source: file selector (click event)",1),e.target.files):(T._logger("files array source: dropzone (drag & drop event)",1),e.dataTransfer.files),T._logger("%O",0,t),!T._options.allowDuplicates){var i=[],o=[],l=!0,s=!(a=[]),c=void 0;try{for(var d,u=z.children[Symbol.iterator]();!(l=(d=u.next()).done);l=!0){var p=d.value;i.push(p.querySelector("input").value)}}catch(e){s=!0,c=e}finally{try{l||null==u.return||u.return()}finally{if(s)throw c}}for(r=0;r<t.length;r++)o.push(t[r].name);o.forEach(function(e){i.indexOf(e)<0&&a.push(e)})}A.classList.remove("filesContainerEmpty");var f=function(l,s,c,e){var n=Array.from(e.querySelector(".innerFileThumbs").children).filter(function(e){return parseInt(e.dataset.index)===c});n=n[0];var d=T._round(s.size/1e6);if(l.onloadstart=function(){T._options.onfileloadStart(c),T._logger("START read file: ".concat(c,", size: ").concat(d," MB"),2)},l.onprogress=function(e){if(e.lengthComputable){var t=T._round(e.loaded/e.total*100);T._logger("File ".concat(c," loaded: ").concat(t),3),t<=100&&(n.querySelector(":scope > .loadBar > div").style.width="100%")}},l.onloadend=function(){var e=s.type,t=s.name,n=l.result;if(!n)return!1;"data:"===n.substring(0,n.indexOf(";"))&&0<T._options.defaultMimeType.length&&(n="data:"+T._options.defaultMimeType+n.substring(n.indexOf(";"),n.length)),""===e&&(e=T._options.defaultMimeType),t.indexOf(".")<0&&""!==T._options.defaultFileExt&&(t="".concat(t,".").concat(T._options.defaultFileExt));var a={index:c,name:t,type:e,result:n,size:d};T._createResultContainer(a),T._logger("END read file: ".concat(c),4);var r=document.getElementById("debugUploaded"),i=parseInt(r.innerHTML)+1;r.innerHTML=i;var o={name:s.name,type:s.type,data:n,size:d};T._options.onfileloadEnd(c,o,T._round(I))},d<=T._options.maxFileSize&&I+d<=T._options.maxTotalSize){l.readAsDataURL(s),I+=d;var t=T._round(T._options.maxTotalSize-I);L("sizeAvailable",t),L("currentSize",I)}else{var a=F.maxTotalSizeExceeded_msg;d>T._options.maxFileSize?(a=F.maxSizeExceeded_msg,T._logger("FILE REJECTED: Max size exceeded - max size: ".concat(T._options.maxFileSize," MB - file size: ").concat(d," MB"))):T._logger("FILE REJECTED: Max total size exceeded - max size: ".concat(T._options.maxTotalSizeExceeded_msg," MB - current total size: ").concat(I+d," MB")),n.classList.add("error");var r=n.querySelector(":scope > .loadBar");r.innerHTML="",r.insertAdjacentHTML("beforeend",'<div class="errorMsg">'.concat(a,"</div>")),setTimeout(function(){M._options.useFileIcons&&n.getPreviousSibling("img").remove(),n.remove()},2e3);var i=parseInt(document.getElementById("debugRejected")),o=i.innerHTML+1;i.innerHTML=o}},v=document.querySelector(".innerFileThumbs").children,m=v[v.length-1].getAttribute("index");function g(e){setTimeout(function(){e.remove()},2e3)}for(m=void 0!==m?parseInt(m)+1:0,r=0;r<t.length;r++){var h=t[r],y=new FileReader;if(a&&a.indexOf(h.name)<0){if(T._options.duplicatesWarning){var _=document.createElement("div");_.className="errorLabel center",_.innerHTML=F.duplicated_msg,C.appendChild(_),g(_)}T._logger("File duplicated: ".concat(h.name," -> skipping..."),2)}else{var b=void 0,x=void 0;x=0<h.name.lastIndexOf(".")?(b=h.name.substring(0,h.name.lastIndexOf(".")),h.name.substring(h.name.lastIndexOf(".")+1,h.name.length)):(b=h.name,T._options.defaultFileExt);var S=T._options.filenameTest(b,x,C);!1!==S?(void 0!==S&&!0!==S&&(b=S),T._createUploaderContainer(E,b,x),f(y,h,E,n),E++):T._logger("Invalid file name: ".concat(h.name),2)}}},this._options.name&&this._logger("INITIALIZED INSTANCE: "+this._options.name);var n=this._options.HTMLTemplate();t.insertAdjacentHTML("beforeend",n);var E=0,z=t.querySelector("."+this._options.resultContainerClass),a=t.querySelector(".fileLoader"),A=t.querySelector(".filesContainer"),C=t.querySelector(".innerFileThumbs"),r=t.querySelector(".dropZone"),F=this._options.langs[this._options.lang];this._options.reloadHTML&&(z.innerHTML=this._options.reloadHTML),t.querySelector(".introMsg").innerHTML=F.intro_msg,r.innerHTML=F.dropZone_msg,this._options.debug?(z.insertAdjacentHTML("beforebegin",'<p class="debugMode">Debug mode: on</p>'),z.insertAdjacentHTML("beforebegin",'<div class="debug">Uploaded files: <span id="debugUploaded">0</span> | Rejected files: <span id="debugRejected">0</span></div>'),z.insertAdjacentHTML("beforebegin",'<div class="debug">Current MAX FILE SIZE: '+this._options.maxFileSize+" MB</div>"),z.insertAdjacentHTML("beforebegin",'<div class="debug">Current MAX TOTAL SIZE: '+this._options.maxTotalSize+" MB</div>"),z.insertAdjacentHTML("beforebegin",'<div class="debug sizeAvailable">Size still available: <span>'+this._options.maxTotalSize+"</span> MB</div>")):z.classList.add("hide");var l={},i=this._options.labelsClasses;for(var o in i)l["".concat(o,"Labels")]=[];var s=this._options.labelsContainers;if(this._options.debug&&l.sizeAvailableLabels.push(t.querySelector(".".concat(i.sizeAvailable))),s){var c=function(e){return document.querySelector(e)};for(var d in i){var u=function(e,t,n){if(e){var a=e.querySelector(".".concat(t[n]));a&&l["".concat(n,"Labels")].push(a)}else this._logger("impossible to find labelContainer '".concat(selector,"'"),1)};if(Array.isArray(s)){var p=!0,f=!1,v=void 0;try{for(var m,g=s[Symbol.iterator]();!(p=(m=g.next()).done);p=!0)u(c(m.value),i,d)}catch(e){f=!0,v=e}finally{try{p||null==g.return||g.return()}finally{if(f)throw v}}}else{var h=c(s);if(h){var y=h.querySelector(".".concat(i[d]));y&&l["".concat(d,"Labels")].push(y)}else this._logger("impossible to find labelContainer '".concat(s,"'"),1)}}}L("maxFileSize",this._options.maxFileSize),L("maxTotalSize",this._options.maxTotalSize);var _,I=0,b=!0,x=!1,S=void 0;try{for(var q,H=z.querySelectorAll(":scope > .".concat(this._options.resultFileContainerClass)).entries()[Symbol.iterator]();!(b=(q=H.next()).done);b=!0){var O=k(q.value,2),D=(O[0],O[1]);this._logger("found previously uploaded file: index = ".concat(D.dataset.index),2);var j=D.querySelectorAll(":scope > input"),w=j[0].value,N=j[1].value,B=j[3].value;0<w.lastIndexOf(".")&&(w=w.substr(0,w.lastIndexOf("."))),(_=this._createUploaderContainer(E,w,N)).querySelector(":scope > .loadBar > div").style.width="100%",_.classList.add(this._options.reloadedFilesClass),I+=parseFloat(B),E++}}catch(e){x=!0,S=e}finally{try{b||null==H.return||H.return()}finally{if(x)throw S}}return 0<this._options.reloadArray.length&&this._options.reloadArray.forEach(function(e,t){(_=T._createUploaderContainer(t,e.name,e.ext)).querySelector(":scope > .loadBar > div").style.width="100%",_.classList.add(T._options.reloadedFilesClass),T._logger("found previously uploaded file: index = "+t,2);var n={index:t,name:e.name,type:e.ext,result:e.data,size:e.size};T._createResultContainer(n),I+=parseFloat(e.size),E++}),I=this._round(I),this._logger("current total size: "+I),L("sizeAvailable",this._options.maxTotalSize-I),L("currentSize",I),this._options.onload(this._options,I),this.handleDragOver=function(e){r.classList.add("highlight"),e.stopPropagation(),e.preventDefault(),e.dataTransfer.dropEffect="copy"},this.handleDrop=function(e){r.classList.remove("highlight"),e.data={DOM:t},T._filesRead(e)},r.addEventListener("dragleave",function(){r.classList.remove("highlight")}),r.addEventListener("dragover",this.handleDragOver),r.addEventListener("drop",function(){event.stopPropagation(),event.preventDefault(),T.handleDrop(event)}),r.addEventListener("click",function(e){a.click()}),a.addEventListener("change",function(e){e.data={DOM:t},T._filesRead(e),T.value=null}),{fileUploader:M,elementDOM:t}}},{deepmerge:2}],2:[function(e,t,n){var a,r;a=this,r=function(){"use strict";var r=function(e){return function(e){return!!e&&"object"==typeof e}(e)&&!function(e){var t=Object.prototype.toString.call(e);return"[object RegExp]"===t||"[object Date]"===t||function(e){return e.$$typeof===n}(e)}(e)};var n="function"==typeof Symbol&&Symbol.for?Symbol.for("react.element"):60103;function i(e,t){return!1!==t.clone&&t.isMergeableObject(e)?s(function(e){return Array.isArray(e)?[]:{}}(e),e,t):e}function o(e,t,n){return e.concat(t).map(function(e){return i(e,n)})}function l(t,n,a){var r={};return a.isMergeableObject(t)&&Object.keys(t).forEach(function(e){r[e]=i(t[e],a)}),Object.keys(n).forEach(function(e){a.isMergeableObject(n[e])&&t[e]?r[e]=function(e,t){if(!t.customMerge)return s;var n=t.customMerge(e);return"function"==typeof n?n:s}(e,a)(t[e],n[e],a):r[e]=i(n[e],a)}),r}function s(e,t,n){(n=n||{}).arrayMerge=n.arrayMerge||o,n.isMergeableObject=n.isMergeableObject||r;var a=Array.isArray(t);return a===Array.isArray(e)?a?n.arrayMerge(e,t,n):l(e,t,n):i(t,n)}return s.all=function(e,n){if(!Array.isArray(e))throw new Error("first argument should be an array");return e.reduce(function(e,t){return s(e,t,n)},{})},s},"object"==typeof n&&void 0!==t?t.exports=r():"function"==typeof define&&define.amd?define(r):a.deepmerge=r()},{}]},{},[1]);
//# sourceMappingURL=fileUploader.js.map
