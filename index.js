const express = require('express');

const hbs = require('hbs');
const path = require('path');
const mongoose = require('mongoose');

const cookieParser=require('cookie-parser');

const adminRouter=require('./routes/admin')
const userRouter=require('./routes/user')


const app = express();
const port = 3004;


app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/user',userRouter);
app.use('/admin',adminRouter)

mongoose
    .connect("mongodb://localhost:27017/data")
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.error("Failed to connect to MongoDB:", error);
    });


app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'img')));
app.use(express.static(path.join(__dirname, 'lib')));
app.use(express.static(path.join(__dirname, 'js')));
app.use(express.static(path.join(__dirname, 'models')));
app.use(express.static(path.join(__dirname, 'controllers')));
app.use(express.static(path.join(__dirname, 'routes')));






app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});



