package egovframework.divas.map.service.impl;

import egovframework.com.cmm.web.EgovComUtlController;
import egovframework.divas.com.service.RtuVO;
import egovframework.divas.map.service.DivasMapService;
import egovframework.divas.map.service.MapRainDataVO;
import egovframework.divas.map.service.MapinfoVO;
import egovframework.divas.map.service.MapsettingVO;
import egovframework.divas.map.service.MapRtuVO;
import egovframework.divas.map.service.MapRtuSensorVO;

import egovframework.let.utl.fcc.service.EgovNumberUtil;
import egovframework.let.utl.fcc.service.EgovStringUtil;
import egovframework.let.utl.sim.service.EgovFileScrty;

import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

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
@Service("DivasMapService")
public class DivasMapServiceImpl extends EgovAbstractServiceImpl implements DivasMapService{

	@Resource(name = "mapDAO")
	private MapDAO mapDAO;

	private static final Logger LOGGER = LoggerFactory.getLogger(EgovComUtlController.class);
	

	@Override
	public MapsettingVO actionMapLoad() throws Exception {
		MapsettingVO wr_map_setting = new MapsettingVO();
		
		wr_map_setting = mapDAO.getWrMapSetting();
		System.out.println(wr_map_setting.getSetval());
		System.out.println("맵셋팅-----------");
		
		// TODO Auto-generated method stub
		return wr_map_setting;
	}
	@Override
	public List<MapinfoVO> actionMapInfo() throws Exception {
		List<MapinfoVO> wr_map_info = new ArrayList<MapinfoVO>();
		
		wr_map_info = mapDAO.getWrMapInfo();
		System.out.println(wr_map_info);
		System.out.println("맵인포-----------");
		
		// TODO Auto-generated method stub
		return wr_map_info;
	}
	@Override
	public List<MapRtuVO> actionMapRtu() throws Exception {
		List<MapRtuVO> wr_map_rtu = new ArrayList<MapRtuVO>();
		
		wr_map_rtu = mapDAO.getWrRtu();
		System.out.println(wr_map_rtu);
		System.out.println("맵RTU-----------");
		
		// TODO Auto-generated method stub
		return wr_map_rtu;
	}
	@Override
	public List<MapRtuSensorVO> actionMapRtuSensor() throws Exception {
		List<MapRtuSensorVO> wr_map_rtu_sensor = new ArrayList<MapRtuSensorVO>();
		
		wr_map_rtu_sensor = mapDAO.getWrRtuSensor();
		System.out.println(wr_map_rtu_sensor);
		System.out.println("맵RTU 센서 -----------");
		
		// TODO Auto-generated method stub
		return wr_map_rtu_sensor;
	}
	
	@Override
	public List<MapRainDataVO> actionRainData(MapRainDataVO MapRainDataVO) throws Exception {
		List<MapRainDataVO> wr_map_rain_data = new ArrayList<MapRainDataVO>();
		
		for(String area_code : MapRainDataVO.getRain_area_code()){
			MapRainDataVO ResultVO = new MapRainDataVO();
			if(mapDAO.getWrMapRainData(area_code) != null) {				
				ResultVO = mapDAO.getWrMapRainData(area_code);
			}
			ResultVO.setArea_code(area_code);
			wr_map_rain_data.add(ResultVO);
		}
		System.out.println(wr_map_rain_data);
		System.out.println("강우 장비 DATA-----------");
		
		// TODO Auto-generated method stub
		return wr_map_rain_data;
	}
	

	
}