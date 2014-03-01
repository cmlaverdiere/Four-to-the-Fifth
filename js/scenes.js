Q.scene("title", function(stage) {
  // Button to Start Game.
  var start_btn = stage.insert(new Q.UI.Button({
    border: 2,
    fill: "white",
    label: "Start Game",
    radius: 3,
    x: Q.width/2,
    y: Q.height/2,
  }, function() {
    Q.stageScene("level1", 0);
    Q.stageScene("ui", 1);
  }));
});

// Create player scene
Q.scene("level1", function(stage) {
  var fmod = 4;
  var frenzied_enemies = false;

  Q.stageTMX("level1.tmx", stage);
  stage.add("viewport").follow(Q("Player").first());

  // Q.audio.play('test.wav', { loop: true });

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
    console.log(Q("Enemy").length);
    if(Q("Enemy").length <= 1){
      console.log("Level beaten. Resetting."); 
      Q.state.inc("level", 1);
      Q.stageScene("level2", 0);
    }
  });
});


// We should find another way to do stage events for *all* stages,
//   instead of having to repeat code.
Q.scene("level2", function(stage) {
  var fmod = 4;
  var frenzied_enemies = false;

  Q.state.set("ammo", 30);
  Q.stageTMX("level2.tmx", stage);
  stage.add("viewport").follow(Q("Player").first());

  // Q.audio.play('test.wav', { loop: true });

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
    console.log(Q("Enemy").length);
    if(Q("Enemy").length <= 1){
      console.log("Level beaten. Resetting."); 
      Q.state.inc("level", 1);
      Q.stageScene("level1", 0);
    }
  });
});
