import { Link } from "react-router-dom";

function Menu() {
    return (
        <>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
        </>
    );
}

export default Menu;