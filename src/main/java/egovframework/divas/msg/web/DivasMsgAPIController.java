package egovframework.divas.msg.web;

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
import egovframework.divas.com.service.CommonVO;
import egovframework.divas.com.service.SearchVO;
import egovframework.divas.msg.service.DivasMsgService;
import egovframework.divas.msg.service.MessageVO;

/**
 * 문자경보 매뉴의 비즈니스 구현 클래스
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
public class DivasMsgAPIController {
	
	/** EgovLoginService */
	@Resource(name = "DivasMsgService")
	private DivasMsgService msgService;

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
	 * 문자전송 화면
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/msg/actionMsgSend.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO actionMsgSend(@RequestBody SearchVO searchVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		//문자 수신자 그룹 리스트
		List<MessageVO> recGroupList = msgService.getSmsGroup(searchVO);
		resultMap.put("receiverGroupList", recGroupList);
		
		//문자 수신자 리스트
		List<MessageVO> receiverList = msgService.getSmsUser(searchVO);
		resultMap.put("receiverList", receiverList);
		
		//문자 관련 장비 리스트
		List<MessageVO> equipList = msgService.getSmsEquipment(searchVO);
		resultMap.put("equipList", equipList);
		
		//자동 발송설정 장비 리스트
		List<MessageVO> rtuList = msgService.getSmsRtuEquipment(searchVO);
		resultMap.put("rtuList", rtuList);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * 문자전송
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/msg/msgSend.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO msgSend(@RequestBody MessageVO msgVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
//		String organ_id = (String)EgovSessionCookieUtil.getSessionAttribute(request, "organ_id");
//		String user_id = (String)EgovSessionCookieUtil.getSessionAttribute(request, "user_id");
		
		//크로샷 문자 전송
		msgService.setSendXro(msgVO);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}

	/**
	 * 문자전송내역 화면
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/msg/actionMsgHist.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO actionMsgHist(@RequestBody SearchVO searchVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		List<MessageVO> msgHistList = msgService.getMsgHist(searchVO);
		resultMap.put("msgHistList", msgHistList);
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * 문자전송내역 상세화면
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/msg/actionMsgHistDetail.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO actionMsgHistDetail(@RequestBody SearchVO searchVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		List<MessageVO> msgHistDetail = msgService.getMsgHistDetail(searchVO);
		resultMap.put("msgHistDetail", msgHistDetail);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * 수신자설정 화면
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/msg/actionMsgReceiverSet.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO actionMsgReceiverSet(@RequestBody SearchVO searchVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		//문자 수신자 그룹 리스트
		List<MessageVO> recGroupList = msgService.getSmsGroup(searchVO);
		resultMap.put("receiverGroupList", recGroupList);
		
		//문자 수신자 리스트
		List<MessageVO> receiverList = msgService.getSmsUser(searchVO);
		resultMap.put("receiverList", receiverList);
		
		//문자 관련 장비 리스트
		List<MessageVO> equipList = msgService.getSmsEquipment(searchVO);
		resultMap.put("equipList", equipList);
		
		//자동 발송설정 장비 리스트
		List<MessageVO> rtuList = msgService.getSmsRtuEquipment(searchVO);
		resultMap.put("rtuList", rtuList);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * 수신자설정 자동발송 설정목록
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/msg/actionAutoMsgRtuList.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO actionAutoMsgRtuList(@RequestBody MessageVO msgVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		Map<String, Object> resultMap = new HashMap<String, Object>();
//		System.out.println("자동발송 !!!!");
//		System.out.println(msgVO);
		//자동 발송 설정 리스트
		List<MessageVO> autoSetList = msgService.getSmsEquipView(msgVO);
		resultMap.put("autoSetList", autoSetList);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * 수신자설정 변경
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/msg/msgRecDataChange.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO msgRecDataChange(@RequestBody MessageVO msgVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		//문자 수신자 그룹 리스트
		msgService.setMsgRecDataChange(msgVO);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * 수신자 다중삭제
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/msg/msgRecBatchDelete.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO msgRecBatchDelete(@RequestBody MessageVO msgVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		//문자 수신자 그룹 리스트
		msgService.setRecBatchDelete(msgVO);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * 수신자 그룹설정 변경
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/msg/msgGroupDataChange.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO msgGroupDataChange(@RequestBody MessageVO msgVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		//문자 수신자 그룹 리스트
		msgService.setMsgGroupChange(msgVO);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	
}