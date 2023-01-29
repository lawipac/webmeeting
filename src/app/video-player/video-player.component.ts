import {ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent {
  @Input()  videoId: string= "468176795";
  @Input()  shown: boolean = false;
  @Output() closeButtonClicked: EventEmitter<boolean> = new EventEmitter<boolean>();

  showPlayer = true;
  loading = true;
  constructor(private sanitizer: DomSanitizer, private cdRef : ChangeDetectorRef,) {
  }
  onCloseClicked(){
    this.closeButtonClicked.emit(this.shown);
    this.showPlayer = ! this.showPlayer;
    this.loading = ! this.loading;
  }

  videoSrc(): string {
    const url = "https://player.vimeo.com/video/" + this.videoId + "?h=457419dead&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479";
    console.log (url);
    return url;
  }

}
