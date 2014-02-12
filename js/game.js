// Setup Quintus instance
var Q = Quintus({ development: true, audioSupported: [ 'wav' ] })
          .include("Sprites, Scenes, Input, 2D, Audio, Anim, Touch, UI")
          .enableSound()
          .setup({ maximize:true })
          .touch();
          
// Define custom key mappings
Q.KEY_NAMES.Q = 81;
Q.KEY_NAMES.E = 69;
Q.KEY_NAMES.W = 87;
Q.KEY_NAMES.A = 65;
Q.KEY_NAMES.S = 83;
Q.KEY_NAMES.D = 68;
Q.KEY_NAMES.F = 70;

// Key actions
Q.input.keyboardControls({
  UP:    'up',    W: 'up',
  LEFT:  'left',  A: 'left',
  DOWN:  'down',  S: 'down',
  RIGHT: 'right', D: 'right',
  SPACE: 'fire',
  Q:     'ror',
  E:     'rol',
  F:     'sword'
});

Q.input.mouseControls({ cursor: "on" });

// Collision masks
Q.SPRITE_PLAYER = 2;
Q.SPRITE_ACCESSORY = 4;
Q.SPRITE_INTERACTIVE = 8;
Q.SPRITE_ALL = 0xFFFF;


// Create player class
Q.Sprite.extend("Player", {
  init: function(p) {
    this._super(p, {
      angle: 0,
      asset: "player.png",
      bullets: 10,
      collisionMask: Q.SPRITE_INTERACTIVE,
      damage: 2,
      gravity: 0,
      speed: 300,
      stepDistance: 5,
      stepDelay: 0.01,
      swinging_sword: false,
      sword: null,
      type: Q.SPRITE_PLAYER,
      x: 300,
      y: 300
    });

    this.add('2d, stepControls');

    Q.input.on("fire", this, "fireGun");
    Q.input.on("sword", this, "swing_sword");
    Q.input.on("ror", this, "ror");
    Q.input.on("rol", this, "rol");
  },

  step: function(dt) {
    // Update player angle based on mouse position.
    if (!this.p.swinging_sword){
      this.p.angle = -1 * (180 / Math.PI) * Math.atan2( (Q.inputs['mouseX'] - this.p.x), (Q.inputs['mouseY'] - this.p.y) );
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

  ror: function(dr) { this.p.angle += dr || 10; },
  rol: function(dr) { this.p.angle -= dr || 10; },

  swing_sword: function() {
    this.p.sword = Q.stage().insert(new Q.Sword({ x: 22, y: -25 }), this);
    this.p.swinging_sword = true;
    console.log("Swung sword!");
  },

  fireGun: function() {
    if (this.p.bullets > 0){
      this.p.bullets -= 1;
      console.log("Player fired gun. Bang! Bullets left: " + this.p.bullets);
    } else{
      console.log("You're out of bullets.");
    }
  }
});


Q.Sprite.extend("Wall", {
  init: function(p) {
    this._super(p, {
      asset: "wall.png",
      gravity: 0,
      type: Q.SPRITE_INTERACTIVE
    });
  }
});


Q.Sprite.extend("Sword", {
  init: function(p) {
    this._super(p, {
      asset: "sword.png",
      atk_type: "melee",
      collisionMask: Q.SPRITE_INTERACTIVE,
      gravity: 0,
      type: Q.SPRITE_ACCESSORY
    });
  }
});


// Create player scene
Q.scene("level1", function(stage) {

  // Draw the background
  stage.insert(new Q.Repeater({ asset: "floor_tile.png" }));

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
    label: "Controls: WASD for movement, F to swing sword"
  }), bottom_cont);

  // Container for options menu
  var options_cont = stage.insert(new Q.UI.Container({
    border: 2,
    hidden: true,
    fill: "white",
    radius: 3,
    x: 120,
    y: Q.height - 100,
  }));

  // Button to display the options menu.
  var options_btn = stage.insert(new Q.UI.Button({
    border: 2,
    fill: "white",
    label: "Options",
    radius: 3,
    x: 80,
    y: Q.height - 50,
  }, function() {
    options_cont.p.hidden = !(options_cont.p.hidden); 
  })); 

  // Turn music on or off option
  var music_toggle = stage.insert(new Q.UI.Button({
    y: -60,
    label: "Music on/off"
  }, function(){
    // TODO: This should toggle music, not just stop it.
    Q.audio.stop();     
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
Q.load([ "player.png",
         "floor_tile.png", 
         "wall.png", 
         "sword.png", 
         "test.wav", 
         "disp_heroes.wav", 
         ], function() {
    console.log("Done loading assets.");
    Q.stageScene("level1", 0);
    Q.stageScene("ui", 1);
});

