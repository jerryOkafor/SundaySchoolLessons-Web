
import { BOOKS_COLLECTION, LESSONS_COLLECTION, READERS_COLLECTION } from "../Constants"

//import the firestore instance from index
import { firestoreInstance } from "../index";

export async function updateReadersCount(snap, context) {
    const data = snap.data() //the newly written data
    const lessonId = context.params.lessonId //event param lessonId
    const sessionId = context.params.sessionId //event param sessionId

    const lessonRef = firestoreInstance.collection(BOOKS_COLLECTION)
        .doc(sessionId).collection(LESSONS_COLLECTION).doc(lessonId);

    const doc = await lessonRef.get()

    //continue
    if (doc.exists) {
        const oldCount = doc.data().readers
        const newCount = oldCount + 1

        await lessonRef.set({
            readers: newCount
        }, { merge: true })
    } else {
        console.log("Docuement does not exist")
    }


}