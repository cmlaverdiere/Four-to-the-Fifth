// Setup Quintus instance
var Q = Quintus({ development: true, audioSupported: [ 'wav' ] })
          .include("Sprites, Scenes, Input, 2D, Audio, Anim")
          .enableSound()
          .setup({ maximize:true })
          .controls();
          
// Collision masks
Q.SPRITE_PLAYER = 1;
Q.SPRITE_ALL = 0xFFFF;

// Create player class
Q.Sprite.extend("Player", {
  init: function(p) {
    this._super(p, {
      asset: "player.png",
      damage: 2,
      hp: 10,
      gravity: 0,
      speed: 300,
      stepDistance: 5,
      stepDelay: 0.01,
      type: Q.SPRITE_PLAYER,
      x: 300,
      y: 300
    });

    this.add('2d, stepControls');

    Q.input.on("fire", this, "fireGun");
  },

  step: function(dt) {
    // console.log(this.p.x, this.p.y);
  },

  fireGun: function() {
    console.log("Player fired gun. Bang!") ;
  }
});

// Create player scene
Q.scene("level1", function(stage) {

  // Draw the background
  stage.insert(new Q.Repeater({ asset: "floor_tile.png" }));

  // Create our player
  var player = stage.insert(new Q.Player());

  Q.audio.play('test.wav', { loop: true });
  stage.add("viewport").follow(player);
});

// Load resources
Q.load([ "player.png",
         "floor_tile.png", 
         "test.wav" ], function() {
    console.log("Done loading assets.");
    Q.stageScene("level1", 0);
});

