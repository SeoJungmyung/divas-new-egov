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
public class FlowVO implements Serializable {

	private static final long serialVersionUID = -6544877127667918721L;
	
	private String area_code;
	private Character data_type;
	private String flow_date;
	private Double flow;
	private Character sensing;
	private String rtu_name;
	private Double flow_m;
	private Double flow_h;
	private Double flow_bh;
	private Double flow_d;
	private Double flow_bd;
	private Double flow_n;
	private Double flow_y;
	
}