!function i(o,l,s){function c(t,e){if(!l[t]){if(!o[t]){var n="function"==typeof require&&require;if(!e&&n)return n(t,!0);if(u)return u(t,!0);var r=new Error("Cannot find module '"+t+"'");throw r.code="MODULE_NOT_FOUND",r}var a=l[t]={exports:{}};o[t][0].call(a.exports,function(e){return c(o[t][1][e]||e)},a,a.exports,i,o,l,s)}return l[t].exports}for(var u="function"==typeof require&&require,e=0;e<s.length;e++)c(s[e]);return c}({1:[function(e,t,n){"use strict";var r,U=(r=e("deepmerge"))&&r.__esModule?r:{default:r};e("fs");function k(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=[],r=!0,a=!1,i=void 0;try{for(var o,l=e[Symbol.iterator]();!(r=(o=l.next()).done)&&(n.push(o.value),!t||n.length!==t);r=!0);}catch(e){a=!0,i=e}finally{try{r||null==l.return||l.return()}finally{if(a)throw i}}return n}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}window.FileUploader=function(t,e){var F=this,f=this;this._defaults={lang:"en",useFileIcons:!0,debug:!1,debugLogStyle:"color: #9900ff",name:void 0,pluginName:"FileUploader",useLoadingBars:!0,loadingBarsClasses:[],reloadedFilesClass:"reloadedElement",resultContainerClass:"result",resultFileContainerClass:"uploadedFile",resultPrefix:"fileUploader",resultInputNames:["title","extension","value","size"],defaultFileExt:"",defaultMimeType:"",maxFileSize:50,maxTotalSize:1e3,maxNumberOfFiles:!1,reloadArray:[],reloadHTML:void 0,linkButtonContent:"L",deleteButtonContent:"X",showErrorOnLoadBar:!0,allowDuplicates:!1,duplicatesWarning:!1,labelsContainers:!1,labelsClasses:{sizeAvailable:"sizeAvailable",currentSize:"currentSize",currentNumberOfFiles:"currentNumberOfFiles",maxFileSize:"maxFileSize",maxTotalSize:"maxTotalSize",maxNumberOfFiles:"maxNumberOfFiles",numberOfUploadedFiles:"numberOfUploadedFiles",numberOfRejectedFiles:"numberOfRejectedFiles"},HTMLTemplate:function(){return'<p class="introMsg"></p>\n                    <div>\n                        <div class="inputContainer">\n                            <input class="fileLoader" type="file" multiple />\n                        </div>\n                        <div class="dropZone"></div>\n                        <div class="filesContainer filesContainerEmpty">\n                            <div class="innerFileThumbs"></div>\n                            <div style="clear:both;"></div>\n                        </div>\n                    </div>\n                    <div class="result"></div>'},onload:function(){},onfileloadStart:function(){},onfileloadEnd:function(){},onfileRejected:function(){},onfileDelete:function(){},filenameTest:function(){},langs:{en:{intro_msg:"(Add attachments...)",dropZone_msg:"Drop your files here",maxSizeExceeded_msg:"File too large",maxTotalSizeExceeded_msg:"Total size exceeded",maxNumberOfFilesExceeded_msg:"Number of files allowed exceeded",duplicated_msg:"File duplicated (skipped)",name_placeHolder:"name"}}};var T=function(e,t){var n=!0,r=!1,a=void 0;try{for(var i,o=c["".concat(e,"Labels")][Symbol.iterator]();!(n=(i=o.next()).done);n=!0){var l=i.value.querySelector(":scope > span"),s=void 0;switch(t){case"++":s=parseInt(l.innerHTML)+1,l.innerHTML=s;break;case"--":s=parseInt(l.innerHTML)-1,l.innerHTML=s;break;default:l.innerHTML=t}}}catch(e){r=!0,a=e}finally{try{n||null==o.return||o.return()}finally{if(r)throw a}}};this._options=(0,U.default)(this._defaults,e),this.options=function(e){return e?(0,U.default)(F._options,e):F._options},this._round=function(e){return Math.round(100*e)/100},this.get=function(e){switch(e){case"currentTotalSize":return F._round(A);case"currentAvailableSize":return F._round(F._options.maxTotalSize-A);case"currentNumberOfFiles":return C;case"availableNumberOfFiles":return F._options.maxNumberOfFiles-C}},this._logger=function(e,t,n){if(F._options.debug){if(t)for(var r=0;r<t;r++)e="➡ "+e;F._options.name&&(e="["+F._options.pluginName+" - "+F._options.name+"] "+e),n?console.log("%c "+e,F._options.debugLogStyle,n):console.log("%c "+e,F._options.debugLogStyle)}},this._fileType=function(e){var t=e.substring(e.lastIndexOf(".")+1,e.length);return 0<=["pdf","jpg","png"].indexOf(t)?t:"unknown-file"},this._fileDelete=function(e,t){var n=t.element,r=e.target.dataset.delete;r||(r=e.target.closest("div[data-delete]").dataset.delete),F._options.useFileIcons&&function(e,t){var n=e.previousElementSibling;if(!t)return n;for(;n;){if(n.matches(t))return n;n=n.previousElementSibling}}(n,"img").remove(),n.remove();var a=E.querySelector('input[name="'.concat(F._options.resultPrefix,"[").concat(r,"][").concat(F._options.resultInputNames[3],']"]')).value;a=F._round(a),A=F._round(A-a),C--;var i=F._options.maxTotalSize-A;i=F._round(i),T("sizeAvailable",i),T("currentSize",A),T("currentNumberOfFiles",C),T("numberOfUploadedFiles","--"),E.querySelector(':scope > div[data-index="'.concat(r,'"]')).remove(),0===document.querySelector(".innerFileThumbs").children.length&&document.querySelector(".filesContainer").classList.add("filesContainerEmpty"),F._logger("Deleted file N: "+r,2),F._options.onfileDelete(r,A,C)},this._fileRename=function(e){var t=e.data.element,n=e.target,r=t.querySelector(":scope > .fileExt").innerHTML,a=n.value,i=t.dataset.index,o=E.querySelector('div[data-index="'.concat(i,'"] input')),l=F._options.filenameTest(a,r,O);if(!1===l)return e.preventDefault(),!1;void 0!==l&&!0!==l&&(a=l,n.value=a,o.value=a,n.setSelectionRange(e.data.start,e.data.stop))},this.getData=function(){var e=[];F._logger("RECEIVED SAVE COMMAND:",0);var t=!0,n=!1,r=void 0;try{for(var a,i=E.querySelectorAll(":scope > .".concat(F._options.resultFileContainerClass))[Symbol.iterator]();!(t=(a=i.next()).done);t=!0){var o=a.value.querySelectorAll(":scope > input"),l={title:o[0].value,ext:o[1].value,value:o[2].value};e.push(l)}}catch(e){n=!0,r=e}finally{try{t||null==i.return||i.return()}finally{if(n)throw r}}return F._logger("%O",0,e),e},this._createUploaderContainer=function(e,t,n){if(F._options.useFileIcons){var r='<img src="/images/'.concat(F._fileType(n),'.png" class="fileThumb" />');O.insertAdjacentHTML("beforeend",r)}var a=document.createElement("div");a.className="newElement",a.dataset.index=parseInt(e),a.style.position="relative",O.appendChild(a);var i=document.createElement("div");i.className="fileActions",a.appendChild(i);var o=document.createElement("div");o.className="fileSee",o.innerHTML=F._options.linkButtonContent,i.appendChild(o),o.addEventListener("click",function(e){var t=e.target.closest(".newElement").dataset.index,n=E.querySelector('.uploadedFile[data-index="'.concat(t,'"] textarea')).value;window.open().document.write('<iframe src="'.concat(n,'" frameborder="0" style="border:0; top:0px; display:block; left:0px; bottom:0px; right:0px; width:100%; min-height: 100vh; height:100%;" allowfullscreen></iframe>'))});var l=document.createElement("div");if(l.className="fileDelete",l.dataset.delete=parseInt(e),l.innerHTML=F._options.deleteButtonContent,i.append(l),l.addEventListener("click",function(e){F._fileDelete(e,{element:a})}),F._options.useLoadingBars){var s=F._options.loadingBarsClasses;0<s.length&&(s=s.join(" "));var c=document.createElement("div");c.className="loadBar ".concat(s),c.appendChild(document.createElement("div")),a.prepend(c)}var u=document.createElement("input");u.setAttribute("placeholder","nome"),u.className="fileTitle";var d=document.createElement("div");return d.className="fileExt",a.prepend(d),a.prepend(u),function(e,t,n){t instanceof Array||this._logger("addMultipleListeners requires events to be an array");var r=!0,a=!1,i=void 0;try{for(var o,l=t[Symbol.iterator]();!(r=(o=l.next()).done);r=!0){var s=o.value;e.addEventListener(s,n)}}catch(e){a=!0,i=e}finally{try{r||null==l.return||l.return()}finally{if(a)throw i}}}(u,["keypress","keyup","paste"],function(e){e.data={},e.data.element=a,e.data.start=this.selectionStart,e.data.stop=this.selectionEnd,f._fileRename(e)}),u.value=t,d.innerHTML=n,a},this._createResultContainer=function(e){var t=e.index,n=document.createElement("div");n.className=F._options.resultFileContainerClass,n.dataset.index=t,n.insertAdjacentHTML("beforeend","<div>File: ".concat(t,"</div>")),n.insertAdjacentHTML("beforeend",'<input type="text" name="'.concat(F._options.resultPrefix,"[").concat(t,"][").concat(F._options.resultInputNames[0],']" value="').concat(e.name,'" />')),n.insertAdjacentHTML("beforeend",'<input type="text" name="'.concat(F._options.resultPrefix,"[").concat(t,"][").concat(F._options.resultInputNames[1],']" value="').concat(e.type,'" />')),n.insertAdjacentHTML("beforeend",'<textarea name="'.concat(F._options.resultPrefix,"[").concat(t,"][").concat(F._options.resultInputNames[2],']">').concat(e.result,"</textarea>")),n.insertAdjacentHTML("beforeend",'<input type="text" name="'.concat(F._options.resultPrefix,"[").concat(t,"][").concat(F._options.resultInputNames[3],']" value="').concat(e.size,'" />')),E.appendChild(n)},this._filesRead=function(e){var t,n=e.data.DOM,r=!1,a=0;if(t=e.target.files?(F._logger("files array source: file selector (click event)",1),e.target.files):(F._logger("files array source: dropzone (drag & drop event)",1),e.dataTransfer.files),F._logger("%O",0,t),!F._options.allowDuplicates){var i=[],o=[],l=!0,s=!(r=[]),c=void 0;try{for(var u,d=E.children[Symbol.iterator]();!(l=(u=d.next()).done);l=!0){var f=u.value;i.push(f.querySelector("input").value)}}catch(e){s=!0,c=e}finally{try{l||null==d.return||d.return()}finally{if(s)throw c}}for(a=0;a<t.length;a++)o.push(t[a].name);o.forEach(function(e){i.indexOf(e)<0&&r.push(e)})}M.classList.remove("filesContainerEmpty");var p=function(i,o,l,e){var c=Array.from(e.querySelector(".innerFileThumbs").children).filter(function(e){return parseInt(e.dataset.index)===l});c=c[0];var u=F._round(o.size/1e6);i.onloadstart=function(){F._options.onfileloadStart(l),F._logger("START read file: ".concat(l,", size: ").concat(u," MB"),2)},i.onprogress=function(e){if(e.lengthComputable){var t=F._round(e.loaded/e.total*100);F._logger("File ".concat(l," loaded: ").concat(t),3),t<=100&&(c.querySelector(":scope > .loadBar > div").style.width="100%")}},i.onloadend=function(){var e=o.type,t=o.name,n=i.result;if(!n)return!1;"data:"===n.substring(0,n.indexOf(";"))&&0<F._options.defaultMimeType.length&&(n="data:"+F._options.defaultMimeType+n.substring(n.indexOf(";"),n.length)),""===e&&(e=F._options.defaultMimeType),t.indexOf(".")<0&&""!==F._options.defaultFileExt&&(t="".concat(t,".").concat(F._options.defaultFileExt));var r={index:l,name:t,type:e,result:n,size:u};F._createResultContainer(r),F._logger("END read file: ".concat(l),4);var a={name:o.name,type:o.type,data:n,size:u};F._options.onfileloadEnd(l,a,F._round(A),C)};var t=!0,d=[];F._options.maxFileSize&&u>F._options.maxFileSize&&(t=!1,d.push("maxFileSize")),F._options.maxTotalSize&&A+u>F._options.maxTotalSize&&(t=!1,d.push("maxTotalSize")),F._options.maxNumberOfFiles&&C>=F._options.maxNumberOfFiles&&(t=!1,d.push("maxNumberOfFiles")),t?function(e){i.readAsDataURL(o),A+=u,C++;var t=e._round(e._options.maxTotalSize-A);T("sizeAvailable",t),T("currentSize",A),T("currentNumberOfFiles",C),T("numberOfUploadedFiles","++")}(F):function(e,t){var n,r=!0,a=!1,i=void 0;try{for(var o,l=t[Symbol.iterator]();!(r=(o=l.next()).done);r=!0)switch(o.value){case"maxFileSize":n=z.maxSizeExceeded_msg,e._logger("FILE REJECTED: Max file size exceeded - max size: ".concat(e._options.maxFileSize," MB - file size: ").concat(u," MB"));break;case"maxTotalSize":n=z.maxTotalSizeExceeded_msg,e._logger("FILE REJECTED: Max total size exceeded - max size: ".concat(e._options.maxTotalSize," MB - current total size: ").concat(A+u," MB"));break;case"maxNumberOfFiles":n=z.maxNumberOfFilesExceeded_msg,e._logger("FILE REJECTED: Max number of files exceeded - max number: ".concat(e._options.maxNumberOfFiles))}}catch(e){a=!0,i=e}finally{try{r||null==l.return||l.return()}finally{if(a)throw i}}if(c.classList.add("error"),e._options.showErrorOnLoadBar){var s=c.querySelector(":scope > .loadBar");s.innerHTML="",s.insertAdjacentHTML("beforeend",'<div class="errorMsg">'.concat(n,"</div>"))}setTimeout(function(){e._options.useFileIcons&&c.getPreviousSibling("img").remove(),c.remove()},2e3),T("numberOfRejectedFiles","++"),e._options.onFileRejected(d)}(F,d)},m=document.querySelector(".innerFileThumbs").children,v=m[m.length-1];function g(e){setTimeout(function(){e.remove()},2e3)}for(v&&v.getAttribute("index"),a=0;a<t.length;a++){var b=t[a],h=new FileReader;if(r&&r.indexOf(b.name)<0){if(F._options.duplicatesWarning){var _=document.createElement("div");_.className="errorLabel center",_.innerHTML=z.duplicated_msg,O.appendChild(_),g(_)}F._logger("File duplicated: ".concat(b.name," -> skipping..."),2)}else{var y=void 0,x=void 0;x=0<b.name.lastIndexOf(".")?(y=b.name.substring(0,b.name.lastIndexOf(".")),b.name.substring(b.name.lastIndexOf(".")+1,b.name.length)):(y=b.name,F._options.defaultFileExt);var S=F._options.filenameTest(y,x,O);!1!==S?(void 0!==S&&!0!==S&&(y=S),F._createUploaderContainer(L,y,x),p(h,b,L,n),L++):F._logger("Invalid file name: ".concat(b.name),2)}}},this._options.name&&this._logger("INITIALIZED INSTANCE: "+this._options.name);var n=this._options.HTMLTemplate();t.insertAdjacentHTML("beforeend",n);var r,L=0,E=t.querySelector("."+this._options.resultContainerClass),a=t.querySelector(".fileLoader"),M=t.querySelector(".filesContainer"),O=t.querySelector(".innerFileThumbs"),i=t.querySelector(".dropZone"),z=this._options.langs[this._options.lang],A=0,C=0,c={},o=this._options.labelsClasses;for(var l in this._options.reloadHTML&&(E.innerHTML=this._options.reloadHTML),t.querySelector(".introMsg").innerHTML=z.intro_msg,i.innerHTML=z.dropZone_msg,this._options.debug?(E.insertAdjacentHTML("beforebegin",'<p class="debugMode">Debug mode: on</p>'),E.insertAdjacentHTML("beforebegin",'<div class="debug">Uploaded files: <span class="'.concat(o.numberOfUploadedFiles,'"><span>0</span></span> | Rejected files: <span class="').concat(o.numberOfRejectedFiles,'"><span>0</span></span></div>')),E.insertAdjacentHTML("beforebegin",'<div class="debug">MAX FILE SIZE: '.concat(this._options.maxFileSize," MB</div>")),E.insertAdjacentHTML("beforebegin",'<div class="debug">MAX TOTAL SIZE: '.concat(this._options.maxTotalSize," MB</div>")),E.insertAdjacentHTML("beforebegin",'<div class="debug">MAX NUMBER OF FILES: '.concat(!1===this._options.maxNumberOfFiles?"(none)":this._options.maxNumberOfFiles,"</div>")),E.insertAdjacentHTML("beforebegin",'<div class="debug currentNumberOfFiles">Number of files uploaded: <span>'.concat(C,"</span></div>")),E.insertAdjacentHTML("beforebegin",'<div class="debug sizeAvailable">Size still available: <span>'.concat(this._options.maxTotalSize,"</span> MB</div>"))):E.classList.add("hide"),o)c["".concat(l,"Labels")]=[];var s=this._options.labelsContainers;if(this._options.debug&&(c.sizeAvailableLabels.push(t.querySelector(".".concat(o.sizeAvailable))),c.currentNumberOfFilesLabels.push(t.querySelector(".".concat(o.currentNumberOfFiles))),c.numberOfUploadedFilesLabels.push(t.querySelector(".".concat(o.numberOfUploadedFiles))),c.numberOfRejectedFilesLabels.push(t.querySelector(".".concat(o.numberOfRejectedFiles)))),s){var u=function(e){return document.querySelector(e)};for(var d in o){var p=function(e,t,n){if(e){var r=e.querySelector(".".concat(t[n]));r&&c["".concat(n,"Labels")].push(r)}else this._logger("impossible to find labelContainer '".concat(selector,"'"),1)};if(Array.isArray(s)){var m=!0,v=!1,g=void 0;try{for(var b,h=s[Symbol.iterator]();!(m=(b=h.next()).done);m=!0)p(u(b.value),o,d)}catch(e){v=!0,g=e}finally{try{m||null==h.return||h.return()}finally{if(v)throw g}}}else{var _=u(s);if(_){var y=_.querySelector(".".concat(o[d]));y&&c["".concat(d,"Labels")].push(y)}else this._logger("impossible to find labelContainer '".concat(s,"'"),1)}}}T("maxFileSize",this._options.maxFileSize),T("maxTotalSize",this._options.maxTotalSize),T("maxNumberOfFiles",this._options.maxNumberOfFiles);var x=!0,S=!1,N=void 0;try{for(var j,q=E.querySelectorAll(":scope > .".concat(this._options.resultFileContainerClass)).entries()[Symbol.iterator]();!(x=(j=q.next()).done);x=!0){var w=k(j.value,2),I=(w[0],w[1]);this._logger("found previously uploaded file: index = ".concat(I.dataset.index),2);var H=I.querySelectorAll(":scope > input"),D=H[0].value,R=H[1].value,B=H[3].value;0<D.lastIndexOf(".")&&(D=D.substr(0,D.lastIndexOf("."))),(r=this._createUploaderContainer(L,D,R)).querySelector(":scope > .loadBar > div").style.width="100%",r.classList.add(this._options.reloadedFilesClass),A+=parseFloat(B),C++,L++}}catch(e){S=!0,N=e}finally{try{x||null==q.return||q.return()}finally{if(S)throw N}}return 0<this._options.reloadArray.length&&this._options.reloadArray.forEach(function(e,t){(r=F._createUploaderContainer(t,e.name,e.ext)).querySelector(":scope > .loadBar > div").style.width="100%",r.classList.add(F._options.reloadedFilesClass),F._logger("found previously uploaded file: index = "+t,2);var n={index:t,name:e.name,type:e.ext,result:e.data,size:e.size};F._createResultContainer(n),A+=parseFloat(e.size),C++,L++}),A=this._round(A),this._logger("current total size: ".concat(A," - current number of files: ").concat(C)),T("sizeAvailable",this._options.maxTotalSize-A),T("currentSize",A),T("currentNumberOfFiles",C),T("numberOfUploadedFiles",C),T("numberOfRejectedFiles","0"),this._options.onload(this._options,A,C),this.handleDragOver=function(e){i.classList.add("highlight"),e.stopPropagation(),e.preventDefault(),e.dataTransfer.dropEffect="copy"},this.handleDrop=function(e){i.classList.remove("highlight"),e.data={DOM:t},F._filesRead(e)},i.addEventListener("dragleave",function(){i.classList.remove("highlight")}),i.addEventListener("dragover",this.handleDragOver),i.addEventListener("drop",function(){event.stopPropagation(),event.preventDefault(),F.handleDrop(event)}),i.addEventListener("click",function(e){a.click()}),a.addEventListener("change",function(e){e.data={DOM:t},F._filesRead(e),F.value=null}),{fileUploader:f,elementDOM:t}}},{deepmerge:3,fs:2}],2:[function(e,t,n){},{}],3:[function(e,t,n){var r,a;r=this,a=function(){"use strict";var a=function(e){return function(e){return!!e&&"object"==typeof e}(e)&&!function(e){var t=Object.prototype.toString.call(e);return"[object RegExp]"===t||"[object Date]"===t||function(e){return e.$$typeof===n}(e)}(e)};var n="function"==typeof Symbol&&Symbol.for?Symbol.for("react.element"):60103;function i(e,t){return!1!==t.clone&&t.isMergeableObject(e)?s(function(e){return Array.isArray(e)?[]:{}}(e),e,t):e}function o(e,t,n){return e.concat(t).map(function(e){return i(e,n)})}function l(t,n,r){var a={};return r.isMergeableObject(t)&&Object.keys(t).forEach(function(e){a[e]=i(t[e],r)}),Object.keys(n).forEach(function(e){r.isMergeableObject(n[e])&&t[e]?a[e]=function(e,t){if(!t.customMerge)return s;var n=t.customMerge(e);return"function"==typeof n?n:s}(e,r)(t[e],n[e],r):a[e]=i(n[e],r)}),a}function s(e,t,n){(n=n||{}).arrayMerge=n.arrayMerge||o,n.isMergeableObject=n.isMergeableObject||a;var r=Array.isArray(t);return r===Array.isArray(e)?r?n.arrayMerge(e,t,n):l(e,t,n):i(t,n)}return s.all=function(e,n){if(!Array.isArray(e))throw new Error("first argument should be an array");return e.reduce(function(e,t){return s(e,t,n)},{})},s},"object"==typeof n&&void 0!==t?t.exports=a():"function"==typeof define&&define.amd?define(a):r.deepmerge=a()},{}]},{},[1]);
//# sourceMappingURL=fileUploader.js.map
