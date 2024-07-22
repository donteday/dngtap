import './Location.css';
import { locations } from '../../data/data'
import { useEffect, useState, dispatch, useRef } from 'react';
import { addExp, updateInventory, healthHandler, setRoute } from '../../redux/store/store'
import { useDispatch } from 'react-redux';


const Location = ({ id, topMessages ,setTopMessages}) => {
    const mob = locations[id].mobs;
    const [mobCurrentHp, setMobCurrentHp] = useState(mob.hp);
    const [isAttack, setIsAttack] = useState(false);
    const dispatch = useDispatch();
    const KMOBATTACK = 70;
    const mobRef = useRef();
    const mobAttackRef = useRef();

    useEffect(() => {
        let timer = null;
        if (isAttack && mobCurrentHp > 0) {
            mobRef.current.classList.add("mob__attack-state");
            mobAttackRef.current.classList.add("mob__attack");
            timer = setInterval(() => attack(), 600);
        }
        if (mobCurrentHp <= 0) {
            mobIsKilled()
            mobRef.current.classList.remove("mob__attack-state");
            mobAttackRef.current.classList.remove("mob__attack");
            // addToInventory();
        }
        return () => {
            clearInterval(timer);
        }
    }, [isAttack, mobCurrentHp]);
    function mobIsKilled() {
        setTopMessages([...topMessages, `Вами был убит противник [${mob.name}]`])
        setIsAttack(false);
        setMobCurrentHp(mob.hp);
        dispatch(addExp(mob.exp));
    }

    function mobAttack() {
        // dispatch(healthHandler(-Math.round((mobList[0].attack - mobList[0].attack * calculateProtection() / 100))));
        dispatch(healthHandler(-mob.attack));

    }
    function howDamage() {
        return { dmg: 120 }; // TODO 
    }
    function attack() {
        console.log(Math.random() * 100);
        if (Math.random() * 100 > KMOBATTACK) mobAttack();
        if (Math.random() * 100 < howDamage().critChance) {
            setMobCurrentHp(mobCurrentHp - howDamage().dmg * 2);
        } else {
            setMobCurrentHp(mobCurrentHp - howDamage().dmg);
        }

        // dispatch(healthHandler(-Math.round((mobList[0].attack - mobList[0].attack * calculateProtection() / 100))));
        // console.log(Math.round((mobList[0].attack - mobList[0].attack * calculateProtection() / 100)));
        mobAttackRef.current.style.top = `${Math.random() * 150 - 30}px`;
    }

    return (
        <div className="location" style={{ backgroundImage: `url(${require(`../../img/location/location_${id}.jpg`)})` }} >

            <div className='mobBox'>
                <div className="mobHpBar-container">
                    <div className="mobHpBar" style={{ width: `${(mobCurrentHp / mob.hp) * 100}%` }}></div>
                </div>
                <div className='mob' ref={mobRef} onClick={() => setIsAttack(true)} style={{ backgroundImage: `url(${require(`../../img/mobs/${mob.id}.png`)})` }}>
                <div ref={mobAttackRef}></div>
                </div>

                {/* {textDropisActive ? <DropText drop={currentMessage} /> : ''} */}
                {/* <div className='mob' ref={mobRef} onClick={() => setIsAttack(true)}>
                    <div ref={mobAttackRef}></div>
                </div> */}
            </div>
            {/* <div className="location__buttons">
                <button onClick={() => setIsActive(true)} className='btn__second'>Инвентарь</button>
                <button onClick={() => dispatch(setRoute('home'))} className='btn__second'>Меню</button>
            </div> */}

        </div>
    );
}

export default Location;