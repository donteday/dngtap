import './Header.css';

const Header = ({topMessages}) => {
    console.log(topMessages);
    return ( 
        <div className="header_container">
            {topMessages.map((messge,index) => (<p key={index}>{messge}</p>))}
        </div>
     );
}
 
export default Header;