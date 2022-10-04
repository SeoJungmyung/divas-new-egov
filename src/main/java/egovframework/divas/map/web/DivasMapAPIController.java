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
import org.springframework.scheduling.annotation.Scheduled;
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
import egovframework.divas.com.service.AWSVO;
import egovframework.divas.com.service.FlowVO;
import egovframework.divas.com.service.LeftMenuVO;
import egovframework.divas.com.service.RainVO;
import egovframework.divas.com.service.SnowVO;
import egovframework.divas.com.service.impl.DivasSchedulerService;
import egovframework.divas.com.web.DivasCommonAPIController;
import egovframework.divas.map.service.DivasMapService;
import egovframework.divas.map.service.MapRainDataVO;
import egovframework.divas.map.service.MapRtuSensorVO;
import egovframework.divas.map.service.MapRtuVO;
import egovframework.divas.map.service.MapinfoVO;
import egovframework.divas.map.service.MapsettingVO;
import egovframework.divas.map.service.RealtimeDataVO;
import egovframework.divas.tms.service.DivasTmsService;
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
	
	@Resource(name = "DivasTmsService")
	private DivasTmsService divasTmsService;
	
	@Resource(name = "schedulerService")
	private DivasSchedulerService schedulerService;

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

	private static Map<String, List<?>> CurrentDataMap = new HashMap<String, List<?>>();
	
	/**
	 * 현재 각 센서별 데이터를 가져온다.
	 * @return resultVO
	 * @exception Exception
	 */
	public void actionCurrentData() throws Exception {
		
		List<RainVO> rainList = new ArrayList<RainVO>();
		List<FlowVO> flowList = new ArrayList<FlowVO>();
		List<AWSVO> awsList = new ArrayList<AWSVO>();
		List<SnowVO> snowList = new ArrayList<SnowVO>();
		String awsSensorType = "ATWHRS";
		
		// realtime_data 조회
		List<RealtimeDataVO> resultList = divasMapService.actionCurrentData();
//		System.out.println(resultList);
		for(RealtimeDataVO rVO : resultList) {
			RainVO rainVO = new RainVO();
			FlowVO flowVO = new FlowVO();
			AWSVO awsVO = new AWSVO();
			SnowVO snowVO = new SnowVO();
			if(rVO.getSensor_type().equals("0")) {
				rainVO.setArea_code(rVO.getArea_code());
				rainVO.setRain(Double.valueOf(rVO.getRealdata()));
				rainVO.setRain_date(rVO.getRealtime());
				rainList.add(rainVO);
			}else if(rVO.getSensor_type().equals("1")) {
				flowVO.setArea_code(rVO.getArea_code());
				flowVO.setFlow(Double.valueOf(rVO.getRealdata()));
				flowVO.setFlow_date(rVO.getRealtime());
				flowList.add(flowVO);
			}else if(rVO.getSensor_type().equals("2")) {
				snowVO.setArea_code(rVO.getArea_code());
				snowVO.setSnow(Double.valueOf(rVO.getRealdata()));
				snowVO.setSnow_date(rVO.getRealtime());
				snowList.add(snowVO);
			}else if(awsSensorType.indexOf(rVO.getSensor_type()) != -1) {
				awsVO.setArea_code(rVO.getArea_code());
				awsVO.setAws_date(rVO.getRealtime());
				if(rVO.getSensor_type().equals("A")) {
					awsVO.setAtmo(Double.valueOf(rVO.getRealdata()));
					awsList.add(awsVO);
				}else if(rVO.getSensor_type().equals("T")) {
					awsVO.setTemp(Double.valueOf(rVO.getRealdata()));
					awsList.add(awsVO);
				}else if(rVO.getSensor_type().equals("W")) {
					awsVO.setWind_vel(Double.valueOf(rVO.getRealdata()));
					awsList.add(awsVO);
				}else if(rVO.getSensor_type().equals("H")) {
					awsVO.setHumi(Double.valueOf(rVO.getRealdata()));
					awsList.add(awsVO);
				}else if(rVO.getSensor_type().equals("R")) {
					awsVO.setRadi(Double.valueOf(rVO.getRealdata()));
					awsList.add(awsVO);
				}else if(rVO.getSensor_type().equals("S")) {
					awsVO.setSuns(Double.valueOf(rVO.getRealdata()));
					awsList.add(awsVO);
				}
			}
		}
		
		CurrentDataMap.put("rainList", rainList);
		CurrentDataMap.put("flowList", flowList);
		CurrentDataMap.put("awsList", awsList);
		CurrentDataMap.put("snowList", snowList);
		System.out.println("CurrentDataMap");
		System.out.println(CurrentDataMap);
	}
	
	public void stopSchedul() {
		schedulerService.remove();
	}
	
