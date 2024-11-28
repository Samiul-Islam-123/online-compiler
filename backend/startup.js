//this script builds all the Docker images for the project

const {spawn} = require('child_process');
const { resolve } = require('path');

const images = [
    {"tag" : "c-compiler", "path" : "./Compilers/C"},
    {"tag" : "cpp-compiler", "path" : "./Compilers/Cpp"},
    {"tag" : "java-compiler", "path" : "./Compilers/Java"},
    {"tag" : "python-compiler", "path" : "./Compilers/Python"},
    {"tag" : "node-compiler", "path" : "./Compilers/Node"},
];

function BuildDockerImages(tag, filePath){
    return new Promise((resolve, reject) => {
        const command = `docker`;
        const args = ['build', '-t', tag, '-f', `${filePath}/Dockerfile`, filePath];

        console.log("Building Docker image for tag : "+tag+"...");

        const buildProcess = spawn(command, args);

        buildProcess.on('data', (data) => {
            console.log(data.toString());
        })

        // Capture exit code to determine if the build succeeded or failed
        buildProcess.on('close', (code) => {
            if (code === 0) {
                console.log(`Successfully built Docker image: ${tag}`);
                resolve();
            } else {
                console.error(`Failed to build Docker image: ${tag}. Exit code: ${code}`);
                reject(new Error(`Build failed for ${tag}`));
            }
        });
        
    })
}

(async() => {
    console.log("starting...")
    for(const item in images){
        await BuildDockerImages(images[item].tag, images[item].path);
    }
})();