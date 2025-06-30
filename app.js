const express = require('express');
require('dotenv').config()
const TodooRoutes = require('./routes/todooRoutes');
const mongoose = require('mongoose');
// const {User, Task} = require('./models/models')
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);
// const bcrypt = require('bcrypt');

const app = express();
const dbUrl = process.env.MONGODB_URI;

const store = new MongoDBSession({
    uri: dbUrl,
    collection: 'MySessions',
})

mongoose.connect(dbUrl)
    .then(() => {
        console.log('Connected to database!')
        app.listen(3000, (err) => {
            if (err) console.error(err);
            else console.log('Running...');
        });
    })
    .catch((err) => console.error(err));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        secure: false,
        httpOnly: true,
        sameSite: 'lax',
    }
}))
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.set('view engine', 'ejs');

// const isAuth = (req, res, next) => {
//     if(req.session.isAuth) {
//         next();
//     }else {
//         res.redirect('/login');
//     }
// }

app.use('/', TodooRoutes);

// // REGISTER USER
// app.post('/signup', async (req, res) => {
//     req.session.registerAlerts = null;
//     const data = {
//         username: req.body.username,
//         password: req.body.password,
//     }
//     // HASH PASSWORD
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(data.password, saltRounds);
//     data.password = hashedPassword;

//     // CHECK IF USERNAME ALREADY EXISTS 
//     const existingUser = await User.findOne({username: data.username});
//     if (existingUser) {
//         req.session.registerAlerts = 'User already exists. Please choose a different username.';
//         res.redirect('/signup');
//     } else {
//         req.session.registerAlerts = null;
//         const userdata = await User.insertMany(data)
//         console.log(userdata);
//         res.redirect('/login')
//     }
// })

// // LOGIN USER
// app.post('/login', async (req, res) => {
//     try{
//         req.session.loginAlerts = null;
//         // CHECK IF USERNAME ALREADY EXISTS 
//         const checkUser = await User.findOne({username: req.body.username});
//         if (!checkUser) {
//             req.session.loginAlerts = 'Username cannot found!';
//             res.redirect('/login');
//         } else {
//             const checkPassword = await bcrypt.compare(req.body.password, checkUser.password);
//             if (checkPassword) {
//                 req.session.username = req.body.username;
//                 req.session.isAuth = true;
//                 res.redirect('/')
//             } else {
//                 req.session.loginAlerts = 'Incorrect password!';
//                 res.redirect('/login');
//             }
//         }

//     }catch(err){
//         console.log(err);
//     }

// })

// // CREATE TASK
// app.post('/create', (req, res) => {
//     const taskBody = req.body.task
//     const newTask = new Task({body: taskBody, finished: false, user: req.session.username});
//     newTask.save()
//         .then((result) => {
//             res.redirect('/');
//             console.log(result);
//         })
//         .catch((err) => {
//             console.error(err);
//         });
// })

// // DELETE TASK
// app.delete('/delete/:id', (req, res) => {
//     const id = req.params.id;
//     console.log('Deleting: ', id);
//     Task.findByIdAndDelete(id)
//         .then(() => {
//             res.json({redirect: '/'});
//         })
//         .catch((err) => {
//             console.error(err);
//         });
// })

// // UPDATE TASK STATUS
// app.put('/update/:id', (req, res) => {
//     const id = req.params.id;
//     console.log('Updating: ', id);
//     Task.findByIdAndUpdate(id, req.body, {new:true})
//         .then((resp) => {
//             console.info(resp);
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// })

// // HOME PAGE
// app.get('/', isAuth, (req, res) => {
//     if (!req.session.username) {
//         res.redirect('/login')
//     } else {
//         Task.find({user: req.session.username})
//             .then((result) => {
//                 if (result == null) {result = []};
//                 const taskList = result;
//                 res.render('index', {taskList, loginUsername: req.session.username});
//             })
//             .catch((err) => {
//                 console.error(err);
//             })
//     }
// });

// // LOGIN PAGE
// app.get('/login', (req, res) => {
//     res.render('login', {loginAlerts: req.session.loginAlerts});
//     req.session.loginAlerts = null;
// })

// // SIGNUP PAGE
// app.get('/signup', (req, res) => {
//     res.render('signup', {registerAlerts: req.session.registerAlerts});
//     req.session.registerAlerts = null;
// })

// // LOG OUT
// app.get('/logout', (req, res) => {
//     req.session.destroy((err) => {
//         if(err) throw err;
//         res.redirect('/login');
//     })
// })

app.use((req, res) => {
    res.redirect('/');
})