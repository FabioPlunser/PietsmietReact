export async function fetchSuggestionsFromDB(){
    const res = await fetch('http://127.0.0.1:3001/api/getVideos');
    const videos = await res.json();
    return videos;
}