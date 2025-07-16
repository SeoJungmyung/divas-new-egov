import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as EgovNet from 'context/egovFetch';
import { DatePicker } from 'antd';
import locale from 'antd/es/date-picker/locale/ko_KR';
import * as common from 'js/common';
import $ from 'jquery';
import { Modal } from 'antd';
import dayjs from 'dayjs';
import { common_modal } from 'js/common';

function DtmFlow(props) {

    console.group("DtmFlowContent");
    console.log("[Start] DtmFlowContent ------------------------------");
    console.log("DtmFlowContent [props] : ", props);

    const [listTag, setListTag] = useState([]);
    const [editTag, setEditTag] = useState([]);

    const [editData, setEditData] = useState({});
    const [startDate, setStartDate] = useState(dayjs());
    const location = useLocation();
        
    const [modalOpen, setModalOpen] = useState(false);
    const [reload, setReload] = useState(false);

    const openModal = (e) => {
        let pE = e.target.parentElement;
        let rtuName = $(pE).children(":eq(0)").html();
        let hText =  e.target.getAttribute("data-hour");
        let dateFormat = common.toStringByFormatting(startDate.toDate());
        hText = hText < 10 ? "0" + hText : hText + "";
        let selectData = {
            area_code : e.target.getAttribute("data-areaCode"),
            sdate : startDate.format('YYYY-MM-DD'),
            hour : hText
        };

        setEditData(selectData);

        const retrieveListURL = '/divas/dtm/getFlow10m.do';
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(selectData)
        }

        setEditTag([]);
        EgovNet.requestFetch(retrieveListURL,
            requestOptions,
            (resp) => {
                let mutListTag = [];
                let tdTag = [];
                resp.result.resultList.forEach(function (item, index) {
                    let flow = "";
                    flow = item.flow === -99999 ? "" : common.toFixedOfNum(item.flow, 2, 0.01);
                    if(index === 0){
                        tdTag.push(
                            <td><input type="text" id={"min_"+(index+1)} name={"min_"+(index+1)} className="f333_12 al_c"
                            defaultValue={flow}/></td>
                        );
                    }else{
                        tdTag.push(
                            <td className="bL_1black"><input type="text" id={"min_"+(index+1)} name={"min_"+(index+1)} className="f333_12 al_c"
                            defaultValue={flow}/></td>
                        );
                    }
                });
                mutListTag.push(
                    <tr key={"m1"}>{tdTag}</tr>
                );
                mutListTag.push(
                    <tr key={"m2"}><td colSpan={6}>{rtuName + " "+ dateFormat+ " " + hText + "시 데이터"}</td></tr>
                );
                mutListTag.push();
                setEditTag(mutListTag);
            },
            function (resp) {
                console.log("err response : ", resp);
            }
        );
        setModalOpen(true);
    };

    const saveModal = (e) => {

        let dataArr = [];
        $.each($("#tableData input"), function(i, v){
            dataArr[i] = $(v).val();
        });
        let dateFormat = startDate.format('YYYY-MM-DD');

        let selectData = {
            area_code : editData.area_code,
            sdate : dateFormat,
            hour : editData.hour,
            dtmArr : dataArr
        };

        const retrieveListURL = '/divas/dtm/setFlowData.do';
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(selectData)
        }

        EgovNet.requestFetch(retrieveListURL,
            requestOptions,
            (resp) => {
                if(resp.resultCode === 200){
                    setReload(!reload);
                }
            },
            function (resp) {
                console.log("err response : ", resp);
            }
        );
        setModalOpen(false);
    };

    const closeModal = (e) => {
        setModalOpen(false);
    };

    const retrieveList = (startDate) => {
        const params = {
            ...location.state.commonVO,
            type : 'H',
            sdate: startDate.format('YYYY-MM-DD')
        };
        const retrieveListURL = '/divas/dtm/actionDtmFlow.do';
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(params)
        }

        EgovNet.requestFetch(retrieveListURL,
            requestOptions,
            (resp) => {
                let mutListTag = [];
                
                if (!resp.result.resultRtu || resp.result.resultRtu.length < 1) {
                    mutListTag.push(<p key="no-data" className="no_data">검색된 결과가 없습니다.</p>);
                    setListTag(mutListTag);
                    return;
                }

                resp.result.resultRtu.forEach((item, index) => {
                    const areaCode = item.area_code;
                    const flowData = resp.result.resultFlow[areaCode] || [];
                    let tdTag = [];
                    
                    tdTag.push(
                        <td key={`rtu-${index}`} className="bR_1gry">{item.rtu_name}</td>
                    );
                    
                    if (flowData.length > 0) {
                        flowData.forEach((val) => {
                            const flow = val.flow === -99999 ? "-" : common.toFixedOfNum(val.flow, 2, 0.01);
                            
                            tdTag.push(
                                <td 
                                    key={`flow-${index}-${val.num}`}
                                    data-areaCode={areaCode} 
                                    data-hour={val.num} 
                                    className="pointer" 
                                    onClick={openModal}
                                >
                                    {flow}
                                </td>
                            );
                        });
                    }
                    
                    mutListTag.push(
                        <tr key={`row-${index}`}>{tdTag}</tr>
                    );
                });
                
                setListTag(mutListTag);
            },
            (resp) => {
                console.log("err response : ", resp);
            }
        );

    }

    const changeDate = (type) => {
        if(type === "left"){
            setStartDate(startDate.subtract(1, 'day'));
        }else if(type === "right"){
            setStartDate(startDate.add(1, 'day'));
        }
    }

    useEffect(() => {
        retrieveList(startDate);
        return () => {
        }
    }, [reload, startDate]);

    console.log("------------------------------DtmFlowContent [End]");
    console.groupEnd("DtmFlowContent");

    return (
        <div id="content">
            <div className="main_contitle">
                <img src="../images/title_04_03.png" alt="수위 자료" />
                <div className="unit">[단위 : m]</div>
            </div>
            <div className="right_bg">
                <ul className="set_ulwrap_nh">
                    <li className="tb_sms_gry">
                        <span className="sel_left80_np">
                            검색 날짜 :
                            <button type="button" id="btn_left" className="btn_lbs_arr" 
                                onClick={() => changeDate("left")}>
                                <img src="../images/arr_b.png" alt="◀" />
                            </button>
                            <DatePicker 
                                value={startDate} 
                                className="f333_12" 
                                onChange={date => setStartDate(date)}
                                format="YYYY-MM-DD"
                                locale={locale}
                                style={{textAlign: 'center'}}
                            />
                            <button type="button" id="btn_right" className="btn_lbs_arr" 
                                onClick={() => changeDate("right")}>
                                <img src="../images/arr_f.png" alt="▶" />
                            </button>
                        </span>
                    </li>
                    <li className="li100_nor">
                        <table id="view_table" className="tb_data">
                            <thead className="tb_data_tbg">
                                <tr>
                                <td className="w10i bR_1gry">구분</td>
                                <td>00</td>
                                <td>01</td>
                                <td>02</td>
                                <td>03</td>
                                <td>04</td>
                                <td>05</td>
                                <td>06</td>
                                <td>07</td>
                                <td>08</td>
                                <td>09</td>
                                <td>10</td>
                                <td>11</td>
                                <td>12</td>
                                <td>13</td>
                                <td>14</td>
                                <td>15</td>
                                <td>16</td>
                                <td>17</td>
                                <td>18</td>
                                <td>19</td>
                                <td>20</td>
                                <td>21</td>
                                <td>22</td>
                                <td>23</td>
                                </tr>
                            </thead>
                            <tbody>
                                {listTag}
                            </tbody>
                        </table>
                        <Modal
                            title={
                                <div className="popup_top" style={{marginTop: "-8px"}}>
                                    <span id="rtu_name"></span>수위 자료 수정
                                    <button id="popup_close" className="btn_pop_blue fR bold" onClick={closeModal}>X</button>
                                </div>
                            }
                            open={modalOpen}
                            footer={null}
                            width={450}
                            className="popup_layout_e"
                            centered
                            maskClosable={false}
                            closable={false}
                            style={{ top: '20%' }}
                        >
                            <div className="popup_con_2">
                                <form id="dtm_frm" name="dtm_frm" method="post">
                                    <input type="hidden" id="mode" name="mode" value="flow_save" />
                                    <input type="hidden" id="p_area_code" name="area_code" value={editData.area_code || ''} />
                                    <input type="hidden" id="p_sdate" name="sdate" value={editData.sdate || ''} />
                                    <input type="hidden" id="p_hour" name="hour" value={editData.hour || ''} />
                                    <input type="hidden" name="type" value="10" />
                                    <div className="pop_stitle">
                                        수정 일시 : <span id="sel_date">{editData.sdate ? `${editData.sdate} ${editData.hour}시` : ''}</span>
                                    </div>
                                    <table id="tableData" className="tb_data_p2 bL_1gry mT10 bg_gry3">
                                        <thead>
                                            <tr className="tb_data_tbg bT_1blue2">
                                                <th>00-09분</th>
                                                <th className="bL_1blue2">10-19분</th>
                                                <th className="bL_1blue2">20-29분</th>
                                                <th className="bL_1blue2">30-39분</th>
                                                <th className="bL_1blue2">40-49분</th>
                                                <th className="bL_1blue2">50-59분</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {editTag}
                                        </tbody>
                                    </table>
                                    <div className="w100 fL mT10 al_C">
                                        <button type="button" 
                                            className="btn_bb80 btn_save" 
                                            onClick={() => {
                                                common_modal("confirm", "저장 확인", "저장하시겠습니까?", () => {
                                                    saveModal();
                                                }, () => {
                                                    console.log("취소");
                                                });
                                            }}
                                        >
                                            저장
                                        </button>
                                    </div>
                                    <div id="spin"></div>
                                </form>
                            </div>
                        </Modal>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default DtmFlow;