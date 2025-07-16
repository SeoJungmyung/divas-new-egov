import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import * as EgovNet from 'context/egovFetch';

// import * as _ from 'lodash';
import URL from 'context/url';

function SetOrganDetail(props) {

    console.group("SetOrganDetailContent");
    console.log("[Start] SetOrganDetailContent ------------------------------");
    console.log("SetOrganDetailContent [props] : ", props);

    // const [groupListTag, setGroupListTag] = useState([]);
    // const [listTag, setListTag] = useState([]);
    // const [scriptListTag, setScriptListTag] = useState([]);

    const history = useHistory();
    
    const [msgType, setMsgType] = useState("0");
    const [organTag, setOrganTag] = useState([]);
    const [colorTag, setColorTag] = useState([]);
    const [sTag, setSTag] = useState([]);
    const [idx_arr, setSelectedIdx] = useState([]);
    const timeout = useRef(null);

    const [scriptObj, setScriptObj] = useState({
        area_code: "",
        area_main: "",
        area_sub: "",
        department: "",
        organ_id: 1,
        organ_name: "",
        sort_base: ""
        // search_sel: "",
        // search_text: "",
    });

    // const settingOptions = () => {
    //     if(Object.keys(props.option1).length != 0){
    //         setOrganTag(props.option1);
    //     }
    //     // // 열 구분 세팅
    //     // let opTag = [];
    //     // for(let i=1; i<=100; i++){
    //     //     opTag.push(
    //     //         <option value={i}>{i}</option>
    //     //     );
    //     // }
    //     // setSTag(opTag);
    // }

    const updateScript = () => {

        if(props.scriptNo != ""){
            let res = props.scriptDetail.filter(it => it.organ_id == props.scriptNo );
            console.log(res);
            setScriptObj({
                area_code: res[0].area_code,
                organ_id: res[0].organ_id,
                organ_name: res[0].organ_name,
                area_main: res[0].area_main,
                area_sub: res[0].area_sub,
                department: res[0].department,
                sort_base: res[0].sort_base
            });

        }
    }

    const codeBtnClick = (e) => {
        console.log(scriptObj);

        // 페이징 - start : 페이지번호, length : 한페이지 표출 갯수
        scriptObj.start = 1;
        scriptObj.length = 20;

        const retrieveListURL = '/divas/set/getAreaInfo.do';
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
                    // openModal(); 리스트 표출
                    //
                }
            },
            function (resp) {
                console.log("err response : ", resp);
            }
        );
    }

    const changeBtnClick = (e) => {
        scriptObj.change_mode = e.target.getAttribute('data-change');
        console.log(scriptObj);

        const retrieveListURL = '/divas/set/actionChangeOrgan.do';
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
                        area_code: "",
                        area_main: "",
                        area_sub: "",
                        department: "",
                        organ_id: 1,
                        organ_name: "",
                        sort_base: ""
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

    const optionSelect = (e) => {
        console.log(e.target.value);
    }

    useEffect(() => {
        updateScript();
        return () => {
        }
    }, [props.scriptNo]);

    console.log("------------------------------SetOrganDetailContent [End]");
    console.groupEnd("SetOrganDetailContent");

    return (
        <ul className="set_ulwrap_nh">
            <li className="tb_sms_gry">
                <span className="top6px">설정값 입력</span>
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
                        <td className="bg_lb w10 bold al_C bL_1gry_n">기관명</td>
                        <td>
                            <input
                                type="text"
                                id="ORGAN_NAME"
                                name="organ_name"
                                className="f333_12"
                                size={20} value={scriptObj.organ_name}
                                onChange={onChange}
                            />
                        </td>
                        <td className="bg_lb w10 bold al_C">부서명</td>
                        <td>
                            <input
                                type="text"
                                id="DEPARTMENT"
                                name="department"
                                className="f333_12"
                                size={20} value={scriptObj.department}
                                onChange={onChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td className="bg_lb w10 bold al_C bL_1gry_n">행정코드</td>
                        <td>
                            <input
                                type="text"
                                id="AREA_CODE"
                                name="area_code"
                                className="f333_12"
                                size={20} value={scriptObj.area_code}
                                onChange={onChange} readOnly={true}
                            />
                            <button type="button" id="btn_area" className="btn_lgs"
                                onClick={codeBtnClick}
                            >
                                행정구역 조회
                            </button>
                        </td>
                        <td className="bg_lb w10 bold al_C">장비정렬기준</td>
                        <td>
                            <select id="SORT_BASE" name="sort_base" 
                                className="f333_12" value={scriptObj.sort_base}
                                onChange={onChange}>
                                <option value={0}>정렬순서</option>
								<option value={1}>행정코드</option>
								<option value={2}>장비이름</option>
                            </select>
                        </td>
                    </tr>
                </table>
            </li>
        </ul>
    );
}

export default SetOrganDetail;