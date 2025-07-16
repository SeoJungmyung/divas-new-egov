import React, { useState, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import MsgSelectReceiver from 'divas/msg/MsgSelectReceiver';
import * as EgovNet from 'context/egovFetch';
import { Select, Input, Button, notification, Checkbox } from 'antd';
import { CheckSquareOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';

function MsgRecSet(props) {

    console.group("MsgRecSetContent");
    console.log("[Start] MsgRecSetContent ------------------------------");
    console.log("MsgRecSetContent [props] : ", props);

    const [recList, setRecList] = useState([]);
    const [rtuList, setRtuList] = useState([]);
    const [receiverGroup, setReceiverGroup] = useState([]);
    const [idx, setIdx] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedIndexes, setSelectedIndexes] = useState([]);
    
    const history = useHistory();
    const location = useLocation();

    // 검색  기존 조회에서 접근 했을 시 || 신규로 접근 했을 시
    // let search_sel = '1';
    // let search_text = '';
    const [searchCondition, setSearchCondition] 
    = useState(history.location.state?.searchCondition 
        || { search_sel : '1', search_text : '', sms_group_id : null });


    const retrieveList = (searchCondition) => {
        setIsLoading(true);
        
        const retrieveListURL = '/divas/msg/actionMsgReceiverSet.do';

        searchCondition = {
            ...location.state.commonVO,
            ...searchCondition
        }
        // console.log("searchCondition : ", searchCondition);
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
                let listObj = [];
                // console.log("resp.result : ", resp.result);
                // 리스트 항목 구성
                resp.result.receiverList.forEach(function (item, index) {
                    listObj.push(item);
                });
                setReceiverGroup(resp.result.receiverGroupList);
                setRecList(listObj);

                setRtuList(resp.result.rtuList);
                setIsLoading(false);
            },
            function (resp) {
                console.log("err response : ", resp);
                setIsLoading(false);
            }
        );
    }

    const reRoading = () =>{
        setSearchCondition({ search_sel : '1', search_text : '' });
    }

    const selectReceiver = (idn) => {
        if (idn) {
            setIdx(idn);
        }
    };

    const clickSearch = (condition = searchCondition) => {
        retrieveList(condition);
    }

    const onChangeS = (e) => {
        if(e.target){
            const { value, name } = e.target; 
            setSearchCondition({
                ...searchCondition, 
                [name]: value 
            });
        }else{
            setSearchCondition({
                ...searchCondition, 
                search_sel : e
            });
        }
    }

    const onChangeGroup = (e) => {
        const { value } = e.target; 
        
        const newSearchCondition = {
            ...searchCondition, 
            sms_group_id: isNaN(parseInt(value)) ? '' : parseInt(value)
        };
        
        setSearchCondition(newSearchCondition);
    }

    const clickAll = () => {
        const newSearchCondition = {
            ...searchCondition, 
            search_sel: '1',
            search_text: ''
        };
        setSearchCondition(newSearchCondition);
    }

    // 전체 체크박스 선택/해제 처리
    const handleSelectAll = () => {
        if (recList.length === 0) return;
        
        // 이미 모두 선택된 상태라면 모두 해제
        if (selectedIndexes.length === recList.length) {
            setSelectedIndexes([]);
        } else {
            // 아니면 모두 선택
            setSelectedIndexes(recList.map(item => item.idx));
        }
    };

    // 개별 체크박스 선택/해제 처리
    const handleCheckboxChange = (idx) => {
        setSelectedIndexes(prev => {
            if (prev.includes(idx)) {
                return prev.filter(id => id !== idx);
            } else {
                return [...prev, idx];
            }
        });
    };

    // 선택된 항목 삭제 처리
    const handleDeleteSelected = () => {
        if (selectedIndexes.length === 0) {
            notification.warning({
                message: '삭제할 항목을 선택해주세요.',
                placement: 'top',
                zIndex: 9999
            });
            return;
        }
        
        // 삭제 전 확인
        Swal.fire({
            title: `<span style="font-size: 22px; font-weight: bold;">${selectedIndexes.length}개의 항목을 삭제하시겠습니까?</span>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: '확인',
            cancelButtonText: '취소',
            width: 440,
        }).then((result) => {
            if (result.isConfirmed) { 
                deleteSelectedReceivers();
            }
        });
    };

    // 서버에 선택된 항목 삭제 요청
    const deleteSelectedReceivers = () => {
        const deleteData = {
            organ_id: location.state.commonVO.organ_id,
            organ_code: location.state.commonVO.organ_code,
            ids: selectedIndexes,
            change_mode: 'delete'
        };
        
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(deleteData)
        };
        
        EgovNet.requestFetch('/divas/msg/msgRecBatchDelete.do',
            requestOptions,
            (resp) => {
                if (resp.resultCode === 200) {
                    notification.success({
                        message: '선택한 항목이 삭제되었습니다.',
                        placement: 'top',
                        zIndex: 9999
                    });
                    setSelectedIndexes([]);
                    retrieveList(searchCondition);
                } else {
                    notification.error({
                        message: '삭제 중 오류가 발생했습니다.',
                        placement: 'top',
                        zIndex: 9999
                    });
                }
            },
            (resp) => {
                console.log("err response : ", resp);
                notification.error({
                    message: '삭제 중 오류가 발생했습니다.',
                    placement: 'top',
                    zIndex: 9999
                });
            }
        );
    };

    useEffect(() => {
        retrieveList(searchCondition);
        return () => {
        }
    }, [searchCondition]);


    console.log("------------------------------MsgRecSetContent [End]");
    console.groupEnd("MsgRecSetContent");

    return (
        <div id="content">
            <div className="main_contitle">
                <img src="../images/title_03_04.png" alt="수신자 설정"/>
            </div>
            <div className="right_bg">
                <ul className="tb_edit">
                    <li className="tb_sms_set tb_sms">
                        <div className="set_ulwrap_nh">
                            <MsgSelectReceiver idx={idx}
                                recList={recList} reRoading={reRoading}
                                receiverGroup={receiverGroup}
                                selectedIndexes={selectedIndexes}
                                handleDeleteSelected={handleDeleteSelected}
                            ></MsgSelectReceiver>
                            <div className="sms_conte_sel">
                                검색구분 :
                                <Select
                                    id="search_sel"
                                    name="search_sel"
                                    className="select_sms mL5"
                                    defaultValue={1}
                                    onChange={onChangeS}
                                    style={{height: "34px"}}
                                >
                                    <Select.Option value={1}>이름</Select.Option>
                                    <Select.Option value={2}>그룹</Select.Option>
                                    <Select.Option value={3}>소속및직책</Select.Option>
                                    <Select.Option value={4}>전화번호</Select.Option>
                                </Select>
                                <Input
                                    id="search_text"
                                    name="search_text"
                                    className="input_sms"
                                    value={searchCondition.search_text || ''}
                                    onChange={onChangeS}
                                    allowClear
                                />
                                <Button 
                                    id="btn_search" 
                                    className="btn_bs60_sms mR5"
                                    onClick={() => clickSearch(searchCondition)}
                                >
                                    조회
                                </Button>
                                <Button id="btn_all" 
                                    className="btn_bs"
                                    onClick={clickAll}
                                >
                                    전체목록
                                </Button>
                            </div>
                            <div className="w100 fL pB45p" style={{height: "550px", overflowY: "auto"}}>
                                <table id="user_table" className="tb_data bL_1gry bR_1gry" style={{backgroundColor: '#fff'}}>
                                    <thead>
                                        <tr className="tb_sms_rtitle">
                                            <th className="li5" style={{height: "34px"}}>
                                                <span id="checkAll">
                                                    <CheckSquareOutlined 
                                                        color={selectedIndexes.length > 0 ? "primary" : ""} 
                                                        style={{
                                                            fontSize: "16px", 
                                                            cursor: "pointer", 
                                                            marginLeft: "8px",
                                                            color: selectedIndexes.length > 0 ? "#1890ff" : ""
                                                        }} 
                                                        onClick={handleSelectAll}
                                                    />
                                                </span> &nbsp;
                                            </th>
                                            <th className="li15">그룹&nbsp;&nbsp;
                                                <select id="GROUP_ID_SELECT" name="GROUP_ID_SELECT" className="select_sms2" 
                                                    onChange={onChangeGroup}>
                                                    <option value="">전체</option>
                                                    {receiverGroup && receiverGroup.length > 0 && receiverGroup.map((group) => (
                                                        <option value={group.sms_group_id}>{group.sms_group_name}</option>
                                                    ))}
                                                </select>
                                            </th>
                                            <th className="li15">이름</th>
                                            <th className="li20">전화번호</th>
                                            <th className="li15">소속및직책</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading ? (
                                            <tr><td colSpan={5} className="no_data"></td></tr>
                                        ) : (
                                            recList.length === 0 ? (
                                                <tr><td colSpan={5} className="no_data">검색된 결과가 없습니다.</td></tr>
                                            ) : (
                                                recList.map((item, index) => {
                                                    let mobi = item.mobile.includes("-") ? item.mobile : item.mobile.replace(/(.{3})(.{4})(.*)/, '$1-$2-$3');
                                                    return (
                                                        <tr key={`user_${index}`} data-idx={item.idx} onClick={(e) => {
                                                            if (!e.target.closest('.ant-checkbox') && !e.target.closest('.ant-checkbox-inner')) {
                                                                selectReceiver(item.idx);
                                                            }
                                                        }}>
                                                            <td className="li5" onClick={(e) => e.stopPropagation()}>
                                                                <Checkbox 
                                                                    className="check_to"
                                                                    checked={selectedIndexes.includes(item.idx)}
                                                                    onChange={(e) => {
                                                                        e.stopPropagation();
                                                                        handleCheckboxChange(item.idx);
                                                                    }}
                                                                />
                                                            </td>
                                                            <td className="li15">{item.sms_group_name}</td>
                                                            <td className="li15">{item.user_name}</td>
                                                            <td className="li20">{mobi}</td>
                                                            <td className="li15">{item.memo}</td>
                                                        </tr>
                                                    );
                                                })
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default MsgRecSet;