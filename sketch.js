
var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var clouds;
var mountains;
var trees_x;

var collectables;
var canyons;

var game_score;
var flagpole;
var lives;

var platforms;
var enemies;

var jumpSound;
var fallingSound;
var collectSound;
var killedSound;

function preload()
{
    soundFormats('mp3','wav');
    
    //loaded sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
    fallingSound = loadSound('assets/falling.wav');
    fallingSound.setVolume(0.1);
    fallingSound.rate([3.0]);
    collectSound = loadSound('assets/collect.wav');
    collectSound.setVolume(0.1);
    killedSound = loadSound('assets/killed.wav');
    killedSound.setVolume(0.1);
}


function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
    lives = 3;
    startGame();

}
function draw()
{
	background(100, 155, 255); // fill the sky blue

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground

    push();
    translate (scrollPos,0);

    drawMountains();
    drawTrees();
    drawClouds();
    
    for (var i = 0; i < platforms.length; i++)
    {
        platforms[i].draw();
    }

    for (var i=0; i< canyons.length; i++)
    {
        drawCanyon(canyons[i]);
        checkCanyon(canyons[i]);
    }

    for (var i=0; i< collectables.length; i++)
    {
        if(collectables[i].isFound == false)
        {
            drawCollectable(collectables[i]);
            checkCollectable(collectables[i]);
        }
    }

    renderFlagpole();
    
    checkPlayerDie();
    pop();
    
    //collectable score count
    
    fill(255);
    noStroke();
    textSize(30);
    text("Score: " + game_score, 40, 40);
    textSize(12);
    
    //life tokens 
    for (var i=0; i<lives; i++)
    {       
        fill(255);
        textSize(30);
        text("Lives Left:", 200,40);
        textSize(12);
        fill(255, 0,0);
        ellipse(216.6+i*40, 66.6, 20, 20);
        ellipse(233.2+i*40, 66.6, 20, 20);
        triangle(241.2+i*40, 72.6, 225+i*40, 95, 208.6+i*40, 72.6);        
    }
    
    if (lives < 1)
    {
        fill(255);
        textSize(30);
        text("Game over", width/2, height/2);            
        textSize(12);
        return;
    }
    
    if (flagpole.isReached)
    {
        fill(255);
        textSize(30);
        text("Level complete!!! ", width/2, height/2);
        textSize(12);
        return;

    }
    
	// game character.
	
	drawGameChar();

	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.

    isFalling = false;
    if(gameChar_y < floorPos_y)
    {
        
        var isContact = false;
        for(var i = 0; i < platforms.length; i++)
        {
            if(platforms[i].checkContact(gameChar_world_x, gameChar_y))
            {
                isContact = true;
                break;
            }
        }
            if(isContact == false)
            {
                
                gameChar_y +=2;
                isFalling = true;
            }    
    }

    
    if(isPlummeting)
    {
        gameChar_y +=2; 
        fallingSound.play();
    }
    
    if (flagpole.isReached == false)
    {
        checkFlagpole();        
    }


	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}


// ---------------------
// Key control functions

// move the character by left and right arrows and jump using the space bar
// ---------------------

function keyPressed(){

    if(keyCode == 37)
    {
        isLeft = true;
    }
    
    else if (keyCode == 39)
    {
        isRight = true;
  
    }
    
     if(keyCode == 32)
     {
         if (!isFalling)
        {
        gameChar_y -=100;
        jumpSound.play();
        }    
    }


}

