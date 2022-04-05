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
public class LeftMenuVO {
    
    /** menu_idx */
    private int menu_idx;
    
    /** menu_name */
    private java.lang.String menu_name;
    
    /** menu_num */
    private int menu_num;
    
    /** menu_icon */
    private java.lang.String menu_icon;
    
    /** menu_use */
    private int menu_use;
    
    /** menu_url */
    private java.lang.String menu_url;
    
    /** menu_level */
    private int menu_level;
	   
    
}
