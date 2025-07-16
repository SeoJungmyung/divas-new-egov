import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as EgovNet from 'context/egovFetch';
import { DatePicker } from 'antd';
import locale from 'antd/es/date-picker/locale/ko_KR';
import dayjs from 'dayjs';

function RptStat(props) {

    console.group("RptStatContent");
    console.log("[Start] RptStatContent ------------------------------");
    console.log("RptStatContent [props] : ", props);

    const [thTag, setThTag] = useState([]);
    const [listTag, setListTag] = useState([]);
    
    let today = new Date();
    const [searchVO, setSearchVO] = useState({sdate: today, stat_type: "0"});
    const [startDate, setStartDate] = useState(dayjs());
    const [searchType, setSearchType] = useState("N"); // 기본값을 연간으로 변경
    const [selDate, setSelDate] = useState("N"); // 연간이 기본 선택

    const location = useLocation();

    const handleSelDateChange = (value) => {
        setSelDate(value);
        setSearchType(value);
    }

    const clickSearch = () => {
        let searchData = {
            ...location.state.commonVO,
            ...searchVO,
            type: selDate,
            stat_type: searchVO.stat_type === "1" ? "1" : "0"
        };

        if(selDate === 'N'){
            // 연간: 해당 년도의 1월 1일부터 12월 31일까지
            searchData.sdate = dayjs(startDate).startOf('year').format('YYYY-MM-DD');
            searchData.edate = dayjs(startDate).endOf('year').format('YYYY-MM-DD');
        } else if(selDate === 'D'){
            // 월간: 해당 월의 1일부터 말일까지
            searchData.sdate = dayjs(startDate).startOf('month').format('YYYY-MM-DD');
            searchData.edate = dayjs(startDate).endOf('month').format('YYYY-MM-DD');
        }
        retrieveList(searchData);
    }

    const retrieveList = (searchVO) => {
        // searchVO.stat_type = 0; // 방송장비별 통계
        // searchVO.stat_type = 1; // 전송유형별 통계
        const retrieveListURL = '/divas/rpt/actionRptStat.do';
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
                let mutListNTag = [];
                let mutListPTag = [];
                let mutListATag = [];
                let thTag = [];
                let daysTag = [];
                let daysNTTag = [];
                let daysNFTag = [];
                let daysNCTag = [];
                let daysPTTag = [];
                let daysPFTag = [];
                let daysPCTag = [];
                let daysATTag = [];
                let daysAFTag = [];
                let daysACTag = [];
                // console.log("result = ", resp.result);
                if(resp.result.resultList.length < 1){
                    mutListTag.push(
                        <tbody key="no-data">
                            <tr className="no_data"><td colSpan={7}>검색된 결과가 없습니다.</td></tr>
                        </tbody>
                    );
                }
                for(let i=1; i<=resp.result.resultList[0].last; i++){
                    let day = i < 10 ? "0"+i : ""+i;
                    daysTag.push(
                        <th key={`day_${i}`}>{day}</th>
                    );
                }
                // console.log('searchVO.stat_type : ', searchVO.stat_type);
                if (searchVO.stat_type === "1") {
                    thTag.push(
                        <tr key={"th_0"}>
                            <th className='li5 bR_1gry'>유형</th>
                            <th className='li5 bR_1gry'>구분</th>
                            {daysTag}
                            <th className='li5 bL_1gry'>누계</th>
                        </tr>
                    );
                }else{
                    thTag.push(
                        <tr key={"th_0"}>
                            <th className='li5 bR_1gry'>구분</th>
                            {daysTag}
                            <th className='li5 bL_1gry'>누계</th>
                        </tr>
                    );
                }
                setThTag(thTag);

                // console.log('searchVO : ', searchVO);
                if (searchVO.stat_type === "1") {
                    let sumNT = 0;
                    let sumNF = 0;
                    let sumNC = 0;
                    let sumPT = 0;
                    let sumPF = 0;
                    let sumPC = 0;
                    let sumAT = 0;
                    let sumAF = 0;
                    let sumAC = 0;
                    daysNTTag.push(<td key={`nt_h`} className='li5 bR_1gry'>{"성공"}</td>);
                    daysNFTag.push(<td key={`nf_h`} className='li5 bR_1gry'>{"실패"}</td>);
                    daysNCTag.push(<td key={`nc_h`} className='li5 bR_1gry'>{"전체"}</td>);
                    daysPTTag.push(<td key={`pt_h`} className='li5 bR_1gry'>{"성공"}</td>);
                    daysPFTag.push(<td key={`pf_h`} className='li5 bR_1gry'>{"실패"}</td>);
                    daysPCTag.push(<td key={`pc_h`} className='li5 bR_1gry'>{"전체"}</td>);
                    daysATTag.push(<td key={`at_h`} className='li5 bR_1gry'>{"성공"}</td>);
                    daysAFTag.push(<td key={`af_h`} className='li5 bR_1gry'>{"실패"}</td>);
                    daysACTag.push(<td key={`ac_h`} className='li5 bR_1gry'>{"전체"}</td>);

                    // 리스트 항목 구성
                    resp.result.resultList.forEach(function (item, index) {
                        
                        sumNT += item.cnt0_t;
                        sumNF += item.cnt0_f;
                        sumNC += item.cnt0;
                        sumPT += item.cnt1_t;
                        sumPF += item.cnt1_f;
                        sumPC += item.cnt1;
                        sumAT += item.cnt2_t;
                        sumAF += item.cnt2_f;
                        sumAC += item.cnt2;
                        let cnt0_t = item.cnt0_t == null ? "0" : item.cnt0_t;
                        let cnt0_f = item.cnt0_t == null ? "0" : item.cnt0_f;
                        let cnt0 = item.cnt0_t == null ? "0" : item.cnt0;
                        let cnt1_t = item.cnt0_t == null ? "0" : item.cnt1_t;
                        let cnt1_f = item.cnt0_t == null ? "0" : item.cnt1_f;
                        let cnt1 = item.cnt0_t == null ? "0" : item.cnt1;
                        let cnt2_t = item.cnt0_t == null ? "0" : item.cnt2_t;
                        let cnt2_f = item.cnt0_t == null ? "0" : item.cnt2_f;
                        let cnt2 = item.cnt0_t == null ? "0" : item.cnt2;
                        daysNTTag.push(
                            <td key={`nt_${index}`}>{cnt0_t}</td>
                        );
                        daysNFTag.push(
                            <td key={`nf_${index}`}>{cnt0_f}</td>
                        );
                        daysNCTag.push(
                            <td key={`nc_${index}`}>{cnt0}</td>
                        );
                        daysPTTag.push(
                            <td key={`pt_${index}`}>{cnt1_t}</td>
                        );
                        daysPFTag.push(
                            <td key={`pf_${index}`}>{cnt1_f}</td>
                        );
                        daysPCTag.push(
                            <td key={`pc_${index}`}>{cnt1}</td>
                        );
                        daysATTag.push(
                            <td key={`at_${index}`}>{cnt2_t}</td>
                        );
                        daysAFTag.push(
                            <td key={`af_${index}`}>{cnt2_f}</td>
                        );
                        daysACTag.push(
                            <td key={`ac_${index}`}>{cnt2}</td>
                        );
                        // console.log(sum);
                    });

                    // if(item.dd == item.last){
                        mutListNTag.push(
                            <tr key={"stat_NT"}>
                                <td className='li5 bR_1gry' rowSpan="3">{"일반방송"}</td>
                                {daysNTTag}
                                <td className='bL_1gry'>{sumNT}</td>
                            </tr>
                        );
                        mutListNTag.push(
                            <tr key={"stat_NF"}>
                                {daysNFTag}
                                <td className='bL_1gry'>{sumNF}</td>
                            </tr>
                        );
                        mutListNTag.push(
                            <tr key={"stat_NC"}>
                                {daysNCTag}
                                <td className='bL_1gry'>{sumNC}</td>
                            </tr>
                        );
                        mutListPTag.push(
                            <tr key={"stat_PT"}>
                                <td className='li5 bR_1gry' rowSpan="3">{"예약방송"}</td>
                                {daysPTTag}
                                <td className='bL_1gry'>{sumPT}</td>
                            </tr>
                        );
                        mutListPTag.push(
                            <tr key={"stat_PF"}>
                                {daysPFTag}
                                <td className='bL_1gry'>{sumPF}</td>
                            </tr>
                        );
                        mutListPTag.push(
                            <tr key={"stat_PC"}>
                                {daysPCTag}
                                <td className='bL_1gry'>{sumPC}</td>
                            </tr>
                        );
                        mutListATag.push(
                            <tr key={"stat_AT"}>
                                <td className='li5 bR_1gry' rowSpan="3">{"자동방송"}</td>
                                {daysATTag}
                                <td className='bL_1gry'>{sumAT}</td>
                            </tr>
                        );
                        mutListATag.push(
                            <tr key={"stat_AF"}>
                                {daysAFTag}
                                <td className='bL_1gry'>{sumAF}</td>
                            </tr>
                        );
                        mutListATag.push(
                            <tr key={"stat_AC"}>
                                {daysACTag}
                                <td className='bL_1gry'>{sumAC}</td>
                            </tr>
                        );
                    // }
                    mutListTag.push(
                        <tbody key="tbody_main">
                            {mutListNTag}
                            {mutListPTag}
                            {mutListATag}
                        </tbody>
                    );
                }else{
                    let sum = 0;
                    let tempListTag = []; // 임시 배열 추가
                    // 리스트 항목 구성
                    resp.result.resultList.forEach(function (item, index) {
                        if (index === 0) {
                            tempListTag = [];
                        }
                        if (item.num === 1) {
                            daysTag = [];
                            sum = 0;
                        }
                        sum += item.cnt;
                        daysTag.push(
                            <td key={`day_${item.num}`}>{item.cnt}</td>
                        );
                        // console.log(sum);
                        if(item.num === parseInt(item.last)){
                            tempListTag.push(
                                <tr key={"stat_"+index} id={"stat_"+item.rtu_id}>
                                    <td className='li10 bR_1gry'>{item.rtu_name}</td>
                                    {daysTag}
                                    <td className='bL_1gry'>{sum}</td>
                                </tr>
                            );
                        }
                    });
                    
                    // tbody로 감싸기
                    mutListTag.push(
                        <tbody key="tbody_main">
                            {tempListTag}
                        </tbody>
                    );
                }
                setListTag(mutListTag);
            },
            function (resp) {
                console.log("err response : ", resp);
            }
        );
    }
    
    const changeStatType = (e) => {
        // console.log(e.target.value);
        setSearchVO({
            sdate : searchVO.sdate,
            stat_type : e.target.value
        });
    }

    useEffect(() => {
        // 초기 로드
        clickSearch();
        return () => {
        }
    }, []);

    console.log("------------------------------RptStatContent [End]");
    console.groupEnd("RptStatContent");

    return (
        <div id="content">
            <div className="main_contitle">
                <img src="../images/title_05_02.png" alt="방송 통계"/>
            </div>
            <div className="right_bg">
                <ul className="set_ulwrap_nh bB_3blue">
                    <li className="tb_sms_gry print_hd">
                        <span className="sel_left_n">
                        검색 기간 :&nbsp;&nbsp;
                            <input 
                                type="radio" 
                                className="btn_radio" 
                                name="sel_date" 
                                value="N" 
                                checked={selDate === "N"}
                                onChange={(e) => handleSelDateChange(e.target.value)}
                            />연간 
                            <input 
                                type="radio" 
                                className="btn_radio" 
                                name="sel_date" 
                                value="D" 
                                checked={selDate === "D"}
                                onChange={(e) => handleSelDateChange(e.target.value)}
                            />월간 
                            &nbsp;&nbsp;&nbsp;
                            <DatePicker 
                                id="sdate_stat"
                                value={startDate} 
                                className="f333_12" 
                                onChange={date => setStartDate(date)}
                                format="YYYY-MM-DD"
                                locale={locale}
                                style={{textAlign: 'center'}}
                            />
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            통계 유형 : 
                            <select id="search_sel" name="stat_type" className="f333_12" onChange={changeStatType}> 
                                <option value="0">방송장비별 통계</option>
                                <option value="1">전송유형별 통계</option>
                            </select> 
                        </span>
                        <span id="button" className="sel_left_n">
                            <button type="button" id="btn_search" className="btn_bb80" onClick={clickSearch}>
                                검색
                            </button>
                        </span>
                    </li>
                    <li className="li100_nor">
                        <table id="view_table" className="tb_data">
                            <thead className="tb_data_tbg">
                                {thTag}
                            </thead>
                                {listTag}
                        </table>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default RptStat;