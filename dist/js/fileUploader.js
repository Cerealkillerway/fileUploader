(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _deepmerge = _interopRequireDefault(require("deepmerge"));

require("element-qsa-scope");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/*
* fileUploader v5.7.20
* Licensed under MIT (https://raw.githubusercontent.com/Cerealkillerway/fileUploader/master/license.txt)
*/
(function (context) {
  context.FileUploader = function ($el, options) {
    var _this = this;

    var instance = this; // default options

    this._defaults = {
      lang: 'en',
      useFileIcons: true,
      debug: false,
      // activate console logs for debug
      debugLogStyle: 'color: #9900ff',
      // css style for debug console logs in js console
      name: undefined,
      // a name for plugin's instance (useful for debug purposes)
      pluginName: 'FileUploader',
      // plugin's name (used in debug logs alongside with name)
      useLoadingBars: true,
      // insert loading bar for files
      loadingBarsClasses: [],
      // array of strings for classnames for loading bars
      reloadedFilesClass: 'reloadedElement',
      // class for previously uploaded files
      resultContainerClass: 'result',
      // result container's class (where to place result files data)
      resultFileContainerClass: 'uploadedFile',
      // class for every file result container span
      resultPrefix: 'fileUploader',
      // prefix for inputs in the file result container
      resultInputNames: ['title', 'extension', 'value', 'size'],
      // name suffix to be used for result inputs
      defaultFileExt: '',
      // extension to use for files with no extension
      defaultMimeType: '',
      // MIME type to use for files with no extension
      maxFileSize: 50,
      // maximum allowed file size (in MB)
      maxTotalSize: 1000,
      // total maximum allowed size of all files
      maxNumberOfFiles: false,
      // maximum number of files allowed to upload
      reloadArray: [],
      // array of files to be reloaded at plugin startup
      reloadHTML: undefined,
      // HTML for reloaded files to place directly in result container
      linkButtonContent: 'L',
      // HTML content for link button
      deleteButtonContent: 'X',
      // HTML content for delete button
      showErrorOnLoadBar: true,
      // decides if the reason for a rejected file will be displayed over its load bar;
      // in case the file is rejected because of more than one reason, only the first one will be displayed on the bar;
      allowDuplicates: false,
      // allow upload duplicates
      duplicatesWarning: false,
      // show a message in the loading area when trying to load a duplicated file
      labelsContainers: false,
      // query selector for the container where to look for labels (ex. '#myId'), (default 'false' -> no labels;
      // can be a string for a single value, or an array if the plugin has to update labels in many places;
      useSourceFileSize: false,
      // tells to the plugin to use the original file size in size calculations; by default it will use the size of the
      // base64 string created by the reader instead (which is bigger);
      mimeTypesToOpen: [// when clicking the "open" button, a file with mimeType in this list will be opened in a new tab of the browser
      'application/pdf', // while others are just downloaded;
      'image/png', 'image/jpeg'],
      labelsClasses: {
        // dictionary of classes used by the various labels handled by the plugin
        sizeAvailable: 'sizeAvailable',
        currentSize: 'currentSize',
        currentNumberOfFiles: 'currentNumberOfFiles',
        maxFileSize: 'maxFileSize',
        maxTotalSize: 'maxTotalSize',
        maxNumberOfFiles: 'maxNumberOfFiles',
        numberOfUploadedFiles: 'numberOfUploadedFiles',
        numberOfRejectedFiles: 'numberOfRejectedFiles'
      },
      HTMLTemplate: function HTMLTemplate() {
        return "<p class=\"introMsg\"></p>\n                    <div>\n                        <div class=\"inputContainer\">\n                            <input class=\"fileLoader\" type=\"file\" multiple />\n                        </div>\n                        <div class=\"dropZone\"></div>\n                        <div class=\"filesContainer filesContainerEmpty\">\n                            <div class=\"innerFileThumbs\"></div>\n                            <div style=\"clear:both;\"></div>\n                        </div>\n                    </div>\n                    <div class=\"result\"></div>";
      },
      onload: function onload() {},
      // callback on plugin initialization
      onfileloadStart: function onfileloadStart() {},
      // callback on file reader start
      onfileloadEnd: function onfileloadEnd() {},
      // callback on file reader end
      onfileRejected: function onfileRejected() {},
      // callback on file rejected
      onfileDelete: function onfileDelete() {},
      // callback on file delete
      filenameTest: function filenameTest() {},
      // callback for testing filenames
      langs: {
        'en': {
          intro_msg: '(Add attachments...)',
          dropZone_msg: 'Drop your files here',
          maxSizeExceeded_msg: 'File too large',
          maxTotalSizeExceeded_msg: 'Total size exceeded',
          maxNumberOfFilesExceeded_msg: 'Number of files allowed exceeded',
          duplicated_msg: 'File duplicated (skipped)'
        }
      }
    }; // UTILITIES

    var addMultipleListeners = function addMultipleListeners(element, events, handler) {
      if (!(events instanceof Array)) {
        this._logger('addMultipleListeners requires events to be an array');
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = events[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _event = _step.value;
          element.addEventListener(_event, handler);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    };

    var getPreviousSibling = function getPreviousSibling(element, selector) {
      var sibling = element.previousElementSibling;
      if (!selector) return sibling;

      while (sibling) {
        if (sibling.matches(selector)) {
          return sibling;
        }

        sibling = sibling.previousElementSibling;
      }
    };

    var updateLabel = function updateLabel(type, value) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = instanceLabels["".concat(type, "Labels")][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var label = _step2.value;
          var labelSpan = label.querySelector(':scope > span');
          var prevValue = void 0;

          switch (value) {
            case '++':
              prevValue = parseInt(labelSpan.innerHTML) + 1;
              labelSpan.innerHTML = prevValue;
              break;

            case '--':
              prevValue = parseInt(labelSpan.innerHTML) - 1;
              labelSpan.innerHTML = prevValue;
              break;

            default:
              labelSpan.innerHTML = value;
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }; // returns the byte length of an utf8 string


    var byteLength = function byteLength(utf8String) {
      var size = utf8String.length;

      for (var i = utf8String.length - 1; i >= 0; i--) {
        var code = utf8String.charCodeAt(i);

        if (code > 0x7f && code <= 0x7ff) {
          size++;
        } else {
          if (code > 0x7ff && code <= 0xffff) {
            size += 2;
          }
        } //trail surrogate


        if (code >= 0xDC00 && code <= 0xDFFF) {
          i--;
        }
      }

      return size;
    }; // update open file button attributes


    var updateFileSeeLink = function updateFileSeeLink(result, uploaderContainer, fileName) {
      var mimeType = result.substring(5, result.indexOf(';'));
      var fileSeeLink = uploaderContainer.querySelector('.fileSee');

      if (_this._options.mimeTypesToOpen.indexOf(mimeType) >= 0) {
        fileSeeLink.addEventListener('click', function () {
          var win = window.open();
          win.document.write("<iframe src=\"".concat(result, "\" frameborder=\"0\" style=\"border:0; top:0px; display:block; left:0px; bottom:0px; right:0px; width:100%; min-height: 100vh; height:100%;\" allowfullscreen></iframe>"));
        });
      } else {
        fileSeeLink.setAttribute('href', result);
        fileSeeLink.setAttribute('download', fileName);
      }
    }; // extend options with instance ones


    var overwriteMerge = function overwriteMerge(dest, source, options) {
      return source;
    };

    this._options = (0, _deepmerge.default)(this._defaults, options, {
      arrayMerge: overwriteMerge
    }); // round number

    this._round = function (value) {
      return Math.round(value * 100) / 100;
    }; // return data


    this.get = function (parameter) {
      switch (parameter) {
        case 'currentTotalSize':
          return _this._round(currentTotalSize);

        case 'currentAvailableSize':
          return _this._round(_this._options.maxTotalSize - currentTotalSize);

        case 'currentNumberOfFiles':
          return currentNumberOfFiles;

        case 'availableNumberOfFiles':
          return _this._options.maxNumberOfFiles - currentNumberOfFiles;
      }
    }; // debug logs function


    this._logger = function (message, level, data) {
      if (_this._options.debug) {
        if (level) {
          for (var i = 0; i < level; i++) {
            message = "\u27A1 " + message;
          }
        }

        if (_this._options.name) {
          message = '[' + _this._options.pluginName + ' - ' + _this._options.name + '] ' + message;
        }

        if (data) {
          console.log('%c ' + message, _this._options.debugLogStyle, data);
        } else {
          console.log('%c ' + message, _this._options.debugLogStyle);
        }
      }
    }; // file type identificator


    this._fileType = function (fileName) {
      var ext = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length);
      var icons = ['pdf', 'jpg', 'png'];

      if (icons.indexOf(ext) >= 0) {
        return ext;
      } else {
        return 'unknown-file';
      }
    }; // method for deleting a reader's result from result container


    this._fileDelete = function (event, data) {
      var element = data.element;
      var index = event.target.dataset.delete;

      if (!index) {
        index = event.target.closest('div[data-delete]').dataset.delete;
      } // remove file block


      if (_this._options.useFileIcons) {
        getPreviousSibling(element, 'img').remove();
      }

      element.remove(); // get file size

      var fileSize = $resultContainer.querySelector("input[name=\"".concat(_this._options.resultPrefix, "[").concat(index, "][").concat(_this._options.resultInputNames[3], "]\"]")).value;
      fileSize = _this._round(fileSize);
      currentTotalSize = _this._round(currentTotalSize - fileSize);
      currentNumberOfFiles--;
      var availableSize = _this._options.maxTotalSize - currentTotalSize;
      availableSize = _this._round(availableSize);
      updateLabel('sizeAvailable', availableSize);
      updateLabel('currentSize', currentTotalSize);
      updateLabel('currentNumberOfFiles', currentNumberOfFiles);
      updateLabel('numberOfUploadedFiles', '--'); // remove result block

      $resultContainer.querySelector(":scope > div[data-index=\"".concat(index, "\"]")).remove();

      if (document.querySelector('.innerFileThumbs').children.length === 0) {
        document.querySelector('.filesContainer').classList.add('filesContainerEmpty');
      }

      _this._logger('Deleted file N: ' + index, 2);

      _this._options.onfileDelete(index, currentTotalSize, currentNumberOfFiles);
    }; // method to rename file in result container accordingly to modifications by user


    this._fileRename = function (event) {
      var element = event.data.element;
      var $this = event.target;
      var ext = element.querySelector(':scope > .fileExt').innerHTML;
      var text = $this.value;
      var index = element.dataset.index;
      var $input = $resultContainer.querySelector("div[data-index=\"".concat(index, "\"] input"));

      var nameTest = _this._options.filenameTest(text, ext, $fileThumbsContainer);

      if (nameTest === false) {
        event.preventDefault();
        return false;
      }

      if (nameTest !== undefined && nameTest !== true) {
        text = nameTest;
        $this.value = text; // update input

        /*if (ext.length > 0) {
            text = `${text}.${ext}`;
        }*/

        $input.value = text; // restore selection range

        $this.setSelectionRange(event.data.start, event.data.stop);
      }
    };

    this.getData = function () {
      var data = [];

      _this._logger('RECEIVED SAVE COMMAND:', 0);

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = $resultContainer.querySelectorAll(":scope > .".concat(_this._options.resultFileContainerClass))[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var element = _step3.value;
          var inputs = element.querySelectorAll(':scope > input');
          var file = {
            title: inputs[0].value,
            ext: inputs[1].value,
            value: inputs[2].value
          };
          data.push(file);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      _this._logger('%O', 0, data);

      return data;
    }; // create container for file uploading elements (icon, progress bar, etc...)


    this.createUploaderContainer = function (index, fileName, fileExt) {
      //insert file icon if requested
      if (_this._options.useFileIcons) {
        var currentThumb = "<img src=\"/images/".concat(_this._fileType(fileExt), ".png\" class=\"fileThumb\" />");
        $fileThumbsContainer.insertAdjacentHTML('beforeend', currentThumb);
      }

      var container = document.createElement('div');
      container.className = 'newElement';
      container.dataset.index = parseInt(index);
      container.style.position = 'relative';
      $fileThumbsContainer.appendChild(container);
      var fileButtonsContainer = document.createElement('div');
      fileButtonsContainer.className = 'fileActions';
      container.appendChild(fileButtonsContainer); // file "see" link

      var seeFileLink = document.createElement('a');
      seeFileLink.className = 'fileSee';
      seeFileLink.innerHTML = _this._options.linkButtonContent;
      fileButtonsContainer.appendChild(seeFileLink);
      /*seeFileLink.addEventListener('click', (event) => {
          let index = event.target.closest('.newElement').dataset.index;
          let content = $resultContainer.querySelector(`.uploadedFile[data-index="${index}"] textarea`).value;
          //let win = window.open();
          let mimeType = content.substring(5, content.indexOf(';'));
          
          if (this._options.mimeTypesToOpen.indexOf(mimeType) >= 0) {
              console.log('open!!');
              window.open(content);
          }
           //win.document.write(`<iframe src="${content}" frameborder="0" style="border:0; top:0px; display:block; left:0px; bottom:0px; right:0px; width:100%; min-height: 100vh; height:100%;" allowfullscreen></iframe>`)
      });*/
      // delete button

      var deleteBtn = document.createElement('div');
      deleteBtn.className = 'fileDelete';
      deleteBtn.dataset.delete = parseInt(index);
      deleteBtn.innerHTML = _this._options.deleteButtonContent;
      fileButtonsContainer.append(deleteBtn);
      deleteBtn.addEventListener('click', function (event) {
        _this._fileDelete(event, {
          element: container
        });
      }); //insert loading bars if requested

      if (_this._options.useLoadingBars) {
        var classes = _this._options.loadingBarsClasses;

        if (classes.length > 0) {
          classes = classes.join(' ');
        }

        var currentLoadBar = document.createElement('div');
        currentLoadBar.className = "loadBar ".concat(classes);
        currentLoadBar.appendChild(document.createElement('div'));
        container.prepend(currentLoadBar);
      }

      var currentTitle = document.createElement('input'); // TODO translate placeholder

      currentTitle.setAttribute('placeholder', 'nome');
      currentTitle.className = 'fileTitle';
      var currentExtension = document.createElement('div');
      currentExtension.className = 'fileExt';
      container.prepend(currentExtension);
      container.prepend(currentTitle);
      addMultipleListeners(currentTitle, ['keypress', 'keyup', 'paste'], function (event) {
        event.data = {};
        event.data.element = container;
        event.data.start = this.selectionStart;
        event.data.stop = this.selectionEnd;

        instance._fileRename(event);
      });
      currentTitle.value = fileName;
      currentExtension.innerHTML = fileExt;
      return container;
    };

    this._createResultContainer = function (fileData) {
      var index = fileData.index;
      var resultElemContainer = document.createElement('div');
      resultElemContainer.className = _this._options.resultFileContainerClass;
      resultElemContainer.dataset.index = index;
      resultElemContainer.insertAdjacentHTML('beforeend', "<div>File: ".concat(index, "</div>"));
      resultElemContainer.insertAdjacentHTML('beforeend', "<input type=\"text\" name=\"".concat(_this._options.resultPrefix, "[").concat(index, "][").concat(_this._options.resultInputNames[0], "]\" value=\"").concat(fileData.name, "\" />"));
      resultElemContainer.insertAdjacentHTML('beforeend', "<input type=\"text\" name=\"".concat(_this._options.resultPrefix, "[").concat(index, "][").concat(_this._options.resultInputNames[1], "]\" value=\"").concat(fileData.type, "\" />"));
      resultElemContainer.insertAdjacentHTML('beforeend', "<textarea name=\"".concat(_this._options.resultPrefix, "[").concat(index, "][").concat(_this._options.resultInputNames[2], "]\">").concat(fileData.result, "</textarea>"));
      resultElemContainer.insertAdjacentHTML('beforeend', "<input type=\"text\" name=\"".concat(_this._options.resultPrefix, "[").concat(index, "][").concat(_this._options.resultInputNames[3], "]\" value=\"").concat(fileData.size, "\" />"));
      $resultContainer.appendChild(resultElemContainer);
    }; // files read function


    this._filesRead = function (event) {
      var DOM = event.data.DOM;
      var filesList;
      var approvedList = false;
      var i = 0;

      if (event.target.files) {
        _this._logger('files array source: file selector (click event)', 1);

        filesList = event.target.files;
      } else {
        _this._logger('files array source: dropzone (drag & drop event)', 1);

        filesList = event.dataTransfer.files;
      }

      _this._logger('%O', 0, filesList); // build approved list


      if (!_this._options.allowDuplicates) {
        var loadedFiles = [];
        var newFiles = [];
        approvedList = []; // build already loaded files list

        for (var _i = 0; _i < $resultContainer.children.length; _i++) {
          loadedFiles.push($resultContainer.children[_i].querySelector('input').value);
        }

        ; // build current selected files list

        for (i = 0; i < filesList.length; i++) {
          newFiles.push(filesList[i].name);
        } // avoid load twice the same file


        newFiles.forEach(function (newFile) {
          var fileIndex = loadedFiles.indexOf(newFile);

          if (fileIndex < 0) {
            // max number of files handling
            if (instance._options.maxNumberOfFiles && currentNumberOfFiles >= instance._options.maxNumberOfFiles) {
              //isReadAllowed = false;
              //rejectReasons.push('maxNumberOfFiles');
              console.log('max files!!!');
            } else {
              currentNumberOfFiles++;
              approvedList.push(newFile);
            }
          }
        });
      }

      $fileContainer.classList.remove('filesContainerEmpty');

      var readFile = function readFile(reader, file, index, DOM, uploaderContainer) {
        var currentElement = Array.from(DOM.querySelector('.innerFileThumbs').children).filter(function (element) {
          return parseInt(element.dataset.index) === index;
        });
        currentElement = currentElement[0];

        var size = _this._round(file.size / 1000000); // size in MB


        reader.onloadstart = function () {
          _this._options.onfileloadStart(index);

          _this._logger("START read file: ".concat(index, ", size: ").concat(size, " MB"), 2);
        };

        reader.onprogress = function (event) {
          if (event.lengthComputable) {
            var percentLoaded = _this._round(event.loaded / event.total * 100);

            _this._logger("File ".concat(index, " loaded: ").concat(percentLoaded), 3); // Increase the progress bar length.


            if (percentLoaded <= 100) {
              currentElement.querySelector(':scope > .loadBar > div').style.width = '100%';
            }
          }
        };

        reader.onloadend = function () {
          var type = file.type;
          var name = file.name;
          var result = reader.result; // reading unsuccessful

          if (!result) {
            return false;
          }

          var mimeType = result.substring(0, result.indexOf(';')); // if file has no MIME type, replace with default one

          if (mimeType === 'data:' && _this._options.defaultMimeType.length > 0) {
            result = "data:" + _this._options.defaultMimeType + result.substring(result.indexOf(';'), result.length);
          }

          if (type === "") {
            type = _this._options.defaultMimeType;
          }

          if (name.indexOf('.') < 0 && _this._options.defaultFileExt !== '') {
            name = "".concat(name, ".").concat(_this._options.defaultFileExt);
          }

          if (!_this._options.useSourceFileSize) {
            size = _this._round(byteLength(result) / 1000000);
          }

          var newFile = {
            index: index,
            name: name,
            type: type,
            result: result,
            size: size
          };

          _this._createResultContainer(newFile); //set direct link on file see button


          _this._logger("END read file: ".concat(index), 4);

          var resultObject = {
            name: file.name,
            type: file.type,
            data: result,
            size: size
          }; // update total size

          currentTotalSize = currentTotalSize + size; //currentNumberOfFiles++;

          var currentAvailableSize = instance._round(instance._options.maxTotalSize - currentTotalSize);

          updateLabel('sizeAvailable', currentAvailableSize);
          updateLabel('currentSize', currentTotalSize); //updateLabel('currentNumberOfFiles', currentNumberOfFiles);

          updateLabel('numberOfUploadedFiles', '++');
          updateFileSeeLink(result, uploaderContainer, file.name);

          _this._options.onfileloadEnd(index, resultObject, _this._round(currentTotalSize), currentNumberOfFiles);
        }; // test if loading is allowed


        function readAllowed(instance) {
          reader.readAsDataURL(file);
        }

        function readRejected(instance, reasons) {
          var errorMsg;
          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = reasons[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var reason = _step4.value;

              switch (reason) {
                case 'maxFileSize':
                  errorMsg = currentLangObj.maxSizeExceeded_msg;

                  instance._logger("FILE REJECTED: Max file size exceeded - max size: ".concat(instance._options.maxFileSize, " MB - file size: ").concat(size, " MB"));

                  break;

                case 'maxTotalSize':
                  errorMsg = currentLangObj.maxTotalSizeExceeded_msg;

                  instance._logger("FILE REJECTED: Max total size exceeded - max size: ".concat(instance._options.maxTotalSize, " MB - current total size: ").concat(currentTotalSize + size, " MB"));

                  break;

                case 'maxNumberOfFiles':
                  errorMsg = currentLangObj.maxNumberOfFilesExceeded_msg;

                  instance._logger("FILE REJECTED: Max number of files exceeded - max number: ".concat(instance._options.maxNumberOfFiles));

                  break;
              }
            }
          } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
                _iterator4.return();
              }
            } finally {
              if (_didIteratorError4) {
                throw _iteratorError4;
              }
            }
          }

          currentElement.classList.add('error');

          if (instance._options.showErrorOnLoadBar) {
            var loadBar = currentElement.querySelector(':scope > .loadBar');
            loadBar.innerHTML = '';
            loadBar.insertAdjacentHTML('beforeend', "<div class=\"errorMsg\">".concat(errorMsg, "</div>"));
          }

          setTimeout(function () {
            if (instance._options.useFileIcons) {
              currentElement.getPreviousSibling('img').remove();
            }

            currentElement.remove();
          }, 2000);
          updateLabel('numberOfRejectedFiles', '++'); // error callback

          instance._options.onfileRejected(rejectReasons);
        }

        var isReadAllowed = true;
        var rejectReasons = [];

        if (_this._options.maxFileSize && size > _this._options.maxFileSize) {
          isReadAllowed = false;
          rejectReasons.push('maxFileSize');
        }

        if (_this._options.maxTotalSize && currentTotalSize + size > _this._options.maxTotalSize) {
          isReadAllowed = false;
          rejectReasons.push('maxTotalSize');
        }
        /*if (this._options.maxNumberOfFiles && currentNumberOfFiles >= this._options.maxNumberOfFiles) {
            isReadAllowed = false;
            rejectReasons.push('maxNumberOfFiles');
        }*/


        isReadAllowed ? readAllowed(_this) : readRejected(_this, rejectReasons);
      };

      function appendMessage($message) {
        setTimeout(function () {
          $message.remove();
        }, 2000);
      } // create a new div containing thumb, delete button and title field for each target file


      for (i = 0; i < filesList.length; i++) {
        var file = filesList[i];
        var reader = new FileReader(); // test for duplicates

        if (approvedList && approvedList.indexOf(file.name) < 0) {
          var $info = document.createElement('div');
          $info.className = 'errorLabel center';

          if (_this._options.maxNumberOfFiles && currentNumberOfFiles >= _this._options.maxNumberOfFiles) {
            $info.innerHTML = currentLangObj.maxNumberOfFilesExceeded_msg;

            _this._logger("File max number reached: ".concat(file.name, " -> skipping..."), 2);
          } else if (_this._options.duplicatesWarning) {
            $info.innerHTML = currentLangObj.duplicated_msg;

            _this._logger("File duplicated: ".concat(file.name, " -> skipping..."), 2);
          }

          $fileThumbsContainer.appendChild($info);
          appendMessage($info);
          continue;
        }

        var fileName = void 0,
            fileExt = void 0;

        if (file.name.lastIndexOf('.') > 0) {
          fileName = file.name.substring(0, file.name.lastIndexOf('.'));
          fileExt = file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length);
        } else {
          fileName = file.name;
          fileExt = _this._options.defaultFileExt;
        } // test for filenames


        var nameTest = _this._options.filenameTest(fileName, fileExt, $fileThumbsContainer);

        if (nameTest === false) {
          _this._logger("Invalid file name: ".concat(file.name), 2);

          continue;
        } else {
          if (nameTest !== undefined && nameTest !== true) {
            fileName = nameTest;
          }
        }

        var uploaderContainer = _this.createUploaderContainer(globalIndex, fileName, fileExt); // now read!


        readFile(reader, file, globalIndex, DOM, uploaderContainer);
        globalIndex++;
      }
    };
    /*
    *  -------------------------------------------------------------
    *  |                       MAIN FLOW                           |
    *  -------------------------------------------------------------
    */
    // initialization


    if (this._options.name) {
      this._logger('INITIALIZED INSTANCE: ' + this._options.name);
    } // build HTML template


    var template = this._options.HTMLTemplate();

    $el.insertAdjacentHTML('beforeend', template);
    var globalIndex = 0;
    var $resultContainer = $el.querySelector('.' + this._options.resultContainerClass);
    var $loadBtn = $el.querySelector('.fileLoader');
    var $fileContainer = $el.querySelector('.filesContainer');
    var $fileThumbsContainer = $el.querySelector('.innerFileThumbs');
    var dropZone = $el.querySelector('.dropZone');
    var currentLangObj = this._options.langs[this._options.lang];
    var currentTotalSize = 0;
    var currentNumberOfFiles = 0;
    var loadedFile;
    var instanceLabels = {};
    var labelsClasses = this._options.labelsClasses; // place reloaded files' HTML in result container directly (if provided)

    if (this._options.reloadHTML) {
      $resultContainer.innerHTML = this._options.reloadHTML;
    }

    $el.querySelector('.introMsg').innerHTML = currentLangObj.intro_msg;
    dropZone.innerHTML = currentLangObj.dropZone_msg;

    if (!this._options.debug) {
      $resultContainer.classList.add('hide');
    } else {
      $resultContainer.insertAdjacentHTML('beforebegin', '<p class="debugMode">Debug mode: on</p>');
      $resultContainer.insertAdjacentHTML('beforebegin', "<div class=\"debug\">Uploaded files: <span class=\"".concat(labelsClasses.numberOfUploadedFiles, "\"><span>0</span></span> | Rejected files: <span class=\"").concat(labelsClasses.numberOfRejectedFiles, "\"><span>0</span></span></div>"));
      $resultContainer.insertAdjacentHTML('beforebegin', "<div class=\"debug\">MAX FILE SIZE: ".concat(this._options.maxFileSize, " MB</div>"));
      $resultContainer.insertAdjacentHTML('beforebegin', "<div class=\"debug\">MAX TOTAL SIZE: ".concat(this._options.maxTotalSize, " MB</div>"));
      $resultContainer.insertAdjacentHTML('beforebegin', "<div class=\"debug\">MAX NUMBER OF FILES: ".concat(this._options.maxNumberOfFiles === false ? '(none)' : this._options.maxNumberOfFiles, "</div>"));
      $resultContainer.insertAdjacentHTML('beforebegin', "<div class=\"debug currentNumberOfFiles\">Number of files uploaded: <span>".concat(currentNumberOfFiles, "</span></div>"));
      $resultContainer.insertAdjacentHTML('beforebegin', "<div class=\"debug sizeAvailable\">Size still available: <span>".concat(this._options.maxTotalSize, "</span> MB</div>"));
    } // --- FILES RELOAD SECTION ---
    // lookup for previously loaded files placed in the result container directly        


    for (var label in labelsClasses) {
      instanceLabels["".concat(label, "Labels")] = [];
    }

    var labelsContainers = this._options.labelsContainers;

    if (this._options.debug) {
      // handle debug dynamic (labels with a static value don't need to be cached) labels
      instanceLabels.sizeAvailableLabels.push($el.querySelector(".".concat(labelsClasses.sizeAvailable)));
      instanceLabels.currentNumberOfFilesLabels.push($el.querySelector(".".concat(labelsClasses.currentNumberOfFiles)));
      instanceLabels.numberOfUploadedFilesLabels.push($el.querySelector(".".concat(labelsClasses.numberOfUploadedFiles)));
      instanceLabels.numberOfRejectedFilesLabels.push($el.querySelector(".".concat(labelsClasses.numberOfRejectedFiles)));
    }

    if (labelsContainers) {
      var getContainer = function getContainer(selector) {
        return document.querySelector(selector);
      };

      for (var _label in labelsClasses) {
        var findLabel = function findLabel(container, labelsClasses, label) {
          if (container) {
            var labels = container.querySelector(".".concat(labelsClasses[label]));

            if (labels) {
              instanceLabels["".concat(label, "Labels")].push(labels);
            }
          } else {
            this._logger("impossible to find labelContainer '".concat(selector, "'"), 1);
          }
        };

        if (Array.isArray(labelsContainers)) {
          var _iteratorNormalCompletion5 = true;
          var _didIteratorError5 = false;
          var _iteratorError5 = undefined;

          try {
            for (var _iterator5 = labelsContainers[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
              var _selector = _step5.value;
              var container = getContainer(_selector);
              findLabel(container, labelsClasses, _label);
            }
          } catch (err) {
            _didIteratorError5 = true;
            _iteratorError5 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
                _iterator5.return();
              }
            } finally {
              if (_didIteratorError5) {
                throw _iteratorError5;
              }
            }
          }
        } else {
          var _container = getContainer(labelsContainers);

          if (_container) {
            var labels = _container.querySelector(".".concat(labelsClasses[_label]));

            if (labels) {
              instanceLabels["".concat(_label, "Labels")].push(labels);
            }
          } else {
            this._logger("impossible to find labelContainer '".concat(labelsContainers, "'"), 1);
          }
        }
      }
    }

    updateLabel('maxFileSize', this._options.maxFileSize);
    updateLabel('maxTotalSize', this._options.maxTotalSize);
    updateLabel('maxNumberOfFiles', this._options.maxNumberOfFiles);
    var _iteratorNormalCompletion6 = true;
    var _didIteratorError6 = false;
    var _iteratorError6 = undefined;

    try {
      for (var _iterator6 = $resultContainer.querySelectorAll(":scope > .".concat(this._options.resultFileContainerClass)).entries()[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
        var _step6$value = _slicedToArray(_step6.value, 2),
            index = _step6$value[0],
            element = _step6$value[1];

        this._logger("found previously uploaded file: index = ".concat(element.dataset.index), 2); // pay attention to index used on fileData here: index 0 is the title DIV!


        var fileData = element.querySelectorAll(':scope > input');
        var fileName = fileData[0].value;
        var fileExt = fileData[1].value;
        var fileSize = fileData[2].value;

        if (fileName.lastIndexOf('.') > 0) {
          fileName = fileName.substr(0, fileName.lastIndexOf('.'));
        }

        loadedFile = this.createUploaderContainer(globalIndex, fileName, fileExt);
        loadedFile.querySelector(':scope > .loadBar > div').style.width = '100%';
        loadedFile.classList.add(this._options.reloadedFilesClass);
        var data = element.querySelector(':scope textarea').value;
        updateFileSeeLink(data, loadedFile, fileName);
        currentTotalSize = currentTotalSize + parseFloat(fileSize);
        currentNumberOfFiles++;
        globalIndex++;
      } // reload files from provided array

    } catch (err) {
      _didIteratorError6 = true;
      _iteratorError6 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
          _iterator6.return();
        }
      } finally {
        if (_didIteratorError6) {
          throw _iteratorError6;
        }
      }
    }

    if (this._options.reloadArray.length > 0) {
      this._options.reloadArray.forEach(function (file, index) {
        // re-create visible elements
        loadedFile = _this.createUploaderContainer(index, file.name, file.ext);
        loadedFile.querySelector(':scope > .loadBar > div').style.width = '100%';
        loadedFile.classList.add(_this._options.reloadedFilesClass);

        _this._logger('found previously uploaded file: index = ' + index, 2); // re-create results


        var newFile = {
          index: index,
          name: file.name,
          type: file.ext,
          result: file.data,
          size: file.size
        };
        updateFileSeeLink(file.data, loadedFile, file.name);

        _this._createResultContainer(newFile);

        currentTotalSize = currentTotalSize + parseFloat(file.size);
        currentNumberOfFiles++;
        globalIndex++;
      });
    }

    currentTotalSize = this._round(currentTotalSize);

    this._logger("current total size: ".concat(currentTotalSize, " - current number of files: ").concat(currentNumberOfFiles));

    updateLabel('sizeAvailable', this._options.maxTotalSize - currentTotalSize);
    updateLabel('currentSize', currentTotalSize);
    updateLabel('currentNumberOfFiles', currentNumberOfFiles);
    updateLabel('numberOfUploadedFiles', currentNumberOfFiles);
    updateLabel('numberOfRejectedFiles', '0'); // --- END FILES RELOAD SECTION ---
    // onload callback

    this._options.onload(this._options, currentTotalSize, currentNumberOfFiles); // Drag events


    this.handleDragOver = function (event) {
      dropZone.classList.add('highlight');
      event.stopPropagation();
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    };

    this.handleDrop = function (event) {
      dropZone.classList.remove('highlight');
      event.data = {
        DOM: $el
      };

      _this._filesRead(event);
    };

    dropZone.addEventListener('dragleave', function () {
      dropZone.classList.remove('highlight');
    });
    dropZone.addEventListener('dragover', this.handleDragOver);
    dropZone.addEventListener('drop', function () {
      event.stopPropagation();
      event.preventDefault();

      _this.handleDrop(event);
    });
    dropZone.addEventListener('click', function (event) {
      $loadBtn.click();
    });
    $loadBtn.addEventListener('change', function (event) {
      event.data = {
        DOM: $el
      };

      _this._filesRead(event);

      _this.value = null;
    });
    return {
      fileUploader: instance,
      elementDOM: $el
    };
  };
})(window);

},{"deepmerge":2,"element-qsa-scope":3}],2:[function(require,module,exports){
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.deepmerge = factory());
}(this, (function () { 'use strict';

var isMergeableObject = function isMergeableObject(value) {
	return isNonNullObject(value)
		&& !isSpecial(value)
};

function isNonNullObject(value) {
	return !!value && typeof value === 'object'
}

function isSpecial(value) {
	var stringValue = Object.prototype.toString.call(value);

	return stringValue === '[object RegExp]'
		|| stringValue === '[object Date]'
		|| isReactElement(value)
}

// see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

function isReactElement(value) {
	return value.$$typeof === REACT_ELEMENT_TYPE
}

function emptyTarget(val) {
	return Array.isArray(val) ? [] : {}
}

function cloneUnlessOtherwiseSpecified(value, options) {
	return (options.clone !== false && options.isMergeableObject(value))
		? deepmerge(emptyTarget(value), value, options)
		: value
}

function defaultArrayMerge(target, source, options) {
	return target.concat(source).map(function(element) {
		return cloneUnlessOtherwiseSpecified(element, options)
	})
}

function getMergeFunction(key, options) {
	if (!options.customMerge) {
		return deepmerge
	}
	var customMerge = options.customMerge(key);
	return typeof customMerge === 'function' ? customMerge : deepmerge
}

function mergeObject(target, source, options) {
	var destination = {};
	if (options.isMergeableObject(target)) {
		Object.keys(target).forEach(function(key) {
			destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
		});
	}
	Object.keys(source).forEach(function(key) {
		if (!options.isMergeableObject(source[key]) || !target[key]) {
			destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
		} else {
			destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
		}
	});
	return destination
}

function deepmerge(target, source, options) {
	options = options || {};
	options.arrayMerge = options.arrayMerge || defaultArrayMerge;
	options.isMergeableObject = options.isMergeableObject || isMergeableObject;

	var sourceIsArray = Array.isArray(source);
	var targetIsArray = Array.isArray(target);
	var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

	if (!sourceAndTargetTypesMatch) {
		return cloneUnlessOtherwiseSpecified(source, options)
	} else if (sourceIsArray) {
		return options.arrayMerge(target, source, options)
	} else {
		return mergeObject(target, source, options)
	}
}

deepmerge.all = function deepmergeAll(array, options) {
	if (!Array.isArray(array)) {
		throw new Error('first argument should be an array')
	}

	return array.reduce(function(prev, next) {
		return deepmerge(prev, next, options)
	}, {})
};

var deepmerge_1 = deepmerge;

return deepmerge_1;

})));

},{}],3:[function(require,module,exports){
try {
	// test for scope support
	document.querySelector(':scope *');
} catch (error) {
	(function (ElementPrototype) {
		// scope regex
		var scope = /:scope(?![\w-])/gi;

		// polyfill Element#querySelector
		var querySelectorWithScope = polyfill(ElementPrototype.querySelector);

		ElementPrototype.querySelector = function querySelector(selectors) {
			return querySelectorWithScope.apply(this, arguments);
		};

		// polyfill Element#querySelectorAll
		var querySelectorAllWithScope = polyfill(ElementPrototype.querySelectorAll);

		ElementPrototype.querySelectorAll = function querySelectorAll(selectors) {
			return querySelectorAllWithScope.apply(this, arguments);
		};

		// polyfill Element#matches
		if (ElementPrototype.matches) {
			var matchesWithScope = polyfill(ElementPrototype.matches);

			ElementPrototype.matches = function matches(selectors) {
				return matchesWithScope.apply(this, arguments);
			};
		}

		// polyfill Element#closest
		if (ElementPrototype.closest) {
			var closestWithScope = polyfill(ElementPrototype.closest);

			ElementPrototype.closest = function closest(selectors) {
				return closestWithScope.apply(this, arguments);
			};
		}

		function polyfill(qsa) {
			return function (selectors) {
				// whether the selectors contain :scope
				var hasScope = selectors && scope.test(selectors);

				if (hasScope) {
					// fallback attribute
					var attr = 'q' + Math.floor(Math.random() * 9000000) + 1000000;

					// replace :scope with the fallback attribute
					arguments[0] = selectors.replace(scope, '[' + attr + ']');

					// add the fallback attribute
					this.setAttribute(attr, '');

					// results of the qsa
					var elementOrNodeList = qsa.apply(this, arguments);

					// remove the fallback attribute
					this.removeAttribute(attr);

					// return the results of the qsa
					return elementOrNodeList;
				} else {
					// return the results of the qsa
					return qsa.apply(this, arguments);
				}
			};
		}
	})(Element.prototype);
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9maWxlVXBsb2FkZXIuanMiLCJub2RlX21vZHVsZXMvZGVlcG1lcmdlL2Rpc3QvdW1kLmpzIiwibm9kZV9tb2R1bGVzL2VsZW1lbnQtcXNhLXNjb3BlL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7QUFDQTs7Ozs7Ozs7Ozs7O0FBR0E7Ozs7QUFJQSxDQUFDLFVBQVMsT0FBVCxFQUFrQjtBQUNmLEVBQUEsT0FBTyxDQUFDLFlBQVIsR0FBdUIsVUFBUyxHQUFULEVBQWMsT0FBZCxFQUF1QjtBQUFBOztBQUMxQyxRQUFJLFFBQVEsR0FBRyxJQUFmLENBRDBDLENBRzFDOztBQUNBLFNBQUssU0FBTCxHQUFpQjtBQUNiLE1BQUEsSUFBSSxFQUFFLElBRE87QUFFYixNQUFBLFlBQVksRUFBRSxJQUZEO0FBSWIsTUFBQSxLQUFLLEVBQUUsS0FKTTtBQUlrRDtBQUMvRCxNQUFBLGFBQWEsRUFBRSxnQkFMRjtBQUtrRDtBQUMvRCxNQUFBLElBQUksRUFBRSxTQU5PO0FBTWtEO0FBQy9ELE1BQUEsVUFBVSxFQUFFLGNBUEM7QUFPa0Q7QUFFL0QsTUFBQSxjQUFjLEVBQUUsSUFUSDtBQVNrRDtBQUMvRCxNQUFBLGtCQUFrQixFQUFFLEVBVlA7QUFVa0Q7QUFDL0QsTUFBQSxrQkFBa0IsRUFBRSxpQkFYUDtBQVdrRDtBQUMvRCxNQUFBLG9CQUFvQixFQUFFLFFBWlQ7QUFZa0Q7QUFDL0QsTUFBQSx3QkFBd0IsRUFBRSxjQWJiO0FBYWtEO0FBQy9ELE1BQUEsWUFBWSxFQUFFLGNBZEQ7QUFja0Q7QUFDL0QsTUFBQSxnQkFBZ0IsRUFBRSxDQUFDLE9BQUQsRUFBVSxXQUFWLEVBQXVCLE9BQXZCLEVBQWdDLE1BQWhDLENBZkw7QUFla0Q7QUFDL0QsTUFBQSxjQUFjLEVBQUUsRUFoQkg7QUFnQmtEO0FBQy9ELE1BQUEsZUFBZSxFQUFFLEVBakJKO0FBaUJrRDtB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgZGVlcE1lcmdlIGZyb20gJ2RlZXBtZXJnZSc7XG5pbXBvcnQgJ2VsZW1lbnQtcXNhLXNjb3BlJztcblxuXG4vKlxuKiBmaWxlVXBsb2FkZXIgdjUuNy4yMFxuKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9DZXJlYWxraWxsZXJ3YXkvZmlsZVVwbG9hZGVyL21hc3Rlci9saWNlbnNlLnR4dClcbiovXG4oZnVuY3Rpb24oY29udGV4dCkge1xuICAgIGNvbnRleHQuRmlsZVVwbG9hZGVyID0gZnVuY3Rpb24oJGVsLCBvcHRpb25zKSB7XG4gICAgICAgIGxldCBpbnN0YW5jZSA9IHRoaXM7XG5cbiAgICAgICAgLy8gZGVmYXVsdCBvcHRpb25zXG4gICAgICAgIHRoaXMuX2RlZmF1bHRzID0ge1xuICAgICAgICAgICAgbGFuZzogJ2VuJyxcbiAgICAgICAgICAgIHVzZUZpbGVJY29uczogdHJ1ZSxcblxuICAgICAgICAgICAgZGVidWc6IGZhbHNlLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWN0aXZhdGUgY29uc29sZSBsb2dzIGZvciBkZWJ1Z1xuICAgICAgICAgICAgZGVidWdMb2dTdHlsZTogJ2NvbG9yOiAjOTkwMGZmJywgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY3NzIHN0eWxlIGZvciBkZWJ1ZyBjb25zb2xlIGxvZ3MgaW4ganMgY29uc29sZVxuICAgICAgICAgICAgbmFtZTogdW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYSBuYW1lIGZvciBwbHVnaW4ncyBpbnN0YW5jZSAodXNlZnVsIGZvciBkZWJ1ZyBwdXJwb3NlcylcbiAgICAgICAgICAgIHBsdWdpbk5hbWU6ICdGaWxlVXBsb2FkZXInLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHBsdWdpbidzIG5hbWUgKHVzZWQgaW4gZGVidWcgbG9ncyBhbG9uZ3NpZGUgd2l0aCBuYW1lKVxuXG4gICAgICAgICAgICB1c2VMb2FkaW5nQmFyczogdHJ1ZSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpbnNlcnQgbG9hZGluZyBiYXIgZm9yIGZpbGVzXG4gICAgICAgICAgICBsb2FkaW5nQmFyc0NsYXNzZXM6IFtdLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhcnJheSBvZiBzdHJpbmdzIGZvciBjbGFzc25hbWVzIGZvciBsb2FkaW5nIGJhcnNcbiAgICAgICAgICAgIHJlbG9hZGVkRmlsZXNDbGFzczogJ3JlbG9hZGVkRWxlbWVudCcsICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNsYXNzIGZvciBwcmV2aW91c2x5IHVwbG9hZGVkIGZpbGVzXG4gICAgICAgICAgICByZXN1bHRDb250YWluZXJDbGFzczogJ3Jlc3VsdCcsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZXN1bHQgY29udGFpbmVyJ3MgY2xhc3MgKHdoZXJlIHRvIHBsYWNlIHJlc3VsdCBmaWxlcyBkYXRhKVxuICAgICAgICAgICAgcmVzdWx0RmlsZUNvbnRhaW5lckNsYXNzOiAndXBsb2FkZWRGaWxlJywgICAgICAgICAgICAgICAgICAgICAgLy8gY2xhc3MgZm9yIGV2ZXJ5IGZpbGUgcmVzdWx0IGNvbnRhaW5lciBzcGFuXG4gICAgICAgICAgICByZXN1bHRQcmVmaXg6ICdmaWxlVXBsb2FkZXInLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBwcmVmaXggZm9yIGlucHV0cyBpbiB0aGUgZmlsZSByZXN1bHQgY29udGFpbmVyXG4gICAgICAgICAgICByZXN1bHRJbnB1dE5hbWVzOiBbJ3RpdGxlJywgJ2V4dGVuc2lvbicsICd2YWx1ZScsICdzaXplJ10sICAgICAvLyBuYW1lIHN1ZmZpeCB0byBiZSB1c2VkIGZvciByZXN1bHQgaW5wdXRzXG4gICAgICAgICAgICBkZWZhdWx0RmlsZUV4dDogJycsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBleHRlbnNpb24gdG8gdXNlIGZvciBmaWxlcyB3aXRoIG5vIGV4dGVuc2lvblxuICAgICAgICAgICAgZGVmYXVsdE1pbWVUeXBlOiAnJywgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTUlNRSB0eXBlIHRvIHVzZSBmb3IgZmlsZXMgd2l0aCBubyBleHRlbnNpb25cbiAgICAgICAgICAgIG1heEZpbGVTaXplOiA1MCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1heGltdW0gYWxsb3dlZCBmaWxlIHNpemUgKGluIE1CKVxuICAgICAgICAgICAgbWF4VG90YWxTaXplOiAxMDAwLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdG90YWwgbWF4aW11bSBhbGxvd2VkIHNpemUgb2YgYWxsIGZpbGVzXG4gICAgICAgICAgICBtYXhOdW1iZXJPZkZpbGVzOiBmYWxzZSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBtYXhpbXVtIG51bWJlciBvZiBmaWxlcyBhbGxvd2VkIHRvIHVwbG9hZFxuICAgICAgICAgICAgcmVsb2FkQXJyYXk6IFtdLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXJyYXkgb2YgZmlsZXMgdG8gYmUgcmVsb2FkZWQgYXQgcGx1Z2luIHN0YXJ0dXBcbiAgICAgICAgICAgIHJlbG9hZEhUTUw6IHVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEhUTUwgZm9yIHJlbG9hZGVkIGZpbGVzIHRvIHBsYWNlIGRpcmVjdGx5IGluIHJlc3VsdCBjb250YWluZXJcbiAgICAgICAgICAgIGxpbmtCdXR0b25Db250ZW50OiAnTCcsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEhUTUwgY29udGVudCBmb3IgbGluayBidXR0b25cbiAgICAgICAgICAgIGRlbGV0ZUJ1dHRvbkNvbnRlbnQ6ICdYJywgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEhUTUwgY29udGVudCBmb3IgZGVsZXRlIGJ1dHRvblxuICAgICAgICAgICAgc2hvd0Vycm9yT25Mb2FkQmFyOiB0cnVlLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZGVjaWRlcyBpZiB0aGUgcmVhc29uIGZvciBhIHJlamVjdGVkIGZpbGUgd2lsbCBiZSBkaXNwbGF5ZWQgb3ZlciBpdHMgbG9hZCBiYXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpbiBjYXNlIHRoZSBmaWxlIGlzIHJlamVjdGVkIGJlY2F1c2Ugb2YgbW9yZSB0aGFuIG9uZSByZWFzb24sIG9ubHkgdGhlIGZpcnN0IG9uZSB3aWxsIGJlIGRpc3BsYXllZCBvbiB0aGUgYmFyO1xuICAgICAgICAgICAgYWxsb3dEdXBsaWNhdGVzOiBmYWxzZSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWxsb3cgdXBsb2FkIGR1cGxpY2F0ZXNcbiAgICAgICAgICAgIGR1cGxpY2F0ZXNXYXJuaW5nOiBmYWxzZSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNob3cgYSBtZXNzYWdlIGluIHRoZSBsb2FkaW5nIGFyZWEgd2hlbiB0cnlpbmcgdG8gbG9hZCBhIGR1cGxpY2F0ZWQgZmlsZVxuICAgICAgICAgICAgbGFiZWxzQ29udGFpbmVyczogZmFsc2UsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcXVlcnkgc2VsZWN0b3IgZm9yIHRoZSBjb250YWluZXIgd2hlcmUgdG8gbG9vayBmb3IgbGFiZWxzIChleC4gJyNteUlkJyksIChkZWZhdWx0ICdmYWxzZScgLT4gbm8gbGFiZWxzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FuIGJlIGEgc3RyaW5nIGZvciBhIHNpbmdsZSB2YWx1ZSwgb3IgYW4gYXJyYXkgaWYgdGhlIHBsdWdpbiBoYXMgdG8gdXBkYXRlIGxhYmVscyBpbiBtYW55IHBsYWNlcztcbiAgICAgICAgICAgIHVzZVNvdXJjZUZpbGVTaXplOiBmYWxzZSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRlbGxzIHRvIHRoZSBwbHVnaW4gdG8gdXNlIHRoZSBvcmlnaW5hbCBmaWxlIHNpemUgaW4gc2l6ZSBjYWxjdWxhdGlvbnM7IGJ5IGRlZmF1bHQgaXQgd2lsbCB1c2UgdGhlIHNpemUgb2YgdGhlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBiYXNlNjQgc3RyaW5nIGNyZWF0ZWQgYnkgdGhlIHJlYWRlciBpbnN0ZWFkICh3aGljaCBpcyBiaWdnZXIpO1xuICAgICAgICAgICAgbWltZVR5cGVzVG9PcGVuOiBbICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2hlbiBjbGlja2luZyB0aGUgXCJvcGVuXCIgYnV0dG9uLCBhIGZpbGUgd2l0aCBtaW1lVHlwZSBpbiB0aGlzIGxpc3Qgd2lsbCBiZSBvcGVuZWQgaW4gYSBuZXcgdGFiIG9mIHRoZSBicm93c2VyXG4gICAgICAgICAgICAgICAgJ2FwcGxpY2F0aW9uL3BkZicsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB3aGlsZSBvdGhlcnMgYXJlIGp1c3QgZG93bmxvYWRlZDtcbiAgICAgICAgICAgICAgICAnaW1hZ2UvcG5nJyxcbiAgICAgICAgICAgICAgICAnaW1hZ2UvanBlZydcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBsYWJlbHNDbGFzc2VzOiB7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBkaWN0aW9uYXJ5IG9mIGNsYXNzZXMgdXNlZCBieSB0aGUgdmFyaW91cyBsYWJlbHMgaGFuZGxlZCBieSB0aGUgcGx1Z2luXG4gICAgICAgICAgICAgICAgc2l6ZUF2YWlsYWJsZTogJ3NpemVBdmFpbGFibGUnLFxuICAgICAgICAgICAgICAgIGN1cnJlbnRTaXplOiAnY3VycmVudFNpemUnLFxuICAgICAgICAgICAgICAgIGN1cnJlbnROdW1iZXJPZkZpbGVzOiAnY3VycmVudE51bWJlck9mRmlsZXMnLFxuICAgICAgICAgICAgICAgIG1heEZpbGVTaXplOiAnbWF4RmlsZVNpemUnLFxuICAgICAgICAgICAgICAgIG1heFRvdGFsU2l6ZTogJ21heFRvdGFsU2l6ZScsXG4gICAgICAgICAgICAgICAgbWF4TnVtYmVyT2ZGaWxlczogJ21heE51bWJlck9mRmlsZXMnLFxuICAgICAgICAgICAgICAgIG51bWJlck9mVXBsb2FkZWRGaWxlczogJ251bWJlck9mVXBsb2FkZWRGaWxlcycsXG4gICAgICAgICAgICAgICAgbnVtYmVyT2ZSZWplY3RlZEZpbGVzOiAnbnVtYmVyT2ZSZWplY3RlZEZpbGVzJ1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgSFRNTFRlbXBsYXRlOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGA8cCBjbGFzcz1cImludHJvTXNnXCI+PC9wPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0Q29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwiZmlsZUxvYWRlclwiIHR5cGU9XCJmaWxlXCIgbXVsdGlwbGUgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRyb3Bab25lXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmlsZXNDb250YWluZXIgZmlsZXNDb250YWluZXJFbXB0eVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbm5lckZpbGVUaHVtYnNcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiY2xlYXI6Ym90aDtcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJlc3VsdFwiPjwvZGl2PmA7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBvbmxvYWQ6ICgpID0+IHt9LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNhbGxiYWNrIG9uIHBsdWdpbiBpbml0aWFsaXphdGlvblxuICAgICAgICAgICAgb25maWxlbG9hZFN0YXJ0OiAoKSA9PiB7fSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjYWxsYmFjayBvbiBmaWxlIHJlYWRlciBzdGFydFxuICAgICAgICAgICAgb25maWxlbG9hZEVuZDogKCkgPT4ge30sICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjYWxsYmFjayBvbiBmaWxlIHJlYWRlciBlbmRcbiAgICAgICAgICAgIG9uZmlsZVJlamVjdGVkOiAoKSA9PiB7fSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FsbGJhY2sgb24gZmlsZSByZWplY3RlZFxuICAgICAgICAgICAgb25maWxlRGVsZXRlOiAoKSA9PiB7fSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjYWxsYmFjayBvbiBmaWxlIGRlbGV0ZVxuICAgICAgICAgICAgZmlsZW5hbWVUZXN0OiAoKSA9PiB7fSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjYWxsYmFjayBmb3IgdGVzdGluZyBmaWxlbmFtZXNcblxuICAgICAgICAgICAgbGFuZ3M6IHtcbiAgICAgICAgICAgICAgICAnZW4nOiB7XG4gICAgICAgICAgICAgICAgICAgIGludHJvX21zZzogJyhBZGQgYXR0YWNobWVudHMuLi4pJyxcbiAgICAgICAgICAgICAgICAgICAgZHJvcFpvbmVfbXNnOiAnRHJvcCB5b3VyIGZpbGVzIGhlcmUnLFxuICAgICAgICAgICAgICAgICAgICBtYXhTaXplRXhjZWVkZWRfbXNnOiAnRmlsZSB0b28gbGFyZ2UnLFxuICAgICAgICAgICAgICAgICAgICBtYXhUb3RhbFNpemVFeGNlZWRlZF9tc2c6ICdUb3RhbCBzaXplIGV4Y2VlZGVkJyxcbiAgICAgICAgICAgICAgICAgICAgbWF4TnVtYmVyT2ZGaWxlc0V4Y2VlZGVkX21zZzogJ051bWJlciBvZiBmaWxlcyBhbGxvd2VkIGV4Y2VlZGVkJyxcbiAgICAgICAgICAgICAgICAgICAgZHVwbGljYXRlZF9tc2c6ICdGaWxlIGR1cGxpY2F0ZWQgKHNraXBwZWQpJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuXG4gICAgICAgIC8vIFVUSUxJVElFU1xuICAgICAgICBjb25zdCBhZGRNdWx0aXBsZUxpc3RlbmVycyA9IGZ1bmN0aW9uIChlbGVtZW50LCBldmVudHMsIGhhbmRsZXIpIHtcbiAgICAgICAgICAgIGlmICghKGV2ZW50cyBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlcignYWRkTXVsdGlwbGVMaXN0ZW5lcnMgcmVxdWlyZXMgZXZlbnRzIHRvIGJlIGFuIGFycmF5Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGV2ZW50IG9mIGV2ZW50cykge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cblxuICAgICAgICBjb25zdCBnZXRQcmV2aW91c1NpYmxpbmcgPSBmdW5jdGlvbihlbGVtZW50LCBzZWxlY3Rvcikge1xuICAgICAgICAgICAgbGV0IHNpYmxpbmcgPSBlbGVtZW50LnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG5cbiAgICAgICAgICAgIGlmICghc2VsZWN0b3IpIHJldHVybiBzaWJsaW5nO1xuXG4gICAgICAgICAgICB3aGlsZSAoc2libGluZykge1xuICAgICAgICAgICAgICAgIGlmIChzaWJsaW5nLm1hdGNoZXMoc2VsZWN0b3IpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzaWJsaW5nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzaWJsaW5nID0gc2libGluZy5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG5cbiAgICAgICAgbGV0IHVwZGF0ZUxhYmVsID0gZnVuY3Rpb24odHlwZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGxhYmVsIG9mIGluc3RhbmNlTGFiZWxzW2Ake3R5cGV9TGFiZWxzYF0pIHtcbiAgICAgICAgICAgICAgICBsZXQgbGFiZWxTcGFuID0gbGFiZWwucXVlcnlTZWxlY3RvcignOnNjb3BlID4gc3BhbicpO1xuICAgICAgICAgICAgICAgIGxldCBwcmV2VmFsdWU7XG5cbiAgICAgICAgICAgICAgICBzd2l0Y2godmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnKysnOlxuICAgICAgICAgICAgICAgICAgICBwcmV2VmFsdWUgPSBwYXJzZUludChsYWJlbFNwYW4uaW5uZXJIVE1MKSArIDE7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsU3Bhbi5pbm5lckhUTUwgPSBwcmV2VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJy0tJzpcbiAgICAgICAgICAgICAgICAgICAgcHJldlZhbHVlID0gcGFyc2VJbnQobGFiZWxTcGFuLmlubmVySFRNTCkgLSAxO1xuICAgICAgICAgICAgICAgICAgICBsYWJlbFNwYW4uaW5uZXJIVE1MID0gcHJldlZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBsYWJlbFNwYW4uaW5uZXJIVE1MID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG5cbiAgICAgICAgLy8gcmV0dXJucyB0aGUgYnl0ZSBsZW5ndGggb2YgYW4gdXRmOCBzdHJpbmdcbiAgICAgICAgY29uc3QgYnl0ZUxlbmd0aCA9IGZ1bmN0aW9uKHV0ZjhTdHJpbmcpIHtcbiAgICAgICAgICAgIGxldCBzaXplID0gdXRmOFN0cmluZy5sZW5ndGg7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSB1dGY4U3RyaW5nLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNvZGUgPSB1dGY4U3RyaW5nLmNoYXJDb2RlQXQoaSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoY29kZSA+IDB4N2YgJiYgY29kZSA8PSAweDdmZikge1xuICAgICAgICAgICAgICAgICAgICBzaXplKys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29kZSA+IDB4N2ZmICYmIGNvZGUgPD0gMHhmZmZmKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaXplICs9IDI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy90cmFpbCBzdXJyb2dhdGVcbiAgICAgICAgICAgICAgICBpZiAoY29kZSA+PSAweERDMDAgJiYgY29kZSA8PSAweERGRkYpIHtcbiAgICAgICAgICAgICAgICAgICAgaS0tO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHNpemU7XG4gICAgICAgIH07XG5cblxuICAgICAgICAvLyB1cGRhdGUgb3BlbiBmaWxlIGJ1dHRvbiBhdHRyaWJ1dGVzXG4gICAgICAgIGNvbnN0IHVwZGF0ZUZpbGVTZWVMaW5rID0gKHJlc3VsdCwgdXBsb2FkZXJDb250YWluZXIsIGZpbGVOYW1lKSA9PiB7XG4gICAgICAgICAgICBsZXQgbWltZVR5cGUgPSByZXN1bHQuc3Vic3RyaW5nKDUsIHJlc3VsdC5pbmRleE9mKCc7JykpO1xuICAgICAgICAgICAgbGV0IGZpbGVTZWVMaW5rID0gdXBsb2FkZXJDb250YWluZXIucXVlcnlTZWxlY3RvcignLmZpbGVTZWUnKTtcbiAgICAgICAgXG4gICAgICAgICAgICBpZiAodGhpcy5fb3B0aW9ucy5taW1lVHlwZXNUb09wZW4uaW5kZXhPZihtaW1lVHlwZSkgPj0gMCkge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGZpbGVTZWVMaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgd2luID0gd2luZG93Lm9wZW4oKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cbiAgICAgICAgICAgICAgICAgICAgd2luLmRvY3VtZW50LndyaXRlKGA8aWZyYW1lIHNyYz1cIiR7cmVzdWx0fVwiIGZyYW1lYm9yZGVyPVwiMFwiIHN0eWxlPVwiYm9yZGVyOjA7IHRvcDowcHg7IGRpc3BsYXk6YmxvY2s7IGxlZnQ6MHB4OyBib3R0b206MHB4OyByaWdodDowcHg7IHdpZHRoOjEwMCU7IG1pbi1oZWlnaHQ6IDEwMHZoOyBoZWlnaHQ6MTAwJTtcIiBhbGxvd2Z1bGxzY3JlZW4+PC9pZnJhbWU+YClcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZmlsZVNlZUxpbmsuc2V0QXR0cmlidXRlKCdocmVmJywgcmVzdWx0KTtcbiAgICAgICAgICAgICAgICBmaWxlU2VlTGluay5zZXRBdHRyaWJ1dGUoJ2Rvd25sb2FkJywgZmlsZU5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG5cbiAgICAgICAgLy8gZXh0ZW5kIG9wdGlvbnMgd2l0aCBpbnN0YW5jZSBvbmVzXG4gICAgICAgIGNvbnN0IG92ZXJ3cml0ZU1lcmdlID0gKGRlc3QsIHNvdXJjZSwgb3B0aW9ucykgPT4gc291cmNlO1xuICAgICAgICB0aGlzLl9vcHRpb25zID0gZGVlcE1lcmdlKHRoaXMuX2RlZmF1bHRzLCBvcHRpb25zLCB7XG4gICAgICAgICAgICBhcnJheU1lcmdlOiBvdmVyd3JpdGVNZXJnZVxuICAgICAgICB9KTtcblxuXG4gICAgICAgIC8vIHJvdW5kIG51bWJlclxuICAgICAgICB0aGlzLl9yb3VuZCA9ICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGgucm91bmQodmFsdWUgKiAxMDApIC8gMTAwO1xuICAgICAgICB9O1xuXG5cbiAgICAgICAgLy8gcmV0dXJuIGRhdGFcbiAgICAgICAgdGhpcy5nZXQgPSAocGFyYW1ldGVyKSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2ggKHBhcmFtZXRlcikge1xuICAgICAgICAgICAgICAgIGNhc2UgJ2N1cnJlbnRUb3RhbFNpemUnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yb3VuZChjdXJyZW50VG90YWxTaXplKTtcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2N1cnJlbnRBdmFpbGFibGVTaXplJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcm91bmQodGhpcy5fb3B0aW9ucy5tYXhUb3RhbFNpemUgLSBjdXJyZW50VG90YWxTaXplKTtcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2N1cnJlbnROdW1iZXJPZkZpbGVzJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gY3VycmVudE51bWJlck9mRmlsZXM7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdhdmFpbGFibGVOdW1iZXJPZkZpbGVzJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fb3B0aW9ucy5tYXhOdW1iZXJPZkZpbGVzIC0gY3VycmVudE51bWJlck9mRmlsZXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cblxuICAgICAgICAvLyBkZWJ1ZyBsb2dzIGZ1bmN0aW9uXG4gICAgICAgIHRoaXMuX2xvZ2dlciA9IChtZXNzYWdlLCBsZXZlbCwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuX29wdGlvbnMuZGVidWcpIHtcbiAgICAgICAgICAgICAgICBpZiAobGV2ZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZXZlbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlID0gJ1xcdTI3QTEgJyArIG1lc3NhZ2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX29wdGlvbnMubmFtZSkge1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlID0gJ1snICsgdGhpcy5fb3B0aW9ucy5wbHVnaW5OYW1lICsgJyAtICcgKyB0aGlzLl9vcHRpb25zLm5hbWUgKyAnXSAnICsgbWVzc2FnZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnJWMgJyArIG1lc3NhZ2UsIHRoaXMuX29wdGlvbnMuZGVidWdMb2dTdHlsZSwgZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnJWMgJyArIG1lc3NhZ2UsIHRoaXMuX29wdGlvbnMuZGVidWdMb2dTdHlsZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG5cbiAgICAgICAgLy8gZmlsZSB0eXBlIGlkZW50aWZpY2F0b3JcbiAgICAgICAgdGhpcy5fZmlsZVR5cGUgPSAoZmlsZU5hbWUpID0+IHtcbiAgICAgICAgICAgIGxldCBleHQgPSBmaWxlTmFtZS5zdWJzdHJpbmcoZmlsZU5hbWUubGFzdEluZGV4T2YoJy4nKSArIDEsIGZpbGVOYW1lLmxlbmd0aCk7XG4gICAgICAgICAgICBsZXQgaWNvbnMgPSBbJ3BkZicsICdqcGcnLCAncG5nJ107XG5cbiAgICAgICAgICAgIGlmIChpY29ucy5pbmRleE9mKGV4dCkgPj0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3Vua25vd24tZmlsZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cblxuICAgICAgICAvLyBtZXRob2QgZm9yIGRlbGV0aW5nIGEgcmVhZGVyJ3MgcmVzdWx0IGZyb20gcmVzdWx0IGNvbnRhaW5lclxuICAgICAgICB0aGlzLl9maWxlRGVsZXRlID0gKGV2ZW50LCBkYXRhKSA9PiB7XG4gICAgICAgICAgICBsZXQgZWxlbWVudCA9IGRhdGEuZWxlbWVudDtcbiAgICAgICAgICAgIGxldCBpbmRleCA9IGV2ZW50LnRhcmdldC5kYXRhc2V0LmRlbGV0ZTtcblxuICAgICAgICAgICAgaWYgKCFpbmRleCkge1xuICAgICAgICAgICAgICAgIGluZGV4ID0gZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJ2RpdltkYXRhLWRlbGV0ZV0nKS5kYXRhc2V0LmRlbGV0ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gcmVtb3ZlIGZpbGUgYmxvY2tcbiAgICAgICAgICAgIGlmICh0aGlzLl9vcHRpb25zLnVzZUZpbGVJY29ucykge1xuICAgICAgICAgICAgICAgIGdldFByZXZpb3VzU2libGluZyhlbGVtZW50LCAnaW1nJykucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZSgpO1xuXG4gICAgICAgICAgICAvLyBnZXQgZmlsZSBzaXplXG4gICAgICAgICAgICBsZXQgZmlsZVNpemUgPSAkcmVzdWx0Q29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoYGlucHV0W25hbWU9XCIke3RoaXMuX29wdGlvbnMucmVzdWx0UHJlZml4fVske2luZGV4fV1bJHt0aGlzLl9vcHRpb25zLnJlc3VsdElucHV0TmFtZXNbM119XVwiXWApLnZhbHVlO1xuXG4gICAgICAgICAgICBmaWxlU2l6ZSA9IHRoaXMuX3JvdW5kKGZpbGVTaXplKTtcbiAgICAgICAgICAgIGN1cnJlbnRUb3RhbFNpemUgPSB0aGlzLl9yb3VuZChjdXJyZW50VG90YWxTaXplIC0gZmlsZVNpemUpO1xuICAgICAgICAgICAgY3VycmVudE51bWJlck9mRmlsZXMtLTtcblxuICAgICAgICAgICAgbGV0IGF2YWlsYWJsZVNpemUgPSB0aGlzLl9vcHRpb25zLm1heFRvdGFsU2l6ZSAtIGN1cnJlbnRUb3RhbFNpemU7XG5cbiAgICAgICAgICAgIGF2YWlsYWJsZVNpemUgPSB0aGlzLl9yb3VuZChhdmFpbGFibGVTaXplKTtcbiAgICAgICAgICAgIHVwZGF0ZUxhYmVsKCdzaXplQXZhaWxhYmxlJywgYXZhaWxhYmxlU2l6ZSk7XG4gICAgICAgICAgICB1cGRhdGVMYWJlbCgnY3VycmVudFNpemUnLCBjdXJyZW50VG90YWxTaXplKTtcbiAgICAgICAgICAgIHVwZGF0ZUxhYmVsKCdjdXJyZW50TnVtYmVyT2ZGaWxlcycsIGN1cnJlbnROdW1iZXJPZkZpbGVzKTtcbiAgICAgICAgICAgIHVwZGF0ZUxhYmVsKCdudW1iZXJPZlVwbG9hZGVkRmlsZXMnLCAnLS0nKTtcblxuICAgICAgICAgICAgLy8gcmVtb3ZlIHJlc3VsdCBibG9ja1xuICAgICAgICAgICAgJHJlc3VsdENvbnRhaW5lci5xdWVyeVNlbGVjdG9yKGA6c2NvcGUgPiBkaXZbZGF0YS1pbmRleD1cIiR7aW5kZXh9XCJdYCkucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaW5uZXJGaWxlVGh1bWJzJykuY2hpbGRyZW4ubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZpbGVzQ29udGFpbmVyJykuY2xhc3NMaXN0LmFkZCgnZmlsZXNDb250YWluZXJFbXB0eScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIoJ0RlbGV0ZWQgZmlsZSBOOiAnICsgaW5kZXgsIDIpO1xuICAgICAgICAgICAgdGhpcy5fb3B0aW9ucy5vbmZpbGVEZWxldGUoaW5kZXgsIGN1cnJlbnRUb3RhbFNpemUsIGN1cnJlbnROdW1iZXJPZkZpbGVzKTtcbiAgICAgICAgfTtcblxuXG4gICAgICAgIC8vIG1ldGhvZCB0byByZW5hbWUgZmlsZSBpbiByZXN1bHQgY29udGFpbmVyIGFjY29yZGluZ2x5IHRvIG1vZGlmaWNhdGlvbnMgYnkgdXNlclxuICAgICAgICB0aGlzLl9maWxlUmVuYW1lID0gKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBsZXQgZWxlbWVudCA9IGV2ZW50LmRhdGEuZWxlbWVudDtcbiAgICAgICAgICAgIGxldCAkdGhpcyA9IGV2ZW50LnRhcmdldDtcbiAgICAgICAgICAgIGxldCBleHQgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJzpzY29wZSA+IC5maWxlRXh0JykuaW5uZXJIVE1MO1xuICAgICAgICAgICAgbGV0IHRleHQgPSAkdGhpcy52YWx1ZTtcbiAgICAgICAgICAgIGxldCBpbmRleCA9IGVsZW1lbnQuZGF0YXNldC5pbmRleDtcbiAgICAgICAgICAgIGxldCAkaW5wdXQgPSAkcmVzdWx0Q29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoYGRpdltkYXRhLWluZGV4PVwiJHtpbmRleH1cIl0gaW5wdXRgKTtcbiAgICAgICAgICAgIGxldCBuYW1lVGVzdCA9IHRoaXMuX29wdGlvbnMuZmlsZW5hbWVUZXN0KHRleHQsIGV4dCwgJGZpbGVUaHVtYnNDb250YWluZXIpO1xuXG4gICAgICAgICAgICBpZiAobmFtZVRlc3QgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobmFtZVRlc3QgIT09IHVuZGVmaW5lZCAmJiBuYW1lVGVzdCAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHRleHQgPSBuYW1lVGVzdDtcbiAgICAgICAgICAgICAgICAkdGhpcy52YWx1ZSA9IHRleHQ7XG5cbiAgICAgICAgICAgICAgICAvLyB1cGRhdGUgaW5wdXRcbiAgICAgICAgICAgICAgICAvKmlmIChleHQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0ID0gYCR7dGV4dH0uJHtleHR9YDtcbiAgICAgICAgICAgICAgICB9Ki9cblxuICAgICAgICAgICAgICAgICRpbnB1dC52YWx1ZSA9IHRleHQ7XG4gICAgICAgICAgICAgICAgLy8gcmVzdG9yZSBzZWxlY3Rpb24gcmFuZ2VcbiAgICAgICAgICAgICAgICAkdGhpcy5zZXRTZWxlY3Rpb25SYW5nZShldmVudC5kYXRhLnN0YXJ0LCBldmVudC5kYXRhLnN0b3ApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG5cbiAgICAgICAgdGhpcy5nZXREYXRhID0gKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBbXTtcblxuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyKCdSRUNFSVZFRCBTQVZFIENPTU1BTkQ6JywgMCk7XG5cbiAgICAgICAgICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiAkcmVzdWx0Q29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoYDpzY29wZSA+IC4ke3RoaXMuX29wdGlvbnMucmVzdWx0RmlsZUNvbnRhaW5lckNsYXNzfWApKSB7XG4gICAgICAgICAgICAgICAgbGV0IGlucHV0cyA9IGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnOnNjb3BlID4gaW5wdXQnKTtcbiAgICAgICAgICAgICAgICBsZXQgZmlsZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGlucHV0c1swXS52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgZXh0OiBpbnB1dHNbMV0udmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBpbnB1dHNbMl0udmFsdWVcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgZGF0YS5wdXNoKGZpbGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIoJyVPJywgMCAsZGF0YSk7XG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfTtcblxuXG4gICAgICAgIC8vIGNyZWF0ZSBjb250YWluZXIgZm9yIGZpbGUgdXBsb2FkaW5nIGVsZW1lbnRzIChpY29uLCBwcm9ncmVzcyBiYXIsIGV0Yy4uLilcbiAgICAgICAgdGhpcy5jcmVhdGVVcGxvYWRlckNvbnRhaW5lciA9IChpbmRleCwgZmlsZU5hbWUsIGZpbGVFeHQpID0+IHtcbiAgICAgICAgICAgIC8vaW5zZXJ0IGZpbGUgaWNvbiBpZiByZXF1ZXN0ZWRcbiAgICAgICAgICAgIGlmICh0aGlzLl9vcHRpb25zLnVzZUZpbGVJY29ucykge1xuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50VGh1bWIgPSBgPGltZyBzcmM9XCIvaW1hZ2VzLyR7dGhpcy5fZmlsZVR5cGUoZmlsZUV4dCl9LnBuZ1wiIGNsYXNzPVwiZmlsZVRodW1iXCIgLz5gO1xuICAgICAgICAgICAgICAgICRmaWxlVGh1bWJzQ29udGFpbmVyLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgY3VycmVudFRodW1iKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgICAgICAgICBjb250YWluZXIuY2xhc3NOYW1lID0gJ25ld0VsZW1lbnQnO1xuICAgICAgICAgICAgY29udGFpbmVyLmRhdGFzZXQuaW5kZXggPSBwYXJzZUludChpbmRleCk7XG4gICAgICAgICAgICBjb250YWluZXIuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xuICAgICAgICAgICAgJGZpbGVUaHVtYnNDb250YWluZXIuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcblxuICAgICAgICAgICAgbGV0IGZpbGVCdXR0b25zQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICAgICAgICAgIGZpbGVCdXR0b25zQ29udGFpbmVyLmNsYXNzTmFtZSA9ICdmaWxlQWN0aW9ucyc7XG4gICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZmlsZUJ1dHRvbnNDb250YWluZXIpO1xuXG4gICAgICAgICAgICAvLyBmaWxlIFwic2VlXCIgbGlua1xuICAgICAgICAgICAgbGV0IHNlZUZpbGVMaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuXG4gICAgICAgICAgICBzZWVGaWxlTGluay5jbGFzc05hbWUgPSAnZmlsZVNlZSc7XG4gICAgICAgICAgICBzZWVGaWxlTGluay5pbm5lckhUTUwgPSB0aGlzLl9vcHRpb25zLmxpbmtCdXR0b25Db250ZW50O1xuXG4gICAgICAgICAgICBmaWxlQnV0dG9uc0NvbnRhaW5lci5hcHBlbmRDaGlsZChzZWVGaWxlTGluayk7XG5cbiAgICAgICAgICAgIC8qc2VlRmlsZUxpbmsuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSBldmVudC50YXJnZXQuY2xvc2VzdCgnLm5ld0VsZW1lbnQnKS5kYXRhc2V0LmluZGV4O1xuICAgICAgICAgICAgICAgIGxldCBjb250ZW50ID0gJHJlc3VsdENvbnRhaW5lci5xdWVyeVNlbGVjdG9yKGAudXBsb2FkZWRGaWxlW2RhdGEtaW5kZXg9XCIke2luZGV4fVwiXSB0ZXh0YXJlYWApLnZhbHVlO1xuICAgICAgICAgICAgICAgIC8vbGV0IHdpbiA9IHdpbmRvdy5vcGVuKCk7XG4gICAgICAgICAgICAgICAgbGV0IG1pbWVUeXBlID0gY29udGVudC5zdWJzdHJpbmcoNSwgY29udGVudC5pbmRleE9mKCc7JykpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9vcHRpb25zLm1pbWVUeXBlc1RvT3Blbi5pbmRleE9mKG1pbWVUeXBlKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdvcGVuISEnKTtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93Lm9wZW4oY29udGVudCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy93aW4uZG9jdW1lbnQud3JpdGUoYDxpZnJhbWUgc3JjPVwiJHtjb250ZW50fVwiIGZyYW1lYm9yZGVyPVwiMFwiIHN0eWxlPVwiYm9yZGVyOjA7IHRvcDowcHg7IGRpc3BsYXk6YmxvY2s7IGxlZnQ6MHB4OyBib3R0b206MHB4OyByaWdodDowcHg7IHdpZHRoOjEwMCU7IG1pbi1oZWlnaHQ6IDEwMHZoOyBoZWlnaHQ6MTAwJTtcIiBhbGxvd2Z1bGxzY3JlZW4+PC9pZnJhbWU+YClcbiAgICAgICAgICAgIH0pOyovXG5cbiAgICAgICAgICAgIC8vIGRlbGV0ZSBidXR0b25cbiAgICAgICAgICAgIGxldCBkZWxldGVCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGRlbGV0ZUJ0bi5jbGFzc05hbWUgPSAnZmlsZURlbGV0ZSc7XG4gICAgICAgICAgICBkZWxldGVCdG4uZGF0YXNldC5kZWxldGUgPSBwYXJzZUludChpbmRleCk7XG4gICAgICAgICAgICBkZWxldGVCdG4uaW5uZXJIVE1MID0gdGhpcy5fb3B0aW9ucy5kZWxldGVCdXR0b25Db250ZW50O1xuICAgICAgICAgICAgZmlsZUJ1dHRvbnNDb250YWluZXIuYXBwZW5kKGRlbGV0ZUJ0bik7XG4gICAgICAgICAgICBkZWxldGVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9maWxlRGVsZXRlKGV2ZW50LCB7ZWxlbWVudDogY29udGFpbmVyfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy9pbnNlcnQgbG9hZGluZyBiYXJzIGlmIHJlcXVlc3RlZFxuICAgICAgICAgICAgaWYgKHRoaXMuX29wdGlvbnMudXNlTG9hZGluZ0JhcnMpIHtcbiAgICAgICAgICAgICAgICBsZXQgY2xhc3NlcyA9IHRoaXMuX29wdGlvbnMubG9hZGluZ0JhcnNDbGFzc2VzO1xuXG4gICAgICAgICAgICAgICAgaWYgKGNsYXNzZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBjbGFzc2VzID0gY2xhc3Nlcy5qb2luKCcgJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGV0IGN1cnJlbnRMb2FkQmFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICAgICAgY3VycmVudExvYWRCYXIuY2xhc3NOYW1lID0gYGxvYWRCYXIgJHtjbGFzc2VzfWA7XG4gICAgICAgICAgICAgICAgY3VycmVudExvYWRCYXIuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykpO1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5wcmVwZW5kKGN1cnJlbnRMb2FkQmFyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGN1cnJlbnRUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG5cbiAgICAgICAgICAgIC8vIFRPRE8gdHJhbnNsYXRlIHBsYWNlaG9sZGVyXG4gICAgICAgICAgICBjdXJyZW50VGl0bGUuc2V0QXR0cmlidXRlKCdwbGFjZWhvbGRlcicsICdub21lJyk7XG4gICAgICAgICAgICBjdXJyZW50VGl0bGUuY2xhc3NOYW1lID0gJ2ZpbGVUaXRsZSc7XG5cbiAgICAgICAgICAgIGxldCBjdXJyZW50RXh0ZW5zaW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICAgICAgICAgIGN1cnJlbnRFeHRlbnNpb24uY2xhc3NOYW1lID0gJ2ZpbGVFeHQnO1xuICAgICAgICAgICAgY29udGFpbmVyLnByZXBlbmQoY3VycmVudEV4dGVuc2lvbik7XG4gICAgICAgICAgICBjb250YWluZXIucHJlcGVuZChjdXJyZW50VGl0bGUpO1xuXG4gICAgICAgICAgICBhZGRNdWx0aXBsZUxpc3RlbmVycyhjdXJyZW50VGl0bGUsIFsna2V5cHJlc3MnLCAna2V5dXAnLCAncGFzdGUnXSwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBldmVudC5kYXRhID0ge307XG4gICAgICAgICAgICAgICAgZXZlbnQuZGF0YS5lbGVtZW50ID0gY29udGFpbmVyO1xuICAgICAgICAgICAgICAgIGV2ZW50LmRhdGEuc3RhcnQgPSB0aGlzLnNlbGVjdGlvblN0YXJ0O1xuICAgICAgICAgICAgICAgIGV2ZW50LmRhdGEuc3RvcCA9IHRoaXMuc2VsZWN0aW9uRW5kO1xuICAgICAgICAgICAgICAgIGluc3RhbmNlLl9maWxlUmVuYW1lKGV2ZW50KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjdXJyZW50VGl0bGUudmFsdWUgPSBmaWxlTmFtZTtcbiAgICAgICAgICAgIGN1cnJlbnRFeHRlbnNpb24uaW5uZXJIVE1MID0gZmlsZUV4dDtcblxuICAgICAgICAgICAgcmV0dXJuIGNvbnRhaW5lcjtcbiAgICAgICAgfTtcblxuXG4gICAgICAgIHRoaXMuX2NyZWF0ZVJlc3VsdENvbnRhaW5lciA9IChmaWxlRGF0YSkgPT4ge1xuICAgICAgICAgICAgbGV0IGluZGV4ID0gZmlsZURhdGEuaW5kZXg7XG4gICAgICAgICAgICBsZXQgcmVzdWx0RWxlbUNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgICAgICAgICByZXN1bHRFbGVtQ29udGFpbmVyLmNsYXNzTmFtZSA9IHRoaXMuX29wdGlvbnMucmVzdWx0RmlsZUNvbnRhaW5lckNsYXNzO1xuICAgICAgICAgICAgcmVzdWx0RWxlbUNvbnRhaW5lci5kYXRhc2V0LmluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgICByZXN1bHRFbGVtQ29udGFpbmVyLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgYDxkaXY+RmlsZTogJHtpbmRleH08L2Rpdj5gKTtcbiAgICAgICAgICAgIHJlc3VsdEVsZW1Db250YWluZXIuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCBgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cIiR7dGhpcy5fb3B0aW9ucy5yZXN1bHRQcmVmaXh9WyR7aW5kZXh9XVske3RoaXMuX29wdGlvbnMucmVzdWx0SW5wdXROYW1lc1swXX1dXCIgdmFsdWU9XCIke2ZpbGVEYXRhLm5hbWV9XCIgLz5gKTtcbiAgICAgICAgICAgIHJlc3VsdEVsZW1Db250YWluZXIuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCBgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cIiR7dGhpcy5fb3B0aW9ucy5yZXN1bHRQcmVmaXh9WyR7aW5kZXh9XVske3RoaXMuX29wdGlvbnMucmVzdWx0SW5wdXROYW1lc1sxXX1dXCIgdmFsdWU9XCIke2ZpbGVEYXRhLnR5cGV9XCIgLz5gKTtcbiAgICAgICAgICAgIHJlc3VsdEVsZW1Db250YWluZXIuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCBgPHRleHRhcmVhIG5hbWU9XCIke3RoaXMuX29wdGlvbnMucmVzdWx0UHJlZml4fVske2luZGV4fV1bJHt0aGlzLl9vcHRpb25zLnJlc3VsdElucHV0TmFtZXNbMl19XVwiPiR7ZmlsZURhdGEucmVzdWx0fTwvdGV4dGFyZWE+YCk7XG4gICAgICAgICAgICByZXN1bHRFbGVtQ29udGFpbmVyLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgYDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCIke3RoaXMuX29wdGlvbnMucmVzdWx0UHJlZml4fVske2luZGV4fV1bJHt0aGlzLl9vcHRpb25zLnJlc3VsdElucHV0TmFtZXNbM119XVwiIHZhbHVlPVwiJHtmaWxlRGF0YS5zaXplfVwiIC8+YCk7XG4gICAgICAgICAgICAkcmVzdWx0Q29udGFpbmVyLmFwcGVuZENoaWxkKHJlc3VsdEVsZW1Db250YWluZXIpO1xuICAgICAgICB9O1xuXG5cbiAgICAgICAgLy8gZmlsZXMgcmVhZCBmdW5jdGlvblxuICAgICAgICB0aGlzLl9maWxlc1JlYWQgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGxldCBET00gPSBldmVudC5kYXRhLkRPTTtcbiAgICAgICAgICAgIGxldCBmaWxlc0xpc3Q7XG4gICAgICAgICAgICBsZXQgYXBwcm92ZWRMaXN0ID0gZmFsc2U7XG4gICAgICAgICAgICBsZXQgaSA9IDA7XG5cbiAgICAgICAgICAgIGlmIChldmVudC50YXJnZXQuZmlsZXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIoJ2ZpbGVzIGFycmF5IHNvdXJjZTogZmlsZSBzZWxlY3RvciAoY2xpY2sgZXZlbnQpJywgMSk7XG4gICAgICAgICAgICAgICAgZmlsZXNMaXN0ID0gZXZlbnQudGFyZ2V0LmZpbGVzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyKCdmaWxlcyBhcnJheSBzb3VyY2U6IGRyb3B6b25lIChkcmFnICYgZHJvcCBldmVudCknLCAxKTtcbiAgICAgICAgICAgICAgICBmaWxlc0xpc3QgPSBldmVudC5kYXRhVHJhbnNmZXIuZmlsZXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIoJyVPJywgMCwgZmlsZXNMaXN0KTtcblxuICAgICAgICAgICAgLy8gYnVpbGQgYXBwcm92ZWQgbGlzdFxuICAgICAgICAgICAgaWYgKCF0aGlzLl9vcHRpb25zLmFsbG93RHVwbGljYXRlcykge1xuICAgICAgICAgICAgICAgIGxldCBsb2FkZWRGaWxlcyA9IFtdO1xuICAgICAgICAgICAgICAgIGxldCBuZXdGaWxlcyA9IFtdO1xuXG4gICAgICAgICAgICAgICAgYXBwcm92ZWRMaXN0ID0gW107XG5cbiAgICAgICAgICAgICAgICAvLyBidWlsZCBhbHJlYWR5IGxvYWRlZCBmaWxlcyBsaXN0XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAkcmVzdWx0Q29udGFpbmVyLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvYWRlZEZpbGVzLnB1c2goJHJlc3VsdENvbnRhaW5lci5jaGlsZHJlbltpXS5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpLnZhbHVlKTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgLy8gYnVpbGQgY3VycmVudCBzZWxlY3RlZCBmaWxlcyBsaXN0XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGZpbGVzTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBuZXdGaWxlcy5wdXNoKGZpbGVzTGlzdFtpXS5uYW1lKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBhdm9pZCBsb2FkIHR3aWNlIHRoZSBzYW1lIGZpbGVcbiAgICAgICAgICAgICAgICBuZXdGaWxlcy5mb3JFYWNoKGZ1bmN0aW9uKG5ld0ZpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZpbGVJbmRleCA9IGxvYWRlZEZpbGVzLmluZGV4T2YobmV3RmlsZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGZpbGVJbmRleCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1heCBudW1iZXIgb2YgZmlsZXMgaGFuZGxpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbnN0YW5jZS5fb3B0aW9ucy5tYXhOdW1iZXJPZkZpbGVzICYmIGN1cnJlbnROdW1iZXJPZkZpbGVzID49IGluc3RhbmNlLl9vcHRpb25zLm1heE51bWJlck9mRmlsZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2lzUmVhZEFsbG93ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3JlamVjdFJlYXNvbnMucHVzaCgnbWF4TnVtYmVyT2ZGaWxlcycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdtYXggZmlsZXMhISEnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnROdW1iZXJPZkZpbGVzKys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBwcm92ZWRMaXN0LnB1c2gobmV3RmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJGZpbGVDb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnZmlsZXNDb250YWluZXJFbXB0eScpO1xuXG4gICAgICAgICAgICBsZXQgcmVhZEZpbGUgPSAocmVhZGVyLCBmaWxlLCBpbmRleCwgRE9NLCB1cGxvYWRlckNvbnRhaW5lcikgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50RWxlbWVudCA9IEFycmF5LmZyb20oRE9NLnF1ZXJ5U2VsZWN0b3IoJy5pbm5lckZpbGVUaHVtYnMnKS5jaGlsZHJlbikuZmlsdGVyKGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KGVsZW1lbnQuZGF0YXNldC5pbmRleCkgPT09IGluZGV4IDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjdXJyZW50RWxlbWVudCA9IGN1cnJlbnRFbGVtZW50WzBdO1xuICAgICAgICAgICAgICAgIGxldCBzaXplID0gdGhpcy5fcm91bmQoZmlsZS5zaXplIC8gMTAwMDAwMCk7ICAgICAgLy8gc2l6ZSBpbiBNQlxuXG4gICAgICAgICAgICAgICAgcmVhZGVyLm9ubG9hZHN0YXJ0ID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vcHRpb25zLm9uZmlsZWxvYWRTdGFydChpbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlcihgU1RBUlQgcmVhZCBmaWxlOiAke2luZGV4fSwgc2l6ZTogJHtzaXplfSBNQmAsIDIpO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICByZWFkZXIub25wcm9ncmVzcyA9IChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnQubGVuZ3RoQ29tcHV0YWJsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBlcmNlbnRMb2FkZWQgPSB0aGlzLl9yb3VuZCgoZXZlbnQubG9hZGVkIC8gZXZlbnQudG90YWwpICogMTAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlcihgRmlsZSAke2luZGV4fSBsb2FkZWQ6ICR7cGVyY2VudExvYWRlZH1gLCAzKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSW5jcmVhc2UgdGhlIHByb2dyZXNzIGJhciBsZW5ndGguXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGVyY2VudExvYWRlZCA8PSAxMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKCc6c2NvcGUgPiAubG9hZEJhciA+IGRpdicpLnN0eWxlLndpZHRoID0gJzEwMCUnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHJlYWRlci5vbmxvYWRlbmQgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0eXBlID0gZmlsZS50eXBlO1xuICAgICAgICAgICAgICAgICAgICBsZXQgbmFtZSA9IGZpbGUubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3VsdCA9IHJlYWRlci5yZXN1bHQ7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gcmVhZGluZyB1bnN1Y2Nlc3NmdWxcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGxldCBtaW1lVHlwZSA9IHJlc3VsdC5zdWJzdHJpbmcoMCwgcmVzdWx0LmluZGV4T2YoJzsnKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgZmlsZSBoYXMgbm8gTUlNRSB0eXBlLCByZXBsYWNlIHdpdGggZGVmYXVsdCBvbmVcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1pbWVUeXBlID09PSAnZGF0YTonICYmIHRoaXMuX29wdGlvbnMuZGVmYXVsdE1pbWVUeXBlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IFwiZGF0YTpcIiArIHRoaXMuX29wdGlvbnMuZGVmYXVsdE1pbWVUeXBlICsgcmVzdWx0LnN1YnN0cmluZyhyZXN1bHQuaW5kZXhPZignOycpLCByZXN1bHQubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZSA9PT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZSA9IHRoaXMuX29wdGlvbnMuZGVmYXVsdE1pbWVUeXBlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChuYW1lLmluZGV4T2YoJy4nKSA8IDAgJiYgdGhpcy5fb3B0aW9ucy5kZWZhdWx0RmlsZUV4dCAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUgPSBgJHtuYW1lfS4ke3RoaXMuX29wdGlvbnMuZGVmYXVsdEZpbGVFeHR9YDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5fb3B0aW9ucy51c2VTb3VyY2VGaWxlU2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZSA9IHRoaXMuX3JvdW5kKGJ5dGVMZW5ndGgocmVzdWx0KSAvIDEwMDAwMDApO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IG5ld0ZpbGUgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleDogaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdDogcmVzdWx0LFxuICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZTogc2l6ZVxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NyZWF0ZVJlc3VsdENvbnRhaW5lcihuZXdGaWxlKTtcblxuICAgICAgICAgICAgICAgICAgICAvL3NldCBkaXJlY3QgbGluayBvbiBmaWxlIHNlZSBidXR0b25cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyKGBFTkQgcmVhZCBmaWxlOiAke2luZGV4fWAsIDQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCByZXN1bHRPYmplY3QgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBmaWxlLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBmaWxlLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiByZXN1bHQsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaXplOiBzaXplXG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gdXBkYXRlIHRvdGFsIHNpemVcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFRvdGFsU2l6ZSA9IGN1cnJlbnRUb3RhbFNpemUgKyBzaXplO1xuICAgICAgICAgICAgICAgICAgICAvL2N1cnJlbnROdW1iZXJPZkZpbGVzKys7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IGN1cnJlbnRBdmFpbGFibGVTaXplID0gaW5zdGFuY2UuX3JvdW5kKGluc3RhbmNlLl9vcHRpb25zLm1heFRvdGFsU2l6ZSAtIGN1cnJlbnRUb3RhbFNpemUpO1xuXG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZUxhYmVsKCdzaXplQXZhaWxhYmxlJywgY3VycmVudEF2YWlsYWJsZVNpemUpO1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVMYWJlbCgnY3VycmVudFNpemUnLCBjdXJyZW50VG90YWxTaXplKTtcbiAgICAgICAgICAgICAgICAgICAgLy91cGRhdGVMYWJlbCgnY3VycmVudE51bWJlck9mRmlsZXMnLCBjdXJyZW50TnVtYmVyT2ZGaWxlcyk7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZUxhYmVsKCdudW1iZXJPZlVwbG9hZGVkRmlsZXMnLCAnKysnKTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZUZpbGVTZWVMaW5rKHJlc3VsdCwgdXBsb2FkZXJDb250YWluZXIsIGZpbGUubmFtZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fb3B0aW9ucy5vbmZpbGVsb2FkRW5kKGluZGV4LCByZXN1bHRPYmplY3QsIHRoaXMuX3JvdW5kKGN1cnJlbnRUb3RhbFNpemUpLCBjdXJyZW50TnVtYmVyT2ZGaWxlcyk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIC8vIHRlc3QgaWYgbG9hZGluZyBpcyBhbGxvd2VkXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gcmVhZEFsbG93ZWQoaW5zdGFuY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gcmVhZFJlamVjdGVkKGluc3RhbmNlLCByZWFzb25zKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBlcnJvck1zZztcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCByZWFzb24gb2YgcmVhc29ucykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoKHJlYXNvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ21heEZpbGVTaXplJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvck1zZyA9IGN1cnJlbnRMYW5nT2JqLm1heFNpemVFeGNlZWRlZF9tc2c7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2UuX2xvZ2dlcihgRklMRSBSRUpFQ1RFRDogTWF4IGZpbGUgc2l6ZSBleGNlZWRlZCAtIG1heCBzaXplOiAke2luc3RhbmNlLl9vcHRpb25zLm1heEZpbGVTaXplfSBNQiAtIGZpbGUgc2l6ZTogJHtzaXplfSBNQmApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ21heFRvdGFsU2l6ZSc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JNc2cgPSBjdXJyZW50TGFuZ09iai5tYXhUb3RhbFNpemVFeGNlZWRlZF9tc2c7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2UuX2xvZ2dlcihgRklMRSBSRUpFQ1RFRDogTWF4IHRvdGFsIHNpemUgZXhjZWVkZWQgLSBtYXggc2l6ZTogJHtpbnN0YW5jZS5fb3B0aW9ucy5tYXhUb3RhbFNpemV9IE1CIC0gY3VycmVudCB0b3RhbCBzaXplOiAke2N1cnJlbnRUb3RhbFNpemUgKyBzaXplfSBNQmApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ21heE51bWJlck9mRmlsZXMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTXNnID0gY3VycmVudExhbmdPYmoubWF4TnVtYmVyT2ZGaWxlc0V4Y2VlZGVkX21zZztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZS5fbG9nZ2VyKGBGSUxFIFJFSkVDVEVEOiBNYXggbnVtYmVyIG9mIGZpbGVzIGV4Y2VlZGVkIC0gbWF4IG51bWJlcjogJHtpbnN0YW5jZS5fb3B0aW9ucy5tYXhOdW1iZXJPZkZpbGVzfWApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZXJyb3InKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5zdGFuY2UuX29wdGlvbnMuc2hvd0Vycm9yT25Mb2FkQmFyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbG9hZEJhciA9IGN1cnJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJzpzY29wZSA+IC5sb2FkQmFyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2FkQmFyLmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9hZEJhci5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsIGA8ZGl2IGNsYXNzPVwiZXJyb3JNc2dcIj4ke2Vycm9yTXNnfTwvZGl2PmApXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbnN0YW5jZS5fb3B0aW9ucy51c2VGaWxlSWNvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50RWxlbWVudC5nZXRQcmV2aW91c1NpYmxpbmcoJ2ltZycpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEVsZW1lbnQucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0sIDIwMDApO1xuXG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZUxhYmVsKCdudW1iZXJPZlJlamVjdGVkRmlsZXMnLCAnKysnKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBlcnJvciBjYWxsYmFja1xuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZS5fb3B0aW9ucy5vbmZpbGVSZWplY3RlZChyZWplY3RSZWFzb25zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgbGV0IGlzUmVhZEFsbG93ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGxldCByZWplY3RSZWFzb25zID0gW107XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fb3B0aW9ucy5tYXhGaWxlU2l6ZSAmJiBzaXplID4gdGhpcy5fb3B0aW9ucy5tYXhGaWxlU2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICBpc1JlYWRBbGxvd2VkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdFJlYXNvbnMucHVzaCgnbWF4RmlsZVNpemUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX29wdGlvbnMubWF4VG90YWxTaXplICYmIChjdXJyZW50VG90YWxTaXplICsgc2l6ZSkgPiB0aGlzLl9vcHRpb25zLm1heFRvdGFsU2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICBpc1JlYWRBbGxvd2VkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdFJlYXNvbnMucHVzaCgnbWF4VG90YWxTaXplJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8qaWYgKHRoaXMuX29wdGlvbnMubWF4TnVtYmVyT2ZGaWxlcyAmJiBjdXJyZW50TnVtYmVyT2ZGaWxlcyA+PSB0aGlzLl9vcHRpb25zLm1heE51bWJlck9mRmlsZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNSZWFkQWxsb3dlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICByZWplY3RSZWFzb25zLnB1c2goJ21heE51bWJlck9mRmlsZXMnKTtcbiAgICAgICAgICAgICAgICB9Ki9cblxuICAgICAgICAgICAgICAgIGlzUmVhZEFsbG93ZWQgPyByZWFkQWxsb3dlZCh0aGlzKSA6IHJlYWRSZWplY3RlZCh0aGlzLCByZWplY3RSZWFzb25zKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gYXBwZW5kTWVzc2FnZSgkbWVzc2FnZSkge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAkbWVzc2FnZS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICB9LCAyMDAwKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gY3JlYXRlIGEgbmV3IGRpdiBjb250YWluaW5nIHRodW1iLCBkZWxldGUgYnV0dG9uIGFuZCB0aXRsZSBmaWVsZCBmb3IgZWFjaCB0YXJnZXQgZmlsZVxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGZpbGVzTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBmaWxlID0gZmlsZXNMaXN0W2ldO1xuICAgICAgICAgICAgICAgIGxldCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXG4gICAgICAgICAgICAgICAgLy8gdGVzdCBmb3IgZHVwbGljYXRlc1xuICAgICAgICAgICAgICAgIGlmIChhcHByb3ZlZExpc3QgJiYgYXBwcm92ZWRMaXN0LmluZGV4T2YoZmlsZS5uYW1lKSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0ICRpbmZvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICAgICAgICAgICAgICAgICAgJGluZm8uY2xhc3NOYW1lID0gJ2Vycm9yTGFiZWwgY2VudGVyJztcblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fb3B0aW9ucy5tYXhOdW1iZXJPZkZpbGVzICYmIGN1cnJlbnROdW1iZXJPZkZpbGVzID49IHRoaXMuX29wdGlvbnMubWF4TnVtYmVyT2ZGaWxlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGluZm8uaW5uZXJIVE1MID0gY3VycmVudExhbmdPYmoubWF4TnVtYmVyT2ZGaWxlc0V4Y2VlZGVkX21zZztcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlcihgRmlsZSBtYXggbnVtYmVyIHJlYWNoZWQ6ICR7ZmlsZS5uYW1lfSAtPiBza2lwcGluZy4uLmAsIDIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuX29wdGlvbnMuZHVwbGljYXRlc1dhcm5pbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRpbmZvLmlubmVySFRNTCA9IGN1cnJlbnRMYW5nT2JqLmR1cGxpY2F0ZWRfbXNnO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyKGBGaWxlIGR1cGxpY2F0ZWQ6ICR7ZmlsZS5uYW1lfSAtPiBza2lwcGluZy4uLmAsIDIpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgJGZpbGVUaHVtYnNDb250YWluZXIuYXBwZW5kQ2hpbGQoJGluZm8pO1xuICAgICAgICAgICAgICAgICAgICBhcHBlbmRNZXNzYWdlKCRpbmZvKTtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGV0IGZpbGVOYW1lLCBmaWxlRXh0O1xuXG4gICAgICAgICAgICAgICAgaWYgKGZpbGUubmFtZS5sYXN0SW5kZXhPZignLicpID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBmaWxlTmFtZSA9IGZpbGUubmFtZS5zdWJzdHJpbmcoMCwgZmlsZS5uYW1lLmxhc3RJbmRleE9mKCcuJykpO1xuICAgICAgICAgICAgICAgICAgICBmaWxlRXh0ID0gZmlsZS5uYW1lLnN1YnN0cmluZyhmaWxlLm5hbWUubGFzdEluZGV4T2YoJy4nKSArIDEsIGZpbGUubmFtZS5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsZU5hbWUgPSBmaWxlLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgIGZpbGVFeHQgPSB0aGlzLl9vcHRpb25zLmRlZmF1bHRGaWxlRXh0O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIHRlc3QgZm9yIGZpbGVuYW1lc1xuICAgICAgICAgICAgICAgIGxldCBuYW1lVGVzdCA9IHRoaXMuX29wdGlvbnMuZmlsZW5hbWVUZXN0KGZpbGVOYW1lLCBmaWxlRXh0LCAkZmlsZVRodW1ic0NvbnRhaW5lcik7XG4gICAgICAgICAgICAgICAgaWYgKG5hbWVUZXN0ID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIoYEludmFsaWQgZmlsZSBuYW1lOiAke2ZpbGUubmFtZX1gLCAyKTtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAobmFtZVRlc3QgIT09IHVuZGVmaW5lZCAmJiBuYW1lVGVzdCAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZU5hbWUgPSBuYW1lVGVzdDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldCB1cGxvYWRlckNvbnRhaW5lciA9IHRoaXMuY3JlYXRlVXBsb2FkZXJDb250YWluZXIoZ2xvYmFsSW5kZXgsIGZpbGVOYW1lLCBmaWxlRXh0KTtcblxuICAgICAgICAgICAgICAgIC8vIG5vdyByZWFkIVxuICAgICAgICAgICAgICAgIHJlYWRGaWxlKHJlYWRlciwgZmlsZSwgZ2xvYmFsSW5kZXgsIERPTSwgdXBsb2FkZXJDb250YWluZXIpO1xuICAgICAgICAgICAgICAgIGdsb2JhbEluZGV4Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLypcbiAgICAgICAgKiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAqICB8ICAgICAgICAgICAgICAgICAgICAgICBNQUlOIEZMT1cgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgICAgICogIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgKi9cbiAgICAgICAgLy8gaW5pdGlhbGl6YXRpb25cbiAgICAgICAgaWYgKHRoaXMuX29wdGlvbnMubmFtZSkge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyKCdJTklUSUFMSVpFRCBJTlNUQU5DRTogJyArIHRoaXMuX29wdGlvbnMubmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gYnVpbGQgSFRNTCB0ZW1wbGF0ZVxuICAgICAgICBsZXQgdGVtcGxhdGUgPSB0aGlzLl9vcHRpb25zLkhUTUxUZW1wbGF0ZSgpO1xuXG4gICAgICAgICRlbC5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsIHRlbXBsYXRlKTsgICAgICAgIFxuXG4gICAgICAgIGxldCBnbG9iYWxJbmRleCA9IDA7XG4gICAgICAgIGxldCAkcmVzdWx0Q29udGFpbmVyID0gJGVsLnF1ZXJ5U2VsZWN0b3IoJy4nICsgdGhpcy5fb3B0aW9ucy5yZXN1bHRDb250YWluZXJDbGFzcyk7XG4gICAgICAgIGxldCAkbG9hZEJ0biA9ICRlbC5xdWVyeVNlbGVjdG9yKCcuZmlsZUxvYWRlcicpO1xuICAgICAgICBsZXQgJGZpbGVDb250YWluZXIgPSAkZWwucXVlcnlTZWxlY3RvcignLmZpbGVzQ29udGFpbmVyJyk7XG4gICAgICAgIGxldCAkZmlsZVRodW1ic0NvbnRhaW5lciA9ICRlbC5xdWVyeVNlbGVjdG9yKCcuaW5uZXJGaWxlVGh1bWJzJyk7XG4gICAgICAgIGxldCBkcm9wWm9uZSA9ICRlbC5xdWVyeVNlbGVjdG9yKCcuZHJvcFpvbmUnKTtcbiAgICAgICAgbGV0IGN1cnJlbnRMYW5nT2JqID0gdGhpcy5fb3B0aW9ucy5sYW5nc1t0aGlzLl9vcHRpb25zLmxhbmddO1xuICAgICAgICBsZXQgY3VycmVudFRvdGFsU2l6ZSA9IDA7XG4gICAgICAgIGxldCBjdXJyZW50TnVtYmVyT2ZGaWxlcyA9IDA7XG4gICAgICAgIGxldCBsb2FkZWRGaWxlO1xuICAgICAgICBsZXQgaW5zdGFuY2VMYWJlbHMgPSB7fTtcbiAgICAgICAgbGV0IGxhYmVsc0NsYXNzZXMgPSB0aGlzLl9vcHRpb25zLmxhYmVsc0NsYXNzZXM7XG5cbiAgICAgICAgLy8gcGxhY2UgcmVsb2FkZWQgZmlsZXMnIEhUTUwgaW4gcmVzdWx0IGNvbnRhaW5lciBkaXJlY3RseSAoaWYgcHJvdmlkZWQpXG4gICAgICAgIGlmICh0aGlzLl9vcHRpb25zLnJlbG9hZEhUTUwpIHtcbiAgICAgICAgICAgICRyZXN1bHRDb250YWluZXIuaW5uZXJIVE1MID0gdGhpcy5fb3B0aW9ucy5yZWxvYWRIVE1MO1xuICAgICAgICB9XG5cblxuICAgICAgICAkZWwucXVlcnlTZWxlY3RvcignLmludHJvTXNnJykuaW5uZXJIVE1MID0gY3VycmVudExhbmdPYmouaW50cm9fbXNnO1xuICAgICAgICBkcm9wWm9uZS5pbm5lckhUTUwgPSBjdXJyZW50TGFuZ09iai5kcm9wWm9uZV9tc2c7XG5cbiAgICAgICAgaWYgKCF0aGlzLl9vcHRpb25zLmRlYnVnKSB7XG4gICAgICAgICAgICAkcmVzdWx0Q29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICRyZXN1bHRDb250YWluZXIuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmViZWdpbicsICc8cCBjbGFzcz1cImRlYnVnTW9kZVwiPkRlYnVnIG1vZGU6IG9uPC9wPicpO1xuICAgICAgICAgICAgJHJlc3VsdENvbnRhaW5lci5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWJlZ2luJywgYDxkaXYgY2xhc3M9XCJkZWJ1Z1wiPlVwbG9hZGVkIGZpbGVzOiA8c3BhbiBjbGFzcz1cIiR7bGFiZWxzQ2xhc3Nlcy5udW1iZXJPZlVwbG9hZGVkRmlsZXN9XCI+PHNwYW4+MDwvc3Bhbj48L3NwYW4+IHwgUmVqZWN0ZWQgZmlsZXM6IDxzcGFuIGNsYXNzPVwiJHtsYWJlbHNDbGFzc2VzLm51bWJlck9mUmVqZWN0ZWRGaWxlc31cIj48c3Bhbj4wPC9zcGFuPjwvc3Bhbj48L2Rpdj5gKTtcbiAgICAgICAgICAgICRyZXN1bHRDb250YWluZXIuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmViZWdpbicsIGA8ZGl2IGNsYXNzPVwiZGVidWdcIj5NQVggRklMRSBTSVpFOiAke3RoaXMuX29wdGlvbnMubWF4RmlsZVNpemV9IE1CPC9kaXY+YCk7XG4gICAgICAgICAgICAkcmVzdWx0Q29udGFpbmVyLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlYmVnaW4nLCBgPGRpdiBjbGFzcz1cImRlYnVnXCI+TUFYIFRPVEFMIFNJWkU6ICR7dGhpcy5fb3B0aW9ucy5tYXhUb3RhbFNpemV9IE1CPC9kaXY+YCk7XG4gICAgICAgICAgICAkcmVzdWx0Q29udGFpbmVyLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlYmVnaW4nLCBgPGRpdiBjbGFzcz1cImRlYnVnXCI+TUFYIE5VTUJFUiBPRiBGSUxFUzogJHt0aGlzLl9vcHRpb25zLm1heE51bWJlck9mRmlsZXMgPT09IGZhbHNlID8gJyhub25lKScgOiB0aGlzLl9vcHRpb25zLm1heE51bWJlck9mRmlsZXN9PC9kaXY+YCk7XG4gICAgICAgICAgICAkcmVzdWx0Q29udGFpbmVyLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlYmVnaW4nLCBgPGRpdiBjbGFzcz1cImRlYnVnIGN1cnJlbnROdW1iZXJPZkZpbGVzXCI+TnVtYmVyIG9mIGZpbGVzIHVwbG9hZGVkOiA8c3Bhbj4ke2N1cnJlbnROdW1iZXJPZkZpbGVzfTwvc3Bhbj48L2Rpdj5gKTtcbiAgICAgICAgICAgICRyZXN1bHRDb250YWluZXIuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmViZWdpbicsIGA8ZGl2IGNsYXNzPVwiZGVidWcgc2l6ZUF2YWlsYWJsZVwiPlNpemUgc3RpbGwgYXZhaWxhYmxlOiA8c3Bhbj4ke3RoaXMuX29wdGlvbnMubWF4VG90YWxTaXplfTwvc3Bhbj4gTUI8L2Rpdj5gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIC0tLSBGSUxFUyBSRUxPQUQgU0VDVElPTiAtLS1cbiAgICAgICAgLy8gbG9va3VwIGZvciBwcmV2aW91c2x5IGxvYWRlZCBmaWxlcyBwbGFjZWQgaW4gdGhlIHJlc3VsdCBjb250YWluZXIgZGlyZWN0bHkgICAgICAgIFxuICAgICAgICBmb3IgKGxldCBsYWJlbCBpbiBsYWJlbHNDbGFzc2VzKSB7XG4gICAgICAgICAgICBpbnN0YW5jZUxhYmVsc1tgJHtsYWJlbH1MYWJlbHNgXSA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGxhYmVsc0NvbnRhaW5lcnMgPSB0aGlzLl9vcHRpb25zLmxhYmVsc0NvbnRhaW5lcnM7XG5cbiAgICAgICAgaWYgKHRoaXMuX29wdGlvbnMuZGVidWcpIHtcbiAgICAgICAgICAgIC8vIGhhbmRsZSBkZWJ1ZyBkeW5hbWljIChsYWJlbHMgd2l0aCBhIHN0YXRpYyB2YWx1ZSBkb24ndCBuZWVkIHRvIGJlIGNhY2hlZCkgbGFiZWxzXG4gICAgICAgICAgICBpbnN0YW5jZUxhYmVscy5zaXplQXZhaWxhYmxlTGFiZWxzLnB1c2goJGVsLnF1ZXJ5U2VsZWN0b3IoYC4ke2xhYmVsc0NsYXNzZXMuc2l6ZUF2YWlsYWJsZX1gKSk7XG4gICAgICAgICAgICBpbnN0YW5jZUxhYmVscy5jdXJyZW50TnVtYmVyT2ZGaWxlc0xhYmVscy5wdXNoKCRlbC5xdWVyeVNlbGVjdG9yKGAuJHtsYWJlbHNDbGFzc2VzLmN1cnJlbnROdW1iZXJPZkZpbGVzfWApKTtcbiAgICAgICAgICAgIGluc3RhbmNlTGFiZWxzLm51bWJlck9mVXBsb2FkZWRGaWxlc0xhYmVscy5wdXNoKCRlbC5xdWVyeVNlbGVjdG9yKGAuJHtsYWJlbHNDbGFzc2VzLm51bWJlck9mVXBsb2FkZWRGaWxlc31gKSk7XG4gICAgICAgICAgICBpbnN0YW5jZUxhYmVscy5udW1iZXJPZlJlamVjdGVkRmlsZXNMYWJlbHMucHVzaCgkZWwucXVlcnlTZWxlY3RvcihgLiR7bGFiZWxzQ2xhc3Nlcy5udW1iZXJPZlJlamVjdGVkRmlsZXN9YCkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsYWJlbHNDb250YWluZXJzKSB7XG4gICAgICAgICAgICBjb25zdCBnZXRDb250YWluZXIgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yIChsZXQgbGFiZWwgaW4gbGFiZWxzQ2xhc3Nlcykge1xuICAgICAgICAgICAgICAgIGxldCBmaW5kTGFiZWwgPSBmdW5jdGlvbihjb250YWluZXIsIGxhYmVsc0NsYXNzZXMsIGxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb250YWluZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBsYWJlbHMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcihgLiR7bGFiZWxzQ2xhc3Nlc1tsYWJlbF19YCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsYWJlbHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZUxhYmVsc1tgJHtsYWJlbH1MYWJlbHNgXS5wdXNoKGxhYmVscyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIoYGltcG9zc2libGUgdG8gZmluZCBsYWJlbENvbnRhaW5lciAnJHtzZWxlY3Rvcn0nYCwgMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShsYWJlbHNDb250YWluZXJzKSkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBzZWxlY3RvciBvZiBsYWJlbHNDb250YWluZXJzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgY29udGFpbmVyID0gZ2V0Q29udGFpbmVyKHNlbGVjdG9yKTtcbiAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbmRMYWJlbChjb250YWluZXIsIGxhYmVsc0NsYXNzZXMsIGxhYmVsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbnRhaW5lciA9IGdldENvbnRhaW5lcihsYWJlbHNDb250YWluZXJzKTtcbiAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnRhaW5lcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGxhYmVscyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKGAuJHtsYWJlbHNDbGFzc2VzW2xhYmVsXX1gKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxhYmVscykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc3RhbmNlTGFiZWxzW2Ake2xhYmVsfUxhYmVsc2BdLnB1c2gobGFiZWxzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlcihgaW1wb3NzaWJsZSB0byBmaW5kIGxhYmVsQ29udGFpbmVyICcke2xhYmVsc0NvbnRhaW5lcnN9J2AsIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB1cGRhdGVMYWJlbCgnbWF4RmlsZVNpemUnLCB0aGlzLl9vcHRpb25zLm1heEZpbGVTaXplKTtcbiAgICAgICAgdXBkYXRlTGFiZWwoJ21heFRvdGFsU2l6ZScsIHRoaXMuX29wdGlvbnMubWF4VG90YWxTaXplKTtcbiAgICAgICAgdXBkYXRlTGFiZWwoJ21heE51bWJlck9mRmlsZXMnLCB0aGlzLl9vcHRpb25zLm1heE51bWJlck9mRmlsZXMpO1xuXG4gICAgICAgIGZvciAoY29uc3QgW2luZGV4LCBlbGVtZW50XSBvZiAkcmVzdWx0Q29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoYDpzY29wZSA+IC4ke3RoaXMuX29wdGlvbnMucmVzdWx0RmlsZUNvbnRhaW5lckNsYXNzfWApLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyKGBmb3VuZCBwcmV2aW91c2x5IHVwbG9hZGVkIGZpbGU6IGluZGV4ID0gJHtlbGVtZW50LmRhdGFzZXQuaW5kZXh9YCwgMik7XG5cbiAgICAgICAgICAgIC8vIHBheSBhdHRlbnRpb24gdG8gaW5kZXggdXNlZCBvbiBmaWxlRGF0YSBoZXJlOiBpbmRleCAwIGlzIHRoZSB0aXRsZSBESVYhXG4gICAgICAgICAgICBsZXQgZmlsZURhdGEgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJzpzY29wZSA+IGlucHV0Jyk7XG4gICAgICAgICAgICBsZXQgZmlsZU5hbWUgPSBmaWxlRGF0YVswXS52YWx1ZTtcbiAgICAgICAgICAgIGxldCBmaWxlRXh0ID0gZmlsZURhdGFbMV0udmFsdWU7XG4gICAgICAgICAgICBsZXQgZmlsZVNpemUgPSBmaWxlRGF0YVsyXS52YWx1ZTtcblxuICAgICAgICAgICAgaWYgKGZpbGVOYW1lLmxhc3RJbmRleE9mKCcuJykgPiAwKSB7XG4gICAgICAgICAgICAgICAgZmlsZU5hbWUgPSBmaWxlTmFtZS5zdWJzdHIoMCwgZmlsZU5hbWUubGFzdEluZGV4T2YoJy4nKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxvYWRlZEZpbGUgPSB0aGlzLmNyZWF0ZVVwbG9hZGVyQ29udGFpbmVyKGdsb2JhbEluZGV4LCBmaWxlTmFtZSwgZmlsZUV4dCk7XG4gICAgICAgICAgICBsb2FkZWRGaWxlLnF1ZXJ5U2VsZWN0b3IoJzpzY29wZSA+IC5sb2FkQmFyID4gZGl2Jykuc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gICAgICAgICAgICBsb2FkZWRGaWxlLmNsYXNzTGlzdC5hZGQodGhpcy5fb3B0aW9ucy5yZWxvYWRlZEZpbGVzQ2xhc3MpO1xuXG4gICAgICAgICAgICBsZXQgZGF0YSA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcignOnNjb3BlIHRleHRhcmVhJykudmFsdWU7XG5cbiAgICAgICAgICAgIHVwZGF0ZUZpbGVTZWVMaW5rKGRhdGEsIGxvYWRlZEZpbGUsIGZpbGVOYW1lKTtcblxuICAgICAgICAgICAgY3VycmVudFRvdGFsU2l6ZSA9IGN1cnJlbnRUb3RhbFNpemUgKyBwYXJzZUZsb2F0KGZpbGVTaXplKTtcbiAgICAgICAgICAgIGN1cnJlbnROdW1iZXJPZkZpbGVzKys7XG4gICAgICAgICAgICBnbG9iYWxJbmRleCsrO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmVsb2FkIGZpbGVzIGZyb20gcHJvdmlkZWQgYXJyYXlcbiAgICAgICAgaWYgKHRoaXMuX29wdGlvbnMucmVsb2FkQXJyYXkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5fb3B0aW9ucy5yZWxvYWRBcnJheS5mb3JFYWNoKChmaWxlLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIHJlLWNyZWF0ZSB2aXNpYmxlIGVsZW1lbnRzXG4gICAgICAgICAgICAgICAgbG9hZGVkRmlsZSA9IHRoaXMuY3JlYXRlVXBsb2FkZXJDb250YWluZXIoaW5kZXgsIGZpbGUubmFtZSwgZmlsZS5leHQpO1xuICAgICAgICAgICAgICAgIGxvYWRlZEZpbGUucXVlcnlTZWxlY3RvcignOnNjb3BlID4gLmxvYWRCYXIgPiBkaXYnKS5zdHlsZS53aWR0aCA9ICcxMDAlJztcbiAgICAgICAgICAgICAgICBsb2FkZWRGaWxlLmNsYXNzTGlzdC5hZGQodGhpcy5fb3B0aW9ucy5yZWxvYWRlZEZpbGVzQ2xhc3MpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyKCdmb3VuZCBwcmV2aW91c2x5IHVwbG9hZGVkIGZpbGU6IGluZGV4ID0gJyArIGluZGV4LCAyKTtcblxuICAgICAgICAgICAgICAgIC8vIHJlLWNyZWF0ZSByZXN1bHRzXG4gICAgICAgICAgICAgICAgbGV0IG5ld0ZpbGUgPSB7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4OiBpbmRleCxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogZmlsZS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBmaWxlLmV4dCxcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiBmaWxlLmRhdGEsXG4gICAgICAgICAgICAgICAgICAgIHNpemU6IGZpbGUuc2l6ZVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB1cGRhdGVGaWxlU2VlTGluayhmaWxlLmRhdGEsIGxvYWRlZEZpbGUsIGZpbGUubmFtZSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9jcmVhdGVSZXN1bHRDb250YWluZXIobmV3RmlsZSk7XG5cbiAgICAgICAgICAgICAgICBjdXJyZW50VG90YWxTaXplID0gY3VycmVudFRvdGFsU2l6ZSArIHBhcnNlRmxvYXQoZmlsZS5zaXplKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50TnVtYmVyT2ZGaWxlcysrO1xuICAgICAgICAgICAgICAgIGdsb2JhbEluZGV4Kys7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGN1cnJlbnRUb3RhbFNpemUgPSB0aGlzLl9yb3VuZChjdXJyZW50VG90YWxTaXplKTtcblxuICAgICAgICB0aGlzLl9sb2dnZXIoYGN1cnJlbnQgdG90YWwgc2l6ZTogJHtjdXJyZW50VG90YWxTaXplfSAtIGN1cnJlbnQgbnVtYmVyIG9mIGZpbGVzOiAke2N1cnJlbnROdW1iZXJPZkZpbGVzfWApO1xuICAgICAgICB1cGRhdGVMYWJlbCgnc2l6ZUF2YWlsYWJsZScsICh0aGlzLl9vcHRpb25zLm1heFRvdGFsU2l6ZSAtIGN1cnJlbnRUb3RhbFNpemUpKTtcbiAgICAgICAgdXBkYXRlTGFiZWwoJ2N1cnJlbnRTaXplJywgY3VycmVudFRvdGFsU2l6ZSk7XG4gICAgICAgIHVwZGF0ZUxhYmVsKCdjdXJyZW50TnVtYmVyT2ZGaWxlcycsIGN1cnJlbnROdW1iZXJPZkZpbGVzKTtcbiAgICAgICAgdXBkYXRlTGFiZWwoJ251bWJlck9mVXBsb2FkZWRGaWxlcycsIGN1cnJlbnROdW1iZXJPZkZpbGVzKTtcbiAgICAgICAgdXBkYXRlTGFiZWwoJ251bWJlck9mUmVqZWN0ZWRGaWxlcycsICcwJyk7XG4gICAgICAgIC8vIC0tLSBFTkQgRklMRVMgUkVMT0FEIFNFQ1RJT04gLS0tXG5cbiAgICAgICAgLy8gb25sb2FkIGNhbGxiYWNrXG4gICAgICAgIHRoaXMuX29wdGlvbnMub25sb2FkKHRoaXMuX29wdGlvbnMsIGN1cnJlbnRUb3RhbFNpemUsIGN1cnJlbnROdW1iZXJPZkZpbGVzKTtcblxuICAgICAgICAvLyBEcmFnIGV2ZW50c1xuICAgICAgICB0aGlzLmhhbmRsZURyYWdPdmVyID0gKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBkcm9wWm9uZS5jbGFzc0xpc3QuYWRkKCdoaWdobGlnaHQnKTtcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gJ2NvcHknOyAvLyBFeHBsaWNpdGx5IHNob3cgdGhpcyBpcyBhIGNvcHkuXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5oYW5kbGVEcm9wID0gKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBkcm9wWm9uZS5jbGFzc0xpc3QucmVtb3ZlKCdoaWdobGlnaHQnKTtcbiAgICAgICAgICAgIGV2ZW50LmRhdGEgPSB7XG4gICAgICAgICAgICAgICAgRE9NOiAkZWxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLl9maWxlc1JlYWQoZXZlbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZHJvcFpvbmUuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2xlYXZlJywgKCkgPT4ge1xuICAgICAgICAgICAgZHJvcFpvbmUuY2xhc3NMaXN0LnJlbW92ZSgnaGlnaGxpZ2h0Jyk7XG4gICAgICAgIH0pO1xuICAgICAgICBkcm9wWm9uZS5hZGRFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIHRoaXMuaGFuZGxlRHJhZ092ZXIpO1xuICAgICAgICBkcm9wWm9uZS5hZGRFdmVudExpc3RlbmVyKCdkcm9wJywgKCkgPT4ge1xuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVEcm9wKGV2ZW50KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZHJvcFpvbmUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICRsb2FkQnRuLmNsaWNrKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRsb2FkQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgZXZlbnQuZGF0YSA9IHtcbiAgICAgICAgICAgICAgICBET006ICRlbFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuX2ZpbGVzUmVhZChldmVudCk7XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gbnVsbDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGZpbGVVcGxvYWRlcjogaW5zdGFuY2UsXG4gICAgICAgICAgICBlbGVtZW50RE9NOiAkZWxcbiAgICAgICAgfTtcbiAgICB9O1xufSkod2luZG93KTtcbiIsIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG5cdHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcblx0dHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKGZhY3RvcnkpIDpcblx0KGdsb2JhbC5kZWVwbWVyZ2UgPSBmYWN0b3J5KCkpO1xufSh0aGlzLCAoZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XG5cbnZhciBpc01lcmdlYWJsZU9iamVjdCA9IGZ1bmN0aW9uIGlzTWVyZ2VhYmxlT2JqZWN0KHZhbHVlKSB7XG5cdHJldHVybiBpc05vbk51bGxPYmplY3QodmFsdWUpXG5cdFx0JiYgIWlzU3BlY2lhbCh2YWx1ZSlcbn07XG5cbmZ1bmN0aW9uIGlzTm9uTnVsbE9iamVjdCh2YWx1ZSkge1xuXHRyZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnXG59XG5cbmZ1bmN0aW9uIGlzU3BlY2lhbCh2YWx1ZSkge1xuXHR2YXIgc3RyaW5nVmFsdWUgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpO1xuXG5cdHJldHVybiBzdHJpbmdWYWx1ZSA9PT0gJ1tvYmplY3QgUmVnRXhwXSdcblx0XHR8fCBzdHJpbmdWYWx1ZSA9PT0gJ1tvYmplY3QgRGF0ZV0nXG5cdFx0fHwgaXNSZWFjdEVsZW1lbnQodmFsdWUpXG59XG5cbi8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvYmxvYi9iNWFjOTYzZmI3OTFkMTI5OGU3ZjM5NjIzNjM4M2JjOTU1ZjkxNmMxL3NyYy9pc29tb3JwaGljL2NsYXNzaWMvZWxlbWVudC9SZWFjdEVsZW1lbnQuanMjTDIxLUwyNVxudmFyIGNhblVzZVN5bWJvbCA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLmZvcjtcbnZhciBSRUFDVF9FTEVNRU5UX1RZUEUgPSBjYW5Vc2VTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5lbGVtZW50JykgOiAweGVhYzc7XG5cbmZ1bmN0aW9uIGlzUmVhY3RFbGVtZW50KHZhbHVlKSB7XG5cdHJldHVybiB2YWx1ZS4kJHR5cGVvZiA9PT0gUkVBQ1RfRUxFTUVOVF9UWVBFXG59XG5cbmZ1bmN0aW9uIGVtcHR5VGFyZ2V0KHZhbCkge1xuXHRyZXR1cm4gQXJyYXkuaXNBcnJheSh2YWwpID8gW10gOiB7fVxufVxuXG5mdW5jdGlvbiBjbG9uZVVubGVzc090aGVyd2lzZVNwZWNpZmllZCh2YWx1ZSwgb3B0aW9ucykge1xuXHRyZXR1cm4gKG9wdGlvbnMuY2xvbmUgIT09IGZhbHNlICYmIG9wdGlvbnMuaXNNZXJnZWFibGVPYmplY3QodmFsdWUpKVxuXHRcdD8gZGVlcG1lcmdlKGVtcHR5VGFyZ2V0KHZhbHVlKSwgdmFsdWUsIG9wdGlvbnMpXG5cdFx0OiB2YWx1ZVxufVxuXG5mdW5jdGlvbiBkZWZhdWx0QXJyYXlNZXJnZSh0YXJnZXQsIHNvdXJjZSwgb3B0aW9ucykge1xuXHRyZXR1cm4gdGFyZ2V0LmNvbmNhdChzb3VyY2UpLm1hcChmdW5jdGlvbihlbGVtZW50KSB7XG5cdFx0cmV0dXJuIGNsb25lVW5sZXNzT3RoZXJ3aXNlU3BlY2lmaWVkKGVsZW1lbnQsIG9wdGlvbnMpXG5cdH0pXG59XG5cbmZ1bmN0aW9uIGdldE1lcmdlRnVuY3Rpb24oa2V5LCBvcHRpb25zKSB7XG5cdGlmICghb3B0aW9ucy5jdXN0b21NZXJnZSkge1xuXHRcdHJldHVybiBkZWVwbWVyZ2Vcblx0fVxuXHR2YXIgY3VzdG9tTWVyZ2UgPSBvcHRpb25zLmN1c3RvbU1lcmdlKGtleSk7XG5cdHJldHVybiB0eXBlb2YgY3VzdG9tTWVyZ2UgPT09ICdmdW5jdGlvbicgPyBjdXN0b21NZXJnZSA6IGRlZXBtZXJnZVxufVxuXG5mdW5jdGlvbiBtZXJnZU9iamVjdCh0YXJnZXQsIHNvdXJjZSwgb3B0aW9ucykge1xuXHR2YXIgZGVzdGluYXRpb24gPSB7fTtcblx0aWYgKG9wdGlvbnMuaXNNZXJnZWFibGVPYmplY3QodGFyZ2V0KSkge1xuXHRcdE9iamVjdC5rZXlzKHRhcmdldCkuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcblx0XHRcdGRlc3RpbmF0aW9uW2tleV0gPSBjbG9uZVVubGVzc090aGVyd2lzZVNwZWNpZmllZCh0YXJnZXRba2V5XSwgb3B0aW9ucyk7XG5cdFx0fSk7XG5cdH1cblx0T2JqZWN0LmtleXMoc291cmNlKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuXHRcdGlmICghb3B0aW9ucy5pc01lcmdlYWJsZU9iamVjdChzb3VyY2Vba2V5XSkgfHwgIXRhcmdldFtrZXldKSB7XG5cdFx0XHRkZXN0aW5hdGlvbltrZXldID0gY2xvbmVVbmxlc3NPdGhlcndpc2VTcGVjaWZpZWQoc291cmNlW2tleV0sIG9wdGlvbnMpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRkZXN0aW5hdGlvbltrZXldID0gZ2V0TWVyZ2VGdW5jdGlvbihrZXksIG9wdGlvbnMpKHRhcmdldFtrZXldLCBzb3VyY2Vba2V5XSwgb3B0aW9ucyk7XG5cdFx0fVxuXHR9KTtcblx0cmV0dXJuIGRlc3RpbmF0aW9uXG59XG5cbmZ1bmN0aW9uIGRlZXBtZXJnZSh0YXJnZXQsIHNvdXJjZSwgb3B0aW9ucykge1xuXHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblx0b3B0aW9ucy5hcnJheU1lcmdlID0gb3B0aW9ucy5hcnJheU1lcmdlIHx8IGRlZmF1bHRBcnJheU1lcmdlO1xuXHRvcHRpb25zLmlzTWVyZ2VhYmxlT2JqZWN0ID0gb3B0aW9ucy5pc01lcmdlYWJsZU9iamVjdCB8fCBpc01lcmdlYWJsZU9iamVjdDtcblxuXHR2YXIgc291cmNlSXNBcnJheSA9IEFycmF5LmlzQXJyYXkoc291cmNlKTtcblx0dmFyIHRhcmdldElzQXJyYXkgPSBBcnJheS5pc0FycmF5KHRhcmdldCk7XG5cdHZhciBzb3VyY2VBbmRUYXJnZXRUeXBlc01hdGNoID0gc291cmNlSXNBcnJheSA9PT0gdGFyZ2V0SXNBcnJheTtcblxuXHRpZiAoIXNvdXJjZUFuZFRhcmdldFR5cGVzTWF0Y2gpIHtcblx0XHRyZXR1cm4gY2xvbmVVbmxlc3NPdGhlcndpc2VTcGVjaWZpZWQoc291cmNlLCBvcHRpb25zKVxuXHR9IGVsc2UgaWYgKHNvdXJjZUlzQXJyYXkpIHtcblx0XHRyZXR1cm4gb3B0aW9ucy5hcnJheU1lcmdlKHRhcmdldCwgc291cmNlLCBvcHRpb25zKVxuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBtZXJnZU9iamVjdCh0YXJnZXQsIHNvdXJjZSwgb3B0aW9ucylcblx0fVxufVxuXG5kZWVwbWVyZ2UuYWxsID0gZnVuY3Rpb24gZGVlcG1lcmdlQWxsKGFycmF5LCBvcHRpb25zKSB7XG5cdGlmICghQXJyYXkuaXNBcnJheShhcnJheSkpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ2ZpcnN0IGFyZ3VtZW50IHNob3VsZCBiZSBhbiBhcnJheScpXG5cdH1cblxuXHRyZXR1cm4gYXJyYXkucmVkdWNlKGZ1bmN0aW9uKHByZXYsIG5leHQpIHtcblx0XHRyZXR1cm4gZGVlcG1lcmdlKHByZXYsIG5leHQsIG9wdGlvbnMpXG5cdH0sIHt9KVxufTtcblxudmFyIGRlZXBtZXJnZV8xID0gZGVlcG1lcmdlO1xuXG5yZXR1cm4gZGVlcG1lcmdlXzE7XG5cbn0pKSk7XG4iLCJ0cnkge1xuXHQvLyB0ZXN0IGZvciBzY29wZSBzdXBwb3J0XG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJzpzY29wZSAqJyk7XG59IGNhdGNoIChlcnJvcikge1xuXHQoZnVuY3Rpb24gKEVsZW1lbnRQcm90b3R5cGUpIHtcblx0XHQvLyBzY29wZSByZWdleFxuXHRcdHZhciBzY29wZSA9IC86c2NvcGUoPyFbXFx3LV0pL2dpO1xuXG5cdFx0Ly8gcG9seWZpbGwgRWxlbWVudCNxdWVyeVNlbGVjdG9yXG5cdFx0dmFyIHF1ZXJ5U2VsZWN0b3JXaXRoU2NvcGUgPSBwb2x5ZmlsbChFbGVtZW50UHJvdG90eXBlLnF1ZXJ5U2VsZWN0b3IpO1xuXG5cdFx0RWxlbWVudFByb3RvdHlwZS5xdWVyeVNlbGVjdG9yID0gZnVuY3Rpb24gcXVlcnlTZWxlY3RvcihzZWxlY3RvcnMpIHtcblx0XHRcdHJldHVybiBxdWVyeVNlbGVjdG9yV2l0aFNjb3BlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0fTtcblxuXHRcdC8vIHBvbHlmaWxsIEVsZW1lbnQjcXVlcnlTZWxlY3RvckFsbFxuXHRcdHZhciBxdWVyeVNlbGVjdG9yQWxsV2l0aFNjb3BlID0gcG9seWZpbGwoRWxlbWVudFByb3RvdHlwZS5xdWVyeVNlbGVjdG9yQWxsKTtcblxuXHRcdEVsZW1lbnRQcm90b3R5cGUucXVlcnlTZWxlY3RvckFsbCA9IGZ1bmN0aW9uIHF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3JzKSB7XG5cdFx0XHRyZXR1cm4gcXVlcnlTZWxlY3RvckFsbFdpdGhTY29wZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdH07XG5cblx0XHQvLyBwb2x5ZmlsbCBFbGVtZW50I21hdGNoZXNcblx0XHRpZiAoRWxlbWVudFByb3RvdHlwZS5tYXRjaGVzKSB7XG5cdFx0XHR2YXIgbWF0Y2hlc1dpdGhTY29wZSA9IHBvbHlmaWxsKEVsZW1lbnRQcm90b3R5cGUubWF0Y2hlcyk7XG5cblx0XHRcdEVsZW1lbnRQcm90b3R5cGUubWF0Y2hlcyA9IGZ1bmN0aW9uIG1hdGNoZXMoc2VsZWN0b3JzKSB7XG5cdFx0XHRcdHJldHVybiBtYXRjaGVzV2l0aFNjb3BlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdC8vIHBvbHlmaWxsIEVsZW1lbnQjY2xvc2VzdFxuXHRcdGlmIChFbGVtZW50UHJvdG90eXBlLmNsb3Nlc3QpIHtcblx0XHRcdHZhciBjbG9zZXN0V2l0aFNjb3BlID0gcG9seWZpbGwoRWxlbWVudFByb3RvdHlwZS5jbG9zZXN0KTtcblxuXHRcdFx0RWxlbWVudFByb3RvdHlwZS5jbG9zZXN0ID0gZnVuY3Rpb24gY2xvc2VzdChzZWxlY3RvcnMpIHtcblx0XHRcdFx0cmV0dXJuIGNsb3Nlc3RXaXRoU2NvcGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gcG9seWZpbGwocXNhKSB7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24gKHNlbGVjdG9ycykge1xuXHRcdFx0XHQvLyB3aGV0aGVyIHRoZSBzZWxlY3RvcnMgY29udGFpbiA6c2NvcGVcblx0XHRcdFx0dmFyIGhhc1Njb3BlID0gc2VsZWN0b3JzICYmIHNjb3BlLnRlc3Qoc2VsZWN0b3JzKTtcblxuXHRcdFx0XHRpZiAoaGFzU2NvcGUpIHtcblx0XHRcdFx0XHQvLyBmYWxsYmFjayBhdHRyaWJ1dGVcblx0XHRcdFx0XHR2YXIgYXR0ciA9ICdxJyArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDkwMDAwMDApICsgMTAwMDAwMDtcblxuXHRcdFx0XHRcdC8vIHJlcGxhY2UgOnNjb3BlIHdpdGggdGhlIGZhbGxiYWNrIGF0dHJpYnV0ZVxuXHRcdFx0XHRcdGFyZ3VtZW50c1swXSA9IHNlbGVjdG9ycy5yZXBsYWNlKHNjb3BlLCAnWycgKyBhdHRyICsgJ10nKTtcblxuXHRcdFx0XHRcdC8vIGFkZCB0aGUgZmFsbGJhY2sgYXR0cmlidXRlXG5cdFx0XHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUoYXR0ciwgJycpO1xuXG5cdFx0XHRcdFx0Ly8gcmVzdWx0cyBvZiB0aGUgcXNhXG5cdFx0XHRcdFx0dmFyIGVsZW1lbnRPck5vZGVMaXN0ID0gcXNhLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cblx0XHRcdFx0XHQvLyByZW1vdmUgdGhlIGZhbGxiYWNrIGF0dHJpYnV0ZVxuXHRcdFx0XHRcdHRoaXMucmVtb3ZlQXR0cmlidXRlKGF0dHIpO1xuXG5cdFx0XHRcdFx0Ly8gcmV0dXJuIHRoZSByZXN1bHRzIG9mIHRoZSBxc2Fcblx0XHRcdFx0XHRyZXR1cm4gZWxlbWVudE9yTm9kZUxpc3Q7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gcmV0dXJuIHRoZSByZXN1bHRzIG9mIHRoZSBxc2Fcblx0XHRcdFx0XHRyZXR1cm4gcXNhLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fVxuXHR9KShFbGVtZW50LnByb3RvdHlwZSk7XG59XG4iXX0=
