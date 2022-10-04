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
public class AreaInfoVO {
    
    private String area_code;
    private String sido;
    private String gugun;
    private String dong;
    private String li;
    private Character area_level;

    private int areaTotal;
    private int areaCnt;
    
    private int length;
    private int start;
    
    private String search_sel;
    private String search_text;
    
    
    
    
}
