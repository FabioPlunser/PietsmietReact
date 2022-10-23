export async function fetchSuggestionsFromDB(){
    const res = await fetch('/api/getVideos');
    const videos = await res.json();
    return videos;
}