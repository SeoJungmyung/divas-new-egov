import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import LeftMenuIn from 'divas/com/LeftMenuIn';
import { getRouteFromUrl } from 'context/componentRegistry';

function LeftMenu(props) {

    // console.group("LeftContent");
    // console.log("[Start] LeftContent ------------------------------");
    // console.log("LeftContent [props] : ", props);

    const topML = props.topMenuList;
    const inML = props.inMenuList;
    
    const [margin, setMargin] = useState([]);
    const [actMenu, setActMenu] = useState(0);
    const [isShown, setIsShown] = useState(-99);
    const history = useHistory();

    const sendUrl = (url, menuIdx) => {
        setActMenu(menuIdx);
        
        const route = getRouteFromUrl(url);
        // Pass all necessary state data
        history.push(route, { 
            commonVO: props.commonVO,
            topMenuList: props.topMenuList,
            inMenuList: props.inMenuList,
            timeDiff: props.timeDiff
        });
    }

    useEffect(()=>{
        let margin = [];
        topML.forEach(function (item, index) {
            let fix = 45;
            let notMPx = index * fix;
            // let px = notMPx + "px";
            let px = "-80px";
            margin.push(px);

        });
        setMargin(margin);

    }, []);

    // console.log("------------------------------LeftContent [End]");
    // console.groupEnd("LeftContent");

    return (
        <div id="left_sidebar">
            <ul>
            {
                topML.map((item, index) => (
                    <li key={"top_"+index} id={"left_"+item.menu_idx} className={actMenu === index ? "act" : ""}
                        onMouseEnter={() => setIsShown(index)}
                        onMouseLeave={() => setIsShown(-99)}
                    >
                        <i data-num={item.menu_idx} onClick={()=>sendUrl(item.menu_url, index)}>
                        <div><img src={"../images/"+item.menu_icon} alt={item.menu_name} /></div>{item.menu_name}
                        </i>
                            <LeftMenuIn 
                                idx = {index} top_idx = {item.menu_idx}
                                inML = {inML} isShown={isShown} margin_top={margin}
                                sendUrl = {sendUrl}>
                            </LeftMenuIn>
                    </li>
                ))
            }
            </ul>
        </div>
    );
}

export default LeftMenu;