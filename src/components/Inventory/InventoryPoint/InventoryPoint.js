import './InventoryPoint.css';
import React, { useEffect, useRef} from 'react';





const InventoryPoint = ({ item, id }) => {


    const charRef = useRef();
    const url = require(`../../../img/items/${item.id}.png`);
    useEffect(() => {
        if (item.id !== undefined) charRef.current.style.backgroundImage = `url(${url})`;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url])



    return (
        <div className="inventory_item_container" id={id} >
            <div className='inventory_item' id={id} ref={charRef} >
                {item.gain !== null ? <div>+{item.gain}</div> : <div></div>}
                <div>{item.quantity}</div>

            </div>
        </div>
    );
}

export default InventoryPoint;