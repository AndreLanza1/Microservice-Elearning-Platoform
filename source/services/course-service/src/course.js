const Sequelize = require('sequelize');

// Set up the connection to the database
const dbconfig = {
  PostgresURI: 'postgres://user:password@postgres:5432/coursesdb'
}

const sequelize = new Sequelize(dbconfig.PostgresURI, {
  dialect: 'postgres'
});
sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.');
})
.catch(err => {
  console.error('unable to connect to database', err);
});

const Course = sequelize.define('course', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  professor_id: {
    type: Sequelize.UUID,
    allowNull: false
  },
  student_ids: {
    type: Sequelize.ARRAY(Sequelize.UUID),
    allowNull: true
  }, 
  professor_name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  tag: {
    type: Sequelize.ENUM('Arts & Design', 'Business & Management','Communication & Media', 'Engineering & Technology','Health & Life Sciences','Humanities','Law & Legal Studies','Mathematical Sciences','Natural Sciences', 'Social Sciences'),
    allowNull: true
  }
}
, {
  tableName: 'courses',
  timestamps: false
});


// Table quiz
const Quiz = sequelize.define('quiz', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true
  },
  course_id: {
    type: Sequelize.UUID,
    allowNull: false
  },
  title: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT
  },
  questions: {
    type: Sequelize.JSONB,
    allowNull: false
  },
});

// Table for quiz answers (submitted by students)
const QuizAnswer = sequelize.define('quiz_answer', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true
  },
  student_id: {
    type: Sequelize.UUID,
    allowNull: false
  },
  quiz_id: {
    type: Sequelize.UUID,
    allowNull: false
  },
  answers: {
    type: Sequelize.JSONB,
    allowNull: false
    // es: { "questionId1": "selectedOption1", ... }
  },
  completed: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  score: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
});


const Material = sequelize.define('course_materials', {
  materialId: {
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false
  },
  courseId: {
    type: Sequelize.UUID,
    allowNull: false
  },
  date: {
    type: Sequelize.DATE,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  file_url: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  file_type:{
    type : Sequelize.ENUM('pdf', 'doc', 'image', 'video'),
    allowNull : true 
  }
});




// Quiz for testing 
const quizzes = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    title: "Introduction to Programming",
    description: "Test your knowledge about basic programming concepts and syntax",
    questions: [
      {
        text: "What does HTML stand for?",
        options: [
          { text: "Hyper Text Markup Language", correct: true },
          { text: "High Tech Multi Language", correct: false },
          { text: "Hyper Transfer Markup Language", correct: false },
          { text: "Home Tool Markup Language", correct: false }
        ]
      },
      {
        text: "Which programming language is known as the 'mother of all languages'?",
        options: [
          { text: "Java", correct: false },
          { text: "C", correct: true },
          { text: "Python", correct: false },
          { text: "JavaScript", correct: false }
        ]
      }
    ],
    completed: false,
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    title: "Database Fundamentals",
    description: "Check your understanding of database concepts and SQL queries",
    questions: [
      {
        text: "What is a primary key?",
        options: [
          { text: "A key that opens the database", correct: false },
          { text: "A column that uniquely identifies each row in a table", correct: true },
          { text: "The first column in any table", correct: false },
          { text: "A mandatory field in SQL", correct: false }
        ]
      },
      {
        text: "Which SQL statement is used to extract data from a database?",
        options: [
          { text: "EXTRACT", correct: false },
          { text: "GET", correct: false },
          { text: "SELECT", correct: true },
          { text: "OPEN", correct: false }
        ]
      },
      {
        text: "What does ACID stand for in database systems?",
        options: [
          { text: "Atomicity, Consistency, Isolation, Durability", correct: true },
          { text: "Atomicity, Confirmation, Isolation, Durability", correct: false },
          { text: "Authentication, Consistency, Integrity, Durability", correct: false },
          { text: "Automated, Consistent, Integrated, Distributed", correct: false }
        ]
      }
    ],
    completed: false,
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    title: "Web Development Basics",
    description: "Test your knowledge of HTML, CSS and JavaScript fundamentals",
    questions: [
      {
        text: "Which CSS property is used to change the text color?",
        options: [
          { text: "text-color", correct: false },
          { text: "font-color", correct: false },
          { text: "color", correct: true },
          { text: "text-style", correct: false }
        ]
      },
      {
        text: "What is the correct JavaScript syntax to change the content of an HTML element with id='demo'?",
        options: [
          { text: "document.getElement('demo').innerHTML = 'Hello';", correct: false },
          { text: "document.getElementById('demo').innerHTML = 'Hello';", correct: true },
          { text: "#demo.innerHTML = 'Hello';", correct: false },
          { text: "document.innerHTML.getElementById('demo') = 'Hello';", correct: false }
        ]
      },
      {
        text: "Which HTML tag is used to create a hyperlink?",
        options: [
          { text: "link", correct: false },
          { text: "a", correct: true },
          { text: "href", correct: false },
          { text: "hyperlink", correct: false }
        ]
      }
    ],
    completed: false,
  }
];


const { v4: uuidv4 } = require('uuid');
// Create the tables if they don't exist (according to the model)
//sequelize.sync({ force: true }) 
sequelize.sync({ force: true }) 

.then(() => {
  console.log('Material table ready.');

  // Creazione esempio Material
  return Material.findOrCreate({
    where: {
      materialId: uuidv4(), // Condizione di ricerca: nuovo id random
    },
    defaults: {
      courseId: '123e4567-e89b-12d3-a456-426614874112',
      date: new Date(),
      description: 'The course will start on Monday, September 23. Please be prepared with the required materials.',
      file_type: 'pdf'
    }
  });
})

