const fs = require('fs');
const express = require('express');
const app = express();
const http = require('http');
const Server = http.createServer(app);
const SocketIO = require('socket.io');
const io = SocketIO(Server, {
    cors : {
        origin: "*",
    }
});
const path = require('path');
const Run = require('./Execute');
const { spawn } = require('child_process');


app.get("/", (req,res) => {
    res.send("Just for testing...");
});

const PORT = process.env.PORT || 5500;

const extensions = [
    {"language" : "c", "ext" : ".c"},
    {"language" : "cpp", "ext" : ".cpp"},
    {"language" : "java", "ext" : ".java"},
    {"language" : "python", "ext" : ".py"},
    {"language" : "javascript", "ext" : ".js"},
]

async function ExecuteCode(userID, language, code, socket){
    if(!fs.existsSync('temp')){

        fs.mkdir('temp', (error)=>{
            if(error) console.log(error);
        });
    }

    const match = extensions.find(item=> item.language === language);
    const extension = match ? match.ext : null

    //creating unique file name
    let filename;
    if(language != 'java'){
        filename = userID + extension
    }

    else
        filename = 'Main.java'
    
    //saving it into temp dir
    fs.writeFileSync('temp/' + filename, code, (error)=>{
        if(error){
            console.log(error);
            throw error
        }
    })
    console.log(path.join(__dirname, 'temp', filename), `${language}-compiler`)
    //await Run(path.join(__dirname, 'temp', filename, `${language}-compiler`))
    await Run(path.join(__dirname, 'temp', filename), `${language}-compiler`, socket);
    fs.unlink('temp/' + filename, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
        } else {
            console.log('File deleted successfully');
        }
    });
    
}

io.on('connection', (socket) => {
    console.log('a new client connected');

    socket.on('code',async (data) => {
        //console.log(data);
        await ExecuteCode(socket.id, data.language, data.code, socket)
    });

    socket.on('disconnect', () => {
        console.log("User disconnected, ID : "+socket.id);
    })
})

Server.listen(PORT, () => {
    console.log("Server is running on PORT : "+PORT);
})