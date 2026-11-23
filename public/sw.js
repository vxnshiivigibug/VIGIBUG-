self.addEventListener("install",function(){self.skipWaiting()});
self.addEventListener("activate",function(e){e.waitUntil(self.clients.claim())});
self.addEventListener("fetch",function(e){
 var u=new URL(e.request.url);
 if(e.request.method!=="GET"||u.origin!==location.origin||u.pathname.indexOf("/api/")===0||/vigilance\.json$/.test(u.pathname))return;
 e.respondWith(fetch(e.request).then(function(r){var c=r.clone();caches.open("vx-v1").then(function(x){x.put(e.request,c)});return r}).catch(function(){return caches.match(e.request)}));
});
self.addEventListener("push",function(e){
 var d={};try{d=e.data.json()}catch(x){}
 e.waitUntil(self.registration.showNotification(d.title||"Vigibug",{body:d.body||"",icon:"/icon-192.png",badge:"/icon-192.png",tag:"vigibug",renotify:true,requireInteraction:!!d.high,data:{url:"/vigibug.html"}}));
});
self.addEventListener("notificationclick",function(e){
 e.notification.close();
 e.waitUntil(self.clients.matchAll({type:"window"}).then(function(l){for(var i=0;i<l.length;i++)if("focus" in l[i])return l[i].focus();return self.clients.openWindow("/vigibug.html")}));
});
