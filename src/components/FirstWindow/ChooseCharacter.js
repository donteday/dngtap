import './ChooseCharacter.css';
import { useSelector, useDispatch } from 'react-redux'
import { setCharacter, setRoute } from '../../redux/store/store';
import CreateCharacter from './CreateCharacter/CreateCharacter';
import { useState } from 'react'

const ChooseCharacter = () => {
    const characters = useSelector(state => state.counter.characters);
    const dispatch = useDispatch();
    const [createCharacterPopup, setCreateCharacterPopup] = useState(false);

    function chooseCharacter(index) {
        dispatch(setCharacter(index));
        dispatch(setRoute('home'));
    }

    return (
        <div className='cc__container'>
            {createCharacterPopup ?
                <CreateCharacter setPopup={setCreateCharacterPopup} />
                :
                <>
                    <div className='cc__tittle'>Выбор персонажа</div>
                    {characters.map((char, index) => (
                        <div className="cc__characters" key={index}>
                            {char != null ?
                                <div className='cc__characters-point'>
                                    <div
                                        className='cc__characters-img'
                                        style={{ backgroundImage: `url(${require(`../../img/cc/${char.characterClass}.png`)})` }}
                                    />
                                    <div className='cc__about-character'>
                                        <div>{char.name}</div>
                                        <div>LVL: {char.lvl}</div>
                                        <button className='cc_btn' onClick={() => chooseCharacter(index)}>Выбрать</button>
                                    </div>
                                </div>
                                :
                                <button className='cc_btn' onClick={() => setCreateCharacterPopup(true)}>Создать персонажа</button>
                            }
                        </div>
                    ))}
                </>
            }
        </div>
    );
}

export default ChooseCharacter;
