const { use } = require("./note_route");

class NoteRepo{

    constructor(noteModel){
        this.noteModel = noteModel;
    }

    async addNote(uuidV4, student_id, course_id, title, description, file_url, file_type,professor_name,tag) {
        console.log("AAA",student_id, course_id, title, description, file_url, file_type,professor_name,tag);
        try {
          const newNote = await this.noteModel.create({
            id: uuidV4,       // Set the generated UUID
            student_id,         // Insert the student_id
            course_id,          // Insert the course_id
            title,              // Insert the title
            description,        // Insert the description
            file_url,           // Insert the file_url
            file_type,           // Insert the file_type
            professor_name,
            tag,
          });
          return newNote;     // Return the created note object
        } catch (error) {
          console.error("Error inserting user:", error);
          return null;        // Return null in case of an error
        }
      }

      async getNoteByUser(student_id) {
        try {
          return await this.noteModel.findAll({ where: { student_id } });
      } catch (erUserror) {
          console.error("Error fetching notes for student:", error);
          return [];
      }
    }

    async getNotesByStudentId(student_id) {
      var notes="";
      if(student_id){
         notes = await this.noteModel.findAll({ where: { student_id } });
      }
      else{
        notes = await this.noteModel.findAll();

      }
      if(notes){
        const allDataValues = notes.map(note => note.dataValues);
        console.log(allDataValues);
        return allDataValues;  // Return the raw data
      } else{
          console.log("No notes found for student");
          return null;
      }
    }

    async deleteNote(noteId){
      const res = await this.noteModel.destroy({where: { id: noteId }});
      if(res){
        console.log(res);
        return res;  // Return the raw data
      } else{
          console.log("No notes found for student");
          return null;
      }
    }
    


} 

module.exports = {NoteRepo};