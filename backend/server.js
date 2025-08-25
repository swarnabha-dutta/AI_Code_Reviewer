require('dotenv').config();


const app = require("./src/app.js");
// process.env.PORT || 3000
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})