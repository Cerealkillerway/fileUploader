(function($) {
    $.fn.fileUploader = function(options, translation) {
        // default options
        var config = {
            lang: 'en',
            useFileIcons: true,
            debug: false,                                       // activate console logs for debug
            useLoadingBars: true,                               // insert loading bar for files
            reloadedFilesClass: 'reloadedElement',              // class for previously uploaded files
            resultContainer: $(this).find('.result'),           // hidden container to place results to
            resultFileContainerClass: "uploadedFile",           // class for every file result container span
            resultPrefix: "fileUploader",                       // prefix for inputs in the file result container
            resultInputNames: ["title", "extension", "value"],  // name suffix to be used for result inputs
            defaultFileExt: "",                                 // extension to use for files with no extension
            defaultMimeType: "",                                // MIME type to use for files with no extension 
            fileMaxSize: 50,                                    // maximum allowed file size (in MB)
            onload: function() {},                              // callback on plugin initialization
            onfileloadStart: function() {},                     // callback on file reader start
            onfileloadEnd: function() {}                        // callback on file reader end
        };

        var lang = {
            "en": {
                intro_msg: "(Add attachments...)",
                dropZone_msg: "Drop your files here",
                maxSizeExceeded_msg: "File too large"
            },
            "it": {
                intro_msg: "(Aggiungi documenti allegati...)",
                dropZone_msg: "Trascina qui i tuoi files...",
                maxSizeExceeded_msg: "File troppo grande"
            }
        };
        // extend with user-defined options
        if (options) {
            $.extend(lang, translation);
            $.extend(config, options);
        }
        
        // debug logs function
        function logger(message, level) {
            if (config.debug) {
                if (level) {
                    for (var i = 0; i < level; i++) {
                        message = '-> ' + message;
                    }
                }
                console.log(message);
            }
        }

        // file type identificator
        function fileType(fileName) {
            var ext = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length);

            switch (ext) {
                case 'pdf':
                return 'pdf';

                default:
                return 'unknown-file';
            }
        }

        fileDelete = function(event) {
            var index = $(event.target).data('delete');
            var id = $(event.target).data('id');

            // remove file block
            $('#fileContainer-' + index).remove();
            // remove result block
            $resultContainer.children('div[data-index="' + index + '"]').remove();

            if ($('.innerFileThumbs').children().length === 0) $('.filesContainer').addClass('filesContainerEmpty');

            logger('Deleted file N: ' + index, 2);
        };

        fileRename = function(event) {
            var $this = $(event.target);
            var ext = $this.siblings('.fileExt').html();
            var text;
            var index = $this.attr('id').split('-')[1];

            if (ext.length > 0) {
                text = $this.val() + '.' + ext;
            }
            else {
                text = $this.val();
            }

            var $input = $resultContainer.find('div[data-index="' + index + '"] input:first');
            $input.val(text);
        };

        // create container for file uploading elements (icon, progress bar, etc...)
        function createUploaderContainer(index, fileName, fileExt) {
            // create current element's DOM
            var containerStyle = "position: relative;";

            //insert file icon if requested
            if (config.useFileIcons) {
                var currentThumb = $('<img src="/images/' + fileType(file.name) + '.png" class="fileThumb" id="fileThumb-' + parseInt(index) + '" />');
                $fileThumbsContainer.append(currentThumb);
            }

            var container = $('<div class="newElement" id="fileContainer-' + parseInt(index) + '" style="' + containerStyle + '"></div');
            $fileThumbsContainer.append(container);
            
            var fileButtonsContainer = $('<div class="fileActions"></div>');
            container.append(fileButtonsContainer);
            // file "see" link
            var seeFileLink = $('<a target="_blank"><div class="fileSee">L</div></a>');
            fileButtonsContainer.append(seeFileLink);

            // delete button
            var deleteBtn = $('<div data-delete="' + parseInt(index) + '" class="fileDelete">X</div>');
            fileButtonsContainer.append(deleteBtn);
            deleteBtn.click(fileDelete);

            //insert loading bars if requested
            if (config.useLoadingBars) {
                var currentLoadBar = $('<div class="loadBar"><div></div></div>');
                container.prepend(currentLoadBar);
            }

            var currentTitle = $('<input placeholder="nome" class="fileTitle" id="fileTitle-' + parseInt(index) + '"></input>');
            var currentExtension = $('<div class="fileExt" id="fileExt-' + parseInt(index) + '"></div>');
            container.prepend(currentExtension);
            container.prepend(currentTitle);

            currentTitle.keyup(fileRename);

            $('#fileTitle-' + parseInt(index)).val(fileName);
            $('#fileExt-' + parseInt(index)).html(fileExt);

            return container;
        }

        var globalIndex = 0;
        var $resultContainer = config.resultContainer;
        var $loadBtn = $(this).find('.fileLoader');
        var $fileContainer = $(this).find('.filesContainer');
        var $fileNameContainer = $(this).find('.fileNameContainer');
        var $fileThumbsContainer = $(this).find('.innerFileThumbs');
        var dropZone = $(this).find('.dropZone')[0];
        var currentLangObj = lang[config.lang];


        // initialization
        $(this).find('.introMsg').html(currentLangObj.intro_msg);
        $(dropZone).html(currentLangObj.dropZone_msg); 
        if (!config.debug) {
            $resultContainer.addClass('hide');
        }
        else {
            $('<p class="debugMode">Debug mode: on</p>').insertBefore($resultContainer);
            $('<div class="debug">Uploaded files: <span id="debugUploaded">0</span> | Rejected files: <span id="debugRejected">0</span></div>').insertBefore($resultContainer);
            $('<div class="debug">Current MAX FILE SIZE: ' + config.fileMaxSize + ' MB</div>').insertBefore($resultContainer);
        }

        // onload callback
        config.onload($resultContainer);

        // lookup for previously loaded files
        $.each(config.resultContainer.children('.' + config.resultFileContainerClass), function(index, element) {
            logger('found previously uploaded file: index = ' + $(element).data('index'), 2);

            var fileData = $(element).children();
            var fileNameArray = $(fileData[1]).val().split('.');
            var fileExt = fileNameArray[fileNameArray.length - 1];
                fileNameArray.pop();

            var fileName = fileNameArray.join('.');

            loadedFile = createUploaderContainer(globalIndex, fileName, fileExt);
            loadedFile.children('.loadBar').children('div').css({width: '100%'});
            loadedFile.addClass(config.reloadedFilesClass);
            globalIndex++;
        });


        // files read function
        function filesRead(event) {
            var filesList;
            if (event.target.files) {
                logger('files array source: file selector (click event)', 1);
                filesList = event.target.files;
            }
            else {
                logger('files array source: dropzone (drag & drop event)', 1);
                filesList = event.dataTransfer.files;
            }
            logger(filesList);


            $fileContainer.removeClass('filesContainerEmpty');
            // set selected file's name to fleNameContainer
            $fileNameContainer.html('upload files');

            function readFile(reader, file, index) {
                var currentElement = $('#fileContainer-' + index);
                var size = Math.round(file.size / 1000000 * 100) / 100;      // size in MB

                reader.onloadstart = function() {
                    config.onfileloadStart(index);
                    logger('START read file: ' + index + ', size: ' + size + ' MB', 2);
                };

                reader.onprogress = function(event) {
                    if (event.lengthComputable) {
                        var percentLoaded = Math.round((event.loaded / event.total) * 100);
                        logger('File ' + index + ' loaded: ' + percentLoaded, 3);
                        
                        // Increase the progress bar length.
                        if (percentLoaded <= 100) {
                            currentElement.children('.loadBar').children('div').animate({width: '100%'}, 500);
                        }
                    }
                };

                function createResultContainer(index, name, type, result) {
                    var resultElemContainer = $('<div data-index="' + index + '" class="' + config.resultFileContainerClass + '"></div>');
                    resultElemContainer.append($('<div>File: ' + index + '</div>'));
                    resultElemContainer.append($('<input/>').attr({type: 'text', name: config.resultPrefix + '[' + index + '][' + config.resultInputNames[0] + ']', value: name}));
                    resultElemContainer.append($('<input/>').attr({type: 'text', name: config.resultPrefix + '[' + index + '][' + config.resultInputNames[1] + ']', value: type}));
                    resultElemContainer.append($('<input/>').attr({type: 'text', name: config.resultPrefix + '[' + index + '][' + config.resultInputNames[2] + ']', value: result}));

                    $resultContainer.append(resultElemContainer);
                }

                reader.onloadend = function() {
                    var type = file.type;
                    var name = file.name;
                    var result = reader.result;
                    var mimeType = result.substring(0, result.indexOf(';'));

                    // if file has no MIME type, replace with default one
                    if (mimeType === "data:" && config.defaultMimeType.length > 0) {
                        result = "data:" + config.defaultMimeType + result.substring(result.indexOf(';'), result.length);
                    }

                    if (type === "") type = config.defaultMimeType;
                    if (name.indexOf('.') < 0 && config.defaultFileExt !== "") name = name + '.' + config.defaultFileExt;

                    createResultContainer(index, name, type, result);

                    var currentElement = $('#fileContainer-' + index);
                    //set direct link on file see button
                    currentElement.children('.fileActions').children('a').attr('href', result);
                    logger('END read file: ' + index, 4);

                    var totalUploaded = parseInt($('#debugUploaded').html()) + 1;
                    $('#debugUploaded').html(totalUploaded);

                    config.onfileloadEnd(index, result);
                };

                if (size <= config.fileMaxSize) {
                    reader.readAsDataURL(file);
                }
                else {
                    currentElement.addClass('error');
                    currentElement.children('.loadBar').empty().append('<div class="errorMsg">' + currentLangObj.maxSizeExceeded_msg + '</div>');

                    setTimeout(function() {
                        currentElement.animate({opacity: 0}, 300, function() {
                            $(this).remove();
                        });
                    }, 2000);

                    var totalRejected = parseInt($('#debugRejected').html()) + 1;
                    $('#debugRejected').html(totalRejected);

                    logger("FILE REJECTED: Max size exceeded - max size: " + config.fileMaxSize + ' MB - file size: ' + size + ' MB');
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
                    fileExt = config.defaultFileExt;
                }
                
                createUploaderContainer(globalIndex, fileName, fileExt);
                // now read!
                readFile(reader, file, globalIndex);
                globalIndex++;
            }
        }

        // Drag events
        function handleDragOver(event) {
            event.stopPropagation();
            event.preventDefault();
            event.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
        }
        function handleDrop(event) {
            event.stopPropagation();
            event.preventDefault();
            filesRead(event);
        }
        dropZone.addEventListener('dragover', handleDragOver, false);
        dropZone.addEventListener('drop', handleDrop, false);
        $(dropZone).click(function(event) {
            $loadBtn.trigger('click');
        });

        // fileUploader events
        $loadBtn.change(filesRead);

        return this;
    };
})(jQuery);