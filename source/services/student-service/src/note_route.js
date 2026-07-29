const express = require('express');
const { NoteService } = require('./note_service');
const { NoteRepo } = require('./note_repo');
const RabbitMQNote = require('./rabbitmq/note-s');
const Note = require("./note")
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require("multer");
const fs = require('fs');


const router = express.Router();
const noteRepo = new NoteRepo(Note);
const noteService = new NoteService(noteRepo);

router.get('/', (req, res) => {
  res.redirect('/home');
});

// When a GET request is made to /my_note, send back my_note.html
router.get('/my_notes', (req, res) => {
  let token = req.cookies.access_token;
  const tokenFromUrl = req.query.token;

  // Se arriva il token dall'URL (dopo il login), salvalo nel cookie di questa porta (7070)
  if (!token && tokenFromUrl) {
      token = tokenFromUrl;
      res.cookie('access_token', token, { 
          httpOnly: true, 
          secure: true, 
          sameSite: 'None' 
      });
  }

  // REINDIRIZZAMENTO DINAMICO SE NON LOGGATO
  if (!token) {
      const error = encodeURIComponent('You need to login to access the website.');
      let loginUrl = `http://localhost:8080?error=${error}`;
      
      // Se siamo su GitHub Codespaces, calcola l'URL giusto per la porta 8080
      if (req.headers.host && (req.headers.host.includes('github.dev') || req.headers.host.includes('gitpod.io'))) {
          const newHost = req.headers.host.replace(/-\d+\.app\.github\.dev/, '-8080.app.github.dev');
          loginUrl = `https://${newHost}?error=${error}`;
      }
      return res.redirect(loginUrl);
  }
  try{
    // Verify the token using the same secret key used for signing
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("Authenticated user: ",decoded);
    
    res.sendFile(path.join(__dirname, '..', 'public', 'my_note.html'));
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
});

router.get('/all_notes', (req, res) => {
  let token = req.cookies.access_token;
  const tokenFromUrl = req.query.token;

  // Se arriva il token dall'URL (dopo il login), salvalo nel cookie di questa porta (7070)
  if (!token && tokenFromUrl) {
      token = tokenFromUrl;
      res.cookie('access_token', token, { 
          httpOnly: true, 
          secure: true, 
          sameSite: 'None' 
      });
  }

  // REINDIRIZZAMENTO DINAMICO SE NON LOGGATO
  if (!token) {
      const error = encodeURIComponent('You need to login to access the website.');
      let loginUrl = `http://localhost:8080?error=${error}`;
      
      // Se siamo su GitHub Codespaces, calcola l'URL giusto per la porta 8080
      if (req.headers.host && (req.headers.host.includes('github.dev') || req.headers.host.includes('gitpod.io'))) {
          const newHost = req.headers.host.replace(/-\d+\.app\.github\.dev/, '-8080.app.github.dev');
          loginUrl = `https://${newHost}?error=${error}`;
      }
      return res.redirect(loginUrl);
  }
  try{
    // Verify the token using the same secret key used for signing
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("Authenticated user: ",decoded);

    res.sendFile(path.join(__dirname, '..', 'public', 'all_notes.html'));
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
});

router.get('/getNotes', async (req, res) => {
    try {
        const response = await noteService.getNotesByStudentId (req, res);
        console.log("Response, notes:",response);
        
        if (response.status === 200) {
            res.json(response.data); // Send the notes as JSON response
        }
        else {
            res.status(response.status).json({ message: response.message });
        }
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/deleteNote', async (req, res)=> {
  try {
      const response = await noteService.deleteNote (req, res);
      console.log("Response, notes:",response);
      
      if (response.status === 200) {
          res.json(response.data); // Send the notes as JSON response
      }
      else {
          res.status(response.status).json({ message: response.message });
      }
  } catch (error) {
      console.error('Error fetching notes:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/addNote', async (req, res) => {
    try {
        const response = await noteService.addNote(req, res);
        res.status(response.status).json({ message: response.message });

    } catch (error) {
        console.error('Error adding note:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 1. When a post request is made to /getUsername, call the produce method of the RabbitMQNote class
// go to the producer.js file and see the produce method
router.post("/getUsername", async (req, res, next) => {
    console.log("/getUsername",req.body);
    console.log("Type of req.body:", typeof req.body);
    try {
      const response = await RabbitMQNote.produce(req.body);
      res.send({ response });
    } catch (error) {
      next(error); 
    }
});

// When a post request is made to /getCourses, call the produce method of the RabbitMQNote class
router.post("/getCourses", async (req, res, next) => {
  console.log("/getCourses",req.body);
  console.log("Type of req.body:", typeof req.body);
  try {
    const response = await RabbitMQNote.produce(req.body);
    res.send({ response });
  } catch (error) {
    next(error); 
  }
});

router.get("/getStudentPage", (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try{
    // Verify the token using the same secret key used for signing
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("Authenticated user: ",decoded);
    
    res.sendFile(path.join(__dirname, '..', 'public', 'student_home.html'));
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
});

router.get("/getNotesPage", (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try{
    // Verify the token using the same secret key used for signing
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("Authenticated user: ",decoded);
    
    res.sendFile(path.join(__dirname, '..', 'public', 'my_note.html'));
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
});


  
router.get("/home", (req, res) => {
    let token = req.cookies.access_token;
  const tokenFromUrl = req.query.token;

  // Se arriva il token dall'URL (dopo il login), salvalo nel cookie di questa porta (7070)
  if (!token && tokenFromUrl) {
      token = tokenFromUrl;
      res.cookie('access_token', token, { 
          httpOnly: true, 
          secure: true, 
          sameSite: 'None' 
      });
  }

  // REINDIRIZZAMENTO DINAMICO SE NON LOGGATO
  if (!token) {
      const error = encodeURIComponent('You need to login to access the website.');
      let loginUrl = `http://localhost:8080?error=${error}`;
      
      // Se siamo su GitHub Codespaces, calcola l'URL giusto per la porta 8080
      if (req.headers.host && (req.headers.host.includes('github.dev') || req.headers.host.includes('gitpod.io'))) {
          const newHost = req.headers.host.replace(/-\d+\.app\.github\.dev/, '-8080.app.github.dev');
          loginUrl = `https://${newHost}?error=${error}`;
      }
      return res.redirect(loginUrl);
  }
    try{
      // Verify the token using the same secret key used for signing
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      console.log("Authenticated user: ",decoded);
      
      res.sendFile(path.join(__dirname, '..', 'public', 'student_home.html'));
    } catch (error) {
      console.error("Error verifying token:", error);
      return res.status(401).json({ message: 'Unauthorized' });
    }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const addressLine = "./public/uploads";
    try {
      fs.mkdirSync(addressLine, { recursive: true }); // Create directory if it doesn't exist
      cb(null, addressLine);
    } catch (err) {
      cb(err); // Pass the error to multer
    }
  },
  filename: (req, file, cb) => {
    const name = Date.now() + '-' + file.originalname;
    cb(null, name);
  },
});
const upload = multer({ 
  storage: storage
});

router.post('/upload', upload.single('file'), (req, res) => {
    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);

    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded or invalid file type' });
    }
    return res.status(200).json({ message: 'File uploaded successfully', filename: req.file.filename });
});

  
module.exports = router;