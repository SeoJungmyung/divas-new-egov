package egovframework.divas.com.service;

import java.io.Serializable;

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
public class RtuVO implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private int rtu_id;
    private java.lang.String area_code;
    private java.lang.String combi_type;
    private java.lang.String rtu_type;
    private String organ_id;
    private int signal_id;
    private java.lang.String rtu_name;
    private int line_no;
    private int model_no;
    private java.lang.String connection_info;
    private int port;
    private int baudrate;
    private int sort_flag;
    private java.lang.String rtu_state;
    private java.lang.String amp_state;
    private int equip_seq;
    private int lte_connection;
    private java.util.Date call_last;
    private int event_qtail;
    private java.lang.String warning_sms;
    private java.lang.String danger_sms;
    private java.util.Date reg_date;
    private int vhf_use;
    private int vhf_system_id;
    private int vhf_rtu_id;
    private int vhf_trans_id;
    private int broadcast_setting;
    private int priority;
    private byte smartpower;
    private java.lang.String dscode;
    private java.lang.String cd_dist_obsv;
    private java.lang.String gb_obsy;
    private int real_organ_code;
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
    
    private int speaker_use1;
    private int speaker_use2;
    private int speaker_use3;
    private int speaker_use4;
    private int speaker_use5;
    private int speaker_use6;
    private int speaker_use7;
    private int speaker_use8;
    private int speaker1;
    private int speaker2;
    private int speaker3;
    private int speaker4;
    private int speaker5;
    private int speaker6;
    private int speaker7;
    private int speaker8;
    
    
}
