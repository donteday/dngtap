import './DropText.css';
import React, { useEffect, useRef} from 'react';


const DropText = ({ drop }) => {
    const imgUrl = require(`../../img/items/${drop.id}.png`);
    const droprRef = useRef();

    useEffect(() => {
        if (drop.id !== undefined) droprRef.current.style.backgroundImage = `url(${imgUrl})`;
    }, [imgUrl])

    return (<div className="droptext_container">
        <div className="droptext_img" ref={droprRef}></div>
        <div className="droptext_text">
            {drop.name} {drop.quantity} шт.
        </div>
    </div>);
}

export default DropText;