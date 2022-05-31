package egovframework.divas.dtm.service;


import java.util.List;
import java.util.Map;

import egovframework.divas.com.service.AWSVO;
import egovframework.divas.com.service.FlowVO;
import egovframework.divas.com.service.RainVO;
import egovframework.divas.com.service.RtuVO;
import egovframework.divas.com.service.SnowVO;

/**
 * 종합현황을 조회하는 비즈니스 구현 클래스
 * @author 화진티엔아이 기술연구소 서정명
 * @since 2022.03.22
 * @version 1.0
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      수정자          수정내용
 *  -------    --------    ---------------------------
 *  2022.03.22  서정명          최초 생성
 *
 *  </pre>
 */
public interface DivasDtmService {

	/**
	 * 각 현황들을 불러온다
	 * @return VO
	 *
	 * @exception Exception Exception
	 */
	public Map<String, List<?>> actionDtmRain(RtuVO rtuVO) throws Exception;

	public List<RainVO> getRain10m(RtuVO rtuVO) throws Exception;

	public void rainDataEdit(RtuVO rtuVO) throws Exception;

	public Map<String, List<?>> actionDtmFlow(RtuVO rtuVO) throws Exception;

	public List<FlowVO> getFlow10m(RtuVO rtuVO) throws Exception;

	public void setFlowData(RtuVO rtuVO) throws Exception;
	
	public Map<String, List<?>> actionDtmSnow(RtuVO rtuVO) throws Exception;
	
	public List<SnowVO> getSnow10m(RtuVO rtuVO) throws Exception;
	
	public void setSnowData(RtuVO rtuVO) throws Exception;
	
	public Map<String, List<?>> actionDtmAWS(RtuVO rtuVO) throws Exception;
	
	public List<AWSVO> getAWS10m(RtuVO rtuVO) throws Exception;
	
	public void setAWSData(RtuVO rtuVO) throws Exception;

	public List<Map<String, String>> getRptRain10m(RtuVO rtuVO) throws Exception;

	



	
}