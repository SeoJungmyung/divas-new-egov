/**
 * 공통함수모음
 * 2022.05.13 
 * 작성자 : 서정명
 */
import $ from 'jquery';
import { Modal, Table } from 'antd';
import React from 'react';
import * as EgovNet from 'context/egovFetch';
import dayjs from 'dayjs';
import { ExclamationCircleFilled, CheckCircleFilled, LoadingOutlined } from '@ant-design/icons';

// 리스트 선택 시 배경색
export function bg_color(class_name, r_target, a_target){
  $.each($(r_target).children(), function(i, v){
    $(v).removeClass(class_name);
  });
  $(a_target).addClass(class_name);
}

// 월, 일 10보다 작으면 좌측에 0 붙임
export function leftPad(value) {
    if (value >= 10) { return value; } 
    return `0${value}`; 
}

// YYYY-MM-DD 형식으로 데이트 포메팅
export function toStringByFormatting(source, delimiter = '-') { 
    const year = source.getFullYear(); 
    const month = leftPad(source.getMonth() + 1); 
    const day = leftPad(source.getDate()); 
    return [year, month, day].join(delimiter); 
}

// m값 만큼 곱한 후 n자리수까지 표현
/**
 * 강우 : toFixedOfNum(value, 1, 0.01)
 * 수위 : toFixedOfNum(value, 2, 0.01)
 * AWS : toFixedOfNum(value, 1, 0.01)
 * 적설 : toFixedOfNum(value, 1, 0.001)
 * @param {Target value} txt 
 * @param {소숫점 자릿수} n 
 * @param {곱할 값} m 
 * @returns 
 */
export function toFixedOfNum(txt, n, m){  
  if(txt === "-") return txt;
  if(typeof n != "number" || n > 12) return NaN;
  if(typeof m != "number") return NaN;
  // 첫번째 값만
  var textVal = "";
  var tmpVal = "";
  if(isNaN(txt)){
    textVal = (txt != null) ? txt.trim() : "-";
    tmpVal = textVal.split(" ");
    textVal = Number(tmpVal[0]);
    if(typeof textVal != "number") return textVal;
  }else{
    textVal = txt;
  }
  var reck = 1;
  for (var i=0; i<n; i++) reck *= 10;
  var result = Math.round((textVal*m) * reck) / reck;
  return result.toFixed(n);
}  

export function getPurifyData(data) {
  if(data === "-") return data;
  if(data === null || data === undefined) return "-";
  if(data <= -99999 || data === "-99999") return "-";
  return data;
}

// 알람 팝업
export function alarm_popup(log_no, commonVO, navigationCallback) {
  if(!log_no) return false;

  // antd Modal을 사용하여 알람 팝업 표시
  const fetchAlarmDetails = () => {
    return new Promise((resolve, reject) => {
      const retrieveListURL = '/divas/abr/abrComDetail.do';
      const requestData = {
        ...commonVO,
        log_no: log_no,
      };

        const requestOptions = {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(requestData)
        }

        EgovNet.requestFetch(retrieveListURL,
            requestOptions,
            (resp) => {
                resolve(resp.result);
            },
            (error) => {
                reject(error);
            }
        );
    });
  };

  const showAlarmModal = async () => {
    try {
      const data = await fetchAlarmDetails();
      if (!data.detail) {
        Modal.error({
          title: '알림',
          content: '상세 정보를 불러오는데 실패했습니다.',
        });
        return;
      }

      // 테이블 헤더와 데이터 가공
      let stateRows = '';
      if (data.state && data.state.length > 0) {
        data.state.forEach(v => {
          stateRows += `
            <tr>
              <td style="text-align:center;">${v.rtu_id}</td>
              <td style="text-align:center;">${v.rtu_name}</td>
              <td style="text-align:center;">${v.state_txt}</td>
              <td style="text-align:center;">${v.error_txt}</td>
              <td style="text-align:center;">${v.trans_check}</td>
            </tr>
          `;
        });
      }

      // Modal 컨텐츠
      const content = `
      <div class="popup_con">
        <div id="list_view" class="alarm popup_big">
          <table class="tb_data_p">
            <tr>
              <th class="bg_lgr">사용자 정보</th>
              <td><span id="USER_ID_POP">${data.detail.user_id}</span></td>
              <th class="bg_lgr">전송 유형</th>
              <td><span id="IS_PLAN_GUBUN_POP">${data.detail.is_plan_gubun}</span></td>
              <th class="bg_lgr">전송 시작 시각</th>
              <td><span id="LOG_DATE">${data.detail.log_date}</span></td>
            </tr>
            <tr>
              <th class="bg_lgr">방송문안</th>
              <td colspan="5" class="al_L"><span id="SCRIPT_BODY">${data.detail.script_body}</span></td>
            </tr>
          </table>
          <div class="state-list" style="max-height: 440px; overflow-y: auto;">
            <table class="tb_data">
              <thead>
                <tr class="tb_data_tbg">
                  <th style="padding: 8px; border: 1px solid #ddd;">장비 ID</th>
                  <th style="padding: 8px; border: 1px solid #ddd;">장비명</th>
                  <th style="padding: 8px; border: 1px solid #ddd;">방송전송여부</th>
                  <th style="padding: 8px; border: 1px solid #ddd;">에러 정보</th>
                  <th style="padding: 8px; border: 1px solid #ddd;">최종 로깅시각</th>
                </tr>
              </thead>
              <tbody>
                ${stateRows || '<tr><td colspan="5" style="text-align:center;">데이터가 없습니다.</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      `;

      Modal.info({
        title: (
          <div className="popup_top">
            방송전송 상세정보<span id="title">{data.detail.script_title ? ` - ${data.detail.script_title}` : ''}</span>
            {navigationCallback && (
              <span 
                id="popup_move" 
                className="btn_pop_blue fR bold" 
                style={{
                  position: 'relative', 
                  right: '35px', top: '0', 
                  color: 'white !important',
                  cursor: 'pointer', 
                  fontSize: '11px',
                  fontWeight: 'bold',
                  backgroundColor: '#2861c0',
                  border: '1px solid #1955b9',
                  padding: '6px',
                  lineHeight: '11px',
                  width: '112px',
                  textAlign: 'center',
                  display: 'inline-block',
                  float: 'right',
                  marginRight: '5px',
                }}
                onClick={() => {
                  // console.log("방송 전송이력 페이지", data.detail.log_no);
                  if (navigationCallback) {
                    navigationCallback("rpt_brhist.php");
                    Modal.destroyAll();
                  } else {
                    console.warn("Navigation callback not provided");
                  }
                }}
              >
              방송 전송이력 페이지
              </span>
            )}
          </div>
        ),
        content: <div dangerouslySetInnerHTML={{ __html: content }} />,
        width: 700,
        maskClosable: true,
        className: 'popup_total_layout',
        footer: null,
        closable: true,
      });
    } catch (error) {
      console.error('Error fetching alarm details:', error);
      Modal.error({
        title: '오류',
        content: '데이터를 불러오는 중 오류가 발생했습니다.',
      });
    }
  };

  // 모달 표시
  showAlarmModal();
}

