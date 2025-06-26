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
public class RtuSensorVO implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private int rtu_id;
    private String sensor_type;
    private int base_risklevel1;
    private int base_risklevel2; 
    private int base_risklevel3;
    private int base_risklevel4;
    private int base_risklevel5;
    private int base_risklevel1_off;
    private int base_risklevel2_off; 
    private int base_risklevel3_off;
    private int base_risklevel4_off;
    private int base_risklevel5_off;
    private String is_average;
    private String last_time;
    private int auto_event_use;
    
    
}
