'use client';

import { useState } from 'react';

export default function About() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div>
      <div>
        <a href="#" onClick={() => setIsModalOpen(!isModalOpen)}>About | これについて</a>
      </div>
      <div className={"fixed top-0 left-0 w-full h-full transition-opacity duration-[500ms] " + (isModalOpen ? "opacity-100" : "opacity-0 pointer-events-none")}>
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-80" />

        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center animate-[wiggle_1s_ease-in-out_infinite]"
            onClick={() => setIsModalOpen(false)}>
          <div className="rounded-sm bg-green-700 p-3 z-10" onClick={e => e.stopPropagation()}>
            <div className="text-right font-bold">
              <a href="#" onClick={() => setIsModalOpen(false)}>
                X
              </a>
            </div>
            <div className="flex items-center justify-center">
              <div className="m-3 w-100">
                <h2 className="text-xl">What&apos;s Yomidle?</h2>
                <p>
                  Yomidle is a game for guessing the reading of common kanji phrases, or jukugo. Guess 3 in a row, column, or diagonal to win!
                  <br/>
                  (Hepburn, kunrei-shiki, and nihon-shiki are all accepted)
                </p>
                <h2 className="text-xl mt-10">How are the phrases selected?</h2>
                <p>
                  The phrases are selected from <a className="text-blue-900 underline" href="https://github.com/marmooo/graded-idioms-ja" target="_blank">https://github.com/marmooo/graded-idioms-ja</a>,
                  which is a list of phrases from elementary school to KanKen.
                  Each grid has an even distribution of easy and hard phrases.
                </p>
              </div>
              <div className="m-3 w-100">
                <h2 className="text-xl">Yomidleとは?</h2>
                <p>
                  Yomidleは漢字熟語の読み方を当てるゲームです。1行、1列、または対角線を当てれば勝ちます!
                </p>
                <h2 className="text-xl mt-10">名前の由来は?</h2>
                <p>
                  2021年、<a className="text-blue-900 underline" href="https://www.nytimes.com/games/wordle/index.html" target="_blank">Wordle</a>というゲームは英語圏に旋風を巻き起こした。
                  それから<a className="text-blue-900 underline" href="https://dles.aukspot.com/" target="_blank">数々のトリビアゲーム</a>は「dle」という接尾詞をつけました。
                </p>
                <h2 className="text-xl mt-10">熟語はどう選ばれますか?</h2>
                <p>
                  熟語は<a className="text-blue-900 underline" href="https://github.com/marmooo/graded-idioms-ja" target="_blank">https://github.com/marmooo/graded-idioms-ja</a>から選ばれました。
                  各グリッドには小学生が知っている熟語と漢字検定の難しい熟語を含まれております。
                </p>
              </div>
            </div>
            <div className="mt-10">
              Built by Jeff Chien on Next.js, React.js, and TailwindCSS.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}