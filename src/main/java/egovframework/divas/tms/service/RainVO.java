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
	
	private String area_code;
	private Character data_type;
	private Timestamp rain_date;
	private Double rain;
	private Character sensing;
	private String rtu_name;
	private Double rain_m;
	private Double rain_h;
	private Double rain_bh;
	private Double rain_d;
	private Double rain_bd;
	private Double rain_n;
	private Double rain_y;
	
	public Double getRain_m() {
		return rain_m;
	}
	public void setRain_m(Double rain_m) {
		this.rain_m = rain_m;
	}
	public Double getRain_h() {
		return rain_h;
	}
	public void setRain_h(Double rain_h) {
		this.rain_h = rain_h;
	}
	public Double getRain_bh() {
		return rain_bh;
	}
	public void setRain_bh(Double rain_bh) {
		this.rain_bh = rain_bh;
	}
	public Double getRain_d() {
		return rain_d;
	}
	public void setRain_d(Double rain_d) {
		this.rain_d = rain_d;
	}
	public Double getRain_bd() {
		return rain_bd;
	}
	public void setRain_bd(Double rain_bd) {
		this.rain_bd = rain_bd;
	}
	public Double getRain_n() {
		return rain_n;
	}
	public void setRain_n(Double rain_n) {
		this.rain_n = rain_n;
	}
	public Double getRain_y() {
		return rain_y;
	}
	public void setRain_y(Double rain_y) {
		this.rain_y = rain_y;
	}
	public String getRtu_name() {
		return rtu_name;
	}
	public void setRtu_name(String rtu_name) {
		this.rtu_name = rtu_name;
	}
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
	public Double getRain() {
		return rain;
	}
	public void setRain(Double rain) {
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