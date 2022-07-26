import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { holdReady } from 'jquery';
import { QuestionPreviewService } from './question-preview.service';

@Component({
  selector: 'app-modal-preview',
  templateUrl: './modal-preview.component.html',
  styleUrls: ['./modal-preview.component.scss']
})
export class ModalPreviewComponent implements OnInit {
  @Input() showQuestionModal: boolean = false;
  @Output() showQuestionOutput = new EventEmitter();
  @Input() currentIdentifier:string 

  questionList = [];

  constructor(private _questionPreviewService: QuestionPreviewService) { }

  ngOnInit(): void {
    this._questionPreviewService.getQuestionsData([this.currentIdentifier]).subscribe(resp => {
      console.log(resp);
      if (resp.responseCode.toLowerCase() === 'ok') {
        this.questionList = resp.result.questions
        console.log(this.questionList);
      }
    });
  }

  onModalClose() {
    this.showQuestionOutput.emit();
  }

  
}
