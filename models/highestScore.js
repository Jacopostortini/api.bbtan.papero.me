const mongoose = require("mongoose");


module.exports = mongoose.model(
    "HighestScore",
    new mongoose.Schema(
        {
            userId: String,
            score: Number,
            scoreDate: {type: Number, default: Date.now()}
        }
    )
);