//	@Scheduled(fixedDelay = 10000) // spring boot 스캐줄
	public void startSchedul() throws Exception {
//		System.out.println("is login? ==");
//		System.out.println(DivasCommonAPIController.is_login);
		if(DivasCommonAPIController.is_login){
			this.actionCurrentData();			
		}else{
			return;
		}
	}
	
	/**
	 * 강우 현황.
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/Map/getRainData.do")
	public @ResponseBody ResultVO getRainData(HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		resultMap.put("rainList", CurrentDataMap.get("rainList"));
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * 수위 현황.
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/Map/getFlowData.do")
	public @ResponseBody ResultVO getFlowData(HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		resultMap.put("flowList", CurrentDataMap.get("flowList"));
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * 적설 현황.
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/Map/getSnowData.do")
	public @ResponseBody ResultVO getSnowData(HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		resultMap.put("snowList", CurrentDataMap.get("snowList"));
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * AWS 현황.
	 * @return ResultVO
	 * @exception Exception
	 */
	@RequestMapping(value = "/divas/Map/getAWSData.do")
	public @ResponseBody ResultVO getAWSData(HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		resultMap.put("awsList", CurrentDataMap.get("awsList"));
		
		resultVO.setResult(resultMap);
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	/**
	 * 지도 초기 로딩.
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
		
//		System.out.println("@@@@여기");
//		System.out.println(SIG_CD_RESULT);
		
		Map<String, Object> Sig_Map = new HashMap<String, Object>();
		Map<String, Object> Emd_Map = new HashMap<String, Object>();
		// SIG CD GEOJSON 으로 변환해서 보내는 구간 
		JSONParser parser = new JSONParser();
		for(String SIG_CD_INFO : SIG_CD_RESULT) {
//			System.out.println("::::::확인");
//			System.out.println(SIG_CD_INFO);
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
//					System.out.print(jsonObject);
//					System.out.print(jsonObject2);
					
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
//	@RequestMapping(value = "/divas/Map/RainData.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
//	public @ResponseBody ResultVO RainData(@RequestBody MapRainDataVO MapRainDataVO, HttpServletRequest request) throws Exception {
//	ResultVO resultVO = new ResultVO();
//	
//		
//		Map<String, Object> resultMap = new HashMap<String, Object>();
//
//		List<MapRainDataVO> Map_RainData = new ArrayList<MapRainDataVO>();
//		Map_RainData = divasMapService.actionRainData(MapRainDataVO);
//		
//		System.out.println(Map_RainData);
//		System.out.println("@레인쿼리@");
//		
//		resultMap.put("map_raindata", Map_RainData);
//		
//		resultVO.setResult(resultMap);
//		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
//		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
//		
//		return resultVO;
//	}
	
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
	
	@RequestMapping(value = "/divas/Map/rtukindchange.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO rtukindchange(@RequestBody MapsettingVO mapSettingVO, HttpServletRequest request) throws Exception {
		ResultVO resultVO = new ResultVO();
		
		// update 결과 여부 -> code 변경?
		divasMapService.setRtukindchange(mapSettingVO);
		
		resultVO.setResultCode(ResponseCode.SUCCESS.getCode());
		resultVO.setResultMessage(ResponseCode.SUCCESS.getMessage());
		
		return resultVO;
	}
	
	@RequestMapping(value = "/divas/Map/radar.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO callRadar() {
        ResultVO resultVO = new ResultVO();
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
        String key = "NdQ4g%2B%2B7DldAW7gcYCYyafS85Jh0wXEqRuS4QYTbJCUlfoUyRSbFMJ3gn7w3TQGckHfkiRgp%2BYDYxaxLCuPn0Q%3D%3D";
        try {
            resultMap.put("radar", getRadarImg(key));
            
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
	
	@RequestMapping(value = "/divas/Map/heroes.do", consumes = {MediaType.APPLICATION_JSON_VALUE , MediaType.TEXT_HTML_VALUE})
	public @ResponseBody ResultVO callHeroes() {
		ResultVO resultVO = new ResultVO();
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		String key = "NdQ4g%2B%2B7DldAW7gcYCYyafS85Jh0wXEqRuS4QYTbJCUlfoUyRSbFMJ3gn7w3TQGckHfkiRgp%2BYDYxaxLCuPn0Q%3D%3D";
		try {
			resultMap.put("heroes", getHeroesImg(key));
			
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
	public String getRadarImg(String key) {
		String radarImg = null;
		LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
		String formatedNow = now.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String date = formatedNow;
        
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
            
//            System.out.println(" 호출결과 nList.getLength() ==");
//            System.out.println(nList.getLength());
           
//            for(int temp = 0; temp < nList.getLength(); temp++){
//            	System.out.println("인덱스 : " + temp);
//            	System.out.println("그냥 포문 결과 : "+nList.item(temp).getTextContent());
//            }
			if(nList.getLength() < 1) {
				System.out.println("레이더이미지 갯수 0!!");
				System.out.println(apiUrl);
			}
//            System.out.println(nList.item(nList.getLength()-1).getTextContent());
            radarImg = nList.item(nList.getLength()-1).getTextContent();
            
        } catch (Exception e) {
        	try {
        		date = now.minusDays(1).format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        		String apiUrl = "http://apis.data.go.kr/1360000/RadarImgInfoService/getCmpImg?data=CMP_WRC&time=" 
                		+ date +
                        "&ServiceKey=" + key;
                
                DocumentBuilderFactory dbFactoty = DocumentBuilderFactory.newInstance();
    			DocumentBuilder dBuilder = dbFactoty.newDocumentBuilder();
    			Document doc = dBuilder.parse(apiUrl);
    			
    			// 제일 첫번째 태그
    			doc.getDocumentElement().normalize();
    			
    			// 파싱할 tag
    			NodeList nList = doc.getElementsByTagName("rdr-img-file");
    			
    			if(nList.getLength() < 1) {
    				radarImg = "noimg.png";
    			}else {
    				System.out.println("try catch2 [rad]: " + nList.item(nList.getLength()-1).getTextContent());
    				radarImg = nList.item(nList.getLength()-1).getTextContent();
    			}
                
        	}catch (Exception e2) {
        		radarImg = e2.getMessage();
        		e2.printStackTrace();
        	}
        }
        return radarImg;
	}
	
	// 위성 이미지
	public String getHeroesImg(String key) {
		String satImg = null;
		LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
		String formatedNow = now.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String date = formatedNow;
        
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
			
			if(nList.getLength() < 1) {
				System.out.println("위성이미지 갯수 0!!");
				System.out.println(apiUrl);
			}
//			System.out.println(nList.item(nList.getLength()-1).getTextContent());
			satImg = nList.item(nList.getLength()-1).getTextContent();
			
		} catch (Exception e) {
			try {
        		date = now.minusDays(1).format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        		String apiUrl = "http://apis.data.go.kr/1360000/RadarImgInfoService/getCmpImg?data=CMP_WRC&time=" 
                		+ date +
                        "&ServiceKey=" + key;
                
                DocumentBuilderFactory dbFactoty = DocumentBuilderFactory.newInstance();
    			DocumentBuilder dBuilder = dbFactoty.newDocumentBuilder();
    			Document doc = dBuilder.parse(apiUrl);
    			
    			// 제일 첫번째 태그
    			doc.getDocumentElement().normalize();
    			
    			// 파싱할 tag
    			NodeList nList = doc.getElementsByTagName("satImgC-file");
    			
    			if(nList.getLength() < 1) {
    				satImg = "noimg.png";
    			}else {
    				System.out.println("try catch2 [sat] : " + nList.item(nList.getLength()-1).getTextContent());
    				satImg = nList.item(nList.getLength()-1).getTextContent();
    			}
                
        	}catch (Exception e2) {
        		satImg = e2.getMessage();
        		e2.printStackTrace();
        	}
		}
		return satImg;
	}
	
}