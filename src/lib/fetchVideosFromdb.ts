export async function fetchSuggestionsFromDB(){
    const res = await fetch('http:localhost:3001/api/getVideos');
    const videos = await res.json();
    if(!videos){
        return [];
    }
    return videos;
}