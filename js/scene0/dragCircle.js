
var wW=window.innerWidth;
var wH=window.innerHeight; 
var PI_2        = Math.PI * 2;
var canvasW     = wW;
var canvasH     = wH;
var numMovers   = 600;
var friction    = .96;
var movers      = [];

var canvas;
var ctx;
var canvasDiv;
var outerDiv;

var mouseX;
var mouseY;
var mouseVX;
var mouseVY;
var prevMouseX;
var prevMouseY;
var isMouseDown;


//circle
var position_x =  new Array(28);
var position_y =  new Array(28);
var radius = new Array(28);
var color = new Array(28);
var PreMouseX = 0;
var PreMouseY = 0;


function init(){
    canvas = document.getElementById("mainCanvas");
    if ( canvas.getContext ){
        setup();
        setInterval( draw , 33 );
    }
}

function setup(){
    outerDiv  = document.getElementById("outer");
    canvasDiv = document.getElementById("canvasContainer");
    ctx       = canvas.getContext("2d");
    
    
    document.onmousedown = onDocMouseDown;
    document.onmouseup   = onDocMouseUp;
    document.onmousemove = onDocMouseMove;
    
    
    //circle position
    for(var j=0; j<4; j++){
        for(var i=0; i<7; i++){
            position_x[i] = (canvasW/7)/2+((canvasW/7)*i);
            position_y[j] = (canvasH/4)/2+((canvasH/4)*j);
            radius[i+(j*7)] = 60;
            color[i+(j*7)] = 40;
        }
    }
    
}

function draw(){

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(8,8,12,.65)";
    ctx.fillRect( 0 , 0 , canvasW , canvasH );
    ctx.globalCompositeOperation = "lighter";
    
    
    //circle
    for(var j=0; j<4; j++){
        for(var i=0; i<7; i++){
            var distance = Math.sqrt(Math.pow(mouseX-position_x[i], 2) + Math.pow(mouseY-position_y[j], 2));
            if(distance <70){
                radius[i+(j*7)] = 82;
                color[i+(j*7)] = 255;
            }else if(distance <160){
                radius[i+(j*7)] = 75;
                color[i+(j*7)] = 80;
            }else{
                radius[i+(j*7)] = 60;
                color[i+(j*7)] = 40;
            }
            // ctx.strokeStyle = 'rgb(255, 255, 255)';
            ctx.strokeStyle = 'rgb(' + String(color[i+(j*7)]) + ',' + String(color[i+(j*7)]) + ',' + String(color[i+(j*7)]) + ')';
            circle(position_x[i], position_y[j], radius[i+(j*7)]);
        }
    }
    
    var a = Math.sqrt(Math.pow(PreMouseX-mouseX, 2)+Math.pow(PreMouseY-mouseY, 2)); //加速度検知
    if(a>80){
        ctx.globalCompositeOperation = "source-in";
        ctx.fillStyle = 'rgba(170, 170, 170, 1.0)';
        ctx.fillRect(0, 0, canvasW, canvasH);	
    }
    PreMouseX = mouseX;
    PreMouseY = mouseY;	
    
}


function onDocMouseMove( e ){
    var ev = e ? e : window.event;
    mouseX = ev.clientX - outerDiv.offsetLeft - canvasDiv.offsetLeft;
    mouseY = ev.clientY - outerDiv.offsetTop  - canvasDiv.offsetTop;
}

function onDocMouseDown( e ){
    isMouseDown = true;
    return false;
}

function onDocMouseUp( e ){
    isMouseDown = false;
    return false;
}

function rect( context , x , y , w , h ){
    context.beginPath();
    context.rect( x , y , w , h );
    context.closePath();
    context.fill();
}

function circle(x, y, radius){
    ctx.beginPath();
    ctx.lineWidth = 6;
    ctx.arc(x,y,radius,0,Math.PI*2.0,true);
    ctx.stroke();
    
}


function trace( str ){
    document.getElementById("output").innerHTML = str;
}
