// src/utils/DraftUtils.ts
export const calculateDraftRound = (pickNumber: number): number => {
  // Assuming 32 teams per round
  return Math.ceil(pickNumber / 32);
};

export const getNextSeptemberMonday = (): Date => {
  const today = new Date();
  const currentYear = today.getFullYear();

  // Create date for September 1st of current year
  const sept1 = new Date(currentYear, 8, 1); // Month is 0-indexed, so 8 = September

  // Find the first Monday
  const dayOfWeek = sept1.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const daysUntilMonday = dayOfWeek === 0 ? 1 : dayOfWeek === 1 ? 0 : 8 - dayOfWeek;

  sept1.setDate(sept1.getDate() + daysUntilMonday);
  return sept1;
};
