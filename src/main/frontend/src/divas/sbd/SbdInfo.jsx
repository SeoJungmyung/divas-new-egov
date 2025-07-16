import React, { useState, useEffect } from 'react';
import * as EgovNet from 'context/egovFetch';
import UseInterval from 'divas/com/UseInterval';

function SbdInfo(props) {

    console.group("SbdInfoContent");
    console.log("[Start] SbdInfoContent ------------------------------");
    console.log("SbdInfoContent [props] : ", props);
    
    // 반복을 위한 state
    const [reload, setLoadState] = useState(false);
    const [listTag, setListTag] = useState([]);

    UseInterval(() => {
        props.reload();
        setLoadState(!reload);
    }, props.load_time *1000);
    
    const retrieveList = () => {
        const retrieveListURL = '/divas/sbd/SbdInfo.do';
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify()
        }

        EgovNet.requestFetch(retrieveListURL,
            requestOptions,
            (resp) => {
                let mutListTag = [];
                console.log("result = ", resp.result);
                if(resp.result.nowSbdInfo.length < 1){
                    mutListTag.push(<p className="no_data">검색된 결과가 없습니다.</p>); // 게시판 목록 초기값
                }

                // 리스트 항목 구성
                resp.result.nowSbdInfo.forEach(function (item, index) {
                    let msgTag = [];
                    if (index === 0) mutListTag = [];
                    let tmpMsg = ""; 
                    if(item.type == 0){
                        msgTag.push(item.msg);
                    }else{
                        msgTag.push(
                            <img id="img_area" class="w85 sbd_overX" src={item.imgpath} />
                        );
                    }
                    let success_name = item.success;
                    if(success_name == "0"){
                        success_name = "전송대기"
                    }else if(success_name == "1"){
                        success_name = "전송중";
                    }else if(success_name == "2"){
                        success_name = "송출실패";
                    }else if(success_name == "3"){
                        success_name = "송출중";
                    }

                    mutListTag.push(
                        <tr key={"sbd_now_"+index} id={"sbd_"+item.idx}>
                            <td>{item.areabestname}</td>
                            <td>{item.areaname}</td>
                            <td>{item.sitename}</td>
                            <td>{item.actionname}</td>
                            <td>{item.msgspd}</td>
                            <td>{item.msgdelay}</td>
                            <td>{item.modx}</td>
                            <td>{item.mody}</td>
                            <td>{item.colorname}</td>
                            <td>{msgTag}</td>
                            <td>{success_name}</td>
                            <td>{item.ordernum}</td>
                            <td>{item.senddate}</td>
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

    console.log("------------------------------SbdInfoContent [End]");
    console.groupEnd("SbdInfoContent");

    return (
    <div id="broadContent">
        <div id="spin" className="" />
        <div className="main_contitle">
            <img src="../images/title_08_07.png" alt="긴급 전광판" />
        </div>
        <div className="right_bg">
            <table className="main_table">
                <thead>
                    <tr key="broad_th1">
                        <th className='bL0'>상위지역</th> 
                        <th>지역</th>
                        <th>설치장소</th>
                        <th>효과</th>
                        <th>속도</th>
                        <th>정지시간</th>
                        <th>가로크기</th>
                        <th>세로크기</th>
                        <th>색깔</th>
                        <th>내용</th>
                        <th>상태</th>
                        <th>전송시간</th>
                        <th>종료시간</th>
                        <th>중지</th>
                    </tr>
                </thead>
                <tbody>
                    {/* {listTag} */}
                </tbody>
            </table>
        </div>
        <div className="main_contitle">
            <img src="../images/title_08_01.png" alt="전광판 현황" />
        </div>
        <div className="right_bg">
            <table className="main_table hi100 w100">
                <thead>
                    <tr key="broad_th1">
                        <th className='bL0'>상위지역</th> 
                        <th>지역</th>
                        <th>설치장소</th>
                        <th>효과</th>
                        <th>속도</th>
                        <th>정지시간</th>
                        <th>가로크기</th>
                        <th>세로크기</th>
                        <th>색깔</th>
                        <th>내용</th>
                        <th>상태</th>
                        <th>순서</th>
                        <th>전송시간</th>
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

export default SbdInfo;