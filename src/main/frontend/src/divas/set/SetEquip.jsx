import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import * as EgovNet from 'context/egovFetch';
import SetEquipDetail from 'divas/set/SetEquipDetail';
import { showSensorPopup } from 'js/common';
import dayjs from 'dayjs';

function SetEquip(props) {

    console.group("SetEquipContent");
    console.log("[Start] SetEquipContent ------------------------------");
    console.log("SetEquipContent [props] : ", props);

    const history = useHistory();

    const [reload, setLoadState] = useState(false);
    const [organListTag, setOrganListTag] = useState([]);
    const [rightList, setRightList] = useState([]);
    const [scriptListTag, setScriptListTag] = useState([]);
    const [scriptDetail, setScriptList] = useState([]);
    const [allScriptDetail, setAllScriptList] = useState([]); // 전체 데이터 저장
    const [scriptNo, selectScriptNo] = useState("");
    const [userType, setUserType] = useState("0"); // 사용자 타입 상태 추가

    const [lineList, setLineList] = useState([]);
    const [modelList, setModelList] = useState([]);

    // 검색 조건들을 state로 관리
    const [searchSel, setSearchSel] = useState('rtu_name');
    const [searchText, setSearchText] = useState('');
    const [selectOrgan, setSelectOrgan] = useState('');
        
    const retrieveList = () => {
        const retrieveListURL = '/divas/set/SetEquip.do';
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ search_sel : 'rtu_name', search_text : '', select_organ: '' }) // 전체 데이터 가져오기
        }

        EgovNet.requestFetch(retrieveListURL,
            requestOptions,
            (resp) => {
                console.log("result = ", resp.result);
                
                // 전체 데이터 저장
                let scriptObj = resp.result.rtuList || [];
                setAllScriptList(scriptObj);
                
                // 초기 표시용 (필터링 없이 전체)
                applyFilter(scriptObj, searchSel, searchText, selectOrgan);

                // 회선 목록 설정
                if(resp.result.lineList) {
                    setLineList(resp.result.lineList);
                }

                // 모델 목록 설정
                if(resp.result.modelList) {
                    setModelList(resp.result.modelList);
                }
                // 기관 목록 설정
                if(resp.result.organList) {
                    let organOptions = [];
                    organOptions.push(<option key="all" value="">전체</option>);
                    resp.result.organList.forEach(function (item, index) {
                        organOptions.push(
                            <option key={item.organ_id} value={item.organ_id}>{item.organ_name}</option>
                        );
                    });
                    setOrganListTag(organOptions);
                }
            },
            function (resp) {
                console.log("err response : ", resp);
            }
        );
    }

    // 클라이언트 사이드 필터링 함수
    const applyFilter = (dataList, search_sel, search_text, select_organ) => {
        let filteredData = [...dataList];
        
        // 기관별 필터링
        if (select_organ && select_organ !== '') {
            filteredData = filteredData.filter(item => item.organ_id === select_organ);
        }
        
        // 검색어 필터링
        if (search_text && search_text.trim() !== '') {
            const searchValue = search_text.toLowerCase();
            filteredData = filteredData.filter(item => {
                switch(search_sel) {
                    case 'rtu_name':
                        return item.rtu_name && item.rtu_name.toLowerCase().includes(searchValue);
                    case 'rtu_type':
                        const rtu_type_name = getRtuTypeName(item.rtu_type);
                        return rtu_type_name.toLowerCase().includes(searchValue);
                    case 'area_code':
                        return item.area_code && item.area_code.toLowerCase().includes(searchValue);
                    default:
                        return true;
                }
            });
        }
        
        // 필터링된 데이터로 테이블 태그 생성
        let mutListTag = [];
        
        if(filteredData.length < 1){
            mutListTag.push(<tr key="nodata" className="no_data"><td colSpan={12}>검색된 결과가 없습니다.</td></tr>);
        } else {
            filteredData.forEach(function (item, index) {
                const rtu_type_name = getRtuTypeName(item.rtu_type);
                mutListTag.push(
                    <tr key={"rtu_"+index} id={"list"+index} className="pointer hh h38p" onClick={() => onClickScript(item.rtu_id)}>
                        <td className="li5">{index + 1}</td>
                        <td className="li5 bL_1gry">{item.sort_flag || 0}</td>
                        <td className="li5 bL_1gry">{item.rtu_id}</td>
                        <td className="li5 bL_1gry">{item.signal_id}</td>
                        <td className="li20 bL_1gry">{item.rtu_name}</td>
                        <td className="li10 bL_1gry">{rtu_type_name}</td>
                        <td className="li10 bL_1gry">{item.area_code}</td>
                        <td className="li5 bL_1gry">{item.line_name}</td>
                        <td className="li5 bL_1gry">{item.model_name}</td>
                        <td className="li10 bL_1gry">{item.decryt_con_info || "-"}</td>
                        <td className="li10 bL_1gry">{dayjs(item.reg_date).format('YYYY-MM-DD')}</td>
                        <td className="li5 bL_1gry">
                            {rtu_type_name !== "방송(단독)" ? (
                                <img 
                                    className="va_M" 
                                    src="../images/main_icon_07_1.png" 
                                    alt="설정" 
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => onClickSensor(item.rtu_id)}
                                />
                            ) : "-"}
                        </td>
                    </tr>
                );
            });
        }
        
        setScriptListTag(mutListTag);
        setScriptList(filteredData);
    }

    const getRtuTypeName = (rtu_type) => {
        let rtu_type_name = "";
        if(rtu_type === "B00"){
            rtu_type_name = "방송(단독)";
        } else if(rtu_type === "BR0"){
            rtu_type_name = "방송(우량)";
        } else if(rtu_type === "BF0"){
            rtu_type_name = "방송(수위)";
        } else if(rtu_type === "BA0"){
            rtu_type_name = "방송(우+수)";
        } else if(rtu_type === "BAR"){
            rtu_type_name = "방송(우+수+유)";
        } else if(rtu_type === "R00"){
            rtu_type_name = "강우계";
        } else if(rtu_type === "F00"){
            rtu_type_name = "수위계";
        } else if(rtu_type === "DP0"){
            rtu_type_name = "변위계";
        } else if(rtu_type === "RF0"){
            rtu_type_name = "강우수위계";
        } else if(rtu_type === "A00"){
            rtu_type_name = "AWS";
        } else if(rtu_type === "S00"){
            rtu_type_name = "적설계";
        }

        return rtu_type_name;
    }

    useEffect(() => {
        retrieveList();
        return () => {
        }
    }, []);

    // 검색 조건이 변경될 때마다 필터링 적용
    useEffect(() => {
        if (allScriptDetail.length > 0) {
            applyFilter(allScriptDetail, searchSel, searchText, selectOrgan);
        }
    }, [searchSel, searchText, selectOrgan, allScriptDetail]);

    const reRoading = () =>{
        selectScriptNo("");
        // 검색 입력 필드 초기화
        document.getElementById('search_text').value = '';
        if(document.getElementById('select_organ')) {
            document.getElementById('select_organ').value = '';
        }
        console.log("reRoading");
        // 즉시 초기 조건으로 데이터 다시 가져오기
        retrieveList();
    }

    const onClickScript = (scriptNo) => {
        selectScriptNo(scriptNo);
    } 

    const onClickSensor = (rtuId) => {
        console.log("Sensor clicked for RTU ID:", rtuId);
        showSensorPopup(rtuId, () => {
            console.log("Sensor popup callback");
            // 필요시 데이터 새로고침
            retrieveList();
        });
    }

    // 조회 버튼 클릭 핸들러
    const onClickSearch = () => {
        const search_sel_value = document.getElementById('search_sel').value;
        const search_text_value = document.getElementById('search_text').value;
        const select_organ_value = document.getElementById('select_organ')?.value || '';
        
        setSearchSel(search_sel_value);
        setSearchText(search_text_value);
        setSelectOrgan(select_organ_value);
    }

    // 전체목록 버튼 클릭 핸들러
    const onClickSearchAll = () => {
        setSearchSel('rtu_name');
        setSearchText('');
        setSelectOrgan('');
        // 검색 입력 필드도 초기화
        document.getElementById('search_text').value = '';
        if(document.getElementById('select_organ')) {
            document.getElementById('select_organ').value = '';
        }
    }

    console.log("------------------------------SetEquipContent [End]");
    console.groupEnd("SetEquipContent");

    return (
        <div id="content">
            <div className="main_contitle">
                <img src="../images/title_06_02.png" alt="장비 설정" />
                <div className="unit">※ 항목을 클릭하면 설정값을 확인 및 수정할 수 있습니다.</div>
            </div>
            <div className="right_bg">
                <ul className="set_ulwrap_nh bB_3blue">
                    <li className="tb_sms_gry">
                        <span className="sel_left_n">
                            {(userType === "0" || userType === "7") && (
                                <>
                                    기관별 선택 :
                                    <select id="select_organ" className="f333_12"
                                        defaultValue=""
                                    >
                                        {organListTag}
                                    </select>
                                    &nbsp;&nbsp;
                                </>
                            )}
                            장비 목록 조회 :
                            <select id="search_sel" name="search_sel" className="f333_12"
                                defaultValue="rtu_name"
                            >  
                                <option value={"rtu_name"}>장비명</option>
                                <option value={"rtu_type"}>장비구분</option>
                                <option value={"area_code"}>행정코드</option>
                            </select>   
                            &nbsp;
                            <input type="text" id="search_text" name="search_text" className="f333_12"
                                style={{width: '300px'}}
                                placeholder=""
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        onClickSearch();
                                    }
                                }}
                            />
                            &nbsp;&nbsp;
                            <button type="button" id="btn_search" className="btn_bs"
                                onClick={onClickSearch}
                            >조회</button>
                            <button type="button" id="btn_search_all" className="btn_lbs"
                                onClick={onClickSearchAll}
                            >
                                전체목록
                            </button>
                        </span> 
                    </li>
                    <li className="li100_nor d_scroll">
                        <table id="list_table" className="tb_data">
                            <thead className="tb_data_tbg">
                                <tr>
                                    <th className="li5">순서</th>
                                    <th className="li5 bL_1gry">정렬번호</th>
                                    <th className="li5 bL_1gry">장비 ID</th>
                                    <th className="li5 bL_1gry">통신 ID</th>
                                    <th className="li20 bL_1gry">장비명</th>
                                    <th className="li10 bL_1gry">장비 구분</th>
                                    <th className="li10 bL_1gry">행정코드</th>
                                    <th className="li5 bL_1gry">회선</th>
                                    <th className="li5 bL_1gry">모델</th>
                                    <th className="li10 bL_1gry">통신정보</th>
                                    <th className="li10 bL_1gry">설치일</th>
                                    <th className="li5 bL_1gry">센서</th>
                                </tr>
                            </thead>
                            <tbody>
                                {scriptListTag}
                            </tbody>
                        </table>
                    </li>
                </ul>
                <SetEquipDetail  
                    scriptNo={scriptNo} 
                    selectScriptNo={selectScriptNo}
                    scriptDetail={scriptDetail}
                    lineList={lineList}
                    modelList={modelList}
                    organListTag={organListTag}
                    reRoading={reRoading} />
            </div>
        </div>
    );
}

export default SetEquip;