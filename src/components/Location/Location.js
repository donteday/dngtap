import './Location.css';
import { locations, itemList } from '../../data/data';
import { useEffect, useState, useRef } from 'react';
import { addExp, updateInventory, healthHandler, setRoute, clearSkillEffect } from '../../redux/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { calculateProtection, calculateDamage } from '../../utils/gameCalc';
import Inventory from '../Inventory/Inventory';
import DropText from '../DropText/DropText';
import SpriteAnimation from '../SpriteAnimation/SpriteAnimation';
import spriteSheetImage from '../../img/animation/sword.png';

const MOB_COUNTER_ATTACK_CHANCE = 70;

const Location = ({ id, topMessages, setTopMessages, onBack }) => {
    const mob = locations[id].mobs;
    const [mobCurrentHp, setMobCurrentHp] = useState(mob.hp);
    const [showAttackAnimation, setShowAttackAnimation] = useState(false);
    const [isAttack, setIsAttack] = useState(false);
    const [inventoryIsActive, setInventoryIsActive] = useState(false);
    const [dropInfoIsActive, setDropInfoIsActive] = useState(false);
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [textDropIsActive, setTextDropIsActive] = useState(false);
    const [damageNumbers, setDamageNumbers] = useState([]);
    const [isBoss, setIsBoss] = useState(false);
    const [mobMaxHp, setMobMaxHp] = useState(mob.hp);
    const [killCount, setKillCount] = useState(0);

    const dispatch = useDispatch();
    const mobRef = useRef();
    const dmgIdRef = useRef(0);
    const killCountRef = useRef(0);
    const isBossRef = useRef(false);

    const currentCharacter = useSelector(state => state.counter.currentCharacter);
    const inventory = useSelector(state => state.counter.characters[currentCharacter].inventory);
    const armory = useSelector(state => state.counter.characters[currentCharacter].armory);
    const character = useSelector(state => state.counter.characters[currentCharacter]);
    const skillEffect = useSelector(state => state.counter.skillEffect);

    // Refs to avoid stale closures inside setInterval
    const skillEffectRef = useRef(skillEffect);
    const armoryRef = useRef(armory);
    const characterRef = useRef(character);
    const inventoryRef = useRef(inventory);

    useEffect(() => { skillEffectRef.current = skillEffect; }, [skillEffect]);
    useEffect(() => { armoryRef.current = armory; }, [armory]);
    useEffect(() => { characterRef.current = character; }, [character]);
    useEffect(() => { inventoryRef.current = inventory; }, [inventory]);

    // Instant damage skills apply immediately
    useEffect(() => {
        if (skillEffect.instantDamage > 0) {
            setMobCurrentHp(prev => Math.max(0, prev - skillEffect.instantDamage));
            dispatch(clearSkillEffect());
        }
        // eslint-disable-next-line
    }, [skillEffect.instantDamage]);

    // Drop text queue
    useEffect(() => {
        if (messages.length === 0) {
            setTextDropIsActive(false);
            return;
        }
        let i = 0;
        setCurrentMessage(messages[0]);
        setTextDropIsActive(true);
        const intervalId = setInterval(() => {
            i++;
            if (i < messages.length) {
                setCurrentMessage(messages[i]);
            } else {
                clearInterval(intervalId);
                setTextDropIsActive(false);
                setMessages([]);
                setCurrentMessage('');
            }
        }, 850);
        return () => clearInterval(intervalId);
    }, [messages]);

    // Combat loop
    useEffect(() => {
        let timer = null;
        if (isAttack && mobCurrentHp > 0) {
            mobRef.current.classList.add('mob__attack-state');
            setShowAttackAnimation(true);
            timer = setInterval(attack, 600);
        }
        if (mobCurrentHp <= 0) {
            onMobKilled();
            mobRef.current.classList.remove('mob__attack-state');
            setShowAttackAnimation(false);
        }
        return () => clearInterval(timer);
        // eslint-disable-next-line
    }, [isAttack, mobCurrentHp]);

    function onMobKilled() {
        const wasBoss = isBossRef.current;
        const rewardMult = wasBoss ? 3 : 1;
        setTopMessages(prev => [...prev, `Вами был убит ${wasBoss ? '[БОСС] ' : ''}${mob.name}`]);
        setIsAttack(false);
        dispatch(addExp(mob.exp * rewardMult));
        processDrops(rewardMult);

        killCountRef.current += 1;
        setKillCount(killCountRef.current);
        const nextIsBoss = killCountRef.current % 10 === 0;
        const nextMaxHp = mob.hp * (nextIsBoss ? 3 : 1);
        isBossRef.current = nextIsBoss;
        setIsBoss(nextIsBoss);
        setMobMaxHp(nextMaxHp);
        setMobCurrentHp(nextMaxHp);
    }

    function processDrops(goldMult = 1) {
        let inventoryCopy = [...inventoryRef.current];
        const dropList = itemList.filter(item => mob.dropList.includes(item.id));
        let maxDrops = 2;
        const droppedItems = [];
        const newMessages = [];

        dropList.forEach(baseItem => {
            if (maxDrops <= 0 || Math.random() * 100 >= baseItem.chance) return;
            maxDrops--;

            let dropItem = baseItem.id === 0
                ? { ...baseItem, quantity: Math.round(Math.random() * mob.gold * goldMult) + 1 }
                : { ...baseItem };

            newMessages.push(`Получен предмет [${dropItem.name}]`);
            droppedItems.push(dropItem);

            const existing = inventoryCopy.find(i => i.id === dropItem.id);
            if (existing && dropItem.stacking) {
                inventoryCopy = inventoryCopy.map(i =>
                    i.id === dropItem.id ? { ...i, quantity: i.quantity + dropItem.quantity } : i
                );
            } else {
                inventoryCopy.push(dropItem);
            }
        });

        setTopMessages(prev => [...prev, ...newMessages]);
        setMessages(droppedItems);
        dispatch(updateInventory(inventoryCopy));
    }

    function mobAttack() {
        const protection = calculateProtection(armoryRef.current);
        const effectiveAttack = mob.attack * (isBossRef.current ? 2 : 1);
        const reducedDamage = effectiveAttack / (1 + protection / 100);
        dispatch(healthHandler(-Math.max(1, Math.round(reducedDamage))));
    }

    function attack() {
        if (Math.random() * 100 > MOB_COUNTER_ATTACK_CHANCE) mobAttack();

        const { dmg, critChance } = calculateDamage(characterRef.current, armoryRef.current);
        const effect = skillEffectRef.current;
        const isCrit = effect.guaranteedCrit || Math.random() * 100 < critChance;
        const finalDmg = Math.round((isCrit ? dmg * 2 : dmg) * effect.damageMultiplier);

        setMobCurrentHp(prev => prev - finalDmg);

        const id = ++dmgIdRef.current;
        setDamageNumbers(prev => [...prev, { id, value: finalDmg, isCrit }]);
        setTimeout(() => setDamageNumbers(prev => prev.filter(d => d.id !== id)), 900);

        if (effect.damageMultiplier !== 1 || effect.guaranteedCrit) {
            dispatch(clearSkillEffect());
        }
    }

    const dropListItems = itemList.filter(i => mob.dropList.includes(i.id));

    let locationBg = null;
    try { locationBg = require(`../../img/location/location_${id}.jpg`); } catch {}
    const locationBgUrl = locationBg || locations[id].imgUrl || '';

    let mobImg = null;
    try { mobImg = require(`../../img/mobs/${mob.id}.png`); } catch {}
    const mobImgUrl = mobImg || mob.imgUrl || '';

    return (
        <div className="location" style={{ backgroundImage: `url(${locationBgUrl})` }}>
            {onBack && (
                <button className="icon_btn location__back_btn" onClick={onBack}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"/>
                    </svg>
                    <span className="icon_btn_label">Локации</span>
                </button>
            )}
            <div className='mobBox'>
                <div className="mob_info">
                    <div className={`mob_name${isBoss ? ' mob_name_boss' : ''}`}>
                        {isBoss ? '[БОСС] ' : ''}{mob.name}
                    </div>
                    <div className="mobHpBar-container">
                        <div className={`mobHpBar${isBoss ? ' mobHpBar_boss' : ''}`} style={{ width: `${Math.max(0, (mobCurrentHp / mobMaxHp) * 100)}%` }} />
                        <div className="mobHpBar_text">{Math.max(0, mobCurrentHp)}/{mobMaxHp}</div>
                    </div>
                    <div className="boss_progress_row">
                        {isBoss ? (
                            <span className="boss_progress_label boss_active_label">BOSS</span>
                        ) : (
                            <>
                                <span className="boss_progress_label">ДО БОССА</span>
                                <div className="boss_progress_bar">
                                    {Array.from({ length: 10 }).map((_, i) => (
                                        <div key={i} className={`boss_pip${i < (killCount % 10) ? ' boss_pip_filled' : ''}`} />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
                {showAttackAnimation &&
                    <div className='attackAnimation'>
                        <SpriteAnimation
                            spriteSheet={spriteSheetImage}
                            frameWidth={192}
                            frameHeight={192}
                            totalFrames={15}
                            fps={15}
                            startFrame={0}
                            endFrame={14}
                        />
                    </div>
                }
                <div
                    className={`mob${isBoss ? ' mob_boss' : ''}${!isAttack ? ' mob_idle' : ''}`}
                    ref={mobRef}
                    onClick={() => setIsAttack(true)}
                    style={{ backgroundImage: `url(${mobImgUrl})` }}
                />
                <div className="damage_numbers_container">
                    {damageNumbers.map(d => (
                        <div key={d.id} className={`damage_number${d.isCrit ? ' damage_crit' : ''}`}>
                            {d.isCrit ? `КРИТ! ${d.value}` : d.value}
                        </div>
                    ))}
                </div>
                {textDropIsActive && <DropText drop={currentMessage} />}
            </div>

            <div className="location__buttons">
                <button className="icon_btn" onClick={() => setInventoryIsActive(true)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
                    </svg>
                    <span className="icon_btn_label">Инв</span>
                </button>
                <button className="icon_btn" onClick={() => setDropInfoIsActive(true)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                    </svg>
                    <span className="icon_btn_label">Дроп</span>
                </button>
                <button className="icon_btn" onClick={() => dispatch(setRoute('home'))}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                    <span className="icon_btn_label">Меню</span>
                </button>
            </div>

            {inventoryIsActive && <Inventory isActive={setInventoryIsActive} />}

            {dropInfoIsActive && (
                <div className="drop_info_overlay" onClick={() => setDropInfoIsActive(false)}>
                    <div className="drop_info_panel" onClick={e => e.stopPropagation()}>
                        <div className="drop_info_title">Дроп: {mob.name}</div>
                        <div className="drop_info_stats">
                            <span>HP: {mob.hp}</span>
                            <span>Атака: {mob.attack}</span>
                            <span>Опыт: {mob.exp}</span>
                            <span>Серебро: 1–{mob.gold}</span>
                        </div>
                        <div className="drop_info_list">
                            {dropListItems.map(item => (
                                <div key={item.id} className="drop_info_item">
                                    <span className="drop_item_name">{item.name}</span>
                                    <span className="drop_item_chance">{item.chance}%</span>
                                </div>
                            ))}
                        </div>
                        <button className="btn__second" onClick={() => setDropInfoIsActive(false)}>Закрыть</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Location;
