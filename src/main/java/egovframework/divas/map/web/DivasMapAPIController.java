package egovframework.divas.map.web;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.egovframe.rte.fdl.cmmn.trace.LeaveaTrace;
import org.egovframe.rte.fdl.property.EgovPropertyService;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;

import egovframework.com.cmm.EgovMessageSource;
import egovframework.com.cmm.ResponseCode;
import egovframework.com.cmm.service.ResultVO;
import egovframework.com.cmm.web.EgovComUtlController;
import egovframework.divas.map.service.DivasMapService;
import egovframework.divas.map.service.MapRainDataVO;
import egovframework.divas.map.service.MapRtuSensorVO;
import egovframework.divas.map.service.MapRtuVO;
import egovframework.divas.map.service.MapinfoVO;
import egovframework.divas.map.service.MapsettingVO;
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
public class DivasMapAPIController {

	@Resource(name = "DivasMapService")
	private DivasMapService divasMapService;

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
	@RequestMapping(value = "/divas/Map/MapLoad.do")
	public @ResponseBody ResultVO MapLoad(HttpServletRequest request) throws Exception {
//		System.out.println("==========MapRain()!========");
		ResultVO resultVO = new ResultVO();
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		MapsettingVO Map_setting = new MapsettingVO();
		Map_setting = divasMapService.actionMapLoad();
		Map_setting.getSig_cd();
		
		List<MapinfoVO> Map_Info = new ArrayList<MapinfoVO>();
		Map_Info = divasMapService.actionMapInfo();
		
		List<String> SIG_CD_ARRAY = new ArrayList<String>();
		
		for(MapinfoVO MVO : Map_Info) {
			SIG_CD_ARRAY.add(MVO.getSig_cd()+"");
		}
		Set<String> set = new HashSet<String>(SIG_CD_ARRAY);
		List<String> SIG_CD_RESULT = new ArrayList<String>(set);
		
		System.out.println("@@@@여기");
		System.out.println(SIG_CD_RESULT);
		
		Map<String, Object> Sig_Map = new HashMap<String, Object>();
		Map<String, Object> Emd_Map = new HashMap<String, Object>();
		// SIG CD GEOJSON 으로 변환해서 보내는 구간 
		JSONParser parser = new JSONParser();
		for(String SIG_CD_INFO : SIG_CD_RESULT) {
			System.out.println("::::::확인");
			System.out.println(SIG_CD_INFO);
			File sig_path = new File("src/main/resources/geojson/41/"+SIG_CD_INFO+"_sig.geojson");
			File emd_path = new File("src/main/resources/geojson/41/"+SIG_CD_INFO+".geojson");
			if(sig_path.exists()){ // 파일이 존재하지 않으면 
				try {
					FileReader reader = new FileReader(sig_path);
					FileReader reader2 = new FileReader(emd_path);
					
					Object obj = parser.parse(reader);
					Object obj2 = parser.parse(reader2);
					
					JSONObject jsonObject = (JSONObject) obj;
					JSONObject jsonObject2 = (JSONObject) obj2;
					
					reader.close();
					reader2.close();
					
					System.out.print("■ JSON 타입 완료");
					System.out.print(jsonObject);
					System.out.print(jsonObject2);
					
					Sig_Map.put(SIG_CD_INFO, jsonObject);
					Emd_Map.put(SIG_CD_INFO, jsonObject2);
					resultMap.put("SIG_CD", Sig_Map); // sig_info에 SIG 지도 데이터 넣음
					resultMap.put("EMD_CD", Emd_Map); // sig_info에 SIG 지도 데이터 넣음
					
				} catch (IOException e) {
					e.printStackTrace();
					System.out.print("■ JSON 타입 실패");
				}
			}else {
				System.out.print("■ 파일없음");
			}
		}
			
		
		List<MapRtuVO> Map_Rtu = new ArrayList<MapRtuVO>();
		Map_Rtu = divasMapService.actionMapRtu();
		
		List<MapRtuSensorVO> Map_RtuSensor = new ArrayList<MapRtuSensorVO>();
		Map_RtuSensor = divasMapService.actionMapRtuSensor();
		
		resultMap.put("map_setting", Map_setting);
		resultMap.put("map_info", Map_Info);
		resultMap.put("map_rtu", Map_Rtu);
		resultMap.put("map_rtusensor", Map_RtuSensor);
		resultMap.put("SIG_CD_ARRAY", SIG_CD_RESULT);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
//	@RequestMapping(value = "/divas/Map/RainData.do")
//	public @ResponseBody ResultVO RainData(HttpServletRequest request) throws Exception {
	@RequestMapping(value = "/divas/Map/RainData.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO RainData(@RequestBody MapRainDataVO MapRainDataVO, HttpServletRequest request) throws Exception {
	ResultVO resultVO = new ResultVO();
	
		
		Map<String, Object> resultMap = new HashMap<String, Object>();

		List<MapRainDataVO> Map_RainData = new ArrayList<MapRainDataVO>();
		Map_RainData = divasMapService.actionRainData(MapRainDataVO);
		
		System.out.println(Map_RainData);
		System.out.println("@레인쿼리@");
		
		resultMap.put("map_raindata", Map_RainData);
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	@RequestMapping(value = "/divas/Map/OverLevelUpdate.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO UpdateOverLevel(@RequestBody MapsettingVO mapSettingVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		
		// update 결과 여부 -> code 변경?
		divasMapService.setOverLevel(mapSettingVO);
		
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	@RequestMapping(value = "/divas/Map/RtuMoveCheckUrl.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO RtuMoveCheckUrl(@RequestBody MapsettingVO mapSettingVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		
		// update 결과 여부 -> code 변경?
		divasMapService.setMapMove(mapSettingVO);
		
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	@RequestMapping(value = "/divas/Map/CenterZoomSave.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO CenterZoomSave(@RequestBody MapsettingVO mapSettingVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		
		// update 결과 여부 -> code 변경?
		divasMapService.setCenterZoomSave(mapSettingVO);
		
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	@RequestMapping(value = "/divas/Map/TopTextSave.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO TopTextSave(@RequestBody MapsettingVO mapSettingVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		
		// update 결과 여부 -> code 변경?
		divasMapService.setTopTextSave(mapSettingVO);
		
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	@RequestMapping(value = "/divas/Map/radar.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO callApiWithJson() {
        ResultVO resultVO = new ResultVO();
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
        LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
		String formatedNow = now.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String key = "NdQ4g%2B%2B7DldAW7gcYCYyafS85Jh0wXEqRuS4QYTbJCUlfoUyRSbFMJ3gn7w3TQGckHfkiRgp%2BYDYxaxLCuPn0Q%3D%3D";
        String date = formatedNow;
        try {
            resultMap.put("radar", getRadarImg(date, key));
            resultMap.put("heroes", getHeroesImg(date, key));
            
            resultVO.setResult(resultMap);
            resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
            resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
            
        } catch (Exception e) {
            e.printStackTrace();
            resultVO.setResultCode(ResponseCode.SAVE_ERROR.getCode());
            resultVO.setResultMessage(e.getMessage());
        }
        return resultVO;
    }
	
	// 레이더 이미지
	public String getRadarImg(String date, String key) {
		String radarImg = null;
		try {
            String apiUrl = "http://apis.data.go.kr/1360000/RadarImgInfoService/getCmpImg?data=CMP_WRC&time=" 
            		+ date +
                    "&ServiceKey=" + key;
//            System.out.println(apiUrl);
            
            DocumentBuilderFactory dbFactoty = DocumentBuilderFactory.newInstance();
			DocumentBuilder dBuilder = dbFactoty.newDocumentBuilder();
			Document doc = dBuilder.parse(apiUrl);
			
			// 제일 첫번째 태그
			doc.getDocumentElement().normalize();
			
			// 파싱할 tag
			NodeList nList = doc.getElementsByTagName("rdr-img-file");
            
//            System.out.println(" 호출결과 ==!");
//            for(int temp = 0; temp < nList.getLength(); temp++){
//            	System.out.println("인덱스 : " + temp);
//            	System.out.println("그냥 포문 결과 : "+nList.item(temp).getTextContent());
//            }
//            System.out.println(nList.item(nList.getLength()-1).getTextContent());
            radarImg = nList.item(nList.getLength()-1).getTextContent();
            
        } catch (Exception e) {
        	radarImg = e.getMessage();
            e.printStackTrace();
        }
        return radarImg;
	}
	
	// 위성 이미지
	public String getHeroesImg(String date, String key) {
		String satImg = null;
		try {
			String apiUrl = "http://apis.data.go.kr/1360000/SatlitImgInfoService/getInsightSatlit?sat=G2&data=ir105&area=ko&time=" 
					+ date +
					"&ServiceKey=" + key;
//			System.out.println(apiUrl);
			
			DocumentBuilderFactory dbFactoty = DocumentBuilderFactory.newInstance();
			DocumentBuilder dBuilder = dbFactoty.newDocumentBuilder();
			Document doc = dBuilder.parse(apiUrl);
			
			// 제일 첫번째 태그
			doc.getDocumentElement().normalize();
			
			// 파싱할 tag
			NodeList nList = doc.getElementsByTagName("satImgC-file");
			
//			System.out.println(nList.item(nList.getLength()-1).getTextContent());
			satImg = nList.item(nList.getLength()-1).getTextContent();
			
		} catch (Exception e) {
			satImg = e.getMessage();
			e.printStackTrace();
		}
		return satImg;
	}
	
}