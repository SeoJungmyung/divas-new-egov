import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as EgovNet from 'context/egovFetch';
import { DatePicker } from 'antd';
import locale from 'antd/es/date-picker/locale/ko_KR';
import { alarm_popup } from 'js/common';
import $ from 'jquery';
import dayjs from 'dayjs';
  
function RptAbr(props) {

    console.group("RptAbrContent");
    console.log("[Start] RptAbrContent ------------------------------");
    console.log("RptAbrContent [props] : ", props);

    const [listTag, setListTag] = useState([]);
    
    let today = new Date();
    let daySet = new Date(today.setMonth(today.getMonth() - 1));
    
    const [searchVO, setSearchVO] = useState({sdate : daySet, edate : new Date()});
    const [startDate, setStartDate] = useState(dayjs(daySet));
    const [endDate, setEndDate] = useState(dayjs());
    const [searchType, setSearchType] = useState("H");
    
    const [selDate, setSelDate] = useState("new");
    const [isPlan, setIsPlan] = useState("");
    const [searchSel, setSearchSel] = useState("SCRIPT_TITLE");
    const [searchText, setSearchText] = useState("");
    const [userId, setUserId] = useState("");
    const [alarmCnt] = useState(50);
    
    const location = useLocation();

    const handleDateType = (type) => {
        if(type !== 'a') {
            $('#edate_rpt').closest('div.ant-picker').css("display", 'none');
            $('span.mL3_rpt').css("display", 'none');
        } else {
            $('#edate_rpt').closest('div.ant-picker').css("display", '');
            $('span.mL3_rpt').css("display", '');
        }
    }

    const clickSearch = () => {
        // 검색 조건을 포함하여 API 호출
        let searchData = {
            ...location.state.commonVO,
            ...searchVO,
            sel_date: selDate,
            is_plan: isPlan === "" ? null : (isPlan === "Y" ? 1 : parseInt(isPlan)),
            search_sel: searchSel,
            search_text: searchText,
            user_id: userId,
            alarm_cnt: parseInt(alarmCnt)
        };

        if(selDate === 'y'){
            // 연간: 해당 년도의 1월 1일부터 12월 31일까지
            searchData.sdate = startDate.startOf('year').format('YYYY-MM-DD');
            searchData.edate = startDate.endOf('year').format('YYYY-MM-DD');
        } else if(selDate === 'm'){
            // 월간: 해당 월의 1일부터 말일까지
            searchData.sdate = startDate.startOf('month').format('YYYY-MM-DD');
            searchData.edate = startDate.endOf('month').format('YYYY-MM-DD');
        } else if(selDate === 'd'){
            // 일간: 선택한 날짜만
            searchData.sdate = startDate.format('YYYY-MM-DD');
            searchData.edate = startDate.format('YYYY-MM-DD');
        } else if(selDate === 'a') {
            // 기간: 선택한 시작일부터 종료일까지
            searchData.sdate = startDate.format('YYYY-MM-DD');
            searchData.edate = endDate.format('YYYY-MM-DD');
        } else if(selDate === 'new') {
            // 최근 N건의 경우 날짜를 제거하거나 null로 설정
            delete searchData.sdate;
            delete searchData.edate;
        }
        retrieveList(searchData);
    }

    const handleSelDateChange = (value) => {
        setSelDate(value);
        setSearchType(value);
        handleDateType(value);
    }

    const handleIsPlanChange = (value) => {
        setIsPlan(value);
    }

    const openModal = (e) => {
        let pE = e.target.parentElement;
        let log_no = parseInt($(pE).attr("data-logNo")); // 문자열을 숫자로 변환
        // common.bg_color("selected", ppE, pE);

        // alarm_popup 함수 호출
        alarm_popup(log_no, location.state.commonVO);
    };

    const retrieveList = (searchVO) => {
        const retrieveListURL = '/divas/rpt/actionRptAbr.do';
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(searchVO)
        }
        // console.log("searchVO : ", searchVO);
        EgovNet.requestFetch(retrieveListURL,
            requestOptions,
            (resp) => {
                let mutListTag = [];
                // console.log("result = ", resp.result);
                if(resp.result.broadcastList.length < 1){
                    mutListTag.push(<tr key="no-data" className="no_data"><td colSpan={8}>검색된 결과가 없습니다.</td></tr>);
                }

                resp.result.broadcastList.forEach(function (item, index) {
                    if (index === 0) mutListTag = [];
                    let is_plan = item.is_plan === "9" ? '<font color="red">자동방송</font>' : (item.is_plan === "1" ? "예약방송" : "일반방송");
                    // let section_name = item.section_name;
                    let script_unit_name = item.script_unit === "T" ? "문자" : item.script_unit === "R" ? "음성" : "녹음";
                    let script_title = item.script_title;
                    let broadcast_no = item.log_no || "-";
                    let rtu_cnt = "완료 : " + item.rtu_cnt_ok + " / 전체 : " + item.rtu_cnt;
                    let user_id = item.user_id;
                    let trans_start = item.trans_start ? item.trans_start : "-";
                    let trans_check = item.trans_check ? item.trans_check : "-";
                    mutListTag.push(
                        <tr key={"broad_"+index} id={"alarm_"+item.log_no} data-logNo={item.log_no} onClick={openModal} style={{cursor: 'pointer'}}>
                            <td dangerouslySetInnerHTML={{__html: is_plan}}></td>
                            <td>{script_unit_name}</td>
                            <td>{broadcast_no}</td>
                            <td>{script_title}</td>
                            <td>{user_id}</td>
                            <td>{trans_start}</td>
                            <td>{trans_check}</td>
                            <td>{rtu_cnt}</td>
                        </tr>
                    );
                });
                setListTag(mutListTag);
            },
            function (resp) {
                console.log("err response : ", resp);
            }
        );
    }

    useEffect(() => {
        // 초기 검색 조건에도 동일한 타입 변환 적용
        let initialSearchData = {
            ...location.state.commonVO,
            ...searchVO,
            sel_date: selDate,
            is_plan: isPlan === "" ? null : (isPlan === "Y" ? 1 : parseInt(isPlan)),
            search_sel: searchSel,
            search_text: searchText,
            user_id: userId,
            alarm_cnt: parseInt(alarmCnt)
        };
        
        if(selDate === 'new') {
            delete initialSearchData.sdate;
            delete initialSearchData.edate;
        }
        
        retrieveList(initialSearchData);
    }, [searchVO]);

    console.log("------------------------------RptAbrContent [End]");
    console.groupEnd("RptAbrContent");

    return (
        <div id="content">
            <div className="main_contitle">
                <img src="../images/title_05_01.png" alt="방송전송 이력" />
                <span id="search_dt" className="sub_tit mL20 dp0"></span>
                <div className="unit">※ 항목을 클릭하면 상세 내용을 확인 할 수 있습니다.</div>
            </div>
            <div className="right_bg">
                <ul className="set_ulwrap_nh bB_3blue">
                    <form id="form_search" action="rpt_brhist.php" method="post">
                        <li className="tb_sms_gry print_hd">
                            <span className="sel_left_n">
                                <span id="search_zone">
                                    검색 기간 :&nbsp;
                                    <input 
                                        type="radio" 
                                        className="btn_radio" 
                                        name="sel_date" 
                                        value="new" 
                                        checked={selDate === "" || selDate === "new"}
                                        onChange={(e) => handleSelDateChange(e.target.value)}
                                    />최근 {alarmCnt}건
                                    <input 
                                        type="radio" 
                                        className="btn_radio" 
                                        name="sel_date" 
                                        value="y" 
                                        checked={selDate === "y"}
                                        onChange={(e) => handleSelDateChange(e.target.value)}
                                    />연간 
                                    <input 
                                        type="radio" 
                                        className="btn_radio" 
                                        name="sel_date" 
                                        value="m" 
                                        checked={selDate === "m"}
                                        onChange={(e) => handleSelDateChange(e.target.value)}
                                    />월간 
                                    <input 
                                        type="radio" 
                                        className="btn_radio" 
                                        name="sel_date" 
                                        value="d" 
                                        checked={selDate === "d"}
                                        onChange={(e) => handleSelDateChange(e.target.value)}
                                    />일간 
                                    <input 
                                        type="radio" 
                                        className="btn_radio" 
                                        name="sel_date" 
                                        value="a" 
                                        checked={selDate === "a"}
                                        onChange={(e) => handleSelDateChange(e.target.value)}
                                    />기간 
                                    &nbsp;&nbsp;&nbsp;
                                    <DatePicker 
                                        id="sdate_rpt"
                                        value={startDate} 
                                        className="f333_12" 
                                        onChange={date => setStartDate(date)}
                                        format="YYYY-MM-DD"
                                        locale={locale}
                                        style={{textAlign: 'center'}}
                                    />
                                    <span className="mL3_rpt" style={{display: selDate === 'a' ? '' : 'none'}}>-</span>
                                    <DatePicker 
                                        id="edate_rpt"
                                        value={endDate} 
                                        className="f333_12" 
                                        onChange={date => setEndDate(date)}
                                        format="YYYY-MM-DD"
                                        locale={locale}
                                        style={{textAlign: 'center', display: selDate === 'a' ? '' : 'none'}}
                                    />
                                </span>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                전송 유형 :&nbsp;
                                <input 
                                    type="radio" 
                                    name="IS_PLAN" 
                                    value="" 
                                    className="btn_radio" 
                                    checked={isPlan === ""}
                                    onChange={(e) => handleIsPlanChange(e.target.value)}
                                />전체
                                <input 
                                    type="radio" 
                                    name="IS_PLAN" 
                                    value="0" 
                                    className="btn_radio" 
                                    checked={isPlan === "0"}
                                    onChange={(e) => handleIsPlanChange(e.target.value)}
                                />일반방송
                                <input 
                                    type="radio" 
                                    name="IS_PLAN" 
                                    value="Y" 
                                    className="btn_radio" 
                                    checked={isPlan === "Y"}
                                    onChange={(e) => handleIsPlanChange(e.target.value)}
                                />예약방송
                                <input 
                                    type="radio" 
                                    name="IS_PLAN" 
                                    value="9" 
                                    className="btn_radio" 
                                    checked={isPlan === "9"}
                                    onChange={(e) => handleIsPlanChange(e.target.value)}
                                />자동방송
                                <br />
                                조회 구분 :&nbsp;
                                <select 
                                    id="search_sel" 
                                    name="search_sel" 
                                    className="f333_12"
                                    value={searchSel}
                                    onChange={(e) => setSearchSel(e.target.value)}
                                >
                                    <option value="SCRIPT_TITLE">방송제목</option>
                                    <option value="SCRIPT_BODY">방송문구</option>
                                    <option value="USER_ID">사용자 ID</option>
                                </select>
                                <input 
                                    type="text" 
                                    id="search_text" 
                                    name="search_text" 
                                    className="f333_12_bm" 
                                    size="38" 
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                />
                               {/*  &nbsp;사용자 ID :&nbsp;
                                <input 
                                    type="text" 
                                    name="USER_ID" 
                                    className="f333_12" 
                                    size="12" 
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                /> */}
                            </span>
                            <span id="button" className="sel_left_n">
                                <button type="button" id="btn_search" className="btn_bb115" onClick={clickSearch}>
                                    검색
                                </button>
                            </span>
                        </li>
                        <li className="li100_nor">
                            <table id="list_table" className="tb_data pB0">
                                <thead className="tb_data_tbg">
                                    <tr>
                                        <th className="li8">전송유형</th>
                                        <th className="li5 bL_1gry">문안유형</th>
                                        <th className="li5 bL_1gry">방송번호</th>
                                        <th className="li40 bL_1gry">방송제목</th>
                                        <th className="li7 bL_1gry">사용자</th>
                                        <th className="li10 bL_1gry">전송시작시각</th>
                                        <th className="li10 bL_1gry">최종로깅시각</th>
                                        <th className="li15 bL_1gry">전송건수</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listTag}
                                </tbody>
                            </table>
                        </li>
                    </form>
                </ul>
            </div>
        </div>
    );
}

export default RptAbr;