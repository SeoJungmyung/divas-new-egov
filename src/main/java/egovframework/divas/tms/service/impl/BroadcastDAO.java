package egovframework.divas.tms.service.impl;

import java.util.List;

import org.egovframe.rte.psl.dataaccess.EgovAbstractMapper;

import org.springframework.stereotype.Repository;

import egovframework.divas.com.service.BroadcastVO;
import egovframework.divas.com.service.EventVO;
import egovframework.divas.com.service.SearchVO;

/**
 * 방송 관련 비즈니스 구현 클래스
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
@Repository("broadcastDAO")
public class BroadcastDAO extends EgovAbstractMapper {

	/**
	 * 방송현황 리스트를 가져온다.
	 * @param vo BroadcastVO
	 * @exception Exception
	 */
	public List<BroadcastVO> getBroadcastList(SearchVO searchVO) {
		return (List<BroadcastVO>)list("broadcastDAO.getBroadcastList", searchVO);
	}
	
	/**
	 * 방송 이벤트(경보) 현황 리스트를 가져온다.
	 * @param vo EventVO
	 * @exception Exception
	 */
	public List<EventVO> getEventGroupList(SearchVO searchVO) {
		return (List<EventVO>)list("broadcastDAO.getEventGroupList", searchVO);
	}

	public List<EventVO> getEventList(SearchVO searchVO) {
		return (List<EventVO>)list("broadcastDAO.getEventList", searchVO);
	}
	
	


}
