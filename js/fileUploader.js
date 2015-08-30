/*
* fileUploader v3.7.1
* Licensed under MIT (https://raw.githubusercontent.com/Cerealkillerway/fileUploader/master/license.txt)
*/
(function($) {
    var FileUploader = function($el, options) {
        var self = this;

        // default options
        this._defaults = {
            lang: 'en',
            useFileIcons: true,

            debug: false,                                                  // activate console logs for debug
            debugLogStyle: 'color: #9900ff',                               // css style for debug console logs in js console
            name: undefined,                                               // a name for plugin's instance (useful for debug purposes)
            pluginName: 'FileUploader',                                    // plugin's name (used in debug logs alongside with name)

            useLoadingBars: true,                                          // insert loading bar for files
            loadingBarsClasses: [],                                        // array of strings for classnames for loading bars
            reloadedFilesClass: 'reloadedElement',                         // class for previously uploaded files
            resultContainerClass: 'result',                                // result container's class (where to place result files data)
            resultFileContainerClass: 'uploadedFile',                      // class for every file result container span
            resultPrefix: 'fileUploader',                                  // prefix for inputs in the file result container
            resultInputNames: ['title', 'extension', 'value', 'size'],     // name suffix to be used for result inputs
            defaultFileExt: '',                                            // extension to use for files with no extension
            defaultMimeType: '',                                           // MIME type to use for files with no extension 
            fileMaxSize: 50,                                               // maximum allowed file size (in MB)
            totalMaxSize: 1000,                                            // total maximum allowed size of all files
            reloadArray: [],                                               // array of files to be reloaded at plugin startup
            reloadHTML: undefined,                                         // HTML for reloaded files to place directly in result container
            linkButtonContent: 'L',                                        // HTML content for link button
            deleteButtonContent: 'X',                                      // HTML content for delete button
            allowDuplicates: false,                                        // allow upload duplicates
            duplicatesWarning: false,                                      // show a message in the loading area when trying to load a duplicated file

            HTMLTemplate: function() {
                return [
                    '<p class="introMsg"></p>',
                    '<div>',
                    '    <div class="inputContainer">',
                    '        <input class="fileLoader" type="file" multiple />',
                    '    </div>',
                    '    <div class="dropZone"></div>',
                    '    <div class="filesContainer filesContainerEmpty">',
                    '        <div class="innerFileThumbs"></div>',
                    '        <div style="clear:both;"></div>',
                    '    </div>',
                    '</div>',
                    '<div class="result"></div>'
                ].join("\n");
            },

            onload: function() {},                                         // callback on plugin initialization
            onfileloadStart: function() {},                                // callback on file reader start
            onfileloadEnd: function() {},                                  // callback on file reader end
            onfileDelete: function() {},                                   // callback on file delete
            filenameTest: function() {},                                   // callback for testing filenames

            langs: {
                'en': {
                    intro_msg: '(Add attachments...)',
                    dropZone_msg: 'Drop your files here',
                    maxSizeExceeded_msg: 'File too large',
                    totalMaxSizeExceeded_msg: 'Total size exceeded',
                    duplicated_msg: 'File duplicated (skipped)',
                    name_placeHolder: 'name',
                }                
            }
        };

        // extend options with instance ones
        this._options = $.extend(true, {}, this._defaults, options);

        // add more options
        this.options = function(options) {
            return (options) ? $.extend(true, this._options, options) : this._options;
        };

        // round number
        this._round = function(value) {
            return Math.round(value * 100) / 100;
        };

        // return data
        this.get = function(parameter) {
            var self = this;

            switch (parameter) {
                case 'currentTotalSize':
                return self._round(currentTotalSize);

                case 'currentAvailableSize':
                return self._round(self._options.totalMaxSize - currentTotalSize);
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
                    message = '[' + this._options.pluginName + ' - ' + this._options.name + '] ' + message; 
                }

                if (data) {
                    console.log('%c ' + message, this._options.debugLogStyle, data);
                }
                else {
                    console.log('%c ' + message, this._options.debugLogStyle);
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

            if (!index) {
                index = $(event.target).closest('div[data-delete]').data('delete');
            }

            // remove file block
            if (self._options.useFileIcons) {
                element.prev('img').remove();
            }
            element.remove();

            // get file size
            var fileSize = $resultContainer.find('input[name="' + self._options.resultPrefix + '[' + index + '][' + self._options.resultInputNames[3] + ']"]').val();

            fileSize = self._round(fileSize);

            currentTotalSize = self._round(currentTotalSize - fileSize);

            var availableSize = self._options.totalMaxSize - currentTotalSize;

            availableSize = self._round(availableSize);
            availableLabel.children('span').html(availableSize);
            
            // remove result block
            $resultContainer.children('div[data-index="' + index + '"]').remove();

            if ($('.innerFileThumbs').children().length === 0) {
                $('.filesContainer').addClass('filesContainerEmpty');
            }

            self._logger('Deleted file N: ' + index, 2);

            self._options.onfileDelete(index, currentTotalSize);
        };

        // method to rename file in result container accordingly to modifications by user
        this._fileRename = function(event) {
            var element = event.data.element;
            var $this = $(event.target);
            var ext = element.children('.fileExt').html();
            var text = $this.val();
            var index = element.data('index');
            var $input = $resultContainer.find('div[data-index="' + index + '"] input:first');
            var nameTest = self._options.filenameTest(text, ext, $fileThumbsContainer);

            if (nameTest === false) {
                event.preventDefault();
                return false;
            }
            if (nameTest !== undefined && nameTest !== true) {

                text = nameTest;
                $this.val(text);

                // update input
                if (ext.length > 0) {
                    text = text + '.' + ext;
                }

                $input.val(text);

                // restore selection range
                $this[0].setSelectionRange(event.data.start, event.data.stop);
            }
        };

        this.getData = function() {
            var data = [];

            this._logger('RECEIVED SAVE COMMAND:', 0);

            $.each($resultContainer.children('.' + this._options.resultFileContainerClass), function(index, element) {
                var file = {
                    title: $($(element).children('input')[0]).val(),
                    ext: $($(element).children('input')[1]).val(),
                    value: $($(element).children('input')[2]).val()
                };

                data.push(file);
            });

            this._logger('%O', 0 ,data);
            return data;
        };

        // create container for file uploading elements (icon, progress bar, etc...)
        this._createUploaderContainer = function(index, fileName, fileExt) {
            // create current element's DOM
            var containerStyle = 'position: relative;';

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
            var seeFileLink = $('<a target="_blank"><div class="fileSee">' + self._options.linkButtonContent + '</div></a>');
            fileButtonsContainer.append(seeFileLink);

            // delete button
            var deleteBtn = $('<div data-delete="' + parseInt(index) + '" class="fileDelete">' + self._options.deleteButtonContent + '</div>');
            fileButtonsContainer.append(deleteBtn);
            deleteBtn.click({element: container}, this._fileDelete);

            //insert loading bars if requested
            if (this._options.useLoadingBars) {
                var classes = self._options.loadingBarsClasses;

                if (classes.length > 0) {
                    classes = classes.join(' ');
                }

                var currentLoadBar = $('<div class="loadBar ' + classes + '"><div></div></div>');
                container.prepend(currentLoadBar);
            }

            var currentTitle = $('<input placeholder="nome" class="fileTitle"></input>');
            var currentExtension = $('<div class="fileExt"></div>');

            container.prepend(currentExtension);
            container.prepend(currentTitle);

            //currentTitle.keypress({element: container}, this._fileRename);
            currentTitle.on('keypress keyup paste', function(event) {
                event.data = {};
                event.data.element = container;
                event.data.start = this.selectionStart;
                event.data.stop = this.selectionEnd;
                self._fileRename(event);
            });

            currentTitle.val(fileName);
            currentExtension.html(fileExt);

            return container;
        };

        this._createResultContainer = function(fileData) {
            var index = fileData.index;
            var resultElemContainer = $('<div data-index="' + index + '" class="' + self._options.resultFileContainerClass + '"></div>');

            resultElemContainer.append($('<div>File: ' + index + '</div>'));
            resultElemContainer.append($('<input/>').attr({type: 'text', name: self._options.resultPrefix + '[' + index + '][' + self._options.resultInputNames[0] + ']', value: fileData.name}));
            resultElemContainer.append($('<input/>').attr({type: 'text', name: self._options.resultPrefix + '[' + index + '][' + self._options.resultInputNames[1] + ']', value: fileData.type}));
            resultElemContainer.append($('<input/>').attr({type: 'text', name: self._options.resultPrefix + '[' + index + '][' + self._options.resultInputNames[2] + ']', value: fileData.result}));
            resultElemContainer.append($('<input/>').attr({type: 'text', name: self._options.resultPrefix + '[' + index + '][' + self._options.resultInputNames[3] + ']', value: fileData.size}));

            $resultContainer.append(resultElemContainer);
        };

        // files read function
        this._filesRead = function(event) {
            var DOM = event.data.DOM;
            var filesList;
            var approvedList = false;
            var i = 0;

            if (event.target.files) {
                this._logger('files array source: file selector (click event)', 1);
                filesList = event.target.files;
            }
            else {
                this._logger('files array source: dropzone (drag & drop event)', 1);
                filesList = event.dataTransfer.files;
            }
            this._logger('%O', 0, filesList);

            // build approved list
            if (!self._options.allowDuplicates) {
                var loadedFiles = [];
                var newFiles = [];

                approvedList = [];

                // build already loaded files list
                $.each($resultContainer.children(), function(index, file) {
                    loadedFiles.push($(file).children('input').first().val());
                });

                // build current selected files list
                for (i = 0; i < filesList.length; i++) {
                    newFiles.push(filesList[i].name);
                }

                // avoid load twice the same file
                newFiles.forEach(function(newFile) {
                    var fileIndex = loadedFiles.indexOf(newFile);

                    if (fileIndex < 0) {
                        approvedList.push(newFile);
                    }
                });
            }

            $fileContainer.removeClass('filesContainerEmpty');
            // set selected file's name to fleNameContainer
            $fileNameContainer.html('upload files');

            function readFile(reader, file, index, DOM) {
                var currentElement = DOM.find('.innerFileThumbs').children().filter(function() { 
                    return $(this).data('index') === index ;
                });

                var size = self._round(file.size / 1000000);      // size in MB

                reader.onloadstart = function() {
                    self._options.onfileloadStart(index);
                    self._logger('START read file: ' + index + ', size: ' + size + ' MB', 2);
                };

                reader.onprogress = function(event) {
                    if (event.lengthComputable) {
                        var percentLoaded = self._round((event.loaded / event.total) * 100);
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

                    if (type === "") {
                        type = self._options.defaultMimeType;
                    }
                    if (name.indexOf('.') < 0 && self._options.defaultFileExt !== "") {
                        name = name + '.' + self._options.defaultFileExt;
                    }

                    var newFile = {
                        index: index,
                        name: name,
                        type: type,
                        result: result,
                        size: size
                    };

                    self._createResultContainer(newFile);

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

                    self._options.onfileloadEnd(index, resultObject, self._round(currentTotalSize));
                };

                if ((size <= self._options.fileMaxSize) && ((currentTotalSize + size) <= self._options.totalMaxSize)) {
                    reader.readAsDataURL(file);

                    // update total size
                    currentTotalSize = currentTotalSize + size;

                    var currentAvailableSize = self._options.totalMaxSize - currentTotalSize;

                    availableLabel.children('span').html(self._round(currentAvailableSize));
                }
                else {
                    var errorMsg = currentLangObj.totalMaxSizeExceeded_msg;

                    if (size > self._options.fileMaxSize) {
                        errorMsg = currentLangObj.maxSizeExceeded_msg;
                        self._logger('FILE REJECTED: Max size exceeded - max size: ' + self._options.fileMaxSize + ' MB - file size: ' + size + ' MB');
                    }
                    else {
                        self._logger('FILE REJECTED: Max total size exceeded - max size: ' + self._options.totalMaxSizeExceeded_msg + ' MB - current total size: ' + (currentTotalSize + size) + ' MB');
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

            if (startIndex !== undefined) {
                startIndex = parseInt(startIndex.substring(startIndex.indexOf('-') + 1, startIndex.length)) + 1;
            }
            else {
                startIndex = 0;
            }

            function appendMessage($message) {
                setTimeout(function() {
                    $message.animate({opacity: 0}, 300, function() {
                        $(this).remove();
                    });
                }, 2000);
            }

            // create a new div containing thumb, delete button and title field for each target file
            for (i = 0; i < filesList.length; i++) {
                var file = filesList[i];
                var reader = new FileReader();

                // test for duplicates
                if (approvedList && approvedList.indexOf(file.name) < 0) {
                    if (self._options.duplicatesWarning) {
                        var $info = $('<div class="errorLabel center"></div>');

                        $info.html(currentLangObj.duplicated_msg);
                        $fileThumbsContainer.append($info);
                        appendMessage($info);                        
                    }

                    this._logger('File duplicated: ' + file.name + ' -> skipping...', 2);
                    continue;
                }

                var fileName, fileExt;
                if (file.name.lastIndexOf('.') > 0) {
                    fileName = file.name.substring(0, file.name.lastIndexOf('.'));
                    fileExt = file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length);
                }
                else {
                    fileName = file.name;
                    fileExt = this._options.defaultFileExt;
                }

                // test for filenames
                var nameTest = this._options.filenameTest(fileName, fileExt, $fileThumbsContainer);
                if (nameTest === false) {
                    this._logger('Invalid file name: ' + file.name, 2);
                    continue;
                }
                else {
                    if (nameTest !== undefined && nameTest !== true) {
                        fileName = nameTest;
                    }
                }
                
                this._createUploaderContainer(globalIndex, fileName, fileExt);

                // now read!
                readFile(reader, file, globalIndex, DOM);
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
        }
        // build HTML template
        var template = $(this._options.HTMLTemplate());

        $el.append(template);

        var globalIndex = 0;
        var $resultContainer = $el.find('.' + this._options.resultContainerClass);
        var $loadBtn = $el.find('.fileLoader');
        var $fileContainer = $el.find('.filesContainer');
        var $fileNameContainer = $el.find('.fileNameContainer');
        var $fileThumbsContainer = $el.find('.innerFileThumbs');
        var dropZone = $el.find('.dropZone')[0];
        var currentLangObj = this._options.langs[this._options.lang];

        // place reloaded files' HTML in result container directly (if provided)
        if (this._options.reloadHTML) {
            $resultContainer.html(this._options.reloadHTML);
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

        // --- FILES RELOAD SECTION ---
        // lookup for previously loaded files placed in the result container directly
        var availableLabel = $el.find('.sizeAvailable');
        var currentTotalSize = 0;
        var loadedFile;

        $.each($resultContainer.children('.' + this._options.resultFileContainerClass), function(index, element) {
            self._logger('found previously uploaded file: index = ' + $(element).data('index'), 2);

            // pay attention to index used on fileData here: index 0 is the title DIV!
            var fileData = $(element).children('input');
            var fileName = $(fileData[0]).val();
            var fileExt = $(fileData[1]).val();
            var fileSize = $(fileData[3]).val();

            if (fileName.lastIndexOf('.') > 0) {
                fileName = fileName.substr(0, fileName.lastIndexOf('.'));
            }

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
                var newFile = {
                    index: index,
                    name: file.name,
                    type: file.ext,
                    result: file.data,
                    size: file.size
                };

                self._createResultContainer(newFile);

                currentTotalSize = currentTotalSize + parseFloat(file.size);
                globalIndex++;
            });
        }

        currentTotalSize = self._round(currentTotalSize);

        this._logger('current total size: ' + currentTotalSize);
        availableLabel.children('span').html(this._options.totalMaxSize - currentTotalSize);
        // --- END FILES RELOAD SECTION ---

        // onload callback
        this._options.onload(this._options, currentTotalSize);

        // Drag events
        function handleDragOver(event) {
            $(dropZone).addClass('highlight');
            event.stopPropagation();
            event.preventDefault();
            event.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
        }
        function handleDrop(event) {
            $(dropZone).removeClass('highlight');
            event.stopPropagation();
            event.preventDefault();
            event.data = {
                DOM: $el
            };
            self._filesRead(event);
        }

        dropZone.addEventListener('dragleave', function() {
            $(dropZone).removeClass('highlight');
        });
        dropZone.addEventListener('dragover', handleDragOver, false);
        dropZone.addEventListener('drop', (function(passedInElement) {
            return function(e) {
                handleDrop(e, passedInElement);
            };
        }) (this), false);

        $(dropZone).click(function() {
            $loadBtn.trigger('click');
        });

        // fileUploader events
        $loadBtn.change({DOM: $el}, function(event) {
            self._filesRead(event);
            this.value = null;
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
