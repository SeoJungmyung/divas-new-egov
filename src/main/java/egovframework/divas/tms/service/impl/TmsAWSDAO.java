package egovframework.divas.tms.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egovframe.rte.psl.dataaccess.EgovAbstractMapper;

import org.springframework.stereotype.Repository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import egovframework.com.cmm.web.EgovComUtlController;
import egovframework.divas.com.service.AWSVO;
import egovframework.divas.com.service.FlowVO;

/**
 * AWS 현황 조회를 처리
 * @author 서정명
 * @since 2022.04.13
 * @version 1.0
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      수정자          수정내용
 *  -------    --------    ---------------------------
 *  2022.04.13  서정명          최초 생성
 *
 *  </pre>
 */
@Repository("tmsAWSDAO")
public class TmsAWSDAO extends EgovAbstractMapper {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(EgovComUtlController.class);

	/**
	 * 시간 강우량
	 * @param String area_code
	 * @exception Exception
	 */
	public AWSVO getRainHValue(String area_code) throws Exception {
		return (AWSVO)selectOne("tmsAWSDAO.getRainHValue", area_code);
	}
	
	/**
	 * 금일 강우량
	 * @param String area_code
	 * @exception Exception
	 */
	public AWSVO getRainDValue(String area_code) throws Exception {
		return (AWSVO)selectOne("tmsAWSDAO.getRainDValue", area_code);
	}
	
	/**
	 * 시간 온도
	 * @param String area_code
	 * @exception Exception
	 */
	public AWSVO getTempMValue(String area_code) throws Exception {
		return (AWSVO)selectOne("tmsAWSDAO.getTempMValue", area_code);
	}
	
	/**
	 * 최대 최소 온도
	 * @param String area_code
	 * @exception Exception
	 */
	public AWSVO getTempDValue(String area_code) throws Exception {
		return (AWSVO)selectOne("tmsAWSDAO.getTempDValue", area_code);
	}
	
	/**
	 * 시간 풍속, 풍향
	 * @param String area_code
	 * @exception Exception
	 */
	public AWSVO getWindMValue(String area_code) throws Exception {
		return (AWSVO)selectOne("tmsAWSDAO.getWindMValue", area_code);
	}
	
	/**
	 * 최대 풍속, 풍향
	 * @param String area_code
	 * @exception Exception
	 */
	public AWSVO getWindDValue(String area_code) throws Exception {
		return (AWSVO)selectOne("tmsAWSDAO.getWindDValue", area_code);
	}
	
	/**
	 * 시간 습도
	 * @param String area_code
	 * @exception Exception
	 */
	public AWSVO getHumiMValue(String area_code) throws Exception {
		return (AWSVO)selectOne("tmsAWSDAO.getHumiMValue", area_code);
	}
	
	/**
	 * 최대 최소 습도
	 * @param String area_code
	 * @exception Exception
	 */
	public AWSVO getHumiDValue(String area_code) throws Exception {
		return (AWSVO)selectOne("tmsAWSDAO.getHumiDValue", area_code);
	}
	
	/**
     * 배치로 모든 AWS 데이터 조회
     */
	public Map<String, AWSVO> getBatchAWSData(List<String> areaCodes) {
	    try {
	        List<AWSVO> awsList = (List<AWSVO>) list("tmsAWSDAO.getBatchAWSData", areaCodes);
	        System.out.println("awsList ===");
	        System.out.println(awsList);
	        if (awsList == null || awsList.isEmpty()) {
	            return new HashMap<>();
	        }
	        
	        // List를 Map으로 변환
	        Map<String, AWSVO> resultMap = new HashMap<>();
	        for (AWSVO aws : awsList) {
	            if (aws != null && aws.getArea_code() != null) {
	                resultMap.put(aws.getArea_code(), aws);
	            }
	        }
	        
	        return resultMap;
	        
	    } catch (Exception e) {
	        // 로그 출력 후 빈 Map 반환
	    	LOGGER.error("배치 AWS 데이터 조회 중 오류 발생: {}", e.getMessage());
	        return new HashMap<>();
	    }
	}
	
}
