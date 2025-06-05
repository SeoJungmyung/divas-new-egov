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

    private static final Map<String, String> DIRECTION_TO_CODE = new HashMap<>();
    private static final Map<String, String> CODE_TO_DIRECTION = new HashMap<>();

	private static final int Double = 0;
    
    static {
        // 방향 텍스트 -> 코드 매핑
        DIRECTION_TO_CODE.put("-", "-99999");
        DIRECTION_TO_CODE.put("북", "0");
        DIRECTION_TO_CODE.put("북북동", "1");
        DIRECTION_TO_CODE.put("북동", "2");
        DIRECTION_TO_CODE.put("동북동", "3");
        DIRECTION_TO_CODE.put("동", "4");
        DIRECTION_TO_CODE.put("동남동", "5");
        DIRECTION_TO_CODE.put("남동", "6");
        DIRECTION_TO_CODE.put("남남동", "7");
        DIRECTION_TO_CODE.put("남", "8");
        DIRECTION_TO_CODE.put("남남서", "9");
        DIRECTION_TO_CODE.put("남서", "10");
        DIRECTION_TO_CODE.put("서남서", "11");
        DIRECTION_TO_CODE.put("서", "12");
        DIRECTION_TO_CODE.put("서북서", "13");
        DIRECTION_TO_CODE.put("북서", "14");
        DIRECTION_TO_CODE.put("북북서", "15");
        
        // 코드 -> 방향 텍스트 매핑 (역방향)
        for (Map.Entry<String, String> entry : DIRECTION_TO_CODE.entrySet()) {
            CODE_TO_DIRECTION.put(entry.getValue(), entry.getKey());
        }
    }
    
    /**
     * 방향 텍스트를 코드로 변환
     * @param direction 방향 텍스트 (예: "북", "북북동")
     * @return 코드 (예: "0", "1") 또는 null (매칭되지 않는 경우)
     */
    public static String getCodeByDirection(String direction) {
        return DIRECTION_TO_CODE.get(direction);
    }
    
    /**
     * 코드를 방향 텍스트로 변환
     * @param code 코드 (예: "0", "1")
     * @return 방향 텍스트 (예: "북", "북북동") 또는 null (매칭되지 않는 경우)
     */
    public static String getDirectionByCode(String code) {
        return CODE_TO_DIRECTION.get(code);
    }
    
    /**
     * 풍향 각도를 영어 이미지 파일명으로 변환
     * @param degree 풍향 각도
     * @return 이미지 파일명
     */
    public String getDegreeEnString(Double degree) {
        if (degree == -99999) {
            return "-";
        }
        
        try {
            int tmpDegree = (int) (((degree / 100) + 3) / 22.5);
            int num = tmpDegree % 16;
            
            switch (num) {
                case 0: return "buk.png";
                case 1: return "bukbukdong.png";
                case 2: return "bukdong.png";
                case 3: return "dongbukdong.png";
                case 4: return "dong.png";
                case 5: return "dongnamdong.png";
                case 6: return "namdong.png";
                case 7: return "namnamdong.png";
                case 8: return "nam.png";
                case 9: return "namnamseo.png";
                case 10: return "namseo.png";
                case 11: return "seonamseo.png";
                case 12: return "seo.png";
                case 13: return "seobukseo.png";
                case 14: return "bukseo.png";
                case 15: return "bukbukseo.png";
                default: return "-";
            }
        } catch (NumberFormatException e) {
            return "-";
        }
    }
	
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

    /**
     * 숫자를 각도로 변환
     * @param num 변환할 숫자
     * @return 각도 값
     */
    public double getNumDegree(Double num) {
        return (num * 22.5) * 100;
    }

	/**
	 * 타입에 따른 format 반환
	 */
	private String getFormatByType(String type) {
	    switch(type) {
	    	case "M": return "%i";  // 10분
	        case "H": return "%k";  // 일간
	        case "D": return "%e";  // 월간
	        case "A": return "%e";  // 일별
	        case "N": return "%c";  // 연간
	        case "S": return "%i";  // 연별
	        default: return "%k";   // 기본값: 시간별
	    }
	}
	
	/**
	 * 타입에 따른 whereDate 생성
	 */
	private String generateWhereDateByType(String type, String sdate, String edate) {
	    StringBuilder whereDate = new StringBuilder();
	    
	    switch(type) {
	        case "H": // 시간별 - 특정 일의 24시간
	            for(int i=0; i<=23; i++) {
	                if(i != 0) whereDate.append(",");
	                if(i < 10) {
	                    whereDate.append(" '").append(sdate.substring(0, 10)).append(" 0").append(i).append(":00:00'");
	                } else {
	                    whereDate.append(" '").append(sdate.substring(0, 10)).append(" ").append(i).append(":00:00'");
	                }
	            }
	            break;
	           
	        case "D": // 일간
	        	String yearMonth = sdate.substring(0, 7); // YYYY-MM
	            // 해당 월의 마지막 날짜 계산
	            Calendar cal = Calendar.getInstance();
	            cal.set(Integer.parseInt(yearMonth.substring(0, 4)), 
	                   Integer.parseInt(yearMonth.substring(5, 7)) - 1, 1);
	            int lastDay = cal.getActualMaximum(Calendar.DAY_OF_MONTH);
	            System.out.println("lastDay : " + lastDay);
	            
	            for(int i=1; i<=lastDay; i++) {
	                if(i != 1) whereDate.append(",");
	                whereDate.append(" '").append(yearMonth).append("-").append(String.format("%02d", i)).append(" 00:00:00'");
	            }
	            break;
	            
	        case "A": // 일별 - sdate부터 edate까지의 기간
	            try {
	                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
	                Date startDate = sdf.parse(sdate.substring(0, 10));
	                Date endDate = sdf.parse(edate.substring(0, 10));
	                
	                cal = Calendar.getInstance();
	                cal.setTime(startDate);
	                
	                boolean isFirst = true;
	                while (!cal.getTime().after(endDate)) {
	                    if (!isFirst) whereDate.append(",");
	                    whereDate.append(" '").append(sdf.format(cal.getTime())).append(" 00:00:00'");
	                    cal.add(Calendar.DAY_OF_MONTH, 1);
	                    isFirst = false;
	                }
	            } catch (ParseException e) {
	                throw new RuntimeException("날짜 파싱 오류: " + e.getMessage());
	            }
	            break;
	            
	        case "N": // 월별 - 특정 년도의 12개월
	            String year = sdate.substring(0, 4);
	            for(int i=1; i<=12; i++) {
	                if(i != 1) whereDate.append(",");
	                whereDate.append(" '").append(year).append("-").append(String.format("%02d", i)).append("-01 00:00:00'");
	            }
	            break;
	            
	        default: // 기본값: 시간별
	            for(int i=0; i<=23; i++) {
	                if(i != 0) whereDate.append(",");
	                if(i < 10) {
	                    whereDate.append(" '").append(sdate.substring(0, 10)).append(" 0").append(i).append(":00:00'");
	                } else {
	                    whereDate.append(" '").append(sdate.substring(0, 10)).append(" ").append(i).append(":00:00'");
	                }
	            }
	            break;
	    }
	    
	    return whereDate.toString();
	}
    @Override
    public Map<String, List<?>> actionDtmRain(RtuVO rtuVO) throws Exception {
        
        List<RtuVO> rtuList = rtuInfo.rtuList(rtuVO);
        Map<String, List<?>> result = new HashMap<String, List<?>>();	
        
        String type = rtuVO.getType();
        System.out.println("type : " + type);
        String format = getFormatByType(type);
        
        if(rtuVO.getType().equals("A")) {
			type = "D";
			for (RtuVO CRtuVO : rtuList) {
				String sdate = rtuVO.getSdate(); 
				String edate = rtuVO.getEdate(); 
				CRtuVO.setSdate(sdate);
				CRtuVO.setEdate(edate);
	            CRtuVO.setFormat(format);
	            CRtuVO.setType(type);
	            List<RainVO> reRain = dtmRainDAO.getRainRptDu(CRtuVO);
	            
	            result.put(CRtuVO.getArea_code(), reRain);
	        }
		} else {
			String whereDate = generateWhereDateByType(type, rtuVO.getSdate(), rtuVO.getEdate());

			for (RtuVO CRtuVO : rtuList) {
	            CRtuVO.setFormat(format);
	            CRtuVO.setType(type);
	            CRtuVO.setWhere_date(whereDate);
	            List<RainVO> reRain = dtmRainDAO.getRainRpt(CRtuVO);
	            
	            result.put(CRtuVO.getArea_code(), reRain);
	        }
		}
//        result.put("rtuList", rtuList);
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
		else if(sensor_type == 3 || sensor_type == 4) {
			resultList = dtmAWSDAO.getWindRpt(rtuVO);
			if(sensor_type == 3) {
				for (AWSVO aws : resultList) {
					String tmp_deg = aws.getWind_deg();
					aws.setWind_deg(getCodeByDirection(tmp_deg));
				}
			}
		}
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
				if(rtuVO.getSensor_type() == 3) {
					if(rtuVO.getDtmArr().get(i) == (Double)-99999) {
						rtuVO.setRain(null);
					} else {
						rtuVO.setRain(getNumDegree(rtuVO.getDtmArr().get(i)));
					}
				} else {
					rtuVO.setRain(rtuVO.getDtmArr().get(i)*100);
				}
				
				String whereDate = rtuVO.getSdate()+" "+rtuVO.getHour()+":"+i+"0:00";
				rtuVO.setWhere_date(whereDate);
				// 해당 시간 row 여부 확인
				int cnt = dtmAWSDAO.searchAWSData(rtuVO);
				if(cnt != 0) {
					dtmAWSDAO.setAWSUpdate(rtuVO);
				}else {
					dtmAWSDAO.setAWSInsert(rtuVO);
				}				
			}
		}

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
		// 센서공통으로 RainVO에 담음 
		List<RainVO> rainList = rtuVO.getW_sensertype().equals("1") ? dtmFlowDAO.getRptFlow10m(rtuVO)
				: rtuVO.getW_sensertype().equals("2") ? dtmSnowDAO.getRptSnow10m(rtuVO)
						: rtuVO.getW_sensertype().equals("3") ? dtmAWSDAO.getRptAWS10m(rtuVO)
								: dtmRainDAO.getRptRain10m(rtuVO);
		
		for(RainVO rainVO : rainList) {
			for(int i=0; i<dataMap.size(); i++) {
				if(rainVO.getRain_date().equals(dataMap.get(i).get("DATE"))) {
					if(rtuVO.getSensor_type() == 4) {
						if(rainVO.getRain() != -99999) {
							dataMap.get(i).put("DATA", rainVO.getRain()+"");
						}
						if(rainVO.getRain_d() != -99999) {
							dataMap.get(i).put("DATA2", getDegreeEnString(rainVO.getRain_d()));
						}
					} else {
						if(rainVO.getRain() != -99999) {
							dataMap.get(i).put("DATA", rainVO.getRain()+"");
						}
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
		int hour = 0;
		
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
			
			hour = Integer.parseInt(rtuVO.getEdate().substring(11, 13));
		} catch (Exception e) {
			System.out.println("ParseException : "+e);
			e.printStackTrace();
		}
		
		Boolean dateFlag = true; 
		while(dateFlag) {
			for(int i=0; i <= hour; i++) {
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
					dataMap.put("DATA2", "-");
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