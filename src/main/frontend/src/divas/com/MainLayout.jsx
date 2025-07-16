import React, { useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import * as EgovNet from 'context/egovFetch';

import TmsRain from 'divas/tms/TmsRain';
import TmsFlow from 'divas/tms/TmsFlow';
import TmsAWS from 'divas/tms/TmsAWS';
import TmsSnow from 'divas/tms/TmsSnow';
import TmsBroad from 'divas/tms/TmsBroadcast';
import URL from 'context/url';
import CODE from 'context/code';

function MainLayoutContent(props) {

    console.group("MainLayoutContent");
    console.log("[Start] MainLayoutContent ------------------------------");
    console.log("MainLayoutContent [props] : ", props);
    // const commonVO = sessionStorage.getItem('commonVO');
    
    console.log("------------------------------ [End] MainLayoutContent");
    console.groupEnd("MainLayoutContent");

    return (
      <>
        {(() => {
            if(props.count === 0){
              return(
              <div id="case_1">
                <ul className="main_twrap">
                  <li id="area_1" className="tb_w"><TmsRain load_time={props.load_time} reload={props.reload}></TmsRain></li>
                </ul>
              </div>);
            }else if(props.count === 1){
              return(
                <div id="case_2">
                  <ul className="main_twrap">
                    <li id="area_1" className="tb"><TmsRain load_time={props.load_time} reload={props.reload}></TmsRain></li>
                    <li className="mi"></li>
                    <li id="area_2" className="tb"><TmsFlow load_time={props.load_time} reload={props.reload}></TmsFlow></li>
                  </ul>
                </div>
                );
            }else if(props.count === 2){ 
              return(
                <div id="case_3">
                  <ul className="main_twrap">
                    <li id="area_1" className="tb_w"><TmsRain load_time={props.load_time} reload={props.reload}></TmsRain></li>
                  </ul>
                  <ul className="main_twrap">
                    <li id="area_2" className="tb_w"><TmsFlow load_time={props.load_time} reload={props.reload}></TmsFlow></li>
                  </ul>
                </div>
                );
            }else if(props.count === 3){ 
              return(
                <div id="case_4">
                  <ul className="main_twrap">
                    <li id="area_1" className="tb_w"><TmsRain load_time={props.load_time} reload={props.reload}></TmsRain></li>
                  </ul>
                  <ul className="main_twrap">
                    <li id="area_2" className="tb"><TmsFlow load_time={props.load_time} reload={props.reload}></TmsFlow></li>
                    <li className="mi"></li>
                    <li id="area_3" className="tb"><TmsAWS load_time={props.load_time} reload={props.reload}></TmsAWS></li>
                  </ul>
                </div>
              );
            }else if(props.count === 4){ 
              return(
                <div id="case_5">
                  <ul className="main_twrap">
                    <li id="area_1" className="tb"><TmsFlow load_time={props.load_time} reload={props.reload}></TmsFlow></li>
                    <li className="mi"></li>
                    <li id="area_2" className="tb"><TmsAWS load_time={props.load_time} reload={props.reload}></TmsAWS></li>
                  </ul>
                  <ul className="main_twrap">
                    <li id="area_3" className="tb_w"><TmsRain load_time={props.load_time} reload={props.reload}></TmsRain></li>
                  </ul>
                </div>
              );
            }else if(props.count === 5){ 
              return(
                <div id="case_5">
                  <ul className="main_twrap">
                    <li id="area_1" className="tb_w"><TmsSnow load_time={props.load_time} reload={props.reload}></TmsSnow></li>
                  </ul>
                  <ul className="main_twrap">
                    <li id="area_2" className="tb"><TmsFlow load_time={props.load_time} reload={props.reload}></TmsFlow></li>
                    <li className="mi"></li>
                    <li id="area_3" className="tb"><TmsAWS load_time={props.load_time} reload={props.reload}></TmsAWS></li>
                  </ul>
                  <ul className="main_twrap">
                    <li id="area_4" className="tb_w"><TmsRain load_time={props.load_time} reload={props.reload}></TmsRain></li>
                  </ul>
                </div>
              );
            }
          })()
        }
      </>
    );
}

export default MainLayoutContent;