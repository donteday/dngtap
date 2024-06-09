import './InventoryPoint.css';
import React, { useEffect, useRef} from 'react';





const InventoryPoint = ({ item, id, selected }) => {

    const charRef = useRef();
    const url = require(`../../../img/items/${item.id}.png`);
    useEffect(() => {
        if (item.id !== undefined) charRef.current.style.backgroundImage = `url(${url})`;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url])



    return (
        <div className="inventory_item_container" id={id}
        style = {{ border:  selected == id ? '3px ridge rgb(251, 255, 0)' : '3px groove #3a3a3a'}}>
            <div className='inventory_item' id={id} ref={charRef} >
                {item.gain !== null ? <div>+{item.gain}</div> : <div></div>}
                <div>{item.quantity}</div>
            </div>
        </div>
    );
}

export default InventoryPoint;