import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as EgovNet from 'context/egovFetch';
import UseInterval from 'divas/com/UseInterval';

function TmsSnow(props) {

    console.group("TmsSnowContent");
    console.log("[Start] TmsSnowContent ------------------------------");
    console.log("TmsSnowContent [props] : ", props);

    // 반복을 위한 state
    const [reload, setLoadState] = useState(false);
    const [listTag, setListTag] = useState([]);
    
    UseInterval(() => {
        props.reload();
        setLoadState(!reload);
    }, props.load_time *1000);

    const location = useLocation();
    // console.log("commonVO : ", location.state.commonVO);

    const retrieveList = () => {
        const retrieveListURL = '/divas/tms/tmsSnow.do';
        // console.log("location.state.commonVO : ", location.state.commonVO);
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
                
                if(resp.result.snowList.length < 1){
                    mutListTag.push(<p className="no_data">검색된 결과가 없습니다.</p>); // 게시판 목록 초기값
                }

                // 리스트 항목 구성
                resp.result.snowList.forEach(function (item, index) {
                    if (index === 0) mutListTag = [];
                    let snow_m = item.snow_m === -99999 ? "-" : item.snow_m;
                    let snow_d = item.snow_d === -99999 ? "-" : item.snow_d;
                    let snow_bd = item.snow_bd === -99999 ? "-" : item.snow_bd;
                    let snow_bd_new = item.snow_bd_new === -99999 ? "-" : item.snow_bd_new;
                    let snow_d_new = item.snow_d_new === -99999 ? "-" : item.snow_d_new;
                    mutListTag.push(
                        <tr key={"snow_"+index} id={"snow_"+item.area_code}>
                            <td>{item.rtu_name}</td>
                            <td>{snow_bd_new}</td>
                            <td>{snow_bd}</td>
                            <td>{snow_d_new}</td>
                            <td>{snow_m}</td>
                            <td>{snow_d}</td>
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

    console.log("------------------------------TmsSnowContent [End]");
    console.groupEnd("TmsSnowContent");

    return (
    <div id="snowContent">
        <div id="spin" className="" />
        <div className="main_contitle">
        
        <img src="../images/title_01_04.png" alt="적설 현황" />
        <span className="main_mes">[단위 : cm]</span>
        </div>
        <div className="right_bg">
            <table className="main_table">
                <thead>
                    <tr key="snow_th1">
                        {[
                            <th width="20%" key="th1">지역</th>,
                            <th width="14%" key="th2">전일신적설</th>,
                            <th width="14%" key="th3">전일적설</th>,
                            <th width="14%" key="th4">금일신적설</th>,
                            <th width="14%" key="th5">현재적설</th>,
                            <th width="14%" key="th6">금일적설</th>
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

export default TmsSnow;