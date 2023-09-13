const express = require('express');
const connectDB = require('./config/dbConnection');
const dotenv = require('dotenv').config();
const contactRoutes = require("./routes/contactRoutes");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require('./middleware/errorhandler');

connectDB();
const app = express();
const port = process.env.PORT || 5000;
app.use(express.json()); //in built parser to parse req.body

app.use("/api/contacts", contactRoutes);
app.use("/api/users", userRoutes);

app.use(errorHandler);
app.listen(port, () => {
    console.log(`server is running on ${port}`);
});