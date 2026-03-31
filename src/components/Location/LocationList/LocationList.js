import { locations } from '../../../data/data';
import './LocationList.css';

const LocationList = ({ setLocation }) => {
    return (
        <div>
            {locations.map((location) => {
                let bg = null;
                try { bg = require(`../../../img/location/location_${location.id}.jpg`); } catch {}
                const bgUrl = bg || location.imgUrl || '';

                let mobImg = null;
                try { mobImg = require(`../../../img/mobs/${location.mobs.id}.png`); } catch {}
                const mobUrl = mobImg || location.mobs.imgUrl || '';

                return (
                    <div
                        key={location.id}
                        className='locationlist__item'
                        onClick={() => setLocation(location.id)}
                        style={{ backgroundImage: `url(${bgUrl})` }}
                    >
                        <div
                            className="locationlist__img"
                            style={{ backgroundImage: `url(${mobUrl})` }}
                        />
                        {location.name}
                    </div>
                );
            })}
        </div>
    );
}

export default LocationList;
