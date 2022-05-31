package egovframework.divas.com.web;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.egovframe.rte.fdl.cmmn.trace.LeaveaTrace;
import org.egovframe.rte.fdl.property.EgovPropertyService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;

import egovframework.com.cmm.EgovMessageSource;
import egovframework.com.cmm.LoginVO;
import egovframework.com.cmm.ResponseCode;
import egovframework.com.cmm.service.ResultVO;
import egovframework.com.cmm.web.EgovComUtlController;
import egovframework.com.utl.cas.service.EgovSessionCookieUtil;
import egovframework.divas.com.service.CommonVO;
import egovframework.divas.com.service.DivasCommonService;
import egovframework.divas.com.service.LeftMenuVO;

/**
 * 일반 로그인을 처리하는 컨트롤러 클래스
 * @author 공통서비스 개발팀 박지욱
 * @since 2009.03.06
 * @version 1.0
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *  수정일      수정자      수정내용
 *  -------            --------        ---------------------------
 *  2009.03.06  박지욱     최초 생성
 *  2011.08.31  JJY            경량환경 템플릿 커스터마이징버전 생성
 *
 *  </pre>
 */
@Controller
public class DivasCommonAPIController {

	/** EgovLoginService */
	@Resource(name = "loginService")
	private DivasCommonService commonService;

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
	 * 현재 서버시간을 가져온다.
	 * @return result - 서버 시간
	 * @exception Exception
	 */
//	@Scheduled(fixedDelay = 1000) // spring boot 스캐줄
	@RequestMapping(value = "/divas/com/actionServerTime.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody HashMap<String, Long> actionCurrentTime() throws Exception {
		HashMap<String, Long> resultMap = new HashMap<String, Long>();
		// 서버시간 - 한국시간으로 설정
		LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
		Timestamp ts = Timestamp.valueOf(now);
//		String formatedNow = now.format(DateTimeFormatter.ofPattern("yyyy년 MM월 dd일 HH시 mm분 ss초"));
//		System.out.println(formatedNow);
		resultMap.put("now", ts.getTime());
		return resultMap;
	}
	
	/**
	 * 일반 로그인을 처리한다
	 * @param vo - 아이디, 비밀번호가 담긴 LoginVO
	 * @param request - 세션처리를 위한 HttpServletRequest
	 * @return result - 로그인결과(세션정보)
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/com/actionLoginAPI.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
//	@Consumes({"text/html;charset=UTF-8","application/json;charset=UTF-8"})
	public @ResponseBody HashMap<String, Object> actionLogin(@RequestBody LoginVO loginVO, HttpServletRequest request) throws Exception {
		HashMap<String,Object> resultMap = new HashMap<String,Object>();

		// 1. 일반 로그인 처리
		LoginVO loginResultVO = commonService.actionLogin(loginVO);

		boolean loginPolicyYn = true;

		if (loginResultVO != null && loginResultVO.getUser_id() != null && !loginResultVO.getUser_id().equals("") && loginPolicyYn) {

			
			request.getSession().setAttribute("LoginVO", loginResultVO);

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

			// 세션 정보 출력 (모든 세션 정보 표시)
			LOGGER.info("Session Infos : " + EgovSessionCookieUtil.getSessionValuesString(request));
			
			// left menu 호출
			List<LeftMenuVO> topMenuList = commonService.actionMenuTopData(commonVO.getUser_type());
			List<LeftMenuVO> inMenuList = commonService.actionMenuInData(commonVO.getUser_type());

			resultMap.put("topMenuList",topMenuList);
			resultMap.put("inMenuList",inMenuList);
			resultMap.put("resultVO",loginResultVO);
			resultMap.put("commonVO",commonVO);
			resultMap.put("serverNow", actionCurrentTime().get("now"));
			resultMap.put("resultCode", "200");
			resultMap.put("resultMessage", "성공 !!!");
		} else {
			resultMap.put("resultVO",loginResultVO);
			resultMap.put("resultCode", "300");
			resultMap.put("resultMessage", egovMessageSource.getMessage("fail.common.login"));
		}

		return resultMap;

	}

	/**
	 * 로그아웃한다.
	 * @return String
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/com/actionLogoutAPI.do")
	public @ResponseBody ResultVO actionLogoutJSON(HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();

		RequestContextHolder.getRequestAttributes().removeAttribute("LoginVO", RequestAttributes.SCOPE_SESSION);

		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());

		return resultVO;
	}
}