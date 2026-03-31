import './Inventory.css';
import InventoryPoint from './InventoryPoint/InventoryPoint';
import { useSelector, useDispatch } from 'react-redux'
import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { updateInventory, updateItemInventory, setArmory, setQuickSlot } from '../../redux/store/store'
import ArmoryPoint from './ArmoryPoint/ArmoryPoint';
import { calculateProtection, calculateTotalStats } from '../../utils/gameCalc';

import EnhanceAnimation from './EnhanceAnimation/EnhanceAnimation';


const Inventory = ({ isActive }) => {
    const dispatch = useDispatch();
    let inventoryCell = [];
    let currentCharacter = useSelector(state => state.counter.currentCharacter);
    let inventory = useSelector(state => state.counter.characters[currentCharacter].inventory);
    let armory = useSelector(state => state.counter.characters[currentCharacter].armory);
    let state = useSelector(state => state.counter.characters[currentCharacter]);
    let quickSlots = useSelector(s => s.counter.quickSlots) || [null, null];
    const [isGain, setisGain] = useState(false);
    const [success, setSuccess] = useState(false);
    const [fail, setFail] = useState(false);
    const [gainType, setGainType] = useState('');
    const [scrollId, setScrollId] = useState(null);
    const lastTapRef = useRef({ time: 0, index: -1 });
    const blockNextTapRef = useRef(false);

    for (let i = 0; i < 50; i++) {
        inventoryCell.push(1);
    }

    let successAnimationTimer = useRef(null);

    useEffect(() => {
        if (successAnimationTimer) {
            clearTimeout(successAnimationTimer.current);
        }
        if (success || fail) {
            successAnimationTimer.current = setTimeout(() => {
                setSuccess(false);
                setFail(false);
            }, 3000);
        }
        return () => clearTimeout(successAnimationTimer.current);
    }, [success, fail]);

    function startAnimation(isSuccess = true) {
        setSuccess(false);
        setFail(false);
        setTimeout(() => {
            if (isSuccess) setSuccess(true);
            else setFail(true);
        }, 0);
    }

    function cancelGain() {
        setScrollId(null);
        setisGain(false);
        setGainType('');
    }

    function goItem(index) {
        if (!inventory[index]) return;
        let inventoryItemCopy = { ...inventory[index] };
        let armoryCopy = [...armory];
        let inventoryCopy = [...inventory];
        switch (inventory[index].type) {
            case 'potion': {
                const emptySlot = quickSlots.findIndex(s => s === null);
                if (emptySlot !== -1) {
                    dispatch(setQuickSlot({ slotIndex: emptySlot, item: inventoryItemCopy }));
                }
                break;
            }
            case 'gain':
                setGainType(inventory[index].gainType);
                setScrollId(index);
                setisGain(true);
                break;
            case 'weapon':
                if (armoryCopy[3] == null) {
                    dispatch(setArmory({ id: 3, item: inventoryItemCopy }));
                    inventoryCopy.splice(index, 1);
                    dispatch(updateInventory(inventoryCopy));
                } else {
                    const oldWeapon = { ...armoryCopy[3] };
                    dispatch(setArmory({ id: 3, item: inventoryItemCopy }));
                    inventoryCopy.splice(index, 1, oldWeapon);
                    dispatch(updateInventory(inventoryCopy));
                }
                break;
            case 'armor': {
                const slotMap = { legs: 10, head: 1, hands: 8, necklace: 0, cloak: 2, chest: 4, shield: 5, belt: 7 };
                const subtype = inventory[index].subtype;
                if (subtype === 'ring') {
                    const slot = armoryCopy[9] == null ? 9 : armoryCopy[11] == null ? 11 : null;
                    if (slot !== null) {
                        dispatch(setArmory({ id: slot, item: inventoryItemCopy }));
                        inventoryCopy.splice(index, 1);
                        dispatch(updateInventory(inventoryCopy));
                    }
                } else if (slotMap[subtype] !== undefined && armoryCopy[slotMap[subtype]] == null) {
                    dispatch(setArmory({ id: slotMap[subtype], item: inventoryItemCopy }));
                    inventoryCopy.splice(index, 1);
                    dispatch(updateInventory(inventoryCopy));
                }
                break;
            }
            default:
                break;
        }
    }

    function handleTouchStart(index) {
        const now = Date.now();
        if (now - lastTapRef.current.time < 300 && lastTapRef.current.index === index) {
            if (!isGain) goItem(index);
            lastTapRef.current = { time: 0, index: -1 };
            blockNextTapRef.current = true; // блокируем onClick от этого же тапа
        } else {
            lastTapRef.current = { time: now, index };
        }
    }

    // Single tap on inventory item: enhance if gain mode active, else no-op
    function handleTap(index) {
        if (blockNextTapRef.current) { blockNextTapRef.current = false; return; }
        if (!inventory[index]) return;
        if (!isGain) return;

        const item = inventory[index];
        const scrollCopy = { ...inventory[scrollId] };

        // If tapped on scroll itself — cancel
        if (index === scrollId) { cancelGain(); return; }

        if (item.gain == null || item.type !== gainType) return;

        const itemCopy = { ...item };
        const ok = itemCopy.gain < 3 || Math.random() * 100 < 50 - itemCopy.gain * 2;

        if (ok) {
            startAnimation(true);
            itemCopy.gain += 1;
            dispatch(updateItemInventory({ id: index, item: itemCopy }));
            if (scrollCopy.quantity > 0) {
                scrollCopy.quantity -= 1;
                dispatch(updateItemInventory({ id: scrollId, item: scrollCopy }));
            }
        } else {
            startAnimation(false);
            const inventoryCopy = [...inventory];
            inventoryCopy.splice(index, 1);
            dispatch(updateInventory(inventoryCopy));
            if (scrollCopy.quantity > 0) {
                scrollCopy.quantity -= 1;
                const adjustedId = index > scrollId ? scrollId : scrollId - 1;
                dispatch(updateItemInventory({ id: adjustedId, item: scrollCopy }));
            }
        }
        cancelGain();
    }

    // Tap on armory slot while in gain mode
    function handleArmoryEnhance(armoryIdx) {
        if (!isGain) return;
        const item = armory[armoryIdx];
        if (!item || item.gain == null || item.type !== gainType) return;

        const scrollCopy = { ...inventory[scrollId] };
        const itemCopy = { ...item };
        const ok = itemCopy.gain < 3 || Math.random() * 100 < 50 - itemCopy.gain * 2;

        if (ok) {
            startAnimation(true);
            itemCopy.gain += 1;
            dispatch(setArmory({ id: armoryIdx, item: itemCopy }));
        } else {
            startAnimation(false);
            dispatch(setArmory({ id: armoryIdx, item: null }));
        }
        if (scrollCopy.quantity > 0) {
            scrollCopy.quantity -= 1;
            dispatch(updateItemInventory({ id: scrollId, item: scrollCopy }));
        }
        cancelGain();
    }

    const { str, agi, int } = calculateTotalStats(state, armory);
    const classNames = { warrior: 'Воин', mage: 'Маг', archer: 'Лучник' };

    const content = (
        <div className="inventory_container">
            {(success || fail) && <EnhanceAnimation success={success} />}
            <div className="inventory_name">
                <div className='inventory_name_text'>
                    {isGain
                        ? `Выберите ${gainType === 'weapon' ? 'оружие' : 'броню'} для улучшения`
                        : 'Инвентарь'}
                </div>
                <button className="inventory_close" onClick={isGain ? cancelGain : () => isActive(false)}>
                    {isGain ? 'Отмена' : 'X'}
                </button>
            </div>
            <div className="inventory_top_container">
                <div className="char_specifications_container">
                    <p className="char_specifications_text">Имя: {state.name}</p>
                    <p className="char_specifications_text">Класс: {classNames[state.characterClass] || state.characterClass}</p>
                    <p className="char_specifications_text">Уровень: {state.lvl}</p>
                    <p className="char_specifications_text">HP: {state.currentHealth}/{state.health}</p>
                    <p className="char_specifications_text">MP: {state.currentMana}/{state.mana}</p>
                    <p className="char_specifications_text">Сила: {str}</p>
                    <p className="char_specifications_text">Ловкость: {agi}</p>
                    <p className="char_specifications_text">Интеллект: {int}</p>
                    <p className="char_specifications_text">Защита: {calculateProtection(armory)}</p>
                </div>
                <div className="inventory_armor">
                    {armory.map((e, index) => (
                        <ArmoryPoint
                            armorItem={e}
                            index={index}
                            key={index}
                            isGainMode={isGain && e && e.type === gainType && e.gain != null}
                            onEnhance={() => handleArmoryEnhance(index)}
                        />
                    ))}
                </div>
            </div>
            <div className="inventory_bottom_container">
                {inventoryCell.map((e, index) => index < inventory.length ?
                    <div
                        onDoubleClick={() => !isGain && goItem(index)}
                        onClick={() => handleTap(index)}
                        onTouchStart={() => handleTouchStart(index)}
                        key={index}
                    >
                        <InventoryPoint
                            id={index}
                            item={inventory[index]}
                            selected={scrollId}
                            gainMode={isGain && inventory[index]?.type === gainType && inventory[index]?.gain != null}
                        />
                    </div>
                    : <div className="inventory_item_container" key={index}></div>)}
            </div>
        </div>
    );

    return ReactDOM.createPortal(content, document.body);
}

export default Inventory;
