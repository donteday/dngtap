import React from 'react';
import './App.css';
import { useSelector } from 'react-redux'
import Farm from './components/Farm/Farm';
import ChooseCharacter from './components/FirstWindow/ChooseCharacter';

function App() {
  let currentCharacter = useSelector(state => state.counter.currentCharacter);
  let vh = window.innerHeight * 0.01;
  // Then we set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty('--vh', `${vh}px`);
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
