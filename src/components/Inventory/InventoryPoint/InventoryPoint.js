import './InventoryPoint.css';
import React, { useEffect, useRef, useState } from 'react';


const InventoryPoint = ({item}) => {
    const charRef = useRef();
    const url = require(`../../../img/items/${item.id}.png`);
    useEffect(() => {
        if (item.id !== undefined) charRef.current.style.backgroundImage = `url(${url})`;
    }, [url])
    return (
        <div className="inventory_item_container">
            <div className='inventory_item' ref={charRef}>
               {item.quantity}
            </div>            
        </div>
    );
}

export default InventoryPoint;