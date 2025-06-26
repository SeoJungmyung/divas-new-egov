package egovframework.divas.set.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;

import egovframework.divas.com.service.CommonVO;
import egovframework.divas.com.service.LeftMenuVO;
import egovframework.divas.com.service.RtuSensorVO;
import egovframework.divas.com.service.RtuVO;
import egovframework.divas.set.service.AreaInfoVO;
import egovframework.divas.set.service.DivasSetService;
import egovframework.divas.set.service.OrganInfoVO;
import egovframework.divas.set.service.UserInfoVO;

/**
 * 각 보고서 화면을 구현하는 비즈니스 클래스
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
@Service("DivasSetService")
public class DivasSetServiceImpl extends EgovAbstractServiceImpl implements DivasSetService{
	
	@Resource(name = "settingDAO")
	private SettingDAO settingDAO;

	@Override
	public List<UserInfoVO> setUser(UserInfoVO userVO) throws Exception {
		return settingDAO.getUserList(userVO);
	}

	@Override
	public List<OrganInfoVO> setOrgan(OrganInfoVO organVO) throws Exception {
		return settingDAO.getOrganList(organVO);
	}

	@Override
	public List<UserInfoVO> setUserRight() throws Exception {
		return settingDAO.getRightView();
	}

	@Override
	public Boolean actionIdCheck(UserInfoVO userVO) throws Exception {
		Integer cnt = settingDAO.getUserDupCheck(userVO);
		Boolean result = cnt == 0 ? true : false;
		return result;
	}

	@Override
	public void actionChangeUser(UserInfoVO userVO) throws Exception {
		
		if(userVO.getChange_mode().equals("insert")) {
			settingDAO.setUserIn(userVO);
			settingDAO.setRightDe(userVO);
			settingDAO.setRightIn(userVO);
		}else if(userVO.getChange_mode().equals("update")) {
			settingDAO.setUserUp(userVO);
			settingDAO.setRightDe(userVO);
			settingDAO.setRightIn(userVO);
		}else if(userVO.getChange_mode().equals("delete")) {
			settingDAO.setUserDe(userVO);
			settingDAO.setRightDe(userVO);
		}else {
			// 경고
		}
	}

	@Override
	public List<AreaInfoVO> getAreaInfo(AreaInfoVO areaVO) throws Exception {
		List<AreaInfoVO> areaList = settingDAO.getAreaInfo(areaVO);
		areaList.get(0).setAreaTotal(settingDAO.getAreaTotal());
		areaList.get(0).setAreaCnt(settingDAO.getAreaCnt(areaVO));
		return areaList;
	}

	@Override
	public void actionChangeOrgan(OrganInfoVO organVO) throws Exception {

		if(organVO.getChange_mode().equals("insert")) {
			settingDAO.setOrganIn(organVO);
			// dn_setting 추가?
		}else if(organVO.getChange_mode().equals("update")) {
			settingDAO.setOrganUp(organVO);
		}else if(organVO.getChange_mode().equals("delete")) {
			settingDAO.setOrganDe(organVO);
		}else {
			// 경고
		}
	}

	@Override
	public List<RtuVO> setRtuList(RtuVO rtuVO) throws Exception {
		return settingDAO.getEquipList(rtuVO);
	}

	@Override
	public void setSetting(CommonVO commonVO) throws Exception {
		settingDAO.setSetting(commonVO);
	}

	@Override
	public void setMenuLevel(LeftMenuVO menuVO) throws Exception {
		settingDAO.setMenuLevel(menuVO);
	}

	@Override
	public Boolean actionAreaCodeCheck(RtuVO rtuVO) throws Exception {
		Integer cnt = settingDAO.getEquipDupCheck(rtuVO);
		Boolean result = cnt == 0 ? true : false;
		return result;
	}

	@Override
	public List<RtuVO> getModelList(RtuVO rtuVO) throws Exception {
		return settingDAO.getModelList(rtuVO);
	}

	@Override
	public List<RtuVO> getLineList(RtuVO rtuVO) throws Exception {
		return settingDAO.getLineList(rtuVO);
	}

	@Override
	public void actionChangeEquip(RtuVO rtuVO) throws Exception {

		if(rtuVO.getChange_mode().equals("insert")) {
			settingDAO.setEquipIn(rtuVO);
			// dn_setting 추가?
		}else if(rtuVO.getChange_mode().equals("update")) {
			settingDAO.setEquipUp(rtuVO);
		}else if(rtuVO.getChange_mode().equals("delete")) {
			settingDAO.setEquipDe(rtuVO);
		}else {
			// 경고
		}
	}

	@Override
	public List<RtuVO> getSensorInfo(RtuVO rtuVO) throws Exception {
		return settingDAO.getSensorInfo(rtuVO);
	}

	@Override
	public void saveSensorInfo(RtuVO rtuVO) throws Exception {
		int rtu_id = rtuVO.getRtu_id();
	    List<RtuSensorVO> sensorList = rtuVO.getSensorData();
	    
	    // 센서별로 처리
	    for(RtuSensorVO sensor : sensorList) {
	    	sensor.setRtu_id(rtu_id);
	        settingDAO.deleteSensorInfo(sensor);
	        settingDAO.saveSensorInfo(sensor);
	    }
	}
	
	
	
	
}