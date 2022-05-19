package egovframework.divas.dtm.service.impl;

import java.util.List;

import org.egovframe.rte.psl.dataaccess.EgovAbstractMapper;

import org.springframework.stereotype.Repository;

import egovframework.divas.com.service.AWSVO;
import egovframework.divas.com.service.RtuVO;

/**
 * 일반 로그인을 처리하는 비즈니스 구현 클래스
 * @author 공통서비스 개발팀 박지욱
 * @since 2009.03.06
 * @version 1.0
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      수정자          수정내용
 *  -------    --------    ---------------------------
 *  2009.03.06  박지욱          최초 생성
 *  2011.08.31  JJY            경량환경 템플릿 커스터마이징버전 생성
 *
 *  </pre>
 */
@Repository("dtmAWSDAO")
public class DtmAWSDAO extends EgovAbstractMapper {

	/**
	 * 10분 강우량
	 * @param String area_code
	 * @exception Exception
	 */
	public List<AWSVO> getAWSRpt(RtuVO rtuVO) throws Exception {
		List<AWSVO> resultList = (List<AWSVO>)list("dtmAWSDAO.getSunsRpt", rtuVO);
		List<AWSVO> tmpList = (List<AWSVO>)list("dtmAWSDAO.getRadiRpt", rtuVO);
		resultList.addAll(0, tmpList);
		tmpList = (List<AWSVO>)list("dtmAWSDAO.getHumiRpt", rtuVO);
		resultList.addAll(0, tmpList);
		tmpList = (List<AWSVO>)list("dtmAWSDAO.getAtmoRpt", rtuVO);
		resultList.addAll(0, tmpList);
		tmpList = (List<AWSVO>)list("dtmAWSDAO.getWindRpt", rtuVO);
		resultList.addAll(0, tmpList);
		tmpList = (List<AWSVO>)list("dtmAWSDAO.getTempRpt", rtuVO);
		resultList.addAll(0, tmpList);
		tmpList = (List<AWSVO>)list("dtmAWSDAO.getRainRpt", rtuVO);
		resultList.addAll(0, tmpList);
		return resultList;
	}
	
	public List<AWSVO> getRainRpt(RtuVO rtuVO) throws Exception {
		List<AWSVO> resultList = (List<AWSVO>)list("dtmAWSDAO.getRainRpt", rtuVO);
		return resultList;
	}
	
	public List<AWSVO> getTempRpt(RtuVO rtuVO) throws Exception {
		List<AWSVO> resultList = (List<AWSVO>)list("dtmAWSDAO.getTempRpt", rtuVO);
		return resultList;
	}
	
	public List<AWSVO> getWindRpt(RtuVO rtuVO) throws Exception {
		List<AWSVO> resultList = (List<AWSVO>)list("dtmAWSDAO.getWindRpt", rtuVO);
		return resultList;
	}
	
	public List<AWSVO> getAtmoRpt(RtuVO rtuVO) throws Exception {
		List<AWSVO> resultList = (List<AWSVO>)list("dtmAWSDAO.getAtmoRpt", rtuVO);
		return resultList;
	}
	
	public List<AWSVO> getHumiRpt(RtuVO rtuVO) throws Exception {
		List<AWSVO> resultList = (List<AWSVO>)list("dtmAWSDAO.getHumiRpt", rtuVO);
		return resultList;
	}
	
	public List<AWSVO> getRadiRpt(RtuVO rtuVO) throws Exception {
		List<AWSVO> resultList = (List<AWSVO>)list("dtmAWSDAO.getRadiRpt", rtuVO);
		return resultList;
	}
	
	public List<AWSVO> getSunsRpt(RtuVO rtuVO) throws Exception {
		List<AWSVO> resultList = (List<AWSVO>)list("dtmAWSDAO.getSunsRpt", rtuVO);
		return resultList;
	}

	public int searchAWSData(RtuVO rtuVO) throws Exception {
		return selectOne("dtmAWSDAO.searchAWSData", rtuVO);
	}

	public void setAWSInsert(RtuVO rtuVO) throws Exception {
		update("dtmAWSDAO.setAWSInsert", rtuVO);
	}
	
	public void setAWSUpdate(RtuVO rtuVO) throws Exception {
		update("dtmAWSDAO.setAWSUpdate", rtuVO);
	}

	public Double getAWSSum(RtuVO rtuVO) throws Exception {
		return selectOne("dtmAWSDAO.getAWSSum", rtuVO);
	}
	
	


}
