package egovframework.divas.abr.service;


import java.util.List;

import egovframework.divas.com.service.BroadcastVO;
import egovframework.divas.com.service.CommonVO;
import egovframework.divas.com.service.EventVO;
import egovframework.divas.com.service.RtuVO;
import egovframework.divas.com.service.SearchVO;

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
public interface DivasAbrService {

	/**
	 * 경보방송들을 불러온다
	 * @return VO
	 *
	 * @exception Exception Exception
	 */
	public List<RtuVO> actionBroadcastRtuList(CommonVO commonVO) throws Exception;

	public List<RtuVO> actionBroadcastRtuGroupList(CommonVO commonVO) throws Exception;

	public List<BroadcastVO> actionBroadcastScriptList(CommonVO commonVO) throws Exception;

	public void actionSetBroadcastLog(BroadcastVO brdVO) throws Exception;

	public void actionAbrScriptChange(BroadcastVO brdVO) throws Exception;

	public List<BroadcastVO> actionBroadcastPlan(CommonVO commonVO) throws Exception;

	public void actionAbrDateChange(BroadcastVO brdVO) throws Exception;

	public void actionAbrDateStateChange(BroadcastVO brdVO) throws Exception;


	
}