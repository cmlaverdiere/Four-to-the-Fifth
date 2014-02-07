var Q = Quintus({ development: true })
          .include("Sprites, Scenes, Input")
          .setup({ maximize:true });
          
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

Q.load([ "player.png" ], function() {
    var player = new Q.Player();

    Q.gameLoop(function(dt) {
      player.update(dt);
      Q.clear();
      player.render(Q.ctx);
    });

    console.log("Done loading assets.");
});
