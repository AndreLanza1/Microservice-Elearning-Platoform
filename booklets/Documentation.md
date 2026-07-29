# SYSTEM DESCRIPTION:
Our project is about building a user-friendly educational platform that streamlines course management, content sharing, and assessments for professors and students. It allows professors to create courses, upload materials, and design quizzes, while students can access resources, take tests, and share their own notes within a collaborative learning environment.

# USER STORIES:
### Registration, Authentication, Profile Management, and Logout
1. As a user I want to view the home page, So that I can select a role
2. As a user I want to view the access page, So that I can select login or signup.
3. As a professor, I want to Register in the site, So that I can have an account as a professor
4. As a student, I want to Register in the site, So that I can have an account as a student
5. As a professor, I want to Login in the site, So that I can use the functionality of the site as a professor
6. As a Student, I want to Login in the site, So that I can use the functionality of the site as a student
7. As a professor, I want to access my profile, So that I can view my account
8. As a student, I want to access my profile, So that I can view my account
9. As a student, I want to Logout from the site, So that I can end my session
10. As a professor, I want to Logout from the site, So that I can end my session


11. As a professor, I want to create a new course, So that I can publish new materials
12. As a professor, I want to add a new post to my courses, So that I can share an announcement or material with my students
13. As a professor, I want to view all my courses, So that I can manage them
14. As a professor, I want to search my courses by their name, So that I can find them quick
15.  As a professor, I want to create a test for my course, So that the students can assess their knowledge
16.  As a professor, I want to view the tests I created, So that I can manage them
17.  As a professor, I want to view the students enrolled in my courses, So that I can check who is enrolled

18. As a student, I want to acces to my home page, So that I can see the last notes created and the last courses I enrolled in
19. As a student, I want to view the courses I'm enrolled in, So that I can access the materials and assignments
20. As a student, I want to search the courses I'm enrolled in by their name, So that I can find them quickly
21. As a student, I want to search for a new course by its name or by its professor, So that I can enroll in it
22. As a student, I want to view the materials shared by my professors, So that I can study them
23. As a student, I want to view the posts made by my professors, So that I can stay updated on course announcements
24. As a student, I want to create new notes, So that I can keep track of important information
25. As a student, I want to delete my notes, So that i don't see them when I don't need them anymore
26. As a student, I want to view the notes I created, So that I can review important information
27. As a student, I want to download the my notes attachment, So I can store them locally
28. As a student I want to view all the notes created by other students, So that I can learn from their insights
29. As a student, I want to serch my notes by their name, So that I can find them quickly
30. As a student, I want to filter the other students notes by the course they are related to, So that I can find them quickly
31. As a student, I want to search the notes created by other students by their course tag, So that I can find them quickly
32. As a student, I want to add the notes created by other students by their course tag, So that I can store them in my notes page
33. As a student, I want to view the tests created by my professors, So that I can prepare for them
34. As a student, I want to do the tests, So that I can assess my understanding of the material
35. As a student, I want to view the results of my tests, So that I can track my progress
36. As a student, I want to enroll in a course, So that I can view all posts and take the tests
37. As a student, I want to unsubscribe from a course, So that I can no longer view the posts and take the tests

# CONTAINERS:

## CONTAINER_NAME: postgres

### DESCRIPTION:
The postgres container runs a PostgreSQL instance that serves as the central storage for all persistent data in the educational platform. It supports all microservices by managing structured information related to users, courses, teaching materials, notes, and assessments. The database includes initialized tables for user accounts, course content, student notes, and quiz results. 

### USER STORIES:

### PORTS:
PostgreSQL default port: 5432 

### PERSISTENCE EVALUATION
The postgres container requires persistent storage to manage and maintain essential user-related data for both students and professors. It ensures data consistency and availability for both professors and students, and is accessed by the platform's various microservices to enable secure data retrieval, updates, and storage.

### EXTERNAL SERVICES CONNECTIONS
The postgres container does not connect to external services.

### MICROSERVICES:

