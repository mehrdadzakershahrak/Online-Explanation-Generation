'''
3 files, one file from heroku to server(Sam) that translates left right up down to 
north south east west and stores it in an array, one file that reads that array
and determines which direction to turn the robot, and one file that reads which 
direction we want to go and tells the NAO, using the NAO script files.

'''

angle #Angle for turning left = 90, right = -90, turnaround = 180
currDir #current direction NAO is facing
nextMove #next element in array of moves

def chooseDirection(currDir, nextMove):
	if currDir == north and nextMove == forward:
		#x = 1, angle = 0, NAO script code
		currDir = north
		
	elif: currDir == north and nextMove == turnright:
		#x = 1, angle = -90, NAO script code
		currDir = east
		
	elif: currDir == north and nextMove == turnaround:
		#x = 1, angle = 180
		currDir = south
		
	elif: currDir == north and nextMove == turnleft:
		#x = 1, angle = 90
		currDir = west
	''''''''''''''''''''''''''''''''''''''''''''''''
	elif: currDir == east and nextMove == forward:
		#x = 1, angle = 0
		currDir = east
		
	elif: currDir == east and nextMove == turnright:
		#x = 1, angle = -90;
		currDir = south
		
	elif: currDir == east and nextMove == turnaround:
		#x = 1, angle = 180;
		currDir = west
		
	elif: currDir == east and nextMove == turnleft:
		#x = 1, angle = 90;
		currDir = north
	''''''''''''''''''''''''''''''''''''''''''''''''
	elif: currDir == south and nextMove == forward:
		#x = 1, angle = 0;
		currDir = south
		
	elif: currDir == south and nextMove == turnright:
		#x = 1, angle = -90;
		currDir = west
		
	elif: currDir == south and nextMove == turnaround:
		#x = 1, angle = 180;
		currDir = north
		
	elif: currDir == south and nextMove == turnleft:
		#x = 1, angle = 90;
		currDir = east
	''''''''''''''''''''''''''''''''''''''''''''''''
	elif: currDir == west and nextMove == forward:
		#x = 1, angle = 0;
		currDir = west
		
	elif: currDir == west and nextMove == turnright:
		#x = 1, angle = -90;
		currDir = north
		
	elif: currDir == west and nextMove == turnaround:
		#x = 1, angle = 180;
		currDir = east
		
	elif: currDir == west and nextMove == turnleft:
		#x = 1, angle = 90;
		currDir = south

#end function	
	
chooseDirection(currDir, nextMove)