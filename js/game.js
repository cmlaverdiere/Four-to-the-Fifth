// Setup Quintus instance
var Q = Quintus({ development: true, audioSupported: [ 'wav' ] })
          .include("Sprites, Scenes, Input, 2D, Audio, Anim, Touch, UI")
          .enableSound()
          .setup({ maximize:true })
          .touch();
          

// Turn off gravity, the game is top down.
Q.gravityX = 0;
Q.gravityY = 0;

// Define custom key mappings
Q.KEY_NAMES.Q = 81;
Q.KEY_NAMES.E = 69;
Q.KEY_NAMES.W = 87;
Q.KEY_NAMES.A = 65;
Q.KEY_NAMES.S = 83;
Q.KEY_NAMES.D = 68;
Q.KEY_NAMES.F = 70;
Q.KEY_NAMES.SHIFT = 16;

// Some useful constants for speeding things up.
var TO_RAD = Math.PI / 180
var TO_DEG = 180 / Math.PI

// Key actions
Q.input.keyboardControls({
  UP:     'forward', W: 'forward',
  LEFT:   'left',   A: 'left',
  DOWN:   'down',   S: 'down',
  RIGHT:  'right',  D: 'right',
  SPACE:  'fire',
  SHIFT:  'sprint',
  F:      'sword'
});

Q.input.mouseControls({ cursor: "on" });

// Create player class
Q.Sprite.extend("Player", {
  init: function(p) {
    this._super(p, {
      angle: 0,
      asset: "player.png",
      bullets: 50,
      collisionMask: Q.SPRITE_ACTIVE | Q.SPRITE_ENEMY,
      damage: 2,
      sprinting: false,
      stepDistance: 5,
      stepDelay: 0.01,
      swinging_sword: false,
      sword: null,
      type: Q.SPRITE_PLAYER,
      x: 300,
      y: 300
    });


    this.add('2d, stepControls');

    Q.input.on("fire", this, "fire_gun");
    Q.input.on("sword", this, "swing_sword");
  },

  step: function(dt) {
    // Update player angle based on mouse position.
    if (!this.p.swinging_sword){
      this.p.angle = -1 * TO_DEG * Math.atan2( (Q.inputs['mouseX'] - this.p.x), (Q.inputs['mouseY'] - this.p.y) );
    }

    // When pressing the 'forward' key, the player follows mouse.
    if(Q.inputs['forward']){
    	this.p.x += (this.p.stepDistance) * Math.cos(TO_RAD * (this.p.angle+90));
      this.p.y += (this.p.stepDistance) * Math.sin(TO_RAD * (this.p.angle+90));
    }

    // Sprint activation and deactivation.
    if(Q.inputs['sprint']){
      if(!this.p.sprinting){
        console.log("Sprinting!");
        this.p.sprinting = true; 
        this.p.stepDistance *= 2;
      }
    } else {
      if(this.p.sprinting){
        console.log("Walking!");
        this.p.sprinting = false; 
        this.p.stepDistance /= 2;
      } 
    }

    // Sword swinging animation
    if(this.p.swinging_sword){
      this.p.angle += 10;
      if(this.p.angle > 360){
        Q("Sword").destroy();
        this.p.swinging_sword = false;
        this.p.angle = 0;
      }
    }
  },

  swing_sword: function() {
    this.p.sword = Q.stage().insert(new Q.Sword({ x: 22, y: -25 }), this);
    this.p.swinging_sword = true;
    console.log("Swung sword!");
  },

  fire_gun: function() {
    this.p.asset = "player_with_gun.png";
    if (this.p.bullets > 0){
      Q.stage().insert(new Q.Bullet(
      { 
        x: this.p.x,
        y: this.p.y, 
        vx: 500 * Math.cos(TO_RAD * (this.p.angle+90)), 
        vy: 500 * Math.sin(TO_RAD * (this.p.angle+90)), 
      }
      ));

      this.p.bullets -= 1;
      console.log("Player fired gun. Bang! Bullets left: " + this.p.bullets);
    } else{
      console.log("You're out of bullets.");
    }
  }
});


Q.Sprite.extend("Enemy", {
  init: function(p) {
    this._super(p, {
      angle: 0,
      asset: "enemy.png", 
      collisionMask: Q.SPRITE_ACTIVE | Q.SPRITE_PLAYER | Q.SPRITE_ENEMY,
      player: Q("Player").first(),
      speed: 1,
      type: Q.SPRITE_ENEMY
    });

    this.add('2d');
    this.on("bump.left,bump.right,bump.top,bump.bottom", function(collision){
      if(collision.obj.isA("Bullet")){
        // enemy owned.
        this.destroy();
        collision.obj.destroy();
      } 
    });
  },
  
  // This is likely not the best way to do this.
  // We should see if Quintus has a simpler way of 'focusing' an enemy to the player,
  //   other than doing manual trig.
  step: function(dt){
    // look at player (I like this, it's creepy)
    this.p.angle = -1 * TO_DEG * Math.atan2( (this.p.player.p.x - this.p.x), (this.p.player.p.y - this.p.y) );

    // Chase the player!
    this.p.x += this.p.speed * Math.cos(TO_RAD * (this.p.angle+90));
    this.p.y += this.p.speed * Math.sin(TO_RAD * (this.p.angle+90));
  }
});

