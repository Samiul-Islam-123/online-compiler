// src/App.js

import React, { useEffect, useState } from 'react';
import { Row, Col, Button } from 'antd';
import CodeEditor from './Components/CodeEditor';
import CodeOutput from './Components/CodeOutput';
import LanguageSelector from './Components/LanguageSelector'; // Import the LanguageSelector component
import { useData } from './Contexts/DataContext';
import { useSocket } from './Contexts/SocketContext';

function App() {

  const {currentLanguage, currentCode, currentOutput} = useData();
  const{connected, socket} = useSocket();
  
  const sendCodeToServer =() => {
    if(connected){
      socket.emit('code', ({
        code : currentCode,
        language : currentLanguage
      }))
    }
  }

  useEffect(() => {

  },[socket])

  return (
    <div style={{ padding: '20px', backgroundColor: '#001f3d', minHeight: '90vh' }}>
        {connected===false && (<>
        <h2 style={{
          color: '#fff',
        }}>
          Unable to connect with server ... your code may not run :(
        </h2>
        </>)}
      <Row gutter={16} align="top">
        {/* Language Selector Column */}
        <Col xs={23} sm={23} md={23} lg={23} xl={23}>
          <LanguageSelector/>
        </Col>

        <Col >
          <Button onClick={sendCodeToServer}>Run</Button>
        </Col>

        {/* Code Editor Column */}
        <Col xs={24} sm={24} md={12} lg={16} xl={18}>
          <CodeEditor language={currentLanguage} />
        </Col>

        {/* Code Output Column */}
        <Col xs={24} sm={24} md={12} lg={8} xl={6}>
          <CodeOutput />
        </Col>
      </Row>
    </div>
  );
}

export default App;
