import React, { useState, useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import * as EgovNet from 'context/egovFetch';
import { common_modal, showAreaPopup } from 'js/common';
import dayjs from 'dayjs';

// import * as _ from 'lodash';
// import URL from 'context/url';

function SetEquipDetail(props) {

    console.group("SetEquipDetailContent");
    console.log("[Start] SetEquipDetailContent ------------------------------");
    console.log("SetEquipDetailContent [props] : ", props);

    const history = useHistory();
    const location = useLocation();

    const [organTag, setOrganTag] = useState([]);
    const [lineTag, setLineTag] = useState([]);
    const [modelTag, setModelTag] = useState([]);
    const [hourOptions, setHourOptions] = useState([]);
    const [minuteOptions, setMinuteOptions] = useState([]);
    const timeout = useRef(null);
    const [commonVO, setCommonVO] = useState(history.location.state?.commonVO || {});

    const [scriptObj, setScriptObj] = useState({
        rtu_id: "",
        signal_id: "",
        area_code: "",
        rtu_name: "",
        rtu_type: "",
        line_no: "",
        model_no: "",
        organ_id: "",
        sort_flag: "0",
        connection_info: "",
        call_last_d: dayjs().format('YYYY-MM-DD'),
        call_last_h: "00",
        call_last_m: "00",
        data_type: "자동설정",
        reg_date_d: dayjs().format('YYYY-MM-DD'),
        reg_date_h: "00",
        reg_date_m: "00",
        broadcast_setting: "1"
    });

    const settingOptions = () => {
        // 시간 옵션 생성 (0-23)
        let hours = [];
        for(let i = 0; i < 24; i++) {
            let hour = i < 10 ? '0' + i : i.toString();
            hours.push(<option key={hour} value={hour}>{hour}</option>);
        }
        setHourOptions(hours);

        // 분 옵션 생성 (0-59)
        let minutes = [];
        for(let i = 0; i < 60; i++) {
            let minute = i < 10 ? '0' + i : i.toString();
            minutes.push(<option key={minute} value={minute}>{minute}</option>);
        }
        setMinuteOptions(minutes);
    }

    const updateScript = () => {
        if(props.scriptNo !== ""){
            const res = props.scriptDetail.filter(it => it.rtu_id === props.scriptNo);
            console.log("res : ", res);
            if(res.length > 0) {
                setScriptObj({
                    rtu_id: res[0].rtu_id || "",
                    signal_id: res[0].signal_id || "",
                    area_code: res[0].area_code || "",
                    rtu_name: res[0].rtu_name || "",
                    rtu_type: res[0].rtu_type || "",
                    line_no: res[0].line_no === 0 ? 0 : res[0].line_no || "",
                    model_no: res[0].model_no === 0 ? 0 : res[0].model_no || "",
                    organ_id: res[0].organ_id || "",
                    sort_flag: res[0].sort_flag || "0",
                    connection_info: res[0].decryt_con_info || "",
                    call_last_d: res[0].call_last ? dayjs(res[0].call_last).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
                    call_last_h: res[0].call_last ? dayjs(res[0].call_last).format('HH') : "00",
                    call_last_m: res[0].call_last ? dayjs(res[0].call_last).format('mm') : "00",
                    data_type: "자동설정",
                    reg_date_d: res[0].reg_date ? dayjs(res[0].reg_date).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
                    reg_date_h: res[0].reg_date ? dayjs(res[0].reg_date).format('HH') : "00",
                    reg_date_m: res[0].reg_date ? dayjs(res[0].reg_date).format('mm') : "00",
                    broadcast_setting: res[0].broadcast_setting || "1"
                });
            }
        }
    }

    const areaBtnClick = (e) => {
        // console.log("행정구역 조회 버튼 클릭");
        showAreaPopup(commonVO, (selectedArea) => {
            setScriptObj({
                ...scriptObj,
                area_code: selectedArea.area_code,
            });
        });
    }

    const checkBtnClick = (e) => {
        
        if(!scriptObj.rtu_id) {
            common_modal("error", "중복 체크", "장비 ID를 입력해주세요.", () => {});
            return;
        }

        if(!scriptObj.area_code) {
            common_modal("error", "중복 체크", "행정 코드를 입력해주세요.", () => {});
            return;
        }

        const retrieveListURL = '/divas/set/actionAreaCodeCheck.do';
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({rtu_id: scriptObj.rtu_id, area_code: scriptObj.area_code})
        }

        EgovNet.requestFetch(retrieveListURL,
            requestOptions,
            (resp) => {
                if(resp.resultCode === 200){
                    if(resp.result.checkResult){
                        common_modal("success", "중복 체크", "사용 가능한 장비 ID입니다.", () => {});
                    }else{
                        common_modal("error", "중복 체크", "중복된 장비 ID입니다.", () => {});
                    }
                }
            },
            function (resp) {
                console.log("err response : ", resp);
            }
        );
    }

    const changeBtnClick = (e) => {
        const changeMode = e.target.getAttribute('data-change');
        let requestObj = {...scriptObj};
        requestObj.change_mode = changeMode;

        const msg = changeMode === "insert" ? "등록" : changeMode === "update" ? "수정" : "삭제";

        // 필수 입력 체크
        if(changeMode === "insert") {
            if(!requestObj.rtu_id) {
                common_modal("error", "입력 확인", "장비 ID를 입력해주세요.", () => {});
                return;
            }
            if(!requestObj.signal_id) {
                common_modal("error", "입력 확인", "통신 ID를 입력해주세요.", () => {});
                return;
            }
            if(!requestObj.area_code) {
                common_modal("error", "입력 확인", "행정 코드를 입력해주세요.", () => {});
                return;
            }
            if(!requestObj.rtu_name) {
                common_modal("error", "입력 확인", "장비명을 입력해주세요.", () => {});
                return;
            }
            if(!requestObj.rtu_type) {
                common_modal("error", "입력 확인", "장비 구분을 선택해주세요.", () => {});
                return;
            }
            if(requestObj.line_no !== 0 && !requestObj.line_no) {
                common_modal("error", "입력 확인", "회선을 선택해주세요.", () => {});
                return;
            }
            if(requestObj.model_no !== 0 && !requestObj.model_no) {
                common_modal("error", "입력 확인", "모델을 선택해주세요.", () => {});
                return;
            }
            if(!requestObj.organ_id) {
                common_modal("error", "입력 확인", "소속 기관을 선택해주세요.", () => {});
                return;
            }
        }

        // 날짜/시간 조합
        if(requestObj.call_last_d && requestObj.call_last_h && requestObj.call_last_m) {
            requestObj.call_last = `${requestObj.call_last_d} ${requestObj.call_last_h}:${requestObj.call_last_m}:00`;
        }
        
        if(requestObj.reg_date_d && requestObj.reg_date_h && requestObj.reg_date_m) {
            requestObj.reg_date = `${requestObj.reg_date_d} ${requestObj.reg_date_h}:${requestObj.reg_date_m}:00`;
        }

        console.log(requestObj);

        const retrieveListURL = '/divas/set/actionChangeEquip.do';
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
            rtu_id: "",
            signal_id: "",
            area_code: "",
            rtu_name: "",
            rtu_type: "",
            line_no: "",
            model_no: "",
            organ_id: "",
            sort_flag: "0",
            connection_info: "",
            call_last_d: dayjs().format('YYYY-MM-DD'),
            call_last_h: "00",
            call_last_m: "00",
            data_type: "자동설정",
            reg_date_d: dayjs().format('YYYY-MM-DD'),
            reg_date_h: "00",
            reg_date_m: "00",
            broadcast_setting: "1"
        });
        if (props.selectScriptNo) {
            props.selectScriptNo("");
        }
    }

    const onChange = (e) => {
        console.log(e.target.value);
        const { value, name } = e.target; 
        setScriptObj({
            ...scriptObj, 
            [name]: value 
        });
    }

    useEffect(() => {
        settingOptions();
        return () => {
        }
    }, []);

    useEffect(() => {
        updateScript();
        return () => {
        }
    }, [props.scriptNo]);

    console.log("------------------------------SetEquipDetailContent [End]");
    console.groupEnd("SetEquipDetailContent");

    return (
        <ul className="set_ulwrap_nh">
            <li className="tb_sms_gry">
                <span>설정값 입력</span>
            </li>
            <li className="li100_nor">
                <table className="set_tb">
                    <tbody>
                        <tr>
                            <td className="bg_lb w10 bold al_C bL0">장비 ID<img src="../images/icon_star_orange.png" alt="필수 항목"/></td>
                            <td className="w20">
                                <input type="text" id="RTU_ID" name="rtu_id" className="f333_12 preventFloatInput" 
                                    size="10" value={scriptObj.rtu_id} onChange={onChange} 
                                    placeholder="예) 1~9999" />
                            </td>
                            <td className="bg_lb w10 bold al_C">통신 ID<img src="../images/icon_star_orange.png" alt="필수 항목"/></td>
                            <td>
                                <input type="text" id="SIGNAL_ID" name="signal_id" className="f333_12 preventFloatInput" 
                                    size="10" value={scriptObj.signal_id} onChange={onChange} 
                                    placeholder="예) 1~9999" />
                            </td>
                            <td className="bg_lb w10 bold al_C">행정 코드<img src="../images/icon_star_orange.png" alt="필수 항목"/></td>
                            <td colSpan="3">
                                <input type="text" id="AREA_CODE" name="area_code" className="f333_12" 
                                    size="12" maxLength="10" value={scriptObj.area_code} onChange={onChange} />
                                <button type="button" id="btn_area" className="btn_lgs" onClick={areaBtnClick}>행정구역 조회</button>
                                <button type="button" id="btn_check" className="btn_lgs" onClick={checkBtnClick}>중복체크</button>
                            </td>
                        </tr>
                        <tr>
                            <td className="bg_lb w10 bold al_C bL0">장비명<img src="../images/icon_star_orange.png" alt="필수 항목"/></td>
                            <td>
                                <input type="text" id="RTU_NAME" name="rtu_name" className="f333_12" 
                                    size="22" maxLength="15" value={scriptObj.rtu_name} onChange={onChange} 
                                    placeholder="예) 1~15자리" />
                            </td>
                            <td className="bg_lb w10 bold al_C">장비 구분<img src="../images/icon_star_orange.png" alt="필수 항목"/></td>
                            <td>
                                <select id="RTU_TYPE" name="rtu_type" className="f333_12" 
                                    value={scriptObj.rtu_type} onChange={onChange}>
                                    <option value="">장비구분 선택</option>
                                    <option value="B00">방송(단독)</option>
                                    <option value="BR0">방송(우량)</option>
                                    <option value="BF0">방송(수위)</option>
                                    <option value="BA0">방송(우+수)</option>
                                    <option value="BAR">방송(우+수+유)</option>
                                    <option value="R00">강우계</option>
                                    <option value="F00">수위계</option>
                                    <option value="DP0">변위계</option>
                                    <option value="RF0">강우수위계</option>
                                    <option value="A00">AWS</option>
                                    <option value="S00">적설계</option>
                                </select>
                            </td>
                            <td className="bg_lb w10 bold al_C">회선 / 모델<img src="../images/icon_star_orange.png" alt="필수 항목"/></td>
                            <td>
                                <select id="LINE_NO" name="line_no" className="f333_12" 
                                    value={scriptObj.line_no} onChange={onChange}>
                                    <option value="">회선 선택</option>
                                    {props.lineList.map((line, index) => (
                                        <option key={index} value={line.line_no}>{line.line_name}</option>
                                    ))}
                                </select>
                                /
                                <select id="MODEL_NO" name="model_no" className="f333_12" 
                                    value={scriptObj.model_no} onChange={onChange}>
                                    <option value="">모델 선택</option>
                                    {props.modelList.map((model, index) => (
                                        <option key={index} value={model.model_no}>{model.model_name}</option>
                                    ))}
                                </select>
                            </td>
                            <td className="bg_lb w10 bold al_C" style={{display: 'none'}}>크로샷 전화 방송</td>
                            <td style={{display: 'none'}}>
                                <select id="BROADCAST_SETTING" name="broadcast_setting" className="f333_12" 
                                    value={scriptObj.broadcast_setting} onChange={onChange}>
                                    <option value="1">미사용</option>
                                    <option value="3">사용</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td className="bg_lb w10 bold al_C bL0">소속 기관<img src="../images/icon_star_orange.png" alt="필수 항목"/></td>
                            <td>
                                <select id="ORGAN_ID" name="organ_id" className="f333_12" 
                                    value={scriptObj.organ_id} onChange={onChange}>
                                    <option value="">기관 선택</option>
                                    {props.organListTag}
                                </select>
                            </td>
                            <td className="bg_lb w10 bold al_C">지역 정렬 번호</td>
                            <td>
                                <input id="SORT_FLAG" name="sort_flag" type="text" className="f333_12 preventFloatInput" 
                                    size="6" value={scriptObj.sort_flag} onChange={onChange} />
                            </td>
                            <td className="bg_lb w10 bold al_C">통신정보</td>
                            <td colSpan="3">
                                <input type="text" id="CONNECTION_INFO" name="connection_info" className="f333_12" 
                                    size="20" maxLength="13" value={scriptObj.connection_info} onChange={onChange} 
                                    placeholder="예) 012-****-****" />
                            </td>
                        </tr>
                        <tr>
                            <td className="bg_lb w10 bold al_C bL0">최종 호출시각</td>
                            <td>
                                <input type="text" id="CALL_LAST_D" name="call_last_d" 
                                    value={scriptObj.call_last_d} className="f333_12" size="7" readOnly /> 
                                <select id="CALL_LAST_H" name="call_last_h" className="f333_12" 
                                    value={scriptObj.call_last_h} onChange={onChange}>
                                    {hourOptions}
                                </select>시 
                                <select id="CALL_LAST_M" name="call_last_m" className="f333_12" 
                                    value={scriptObj.call_last_m} onChange={onChange}>
                                    {minuteOptions}
                                </select>분
                            </td>
                            <td className="bg_lb w10 bold al_C">자료 타입</td>
                            <td>
                                <span id="DATA_TYPE" style={{width: '100%', paddingLeft: '2%'}}>자동설정</span>
                            </td>
                            <td className="bg_lb w10 bold al_C">장비 설치일</td>
                            <td colSpan="3">
                                <input type="text" id="REG_DATE_D" name="reg_date_d" 
                                    value={scriptObj.reg_date_d} className="f333_12" size="7" readOnly /> 
                                <select id="REG_DATE_H" name="reg_date_h" className="f333_12" 
                                    value={scriptObj.reg_date_h} onChange={onChange}>
                                    {hourOptions}
                                </select>시 
                                <select id="REG_DATE_M" name="reg_date_m" className="f333_12" 
                                    value={scriptObj.reg_date_m} onChange={onChange}>
                                    {minuteOptions}
                                </select>분
                            </td>
                        </tr>
                    </tbody>
                </table>
            </li>
            <li className="tb_sms_gry">
                <span className="sel_center_n">
                    <button type="button" id="btn_in" className="btn_bb80"
                        onClick={changeBtnClick} data-change="insert">등록</button>
                    <button type="button" id="btn_re" className="btn_lbb80_s"
                        onClick={resetBtnClick}>초기화</button>
                    <button type="button" id="btn_up" className="btn_lbb80_s"
                        onClick={changeBtnClick} data-change="update">수정</button>
                    <button type="button" id="btn_de" className="btn_lbb80_s"
                        onClick={changeBtnClick} data-change="delete">삭제</button>
                </span>
            </li>
        </ul>
    );
}

export default SetEquipDetail;