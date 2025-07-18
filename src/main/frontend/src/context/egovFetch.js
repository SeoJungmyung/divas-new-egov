import { SERVER_URL } from './config';

import URL from 'context/url';
import CODE from 'context/code';

// 대안: 상대 경로 사용시 SERVER_URL 없이도 가능
const API_BASE = ''; // 빈 문자열로 상대 경로 사용

export function requestFetch(url, requestOptions, handler, errorHandler) {
    console.groupCollapsed("requestFetch");
    console.log("requestFetch [URL] : ", API_BASE + url);
    console.log("requestFetch [requestOption] : ", requestOptions);

    //CORS ISSUE 로 인한 조치 - origin 및 credentials 추가 
    // origin 추가
    if (!requestOptions['origin']) {
        requestOptions = { ...requestOptions, origin: SERVER_URL };
    }
    // credentials 추가 
    if (!requestOptions['credentials']) {
        requestOptions = { ...requestOptions, credentials: 'include' };
    }

    // 상대 경로 사용시: fetch(url, requestOptions) 만으로도 충분
    fetch(API_BASE + url, requestOptions)
        .then(response => {// response Stream. Not completion object
            //console.log("requestFetch [Response Stream] ", response); 
            return response.json();
        })
        .then((resp) => {
            if (Number(resp.resultCode) === Number(CODE.RCV_ERROR_AUTH)) {
                alert("Login Alert");
                window.location.href = URL.LOGIN;
                return false;
            } else {
                return resp;
            }
        })
        .then((resp) => {
            console.groupCollapsed("requestFetch.then()");
            console.log("requestFetch [response] ", resp);
            if (typeof handler === 'function') {
                handler(resp);
            } else {
                console.log('egov fetch handler not assigned!');
            }
            console.groupEnd("requestFetch.then()");
        })
        .catch(error => {
            console.error('There was an error!', error);
            if (error === 'TypeError: Failed to fetch') {
                alert("서버와의 연결이 원활하지 않습니다. 서버를 확인하세요.");
            }
            
            if (typeof errorHandler === 'function') {
                errorHandler(error);
            } else {
                console.error('egov error handler not assigned!');
                alert("ERR : " + error.message);
            }
        })
        .finally(() => {
            console.log("requestFetch finally end");
            console.groupEnd("requestFetch");
        });
}