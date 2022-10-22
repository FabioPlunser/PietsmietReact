<script lang="ts">
    import {loadGapi, getAllVidoes} from "$lib/youtube"
    import {fetchSuggestionsFromDB} from "$lib/fetchVideosFromdb"
    import { onMount } from "svelte";
    import Video from "$lib/video.svelte";
    import Suggestions from "$lib/suggestions.svelte"
    import Spinner from "$lib/spinner.svelte"
    onMount(async () => {
        loadGapi();
    });

    let getVideos = false;
    let YTvideos: any[] = [];
    let PSSuggestions: any[] = [];
    // Original-Video:.*?(?=\n)
    // Original.+?(?=\n)
    let pattern = /.((http(s)?:\/\/)?)(www\.)?((youtube\.com\/)|(youtu.be\/))[\S]+/
    let geschauteVideos: any[] = [];
    $: {
        
        console.log(YTvideos);
        for (let video of YTvideos) {
            let description = video.snippet.description;
            if(video.snippet.title.includes("React")){
                let url = description.match(pattern)
                geschauteVideos.push(url);
            }
            
        }
        for(let video of PSSuggestions){
            console.log(video.url)
            for(let url of geschauteVideos){
                console.log(url[0]);
                if(video.url.includes(url[0])){
                    alert("match")
                }
            }
        }
    }
    async function getYTVideos() {
        YTvideos = await getAllVidoes();
        // console.log(YTvideos);
        return YTvideos; 
    }
    async function getPSSuggestions(){
        let data = await fetchSuggestionsFromDB();
        PSSuggestions = data.data;
        return PSSuggestions;
    }
</script>
<center>
    <img class="w-1/6" src="https://www.pietsmiet.de/assets/pietsmiet/brand/wordmark-plain-light-detail.svg" alt="logo"/>
    <h1 class="flex mx-auto justify-center text-3xl underline">Pietsmiet React Vorschläge</h1>

    <button class="flex mx-auto justify-center btn btn-primary" on:click={()=>getVideos=true}>Alle Videos mit allen Vorschlägen prüfen</button>
</center>
<div class="m-10 flex justify-center">
{#if getVideos}
    {#await getPSSuggestions()}
        <div class="flex justify-center mx-auto">
        <Spinner />
      </div>
    {:then data}
        <div class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-2">

            {#each data as Suggestion}
                    <Suggestions title={Suggestion.title} description={Suggestion.description} link={Suggestion.url}/>
            {/each}
        </div>
    {/await}
{/if}
</div>

<div class="m-10 flex justify-center">
    <br class="mt-10" />
{#if getVideos}
    {#await getYTVideos()}
        <div class="flex justify-center mx-auto">
        <Spinner />
      </div>
    {:then videos}
        <div class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-2">
            {#each videos as video}
                {#if video.snippet.title.includes("React")}
                    <Video title={video.snippet.title} description={video.snippet.description.slice(0, 150)} thumbnail={video.snippet.thumbnails.maxres} />
                {/if}
            {/each}
        </div>
    {/await}
{/if}
</div>




    
