import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import * as EgovNet from 'context/egovFetch';
import { common_modal, showBroadcastRtuPopup } from 'js/common';

// import * as _ from 'lodash';

function SetUserDetail(props) {

    console.group("SetUserDetailContent");
    console.log("[Start] SetUserDetailContent ------------------------------");
    console.log("SetUserDetailContent [props] : ", props);

    // const [groupListTag, setGroupListTag] = useState([]);
    // const [listTag, setListTag] = useState([]);
    // const [scriptListTag, setScriptListTag] = useState([]);

    const location = useLocation();

    const [organTag, setOrganTag] = useState([]);
    const [idCheckResult, setIdCheckResult] = useState(false);
    const timeout = useRef(null);

    const [scriptObj, setScriptObj] = useState({
        area_code: "",
        email1: "",
        email2: "naver.com",
        email3: "",
        is_permit: "0",
        menu_type: "0",
        mobile1: "010",
        mobile2: "",
        mobile3: "",
        organ_id: "",
        organ_name: "",
        reg_date: "",
        smart_mobile1: "010",
        smart_mobile2: "",
        smart_mobile3: "",
        smart_use: "0",
        user_id: "",
        user_name: "",
        user_pwd: "",
        user_pwd_re: "",
        user_type: "",
        rtu_ids: []
        // search_sel: "",
        // search_text: "",
    });

    const [checkResult, setCheckResult] = useState("");

    const settingOptions = () => {
        if(Object.keys(props.option1).length != 0){
            setOrganTag(props.option1);
        }
        // // 열 구분 세팅
        // let opTag = [];
        // for(let i=1; i<=100; i++){
        //     opTag.push(
        //         <option value={i}>{i}</option>
        //     );
        // }
        // setSTag(opTag);
    }

    const updateScript = () => {

        if(props.scriptNo !== ""){
            document.getElementById(`USER_ID`).readOnly = true;
            document.getElementById(`USER_ID`).style.backgroundColor = '#f0f0f0';
            document.getElementById(`btn_check`).style.display = 'none';
            document.getElementById(`btn_in`).style.display = 'none';

            const res = props.scriptDetail.filter(it => it.user_id === props.scriptNo );

            const user_right = props.rightList.filter(it => it.user_id === res[0].user_id ).map(it => it.rtu_id);

            if(res.length > 0) {
                // 전화번호 분리
                let mobile = res[0].mobile ? res[0].mobile.split('-') : ['010', '', ''];
                let smart_mobile = res[0].smart_mobile ? res[0].smart_mobile.split('-') : ['010', '', ''];
                
                // 이메일 분리
                let email = res[0].email ? res[0].email.split('@') : ['', 'naver.com', ''];
                let emailParts = email.length > 1 ? email[1].split('/') : ['naver.com', ''];

                if(res[0].user_type !== "3"){
                    document.getElementById(`btn_right`).style.display = 'none';
                }else{
                    document.getElementById(`btn_right`).style.display = 'inline-block';
                }
                 
                setScriptObj({
                    area_code: res[0].area_code || "",
                    email1: email[0] || "",
                    email2: emailParts[0] || "naver.com",
                    email3: emailParts[1] || "",
                    is_permit: res[0].is_permit || "0",
                    menu_type: res[0].menu_type || "0",
                    mobile1: mobile[0] || "010",
                    mobile2: mobile[1] || "",
                    mobile3: mobile[2] || "",
                    organ_id: res[0].organ_id || "",
                    organ_name: res[0].organ_name || "",
                    reg_date: res[0].reg_date || "",
                    smart_mobile1: smart_mobile[0] || "010",
                    smart_mobile2: smart_mobile[1] || "",
                    smart_mobile3: smart_mobile[2] || "",
                    smart_use: res[0].smart_use || "0",
                    user_id: res[0].user_id || "",
                    user_name: res[0].user_name || "",
                    user_pwd: res[0].user_pwd || "",
                    user_pwd_re: "",
                    user_type: res[0].user_type || "",
                    rtu_ids: user_right
                });
            }
        }
    }

    const checkBtnClick = (e) => {
        console.log(scriptObj);

        const retrieveListURL = '/divas/set/actionIdCheck.do';
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
                    console.log(resp.result.idCheckResult);
                    if(resp.result.idCheckResult){
                        common_modal("success", "중복 체크", "사용 가능한 아이디입니다.", () => {});
                        setIdCheckResult(true);
                    }else{
                        common_modal("error", "중복 체크", "중복된 아이디입니다.", () => {});
                        setIdCheckResult(false);
                    }
                }
            },
            function (resp) {
                console.log("err response : ", resp);
            }
        );
    }

    const changeBtnClick = (e) => {
        let changeMode = e.target.getAttribute('data-change');
        let requestObj = {...scriptObj};
        requestObj.change_mode = changeMode;

        const msg = changeMode === "insert" ? "등록" : changeMode === "update" ? "수정" : "삭제";

        if(changeMode === "insert" && !idCheckResult){
            common_modal("error", "아이디 중복 체크", "아이디 중복체크를 진행해주세요.", () => {});
            return;
        }

        if(changeMode === "insert" && (!requestObj.user_type || requestObj.user_type === "")){
            common_modal("error", "사용자 구분 선택", "사용자 구분을 선택해주세요.", () => {});
            return;
        }

        // 이메일 조합
        if(requestObj.email1 && requestObj.email2) {
            requestObj.email = requestObj.email1 + '@' + requestObj.email2;
            if(requestObj.email3) {
                requestObj.email += '/' + requestObj.email3;
            }
        }
        
        // 전화번호 조합
        if(requestObj.mobile1 && requestObj.mobile2 && requestObj.mobile3) {
            requestObj.mobile = requestObj.mobile1 + '-' + requestObj.mobile2 + '-' + requestObj.mobile3;
        }
        
        if(requestObj.smart_mobile1 && requestObj.smart_mobile2 && requestObj.smart_mobile3) {
            requestObj.smart_mobile = requestObj.smart_mobile1 + '-' + requestObj.smart_mobile2 + '-' + requestObj.smart_mobile3;
        }

        // console.log(requestObj);
        const retrieveListURL = '/divas/set/actionChangeUser.do';
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(requestObj)
        }

        common_modal("confirm", `${msg} 확인`, `${msg} 하시겠습니까?`, () => {
            EgovNet.requestFetch(retrieveListURL,
                requestOptions,
            (resp) => {
                if(resp.resultCode === 200){
                    common_modal("success", `${msg} 완료`, `${msg} 되었습니다.`, () => {});
                    resetBtnClick();
                    props.reRoading();
                }
            },
            function (resp) {
                    console.log("err response : ", resp);
                }
            );
        });
    }

    const resetBtnClick = () => {
        setScriptObj({
            area_code: "",
            email1: "",
            email2: "naver.com",
            email3: "",
            is_permit: "0",
            menu_type: "0",
            mobile1: "010",
            mobile2: "",
            mobile3: "",
            organ_id: "",
            organ_name: "",
            reg_date: "",
            smart_mobile1: "010",
            smart_mobile2: "",
            smart_mobile3: "",
            smart_use: "0",
            user_id: "",
            user_name: "",
            user_pwd: "",
            user_pwd_re: "",
            user_type: "",
            rtu_ids: []
        });
        setCheckResult("");
        props.selectScriptNo("");
        document.getElementById(`USER_ID`).readOnly = false;
        document.getElementById(`USER_ID`).style.backgroundColor = '#ffffff';
        document.getElementById(`btn_check`).style.display = 'inline-block';
        document.getElementById(`btn_in`).style.display = 'inline-block';
        document.getElementById(`btn_right`).style.display = 'none';
    }

    const onChange = (e) => {
        console.log(e.target.value);
        const { value, name } = e.target; 
        setScriptObj({
            ...scriptObj, 
            [name]: value 
        });

        if(name === 'user_type'){
            if(value === "3"){
                document.getElementById(`btn_right`).style.display = 'inline-block';
            }else{
                document.getElementById(`btn_right`).style.display = 'none';
            }
        }
    }

    const onChangePwd = (e) => {
        console.log(e.target.value);
        const { value, name } = e.target; 
        
        setScriptObj({
            ...scriptObj, 
            [name]: value
        });
        
        // 비밀번호 확인 체크
        if(name === 'user_pwd_re') {
            if(scriptObj.user_pwd === value) {
                setCheckResult(<span style={{color: 'green'}}>비밀번호가 일치합니다.</span>);
            } else {
                setCheckResult(<span style={{color: 'red'}}>비밀번호가 일치하지 않습니다.</span>);
            }
        }
        
        console.log(scriptObj);
    }

    const rightBtnClick = () => {
        // 방송권한 지역선택 팝업 표시
        if (!props.rtuList || !props.rtuGroupList) {
            common_modal("error", "오류", "방송 지역 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.", () => {});
            return;
        }

        showBroadcastRtuPopup(
            props.rtuList, 
            props.rtuGroupList, 
            scriptObj.rtu_ids, 
            (selectedRtuIds) => {
                // 선택된 RTU ID들을 scriptObj에 저장
                setScriptObj({
                    ...scriptObj,
                    rtu_ids: selectedRtuIds
                });
                console.log("선택된 방송권한 지역:", selectedRtuIds);
            }
        );
    }
    
    useEffect(() => {
        settingOptions();
        return () => {
        }
    }, [props.option1]);

    useEffect(() => {
        updateScript();
        return () => {
        }
    }, [props.scriptNo]);

    console.log("------------------------------SetUserDetailContent [End]");
    console.groupEnd("SetUserDetailContent");

    return (
        <ul className="set_ulwrap_nh">
            <li className="tb_sms_gry">
                <span>설정값 입력</span>
            </li>
            <li className="li100_nor">
                <table className="set_tb">
                    <thead></thead>
                    <tbody>
                        <tr>
                            <td className="bg_lb w10 bold al_C bL0">소속기관</td>
                            <td colSpan={"3"}>
                                <select id="ORGAN_ID" name="organ_id" 
                                className="f333_12 jud_right" value={scriptObj.organ_id}
                                onChange={onChange}>
                                    {organTag}
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td className="bg_lb w10 bold al_C bL0">사용자 구분<img src="../images/icon_star_orange.png" alt="필수 항목"/></td>
                            <td colSpan={"3"}>
                                <select id="USER_TYPE" name="user_type" 
                                className="f333_12 jud_right" value={scriptObj.user_type}
                                onChange={onChange}>
                                    <option value="">사용자 구분</option>
                                    <option value="0">최상위 관리자</option>
                                    <option value="1">기관 관리자</option>
                                    <option value="3">일반 사용자</option>
                                </select>
                                <button type="button" id="btn_right" className="btn_lgs" onClick={rightBtnClick} style={{display: 'none'}}>방송권한 지역선택</button>
                            </td>
                        </tr>
                        <tr>
                            <td className="bg_lb w10 bold al_C bL0">사용자 ID<img src="../images/icon_star_orange.png" alt="필수 항목"/></td>
                            <td colSpan={"3"}>
                                <input
                                    id="USER_ID"
                                    name="user_id"
                                    type="text"
                                    className="f333_12"
                                    size={18}
                                    maxLength={15}
                                    value={scriptObj.user_id}
                                    onChange={onChange}
                                />
                                <button type="button" id="btn_check" className="btn_lgs"
                                    onClick={checkBtnClick}
                                >
                                    중복체크
                                </button>
                                <span> <i className="fa fa-exclamation-circle col_org mR5"></i><span className="spc">영어/숫자 포함 5~15자</span></span>
                            </td>
                        </tr>
                        <tr>
                            <td className="bg_lb w10 bold al_C bL0">비밀번호<img src="../images/icon_star_orange.png" alt="필수 항목"/></td>
                            <td colSpan={"3"}>
                                <input
                                    id="USER_PWD_LEN"
                                    name="user_pwd"
                                    type="password"
                                    className="f333_12"
                                    size={18}
                                    maxLength={20}
                                    value={scriptObj.user_pwd}
                                    onChange={onChangePwd}
                                />
                                <span> <i className="fa fa-exclamation-circle col_org mR5"></i>영어, 숫자, <span className="spc">특수문자(!@#$%^&*)</span>를 적어도 하나씩 사용해서 8자리 이상, 20자리 이하</span>
                            </td>
                        </tr>
                        <tr>
                            <td className="bg_lb w10 bold al_C bL0">비밀번호 확인<img src="../images/icon_star_orange.png" alt="필수 항목"/></td>
                            <td colSpan={"3"}>
                                <input
                                    id="USER_PWD_RE"
                                    name="user_pwd_re"
                                    type="password"
                                    className="f333_12"
                                    size={18}
                                    maxLength={20}
                                    value={scriptObj.user_pwd_re}
                                    onChange={onChangePwd}
                                />
                                <span id="checkResult">{checkResult}</span>
                            </td>
                        </tr>
                        <tr>
                            <td className="bg_lb w10 bold al_C bL0">사용자명<img src="../images/icon_star_orange.png" alt="필수 항목"/></td>
                            <td colSpan={"3"}>
                                <input
                                    id="USER_NAME"
                                    name="user_name"
                                    type="text"
                                    className="f333_12"
                                    size={18}
                                    maxLength={10}
                                    value={scriptObj.user_name}
                                    onChange={onChange}
                                />
                                <span> <i className="fa fa-exclamation-circle col_org mR5"></i>한글, 영어, 숫자 1~10자</span>
                            </td>
                        </tr>
                        <tr>
                            <td height={35} className="bg_lb w10 bold al_C bL0">이메일</td>
                            <td colSpan={"3"}>
                                <input id="EMAIL1" name="email1" type="text" className="f333_12 preventFloatInput" 
                                    size={10} maxLength={64} value={scriptObj.email1} onChange={onChange} /> @ 
                                <select id="EMAIL2" name="email2" className="f333_12" 
                                    value={scriptObj.email2} onChange={onChange}>
                                    <option value="naver.com">naver.com</option>
                                    <option value="hanmail.net">hanmail.net</option>
                                    <option value="daum.net">daum.net</option>
                                    <option value="nate.com">nate.com</option>
                                    <option value="gmail.com">gmail.com</option>
                                    <option value="0">직접입력</option>
                                </select> / 
                                <input id="EMAIL3" name="email3" type="text" className="f333_12 preventFloatInput" 
                                    size={32} maxLength={255} value={scriptObj.email3} onChange={onChange} />
                                <span> <i className="fa fa-exclamation-circle col_org mR5"></i>( 예 : abcd123@naver.com )</span>
                            </td>
                        </tr>
                        <tr>
                            <td className="bg_lb w10 bold al_C bL0">휴대폰 번호 (SMS)<img className="alarm_use" src="../images/icon_star_orange.png" alt="필수 항목"/></td>
                            <td className="w400p">
                                <select id="MOBILE1" name="mobile1" size={1} className="f333_12"
                                    value={scriptObj.mobile1} onChange={onChange}>
                                    <option value="010">010</option>
                                    <option value="355">355</option>
                                </select>
                                -
                                <input
                                    id="MOBILE2"
                                    name="mobile2"
                                    type="text"
                                    className="f333_12"
                                    size={6}
                                    maxLength={4}
                                    value={scriptObj.mobile2}
                                    onChange={onChange}
                                />
                                -
                                <input
                                    id="MOBILE3"
                                    name="mobile3"
                                    type="text"
                                    className="f333_12"
                                    size={6}
                                    maxLength={4}
                                    value={scriptObj.mobile3}
                                    onChange={onChange}
                                />
                                <span> <i className="fa fa-exclamation-circle col_org mR5"></i>( 예 : 010-0000-0000 )</span>
                            </td>
                            <td className="bg_lb w10 bold al_C">문자 알림<br/>(장비 상태)</td>
                            <td>
                                <select id="IS_PERMIT" name="is_permit" className="f333_12"
                                    value={scriptObj.is_permit}
                                    onChange={onChange}
                                >
                                    <option value="0">미알림</option>
                                    <option value="1">알림</option>
                                </select>
                                <span className="alarm_use"> <i className="fa fa-exclamation-circle col_org mR5"></i>휴대폰 번호를 입력해야 합니다!</span>
                            </td>
                        </tr>
                        <tr>
                            <td className="bg_lb w10 bold al_C bL0">휴대폰 번호 (APP)</td>
                            <td>
                                <select id="SMART_MOBILE1" name="smart_mobile1" size={1} className="gaigi12"
                                    value={scriptObj.smart_mobile1} onChange={onChange}>
                                    <option value="010">010</option>
                                    <option value="355">355</option>
                                </select>
                                -
                                <input
                                    id="SMART_MOBILE2"
                                    name="smart_mobile2"
                                    type="text"
                                    className="f333_12"
                                    size={6}
                                    maxLength={4}
                                    value={scriptObj.smart_mobile2}
                                    onChange={onChange}
                                />
                                -
                                <input
                                    id="SMART_MOBILE3"
                                    name="smart_mobile3"
                                    type="text"
                                    className="f333_12"
                                    size={6}
                                    maxLength={4}
                                    value={scriptObj.smart_mobile3}
                                    onChange={onChange}
                                />
                                <span> <i className="fa fa-exclamation-circle col_org mR5"></i>( 예 : 010-0000-0000 )</span>
                            </td>
                            <td className="bg_lb w10 bold al_C">어플 접속 승인</td>
                            <td>
                                <select id="SMART_USE" name="smart_use" size={1} className="f333_12 jud_right"
                                    value={scriptObj.smart_use}
                                    onChange={onChange}
                                >
                                    <option value="0">미승인</option>
                                    <option value="1">승인</option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </li>
            <li className="tb_sms_gry">
                <span className="sel_center_n">
                    <button type="button" id="btn_in" className="btn_bb80"
                        onClick={changeBtnClick} data-change={"insert"}>등록</button>
                    <button type="button" id="btn_re" className="btn_lbb80_s"
                        onClick={resetBtnClick}>초기화</button>
                    <button type="button" id="btn_up" className="btn_lbb80_s"
                        onClick={changeBtnClick} data-change={"update"}>수정</button>
                    <button type="button" id="btn_de" className="btn_lbb80_s"
                        onClick={changeBtnClick} data-change={"delete"}>삭제</button>
                </span>
            </li>
        </ul>
    );
}

export default SetUserDetail;