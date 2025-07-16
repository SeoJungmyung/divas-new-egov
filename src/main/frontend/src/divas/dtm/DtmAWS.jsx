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

function DtmAWS(props) {

    console.group("DtmAWSContent");
    console.log("[Start] DtmAWSContent ------------------------------");
    console.log("DtmAWSContent [props] : ", props);

    const [areaListTag, setAreaListTag] = useState([]);
    const [listTag, setListTag] = useState([]);
    const [selectArea, setSelectArea] = useState([]);
    const [editTag, setEditTag] = useState([]);

    const [editData, setEditData] = useState({});
    const [startDate, setStartDate] = useState(dayjs());
    const location = useLocation();
        
    // useState를 사용하여 open상태를 변경한다. (open일때 true로 만들어 열리는 방식)
    const [modalOpen, setModalOpen] = useState(false);
    const [reload, setReload] = useState(false);

    // 센서 타입 매핑 함수 추가
    const getSensorTypeCode = (sensorType) => {
        const sensorMap = {
            'R': 1,   // 우량
            'T': 2,   // 온도
            'WD': 3,  // 풍향
            'WV': 4,  // 풍속
            'H': 5    // 습도
        };
        return sensorMap[sensorType] || 1;
    };

    const openModal = (e) => {
        // let pE = e.target.parentElement;
        let rtuName = e.target.getAttribute("data-rtuname");
        let hText =  e.target.getAttribute("data-hour");
        let sensor =  e.target.getAttribute("data-sensor");
        let dateFormat = common.toStringByFormatting(startDate.toDate());
        hText = hText < 10 ? "0" + hText : hText + "";
        
        let selectData = {
            area_code : e.target.getAttribute("data-areacode"),
            type : 'H',
            sdate : startDate.format('YYYY-MM-DD'),
            hour : hText,
            sensor_type : getSensorTypeCode(sensor)  // 문자열을 숫자로 변환
        };

        setEditData(selectData);

        const retrieveListURL = '/divas/dtm/getAWS10m.do';
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(selectData)
        }

        const sensorName = {
            'R' : '우량',
            'T' : '온도',
            'WD' : '풍향',
            'WV' : '풍속',
            'H' : '습도'
        }

        // 초기화 해줄 것
        setEditTag([]);
        EgovNet.requestFetch(retrieveListURL,
            requestOptions,
            (resp) => {
                let mutListTag = [];

                if(sensor === 'WD'){
                    // console.log("resp : ", resp);
                    // 풍향 센서는 고정된 테이블 구조 사용
                    mutListTag.push(
                        <table key="wd-table" className="tb_data_p2 bL_1gry mT10 bg_gry3">
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
                                <tr id="select">
                                    {Array.from({length: 6}, (_, i) => (
                                        <td key={i} className={i === 0 ? "" : "bL_1black"}>
                                            <select 
                                                id={`min_s_${i+1}`} 
                                                name="min[]" 
                                                className="al_c" 
                                                style={{width: '63px'}}
                                                defaultValue={resp.result.resultList[i]?.wind_deg}
                                            >
                                                <option value="-99999">-</option>
                                                <option value="0">북</option>
                                                <option value="1">북북동</option>
                                                <option value="2">북동</option>
                                                <option value="3">동북동</option>
                                                <option value="4">동</option>
                                                <option value="5">동남동</option>
                                                <option value="6">남동</option>
                                                <option value="7">남남동</option>
                                                <option value="8">남</option>
                                                <option value="9">남남서</option>
                                                <option value="10">남서</option>
                                                <option value="11">서남서</option>
                                                <option value="12">서</option>
                                                <option value="13">서북서</option>
                                                <option value="14">북서</option>
                                                <option value="15">북북서</option>
                                            </select>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    );
                    mutListTag.push(
                        <div key="title" style={{textAlign: 'center', marginTop: '10px'}}>
                            {rtuName + " "+ sensorName[sensor] + " "+ dateFormat+ " " + hText + "시 데이터"}
                        </div>
                    );
                } else {
                    // 다른 센서들은 기존 로직 유지
                    let tdTag = [];
                    resp.result.resultList.forEach(function (item, index) {
                        let rain = sensor === 'R' && item.rain !== -99999 ? common.toFixedOfNum(item.rain, 1, 0.01) : 
                            sensor === 'T' && item.temp !== -99999 ? common.toFixedOfNum(item.temp, 1, 0.01) : 
                            sensor === 'H' && item.humi !== -99999 ? common.toFixedOfNum(item.humi, 1, 0.01) : 
                            sensor === 'WV' && item.wind_vel !== -99999 ? common.toFixedOfNum(item.wind_vel, 1, 0.01) : "";
                        if(index === 0){
                            tdTag.push(
                                <td key={index}><input type="text" id={"min_"+(index+1)} name={"min_"+(index+1)} className="f333_12 al_c"
                                defaultValue={rain}/></td>
                            );
                        }else{
                            tdTag.push(
                                <td key={index} className="bL_1black"><input type="text" id={"min_"+(index+1)} name={"min_"+(index+1)} className="f333_12 al_c"
                                defaultValue={rain}/></td>
                            );
                        }
                    });
                    
                    mutListTag.push(
                        <tr key={"m1"}>{tdTag}</tr>
                    );
                    mutListTag.push(
                        <tr key={"m2"}><td colSpan={6}>{rtuName + " "+ sensorName[sensor] + " "+ dateFormat+ " " + hText + "시 데이터"}</td></tr>
                    );
                }
                
                setEditTag(mutListTag);
            },
            function (resp) {
                console.log("err response : ", resp);
            }
        );
        // open Modal
        setModalOpen(true);
    };

    const saveModal = (e) => {
        let dataArr = [];
        if(editData.sensor_type === 3){
            $.each($("#tableData select"), function(i, v){
                dataArr[i] = $(v).val();
            });
        }else{
            $.each($("#tableData input"), function(i, v){
                dataArr[i] = $(v).val();
            });
        }
        
        let dateFormat = startDate.format('YYYY-MM-DD');

        // console.log("editData : ", editData);
        let selectData = {
            area_code : editData.area_code,
            sdate : dateFormat,
            hour : editData.hour,
            dtmArr : dataArr,
            sensor_type : editData.sensor_type  // 이미 숫자로 변환된 값
        };

        const retrieveListURL = '/divas/dtm/setAWSData.do';
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
        // close modal
        setModalOpen(false);
    };

    const closeModal = (e) => {
        // close modal
        setModalOpen(false);
    };

    const retrieveList = (startDate) => {
        const params = {
            ...location.state?.commonVO,
            type : 'H',
            'sdate': startDate.format('YYYY-MM-DD')
        };
        
        const retrieveListURL = '/divas/dtm/actionDtmAWS.do';
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
                let areaTag = [];
                
                // Check if no data is available
                if (!resp.result.resultRtu || resp.result.resultRtu.length < 1) {
                    mutListTag.push(<p key="no-data" className="no_data">검색된 결과가 없습니다.</p>);
                    setListTag(mutListTag);
                    return;
                }

                // console.log('resp.result : ', resp.result);
                // Process data for each RTU
                resp.result.resultRtu.forEach(function (item, index) {
                    const areaCode = item.area_code;
                    const awsList = resp.result.resultAWS[areaCode] || [];
                    const rtuName = item.rtu_name;
                    if(index === 0) setSelectArea(areaCode);
                    
                    // Build area select options
                    areaTag.push(
                        <option key={index} value={areaCode}>{item.rtu_name}</option>
                    );
                    
                    if (awsList.length > 0) {
                        // Group data by sensor type
                        const sensorGroups = {
                            'R': [], // Rain
                            'T': [], // Temperature  
                            'W': [], // Wind
                            'H': []  // Humidity
                        };
                        
                        awsList.forEach(val => {
                            if (sensorGroups[val.sensing]) {
                                sensorGroups[val.sensing].push(val);
                            }
                        });
                        // console.log('sensorGroups : ', sensorGroups);
                        // Create rows for each sensor type
                        Object.keys(sensorGroups).forEach(sensorType => {
                            const sensorData = sensorGroups[sensorType];
                            if (sensorData.length > 0) {
                                
                                if (sensorType === 'W') {
                                    // 풍향 행 (1 번째 행)
                                    let tdTagWindDeg = [];
                                    
                                    sensorData.forEach(val => {
                                        let displayValue = val.wind_deg;
                                        
                                        tdTagWindDeg.push(
                                            <td 
                                                key={`wind_deg-${val.num}`}
                                                data-areacode={areaCode}
                                                data-rtuname={rtuName}
                                                data-hour={val.num} 
                                                data-sensor={'WD'}
                                                className="pointer" 
                                                onClick={openModal}
                                            >
                                                {displayValue}
                                            </td>
                                        );
                                    });
                                    
                                    // 풍향 평균 계산
                                    const windDegAvg = "-";
                                    // 풍향 평균값 -> 풍향 텍스트로 출력
                                    // console.log("windDegAvg : ", windDegAvg);
                                    tdTagWindDeg.push(
                                        <td key={`wind_deg-avg`} className="bL_1gry">
                                            {windDegAvg}
                                        </td>
                                    );

                                    // 풍속 행 (2 번째 행)
                                    let tdTagWindVel = [];
                                    let windVelSum = 0;
                                    let windVelCount = 0;
                                    
                                    sensorData.forEach(val => {
                                        let displayValue = val.wind_vel === -99999 ? "-" : common.toFixedOfNum(val.wind_vel, 1, 0.01);
                                        
                                        // 평균 계산을 위한 값 수집
                                        if (val.wind_vel !== -99999) {
                                            windVelSum += val.wind_vel;
                                            windVelCount++;
                                        }
                                        
                                        tdTagWindVel.push(
                                            <td 
                                                key={`wind_vel-${val.num}`}
                                                data-areacode={areaCode}
                                                data-rtuname={rtuName}
                                                data-hour={val.num} 
                                                data-sensor={'WV'}
                                                className="pointer" 
                                                onClick={openModal}
                                            >
                                                {displayValue}
                                            </td>
                                        );
                                    });
                                    
                                    // 풍속 평균 계산
                                    const windVelAvg = windVelCount > 0 ? common.toFixedOfNum(windVelSum / windVelCount, 1, 0.01) : "-";
                                    tdTagWindVel.push(
                                        <td key={`wind_vel-avg`} className="bL_1gry">
                                            {windVelAvg}
                                        </td>
                                    );
                                    
                                    const rowClass = index === 0 ? "" : "dp0";
                                    
                                    // 풍향 행 추가
                                    mutListTag.push(
                                        <tr key={`${areaCode}-wind_deg`} data-ac={areaCode} className={rowClass}>
                                            {tdTagWindDeg}
                                        </tr>
                                    );
                                     
                                    // 풍속 행 추가
                                    mutListTag.push(
                                        <tr key={`${areaCode}-wind_vel`} data-ac={areaCode} className={rowClass}>
                                            {tdTagWindVel}
                                        </tr>
                                    );
                                } else {
                                    // 다른 센서 타입들 (R, T, H)
                                    let tdTag = [];
                                    let sum = 0;
                                    let count = 0;
                                    
                                    sensorData.forEach(val => {
                                        let displayValue = "-";
                                        let currentValue = null;
                                        
                                        switch(sensorType) {
                                            case 'R':
                                                displayValue = val.rain === -99999 ? "-" : common.toFixedOfNum(val.rain, 1, 0.01);
                                                currentValue = val.rain;
                                                break;
                                            case 'T':
                                                displayValue = val.temp === -99999 ? "-" : common.toFixedOfNum(val.temp, 1, 0.01);
                                                currentValue = val.temp;
                                                break;
                                            case 'H':
                                                displayValue = val.humi === -99999 ? "-" : common.toFixedOfNum(val.humi, 1, 0.01);
                                                currentValue = val.humi;
                                                break;
                                        }
                                        
                                        // 누계/평균 계산을 위한 값 수집
                                        if (currentValue !== -99999) {
                                            sum += currentValue;
                                            count++;
                                        }
                                        
                                        tdTag.push(
                                            <td 
                                                key={`${sensorType}-${val.num}`}
                                                data-areacode={areaCode}
                                                data-rtuname={rtuName}
                                                data-hour={val.num} 
                                                data-sensor={val.sensing}
                                                className="pointer" 
                                                onClick={openModal}
                                            >
                                                {displayValue}
                                            </td>
                                        );
                                    });
                                    
                                    // 누계/평균 계산
                                    let finalValue = "-";
                                    if (count > 0) {
                                        if (sensorType === 'R') {
                                            // 강우는 누계(합계)
                                            finalValue = common.toFixedOfNum(sum, 1, 0.01);
                                        } else {
                                            // 온도, 습도는 평균
                                            finalValue = common.toFixedOfNum(sum / count, 1, 0.01);
                                        }
                                    }
                                    
                                    // 누계/평균 컬럼 추가
                                    tdTag.push(
                                        <td key={`${sensorType}-final`} className="bL_1gry">
                                            {finalValue}
                                        </td>
                                    );
                                    
                                    const rowClass = index === 0 ? "" : "dp0";
                                    mutListTag.push(
                                        <tr key={`${areaCode}-${sensorType}`} data-ac={areaCode} className={rowClass}>
                                            {tdTag}
                                        </tr>
                                    );
                                }
                            }
                        });
                    }
                });
                
                setListTag(mutListTag);
                setAreaListTag(areaTag);
            },
            function (resp) {
                console.log("err response : ", resp);
            }
        );
    }

    const onChange = (e) => {
        setSelectArea(e.target.value);
        $.each($("#view_table tbody tr"), function(i, v){
            if($(v).attr("data-ac") === e.target.value){
                $(v).removeClass("dp0");
            }else{
                $(v).addClass("dp0");
            }
        });
    }

    // Updated
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

    console.log("------------------------------DtmAWSContent [End]");
    console.groupEnd("DtmAWSContent");

    return (
        <div id="content">
            <div className="main_contitle">
                <img src="../images/title_04_06.png" alt="AWS 자료" />
                <div className="unit">[단위 : m]</div>
            </div>
            <div className="right_bg">
                <ul className="set_ulwrap_nh">
                    <li className="tb_sms_gry">
                        <span className="sel_left80_np">
                            지역 :
                            <select
                                id="area_code"
                                name="area_code"
                                onChange={onChange} 
                                style={{border: '1px solid #000', marginLeft: '5px'}}
                                value={selectArea.area_code}
                            >
                                {areaListTag}
                            </select>
                            &nbsp;&nbsp;
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
                            &nbsp;&nbsp;
                        </span>
                    </li>
                    <li className="li100_nor">
                        <div className="tb_data">
                        <ul>
                            <li className="li10" style={{ borderBottom: "none" }}>
                                <div className="tb_data">
                                    <ul>
                                        <li className="w100400">
                                            <table className="tb_data_left  w100">
                                                <thead>
                                                    <tr className="tb_data_tbg h38p">
                                                        <th colSpan={2} className="bL0">
                                                            구분
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="bL0">우량 (mm)</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="bL0">온도 (℃)</td>
                                                    </tr>
                                                    <tr className="h64p">
                                                        <td className="bL0">풍향 / 풍속 (㎧)</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="bL0">습도 (%)</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li className="li90">
                                <table id="view_table" className="tb_data">
                                    <thead className="tb_data_tbg h38p">
                                        <tr>
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
                                            <td className="bL_1gry li2_9" style={{lineHeight: '19px'}}>누계／평균</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listTag}
                                    </tbody>
                                </table>
                                <Modal
                                    title={
                                        <div className="popup_top" style={{marginTop: "-8px"}}>
                                            <span id="rtu_name"></span>AWS 자료 수정
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
                                            <input type="hidden" id="mode" name="mode" value="aws_save" />
                                            <input type="hidden" id="p_area_code" name="area_code" value={editData.area_code || ''} />
                                            <input type="hidden" id="p_sdate" name="sdate" value={editData.sdate || ''} />
                                            <input type="hidden" id="p_hour" name="hour" value={editData.hour || ''} />
                                            <input type="hidden" name="type" value="10" />
                                            <div className="pop_stitle">
                                                수정 일시 : <span id="sel_date">{editData.sdate ? `${editData.sdate} ${editData.hour}시` : ''}</span>
                                            </div>
                                            {editData.sensor_type === 3 ? ( // 풍향 센서인 경우 (getSensorTypeCode('WD') === 3)
                                                <div id="tableData">
                                                    {editTag}
                                                </div>
                                            ) : (
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
                                            )}
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
                                        </form>
                                    </div>
                                </Modal>
                            </li>
                        </ul>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default DtmAWS;