package egovframework.divas.map.service.impl;

import java.util.List;

import org.egovframe.rte.psl.dataaccess.EgovAbstractMapper;
import org.springframework.stereotype.Repository;

import egovframework.divas.map.service.MapinfoVO;
import egovframework.divas.map.service.MapsettingVO;
import egovframework.divas.map.service.MapRtuVO;
import egovframework.divas.map.service.MapRainDataVO;
import egovframework.divas.map.service.MapRtuSensorVO;
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
@Repository("mapDAO")
public class MapDAO extends EgovAbstractMapper {
	/**
	 * 10분 강우량
	 * @param String area_code
	 * @exception Exception
	 */
	public MapsettingVO getWrMapSetting() throws Exception {
		return (MapsettingVO)selectOne("mapDAO.getWrMapSetting");
	}
	public List<MapinfoVO> getWrMapInfo() throws Exception {
		return (List<MapinfoVO>)list("mapDAO.getWrMapInfo", null);
	}
	public List<MapRtuVO> getWrRtu() throws Exception {
		return (List<MapRtuVO>)list("mapDAO.getWrMapRtu", null);
	}
	public List<MapRtuSensorVO> getWrRtuSensor() throws Exception {
		return (List<MapRtuSensorVO>)list("mapDAO.getWrMapRtuSensor", null);
	}
	
	public MapRainDataVO getWrMapRainData(String area_code) throws Exception {
		return (MapRainDataVO)selectOne("mapDAO.getWrMapRainData", area_code);
	}
	public void setOverLevel(MapsettingVO mapSettingVO) throws Exception {
		update("mapDAO.setOverLevel", mapSettingVO);
	}
	public void setMapMove(MapsettingVO mapSettingVO) throws Exception {
		update("mapDAO.setMapMove", mapSettingVO);
	}
}
