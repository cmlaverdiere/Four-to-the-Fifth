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
    ammo_label.p.label = "Ammo: " + stage.options.bullets
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

  weapon_cont.fit(20,50);
  info_cont.fit(20,50);
  health_cont.fit(5,5);
});


// The initial title screen.
Q.scene("title", function(stage) {
  var title = document.getElementById("start_title");
  
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
    Q.stageScene("level", 0);
    Q.stageScene("ui", 1, Q('Player').first().p);
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
