import './DropText.css';
import React, { useEffect, useRef } from 'react';

const DropText = ({ drop }) => {
    const dropRef = useRef();

    useEffect(() => {
        try {
            const url = require(`./../../img/items/${drop.id}.png`);
            dropRef.current.style.backgroundImage = `url(${url})`;
        } catch {}
    }, [drop.id]);

    return (
        <div className="droptext_container">
            <div className="droptext_img" ref={dropRef}></div>
            <div className="droptext_text">
                {drop.name} {drop.quantity} шт.
            </div>
        </div>
    );
}

export default DropText;
