package egovframework.divas.set.service;

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
public class OrganInfoVO {
    
    private int organ_id;
    private String organ_name;
    private String department;
    private String area_code;
    private String area_main;
    private String area_sub;
    private Character sort_base;
    private String comment;
    private String change_mode;
    
    private String search_sel;
    private String search_text;
    
    
    
    
}
