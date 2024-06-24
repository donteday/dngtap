import './CreateCharacter.css';
import { useDispatch } from 'react-redux'
import { createCharacter } from '../../../redux/store/store';
import { useState } from 'react';


const CreateCharacter = ({setPopup}) => {
    const [selectedClass, setSelectedClass] = useState('Класс');
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
        dispatch(createCharacter({name: name, type: selectedClass, id:1}));
        setPopup(false);
    };
    return (<div className='createcharacter__container'>
        <div className='cc__tittle'>Создание персонажа</div>


        <div className="createcharacter__about">{selectedClass}</div>
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