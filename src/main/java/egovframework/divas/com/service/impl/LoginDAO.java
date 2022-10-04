package egovframework.divas.com.service.impl;

import java.util.HashMap;
import java.util.List;

import org.egovframe.rte.psl.dataaccess.EgovAbstractMapper;
import org.springframework.stereotype.Repository;

import egovframework.com.cmm.LoginVO;
import egovframework.divas.com.service.CommonVO;

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
@Repository("loginDAO")
public class LoginDAO extends EgovAbstractMapper {

	/**
	 * 일반 로그인을 처리한다
	 * @param vo LoginVO
	 * @return LoginVO
	 * @exception Exception
	 */
	public LoginVO actionLogin(LoginVO vo) throws Exception {
		return (LoginVO) selectOne("loginDAO.actionLogin", vo);
	}
	
	/**
	 * 
	 * @param vo LoginVO
	 * @return CommonVO
	 * @exception Exception
	 */
	public CommonVO getSettingData(LoginVO vo) throws Exception {
		return (CommonVO) selectOne("loginDAO.getSettingData", vo);
	}
	
	/**
	 * 장비권한 처리
	 * @param vo LoginVO
	 * @return List<String>
	 * @exception Exception
	 */
	public List<HashMap<String, Integer>> getUserRtuRight(LoginVO vo) throws Exception {
		return (List<HashMap<String, Integer>>) list("loginDAO.getUserRtuRight", vo);
	}

	/**
	 * 변경된 비밀번호를 저장한다.
	 * @param vo LoginVO
	 * @exception Exception
	 */
	public void updatePassword(LoginVO vo) throws Exception {
		update("loginDAO.updatePassword", vo);
	}

	public CommonVO getOrgan(LoginVO vo) throws Exception {
		return (CommonVO) selectOne("loginDAO.getOrgan", vo);
	}
}
