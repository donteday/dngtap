import './Shop.css';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { setRoute, spendGold, addGold, addItemToInventory, updateInventory } from '../../redux/store/store';
import { shopItems } from '../../data/data';

function getItemSrc(item) {
    let local = null;
    try { local = require(`../../img/items/${item.id}.png`); } catch {}
    return local || item.imgUrl || null;
}

const SellCell = ({ item, onSell }) => {
    const price = Math.floor((item.sellingPrice || 0) * (1 + (item.gain || 0) * 0.1));
    const src = getItemSrc(item);

    return (
        <div className="shop_cell" onClick={onSell}>
            {src && <img src={src} referrerPolicy="no-referrer" className="shop_cell_img" alt="" />}
            {item.gain > 0 && <span className="shop_cell_tag shop_cell_gain">+{item.gain}</span>}
            {item.quantity > 1 && <span className="shop_cell_qty">×{item.quantity}</span>}
            <span className="shop_cell_price">{price}</span>
        </div>
    );
};

const BuyCell = ({ shopItem, owned, onBuy }) => {
    const src = getItemSrc(shopItem.item);

    return (
        <div className="shop_cell" onClick={onBuy}>
            {src && <img src={src} referrerPolicy="no-referrer" className="shop_cell_img" alt="" />}
            {owned > 0 && <span className="shop_cell_owned">×{owned}</span>}
            <span className="shop_cell_name_small">{shopItem.item.name}</span>
            <span className="shop_cell_price">{shopItem.price}</span>
        </div>
    );
};

const Shop = () => {
    const dispatch = useDispatch();
    const [tab, setTab] = useState('buy');
    const currentCharacter = useSelector(state => state.counter.currentCharacter);
    const inventory = useSelector(state => state.counter.characters[currentCharacter].inventory);
    const goldItem = inventory.find(item => item.id === 0);
    const currentGold = goldItem ? goldItem.quantity : 0;

    const sellableItems = inventory
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => item && item.selling && item.id !== 0);

    function buy(shopItem) {
        if (currentGold < shopItem.price) {
            alert('Недостаточно серебра');
            return;
        }
        dispatch(spendGold(shopItem.price));
        dispatch(addItemToInventory({ ...shopItem.item, quantity: 1 }));
    }

    function sell(item, index) {
        const price = Math.floor((item.sellingPrice || 0) * (1 + (item.gain || 0) * 0.1));
        const inventoryCopy = [...inventory];
        if (item.stacking && item.quantity > 1) {
            inventoryCopy[index] = { ...item, quantity: item.quantity - 1 };
        } else {
            inventoryCopy.splice(index, 1);
        }
        dispatch(updateInventory(inventoryCopy));
        dispatch(addGold(price));
    }

    return (
        <div className="shop_container">
            <div className="shop_header">
                <div className="shop_title">Магазин</div>
                <div className="shop_gold">Серебро: {currentGold}</div>
                <button className="btn__second shop_back" onClick={() => dispatch(setRoute('home'))}>← Назад</button>
            </div>
            <div className="shop_tabs">
                <button
                    className={`shop_tab${tab === 'buy' ? ' shop_tab--active' : ''}`}
                    onClick={() => setTab('buy')}
                >Купить</button>
                <button
                    className={`shop_tab${tab === 'sell' ? ' shop_tab--active' : ''}`}
                    onClick={() => setTab('sell')}
                >Продать</button>
            </div>
            {tab === 'buy' && (
                <div className="shop_grid">
                    {shopItems.map((shopItem, index) => {
                        const inInv = inventory.find(i => i.id === shopItem.item.id);
                        const owned = inInv ? inInv.quantity : 0;
                        return (
                            <BuyCell
                                key={index}
                                shopItem={shopItem}
                                owned={owned}
                                onBuy={() => buy(shopItem)}
                            />
                        );
                    })}
                </div>
            )}
            {tab === 'sell' && (
                <div className="shop_grid">
                    {sellableItems.length === 0 && (
                        <div className="shop_empty">Нет предметов для продажи</div>
                    )}
                    {sellableItems.map(({ item, index }) => (
                        <SellCell key={index} item={item} onSell={() => sell(item, index)} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Shop;
