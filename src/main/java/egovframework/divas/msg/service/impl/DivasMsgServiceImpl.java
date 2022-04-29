package egovframework.divas.msg.service.impl;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;

import egovframework.divas.com.service.SearchVO;
import egovframework.divas.com.service.impl.RtuInfoDAO;
import egovframework.divas.msg.service.DivasMsgService;
import egovframework.divas.msg.service.MessageVO;

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
@Service("DivasMsgService")
public class DivasMsgServiceImpl extends EgovAbstractServiceImpl implements DivasMsgService{
	
	@Resource(name = "RtuInfo")
	private RtuInfoDAO rtuInfo;
	
	@Resource(name = "messageDAO")
	private MessageDAO messageDAO;


	@Override
	public List<MessageVO> getSmsGroup(SearchVO searchVO) throws Exception {
		return messageDAO.getSmsGroup(searchVO);
	}

	@Override
	public List<MessageVO> getSmsUser(SearchVO searchVO) throws Exception {
		return messageDAO.getSmsUser(searchVO);
	}

	@Override
	public List<MessageVO> getSmsEquipment(SearchVO searchVO) throws Exception {
		return messageDAO.getSmsEquipment(searchVO);
	}

	@Override
	public void setSendXro(MessageVO msgVO) throws Exception {
		
		// 수신자가 한명 이상일때
		if(msgVO.getReceiver_arr().size() > 0) {
			if(msgVO.getSms_type().equals("1")) {
				msgVO.setSend_date(msgVO.getDd()+msgVO.getHh()+msgVO.getMm()+"00");
			}
		
			// 번호 세팅
			List<String> tmsArr = new ArrayList<String>();
			for(int i=0; i<msgVO.getReceiver_arr().size(); i++) {
				String tmp = "^"+ msgVO.getReceiver_arr().get(i);
				if(tmp.indexOf("-") != -1) {
					tmp = tmp.replaceAll("-","");
				}
				tmsArr.add(tmp);
			}
			msgVO.setReceiver_arr(tmsArr);
			
			// callback 번호 추가
//			messageDAO.setSendXro(msgVO);			
		}
	}


	
	
}