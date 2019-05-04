import math
import almath
import almath as m # python's wrapping of almath
import sys
from naoqi import ALProxy
import naoqi
import time
import motion

##################################################################################################################
function moveforward
##################################################################################################################
	
	# -*- encoding: UTF-8 -*- 

'''Move To: Small example to make Nao Move To an Objective'''

	def StiffnessOn(proxy):
		# We use the "Body" name to signify the collection of all joints
		pNames = "Body"
		pStiffnessLists = 1.0
		pTimeLists = 1.0
		proxy.stiffnessInterpolation(pNames, pStiffnessLists, pTimeLists)


	def main(robotIP):
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


		#TARGET VELOCITY
		X = 0.5
		Y = 0.0
		Theta = 0.0
	 
		motionProxy.post.moveTo(X, Y, Theta)

		motionProxy.waitUntilMoveIsFinished()

		#####################
		## Arms User Motion
		#####################
		# Arms motion from user have always the priority than walk arms motion
		JointNames = ["LShoulderPitch", "LShoulderRoll", "LElbowYaw", "LElbowRoll"]
		Arm1 = [-40,  25, 0, -40]
		Arm1 = [ x * motion.TO_RAD for x in Arm1]

		Arm2 = [-40,  50, 0, -80]
		Arm2 = [ x * motion.TO_RAD for x in Arm2]

		pFractionMaxSpeed = 0.6

		motionProxy.angleInterpolationWithSpeed(JointNames, Arm1, pFractionMaxSpeed)
		motionProxy.angleInterpolationWithSpeed(JointNames, Arm2, pFractionMaxSpeed)
		motionProxy.angleInterpolationWithSpeed(JointNames, Arm1, pFractionMaxSpeed)

		time.sleep(2.0)

		#####################
		## End Walk
		#####################
		#TARGET VELOCITY
		X = 0.0
		Y = 0.0
		Theta = 0.0
		motionProxy.setWalkTargetVelocity(X, Y, Theta, Frequency)
		motionProxy.stopMove()


	if __name__ == "__main__":
		robotIp = "127.0.0.1"

		if len(sys.argv) <= 1:
			print "Usage python motion_moveTo.py robotIP (optional default: 127.0.0.1)"
		else:
			robotIp = sys.argv[1]

		main(robotIp)

##################################################################################################################
function turnleft
##################################################################################################################

		def StiffnessOn(proxy):
		# We use the "Body" name to signify the collection of all joints
		pNames = "Body"
		pStiffnessLists = 1.0
		pTimeLists = 1.0
		proxy.stiffnessInterpolation(pNames, pStiffnessLists, pTimeLists)


	def main(robotIP):
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


		#TARGET VELOCITY
		X = 0.0
		Y = 0.0
		Theta = math.pi/2-.15
	 
		motionProxy.post.moveTo(X, Y, Theta)

		motionProxy.waitUntilMoveIsFinished()

		#####################
		## Arms User Motion
		#####################
		# Arms motion from user have always the priority than walk arms motion
		JointNames = ["LShoulderPitch", "LShoulderRoll", "LElbowYaw", "LElbowRoll"]
		Arm1 = [-40,  25, 0, -40]
		Arm1 = [ x * motion.TO_RAD for x in Arm1]

		Arm2 = [-40,  50, 0, -80]
		Arm2 = [ x * motion.TO_RAD for x in Arm2]

		pFractionMaxSpeed = 0.6

		motionProxy.angleInterpolationWithSpeed(JointNames, Arm1, pFractionMaxSpeed)
		motionProxy.angleInterpolationWithSpeed(JointNames, Arm2, pFractionMaxSpeed)
		motionProxy.angleInterpolationWithSpeed(JointNames, Arm1, pFractionMaxSpeed)

		time.sleep(2.0)

		#####################
		## End Walk
		#####################
		#TARGET VELOCITY
		X = 0.0
		Y = 0.0
		Theta = 0.0
		motionProxy.setWalkTargetVelocity(X, Y, Theta, Frequency)
		motionProxy.stopMove()


	if __name__ == "__main__":
		robotIp = "127.0.0.1"

		if len(sys.argv) <= 1:
			print "Usage python motion_moveTo.py robotIP (optional default: 127.0.0.1)"
		else:
			robotIp = sys.argv[1]

		main(robotIp)
