// forked from veddlag's "パーティクルで文字を浮かび上がらせてみる" http://jsdo.it/veddlag/4vbs
var draft = function(text) {
  this.draft_canvas = document.createElement('canvas');
  this.dcc = this.draft_canvas.getContext('2d');

  this.real_canvas = document.getElementById('canvas');
  this.cc = this.real_canvas.getContext('2d');
  
  //init
  this.draft_canvas.setAttribute('width', 400);
  this.draft_canvas.setAttribute('height', 400);
  this.dcc.font = "120px 'ＭＳ Ｐゴシック'";
  this.dcc.fillStyle = "#FFFFFF";
  this.dcc.textAlign = 'left';
  this.dcc.textBaseline = 'top';
  this.dcc.fillText(text, 50, 200);
  
  this.data = this.dcc.getImageData(0, 0, 400, 400).data;
};
draft.prototype = {
  draw: function() {
    var input = this.dcc.getImageData(0, 0, this.draft_canvas.width, this.draft_canvas.height);
    this.cc.putImageData(input, 0, 0);
  },

  isTarget: function(x, y) {
    var w = this.draft_canvas.getAttribute('width');
    var h = this.draft_canvas.getAttribute('height');
    
    var i = (parseInt(y,10) * w + parseInt(x, 10)) * 4;
    var ret = !!(this.data[i] + this.data[i+1] + this.data[i+2]);
    
    if (ret) {
      for (var j = 0;j < 10;j++) {
        for (var k = 0;k < 10;k++) {
          this.data[i + k] = 0;
          this.data[i + k + w*j] = 0;
        }
      }
    }
    
    return ret;
  }
};


var draft_data = new draft('厚'); //font 
/*
draft_data.draw();
console.log(draft.isTarget(10, 10));
console.log(draft.isTarget(10, 20));
*/


var timerID = null;

var fps = 60;//フレームレート
var fcount = 0;
var last = Date.now();
var info = document.getElementById('info');

//canvasのサイズ
var width = 400;
var height = 400;

var canvas = document.getElementById('canvas');
var cc = canvas.getContext('2d');

//パーティクルクラス
var particle = function(cc, x, y) {
  this.cc = cc;
  
  this.x = x;
  this.y = y;
  this.direction = 0;
  this.speed = 0;
  this.accelerate_direction = Math.PI / 2;
  this.acceleration = 3;
  this.color = [0, 0, 0, 255];

  this.visible = false;
};
particle.prototype = {
  move: function() {
      if (draft_data.isTarget(this.x, this.y)) {
      this.speed = 0;
      this.acceleration = 0;
    }
    var accelerationx = this.acceleration * Math.cos(this.accelerate_direction);
    var accelerationy = this.acceleration * Math.sin(this.accelerate_direction);
    var speedx = this.speed * Math.cos(this.direction) + accelerationx;
    var speedy = this.speed * Math.sin(this.direction) + accelerationy;
    this.x += speedx;
    this.y += speedy;
    

  },
  
  draw: function() {
    if (this.visible) {
      this.cc.fillStyle = "rgb(" + parseInt(Math.random()*255, 10) + "," + parseInt(Math.random()*255, 10) + "," + parseInt(Math.random()*255, 10) + ")";
      this.cc.fillRect(this.x, this.y, 3, 3);
    }
    
    if (this.y > height) {
      this.visible = false;
    }
  }
};

//パーティクルコントロールクラス
var particleCtrl = function(particleNum/*, xpos, ypos*/) {
  this.particles = [];
  this.particleNum = particleNum;
  this.init(particleNum, 0, 0);
};
particleCtrl.prototype = {
  init: function(num, x, y) {
    for (var i = 0;i < num;i++) {
      this.particles[i] = new particle(cc, x, y);
    }
  },
  
  add: function(num, x, y) {
    var i = 0;
    var added = 0;

    while(added < num) {
      if (this.particles[i] === undefined || this.particles[i].visible === false) {
        this.particles[i] = new particle(cc, x, y);
        this.particles[i].direction = 2 * Math.PI * Math.random();
        this.particles[i].speed = Math.random();
        this.particles[i].color = [Math.random() * 255, Math.random() * 255, Math.random() * 255, Math.random() * 255];
        this.particles[i].visible = true;
        ++added;
      }
      
      ++i;
    }
  },
  
  drawAndMove: function() {
    for (var i = 0;i < this.particleNum;i++) {
      if (this.particles[i].visible === false) {
        continue;
      }
      

      this.particles[i].move();
      this.particles[i].draw();
    }
  }
};

//パーティクル初期化
var p = new particleCtrl(5000/*, 200, 200*/);

//メイン処理
var mainFunc = function() {
  p.add(100, 133, 50);
  p.add(100, 266, 50);
    
  //メインループ
  var loop = function() {
    cc.clearRect(0, 0, width, height);
    p.drawAndMove();
    
    //fps測定
    fcount++;
    if (fcount === fps) {
      var now = Date.now();
      var frame_rate = fps * 1000 / (now - last);
      fcount = 0;
      info.innerHTML = "FPS: " + frame_rate.toFixed(1) + ' [f/s]';
      last = Date.now();
    }
    
    timerID = setTimeout(arguments.callee, 1000 / fps);
  }();
};

//マウスクリックイベント
canvas.onclick = function(ev) {
  var rect = ev.target.getBoundingClientRect();
  mouseX = ev.clientX - rect.left;
  mouseY = ev.clientY - rect.top;
  
  p.add(100, mouseX, mouseY);
};


var debug = function(msg) {
  document.getElementById('debug').innerHTML = msg;
};

if (window.addEventListener) {
  window.addEventListener('load', mainFunc, false);
} else {
  window.attachEvent('onload', mainFunc);
}