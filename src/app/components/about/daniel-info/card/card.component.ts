import { Component, OnInit, Input } from '@angular/core';
import { ProjectCard } from '../daniel-info.component';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() projectCard: ProjectCard;


  constructor() { }

  ngOnInit() {
    console.log(this.projectCard);
  }

}
