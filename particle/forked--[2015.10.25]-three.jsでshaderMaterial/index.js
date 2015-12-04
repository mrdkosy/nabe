// forked from takumifukasawa's "[2015.10.25] three.jsでshaderMaterial" http://jsdo.it/takumifukasawa/oZY4
(function($, win, doc) {
    
    "use strict";
      

    var Main = function() {
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.initialize();
    };
    
    Main.prototype.initialize = function() {
        this.container = doc.getElementById("container");
        
        this.camera = new THREE.PerspectiveCamera(40, win.innerWidth/win.innerHeight, 1, 10000);
        this.camera.position.z = 300;

        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2("rgb(0,0,0), 0.005");
        this.scene.add(this.camera);
        
        this.renderer = Detector.webgl ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
        //this.renderer = new THREE.CanvasRenderer();
        this.renderer.setPixelRatio(win.devicePixelRatio);
        this.renderer.setSize(win.innerWidth, win.innerHeight);
        
        this.container.appendChild(this.renderer.domElement);
        
        var texLoader = new THREE.TextureLoader();
        var tex = texLoader.load("http://jsrun.it/assets/u/7/F/Z/u7FZD.png");

        this.shaderMaterial = new THREE.ShaderMaterial({
            uniforms: {
                color: {
                    type: 'c',
                    value: new THREE.Color('rgb(255, 255, 255)')
                },
                texture: {
                    type: 't',
                    value: tex
                }
            },
            vertexShader: doc.getElementById("vertexshader").textContent,
            fragmentShader: doc.getElementById("fragmentshader").textContent,

		    blending: THREE.AdditiveBlending,
		    depthTest: false,
		    transparent: true
        });
               
     
        this.particles = 10000;
        this.radius = 200;
        
        this.geometry = new THREE.BufferGeometry();
        
        this.positions = new Float32Array(this.particles*3);
        this.colors = new Float32Array(this.particles*3);
        this.sizes = new Float32Array(this.particles);
                  
        var color = new THREE.Color();
        
        for(var i=0, i3=0; i<this.particles; i++, i3+=3) {
            this.positions[i3+0] = (Math.random()*2-1)*this.radius;
            this.positions[i3+1] = (Math.random()*2-1)*this.radius;
            this.positions[i3+2] = (Math.random()*2-1)*this.radius;
            
            color.setHSL(i/this.particles*0.2, 1.0, 0.5);
            
            this.colors[i3+0] = color.r;
            this.colors[i3+1] = color.g;
            this.colors[i3+2] = color.b;
            
            this.sizes[i] = 20;
        }
        this.geometry.addAttribute('position', new THREE.BufferAttribute(this.positions, 3));
        this.geometry.addAttribute('customColor', new THREE.BufferAttribute(this.colors, 3));        
        this.geometry.addAttribute('size', new THREE.BufferAttribute(this.sizes, 1));
 
        this.particleSystem = new THREE.Points(this.geometry, this.shaderMaterial);
        this.scene.add(this.particleSystem);


        
        this.stats = new Stats();
        this.stats.domElement.style.position = "absolute";
        this.stats.domElement.style.top = "0px";
        this.container.appendChild(this.stats.domElement);
        
        win.addEventListener('resize', this.windowResize.bind(this), false);
        doc.addEventListener('mousemove', this.updateMousePos.bind(this), false);
                     
        this.run();
    };
    

    Main.prototype.windowResize = function() {
        this.camera.aspect = win.innerWidth / win.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(win.innerWidth/win.innerHeight);
    };
    
    Main.prototype.updateMousePos = function(e) {
        this.mouseX = e.clientX - win.innerWidth/2;
        this.mouseY = e.clientY - win.innerHeight/2;
    };
    
    Main.prototype.update = function() { 
        this.camera.position.x += (this.mouseX - this.camera.position.x)*0.1;
        this.camera.position.y += (-this.mouseY - this.camera.position.y)*0.1;
        
        var time = Date.now() * 0.003;   
	    this.particleSystem.rotation.z = 0.01 * time;
        var sizes = this.geometry.attributes.size.array;
		for (var i=0; i<this.particles; i++) {
			this.sizes[i] = 5 * (1 + Math.sin(0.1 * i + time));
	    }
        this.geometry.attributes.size.needsUpdate = true;
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