import './ChooseCharacter.css';
import { useSelector, useDispatch } from 'react-redux'
import { setCharacter } from '../../redux/store/store';
import CreateCharacter from './CreateCharacter/CreateCharacter';
import { useState } from 'react'

const ChooseCharacter = () => {
    let characters = useSelector(state => state.counter.characters);
    const dispatch = useDispatch();
    const [createCharacterPopup, setСreateCharacterPopup] = useState(false);


    function chooseCharacter(index) {
        dispatch(setCharacter(index));
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
                                        <div>
                                            {characters[index].characterType}
                                        </div>
                                        <div>
                                            Имя: {characters[index].name}
                                        </div>
                                        <div>
                                            Уровень: {characters[index].lvl}
                                        </div>
                                        <button className='cc_btn' onClick={() => chooseCharacter(index)}>Выбрать</button>

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