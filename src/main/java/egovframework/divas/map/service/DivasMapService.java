package egovframework.divas.map.service;


import java.util.List;

//import egovframework.divas.com.service.RtuVO;
import egovframework.divas.map.service.MapsettingVO;
import egovframework.divas.map.service.MapinfoVO;
import egovframework.divas.map.service.MapRtuVO;
import egovframework.divas.map.service.MapRtuSensorVO;
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
public interface DivasMapService {

	/**
	 * 지도를 불러온다
	 * @return MapVO
	 *
	 * @exception Exception Exception
	 */
	
	public MapsettingVO actionMapLoad() throws Exception;
	public List<MapinfoVO> actionMapInfo() throws Exception;
	public List<MapRtuVO> actionMapRtu() throws Exception;
	public List<MapRtuSensorVO> actionMapRtuSensor() throws Exception;
	public List<MapRainDataVO> actionRainData(MapRainDataVO MapRainDataVO) throws Exception;
	public void setOverLevel(MapsettingVO mapSettingVO) throws Exception;
	public void setMapMove(MapsettingVO mapSettingVO) throws Exception;
	public void setCenterZoomSave(MapsettingVO mapSettingVO) throws Exception;
	public void setTopTextSave(MapsettingVO mapSettingVO) throws Exception;
}