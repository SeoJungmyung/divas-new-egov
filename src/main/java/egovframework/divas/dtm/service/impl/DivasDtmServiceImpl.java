package egovframework.divas.dtm.service.impl;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.time.*;

import javax.annotation.Resource;

import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;

import com.ibm.icu.util.Calendar;

import egovframework.divas.com.service.AWSVO;
import egovframework.divas.com.service.FlowVO;
import egovframework.divas.com.service.RainVO;
import egovframework.divas.com.service.RtuVO;
import egovframework.divas.com.service.SnowVO;
import egovframework.divas.com.service.impl.RtuInfoDAO;
import egovframework.divas.dtm.service.DivasDtmService;

/**
 * 각 보고서 화면을 구현하는 비즈니스 클래스
 * @author 서정명
 * @since 2022.04.10
 * @version 1.0
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      수정자          수정내용
 *  -------    --------    ---------------------------
 *  2022.04.10  서정명          최초 생성
 *
 *  </pre>
 */
@Service("DivasDtmService")
public class DivasDtmServiceImpl extends EgovAbstractServiceImpl implements DivasDtmService{
	
	@Resource(name = "RtuInfo")
	private RtuInfoDAO rtuInfo;

	@Resource(name = "dtmRainDAO")
	private DtmRainDAO dtmRainDAO;
	
	@Resource(name = "dtmFlowDAO")
	private DtmFlowDAO dtmFlowDAO;
	
	@Resource(name = "dtmAWSDAO")
	private DtmAWSDAO dtmAWSDAO;
	
	@Resource(name = "dtmSnowDAO")
	private DtmSnowDAO dtmSnowDAO;
	
	// date_type별 rtuVO 세팅
	private void updateTypeToSet(RtuVO rtuVO, String type, String mode) throws Exception {
	    String sdate = rtuVO.getSdate(); // 예: "2025-05-23"
	    String full_day = sdate.substring(0, 10); // 예: "05"
	    String whereDate = "";
	    String endDate = "";

	    switch(type) {
		    case "H": // 시간단위
		    	whereDate = full_day+" "+rtuVO.getHour()+":00:00";
		    	endDate = full_day+" "+rtuVO.getHour()+":59:00";
		    	break;
		    	
	        case "D": // 일단위
	            whereDate = full_day + " 00:00:00";
	            endDate = full_day + " 23:59:59";
	            break;

	        case "N": // 월단위
	            String year = sdate.substring(0, 4);
	            String month = sdate.substring(5, 7);
	            YearMonth yearMonth = YearMonth.of(Integer.parseInt(year), Integer.parseInt(month));
	            String lastDay = String.format("%02d", yearMonth.lengthOfMonth());

	            whereDate = year + "-" + month + "-01 00:00:00";
	            endDate = year + "-" + month + "-" + lastDay + " 23:59:59";
	            break;

	        case "Y": // 연단위
	            year = sdate.substring(0, 4);
	            whereDate = year + "-01-01 00:00:00";
	            endDate = year + "-12-31 23:59:59";
	            break;

	        default:
	            throw new IllegalArgumentException("지원하지 않는 타입입니다: " + type);
	    }

	    rtuVO.setType(type);
	    rtuVO.setWhere_date(whereDate);
	    rtuVO.setSdate(endDate);
	    
	    String forType = type.equals("H") ? "M" 
				: type.equals("D") ? "H" 
						: type.equals("N") ? "D"
								: type.equals("Y") ? "N" : "M";
	    
	    if(mode.equals("aws")) {
	    	updateAWSData(rtuVO, forType);
	    } else if(mode.equals("flow")) {
	    	updateFlowData(rtuVO, forType);
	    } else if(mode.equals("snow")) {
	    	updateSnowData(rtuVO, forType);
	    } else {
	    	updateRainData(rtuVO, forType);
	    }
	}
	
	// 강우 업데이트 함수
	private void updateRainData(RtuVO rtuVO, String forType) throws Exception {
		String tmp_type = rtuVO.getType();
		rtuVO.setType(forType);
		
		Double sumData = dtmRainDAO.getRainSum(rtuVO);
	    if (sumData == null) {
	        sumData = 0.0;
	    }
	    rtuVO.setRain(sumData);

	    rtuVO.setType(tmp_type);
	    int cnt = dtmRainDAO.searchRainData(rtuVO);
	    if(cnt != 0) {
	        dtmRainDAO.setRainUpdate(rtuVO);
	    } else {
	        dtmRainDAO.setRainInsert(rtuVO);
	    }
	}
	
