import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import * as EgovNet from 'context/egovFetch';
import UseInterval from 'divas/com/UseInterval';
import { alarm_popup } from 'js/common';
import { getRouteFromUrl } from 'context/componentRegistry';

const TmsBroadcast = forwardRef((props, ref) => {

    console.group("TmsBroadcastContent");
    console.log("[Start] TmsBroadcastContent ------------------------------");
    console.log("TmsBroadcastContent [props] : ", props);

    // 반복을 위한 state
    const [reload, setLoadState] = useState(false);
    const [listTag, setListTag] = useState([]);

    UseInterval(() => {
        props.reload();
        setLoadState(!reload);
    }, props.load_time *1000);
    
    const location = useLocation();
    // console.log("commonVO : ", location.state.commonVO);

    const history = useHistory();
  
    const handleNavigation = (url) => {
        const route = getRouteFromUrl(url);
        history.push(route, { 
            commonVO: location.state.commonVO,
            topMenuList: location.state.topMenuList,
            inMenuList: location.state.inMenuList,
            timeDiff: location.state.timeDiff
        });
    };
    const popup_open = (log_no) => {
        // console.log("log_no : ", log_no);
        alarm_popup(log_no, location.state.commonVO, handleNavigation);
    }

    const retrieveList = () => {
        const retrieveListURL = '/divas/tms/tmsBroadcast.do';
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(location.state.commonVO)
        }

        EgovNet.requestFetch(retrieveListURL,
            requestOptions,
            (resp) => {
                let mutListTag = [];
                console.log("result = ", resp.result);
                if(resp.result.broadcastList.length < 1){
                    mutListTag.push(<p className="no_data">검색된 결과가 없습니다.</p>); // 게시판 목록 초기값
                }

                // 리스트 항목 구성
                resp.result.broadcastList.forEach(function (item, index) {
                    if (index === 0) mutListTag = [];
                    let section_name = item.section_name;
                    let script_title = item.script_title;
                    let rtu_cnt = "완료 : " + item.rtu_cnt_ok + " / 전체 : " + item.rtu_cnt;
                    let user_id = item.user_id;
                    let trans_start = item.trans_start ? item.trans_start : "-";
                    let trans_check = item.trans_check ? item.trans_check : "-";
                    mutListTag.push(
                        <tr key={"broad_"+index} id={"alarm_"+item.log_no}>
                            <td>{section_name}</td>
                            <td>{script_title}</td>
                            <td>
                                <button className="btn_open" onClick={() => popup_open(item.log_no)} 
                                    style={{cursor:"pointer", fontWeight:"bold", border: "none", background: "none", padding: 0}}>
                                    {rtu_cnt}&nbsp; <span className="icon_url"></span>
                                </button>
                            </td>
                            <td>{user_id}</td>
                            <td>{trans_start}</td>
                            <td>{trans_check}</td>
                        </tr>
                    );
                });
                mutListTag.push();
                setListTag(mutListTag);
            },
            function (resp) {
                console.log("err response : ", resp);
            }
        );

    }
    useEffect(() => {
        retrieveList();
        return () => {
        }
    }, [reload, props.refreshTrigger]);

    // Expose retrieveList to parent components
    useImperativeHandle(ref, () => ({
        retrieveList
    }));

    console.log("------------------------------TmsBroadcastContent [End]");
    console.groupEnd("TmsBroadcastContent");

    return (
    <div id="broadContent">
        <div id="spin" className="" />
        <div className="main_contitle">
        
        <img src="../images/title_br.png" alt="최근방송 현황" />
        </div>
        <div className="right_bg">
            <table className="main_table">
                <thead>
                    <tr key="broad_th1">
                        <th width="10%">전송유형</th> <th width="20%">방송제목</th>
                        <th width="20%">전송상태</th> <th width="10%">사용자</th>
                        <th width="20%">전송시작시각</th> <th width="20%">최종로깅시각</th>
                    </tr>
                </thead>
                <tbody>
                    {listTag}
                </tbody>
            </table>
        </div>
    </div>
    );
});

export default TmsBroadcast;