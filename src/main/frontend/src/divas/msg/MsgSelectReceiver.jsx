import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as EgovNet from 'context/egovFetch';
import { SERVER_URL } from 'context/config';
import { Modal, notification } from 'antd';
import { ExclamationCircleFilled, LoadingOutlined, CheckCircleFilled } from '@ant-design/icons';
import Swal from 'sweetalert2';
import ExcelJS from 'exceljs';
import FileSaver from 'file-saver';
import { common_modal } from 'js/common';

function MsgSelectReceiver(props) {

    console.group("MsgSelectReceiverContent");
    console.log("[Start] MsgSelectReceiverContent ------------------------------");
    console.log("MsgSelectReceiverContent [props] : ", props);
    const [msgVO, setMsgVO] = useState({});

    // useState를 사용하여 open상태를 변경한다. (open일때 true로 만들어 열리는 방식)
    const [modalOpen, setModalOpen] = useState(false);
    const location = useLocation();
    const commonVO = location.state.commonVO;
    const [groupVO, setGroupVO] = useState({
        sms_group_id: '',
        sms_group_name: ''
    });
        
    const handleSample = () => {
        const retrieveListURL = '/divas/msg/getSampleExcel.do'; // 서버에 적절한 엔드포인트 필요
        const requestOptions = {
            method: "GET",
            responseType: 'blob' // 중요: blob으로 응답 받기
        };
        
        // 일반 fetch 사용 (EgovNet은 JSON 응답을 가정하므로 직접 fetch 사용)
        fetch(SERVER_URL + retrieveListURL, {
            ...requestOptions,
            credentials: 'include'
        })
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'sms_people_sample.xls';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        })
        .catch(error => {
            console.error('다운로드 오류:', error);
            notification.error({
                message: '파일 다운로드 중 오류가 발생했습니다.',
            });
        });
    };
        
    const openModal = () => {
        setModalOpen(true);
    };
    const closeModal = () => {
        setModalOpen(false);
        setGroupVO({
            sms_group_id: '',
            sms_group_name: ''
        });
    };

    const onGroupChange = (e) => {
        const { value, name } = e.target; 
        setGroupVO({
            ...groupVO, 
            [name]: value 
        });
    }

    const handleGroupChange = (type) => {
        // 데이터 유효성 검증
        if ((type === 'insert' || type === 'update') && !groupVO.sms_group_name?.trim()) {
            notification.error({
                message: '그룹명을 입력해주세요.',
            });
            return;
        }
        
        if ((type === 'update' || type === 'delete') && !groupVO.sms_group_id) {
            notification.error({
                message: '수정하거나 삭제할 그룹을 선택해주세요.',
            });
            return;
        }
        
        // API 요청 데이터 준비
        const groupData = {
            ...groupVO,
            organ_id: commonVO.organ_id,
            organ_code: commonVO.organ_code
        };
        
        const retrieveListURL = `/divas/msg/msgGroupDataChange.do`;
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                ...groupData,
                change_mode: type
            })
        };
        
        EgovNet.requestFetch(retrieveListURL,
            requestOptions,
            (resp) => {
                // console.log("result = ", resp);
                if(resp.resultCode === 200){
                    // 성공 후 그룹 목록 갱신
                    closeModal();
                    props.reRoading();
                    
                    if(type === 'insert') {
                        notification.success({
                            message: '그룹이 등록되었습니다.',
                        });
                    } else if(type === 'update') {
                        notification.success({
                            message: '그룹이 수정되었습니다.',
                        });
                    } else if(type === 'delete') {
                        notification.success({
                            message: '그룹이 삭제되었습니다.',
                        });
                    }
                } else {
                    notification.error({
                        message: '처리 중 오류가 발생했습니다.',
                    });
                }
            },
            function (resp) {
                console.log("err response : ", resp);
                notification.error({
                    message: '처리 중 오류가 발생했습니다.',
                });
            }
        );
    }

    const changeBtnClick = (e) => {
        
        msgVO.change_mode = e.target.getAttribute('data-change');
        msgVO.mobile = msgVO.mobile1 + msgVO.mobile2 + msgVO.mobile3;

        const type = msgVO.change_mode === 'delete' ? '삭제' : msgVO.change_mode === 'update' ? '수정' : '등록';

        if(msgVO.change_mode === 'delete'){
            if(props.selectedIndexes.length > 0){
                props.handleDeleteSelected();
                return;
            } else {
                if(!msgVO.user_name || !msgVO.mobile){
                    notification.error({
                        message: '수신자를 선택해 주세요!',
                    });
                    return;
                }
            }
        } else {
            if(!msgVO.user_name || !msgVO.mobile){
                notification.error({
                    message: '필수 항목을 입력해 주세요!',
                });
                return;
            }
        }

        Swal.fire({
            title: `<span style="font-size: 22px; font-weight: bold;">${type}하시겠습니까?</span>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: '확인',
            cancelButtonText: '취소',
            width: 440,
        }).then((result) => {
            if (result.isConfirmed) { 
                const retrieveListURL = '/divas/msg/msgRecDataChange.do';
                const requestOptions = {
                    method: "POST",
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(msgVO)
                }

                EgovNet.requestFetch(retrieveListURL,
                    requestOptions,
                    (resp) => {
                        // console.log("result = ", resp);
                        if(resp.resultCode === 200){

                            // 초기화
                            setMsgVO({
                                idx: 1,
                                user_name: "",
                                mobile: "",
                                mobile1: "",
                                mobile2: "",
                                mobile3: "",
                                sms_group_id: 1,
                                sms_group_name: "",
                                memo: "",
                                group1: 0,
                                group2: 0,
                                group3: 0
                            });

                            props.reRoading();
                        }
                        
                    },
                    function (resp) {
                        console.log("err response : ", resp);
                    }
                );
            }
        });
    }
    
    const onChange = (e) => {
        const { value, name } = e.target; 
        setMsgVO({
            ...msgVO, 
            [name]: value 
        });
    }

    const selectReceiver = () => {
        // console.log("props.idx = ", props.idx);
        if(props.idx !== 0){
            const res = props.recList.filter((it) => it.idx === props.idx);
            // console.log(res);
            let mobi = res[0].mobile.replaceAll("-","");
            // const mobile = receiver.mobile.includes("-") ? receiver.mobile: receiver.mobile.replace(/(.{3})(.{4})(.*)/, '$1-$2-$3');
            // const mobile1 = mobile.split("-")[0];
            // const mobile2 = mobile.split("-")[1];
            // const mobile3 = mobile.split("-")[2];
            setMsgVO({
                organ_id: commonVO.organ_id,
                organ_code: commonVO.organ_code,
                idx: props.idx,
                user_name: res[0].user_name,
                mobile: mobi,
                mobile1: mobi.substr(0,3),
                mobile2: mobi.substr(3,4),
                mobile3: mobi.substr(7,4),
                sms_group_id: res[0].sms_group_id,
                sms_group_name: res[0].sms_group_name,
                memo: res[0].memo,
                group1: res[0].group1,
                group2: res[0].group2,
                group3: res[0].group3
            })
        }
    }

    useEffect(() => {
        selectReceiver();
        return () => {
        }
    }, [props.idx]);

    useEffect(() => {
        notification.config({
            placement: 'top',
            top: 50,
            duration: 3,
            maxCount: 3,
            zIndex: 9999
        });
    }, []);

    const handleExcelDownload = () => {
        // 사용 가능한 수신자 목록이 없는 경우 처리
        if (!props.recList || props.recList.length === 0) {
            notification.warning({
                message: '저장할 수신자 정보가 없습니다.',
                placement: 'top',
                zIndex: 9999
            });
            return;
        }

        // Excel 워크북 생성
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'DIVAS System';
        workbook.lastModifiedBy = 'DIVAS User';
        workbook.created = new Date();
        workbook.modified = new Date();

        // 워크시트 추가
        const worksheet = workbook.addWorksheet('수신자목록');

        // 열 설정
        worksheet.columns = [
            { header: '번호', key: 'idx', width: 10 },
            { header: '그룹', key: 'sms_group_name', width: 20 },
            { header: '이름', key: 'user_name', width: 20 },
            { header: '전화번호', key: 'mobile', width: 20 },
            { header: '소속 및 직책', key: 'memo', width: 30 },
        ];

        // 스타일 설정
        worksheet.getRow(1).font = { bold: true, size: 12 };
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE0E0E0' }
        };

        // 데이터 추가
        props.recList.forEach((item, index) => {
            // 전화번호 포맷팅
            const mobile = item.mobile.includes("-") 
                ? item.mobile 
                : item.mobile.replace(/(.{3})(.{4})(.*)/, '$1-$2-$3');
            
            worksheet.addRow({
                idx: index + 1,
                user_name: item.user_name,
                mobile: mobile,
                memo: item.memo || '',
                sms_group_name: item.sms_group_name || ''
            });
        });

        // 테두리 스타일 적용
        worksheet.eachRow((row, rowNumber) => {
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                if (rowNumber > 1) {
                    cell.alignment = { vertical: 'middle' };
                }
            });
        });

        // 현재 날짜를 파일명에 포함
        const today = new Date();
        const dateStr = `${today.getFullYear()}${(today.getMonth()+1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`;
        const fileName = `수신자목록_${dateStr}.xlsx`;

        // 파일 생성 및 다운로드
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            FileSaver.saveAs(blob, fileName);
            
            notification.success({
                message: '수신자 목록이 엑셀로 저장되었습니다.',
                placement: 'top',
                zIndex: 9999
            });
        }).catch(err => {
            console.error('엑셀 생성 오류:', err);
            notification.error({
                message: '엑셀 파일 생성 중 오류가 발생했습니다.',
                placement: 'top',
                zIndex: 9999
            });
        });
    };

    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
         // 파일이 유효한지 확인
         if (!file) {
            common_modal("error", "오류", "파일을 선택해주세요.");
            return;
        }
        
        // 파일 확장자 검사
        const fileExt = file.name.split('.').pop().toLowerCase();
        if (fileExt !== 'xls' && fileExt !== 'xlsx') {
            common_modal("error", "오류", "엑셀 파일(.xls 또는 .xlsx)만 업로드 가능합니다.");
            e.target.value = null; // 파일 선택 초기화
            document.getElementById('fileName').value = '';
            setSelectedFile(null);
            return;
        }
        
        setSelectedFile(file);
        document.getElementById('fileName').value = file.name;
        
        // 파일 선택 후 자동 업로드
        uploadExcelFile(file);
    };

    const uploadExcelFile = (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('organ_id', commonVO.organ_id);
        formData.append('organ_code', commonVO.organ_code);
        
        const uploadURL = '/divas/msg/importReceiversFromExcel.do';
        
        // 로딩 상태를 표시하는 Modal 생성
        const modal = common_modal("loading", "파일 업로드", "파일을 업로드 중입니다. 잠시만 기다려주세요...");
        
        fetch(SERVER_URL + uploadURL, {
            method: 'POST',
            body: formData,
            credentials: 'include',
        })
        .then(response => {
            console.log("Response status:", response.status);
            return response.text().then(text => {
                try {
                    // JSON으로 파싱 시도
                    const data = JSON.parse(text);
                    return data;
                } catch (e) {
                    // 파싱 실패 시 텍스트 출력 후 오류 발생
                    console.error('Response text:', text);
                    throw new Error(`서버 응답이 유효하지 않습니다: ${response.status}`);
                }
            });
        })
        .then(data => {
            // 진행 중인 모달 닫기
            modal.destroy();
            
            // console.log("data = ", data);
            if (data.resultCode === 200) {
                const title = data.result.importCount === 0 ? '업로드 실패' : '업로드 성공';
                const content = data.result.importCount === 0 ? `연락처가 등록되지 않았습니다.` : `${data.result.importCount || '여러'}개의 연락처가 등록되었습니다.`;
                const result = data.result.importCount === 0 ? "error" : "success";
                common_modal(result, title, content);
                
                // 파일 입력 초기화
                document.getElementById('uploadBtn').value = null;
                document.getElementById('fileName').value = '';
                setSelectedFile(null);
                
                // 목록 갱신
                props.reRoading();
            } else {
                throw new Error(data.resultMessage || '업로드 중 오류가 발생했습니다.');
            }
        })
        .catch(error => {
            // 진행 중인 모달 닫기
            modal.destroy();
            
            common_modal("error", "파일 업로드 실패", error.resultMessage || '업로드 중 오류가 발생했습니다.');
        });
    };

    console.log("------------------------------MsgSelectReceiverContent [End]");
    console.groupEnd("MsgSelectReceiverContent");

    // Helper function for number input validation (if needed)
    const inputCheck = (elem, type, range) => {
        // Implementation would go here
        // This is a placeholder for the onInput functionality mentioned in the HTML
    };

    return (
        <div className="tb_sms_gry_top tb_sms_gry">
            <table className="set_tb bT_1gry bR_1gry">
                <tbody>
                    <tr>
                        <td className="bg_lb w7 bold al_C">이름<img src="../images/icon_star_orange.png" alt="필수 항목"/></td>
                        <td style={{width:"22%"}}>
                            <input 
                                id="user_name"
                                name="user_name"
                                type="text" 
                                className="f333_12"
                                size={10} 
                                maxLength={10}
                                onChange={onChange}
                                value={msgVO.user_name||''}
                            /> 
                        </td>
                        <td className="bg_lb w7 bold al_C">전화번호<img src="../images/icon_star_orange.png" alt="필수 항목"/></td>
                        <td style={{width:"27%"}}>
                            <select 
                                id="mobile1" 
                                name="mobile1" 
                                className="f333_12" 
                                size={1}
                                value={msgVO.mobile1||'010'} 
                                onChange={onChange}
                            >
                                <option value="010">010</option>
                                <option value="011">011</option>
                                <option value="016">016</option>
                                <option value="017">017</option>
                                <option value="018">018</option>
                                <option value="019">019</option>
                            </select>
                            -
                            <input 
                                id="mobile2" 
                                name="mobile2" 
                                type="text" 
                                className="f333_12" 
                                size={4} 
                                maxLength={4}
                                onChange={onChange}
                                value={msgVO.mobile2||''}
                                // onInput={() => inputCheck(this,'onlyNumber','0~9999')}
                            />
                            -
                            <input 
                                id="mobile3" 
                                name="mobile3" 
                                type="text" 
                                className="f333_12" 
                                size={4} 
                                maxLength={4}
                                onChange={onChange}
                                value={msgVO.mobile3||''}
                                // onInput={() => inputCheck(this,'onlyNumber','0~9999')}
                            /> 
                        </td>
                        <td className="bg_lb w7 bold al_C">소속및직책</td>
                        <td style={{width:"20%"}}>
                            <input 
                                id="memo" 
                                name="memo" 
                                type="text" 
                                className="f333_12" 
                                size={10}
                                value={msgVO.memo||''} 
                                onChange={onChange}
                                maxLength={30}
                            /> 
                        </td>
                    </tr>
                    <tr>
                        <td className="bg_lb w7 bold al_C">그룹</td>
                        <td style={{width:"22%"}}>
                            <span id="sms_grp">
                                <select 
                                    id="sms_group_id"
                                    name="sms_group_id"
                                    size={1} 
                                    className="f333_12_bm" 
                                    style={{ width: 100 }}
                                    onChange={onChange}
                                    value={msgVO.sms_group_id || '1'}
                                >
                                     {props.receiverGroup && props.receiverGroup.length > 0 && props.receiverGroup.map((group) => (
                                        <option value={group.sms_group_id}>{group.sms_group_name}</option>
                                    ))}
                                </select> 
                            </span>
                            &nbsp;
                            <button type="button" id="btn_group" className="btn_wbs"
                                onClick={() => openModal()}
                            >그룹설정</button>
                        </td>
                        <td className="bg_lb w7 bold al_C">엑셀</td>
                        <td style={{width:"27%"}} colSpan={3}>
                            <button 
                                type="button" 
                                id="btn_download" 
                                className="btn_rs pointer"
                                onClick={handleExcelDownload}
                            >엑셀로 저장</button>
                            &nbsp;
                            <button 
                                type="button" 
                                id="btn_sample" 
                                className="btn_wbs" 
                                onClick={handleSample}
                            >엑셀샘플받기</button>
                            <div className="fileBox">
                                <input type="text" id="fileName" className="fileName" readOnly />
                                <label htmlFor="uploadBtn" className="btn_file mL5 pointer">엑셀등록</label>
                                <input 
                                    type="file" 
                                    id="uploadBtn" 
                                    className="uploadBtn" 
                                    accept=".xls,.xlsx"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <span> 
                                <ExclamationCircleFilled 
                                    style={{color: "#f9781f", fontSize: "14px", margin: "5px 3px 0 8px"}} /> 
                                <span className="spc1">엑셀파일(xls)만 등록가능</span>
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="item_txt">
                <img src="../images/icon_star_orange.png" alt="필수 항목" />
                <span className="txt02">필수입력항목</span>
            </div>
            <div className="name">
                <button type="button" id="btn_in" className="btn_bb105" 
                    onClick={changeBtnClick} data-change={"insert"}>등 록</button>
                <button type="button" id="btn_up" className="btn_lbb105_s"
                    onClick={changeBtnClick} data-change={"update"}>수 정</button>
                <button type="button" id="btn_de" className="btn_lbb105_s"
                    onClick={changeBtnClick} data-change={"delete"}>삭 제</button>
            </div>
            
            <Modal
                title={
                    <div className="popup_top" style={{marginTop: "-8px"}}>
                        그룹설정
                        <button id="popup_close" className="btn_pop_blue fR bold" onClick={closeModal}>X</button>
                    </div>
                }
                open={modalOpen}
                onCancel={closeModal}
                footer={null}
                width={350}
                className="popup_layout_b"
                centered
                maskClosable={false}
                closable={false}
                style={{ top: '20%' }}
            >
                <div className="popup_con_1">
                    <dl>
                        <dd id="group_table" className="max200">
                            <table id="group_table" className="tb_data bB_1gry">
                                <thead>
                                    <tr>
                                        <th className="">그룹명</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {props.receiverGroup.map((group, index) => (
                                        <tr key={index} id={`group_${group.sms_group_id}`}
                                            onClick={() => {
                                                setGroupVO({
                                                    sms_group_id: group.sms_group_id,
                                                    sms_group_name: group.sms_group_name
                                                });
                                            }}
                                        >
                                            <td id="li_SMS_GROUP_ID" className="dp0">{group.sms_group_id}</td>
                                            <td id="li_SMS_GROUP_NAME">{group.sms_group_name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </dd>
                        <dd>
                            <ul>
                                <li className="b0 mT10 w100 p0 bold">
                                    그룹명 : &nbsp;
                                    <input 
                                        type="text" 
                                        id="S_SMS_GROUP_NAME" 
                                        name="sms_group_name" 
                                        size="20" 
                                        className="f333_12 al_C" 
                                        maxLength={15} 
                                        onChange={onGroupChange}
                                        value={groupVO.sms_group_name}
                                    />
                                    <input type="hidden" id="S_SMS_GROUP_ID" name="sms_group_id" value={groupVO.sms_group_id} />
                                </li>
                                <li className="b0 al_C w100 mT10">
                                    <button 
                                        type="button" 
                                        id="btn_s_in" 
                                        className="btn_bb80"
                                        onClick={() => handleGroupChange('insert')}
                                    >등록</button>
                                    <button 
                                        type="button" 
                                        id="btn_s_up" 
                                        className="btn_wbb80"
                                        onClick={() => handleGroupChange('update')}
                                    >수정</button>
                                    <button 
                                        type="button" 
                                        id="btn_s_de" 
                                        className="btn_wbb80"
                                        onClick={() => handleGroupChange('delete')}
                                    >삭제</button>
                                </li>
                            </ul>
                        </dd>
                    </dl>
                </div>
            </Modal>
        </div>
    );
}

export default MsgSelectReceiver;