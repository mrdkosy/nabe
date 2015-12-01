// forked from kyoyaji's "forked: CSSとJavaScriptだけでhanabi(3次元パース付き版)" http://jsdo.it/kyoyaji/ka31
// forked from Yoshitaka's "forked: CSSとJavaScriptだけでhanabi(3次元パース付き版)" http://jsdo.it/Yoshitaka/lPRD
// forked from Shinichirou.Kaneko's "forked: CSSとJavaScriptだけでhanabi(3次元パース付き版)" http://jsdo.it/Shinichirou.Kaneko/a64E
// forked from ClubRaptor's "forked: CSSとJavaScriptだけでhanabi(3次元パース付き版)" http://jsdo.it/ClubRaptor/cKEs
var particle_num = 64 * 5;             //パーティクル数(5の倍数で指定)

var particles = [];                     //パーティクルオブジェクトの配列

var counter = 0;                        //フレームカウンタ
var timer = null;                       //タイマー

var interval = 16;                       //描画間隔
var fps = 0;                            //フレームレート
var is_firsttime = true;                //初回実行かどうか

var physic = {                          //物理定数
  'rising_speed' : 0.1,                   //初期上昇速度
  'air_drag' : 0.3,                       //空気抵抗係数
  'gravity' : 0.008                       //重力定数
}

var projection = {                      //投影用定数
  'angle' : 60,                           //視野角
  'width' : 480,                          //画面幅
  'height' : 480                          //画面高
}
projection.size = ((projection.width > projection.height) ? projection.width : projection.height) * 0.5;
projection.fov = 1 / Math.tan (projection.angle * 0.5 * Math.PI / 180);

//パーティクルクラス
function Particle () {
  this.position = new Position (0, 0, 0);
  this.vector = new Vector (0, 0, 0);
  this.color = [];
  this.initial_color = [];
  this.final_color = [];
  this.size = 4;
  this.element = null;
}

