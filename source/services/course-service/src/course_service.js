const uuid = require('uuid');


class CourseService {
    constructor(courseRepo) {
        this.courseRepo = courseRepo;
    }

    // Function to add a course to the database
    async addCourse(req) {
        console.log("Received Request Body:", req.body); // Debugging log

        const { title, description, professor_id, professor_name , tag } = req.body;
        const id = require('uuid').v4(); // Generate a UUID for the course
        const student_ids = [];

        if (!title || !professor_id) {
            return { status: 400, message: 'Invalid request: Missing fields' };
        }

        try {
            const course = await this.courseRepo.addCourse(id, title, description, professor_id, professor_name, student_ids ,tag);
            if (!course) {
                return { status: 500, message: 'Internal server error' };
            }
            return { status: 200, message: course };
        } catch (error) {
            console.error('Error adding course:', error);
            return { status: 500, message: 'Internal server error' };
        }
    }
    // Function to add a student to a course
    async addStudentToCourse(req) {
        const { course_id, student_id } = req.body;

        if (!course_id || !student_id) {
            return { status: 400, message: 'Invalid request: Missing fields' };
        }

        try {
            const updatedCourse = await this.courseRepo.addStudentToCourse(course_id, student_id);
            if (!updatedCourse) {
                return { status: 500, message: 'Failed to add student to course' };
            }

            return { status: 200, message: 'Student added to course successfully' };
        } catch (error) {
            console.error('Error adding student to course:', error);
            return { status: 500, message: 'Internal server error' };
        }
    }
    // New method to fetch all courses
    async getCoursesByProfessorId(req) {

        const professor_id = req.headers.professor_id; // Extract professor_id from headers
        console.log("Received professor_id in course_service:", professor_id);
        if (!professor_id) {
            return { status: 400, message: 'Missing professor_id' };
        }

        try {
            const courses = await this.courseRepo.getCoursesByProfessorId(professor_id);
            return { status: 200, data: courses };
        } catch (error) {
            console.error('Error fetching courses for professor:', error);
            return { status: 500, message: 'Internal server error' };
        }
    }

    async getCoursesByStudentId(req) {
        try {
            const studentId = req.headers.student_id;  // Recupera lo student_id dai parametri della query
            if (!studentId) {

                return { status: 400, message: "Missing student_id" };
            }

            const courses = await this.courseRepo.findCoursesByStudentId(studentId);

            console.log("Corsi ricevuti in course_Service:", JSON.stringify(courses, null, 2));
            return { status: 200, data: courses };

        } catch (error) {
            console.error("Error in getCoursesByStudentId:", error);
            return { status: 500, message: "Internal server error" };
        }
    }



    async getCoursesBySearch(req) {
        try {
            const profName = req.headers.professor_name?.trim();
            const courseName = req.headers.course_name?.trim();
            const studentId = req.headers.student_id;



            if (!profName && !courseName) {
                return { status: 400, message: "Devi fornire almeno il nome del professore o del corso." };
            }

            const courses = await this.courseRepo.findCourses(profName, courseName, studentId);
            return { status: 200, data: courses };
        } catch (error) {
            console.error("Errore in getCoursesBySearch:", error);
            return { status: 500, message: "Internal server error" };
        }
    }

    async subscribeToCourse(studentId, courseId) {
        try {
            const course = await this.courseRepo.findByPk(courseId);
            if (!course) throw new Error("Corso non trovato");

            await this.courseRepo.rawSubscribeToCourse(studentId, courseId);
            console.log("Studente iscritto al corso con successo");
        } catch (error) {
            console.error("Errore durante l'iscrizione:", error);
            throw error;
        }
    }

    async unsubscribeFromCourse(studentId, courseId) {
        try {
            const course = await this.courseRepo.findByPk(courseId);
            if (!course) throw new Error("Corso non trovato");

            await this.courseRepo.rawUnsubscribeFromCourse(studentId, courseId);
            console.log("Studente disiscritto dal corso con successo");
        } catch (error) {
            console.error("Errore durante la disiscrizione:", error);
            throw error;
        }
    }


