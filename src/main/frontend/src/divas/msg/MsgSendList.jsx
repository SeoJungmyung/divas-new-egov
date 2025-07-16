import React, { useState } from 'react';
import { Input, Button, Form, Row, Col } from 'antd';
import Swal from 'sweetalert2';

function MsgSendList(props) {
    const [form] = Form.useForm();
    
    // State for phone number fields
    const [phoneState, setPhoneState] = useState({
        NUM_TO_1: '',
        NUM_TO_2: '',
        NUM_TO_3: '',
    });

    // Handle input changes
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setPhoneState({
            ...phoneState,
            [id]: value,
        });
    };

    // Add a manual phone number
    const addChild = () => {
        const { NUM_TO_1, NUM_TO_2, NUM_TO_3 } = phoneState;
        
        const tmp_val = `${NUM_TO_1}-${NUM_TO_2}-${NUM_TO_3}`;
        
        const check = /^\d{2,3}-\d{3,4}-\d{4}$/;
        
        // Check if the number already exists in the address book
        if (!NUM_TO_2 || !NUM_TO_3) {
            Swal.fire("체크", "수신번호를 입력해 주세요.", "warning");
            return false;
        } else if (!check.test(tmp_val)) {
            Swal.fire("체크", "수신번호를 확인해 주세요.", "warning");
            return false;
        } else if (props.numberList.includes(tmp_val)) {
            Swal.fire("체크", "주소록에 존재하는 번호 입니다.", "warning");
            return false;
        } else if (
            props.manualReceivers.some(r => r.mobile === tmp_val) ||
            props.receiverContacts.some(r => r.mobile === tmp_val)
        ) {
            Swal.fire("체크", "수신번호에 존재하는 번호 입니다.", "warning");
            return false;
        } else {
            // Add to manual receivers list through parent component
            props.addManualReceiver(tmp_val);
            
            // Reset form fields
            setPhoneState({
                NUM_TO_1: '',
                NUM_TO_2: '',
                NUM_TO_3: ''
            });
        }
    };
    
    // Delete all receivers
    const deleteAll = () => {
        props.removeAll();
    };

    return (
        <div className="sms_con">
            <ul>
                <li className="sms_con_gry bg_dark_blue">수신번호</li>
                <li className="h13 bg_gry3">
                    <Form form={form} layout="inline">
                        <Row align="middle">
                            <Col>
                                <Input
                                    id="NUM_TO_1"
                                    value={phoneState.NUM_TO_1}
                                    onChange={handleInputChange}
                                    maxLength={3}
                                    style={{ width: 50, height: 28, margin: "0 5px" }}
                                />
                            </Col>
                            <Col>-</Col>
                            <Col>
                                <Input
                                    id="NUM_TO_2"
                                    value={phoneState.NUM_TO_2}
                                    onChange={handleInputChange}
                                    maxLength={4}
                                    style={{ width: 60, height: 28, margin: "0 5px" }}
                                />
                            </Col>
                            <Col>-</Col>
                            <Col>
                                <Input
                                    id="NUM_TO_3"
                                    value={phoneState.NUM_TO_3}
                                    onChange={handleInputChange}
                                    maxLength={4}
                                    style={{ width: 60, height: 28, margin: "0 5px" }}
                                />
                            </Col>
                            <Col>
                                <Button 
                                    type="primary" 
                                    onClick={addChild}
                                    className="btn_bs60"
                                    style={{ height: 27 }}
                                >
                                    번호추가
                                </Button>
                            </Col>
                            <Col>
                                <Button 
                                    type="default" 
                                    onClick={deleteAll}
                                    className=""
                                    style={{ height: 29, width: 60, marginLeft: 5, fontSize: 12 }}
                                >
                                    전체삭제
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </li>
                <li className="bg_w pB45p" style={{ height: "500px", overflow: "auto" }}>
                    <table className="tb_data">
                        <thead className="tb_data_tbg">
                            <tr>
                                <td className="bR_1gry w50i">이름</td>
                                <td className="w50i">번호</td>
                            </tr>
                        </thead>
                        <tbody id="list_table2">
                            {/* Render address book contacts in receiver list */}
                            {props.receiverContacts.map((contact, index) => (
                                <tr 
                                    key={`receiver_${index}`} 
                                    id={`list_${contact.idx}`}
                                    className="hi25"
                                    onClick={props.clickReceiver}
                                >
                                    <td className="bR_1gry">{contact.user_name}</td>
                                    <td name="MOBILE">{contact.mobile}</td>
                                </tr>
                            ))}
                            
                            {/* Render manually added numbers */}
                            {props.manualReceivers.map((item, index) => (
                                <tr 
                                    key={`manual_${index}`} 
                                    id={item.id}
                                    className="notList hi25"
                                    onClick={props.clickReceiver}
                                >
                                    <td className="bR_1gry">-</td>
                                    <td name="MOBILE">{item.mobile}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </li>
            </ul>
        </div>
    );
}

export default MsgSendList;