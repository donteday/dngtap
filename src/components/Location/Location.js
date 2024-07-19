import './Location.css';

const Location = ({id}) => {
    return (
        <div className="location" style={{backgroundImage: `url(${require(`../../img/location/location_${id}.jpg`)})`}} >

            <div className='mobBox'>

                <div className='mob'>

                </div>
                {/* <div className="mobHpBar-container">
                    <div className="mobHpBar" style={{ width: `${(mobCurrentHP / mobList[0].maxHP) * 100}%` }}>
                    </div>
                </div>
                {textDropisActive ? <DropText drop={currentMessage} /> : ''} */}
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