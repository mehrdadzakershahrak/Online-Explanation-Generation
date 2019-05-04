                // Author: Mehrdad Zakershahrak
       var maps = [
        {	gameMap: [
		0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
        0,  24,   1,  23,   1,   0,   1,   0,  22,   1,   3,  24,   1,   1,   1,   0,
        0,   1,   1,   1,   1,   0,   1,   1,   1,  21,   3,   1,   1,   1,  23,   0,
        0,   1,   1,   1,   1,   0,   1,   0,   0,   0,   0,   1,   1,   1,   2,   0,
        0,  22,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   0,
        0,   0,   3,   3,   0,   0,   1,   1,   1,   1,   0,   0,   1,   0,   0,   0,
		0,   1,   1,   1,   0,   1,   1,   1,   1,   1,   0,   1,   1,  22,  21,   0,
		0,   1,  24,   1,   0,   1,   1,   1,   1,   1,   0,   0,   3,  3,   0,   0,
		0,   1,   1,   1,   1,   1,   1,   1,   1,   1,   0,   1,   1,  22,   1,   0,
		0,   2,   1,   1,   1,   1,   1,  20,   1,   1,   0,   0,   1,   0,   0,   0,
		0,   0,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,  23,   1,   0,
		0,   0,   0,   0,   0,   1,   1,   0,   1,   1,   0,   1,   1,   1,  22,   0,
		0,   1,  23,   1,   1,   1,   1,   0,   1,   1,   0,   1,  24,   1,   1,   0,
		0,   1,   1,   1,   1,   1,   1,   0,   1,   1,   0,   0,   0,   0,   0,   0,
		0,   1,   1,   1,   1,   1,   1,   0,   1,   1,   1,   1,   1,   1,   1,   0,
		0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0
		], start: [565, 565]
	}];
	// Start timer in miliseconds
        var gameStarted = new Date();
        gameStarted = gameStarted.getTime();
        var timePassed = 0;
		
		var timeToChoose = 0;
        var choosingFlag = false;
        var storeTime = [];
		
        //cost of actions robot can do
        var step_cost = 1.4;
        var box_break_cost = 6;

        var ctx = null;
        var tileW = 40, tileH = 40;
        var mapW = 16, mapH = 16;
        var currentSecond = 0, frameCount = 0, framesLastSecond = 0;
        var lastFrameTime = 0;

        var noClicked = 0;
        var yesClicked = 0;
        var numofActions = 0;
        
        var leftChangeView = 0;
        var rightChangeView = 0;
        var upChangeView = 0;
        var downChangeView = 0;

        var leftChangeHidden = 0;
        var rightChangeHidden = 0;
        var upChangeHidden = 0;
        var downChangeHidden = 0;

        var changedToBlink = [];
        var prevLocation = [];
        var allowClick = 0;
		var wait_for_click = false;
		
		var batteryLVL = 100;
		//var rechargedBattLVL  = 0;
		var totalPercentCounter = 0;
		//var hiddenCounter = 0;
		//var visCounter = 0;
		//var stepCounter = 0;
		var numOfTools = 0;
        var Green_path = false;
        var battery_check = false;
        var target_check = false;
        var path_remeber = [];
        var target_position = 0;
		var not_tool = false;
        //var remeber_bat=0;
        
        var tileset = null, tilesetURL = "test_tile.png", tilesetLoaded = false;
	    //var toolEncountered = 1;	

        var floorTypes = {
            solid: 0,
            path: 1,
            room: 2,
            box: 3,
            hidden: 4,
            green: 5,
            blink: 6,
            tool1: 7, //1 Tool
            tool2: 8, //2 Tools
            tool3: 9, //3 Tools
			battery100:10, //battery fully charged
			battery75: 11, //battery 75% charged
			battery50: 12, //battery 50% charged
			battery25: 13, //battery 25% charged
            batteryPath: 14,
            hidden1tool: 15,
            hidden2tools: 16,
            hidden3tools: 17,
            hidden100: 18,
            hidden75: 19,
            hidden50: 20,
            hidden25: 21,
			bathtub: 22, 
			couch: 23,
			bed: 24
        };
        var keysDown = {
            37: false,
            38: false,
            39: false,
            40: false
        };

        var tileTypes = {
            0: { num:0, colour: "#685b48", floor: floorTypes.solid, sprite: [{ x: 0, y: 0, w: 40, h: 40 }] },
            1: { num:1, colour: "#5aa457", floor: floorTypes.path, sprite: [{ x: 80, y: 0, w: 40, h: 40 }] },
            2: { num:2, colour: "#e8bd7a", floor: floorTypes.path, sprite: [{ x: 120, y: 0, w: 40, h: 40 }] },
            3: { num:3, colour: "#286625", floor: floorTypes.path, sprite: [{ x: 160, y: 0, w: 40, h: 40 }] },
            4: { num:4, colour: "#685b48", floor: floorTypes.path, sprite: [{ x: 80, y: 0, w: 40, h: 40 }] }, //This completely hides the walls
            //4: { num:4, colour: "#685b48", floor: floorTypes.path, sprite: [{ x: 0, y: 40, w: 40, h: 40 }] }, //This shows hidden walls
            5: { num:5, colour: "#5aa457", floor: floorTypes.path, sprite: [{ x: 40, y: 0, w: 40, h: 40 }] },
            6: { num:6, colour: "#5aa457", floor: floorTypes.path, sprite: [{ x: 40, y: 0, w: 40, h: 40 }] },
            7: { num:7, colour: "#5aa457", floor: floorTypes.path, sprite: [{ x: 40, y: 40, w: 40, h: 40 }] },
            8: { num:8, colour: "#5aa457", floor: floorTypes.path, sprite: [{ x: 80, y: 40, w: 40, h: 40 }] },
            9: { num:9, colour: "#5aa457", floor: floorTypes.path, sprite: [{ x: 120, y: 40, w: 40, h: 40 }] },
            10: { num:10, colour: "#000000", floor: floorTypes.path, sprite: [{ x: 160, y: 40, w: 40, h: 40 }] },
			11: { num:11, colour: "#000000", floor: floorTypes.path, sprite: [{ x: 200, y: 40, w: 40, h: 40 }] },
			12: { num:12, colour: "#000000", floor: floorTypes.path, sprite: [{ x: 0, y: 80, w: 40, h: 40 }] },
			13: { num:13, colour: "#000000", floor: floorTypes.path, sprite: [{ x: 40, y: 80, w: 40, h: 40 }] },
			14: { num:10, colour: "#000000", floor: floorTypes.path, sprite: [{ x: 80, y: 0, w: 40, h: 40 }] },
            15: { num:15, colour: "#000000", floor: floorTypes.path, sprite: [{ x: 80, y: 0, w: 40, h: 40 }] }, //Hidden 1 Tool
            16: { num:16, colour: "#000000", floor: floorTypes.path, sprite: [{ x: 80, y: 0, w: 40, h: 40 }] }, //Hidden 2 Tools
            17: { num:17, colour: "#000000", floor: floorTypes.path, sprite: [{ x: 80, y: 0, w: 40, h: 40 }] }, //Hidden 3 Tools

            18: { num:18, colour: "#000000", floor: floorTypes.path, sprite: [{ x: 80, y: 0, w: 40, h: 40 }] }, //100
            19: { num:19, colour: "#000000", floor: floorTypes.path, sprite: [{ x: 80, y: 0, w: 40, h: 40 }] }, //75
            20: { num:20, colour: "#000000", floor: floorTypes.path, sprite: [{ x: 80, y: 0, w: 40, h: 40 }] }, //50
            21: { num:21, colour: "#000000", floor: floorTypes.path, sprite: [{ x: 80, y: 0, w: 40, h: 40 }] },  //25
			22: { num:22, colour: "#000000", floor: floorTypes.path, sprite: [{ x: 80, y: 80, w: 40, h: 40 }] },  //bathtub
			23: { num:23, colour: "#000000", floor: floorTypes.path, sprite: [{ x: 120, y: 80, w: 40, h: 40 }] },  //bed
			24: { num:24, colour: "#000000", floor: floorTypes.path, sprite: [{ x: 160, y: 80, w: 40, h: 40 }] }  //couch
        };

        var directions = {
            up: 0,
            right: 1,
            down: 2,
            left: 3
        };

        var rooms = {
            0: {x:1, y:9, num:1},
            1: {x:6, y:13, num:2},
            2: {x:14, y:3, num:3},
            3: {x:14, y:12, num:4}
         };

        function setMap(id) {
            map = maps[id];
            mapId = id;
            player.position = [...map.start];
            player.tileFrom = map.start.map(px => Math.floor(px / 40.0));
            player.tileTo = map.start.map(px => Math.floor(px / 40.0));
            map.gameMap.map((tile, i) => [tile, { x: i % 16, y: Math.floor(i / 16) }]).filter(tile => tile[0] == 2).forEach((tile, i) => rooms[tile[1].x + tile[1].y * 6 - 6] = i + 1);
            return map.gameMap;
        }

        var player = new Character();

        var mapId;
        var gameMap = setMap(Math.floor(Math.random() * maps.length));
        path_remeber = gameMap.slice();

        function Character() {
            this.tileFrom = [1, 1];
            this.tileTo = [1, 1];
            this.timeMoved = 0;
            this.dimensions = [30, 30];
            this.position = [45, 45];
            this.delayMove = 150;
            this.direction = directions.up;

            this.sprites = {};
            this.sprites[directions.up] = [{ x: 0, y: 120, w: 30, h: 30 }];
            this.sprites[directions.right] = [{ x: 0, y: 150, w: 30, h: 30 }];
            this.sprites[directions.down] = [{ x: 0, y: 180, w: 30, h: 30 }];
            this.sprites[directions.left] = [{ x: 0, y: 210, w: 30, h: 30 }];

            this.target = null;
            this.moving = false;
            this.plan = [];
            this.lastMove = null;
            this.lastClick = null;
            this.stack = [];
			this.hasTool=false;
			this.hasBattery=true;
            this.imaginary=[45, 45];
            this.prevTool=false;
            this.prev_num_of_tools=0;
            //this.prev_percent = 0;
            this.imaginary_from = [1, 1];
            this.imaginary_to = [1, 1]; 
			//this.hasBatt75=false;
			//this.hasBatt50=false;
			//this.hasBatt25=false;
        }
        Character.prototype.placeAt = function (x, y) {
            this.tileFrom = [x, y];
            this.tileTo = [x, y];
            if(Green_path)    
            {
                pos = this.imaginary;
                if(tileTypes[gameMap[toIndex(x, y)]].num==18 || tileTypes[gameMap[toIndex(x, y)]].num==19 || tileTypes[gameMap[toIndex(x, y)]].num==20 || tileTypes[gameMap[toIndex(x, y)]].num==21){
                    //this is for any code about what the green path finds at the end
                    gameMap[toIndex(x, y)] = tileTypes[gameMap[toIndex(x, y)]].num - 8; //reveal hidden batteries
                    not_tool = true;
					console.log("Revealed hidden batteries");
                }else if(tileTypes[gameMap[toIndex(x, y)]].num == 17 || tileTypes[gameMap[toIndex(x, y)]].num == 16 ||  tileTypes[gameMap[toIndex(x, y)]].num == 15){
                    gameMap[toIndex(x, y)] = tileTypes[gameMap[toIndex(x, y)]].num - 8;
                }else{
                    if(tileTypes[gameMap[toIndex(x, y)]].num != 2){
                    gameMap[x + y * 16] = 5;
					}
					else
                	{
                		not_tool = true;
                	}
				}
            }
            else
            {
                pos = this.position;
            }
            pos = [((tileW * x) + ((tileW - this.dimensions[0]) / 2)),
            ((tileH * y) + ((tileH - this.dimensions[1]) / 2))];
        };

        Character.prototype.processMovement = function (t) {
                if(Green_path){
                    pos=this.imaginary;
                }else{
                    pos = this.position;
                }

            if (this.tileFrom[0] == this.tileTo[0] &&
                this.tileFrom[1] == this.tileTo[1]) { return false; }


            if ((t - this.timeMoved) >= this.delayMove) {
                this.placeAt(this.tileTo[0], this.tileTo[1]);
            }

            else {
                pos[0] = (this.tileFrom[0] * tileW) + ((tileW - this.dimensions[0]) / 2);
                pos[1] = (this.tileFrom[1] * tileH) + ((tileH - this.dimensions[1]) / 2);

                if (this.tileTo[0] != this.tileFrom[0]) {
                    var diff = (tileW / this.delayMove) * (t - this.timeMoved);
                    pos[0] += (this.tileTo[0] < this.tileFrom[0] ? 0 - diff : diff);
                }

                if (this.tileTo[1] != this.tileFrom[1]) {
                    var diff = (tileH / this.delayMove) * (t - this.timeMoved);
                    pos[1] += (this.tileTo[1] < this.tileFrom[1] ? 0 - diff : diff);
                }

                pos[0] = Math.round(pos[0]);
                pos[1] = Math.round(pos[1]);
            }
			//stepCounter++;

            return true;
        };

        Character.prototype.canMoveTo = function (x, y) {
            if (x < 0 || x >= mapW || y < 0 || y >= mapH) { return false; }
            if (tileTypes[gameMap[toIndex(x, y)]].floor != floorTypes.path) { return false; }
            return true;
        }
        Character.prototype.moveEligible = function (x, y) {
            if(getTileType(x, y) == 2 ||getTileType(x, y) == 18 ||getTileType(x, y) == 19||getTileType(x, y) == 20 || getTileType(x, y) == 21){
                return true;
            }
            return false;
        };

        Character.prototype.resetTarget = function () {
            this.target = null;
            this.lastMove = null;
            this.imaginary= this.position.slice();
            this.delayMove = 150;
        }

        Character.prototype.canMoveUp = function () { return this.canMoveTo(this.tileFrom[0], this.tileFrom[1] - 1); };
        Character.prototype.canMoveDown = function () { return this.canMoveTo(this.tileFrom[0], this.tileFrom[1] + 1); };
        Character.prototype.canMoveLeft = function () { return this.canMoveTo(this.tileFrom[0] - 1, this.tileFrom[1]); };
        Character.prototype.canMoveRight = function () { return this.canMoveTo(this.tileFrom[0] + 1, this.tileFrom[1]); };

        Character.prototype.moveLeft = function (t) { this.tileTo[0] -= 1; this.timeMoved = t; this.direction = directions.left; this.lastMove = 'left'; };
        Character.prototype.moveRight = function (t) { this.tileTo[0] += 1; this.timeMoved = t; this.direction = directions.right; this.lastMove = 'right'; };
        Character.prototype.moveUp = function (t) { this.tileTo[1] -= 1; this.timeMoved = t; this.direction = directions.up; this.lastMove = 'up'; };
        Character.prototype.moveDown = function (t) { this.tileTo[1] += 1; this.timeMoved = t; this.direction = directions.down; this.lastMove = 'down'; };
		Character.prototype.pickUpTool = function (t) {this.hasTool=true; this.lastMove='pickUp';};
		Character.prototype.pickUpBattery = function (t) {this.hasBattery=true; this.lastMove='pickUpBatt';};
        Character.prototype.execMove = function (x, y, direction) {
            switch (direction) {
                case "up":
                    return this.moveUp(Date.now());
                case "down":
                    return this.moveDown(Date.now());
                case "right":
                    return this.moveRight(Date.now());
                case "left":
                    return this.moveLeft(Date.now());
                case "pickUp":
                    if(!Green_path)
                    {
                        displayMessage("picked up the tool from the toolbox");
                    }
                    else{
                        displayMessage("I need a tool")
                    }				
                    return this.pickUpTool(Date.now());
				case "pickUpBatt":
					//displayMessage("I picked up a battery pack!");
					return this.pickUpBattery(Date.now());

            }
        };

        Character.prototype.moveToLocation = function () {
            if(Green_path){
               pos = this.imaginary;
            }else{
                pos = this.position;
            }

            //console.log("In moveToLocation");
            if(!wait_for_click){ 
				if (!!this.target && this.moveEligible(this.target.x, this.target.y)) {
					var playerX = Math.floor(pos[0] / 40.0);
					var playerY = Math.floor(pos[1] / 40.0);
					if (getTileType(playerX, playerY) == 2 && playerX == this.target.x && playerY == this.target.y) {
						target_check = false;
						
						gameMap[playerX + playerY * 16] = 1;
						//displayMessage("I have saved him!");
						
						if(!wait_for_click){
                        	path_remeber= gameMap.slice();

                    	}
					
						this.plan.push({ Action: `Room-visited`, explain: true });
						if (isAllVisited(gameMap)) {

							let newd = new Date();
							newd = newd.getTime();
							let timePassed = (newd-gameStarted)/1000;

							console.log("THE first happened");
							numofActions = yesClicked + noClicked;
							console.log(storeTime);
							

							console.log("time taken to complete game: ", timePassed);

							//$.post("/game", { path: this.convertPlan(), mapId: mapId }, data => {
                            /*$.post("/game", { gameTime: timePassed, mapId: mapId, numYes: yesClicked, numNo:noClicked, gameActions: numofActions, timeArray: storeTime}, data =>    
                            {
                                sessionStorage.setItem('explainabilityUUID', data);
                                window.location.href = '/questions';
                            });*/
						}
                    
						return this.resetTarget();

					}

					if ((getTileType(playerX, playerY) == 10 || getTileType(playerX, playerY) == 11 || getTileType(playerX, playerY) == 12 || getTileType(playerX, playerY) == 13
						|| getTileType(playerX, playerY) == 18 || getTileType(playerX, playerY) == 19 || getTileType(playerX, playerY) == 20 || getTileType(playerX, playerY) == 21) && battery_check && !Green_path )
					{
						//stepCounter++;
						totalPercentCounter = totalPercentCounter - 3; //Picking up a battery doesn't drain battery

						if (getTileType(playerX, playerY) == 10 || getTileType(playerX, playerY) == 18) 
						{

							totalPercentCounter = 0;
							console.log("Picked up 100% battery");
							batteryLVL = 100;
						}
						else if (getTileType(playerX, playerY) == 11 || getTileType(playerX, playerY) == 19) {
							totalPercentCounter = totalPercentCounter - 75;
							console.log("Picked up 75% battery");
							batteryLVL = batteryLVL + 75;
						}
						else if (getTileType(playerX, playerY) == 12 || getTileType(playerX, playerY) == 20) {
							totalPercentCounter = totalPercentCounter - 50;
							console.log("Picked up 50% battery");                        
							batteryLVL = batteryLVL + 50;
						}
						else if (getTileType(playerX, playerY) == 13 || getTileType(playerX, playerY) == 21) {
							totalPercentCounter = totalPercentCounter - 25;
							console.log("Picked up 25% battery");
							batteryLVL = batteryLVL + 25;
						}
						if (totalPercentCounter < 0) {totalPercentCounter = 0;}
						calcBattLVL();
						displayMessage("Charged");
						battery_check = false;
						gameMap[playerX + playerY * 16] = 1;
						player.path = [];
						console.log("totalPercentCounter = ", totalPercentCounter);
						path_remeber = gameMap.slice();

					
						this.plan.push({ Action: `Room-visited`, explain: true });
						if (isAllVisited(gameMap)) 
						{
                
							let newd = new Date();
							newd = newd.getTime();
							timePassed = (newd-gameStarted)/1000;

							console.log("The second one passed");
							numofActions = yesClicked + noClicked;
                        
							console.log("time taken to complete game: ", timePassed);
							//$.post("/game", { path: this.convertPlan(), mapId: mapId }, data => 
							$.post("/game", { gameTime: timePassed, mapId: mapId, numYes: yesClicked, numNo:noClicked, gameActions: numofActions}, data =>
							{
								sessionStorage.setItem('explainabilityUUID', data);
								window.location.href = '/questions';
							});
						}
						if(!wait_for_click){
                           return this.resetTarget();
                        }
					}

					/* if ((getTileType(playerX, playerY) == 10 || getTileType(playerX, playerY) == 11 ||getTileType(playerX, playerY) == 12 || getTileType(playerX, playerY) == 13)  && battery_check ) {
                    
						gameMap[playerX + playerY * 16] = 1;
						//player.path=[];
                   
                    
						this.plan.push({ Action: `Room-visited`, explain: true });
						if (isAllVisited(gameMap)) {
							$.post("/game", { path: this.convertPlan(), mapId: mapId }, data => {
								sessionStorage.setItem('explainabilityUUID', data);
								window.location.href = '/questions';
							});
						}
                   
						return this.resetTarget();
					}*/

					if(getTileType(playerX, playerY) == 3) 
					{
                    
						displayMessage("There is an obstacle blocking my route");
						gameMap[playerX + playerY * 16] = 1;
						if(!Green_path){
							totalPercentCounter= totalPercentCounter+box_break_cost;
						}
						numOfTools --;
						if (numOfTools == 0) 
						{
							this.hasTool = false;
							displayMessage("Hey human, I am out of tools!");
						}
					}
					if(getTileType(playerX, playerY) == 4 || getTileType(playerX, playerY) == 6){
						displayMessage("I broke a hidden wall!");
						gameMap[playerX + playerY * 16] = 1;
						if(!Green_path){
							totalPercentCounter= totalPercentCounter+box_break_cost;
						}
						numOfTools --;
						if (numOfTools == 0) {
							this.hasTool = false;
							displayMessage("Hey human, I am out of tools!");
						}
					}
					const move = this.stack.pop();

					//console.log("Move before if(move) = ", move);
					if (move) {

						//console.log("Move = ", move);
						//console.log("Number of Tools = ", numOfTools);

						if(move=="pickUp"){
							if (tileTypes[gameMap[playerX + playerY * 16]].num == 17 || tileTypes[gameMap[playerX + playerY * 16]].num == 16 ||  tileTypes[gameMap[playerX + playerY * 16]].num == 15)
							{
								if (tileTypes[gameMap[playerX + playerY * 16]].num == 15) {
									numOfTools ++;
								}
								else if (tileTypes[gameMap[playerX + playerY * 16]].num == 16) {
									numOfTools = numOfTools + 2;
								}
								else if (tileTypes[gameMap[playerX + playerY * 16]].num == 17) {
									numOfTools = numOfTools + 3;
								}
								console.log("Number of Tools = ", numOfTools);
							}
							wait_for_click = true;
                            player.confirmLastMove();
							totalPercentCounter = totalPercentCounter - 3; //Picking up a tool doesn't drain battery
							gameMap[playerX + playerY * 16] = 1;
							this.plan.push({Action: 'pickUp'});
						}
                    
						if(!Green_path){
							totalPercentCounter = totalPercentCounter + step_cost;
						}
						this.execMove(playerX, playerY, move);
                    
					}			
					calcBattLVL();
				} else {
					this.resetTarget();
				}
				if(!Green_path && !wait_for_click){
					path_remeber=gameMap.slice();
				}
			}
        };
		
	
              
        Character.prototype.confirmLastMove = function () {
            if (this.lastMove) {
				document.getElementById('true').style.visibility = 'visible'; //Reveal the buttons
				document.getElementById('false').style.visibility = 'visible';
                $('.confirmationButton').attr('disabled',null );
               
            }
        }

        Character.prototype.getPlanSize = function () {
            return this.plan.length;
        }

        function toIndex(x, y) {
            return ((y * mapW) + x);
        }

        function getTileType(x, y) {
            return gameMap[x + y * 16];
        }

        function confirmAction(action) {
            return confirm(`2. Do you think the robot is doing the RIGHT thing?`);
        }

        function isAllVisited() {
            return !gameMap.filter(tile => tile == 2).length;
        }

        function BFS(target, v) {
            const s = [];
            const seen = new Set();
	        var t=player.hasTool;
            s.push({ index: v, move: null, parent: null, tool:t, numTool:numOfTools });
            if(target == v){
            	return s.pop();
            }
			while (s.length) {
                v = s.pop();
                if(!hasSeen(v,seen)){
                    seen.add([v.index,v.tool, v.numTool]);
                    if (v.index == target) {
                        target_check = true;
                        battery_check = false;
                        return v;
                }
            adjacentEdges(v.index,v.tool, v.parent, v.numTool).forEach(e => hasSeen(e,seen) ? null : s.unshift({ index: e.index, move: e.move, parent: v, tool:e.tool, numTool:e.numTool}));
                }
            }
        }
        function TileBFS(target1, target2, target3, target4, v)
        {
            const s = [];
            const seen = new Set();
            var t=player.hasTool;
            s.push({ index: v, move: null, parent: null, tool:t, numTool:numOfTools });
            while (s.length) 
            {
                v = s.pop();
                if(!hasSeen(v,seen)){
                    seen.add([v.index,v.tool, v.numTool]);
                    if (tileTypes[gameMap[v.index]].num == target1 || tileTypes[gameMap[v.index]].num == target2 || tileTypes[gameMap[v.index]].num == target3 || tileTypes[gameMap[v.index]].num == target4) 
                    {
                        battery_check = true;
                        target_check = false;
                    //totalPercentCounter = remeber_bat;
                        player.target={x:v.index%16, y:Math.floor(v.index/16)}
                        return v;
                    }
                    adjacentEdges(v.index,v.tool, v.parent, v.numTool).forEach(e => hasSeen(e,seen) ? null : s.unshift({ index: e.index, move: e.move, parent: v, tool:e.tool, numTool:e.numTool}));
                }
            }
        }

        function hasSeen(element, seen){
                var iteration= seen.values();
                var array=iteration.next().value;
                while(array!=null){
                        if(array[0]==element.index && array[1]==element.tool && array[2]==element.numTool){
                                return true;
                        }
                        array=iteration.next().value;
                }
                return false;
        }

        function reducedIf(loc,t)
        {
            if (((tileTypes[gameMap[loc]].floor == floorTypes.path && tileTypes[gameMap[loc]].num != 3) && (tileTypes[gameMap[loc]].floor == floorTypes.path && tileTypes[gameMap[loc]].num != 4) 
                 && (tileTypes[gameMap[loc]].floor == floorTypes.path && tileTypes[gameMap[loc]].num != 6)) ||
               (tileTypes[gameMap[loc]].num == 3 && t) || (tileTypes[gameMap[loc]].num == 4 && t) || (tileTypes[gameMap[loc]].num == 6 && t))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

         function adjacentEdges(v, t, parent, nt) {
            const tiles = [];
            if((tileTypes[gameMap[v]].num == 3) || (tileTypes[gameMap[v]].num == 4) || (tileTypes[gameMap[v]].num == 6)){
                --nt;
                //console.log("num of tools", nt);
            }
            if(nt<=0){

                t=false;
                nt=0;
            }


            if (v - 1 >= 0 && reducedIf(v-1,t) )
            {

                tiles.push({ index: v - 1, move: 'left', tool: t, numTool:nt});

            }
            if (v % 16 < (v + 1) % 16 && reducedIf(v+1,t) )
            {
                tiles.push({ index: v + 1, move: 'right', tool: t, numTool:nt});
            }
            if (v - 16 >= 0 && reducedIf(v-16,t) )
            {
                tiles.push({ index: v - 16, move: 'up', tool: t, numTool:nt});
            }
            if (v + 16 < 257 && reducedIf(v+16,t) )
            {
                tiles.push({ index: v + 16, move: 'down', tool: t, numTool:nt});
            }

            if (tileTypes[gameMap[v]].num == 15 || tileTypes[gameMap[v]].num == 16 ||  tileTypes[gameMap[v]].num == 17 || tileTypes[gameMap[v]].num == 8 || tileTypes[gameMap[v]].num == 9 ||  tileTypes[gameMap[v]].num == 10)
            {
                if(t == false)
                {
                    nt = tileTypes[gameMap[v]].num - 14;
                    tiles.push({ index: v, move: "pickUp", tool: true, numTool:nt});
                }

            }
			/*
			if (tileTypes[gameMap[v]].num == 10 || tileTypes[gameMap[v]].num == 11 ||  tileTypes[gameMap[v]].num == 12 ||  tileTypes[gameMap[v]].num == 13)
            {
                    //console.log("HELLO");
                    tiles.push({ index: v, move: "pickUpBatt", tool: t, numTool:nt});
            }
            */

            
            return tiles;
        }

        window.onload = function () {
            ctx = document.getElementById('game').getContext("2d");
            requestAnimationFrame(drawGame);
            ctx.font = "bold 10pt sans-serif";
            
                pos = player.position;
            

            prevLocation = Math.floor(pos[0] / 40.0) + 16*Math.floor(pos[1] / 40.0);

			document.getElementById('true').style.visibility = 'hidden'; //Hide buttons on startup
            document.getElementById('false').style.visibility = 'hidden';
			
            $('#game').click(function (e) 
            {
                var offset = $('#game').offset();
                let clicked = {
                    x: Math.floor((e.clientX - offset.left) / 40.0),
                    y: Math.floor((e.clientY - offset.top) / 40.0)
                };
                const path = [];
                if (gameMap[clicked.x + clicked.y * 16] != 2) return;
                
                if (player.target) 
                {
                    player.lastClick = { x: clicked.x, y: clicked.y };
                } 
                else
                {    
                    player.plan.push({ Action: `Human-Clicked (${clicked.x},${clicked.y})`, explain: true });
                }

                var print = -1;
                //var i = 0;)
                for(i=0;i<4;++i){
                        if(rooms[i].x==clicked.x && rooms[i].y==clicked.y){
                                print = rooms[i].num 
                        }
                }
                
				//displayMessage("Providing Medical Attention to "+print);
                if(!target_check){
                    Green_path=true;
                    
                    player.delayMove=1;
                    player.imaginary=player.position.slice();
                    player.imaginary_from = player.tileFrom.slice();
                    player.imaginary_to = player.tileTo.slice();

                    player.target = Object.assign({}, clicked);
                    target_position=player.target.x + player.target.y*16;
                    let search = BFS(target_position, Math.floor(player.position[0] / 40.0) + Math.floor(player.position[1] / 40.0) * 16);
                    while (!!search && search.parent != null) 
                    {
                        path.push(search.move);
                        search = search.parent;
                    }
                    player.stack = path;
                
                }
                /*
                if (batteryLVL<=25 && !battery_check)
                {
					displayMessage("I'm low on battery");
                    displayMessage(" need to charge");
                    Green_path=true;
                    
                    player.delayMove=1;
                    player.imaginary=player.position.slice();
                    player.imaginary_from = player.tileFrom.slice();
                    player.imaginary_to = player.tileTo.slice();
                    const path =[]
                    //remeber_bat= totalPercentCounter;
                    let search = TileBFS(18,19,20,21,Math.floor(player.position[0] / 40.0) + Math.floor(player.position[1] / 40.0) * 16);
                    while (!!search && search.parent != null) 
                    {
                        path.push(search.move);
                        search = search.parent;
                    }
                    player.stack = path;
                }
                */

            });

            tileset = new Image();

            tileset.onerror = function () {
                ctx = null;
                alert("Failed loading tileset.");
            };

            tileset.onload = function () { tilesetLoaded = true; };

            tileset.src = tilesetURL;

        };
    
        function drawGame() 
        {
            if (ctx == null) { return; }
            if (!tilesetLoaded) { requestAnimationFrame(drawGame); return; }
                pos = player.position;


            if(prevLocation != (Math.floor(pos[0] / 40.0) + 16*Math.floor(pos[1] / 40.0)))
            {
                for(var i = 0; i < changedToBlink.length; i++)
                {
                    gameMap[changedToBlink[i]] = 4;
                }
                changedToBlink.length = 0;
            }


            var currentFrameTime = Date.now();
            var timeElapsed = currentFrameTime - lastFrameTime;

            var sec = Math.floor(Date.now() / 1000);
            if (sec != currentSecond) {
                currentSecond = sec;
                framesLastSecond = frameCount;
                frameCount = 1;
            }
            else { frameCount++; }
            
            prevLocation = Math.floor(pos[0] / 40.0) + 16*Math.floor(pos[1] / 40.0);
            if (!Green_path && !wait_for_click)
            {
                player.moving = player.processMovement(currentFrameTime);
                if (!player.moving && player.target != null) 
                {
						if (batteryLVL<=25 && !battery_check) 
						{
							document.getElementById('true').style.visibility = 'hidden'; 
                            document.getElementById('false').style.visibility = 'hidden';
                            displayMessage("I'm low on battery");
                            displayMessage("I need to charge");
                            Green_path=true;
                            player.delayMove=1;
                            player.imaginary=player.position.slice();
                            player.imaginary_from = player.tileFrom.slice();
                            player.imaginary_to = player.tileTo.slice();

                            const path =[]
                            let search = TileBFS(18,19,20,21,Math.floor(player.position[0] / 40.0) + Math.floor(player.position[1] / 40.0) * 16);
                            while (!!search && search.parent != null) 
                            {
                                path.push(search.move);
                                search = search.parent;
							} 
							player.stack = path;
                            not_tool = false;


                            
                		}
                    if (player.target) 
                    {
                        player.moveToLocation();
                        not_tool = false;
                    }else if ((player.target.x==Math.floor(pos[0] / 40.0) )&&( player.target.y==Math.floor(pos[1] / 40.0)))
                	{
                		wait_for_click = true;
                		player.confirmLastMove();
                		
                	}
                }
				
            }else if (!wait_for_click){
                player.moving = player.processMovement(currentFrameTime); 
                //console.log(tileTypes[gameMap[current]].num)
                if (!player.moving) 
                {
                    if (player.target)
                    {
                        player.moveToLocation();
                        not_tool = false;
                    }    
                }
				
                else if ((player.target.x==Math.floor(pos[0] / 40.0) )&&( player.target.y==Math.floor(pos[1] / 40.0)))
                {
					wait_for_click = true;
                    player.confirmLastMove();
					
                    Green_path = false; 
                    player.tileFrom = player.imaginary_from.slice();
                    player.tileTo = player.imaginary_to.slice();
					
					timeToChoose = new Date();
                    timeToChoose = timeToChoose.getTime();

                    choosingFlag = true;
                }
            }
            

            ctx.fillStyle = "#000000";

            for (var y = 0; y < mapH; ++y) {
                for (var x = 0; x < mapW; ++x) {
                    var tile = tileTypes[gameMap[toIndex(x, y)]];
                    ctx.drawImage(tileset,
                        tile.sprite[0].x, tile.sprite[0].y,
                        tile.sprite[0].w, tile.sprite[0].h,
                        (x * tileW),
                        (y * tileH),
                        tileW, tileH);
                }
            }

            var sprite = player.sprites[player.direction];
            ctx.drawImage(tileset, sprite[0].x, sprite[0].y, sprite[0].w, sprite[0].h,
                player.position[0],
                player.position[1],
                player.dimensions[0], player.dimensions[1]);

            // ctx.fillStyle = "#ff0000";
            // ctx.fillText("FPS: " + framesLastSecond, 10, 20);

            var tempX = Math.floor(player.position[0] / 40.0);
            var tempY = Math.floor(player.position[1] / 40.0);
        
            if(tileTypes[gameMap[(tempX+tempY*16)+1]].num == 4 || tileTypes[gameMap[(tempX+tempY*16)+1]].num == 6) // if tile to the right is a hidden tile
            {
                if(tileTypes[gameMap[(tempX+tempY*16)+1]].num == 4 && rightChangeHidden == 0)
                {
                    gameMap[(tempX+tempY*16)+1] = 6;
                    rightChangeView++;
                    if(!changedToBlink.includes((tempX+tempY*16)+1))
                    {
                        changedToBlink.push((tempX+tempY*16)+1);
                    }

                }
                else if(tileTypes[gameMap[(tempX+tempY*16)+1]].num == 6 && rightChangeView < 7)
                {
                    gameMap[(tempX+tempY*16)+1] = 6;
                    rightChangeView++;
                }
                else if(tileTypes[gameMap[(tempX+tempY*16)+1]].num == 6)
                {
                    gameMap[(tempX+tempY*16)+1] = 4;
                    rightChangeView = 0;
                    rightChangeHidden++; 
                }
                else if(rightChangeHidden < 7)
                {
                    gameMap[(tempX+tempY*16)+1] = 4;
                    rightChangeHidden++;   
                }
                if(rightChangeHidden == 7)
                {
                    rightChangeHidden = 0;
                }
            }
            
            if(tileTypes[gameMap[(tempX+tempY*16)-1]].num == 4 || tileTypes[gameMap[(tempX+tempY*16)-1]].num == 6) // if tile to the left is a hidden tile
            {
                if(tileTypes[gameMap[(tempX+tempY*16)-1]].num == 4 && leftChangeHidden == 0)
                {
                    gameMap[(tempX+tempY*16)-1] = 6;
                    leftChangeView++;
                    if(!changedToBlink.includes((tempX+tempY*16)-1))
                    {
                        changedToBlink.push((tempX+tempY*16)-1);
                    } 
                }
                else if(tileTypes[gameMap[(tempX+tempY*16)-1]].num == 6 && leftChangeView < 7)
                {
                    gameMap[(tempX+tempY*16)-1] = 6;
                    leftChangeView++;
                }
                else if(tileTypes[gameMap[(tempX+tempY*16)-1]].num == 6)
                {
                    gameMap[(tempX+tempY*16)-1] = 4;
                    leftChangeView = 0;
                    leftChangeHidden++; 
                }
                else if(leftChangeHidden < 7)
                {
                    gameMap[(tempX+tempY*16)-1] = 4;
                    leftChangeHidden++; 
                }
                if(leftChangeHidden == 7)
                {
                    leftChangeHidden = 0;
                }
            }

            if(tileTypes[gameMap[(tempX+tempY*16)+16]].num == 4 || tileTypes[gameMap[(tempX+tempY*16)+16]].num == 6) // if tile down is a hidden tile
            {
                if(tileTypes[gameMap[(tempX+tempY*16)+16]].num == 4 && downChangeHidden == 0) 
                {
                    gameMap[(tempX+tempY*16)+16] = 6;
                    downChangeView++;
                    if(!changedToBlink.includes((tempX+tempY*16)+16))
                    {
                        changedToBlink.push((tempX+tempY*16)+16);
                    } 
                }
                else if(tileTypes[gameMap[(tempX+tempY*16)+16]].num == 6 && downChangeView < 7)
                {
                    gameMap[(tempX+tempY*16)+16] = 6;
                    downChangeView++;
                }
                else if(tileTypes[gameMap[(tempX+tempY*16)+16]].num == 6)
                {
                    gameMap[(tempX+tempY*16)+16] = 4;
                    downChangeView = 0;
                    downChangeHidden++; 
                }
                else if(downChangeHidden < 7)
                {
                    gameMap[(tempX+tempY*16)+16] = 4;
                    downChangeHidden++;    
                }
                if(downChangeHidden == 7)
                {
                    downChangeHidden = 0;
                }
            }

            if(tileTypes[gameMap[(tempX+tempY*16)-16]].num == 4 || tileTypes[gameMap[(tempX+tempY*16)-16]].num == 6) // if tile up is a hidden tile
            {
                if(tileTypes[gameMap[(tempX+tempY*16)-16]].num == 4 && upChangeHidden == 0)
                {
                    gameMap[(tempX+tempY*16)-16] = 6;
                    upChangeView++;
                    if(!changedToBlink.includes((tempX+tempY*16)-16))
                    {
                        changedToBlink.push((tempX+tempY*16)-16);
                    }
                }
                else if(tileTypes[gameMap[(tempX+tempY*16)-16]].num == 6 && upChangeView < 7)
                {
                    gameMap[(tempX+tempY*16)-16] = 6;
                    upChangeView++;
                }
                else if(tileTypes[gameMap[(tempX+tempY*16)-16]].num == 6)
                {
                    gameMap[(tempX+tempY*16)-16] = 4;
                    upChangeView = 0;
                    upChangeHidden++; 
                }
                else if(upChangeHidden < 7)
                {
                    gameMap[(tempX+tempY*16)-16] = 4;
                    upChangeHidden++;
                }
                if(upChangeHidden == 7)
                {
                    upChangeHidden = 0;
                }
            }

            lastFrameTime = currentFrameTime;
            requestAnimationFrame(drawGame);     

		    /*if (player.hasTool == true) {
                if (numOfTools == 0) {
                    document.getElementById('tool_inv').src="public/NoTools.png";
                }
                if (numOfTools == 1) {
                    document.getElementById('tool_inv').src="public/Tool1.png";
                }
                else if (numOfTools == 2) {
                    document.getElementById('tool_inv').src="public/Tool2.png";
                }
                else if (numOfTools == 3) {
                    document.getElementById('tool_inv').src="public/Tool3.png";
                }
                else if (numOfTools == 4) {
                    document.getElementById('tool_inv').src="public/Tool4.png";
                }
                else if (numOfTools == 5) {
                    document.getElementById('tool_inv').src="public/Tool5.png";
                }
                
                //document.getElementById('tool_inv').src="public/Tool2.png";
                document.getElementById('tool_inv').style.visibility = 'visible';
			}
			else if(player.hasTool == false){
				document.getElementById('tool_inv').style.visibility = 'hidden';
            }

            //makes battery on status bar visible or not
            /*
			if(totalPercentCounter >= 25){
			    document.getElementById('battery_inv').style.visbility = 'visible';
            }
            else {
			    document.getElementById('battery_inv').style.visibility = 'hidden';
            }
            */
            
        /*
           if(batteryLVL > 75){
            document.getElementById('battery_inv').src="public/battery.png";
            document.getElementById('battery_inv').style.visbility = 'visible';
            }
            if(batteryLVL <= 75 && batteryLVL >= 70){
                document.getElementById('battery_inv').src="public/battery75.png";
                //document.getElementById('battery_inv').style.visbility = 'visible';
            }
            else if(batteryLVL <= 50 && batteryLVL >= 45){
                document.getElementById('battery_inv').src="public/battery50.png";
                //document.getElementById('battery_inv').style.visbility = 'visible';
            }
            else if(batteryLVL <= 25 && batteryLVL >= 20){
                document.getElementById('battery_inv').src="public/battery25.png";
                //document.getElementById('battery_inv').style.visbility = 'visible';
            }
            else if(batteryLVL < 3){
                document.getElementById('battery_inv').src="public/battery0.png";
                //document.getElementById('battery_inv').style.visbility = 'visible';
            }
            else {
                document.getElementById('battery_inv').style.visibility = 'hidden;'
            }
            */
            
        }
		
		
        //PDDL NO MORE!
        /*
        Character.prototype.convertPlan = function () {
            let currLoc = (m => m[0] + m[1] * 6 - 6)(maps[mapId].start.map(px => Math.floor(px / 40.0)));
            let numObj = 0;
            let lastRoom = 'dummy-room';
            return this.plan.map(p => {
                switch (p.Action) {
                    case 'left':
                        return { Action: p.obstacle ? `remove-obstacle rover1 obstacle${++numObj} loc${currLoc} loc${--currLoc}` : `move rover1 loc${currLoc} loc${--currLoc}`, explain: p.explain };
                    case 'right':
                        return { Action: p.obstacle ? `remove-obstacle rover1 obstacle${++numObj} loc${currLoc} loc${++currLoc}` : `move rover1 loc${currLoc} loc${++currLoc}`, explain: p.explain };
                    case 'up':
                        return { Action: p.obstacle ? `remove-obstacle rover1 obstacle${++numObj} loc${currLoc} loc${currLoc -= 6}` : `move rover1 loc${currLoc} loc${currLoc -= 6}`, explain: p.explain };
                    case 'down':
                        return { Action: p.obstacle ? `remove-obstacle rover1 obstacle${++numObj} loc${currLoc} loc${currLoc += 6}` : `move rover1 loc${currLoc} loc${currLoc += 6}`, explain: p.explain };
                    case 'Room-visited':
                        lastRoom = rooms[currLoc];
			displayMessage("I have saved him!");
                        return { Action: `visit-room rover1 room${lastRoom} loc${currLoc}`, explain: p.explain };
		    case 'pickUp':
                        return { Action: 'remove-tool', explain: p.explain };
			case 'pickUpBatt':
						return { Action: 'remove-battery', explain: p.explain};
                    default:
                        let loc = (l => parseInt(l[0]) + parseInt(l[1]) * 6 - 6)(p.Action.split(/[()]/)[1].split(','));
                        return { Action: `set-to-visit room${rooms[loc]} ${lastRoom == 'dummy-room' ? lastRoom : `room${lastRoom}`}`, explain: p.explain };
                }
            });
        }
        */

        $('.confirmationButton').click(function () {
            player.plan.push({ Action: player.lastMove, explain: this.id == 'true', obstacle: gameMap[player.tileTo[0] + player.tileTo[1] * 16] == 3 });
            player.lastMove = null;
            if (player.lastClick) {
                player.plan.push({ Action: `Human-Clicked (${player.lastClick.x},${player.lastClick.y})`, explain: true });
                player.lastClick = null;
            }
			wait_for_click = false;
            gameMap = path_remeber.slice();
			if (this.id == 'true') //If yes is clicked
			{
				yesClicked++;
				document.getElementById('true').style.visibility = 'visible'; 
                document.getElementById('false').style.visibility = 'hidden'; //Remove the no button
                for(var i = 0; i < changedToBlink.length; i++)
                {
                    gameMap[changedToBlink[i]] = 4;
                }
                changedToBlink.length = 0;
				if(choosingFlag)
                {
                    let newd = new Date();
                    newd = newd.getTime();
                    let chooseTimePassed = (newd-timeToChoose)/1000;

                    console.log("time taken to choose: ", chooseTimePassed);
                    storeTime.push(chooseTimePassed);

                    timeToChoose = 0;
                    choosingFlag = false;   
                }
                
				//console.log("yesCLicked = ", yesClicked);
                
				if(target_check && not_tool)
                {
                    Green_path=false;
                    player.delayMove=150;
                    gameMap=path_remeber.slice();
                    const path =[]
                    let search = BFS(target_position,Math.floor(player.position[0] / 40.0) + Math.floor(player.position[1] / 40.0) * 16);
                    
                    while (!!search && search.parent != null) 
                    {
                        path.push(search.move);
                        search = search.parent;
                    }
                    player.stack = path;
                }
                //this is so the robot goes to the battery after clicking yes
                /*
                if(batteryLVL<=25 && battery_check && not_tool)
                {
                    Green_path=false;
                    player.delayMove=150;

                    gameMap=path_remeber.slice();


                    const path =[]
                    let search = TileBFS(18,19,20,21,Math.floor(player.position[0] / 40.0) + Math.floor(player.position[1] / 40.0) * 16);
                    
                    while (!!search && search.parent != null) 
                    {
                        path.push(search.move);
                        search = search.parent;
                    }
                    player.stack = path;
                    displayMessage("Going to charge station");
                    //battery_check = false;
                }
                */
                
			}
			else if(this.id == 'false') //Else if no is clicked
			{
                noClicked++;
				document.getElementById('true').style.visibility = 'hidden'; //Remove the yes button
                document.getElementById('false').style.visibility = 'visible';
                
                for(var i = 0; i < changedToBlink.length; i++)
                {
                    gameMap[changedToBlink[i]] = 4;
                }
                changedToBlink.length = 0;
                if(choosingFlag)
                {
                    let newd = new Date();
                    newd = newd.getTime();
                    let chooseTimePassed = (newd-timeToChoose)/1000;

                    console.log("time taken to choose: ", chooseTimePassed);
                    storeTime.push(chooseTimePassed);

                    timeToChoose = 0;
                    choosingFlag = false;   
                }
                
                if(target_check && not_tool)
                {
                    Green_path=false;
                    player.delayMove=150;
					gameMap = path_remeber.slice();
					const path =[]
                    let search = BFS(target_position,Math.floor(player.position[0] / 40.0) + Math.floor(player.position[1] / 40.0) * 16);
                    
                    while (!!search && search.parent != null) 
                    {
                        path.push(search.move);
                        search = search.parent;
                    }
                    player.stack = path;
                }
                //this is so the robot goes to the battery after clicking no
                /*
                if(batteryLVL<=25 && battery_check && not_tool)
                {
                    Green_path=false;
                    player.delayMove=150;

                    gameMap=path_remeber.slice();


                    const path =[]
                    let search = TileBFS(18,19,20,21,Math.floor(player.position[0] / 40.0) + Math.floor(player.position[1] / 40.0) * 16);
                    
                    while (!!search && search.parent != null) 
                    {
                        path.push(search.move);
                        search = search.parent;
                    }
                    player.stack = path;
                    displayMessage("Going to charge station");
                    //battery_check = false;
                }
                */
                
			}
            $('.confirmationButton').attr('disabled', 'disabled'); //Either way disable all buttons
        });
        
		
	function displayMessage(message){
		var box = document.getElementById('robo_com');
		box.value = box.value + message+"\n";
		var textarea = document.getElementById('robo_com');
		textarea.scrollTop = textarea.scrollHeight;
		return true
	}
	
	
	function calcBattLVL(){
		//add breakpoint on first if
		console.log("totalPercentCounter = ", totalPercentCounter);
			if(totalPercentCounter < 25){
				batteryLVL = 100;
				console.log("Battery is at 100%");
			} 
			else if(totalPercentCounter >= 25 && totalPercentCounter <= 30){
				batteryLVL = 75;
				console.log("Battery is at 75%");
			} else if(totalPercentCounter >= 50 && totalPercentCounter <= 55) {
				batteryLVL = 50;
				console.log("Battery is at 50%");
			} else if(totalPercentCounter >= 75 && totalPercentCounter <=80) {
				batteryLVL = 25;
				console.log("Battery is at 25%");
            }
            else if(totalPercentCounter >=100) {
                batteryLVL = 0;
            }
            /*
            if(batteryLVL > 75){
            document.getElementById('battery_inv').src="public/battery.png";
            document.getElementById('battery_inv').style.visbility = 'visible';
            }
            if(batteryLVL <= 75 && batteryLVL >= 70){
                document.getElementById('battery_inv').src="public/battery75.png";
                //document.getElementById('battery_inv').style.visbility = 'visible';
            }
            else if(batteryLVL <= 50 && batteryLVL >= 45){
                document.getElementById('battery_inv').src="public/battery50.png";
                //document.getElementById('battery_inv').style.visbility = 'visible';
            }
            else if(batteryLVL <= 25 && batteryLVL >= 20){
                document.getElementById('battery_inv').src="public/battery25.png";
                //document.getElementById('battery_inv').style.visbility = 'visible';
            }
            else if(batteryLVL < 3){
                document.getElementById('battery_inv').src="public/battery0.png";
                //document.getElementById('battery_inv').style.visbility = 'visible';
            }
            
            else if(batteryLVL <= 0 ) {
                player.path = [];
                displayMessage("I am out of battery. Please restart the game.");    
            }
            
            else {
                document.getElementById('battery_inv').style.visibility = 'hidden;'
            }
            */
		};
