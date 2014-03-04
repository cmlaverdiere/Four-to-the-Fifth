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
    Q.stageScene("level", 0);
    Q.stageScene("ui", 1);
  }));
});

// Create player scene
Q.scene("level", function(stage) {
  var fmod = 4;
  var frenzied_enemies = false;

  Q.stageTMX("level" + Q.state.get("level") + ".tmx", stage);
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
    if(Q("Enemy").length <= 1){
      console.log("Level beaten. Staging Next level."); 
      Q.state.inc("level", 1);
      Q.stageScene("level", 0);
    }
  });
});

