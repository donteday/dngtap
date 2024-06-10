import './ArmoryPoint.css';
import React, { useEffect, useRef } from 'react';
import { setArmory, updateInventory } from '../../../redux/store/store'
import { useSelector, useDispatch } from 'react-redux'




const ArmoryPoint = ({ armorItem, index }) => {
    const dispatch = useDispatch();
    const itemRef = useRef();
    let inventory = useSelector(state => state.counter.inventory);

    useEffect(() => {
        if (armorItem !== undefined) {
            const url = require(`../../../img/items/${armorItem.id}.png`);
            itemRef.current.style.backgroundImage = `url(${url})`;
            console.log(123);
        }
    }, [armorItem])

    function takeOff() {
        dispatch(setArmory({ id: index, item: undefined }))
        dispatch(updateInventory([...inventory, armorItem]));

    }

    return (
        <div className='inventory_armor_point' >

            {/* {armorItem} */}
            {armorItem !== undefined ?
                <div className='inventory_armor_item' ref={itemRef} onDoubleClick={() => takeOff()}>
                    {armorItem.gain !== null ? <div>+{armorItem.gain}</div> : <div></div>}
                    {/* <div>{armorItem.quantity}</div> */}
                </div>
                : ''}
        </div>
    );
}

export default ArmoryPoint;