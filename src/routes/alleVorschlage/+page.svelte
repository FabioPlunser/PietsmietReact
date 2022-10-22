<script>
    import Suggestions from "$lib/suggestions.svelte"
    import {fetchSuggestionsFromDB} from "$lib/fetchVideosFromdb"
    
    import Spinner from "$lib/spinner.svelte"
</script>

<button class="flex mx-auto justify-center btn btn-primary m-5 text-4xl"><a href="/">Home</a></button>

{#await fetchSuggestionsFromDB()}
    <div class="flex justify-center mx-auto">
        <Spinner />
    </div>
{:then videos} 
    <div class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-2 m-20">
        {#each videos.data as video}
            <Suggestions title={video.title} description={video.description} link={video.url} />
        {/each}
    </div>
{/await}