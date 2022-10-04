package egovframework.divas.set.web;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.egovframe.rte.fdl.cmmn.trace.LeaveaTrace;
import org.egovframe.rte.fdl.property.EgovPropertyService;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import egovframework.com.cmm.EgovMessageSource;
import egovframework.com.cmm.LoginVO;
import egovframework.com.cmm.ResponseCode;
import egovframework.com.cmm.service.ResultVO;
import egovframework.com.utl.cas.service.EgovSessionCookieUtil;
import egovframework.divas.abr.service.DivasAbrService;
import egovframework.divas.com.service.CommonVO;
import egovframework.divas.com.service.DivasCommonService;
import egovframework.divas.com.service.LeftMenuVO;
import egovframework.divas.com.service.RtuVO;
import egovframework.divas.set.service.AreaInfoVO;
import egovframework.divas.set.service.DivasSetService;
import egovframework.divas.set.service.OrganInfoVO;
import egovframework.divas.set.service.UserInfoVO;

/**
 * 각 환경설정을 조회, 설정하는 비즈니스 구현 클래스
 * @author 화진티엔아이 기술연구소 서정명
 * @since 2022.06.10
 * @version 1.0
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *  수정일      수정자      수정내용
 *  -------            --------        ---------------------------
 *  2022.06.10  서정명          최초 생성
 *
 *  </pre>
 */
@Controller
public class DivasSetAPIController {

	@Resource(name = "DivasSetService")
	private DivasSetService divasSetService;
	
	@Resource(name = "loginService")
	private DivasCommonService commonService;
	
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
	
