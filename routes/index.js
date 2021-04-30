const express = require("express");
const router = express.Router();
const Game = require("../models/game");
const HighestScore = require("../models/highestScore");

function getCookies(request) {
    let cookies = {};
    request.headers && request.headers.cookie.split(';').forEach(function(cookie) {
        let parts = cookie.match(/(.*?)=(.*)$/)
        cookies[ parts[1].trim() ] = (parts[2] || '').trim();
    });
    return cookies;
}

router.get("/game", async (req, res)=>{
    const cookies = getCookies(req);
    console.log("Get game from ", cookies.userId);
    const game = await Game.findOne({userId: cookies.userId}, (err, game) => {return game}).exec();
    const highestScore = await HighestScore.findOne({userId: cookies.userId}, (err, highest) => {return highest}).exec();
    if(game){
        const {blocks, level, position} = game;
        let data = {blocks, level, position};
        if(highestScore) data = {...data, highestScore: highestScore.score, date: highestScore.scoreDate};
        res.send(data);
    } else res.send(null);
});

router.post("/game", async (req, res) => {
    const cookies = getCookies(req);
    console.log("Post game from ", cookies.userId);
    console.log("Posting game: ", req.body);
    const game = await Game.findOne({userId: cookies.userId}, (err, game) => {return game;}).exec();
    console.log("Game found: ", game);
    const highestScore = await HighestScore.findOne({userId: cookies.userId}, (err, highest) => {return highest;}).exec();
    let newScore;
    let newScoreDate;
    if(highestScore){
	if(highestScore.score < req.body.level){
	    newScore = req.body.level;
	    newScoreDate = Date.now();
	} else {
  	    newScore = highestScore.score;
	    newScoreDate = highestScore.date;
	}
    } else {
	newScore = req.body.level;
	newScoreDate = Date.now();
    }

    await HighestScore.replaceOne({userId: cookies.userId}, {
        userId: cookies.userId,
        score: newScore,
        scoreDate: newScoreDate
    }, {upsert: true});   

    await Game.replaceOne({userId: cookies.userId}, {
        userId: cookies.userId,
        blocks: req.body.blocks,
        level: req.body.level,
        position: req.body.position
    }, {upsert: true});
    console.log("Game found after replace: ", await Game.findOne({userId: cookies.userId}, (err, game) => {return game;}).exec());
    res.status(200).send("OK");

});

module.exports = router;

