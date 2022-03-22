package egovframework.divas.com.service;

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
public class CommonVO {
    
    /** USER_ID */
    private String user_id;
    
    /** user_type */
    private String user_type;
    
    /** user_name */
    private String user_name;
    
    /** organ_id */
    private String organ_id;
    
    /** organ_name */
    private String organ_name;
    
    /** sort_base */
    private String sort_base;
    
    /** is_rtu_id */
    private String is_rtu_id;
    
    /** is_login */
    private Character is_login;
    
    /** level_cnt */
    private int level_cnt;
    
    /** load_time */
    private int load_time;
    
    /** level_cnt */
    private int alarm_cnt;
    
    /** level_cnt */
    private int alert_cnt;

	public String getUser_id() {
		return user_id;
	}

	public void setUser_id(String user_id) {
		this.user_id = user_id;
	}

	public String getUser_type() {
		return user_type;
	}

	public void setUser_type(String user_type) {
		this.user_type = user_type;
	}

	public String getUser_name() {
		return user_name;
	}

	public void setUser_name(String user_name) {
		this.user_name = user_name;
	}

	public String getOrgan_id() {
		return organ_id;
	}

	public void setOrgan_id(String organ_id) {
		this.organ_id = organ_id;
	}

	public String getOrgan_name() {
		return organ_name;
	}

	public void setOrgan_name(String organ_name) {
		this.organ_name = organ_name;
	}

	public String getSort_base() {
		return sort_base;
	}

	public void setSort_base(String sort_base) {
		this.sort_base = sort_base;
	}

	public String getIs_rtu_id() {
		return is_rtu_id;
	}

	public void setIs_rtu_id(String is_rtu_id) {
		this.is_rtu_id = is_rtu_id;
	}

	public Character getIs_login() {
		return is_login;
	}

	public void setIs_login(Character is_login) {
		this.is_login = is_login;
	}

	public int getLevel_cnt() {
		return level_cnt;
	}

	public void setLevel_cnt(int level_cnt) {
		this.level_cnt = level_cnt;
	}

	public int getLoad_time() {
		return load_time;
	}

	public void setLoad_time(int load_time) {
		this.load_time = load_time;
	}

	public int getAlarm_cnt() {
		return alarm_cnt;
	}

	public void setAlarm_cnt(int alarm_cnt) {
		this.alarm_cnt = alarm_cnt;
	}

	public int getAlert_cnt() {
		return alert_cnt;
	}

	public void setAlert_cnt(int alert_cnt) {
		this.alert_cnt = alert_cnt;
	}
    
    
    
    
    
    
    
}
