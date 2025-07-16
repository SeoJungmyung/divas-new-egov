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

function SbdSendDetail(props) {

    console.group("SbdSendDetailContent");
    console.log("[Start] SbdSendDetailContent ------------------------------");
    console.log("SbdSendDetailContent [props] : ", props);

    // const [groupListTag, setGroupListTag] = useState([]);
    // const [listTag, setListTag] = useState([]);
    // const [scriptListTag, setScriptListTag] = useState([]);

    const history = useHistory();
    
    const [editorState, setEditorState] = React.useState(
        () => EditorState.createEmpty(),);

    const [msgType, setMsgType] = useState("0");
    const [actionTag, setActionTag] = useState([]);
    const [colorTag, setColorTag] = useState([]);
    const [idx_arr, setSelectedIdx] = useState([]);
    const timeout = useRef(null);

    const [scriptObj, setScriptObj] = useState({
        idx : 0,
        type : 0,
        msgaction : 1,
        msgcolor : 1,
        msgdelay : 5,
        msgspd : 5,
        modx : 20,
        mody : 1,
        msg : "",
        imgmsg : "",
        imgpath : ""
    });

    const onCapture = () => {
        console.log('onCapture');
        html2canvas(document.getElementById('img_area')).then(canvas=>{
            
            // 서버 DB 저장, file 저장
            let img = canvas.toDataURL("image/png");    
            console.log(img);  
            scriptObj.division = '0';
            if(scriptObj.division == '0'){
                scriptObj.enddate = "0000-00-00 00:00:00";
            }else{
                scriptObj.enddate = new Date(); // Y-m-d H:i:s + urghour + urgmin
            }
            scriptObj.saveimgvalue = img;
            
            const retrieveListURL = '/divas/sbd/actionChangeMsg.do';
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
                    
                },
                function (resp) {
                    console.log("err response : ", resp);
                }
            );

            // 클라이언트 저장
            // canvas.toBlob(function(blob){
            //     console.log(blob);  
            //     saveAs(blob, 'test.png'); 
            // });
        });
    };

    const settingOptions = () => {
        if(Object.keys(props.option1).length != 0){
            setActionTag(props.option1);
        }
        if(Object.keys(props.option2).length != 0){
            setColorTag(props.option2);
        }
    }

    const updateScript = () => {

        if(props.scriptNo != ""){
            let res = props.scriptDetail.filter(it => it.idx == props.scriptNo );
            console.log(res);
            setMsgType(res[0].type);
            setScriptObj({
                idx : res[0].idx,
                type : res[0].type,
                msg : res[0].msg,
                msgaction : res[0].msgaction,
                msgcolor : res[0].msgcolor,
                msgdelay : res[0].msgdelay,
                msgspd : res[0].msgspd,
                modx : res[0].modx,
                mody : res[0].mody,
                imgmsg : res[0].imgmsg,
                imgpath : res[0].imgpath
            });
            $("#img_area").html(res[0].imgmsg);
        }
    }

    const sendBtnClick = (e) => {
        scriptObj.siteid_arr = props.rtuOption.siteid;
        scriptObj.division = '0'; // 발송타입(0:일반, 1:일반긴급, 2:자동긴급) 
        // scriptObj.msg_idx = idx_arr; // 선택된 메세지 idx 배열
        scriptObj.msg_idx = [props.scriptNo];

        console.log(scriptObj);

        const retrieveListURL = '/divas/sbd/actionSbdSend.do';
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

                    // 초기화
                    setScriptObj({
                        idx : 0,
                        type : 0,
                        msgaction : 1,
                        msgcolor : 1,
                        msgdelay : 5,
                        msgspd : 5,
                        modx : 20,
                        mody : 1,
                        msg : "",
                        imgmsg : "",
                        imgpath : ""
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
                modx : modx,
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
                mody : mody,
                imgmsg : scriptObj.imgmsg,
                imgpath : scriptObj.imgpath
            });
        }
        // let width = $("#outerbuffer").css('width');
        let width = "220px";
        console.log(width.replace('px', ''));
        width = Number(width.replace('px', ''));
        let changeWidth = (width + (Number(modx)*3.5)) + "px";
        $("#outerbuffer").css('width', changeWidth);
    }

    const optionSelect = (e) => {
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

    console.log("------------------------------SbdSendDetailContent [End]");
    console.groupEnd("SbdSendDetailContent");

    return (
        <div className="alarm">
            <ul className="_ulwrap_nh">
                <li className="tb_sms_gry">
                    <span style={{ fontSize: "1.5em" }}>③</span> 메세지 전송 
                    <span className="sel_right_n">
                        <label>
                            <input type="checkbox" id="msg_save" />
                            메세지저장 &nbsp;
                        </label>
                        <label>
                            <input type="checkbox" id="emer" />
                            긴급전송 &nbsp; &nbsp;
                        </label>
                        <button type="button" id="btn_send" className="btn_bs60 mL5" onClick={sendBtnClick}>
                            전송하기
                        </button>
                        <button type="button" id="btn_re" className="btn_bs60 mL5"  onClick={onCapture}>
                            초기화
                        </button>
                        <button type="button" id="btn_edit" className="btn_wgb120_s">
                            메세지 등록/편집
                        </button>
                    </span>
                </li>
                <li className="li100_nor">
                    <table className="set_tb">
                        <tbody>
                            <tr>
                                <td className="bg_lb w10 bold al_C bL0">내용 구분</td>
                                <td>
                                    <input type="radio" name="type" defaultValue={0}/>{" "}
                                    텍스트
                                    <input type="radio" name="type" defaultValue={1} /> 이미지
                                </td>
                                <td className="bg_lb w10 bold al_C bL0">효과</td>
                                <td className="w40">
                                    <select id="MSGACTION" name="msgaction" size={1}>
                                       {actionTag}
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td className="bg_lb w10 bold al_C bL0">정지시간</td>
                                <td>
                                    <select id="MSGDELAY" name="msgdelay" size={1}>
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                        <option value={3}>3</option>
                                        <option value={4}>4</option>
                                        <option value={5}>5</option>
                                    </select>{" "}
                                    초
                                </td>
                                <td className="bg_lb w10 bold al_C bL0">색상</td>
                                <td>
                                    <select id="MSGCOLOR" name="msgcolor" size={1}>
                                        {colorTag}
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td className="bg_lb w10 bold al_C bL0">속도</td>
                                <td>
                                    <select id="MSGSPD" name="msgspd" size={1} value={5} 
                                        onChange={optionSelect}>
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
                                    </select>{" "}
                                    1 : 가장빠르게, 10 : 가장느리게
                                </td>
                                <td className="bg_lb w10 bold al_C bL0">단 / 열</td>
                                <td>
                                    <div id="text_type" style={{ display: "inline" }}>
                                    단 구분 :{" "}
                                    <select
                                        style={{ position: "relative" }}
                                        id="DAN_TEXT_TYPE"
                                        name="dan_text_type"
                                        size={1} value={scriptObj.mody} 
                                        onChange={(e)=>sizeSelect(e.target.value, '')}
                                    >
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                        <option value={3}>3</option>
                                        <option value={4}>4</option>
                                    </select>
                                    &nbsp;&nbsp;/&nbsp;&nbsp; 열 구분 :{" "}
                                    <select
                                        style={{ position: "relative" }}
                                        id="ROW_TEXT_TYPE"
                                        name="row_text_type"
                                        size={1} value={scriptObj.modx} 
                                        onChange={(e)=>sizeSelect('',e.target.value)}
                                    >
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={30}>30</option>
                                        <option value={40}>40</option>
                                        <option value={50}>50</option>
                                    </select>
                                    </div>
                                </td>
                            </tr>
                            { msgType == "1" && (
                                <tr id="img_title">
                                    <td className="bg_lb w10 bold al_C bL0">제목</td>
                                    <td className="w40" colSpan={3}>
                                        <input
                                        type="text"
                                        id="TITLE"
                                        name="title"
                                        className="f333_12"
                                        size={40}
                                        onChange={onChange}
                                        value={scriptObj.msg}
                                        />
                                        ※ 주의 : 단/열의 크기를 먼저 지정하시고, 줄바꿈을 하지 말고 이어서
                                        글자를 적어주세요. ( 지정한 열 이상 적으시면 자동 줄바꿈이 됩니다. )
                                    </td>
                                </tr>
                            )}
                            { msgType == "1" ? ( ( 
                                <>
                                <tr id="img_text">
                                    <td className="bg_lb w10 bold al_C bL0">내용</td>
                                    <td height={35} colSpan={3}>
                                        <textarea
                                        id="IMG"
                                        name="imgmsg"
                                        wrap="off"
                                        cols={40}
                                        rows={1}
                                        defaultValue={""}
                                        onChange={onChangeImg}
                                        value={scriptObj.imgmsg}
                                        style={{ backgroundColor : "black", color: 'white' }}
                                        />
                                        <br />
                                        ※ 주의 : 메세지 등록 후 전송 시 화면에 보이는대로 전송 됩니다. 내용이
                                        박스 안에 모두 보이도록 입력해 주세요.
                                        {/* <TextEditor editorState={editorState} onChange={setEditorState} /> */}
                                    </td>
                                </tr>
                                <tr id="img_text2">
                                    <td className="bg_lb w10 bold al_C bL0">이미지</td>
                                    <td height="300px" colSpan={3}>
                                        <div
                                        id="outerbuffer"
                                        style={{
                                            overflow: "hidden",
                                            paddingRight: 15,
                                            backgroundColor: "black",
                                            width: 220,
                                            display: "block",
                                            verticalAlign: "middle"
                                        }}
                                        >
                                        <div id="img_area" className="img_area"/>
                                            
                                        </div>
                                        {scriptObj.imgpath}
                                    </td>
                                </tr>
                                </>
                                )
                            ) : (
                                <tr id="msg_text">
                                    <td rowSpan={3} className="bg_lb w10 bold al_C bL0">
                                        내용
                                    </td>
                                    <td height={35} rowSpan={3} colSpan={3}>
                                        <textarea
                                        id="MSG"
                                        name="msg"
                                        wrap="off"
                                        cols={20}
                                        rows={1}
                                        style={{ width: 150, overflowX: "scroll" }}
                                        onChange={onChange}
                                        value={scriptObj.msg}
                                        />
                                        <br />※ 주의 : 메세지 등록 후 전송 시 화면에 보이는대로 전송 됩니다.
                                        내용이 박스 안에 모두 보이도록 입력해 주세요.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </li>
            </ul>
        </div>
    );
}

export default SbdSendDetail;