## File Uploader V 1.0.0

LIVE DEMO: [FileUploader demo](http://www.web-forge.info/projects/fileUploader)

A file uploader skeleton that uses HTML5 file reader API.

### Usage
Just call <b>fileUploader()</b> on any jquery element.<br>
Example:

     $('.fileUploader').fileUploader();

This skeleton handle the client-side file reading; then the files must be sended (ex. with an ajax call) to a server procedure that will save them somewhere (filesystem, db, ...).
You can use the "getData" method to get all files' data and then or handle everything on your own by iterating result container's children elements;
If needed you can also populate the result container with previously uploaded file's data (onload callback is suitable for this purpose).

There are some options that can passed to constructor in the form:

    $('.fileUploader').fileUploader({options})

(see below).

### Options
<b>lang</b>: language to use (default 'en'); see "translations" section for overrides and new language definitions

<b>fileMaxSize</b>: maximum allowed file size in MB (default 50)

<b>useFileIcons</b>: use icons for each file depending on file type (default true)

<b>reloadedFilesClass</b>: a class to style previously uploaded files (files uploaded during a previous session and now retrieved and placed in the result container) (default 'reloadedElement')

<b>debug</b>: enable debug mode (default false)

<b>useLoadingBars</b>: show a progress bar while reading each file (default true)

<b>resultContainer</b>: set the element to be used as container for reader's results (by default this is the hidden $(.result) element of the fileUploader; can be any jQuery wrapped DOM element)

<b>resultFileContainerClass</b>: custom class to use for each reader's result container (default "file-")

<b>defaultFileExt</b>: extension to use for files with no extension (default "")

<b>defaultMimeType</b>: MIME type to use for files with no extension (default "")

In the result container, each reader's result is inserted as a DIV with 3 nested INPUT elements (title, extension, value (the base64 string)); each of these 3 elements has a name attribute in the form "prefix[index][name]"

By default the prefix is "fileUploader", and the names are ["title", "extension", "value"].<br>

If needed it is possible to change them:

<b>resultPrefix</b> custom name-prefix for result elements

<b>resultInputNames</b> custom array of names for the 3 result elements created for each file (ordered)

#### Callbacks
Together with the options object it is possible to define some callbacks:

<b>onload</b>: called at plugin start; receives the resultContainer element (jQuery) as first parameter

<b>onfileloadStart</b>: called on every file read start; receives the new file index as first parameter

<b>onfileloadEnd</b>: callled on every file read end; receives the file index as first parameter and the result base64 strint as second

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
                name_placeHolder: "nombre"
            }
        }
    });

### Methods

<b>getData</b>: returns an array of objects, containing the data of every file in the result container; every object of the array has the properties: title, ext, value.

Example:

    var result = $('.fileUploader').fileUploader('getData');

### Grunt
It is provided with livereload and sass version of stylesheet;
use "grunt" to execute it and point your browser on "localhost:7000" (prerequisites: ruby, sass ("gem install sass"), grunt-cli, grunt and needed plugins ("npm install"), browser livereload extension);

Use --port option to serve it on another port; example:
<b>grunt --port=9000</b>

### License
Available under <a href="http://opensource.org/licenses/MIT" target="_blank">MIT license</a>

##### History
v1.0.0
------
- complete repackage following jquery best practices for jquery plugins
- solved "reload same file" bug
- code improvements
- graphical improvements

v0.0.7
------
- added support for previously uploaded files
- added callbacks
- minor bug fixes

v0.0.5
------
- fixed bug for files without extension
- added file size limit parameter
- improved debug mode

v0.0.3
------
- real progress indicator
- fixed flickering of loaded elements
- fixed Gruntfile

v0.0.0
------
- first version
