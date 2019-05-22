## File Uploader v5.1.3

![FileUploader](./images/logos/file-uploader.png)

A file uploader skeleton that uses HTML5 file reader API.  
NOTE: from version 4.0.0 jquery dependency has been removed;

### Usage
FileUploader is a jQuery plugin; just put a container for it in your HTML page:

    <div class="fileUploader" id="one"></div>

and instantiate **FileUploader** on it.<br>
Example:

    let test1 = new FileUploader(document.querySelector('#one'));


This skeleton handles the client-side file reading; then the files must be sended (ex. with an ajax call) to a server procedure that will save them somewhere (filesystem, db, ...).
You can use the "getData" method to get all files' data and then or handle everything on your own by iterating result container's children elements;
If needed you can also populate the result container with previously uploaded file's data (onload callback is suitable for this purpose).

There are some options that can passed to constructor in the form:

    let test1 = new FileUploader(DOMelement, {options})

(see below).

### Options
**lang**: [string] language to use (default 'en'); see "translations" section for overrides and new language definitions

**fileMaxSize**: [number] maximum allowed file size in MB (default 50)

**totalMaxSize**: [number] maximum allowd upload size for all files together (default 1000)

**reloadArray**: [array] an array of objects representing previously loaded files; each object is in the form:
    
    {
        name: "file name",
        ext: "jpeg"                    // or whatever the extension is...
        data: "asodifulejflsfilse..."  // the base64 string
        size: 1.2                      // size in MB of the file
    }

