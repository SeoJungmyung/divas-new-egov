package egovframework.divas.tms.web;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.egovframe.rte.fdl.cmmn.trace.LeaveaTrace;
import org.egovframe.rte.fdl.property.EgovPropertyService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import egovframework.com.cmm.EgovMessageSource;
import egovframework.com.cmm.ResponseCode;
import egovframework.com.cmm.service.ResultVO;
import egovframework.com.cmm.web.EgovComUtlController;
import egovframework.com.utl.cas.service.EgovSessionCookieUtil;
import egovframework.divas.com.service.RtuVO;
import egovframework.divas.tms.service.DivasTmsService;
import egovframework.divas.tms.service.RainVO;

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
	@RequestMapping(value = "/divas/tms/tmsRain.do")
	public @ResponseBody ResultVO tmsRain(HttpServletRequest request) throws Exception {
//		System.out.println("==========tmsRain()!========");
		ResultVO resultVO = new ResultVO();
		
//		String userId = (String)EgovSessionCookieUtil.getSessionAttribute(request, "user_id");
		int levelCnt = (Integer)EgovSessionCookieUtil.getSessionAttribute(request, "level_cnt");
		String organId = (String)EgovSessionCookieUtil.getSessionAttribute(request, "organ_id");
		
		RtuVO rtuVO = new RtuVO();
		
		rtuVO.setLevel_cnt(levelCnt);
		rtuVO.setOrganId(organId);
		rtuVO.setAreaCode("");
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
}