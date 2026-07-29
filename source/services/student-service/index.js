require('dotenv').config(); 
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const noteRoutes = require('./src/note_route');
const RabbitMQNote = require('./src/rabbitmq/note-s');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Add this line to parse form data
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));


// Allow CORS dynamically for both localhost and cloud environments (Gitpod/Codespaces)
app.use(cors({
  origin: function(origin, callback) {
    // Accetta qualsiasi origine dinamicamente
    callback(null, true);
  },
  credentials: true, // attivo per far passare il token di login (cookie)
}));

// Serve static files from the 'public' directory
app.use('', noteRoutes);


const port = 7070;
app.listen(port, async() => {
  console.log(`Student Server is running on port ${port}`);
  await RabbitMQNote.initialize(); // Initialize the RabbitMQ connection only when the server starts
  
});