    async getQuizzesByCourseId(req) {
        const courseId = req.headers.course_id; // Extract courseId from request parameters
        console.log("Received courseId:", courseId);
        if (!courseId) {
            return { status: 400, message: 'Missing courseId' };
        }
        try {
            const quizzes = await this.courseRepo.getQuizzesByCourseId(courseId);
            return { status: 200, data: quizzes };
        } catch (error) {
            console.error('Error fetching quizzes for course:', error);
            return { status: 500, message: 'Internal server error' };
        }
    }

    async addQuiz(req) {
        console.log("Received Request Body:", req.body); // Debugging log
        const { course_id, title, description, questions } = req.body;
        const id = require('uuid').v4(); // Generate a UUID for the quiz
        if (!course_id || !title || !questions) {
            return { status: 400, message: 'Invalid request: Missing fields' };
        }
        try {
            const quiz = await this.courseRepo.addQuiz(id, course_id, title, description, questions);
            if (!quiz) {
                return { status: 500, message: 'Internal server error' };
            }
            console.log("Quiz added successfully:", quiz);
            return { status: 200, message: 'Quiz added successfully' };
        } catch (error) {
            console.error('Error adding quiz:', error);
            return { status: 500, message: 'Internal server error' };
        }   
    }

    async addQuizAnswer(req) {
        console.log("Received Request Body:", req.body); 
        const { quiz_id, student_id, answers, completed, score } = req.body;
        const id = require('uuid').v4(); 
        if (!quiz_id || !student_id || !answers || !completed) {
            return { status: 400, message: 'Invalid request: Missing fields' };
        }
        try {
            const quizAnswer = await this.courseRepo.addQuizAnswer(id, quiz_id, student_id, answers, completed, score);
            if (!quizAnswer) {
                return { status: 500, message: 'Internal server error' };
            }
            console.log("Quiz answer added successfully:", quizAnswer);
            return { status: 200, message: 'Quiz answer added successfully' };
        } catch (error) {
            console.error('Error adding quiz answer:', error);
            return { status: 500, message: 'Internal server error' };
        }
    }

    async getQuizAnswer(req) {
        const { studentId, quizId } = req.query;
        console.log("Received studentId and quizId:", studentId, quizId); // Debugging log
        if (!studentId || !quizId) {
            return { status: 400, message: 'Invalid request: Missing fields' };
        }
        try {
            const quizAnswer = await this.courseRepo.getQuizAnswer(studentId, quizId);
            
            console.log("Quiz answer retrieved successfully:", quizAnswer);
            return { status: 200, data: quizAnswer };
        } catch (error) {
            console.error('Error retrieving quiz answer:', error);
            return { status: 500, message: 'Internal server error' };
        }
    }

    async publishMaterial(materialData) {
        const { courseId, description, file_url, file_type } = materialData;
        
        // Verifica che tutti i parametri necessari siano presenti
        if (!courseId || !description) {
          return { status: 400, message: 'Missing required fields: courseId or description' };
        }
      
        const uuid = require('uuid').v4();
        const date = new Date();
      
        try {
          // Se non c'è un file, file_url e file_type saranno nulli, quindi non sono necessari per salvare il materiale
          const savedMaterial = await this.courseRepo.saveMaterial(
            uuid,
            courseId,
            date,
            description,
            file_url || null,  // Se non c'è file_url, passeremo null
            file_type || null   // Se non c'è file_type, passeremo null
          );
      
          if (!savedMaterial) {
            return { status: 500, message: 'Failed to save material' };
          }
      
          return { status: 200, message: 'Material published successfully' };
        } catch (error) {
          console.error('Error in service publishMaterial:', error);
          return { status: 500, message: 'Internal server error' };
        }
      }

      async getMaterialsByCourseId(courseId) {
        const materials = await this.courseRepo.findMaterialsByCourseId(courseId);
        return materials;
      };

      async getStudentsByCourseID(courseId) {
        try {
          const studentIds = await this.courseRepo.findCourseById(courseId);
          
          // Aggiungi un log per vedere cosa arriva
          console.log('Student IDs ricevuti dal repo:', studentIds);
          
          return studentIds || [];
        } catch (error) {
          console.error('Error in service getStudentsByCourseID:', error);
          throw error;
        }
      }
      
}


module.exports = { CourseService };
