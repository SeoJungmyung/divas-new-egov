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
public class EventVO implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private String area_code;
    
    private int alarm_grp_no; 
    private String alarm_grp_name; 
    private String rtu_type; 
    private int origin_rtu_id; 
    private String rtu_name; 
    private int event_seq; 
    private String event_branch; 
    private String event_comment; 
    private String event_date; 
    private int battery_volt; 
    private int event_code; 
    private String event_value; 
	
    
}
