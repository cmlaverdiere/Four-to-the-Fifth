// Create player scene
Q.scene("level1", function(stage) {

  var fmod = 4;
  var frenzied_enemies = false;

  stage.on("enemy_killed", function(){ 
    Q.state.inc("killed", 1);
    Q.state.dec("alive", 1);
    frenzied_enemies = false;

    // Every few enemies killed, let's trigger a frenzy.
    if(!frenzied_enemies && Q.state.get("killed") % fmod === 0){
      Q("Enemy").trigger("frenzy"); 
      fmod *= 2;
      frenzied_enemies = true;
    }

    // Check if game over.
    if(Q("Enemy").length <= 1){
      console.log("Level beaten. Resetting."); 
      Q.state.inc("level", 1);
      Q.stageScene("level1", 0);
    }
  });

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
  }

  // Create our player
  var player = stage.insert(new Q.Player({ bullets: 30 }));
  Q.state.set("ammo", 30);

  // Create some enemies
  for(var i=0; i < Math.pow(Q.state.get("level")+1, 3) ; i++){
  	
  	// Shows how many enemies are left
  	Q.state.set("alive", Math.pow(Q.state.get("level")+1, 3));
    
    var rx = Math.random() * 3000;
    var ry = Math.random() * 3000;
    var rsp = Math.random() + 1;
    var rsc = Math.random() + .5;
    stage.insert(new Q.Enemy({ x:rx, y:ry, speed:rsp, scale:rsc, hp:(rsp * 6) }));
  }

  // Create some ammo clips
  for(var i=0; i<(10 * Q.state.get("level")/ 2) ; i++){
    stage.insert(new Q.Ammo({x: Math.random() * 3000, y: Math.random() * 3000}));
  }

  // I can't listen to this anymore. I need silence.
  // Q.audio.play('test.wav', { loop: true });

  stage.add("viewport").follow(player);
  Q.stage(0).viewport.scale = .5
});
