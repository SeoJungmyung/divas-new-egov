package egovframework.divas.abr.service.impl;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

import javax.annotation.Resource;

import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;

import egovframework.divas.abr.service.DivasAbrService;
import egovframework.divas.com.service.BroadcastVO;
import egovframework.divas.com.service.CommonVO;
import egovframework.divas.com.service.RtuVO;
import egovframework.divas.com.service.SearchVO;
import egovframework.divas.com.service.impl.BroadcastDAO;
import egovframework.divas.com.service.impl.RtuInfoDAO;

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
@Service("DivasAbrService")
public class DivasAbrServiceImpl extends EgovAbstractServiceImpl implements DivasAbrService{
	
	private static final int BroadcastVO = 0;

	@Resource(name = "RtuInfo")
	private RtuInfoDAO rtuInfo;
	
	@Resource(name = "broadcastDAO")
	private BroadcastDAO broadcastDAO;

	@Override
	public List<RtuVO> actionBroadcastRtuGroupList(CommonVO commonVO) throws Exception {
		return rtuInfo.getBroadcastRtuGroupList(commonVO);
	}
	
	@Override
	public List<RtuVO> actionBroadcastRtuList(CommonVO commonVO) throws Exception {
		return rtuInfo.getBroadcastRtuList(commonVO);
	}

	@Override
	public List<BroadcastVO> actionBroadcastScriptList(CommonVO commonVO) throws Exception {
		return broadcastDAO.getBroadCastScript(commonVO);
	}

	@Override
	public BroadcastVO actionBroadcastDetail(SearchVO searchVO) throws Exception {
		BroadcastVO bVO = broadcastDAO.getBroadcastDetail(searchVO);
		String is_plan_gubun = "일반방송";
		if(bVO.getIs_plan() == null) {
			bVO.setIs_plan_name("수동");
		} else {
			if(bVO.getIs_plan().equals("0")) {
				bVO.setIs_plan_name("수동");
				is_plan_gubun = "모바일";
			}else if(bVO.getIs_plan().equals("1")){
				bVO.setIs_plan_name("예약");
				is_plan_gubun = "예약방송";
			}else if(bVO.getIs_plan().equals("9")){
				bVO.setIs_plan_name("자동");
				is_plan_gubun = "자동방송";
			} else {
				bVO.setIs_plan_name("수동");
			}
		}
		bVO.setIs_plan_gubun(is_plan_gubun);
		return bVO;
	}

	@Override
	public List<BroadcastVO> actionBroadcastState(SearchVO searchVO) throws Exception {
		List<BroadcastVO> broadcastList = broadcastDAO.getBroadcastState(searchVO);
		for(BroadcastVO bVO : broadcastList) {
			
			String tms_state = this.getSentence("0", bVO.getTrans_flag());
			String tms_error = this.getSentence("e", bVO.getTrans_error());
			
			if(searchVO.getVhf_use() == 1) {
				if(bVO.getVhf_call() == 1) {
					bVO.setState_txt("전송중");
					bVO.setError_txt("-");
				}else if(bVO.getVhf_call() == 7 || bVO.getTrans_flag() == 99) {
					bVO.setState_txt("방송완료");
					bVO.setError_txt("-");
				}else if(bVO.getVhf_call() == 9) {
					if(bVO.getTrans_flag() == 99) {
						bVO.setState_txt("방송완료");
						bVO.setError_txt("-");
					}else {
						bVO.setState_txt(tms_state);
						bVO.setError_txt(tms_error);					
					}
				}else if(bVO.getTrans_error() == 0) {
					bVO.setState_txt(tms_state);
					bVO.setError_txt("-");
				}else {
					bVO.setState_txt(tms_state);
					bVO.setError_txt(tms_error);					
				}
				// 패킷 오류 처리
				if( (bVO.getTrans_flag() == 30 || bVO.getTrans_flag() == 40) &&
					(bVO.getTrans_error() == 13 || bVO.getTrans_error() == 14 || 
						bVO.getTrans_error() == 15) ) {
					bVO.setState_txt("방송완료");
					bVO.setError_txt("-");
				}
			}else { // VHF 미사용
				if(bVO.getTrans_error() == 0) {
					bVO.setState_txt(tms_state);
					bVO.setError_txt("-");	
				}else {
					bVO.setState_txt(tms_state);
					bVO.setError_txt(tms_error);	
				}
				// 패킷 오류 처리
				if( (bVO.getTrans_flag() == 30 || bVO.getTrans_flag() == 40) &&
					(bVO.getTrans_error() == 13 || bVO.getTrans_error() == 14 || 
						bVO.getTrans_error() == 15) ) {
					bVO.setState_txt("방송완료");
					bVO.setError_txt("-");
				}
			}
			if(searchVO.getXro_use() == 1) {
				// TODO  크로샷 사용일때 작성할 것!
			}
		}
		return broadcastList;
	}
	
