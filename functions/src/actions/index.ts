//for email templates
import nunjucks = require('nunjucks');
nunjucks.configure({ autoescape: true });

//get the  node mailer
import nodeMailer = require('nodemailer');

import { BOOKS_COLLECTION, LESSONS_COLLECTION, READERS_COLLECTION } from "../utils"

//import the firestore instance from index
import { firestoreInstance } from "../index";

export async function onNewUserCreated(user) {
    // const email = user.email //email of the user
    // const displayName = user.displayName //display name of the user
    // const phone = user.phone //phone number of the user
    // const photoUrl = user.photoUrl //photo url of the user
}

export async function updateReadersCount(snap, context) {
    const doc = snap.data() //the newly written data
    const lessonId = context.params.lessonId //event param lessonId
    const sessionId = context.params.sessionId //event param sessionId

    const lessonRef = firestoreInstance.collection(BOOKS_COLLECTION)
        .doc(sessionId).collection(LESSONS_COLLECTION).doc(lessonId);

    console.log("Lesson Ref:", lessonRef)
    console.log("Data: ", doc)

    //continue
    if (snap.exists) {
        const oldCount = doc.readers
        const newCount = oldCount + 1
        await lessonRef.set({ readers: newCount }, { merge: true })
        console.log("New Redaer added!")
    } else {
        console.log("Docuement does not exist")
    }


}