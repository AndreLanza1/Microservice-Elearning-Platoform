const Sequelize = require('sequelize');

// Set up the connection to the database
const dbconfig = {
  PostgresURI: 'postgres://user:password@postgres:5432/studentsdb'
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

const Note = sequelize.define('note', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  student_id: {
    type: Sequelize.UUID,
    allowNull: false
  },
  course_id: {
    type: Sequelize.STRING,
    allowNull: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  file_url: {
    type: Sequelize.STRING,
    allowNull: true
  },
  file_type: {
    type: Sequelize.ENUM('pdf', 'doc', 'image'),
    allowNull: true
  },
  professor_name: {
      type: Sequelize.STRING,
      allowNull: true
    },
  tag: {
      type: Sequelize.ENUM('Arts & Design', 'Business & Management','Communication & Media', 'Engineering & Technology','Health & Life Sciences','Humanities','Law & Legal Studies','Mathematical Sciences','Natural Sciences', 'Social Sciences',''),
      allowNull: true
    }
}, {
  timestamps: false
});


const { v4: uuidv4 } = require('uuid');
sequelize.sync({ force: true }) 
.then(() => {
    console.log('Note table ready.');

    // Creation example note
    return Note.findOrCreate({
      where:{
        student_id: '123e4567-e89b-12d3-a456-426614174000',
        id: '987e6543-e21b-45f6-a654-423354174999',
        
         
      },
      defaults: {
        title: 'Example note',
        course_id: 'Programming Fundamentals', 
        description: 'decription.',
        file_url: './uploads/notes.pdf',
        file_type: 'pdf',
        professor_name : 'testuser',
        tag: 'Engineering & Technology',
        uploaded_at: new Date()  
      }
    });
  })

  .then(() => {
    console.log('Note table ready.');

    // Creation example note
    return Note.findOrCreate({
      where:{
        student_id: '123e4567-e89b-12d3-a456-426614174000',
        id: '987e6543-e21b-45f6-a654-423354174992',
        
         
      },
      defaults: {
        title: 'Intro',
        course_id: 'Programming Fundamentals', 
        description: 'decription.',
        file_url: './uploads/notes.pdf',
        file_type: 'pdf',
        professor_name : 'testuser',
        tag: 'Engineering & Technology',
        uploaded_at: new Date()  
      }
    });
  })
  .then(() => {
    console.log('Note table ready.');

    // Creation example note
    return Note.findOrCreate({
      where:{
        student_id: '223e4567-e89b-12d3-a456-426614174001',
        id: '987e6543-e21b-45f6-a654-423354174991',
        
         
      },
      defaults: {
        title: 'Lesson 2',
        course_id: 'Introduction to International Law', 
        description: 'decription.',
        file_url: './uploads/notes.pdf',
        file_type: 'pdf',
        professor_name : 'Alice Johnson',
        tag: 'Law & Legal Studies',
        uploaded_at: new Date()  
      }
    });
  })
   .then(() => {
    console.log('Note table ready.');

    // Creation example note
    return Note.findOrCreate({
      where:{
        student_id: '223e4567-e89b-12d3-a456-426614174001',
        id: '987e6543-e21b-45f6-a654-423354174990',
        
         
      },
      defaults: {
        title: 'Lesson 1',
        course_id: 'Human Anatomy', 
        description: 'decription.',
        file_url: './uploads/notes.pdf',
        file_type: 'pdf',
        professor_name : 'Alice Johnson',
        tag: 'Health & Life Sciences',
        uploaded_at: new Date()  
      }
    });
  })
  .then(([note,created]) => {
    if (created) {
      console.log('Note created:', note.toJSON());
    } else {
      console.log('Note already exists:', note.toJSON());
    }
  })
  .catch(err => {
    console.error('Error creation note:', err);
  });
module.exports = Note; 


