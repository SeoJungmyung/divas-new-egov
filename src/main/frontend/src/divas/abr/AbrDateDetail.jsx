import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import * as EgovNet from 'context/egovFetch';
import DatePicker from 'react-datepicker';
import {ko} from 'date-fns/esm/locale'

import "react-datepicker/dist/react-datepicker.css"
// import * as _ from 'lodash';

function AbrDateDetail(props) {

    console.group("AbrDateDetailContent");
    console.log("[Start] AbrDateDetailContent ------------------------------");
    console.log("AbrDateDetailContent [props] : ", props);

    // const [groupListTag, setGroupListTag] = useState([]);
    // const [listTag, setListTag] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const dateToString = (date) => {
        return date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0')
    }

    const history = useHistory();
    
    const [scriptObj, setScriptObj] = useState({
        plan_no : 0,
        script_no : 0,
        log_type : "0",
        script_title : "",
        script_body : "",
        chime_start_no : "1",
        chime_start_cnt : "1",
        chime_end_no : "1",
        chime_end_cnt : "1",
        script_body_cnt : "1",
        trans_volume : "15",
        script_unit : "T",
        section_no : "1",
        section_name : "일반"
    });

    const updateScript = () => {
        if(props.planNo != ""){
            let res = props.scriptDetail.filter(it => it.plan_no == props.planNo );
            console.log(res);
            setScriptObj({
                plan_no : props.planNo,
                script_no : res[0].script_no,
                log_type : "0",
                script_title : res[0].script_title,
                script_body : res[0].script_body,
                chime_start_no : res[0].chime_start_no,
                chime_start_cnt : res[0].chime_start_cnt,
                chime_end_no : res[0].chime_end_no,
                chime_end_cnt : res[0].chime_end_cnt,
                script_body_cnt : res[0].script_body_cnt,
                trans_volume : res[0].trans_volume,
                script_unit : res[0].script_unit,
                section_no : res[0].section_no,
                section_name : res[0].section_name
            })
        }
    }

    const changeBtnClick = (e) => {
        
        if(scriptObj.script_unit == "M") {
            if(e.target.getAttribute('data-change') == "update"){
                return alert("장비저장문안은 수정할수 없습니다.");
            // }else if(e.target.getAttribute('data-change') == "insert"){
            //     scriptObj.script_unit = "T";
            }else{
                return alert("장비저장문안은 삭제할수 없습니다.");
            }
        }
        // console.log(scriptObj.section_no);
        if(scriptObj.section_no == "1"){
            scriptObj.section_name = "일반";
        }else if(scriptObj.section_no == "2"){
            scriptObj.section_name = "경보(저장)";
        }else if(scriptObj.section_no == "3"){
            scriptObj.section_name = "경보(문자)";
        }
        scriptObj.change_mode = e.target.getAttribute('data-change');
        // scriptObj.rtu_id_arr = [1,2,3];

        const retrieveListURL = '/divas/abr/abrDateChange.do';
        console.log(scriptObj);
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(scriptObj)
        }

        EgovNet.requestFetch(retrieveListURL,
            requestOptions,
            (resp) => {
                console.log("result = ", resp);
                if(resp.resultCode == 200){

                    // 초기화
                    setScriptObj({
                        plan_no : 0,
                        script_no : 0,
                        log_type : "0",
                        script_title : "",
                        script_body : "",
                        chime_start_no : "1",
                        chime_start_cnt : "1",
                        chime_end_no : "1",
                        chime_end_cnt : "1",
                        script_body_cnt : "1",
                        trans_volume : "15",
                        script_unit : "T",
                        section_no : "1",
                        section_name : "일반"
                    });

                    props.reRoading();
                    
                    // 방송 결과 페이지로 이동
                    // history.push({
                    //     pathname: URL.MAIN,
                    //     state : {
                    //         layoutUrl : URL.ABR_COMMON
                    //     }
                    // });
                    // window.location.replace("/main");
                }
                
            },
            function (resp) {
                console.log("err response : ", resp);
            }
        );
        
    }

    const onChange = (e) => {
        const { value, name } = e.target; 
        setScriptObj({
            ...scriptObj, 
            [name]: value 
        });
    }

    useEffect(() => {
        updateScript();
        return () => {
        }
    }, [props.planNo]);

    console.log("------------------------------AbrDateDetailContent [End]");
    console.groupEnd("AbrDateDetailContent");

    return (
        <div className="contb">
            <ul>
                <li>
                    방송상태 :
                  <select id="IS_PAUSE" name="IS_PAUSE" className="mT5">
                    <option value={0}>정상</option>
                    <option value={1}>일시중지</option>
                  </select>
                  <button type="button" id="btn_rtu" className="btn_lbb80 fR">
                    방송지역변경
                  </button>
                  <span
                    className="mT3 fR"
                    style={{ fontSize: "1.5em", color: "yellowgreen" }}
                  >
                    ★&nbsp;
                  </span>
                </li>
                <li>
                  방송주기 :
                  <select id="PLAN_CYCLE" name="PLAN_CYCLE">
                    <option value="W">매주</option>
                    <option value="D">매일</option>
                    <option value="M">매월</option>
                  </select>
                  <select id="PLAN_CYCLE_WEEK" name="PLAN_CYCLE_WEEK">
                    <option value={1}>월</option>
                    <option value={2}>화</option>
                    <option value={3}>수</option>
                    <option value={4}>목</option>
                    <option value={5}>금</option>
                    <option value={6}>토</option>
                    <option value={0}>일</option>
                  </select>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;방송시간
                  :
                  <select id="PLAN_HH24" name="PLAN_HH24">
                    {<option value="02">02</option>}
                  </select>
                  시
                  <select id="PLAN_MI" name="PLAN_MI">
                    {<option value="00">00</option>}
                  </select>
                  분
                </li>
                <li className="alarm_gry_b">
                  시작일 :{" "}
                  <DatePicker 
                    selected={startDate} 
                    className="f333_12" 
                    onChange={date => setStartDate(date)}
                    dateFormat="yyyy-MM-dd"
                    locale={ko}
                    />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;종료일 :{" "}
                  <DatePicker 
                    selected={endDate} 
                    className="f333_12" 
                    onChange={date => setEndDate(date)}
                    dateFormat="yyyy-MM-dd"
                    locale={ko}
                    />
                </li>
                <li>
                    <span className="sel_left">
                    시작효과음 :
                    <select
                        id="chime_start_no"
                        name="chime_start_no"
                        size={1}
                        className="select_b"
                    >
                        <option value="">시작음선택</option>
                    </select>
                    </span>
                    <span className="sel_right">
                    {" "}
                    시작효과반복횟수 :
                    <select
                        id="chime_start_cnt"
                        name="chime_start_cnt"
                        size={1}
                        className="select_s"
                        onChange={onChange} 
                        value={scriptObj.chime_start_cnt}
                    >
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                    </span>
                </li>
                <li>
                    <span className="sel_left">
                    {" "}
                    종료효과음 :
                    <select
                        id="chime_end_no"
                        name="chime_end_no"
                        size={1}
                        className="select_b"
                    >
                        <option value="">종료음선택</option>
                    </select>
                    </span>
                    <span className="sel_right">
                    {" "}
                    종료효과반복횟수 :
                    <select
                        id="chime_end_cnt"
                        name="chime_end_cnt"
                        size={1}
                        className="select_s"
                        onChange={onChange} 
                        value={scriptObj.chime_end_cnt}
                    >
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                    </span>
                </li>
                <li>
                    <span className="sel_left">
                    {" "}
                    방송종류 :
                    <span id="script_unit_text" className="fbb_12">
                        문자음성변환방송
                    </span>
                    </span>
                    <span className="sel_right">
                    {" "}
                    방송내용반복횟수 :
                    <select
                        id="script_body_cnt"
                        name="script_body_cnt"
                        size={1}
                        className="select_s"
                        onChange={onChange} 
                        value={scriptObj.script_body_cnt}
                    >
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                    </span>
                </li>
                <li>
                    <button type="button" id="btn_alarm_test" className="btn_lbb80">
                    미리듣기
                    </button>
                    <div className="vcontrol">
                    <span className="vcon_span">볼륨</span>
                    <span className="volnum">
                        <select id="trans_volume" name="trans_volume"
                             onChange={onChange} 
                             value={scriptObj.trans_volume}
                        >
                            <option value={0}>0</option>
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                            <option value={6}>6</option>
                            <option value={7}>7</option>
                            <option value={8}>8</option>
                            <option value={9}>9</option>
                            <option value={10}>10</option>
                            <option value={11}>11</option>
                            <option value={12}>12</option>
                            <option value={13}>13</option>
                            <option value={14}>14</option>
                            <option value={15}>15</option>
                            <option value={16}>16</option>
                        </select>
                    </span>
                    </div>
                </li>
                <li className="alarm_100">
                    <textarea
                    id="script_body"
                    name="script_body"
                    className="f333_12 textarea3"
                    onChange={onChange}
                    value={scriptObj.script_body}
                    />
                </li>
                <li className="alarm_gry_b">
                    <span id="counter" style={{ fontSize: 16, float: "right" }}>
                    / 1000&nbsp;
                    </span>
                    <span
                    id="coment"
                    style={{
                        fontSize: 16,
                        textAlign: "center",
                        visibility: "hidden"
                    }}
                    >
                    음성 녹음은 수정 되지 않습니다.&nbsp;
                    </span>
                </li>
                <li className="pT_15">
                    <button type="button" id="btn_reset" className="btn_bb80">초기화</button>
					{/* <button type="button" id="btn_insert" className="btn_bb80"
                        onClick={changeBtnClick} data-change={"insert"}>등록</button> */}
					<button type="button" id="btn_update" className="btn_wbb80"
                        onClick={changeBtnClick} data-change={"update"}>수정</button>
					<button type="button" id="btn_delete" className="btn_wbb80"
                        onClick={changeBtnClick} data-change={"delete"}>삭제</button>
                </li>
            </ul>
        </div>
    );
}

export default AbrDateDetail;