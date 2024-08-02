import './Header.css';

const Header = ({topMessages}) => {
    return ( 
        <div className="header_container">
            {topMessages.map((message,index) => (<p key={index}>{message}</p>))}
        </div>
     );
}
 
export default Header;