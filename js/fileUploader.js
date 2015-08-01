(function($) {
    $.fn.fileUploader = function(options) {
        // default options
        var config = {
            lang: 'en',
            useFileIcons: true,
            debug: false,                                       // activate console logs for debug
            useLoadingBars: true,                               // insert loading bar for files
            resultContainer: $(this).find('.result'),           // hidden container to place results to
            resultFileContainerClass: "file-",                  // class for every file result container span
            resultPrefix: "fileUploader-",                      // prefix for inputs in the file result container
            resultInputNames: ["title", "extension", "value"]   // name suffix to be used for result inputs
        };

        var lang = {
            "en": {
                intro_msg: "(Add attachments to your invoice...)",
                dropZone_msg: "Drop here your files",
            },
            "it": {
                intro_msg: "(Aggiungi documenti allegati alla tua fattura...)",
                dropZone_msg: "Trascina qui i tuoi files...",
            }
        };
        // extend with user-defined options
        if (options) {
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
        }

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


            function loadEnd(reader, file, index) {
                reader.onloadend = function() {
                    var spanContainer = $('<div data-index="' + index + '" class="' + options.resultFileContainerClass + '"></div>');
                    spanContainer.append($('<div>File: ' + index + '</div>'));
                    spanContainer.append($('<input/>').attr({type: 'text', name: config.resultPrefix + '[' + index + '][' + config.resultInputNames[0] + ']', value: file.name}));
                    spanContainer.append($('<input/>').attr({type: 'text', name: config.resultPrefix + '[' + index + '][' + config.resultInputNames[1] + ']', value: file.type}));
                    spanContainer.append($('<input/>').attr({type: 'text', name: config.resultPrefix + '[' + index + '][' + config.resultInputNames[2] + ']', value: reader.result}));

                    $resultContainer.append(spanContainer);

                    var currentElement = $('#fileContainer-' + index);
                    //set direct link on file see button
                    currentElement.children('.fileActions').children('a').attr('href', reader.result);
                };
                reader.readAsDataURL(file);
            }

            function progress(reader, index) {
                var currentElement = $('#fileContainer-' + index);

                reader.onprogress = function(event) {
                    if (event.lengthComputable) {
                        var percentLoaded = Math.round((event.loaded / event.total) * 100);
                        console.log(percentLoaded);
                        
                        // Increase the progress bar length.
                        if (percentLoaded <= 100) {
                            currentElement.children('.loadBar').children('div').animate({width: '100%'}, 500);
                        }
                    }
                };
            }


            var startIndex = $('#innerFileThumbs').children().last().attr('id');
            if (startIndex !== undefined) startIndex = parseInt(startIndex.substring(startIndex.indexOf('-') + 1, startIndex.length)) + 1;
            else startIndex = 0;

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
                var text = $this.val() + '.' + ext;
                var index = $this.attr('id').split('-')[1];

                var $input = $resultContainer.find('span[data-index="' + index + '"] input:first');
                $input.val(text);
            };

            // create a new div containing thumb, delete button and title field for each target file
            for (var i = 0; i < filesList.length; i++) {
                var file = filesList[i];
                var reader = new FileReader();

                // create current element's DOM
                var containerStyle = "position: relative;";
                if (config.useFileIcons) {
                    containerStyle = containerStyle + " float: left;";
                }
                var container = $('<div class="newElement" id="fileContainer-' + parseInt(globalIndex) + '" style="' + containerStyle + '"></div');
                $fileThumbsContainer.append(container);
                
                var fileButtonsContainer = $('<div class="fileActions"></div>');
                container.append(fileButtonsContainer);
                // file "see" link
                var seeFileLink = $('<a target="_blank"><div class="fileSee">L</div></a>');
                fileButtonsContainer.append(seeFileLink);

                // delete button
                var deleteBtn = $('<div data-delete="' + parseInt(globalIndex) + '" class="fileDelete">X</div>');
                fileButtonsContainer.append(deleteBtn);
                deleteBtn.click(fileDelete);

                //insert loading bars if requested
                if (config.useLoadingBars) {
                    var currentLoadBar = $('<div class="loadBar"><div></div></div>');
                    container.prepend(currentLoadBar);
                }

                var currentTitle = $('<input placeholder="nome" class="fileTitle" id="fileTitle-' + parseInt(globalIndex) + '"></input>');
                var currentExtension = $('<div class="fileExt" id="fileExt-' + parseInt(globalIndex) + '"></div>');
                container.prepend(currentExtension);
                container.prepend(currentTitle);

                //insert file icon if requested
                if (config.useFileIcons) {
                    var currentThumb = $('<img src="/images/' + fileType(file.name) + '.png" class="fileThumb" id="fileThumb-' + parseInt(globalIndex) + '" />');
                    container.prepend(currentThumb);
                }

                currentTitle.keyup(fileRename);


                var fileName = file.name.substring(0, file.name.lastIndexOf('.'));
                var fileExt = file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length);
                $('#fileTitle-' + parseInt(globalIndex)).val(fileName);
                $('#fileExt-' + parseInt(globalIndex)).html(fileExt);

                // now read!
                progress(reader, globalIndex);
                loadEnd(reader, file, globalIndex);
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