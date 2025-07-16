import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as EgovNet from 'context/egovFetch';
import dayjs from 'dayjs';
import * as common from 'js/common';
import RptSearch from './RptSearch';
import Graph from './CommonGraph';

function RptAWS(props) {

    console.group("RptAWSContent");
    console.log("[Start] RptAWSContent ------------------------------");
    console.log("RptAWSContent [props] : ", props);

    const [listTag, setListTag] = useState([]);
    const [selectedRtuName, setSelectedRtuName] = useState("");
    const [selectedAreaCode, setSelectedAreaCode] = useState(null);
    const [optionTag, setOptionTag] = useState([]);
    const [gData, setGraphData] = useState([]);
    const [tableHeaders, setTableHeaders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sensorType, setSensorType] = useState("0");

    const location = useLocation();

    const [searchVO, setSearchVO] = useState({
        searchType: "H",
        startDate: dayjs().startOf('day'),
        endDate: dayjs().endOf('day')
    });

    const selectRtu = (e) => {
        setSelectedAreaCode(e.target.value);
        
        // 선택된 RTU 정보 찾기
        if (listTag && listTag.length > 0) {
            const selectedRtu = listTag.find(rtu => rtu.area_code === e.target.value);
            if (selectedRtu) {
                setSelectedRtuName(selectedRtu.rtu_name);
                
                // 선택된 RTU의 데이터를 그래프용으로 변환
                let grpData;
                if(sensorType === "0") {
                    // 강우: 단일 데이터셋
                    grpData = selectedRtu.data.map(item => {
                        return item.current === "-" ? "-" : parseFloat(item.current) || 0;
                    });
                } else if(sensorType === "3") {
                    // 온도: 현재, 최고, 최저 데이터셋
                    grpData = {
                        current: selectedRtu.data.map(item => item.current === "-" ? "-" : parseFloat(item.current) || 0),
                        max: selectedRtu.data.map(item => item.max === "-" ? "-" : parseFloat(item.max) || 0),
                        min: selectedRtu.data.map(item => item.min === "-" ? "-" : parseFloat(item.min) || 0)
                    };
                } else if(sensorType === "4") {
                    // 풍향/풍속: 현재풍속, 최고풍속, 현재풍향, 최고풍향
                    grpData = {
                        vel: selectedRtu.data.map(item => item.vel === "-" ? "-" : parseFloat(item.vel) || 0),
                        max_vel: selectedRtu.data.map(item => item.max_vel === "-" ? "-" : parseFloat(item.max_vel) || 0),
                        deg: selectedRtu.data.map(item => item.deg || "-"),
                        max_deg: selectedRtu.data.map(item => item.max_deg || "-"),
                        deg_img: selectedRtu.data.map(item => item.wind_deg_img === "-" ? "" : `../images/wind/${item.wind_deg_img}`),
                        max_deg_img: selectedRtu.data.map(item => item.wind_max_deg_img === "-" ? "" : `../images/wind/${item.wind_max_deg_img}`)
                    };
                } else if(sensorType === "5") {
                    // 습도: 현재, 최고, 최저 데이터셋
                    grpData = {
                        current: selectedRtu.data.map(item => item.current === "-" ? "-" : parseFloat(item.current) || 0),
                        max: selectedRtu.data.map(item => item.max === "-" ? "-" : parseFloat(item.max) || 0),
                        min: selectedRtu.data.map(item => item.min === "-" ? "-" : parseFloat(item.min) || 0)
                    };
                } else {
                    // 기본값
                    grpData = selectedRtu.data.map(item => {
                        return item.current === "-" ? "-" : parseFloat(item.current) || 0;
                    });
                }
                
                // 그래프 데이터 업데이트 (기존 통계 데이터는 유지)
                setGraphData(prevData => ({
                    ...prevData,
                    data: grpData,
                    // 풍향 이미지 데이터 추가 (센서 타입 4일 때)
                    windData: sensorType === "4" && grpData ? {
                        deg_img: grpData.deg_img || [],
                        max_deg_img: grpData.max_deg_img || []
                    } : null
                }));
            }
        }
    }

    const retrieveList = (searchData) => {
        setLoading(true);
        const startDate = dayjs.isDayjs(searchData.startDate) ? searchData.startDate : dayjs(searchData.startDate);
        const endDate = dayjs.isDayjs(searchData.endDate) ? searchData.endDate : dayjs(searchData.endDate);
        
        // 검색 타입에 따른 배열 크기 계산
        const { arraySize } = common.getArrayConfig(searchData.searchType, startDate, endDate);
        
        const requestData = {
            ...location.state.commonVO,
            type: searchData.searchType,
            sdate: startDate.format('YYYY-MM-DD'),
            edate: endDate.format('YYYY-MM-DD'),
            sensor_type: parseInt(sensorType) // 센서 종류 추가
        };

        const retrieveListURL = '/divas/rpt/actionRptAWS.do';
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(requestData)
        }

        EgovNet.requestFetch(retrieveListURL,
            requestOptions,
            (resp) => {
                const processedData = [];
                const rtuNames = [];
                let grpData = [];
                const maxData = [];
                const minData = [];
                const avgData = [];
                
                if(resp.result.resultRtu.length < 1){
                    rtuNames.push(<option value="">장비 없음</option>);
                } else {
                    resp.result.resultRtu.forEach(function (item, index) {
                        const areaCode = item.area_code;
                        const awsList = resp.result.resultAWS[areaCode] || [];

                        rtuNames.push(
                            <option key={index} value={areaCode}>{item.rtu_name}</option>
                        );
                        
                        // 센서 타입별 데이터 처리
                        let rtuData = {
                            area_code: areaCode,
                            rtu_name: item.rtu_name,
                            data: [],
                            sum: 0,
                            avg: 0
                        };

                        // 검색 타입에 따른 데이터 배열 초기화
                        for(let i = 0; i < arraySize; i++) {
                            rtuData.data[i] = {
                                current: "-",
                                max: "-", 
                                min: "-"
                            };
                        }

                        // AWS 데이터에서 해당 센서 타입 데이터 추출
                        awsList.forEach(awsItem => {
                            let dataIndex;
                            // 검색 타입에 따른 인덱스 계산
                            switch(searchData.searchType) {
                                case "H": // 일간 (시간별)
                                    dataIndex = parseInt(awsItem.num);
                                    break;
                                case "D": // 월간 (일별)
                                    dataIndex = parseInt(awsItem.num) - 1; // 1일부터 시작하므로 -1
                                    // 해당 월의 실제 일수를 초과하는 데이터는 무시
                                    if (parseInt(awsItem.num) > startDate.daysInMonth()) {
                                        return;
                                    }
                                    break;
                                case "N": // 연간 (월별)
                                    dataIndex = parseInt(awsItem.num) - 1; // 1월부터 시작하므로 -1
                                    break;
                                case "A": // 일별 (날짜별)
                                    // awsItem.num은 실제 날짜값이므로 시작날짜를 빼서 인덱스 계산
                                    dataIndex = parseInt(awsItem.num) - startDate.date();
                                    break;
                                default:
                                    dataIndex = parseInt(awsItem.num);
                            }

                            if(dataIndex >= 0 && dataIndex < arraySize) {
                                switch(sensorType) {
                                    case "0": // 강우
                                        if(awsItem.sensing === "R") {
                                            let rain = awsItem.rain === -99999 ? "-" : parseFloat(awsItem.rain) || 0;
                                            rtuData.data[dataIndex].current = rain === "-" ? "-" : common.toFixedOfNum(rain, 1, 0.01);
                                            if(rain !== "-" && rain > 0) rtuData.sum += rain;
                                        }
                                        break;
                                    case "3": // 온도
                                        if(awsItem.sensing === "T") {
                                            let temp = awsItem.temp === -99999 ? "-" : common.toFixedOfNum(awsItem.temp, 1, 0.01);
                                            let temp_max = awsItem.temp_max === -99999 ? "-" : common.toFixedOfNum(awsItem.temp_max, 1, 0.01);
                                            let temp_min = awsItem.temp_min === -99999 ? "-" : common.toFixedOfNum(awsItem.temp_min, 1, 0.01);
                                            rtuData.data[dataIndex] = {
                                                current: temp,
                                                max: temp_max,
                                                min: temp_min
                                            };
                                        }
                                        break;
                                    case "4": // 풍향/풍속
                                        if(awsItem.sensing === "W") {
                                            let wind_vel = awsItem.wind_vel === -99999 ? "-" : common.toFixedOfNum(awsItem.wind_vel, 1, 0.01);
                                            let wind_deg = awsItem.wind_deg === "-" ? "-" : awsItem.wind_deg;
                                            let wind_max_vel = awsItem.wind_max_vel === -99999 ? "-" : common.toFixedOfNum(awsItem.wind_max_vel, 1, 0.01);
                                            let wind_max_deg = awsItem.wind_max_deg === "-" ? "-" : awsItem.wind_max_deg;
                                            rtuData.data[dataIndex] = {
                                                vel: wind_vel,
                                                deg: wind_deg,
                                                max_vel: wind_max_vel,
                                                max_deg: wind_max_deg,
                                                wind_deg_img: awsItem.wind_deg_img || "",
                                                wind_max_deg_img: awsItem.wind_max_deg_img || ""
                                            };
                                        }
                                        break;
                                    case "5": // 습도
                                        if(awsItem.sensing === "H") {
                                            let humi = awsItem.humi === -99999 ? "-" : common.toFixedOfNum(awsItem.humi, 1, 0.01);
                                            let humi_max = awsItem.humi_max === -99999 ? "-" : common.toFixedOfNum(awsItem.humi_max, 1, 0.01);
                                            let humi_min = awsItem.humi_min === -99999 ? "-" : common.toFixedOfNum(awsItem.humi_min, 1, 0.01);
                                            rtuData.data[dataIndex] = {
                                                current: humi,
                                                max: humi_max,
                                                min: humi_min
                                            };
                                        }
                                        break;
                                }
                            }
                        });

                        processedData.push(rtuData);
                    });
                    // console.log("processedData : ", processedData);
                    // 강우일 때만 통계 계산
                    if(sensorType === "0") {
                        for(let i = 0; i < arraySize; i++) {
                            let values = processedData
                                .map(rtu => rtu.data[i].current)
                                .filter(val => val !== "-")
                                .map(val => parseFloat(val) || 0);
                            
                            if(values.length > 0) {
                                maxData[i] = Math.max(...values);
                                minData[i] = Math.min(...values);
                                avgData[i] = values.reduce((a, b) => a + b, 0) / values.length;
                            } else {
                                maxData[i] = 0;
                                minData[i] = 0;
                                avgData[i] = 0;
                            }
                        }
                    }
                }
                
                setListTag(processedData);
                setTableHeaders(resp.result.headers || []);
                setOptionTag(rtuNames);
                
                // 현재 선택된 RTU 또는 첫 번째 RTU의 데이터로 그래프 설정
                let currentAreaCode = selectedAreaCode;
                let currentRtuName = selectedRtuName;
                
                // 선택된 RTU가 없거나 processedData에 해당 RTU가 없는 경우 첫 번째 RTU 선택
                if (!currentAreaCode || !processedData.find(rtu => rtu.area_code === currentAreaCode)) {
                    if (processedData.length > 0) {
                        currentAreaCode = processedData[0].area_code;
                        currentRtuName = processedData[0].rtu_name;
                        setSelectedAreaCode(currentAreaCode);
                        setSelectedRtuName(currentRtuName);
                    }
                }
                
                // 현재 선택된 RTU의 데이터를 그래프용으로 변환
                grpData = [];
                if (currentAreaCode) {
                    const selectedRtu = processedData.find(rtu => rtu.area_code === currentAreaCode);
                    if (selectedRtu) {
                        if(sensorType === "0") {
                            // 강우: 단일 데이터셋
                            grpData = selectedRtu.data.map(item => {
                                return item.current === "-" ? "-" : parseFloat(item.current) || 0;
                            });
                        } else if(sensorType === "3") {
                            // 온도: 현재, 최고, 최저 데이터셋
                            grpData = {
                                current: selectedRtu.data.map(item => item.current === "-" ? "-" : parseFloat(item.current) || 0),
                                max: selectedRtu.data.map(item => item.max === "-" ? "-" : parseFloat(item.max) || 0),
                                min: selectedRtu.data.map(item => item.min === "-" ? "-" : parseFloat(item.min) || 0)
                            };
                        } else if(sensorType === "4") {
                            // 풍향/풍속: 현재풍속, 최고풍속, 현재풍향, 최고풍향
                            grpData = {
                                vel: selectedRtu.data.map(item => item.vel === "-" ? "-" : parseFloat(item.vel) || 0),
                                max_vel: selectedRtu.data.map(item => item.max_vel === "-" ? "-" : parseFloat(item.max_vel) || 0),
                                deg: selectedRtu.data.map(item => item.deg || "-"),
                                max_deg: selectedRtu.data.map(item => item.max_deg || "-"),
                                deg_img: selectedRtu.data.map(item => item.wind_deg_img === "-" ? "" : `../images/wind/${item.wind_deg_img}`),
                                max_deg_img: selectedRtu.data.map(item => item.wind_max_deg_img === "-" ? "" : `../images/wind/${item.wind_max_deg_img}`)
                            };
                        } else if(sensorType === "5") {
                            // 습도: 현재, 최고, 최저 데이터셋
                            grpData = {
                                current: selectedRtu.data.map(item => item.current === "-" ? "-" : parseFloat(item.current) || 0),
                                max: selectedRtu.data.map(item => item.max === "-" ? "-" : parseFloat(item.max) || 0),
                                min: selectedRtu.data.map(item => item.min === "-" ? "-" : parseFloat(item.min) || 0)
                            };
                        } else {
                            // 기본값
                            grpData = selectedRtu.data.map(item => {
                                return item.current === "-" ? "-" : parseFloat(item.current) || 0;
                            });
                        }
                    }
                }
                
                setGraphData({
                    data: grpData,
                    maxData: maxData,
                    minData: minData,
                    avgData: avgData,
                    // 풍향 이미지 데이터 추가 (센서 타입 4일 때)
                    windData: sensorType === "4" && grpData ? {
                        deg_img: grpData.deg_img || [],
                        max_deg_img: grpData.max_deg_img || []
                    } : null
                });
                setLoading(false);
            },
            function (resp) {
                console.log("err response : ", resp);
                setLoading(false);
            }
        );

    }

    // 검색 핸들러
    const handleSearch = (searchData) => {
        setSearchVO(searchData);
        retrieveList(searchData);
    };

    // 센서 종류 변경 시 재검색
    useEffect(() => {
        if (searchVO) {
            retrieveList(searchVO);
        }
    }, [sensorType]);

    // 센서 종류별 테이블 렌더링 함수
    const renderTable = () => {
        if (!listTag || listTag.length === 0) {
            return (
                <table id="list_table" className="tb_data pB0">
                    <tbody>
                        <tr>
                            <td colSpan="100%" className="no_data">검색된 결과가 없습니다.</td>
                        </tr>
                    </tbody>
                </table>
            );
        }

        switch(sensorType) {
            case "0": // 강우
                return (
                    <table id="list_table" className="tb_data pB0">
                        <thead className="tb_data_tbg">
                            <tr>
                                <th className="w10i bR_1gry">구분</th>
                                {tableHeaders.map((header, index) => (
                                    <th key={index} className="li3">{header}</th>
                                ))}
                                <th className="bL_1gry">누계</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listTag.map((rtu, index) => (
                                <tr key={rtu.area_code} className="hh tr_rtu" data-id={rtu.area_code}>
                                    <td className="bR_1gry">{rtu.rtu_name}</td>
                                    {rtu.data.map((item, hourIndex) => (
                                        <td key={hourIndex}>{item.current}</td>
                                    ))}
                                    <td className="bL_1gry">{common.toFixedOfNum(rtu.sum, 1, 0.01)}</td>
                                </tr>
                            ))}
                            {/* 통계 행들 */}
                            <tr className="bg_lgr print_hd">
                                <td className="li10 bg_lb bR_1gry">최고</td>
                                {gData.maxData && gData.maxData.map((val, index) => (
                                    <td key={index} className="li3">{common.toFixedOfNum(val, 1, 0.01)}</td>
                                ))}
                                <td className="backslash bL_1gry"></td>
                            </tr>
                            <tr className="bg_lgr print_hd">
                                <td className="li10 bg_lb bR_1gry">최저</td>
                                {gData.minData && gData.minData.map((val, index) => (
                                    <td key={index} className="li3">{common.toFixedOfNum(val, 1, 0.01)}</td>
                                ))}
                                <td className="backslash bL_1gry"></td>
                            </tr>
                            <tr className="bg_lgr print_hd">
                                <td className="li10 bg_lb bR_1gry">평균</td>
                                {gData.avgData && gData.avgData.map((val, index) => (
                                    <td key={index} className="li3">{common.toFixedOfNum(val, 1, 0.01)}</td>
                                ))}
                                <td className="backslash bL_1gry"></td>
                            </tr>
                        </tbody>
                    </table>
                );
            case "3": // 온도
                return (
                    <table id="list_table" className="tb_data p0">
                        <thead className="tb_data_tbg">
                            <tr>
                                <th className="w10i bR_1gry">구분</th>
                                <th className="bR_1gry">종류</th>
                                {tableHeaders.map((header, index) => (
                                    <th key={index} className="li3">{header}</th>
                                ))}
                                <th className="bL_1gry">평균</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listTag.map((rtu, rtuIndex) => (
                                <React.Fragment key={rtu.area_code}>
                                    <tr className="hh tr_rtu" data-id={rtu.area_code}>
                                        <td className="realName bR_1gry" rowSpan="3">{rtu.rtu_name}</td>
                                        <td className="bR_1gry">현재</td>
                                        {rtu.data.map((item, hourIndex) => (
                                            <td key={hourIndex}>{item.current}</td>
                                        ))}
                                        <td className="bL_1gry">-</td>
                                    </tr>
                                    <tr className="hh tr_rtu" data-id={rtu.area_code}>
                                        <td className="bR_1gry">최고</td>
                                        {rtu.data.map((item, hourIndex) => (
                                            <td key={hourIndex}>{item.max}</td>
                                        ))}
                                        <td className="bL_1gry">-</td>
                                    </tr>
                                    <tr className="hh tr_rtu" data-id={rtu.area_code}>
                                        <td className="bR_1gry">최저</td>
                                        {rtu.data.map((item, hourIndex) => (
                                            <td key={hourIndex}>{item.min}</td>
                                        ))}
                                        <td className="bL_1gry">-</td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                );
            case "4": // 풍향/풍속
                return (
                    <table id="list_table" className="tb_data p0">
                        <thead className="tb_data_tbg">
                            <tr>
                                <th className="w10i bR_1gry">구분</th>
                                <th className="bR_1gry">종류</th>
                                <th className="bR_1gry">타입</th>
                                {tableHeaders.map((header, index) => (
                                    <th key={index} className="li3">{header}</th>
                                ))}
                                <th className="bL_1gry">평균</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listTag.map((rtu, rtuIndex) => (
                                <React.Fragment key={rtu.area_code}>
                                    <tr className="hh tr_rtu" data-id={rtu.area_code}>
                                        <td className="realName2 bR_1gry" rowSpan="4">{rtu.rtu_name}</td>
                                        <td className="realDepth bR_1gry" rowSpan="2">현재</td>
                                        <td className="bR_1gry">풍향</td>
                                        {rtu.data.map((item, hourIndex) => (
                                            <td key={hourIndex}>{item.deg || "-"}</td>
                                        ))}
                                        <td className="bL_1gry">-</td>
                                    </tr>
                                    <tr className="hh tr_rtu" data-id={rtu.area_code}>
                                        <td className="bR_1gry">풍속</td>
                                        {rtu.data.map((item, hourIndex) => (
                                            <td key={hourIndex}>{item.vel || "-"}</td>
                                        ))}
                                        <td className="bL_1gry">-</td>
                                    </tr>
                                    <tr className="hh tr_rtu" data-id={rtu.area_code}>
                                        <td className="realDepth bR_1gry" rowSpan="2">최고</td>
                                        <td className="bR_1gry">풍향</td>
                                        {rtu.data.map((item, hourIndex) => (
                                            <td key={hourIndex}>{item.max_deg || "-"}</td>
                                        ))}
                                        <td className="bL_1gry">-</td>
                                    </tr>
                                    <tr className="hh tr_rtu" data-id={rtu.area_code}>
                                        <td className="bR_1gry">풍속</td>
                                        {rtu.data.map((item, hourIndex) => (
                                            <td key={hourIndex}>{item.max_vel || "-"}</td>
                                        ))}
                                        <td className="bL_1gry">-</td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                );
            case "5": // 습도
                return (
                    <table id="list_table" className="tb_data p0">
                        <thead className="tb_data_tbg">
                            <tr>
                                <th className="w10i bR_1gry">구분</th>
                                <th className="bR_1gry">종류</th>
                                {tableHeaders.map((header, index) => (
                                    <th key={index} className="li3">{header}</th>
                                ))}
                                <th className="bL_1gry">평균</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listTag.map((rtu, rtuIndex) => (
                                <React.Fragment key={rtu.area_code}>
                                    <tr className="hh tr_rtu" data-id={rtu.area_code}>
                                        <td className="realName bR_1gry" rowSpan="3">{rtu.rtu_name}</td>
                                        <td className="bR_1gry">현재</td>
                                        {rtu.data.map((item, hourIndex) => (
                                            <td key={hourIndex}>{item.current}</td>
                                        ))}
                                        <td className="bL_1gry">-</td>
                                    </tr>
                                    <tr className="hh tr_rtu" data-id={rtu.area_code}>
                                        <td className="bR_1gry">최고</td>
                                        {rtu.data.map((item, hourIndex) => (
                                            <td key={hourIndex}>{item.max}</td>
                                        ))}
                                        <td className="bL_1gry">-</td>
                                    </tr>
                                    <tr className="hh tr_rtu" data-id={rtu.area_code}>
                                        <td className="bR_1gry">최저</td>
                                        {rtu.data.map((item, hourIndex) => (
                                            <td key={hourIndex}>{item.min}</td>
                                        ))}
                                        <td className="bL_1gry">-</td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                );
            default:
                return (
                    <table id="list_table" className="tb_data pB0">
                        <thead className="tb_data_tbg">
                            <tr>
                                <th className="w10i bR_1gry">구분</th>
                                {tableHeaders.map((header, index) => (
                                    <th key={index} className="li3">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan="100%" className="no_data">데이터를 선택해주세요.</td>
                            </tr>
                        </tbody>
                    </table>
                );
        }
    };

    useEffect(() => {
        const defaultSearchData = {
            searchType: "H",
            startDate: dayjs().startOf('day'),
            endDate: dayjs().endOf('day')
        };
        retrieveList(defaultSearchData);
    }, []);

    console.log("------------------------------RptAWSContent [End]");
    console.groupEnd("RptAWSContent");

    return (
        <div id="content">
            <div className="main_contitle">
                <img src="../images/title_06_11.png" alt="AWS 보고서" />
                <span id="rtu_name" className="title_locate mL20">{selectedRtuName}</span>
                <select id="area_code" name="area_code"
                    className="fL mL10 mT3 print_hd" 
                    style={{border: '1px solid #000'}}
                    onChange={selectRtu}>
                    {optionTag}
                </select> 
			    <span id="search_dt" className="title_locate mL20 dp0"></span>
                <div className="unit">[단위 : {sensorType === "0" ? "mm" : sensorType === "1" ? "m" : sensorType === "2" ? "cm" : sensorType === "3" ? "℃" : sensorType === "4" ? "㎧" : sensorType === "5" ? "%" : ""}]</div>
            </div>
            <div className="right_bg">
                
                <div style={{width: '100%', height: '520px', marginBottom: '20px'}}>
                    <Graph 
                        data={gData && gData.data ? gData.data : []}
                        header={tableHeaders}
                        dataType={searchVO.searchType}
                        sensorType={sensorType}
                        loading={loading}
                        windData={gData && gData.windData ? gData.windData : null}
                        onRenderComplete={() => {}}
                    />
                </div>
                
                <ul className="set_ulwrap_nh bB_3blue">
                    <RptSearch 
                        onSearch={handleSearch}
                        searchVO={searchVO}
                        setSearchVO={setSearchVO}
                        type="aws"
                        sensorType={sensorType}
                        setSensorType={setSensorType}
                    />
                    <li className="li100_nor">
                        {renderTable()}
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default RptAWS;