import React, { useState, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import * as EgovNet from 'context/egovFetch';
import { DatePicker, Modal, Input } from 'antd';
import { showMsgDetailPopup } from '../../js/common';
import locale from 'antd/es/date-picker/locale/ko_KR';
import $ from 'jquery';
import dayjs from 'dayjs';

function MsgHist(props) {

    console.group("MsgHistContent");
    console.log("[Start] MsgHistContent ------------------------------");
    console.log("MsgHistContent [props] : ", props);

    const [listTag, setListTag] = useState([]);
    const [msgData, setMsgData] = useState({
        sms_type : "0",
        mobile : "",
        dd : "",
        hh : "",
        mm : ""
    });
    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs());
    const location = useLocation();
    const history = useHistory();

    // 검색 조건 상태 관리
    const [searchCondition, setSearchCondition] 
    = useState(history.location.state?.searchCondition 
        || { 
            search_sel: 'script_title', 
            search_text: '',
            dest_info: '',
            sms_msg: '',
            schedule_type: 999,
            tran_rslt: 999,
            tran_stat: '',
            tran_date: ''
        });

    // 데이터 합계 건수
    const [totalCount, setTotalCount] = useState(0);

    const retrieveList = (searchCondition) => {
        const retrieveListURL = '/divas/msg/actionMsgHist.do';

        if(searchCondition.tran_date === 'y'){
            // 연간: 해당 년도의 1월 1일부터 12월 31일까지
            searchCondition.sdate = startDate.startOf('year').format('YYYY-MM-DD');
            searchCondition.edate = startDate.endOf('year').format('YYYY-MM-DD');
        } else if(searchCondition.tran_date === 'm'){
            // 월간: 해당 월의 1일부터 말일까지
            searchCondition.sdate = startDate.startOf('month').format('YYYY-MM-DD');
            searchCondition.edate = startDate.endOf('month').format('YYYY-MM-DD');
        } else if(searchCondition.tran_date === 'd'){
            // 일간: 선택한 날짜만
            searchCondition.sdate = startDate.format('YYYY-MM-DD');
            searchCondition.edate = startDate.format('YYYY-MM-DD');
        } else {
            // 기간: 선택한 시작일부터 종료일까지
            searchCondition.sdate = startDate.format('YYYY-MM-DD');
            searchCondition.edate = endDate.format('YYYY-MM-DD');
        }
        searchCondition.organ_id = location.state.commonVO.organ_id;
        // console.log('searchCondition = ', searchCondition);

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
                if(resp.result.msgHistList.length < 1){
                    mutListTag.push(<tr><td colSpan={5} className="no_data">검색된 결과가 없습니다.</td></tr>);
                }

                // 총 건수 설정
                setTotalCount(resp.result.msgHistList.length);

                // 리스트 항목 구성
                resp.result.msgHistList.forEach(function (item, index) {
                    if (index === 0) mutListTag = [];
                    let schedule_text = item.schedule_type === 1 ? "예약문자" : "일반문자";
                    let send_date = item.send_date ? dayjs(item.send_date).format('YYYY-MM-DD HH:mm:ss') : "";
                    let callback = item.callback ? 
                        item.callback.includes("-") 
                            ? item.callback 
                            : item.callback.length > 10 ? item.callback.replace(/(.{3})(.{4})(.*)/, '$1-$2-$3')
                                : item.callback.replace(/(.{3})(.{3})(.*)/, '$1-$2-$3')
                        : "";
                    let user_id = item.user_id ? item.user_id : "";
                    mutListTag.push(
                        <tr key={"msg_list_"+index} id={"list_"+item.msg_id} user_id={user_id}
                            className="hh pointer"
                            onClick={(e) => clickList(e)}>
                            <td className="li12_6">{send_date}</td>
                            <td className="li8 bL_1gry">{callback}</td>
                            <td className="li60 bL_1gry al_L pL5">&nbsp;&nbsp;{item.sms_msg}</td>
                            <td className="li5 bL_1gry">{schedule_text}</td>
                            <td className="li5 bL_1gry">{item.dest_count}</td>
                        </tr>
                    );
                });
                mutListTag.push();
                setListTag(mutListTag);
            },
            function (resp) {
                console.log("err response : ", resp);
            }
        );
    }

    const clickSearch = () => {
        retrieveList(searchCondition);
    }

    const handleMsgType = (type) => {
        if(type !== '') {
            $('#edate').closest('div.ant-picker').css("display", 'none');
            $('span.mL3').css("display", 'none');
        } else {
            $('#edate').closest('div.ant-picker').css("display", '');
            $('span.mL3').css("display", '');
        }
    }

    // 라디오 버튼 변경 핸들러
    const handleRadioChange = (e) => {
        const { name, value } = e.target;

        setSearchCondition({
            ...searchCondition,
            [name]: name === 'tran_date' ? value 
                    : parseInt(value)
        });
        
        if (name === 'tran_date') {
            handleMsgType(value);
        }
    }

    // 입력 필드 변경 핸들러
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchCondition({
            ...searchCondition,
            [name]: value
        });
    }

    // 상세보기
    const clickList = (e) => {
        $('#list_table tbody tr').removeClass('selected');

        let selectTr = e.target.parentElement;
        selectTr.classList.toggle('selected');  // 선택됐을때 토글
        let sId = selectTr.id.replace("list_", "");
        const user_id = selectTr.getAttribute('user_id');
        const send_date = selectTr.querySelector('td:first-child').textContent;
        
        const detailURL = '/divas/msg/actionMsgHistDetail.do';
        searchCondition.msg_id = sId;
        searchCondition.organ_id = location.state.commonVO.organ_id;
        
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(searchCondition)
        }

        EgovNet.requestFetch(detailURL,
            requestOptions,
            (resp) => {
                resp.result.user_id = user_id;
                resp.result.send_date = send_date;
                // console.log("resp.result = ", resp.result);
                showMsgDetailPopup(resp.result, cancelScheduledMessage);
            },
            function (resp) {
                console.log("err response : ", resp);
            }
        );
    }

    // 예약 전송 취소 기능
    const cancelScheduledMessage = (msgId) => {
        Modal.confirm({
            title: '예약전송 취소',
            content: '예약된 메시지 전송을 취소하시겠습니까?',
            okText: '확인',
            cancelText: '취소',
            onOk() {
                const cancelURL = '/divas/msg/actionCancelScheduledMsg.do';
                const requestData = {
                    msg_id: msgId,
                    organ_id: location.state.commonVO.organ_id
                };
                
                const requestOptions = {
                    method: "POST",
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(requestData)
                };
                
                EgovNet.requestFetch(cancelURL,
                    requestOptions,
                    (resp) => {
                        console.log("취소 결과:", resp);
                        if (resp.resultCode === "SUCCESS") {
                            Modal.success({
                                title: '성공',
                                content: '예약 전송이 취소되었습니다.',
                                onOk: () => {
                                    Modal.destroyAll();
                                    retrieveList(searchCondition); // 목록 새로고침
                                }
                            });
                        } else {
                            Modal.error({
                                title: '오류',
                                content: resp.resultMessage || '예약 전송 취소에 실패했습니다.',
                            });
                        }
                    },
                    (error) => {
                        console.error('예약 취소 오류:', error);
                        Modal.error({
                            title: '오류',
                            content: '예약 전송 취소 중 오류가 발생했습니다.',
                        });
                    }
                );
            }
        });
    }
    
    useEffect(() => {
        retrieveList(searchCondition);
        return () => {
        }
    }, []);

    console.log("------------------------------MsgHistContent [End]");
    console.groupEnd("MsgHistContent");

    return (
        <div id="content">
            <div className="main_contitle">
                <img src="../images/title_03_03.png" alt="전송 이력"/>
            </div>
            <div className="right_bg">
                <ul className="set_ulwrap_nh">
                    <li className="tb_sms_gry">
                        <table className="set_tb bT_1gry bR_1gry">
                            <tbody>
                                <tr>
                                    <td className="bg_lb w10 bold al_C">검색 기간</td>
                                    <td colSpan="5">
                                        <input
                                            type="radio"
                                            className="btn_radio t_date"
                                            name="tran_date"
                                            value="y"
                                            onChange={handleRadioChange}
                                        />
                                        연간
                                        <input
                                            type="radio"
                                            className="btn_radio t_date"
                                            name="tran_date"
                                            value="m"
                                            onChange={handleRadioChange}
                                        />
                                        월간
                                        <input
                                            type="radio"
                                            className="btn_radio t_date"
                                            name="tran_date"
                                            value="d"
                                            onChange={handleRadioChange}
                                        />
                                        일간
                                        <input
                                            type="radio"
                                            className="btn_radio t_date"
                                            name="tran_date"
                                            value=""
                                            defaultChecked={true}
                                            onChange={handleRadioChange}
                                        />
                                        기간
                                        &nbsp;&nbsp;&nbsp;
                                        <DatePicker 
                                            id="sdate"
                                            value={startDate} 
                                            className="f333_12" 
                                            onChange={date => setStartDate(date)}
                                            format="YYYY-MM-DD"
                                            locale={locale}
                                            style={{textAlign: 'center'}}
                                        />
                                        <span className="mL3">-</span>
                                        <DatePicker 
                                            id="edate"
                                            value={endDate} 
                                            className="f333_12" 
                                            onChange={date => setEndDate(date)}
                                            format="YYYY-MM-DD"
                                            locale={locale}
                                            style={{textAlign: 'center'}}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="bg_lb w10 bold al_C">수신 번호</td>
                                    <td style={{width: '23%'}}>
                                        <Input
                                            id="dest_info"
                                            name="dest_info"
                                            value={searchCondition.dest_info || ''}
                                            className="f333_12_bm"
                                            style={{ width: '150px' }}
                                            onChange={handleInputChange}
                                            allowClear
                                        />
                                    </td>
                                    <td className="bg_lb w10 bold al_C">메세지</td>
                                    <td colSpan="3">
                                        <Input
                                            id="sms_msg"
                                            name="sms_msg"
                                            value={searchCondition.sms_msg || ''}
                                            className="f333_12_bm"
                                            style={{ width: '300px' }}
                                            onChange={handleInputChange}
                                            allowClear
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    {/* <td className="bg_lb w10 bold al_C">전송 상태</td>
                                    <td>
                                        <input
                                            type="radio"
                                            className="btn_radio"
                                            name="tran_stat"
                                            value=""
                                            defaultChecked={true}
                                            onChange={handleRadioChange}
                                        />
                                        전체
                                        <input
                                            type="radio"
                                            className="btn_radio"
                                            name="tran_stat"
                                            value="1"
                                            onChange={handleRadioChange}
                                        />
                                        요청
                                        <input
                                            type="radio"
                                            className="btn_radio"
                                            name="tran_stat"
                                            value="2"
                                            onChange={handleRadioChange}
                                        />
                                        대기
                                        <input
                                            type="radio"
                                            className="btn_radio"
                                            name="tran_stat"
                                            value="3"
                                            onChange={handleRadioChange}
                                        />
                                        완료
                                    </td> */}
                                    <td className="bg_lb w10 bold al_C">전송 유형</td>
                                    <td>
                                        <input
                                            type="radio"
                                            className="btn_radio"
                                            name="schedule_type"
                                            value={999}
                                            defaultChecked={true}
                                            onChange={handleRadioChange}
                                        />
                                        전체
                                        <input
                                            type="radio"
                                            className="btn_radio"
                                            name="schedule_type"
                                            value={0}
                                            onChange={handleRadioChange}
                                        />
                                        일반문자
                                        <input
                                            type="radio"
                                            className="btn_radio"
                                            name="schedule_type"
                                            value={1}
                                            onChange={handleRadioChange}
                                        />
                                        예약문자
                                    </td>
                                    <td className="bg_lb w10 bold al_C">전송 결과</td>
                                    <td>
                                        <input
                                            type="radio"
                                            className="btn_radio"
                                            name="tran_rslt"
                                            value={999}
                                            defaultChecked={true}
                                            onChange={handleRadioChange}
                                        />
                                        전체
                                        <input
                                            type="radio"
                                            className="btn_radio"
                                            name="tran_rslt"
                                            value={0}
                                            onChange={handleRadioChange}
                                        />
                                        성공
                                        <input
                                            type="radio"
                                            className="btn_radio"
                                            name="tran_rslt"
                                            value={1}
                                            onChange={handleRadioChange}
                                        />
                                        실패
                                        {/* <input
                                            type="radio"
                                            className="btn_radio"
                                            name="tran_rslt"
                                            value="9"
                                            onChange={handleRadioChange}
                                        />
                                        미전송 */}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <span id="button" className="name">
                            <div id="button" className="dt-buttons">
                                <button type="button" id="btn_search" className="btn_bb115" onClick={clickSearch}>
                                    검색
                                </button>
                            </div>
                        </span>
                        <span style={{position:'absolute', top:'245px', left:'55px', fontSize:'14px'}}>
                            총 : <span id="row_cnt" style={{color:'#009bfa', fontSize:'14px'}}>{totalCount}</span> 건
                        </span>
                    </li>
                    <li className="li100_nor">
                        <div className="tb_data max540 bb_3blue">
                            <table id="list_table" style={{ minHeight: '500px' }} className="tb_data_left w100">
                                <thead className="tb_data_tbg">
                                    <tr>
                                        <th className="li12_6">전송시각</th>
                                        <th className="li8 bL_1gry">회신번호</th>
                                        <th className="li60 bL_1gry">메세지</th>
                                        <th className="li5 bL_1gry">유형</th>
                                        <th className="li5 bL_1gry">수신인원</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listTag.length > 0 ? listTag : (
                                        <tr className="hh">
                                            <td colSpan="5">데이터가 없습니다.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default MsgHist;