#### MICROSERVICE: PostgreSQL Databases
- TYPE: backend
- DESCRIPTION:  Manages persistent storage of data for the application
- PORTS: 5432
- TECHNOLOGICAL SPECIFICATION:
- SERVICE ARCHITECTURE: three db (...)
- DB STRUCTURE:

**_courses_** :	| **_id_** | title | professor_id | student_ids | professor_name | tag | timestamps | created_at |

**_users_** :	| **_id_** | username | role | password | email | prof_name | created_at |

**_notes_** :	| **_id_** | student_id | course_id | title | file_url | file_type | student_name | tag | timestamps | created_at |

**_quizzes_** :	| **_id_** | course_id | title | description | questions  | created_at |

**_quizAnswers_** :	| **_id_** | student_id | quiz_id | answers | completed  | score | created_at |

**_course_materials_** :	| **_materialId_** | courseId | date | description | file_url  | file_type | created_at |

## CONTAINER_NAME: user-service

### DESCRIPTION:
The user-service container is responsible for handling all operations related to user accounts and authentication. It manages the lifecycle of both student and professor profiles, including registration, login, and role assignment. This service securely stores user credentials, generates and validates authentication tokens, and enforces role-based access control throughout the platform. 

### USER STORIES:
1,2,3,4,5,6,7,8,9,10

### PORTS:
8080:8080

### PERSISTENCE EVALUATION
The user-service container does not handle data persistence internally; instead, it depends on the postgres container to store and manage all persistent user data.

### EXTERNAL SERVICES CONNECTIONS
The user-service container does not connect to external services.

### MICROSERVICES:

#### MICROSERVICE: User management
- TYPE: backend
- DESCRIPTION: Handles user authentication, including login and token validation
- PORTS: 8080
- TECHNOLOGICAL SPECIFICATION: Built with Node.js, the microservice uses Express.js for routing, Sequelize for database interaction, JWT for authentication, bcrypt for password hashing, and dotenv for environment config. Communication between services is handled via RabbitMQ.
- SERVICE ARCHITECTURE: It resides in the user-servis folder with a structured src/ directory containing route (*_route.js), service (*_service.js), repository (*_repo.js), and model (*.js) files. The rabbitmq/ folder handles inter-service messaging. Core files include index.js, config.js, Dockerfile, and package.json.
- - ENDPOINT:
  | HTTP METHOD | URL | Description | User Stories |
	| ----------- | --- | ----------- | ------------ |
    | POST | /signup | register a new user | 2, 3 |
    | POST | /login | access a registered user | 4, 5 |
    | POST | /index | allows the user to access the home page | 1 |
    | POST | /logout | logout a user | 9, 10 |
    | GET | /userData | returns the user's username, email and role | 6, 7 |
    | GET | /personalData | allows the user to access the personal page | 6, 7 |
    | GET | /access | allows the user select a role | 2 |

#### MICROSERVICE: User frontend
- TYPE: frontend
- DESCRIPTION: Serves HTML, CSS, and JavaScript files that make up the client-side interface for user registration, login, and navigation based on user roles (student or teacher).
- PORTS: 8080
- TECHNOLOGICAL SPECIFICATION:
	- Languages: HTML, CSS, Javascript
	- Server: Node.js (used for serving static files and enabling communication with backend services)
- SERVICE ARCHITECTURE: The frontend consists of static HTML, CSS, and JavaScript files served by the user-service backend. It uses form-based submissions for signup and login. Role-based redirects and UI toggles are managed via JavaScript and session storage.
- PAGES:
	Name|Description|Related Microservice|User Stories
	---|---|---|---
	Index|Home page of the website it leads to student/teacher login/signin | Authentication service|1, 
	Access|Page for registering or loggin in |PostgreSQL Database, Autntication Serhevice| 2, 3, 4, 5, 6
	Personal_page|Page for viewing personal information|PostgreSQL Database, Autntication Serhevice|7, 8

## CONTAINER_NAME: student-service
### DESCRIPTION:
The student-service container is responsible for managing all operations related to the student experience on the platform. It handles the retrieval and interaction with courses, notes, tests, and learning materials. This service allows students to view and search their enrolled courses, access course materials and announcements, and engage with professor-shared content. It supports the creation and management of personal notes, as well as viewing and filtering notes created by peers. Additionally, the student-service facilitates access to assigned tests, submission of quiz responses, and viewing quiz results—empowering students to monitor their academic progress effectively.

