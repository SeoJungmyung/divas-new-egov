package egovframework.divas.msg.service.impl;

import java.util.HashMap;
import java.util.List;

import org.egovframe.rte.psl.dataaccess.EgovAbstractMapper;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

import egovframework.divas.com.service.BroadcastVO;
import egovframework.divas.com.service.CommonVO;
import egovframework.divas.com.service.EventVO;
import egovframework.divas.com.service.SearchVO;
import egovframework.divas.msg.service.MessageVO;

/**
 * 문자 관련 비즈니스 구현 클래스
 * @author 서정명
 * @since 2022.04.15
 * @version 1.0
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      수정자          수정내용
 *  -------    --------    ---------------------------
 *  2022.04.15  서정명          최초 생성
 *
 *  </pre>
 */
@Repository("messageDAO")
public class MessageDAO extends EgovAbstractMapper {

	@Autowired
	@Qualifier("sqlSessionTemplate2")
	private SqlSessionTemplate sqlSession2;
	
	/**
	 * 문자 수신자그룹을 가져온다.
	 * @param vo MessageVO
	 * @exception Exception
	 */
	public List<MessageVO> getSmsGroup(SearchVO searchVO) throws Exception {
		return (List<MessageVO>)list("messageDAO.getSmsGroup", searchVO);
	}

	public List<MessageVO> getSmsUser(SearchVO searchVO) throws Exception {
		return (List<MessageVO>)list("messageDAO.getSmsUser", searchVO);
	}

	public List<MessageVO> getSmsEquipment(SearchVO searchVO) throws Exception {
		return (List<MessageVO>)list("messageDAO.getSmsEquipment", searchVO);
	}

	public void setSendXro(MessageVO msgVO) throws Exception {
		sqlSession2.insert("messageDAO.setSendXro", msgVO);
	}

	public List<MessageVO> getMsgHist(SearchVO searchVO) throws Exception {
		return sqlSession2.selectList("messageDAO.getSmsListXro", searchVO);
	}

	public List<MessageVO> getMsgHistDetail(SearchVO searchVO) {
		return sqlSession2.selectList("messageDAO.getSmsDetailXro", searchVO);
	}

	public void setSmsUserIn(MessageVO msgVO) {
		insert("messageDAO.setSmsUserIn", msgVO);
	}

	public void setSmsUserUp(MessageVO msgVO) {
		update("messageDAO.setSmsUserUp", msgVO);
	}

	public void setSmsUserDe(MessageVO msgVO) {
		delete("messageDAO.setSmsUserDe", msgVO);
		
	}
	
	


}
