(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{145:function(e,t,n){},147:function(e,t,n){},187:function(e,t,n){"use strict";n.r(t);var c=n(0),r=n.n(c),a=n(21),s=n.n(a),i=(n(145),n(93)),o=n.n(i),d=n(118),l=n(136),j=n(133),u=n(67),h=n(31),b=n(36),O=(n(146),n(147),n(192)),x=n(130),g=n(193),f=n(194),m=n(131),p=n(132),y=n(119),v=n(134),w=n(98),k=n(190),S=n(191),C=n(7),E=k.a.Option,I=function(e,t,n,c){return function(r){var a=r.index,s=r.style,i=e[a];return Object(C.jsx)("div",{style:s,className:"row-container ".concat(n&&i.key===n.key?"selected":""," ").concat(t[i.key]?"checked":""," "),children:Object(C.jsxs)("div",{className:"row",onClick:function(){return c(i)},children:[Object(C.jsx)("div",{className:"number",children:"not-set"===i.count?"N/A":i.count}),Object(C.jsx)("div",{className:"name",children:i.key}),i.previous.length&&Object(C.jsx)("div",{children:Object(C.jsx)(w.b,{height:70,width:70,children:Object(C.jsx)(w.a,{data:i.previous.map((function(e,t){return{x:t,y:e||0}}))})})})]})})}},N=function(e){var t=e.arr,n=e.checkList,r=e.selected,a=e.setSelected,s=e.chooseDate,i=e.dates,o=e.selectedDate,d=Object(c.useState)({text:"",min:"",max:""}),l=Object(b.a)(d,2),j=l[0],u=l[1],O=Object(p.a)(t);if(j.text&&(O=O.filter((function(e){return e.key.indexOf(j.text)>-1}))),j.max)try{O=O.filter((function(e){return e.count<=parseInt(j.max)}))}catch(x){console.log("error")}if(j.min)try{O=O.filter((function(e){return e.count>=parseInt(j.min)}))}catch(x){console.log("error")}return Object(C.jsxs)("div",{style:{height:"100%"},children:[Object(C.jsx)(k.a,{style:{width:"100%"},onChange:function(e){return s(e)},value:o,children:i.map((function(e){return Object(C.jsx)(E,{value:e,children:e},e)}))}),Object(C.jsxs)(S.a.Group,{compact:!0,children:[Object(C.jsx)(k.a,{defaultValue:"1",children:Object(C.jsx)(E,{value:"1",children:"Between"})}),Object(C.jsx)(S.a,{style:{width:80,textAlign:"center"},placeholder:"Min",onBlur:function(e){return u(Object(h.a)(Object(h.a)({},j),{},{min:e.target.value}))}}),Object(C.jsx)(S.a,{style:{width:80,textAlign:"center"},placeholder:"Max",onBlur:function(e){return u(Object(h.a)(Object(h.a)({},j),{},{max:e.target.value}))}})]}),Object(C.jsx)(S.a,{placeholder:"search...",onChange:function(e){return u(Object(h.a)(Object(h.a)({},j),{},{text:e.target.value}))}}),Object(C.jsx)(y.a,{children:function(e){var t=e.height,c=e.width;return Object(C.jsx)(v.a,{height:t-100,itemCount:O.length,itemSize:70,width:c,children:I(O,n,r,a)})}})]})},T=n(96),A=n.n(T),B=function(e){return e<10?"0"+e:e},D=function(e){var t=new Date(e);return"".concat(t.getFullYear(),"-").concat(B(t.getMonth()+1),"-").concat(B(t.getDate()))},M=O.a.Header,F=O.a.Content;var L=function(){var e=Object(c.useState)([]),t=Object(b.a)(e,2),n=t[0],r=t[1],a=Object(c.useState)([]),s=Object(b.a)(a,2),i=s[0],p=s[1],y=Object(c.useState)(null),v=Object(b.a)(y,2),w=v[0],k=v[1],S=Object(c.useState)(!1),E=Object(b.a)(S,2),I=(E[0],E[1]),T=Object(c.useState)((function(){try{var e=localStorage.getItem("rt_checked");return(e=JSON.parse(e))||{}}catch(t){return{}}})),B=Object(b.a)(T,2),L=B[0],P=B[1],q=Object(c.useState)(null),J=Object(b.a)(q,2),_=J[0],H=J[1];return Object(c.useEffect)((function(){localStorage.setItem("rt_checked",JSON.stringify(L))}),[L]),Object(c.useEffect)((function(){Object(d.a)(o.a.mark((function e(){var t,n,c;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return I(!0),e.prev=1,e.next=4,A.a.get("https://redbubble-trends.onrender.com/trends/"+(w||D(Date.now())));case 4:if(t=e.sent,r(t.data.data),i.length){e.next=13;break}return e.next=9,A.a.get("https://redbubble-trends.onrender.com/dates");case 9:n=e.sent,(c=n.data.map((function(e){return e.date}))).reverse(),p(c);case 13:e.next=18;break;case 15:e.prev=15,e.t0=e.catch(1),x.b.error("Cannot find data");case 18:I(!1);case 19:case"end":return e.stop()}}),e,null,[[1,15]])})))()}),[w]),Object(c.useEffect)((function(){var e=document.getElementById("gt"),t=document.getElementById("gt-map");_&&e&&(e.innerHTML="",window.trends.embed.renderExploreWidgetTo(e,"TIMESERIES",{comparisonItem:[{keyword:_.key,geo:"",time:"today 12-m"}],category:0,property:""},{exploreQuery:"q=".concat(_.key,"&date=today 12-m"),guestPath:"https://trends.google.com:443/trends/embed/"})),_&&t&&(t.innerHTML="",window.trends.embed.renderExploreWidgetTo(t,"GEO_MAP",{comparisonItem:[{keyword:_.key,geo:"",time:"2004-01-01 2021-05-20"}],category:0,property:""},{exploreQuery:"q=".concat(_.key,"&date=all"),guestPath:"https://trends.google.com:443/trends/embed/"}))}),[_]),Object(C.jsx)("div",{className:"App",children:Object(C.jsx)("header",{className:"App-header",children:Object(C.jsxs)(O.a,{children:[Object(C.jsx)(M,{style:{display:"flex",justifyContent:"space-between"},children:Object(C.jsx)("h1",{className:"header",children:"Redbubble Trends"})}),Object(C.jsx)(F,{children:Object(C.jsxs)(g.a,{style:{height:"100%"},children:[Object(C.jsx)(f.a,{span:5,children:Object(C.jsx)(N,{arr:n,checkList:L,selected:_,setSelected:H,dates:i,chooseDate:k,selectedDate:w})}),Object(C.jsx)(f.a,{span:19,children:_?Object(C.jsxs)(C.Fragment,{children:[Object(C.jsxs)("div",{children:[Object(C.jsxs)(m.a,{onClick:function(){!function(e,t){if(t)P(Object(h.a)(Object(h.a)({},L),{},Object(u.a)({},e,"1")));else{L[e];var n=Object(l.a)(L,[e].map(j.a));P(n)}}(_.key,!L[_.key])},children:[L[_.key]?"Remove from":"Add to"," list"]}),Object(C.jsx)(m.a,{onClick:function(){window.open("https://www.redbubble.com/shop/?query=".concat(_.key,"&ref=search_box"))},children:"Visit redbubble"}),Object(C.jsx)("span",{style:{float:"right"},children:_.previous.filter((function(e){return!!e})).join("-")})]}),Object(C.jsx)("div",{children:Object(C.jsx)("iframe",{id:"google-search",src:"https://www.google.com/search?igu=1&q=".concat(_.key),frameBorder:"0",style:{width:"100%",height:"44vh"}})}),Object(C.jsxs)("div",{style:{width:"100%",height:"47vh",display:"flex"},children:[Object(C.jsx)("div",{id:"gt",style:{width:"50%"}}),Object(C.jsx)("div",{id:"gt-map",style:{width:"50%"}})]})]}):Object(C.jsx)("div",{style:{textAlign:"center"},children:Object(C.jsx)("h2",{style:{marginTop:50},children:"Select a keyword to see the google trend and google search results"})})})]})})]})})})},P=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,195)).then((function(t){var n=t.getCLS,c=t.getFID,r=t.getFCP,a=t.getLCP,s=t.getTTFB;n(e),c(e),r(e),a(e),s(e)}))};s.a.render(Object(C.jsx)(r.a.StrictMode,{children:Object(C.jsx)(L,{})}),document.getElementById("root")),P()}},[[187,1,2]]]);
//# sourceMappingURL=main.ad95859e.chunk.js.map