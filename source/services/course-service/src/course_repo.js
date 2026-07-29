const { use } = require("./course_route");
const { Op, Sequelize} = require("sequelize");

class CourseRepo {

    constructor(courseModel, quizModel, quizAnswerModel,materialModel){
        this.courseModel = courseModel;
        this.quizModel = quizModel;
        this.quizAnswerModel = quizAnswerModel;
        this.materialModel = materialModel;
    } 

    async addCourse(uuidV4, title, description, professor_id, professor_name, student_ids,tag) {
      console.log("AAA", title, description, professor_id, student_ids);
      // adding check for identical named courses by the same prof
      const name = await this.courseModel.count({ where: { professor_id: professor_id , title: title} });
      if (name>=1 ) {
        const resp= "The course already exists, please change the name";
        console.log(resp, name); 
        return resp;
      } else {
        try {
          const newCourse = await this.courseModel.create({
              id: uuidV4,       // Set the generated UUID
              title,             // Insert the title
              description,       // Insert the description
              professor_id,      // Insert the professor id
              student_ids,
              professor_name,
              tag
          });
          console.log("Corso creato:", newCourse);
          return newCourse;     // Return the created course object
        } catch (error) {
            console.error("Error inserting course:", error);
            throw new Error('Database error');  // Throw an error if creation fails
        }
      }
  }
  

  async getCoursesByProfessorId(professor_id) {
    console.log("Cercando i corsi per professor_id:", professor_id);
    const courses = await this.courseModel.findAll({ where: { professor_id } });
    if (courses) {
      const allDataValues = courses.map(course => course.dataValues);
      console.log(allDataValues);
      return allDataValues;  // Return the raw data
    } else {
      console.log("No courses found for professor");
      return null;
    }
  }

  async addStudentToCourse(course_id, student_id) {
    try {
      const course = await this.courseModel.findOne({ where: { course_id } });
      if (!course) {
        console.log("Course not found");
        return null;
      }

      const studentIds = course.student_ids || [];
      if (!studentIds.includes(student_id)) {
        studentIds.push(student_id);
        course.student_ids = studentIds;
        await course.save();
        console.log("Student added to course");
        return course;
      } else {
        console.log("Student already enrolled in the course");
        return course;
      }
    } catch (error) {
      console.error("Error adding student to course:", error);
      return null;
    }
  } 

  // Functions for RabbitMQ
  async getCoursesByStudentId(student_id) {
    const courses = await this.courseModel.findAll({
      where: { student_ids: { [Op.contains]: [student_id] } }
    });
    if (courses && courses.length > 0) {
      const courseData = courses.map(course => course.dataValues);
      console.log("Courses is: ", courseData);
      return courseData;
    } else {
      console.log("Courses not found");
      return null;
    }

  }

  async findCoursesByStudentId(studentId) {
    try {
      const courses = await this.courseModel.findAll({
        where: {
          student_ids: {
            [require('sequelize').Op.contains]: [studentId]
          }
        }
      });
      console.log(" Corsi trovati nel DB per studentId", studentId, ":", courses.map(c => c.dataValues));

      return courses.map(course => course.dataValues);
    } catch (error) {
      console.error("Errore nella query findCoursesByStudentId:", error);
      return [];
    }
  }

  async findCourses(professorName, courseName, studentId) {
    try {
      const where = {};
  
      if (professorName) {
        where.professor_name = { [Op.iLike]: `%${professorName}%` };
      }
  
      if (courseName) {
        where.title = { [Op.iLike]: `%${courseName}%` };
      }
  
      const courses = await this.courseModel.findAll({ where });
  
      console.log("Query per findCourses:", where);
  
      // Mappiamo il risultato aggiungendo isSubscribed = true/false
      const result = courses.map(course => {
        const data = course.dataValues;
        data.isSubscribed = Array.isArray(data.student_ids) && data.student_ids.includes(studentId);
        return data;
      });
  
      return result;
  
    } catch (error) {
      console.error("Errore nella query findCourses:", error);
      return [];
    }
  }
  async findByPk(courseId) {
    try {
      const course = await this.courseModel.findByPk(courseId);
      if (!course) {
        console.log(`Corso con ID ${courseId} non trovato`);
      }
      return course;
    } catch (error) {
      console.error(`Errore in findByPk con courseId: ${courseId}`, error);
      return null;
    }
  }

