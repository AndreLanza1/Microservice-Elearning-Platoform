const uuid = require('uuid');

class NoteService{
    constructor(noteRepo){
        this.noteRepo = noteRepo;
    }

    // Function to add a note to the database
    async addNote(req) {
        console.log("Received Request Body:", req.body); // Debugging log

        const { student_id, course_id, title, description, file_url, file_type,professor_name, tag } = req.body;
        const id = require('uuid').v4(); // Generate a UUID for the note

        if (!student_id  || !title || !file_url || !file_type) {
            return { status: 400, message: 'Invalid request: Missing fields' };
        }

        try {
            const note = await this.noteRepo.addNote(id, student_id, course_id, title, description, file_url, file_type,professor_name, tag);
            if (!note) {
                return { status: 500, message: 'Internal server error' };
            }
            return { status: 200, message: 'Note added successfully' };
        } catch (error) {
            console.error('Error adding note:', error);
            return { status: 500, message: 'Internal server error' };
        }
    }
    async deleteNote(req){
        const noteId= req.headers.note_id;
        console.log("Received note_id:", noteId); 
        if(!noteId) {
            return { status: 400, message: 'Missing noteId' };
        }
    
        try {
            const res = await this.noteRepo.deleteNote(noteId);
            return { status: 200, data: res };
        } catch (error) {
            console.error('Error deleting notes for student:', error);
            return { status: 500, message: 'Internal server error' };
        }
    }
    

    // New method to fetch all notes
    async getNotesByStudentId(req) {
   
       const student_id = req.headers.student_id; // Extract student_id from headers
       console.log("Received student_id:", student_id); 
        if(!student_id) {
            console.log("fetch for all notes");
        }
    
        try {
            const notes = await this.noteRepo.getNotesByStudentId(student_id);
            return { status: 200, data: notes };
        } catch (error) {
            console.error('Error fetching notes for student:', error);
            return { status: 500, message: 'Internal server error' };
        }
    }
}


module.exports = {NoteService};