Q.Sprite.extend("Wall", {
  init: function(p) {
    this._super(p, {
      asset: "wall.png",
      type: Q.SPRITE_ACTIVE
    });
  }
});

Q.Sprite.extend("Bullet", {
  init: function(p) {
    this._super(p, {
      asset: "bullet.png",
      atk_type: "projectile",
      collisionMask: Q.SPRITE_ENEMY | Q.SPRITE_ACTIVE,
      type: Q.SPRITE_POWERUP,
    });

  this.add('2d');
  }
});

Q.Sprite.extend("Sword", {
  init: function(p) {
    this._super(p, {
      asset: "sword.png",
      atk_type: "melee",
      collisionMask: Q.SPRITE_ENEMY,
      type: Q.SPRITE_POWERUP
    });
  }
});


// Create player scene
Q.scene("level1", function(stage) {

  // Draw the background
  stage.insert(new Q.Repeater({ asset: "line_paper.png" }));

  // Generate some random wall groupings that hopefully don't collide too much.
  // A map editor would be better for this.
  var px = py = 0; // Current position of new wall
  var rota;        // Current angle of wall
  for(var i=0; i<100; i++){
    var bx = Math.round(Math.random());
    var by = Math.round(Math.random());
    var rot = Math.round(Math.random());
    px += 40 * bx;
    py += 160 * by;

    if(rot){
      py = [px, px=py][0]; // swap px and py if image rotated.
      rota = 90;
    } else rota = 0;

    // Special case for joining wall
    if(rot && bx && by) rota = 135;

    stage.insert(new Q.Wall( { x: px, y: py, angle: rota })); 
    // console.log("New wall at x: " + px + ", y: " + py + ", angle: " + rota);
  }

  // Create our player
  var player = stage.insert(new Q.Player());

  // Create some enemies
  for(var i=0; i<50; i++){
    stage.insert(new Q.Enemy({x: Math.random() * 3000, y: Math.random() * 3000, speed: 1 + Math.random()}));
  }

  Q.audio.play('test.wav', { loop: true });
  stage.add("viewport").follow(player);
});


Q.scene("ui", function(stage){

  // Container for instructions, alerts, etc.
  var bottom_cont = stage.insert(new Q.UI.Container({
    border: 2,
    fill: "white",
    radius: 3,
    x: Q.width/2,
    y: Q.height - 50,
  }));

  // Player Controls label
  var controls_label = stage.insert(new Q.UI.Text({
    label: "Controls: WASD for movement | SHIFT to sprint | F to swing sword"
  }), bottom_cont);

  // Container for options menu
  var options_cont = stage.insert(new Q.UI.Container({
    border: 2,
    hidden: true,
    fill: "white",
    radius: 3,
    x: 160,
    y: Q.height - 100,
  }));

  // Button to display the options menu.
  var options_btn = stage.insert(new Q.UI.Button({
    border: 2,
    fill: "white",
    label: "Options",
    radius: 3,
    x: 100,
    y: Q.height - 50,
  }, function() {
    if(this.p.fill == "white") this.p.fill = "red";
    else this.p.fill = "white";
    options_cont.p.hidden = !(options_cont.p.hidden); 
  })); 

  // Turn music on or off option
  var music_toggle = stage.insert(new Q.UI.Button({
    y: -100,
    label: "Music on/off"
  }, function(){
    // TODO: This should toggle music, not just stop it.
    Q.audio.stop();     
  }), options_cont);

  // Pause Game
  var pause_toggle = stage.insert(new Q.UI.Button({
  	y: -60,
  	fill: "white",
  	label: "Pause/Unpause Game",
  }, function(){
  	// Pause Game
  	if(pause_toggle.p.fill == "white") {
  		pause_toggle.p.fill = "red";
  		Q.pauseGame();
  		Q.audio.stop();
  	}
    else {
    	Q.unpauseGame();
    	Q.audio.play('test.wav', { loop: true });
    	pause_toggle.p.fill = "white";
    	options_btn.p.fill = "white";
    	options_cont.p.hidden = !(options_cont.p.hidden); 
    };
  }), options_cont);

  // Switch music track
  var music_track = stage.insert(new Q.UI.Button({
    y: -20,
    label: "Next Music Track"
  }, function(){
    // TODO: We should have an easy way to play the 'next' music track in order. 
    Q.audio.stop();     
    Q.audio.play("disp_heroes.wav", { loop: true });     
  }), options_cont);

  bottom_cont.fit(10, 10);
  options_cont.fit(10, 10);

});

// Load resources
Q.load([ 
         "bullet.png",
         "enemy.png",
         "floor_tile.png", 
         "floor_tile_pencil.png", 
         "line_paper.png", 
         "player.png",
         "player_with_gun.png",
         "sword.png", 
         "tough_guy.png",
         "wall.png", 

         "disp_heroes.wav", 
         "test.wav", 
         ], function() {
    console.log("Done loading assets.");
    Q.stageScene("level1", 0);
    Q.stageScene("ui", 1);
});

