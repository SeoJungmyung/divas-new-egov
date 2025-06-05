package egovframework.divas.dtm.web;

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
import egovframework.divas.com.service.AWSVO;
import egovframework.divas.com.service.DivasCommonService;
import egovframework.divas.com.service.FlowVO;
import egovframework.divas.com.service.RainVO;
import egovframework.divas.com.service.RtuVO;
import egovframework.divas.com.service.SearchVO;
import egovframework.divas.com.service.SnowVO;
import egovframework.divas.dtm.service.DivasDtmService;

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
public class DivasDtmAPIController {

	@Resource(name = "DivasDtmService")
	private DivasDtmService divasDtmService;

	/** EgovMessageSource */
	@Resource(name = "egovMessageSource")
	EgovMessageSource egovMessageSource;

	/** EgovPropertyService */
	@Resource(name = "propertiesService")
	protected EgovPropertyService propertiesService;
	
	@Resource(name = "loginService")
	private DivasCommonService commonService;

	/** TRACE */
	@Resource(name = "leaveaTrace")
	LeaveaTrace leaveaTrace;
	
	/**
	 * 강우 자료.
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/dtm/actionDtmRain.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO actionDtmRain(@RequestBody RtuVO rtuVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		
		rtuVO.setArea_code("");
		rtuVO.setMaintype(0);
//		String sort_base = searchVO.getSort_base();
		
//		if(sort_base.equals("0")) {
			rtuVO.setSort("A.SORT_FLAG");	
//		}else if(sort_base.equals("1")) {
//			rtuVO.setSort("AREA_CODE");			
//		}else if(sort_base.equals("2")){
//			rtuVO.setSort("RTU_NAME");			
//		}
		
		// 강우 센서타입
		rtuVO.setW_sensertype("0");
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		Map<String, List<?>> resultList = divasDtmService.actionDtmRain(rtuVO);
		
		List<RtuVO> rtuList = commonService.getRtuInfo(rtuVO);
		
		resultMap.put("resultRtu", rtuList);
		resultList.remove("rtuList");
		resultMap.put("resultRain", resultList);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * 강우 자료수정 - 10분자료
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/dtm/getRain10m.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO getRain10m(@RequestBody RtuVO rtuVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<RainVO> resultList = divasDtmService.getRain10m(rtuVO);
		
		resultMap.put("resultList", resultList);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * 강우 자료수정
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/dtm/rainDataEdit.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO rainDataEdit(@RequestBody RtuVO rtuVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		
		divasDtmService.rainDataEdit(rtuVO);
		
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * 수위 자료.
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/dtm/actionDtmFlow.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO actionDtmFlow(@RequestBody RtuVO rtuVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		
		rtuVO.setArea_code("");
		rtuVO.setMaintype(0);
		
//		if(sort_base = 0) {
		rtuVO.setSort("A.SORT_FLAG");	
//		}else if(sort_base = 1) {
//			rtuVO.setSort("AREA_CODE");			
//		}else if(sort_base = 2){
//			rtuVO.setSort("RTU_NAME");			
//		}
		
		// 수위 센서타입
		rtuVO.setW_sensertype("1");
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		Map<String, List<?>> resultList = divasDtmService.actionDtmFlow(rtuVO);

		List<RtuVO> rtuList = commonService.getRtuInfo(rtuVO);
		
		resultMap.put("resultRtu", rtuList);
		resultList.remove("rtuList");
		resultMap.put("resultFlow", resultList);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * 수위 자료수정 - 10분자료
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/dtm/getFlow10m.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO getFlow10m(@RequestBody RtuVO rtuVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<FlowVO> resultList = divasDtmService.getFlow10m(rtuVO);
		
		resultMap.put("resultList", resultList);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * 수위 자료수정
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/dtm/setFlowData.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO setFlowData(@RequestBody RtuVO rtuVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		
		divasDtmService.setFlowData(rtuVO);
		
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * 적설 자료.
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/dtm/actionDtmSnow.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO actionDtmSnow(@RequestBody RtuVO rtuVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		
		rtuVO.setArea_code("");
		rtuVO.setMaintype(0);
		
		rtuVO.setSort("A.SORT_FLAG");	
		
		rtuVO.setW_sensertype("2");
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		Map<String, List<?>> resultList = divasDtmService.actionDtmSnow(rtuVO);

		List<RtuVO> rtuList = commonService.getRtuInfo(rtuVO);
		
		resultMap.put("resultRtu", rtuList);
		resultList.remove("rtuList");
		resultMap.put("resultSnow", resultList);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * 적설 자료수정 - 10분자료
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/dtm/getSnow10m.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO getSnow10m(@RequestBody RtuVO rtuVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<SnowVO> resultList = divasDtmService.getSnow10m(rtuVO);
		
		resultMap.put("resultList", resultList);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * 적설 자료수정
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/dtm/setSnowData.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO setSnowData(@RequestBody RtuVO rtuVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		
		divasDtmService.setSnowData(rtuVO);
		
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * AWS 자료.
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/dtm/actionDtmAWS.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO actionDtmAWS(@RequestBody RtuVO rtuVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		
		rtuVO.setArea_code("");
		rtuVO.setMaintype(0);
		
		rtuVO.setSort("A.SORT_FLAG");	
		
		rtuVO.setW_sensertype("3");
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		Map<String, List<?>> resultList = divasDtmService.actionDtmAWS(rtuVO);

		List<RtuVO> rtuList = commonService.getRtuInfo(rtuVO);
		
		resultMap.put("resultRtu", rtuList);
		resultList.remove("rtuList");
		resultMap.put("resultAWS", resultList);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * AWS 자료수정 - 10분자료
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/dtm/getAWS10m.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO getAWS10m(@RequestBody RtuVO rtuVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<AWSVO> resultList = divasDtmService.getAWS10m(rtuVO);
		
		resultMap.put("resultList", resultList);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * AWS 자료수정
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/dtm/setAWSData.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO setAWSData(@RequestBody RtuVO rtuVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		
		divasDtmService.setAWSData(rtuVO);
		
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	

	
}