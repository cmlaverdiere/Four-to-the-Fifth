// Setup Quintus instance
var Q = Quintus({ development: true, audioSupported: [ 'wav' ] })
          .include("Sprites, Scenes, Input, 2D, Audio, Anim, Touch, UI")
          .enableSound()
          .setup({ maximize:true })
          .touch();

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
Q.KEY_NAMES.F = 70;
Q.KEY_NAMES.SHIFT = 16;
Q.KEY_NAMES.ONE   = 49;
Q.KEY_NAMES.TWO   = 50;
Q.KEY_NAMES.THREE = 51;
Q.KEY_NAMES.FOUR  = 52;
Q.KEY_NAMES.FIVE  = 53;
Q.KEY_NAMES.SIX   = 54;
Q.KEY_NAMES.SEVEN = 55;

// Some useful constants for speeding things up.
var TO_RAD = Math.PI / 180
var TO_DEG = 180 / Math.PI

// Key actions
Q.input.keyboardControls({
  UP:     'forward', W: 'forward',
  LEFT:   'left',   A: 'left',
  DOWN:   'down',   S: 'down',
  RIGHT:  'right',  D: 'right',
  SPACE:  'fire',
  SHIFT:  'sprint',
  F:      'sword',
  ONE:    'wep1',
  TWO:    'wep2',
  THREE:  'wep3',
  FOUR:   'wep4',
  FIVE:   'wep5',
  SIX:    'wep6',
  SEVEN:  'wep7',
});

Q.input.mouseControls({ cursor: "on" });

// Set initial game state.
Q.state.set({ killed: 0,
			  alive: 0,
			  ammo: 30, 
              level: 1,
              paused: false,
              track_id: 0, 
              track_playing: false, 
});

// Load resources
Q.load([ 
         "ammo_clip.png",
         "bullet.png",
         "enemy.png",
         "floor_tile.png", 
         "floor_tile_pencil.png", 
         "line_paper.png", 
         "player.png",
         "player_with_gun.png",
         "player_with_shotgun.png",
         "sword.png", 
         "tough_guy.png",
         "wall.png", 

         "disp_heroes.wav", 
         "gun_cock.wav", 
         "gun_shot.wav", 
         "shotgun_shot.wav", 
         "test.wav", 
         ], function() {
    console.log("Done loading assets.");
    Q.stageScene("level1", 0);
    Q.stageScene("ui", 1);
});
