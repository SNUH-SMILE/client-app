import React from 'react';
import {NavLink} from "react-router-dom";

function SideChildMenu({value}) {
    return (
        <li >
            <NavLink to={value.url} className="nav-link fs12">{value.name}</NavLink>
        </li>
    );
}

export default React.memo(SideChildMenu);