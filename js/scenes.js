// Create player scene
Q.scene("level1", function(stage) {

  // Draw the background
  stage.insert(new Q.Repeater({ asset: "line_paper.png" }));

  // Generate some random wall groupings that hopefully don't collide too much.
  // A map editor would be better for this.
  var px = py = 0; // Current position of new wall
  var rota;        // Current angle of wall
  for(var i=0; i<100; i++){
    var bx = Math.round(Math.random());
    var by = Math.round(Math.random());
    var rot = Math.round(Math.random());
    px += 40 * bx;
    py += 160 * by;

    if(rot){
      py = [px, px=py][0]; // swap px and py if image rotated.
      rota = 90;
    } else rota = 0;

    // Special case for joining wall
    if(rot && bx && by) rota = 135;

    stage.insert(new Q.Wall( { x: px, y: py, angle: rota })); 
    // console.log("New wall at x: " + px + ", y: " + py + ", angle: " + rota);
  }

  // Create our player
  var player = stage.insert(new Q.Player());

  // Create some enemies
  for(var i=0; i<50; i++){
    stage.insert(new Q.Enemy({x: Math.random() * 3000, y: Math.random() * 3000, speed: 1 + Math.random()}));
  }

  // Create some ammo clips
  for(var i=0; i<10; i++){
    stage.insert(new Q.Ammo({x: Math.random() * 3000, y: Math.random() * 3000}));
  }

  Q.audio.play('test.wav', { loop: true });
  stage.add("viewport").follow(player);
});


Q.scene("ui", function(stage){

  // Store music track state
  var tracks = ["test.wav", "disp_heroes.wav"];
  var track_no = 0;
  var track_playing = true;

  // Store pause state
  var paused = false;

  // Container for instructions, alerts, etc.
  var bottom_cont = stage.insert(new Q.UI.Container({
    border: 2,
    fill: "white",
    radius: 3,
    x: Q.width/2,
    y: Q.height - 50,
  }));

  // Player Controls label
  var controls_label = stage.insert(new Q.UI.Text({
    label: "WASD: Movement | SHIFT: Sprint | SPACE: Shoot | NUMKEYS: Weapons"
  }), bottom_cont);

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


  // Turn music on or off option
  var music_toggle = stage.insert(new Q.UI.Button({
    y: -100,
    label: "Music on/off"
  }, function(){
    if(track_playing){
      Q.audio.stop();     
      track_playing = false;
    } else{
      Q.audio.stop();     
      Q.audio.play(tracks[track_no], { loop: true });
      track_playing = true;
    }
  }), options_cont);

  // Pause Game
  var pause_toggle = stage.insert(new Q.UI.Button({
  	y: -60,
  	fill: "white",
  	label: "Pause/Unpause Game",
  }, function(){
  	if(!paused) {
      paused = true;
  		Q.pauseGame();
  		Q.audio.stop();
  	}
    else {
      paused = false;
    	Q.unpauseGame();
    	Q.audio.play(tracks[track_no], { loop: true });
    };
  }), options_cont);

  // Switch music track
  var music_track = stage.insert(new Q.UI.Button({
    y: -20,
    label: "Next Music Track"
  }, function(){
    Q.audio.stop();     
    if(++track_no >= tracks.length){
      track_no = 0;
    }
    Q.audio.play(tracks[track_no], { loop: true });     
  }), options_cont);

  bottom_cont.fit(10, 10);
  options_cont.fit(10, 10);
});
