import React from 'react';
import Editor from "@monaco-editor/react";
import { useData } from '../Contexts/DataContext';

function CodeEditor() {

    const {currentCode, setCurrentCode, currentLanguage} = useData();

  const handleEditorChange = (value, event) => {
    // You can handle the change event here (e.g., send value to a parent component or save to state)
    setCurrentCode(value);
  };

  return (
    <div style={{ height: '100%', borderRadius: '8px', backgroundColor: '#f5f5f5' }}>
      <Editor
        height="90vh" // You can set a specific height
        language={currentLanguage} // Specify the language (e.g., "javascript", "python", etc.)
        value={currentCode} // Initial code in the editor
        theme="vs-dark" // Theme of the editor (e.g., 'vs-dark', 'light', etc.)
        onChange={handleEditorChange} // Handle change event
        options={{
          selectOnLineNumbers: true, // Customize editor options
          minimap: { enabled: false }, // Disable minimap
          wordWrap: 'on', // Enable word wrapping
          lineNumbers: 'on', // Show line numbers
          fontSize: 14, // Set font size
        }}
      />
    </div>
  );
}

export default CodeEditor;
