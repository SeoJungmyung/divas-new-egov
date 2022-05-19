package egovframework.divas.dtm.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import egovframework.com.cmm.web.EgovComUtlController;
import egovframework.divas.com.service.AWSVO;
import egovframework.divas.com.service.FlowVO;
import egovframework.divas.com.service.RainVO;
import egovframework.divas.com.service.RtuVO;
import egovframework.divas.com.service.SnowVO;
import egovframework.divas.com.service.impl.RtuInfoDAO;
import egovframework.divas.dtm.service.DivasDtmService;

/**
 * 각 현황들 화면을 구현하는 비즈니스 클래스
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
		
		// 분단위 데이터 변경
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
		
		// 시간단위 데이터 변경
		String whereDate = rtuVO.getSdate()+" "+rtuVO.getHour()+":00:00";
		String sDate = rtuVO.getSdate()+" "+rtuVO.getHour()+":59:00";
		rtuVO.setWhere_date(whereDate);
		rtuVO.setSdate(sDate);
		Double sumData = dtmRainDAO.getRainSum(rtuVO);
//		System.out.println("sumData === ");
//		System.out.println(sumData);
		rtuVO.setRain(sumData);
		
		rtuVO.setType("H");
		int cnt = dtmRainDAO.searchRainData(rtuVO);
		if(cnt != 0) {
			dtmRainDAO.setRainUpdate(rtuVO);
		}else {
			dtmRainDAO.setRainInsert(rtuVO);
		}		
		
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
		
		// 시간단위 데이터 변경
		String whereDate = rtuVO.getSdate()+" "+rtuVO.getHour()+":00:00";
		String sDate = rtuVO.getSdate()+" "+rtuVO.getHour()+":59:00";
		rtuVO.setWhere_date(whereDate);
		rtuVO.setSdate(sDate);
		Double sumData = dtmFlowDAO.getFlowSum(rtuVO);
		rtuVO.setFlow(sumData);
		
		rtuVO.setType("H");
		int cnt = dtmFlowDAO.searchFlowData(rtuVO);
		if(cnt != 0) {
			dtmFlowDAO.setFlowUpdate(rtuVO);
		}else {
			dtmFlowDAO.setFlowInsert(rtuVO);
		}		
		
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
				rtuVO.setSnow(rtuVO.getDtmArr().get(i)*100);
				
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
		
		// 시간단위 데이터 변경
		String whereDate = rtuVO.getSdate()+" "+rtuVO.getHour()+":00:00";
		String sDate = rtuVO.getSdate()+" "+rtuVO.getHour()+":59:00";
		rtuVO.setWhere_date(whereDate);
		rtuVO.setSdate(sDate);
		Double sumData = dtmSnowDAO.getSnowSum(rtuVO);
		rtuVO.setSnow(sumData);
		
		rtuVO.setType("H");
		int cnt = dtmSnowDAO.searchSnowData(rtuVO);
		if(cnt != 0) {
			dtmSnowDAO.setSnowUpdate(rtuVO);
		}else {
			dtmSnowDAO.setSnowInsert(rtuVO);
		}
		
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
		System.out.println(rtuVO.getW_sensertype());
		rtuVO.setFormat("%i");
		rtuVO.setType("M");
		rtuVO.setWhere_date(whereDate);
		
		List<AWSVO> resultList = new ArrayList<AWSVO>();
		if(rtuVO.getW_sensertype().equals("R")) resultList = dtmAWSDAO.getRainRpt(rtuVO);
		else if(rtuVO.getW_sensertype().equals("T")) resultList = dtmAWSDAO.getTempRpt(rtuVO);
		else if(rtuVO.getW_sensertype().equals("A")) resultList = dtmAWSDAO.getAtmoRpt(rtuVO);
		else if(rtuVO.getW_sensertype().equals("H")) resultList = dtmAWSDAO.getHumiRpt(rtuVO);
		else if(rtuVO.getW_sensertype().equals("W")) resultList = dtmAWSDAO.getWindRpt(rtuVO);
		else if(rtuVO.getW_sensertype().equals("D")) resultList = dtmAWSDAO.getRadiRpt(rtuVO);
		else if(rtuVO.getW_sensertype().equals("S")) resultList = dtmAWSDAO.getSunsRpt(rtuVO);
		
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
				if(cnt != 0) {
					dtmAWSDAO.setAWSUpdate(rtuVO);
				}else {
					dtmAWSDAO.setAWSInsert(rtuVO);
				}				
			}
		}
		
		// 시간단위 데이터 변경
		String whereDate = rtuVO.getSdate()+" "+rtuVO.getHour()+":00:00";
		String sDate = rtuVO.getSdate()+" "+rtuVO.getHour()+":59:00";
		rtuVO.setWhere_date(whereDate);
		rtuVO.setSdate(sDate);
		Double sumData = dtmAWSDAO.getAWSSum(rtuVO);
		System.out.println("sumData === ");
		System.out.println(sumData);
		rtuVO.setRain(sumData);
		
		rtuVO.setType("H");
		int cnt = dtmAWSDAO.searchAWSData(rtuVO);
		if(cnt != 0) {
			dtmAWSDAO.setAWSUpdate(rtuVO);
		}else {
			dtmAWSDAO.setAWSInsert(rtuVO);
		}
	}

	
	
}