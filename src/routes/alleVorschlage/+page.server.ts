/** @type {import('./$types').PageServerLoad} */
import type { PageServerLoad  } from './$types';
import { error } from '@sveltejs/kit';



export const load: PageServerLoad = async ({}) => {
  let videos;
  try{
    const res = await fetch('http://127.0.0.1:3001/api/getVideos');
    videos = await res.json();
  }catch{
    if(!videos){
      return{
        data: []
      };
    }
    
  }
  return videos;

}
