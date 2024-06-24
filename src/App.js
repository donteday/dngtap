import React from 'react';
import './App.css';
import { useSelector } from 'react-redux'
import Farm from './components/Farm/Farm';
import ChooseCharacter from './components/FirstWindow/ChooseCharacter';

function App() {
  let currentCharacter = useSelector(state => state.counter.currentCharacter);
  return (
    <div className="App">
      {currentCharacter === null ?
        <ChooseCharacter />
        :
        <Farm />
      }
    </div>
  );
}

export default App;
