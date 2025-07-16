import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as EgovNet from 'context/egovFetch';
import * as common from 'js/common';
import $ from 'jquery';
import dayjs from 'dayjs';
import RptSearch from './RptSearch';
import Graph from './CommonGraph';

function RptRain(props) {

    console.group("RptRainContent");
    console.log("[Start] RptRainContent ------------------------------");
    console.log("RptRainContent [props] : ", props);

    const [totalListTag, setTotalListTag] = useState([]);
    const [optionTag, setOptionTag] = useState([]);
    const [gData, setGraphData] = useState([]);
    const [allGraphData, setAllGraphData] = useState({});
    const [selectedRtuName, setSelectedRtuName] = useState("");
    const [selectedAreaCode, setSelectedAreaCode] = useState(null);
    const [headerTag, setHeaderTag] = useState([]);
    const [loading, setLoading] = useState(false);

    const location = useLocation();

    const [searchVO, setSearchVO] = useState({
        searchType: "H",
        startDate: dayjs().startOf('day'),
        endDate: dayjs().endOf('day')
    });
        
    const selectRtu = (e) => {
        setSelectedAreaCode(e.target.value);
        
        // 선택된 RTU 정보 찾기
        if (totalListTag && totalListTag.rtuList) {
            const selectedRtu = totalListTag.rtuList.find(rtu => rtu.area_code === e.target.value);
            if (selectedRtu) {
                setSelectedRtuName(selectedRtu.rtu_name);
            }
        }
        
        // allGraphData에서 해당 areaCode의 데이터를 그래프에 설정
        if (allGraphData[e.target.value]) {
            setGraphData(allGraphData[e.target.value]);
        }
    }

    const retrieveList = (searchData) => {
        setLoading(true);
        const startDate = dayjs(searchData.startDate);
        const endDate = dayjs(searchData.endDate);
        
        const requestData = {
            ...location.state.commonVO,
            type: searchData.searchType,
            sdate: startDate.format('YYYY-MM-DD'),
            edate: endDate.format('YYYY-MM-DD')
        };
        // console.log("requestData : ", requestData);
        
        // 검색 타입에 따른 배열 크기 및 인덱스 계산 함수
        const { arraySize } = common.getArrayConfig(searchData.searchType, startDate, endDate);
        
        const retrieveListURL = '/divas/rpt/actionRptRain.do';
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
                // 완전 초기화
                setTotalListTag([]);
                setOptionTag([]);
                setHeaderTag([]);
                setGraphData([]);
                setAllGraphData({});
                
                let mutListTag = [];
                let rtuNames = [];
                let grpData = {};
                let avrRainDate = Array(arraySize).fill(0);
                let maxRainDate = Array(arraySize).fill(-Infinity);
                let minRainDate = Array(arraySize).fill(Infinity);
                let rtuCount = 0;
                
                if(resp.result.resultRtu.length < 1){
                    mutListTag.push(<p key="no-data" className="no_data">검색된 결과가 없습니다.</p>);
                    rtuNames.push(<option key="no-rtu" value="">장비 없음</option>);
                    setTotalListTag(mutListTag);
                    setOptionTag(rtuNames);
                    setLoading(false);
                    return;
                }

                setHeaderTag(resp.result.headers || []);

                // 데이터 준비만 수행 (TD 생성은 JSX에서)
                resp.result.resultRtu.forEach(function (item, index) {
                    let areaCode = item.area_code;
                    let rainList = resp.result.resultRain;
                    
                    // grpData 초기화
                    if (!grpData[areaCode]) {
                        grpData[areaCode] = Array(arraySize).fill(0);
                    }
                    
                    rtuNames.push(
                        <option key={index} value={areaCode} selected={areaCode === selectedAreaCode}>{item.rtu_name}</option>
                    );
                    
                    rtuCount++;
                    
                    // 데이터 처리만 수행
                    for (var key in rainList) {
                        if(areaCode === key) {
                            rainList[key].forEach((val, idx) => {
                                let rain = val.rain === -99999 ? 0 : parseFloat(common.toFixedOfNum(val.rain, 1, 0.01));
                                
                                // 월별 검색 시 해당 월의 실제 일수를 초과하는 데이터는 무시
                                if (searchData.searchType === 'D' && val.num > startDate.daysInMonth()) {
                                    return;
                                }
                                
                                if (idx < arraySize) {
                                    grpData[areaCode][idx] = rain;
                                    
                                    if(rain > 0) {
                                        avrRainDate[idx] += rain;
                                        maxRainDate[idx] = Math.max(maxRainDate[idx], rain);
                                        minRainDate[idx] = Math.min(minRainDate[idx], rain);
                                    }
                                }
                            });
                        }
                    }
                });

                // RTU 목록을 state에 저장 (JSX에서 사용)
                const rtuList = resp.result.resultRtu;
                
                // 통계 데이터 계산
                const avgData = rtuCount > 0 ? avrRainDate.map(sum => sum / rtuCount) : [];
                const maxData = maxRainDate.map(val => val === -Infinity ? 0 : val);
                const minData = minRainDate.map(val => val === Infinity ? 0 : val);
                
                // state 업데이트
                setTotalListTag({ 
                    rtuList, 
                    rainData: resp.result.resultRain, 
                    avgData, 
                    maxData, 
                    minData,
                    arraySize,
                    searchType: searchData.searchType,
                    maxDays: startDate.daysInMonth()
                });
                setOptionTag(rtuNames);

                // 첫 번째 RTU의 데이터를 기본 그래프로 설정
                if (rtuList.length > 0 && Object.keys(grpData).length > 0) {
                    const firstAreaCode = selectedAreaCode || rtuList[0].area_code;
                    const firstRtuName = selectedRtuName || rtuList[0].rtu_name;
                    setGraphData(grpData[firstAreaCode] || []);
                    setSelectedRtuName(firstRtuName);
                    setSelectedAreaCode(firstAreaCode);
                }
                
                setAllGraphData(grpData);
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

    useEffect(() => {
        const defaultSearchData = {
            searchType: "H",
            startDate: dayjs().startOf('day'),
            endDate: dayjs().endOf('day')
        };
        retrieveList(defaultSearchData);
        return () => {
        }
    }, []);

    console.log("------------------------------RptRainContent [End]");
    console.groupEnd("RptRainContent");

    return (
        <div id="content">
            <div className="main_contitle">
                <img src="../images/title_05_03.png" alt="강우 보고서" />
                <span id="rtu_name" className="title_locate mL20">{selectedRtuName}</span>
                <select id="area_code" name="area_code" className="fL mL10 mT3 print_hd"
                    style={{border: '1px solid #000'}}
                    onChange={selectRtu}>
                    {optionTag}
                </select> 
			    <span id="search_dt" className="title_locate mL20 dp0"></span>
                <div className="unit">[단위 : mm]</div>
            </div>
            <div className="right_bg">

                <div style={{width: '100%', height: '450px'}}>
                    <Graph 
                        data={gData} 
                        header={headerTag}
                        rtuName={selectedRtuName}
                        dataType={searchVO.searchType}
                        sensorType={'0'}
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
                        <table id="view_table" className="tb_data">
                            <thead className="tb_data_tbg">
                                <tr>
                                <td className="w10i bR_1gry">구분</td>
                                    {headerTag.map((header, index) => (
                                        <th key={index} className="li3">{header}</th>
                                    ))}
                                    <td className="bL_1gry">누계</td>
                                </tr>
                            </thead>
                            <tbody>
                                {totalListTag && totalListTag.rtuList ? (
                                    <>
                                        {/* RTU 데이터 행들 */}
                                        {totalListTag.rtuList.map((rtu, rtuIndex) => {
                                            const areaCode = rtu.area_code;
                                            const rainData = totalListTag.rainData[areaCode] || [];
                                            let sumRain = 0;
                                            
                                            return (
                                                <tr key={areaCode} id={areaCode}>
                                                    <td key={`rtu-${areaCode}`} className="bR_1gry">{rtu.rtu_name}</td>
                                                    {rainData.map((val, idx) => {
                                                        if (totalListTag.searchType === 'D' && val.num > totalListTag.maxDays) {
                                                            return null;
                                                        }
                                                        
                                                        const rain = val.rain === -99999 ? "-" : common.toFixedOfNum(val.rain, 1, 0.01);
                                                        const displayNum = parseInt(val.num) < 10 ? "0" + val.num : "" + val.num;
                                                        
                                                        if(rain !== "-" && $.isNumeric(rain)) {
                                                            sumRain += Number(rain);
                                                        }
                                                        
                                                        return (
                                                            <td key={`${areaCode}_${displayNum}`} 
                                                                data-areacode={areaCode} 
                                                                data-hour={displayNum} 
                                                                onClick={() => {}}>
                                                                {rain}
                                                            </td>
                                                        );
                                                    })}
                                                    <td key={`${areaCode}_sum`} className="bL_1gry">
                                                        {common.toFixedOfNum(sumRain, 1, 1)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        
                                        {/* 통계 행들 */}
                                        {totalListTag.rtuList.length > 0 && (
                                            <>
                                                <tr key="max">
                                                    <td key="max_label" className="bg_lb bR_1gry">최고</td>
                                                    {totalListTag.maxData.map((rain, index) => (
                                                        <td key={`max_${index}`}>{common.toFixedOfNum(rain, 1, 1)}</td>
                                                    ))}
                                                    <td key="max_sum" className="bL_1gry">-</td>
                                                </tr>
                                                <tr key="min">
                                                    <td key="min_label" className="bg_lb bR_1gry">최저</td>
                                                    {totalListTag.minData.map((rain, index) => (
                                                        <td key={`min_${index}`}>{common.toFixedOfNum(rain, 1, 1)}</td>
                                                    ))}
                                                    <td key="min_sum" className="bL_1gry">-</td>
                                                </tr>
                                                <tr key="avr">
                                                    <td key="avr_label" className="bg_lb bR_1gry">평균</td>
                                                    {totalListTag.avgData.map((rain, index) => (
                                                        <td key={`avr_${index}`}>{common.toFixedOfNum(rain, 1, 1)}</td>
                                                    ))}
                                                    <td key="avr_sum" className="bL_1gry">-</td>
                                                </tr>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <tr>
                                        <td colSpan="100%" className="no_data">검색된 결과가 없습니다.</td>
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

export default RptRain;