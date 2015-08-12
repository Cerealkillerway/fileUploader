/*
* fileUploader v1.0.0
* available under MIT license
* 
* */
(function($) {

    var FileUploader = function($el, options, translation) {

        // default options
        this._defaults = {
            lang: 'en',
            useFileIcons: true,
            debug: false,                                       // activate console logs for debug
            useLoadingBars: true,                               // insert loading bar for files
            reloadedFilesClass: 'reloadedElement',              // class for previously uploaded files
            resultContainer: $el.find('.result'),               // hidden container to place results to
            resultFileContainerClass: "uploadedFile",           // class for every file result container span
            resultPrefix: "fileUploader",                       // prefix for inputs in the file result container
            resultInputNames: ["title", "extension", "value"],  // name suffix to be used for result inputs
            defaultFileExt: "",                                 // extension to use for files with no extension
            defaultMimeType: "",                                // MIME type to use for files with no extension 
            fileMaxSize: 50,                                    // maximum allowed file size (in MB)
            onload: function() {},                              // callback on plugin initialization
            onfileloadStart: function() {},                     // callback on file reader start
            onfileloadEnd: function() {},                       // callback on file reader end
            langs: {
                "en": {
                    intro_msg: "(Add attachments...)",
                    dropZone_msg: "Drop your files here",
                    maxSizeExceeded_msg: "File too large",
                    name_placeHolder: "name"
                },
                "it": {
                    intro_msg: "(Aggiungi documenti allegati...)",
                    dropZone_msg: "Trascina qui i tuoi files...",
                    maxSizeExceeded_msg: "File troppo grande",
                    name_placeHolder: "nome"
                }
            }
        };

        this._options = $.extend(true, {}, this._defaults, options);

        this.options = function(options) {
            return (options) ? $.extend(true, this._options, options) : this._options;
        };
        
        
        // debug logs function
        this._logger = function(message, level) {
            if (this._options.debug) {
                if (level) {
                    for (var i = 0; i < level; i++) {
                        message = '\u27A1 ' + message;
                    }
                }
                console.log(message);
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
            var Uploader = event.data.Uploader;
            var element = event.data.element;
            var index = $(event.target).data('delete');
            var id = $(event.target).data('id');

            // remove file block
            if (Uploader._options.useFileIcons) {
                element.prev('img').remove();
            }
            element.remove();
            // remove result block
            $resultContainer.children('div[data-index="' + index + '"]').remove();

            if ($('.innerFileThumbs').children().length === 0) $('.filesContainer').addClass('filesContainerEmpty');

            event.data.Uploader._logger('Deleted file N: ' + index, 2);
        };

        // method to rename file in result container accordingly to modifications by user
        this._fileRename = function(event) {
            var Uploader = event.data.Uploader;
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

            var $resultContainer = this._options.resultContainer;
            var data = [];

            $.each($resultContainer.children('.' + this._options.resultFileContainerClass), function(index, element) {
                var file = {
                    title: $($(element).children('input')[0]).val(),
                    ext: $($(element).children('input')[1]).val(),
                    value: $($(element).children('input')[2]).val()
                };

                data.push(file);
            });

            this._logger(data);

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
            deleteBtn.click({Uploader: this, element: container}, this._fileDelete);

            //insert loading bars if requested
            if (this._options.useLoadingBars) {
                var currentLoadBar = $('<div class="loadBar"><div></div></div>');
                container.prepend(currentLoadBar);
            }

            var currentTitle = $('<input placeholder="nome" class="fileTitle"></input>');
            var currentExtension = $('<div class="fileExt"></div>');
            container.prepend(currentExtension);
            container.prepend(currentTitle);

            currentTitle.keyup({Uploader: this, element: container}, this._fileRename);

            currentTitle.val(fileName);
            currentExtension.html(fileExt);

            return container;
        };

        var globalIndex = 0;
        var $resultContainer = this._options.resultContainer;
        var $loadBtn = $el.find('.fileLoader');
        var $fileContainer = $el.find('.filesContainer');
        var $fileNameContainer = $el.find('.fileNameContainer');
        var $fileThumbsContainer = $el.find('.innerFileThumbs');
        var dropZone = $el.find('.dropZone')[0];
        var currentLangObj = this._options.langs[this._options.lang];


        // initialization
        $el.find('.introMsg').html(currentLangObj.intro_msg);
        $(dropZone).html(currentLangObj.dropZone_msg); 
        if (!this._options.debug) {
            $resultContainer.addClass('hide');
        }
        else {
            $('<p class="debugMode">Debug mode: on</p>').insertBefore($resultContainer);
            $('<div class="debug">Uploaded files: <span id="debugUploaded">0</span> | Rejected files: <span id="debugRejected">0</span></div>').insertBefore($resultContainer);
            $('<div class="debug">Current MAX FILE SIZE: ' + this._options.fileMaxSize + ' MB</div>').insertBefore($resultContainer);
        }

        // onload callback
        this._options.onload($resultContainer);

        // lookup for previously loaded files
        var Uploader = this;
        $.each(this._options.resultContainer.children('.' + this._options.resultFileContainerClass), function(index, element) {
            Uploader._logger('found previously uploaded file: index = ' + $(element).data('index'), 2);

            var fileData = $(element).children();
            var fileNameArray = $(fileData[1]).val().split('.');
            var fileExt = fileNameArray[fileNameArray.length - 1];
                fileNameArray.pop();

            var fileName = fileNameArray.join('.');

            loadedFile = Uploader._createUploaderContainer(globalIndex, fileName, fileExt);
            loadedFile.children('.loadBar').children('div').css({width: '100%'});
            loadedFile.addClass(Uploader._options.reloadedFilesClass);
            globalIndex++;
        });


        // files read function
        this._filesRead = function(event) {
            var Uploader = event.data.Uploader;
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
            this._logger(filesList);

            $fileContainer.removeClass('filesContainerEmpty');
            // set selected file's name to fleNameContainer
            $fileNameContainer.html('upload files');

            function readFile(reader, file, index, Uploader, DOM) {
                var currentElement = DOM.find('.innerFileThumbs').children().filter(function() { 
                    return $(this).data("index") === index ;
                });

                var size = Math.round(file.size / 1000000 * 100) / 100;      // size in MB

                reader.onloadstart = function() {
                    Uploader._options.onfileloadStart(index);
                    Uploader._logger('START read file: ' + index + ', size: ' + size + ' MB', 2);
                };

                reader.onprogress = function(event) {
                    if (event.lengthComputable) {
                        var percentLoaded = Math.round((event.loaded / event.total) * 100);
                        Uploader._logger('File ' + index + ' loaded: ' + percentLoaded, 3);
                        
                        // Increase the progress bar length.
                        if (percentLoaded <= 100) {
                            currentElement.children('.loadBar').children('div').animate({width: '100%'}, 500);
                        }
                    }
                };

                function createResultContainer(index, name, type, result) {
                    var resultElemContainer = $('<div data-index="' + index + '" class="' + Uploader._options.resultFileContainerClass + '"></div>');
                    resultElemContainer.append($('<div>File: ' + index + '</div>'));
                    resultElemContainer.append($('<input/>').attr({type: 'text', name: Uploader._options.resultPrefix + '[' + index + '][' + Uploader._options.resultInputNames[0] + ']', value: name}));
                    resultElemContainer.append($('<input/>').attr({type: 'text', name: Uploader._options.resultPrefix + '[' + index + '][' + Uploader._options.resultInputNames[1] + ']', value: type}));
                    resultElemContainer.append($('<input/>').attr({type: 'text', name: Uploader._options.resultPrefix + '[' + index + '][' + Uploader._options.resultInputNames[2] + ']', value: result}));

                    $resultContainer.append(resultElemContainer);
                }

                reader.onloadend = function() {
                    var type = file.type;
                    var name = file.name;
                    var result = reader.result;
                    var mimeType = result.substring(0, result.indexOf(';'));

                    // if file has no MIME type, replace with default one
                    if (mimeType === "data:" && Uploader._options.defaultMimeType.length > 0) {
                        result = "data:" + Uploader._options.defaultMimeType + result.substring(result.indexOf(';'), result.length);
                    }

                    if (type === "") type = Uploader._options.defaultMimeType;
                    if (name.indexOf('.') < 0 && Uploader._options.defaultFileExt !== "") name = name + '.' + Uploader._options.defaultFileExt;

                    createResultContainer(index, name, type, result);

                    //set direct link on file see button
                    currentElement.children('.fileActions').children('a').attr('href', result);
                    Uploader._logger('END read file: ' + index, 4);

                    var totalUploaded = parseInt($('#debugUploaded').html()) + 1;
                    $('#debugUploaded').html(totalUploaded);

                    Uploader._options.onfileloadEnd(index, result);
                };

                if (size <= Uploader._options.fileMaxSize) {
                    reader.readAsDataURL(file);
                }
                else {
                    currentElement.addClass('error');
                    currentElement.children('.loadBar').empty().append('<div class="errorMsg">' + currentLangObj.maxSizeExceeded_msg + '</div>');

                    setTimeout(function() {
                        currentElement.animate({opacity: 0}, 300, function() {
                            if (Uploader._options.useFileIcons) {
                                $(this).prev('img').remove();
                            }

                            $(this).remove();
                        });
                    }, 2000);

                    var totalRejected = parseInt($('#debugRejected').html()) + 1;
                    $('#debugRejected').html(totalRejected);

                    Uploader._logger("FILE REJECTED: Max size exceeded - max size: " + Uploader._options.fileMaxSize + ' MB - file size: ' + size + ' MB');
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
                readFile(reader, file, globalIndex, Uploader, DOM);
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
            Uploader._filesRead(event);
        }

        dropZone.addEventListener('dragover', handleDragOver, false);
        dropZone.addEventListener('drop', (function(passedInElement) {
            return function(e) {handleDrop(e, passedInElement); };
        }) (this), false);

        $(dropZone).click(function(event) {
            $loadBtn.trigger('click');
        });

        // fileUploader events
        $loadBtn.click({Uploader: this, DOM: $el}, function(event) {
            var elements = event.data.DOM.find('.innerFileThumbs').children();

            //avoid loading twice the same file
            if (elements.length === 0) {
                this.value = null;
            }
        });
        $loadBtn.change({Uploader: this, DOM: $el}, function(event) {
            event.data.Uploader._filesRead(event);
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