	/**
	 * 시스템 설정 변경
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/set/SetEnv.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody Map<String, Object> actionRptAbr(HttpServletRequest request) throws Exception {
//		ResultVO resultVO = new ResultVO();
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		// 변경된 값 저장 로직
		
		
		// 다시 받아옴
		String organ_id = (String)EgovSessionCookieUtil.getSessionAttribute(request, "organ_id");
		String user_id = (String)EgovSessionCookieUtil.getSessionAttribute(request, "user_id");
		String user_name = (String)EgovSessionCookieUtil.getSessionAttribute(request, "user_name");
		String user_type = (String)EgovSessionCookieUtil.getSessionAttribute(request, "user_type");
		LoginVO loginResultVO = new LoginVO();
		loginResultVO.setOrgan_id(organ_id);
		loginResultVO.setUser_id(user_id);
		loginResultVO.setUser_name(user_name);
		loginResultVO.setUser_type(user_type);
		
		// 공용변수 세션 세팅
		CommonVO commonVO = commonService.setSession(loginResultVO);
					
		// 세션 정보 저장
		EgovSessionCookieUtil.setSessionAttribute(request, "user_id", commonVO.getUser_id());
		EgovSessionCookieUtil.setSessionAttribute(request, "user_type", commonVO.getUser_type());
		EgovSessionCookieUtil.setSessionAttribute(request, "user_name", commonVO.getUser_name());
		EgovSessionCookieUtil.setSessionAttribute(request, "is_rtu_id", commonVO.getIs_rtu_id());
		
		EgovSessionCookieUtil.setSessionAttribute(request, "organ_id", commonVO.getOrgan_id());
		// 임시 32956
		EgovSessionCookieUtil.setSessionAttribute(request, "organ_code", "32956");
		EgovSessionCookieUtil.setSessionAttribute(request, "organ_name", commonVO.getOrgan_name());
		
		EgovSessionCookieUtil.setSessionAttribute(request, "load_time", commonVO.getLoad_time());
		EgovSessionCookieUtil.setSessionAttribute(request, "vhf_use", commonVO.getVhf_use());
		EgovSessionCookieUtil.setSessionAttribute(request, "sort_base", commonVO.getSort_base());
		EgovSessionCookieUtil.setSessionAttribute(request, "level_cnt", commonVO.getLevel_cnt());
		EgovSessionCookieUtil.setSessionAttribute(request, "alarm_cnt", commonVO.getAlarm_cnt());
		EgovSessionCookieUtil.setSessionAttribute(request, "alert_cnt", commonVO.getAlert_cnt());
		EgovSessionCookieUtil.setSessionAttribute(request, "xro_use", commonVO.getXro_use());
		
		// left menu 호출
		List<LeftMenuVO> topMenuList = commonService.actionMenuTopData(commonVO.getUser_type());
		List<LeftMenuVO> inMenuList = commonService.actionMenuInData(commonVO.getUser_type());
		resultMap.put("topMenuList",topMenuList);
		resultMap.put("inMenuList",inMenuList);
		resultMap.put("commonVO",commonVO);
		System.out.println(resultMap);
//		resultVO.setResult(resultMap);
//		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
//		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultMap;
	}
	
	/**
	 * 기관정보 환경설정
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/set/SetOrgan.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO setOrgan(@RequestBody OrganInfoVO organVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		
		String user_type = (String)EgovSessionCookieUtil.getSessionAttribute(request, "user_type");
		
		// 권한 설정 ?
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<OrganInfoVO> organList = divasSetService.setOrgan(organVO);
		resultMap.put("organList", organList);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}

	/**
	 * 행정구역 조회
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/set/getAreaInfo.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO getAreaInfo(@RequestBody AreaInfoVO areaVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<AreaInfoVO> resultList = divasSetService.getAreaInfo(areaVO);
		
		resultMap.put("areaList", resultList);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}

	/**
	 * 기관정보 변경
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/set/actionChangeOrgan.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO actionChangeOrgan(@RequestBody OrganInfoVO organVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		
		String user_type = (String)EgovSessionCookieUtil.getSessionAttribute(request, "user_type");
		
		// 권한 설정 ?

		divasSetService.actionChangeOrgan(organVO);
		
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * 사용자 환경설정
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/set/SetUser.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO setUser(@RequestBody UserInfoVO userVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		
		String organ_id = (String)EgovSessionCookieUtil.getSessionAttribute(request, "organ_id");
		String userId = (String)EgovSessionCookieUtil.getSessionAttribute(request, "user_id");
		String user_type = (String)EgovSessionCookieUtil.getSessionAttribute(request, "user_type");
		String is_rtu_id = (String)EgovSessionCookieUtil.getSessionAttribute(request, "is_rtu_id");
		int vhf_use = (int)EgovSessionCookieUtil.getSessionAttribute(request, "vhf_use");
		
		CommonVO commonVO = new CommonVO();
		commonVO.setOrgan_id(organ_id);
		commonVO.setUser_type(user_type);
		commonVO.setIs_rtu_id(is_rtu_id);
		commonVO.setVhf_use(vhf_use);
		
		userVO.setOrgan_id(Integer.parseInt(organ_id)); // userInfoVO - commonVO 타입 맞춰주기
		userVO.setUser_id(userId);
		userVO.setUser_type(user_type.charAt(0)); // userInfoVO - commonVO 타입 맞춰주기
		
		OrganInfoVO organVO = new OrganInfoVO();
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<UserInfoVO> resultList = divasSetService.setUser(userVO);
		List<OrganInfoVO> organList = divasSetService.setOrgan(organVO);
		List<UserInfoVO> userRightList = divasSetService.setUserRight();

		resultMap.put("organList", organList);
		resultMap.put("userList", resultList);
		resultMap.put("userRightList", userRightList);
		
		// 방송장비 리스트 가져옴
		List<RtuVO> resultGroupList = abrService.actionBroadcastRtuGroupList(commonVO);
		resultMap.put("broadcastRtuGroupList", resultGroupList);
		List<RtuVO> resultRtuList = abrService.actionBroadcastRtuList(commonVO);
		resultMap.put("broadcastRtuList", resultRtuList);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * 사용자 Id 중복체크
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/set/actionIdCheck.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO actionIdCheck(@RequestBody UserInfoVO userVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		Boolean result = divasSetService.actionIdCheck(userVO);
		
		resultMap.put("idCheckResult", result);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * 사용자 정보변경
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/set/actionChangeUser.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO actionChangeUser(@RequestBody UserInfoVO userVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		
		divasSetService.actionChangeUser(userVO);
		
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * 장비설정 화면조회
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/set/SetEquip.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO setEquip(@RequestBody RtuVO rtuVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		
		String sort_base = (String)EgovSessionCookieUtil.getSessionAttribute(request, "sort_base");
		System.out.println("sort_base : " + sort_base);
		rtuVO.setSort_flag(Integer.parseInt(sort_base));
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<RtuVO> rtuList = divasSetService.setRtuList(rtuVO);
		resultMap.put("rtuList", rtuList);
		
		OrganInfoVO organVO = new OrganInfoVO();
		List<OrganInfoVO> organList = divasSetService.setOrgan(organVO);
		resultMap.put("organList", organList);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	
}