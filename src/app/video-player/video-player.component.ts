import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import Player from '@vimeo/player';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent {
  @Output() closeButtonClicked: EventEmitter<boolean> = new EventEmitter<boolean>();
  //@ts-ignore
  @ViewChild('playerContainer') playerContainer: ElementRef;
  player: any;

  showPlayer = false;
  loading = true;
  constructor() {
  }

  onCloseClicked(){
    this.closeButtonClicked.emit(true);
    this.showPlayer = ! this.showPlayer;
    this.loading = ! this.loading;
  }

  start (videoId: number) {

    this.player = new Player(this.playerContainer.nativeElement, {
      id: videoId,
      responsive: true
    });

    this.player.on('loaded', ()=>{
      this.showPlayer = true;
      this.loading = false;
    });
    this.player.on('play', function () {
      console.log('played the video!');
    });
  }

}
