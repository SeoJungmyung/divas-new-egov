package egovframework.divas.msg.web;

import java.io.File;
import java.io.FileInputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.ServletContext;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.ss.usermodel.*;
import org.egovframe.rte.fdl.cmmn.trace.LeaveaTrace;
import org.egovframe.rte.fdl.property.EgovPropertyService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import egovframework.com.cmm.EgovMessageSource;
import egovframework.com.cmm.ResponseCode;
import egovframework.com.cmm.service.EgovFileMngUtil;
import egovframework.com.cmm.service.ResultVO;
import egovframework.com.cmm.web.EgovComUtlController;
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

    @Resource(name = "EgovFileMngUtil")
    private EgovFileMngUtil fileUtil;
    
    /* 파일 경로 servletContext와 같이 다닐 것 */
    @Value("${Globals.fileStorePath}")
    private String configuredPath;
    
    @Resource
    private ServletContext servletContext;
	
    private static final Logger LOGGER = LoggerFactory.getLogger(EgovComUtlController.class);
    
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
	
	/**
     * 수신자 엑셀 샘플 파일 다운로드
     * @param response HTTP 응답 객체
     * @throws Exception 파일 다운로드 중 발생하는 예외
     */
	@RequestMapping(value = "/divas/msg/getSampleExcel.do", method = RequestMethod.GET)
	public void getSampleExcel(HttpServletResponse response) throws Exception {
	    try {
	    	String filePath;
	        
	        // 1. 환경설정 값이 있으면 사용
	        if (configuredPath != null && !configuredPath.isEmpty()) {
	            filePath = configuredPath + "/sms_people_sample.xls";
	        }
	        
	        // 2. 없으면 ServletContext 사용
	        else {
	            filePath = servletContext.getRealPath("/WEB-INF/sample/sms_people_sample.xls");
	        }
	        String originalFileName = "sms_people_sample.xls";
	        
	        // 파일 존재 여부 확인
	        File file = new File(filePath);
	        if (!file.exists() || !file.isFile()) {
	            LOGGER.error("Sample Excel file not found at: " + filePath);
	            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Sample Excel file not found");
	            return;
	        }

	        // 직접 파일 다운로드 처리
	        response.setContentType("application/vnd.ms-excel");
	        response.setHeader("Content-Disposition", "attachment; filename=\"" + originalFileName + "\"");
	        response.setHeader("Content-Transfer-Encoding", "binary");
	        response.setHeader("Pragma", "no-cache");
	        response.setHeader("Expires", "0");

	        try (FileInputStream fis = new FileInputStream(file);
	             ServletOutputStream os = response.getOutputStream()) {
	            
	            byte[] buffer = new byte[4096];
	            int bytesRead;
	            while ((bytesRead = fis.read(buffer)) != -1) {
	                os.write(buffer, 0, bytesRead);
	            }
	            os.flush();
	        }
	    } catch (Exception e) {
	        LOGGER.error("파일 다운로드 중 오류 발생", e);
	        response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "파일 다운로드 중 오류가 발생했습니다");
	    }
	}
	/**
	 * 수신자 엑셀 업로드로 일괄추가
	 * @param response HTTP 응답 객체
	 * @throws Exception 파일 다운로드 중 발생하는 예외
	 */
	@PostMapping("/divas/msg/importReceiversFromExcel.do")
	public @ResponseBody ResultVO importReceiversFromExcel(
	        @RequestPart(value ="file", required=false) MultipartFile file,
	        @RequestParam("organ_id") String organId,
	        @RequestParam("organ_code") String organCode,
	        HttpServletRequest request) {
	    
		ResultVO resultVO = new ResultVO();
		Map<String, Object> resultMap = new HashMap<String, Object>();
//	    System.out.println("File received: " + (file != null ? file.getOriginalFilename() : "null"));
	    
	    try {
	        // 1. 파일 유효성 검사
	        if (file == null || file.isEmpty()) {
	    		resultVO.setResultCode(400);
	    		resultVO.setResultMessage("업로드된 파일이 없습니다.");
	            return resultVO;
	        }
	        
	        // 2. 파일 확장자 확인
	        String originalFilename = file.getOriginalFilename();
	        if (originalFilename == null || (!originalFilename.endsWith(".xls") && !originalFilename.endsWith(".xlsx"))) {
	        	resultVO.setResultCode(400);
	    		resultVO.setResultMessage("엑셀 파일(.xls 또는 .xlsx)만 업로드 가능합니다.");
	            return resultVO;
	        }
	        
	        // 3. 파일 저장 경로 생성
	        String uploadPath = request.getSession().getServletContext().getRealPath("/") + "upload/excel/";
	        File uploadDir = new File(uploadPath);
	        if (!uploadDir.exists()) {
	            uploadDir.mkdirs();
	        }
	        
	        // 4. 파일 저장 - EgovFileMngUtil 사용 수정
	        String storedFileName = "MSG_" + System.currentTimeMillis() + "_" + originalFilename;
	        File destFile = new File(uploadPath + storedFileName);
	        file.transferTo(destFile);
	        
	        // 5. Apache POI로 엑셀 파일 처리
	        try (FileInputStream fis = new FileInputStream(destFile);
	             Workbook workbook = WorkbookFactory.create(fis)) {
	            Sheet sheet = workbook.getSheetAt(0);
	            
	            // 유효성 검사 - 기본 형식 확인
	            Row headerRow = sheet.getRow(0);
	            if (headerRow == null || 
	                headerRow.getPhysicalNumberOfCells() < 3 ||  
	                !getCellValueAsString(headerRow.getCell(1)).contains("이름") || 
	                !getCellValueAsString(headerRow.getCell(2)).contains("전화번호")) {

	            	resultVO.setResultCode(400);
		    		resultVO.setResultMessage("엑셀 파일 형식이 올바르지 않습니다. 샘플 파일을 참고해주세요.");
		            return resultVO;
	            }
	            
	            // 데이터 파싱 및 서비스 호출
	            List<MessageVO> receivers = msgService.parseExcelFile(workbook, organId, organCode);
	            
	            // 서비스를 통해 데이터베이스에 저장
	            int importCount = msgService.batchInsertReceivers(receivers);
	            System.out.println("importCount: " + importCount);
	            
	            // 응답 생성
	            resultMap.put("importCount", importCount);
	            resultVO.setResult(resultMap);
	            resultVO.setResultCode(200);
	    		resultVO.setResultMessage("엑셀 파일이 성공적으로 처리되었습니다.");
	            return resultVO;
	            
	        } catch (Exception e) {
		        LOGGER.error("POI 엑셀 처리 오류: {}", e.getMessage(), e);
		        resultVO.setResultCode(500);
	    		resultVO.setResultMessage("엑셀 데이터 처리 중 오류가 발생했습니다: " + e.getMessage());
	            return resultVO;
		    }
	        
	    } catch (Exception e) {
	        LOGGER.error("엑셀 처리 오류: {}", e.getMessage(), e);
	        resultVO.setResultCode(500);
    		resultVO.setResultMessage("엑셀 데이터 처리 중 오류가 발생했습니다: " + e.getMessage());
            return resultVO;
	    }
	}
	    
    // 셀 값을 문자열로 안전하게 추출하는 유틸리티 메서드
    private String getCellValueAsString(Cell cell) {
        if (cell == null) {
            return "";
        }
        
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                double value = cell.getNumericCellValue();
                if (value == Math.floor(value)) {
                    return String.format("%.0f", value);
                } else {
                    return String.valueOf(value);
                }
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                return cell.getCellFormula();
            default:
                return "";
        }
    }
	
}