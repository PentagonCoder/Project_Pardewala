import dotenv from 'dotenv'
dotenv.config()

import connectDB from './db/index.js'
import { app } from './app.js' 


connectDB()
.then(()=> console.log("Connected to MongoDB"))
.then(() => {
    app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}!`)
    })
})
.catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1); // Exit the application if the database connection fails
});
