package egovframework.divas.set.web;

import java.io.File;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import egovframework.com.cmm.EgovMessageSource;
import egovframework.com.cmm.LoginVO;
import egovframework.com.cmm.ResponseCode;
import egovframework.com.cmm.service.ResultVO;
import egovframework.com.cmm.web.EgovComUtlController;
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
	
	private static final Logger LOGGER = LoggerFactory.getLogger(EgovComUtlController.class);
	
	/**
	 * 시스템 설정 기관, 매뉴 조회
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/set/actionEnv.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody Map<String, Object> actionEnv(@RequestBody CommonVO commonVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		Map<String, Object> resultMap = new HashMap<String, Object>();
		OrganInfoVO organVO = new OrganInfoVO();
		
		// left menu 호출
		List<LeftMenuVO> topMenuList = commonService.actionMenuTopData(commonVO.getUser_type());
		List<LeftMenuVO> inMenuList = commonService.actionMenuInData(commonVO.getUser_type());
		
		List<OrganInfoVO> organList = divasSetService.setOrgan(organVO);
		resultMap.put("topMenuList",topMenuList);
		resultMap.put("inMenuList",inMenuList);
		resultMap.put("organList",organList);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultMap;
	}
	
	/**
	 * 시스템 설정 변경
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/set/saveEnv.do")
	public @ResponseBody ResultVO saveEnv(
	        @RequestPart(value = "file", required = false) MultipartFile file,
	        @RequestParam(value = "top_title", required = false) String topTitle,
	        @RequestParam(value = "vm_port", required = false) String vm_port,
	        @RequestParam(value = "dtm_menu_level", required = false) Integer dtmMenuLevel,
	        @RequestParam(value = "recaptcha", required = false) Integer recaptcha,
	        @RequestParam(value = "set_idx", required = false) Integer set_idx,
	        HttpServletRequest request) throws Exception {
	    
	    ResultVO resultVO = new ResultVO();
	    CommonVO commonVO = new CommonVO();
	    
	    try {
	        // 1. 파일 처리
	        if (file != null && !file.isEmpty()) {
	        	// 2. 파일 확장자 확인
	            String originalFilename = file.getOriginalFilename();
//	            System.out.println("originalFilename : " + originalFilename);
		        if (originalFilename == null || (!originalFilename.endsWith(".jpg") && !originalFilename.endsWith(".jpeg") && !originalFilename.endsWith(".png"))) {
		        	resultVO.setResultCode(400);
		    		resultVO.setResultMessage("사진 파일(.jpg, .jpeg 또는 .png)만 업로드 가능합니다.");
		            return resultVO;
		        }
		        
		        // 3. 파일 저장 경로 생성
		        String uploadPath = request.getSession().getServletContext().getRealPath("/") + "upload/images/";
		        File uploadDir = new File(uploadPath);
		        if (!uploadDir.exists()) {
		            uploadDir.mkdirs();
		        }
		        
		        // 4. 파일 저장 - EgovFileMngUtil 사용 수정
		        String storedFileName = "logo_" + System.currentTimeMillis() + "_" + originalFilename;
		        File destFile = new File(uploadPath + storedFileName);
		        file.transferTo(destFile);
		        // 이미지명 저장
		        commonVO.setTop_img(storedFileName);
	        }
	        
	        // 다른 설정값들 처리
//	        System.out.println("dtmMenuLevel: " + dtmMenuLevel);
//	        System.out.println("recaptcha: " + recaptcha);
	        
	        if(set_idx != 0 && set_idx != null) {
	        	// 설정값 저장 로직 추가
	        	commonVO.setSet_idx(set_idx);
	        	commonVO.setTop_title(topTitle);
	        	commonVO.setVm_port(vm_port);
	        	commonVO.setRecaptcha(recaptcha);
	        	
	        	divasSetService.setSetting(commonVO);
	        }
	        
	        if(dtmMenuLevel != null) {
	        	LeftMenuVO menuVO = new LeftMenuVO();
	        	menuVO.setMenu_level(dtmMenuLevel);
	        	menuVO.setMenu_idx(4); // 자료관리
	        	
	        	divasSetService.setMenuLevel(menuVO);
	        }
	        
	        resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
	        resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
	        
	    } catch (Exception e) {
	        LOGGER.error("설정 저장 오류: {}", e.getMessage(), e);
	        resultVO.setResultCode(500);
	        resultVO.setResultMessage("설정 저장 중 오류가 발생했습니다: " + e.getMessage());
	    }
	    
	    return resultVO;
	}
	
	/**
	 * 기관정보 환경설정
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/set/SetOrgan.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO setOrgan(@RequestBody OrganInfoVO organVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		
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
	public @ResponseBody ResultVO setUser(@RequestBody CommonVO commonVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		
		UserInfoVO userVO = new UserInfoVO();
		userVO.setOrgan_id(Integer.parseInt(commonVO.getOrgan_id())); // userInfoVO - commonVO 타입 맞춰주기
		userVO.setUser_id(commonVO.getUser_id());
		userVO.setUser_type(commonVO.getUser_type().charAt(0)); // userInfoVO - commonVO 타입 맞춰주기
		userVO.setSearch_sel(commonVO.getSearch_sel());
		userVO.setSearch_text(commonVO.getSearch_text());
		
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
	public @ResponseBody ResultVO setEquip(@RequestBody CommonVO commonVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		
		RtuVO rtuVO = new RtuVO();
//		String sort_base = (String)EgovSessionCookieUtil.getSessionAttribute(request, "sort_base");
		String sort_base = "0";
		rtuVO.setSort_flag(Integer.parseInt(sort_base));
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<RtuVO> rtuList = divasSetService.setRtuList(rtuVO);
		resultMap.put("rtuList", rtuList);
		
		List<RtuVO> lineList = divasSetService.getLineList(rtuVO);
		resultMap.put("lineList", lineList);
		List<RtuVO> modelList = divasSetService.getModelList(rtuVO);
		resultMap.put("modelList", modelList);
		
		OrganInfoVO organVO = new OrganInfoVO();
		List<OrganInfoVO> organList = divasSetService.setOrgan(organVO);
		resultMap.put("organList", organList);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}

	/**
	 * 장비 행정코드 중복체크
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/set/actionAreaCodeCheck.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO actionAreaCodeCheck(@RequestBody RtuVO rtuVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		Boolean result = divasSetService.actionAreaCodeCheck(rtuVO);
		
		resultMap.put("checkResult", result);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * 장비 정보변경
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/set/actionChangeEquip.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO actionChangeEquip(@RequestBody RtuVO rtuVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		
		divasSetService.actionChangeEquip(rtuVO);
		
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * 장비 센서 정보조회
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/set/getSensorInfo.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO getSensorInfo(@RequestBody RtuVO rtuVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<RtuVO> rtuList = divasSetService.getSensorInfo(rtuVO);
		resultMap.put("result", rtuList);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * 장비 센서 정보변경
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/set/saveSensorInfo.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO saveSensorInfo(@RequestBody RtuVO rtuVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		divasSetService.saveSensorInfo(rtuVO);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
}