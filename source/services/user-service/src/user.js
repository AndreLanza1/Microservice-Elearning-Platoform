
const Sequelize = require('sequelize');
const bcryptjs = require('bcryptjs');

// Set up the connection to the database
const dbconfig = {
  PostgresURI: 'postgres://user:password@postgres:5432/usersdb'
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

const User = sequelize.define('user', {
  id:{
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false
  },
  username: {
    type: Sequelize.STRING
  },
  role: {
      type: Sequelize.ENUM('teacher', 'student')
    },
  password: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  }
});


// Create a new user for testing
const { v4: uuidv4 } = require('uuid');

sequelize.sync({ force: true }) // if false it will not drop the table if it exists
  .then(() => {
    console.log('Table user ready.');

    // Create the user
    return User.findOrCreate({
      where: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        username: 'testuser'
      },
      defaults: {
      role: 'student',
      password: bcryptjs.hashSync('test@example.com', 10),
      email: 'test@example.com'
      }
    });
  })

  .then(() => {
    console.log('Table user ready.');

    // Create the user
    return User.findOrCreate({
      where: {
        id: '223e4567-e89b-12d3-a456-426614174001',
        username: 'Alice Johnson'
      },
      defaults: {
      role: 'student',
      password: bcryptjs.hashSync('alice.johnson@example.com', 10),
      email: 'alice.johnson@example.com'
      }
    });
  })

  .then(() => {
    console.log('Table user ready.');

    // Create the user
    return User.findOrCreate({
      where: {
        id: '223e4567-e89b-12d3-a456-426614174002',
        username: 'Michael Smith'
      },
      defaults: {
      role: 'student',
      password: bcryptjs.hashSync('michael.smith@example.com', 10),
      email: 'michael.smith@example.com'
      }
    });
  })

  .then(() => {
    console.log('Table user ready.');

    // Create the user
    return User.findOrCreate({
      where: {
        id: '223e4567-e89b-12d3-a456-426614174003',
        username: 'Sophia Williams'
      },
      defaults: {
      role: 'student',
      password: bcryptjs.hashSync('sophia.williams@example.com', 10),
      email: 'sophia.williams@example.com'
      }
    });
  })

  .then(() => {
    console.log('Table user ready.');

    // Create the user
    return User.findOrCreate({
      where: {
        id: '223e4567-e89b-12d3-a456-426614174004',
        username: 'James Brown'
      },
      defaults: {
      role: 'student',
      password: bcryptjs.hashSync('james.brown@example.com', 10),
      email: 'james.brown@example.com'
      }
    });
  })


  .then(() => {
    console.log('Table user ready.');

    // Create the user
    return User.findOrCreate({
      where: {
        id: '223e4567-e89b-12d3-a456-426614174005',
        username: 'Olivia Taylor'
      },
      defaults: {
      role: 'student',
      password: bcryptjs.hashSync('olivia.taylor@example.com', 10),
      email: 'olivia.taylor@example.com'
      }
    });
  })


  .then(() => {
    console.log('Table user ready.');

    // Create the user
    return User.findOrCreate({
      where: {
        id: '223e4567-e89b-12d3-a456-426614174006',
        username: 'Ethan Miller'
      },
      defaults: {
      role: 'student',
      password: bcryptjs.hashSync('ethan.miller@example.com', 10),
      email: 'ethan.miller@example.com'
      }
    });
  })

  .then(() => {
    console.log('Table user ready.');

    // Create the user
    return User.findOrCreate({
      where: {
        id: '223e4567-e89b-12d3-a456-426614174007',
        username: 'Emma Davis'
      },
      defaults: {
      role: 'student',
      password: bcryptjs.hashSync('emma.davis@example.com', 10),
      email: 'emma.davis@example.com'
      }
    });
  })

  .then(() => {
    return User.findOrCreate({
      where: {
        id: '015a5b67-a570-4a7c-8f30-5ce374fac818',
        username: 'Daniel Wilson'
      },
      defaults: {
        role: 'teacher',
        password: bcryptjs.hashSync('teacher@example.com', 10),
        email: 'teacher@example.com'
    }
    });
  })

  .then(() => {
    return User.findOrCreate({
      where: {
        id: 'e1424969-a7d7-4be5-aab4-1a4a36ee80ec',
        username: 'Isabella Martinez'
      },
      defaults: {
        role: 'teacher',
        password: bcryptjs.hashSync('isabella.martinez@example.com', 10),
        email: 'isabella.martinez@example.com'
    }
    });
  })


  .then(([user, created]) => {
    if(created) {
      console.log('User created:', user.toJSON());
    }
    else {
      console.log('User already exists:', user.toJSON());
    }
  })
  .catch(err => {
    console.error('Error creating user:', err);
});

module.exports = User; 


