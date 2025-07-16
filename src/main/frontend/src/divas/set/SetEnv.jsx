import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import * as EgovNet from 'context/egovFetch';
import URL from 'context/url';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { common_modal, showAreaPopup } from 'js/common';

function SetEnv(props) {

    console.group("SetEnvContent");
    console.log("[Start] SetEnvContent ------------------------------");
    console.log("SetEnvContent [props] : ", props);

    const history = useHistory();

    const [reload, setLoadState] = useState(false);
    const [organizationList, setOrganizationList] = useState([]);
    const [originList, setOriginList] = useState([]);
    
    // 운영 설정 상태
    const [operationSettings, setOperationSettings] = useState({
        top_img: '',
        top_title: '',
        vm_port: '24',
        dtm_menu_level: '1',
        recaptcha: '2'
    });
    
    // 선택된 파일 객체 저장
    const [selectedFile, setSelectedFile] = useState(null);
    
    // 기관 설정 상태
    const [orgSearch, setOrgSearch] = useState({
        search_col: '0',
        search_word: ''
    });
    
    const [selectedOrg, setSelectedOrg] = useState({
        organ_id: '',
        organ_name: '',
        department: '',
        area_code: '',
        area_main: '',
        area_sub: '',
        sort_base: '2'
    });
    
    // console.log(history.location.state);

    const [commonVO, setCommonVO] = useState(history.location.state?.commonVO || {});

    // 초기 데이터 로드
    const retrieveList = () => {
        const retrieveListURL = '/divas/set/actionEnv.do';
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(commonVO)
        }

        EgovNet.requestFetch(retrieveListURL,
            requestOptions,
            (resp) => {
                // console.log("result = ", resp);
                if (resp.organList) {
                    // 기관 목록 설정
                    if (resp.organList) {
                        setOrganizationList(resp.organList || []);
                        setOriginList(resp.organList || []);
                    }
                    
                    // 메뉴 목록 설정
                    if (commonVO &&resp.inMenuList) {
                        const dtm_menu_list = resp.inMenuList.filter(menu => menu.menu_idx === 4);
                        const dtm_menu_level = Math.max(...dtm_menu_list.map(menu => menu.menu_level));
                        setOperationSettings({
                            ...commonVO,
                            dtm_menu_level: dtm_menu_level
                        });
                    }
                }
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

    const reRoading = () => {
        setLoadState(!reload);
    }

    // 운영 설정 저장
    const saveOperationSettings = () => {
        const formData = new FormData();
        
        // 파일이 선택된 경우에만 추가
        if (selectedFile) {
            formData.append('file', selectedFile);
        }
        
        // 다른 데이터들도 FormData에 추가
        formData.append('set_idx', commonVO.set_idx);
        formData.append('top_title', operationSettings.top_title);
        formData.append('vm_port', operationSettings.vm_port);
        formData.append('dtm_menu_level', operationSettings.dtm_menu_level);
        formData.append('recaptcha', operationSettings.recaptcha);
        
        const saveURL = '/divas/set/saveEnv.do';
        const requestOptions = {
            method: "POST",
            // multipart/form-data 요청시 Content-Type 헤더를 설정하지 않음 (브라우저가 자동으로 boundary 포함해서 설정)
            body: formData
        }

        common_modal("confirm", "운영설정 저장확인", "운영 설정을 저장하시겠습니까?", () => {
            EgovNet.requestFetch(saveURL,
                requestOptions,
                (resp) => {
                    common_modal("success", "운영설정 저장성공", "운영 설정이 저장되었습니다.");
                    history.location.state.commonVO = {
                        ...commonVO,
                        ...operationSettings
                    };
                },
                function (resp) {
                    console.log("err response : ", resp);
                    common_modal("error", "운영설정 저장오류", "저장 중 오류가 발생했습니다.");
                }
            );
        }).then(() => {
            reRoading();
        });
    }

    // 기관 검색
    const searchOrganizations = () => {
        switch (orgSearch.search_col) {
            case '0':
                setOrganizationList(originList.filter(org => org.organ_name.includes(orgSearch.search_word)));
                break;
            case '1':
                setOrganizationList(originList.filter(org => org.department.includes(orgSearch.search_word)));
                break;
            case '2':
                setOrganizationList(originList.filter(org => org.area_code.includes(orgSearch.search_word)));
                break;
            default:
                setOrganizationList(originList);
        }
    }

    // 전체 목록 조회
    const searchAllOrganizations = () => {
        setOrgSearch({ search_col: '0', search_word: '' });
        reRoading();
    }

    // 기관 선택
    const selectOrganization = (org) => {
        setSelectedOrg(org);
        document.querySelectorAll('tr').forEach(tr => tr.classList.remove('selected'));
        document.getElementById(`list_${org.organ_id}`).classList.add('selected');
        document.getElementById(`btn_in`).style.display = 'none';
    }

    // 기관 등록/수정
    const saveOrganization = (type) => {
        if (!selectedOrg.organ_name || !selectedOrg.department || !selectedOrg.area_code) {
            common_modal("error", "기관 등록/수정 오류", "필수 항목을 모두 입력해주세요.");
            return;
        }
        
        if (type === 'insert') {
            selectedOrg.change_mode = 'insert';
        } else {
            selectedOrg.change_mode = 'update';
        }

        const saveURL = '/divas/set/actionChangeOrgan.do';
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(selectedOrg)
        }

        common_modal("confirm", `기관 ${type === 'update' ? '수정' : '등록'} 확인` , `${type === 'update' ? '수정' : '등록'} 하시겠습니까?`, () => {
            EgovNet.requestFetch(saveURL,
                requestOptions,
                (resp) => {
                common_modal("success", type === 'update' ? "수정되었습니다." : "등록되었습니다.");
                resetOrganizationForm();
                reRoading();
            },
            function (resp) {
                console.log("err response : ", resp);
                common_modal("error", "기관 등록/수정 오류", "저장 중 오류가 발생했습니다.");
            });
        });
    }

    // 기관 삭제
    const deleteOrganization = () => {
        if (!selectedOrg.organ_id) {
            common_modal("error", "기관 삭제 오류", "삭제할 기관을 선택해주세요.");
            return;
        }

        const deleteURL = '/divas/set/actionChangeOrgan.do';
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ organ_id: selectedOrg.organ_id, change_mode: 'delete' })
        }

        common_modal("confirm", "기관 삭제 확인", "기관을 삭제하시겠습니까?", () => {
            EgovNet.requestFetch(deleteURL,
                requestOptions,
                (resp) => {
                common_modal("success", "기관 삭제 성공", "삭제되었습니다.");
                resetOrganizationForm();
                reRoading();
            },
            function (resp) {
                console.log("err response : ", resp);
                common_modal("error", "기관 삭제 오류", "삭제 중 오류가 발생했습니다.");
            });
        });
    }

    // 기관 폼 초기화
    const resetOrganizationForm = () => {
        setSelectedOrg({
            organ_id: '',
            organ_name: '',
            department: '',
            area_code: '',
            sort_base: '2'
        });
        document.querySelectorAll('tr').forEach(tr => tr.classList.remove('selected'));
        document.getElementById(`btn_in`).style.display = 'inline-block';
    }

    // 파일 선택
    const handleFileSelect = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.jpg,.jpeg,.png';
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                // 파일 크기 체크 (5MB)
                if (file.size > 5 * 1024 * 1024) {
                    common_modal("error", "파일 업로드 오류", "파일 크기는 5MB 이하여야 합니다.");
                    return;
                }
                
                // 파일 객체 저장
                setSelectedFile(file);
                
                // UI에 파일명 표시
                setOperationSettings({
                    ...operationSettings,
                    top_img: file.name
                });
            }
        };
        fileInput.click();
    }

    // 행정구역 조회
    const showAreaPopupHandler = () => {
        showAreaPopup(commonVO, (selectedArea) => {
            setSelectedOrg({
                ...selectedOrg,
                area_code: selectedArea.area_code,
                area_main: selectedArea.area_main,
                area_sub: selectedArea.area_sub
            });
        });
    }

    const getSortBaseName = (sort_base) => {
        switch (sort_base) {
            case '0': return '지역 정렬번호';
            case '1': return '행정코드';
            case '2': return '장비이름';
            default: return '';
        }
    }

    // 입력값 변경 핸들러
    const handleOperationChange = (e) => {
        const { name, value } = e.target;
        setOperationSettings({
            ...operationSettings,
            [name]: value
        });
    }

    const handleOrgSearchChange = (e) => {
        const { name, value } = e.target;
        setOrgSearch({
            ...orgSearch,
            [name]: value
        });
    }

    const handleOrgChange = (e) => {
        const { name, value } = e.target;
        setSelectedOrg({
            ...selectedOrg,
            [name]: value
        });
    }

    console.log("------------------------------SetEnvContent [End]");
    console.groupEnd("SetEnvContent");

    return (
        <div id="content">
            <form id="set_frm">
                <input type="hidden" id="organ_id" name="organ_id" value={selectedOrg.organ_id} />
                <input type="hidden" id="area_main" name="area_main" value={selectedOrg.area_main} />
                <input type="hidden" id="area_sub" name="area_sub" value={selectedOrg.area_sub} />

                <div className="main_contitle">
                    <img src="../images/title_06_12.png" alt="시스템 설정" />
                </div>

                {/* 운영 설정 */}
                <div className="sub_contitle">
                    <span style={{color: '#4d6fd5'}}>운영</span> 
                    <span style={{color: '#505050'}}>설정</span>
                    <button type="button" id="btn_save2" className="btn_bb80 mL20" onClick={saveOperationSettings}>저장</button>
                </div>
                <div className="right_bg">
                    <ul className="set_ulwrap_nh">
                        <li className="li100_nor">
                            <table className="set_tb">
                                <tbody>
                                    <tr className="hh">
                                        <td className="bg_lb w7 bold al_C bL_1gry_n">상단바 로고</td>
                                        <td>
                                            <span style={{display: 'flex', alignItems: 'center'}}>
                                                <input type="text" id="top_img_sel" name="top_img_sel" 
                                                    className="f333_12 pointer" size="14" 
                                                    value={operationSettings.top_img} readOnly />
                                                <img id="file_click" 
                                                    style={{cursor:'pointer'}} 
                                                    src="../images/file_icon.png" 
                                                    onClick={handleFileSelect} alt="파일 선택" />
                                                <span>
                                                <ExclamationCircleFilled 
                                                    style={{color: "#f9781f", fontSize: "14px", margin: "5px 3px 0 8px"}} /> 
                                                    <span className="spc1">권장사이즈 :100x60px, 5MB 이하, jpeg/png만 가능</span>
                                                </span>
                                            </span>
                                        </td>
                                        <td className="bg_lb w7 bold al_C">상단바 타이틀</td>
                                        <td>
                                            <input type="text" id="top_title" name="top_title" 
                                                className="f333_12" size="20" maxLength="12" 
                                                value={operationSettings.top_title}
                                                onChange={handleOperationChange} />
                                            <span>
                                                <ExclamationCircleFilled 
                                                    style={{color: "#f9781f", fontSize: "14px", margin: "5px 3px 0 8px"}} /> 
                                                <span className="spc1">
                                                    최대 12자 (공백포함)
                                                </span>
                                            </span>
                                        </td>
                                        <td className="bg_lb w7 bold al_C">로그아웃 시간</td>
                                        <td>
                                            <select id="logout_time" name="vm_port" className="f333_12" 
                                                value={operationSettings.vm_port} onChange={handleOperationChange}>
                                                <option value="1">1시간</option>
                                                <option value="12">12시간</option>
                                                <option value="24">24시간</option>
                                                <option value="48">48시간</option>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr className="hh">
                                        <td className="bg_lb w7 bold al_C bL_1gry_n">자료관리 메뉴</td>
                                        <td> 권한 설정 : 
                                            <select name="dtm_menu_level" className="abr_level"
                                                value={operationSettings.dtm_menu_level} onChange={handleOperationChange}>
                                                <option value="1">최상위관리자</option>
                                                <option value="2">기관관리자</option>
                                                <option value="4">일반사용자</option>
                                            </select> 부터 사용
                                        </td>
                                        <td className="bg_lb w7 bold al_C">로그인 리캡차</td>
                                        <td colSpan="3">
                                            <select id="recaptcha" name="recaptcha" className="f333_12"
                                                value={operationSettings.recaptcha} onChange={handleOperationChange}>
                                                <option value="2">사용</option>
                                                <option value="0">미사용</option>
                                            </select>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </li>
                    </ul>
                </div>

                {/* 기관 설정 */}
                <div className="sub_contitle">
                    <span style={{color: '#4d6fd5'}}>기관</span> 
                    <span style={{color: '#505050'}}>설정</span>
                    <div className="unit">※ 항목을 클릭하면 설정값을 확인 및 수정할 수 있습니다.</div>
                </div>
                <div className="right_bg">
                    <ul className="set_ulwrap_nh">
                        <li className="tb_sms_gry">
                            <span className="sel_left_n"> 
                                기관 목록 조회 : 
                                <select id="search_col" name="search_col" className="f333_12"
                                    value={orgSearch.search_col} onChange={handleOrgSearchChange}>
                                    <option value="0">기관명</option>
                                    <option value="1">부서명</option>
                                    <option value="2">행정코드</option>
                                </select>
                                &nbsp; 
                                <input type="text" id="search_word" name="search_word" className="f333_12" 
                                    size="60" value={orgSearch.search_word} onChange={handleOrgSearchChange} />
                                &nbsp;&nbsp;
                                <button type="button" id="btn_search" className="btn_bs" onClick={searchOrganizations}>조회</button>
                                <button type="button" id="btn_search_all" className="btn_lbs" onClick={searchAllOrganizations}>전체목록</button>
                            </span> 
                        </li>
                        <li className="li100_nor">
                            <table id="list_table" className="tb_data">
                                <thead className="tb_data_tbg">
                                    <tr>
                                        <th className="li5">ID</th>
                                        <th className="li15 bL_1gry">기관명</th>
                                        <th className="li15 bL_1gry">부서명</th>
                                        <th className="li20 bL_1gry">행정코드</th>
                                        <th className="li20 bL_1gry">행정구역</th>
                                        <th className="li15 bL_1gry">정렬기준</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {organizationList.length > 0 ? (
                                        organizationList.map((org, index) => (
                                            <tr key={org.organ_id} id={`list_${org.organ_id}`} 
                                                className="pointer" onClick={() => selectOrganization(org)}>
                                                <td className="li5">{org.organ_id}</td>
                                                <td className="li15 bL_1gry">{org.organ_name}</td>
                                                <td className="li15 bL_1gry">{org.department}</td>
                                                <td className="li20 bL_1gry">{org.area_code}</td>
                                                <td className="li20 bL_1gry">{org.area_main + ' ' + org.area_sub}</td>
                                                <td className="li15 bL_1gry">{getSortBaseName(org.sort_base)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="no_data">검색된 결과가 없습니다.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </li>
                    </ul>
                    <ul className="set_ulwrap_nh">
                        <li className="tb_sms_gry">
                            <span>설정값 입력</span> 
                        </li>
                        <li className="li100_nor">
                            <table className="set_tb">
                                <tbody>
                                    <tr>
                                        <td className="bg_lb w10 bold al_C bL_1gry_n">
                                            기관명<img src="../images/icon_star_orange.png" alt="필수 항목"/>
                                        </td>
                                        <td>
                                            <input type="text" id="organ_name" name="organ_name" className="f333_12" 
                                                size="20" maxLength="20" value={selectedOrg.organ_name} onChange={handleOrgChange} />
                                            <span>
                                                <ExclamationCircleFilled 
                                                    style={{color: "#f9781f", fontSize: "14px", margin: "5px 3px 0 8px"}} /> 
                                                <span className="spc1">최대 20자 (공백포함)</span>
                                            </span>
                                        </td>
                                        <td className="bg_lb w10 bold al_C">
                                            부서명<img src="../images/icon_star_orange.png" alt="필수 항목"/>
                                        </td>
                                        <td>
                                            <input type="text" id="department" name="department" className="f333_12" 
                                                size="20" maxLength="20" value={selectedOrg.department} onChange={handleOrgChange} />
                                            <span>
                                                <ExclamationCircleFilled 
                                                    style={{color: "#f9781f", fontSize: "14px", margin: "5px 3px 0 8px"}} /> 
                                                <span className="spc1">최대 20자 (공백포함)</span>
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="bg_lb w10 bold al_C bL_1gry_n">
                                            행정코드<img src="../images/icon_star_orange.png" alt="필수 항목"/>
                                        </td>
                                        <td>
                                            <input type="text" id="area_code" name="area_code" 
                                                className="f333_12 bg_lgr_d" size="20" readOnly 
                                                value={selectedOrg.area_code} />
                                            <button type="button" id="btn_area" className="btn_lgs" onClick={showAreaPopupHandler}>행정구역 조회</button>
                                        </td>
                                        <td className="bg_lb w10 bold al_C">지역 정렬 기준</td>
                                        <td>
                                            <select id="sort_base" name="sort_base" className="f333_12"
                                                value={selectedOrg.sort_base} onChange={handleOrgChange}>
                                                <option value="2">장비이름</option>
                                                <option value="1">행정코드</option>
                                                <option value="0">지역 정렬번호</option>
                                            </select>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </li>
                        <li className="tb_sms_gry">
                            <span className="sel_center_n">
                                <button type="button" id="btn_in" className="btn_bb80" onClick={() => { saveOrganization('insert'); }}>등록</button>
                                <button type="button" id="btn_re" className="btn_lbb80_s" onClick={resetOrganizationForm}>초기화</button>
                                <button type="button" id="btn_up" className="btn_lbb80_s" onClick={() => { saveOrganization('update'); }}>수정</button>
                                <button type="button" id="btn_de" className="btn_lbb80_s" onClick={deleteOrganization}>삭제</button>
                            </span>
                        </li>
                    </ul>
                    <div className="item_txt">
                        <img src="../images/icon_star_orange.png" alt="필수 항목" />
                        <span>
                            <span className="txt02">필수입력항목</span>
                        </span>
                    </div>
                    <div className="guide_txt">
                        <span>
                            <span className="version">※ 스마트 통합방재 시스템 v3.0</span>
                        </span>
                    </div>
                </div>

                {/* 메뉴 설정 (숨김 처리) */}
                <div className="right_bg dp0">
                    <ul className="set_ulwrap_nh">
                        <li className="w100">
                            <table id="list_table4" className="tb_data tb_data_h32">
                                <thead className="tb_data_tbg">
                                    <tr>
                                        <th className="w30i">상위 메뉴</th>
                                        <th className="w30i">하위 메뉴</th>
                                        <th className="w30i">권한</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* {menuList.map((menu, index) => (
                                        <tr key={index}>
                                            <td>{menu.parent_name}</td>
                                            <td>{menu.menu_name}</td>
                                            <td>
                                                <select className="abr_l" name="sub_level[]" defaultValue={menu.menu_level}>
                                                    <option value="1">최상위관리자</option>
                                                    <option value="2">기관관리자</option>
                                                    <option value="4">일반사용자</option>
                                                </select> 부터
                                            </td>
                                        </tr>
                                    ))} */}
                                </tbody>
                            </table>
                        </li>
                    </ul>
                </div>
            </form>
        </div>
    );
}

export default SetEnv;