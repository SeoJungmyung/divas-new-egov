import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import * as EgovNet from 'context/egovFetch';
import AbrDateDetail from 'divas/abr/AbrDateDetail';
// import * as _ from 'lodash';

function AbrDate(props) {

    console.group("AbrDateContent");
    console.log("[Start] AbrDateContent ------------------------------");
    console.log("AbrDateContent [props] : ", props);

    const [planListTag, setPlanListTag] = useState([]);
    const [scriptDetail, setScriptList] = useState([]);
    const [planNo, selectPlanNo] = useState("");

    const history = useHistory();

    // 검색  기존 조회에서 접근 했을 시 || 신규로 접근 했을 시
    let search_sel = 'script_title';
    let search_text = '';
    const [searchCondition, setSearchCondition] 
    = useState(history.location.state?.searchCondition 
        || { search_sel : 'script_title', search_text : '' });

    const retrieveList = (searchCondition) => {
        const retrieveListURL = '/divas/abr/abrDateList.do';
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

                /* 
                 *  방송지역 변경 구현할 것!  
                    BroadcastVO.rtu_id_arr 로 Array형태로 넘길 것
                 */


                // if(resp.result.broadcastList.length < 1){
                //     mutListTag.push(<p className="no_data">검색된 결과가 없습니다.</p>); // 게시판 목록 초기값
                // }

                //일정 리스트
                let scriptObj = [];
                resp.result.planList.forEach(function (item, index) {
                    if (index === 0) mutListTag = [];
                    let plan_start_date = item.plan_start_date.substr(0, 10);
                    let plan_end_date = item.plan_end_date.substr(0, 10);
                    let plan_hh = item.plan_start_date.substr(11, 2);
                    let plan_mi = item.plan_start_date.substr(14, 2);
                    let plan_time = plan_hh+":"+plan_mi;

                    let plan_cycle_name = "";
                    if(item.plan_cycle == "D"){
                        plan_cycle_name = "매일";
                    }else if(item.plan_cycle == "M"){
                        plan_cycle_name = "매월";
                    }else{
                        if(item.plan_cycle == "0"){
                            plan_cycle_name = "매주(일)";
                        }else if(item.plan_cycle == "1"){
                            plan_cycle_name = "매주(월)";
                        }else if(item.plan_cycle == "2"){
                            plan_cycle_name = "매주(화)";
                        }else if(item.plan_cycle == "3"){
                            plan_cycle_name = "매주(수)";
                        }else if(item.plan_cycle == "4"){
                            plan_cycle_name = "매주(목)";
                        }else if(item.plan_cycle == "5"){
                            plan_cycle_name = "매주(금)";
                        }else if(item.plan_cycle == "6"){
                            plan_cycle_name = "매주(토)";
                        }else{
                            plan_cycle_name = "-";
                        }
                    }

                    let is_pause_name = "";
                    if(item.is_pause == "0"){
                        is_pause_name = "./images/play-plan.png";
                    }else if(item.is_pause == "1"){
                        is_pause_name = "./images/stop-plan.png";
                    }
                    
                    let script_title = item.script_title;
                    let user_id = item.user_id;
                    mutListTag.push(
                        <ul key={"script_"+index} id={"list"+item.plan_no} onClick={() => onClickScript(item.plan_no)}>
                            <li key={"p_sd_"+index} className="li15">{plan_start_date}</li>
                            <li key={"p_ed_"+index} className="li15">{plan_end_date}</li>
                            <li key={"p_t_"+index} className="li10">{plan_time}</li>
                            <li key={"p_cn_"+index} className="li10">{plan_cycle_name}</li>
                            <li key={"st_"+index} className="li30">{script_title}</li>
                            <li key={"ui_"+index} className="li10">{user_id}</li>
                            <li key={"ip_"+index} className="li10">
                                <img className="btn_convert" state="stop" width="20px" height="20px"
                                    src={is_pause_name}  onClick={() => stateChangeBtnClick(item.plan_no, item.is_pause)}/>
                            </li>
                        </ul>
                    );
                    scriptObj.push(item);
                });
                mutListTag.push();
                setPlanListTag(mutListTag);
                scriptObj.push();
                setScriptList(scriptObj);
            },
            function (resp) {
                console.log("err response : ", resp);
            }
        );
    }
    
    const stateChangeBtnClick = (plan_no, is_pause) => {
        const retrieveListURL = '/divas/abr/abrDateStateChange.do';
        if(plan_no != ""){
            let tmsVO = {
                plan_no : plan_no,
                is_pause : is_pause
            }
            
            const requestOptions = {
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(tmsVO)
            }

            EgovNet.requestFetch(retrieveListURL,
                requestOptions,
                (resp) => {
                    console.log("result = ", resp);
                    if(resp.resultCode == 200){
                        reRoading();
                    }
                    
                },
                function (resp) {
                    console.log("err response : ", resp);
                }
            );
        }
    }

    useEffect(() => {
        retrieveList(searchCondition);
        return () => {
        }
    }, [searchCondition]);

    const reRoading = () =>{
        setSearchCondition({ search_sel : 'script_title', search_text : '' });
    }

    const onClickScript = (planNo) => {
        selectPlanNo(planNo);
    } 

    console.log("------------------------------AbrDateContent [End]");
    console.groupEnd("AbrDateContent");

    return (
        <div>
            <div className="main_contitle">
                <img src="../images/title_02_03.png" alt="방송 일정"/>
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
                                    <li className="li15">시작일</li>
                                    <li className="li15">종료일</li>
                                    <li className="li10">방송시각</li>
                                    <li className="li10">주기</li>
                                    <li className="li30">제목</li>
                                    <li className="li10">예약자</li>
                                    <li className="li10">상태</li>
	                            </ul>
	                        </li>
	                        <li id="list_table" className="h100 w100">
                                <div id="spin"></div>
                                {planListTag}
                            </li>
                        </ul>
                    </div>
				    </li>
                    <li className="mi"></li>
                    <li className="tb_edit_r">
                        <AbrDateDetail planNo={planNo} scriptDetail={scriptDetail}
                                reRoading={reRoading}
                        />
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default AbrDate;