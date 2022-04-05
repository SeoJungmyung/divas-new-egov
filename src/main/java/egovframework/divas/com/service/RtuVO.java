package egovframework.divas.com.service;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

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
@Getter
@Setter
@ToString
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

    
    
}
