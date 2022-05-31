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
@Repository("dtmRainDAO")
public class DtmRainDAO extends EgovAbstractMapper {

	/**
	 * 10분 강우량
	 * @param String area_code
	 * @exception Exception
	 */
	public List<RainVO> getRainRpt(RtuVO rtuVO) throws Exception {
		return (List<RainVO>)list("dtmRainDAO.getRainRpt", rtuVO);
	}

	public int searchRainData(RtuVO rtuVO) throws Exception {
		return selectOne("dtmRainDAO.searchRainData", rtuVO);
	}

	public void setRainInsert(RtuVO rtuVO) throws Exception {
		update("dtmRainDAO.setRainInsert", rtuVO);
	}
	
	public void setRainUpdate(RtuVO rtuVO) throws Exception {
		update("dtmRainDAO.setRainUpdate", rtuVO);
	}

	public Double getRainSum(RtuVO rtuVO) throws Exception {
		return selectOne("dtmRainDAO.getRainSum", rtuVO);
	}
	
	public List<RainVO> getRptRain10m(RtuVO rtuVO) {
		return (List<RainVO>)list("dtmRainDAO.getRain10m", rtuVO);
	}
	
	


}
