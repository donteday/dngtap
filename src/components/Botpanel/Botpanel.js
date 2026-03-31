import './Botpanel.css';
import { useSelector, useDispatch } from 'react-redux';
import { spendMana, setSkillEffect, consumeQuickSlot, clearQuickSlot, setQuickSlot } from '../../redux/store/store';
import { classSkills } from '../../data/data';
import { useState, useEffect, useRef } from 'react';

const SLOT_COUNT = 4;

function getSlotSrc(slot) {
    if (slot?.type !== 'potion') return null;
    let local = null;
    try { local = require(`../../img/items/${slot.id}.png`); } catch {}
    return local || slot.imgUrl || null;
}

const SlotCell = ({ slot, cooldown, disabled, onTap, onLongPress }) => {
    const longPressTimer = useRef(null);
    const longPressed = useRef(false);
    const potionSrc = getSlotSrc(slot);

    function startPress() {
        longPressed.current = false;
        longPressTimer.current = setTimeout(() => {
            longPressed.current = true;
            onLongPress();
        }, 500);
    }

    function endPress(e) {
        e?.preventDefault();
        clearTimeout(longPressTimer.current);
        if (!longPressed.current) onTap();
        longPressed.current = false;
    }

    function cancelPress() {
        clearTimeout(longPressTimer.current);
        longPressed.current = false;
    }

    const cls = [
        'slot_cell',
        !slot ? 'slot_empty' : '',
        slot?.type === 'potion' ? 'slot_potion' : '',
        slot?.type === 'skill' ? 'slot_skill' : '',
        disabled ? 'slot_disabled' : '',
    ].filter(Boolean).join(' ');

    return (
        <div
            className={cls}
            onTouchStart={startPress}
            onTouchEnd={endPress}
            onTouchMove={cancelPress}
            onClick={() => onTap()}
            onContextMenu={e => { e.preventDefault(); onLongPress(); }}
        >
            {potionSrc && (
                <img src={potionSrc} referrerPolicy="no-referrer" className="slot_item_img" alt="" />
            )}
            {!slot && <span className="slot_empty_plus">+</span>}
            {slot?.type === 'skill' && (
                <>
                    <span className="slot_abbr">{slot.name.slice(0, 5)}</span>
                    <span className="slot_mp">{slot.manaCost}MP</span>
                    {cooldown > 0 && <div className="skill_cooldown_overlay">{cooldown}s</div>}
                </>
            )}
            {slot?.type === 'potion' && slot.quantity > 1 && (
                <span className="slot_qty">×{slot.quantity}</span>
            )}
        </div>
    );
};

const BotPanel = () => {
    const currentCharacter = useSelector(state => state.counter.currentCharacter);
    const character = useSelector(state => state.counter.characters[currentCharacter]);
    const quickSlots = useSelector(state => state.counter.quickSlots) || [];
    const inventory = useSelector(state => state.counter.characters[currentCharacter].inventory);
    const dispatch = useDispatch();

    const skills = classSkills[character.characterClass] || [];
    const [cooldowns, setCooldowns] = useState({});
    const [pickerSlot, setPickerSlot] = useState(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setCooldowns(prev => {
                const next = { ...prev };
                let changed = false;
                Object.keys(next).forEach(k => {
                    if (next[k] > 0) { next[k]--; changed = true; }
                    if (next[k] <= 0) delete next[k];
                });
                return changed ? next : prev;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    function handleTap(index) {
        const slot = quickSlots[index];
        if (!slot) return;
        if (slot.type === 'skill') {
            const cd = cooldowns[slot.id] || 0;
            if (cd > 0 || character.currentMana < slot.manaCost) return;
            let instantDamage = 0;
            if (slot.instantScaleStat) {
                instantDamage = Math.round((character[slot.instantScaleStat] || 0) * slot.instantScaleFactor);
            }
            dispatch(spendMana(slot.manaCost));
            dispatch(setSkillEffect({ ...slot.effect, instantDamage }));
            setCooldowns(prev => ({ ...prev, [slot.id]: slot.cooldown }));
        } else if (slot.type === 'potion') {
            dispatch(consumeQuickSlot(index));
        }
    }

    function assign(item) {
        dispatch(setQuickSlot({ slotIndex: pickerSlot, item }));
        setPickerSlot(null);
    }

    function clearSlot() {
        dispatch(clearQuickSlot(pickerSlot));
        setPickerSlot(null);
    }

    const potions = inventory.filter(item => item.type === 'potion');
    const slots = Array(SLOT_COUNT).fill(null).map((_, i) => quickSlots[i] ?? null);

    return (
        <div className='botpanel_container'>
            <div className='charinfo_container'>
                <div className='charhp_container'>
                    <div className="charhp" style={{ width: `${(character.currentHealth / character.health) * 100}%` }} />
                    <div className="charhp_text">{character.currentHealth}/{character.health}</div>
                </div>
                <div className='charmp_container'>
                    <div className="charmp" style={{ width: `${(character.currentMana / character.mana) * 100}%` }} />
                    <div className="charmp_text">{character.currentMana}/{character.mana}</div>
                </div>
                <div className='charlvl_container'>
                    <div className='charlvl' style={{ width: `${(character.currentExp / character.maxExp) * 100}%` }} />
                    <div className='charlvl_text'>{character.lvl} ур. {character.currentExp}/{character.maxExp}</div>
                </div>
            </div>

            <div className="slots_row">
                {slots.map((slot, index) => {
                    const cd = slot?.type === 'skill' ? (cooldowns[slot.id] || 0) : 0;
                    const disabled = slot?.type === 'skill' && (cd > 0 || character.currentMana < slot.manaCost);
                    return (
                        <SlotCell
                            key={index}
                            slot={slot}
                            cooldown={cd}
                            disabled={disabled}
                            onTap={() => handleTap(index)}
                            onLongPress={() => setPickerSlot(index)}
                        />
                    );
                })}
            </div>

            {pickerSlot !== null && (
                <div className="picker_overlay" onClick={() => setPickerSlot(null)}>
                    <div className="picker_panel" onClick={e => e.stopPropagation()}>
                        <div className="picker_section_title">Навыки</div>
                        {skills.map(skill => (
                            <div key={skill.id} className="picker_item" onClick={() => assign({ type: 'skill', ...skill })}>
                                <span>{skill.name}</span>
                                <span className="picker_item_right">{skill.manaCost} MP</span>
                            </div>
                        ))}
                        <div className="picker_section_title">Зелья</div>
                        {potions.length === 0 && <div className="picker_empty">Нет зелий</div>}
                        {potions.map((item, i) => (
                            <div key={i} className="picker_item" onClick={() => assign(item)}>
                                <span>{item.name}</span>
                                <span className="picker_item_right">×{item.quantity}</span>
                            </div>
                        ))}
                        <div className="picker_clear" onClick={clearSlot}>Очистить слот</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BotPanel;
