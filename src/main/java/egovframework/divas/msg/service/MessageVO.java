package egovframework.divas.msg.service;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * @Class Name : MessageVO.java
 * @Description : Message VO class
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
public class MessageVO implements Serializable {
    
	private static final long serialVersionUID = 7121085104843834593L;
	
	private int idx; 
	private String organ_id; 
	private String user_id; 
	private String user_name; 
	private String mobile; 
	private String memo; 
	private int sms_group_id; 
	private String sms_group_name; 
	private int group1; 
	private int group2; 
	private int group3; 
	private int group4; 
	private int group5;
	
	private int rtu_id; 
	private String rtu_name; 
	private int sms_idx;
	
	private String dd; 
	private String hh; 
	private String mm; 
	private String sms_type; 
	private String sms_msg; 
	private String send_date; 
	private String callback; 
	private List<String> receiver_arr; 
    
    
	
}
