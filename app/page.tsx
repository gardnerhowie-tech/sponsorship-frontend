"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {

  const [channelId, setChannelId] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanStatus, setScanStatus] = useState<any>(null);

  const [channels, setChannels] = useState<any[]>([]);
  const [channelPreview, setChannelPreview] = useState<any>(null);

  const progress = scanStatus?.progress || 0;

  useEffect(() => {

    async function loadChannels() {

      try {

        const response = await fetch("/api/channels");

        const json = await response.json();

        if (json.success) {
          setChannels(json.data);
        }

      } catch (err) {
        console.error(err);
      }

    }

    loadChannels();

  }, []);

  async function fetchChannelPreview(input: string) {

    try {

      const response = await fetch(
        "/api/resolve-channel",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            input,
          }),
        }
      );

      const json = await response.json();

      if (json.success) {

        setChannelPreview(json.data);

        return json.data;
      }

    } catch (err) {

      console.error(err);

    }

    return null;
  }

  async function waitForChannelProfile(channel_id: string) {

    for (let attempt = 0; attempt < 60; attempt++) {

      const progressValue = Math.min(
        95,
        10 + attempt * 2
      );

      setScanStatus({
        stage:
          attempt < 10
            ? "Building Audience Dataset"
            : attempt < 30
              ? "Running Signal Analysis"
              : "Assembling Intelligence Profile",
        detail: "Waiting for CHANNEL_MASTER to update",
        progress: progressValue,
        complete: false,
      });

      try {

        const response = await fetch(
          "/api/channels",
          {
            cache: "no-store",
          }
        );

        const json = await response.json();

        if (json.success) {

          const match = json.data?.find(
            (channel: any) =>
              channel.channel_id === channel_id &&
              channel.trust_index_score !== undefined &&
              channel.trust_index_score !== ""
          );

          if (match) {

            setScanStatus({
              stage: "Intelligence Profile Ready",
              detail: "CHANNEL_MASTER updated",
              progress: 100,
              complete: true,
            });

            return match;
          }

        }

      } catch (err) {
        console.error(err);
      }

      await new Promise((resolve) =>
        setTimeout(resolve, 5000)
      );
    }

    return null;
  }

  async function handleScan() {

    try {

      if (!channelId) {
        alert("Please enter a channel ID");
        return;
      }

      const resolved = await fetchChannelPreview(channelId);

      if (!resolved) {
        throw new Error("Failed to resolve channel");
      }

      setLoading(true);

      setScanStatus({
        stage: "Initialising Scan",
        detail: "Preparing orchestration pipeline",
        progress: 5,
        complete: false,
      });

      const response = await fetch("/api/scan", {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          channel_id: resolved.channel_id,
        }),

      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Scan failed");
      }

      const profile =
        await waitForChannelProfile(resolved.channel_id);

      if (!profile) {
        throw new Error("Profile was not ready before timeout");
      }

      window.location.href =
        `/podcast/${resolved.channel_id}`;

    } catch (err) {

      console.error(err);

      alert("Failed to assemble intelligence profile.");

    } finally {

      setLoading(false);

    }

  }

  return (

    <main className="min-h-screen bg-[#f5f5f2] text-black px-8 py-10">

      <div className="max-w-7xl mx-auto min-h-[90vh] flex flex-col justify-between">

        {/* TOP BAR */}

        <div className="flex items-center justify-between border-b border-black/10 pb-5">

          <p className="text-xs uppercase tracking-[0.25em] text-black/40">
            Naro Intelligence
          </p>

          <p className="text-xs uppercase tracking-[0.2em] text-black/30">
            Behavioural Trust Classification
          </p>

        </div>

        {/* HERO */}

        <div className="py-24 max-w-3xl">

          <div className="flex flex-col gap-10">

            <div className="flex flex-col gap-6">

              <p className="text-xs uppercase tracking-[0.25em] text-black/40">
                Sponsorship Intelligence Infrastructure
              </p>

              <h1 className="text-[72px] leading-[0.95] font-semibold tracking-tight">
                Predictive Audience Trust Intelligence
              </h1>

              <p className="text-black/55 text-lg leading-relaxed max-w-2xl">
                A behavioural intelligence layer for podcast sponsorship evaluation.
                Built on the hypothesis that audience interaction patterns may
                correlate more strongly with sponsor outcomes than vanity metrics
                alone.
              </p>

              <p className="text-black/55 text-lg leading-relaxed max-w-2xl">
                Powered by audience interaction signals, host responsiveness, and
                verified host-submitted data.
              </p>

              <div className="inline-flex w-fit border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs uppercase tracking-[0.22em] text-amber-700">
                Currently in testing.
              </div>

            </div>

            {/* INPUT */}

            <div className="flex flex-col gap-5 pt-4 max-w-xl">

              <input
                type="text"
                value={channelId}
                onChange={(e) => setChannelId(e.target.value)}
                placeholder="Paste YouTube channel, handle, or video URL"
                className="border-b border-black/20 bg-transparent px-0 py-5 text-xl outline-none placeholder:text-black/25"
              />

              <button
                onClick={handleScan}
                disabled={loading}
                className="w-fit border border-black/15 px-6 py-4 text-sm hover:bg-black hover:text-white transition-colors"
              >
                {loading
                  ? "Assembling Intelligence Profile..."
                  : "Analyse Podcast"}
              </button>

              {loading && (

                <div>

                  {channelPreview && (

                    <div className="flex items-center gap-4 pb-8">

                      <div className="relative w-14 h-14 rounded-full overflow-hidden bg-black/5">

                        <Image
                          src={channelPreview.channel_thumbnail}
                          alt={channelPreview.channel_name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />

                      </div>

                      <div className="flex flex-col">

                        <p className="text-sm text-black/35 uppercase tracking-[0.15em]">
                          Scanning Podcast
                        </p>

                        <p className="text-xl font-semibold tracking-tight text-black">
                          {channelPreview.channel_name}
                        </p>

                      </div>

                    </div>

                  )}

                  <div className="border-t border-black/10 pt-10 flex flex-col gap-6">

                    <div className="flex flex-col gap-3">

                      <div className="flex items-center justify-between">

                        <p className="text-xs uppercase tracking-[0.2em] text-black/40">
                          Live Orchestration State
                        </p>

                        <p className="text-xs text-black/30">
                          {progress}%
                        </p>

                      </div>

                      <div className="w-full h-[1px] bg-black/10 overflow-hidden">

                        <div
                          className="h-full bg-black transition-all duration-700"
                          style={{ width: `${progress}%` }}
                        />

                      </div>

                    </div>

                    <div className="flex flex-col gap-2">

                      <p className="text-sm uppercase tracking-[0.15em] text-black/35">
                        Current Stage
                      </p>

                      <p className="text-2xl font-semibold tracking-tight text-black">
                        {scanStatus?.stage || "Initialising Scan"}
                      </p>

                    </div>

                    <p className="text-sm text-black/40 leading-relaxed max-w-md">
                      First-time scans require building a behavioural trust dataset
                      from raw audience interactions. Once indexed, future scans
                      become significantly faster through cached intelligence layers.
                    </p>

                  </div>

                </div>

              )}

            </div>

          </div>

        </div>

        {/* REGISTRY */}

        <div className="border-t border-black/10 pt-16">

          <div className="flex items-center justify-between mb-10">

            <p className="text-xs uppercase tracking-[0.25em] text-black/40">
              Intelligence Registry
            </p>

            <p className="text-xs uppercase tracking-[0.2em] text-black/30">
              {channels.length} Indexed Entities
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {channels.map((channel) => {

              const trustScore = Math.round(
                Number(channel.trust_index_score || 0) * 100
              );

              return (

                <Link
                  key={channel.channel_id}
                  href={`/podcast/${channel.channel_id}`}
                  className="border border-black/10 hover:border-black/25 transition-colors p-6 flex items-center gap-5 bg-white/40"
                >

                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-black/5 flex-shrink-0">

                    <Image
                      src={channel.channel_thumbnail}
                      alt={channel.channel_name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />

                  </div>

                  <div className="flex flex-col flex-1 min-w-0">

                    <p className="text-xl font-semibold tracking-tight truncate text-black">
                      {channel.channel_name}
                    </p>

                    <p className="text-black/45 text-sm pt-1">
                      {channel.score_type === "full"
                        ? "Full Trust Classification"
                        : "Partial Trust Classification"}
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-3xl font-semibold tracking-tight text-black">
                      {trustScore}
                    </p>

                    <p className="text-xs uppercase tracking-[0.15em] text-black/35">
                      Trust
                    </p>

                  </div>

                </Link>

              );

            })}

          </div>

        </div>

        {/* FOOTER */}

        <div className="border-t border-black/10 mt-10 pt-1 flex items-center justify-between">

          <p className="text-xs uppercase tracking-[0.2em] text-black/30">
            Audience Trust ≠ Audience Size
          </p>

          <p className="text-xs uppercase tracking-[0.2em] text-black/30">
            Research Preview Build
          </p>

        </div>

      </div>

    </main>

  );

}