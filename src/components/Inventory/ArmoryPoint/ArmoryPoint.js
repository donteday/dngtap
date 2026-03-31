import './ArmoryPoint.css';
import React from 'react';
import { setArmory, updateInventory } from '../../../redux/store/store';
import { useSelector, useDispatch } from 'react-redux';

function getItemSrc(item) {
    let local = null;
    try { local = require(`../../../img/items/${item.id}.png`); } catch {}
    return local || item.imgUrl || null;
}

const ArmoryPoint = ({ armorItem, index, isGainMode, onEnhance }) => {
    const dispatch = useDispatch();
    const currentCharacter = useSelector(state => state.counter.currentCharacter);
    const inventory = useSelector(state => state.counter.characters[currentCharacter].inventory);

    function takeOff() {
        dispatch(setArmory({ id: index, item: null }));
        dispatch(updateInventory([...inventory, armorItem]));
    }

    const src = armorItem ? getItemSrc(armorItem) : null;

    return (
        <div className={`inventory_armor_point${isGainMode ? ' armory_gain_mode' : ''}`}>
            <div
                className='inventory_armor_item'
                onDoubleClick={isGainMode ? undefined : (armorItem ? takeOff : undefined)}
                onClick={isGainMode ? onEnhance : undefined}
            >
                {src && (
                    <img src={src} referrerPolicy="no-referrer" className="item_icon_img" alt="" />
                )}
                {armorItem?.gain != null && (
                    <div className="item_gain" style={{ position: 'relative', zIndex: 1 }}>+{armorItem.gain}</div>
                )}
            </div>
        </div>
    );
}

export default ArmoryPoint;
