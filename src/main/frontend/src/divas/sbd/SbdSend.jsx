import React, { useState, useEffect } from 'react';
import * as EgovNet from 'context/egovFetch';
import SbdSendDetail from 'divas/sbd/SbdSendDetail';

function SbdSend(props) {

    console.group("SbdSendContent");
    console.log("[Start] SbdSendContent ------------------------------");
    console.log("SbdSendContent [props] : ", props);

    const [groupListTag, setGroupListTag] = useState([]);
    const [listTag, setListTag] = useState([]);
    const [scriptListTag, setScriptListTag] = useState([]);
    const [scriptDetail, setScriptList] = useState([]);
    const [scriptNo, selectScriptNo] = useState("");
    const [option1, selectOp1] = useState({});
    const [option2, selectOp2] = useState({});
    const [rtuOption, selectRtuOp] = useState({rtu_cnt : "", area_code : [], siteid : []});

    const retrieveList = () => {
        const retrieveListURL = '/divas/sbd/SbdSend.do';
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify()
        }

        EgovNet.requestFetch(retrieveListURL,
            requestOptions,
            (resp) => {
                let mutListTag = [];
                console.log("result = ", resp.result);
                // if(resp.result.broadcastList.length < 1){
                //     mutListTag.push(<p className="no_data">검색된 결과가 없습니다.</p>); // 게시판 목록 초기값
                // }

                // 리스트 항목 구성 - 그룹화 할 것
                resp.result.equipGroupList.forEach(function (item, index) {
                    if (index === 0) mutListTag = [];
                    let group_name = item.mody +"단 "+ item.modx +"열";
                    // let total_rtu_cnt = "("+item.rtu_cnt+"개소)";
                    let total_rtu_cnt = "( 0 개소)";
                    mutListTag.push(
                        <li key={"rtuGrp_"+index} id={"tree_"+item.mody+"_"+item.modx}>
                            {group_name + total_rtu_cnt}
                            <ul>

                            </ul>
                        </li>
                    );
                });
                mutListTag.push();
                setGroupListTag(mutListTag);
                mutListTag = [];

                resp.result.equipList.forEach(function (item, index) {
                    if (index === 0) mutListTag = [];
                    let sitename = item.sitename;
                    mutListTag.push(
                        <li key={"rtu_"+index} id={"tree_"+item.areaid+"_"+item.siteid}
                            data-rtu_id={item.area_code}
                            data-siteid={item.siteid} 
                            onClick={onCheckRtu}
                        >
                            {sitename}
                        </li>
                    );
                });
                mutListTag.push();
                setListTag(mutListTag);

                mutListTag = [];
                // 문안 리스트
                let scriptObj = [];
                resp.result.msgList.forEach(function (item, index) {
                    mutListTag.push(
                        <tr key={"script_"+index} id={"list"+item.idx} className="pointer" onClick={() => onClickScript(item.idx)}>
                            <td key={"n_td_"+index}>
                                {index+1}
                            </td>
                            <td key={"s_td_"+index} style={{textAlign: 'left'}}>
                                {item.msg}
                            </td>
                        </tr>
                    );
                    scriptObj.push(item);
                });
                mutListTag.push();
                setScriptListTag(mutListTag);
                scriptObj.push();
                setScriptList(scriptObj);

                let item1 = [];
                let item2 = [];
                resp.result.optionsList.forEach(function (item, index) {
                    if(item.group_type == 1){
                        item1.push(
                            <option value={item.num}>{item.comment}</option>
                        );
                    }else if(item.group_type == 4){
                        item2.push(
                            <option value={item.num}>{item.comment}</option>
                        );
                    }
                });
                selectOp1(item1);
                selectOp2(item2);
            },
            function (resp) {
                console.log("err response : ", resp);
            }
        );

    }
    useEffect(() => {
        retrieveList();
        return () => {
        }
    }, []);

    const reRoading = () =>{
        selectRtuOp({rtu_cnt : "", area_code : [], siteid : []});
    }

    const onCheckRtu = (e) => {
        console.log(e.target.getAttribute('data-siteid'));
        
        const tg = e.target;
        let id = rtuOption.area_code;
        id.push(tg.getAttribute('data-rtu_id'));
        let no = rtuOption.siteid;
        no.push(Number(tg.getAttribute('data-siteid')));
        console.log(no);
        selectRtuOp({
            rtu_cnt : id.length,
            area_code : id,
            siteid : no
        });
    } 

    const onClickScript = (scriptNo) => {
        selectScriptNo(scriptNo);
    } 

    console.log("------------------------------SbdSendContent [End]");
    console.groupEnd("SbdSendContent");

    return (
        <div id="content">
            <div className="main_contitle">
                <img src="../images/title_08_03.png" alt="메세지 전송" />
            </div>
            <div className="right_bg">
                <ul className="tb_alarm h550p">
                    <li className="tb_alarm_lm">
                    <div className="alarm">
                        <ul>
                            <li className="alarm_gry">
                                <span
                                id="popup1"
                                className="popupInfo"
                                style={{ fontSize: "1.5em" }}
                                >
                                ①
                                </span>{" "}
                                전광판 선택 : <span id="rtu_cnt_text">0</span> 개소
                                <button type="button" id="btn_all" className="btn_bs60">
                                전체선택
                                </button>
                            </li>
                            <li id="group_table">
                                <ul>
                                    {groupListTag}
                                    {listTag}
                                </ul>
                            </li>
                        </ul>
                    </div>
                    </li>
                    <li className="mi" />
                    <li className="tb_alarm_lm">
                    <div className="alarm">
                        <ul>
                            <li className="alarm_gry">
                                <span
                                id="popup2"
                                className="popupInfo"
                                style={{ fontSize: "1.5em" }}
                                >
                                ②
                                </span>{" "}
                                메세지 구분
                                <select id="SECTION_NO_SEARCH" name="SECTION_NO_SEARCH" size="1" className="f333_12">
							        <option value="0">전체</option>
                                </select>
                            </li>
                            <li id="list_spin" className="p0 max480">
                                <div id="spin"></div>
                                <table className="tb_data">
                                    <thead className="tb_data_tbg">
                                        <tr>
                                            <td className="w15i bR_1gry">순서</td>
                                            <td className="w85i">메세지</td>	
                                        </tr>
                                    </thead>
                                    <tbody id="list_table">
                                        {scriptListTag}
                                    </tbody>
							    </table>
                            </li>
                        </ul>
                    </div>
                    </li>
                    <li className="mi" />
                    <li className="tb_alarm_r bg_no">
                        <ul></ul>
			        </li>
                </ul>
                <SbdSendDetail scriptNo={scriptNo} scriptDetail={scriptDetail}
                                option1={option1} option2={option2} 
                                rtuOption={rtuOption}
                                reRoading={reRoading}
                />
            </div>
        </div>
    );
}

export default SbdSend;