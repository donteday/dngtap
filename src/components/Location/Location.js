import './Location.css';
import { locations } from '../../data/data'
import { useEffect, useState, dispatch } from 'react';
import { addExp, updateInventory, healthHandler, setRoute } from '../../redux/store/store'
import { useDispatch } from 'react-redux';


const Location = ({ id }) => {
    const mob = locations[id].mobs;
    const [mobCurrentHp, setMobCurrentHp] = useState(mob.hp);
    const [isAttack, setIsAttack] = useState(false);
    const dispatch = useDispatch();
    const [timer, setTimer] = useState(null);
    const [mobAttackTimer, setMobAttackTimer] = useState(null);


    useEffect(() => {
        if (isAttack && mobCurrentHp > 0) {
            // mobRef.current.classList.add("mob__attack-state");
            // mobAttackRef.current.classList.add("mob__attack");
            const newtimer = setInterval(() => attack(), 600);
            const newmobAttackTimer = setInterval(() => mobAttack(), 1000);
            setTimer(newtimer);
            setMobAttackTimer(newmobAttackTimer);
        }
        if (mobCurrentHp <= 0) {
            mobIsKilled()
            // mobRef.current.classList.remove("mob__attack-state");
            // mobAttackRef.current.classList.remove("mob__attack");
            // addToInventory();
        }




        return () => {
            clearInterval(timer);
            clearInterval(mobAttackTimer);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAttack, mobCurrentHp]);

    function mobIsKilled() {
        setIsAttack(false);
        setMobCurrentHp(mob.hp);
        dispatch(addExp(mob.exp));
    }

    function mobAttack() {
        console.log(123);
        // dispatch(healthHandler(-Math.round((mobList[0].attack - mobList[0].attack * calculateProtection() / 100))));
        dispatch(healthHandler(-11));

    }

    function howDamage() {
        return { dmg: 10 }; // TODO 
    }

    function attack() {
        if (Math.random() * 100 < howDamage().critChance) {
            setMobCurrentHp(mobCurrentHp - howDamage().dmg * 2);
        } else {
            setMobCurrentHp(mobCurrentHp - howDamage().dmg);
        }

        // dispatch(healthHandler(-Math.round((mobList[0].attack - mobList[0].attack * calculateProtection() / 100))));
        // console.log(Math.round((mobList[0].attack - mobList[0].attack * calculateProtection() / 100)));
        // mobAttackRef.current.style.top = `${Math.random() * 150 - 30}px`;
    }

    return (
        <div className="location" style={{ backgroundImage: `url(${require(`../../img/location/location_${id}.jpg`)})` }} >

            <div className='mobBox'>

                <div className='mob' onClick={() => setIsAttack(true)} style={{ backgroundImage: `url(${require(`../../img/mobs/${mob.id}.png`)})` }}>
                    <div className="mobHpBar-container">
                        <div className="mobHpBar" style={{ width: `${(mobCurrentHp / mob.hp) * 100}%` }}>
                        </div>
                    </div>
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