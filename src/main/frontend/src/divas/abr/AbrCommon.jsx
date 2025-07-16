import React, { useState, useEffect, useRef } from 'react';
import * as EgovNet from 'context/egovFetch';
import { useLocation } from 'react-router-dom';
import TmsBroadcast from 'divas/tms/TmsBroadcast';
import AbrCommonDetail from 'divas/abr/AbrCommonDetail';
import { Tree } from 'antd';

function AbrCommon(props) {

    console.group("AbrCommonContent");
    console.log("[Start] AbrCommonContent ------------------------------");
    console.log("AbrCommonContent [props] : ", props);

    const [treeData, setTreeData] = useState([]);
    const [scriptListTag, setScriptListTag] = useState([]);
    const [scriptDetail, setScriptList] = useState([]);
    const [scriptNo, selectScriptNo] = useState("");
    const [rtuOption, selectRtuOp] = useState({rtu_cnt : 0, rtu_id : [], model_no : []});
    const [checkedKeys, setCheckedKeys] = useState([]);

    const location = useLocation();
    const tmsBroadcastRef = useRef();

    const retrieveList = () => {
        const retrieveListURL = '/divas/abr/abrCommon.do';
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
                
                // Transform the data into a format compatible with Ant Design Tree
                const treeDataResult = [];
                
                // Create a map to store groups for easy reference
                const groupMap = {};
                
                // Process groups first
                resp.result.broadcastRtuGroupList.forEach(item => {
                    const groupNode = {
                        title: `${item.group_name} (${item.rtu_cnt}개소)`,
                        key: `tree_${item.group_id}`,
                        group_id: item.group_id,
                        children: []
                    };
                    treeDataResult.push(groupNode);
                    groupMap[item.group_id] = groupNode;
                });
                
                // Process RTUs and assign them to their respective groups
                resp.result.broadcastRtuList.forEach(item => {
                    const rtuNode = {
                        title: item.rtu_name,
                        key: `tree_${item.group_id}_${item.rtu_id}`,
                        isLeaf: true,
                        rtu_id: item.rtu_id,
                        model_no: item.model_no
                    };
                    
                    // Find parent group and add RTU as child
                    if (groupMap[item.group_id]) {
                        groupMap[item.group_id].children.push(rtuNode);
                    }
                });
                
                setTreeData(treeDataResult);
                
                // Process script list
                let mutListTag = [];
                let scriptObj = [];
                resp.result.scriptList.forEach(function (item, index) {
                    if (index === 0) mutListTag = [];
                    let script_unit = item.script_unit;
                    let script_unit_name = "";
                    if(script_unit === "T") script_unit_name = "문자";
                    else if(script_unit === "R") script_unit_name = "음성";
                    else script_unit_name = "녹음";
                    let script_name = "["+script_unit_name+"] "+item.script_title;
                    mutListTag.push(
                        <ul key={"script_"+index} id={"list"+item.script_no}>
                            <li key={"s_li_"+index} onClick={() => onClickScript(item.script_no)}>
                                {script_name}
                            </li>
                        </ul>
                    );
                    scriptObj.push(item);
                });
                setScriptListTag(mutListTag);
                setScriptList(scriptObj);
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
    }, []);

    useEffect(() => {
        // Generate checked keys from rtu_id values
        const newCheckedKeys = rtuOption.rtu_id.map(id => {
            // Find the corresponding tree node key
            for (const group of treeData) {
                for (const rtu of group.children || []) {
                    if (rtu.rtu_id === id) {
                        return rtu.key;
                    }
                }
            }
            return null;
        }).filter(key => key !== null);
        
        setCheckedKeys(newCheckedKeys);
    }, [rtuOption.rtu_id, treeData]);

    const reRoading = () => {
        selectRtuOp({rtu_cnt : "", rtu_id : [], model_no : []});
    }

    const onSelectTreeNode = (selectedKeys, info) => {
        // 리프 노드(RTU)인 경우
        if (info.node.isLeaf) {
            const rtuId = info.node.rtu_id;
            const modelNo = info.node.model_no;
            
            // Copy current selections
            let ids = [...rtuOption.rtu_id];
            let nos = [...rtuOption.model_no];
            
            // Check if already selected (toggle behavior)
            const idIndex = ids.indexOf(rtuId);
            if (idIndex === -1) {
                // Add to selection
                ids.push(rtuId);
                nos.push(modelNo);
            } else {
                // Remove from selection
                ids.splice(idIndex, 1);
                nos.splice(idIndex, 1);
            }
            
            // Update state with new selections
            selectRtuOp({
                rtu_cnt: ids.length,
                rtu_id: ids,
                model_no: nos
            });
        } 
        // 그룹 노드인 경우
        else {
            const childRTUs = info.node.children || [];
            let ids = [...rtuOption.rtu_id];
            let nos = [...rtuOption.model_no];
            
            // 그룹 내 모든 RTU가 이미 선택되어 있는지 확인
            const allChildRTUIds = childRTUs.map(rtu => rtu.rtu_id);
            const allSelected = allChildRTUIds.every(id => ids.includes(id));
            
            if (allSelected) {
                // 모두 선택되어 있으면 그룹 내 모든 RTU 해제
                ids = ids.filter(id => !allChildRTUIds.includes(id));
                nos = nos.filter((_, index) => !allChildRTUIds.includes(rtuOption.rtu_id[index]));
            } else {
                // 일부만 선택되어 있거나 모두 선택되지 않은 경우, 그룹 내 모든 RTU 선택
                childRTUs.forEach(rtu => {
                    if (!ids.includes(rtu.rtu_id)) {
                        ids.push(rtu.rtu_id);
                        nos.push(rtu.model_no);
                    }
                });
            }
            
            // Update state with new selections
            selectRtuOp({
                rtu_cnt: ids.length,
                rtu_id: ids,
                model_no: nos
            });
        }
    }

    const onCheck = (checkedKeys, info) => {
        // 리프 노드(RTU)인 경우
        if (info.node.isLeaf) {
            // Handle RTU selection for checkbox changes
            const isChecked = info.checked;
            const rtuId = info.node.rtu_id;
            const modelNo = info.node.model_no;
            
            // Copy current selections
            let ids = [...rtuOption.rtu_id];
            let nos = [...rtuOption.model_no];
            
            if (isChecked) {
                // Add to selection if not already present
                if (!ids.includes(rtuId)) {
                    ids.push(rtuId);
                    nos.push(modelNo);
                }
            } else {
                // Remove from selection
                const idIndex = ids.indexOf(rtuId);
                if (idIndex !== -1) {
                    ids.splice(idIndex, 1);
                    nos.splice(idIndex, 1);
                }
            }
            
            // Update state with new selections
            selectRtuOp({
                rtu_cnt: ids.length,
                rtu_id: ids,
                model_no: nos
            });
        }
        // 그룹 노드인 경우
        else {
            const childRTUs = info.node.children || [];
            let ids = [...rtuOption.rtu_id];
            let nos = [...rtuOption.model_no];
            
            // 체크박스가 선택된 경우
            if (info.checked) {
                // 그룹 내 모든 RTU 선택
                childRTUs.forEach(rtu => {
                    if (!ids.includes(rtu.rtu_id)) {
                        ids.push(rtu.rtu_id);
                        nos.push(rtu.model_no);
                    }
                });
            } 
            // 체크박스가 해제된 경우
            else {
                // 그룹 내 모든 RTU 해제
                const allChildRTUIds = childRTUs.map(rtu => rtu.rtu_id);
                ids = ids.filter(id => !allChildRTUIds.includes(id));
                
                // model_no 배열도 업데이트
                const newNos = [];
                ids.forEach((id, index) => {
                    // 원래 배열에서 해당 id의 index 찾기
                    const originalIndex = rtuOption.rtu_id.indexOf(id);
                    if (originalIndex !== -1) {
                        newNos.push(rtuOption.model_no[originalIndex]);
                    }
                });
                nos = newNos;
            }
            
            // Update state with new selections
            selectRtuOp({
                rtu_cnt: ids.length,
                rtu_id: ids,
                model_no: nos
            });
        }
    }

    const onClickScript = (scriptNo) => {
        selectScriptNo(scriptNo);
    }

    const handleSelectAll = () => {
        // 이미 모든 항목이 선택되어 있는지 확인
        const allRtuIds = [];
        const allModelNos = [];
        
        treeData.forEach(group => {
            (group.children || []).forEach(rtu => {
                allRtuIds.push(rtu.rtu_id);
                allModelNos.push(rtu.model_no);
            });
        });
        
        // 총 RTU 개수와 현재 선택된 RTU 개수 비교
        const totalRtuCount = allRtuIds.length;
        const selectedRtuCount = rtuOption.rtu_id.length;
        
        // 모든 항목이 이미 선택된 경우, 모두 해제
        if (selectedRtuCount === totalRtuCount && totalRtuCount > 0) {
            selectRtuOp({
                rtu_cnt: 0,
                rtu_id: [],
                model_no: []
            });
        } else {
            // 그렇지 않은 경우, 모두 선택
            selectRtuOp({
                rtu_cnt: allRtuIds.length,
                rtu_id: allRtuIds,
                model_no: allModelNos
            });
        }
    }

    // Function to manually trigger TmsBroadcast reload
    const reloadBroadcastList = () => {
        if (tmsBroadcastRef.current) {
            tmsBroadcastRef.current.retrieveList();
        }
    };

    console.log("------------------------------AbrCommonContent [End]");
    console.groupEnd("AbrCommonContent");

    return (
        <div id="content">
            <div className="main_contitle">
                <img src="../images/title_02_01.png" alt="일반 방송" />
            </div>
            <div className="right_bg">
                <ul className="tb_alarm h550p">
                    <li className="tb_alarm_lm">
                    <div className="alarm">
                        <ul>
                            <li className="alarm_gry">
                                <span
                                id="popup1"
                                className="popupInfo"
                                style={{ fontSize: "1.5em" }}
                                >
                                ①
                                </span>{" "}
                                방송지역 선택 : <span id="rtu_cnt_text">{rtuOption.rtu_cnt}</span> 개소
                                <button 
                                    type="button" 
                                    id="btn_all" 
                                    className="btn_bs60"
                                    onClick={handleSelectAll}
                                >
                                    전체선택
                                </button>
                            </li>
                            <li id="group_table">
                                <Tree
                                    checkable
                                    treeData={treeData}
                                    onSelect={onSelectTreeNode}
                                    onCheck={onCheck}
                                    checkedKeys={checkedKeys}
                                    defaultExpandAll={true}
                                    className="custom-tree"
                                />
                            </li>
                        </ul>
                    </div>
                    </li>
                    <li className="mi" />
                    <li className="tb_alarm_lm">
                    <div className="alarm">
                        <ul>
                            <li className="alarm_gry">
                                <span
                                id="popup2"
                                className="popupInfo"
                                style={{ fontSize: "1.5em" }}
                                >
                                ②
                                </span>{" "}
                                방송구분
                                <select id="SECTION_NO_SEARCH" name="SECTION_NO_SEARCH" size="1" className="f333_12">
                                    <option value="0">전체</option>
                                </select>
                            </li>
                            <li id="list_table" className="h100">
                                {scriptListTag}
                            </li>
                        </ul>
                    </div>
                    </li>
                    <li className="mi" />
                    <li className="tb_alarm_r">
                        <AbrCommonDetail 
                            scriptNo={scriptNo} 
                            scriptDetail={scriptDetail}
                            rtuOption={rtuOption} 
                            reRoading={reRoading}
                            reloadBroadcastList={reloadBroadcastList}
                        />
                    </li>
                </ul>
                </div>
            <div>
                <TmsBroadcast 
                    ref={tmsBroadcastRef}
                    load_time={props.load_time} 
                    reload={props.reload}
                />
            </div>
        </div>
    );
}

export default AbrCommon;