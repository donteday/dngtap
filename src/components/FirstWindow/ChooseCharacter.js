import './ChooseCharacter.css';
import { useSelector, useDispatch } from 'react-redux'

const ChooseCharacter = () => {
    let characters = useSelector(state => state.counter.characters);
    function chooseCharacter() {
        
    }
    return (
        <div className='cc__container'>
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
                            <button className='cc_btn'>Выбрать</button>

                        </div>
                        :
                        <button className='cc_btn'>Создать персонажа</button>
                    }
                </div>
            })}

        </div>
    );
}

export default ChooseCharacter;