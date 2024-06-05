import './Inventory.css';
import InventoryPoint from './InventoryPoint/InventoryPoint';
import { useDispatch, useSelector } from 'react-redux'


const Inventory = ({isActive}) => {
    // let inventory = [1,2,3,4,1,2,3,4,2,3,4,1,2,3,4,2,3,4,1,2,3,4,2,3,4,1,2,3,4];
    const inventory = useSelector(state => state.counter.inventory);

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
                
                  {  inventory.map((item, index) => <InventoryPoint item={item} key={index}/>)}

                
            </div>

        </div>
     );
}
 
export default Inventory;