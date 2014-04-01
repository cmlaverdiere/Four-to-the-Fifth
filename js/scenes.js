// The initial title screen.
Q.scene("title", function(stage) {

  var title = document.getElementById("start_title");
  
  // title container
  var title_cont = stage.insert(new Q.UI.Container({
    border: 0,
    opacity: .5,
    fill: "#888",
    font: "",
    radius: 0,
    x: Q.width/2,
    y: 100,
  }));

  // title label
  var start_title_label = stage.insert(new Q.UI.Text({
    label: "Four-To-The-Fifth",
    size: 100,
    family: "",
    color: "#0099ff",
    y: 0,
  }), title_cont);
  
  // Container for start up
  var start_cont = stage.insert(new Q.UI.Container({
    border: 2,
    opacity: .7,
    fill: "#888",		// make this %80
    radius: 3,
    x: Q.width/2,
    y: Q.height/2,
  }));

  // Button to Start Game.
  var start_btn = stage.insert(new Q.UI.Button({
    border: 2,
    fill: "#0099ff",
    color: "#0099ff",
    label: "Start Game",
    radius: 3,
    y: 0,
  }, function() {
    Q.stageScene("level", 0);
    Q.stageScene("ui", 1);
  }), start_cont);

  // Button to show options.
  var start_options_btn = stage.insert(new Q.UI.Button({
    border: 2,
    fill: "#0099ff",
    label: "Options",
    color: "#0099ff",
    radius: 3,
    y: 50,
  }, function() {
    start_options_cont.p.hidden = !(start_options_cont.p.hidden);
    start_cont.p.hidden = !(start_cont.p.hidden);
  }), start_cont);

  // Container for start options
  var start_options_cont = stage.insert(new Q.UI.Container({
    border: 2,
    hidden: true,
    fill: "888",
    radius: 3,
    x: Q.width/2,
    y: Q.height/2,
  }));

  // controls label
  var start_controls_label = stage.insert(new Q.UI.Text({
    label: "Controls",
    color: "#fff",
    y: -80,
  }), start_options_cont);

  // controls label
  var controls_label = stage.insert(new Q.UI.Text({
    label: "Movement = WASD \nWeapons = NUMBERS \nFire weapons = 'SPACE' \nPause game = 'backspace'",
  }), start_options_cont);

  // Button to go back to start menu.
  var return_to_start_btn = stage.insert(new Q.UI.Button({
    border: 2,
    fill: "white",
    label: "Back",
    radius: 3,
    y: 100,
  }, function() {
    start_options_cont.p.hidden = !(start_options_cont.p.hidden);
    start_cont.p.hidden = !(start_cont.p.hidden);
  }), start_options_cont);

  //title_cont.fit(Q.width/8, Q.width);
  title_cont.fit(100, 100);
  //start_cont.fit(10, 10);
  start_cont.fit(50, 75);
  start_options_cont.fit(10, 10);

});

// Create player scene
Q.scene("level", function(stage) {
  var fmod = 4;
  var frenzied_enemies = false;

  Q.stageTMX("level" + Q.state.get("level") + ".tmx", stage);
  stage.add("viewport").follow(Q("Player").first());

  // Initialize enemy amount
  Q.state.set("alive", Q("Enemy").length);

  // Q.audio.play('test.wav', { loop: true });

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

  // Q.audio.play('test.wav', { loop: true });

});

