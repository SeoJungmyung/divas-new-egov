package egovframework.divas.sbd.service;

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
public class SignboardVO implements Serializable {
    private static final long serialVersionUID = 1L;
	
    private int idx;
    private List<Integer> msg_idx;
    private int siteid;
    private List<Integer> siteid_arr;
    private String area_code;
    private String tm;
    private int ordernum;
    private int msgaction;
    private int msgspd;
    private int msgdelay;
    private int msgcolor;
    private Character type;	// 메세지 타입 (0: 텍스트, 1:이미지)
    private Character division;
    private String msg;
    private String imgmsg;
    private String imgpath;
    private String senddate;
    private String enddate;
    private Character success;
    private int ref_idx;
    private String ref_name;
    private String areabestname;
    private String areaname;
    private int modx;
    private int mody;
    private int areaid;
    private String sitename;
    private int pointx;
    private int pointy;
    private Character useonoff1;
    private String timeonoff1;
    private int rightonoff1;
    private Character useonoff2;
    private String timeonoff2;
    private int rightonoff2;
    private Character useonoff3;
    private String timeonoff3;
    private int rightonoff3;
    private Character useonoff4;
    private String timeonoff4;
    private int rightonoff4;
    private Character systype;
    private String contype;
    private String baudrate;
    private String port;
    private String gateway;
    private String netmask;
    private int urgaction;
    private int urgspd;
    private int urgdelay;
    private int urgcolor;
    private int urghour;
    private int urgmin;
    private String userid;
    private String userip;
    private int areabestid;
    private int group_type; // 옵션 그룹 타입
    private int num;
    private String comment;
    private String saveimgvalue;
    private byte[] saveimg;
    private String actionname;
    private String colorname;
    private String change_mode;
    
    private String sdate;
    private String edate; 
    
	
}
