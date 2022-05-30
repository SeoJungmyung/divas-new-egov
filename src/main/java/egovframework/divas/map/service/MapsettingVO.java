package egovframework.divas.map.service;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;


/**
 * 게시물 관리를 위한 VO 클래스
 * @author 공통 서비스 개발팀 이삼섭
 * @since 2009.03.19
 * @version 1.0
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      수정자          수정내용
 *  -------    --------    ---------------------------
 *  2009.03.19  이삼섭          최초 생성
 *  2009.06.29  한성곤		   2단계 기능 추가 (댓글관리, 만족도조사)
 *  2011.08.31  JJY            경량환경 템플릿 커스터마이징버전 생성
 *
 *  </pre>
 */
@Getter
@Setter
@ToString
public class MapsettingVO implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -361109310997535982L;
	/**
	 * id
	 */
	
	private int idx;       
	private String skin;   
	private String setval;
	private String x_organ;
	private String y_organ;
	private String top_img;
	private String top_text;
	private int map_skin;
	private int map_type;
	private int map_sub;
	private String x_cent;
	private String y_cent;
	private String map_level;
	private int map_move;
	private int map_size;
	private int map_box;
	private int map_kind;
	private String map_data;
	private int over_level;
	private int clus_level;
	private String udate;
	private String indate;
	private String sig_cd;
	private String api_key;
	private String setting_type;
	
}