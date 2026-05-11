import { generateClassificationSummary } from "@/lib/generateClassificationSummary";
import PodcastHeader from "@/components/profile/PodcastHeader";
import TrustClassification from "@/components/profile/TrustClassification";
import TrustSignals from "@/components/profile/TrustSignals";
import AudienceContext from "@/components/profile/AudienceContext";
import VerificationCTA from "@/components/profile/VerificationCTA";
import TrustEvolution from "@/components/profile/TrustEvolution";

type Props = {
  params: Promise<{
    channelId: string;
  }>;
};

function formatCompactNumber(value: number | string | null | undefined) {
  if (!value) return "—";

  const num = Number(value);

  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }

  if (num >= 1000) {
    return `${Math.round(num / 1000)}K`;
  }

  return String(num);
}

export default async function PodcastProfilePage({
  params,
}: Props) {

  const { channelId } = await params;

  const response = await fetch(
    `http://localhost:3000/api/channel/${channelId}`,
    {
      cache: "no-store",
    }
  );

  const json = await response.json();
  const rawResponse = await fetch(
  `http://localhost:3000/api/raw-classifications/${channelId}`,
  {
    cache: "no-store",
  }
);

const rawJson =
  await rawResponse.json();

const raw =
  rawJson.data || {};
  const historyResponse = await fetch(
  `http://localhost:3000/api/channel-history/${channelId}`,
  {
    cache: "no-store",
  }
);

const historyJson = await historyResponse.json();

const history =
  historyJson.history || [];

  if (!json.success) {
    throw new Error("Failed to load channel");
  }

  const data = json.data;
  const classification =
  generateClassificationSummary({
    commentSignal: Number(data.comment_signal || 0),

    responsivenessSignal:
      Number(data.responsiveness_signal || 0),

    hasVerification:
      Boolean(data.survey_signal),

            substantiveEngagement:
  Number(raw.substantive_engagement_component || 0) / 10,

behaviouralChange:
  Number(raw.behavioural_change_component || 0) / 10,

parasocial:
  Number(raw.parasocial_component || 0) / 10,

audienceInteraction:
  Number(raw.audience_interaction_component || 0) / 10,
  });
  console.log("FRONTEND DATA:", data);

  const trustScore = Math.round(
    Number(data.trust_index_score || 0) * 100
  );

  const trustSignals = [
    {
      name: "Behavioural Trust Analysis",

      score: Math.round(Number(data.comment_signal || 0) * 100),

      status: "active" as const,

      description:
        "Measures behavioural trust patterns, audience conviction, and discussion depth.",
    },

    {
      name: "Host Responsiveness",

      score: Math.round(
  Number(data.responsiveness_signal || 0) * 100
),

      status: "active" as const,

      description:
        "Measures how actively the host engages with audience discussion.",
    },

    {
      name: "Host Verification",

      status:
        data.survey_signal
          ? ("active" as const)
          : ("pending" as const),

      score: data.survey_signal
        ? Math.round(Number(data.survey_signal) * 100)
        : undefined,

      description:
        "Verified host-submitted sponsor and audience trust data.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f5f5f2] text-black px-6 py-12">

      <div className="max-w-5xl mx-auto flex flex-col gap-16">

        <PodcastHeader
          podcastName={data.channel_name || "Unknown Podcast"}

          avatar={
            data.channel_thumbnail ||
            "https://placehold.co/400x400/f5f5f2/111111?text=Podcast"
          }

          scoreType={
            data.score_type === "full"
              ? "Full Trust Classification"
              : "Partial Trust Classification"
          }

    lastUpdated={data.last_updated}
          /> 

          <TrustClassification
          trustScore={trustScore}
          scoreType={
            data.score_type === "full"
              ? "Full Trust Classification"
              : "Partial Trust Classification"
          }
          history={history}
        />

        <TrustSignals
          signals={trustSignals}
        />
<section className="border border-black/10">

  <div className="p-10 flex flex-col gap-8">

    <div className="flex items-center justify-between">

      <p className="text-xs uppercase tracking-[0.2em] text-black/40">
        Classification Summary
      </p>

      <p className="text-xs uppercase tracking-[0.2em] text-black/25">
        {classification.classificationTier}
      </p>

    </div>

    <p className="text-2xl leading-relaxed tracking-tight text-black max-w-4xl">
      {classification.summary}
    </p>

    <div className="flex flex-wrap gap-3">

      {classification.strengths.map((strength) => (

        <div
          key={strength}
          className="border border-black/10 px-4 py-2 text-sm text-black/55"
        >
          {strength}
        </div>

      ))}

    </div>

  </div>

</section>
        <AudienceContext
          subscribers={formatCompactNumber(data.subscribers)}

          avgViews={formatCompactNumber(data.avg_views)}

          medianViews={formatCompactNumber(data.median_views)}

          engagementRate={`${
            Math.round(
              Number(data.engagement_rate || 0) * 1000
            ) / 10
          }%`}

          videoCount={formatCompactNumber(data.video_count)}
        />

        <VerificationCTA
          hasHostVerification={Boolean(data.survey_signal)}
        />

      </div>

    </main>
  );
}