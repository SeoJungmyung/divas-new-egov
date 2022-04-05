package egovframework.divas.com.service.impl;

import java.util.List;

import org.egovframe.rte.psl.dataaccess.EgovAbstractMapper;
import org.springframework.stereotype.Repository;

import egovframework.com.cmm.LoginVO;
import egovframework.divas.com.service.CommonVO;
import egovframework.divas.com.service.LeftMenuVO;
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
@Repository("commonDAO")
public class CommonDAO extends EgovAbstractMapper {

	/**
	 * left 메뉴 dn_menu_top
	 * @param String user_type
	 * @return List<CommonVO>
	 * @exception Exception
	 */
	public List<LeftMenuVO> actionMenuTopData(String user_type) throws Exception {
		return (List<LeftMenuVO>) list("commonDAO.actionMenuTopData", user_type);
	}
	
}
