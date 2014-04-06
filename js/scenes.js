// Create player scene
Q.scene("level", function(stage) {
  var fmod = 4;
  var frenzied_enemies = false;

  Q.stageTMX("level" + Q.state.get("level") + ".tmx", stage);
  stage.add("viewport").follow(Q("Player").first());

  // Initialize enemy amount
  Q.state.set("alive", Q("Enemy").length);

  if(MUSIC_ENABLED){
    Q.audio.play('test.wav', { loop: true });
  }

  // pause game
  stage.on("pause_game", function(){
    if(!Q.state.get("paused")) {
      Q.state.set("paused", true);
      Q.pauseGame();
      Q.audio.stop();
    }
    else {
      Q.state.set("paused", false);
      Q.unpauseGame();

      if(Q.state.get("track_playing")){
        Q.audio.play(tracks[Q.state.get("track_id")], { loop: true });
      }
    };
  });

  // Handle event for when an enemy is killed.
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
      stage.trigger("beat_level");
    }
  });

  // Handle event for when player finishes a level.
  stage.on("beat_level", function() {
      // If there's still a level after, proceed to the next level.
      if(Q.state.get("level") < NUM_MAPS){
        Q.state.inc("level", 1);
        Q.stageScene("level", 0);
      } else { // Otherwise, we've beaten the game.
        console.log("Game beaten.");
        Q.stageScene("endgame", 0);
        Q.stageScene("null", 1);
      }
  });

  stage.on("player_death", function() {
    Q.stageScene("title", 1);
  });

});

// The ending screen.
Q.scene("endgame", function(stage) {
  // Button to restart Game.
  var restart_btn = stage.insert(new Q.UI.Button({
    border: 2,
    fill: "white",
    label: "Replay?",
    radius: 3,
    x: Q.width/2,
    y: Q.height/2,
  }, function() {
    Q.state.set("level", 1);
    Q.state.set("ammo", 50);
    Q.state.set("player_health", 100);
    Q.stageScene("level", 0);
    Q.stageScene("ui", 1);
  }));
});

// Create player scene
Q.scene("start_level", function(stage) {
  var fmod = 4;
  var frenzied_enemies = false;

  Q.stageTMX("start_level.tmx", stage);
  stage.add("viewport").follow(Q("Enemy").first());

  // Initialize enemy amount
  Q.state.set("alive", Q("Enemy").length);

  if(MUSIC_ENABLED){
    Q.audio.play('test.wav', { loop: true });
  }

});
