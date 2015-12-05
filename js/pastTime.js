      var start = new Date();
      var hour = 0;
      var min = 0;
      var sec = 0;
      var now = 0;
      var datet = 0;
      var milles = 0;

      var timeCounter;

      function disp(){

            now = new Date();

            datet = parseInt((now.getTime() - start.getTime()) / 1000);

            hour = parseInt(datet / 3600);
            min = parseInt((datet / 60) % 60);
            sec = datet;
            milles = parseInt(now.getTime() - start.getTime());

            console.log(sec);
            if(sec == 0){//多視点カメラ
                  $('#sceneMane').append('<script>setTimeout(function(){ Scene.goto("/scene2"); }, '+ (sec+2)+'000);<\/script>');
            }else if(sec==1){
                   $('#sceneMane').append('<script>setTimeout(function(){ Scene.goto("/scene0"); }, '+ (sec+2)+'000);<\/script>');
            }else if(sec==3){
                   $('#sceneMane').append('<script>setTimeout(function(){ Scene.goto("/scene4"); }, '+ (sec+2)+'000);<\/script>');
            }else if(sec%9 == 0){
                  $('#sceneMane').append('<script>setTimeout(function(){ Scene.goto("/scene2"); }, '+ (sec+2)+'000);<\/script>');
                  console.log("hello");
            }else if(sec%6 == 0){//moise particle
                  $('#sceneMane').append('<script>setTimeout(function(){ Scene.goto("/scene4"); }, '+ (sec+2)+'000);<\/script>');
            }else if(sec%3 == 0){//dragcircle
                  $('#sceneMane').append('<script>setTimeout(function(){ Scene.goto("/scene0"); }, '+ (sec+2)+'000);<\/script>');
            }
                  // window.location.reload();


      setTimeout("disp()", 1000);
}
