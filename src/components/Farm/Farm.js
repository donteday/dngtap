import './Farm.css';
import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import BotPanel from '../../components/Botpanel/Botpanel';
import { useDispatch, useSelector } from 'react-redux'
import Location from '../Location/Location';
import LocationList from '../Location/LocationList/LocationList';

const Farm = () => {
    let currentCharacter = useSelector(state => state.counter.currentCharacter);
    let armory = useSelector(state => state.counter.characters[currentCharacter].armory);
    const strength = useSelector(state => state.counter.characters[currentCharacter].strength);


    let dropTextArray = [];
    const [messages, setMessages] = useState([]);
    const [topMessages, setTopMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');

    const [locationId, setLocationId] = useState('');

    function howDamage() {
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
        dmg += 50;
        return {
            dmg: dmg,
            critChance: critChance
        }
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


    return (<>
        {locationId === '' ? <LocationList setLocation={setLocationId} /> :
            <>
                <Header topMessages={topMessages}/>
                <Location id={locationId} topMessages={topMessages} setTopMessages={setTopMessages}/>
                <BotPanel />
            </>
        }
        {/* {isActive ? <Inventory isActive={isActiveInventory} /> : null}
        <Location />
        <BotPanel /> */}
    </>);
}

export default Farm;