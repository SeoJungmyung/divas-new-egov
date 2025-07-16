import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as EgovNet from 'context/egovFetch';
import * as common from 'js/common';
import $ from 'jquery';
import dayjs from 'dayjs';
import RptSearch from './RptSearch';
import Graph from './CommonGraph';

function RptSnow(props) {

    console.group("RptSnowContent");
    console.log("[Start] RptSnowContent ------------------------------");
    console.log("RptSnowContent [props] : ", props);

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
            ...location.state?.commonVO,
            type: searchData.searchType,
            sdate: startDate.format('YYYY-MM-DD'),
            edate: endDate.format('YYYY-MM-DD')
        };
        
        // 검색 타입에 따른 배열 크기 및 인덱스 계산 함수
        const { arraySize } = common.getArrayConfig(searchData.searchType, startDate, endDate);
        
        const retrieveListURL = '/divas/rpt/actionRptSnow.do';
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
                let avrSnowDate = Array(arraySize).fill(0);
                let maxSnowDate = Array(arraySize).fill(-Infinity);
                let minSnowDate = Array(arraySize).fill(Infinity);
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
                    let snowList = resp.result.resultSnow;
                    
                    // grpData 초기화
                    if (!grpData[areaCode]) {
                        grpData[areaCode] = Array(arraySize).fill(0);
                    }
                    
                    rtuNames.push(
                        <option key={index} value={areaCode} selected={areaCode === selectedAreaCode}>{item.rtu_name}</option>
                    );
                    
                    rtuCount++;
                    
                    // 데이터 처리만 수행
                    for (var key in snowList) {
                        if(areaCode === key) {
                            snowList[key].forEach((val, idx) => {
                                let snow = val.snow === -99999 ? 0 : parseFloat(common.toFixedOfNum(val.snow, 1, 0.0001));
                                
                                // 월별 검색 시 해당 월의 실제 일수를 초과하는 데이터는 무시
                                if (searchData.searchType === 'D' && val.num > startDate.daysInMonth()) {
                                    return;
                                }
                                
                                if (idx < arraySize) {
                                    grpData[areaCode][idx] = snow;
                                    
                                    if(snow > 0) {
                                        avrSnowDate[idx] += snow;
                                        maxSnowDate[idx] = Math.max(maxSnowDate[idx], snow);
                                        minSnowDate[idx] = Math.min(minSnowDate[idx], snow);
                                    }
                                }
                            });
                        }
                    }
                });

                // RTU 목록을 state에 저장 (JSX에서 사용)
                const rtuList = resp.result.resultRtu;
                
                // 통계 데이터 계산
                const avgData = rtuCount > 0 ? avrSnowDate.map(sum => sum / rtuCount) : [];
                const maxData = maxSnowDate.map(val => val === -Infinity ? 0 : val);
                const minData = minSnowDate.map(val => val === Infinity ? 0 : val);
                
                // state 업데이트
                setTotalListTag({ 
                    rtuList, 
                    snowData: resp.result.resultSnow, 
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

    console.log("------------------------------RptSnowContent [End]");
    console.groupEnd("RptSnowContent");

    return (
        <div id="content">
            <div className="main_contitle">
                <img src="../images/title_05_08.png" alt="적설 보고서" />
                <span id="rtu_name" className="title_locate mL20">{selectedRtuName}</span>
                <select id="area_code" name="area_code" className="fL mL10 mT3 print_hd"
                    style={{border: '1px solid #000'}}
                    onChange={selectRtu}>
                    {optionTag}
                </select> 
			    <span id="search_dt" className="title_locate mL20 dp0"></span>
                <div className="unit">[단위 : cm]</div>
            </div>
            <div className="right_bg">

                <div style={{width: '100%', height: '450px'}}>
                    <Graph 
                        data={gData} 
                        header={headerTag}
                        rtuName={selectedRtuName}
                        dataType={searchVO.searchType}
                        sensorType={'2'}
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
                                            const snowData = totalListTag.snowData[areaCode] || [];
                                            let sumSnow = 0;
                                            
                                            return (
                                                <tr key={areaCode} id={areaCode}>
                                                    <td key={`rtu-${areaCode}`} className="bR_1gry">{rtu.rtu_name}</td>
                                                    {snowData.map((val, idx) => {
                                                        if (totalListTag.searchType === 'D' && val.num > totalListTag.maxDays) {
                                                            return null;
                                                        }
                                                        
                                                        const snow = val.snow === -99999 ? "-" : common.toFixedOfNum(val.snow, 1, 0.001);
                                                        const displayNum = parseInt(val.num) < 10 ? "0" + val.num : "" + val.num;
                                                        
                                                        if(snow !== "-" && $.isNumeric(snow)) {
                                                            sumSnow += Number(snow);
                                                        }
                                                        
                                                        return (
                                                            <td key={`${areaCode}_${displayNum}`} 
                                                                data-areacode={areaCode} 
                                                                data-hour={displayNum} 
                                                                onClick={() => {}}>
                                                                {snow}
                                                            </td>
                                                        );
                                                    })}
                                                    <td key={`${areaCode}_sum`} className="bL_1gry">
                                                        {common.toFixedOfNum(sumSnow, 1, 0.001)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        
                                        {/* 통계 행들 */}
                                        {totalListTag.rtuList.length > 0 && (
                                            <>
                                                <tr key="max">
                                                    <td key="max_label" className="bg_lb bR_1gry">최고</td>
                                                    {totalListTag.maxData.map((snow, index) => (
                                                        <td key={`max_${index}`}>{common.toFixedOfNum(snow, 1, 0.001)}</td>
                                                    ))}
                                                    <td key="max_sum" className="bL_1gry">-</td>
                                                </tr>
                                                <tr key="min">
                                                    <td key="min_label" className="bg_lb bR_1gry">최저</td>
                                                    {totalListTag.minData.map((snow, index) => (
                                                        <td key={`min_${index}`}>{common.toFixedOfNum(snow, 1, 0.001)}</td>
                                                    ))}
                                                    <td key="min_sum" className="bL_1gry">-</td>
                                                </tr>
                                                <tr key="avr">
                                                    <td key="avr_label" className="bg_lb bR_1gry">평균</td>
                                                    {totalListTag.avgData.map((snow, index) => (
                                                        <td key={`avr_${index}`}>{common.toFixedOfNum(snow, 1, 0.001)}</td>
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

export default RptSnow;