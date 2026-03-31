import './InventoryPoint.css';
import React from 'react';

function getItemSrc(item) {
    let local = null;
    try { local = require(`../../../img/items/${item.id}.png`); } catch {}
    return local || item.imgUrl || null;
}

const InventoryPoint = ({ item, id, selected, gainMode }) => {
    const src = getItemSrc(item);

    let border = '3px groove #3a3a3a';
    // eslint-disable-next-line eqeqeq
    if (selected == id) border = '3px ridge rgb(251, 255, 0)';
    else if (gainMode) border = '3px ridge #00e5ff';

    return (
        <div
            className={`inventory_item_container${gainMode ? ' gain_mode_item' : ''}`}
            id={id}
            style={{ border }}
        >
            <div className='inventory_item' id={id}>
                {src && (
                    <img
                        src={src}
                        referrerPolicy="no-referrer"
                        className="item_icon_img"
                        alt=""
                    />
                )}
                {item.gain != null && <div className="item_gain">+{item.gain}</div>}
                <div className="item_qty">{item.quantity}</div>
            </div>
        </div>
    );
}

export default InventoryPoint;
