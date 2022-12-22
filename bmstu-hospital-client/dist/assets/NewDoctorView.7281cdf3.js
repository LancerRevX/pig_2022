import{d as f,u as h,J as F,j as C,K as w,L as B,U as N,B as g,_ as b,r as S,o as r,c as l,f as V,a as s,G as d,w as o,b as i,v as n,h as m,k as c,F as y,l as E,t as v,p as T,e as I}from"./index.af4eaa39.js";import{D as k,L as $}from"./LoadingIndicator.82b4d7a6.js";var D=(u=>(u[u.NEW=0]="NEW",u[u.EXISTING=1]="EXISTING",u))(D||{});const _=f({data:()=>({doctor:{},doctorUser:{},username:"",password:"",specialities:[],users:[],userStore:h(),userType:0,UserType:D,DataStatus:k}),computed:{id(){return this.$route.params.id?Number(this.$route.params.id):null}},methods:{async getUsers(){let u=await F();this.users=u.filter(t=>!t.doctor)},async getSpecialities(){this.specialities=await C(!1)},async saveDoctor(){try{this.userType==0&&(this.doctorUser=await w(this.username,this.password)),await B(this.doctor,this.doctorUser),alert(`\u041D\u043E\u0432\u044B\u0439 ${this.doctor.speciality.name} \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D.`)}catch(u){console.log(u),u instanceof N?alert("\u0414\u0430\u043D\u043D\u043E\u0435 \u0438\u043C\u044F \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F \u0443\u0436\u0435 \u0437\u0430\u043D\u044F\u0442\u043E!"):u instanceof g?alert("\u0417\u0430\u043F\u043E\u043B\u043D\u0438\u0442\u0435 \u0432\u0441\u0435 \u043F\u043E\u043B\u044F!"):alert("\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u0430\u044F \u043E\u0448\u0438\u0431\u043A\u0430!")}}},async created(){await this.getSpecialities(),await this.getUsers(),this.doctor={id:-1,firstName:"",lastName:"",patronymic:"",speciality:this.specialities[0],gender:1,cost:0,name:"",photo:"",work_record:0},this.doctorUser=this.users[0]},components:{LoadingIndicator:$}});const a=u=>(T("data-v-a1dcd7a7"),u=u(),I(),u),L={class:"edit-doctor-box"},G=a(()=>s("h1",null," \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043D\u043E\u0432\u043E\u0433\u043E \u0432\u0440\u0430\u0447\u0430 ",-1)),W={key:1,class:"doctor-box"},X={class:"fields-box"},M=a(()=>s("span",null,"\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C",-1)),R={class:"switcher-box"},j=["value"],q=["value"],A={key:0,class:"fields-box"},J=a(()=>s("span",null,"\u0418\u043C\u044F \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F",-1)),K=a(()=>s("span",null,"\u041F\u0430\u0440\u043E\u043B\u044C",-1)),z={key:1,class:"fields-box"},H=["value"],O={class:"fields-box"},P=a(()=>s("span",null,"\u0418\u043C\u044F",-1)),Q=a(()=>s("span",null,"\u0424\u0430\u043C\u0438\u043B\u0438\u044F",-1)),Y=a(()=>s("span",null,"\u041E\u0442\u0447\u0435\u0441\u0442\u0432\u043E",-1)),Z=a(()=>s("span",null,"\u0421\u043F\u0435\u0446\u0438\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u044C",-1)),x=["value"],uu=a(()=>s("span",null,"\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C \u043F\u0440\u0438\u0451\u043C\u0430",-1)),eu=a(()=>s("span",null,"\u041F\u043E\u043B",-1)),su={class:"switcher-box"};function tu(u,t,ou,au,ru,lu){var p;const U=S("LoadingIndicator");return r(),l("div",L,[G,(p=u.userStore.user)!=null&&p.manager?(r(),l("div",W,[s("div",X,[M,s("div",R,[s("label",null,[d(" \u041D\u043E\u0432\u044B\u0439 "),o(s("input",{type:"radio","onUpdate:modelValue":t[0]||(t[0]=e=>u.userType=e),value:u.UserType.NEW},null,8,j),[[i,u.userType]])]),s("label",null,[d(" \u0421\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u044E\u0449\u0438\u0439 "),o(s("input",{type:"radio","onUpdate:modelValue":t[1]||(t[1]=e=>u.userType=e),value:u.UserType.EXISTING},null,8,q),[[i,u.userType]])])])]),u.userType==u.UserType.NEW?(r(),l("div",A,[J,o(s("input",{type:"text","onUpdate:modelValue":t[2]||(t[2]=e=>u.username=e)},null,512),[[n,u.username]]),K,o(s("input",{type:"text","onUpdate:modelValue":t[3]||(t[3]=e=>u.password=e)},null,512),[[n,u.password]])])):m("",!0),u.userType==u.UserType.EXISTING?(r(),l("div",z,[o(s("select",{class:"user-select","onUpdate:modelValue":t[4]||(t[4]=e=>u.doctorUser=e)},[(r(!0),l(y,null,E(u.users,e=>(r(),l("option",{key:e.id,value:e},v(e.username),9,H))),128))],512),[[c,u.doctorUser]])])):m("",!0),s("div",O,[P,o(s("input",{type:"text","onUpdate:modelValue":t[5]||(t[5]=e=>u.doctor.firstName=e)},null,512),[[n,u.doctor.firstName]]),Q,o(s("input",{type:"text","onUpdate:modelValue":t[6]||(t[6]=e=>u.doctor.lastName=e)},null,512),[[n,u.doctor.lastName]]),Y,o(s("input",{type:"text","onUpdate:modelValue":t[7]||(t[7]=e=>u.doctor.patronymic=e)},null,512),[[n,u.doctor.patronymic]]),Z,o(s("select",{"onUpdate:modelValue":t[8]||(t[8]=e=>u.doctor.speciality=e)},[(r(!0),l(y,null,E(u.specialities,e=>(r(),l("option",{key:e.id,value:e},v(e.name),9,x))),128))],512),[[c,u.doctor.speciality]]),uu,o(s("input",{type:"number","onUpdate:modelValue":t[9]||(t[9]=e=>u.doctor.cost=e)},null,512),[[n,u.doctor.cost]]),eu,s("div",su,[s("label",null,[d(" \u041C\u0443\u0436\u0447\u0438\u043D\u0430 "),o(s("input",{type:"radio","onUpdate:modelValue":t[10]||(t[10]=e=>u.doctor.gender=e),value:1},null,512),[[i,u.doctor.gender]])]),s("label",null,[d(" \u0416\u0435\u043D\u0449\u0438\u043D\u0430 "),o(s("input",{type:"radio","onUpdate:modelValue":t[11]||(t[11]=e=>u.doctor.gender=e),value:0},null,512),[[i,u.doctor.gender]])])]),s("input",{type:"submit",value:"\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C",onClick:t[12]||(t[12]=e=>u.saveDoctor())})])])):(r(),V(U,{key:0,"data-status":u.DataStatus.Forbidden},null,8,["data-status"]))])}const iu=b(_,[["render",tu],["__scopeId","data-v-a1dcd7a7"]]);export{iu as default};