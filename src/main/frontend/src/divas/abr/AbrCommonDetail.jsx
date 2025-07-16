import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import * as EgovNet from 'context/egovFetch';
import { Slider } from 'antd';
import 'antd/dist/reset.css';

function AbrCommonDetail(props) {

    console.group("AbrCommonDetailContent");
    console.log("[Start] AbrCommonDetailContent ------------------------------");
    console.log("AbrCommonDetailContent [props] : ", props);

    // const [groupListTag, setGroupListTag] = useState([]);
    // const [listTag, setListTag] = useState([]);
    // const [scriptListTag, setScriptListTag] = useState([]);

    const history = useHistory();
    
    const [scriptObj, setScriptObj] = useState({
        log_type : "0",
        script_title : "",
        script_body : "",
        chime_start_no : "1",
        chime_start_cnt : "1",
        chime_end_no : "1",
        chime_end_cnt : "1",
        script_body_cnt : "1",
        trans_volume : "15"
    });

    const testBtnClick = (e) => {
        const CONTENT = scriptObj.script_body;
        window.speechSynthesis.cancel(); // 현재 읽고있다면 초기화

        // SpeechSynthesisUtterance 객체 생성
        const utterance = new SpeechSynthesisUtterance(CONTENT);
        window.speechSynthesis.speak(utterance);
    }

    const updateScript = () => {
        if(props.scriptNo !== ""){
            let res = props.scriptDetail.filter(it => it.script_no === props.scriptNo );
            // console.log(res);
            setScriptObj({
                log_type : "0",
                script_title : res[0].script_title,
                script_body : res[0].script_body,
                chime_start_no : res[0].chime_start_no,
                chime_start_cnt : res[0].chime_start_cnt,
                chime_end_no : res[0].chime_end_no,
                chime_end_cnt : res[0].chime_end_cnt,
                script_body_cnt : res[0].script_body_cnt,
                trans_volume : res[0].trans_volume
            })
        }
    }

    const sendBtnClick = (e) => {
        scriptObj.rtu_cnt_curr = props.rtuOption.rtu_cnt;
        scriptObj.rtu_id_arr = props.rtuOption.rtu_id;
        scriptObj.model_no_arr = props.rtuOption.model_no;

        // console.log(scriptObj);

        const retrieveListURL = '/divas/abr/abrCommonSend.do';
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
                if(resp.resultCode === 200){

                    // 초기화
                    setScriptObj({
                        log_type : "0",
                        script_title : "",
                        script_body : "",
                        chime_start_no : "1",
                        chime_start_cnt : "1",
                        chime_end_no : "1",
                        chime_end_cnt : "1",
                        script_body_cnt : "1",
                        trans_volume : "15"
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

                    props.reloadBroadcastList();
                }
                
            },
            function (resp) {
                console.log("err response : ", resp);
            }
        );
    }

    const onChange = (e) => {
        console.log(e.target);
    }

    const optionSelect = (e) => {
        const value = typeof e === 'object' ? e.target.value : e.toString();
        setScriptObj({
            ...scriptObj,
            trans_volume: value
        });
    };

    useEffect(() => {
        updateScript();
        return () => {
        }
    }, [props.scriptNo]);

    console.log("------------------------------AbrCommonDetailContent [End]");
    console.groupEnd("AbrCommonDetailContent");

    return (
        <div className="alarm_bg_no">
            <ul>
                <li>
                    <span style={{ fontSize: "1.5em" }}>③</span> 방송제목 :
                    <input
                    type="text"
                    id="SCRIPT_TITLE"
                    name="SCRIPT_TITLE"
                    size={60}
                    className="f333_12"
                    onChange={onChange}
                    value={scriptObj.script_title}
                    />
                </li>
                <li>
                    <span className="sel_left">
                    시작효과음 :
                    <select
                        id="CHIME_START_NO"
                        name="CHIME_START_NO"
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
                        id="CHIME_START_CNT"
                        name="CHIME_START_CNT"
                        size={1}
                        className="select_s"
                        onChange={optionSelect} 
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
                        id="CHIME_END_NO"
                        name="CHIME_END_NO"
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
                        id="CHIME_END_CNT"
                        name="CHIME_END_CNT"
                        size={1}
                        className="select_s"
                        onChange={optionSelect} 
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
                    <span id="SCRIPT_UNIT_TEXT" className="fbb_12">
                        문자음성변환방송
                    </span>
                    </span>
                    <span className="sel_right">
                    {" "}
                    방송내용반복횟수 :
                    <select
                        id="SCRIPT_BODY_CNT"
                        name="SCRIPT_BODY_CNT"
                        size={1}
                        className="select_s"
                        onChange={optionSelect} 
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
                    <button type="button" id="btn_alarm_test" className="btn_lbb80"
                        onClick={testBtnClick}
                    >
                    미리듣기
                    </button>
                    <div className="vcontrol">
                        <span className="vcon_span">볼륨</span>
                        <span className="volnum" style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: 1, marginRight: '10px', width: '70%' }}>
                                <Slider
                                    min={0}
                                    max={16}
                                    value={parseInt(scriptObj.trans_volume)}
                                    onChange={optionSelect}
                                    style={{ width: '95%', marginTop: '7px' }}
                                />
                            </div>
                            <select
                                id="TRANS_VOLUME"
                                name="TRANS_VOLUME"
                                onChange={optionSelect}
                                value={scriptObj.trans_volume}
                                style={{ width: '50px' }}
                            >
                                <option value="0">0</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                                <option value="11">11</option>
                                <option value="12">12</option>
                                <option value="13">13</option>
                                <option value="14">14</option>
                                <option value="15">15</option>
                                <option value="16">16</option>
                            </select>
                        </span>
                    </div>
                </li>
                <li className="alarm_100">
                    <textarea
                    id="SCRIPT_BODY"
                    name="SCRIPT_BODY"
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
                    <span style={{ fontSize: "1.5em" }}>④</span>&nbsp;&nbsp;
                    <button type="button" id="btn_alarm" className="btn_bb80"
                        onClick={sendBtnClick}
                    >
                    방송하기
                    </button>
                    <button type="button" id="btn_plan" className="btn_wbb80">
                    방송예약
                    </button>
                    <button type="button" id="btn_edit" className="btn_wgb110">
                    방송 등록/편집
                    </button>
                </li>
            </ul>
        </div>
    );
}

export default AbrCommonDetail;