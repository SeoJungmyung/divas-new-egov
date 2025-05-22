package egovframework.divas.msg.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.poi.ss.usermodel.Workbook;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.apache.poi.ss.usermodel.*;

import egovframework.com.cmm.web.EgovComUtlController;
import egovframework.divas.com.service.SearchVO;
import egovframework.divas.com.service.impl.RtuInfoDAO;
import egovframework.divas.msg.service.DivasMsgService;
import egovframework.divas.msg.service.MessageVO;

/**
 * 각 현황들 화면을 구현하는 비즈니스 클래스
 * @author 서정명
 * @since 2022.04.10
 * @version 1.0
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      수정자          수정내용
 *  -------    --------    ---------------------------
 *  2022.04.10  서정명          최초 생성
 *
 *  </pre>
 */
@Service("DivasMsgService")
public class DivasMsgServiceImpl extends EgovAbstractServiceImpl implements DivasMsgService{
	
	@Resource(name = "RtuInfo")
	private RtuInfoDAO rtuInfo;
	
	@Resource(name = "messageDAO")
	private MessageDAO messageDAO;

	@Override
	public List<MessageVO> getSmsGroup(SearchVO searchVO) throws Exception {
		return messageDAO.getSmsGroup(searchVO);
	}

	@Override
	public List<MessageVO> getSmsUser(SearchVO searchVO) throws Exception {
		return messageDAO.getSmsUser(searchVO);
	}

	@Override
	public List<MessageVO> getSmsEquipment(SearchVO searchVO) throws Exception {
		return messageDAO.getSmsEquipment(searchVO);
	}
	
	@Override
	public List<MessageVO> getSmsRtuEquipment(SearchVO searchVO) throws Exception {
		return messageDAO.getSmsRtuEquipment(searchVO);
	}

	@Override
	public void setSendXro(MessageVO msgVO) throws Exception {
		
		// 수신자가 한명 이상일때
		if(msgVO.getReceiver_arr().size() > 0) {
			if(msgVO.getSms_type().equals("1")) {
				msgVO.setSend_date(msgVO.getDd()+msgVO.getHh()+msgVO.getMm()+"00");
			}
		
			// 번호 세팅
			List<String> tmsArr = new ArrayList<String>();
			for(int i=0; i<msgVO.getReceiver_arr().size(); i++) {
				String tmp = "^"+ msgVO.getReceiver_arr().get(i);
				if(tmp.indexOf("-") != -1) {
					tmp = tmp.replaceAll("-","");
				}
				tmsArr.add(tmp);
			}
			msgVO.setReceiver_arr(tmsArr);
			
			// callback 번호 추가
			messageDAO.setSendXro(msgVO);			
		}
	}

	@Override
	public List<MessageVO> getMsgHist(SearchVO searchVO) throws Exception {
		return messageDAO.getMsgHist(searchVO);
	}

	@Override
	public List<MessageVO> getMsgHistDetail(SearchVO searchVO) throws Exception {
		return messageDAO.getMsgHistDetail(searchVO);
	}

	@Override
	public List<MessageVO> getSmsEquipView(MessageVO msgVO) throws Exception {
		return messageDAO.getSmsEquipView(msgVO);
	}

	@Override
	public void setMsgRecDataChange(MessageVO msgVO) throws Exception {
		if(msgVO.getChange_mode().equals("insert")) {
			messageDAO.setSmsUserIn(msgVO);			
		}else if(msgVO.getChange_mode().equals("update")) {
			messageDAO.setSmsUserUp(msgVO);			
		}else if(msgVO.getChange_mode().equals("delete")) {
			messageDAO.setSmsUserDe(msgVO);			
		}else {
			// 경고
		}
	}

	@Override
	public void setMsgGroupChange(MessageVO msgVO) throws Exception {
		if(msgVO.getChange_mode().equals("insert")) {
			messageDAO.setSmsGroupIn(msgVO);			
		}else if(msgVO.getChange_mode().equals("update")) {
			messageDAO.setSmsGroupUp(msgVO);			
		}else if(msgVO.getChange_mode().equals("delete")) {
			messageDAO.setSmsGroupDe(msgVO);			
		}else {
			// 경고
		}
	}

