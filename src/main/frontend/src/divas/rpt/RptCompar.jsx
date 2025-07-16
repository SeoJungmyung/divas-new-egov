import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as EgovNet from 'context/egovFetch';
import dayjs from 'dayjs';
import RptSearch from './RptSearch';
import { getPurifyData, toFixedOfNum } from '../../js/common';
import Graph from './CommonGraph';

function RptCompar(props) {

    console.group("RptComparContent");
    console.log("[Start] RptComparContent ------------------------------");
    console.log("RptComparContent [props] : ", props);

    const [rainAreaList, setRainAreaList] = useState([]);
    const [flowAreaList, setFlowAreaList] = useState([]);
    const [rainAreaCode, setRainAreaCode] = useState("");
    const [flowAreaCode, setFlowAreaCode] = useState("");
    const [rainName, setRainName] = useState("");
    const [flowName, setFlowName] = useState("");
    const [rainData, setRainData] = useState(null);
    const [flowData, setFlowData] = useState(null);
    const [tableHeaders, setTableHeaders] = useState([]);
    const [graphData, setGraphData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchVO, setSearchVO] = useState({
        searchType: "H",
        startDate: dayjs().startOf('day'),
        endDate: dayjs().endOf('day')
    });

    const location = useLocation();

    const selectRtu = (e) => {
        
    }

    // 강우 장비 목록 조회
    const retrieveRainAreaList = () => {
        const retrieveListURL = '/divas/com/actionGetRtuList.do';
        const rtuVO = {
            ...location.state.commonVO,
            w_sensertype : "0"
        }
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(rtuVO)
        }

        EgovNet.requestFetch(retrieveListURL,
            requestOptions,
            (resp) => {
                console.log("retrieveRainAreaList [resp] : ", resp);
                if(resp.result.rtuList && resp.result.rtuList.length > 0) {
                    setRainAreaList(resp.result.rtuList);
                    setRainAreaCode(resp.result.rtuList[0].area_code);
                } else {
                    setRainAreaList([]);
                }
            },
            function (resp) {
                console.log("err response : ", resp);
                setRainAreaList([]);
            }
        );
    };

    // 수위 장비 목록 조회
    const retrieveFlowAreaList = () => {
        const retrieveListURL = '/divas/com/actionGetRtuList.do';
        const rtuVO = {
            ...location.state.commonVO,
            w_sensertype : "1"
        }
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(rtuVO)
        }

        EgovNet.requestFetch(retrieveListURL,
            requestOptions,
            (resp) => {
                console.log("retrieveFlowAreaList [resp] : ", resp);
                if(resp.result.rtuList && resp.result.rtuList.length > 0) {
                    setFlowAreaList(resp.result.rtuList);
                    setFlowAreaCode(resp.result.rtuList[0].area_code);
                } else {
                    setFlowAreaList([]);
                }
            },
            function (resp) {
                console.log("err response : ", resp);
                setFlowAreaList([]);
            }
        );
    };

    // 비교 데이터 조회
    const retrieveComparData = (searchData) => {
        setLoading(true);
        if(!rainAreaCode || !flowAreaCode) return;

        // 날짜 데이터가 dayjs 객체인 경우 문자열로 변환
        const formatDate = (date) => {
            if (dayjs.isDayjs(date)) {
                return date.format('YYYY-MM-DD HH:mm:ss');
            }
            return date;
        };

        // API 요청용 데이터 객체를 직접 생성
        const requestData = {
            ...location.state.commonVO,
            rain_area_code: rainAreaCode,
            flow_area_code: flowAreaCode,
            type: searchData.searchType,
            sdate: formatDate(searchData.startDate),
            edate: formatDate(searchData.endDate)
        };

        // 상태 업데이트 (UI 표시용)
        setSearchVO(searchData);

        console.log("requestData : ", requestData);

        const retrieveListURL = '/divas/rpt/actionRptCompar.do';
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(requestData) // requestData 사용
        }

        EgovNet.requestFetch(retrieveListURL,
            requestOptions,
            (resp) => {
                if(resp.result) {
                    setRainData(resp.result.rainData);
                    setFlowData(resp.result.flowData);
                    setTableHeaders(resp.result.headers || []);
                    const grpData = [];
                    // 그래프 데이터 추가 강우
                    resp.result.rainData.forEach((item, index) => {
                        let data1 = getPurifyData(item.rain) === "-" ? "-" : toFixedOfNum(getPurifyData(item.rain), 1, 0.01);
                        grpData.push({
                            DATE : index.toString(),
                            DATA : data1,
                            DATA2 : ""
                        });
                    });
                    setGraphData(grpData);

                    // 그래프 데이터 추가 수위
                    resp.result.flowData.forEach((item, index) => {
                        let data2 = getPurifyData(item.flow) === "-" ? "-" : toFixedOfNum(getPurifyData(item.flow), 1, 0.01);
                        grpData[index].DATA2 = data2;
                    });
                    setGraphData(grpData);
                }
                setLoading(false);
            },
            function (resp) {
                console.log("err response : ", resp);
                setLoading(false);
            }
        );
    };

    // 검색 핸들러
    const handleSearch = (searchData) => {
        retrieveComparData(searchData);
    };

    useEffect(() => {
        retrieveRainAreaList();
        retrieveFlowAreaList();
    }, []);

    // 초기 검색 (장비 목록 로드 후)
    useEffect(() => {
        if(rainAreaCode && flowAreaCode) {
            setRainName(rainAreaList.find(item => item.area_code === rainAreaCode).rtu_name);
            setFlowName(flowAreaList.find(item => item.area_code === flowAreaCode).rtu_name);
            
            // 현재 searchVO 값이 있으면 사용하고, 없으면 기본값 사용
            const searchData = {
                searchType: searchVO.searchType || "H",
                startDate: searchVO.startDate || dayjs().startOf('day'),
                endDate: searchVO.endDate || dayjs().endOf('day')
            };
            
            retrieveComparData(searchData);
        }
    }, [rainAreaCode, flowAreaCode]);

    console.log("------------------------------RptComparContent [End]");
    console.groupEnd("RptComparContent");

    return (
        <div id="content">
            <div className="main_contitle">
                <img src="../images/title_an_01.png" alt="비교 분석" />&nbsp;&nbsp;
                <span id="rain_name" className="title_locate mL20">강우 선택 :</span>
                <select 
                    id="rain_area_code" 
                    name="rain_area_code" 
                    className="fL mL10 mT3"
                    style={{border: '1px solid #000'}}
                    value={rainAreaCode}
                    onChange={(e) => {
                        setRainAreaCode(e.target.value);
                        setRainName(e.target.options[e.target.selectedIndex].text);
                    }}
                >
                    {rainAreaList.length > 0 ? (
                        rainAreaList.map((item, index) => (
                            <option key={index} value={item.area_code}>{item.rtu_name}</option>
                        ))
                    ) : (
                        <option value="">장비 없음</option>
                    )}
                </select>
                &nbsp;&nbsp;
                <span id="flow_name" className="title_locate mL20">수위 선택 :</span>
                <select 
                    id="flow_area_code" 
                    name="flow_area_code" 
                    className="fL mL10 mT3"
                    style={{border: '1px solid #000'}}
                    value={flowAreaCode}
                    onChange={(e) => {
                        setFlowAreaCode(e.target.value);
                        setFlowName(e.target.options[e.target.selectedIndex].text);
                    }}
                >
                    {flowAreaList.length > 0 ? (
                        flowAreaList.map((item, index) => (
                            <option key={index} value={item.area_code}>{item.rtu_name}</option>
                        ))
                    ) : (
                        <option value="">장비 없음</option>
                    )}
                </select>
                <span id="search_dt" className="title_locate mL20 dp0"></span>
                <div className="unit"></div>
            </div>
            
            <div className="right_bg">
                <div style={{width: '100%', height: '550px'}}>
                    <Graph 
                        data={{
                            rainData: rainData ? rainData.map(item => getPurifyData(item.rain) === "-" ? "-" : parseFloat(toFixedOfNum(getPurifyData(item.rain), 1, 0.01))) : [],
                            flowData: flowData ? flowData.map(item => getPurifyData(item.flow) === "-" ? "-" : parseFloat(toFixedOfNum(getPurifyData(item.flow), 2, 0.01))) : []
                        }}
                        header={tableHeaders}
                        dataType={searchVO.searchType}
                        sensorType={'compare'}
                        loading={loading}
                        onRenderComplete={() => {}}
                    />
                </div>
                <ul className="set_ulwrap_nh bB_3blue" style={{width: '100%', marginTop: '20px'}}>
                    <RptSearch 
                        onSearch={handleSearch}
                        searchVO={searchVO}
                        setSearchVO={setSearchVO}
                    />
                    <li className="li100_nor">
                        <table id="list_table" className="tb_data pB0">
                            <thead className="tb_data_tbg">
                                <tr>
                                    <th className="li10 bR_1gry" colSpan="2">구분</th>
                                    {tableHeaders.map((header, index) => (
                                        <th key={index} className="li3">{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rainData && (
                                    <tr className="hh">
                                        <td className="li5 bR_1gry">강우</td>
                                        <td className="li10 bR_1gry">{rainName}</td>
                                        {rainData && rainData.map((value, index) => (
                                            <td key={index} className="li3">{toFixedOfNum(getPurifyData(value.rain), 1, 0.01)}</td>
                                        ))}
                                    </tr>
                                )}
                                {flowData && (
                                    <tr className="hh">
                                        <td className="li5 bR_1gry">수위</td>
                                        <td className="li10 bR_1gry">{flowName}</td>
                                        {flowData && flowData.map((value, index) => (
                                            <td key={index} className="li3">{toFixedOfNum(getPurifyData(value.flow), 2, 0.01)}</td>
                                        ))}
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default RptCompar;