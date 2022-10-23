/** @type {import('./$types').PageServerLoad} */
import {fetchSuggestionsFromDB} from "$lib/fetchVideosFromdb"

export async function load ({}) {
    let PSSuggestions = await fetchSuggestionsFromDB();
    PSSuggestions = PSSuggestions.data;

    return {
        data: PSSuggestions
    }
}