import{d as _,_ as f,o as u,a as n,b as t,F as c,e as h,t as d}from"./index.eb74ec1e.js";const m=_({data:()=>({wards:[]}),methods:{async getWards(){try{let l=await(await fetch("http://127.0.0.1:8000/api/wards/",{method:"GET"})).json();for(let o of l)for(let e=0;e<o.patients.length;e++){let i=await(await fetch(o.patients[e])).json();o.patients[e]=i}console.log(l),this.wards=l}catch(a){console.log(a)}}},created(){this.getWards()}}),w={class:"wards-block"},b=t("h2",null,"\u0421\u043F\u0438\u0441\u043E\u043A \u043F\u0430\u043B\u0430\u0442",-1),g={class:"wards-table"},y=t("thead",null,[t("tr",null,[t("th",null,"\u041D\u043E\u043C\u0435\u0440"),t("th",null,"\u041A\u043E\u043B-\u0432\u043E \u043C\u0435\u0441\u0442"),t("th",null,"\u0417\u0430\u043D\u044F\u0442\u043E \u043C\u0435\u0441\u0442"),t("th",null,"\u041F\u0430\u0446\u0438\u0435\u043D\u0442\u044B")])],-1),E={class:"inner-table"};function B(a,l,o,e,p,i){return u(),n("div",w,[b,t("table",g,[y,t("tbody",null,[(u(!0),n(c,null,h(a.wards,s=>(u(),n("tr",{key:s.id},[t("td",null,d(s.number),1),t("td",null,d(s.capacity),1),t("td",null,d(s.patients.length),1),t("td",null,[t("table",E,[(u(!0),n(c,null,h(s.patients,r=>(u(),n("tr",{key:r.id},[t("td",null,d([r.last_name,r.first_name,r.patronymic].join(" ")),1)]))),128))])])]))),128))])])])}const k=f(m,[["render",B]]);export{k as default};