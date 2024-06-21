import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './redux/root';
import { useSelector, useDispatch } from 'react-redux'
import ChooseCharacter from './components/FirstWindow/ChooseCharacter';
// let currentCharacter = useSelector(state => state.counter.currentCharacter);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <ChooseCharacter/>
    {/* <App /> */}
  </Provider>
);


