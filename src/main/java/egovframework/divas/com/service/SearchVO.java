package egovframework.divas.com.service;

import java.io.Serializable;
import java.sql.Timestamp;

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
public class SearchVO implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private String organ_id; 
    private String organ_code; 
    private int level_cnt; 
    private String sdate; 
    private String edate; 
    private String search_sel; 
    private String search_text; 
    private int alarm_cnt; 
   
    private String user_id; 
    
    /*	방송	*/
    private int vhf_use; 
    private int xro_use; 
    private String is_plan; 
    private int log_no; 
    private int rtu_id; 
    private String organ_area_code;
    
    /*	이벤트	*/
    private int alert_cnt; 
    private String event_code_on;
    private String event_code_off;
    private String event_code_all;
    
    /*	문자	*/
    private int msg_id; 
	private String dest_info; 
	private String callback; 
	private String sms_msg; 
	private int schedule_type; 
	private String tran_rslt; 
	private String sms_group_id; 
	
	/*	보고서	*/
	private String area_code;
	private String type;
	private String format;
	private int ecnt;
    private String where_date;
    private String stat_type;
    private String vhf_t;
    private String vhf_f;
    private String xro_t;
    private String xro_f;
    
	
    /*	이벤트 코드 세팅	*/
    public void setToEventCode() {
    	if(this.level_cnt == 2) {
    		this.event_code_on = "19, 20, 23, 25";
    		this.event_code_off = "22, 24, 26";
    		this.event_code_all = "19, 20, 22, 23, 24, 25, 26";
    	}else if(this.level_cnt == 3) {
    		this.event_code_on = "19, 20, 21, 23, 25, 27";
    		this.event_code_off = "22, 24, 26, 28";
    		this.event_code_all = "19, 20, 21, 22, 23, 24, 25, 26, 27, 28";			
    	}else if(this.level_cnt == 4) {
    		this.event_code_on = "19, 20, 21, 23, 25, 27, 33, 37, 101, 102, 103, 104";
    		this.event_code_off = "22, 24, 26, 28, 35, 105, 106, 107, 108";
    		this.event_code_all = "19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 33, 35, 37, 101, 102, 103, 104, 105, 106, 107, 108";
    	}else if(this.level_cnt == 5) {
    		this.event_code_on = "19, 20, 21, 23, 25, 27, 33, 34, 37, 38, 101, 102, 103, 104";
    		this.event_code_off = "22, 24, 26, 28, 35, 36, 105, 106, 107, 108";
    		this.event_code_all = "19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 33, 34, 35, 36, 37, 38, 101, 102, 103, 104, 105, 106, 107, 108";
    	}    	
    }
    

    /*	보고서 검색 세팅	*/
    public void setSearchReport() {
    	if(this.type.equals("H")) {
    		for(int i=0; i<=23; i++) {
    			if(i != 0) this.where_date += ",";
    			if(i < 10) {
    				this.where_date += " '"+this.sdate.substring(0, 10)+" 0"+i+":00:00'";
    			}else {
    				this.where_date += " '"+this.sdate.substring(0, 10)+" "+i+":00:00'";
    			}
    		}
    		this.format = "%k";
    	}else if(this.type.equals("D")) {
    		
    	}
    	
    }
    
    
}
