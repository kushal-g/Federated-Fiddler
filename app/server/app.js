const express = require('express')
const terminalTab = require('terminal-tab')
const cors = require('cors')
const app = express()

const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
    cors:{
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

app.use(cors())
app.use(express.json())

app.get("/",(req,res)=>res.send("Backend service is running"))

app.post("/",async (req,res)=>{
    console.log(req.body)
    const { C, batch_size, num_rounds, epochs} = req.body
    terminalTab.open(`conda activate tensorflow && python /Users/kushal/Documents/Work/IISC/federated-fiddler/server.py -n ${num_rounds} -c ${C}`)
    await sleep(5000)
    for(let i=0;i<C;i++){
        terminalTab.open(`conda activate tensorflow && python /Users/kushal/Documents/Work/IISC/federated-fiddler/client.py -b ${batch_size} -e ${epochs}`)
        await sleep(1000)
    }
    res.send("Started")
})

app.post("/result",(req,res)=>{
    console.log(req.body)
    res.send("Got it")
    io.emit("result", req.body);
})

httpServer.listen(8000,()=>console.log("Server running at port 8000"))

io.on("connection", socket => {
    console.log(socket.id)
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }