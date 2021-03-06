const express = require("express");
const cors = require('cors');
const app = express();
const spawn  = require('child_process').spawn;

app.use(express.json());
app.use(cors({
    origin:'http://localhost:3000',
}))

app.post('/', async(req,res) => {
    const request = req;
    console.log('\n')
    console.log(request.body);
    var dataToSend
    const runScript = spawn('python3', ['assets/GraphGenerator.py', request.body.start, request.body.dest]);
    runScript.stdout.on('data',  (data) => {
        console.log(typeof(data))
       // console.log(JSON.parse(data)[0]);
        dataToSend = data
    });
    runScript.stderr.on('data', (data) => {
        console.error("U DONE GOOFED")
    });
    runScript.on('close', (code) => {
        const dataArray = JSON.parse(dataToSend)
        res.json(dataArray)
    });
});

app.listen(5000, () => {
    console.log("Listening at http://localhost:5000");
});