import './ChooseCharacter.css';
import { useSelector, useDispatch } from 'react-redux'
import { setCharacter, setRoute } from '../../redux/store/store';
import CreateCharacter from './CreateCharacter/CreateCharacter';
import { useState } from 'react'

const ChooseCharacter = () => {
    let characters = useSelector(state => state.counter.characters);
    const dispatch = useDispatch();
    const [createCharacterPopup, setСreateCharacterPopup] = useState(false);

    function chooseCharacter(index) {
        dispatch(setCharacter(index));
        dispatch(setRoute('home'));
    }


    return (
        <div className='cc__container'>
            {
                createCharacterPopup ?
                    <CreateCharacter setPopup={setСreateCharacterPopup} />
                    :
                    <>
                        <div className='cc__tittle'>Выбор персонажа</div>
                        {characters.map((e, index) => {
                            return <div className="cc__characters">
                                {e !== undefined ?
                                    <div className='cc__characters-point'>
                                        <div className='cc__characters-img' style={{ backgroundImage: `url(${require(`../../img/cc/${characters[index].characterType}.png`)}` }}></div>
                                        <div className='cc__about-character'>
                                            <div>{characters[index].name}</div>
                                            <div>LVL: {characters[index].lvl}</div>
                                            <button className='cc_btn' onClick={() => chooseCharacter(index)}>Выбрать</button>
                                        </div>
                                    </div>
                                    :
                                    <button className='cc_btn' onClick={() => setСreateCharacterPopup(true)}>Создать персонажа</button>
                                }
                            </div>
                        })}
                    </>
            }
        </div>
    );
}

export default ChooseCharacter;