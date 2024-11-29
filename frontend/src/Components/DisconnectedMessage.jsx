import React from 'react';
import { Spin } from 'antd';

const DisconnectedMessage = ({ connected }) => {
  return (
    connected === false && (
      <div
        style={{
          textAlign: 'center',
          color: '#fff',
          padding: '20px',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <h2
          style={{
            fontSize: '24px',
            marginBottom: '20px',
            fontWeight: 'bold',
            color: '#ff4d4f', // Red color for the error message
          }}
        >
          Trying to reconnect with server ... your code may not run :(
        </h2>
        <Spin size="large" />
      </div>
    )
  );
};

export default DisconnectedMessage;
