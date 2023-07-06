import React from 'react';
import SideChildMenu from "./SideChildMenu";

function SideParentMenu({menu,idx, current}) {
    const onClickParent = (e) =>{
        if(e.currentTarget.getAttribute('aria-expanded') === 'false'){
            e.currentTarget.setAttribute('aria-expanded', 'true')
            e.currentTarget.nextElementSibling.classList.add('show')
        }
        else{
            e.currentTarget.setAttribute('aria-expanded', 'false')
            e.currentTarget.nextElementSibling.classList.remove('show')
        }

    }
    return (
        <li className="py-1" key={menu.parent}>
            <a className="nav-link sidebar-link" data-bs-toggle="collapse" href={"#collapse"+idx}
               role="button"
               onClick={(e)=>onClickParent(e,"#collapse"+idx)}
               aria-controls={"collapse" + idx}
               aria-expanded={current ? 'true' : 'false'}

            >
                <span className="mname">{menu.parent}</span>
                <span className="right-icon ms-auto">
                                    <i/>
                                </span>
            </a>
            <div className={current ? 'collapse show' : 'collapse'} id={"#collapse"+idx} role={"collapse"+idx}>
                <div className="card my-2">
                    <ul className="submenu navbar-nav my-2 px-3">
                        {menu.child.map((value) => {
                            return (
                                <SideChildMenu key={value.url} value={value}/>
                            )
                        })}
                    </ul>
                </div>
            </div>
        </li>
    );
}

export default React.memo(SideParentMenu);