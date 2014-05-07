Four-to-the-Fifth
=================

This is a group project for UMBC's software engineering course, CMSC 345.

| Team members       | Role               |
| ------------------ | ----------------   |
| Kevin Coxe         | Team Lead / UI     |
| Chiebuka Ezekwenna | Backup Lead / Docs |
| Chris Laverdiere   | Technical Lead     |
| Kasey White        | AI / Gameplay      |
| Rhea Horton        | Graphics / Art     |

Proposal
-----------------
We propose a simple objective based video game. The game should have a well defined objective with at least 3 distinct levels. An enemy unit (or units) should be defined to give the game a level of difficulty. The main character in the game should have a unique weapon to give the player a sense of power and a tool with which to achieve the game objective. Along with this should be a leveling system so that the player grows stronger over the course of the game. At the end of the game there should be a final boss fight.

IRC
-----------------
Our IRC channel is **#fourtothefifth** at irc.freenode.net.

Playing the Game
-----------------
Current deployments of our game can be found at:

- http://userpages.umbc.edu/~chlaver1/Four-to-the-Fifth/game.html
- http://kevincoxe.net/html/Four-to-the-Fifth/game.html

Along with more information at:

http://userpages.umbc.edu/~chlaver1/Four-to-the-Fifth/about.html

Running the Game Locally
------------------------
If the game is running slowly (or not at all) on one of our hosts, you can run the game locally on your machine.

Clone the repo: 

``` bash
git clone https://github.com/CLaverdiere/Four-to-the-Fifth.git
```

Host the game on your localhost. We've just been using Python: 

``` bash
python -m SimpleHTTPServer
```

Or, if you're on Python 3: 

``` bash
python -m http.server
```

Play the game. 

``` bash
chrome ./game.html
```

Credits
-----------------
Music developed through http://www.pulseboy.com/

Tileset assets courtesy of http://opengameart.org/

Various sound effects gathered from http://soundjay.com/

