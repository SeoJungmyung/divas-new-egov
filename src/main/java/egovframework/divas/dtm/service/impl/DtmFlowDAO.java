package egovframework.divas.dtm.service.impl;

import java.util.List;

import org.egovframe.rte.psl.dataaccess.EgovAbstractMapper;

import org.springframework.stereotype.Repository;

import egovframework.divas.com.service.FlowVO;
import egovframework.divas.com.service.RainVO;
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
@Repository("dtmFlowDAO")
public class DtmFlowDAO extends EgovAbstractMapper {

	/**
	 * 10분 강우량
	 * @param String area_code
	 * @exception Exception
	 */
	public List<FlowVO> getFlowRpt(RtuVO rtuVO) throws Exception {
		return (List<FlowVO>)list("dtmFlowDAO.getFlowRpt", rtuVO);
	}

	public int searchFlowData(RtuVO rtuVO) throws Exception {
		return selectOne("dtmFlowDAO.searchFlowData", rtuVO);
	}

	public void setFlowInsert(RtuVO rtuVO) throws Exception {
		update("dtmFlowDAO.setFlowInsert", rtuVO);
	}
	
	public void setFlowUpdate(RtuVO rtuVO) throws Exception {
		update("dtmFlowDAO.setFlowUpdate", rtuVO);
	}

	public Double getFlowAvg(RtuVO rtuVO) throws Exception {
		return selectOne("dtmFlowDAO.getFlowAvg", rtuVO);
	}

	public List<RainVO> getRptFlow10m(RtuVO rtuVO) {
		return (List<RainVO>)list("dtmFlowDAO.getFlow10m", rtuVO);
	}
	
	


}
