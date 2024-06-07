import React, { useEffect, useRef, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux'
// import { incrementMoney, addExp, startGame } from './redux/store/store'
import { addExp, addItem, updateInventory } from './redux/store/store'


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
  const inventory = useSelector(state => state.counter.inventory);

  let mobMaxHP = 40;
  const [mobCurrentHP, setMobHp] = useState(mobMaxHP);
  const [isAttack, setIsAttack] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [textDropisActive, setTextDropIsActive] = useState(false);
  const mobRef = useRef();
  const mobAttackRef = useRef();

  let droptext =[];

  const [messages, setMessages] = useState([]); // Здесь ваш начальный массив сообщений
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    // setCurrentMessage(messages[0].name);
    let messageIndex = 1;
    console.log(messages);
    const intervalId = setInterval(() => {
      console.log(messages.length);
      if (messageIndex < messages.length) {
        setCurrentMessage(messages[messageIndex].name);
        messageIndex++;
      } else {
        setMessages([]);
        setCurrentMessage('');

        clearInterval(intervalId); // Очистка интервала, когда все сообщения были показаны
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [messages]);

  let itemText = {
    name: 'Серебро',
    id: 0,
    type: 'gold',
    stacking: true,
    quantity: 100,
    chance: 100,
    gain: null,
    writable: true
  };

  let monsters = [
    {
      name: 'Гремлин',
      droplist: [
        {
          name: 'Серебро',
          id: 0,
          type: 'gold',
          stacking: true,
          quantity: 100,
          chance: 100,
          gain: null,
          writable: true
        },
        {
          name: 'Алеба',
          id: 1,
          type: 'weapon',
          stacking: false,
          quantity: 1,
          chance: 100,
          gain: 0,
        },
        {
          name: 'Усилка',
          id: 2,
          type: 'gain',
          stacking: true,
          quantity: 1,
          chance: 0,
          gain: null,
          writable: true
        },
      ]
    }
  ];
  let number = 0;

  function rec(arr) {
    if (!arr.length) return;
    else {

      setTimeout(() => {
        itemText = arr[0];
        setTextDropIsActive(true);
        setTimeout(() => setTextDropIsActive(false), 600 * number);
      }, 600 * (number - 1));

      return arr.splice(0, 1);
    }
  }

  function dropText(item, id) {
    // setAlerts([item]);
    // console.log(alerts);
    droptext = [...droptext, item];

    // myArray = [...myArray, item];
    // for (let i = 0; i < myArray.length; i++) {
    //   setTimeout(() => {
    //     itemText = myArray[i];
    //     setTextDropIsActive(true);
    //     setTimeout(() => setTextDropIsActive(false), 600);
    //   }, 600*i);

    // }
    // console.log(myArray);
    // dropTextArray.push(item.name);

    // number += 1;
    // setTimeout(() => {
    //   itemText = dropTextArray[number-1];
    //   setTextDropIsActive(true);
    //   setTimeout(() => setTextDropIsActive(false), 600 * number);
    // }, 600 * (number - 1));
    // rec(dropTextArray);
    // setTextDropIsActive(true);
    // setTimeout(() => setTextDropIsActive(false), 600);


    // for (let i = 0; i < dropTextArray.length; i++) {
    //   console.log(i, dropTextArray[i]);
    // }
  }


  function attack() {
    setMobHp(mobCurrentHP - 16 - lvl * lvl);
    mobAttackRef.current.style.top = `${Math.random() * 150 - 30}px`;
  }

  function isActiveInventory() {
    setIsActive(false);
  }

  function addToInventory() {
    let x = [...inventory];
    let drop = monsters[0].droplist;
    for (let i = 0; i < monsters[0].droplist.length; i++) {
      if (Math.random() * 100 < drop[i].chance) {
        if (drop[i].stacking) {
          let flag = 0;
          x.map((e, id) => {
            if (e.type === drop[i].type) {
              let eCopy = { ...e };
              eCopy.quantity += drop[i].quantity;
              x[id] = eCopy;
              flag = 1;
              dropText(drop[i], 1);
            }
            return null;
          })
          if (flag != 1) {
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
    dispatch(updateInventory(x));
    setMessages([...messages, ...droptext]);
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
      setMobHp(mobMaxHP);
      dispatch(addExp(40));
      addToInventory();
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
          <div>{currentMessage}</div>
          {/* {textDropisActive ? <DropText drop={itemText} /> : null} */}



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
