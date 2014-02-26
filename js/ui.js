Q.scene("ui", function(stage){

  // Container for instructions, alerts, etc.
  var bottom_cont = stage.insert(new Q.UI.Container({
    border: 2,
    fill: "white",
    radius: 3,
    x: Q.width/2,
    y: Q.height - 50,
  }));

  // TODO Make a button to show this, instead of showing it all the time.
  // // Player Controls label
  // var controls_label = stage.insert(new Q.UI.Text({
  //   label: "WASD: Movement | SHIFT: Sprint | SPACE: Shoot | NUMKEYS: Weapons"
  // }), bottom_cont);

  // Total kills label
  var kills_label = stage.insert(new Q.UI.Text({
    x: -300,
    label: "Kill Count: " + Q.state.get("killed"),
  }), bottom_cont);

  // Update kills label. 
  Q.state.on("change.killed", function(){ 
    kills_label.p.label = "Kill Count: " + Q.state.get("killed") 
  });

  // Total alive label
  var alive_label = stage.insert(new Q.UI.Text({
    x: -100,
    label: "Enemies Left: " + Q.state.get("alive"),
  }), bottom_cont);

  // Update number alive label. 
  Q.state.on("change.alive", function(){ 
    alive_label.p.label = "Enemies Left: " + Q.state.get("alive") 
  });

  // Total ammo label
  var ammo_label = stage.insert(new Q.UI.Text({
    x: 100,
    label: "Ammo: " + Q.state.get("ammo"),
  }), bottom_cont);

  // Update ammo label. 
  Q.state.on("change.ammo", function(){ 
    ammo_label.p.label = "Ammo: " + Q.state.get("ammo") 
  });

  // Level label
  var level_label = stage.insert(new Q.UI.Text({
    x: 250,
    label: "Level: " + Q.state.get("level"),
  }), bottom_cont);

  // Update Level label. 
  Q.state.on("change.level", function(){ 
    level_label.p.label = "Level: " + Q.state.get("level") 
  });

  // Container for options menu
  var options_cont = stage.insert(new Q.UI.Container({
    border: 2,
    hidden: true,
    fill: "white",
    radius: 3,
    x: 160,
    y: Q.height - 100,
  }));

  // Button to display the options menu.
  var options_btn = stage.insert(new Q.UI.Button({
    border: 2,
    fill: "white",
    label: "Options",
    radius: 3,
    x: 100,
    y: Q.height - 50,
  }, function() {
    if(this.p.fill == "white") this.p.fill = "red";
    else this.p.fill = "white";
    options_cont.p.hidden = !(options_cont.p.hidden); 
  })); 

  // Change game zoom
  var zoom_toggle = stage.insert(new Q.UI.Button({
    y: -140,
    label: "Toggle zoom level"
  }, function(){
    var zoom = Q.stage(0).viewport.scale;
    if(zoom > 3) { 
      zoom = .5; 
    } else {
      zoom *= 1.5;
    }
    Q.stage(0).viewport.scale = zoom;
  }), options_cont);


  // Toggle music on or off option.
  var music_toggle = stage.insert(new Q.UI.Button({
    y: -100,
    label: "Music on/off"
  }, function(){
    if(Q.state.get("track_playing")){
      Q.audio.stop();     
      Q.state.set("track_playing", false);
    } else{
      Q.audio.stop();     
      Q.audio.play(tracks[Q.state.get("track_id")], { loop: true });
      Q.state.set("track_playing", true);
    }
  }), options_cont);

  // Pause Game
  var pause_toggle = stage.insert(new Q.UI.Button({
    y: -60,
    fill: "white",
    label: "Pause/Unpause Game",
  }, function(){
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
  }), options_cont);

  // Switch music track
  var music_track = stage.insert(new Q.UI.Button({
    y: -20,
    label: "Next Music Track"
  }, function(){
    Q.audio.stop();     
    Q.state.inc("track_id", 1);
    if(Q.state.get("track_id") >= tracks.length){
      Q.state.set("track_id", 0);
    }
    Q.state.set("track_playing", true);
    Q.audio.play(tracks[Q.state.get("track_id")], { loop: true });
  }), options_cont);

  bottom_cont.fit(10, 10);
  options_cont.fit(10, 10);
});