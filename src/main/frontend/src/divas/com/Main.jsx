import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import * as EgovNet from 'context/egovFetch';
import { setCookie, getCookie } from 'divas/com/Cookie';

import URL from 'context/url';
import EgovLogout from './EgovLogout';
import LeftMenu from 'divas/com/LeftMenu';
import Routes from 'divas/com/Routes';
import Clock from 'divas/com/Timer';

function Main(props) {
    console.group("MainContent");
    console.log("[Start] MainContent ------------------------------");
    console.log("MainContent [props] : ", props);
    
    const location = useLocation();
    console.log("commonVO : ", location.state?.commonVO);
    
    const [diff, setServerTime] = useState(location.state?.timeDiff || 0);
    const [layoutCount, setLayoutCount] = useState(location.state?.layoutCount || 0);

    const history = useHistory();
    console.log("MainContent [history] : ", history);

    if(getCookie("is_login") == null){
        history.replace({
            pathname: URL.LOGIN,
        });
    }
    
    const [searchCondition, setSearchCondition] = useState(
        history.location.state?.searchCondition || 
        { bbsId: '', pageIndex: 1, searchCnd: '0', searchWrd: '' }
    );

    const handleLayoutClick = () => {
        console.log("handleLayoutClick");
        const newLayoutCount = layoutCount >= 5 ? 0 : layoutCount + 1;
        setLayoutCount(newLayoutCount);
        location.state.layoutCount = newLayoutCount;
    }

    useEffect(() => {
        retrieveList(searchCondition);
        return () => {}
    }, [searchCondition]);

    const retrieveList = (searchCondition) => {
        // Your existing retrieval logic
    }

    console.log("------------------------------ [End] MainContent");
    console.groupEnd("MainContent");

    return (
        <div>
            <div id="top">
                <EgovLogout></EgovLogout>
                <button 
                    type="button" 
                    id="btn_layout" 
                    className="btn_layout mR5 mT8"
                    onClick={() => {
                      handleLayoutClick();
                    }}
                >레이아웃</button>
                <div id="top_img">
                    <img src="../images/top/hwajin.jpg" width="100%" height="100%" alt="배경" />
                </div>
                <div className="ttext">
                    <span id="top_title">화진</span> &nbsp;
                    <span id="top_text" className="txtcolor_lb">스마트 조기경보 통합방재 시스템</span>
                </div>
                <Clock timeDiff={diff}></Clock>
            </div>
            <LeftMenu 
                topMenuList={location.state?.topMenuList || []} 
                inMenuList={location.state?.inMenuList || []}
                commonVO={location.state?.commonVO || {}}
                timeDiff={diff}
            />
            <div id="right">
                <Routes layoutCount={layoutCount} />
            </div>
        </div>
    );
}

export default Main;