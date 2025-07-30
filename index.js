const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 5100;

const PostRouter = require("./Routes/PostRoute");
const BrandRouter = require("./Routes/BrandRoute");
const CategoryRouter = require("./Routes/CategoryRoutes");

const { startPostExpirationChecker, startPostActivationChecker } = require("./Controllers/PostController");
const connectDB = require("./db/db");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/uploads', express.static('uploads'));

connectDB();

app.get("/", (req, res) => {
    res.json({ message: "discoutiee-backend-success" });
});

app.use("/api/brand", BrandRouter);
app.use("/api/post", PostRouter);
app.use("/api/category", CategoryRouter);

app.listen(PORT, () => {
    console.log(`✅ Server runs at port ${PORT}`);
    startPostExpirationChecker();
    startPostActivationChecker();
});