# Scrum Plan for SPARK 

## Sprint Duration:

Total duration 12 weeks

## Sprint 1: Authentication and Core infrastructure
### Goal:
Set up the basic infrastructure, including the database, authentication system, and user registration/login functionality.
### Sprint Backlog:

#### Set up PostgreSQL database
Initialize DB schema: users, courses, course_materials, notes, quizzes, quizAnswers

Tables if needed must support both professor and student roles.


#### Implement Authentication Service

Build /index.js and src/ folder (route, service, repo layers).
- Add JWT-based login + session handling
- Bcrypt for hashing, Sequelize for ORM
- Role-based access: student or professor

User Stories: 1, 2, 3, 4, 5, 6

#### Develop Frontend for Login and Registration and Profile

Pages: /index, /access, and /personal_page with HTML, CSS, JS
Integrate with Authentication Service (UI adapts based on user role)

User Stories: 7, 8, 9, 10

### Duration: 2 weeks

## Sprint 2: RabbitMQ Integration & Student Service Setup

### Goal: 
Enable inter-service communication and implement student dashboard and note creation features.

### Sprint Backlog:

#### Implement Rabbitmq infrastructure
- Set up rpcQueue for user-service and student-service
- Build producer.js, consumer.js, and service-s.js logic 

User Stories: 18, 11

#### Build Student Service Backend 

Create functionalities for:
- Student homepage
- Note's search
- Personal notes (create/view/delete/upload)

Connect to PostgreSQL through Node.js 

User Stories: 18, 24, 25, 26, 27, 29

#### Student Frontend Development 
Create the public folder (pages: student_home, my_notes, view_note)  
Features:
- Display recent notes
- Add/upload/delete personal notes

User Stories: 18, 24, 25, 26, 27, 29

### Duration: 3 weeks

## Sprint 3: Course Management for Professors & Students
### Goal:
Develop professor course creation flow and student access to courses and course's materials, posts and tests.

### Sprint Backlog:

#### Implement Rabbitmq infrastructure

- Set up rpcQueueC for course <--> student comunication and the rpcQueue for course <--> user comunication 
- Build producer.js, consumer.js, and service-s.js logic 

User Stories: 17, 19

#### Build Course Service Backend

Professors: create/view/search courses, post materials and create quizzes.
Connect to PostgreSQL through Node.js 

User Stories: 11, 12, 13, 14, 17

#### Develope Student-side Course back-end

Students: enroll, unsubscribe, access materials and posts

User Stories: 19, 20, 22, 23, 26, 37


#### Course Frontend Development
Pages: course_home, courses, professor
Features:
- Professors manage course content
- Students browse, filter, and enroll in courses

User Stories: 11, 12, 13, 14, 17, 19, 20, 22, 23, 26, 37

### Duration: 3 weeks

## Sprint 4: Shared Notes, Quizzes & Test Results
### Goal:

Enable collaboration via shared student notes, and implement test-taking, answer-submission and  result-viewing workflows.

### Sprint Backlog:

#### Implement Shared Notes Features

Students can view, search, filter, and save other students’ notes. Course-based filtering and tagging

User Stories: 21, 28, 29, 30, 31, 32

### Complete Quiz Functionality

Students can take quizzes, submit unswers and view results.

Implement move-by-move replay functionality.

User Stories:  33, 34, 35

### Final Frontend Integrations

Pages: all_notes, notes_viewer, quiz_page
Display shared notes and tests with filters, tags, downloads

User Stories: 28, 33, 34, 35

### Duration: 2 weeks


## Sprint 5: Testing, Optimization, and Deployment
### Goal:

Final system testing, container configuration, and deployment-ready state

### Sprint Backlog:

#### End-to-End Testing

Validate workflows for both professors and students. Handle edge cases and authorization errors

User Stories: All

#### Performance Optimization
Comprensive of:
- Database query refinement


User Stories: All

#### Docker deployment and Polish

Docker Compose setup for all containers: user, course, student, postgres, rabbitmq
- Bug fixes & UI improvements

User Stories: All

#### Final Documentation

Write the final README, documentation and architecture diagrams

User Stories: All

### Duration: 2 weeks

