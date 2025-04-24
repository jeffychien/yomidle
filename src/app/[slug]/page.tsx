import { notFound } from 'next/navigation';

import About from './about';
import Game from './game';

import random from 'random';
import dictionary from '../../data/words.json';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

export default async function Home({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const dateUnix = Date.parse(slug + 'T00:00:00.000+09:00');
  if (!slug.match(/^\d{4}-\d{2}-\d{2}$/) || !dateUnix || dateUnix > Date.now()) {
    notFound();
  }
  
  // The randomness is fixed per day (unix timestamp).
  const rng = random.clone(dateUnix);

  // There are 12 grades and 9 grids. This game favors the lower levels,
  // so here we remove one of 9-11, 6-8, 3-5.
  let grades = [...Array(12).keys()];
  grades.splice(rng.int(9, 11), 1);
  grades.splice(rng.int(6, 8), 1);
  grades.splice(rng.int(3, 5), 1);
  grades = rng.shuffle(grades);

  const words = grades.map((grade) =>
    dictionary[grade].words[rng.int(0, dictionary[grade].words.length - 1)]
  );

  const date = dayjs(dateUnix).tz("Asia/Tokyo");
  const now = dayjs();
  const yesterday = date.subtract(1, 'day');
  const nextDay = date.add(1, 'day');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-[family-name:var(--font-noto-sans)]">
      <div className="text-center mb-10">
        <h1 className="text-8xl">Yomidle</h1>
        <div className="flex justify-between">
        <a href={"/" + yesterday.format("YYYY-MM-DD")} className="mr-20">{`<< ${yesterday.format("YYYY-MM-DD")}`}</a>
        <span>{date.format("YYYY-MM-DD")}</span>
        <a href={nextDay < now ? "/" + nextDay.format("YYYY-MM-DD") : "#"} className={"ml-20 " + (nextDay < now ? "" : " text-gray-500")}>{`${nextDay.format("YYYY-MM-DD")} >>`}</a>
        </div>
        <About />
      </div>
      <Game date={date.format("YYYY-MM-DD")} words={words} />
    </div>
  );
}
