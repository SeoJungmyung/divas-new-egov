import React, { useState, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { DatePicker, TimePicker, Select, Button, Input } from 'antd';
import locale from 'antd/es/date-picker/locale/ko_KR';
import * as EgovNet from 'context/egovFetch';
import MsgSendList from 'divas/msg/MsgSendList';
import $ from 'jquery';
import moment from 'moment';
import 'moment/locale/ko';
import Swal from 'sweetalert2';
import { getRouteFromUrl } from 'context/componentRegistry';

// moment 로케일을 한국어로 설정
moment.locale('ko');

function MsgSend(props) {

    console.group("MsgSendContent");
    console.log("[Start] MsgSendContent ------------------------------");
    console.log("MsgSendContent [props] : ", props);

    const [originalContacts, setOriginalContacts] = useState([]);
    const [addressBookContacts, setAddressBookContacts] = useState([]);
    const [receiverContacts, setReceiverContacts] = useState([]);
    const [manualReceivers, setManualReceivers] = useState([]);
    const [receiverCount, setReceiverCount] = useState(0);
    const [smsTypeFlag, setSmsTypeFlag] = useState(true);
    
    // Other state
    const [numberList, setNumberList] = useState([]);
    const [msgData, setMsgData] = useState({
        sms_type: "0",
        mobile: "",
        dd: "",
        hh: "",
        mm: ""
    });
    
    const history = useHistory();
    const location = useLocation();

    // 검색  기존 조회에서 접근 했을 시 || 신규로 접근 했을 시
    // let search_sel = 'script_title';
    // let search_text = '';
    const [searchCondition, setSearchCondition] 
    = useState(location.state?.searchCondition 
        || { search_sel : '1', search_text : '' });

    const [sms_call, setSmsCall] = useState(location.state?.commonVO?.sms_call || '');

    const removeAll = () => {
        setAddressBookContacts(prevContacts => {
            if (selectedGroup !== 0) {
                return [...prevContacts, ...receiverContacts.filter(c => c.sms_group_id === selectedGroup)];
            }
            return [...prevContacts, ...receiverContacts];
        });
        
        // Clear all receivers
        setReceiverContacts([]);
        setManualReceivers([]);
        
        // Set count to 0 since we removed everything
        setReceiverCount(0);
    };

    // Move all visible address book contacts to receiver list
    const selectAll = () => {
        const newReceiverContacts = [...receiverContacts, ...addressBookContacts];
        setReceiverContacts(newReceiverContacts);
        setAddressBookContacts([]);
        
        // Update count based on the new values
        setReceiverCount(newReceiverContacts.length + manualReceivers.length);
    };

    // Move selected contacts to receiver list
    const waitIn = () => {
        // Get selected items using jQuery
        const selectedRows = $("#list_table tr.selected").toArray();
        if (selectedRows.length === 0) return;
        
        // Get IDs of selected items
        const selectedIds = selectedRows.map(row => row.id.replace("list_", ""));
        
        // Find the contact objects for these IDs
        const selectedContacts = addressBookContacts.filter(
            contact => selectedIds.includes(String(contact.idx))
        );
        
        // Add to receiver list and remove from address book
        const newReceiverContacts = [...receiverContacts, ...selectedContacts];
        setReceiverContacts(newReceiverContacts);
        setAddressBookContacts(prevContacts => 
            prevContacts.filter(contact => !selectedIds.includes(String(contact.idx)))
        );
        
        // Update count with the correct total
        setReceiverCount(newReceiverContacts.length + manualReceivers.length);

        // 셀렉트 삭제
        $("#list_table tr").removeClass("selected");
    };

    // Remove selected items from receiver list
    const waitOut = () => {
        // Make copies of the current state to work with
        let updatedManualReceivers = [...manualReceivers];
        let updatedReceiverContacts = [...receiverContacts];
        let wasUpdated = false;

        // Handle selected manual entries
        const selectedManualRows = $("#list_table2 tr.notList.selected").toArray();
        if (selectedManualRows.length > 0) {
            const selectedManualIds = selectedManualRows.map(row => row.id);
            updatedManualReceivers = updatedManualReceivers.filter(
                item => !selectedManualIds.includes(item.id)
            );
            wasUpdated = true;
        }
        
        // Handle selected address book entries
        const selectedRows = $("#list_table2 tr:not(.notList).selected").toArray();
        if (selectedRows.length > 0) {
            const selectedIds = selectedRows.map(row => row.id.replace("list_", ""));
            
            // Find the contact objects for these IDs
            const selectedContacts = receiverContacts.filter(
                contact => selectedIds.includes(String(contact.idx))
            );
            
            // Add back to address book (if they match current group filter)
            if (selectedGroup === 0 || selectedContacts.some(c => c.sms_group_id === selectedGroup)) {
                setAddressBookContacts(prevContacts => [...prevContacts, ...selectedContacts]);
            }
            
            updatedReceiverContacts = updatedReceiverContacts.filter(
                contact => !selectedIds.includes(String(contact.idx))
            );
            wasUpdated = true;
        }
        
        // Only update states if changes were made
        if (wasUpdated) {
            setManualReceivers(updatedManualReceivers);
            setReceiverContacts(updatedReceiverContacts);
            
            // Update count with the correct totals from our local copies
            setReceiverCount(updatedReceiverContacts.length + updatedManualReceivers.length);
        }

        // 셀렉트 삭제
        $("#list_table2 tr").removeClass("selected");
    };

    // Toggle selection of a receiver
    const clickReceiver = (e) => {
        let selectTr = e.target.parentElement;
        selectTr.classList.toggle('selected');
    };

    // Add a manual receiver number
    const addManualReceiver = (mobile) => {
        const newManualReceiver = {
            id: `manual_${Date.now()}`,
            mobile,
            isManual: true
        };
        
        const updatedManualReceivers = [...manualReceivers, newManualReceiver];
        setManualReceivers(updatedManualReceivers);
        
        // Update count with the new total
        setReceiverCount(receiverContacts.length + updatedManualReceivers.length);
        
        return newManualReceiver.id;
    };

    // Remove a manual receiver
    const removeManualReceiver = (id) => {
        const updatedManualReceivers = manualReceivers.filter(item => item.id !== id);
        setManualReceivers(updatedManualReceivers);
        
        // Update count with the new total
        setReceiverCount(receiverContacts.length + updatedManualReceivers.length);
    };

    // Handle group filter change
    const handleGroupChange = (value) => {
        setSelectedGroup(value);
        
        if (value === 0) {
            // Show all contacts still in the address book
            setAddressBookContacts(originalContacts.filter(contact => 
                !receiverContacts.some(rec => rec.idx === contact.idx)
            ));
        } else {
            // Show only contacts from the selected group that are still in the address book
            setAddressBookContacts(originalContacts.filter(contact => 
                contact.sms_group_id === value && 
                !receiverContacts.some(rec => rec.idx === contact.idx)
            ));
        }
    };

    // Fetch contacts from the server
    const retrieveList = (searchCondition) => {

        searchCondition = {
            ...location.state.commonVO,
            ...searchCondition
        }

        const retrieveListURL = '/divas/msg/actionMsgSend.do';
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(searchCondition)
        };

        EgovNet.requestFetch(retrieveListURL,
            requestOptions,
            (resp) => {
                console.log("result = ", resp);

                // Process contacts from the server
                const contactList = resp.result.receiverList.map(item => ({
                    ...item,
                    mobile: item.mobile.includes("-") 
                        ? item.mobile 
                        : item.mobile.replace(/(.{3})(.{4})(.*)/, '$1-$2-$3')
                }));

                // Store original list 
                setOriginalContacts(contactList);
                // Initially show all in address book
                setAddressBookContacts(contactList);
                
                // Prepare number list for validation
                const phoneNumbers = contactList.map(item => item.mobile);
                setNumberList(phoneNumbers);
                
                // Process receiver group options
                if (resp.result.receiverGroupList && resp.result.receiverGroupList.length > 0) {
                    const options = resp.result.receiverGroupList.map(group => ({
                        value: group.sms_group_id,
                        label: group.sms_group_name
                    }));
                    options.unshift({ value: 0, label: '그룹전체' });
                    setGroupOptions(options);
                } else {
                    setGroupOptions([{ value: 0, label: '그룹전체' }]);
                }
            },
            function (resp) {
                console.log("err response : ", resp);
            }
        );
    };

    // Reset SMS message
    const smsRenew = () => {
        $("#sms_msg").val("여기에 메세지를 입력해 주세요");
    };
    
    // Handle message type change
    const handleMsgType = (type) => {
        setMsgData({
            ...msgData,
            sms_type: type
        });
        
        if (type === 0) {
            setSmsTypeFlag(true);
        } else {
            setSmsTypeFlag(false);
        }
    };
    
    // Handle date change
    const handleDateChange = (date, dateString) => {
        $('#dd').val(dateString);
        
        setMsgData({
            ...msgData,
            dd: dateString
        });
    };
    
    // Handle time change
    const handleTimeChange = (time, timeString) => {
        if (time) {
            const [hours, minutes] = timeString.split(':');
            
            setMsgData({
                ...msgData,
                hh: hours,
                mm: minutes
            });
            
            setSelectedTime(time);
        }
    };

    // Send message
    const msgSend = () => {
        Swal.fire({
            title: '<span style="font-size: 22px; font-weight: bold;">메세지를 전송 하시겠습니까?</span>',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: '확인',
            cancelButtonText: '취소',
            width: 440,
        }).then((result) => {
            if (result.isConfirmed) { 
                const retrieveListURL = '/divas/msg/msgSend.do';

                setMsgData({
                    ...msgData,
                    sms_type: $("#SMS_TYPE1").is(":checked") ? "0" : "1",
                    dd: $("#dd").val(),
                    sms_msg: $("#sms_msg").val()
                });

                // Collect mobile numbers from both address book and manual entries
                const mobileArray = [
                    ...receiverContacts.map(contact => contact.mobile),
                    ...manualReceivers.map(item => item.mobile)
                ];
                
                const dataToSend = {
                    ...msgData,
                    receiver_arr: mobileArray,
                    sms_msg: $("#sms_msg").val(),
                    organ_id: location.state.commonVO.organ_id,
                    user_id: location.state.commonVO.user_id
                };
                
                const requestOptions = {
                    method: "POST",
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(dataToSend)
                };

                EgovNet.requestFetch(retrieveListURL,
                    requestOptions,
                    (resp) => {
                        console.log("전송 결과:", resp);
                        setSearchCondition(history.location.state?.searchCondition 
                            || { search_sel: '1', search_text: '' });
                        Swal.fire({
                            title: '메세지를 전송 하였습니다.',
                            icon: 'success',
                            width: 440,
                            confirmButtonText: '확인',
                            timer: 3000,
                        }).then(() => {
                            const url = 'sms_hist.php';
                            const route = getRouteFromUrl(url);
                            history.push(route, { 
                                commonVO: location.state.commonVO,
                                topMenuList: location.state.topMenuList,
                                inMenuList: location.state.inMenuList,
                                timeDiff: location.state.timeDiff
                            });
                        });
                    },
                    function (resp) {
                        console.log("전송 오류:", resp);
                        Swal.fire({
                            title: '메세지 전송에 실패하였습니다.',
                            icon: 'error',
                            width: 440,
                            confirmButtonText: '확인',
                            timer: 3000,
                        });
                    }
                );
            }
        });
    };

    // Handle input changes
    const onChange = (e) => {
        const { value, name } = e.target; 
        setMsgData({
            ...msgData, 
            [name]: value 
        });
    };

    // Initial data fetch
    useEffect(() => {
        retrieveList(searchCondition);
    }, [searchCondition]);

    const [groupOptions, setGroupOptions] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(0);
    const [selectedTime, setSelectedTime] = useState(null);

    // Add this useEffect to automatically update the count when either collection changes
    useEffect(() => {
        setReceiverCount(receiverContacts.length + manualReceivers.length);
    }, [receiverContacts, manualReceivers]);

    console.log("------------------------------MsgSendContent [End]");
    console.groupEnd("MsgSendContent");

    return (
        <div id="content">
            <div className="main_contitle">
                <img src="../images/title_03_01.png" alt="SMS 전송"/>
            </div>
            <div className="right_bg">
                <ul className="tb_sms_set tb_sms">
                    <div className='set_ulwrap_nh'>
                        <li className="tb_sms_gry" style={{ paddingRight: "4.5% !important" }}>
                            <table className="set_tb bT_1gry">
                                <tbody>
                                    <tr>
                                        <td className="bg_lb w10 bold al_C">회신번호</td>
                                        <td className="w33">
                                            <input
                                                id="NUM_FROM_1"
                                                name="NUM_FROM_1"
                                                type="text"
                                                className="f333_12 date2322 bg_lgr_d"
                                                maxLength={4}
                                                defaultValue={sms_call.substring(0, 3)}
                                                readOnly={true}
                                            />
                                            -
                                            <input
                                                id="NUM_FROM_2"
                                                name="NUM_FROM_2"
                                                type="text"
                                                className="f333_12 date2322 bg_lgr_d"
                                                maxLength={4}
                                                defaultValue={sms_call.substring(3, 7)}
                                                readOnly={true}
                                            />
                                            -
                                            <input
                                                id="NUM_FROM_3"
                                                name="NUM_FROM_3"
                                                type="text"
                                                className="f333_12 date23222 bg_lgr_d"
                                                maxLength={4}
                                                defaultValue={sms_call.substring(7, 11)}
                                                readOnly={true}
                                            />
                                        </td>
                                        <td className="bg_lb w10 bold al_C">전송건수</td>
                                        <td className="w33">
                                            <input
                                                type="text"
                                                id="cnt"
                                                name="cnt"
                                                className="f333_12 date2322"
                                                value={receiverCount}
                                                readOnly={true}
                                            /> 건 전송
                                        </td>
                                        <td rowSpan="2" className="bg_lgs">
                                            <button
                                                type="button"
                                                id="btn_send"
                                                className="btn_bsb180"
                                                style={{ width: "100%", height: "100%", fontSize: "25px" }}
                                                onClick={msgSend}
                                            >
                                                전송
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="bg_lb w10 bold al_C">전송시각</td>
                                        <td colSpan="3">
                                            <input
                                                type="radio"
                                                id="SMS_TYPE1"
                                                name="SMS_TYPE"
                                                className="btn_radio"
                                                value="0"
                                                defaultChecked={true}
                                                onClick={() => handleMsgType(0)}
                                            />
                                            <span>일반문자 </span>
                                            <input
                                                type="radio"
                                                id="SMS_TYPE2"
                                                name="SMS_TYPE"
                                                className="btn_radio"
                                                value="1"
                                                onClick={() => handleMsgType(1)}
                                            />
                                            <span>예약문자 </span>
                                            <input
                                                type="text"
                                                name="DD"
                                                id="DD"
                                                value={msgData.dd || moment().format('YYYY-MM-DD')}
                                                className="f333_12 bg_lgr_d dp0"
                                                size="10"
                                                readOnly={true}
                                            />
                                            <span id="date-picker-container">
                                                <DatePicker
                                                    id="date-picker"
                                                    className="f333_12 mL10"
                                                    format="YYYY-MM-DD"
                                                    onChange={handleDateChange}
                                                    disabled={smsTypeFlag}
                                                    locale={locale}
                                                />
                                            </span>
                                            <span id="time-picker-container">
                                                <TimePicker
                                                    id="time-picker"
                                                    className="f333_12 mL10"
                                                    format="HH:mm"
                                                    onChange={handleTimeChange}
                                                    value={selectedTime}
                                                    disabled={smsTypeFlag}
                                                    minuteStep={1}
                                                    locale={locale}
                                                />
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </li>
                        <li className="li100" style={{ height: "680px", backgroundColor: "#fff" }}>
                            <div style={{ clear: "both" }} />
                            <div className="sms_con">
                            <ul>
                                <li className="sms_con_gry bg_dark_blue">주소록</li>
                                <li className="h13 bg_gry3">
                                    <Select
                                        id="SMS_GROUP_ID"
                                        name="SMS_GROUP_ID"
                                        className=""
                                        style={{ width: 200 }}
                                        defaultValue={0}
                                        options={groupOptions}
                                        onChange={(value) => {
                                            handleGroupChange(value);
                                        }}
                                    />
                                    <Button type="button" id="btn_all" className="btn_bs60"
                                        style={{ height: 27 }}
                                        onClick={selectAll}
                                    >
                                        전체추가
                                    </Button>
                                </li>
                                <li className="bg_w pB45p" style={{ height: "500px", overflowY: "scroll" }}>
                                    <table className="tb_data">
                                        <thead className="tb_data_tbg">
                                        <tr>
                                            <td className="bR_1gry w50i">이름</td>
                                            <td className="w50i">번호</td>
                                        </tr>
                                        </thead>
                                        <tbody id="list_table" style={{ height: "420px" }}>
                                            {addressBookContacts.map((contact, index) => (
                                                <tr 
                                                    key={`user_${index}`} 
                                                    id={`list_${contact.idx}`}
                                                    sms_group_id={contact.sms_group_id}
                                                    className="hi25"
                                                    onClick={(e) => clickReceiver(e)}
                                                >
                                                    <td className="bR_1gry">{contact.user_name}</td>
                                                    <td id="MOBILE">{contact.mobile}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </li>
                            </ul>
                            </div>
                            <div className="li10">
                                <div className="sms_btn">
                                    <button type="button" id="btn_in" className="btn_smsgry"
                                        onClick={waitIn}
                                    >
                                        <img src="../images/sms_btn_add2.png" alt="추가" />
                                    </button>
                                    <button type="button" id="btn_de" className="btn_smsgry"
                                        onClick={waitOut}
                                    >
                                        <img src="../images/sms_btn_del2.png" alt="삭제" />
                                    </button>
                                </div>
                            </div>
                            <MsgSendList  
                                removeAll={removeAll}
                                numberList={numberList}
                                receiverContacts={receiverContacts}
                                manualReceivers={manualReceivers}
                                addManualReceiver={addManualReceiver}
                                removeManualReceiver={removeManualReceiver}
                                clickReceiver={clickReceiver}
                            />
                        </li>
                        <div className="phone">
                            <textarea
                            id="sms_msg"
                            name="sms_msg"
                            className="textarea2"
                            style={{ resize: "none" }}
                            defaultValue={"여기에 메세지를 입력해 주세요"}
                            />
                            <br />
                            <div style={{ marginLeft: "70px" }}>
                                <span id="txt_size" style={{ color: "white" }}>SMS 전송</span>
                                <span id="byte" className="byte">
                                    29 / 80 byte
                                </span>
                            </div>
                            <button type="button" id="sms_renew" className="sms_renew"
                                onClick={smsRenew}
                            >
                            &nbsp;
                            </button>
                        </div>
                    </div>
                </ul>
            </div>
        </div>
    );
}

export default MsgSend;