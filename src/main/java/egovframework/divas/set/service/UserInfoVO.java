package egovframework.divas.set.service;

import java.util.List;

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
public class UserInfoVO {
    
    private String user_id;
    private int organ_id;
    private String organ_name;
    private String area_code;
    private Character menu_type;
    private Character user_type;
    private String user_name;
    private String user_pwd;
    private String mobile;
    private String email;
    private Character is_permit;
    private String reg_date;
    private String smart_mobile;
    private Character smart_use;
    private int fail_cnt;
    private String last_fail_date;
    private String group_id;
    private int rtu_id;
    private String change_mode;
    private List<Integer> rtu_ids;

    private String search_sel;
    private String search_text;
    
    
    
    
}
