const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongodb = require('mongodb');
const uuid = require('uuid/v4');

const app = new express();
let db;

// MODIFY THIS TO CHANGE THE GAME TYPE
/*----------------------------------*/
/**/const GAMETYPE = 'game1_train'; //
/*----------------------------------*/

const PORT = process.env.PORT || 3000;

mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://<athena>:<athena123>@ds155614.mlab.com:55614/heroku_mrjjwzfs",function(err,client) 
//mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/Project_Athena", function(err, client)
{
    if(err)
    {
        console.log(err);
        process.exit(1);
    }

    db = client.db();
    console.log("Database, Project Athena, connection ready");
    
    //Initialize app.
    app.listen(PORT, () => {    
            console.log('listening');
    });
});

const users = {};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, `tutorial1.html`)));
app.get('/tutorial2', (req, res) => res.sendFile(path.join(__dirname, `tutorial2.html`)));
app.get('/tutorial3', (req, res) => res.sendFile(path.join(__dirname, `tutorial3.html`)));
app.get('/tutorial4', (req, res) => res.sendFile(path.join(__dirname, `tutorial4.html`)));
app.get('/tutorial5', (req, res) => res.sendFile(path.join(__dirname, `tutorial5.html`)));
app.get('/tutorial6', (req, res) => res.sendFile(path.join(__dirname, `tutorial6.html`)));
app.get('/tutorial7', (req, res) => res.sendFile(path.join(__dirname, `tutorial7.html`)));

app.get('/game', (req, res) => res.sendFile(path.join(__dirname, `${GAMETYPE}.html`)));

app.get('/questions', (req, res) => res.sendFile(path.join(__dirname, 'questions.html')));

app.post('/game', (req, res) => {
    const id = uuid();
    /* console.log("id is, ", id);
    console.log("mapId: ", req.body.mapId);
    console.log("timePassed ", req.body); */
    const obj = {id: id, gameTime: req.body.gameTime, mapId: req.body.mapId, numYes: req.body.numYes, numNo: req.body.numNo, pathYes: req.body.pathYes, pathNo: req.body.pathNo, expYes: req.body.expYes, expNo: req.body.expNo, gameActions: req.body.gameActions, timeArray: req.body.timeArray, decTime: req.body.decTime};
    users[id] = obj;
    res.send(id);
});

app.post('/questions', (req, res) => {
    console.log(req.body.id);
    console.log("ever here?");
    if (users[req.body.id]) {
        //const obj = { id: req.body.id, mapId: users[req.body.id].mapId, plan: users[req.body.id].plan, planSize: users[req.body.id].planSize, planTime: users[req.body.id].planTime, answers: req.body.answers };
        const obj = {
                    id: req.body.id, 
                    gameTime: users[req.body.id].gameTime, 
                    mapId: users[req.body.id].mapId, 
                    numYes: users[req.body.id].numYes, 
                    numNo: users[req.body.id].numNo,
                    Num_of_Yes_click_path: users[req.body.id].pathYes,
                    Num_of_No_click_path: users[req.body.id].pathNo,
                    Num_of_Yes_click_exp: users[req.body.id].expYes,
                    Num_of_No_click_exp: users[req.body.id].expNo,
                    gameActions: users[req.body.id].gameActions, 
                    timeArray: users[req.body.id].timeArray, 
                    timeAvg: users[req.body.id].decTime, 
                    answers: req.body.answers};

        console.log("Is this the object updated?", obj);
        delete users[req.body.id];

        db.collection("N_Pause_Data").insertOne(obj, (err, doc) => {
            if (err) throw err;
            res.send('Submission received');
        });
    }

});
