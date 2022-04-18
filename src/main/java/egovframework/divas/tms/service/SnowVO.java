package egovframework.divas.tms.service;

import java.io.Serializable;
import java.sql.Timestamp;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 수위현황을 위한 VO 클래스
 * @author 서정명
 * @since 2022.03.29
 * @version 1.0
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      수정자          수정내용
 *  -------    --------    ---------------------------
 *  2022.03.29  서정명          최초 생성
 *
 *  </pre>
 */
@Getter
@Setter
@ToString
public class SnowVO implements Serializable {

	private static final long serialVersionUID = 588368286553890160L;
	
	private String area_code;
	private Character data_type;
	private String snow_date;
	private Double snow;
	private Character sensing;
	private String rtu_name;
	private Double snow_m;
	private Double snow_h;
	private Double snow_bh;
	private Double snow_d;
	private Double snow_d_max;
	private Double snow_d_new;
	private Double snow_bd;
	private Double snow_bd_new;
	private Double snow_bbd;
	private Double snow_n;
	private Double snow_y;
	
}