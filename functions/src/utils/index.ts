export let BOOKS_COLLECTION: string = "Books"
export let LESSONS_COLLECTION: string = "Lessons"
export let READERS_COLLECTION: string = "Readers"
export let SESSIONS_COLLECTON: string = "Sessions"
export const CURRENT_SESSION = () => {
    const date = new Date()
    return `${date.getFullYear()}${date.getMonth() <= 6 ? "01" : "02"}`
}

