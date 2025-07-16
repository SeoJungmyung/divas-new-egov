import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import * as EgovNet from 'context/egovFetch';
import { setCookie, getCookie } from 'divas/com/Cookie';

import URL from 'context/url';
import CODE from 'context/code';


function EgovLogin(props) {

    console.group("EgovLoginContent");
    console.log("[Start] EgovLoginContent ------------------------------");
    console.log("EgovLoginContent [props] : ", props);

    const history = useHistory();
    console.log("EgovLoginContent [history] : ", history);

    const [userInfo, setUserInfo] = useState({ user_id: 'default', user_pwd: 'default', user_type: '0' });
    const [loginVO, setLoginVO] = useState({});

    const submitFormHandler = (e) => {
        console.log("EgovLoginContent submitFormHandler()");
        
        const loginUrl = "/divas/com/actionLoginAPI.do"
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(userInfo)
        }

        EgovNet.requestFetch(loginUrl,
            requestOptions,
            (resp) => {
                let resultVO = resp.resultVO;
                // console.log(resp.topMenuList);
                if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                    setLoginVO(resultVO);
                    props.onChangeLogin(resultVO);

                    let client_time = new Date();
                    let time_diff = resp.serverNow - client_time.getTime();

                    setCookie("is_login", "1", { maxAge: 12 * 60 * 60});
                    history.push({
                        pathname: URL.MAIN,
                        state: {
                            timeDiff: time_diff,
                            topMenuList: resp.topMenuList,
                            inMenuList: resp.inMenuList,
                            commonVO : resp.commonVO
                        }    
                    });
                } else {
                    alert(resp.resultMessage)
                }
            })
    }

    const keyPress = (e) => {
        // console.log("key값 : " + e.key);
        if(e.key === 'Enter'){
            submitFormHandler();
        }
    }

    useEffect(() => {
        const preventGoBack = () => {
            history.push('/', '', window.location.href);
            // console.log('prevent go back!');
          };
          
          history.push('/', '', window.location.href);
          window.addEventListener('popstate', preventGoBack);
          
          return () => window.removeEventListener('popstate', preventGoBack);
    }, []);
    console.log("------------------------------EgovLoginContent [End]");
    console.groupEnd("EgovLoginContent");

    return (
        <div className="contents" id="contents">
        <img id="bg" src="./images/bg.jpg" alt=""></img>
        <div className="login">
        <div id="login_wrapper" className="login_wrapper">
            <div id="spin" />
            <div className="login_title">
                <span id="top_img" /> <span id="top_title" style={{ fontSize: 19 }} />{"스마트 통합방재 시스템"}
                <span id="top_text" style={{ fontSize: 19 }} />
            </div>
            <fieldset>
            {/* <div className="input">
                <input
                type="id"
                id="user_id"
                name="user_id"
                placeholder="ID"
                required=""
                />
            </div> */}
            <div className="input">
                <input type="text" name="" title="아이디" placeholder="아이디"
                    onChange={e => setUserInfo({ ...userInfo, user_id: e.target.value })} />
            </div>
           {/*  <div className="input">
                <input
                type="password"
                id="user_pwd"
                name="user_pwd"
                placeholder="Password"
                required=""
                />
            </div> */}
            <div className="input">
            <input type="password" name="" title="비밀번호" placeholder="비밀번호"
                onKeyPress={keyPress} 
                onChange={e => setUserInfo({ ...userInfo, user_pwd: e.target.value })} />
            </div>
            <button type="button" className='submit' onClick={submitFormHandler}>LOGIN</button>
            </fieldset>
            <div className="infotxt">
            지도상황판은 Google 크롬에서 더 원할하게 작동 됩니다.
            <br />
            <button type="button" id="btn_32bit" className="btn_lbs">
                32bit 다운로드
            </button>
            &nbsp;
            <button type="button" id="btn_64bit" className="btn_lbs">
                64bit 다운로드
            </button>
            </div>
        </div>
        <span className="copyright">
            본 시스템은 국민의 재산과 생명을 보호하기 위한 것으로
            <br />
            관계자 외 접근은 허용하지 않습니다.
            <br />
            <br />
            Copyrightⓒ 2018 Hwajintni All rights reserved.
        </span>
        </div>
    </div>
    );
}

export default EgovLogin;