const { port } = require("./config/env");
const app = require("./app");
const connectDB = require("./config/db");

connectDB();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});