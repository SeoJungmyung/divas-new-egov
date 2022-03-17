package egovframework.divas.tms.service.impl;

import java.util.List;

import org.egovframe.rte.psl.dataaccess.EgovAbstractMapper;

import org.springframework.stereotype.Repository;

import egovframework.divas.com.service.RtuVO;
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
@Repository("tmsDAO")
public class TmsDAO extends EgovAbstractMapper {

	/**
	 * 변경된 비밀번호를 저장한다.
	 * @param vo LoginVO
	 * @exception Exception
	 */
	public List<RtuVO> rtuRainList(RtuVO rtuVO) throws Exception {
		return (List<RtuVO>)list("tmsDAO.rtuRainList", rtuVO);
	}
	
	/**
	 * 변경된 비밀번호를 저장한다.
	 * @param vo LoginVO
	 * @exception Exception
	 */
	public RainVO currentRainList(String area_code) throws Exception {
		return (RainVO)selectOne("tmsDAO.currentRainList", area_code);
	}
}
