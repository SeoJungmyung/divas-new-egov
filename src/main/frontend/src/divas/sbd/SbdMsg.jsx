import React, { useState, useEffect } from 'react';
import * as EgovNet from 'context/egovFetch';
import SbdMsgDetail from 'divas/sbd/SbdMsgDetail';

function SbdMsg(props) {

    console.group("SbdMsgContent");
    console.log("[Start] SbdMsgContent ------------------------------");
    console.log("SbdMsgContent [props] : ", props);

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
        const retrieveListURL = '/divas/sbd/SbdMsg.do';
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
                if(resp.result.msgList.length < 1){
                    mutListTag.push(<tr className="no_data"><td colSpan={7}>검색된 결과가 없습니다.</td></tr>); // 게시판 목록 초기값
                }

                mutListTag = [];
                // 문안 리스트
                let scriptObj = [];
                resp.result.msgList.forEach(function (item, index) {
                    let type_name = item.type == 0 ? "텍스트" : "이미지";
                    mutListTag.push(
                        <tr key={"script_"+index} id={"list"+item.idx} className="pointer" onClick={() => onClickScript(item.idx)}>
                            <td>{index+1}</td>
                            <td>{type_name}</td>
                            <td>{item.actionname}</td>
                            <td>{item.msgspd}</td>
                            <td>{item.msgdelay}</td>
                            <td>{item.colorname}</td>
                            <td>{item.msg}</td>
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

    console.log("------------------------------SbdMsgContent [End]");
    console.groupEnd("SbdMsgContent");

    return (
        <div id="content">
            <div className="main_contitle">
                <img src="../images/title_08_08.png" alt="메세지 설정" />
            </div>
            <div className="right_bg">
                <ul className="ulwrap_nh">
                    <li className="tb_sms_gry">
                        <span className="sel_left_n">
                            메세지 목록 조회 :
                            <select id="search_col" name="search_col" className="f333_12" size={1}>
                                <option value={0}>구분</option>
                                <option value={1}>효과</option>
                                <option value={2}>내용</option>
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
                                    <th className="li10 bL_1gry">구분</th>
                                    <th className="li30 bL_1gry">효과</th>
                                    <th className="li5 bL_1gry">속도</th>
                                    <th className="li5 bL_1gry">정지시간</th>
                                    <th className="li5 bL_1gry">색상</th>
                                    <th className="li40 bL_1gry">내용</th>
                                </tr>
                            </thead>
                            <tbody>
                                {scriptListTag}
                            </tbody>
                        </table>
                    </li>
                </ul>
                <SbdMsgDetail  scriptNo={scriptNo} scriptDetail={scriptDetail}
                                option1={option1} option2={option2} 
                                reRoading={reRoading} />
            </div>
        </div>
    );
}

export default SbdMsg;