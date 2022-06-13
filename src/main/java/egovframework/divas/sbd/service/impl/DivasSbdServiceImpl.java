package egovframework.divas.sbd.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import egovframework.com.cmm.web.EgovComUtlController;
import egovframework.divas.com.service.BroadcastVO;
import egovframework.divas.com.service.SearchVO;
import egovframework.divas.com.service.impl.BroadcastDAO;
import egovframework.divas.com.service.impl.RtuInfoDAO;
import egovframework.divas.sbd.service.DivasSbdService;
import egovframework.divas.sbd.service.SignboardVO;

/**
 * 각 현황들 화면을 구현하는 비즈니스 클래스
 * @author 서정명
 * @since 2022.04.10
 * @version 1.0
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      수정자          수정내용
 *  -------    --------    ---------------------------
 *  2022.04.10  서정명          최초 생성
 *
 *  </pre>
 */
@Service("DivasSbdService")
public class DivasSbdServiceImpl extends EgovAbstractServiceImpl implements DivasSbdService{
	
	@Resource(name = "RtuInfo")
	private RtuInfoDAO rtuInfo;
	
	@Resource(name = "sbdDAO")
	private SignboardDAO signboardDAO;

	@Override
	public List<SignboardVO> actionSbdInfo(SignboardVO sbdVO) throws Exception {
		List<SignboardVO> urgList = signboardDAO.getUrgList(sbdVO);
		List<SignboardVO> nowList = signboardDAO.getNowList(sbdVO);
		nowList.addAll(0, urgList);
		return nowList;
	}

	@Override
	public List<SignboardVO> getSbdAreaInfo(SignboardVO sbdVO) throws Exception {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<SignboardVO> getSbdMsgList() throws Exception {
		return signboardDAO.getMsgList();
	}
	
	@Override
	public void actionSbdSend(SignboardVO sbdVO) throws Exception {
		System.out.println("sbdVO =====");
		System.out.println(sbdVO);
		for(Integer id : sbdVO.getSiteid_arr()) {
			sbdVO.setSiteid(id);
			signboardDAO.befoDeleteMsg(sbdVO);
			//해당 전광판 설정정보
			SignboardVO siteInfo = signboardDAO.getSendSiteInfo(sbdVO);
			sbdVO.setAreaid(siteInfo.getAreaid());
			sbdVO.setAreabestid(siteInfo.getAreabestid());
			//해당 메세지 설정정보 ordernum i+1
			sbdVO.setIdx(sbdVO.getMsg_idx().get(0));
			SignboardVO msgInfo = signboardDAO.getSendMsgInfo(sbdVO);
			sbdVO.setTm(msgInfo.getTm());
			sbdVO.setSuccess('1');	// 항상 1?
			// 메세지 전송(DB 저장)
			signboardDAO.setMsgSend(sbdVO);
			
		}
	}

	@Override
	public List<SignboardVO> getSbdEquipGroupInfo() throws Exception {
		List<SignboardVO> equipGroupList = signboardDAO.getSignGruopInfo();
		return equipGroupList;
	}
	
	@Override
	public List<SignboardVO> getSbdEquipInfo(SignboardVO sbdVO) throws Exception {
		List<SignboardVO> equipList = signboardDAO.getSignInfo(sbdVO);
		return equipList;
	}

	@Override
	public List<SignboardVO> getSbdOptionList() throws Exception {
		return signboardDAO.getOptionInfo();
	}
	
	
	@Override
	public void actionChangeMsg(SignboardVO sbdVO) throws Exception {
		
		if(sbdVO.getChange_mode().equals("insert")) {
			signboardDAO.setMsgIn(sbdVO);
		}else if(sbdVO.getChange_mode().equals("update")) {
			signboardDAO.setMsgUp(sbdVO);
		}else if(sbdVO.getChange_mode().equals("delete")) {
			signboardDAO.setMsgDe(sbdVO);
		}else {
			// 경고
		}
	}

	@Override
	public List<SignboardVO> getSignList() throws Exception {
		return signboardDAO.getSignList();
	}

	@Override
	public void actionChangeSbd(SignboardVO sbdVO) throws Exception {

		if(sbdVO.getChange_mode().equals("insert")) {
			signboardDAO.setSignIn(sbdVO);
		}else if(sbdVO.getChange_mode().equals("update")) {
			signboardDAO.setSignUp(sbdVO);
		}else if(sbdVO.getChange_mode().equals("delete")) {
			signboardDAO.setSignDe(sbdVO);
		}else {
			// 경고
		}
	}

	@Override
	public List<SignboardVO> actionSbdRpt(SignboardVO sbdVO) throws Exception {
		return signboardDAO.getRptList(sbdVO);
	}


	
	
}