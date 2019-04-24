const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const path = require('path');
const Joi = require('joi'); //package for input valiaction

const db = require("./db");

const collection = "todo";


const schema = Joi.object().keys({ //defining tht TODO is a string and required
    todo: Joi.string().required()
});


app.get('/',(req,res) => { //request and response
    res.sendFile(path.join(__dirname,'index.html'));
});


app.get('/getTodos',(req,res) => {
    db.getDB().collection(collection).find({}) //this returns a cursor, not the documents
        .toArray((err,documents) => {
            if (err)
                console.log(err);
            else {
                console.log(documents);
                res.json(documents); //res.json shows the stuff on the screen
            }
        })
});



app.put('/:id', (req,res) => { //listens for PUT requests where ID is a parameter, then updates a value for this ID
    const todoID = req.params.id;
    const userInput = req.body;

    db.getDB().collection(collection).findOneAndUpdate(
        {_id: db.getPrimaryKey(todoID)},
        {$set: {todo: userInput.todo}},
        {returnOriginal: false}
        ,(err,result) => {
            if (err)
                console.log(err);
            else 
                res.json(result);
            //console.log(req)
        });
})


app.post('/', (req,res,next) => {
    const userInput = req.body;

    console.log(userInput)

    Joi.validate(userInput, schema, (err,result) => {
        if (err) {
            const error = new Error("Invalid input");
            error.status = 400;
            next(error);
        }
        else {

            db.getDB().collection(collection).insertOne(
                userInput
                ,(err,result) => {
                    if (err) {
                        const error = new Error("Failed to insert Todo Document");
                        error.status = 400;
                        next(error);
                    }
                    else 
                        res.json({
                            result: result, 
                            document: result.ops[0],
                            msg: "Successfully inserted Todo-entry",
                            error: null
                        }); //pass the information back to user
                        //
                });
        }
    })


})


app.delete('/:id',(req,res) => {
    const todoID = req.params.id;

    db.getDB().collection(collection).findOneAndDelete(
        {_id: db.getPrimaryKey(todoID)},
        (err,result) => {
            if (err)
                console.log(err);
            else 
                res.json(result);
        }
    )
})


app.use((err,req,res,next) => { //using middleware called "next"
    res.status(err.status).json({
        error: {
            message: err.message
        }
    })
})


db.connect((err) => {
    if (err) {
        console.log('unable to connect DB');
        process.exit(1);
    }
    else {
        app.listen(3000, () => {
            console.log('connected to DB, listening on port 3000');
        })
    }
})