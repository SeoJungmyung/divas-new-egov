import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as EgovNet from 'context/egovFetch';
import SetUserDetail from 'divas/set/SetUserDetail';

function SetUser(props) {

    console.group("SetUserContent");
    console.log("[Start] SetUserContent ------------------------------");
    console.log("SetUserContent [props] : ", props);

    const [reload, setLoadState] = useState(false);
    const [rightList, setRightList] = useState([]);
    const [scriptListTag, setScriptListTag] = useState([]);
    const [scriptDetail, setScriptList] = useState([]);
    const [allUserList, setAllUserList] = useState([]); // 전체 사용자 목록 저장
    const [scriptNo, selectScriptNo] = useState("");
    const [option1, selectOp1] = useState({});
    const [rtuOption, selectRtuOp] = useState({rtu_cnt : "", area_code : [], siteid : []});
    const [userVO, setUserVO] = useState({user_id : '', user_name : ''});
    const [searchVO, setSearchVO] = useState({search_sel: '0', search_text: ''});
    const [rtuList, setRtuList] = useState([]);
    const [rtuGroupList, setRtuGroupList] = useState([]);

    const location = useLocation();

    const [commonVO, setCommonVO] = useState(location.state?.commonVO || {});

    // 사용자 목록을 JSX로 변환하는 함수
    const generateUserListTag = (userList) => {
        let mutListTag = [];
        
        if(userList.length < 1){
            mutListTag.push(<tr key="no_data" className="no_data"><td colSpan={6}>검색된 결과가 없습니다.</td></tr>);
            return mutListTag;
        }

        userList.forEach(function (item, index) {
            let user_type_name = item.user_type === "0" ? "최상위관리자" : (item.user_type === "1" ? "기관관리자" : (item.user_type === "3" ? "일반사용자" : "GUEST"));
            let is_permit = item.is_permit === "0" ? 'no' : 'ok';
            mutListTag.push(
                <tr key={"user_"+index} id={"list_"+(index+1)} name={item.user_id} 
                    className={`pointer ${scriptNo === item.user_id ? 'selected' : ''}`} 
                    onClick={() => onClickScript(item.user_id)}>
                    <td className="li5">{index+1}</td>
                    <td id="l_USER_ID" className="li15 bL_1gry">{item.user_id}</td>
                    <td id="l_USER_NAME" className="li25 bL_1gry">{item.user_name}</td>
                    <td id="l_ORGAN_NAME" className="li25 bL_1gry">{item.organ_name}</td>
                    <td id="l_USER_TYPE_NAME" className="li15 bL_1gry">{user_type_name}</td>
                    <td id="l_IS_PERMIT_NAME" className="li15 bL_1gry">
                        <img src={`../images/icon_${is_permit}.png`} className="va_M" alt="정상"/>
                    </td>
                </tr>
            );
        });
        
        return mutListTag;
    }

    const retrieveList = () => {
        const retrieveListURL = '/divas/set/SetUser.do';
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
                console.log("result = ", resp.result);
                
                // 전체 사용자 목록 저장
                setAllUserList(resp.result.userList);
                setScriptList(resp.result.userList);
                
                // 초기 목록 표시
                const initialListTag = generateUserListTag(resp.result.userList);
                setScriptListTag(initialListTag);

                // 지역 목록 저장
                setRtuList(resp.result.broadcastRtuList);
                setRtuGroupList(resp.result.broadcastRtuGroupList);
                
                setRightList(resp.result.userRightList);

                let item1 = [];
                resp.result.organList.forEach(function (item, index) {
                    item1.push(
                        <option key={item.organ_id} value={item.organ_id}>{item.organ_name}</option>
                    );
                });
                selectOp1(item1);
            },
            function (resp) {
                console.log("err response : ", resp);
            }
        );

    }

    // 검색 기능 구현 - 클라이언트 사이드 필터링
    const onSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchVO({
            ...searchVO,
            [name]: value
        });
    }

    const onSearchClick = () => {
        filterUserList();
    }

    const onSearchAllClick = () => {
        setSearchVO({search_sel: '0', search_text: ''});
        // 전체 목록 표시
        const allListTag = generateUserListTag(allUserList);
        setScriptListTag(allListTag);
    }

    // 사용자 목록 필터링 함수
    const filterUserList = () => {
        if(!searchVO.search_text.trim()) {
            // 검색어가 없으면 전체 목록 표시
            const allListTag = generateUserListTag(allUserList);
            setScriptListTag(allListTag);
            return;
        }

        const searchText = searchVO.search_text.toLowerCase();
        const filteredList = allUserList.filter(user => {
            if(searchVO.search_sel === '0') {
                // 사용자 ID로 검색
                return user.user_id.toLowerCase().includes(searchText);
            } else if(searchVO.search_sel === '1') {
                // 사용자명으로 검색
                return user.user_name.toLowerCase().includes(searchText);
            }
            return false;
        });

        const filteredListTag = generateUserListTag(filteredList);
        setScriptListTag(filteredListTag);
    }

    // 검색어 변경 시 실시간 필터링 (엔터키 없이도 동작)
    useEffect(() => {
        if(allUserList.length > 0) {
            filterUserList();
        }
    }, [searchVO.search_text, searchVO.search_sel, allUserList]);

    // scriptNo가 변경될 때마다 목록을 다시 생성하여 selected 클래스 적용
    useEffect(() => {
        if(allUserList.length > 0) {
            // 현재 필터된 목록을 다시 생성
            if(searchVO.search_text.trim()) {
                filterUserList();
            } else {
                const allListTag = generateUserListTag(allUserList);
                setScriptListTag(allListTag);
            }
        }
    }, [scriptNo]);

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

    console.log("------------------------------SetUserContent [End]");
    console.groupEnd("SetUserContent");

    return (
        <div id="content">
            <div className="main_contitle">
                <img src="../images/title_06_03.png" alt="사용자 설정" />
                <div className="unit">※ 항목을 클릭하면 설정값을 확인 및 수정할 수 있습니다.</div>
            </div>
            <div className="right_bg">
                <ul className="set_ulwrap_nh bB_3blue">
                    <li className="tb_sms_gry">
                        <span className="sel_left_n">
                            사용자 목록 조회 :
                            <select id="search_sel" name="search_sel" className="f333_12" size={1} 
                                value={searchVO.search_sel} onChange={onSearchChange}>
                                <option value="0">사용자 ID</option>
                                <option value="1">사용자명</option>
                            </select>
                            &nbsp;
                            <input
                                type="text"
                                id="search_text"
                                name="search_text"
                                className="f333_12"
                                size={60}
                                value={searchVO.search_text}
                                onChange={onSearchChange}
                                placeholder="검색어를 입력하세요"
                            />
                            &nbsp;&nbsp;
                            <button type="button" id="btn_search" className="btn_bs" onClick={onSearchClick}>
                                조회
                            </button>
                            <button type="button" id="btn_search_all" className="btn_lbs" onClick={onSearchAllClick}>
                                전체목록
                            </button>
                        </span> 
                    </li>
                    <li className="li100_nor s_scroll">
                        <table id="list_table" className="tb_data">
                            <thead className="tb_data_tbg">
                                <tr>
                                    <th className="li5">순서</th>
                                    <th className="li15 bL_1gry">사용자 ID</th>
                                    <th className="li25 bL_1gry">사용자명</th>
                                    <th className="li25 bL_1gry">소속기관</th>
                                    <th className="li15 bL_1gry">사용자 구분</th>
                                    <th className="li15 bL_1gry">문자 알림</th>
                                </tr>
                            </thead>
                            <tbody>
                                {scriptListTag}
                            </tbody>
                        </table>
                    </li>
                </ul>
                <SetUserDetail 
                    scriptNo={scriptNo} 
                    selectScriptNo={selectScriptNo}
                    scriptDetail={scriptDetail}
                    rtuList={rtuList}
                    rtuGroupList={rtuGroupList}
                    option1={option1} rightList={rightList} 
                    reRoading={reRoading} />
                <div className="item_txt">
                    <img src="../images/icon_star_orange.png" alt="필수 항목"/>
                    <ul>
                        <li className="txt02">필수입력항목</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default SetUser;