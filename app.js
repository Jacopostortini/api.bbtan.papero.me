const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const http = require("http").Server(app);

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", require("./routes/index"));

const PORT = 3001;
http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

