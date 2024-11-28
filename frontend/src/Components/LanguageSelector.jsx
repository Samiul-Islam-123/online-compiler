// src/Components/LanguageSelector.js

import React from 'react';
import { Select } from 'antd';
import { useData } from '../Contexts/DataContext';

const { Option } = Select;

function LanguageSelector() {

    const {currentLanguage, setCurrentLanguage} = useData();

  return (
    <Select
      value={currentLanguage}
      style={{ width: '100%', marginBottom: '20px' }}
      onChange={(value)=>{
        setCurrentLanguage(value);
      }}
      showSearch
    >
      <Option value="c">c</Option>
      <Option value="cpp">c++</Option>
      <Option value="java">Java</Option>
      <Option value="python">python</Option>
    </Select>
  );
}

export default LanguageSelector;
