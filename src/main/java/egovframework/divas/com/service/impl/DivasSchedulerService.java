package egovframework.divas.com.service.impl;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledFuture;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Service;

import egovframework.divas.map.web.DivasMapAPIController;



/**
 * 일반 로그인을 처리하는 비즈니스 구현 클래스
 * @author 공통서비스 개발팀 박지욱
 * @since 2009.03.06
 * @version 1.0
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      수정자          수정내용
 *  -------    --------    ---------------------------
 *  2009.03.06  박지욱          최초 생성
 *  2011.08.31  JJY            경량환경 템플릿 커스터마이징버전 생성
 *
 *  </pre>
 */
@Service("schedulerService")
public class DivasSchedulerService {
//	private static final Logger logger = LoggerFactory.getLogger(DivasSchedulerService.class);
	
	private Map<String, ScheduledFuture<?>> scheduledTasks = new ConcurrentHashMap<>();
//	
	@Autowired
	private TaskScheduler taskScheduler;
	
	@Autowired 
	private ThreadPoolTaskScheduler scheduler; 

	@Autowired 
	private DivasMapAPIController cont; 
//	
	public void register() {
//		ScheduledFuture<?> task = taskScheduler.scheduleAtFixedRate(cont.actionCurrentData(), 1000);
//		scheduledTasks.put("mySchedulerId", task);
	}
//	
	public void remove() {
//		scheduledTasks.get("mySchedulerId").cancel(true);
		scheduler.shutdown();
	}
//	
//	@Scheduled(fixedRateString = "${myscheduler.period}", initialDelay = 2000)
//	private void scheduleTest() {
//		logger.error("fix");
//	}
}
