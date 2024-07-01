import './CreateCharacter.css';
import { useDispatch } from 'react-redux'
import { createCharacter } from '../../../redux/store/store';
import { useState } from 'react';


const CreateCharacter = ({setPopup}) => {
    const [selectedClass, setSelectedClass] = useState('warrior');
    const [name, setName] = useState('');
    const dispatch = useDispatch();

    const handleClassSelect = (className) => {
        setSelectedClass(className);
    };

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleSubmit = () => {
        // Обработка создания персонажа
        if (!name) {
            alert('Вы не указали имя персонажа');
            return;
        }
        dispatch(createCharacter({name: name, type: selectedClass, id:1}));
        setPopup(false);
    };

    function aboutCharacterText(type) {
        let text = '';
        switch (type) {
            case 'warrior':
            text = "Рыцари это основа всех основ. Они не являются обычными танками, как это принято во многих играх. Здесь рыцари наделены сильными заклинаниями и в нужный момент могут дать сильный отпор не одному противнику. Основная характеристика это сила. Она влияет на наносимый урон любым оружием, по этому все вещи необходимо одевать на силу.";
                break;
            case 'mage':
            text = "Маг это отнюдь не игрок стоящий позади своих товарищей, а передовой воин. Он обладает рядом превосходных заклинаний увеличивающих атаку и защиту. К тому же маг имеет очень хороший HP фактор. Основная характеристика мага это не только интеллект, но и сила.";
                break;
            case 'archer':
            text = "Основная характеристика рейнджера — это ловкость. Именно на увеличение этой характеристики и нужно будет покупать и одевать бижутерию и кольца. Ловкость для рейнджера увеличивает точность попаданий, урон, а также защиту.";
                break;
        
            default:
            text = 'Выберите класс персонажа'
                break;
        }
        return text;
    }
    return (<div className='createcharacter__container'>
        <div className='cc__tittle'>Создание персонажа</div>
        <div className='cc__img' style={{backgroundImage: `url(${require(`../../../img/cc/${selectedClass}.png`)}`}}></div>

        <div className="createcharacter__about">{aboutCharacterText(selectedClass)}</div>
        <div className='createcharacter__type'>
            <div className='createcharacter__type-icon' onClick={() => handleClassSelect('warrior')} >Воин</div>
            <div className='createcharacter__type-icon' onClick={() => handleClassSelect('mage')} >Маг</div>
            <div className='createcharacter__type-icon' onClick={() => handleClassSelect('archer')} >Лучник</div>
        </div>
        <div className='createcharacter__input-container'>
            <input className='createcharacter__input' type="text" value={name} onChange={handleNameChange} placeholder="Введите имя персонажа" />
            <button className='cc_btn' onClick={handleSubmit}>Создать</button>
        </div>


    </div>);
}

export default CreateCharacter;