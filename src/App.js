import React, { useEffect, useRef, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux'
// import { incrementMoney, addExp, startGame } from './redux/store/store'
import { addExp, addItem } from './redux/store/store'


import './App.css';
import Farm from './components/Farm/Farm';
import Header from './components/Header/Header';
import BotPanel from './components/Botpanel/Botpanel';

import { useDispatch, useSelector } from 'react-redux'
import Inventory from './components/Inventory/Inventory';
import DropText from './components/DropText/DropText';



function App() {
  const dispatch = useDispatch();
  const lvl = useSelector(state => state.counter.lvl);

  let mobMaxHP = 40;
  const [mobCurrentHP, setMobHp] = useState(mobMaxHP);
  const [isAttack, setIsAttack] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [textDropisActive, setTextDropIsActive] = useState(false);
  const mobRef = useRef();
  const mobAttackRef = useRef();

  let monsters = [
    {
      name: 'Гремлин',
      droplist: [
        {
          id: 0,
          chance: 100,
          name: "Серебро",
          quantity: Math.round(Math.random() * 10),
          stacking: true,
        }
      ],
    }
  ];


  function attack() {
    setMobHp(mobCurrentHP - 16 - lvl * lvl);
    mobAttackRef.current.style.top = `${Math.random() * 150 - 30}px`;
  }

  function isActiveInventory() {
    setIsActive(false);
  }

  useEffect(() => {
    let timer = null;
    if (isAttack && mobCurrentHP > 0) {
      mobRef.current.classList.add("mob__attack-state");
      mobAttackRef.current.classList.add("mob__attack");
      timer = setInterval(() => attack(), 1000);
    }
    if (mobCurrentHP <= 0) {
      setIsAttack(false);
      mobRef.current.classList.remove("mob__attack-state");
      mobAttackRef.current.classList.remove("mob__attack");
      setMobHp(mobMaxHP);
      dispatch(addExp(40));
      dispatch(addItem());
      setTextDropIsActive(true);
      setTimeout(() => setTextDropIsActive(false), 600);
    }
    return () => clearInterval(timer);

  }, [isAttack, mobCurrentHP, mobMaxHP]);


  return (
    <div className="App">
      {isActive ? <Inventory isActive={isActiveInventory} /> : null}
      <Header />
      <button onClick={() => setIsActive(true)}>inventory</button>
      <div className="location">
        <div className='mobBox'>
          <div className="mobHpBar-container">
            <div className="mobHpBar" style={{ width: `${(mobCurrentHP / mobMaxHP) * 100}%` }}>
            </div>
            <div className="mobHpBar-text">{mobCurrentHP}</div>
          </div>

          {textDropisActive ? <DropText drop={monsters[0].droplist[0]} /> : null}



          <div className='mob' ref={mobRef} onClick={() => setIsAttack(true)}>
            <div ref={mobAttackRef}></div>
          </div>
        </div>

      </div>
      <BotPanel />
      {/* <Farm /> */}
    </div>
  );
}

export default App;
