package egovframework.divas.tms.service;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.commons.lang3.builder.ToStringBuilder;

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
public class RainVO implements Serializable {

	/**
	 * id
	 */
	private static final long serialVersionUID = 6818273876815334043L;
	
	private String area_code;
	private Character data_type;
	private Timestamp rain_date;
	private int rain;
	private Character sensing;
	
	public String getArea_code() {
		return area_code;
	}
	public void setArea_code(String area_code) {
		this.area_code = area_code;
	}
	public Character getData_type() {
		return data_type;
	}
	public void setData_type(Character data_type) {
		this.data_type = data_type;
	}
	public Timestamp getRain_date() {
		return rain_date;
	}
	public void setRain_date(Timestamp rain_date) {
		this.rain_date = rain_date;
	}
	public int getRain() {
		return rain;
	}
	public void setRain(int rain) {
		this.rain = rain;
	}
	public Character getSensing() {
		return sensing;
	}
	public void setSensing(Character sensing) {
		this.sensing = sensing;
	}
	
	@Override
	public String toString() {
		return "RainVO [area_code=" + area_code + ", data_type=" + data_type + ", rain_date=" + rain_date + ", rain="
				+ rain + ", sensing=" + sensing + "]";
	}
	
	

}