import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import * as EgovNet from 'context/egovFetch';
import TextEditor from 'divas/sbd/TextEditor'
import {Editor, EditorState} from 'draft-js';
import html2canvas from 'html2canvas';
import {saveAs} from 'file-saver';
import $ from 'jquery';

// import * as _ from 'lodash';
import URL from 'context/url';

function SbdSetDetail(props) {

    console.group("SbdSetDetailContent");
    console.log("[Start] SbdSetDetailContent ------------------------------");
    console.log("SbdSetDetailContent [props] : ", props);

    // const [groupListTag, setGroupListTag] = useState([]);
    // const [listTag, setListTag] = useState([]);
    // const [scriptListTag, setScriptListTag] = useState([]);

    const history = useHistory();
    
    const [editorState, setEditorState] = React.useState(
        () => EditorState.createEmpty(),);

    const [msgType, setMsgType] = useState("0");
    const [actionTag, setActionTag] = useState([]);
    const [colorTag, setColorTag] = useState([]);
    const [sTag, setSTag] = useState([]);
    const [idx_arr, setSelectedIdx] = useState([]);
    const timeout = useRef(null);

    const [scriptObj, setScriptObj] = useState({
        siteid : 0,
        areabestname : "상위지역테스트", //'' 변경
        areaname : "지역테스트",        //'' 변경
        sitename : "",
        systype : "",
        contype : "",
        urgaction : 1,
        urgspd : 5,
        urgdelay : 5,
        modx : 20,
        mody : 1,
        pointx : "",
        pointy : ""
    });

    const changeModX = (modx) => {
        let width = "16px";
        // console.log(width.replace('px', ''));
        width = Number(width.replace('px', ''));
        let changeWidth = (width + (Number(modx)*16)) + "px";
        $("#outerbuffer").css('width', changeWidth);
    }

    const settingOptions = () => {
        if(Object.keys(props.option1).length != 0){
            setActionTag(props.option1);
        }
        if(Object.keys(props.option2).length != 0){
            setColorTag(props.option2);
        }
        // 열 구분 세팅
        let opTag = [];
        for(let i=1; i<=100; i++){
            opTag.push(
                <option value={i}>{i}</option>
            );
        }
        setSTag(opTag);
    }

    const updateScript = () => {

        if(props.scriptNo != ""){
            let res = props.scriptDetail.filter(it => it.siteid == props.scriptNo );
            console.log(res);
            setScriptObj({
                siteid : res[0].siteid,
                areabestname : res[0].areabestname,
                areaname : res[0].areaname,
                sitename : res[0].sitename,
                systype : res[0].systype,
                contype : res[0].contype,
                urgaction : res[0].urgaction,
                urgspd : res[0].urgspd,
                urgdelay : res[0].urgdelay,
                modx : res[0].modx,
                mody : res[0].mody,
                pointx : res[0].pointx,
                pointy : res[0].pointy
            });
        }
    }

    const changeBtnClick = (e) => {
        // scriptObj.msg_idx = idx_arr; // 선택된 메세지 idx 배열
        scriptObj.change_mode = e.target.getAttribute('data-change');
        console.log(scriptObj);

        // contype(전화번호) 중복 확인 체크 작성할 것

        const retrieveListURL = '/divas/sbd/actionChangeSbd.do';
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
                if(resp.resultCode == 200){
                    setScriptObj({
                        siteid : 0,
                        areabestname : "상위지역테스트", //'' 변경
                        areaname : "지역테스트",        //'' 변경
                        sitename : "",
                        systype : "",
                        contype : "",
                        urgaction : 1,
                        urgspd : 5,
                        urgdelay : 5,
                        modx : 20,
                        mody : 1,
                        pointx : "",
                        pointy : ""
                    });
                    props.reRoading();
                }
            },
            function (resp) {
                console.log("err response : ", resp);
            }
        );
    }

    const onChange = (e) => {
        console.log(e.target.value);
        const { value, name } = e.target; 
        setScriptObj({
            ...scriptObj, 
            [name]: value 
        });
    }

    const onChangeImg = (e) => {
        console.log(e.target.value);
        const { value, name } = e.target; 
        setScriptObj({
            ...scriptObj, 
            [name]: value 
        });
        $("#img_area").html(e.target.value);
    }

    const sizeSelect = (mody, modx) => {
        if(mody == ""){
            setScriptObj({
                idx : scriptObj.idx,
                type : scriptObj.type,
                msg : scriptObj.msg,
                msgaction : scriptObj.msgaction,
                msgcolor : scriptObj.msgcolor,
                msgdelay : scriptObj.msgdelay,
                msgspd : scriptObj.msgspd,
                modx : Number(modx),
                mody : scriptObj.mody,
                imgmsg : scriptObj.imgmsg,
                imgpath : scriptObj.imgpath
            });
        }else if(modx == ""){
            setScriptObj({
                idx : scriptObj.idx,
                type : scriptObj.type,
                msg : scriptObj.msg,
                msgaction : scriptObj.msgaction,
                msgcolor : scriptObj.msgcolor,
                msgdelay : scriptObj.msgdelay,
                msgspd : scriptObj.msgspd,
                modx : scriptObj.modx,
                mody : Number(mody),
                imgmsg : scriptObj.imgmsg,
                imgpath : scriptObj.imgpath
            });
        }
        // let width = $("#outerbuffer").css('width');
        changeModX(modx);
    }

    const optionSelect = (e) => {
        console.log(e.target.value);
    }

    const areaChange = (e) => {
        console.log(e.target.value);
    }

    useEffect(() => {
        settingOptions();
        return () => {
        }
    }, [props.option2]);

    useEffect(() => {
        updateScript();
        return () => {
        }
    }, [props.scriptNo]);

    console.log("------------------------------SbdSetDetailContent [End]");
    console.groupEnd("SbdSetDetailContent");

    return (
        <ul className="set_ulwrap_nh">
            <li className="tb_sms_gry">
                <span className="top6px">전광판 등록</span>
                <span className="sel_right_n">
                    <button type="button" id="btn_insert" className="btn_bb80"
                        onClick={changeBtnClick} data-change={"insert"}>등록</button>
                    <button type="button" id="btn_re" className="btn_lbb80_s">
                        초기화
                    </button>
					<button type="button" id="btn_update" className="btn_wbb80"
                        onClick={changeBtnClick} data-change={"update"}>수정</button>
					<button type="button" id="btn_delete" className="btn_wbb80"
                        onClick={changeBtnClick} data-change={"delete"}>삭제</button>
                </span> 
            </li>
            <li className="li100_nor">
                <table className="set_tb">
                    <tr>
                        <td className="bg_lb w10 bold al_C bL0">상위 지역 / 지역</td>
                        <td colSpan={4}>
                            <input
                                type="text"
                                id="AREABESTNAME"
                                name="areabestname"
                                className="f333_12"
                                size={15}
                                value={scriptObj.areabestname} 
                                onChange={areaChange}
                            />
                            <input type="hidden" id="AREABESTID" name="areabestid" />
                            /
                            <input
                                type="text"
                                id="AREANAME"
                                name="areaname"
                                className="f333_12"
                                size={15}
                                value={scriptObj.areaname} 
                                onChange={areaChange}
                            />
                            <input type="hidden" id="AREAID" name="areaid" />
                        </td>
                        <td className="bg_lb w10 bold al_C">설치 장소</td>
                        <td colSpan={4}>
                            <input
                                type="text"
                                id="SITENAME"
                                name="sitename"
                                className="f333_12"
                                size={20}
                                value={scriptObj.sitename}
                                onChange={onChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td rowSpan={4} className="bg_lb w10 bold al_C bL0">밝기</td>
                        <td colSpan={9}>
                            <input type="checkbox" id="USEONOFF1" name="useonoff1" defaultValue="Y" />{" "}
                            사용 &nbsp;
                            <select id="HOURONOFF1" name="houronoff1" disabled="">
                                <option value="0">{"00"}</option>
                            </select>{" "}
                            시
                            <select id="MINONOFF1" name="minonoff1" disabled="">
                                <option value="0">{"00"}</option>
                            </select>{" "}
                            분
                            <select id="RIGHTONOFF1" name="rightonoff1" disabled="">
                                <option value="0">{"꺼짐"}</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={9}>
                            <input type="checkbox" id="USEONOFF1" name="useonoff1" defaultValue="Y" />{" "}
                            사용 &nbsp;
                            <select id="HOURONOFF1" name="houronoff1" disabled="">
                                <option value="0">{"00"}</option>
                            </select>{" "}
                            시
                            <select id="MINONOFF1" name="minonoff1" disabled="">
                                <option value="0">{"00"}</option>
                            </select>{" "}
                            분
                            <select id="RIGHTONOFF1" name="rightonoff1" disabled="">
                                <option value="0">{"꺼짐"}</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={9}>
                            <input type="checkbox" id="USEONOFF1" name="useonoff1" defaultValue="Y" />{" "}
                            사용 &nbsp;
                            <select id="HOURONOFF1" name="houronoff1" disabled="">
                                <option value="0">{"00"}</option>
                            </select>{" "}
                            시
                            <select id="MINONOFF1" name="minonoff1" disabled="">
                                <option value="0">{"00"}</option>
                            </select>{" "}
                            분
                            <select id="RIGHTONOFF1" name="rightonoff1" disabled="">
                                <option value="0">{"꺼짐"}</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={9}>
                            <input type="checkbox" id="USEONOFF1" name="useonoff1" defaultValue="Y" />{" "}
                            사용 &nbsp;
                            <select id="HOURONOFF1" name="houronoff1" disabled="">
                                <option value="0">{"00"}</option>
                            </select>{" "}
                            시
                            <select id="MINONOFF1" name="minonoff1" disabled="">
                                <option value="0">{"00"}</option>
                            </select>{" "}
                            분
                            <select id="RIGHTONOFF1" name="rightonoff1" disabled="">
                                <option value="0">{"꺼짐"}</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td className="bg_lb w10 bold al_C bL0">통신</td>
                        <td colSpan={4}>
                            <select id="SYSTYPE" name="systype">
                                <option value="1">TCP/IP</option>
                            </select>
                        </td>
                        <td className="bg_lb w10 bold al_C">자동 발령</td>
                        <td colSpan={4}>
                            <button type="button" id="btn_rtu" className="btn_lbs">장비 설정</button>
                        </td>
                    </tr>
                    {/* sys_a, sys_b, sys_c 분기할 것 */}
                    <tr id="sys_a" style={{ display: "none" }}>
                        <td className="bg_lb w10 bold al_C bL0">IP</td>
                        <td colSpan={4}>
                            <input
                            type="text"
                            id="A_CONTYPE"
                            name="contype"
                            className="f333_12"
                            size={20}
                            />
                        </td>
                        <td className="bg_lb w10 bold al_C">PORT</td>
                        <td colSpan={4}>
                            <input
                            type="text"
                            id="A_PORT"
                            name="port"
                            className="f333_12"
                            size={20}
                            />
                        </td>
                    </tr>
                    <tr id="sys_b" style={{ display: "none" }}>
                        <td className="bg_lb w10 bold al_C bL0">전화번호</td>
                        <td colSpan={4}>
                            <input type="text" id="B_CONTYPE" name="contype" size={20} />
                        </td>
                        <td className="bg_lb w10 bold al_C">포트설정</td>
                        <td colSpan={2}>
                            <select id="B_PORT" name="port" size={1}>
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                            <option value={6}>6</option>
                            </select>
                        </td>
                        <td className="bg_lb w10 bold al_C">통신속도</td>
                        <td colSpan={2}>
                            <select id="B_BAUDRATE" name="baudrate">
                            <option value={2400}>2400</option>
                            <option value={4800}>4800</option>
                            <option value={9600}>9600</option>
                            <option value={19200}>19200</option>
                            <option value={38400}>38400</option>
                            <option value={57600}>57600</option>
                            </select>
                        </td>
                    </tr>
                    <tr id="sys_c" style={{ display: "none" }}>
                        <td className="bg_lb w10 bold al_C">포트설정</td>
                        <td colSpan={4}>
                            <select id="C_PORT" name="port" size={1}>
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                            {/* <option value="6">6</option> */}
                            </select>
                        </td>
                        <td className="bg_lb w10 bold al_C">통신속도</td>
                        <td colSpan={4}>
                            <select id="C_BAUDRATE" name="baudrate">
                            <option value={2400}>2400</option>
                            <option value={4800}>4800</option>
                            <option value={9600}>9600</option>
                            <option value={19200}>19200</option>
                            <option value={38400}>38400</option>
                            <option value={57600}>57600</option>
                            </select>
                        </td>
                    </tr>
                    <tr id="sys_a2" style={{ display: "none" }}>
                        <td className="bg_lb w10 bold al_C bL0">Gateway</td>
                        <td colSpan={4}>
                            <input
                            type="text"
                            id="GATEWAY"
                            name="gateway"
                            className="f333_12"
                            size={20}
                            />
                        </td>
                        <td className="bg_lb w10 bold al_C">NetMask</td>
                        <td colSpan={4}>
                            <input
                            type="text"
                            id="NETMASK"
                            name="netmask"
                            className="f333_12"
                            size={20}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td className="bg_lb w10 bold al_C bL0">가로 크기</td>
                        <td colSpan={4}>
                            <select id="MODX" name="modx" size="1"
                             value={scriptObj.modx}
                             onChange={onChange}>
                                {sTag}
                            </select>
                        </td>
                        <td className="bg_lb w10 bold al_C">세로 크기</td>
                        <td colSpan={4}>
                            <select id="MODY" name="mody" size="1"
                             value={scriptObj.mody}
                             onChange={onChange}>
								<option value="1">1</option>
								<option value="2">2</option>
								<option value="3">3</option>
								<option value="4">4</option>
								<option value="5">5</option>
								<option value="6">6</option>
								<option value="7">7</option>
								<option value="8">8</option>
							</select>
                        </td>
                    </tr>
                    <tr>
                        <td className="bg_lb w10 bold al_C bL0">긴급 효과</td>
                        <td colSpan={4}>
                            <select id="URGACTION" name="urgaction" size="1">
                                {actionTag}
                            </select>
                        </td>
                        <td className="bg_lb w10 bold al_C">긴급 속도</td>
                        <td colSpan={4}>
                            <select id="URGSPD" name="urgspd" size="1">
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
							</select> 1 : 가장빠르게, 10 : 가장느리게
                        </td>
                    </tr>
                    <tr>
                        <td className="bg_lb w10 bold al_C bL0">긴급 정지시간</td>
                        <td colSpan={4}>
                            <select id="URGDELAY" name="urgdelay" size="1">
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
                            </select> 초
                        </td>
                        <td className="bg_lb w10 bold al_C">긴급 지속시간</td>
                        <td colSpan={4}>
                        <input id="URGHOUR" name="urghour" type="text" defaultValue={1} size={3} />
                        시간
                        <input id="URGMIN" name="urgmin" type="text" defaultValue={0} size={3} />분
                        (기본 1시간)
                        </td>
                    </tr>
                    <tr>
                        <td className="bg_lb w10 bold al_C bL0">설치좌표 X</td>
                        <td colSpan={4}>
                            <input type="text" id="POINTX" name="pointx" className="f333_12" size={15} />
                        </td>
                        <td className="bg_lb w10 bold al_C">설치좌표 Y</td>
                        <td colSpan={4}>
                            <input type="text" id="POINTY" name="pointy" className="f333_12" size={15} />
                        </td>
                    </tr>
                </table>
            </li>
        </ul>
    );
}

export default SbdSetDetail;