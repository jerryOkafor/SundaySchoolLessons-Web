export let BOOKS_COLLECTION = "Books"
export let LESSONS_COLLECTION = "Lessons"
export let READERS_COLLECTION = "Readers"
export let SESSIONS_COLLECTON = "Sessions"
export const CURRENT_SESSION = () => {
    let date = new Date()
    return `${date.getFullYear()}${date.getMonth() <= 6 ? "01" : "02"}`
}

