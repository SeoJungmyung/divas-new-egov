import React, { useState, useEffect } from 'react';
import * as EgovNet from 'context/egovFetch';
import { useLocation } from 'react-router-dom';
import { DatePicker, Table } from 'antd';
import locale from 'antd/es/date-picker/locale/ko_KR';
import * as common from 'js/common';
import dayjs from 'dayjs';

import Graph from './GraphFor10m';

function Rpt10m(props) {

    console.group("Rpt10mContent");
    console.log("[Start] Rpt10mContent ------------------------------");
    console.log("Rpt10mContent [props] : ", props);

    const [tableData, setTableData] = useState([]);
    const [optionTag, setOptionTag] = useState([]);
    const [gData, setGraphData] = useState([]);
    const [unit, setUnit] = useState("mm");
    const [option, setOption] = useState("0");
    const [areaCode, setAreaCode] = useState("");
    const [loading, setLoading] = useState(false);

    const location = useLocation();
    
    const [searchVO, setSearchVO] = useState(
        { 
            type : "M",
            sdate : dayjs().startOf('day'), edate : dayjs(), area_code : null,
            w_sensertype : option,
            ...location.state.commonVO
        });
    const [startDate, setStartDate] = useState(dayjs().startOf('day'));
    const [endDate, setEndDate] = useState(dayjs());

    // 테이블 컬럼 정의
    const columns = option === "4" ? [
        {
            title: '시간',
            dataIndex: 'time',
            key: 'time',
            width: 140,
            align: 'center',
            style: { backgroundColor: '#ebf5fb' }
        },
        {
            title: <div>풍향 <img src="../images/wind/wind_ico.png" alt="풍향" /></div>,
            dataIndex: 'data2',
            key: 'data2',
            width: 100,
            align: 'center',
            style: { backgroundColor: '#ebf5fb' }
        },
        {
            title: '풍속(㎧)',
            dataIndex: 'data',
            key: 'data',
            width: 110,
            align: 'center',
            style: { backgroundColor: '#ebf5fb' }
        }
    ] : [
        {
            title: '시간',
            dataIndex: 'time',
            key: 'time',
            width: 150,
            align: 'center',
            style: { backgroundColor: '#ebf5fb' }
        },
        {
            title: '자료',
            dataIndex: 'data',
            key: 'data',
            width: 120,
            align: 'center',
            style: { backgroundColor: '#ebf5fb' }
        },
    ];


    const handleSearch = () => {
        retrieveList(searchVO);
    }

    const selectOption = (e) => {
        const type = e.target.value;
        setOption(type);
        setUnit(type === "0" ? "mm" : type === "1" ? "m" : type === "2" ? "cm" : type === "3" ? "℃" : type === "4" ? "㎧" : type === "5" ? "%" : type === "7" ? "mm" : "");
        const newSearchVO = {
            ...searchVO,
            sensor_type : type,
            w_sensertype : type !== "7" && type > "3" ? "3" : type,
            area_code : ""
        }
        setSearchVO(newSearchVO);
        retrieveList(newSearchVO);
    }

    const selectRtu = (e) => {
        setAreaCode(e.target.value);
        setSearchVO({
            ...searchVO,
            area_code : e.target.value
        })
    }

    const changeDate = (direction, type) => {
        if (type === 'start') {
            if (direction === 'left') {
                const newDate = startDate.subtract(1, 'day');
                setStartDate(newDate);
                setSearchVO({
                    ...searchVO,
                    sdate: newDate
                });
            } else {
                const newDate = startDate.add(1, 'day');
                setStartDate(newDate);
                setSearchVO({
                    ...searchVO,
                    sdate: newDate
                });
            }
        } else {
            if (direction === 'left') {
                const newDate = endDate.subtract(1, 'day');
                setEndDate(newDate);
                setSearchVO({
                    ...searchVO,
                    edate: newDate
                });
            } else {
                const newDate = endDate.add(1, 'day');
                setEndDate(newDate);
                setSearchVO({
                    ...searchVO,
                    edate: newDate
                });
            }
        }
    }

    // 이미지 렌더링 함수
    const renderWindImage = (data2Value) => {
        return data2Value === "-" ? "-" : (
        <img 
            src={`../images/wind/${data2Value}`} 
            alt="풍향" 
            // style={{ width: '20px', height: '20px' }}
        />
        );
    };

    const retrieveList = (searchVO) => {
        setLoading(true);
        const retrieveListURL = '/divas/rpt/actionRpt10m.do';
        
        // 날짜를 문자열로 변환하여 API 호출용 객체 생성
        const apiSearchVO = {
            ...searchVO,
            type : "M",
            sdate: searchVO.sdate ? searchVO.sdate.format('YYYY-MM-DD HH:mm:00') : null,
            edate: searchVO.edate ? searchVO.edate.format('YYYY-MM-DD HH:mm:ss') : null
        };
        
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(apiSearchVO)
        }
        // console.log("retrieveList [apiSearchVO] : ", apiSearchVO);
        EgovNet.requestFetch(retrieveListURL,
            requestOptions,
            (resp) => {
                let rtuNames = [];
                let grpData = [];
                let tableDataList = [];
                
                // console.log("resp.result.rtuList : ", resp.result.rtuList);
                if(resp.result.rtuList.length < 1){
                    rtuNames.push(<option value="">장비 없음</option>);
                }

                // 장비 리스트 항목 구성
                resp.result.rtuList.forEach(function (item, index) {
                    let areaCode = item.area_code;

                    rtuNames.push(
                        <option key={"rtu_"+index} value={areaCode} data-type={item.data_type}>{item.rtu_name}</option>
                    )
                });
                setOptionTag(rtuNames);
                
                // 리스트 항목 구성
                resp.result.rainList.forEach(function (item, index) {
                    let data1 = item.DATA === "-" ? "-" : common.toFixedOfNum(item.DATA, 1, 0.01);
                    const data2 = renderWindImage(item.DATA2);
                    let num = item.DATE;

                    grpData.push({
                        DATE : num,
                        DATA : data1,
                        DATA2 : item.DATA2  // 원본 DATA2 값을 저장 (이미지 파일명)
                    });

                    // 테이블 데이터 구성
                    tableDataList.push({
                        key: index,
                        time: num,
                        data: data1,
                        data2: data2
                    });
                });
                
                tableDataList.reverse();
                setTableData(tableDataList);
                setGraphData(grpData);
                // 로딩은 그래프 렌더링 완료 시점에 해제
            },
            function (resp) {
                console.log("err response : ", resp);
                setLoading(false);
            }
        );
    }

    // 그래프 렌더링 완료 콜백
    const handleGraphRenderComplete = () => {
        setTimeout(() => {
            setLoading(false);
        }, 300);
    };

    useEffect(() => {
        retrieveList(searchVO);
        return () => {
        }
    }, []);

    console.log("------------------------------Rpt10mContent [End]");
    console.groupEnd("Rpt10mContent");

    return (
        <div id="content">
            <div className="main_contitle">
                <img src="../images/title_05_010.png" alt="10분 자료" />
                <div className="unit">[ 단위 : <span id="unit">{unit}</span> ]</div>
            </div>
            <div className="right_bg" style={{minWidth: '1600px', height: '820px', overflow: 'auto'}}>
                <ul className="set_ulwrap_nh">
                    <li className="tb_sms_gry">
                        <span className="sel_left_n"> 
                            구분 :
                            <select 
                                id="option" 
                                name="option" 
                                value={option} 
                                style={{width: '75px', height: '28px', margin: '0 5px', border : '1px solid #ccc'}}
                                onChange={selectOption}
                            >
                                <option value="0">강우</option>
                                <option value="1">수위</option>
                                <option value="2">적설</option>
                                <option value="3">온도</option>
                                <option value="4">풍향/풍속</option>
                                <option value="5">습도</option>
                                {/* <option value="7">변위</option> */}
                            </select>
                            &nbsp;&nbsp;
                            지역 :
                            <select 
                                id="area_code" 
                                name="area_code" 
                                value={areaCode} 
                                style={{height: '28px', margin: '0 5px', border : '1px solid #ccc'}}
                                onChange={selectRtu}
                            >
                                {optionTag}
                            </select> 
                            &nbsp;&nbsp;
                            검색 기간 :
                            <button type="button" id="btn_left" className="btn_lbs_arr" onClick={() => changeDate('left', 'start')}>
                                <img src="../images/arr_b.png" alt="◀" />
                            </button>
                            <DatePicker 
                                value={startDate} 
                                className="f333_12" 
                                onChange={date => {
                                    setStartDate(date);
                                    setSearchVO({
                                        ...searchVO,
                                        sdate : date
                                    })
                                }}
                                format="YYYY-MM-DD HH:mm"
                                showTime={{ format: 'HH:mm' }}
                                locale={locale}
                                style={{textAlign: 'center'}}
                            />
                            <button type="button" id="btn_right" className="btn_lbs_arr mL0" onClick={() => changeDate('right', 'start')}>
                                <img src="../images/arr_f.png" alt="▶" />
                            </button>
                            &nbsp;
                            <span className="mL3">-</span>
                            &nbsp;
                            <button type="button" id="btn_left2" className="btn_lbs_arr" onClick={() => changeDate('left', 'end')}>
                                <img src="../images/arr_b.png" alt="◀" />
                            </button>
                            <DatePicker 
                                value={endDate} 
                                className="f333_12" 
                                onChange={date => {
                                    setEndDate(date);
                                    setSearchVO({
                                        ...searchVO,
                                        edate : date
                                    })
                                }}
                                format="YYYY-MM-DD HH:mm"
                                showTime={{ format: 'HH:mm' }}
                                locale={locale}
                                style={{textAlign: 'center'}}
                            />
                            <button type="button" id="btn_right2" className="btn_lbs_arr mL0" onClick={() => changeDate('right', 'end')}>
                                <img src="../images/arr_f.png" alt="▶" />
                            </button>
                        </span>
                        <span id="button" className="sel_left_n">
                            <button 
                                className="btn_bb80"
                                onClick={handleSearch}
                            >
                                <span>검색</span>
                            </button>
                            {/*
                            <button type="button" id="btn_excel" className="btn_lbb80_s">엑셀변환</button> 
                            */}
                        </span>
                    </li>
                </ul>
                <ul className="set_ulwrap_nh bB_3blue" style={{
                    borderTop: '0px solid #2861c0',
                    display: 'flex',
                    height: '725px'
                }}>
                    {/* <li className="bg_dk_gry1d" style={{ width: "100%" }}>
                        <table className="tb_data pB0">
                            <thead className="tb_data_tbg">
                                <tr>
                                <th className="li72">그래프</th>
                                <th className="li14 bL_1gry">시간</th>
                                <th className="li13 bL_1gry">자료</th>
                                </tr>
                            </thead>
                        </table>
                    </li> */}
                    <li className="li100_nor_left bg_dk_gry1d" style={{
                        flex: '1',
                        minWidth: '0',
                    }}>
                        <div className="graph_title">그래프</div>
                        <div className="graph_content">
                            <div className="graph_content_inner">
                                <Graph 
                                    data={gData} 
                                    label={
                                        option === "1" ? "수위" 
                                            : option === "2" ? "적설" 
                                            : option === "3" ? "온도" 
                                            : option === "4" ? "풍향/풍속" 
                                            : option === "5" ? "습도" 
                                            : option === "7" ? "변위" : "강우"
                                    } 
                                    type={option}
                                    loading={loading}
                                    onRenderComplete={handleGraphRenderComplete}
                                ></Graph>
                            </div>
                        </div>
                    </li>
                    <li className="li100_nor_rignt" style={{
                        width: '372px',
                        flexShrink: '0'
                    }}>
                        <Table 
                            columns={columns}
                            dataSource={tableData}
                            pagination={false}
                            scroll={{ 
                                y: 680
                            }}
                            virtual
                            size="small"
                            loading={loading}
                            style={{ 
                                height: '660px',
                                width: '372px'
                            }}
                            className="custom-table"
                            components={{
                                header: {
                                    cell: (props) => (
                                        <th 
                                            {...props} 
                                            style={{
                                                ...props.style,
                                                backgroundColor: '#ebf5fb',
                                                fontWeight: '500',
                                                color: '#333',
                                                borderRadius: '0',
                                                borderBottom: '1px solid #ccc',
                                                borderRight: '1px solid #ccc',
                                            }}
                                        />
                                    )
                                },
                                body: {
                                    cell: (props) => (
                                        <td 
                                            {...props} 
                                            style={{
                                                ...props.style, 
                                                fontWeight: '500',
                                                color: '#333',
                                                borderRight: '1px solid #ccc',
                                                borderBottom: '1px solid #ccc',
                                            }} 
                                        />
                                    )
                                }
                            }}
                        />
                    </li>
                </ul>             
            </div>
        </div>
    );
}

export default Rpt10m;