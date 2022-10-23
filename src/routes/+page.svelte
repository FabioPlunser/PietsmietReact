<script lang="ts">
    import {loadGapi, getAllVidoes} from "$lib/youtube"
    import { onMount } from "svelte";
    
    
    import Spinner from "$lib/spinner.svelte"
    import { browser } from "$app/environment";
    import Suggestions from "$src/lib/suggestions.svelte";
    onMount(async () => {
        loadGapi();
    });

    export let data;
    let gotVideos = false;
    let YTvideos: any[] = [];
    let PSSuggestions = data.data;

    let pattern = /.((http(s)?:\/\/)?)(www\.)?((youtube\.com\/)|(youtu.be\/))[\S]+/
    
    async function compareVideos(){
        gotVideos = true;
        let bereitsGesehen:any[] = [];
        let storage:any = [];
        if(browser){
            try {
                // console.log("Get Storage")
                if(localStorage.getItem("bereitsGesehen") != null){
                    storage = localStorage.getItem("bereitsGesehen")
                    storage = JSON.parse(storage);
                    bereitsGesehen = storage;
                    // console.log(bereitsGesehen);
                    return bereitsGesehen;
                }
            
            } catch (error) {
                // console.log("Not in LocalStorage")
            }
        }
        // console.log("GetVideos");

        // PSSuggestions = await fetchSuggestionsFromDB();
        // PSSuggestions = PSSuggestions.data;
        YTvideos = await getAllVidoes();

        // console.log("GotVideos");
        for(let video of YTvideos){
            let description = video.snippet.description;
            if(video.snippet.title.includes("React")){
                let url = description.match(pattern)
                for(let suggestion of PSSuggestions){
                    try {
                        // console.log("YT: " + url[0] + "    " + "PS: " + suggestion.url)
                        if(url[0].includes(suggestion.url)){
                            bereitsGesehen.push(suggestion)
                            // alert("Bereits gesehen: " + suggestion.title)
                        }
                    } catch (error) {
                        console.log(error);
                    }
                    
                }
            }
        }
        if(browser){
            try {
                localStorage.setItem("bereitsGesehen", JSON.stringify(bereitsGesehen))   
            } catch (error) {
                console.log("Can't put into localstorage")
            }
        }
        // console.log(bereitsGesehen);
        return bereitsGesehen;
        
    }

</script>
<center>
    <img class="w-1/6" src="https://www.pietsmiet.de/assets/pietsmiet/brand/wordmark-plain-light-detail.svg" alt="logo"/>
    <h1 class="flex mx-auto justify-center text-3xl underline">Pietsmiet React Vorschläge</h1>

    <button class="flex mx-auto justify-center btn btn-primary m-5" on:click={()=>gotVideos=true}>Alle Videos mit allen Vorschlägen prüfen</button>
    <button class="flex mx-auto justify-center btn btn-primary m-5"><a href="/alleVorschlage">Alle Vorschläge sehen</a></button>

    {#if gotVideos}
        {#await compareVideos()}
            <div class="flex justify-center mx-auto">
                <Spinner />
            </div>
        {:then bereitsGesehen}
    
            <h1 class="flex mx-auto justify-center text-3xl underline m-5">{bereitsGesehen.length} Videos von Vorschlägen bereits gesehen. </h1>
            <h1 class="text-3xl">Diese videos wurden bereits angeschaut</h1>
            <div class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-2 m-20">
                {#each bereitsGesehen as video}
                    <Suggestions title={video.title} description={video.description} link={video.url}/>
                {/each}
            </div>
        {/await}
    {/if}
</center>

<!-- <div class="m-10 flex justify-center">
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
</div> -->




    
