// UI color theme
var FG_COL = "#0099ff";
var BG_COL = "#202020";

// Base theme class for game text.
Q.UI.FttFText = Q.UI.Text.extend("UI.FttFText", {
  init: function(p) {
    this._super(p, {
      label: "Insert Text",
      family: "nintendo_nes_font",
      color: FG_COL,
    });
  }
});


// Base theme class for containers.
Q.UI.FttFContainer = Q.UI.Container.extend("UI.FttFContainer", {
  init: function(p) {
    this._super(p, {
      border: 2,
      color: FG_COL,
      fill: BG_COL,
      opacity: .7,
      radius: 3,
    });
  }
});


// Base theme class for buttons.
// I cannot get this to work... 
Q.UI.FttFButton = Q.UI.Button.extend("UI.FttFButton", {
  init: function(p, callback) {
    this._super(p, callback, {
      border: 2,
      fill: FG_COL,
      label: "Insert Text",
      radius: 3,
    });
  }
});


Q.scene("menu", function(stage){
  // options container
  var options_cont = stage.insert(new Q.UI.FttFContainer({
    w: 200,
    h: 60,
    x: Q.width - 150,
    y: 10,
    hidden: true,
  }));

  Q.state.on("change.pause", function(){
    options_cont.p.hidden = !(options_cont.p.hidden);
  });

  // Next level button
  var next_lvl_btn = stage.insert(new Q.UI.Button({
    border: 1,
    w: 200,
    h: 30,
    x: 0,
    y: 80,
    label: "Next Level",
  }, function() {
    options_cont.p.hidden = !(options_cont.p.hidden);
    Q.stage(0).trigger("beat_level");
    //start_cont.p.hidden = !(start_cont.p.hidden);
  }),options_cont);

  // Change game zoom
  var zoom_toggle = stage.insert(new Q.UI.Button({
    border: 1,
    w: 200,
    h: 30,
    x: 0,
    y: 120,
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

  // Options button
  var options_btn = stage.insert(new Q.UI.Button({
    border: 2,
    fill: FG_COL,
    label: "Controls",
    color: FG_COL,
    radius: 3,
    w: 140,
    h: 30,
    x: Q.width - 150,
    y: 40,
  }, function() {
    options_cont.p.hidden = !(options_cont.p.hidden);
  }));

  // Toggle music on or off option.
  var music_toggle = stage.insert(new Q.UI.Button({
    border: 1,
    w: 200,
    h: 30,
    x: 0,
    y: 160,
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

  // Switch music track
    var music_track = stage.insert(new Q.UI.Button({
      border: 1,
      w: 200,
      h: 30,
      x: 0,
      y: 200,
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

  options_cont.fit(30,20);

});


Q.scene("ui", function(stage){
  // Weapon container
  var weapon_cont = stage.insert(new Q.UI.FttFContainer({
    w: 200,
    h: 60,
    x: Q.width - 150,
    y: Q.height - 40,
  }));

  // Total ammo label
  var ammo_label = stage.insert(new Q.UI.FttFText({
    size: 40,
    label: "Ammo: " + stage.options.bullets,
  }), weapon_cont);

  // Update ammo label. 
  Q.state.on("change.ammo", function(){ 
    ammo_label.p.label = "Ammo: " + (stage.options.bullets > 0 ? stage.options.bullets : 0);
  });

  // Info container
  var info_cont = stage.insert(new Q.UI.FttFContainer({
    w: 200,
    h: 60,
    x: 150,
    y: Q.height - 40,
  }));

  // Health container
  var health_cont = stage.insert(new Q.UI.FttFContainer({
    // ...
  }), info_cont);

  // Health label
  var health_label = stage.insert(new Q.UI.FttFText({
    color: "#f00",
    size: 40,
    label: "Health: " + stage.options.hp,
  }), info_cont);

  // Update player_health label event. 
  Q.state.on("change.player_health", function(){ 
    health_label.p.label = "Health: " + stage.options.hp 
  });

  //level container
  var level_cont = stage.insert(new Q.UI.FttFContainer({
    w: 400,
    h: 60,
    x: Q.width/2,
    y: Q.height - 40,
  }));

  //level label
  var level_label = stage.insert(new Q.UI.FttFText({
    color: "#fff",
    size: 40,
    x: -150,
    label: "lvl: " + Q.state.get("level"),
  }), level_cont);

  // Total enemys left label
  var enemy_left_label = stage.insert(new Q.UI.Text({
    color: "#fff",
    size: 40,
    x: 75,
    label: "Enemies: " + Q.state.get("alive"),
  }), level_cont);

  // Update number enemys left label. 
  Q.state.on("change.alive", function(){ 
    enemy_left_label.p.label = "Enemies: " + Q.state.get("alive") 
  });

  // Update level label event. 
  Q.state.on("change.level", function(){ 
    level_label.p.label = "lvl: " + Q.state.get("level") 
  });

  level_cont.fit(20,20);
  weapon_cont.fit(20,50);
  info_cont.fit(20,50);
  health_cont.fit(5,5);
});


// The initial title screen.
Q.scene("title", function(stage) {
  //var title = document.getElementById("start_title");

  // Title container
  var title_cont = stage.insert(new Q.UI.FttFContainer({
    x: Q.width/2,
    y: Q.height/8,
  }));

  // Title label
  var start_title_label = stage.insert(new Q.UI.FttFText({
    label: "Four-To-The-Fifth",
    size: 80,
    y: 100,
  }), title_cont);
  
  // Container for start up
  var start_cont = stage.insert(new Q.UI.FttFContainer({
    x: Q.width/2,
    y: Q.height/2,
  }));

  // Button to Start Game.
  var start_btn = stage.insert(new Q.UI.FttFButton({
    border: 2,
    fill: FG_COL,
    label: "Start Game",
  }, function() {
    Q.audio.stop();
    Q.stageScene("level", 0);
    Q.stageScene("ui", 1, Q('Player').first().p);
    Q.stageScene("menu", 2);
  }), start_cont);

  // Button to show options.
  var start_options_btn = stage.insert(new Q.UI.Button({
    border: 2,
    fill: FG_COL,
    label: "Options",
    color: FG_COL,
    radius: 3,
    y: 50,
  }, function() {
    start_options_cont.p.hidden = !(start_options_cont.p.hidden);
    start_cont.p.hidden = !(start_cont.p.hidden);
  }), start_cont);

  // Container for start options
  var start_options_cont = stage.insert(new Q.UI.FttFContainer({
    hidden: true,
    x: Q.width/2,
    y: Q.height/2,
  }));

  // Controls Header label
  var start_controls_label = stage.insert(new Q.UI.FttFText({
    label: "Controls",
    y: -80,
  }), start_options_cont);

  // Controls label
  var controls_label = stage.insert(new Q.UI.FttFText({
    label: "Movement: WASD \nSwitch Weapon: NUMKEYS \nFire weapon: SPACE \nPause: BACKSPACE",
    size: 16
  }), start_options_cont);

  // Button to go back to start menu.
  var return_to_start_btn = stage.insert(new Q.UI.Button({
    border: 2,
    fill: FG_COL,
    label: "Back",
    y: 100,
  }, function() {
    start_options_cont.p.hidden = !(start_options_cont.p.hidden);
    start_cont.p.hidden = !(start_cont.p.hidden);
  }), start_options_cont);

  title_cont.fit(100, 400);
  start_cont.fit(50, 75);
  start_options_cont.fit(10, 10);
});
