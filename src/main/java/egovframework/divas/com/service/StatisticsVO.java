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
public class StatisticsVO implements Serializable {
    private static final long serialVersionUID = 1L;
    
	private int rtu_id;
	private String rtu_name;
	private Integer num;
	private Integer cnt;
	private String last;
	private Integer dd;
	private Integer cnt0;
	private Integer cnt0_t;
	private Integer cnt0_f;
	private Integer cnt1;
	private Integer cnt1_t;
	private Integer cnt1_f;
	private Integer cnt2;
	private Integer cnt2_t;
	private Integer cnt2_f;
	
	
	
}
