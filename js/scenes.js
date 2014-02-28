// Create player scene
Q.scene("level1", function(stage) {
  Q.stageTMX("level1.tmx", stage);

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

  // I can't listen to this anymore. I need silence.
  // Q.audio.play('test.wav', { loop: true });

  stage.add("viewport").follow(player);
});