//位置クラス
function Position (x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
  
  this.setValue = function (x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

//ベクタークラス
function Vector (speed, theta, phi) {
  this.speed = speed;
  this.theta = theta;
  this.phi = phi;
  
  this.setValue = function (speed, theta, phi) {
    this.speed = speed;
    this.theta = theta;
    this.phi = phi;
  }
}

//初期化
function init () {
  var canvas_element = document.getElementById('canvas');
  for (var i=0; i < particle_num; i++) {
    //要素を生成
    var particle_element = document.createElement('div');
    //クラスを設定
    particle_element.setAttribute('class', 'particle');
    //追加
    canvas_element.appendChild(particle_element);
    
    //オブジェクトを生成
    particles[i] = new Particle ();
    particles[i].element = particle_element;
  }
  
  //初期状態を設定
  fire ();
  
  //シミュレーション開始
  simulate ();
}

//初期状態設定
function fire () {
  //中心点
  var flashpoint_y = Math.floor (Math.random () * 320) + 80;
  var flashpoint_z = Math.floor (Math.random () * 120) + 120;
  var flashpoint_x = Math.floor (Math.random () * 120) - 60;
  
  var flag = null;
  
  //色設定
  var initial_color = [[], [], []];
  var final_color = [[], [], []];
  
  for (var i=0; i < 3; i++) {
    //初期色と終了色を設定
    for (var j=0; j < 3; j++) {
      initial_color[i][j] = Math.random () * 2 >= 1 ? 255 : 127;
      final_color[i][j] = Math.random () * 2 >= 1 ? 255 : 127;
    }
    
    //初期色がグレイだったら反転
    if (initial_color[i][0] == 127 && initial_color[i][1] == 127 && initial_color[i][2] == 127) {
      flag = Math.floor (Math.random () * 3);
      switch (flag) {
        case 0:
          initial_color[i][0] = 255;
          break;
        case 1:
          initial_color[i][1] = 255;
          break;
        case 2:
          initial_color[i][2] = 255;
          break;
        default:
          break;
      }
    }
    //終了色がグレイだったら反転
    if (final_color[i][0] == 127 && final_color[i][1] == 127 && final_color[i][2] == 127) {
      flag = Math.floor (Math.random () * 3);
      switch (flag) {
        case 0:
          final_color[i][0] = 255;
          break;
        case 1:
          final_color[i][1] = 255;
          break;
        case 2:
          final_color[i][2] = 255;
          break;
        default:
          break;
      }
    }
  }

  //初期速度ベクトルの最大値
  var max_size = Math.random () * 3 + 2;
  
  //パーティクルの位相
  var phase1 = Math.random () * Math.PI * 64;
  var phase2 = Math.random () * Math.PI * 64;
  var phase3 = Math.random () * Math.PI * 64;
  
  for (i=0; i < particle_num; i++) {
    //パーティクル初期位置設定
    particles[i].position.setValue (flashpoint_x, flashpoint_y, flashpoint_z);
    
    //パーティクル初期ベクトル設定
    //極座標系で求める
    var speed = max_size;
    var phi = 0;
    var theta = 0;
    
    if (i < particle_num / 5 * 1) {
      //最初の1/5のパーティクルは内層
      phi = ((i - 0) / (particle_num / 5)) * Math.round (phase1) % Math.PI;
      theta = ((i - 0) / (particle_num / 5)) * Math.PI;

      speed *= (1 / 5);
      
      particles[i].initial_color = initial_color[2];
      particles[i].final_color = final_color[2];
    }
    else if (i < particle_num / 5 * 2 && i >= particle_num / 5 * 1) {
      //全体の1/5以降2/5未満のパーティクルは中層
      phi = ((i - particle_num / 5) / (particle_num / 5)) * Math.round (phase2) % Math.PI;
      theta = ((i - particle_num / 5) / (particle_num / 5)) * Math.PI;
      
      speed *= (1 / 2);
      
      particles[i].initial_color = initial_color[1];
      particles[i].final_color = final_color[1];
    }
    else {
      //それ以外は外層
      phi = ((i - particle_num / 5 * 2) / (particle_num / 5 * 3)) * Math.round (phase3) % Math.PI;
      theta = ((i - particle_num / 5 * 2) / (particle_num / 5 * 3)) * Math.PI;
      
      particles[i].initial_color = initial_color[0];
      particles[i].final_color = final_color[0];
    }
    
    //直行座標系に変換
    var vector_x = Math.sin (theta) * Math.cos (phi);
    var vector_y = Math.sin (theta) * Math.sin (phi);
    var vector_z = Math.cos (theta);
    
    //打ち上げ初速によるベクトル偏向
    vector_z -= physic.rising_speed;
    
    //極座標系に変換
    var vector_length = Math.sqrt (vector_x * vector_x + vector_y * vector_y + vector_z * vector_z);
    speed *= vector_length;
    theta = Math.atan2 (Math.sqrt (vector_x * vector_x + vector_y * vector_y), vector_z);
    phi = Math.atan2 (vector_x, vector_y);
    
    //ベクトル設定
    particles[i].vector.setValue (speed, theta, phi);
    
  }
  
  //タイマーセット
  var date = new Date ();
  timer = date.getTime ();
}

//シミュレーション
function simulate () {
  for (var i=0; i < particle_num; i++) {
    //変数に代入
    var speed = particles[i].vector.speed;
    var phi = particles[i].vector.phi;
    var theta = particles[i].vector.theta;
    
    //直行座標系に変換
    var vector_x = Math.sin (theta) * Math.cos (phi);
    var vector_y = Math.sin (theta) * Math.sin (phi);
    var vector_z = Math.cos (theta);
    
    //重力によるベクトル偏向
    vector_z += physic.gravity;
    
    //極座標系に変換
    var vector_length = Math.sqrt (vector_x * vector_x + vector_y * vector_y + vector_z * vector_z);
    speed *= vector_length;
    theta = Math.atan2 (Math.sqrt (vector_x * vector_x + vector_y * vector_y), vector_z);
//  phi = Math.atan2 (vector_x, vector_y);
    
    //パーティクルを減速させる
    speed = speed - (speed / 5) * (speed / 5) * physic.air_drag;
    
    //ベクトル設定
    particles[i].vector.setValue (speed, theta, phi);
    
    //速度ベクトルから現在位置を算出
    var new_pos_x = particles[i].position.x + particles[i].vector.speed * Math.sin (particles[i].vector.theta) * Math.cos (particles[i].vector.phi);
    var new_pos_y = particles[i].position.y + particles[i].vector.speed * Math.sin (particles[i].vector.theta) * Math.sin (particles[i].vector.phi);
    var new_pos_z = particles[i].position.z + particles[i].vector.speed * Math.cos (particles[i].vector.theta);
    
    //現在位置を更新
    particles[i].position.setValue (new_pos_x, new_pos_y, new_pos_z)
    
    //減光処理
    //サイズを落とす
    if (counter < 60) {
      if (Math.random () * 2 >= 1) {
        particles[i].size = 2;
      }
      else {
        particles[i].size = 4;
      }
    }
    else if (counter < 100) {
      if (Math.random () * 2 >= 1) {
        particles[i].size = 1;
      }
      else {
        particles[i].size = 3;
      }
    }
    else if (counter < 140) {
      if (Math.random () * 2 >= 1) {
        particles[i].size = 1;
      }
      else {
        particles[i].size = 2;
      }
    }
    else {
      if (Math.random () * 2 >= 1) {
        particles[i].size = 0;
      }
      else {
        particles[i].size = 1;
      }
    }
    
    //色を変化させる
    for (var j=0 ; j < 3; j++) {
      //色を変える
      var color_ratio = (180 - counter) / 170;
      if (color_ratio > 1) color_ratio = 1;
      
      particles[i].color[j] = particles[i].initial_color[j] * color_ratio + particles[i].final_color[j] * (1 - color_ratio);
      
      //減光率を設定
      var fade_ratio = (180 - counter) / 60;
      if (fade_ratio > 1) fade_ratio = 1;
      
      //減光させる
      particles[i].color[j] = Math.round (particles[i].color[j] * fade_ratio);
    }
    

    //パーティクル色反映
    particles[i].element.style.backgroundColor = 'rgb(' + particles[i].color[0] + ',' + particles[i].color[1] + ',' + particles[i].color[2] + ')';
    
    //パーティクルの表示位置を更新
    var x =  1 * (particles[i].position.y - projection.width / 2);
    var y = -1 * (particles[i].position.z - projection.height / 2);
    var z = -1 * (particles[i].position.x + projection.width);

    var x_dash = x / z * projection.fov * projection.size;
    var y_dash = y / z * projection.fov * projection.size;
    
    x_dash += projection.width / 2;
    y_dash += projection.height / 2;

    if (x_dash < 0 || x_dash > projection.width || y_dash < 0 || y_dash > projection.height) {
      particles[i].element.style.left = '-1000px';
      particles[i].element.style.top = '-1000px';
    }
    else {
      particles[i].element.style.left = Math.round (x_dash) + 'px';
      particles[i].element.style.top = Math.round (y_dash) + 'px';
    }
    
    //パーティクルサイズ変更
    particles[i].element.style.width = Math.round (particles[i].size * (-z / 480)) + 'px';
    particles[i].element.style.height = Math.round (particles[i].size * (-z / 480)) + 'px';

    //パーティクルZバッファ変更
    particles[i].element.style.zIndex = Math.round (-z);
  }
  
  //フレームカウンタ増加
  counter++;
  if (counter > 180) {
    var date = new Date ();
  
  //カウンタが規定値に達したら初期化
    var cost_time = date.getTime () - timer;                      //所要時間
    
    fps = Math.round((180 / (cost_time / 1000)) * 100) / 100;     //FPSを小数点以下2桁で算出
    
    if (is_firsttime) {
      interval = Math.floor(16 - (cost_time - 3000) / 180);       //必要インターバルを計算
      if (interval < 0) interval = 0;
      
      is_firsttime = false;
    }
    
    counter = 0;
    
    fire ();
    
    document.getElementById('fps').innerHTML = fps + ' FPS (interval:' + interval + 'ms)';
  }
  
  //自分を算出時間後に呼ぶ
  setTimeout ('simulate ()', interval);
}
