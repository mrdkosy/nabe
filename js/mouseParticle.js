// -----------------------------------------
// 定数
// ----------------------------------------- 
var MAX_NUM = 60; // パーティクルの個数
var INTERVAL_MSEC = 1000 / 60 >> 0; // 1フレームに相当するミリ秒

// -----------------------------------------
// 画像
// ----------------------------------------- 
var image = new Image();
image.src = "./img/particle322.png";

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
//hover判定
var hantei;
for(var i=0; i<MAX_NUM; i++){
	p_x[i] = hoverX;
	p_y[i] = hoverY;
	p_size[i] = (Math.random()*100)%30+5;
	p_speed_x[i] = ((Math.random()-0.5)*10)/5;
	p_speed_y[i] = ((Math.random()-0.5)*10)/5;
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
var canvas = document.getElementById("mParticle");
var ctx = canvas.getContext("2d");

// パーティクルの初期化

// イベントハンドラの登録
canvas.onmousemove = mouseMoveHandler;
setInterval(enterFrameHandler, INTERVAL_MSEC);


// -----------------------------------------
// マウス・a:hover位置の判定
// -----------------------------------------
//hoverの中心
var hoverX, hoverY;
//hover aタグの大きさ
var aw, ah;
//スクロール量

$(function(){
//a
$("#a").hover(
    function(){//hover時
      hantei = 1;
      aw = document.getElementById("a").clientWidth;
      ah = document.getElementById("a").clientHeight;
      var elm = document.getElementById("a") ;
      var nY = $( window ).scrollTop() ; 
      hoverX = (($( elm ).offset().left*2)+aw)/2;
      hoverY = ((($( elm ).offset().top)*2)+ah)/2-nY;
    },
    function(){//それ以外
      hantei = 0;
    }
    );
  //a2
  $("#a2").hover(
    function(){//hover時
      hantei = 1;
      aw = document.getElementById("a2").clientWidth;
      ah = document.getElementById("a2").clientHeight;
      var elm = document.getElementById("a2") ;
      var nY = $( window ).scrollTop() ; 
      hoverX = (($( elm ).offset().left*2)+aw)/2;
      hoverY = ((($( elm ).offset().top)*2)+ah)/2-nY;
    },
    function(){//それ以外
      hantei = 0;
    }
    );
//a3
$("#a3").hover(
    function(){//hover時
      hantei = 1;
      aw = document.getElementById("a3").clientWidth;
      ah = document.getElementById("a3").clientHeight;
      var elm = document.getElementById("a3") ;
      var nY = $( window ).scrollTop() ; 
      hoverX = (($( elm ).offset().left*2)+aw)/2;
      hoverY = ((($( elm ).offset().top)*2)+ah)/2-nY;
    },
    function(){//それ以外
      hantei = 0;
    }
    );
//a4
$("#a4").hover(
    function(){//hover時
      hantei = 1;

      aw = document.getElementById("a4").clientWidth;
      ah = document.getElementById("a4").clientHeight;
      var elm = document.getElementById("a4") ;
      var nY = $( window ).scrollTop() ; 
      hoverX = (($( elm ).offset().left*2)+aw)/2;
      hoverY = ((($( elm ).offset().top)*2)+ah)/2-nY;
    },
    function(){//それ以外
      hantei = 0;
    }
    );

});

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
  var bw = document.getElementById("side-bar").clientWidth;
  var bh = document.getElementById("side-bar").clientHeight;
  ctx.fillStyle = "rgba(50, 50, 50, .8)";
  ctx.fillRect(0, 0, bw, bh);
  

  var gravityX = mouseX;
  var gravityY = mouseY;
  
  var n = first;

  // Linked Listによる高速イテレーション  
  do {
    //パーティクルの描画
    for(var i=0; i<MAX_NUM; i++){
    	ctx.drawImage(image, p_x[i], p_y[i], p_size[i], p_size[i]);
    }

    //パーティクルの描画
    for(var i=0; i<MAX_NUM; i++){
      if(hantei == 1){
        p_x[i] += p_speed_x[i];
        p_y[i] += p_speed_y[i];
        if(p_x[i] < 0 || p_x[i] > aw ){
          p_x[i] = hoverX;
          p_y[i] = hoverY;        
        }
      }else{
        p_x[i] = -1000;
        p_y[i] = 10000000;
      }
    }

  }
  while (n = null);  
}

