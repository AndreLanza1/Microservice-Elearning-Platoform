const express = require('express');
const { CourseService } = require('./course_service');
const { CourseRepo } = require('./course_repo');
const RabbitMQCourse = require('./rabbitmq/course-s');

const {Course, Quiz, QuizAnswer, Material} = require("./course");
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid'); 

const router = express.Router();
const courseRepo = new CourseRepo(Course, Quiz, QuizAnswer,Material);
const courseService = new CourseService(courseRepo);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));;
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    const uniqueSuffix = uuidv4(); 
    const finalName = `${nameWithoutExt}_${uniqueSuffix}${ext}`;
    cb(null, finalName);
  }
});

const upload = multer({ storage: storage });

// Funzione helper per validare/gestire il token in ogni rotta protetta
function authenticateToken(req, res) {
    let token = req.cookies.access_token;
    const tokenFromUrl = req.query.token;

    // Token Handoff: se il token arriva dall'URL (dopo il login), salvalo nei cookie della porta 6060
    if (!token && tokenFromUrl) {
        token = tokenFromUrl;
        res.cookie('access_token', token, { 
            httpOnly: true, 
            secure: true, 
            sameSite: 'None' 
        });
    }

    if (!token) {
        return null; // Non autenticato
    }

    try {
        // Verifica il token con la chiave segreta
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
        console.error("Error verifying token:", error);
        return null;
    }
}

