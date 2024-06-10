import './Inventory.css';
import InventoryPoint from './InventoryPoint/InventoryPoint';
import { useSelector, useDispatch } from 'react-redux'
import React, { useEffect, useRef, useState } from 'react';

import { updateInventory } from '../../redux/store/store'


const Inventory = ({ isActive }) => {
    let inventoryCell = [1, 2, 3, 4, 1, 2, 3, 4, 2, 3, 4, 11, 2, 3, 4, 1, 2, 3, 4, 2, 3, 4, 11, 2, 3, 4, 1, 2, 3, 4, 2, 3, 4, 1, 1, 1];
    const inventory = useSelector(state => state.counter.inventory);

    const dispatch = useDispatch();

    const [isGain, setisGain] = useState(false);
    const [scrollId, setScrollId] = useState(null);

    let timer = 0;
    let delay = 200;
    let prevent = false;

    function goItem(e) {
        clearTimeout(timer);
        prevent = true;
        console.log('Двойной клик');

        if (inventory[e.target.id].type === 'gain') {
            e.target.style.border = '2px solid red';
            setScrollId(e.target.id);
            return setisGain(true);            
        }
        console.log(isGain);
    }

    function gainUp(e) {
        console.log('одиночный');

        timer = setTimeout(function () {
            if (!prevent) {
                // обрабатываем одиночный кли

                if (isGain) {
                    if (inventory[e.target.id].gain !== null) {
                        if (inventory[e.target.id].gain < 3 || Math.random() * 100 < 50 - inventory[e.target.id].gain * 2) {
                            let inventoryCopy = { ...inventory[e.target.id] }
                            inventoryCopy.gain += 1;
                            // inventory[e.target.id] = {...inventoryCopy};
                            // inventory[scrollId].quantity > 1 ? inventory[scrollId].quantity -= 1 : inventory.splice(scrollId, 1);
                        }
                        else {
                            inventory.splice(e.target.id, 1);
                            inventory[scrollId].quantity > 1 ? inventory[scrollId].quantity -= 1 : inventory.splice(scrollId, 1);
                        }
                        // refsById[scrollId].current.style.border = 'none';
                        setScrollId(null);
                    }

                    console.log(inventory);
                    dispatch(updateInventory(inventory));

                }
                setisGain(false);
            }
            prevent = false;
        }, delay);

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