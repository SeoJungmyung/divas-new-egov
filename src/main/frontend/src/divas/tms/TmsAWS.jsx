import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as EgovNet from 'context/egovFetch';
import UseInterval from 'divas/com/UseInterval';

function TmsAWS(props) {

    console.group("TmsAWSContent");
    console.log("[Start] TmsAWSContent ------------------------------");
    console.log("TmsAWSContent [props] : ", props);
    // 반복을 위한 state
    const [reload, setLoadState] = useState(false);
    const [listTag, setListTag] = useState([]);

    UseInterval(() => {
        props.reload();
        setLoadState(!reload);
    }, props.load_time *1000);

    const location = useLocation();
    // console.log("commonVO : ", location.state.commonVO);

    const retrieveList = () => {
        const retrieveListURL = '/divas/tms/tmsAWS.do';
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(location.state.commonVO)
        }

        EgovNet.requestFetch(retrieveListURL,
            requestOptions,
            (resp) => {
                console.log("result = ", resp.result);
                let mutListTag = [];
                
                if(resp.result.awsList.length < 1){
                    mutListTag.push(<p className="no_data">검색된 결과가 없습니다.</p>); // 게시판 목록 초기값
                }

                // 리스트 항목 구성
                resp.result.awsList.forEach(function (item, index) {
                    if (index === 0) mutListTag = [];
                    let rain_h = item.rain_h === -99999 ? "-" : item.rain_h;
                    let rain_d = item.rain_d === -99999 ? "-" : item.rain_d;
                    let temp = item.temp === -99999 ? "-" : item.temp;
                    let temp_max = item.temp_max === -99999 ? "-" : item.temp_max;
                    let temp_min = item.temp_min === -99999 ? "-" : item.temp_min;
                    let wind_vel = item.wind_vel === -99999 ? "-" : item.wind_vel;
                    let wind_deg = item.wind_deg === -99999 ? "-" : item.wind_deg;
                    let wind_max_vel = item.wind_max_vel === -99999 ? "-" : item.wind_max_vel;
                    let wind_max_deg = item.wind_max_deg === -99999 ? "-" : item.wind_max_deg;
                    let humi = item.humi === -99999 ? "-" : item.humi;
                    let humi_max = item.humi_max === -99999 ? "-" : item.humi_max;
                    let humi_min = item.humi_min === -99999 ? "-" : item.humi_min;
                    mutListTag.push(
                        <tr key={"rain_"+index} id={"rain_"+item.area_code}>
                            <td>{item.rtu_name}</td>
                            <td>{rain_h}</td>
                            <td>{rain_d}</td>
                            <td>{temp}</td>
                            <td>{temp_max}</td>
                            <td>{temp_min}</td>
                            <td>{wind_deg+"/"+wind_vel}</td>
                            <td>{wind_max_deg+"/"+wind_max_vel}</td>
                            <td>{humi}</td>
                            <td>{humi_max}</td>
                            <td>{humi_min}</td>
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
    useEffect(() => {
        retrieveList();
        return () => {
        }
    }, [reload]);

    console.log("------------------------------TmsAWSContent [End]");
    console.groupEnd("TmsAWSContent");

    return (
    <div id="awsContent">
        <div id="spin" className="" />
        <div className="main_contitle">
        
        <img src="../images/title_aws.png" alt="AWS 현황" />
        </div>
        <div className="right_bg">
            <table className="main_table">
                <thead>
                    <tr key="aws_th1">
                        <th rowSpan="2" width="15%">지역</th> 
                        <th colSpan="2" width="15%">우량(㎜)</th>
                        <th colSpan="3" width="20%">온도(℃)</th> 
                        <th colSpan="2" width="15%">풍향/풍속(㎧)</th>
                        <th colSpan="3" width="20%">습도(%)</th> 
                    </tr>
                    <tr key="aws_th2">
                        <td className="gry_f">시간</td>
                        <td className="gry">금일</td>
                        <td className="gry">현재</td>
                        <td className="gry">최고</td>
                        <td className="gry">최저</td>
                        <td className="gry">현재</td>
                        <td className="gry">최대</td>
                        <td className="gry">현재</td>
                        <td className="gry">최고</td>
                        <td className="gry">최저</td>
                    </tr>
                </thead>
                <tbody>
                    {listTag}
                </tbody>
            </table>
        </div>
    </div>
    );
}

export default TmsAWS;