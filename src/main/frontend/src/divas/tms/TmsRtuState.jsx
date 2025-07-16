import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as EgovNet from 'context/egovFetch';
import UseInterval from 'divas/com/UseInterval';

function TmsRtuState(props) {

    console.group("TmsRtuStateContent");
    console.log("[Start] TmsRtuStateContent ------------------------------");
    console.log("TmsRtuStateContent [props] : ", props);

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
        const retrieveListURL = '/divas/tms/tmsRtuState.do';
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
                // console.log("result = ", resp.result);
                if(resp.result.rtuStateList.length < 1){
                    mutListTag.push(<p className="no_data">검색된 결과가 없습니다.</p>); // 게시판 목록 초기값
                }

                // 리스트 항목 구성
                resp.result.rtuStateList.forEach(function (item, index) {
                    if (index === 0) mutListTag = [];
                    let rtu_name = item.rtu_name;
                    let load_curr1 = item.load_curr1 === -99999 ? "-" : item.load_curr1;
                    let load_curr2 = item.load_curr2 === -99999 ? "-" : item.load_curr2;
                    let load_curr3 = item.load_curr3 === -99999 ? "-" : item.load_curr3;
                    let batt_volt1 = item.batt_volt1 === -99999 ? "-" : item.batt_volt1;
                    let batt_volt2 = item.batt_volt2 === -99999 ? "-" : item.batt_volt2;
                    let sola_volt1 = item.sola_volt1 === -99999 ? "-" : item.sola_volt1;
                    let sola_volt2 = item.sola_volt2 === -99999 ? "-" : item.sola_volt2;
                    let sola_curr1 = item.sola_curr1 === -99999 ? "-" : item.sola_curr1;
                    let sola_curr2 = item.sola_curr2 === -99999 ? "-" : item.sola_curr2;
                    let door_stat = item.door_stat === -99999 ? "-" : item.door_stat;
                    let sensor_stat = item.sensor_stat === -99999 ? "-" : item.sensor_stat;
                    let mainamp_stat = item.mainamp_stat === -99999 ? "-" : item.mainamp_stat;
                    let speaker_error_cnt = "../images/icon_speaker2.png";
                    if(item.speaker1 === 1){
                        speaker_error_cnt = "../images/icon_speaker_error01.png";
                    }else if(item.speaker2 === 1){
                        speaker_error_cnt = "../images/icon_speaker_error02.png";
                    }else if(item.speaker3 === 1){
                        speaker_error_cnt = "../images/icon_speaker_error03.png";
                    }else if(item.speaker4 === 1){
                        speaker_error_cnt = "../images/icon_speaker_error04.png";
                    }else if(item.speaker5 === 1){
                        speaker_error_cnt = "../images/icon_speaker_error05.png";
                    }else if(item.speaker6 === 1){
                        speaker_error_cnt = "../images/icon_speaker_error06.png";
                    }else if(item.speaker7 === 1){
                        speaker_error_cnt = "../images/icon_speaker_error07.png";
                    }else if(item.speaker8 === 1){
                        speaker_error_cnt = "../images/icon_speaker_error08.png";
                    }
                    let log_date = item.log_date === null ? "-" : item.log_date;
                    let input = item.sola_volt1 === 0 ? '../images/icon_ac.png' : '../images/icon_dc.png';
                    let input_alt = item.sola_volt1 === 0 ? '상전' : '태양전지';
                    mutListTag.push(
                        <tr key={"rtu_"+index} id={"rtu_"+item.areaCode}>
                            <td>{rtu_name}</td>
                            <td><img src={input} alt={input_alt} /></td>
                            <td>{sola_volt1}</td>
                            <td>{sola_volt2}</td>
                            <td>{sola_curr1}</td>
                            <td>{sola_curr2}</td>
                            <td>{batt_volt1}</td>
                            <td>{batt_volt2}</td>
                            <td>{load_curr1}</td>
                            <td>{load_curr2}</td>
                            <td>{load_curr3}</td>
                            <td>{door_stat}</td>
                            <td>{sensor_stat}</td>
                            <td>{mainamp_stat}</td>
                            <td><img src={speaker_error_cnt} alt="스피커 상태" /></td>
                            <td>{log_date}</td>
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
    }, [reload]);

    console.log("------------------------------TmsRtuStateContent [End]");
    console.groupEnd("TmsRtuStateContent");

    return (
    <div id="rtuStateContent">
        <div id="spin" className="" />
        <div className="main_contitle">
        
        <img src="../images/title_01_09.png" alt="장비상태 현황" />
        </div>
        <div className="right_bg">
            <table className="main_table">
                <thead>
                    <tr>
                        <th rowSpan={2} key="th1" className="bR_1gry">지역</th>
                        <th colSpan={5} key="power" className="bR_1gry">전원</th>
                        <th colSpan={2} key="battery" className="bR_1gry">배터리</th>
                        <th colSpan={3} key="consumption" className="bR_1gry">소비전류</th>
                        <th rowSpan={2} key="th12" className="bR_1gry bL_1gry">도어</th>
                        <th rowSpan={2} key="th13" className="bR_1gry">센서</th>
                        <th rowSpan={2} key="th14" className="bR_1gry">메인엠프</th>
                        <th rowSpan={2} key="th15" className="bR_1gry">스피커</th>
                        <th rowSpan={2} key="th16">최종로깅시각</th>
                    </tr>
                    <tr>
                        <td key="th2" className="gry_f">입력</td>
                        <td key="th3" className="gry">전압1(V)</td>
                        <td key="th4" className="gry">전압2(V)</td>
                        <td key="th5" className="gry">전류1(A)</td>
                        <td key="th6" className="gry">전류2(A)</td>
                        <td key="th7" className="gry">전압1(V)</td>
                        <td key="th8" className="gry">전압2(V)</td>
                        <td key="th9" className="gry">전류1(A)</td>
                        <td key="th10" className="gry">전류2(A)</td>
                        <td key="th11" className="gry">전류3(A)</td>
                    </tr>
                </thead>
                <tbody>
                    {listTag}
                </tbody>
            </table>
        </div>
    </div>
    );
}

export default TmsRtuState;