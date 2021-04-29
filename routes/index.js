const express = require("express");
const router = express.Router();
const Game = require("../models/game");

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
    if(game){
        const {blocks, level, position} = game;
        res.send({blocks, level, position});
    } else res.send(null);
});

router.post("/game", async (req, res) => {
    const cookies = getCookies(req);
    const game = await Game.replaceOne({userId: cookies.userId}, {
        userId: cookies.userId,
        blocks: req.body.blocks,
        level: req.body.level,
        position: req.body.position
    }, {upsert: true});
    res.status(200).send("OK");

});

module.exports = router;
