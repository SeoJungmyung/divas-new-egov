package egovframework.divas.tms.service.impl;

import java.util.List;

import org.egovframe.rte.psl.dataaccess.EgovAbstractMapper;

import org.springframework.stereotype.Repository;

import egovframework.divas.com.service.RtuVO;
import egovframework.divas.tms.service.SnowVO;

/**
 * 일반 로그인을 처리하는 비즈니스 구현 클래스
 * @author 공통서비스 개발팀 박지욱
 * @since 2009.03.06
 * @version 1.0
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      수정자          수정내용
 *  -------    --------    ---------------------------
 *  2009.03.06  박지욱          최초 생성
 *  2011.08.31  JJY            경량환경 템플릿 커스터마이징버전 생성
 *
 *  </pre>
 */
@Repository("tmsSnowDAO")
public class TmsSnowDAO extends EgovAbstractMapper {

	/**
	 * 10분 적설량
	 * @param String area_code
	 * @exception Exception
	 */
	public SnowVO getSnowMValue(String area_code) throws Exception {
		return (SnowVO)selectOne("tmsSnowDAO.getSnowMValue", area_code);
	}
	
	/**
	 * 시간 적설량
	 * @param String area_code
	 * @exception Exception
	 */
	public SnowVO getSnowHValue(String area_code) throws Exception {
		return (SnowVO)selectOne("tmsSnowDAO.getSnowHValue", area_code);
	}
	
	/**
	 * 이전시간 적설량
	 * @param String area_code
	 * @exception Exception
	 */
	public SnowVO getSnowBHValue(String area_code) throws Exception {
		return (SnowVO)selectOne("tmsSnowDAO.getSnowBHValue", area_code);
	}
	
	/**
	 * 금일 적설량
	 * @param String area_code
	 * @exception Exception
	 */
	public SnowVO getSnowDValue(String area_code) throws Exception {
		return (SnowVO)selectOne("tmsSnowDAO.getSnowDValue", area_code);
	}
	
	/**
	 * 금일 최고 적설량
	 * @param String area_code
	 * @exception Exception
	 */
	public SnowVO getSnowDMaxValue(String area_code) throws Exception {
		return (SnowVO)selectOne("tmsSnowDAO.getSnowDMaxValue", area_code);
	}
	
	/**
	 * 전일 최고 적설량
	 * @param String area_code
	 * @exception Exception
	 */
	public SnowVO getSnowBDValue(String area_code) throws Exception {
		return (SnowVO)selectOne("tmsSnowDAO.getSnowBDValue", area_code);
	}
	
	/**
	 * 전전일 최고 적설량
	 * @param String area_code
	 * @exception Exception
	 */
	public SnowVO getSnowBBDValue(String area_code) throws Exception {
		return (SnowVO)selectOne("tmsSnowDAO.getSnowBBDValue", area_code);
	}
	
	/**
	 * 금월 적설량
	 * @param String area_code
	 * @exception Exception
	 */
	public SnowVO getSnowNValue(String area_code) throws Exception {
		return (SnowVO)selectOne("tmsSnowDAO.getSnowNValue", area_code);
	}
	
	/**
	 * 금년 적설량
	 * @param String area_code
	 * @exception Exception
	 */
	public SnowVO getSnowYValue(String area_code) throws Exception {
		return (SnowVO)selectOne("tmsSnowDAO.getSnowYValue", area_code);
	}
	


}
