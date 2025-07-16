import React, { useState, useEffect } from 'react';
import { DatePicker } from 'antd';
import locale from 'antd/es/date-picker/locale/ko_KR';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';

function RptSearch({ onSearch, searchVO, setSearchVO, type, sensorType, setSensorType }) {
    
    const [searchType, setSearchType] = useState(searchVO?.searchType || "H");
    const [startDate, setStartDate] = useState(
        searchVO?.startDate ? searchVO.startDate : dayjs().startOf('day')
    );
    const [endDate, setEndDate] = useState(
        searchVO?.endDate ? searchVO.endDate : dayjs().endOf('day')
    );

    // 센서 종류 변경
    const handleSensorTypeChange = (e) => {
        if (setSensorType) {
            setSensorType(e.target.value);
        }
    };

    // 검색 타입 변경
    const handleSearchTypeChange = (e) => {
        setSearchType(e.target.value);
        if(e.target.value === 'A') {
            setStartDate(endDate.subtract(7, 'day'));
        // }else {
        //     setEndDate(endDate);
        }
    };

    // 기간 30일 리미트
    const limitDate = (sdate, edate) => {
        const limit = 30;
        const diff = edate.diff(sdate, 'day');
        if(diff > limit) {
            return false;
        }
        return true;
    }


    // 날짜 변경 버튼
    const changeDate = (type, dateType) => {
        if(dateType === 'start') {
            if(type === 'left') {
                if(!limitDate(startDate.subtract(1, 'day'), endDate)) {
                    Swal.fire({
                        icon: 'error',
                        title: '오류',
                        text: '30일 이상 기간을 선택할 수 없습니다.',
                        confirmButtonText: '확인'
                    });
                    return;
                }
                setStartDate(startDate.subtract(1, 'day'));
            } else if(type === 'right') {
                if(!limitDate(startDate, endDate.add(1, 'day'))) {
                    Swal.fire({
                        icon: 'error',
                        title: '오류',
                        text: '30일 이상 기간을 선택할 수 없습니다.',
                        confirmButtonText: '확인'
                    });
                    return;
                }
                setStartDate(startDate.add(1, 'day'));
            }
        } else if(dateType === 'end') {
            if(type === 'left') {
                if(!limitDate(startDate, endDate.subtract(1, 'day'))) {
                    Swal.fire({
                        icon: 'error',
                        title: '오류',
                        text: '30일 이상 기간을 선택할 수 없습니다.',
                        confirmButtonText: '확인'
                    });
                    return;
                }
                setEndDate(endDate.subtract(1, 'day'));
            } else if(type === 'right') {
                if(!limitDate(startDate, endDate.add(1, 'day'))) {
                    Swal.fire({
                        icon: 'error',
                        title: '오류',
                        text: '30일 이상 기간을 선택할 수 없습니다.',
                        confirmButtonText: '확인'
                    });
                    return;
                }
                setEndDate(endDate.add(1, 'day'));
            }
        }
    };

    // 검색 실행
    const handleSearch = () => {
        const searchData = {
            searchType : searchType,
            startDate: startDate.format('YYYY-MM-DD 00:00:00'),
            endDate: endDate.format('YYYY-MM-DD 23:59:59')
        };
        
        setSearchVO({
            ...searchVO,
            ...searchData,
            startDate: startDate,
            endDate: endDate
        });
        
        onSearch(searchData);
    };

    // 일별이 아닌 경우 종료일을 시작일과 동일하게 설정
    useEffect(() => {
        if(searchType !== 'A') {
            setEndDate(startDate);
        }
    }, [searchType, startDate]);

    return (
        <li className="tb_sms_gry print_hd">
            <span className="sel_left_n">
                {/* AWS 타입일 때 센서 종류 선택 추가 */}
                {type === 'aws' && (
                    <>
                        구분 :
                        <select 
                            id="sensorType" 
                            name="sensorType" 
                            value={sensorType || "0"}
                            onChange={handleSensorTypeChange}
                            style={{marginLeft: '5px', marginRight: '15px', border: '1px solid #000'}}
                        >
                            <option value="0">강우</option>
                            <option value="3">온도</option>
                            <option value="4">풍향/풍속</option>
                            <option value="5">습도</option>
                        </select>
                        &nbsp;&nbsp;
                    </>
                )}
                검색 기간 :&nbsp;&nbsp;
                <input 
                    type="radio" 
                    className="btn_radio" 
                    name="sel_date" 
                    value="N" 
                    checked={searchType === "N"}
                    onChange={handleSearchTypeChange}
                />연간 
                <input 
                    type="radio" 
                    className="btn_radio" 
                    name="sel_date" 
                    value="D" 
                    checked={searchType === "D"}
                    onChange={handleSearchTypeChange}
                />월간 
                <input 
                    type="radio" 
                    className="btn_radio" 
                    name="sel_date" 
                    value="H" 
                    checked={searchType === "H"}
                    onChange={handleSearchTypeChange}
                />일간 
                <input 
                    type="radio" 
                    className="btn_radio" 
                    name="sel_date" 
                    value="A" 
                    checked={searchType === "A"}
                    onChange={handleSearchTypeChange}
                />일별 
                
                <button 
                    type="button" 
                    id="btn_left" 
                    className="btn_lbs_arr"
                    onClick={() => changeDate('left', 'start')}
                >
                    <img src="../images/arr_b.png" alt="◀" />
                </button>
                <DatePicker 
                    value={startDate} 
                    className="f333_12" 
                    onChange={date => {
                        if(!limitDate(date, endDate)) {
                            Swal.fire({
                                icon: 'error',
                                title: '오류',
                                text: '30일 이상 기간을 선택할 수 없습니다.',
                                confirmButtonText: '확인'
                            });
                            return;
                        }
                        setStartDate(date);
                    }}
                    format="YYYY-MM-DD"
                    locale={locale}
                    style={{textAlign: 'center', width: '100px'}}
                />
                <button 
                    type="button" 
                    id="btn_right" 
                    className="btn_lbs_arr mL0"
                    onClick={() => changeDate('right', 'start')}
                >
                    <img src="../images/arr_f.png" alt="▶" />
                </button>
                
                {/* 일별 선택 시에만 종료일 표시 */}
                {searchType === 'A' && (
                    <>
                        &nbsp;
                        <span className="mL3">-</span>
                        &nbsp;
                        <button 
                            type="button" 
                            id="btn_left2" 
                            className="btn_lbs_arr"
                            onClick={() => changeDate('left', 'end')}
                        >
                            <img src="../images/arr_b.png" alt="◀" />
                        </button>
                        <DatePicker 
                            value={endDate} 
                            className="f333_12" 
                            onChange={date => {
                                if(!limitDate(startDate, date)) {
                                    Swal.fire({
                                        icon: 'error',
                                        title: '오류',
                                        text: '30일 이상 기간을 선택할 수 없습니다.',
                                        confirmButtonText: '확인'
                                    });
                                    return;
                                }
                                setEndDate(date);
                            }}
                            format="YYYY-MM-DD"
                            locale={locale}
                            style={{textAlign: 'center', width: '100px'}}
                        />
                        <button 
                            type="button" 
                            id="btn_right2" 
                            className="btn_lbs_arr mL0"
                            onClick={() => changeDate('right', 'end')}
                        >
                            <img src="../images/arr_f.png" alt="▶" />
                        </button>
                    </>
                )}
                &nbsp;&nbsp;&nbsp;&nbsp;
            </span>
            <span id="button" className="sel_left_n">
                <button 
                    className="btn_bb80"
                    onClick={handleSearch}
                >
                    <span>검색</span>
                </button>
            </span>
        </li>
    );
}

export default RptSearch; 