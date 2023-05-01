const itemsRoutes = require("./routes/itemRoutes");
const coursevilleRoutes = require("./routes/coursevilleRoutes");

const app = express();

app.use("/items", itemsRoutes);
app.use("/courseville", coursevilleRoutes);

module.exports = app;