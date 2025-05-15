const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://irfanulhaq228:personal@personal.mckn1ni.mongodb.net/Discountiee", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("✅ MongoDB Connected!");
    })
    .catch((error) => {
        console.error("❌ MongoDB connection failed:", error.message);
    });

module.exports = mongoose;