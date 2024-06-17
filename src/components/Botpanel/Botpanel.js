import './Botpanel.css';
import { useSelector } from 'react-redux'
import { healthHandler } from '../../redux/store/store'
import { useDispatch } from 'react-redux'




const BotPanel = () => {
    let currentCharacter = useSelector(state => state.counter.currentCharacter);
    const character = useSelector(state => state.counter.characters[currentCharacter]);

    const dispatch = useDispatch();
    return (
        <div className='botpanel_container'>
            {/* <div className="botpanel-btn_container"></div> */}
            <div className='charinfo_container'>
                <div className='charhp_container'>
                    <div className="charhp" style={{ width: `${(character.currentHealth / character.health) * 100}%` }}>
                        <div className="charhp_text">
                            {character.currentHealth}/{character.health}
                        </div>
                    </div>
                </div>
                <div className='charmp_container'>100/100</div>
                <div className='charlvl_container' >
                    <div className='charlvl' style={{ width: `${(character.currentExp / character.maxExp) * 100}%` }}>
                    </div>
                    <div className='charlvl_text'>
                        {character.lvl} ур. {character.currentExp}/{character.maxExp}
                    </div>
                </div>
            </div>
            <div className='charskill_container' onClick={() => dispatch(healthHandler(10))}>
                health+
            </div>
            <div className='charskill_container'></div>
            <div className='charskill_container'></div>
            <div className='charskill_container'></div>
            <div className='charskill_container'></div>
            <div className='charskill_container'></div>
        </div>
    );
}

export default BotPanel;