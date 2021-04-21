const express = require("express");
const bodyParser = require("body-parser");
//const cors = require("cors");

const app = express();
const http = require("http").Server(app);

/*
const corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
*/

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", require("./routes/index"));

// set port, listen for requests
const PORT = process.env.PORT || 8080;
http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

