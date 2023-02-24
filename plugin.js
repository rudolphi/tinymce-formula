(function(tinymce){
  tinymce.create('tinymce.plugins.Formula', {
    init: function(editor, url) {
      var options = editor.getParam('formula') || {};
      var fOptions = {}
      fOptions.path = url;
      fOptions.mlang = options.mlang || 'latex';

      var icon_svg = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 121.83 122.88">' +
        '<path d="M 32.61 34.37 L 28.54 38.97 L 28.94 40.71 L 39.42 40.71 C 37.28 53.09 35.68 64.25 32.61 81.45 C 28.94 103.39 26.83 108.78 25.58 110.75 C 24.48 112.7 22.9 113.71 2.76 113.71 C 18.41 113.71 14.16 111.85 11.88 109.74 C 11.06 109.18 10.09 109.32 9.06 110 C 7 111.74 5 114.42 5 116.82 C 4.88 120.06 9.21 122.88 13.34 122.88 C 16.98 122.88 22.34 120.6 27.98 115.24 C 35.69 107.93 41.46 97.9 46.28 76.22 C 49.38 62.38 50.84 53.38 53.02 40.72 L 66.04 39.54 L 68.86 34.37 L 54.2 34.37 C 57.99 10.53 60.95 7 64.59 7 C 67.01 7 69.83 8.86 73.07 12.52 C 74.03 13.84 75.47 13.7 76.57 12.8 C 78.42 11.7 80.7 8.88 80.85 6.32 C 80.96 3.5 77.6 0 71.82 0 C 66.58 0 58.55 3.5 51.8 10.38 C 45.88 16.65 42.78 24.48 40.64 34.37 L 32.61 34.37 Z" style=""/>' +
        '<path d="M 58.27 80.33 C 62.31 74.95 64.73 73.16 65.98 73.16 C 67.27 73.16 68.3 74.43 70.51 81.57 L 74.29 93.76 C 66.98 104.94 61.63 111.17 58.38 111.17 C 57.3 111.17 56.21 110.83 55.44 110.07 C 54.68 109.31 53.84 108.68 53.02 108.68 C 50.34 108.68 47.02 111.93 46.96 115.96 C 46.9 120.07 49.78 123.01 53.56 123.01 C 60.05 123.01 65.54 116.64 76.14 99.75 L 79.24 110.2 C 81.9 119.18 85.02 123.01 88.92 123.01 C 93.74 123.01 100.22 118.9 107.29 107.79 L 104.33 104.41 C 100.08 109.53 97.26 111.93 95.59 111.93 C 93.73 111.93 92.1 109.09 89.95 102.11 L 85.42 87.38 C 88.1 83.43 90.74 80.11 93.06 77.46 C 95.82 74.31 97.95 72.97 99.4 72.97 C 100.62 72.97 101.68 73.49 102.34 74.22 C 103.21 75.18 103.73 75.63 104.76 75.63 C 107.09 75.63 110.69 72.67 110.82 68.75 C 110.94 65.11 108.68 62.01 104.76 62.01 C 98.84 62.01 93.62 67.11 83.57 82.05 L 81.5 75.64 C 78.6 66.64 76.68 62.01 72.64 62.01 C 67.94 62.01 61.48 67.79 55.16 76.95 L 58.27 80.33 Z" style=""/>' +
        '</svg>'

      editor.ui.registry.addIcon('formula', icon_svg)

      editor.ui.registry.addToggleButton('formula', {
        icon: 'formula',
        tooltip: 'Insert Formula',
        onAction: function (buttonApi) {
          showFormulaDialog(editor, fOptions);
        },
        onSetup: function(api) {
          var editorEventCallback = function(eventApi) {
            api.setActive(isFormulaElement(eventApi.element));
          };
          var editorDblClickCallback = function(eventApi) {
            if (isFormulaElement(editor.selection.getNode())) {
              showFormulaDialog(editor, fOptions);
            }
          };

          editor.on('NodeChange', editorEventCallback);
          editor.on('DblClick', editorDblClickCallback);
          return function(api) {
            editor.off('NodeChange', editorEventCallback);
            editor.off('DblClick', editorDblClickCallback);
          };
        },
      });
    }
  });
  tinymce.PluginManager.requireLangPack('formula','en,es,fr_FR');
  tinymce.PluginManager.add('formula', tinymce.plugins.Formula);

  function showFormulaDialog(editor, fOptions) {
    tinymce.activeEditor.windowManager.open({
      title: 'Formula',
      size: 'large',
      body: {
        type: 'panel',
        items: [
          {
            type: 'htmlpanel',
            html: buildIFrame(editor, fOptions),
          }
        ]
      },
      buttons: [
        {
          type: 'cancel',
          text: 'Cancel',
        },
        {
          type: 'submit',
          text: 'Insert Formula',
        }
      ],
      onSubmit: function (e) {
        if(window.frames['tinymceFormula'] && window.frames['tinymceFormula'].getData) {
          window.frames['tinymceFormula'].getData(function(src, mlang, equation) {
            if(src) {
				if (mlang != "mml") {
					editor.insertContent('<img class="fm-editor-equation" src="' + src + '" data-mlang="' + mlang + '" data-equation="' + encodeURIComponent(equation) + '"/>');
				} else {
					editor.insertContent('<math>' + equation + '</math>');
				}
              e.close();
            } else {
              e.close();
            }
          });
        }
      }
    });
  }

  function isFormulaElement(element) {
    return (element && (getMathElement(element) || (element.className.indexOf('fm-editor-equation')>-1 && element.nodeName.toLowerCase() === 'img')));
  }
  
  function getMathElement(element) {
	  if (element) {
		if (element.nodeName.toLowerCase() === 'math') {
			return element;
		}
		return getMathElement(element.parentNode);
	  }
  }

  function buildIFrame(editor, fOptions){
    var url = fOptions.path;
    var currentNode = editor.selection.getNode(),mathElement = getMathElement(currentNode);
	if (mathElement) {
		currentNode = mathElement;
		editor.selection.select(currentNode); // must replace all
	}
    var lang = editor.getParam('language') || 'en';
    var mlangParam = '&mlang=' + fOptions.mlang;
    var equationParam = '';
    if (currentNode.nodeName.toLowerCase() == 'img' && currentNode.className.indexOf('fm-editor-equation')>-1) {
      if (currentNode.getAttribute('data-mlang')) mlangParam = "&mlang=" + currentNode.getAttribute('data-mlang');
      if (currentNode.getAttribute('data-equation')) equationParam = '&equation=' + currentNode.getAttribute('data-equation');
    } else if (currentNode.nodeName.toLowerCase() == 'math') {
		mlangParam = "&mlang=mml";
		equationParam = "&equation=" + encodeURIComponent(currentNode.innerHTML);
	}
    var html = '<iframe name="tinymceFormula" id="tinymceFormula" src="'+ url + '/index.html'+ '?lang='+ lang + mlangParam + equationParam + '" scrolling="no" frameborder="0" style="width:100%; height:515px"></iframe>';
    return html;
  }
})(window.tinymce);