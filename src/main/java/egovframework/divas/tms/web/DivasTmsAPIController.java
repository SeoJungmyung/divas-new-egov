package egovframework.divas.tms.web;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.egovframe.rte.fdl.cmmn.trace.LeaveaTrace;
import org.egovframe.rte.fdl.property.EgovPropertyService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import egovframework.com.cmm.EgovMessageSource;
import egovframework.com.cmm.ResponseCode;
import egovframework.com.cmm.service.ResultVO;
import egovframework.com.cmm.web.EgovComUtlController;
import egovframework.com.utl.cas.service.EgovSessionCookieUtil;
import egovframework.divas.com.service.AWSVO;
import egovframework.divas.com.service.BroadcastVO;
import egovframework.divas.com.service.EventVO;
import egovframework.divas.com.service.FlowVO;
import egovframework.divas.com.service.RainVO;
import egovframework.divas.com.service.RtuVO;
import egovframework.divas.com.service.SearchVO;
import egovframework.divas.com.service.SnowVO;
import egovframework.divas.tms.service.DivasTmsService;

/**
 * 강우현황을 조회하는 비즈니스 구현 클래스
 * @author 화진티엔아이 기술연구소 서정명
 * @since 2022.03.22
 * @version 1.0
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *  수정일      수정자      수정내용
 *  -------            --------        ---------------------------
 *  2022.03.22  서정명          최초 생성
 *
 *  </pre>
 */
@Controller
public class DivasTmsAPIController {

	@Resource(name = "DivasTmsService")
	private DivasTmsService divasTmsService;

	/** EgovMessageSource */
	@Resource(name = "egovMessageSource")
	EgovMessageSource egovMessageSource;

	/** EgovPropertyService */
	@Resource(name = "propertiesService")
	protected EgovPropertyService propertiesService;

	/** TRACE */
	@Resource(name = "leaveaTrace")
	LeaveaTrace leaveaTrace;
	
	private static final Logger LOGGER = LoggerFactory.getLogger(EgovComUtlController.class);