  async rawSubscribeToCourse(studentId, courseId) {
    try {
      const [result] = await this.courseModel.sequelize.query(
        `UPDATE courses
         SET student_ids = 
           CASE 
             WHEN NOT student_ids @> ARRAY[:studentId]::UUID[] 
             THEN array_append(student_ids, :studentId)
             ELSE student_ids
           END
         WHERE id = :courseId`,
        {
          replacements: { studentId, courseId },
          type: Sequelize.QueryTypes.UPDATE
        }
      );
      return result;
    } catch (error) {
      console.error("Errore in rawSubscribeToCourse:", error);
      throw error;
    }
  }

  async rawUnsubscribeFromCourse(studentId, courseId) {
    try {
      const [result] = await this.courseModel.sequelize.query(
        `UPDATE courses
         SET student_ids = array_remove(student_ids, :studentId)
         WHERE id = :courseId`,
        {
          replacements: { studentId, courseId },
          type: Sequelize.QueryTypes.UPDATE
        }
      );
      return result;
    } catch (error) {
      console.error("Errore in rawUnsubscribeFromCourse:", error);
      throw error;
    }
  }

  
 

    async getQuizzesByCourseId(course_id) {
      try {
        console.log("Received courseId:", course_id);
        const quizzes = await this.quizModel.findAll({ where: { course_id } });
        console.log("Quizzes trovati nel DB per courseId", quizzes);
        if (quizzes && quizzes.length > 0) {
          const quizData = quizzes.map(quiz => quiz.dataValues);
          console.log("Quizzes is: ", quizData);
          console.log("typeof quizData", typeof quizData);
          return quizData;
        } else {
          console.log("Quizzes not found");
          return null;
        }

      } catch (error) {
        console.error("Error fetching quizzes for course:", error);
        return [];
      }
    }

    async addQuiz(uuidV4, course_id, title, description, questions) {
        try {
          const newQuiz = await this.quizModel.create({
            id: uuidV4,       // Set the generated UUID
            course_id,         // Insert the course_id
            title,              // Insert the title
            description,        // Insert the description
            questions           // Insert the questions
          });
          return newQuiz;     // Return the created quiz object
        } catch (error) {
          console.error("Error inserting quiz:", error);
          return null;        // Return null in case of an error
        }
      }

    async addQuizAnswer(uuidV4, quiz_id, student_id, answers, completed, score) {
        try {
          const newQuizAnswer = await this.quizAnswerModel.create({
            id: uuidV4,       // Set the generated UUID
            quiz_id,           // Insert the quiz_id
            student_id,        // Insert the student_id
            answers,           // Insert the answers
            completed,         // Insert the completed status
            score              // Insert the score
          });

          return newQuizAnswer;     // Return the created quiz answer object
        } catch (error) {
          console.error("Error inserting quiz answer:", error);
          return null;        // Return null in case of an error
        }
      }

    async getQuizAnswer(student_id, quiz_id) {
        try {
          const quizAnswer = await this.quizAnswerModel.findOne({
            where: { quiz_id, student_id }
          });
          if (quizAnswer) {
            return quizAnswer.dataValues;  // Return the raw data
          } else {
            console.log("Quiz answer not found for quiz_id:", quiz_id, "and student_id:", student_id);
            return null;
          }
        } catch (error) {
          console.error("Error fetching quiz answer:", error);
          return null;
        }
      }

      async saveMaterial(materialId, courseId, date, description, file_url, file_type) {
        try {
          // Se il file_url o file_type non sono forniti, saranno null
          const newMaterial = await this.materialModel.create({
            materialId,
            courseId,
            date,
            description,
            file_url: file_url || null,
            file_type: file_type || null
          });
      
          // Restituisce il nuovo materiale
          return newMaterial;
        } catch (error) {
          console.error('Error saving material:', error);
          return null;
        }
      }
      

    async findMaterialsByCourseId(courseId) {
      const materials = await this.materialModel.findAll({
        where: { courseId },
        order: [['date', 'DESC']]
      });
    
      console.log('Materiali trovati per courseId', courseId, ':', materials);
      return materials;
    }

    async findCourseById(courseId) {
      try {
        const course = await this.courseModel.findOne({
          where: { id: courseId },
          attributes: ['student_ids'] // selezioniamo solo ciò che ci serve
        });
        
        // Aggiungi un log per vedere cosa ricevi
    console.log('Course found:', course);
    
    // Se `course` non esiste o `student_ids` è undefined, ritorna un array vuoto
    if (!course || !course.student_ids) {
      console.log('Nessun student_ids trovato per il corso:', courseId);
      return [];
    }

    // Restituisci l'array di student_ids
    return course.student_ids;
  } catch (error) {
    console.error('Error in repo findCourseById:', error);
    throw error;
  }
}

    
} 

module.exports = { CourseRepo };