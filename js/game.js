var Q = Quintus({ development: true })
          .include("Sprites, Scenes, Input")
          .setup({ maximize:true });

Q.load([ "player.png" ], function() {
    console.log("Done loading assets.");
});

