package egovframework.divas.sbd.web;

import java.awt.image.BufferedImage;
import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.sql.Blob;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.xml.bind.DatatypeConverter;

import org.egovframe.rte.fdl.cmmn.trace.LeaveaTrace;
import org.egovframe.rte.fdl.property.EgovPropertyService;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.util.Base64Utils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import egovframework.com.cmm.EgovMessageSource;
import egovframework.com.cmm.ResponseCode;
import egovframework.com.cmm.service.ResultVO;
import egovframework.com.utl.cas.service.EgovSessionCookieUtil;
import egovframework.divas.com.service.SearchVO;
import egovframework.divas.sbd.service.DivasSbdService;
import egovframework.divas.sbd.service.SignboardVO;

/**
 * 전광판을 조회하는 비즈니스 구현 클래스
 * @author 화진티엔아이 기술연구소 서정명
 * @since 2022.05.31
 * @version 1.0
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *  수정일      수정자      수정내용
 *  -------            --------        ---------------------------
 *  2022.05.31  서정명          최초 생성
 *
 *  </pre>
 */
@Controller
public class DivasSbdAPIController {

	@Resource(name = "DivasSbdService")
	private DivasSbdService divasSbdService;

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
	 * 전광판 현황
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/sbd/SbdInfo.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO SbdInfo(HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		SignboardVO sbdVO = new SignboardVO();
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<SignboardVO> resultList = divasSbdService.actionSbdInfo(sbdVO);
		
		resultMap.put("nowSbdInfo", resultList);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * 전광판 메세지 전송화면
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/sbd/SbdSend.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO SbdSend(HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		SignboardVO sbdVO = new SignboardVO();
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<SignboardVO> equipGroupList = divasSbdService.getSbdEquipGroupInfo();
		List<SignboardVO> equipList = divasSbdService.getSbdEquipInfo(sbdVO);
		List<SignboardVO> msgList = divasSbdService.getSbdMsgList();
		List<SignboardVO> optionsList = divasSbdService.getSbdOptionList();
		
		resultMap.put("equipGroupList", equipGroupList);
		resultMap.put("equipList", equipList);
		resultMap.put("optionsList", optionsList);
		resultMap.put("msgList", msgList);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * 전광판 메세지 전송
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/sbd/actionSbdSend.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO actionSbdSend(@RequestBody SignboardVO sbdVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		String userId = (String)EgovSessionCookieUtil.getSessionAttribute(request, "user_id");
		sbdVO.setUserid(userId);
		String userIp = getClientIp(request);	// 클라이언트 ip 주소
		sbdVO.setUserip(userIp);
		
		
		divasSbdService.actionSbdSend(sbdVO);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * 메세지설정 화면
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/sbd/SbdMsg.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO SbdMsg(HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<SignboardVO> msgList = divasSbdService.getSbdMsgList();
		List<SignboardVO> optionsList = divasSbdService.getSbdOptionList();
		
		resultMap.put("msgList", msgList);
		resultMap.put("optionsList", optionsList);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * 전광판 메세지 저장
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/sbd/actionChangeMsg.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO changeMsg(@RequestBody SignboardVO sbdVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		
		String userId = (String)EgovSessionCookieUtil.getSessionAttribute(request, "user_id");
		sbdVO.setUserid(userId);
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		if(!sbdVO.getChange_mode().equals("delete")) {
			
			LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
			String formatedNow = now.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
			
			String imgRoot = "src\\main\\resources\\file\\sbd\\"+formatedNow+".png";
			
			// 서버 이미지 저장
			boolean result = decodBase64(sbdVO.getSaveimgvalue(), imgRoot);
//			System.out.println("이미지 저장 경로 : " + imgRoot);
//			System.out.println("이미지 저장 결과 : " + result);
			resultMap.put("이미지 저장 경로 : ", imgRoot);
			resultMap.put("이미지 저장 결과 : ", result);
			
			// DATA URL을 바이트로 변환 실시
			byte[] resByte = dataToByte(sbdVO.getSaveimgvalue());
			sbdVO.setSaveimg(resByte);			
		}
		
        divasSbdService.actionChangeMsg(sbdVO);
        
        resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * 전광판 설정 화면
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/sbd/SbdSet.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO SbdSet(HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		SignboardVO sbdVO = new SignboardVO();
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<SignboardVO> signList = divasSbdService.getSignList();
		List<SignboardVO> optionsList = divasSbdService.getSbdOptionList();
		List<SignboardVO> equipGroupList = divasSbdService.getSbdEquipGroupInfo();
		List<SignboardVO> equipList = divasSbdService.getSbdEquipInfo(sbdVO);
		
		resultMap.put("signList", signList);
		resultMap.put("optionsList", optionsList);
		resultMap.put("equipGroupList", equipGroupList);
		resultMap.put("equipList", equipList);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}

	/**
	 * 전광판 설정 저장
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/sbd/actionChangeSbd.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO actionChangeSbd(@RequestBody SignboardVO sbdVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		
		String userId = (String)EgovSessionCookieUtil.getSessionAttribute(request, "user_id");
		sbdVO.setUserid(userId);
		String userIp = getClientIp(request);	// 클라이언트 ip 주소
		sbdVO.setUserip(userIp);
		
		divasSbdService.actionChangeSbd(sbdVO);

		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * 문자전광판 보고서
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/sbd/actionSbdRpt.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO actionSbdRpt(@RequestBody SignboardVO sbdVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		
		List<SignboardVO> equipList = divasSbdService.getSbdEquipInfo(sbdVO);
		List<SignboardVO> rptList = divasSbdService.actionSbdRpt(sbdVO);
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		resultMap.put("equipList", equipList);
		resultMap.put("rptList", rptList);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * 클라이언트 ip주소 가져오기
	 * @return ip
	 * @exception Exception
	 */
	public static String getClientIp(HttpServletRequest req) {
	    String ip = req.getHeader("X-Forwarded-For");
	    if (ip == null) ip = req.getRemoteAddr();
	    return ip;
	}

	/**
	 * bas64 -> 이미지로 저장
	 * @return result boolean 
	 * @exception Exception
	 */
	public static boolean decodBase64(String base64, String target){
		String data = base64.split(",")[1];
		byte[] imageBytes = DatatypeConverter.parseBase64Binary(data);
		
		try {
			BufferedImage bufImg = ImageIO.read(new ByteArrayInputStream(imageBytes));
			ImageIO.write(bufImg, "png", new File(target));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return false;
		}
		return true;
	}
	
	/**
	 * DATA URL -> 바이트 배열로 변환
	 * @return byte[] 
	 * @exception Exception
	 */
	public static byte[] dataToByte(String dataUrl){
		byte imageArray [] = null;
		final String BASE_64_PREFIX = "data:image/png;base64,";
		try {
			String base64Url = String.valueOf(dataUrl);
			if (base64Url.startsWith(BASE_64_PREFIX)){
				imageArray =  Base64.getDecoder().decode(base64Url.substring(BASE_64_PREFIX.length()));
				/*
				 * System.out.println("\n");
				 * System.out.println("=======================================");
				 * System.out.println("[DBApiController] : [saveImage]");
				 * System.out.println("[imageArray] : " + new String(imageArray));
				 * System.out.println("=======================================");
				 * System.out.println("\n");
				 */
			}
		}
		catch (Exception e){
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return imageArray;
	}
	
    // [blob 데이터를 바이트로 변환해주는 메소드]
	public static byte[] blobToBytes(Blob blob) {
        BufferedInputStream is = null;
        byte[] bytes = null;
        try {
            is = new BufferedInputStream(blob.getBinaryStream());
            bytes = new byte[(int) blob.length()];
            int len = bytes.length;
            int offset = 0;
            int read = 0;

            while (offset < len
                    && (read = is.read(bytes, offset, len - offset)) >= 0) {
                offset += read;
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return bytes;
    }

    // [byte를 base64로 인코딩 해주는 메소드]
	public static String byteToBase64(byte[] arr) {
        String result = "";
        try {
            result = Base64Utils.encodeToString(arr);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }
	
	
}