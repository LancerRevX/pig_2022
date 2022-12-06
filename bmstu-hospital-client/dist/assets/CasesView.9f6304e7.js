import{d as r,_ as d,o,a as l,b as u,F as i,e as c,t as a}from"./index.eb74ec1e.js";const h=r({data:()=>({cases:[]}),methods:{async getCases(){try{let s=await(await fetch("http://127.0.0.1:8000/api/cases/",{method:"GET"})).json();for(let e of s)e.patient=await(await fetch(e.patient)).json(),e.doctor=await(await fetch(e.doctor)).json(),e.ward=await(await fetch(e.ward)).json();this.cases=s}catch(n){console.log(n)}}},created(){this.getCases()}}),p={class:"wards-block"},f=u("h2",null,"\u0421\u043F\u0438\u0441\u043E\u043A \u043F\u0430\u043B\u0430\u0442",-1),m={class:"wards-table"},w=u("thead",null,[u("tr",null,[u("th",null,"\u0414\u0430\u0442\u0430 \u043F\u043E\u0441\u0442\u0443\u043F\u043B\u0435\u043D\u0438\u044F"),u("th",null,"\u0412\u044B\u043F\u0438\u0441\u0430\u043D"),u("th",null,"\u0414\u0430\u0442\u0430 \u0432\u044B\u043F\u0438\u0441\u043A\u0438"),u("th",null,"\u041F\u0430\u0446\u0438\u0435\u043D\u0442"),u("th",null,"\u0412\u0440\u0430\u0447"),u("th",null,"\u041D\u043E\u043C\u0435\u0440 \u043F\u0430\u043B\u0430\u0442\u044B"),u("th",null,"\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435")])],-1);function F(n,s,e,_,B,D){return o(),l("div",p,[f,u("table",m,[w,u("tbody",null,[(o(!0),l(i,null,c(n.cases,t=>(o(),l("tr",{key:t.id},[u("td",null,a(t.start_date),1),u("td",null,a(t.active?"\u041D\u0435\u0442":"\u0414\u0430"),1),u("td",null,a(t.end_date||"\u041D\u0435\u0442"),1),u("td",null,a([t.patient.last_name,t.patient.first_name,t.patient.patronymic].join(" ")),1),u("td",null,a([t.doctor.last_name,t.doctor.first_name,t.doctor.patronymic].join(" ")),1),u("td",null,a(t.ward?t.ward.number:"\u041D\u0435\u0442"),1),u("td",null,a(t.description),1)]))),128))])])])}const b=d(h,[["render",F]]);export{b as default};