	// 수위 업데이트 함수
	private void updateFlowData(RtuVO rtuVO, String forType) throws Exception {
		String tmp_type = rtuVO.getType();
		rtuVO.setType(forType);
		
		Double sumData = dtmFlowDAO.getFlowAvg(rtuVO);
		if (sumData == null) {
			sumData = 0.0;
		}
		rtuVO.setFlow(sumData);
		
		rtuVO.setType(tmp_type);
		int cnt = dtmFlowDAO.searchFlowData(rtuVO);
		if(cnt != 0) {
			dtmFlowDAO.setFlowUpdate(rtuVO);
		}else {
			dtmFlowDAO.setFlowInsert(rtuVO);
		}
	}
	
	// 적설 업데이트 함수
	private void updateSnowData(RtuVO rtuVO, String forType) throws Exception {
		String tmp_type = rtuVO.getType();
		rtuVO.setType(forType);
		
		Double sumData = dtmSnowDAO.getSnowMax(rtuVO);
		if (sumData == null) {
			sumData = 0.0;
		}
		rtuVO.setSnow(sumData);
		
		rtuVO.setType(tmp_type);
		int cnt = dtmSnowDAO.searchSnowData(rtuVO);
		if(cnt != 0) {
			dtmSnowDAO.setSnowUpdate(rtuVO);
		}else {
			dtmSnowDAO.setSnowInsert(rtuVO);
		}
	}
	
	// aws 업데이트 함수
	private void updateAWSData(RtuVO rtuVO, String forType) throws Exception {
		String tmp_type = rtuVO.getType();
		rtuVO.setType(forType);
		
		Double sumData = dtmAWSDAO.getAWSSum(rtuVO);
		if (sumData == null) {
			sumData = 0.0;
		}
		rtuVO.setRain(sumData);
		
		rtuVO.setType(tmp_type);
		int cnt = dtmAWSDAO.searchAWSData(rtuVO);
		if(cnt != 0) {
			dtmAWSDAO.setAWSUpdate(rtuVO);
		}else {
			dtmAWSDAO.setAWSInsert(rtuVO);
		}
	}
	
	
	@Override
	public Map<String, List<?>> actionDtmRain(RtuVO rtuVO) throws Exception {
		
		List<RtuVO> rtuList = rtuInfo.rtuList(rtuVO);
		Map<String, List<?>> result = new HashMap<String, List<?>>();	
		String whereDate = "";
		for(int i=0; i<=23; i++) {
			if(i != 0) whereDate += ",";
			if(i < 10) {
				whereDate += " '"+rtuVO.getSdate().substring(0, 10)+" 0"+i+":00:00'";
			}else {
				whereDate += " '"+rtuVO.getSdate().substring(0, 10)+" "+i+":00:00'";
			}
		}
//		System.out.println(whereDate);
		for (RtuVO CRtuVO : rtuList) {
			CRtuVO.setFormat("%k");
			CRtuVO.setType("H");
			CRtuVO.setWhere_date(whereDate);
			List<RainVO> reRain = dtmRainDAO.getRainRpt(CRtuVO);
			
			result.put(CRtuVO.getArea_code(), reRain);
		}
		result.put("rtuList", rtuList);
		return result;
	}

	@Override
	public List<RainVO> getRain10m(RtuVO rtuVO) throws Exception {
		String whereDate = "";
		for(int i=0; i<=5; i++) {
			if(i != 0) whereDate += ",";
			whereDate += " '"+rtuVO.getSdate().substring(0, 10)+" "+rtuVO.getHour()+":"+i+"0:00'";
		}
//		System.out.println(whereDate);
		rtuVO.setFormat("%i");
		rtuVO.setType("M");
		rtuVO.setWhere_date(whereDate);
		
		return dtmRainDAO.getRainRpt(rtuVO);
	}

