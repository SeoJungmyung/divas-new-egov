package egovframework.divas.tms.service.impl;

import egovframework.com.cmm.web.EgovComUtlController;
import egovframework.divas.com.service.RtuVO;
import egovframework.divas.tms.service.DivasTmsService;
import egovframework.divas.tms.service.RainVO;
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
@Service("DivasTmsService")
public class DivasTmsServiceImpl extends EgovAbstractServiceImpl implements DivasTmsService{

	@Resource(name = "tmsDAO")
	private TmsDAO tmsDAO;

	private static final Logger LOGGER = LoggerFactory.getLogger(EgovComUtlController.class);
	
	@Override
	public List<RainVO> actionTmsRain(RtuVO rtuVO) throws Exception {
//		System.out.println("tmsService===============================");
//		RtuVO rtuVO = new RtuVO();
		
		//
		List<RtuVO> rtuList = tmsDAO.rtuRainList(rtuVO);
		List<RainVO> result = new ArrayList<RainVO>();			
		for (RtuVO CRtuVO : rtuList) {
//			System.out.println(resultRainVO.getAreaCode());
			RainVO rainVO = new RainVO();
			rainVO.setArea_code(CRtuVO.getAreaCode());
			rainVO.setRtu_name(CRtuVO.getRtuName());
			
			if(tmsDAO.getRainMValue(CRtuVO.getAreaCode()) != null){
				rainVO.setRain_m(tmsDAO.getRainMValue(CRtuVO.getAreaCode()).getRain());				
			}else{
				rainVO.setRain_m((double)-99999);								
			}
			if(tmsDAO.getRainHValue(CRtuVO.getAreaCode()) != null){
				rainVO.setRain_h(tmsDAO.getRainHValue(CRtuVO.getAreaCode()).getRain());
			}else{
				rainVO.setRain_h((double) -99999);								
			}
			if(tmsDAO.getRainBHValue(CRtuVO.getAreaCode()) != null){
				rainVO.setRain_bh(tmsDAO.getRainBHValue(CRtuVO.getAreaCode()).getRain());
			}else{
				rainVO.setRain_bh((double) -99999);								
			}
			if(tmsDAO.getRainDValue(CRtuVO.getAreaCode()) != null){
				rainVO.setRain_d(tmsDAO.getRainDValue(CRtuVO.getAreaCode()).getRain());
			}else{
				rainVO.setRain_d((double) -99999);								
			}
			if(tmsDAO.getRainBDValue(CRtuVO.getAreaCode()) != null){
				rainVO.setRain_bd(tmsDAO.getRainBDValue(CRtuVO.getAreaCode()).getRain());
			}else{
				rainVO.setRain_bd((double) -99999);								
			}
			if(tmsDAO.getRainNValue(CRtuVO.getAreaCode()) != null){
				rainVO.setRain_n(tmsDAO.getRainNValue(CRtuVO.getAreaCode()).getRain());
			}else{
				rainVO.setRain_n((double) -99999);								
			}
			if(tmsDAO.getRainYValue(CRtuVO.getAreaCode()) != null){
				rainVO.setRain_y(tmsDAO.getRainYValue(CRtuVO.getAreaCode()).getRain());
			}else{
				rainVO.setRain_y((double) -99999);								
			}
			
			result.add(rainVO);
		}
		return result;
	}

	
}