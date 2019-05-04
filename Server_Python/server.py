#to get a foot of movment, roughly .285 for one foot

import math
import almath
import almath as m # python's wrapping of almath
import sys
from naoqi import ALProxy
import naoqi
import time
import motion
from websocket_server import WebsocketServer

p = "north"

North = {
	"up": ("nforward", "north"),
	"right": ("nright", "east") ,
	"down": ("naround","south"),
	"left": ("nleft", "west")
}
East = {
	"up": ("nleft","north"),
	"right": ("nforward", "east"),
	"down": ("nright","south"),
	"left": ("naround", "west")
}
South = {
	"up": ("naround","north"),
	"right": ("nleft", "east"),
	"down": ("nforward","south"),
	"left": ("nright", "west")
}
West = {
	"up": ("nright","north"),
	"right": ("naround", "east"),
	"down": ("nleft","south"),
	"left": ("nforward", "west")
}

def StiffnessOn(proxy):
    # We use the "Body" name to signify the collection of all joints
    pNames = "Body"
    pStiffnessLists = 1.0
    pTimeLists = 1.0
    proxy.stiffnessInterpolation(pNames, pStiffnessLists, pTimeLists)


def nao_comand(robotIP, direction):
    # Init proxies.
    try:
        motionProxy = ALProxy("ALMotion", robotIP, 9559)
    except Exception, e:
        print "Could not create proxy to ALMotion"
        print "Error was: ", e

    try:
        postureProxy = ALProxy("ALRobotPosture", robotIP, 9559)
    except Exception, e:
        print "Could not create proxy to ALRobotPosture"
        print "Error was: ", e

    # Set NAO in Stiffness On
    StiffnessOn(motionProxy)

    # Send NAO to Pose Init
    postureProxy.goToPosture("StandInit", 0.5)

    #####################
    ## Enable arms control by Walk algorithm
    #####################
    motionProxy.setWalkArmsEnabled(True, True)
    #~ motionProxy.setWalkArmsEnabled(False, False)

    #####################
    ## FOOT CONTACT PROTECTION
    #####################
    #~ motionProxy.setMotionConfig([["ENABLE_FOOT_CONTACT_PROTECTION", False]])
    motionProxy.setMotionConfig([["ENABLE_FOOT_CONTACT_PROTECTION", True]])
    if direction == "nright":
    	X = 0.0
    	Y = 0.0
    	Theta = (-math.pi/2)+.2
    	motionProxy.post.moveTo(X, Y, Theta)
    	motionProxy.waitUntilMoveIsFinished()
    	X = .15
    	Theta = 0.0
    	motionProxy.post.moveTo(X, Y, Theta)
    	motionProxy.waitUntilMoveIsFinished()
        server.send_message_to_all("go")
    elif direction == "nleft":
    	X = 0.0
    	Y = 0.0
    	Theta = (math.pi/2)-.27
    	motionProxy.post.moveTo(X, Y, Theta)
    	motionProxy.waitUntilMoveIsFinished()
    	X = .15
    	Theta = 0.0
    	motionProxy.post.moveTo(X, Y, Theta)
    	motionProxy.waitUntilMoveIsFinished()
        server.send_message_to_all("go")
    elif direction == "naround":
    	X = 0.0
    	Y = 0.0
    	Theta = math.pi+.15
    	motionProxy.post.moveTo(X, Y, Theta)
    	motionProxy.waitUntilMoveIsFinished()
    	X = .15
    	Theta = 0.0
    	motionProxy.post.moveTo(X, Y, Theta)
    	motionProxy.waitUntilMoveIsFinished()
        server.send_message_to_all("go")
    elif direction == "nforward":
    	X = .15
    	Y = 0.0
    	Theta = 0.0
    	motionProxy.post.moveTo(X, Y, Theta)
    	motionProxy.waitUntilMoveIsFinished()
        server.send_message_to_all("go")
    #####################
    ## End Walk
    #####################
    #TARGET VELOCITY
    X = 0.0
    Y = 0.0
    Theta = 0.0
    motionProxy.stopMove()

def mover(move):
    global p
    if move == "pickUp":
        server.send_message_to_all("go")
    elif p == "north":
        nao_move, p = North[move]
        nao_comand(robotIp , nao_move)
    elif p == "east":
        nao_move, p = East[move]
        nao_comand(robotIp , nao_move)
    elif p == "south":
        nao_move, p = South[move]
        nao_comand(robotIp , nao_move)
    elif p == "west":
        nao_move, p = West [move]
        nao_comand(robotIp , nao_move)
if __name__ == "__main__":
    robotIp = "192.168.0.103"
    


#add data things to directions when figured out
def new_client(client, server):
    #this would be the new client stuff
    print("new client")

# Called for every client disconnecting
def client_left(client, server):
    #this would be when the client left
    print("client left")

# Called when a client sends a message
def message_received(client, server, message):
    if len(message) > 200:
        message = message[:200]+'..'
    mover(message)


PORT=5005
#server = WebsocketServer(PORT,HOST = 0.0.0.0) for running it not locally
server = WebsocketServer(PORT)
server.set_fn_new_client(new_client)
server.set_fn_client_left(client_left)
server.set_fn_message_received(message_received)
server.run_forever()