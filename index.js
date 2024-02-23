const express = require('express');

const hbs = require('hbs');
const path = require('path');
const mongoose = require('mongoose');

const cookieParser=require('cookie-parser');

const venderRouter=require('./routes/vender')
const userRouter=require('./routes/user')
const adminRouter=require('./routes/admin')



const app = express();
const port = 3006;


app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/user',userRouter);
app.use('/vender',venderRouter)
app.use('/admin', adminRouter);


// mongoose
//     .connect("mongodb://localhost:27017/data")
//     .then(() => {
//         console.log("MongoDB connected");
//     })
//     .catch((error) => {
//         console.error("Failed to connect to MongoDB:", error);
//     });


// Connection URI with database name

const uri = 'mongodb+srv://anurag:uZ3b7uWu5E5C1Rk8@cluster0.9mscwvc.mongodb.net/data';
mongoose.connect(uri, {

  })
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



