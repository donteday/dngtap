import './Home.css';
import { useDispatch } from 'react-redux'
import { setRoute } from '../../redux/store/store';

const Home = () => {
    const dispatch = useDispatch();
    let homeItem = [
        {
            name: 'Локации',
            route: 'locations'
        },
        {
            name: 'Магазин',
            route: 'shop'
        },
        {
            name: 'Инвентарь',
            route: 'inventory'
        },
        {
            name: 'Аукцион',
            route: 'auction'
        },
        {
            name: 'Выбор персонажа',
            route: 'chooseCharacter'
        }];
    function setHomeRoute(route) {
        switch (route) {
            case 'locations':
                dispatch(setRoute('farm'));
                break;
            case 'chooseCharacter':
                dispatch(setRoute('chooseCharacter'));
                break;
            case 'shop':
                dispatch(setRoute('shop'));
                break;
            default:
                alert('Скоро добавим');
        }
    }

    return (<div className="home__container">
        {homeItem.map((e, index) => {
            return <div className='cc_btn' onClick={() => setHomeRoute(e.route)}>{e.name}</div>
        })}
    </div>);
}

export default Home;