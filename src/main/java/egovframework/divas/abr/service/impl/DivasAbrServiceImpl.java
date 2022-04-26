package egovframework.divas.abr.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

import javax.annotation.Resource;

import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;

import egovframework.divas.abr.service.DivasAbrService;
import egovframework.divas.com.service.BroadcastVO;
import egovframework.divas.com.service.CommonVO;
import egovframework.divas.com.service.RtuVO;
import egovframework.divas.com.service.impl.BroadcastDAO;
import egovframework.divas.com.service.impl.RtuInfoDAO;

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
@Service("DivasAbrService")
public class DivasAbrServiceImpl extends EgovAbstractServiceImpl implements DivasAbrService{
	
	@Resource(name = "RtuInfo")
	private RtuInfoDAO rtuInfo;
	
	@Resource(name = "broadcastDAO")
	private BroadcastDAO broadcastDAO;

	@Override
	public List<RtuVO> actionBroadcastRtuGroupList(CommonVO commonVO) throws Exception {
		return rtuInfo.getBroadcastRtuGroupList(commonVO);
	}
	
	@Override
	public List<RtuVO> actionBroadcastRtuList(CommonVO commonVO) throws Exception {
		return rtuInfo.getBroadcastRtuList(commonVO);
	}

	@Override
	public List<BroadcastVO> actionBroadcastScriptList(CommonVO commonVO) throws Exception {
		return broadcastDAO.getBroadCastScript(commonVO);
	}

	@Override
	public void actionSetBroadcastLog(BroadcastVO brdVO) throws Exception {
//		LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
//		Timestamp ts = Timestamp.valueOf(now);
//		String valid = EgovFileScrty.encode(brdVO.getUser_id()+ts);
		
		// UUID 사용 랜덤아이디 생성
		String valid = UUID.randomUUID().toString().replace("-", "");
		brdVO.setValid(valid);
		broadcastDAO.setBroadcastLog(brdVO);

		//rtu_log 테이블 insert
		List<Integer> tmpList = brdVO.getRtu_id_arr();
		broadcastDAO.setRtuLog(tmpList);
	}

	@Override
	public void actionAbrScriptChange(BroadcastVO brdVO) throws Exception {
//		System.out.println(brdVO);
		if(brdVO.getChange_mode().equals("insert")) {
			broadcastDAO.setScriptIn(brdVO);			
		}else if(brdVO.getChange_mode().equals("update")) {
			broadcastDAO.setScriptUp(brdVO);			
		}else if(brdVO.getChange_mode().equals("delete")) {
			broadcastDAO.setScriptDe(brdVO);			
		}else {
			// 경고
		}
	}

	@Override
	public List<BroadcastVO> actionBroadcastPlan(CommonVO commonVO) throws Exception {
		return broadcastDAO.getBroadCastPlan(commonVO);
	}

	@Override
	public void actionAbrDateChange(BroadcastVO brdVO) throws Exception {
		if(brdVO.getChange_mode().equals("insert")) {
			broadcastDAO.setScriptIn(brdVO);			
		}else if(brdVO.getChange_mode().equals("update")) {
			broadcastDAO.setPlanUp(brdVO);			
			broadcastDAO.setRtuPlanDe(brdVO);	
			
//			System.out.println(brdVO.getRtu_id_arr());
			if(brdVO.getRtu_id_arr() != null) {
				HashMap<String, Object> tmpMap = new HashMap<String, Object>();
				
				tmpMap.put("brdVO", brdVO);				
				tmpMap.put("rtu_id_arr", brdVO.getRtu_id_arr());
				
				// rtu_id 배열 저장
				broadcastDAO.setRtuPlan(tmpMap);		
			}
			
		}else if(brdVO.getChange_mode().equals("delete")) {
			broadcastDAO.setPlanDe(brdVO);			
			broadcastDAO.setRtuPlanDe(brdVO);			
		}else {
			// 경고
		}
		
	}

	@Override
	public void actionAbrDateStateChange(BroadcastVO brdVO) throws Exception {
		broadcastDAO.setBroadCastPlanStateChange(brdVO);
	}


	
	
}