// 메시지 상세 팝업 표시
export const showMsgDetailPopup = (data, cancelScheduledMessage) => {
    if (!data || !data.msgHistDetail) {
        Modal.error({
            title: '알림',
            content: '상세 정보를 불러오는데 실패했습니다.',
        });
        return;
    }

    // 메시지 발송 정보 가져오기
    const msgDetail = data.msgHistDetail;
    const scheduleText = msgDetail[0].schedule_type === 1 ? "예약문자" : "일반문자";
    const sendDate = data.send_date ? dayjs(data.send_date).format('YYYY-MM-DD HH:mm:ss') : "-";
    
    // 수신자 목록 처리
    let recipientRows = '';
    if (data.msgHistDetail && data.msgHistDetail.length > 0) {
        data.msgHistDetail.forEach(recipient => {
            // 전화번호 포맷팅
            let callback = recipient.callback ? 
                recipient.callback.includes("-") 
                    ? recipient.callback 
                    : recipient.callback.length > 10 ? recipient.callback.replace(/(.{3})(.{4})(.*)/, '$1-$2-$3')
                        : recipient.callback.replace(/(.{3})(.{3})(.*)/, '$1-$2-$3')
                : "-";
            
            let destPhone = recipient.mobile ? 
                recipient.mobile.includes("-") 
                    ? recipient.mobile 
                    : recipient.mobile.length > 10 ? recipient.mobile.replace(/(.{3})(.{4})(.*)/, '$1-$2-$3')
                        : recipient.mobile.replace(/(.{3})(.{3})(.*)/, '$1-$2-$3')
                : "-";
            
            // 결과 텍스트 처리
            let resultText = "";
            if (recipient.result === 2) {
                resultText = "<font color=green>성공</font>";
            } else if (recipient.result === 3) {
                resultText = "<font color=red>실패</font>";
            // } else if (recipient.result === 9) {
            //     resultText = "미전송";
            } else {
              if(recipient.tcs_result === 0) {
                resultText = "<font color=green>성공</font>";
              } else {
                resultText = "<font color=red>실패</font>";
              }
            }
            
            recipientRows += `
                <tr>
                    <td style="text-align:center;">${callback}</td>
                    <td style="text-align:center;">${destPhone}</td>
                    <td style="text-align:center;">${resultText}</td>
                </tr>
            `;
        });
    } else {
        recipientRows = '<tr><td colspan="3" style="text-align:center;">수신 내역이 없습니다.</td></tr>';
    }

    // 예약 취소 버튼 표시 여부
    const showCancelButton = msgDetail.schedule_type === 1 && msgDetail.status !== 'COMPLETE';
    
    // 팝업 내용 생성
    const content = `
    <div class="popup_con">
        <ul class="popup_big alarm">
            <li class="alarm_gry">
                <span>발송인 :</span><span id="USER_ID" class="mL5 mR20">${data.user_id || "-"}</span>
                <span>전송시각 :</span>
                <span id="SEND_DATE" class="mL5 mR20">${sendDate}</span>
                <span>유형 :</span>
                <span id="SCHEDULE_TEXT" class="mL5">${scheduleText}</span>
                ${showCancelButton ? `
                <button type="button" id="res_del" 
                    class="btn_bs60_sms" style="width: 92px; float:right; margin: -5px;">
                    예약전송 취소
                </button>` : ''}
            </li>

            <li id="sms" class="p0">
                <div id="spin"></div>
                <div style="max-height: 550px; overflow-y: auto;">
                    <table id="detail_table" class="tb_data w100">
                        <thead>
                            <tr class="tb_data_tbg">
                                <th style="padding: 8px; border: 1px solid #ddd;">회신번호</th>
                                <th style="padding: 8px; border: 1px solid #ddd;">수신번호</th>
                                <th style="padding: 8px; border: 1px solid #ddd;">결과</th>
                            </tr>
                        </thead>
                        <tbody id="sms_list">
                            ${recipientRows}
                        </tbody>
                    </table>
                </div>
            </li>
        </ul>
    </div>
    `;

    // 모달 표시
    Modal.info({
        title: (
            <div className="popup_top">
                전송 이력 - 상세 조회
            </div>
        ),
        content: <div dangerouslySetInnerHTML={{ __html: content }} />,
        width: 700,
        maskClosable: true,
        className: 'popup_total_layout',
        footer: null,
        closable: true,
        onOk: () => {}
    });

    // 예약 취소 버튼에 이벤트 리스너 추가
    if (showCancelButton) {
        setTimeout(() => {
            document.getElementById('res_del').addEventListener('click', () => {
                cancelScheduledMessage(msgDetail.msg_id);
            });
        }, 100);
    }
}

