
# Microservices Schema

## 1. Course Management Microservice

### Table: courses
| Column       | Type     | Description                                      |
|--------------|----------|--------------------------------------------------|
| id           | UUID     | Primary Key                                      |
| title        | String   | Title of the course                              |
| description  | TEXT     | Description of the course                        |
| professor_id | UUID     | Foreign Key, refers to the professor (User Management) |
| created_at   | TIMESTAMP| Timestamp of course creation                     |

---

### Table: course_materials
| Column       | Type     | Description                                      |
|--------------|----------|--------------------------------------------------|
| id           | UUID     | Primary Key                                      |
| course_id    | UUID     | Foreign Key, refers to the course                |
| title        | String   | Title of the material                            |
| file_url     |          | URL of the file                                  |
| description  | TEXT     | Description of the material                      |
| file_type    | ENUM     | Type of file (pdf, doc, image, video)            |
| uploaded_at  | TIMESTAMP| Timestamp of when the material was uploaded      |

File Types ENUM: ('pdf', 'doc', 'image', 'video')

---

## 2. User Management Microservice

### Table: users
| Column        | Type     | Description                                      |
|---------------|----------|--------------------------------------------------|
| id            | UUID     | Primary Key                                      |
| username      | TEXT     | Username of the user                             |
| email         | TEXT     | Unique email address                             |
| password_hash | TEXT     | Hashed password                                  |
| role          | ENUM     | Role of the user (professor, student)            |
| first_name    | TEXT     | First name of the user                           |
| last_name     | TEXT     | Last name of the user                            |
| created_at    | TIMESTAMP| Timestamp of user creation                       |

Role ENUM: ('professor', 'student')  
NOTA: Capire se fare due tabelle separate per professori e studenti

---

## 3. Student's Microservice

### Table: notes
| Column       | Type     | Description                                      |
|--------------|----------|--------------------------------------------------|
| id           | UUID     | Primary Key                                      |
| student_id   | UUID     | Foreign Key, refers to the student               |
| course_id    | UUID     | Foreign Key, refers to the course                |
| title        | String   | Title of the note                                |
| description  | TEXT     | Description of the note                          |
| file_url     |          | URL of the file                                  |
| file_type    | ENUM     | Type of file (pdf, doc, image)                   |
| uploaded_at  | TIMESTAMP| Timestamp of when the note was uploaded          |

File Types ENUM: ('pdf', 'doc', 'image')

### Table: submissions
| Column        | Type     | Description                                      |
|---------------|----------|--------------------------------------------------|
| student_id    | UUID     | Foreign Key, refers to the student               |
| course_id     | UUID     | Foreign Key, refers to the course                |
| created_at    | TIMESTAMP| Timestamp of user creation                       |

NOTA: Per me possiamo anche non salvare le iscrizioni passate

---

## 4. Assessments Microservice

### Table: quizzes
| Column        | Type     | Description                                      |
|---------------|----------|--------------------------------------------------|
| id            | UUID     | Primary Key                                      |
| course_id     | UUID     | Foreign Key, refers to the course                |
| professor_id  | UUID     | Foreign Key, refers to the professor             |
| title         | TEXT     | Title of the quiz                                |
| description   | TEXT     | Description of the quiz                          |
| question_text | TEXT     | Text of the question                             |
| options       | JSON     | JSON object containing the options               |
| correct_answer| TEXT     | Correct answer                                   |
| created_at    | TIMESTAMP| Timestamp of when the quiz was created           |

---

### Table: quiz_answers
| Column        | Type     | Description                                      |
|---------------|----------|--------------------------------------------------|
| id            | UUID     | Primary Key                                      |
| student_id    | UUID     | Foreign Key, refers to the student               |
| quiz_id       | UUID     | Foreign Key, refers to the quiz                  |
| answers       | JSON     | JSON object containing the student's answers     |
| score         | INT      | Score obtained by the student                    |
| submitted_at  | TIMESTAMP| Timestamp of when the submission was made        |

Answers JSON: Contains the responses from the student

NOTA: La tabella dei quiz dipende anche dall'implementazione
