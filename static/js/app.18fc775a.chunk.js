(this.webpackJsonp=this.webpackJsonp||[]).push([[0],{191:function(e,t,n){"use strict";n.d(t,"a",(function(){return se}));n(203);var r=n(59),i=n(304),a=n(182),o=n(189),c=n(192),s=Object(o.a)("https://yzhbekhonsuhaptmxckk.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6aGJla2hvbnN1aGFwdG14Y2trIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDQ0MjgzMzcsImV4cCI6MTk2MDAwNDMzN30.8ZNeKaJZsPvHs9UFYPT4AM2CB4LHyZIHh5pSPuuvXks",{localStorage:c.a,detectSessionInUrl:!1}),l=n(32),d=n(34),u=n(306),h=n(3),j=n.n(h),b=n(11),f=n.n(b),g=n(4),p=n.n(g),O=n(2),x=n(15),y=n(6),m=n(60),v=n(7),w=n(72),k=n(58),S=n(98),C=n(99),I=n(311),P=n(40),W=n(190),z=n(131),R=n(302),T=n(308),M=n(310),D=n(309),A=n(305),U=n(301),B=n(10),E=n(307),N=n(299),J=n(300),L=n(193);var F=n(0);function q(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function H(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?q(Object(n),!0).forEach((function(t){j()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):q(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}M.a({handleNotification:function(){return p.a.async((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",{shouldShowAlert:!0,shouldPlaySound:!1,shouldSetBadge:!1});case 1:case"end":return e.stop()}}),null,null,null,Promise)}});var V=T.a,X=Object(z.a)(new Date);var Z=v.a.create({container:{flex:1,backgroundColor:"#fff"}}),G=function(){var e=Object(P.k)(),t=Object(P.m)(),n=D.c(),r=f()(n,1)[0];function i(){(function(){var e,t,n,r,i,a;return p.a.async((function(o){for(;;)switch(o.prev=o.next){case 0:if(!L.a){o.next=21;break}return o.next=3,p.a.awrap(D.a());case 3:if(t=o.sent,n=t.status,r=n,"granted"===n){o.next=12;break}return o.next=9,p.a.awrap(D.b());case 9:i=o.sent,a=i.status,r=a;case 12:if("granted"===r){o.next=15;break}return alert("Failed to get push token for push notification!"),o.abrupt("return");case 15:return o.next=17,p.a.awrap(E.a());case 17:e=o.sent.data,console.log(e),o.next=22;break;case 21:return o.abrupt("return",alert("Must use physical device for Push Notifications"));case 22:return"android"===B.a.OS&&N.a("default",{name:"default",importance:J.a.MAX,vibrationPattern:[0,250,250,250],lightColor:"#FF231F7C"}),o.abrupt("return",e);case 24:case"end":return o.stop()}}),null,null,null,Promise)})().then((function(e){e&&s.from("notificationSettings").insert({token:e,all:!0}).then((function(e){e.data?alert("Te avisaremos cuando se publiquen una nuevas funciones"):alert("Hubo un problema al registrarte")}))}))}var a=Object(O.useState)(X),o=f()(a,2),c=o[0],u=o[1],h=Object(O.useState)({data:null,error:null,loading:!0}),j=f()(h,2),b=j[0],g=b.data,v=b.error,z=b.loading,T=j[1],M=Object(C.a)().width,q=Math.min(M,800),G=Math.round(q/200),Y=q/G;Object(O.useEffect)((function(){var t=Object(A.a)(c,X,{locale:V}).replace(/a las*/i,"").replace(/\d+:\d\d$/i,"").replace(/^el/i,"").trim();t=t.charAt(0).toUpperCase()+t.slice(1),e.setOptions({headerRight:function(){return Object(F.jsxs)(y.a,{style:{flexDirection:"row"},children:[Object(F.jsx)(l.a,{style:{padding:5,paddingRight:6,paddingLeft:4,backgroundColor:"rgba(0,0,0,0.1)",borderRadius:"50%",marginRight:5},onPress:function(){return u(Object(U.a)(c,-1))},children:Object(F.jsx)(d.b,{strokeWidth:4,width:20,height:20})}),Object(F.jsx)(l.a,{style:{padding:5,paddingRight:4,paddingLeft:6,backgroundColor:"rgba(0,0,0,0.1)",borderRadius:"50%"},onPress:function(){return u(Object(U.a)(c,1))},children:Object(F.jsx)(d.c,{strokeWidth:4,width:20,height:20})})]})},headerTitle:function(){return Object(F.jsx)(y.a,{style:{display:"flex",flexDirection:"row",alignItems:"center"},children:Object(F.jsx)(l.a,{onPress:function(){return u(X)},children:Object(F.jsx)(x.a,{style:{fontSize:17,fontWeight:"600",marginHorizontal:5,width:140,textAlign:"center"},children:t})})})}})}),[e,c]);var Q=Object(O.useCallback)((function(){var e,n,r;return p.a.async((function(i){for(;;)switch(i.prev=i.next){case 0:return T({error:null,data:null,loading:!0}),i.prev=1,i.next=4,p.a.awrap(s.from("presentations").select("\n            id,\n            date,\n            room,\n            isFreeEntry,\n            movie (\n              id,\n              title,\n              posterUrl,\n              duration,\n              tmdbRating,\n              year,\n              classification\n            )\n          ").eq("location",t.params.location).order("date",{ascending:!0}).gte("date",c.toISOString()).lte("date",Object(R.a)(c).toISOString()));case 4:if(e=i.sent,n=e.data,!(r=e.error)){i.next=10;break}throw console.log(r),new Error("Could not get presentations");case 10:T({data:n,loading:!1,error:r}),i.next=17;break;case 13:i.prev=13,i.t0=i.catch(1),console.log(i.t0),T((function(e){return H(H({},e),{},{loading:!1,error:i.t0})}));case 17:case"end":return i.stop()}}),null,null,[[1,13]],Promise)}),[c]);return Object(O.useEffect)((function(){Q()}),[c]),g?0===g.length?Object(F.jsxs)(y.a,{style:[Z.container,{justifyContent:"center",alignItems:"center",padding:20}],children:[Object(F.jsx)(x.a,{style:{color:"black",textAlign:"center",fontSize:20,fontWeight:"700",opacity:.9},children:"No hemos encontrado funciones para este d\xeda, intenta revisar despu\xe9s"}),null!=r&&r.granted?null:Object(F.jsxs)(l.a,{onPress:function(){return i()},children:[Object(F.jsx)(x.a,{style:{marginTop:30,opacity:.6,fontWeight:"600"},children:"Si quieres tambi\xe9n podemos avisarte"}),Object(F.jsxs)(y.a,{style:{display:"flex",flexDirection:"row",alignContent:"center",justifyContent:"center"},children:[Object(F.jsx)(d.a,{width:15,height:15,stroke:"black",fill:"black"}),Object(F.jsx)(x.a,{style:{alignItems:"center",fontWeight:"800",color:"black",marginLeft:5},children:"recibir notificaciones"})]})]})]}):Object(F.jsx)(m.a,{refreshControl:Object(F.jsx)(w.a,{onRefresh:function(){return Q()},refreshing:!1}),numColumns:G,data:g,renderItem:function(t){var n,r=t.item;return Object(F.jsxs)(l.a,{onPress:function(){return e.navigate("MovieScreen",{id:r.movie.id,title:r.movie.title,posterUrl:r.movie.posterUrl})},style:{width:Y,padding:10,paddingBottom:20},children:[Object(F.jsx)(y.a,{style:{shadowColor:"#000",shadowOffset:{width:0,height:0},shadowOpacity:.2,shadowRadius:4},children:Object(F.jsxs)(k.a,{style:{width:"100%",height:1.48*Y,borderRadius:5,borderWidth:1,borderColor:"#ddd",overflow:"hidden"},resizeMode:"cover",source:{uri:r.movie.posterUrl},children:[Object(F.jsxs)(I.a,{intensity:25,tint:"dark",style:{padding:5,display:"flex",flexDirection:"row",justifyContent:"space-between"},children:[Object(F.jsxs)(x.a,{style:{fontSize:10,borderRadius:4,overflow:"hidden",color:"white",paddingHorizontal:5,fontWeight:"700"},children:["Sala ",r.room]}),Object(F.jsx)(x.a,{style:{fontWeight:"900",color:"white",fontSize:10},children:r.isFreeEntry?"Libre":""}),Object(F.jsx)(x.a,{style:{fontSize:10,color:"white",fontWeight:"700"},children:Object(W.a)(r.date,"America/Mexico_City","h:mm aaa")})]}),Object(F.jsx)(x.a,{style:{position:"absolute",bottom:0,right:0,fontWeight:"800",opacity:.2,fontSize:8},children:r.id})]})}),Object(F.jsx)(x.a,{style:{marginTop:5,color:"black",width:"100%",fontWeight:"700",fontSize:18,textAlign:"center"},children:null!=(n=r.movie.title)?n:"No title"}),Object(F.jsxs)(x.a,{style:{color:"#666",textAlign:"center",fontSize:13,marginTop:2.5},children:[r.movie.year," \xb7 ",r.movie.duration," min \xb7"," ",r.movie.classification]}),Object(F.jsx)(y.a,{style:{marginTop:2.5,display:"flex",flexDirection:"row",justifyContent:"center",marginBottom:10},children:Object(F.jsx)(y.a,{style:{display:"flex",flexDirection:"row"},children:new Array(Math.round(r.movie.tmdbRating/2)).fill(null).map((function(e,t){return Object(F.jsx)(d.h,{width:12.5,height:12.5,stroke:"none",fill:"gold"},t)}))})})]})},columnWrapperStyle:{maxWidth:800,margin:0,marginHorizontal:"auto"},contentInsetAdjustmentBehavior:"automatic",style:Z.container},G):z?Object(F.jsxs)(y.a,{style:[Z.container,{justifyContent:"center",alignItems:"center"}],children:[Object(F.jsx)(S.a,{size:"large"}),Object(F.jsx)(x.a,{style:{color:"black",marginTop:4,fontWeight:"800"},children:"Obteniendo cartelera"})]}):Object(F.jsx)(y.a,{style:[Z.container,{justifyContent:"center",alignItems:"center"}],children:Object(F.jsxs)(x.a,{style:{color:"black",marginTop:4,fontWeight:"800"},children:["Error",JSON.stringify(v)]})})},Y=n(45),Q=n(303),K=n(194);function $(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function _(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?$(Object(n),!0).forEach((function(t){j()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):$(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var ee=v.a.create({characteristicContainer:{padding:20,display:"flex",flexDirection:"row",justifyContent:"space-evenly",alignContent:"flex-start",alignItems:"flex-start"},characteristicIcon:{marginBottom:5},characteristic:{display:"flex",alignItems:"center",justifyContent:"center"},classificationText:{color:"white",fontWeight:"700",fontSize:12,textAlign:"center",backgroundColor:"black",padding:1,paddingHorizontal:10,borderRadius:6,overflow:"hidden"}}),te=function(){var e,t,n,i,a=Object(P.m)(),o=null==(e=a.params)?void 0:e.id,c=Object(O.useState)({data:{title:null==(t=a.params)?void 0:t.title,posterUrl:null==(n=a.params)?void 0:n.posterUrl},error:null,loading:!0}),l=f()(c,2),u=l[0].data,h=l[1];return Object(O.useEffect)((function(){!function(){var e,t,n;p.a.async((function(r){for(;;)switch(r.prev=r.next){case 0:return h({error:null,data:null,loading:!0}),r.prev=1,r.next=4,p.a.awrap(s.from("movies").select("\n            id,\n            title,\n            posterUrl,\n            duration,\n            tmdbRating,\n            year,\n            classification,\n            description,\n            trailerUrl,\n            director (\n                name\n            )\n            ").eq("id",o).single());case 4:if(e=r.sent,t=e.data,!(n=e.error)){r.next=10;break}throw console.log(n),new Error("Could not get presentations");case 10:h({data:t,loading:!1,error:n}),r.next=17;break;case 13:r.prev=13,r.t0=r.catch(1),console.log(r.t0),h((function(e){return _(_({},e),{},{loading:!1,error:r.t0})}));case 17:case"end":return r.stop()}}),null,null,[[1,13]],Promise)}()}),[]),Object(F.jsxs)(Y.a,{automaticallyAdjustContentInsets:!0,children:[Object(F.jsx)(r.a,{barStyle:"light-content"}),Object(F.jsxs)(Q.a,{edges:["bottom","left","right"],children:[Object(F.jsxs)(k.a,{style:{width:"100%",height:250,position:"relative"},source:{uri:null==u?void 0:u.posterUrl,cache:"force-cache"},children:[Object(F.jsx)(y.a,{style:{position:"absolute",top:0,left:0,width:"100%",height:"100%",backgroundColor:"rgba(0,0,0,0.4)",paddingTop:50}}),Object(F.jsx)(x.a,{style:{position:"absolute",bottom:0,left:0,color:"white",fontSize:35,fontWeight:"600",padding:20},children:null==u?void 0:u.title})]}),Object(F.jsxs)(y.a,{style:ee.characteristicContainer,children:[(null==u||null==(i=u.director)?void 0:i.name)&&Object(F.jsxs)(y.a,{style:ee.characteristic,children:[Object(F.jsx)(d.e,{color:"black",style:ee.characteristicIcon}),Object(F.jsx)(x.a,{style:{fontWeight:"700",maxWidth:80,textAlign:"center"},children:u.director.name})]}),Object(F.jsxs)(y.a,{style:ee.characteristic,children:[Object(F.jsx)(d.d,{color:"black",style:ee.characteristicIcon}),Object(F.jsxs)(x.a,{style:{color:"black",textAlign:"center",fontWeight:"700"},children:[null==u?void 0:u.duration," min"]})]}),Object(F.jsxs)(y.a,{style:ee.characteristic,children:[Object(F.jsx)(d.i,{color:"black",style:ee.characteristicIcon}),Object(F.jsx)(x.a,{style:ee.classificationText,children:null==u?void 0:u.classification})]}),null!=u&&u.tmdbRating?Object(F.jsxs)(y.a,{style:ee.characteristic,children:[Object(F.jsx)(d.h,{color:"black",style:ee.characteristicIcon}),Object(F.jsx)(x.a,{style:{fontWeight:"700"},children:null==u?void 0:u.tmdbRating})]}):null]}),null!=u&&u.description?Object(F.jsxs)(y.a,{style:{padding:20},children:[Object(F.jsx)(x.a,{style:{fontWeight:"700",color:"black",paddingVertical:10,fontSize:18},children:"Description"}),Object(F.jsx)(x.a,{style:{color:"black"},children:u.description})]}):null,null!=u&&u.trailerUrl?Object(F.jsxs)(y.a,{style:{padding:20},children:[Object(F.jsx)(x.a,{style:{fontWeight:"700",color:"black",paddingVertical:10,fontSize:18},children:"Trailer"}),Object(F.jsx)(K.a,{style:{flex:1,width:"100%",height:200},javaScriptEnabled:!0,source:{uri:u.trailerUrl}})]}):null]})]})},ne=n(96);var re=function(){return Object(F.jsxs)(y.a,{style:{flex:1,padding:20,backgroundColor:"white"},children:[Object(F.jsx)(r.a,{animated:!0,barStyle:"light-content"}),Object(F.jsx)(x.a,{style:{fontWeight:"600",opacity:.8,textAlign:"center",marginBottom:30,marginTop:10,fontSize:16},children:"App no oficial de las Cinetecas de M\xe9xico"}),Object(F.jsx)(y.a,{style:{alignItems:"center"},children:Object(F.jsxs)(l.a,{style:{borderWidth:1,borderRadius:10,borderColor:"#ddd",backgroundColor:"#f6f6f6",display:"flex",justifyContent:"center",alignItems:"center",alignContent:"center",flexDirection:"row",padding:5,maxWidth:250,marginBottom:10,width:"100%"},onPress:function(){return ne.a.openURL("https://github.com/cesargdm/mexteca")},children:[Object(F.jsx)(x.a,{style:{fontWeight:"700",marginRight:5},children:"Github"}),Object(F.jsx)(d.f,{fill:"black",stroke:0})]})}),Object(F.jsxs)(y.a,{style:{marginVertical:10},children:[Object(F.jsx)(x.a,{style:{fontWeight:"700",fontSize:18},children:"Aviso"}),Object(F.jsx)(x.a,{children:"No nos hacemos responsables por cambios en los horarios, funciones, disponibilidad o cualquier cambio de la informaci\xf3n aqu\xed presentada."})]}),Object(F.jsxs)(y.a,{style:{marginVertical:10},children:[Object(F.jsx)(x.a,{style:{fontWeight:"700",fontSize:18},children:"Cr\xe9ditos"}),Object(F.jsx)(x.a,{children:"- Cineteca Mexiquense"}),Object(F.jsx)(x.a,{children:"- The Movie Database"})]})]})},ie=[{id:"mexiquense",title:"Mexiquense",image:n(287),address:"Boulevar, Jes\xfas Reyes Heroles 302, San Buenaventura, 50110 Toluca, MEX"}];var ae=function(){var e=Object(P.k)();return Object(F.jsx)(m.a,{style:{flex:1,backgroundColor:"white"},data:ie,renderItem:function(t){var n=t.item;return Object(F.jsx)(y.a,{style:{padding:20,shadowColor:"#000",shadowOffset:{width:0,height:0},shadowOpacity:.2,shadowRadius:4},children:Object(F.jsx)(l.a,{style:{borderRadius:15,overflow:"hidden"},onPress:function(){return e.navigate("ListingsScreen",{location:n.id})},children:Object(F.jsx)(k.a,{style:{width:"100%",height:150},resizeMode:"cover",source:n.image,children:Object(F.jsxs)(y.a,{style:{padding:10,backgroundColor:"rgba(0,0,0,0.4)",width:"100%",height:"100%",display:"flex",justifyContent:"space-between"},children:[Object(F.jsx)(x.a,{style:{fontSize:32,fontWeight:"800",color:"white"},children:n.title}),Object(F.jsx)(x.a,{style:{fontWeight:"800",fontSize:12,color:"white"},children:n.address})]})})})})}})},oe=Object(u.a)();var ce=function(){return Object(F.jsxs)(oe.Navigator,{initialRouteName:"LocationsScreen",children:[Object(F.jsx)(oe.Screen,{options:function(e){var t=e.navigation;return{headerTintColor:"black",title:"Cinetecas",headerLeft:function(){return Object(F.jsx)(l.a,{onPress:function(){return t.navigate("AboutScreen")},children:Object(F.jsx)(d.g,{width:30,height:30})})}}},name:"LocationsScreen",component:ae}),Object(F.jsx)(oe.Screen,{options:{headerTintColor:"black",title:"Hoy",headerBackTitleVisible:!1},name:"ListingsScreen",component:G}),Object(F.jsx)(oe.Screen,{options:{headerTransparent:!0,headerTintColor:"white",title:"",headerBackTitle:"",headerBackTitleVisible:!1},name:"MovieScreen",component:te}),Object(F.jsx)(oe.Screen,{options:function(e){var t=e.navigation;return{title:"Mexteca",presentation:"modal",headerLeft:function(){return Object(F.jsx)(l.a,{onPress:function(){return t.goBack()},children:Object(F.jsx)(d.j,{color:"black",height:30,width:30})})}}},name:"AboutScreen",component:re})]})};function se(){return Object(F.jsxs)(F.Fragment,{children:[Object(F.jsx)(r.a,{barStyle:"dark-content"}),Object(F.jsx)(a.a,{value:s,children:Object(F.jsx)(i.a,{children:Object(F.jsx)(ce,{})})})]})}},202:function(e,t,n){e.exports=n(288)},287:function(e,t,n){e.exports=n.p+"static/media/mexiquense.ce6cc1de.jpg"}},[[202,1,2]]]);
//# sourceMappingURL=app.18fc775a.chunk.js.map