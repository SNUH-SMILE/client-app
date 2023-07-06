import React from 'react';
import SMILELogo from '../Assets/Images/main_logo.png';
import {useLocation} from "react-router-dom";
import SideParentMenu from "./SideParentMenu";

const menu = [
    {
        parent: '관리자기능',
		lvl:1,
        child: [
            {name: '공통코드', url: '/comCd'},
            {name: '생활치료센터', url: '/treatmentCenter'},
            {name: '사용자관리', url: '/user'},
            {name: '측정항목관리', url: '/item'},
        ]
    },
    {
        parent: '생활치료센터',
		lvl:2,
        child: [
            {name: '생활치료센터 리스트', url: '/treatmentCenterPatient'},
            {name: '생활치료센터 대시보드', url: '/dashboard/center'},
        ]
    },
    {
        parent: '자택격리자',
		lvl:2,
        child: [
            {name: '자택격리자 리스트', url: '/isolationPatient'},
            {name: '자택격리환자 대시보드', url: '/dashboard/quarantine'},
        ]
    },
    {
        parent: '문의사항',
		lvl:2,
        child: [
            {name: '문의사항', url: '/qna'},
        ]
    }
]

function Side() {
    const currentUrl = useLocation();
    let userLvl = localStorage.getItem('lvl');
    const resultMap = menu.filter((x)=>{
        if (x.lvl >= userLvl )
        {
            return x.parent
        }
    });
    return (
        <aside className="bg-white" id="sidebar-wrapper">
            <div className="sidebar-heading">
                <img src={SMILELogo} alt="SMILE 보호관리"/>
            </div>
            <nav className="navbar-light">
                <ul className="gnb navbar-nav">
                    {resultMap.map((menu,idx) => {
                        let current = menu.child.find(value => value.url === currentUrl.pathname)
                        return (
                            <SideParentMenu key={menu.parent} menu={menu} idx={idx} current={current}/>
                        )
                    })}
                </ul>
            </nav>
        </aside>
    );
}

export default React.memo(Side);
