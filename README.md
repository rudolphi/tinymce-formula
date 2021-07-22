# tinyMCE formula plugin

Formula plugin for tinyMCE WYSIWYG editor. Allows user to add equations and formulas inside tinymce.

## Browser compatibility

* IE8+
* Chrome
* Firefox
* Safari
* Opera

## Dependencies

* [tinyMCE (Version 5)](http://www.tinymce.com/)

## Usage

Install using bower.

```
bower install tinymce-formula
```

Install using npm.

```
npm install tinymce-formula
```

Or copy the source of the plugin to the plugins directory of your tinyMCE installation.
Add the formula plugin to your tinyMCE configuration

```javascript
plugins: "... formula",
```

Add optional configuration settings for the formula plugin. 

```javascript
formula: {
    path: 'https://path/to/public/plugin/folder',
    mlang: 'mml',
},
```

## Configuration

### path (optional if plugin installed inside `tinymce/plugins` folder, required otherwise)

If you have installed the plugin in a different folder than the ```tinymce/plugins``` folder then you need to specify 
the full path (public) where the plugin is installed.

###mlang (optional, defaults to 'latex')

If you want to default the editor to MathML instead of latex, define ```mlang: 'mml'``` in the options. The only two supported variables are ```latex``` and ```mml```.

## License

MIT licensed

Copyright (C) 2016 iCAP Lyon1, Panagiotis Tsavdaris
