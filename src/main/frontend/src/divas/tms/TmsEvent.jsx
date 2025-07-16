import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as EgovNet from 'context/egovFetch';
import UseInterval from 'divas/com/UseInterval';

function TmsEvent(props) {

    console.group("TmsEventContent");
    console.log("[Start] TmsEventContent ------------------------------");
    console.log("TmsEventContent [props] : ", props);

    // 반복을 위한 state
    const [reload, setLoadState] = useState(false);
    const [listTag, setListTag] = useState([]);
    const [listTag2, setListTag2] = useState([]);
    
    UseInterval(() => {
        props.reload();
        setLoadState(!reload);
    }, props.load_time *1000);

    const location = useLocation();
    // console.log("commonVO : ", location.state.commonVO);
    
    const retrieveList = () => {
        console.groupCollapsed("경보현황 시작");

        const retrieveListURL = '/divas/tms/tmsEvent.do';
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
                if(resp.result.eventGroupList.length < 1){
                    mutListTag.push(<p className="no_data">검색된 결과가 없습니다.</p>); // 게시판 목록 초기값
                }

                // 리스트 항목 구성
                resp.result.eventGroupList.forEach(function (item, index) {
                    if (index === 0) mutListTag = [];
                    let alarm_grp_name = item.alarm_grp_name;
                    let rtu_name = item.rtu_name;
                    let event_text = "";
                    if(item.event_branch == null && item.event_comment == null) event_text = "-";
                    else event_text = "[" + item.event_branch + "] " + item.event_comment; // 클릭시 팝업으로 수정할 것
                    let event_code = item.event_code;
                    let event_date = item.event_date;
                    mutListTag.push(
                        <tr key={"event_group_"+index} id={"alert_group_"+item.alarm_grp_no+"_"+item.origin_rtu_id}>
                            <td>{alarm_grp_name}</td>
                            <td>{rtu_name}</td>
                            <td>{event_text}</td>
                            <td>{event_code}</td>
                            <td>{event_date}</td>
                        </tr>
                    );
                });
                mutListTag.push();
                setListTag(mutListTag);

                mutListTag = [];
                if(resp.result.eventList.length < 1){
                    mutListTag.push(<p className="no_data">검색된 결과가 없습니다.</p>); // 게시판 목록 초기값
                }

                // 리스트 항목 구성
                resp.result.eventList.forEach(function (item, index) {
                    if (index === 0) mutListTag = [];
                    let rtu_name = item.rtu_name;
                    let event_text = "[" + item.event_branch + "] " + item.event_comment; // 클릭시 팝업으로 수정할 것
                    let battery_volt = item.battery_volt;
                    let event_date = item.event_date;
                    mutListTag.push(
                        <tr key={"event_"+index} id={"alert_"+item.event_seq}>
                            <td>{rtu_name}</td>
                            <td>{event_text}</td>
                            <td>{battery_volt}</td>
                            <td>{event_date}</td>
                        </tr>
                    );
                });
                mutListTag.push();
                setListTag2(mutListTag);
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
    }, [reload]);

    console.log("------------------------------TmsEventContent [End]");
    console.groupEnd("TmsEventContent");

    return (
    <div id="eventContent">
        <div id="spin" className="" />
        <div className="main_contitle">
        
        <img src="../images/title_01_08_01.png" alt="경보그룹 현황" />
        </div>
        <div className="right_bg">
            <table className="main_table">
                <thead>
                    <tr key="event_th1">
                        <th width="20%">경보그룹</th> <th width="20%">경보지역</th>
                        <th width="25%">경보내용</th> <th width="15%">원인자료</th>
                        <th width="20%">발생시각</th>
                    </tr>
                </thead>
                <tbody>
                    {listTag}
                </tbody>
            </table>
        </div>
        <div id="spin" className="" />
        <div className="main_contitle">
        
        <img src="../images/title_01_08_02.png" alt="최근경보 현황" />
        </div>
        <div className="right_bg">
            <table className="main_table">
                <thead>
                    <tr key="event_th1">
                        <th width="20%">지역</th> <th width="30%">자동 경보 발령 내역</th>
                        <th width="20%">원인자료</th> <th width="30%">발생시각</th>
                    </tr>
                </thead>
                <tbody>
                    {listTag2}
                </tbody>
            </table>
        </div>
    </div>
    );
}

export default TmsEvent;