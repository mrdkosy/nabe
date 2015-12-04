

var screenSize_x;
var screenSize_y;

var windowSize_x;
var windowSize_y;
Size();
function Size(){
	screenSize_x = window.parent.screen.width;
	screenSize_y = window.parent.screen.height;

	windowSize_x = window.innerWidth;
	windowSize_y = window.innerHeight;
	setTimeout("Size()", 1000);
}