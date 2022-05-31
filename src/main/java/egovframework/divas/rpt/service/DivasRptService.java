package egovframework.divas.rpt.service;


import java.util.List;
import java.util.Map;

import egovframework.divas.com.service.AWSVO;
import egovframework.divas.com.service.BroadcastVO;
import egovframework.divas.com.service.FlowVO;
import egovframework.divas.com.service.RainVO;
import egovframework.divas.com.service.RtuVO;
import egovframework.divas.com.service.SearchVO;
import egovframework.divas.com.service.SnowVO;
import egovframework.divas.com.service.StatisticsVO;

/**
 * 각 보고서를 조회하는 비즈니스 구현 클래스
 * @author 화진티엔아이 기술연구소 서정명
 * @since 2022.05.19
 * @version 1.0
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      수정자          수정내용
 *  -------    --------    ---------------------------
 *  2022.05.19  서정명          최초 생성
 *
 *  </pre>
 */
public interface DivasRptService {

	/**
	 * 각 보고서들을 불러온다
	 * @return VO
	 *
	 * @exception Exception Exception
	 */
	public BroadcastVO getBroadcastDetail(SearchVO searchVO) throws Exception;
	
	public List<BroadcastVO> getBroadcastState(SearchVO searchVO) throws Exception;

	public List<StatisticsVO> getBroadcastCnt(SearchVO searchVO) throws Exception;

	
}