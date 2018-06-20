import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'

//get all the consts
import { BOOKS_COLLECTION, LESSONS_COLLECTION, READERS_COLLECTION } from "./Constants"
import * as actions from './actions/index'

//init the firebase app
admin.initializeApp(functions.config().firebase)

//export the instance of firestore from firebase app
export const firestoreInstance = admin.firestore()

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

export const newReaderAdded = functions.firestore
    .document(`${BOOKS_COLLECTION}/{sessionId}/${LESSONS_COLLECTION}/{lessonId}/${READERS_COLLECTION}/{docId}`)
    .onCreate(event => {
        return actions.updateReadersCount(event)
    })