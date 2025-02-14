import './Farm.css';
import React, { useState } from 'react';
import BotPanel from '../../components/Botpanel/Botpanel';
import Location from '../Location/Location';
import LocationList from '../Location/LocationList/LocationList';

const Farm = () => {
    const [topMessages, setTopMessages] = useState([]);
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