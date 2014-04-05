// Setup Quintus instance
var Q = Quintus({ development: true, audioSupported: [ 'wav' ] })
          .include("Sprites, Scenes, Input, 2D, Audio, Anim, Touch, UI, TMX")
          .enableSound()
          .setup({ maximize:true })
          .touch();

// For now, let's keep track of the current number of maps.
// Increment this if you add a new one. 
var NUM_MAPS = 2

// Keep track of change in mouse coords.
var prev_mouse_coords = [0, 0];

// All music tracks.
var tracks = ["test.wav", "disp_heroes.wav"];

// Turn off gravity, the game is top down.
Q.gravityX = 0;
Q.gravityY = 0;

// Define custom key mappings
Q.KEY_NAMES.Q = 81;
Q.KEY_NAMES.E = 69;
Q.KEY_NAMES.W = 87;
Q.KEY_NAMES.A = 65;
Q.KEY_NAMES.S = 83;
Q.KEY_NAMES.D = 68;
Q.KEY_NAMES.E = 69;
Q.KEY_NAMES.F = 70;
Q.KEY_NAMES.SHIFT = 16;
Q.KEY_NAMES.ONE   = 49;
Q.KEY_NAMES.TWO   = 50;
Q.KEY_NAMES.THREE = 51;
Q.KEY_NAMES.FOUR  = 52;
Q.KEY_NAMES.FIVE  = 53;
Q.KEY_NAMES.SIX   = 54;
Q.KEY_NAMES.SEVEN = 55;
Q.KEY_NAMES.BACKSPACE = 8;

// Some useful constants for speeding things up.
var TO_RAD = Math.PI / 180
var TO_DEG = 180 / Math.PI

// Key actions
Q.input.keyboardControls({
  UP:     'up',     W: 'up',
  LEFT:   'left',   A: 'left',
  DOWN:   'down',   S: 'down',
  RIGHT:  'right',  D: 'right',
  SPACE:  'fire',
  SHIFT:  'sprint',
  E:      'forward',
  F:      'sword',
  ONE:    'wep1',
  TWO:    'wep2',
  THREE:  'wep3',
  FOUR:   'wep4',
  FIVE:   'wep5',
  SIX:    'wep6',
  SEVEN:  'wep7',
  BACKSPACE:  'pause',
});

Q.input.mouseControls({ cursor: "on" });

// Set initial game state.
Q.state.set({ killed: 0,
              alive: 0,
              player_health: 100,
              ammo: 50, 
              level: 1,
              paused: false,
              track_id: 0, 
              track_playing: false, 
});


// Load other resources
Q.loadTMX([
         "start_level.tmx", 

         "ammo_clip.png",
         "bullet.png",
         "cave.png",
         "explosion.png",
         "enemy.png",
         "shot_pellet.png",
         "soldier_base.png",
         "soldier_pistol.png",
         "soldier_gatling.png",
         "soldier_rocket.png",
         "sword.png", 

         "disp_heroes.wav", 
         "test.wav", 

         "gun_cock.wav", 
         "gun_shot.wav", 
         "rocket_fire.wav",
         "rocket_explode.wav",
         "shotgun_shot.wav", 
         ], function() {
    console.log("Done loading assets.");
    Q.stageScene("start_level", 0);
    Q.stageScene("title", 1);
}, {
  progressCallback: function(loaded, total) {
    // Load map resources
    for(var i=1; i<=NUM_MAPS; i++){
      Q.loadTMX("level" + i + ".tmx");
    }
    
    var ls = document.getElementById("loading_status");
    ls.innerHTML = Math.floor(loaded / total * 100);
    if(loaded == total){
      ls.remove(); 
    }
  }
});
