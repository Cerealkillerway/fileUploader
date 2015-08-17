/*
* fileUploader v2.5.6
* available under MIT license
* 
* */
(function($) {

    var FileUploader = function($el, options, translation) {
        var self = this;

        // default options
        this._defaults = {
            lang: 'en',
            useFileIcons: true,

            debug: false,                                                  // activate console logs for debug
            debugLogStyle: "color: #9900ff",                               // style for debug console logs in js console
            name: undefined,                                               // a name for plugin's instance (useful for debug purposes)
            pluginName: "FileUploader",                                    // plugin's name (used in debug logs alongside with name)

            useLoadingBars: true,                                          // insert loading bar for files
            reloadedFilesClass: 'reloadedElement',                         // class for previously uploaded files
            resultContainer: 'result',                                     // result container's class (where to place result files data)
            resultFileContainerClass: "uploadedFile",                      // class for every file result container span
            resultPrefix: "fileUploader",                                  // prefix for inputs in the file result container
            resultInputNames: ["title", "extension", "value", "size"],     // name suffix to be used for result inputs
            defaultFileExt: "",                                            // extension to use for files with no extension
            defaultMimeType: "",                                           // MIME type to use for files with no extension 
            fileMaxSize: 50,                                               // maximum allowed file size (in MB)
            totalMaxSize: 1000,                                            // total maximum allowed size of all files
            reloadArray: [],                                               // array of files to be reloade at plugin startup

            onload: function() {},                                         // callback on plugin initialization
            onfileloadStart: function() {},                                // callback on file reader start
            onfileloadEnd: function() {},                                  // callback on file reader end
            onfileDelete: function() {},                                   // callback on file delete

            langs: {
                "en": {
                    intro_msg: "(Add attachments...)",
                    dropZone_msg: "Drop your files here",
                    maxSizeExceeded_msg: "File too large",
                    totalMaxSizeExceeded_msg: "Total size exceeded",
                    name_placeHolder: "name"
                },
                "it": {
                    intro_msg: "(Aggiungi documenti allegati...)",
                    dropZone_msg: "Trascina qui i tuoi files...",
                    maxSizeExceeded_msg: "File troppo grande",
                    totalMaxSizeExceeded_msg: "Dimensione max. superata",
                    name_placeHolder: "nome"
                }
            }
        };

        // extend options with instance ones
        this._options = $.extend(true, {}, this._defaults, options);

        // add more options
        this.options = function(options) {
            return (options) ? $.extend(true, this._options, options) : this._options;
        };

        // return data
        this.get = function(parameter) {
            var self = this;

            switch (parameter) {
                case "currentTotalSize":
                return Math.round(currentTotalSize * 100) / 100;

                case "currentAvailableSize":
                return Math.round((self._options.totalMaxSize - currentTotalSize) * 100) / 100;
            }
        };
        
        // debug logs function
        this._logger = function(message, level, data) {
            if (this._options.debug) {
                if (level) {
                    for (var i = 0; i < level; i++) {
                        message = '\u27A1 ' + message;
                    }
                }
                if (this._options.name) {
                    message = "[" + this._options.pluginName + " - " + this._options.name + "] " + message; 
                }

                if (data) {
                    console.log("%c " + message, this._options.debugLogStyle, data);
                }
                else {
                    console.log("%c " + message, this._options.debugLogStyle);
                }
            }
        };

        // file type identificator
        this._fileType = function(fileName) {
            var ext = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length);
            var icons = ['pdf', 'jpg', 'png'];

            if (icons.indexOf(ext) >= 0) {
                return ext;
            }
            else {
                return 'unknown-file';
            }
        };

        // method for deleting a reader's result from result container
        this._fileDelete = function(event) {
            var element = event.data.element;
            var index = $(event.target).data('delete');
            var id = $(event.target).data('id');

            // remove file block
            if (self._options.useFileIcons) {
                element.prev('img').remove();
            }
            element.remove();

            // get file size
            var fileSize = $resultContainer.find('input[name="' + self._options.resultPrefix + '[' + index + '][' + self._options.resultInputNames[3] + ']"]').val();

            fileSize = Math.round(fileSize *100) / 100;

            currentTotalSize = Math.round((currentTotalSize - fileSize) * 100) / 100;

            var availableSize = self._options.totalMaxSize - currentTotalSize;

            availableSize = Math.round(availableSize * 100) / 100;
            availableLabel.children('span').html(availableSize);
            
            // remove result block
            $resultContainer.children('div[data-index="' + index + '"]').remove();

            if ($('.innerFileThumbs').children().length === 0) $('.filesContainer').addClass('filesContainerEmpty');

            self._logger('Deleted file N: ' + index, 2);

            self._options.onfileDelete(index, currentTotalSize);
        };

        // method to rename file in result container accordingly to modifications by user
        this._fileRename = function(event) {
            var element = event.data.element;
            var $this = $(event.target);
            var ext = element.children('.fileExt').html();
            var text;
            var index = element.data('index');

            if (ext.length > 0) {
                text = $this.val() + '.' + ext;
            }
            else {
                text = $this.val();
            }

            var $input = $resultContainer.find('div[data-index="' + index + '"] input:first');
            $input.val(text);
        };

        this.getData = function() {
            this._logger('RECEIVED SAVE COMMAND:', 0);

            //var $resultContainer = this._options.resultContainer;
            var data = [];

            $.each($resultContainer.children('.' + this._options.resultFileContainerClass), function(index, element) {
                var file = {
                    title: $($(element).children('input')[0]).val(),
                    ext: $($(element).children('input')[1]).val(),
                    value: $($(element).children('input')[2]).val()
                };

                data.push(file);
            });

            this._logger("%O", 0 ,data);

            return data;
        };

        // create container for file uploading elements (icon, progress bar, etc...)
        this._createUploaderContainer = function(index, fileName, fileExt) {
            // create current element's DOM
            var containerStyle = "position: relative;";

            //insert file icon if requested
            if (this._options.useFileIcons) {
                var currentThumb = $('<img src="/images/' + this._fileType(fileExt) + '.png" class="fileThumb" />');
                $fileThumbsContainer.append(currentThumb);
            }

            var container = $('<div class="newElement" data-index="' + parseInt(index) + '" style="' + containerStyle + '"></div');
            $fileThumbsContainer.append(container);
            
            var fileButtonsContainer = $('<div class="fileActions"></div>');
            container.append(fileButtonsContainer);
            // file "see" link
            var seeFileLink = $('<a target="_blank"><div class="fileSee">L</div></a>');
            fileButtonsContainer.append(seeFileLink);

            // delete button
            var deleteBtn = $('<div data-delete="' + parseInt(index) + '" class="fileDelete">X</div>');
            fileButtonsContainer.append(deleteBtn);
            deleteBtn.click({element: container}, this._fileDelete);

            //insert loading bars if requested
            if (this._options.useLoadingBars) {
                var currentLoadBar = $('<div class="loadBar"><div></div></div>');
                container.prepend(currentLoadBar);
            }

            var currentTitle = $('<input placeholder="nome" class="fileTitle"></input>');
            var currentExtension = $('<div class="fileExt"></div>');
            container.prepend(currentExtension);
            container.prepend(currentTitle);

            currentTitle.keyup({element: container}, this._fileRename);

            currentTitle.val(fileName);
            currentExtension.html(fileExt);

            return container;
        };

        this._createResultContainer = function(index, name, type, result, size) {
            var resultElemContainer = $('<div data-index="' + index + '" class="' + self._options.resultFileContainerClass + '"></div>');
            resultElemContainer.append($('<div>File: ' + index + '</div>'));
            resultElemContainer.append($('<input/>').attr({type: 'text', name: self._options.resultPrefix + '[' + index + '][' + self._options.resultInputNames[0] + ']', value: name}));
            resultElemContainer.append($('<input/>').attr({type: 'text', name: self._options.resultPrefix + '[' + index + '][' + self._options.resultInputNames[1] + ']', value: type}));
            resultElemContainer.append($('<input/>').attr({type: 'text', name: self._options.resultPrefix + '[' + index + '][' + self._options.resultInputNames[2] + ']', value: result}));
            resultElemContainer.append($('<input/>').attr({type: 'text', name: self._options.resultPrefix + '[' + index + '][' + self._options.resultInputNames[3] + ']', value: size}));

            $resultContainer.append(resultElemContainer);
        };

        var globalIndex = 0;
        var $resultContainer = $el.find('.' + this._options.resultContainer);
        var $loadBtn = $el.find('.fileLoader');
        var $fileContainer = $el.find('.filesContainer');
        var $fileNameContainer = $el.find('.fileNameContainer');
        var $fileThumbsContainer = $el.find('.innerFileThumbs');
        var dropZone = $el.find('.dropZone')[0];
        var currentLangObj = this._options.langs[this._options.lang];


        // initialization
        if (this._options.name) {
            this._logger("INITIALIZED INSTANCE: " + this._options.name);
        }

        $el.find('.introMsg').html(currentLangObj.intro_msg);
        $(dropZone).html(currentLangObj.dropZone_msg); 
        if (!this._options.debug) {
            $resultContainer.addClass('hide');
        }
        else {
            $('<p class="debugMode">Debug mode: on</p>').insertBefore($resultContainer);
            $('<div class="debug">Uploaded files: <span id="debugUploaded">0</span> | Rejected files: <span id="debugRejected">0</span></div>').insertBefore($resultContainer);
            $('<div class="debug">Current MAX FILE SIZE: ' + this._options.fileMaxSize + ' MB</div>').insertBefore($resultContainer);
            $('<div class="debug">Current MAX TOTAL SIZE: ' + this._options.totalMaxSize + ' MB</div>').insertBefore($resultContainer);
            $('<div class="debug sizeAvailable">Size still available: <span>' + this._options.totalMaxSize + '</span> MB</div>').insertBefore($resultContainer);
        }



        // FILES RELOAD SECTION
        // lookup for previously loaded files placed in the result container directly
        var availableLabel = $el.find(".sizeAvailable");
        var currentTotalSize = 0;

        $.each($resultContainer.children('.' + this._options.resultFileContainerClass), function(index, element) {
            self._logger('found previously uploaded file: index = ' + $(element).data('index'), 2);

            // pay attention to index used on fileData here: index 0 is the title DIV!
            var fileData = $(element).children('input');
            var fileName = $(fileData[0]).val();
            var fileExt = $(fileData[1]).val();
            var fileSize = $(fileData[3]).val();

            fileName = fileName.substr(0, fileName.lastIndexOf('.'));

            loadedFile = self._createUploaderContainer(globalIndex, fileName, fileExt);
            loadedFile.children('.loadBar').children('div').css({width: '100%'});
            loadedFile.addClass(self._options.reloadedFilesClass);

            currentTotalSize = currentTotalSize + parseFloat(fileSize);
            globalIndex++;
        });

        // reload files from provided array
        if (this._options.reloadArray.length > 0) {
            this._options.reloadArray.forEach(function(file, index) {
                // re-create visible elements
                loadedFile = self._createUploaderContainer(index, file.name, file.ext);
                loadedFile.children('.loadBar').children('div').css({width: '100%'});
                loadedFile.addClass(self._options.reloadedFilesClass);

                self._logger('found previously uploaded file: index = ' + index, 2);

                // re-create results
                self._createResultContainer(index, file.name, file.ext, file.data, file.size);

                currentTotalSize = currentTotalSize + parseFloat(file.size);
                globalIndex++;
            });
        }

        currentTotalSize = Math.round(currentTotalSize * 100) / 100;

        this._logger("current total size: " + currentTotalSize);
        availableLabel.children('span').html(this._options.totalMaxSize - currentTotalSize);



        // onload callback
        this._options.onload(this._options, currentTotalSize);

        // files read function
        this._filesRead = function(event) {
            var DOM = event.data.DOM;
            var filesList;

            if (event.target.files) {
                this._logger('files array source: file selector (click event)', 1);
                filesList = event.target.files;
            }
            else {
                this._logger('files array source: dropzone (drag & drop event)', 1);
                filesList = event.dataTransfer.files;
            }
            this._logger("%O", 0, filesList);

            $fileContainer.removeClass('filesContainerEmpty');
            // set selected file's name to fleNameContainer
            $fileNameContainer.html('upload files');

            function readFile(reader, file, index, DOM) {
                var currentElement = DOM.find('.innerFileThumbs').children().filter(function() { 
                    return $(this).data("index") === index ;
                });

                var size = Math.round(file.size / 1000000 * 100) / 100;      // size in MB

                reader.onloadstart = function() {
                    self._options.onfileloadStart(index);
                    self._logger('START read file: ' + index + ', size: ' + size + ' MB', 2);
                };

                reader.onprogress = function(event) {
                    if (event.lengthComputable) {
                        var percentLoaded = Math.round((event.loaded / event.total) * 100);
                        self._logger('File ' + index + ' loaded: ' + percentLoaded, 3);
                        
                        // Increase the progress bar length.
                        if (percentLoaded <= 100) {
                            currentElement.children('.loadBar').children('div').animate({width: '100%'}, 500);
                        }
                    }
                };

                reader.onloadend = function() {
                    var type = file.type;
                    var name = file.name;
                    var result = reader.result;
                    var mimeType = result.substring(0, result.indexOf(';'));

                    // if file has no MIME type, replace with default one
                    if (mimeType === "data:" && self._options.defaultMimeType.length > 0) {
                        result = "data:" + self._options.defaultMimeType + result.substring(result.indexOf(';'), result.length);
                    }

                    if (type === "") type = self._options.defaultMimeType;
                    if (name.indexOf('.') < 0 && self._options.defaultFileExt !== "") name = name + '.' + self._options.defaultFileExt;

                    self._createResultContainer(index, name, type, result, size);

                    //set direct link on file see button
                    currentElement.children('.fileActions').children('a').attr('href', result);
                    self._logger('END read file: ' + index, 4);

                    var totalUploaded = parseInt($('#debugUploaded').html()) + 1;
                    $('#debugUploaded').html(totalUploaded);

                    var resultObject = {
                        name: file.name,
                        type: file.type,
                        data: result,
                        size: size
                    };

                    self._options.onfileloadEnd(index, resultObject, Math.round(currentTotalSize * 100) / 100);
                };

                if ((size <= self._options.fileMaxSize) && ((currentTotalSize + size) <= self._options.totalMaxSize)) {
                    reader.readAsDataURL(file);

                    // update total size
                    currentTotalSize = currentTotalSize + size;
                    var currentAvailableSize = self._options.totalMaxSize - currentTotalSize;
                    availableLabel.children('span').html(Math.round(currentAvailableSize * 100) / 100);
                }
                else {
                    var errorMsg = currentLangObj.totalMaxSizeExceeded_msg;

                    if (size > self._options.fileMaxSize) {
                        errorMsg = currentLangObj.maxSizeExceeded_msg;
                        self._logger("FILE REJECTED: Max size exceeded - max size: " + self._options.fileMaxSize + ' MB - file size: ' + size + ' MB');
                    }
                    else {
                        self._logger("FILE REJECTED: Max total size exceeded - max size: " + self._options.totalMaxSizeExceeded_msg + ' MB - current total size: ' + (currentTotalSize + size) + ' MB');
                    }

                    currentElement.addClass('error');
                    currentElement.children('.loadBar').empty().append('<div class="errorMsg">' + errorMsg + '</div>');

                    setTimeout(function() {
                        currentElement.animate({opacity: 0}, 300, function() {
                            if (self._options.useFileIcons) {
                                $(this).prev('img').remove();
                            }

                            $(this).remove();
                        });
                    }, 2000);

                    var totalRejected = parseInt($('#debugRejected').html()) + 1;
                    $('#debugRejected').html(totalRejected);
                }
            }

            var startIndex = $('#innerFileThumbs').children().last().attr('id');
            if (startIndex !== undefined) startIndex = parseInt(startIndex.substring(startIndex.indexOf('-') + 1, startIndex.length)) + 1;
            else startIndex = 0;

            // create a new div containing thumb, delete button and title field for each target file
            for (var i = 0; i < filesList.length; i++) {
                var file = filesList[i];
                var reader = new FileReader();

                var fileName, fileExt;
                if (file.name.lastIndexOf('.') > 0) {
                    fileName = file.name.substring(0, file.name.lastIndexOf('.'));
                    fileExt = file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length);
                }
                else {
                    fileName = file.name;
                    fileExt = this._options.defaultFileExt;
                }
                
                this._createUploaderContainer(globalIndex, fileName, fileExt);
                // now read!
                readFile(reader, file, globalIndex, DOM);
                globalIndex++;
            }
        };

        // Drag events
        function handleDragOver(event) {
            event.stopPropagation();
            event.preventDefault();
            event.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
        }
        function handleDrop(event) {
            event.stopPropagation();
            event.preventDefault();
            event.data = {
                DOM: $el
            };
            self._filesRead(event);
        }

        dropZone.addEventListener('dragover', handleDragOver, false);
        dropZone.addEventListener('drop', (function(passedInElement) {
            return function(e) {handleDrop(e, passedInElement); };
        }) (this), false);

        $(dropZone).click(function(event) {
            $loadBtn.trigger('click');
        });

        // fileUploader events
        $loadBtn.click({DOM: $el}, function(event) {
            var elements = event.data.DOM.find('.innerFileThumbs').children();

            //avoid loading twice the same file
            if (elements.length === 0) {
                this.value = null;
            }
        });
        $loadBtn.change({DOM: $el}, function(event) {
            self._filesRead(event);
        });

    };

    $.fn.fileUploader = function(methodOrOptions) {

        var method = (typeof methodOrOptions === 'string') ? methodOrOptions : undefined;

        function getFileUploader() {
            var $el          = $(this);
            var fileUploader = $el.data('fileUploader');

            fileUploaders.push(fileUploader);
        }

        function applyMethod(index) {
            var fileUploader = fileUploaders[index];

            if (!fileUploader) {
                console.warn('$.fileUploader not instantiated yet');
                console.info(this);
                results.push(undefined);
                return;
            }

            if (typeof fileUploader[method] === 'function') {
                var result = fileUploader[method].apply(fileUploader, args);
                results.push(result);
            } else {
                console.warn('Method \'' + method + '\' not defined in $.fileUploader');
            }
        }

        function init() {
            var $el          = $(this);
            var fileUploader = new FileUploader($el, options);

            $el.data('fileUploader', fileUploader);
        }

        if (method) {
            var fileUploaders = [];

            this.each(getFileUploader);

            var args    = (arguments.length > 1) ? Array.prototype.slice.call(arguments, 1) : undefined;
            var results = [];

            this.each(applyMethod);

            return (results.length > 1) ? results : results[0];
        } else {
            var options = (typeof methodOrOptions === 'object') ? methodOrOptions : undefined;

            return this.each(init);
        }

    };

})(jQuery);