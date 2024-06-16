import React, { useEffect, useRef, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux'
// import { incrementMoney, addExp, startGame } from './redux/store/store'
import { addExp, updateInventory, healthHandler } from './redux/store/store'
import './App.css';

import Header from './components/Header/Header';
import BotPanel from './components/Botpanel/Botpanel';

import { useDispatch, useSelector } from 'react-redux'
import Inventory from './components/Inventory/Inventory';
import DropText from './components/DropText/DropText';

import { mobList } from '../src/data/data'


function App() {
  const dispatch = useDispatch();
  // const lvl = useSelector(state => state.counter.lvl);
  const inventory = useSelector(state => state.counter.inventory);
  const armory = useSelector(state => state.counter.armory);
  const strength = useSelector(state => state.counter.strength);

  const [mobCurrentHP, setMobHp] = useState(mobList[0].maxHP);
  const [isAttack, setIsAttack] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [textDropisActive, setTextDropIsActive] = useState(false);
  const mobRef = useRef();
  const mobAttackRef = useRef();

  let dropTextArray = [];
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');

  function howDamage() {
    console.log();
    let dmg = armory[3]?.baseDmg + armory[3]?.gain || 1;
    let critChance = 1;
    let strengthTemp = strength;
    for (let i = 0; i < armory.length; i++) {
      if (armory[i]) {
        dmg += armory[i].additionalCharacteristics?.additionalDamage || 0;
        critChance += armory[i].additionalCharacteristics?.critChance || 0;
        strengthTemp += armory[i].additionalCharacteristics?.strength || 0;
      }
    }
    dmg += strengthTemp / 3;
    return {
      dmg : dmg,
      critChance : critChance
    }
  }

  useEffect(() => {
    if (messages.length === 0) {
      setTextDropIsActive(false);
      return;
    }
    let messageIndex = 1;
    setCurrentMessage(messages[0]);
    setTextDropIsActive(true);
    const intervalId = setInterval(() => {
      if (messageIndex < messages.length) {
        setCurrentMessage(messages[messageIndex]);
        setTextDropIsActive(true);
        messageIndex++;
      } else {
        clearInterval(intervalId); // Очистка интервала, когда все сообщения были показаны
        setTextDropIsActive(false);
        setMessages([]);
        setCurrentMessage('');
      }
    }, 900);
    return () => clearInterval(intervalId);
  }, [messages]);

  function dropText(item, id) {
    dropTextArray = [...dropTextArray, item];
  }

  const calculateProtection = () => {
    let totalProtection = 0;
    armory.forEach(item => {
        if (item && item.defence) {
      totalProtection += item.defence;
      totalProtection += item.gain;
            
        }
    });
    return totalProtection;
  }

  function attack() {
    if (Math.random() * 100 < howDamage().critChance) {
      setMobHp(mobCurrentHP - howDamage().dmg * 2);
    } else {
      setMobHp(mobCurrentHP - howDamage().dmg);
    }
    dispatch(healthHandler(-Math.round((mobList[0].attack - mobList[0].attack*calculateProtection()/100))));
    console.log(Math.round((mobList[0].attack - mobList[0].attack*calculateProtection()/100)));
    mobAttackRef.current.style.top = `${Math.random() * 150 - 30}px`;
  }

  function isActiveInventory() {
    setIsActive(false);
  }

  function addToInventory() {
    let x = [...inventory];
    let drop = mobList[0].dropList;
    for (let i = 0; i < drop.length; i++) {
      if (Math.random() * 100 < drop[i].chance) {
        if (drop[i].stacking) {
          let flag = 0;
          // eslint-disable-next-line no-loop-func
          x.map((e, id) => {
            if (e.id === drop[i].id) {
              let eCopy = { ...e };
              eCopy.quantity += drop[i].quantity;
              x[id] = eCopy;
              flag = 1;
              dropText(drop[i], 1);
            }
            return null;
          })
          if (flag !== 1) {
            dropText(drop[i], 2);
            x = [...x, drop[i]];
          }
        }
        else {
          dropText(drop[i], 3);
          x = [...x, drop[i]];
        };
      }
    }
    setMessages(dropTextArray);
    dispatch(updateInventory(x));
    // return setInventory(x);
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
      setMobHp(mobList[0].maxHP);
      dispatch(addExp(40));
      addToInventory();
    }
    return () => clearInterval(timer);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAttack, mobCurrentHP, mobList[0].maxHP]);


  return (
    <div className="App">
      {isActive ? <Inventory isActive={isActiveInventory} /> : null}
      <Header />
      <div className="location">
        <div className='mobBox'>
          <div className="mobHpBar-container">
            <div className="mobHpBar" style={{ width: `${(mobCurrentHP / mobList[0].maxHP) * 100}%` }}>
            </div>
            {/* <div className="mobHpBar-text">{mobCurrentHP}</div> */}
          </div>

          {textDropisActive ? <DropText drop={currentMessage} /> : ''}


          {/* <div>{currentMessage.name}</div> */}
          <div className='mob' ref={mobRef} onClick={() => setIsAttack(true)}>

            <div ref={mobAttackRef}></div>

          </div>

        </div>
        <button onClick={() => setIsActive(true)} className='inventory_open_btn'>Инвентарь</button>

      </div>
      <BotPanel />
      {/* <Farm /> */}
    </div>
  );
}

export default App;