	@Override
	public void rainDataEdit(RtuVO rtuVO) throws Exception {
		
		// 10분단위 데이터 변경
		rtuVO.setType("M");
		for(int i=0; i<=5; i++) {
			if(rtuVO.getDtmArr().get(i) != null) {
				// dtmArr -> rain 값 세팅
				rtuVO.setRain(rtuVO.getDtmArr().get(i)*100);
				
				String whereDate = rtuVO.getSdate()+" "+rtuVO.getHour()+":"+i+"0:00";
				rtuVO.setWhere_date(whereDate);
				// 해당 시간 row 여부 확인
				int cnt = dtmRainDAO.searchRainData(rtuVO);
				if(cnt != 0) {
					dtmRainDAO.setRainUpdate(rtuVO);
				}else {
					dtmRainDAO.setRainInsert(rtuVO);
				}				
			}
		}
		
		// H타입 업데이트
		updateTypeToSet(rtuVO, "H", "rain");
		// 일단위 데이터 변경
		updateTypeToSet(rtuVO, "D", "rain");
		// 월단위 데이터 변경
		updateTypeToSet(rtuVO, "N", "rain");
		// 연단위 데이터 변경
		updateTypeToSet(rtuVO, "Y", "rain");
	}

	
	@Override
	public Map<String, List<?>> actionDtmFlow(RtuVO rtuVO) throws Exception {

		List<RtuVO> rtuList = rtuInfo.rtuList(rtuVO);
		Map<String, List<?>> result = new HashMap<String, List<?>>();	
		String whereDate = "";
		for(int i=0; i<=23; i++) {
			if(i != 0) whereDate += ",";
			if(i < 10) {
				whereDate += " '"+rtuVO.getSdate().substring(0, 10)+" 0"+i+":00:00'";
			}else {
				whereDate += " '"+rtuVO.getSdate().substring(0, 10)+" "+i+":00:00'";
			}
		}
//		System.out.println(whereDate);
		for (RtuVO CRtuVO : rtuList) {
			CRtuVO.setFormat("%k");
			CRtuVO.setType("H");
			CRtuVO.setWhere_date(whereDate);
			List<FlowVO> reFlow = dtmFlowDAO.getFlowRpt(CRtuVO);
			
			result.put(CRtuVO.getArea_code(), reFlow);
		}
		result.put("rtuList", rtuList);
		return result;
	}

	@Override
	public List<FlowVO> getFlow10m(RtuVO rtuVO) throws Exception {
		
		String whereDate = "";
		for(int i=0; i<=5; i++) {
			if(i != 0) whereDate += ",";
			whereDate += " '"+rtuVO.getSdate().substring(0, 10)+" "+rtuVO.getHour()+":"+i+"0:00'";
		}
//		System.out.println(whereDate);
		rtuVO.setFormat("%i");
		rtuVO.setType("M");
		rtuVO.setWhere_date(whereDate);
		
		return dtmFlowDAO.getFlowRpt(rtuVO);
	}

	@Override
	public void setFlowData(RtuVO rtuVO) throws Exception {
		// 분단위 데이터 변경
		rtuVO.setType("M");
		for(int i=0; i<=5; i++) {
			if(rtuVO.getDtmArr().get(i) != null) {
				// dtmArr -> rain 값 세팅
				rtuVO.setFlow(rtuVO.getDtmArr().get(i)*100);
				
				String whereDate = rtuVO.getSdate()+" "+rtuVO.getHour()+":"+i+"0:00";
				rtuVO.setWhere_date(whereDate);
				// 해당 시간 row 여부 확인
				int cnt = dtmFlowDAO.searchFlowData(rtuVO);
				if(cnt != 0) {
					dtmFlowDAO.setFlowUpdate(rtuVO);
				}else {
					dtmFlowDAO.setFlowInsert(rtuVO);
				}				
			}
		}
		
		// H타입 업데이트
		updateTypeToSet(rtuVO, "H", "flow");
		// 일단위 데이터 변경
		updateTypeToSet(rtuVO, "D", "flow");
		// 월단위 데이터 변경
		updateTypeToSet(rtuVO, "N", "flow");
		// 연단위 데이터 변경
		updateTypeToSet(rtuVO, "Y", "flow");
	}

	@Override
	public Map<String, List<?>> actionDtmSnow(RtuVO rtuVO) throws Exception {
		
		List<RtuVO> rtuList = rtuInfo.rtuList(rtuVO);
		Map<String, List<?>> result = new HashMap<String, List<?>>();	
		String whereDate = "";
		for(int i=0; i<=23; i++) {
			if(i != 0) whereDate += ",";
			if(i < 10) {
				whereDate += " '"+rtuVO.getSdate().substring(0, 10)+" 0"+i+":00:00'";
			}else {
				whereDate += " '"+rtuVO.getSdate().substring(0, 10)+" "+i+":00:00'";
			}
		}
//		System.out.println(whereDate);
		for (RtuVO CRtuVO : rtuList) {
			CRtuVO.setFormat("%k");
			CRtuVO.setType("H");
			CRtuVO.setWhere_date(whereDate);
			List<SnowVO> reSnow = dtmSnowDAO.getSnowRpt(CRtuVO);
			
			result.put(CRtuVO.getArea_code(), reSnow);
		}
		result.put("rtuList", rtuList);
		return result;
	}

