import React, { useState, useEffect } from 'react';
import { Input, Button } from 'antd';
import { useSocket } from '../Contexts/SocketContext'; // Assuming socket context is used
import { useData } from '../Contexts/DataContext';

const { TextArea } = Input;

function CodeOutput() {
  const [currentOutput, setCurrentOutput] = useState(''); // State to hold terminal output
  const [userInput, setUserInput] = useState(''); // State to hold user input
  const { socket } = useSocket();
  const { currentOutput: contextOutput, setCurrentOutput: setContextOutput } = useData();

  // Listen for socket events and update currentOutput
  useEffect(() => {
    socket.on('code-output', (output) => {
      setCurrentOutput(output);
    });

    socket.on('code-error', (err) => {
      setCurrentOutput((prevOutput) => prevOutput + err);
    });

    socket.on('code-finished', (output) => {
      setCurrentOutput((prevOutput) => prevOutput + output);
    });

    socket.on('err', (err) => {
      setCurrentOutput((prevOutput) => prevOutput + err);
    });

    // Listen for prompt from backend requesting user input
    socket.on('prompt-user-input', (message) => {
      setCurrentOutput((prevOutput) => prevOutput + '\n' + message);
    });

    return () => {
      socket.off('code-output');
      socket.off('code-error');
      socket.off('code-finished');
      socket.off('err');
      socket.off('prompt-user-input');
    };
  }, [socket]);

  // Update output from context (if necessary)
  useEffect(() => {
    if (contextOutput !== currentOutput) {
      setCurrentOutput(contextOutput);
    }
  }, [contextOutput]);

  // Handle user input
  const handleInputChange = (e) => {
    setUserInput(e.target.value); // Update user input
  };

  const handleSubmitInput = () => {
    if (userInput.trim()) {
      socket.emit('user-input', userInput); // Send input to the server
      setUserInput(''); // Clear the input field
    }
  };

  return (
    <div style={{ backgroundColor: '#000', padding: '10px', height: '100%' }}>
      <TextArea
        value={currentOutput} // Bind current output to the textarea
        rows={20} // You can adjust the height of the terminal
        style={{ color: '#fff', backgroundColor: '#000', border: 'none', fontFamily: 'monospace' }}
        readOnly={true} // Set to true so the user can't edit the output directly
        autoSize={{ minRows: 20, maxRows: 20 }} // Keeps the height fixed
      />
      {/* User Input Area */}
      <div style={{ marginTop: '10px' }}>
        <Input
          value={userInput} // Track user input
          onChange={handleInputChange} // Update input state
          onPressEnter={handleSubmitInput} // Submit input on Enter press
          style={{ color: '#fff', backgroundColor: '#333', border: 'none', fontFamily: 'monospace' }}
          placeholder="Type your input here..." // Prompt for input
        />
        <Button
          type="primary"
          onClick={handleSubmitInput}
          style={{ marginTop: '5px', width: '100%' }}
        >
          Submit Input
        </Button>
      </div>
    </div>
  );
}

export default CodeOutput;
