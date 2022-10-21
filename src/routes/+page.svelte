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
    let pattern = /((http(s)?:\/\/)?)(www\.)?((youtube\.com\/)|(youtu.be\/))[\S]+/g
    let geschauteVideos: any[] = [];
    $: {
        
        console.log(YTvideos);
        for (let video of YTvideos) {
            let description = video.snippet.description;
            if(description.match(pattern) != null) {
                geschauteVideos.push(description.match(pattern));
            }
        }
        for (let vidoe of geschauteVideos) {
            for (let Vorschlag of PSSuggestions.data){
                if(Vorschlag.url === vidoe[0]){
                    alert("Vorschlag wurde bereits gesehen");
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
        PSSuggestions = await fetchSuggestionsFromDB();
        console.log(PSSuggestions);
        return PSSuggestions;
    }
</script>

<h1 class="flex mx-auto justify-center">Pietsmiet React Vorschläge</h1>

<button class="flex mx-auto justify-center btn btn-primary" on:click={()=>getVideos=true}>Alle Videos mit allen Vorschlägen prüfen</button>

<div class="m-10 flex justify-center">
{#if getVideos}
    {#await getPSSuggestions()}
        <div class="flex justify-center mx-auto">
        <Spinner />
      </div>
    {:then data}
        <div class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-2">

            {#each data.data as Suggestion}
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
                <Video title={video.snippet.title} description={video.snippet.description.slice(0, 150)} thumbnail={video.snippet.thumbnails.maxres} />
            {/each}
        </div>
    {/await}
{/if}
</div>




    