	@Override
	public List<SnowVO> getSnow10m(RtuVO rtuVO) throws Exception {
		String whereDate = "";
		for(int i=0; i<=5; i++) {
			if(i != 0) whereDate += ",";
			whereDate += " '"+rtuVO.getSdate().substring(0, 10)+" "+rtuVO.getHour()+":"+i+"0:00'";
		}
//		System.out.println(whereDate);
		rtuVO.setFormat("%i");
		rtuVO.setType("M");
		rtuVO.setWhere_date(whereDate);
		
		return dtmSnowDAO.getSnowRpt(rtuVO);
	}

	@Override
	public void setSnowData(RtuVO rtuVO) throws Exception {
		// 분단위 데이터 변경
		rtuVO.setType("M");
		for(int i=0; i<=5; i++) {
			if(rtuVO.getDtmArr().get(i) != null) {
				// dtmArr -> rain 값 세팅
				rtuVO.setSnow(rtuVO.getDtmArr().get(i)*1000);
				
				String whereDate = rtuVO.getSdate()+" "+rtuVO.getHour()+":"+i+"0:00";
				rtuVO.setWhere_date(whereDate);
				// 해당 시간 row 여부 확인
				int cnt = dtmSnowDAO.searchSnowData(rtuVO);
				if(cnt != 0) {
					dtmSnowDAO.setSnowUpdate(rtuVO);
				}else {
					dtmSnowDAO.setSnowInsert(rtuVO);
				}				
			}
		}
		
		// H타입 업데이트
		updateTypeToSet(rtuVO, "H", "snow");
		// 일단위 데이터 변경
		updateTypeToSet(rtuVO, "D", "snow");
		// 월단위 데이터 변경
		updateTypeToSet(rtuVO, "N", "snow");
		// 연단위 데이터 변경
		updateTypeToSet(rtuVO, "Y", "snow");
		
		
	}

	@Override
	public Map<String, List<?>> actionDtmAWS(RtuVO rtuVO) throws Exception {
		
		List<RtuVO> rtuList = rtuInfo.rtuList(rtuVO);
		Map<String, List<?>> result = new HashMap<String, List<?>>();	
		String whereDate = "";
		for(int i=0; i<=23; i++) {
			if(i != 0) whereDate += ",";
			if(i < 10) {
				whereDate += " '"+rtuVO.getSdate().substring(0, 10)+" 0"+i+":00:00'";
			}else {
				whereDate += " '"+rtuVO.getSdate().substring(0, 10)+" "+i+":00:00'";
			}
		}
//		System.out.println(whereDate);
		for (RtuVO CRtuVO : rtuList) {
			CRtuVO.setFormat("%k");
			CRtuVO.setType("H");
			CRtuVO.setWhere_date(whereDate);
			List<AWSVO> reAWS = dtmAWSDAO.getAWSRpt(CRtuVO);
			
			result.put(CRtuVO.getArea_code(), reAWS);
		}
		result.put("rtuList", rtuList);
		return result;
	}

	@Override
	public List<AWSVO> getAWS10m(RtuVO rtuVO) throws Exception {
		String whereDate = "";
		for(int i=0; i<=5; i++) {
			if(i != 0) whereDate += ",";
			whereDate += " '"+rtuVO.getSdate().substring(0, 10)+" "+rtuVO.getHour()+":"+i+"0:00'";
		}
		
		rtuVO.setFormat("%i");
		rtuVO.setType("M");
		rtuVO.setWhere_date(whereDate);
		int sensor_type = rtuVO.getSensor_type(); 
		
		List<AWSVO> resultList = new ArrayList<AWSVO>();
		if(sensor_type == 1) resultList = dtmAWSDAO.getRainRpt(rtuVO);
		else if(sensor_type == 2) resultList = dtmAWSDAO.getTempRpt(rtuVO);
//		else if(sensor_type.equals("A")) resultList = dtmAWSDAO.getAtmoRpt(rtuVO);
		else if(sensor_type == 5) resultList = dtmAWSDAO.getHumiRpt(rtuVO);
		else if(sensor_type == 3 || sensor_type == 4) resultList = dtmAWSDAO.getWindRpt(rtuVO);
//		else if(sensor_type.equals("D")) resultList = dtmAWSDAO.getRadiRpt(rtuVO);
//		else if(sensor_type.equals("S")) resultList = dtmAWSDAO.getSunsRpt(rtuVO);
		
		return resultList;
	}

