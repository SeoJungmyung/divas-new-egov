import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

import UseInterval from 'divas/com/UseInterval';
import { setCookie, getCookie } from 'divas/com/Cookie';
import URL from 'context/url';

function Timer(props) {

    // console.group("Main2Content");
    // console.log("[Start] Main2Content ------------------------------");
    // console.log("Main2Content [props] : ", props);
    const history = useHistory();

    const [serverNow, setServerTime] = useState();

    // 시간 세팅
    let c_now;
    const setTime = () => {
       
      if(getCookie("is_login") == null){
        history.push({
          pathname: URL.LOGIN,
        });
      }

      // console.log("time : "+props.timeDiff);
      let now_client_time = new Date();
      let now_time = new Date(now_client_time.getTime() + props.timeDiff);
      
      let now_date = now_time;
      let now_y = now_date.getFullYear();
      let now_m = now_date.getMonth() + 1;
      let now_d = now_date.getDate();
      let now_h = now_date.getHours();
      let now_i = now_date.getMinutes();
      if(String(now_i).length === 1) now_i = '0'+now_i;
      let now_s = now_date.getSeconds();
      if(String(now_s).length === 1) now_s = '0'+now_s;
      c_now = now_y+'년 '+now_m+'월 '+now_d+'일 '+now_h+'시 '+now_i+'분 '+now_s+'초';
      // console.log("time : "+c_now);
      setServerTime(c_now);
    }

    UseInterval(() => {
      setTime();
    }, 1000);

    useEffect(() => {
        return () => {
        }
    }, []);

    // console.log("------------------------------ [End] MainContent");
    // console.groupEnd("MainContent");

    return (
          <div id="now_date" className="date">{serverNow}</div>
    );
}

export default Timer;