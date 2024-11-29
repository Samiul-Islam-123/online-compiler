import React, { useState, useEffect } from 'react';
import { Input, Button } from 'antd';
import { useSocket } from '../Contexts/SocketContext'; // Assuming socket context is used
import {useData} from "../Contexts/DataContext"

const { TextArea } = Input;

function CodeOutput() {
  const {currentOutput, setCurrentOutput, setRunning} = useData();
  const [inputPrompt, setInputPrompt] = useState(''); // Input prompt message
  const [userInput, setUserInput] = useState(''); // User's input
  const { socket } = useSocket(); // Access the socket from context

  // Listen for socket events
  useEffect(() => {
    socket.on('code-output', (output) => {
      setRunning(false)
      setCurrentOutput((prevOutput) =>'\n'+ prevOutput + output); // Append output
    });

    socket.on('code-error', (err) => {
      setRunning(false)

      setCurrentOutput((prevOutput) => prevOutput + err); // Append error messages
    });

    socket.on('code-finished', (output) => {
      setRunning(false)

      setCurrentOutput((prevOutput) => prevOutput + output); // Append success message
    });

    socket.on('err', (err) => {
      setCurrentOutput((prevOutput) => prevOutput + err); // Handle backend errors
    });

    socket.on('prompt-user-input', (message) => {
      console.log(message)
      setInputPrompt(message); // Show input prompt
    });

    return () => {
      // Clean up listeners
      socket.off('code-output');
      socket.off('code-error');
      socket.off('code-finished');
      socket.off('err');
      socket.off('prompt-user-input');
    };
  }, [socket]);

  // Handle input submission
  const handleSubmitInput = () => {
    if (userInput.trim()) {
      socket.emit('user-input', userInput); // Send input back to the server
      setUserInput(''); // Clear the input field
      setInputPrompt(''); // Clear the prompt
    }
  };

  return (
    <div style={{ backgroundColor: '#000', padding: '10px', height: '85vh' }}>
      {/* Terminal output */}
      <TextArea
        value={currentOutput}
        rows={50}
        style={{ color: '#fff', backgroundColor: '#000', border: 'none', fontFamily: 'monospace' }}
        readOnly
        autoSize={{ minRows: 20, maxRows: 20 }}
      />

      {/* Input prompt */}
      {inputPrompt && (
        <div style={{ marginTop: '28vh', color: '#fff' }}>
          <div>{inputPrompt}</div>
          <Input
          autoFocus
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your input here"
            onPressEnter={handleSubmitInput}
            style={{ marginTop: '5px', color: '#000' }}
          />
          <Button onClick={handleSubmitInput} type="primary" style={{ marginTop: '5px' }}>
            Submit
          </Button>
        </div>
      )}
    </div>
  );
}

export default CodeOutput;
