// forked from clockmaker's "Particle 3000" http://jsdo.it/clockmaker/particle
/*
* Canvas での擬似lock/unlockとか使って無理やり 10000 パーティクル
* 参考: http://ss-o.net/game2d/tech.html#C12
*/
/**
* みんな大好きパーティクル
* (JavaSript, HTML5バージョン)
*
* @author clockmaker 
* @see http://clockmaker.jp/blog/
*
* wonderflのパーティクル祭りを参考
* http://wonderfl.net/c/436W/
*/

// -----------------------------------------
// 定数
// ----------------------------------------- 
var MAX_NUM = 10000; // パーティクルの個数
var FPS = 60;
var FRAMERATE = FPS / 1000 >> 0; // フレームレート

// -----------------------------------------
// クラス定義
// -----------------------------------------
/**
* パーティクル
*/
function Particle(x,y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.next = null;
}

// -----------------------------------------
// 初期化
// -----------------------------------------

// 変数の初期化
var mouseX = 0;
var mouseY = 0;
var first;
var old;

// キャンバスの初期化
var canvas = document.getElementById("world");
var ctx = canvas.getContext("2d");  
var width = canvas.width;
var height = canvas.height;
var pixels = ctx.getImageData(0, 0, width, height);
var data = pixels.data;

var setPixel = (function(){
  var data = pixels.data;
  function _setPixel(x, y, r, g, b){
    if (x >= 0 && x < width && y >= 0 && y < height) {
      var idx = ((x|0) + (y|0) * width)*4;
      data[idx+0] = r;
      data[idx+1] = g;
      data[idx+2] = b;
      data[idx+3] = 252;
    }
  }
  return _setPixel;
})();
function faidout(){
  for (var i = 3, l = data.length;i < l;i+=4){
    var a = data[i];
    if(a < 253) {
      if (a < 36) {
        data[i] = 0;
      } else if (a < 66) {
        data[i] *= 0.985;
      } else {
        data[i] *= 0.76;
        //data[i] *= 0.98;
      }
    }
  }
}

// パーティクルの初期化
for(var i=0; i<MAX_NUM; i++) {
  var p = new Particle(
    Math.random() * 465,
    Math.random() * 465
  );
  
  if(first == null) {
    first = old = p;
  } else {
    old.next = p;
    old = p;
  }
}
// FPS の表示
var fps_view = document.getElementById('fps');
var Counter = 0, last = +new Date();

// イベントハンドラの登録
canvas.onmousemove = mouseMoveHandler;
setInterval(enterFrameHandler, FRAMERATE);


// -----------------------------------------
// イベントハンドラ
// -----------------------------------------

/**
* マウスが動いたとき
*/
function mouseMoveHandler(e) {
  var rect = e.target.getBoundingClientRect();
  // マウス座標の更新(もっとスマートな方法ある？)
  mouseX = e.clientX - rect.left;  
  mouseY = e.clientY - rect.top;  
}

/**
* タイマー
*/
function enterFrameHandler() {
  
  // 描画をリセット
  //ctx.fillStyle = "rgb(0, 0, 0)";
  //ctx.fillRect(0, 0, 465, 465);
  //ctx.fillStyle = "rgb(200, 200, 255)";
  
  var gravityX = mouseX;
  var gravityY = mouseY;
  
  var n = first;

  // Linked Listによる高速イテレーション  
  do {
    var diffX = gravityX - n.x;
    var diffY = gravityY - n.y;
    var acc = 50 / (diffX * diffX + diffY * diffY);
    var accX = acc * diffX;
    var accY = acc * diffY;
    
    n.vx += accX;
    n.vy += accY;
    n.x += n.vx;
    n.y += n.vy;
    
    n.vx *= 0.96;
    n.vy *= 0.96;
    
    if (n.x > 465)
      n.x = 0;
    else if (n.x < 0)
      n.x = 465;
    if (n.y > 465)
      n.y = 0;
    else if (n.y < 0)
      n.y = 465;
    
    // 点描
    setPixel(n.x, n.y, 255, 255, 255);
  }
  while (n = n.next);
  faidout();
  ctx.putImageData(pixels, 0, 0);
  if (++Counter === FPS){
    var now = +new Date();
    var _f = 1000 / ((now - last) / Counter);
    last = now;
    Counter = 0;
    fps_view.innerHTML = 'FPS '+_f.toFixed(2);
  }
}

