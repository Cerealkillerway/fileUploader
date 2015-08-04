## File Uploader V 0.0.6

LIVE DEMO: [FileUploader demo](http://www.web-forge.info/projects/fileUploader)

A simple file uploader with HTML5

### Usage
Just call <b>fileUploader()</b> on any jquery element.<br>
Example:

     $('.fileUploader').fileUploader();
     
There are some options and language overrides that can passed to constructor in the form: <b>fileUploader({options}{translation})</b> (see below).

### Options
<b>lang</b>: language to use (default 'en')

<b>fileMaxSize</b>: maximum allowed file size in MB (default 50)

<b>useFileIcons</b>: use icons for each file depending on file type (default true)

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

### Translations
It comes with english and italian translations built-in;
it is possible to override them or add a custom translation by defining it as a second argument in the constructor:

    $('.fileUploader').fileUploader({
        lang: 'es'
    },
    {
        "es": {
            intro_msg: "(Adjuntar Documentos...)",      
            dropZone_msg: "Arrastre los archivos aquí",
            maxSizeExceeded_msg: "Archivo demasiado grande"
        }
    });


### Grunt
It is provided with livereload and sass version of stylesheet;
use "grunt" to execute it and point your browser on "localhost:7000" (prerequisites: ruby, sass ("gem install sass"), grunt-cli, grunt and needed plugins ("npm install"), browser livereload extension);

Use --port option to serve it on another port; example:
grunt --port=9000

### License
Available under <a href="http://opensource.org/licenses/MIT" target="_blank">MIT license</a>
##### History
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