##################################################################################################################
function turnright
##################################################################################################################

		def StiffnessOn(proxy):
		# We use the "Body" name to signify the collection of all joints
		pNames = "Body"
		pStiffnessLists = 1.0
		pTimeLists = 1.0
		proxy.stiffnessInterpolation(pNames, pStiffnessLists, pTimeLists)


	def main(robotIP):
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


		#TARGET VELOCITY
		X = 0.0
		Y = 0.0
		Theta = -math.pi/2+.15
	 
		motionProxy.post.moveTo(X, Y, Theta)

		motionProxy.waitUntilMoveIsFinished()

		#####################
		## Arms User Motion
		#####################
		# Arms motion from user have always the priority than walk arms motion
		JointNames = ["LShoulderPitch", "LShoulderRoll", "LElbowYaw", "LElbowRoll"]
		Arm1 = [-40,  25, 0, -40]
		Arm1 = [ x * motion.TO_RAD for x in Arm1]

		Arm2 = [-40,  50, 0, -80]
		Arm2 = [ x * motion.TO_RAD for x in Arm2]

		pFractionMaxSpeed = 0.6

		motionProxy.angleInterpolationWithSpeed(JointNames, Arm1, pFractionMaxSpeed)
		motionProxy.angleInterpolationWithSpeed(JointNames, Arm2, pFractionMaxSpeed)
		motionProxy.angleInterpolationWithSpeed(JointNames, Arm1, pFractionMaxSpeed)

		time.sleep(2.0)

		#####################
		## End Walk
		#####################
		#TARGET VELOCITY
		X = 0.0
		Y = 0.0
		Theta = 0.0
		motionProxy.setWalkTargetVelocity(X, Y, Theta, Frequency)
		motionProxy.stopMove()


	if __name__ == "__main__":
		robotIp = "127.0.0.1"

		if len(sys.argv) <= 1:
			print "Usage python motion_moveTo.py robotIP (optional default: 127.0.0.1)"
		else:
			robotIp = sys.argv[1]

		main(robotIp)

##################################################################################################################
function turnaround
##################################################################################################################

		def StiffnessOn(proxy):
		# We use the "Body" name to signify the collection of all joints
		pNames = "Body"
		pStiffnessLists = 1.0
		pTimeLists = 1.0
		proxy.stiffnessInterpolation(pNames, pStiffnessLists, pTimeLists)


	def main(robotIP):
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


		#TARGET VELOCITY
		X = 0.0
		Y = 0.0
		Theta = -math.pi+.15
	 
		motionProxy.post.moveTo(X, Y, Theta)

		motionProxy.waitUntilMoveIsFinished()

		#####################
		## Arms User Motion
		#####################
		# Arms motion from user have always the priority than walk arms motion
		JointNames = ["LShoulderPitch", "LShoulderRoll", "LElbowYaw", "LElbowRoll"]
		Arm1 = [-40,  25, 0, -40]
		Arm1 = [ x * motion.TO_RAD for x in Arm1]

		Arm2 = [-40,  50, 0, -80]
		Arm2 = [ x * motion.TO_RAD for x in Arm2]

		pFractionMaxSpeed = 0.6

		motionProxy.angleInterpolationWithSpeed(JointNames, Arm1, pFractionMaxSpeed)
		motionProxy.angleInterpolationWithSpeed(JointNames, Arm2, pFractionMaxSpeed)
		motionProxy.angleInterpolationWithSpeed(JointNames, Arm1, pFractionMaxSpeed)

		time.sleep(2.0)

		#####################
		## End Walk
		#####################
		#TARGET VELOCITY
		X = 0.0
		Y = 0.0
		Theta = 0.0
		motionProxy.setWalkTargetVelocity(X, Y, Theta, Frequency)
		motionProxy.stopMove()


	if __name__ == "__main__":
		robotIp = "127.0.0.1"

		if len(sys.argv) <= 1:
			print "Usage python motion_moveTo.py robotIP (optional default: 127.0.0.1)"
		else:
			robotIp = sys.argv[1]

		main(robotIp)