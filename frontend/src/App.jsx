import React, { useEffect } from 'react';
import { Row, Col, Button, Spin, Card, Space, Divider } from 'antd';
import CodeEditor from './Components/CodeEditor';
import CodeOutput from './Components/CodeOutput';
import LanguageSelector from './Components/LanguageSelector';
import { useData } from './Contexts/DataContext';
import { useSocket } from './Contexts/SocketContext';
import DisconnectedMessage from './Components/DisconnectedMessage';

function App() {
  const { currentLanguage, currentCode, currentOutput, setCurrentOutput, setRunning, running } = useData();
  const { connected, socket } = useSocket();

  const sendCodeToServer = () => {
    if (connected) {
      setRunning(true);
      socket.emit('code', {
        code: currentCode,
        language: currentLanguage,
      });
    }
  };

  useEffect(() => {}, [socket]);

  return (
    <div style={{ padding: '20px', backgroundColor: '#001f3d', minHeight: '100vh', color: '#fff' }}>
      <DisconnectedMessage connected={connected} />
      <Row gutter={[16, 16]} align="top" justify="center">
        {/* Language Selector and Actions */}
        <Col xs={24}>
          <Card style={{ backgroundColor: '#00274d', borderRadius: '8px' }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <LanguageSelector />
              <Row justify="space-between" align="middle">
                <Col>
                  <Button
                    type="primary"
                    disabled={running}
                    onClick={sendCodeToServer}
                    style={{ width: '120px' }}
                  >
                    {running ? <Spin /> : 'Run'}
                  </Button>
                </Col>
                <Col>
                  <Button
                    type="default"
                    onClick={() => setCurrentOutput('')}
                    style={{ width: '120px' }}
                  >
                    Clear
                  </Button>
                </Col>
              </Row>
            </Space>
          </Card>
        </Col>

        {/* Main Content: Code Editor and Output */}
        <Col xs={24} lg={16}>
          <Card
            title="Code Editor"
            style={{ backgroundColor: '#00274d', borderRadius: '8px' }}
          >
            <CodeEditor language={currentLanguage} />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title="Output"
            style={{ backgroundColor: '#00274d', borderRadius: '8px' }}
          >
            <CodeOutput />
          </Card>
        </Col>
      </Row>

      {/* Footer */}
      <Divider style={{ backgroundColor: '#003a6b' }} />
      <Row justify="center">
        <Col>
          <p style={{ color: '#ccc', textAlign: 'center' }}>
            Built with ❤️ using React and Ant Design
          </p>
        </Col>
      </Row>
    </div>
  );
}

export default App;