router.get('/getCourses', async (req, res) => {
    try {
        const response = await courseService.getCoursesByProfessorId (req, res);
        //console.log("Response, courses:",response);
        
        if (response.status === 200) {
            res.json(response.data); // Send the courses as JSON response
        }
        else {
            res.status(response.status).json({ message: response.message });
        }
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/addCourse', async (req, res) => {
  try {
      const response = await courseService.addCourse(req);
      if (response.status === 200) {
        console.log("Messageee:", response.message);
          res.status(200).json({ message: response.message, course: response.course });
      } else {
          res.status(response.status).json({ error: response.message });
      }
  } catch (error) {
      console.error('Error adding course:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/addStudentToCourse', async (req, res) => {
  try {
    const response = await courseService.addStudentToCourse(courseId, studentId);

  } catch (error) {
    console.error('Error adding student to course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
  

// 1. When a post request is made to /getUsername, call the produce method of the RabbitMQCourse class
// go to the producer.js file and see the produce method
router.post('/getUsername', async (req, res, next) => {
  console.log("getUsername",req.body);
  console.log("Type of req.body:", typeof req.body);
  try {
    const { randomUUID } = require("crypto");
    const correlationId = randomUUID();
    const replyToQueue = "rpc_queue"; // or fetch it from config if needed
    const response = await RabbitMQCourse.produce(req.body, correlationId, replyToQueue);
    res.send({ response });
  } catch (error) {
    next(error); 
  }
});

router.post('/getUsernames', async (req, res, next) => {
  console.log("getUsernames",req.body);
  console.log("Type of req.body:", typeof req.body);
  try {
    const { randomUUID } = require("crypto");
    const correlationId = randomUUID();
    const replyToQueue = "rpc_queue"; // or fetch it from config if needed
    const response = await RabbitMQCourse.produce(req.body, correlationId, replyToQueue);
    res.send({ response });
  } catch (error) {
    next(error); 
  }
});
  

router.get('/getCoursesByStudentId', async (req,res) => {
  try {
      const response = await courseService.getCoursesByStudentId(req);
      if (response.status === 200) {
          res.json(response.data);
      } else {
          res.status(response.status).json({ message: response.message });
      }
  } catch (error) {
      console.error('Error fetching courses by student ID:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/getCoursesBySearch', async (req, res) => {
  try {
    const response = await courseService.getCoursesBySearch(req);

    if (response.status === 200) {
      res.json(response.data);
    }
  }
  catch(error){
    console.log("Error in GetCoursesBySearch");
  }
});

router.get('/home', (req, res) => {
    const decoded = authenticateToken(req, res);
    if (!decoded) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    console.log("Authenticated user: ", decoded);
    res.sendFile(path.join(__dirname, '..', 'public', 'professor.html'));
});

router.get('/CoursePage', (req, res) => {
    const decoded = authenticateToken(req, res);
    if (!decoded) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    console.log("Authenticated user: ", decoded);
    
    if (decoded.role === 'student') {
        res.sendFile(path.join(__dirname, '..', 'public', 'course_home_student.html'));
    } else if (decoded.role === 'teacher') {
        res.sendFile(path.join(__dirname, '..', 'public', 'course_home.html'));
    }
});

router.get('/CoursesPage', (req, res) => {
    const decoded = authenticateToken(req, res);
    if (!decoded) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    console.log("Authenticated user: ", decoded);
    
    if (decoded.role === 'student') {
        res.sendFile(path.join(__dirname, '..', 'public', 'courses.html'));
    } else if (decoded.role === 'teacher') {
        res.sendFile(path.join(__dirname, '..', 'public', 'professor.html'));
    }
});

router.get("/QuizPage", (req, res) => {
    const decoded = authenticateToken(req, res);
    if (!decoded) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    console.log("Authenticated user: ", decoded);
    
    if (decoded.role === 'student') {
        res.sendFile(path.join(__dirname, '..', 'public', '/quiz/quiz_student.html'));
    } else if (decoded.role === 'teacher') {
        res.sendFile(path.join(__dirname, '..', 'public', '/quiz/quiz_teacher.html'));
    }
});

router.get('/getQuizzes', async (req, res) => {
  try { 
    const response = await courseService.getQuizzesByCourseId(req,res); // Fetch quizzes by course ID
    console.log("Response, quizzes:",response);
    if (response.status === 200) {
      console.log("typeof response.data:",typeof response.data);
      res.json(response.data); // Send the quizzes as JSON response
    } else {
      res.status(response.status).json({ message: response.message });
    }
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/addQuiz', async (req, res) => {
  try {
    const response = await courseService.addQuiz(req, res); // Add a quiz to the course
    res.status(response.status).json({ message: response.message });

  } catch (error) {
    console.error('Error adding quiz:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/addQuizAnswer', async (req, res) => {
  try {
    const response = await courseService.addQuizAnswer(req, res);
    res.status(response.status).json({ message: response.message });
  } catch (error) {
    console.error('Error adding answer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/getQuizAnswer', async (req, res) => {
  try {
    const response = await courseService.getQuizAnswer(req, res);
    console.log("Response, quiz answers:",response);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error adding answer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
);

router.post('/publishMaterial', upload.single('file'), async (req, res) => {
  try {
    // Log dei dati ricevuti
    console.log('Dati ricevuti:', req.body);
    console.log('File ricevuto:', req.file);

    const file = req.file;

    // Se non è stato caricato un file, file_url sarà null e file_type non sarà definito
    let file_url = null;
    let file_type = null;

    // Gestione file (se presente)
    if (file) {
      file_url = path.join('/uploads', file.filename);

      const mt = file.mimetype;
      if (mt === 'application/pdf') {
        file_type = 'pdf';
      } else if (mt.startsWith('image/')) {
        file_type = 'image';
      } else if (mt.startsWith('video/')) {
        file_type = 'video';
      } else if (mt === 'application/msword' ||
                mt === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        file_type = 'doc';
      } else {
        return res.status(400).json({ message: 'Unsupported file type' });
      }
    }

    // Prepara i dati per inviarli al servizio (anche senza file)
    const data = {
      courseId: req.body.courseId,
      description: req.body.description,
      file_url,  // Se non ci sono file, questo sarà null
      file_type  // Se non ci sono file, questo sarà null
    };

    // Log dei dati prima di inviarli al servizio
    console.log('Dati preparati per il servizio:', data);

    // Chiama il servizio per pubblicare il materiale
    const result = await courseService.publishMaterial(data);

    // Restituisce la risposta al client
    res.status(result.status).json({ message: result.message });
  } catch (error) {
    console.error('Error publishing material:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/by-course-id/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    const materials = await courseService.getMaterialsByCourseId(courseId);
    res.status(200).json(materials);
  } catch (err) {
    console.error('Errore nel recupero materiali per ID:', err);
    res.status(500).json({ message: 'Errore interno del server' });
  }
});

router.get('/getStudentsByCourseID/:courseId', async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const students = await courseService.getStudentsByCourseID(courseId);

    // Aggiungi un log per vedere cosa ricevi
    console.log('Studenti per corso:', students);

    if (!students || students.length === 0) {
      return res.status(404).json({ message: 'Course not found or no students' });
    }

    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.post('/subscribeToCourse', async (req, res) => {
  const { student_id, course_id } = req.body;
  console.log("Student ID:", student_id, "Course ID:", course_id);
  try {
    await courseService.subscribeToCourse(student_id, course_id);
    res.status(200).send("Iscritto al corso");
  } catch (err) {
    console.error("Errore in /subscribeToCourse:", err); // <--- LOG DETTAGLIATO
    res.status(500).send("Errore iscrizione");
  }
});

router.post('/unsubscribeFromCourse', async (req, res) => {
  const { student_id, course_id } = req.body;
  try {
    await courseService.unsubscribeFromCourse(student_id, course_id);
    res.status(200).send("Disiscritto dal corso");
  } catch (err) {
    res.status(500).send("Errore disiscrizione");
  }
});


  
module.exports = router;