import './DropText.css';
import React, { useEffect, useRef } from 'react';


const DropText = ({ drop }) => {
    const droprRef = useRef();
    // console.log(`../../img/items/${drop.id}.png`);
    // const imgUrl = require(`../src/img/items/${drop.id}.png`);
    // C:\Users\meows\Desktop\DNGS\farmility\src\img\items\3.png
    useEffect(() => {
        console.log('');
        if (drop.id !== undefined) droprRef.current.style.backgroundImage = `url(${ require(`./../../img/items/${drop.id}.png`)})`;
    }, [drop.id])

    return (<div className="droptext_container">
        <div className="droptext_img" ref={droprRef}></div>
        <div className="droptext_text">
            {drop.name} {drop.quantity} шт.
        </div>
    </div>);
}

export default DropText;