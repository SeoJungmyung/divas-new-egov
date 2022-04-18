package egovframework.divas.tms.service.impl;

import java.util.List;

import org.egovframe.rte.psl.dataaccess.EgovAbstractMapper;

import org.springframework.stereotype.Repository;

import egovframework.divas.com.service.RtuVO;
import egovframework.divas.tms.service.FlowVO;
import egovframework.divas.tms.service.RainVO;

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
@Repository("RtuInfo")
public class RtuInfoDAO extends EgovAbstractMapper {

	/**
	 * 센서별 장비 리스트를 가져온다.
	 * @param vo LoginVO
	 * @exception Exception
	 */
	public List<RtuVO> rtuList(RtuVO rtuVO) throws Exception {
		return (List<RtuVO>)list("RtuInfo.rtuList", rtuVO);
	}
	
	/**
	 * 장비상태 리스트를 가져온다.
	 * @param vo LoginVO
	 * @exception Exception
	 */
	public List<RtuVO> getRtuStateList(RtuVO rtuVO) throws Exception {
		return (List<RtuVO>)list("RtuInfo.getRtuStateList", rtuVO);
	}
	
	


}
