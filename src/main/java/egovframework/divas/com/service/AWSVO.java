package egovframework.divas.com.service;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.commons.lang3.builder.ToStringBuilder;

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
public class AWSVO implements Serializable {

	private static final long serialVersionUID = -6544877127667918721L;
	
	private String area_code;
	private Character data_type;
	private String aws_date;
	private Double rain;
	private String rain_date;
	private Integer num;
	private Character sensing;
	private String rtu_name;
	private Double rain_h;
	private Double rain_d;
	private Double temp;
	private Double temp_max;
	private Double temp_min;
	private Double atmo;
	private Double atmo_max;
	private Double atmo_min;
	private Double avr_deg;
	private String wind_deg;
	private Double wind_vel;
	private Double max_deg;
	private String wind_max_deg;
	private Double wind_max_vel;
	private Double humi;
	private Double humi_max;
	private Double humi_min;
	private Double radi;
	private Double suns;
//	private String CALL_LAST;
	
	
	
}