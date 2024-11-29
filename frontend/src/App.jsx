// src/App.js

import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Spin } from 'antd';
import CodeEditor from './Components/CodeEditor';
import CodeOutput from './Components/CodeOutput';
import LanguageSelector from './Components/LanguageSelector'; // Import the LanguageSelector component
import { useData } from './Contexts/DataContext';
import { useSocket } from './Contexts/SocketContext';
import DisconnectedMessage from './Components/DisconnectedMessage';

function App() {

  const {currentLanguage, currentCode, currentOutput, setCurrentOutput, setRunning, running} = useData();
  const{connected, socket} = useSocket();
  
  const sendCodeToServer =() => {
    if(connected){
      setRunning(true);
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
        <DisconnectedMessage connected={connected} />
      <Row gutter={16} align="top">
        {/* Language Selector Column */}
        <Col xs={22} sm={22} md={22} lg={22} xl={22}>
          <LanguageSelector/>
        </Col>

        <Col >
          <Button disabled={running} onClick={sendCodeToServer}>

            {running=== true ? (<>
              <Spin />
            </>) : "Run"}

          </Button>
        </Col>

        <Col >
          <Button onClick={() => {
            setCurrentOutput("")
          }}>Clear</Button>
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
