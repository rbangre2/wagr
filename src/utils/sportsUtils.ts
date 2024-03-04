export function determineMatchResult(ft_score: string): string {
  const [homeScore, awayScore] = ft_score.split(" - ").map(Number);

  if (homeScore > awayScore) {
    return "Win";
  } else if (homeScore < awayScore) {
    return "Lose";
  } else {
    return "Draw";
  }
}
