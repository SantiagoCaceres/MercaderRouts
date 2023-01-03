const express=require("express")
const path=require('path')
const morgan=require('morgan')

const router =require('./routes/index.js')

const port=process.env.PORT || 3000;
const indexRoutes=router
const app = express()
app.use(indexRoutes)

app.set('views',path.join(__dirname,'views'))
app.set('view engine', 'ejs')
app.use(indexRoutes)
app.use("/styles",express.static(__dirname + "/styles"));
app.use("/scripts",express.static(__dirname + "/scripts"));
app.listen(port)
console.log('Server on port ', port);

