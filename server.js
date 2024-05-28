const app = require("./app");
const { connectDB } = require("./config/database.js");

connectDB();
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Process is online on port number ${port}`);
});
