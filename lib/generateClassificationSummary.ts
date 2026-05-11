type Inputs = {
  commentSignal: number;
  responsivenessSignal: number;
  hasVerification: boolean;

  substantiveEngagement?: number;
  behaviouralChange?: number;
  parasocial?: number;
  audienceInteraction?: number;
};

export function generateClassificationSummary({
  commentSignal,
  responsivenessSignal,
  hasVerification,
  substantiveEngagement = 0,
  behaviouralChange = 0,
  parasocial = 0,
  audienceInteraction = 0,
}: Inputs) {

  const strengths: string[] = [];

  /*
    CLASSIFICATION TIER
  */

  let classificationTier =
    "Moderate Trust";

  if (commentSignal >= 0.75) {
    classificationTier =
      "High Trust";
  }

  if (commentSignal >= 0.88) {
    classificationTier =
      "Exceptional Trust";
  }

  /*
    OPENING
  */

  let opening =
    "Audience trust patterns remain relatively limited based on currently available public behavioural data.";

  if (commentSignal >= 0.7) {

    opening =
      "Audience behavioural patterns indicate strong trust dynamics driven by elevated engagement quality, recurring interaction behaviour, and audience conviction.";
  }

  if (commentSignal >= 0.85) {

    opening =
      "Audience interaction behaviour demonstrates unusually strong trust characteristics with exceptionally high levels of behavioural conviction, engagement depth, and sustained audience participation.";
  }

  /*
    SUBSTANTIVE ENGAGEMENT
  */

  let engagementSection = "";

  if (
    substantiveEngagement >= 0.55 &&
    substantiveEngagement < 0.75
  ) {

    engagementSection =
      "Discussion behaviour suggests audiences engage thoughtfully with episode material beyond passive consumption.";

    strengths.push(
      "Strong engagement depth"
    );
  }

  if (
    substantiveEngagement >= 0.75 &&
    substantiveEngagement < 0.9
  ) {

    engagementSection =
      "Commentary patterns indicate unusually deep intellectual engagement, with audiences frequently analysing, interpreting, and extending episode ideas within discussion.";

    strengths.push(
      "High discussion depth"
    );
  }

  if (
    substantiveEngagement >= 0.9
  ) {

    engagementSection =
      "Substantive engagement signals appear exceptionally elevated relative to platform baseline, suggesting the audience treats episode material more like intellectual participation than entertainment consumption.";

    strengths.push(
      "Exceptional discussion depth"
    );
  }

  /*
    BEHAVIOURAL CHANGE
  */

  let behaviouralSection = "";

  if (
    behaviouralChange >= 0.55 &&
    behaviouralChange < 0.75
  ) {

    behaviouralSection =
      "Behavioural trust indicators suggest listeners place meaningful weight on host opinions and recommendations.";

    strengths.push(
      "Audience conviction"
    );
  }

  if (
    behaviouralChange >= 0.75 &&
    behaviouralChange < 0.9
  ) {

    behaviouralSection =
      "Audience language patterns indicate elevated trust transfer from host to listener, with behavioural signals suggesting ideas and recommendations regularly influence listener thinking or action.";

    strengths.push(
      "Strong behavioural conviction"
    );
  }

  if (
    behaviouralChange >= 0.9
  ) {

    behaviouralSection =
      "Behavioural conviction signals appear exceptionally elevated, suggesting unusually high levels of trust transfer and audience behavioural influence.";

    strengths.push(
      "Exceptional behavioural influence"
    );
  }

  /*
    PARASOCIAL
  */

  let parasocialSection = "";

  if (
    parasocial >= 0.55 &&
    parasocial < 0.75
  ) {

    parasocialSection =
      "Audience commentary demonstrates consistent signs of host affinity and perceived relational trust.";

    strengths.push(
      "Host affinity"
    );
  }

  if (
    parasocial >= 0.75 &&
    parasocial < 0.9
  ) {

    parasocialSection =
      "Host-listener affinity patterns appear significantly above platform baseline, suggesting unusually strong perceived audience closeness.";

    strengths.push(
      "Elevated host affinity"
    );
  }

  if (
    parasocial >= 0.9
  ) {

    parasocialSection =
      "Parasocial trust dynamics appear exceptionally concentrated, with audience commentary exhibiting unusually strong personal affinity toward the host.";

    strengths.push(
      "Exceptional audience affinity"
    );
  }

  /*
    AUDIENCE INTERACTION
  */

  let communitySection = "";

  if (
    audienceInteraction >= 0.55 &&
    audienceInteraction < 0.75
  ) {

    communitySection =
      "Audience interaction behaviour suggests an active and conversational listener base.";

    strengths.push(
      "Community engagement"
    );
  }

  if (
    audienceInteraction >= 0.75 &&
    audienceInteraction < 0.9
  ) {

    communitySection =
      "Audience-to-audience interaction density suggests strong signs of community formation rather than isolated viewer engagement.";

    strengths.push(
      "Dense audience interaction"
    );
  }

  if (
    audienceInteraction >= 0.9
  ) {

    communitySection =
      "Community interaction density appears exceptionally elevated relative to platform baseline, suggesting the audience behaves more like an active network than a passive viewer base.";

    strengths.push(
      "Exceptional audience community"
    );
  }

  /*
    RESPONSIVENESS
  */

  let responsivenessSection = "";

  if (
    responsivenessSignal >= 0.3 &&
    responsivenessSignal < 0.6
  ) {

    responsivenessSection =
      "Host responsiveness remains moderate relative to total audience engagement volume.";
  }

  if (
    responsivenessSignal >= 0.6 &&
    responsivenessSignal < 0.85
  ) {

    responsivenessSection =
      "Host responsiveness patterns reinforce ongoing audience engagement and conversational continuity.";

    strengths.push(
      "Active host responsiveness"
    );
  }

  if (
    responsivenessSignal >= 0.85
  ) {

    responsivenessSection =
      "Host interaction behaviour appears exceptionally rare relative to platform baseline, with response density suggesting near-continuous audience engagement.";

    strengths.push(
      "Exceptional host responsiveness"
    );
  }

  if (
    responsivenessSignal < 0.3
  ) {

    responsivenessSection =
      "Host interaction frequency remains comparatively limited relative to audience engagement volume, suggesting trust is driven more heavily by audience conviction than direct host participation.";
  }

  /*
    VERIFICATION
  */

  let verificationSection = "";

  if (hasVerification) {

    verificationSection =
      "Verified host-submitted audience and sponsor data further strengthens confidence in the reliability of these behavioural trust indicators.";

    strengths.push(
      "Verified audience indicators"
    );
  }

  /*
    FINAL SUMMARY
  */

  const summary = [
    opening,
    engagementSection,
    behaviouralSection,
    parasocialSection,
    communitySection,
    responsivenessSection,
    verificationSection,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    classificationTier,
    summary,
    strengths,
  };
}