// -----------------------------------------
// 定数
// ----------------------------------------- 
var MAX_NUM = 100; // パーティクルの個数
var INTERVAL_MSEC = 1000 / 60 >> 0; // 1フレームに相当するミリ秒

// -----------------------------------------
// 画像
// ----------------------------------------- 
var image = new Image();
image.src = "particle32.png";


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
// 変数
// -----------------------------------------
//パーティクルの位置
var p_x = new Array(MAX_NUM); 
var p_y = new Array(MAX_NUM); 
//パーティクルの大きさ
var p_size = new Array(MAX_NUM);
//パーティクルの動くスピード
var p_speed_x = new Array(MAX_NUM);
var p_speed_y = new Array(MAX_NUM);
for(var i=0; i<MAX_NUM; i++){
	p_x[i] = 150;
	p_y[i] = 150;
	p_size[i] = (Math.random()*100)%20+1;
	p_speed_x[i] = ((Math.random()-0.5)*10)/3;
	p_speed_y[i] = ((Math.random()-0.5)*10)/3;
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

// パーティクルの初期化

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
  	ctx.fillStyle = "rgb(255, 0, 0)"
  	ctx.fillRect(100, 100, 100, 100);

  	// ctx.translate(0, 50);
  	// ctx.fillRect(0, 0, 50, 50);
  	// ctx.translate(0, -50);

    // 点描 (1×1pxの四角形を描画)
    for(var i=0; i<MAX_NUM; i++){
    	// ctx.arc(p_x[i], p_y[i], p_size[i], 0, Math.PI*2, true);
    	// ctx.fill();
    	// ctx.fillRect(p_x[i], p_y[i], p_size[i], p_size[i]);
    	ctx.drawImage(image, p_x[i], p_y[i], p_size[i], p_size[i]);
    }

    //パーティクルの描画
    for(var i=0; i<MAX_NUM; i++){
    	if(100 < mouseX && mouseX < 200 && 100 < mouseY && mouseY < 200 ){
    		p_x[i] += p_speed_x[i];
    		p_y[i] += p_speed_y[i];
    	}else{
    		p_x[i] = 150;
    		p_y[i] = 150;
    	}
    	if(p_x[i] < 50 || p_x[i] > 250){
    		p_x[i] = 150;
    		p_y[i] = 150;    		
    	}
    }
}
while (n = n.next);  
}

