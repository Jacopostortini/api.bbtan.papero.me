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
    const game = await Game.findOne({userId: cookies.userId}, (err, game) => {return game;}).exec();
    const highestScore = await HighestScore.findOne({userId: cookies.userId}, (err, highest) => {return highest;}).exec();
    if(highestScore.score < game.level){
        HighestScore.replaceOne({userId: cookies.userId}, {
            userId: cookies.userId,
            score: game.level,
            scoreDate: Date.now()
        }, {upsert: true});
    }

    Game.replaceOne({userId: cookies.userId}, {
        userId: cookies.userId,
        blocks: req.body.blocks,
        level: req.body.level,
        position: req.body.position
    }, {upsert: true});
    res.status(200).send("OK");

});

module.exports = router;
