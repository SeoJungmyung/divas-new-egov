package egovframework.divas.com.service.impl;

import egovframework.com.cmm.LoginVO;
import egovframework.divas.com.service.CommonVO;
import egovframework.divas.com.service.DivasCommonService;
import egovframework.divas.com.service.LeftMenuVO;

import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

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
@Service("loginService")
public class DivasCommonServiceImpl extends EgovAbstractServiceImpl implements DivasCommonService {

	@Resource(name = "loginDAO")
	private LoginDAO loginDAO;
	
	@Resource(name = "commonDAO")
	private CommonDAO commonDAO;

	/**
	 * 일반 로그인을 처리한다
	 * @param vo LoginVO
	 * @return LoginVO
	 * @exception Exception
	 */
	@Override
	public LoginVO actionLogin(LoginVO vo) throws Exception {

		// 1. 입력한 비밀번호를 암호화한다.
		System.out.println("vo.getId() : " + vo.getUser_id());
		System.out.println("vo.getPassword() : " + vo.getUser_pwd());
//		String enpassword = EgovFileScrty.encryptPassword(vo.getPassword(), vo.getId()); 암호화 사용유무
//		vo.setPassword(enpassword);

		// 2. 아이디와 암호화된 비밀번호가 DB와 일치하는지 확인한다.
		LoginVO loginVO = loginDAO.actionLogin(vo);

		// 3. 결과를 리턴한다.
		if (loginVO != null && !loginVO.getUser_id().equals("") && !loginVO.getUser_pwd().equals("")) {
			return loginVO;
		} else {
			loginVO = new LoginVO();
		}

		return loginVO;
	}

	/**
	 * 세션을 처리한다
	 * @param vo LoginVO
	 * @return CommonVO
	 * @exception Exception
	 */
	@Override
	public CommonVO setSession(LoginVO vo) throws Exception {
		CommonVO commonVO = loginDAO.getSettingData(vo);
		commonVO.setUser_id(vo.getUser_id());
		commonVO.setUser_name(vo.getUser_name());
		commonVO.setUser_type(vo.getUser_type());
		commonVO.setOrgan_id(vo.getOrgan_id());
		return commonVO;
	}

	/**
	 * left menu를 가져온다
	 * @param String user_type
	 * @return List - LeftMenuVO
	 * @exception Exception
	 */
	@Override
	public List<LeftMenuVO> actionMenuTopData(String user_type)  throws Exception {
		System.out.println("user_type : " + user_type);

		List<LeftMenuVO> topMenuList = commonDAO.actionMenuTopData(user_type);
		return topMenuList;
	}

	/**
	 * left menu를 가져온다
	 * @param String user_type
	 * @return List - LeftMenuVO
	 * @exception Exception
	 */
	@Override
	public List<LeftMenuVO> actionMenuInData(String user_type) throws Exception {
		List<LeftMenuVO> inMenuList = commonDAO.actionMenuInData(user_type);
		return inMenuList;
	}

}