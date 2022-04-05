package egovframework.divas.com.service;

import java.util.List;

import egovframework.com.cmm.LoginVO;

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
public interface DivasCommonService {

	/**
	 * 일반 로그인을 처리한다
	 * @return LoginVO
	 *
	 * @param vo    LoginVO
	 * @exception Exception Exception
	 */
	public LoginVO actionLogin(LoginVO vo) throws Exception;
	
	/**
	 * 세션을 처리한다
	 * @return CommonVO
	 *
	 * @param vo    LoginVO
	 * @exception Exception Exception
	 */
	public CommonVO setSession(LoginVO vo) throws Exception;

	public List<LeftMenuVO> actionMenuTopData(String user_type) throws Exception;

	public List<LeftMenuVO> actionMenuInData(String user_type) throws Exception;

	
}