	/**
	 * 강우 현황.
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/tms/tmsRain.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO tmsRain(HttpServletRequest request) throws Exception {
//		System.out.println("==========tmsRain()!========");
		ResultVO resultVO = new ResultVO();
		
//		String userId = (String)EgovSessionCookieUtil.getSessionAttribute(request, "user_id");
		int levelCnt = (Integer)EgovSessionCookieUtil.getSessionAttribute(request, "level_cnt");
		String organ_id = (String)EgovSessionCookieUtil.getSessionAttribute(request, "organ_id");
		
		RtuVO rtuVO = new RtuVO();
		
		rtuVO.setLevel_cnt(levelCnt);
		rtuVO.setOrgan_id(organ_id);
		rtuVO.setArea_code("");
		rtuVO.setMaintype(0);
		
//		if(sort_base = 0) {
		rtuVO.setSort("A.SORT_FLAG");	
//		}else if(sort_base = 1) {
//			rtuVO.setSort("AREA_CODE");			
//		}else if(sort_base = 2){
//			rtuVO.setSort("RTU_NAME");			
//		}
		
		rtuVO.setW_sensertype("0");
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<RainVO> resultList = divasTmsService.actionTmsRain(rtuVO);
		
		resultMap.put("rainList", resultList);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * 수위 현황
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/tms/tmsFlow.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO tmsFlow(HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		
//		String userId = (String)EgovSessionCookieUtil.getSessionAttribute(request, "user_id");
		int levelCnt = (Integer)EgovSessionCookieUtil.getSessionAttribute(request, "level_cnt");
		String organ_id = (String)EgovSessionCookieUtil.getSessionAttribute(request, "organ_id");
		
		RtuVO rtuVO = new RtuVO();
		
		rtuVO.setLevel_cnt(levelCnt);
		rtuVO.setOrgan_id(organ_id);
		rtuVO.setArea_code("");
		rtuVO.setMaintype(0);
		
//		if(sort_base = 0) {
		rtuVO.setSort("A.SORT_FLAG");	
//		}else if(sort_base = 1) {
//			rtuVO.setSort("AREA_CODE");			
//		}else if(sort_base = 2){
//			rtuVO.setSort("RTU_NAME");			
//		}
		
		rtuVO.setW_sensertype("1");
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<FlowVO> resultList = divasTmsService.actionTmsFlow(rtuVO);
		
		resultMap.put("flowList", resultList);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * AWS 현황
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/tms/tmsAWS.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO tmsAWS(HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		
//		String userId = (String)EgovSessionCookieUtil.getSessionAttribute(request, "user_id");
		int levelCnt = (Integer)EgovSessionCookieUtil.getSessionAttribute(request, "level_cnt");
		String organ_id = (String)EgovSessionCookieUtil.getSessionAttribute(request, "organ_id");
		
		RtuVO rtuVO = new RtuVO();
		
		rtuVO.setLevel_cnt(levelCnt);
		rtuVO.setOrgan_id(organ_id);
		rtuVO.setArea_code("");
		rtuVO.setMaintype(0);
		
//		if(sort_base = 0) {
		rtuVO.setSort("A.SORT_FLAG");	
//		}else if(sort_base = 1) {
//			rtuVO.setSort("AREA_CODE");			
//		}else if(sort_base = 2){
//			rtuVO.setSort("RTU_NAME");			
//		}
		
		rtuVO.setW_sensertype("3");
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<AWSVO> resultList = divasTmsService.actionTmsAWS(rtuVO);
		
		resultMap.put("awsList", resultList);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * AWS 현황
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/tms/tmsSnow.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO tmsSnow(HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		
//		String userId = (String)EgovSessionCookieUtil.getSessionAttribute(request, "user_id");
		int levelCnt = (Integer)EgovSessionCookieUtil.getSessionAttribute(request, "level_cnt");
		String organ_id = (String)EgovSessionCookieUtil.getSessionAttribute(request, "organ_id");
		
		RtuVO rtuVO = new RtuVO();
		
		rtuVO.setLevel_cnt(levelCnt);
		rtuVO.setOrgan_id(organ_id);
		rtuVO.setArea_code("");
		rtuVO.setMaintype(0);
		
//		if(sort_base = 0) {
		rtuVO.setSort("A.SORT_FLAG");	
//		}else if(sort_base = 1) {
//			rtuVO.setSort("AREA_CODE");			
//		}else if(sort_base = 2){
//			rtuVO.setSort("RTU_NAME");			
//		}
		
		rtuVO.setW_sensertype("2");
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<SnowVO> resultList = divasTmsService.actionTmsSnow(rtuVO);
		
		resultMap.put("snowList", resultList);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * 방송 현황
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/tms/tmsBroadcast.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO tmsBroadcast(HttpServletRequest request) throws Exception {
//		System.out.println("==========tmsBroadcast()!========");
		ResultVO resultVO = new ResultVO();
		
		String organ_id = (String)EgovSessionCookieUtil.getSessionAttribute(request, "organ_id");
		int alarm_cnt = (Integer)EgovSessionCookieUtil.getSessionAttribute(request, "alarm_cnt");
		String userId = (String)EgovSessionCookieUtil.getSessionAttribute(request, "user_id");
		
		SearchVO searchVO = new SearchVO();
		
		searchVO.setOrgan_id(organ_id);
		searchVO.setAlarm_cnt(alarm_cnt);
		searchVO.setUser_id(userId);
		
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<BroadcastVO> resultList = divasTmsService.actionTmsBroadcast(searchVO);
		
		resultMap.put("broadcastList", resultList);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * 방송 이벤트(경보) 현황
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/tms/tmsEvent.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO tmsEvent(HttpServletRequest request) throws Exception {
		System.out.println("==========tmsEvent()!========");
		ResultVO resultVO = new ResultVO();
		
		String organ_id = (String)EgovSessionCookieUtil.getSessionAttribute(request, "organ_id");
		int level_cnt = (Integer)EgovSessionCookieUtil.getSessionAttribute(request, "level_cnt");
		int alert_cnt = (Integer)EgovSessionCookieUtil.getSessionAttribute(request, "alert_cnt");
		
		SearchVO searchVO = new SearchVO();
		
		searchVO.setOrgan_id(organ_id);
		searchVO.setLevel_cnt(level_cnt);
		searchVO.setAlert_cnt(alert_cnt);
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<EventVO> resultList = divasTmsService.actionTmsEventGroup(searchVO);
		resultMap.put("eventGroupList", resultList);
		
		resultList = divasTmsService.actionTmsEvent(searchVO);
		resultMap.put("eventList", resultList);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * 장비상태 현황
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/tms/tmsRtuState.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO tmsRtuState(HttpServletRequest request) throws Exception {
		System.out.println("==========tmsRtuState()!========");
		ResultVO resultVO = new ResultVO();
		
		String organ_id = (String)EgovSessionCookieUtil.getSessionAttribute(request, "organ_id");
//		int level_cnt = (Integer)EgovSessionCookieUtil.getSessionAttribute(request, "level_cnt");
//		int alert_cnt = (Integer)EgovSessionCookieUtil.getSessionAttribute(request, "alert_cnt");
//		
//		SearchVO searchVO = new SearchVO();
//		
//		searchVO.setOrgan_id(organ_id);
//		searchVO.setLevel_cnt(level_cnt);
//		searchVO.setAlert_cnt(alert_cnt);
		RtuVO rtuVO = new RtuVO();
		rtuVO.setOrgan_id(organ_id);
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<RtuVO> resultList = divasTmsService.actionTmsRtuState(rtuVO);
		resultMap.put("rtuStateList", resultList);
		
		List<RtuVO> resultSpeakerList = new ArrayList<RtuVO>();
		for (RtuVO CRtuVO : resultList) {
			resultSpeakerList.add(divasTmsService.actionTmsRtuSpeaker(CRtuVO));
		}
		resultMap.put("rtuSpeakerList", resultSpeakerList);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
}