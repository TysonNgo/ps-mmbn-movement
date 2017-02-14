/**
 * @file
 * This is a script that creates layers for the 
 * Mega Man Battle Network battle movement animation.
 *
 * before running the script, select the layer
 * containing the first frame of the idle animation
 * of your character sprite 
 * (ensure that the background of the sprite is transparent)
 *
 * Note: Photoshop CS5 was used.
 */


/**
 * @function selectColumn
 * @description Selects a 1 px wide column from a given point
 *
 * @param {Document} document The psd of interest
 * @param {number} x The x coordinate of the initial point
 * @param {number} y The y coordinate of the initial point
 * @param {number} offsetY The y offset from the initial point
 * @return {undefined}
 */
 function selectColumn(document,x,y,offsetY){
	var column = [
		[x,y],
		[x+1,y],
		[x+1,y+offsetY],
		[x,y+offsetY],
	]
	document.selection.select(column,SelectionType.EXTEND);
}

/**
 * @function stripeSelect
 * @description Makes a vertical stripe pattern selection
 *
 * @param {Document} document The psd of interest
 * @return {undefined}
 */
function stripeSelect(document){
	var bounds = document.activeLayer.bounds;
	var xRange = bounds[2]-bounds[0];
	var offsetY = bounds[3]-bounds[1];

	function f(x){
		return Math.max(Math.round(Math.cos((x-(xRange/4))*(2*Math.PI/xRange))+3),2);
	}

	var previouslySelected = false;
	for (var i=0;i<xRange;i++){
		if (!previouslySelected && i % f(i) == 0){
			selectColumn(document,bounds[0]+i,bounds[1],offsetY);
			previouslySelected = true;
		} else if (previouslySelected){
			previouslySelected = false;
		}
	}
}

/**
 * @function lightenFrame
 * @description Lightens the layer by adjusting levels
 *
 * @param {ArtLayer} layer The layer of interest 
 * @return {undefined}
 */
function lightenFrame(layer){
	layer.adjustLevels(0,255,1.5,0,255);
}

/**
 * @function move1
 * @description Produces a layer of the 1st frame
 * of the movement animation
 *
 * @param {Document} document The psd of interest
 * @return {undefined}
 */
function move1(document){
	var frames = [];
	for (var i=0;i<2;i++){
		frames.push(document.activeLayer.duplicate());
		document.activeLayer = frames[i];
	}
	document.activeLayer = frames[0];
	document.activeLayer.name = "move1";
	document.activeLayer.translate(0,-1);

	stripeSelect(document);
	document.selection.translate(0,yPixelShift);

	document.selection.translateBoundary(2);
	var bounds = document.selection.bounds;
	var oneHalfY = (bounds[1]+bounds[3])/2;
	var topHalf = [
		[bounds[0],bounds[1]],
		[bounds[2],bounds[1]],
		[bounds[2],oneHalfY],
		[bounds[0],oneHalfY]
	];
	document.selection.select(topHalf,SelectionType.DIMINISH);
	document.selection.translate(0,Math.round(yPixelShift*1.5));

	frames.pop().merge()
	document.selection.deselect();

	lightenFrame(frames[0]);
	return frames[0];
}

/**
 * @function move2
 * @description Produces a layer of the 2nd frame
 * of the movement animation
 *
 * @param {Document} document The psd of interest
 * @return {undefined}
 */
function move2(document){
	document.activeLayer = document.activeLayer.duplicate();
	document.activeLayer.name = "move2";
	stripeSelect(document);
	document.selection.clear();
	document.selection.translateBoundary(1);
	document.selection.translate(0,yPixelShift);
	document.selection.deselect();
}

/**
 * @function move3
 * @description Produces a layer of the 3rd frame
 * of the movement animation
 *
 * @param {Document} document The psd of interest
 * @return {undefined}
 */
function move3(document){
	document.activeLayer = document.activeLayer.duplicate();
	document.activeLayer.name = "move3";

	var bounds = document.activeLayer.bounds;
	var oneThirdX = (bounds[2]+2*bounds[0])/3;
	var twoThirdX = (2*bounds[2]+bounds[0])/3;
	var oneHalfY = (bounds[3]+bounds[1])/2;

	// vertical selection 1/3 in width from the left
	document.selection.select([
		[bounds[0],bounds[1]],
		[oneThirdX,bounds[1]],
		[oneThirdX,bounds[3]],
		[bounds[0],bounds[3]]
	]);
	document.selection.translate(2);

	// vertical selection 1/3 in width from the right
	document.selection.select([
		[twoThirdX,bounds[1]],
		[bounds[2],bounds[1]],
		[bounds[2],bounds[3]],
		[twoThirdX,bounds[3]]
	]);
	document.selection.translate(-2);

	document.activeLayer = document.activeLayer.duplicate();
	// horizontal selection 1/2 in height from the top
	document.selection.select([
		[bounds[0],bounds[1]],
		[bounds[2],bounds[1]],
		[bounds[2],oneHalfY],
		[bounds[0],oneHalfY]
	]);
	document.selection.translate(0,yPixelShift);

	document.activeLayer.merge()
	document.selection.deselect();
	lightenFrame(document.activeLayer);
	lightenFrame(document.activeLayer);
}

app.preferences.rulerUnits = Units.PIXELS;

var document = app.activeDocument;
var yRange = document.activeLayer.bounds[3]-document.activeLayer.bounds[1];
var yPixelShift = -Math.floor(Math.pow(yRange,1/3));

document.activeLayer.visible = true;

move1(document);
move2(document);
move3(document);
