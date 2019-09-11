import { Injectable, EventEmitter } from '@angular/core';
import { OneSignal, OSNotification, OSNotificationPayload } from '@ionic-native/onesignal/ngx';
import { Storage } from '@ionic/storage';


@Injectable({
  providedIn: 'root'
})
export class PushService {
  userID: string;
mensajes: OSNotificationPayload [] = [];
pushListener = new EventEmitter<OSNotificationPayload>();

  constructor(private oneSignal: OneSignal,
              private storage: Storage) { 

                this.cargarMensajes();
              }
async borrarMensajes(){
 await this.storage.clear();
 this.mensajes = [];
 this.guardarMensajes();
}
  configuracionInicial(){
    this.oneSignal.startInit('d2c410a0-d9f1-4129-af23-adde4b8433cc', '43898214152');

this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

this.oneSignal.handleNotificationReceived().subscribe(( res ) => {
 // do something when notification is received
 this.notificacionRecibida(res);
});

this.oneSignal.handleNotificationOpened().subscribe(async ( noti) => {
  // do something when a notification is opened
  await this.notificacionRecibida(noti.notification);
});


this.oneSignal.getIds().then(info =>{
  this.userID = info.userId;

});
this.oneSignal.endInit();
  }


   async notificacionRecibida( noti: OSNotification ){
    await this.cargarMensajes();
    const payload = noti.payload;
    const existePush = this.mensajes.find( men =>{
      men.notificationID === payload.notificationID
    });
    if(existePush){
      return;
    }
    this.mensajes.unshift(payload);
    this.pushListener.emit(payload);
    await this.guardarMensajes();
  }
   async getMensajes(){
    await this.cargarMensajes();
    return [...this.mensajes];
  }
guardarMensajes(){
  this.storage.set('mensajes', this.mensajes);
}
 async cargarMensajes(){
 this.mensajes =  await this.storage.get('mensajes') || [];
 return this.mensajes;
} 
} 
