const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true});

module.exports = mongoose.model(
        "Game",
        new mongoose.Schema(
            {
                userId: String,
                creationDate: {type: Number, default: Date.now()},
                blocks: Array,
                level: Number
            }
        )
    );