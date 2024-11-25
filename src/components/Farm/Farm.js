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

    return (<>
        {locationId === '' ? <LocationList setLocation={setLocationId} /> :
            <>
                {/* <Header topMessages={topMessages}/> */}
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