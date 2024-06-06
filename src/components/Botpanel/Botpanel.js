import './Botpanel.css';
import { useSelector } from 'react-redux'
// import { addExp } from '../../redux/store/store'



const BotPanel = () => {
    const maxHp = useSelector(state => state.counter.hp);
    const currentExp = useSelector(state => state.counter.currentExp);
    const maxExp = useSelector(state => state.counter.maxExp);
    const lvl = useSelector(state => state.counter.lvl);

    return (
        <div className='botpanel_container'>
            {/* <div className="botpanel-btn_container"></div> */}
            <div className='charinfo_container'>
                <div className='charhp_container'>100/{maxHp}</div>
                <div className='charmp_container'>100/100</div>
                <div className='charlvl_container' >
                    <div className='charlvl' style={{ width: `${(currentExp / maxExp) * 100}%` }}>
                    </div>
                    <div className='charlvl_text'>
                        {lvl} ур. {currentExp}/{maxExp}
                    </div>
                </div>
            </div>
            <div className='charskill_container'></div>
            <div className='charskill_container'></div>
            <div className='charskill_container'></div>
            <div className='charskill_container'></div>
            <div className='charskill_container'></div>
            <div className='charskill_container'></div>
        </div>
    );
}

export default BotPanel;