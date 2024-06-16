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
    let state = useSelector(state => state.counter);
    // let armory = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    for (let i = 0; i < 25; i++) {
        inventoryCell.push(1);
    }

    const calculateProtection = () => {
        let totalProtection = 0;
        armory.forEach(item => {
            if (item && item.defence) {
          totalProtection += item.defence;
          totalProtection += item.gain;
                
            }
        });
        return totalProtection;
      }
      console.log(calculateProtection());

    // useEffect(() => {
    //     console.log(123);
    //     for (let i = 0; i < armory.length; i++) {
    //         inventoryCell.push(1);
    //     }

    //   }, []);


    const dispatch = useDispatch();

    const [isGain, setisGain] = useState(false);
    const [gainType, setGainType] = useState('');
    const [scrollId, setScrollId] = useState(null);

    // const [armory, setArmory] = useState([undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined]);
    function goItem(e) {
        if (!inventory[e.target.id]) return;
        let inventoryItemCopy = { ...inventory[e.target.id] };
        let armoryCopy = [...armory];
        let inventoryCopy = [...inventory];

        switch (inventory[e.target.id].type) {
            case 'gain':
                setGainType(inventory[e.target.id].gainType);
                setScrollId(e.target.id);
                setisGain(true);
                break;
            case 'weapon':
                console.log('eto orujie');
                if (armoryCopy[3] === undefined) {
                    dispatch(setArmory({ id: 3, item: inventoryItemCopy }))
                    inventoryCopy.splice(e.target.id, 1);
                    dispatch(updateInventory(inventoryCopy));
                }
                break;
            case 'armor':
                console.log(inventory[e.target.id]);
                switch (inventory[e.target.id].subtype) {
                    case 'legs':
                        if (armoryCopy[10] === undefined) {
                            dispatch(setArmory({ id: 10, item: inventoryItemCopy }))
                            inventoryCopy.splice(e.target.id, 1);
                            dispatch(updateInventory(inventoryCopy));
                        }
                        break;
                    case 'head':
                        if (armoryCopy[1] === undefined) {
                            dispatch(setArmory({ id: 1, item: inventoryItemCopy }))
                            inventoryCopy.splice(e.target.id, 1);
                            dispatch(updateInventory(inventoryCopy));
                        }
                        break;
                    case 'hands':
                        if (armoryCopy[8] === undefined) {
                            dispatch(setArmory({ id: 8, item: inventoryItemCopy }))
                            inventoryCopy.splice(e.target.id, 1);
                            dispatch(updateInventory(inventoryCopy));
                        }
                        break;
                    case 'necklace':
                        if (armoryCopy[0] === undefined) {
                            dispatch(setArmory({ id: 0, item: inventoryItemCopy }))
                            inventoryCopy.splice(e.target.id, 1);
                            dispatch(updateInventory(inventoryCopy));
                        }
                        break;
                    case 'cloak':
                        if (armoryCopy[2] === undefined) {
                            dispatch(setArmory({ id: 2, item: inventoryItemCopy }))
                            inventoryCopy.splice(e.target.id, 1);
                            dispatch(updateInventory(inventoryCopy));
                        }
                        break;
                    case 'chest':
                        if (armoryCopy[4] === undefined) {
                            dispatch(setArmory({ id: 4, item: inventoryItemCopy }))
                            inventoryCopy.splice(e.target.id, 1);
                            dispatch(updateInventory(inventoryCopy));
                        }
                        break;
                    case 'shield':
                        if (armoryCopy[5] === undefined) {
                            dispatch(setArmory({ id: 5, item: inventoryItemCopy }))
                            inventoryCopy.splice(e.target.id, 1);
                            dispatch(updateInventory(inventoryCopy));
                        }
                        break;
                    case 'belt':
                        if (armoryCopy[7] === undefined) {
                            dispatch(setArmory({ id: 7, item: inventoryItemCopy }))
                            inventoryCopy.splice(e.target.id, 1);
                            dispatch(updateInventory(inventoryCopy));
                        }
                        break;
                    case 'ring':
                        if (armoryCopy[9] === undefined) {
                            dispatch(setArmory({ id: 9, item: inventoryItemCopy }))
                            inventoryCopy.splice(e.target.id, 1);
                            dispatch(updateInventory(inventoryCopy));
                        } else if (armoryCopy[11] === undefined) {
                            dispatch(setArmory({ id: 11, item: inventoryItemCopy }))
                            inventoryCopy.splice(e.target.id, 1);
                            dispatch(updateInventory(inventoryCopy));
                        }
                        break;
                    default:
                        break;
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
                        +e.target.id > +scrollId ?
                            dispatch(updateItemInventory({ id: scrollId, item: scrollCopy }))
                            : dispatch(updateItemInventory({ id: scrollId - 1, item: scrollCopy }));

                    }
                }
            }
            setScrollId(null);
            setisGain(false);
            setGainType('');
        }
    }

    return (
        <div className="inventory_container">

            <div className="inventory_name">
                <div className='inventory_name_text'>Инвентарь</div>
                <button className="inventory_close" onClick={() => isActive(false)}>X</button>


            </div>
            <div className="inventory_top_container">
                <div className="char_specifications_container">
                    <p className="char_specifications_text">Имя: Meow</p>
                    <p className="char_specifications_text">Уровень: {state.lvl}</p>
                    <p className="char_specifications_text">HP: {state.hp}</p>
                    <p className="char_specifications_text">Сила: 11</p>
                    <p className="char_specifications_text">Ловкость: 11</p>
                    <p className="char_specifications_text">Интеллект: 11</p>
                    <p className="char_specifications_text">Защита: {calculateProtection()}</p>
                </div>
                <div className="inventory_armor">
                    {armory.map((e, index) => <ArmoryPoint armorItem={e} index={index} />)}
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