### USER STORIES:
18,19,24,25,26,27,28,29,30,31,32

### PORTS:
7070:7070

### PERSISTENCE EVALUATION
The student-service container does not handle data persistence internally; instead, it depends on the postgres container to store and manage all persistent user data.

### EXTERNAL SERVICES CONNECTIONS
The student-service container cdoes not connect to external services.

### MICROSERVICES:

#### MICROSERVICE: Student management
- TYPE: backend
- DESCRIPTION:The Student Service is responsible for managing all operations related to student data. This includes notes creation, notes sharing etc..
- PORTS: 7070
- TECHNOLOGICAL SPECIFICATION: Built with Node.js, the microservice uses Express.js for routing, Sequelize for database interaction. RabbitMQ for inter-service communication. Supports role-based access
- SERVICE ARCHITECTURE: it resides int the student-service folder with a structured src/ directory containing route (*_route.js), service (*_service.js), repository (*_repo.js), and model (*.js) files. The rabbitmq/ folder handles inter-service messaging. Core files include index.js, config.js, Dockerfile, and package.json.
- ENDPOINT:
  | HTTP METHOD | URL | Description | User Stories |
	| ----------- | --- | ----------- | ------------ |
    | POST | /addNote | inserts a new note | 24 |
    | POST | /getUsername | gets student's information | 18, 19, 20 |
    | POST | /getCourses | gets the student's course information | 20, 21 |
    | POST | /upload | allows the student to add the his files to the a notes | 24 |
    | GET | /my_note | allows the student to view all his notes | 26 |
    | GET | /getNotes | fetches the student's notes | 26, 28, 29, 30 |
    | GET | /deleteNote | deletes the note | 25 |
    | GET | /getStudentPage | allows the student to access the student page from another service | 18 |
    | GET | /home | allows the student to view the student home | 18 |

#### MICROSERVICE: student frontend
- TYPE: frontend
- DESCRIPTION: Serves HTML, CSS, and JavaScript files that make up the client-side interface for student management, notes' creation etc.
- PORTS: 7070
- TECHNOLOGICAL SPECIFICATION:
	- Languages: HTML, CSS, Javascript
	- Server: Node.js (used for serving static files and enabling communication with backend services)
- SERVICE ARCHITECTURE: The frontend consists of static HTML, CSS, and JavaScript files served by the student-service backend. All js, html, css files are the public folder tougether with the folder for the student's note attached files. 
- PAGES:
	Name|Description|Related Microservice|User Stories
	---|---|---|---
  Student_home|Home page of the website it leads to student/teacher login/signin |PostgreSQL Database, Student Service|18, 19, 27, 
	My_notes|Page for registering or loggin in |PostgreSQL Database, Student Service| 24, 25, 27,29
	All_notes|Page for viewing personal information|PostgreSQL Database, Student Service| 28, 30, 31, 32
	Notes_viewer|Page for registering or loggin in |PostgreSQL Database, Student Service| 26


## CONTAINER_NAME: course-service
### DESCRIPTION:
The Course Service is a backend microservice responsible for managing all aspects of course-related data and operations. It enables professors to create, update, and organize their courses, including metadata like titles, descriptions, categories, prerequisites, and structure. It provides functions for listing available courses to students and serves as a central point of coordination for other services (e.g., content management, student courses, quizes) that rely on course data.

### USER STORIES:
11,12,13,14,15,16,17,19,20,21,22,23,33,34,35,36  

### PORTS:
6060:6060

### PERSISTENCE EVALUATION
The course-service container does not handle data persistence internally; instead, it depends on the postgres container to store and manage all persistent user data.

### EXTERNAL SERVICES CONNECTIONS
The course-service container does not connect to external services.

### MICROSERVICES:

