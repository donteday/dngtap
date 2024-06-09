import React, { useEffect, useRef, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux'
// import { incrementMoney, addExp, startGame } from './redux/store/store'
import { addExp, updateInventory } from './redux/store/store'


import './App.css';
// import Farm from './components/Farm/Farm';
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

  let dropTextArray = [];
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');


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

  let monsters = [
    {
      name: 'Гремлин',
      droplist: [
        {
          name: 'Серебро',
          id: 0,
          subtype: 'gold',
          type: 'gold',
          stacking: true,
          blessed: false,
          quantity: Math.round(Math.random() *100),
          chance: 100,
          gain: null,
          writable: true,
          isPutOn : false
        },
        {
          name: 'Железная Алебарда',
          id: 1,
          type: 'weapon',
          subtype: 'halberd',
          stacking: false,
          blessed: false,
          quantity: 1,
          chance: 5,
          gain: 0,
          isPutOn : true
        },
        {
          name: 'Стальной шлем',
          id: 200,
          type: 'armor',
          subtype: 'head',
          stacking: false,
          blessed: false,
          quantity: 1,
          chance: 10,
          gain: 0,
          isPutOn : true
        },
        {
          name: 'Стальные сапоги',
          id: 201,
          type: 'armor',
          subtype: 'legs',
          stacking: false,
          blessed: false,
          quantity: 1,
          chance: 15,
          gain: 0,
          isPutOn : true
        },
        {
          name: 'Стальные перчатки',
          id: 202,
          type: 'armor',
          subtype: 'hands',
          stacking: false,
          blessed: false,
          quantity: 1,
          chance: 20,
          gain: 0,
          isPutOn : true
        },
        {
          name: 'Свиток усиления оружия',
          id: 2,
          type: 'gain',
          subtype: 'ordinary',
          gainType: 'weapon',
          blessed: false,
          stacking: true,
          quantity: 2,
          chance: 50,
          gain: null,
          writable: true,
          isPutOn : false
        },
        {
          name: 'Свиток усиления доспехов',
          id: 3,
          type: 'gain',
          subtype: 'ordinary',
          gainType: 'armor',
          blessed: false,
          stacking: true,
          quantity: 2,
          chance: 50,
          gain: null,
          writable: true,
          isPutOn : false
        },
      ]
    }
  ];

  function dropText(item, id) {
    dropTextArray = [...dropTextArray, item];
  }


  function attack() {
    setMobHp(mobCurrentHP - 15 - lvl);
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
      setMobHp(mobMaxHP);
      dispatch(addExp(40));
      addToInventory();
    }
    return () => clearInterval(timer);

  // eslint-disable-next-line react-hooks/exhaustive-deps
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

          {textDropisActive ? <DropText drop={currentMessage} /> : ''}


          {/* <div>{currentMessage.name}</div> */}
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
