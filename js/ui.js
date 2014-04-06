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
    label: "Ammo: " + stage.options.bullets,

  }), weapon_cont);

  // Update ammo label. 
  Q.state.on("change.ammo", function(){ 
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
    label: "Health: " + stage.options.hp,
  }), info_cont);

  // Update player_health label. 
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
  
  // title container
  var title_cont = stage.insert(new Q.UI.Container({
    border: 0,
    opacity: .5,
    fill: "#333",
    x: Q.width/2,
    y: Q.height/4,
  }));

  // title label
  var start_title_label = stage.insert(new Q.UI.Text({
    label: "Four-To-The-Fifth",
    size: 100,
    family: "nintendo_nes_font",
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
    Q.stageScene("ui", 1, Q('Player').first().p);
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
    fill: "#222",
    opacity: .7,
    radius: 3,
    x: Q.width/2,
    y: Q.height/2,
  }));

  // controls label
  var start_controls_label = stage.insert(new Q.UI.Text({
    label: "Controls",
    color: "#222",
    y: -80,
  }), start_options_cont);

  // controls label
  var controls_label = stage.insert(new Q.UI.Text({
    label: "Movement: WASD \nSwitch Weapon: NUMKEYS \nFire weapon: SPACE \nPause: BACKSPACE",
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
  title_cont.fit(100, 400);
  //start_cont.fit(10, 10);
  start_cont.fit(50, 75);
  start_options_cont.fit(10, 10);

});

