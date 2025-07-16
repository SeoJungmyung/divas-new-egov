import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import * as EgovNet from 'context/egovFetch';

import URL from 'context/url';
import CODE from 'context/code';


function EgovLogout(props) {

    console.group("EgovLogoutContent");
    console.log("[Start] EgovLogoutContent ------------------------------");
    console.log("EgovLogoutContent [props] : ", props);

    const history = useHistory();
    console.log("EgovLogoutContent [history] : ", history);

    const [userInfo, setUserInfo] = useState({ id: 'default', password: 'default', userSe: 'USR' });
    const [LogoutVO, setLogoutVO] = useState({});

    const submitFormHandler = (e) => {
        console.log("EgovLogoutContent submitFormHandler()");
        
        const loginUrl = "/divas/com/actionLogoutAPI.do"
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify()
        }

        EgovNet.requestFetch(loginUrl,
            requestOptions,
            (resp) => {
                let resultVO = resp.resultVO;
                console.log(" resultVO : ", resultVO);
                history.push('/login'); // 마운트 될 때 /login에 해당하는 페이지로 이동
                // alert("로그아웃에 "+resp.resultMessage);
            }
        )
    }


    console.log("------------------------------EgovLogoutContent [End]");
    console.groupEnd("EgovLogoutContent");

    return (
        <div className="settings">
            <button type="button" id="btn_logout" className="btn_layout " onClick={submitFormHandler}>로그아웃</button>
        </div>
    );
}

export default EgovLogout;