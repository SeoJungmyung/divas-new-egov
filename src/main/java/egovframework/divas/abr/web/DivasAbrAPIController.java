package egovframework.divas.abr.web;

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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import egovframework.com.cmm.EgovMessageSource;
import egovframework.com.cmm.LoginVO;
import egovframework.com.cmm.ResponseCode;
import egovframework.com.cmm.service.ResultVO;
import egovframework.com.cmm.web.EgovComUtlController;
import egovframework.com.utl.cas.service.EgovSessionCookieUtil;
import egovframework.divas.abr.service.DivasAbrService;
import egovframework.divas.com.service.BroadcastVO;
import egovframework.divas.com.service.CommonVO;
import egovframework.divas.com.service.RtuVO;
import egovframework.divas.com.service.SearchVO;

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
public class DivasAbrAPIController {
	
	/** EgovLoginService */
	@Resource(name = "DivasAbrService")
	private DivasAbrService abrService;

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
	 * 일반방송 화면
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/abr/abrCommon.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO abrCommon(HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		String organ_id = (String)EgovSessionCookieUtil.getSessionAttribute(request, "organ_id");
		String user_type = (String)EgovSessionCookieUtil.getSessionAttribute(request, "user_type");
		String is_rtu_id = (String)EgovSessionCookieUtil.getSessionAttribute(request, "is_rtu_id");
		int vhf_use = (int)EgovSessionCookieUtil.getSessionAttribute(request, "vhf_use");
		
		CommonVO commonVO = new CommonVO();
		commonVO.setOrgan_id(organ_id);
		commonVO.setUser_type(user_type);
		commonVO.setIs_rtu_id(is_rtu_id);
		commonVO.setVhf_use(vhf_use);
		
		// 방송장비 리스트 가져옴
		List<RtuVO> resultGroupList = abrService.actionBroadcastRtuGroupList(commonVO);
		resultMap.put("broadcastRtuGroupList", resultGroupList);
		List<RtuVO> resultList = abrService.actionBroadcastRtuList(commonVO);
		resultMap.put("broadcastRtuList", resultList);
		// 방송문안 리스트
		List<BroadcastVO> scriptList = abrService.actionBroadcastScriptList(commonVO);
		resultMap.put("scriptList", scriptList);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * 일반방송 - 전송
	 * 
	 * 전송시 변경사항만 파라미터 BroadcastVO로 받고
	 * 나머지 필요한 컬럼은 조회 후 인서트하도록 수정?
	 * 
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/abr/abrCommonSend.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO abrCommonSend(@RequestBody BroadcastVO brdVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		
		String organ_id = (String)EgovSessionCookieUtil.getSessionAttribute(request, "organ_id");
		String user_id = (String)EgovSessionCookieUtil.getSessionAttribute(request, "user_id");
		
		brdVO.setOrgan_id(organ_id);
		brdVO.setUser_id(user_id);
		
		abrService.actionSetBroadcastLog(brdVO);
		
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * 문안설정 - 문안 리스트
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/abr/abrScript.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO abrScript(@RequestBody CommonVO commonVO, HttpServletRequest request) throws Exception {
//		System.out.println("==========abrScript()!========");
		
		ResultVO resultVO = new ResultVO();
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		String organ_id = (String)EgovSessionCookieUtil.getSessionAttribute(request, "organ_id");
		String user_type = (String)EgovSessionCookieUtil.getSessionAttribute(request, "user_type");
		String is_rtu_id = (String)EgovSessionCookieUtil.getSessionAttribute(request, "is_rtu_id");
		int vhf_use = (int)EgovSessionCookieUtil.getSessionAttribute(request, "vhf_use");
		
//		CommonVO commonVO = new CommonVO();
		commonVO.setOrgan_id(organ_id);
		commonVO.setUser_type(user_type);
		commonVO.setIs_rtu_id(is_rtu_id);
		commonVO.setVhf_use(vhf_use);
		
		// 방송문안 리스트
		List<BroadcastVO> scriptList = abrService.actionBroadcastScriptList(commonVO);
		resultMap.put("scriptList", scriptList);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * 문안 변경
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/abr/abrScriptChange.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO abrScriptChange(@RequestBody BroadcastVO brdVO, HttpServletRequest request) throws Exception {
//		System.out.println("==========abrScriptChange()!========");
		
		ResultVO resultVO = new ResultVO();
		
		String organ_id = (String)EgovSessionCookieUtil.getSessionAttribute(request, "organ_id");
		String user_id = (String)EgovSessionCookieUtil.getSessionAttribute(request, "user_id");
		
		brdVO.setOrgan_id(organ_id);
		brdVO.setUser_id(user_id);
		
		// 방송문안 변경
		abrService.actionAbrScriptChange(brdVO);
		
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}

	/**
	 * 방송일정 - 일정 리스트
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/abr/abrDateList.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO abrDateList(@RequestBody CommonVO commonVO, HttpServletRequest request) throws Exception {
//		System.out.println("==========abrDateList()!========");
		
		ResultVO resultVO = new ResultVO();
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		String organ_id = (String)EgovSessionCookieUtil.getSessionAttribute(request, "organ_id");
		String user_type = (String)EgovSessionCookieUtil.getSessionAttribute(request, "user_type");
		String is_rtu_id = (String)EgovSessionCookieUtil.getSessionAttribute(request, "is_rtu_id");
		int vhf_use = (int)EgovSessionCookieUtil.getSessionAttribute(request, "vhf_use");
		
		commonVO.setOrgan_id(organ_id);
		commonVO.setUser_type(user_type);
		commonVO.setIs_rtu_id(is_rtu_id);
		commonVO.setVhf_use(vhf_use);
		
		// 방송일정 리스트
		List<BroadcastVO> planList = abrService.actionBroadcastPlan(commonVO);
		resultMap.put("planList", planList);
		
		// 방송장비 리스트
		List<RtuVO> resultGroupList = abrService.actionBroadcastRtuGroupList(commonVO);
		resultMap.put("broadcastRtuGroupList", resultGroupList);
		List<RtuVO> resultList = abrService.actionBroadcastRtuList(commonVO);
		resultMap.put("broadcastRtuList", resultList);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * 일정 변경
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/abr/abrDateChange.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO abrDateChange(@RequestBody BroadcastVO brdVO, HttpServletRequest request) throws Exception {
//		System.out.println("==========abrScriptChange()!========");
		
		ResultVO resultVO = new ResultVO();
		
		String organ_id = (String)EgovSessionCookieUtil.getSessionAttribute(request, "organ_id");
		String user_id = (String)EgovSessionCookieUtil.getSessionAttribute(request, "user_id");
		
		brdVO.setOrgan_id(organ_id);
		brdVO.setUser_id(user_id);
		
		// 방송문안 변경
		abrService.actionAbrDateChange(brdVO);
		
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * 방송일정 - 방송상태 변경
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/abr/abrDateStateChange.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO abrDateStateChange(@RequestBody BroadcastVO brdVO, HttpServletRequest request) throws Exception {
		
		ResultVO resultVO = new ResultVO();
		
		System.out.println("=====================");
		System.out.println(brdVO);
		
		// 방송문안 변경
		abrService.actionAbrDateStateChange(brdVO);
		
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	
}