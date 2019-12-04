begin_version
3
end_version
begin_metric
0
end_metric
7
begin_variable
var0
-1
2
Atom is-in(obstacle1, waypoint2)
<none of those>
end_variable
begin_variable
var1
-1
2
Atom open(waypoint2)
NegatedAtom open(waypoint2)
end_variable
begin_variable
var2
-1
6
Atom at(rover1, waypoint1)
Atom at(rover1, waypoint2)
Atom at(rover1, waypoint3)
Atom at(rover1, waypoint4)
Atom at(rover1, waypoint5)
Atom at(rover1, waypoint6)
end_variable
begin_variable
var3
-1
2
Atom is-in(obstacle2, waypoint5)
<none of those>
end_variable
begin_variable
var4
-1
3
Atom is-in(tool1, waypoint4)
Atom taken-tool(tool1)
<none of those>
end_variable
begin_variable
var5
-1
2
Atom open(waypoint5)
NegatedAtom open(waypoint5)
end_variable
begin_variable
var6
-1
2
Atom visited(rover1, room1)
NegatedAtom visited(rover1, room1)
end_variable
2
begin_mutex_group
2
0 0
1 0
end_mutex_group
begin_mutex_group
2
3 0
5 0
end_mutex_group
begin_state
0
1
0
0
0
1
1
end_state
begin_goal
1
6 0
end_goal
13
begin_operator
move rover1 waypoint1 waypoint2
1
1 0
1
0 2 0 1
1
end_operator
begin_operator
move rover1 waypoint1 waypoint4
0
1
0 2 0 3
1
end_operator
begin_operator
move rover1 waypoint2 waypoint3
0
1
0 2 1 2
1
end_operator
begin_operator
move rover1 waypoint2 waypoint5
1
5 0
1
0 2 1 4
1
end_operator
begin_operator
move rover1 waypoint3 waypoint6
0
1
0 2 2 5
1
end_operator
begin_operator
move rover1 waypoint4 waypoint1
0
1
0 2 3 0
1
end_operator
begin_operator
move rover1 waypoint4 waypoint5
1
5 0
1
0 2 3 4
1
end_operator
begin_operator
move rover1 waypoint5 waypoint6
0
1
0 2 4 5
1
end_operator
begin_operator
remove-obstacle rover1 obstacle1 waypoint1 waypoint2 tool1
1
2 0
3
0 0 0 1
0 4 1 2
0 1 -1 0
1
end_operator
begin_operator
remove-obstacle rover1 obstacle2 waypoint2 waypoint5 tool1
1
2 1
3
0 3 0 1
0 4 1 2
0 5 -1 0
1
end_operator
begin_operator
remove-obstacle rover1 obstacle2 waypoint4 waypoint5 tool1
1
2 3
3
0 3 0 1
0 4 1 2
0 5 -1 0
1
end_operator
begin_operator
take-tool rover1 tool1 waypoint4
1
2 3
1
0 4 0 1
1
end_operator
begin_operator
visit-room rover1 room1 waypoint6
1
2 5
1
0 6 -1 0
1
end_operator
0
