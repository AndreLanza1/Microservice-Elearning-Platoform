require('dotenv').config();  
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const userRoutes = require('./src/user_route');
const cookieParser = require("cookie-parser");
const cors = require('cors');
const RabbitMQUser = require('./src/rabbitmq/user-s');
const app = express();


console.log("ACCESS_TOKEN_SECRET index:", process.env.ACCESS_TOKEN_SECRET);


app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Add this line to parse form data
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
  origin: function(origin, callback) {
    callback(null, true);
  },
  credentials: true,
}));

// Serve static files from the 'public' directory
app.use('', userRoutes);

const port = 8080;
app.listen(port, async() => {
  console.log(`Server running on port ${port}`);
  await RabbitMQUser.initPromise;  // Wait for initialization to finish before proceeding
});



