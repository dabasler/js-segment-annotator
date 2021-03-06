/* Main page dispatcher.
*/
requirejs(['app/index',
           'app/edit',
           'helper/colormap',
           'helper/util'],
function(indexPage, editPage, colormap, util) {
  var  params = util.getQueryParams();
	  dataURL= "data/" + params.dataset + "/" + params.dataset + ".json" // get dataset from parameter
	  

  // Create a colormap for display. The following is an example.
  function createColormap(label, labels) {
    return (label) ?
      colormap.create("single", {
        size: labels.length,
        index: labels.indexOf(label)
      }) :
      [[255, 255, 255],
       [226, 196, 196],
       [64, 32, 32]].concat(colormap.create("hsv", {
        size: labels.length - 3
      }));
  }

  function createColormapLoop(label, n) {
	var col = [[255, 255, 255],[226, 196, 196], [64, 32, 32]].concat(colormap.create("hsv", {size: n + 1 - 3}));
	return col;
  }

  // Load dataset before rendering a view.
  function renderPage(renderer) {
    util.requestJSON(dataURL, function(data) {
	
	if (data.labels[0]=="numbers") {
		data.colormaploop = parseInt(data.labels[1]);
		data.colormap = createColormapLoop("all", data.colormaploop);
		data.labels = ["0"];
	  }else{
		data.colormap = createColormap(params.label, data.labels);
	  }
      renderer(data, params);
    });
  }

  if (params.dataset == null){
	alert('No dataset specified');
  }
  switch(params.view) {
    case "index":
      renderPage(indexPage);
      break;
    case "edit":
      renderPage(editPage);
      break;
    default:
      params.view = "index";
      window.location = util.makeQueryParams(params);
      break;
  }
});
