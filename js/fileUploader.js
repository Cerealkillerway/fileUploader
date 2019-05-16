import deepMerge from 'deepmerge';


/*
* fileUploader v4.0.0
* Licensed under MIT (https://raw.githubusercontent.com/Cerealkillerway/fileUploader/master/license.txt)
*/
(function(context) {
    context.FileUploader = function($el, options) {
        let instance = this;

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


        // UTILITIES
        const addMultipleListeners = function (element, events, handler) {
            if (!(events instanceof Array)) {
                this._logger('addMultipleListeners requires events to be an array');
            }
            for (const event of events) {
                element.addEventListener(event, handler);
            }
        }

        const getPreviousSibling = function(element, selector) {
            let sibling = element.previousElementSibling;

            if (!selector) return sibling;

            while (sibling) {
                if (sibling.matches(selector)) {
                    return sibling;
                }
                sibling = sibling.previousElementSibling;
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
        this._fileDelete = (event, data) => {
            let element = data.element;
            let index = event.target.dataset.delete;

            if (!index) {
                index = event.target.closest('div[data-delete]').dataset.delete;
            }

            // remove file block
            if (this._options.useFileIcons) {
                getPreviousSibling(element, 'img').remove();
            }
            element.remove();

            // get file size
            let fileSize = $resultContainer.querySelector(`input[name="${this._options.resultPrefix}[${index}][${this._options.resultInputNames[3]}]"]`).value;

            fileSize = this._round(fileSize);
            currentTotalSize = this._round(currentTotalSize - fileSize);

            let availableSize = this._options.totalMaxSize - currentTotalSize;

            availableSize = this._round(availableSize);
            availableLabel.querySelector(':scope > span').innerHTML = availableSize;

            // remove result block
            $resultContainer.querySelector(`:scope > div[data-index="${index}"]`).remove();

            if (document.querySelector('.innerFileThumbs').children.length === 0) {
                document.querySelector('.filesContainer').classList.add('filesContainerEmpty');
            }

            this._logger('Deleted file N: ' + index, 2);
            this._options.onfileDelete(index, currentTotalSize);
        };


        // method to rename file in result container accordingly to modifications by user
        this._fileRename = (event) => {
            let element = event.data.element;
            let $this = event.target;
            let ext = element.querySelector(':scope > .fileExt').innerHTML;
            let text = $this.value;
            let index = element.dataset.index;
            let $input = $resultContainer.querySelector(`div[data-index="${index}"] input`);
            let nameTest = this._options.filenameTest(text, ext, $fileThumbsContainer);

            if (nameTest === false) {
                event.preventDefault();
                return false;
            }
            if (nameTest !== undefined && nameTest !== true) {
                text = nameTest;
                $this.value = text;

                // update input
                /*if (ext.length > 0) {
                    text = `${text}.${ext}`;
                }*/

                $input.value = text;
                // restore selection range
                $this.setSelectionRange(event.data.start, event.data.stop);
            }
        };


        this.getData = () => {
            let data = [];

            this._logger('RECEIVED SAVE COMMAND:', 0);

            for (const element of $resultContainer.querySelectorAll(`:scope > .${this._options.resultFileContainerClass}`)) {
                let inputs = element.querySelectorAll(':scope > input');
                let file = {
                    title: inputs[0].value,
                    ext: inputs[1].value,
                    value: inputs[2].value
                };

                data.push(file);
            }

            this._logger('%O', 0 ,data);
            return data;
        };


        // create container for file uploading elements (icon, progress bar, etc...)
        this._createUploaderContainer = (index, fileName, fileExt) => {
            //insert file icon if requested
            if (this._options.useFileIcons) {
                let currentThumb = `<img src="/images/${this._fileType(fileExt)}.png" class="fileThumb" />`;
                $fileThumbsContainer.insertAdjacentHTML('beforeend', currentThumb);
            }

            let container = document.createElement('div');
            container.className = 'newElement';
            container.dataset.index = parseInt(index);
            container.style.position = 'relative';
            $fileThumbsContainer.appendChild(container);

            let fileButtonsContainer = document.createElement('div');
            fileButtonsContainer.className = 'fileActions';
            container.appendChild(fileButtonsContainer);

            // file "see" link
            let seeFileLink = `<a target="_blank"><div class="fileSee">${this._options.linkButtonContent}</div></a>`;
            fileButtonsContainer.insertAdjacentHTML('beforeend', seeFileLink);

            // delete button
            let deleteBtn = document.createElement('div');
            deleteBtn.className = 'fileDelete';
            deleteBtn.dataset.delete = parseInt(index);
            deleteBtn.innerHTML = this._options.deleteButtonContent;
            fileButtonsContainer.append(deleteBtn);
            deleteBtn.addEventListener('click', (event) => {
                this._fileDelete(event, {element: container});
            });

            //insert loading bars if requested
            if (this._options.useLoadingBars) {
                let classes = this._options.loadingBarsClasses;

                if (classes.length > 0) {
                    classes = classes.join(' ');
                }

                let currentLoadBar = document.createElement('div');
                currentLoadBar.className = `loadBar ${classes}`;
                currentLoadBar.appendChild(document.createElement('div'));
                container.prepend(currentLoadBar);
            }

            let currentTitle = document.createElement('input');

            // TODO translate placeholder
            currentTitle.setAttribute('placeholder', 'nome');
            currentTitle.className = 'fileTitle';

            let currentExtension = document.createElement('div');

            currentExtension.className = 'fileExt';
            container.prepend(currentExtension);
            container.prepend(currentTitle);

            addMultipleListeners(currentTitle, ['keypress', 'keyup', 'paste'], function(event) {
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


        this._createResultContainer = (fileData) => {
            let index = fileData.index;
            let resultElemContainer = document.createElement('div');

            resultElemContainer.className = this._options.resultFileContainerClass;
            resultElemContainer.dataset.index = index;
            resultElemContainer.insertAdjacentHTML('beforeend', `<div>File: ${index}</div>`);
            resultElemContainer.insertAdjacentHTML('beforeend', `<input type="text" name="${this._options.resultPrefix}[${index}][${this._options.resultInputNames[0]}]" value="${fileData.name}" />`);
            resultElemContainer.insertAdjacentHTML('beforeend', `<input type="text" name="${this._options.resultPrefix}[${index}][${this._options.resultInputNames[1]}]" value="${fileData.type}" />`);
            resultElemContainer.insertAdjacentHTML('beforeend', `<input type="text" name="${this._options.resultPrefix}[${index}][${this._options.resultInputNames[2]}]" value="${fileData.result}" />`);
            resultElemContainer.insertAdjacentHTML('beforeend', `<input type="text" name="${this._options.resultPrefix}[${index}][${this._options.resultInputNames[3]}]" value="${fileData.size}" />`);
            $resultContainer.appendChild(resultElemContainer);
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

            let startIndex = $('#innerFileThumbs').children().last().attr('id');

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
                let file = filesList[i];
                let reader = new FileReader();

                // test for duplicates
                if (approvedList && approvedList.indexOf(file.name) < 0) {
                    if (this._options.duplicatesWarning) {
                        let $info = $('<div class="errorLabel center"></div>');

                        $info.html(currentLangObj.duplicated_msg);
                        $fileThumbsContainer.append($info);
                        appendMessage($info);
                    }

                    this._logger('File duplicated: ' + file.name + ' -> skipping...', 2);
                    continue;
                }

                let fileName, fileExt;

                if (file.name.lastIndexOf('.') > 0) {
                    fileName = file.name.substring(0, file.name.lastIndexOf('.'));
                    fileExt = file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length);
                }
                else {
                    fileName = file.name;
                    fileExt = this._options.defaultFileExt;
                }

                // test for filenames
                let nameTest = this._options.filenameTest(fileName, fileExt, $fileThumbsContainer);
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
        let template = this._options.HTMLTemplate();

        $el.insertAdjacentHTML('beforeend', template);

        let globalIndex = 0;
        let $resultContainer = $el.querySelector('.' + this._options.resultContainerClass);
        let $loadBtn = $el.querySelector('.fileLoader');
        let $fileContainer = $el.querySelector('.filesContainer');
        let $fileNameContainer = $el.querySelector('.fileNameContainer');
        let $fileThumbsContainer = $el.querySelector('.innerFileThumbs');
        let dropZone = $el.querySelector('.dropZone');
        let currentLangObj = this._options.langs[this._options.lang];

        // place reloaded files' HTML in result container directly (if provided)
        if (this._options.reloadHTML) {
            $resultContainer.innerHTML = this._options.reloadHTML;
        }


        $el.querySelector('.introMsg').innerHTML = currentLangObj.intro_msg;
        dropZone.innerHTML = currentLangObj.dropZone_msg;

        if (!this._options.debug) {
            $resultContainer.classList.add('hide');
        }
        else {
            $resultContainer.insertAdjacentHTML('beforebegin', '<p class="debugMode">Debug mode: on</p>');
            $resultContainer.insertAdjacentHTML('beforebegin', '<div class="debug">Uploaded files: <span id="debugUploaded">0</span> | Rejected files: <span id="debugRejected">0</span></div>');
            $resultContainer.insertAdjacentHTML('beforebegin', '<div class="debug">Current MAX FILE SIZE: ' + this._options.fileMaxSize + ' MB</div>');
            $resultContainer.insertAdjacentHTML('beforebegin', '<div class="debug">Current MAX TOTAL SIZE: ' + this._options.totalMaxSize + ' MB</div>');
            $resultContainer.insertAdjacentHTML('beforebegin', '<div class="debug sizeAvailable">Size still available: <span>' + this._options.totalMaxSize + '</span> MB</div>');
        }

        // --- FILES RELOAD SECTION ---
        // lookup for previously loaded files placed in the result container directly
        let availableLabel = $el.querySelector('.sizeAvailable');
        let currentTotalSize = 0;
        let loadedFile;

        for (const [index, element] of $resultContainer.querySelectorAll(`:scope > .${this._options.resultFileContainerClass}`).entries()) {
            this._logger(`found previously uploaded file: index = ${element.dataset.index}`, 2);

            // pay attention to index used on fileData here: index 0 is the title DIV!
            let fileData = element.querySelectorAll(':scope > input');
            let fileName = fileData[0].value;
            let fileExt = fileData[1].value;
            let fileSize = fileData[3].value;

            if (fileName.lastIndexOf('.') > 0) {
                fileName = fileName.substr(0, fileName.lastIndexOf('.'));
            }

            loadedFile = this._createUploaderContainer(globalIndex, fileName, fileExt);
            loadedFile.querySelector(':scope > .loadBar > div').style.width = '100%';
            loadedFile.classList.add(this._options.reloadedFilesClass);

            currentTotalSize = currentTotalSize + parseFloat(fileSize);
            globalIndex++;
        }

        // reload files from provided array
        if (this._options.reloadArray.length > 0) {
            this._options.reloadArray.forEach((file, index) => {
                // re-create visible elements
                loadedFile = this._createUploaderContainer(index, file.name, file.ext);
                loadedFile.querySelector(':scope > .loadBar > div').style.width = '100%';
                loadedFile.classList.add(this._options.reloadedFilesClass);

                this._logger('found previously uploaded file: index = ' + index, 2);

                // re-create results
                let newFile = {
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
        availableLabel.querySelector(':scope > span').innerHTML = (this._options.totalMaxSize - currentTotalSize);
        // --- END FILES RELOAD SECTION ---

        // onload callback
        this._options.onload(this._options, currentTotalSize);

        // Drag events
        this.handleDragOver = (event) => {
            dropZone.classList.add('highlight');
            event.stopPropagation();
            event.preventDefault();
            event.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
        }
        this.handleDrop = (event) => {
            dropZone.classList.remove('highlight');
            event.stopPropagation();
            event.preventDefault();
            event.data = {
                DOM: $el
            };
            this._filesRead(event);
        }

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('highlight');
        });
        dropZone.addEventListener('dragover', this.handleDragOver, false);
        dropZone.addEventListener('drop', (passedInElement) => {
            return (event) => {
                this.handleDrop(event, passedInElement);
            };
        }, false);

        dropZone.addEventListener('click', (event) => {
            $loadBtn.dispatchEvent(event);
        });

        $loadBtn.addEventListener('change', (event) => {
            event.data = {
                DOM: $el
            };
            this._filesRead(event);
            this.value = null;
        });

        return {
            fileUploader: instance,
            elementDOM: $el
        };
    };

    /*const fileUploader = function(methodOrOptions) {
        console.log('constructor');
        let method = (typeof methodOrOptions === 'string') ? methodOrOptions : undefined;

        const getFileUploader = () => {
            let $el          = $(this);
            let fileUploader = $el.data('fileUploader');

            fileUploaders.push(fileUploader);
        }

        const applyMethod = (index) => {
            let fileUploader = fileUploaders[index];

            if (!fileUploader) {
                console.warn('$.fileUploader not instantiated yet');
                console.info(this);
                results.push(undefined);
                return;
            }

            if (typeof fileUploader[method] === 'function') {
                let result = fileUploader[method].apply(fileUploader, args);
                results.push(result);
            } else {
                console.warn('Method \'' + method + '\' not defined in $.fileUploader');
            }
        }

        const init = () => {
            let $el          = $(this);
            let fileUploader = new FileUploader($el, options);

            $el.data('fileUploader', fileUploader);
        }

        if (method) {
            let fileUploaders = [];

            this.each(getFileUploader);

            let args = (arguments.length > 1) ? Array.prototype.slice.call(arguments, 1) : undefined;
            let results = [];

            this.each(applyMethod);

            return (results.length > 1) ? results : results[0];
        }
        else {
            let options = (typeof methodOrOptions === 'object') ? methodOrOptions : undefined;

            return this.each(init);
        }
    };*/
})(window);
