import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';
import { flyInOut, expand } from '../animations/app.animation';
import { FeedbackService } from '../services/feedback.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    style: 'display: block',
  },
  animations: [flyInOut(), expand()],
})
export class ContactComponent implements OnInit {
  feedbackFormGroup: FormGroup;
  feedback: Feedback;
  contactType = ContactType;
  formErrors = {
    firstname: '',
    lastname: '',
    telnum: '',
    email: '',
    message: '',
  };

  validationMessages: {
    firstname: {
      required: 'First Name is required.';
      minLength: 'First Name must be at least 2 characters long.';
      maxLength: 'FirstName cannot be more than 25 characters long.';
    };
    lastname: {
      required: 'Last Name is required.';
      minLength: 'Last Name must be at least 2 characters long.';
      maxLength: 'Last Name cannot be more than 25 characters long.';
    };
    telnum: {
      required: 'Tel. number is required.';
      pattern: 'Tel. number must contain only numbers.';
    };
    email: {
      required: 'Email is required.';
      email: 'Email not in valid format.';
    };
    message: {
      required: 'Message field is required.';
    };
  };

  submition: Feedback;
  submitionId: string;
  loading = false;

  @ViewChild('fform') feedbackFormDirective;
  constructor(
    private formbuilder: FormBuilder,
    private feedbackService: FeedbackService
  ) {
    this.creatForm();
  }

  ngOnInit() {}

  creatForm() {
    this.feedbackFormGroup = this.formbuilder.group({
      firstname: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25),
        ],
      ],
      lastname: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25),
        ],
      ],
      telnum: [0, [Validators.required, Validators.pattern]],
      email: ['', [Validators.required, Validators.email]],
      agree: false,
      contacttype: 'None',
      message: ['', Validators.required],
    });
    this.feedbackFormGroup.valueChanges.subscribe((data) =>
      this.onValueChanged(data)
    );
    this.onValueChanged();
  }

  onSubmit() {
    this.feedback = this.feedbackFormGroup.value;
    this.feedbackService.postFeedback(this.feedback).subscribe((feed) =>
      this.feedbackService.getfeedback(feed.id).subscribe((sub) => {
        this.loading = false;
        this.submition = sub;
        setTimeout(() => (this.submition = null), 5000);
      })
    );
    this.loading = true;
    this.feedbackFormGroup.reset({
      firstname: '',
      lastname: '',
      telnum: '',
      email: '',
      agree: false,
      contacttype: 'None',
      message: '',
    });
    this.feedbackFormDirective.resetForm();
  }

  onValueChanged(data?: any) {
    if (!this.feedbackFormGroup) {
      return;
    }
    const form = this.feedbackFormGroup;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
}
