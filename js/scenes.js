// Create player scene
Q.scene("level", function(stage) {
  var fmod = 4;
  var frenzied_enemies = false;

  Q.stageTMX("level" + Q.state.get("level") + ".tmx", stage);
  stage.add("viewport").follow(Q("Player").first());

  // Initialize enemy amount
  Q.state.set("alive", Q("Enemy").length);

    if(Q.state.get("level") == 4){
      Q.audio.stop();
      Q.audio.play("boss_fight.wav", { loop: true });
    } else {
      play_next_track();
    }

  // pause game
  stage.on("pause_game", function(){
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
  });

  // Handle event for when an enemy is killed.
  stage.on("enemy_killed", function(){ 
    Q.state.inc("killed", 1);
    Q.state.dec("alive", 1);
    frenzied_enemies = false;

    // Every few enemies killed, let's trigger a frenzy.
    if(!frenzied_enemies && Q.state.get("killed") % fmod === 0){
      Q("Enemy").trigger("frenzy"); 
      fmod *= 2;
      frenzied_enemies = true;
    }

    // Check if game over.
    if(Q("Enemy").length <= 1){
      console.log("Level beaten. Staging Next level."); 
      stage.trigger("beat_level");
    }
  });

  // Handle event for when player finishes a level.
  stage.on("beat_level", function() {

      // If there's still a level after, proceed to the next level.
      if(Q.state.get("level") < NUM_MAPS){
        Q.state.inc("level", 1);
        Q.stageScene("story_scene", 0);
        Q.stageScene("null", 1);
        Q.stageScene("null", 2);
      } else {
        console.log("Game beaten.");
        Q.stageScene("endgame", 0);
        Q.stageScene("null", 1);
        Q.stageScene("null", 2);
      }
  });

  stage.on("player_death", function() {
    if(MUSIC_ENABLED){
      Q.audio.stop();
      Q.audio.play("game_over.wav", { loop: true });
    }
    Q.stageScene("title", 1);
    Q.stageScene("null", 2);
  });

});

// ============================================

