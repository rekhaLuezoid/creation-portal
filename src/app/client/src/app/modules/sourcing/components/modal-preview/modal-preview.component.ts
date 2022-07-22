import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-preview',
  templateUrl: './modal-preview.component.html',
  styleUrls: ['./modal-preview.component.scss']
})
export class ModalPreviewComponent implements OnInit {
  @Input() showQuestionModal: boolean = false;
  @Output() showQuestionOutput = new EventEmitter();
  
  questionList = [
    {
      question: 'This is a demo question',
      options: [
        'A',
        'B',
        'C',
        'D',
      ],
      questionNo: 1,
      class: 6,

    },
  ]

  constructor() { }

  ngOnInit(): void {
  }

  onModalClose(){
    this.showQuestionOutput.emit();
  }

}
