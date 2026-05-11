"use client";

import { useState } from "react";
import TrustEvolution from "./TrustEvolution";

type HistoryPoint = {
  trust_index_score?: string;
  created_at?: string;
 timestamp?: string;
  last_updated?: string;
};

type Props = {
  trustScore: number;
  scoreType: string;
  history: HistoryPoint[];
};

export default function TrustClassification({
  trustScore,
  scoreType,
  history,
}: Props) {

  const [expanded, setExpanded] =
    useState(false);

  return (

    <section className="border border-black/10">

      <div className="p-10">

        {/* TOP LABELS */}

        <div className="grid md:grid-cols-[320px_1fr] gap-12 mb-8">

          <p className="text-xs uppercase tracking-[0.2em] text-black/40">
            Audience Trust Index
          </p>

          <p className="text-xs uppercase tracking-[0.2em] text-black/40">
            Trust Evolution
          </p>

        </div>

        {/* MAIN CONTENT */}

        <div className="grid md:grid-cols-[320px_1fr] gap-12 items-start">

          {/* SCORE SIDE */}

          <div className="flex flex-col">

            <div className="flex items-end gap-4">

              <h2 className="text-[140px] leading-none font-semibold tracking-tight text-black">
                {trustScore}
              </h2>

              <span className="text-black/40 text-3xl pb-5">
                / 100
              </span>

            </div>

            <p className="text-black/45 text-base leading-relaxed mt-4">
              {scoreType}
            </p>

            <button
              onClick={() => setExpanded(!expanded)}
              className="w-fit mt-8 border border-black/10 px-4 py-2 text-sm text-black/55 hover:border-black/25 hover:text-black transition-all flex items-center gap-3"
            >

              <span>
                {expanded
                  ? "Hide methodology"
                  : "How is this measured?"}
              </span>

              <span className="text-black/30">
                {expanded ? "−" : "+"}
              </span>

            </button>

          </div>

          {/* GRAPH SIDE */}

          <div className="pt-1">

            <TrustEvolution
              history={history}
            />

          </div>

        </div>

      </div>

      {/* EXPANDED METHODOLOGY */}

      {expanded && (

        <div className="border-t border-black/10 p-10">

          <div className="grid md:grid-cols-3 gap-10">

            <div className="flex flex-col gap-3">

              <p className="text-xs uppercase tracking-[0.2em] text-black/35">
                Behavioural Trust Analysis
              </p>

              <p className="text-black/60 leading-relaxed">
                Analyses audience interaction patterns including
                behavioural conviction, discussion depth,
                parasocial trust, substantive engagement,
                and audience-to-audience interaction.
              </p>

            </div>

            <div className="flex flex-col gap-3">

              <p className="text-xs uppercase tracking-[0.2em] text-black/35">
                Host Responsiveness
              </p>

              <p className="text-black/60 leading-relaxed">
                Measures how actively podcast hosts engage
                with audience discussion and community interaction.
              </p>

            </div>

            <div className="flex flex-col gap-3">

              <p className="text-xs uppercase tracking-[0.2em] text-black/35">
                Verification State
              </p>

              <p className="text-black/60 leading-relaxed">
                Partial classifications use public behavioural
                and responsiveness data only. Full classifications
                additionally incorporate verified host-submitted
                audience and sponsor outcome data.
              </p>

            </div>

          </div>

        </div>

      )}

    </section>
  );
}