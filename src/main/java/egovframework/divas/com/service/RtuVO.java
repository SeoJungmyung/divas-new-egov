package egovframework.divas.com.service;

/**
 * @Class Name : RtuInfoVO.java
 * @Description : RtuInfo VO class
 * @Modification Information
 *
 * @author 서정명
 * @since 2022-03-14
 * @version 1.0
 * @see
 *  
 *  Copyright (C)  All right reserved.
 */
public class RtuVO {
    private static final long serialVersionUID = 1L;
    
    /** RTU_ID */
    private int rtuId;
    
    /** AREA_CODE */
    private java.lang.String areaCode;
    
    /** COMBI_TYPE */
    private java.lang.String combiType;
    
    /** RTU_TYPE */
    private java.lang.String rtuType;
    
    /** ORGAN_ID */
    private String organId;
    
    /** SIGNAL_ID */
    private int signalId;
    
    /** RTU_NAME */
    private java.lang.String rtuName;
    
    /** LINE_NO */
    private int lineNo;
    
    /** MODEL_NO */
    private int modelNo;
    
    /** CONNECTION_INFO */
    private java.lang.String connectionInfo;
    
    /** PORT */
    private int port;
    
    /** BAUDRATE */
    private int baudrate;
    
    /** SORT_FLAG */
    private int sortFlag;
    
    /** RTU_STATE */
    private java.lang.String rtuState;
    
    /** AMP_STATE */
    private java.lang.String ampState;
    
    /** EQUIP_SEQ */
    private int equipSeq;
    
    /** LTE_CONNECTION */
    private int lteConnection;
    
    /** CALL_LAST */
    private java.util.Date callLast;
    
    /** EVENT_QTAIL */
    private int eventQtail;
    
    /** WARNING_SMS */
    private java.lang.String warningSms;
    
    /** DANGER_SMS */
    private java.lang.String dangerSms;
    
    /** REG_DATE */
    private java.util.Date regDate;
    
    /** VHF_USE */
    private int vhfUse;
    
    /** VHF_SYSTEM_ID */
    private int vhfSystemId;
    
    /** VHF_RTU_ID */
    private int vhfRtuId;
    
    /** VHF_TRANS_ID */
    private int vhfTransId;
    
    /** BROADCAST_SETTING */
    private int broadcastSetting;
    
    /** PRIORITY */
    private int priority;
    
    /** SMARTPOWER */
    private byte smartpower;
    
    /** DSCODE */
    private java.lang.String dscode;
    
    /** CD_DIST_OBSV */
    private java.lang.String cdDistObsv;
    
    /** GB_OBSY */
    private java.lang.String gbObsy;
    
    /** REAL_ORGAN_CODE */
    private int realOrganCode;
    
    /** REAL_ORGAN_CODE */
    private Double rain;
    
    /** REAL_ORGAN_CODE */
    private Double flow;
    
    /** REAL_ORGAN_CODE */
    private Double atmo;
    
    /** REAL_ORGAN_CODE */
    private Double temp;
    
    /** REAL_ORGAN_CODE */
    private Double wind;
    
    /** REAL_ORGAN_CODE */
    private Double humi;
    
    /** radi */
    private Double radi;
    
    /** radi */
    private Double suns;
    
    /** radi */
    private Double rain_level1;
    
    /** radi */
    private Double rain_level2;
    
    /** radi */
    private Double rain_level3;
    
    /** radi */
    private int level_cnt;
    
    /** radi */
    private int maintype;
    
    /** radi */
    private String sort;

    /** w_sensertype */
    private String w_sensertype;

	public String getW_sensertype() {
		return w_sensertype;
	}

	public void setW_sensertype(String w_sensertype) {
		this.w_sensertype = w_sensertype;
	}

	public int getRtuId() {
		return rtuId;
	}

	public void setRtuId(int rtuId) {
		this.rtuId = rtuId;
	}

	public java.lang.String getAreaCode() {
		return areaCode;
	}

	public void setAreaCode(java.lang.String areaCode) {
		this.areaCode = areaCode;
	}

	public java.lang.String getCombiType() {
		return combiType;
	}

	public void setCombiType(java.lang.String combiType) {
		this.combiType = combiType;
	}

	public java.lang.String getRtuType() {
		return rtuType;
	}

	public void setRtuType(java.lang.String rtuType) {
		this.rtuType = rtuType;
	}

	public String getOrganId() {
		return organId;
	}

	public void setOrganId(String organId) {
		this.organId = organId;
	}

	public int getSignalId() {
		return signalId;
	}

	public void setSignalId(int signalId) {
		this.signalId = signalId;
	}

	public java.lang.String getRtuName() {
		return rtuName;
	}

	public void setRtuName(java.lang.String rtuName) {
		this.rtuName = rtuName;
	}

	public int getLineNo() {
		return lineNo;
	}

	public void setLineNo(int lineNo) {
		this.lineNo = lineNo;
	}

	public int getModelNo() {
		return modelNo;
	}

	public void setModelNo(int modelNo) {
		this.modelNo = modelNo;
	}

	public java.lang.String getConnectionInfo() {
		return connectionInfo;
	}

	public void setConnectionInfo(java.lang.String connectionInfo) {
		this.connectionInfo = connectionInfo;
	}

	public int getPort() {
		return port;
	}

	public void setPort(int port) {
		this.port = port;
	}

	public int getBaudrate() {
		return baudrate;
	}

