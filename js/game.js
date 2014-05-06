// Setup Quintus instance
var Q = Quintus({ development: true, audioSupported: [ 'wav' ] })
          .include("Sprites, Scenes, Input, 2D, Audio, Anim, Touch, UI, TMX")
          .enableSound()
          .setup({ maximize:true })
          .touch();

// GAME SETTINGS
var MUSIC_ENABLED = true;

// ABILITY SETTINGS
var COOLDOWN = 0;
var SUPER_EXPLOSIONS = false;
var HOMING_ROCKETS = false;
var SUPER_SHOTGUN = false;

// Increment this if you add a new map in pattern 
// ie: (level1.tmx, level2.tmx, ..., levelN.tmx). 
var NUM_MAPS = 4
var BOSS_TEXT_PAGE = 1
var POWER_UP = ""

// USEFUL GLOBALS 
// Keep track of change in mouse coords.
var prev_mouse_coords = [0, 0];

// All music tracks.
var tracks = [ "disp_heroes.wav", "test.wav", "metal.wav" ];

// Global next track control
var play_next_track = function() {
    console.log("Playing next track");
    Q.state.set("track_playing", true);
    if(MUSIC_ENABLED){
      Q.audio.stop();
      Q.state.inc("track_id", 1);
      if(Q.state.get("track_id") >= tracks.length) Q.state.set("track_id", 0);
      Q.audio.play(tracks[Q.state.get("track_id")], { loop: true });
    }
}

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
  SHIFT:  'sprint', Q: 'powerUp',
  E:      'forward',
  F:      'punch',
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
              pause: 0,
              COOLDOWN: 0,
              SUPER_EXPLOSIONS: false,
              HOMING_ROCKETS: false,
              SUPER_SHOTGUN: false,
});


// Load other resources
Q.loadTMX([
         "start_level.tmx", 

         "ammo_clip.png",
         "boss_base.png",
         "boss_pistol.png",
         "boss_punch.png",
         "boss_gatling.png",
         "boss_assault_rifle.png",
         "boss_rocket.png",
         "boss_shotgun.png",
         "bullet.png",
         "cave.png",
         "explosion.png",
         "enemy.png",
         "health_pack.png",
         "robot_dual.png",
         "robot_gatling.png",
         "rocket.png",
         "shot_pellet.png",
         "soldier_base.png",
         "soldier_pistol.png",
         "soldier_punch.png",
         "soldier_gatling.png",
         "soldier_assault_rifle.png",
         "soldier_rocket.png",
         "soldier_shotgun.png",
         "tough_guy.png",
         "zombie1.png", 
         "zombie2.png", 

         "between_levels.wav",
         "boss_fight.wav", 
         "disp_heroes.wav", 
         "game_over.wav", 
         "metal.wav", 
         "test.wav", 
         "victory.wav", 

         "assault_rifle_shot.wav", 
         "gun_cock.wav", 
         "gun_shot.wav", 
         "health_collect.wav", 
         "minigun_shot.wav", 
         "pistol_shot.wav", 
         "punch1.wav",
         "punch2.wav",
         "rocket_fire.wav",
         "rocket_fire2.wav",
         "rocket_explode.wav",
         "rocket_explode2.wav",
         "shotgun_shot.wav", 
         "shotgun_shot2.wav", 
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
    
    var ld = document.getElementById("loading");
    var ls = document.getElementById("loading_status");
    ls.innerHTML = "Now Loading... " + Math.floor(loaded / total * 100) + "%";
    if(loaded == total){
      ld.remove(); 
    }
  }
});
