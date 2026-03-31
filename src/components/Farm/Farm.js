import './Farm.css';
import React, { useState } from 'react';
import BotPanel from '../../components/Botpanel/Botpanel';
import Location from '../Location/Location';
import LocationList from '../Location/LocationList/LocationList';

const Farm = () => {
    const [topMessages, setTopMessages] = useState([]);
    const [locationId, setLocationId] = useState('');

    return (
        <div className="farm_wrapper">
            {locationId === '' ? <LocationList setLocation={setLocationId} /> :
                <>
                    <Location id={locationId} topMessages={topMessages} setTopMessages={setTopMessages} onBack={() => setLocationId('')} />
                    <BotPanel />
                </>
            }
        </div>
    );
}

export default Farm;
