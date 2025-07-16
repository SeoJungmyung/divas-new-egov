import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as EgovNet from 'context/egovFetch';
import UseInterval from 'divas/com/UseInterval';

function TmsRain(props) {

    console.group("TmsRainContent");
    console.log("[Start] TmsRainContent ------------------------------");
    console.log("TmsRainContent [props] : ", props);

    // 반복을 위한 state
    const [reload, setLoadState] = useState(false);
    const [listTag, setListTag] = useState([]);

    const location = useLocation();
    // console.log("commonVO : ", location.state.commonVO);
    UseInterval(() => {
        // props.reload();
        setLoadState(!reload);
    }, props.load_time *1000);

    const retrieveList = () => {
        const retrieveListURL = '/divas/tms/tmsRain.do';
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
                
                if(resp.result.rainList.length < 1){
                    mutListTag.push(<p className="no_data">검색된 결과가 없습니다.</p>); // 게시판 목록 초기값
                }

                // 리스트 항목 구성
                resp.result.rainList.forEach(function (item, index) {
                    if (index === 0) mutListTag = [];
                    let rain_m = item.rain_m === -99999 ? "-" : item.rain_m;
                    let rain_bh = item.rain_bh === -99999 ? "-" : item.rain_bh;
                    let rain_d = item.rain_d === -99999 ? "-" : item.rain_d;
                    let rain_bd = item.rain_bd === -99999 ? "-" : item.rain_bd;
                    let rain_n = item.rain_n === -99999 ? "-" : item.rain_n;
                    mutListTag.push(
                        <tr key={"rain_"+index} id={"rain_"+item.area_code}>
                            <td>{item.rtu_name}</td>
                            <td>{rain_bh}</td>
                            <td>{rain_m}</td>
                            <td>{rain_d}</td>
                            <td>{rain_bd}</td>
                            <td>{rain_n}</td>
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

    console.log("------------------------------TmsRainContent [End]");
    console.groupEnd("TmsRainContent");

    return (
    <div id="rainContent">
        <div id="spin" className="" />
        <div className="main_contitle">
        
        <img src="../images/title_r.png" alt="강우 현황" />
        <span className="main_mes">[단위 : mm]</span>
        </div>
        <div className="right_bg">
            <table className="main_table">
                <thead>
                    <tr key="rain_th1">
                        {[
                            <th width="20%" key="th1">지역</th>,
                            <th width="14%" key="th2">전시간</th>,
                            <th width="14%" key="th3">시간</th>,
                            <th width="14%" key="th4">금일</th>,
                            <th width="14%" key="th5">전일</th>,
                            <th width="14%" key="th6">월간</th>
                        ]}
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

export default TmsRain;