	@Override
	public void setAWSData(RtuVO rtuVO) throws Exception {
		
		// 분단위 데이터 변경
		rtuVO.setType("M");
		for(int i=0; i<=5; i++) {
			if(rtuVO.getDtmArr().get(i) != null) {
				// dtmArr -> rain 값 세팅
				rtuVO.setRain(rtuVO.getDtmArr().get(i)*100);
				
				String whereDate = rtuVO.getSdate()+" "+rtuVO.getHour()+":"+i+"0:00";
				rtuVO.setWhere_date(whereDate);
				// 해당 시간 row 여부 확인
				int cnt = dtmAWSDAO.searchAWSData(rtuVO);
				System.out.println("cnt === ");
				System.out.println(cnt);
				if(cnt != 0) {
					dtmAWSDAO.setAWSUpdate(rtuVO);
				}else {
					dtmAWSDAO.setAWSInsert(rtuVO);
				}				
			}
		}
		
		System.out.println("3rtuVO === ");
		System.out.println(rtuVO.getType());

		// H타입 업데이트
		updateTypeToSet(rtuVO, "H", "aws");
		// 일단위 데이터 변경
		updateTypeToSet(rtuVO, "D", "aws");
		// 월단위 데이터 변경
		updateTypeToSet(rtuVO, "N", "aws");
		// 연단위 데이터 변경
		updateTypeToSet(rtuVO, "Y", "aws");
	}

	@Override
	public List<Map<String, String>> getRptRain10m(RtuVO rtuVO) throws Exception {
		// 배열 세팅
		List<Map<String, String>> dataMap = this.setRainMinArray(rtuVO);
//		System.out.println(dataMap);
		// 시간값 세팅
		String sDate = rtuVO.getSdate().substring(0, 10)+" "+"00:00:00";
		String eDate = rtuVO.getEdate().substring(0, 10)+" "+"23:59:00";
		rtuVO.setSdate(sDate);
		rtuVO.setEdate(eDate);
		List<RainVO> rainList = dtmRainDAO.getRptRain10m(rtuVO);
		
		for(RainVO rainVO : rainList) {
			for(int i=0; i<dataMap.size(); i++) {
				if(rainVO.getRain_date().equals(dataMap.get(i).get("DATE"))) {
					if(rainVO.getRain() != -99999) {
						dataMap.get(i).put("DATA", rainVO.getRain()+"");
					}
				}
			}
		}
//		System.out.println(dataMap);
		return dataMap;
	}

	public List<Map<String, String>> setRainMinArray(RtuVO rtuVO) {
		String tmpHour = "";
		String tmpDate = "";
		List<Map<String, String>> dataList = new ArrayList<Map<String, String>>();
		
//		System.out.println("시작일====");
//		System.out.println(rtuVO.getSdate());
		String tmpSdate = rtuVO.getSdate().substring(0, 10);
		String tmpEdate = rtuVO.getEdate().substring(0, 10);
		SimpleDateFormat simpleformat = new SimpleDateFormat("yyyy-MM-dd");
		Date date1;
		Calendar cal1 = Calendar.getInstance();
		Date date2;
		Calendar cal2 = Calendar.getInstance();
		try {
			date1 = simpleformat.parse(tmpSdate);
			cal1.setTime(date1);
			date2 = simpleformat.parse(tmpEdate);
			cal2.setTime(date2);
		} catch (ParseException e) {
			System.out.println("ParseException : "+e);
			e.printStackTrace();
		}
		
		Boolean dateFlag = true; 
		while(dateFlag) {
			for(int i=0; i<=23; i++) {
				if(i < 10) {
					tmpHour = "0"+i;
				}else {
					tmpHour = ""+i;
				}
				for(int j=0; j<=5; j++) {
					Map<String, String> dataMap = new HashMap<String, String>();
					tmpDate = tmpSdate+" "+tmpHour+":"+j+"0:00"; 
					dataMap.put("DATE", tmpDate);
					dataMap.put("DATA", "-");
					dataList.add(dataMap);
				}
			}
			cal1.add(Calendar.DATE, 1); // 일 연산
			dateFlag = (cal1.after(cal2)) ? false : true;
			tmpSdate = simpleformat.format(cal1.getTime());
//			System.out.println(tmpSdate);
//			System.out.println(dateFlag);
		}
//		System.out.println("dataList size : " + dataList.size());
		return dataList;
	}
	
}