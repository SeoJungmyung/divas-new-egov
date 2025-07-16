import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import * as EgovNet from 'context/egovFetch';
import SetOrganDetail from 'divas/set/SetOrganDetail';

function SetOrgan(props) {

    console.group("SetOrganContent");
    console.log("[Start] SetOrganContent ------------------------------");
    console.log("SetOrganContent [props] : ", props);

    const history = useHistory();

    const [reload, setLoadState] = useState(false);
    const [scriptListTag, setScriptListTag] = useState([]);
    const [scriptDetail, setScriptList] = useState([]);
    const [scriptNo, selectScriptNo] = useState("");

    // 검색  기존 조회에서 접근 했을 시 || 신규로 접근 했을 시
    let search_sel = 'organ_name';
    let search_text = '';
    const [searchCondition, setSearchCondition] 
     = useState(history.location.state?.searchCondition 
        || { search_sel : 'organ_name', search_text : '' });
    console.log(history.location.state); // searchCondition 이 없어서 값 유지 안됨?
        
    const retrieveList = (searchCondition) => {
        console.log(searchCondition);
        const retrieveListURL = '/divas/set/SetOrgan.do';
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
                if(resp.result.organList.length < 1){
                    mutListTag.push(<tr className="no_data"><td colSpan={6}>검색된 결과가 없습니다.</td></tr>); // 게시판 목록 초기값
                }

                mutListTag = [];
                // 사용자 리스트
                let scriptObj = [];
                resp.result.organList.forEach(function (item, index) {
                    let text = item.area_main + " " + item.area_sub;
                    let sort_base_name = item.sort_base == 0 ? "정렬순서" : (item.sort_base == 1 ? "행정코드" : "장비이름");
                    mutListTag.push(
                        <tr key={"organ_"+index} id={"list"+index} className="pointer" onClick={() => onClickScript(item.organ_id)}>
                            <td className="li5">{item.organ_id}</td>
                            <td className="li10 bL_1gry">{item.organ_name}</td>
                            <td className="li15 bL_1gry">{item.department}</td>
                            <td className="li40 bL_1gry">{item.area_code}</td>
                            <td className="li15 bL_1gry">{text}</td>
                            <td className="li15 bL_1gry">{sort_base_name}</td>
                        </tr>
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
        setSearchCondition({ search_sel : 'organ_name', search_text : '' });
    }

    const onClickScript = (scriptNo) => {
        selectScriptNo(scriptNo);
    } 

    console.log("------------------------------SetOrganContent [End]");
    console.groupEnd("SetOrganContent");

    return (
        <div id="content">
            <div className="main_contitle">
                <img src="../images/title_06_05.png" alt="기관정보 설정" />
                <div className="unit">※ 항목을 클릭하면 설정값을 확인 및 수정할 수 있습니다.</div>
            </div>
            <div className="right_bg">
                <ul className="set_ulwrap_nh bB_3blue">
                    <li className="tb_sms_gry">
                        <span className="sel_left_n">
                            기관 목록 조회 :
                            <select id="search_sel" name="search_sel" className="f333_12"
                                defaultValue={searchCondition.search_sel}
                                onChange={e => {
                                    search_sel = e.target.value;
                                }}
                            >  
                                <option value={"organ_name"}>기관명</option>
                                <option value={"department"}>부서명</option>
                                <option value={"area_code"}>행정코드</option>
                            </select>   
                            &nbsp;
                            <input type="text" id="search_text" name="search_text" className="f333_12"
                                defaultValue={searchCondition.search_text} placeholder=""
                                onChange={e => {
                                    search_text = e.target.value;
                                }}
                            />
                            &nbsp;&nbsp;
                            <button type="button" id="btn_search" className="btn_bs"
                                onClick={e => {
                                    setSearchCondition(
                                        { ...searchCondition, search_sel: search_sel, search_text: search_text });}}
                            >조회</button>
                            <button type="button" id="btn_search_all" className="btn_lbs">
                                전체목록
                            </button>
                        </span> 
                    </li>
                    <li className="li100_nor d_scroll">
                        <table id="list_table" className="tb_data">
                            <thead className="tb_data_tbg">
                                <tr>
                                    <th className="li5">ID</th>
                                    <th className="li10 bL_1gry">기관명</th>
                                    <th className="li15 bL_1gry">부서명</th>
                                    <th className="li40 bL_1gry">행정코드</th>
                                    <th className="li15 bL_1gry">행정구역</th>
                                    <th className="li15 bL_1gry">정렬기준</th>
                                </tr>
                            </thead>
                            <tbody>
                                {scriptListTag}
                            </tbody>
                        </table>
                    </li>
                </ul>
                <SetOrganDetail  scriptNo={scriptNo} scriptDetail={scriptDetail}
                                reRoading={reRoading} />
            </div>
        </div>
    );
}

export default SetOrgan;