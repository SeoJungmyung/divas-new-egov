package egovframework.divas.tms.service.impl;

import java.util.List;

import org.egovframe.rte.psl.dataaccess.EgovAbstractMapper;

import org.springframework.stereotype.Repository;

import egovframework.divas.com.service.AWSVO;

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
	


}