**reloadHTML**: [string] a string containing the HTML to place in result container directly for previously loaded files; see section ["Reloaded files"](#reloadedFiles) for futher details

**useFileIcons**: [boolean] use icons for each file depending on file type (default true)

**linkButtonContent**: [string] markup for the link button (default "L")

**deleteButtonContent**: [string] markup for the delete button (default "X")

**HTMLTemplate**: [function] a function that returns the HTML template for the plugin; you can edit this, but you must provide the HTML elements needed by the plugin to work; the default is:

    <p class="introMsg"></p>
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
    <div class="result"></div>

**reloadedFilesClass**: [string] a class to style previously uploaded files (files uploaded during a previous session and now retrieved and placed in the result container) (default 'reloadedElement')

**useLoadingBars**: [boolean] show a progress bar while reading each file (default true)

**loadingBarsClasses**: [string] an array of strings representing custom classes to assign to each loading bar

**resultContainerClass**: [string] set the class of the element to be used as container for reader's results (by default this is the hidden $(.result) element of the fileUploader); can be the class of any DOM element inside the fileUploader markup

**resultFileContainerClass**: [string] custom class to use for each reader's result container (default "file-")

**defaultFileExt**: [string] extension to use for files with no extension (default "")

**defaultMimeType**: [string] MIME type to use for files with no extension (default "")

**allowDuplicates**: [boolean] allow to upload more than once the same file (based on file name, default false)

**duplicatesWarning**: [boolean] if *allowDuplicates* is false, set this option to true to show a warning message when trying to load a duplicated file

In the result container, each reader's result is inserted as a DIV with 4 nested INPUT elements (title, extension, value (the base64 string) and size (in MB)); each of these 4 elements has a name attribute in the form "prefix[index][name]"

By default the prefix is "fileUploader", and the names are ["title", "extension", "value", "size"].<br>

If needed it is possible to change them:

**resultPrefix**: [string] custom name-prefix for result elements

**resultInputNames**: [array of strings] custom array of names for the 4 result elements created for each file (ordered)

**labelsContainers**: [string / array of strings] the fileUploader can dynamically update 4 kind of labels showing the current total size, current available size, max total size and max file size; by default these labels are not included in the plugin's generated DOM; if you need to display those informations, you can do it by placing the DOM element where you want to display these infos wherever you want and:

use the plugin's callbacks to update values when neede

or

let the plugin handle this for you; in this case you have to provide "labelsContainers" option; this is a querySelector string (or an array of querySelector strings if you need to display those infos in more than one place) where the plugin will look to find appropriate elements for containing the relative information; for example you can put somewhere:

```
<div class="myContainer>
    <div class="sizeAvailable">size available: <span></span></div>
    <div class="currentSize">current size: <span></span></div>
    <div class="maxFileSize">max file size: <span></span></div>
    <div class="maxTotalSize">max total size: <span></span></div>
</div>
```
(maybe you don't want all of them, you can put a DOM element in your container only for the ones you want); the class of each element in the container that fileUploader will look for is by default as in the example above, anyway can be customized with "labelsClasses" options

**labelsClasses**: [object] an object that defines the classes to look for inside any "labelsContainers" defined, where to update fileUploader infos:
```
labelsClasses: {
    sizeAvailable: 'sizeAvailable',
    currentSize: 'currentSize',
    maxFileSize: 'maxFileSize',
    maxTotalSize: 'maxTotalSize'
}
```

##### DEBUG OPTIONS

**debug**: [boolean] enable debug mode (default false)

**debugLogStyle**: [string] custom CSS rules for style debug logs in browser's javascript console (only for browsers that supports this feature, default: *"color: #9900ff"*, purple logs)

**name**: [string] a name for current fileUploader's instance, used in debug logs if provided (default: undefined)

**pluginName**: [string] the plugin's name used in debug logs alongside with name (default: *"FileUploader*)

### Methods
To call a method you need first to get the plugin's instance:

    let test1 = new FileUploader(document.querySelector('#one'));
    test1.fileUploader  // this is the instance

you can then call a method on the instance, ex.:

    test1.fileUploader.getData();

**get**: obtain parameters from the fileUploader instance:

- **currentTotalSize**: total size of currently loaded files
- **currentAvailableSize**: available size left

    let totalSize = test1.fileUploader.get('currentTotalSize');
    let availableSize = test1.fileUploader.get('currentAvailableSize');

**getData**: returns an array of objects, containing the data of every file in the result container; every object of the array has the properties: title, ext, value.

Example:

    let result = test1.fileUploader.getData();


### Callbacks
Together with the options object it is possible to define some callbacks:

**onload(options, totalSize)**: called at plugin start; parameters:
- *options*: the options object for the current plugin's instance
- *totalSize*: current total size (or reloaded files, 0 if none)

**onfileloadStart(index)**: called on every file read start; paremeters:
- *index*: the index used for the new file's DOM

**onfileloadEnd(index, file, totalSize)**: callled on every file read end; parameters:
- *index*: the index used for the new file's DOM
- *file*: the file object for the file just loaded (contains name, type, data (the base64 string) and size)
- *totalSize*: current total size (this file included)

**onfileDelete(index, totalSize)**: called after a file has been removed; parameters:
- *index*: index for the removed file's DOM
- *totalSize*: current total size (already decreased by deleted file' size)

(example)

    $('.fileUploader').fileUploader({
        useFileIcons: false,
        fileMaxSize: 1.7,
        debug: true,
        //callbacks
        onload: function(resultContainer) {
            console.log(started plugin!);
        },
        onfileloadStart: function(index) {
            console.log('new file read started: ' + index);
        },
        onfileloadEnd: function(index, result) {
            console.log('loaded new file:' + index);
            console.log(result);
        }
    });

**fileNameTest(fileName, fileExt, $container)**: a function used on every file upload (*before onfileloadStart*) useful to take actions baed on file name or extension; if it returns false, the file will be skipped; otherwise it must return true to upload the file without changes or a string representing a new name to use for the current file; parameters:
- *fileName*: the name of the file currently being processed
- *fileExt*: the extension of the file currently being processed
- *$container*: the fileUploader's jQuery element that contains visual elements for uploaded files (if needed can be used to append a warning or error message for the user)

(example)
    
    $('.fileUploader').fileUploader({
        filenameTest: function(fileName, fileExt, $container) {
            var allowedExts = ["jpg", "jpeg"];
            var $info = $('<div class="center"></div>');
            var proceed = true;

            // length check
            if (fileName.length > 13) {
                $info.html('Name too long...');
                proceed = false;
            }
            // replace not allowed characters
            fileName = fileName.replace(" ", "-");

            // extension check
            if (allowedExts.indexOf(fileExt) < 0) {
                $info.html('Extension not allowed...');
                proceed = false;
            }
            
            // show an error message
            if (!proceed) {
                $container.append($info);

                setTimeout(function() {
                    $info.animate({opacity: 0}, 300, function() {
                        $(this).remove();
                    });
                }, 2000);
                return false;
            }

            return fileName;
        }
    });

### Translations
It comes with english built-in;
it is possible to override it or add a custom translation by defining it in "langs" object in the constructor

    $('.fileUploader').fileUploader({
        lang: 'es',
        langs: {
            "es": {
                intro_msg: "(Adjuntar Documentos...)",      
                dropZone_msg: "Arrastre los archivos aquí",
                maxSizeExceeded_msg: "Archivo demasiado grande",
                totalMaxSizeExceeded_msg: "Tamaño total superado",
                duplicated_msg: "Duplicate File (ignorado)",
                name_placeHolder: "nombre"
            },
            "it": {
                intro_msg: "(Aggiungi documenti allegati...)",
                dropZone_msg: "Trascina qui i tuoi files...",
                maxSizeExceeded_msg: "File troppo grande",
                totalMaxSizeExceeded_msg: "Dimensione max. superata",
                duplicated_msg: "File duplicato (ignorato)",
                name_placeHolder: "nome"
            }
        }
    });

### <a name="reloadedFiles"></a>Reloaded files
What if you have some files already uploaded to your server (ex. in a previous session) and you want fileUploder to init with them?
There are 2 possibilities:

*1)*
You can re-create the result DOM inside the fileUploader's result container, and the plugin will create visual element such as progress bar, icon, ect... automatically;
the reloaded files' HTML must be a string, passed to **reloadHTML** option in the constructor, and must be in the form:

    // example of DOM to place in result container for a file:
    <div data-index="0" class="uploadedFile">
        <div>File: 0</div>
        <input type="text" name="fileUploader[0][title]" value="try1">
        <input type="text" name="fileUploader[0][extension]" value="jpeg">
        <input type="text" name="fileUploader[0][value]" value="ldjahflòksdjòflaksjdflk...">
        <input type="text" name="fileUploader[0][size]" value="0.3">
    </div>

(the class *uploadedFile* is used for the styling of files already there when plugin initializes; basically it is just a different color, easily customizable editing $reloadedColor variable in fileUploader.scss)

*2)*
You can push all your already uploaded files' data into an array and pass it to the plugin througth the **reloadArray** option (see above in the *Options* section for more details)

### Gulp
It is provided with browsersync's live server and sass version of stylesheet;
use "gulp serve" to execute it and point your browser on "localhost:7000" (prerequisites: node with npm, gulp-cli, needed npm modules (run `npm install` from this folder));


Use **gulp** to build a dist version without executing the live server

### Breaking changes

#### Version 5
A couple of option names have been renamed:

- fileMaxSize -> maxFileSize
- totalMaxSize -> maxTotalSize

#### Version 4
From version 4 jquery dependency has been removed; so now the plugin is instantiated like:

    // now
    let test1 = new FileUploader(document.querySelector('#one'), {...options});
    // before
    ${'#one'}.fileUploader({...options});

and the plugin instance must be accessed in a different way to call plugin methods:

    // now
    test1.fileUploader.getData();
    // before
    $('#one').fileUploader.getData();

### License
Available under <a href="http://opensource.org/licenses/MIT" target="_blank">MIT license</a> (also available in included **license.txt** file).

#### History
5.0.0
-----
- updated plugin labels handling

4.0.0
-----
- removed jquery dependency
- updated source code to ES6

3.7.1
-----
- added minified version of fileUploader.js
- added grunt uglify task

3.6.7
-----
- reorganized files for better usability
- added sass task at startup in gruntfile
- minor improvements (duplicatesWarning, css transitions)

3.4.11
------
- added highlight class for dropzone's dragover

3.4.9
-----
- fixed and improved name test function (on file rename)
- added loadingBarsClasses option

3.4.2
-----
- Fixed file rename bug
- code review

3.2.3
-----
- Added filenameTest callback

3.1.0
-----
- added check for duplicates
- added options allowDuplicates

3.0.2
-----
- fixed bug for reloaded files without ext
- uniformed code

3.0.0
-----
- moved plugin's HTML into js
- added option reloadHTML

##### Old versions
2.5.8
-----
- fixed bug for delete button using custom HTML

2.5.7
-----
- added options for custom buttons content ("linkButtonContent" and "linkButtonContent")

2.5.6
-----
- fixed round bug for available size
- cleaned code

2.5.5
-----
- fixed dropzone bug

2.5.4
-----
- improved debug logs

2.5.3
-----
- updated callbacks for better usability
- added onfileDelete callback

2.3.3
-----
- fixed bug for total size of reloaded files
- added option to customize debug logs

2.3.0
-----
- added reloadArray option
- re-organized some functions

2.0.0
-----
- added get method
- code improvements

[...]