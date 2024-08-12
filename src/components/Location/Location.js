import './Location.css';
import { locations, itemList } from '../../data/data'
import { useEffect, useState, dispatch, useRef } from 'react';
import { addExp, updateInventory, healthHandler, setRoute } from '../../redux/store/store'
import { useDispatch, useSelector } from 'react-redux';
import Inventory from '../Inventory/Inventory';
import DropText from '../DropText/DropText';


const Location = ({ id, topMessages, setTopMessages }) => {
    const mob = locations[id].mobs;
    const [mobCurrentHp, setMobCurrentHp] = useState(mob.hp);
    const [isAttack, setIsAttack] = useState(false);
    const dispatch = useDispatch();
    const KMOBATTACK = 70;
    const mobRef = useRef();
    const mobAttackRef = useRef();
    const [inventoryIsActive, setInventoryIsActive] = useState(false);

    let currentCharacter = useSelector(state => state.counter.currentCharacter);
    let inventory = useSelector(state => state.counter.characters[currentCharacter].inventory);
    let armory = useSelector(state => state.counter.characters[currentCharacter].armory);
    let strength = useSelector(state => state.counter.characters[currentCharacter].strength);
    const characterClass = useSelector(state => state.counter.characters[currentCharacter].characterClass);
    const [textDropisActive, setTextDropIsActive] = useState(false);
    const [currentMessage, setCurrentMessage] = useState('');
    const [messages, setMessages] = useState([]);
    let dropTextArray = [];

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
                clearInterval(intervalId);
                setTextDropIsActive(false);
                setMessages([]);
                setCurrentMessage('');
            }
        }, 850);
        return () => clearInterval(intervalId);
    }, [messages]);

    useEffect(() => {
        let timer = null;
        if (isAttack && mobCurrentHp > 0) {
            mobRef.current.classList.add("mob__attack-state");
            mobAttackRef.current.classList.add("mob__attack");
            timer = setInterval(() => attack(), 600);
        }
        if (mobCurrentHp <= 0) {
            mobIsKilled()
            mobRef.current.classList.remove("mob__attack-state");
            mobAttackRef.current.classList.remove("mob__attack");
        }
        return () => {
            clearInterval(timer);
        }
    }, [isAttack, mobCurrentHp]);

    function mobIsKilled() {
        setTopMessages([...topMessages, `Вами был убит противник [${mob.name}]`])
        setIsAttack(false);
        setMobCurrentHp(mob.hp);
        dispatch(addExp(mob.exp));
        addToInventory();
    }


    function addToInventory() {
        let inventoryCopy = [...inventory];
        let dropList = itemList.filter(item => mob.dropList.includes(item.id));
        let maxDropItem = 2;
        let newMessage = [];
        const updatedInventory = dropList.reduce((acc, dropItem) => {
            if ((Math.random() * 100 < dropItem.chance) && maxDropItem > 0) {
                maxDropItem -= 1;
                const existingItem = inventoryCopy.find(item => item.id === dropItem.id);

                if (dropItem.id === 0) {
                    dropItem = { ...dropItem, quantity: Math.round(Math.random() * mob.gold) };
                }

                newMessage.push(`Получен предмет [${dropItem.name}]`);
                addDropToTextArr(dropItem);
                if (existingItem && dropItem.stacking) {
                    const updatedItem = { ...existingItem, quantity: existingItem.quantity + dropItem.quantity };
                    inventoryCopy = inventoryCopy.map(item => (item.id === dropItem.id ? updatedItem : item));
                } else {
                    acc.push(dropItem);
                }
            }
            return acc;
        }, []);
        setTopMessages([...topMessages, ...newMessage]);
        console.log(newMessage);
        inventoryCopy = [...inventoryCopy, ...updatedInventory];
        setMessages(dropTextArray);
        dispatch(updateInventory(inventoryCopy));
    }


    function addDropToTextArr(item) {
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

    function mobAttack() {
        const protection = calculateProtection();
        const reducedDamage = mob.attack / (1 + protection / 100);
        const finalDamage = Math.max(1, Math.round(reducedDamage));
    
        dispatch(healthHandler(-finalDamage));
    }

    function howDamage() {
        const weapon = armory[3]; // Получаем оружие из armory[3]
        let dmg = (weapon?.baseDmg || 0) + (weapon?.gain || 0); // Базовый урон
        let critChance = 1; // Начальный шанс крита
        let totalAttribute = 0; // Инициализируем переменную для атрибута

        for (let i = 0; i < armory.length; i++) {
            const item = armory[i];
            if (item) { 
                const additionalChars = item.additionalCharacteristics || {};

                dmg += additionalChars.additionalDamage || 0;
                critChance += additionalChars.critChance || 0;

                if (characterClass === 'warrior') {
                    totalAttribute += additionalChars.strength || 0;
                } else if (characterClass === 'mage') {
                    totalAttribute += additionalChars.intelligence || 0;
                } else if (characterClass === 'archer') {
                    totalAttribute += additionalChars.agility || 0;
                }
            }
        }

        dmg += totalAttribute / 3;
        console.log(critChance);        

        return {
            dmg: dmg,
            critChance: critChance
        }
    }

    function attack() {
        if (Math.random() * 100 > KMOBATTACK) mobAttack();
        if (Math.random() * 100 < howDamage().critChance) {
            setMobCurrentHp(mobCurrentHp - howDamage().dmg * 2);
            console.log('CRIT');            
        } else {
            setMobCurrentHp(mobCurrentHp - howDamage().dmg);
        }
        
        // dispatch(healthHandler(-Math.round((mobList[0].attack - mobList[0].attack * calculateProtection() / 100))));
        // console.log(Math.round((mobList[0].attack - mobList[0].attack * calculateProtection() / 100)));
        mobAttackRef.current.style.top = `${Math.random() * 150 - 30}px`;
    }

    return (
        <div className="location" style={{ backgroundImage: `url(${require(`../../img/location/location_${id}.jpg`)})` }} >

            <div className='mobBox'>
                <div className="mobHpBar-container">
                    <div className="mobHpBar" style={{ width: `${(mobCurrentHp / mob.hp) * 100}%` }}></div>
                </div>
                <div className='mob' ref={mobRef} onClick={() => setIsAttack(true)} style={{ backgroundImage: `url(${require(`../../img/mobs/${mob.id}.png`)})` }}>
                    <div ref={mobAttackRef}></div>
                </div>
                {textDropisActive ? <DropText drop={currentMessage} /> : ''}
            </div>
            <div className="location__buttons">
                <button onClick={() => setInventoryIsActive(true)} className='btn__second'>Инвентарь</button>
                <button onClick={() => dispatch(setRoute('home'))} className='btn__second'>Меню</button>
            </div>
            {inventoryIsActive && <Inventory isActive={setInventoryIsActive} />}


        </div>
    );
}

export default Location;