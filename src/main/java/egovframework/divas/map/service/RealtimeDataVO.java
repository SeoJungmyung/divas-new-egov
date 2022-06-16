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
public class RealtimeDataVO implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String area_code;
	private String sensor_type;
	private String realtime;
	private int realdata;

}