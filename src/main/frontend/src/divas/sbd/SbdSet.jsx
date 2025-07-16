import React, { useState, useEffect } from 'react';
import * as EgovNet from 'context/egovFetch';
import SbdSetDetail from 'divas/sbd/SbdSetDetail';

function SbdSet(props) {

    console.group("SbdSetContent");
    console.log("[Start] SbdSetContent ------------------------------");
    console.log("SbdSetContent [props] : ", props);

    const [reload, setLoadState] = useState(false);
    const [groupListTag, setGroupListTag] = useState([]);
    const [listTag, setListTag] = useState([]);
    const [scriptListTag, setScriptListTag] = useState([]);
    const [scriptDetail, setScriptList] = useState([]);
    const [scriptNo, selectScriptNo] = useState("");
    const [option1, selectOp1] = useState({});
    const [option2, selectOp2] = useState({});
    const [rtuOption, selectRtuOp] = useState({rtu_cnt : "", area_code : [], siteid : []});

    const retrieveList = () => {
        const retrieveListURL = '/divas/sbd/SbdSet.do';
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

                mutListTag = [];
                // 문안 리스트
                let scriptObj = [];
                resp.result.signList.forEach(function (item, index) {
                    let systype_name = item.systype == 1 ? "TCP/IP" : (item.type == 2 ? "CDMA" : "232 통신");
                    let baudrate = item.systype == 1 ? "-" : item.baudrate;
                    let contype = item.systype == 3 ? "-" : item.contype;
                    let gateway = item.systype == 1 ? item.gateway : "-" ;
                    let netmask = item.systype == 1 ? item.netmask : "-" ;
                    mutListTag.push(
                        <tr key={"script_"+index} id={"list"+item.siteid} className="pointer" onClick={() => onClickScript(item.siteid)}>
                            <td className="li5">{index+1}</td>
                            <td className="li10 bL_1gry">{item.areabestname}</td>
                            <td className="li10 bL_1gry">{item.areaname}</td>
                            <td className="li20 bL_1gry">{item.sitename}</td>
                            <td className="li5 bL_1gry">{item.modx}</td>
                            <td className="li5 bL_1gry">{item.mody}</td>
                            <td className="li5 bL_1gry">{systype_name}</td>
                            <td className="li5 bL_1gry">{baudrate}</td>
                            <td className="li10 bL_1gry">{contype}</td>
                            <td className="li5 bL_1gry">{item.port}</td>
                            <td className="li10 bL_1gry">{gateway}</td>
                            <td className="li10 bL_1gry">{netmask}</td>
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
    }, [reload]);

    const reRoading = () =>{
        setLoadState(!reload);
    }

    const onCheckRtu = (e) => {
        // console.log(e.target.getAttribute('data-siteid'));
        const tg = e.target;
        let id = rtuOption.area_code;
        id.push(tg.getAttribute('data-rtu_id'));
        let no = rtuOption.siteid;
        no.push(Number(tg.getAttribute('data-siteid')));
        // console.log(no);
        selectRtuOp({
            rtu_cnt : id.length,
            area_code : id,
            siteid : no
        });
    } 

    const onClickScript = (scriptNo) => {
        selectScriptNo(scriptNo);
    } 

    console.log("------------------------------SbdSetContent [End]");
    console.groupEnd("SbdSetContent");

    return (
        <div id="content">
            <div className="main_contitle">
                <img src="../images/title_08_09.png" alt="전광판 설정" />
                <div className="unit">※ 항목을 클릭하면 설정값을 확인 및 수정할 수 있습니다.</div>
            </div>
            <div className="right_bg">
                <ul className="set_ulwrap_nh">
                    <li className="tb_sms_gry">
                        {/* 검색기능 일원화 후 컴포넌트로 뺄 것 */}
                        <span className="sel_left_n">
                            전광판 목록 조회 :
                            <select id="search_col" name="search_col" className="f333_12" size={1}>
                                <option value={0}>상위지역</option>
                                <option value={1}>지역</option>
                                <option value={2}>설치장소</option>
                            </select>
                            &nbsp;
                            <input
                                type="text"
                                id="search_word"
                                name="search_word"
                                className="f333_12"
                                size={60}
                            />
                            &nbsp;&nbsp;
                            <button type="button" id="btn_search" className="btn_bs">
                                조회
                            </button>
                            <button type="button" id="btn_search_all" className="btn_lbs">
                                전체목록
                            </button>
                        </span> 
                    </li>
                    <li className="li100_nor d_scroll">
                        <table id="list_table" className="tb_data">
                            <thead className="tb_data_tbg">
                                <tr>
                                    <th className="li5">번호</th>
                                    <th className="li10 bL_1gry">상위지역</th>
                                    <th className="li10 bL_1gry">지역</th>
                                    <th className="li20 bL_1gry">설치장소</th>
                                    <th className="li5 bL_1gry">가로크기</th>
                                    <th className="li5 bL_1gry">세로크기</th>
                                    <th className="li5 bL_1gry">통신방식</th>
                                    <th className="li5 bL_1gry">통신속도</th>
                                    <th className="li10 bL_1gry">IP/전화번호</th>
                                    <th className="li5 bL_1gry">PORT</th>
                                    <th className="li10 bL_1gry">GateWay</th>
                                    <th className="li10 bL_1gry">NetMask</th>
                                </tr>
                            </thead>
                            <tbody>
                                {scriptListTag}
                            </tbody>
                        </table>
                    </li>
                </ul>
                <SbdSetDetail  scriptNo={scriptNo} scriptDetail={scriptDetail}
                                option1={option1} option2={option2} 
                                reRoading={reRoading} />
            </div>
        </div>
    );
}

export default SbdSet;