function keyReleased()
{
    if(keyCode == 37)
    {
        isLeft = false;
    }
    
    else if (keyCode == 39)
    {
        isRight = false;
    }
}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	//the game character
	if(isLeft && isFalling)
	{
		// jumping-left code
        
        fill(228, 165, 155);
        ellipse(gameChar_x, gameChar_y - 50, 25, 25);
    
        fill(0, 0, 230);
        rect(gameChar_x - 10, gameChar_y - 40, 20, 25);
    
        fill(0, 0, 0);
        rect(gameChar_x -15, gameChar_y -16, 25, 10);
    
        fill(228, 165, 155);
        rect(gameChar_x -25, gameChar_y -35, 25, 10);
        rect(gameChar_x + 10, gameChar_y -35, 15, 10);

	}
	else if(isRight && isFalling)
	{
		// jumping-right code
        
        fill(228, 165, 155);
        ellipse(gameChar_x, gameChar_y - 50, 25, 25);
    
        fill(0, 0, 230);
        rect(gameChar_x - 10, gameChar_y - 40, 20, 25);
    
        fill(0, 0, 0);
        rect(gameChar_x -10, gameChar_y -16, 25, 10);
    
        fill(228, 165, 155);
        rect(gameChar_x -25, gameChar_y -35, 15, 10);
        rect(gameChar_x, gameChar_y -35, 25, 10); 

	}
	else if(isLeft)
	{
		// walking left code
        
        fill(228, 165, 155);
        ellipse(gameChar_x, gameChar_y - 50, 25, 25);
    
        fill(0, 0, 230);
        rect(gameChar_x - 10, gameChar_y - 40, 20, 35);
    
        fill(0, 0, 0);
        rect(gameChar_x -15, gameChar_y -6, 25, 10);
    
        fill(228, 165, 155);
        rect(gameChar_x -20, gameChar_y -35, 20, 10);

	}
	else if(isRight)
	{
		// walking right code
        
        fill(228, 165, 155);
        ellipse(gameChar_x, gameChar_y - 50, 25, 25);
    
        fill(0, 0, 230);
        rect(gameChar_x - 10, gameChar_y - 40, 20, 35);
    
        fill(0, 0, 0);
        rect(gameChar_x -10, gameChar_y -6, 25, 10);
    
        fill(228, 165, 155);
        rect(gameChar_x, gameChar_y -35, 20, 10);

	}
	else if(isFalling || isPlummeting)
	{
		// jumping facing forwards code
        
        fill(228, 165, 155);
        ellipse(gameChar_x, gameChar_y - 50, 25, 25);
    
        fill(0, 0, 230);
        rect(gameChar_x - 10, gameChar_y - 40, 20, 25);
    
        fill(0, 0, 0);
        rect(gameChar_x -15, gameChar_y -16, 10, 10);
        rect(gameChar_x + 5, gameChar_y -16, 10, 10);
    
        fill(228, 165, 155);
        rect(gameChar_x -25, gameChar_y -35, 15, 10);
        rect(gameChar_x + 10, gameChar_y -35, 15, 10);


	}
	else
	{
		// standing front facing code      
        
        fill(228, 165, 155);
        ellipse(gameChar_x, gameChar_y - 50, 25, 25);
    
        fill(0, 0, 230);
        rect(gameChar_x - 10, gameChar_y - 40, 20, 35);
    
        fill(0, 0, 0);
        rect(gameChar_x -15, gameChar_y -6, 10, 10);
        rect(gameChar_x + 5, gameChar_y -6, 10, 10);
    
        
        fill(228, 165, 155);
        rect(gameChar_x -20, gameChar_y -35, 10, 15);
        rect(gameChar_x + 10, gameChar_y -35, 10, 15);

	}


}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.

function drawClouds()
{
    for (var i = 0; i < clouds.length; i++)    
    {
        fill(255);
        ellipse(clouds[i].x_pos, clouds[i].y_pos, clouds[i].size, clouds[i].size);
        ellipse(clouds[i].x_pos -30, clouds[i].y_pos, clouds[i].size -5, clouds[i].size -5);
        ellipse(clouds[i].x_pos + 30, clouds[i].y_pos, clouds[i].size - 5, clouds[i].size -5);
    }    
    
}

// Function to draw mountains objects.

function drawMountains()
{
    for (var i = 0; i < mountains.length; i++)
    {
        fill(150, 150, 150);
        
        triangle(mountains[i].x_pos -150, mountains[i].y_pos + 432, 
                mountains[i].x_pos, mountains[i].y_pos +220, 
                 mountains[i].x_pos+150, mountains[i].y_pos +432);

        triangle(mountains[i].x_pos +15, mountains[i].y_pos + 432, 
                 mountains[i].x_pos+ 200, mountains[i].y_pos +100, 
                 mountains[i].x_pos+ 450, mountains[i].y_pos +432);

        stroke(120,120,120);
        strokeWeight(5);

        line(mountains[i].x_pos + 450,mountains[i].y_pos + 432, 
             mountains[i].x_pos + 200, mountains[i].y_pos + 105);
        
        line(mountains[i].x_pos + 150,mountains[i].y_pos + 432, 
             mountains[i].x_pos, mountains[i].y_pos + 220);

        strokeWeight();

    }    
}

// Function to draw trees objects.

function drawTrees()
{
    for (var i = 0; i < trees_x.length; i++)
    {
    //draw a tree
        fill(98, 65, 12);
        rect(trees_x[i] -15, -100 + floorPos_y, 30, 100);
    
    //tree branches
    
        fill(0, 110, 0);
        triangle(trees_x[i] -50, 
             floorPos_y  -60, 
             trees_x[i] , 
             floorPos_y - 150, 
             trees_x[i] +45, 
             floorPos_y  -60);
        
        triangle(trees_x[i] -50, 
             floorPos_y  -30, 
             trees_x[i] , 
             floorPos_y - 150, 
             trees_x[i] +45, 
             floorPos_y  -30);
    }
    
}


// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
    fill(180, 100, 50);
    rect(t_canyon.x_pos, 432, t_canyon.width, 144);
    fill(98, 64, 12);
    beginShape();
        vertex(t_canyon.x_pos , 432);
        vertex(t_canyon.x_pos +30, 460);
        vertex(t_canyon.x_pos + 15, 500);
        vertex(t_canyon.x_pos + 30, 576);
        vertex(t_canyon.x_pos + 80, 576);
        vertex(t_canyon.x_pos + 60, 500);
        vertex(t_canyon.x_pos + 70, 450);
        vertex(t_canyon.x_pos + 50, 432);
    endShape(); 
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
    if(gameChar_world_x > t_canyon.x_pos && gameChar_world_x < t_canyon.x_pos+100 && gameChar_y >=floorPos_y)
    {
       isPlummeting =true;    
    }

}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
    stroke(220,220,0);
    strokeWeight(t_collectable.size);
    point(t_collectable.x_pos, t_collectable.y_pos);
    noStroke();
    fill(0);
    text("$",t_collectable.x_pos -4, t_collectable.y_pos +5);
    textSize (t_collectable.size-35);        

}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
    if(dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) < t_collectable.size)
    {
        t_collectable.isFound = true;
        game_score +=1;
        collectSound.play();
    }

}

function renderFlagpole()
{
    push();
    strokeWeight(5);
    stroke(100);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 250);
    fill (255,0,255);
    noStroke();
    
    if(flagpole.isReached)
    {
        rect(flagpole.x_pos, floorPos_y - 250, 50, 50);
       
    }
    else
    {
        rect(flagpole.x_pos, floorPos_y - 50, 50, 50);             
    }
    
    for (var i = 0; i < enemies.length; i++)
    {
        enemies[i].draw();
        
        var isContact = enemies[i].checkContact(gameChar_world_x, gameChar_y);
        
        if(isContact)
        {
            lives -=1;
            killedSound.play();
            
            if(lives > 0)
            {
                startGame();
                break;
            }
        }
    }

    pop();
}

function checkFlagpole()
{
    var d = abs(gameChar_world_x- flagpole.x_pos);
    
    if (d < 15)
    {
        flagpole.isReached = true;
    }
}

function checkPlayerDie()
{
    if(gameChar_y >height)
    {
        lives -=1;
        console.log("lives left " + lives);
        
        if(lives >0)
        {
            startGame();
        }
    }
}

