import './ArmoryPoint.css';
import React, { useEffect, useRef} from 'react';


const ArmoryPoint = ({armorItem}) => {

    const itemRef = useRef();
    useEffect(() => {
        if (armorItem !== undefined) {
            const url = require(`../../../img/items/${armorItem.id}.png`);
            itemRef.current.style.backgroundImage = `url(${url})`;
            console.log(123);
        }
    }, [armorItem])


    return ( 
        <div className='inventory_armor_point' >

            {/* {armorItem} */}
            {armorItem !== undefined ?
            <div className='inventory_armor_item' ref={itemRef}>
                {armorItem.gain !== null ? <div>+{armorItem.gain}</div> : <div></div>}
                {/* <div>{armorItem.quantity}</div> */}
            </div>
            : ''}
        </div>
     );
}
 
export default ArmoryPoint;