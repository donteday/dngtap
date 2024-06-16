import './Botpanel.css';
import { useSelector } from 'react-redux'
import { healthHandler } from '../../redux/store/store'
import { useDispatch } from 'react-redux'




const BotPanel = () => {
    const health = useSelector(state => state.counter.health);
    const currentHealth = useSelector(state => state.counter.currentHealth);
    const currentExp = useSelector(state => state.counter.currentExp);
    const maxExp = useSelector(state => state.counter.maxExp);
    const lvl = useSelector(state => state.counter.lvl);
    const dispatch = useDispatch();
    return (
        <div className='botpanel_container'>
            {/* <div className="botpanel-btn_container"></div> */}
            <div className='charinfo_container'>
                <div className='charhp_container'>
                    <div className="charhp" style={{ width: `${(currentHealth / health) * 100}%` }}>
                        <div className="charhp_text">
                            {currentHealth}/{health}

                        </div>

                    </div>
                </div>
                <div className='charmp_container'>100/100</div>
                <div className='charlvl_container' >
                    <div className='charlvl' style={{ width: `${(currentExp / maxExp) * 100}%` }}>
                    </div>
                    <div className='charlvl_text'>
                        {lvl} ур. {currentExp}/{maxExp}
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