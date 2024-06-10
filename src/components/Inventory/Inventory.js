import './Inventory.css';
import InventoryPoint from './InventoryPoint/InventoryPoint';
import { useSelector, useDispatch } from 'react-redux'
import React, { useState } from 'react';

import { updateInventory, updateItemInventory, setArmory } from '../../redux/store/store'
import ArmoryPoint from './ArmoryPoint/ArmoryPoint';


const Inventory = ({ isActive }) => {

    let inventoryCell = [];
    let inventory = useSelector(state => state.counter.inventory);
    let armory = useSelector(state => state.counter.armory);
    // let armory = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    for (let i = 0; i < 18; i++) {
        inventoryCell.push(1);
    }


    const dispatch = useDispatch();

    const [isGain, setisGain] = useState(false);
    const [gainType, setGainType] = useState('');
    const [scrollId, setScrollId] = useState(null);

    // const [armory, setArmory] = useState([undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined]);
    function goItem(e) {
        if (!inventory[e.target.id]) return;

        switch (inventory[e.target.id].type) {
            case 'gain':
                setGainType(inventory[e.target.id].gainType);
                setScrollId(e.target.id);
                setisGain(true);
                break;
            case 'weapon':
                console.log('eto orujie');
                let inventoryItemCopy = { ...inventory[e.target.id] };
                let armoryCopy = [...armory];
                let inventoryCopy = [...inventory];

                if (armoryCopy[3] === undefined) {
                    dispatch(setArmory({id:3,item:inventoryItemCopy}))
                    inventoryCopy.splice(e.target.id, 1);
                    dispatch(updateInventory(inventoryCopy));
                }
                break;

            default:
                break;

        }
        console.log(isGain);
    }

    function gainUp(e) {

        if (!inventory[e.target.id]) return;

        if (isGain) {
            let inventoryItemCopy = { ...inventory[e.target.id] };
            let scrollCopy = { ...inventory[scrollId] };
            if (inventory[e.target.id].gain !== undefined && inventory[e.target.id].gain !== null && inventory[e.target.id].type === gainType) {
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
                // setScrollId(null);

            }
            setScrollId(null);
            setisGain(false);
            setGainType('');
        }
    }

    return (
        <div className="inventory_container">

            <button className="inventory_close" onClick={() => isActive(false)}>X</button>

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
                    {armory.map((e, index) => <ArmoryPoint armorItem={e} index={index}/>)}
                </div>
            </div>
            <div className="inventory_bottom_container">


                {inventoryCell.map((e, index) => index < inventory.length ?
                    <div onDoubleClick={(e) => goItem(e)} onClick={(e) => gainUp(e)}

                    ><InventoryPoint id={index} item={inventory[index]} key={index} selected={scrollId} /> </div>
                    : <div className="inventory_item_container"></div>)}

                {/* {  inventory.map((item, index) => <InventoryPoint item={item} key={index}/>)} */}


            </div>

        </div>
    );
}

export default Inventory;