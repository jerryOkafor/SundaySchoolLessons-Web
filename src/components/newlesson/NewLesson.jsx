import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Swal from 'sweetalert2';
import DatePicker from 'material-ui/DatePicker';
import { firebaseDb, appEnv } from './../../config/constants';
import './NewLesson.css';

import update from 'immutability-helper';

const style = {
  textField: {
    margin: 20 + 'px',
    width: 400 + 'px',
  },
  outlineTextField: {
    margin: 20 + 'px',
  },
  datePicker: {
    marginTop: 50 + 'px',
  },
};

class NewLesson extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lesson: {
        lessonId: '',
        lessonNumber: '',
        topic: '',
        memoryVerse: '',
        lessonTexts: '',
        centralTruth: '',
        focus: '',
        introduction: '',
        lessonDate: '',
        outLine: [
          {
            items: ['', ''],
            title: '',
          },
          {
            items: ['', ''],
            title: '',
          },
          {
            items: ['', ''],
            title: '',
          },
        ],
        objectives: ['', '', ''],
        studies: [
          [
            {
              answer: '',
              question: '',
              text: '',
              title: '',
            },
            {
              answer: '',
              question: '',
              text: '',
              title: '',
            },
          ],
          [
            {
              answer: '',
              question: '',
              text: '',
              title: '',
            },
            {
              answer: '',
              question: '',
              text: '',
              title: '',
            },
          ],
          [
            {
              answer: '',
              question: '',
              text: '',
              title: '',
            },
            {
              answer: '',
              question: '',
              text: '',
              title: '',
            },
          ],
        ],
        dInAction: '',
        mInAction: '',
        furtherStudy: {
          monday: '',
          tuesday: '',
          wednesday: '',
          thursday: '',
          friday: '',
          saturday: '',
        },
      },
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleOutlineChange = this.handleOutlineChange.bind(this);
    this.handleObjectivesChange = this.handleObjectivesChange.bind(this);
    this.submitLessonForm = this.submitLessonForm.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);

    //init db
    this.lessonRef = firebaseDb.child(
      `${appEnv === 'staging' ? '' : 'v1'}/sessions`
    );
    // this.fireStoreRef = fireStoreDb.doc('lessons');
  }

  handleChange = event => {
    var name = event.target.id;
    var content = event.target.value;

    var newState = update(this.state, {
      lesson: {
        [name]: { $set: content }, //[] Using dynamic keys
      },
    });
    this.setState(newState);
  };
  handleOutlineChange = event => {
    var id = event.target.id;
    var content = event.target.value;

    var outline = this.state.lesson.outLine;
    outline[id].title = content;

    var newState = update(this.state, {
      lesson: {
        outLine: { $set: outline },
      },
    });

    this.setState(newState);
  };

  handleObjectivesChange = event => {
    var index = event.target.id;
    var content = event.target.value;

    var objectives = this.state.lesson.objectives;
    objectives[index] = content;
    var newState = update(this.state, {
      lesson: {
        objectives: { $set: objectives },
      },
    });
    this.setState(newState);
  };

  handleStudiesChange = event => {
    var index = event.target.id.split('_');
    var parent = index[0];
    var child = index[1];
    var field = index[2];
    var content = event.target.value;

    //split the index and get the row and col
    var studies = this.state.lesson.studies;
    var study = studies[parent][child];

    //get the outline too for title change
    var outlines = this.state.lesson.outLine;
    if (field === 'title') {
      outlines[parent].items[child] = content;
    }

    study[field] = content;

    //update studies
    studies[parent][child] = study;

    //set the new state
    var newState = update(this.state, {
      lesson: {
        studies: { $set: studies },
        outLine: { $set: outlines },
      },
    });
    this.setState(newState);
  };

  handleFurtherStudyChange = event => {
    var id = event.target.id;
    var content = event.target.value;

    //get the old further study
    var furtherStudy = this.state.lesson.furtherStudy;
    furtherStudy[id] = content;

    //update new state
    var newState = update(this.state, {
      lesson: {
        furtherStudy: { $set: furtherStudy },
      },
    });

    //set the new state
    this.setState(newState);
  };

  submitLessonForm = event => {
    event.preventDefault();
    //go ahead and submit the lessons to
    //firebase
    var currentSession = 0;
    var sessionRef = firebaseDb.child(
      `${appEnv === 'staging' ? '' : 'v1'}/sessions`
    );
    sessionRef.once('value').then(dataSnapshot => {
      dataSnapshot.forEach(data => {
        if (data.val() === true) {
          currentSession = data.key;

          var lessonRef = firebaseDb.child(
            `${appEnv === 'staging' ? '' : 'v1'}/lessons/${currentSession}`
          ); //todo change dev to v1
          var lessonListRef = firebaseDb.child(
            `${appEnv === 'staging' ? '' : 'v1'}/lessonsList/${currentSession}`
          ); //

          var newLessonNumber = 0;
          lessonListRef.once('value', dataSnapshot => {
            newLessonNumber = dataSnapshot.numChildren() + 1;

            //get new unique keys
            var newLessonRef = lessonRef.push();
            var newLessonListRef = lessonListRef.push();

            //get the lesson date
            var date = +new Date(this.state.lesson.lessonDate);

            var lessonListItem = {
              lessonRef: newLessonRef.key,
              lessonDate: date,
              lessonNumber: newLessonNumber,
              lessonTopic: this.state.lesson.topic,
              lessonMemoryVerse: this.state.lesson.memoryVerse,
            };

            //set the lesson date and the lesson number
            var lessonItem = this.state.lesson;
            lessonItem.lessonDate = date;
            lessonItem.lessonNumber = newLessonNumber;
            lessonItem.lessonId = newLessonRef.key;

            console.log('Lesson: ', lessonItem, 'LessonsLit: ', lessonListItem);
            Swal({
              title: 'Confirm!!!',
              text: 'Are u sure yo want to submit this lesson!',
              type: 'info',
              showCancelButton: true,
              showLoaderOnConfirm: true,
            }).then(result => {
              if (result.value) {
                newLessonListRef.set(lessonListItem).then(() => {
                  newLessonRef.set(lessonItem).then(() => {
                    // $('#uploadLessonForm').trigger('reset');
                    Swal('Good job!', 'Lesson Upload Successful!', 'success');
                  });
                });

                //upload to firestore
                // this.fireStoreRef.add(lessonItem);
              }
            });
          });
        }
      });
    });
  };

  handleDateChange = (event, date) => {
    var newState = update(this.state, {
      lesson: {
        lessonDate: { $set: date },
      },
    });

    //set the new state
    this.setState(newState);
  };

  render() {
    return (
      <div
        className="rootContainer"
        style={{
          marginTop: 20 + 'px',
          marginBottom: 20 + 'px',
          marginRight: 30 + 'px',
          marginLeft: 30 + 'px',
        }}
      >
        <div className="wrapper" style={{ margin: 10 + 'px' }}>
          <Paper elevation={4}>
            <form>
              <div>
                <br />
                <h3>SSL New Lesson</h3>
              </div>
              <div>
                <DatePicker
                  required
                  style={style.datePicker}
                  onChange={this.handleDateChange}
                  id="lessonDate"
                  hintText="Select Lesson Date"
                />
                <TextField
                  style={style.textField}
                  required
                  floatingLabelText="Lesson Topic"
                  hintText="Lesson Topic"
                  rows={2}
                  onChange={this.handleChange}
                  id="topic"
                  className=""
                />
              </div>

              <div>
                <TextField
                  required
                  style={style.textField}
                  rows={2}
                  id="memoryVerse"
                  floatingLabelText="Lessons Memory Verse"
                  multiLine={true}
                  onChange={this.handleChange}
                  hint="Lessons Memory Verse"
                  className=""
                />

                <TextField
                  style={style.textField}
                  required
                  floatingLabelText="Lesson Texts"
                  hint="Lesson Text"
                  rows={2}
                  multiLine={true}
                  onChange={this.handleChange}
                  id="lessonTexts"
                  className=""
                />
              </div>

              <div>
                <TextField
                  style={style.textField}
                  required
                  floatingLabelText="Central Truth"
                  rows={3}
                  multiLine={true}
                  onChange={this.handleChange}
                  id="centralTruth"
                  className=""
                />

                <TextField
                  style={style.textField}
                  required
                  rows={3}
                  id="focus"
                  multiLine={true}
                  floatingLabelText="Focus"
                  onChange={this.handleChange}
                  hint="Focus"
                  className=""
                />
              </div>

              <h4>Lesson Outlines</h4>
              <div>
                <TextField
                  style={style.outlineTextField}
                  required
                  floatingLabelText="Outline 1"
                  rows={2}
                  multiLine={true}
                  onChange={this.handleOutlineChange}
                  id="0"
                />

                <TextField
                  style={style.outlineTextField}
                  required
                  rows={2}
                  id="1"
                  multiLine={true}
                  floatingLabelText="Outline 2"
                  onChange={this.handleOutlineChange}
                  hint="Outline 2"
                />
                <TextField
                  style={style.outlineTextField}
                  required
                  rows={2}
                  id="2"
                  multiLine={true}
                  floatingLabelText="Outline 3"
                  onChange={this.handleOutlineChange}
                  hint="Outline 3"
                  className=""
                />
              </div>

              <br />
              <h4>Learning Objectives</h4>
              <div>
                <TextField
                  style={style.outlineTextField}
                  required
                  floatingLabelText="First Objective"
                  rows={2}
                  multiLine={true}
                  onChange={this.handleObjectivesChange}
                  hint="First Objective"
                  id="0"
                  className=""
                />

                <TextField
                  style={style.outlineTextFields}
                  required
                  rows={2}
                  id="1"
                  multiLine={true}
                  floatingLabelText="Second Objective"
                  onChange={this.handleObjectivesChange}
                  hint="Second Objective"
                  className=""
                />
                <TextField
                  style={style.outlineTextField}
                  required
                  rows={2}
                  id="2"
                  multiLine={true}
                  floatingLabelText="Third Objective"
                  onChange={this.handleObjectivesChange}
                  hint="Third Objective"
                  className=""
                />
              </div>

              {/* Introduction */}
              <h4>Introducing the Lesson</h4>
              <div>
                <TextField
                  style={{ width: '40%' }}
                  hintText="Lesson Introduction"
                  id="introduction"
                  onChange={this.handleChange}
                  floatingLabelText="Introduction"
                  multiLine={true}
                  rows={4}
                />
              </div>

              {/* Commentary & Applications */}
              <br />
              <br />
              <h4>Commentary & Applications</h4>
              <p>First Study</p>
              {/* Row One */}
              <div>
                <TextField
                  style={style.textField}
                  required
                  floatingLabelText="Title"
                  hint="Title"
                  rows={2}
                  multiLine={true}
                  onChange={this.handleStudiesChange}
                  id="0_0_title"
                  className=""
                />

                <TextField
                  style={style.textField}
                  required
                  rows={2}
                  id="0_0_text"
                  multiLine={true}
                  floatingLabelText="Text"
                  onChange={this.handleStudiesChange}
                  hint="Text"
                  className=""
                />
              </div>
              {/* ROw Two */}
              <div>
                <TextField
                  style={style.textField}
                  required
                  floatingLabelText="Question"
                  hint="Question"
                  rows={2}
                  multiLine={true}
                  onChange={this.handleStudiesChange}
                  id="0_0_question"
                  className=""
                />

                <TextField
                  style={style.textField}
                  required
                  rows={2}
                  multiLine={true}
                  id="0_0_answer"
                  floatingLabelText="Answer"
                  onChange={this.handleStudiesChange}
                  hint="Text"
                  className=""
                />
              </div>

              <p>Second Study</p>
              {/* Row One */}
              <div>
                <TextField
                  style={style.textField}
                  required
                  floatingLabelText="Title"
                  hint="Title"
                  multiLine={true}
                  rows={2}
                  onChange={this.handleStudiesChange}
                  id="0_1_title"
                  className=""
                />

                <TextField
                  style={style.textField}
                  required
                  rows={2}
                  id="0_1_text"
                  multiLine={true}
                  floatingLabelText="Text"
                  onChange={this.handleStudiesChange}
                  hint="Text"
                  className=""
                />
              </div>
              {/* ROw Two */}
              <div>
                <TextField
                  style={style.textField}
                  required
                  floatingLabelText="Question"
                  hint="Question"
                  rows={2}
                  multiLine={true}
                  onChange={this.handleStudiesChange}
                  id="0_1_question"
                  className=""
                />

                <TextField
                  style={style.textField}
                  required
                  rows={2}
                  multiLine={true}
                  id="0_1_answer"
                  floatingLabelText="Answer"
                  onChange={this.handleStudiesChange}
                  hint="Text"
                  className=""
                />
              </div>

              <p>Third Study</p>
              {/* Row One */}
              <div>
                <TextField
                  style={style.textField}
                  required
                  floatingLabelText="Title"
                  hint="Title"
                  rows={2}
                  multiLine={true}
                  onChange={this.handleStudiesChange}
                  id="1_0_title"
                  className=""
                />

                <TextField
                  style={style.textField}
                  required
                  rows={2}
                  id="1_0_text"
                  multiLine={true}
                  floatingLabelText="Text"
                  onChange={this.handleStudiesChange}
                  hint="Text"
                  className=""
                />
              </div>
              {/* ROw Two */}
              <div>
                <TextField
                  style={style.textField}
                  required
                  floatingLabelText="Question"
                  hint="Question"
                  multiLine={true}
                  rows={2}
                  onChange={this.handleStudiesChange}
                  id="1_0_question"
                  className=""
                />

                <TextField
                  style={style.textField}
                  required
                  rows={2}
                  id="1_0_answer"
                  multiLine={true}
                  floatingLabelText="Answer"
                  onChange={this.handleStudiesChange}
                  hint="Text"
                  className=""
                />
              </div>

              <p>Fourth Study</p>
              {/* Row One */}
              <div>
                <TextField
                  style={style.textField}
                  required
                  floatingLabelText="Title"
                  hint="Title"
                  rows={2}
                  multiLine={true}
                  onChange={this.handleStudiesChange}
                  id="1_1_title"
                  className=""
                />

                <TextField
                  style={style.textField}
                  required
                  rows={2}
                  multiLine={true}
                  id="1_1_text"
                  floatingLabelText="Text"
                  onChange={this.handleStudiesChange}
                  hint="Text"
                  className=""
                />
              </div>
              {/* Row Two */}
              <div>
                <TextField
                  style={style.textField}
                  required
                  multiLine={true}
                  floatingLabelText="Question"
                  hint="Question"
                  rows={2}
                  onChange={this.handleStudiesChange}
                  id="1_1_question"
                  className=""
                />

                <TextField
                  style={style.textField}
                  required
                  rows={2}
                  multiLine={true}
                  id="1_1_answer"
                  floatingLabelText="Answer"
                  onChange={this.handleStudiesChange}
                  hint="Text"
                  className=""
                />
              </div>

              <p>Fifth Study</p>
              {/* Row One */}
              <div>
                <TextField
                  style={style.textField}
                  required
                  floatingLabelText="Title"
                  hint="Title"
                  rows={2}
                  multiLine={true}
                  onChange={this.handleStudiesChange}
                  id="2_0_title"
                  className=""
                />

                <TextField
                  style={style.textField}
                  required
                  rows={2}
                  multiLine={true}
                  id="2_0_text"
                  floatingLabelText="Text"
                  onChange={this.handleStudiesChange}
                  hint="Text"
                  className=""
                />
              </div>
              {/* Row Two */}
              <div>
                <TextField
                  style={style.textField}
                  required
                  floatingLabelText="Question"
                  hint="Question"
                  rows={2}
                  multiLine={true}
                  onChange={this.handleStudiesChange}
                  id="2_0_question"
                  className=""
                />

                <TextField
                  style={style.textField}
                  required
                  rows={2}
                  id="2_0_answer"
                  multiLine={true}
                  floatingLabelText="Answer"
                  onChange={this.handleStudiesChange}
                  hint="Text"
                  className=""
                />
              </div>

              <p>Sixth Study</p>
              {/* Row One */}
              <div>
                <TextField
                  style={style.textField}
                  required
                  floatingLabelText="Title"
                  hint="Title"
                  rows={2}
                  multiLine={true}
                  onChange={this.handleStudiesChange}
                  id="2_1_title"
                  className=""
                />

                <TextField
                  style={style.textField}
                  required
                  rows={2}
                  multiLine={true}
                  id="2_1_text"
                  floatingLabelText="Text"
                  onChange={this.handleStudiesChange}
                  hint="Text"
                  className=""
                />
              </div>
              {/* Row Two */}
              <div>
                <TextField
                  style={style.textField}
                  required
                  floatingLabelText="Question"
                  hint="Question"
                  rows={2}
                  multiLine={true}
                  onChange={this.handleStudiesChange}
                  id="2_1_question"
                  className=""
                />

                <TextField
                  style={style.textField}
                  required
                  rows={2}
                  multiLine={true}
                  id="2_1_answer"
                  floatingLabelText="Answer"
                  onChange={this.handleStudiesChange}
                  hint="Text"
                  className=""
                />
              </div>

              {/* Discipleship in action */}
              <h4>Discipleship & Ministry in action</h4>
              <div>
                <TextField
                  style={style.textField}
                  required
                  floatingLabelText="Discipleship in action"
                  hint="Discipleship in action goes here"
                  rows={2}
                  multiLine={true}
                  onChange={this.handleChange}
                  id="dInAction"
                  className=""
                />

                <TextField
                  style={style.textField}
                  required
                  rows={2}
                  multiLine={true}
                  id="mInAction"
                  floatingLabelText="Ministry In Action"
                  onChange={this.handleChange}
                  hint="Ministry in action"
                  className=""
                />
              </div>

              <h4>Further Study</h4>
              {/* First Row */}
              <div>
                <TextField
                  style={style.outlineTextField}
                  required
                  floatingLabelText="Monday"
                  rows={2}
                  multiLine={true}
                  onChange={this.handleFurtherStudyChange}
                  hint="Monday"
                  id="monday"
                  className=""
                />

                <TextField
                  style={style.outlineTextFields}
                  required
                  rows={2}
                  id="tuesday"
                  multiLine={true}
                  floatingLabelText="Tuesday"
                  onChange={this.handleFurtherStudyChange}
                  hint="Tuesday"
                  className=""
                />
                <TextField
                  style={style.outlineTextField}
                  required
                  rows={2}
                  id="wednesday"
                  multiLine={true}
                  floatingLabelText="Wednesday"
                  onChange={this.handleFurtherStudyChange}
                  hint="Wednesday"
                  className=""
                />
              </div>
              {/* Second Row */}
              <div>
                <TextField
                  style={style.outlineTextField}
                  required
                  rows={2}
                  id="thursday"
                  multiLine={true}
                  floatingLabelText="Thursday"
                  onChange={this.handleFurtherStudyChange}
                  hint="Thursday"
                  className=""
                />

                <TextField
                  style={style.outlineTextField}
                  required
                  rows={2}
                  id="friday"
                  multiLine={true}
                  floatingLabelText="Friday"
                  onChange={this.handleFurtherStudyChange}
                  hint="Friday"
                  className=""
                />

                <TextField
                  style={style.outlineTextField}
                  required
                  rows={2}
                  id="saturday"
                  multiLine={true}
                  floatingLabelText="Saturday"
                  onChange={this.handleFurtherStudyChange}
                  hint="Saturday"
                  className=""
                />
              </div>
              <br />
              <br />
              <RaisedButton
                onClick={this.submitLessonForm}
                label="Create Lesson"
                primary={true}
                style={style}
              />
              <br />
              <br />
            </form>
          </Paper>
        </div>
      </div>
    );
  }
}

export default NewLesson;
