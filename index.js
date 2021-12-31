const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const authRoute = require("./routes/auth")
const staffRoute = require("./routes/staff")
const expenseRoute = require("./routes/expense")
const adminRoute = require("./routes/admin")
const countryRoute = require("./routes/country")
const mongoose = require("mongoose")
const {generateUploadURL} = require("./utilities/s3")


dotenv.config()

const app = express();

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("DB connection successfully");
}).catch((error)=>console.log(error))

app.use(cors());
app.use(express.json());

app.get('/s3Url/:extension',async (req,res)=>{
    const url = await generateUploadURL(req.params.extension);
    res.send({url:url});
})

app.use("/api/v1/auth",authRoute);
app.use("/api/v1/staffs",staffRoute);
app.use("/api/v1/expenses",expenseRoute);
app.use("/api/v1/admin",adminRoute);
app.use("/api/v1/country",countryRoute);
app.listen(process.env.PORT || 5000,()=>{
    console.log("HELLO")
})











