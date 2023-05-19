# Project 1: Coin Sprint

### Name: Suyoun Lee (이수연)
### ID: 20200773
### Email: jenslee705@kaist.ac.kr
### URL of Git Repository: https://github.com/suyounjuly5/Software_Prototyping_Coin_Sprint
### URL of Youtube Video: https://www.youtube.com/watch?v=XzixRFPRy8U

# **Description of Game**
* The goal of the game is to get all of the coins on the screen within a minute.
* The game consists of different backgrounds that include rivers, roads, bike road, train track, and grass. 
    * The map of the game is randomly generated everytime the game starts. The lowest row is always set as grass. 
    * When two rows of road is adjacent to each other, the road.png gets replaced with roadtop.png and roaddown.png making it look like a two way road.

* There are several obstacles in the game. When the obstacles collide with the player, gameover. 

    * Cars
        * Cars move to the left side of the canvas for the first road while it moves to the right side for the second road row.
        * All the cars come out at different interval and speed

    * Train 
        * The train moves to the right direction on the train track. 
        * The train comeout at random speed ranging from 1 to 20 seconds. 

    * Water
        * The player drowns when it gets in the water. To help the player move around the water, there are bridges and leaves which are placed randomly. 
            * A bridge is drawn on random column. If two rows of water are adjacent, the bridge in the second row is drawn in the same column as the first bridge.
            * 1-2 leaves are drawn on the water where there is no bridge. 

* There are also barriers in the game.
    * On the grass, 2-3 tree trucks or bushes are drawn. Player must go around the tree truck or bushed because the barrier do not allow the player to move foward. 

* When the game starts, 10 coins are shown on the screen and the player's job is to collect all the coins in a minute. The player always starts in a random coloum of the bike road background. If the player stands still for more than 5 seconds throughout the game, gameover. 

* The player can move around with the arrow key in the keyBoard. Player cannot go outside the canvas at all times.
    * Move up - press up arrow key
    * Move down - press down arrow key
    * Move left - press left arrow key
    * Move right - press right arrow key

* When the player dies, "Gameover" shows up in red and the game can restart by pressing the space button.

* When player suceeds, "Hooray Next Level" shows up in green. (Other levels are not implmented in this project)

# **Description of Code**
1. **Setup Function**
* In the setup phase, the canvas is created. Each background is 100 x100. They are placed in an array and shuffled everytime the game is refreshed. 
* Game elements such as cars, train, coins are initalized. The placement of obstacles, coins, and character is randomized here. 

2. **Draw Function**
* In this function, the game is rendered in each frame updating the background, obstacles, cars, trains, coins, and the character. Each frame, the position of cars, trains, and characters are updated based on their speeds and directions. 
* Each type of background is handled differently, the index of road is found and cars are only drawn on the road. Bridges and leaves are placed after checking the row for river. 


3. **Character Class**
    * Contains the methods: move, draw, checkCollision
        * Move method: move character according to the key pressed.
        * Draw method: draw character on the canvas using character's image and position
        
4. **Collision Detection**
* The collision detection is in the 'checkCollision' method of the 'Character' class. This method is called with another entity (Car, Train, or Coin) as an argument. It checks if the character has collided with an entity by compairing their bounding boxes. 
    * Character bounding box: The character's bounded box is defined by character left, characterRight, characterTop, characterBottom
        * characterleft: the x-coordinate of left edge
        * characterright: the x-coordinate of right edge
        * characterTop: the y-coordinate of top edge
        * characterBottom: the y-coordinate of bottom edge
    * Entity bounding box: the entity's bounding box is defined in a similar way as the character bounding box.
* Detection: the code checks if the charaacter's bounding box overlaps with the entity's bounding box. If the two overlap, collision is detected. 
    * Check if character's bounding box is not entirely to the right of the entity's bounding box: characterLeft > entityRight.
    *Check if character's bounding box is not entirely to the left of the entity's bounding box: characterRight < entityLeft.

5. **Car Class**
* This class represents the cars in the game. It has car images, direction, speed, and x,y position as its property
    * Move method: moves cars according to its speed, direction, checks the distance to the next car
    * Check distance: adjust's the car's speed based on the distance to the next car in the same direction.
    * isOffscreen method: check if the car has moved out of the screen. 

6. **AddCar Function**
* This function creates and add new cars to the game. It chooses a random car image, checks if there is enouge space for a new car to maintain safe distance between cars. If condition are met, it creates a new Car object and pushed it to the corresponding list of cars: carsLeft or carsRight.

7. **Train Class**
* Represents trains in the game
    * move method: moves the train according to speed
    * isOffscreen: checks if the train moved off screen.

8. **AddTrain Function**
* The function is used to create a new train to the game. It selects the train image, define direction, create new Train object with a random speed, then add it to the list of trains.

9. **Coin Class**
* Represents coins in the game. It takes coin image and x,y position as property
    * draw method: this draws the coin on the canvas using the coin's image and position. 

10. **keyPressed Function**
* This function is called whenever the key is pressed. It moves the character up, down, left, or right. If space key is pressed, page is reloaded and game restarts. 
    

### **Reference**
* https://www.youtube.com/watch?v=HK_oG_ev8FQ
* https://www.codingfactory.net/10899
* https://www.youtube.com/watch?v=uAfw-ko3kB8 
* https://bigtop.tistory.com/60
* https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/find
