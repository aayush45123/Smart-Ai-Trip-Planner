export function classifyRoutes(routes, days, budget) {
  return routes
    .slice(0, 3)
    .map((r, index) => {
      const km = (r.distance / 1000).toFixed(1);
      const hours = (r.duration / 3600).toFixed(1);

      const travelCost = Math.round(km * 5); // ₹5/km
      const stayCost = days * 800;
      const foodCost = days * 300;

      return {
        id: index,
        type:
          index === 0
            ? "Fastest Route"
            : index === 1
            ? "Balanced Route"
            : "Scenic / Budget Route",
        distanceKm: km,
        durationHours: hours,
        totalCost: travelCost + stayCost + foodCost,
        geometry: r.geometry.coordinates,
      };
    })
    .filter((r) => r.totalCost <= budget);
}