export function common_modal(type, title, content, callback) {
  if(type === "error") {
    Modal.error({
      title: <div style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '5px' }}>{title}</div>,
      content: <div style={{ fontSize: '16px' }}>{content}</div>,
      zIndex: 9999,
      className: 'sweet-modal',
      centered: true,
      width: 400,
      icon: <ExclamationCircleFilled style={{ fontSize: '70px', color: '#ff4d4f', marginBottom: '20px' }} />,
      okText: '확인',
      okButtonProps: {
          style: {
              width: '100px',
              height: '40px',
              fontSize: '16px',
              borderRadius: '4px'
          }
        }
    });
  } else if(type === "success") {
    Modal.success({
      title: <div style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '5px' }}>{title}</div>,
      content: <div style={{ fontSize: '16px' }}>{content}</div>,
      zIndex: 9999,
      className: 'sweet-modal',
      centered: true,
      width: 400,
      icon: <ExclamationCircleFilled style={{ fontSize: '70px', color: '#52c41a', marginBottom: '20px' }} />,
      okText: '확인',
      okButtonProps: {
          style: {
              width: '100px',
              height: '40px',
              fontSize: '16px',
              borderRadius: '4px'
          }
      }
    });
  } else if(type === "confirm") {
    Modal.confirm({
      title: <div style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '5px' }}>{title}</div>,
      content: <div style={{ fontSize: '16px' }}>{content}</div>,
      icon: <CheckCircleFilled style={{ fontSize: '70px', color: '#1890ff', marginBottom: '20px' }} />,
      okText: '확인',
      cancelText: '취소',
      className: 'sweet-modal',
      centered: true,
      width: 400,
      okButtonProps: { 
          style: {
              color: 'white',
              backgroundColor: '#2861c0',
              border: '1px solid #1955b9',
              width: '100px',
              height: '40px',
              fontSize: '16px',
              borderRadius: '4px'
          }
      },
      cancelButtonProps: { 
          style: {
              color: 'white',
              backgroundColor: '#f5222d',
              border: '1px solid #d9363e',
              width: '100px',
              height: '40px',
              fontSize: '16px',
              borderRadius: '4px'
          }
      },
      onOk: () => {
        if(callback) {
          callback();
        }
      },
      keyboard: false,
      maskClosable: false,
      zIndex: 9999
    });
  } else if(type === "loading") {
    Modal.confirm({
      title: <div style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '5px' }}>{title}</div>,
      content: <div style={{ fontSize: '16px' }}>{content}</div>,
      icon: <LoadingOutlined style={{ fontSize: '70px', color: '#1890ff', marginBottom: '20px' }} />,
      okText: '확인',
      cancelText: '취소',
      className: 'sweet-modal',
      centered: true,
      width: 400,
      okButtonProps: { 
          disabled: true,
          loading: true,
          style: {
              width: '100px',
              height: '40px',
              fontSize: '16px',
              borderRadius: '4px'
          }
      },
      cancelButtonProps: { 
          style: {
              color: 'red',
              width: '100px',
              height: '40px',
              fontSize: '16px',
              borderRadius: '4px'
          }
      },
      keyboard: false,
      maskClosable: false,
      zIndex: 9999
    });
  }
}

 // 검색 타입에 따른 배열 크기 및 인덱스 계산 함수
