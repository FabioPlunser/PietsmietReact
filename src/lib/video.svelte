<script lang="ts">
    export let title = "";
    export let description = "";
    export let thumbnail = "";
    // console.log(thumbnail.url);
</script>


<div class="card card-compact w-64 bg-base-100 shadow-xl">
    <figure><img src={thumbnail} alt="Shoes" /></figure>
    <div class="card-body">
      <h2 class="card-title">{title}</h2>
      <p>{description}</p>
    </div>
  </div>

