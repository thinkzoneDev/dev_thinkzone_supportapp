import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../services/data.service';
import { AlertController, ModalController, LoadingController } from '@ionic/angular';

import { RestApiService } from '../../rest-api.service';


@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  // quiz;
  qno = 1;
  submitButton;
  submitButtonText;
  score;
  totalScore;
  trainingobj: any = {};
  content = '';
  worksheet: any = [];
  video: any = [];
  image: any = [];
  quiz: any;
    
  isVisited_content = false;
  isVisited_video = false;
  isVisited_worksheet = false;
  isVisited_image = false;
  isVisited_quiz = false;

  @ViewChild('slides') slides;
  constructor(public dataServ: DataService, public modalCtrl: ModalController, public api: RestApiService,
    private loadingController: LoadingController, public alertController: AlertController) {
    this.quiz = dataServ.getData('quiz');
    let count = 1;
    this.quiz.forEach(element => {
      element.index = count++;
      element.selectedOption = 0;
    });
  }


  ngOnInit() {
    this.slides.lockSwipes(true);
  }

  slideChanged(event) {
    this.slides.getActiveIndex().then(index => {
      this.qno = index + 1;
    });

  }


  move(n: number, val) {
    if (this.slides == null) {
      alert('null');
    } else {
      if (n == -1) {
        if (n > 0 && this.qno !== this.quiz.length) {
          this.slides.lockSwipes(false);
          this.slides.slideNext();
          this.slides.lockSwipes(true);
          this.qno++;
        } else if (n < 0 && this.qno !== 1) {
          this.slides.lockSwipes(false);
          this.slides.slidePrev();
          this.slides.lockSwipes(true);
          this.qno--;
        } else {
        }
      } else {
        if (this.quiz[val - 1].selectedOption != undefined) {
          if (n > 0 && this.qno !== this.quiz.length) {
            this.slides.lockSwipes(false);
            this.slides.slideNext();
            this.slides.lockSwipes(true);
            this.qno++;
          } else if (n < 0 && this.qno !== 1) {
            this.slides.lockSwipes(false);
            this.slides.slidePrev();
            this.slides.lockSwipes(true);
            this.qno--;
          } else {
          }
        } else {
          alert("Please select any one answer")
        }
      }
    }
  }

  ngAfterViewInit() {
    setTimeout(
      () => {
        if (this.slides) {
          this.slides.update();
          this.slides.lockSwipes(true);
        }
      }, 300
    );
  }

  logData(data) {
    let count = 0;
    this.quiz.forEach(element => {
      if (element.selectedOption !== 0 && typeof (element.selectedOption) != 'undefined') {
        count++;
        if (data.qid === element.qid) {
          this.showAlert('Correct answer', '', 'The answer of this question is: Option ' + data.answer);
        }
      }
    });

    this.totalScore = 0;
    this.score = 0;

    this.quiz.forEach(element => {
      this.totalScore += 1;
      if (element.selectedOption === element.answer) {
        this.score += 1;
      }
    });
    

    if (count === this.quiz.length) {
      this.submitButton = true;
      this.submitButtonText = 'Submit Quiz';
    }
  }
  closeQuiz() {
    this.modalCtrl.dismiss({ isComplete: false, totalScore: 0, score: 0 });
  }

  finishQuiz() {
    this.totalScore = 0;
    this.score = 0;

    this.quiz.forEach(element => {
      this.totalScore += 1;
      if (element.selectedOption === element.answer) {
        this.score += 1;
      }
    });
    this.modalCtrl.dismiss({ isComplete: true, score: this.score, totalScore: this.totalScore });
  }


  // alert box
  async showAlert(header: string, subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
     buttons: [
      {
        text: 'Ok',
        handler: () => {
          this.slides.lockSwipes(false);
          this.slides.slideNext();
          this.slides.lockSwipes(true);
          this.qno++;
        }
      }
     ]
    
    });
    

    await alert.present();
  }
}