	public void setBaudrate(int baudrate) {
		this.baudrate = baudrate;
	}

	public int getSortFlag() {
		return sortFlag;
	}

	public void setSortFlag(int sortFlag) {
		this.sortFlag = sortFlag;
	}

	public java.lang.String getRtuState() {
		return rtuState;
	}

	public void setRtuState(java.lang.String rtuState) {
		this.rtuState = rtuState;
	}

	public java.lang.String getAmpState() {
		return ampState;
	}

	public void setAmpState(java.lang.String ampState) {
		this.ampState = ampState;
	}

	public int getEquipSeq() {
		return equipSeq;
	}

	public void setEquipSeq(int equipSeq) {
		this.equipSeq = equipSeq;
	}

	public int getLteConnection() {
		return lteConnection;
	}

	public void setLteConnection(int lteConnection) {
		this.lteConnection = lteConnection;
	}

	public java.util.Date getCallLast() {
		return callLast;
	}

	public void setCallLast(java.util.Date callLast) {
		this.callLast = callLast;
	}

	public int getEventQtail() {
		return eventQtail;
	}

	public void setEventQtail(int eventQtail) {
		this.eventQtail = eventQtail;
	}

	public java.lang.String getWarningSms() {
		return warningSms;
	}

	public void setWarningSms(java.lang.String warningSms) {
		this.warningSms = warningSms;
	}

	public java.lang.String getDangerSms() {
		return dangerSms;
	}

	public void setDangerSms(java.lang.String dangerSms) {
		this.dangerSms = dangerSms;
	}

	public java.util.Date getRegDate() {
		return regDate;
	}

	public void setRegDate(java.util.Date regDate) {
		this.regDate = regDate;
	}

	public int getVhfUse() {
		return vhfUse;
	}

	public void setVhfUse(int vhfUse) {
		this.vhfUse = vhfUse;
	}

	public int getVhfSystemId() {
		return vhfSystemId;
	}

	public void setVhfSystemId(int vhfSystemId) {
		this.vhfSystemId = vhfSystemId;
	}

	public int getVhfRtuId() {
		return vhfRtuId;
	}

	public void setVhfRtuId(int vhfRtuId) {
		this.vhfRtuId = vhfRtuId;
	}

	public int getVhfTransId() {
		return vhfTransId;
	}

	public void setVhfTransId(int vhfTransId) {
		this.vhfTransId = vhfTransId;
	}

	public int getBroadcastSetting() {
		return broadcastSetting;
	}

	public void setBroadcastSetting(int broadcastSetting) {
		this.broadcastSetting = broadcastSetting;
	}

	public int getPriority() {
		return priority;
	}

	public void setPriority(int priority) {
		this.priority = priority;
	}

	public byte getSmartpower() {
		return smartpower;
	}

	public void setSmartpower(byte smartpower) {
		this.smartpower = smartpower;
	}

	public java.lang.String getDscode() {
		return dscode;
	}

	public void setDscode(java.lang.String dscode) {
		this.dscode = dscode;
	}

	public java.lang.String getCdDistObsv() {
		return cdDistObsv;
	}

	public void setCdDistObsv(java.lang.String cdDistObsv) {
		this.cdDistObsv = cdDistObsv;
	}

	public java.lang.String getGbObsy() {
		return gbObsy;
	}

	public void setGbObsy(java.lang.String gbObsy) {
		this.gbObsy = gbObsy;
	}

	public int getRealOrganCode() {
		return realOrganCode;
	}

	public void setRealOrganCode(int realOrganCode) {
		this.realOrganCode = realOrganCode;
	}

	public Double getRain() {
		return rain;
	}

	public void setRain(Double rain) {
		this.rain = rain;
	}

	public Double getFlow() {
		return flow;
	}

	public void setFlow(Double flow) {
		this.flow = flow;
	}

	public Double getAtmo() {
		return atmo;
	}

	public void setAtmo(Double atmo) {
		this.atmo = atmo;
	}

	public Double getTemp() {
		return temp;
	}

	public void setTemp(Double temp) {
		this.temp = temp;
	}

	public Double getWind() {
		return wind;
	}

	public void setWind(Double wind) {
		this.wind = wind;
	}

	public Double getHumi() {
		return humi;
	}

	public void setHumi(Double humi) {
		this.humi = humi;
	}

	public Double getRadi() {
		return radi;
	}

	public void setRadi(Double radi) {
		this.radi = radi;
	}

	public Double getSuns() {
		return suns;
	}

	public void setSuns(Double suns) {
		this.suns = suns;
	}

	public Double getRain_level1() {
		return rain_level1;
	}

	public void setRain_level1(Double rain_level1) {
		this.rain_level1 = rain_level1;
	}

	public Double getRain_level2() {
		return rain_level2;
	}

	public void setRain_level2(Double rain_level2) {
		this.rain_level2 = rain_level2;
	}

	public Double getRain_level3() {
		return rain_level3;
	}

	public void setRain_level3(Double rain_level3) {
		this.rain_level3 = rain_level3;
	}

	public int getLevel_cnt() {
		return level_cnt;
	}

	public void setLevel_cnt(int level_cnt) {
		this.level_cnt = level_cnt;
	}

	public int getMaintype() {
		return maintype;
	}

	public void setMaintype(int maintype) {
		this.maintype = maintype;
	}

	public String getSort() {
		return sort;
	}

	public void setSort(String sort) {
		this.sort = sort;
	}
    
    
    
    
}
