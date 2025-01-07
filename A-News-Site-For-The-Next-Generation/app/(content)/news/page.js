// /news page

import NewsList from "@/components/news-list/news-list";
import { getAllNews } from "@/lib/news";

export default async function NewsPage(){
    const news = await getAllNews()

    return(
        <>
            <h1>New Page</h1>
            <NewsList news={news}/>
        </>
    )
}