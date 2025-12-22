export function classifyRoutes(
  routes,
  { days, nights, budget, travelers, stayType, pace }
) {
  const stayCostPerNight =
    stayType === "hotel" ? 1500 : stayType === "homestay" ? 1000 : 500;

  const foodCostPerDay = 300;
  const paceMultiplier = pace === "fast" ? 1.2 : pace === "relaxed" ? 0.9 : 1;

  return routes
    .slice(0, 3)
    .map((r, index) => {
      const distanceKm = +(r.distance / 1000).toFixed(1);
      const durationHours = +(r.duration / 3600).toFixed(1);

      const travelCost = Math.round(
        distanceKm * 5 * travelers * paceMultiplier
      );

      const stayCost = nights * stayCostPerNight * travelers;
      const foodCost = days * foodCostPerDay * travelers;

      const totalCost = travelCost + stayCost + foodCost;

      return {
        id: index,
        type:
          index === 0
            ? "Fastest Route"
            : index === 1
            ? "Balanced Route"
            : "Budget / Scenic Route",
        distanceKm,
        durationHours,
        travelCost,
        stayCost,
        foodCost,
        totalCost,
        geometry: r.geometry.coordinates,
      };
    })
    .filter((r) => r.totalCost <= budget);
}