export const getArrayConfig = (searchType, startDate, endDate, num = null) => {
  let arraySize, arrayIndex;
  
  switch(searchType) {
      case 'H': // 시간별 (24시간)
          arraySize = 24;
          arrayIndex = num; // 0~23
          break;
      case 'A': // 일별 (시작일~종료일)
          arraySize = endDate.diff(startDate, 'day') + 1;
          arrayIndex = num ? num - 1 : null; // 1일부터 시작하므로 -1
          break;
      case 'D': // 월별 (해당 월의 일수)
          arraySize = startDate.daysInMonth();
          arrayIndex = num ? num - 1 : null; // 1일부터 시작하므로 -1
          break;
      case 'N': // 연별 (12개월)
          arraySize = 12;
          arrayIndex = num ? num - 1 : null; // 1월부터 시작하므로 -1
          break;
      default:
          arraySize = 24;
          arrayIndex = num;
  }
  
  return { arraySize, arrayIndex };
};

// 행정구역 조회 팝업
export function showAreaPopup(commonVO, onAreaSelect) {
  // antd Modal을 사용하여 행정구역 조회 팝업 표시
  const fetchAreaList = (page = 1, searchWord = '') => {
    return new Promise((resolve, reject) => {
      const retrieveListURL = '/divas/set/getAreaInfo.do';
      const requestData = {
        ...commonVO,
        page: page,
        search_text: searchWord
      };

      const requestOptions = {
        method: "POST",
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(requestData)
      }

      EgovNet.requestFetch(retrieveListURL,
        requestOptions,
        (resp) => {
          resolve(resp.result);
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  const showAreaModal = async () => {
    try {
      const data = await fetchAreaList(1, '');
      if (!data || !data.areaList) {
        Modal.error({
          title: '알림',
          content: '행정구역 정보를 불러오는데 실패했습니다.',
        });
        return;
      }
      // console.log("data = ", data);

      // 테이블 컬럼 정의
      const columns = [
        {
          title: '번호',
          dataIndex: 'index',
          key: 'index',
          width: 80,
          align: 'center',
          render: (text, record, index) => index + 1
        },
        {
          title: '행정코드',
          dataIndex: 'area_code',
          key: 'area_code',
          width: 200,
          align: 'center'
        },
        {
          title: '행정구역',
          dataIndex: 'area_name',
          key: 'area_name',
          align: 'center',
          render: (text, record) => `${record.sido} ${record.gugun} ${record.dong} ${record.li}`
        }
      ];

      // 메인 컴포넌트
      const AreaPopupContent = () => {
        const [searchValue, setSearchValue] = React.useState('');
        const [loading, setLoading] = React.useState(false);
        const [tableData, setTableData] = React.useState(data.areaList || []);
        const [pagination, setPagination] = React.useState({
          current: 1,
          pageSize: 13,
          total: data.totalCount || 0,
          showSizeChanger: false,
          showQuickJumper: false,
          showTotal: (total, range) => `${range[0]}-${range[1]} / 총 ${total}개`
        });

        const handleSearch = async () => {
          setLoading(true);
          try {
            const newData = await fetchAreaList(1, searchValue);
            if (newData && newData.areaList) {
              setTableData(newData.areaList);
              setPagination({
                ...pagination,
                current: 1,
                total: newData.totalCount || 0
              });
            }
          } catch (error) {
            console.error('Error searching:', error);
          } finally {
            setLoading(false);
          }
        };

        const handleClear = async () => {
          setSearchValue('');
          setLoading(true);
          try {
            const newData = await fetchAreaList(1, '');
            if (newData && newData.areaList) {
              setTableData(newData.areaList);
              setPagination({
                ...pagination,
                current: 1,
                total: newData.totalCount || 0
              });
            }
          } catch (error) {
            console.error('Error clearing search:', error);
          } finally {
            setLoading(false);
          }
        };

        const handleTableChange = async (paginationInfo) => {
          setLoading(true);
          try {
            const newData = await fetchAreaList(paginationInfo.current, searchValue);
            if (newData && newData.areaList) {
              setTableData(newData.areaList);
              setPagination({
                ...paginationInfo,
                total: newData.totalCount || 0
              });
            }
          } catch (error) {
            console.error('Error changing page:', error);
          } finally {
            setLoading(false);
          }
        };

        return (
          <div style={{ padding: '10px' }}>
            {/* 검색 컴포넌트 */}
            <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
              <input
                type="text"
                placeholder="행정구역명을 입력하세요"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                style={{ 
                  width: 200, 
                  padding: '4px 8px', 
                  border: '1px solid #d9d9d9',
                  borderRadius: '4px'
                }}
              />
              <button 
                onClick={handleSearch}
                disabled={loading}
                style={{ 
                  padding: '4px 12px', 
                  backgroundColor: '#2861c0',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {loading ? '검색중...' : '검색'}
              </button>
              <button 
                onClick={handleClear}
                disabled={loading}
                style={{ 
                  padding: '4px 12px', 
                  backgroundColor: '#f5f5f5',
                  color: '#333',
                  border: '1px solid #d9d9d9',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                초기화
              </button>
            </div>

            {/* 테이블 컴포넌트 */}
            <Table
              columns={columns.map(col => ({
                ...col,
                render: col.key === 'index' 
                  ? (text, record, index) => ((pagination.current - 1) * pagination.pageSize) + index + 1
                  : col.render
              }))}
              dataSource={tableData}
              pagination={{
                ...pagination,
                className: 'centered-pagination'
              }}
              onChange={handleTableChange}
              rowKey="area_code"
              size="small"
              style={{ 
                height: 600, 
                overflow: 'auto'
              }}
              loading={loading}
              onRow={(record) => ({
                onClick: () => {
                  if (onAreaSelect) {
                    onAreaSelect({
                      area_code: record.area_code,
                      area_main: record.sido,
                      area_sub: record.gugun
                    });
                  }
                  Modal.destroyAll();
                },
                style: { cursor: 'pointer' }
              })}
            />
            
            <style dangerouslySetInnerHTML={{
              __html: `
                .centered-pagination {
                  text-align: center !important;
                  display: flex !important;
                  justify-content: center !important;
                }
                .ant-pagination {
                  text-align: center !important;
                  display: flex !important;
                  justify-content: center !important;
                }
                .popup_total_layout .ant-pagination {
                  text-align: center !important;
                  display: flex !important;
                  justify-content: center !important;
                  margin-top: 16px !important;
                }
                .ant-table-cell {
                  font-size: 12px !important;
                }
              `
            }} />
          </div>
        );
      };

      Modal.info({
        title: (
          <div className="popup_top">
            행정구역 조회
          </div>
        ),
        content: <AreaPopupContent />,
        width: 700,
        maskClosable: true,
        className: 'popup_total_layout',
        footer: null,
        closable: true,
      });
    } catch (error) {
      console.error('Error fetching area list:', error);
      Modal.error({
        title: '오류',
        content: '행정구역 정보를 불러오는 중 오류가 발생했습니다.',
      });
    }
  };

  // 모달 표시
  showAreaModal();
}

// 방송권한 지역선택 팝업
export function showBroadcastRtuPopup(rtuList, rtuGroupList, selectedRtuIds = [], onRtuSelect) {
  const { Tree } = require('antd');
  
  // Tree 데이터 구조 생성 (AbrCommon.jsx와 동일한 로직)
  const generateTreeData = () => {
    const treeDataResult = [];
    const groupMap = {};
    
    // 그룹 먼저 처리
    rtuGroupList.forEach(item => {
      const groupNode = {
        title: `${item.group_name} (${item.rtu_cnt}개소)`,
        key: `tree_${item.group_id}`,
        group_id: item.group_id,
        children: []
      };
      treeDataResult.push(groupNode);
      groupMap[item.group_id] = groupNode;
    });
    
    // RTU들을 해당 그룹에 할당
    rtuList.forEach(item => {
      const rtuNode = {
        title: item.rtu_name,
        key: `tree_${item.group_id}_${item.rtu_id}`,
        isLeaf: true,
        rtu_id: item.rtu_id,
        model_no: item.model_no
      };
      
      // 부모 그룹을 찾아서 RTU를 자식으로 추가
      if (groupMap[item.group_id]) {
        groupMap[item.group_id].children.push(rtuNode);
      }
    });
    
    return treeDataResult;
  };

  const showRtuModal = () => {
    const treeData = generateTreeData();
    
    // 메인 컴포넌트
    const BroadcastRtuPopupContent = () => {
      const [checkedKeys, setCheckedKeys] = React.useState([]);
      const [rtuOption, setRtuOption] = React.useState({
        rtu_cnt: 0,
        rtu_id: [],
        model_no: []
      });

      // 초기 선택된 RTU들을 체크 상태로 설정
      React.useEffect(() => {
        if (selectedRtuIds && selectedRtuIds.length > 0) {
          const initialCheckedKeys = [];
          const initialRtuIds = [];
          const initialModelNos = [];
          
          selectedRtuIds.forEach(rtuId => {
            // 해당 RTU의 트리 키 찾기
            for (const group of treeData) {
              for (const rtu of group.children || []) {
                if (rtu.rtu_id === rtuId) {
                  initialCheckedKeys.push(rtu.key);
                  initialRtuIds.push(rtu.rtu_id);
                  initialModelNos.push(rtu.model_no);
                  break;
                }
              }
            }
          });
          
          setCheckedKeys(initialCheckedKeys);
          setRtuOption({
            rtu_cnt: initialRtuIds.length,
            rtu_id: initialRtuIds,
            model_no: initialModelNos
          });
        }
      }, []);

      // 체크된 키 변경 시 rtuOption 업데이트
      React.useEffect(() => {
        const newCheckedKeys = rtuOption.rtu_id.map(id => {
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
      }, [rtuOption.rtu_id]);

      const onCheck = (checkedKeys, info) => {
        // 리프 노드(RTU)인 경우
        if (info.node.isLeaf) {
          const isChecked = info.checked;
          const rtuId = info.node.rtu_id;
          const modelNo = info.node.model_no;
          
          let ids = [...rtuOption.rtu_id];
          let nos = [...rtuOption.model_no];
          
          if (isChecked) {
            if (!ids.includes(rtuId)) {
              ids.push(rtuId);
              nos.push(modelNo);
            }
          } else {
            const idIndex = ids.indexOf(rtuId);
            if (idIndex !== -1) {
              ids.splice(idIndex, 1);
              nos.splice(idIndex, 1);
            }
          }
          
          setRtuOption({
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
          
          if (info.checked) {
            // 그룹 내 모든 RTU 선택
            childRTUs.forEach(rtu => {
              if (!ids.includes(rtu.rtu_id)) {
                ids.push(rtu.rtu_id);
                nos.push(rtu.model_no);
              }
            });
          } else {
            // 그룹 내 모든 RTU 해제
            const allChildRTUIds = childRTUs.map(rtu => rtu.rtu_id);
            ids = ids.filter(id => !allChildRTUIds.includes(id));
            
            const newNos = [];
            ids.forEach((id) => {
              const originalIndex = rtuOption.rtu_id.indexOf(id);
              if (originalIndex !== -1) {
                newNos.push(rtuOption.model_no[originalIndex]);
              }
            });
            nos = newNos;
          }
          
          setRtuOption({
            rtu_cnt: ids.length,
            rtu_id: ids,
            model_no: nos
          });
        }
      };

      const handleSelectAll = () => {
        const allRtuIds = [];
        const allModelNos = [];
        
        treeData.forEach(group => {
          (group.children || []).forEach(rtu => {
            allRtuIds.push(rtu.rtu_id);
            allModelNos.push(rtu.model_no);
          });
        });
        
        const totalRtuCount = allRtuIds.length;
        const selectedRtuCount = rtuOption.rtu_id.length;
        
        if (selectedRtuCount === totalRtuCount && totalRtuCount > 0) {
          setRtuOption({
            rtu_cnt: 0,
            rtu_id: [],
            model_no: []
          });
        } else {
          setRtuOption({
            rtu_cnt: allRtuIds.length,
            rtu_id: allRtuIds,
            model_no: allModelNos
          });
        }
      };

      const handleConfirm = () => {
        if (onRtuSelect) {
          onRtuSelect(rtuOption.rtu_id);
        }
        Modal.destroyAll();
      };

      const handleClose = () => {
        Modal.destroyAll();
      };

      return (
        <div className="" style={{ position: 'relative' }}>
          <div className="popup_top">
            방송권한 지역선택
            <button 
              className="btn_lbs fR bold user_popup_close"
              onClick={handleClose}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                padding: '5px 10px',
                marginTop: '-3px'
              }}
            >
              X
            </button>
          </div>
          <div className="popup_con" style={{ padding: '15px' }}>
            <div className="alarm h530p">
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li className="alarm_gry" style={{
                  backgroundColor: '#f8f9fa',
                  padding: '10px 15px',
                  borderBottom: '1px solid #dee2e6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', marginRight: '20px' }}>
                      방송지역 선택 : <span id="rtu_cnt_text" style={{ color: '#2861c0' }}>{rtuOption.rtu_cnt}</span> 개소
                    </span>
                    <span className="unit" style={{ 
                      marginLeft: '20px', 
                      fontSize: '12px', 
                      color: '#666',
                      fontStyle: 'italic'
                    }}>
                      ※ 미소속장비는 방송권한을 설정할 수 없습니다. 방송그룹을 먼저 설정해 주세요.
                    </span>
                  </div>
                  <button 
                    type="button" 
                    id="btn_all" 
                    className="btn_bs60"
                    onClick={handleSelectAll}
                  >
                    전체선택
                  </button>
                </li>
                <li id="tree" style={{
                  height: '460px',
                  overflow: 'auto',
                  border: '1px solid #dee2e6',
                  padding: '10px',
                  backgroundColor: '#fff'
                }}>
                  <Tree
                    checkable
                    treeData={treeData}
                    onCheck={onCheck}
                    checkedKeys={checkedKeys}
                    defaultExpandAll={true}
                    className="custom-tree"
                    style={{ fontSize: '12px' }}
                  />
                </li>
              </ul>
            </div>
            
            {/* 하단 버튼 영역 */}
            <div style={{ 
              marginTop: '10px', 
              textAlign: 'center',
            }}>
              <button 
                onClick={handleClose}
                style={{ 
                  padding: '8px 20px', 
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  marginRight: '10px',
                  fontSize: '14px'
                }}
              >
                취소
              </button>
              <button 
                onClick={handleConfirm}
                style={{ 
                  padding: '8px 20px', 
                  backgroundColor: '#2861c0',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                확인
              </button>
            </div>
          </div>
          
          <style dangerouslySetInnerHTML={{
            __html: `
              .custom-tree .ant-tree-node-content-wrapper {
                font-size: 12px !important;
              }
              .custom-tree .ant-tree-treenode {
                padding: 2px 0 !important;
              }
              .custom-tree .ant-tree-title {
                font-size: 12px !important;
              }
              .ant-modal-content {
                border-radius: 0px !important;
              }
              .ant-modal-confirm .ant-modal-confirm-paragraph {
                max-width: 100% !important;
              }
            `
          }} />
        </div>
      );
    };

    Modal.info({
      title: null,
      content: <BroadcastRtuPopupContent />,
      width: 700,
      maskClosable: false,
      className: 'popup_total_layout_broadcast_rtu',
      footer: null,
      closable: false,
      icon: null,
    });
  };

  // 모달 표시
  showRtuModal();
}

export function showSensorPopup(rtuId, onSensorUpdate) {
  if(!rtuId) return false;

  // 센서 정보 조회
  const fetchSensorData = () => {
    return new Promise((resolve, reject) => {
      const retrieveListURL = '/divas/set/getSensorInfo.do';
      const requestData = { rtu_id: rtuId };

      const requestOptions = {
        method: "POST",
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(requestData)
      }

      EgovNet.requestFetch(retrieveListURL,
        requestOptions,
        (resp) => {
          console.log(resp);
          resolve(resp.result);
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  // 센서 정보 저장
  const saveSensorData = (formData) => {
    return new Promise((resolve, reject) => {
      const retrieveListURL = '/divas/set/saveSensorInfo.do';
      const requestData = { 
        rtu_id: rtuId,
        ...formData 
      };

      const requestOptions = {
        method: "POST",
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(requestData)
      }

      EgovNet.requestFetch(retrieveListURL,
        requestOptions,
        (resp) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  const showSensorModal = async () => {
    try {
      const data = await fetchSensorData();
      
      const sensorTypes = [
        { id: "0", name: "강우", first_e: "0.1", second_e: "9999", maxlen: "5", avgAvailable: true },
        { id: "1", name: "수위", first_e: "0.01", second_e: "9999", maxlen: "6", avgAvailable: false },
        { id: "2", name: "적설", first_e: "0.1", second_e: "9999", maxlen: "5", avgAvailable: true },
        { id: "DP", name: "변위", first_e: "-180.01", second_e: "180", maxlen: "6", avgAvailable: false }
      ];

      const levelHeaders = data.levelHeaders || ["주의", "경계", "심각"];
      const levelCnt = levelHeaders.length;

      // 메인 컴포넌트
      const SensorPopupContent = () => {
        const [sensorData, setSensorData] = React.useState({});

        React.useEffect(() => {
          // 초기 데이터 설정 - 배열을 객체로 변환
          console.log(data.result);
          if (data.result && Array.isArray(data.result)) {
            const initialData = {};
            data.result.forEach(item => {
              initialData[item.sensor_type] = {
                BASE_RISKLEVEL1: item.base_risklevel1 ? toFixedOfNum(item.base_risklevel1, 1, 0.01) : '',
                BASE_RISKLEVEL2: item.base_risklevel2 ? toFixedOfNum(item.base_risklevel2, 1, 0.01) : '',
                BASE_RISKLEVEL3: item.base_risklevel3 ? toFixedOfNum(item.base_risklevel3, 1, 0.01) : '',
                AUTO_EVENT_USE: item.auto_event_use || '0',
                IS_AVERAGE: item.is_average || '0'
              };
            });
            setSensorData(initialData);
          }
        }, []);

        const handleRadioChange = (sensorId, fieldName, value) => {
          setSensorData(prev => ({
            ...prev,
            [sensorId]: {
              ...prev[sensorId],
              [fieldName]: value
            }
          }));
        };

        const handleInputChange = (sensorId, fieldName, value) => {
          setSensorData(prev => ({
            ...prev,
            [sensorId]: {
              ...prev[sensorId],
              [fieldName]: value
            }
          }));
        };

        const handleSave = async () => {
          try {
            // 객체를 배열로 변환하여 전송
            const sensorArray = [];
            Object.keys(sensorData).forEach(sensorType => {
              const data = sensorData[sensorType];
              sensorArray.push({
                sensor_type: sensorType,
                base_risklevel1: data.BASE_RISKLEVEL1 ? parseFloat(data.BASE_RISKLEVEL1)*100 : 0,
                base_risklevel2: data.BASE_RISKLEVEL2 ? parseFloat(data.BASE_RISKLEVEL2)*100 : 0,
                base_risklevel3: data.BASE_RISKLEVEL3 ? parseFloat(data.BASE_RISKLEVEL3)*100 : 0,
                auto_event_use: data.AUTO_EVENT_USE || '0',
                is_average: data.IS_AVERAGE || '0'
              });
            });

            const formData = {
              sensorData: sensorArray
            };
            
            await saveSensorData(formData);
            
            common_modal('success', '저장 완료', '센서 정보가 저장되었습니다.', () => {
              Modal.destroyAll();
              if (onSensorUpdate) {
                onSensorUpdate();
              }
            });
          } catch (error) {
            common_modal('error', '저장 실패', '센서 정보 저장에 실패했습니다.', () => {});
          }
        };

        const handleClose = () => {
          Modal.destroyAll();
        };

        const renderLevelInputs = (sensor) => {
          const levels = [];
          for (let i = 1; i <= levelCnt; i++) {
            levels.push(
              <td key={i}>
                <input 
                  type="text"
                  size="2"
                  maxLength={sensor.maxlen}
                  value={sensorData[sensor.id]?.[`BASE_RISKLEVEL${i}`] || ''}
                  onChange={(e) => handleInputChange(sensor.id, `BASE_RISKLEVEL${i}`, e.target.value)}
                  className={!["0", "1", "2", "DP"].includes(sensor.id) ? "bg_lgr_d2" : ""}
                  readOnly={!["0", "1", "2", "DP"].includes(sensor.id)}
                  style={{
                    width: '90%',
                    padding: '4px',
                    border: '1px solid #ddd',
                    textAlign: 'center'
                  }}
                />
              </td>
            );
          }
          return levels;
        };

        return (
          <div style={{ position: 'relative' }}>
            <div className="popup_top">
              센서 정보 설정 (장비 ID: {rtuId})
              <button 
                className="btn_pop_blue fR bold"
                onClick={handleClose}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  padding: '5px 10px',
                  marginTop: '2px'
                }}
              >
                X
              </button>
              <button 
                className="btn_pop_blue fR bold mR5"
                onClick={handleSave}
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #fff',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  padding: '5px 10px',
                  marginTop: '2px'
                }}
              >
                저장
              </button>
            </div>
            <div className="popup_con" style={{ padding: '20px' }}>
              <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                <table 
                  border="1" 
                  className="tb_data_p bg_gry3"
                  style={{ 
                    borderCollapse: 'collapse',
                    fontSize: '12px',
                    margin: '0 auto'
                  }}
                >
                  <thead>
                    <tr className="tb_data_tbg" style={{ height: '40px' }}>
                      <th className="w7" style={{ padding: '8px', border: '1px solid #ddd' }}>센서</th>
                      <th className="w7" style={{ padding: '8px', border: '1px solid #ddd' }}>기준치 사용여부</th>
                      {levelHeaders.map((header, index) => (
                        <th key={index} className="w5" style={{ padding: '8px', border: '1px solid #ddd' }}>{header}</th>
                      ))}
                      <th className="w7" style={{ padding: '8px', border: '1px solid #ddd' }}>보고서 통계 산출</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sensorTypes.map(sensor => (
                      <tr key={sensor.id} style={{ height: '50px' }}>
                        <td className="h40p" style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>
                          {sensor.name}
                        </td>
                        <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>
                          <input type="radio" className="btn_radio IS_USE" name={`AUTO_EVENT_USE_${sensor.id}`} value="0" 
                            checked={sensorData[sensor.id]?.AUTO_EVENT_USE !== "1"}
                            onChange={(e) => handleRadioChange(sensor.id, 'AUTO_EVENT_USE', e.target.value)} />미사용
                          &nbsp;
                          <input type="radio" className="btn_radio IS_USE" name={`AUTO_EVENT_USE_${sensor.id}`} value="1"
                            checked={sensorData[sensor.id]?.AUTO_EVENT_USE === "1"}
                            onChange={(e) => handleRadioChange(sensor.id, 'AUTO_EVENT_USE', e.target.value)} />사용
                        </td>
                        {renderLevelInputs(sensor)}
                        <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>
                          {sensor.avgAvailable ? (
                            <>
                              <input type="radio" className="btn_radio IS_AVERAGE" name={`IS_AVERAGE_${sensor.id}`} value="1"
                                checked={sensorData[sensor.id]?.IS_AVERAGE === "1"}
                                onChange={(e) => handleRadioChange(sensor.id, 'IS_AVERAGE', e.target.value)} />산출
                              &nbsp;
                              <input type="radio" className="btn_radio IS_AVERAGE" name={`IS_AVERAGE_${sensor.id}`} value="0"
                                checked={sensorData[sensor.id]?.IS_AVERAGE !== "1"}
                                onChange={(e) => handleRadioChange(sensor.id, 'IS_AVERAGE', e.target.value)} />제외
                            </>
                          ) : (
                            "해당없음"
                          )}
                        </td>
                      </tr>
                    ))}
                    <tr id="no_sensor" style={{display:'none'}}>
                      <td colSpan="9">센서가 없습니다.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <style dangerouslySetInnerHTML={{
              __html: `
                .ant-modal-content {
                  border-radius: 0px !important;
                }
                .ant-modal-confirm .ant-modal-confirm-paragraph {
                  max-width: 100% !important;
                }
              `
            }} />
          </div>
        );
      };

      Modal.info({
        title: null,
        icon: null,
        content: <SensorPopupContent />,
        width: 850,
        height: 450,
        maskClosable: false,
        className: 'popup_total_layout',
        footer: null,
        closable: false,
        onCancel: () => {
          Modal.destroyAll();
        }
      });

    } catch (error) {
      console.error('센서 정보 조회 오류:', error);
      Modal.error({
        title: '오류',
        content: '센서 정보를 불러오는데 실패했습니다.',
      });
    }
  };

  showSensorModal();
}