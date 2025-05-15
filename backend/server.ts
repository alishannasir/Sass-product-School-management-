import app from "./app.js"; // Note the .js extension is required in ESM
import dotenv from "dotenv";
import connectDB from "./src/config/db.config.js"; // Note the .js extension
import chalk from "chalk";

// Configure dotenv
dotenv.config();

const PORT = process.env.PORT || 5000;

// Start the server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(chalk.red.bold.bgGreen.underline.italic(`Server running at port ${PORT}`));
    });
  })
  .catch((err: Error) => {
    console.error(chalk.red.bold(`Database connection failed: ${err.message}`));
    process.exit(1); // Exit the process on failure
  });