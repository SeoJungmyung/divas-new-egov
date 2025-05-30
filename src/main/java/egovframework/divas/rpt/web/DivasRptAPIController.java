package egovframework.divas.rpt.web;

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
import egovframework.com.cmm.ResponseCode;
import egovframework.com.cmm.service.ResultVO;
import egovframework.com.utl.cas.service.EgovSessionCookieUtil;
import egovframework.divas.com.service.BroadcastVO;
import egovframework.divas.com.service.DivasCommonService;
import egovframework.divas.com.service.RainVO;
import egovframework.divas.com.service.RtuVO;
import egovframework.divas.com.service.SearchVO;
import egovframework.divas.com.service.StatisticsVO;
import egovframework.divas.dtm.service.DivasDtmService;
import egovframework.divas.rpt.service.DivasRptService;
import egovframework.divas.tms.service.DivasTmsService;

/**
 * 각 보고서를 조회하는 비즈니스 구현 클래스
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
public class DivasRptAPIController {

	@Resource(name = "DivasRptService")
	private DivasRptService divasRptService;
	
	@Resource(name = "DivasTmsService")
	private DivasTmsService divasTmsService;
	
	@Resource(name = "DivasDtmService")
	private DivasDtmService divasDtmService;
	
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
	
	/**
	 * 경보방송 전송이력
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/rpt/actionRptAbr.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO actionRptAbr(@RequestBody SearchVO searchVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<BroadcastVO> resultList = divasTmsService.actionTmsBroadcast(searchVO);
		
		resultMap.put("broadcastList", resultList);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * 경보방송 전송이력 상세
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/rpt/rptAbrDetail.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO rptAbrDetail(@RequestBody SearchVO searchVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		BroadcastVO resultDetail = divasRptService.getBroadcastDetail(searchVO);
		
		List<BroadcastVO> resultList = divasRptService.getBroadcastState(searchVO);
		
		resultMap.put("broadcastDetail", resultDetail);
		resultMap.put("broadcastStateList", resultList);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * 방송통계 보고서 
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/rpt/actionRptStat.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO actionRptStat(@RequestBody SearchVO searchVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		List<StatisticsVO> statList = divasRptService.getBroadcastCnt(searchVO);
		
		resultMap.put("resultList", statList);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * 10분자료 보고서 
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/rpt/actionRpt10m.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO actionRpt10m(@RequestBody RtuVO rtuVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		// 항상 rtu는 전체목록을 가져오기 위해 tmpAreaCode에 담음
		String tmpAreaCode = rtuVO.getArea_code();
		rtuVO.setArea_code("");
		List<RtuVO> rtuList = commonService.getRtuInfo(rtuVO);
		
		if(tmpAreaCode == null || tmpAreaCode.equals("")) {
			rtuVO.setArea_code(rtuList.get(0).getArea_code());		
		}else {
			rtuVO.setArea_code(tmpAreaCode);
		}
		
		List<Map<String, String>> resultList = divasDtmService.getRptRain10m(rtuVO);			
		
		resultMap.put("rtuList", rtuList);
		resultMap.put("rainList", resultList);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * 강우 자료.
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/rpt/actionRptRain.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO actionRptRain(@RequestBody RtuVO rtuVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		
		int levelCnt = (Integer)EgovSessionCookieUtil.getSessionAttribute(request, "level_cnt");
		String organ_id = (String)EgovSessionCookieUtil.getSessionAttribute(request, "organ_id");
		
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
		Map<String, List<?>> resultList = divasDtmService.actionDtmRain(rtuVO);
		
		resultMap.put("resultRtu", resultList.get("rtuList"));
		resultList.remove("rtuList");
		resultMap.put("resultRain", resultList);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}

	/**
	 * 수위 자료.
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/rpt/actionRptFlow.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO actionRptFlow(@RequestBody RtuVO rtuVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		
		int levelCnt = (Integer)EgovSessionCookieUtil.getSessionAttribute(request, "level_cnt");
		String organ_id = (String)EgovSessionCookieUtil.getSessionAttribute(request, "organ_id");
		
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
		Map<String, List<?>> resultList = divasDtmService.actionDtmFlow(rtuVO);
		
		resultMap.put("resultRtu", resultList.get("rtuList"));
		resultList.remove("rtuList");
		resultMap.put("resultFlow", resultList);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}

	/**
	 * 적설 자료.
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/rpt/actionRptSnow.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO actionRptSnow(@RequestBody RtuVO rtuVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		
		int levelCnt = (Integer)EgovSessionCookieUtil.getSessionAttribute(request, "level_cnt");
		String organ_id = (String)EgovSessionCookieUtil.getSessionAttribute(request, "organ_id");
		
		rtuVO.setLevel_cnt(levelCnt);
		rtuVO.setOrgan_id(organ_id);
		rtuVO.setArea_code("");
		rtuVO.setMaintype(0);
		
		rtuVO.setSort("A.SORT_FLAG");	
		
		rtuVO.setW_sensertype("2");
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		Map<String, List<?>> resultList = divasDtmService.actionDtmSnow(rtuVO);
		
		resultMap.put("resultRtu", resultList.get("rtuList"));
		resultList.remove("rtuList");
		resultMap.put("resultSnow", resultList);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * AWS 자료.
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/rpt/actionRptAWS.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO actionRptAWS(@RequestBody RtuVO rtuVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		
		int levelCnt = (Integer)EgovSessionCookieUtil.getSessionAttribute(request, "level_cnt");
		String organ_id = (String)EgovSessionCookieUtil.getSessionAttribute(request, "organ_id");
		
		rtuVO.setLevel_cnt(levelCnt);
		rtuVO.setOrgan_id(organ_id);
		rtuVO.setArea_code("");
		rtuVO.setMaintype(0);
		
		rtuVO.setSort("A.SORT_FLAG");	
		
		rtuVO.setW_sensertype("3");
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		Map<String, List<?>> resultList = divasDtmService.actionDtmAWS(rtuVO);
		
		resultMap.put("resultRtu", resultList.get("rtuList"));
		resultList.remove("rtuList");
		resultMap.put("resultAWS", resultList);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	
}