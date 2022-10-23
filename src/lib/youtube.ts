const api_key = import.meta.env.VITE_API_KEY;
const channel_id = "UC3wla9xMoxDu7MIZImad1kQ";


async function initGapiClient() {
    await gapi.client
        .init({
            apiKey: api_key
        })
        .then(() => {
            console.log('Client initialized');
        });
}


export async function loadGapi(){
    gapi.load('client', initGapiClient);
}

export async function getAllVidoes(){
    await gapi.client.load("youtube", "v3");

    let res = await gapi.client.youtube.channels.list({
            id: channel_id,
            part: "contentDetails"
        })
    let playlist_id = res.result.items[0].contentDetails.relatedPlaylists.uploads
    let videos:any[] = []
    let next_page_token = "";
    
    while(next_page_token != undefined){
        let res2:any = await  gapi.client.youtube.playlistItems.list({
            playlistId: playlist_id,
            part: "snippet, contentDetails",
            maxResults: 50,
            pageToken: next_page_token
        })
        next_page_token = res2.result.nextPageToken
        videos = [...videos, ...res2.result.items]
    }
   
    return videos;

    
}

export async function getThumbnail(url: string){
    let pattern = /((http(s)?:\/\/)?)(www\.)?((youtube\.com\/)|(youtu.be\/))[\S]+/;
    let url2 = url.match(pattern);
    let video_url = url2[0];
    if(video_url.includes("watch")){
        video_url = video_url.replace("https://www.youtube.com/watch?v=", "");
    }
    else if(video_url.includes("youtube")){
        video_url = video_url.replace("https://youtu.be/", "");
    }

    await gapi.client.load("youtube", "v3");
    let res = await gapi.client.youtube.videos.list({
        part: "snippet",
        id: video_url
        
    })
    if(res.result.items.length > 0){
        return res.result.items[0].snippet.thumbnails.maxres.url
    }

    return res = "https://www.pietsmiet.de/assets/pietsmiet/brand/wordmark-plain-light-detail.svg"
   
}