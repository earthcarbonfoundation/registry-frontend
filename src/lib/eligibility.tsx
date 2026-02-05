export function evaluateEligibility(project: any) {
  const nowDateTime = new Date().toISOString();
  const nowDate = new Date(nowDateTime.split("T")[0]);

  if (!project.ownership || !project.baseline_type) {
    return {
      status: "conditional",
      reason: "Missing required fields",
    };
  }

  if (new Date(project.commissioning_date) < nowDate) {
    return {
      status: "no",
      reason: "Commision date to be in the past",
    };
  }

  return {
    status: "yes",
    reason: "Project is eligible for carbon credits",
  };
}
