package egovframework.divas.dtm.service.impl;

import java.util.List;

import org.egovframe.rte.psl.dataaccess.EgovAbstractMapper;

import org.springframework.stereotype.Repository;

import egovframework.divas.com.service.AWSVO;
import egovframework.divas.com.service.RainVO;
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
     * 풍향 각도를 한국어 방향 문자열로 변환
     * @param degree 풍향 각도
     * @return 한국어 방향 문자열
     */
    public String getDegreeString(Double degree) {
        
        if (degree == null || degree == -99999) {
            return "-";
        }
        
        try {
            double degreeValue = degree;
            int tmpDegree = (int) (((degreeValue / 100) + 3) / 22.5);
            int num = tmpDegree % 16;
            
            switch (num) {
                case 0: return "북";
                case 1: return "북북동";
                case 2: return "북동";
                case 3: return "동북동";
                case 4: return "동";
                case 5: return "동남동";
                case 6: return "남동";
                case 7: return "남남동";
                case 8: return "남";
                case 9: return "남남서";
                case 10: return "남서";
                case 11: return "서남서";
                case 12: return "서";
                case 13: return "서북서";
                case 14: return "북서";
                case 15: return "북북서";
                default: return "-";
            }
        } catch (NumberFormatException e) {
            return "-";
        }
    }

	/**
	 * aws 전체 시간 데이터
	 * @param String area_code
	 * @exception Exception
	 */
	public List<AWSVO> getAWSRpt(RtuVO rtuVO) throws Exception {
		List<AWSVO> resultList = (List<AWSVO>)list("dtmAWSDAO.getRainRpt", rtuVO);
		List<AWSVO> tmpList = (List<AWSVO>)list("dtmAWSDAO.getTempRpt", rtuVO);
		resultList.addAll(0, tmpList);
		tmpList = (List<AWSVO>)list("dtmAWSDAO.getHumiRpt", rtuVO);
		resultList.addAll(0, tmpList);
//		tmpList = (List<AWSVO>)list("dtmAWSDAO.getAtmoRpt", rtuVO);
//		resultList.addAll(0, tmpList);
		tmpList = (List<AWSVO>)list("dtmAWSDAO.getWindRpt", rtuVO);
		for (AWSVO aws : tmpList) {
            String deg = getDegreeString(aws.getAvr_deg());
            aws.setWind_deg(deg);
            String deg_max = getDegreeString(aws.getMax_deg());
            aws.setWind_max_deg(deg_max);
        }
		resultList.addAll(0, tmpList);
//		tmpList = (List<AWSVO>)list("dtmAWSDAO.getTempRpt", rtuVO);
//		resultList.addAll(0, tmpList);
//		tmpList = (List<AWSVO>)list("dtmAWSDAO.getRainRpt", rtuVO);
//		resultList.addAll(0, tmpList);
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
		for (AWSVO aws : resultList) {
            String deg = getDegreeString(aws.getAvr_deg());
            aws.setWind_deg(deg);
            String deg_max = getDegreeString(aws.getMax_deg());
            aws.setWind_max_deg(deg_max);
        }
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

	public List<RainVO> getRptAWS10m(RtuVO rtuVO) {
		return (List<RainVO>)list("dtmAWSDAO.getAWS10m", rtuVO);
	}
	
	


}