	// 상태값 조회
	public String getSentence(String type, Integer flag) throws Exception {
		String result = "";
		if(type.equals("0")) {
			switch(flag){
				case 0:			result = "방송전송대기중";		break;
				case 10:		result = "SMS전송중";			break;
				case 20:		result = "장비접속중";			break;
				case 70:		result = "장비접속중";			break;
				case 30:		result = "방송정보전송중";		break;
				case 40:		result = "방송중";			break;
				case 50:		result = "방송완료";			break;
				case 99:		result = "방송완료";			break;
				default:		result = "전송대기중";			break;
			}
		}else if(type.equals("1")) {
			switch(flag){
				case 0:			result = "명령 등록";			break;
				case 10:		result = "Fetch 신호 전송";	break;
				case 20:		result = "장비 접속 대기";		break;
				case 70:		result = "장비 접속 대기";		break;
				case 30:		result = "Message 전송";		break;
				case 40:		result = "방송 상태 수신";		break;
				case 50:		result = "강우량 범위 수신";	break;
				case 51:		result = "강우량 범위 전송";	break;
				case 60:		result = "Config Read";		break;
				case 61:		result = "Config Write";	break;
				case 99:		result = "명령 전송 종료";		break;
				default:		result = "명령 등록";			break;
			}
		}else {
			switch(flag){
				case 0:			result = "정상";					break;
				case 6:			result = "NAK 수신";				break;
				case 11:		result = "Socket Open 오류";		break;
				case 12:		result = "Socket 접속 오류";		break;
				case 13:		result = "Data 송신 오류";			break;
				case 14:		result = "Data 수신 오류";			break;
				case 15:		result = "Data 0 Byte 수신";		break;
				case 21:		result = "Wave File 열기 실패";	break;
				case 22:		result = "Wave File 읽기 실패";	break;
				case 23:		result = "Wave File I/O 예외 처리";	break;
				case 24:		result = "Wave File 전송 위치 오류";	break;
				case 31:		result = "Sentence 전송 위치 오류";		break;
				case 32:		result = "Sentence 읽기 실패";		break;
				case 33:		result = "지역정보 읽기 실패";		break;
				case 34:		result = "기간 일자 정보 분석 오류";	break;
				case 51:		result = "강우 자료 저장 실패";		break;
				case 52:		result = "강우 자료 읽기 실패";		break;
				case 61:		result = "RTU 환경정보 저장 실패";	break;
				case 62:		result = "RTU 환경정보 읽기 실패";	break;
				case 81:		result = "Data 전송 취소";			break;
				case 90:		result = "OA장비 접속 에러";		break;
				case 99:		result = "Time Out";			break;
				default:		result = "기타";					break;
			}
		}
		return result;
	}

	@Override
	public void actionSetBroadcastLog(BroadcastVO brdVO) throws Exception {
//		LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
//		Timestamp ts = Timestamp.valueOf(now);
//		String valid = EgovFileScrty.encode(brdVO.getUser_id()+ts);
		
		// UUID 사용 랜덤아이디 생성
		String valid = UUID.randomUUID().toString().replace("-", "");
		brdVO.setValid(valid);
		broadcastDAO.setBroadcastLog(brdVO);

		//rtu_log 테이블 insert
		List<Integer> tmpList = brdVO.getRtu_id_arr();
		broadcastDAO.setRtuLog(tmpList);
	}

	@Override
	public void actionAbrScriptChange(BroadcastVO brdVO) throws Exception {
//		System.out.println(brdVO);
		if(brdVO.getChange_mode().equals("insert")) {
			broadcastDAO.setScriptIn(brdVO);			
		}else if(brdVO.getChange_mode().equals("update")) {
			broadcastDAO.setScriptUp(brdVO);			
		}else if(brdVO.getChange_mode().equals("delete")) {
			broadcastDAO.setScriptDe(brdVO);			
		}else {
			// 경고
		}
	}

	@Override
	public List<BroadcastVO> actionBroadcastPlan(CommonVO commonVO) throws Exception {
		return broadcastDAO.getBroadCastPlan(commonVO);
	}

	@Override
	public void actionAbrDateChange(BroadcastVO brdVO) throws Exception {
		if(brdVO.getChange_mode().equals("insert")) {
			broadcastDAO.setScriptIn(brdVO);			
		}else if(brdVO.getChange_mode().equals("update")) {
			broadcastDAO.setPlanUp(brdVO);			
			broadcastDAO.setRtuPlanDe(brdVO);	
			
//			System.out.println(brdVO.getRtu_id_arr());
			if(brdVO.getRtu_id_arr() != null) {
				HashMap<String, Object> tmpMap = new HashMap<String, Object>();
				
				tmpMap.put("brdVO", brdVO);				
				tmpMap.put("rtu_id_arr", brdVO.getRtu_id_arr());
				
				// rtu_id 배열 저장
				broadcastDAO.setRtuPlan(tmpMap);		
			}
			
		}else if(brdVO.getChange_mode().equals("delete")) {
			broadcastDAO.setPlanDe(brdVO);			
			broadcastDAO.setRtuPlanDe(brdVO);			
		}else {
			// 경고
		}
		
	}

	@Override
	public void actionAbrDateStateChange(BroadcastVO brdVO) throws Exception {
		broadcastDAO.setBroadCastPlanStateChange(brdVO);
	}


	
	
}