.then(() => {
  console.log('Material table ready.');

  // Creazione esempio Material
  return Material.findOrCreate({
    where: {
      materialId: uuidv4(), // Condizione di ricerca: nuovo id random
    },
    defaults: {
      courseId: '123e4567-e89b-12d3-a456-426614874112',
      date: new Date(),
      description: 'Syllabus and course outline for Programming Fundamentals.',
      file_url: './uploads/intro_123.pdf',  
      file_type: 'pdf'
    }
  });
})


.then(() => {
  console.log('Course table ready.');

  // Creation example course
  return Course.findOrCreate({
    where:{
      id: '987e6543-e21b-45f6-a654-423354174999',
        
    },
    defaults: {
      title: 'World History: Ancient Civilizations',
      professor_id: 'e1424969-a7d7-4be5-aab4-1a4a36ee80ec', 
      description: 'Discover the rise and fall of early civilizations around the globe.',
      student_ids: [
        '123e4567-e89b-12d3-a456-426614174000',
        '223e4567-e89b-12d3-a456-426614174001',
      ],
      professor_name: 'Isabella Martinez',
      tag: 'Humanities'
      
    }
  }); 
})

.then(() => { 
  // Arts & Design
  return Course.findOrCreate({
    where: {
      id: '123e4567-e89b-12d3-a456-426614874112',
    },
    defaults: {
      title: 'Programming Fundamentals',
      professor_id: 'e1424969-a7d7-4be5-aab4-1a4a36ee80ec',
      description: 'Learn the fundamentals of programming using Python.',
      student_ids: [
        '123e4567-e89b-12d3-a456-426614174000',
        '223e4567-e89b-12d3-a456-426614174001',
        '223e4567-e89b-12d3-a456-426614174002',
        '223e4567-e89b-12d3-a456-426614174003',
        '223e4567-e89b-12d3-a456-426614174004',
        '223e4567-e89b-12d3-a456-426614174005',
        '223e4567-e89b-12d3-a456-426614174006',
        '223e4567-e89b-12d3-a456-426614174007',
      ],
      professor_name: 'Isabella Martinez',
      tag: 'Engineering & Technology'
    }
  });
})
.then(() => { 
  // Business & Management
  return Course.findOrCreate({
    where: {
      id: '123e4567-e89b-12d3-a456-426614874113',
    },
    defaults: {
      title: 'Principles of Marketing',
      professor_id: 'e1424969-a7d7-4be5-aab4-1a4a36ee80ec',
      description: 'Explore core marketing concepts and strategies.',
      student_ids: [
        '123e4567-e89b-12d3-a456-426614174000',
      ],
      professor_name: 'Isabella Martinez',
      tag: 'Business & Management'
    }
  });
})
.then(() => { 
  // Communication & Media
  return Course.findOrCreate({
    where: {
      id: '123e4567-e89b-12d3-a456-426614874114',
    },
    defaults: {
      title: 'Media and Society',
      professor_id: 'e1424969-a7d7-4be5-aab4-1a4a36ee80ec',
      description: 'Analyze the role of media in shaping public opinion.',
      student_ids: [
        '123e4567-e89b-12d3-a456-426614174000',
      ],
      professor_name: 'Isabella Martinez',
      tag: 'Communication & Media'
    }
  });
})
.then(() => { 
  // Health & Life Sciences
  return Course.findOrCreate({
    where: {
      id: '123e4567-e89b-12d3-a456-426614874115',
    },
    defaults: {
      title: 'Human Anatomy',
      professor_id: '015a5b67-a570-4a7c-8f30-5ce374fac818',
      description: 'Study the structure and function of the human body.',
      student_ids: [
        '123e4567-e89b-12d3-a456-426614174000',
      ],
      professor_name: 'Daniel Wilson',
      tag: 'Health & Life Sciences'
    }
  });
})
.then(() => { 
  // Law & Legal Studies
  return Course.findOrCreate({
    where: {
      id: '123e4567-e89b-12d3-a456-426614874116',
    },
    defaults: {
      title: 'Introduction to International Law',
      professor_id: '015a5b67-a570-4a7c-8f30-5ce374fac818',
      description: 'Learn the basics of treaties, human rights, and global law systems.',
      student_ids: [
        '123e4567-e89b-12d3-a456-426614174000',
      ],
      professor_name: 'Daniel Wilson',
      tag: 'Law & Legal Studies'
    }
  });
})



.then(([course,created]) => {
  if (created) {
    console.log('Course created:', course.toJSON());
  } else {
    console.log('Course already exists:', course.toJSON());
  }
})


// Create the quizzes and questions
.then(() => {
  console.log('DB sincronizzato, creazione quiz in corso...');

  const courseId = '123e4567-e89b-12d3-a456-426614874112'; // collegati tutti a questo corso

  return Promise.all(
    quizzes.map(quiz =>
      Quiz.findOrCreate({
        where: { id: quiz.id },
        defaults: {
          course_id: courseId,
          title: quiz.title,
          description: quiz.description,
          questions: quiz.questions
        }
      })
    )
  );
})
.then(() => {
  console.log('Quiz data seeded successfully.');
})
.catch(err => {
  console.error('Error :', err);
});


module.exports = {
  Course,
  Quiz,
  QuizAnswer, 
  Material
};
