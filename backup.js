const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const app = express();
const dbUrl = 'mongodb+srv://Aziz:test.1234@nodecrs.yzpfdxa.mongodb.net/Todoo?retryWrites=true&w=majority&appName=nodecrs'

mongoose.connect(dbUrl)
    .then(() => {
        console.log('Connected to database!')
        app.listen(3000, (err) => {
            if (err) console.error(err);
            else console.log('Running...');
        });
    })
    .catch((err) => console.error(err));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.set('view engine', 'ejs');

const taskSchema = new mongoose.Schema({
    body: {
        type : String,
        required: true,
    },
    finished: {
        type : Boolean,
        required: true
    }
}, { timestamps: true });

const LoginSchema = mongoose.Schema({
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

// REGISTER USER
let registerAlerts;
app.post('/signup', async (req, res) => {
    registerAlerts = null;
    const data = {
        username: req.body.username,
        password: req.body.password,
    }
    // HASH PASSWORD
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);
    data.password = hashedPassword;

    // CHECK IF USERNAME ALREADY EXISTS 
    const existingUser = await User.findOne({username: data.username});
    if (existingUser) {
        registerAlerts = 'User already exists. Please choose a different username.';
        res.redirect('/signup');
    } else {
        registerAlerts = null;
        const userdata = await User.insertMany(data)
        console.log(userdata);
        res.redirect('/login')
    }
})

// LOGIN USER
let loginAlerts;
app.post('/login', async (req, res) => {
    try{
        loginAlerts = null;
        // CHECK IF USERNAME ALREADY EXISTS 
        const checkUser = await User.findOne({username: req.body.username});
        if (!checkUser) {
            loginAlerts = 'Username cannot found!';
            res.redirect('/login');
        } else {
            const checkPassword = await bcrypt.compare(req.body.password, checkUser.password);
            console.log(checkPassword)
            if (checkPassword) {
                res.redirect('/')
            } else {
                loginAlerts = 'Incorrect password!';
                res.redirect('/login');
            }
        }

    }catch(err){
        console.log(err);
    }

})

// CREATE TASK
app.post('/create', (req, res) => {
    const taskBody = req.body.task
    const newTask = new Task({body: taskBody, finished: false});
    newTask.save()
        .then((result) => {
            res.redirect('/');
            console.log(result);
        })
        .catch((err) => {
            console.error(err);
        });
})

// DELETE TASK
app.delete('/delete/:id', (req, res) => {
    const id = req.params.id
    console.log('Deleting: ', id)
    Task.findByIdAndDelete(id)
        .then(() => {
            res.json({redirect: '/'});
        })
        .catch((err) => {
            console.error(err);
        });
})

// UPDATE TASK STATUS
app.put('/update/:id', (req, res) => {
    const id = req.params.id;
    console.log('Updating: ', id);
    Task.findByIdAndUpdate(id, req.body, {new:true})
        .then((resp) => {
            console.info(resp);
        })
        .catch((err) => {
            console.log(err);
        });
})

// HOME PAGE
app.get('/', (req, res) => {
    Task.find()
        .then((result) => {
            const taskList = result;
            res.render('index', {taskList});
        })
        .catch((err) => {
            console.error(err);
        })
});

// LOGIN PAGE
app.get('/login', (req, res) => {
    res.render('login', {loginAlerts});
    loginAlerts = null;
})

// SIGNUP PAGE
app.get('/signup', (req, res) => {
    res.render('signup', {registerAlerts});
    registerAlerts = null;
})