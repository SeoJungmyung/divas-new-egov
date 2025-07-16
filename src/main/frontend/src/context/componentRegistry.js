import { lazy } from 'react';

// Lazy load all components
const TmsRain = lazy(() => import('divas/tms/TmsRain'));
const TmsFlow = lazy(() => import('divas/tms/TmsFlow'));
const TmsAWS = lazy(() => import('divas/tms/TmsAWS'));
const TmsSnow = lazy(() => import('divas/tms/TmsSnow'));
const TmsBroadcast = lazy(() => import('divas/tms/TmsBroadcast'));
const TmsEvent = lazy(() => import('divas/tms/TmsEvent'));
const TmsRtuState = lazy(() => import('divas/tms/TmsRtuState'));
const MainLayout = lazy(() => import('divas/com/MainLayout'));

const AbrCommon = lazy(() => import('divas/abr/AbrCommon'));
const AbrScript = lazy(() => import('divas/abr/AbrScript'));
const AbrDate = lazy(() => import('divas/abr/AbrDate'));

const MsgSend = lazy(() => import('divas/msg/MsgSend'));
const MsgHist = lazy(() => import('divas/msg/MsgHist'));
const MsgRecSet = lazy(() => import('divas/msg/MsgRecSet'));

const DtmRain = lazy(() => import('divas/dtm/DtmRain'));
const DtmFlow = lazy(() => import('divas/dtm/DtmFlow'));
const DtmAWS = lazy(() => import('divas/dtm/DtmAWS'));
const DtmSnow = lazy(() => import('divas/dtm/DtmSnow'));

const RptAbr = lazy(() => import('divas/rpt/RptAbr'));
const RptStat = lazy(() => import('divas/rpt/RptStat'));
const Rpt10m = lazy(() => import('divas/rpt/Rpt10m'));
const RptCompar = lazy(() => import('divas/rpt/RptCompar'));
const RptRain = lazy(() => import('divas/rpt/RptRain'));
const RptFlow = lazy(() => import('divas/rpt/RptFlow'));
const RptAWS = lazy(() => import('divas/rpt/RptAWS'));
const RptSnow = lazy(() => import('divas/rpt/RptSnow'));

const SbdInfo = lazy(() => import('divas/sbd/SbdInfo'));
const SbdSend = lazy(() => import('divas/sbd/SbdSend'));
const SbdMsg = lazy(() => import('divas/sbd/SbdMsg'));
const SbdSet = lazy(() => import('divas/sbd/SbdSet'));
const SbdRpt = lazy(() => import('divas/sbd/SbdRpt'));

const SetEnv = lazy(() => import('divas/set/SetEnv'));
const SetOrg = lazy(() => import('divas/set/SetOrgan'));
const SetUser = lazy(() => import('divas/set/SetUser'));
const SetEquip = lazy(() => import('divas/set/SetEquip'));

// Map URL constants to components
const componentRegistry = {
  '/main/dashboard': MainLayout,
  '/tms/rain': TmsRain,
  '/tms/flow': TmsFlow,
  '/tms/aws': TmsAWS,
  '/tms/snow': TmsSnow,
  '/tms/broadcast': TmsBroadcast,
  '/tms/event': TmsEvent,
  '/tms/rtu-state': TmsRtuState,
  '/abr/common': AbrCommon,
  '/abr/script': AbrScript,
  '/abr/date': AbrDate,
  '/msg/send': MsgSend,
  '/msg/history': MsgHist,
  '/msg/settings': MsgRecSet,
  '/dtm/rain': DtmRain,
  '/dtm/flow': DtmFlow,
  '/dtm/aws': DtmAWS,
  '/dtm/snow': DtmSnow,
  '/rpt/abr': RptAbr,
  '/rpt/stat': RptStat,
  '/rpt/10m': Rpt10m,
  '/rpt/compar': RptCompar,
  '/rpt/rain': RptRain,
  '/rpt/flow': RptFlow,
  '/rpt/aws': RptAWS,
  '/rpt/snow': RptSnow,
  '/sbd/info': SbdInfo,
  '/sbd/send': SbdSend,
  '/sbd/msg': SbdMsg,
  '/sbd/set': SbdSet,
  '/sbd/rpt': SbdRpt,
  '/set/env': SetEnv,
  '/set/org': SetOrg,
  '/set/user': SetUser,
  '/set/equip': SetEquip
};

// Create a URL mapping from old PHP URLs to new routes
export const urlToRouteMap = {
  'tms_main.php': '/main/dashboard',
  'tms_rain.php': '/tms/rain',
  'tms_flow.php': '/tms/flow',
  'tms_aws.php': '/tms/aws',
  'tms_snow.php': '/tms/snow',
  'tms_alarm.php': '/tms/broadcast',
  'tms_alert.php': '/tms/event',
  'tms_equip.php': '/tms/rtu-state',
  'abr_common.php': '/abr/common',
  'abr_edit.php': '/abr/script',
  'abr_date.php': '/abr/date',
  'sms.php': '/msg/send',
  'sms_hist.php': '/msg/history',
  'sms_set.php': '/msg/settings',
  'dtm_rain.php': '/dtm/rain',
  'dtm_wl.php': '/dtm/flow',
  'dtm_aws.php': '/dtm/aws',
  'dtm_snow.php': '/dtm/snow',
  'rpt_brhist.php': '/rpt/abr',
  'rpt_stat.php': '/rpt/stat',
  'rpt_10m.php': '/rpt/10m',
  'rpt_mix.php': '/rpt/compar',
  'rpt_rain.php': '/rpt/rain',
  'rpt_wl.php': '/rpt/flow',
  'rpt_aws.php': '/rpt/aws',
  'rpt_snow.php': '/rpt/snow',
  'sbd_info.php': '/sbd/info',
  'sbd_send.php': '/sbd/send',
  'sbd_msg.php': '/sbd/msg',
  'sbd_set.php': '/sbd/set',
  'sbd_rpt.php': '/sbd/rpt',
  'set_setting.php': '/set/env',
  'set_organ.php': '/set/org',
  'set_user.php': '/set/user',
  'set_equip.php': '/set/equip'
};

export const getRouteFromUrl = (url) => {
  console.log("getRouteFromUrl [url] : ", url);
  return urlToRouteMap[url] || '/main/dashboard';
};

export default componentRegistry;