Q.scene("story_scene", function(stage) {

  if(MUSIC_ENABLED){
    Q.audio.stop();
    Q.audio.play("between_levels.wav", { loop: true });
  }

  var story_text = "";
  
  var boss_text_1 = "The Birthing Chamber\n\n"
      + "You find yourself on a balcony overlooking a large room. You think your\n"
      + "eyes are playing tricks on you because in the darkness it looks like\n"
      + "the floor below you is tossing and turning like a restless sea but then\n"
      + "you realize it's just packed from wall to wall with zombies. The horde\n"
      + "quickly takes notice of you and begins charging up the stairs. You make\n"
      + "good use of Wilhelm's rocket launcher and blow the foul creatures to\n"
      + "oblivion with shell after shell.\n";

  var boss_text_2 = "Soon there are no more of the creatures left. You make your way down to\n"
      + "the floor, looking for a light switch. The bodies of your teammates\n"
      + "were almost certainly among the ones you blew to pieces just now. Or\n"
      + "perhaps you bore them through with a high-powered rifle shot to the\n"
      + "brain in the previous room or ripped them to shreds with the minigun\n"
      + "back in the loading bay or maybe you murdered them all the way back in\n"
      + "the basement with your very own pistol.\n";

  var boss_text_3 = "You finally find a light switch so you can survey the massacre\n"
      + "properly. The floor is covered with the shredded and bloody bodies of\n"
      + "the zombies. Along the walls you can see more of the eerie blue tanks\n"
      + "from before but these ones aren't empty. Each one holds a human-like\n"
      + "lifeform in various stages of growth, from fetuses to adults. Your mind\n"
      + "flashes back to whispered rumors of secret military cloning projects\n"
      + "that were supposedly shutdown years ago, around the same time as the\n"
      + "zombie outbreaks started.\n";

  var boss_text_4 = "But what holds your attention is the grotesque figure in the center of\n"
      + "the room. What you see is hard to describe. It looks as if several\n"
      + "zombies where thrown into a trash compactor that conked out halfway\n"
      + "through crushing them entirely. Arms, legs and faces dot the surface of\n"
      + "the creatures oozing, green body. The large misshapen blob of green\n"
      + "slime and rotting flesh quivers and shakes every now and again and odd\n"
      + "groaning noises erupt from somewhere deep inside its body. You see\n"
      + "dozens of metal tubes protruding from the creature. They run along the\n"
      + "floor, connecting it to the tanks along the walls. Every now and again\n"
      + "the blob will shiver and make a squelching sound and one of the tanks\n"
      + "will fill with a foul looking cloud of green liquid.\n";

  var boss_text_5 = "This is the source of the zombie outbreak, you realize. This is why no\n"
      + "matter how many you’ve killed over the years always more pop up. The\n"
      + "zombies discovered what the military tried to cover up so long ago: a\n"
      + "cloning machine. They creating artificial humans and infecting them as\n"
      + "they mature to create an endless supply of zombies and this horrendous\n"
      + "creature before you is the source of the virus. But this revelation is\n"
      + "not what horrifies you the most. From the putrid flesh of the super\n"
      + "zombie, among all the horrific visages, three familiar ones stare out\n"
      + "at you. It seems you have not yet given your teammates the rest they\n"
      + "deserve.  The Final Battle:\n";

  var boss_text_6 = "With this terrible revelation before your eyes and horrified vengeance\n"
      + "in your heart you set out to destroy The Source. This is no easy task\n"
      + "as it uses your former teammates against you. It seems that The Source\n"
      + "not only amasses bodies into its being but also weapons. From its\n"
      + "bowels the creature produces a handheld machine gun, a sniper rifle,\n"
      + "and a rocket launcher and the dead hands of your comrades grasp them\n"
      + "with practiced ease. You run around the room, making it hard for the\n"
      + "slow creature to aim at you but you soon find it hard to stay near the\n"
      + "edges of the room as The Source sends new zombies at you from the\n"
      + "birthing tanks. Utilizing all of your comrades’ weapons you keep the\n"
      + "zombies at by while also tearing into The Source with all the\n"
      + "ammunition you have until the creature finally succumbs to its wounds\n"
      + "and dies in an explosion of green slime.";

  if (Q.state.get("level") == 1) {
    story_text = "Introduction\n\n"
      + "There have been reports of a zombie outbreak at a warehouse by the\n"
      + "docks. You are Edward Bennigan, a member of a paramilitary organization\n"
      + "that combats these foul creatures in order to protect mankind. You are\n"
      + "part of a four-man team of weapon specialists: Rocket Specialist\n"
      + "William Wilhelm, Sniper Specialist Sheila Van Dahm, Machine Gun\n"
      + "Specialist Rodney Banks and you, Handgun Specialist Edward Bennigan.\n"
      + "Your four-man team was sent in to investigate the situation, secure the\n"
      + "area, and eliminate the zombies. Unfortunately, your team was attacked\n"
      + "by a large zombie horde upon arrival and you have been separated from\n"
      + "your teammates. Your goal now is to survive, find your teammates, and\n"
      + "find the source of this zombie outbreak and stop it if you can.\n"
      + "\nThe Basement\n\n"
      + "You fight your way through the basement with your trusty pistol and\n"
      + "manage to reach the stairs. As you ascend to the next level you\n"
      + "discover Machine Gun Specialist Bank's minigun in the stairwell. There\n"
      + "is no sign of Bank's except for the blood smearing the walls which\n"
      + "could just as well belong to the zombie corpses that litter the stairs.\n"
      + "You continue upwards, minigun in tow.";
  } else if (Q.state.get("level") == 2) {
    story_text = "The Loading Bay\n\n"
      + "You make it onto the loading bay. If you can just get through the\n"
      + "loading bay doors you'll be home free. You use Bank's minigun to mow\n"
      + "down the zombies in your path and reach the large metal doors. Just as\n"
      + "you're about to pull the lever to open the door something catches your\n"
      + "eye. Sniper Specialist Van Dahm's rifle lying next to a door that is\n"
      + "slightly ajar. You look through the door and discover a staircase\n"
      + "descending into darkness. Should you follow this path in the hopes of\n"
      + "finding your teammates alive? Or leave through the loading bay doors\n"
      + "before more zombies show up?";
  } else if (Q.state.get("level") == 3) {
    story_text = "The Sub-Basement\n\n"
      + "Descending the staircase you find another level, lower than the\n"
      + "basement. Large glass tanks filled with an eerie blue liquid line the\n"
      + "walls. They provide the only illumination in this dark room. There is a\n"
      + "door at the other end of the room and you make your way towards it. The\n"
      + "zombies down here are larger and more powerful than the ones in the\n"
      + "loading bay but with Van Dahm's sniper rifle and Bank's minigun you\n"
      + "make short work of them. Soon you reach the door. Next to it, lying on\n"
      + "the ground like discarded trash, is Rocket Specialist Wilhelm's prized\n"
      + "rocket launcher. You pick up the discarded weapon and continue through\n"
      + "the door, fearing the worst.";
  }

  // Container for text
  var story_text_cont = stage.insert(new Q.UI.FttFContainer({
    x: Q.width/2,
    y: Q.height/2,
  }));

  // Victory text.
  if (Q.state.get("level") < NUM_MAPS) {
    var victory_label = stage.insert(new Q.UI.FttFText({
      label: story_text,
      x: 0,
      y: 0,
    }), story_text_cont);
  } else {
    var victory_label = stage.insert(new Q.UI.FttFText({
      label: boss_text_1,
      x: 0,
      y: 0,
    }), story_text_cont);

    // Button to show next text.
    var next_page_btn = stage.insert(new Q.UI.Button({
      border: 2,
      hidden: false,
      fill: FG_COL,
      label: "---->",
      radius: 3,
      x: -Q.width/3,
      y: -Q.height/4 + 100,
    }, function() {
      BOSS_TEXT_PAGE++;
      if (BOSS_TEXT_PAGE == 1) {
        prev_page_btn.p.hidden = true;
        victory_label.p.label = boss_text_1;
      } else if (BOSS_TEXT_PAGE == 2) {
        prev_page_btn.p.hidden = false;
        victory_label.p.label = boss_text_2;
      } else if (BOSS_TEXT_PAGE == 3) {
        prev_page_btn.p.hidden = false;
        victory_label.p.label = boss_text_3;
      } else if (BOSS_TEXT_PAGE == 4) {
        prev_page_btn.p.hidden = false;
        victory_label.p.label = boss_text_4;
      } else if (BOSS_TEXT_PAGE == 5) {
        prev_page_btn.p.hidden = false;
        victory_label.p.label = boss_text_5;
      } else if (BOSS_TEXT_PAGE == 6) {
        prev_page_btn.p.hidden = false;
        this.p.hidden = true;
        victory_label.p.label = boss_text_6;
      } else {
        prev_page_btn.p.hidden = false;
        this.p.hidden = true;
        BOSS_TEXT_PAGE = 6;
      };
    }), story_text_cont);

    // Button to show prev text.
    var prev_page_btn = stage.insert(new Q.UI.Button({
      border: 2,
      hidden: true,
      fill: FG_COL,
      label: "<----",
      radius: 3,
      x: -Q.width/3,
      y: -Q.height/4 + 200,
    }, function() {
      BOSS_TEXT_PAGE--;
      if (BOSS_TEXT_PAGE < 1) {
        next_page_btn.p.hidden = false;
        this.p.hidden = true;
        BOSS_TEXT_PAGE = 1;
        victory_label.p.label = boss_text_1;
      } else if (BOSS_TEXT_PAGE == 1) {
        next_page_btn.p.hidden = false;
        this.p.hidden = true;
        victory_label.p.label = boss_text_1;
      } else if (BOSS_TEXT_PAGE == 2) {
        next_page_btn.p.hidden = false;
        victory_label.p.label = boss_text_2;
      } else if (BOSS_TEXT_PAGE == 3) {
        next_page_btn.p.hidden = false;
        victory_label.p.label = boss_text_3;
      } else if (BOSS_TEXT_PAGE == 4) {
        next_page_btn.p.hidden = false;
        victory_label.p.label = boss_text_4;
      } else if (BOSS_TEXT_PAGE == 5) {
        next_page_btn.p.hidden = false;
        victory_label.p.label = boss_text_5;
      } else if (BOSS_TEXT_PAGE == 6) {
        next_page_btn.p.hidden = true;
        victory_label.p.label = boss_text_6;
      };
    }), story_text_cont);
  };

  // Button to restart Game.
  var play_next_btn = stage.insert(new Q.UI.Button({
    border: 2,
    fill: FG_COL,
    label: "Start Level",
    radius: 3,
    x: -Q.width/2+75,
    y: -Q.height/2+50,
  }, function() {
    // If there's still a level after, proceed to the next level.
    if(Q.state.get("level") <= NUM_MAPS){
      COOLDOWN = 0;
      Q.stageScene("level", 0);
      Q.stageScene("ui", 1, Q('Player').first().p);
      Q.stageScene("menu", 2);
    } else { // Otherwise, we've beaten the game.
      console.log("Game beaten.");
      Q.stageScene("endgame", 0);
      Q.stageScene("null", 1);
      Q.stageScene("null", 2);
    }
  }), story_text_cont);

});

// ============================================

// The ending screen.
Q.scene("endgame", function(stage) {
  if(MUSIC_ENABLED){
    Q.audio.stop();
    Q.audio.play("victory.wav", { loop: true });
  }

  // Victory text.
  var victory_label = stage.insert(new Q.UI.FttFText({
    label: "Congrats, you've saved the world from all those killer zombies.",
    x: Q.width/2,
    y: Q.height/4,
  }));

  // Button to restart Game.
  var restart_btn = stage.insert(new Q.UI.Button({
    border: 2,
    fill: FG_COL,
    label: "Play Again?",
    radius: 3,
    x: Q.width/2,
    y: Q.height/2,
  }, function() {
    Q.state.set("level", 1);
    Q.state.set("ammo", 50);
    Q.state.set("player_health", 100);
    Q.stageScene("level", 0);
    Q.stageScene("ui", 1);
    Q.stageScene("menu", 2);
  }));
});

// Create player scene
Q.scene("start_level", function(stage) {
  var fmod = 4;
  var frenzied_enemies = false;

  Q.stageTMX("start_level.tmx", stage);
  stage.add("viewport").follow(Q("Enemy").first());

  // Initialize enemy amount
  Q.state.set("alive", Q("Enemy").length);

  play_next_track();
});
