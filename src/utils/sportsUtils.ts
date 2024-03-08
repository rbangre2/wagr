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

export function getReceiverSelection(
  senderSelection: string,
  event: { homeTeam: string; awayTeam: string }
): string {
  if (senderSelection === event.homeTeam) {
    return `${event.awayTeam} or Draw`;
  } else if (senderSelection === event.awayTeam) {
    return `${event.homeTeam} or Draw`;
  } else if (senderSelection === "Draw") {
    return `${event.homeTeam} or ${event.awayTeam}`;
  } else {
    // Default case or error handling
    console.error("Invalid selectedTeam value:", senderSelection);
    return "Invalid selection"; // Consider proper handling or default value
  }
}
