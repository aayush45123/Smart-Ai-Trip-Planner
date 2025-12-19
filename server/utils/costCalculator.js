export function estimateTripCost(routeCost, stayCost, days) {
  const food = days * 300;
  return routeCost + stayCost * days + food;
}
