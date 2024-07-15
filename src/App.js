import React from 'react';
import './App.css';
import { useSelector } from 'react-redux'
import Farm from './components/Farm/Farm';
import ChooseCharacter from './components/FirstWindow/ChooseCharacter';

function App() {
  let route = useSelector(state => state.counter.route);
  let vh = window.innerHeight * 0.01;
  // Then we set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  function currentRoute() {
    switch (route) {
      case 'chooseCharacter':
        return <ChooseCharacter />
      case 'farm':
        return <Farm />
      default:
        break;
    }
  }

  return (
    <div className="App">
      {
        currentRoute()
      }
    </div>
  );
}

export default App;