#### MICROSERVICE: User management
- TYPE: backend
- DESCRIPTION:The Course Service is responsible for managing all operations related to professors and the courses data. This includes creation of courses, course enrollments etc..
- PORTS: 6060
- TECHNOLOGICAL SPECIFICATION: Built with Node.js, the microservice uses Express.js for routing, Sequelize for database interaction. RabbitMQ for inter-service communication. Supports role-based access
- SERVICE ARCHITECTURE: it resides int the course-service folder with a structured src/ directory containing route (*_route.js), service (*_service.js), repository (*_repo.js), and model (*.js) files. The rabbitmq/ folder handles inter-service messaging. Core files include index.js, config.js, Dockerfile, and package.json.
- ENDPOINT:
  | HTTP METHOD | URL | Description | User Stories |
	| ----------- | --- | ----------- | ------------ |
    | POST | /addCourse | inserts a new course | 11 |
    | POST | /addStudentToCourse | gets student's information | 36 |
    | POST | /getUsername | gets student's information | 36 |
    | POST | /getUsernames | gets student's information | 17 |
    | POST | /addQuiz | allows the professor to add a quiz | 15 |
    | POST | /publishMaterial | add a new post | 12 |
    | POST | /addQuizAnswer | allows the student to view the student home | 12 |
    | POST | /subscribeToCourse | allows the student to view the student home | 36 |
    | POST | /unsubscribeFromCourse | allows the student to view the student home | 37 |
    | POST | /upload | allows the professor to add the his files to an posts | 12 |
    | GET | /CoursesPage | allows the student to view all his notes | 19 |
    | GET | /getCoursesBySearch | fetches the student's courses | 20, 21 |
    | GET | /CoursePage | allows the professor to view the professor home | 13 |
    | GET | /getCoursesByStudentId | allows the student to access the student page from another service | 19 |
    | GET | /getCourses | gets the professor's courses information |  13  |
    | GET | /home | allows the professor to view the professor home | 13 |
    | GET | /QuizPage | allows the user's to view the quizzes | 34, 16 |
    | GET | /getQuizAnswer | allows the student to view the student home | 35 |
    | GET | /getQuizzes | allows the user to retieve the quizzes' information  | 34, 16 |
    | GET | /getStudentsByCourseID/:courseId | 17 |
    | GET | /by-course-id/:courseId | allows the student to view the student home | 12 |
  

#### MICROSERVICE: course frontend
- TYPE: frontend
- DESCRIPTION: Serves HTML, CSS, and JavaScript files that make up the client-side interface for course management, quiz/post creation, course enrollment .
- PORTS: 6060
- TECHNOLOGICAL SPECIFICATION:
	- Languages: HTML, CSS, Javascript
	- Server: Node.js (used for serving static files and enabling communication with backend services)
- SERVICE ARCHITECTURE: The frontend consists of static HTML, CSS, and JavaScript files served by the course-service backend. All js, html, css files are the public folder tougether with the folder for the student's note attached files. 
- PAGES:
	Name|Description|Related Microservice|User Stories
	---|---|---|---
  Course_home| course home page shows posts, tests and enroled students |PostgreSQL Database, Course Service| 12, 15, 16, 17, 22, 23, 33, 34 
	Courses| all courses page for student |PostgreSQL Database, Student Service| 19, 20, 21  
	Professor| professor's home page, where he can view its courses |PostgreSQL Database, Course Service| 11, 13, 14, 36, 37



## CONTAINER_NAME: RabbitMq

### DESCRIPTION: 
Provides a single Point of Access for all the incoming requests

### USER-STORIES:

### PORTS: 
- 5672:5672  
- 15672:15672

### DESCRIPTION:
RabbitMQ is a reliable and mature messaging and streaming broker

### PERSISTANCE EVALUATION
The rabbitMq container does not include a database.

### EXTERNAL SERVICES CONNECTIONS
The rabbitMq container does not connect to external services.

#### MICROSERVICE: middleware
- TYPE: intermediary
- DESCRIPTION: This microservice acts as an intermediary, enabling other containers to communicate and exchange messages asynchronously.
- PORTS: 5672 (AMQP port), 15672 (port for the management plugin)

