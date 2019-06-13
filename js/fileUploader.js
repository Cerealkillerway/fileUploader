import deepMerge from 'deepmerge';
import 'element-qsa-scope';


/*
* fileUploader v5.6.19
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
            maxFileSize: 50,                                               // maximum allowed file size (in MB)
            maxTotalSize: 1000,                                            // total maximum allowed size of all files
            maxNumberOfFiles: false,                                       // maximum number of files allowed to upload
            reloadArray: [],                                               // array of files to be reloaded at plugin startup
            reloadHTML: undefined,                                         // HTML for reloaded files to place directly in result container
            linkButtonContent: 'L',                                        // HTML content for link button
            deleteButtonContent: 'X',                                      // HTML content for delete button
            showErrorOnLoadBar: true,                                      // decides if the reason for a rejected file will be displayed over its load bar;
                                                                           // in case the file is rejected because of more than one reason, only the first one will be displayed on the bar;
            allowDuplicates: false,                                        // allow upload duplicates
            duplicatesWarning: false,                                      // show a message in the loading area when trying to load a duplicated file
            labelsContainers: false,                                       // query selector for the container where to look for labels (ex. '#myId'), (default 'false' -> no labels;
                                                                           // can be a string for a single value, or an array if the plugin has to update labels in many places;
            useSourceFileSize: false,                                      // tells to the plugin to use the original file size in size calculations; by default it will use the size of the
                                                                           // base64 string created by the reader instead (which is bigger);
            mimeTypesToOpen: [                                             // when clicking the "open" button, a file with mimeType in this list will be opened in a new tab of the browser
                'application/pdf',                                         // while others are just downloaded;
                'image/png',
                'image/jpeg'
            ],
            labelsClasses: {                                               // dictionary of classes used by the various labels handled by the plugin
                sizeAvailable: 'sizeAvailable',
                currentSize: 'currentSize',
                currentNumberOfFiles: 'currentNumberOfFiles',
                maxFileSize: 'maxFileSize',
                maxTotalSize: 'maxTotalSize',
                maxNumberOfFiles: 'maxNumberOfFiles',
                numberOfUploadedFiles: 'numberOfUploadedFiles',
                numberOfRejectedFiles: 'numberOfRejectedFiles'
            },

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
                    <div class="result"></div>`;
            },

            onload: () => {},                                             // callback on plugin initialization
            onfileloadStart: () => {},                                    // callback on file reader start
            onfileloadEnd: () => {},                                      // callback on file reader end
            onfileRejected: () => {},                                     // callback on file rejected
            onfileDelete: () => {},                                       // callback on file delete
            filenameTest: () => {},                                       // callback for testing filenames

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
        };


        // UTILITIES
        const addMultipleListeners = function (element, events, handler) {
            if (!(events instanceof Array)) {
                this._logger('addMultipleListeners requires events to be an array');
            }
            for (const event of events) {
                element.addEventListener(event, handler);
            }
        };


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


        let updateLabel = function(type, value) {
            for (let label of instanceLabels[`${type}Labels`]) {
                let labelSpan = label.querySelector(':scope > span');
                let prevValue;

                switch(value) {
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
        };


        // returns the byte length of an utf8 string
        const byteLength = function(utf8String) {
            let size = utf8String.length;

            for (let i = utf8String.length - 1; i >= 0; i--) {
                let code = utf8String.charCodeAt(i);

                if (code > 0x7f && code <= 0x7ff) {
                    size++;
                }
                else {
                    if (code > 0x7ff && code <= 0xffff) {
                        size += 2;
                    }
                }
                //trail surrogate
                if (code >= 0xDC00 && code <= 0xDFFF) {
                    i--;
                }
            }

            return size;
        };


        // update open file button attributes
        const updateFileSeeLink = (result, uploaderContainer, fileName) => {
            let mimeType = result.substring(5, result.indexOf(';'));
            let fileSeeLink = uploaderContainer.querySelector('.fileSee');
        
            if (this._options.mimeTypesToOpen.indexOf(mimeType) >= 0) {
                
                fileSeeLink.addEventListener('click', () => {
                    let win = window.open();                            

                    win.document.write(`<iframe src="${result}" frameborder="0" style="border:0; top:0px; display:block; left:0px; bottom:0px; right:0px; width:100%; min-height: 100vh; height:100%;" allowfullscreen></iframe>`)
                })
            }
            else {
                fileSeeLink.setAttribute('href', result);
                fileSeeLink.setAttribute('download', fileName);
            }
        };


        // extend options with instance ones
        const overwriteMerge = (dest, source, options) => source;
        this._options = deepMerge(this._defaults, options, {
            arrayMerge: overwriteMerge
        });


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
                return this._round(this._options.maxTotalSize - currentTotalSize);

                case 'currentNumberOfFiles':
                return currentNumberOfFiles;

                case 'availableNumberOfFiles':
                return this._options.maxNumberOfFiles - currentNumberOfFiles;
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
            currentNumberOfFiles--;

            let availableSize = this._options.maxTotalSize - currentTotalSize;

            availableSize = this._round(availableSize);
            updateLabel('sizeAvailable', availableSize);
            updateLabel('currentSize', currentTotalSize);
            updateLabel('currentNumberOfFiles', currentNumberOfFiles);
            updateLabel('numberOfUploadedFiles', '--');

            // remove result block
            $resultContainer.querySelector(`:scope > div[data-index="${index}"]`).remove();

            if (document.querySelector('.innerFileThumbs').children.length === 0) {
                document.querySelector('.filesContainer').classList.add('filesContainerEmpty');
            }

            this._logger('Deleted file N: ' + index, 2);
            this._options.onfileDelete(index, currentTotalSize, currentNumberOfFiles);
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
        this.createUploaderContainer = (index, fileName, fileExt) => {
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
            let seeFileLink = document.createElement('a');

            seeFileLink.className = 'fileSee';
            seeFileLink.innerHTML = this._options.linkButtonContent;

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
            resultElemContainer.insertAdjacentHTML('beforeend', `<textarea name="${this._options.resultPrefix}[${index}][${this._options.resultInputNames[2]}]">${fileData.result}</textarea>`);
            resultElemContainer.insertAdjacentHTML('beforeend', `<input type="text" name="${this._options.resultPrefix}[${index}][${this._options.resultInputNames[3]}]" value="${fileData.size}" />`);
            $resultContainer.appendChild(resultElemContainer);
        };


        // files read function
        this._filesRead = (event) => {
            let DOM = event.data.DOM;
            let filesList;
            let approvedList = false;
            let i = 0;

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
                let loadedFiles = [];
                let newFiles = [];

                approvedList = [];

                // build already loaded files list
                for(let file of $resultContainer.children) {
                    loadedFiles.push(file.querySelector('input').value);
                };

                // build current selected files list
                for (i = 0; i < filesList.length; i++) {
                    newFiles.push(filesList[i].name);
                }

                // avoid load twice the same file
                newFiles.forEach(function(newFile) {
                    let fileIndex = loadedFiles.indexOf(newFile);

                    if (fileIndex < 0) {
                        approvedList.push(newFile);
                    }
                });
            }

            $fileContainer.classList.remove('filesContainerEmpty');

            let readFile = (reader, file, index, DOM, uploaderContainer) => {
                let currentElement = Array.from(DOM.querySelector('.innerFileThumbs').children).filter(function(element) {
                    return parseInt(element.dataset.index) === index ;
                });
                currentElement = currentElement[0];
                let size = this._round(file.size / 1000000);      // size in MB

                reader.onloadstart = () => {
                    this._options.onfileloadStart(index);
                    this._logger(`START read file: ${index}, size: ${size} MB`, 2);
                };

                reader.onprogress = (event) => {
                    if (event.lengthComputable) {
                        let percentLoaded = this._round((event.loaded / event.total) * 100);
                        this._logger(`File ${index} loaded: ${percentLoaded}`, 3);

                        // Increase the progress bar length.
                        if (percentLoaded <= 100) {
                            currentElement.querySelector(':scope > .loadBar > div').style.width = '100%';
                        }
                    }
                };

                reader.onloadend = () => {
                    let type = file.type;
                    let name = file.name;
                    let result = reader.result;

                    // reading unsuccessful
                    if (!result) {
                        return false;
                    }

                    let mimeType = result.substring(0, result.indexOf(';'));

                    // if file has no MIME type, replace with default one
                    if (mimeType === 'data:' && this._options.defaultMimeType.length > 0) {
                        result = "data:" + this._options.defaultMimeType + result.substring(result.indexOf(';'), result.length);
                    }
                    if (type === "") {
                        type = this._options.defaultMimeType;
                    }
                    if (name.indexOf('.') < 0 && this._options.defaultFileExt !== '') {
                        name = `${name}.${this._options.defaultFileExt}`;
                    }

                    if (!this._options.useSourceFileSize) {
                        size = this._round(byteLength(result) / 1000000);
                    }

                    let newFile = {
                        index: index,
                        name: name,
                        type: type,
                        result: result,
                        size: size
                    };

                    this._createResultContainer(newFile);

                    //set direct link on file see button
                    this._logger(`END read file: ${index}`, 4);

                    let resultObject = {
                        name: file.name,
                        type: file.type,
                        data: result,
                        size: size
                    };

                    // update total size
                    currentTotalSize = currentTotalSize + size;
                    currentNumberOfFiles++;

                    let currentAvailableSize = instance._round(instance._options.maxTotalSize - currentTotalSize);

                    updateLabel('sizeAvailable', currentAvailableSize);
                    updateLabel('currentSize', currentTotalSize);
                    updateLabel('currentNumberOfFiles', currentNumberOfFiles);
                    updateLabel('numberOfUploadedFiles', '++');
                    
                    updateFileSeeLink(result, uploaderContainer, file.name);

                    this._options.onfileloadEnd(index, resultObject, this._round(currentTotalSize), currentNumberOfFiles);
                };

                // test if loading is allowed
                function readAllowed(instance) {
                    reader.readAsDataURL(file);
                }

                function readRejected(instance, reasons) {
                    let errorMsg;

                    for (let reason of reasons) {
                        switch(reason) {
                            case 'maxFileSize':
                            errorMsg = currentLangObj.maxSizeExceeded_msg;
                            instance._logger(`FILE REJECTED: Max file size exceeded - max size: ${instance._options.maxFileSize} MB - file size: ${size} MB`);
                            break;
    
                            case 'maxTotalSize':
                            errorMsg = currentLangObj.maxTotalSizeExceeded_msg;
                            instance._logger(`FILE REJECTED: Max total size exceeded - max size: ${instance._options.maxTotalSize} MB - current total size: ${currentTotalSize + size} MB`);
                            break;
    
                            case 'maxNumberOfFiles':
                            errorMsg = currentLangObj.maxNumberOfFilesExceeded_msg;
                            instance._logger(`FILE REJECTED: Max number of files exceeded - max number: ${instance._options.maxNumberOfFiles}`);
                            break;
                        }
                    }

                    currentElement.classList.add('error');

                    if (instance._options.showErrorOnLoadBar) {
                        let loadBar = currentElement.querySelector(':scope > .loadBar');
                        loadBar.innerHTML = '';
                        loadBar.insertAdjacentHTML('beforeend', `<div class="errorMsg">${errorMsg}</div>`)
                    }

                    setTimeout(() => {
                        if (instance._options.useFileIcons) {
                            currentElement.getPreviousSibling('img').remove();
                        }
                        currentElement.remove();
                    }, 2000);

                    updateLabel('numberOfRejectedFiles', '++');

                    // error callback
                    instance._options.onfileRejected(rejectReasons);
                }
                
                let isReadAllowed = true;
                let rejectReasons = [];

                if (this._options.maxFileSize && size > this._options.maxFileSize) {
                    isReadAllowed = false;
                    rejectReasons.push('maxFileSize');
                }
                if (this._options.maxTotalSize && (currentTotalSize + size) > this._options.maxTotalSize) {
                    isReadAllowed = false;
                    rejectReasons.push('maxTotalSize');
                }
                if (this._options.maxNumberOfFiles && currentNumberOfFiles >= this._options.maxNumberOfFiles) {
                    isReadAllowed = false;
                    rejectReasons.push('maxNumberOfFiles');
                }

                isReadAllowed ? readAllowed(this) : readRejected(this, rejectReasons);
            }

            function appendMessage($message) {
                setTimeout(() => {
                    $message.remove();
                }, 2000);
            }

            // create a new div containing thumb, delete button and title field for each target file
            for (i = 0; i < filesList.length; i++) {
                let file = filesList[i];
                let reader = new FileReader();

                // test for duplicates
                if (approvedList && approvedList.indexOf(file.name) < 0) {
                    if (this._options.duplicatesWarning) {
                        let $info = document.createElement('div');
                        $info.className = 'errorLabel center';

                        $info.innerHTML = currentLangObj.duplicated_msg;
                        $fileThumbsContainer.appendChild($info);
                        appendMessage($info);
                    }

                    this._logger(`File duplicated: ${file.name} -> skipping...`, 2);
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
                    this._logger(`Invalid file name: ${file.name}`, 2);
                    continue;
                }
                else {
                    if (nameTest !== undefined && nameTest !== true) {
                        fileName = nameTest;
                    }
                }

                let uploaderContainer = this.createUploaderContainer(globalIndex, fileName, fileExt);

                // now read!
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
        }
        // build HTML template
        let template = this._options.HTMLTemplate();

        $el.insertAdjacentHTML('beforeend', template);        

        let globalIndex = 0;
        let $resultContainer = $el.querySelector('.' + this._options.resultContainerClass);
        let $loadBtn = $el.querySelector('.fileLoader');
        let $fileContainer = $el.querySelector('.filesContainer');
        let $fileThumbsContainer = $el.querySelector('.innerFileThumbs');
        let dropZone = $el.querySelector('.dropZone');
        let currentLangObj = this._options.langs[this._options.lang];
        let currentTotalSize = 0;
        let currentNumberOfFiles = 0;
        let loadedFile;
        let instanceLabels = {};
        let labelsClasses = this._options.labelsClasses;

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
            $resultContainer.insertAdjacentHTML('beforebegin', `<div class="debug">Uploaded files: <span class="${labelsClasses.numberOfUploadedFiles}"><span>0</span></span> | Rejected files: <span class="${labelsClasses.numberOfRejectedFiles}"><span>0</span></span></div>`);
            $resultContainer.insertAdjacentHTML('beforebegin', `<div class="debug">MAX FILE SIZE: ${this._options.maxFileSize} MB</div>`);
            $resultContainer.insertAdjacentHTML('beforebegin', `<div class="debug">MAX TOTAL SIZE: ${this._options.maxTotalSize} MB</div>`);
            $resultContainer.insertAdjacentHTML('beforebegin', `<div class="debug">MAX NUMBER OF FILES: ${this._options.maxNumberOfFiles === false ? '(none)' : this._options.maxNumberOfFiles}</div>`);
            $resultContainer.insertAdjacentHTML('beforebegin', `<div class="debug currentNumberOfFiles">Number of files uploaded: <span>${currentNumberOfFiles}</span></div>`);
            $resultContainer.insertAdjacentHTML('beforebegin', `<div class="debug sizeAvailable">Size still available: <span>${this._options.maxTotalSize}</span> MB</div>`);
        }

        // --- FILES RELOAD SECTION ---
        // lookup for previously loaded files placed in the result container directly        
        for (let label in labelsClasses) {
            instanceLabels[`${label}Labels`] = [];
        }

        let labelsContainers = this._options.labelsContainers;

        if (this._options.debug) {
            // handle debug dynamic (labels with a static value don't need to be cached) labels
            instanceLabels.sizeAvailableLabels.push($el.querySelector(`.${labelsClasses.sizeAvailable}`));
            instanceLabels.currentNumberOfFilesLabels.push($el.querySelector(`.${labelsClasses.currentNumberOfFiles}`));
            instanceLabels.numberOfUploadedFilesLabels.push($el.querySelector(`.${labelsClasses.numberOfUploadedFiles}`));
            instanceLabels.numberOfRejectedFilesLabels.push($el.querySelector(`.${labelsClasses.numberOfRejectedFiles}`));
        }
        if (labelsContainers) {
            const getContainer = function(selector) {
                return document.querySelector(selector);
            }

            for (let label in labelsClasses) {
                let findLabel = function(container, labelsClasses, label) {
                    if (container) {
                        let labels = container.querySelector(`.${labelsClasses[label]}`);
                        
                        if (labels) {
                            instanceLabels[`${label}Labels`].push(labels);
                        }
                    }
                    else {
                        this._logger(`impossible to find labelContainer '${selector}'`, 1);
                    }
                }

                if (Array.isArray(labelsContainers)) {
                    for (let selector of labelsContainers) {
                        let container = getContainer(selector);
    
                        findLabel(container, labelsClasses, label);
                    }
                }
                else {
                    let container = getContainer(labelsContainers);
    
                    if (container) {
                        let labels = container.querySelector(`.${labelsClasses[label]}`);

                        if (labels) {
                            instanceLabels[`${label}Labels`].push(labels);
                        }
                    }
                    else {
                        this._logger(`impossible to find labelContainer '${labelsContainers}'`, 1);
                    }
                }
            }
        }
        
        updateLabel('maxFileSize', this._options.maxFileSize);
        updateLabel('maxTotalSize', this._options.maxTotalSize);
        updateLabel('maxNumberOfFiles', this._options.maxNumberOfFiles);

        for (const [index, element] of $resultContainer.querySelectorAll(`:scope > .${this._options.resultFileContainerClass}`).entries()) {
            this._logger(`found previously uploaded file: index = ${element.dataset.index}`, 2);

            // pay attention to index used on fileData here: index 0 is the title DIV!
            let fileData = element.querySelectorAll(':scope > input');
            let fileName = fileData[0].value;
            let fileExt = fileData[1].value;
            let fileSize = fileData[2].value;

            if (fileName.lastIndexOf('.') > 0) {
                fileName = fileName.substr(0, fileName.lastIndexOf('.'));
            }

            loadedFile = this.createUploaderContainer(globalIndex, fileName, fileExt);
            loadedFile.querySelector(':scope > .loadBar > div').style.width = '100%';
            loadedFile.classList.add(this._options.reloadedFilesClass);

            let data = element.querySelector(':scope textarea').value;

            updateFileSeeLink(data, loadedFile, fileName);

            currentTotalSize = currentTotalSize + parseFloat(fileSize);
            currentNumberOfFiles++;
            globalIndex++;
        }

        // reload files from provided array
        if (this._options.reloadArray.length > 0) {
            this._options.reloadArray.forEach((file, index) => {
                // re-create visible elements
                loadedFile = this.createUploaderContainer(index, file.name, file.ext);
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

                updateFileSeeLink(file.data, loadedFile, file.name);

                this._createResultContainer(newFile);

                currentTotalSize = currentTotalSize + parseFloat(file.size);
                currentNumberOfFiles++;
                globalIndex++;
            });
        }

        currentTotalSize = this._round(currentTotalSize);

        this._logger(`current total size: ${currentTotalSize} - current number of files: ${currentNumberOfFiles}`);
        updateLabel('sizeAvailable', (this._options.maxTotalSize - currentTotalSize));
        updateLabel('currentSize', currentTotalSize);
        updateLabel('currentNumberOfFiles', currentNumberOfFiles);
        updateLabel('numberOfUploadedFiles', currentNumberOfFiles);
        updateLabel('numberOfRejectedFiles', '0');
        // --- END FILES RELOAD SECTION ---

        // onload callback
        this._options.onload(this._options, currentTotalSize, currentNumberOfFiles);

        // Drag events
        this.handleDragOver = (event) => {
            dropZone.classList.add('highlight');
            event.stopPropagation();
            event.preventDefault();
            event.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
        }
        this.handleDrop = (event) => {
            dropZone.classList.remove('highlight');
            event.data = {
                DOM: $el
            };
            this._filesRead(event);
        }

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('highlight');
        });
        dropZone.addEventListener('dragover', this.handleDragOver);
        dropZone.addEventListener('drop', () => {
            event.stopPropagation();
            event.preventDefault();
            this.handleDrop(event);
        });

        dropZone.addEventListener('click', (event) => {
            $loadBtn.click();
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
})(window);
