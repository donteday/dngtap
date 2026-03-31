import React from 'react';
import './App.css';
import { useSelector } from 'react-redux'
import Farm from './components/Farm/Farm';
import ChooseCharacter from './components/FirstWindow/ChooseCharacter';
import Home from './components/Home/Home';
import Shop from './components/Shop/Shop';

function App() {
  let route = useSelector(state => state.counter.route);
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  function currentRoute() {
    switch (route) {
      case 'chooseCharacter':
        return <ChooseCharacter />
      case 'farm':
        return <Farm />
      case 'home':
        return <Home/>
      case 'shop':
        return <Shop/>
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
