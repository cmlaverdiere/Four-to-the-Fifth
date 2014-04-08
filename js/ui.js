Q.scene("ui", function(stage){

  // weapon container
  var weapon_cont = stage.insert(new Q.UI.Container({
    border: 2,
    fill: "#888",
    opacity: .5,
    w: 200,
    h: 60,
    x: Q.width - 150,
    y: Q.height - 40,
  }));

  // Total ammo label
  var ammo_label = stage.insert(new Q.UI.Text({
  	size: 40,
    x: 0,
    //label: "Ammo: " + Q.state.get("ammo"),
    label: "Ammo: " + stage.options.bullets,

  }), weapon_cont);

  // Update ammo label. 
  Q.state.on("change.ammo", function(){ 
    //ammo_label.p.label = "Ammo: " + Q.state.get("ammo")
    ammo_label.p.label = "Ammo: " + stage.options.bullets
  });

  // info container
  var info_cont = stage.insert(new Q.UI.Container({
    border: 2,
    fill: "#888",
    opacity: .5,
    w: 200,
    h: 60,
    x: 150,
    y: Q.height - 40,
  }));

  // health container
  var health_cont = stage.insert(new Q.UI.Container({
    border: 2,
    fill: "#f00",
  }), info_cont);

  // health label
  var health_label = stage.insert(new Q.UI.Text({
  	color: "#f00",
  	size: 40,
    x: 0,
    //label: "Health: " + Q.state.get("player_health"),
    label: "Health: " + stage.options.hp,
  }), info_cont);

  // Update player_health label. 
  Q.state.on("change.player_health", function(){ 
    //health_label.p.label = "Health: " + Q.state.get("player_health")
    health_label.p.label = "Health: " + stage.options.hp 
  });


  // -------------------------------------------------------

// Container for options menu
  var options_cont = stage.insert(new Q.UI.Container({
    border: 2,
    hidden: true,
    fill: "white",
    radius: 3,
    x: Q.width - 200,
    y: 100,
  }));

  // Button to display the options menu.
  var options_btn = stage.insert(new Q.UI.Button({
    border: 2,
    fill: "white",
    label: "Options",
    radius: 3,
    x: Q.width - 200,
    y: 50,
  }, function() {
    if(this.p.fill == "white") this.p.fill = "red";
    else this.p.fill = "white";
    options_cont.p.hidden = !(options_cont.p.hidden); 
  })); 

  // Advance to the next level (Obviously for debug only).
  var level_advance_btn = stage.insert(new Q.UI.Button({
    y: 180,
    label: "Advance level"
  }, function(){
    Q.stage(0).trigger("beat_level");
  }), options_cont);

  // Change game zoom
  var zoom_toggle = stage.insert(new Q.UI.Button({
    y: 140,
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
    y: 100,
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
    y: 60,
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
    y: 20,
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

  // -------------------------------------------------------

  weapon_cont.fit(20,50);
  info_cont.fit(20,50);
  health_cont.fit(5,5);
});
