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
