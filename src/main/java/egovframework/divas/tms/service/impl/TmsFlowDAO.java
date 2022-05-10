package egovframework.divas.tms.service.impl;

import java.util.List;

import org.egovframe.rte.psl.dataaccess.EgovAbstractMapper;

import org.springframework.stereotype.Repository;

import egovframework.divas.com.service.FlowVO;
import egovframework.divas.com.service.RtuVO;

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
@Repository("tmsFlowDAO")
public class TmsFlowDAO extends EgovAbstractMapper {

	/**
	 * 10분 강우량
	 * @param String area_code
	 * @exception Exception
	 */
	public FlowVO getFlowMValue(String area_code) throws Exception {
		return (FlowVO)selectOne("tmsFlowDAO.getFlowMValue", area_code);
	}
	
	/**
	 * 시간 강우량
	 * @param String area_code
	 * @exception Exception
	 */
	public FlowVO getFlowHValue(String area_code) throws Exception {
		return (FlowVO)selectOne("tmsFlowDAO.getFlowHValue", area_code);
	}
	
	/**
	 * 이전시간 강우량
	 * @param String area_code
	 * @exception Exception
	 */
	public FlowVO getFlowBHValue(String area_code) throws Exception {
		return (FlowVO)selectOne("tmsFlowDAO.getFlowBHValue", area_code);
	}
	
	/**
	 * 금일 강우량
	 * @param String area_code
	 * @exception Exception
	 */
	public FlowVO getFlowDValue(String area_code) throws Exception {
		return (FlowVO)selectOne("tmsFlowDAO.getFlowDValue", area_code);
	}
	
	/**
	 * 전일 강우량
	 * @param String area_code
	 * @exception Exception
	 */
	public FlowVO getFlowBDValue(String area_code) throws Exception {
		return (FlowVO)selectOne("tmsFlowDAO.getFlowBDValue", area_code);
	}
	
	/**
	 * 금월 강우량
	 * @param String area_code
	 * @exception Exception
	 */
	public FlowVO getFlowNValue(String area_code) throws Exception {
		return (FlowVO)selectOne("tmsFlowDAO.getFlowNValue", area_code);
	}
	
	/**
	 * 금년 강우량
	 * @param String area_code
	 * @exception Exception
	 */
	public FlowVO getFlowYValue(String area_code) throws Exception {
		return (FlowVO)selectOne("tmsFlowDAO.getFlowYValue", area_code);
	}

}
