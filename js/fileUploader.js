import deepMerge from 'deepmerge';


/*
* fileUploader v4.0.0
* Licensed under MIT (https://raw.githubusercontent.com/Cerealkillerway/fileUploader/master/license.txt)
*/
(function(context) {
    context.FileUploader = function($el, options) {
        let instance = this;
        console.log(instance);

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

            HTMLTemplate: () => {
                return `<p class="introMsg"></p>
                    <div>
                        <div class="inputContainer">
                            <input class="fileLoader" type="file" multiple />
                        </div>
                        <div class="dropZone"></div>
                        <div class="filesContainer filesContainerEmpty">
                            <div class="innerFileThumbs"></div>
                            <div style="clear:both;"></div>
                        </div>
                    </div>
                    <div class="result"></div>`
            },

            onload: () => {},                                         // callback on plugin initialization
            onfileloadStart: () => {},                                // callback on file reader start
            onfileloadEnd: () => {},                                  // callback on file reader end
            onfileDelete: () => {},                                   // callback on file delete
            filenameTest: () => {},                                   // callback for testing filenames

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
        this._options = deepMerge(this._defaults, options);

        // add more options
        this.options = (options) => {
            return (options) ? deepMerge(this._options, options) : this._options;
        };

        // round number
        this._round = (value) => {
            return Math.round(value * 100) / 100;
        };

        // return data
        this.get = (parameter) => {
            switch (parameter) {
                case 'currentTotalSize':
                return this._round(currentTotalSize);

                case 'currentAvailableSize':
                return this._round(this._options.totalMaxSize - currentTotalSize);
            }
        };

        // debug logs function
        this._logger = (message, level, data) => {
            if (this._options.debug) {
                if (level) {
                    for (let i = 0; i < level; i++) {
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
        this._fileType = (fileName) => {
            let ext = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length);
            let icons = ['pdf', 'jpg', 'png'];

            if (icons.indexOf(ext) >= 0) {
                return ext;
            }
            else {
                return 'unknown-file';
            }
        };

        // method for deleting a reader's result from result container
        this._fileDelete = (event) => {
            let element = event.data.element;
            let index = event.target.dataset.delete;

            if (!index) {
                index = event.target.closest('div[data-delete]').dataset.delete;
            }

            // remove file block
            if (this._options.useFileIcons) {
                element.prev('img').remove();
            }
            element.remove();

            // get file size
            var fileSize = $resultContainer.find('input[name="' + this._options.resultPrefix + '[' + index + '][' + this._options.resultInputNames[3] + ']"]').val();

            fileSize = this._round(fileSize);

            currentTotalSize = this._round(currentTotalSize - fileSize);

            var availableSize = this._options.totalMaxSize - currentTotalSize;

            availableSize = this._round(availableSize);
            availableLabel.children('span').html(availableSize);

            // remove result block
            $resultContainer.children('div[data-index="' + index + '"]').remove();

            if ($('.innerFileThumbs').children().length === 0) {
                $('.filesContainer').addClass('filesContainerEmpty');
            }

            this._logger('Deleted file N: ' + index, 2);

            this._options.onfileDelete(index, currentTotalSize);
        };

        // method to rename file in result container accordingly to modifications by user
        this._fileRename = (event) => {
            var element = event.data.element;
            var $this = $(event.target);
            var ext = element.children('.fileExt').html();
            var text = $this.val();
            var index = element.data('index');
            var $input = $resultContainer.find('div[data-index="' + index + '"] input:first');
            var nameTest = this._options.filenameTest(text, ext, $fileThumbsContainer);

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

        this.getData = () => {
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
        this._createUploaderContainer = (index, fileName, fileExt) => {
            // create current element's DOM
            let containerStyle = 'position: relative;';

            //insert file icon if requested
            if (this._options.useFileIcons) {
                let currentThumb = $('<img src="/images/' + this._fileType(fileExt) + '.png" class="fileThumb" />');
                $fileThumbsContainer.append(currentThumb);
            }

            let container = $('<div class="newElement" data-index="' + parseInt(index) + '" style="' + containerStyle + '"></div');
            $fileThumbsContainer.append(container);

            let fileButtonsContainer = $('<div class="fileActions"></div>');
            container.append(fileButtonsContainer);

            // file "see" link
            let seeFileLink = $('<a target="_blank"><div class="fileSee">' + this._options.linkButtonContent + '</div></a>');
            fileButtonsContainer.append(seeFileLink);

            // delete button
            let deleteBtn = $('<div data-delete="' + parseInt(index) + '" class="fileDelete">' + this._options.deleteButtonContent + '</div>');
            fileButtonsContainer.append(deleteBtn);
            deleteBtn.click({element: container}, this._fileDelete);

            //insert loading bars if requested
            if (this._options.useLoadingBars) {
                let classes = this._options.loadingBarsClasses;

                if (classes.length > 0) {
                    classes = classes.join(' ');
                }

                let currentLoadBar = $('<div class="loadBar ' + classes + '"><div></div></div>');
                container.prepend(currentLoadBar);
            }

            let currentTitle = $('<input placeholder="nome" class="fileTitle"></input>');
            let currentExtension = $('<div class="fileExt"></div>');

            container.prepend(currentExtension);
            container.prepend(currentTitle);

            //currentTitle.keypress({element: container}, this._fileRename);
            currentTitle.on('keypress keyup paste', function(event) {
                event.data = {};
                event.data.element = container;
                event.data.start = this.selectionStart;
                event.data.stop = this.selectionEnd;
                this._fileRename(event);
            });

            currentTitle.val(fileName);
            currentExtension.html(fileExt);

            return container;
        };

        this._createResultContainer = (fileData) => {
            var index = fileData.index;
            var resultElemContainer = $('<div data-index="' + index + '" class="' + this._options.resultFileContainerClass + '"></div>');

            resultElemContainer.append($('<div>File: ' + index + '</div>'));
            resultElemContainer.append($('<input/>').attr({type: 'text', name: this._options.resultPrefix + '[' + index + '][' + this._options.resultInputNames[0] + ']', value: fileData.name}));
            resultElemContainer.append($('<input/>').attr({type: 'text', name: this._options.resultPrefix + '[' + index + '][' + this._options.resultInputNames[1] + ']', value: fileData.type}));
            resultElemContainer.append($('<input/>').attr({type: 'text', name: this._options.resultPrefix + '[' + index + '][' + this._options.resultInputNames[2] + ']', value: fileData.result}));
            resultElemContainer.append($('<input/>').attr({type: 'text', name: this._options.resultPrefix + '[' + index + '][' + this._options.resultInputNames[3] + ']', value: fileData.size}));

            $resultContainer.append(resultElemContainer);
        };

        // files read function
        this._filesRead = (event) => {
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
            if (!this._options.allowDuplicates) {
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

            let readFile = (reader, file, index, DOM) => {
                var currentElement = DOM.find('.innerFileThumbs').children().filter(function() {
                    return $(this).data('index') === index ;
                });

                var size = this._round(file.size / 1000000);      // size in MB

                reader.onloadstart = () => {
                    this._options.onfileloadStart(index);
                    this._logger('START read file: ' + index + ', size: ' + size + ' MB', 2);
                };

                reader.onprogress = (event) => {
                    if (event.lengthComputable) {
                        var percentLoaded = this._round((event.loaded / event.total) * 100);
                        this._logger('File ' + index + ' loaded: ' + percentLoaded, 3);

                        // Increase the progress bar length.
                        if (percentLoaded <= 100) {
                            currentElement.children('.loadBar').children('div').animate({width: '100%'}, 500);
                        }
                    }
                };

                reader.onloadend = () => {
                    var type = file.type;
                    var name = file.name;
                    var result = reader.result;

                    // reading unsuccessful
                    if (!result) {
                        return false;
                    }

                    var mimeType = result.substring(0, result.indexOf(';'));

                    // if file has no MIME type, replace with default one
                    if (mimeType === "data:" && this._options.defaultMimeType.length > 0) {
                        result = "data:" + this._options.defaultMimeType + result.substring(result.indexOf(';'), result.length);
                    }

                    if (type === "") {
                        type = this._options.defaultMimeType;
                    }
                    if (name.indexOf('.') < 0 && this._options.defaultFileExt !== "") {
                        name = name + '.' + this._options.defaultFileExt;
                    }

                    var newFile = {
                        index: index,
                        name: name,
                        type: type,
                        result: result,
                        size: size
                    };

                    this._createResultContainer(newFile);

                    //set direct link on file see button
                    currentElement.children('.fileActions').children('a').attr('href', result);
                    this._logger('END read file: ' + index, 4);

                    var totalUploaded = parseInt($('#debugUploaded').html()) + 1;

                    $('#debugUploaded').html(totalUploaded);

                    var resultObject = {
                        name: file.name,
                        type: file.type,
                        data: result,
                        size: size
                    };

                    this._options.onfileloadEnd(index, resultObject, this._round(currentTotalSize));
                };

                if ((size <= this._options.fileMaxSize) && ((currentTotalSize + size) <= this._options.totalMaxSize)) {
                    reader.readAsDataURL(file);

                    // update total size
                    currentTotalSize = currentTotalSize + size;

                    var currentAvailableSize = this._options.totalMaxSize - currentTotalSize;

                    availableLabel.children('span').html(this._round(currentAvailableSize));
                }
                else {
                    var errorMsg = currentLangObj.totalMaxSizeExceeded_msg;

                    if (size > this._options.fileMaxSize) {
                        errorMsg = currentLangObj.maxSizeExceeded_msg;
                        this._logger('FILE REJECTED: Max size exceeded - max size: ' + this._options.fileMaxSize + ' MB - file size: ' + size + ' MB');
                    }
                    else {
                        this._logger('FILE REJECTED: Max total size exceeded - max size: ' + this._options.totalMaxSizeExceeded_msg + ' MB - current total size: ' + (currentTotalSize + size) + ' MB');
                    }

                    currentElement.addClass('error');
                    currentElement.children('.loadBar').empty().append('<div class="errorMsg">' + errorMsg + '</div>');

                    setTimeout(() => {
                        currentElement.animate({opacity: 0}, 300, function() {
                            if (instance._options.useFileIcons) {
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
                setTimeout(() => {
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
                    if (this._options.duplicatesWarning) {
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
        let template = $(this._options.HTMLTemplate());

        $el.append(template);

        let globalIndex = 0;
        let $resultContainer = $el.find('.' + this._options.resultContainerClass);
        let $loadBtn = $el.find('.fileLoader');
        let $fileContainer = $el.find('.filesContainer');
        let $fileNameContainer = $el.find('.fileNameContainer');
        let $fileThumbsContainer = $el.find('.innerFileThumbs');
        let dropZone = $el.find('.dropZone')[0];
        let currentLangObj = this._options.langs[this._options.lang];

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

        $.each($resultContainer.children('.' + this._options.resultFileContainerClass), (index, element) => {
            this._logger('found previously uploaded file: index = ' + $(element).data('index'), 2);

            // pay attention to index used on fileData here: index 0 is the title DIV!
            var fileData = $(element).children('input');
            var fileName = $(fileData[0]).val();
            var fileExt = $(fileData[1]).val();
            var fileSize = $(fileData[3]).val();

            if (fileName.lastIndexOf('.') > 0) {
                fileName = fileName.substr(0, fileName.lastIndexOf('.'));
            }

            loadedFile = this._createUploaderContainer(globalIndex, fileName, fileExt);
            loadedFile.children('.loadBar').children('div').css({width: '100%'});
            loadedFile.addClass(this._options.reloadedFilesClass);

            currentTotalSize = currentTotalSize + parseFloat(fileSize);
            globalIndex++;
        });

        // reload files from provided array
        if (this._options.reloadArray.length > 0) {
            this._options.reloadArray.forEach((file, index) => {
                // re-create visible elements
                loadedFile = this._createUploaderContainer(index, file.name, file.ext);
                loadedFile.children('.loadBar').children('div').css({width: '100%'});
                loadedFile.addClass(this._options.reloadedFilesClass);

                this._logger('found previously uploaded file: index = ' + index, 2);

                // re-create results
                var newFile = {
                    index: index,
                    name: file.name,
                    type: file.ext,
                    result: file.data,
                    size: file.size
                };

                this._createResultContainer(newFile);

                currentTotalSize = currentTotalSize + parseFloat(file.size);
                globalIndex++;
            });
        }

        currentTotalSize = this._round(currentTotalSize);

        this._logger('current total size: ' + currentTotalSize);
        availableLabel.children('span').html(this._options.totalMaxSize - currentTotalSize);
        // --- END FILES RELOAD SECTION ---

        // onload callback
        this._options.onload(this._options, currentTotalSize);

        // Drag events
        this.handleDragOver = (event) => {
            $(dropZone).addClass('highlight');
            event.stopPropagation();
            event.preventDefault();
            event.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
        }
        this.handleDrop = (event) => {
            $(dropZone).removeClass('highlight');
            event.stopPropagation();
            event.preventDefault();
            event.data = {
                DOM: $el
            };
            this._filesRead(event);
        }

        dropZone.addEventListener('dragleave', () => {
            $(dropZone).removeClass('highlight');
        });
        dropZone.addEventListener('dragover', this.handleDragOver, false);
        dropZone.addEventListener('drop', ((passedInElement) => {
            return (event) => {
                this.handleDrop(event, passedInElement);
            };
        }) (this), false);

        $(dropZone).click(() => {
            $loadBtn.trigger('click');
        });

        // fileUploader events
        $loadBtn.change({DOM: $el}, (event) => {
            this._filesRead(event);
            this.value = null;
        });

    };

    $.fn.fileUploader = function(methodOrOptions) {
        var method = (typeof methodOrOptions === 'string') ? methodOrOptions : undefined;

        const getFileUploader = () => {
            var $el          = $(this);
            var fileUploader = $el.data('fileUploader');

            fileUploaders.push(fileUploader);
        }

        const applyMethod = (index) => {
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

        const init = () => {
            var $el          = $(this);
            var fileUploader = new FileUploader($el, options);

            $el.data('fileUploader', fileUploader);
        }

        if (method) {
            var fileUploaders = [];

            this.each(getFileUploader);

            var args = (arguments.length > 1) ? Array.prototype.slice.call(arguments, 1) : undefined;
            var results = [];

            this.each(applyMethod);

            return (results.length > 1) ? results : results[0];
        }
        else {
            var options = (typeof methodOrOptions === 'object') ? methodOrOptions : undefined;

            return this.each(init);
        }
    };
})(window);
