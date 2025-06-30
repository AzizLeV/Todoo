const mongoose = require('mongoose')
const Schema = mongoose.Schema

const taskSchema = new Schema({
    body: {
        type : String,
        required: true,
    },
    finished: {
        type : Boolean,
        required: true
    },
    user: {
        type : String,
        required: true
    }
}, { timestamps: true });

const LoginSchema = Schema({
    username: {
        type : String,
        required: true
    },
    password: {
        type : String,
        required: true
    }
}, { timestamps : true });

const Task = mongoose.model('Task', taskSchema);
const User = mongoose.model('users', LoginSchema);

module.exports = {Task , User}