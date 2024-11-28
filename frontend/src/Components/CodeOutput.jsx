import React, { useState, useEffect } from 'react';
import { Input, Button } from 'antd';
import { useSocket } from '../Contexts/SocketContext'; // Assuming socket context is used
import { useData } from '../Contexts/DataContext';

const { TextArea } = Input;

function CodeOutput() {
  const [currentOutput, setCurrentOutput] = useState(''); // State to hold terminal output
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

    return () => {
      socket.off('code-output');
      socket.off('code-error');
      socket.off('code-finished');
      socket.off('err');
    };
  }, [socket]);

  // Update output from context (if necessary)
  useEffect(() => {
    if (contextOutput !== currentOutput) {
      setCurrentOutput(contextOutput);
    }
  }, [contextOutput]);

  // Handle user input (if needed later)
  const handleInput = (e) => {
    // Logic to handle input goes here
    console.log(e.target.value);
  };

  return (
    <div style={{ backgroundColor: '#000', padding: '10px', height: '100%' }}>
      <TextArea
        value={currentOutput} // Bind current output to the textarea
        onChange={handleInput} // Handle input (for future functionality)
        rows={20} // You can adjust the height of the terminal
        style={{ color: '#fff', backgroundColor: '#000', border: 'none', fontFamily: 'monospace' }}
        readOnly={true} // Set to true so the user can't edit the output directly
        autoSize={{ minRows: 20, maxRows: 20 }} // Keeps the height fixed
      />
    </div>
  );
}

export default CodeOutput;
