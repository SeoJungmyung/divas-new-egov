package egovframework.divas.tms.service.impl;

import egovframework.com.cmm.web.EgovComUtlController;
import egovframework.divas.com.service.AWSVO;
import egovframework.divas.com.service.BroadcastVO;
import egovframework.divas.com.service.EventVO;
import egovframework.divas.com.service.FlowVO;
import egovframework.divas.com.service.RainVO;
import egovframework.divas.com.service.RtuVO;
import egovframework.divas.com.service.SearchVO;
import egovframework.divas.com.service.SnowVO;
import egovframework.divas.com.service.impl.BroadcastDAO;
import egovframework.divas.com.service.impl.RtuInfoDAO;
import egovframework.divas.tms.service.DivasTmsService;

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
//			System.out.println(resultRainVO.getArea_code());
			RainVO rainVO = new RainVO();
			rainVO.setArea_code(CRtuVO.getArea_code());
			rainVO.setRtu_name(CRtuVO.getRtu_name());
			
			if(tmsRainDAO.getRainMValue(CRtuVO.getArea_code()) != null){
				rainVO.setRain_m(tmsRainDAO.getRainMValue(CRtuVO.getArea_code()).getRain());				
			}else{
				rainVO.setRain_m((double)-99999);								
			}
			if(tmsRainDAO.getRainHValue(CRtuVO.getArea_code()) != null){
				rainVO.setRain_h(tmsRainDAO.getRainHValue(CRtuVO.getArea_code()).getRain());
			}else{
				rainVO.setRain_h((double) -99999);								
			}
			if(tmsRainDAO.getRainBHValue(CRtuVO.getArea_code()) != null){
				rainVO.setRain_bh(tmsRainDAO.getRainBHValue(CRtuVO.getArea_code()).getRain());
			}else{
				rainVO.setRain_bh((double) -99999);								
			}
			if(tmsRainDAO.getRainDValue(CRtuVO.getArea_code()) != null){
				rainVO.setRain_d(tmsRainDAO.getRainDValue(CRtuVO.getArea_code()).getRain());
			}else{
				rainVO.setRain_d((double) -99999);								
			}
			if(tmsRainDAO.getRainBDValue(CRtuVO.getArea_code()) != null){
				rainVO.setRain_bd(tmsRainDAO.getRainBDValue(CRtuVO.getArea_code()).getRain());
			}else{
				rainVO.setRain_bd((double) -99999);								
			}
			if(tmsRainDAO.getRainNValue(CRtuVO.getArea_code()) != null){
				rainVO.setRain_n(tmsRainDAO.getRainNValue(CRtuVO.getArea_code()).getRain());
			}else{
				rainVO.setRain_n((double) -99999);								
			}
			if(tmsRainDAO.getRainYValue(CRtuVO.getArea_code()) != null){
				rainVO.setRain_y(tmsRainDAO.getRainYValue(CRtuVO.getArea_code()).getRain());
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
			flowVO.setArea_code(CRtuVO.getArea_code());
			flowVO.setRtu_name(CRtuVO.getRtu_name());
			
			if(tmsFlowDAO.getFlowMValue(CRtuVO.getArea_code()) != null){
				flowVO.setFlow_m(tmsFlowDAO.getFlowMValue(CRtuVO.getArea_code()).getFlow());				
			}else{
				flowVO.setFlow_m((double)-99999);								
			}
			if(tmsFlowDAO.getFlowHValue(CRtuVO.getArea_code()) != null){
				flowVO.setFlow_h(tmsFlowDAO.getFlowHValue(CRtuVO.getArea_code()).getFlow());
			}else{
				flowVO.setFlow_h((double) -99999);								
			}
			if(tmsFlowDAO.getFlowBHValue(CRtuVO.getArea_code()) != null){
				flowVO.setFlow_bh(tmsFlowDAO.getFlowBHValue(CRtuVO.getArea_code()).getFlow());
			}else{
				flowVO.setFlow_bh((double) -99999);								
			}
			if(tmsFlowDAO.getFlowDValue(CRtuVO.getArea_code()) != null){
				flowVO.setFlow_d(tmsFlowDAO.getFlowDValue(CRtuVO.getArea_code()).getFlow());
			}else{
				flowVO.setFlow_d((double) -99999);								
			}
			if(tmsFlowDAO.getFlowBDValue(CRtuVO.getArea_code()) != null){
				flowVO.setFlow_bd(tmsFlowDAO.getFlowBDValue(CRtuVO.getArea_code()).getFlow());
			}else{
				flowVO.setFlow_bd((double) -99999);								
			}
			if(tmsFlowDAO.getFlowNValue(CRtuVO.getArea_code()) != null){
				flowVO.setFlow_n(tmsFlowDAO.getFlowNValue(CRtuVO.getArea_code()).getFlow());
			}else{
				flowVO.setFlow_n((double) -99999);								
			}
			if(tmsFlowDAO.getFlowYValue(CRtuVO.getArea_code()) != null){
				flowVO.setFlow_y(tmsFlowDAO.getFlowYValue(CRtuVO.getArea_code()).getFlow());
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
			awsVO.setArea_code(CRtuVO.getArea_code());
			awsVO.setRtu_name(CRtuVO.getRtu_name());
			
			if(tmsAWSDAO.getRainHValue(CRtuVO.getArea_code()) != null){
				awsVO.setRain_h(tmsAWSDAO.getRainHValue(CRtuVO.getArea_code()).getRain());
			}else{
				awsVO.setRain_h((double) -99999);								
			}
			if(tmsAWSDAO.getRainDValue(CRtuVO.getArea_code()) != null){
				awsVO.setRain_d(tmsAWSDAO.getRainDValue(CRtuVO.getArea_code()).getRain());
			}else{
				awsVO.setRain_d((double) -99999);								
			}
			if(tmsAWSDAO.getTempMValue(CRtuVO.getArea_code()) != null){
				awsVO.setTemp(tmsAWSDAO.getTempMValue(CRtuVO.getArea_code()).getTemp());
			}else{
				awsVO.setTemp((double) -99999);								
			}
			if(tmsAWSDAO.getTempDValue(CRtuVO.getArea_code()) != null){
				awsVO.setTemp_max(tmsAWSDAO.getTempDValue(CRtuVO.getArea_code()).getTemp_max());
				awsVO.setTemp_min(tmsAWSDAO.getTempDValue(CRtuVO.getArea_code()).getTemp_min());
			}else{
				awsVO.setTemp_max((double) -99999);								
				awsVO.setTemp_min((double) -99999);								
			}
			if(tmsAWSDAO.getWindMValue(CRtuVO.getArea_code()) != null){
				awsVO.setWind_vel(tmsAWSDAO.getWindMValue(CRtuVO.getArea_code()).getWind_vel());
				awsVO.setWind_deg(tmsAWSDAO.getWindMValue(CRtuVO.getArea_code()).getWind_deg());
			}else{
				awsVO.setWind_vel((double) -99999);								
				awsVO.setWind_deg((double) -99999);								
			}
			if(tmsAWSDAO.getWindDValue(CRtuVO.getArea_code()) != null){
				awsVO.setWind_max_vel(tmsAWSDAO.getWindDValue(CRtuVO.getArea_code()).getWind_max_vel());
				awsVO.setWind_max_deg(tmsAWSDAO.getWindDValue(CRtuVO.getArea_code()).getWind_max_deg());
			}else{
				awsVO.setWind_max_vel((double) -99999);								
				awsVO.setWind_max_deg((double) -99999);								
			}
			if(tmsAWSDAO.getHumiMValue(CRtuVO.getArea_code()) != null){
				awsVO.setHumi(tmsAWSDAO.getHumiMValue(CRtuVO.getArea_code()).getHumi());
			}else{
				awsVO.setHumi((double) -99999);								
			}
			if(tmsAWSDAO.getHumiDValue(CRtuVO.getArea_code()) != null){
				awsVO.setHumi_max(tmsAWSDAO.getHumiDValue(CRtuVO.getArea_code()).getHumi_max());
				awsVO.setHumi_min(tmsAWSDAO.getHumiDValue(CRtuVO.getArea_code()).getHumi_min());
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
			snowVO.setArea_code(CRtuVO.getArea_code());
			snowVO.setRtu_name(CRtuVO.getRtu_name());
			
			if(tmsSnowDAO.getSnowMValue(CRtuVO.getArea_code()) != null){
				snowVO.setSnow_m(tmsSnowDAO.getSnowMValue(CRtuVO.getArea_code()).getSnow());				
			}else{
				snowVO.setSnow_m((double)-99999);								
			}
			if(tmsSnowDAO.getSnowDValue(CRtuVO.getArea_code()) != null){
				snowVO.setSnow_d(tmsSnowDAO.getSnowDValue(CRtuVO.getArea_code()).getSnow());
			}else{
				snowVO.setSnow_d((double) -99999);								
			}
			if(tmsSnowDAO.getSnowDMaxValue(CRtuVO.getArea_code()) != null){
				snowVO.setSnow_d_max(tmsSnowDAO.getSnowDMaxValue(CRtuVO.getArea_code()).getSnow());
			}else{
				snowVO.setSnow_d_max((double) -99999);								
			}
			if(tmsSnowDAO.getSnowBDValue(CRtuVO.getArea_code()) != null){
				snowVO.setSnow_bd(tmsSnowDAO.getSnowBDValue(CRtuVO.getArea_code()).getSnow());
			}else{
				snowVO.setSnow_bd((double) -99999);								
			}
			if(tmsSnowDAO.getSnowBBDValue(CRtuVO.getArea_code()) != null){
				snowVO.setSnow_bbd(tmsSnowDAO.getSnowBBDValue(CRtuVO.getArea_code()).getSnow());
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

	@Override
	public RtuVO actionTmsRtuSpeaker(RtuVO rtuVO) throws Exception {
		RtuVO speakerState = rtuInfo.getSpeakerState(rtuVO);
		return speakerState;
	}

	
	
}