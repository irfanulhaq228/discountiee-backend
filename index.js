const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./db/db");

const BrandRouter = require("./Routes/BrandRoute");
const PostRouter = require("./Routes/PostRoute");
const { startPostExpirationChecker } = require("./Controllers/PostController");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/uploads', express.static('uploads'));

db;

app.get("/", (req, res) => {
    res.json({ message: "vps_settings_done" });
});

app.use("/api/brand", BrandRouter);
app.use("/api/post", PostRouter);

app.listen(process.env.PORT, '0.0.0.0', () => {
    console.log(`✅ Server runs at port ${process.env.PORT}`);
    startPostExpirationChecker();
});