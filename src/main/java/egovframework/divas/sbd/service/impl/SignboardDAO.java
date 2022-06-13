package egovframework.divas.sbd.service.impl;

import java.util.List;

import org.egovframe.rte.psl.dataaccess.EgovAbstractMapper;

import org.springframework.stereotype.Repository;

import egovframework.divas.com.service.AWSVO;
import egovframework.divas.sbd.service.SignboardVO;

/**
 * AWS 현황 조회를 처리
 * @author 서정명
 * @since 2022.04.13
 * @version 1.0
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      수정자          수정내용
 *  -------    --------    ---------------------------
 *  2022.04.13  서정명          최초 생성
 *
 *  </pre>
 */
@Repository("sbdDAO")
public class SignboardDAO extends EgovAbstractMapper {

	public List<SignboardVO> getUrgList(SignboardVO sbdVO) throws Exception {
		return (List<SignboardVO>)list("sbdDAO.getUrgList", sbdVO);
	}

	public List<SignboardVO> getNowList(SignboardVO sbdVO) throws Exception {
		return (List<SignboardVO>)list("sbdDAO.getNowList", sbdVO);
	}

	public List<SignboardVO> getSignGruopInfo() throws Exception {
		return (List<SignboardVO>)list("sbdDAO.getSignGruopInfo", null);
	}
	
	public List<SignboardVO> getSignInfo(SignboardVO sbdVO) throws Exception {
		return (List<SignboardVO>)list("sbdDAO.getSignInfo", sbdVO);
	}

	public List<SignboardVO> getOptionInfo() throws Exception {
		return (List<SignboardVO>)list("sbdDAO.getOptionInfo", null);
	}

	public List<SignboardVO> getMsgList() throws Exception {
		return (List<SignboardVO>)list("sbdDAO.getMsgList", null);
	}

	public void befoDeleteMsg(SignboardVO sbdVO) throws Exception {
		delete("sbdDAO.befoDeleteMsg",sbdVO);
	}

	public SignboardVO getSendSiteInfo(SignboardVO sbdVO) throws Exception {
		return (SignboardVO)selectOne("sbdDAO.getSendSiteInfo", sbdVO);
	}

	public SignboardVO getSendMsgInfo(SignboardVO sbdVO) throws Exception {
		return (SignboardVO)selectOne("sbdDAO.getSendMsgInfo", sbdVO);
	}

	public void setMsgSend(SignboardVO sbdVO) throws Exception {
		insert("sbdDAO.setMsgSend",sbdVO);
	}

	public void setMsgIn(SignboardVO sbdVO) throws Exception {
		insert("sbdDAO.setMsgIn",sbdVO);
	}

	public void setMsgUp(SignboardVO sbdVO) throws Exception {
		update("sbdDAO.setMsgUp",sbdVO);
	}

	public void setMsgDe(SignboardVO sbdVO) throws Exception {
		delete("sbdDAO.setMsgDe",sbdVO);
	}

	public List<SignboardVO> getSignList() throws Exception {
		return (List<SignboardVO>)list("sbdDAO.getSignList", null);
	}

	public void setSignIn(SignboardVO sbdVO) throws Exception {
		insert("sbdDAO.setSignIn",sbdVO);
	}

	public void setSignUp(SignboardVO sbdVO) throws Exception {
		update("sbdDAO.setSignUp",sbdVO);
	}

	public void setSignDe(SignboardVO sbdVO) throws Exception {
		delete("sbdDAO.setSignDe",sbdVO);
	}

	public List<SignboardVO> getRptList(SignboardVO sbdVO) {
		return (List<SignboardVO>)list("sbdDAO.getRptList", sbdVO);
	}

	


}
