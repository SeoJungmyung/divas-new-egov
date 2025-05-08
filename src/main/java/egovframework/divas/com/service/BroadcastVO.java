package egovframework.divas.com.service;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;

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
public class BroadcastVO implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private int log_no; 
    private String user_id; 
    private int plan_no; 
    private Character is_plan; 
    private int script_no; 
    private Character script_type; 
    private String script_unit;
	private String script_title; 
	private int section_no; 
	private int chime_start_no; 
	private int chime_start_cnt; 
	private int chime_end_no;
	private int chime_end_cnt; 
	private String script_body; 
	private int script_body_cnt; 
	private String script_record_file; 
	private String script_timestamp;
	private int trans_volume; 
	private int log_type; 
	private String log_date; 
	private String mobile_send_user; 
	private String trans_start;
	private String trans_check; 
	private int trans_flag; 
	private int trans_error; 
	private int rtu_id;
	private int rtu_cnt_ok;
	private int rtu_cnt_vhf_ok;
	private int rtu_cnt_cro_ok;
	private int rtu_cnt;
	private String section_name;
	private String is_plan_gubun;
	private String is_plan_name;
	
	/*	일반방송	*/
	private Character own_type;
	private String organ_id;
	private int script_play_seconds;
	private int script_sort;
	private int vhf_msg_grp;
	
	private String broad_ip;
	private String valid;
	private int rtu_cnt_curr;
	private List<Integer> rtu_id_arr;
	private List<Integer> model_no_arr;
	
	private Character plan_cycle;
	private Character is_pause;
	private String plan_start_date;
	private String plan_end_date;
	private String plan_reg_date;

	private String change_mode;
	
	/*	경보방송 전송이력	*/
	private String vms_result;
	private String tcs_result;
	private String rtu_name;
	private Integer model_no;
	private String record_filepath;
	private Integer vhf_use;
	private Integer vhf_call;
	private Integer vhf_result;
	private String state_txt;
	private String error_txt;
	
	
	
}
