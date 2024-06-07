import './Inventory.css';
import InventoryPoint from './InventoryPoint/InventoryPoint';
import { useSelector, useDispatch } from 'react-redux'
import React, { useEffect, useRef, useState } from 'react';

import { updateInventory, updateItemInventory } from '../../redux/store/store'


const Inventory = ({ isActive }) => {
    let inventoryCell = [1, 2, 3, 4, 1, 2, 3, 4, 2, 3, 4, 11, 2, 3, 4, 1, 2, 3, 4, 2, 3, 4, 11, 2, 3, 4, 1, 2, 3, 4, 2, 3, 4, 1, 1, 1];
    let inventory = useSelector(state => state.counter.inventory);

    const dispatch = useDispatch();

    const [isGain, setisGain] = useState(false);
    const [scrollId, setScrollId] = useState(null);

    function goItem(e) {
        if (!inventory[e.target.id]) return;
        if (inventory[e.target.id].type === 'gain') {
            // e.target.style.border = '2px solid red';
            setScrollId(e.target.id);
            setisGain(true);
        }
    }

    function gainUp(e) {
        if (!inventory[e.target.id]) return;
        if (isGain) {
            let inventoryItemCopy = { ...inventory[e.target.id] };
            let scrollCopy = { ...inventory[scrollId] }
            // console.log(inventory[e.target.id].gain !== undefined);
            if (inventory[e.target.id].gain !== undefined && inventory[e.target.id].gain !== null) {
                if (inventory[e.target.id].gain < 3 || Math.random() * 100 < 50 - inventory[e.target.id].gain * 2) {
                    inventoryItemCopy.gain += 1;
                    dispatch(updateItemInventory({ id: e.target.id, item: inventoryItemCopy }));
                    if (scrollCopy.quantity > 0) {
                        scrollCopy.quantity -= 1;
                        console.log(scrollId);
                        dispatch(updateItemInventory({ id: scrollId, item: scrollCopy }));
                    }

                }
                else {
                    let inventoryCopy = [...inventory];
                    inventoryCopy.splice(e.target.id, 1);
                    dispatch(updateInventory(inventoryCopy));

                    if (scrollCopy.quantity > 0) {
                        scrollCopy.quantity -= 1;
                        e.target.id > scrollId ?
                        dispatch(updateItemInventory({ id: scrollId, item: scrollCopy }))
                        : dispatch(updateItemInventory({ id: scrollId - 1, item: scrollCopy }));

                    }
                }
                // refsById[scrollId].current.style.border = 'none';
                setScrollId(null);
            }
            setisGain(false);
        }
    }

    return (
        <div className="inventory_container">
            <button onClick={() => isActive(false)}>close</button>

            <div className="inventory_top_container">
                <div className="char_specifications_container">
                    <p className="char_specifications_text">Имя: Meow</p>
                    <p className="char_specifications_text">Уровень: 1</p>
                    <p className="char_specifications_text">HP: 100</p>
                    <p className="char_specifications_text">Сила: 11</p>
                    <p className="char_specifications_text">Ловкость: 11</p>
                    <p className="char_specifications_text">Интеллект: 11</p>
                    <p className="char_specifications_text">Защита: 11</p>
                </div>
                <div className="inventory_armor">
                    <div className="inventory_armor_point">1</div>
                    <div className="inventory_armor_point">2</div>
                    <div className="inventory_armor_point">3</div>
                    <div className="inventory_armor_point">4</div>
                    <div className="inventory_armor_point">5</div>
                    <div className="inventory_armor_point">6</div>
                    <div className="inventory_armor_point">7</div>
                    <div className="inventory_armor_point">8</div>
                    <div className="inventory_armor_point">9</div>
                    <div className="inventory_armor_point">10</div>
                    <div className="inventory_armor_point">11</div>
                    <div className="inventory_armor_point">12</div>
                </div>
            </div>
            <div className="inventory_bottom_container">

                {inventoryCell.map((e, index) => index < inventory.length ? <div onDoubleClick={(e) => goItem(e)} onClick={(e) => gainUp(e)}><InventoryPoint id={index} item={inventory[index]} key={index} /> </div> : <div className="inventory_item_container"></div>)}
                {/* {  inventory.map((item, index) => <InventoryPoint item={item} key={index}/>)} */}


            </div>

        </div>
    );
}

export default Inventory;