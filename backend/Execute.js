const path = require('path');
const { spawn } = require('child_process');

async function Run(filePath, image, socket) {
    if (!image) {
        throw new Error('Image is required');
    }

    if(image === 'javascript-compiler'){
        image = 'node-compiler';
    }

    const fileDir = path.dirname(filePath);
    const fileExt = path.extname(filePath).toLowerCase();
    const fileName = path.basename(filePath);

    let command = 'docker';
    let args = [
        'run',
        '-v', `${fileDir}:/app`, // Mount file directory to container
        '-w', '/app', // Set working directory inside the container
        image // Docker image
    ];

    // Handle language logic based on file extension
    if (image.includes('python')) {
        if (fileExt !== '.py') throw new Error('File extension is not valid for Python');
        args.push('python', fileName);
    } else if (image.includes('node')) {
        if (fileExt !== '.js') throw new Error('File extension is not valid for Node.js');
        args.push('node', fileName);
    } else if (image.includes('gcc') || image.includes('c-compiler')) {
        if (fileExt !== '.c') throw new Error('File extension is not valid for C');
        args.push('sh', '-c', `gcc -o main ${fileName} && ./main`);
    } else if (image.includes('g++') || image.includes('cpp-compiler')) {
        if (fileExt !== '.cpp') throw new Error('File extension is not valid for C++');
        args.push('sh', '-c', `g++ -o main ${fileName} && ./main`);
    } else if (image.includes('java')) {
        if (fileExt !== '.java') throw new Error('File extension is not valid for Java');
        args.push('sh', '-c', `javac ${fileName} && java ${fileName.replace('.java', '')}`);
    } else {
        throw new Error(`Unsupported image: ${image}`);
    }

    console.log(`Running Docker command: ${command} ${args.join(' ')}`);

    return new Promise((resolve, reject) => {
        const runProcess = spawn(command, args);

        // Capture stdout
        runProcess.stdout.on('data', (data) => {
            const decodedOutput = new TextDecoder().decode(data);
            socket.emit('code-output', decodedOutput);
        });

        // Capture stderr
        runProcess.stderr.on('data', (data) => {
            const decodedOutput = new TextDecoder().decode(data);
            console.error(`stderr: ${data}`);
            socket.emit('code-error', decodedOutput);
        });

        // Handle process close
        runProcess.on('close', (code) => {
            console.log(`Process exited with code: ${code}`);
            if (code === 0) {
                socket.emit('code-finished', '\nExecution successful');
                resolve('\n\nExecution successful');
            } else {
                socket.emit('code-error', `Execution failed with code: ${code}`);
                reject(new Error(`Execution failed with code: ${code}`));
            }
        });

        // Handle any errors during the spawning process
        runProcess.on('error', (err) => {
            console.error('Error occurred:', err);
            socket.emit('error', err);
            reject(err);
        });

        // Handle user input from the frontend (via socket)
        socket.on('user-input', (input) => {
            if (runProcess.stdin.writable) {
                runProcess.stdin.write(input); // Write user input to stdin of the running process
                socket.emit('code-output', `Input received: ${input}`); // Notify frontend that input was received
            }
        });

        // Emit a prompt to frontend when the process expects input
        runProcess.stdout.on('data', (data) => {
            const decodedOutput = new TextDecoder().decode(data);
            // Check if the output contains a prompt asking for input
            if (decodedOutput.includes("Enter input")) {
                socket.emit('prompt-user-input', 'Please provide input:'); // Emit prompt to frontend
            }
        });
    });
}

module.exports = Run;
