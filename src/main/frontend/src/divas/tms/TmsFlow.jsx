import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as EgovNet from 'context/egovFetch';
import UseInterval from 'divas/com/UseInterval';

function TmsFlow(props) {

    console.group("TmsFlowContent");
    console.log("[Start] TmsFlowContent ------------------------------");
    console.log("TmsFlowContent [props] : ", props);

    // 반복을 위한 state
    const [reload, setLoadState] = useState(false);
    const [listTag, setListTag] = useState([]);
    
    const location = useLocation();
    // console.log("commonVO : ", location.state.commonVO);
    UseInterval(() => {
        props.reload();
        setLoadState(!reload);
    }, props.load_time *1000);

    const retrieveList = () => {
        const retrieveListURL = '/divas/tms/tmsFlow.do';
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
                
                if(resp.result.flowList.length < 1){
                    mutListTag.push(<p className="no_data">검색된 결과가 없습니다.</p>); // 게시판 목록 초기값
                }

                // 리스트 항목 구성
                resp.result.flowList.forEach(function (item, index) {
                    if (index === 0) mutListTag = [];
                    let flow_m = item.flow_m === -99999 ? "-" : item.flow_m;
                    let flow_bh = item.flow_bh === -99999 ? "-" : item.flow_bh;
                    let flow_d = item.flow_d === -99999 ? "-" : item.flow_d;
                    let flow_bd = item.flow_bd === -99999 ? "-" : item.flow_bd;
                    let flow_n = item.flow_n === -99999 ? "-" : item.flow_n;
                    mutListTag.push(
                        <tr key={"flow_"+index} id={"flow_"+item.area_code}>
                            <td>{item.rtu_name}</td>
                            <td>{flow_bh}</td>
                            <td>{flow_m}</td>
                            <td>{flow_d}</td>
                            <td>{flow_bd}</td>
                            <td>{flow_n}</td>
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

    console.log("------------------------------TmsFlowContent [End]");
    console.groupEnd("TmsFlowContent");

    return (
    <div id="flowContent">
        <div id="spin" className="" />
        <div className="main_contitle">
        
        <img src="../images/title_wl.png" alt="수위 현황" />
        <span className="main_mes">[단위 : mm]</span>
        </div>
        <div className="right_bg">
            <table className="main_table">
                <thead>
                    <tr key="flow_th">
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

export default TmsFlow;