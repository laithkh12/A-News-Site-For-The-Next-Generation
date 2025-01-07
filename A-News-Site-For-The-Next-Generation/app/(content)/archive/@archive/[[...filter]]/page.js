import NewsList from "@/components/news-list/news-list";
import { getAvailableNewsMonths, getAvailableNewsYears, getNewsForYear, getNewsForYearAndMonth } from "@/lib/news";
import Link from "next/link";
import { Suspense } from "react";

async function FilterHeader({year, month}){
    const availableYears = await getAvailableNewsYears();
    let links = availableYears;

    // Validate the selected filter
    if (
        (year && !availableYears.includes(year)) ||
        (month && !(await getAvailableNewsMonths(year)).includes(month))
    ) {
        throw new Error('Invalid filter');
    }

    // If a year is selected, get the months for that year
    if (year && !month) {
        links = await getAvailableNewsMonths(year);
    }

    // If both year and month are selected, do not display any further links
    if (year && month) {
        links = [];
    }

    return(
        <header id="archive-header">
                <nav>
                    <ul>
                        {links.map((link) => {
                            const href = year
                                ? `/archive/${year}/${link}`
                                : `/archive/${link}`;
                            return (
                                <li key={link}>
                                    <Link href={href}>{link}</Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </header>
    )
}

async function FilteredNews({year, month}){
    let news;
    if(year && !month){
        news = await getNewsForYear(year)
    }else if(year && month){
        news = await getNewsForYearAndMonth(year, month)
    }

    let newsContetnt = <p>No news found for the selected period</p>
    if(news && news.length > 0){
        newsContetnt = <NewsList news={news}/>
    }

    return newsContetnt
}

export default async function FilteredNewsPage({ params }) {
    const filter = params.filter;
    const selectedYear = filter?.[0];
    const selectedMonth = filter?.[1];

    



    return (
        <>
            <Suspense fallback={<p>Loading filter...</p>}>
                <FilterHeader year={selectedYear} month={selectedMonth}/>
            </Suspense>
            
            <Suspense fallback={<p>Loading news...</p>}>
                <FilteredNews year={selectedYear} month={selectedMonth} />
            </Suspense>
        </>
    );
}
