package egovframework.divas.set.service.impl;

import java.util.List;

import org.egovframe.rte.psl.dataaccess.EgovAbstractMapper;
import org.springframework.stereotype.Repository;

import egovframework.divas.com.service.CommonVO;
import egovframework.divas.com.service.LeftMenuVO;
import egovframework.divas.com.service.RtuVO;
import egovframework.divas.set.service.AreaInfoVO;
import egovframework.divas.set.service.OrganInfoVO;
import egovframework.divas.set.service.UserInfoVO;

/**
 * AWS 현황 조회를 처리
 * @author 서정명
 * @since 2022.04.13
 * @version 1.0
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      수정자          수정내용
 *  -------    --------    ---------------------------
 *  2022.04.13  서정명          최초 생성
 *
 *  </pre>
 */
@Repository("settingDAO")
public class SettingDAO extends EgovAbstractMapper {

	public List<UserInfoVO> getUserList(UserInfoVO userVO) {
		return (List<UserInfoVO>)list("settingDAO.getUserList", userVO);
	}

	public List<OrganInfoVO> getOrganList(OrganInfoVO organVO) throws Exception {
		return (List<OrganInfoVO>)list("settingDAO.getOrganList", organVO);
	}

	public List<UserInfoVO> getRightView() throws Exception {
		return (List<UserInfoVO>)list("settingDAO.getRightView", null);
	}

	public Integer getUserDupCheck(UserInfoVO userVO) throws Exception {
		return selectOne("settingDAO.getUserDupCheck", userVO);
	}

	public void setUserIn(UserInfoVO userVO) throws Exception {
		insert("settingDAO.setUserIn", userVO);
	}

	public void setUserUp(UserInfoVO userVO) throws Exception {
		update("settingDAO.setUserUp", userVO);
	}

	public void setUserDe(UserInfoVO userVO) throws Exception {
		delete("settingDAO.setUserDe", userVO);
	}

	public List<AreaInfoVO> getAreaInfo(AreaInfoVO areaVO) throws Exception {
		return (List<AreaInfoVO>)list("settingDAO.getAreaInfo", areaVO);
	}

	public Integer getAreaTotal() throws Exception {
		return selectOne("settingDAO.getAreaTotal", null);
	}
	
	public Integer getAreaCnt(AreaInfoVO areaVO) throws Exception {
		return selectOne("settingDAO.getAreaCnt", areaVO);
	}

	public void setOrganIn(OrganInfoVO organVO) {
		insert("settingDAO.setOrganIn", organVO);
	}

	public void setOrganUp(OrganInfoVO organVO) {
		update("settingDAO.setOrganUp", organVO);
	}

	public void setOrganDe(OrganInfoVO organVO) {
		delete("settingDAO.setOrganDe", organVO);
	}

	public List<RtuVO> getEquipList(RtuVO rtuVO) {
		return (List<RtuVO>)list("settingDAO.getEquipList", rtuVO);
	}
	
	public void setSetting(CommonVO commonVO) {
		update("settingDAO.setSetting", commonVO);
	}

	public void setMenuLevel(LeftMenuVO menuVO) {
		update("settingDAO.setMenuLevel", menuVO);
	}

	public void setRightDe(UserInfoVO userVO) {
		delete("settingDAO.setRightDe", userVO);
	}

	public void setRightIn(UserInfoVO userVO) {
		insert("settingDAO.setRightIn", userVO);
	}
	


}
