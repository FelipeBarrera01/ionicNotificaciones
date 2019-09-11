import { Component, OnInit } from '@angular/core';
import { PushService } from '../services/push.service';
import { OSNotificationPayload } from '@ionic-native/onesignal/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  mensaje: OSNotificationPayload [] = [];
  constructor(public servicio: PushService) {

  }
  async ionViewWillEnter(){
    this.mensaje=  await this.servicio.getMensajes();
  }
ngOnInit(){
  this.servicio.pushListener.subscribe(noti =>{
    this.mensaje.unshift(noti);
  });
}
async borrarMensajes(){
 await   this.servicio.borrarMensajes();
 this.mensaje = [];
}
}
