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
var MAX_NUM = 3000; // パーティクルの個数
var INTERVAL_MSEC = 1000 / 60 >> 0; // 1フレームに相当するミリ秒

// -----------------------------------------
// クラス定義
// -----------------------------------------
/**
* パーティクル
*/
function Particle() {
  // コンストラクタを呼び出し
  this.initialize.apply(this, arguments);
}
Particle.prototype = {
  /** コンストラクタ */
  initialize: function(x, y) {
    this.x = x;
    this.y = y;
  },
  x : 0, // X座標
  y : 0, // X座標
  vx : 0, // X方向の速さ
  vy : 0, // Y方向の速さ
  next : null // LinkedListの参照
};


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

// イベントハンドラの登録
canvas.onmousemove = mouseMoveHandler;
setInterval(enterFrameHandler, INTERVAL_MSEC);


// -----------------------------------------
// イベントハンドラ
// -----------------------------------------

/**
* マウスが動いたとき
*/
function mouseMoveHandler(e) {
  var rect = e.target.getBoundingClientRect();
  // マウス座標の更新
  mouseX = e.clientX - rect.left;  
  mouseY = e.clientY - rect.top;  
}

/**
* タイマー
*/
function enterFrameHandler() {
  
  // 背景を黒く塗りつぶす
  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.fillRect(0, 0, 465, 465);
  
  // パーティクルの塗りの色を設定
  ctx.fillStyle = "rgb(100, 200, 255)";
  
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
    
    n.vx += -accX/30;
    n.vy += -accY/30;
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
    
    // 点描 (1×1pxの四角形を描画)
    ctx.fillRect(n.x, n.y, 1, 1);
  }
  while (n = n.next);  
}

