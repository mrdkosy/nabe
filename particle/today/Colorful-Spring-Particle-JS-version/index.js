/*
 * Colorful Spring Particle  http://wonderfl.net/c/9nuR
 *  の Javascript バージョン 
 */

var canvas = document.getElementById("canvas");
var ctx=canvas.getContext("2d");

var W=465;
var H=465;

var balls = new Array();
var gradations = new Array();

function init(){
  for(var i = 0; i < 50; i++){
    balls.push(new Ball(Math.random()*W, Math.random()*H, Math.random()*10-5,Math.random()*10-5, Math.random()*20+20, Math.random()*255>>0,Math.random()*255>>0,Math.random()*255>>0));
  //グラデーションの設定
  gradations.push("rgba(" + 255 + "," + 255 + "," + 255 + ",");
  gradations.push("rgba(" + 0 + "," + 0 + "," + 0 + ",");
  gradations.push("rgba(" + balls[i].r + "," + balls[i].g + "," + balls[i].b + ",");
  }
 setInterval(draw,33);
}

function draw(){
  $("#canvas").css({"opacity":1,"display":"block"});
  var star = new Array(10);
  
 //黒く塗りつぶす
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, W, H);
 
 //BlendMode.ADD的な感じ？
  ctx.globalCompositeOperation = "lighter";
  
  //描画
  for(i=0; i<balls.length; i++){
    ctx.beginPath();
  var b = balls[i];
    var gradblur = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.size);
  b.alpha += (b.toAlpha-b.alpha)/4.0;
  if(b.alpha > 1) b.alpha = 1;
  
  gradblur.addColorStop(0,gradations[i*3+1]+(b.alpha)+")");
  gradblur.addColorStop(0.4,gradations[i*3+1]+(b.alpha)+")");
    gradblur.addColorStop(0.65,gradations[i*3+2]+(b.alpha*0.9)+")");
    gradblur.addColorStop(0.65,gradations[i*3]+(b.alpha)+")");
    gradblur.addColorStop(0.75,gradations[i*3]+(b.alpha)+")");
    gradblur.addColorStop(0.75,gradations[i*3+2]+(b.alpha*0.9)+")");
  gradblur.addColorStop(1,gradations[i*3+1]+(b.alpha)+")");
  b.toAlpha = 0;
    ctx.fillStyle = gradblur;
    ctx.arc(b.x, b.y, b.size, 0, Math.PI*2, false);
    ctx.fill();
    b.x += b.vx;
    b.y += b.vy;
  
    if(b.x < -20) b.x = W+20;
    if(b.y < -20) b.y = H+20;
    if(b.x > W+20) b.x = -20;
    if(b.y > H+20) b.y = -20;
  
  for (var j = i + 1; j < 50; j++) {
    spring(b, balls[j]);
  }
  }
}

function spring(b1, b2){
  var dx = b2.x - b1.x;
  var dy = b2.y - b1.y;
  var dist = Math.sqrt(dx * dx + dy * dy);
  if(dist < 100){        
    //グラデーションの生成
    var grad = ctx.createLinearGradient(b1.x, b1.y, b2.x, b2.y);
    grad.addColorStop(0,'rgba('+b1.r+','+b1.g+','+b1.b+','+(1-dist/100)+')');
    grad.addColorStop(1,'rgba('+b2.r+','+b2.g+','+b2.b+','+(1-dist/100)+')');
    ctx.strokeStyle = grad;
    //線の描画
    ctx.beginPath();
    ctx.moveTo(b1.x,b1.y);
    ctx.lineTo(b2.x,b2.y);
    ctx.closePath();
    ctx.stroke();
    b1.toAlpha += 0.1;
    b2.toAlpha += 0.1;
    var ax = dx * 0.0075;
    var ay = dy * 0.0075;
    b1.vx += ax / b1.size;
    b1.vy += ay / b1.size;
    b2.vx -= ax / b2.size;
    b2.vy -= ay / b2.size;
  }
}

var Ball = function(x,y,vx,vy,size,r,g,b){
  this.r = r;
  this.g = g;
  this.b = b;
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.size = size;
  this.toAlpha=0.0;
  this.alpha = 1.0;
}
