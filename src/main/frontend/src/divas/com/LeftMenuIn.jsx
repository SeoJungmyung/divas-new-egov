import React, { useState, useEffect } from 'react';

function LeftMenuIn(props) {

    // console.group("LeftInContent");
    // console.log("[Start] LeftInContent ------------------------------");
    // console.log("LeftInContent [props] : ", props);

    // const topML = props.topML;
    const inML = props.inML;
    let htmlTag = [];
    // const [layout, setLayout] = useState({ count : 0, url : "main" });

    const [listTag, setListTag] = useState([]);
    const marginTop = {
        marginTop: props.margin_top[props.idx]
    }
    useEffect(()=>{
        inML.forEach(function (it2, id2) {
            if(props.top_idx === it2.menu_idx){
                 htmlTag.push(
                     <li key={"in_"+id2}>
                         <i onClick={() => ClickLinkHandler(it2.menu_url)}>
                             {it2.menu_name}
                         </i>
                     </li>
                 );
            }
        });
        setListTag(htmlTag);
    }, []);

    const ClickLinkHandler = (url) => {
        props.sendUrl(url, props.idx);
    }

    // console.log("------------------------------LeftInContent [End]");
    // console.groupEnd("LeftInContent");

    return (
        <div className="left_for" style={marginTop}> 
            {props.isShown == props.idx &&(
                <ul>
                    {listTag}
                </ul>
            )}
        </div>
    );
}

export default LeftMenuIn;