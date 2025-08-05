import type { JSX } from "react";

interface NameProps {
    name: string;
};

const Header = (props : NameProps) : JSX.Element => {
    return(
        <>
            <h1>{props.name}</h1>
        </>
    )
};

export default Header;