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
    Game.findOne({userId: cookies.userId}, (err, {blocks, level}) => {
        res.send({blocks, level});
    });
});

router.post("/game", async (req, res) => {
    const cookies = getCookies(req);
    Game.replaceOne({userId: cookies.userId}, {
        userId: cookies.userId,
        blocks: req.body.blocks,
        level: req.body.level
    }, {upsert: true}, () => {
        res.sendStatus(200);
    });

})

module.exports = router;