	@Override
	public void setRecBatchDelete(MessageVO msgVO) throws Exception {
		messageDAO.setSmsUserMultiDe(msgVO);
	}

	 /**
     * 엑셀 파일 데이터 파싱
     */
    @Override
    public List<MessageVO> parseExcelFile(Workbook workbook, String organId, String organCode) throws Exception {
        List<MessageVO> receivers = new ArrayList<>();
        Sheet sheet = workbook.getSheetAt(0);
        
        for (int i = 1; i <= sheet.getLastRowNum(); i++) {
            Row row = sheet.getRow(i);
            if (row == null) continue;
            
            // 필수 데이터 확인
            String userName = getCellValueAsString(row.getCell(1));

            String mobile = getCellValueAsString(row.getCell(2));
            
            if (userName == null || userName.trim().isEmpty() || 
                mobile == null || mobile.trim().isEmpty()) {
                continue; // 이름이나 전화번호가 없는 행은 건너뜀
            }
            
            // 전화번호 형식 정리 (하이픈 제거)
            mobile = mobile.replaceAll("[^0-9]", "");
            
            // 데이터 모델에 추가
            MessageVO receiver = new MessageVO();
            receiver.setOrgan_id(organId);
            receiver.setOrgan_code(organCode);
            receiver.setUser_name(userName);
            receiver.setMobile(mobile);
            
            // 선택적 데이터
            String groupName = getCellValueAsString(row.getCell(0));
            String memo = getCellValueAsString(row.getCell(3));
            
            receiver.setSms_group_name(groupName);
            receiver.setMemo(memo);
            
            receivers.add(receiver);
        }
        
        return receivers;
    }

    /**
     * 엑셀에서 가져온 수신자 정보를 대량으로 등록
     */
    @Override
    public int batchInsertReceivers(List<MessageVO> receivers) throws Exception {
        if (receivers.isEmpty()) {
            return 0;
        }
        
        // 기존 그룹명 조회
        Map<String, Integer> groupMap = new HashMap<>();
        List<MessageVO> existingGroups = messageDAO.selectAllGroups(receivers.get(0));
        
//        LOGGER.debug("existingGroups ", existingGroups);
        
        for (MessageVO group : existingGroups) {
            String groupName = group.getSms_group_name();
            Integer groupId = group.getSms_group_id();
            groupMap.put(groupName, groupId);
        }
        
        // 그룹 처리 및 데이터 삽입
        int importCount = 0;
        for (MessageVO receiver : receivers) {
            // 그룹명이 있으면 해당 그룹 ID 설정
            if (receiver.getSms_group_name() != null && !receiver.getSms_group_name().trim().isEmpty()) {
                Integer groupId = groupMap.get(receiver.getSms_group_name());
                
                // 없는 그룹이면 새로 생성
                if (groupId == null) {
                	MessageVO groupVO = new MessageVO();
                    groupVO.setOrgan_id(receiver.getOrgan_id());
                    groupVO.setOrgan_code(receiver.getOrgan_code());
                    groupVO.setSms_group_name(receiver.getSms_group_name());
                    
                    messageDAO.insertGroup(groupVO);
                    groupId = groupVO.getSms_group_id();
                    groupMap.put(receiver.getSms_group_name(), groupId);
                }
                
                receiver.setSms_group_id(groupId);
            } else {
                // 기본 그룹(1) 설정
                receiver.setSms_group_id(1);
            }
            
            // 전화번호 중복 체크
            if (!messageDAO.checkDuplicateMobile(receiver)) {
            	messageDAO.insertReceiver(receiver);
                importCount++;
            }
        }
        
        return importCount;
    }
    
    // 유틸리티 메서드
    private String getCellValueAsString(Cell cell) {
        if (cell == null) {
            return "";
        }
        
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                double value = cell.getNumericCellValue();
                if (value == Math.floor(value)) {
                    return String.format("%.0f", value);
                } else {
                    return String.valueOf(value);
                }
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                return cell.getCellFormula();
            default:
                return "";
        }
    }

	
}