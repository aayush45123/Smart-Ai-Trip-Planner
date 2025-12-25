export function classifyRoutes(
  routes,
  { days, nights, budget, travelers, stayType, pace }
) {
  // ✅ REALISTIC COST CALCULATIONS FOR INDIA

  // Stay costs per night per person
  const stayCostPerNight =
    stayType === "hotel" ? 2000 : stayType === "homestay" ? 1200 : 800;

  // Food costs per day per person (realistic Indian prices)
  const foodCostPerDay = 500; // Breakfast (100) + Lunch (200) + Dinner (150) + Snacks/Tea (50)

  // Pace affects travel costs
  const paceMultiplier = pace === "fast" ? 1.2 : pace === "relaxed" ? 0.9 : 1;

  // Attraction/activity costs per day per person
  const activityCostPerDay = 400;

  return routes
    .slice(0, 3) // Take top 3 routes
    .map((r, index) => {
      const distanceKm = +(r.distance / 1000).toFixed(1);
      const durationHours = +(r.duration / 3600).toFixed(1);

      // ✅ REALISTIC TRAVEL COST CALCULATION based on distance
      let travelCostPerKm;

      if (distanceKm < 200) {
        // Short distance - Bus/Cab
        travelCostPerKm = 10;
      } else if (distanceKm < 500) {
        // Medium distance - Sleeper bus/Train
        travelCostPerKm = 7;
      } else if (distanceKm < 1000) {
        // Long distance - Train (Sleeper/3AC)
        travelCostPerKm = 5;
      } else if (distanceKm < 1500) {
        // Very long distance - Train (2AC)
        travelCostPerKm = 4.5;
      } else {
        // Extremely long distance - Train/Flight combination
        travelCostPerKm = 4;
      }

      const baseTravelCost = distanceKm * travelCostPerKm * travelers;
      const travelCost = Math.round(baseTravelCost * paceMultiplier);

      // ✅ ACCOMMODATION COSTS
      const stayCost = nights * stayCostPerNight * travelers;

      // ✅ FOOD COSTS
      const foodCost = days * foodCostPerDay * travelers;

      // ✅ ACTIVITY/SIGHTSEEING COSTS
      const activityCost = days * activityCostPerDay * travelers;

      // ✅ MISCELLANEOUS (15% buffer for unexpected expenses)
      const miscCost = Math.round(
        (travelCost + stayCost + foodCost + activityCost) * 0.15
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

      console.log(
        `Route ${index}: Distance=${distanceKm}km, Total=₹${totalCost}, Budget=₹${budget}`
      );

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
          `❌ Route ${
            r.id
          } excluded: Cost ₹${r.totalCost.toLocaleString()} exceeds budget ₹${budget.toLocaleString()}`
        );
      } else {
        console.log(
          `✅ Route ${
            r.id
          } included: Cost ₹${r.totalCost.toLocaleString()} within budget ₹${budget.toLocaleString()}`
        );
      }
      return withinBudget;
    });
}
