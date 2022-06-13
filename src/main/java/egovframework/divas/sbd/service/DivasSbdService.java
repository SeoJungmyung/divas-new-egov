package egovframework.divas.sbd.service;


import java.util.List;

import egovframework.divas.com.service.AWSVO;
import egovframework.divas.com.service.BroadcastVO;
import egovframework.divas.com.service.EventVO;
import egovframework.divas.com.service.FlowVO;
import egovframework.divas.com.service.RainVO;
import egovframework.divas.com.service.RtuVO;
import egovframework.divas.com.service.SearchVO;
import egovframework.divas.com.service.SnowVO;

/**
 * 종합현황을 조회하는 비즈니스 구현 클래스
 * @author 화진티엔아이 기술연구소 서정명
 * @since 2022.03.22
 * @version 1.0
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      수정자          수정내용
 *  -------    --------    ---------------------------
 *  2022.03.22  서정명          최초 생성
 *
 *  </pre>
 */
public interface DivasSbdService {

	/**
	 * 각 현황들을 불러온다
	 * @return VO
	 *
	 * @exception Exception Exception
	 */
	public List<SignboardVO> actionSbdInfo(SignboardVO sbdVO) throws Exception;

	public List<SignboardVO> getSbdAreaInfo(SignboardVO sbdVO) throws Exception;
	
	public List<SignboardVO> getSbdEquipGroupInfo() throws Exception;
	
	public List<SignboardVO> getSbdEquipInfo(SignboardVO sbdVO) throws Exception;
	
	public List<SignboardVO> getSbdOptionList() throws Exception;

	public List<SignboardVO> getSbdMsgList() throws Exception;

	public void actionSbdSend(SignboardVO sbdVO) throws Exception;

	public void actionChangeMsg(SignboardVO sbdVO) throws Exception;

	public List<SignboardVO> getSignList() throws Exception;

	public void actionChangeSbd(SignboardVO sbdVO) throws Exception;

	public List<SignboardVO> actionSbdRpt(SignboardVO sbdVO) throws Exception;





	
}