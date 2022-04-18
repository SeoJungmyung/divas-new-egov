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
    
    private int rtuId;
    private java.lang.String areaCode;
    private java.lang.String combiType;
    private java.lang.String rtuType;
    private String organId;
    private int signalId;
    private java.lang.String rtuName;
    private int lineNo;
    private int modelNo;
    private java.lang.String connectionInfo;
    private int port;
    private int baudrate;
    private int sortFlag;
    private java.lang.String rtuState;
    private java.lang.String ampState;
    private int equipSeq;
    private int lteConnection;
    private java.util.Date callLast;
    private int eventQtail;
    private java.lang.String warningSms;
    private java.lang.String dangerSms;
    private java.util.Date regDate;
    private int vhfUse;
    private int vhfSystemId;
    private int vhfRtuId;
    private int vhfTransId;
    private int broadcastSetting;
    private int priority;
    private byte smartpower;
    private java.lang.String dscode;
    private java.lang.String cdDistObsv;
    private java.lang.String gbObsy;
    private int realOrganCode;
    private Double rain;
    private Double flow;
    private Double atmo;
    private Double temp;
    private Double wind;
    private Double humi;
    private Double radi;
    private Double suns;
    private Double rain_level1;
    private Double rain_level2;
    private Double rain_level3;
    private int level_cnt;
    private int maintype;
    private String sort;
    private String w_sensertype;

    /*	장비상태	*/
    private int sola_volt;
    private int sola_ampere;
    private int batt_volt;
    private int load1_ampere;
    private int load2_ampere;
    private int logger_stat;
    private int door_stat;
    private int sensor_stat;
    private int mainamp_stat;
    private int amp_power;
    private int audio_volume;
    private int speaker_select;
    private String log_date;
    private String smart_use;
    private int sola_volt1;
    private int sola_curr1;
    private int sola_volt2;
    private int sola_curr2;
    private int batt_volt1;
    private int batt_volt2;
    private int load_curr1;
    private int load_curr2;
    private int load_curr3;
    
}
