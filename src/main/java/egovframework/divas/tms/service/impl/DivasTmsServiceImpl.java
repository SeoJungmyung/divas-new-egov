package egovframework.divas.tms.service.impl;

import egovframework.com.cmm.web.EgovComUtlController;
import egovframework.divas.com.service.BroadcastVO;
import egovframework.divas.com.service.EventVO;
import egovframework.divas.com.service.RtuVO;
import egovframework.divas.com.service.SearchVO;
import egovframework.divas.tms.service.AWSVO;
import egovframework.divas.tms.service.DivasTmsService;
import egovframework.divas.tms.service.FlowVO;
import egovframework.divas.tms.service.RainVO;
import egovframework.divas.tms.service.SnowVO;

import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

/**
 * 각 현황들 화면을 구현하는 비즈니스 클래스
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
@Service("DivasTmsService")
public class DivasTmsServiceImpl extends EgovAbstractServiceImpl implements DivasTmsService{
	
	@Resource(name = "RtuInfo")
	private RtuInfoDAO rtuInfo;

	@Resource(name = "tmsRainDAO")
	private TmsRainDAO tmsRainDAO;
	
	@Resource(name = "tmsFlowDAO")
	private TmsFlowDAO tmsFlowDAO;
	
	@Resource(name = "tmsAWSDAO")
	private TmsAWSDAO tmsAWSDAO;
	
	@Resource(name = "tmsSnowDAO")
	private TmsSnowDAO tmsSnowDAO;
	
	@Resource(name = "broadcastDAO")
	private BroadcastDAO broadcastDAO;

	private static final Logger LOGGER = LoggerFactory.getLogger(EgovComUtlController.class);
	
	@Override
	public List<RainVO> actionTmsRain(RtuVO rtuVO) throws Exception {
		
		List<RtuVO> rtuList = rtuInfo.rtuList(rtuVO);
		List<RainVO> result = new ArrayList<RainVO>();			
		for (RtuVO CRtuVO : rtuList) {
//			System.out.println(resultRainVO.getAreaCode());
			RainVO rainVO = new RainVO();
			rainVO.setArea_code(CRtuVO.getAreaCode());
			rainVO.setRtu_name(CRtuVO.getRtuName());
			
			if(tmsRainDAO.getRainMValue(CRtuVO.getAreaCode()) != null){
				rainVO.setRain_m(tmsRainDAO.getRainMValue(CRtuVO.getAreaCode()).getRain());				
			}else{
				rainVO.setRain_m((double)-99999);								
			}
			if(tmsRainDAO.getRainHValue(CRtuVO.getAreaCode()) != null){
				rainVO.setRain_h(tmsRainDAO.getRainHValue(CRtuVO.getAreaCode()).getRain());
			}else{
				rainVO.setRain_h((double) -99999);								
			}
			if(tmsRainDAO.getRainBHValue(CRtuVO.getAreaCode()) != null){
				rainVO.setRain_bh(tmsRainDAO.getRainBHValue(CRtuVO.getAreaCode()).getRain());
			}else{
				rainVO.setRain_bh((double) -99999);								
			}
			if(tmsRainDAO.getRainDValue(CRtuVO.getAreaCode()) != null){
				rainVO.setRain_d(tmsRainDAO.getRainDValue(CRtuVO.getAreaCode()).getRain());
			}else{
				rainVO.setRain_d((double) -99999);								
			}
			if(tmsRainDAO.getRainBDValue(CRtuVO.getAreaCode()) != null){
				rainVO.setRain_bd(tmsRainDAO.getRainBDValue(CRtuVO.getAreaCode()).getRain());
			}else{
				rainVO.setRain_bd((double) -99999);								
			}
			if(tmsRainDAO.getRainNValue(CRtuVO.getAreaCode()) != null){
				rainVO.setRain_n(tmsRainDAO.getRainNValue(CRtuVO.getAreaCode()).getRain());
			}else{
				rainVO.setRain_n((double) -99999);								
			}
			if(tmsRainDAO.getRainYValue(CRtuVO.getAreaCode()) != null){
				rainVO.setRain_y(tmsRainDAO.getRainYValue(CRtuVO.getAreaCode()).getRain());
			}else{
				rainVO.setRain_y((double) -99999);								
			}
			
			result.add(rainVO);
		}
		return result;
	}

	@Override
	public List<FlowVO> actionTmsFlow(RtuVO rtuVO) throws Exception {
		
		List<RtuVO> rtuList = rtuInfo.rtuList(rtuVO);
		List<FlowVO> result = new ArrayList<FlowVO>();			
		for (RtuVO CRtuVO : rtuList) {
			
			FlowVO flowVO = new FlowVO();
			flowVO.setArea_code(CRtuVO.getAreaCode());
			flowVO.setRtu_name(CRtuVO.getRtuName());
			
			if(tmsFlowDAO.getFlowMValue(CRtuVO.getAreaCode()) != null){
				flowVO.setFlow_m(tmsFlowDAO.getFlowMValue(CRtuVO.getAreaCode()).getFlow());				
			}else{
				flowVO.setFlow_m((double)-99999);								
			}
			if(tmsFlowDAO.getFlowHValue(CRtuVO.getAreaCode()) != null){
				flowVO.setFlow_h(tmsFlowDAO.getFlowHValue(CRtuVO.getAreaCode()).getFlow());
			}else{
				flowVO.setFlow_h((double) -99999);								
			}
			if(tmsFlowDAO.getFlowBHValue(CRtuVO.getAreaCode()) != null){
				flowVO.setFlow_bh(tmsFlowDAO.getFlowBHValue(CRtuVO.getAreaCode()).getFlow());
			}else{
				flowVO.setFlow_bh((double) -99999);								
			}
			if(tmsFlowDAO.getFlowDValue(CRtuVO.getAreaCode()) != null){
				flowVO.setFlow_d(tmsFlowDAO.getFlowDValue(CRtuVO.getAreaCode()).getFlow());
			}else{
				flowVO.setFlow_d((double) -99999);								
			}
			if(tmsFlowDAO.getFlowBDValue(CRtuVO.getAreaCode()) != null){
				flowVO.setFlow_bd(tmsFlowDAO.getFlowBDValue(CRtuVO.getAreaCode()).getFlow());
			}else{
				flowVO.setFlow_bd((double) -99999);								
			}
			if(tmsFlowDAO.getFlowNValue(CRtuVO.getAreaCode()) != null){
				flowVO.setFlow_n(tmsFlowDAO.getFlowNValue(CRtuVO.getAreaCode()).getFlow());
			}else{
				flowVO.setFlow_n((double) -99999);								
			}
			if(tmsFlowDAO.getFlowYValue(CRtuVO.getAreaCode()) != null){
				flowVO.setFlow_y(tmsFlowDAO.getFlowYValue(CRtuVO.getAreaCode()).getFlow());
			}else{
				flowVO.setFlow_y((double) -99999);								
			}
			
			result.add(flowVO);
		}
		return result;
	}

	@Override
	public List<AWSVO> actionTmsAWS(RtuVO rtuVO) throws Exception {
		
		List<RtuVO> rtuList = rtuInfo.rtuList(rtuVO);
		List<AWSVO> result = new ArrayList<AWSVO>();			
		for (RtuVO CRtuVO : rtuList) {
			AWSVO awsVO = new AWSVO();
			awsVO.setArea_code(CRtuVO.getAreaCode());
			awsVO.setRtu_name(CRtuVO.getRtuName());
			
			if(tmsAWSDAO.getRainHValue(CRtuVO.getAreaCode()) != null){
				awsVO.setRain_h(tmsAWSDAO.getRainHValue(CRtuVO.getAreaCode()).getRain());
			}else{
				awsVO.setRain_h((double) -99999);								
			}
			if(tmsAWSDAO.getRainDValue(CRtuVO.getAreaCode()) != null){
				awsVO.setRain_d(tmsAWSDAO.getRainDValue(CRtuVO.getAreaCode()).getRain());
			}else{
				awsVO.setRain_d((double) -99999);								
			}
			if(tmsAWSDAO.getTempMValue(CRtuVO.getAreaCode()) != null){
				awsVO.setTemp(tmsAWSDAO.getTempMValue(CRtuVO.getAreaCode()).getTemp());
			}else{
				awsVO.setTemp((double) -99999);								
			}
			if(tmsAWSDAO.getTempDValue(CRtuVO.getAreaCode()) != null){
				awsVO.setTemp_max(tmsAWSDAO.getTempDValue(CRtuVO.getAreaCode()).getTemp_max());
				awsVO.setTemp_min(tmsAWSDAO.getTempDValue(CRtuVO.getAreaCode()).getTemp_min());
			}else{
				awsVO.setTemp_max((double) -99999);								
				awsVO.setTemp_min((double) -99999);								
			}
			if(tmsAWSDAO.getWindMValue(CRtuVO.getAreaCode()) != null){
				awsVO.setWind_vel(tmsAWSDAO.getWindMValue(CRtuVO.getAreaCode()).getWind_vel());
				awsVO.setWind_deg(tmsAWSDAO.getWindMValue(CRtuVO.getAreaCode()).getWind_deg());
			}else{
				awsVO.setWind_vel((double) -99999);								
				awsVO.setWind_deg((double) -99999);								
			}
			if(tmsAWSDAO.getWindDValue(CRtuVO.getAreaCode()) != null){
				awsVO.setWind_max_vel(tmsAWSDAO.getWindDValue(CRtuVO.getAreaCode()).getWind_max_vel());
				awsVO.setWind_max_deg(tmsAWSDAO.getWindDValue(CRtuVO.getAreaCode()).getWind_max_deg());
			}else{
				awsVO.setWind_max_vel((double) -99999);								
				awsVO.setWind_max_deg((double) -99999);								
			}
			if(tmsAWSDAO.getHumiMValue(CRtuVO.getAreaCode()) != null){
				awsVO.setHumi(tmsAWSDAO.getHumiMValue(CRtuVO.getAreaCode()).getHumi());
			}else{
				awsVO.setHumi((double) -99999);								
			}
			if(tmsAWSDAO.getHumiDValue(CRtuVO.getAreaCode()) != null){
				awsVO.setHumi_max(tmsAWSDAO.getHumiDValue(CRtuVO.getAreaCode()).getHumi_max());
				awsVO.setHumi_min(tmsAWSDAO.getHumiDValue(CRtuVO.getAreaCode()).getHumi_min());
			}else{
				awsVO.setHumi_max((double) -99999);								
				awsVO.setHumi_min((double) -99999);								
			}
			
			result.add(awsVO);
		}
		return result;
	}

	@Override
	public List<SnowVO> actionTmsSnow(RtuVO rtuVO) throws Exception {
		
		List<RtuVO> rtuList = rtuInfo.rtuList(rtuVO);
		List<SnowVO> result = new ArrayList<SnowVO>();			
		for (RtuVO CRtuVO : rtuList) {
			SnowVO snowVO = new SnowVO();
			snowVO.setArea_code(CRtuVO.getAreaCode());
			snowVO.setRtu_name(CRtuVO.getRtuName());
			
			if(tmsSnowDAO.getSnowMValue(CRtuVO.getAreaCode()) != null){
				snowVO.setSnow_m(tmsSnowDAO.getSnowMValue(CRtuVO.getAreaCode()).getSnow());				
			}else{
				snowVO.setSnow_m((double)-99999);								
			}
			if(tmsSnowDAO.getSnowDValue(CRtuVO.getAreaCode()) != null){
				snowVO.setSnow_d(tmsSnowDAO.getSnowDValue(CRtuVO.getAreaCode()).getSnow());
			}else{
				snowVO.setSnow_d((double) -99999);								
			}
			if(tmsSnowDAO.getSnowDMaxValue(CRtuVO.getAreaCode()) != null){
				snowVO.setSnow_d_max(tmsSnowDAO.getSnowDMaxValue(CRtuVO.getAreaCode()).getSnow());
			}else{
				snowVO.setSnow_d_max((double) -99999);								
			}
			if(tmsSnowDAO.getSnowBDValue(CRtuVO.getAreaCode()) != null){
				snowVO.setSnow_bd(tmsSnowDAO.getSnowBDValue(CRtuVO.getAreaCode()).getSnow());
			}else{
				snowVO.setSnow_bd((double) -99999);								
			}
			if(tmsSnowDAO.getSnowBBDValue(CRtuVO.getAreaCode()) != null){
				snowVO.setSnow_bbd(tmsSnowDAO.getSnowBBDValue(CRtuVO.getAreaCode()).getSnow());
			}else{
				snowVO.setSnow_bbd((double) -99999);								
			}
			// 금일 신적설
			if(snowVO.getSnow_d_max() != -99999 && snowVO.getSnow_bd() != -99999) {
				if(snowVO.getSnow_d_max() - snowVO.getSnow_bd() > 0) {
					snowVO.setSnow_d_new(snowVO.getSnow_d_max() - snowVO.getSnow_bd());
				}else {
					snowVO.setSnow_d_new((double) 0);
				}
			}else {
				snowVO.setSnow_d_new((double) 0);
			}
			// 전일 신적설
			if(snowVO.getSnow_bbd() != -99999 && snowVO.getSnow_bd() != -99999) {
				if(snowVO.getSnow_bd() - snowVO.getSnow_bbd() > 0) {
					snowVO.setSnow_bd_new(snowVO.getSnow_bd() - snowVO.getSnow_bbd());
				}else {
					snowVO.setSnow_bd_new((double) 0);
				}
			}else {
				snowVO.setSnow_bd_new((double) 0);
			}
			
			result.add(snowVO);
		}
		return result;
	}

	@Override
	public List<BroadcastVO> actionTmsBroadcast(SearchVO searchVO) throws Exception {
		List<BroadcastVO> broadcastList = broadcastDAO.getBroadcastList(searchVO);
		return broadcastList;
	}

	@Override
	public List<EventVO> actionTmsEventGroup(SearchVO searchVO) throws Exception {
		List<EventVO> eventList = broadcastDAO.getEventGroupList(searchVO);
		return eventList;
	}

	@Override
	public List<EventVO> actionTmsEvent(SearchVO searchVO) throws Exception {
		List<EventVO> eventList = broadcastDAO.getEventList(searchVO);
		return eventList;
	}

	@Override
	public List<RtuVO> actionTmsRtuState(RtuVO rtuVO) throws Exception {
		List<RtuVO> rtuStateList = rtuInfo.getRtuStateList(rtuVO);
		return rtuStateList;
	}

	
	
}