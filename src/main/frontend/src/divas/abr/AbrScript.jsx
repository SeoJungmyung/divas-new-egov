import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import * as EgovNet from 'context/egovFetch';
import AbrScriptSet from 'divas/abr/AbrScriptSet';

function AbrScript(props) {

    console.group("AbrScriptContent");
    console.log("[Start] AbrScriptContent ------------------------------");
    console.log("AbrScriptContent [props] : ", props);

    const [scriptListTag, setScriptListTag] = useState([]);
    const [scriptDetail, setScriptList] = useState([]);
    const [scriptNo, selectScriptNo] = useState("");

    const history = useHistory();

    // 검색  기존 조회에서 접근 했을 시 || 신규로 접근 했을 시
    let search_sel = 'script_title';
    let search_text = '';
    const [searchCondition, setSearchCondition] 
    = useState(history.location.state?.searchCondition 
        || { search_sel : 'script_title', search_text : '' });

    const retrieveList = (searchCondition) => {
        const retrieveListURL = '/divas/abr/abrScript.do';
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(searchCondition)
        }

        EgovNet.requestFetch(retrieveListURL,
            requestOptions,
            (resp) => {
                let mutListTag = [];
                console.log("result = ", resp.result);
                // if(resp.result.broadcastList.length < 1){
                //     mutListTag.push(<p className="no_data">검색된 결과가 없습니다.</p>); // 게시판 목록 초기값
                // }

                // 문안 리스트
                let scriptObj = [];
                resp.result.scriptList.forEach(function (item, index) {
                    if (index === 0) mutListTag = [];
                    let section_name = item.section_name;
                    let script_unit = item.script_unit;
                    let script_unit_name = "";
                    if(script_unit == "T") script_unit_name = "문자";
                    else if(script_unit == "R") script_unit_name = "음성";
                    else script_unit_name = "녹음";
                    let script_title = item.script_title;
                    let user_id = item.user_id;
                    mutListTag.push(
                        <ul key={"script_"+index} id={"list"+item.script_no} onClick={() => onClickScript(item.script_no)}>
                            <li key={"s_sn_"+index} className="li15">{section_name}</li>
                            <li key={"s_sun_"+index} className="li15">{script_unit_name}</li>
                            <li key={"s_st_"+index} className="li60">{script_title}</li>
                            <li key={"s_ui_"+index} className="li10">{user_id}</li>
                        </ul>
                    );
                    scriptObj.push(item);
                });
                mutListTag.push();
                setScriptListTag(mutListTag);
                scriptObj.push();
                setScriptList(scriptObj);
            },
            function (resp) {
                console.log("err response : ", resp);
            }
        );

    }
    useEffect(() => {
        retrieveList(searchCondition);
        return () => {
        }
    }, [searchCondition]);

    const reRoading = () =>{
        setSearchCondition({ search_sel : 'script_title', search_text : '' });
    }

    const onClickScript = (scriptNo) => {
        selectScriptNo(scriptNo);
    } 

    console.log("------------------------------AbrScriptContent [End]");
    console.groupEnd("AbrScriptContent");

    return (
        <div>
            <div className="main_contitle">
                <img src="../images/title_02_02.png" alt="방송 문안"/>
            </div>
            <div id="alarm_frm" className="right_bg">
                <ul className="tb_edit">
                    <li className="tb_edit_lm">
                    <div className="conte_sel">
                        <select id="SECTION_NO_SEARCH" name="SECTION_NO_SEARCH" className="select_conte_l">
                            <option value="0" data-sort="0">전체</option>
                        </select>
                        <button type="button" id="btn_search" className="btn_bs60"
                            onClick={e => {
                                setSearchCondition(
                                    { ...searchCondition, search_sel: search_sel, search_text: search_text });}}
                        >조회</button>
                        <input type="text" id="search_text" name="search_text" className="input_conte"
                            defaultValue={searchCondition.search_text} placeholder=""
                            onChange={e => {
                                search_text = e.target.value;
                            }}
                        />
                        <select id="search_sel" name="search_sel" className="select_conte_r"
                            defaultValue={searchCondition.search_sel}
                            onChange={e => {
                                search_sel = e.target.value;
                            }}
                        >  
                            <option value="script_title">방송제목</option>
                            <option value="script_body">방송문구</option>
                            <option value="user_id">작성자ID</option>
                            <option value="section_no">방송구분번호</option>
                        </select>   
                    </div>
                    <div className="conte">
						<ul className="pB45p">
	                        <li className="conte_gry">
	                        	<ul>
	                            <li className="li15">방송구분</li>
	                            <li className="li15">유형</li>
	                            <li className="li60">제목</li>
	                      		<li className="li10">작성자</li>
	                            </ul>
	                        </li>
	                        <li id="list_table" className="h100">
                                <div id="spin"></div>
                                {scriptListTag}
                            </li>
                        </ul>
                    </div>
				    </li>
                    <li className="mi"></li>
                    <li className="tb_edit_r">
                        <AbrScriptSet scriptNo={scriptNo} scriptDetail={scriptDetail}
                                reRoading={reRoading}
                        />
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default AbrScript;