<script lang="ts">
    export let title = "";
    export let description = "";
    export let link = "";
    import {getThumbnail} from "$lib/youtube";
    import { onMount } from "svelte";
    let thumbnail = ""; 
    onMount(async () => {
        thumbnail = await getThumbnail(link);
    });
</script>


<div class="card card-compact w-64 bg-base-100 shadow-xl">
    <figure><img src={thumbnail} alt="Shoes" /></figure>
    <div class="card-body">
    <h2 class="card-title">{title}</h2>
    <p>{description}</p>
    <button class="btn btn-primary"><a href="{link}" target="_blank">Go to Video</a></button>
    </div>
</div>
