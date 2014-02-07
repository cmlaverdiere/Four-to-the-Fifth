// Setup Quintus instance
var Q = Quintus({ development: true })
          .include("Sprites, Scenes, Input")
          .setup({ maximize:true });
          
// Create player class
Q.Sprite.extend("Player", {
  init: function(p) {
    this._super(p, {
      asset: "player.png",
      hp: 10,
      damage: 2,
      x: 300,
      y: 300,
      vx: 0,
      vy: -40
    });
  },

  step: function(dt) {
    this.p.vy += dt * 9.8; 

    this.p.x += this.p.vx * dt;
    this.p.y += this.p.vy * dt;
    console.log(this.p.vy);
  }
});

// Load resources
Q.load([ "player.png" ], function() {
    console.log("Done loading assets.");
});

// Create scene
Q.scene("level1", function(stage) {
  var player = stage.insert(new Q.Player());
  var player2 = stage.insert(new Q.Player( {x:500, y:500, vy:-80} ));
});

// Stage scene
Q.stageScene("level1");
