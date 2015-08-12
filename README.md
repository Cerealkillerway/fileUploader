## File Uploader v1.1.3

LIVE DEMO: [FileUploader demo](http://www.web-forge.info/projects/fileUploader)

A file uploader skeleton that uses HTML5 file reader API.

### Usage
Just call **fileUploader()** on any jquery element.<br>
Example:

     $('.fileUploader').fileUploader();

This skeleton handle the client-side file reading; then the files must be sended (ex. with an ajax call) to a server procedure that will save them somewhere (filesystem, db, ...).
You can use the "getData" method to get all files' data and then or handle everything on your own by iterating result container's children elements;
If needed you can also populate the result container with previously uploaded file's data (onload callback is suitable for this purpose).

There are some options that can passed to constructor in the form:

    $('.fileUploader').fileUploader({options})

(see below).

### Options
**lang**: language to use (default 'en'); see "translations" section for overrides and new language definitions

**fileMaxSize**: maximum allowed file size in MB (default 50)

**totalMaxSize**: maximum allowd upload size for all files together (default 1000)

**useFileIcons**: use icons for each file depending on file type (default true)

**reloadedFilesClass**: a class to style previously uploaded files (files uploaded during a previous session and now retrieved and placed in the result container) (default 'reloadedElement')

**debug**: enable debug mode (default false)

**useLoadingBars**: show a progress bar while reading each file (default true)

**resultContainer**: set the element to be used as container for reader's results (by default this is the hidden $(.result) element of the fileUploader; can be any jQuery wrapped DOM element)

**resultFileContainerClass**: custom class to use for each reader's result container (default "file-")

**defaultFileExt**: extension to use for files with no extension (default "")

**defaultMimeType**: MIME type to use for files with no extension (default "")

In the result container, each reader's result is inserted as a DIV with 4 nested INPUT elements (title, extension, value (the base64 string) and size (in MB)); each of these 4 elements has a name attribute in the form "prefix[index][name]"

By default the prefix is "fileUploader", and the names are ["title", "extension", "value", "size"].<br>

If needed it is possible to change them:

**resultPrefix** custom name-prefix for result elements

**resultInputNames** custom array of names for the 4 result elements created for each file (ordered)

#### Callbacks
Together with the options object it is possible to define some callbacks:

**onload**: called at plugin start; receives the resultContainer element (jQuery) as first parameter

**onfileloadStart**: called on every file read start; receives the new file index as first parameter

**onfileloadEnd**: callled on every file read end; receives the file index as first parameter and the result base64 strint as second

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

### Translations
It comes with english and italian translations built-in;
it is possible to override them or add a custom translation by defining it in "langs" object in the constructor

    $('.fileUploader').fileUploader({
        lang: 'es',
        langs: {
            "es": {
                intro_msg: "(Adjuntar Documentos...)",      
                dropZone_msg: "Arrastre los archivos aquí",
                maxSizeExceeded_msg: "Archivo demasiado grande",
                totalMaxSizeExceeded_msg: "Tamaño total superado",
                name_placeHolder: "nombre"
            }
        }
    });

### Methods

**getData**: returns an array of objects, containing the data of every file in the result container; every object of the array has the properties: title, ext, value.

Example:

    var result = $('.fileUploader').fileUploader('getData');

### Grunt
It is provided with livereload and sass version of stylesheet;
use "grunt" to execute it and point your browser on "localhost:7000" (prerequisites: ruby, sass ("gem install sass"), grunt-cli, grunt and needed plugins ("npm install"), browser livereload extension);

Use --port option to serve it on another port; example:
**grunt --port=9000**

### License
Available under <a href="http://opensource.org/licenses/MIT" target="_blank">MIT license</a> (also available in included **license.txt** file).

##### History
1.1.3
-----
- added support for total max size

1.0.0
------
- complete repackage following jquery best practices for jquery plugins
- solved "reload same file" bug
- code improvements
- graphical improvements

0.0.7
------
- added support for previously uploaded files
- added callbacks
- minor bug fixes

0.0.5
------
- fixed bug for files without extension
- added file size limit parameter
- improved debug mode

0.0.3
------
- real progress indicator
- fixed flickering of loaded elements
- fixed Gruntfile

0.0.0
------
- first version
