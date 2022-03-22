package egovframework.divas.tms.service;


import java.util.List;

import egovframework.divas.com.service.RtuVO;

/**
 * 강우현황을 조회하는 비즈니스 구현 클래스
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
public interface DivasTmsService {

	/**
	 * 강우현황을 불러온다
	 * @return RainVO
	 *
	 * @exception Exception Exception
	 */
	public List<RainVO> actionTmsRain(RtuVO rtuVO) throws Exception;

	
}