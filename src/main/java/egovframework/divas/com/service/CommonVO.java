package egovframework.divas.com.service;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * @Class Name : CommonVO.java
 * @Description : Common VO class
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
public class CommonVO {
    
    private String user_id;
    private String user_type;
    private String user_name;
    private String organ_id;
    private String organ_code;
    private String organ_name;
    private String sort_base;
    private String is_rtu_id;
    private Character is_login;
    private int level_cnt;
    private int load_time;
    private int alarm_cnt;
    private int alert_cnt;
    
    private int board_type;
    private String vm_speaker;
    private String top_img;
    private String top_title;
    private String top_text;
    private int recaptcha;
    private String board_url;
    private String vm_voice;
    private String vm_ip;
    private String vm_port;
    private int town_use;
    private int vhf_use;
    private String sms_call;
    private int sms_type;
    private String sms_ip;
    private String sms_port;
    private String sms_id;
    private String sms_pw;
    private String sms_db;
    private int xro_use;
    private String xro_ip;
    private String xro_port;
    private String xro_id;
    private String xro_pw;
    private String xro_db;
    private String naver_api;

    private String search_sel;
    private String search_text;
    
    
    
    
}
