(function($, win, doc) {
    
    "use strict";
      

    var Main = function() {
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.initialize();
    };
    
    Main.prototype.initialize = function() {
        this.container = doc.getElementById("container");
        
        this.camera = new THREE.PerspectiveCamera(75, win.innerWidth/win.innerHeight, 1, 5000);
        this.camera.position.z = 600;

        this.scene = new THREE.Scene();
        //this.scene.fog = new THREE.FogExp2("0x000000, 0.001");
        this.scene.add(this.camera);
        
        //this.renderer = Detector.webgl ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
        this.renderer = new THREE.CanvasRenderer();
        this.renderer.setPixelRatio(win.devicePixelRatio);
        this.renderer.setSize(win.innerWidth, win.innerHeight);
        
        this.container.appendChild(this.renderer.domElement);
        
        this.makeParticle();
                
        this.stats = new Stats();
        this.stats.domElement.style.position = "absolute";
        this.stats.domElement.style.top = "0px";
        this.container.appendChild(this.stats.domElement);
        
        doc.addEventListener('mousemove', this.updateMousePos.bind(this), false);
                     
        this.run();
    };
    
    Main.prototype.generateSprite = function() {
        var canvas, ctx, gradient;
        
        canvas = doc.createElement("canvas");
        canvas.width = 16;
        canvas.height = 16;
        
        ctx = canvas.getContext("2d");
        
        gradient = ctx.createRadialGradient(
                canvas.width/2, canvas.height/2,
                0, canvas.width/2,
                canvas.height/2, canvas.width/2
        );
		gradient.addColorStop(0, 'rgba(0,255,255,0.8)');
		gradient.addColorStop(0.2, 'rgba(0,255,255,0.5)');
		gradient.addColorStop(0.4, 'rgba(0,0,64,0.25)');
		gradient.addColorStop(1, 'rgba(0,0,0,0.0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        return canvas;        
    };
    
    Main.prototype.makeParticle = function() {

         function initParticle(particle, delay) {
            particle = this instanceof THREE.Sprite ? this : particle;
            delay = delay !== undefined ? delay : 0;
        
            particle.position.set(0, 0, 0);
            particle.scale.x = particle.scale.y = Math.random()*32;
        
            new TWEEN.Tween(particle)
                    .delay(delay)
                    .to({}, 6000)
                    .onComplete(initParticle)
                    .start();
        
            new TWEEN.Tween(particle.position)
                    .delay(delay)
                    .to({
                        x: Math.random()*4000-2000,
                        y: Math.random()*1000-500,
                        z: Math.random()*4000-2000
                    }, 12000)
                    .start();
        
            new TWEEN.Tween(particle.scale)
                    .delay(delay)
                    .to({
                        x: 0.01, y: 0.01
                    }, 12000)
                    .start();     
        }
        
        var px, py, pz, particle, material;
        
        this.particlesNum = 200;
        
        this.group = new THREE.Group();
        this.scene.add(this.group);
        
        material = new THREE.SpriteMaterial({
            map: new THREE.CanvasTexture(this.generateSprite()),
            //blending: THREE.AdditiveBlending
        }); 
        
        for(var i=0; i<this.particlesNum; i++) {
            particle = new THREE.Sprite(material);
            initParticle(particle, i*30);
            this.group.add(particle);
        }
            
    };
   
    
    Main.prototype.updateParticle = function() {
        //this.pointCloud.geometry.__dirtyVerticies = true;
    };
    
    Main.prototype.updateMousePos = function(e) {
        this.mouseX = e.clientX - win.innerWidth/2;
        this.mouseY = e.clientY - win.innerHeight/2;
    };
    
    Main.prototype.update = function() {
        //this.updateParticle();
        TWEEN.update();
        this.camera.position.x += (this.mouseX - this.camera.position.x)*0.1;
        this.camera.position.y += (-this.mouseY - this.camera.position.y)*0.1;
        this.camera.lookAt(this.scene.position);
        this.renderer.render(this.scene, this.camera);
        this.stats.update();
    };
    
    Main.prototype.run = function() {
        win.requestAnimationFrame = (function(){
            return win.requestAnimationFrame     ||
                win.webkitRequestAnimationFrame  ||
                win.mozRequestAnimationFrame     ||
                win.oRequestAnimationFrame       ||
                win.msRequestAnimationFrame      ||
                function(callback, element){                                                                                                                                                                 
                    win.setTimeout(callback, 1000 / 60);
                };                                                                                                                                                                                           
        })();

        
        var loop = function() {                                                                                                                                                                              
            this.update(); 
            win.requestAnimationFrame(loop);  
        }.bind(this);
        loop();
        
    };
    
    new Main();
    
})(jQuery, window, window.document);