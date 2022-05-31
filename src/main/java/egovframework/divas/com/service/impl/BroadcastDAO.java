package egovframework.divas.com.service.impl;

import java.util.HashMap;
import java.util.List;

import org.egovframe.rte.psl.dataaccess.EgovAbstractMapper;

import org.springframework.stereotype.Repository;

import egovframework.divas.com.service.BroadcastVO;
import egovframework.divas.com.service.CommonVO;
import egovframework.divas.com.service.EventVO;
import egovframework.divas.com.service.SearchVO;
import egovframework.divas.com.service.StatisticsVO;

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
	public List<BroadcastVO> getBroadcastList(SearchVO searchVO) throws Exception {
		return (List<BroadcastVO>)list("broadcastDAO.getBroadcastList", searchVO);
	}
	
	/**
	 * 방송 이벤트(경보) 현황 리스트를 가져온다.
	 * @param vo EventVO
	 * @exception Exception
	 */
	public List<EventVO> getEventGroupList(SearchVO searchVO) throws Exception {
		return (List<EventVO>)list("broadcastDAO.getEventGroupList", searchVO);
	}

	public List<EventVO> getEventList(SearchVO searchVO) throws Exception {
		return (List<EventVO>)list("broadcastDAO.getEventList", searchVO);
	}

	public List<BroadcastVO> getBroadCastScript(CommonVO commonVO) throws Exception {
		return (List<BroadcastVO>)list("broadcastDAO.getBroadCastScript", commonVO);
	}

	public void setBroadcastLog(BroadcastVO brdVO) throws Exception {
		insert("broadcastDAO.setBroadcastLog", brdVO);
	}

	public void setRtuLog(List<Integer> brdList) throws Exception {
		insert("broadcastDAO.setRtuLog", brdList);
	}

	public void setScriptIn(BroadcastVO brdVO) throws Exception {
		insert("broadcastDAO.setScriptIn", brdVO);
	}
	
	public void setScriptUp(BroadcastVO brdVO) throws Exception {
		update("broadcastDAO.setScriptUp", brdVO);
	}
	
	public void setScriptDe(BroadcastVO brdVO) throws Exception {
		delete("broadcastDAO.setScriptDe", brdVO);
	}

	public List<BroadcastVO> getBroadCastPlan(CommonVO commonVO) throws Exception {
		return (List<BroadcastVO>)list("broadcastDAO.getBroadCastPlan", commonVO);
	}
	
	public void setPlanUp(BroadcastVO brdVO) throws Exception {
		update("broadcastDAO.setPlanUp", brdVO);
	}
	
	public void setPlanDe(BroadcastVO brdVO) throws Exception {
		delete("broadcastDAO.setPlanDe", brdVO);
	}

	public void setRtuPlanDe(BroadcastVO brdVO) throws Exception {
		delete("broadcastDAO.setRtuPlanDe", brdVO);
	}

	public void setRtuPlan(HashMap<String, Object> tmpMap) throws Exception {
		insert("broadcastDAO.setRtuPlan", tmpMap);
	}

	public void setBroadCastPlanStateChange(BroadcastVO brdVO) throws Exception {
		update("broadcastDAO.setBroadCastPlanStateChange", brdVO);
	}

	public BroadcastVO getBroadcastDetail(SearchVO searchVO) throws Exception {
		return (BroadcastVO)selectOne("broadcastDAO.getBroadcastDetail", searchVO);
	}

	public List<BroadcastVO> getBroadcastState(SearchVO searchVO) throws Exception {
		return (List<BroadcastVO>)list("broadcastDAO.getBroadcastState", searchVO);
	}

	public List<StatisticsVO> getBroadcastCnt(SearchVO searchVO) throws Exception {
		return (List<StatisticsVO>)list("broadcastDAO.getBroadcastCnt", searchVO);
	}

	public List<StatisticsVO> getIsPlanCnt(SearchVO searchVO) throws Exception {
		return (List<StatisticsVO>)list("broadcastDAO.getIsPlanCnt", searchVO);
	}
	
	


}
