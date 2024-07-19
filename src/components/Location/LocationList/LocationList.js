import {locations} from '../../../data/data';
import './LocationList.css';

const LocationList = ({setLocation}) => {
    // const bacgroundImgUrl = require(`../../../img/items/${item.id}.png`);
    // useEffect(() => {
    //     if (item.id !== undefined) charRef.current.style.backgroundImage = `url(${url})`;
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [url])
    return ( <div>
        {locations.map((location) => <div className='locationlist__item' onClick={() => setLocation(location.id)} style={{backgroundImage: `url(${require(`../../../img/location/location_${location.id}.jpg`)})`}}>
            <div className="locationlist__img" style={{backgroundImage: `url(${require(`../../../img/mobs/${location.id}.png`)})`}}></div>
            {location.name}
        </div>)}
    </div> );
}
 
export default LocationList;