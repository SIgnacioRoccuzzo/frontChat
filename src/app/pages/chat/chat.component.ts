import { Component, ElementRef, ViewChild } from '@angular/core';
import { io } from 'socket.io-client';
import JSConfetti from 'js-confetti'

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {

  socket = io('https://chatcrack.onrender.com');

  data: any = {};
  mensajes: any[] = [];
  numClientes: number = 0
  audioOn: boolean = true;

  @ViewChild('divContainer') divContainer!: ElementRef

  ngOnInit() {
    this.socket.on('mensaje_chat', data => {
      if (this.audioOn && (data.socket_id !== this.socket.id)) {
        let audio: HTMLAudioElement = new Audio('https://cdn.videvo.net/videvo_files/audio/premium/audio0303/watermarked/_Soundstorm%206_Tones-AlertDing-Melodic-H-2_B04-08417_preview.mp3');
        audio.play();
      }

      //cada vez que llegue un nuevo mensa, lo ponemos en el array y lo pintamos en el HTML
      this.mensajes.push(data);
      this.divContainer.nativeElement.scrollTop = this.divContainer.nativeElement.scrollHeight;
    })
    this.socket.on('clientes_conectados', num => {
      const jsConfetti = new JSConfetti()
      jsConfetti.addConfetti();
      this.numClientes = num;

    })
  }

  onClick() {
    this.data.socket_id = this.socket.id;//para agregarle un valor al objeto this.data
    this.socket.emit('mensaje_chat', this.data);
  }
}
