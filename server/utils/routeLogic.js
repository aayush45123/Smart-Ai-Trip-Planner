export function classifyRoutes(
  routes,
  { days, nights, budget, travelers, stayType, pace }
) {
  // ✅ REALISTIC COST CALCULATIONS FOR INDIA

  // Stay costs per night per person
  const stayCostPerNight =
    stayType === "hotel" ? 2000 : stayType === "homestay" ? 1200 : 600;

  // Food costs per day per person (3 meals + snacks)
  const foodCostPerDay = 500; // Breakfast (100) + Lunch (200) + Dinner (150) + Snacks (50)

  // Pace affects travel time and thus costs
  const paceMultiplier = pace === "fast" ? 1.3 : pace === "relaxed" ? 0.8 : 1;

  // Attraction/activity costs per day per person
  const activityCostPerDay = 400;

  return routes
    .slice(0, 3) // Take top 3 routes
    .map((r, index) => {
      const distanceKm = +(r.distance / 1000).toFixed(1);
      const durationHours = +(r.duration / 3600).toFixed(1);

      // ✅ REALISTIC TRAVEL COST CALCULATION
      // Base rate: ₹8-12 per km depending on mode
      let travelCostPerKm;
      if (distanceKm < 200) {
        travelCostPerKm = 10; // Short distance - road/bus
      } else if (distanceKm < 500) {
        travelCostPerKm = 7; // Medium - train/bus
      } else if (distanceKm < 1000) {
        travelCostPerKm = 5; // Long distance - train
      } else {
        travelCostPerKm = 4; // Very long - sleeper train/bus
      }

      const baseTravelCost = distanceKm * travelCostPerKm * travelers;
      const travelCost = Math.round(baseTravelCost * paceMultiplier);

      // ✅ ACCOMMODATION COSTS
      const stayCost = nights * stayCostPerNight * travelers;

      // ✅ FOOD COSTS
      const foodCost = days * foodCostPerDay * travelers;

      // ✅ ACTIVITY/SIGHTSEEING COSTS
      const activityCost = days * activityCostPerDay * travelers;

      // ✅ MISCELLANEOUS (10% buffer for unexpected expenses)
      const miscCost = Math.round(
        (travelCost + stayCost + foodCost + activityCost) * 0.1
      );

      // ✅ TOTAL COST
      const totalCost =
        travelCost + stayCost + foodCost + activityCost + miscCost;

      // ✅ ROUTE CLASSIFICATION
      let routeType;
      if (index === 0) {
        routeType = "Fastest Route";
      } else if (index === 1) {
        routeType = "Balanced Route";
      } else {
        routeType = "Scenic Route";
      }

      return {
        id: index,
        type: routeType,
        distanceKm,
        durationHours,
        travelCost,
        stayCost,
        foodCost,
        activityCost,
        miscCost,
        totalCost,
        costBreakdown: {
          travel: `₹${travelCost.toLocaleString()}`,
          accommodation: `₹${stayCost.toLocaleString()}`,
          food: `₹${foodCost.toLocaleString()}`,
          activities: `₹${activityCost.toLocaleString()}`,
          miscellaneous: `₹${miscCost.toLocaleString()}`,
        },
        geometry: r.geometry.coordinates,
      };
    })
    .filter((r) => {
      const withinBudget = r.totalCost <= budget;
      if (!withinBudget) {
        console.log(
          `Route ${r.id} excluded: Cost ₹${r.totalCost} exceeds budget ₹${budget}`
        );
      }
      return withinBudget;
    });
}
