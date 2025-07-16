import React, { useState, useEffect } from 'react';
import * as EgovNet from 'context/egovFetch';
import DatePicker from 'react-datepicker';
import {ko} from 'date-fns/esm/locale'
import * as common from 'js/common';
import $ from 'jquery';
import Modal from '../com/Modal';
  
import "react-datepicker/dist/react-datepicker.css"

function SbdRpt(props) {

    console.group("SbdRptContent");
    console.log("[Start] SbdRptContent ------------------------------");
    console.log("SbdRptContent [props] : ", props);

    const [listTag, setListTag] = useState([]);
    const [detailTag, setDetailTag] = useState([]);
    const [resultListTag, setResultListTag] = useState([]);
    const [gData, setGraphData] = useState([]);
    let today = new Date();
    let daySet = new Date(today.setMonth(today.getMonth() - 1));
    // console.log(daySet);
    const [searchVO, setSearchVO] = useState({sdate : daySet, edate : new Date()});
    const [startDate, setStartDate] = useState({sdate : daySet});
    const [endDate, setEndDate] = useState({edate : new Date()});
    const [equipTag, setEquipTag] = useState([]);
        
    // useState를 사용하여 open상태를 변경한다. (open일때 true로 만들어 열리는 방식)
    const [modalOpen, setModalOpen] = useState(false);
    // const [reload, setReload] = useState(false);

    const openModal = (e) => {
        let pE = e.target.parentElement;
        let ppE = pE.parentElement;
        let log_no = $(pE).attr("data-idx");
        common.bg_color("selected", ppE, pE); // 리스트 선택 시 배경색

        // let selectData = {
        //     log_no : log_no
        // };

        // setEditData(selectData);

        // const retrieveListURL = '/divas/rpt/rptAbrDetail.do';
        // const requestOptions = {
        //     method: "POST",
        //     headers: {
        //         'Content-type': 'application/json'
        //     },
        //     body: JSON.stringify(selectData)
        // }

        // // 초기화 해줄 것
        // setDetailTag([]);
        // setResultListTag([]);
        // EgovNet.requestFetch(retrieveListURL,
        //     requestOptions,
        //     (resp) => {
        //         let mutListTag = [];
        //         let detailHtml = [];
        //         console.log("response : ", resp);
        //         let user_id = resp.result.broadcastDetail.user_id;
        //         let is_plan = resp.result.broadcastDetail.is_plan == 0 ? "즉시" : "예약";
        //         let log_date = resp.result.broadcastDetail.log_date;
        //         let script_body = resp.result.broadcastDetail.script_body;
        //         detailHtml.push(
        //             <tbody>
        //                 <tr>
        //                   <th className="bg_lgr">사용자 정보</th>
        //                   <td>
        //                     {user_id}
        //                   </td>
        //                   <th className="bg_lgr">전송 유형</th>
        //                   <td>
        //                     {is_plan}
        //                   </td>
        //                   <th className="bg_lgr">전송 시작 시각</th>
        //                   <td>
        //                     {log_date}
        //                   </td>
        //                 </tr>
        //                 <tr>
        //                   <th className="bg_lgr">방송문안</th>
        //                   <td colSpan={5} className="al_L">
        //                     {script_body}
        //                   </td>
        //                 </tr>
        //             </tbody>
        //         );
        //         setDetailTag(detailHtml);

        //         //리스트 항목 구성
        //         resp.result.broadcastStateList.forEach(function (item, index) {
        //             let txt1 = item.state_txt;
        //             let txt3 = item.error_txt;
        //             let record_filepath = item.model_no == 8 ? (item.record_filepath != null ? item.record_filepath : null) : null;
        //             mutListTag.push(
        //                 <tr key={index}>
        //                     <td>{item.rtu_id}</td>
        //                     <td>{item.rtu_name}</td>
        //                     <td>{txt1}</td>
        //                     <td>{txt3}</td>
        //                     <td>{item.trans_check}</td>
        //                     <td>
        //                         {/* 다시듣기 기능 추가 할 것 */}
        //                         { (record_filepath && false) && (
        //                             <img src="../images/v-i-play2.png" style={"top:0px; cursor:pointer;"} 
        //                                 onClick={()=>replay(record_filepath)} 
        //                                 title="\n 녹음 파일은 저음질 입니다. \n원본을 들으시려면 모바일 어플로 \n사용해 주시기 바랍니다."/>
        //                             )
        //                         }
        //                     </td>
        //                 </tr>
        //             );
        //         });
        //         mutListTag.push();
        //         setResultListTag(mutListTag);
        //     },
        //     function (resp) {
        //         console.log("err response : ", resp);
        //     }
        // );
        
        // open Modal
        setModalOpen(true);
    };

    const replay = (path) => {
        console.log(path);
    }
    const closeModal = (e) => {
        
        // let dataArr = [];
        // $.each($("#tableData input"), function(i, v){
        //     dataArr[i] = $(v).val();
        // });
        // let dateFormat = common.toStringByFormatting(startDate.sdate);
        // // console.log(dataArr);

        // let selectData = {
        //     area_code : editData.area_code,
        //     sdate : dateFormat,
        //     hour : editData.hour,
        //     dtmArr : dataArr
        // };

        // const retrieveListURL = '/divas/dtm/rainDataEdit.do';
        // const requestOptions = {
        //     method: "POST",
        //     headers: {
        //         'Content-type': 'application/json'
        //     },
        //     body: JSON.stringify(selectData)
        // }

        // EgovNet.requestFetch(retrieveListURL,
        //     requestOptions,
        //     (resp) => {
        //         if(resp.resultCode == 200){
        //             setReload(!reload);
        //         }
        //     },
        //     function (resp) {
        //         console.log("err response : ", resp);
        //     }
        // );
        // close modal
        setModalOpen(false);
    };

    const retrieveList = (searchVO) => {
        const retrieveListURL = '/divas/sbd/actionSbdRpt.do';
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(searchVO)
        }
        // console.log(searchVO);
        EgovNet.requestFetch(retrieveListURL,
            requestOptions,
            (resp) => {
                console.log(resp);
                let mutListTag = [];
                // console.log("result = ", resp.result);
                if(resp.result.rptList.length < 1){
                    mutListTag.push(<tr className="no_data"><td colSpan={9}>검색된 결과가 없습니다.</td></tr>); // 게시판 목록 초기값
                }else{

                }

                // 장비리스트
                resp.result.equipList.forEach(function (item, index) {
                    mutListTag.push(
                        <option value={(index + 1)}>{item.sitename}</option>
                    );
                });
                mutListTag.push();
                setEquipTag(mutListTag);

                mutListTag = [];
                // 리스트 항목 구성
                resp.result.rptList.forEach(function (item, index) {
                    if (index === 0) mutListTag = [];
                    let division = item.division == 1 ? "일반긴급" : (item.success == 2 ? "자동긴급" : "일반");
                    let result = item.success == 1 ? "송신중" : (item.success == 2 ? "송신실패" : (item.success == 3 ? "송신완료" : "송신대기"));
                    mutListTag.push(
                        <tr key={"sbd_"+index} id={"sbd_"+item.idx} data-idx={item.idx} onClick={openModal}>
                            <td>{index+1}</td>
                            <td>{division}</td>
                            <td>{item.areabestname}</td>
                            <td>{item.areaname}</td>
                            <td>{item.sitename}</td>
                            <td>{item.userid}</td>
                            <td>{item.msg}</td>
                            <td>{result}</td>
                            <td>{item.senddate}</td>
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

    const changeDate = (sdate, edate) => {
        if(edate == ""){
            setSearchVO({
                sdate : sdate,
                edate : endDate.edate
            });
            setStartDate({sdate : sdate});
        }else if (sdate == ""){
            setSearchVO({
                sdate : startDate.sdate,
                edate : edate
            });
            setEndDate({edate : edate});
        }
    }

    useEffect(() => {
        retrieveList(searchVO);
        return () => {
        }
    }, [searchVO]);

    console.log("------------------------------SbdRptContent [End]");
    console.groupEnd("SbdRptContent");

    return (
        <div id="content">
            <div className="main_contitle">
                <img src="../images/title_08_06.png" alt="전광판 보고서" />
            </div>
            <div className="right_bg">
                <ul className="set_ulwrap_nh bB0">
                    <li className="tb_sms_gry">
                        설치 지역 : 
                        <select id="AREABESTID" name="AREABESTID" size="1">
                            <option value="">상위 지역 선택</option>
                        </select>
                        /
                        <select id="AREAID" name="AREAID" size="1">
                            <option value="">지역 선택</option>
                        </select>
                        /
                        <select id="SITEID" name="SITEID" size="1">
                            <option value="">설치 장소 선택</option>
                            {equipTag}
                        </select> 
                        
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <DatePicker 
                            selected={startDate.sdate} 
                            className="f333_12" 
                            onChange={date => changeDate(date, "")}
                            dateFormat="yyyy-MM-dd"
                            locale={ko}
                        />
                        <span className="mL3">-</span>
                        <DatePicker 
                            selected={endDate.edate} 
                            className="f333_12" 
                            onChange={date => changeDate("", date)}
                            dateFormat="yyyy-MM-dd"
                            locale={ko}
                        />
                        
                        <span id="button" className="sel_right_n">

                        </span>
                    </li>
                    <li className="li100_nor">
                        <table id="view_table" className="tb_data pB0">
                            <thead className="tb_data_tbg">
                                <tr>
                                    <th className="li5 bL0">번호</th>
                                    <th className="li7 bL_1gry">발송구분</th>
                                    <th className="li10 bL_1gry">상위지역</th>
                                    <th className="li10 bL_1gry">지역</th>
                                    <th className="li15 bL_1gry">설치장소</th>
                                    <th className="li10 bL_1gry">담당자명</th>
                                    <th className="li20 bL_1gry">내용</th>
                                    <th className="li8 bL_1gry">전송결과</th>
                                    <th className="li15 bL_1gry">전송일시</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listTag}
                            </tbody>
                        </table>
                        <Modal open={modalOpen} close={closeModal} 
                            type={1} header="">
                                {"이미지"}
                        </Modal>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default SbdRpt;