// Setup Quintus instance
var Q = Quintus({ development: true, audioSupported: [ 'wav' ] })
          .include("Sprites, Scenes, Input, 2D, Audio")
          .enableSound()
          .setup({ maximize:true })
          .controls();
          
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

Q.Sprite.extend("Ground", {
  init: function(p) {
    this._super(p, {
      asset: "ground.png",
      gravity: 0
    });

    this.add('2d');
  }
});

// Create scene
Q.scene("start", function(stage) {
  var player = stage.insert(new Q.Player());

  stage.insert(new Q.Ground( {x: 300, y: 500} ));
  for(var i=0; i < 150; i++){
    stage.insert(new Q.Ground( {x: Math.random() * 1000, y: Math.random() * 10000} ));
  }

  Q.audio.play('test.wav', { loop: true });

  stage.add("viewport").follow(player);
});

// Load resources
Q.load([ "player.png", "ground.png", "test.wav" ], function() {
    console.log("Done loading assets.");
    Q.stageScene("start");
});

