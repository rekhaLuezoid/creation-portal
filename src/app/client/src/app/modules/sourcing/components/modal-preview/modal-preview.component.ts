import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {ResourceService} from '@sunbird/shared';
import {QuestionPreviewService} from './question-preview.service';
import * as _ from 'lodash-es';
import {Router} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'jquery';

@Component({
  selector: 'app-modal-preview',
  templateUrl: './modal-preview.component.html',
  styleUrls: ['./modal-preview.component.scss']
})
export class ModalPreviewComponent implements OnInit {
  @Input() showQuestionModal = false;
  @Output() showQuestionOutput = new EventEmitter();
  @Input() collectionHierarchy: Array<any>;
  @Input() sessionContext;
  @Input() programContext;
  @Input() selectedStatus;
  public sourcingOrgReviewer: boolean;
  displayQuestionList = []
  questionList = [];
  questionStatusMap = {};

  constructor(private _questionPreviewService: QuestionPreviewService,
              public resourceService: ResourceService,
              public router: Router) {
  }

  ngOnInit(): void {
    this.sourcingOrgReviewer = this.router.url.includes('/sourcing');
    const identifierList = [];
    this.collectionHierarchy.forEach(section => {
      if (section.leaf) {
        section.leaf.forEach(question => {
          if (question.contentVisibility === true && this.includes(this.sourcingOrgReviewer, this.selectedStatus, question.sourcingStatus || question.status)) {
            identifierList.push(question.identifier);
            this.questionStatusMap[question.identifier] = 'Draft';
            if (question.status === 'Live' && !question.sourcingStatus) {
              this.questionStatusMap[question.identifier] = {
                status: this.resourceService.frmelmnts.lbl.approvalPending,
                styleClass: 'sb-color-warning'
              };
            } else if (question.sourcingStatus === 'Approved' && question.status === 'Live') {
              this.questionStatusMap[question.identifier] = {
                status: this.resourceService.frmelmnts.lbl.approved,
                styleClass: 'sb-color-success'
              };
            }
          }
        });
      }
    });

    this._questionPreviewService.getQuestionsData(identifierList).subscribe(resp => {
      if (resp.responseCode.toLowerCase() === 'ok') {
        this.questionList = resp.result.questions;
                this.getLimitedQuestionList();        
      }
    });
  }

  includes(sourcingOrgReviewer: Boolean, selectedStatus: Array<string>, currentStatus: String) {
    // Always return true if not sourcingOrgReviewer
    if(!sourcingOrgReviewer) {
      return true;
    } else if(this.sessionContext.sampleContent) {
      return true;
    } else {
      // Always return true if no status selected
      return (!selectedStatus.length) || _.includes(selectedStatus, currentStatus)
    }
  }

  onModalClose() {
    this.showQuestionOutput.emit();
  }

  getLimitedQuestionList() {
    const currentdisplayCount = this.displayQuestionList.length
    const remainQuestionCount = this.questionList.length - currentdisplayCount;
    const initalLimit = 10;
    const limitCount = currentdisplayCount + (
      remainQuestionCount > initalLimit ? initalLimit : remainQuestionCount
    )
    this.displayQuestionList = _.take(this.questionList,limitCount)
    //console.log(this.displayQuestionList,this.questionList) 
  }

  selector1: string = '.sb-modal-content';
  onScrollDown() {
    console.log("scrolled down!");
    this.getLimitedQuestionList();
    // this.questionList // length
  }
  onScrollUp(){
    console.log("scrolled up!");
    }

}
