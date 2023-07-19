
const express = require("express");
// import cors from "cors";
const cors = require("cors");
// import mongoose from "mongoose";
const mongoose = require("mongoose");
// import path from "path";
const port=process.env.PORT||9002;
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static(path.join(__dirname, 'frontend', 'build')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
})





mongoose.set('strictQuery', true);

// Connect to MongoDB using async/await syntax
async function connectToDB() {
    try {
        await mongoose.connect("mongodb+srv://Nakul:recipeapp@cluster0.xx7nb6c.mongodb.net/loginsignup?retryWrites=true&w=majority", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("DB connected");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
})

const User = new mongoose.model("User", userSchema);

connectToDB(); // Call the function to connect to the database

//Routes
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });

        if (user) {
            if (password === user.password) {
                res.status(200).send({ success: true, message: "Login Successful", user: user });
            } else {
                res.send({  message: "Username or Password Invalid" });
            }
        } else {
            res.send({ message: "User is not registered" });
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.send({  message: "Internal server error" });
    }
});



app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if the user is already registered
        const userExists = await User.findOne({ email: email });
        if (userExists) {
            return res.send({ message: "User is already registered" });
        }

        // Create a new user and save to the database
        const newUser = new User({ name, email, password });
        await newUser.save();

        res.send({ message: "Successfully Registered" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.send({ message: "Internal server error" });
    }
});


app.listen(port, () => {
    console.log("Backend Started at 9002");
});
