
import { BOOKS_COLLECTION, LESSONS_COLLECTION, READERS_COLLECTION } from "../Constants"

//import the firestore instance from index
import { firestoreInstance } from "../index";

export async function updateReadersCount(event) {

    const lessonId = event.param.lessonId
    const sessionId = event.param.sessionId

    const lessonRef = firestoreInstance.collection(BOOKS_COLLECTION)
        .doc(sessionId).collection(LESSONS_COLLECTION).doc(lessonId);

    const doc = await lessonRef.get()

    //continue
    if (doc.exists) {
        var oldCount = doc.data().readers
        var newCount = oldCount + 1

        const updateDoc = await lessonRef.set({
            readers: newCount
        }, { merge: true })
    } else {
        console.log("Docuement does not exist")
    }


}