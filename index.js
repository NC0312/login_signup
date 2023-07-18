import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Connect to MongoDB using async/await syntax
async function connectToDB() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/myDB", {
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


app.listen(9002, () => {
    console.log("Backend Started at 9002");
});
