const express = require('express');
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note")
const { body, validationResult } = require('express-validator');


//ROUTE-1 fetch all notes login requried 
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {

        const notes = await Note.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {    
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
})

//ROUTE-2 create a new note login requried 
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Enter a proper description').isLength({ min: 10 }),
], async (req, res) => {
    try {

        const { title, description, tag } = req.body;
        // if errors are there return bad request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save()
        res.json(savedNote)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
})


//ROUTE-edit create a new note login requried 
router.put('/updatenote/:id', fetchuser, async (req, res) => {
const {title,description,tag}=req.body
//create new note object
const newNote={};
if(title){newNote.title=title};
if(description){newNote.description=description};
if(tag){newNote.tag=tag};

// find the note to be updated and update it 
let note=await Note.findById(req.params.id);
if(!note){ return res.status(404).send("Not Found")}
if(note.user.toString() !==req.user.id){
    return res.status(401).send("Not Allowed")
}

note= await Note.findByIdAndUpdate(req.params.id,{$set: newNote}, {new:true})
res.json({note});
})

//ROUTE-4 delte a note login requried 

router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    const {title,description,tag}=req.body
    
    // find the note to be updated and update it 
    let note=await Note.findById(req.params.id);
    if(!note){ return res.status(404).send("Not Found")}
    if(note.user.toString() !==req.user.id){
        return res.status(401).send("Not Allowed")
    }
    
    note= await Note.findByIdAndDelete(req.params.id)
    res.json({"sucess":"note has been deleted ",note: note});
    })
module.exports = router