function startGame()
{
    gameChar_x = width/2;
	gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects.
    
    trees_x = [100, 300, 400, 500, 750, 1100, 1300, 1500, 1600,1700, 1800, 2200,2400];
    
    clouds = [  
            {x_pos: 0, y_pos: 200, size: 50},
            {x_pos: 200, y_pos: 100, size: 50}, 
            {x_pos: 400, y_pos: 50, size: 50},
            {x_pos: 800, y_pos: 150, size: 50},
            {x_pos: 1500, y_pos: 80, size: 50},
            {x_pos: 1800, y_pos: 150, size: 50},
            {x_pos: 2500, y_pos: 50, size: 50},
            {x_pos: 3400, y_pos: 100, size: 50}
            ];
    
    mountains = [ 
            {x_pos: 100, y_pos: 0},
            {x_pos: 450, y_pos: 0},
            {x_pos: 800, y_pos: 0},
            {x_pos: 2000, y_pos: 0},
            {x_pos: 3000, y_pos: 0},
            {x_pos: 4400, y_pos: 0}
            ];     
    collectables = [
            {x_pos: 0, y_pos: 420, size: 30,isFound: false},
            {x_pos: 300, y_pos: 420, size: 30,isFound: false},
            {x_pos: 750, y_pos: 420, size: 30,isFound: false},                
            {x_pos: 1650, y_pos: 420, size: 30,isFound: false},
            {x_pos: 1950, y_pos: 420, size: 30,isFound: false},
            {x_pos: 1970, y_pos: 110, size: 30,isFound: false},
            {x_pos: 2010, y_pos: 110, size: 30,isFound: false},
            {x_pos: 2040, y_pos: 110, size: 30,isFound: false},                
            {x_pos: 2080, y_pos: 110, size: 30,isFound: false},
            {x_pos: 3000, y_pos: 350, size: 30,isFound: false},
            {x_pos: 3200, y_pos: 350, size: 30,isFound: false},                
            {x_pos: 3400, y_pos: 350, size: 30,isFound: false},
            {x_pos: 2550, y_pos: 140, size: 30,isFound: false},
            {x_pos: 2550, y_pos: 110, size: 30,isFound: false},                
            {x_pos: 2550, y_pos: 80, size: 30,isFound: false},
            {x_pos: 0, y_pos: 150, size: 30,isFound: false},
            {x_pos: 0, y_pos: 110, size: 30,isFound: false},
            {x_pos: 0, y_pos: 200, size: 30,isFound: false},
            {x_pos: 0, y_pos: 110, size: 30,isFound: false}


            ];  
    canyons = [
            {x_pos: 100, width: 100},
            {x_pos: 550, width: 100},
            {x_pos: 875, width: 100},
            {x_pos: 2200, width: 100},
            {x_pos: 3200, width: 100},
            {x_pos: 4450, width: 100}
            ];
    
    platforms = [];
    
    platforms.push(createPlatforms(250,floorPos_y -100,100));
    platforms.push(createPlatforms(100,floorPos_y -150,100));
    platforms.push(createPlatforms(0,floorPos_y -200,100));
    
    platforms.push(createPlatforms(900,floorPos_y -80,100));
    platforms.push(createPlatforms(1100,floorPos_y -130,100));
    platforms.push(createPlatforms(1300,floorPos_y -160,100));
    platforms.push(createPlatforms(1500,floorPos_y -190,100));
    platforms.push(createPlatforms(1700,floorPos_y -210,100));
    platforms.push(createPlatforms(1900,floorPos_y -220,100));
    platforms.push(createPlatforms(2200,floorPos_y -220,100));
    
    platforms.push(createPlatforms(2500,floorPos_y -160,100));
    platforms.push(createPlatforms(2500,floorPos_y -220,100));
    platforms.push(createPlatforms(2500,floorPos_y -80,100));
    
    enemies = [];
    
    enemies.push(new Enemy(250, floorPos_y-10, 100));
    enemies.push(new Enemy(600, floorPos_y-10, 100));
    enemies.push(new Enemy(1000, floorPos_y-10, 100));
    enemies.push(new Enemy(1400, floorPos_y-10, 100));
    
    enemies.push(new Enemy(1700, floorPos_y-10, 100));
    enemies.push(new Enemy(1900, floorPos_y-10, 100));
    enemies.push(new Enemy(2100, floorPos_y-10, 100));
    enemies.push(new Enemy(2400, floorPos_y-10, 100));
    
    
    enemies.push(new Enemy(3000, floorPos_y-10, 100));
    enemies.push(new Enemy(3400, floorPos_y-10, 100));
    enemies.push(new Enemy(3900, floorPos_y-10, 100));
    enemies.push(new Enemy(4000, floorPos_y-10, 100));
    
    game_score = 0;
    flagpole = { isReached: false, x_pos: 3500};
}

function createPlatforms(x, y, length)
{
    var p = 
    {
        x:x,
        y:y,
        length: length,
        draw: function ()
        {
            fill (255);
            rect(this.x, this.y, this.length, 20);
        },
        checkContact: function(gc_x, gc_y)
        {
            if(gc_x > this.x && gc_x < this.x + this.length)
            
            {
                var d = this.y - gc_y;
                if(d >=0 && d <5)
                {
                   return true; 
                }
            }
            return false;
        }
    }
        return p;
    
}

// function for the enemies

function Enemy(x, y, range)
{
    this.x = x;
    this.y = y;
    this.range = range;
    
    this.currentX = x;
    this.inc = 1;
    
    this.update = function ()
    {
        this.currentX += this.inc;
        
        if(this.currentX >= this.x + this.range)
        {
            this.inc = -1;
        }
        else if(this.currentX < this.x)
        {
            this.inc = 1;
        }
    }
    
    this.draw = function ()
    {
        this.update();
        fill(random(0,80));
        ellipse(this.currentX, this.y-15, 30,30);
        rect(this.currentX-15, this.y-20,30,30);
        fill(255);
        ellipse(this.currentX - 6, this.y-10, 10,10);
        ellipse(this.currentX + 6, this.y-10, 10,10);
        fill(255,0,0);
        ellipse(this.currentX - 5, this.y-10, 4,4);
        ellipse(this.currentX + 5, this.y-10, 4,4);
    }
    
    this.checkContact = function(gc_x, gc_y)
    {
        var d = dist(gc_x, gc_y, this.currentX, this.y)
        
        if (d < 20)
        {
            return true;
        }
        return false;
    }

}

