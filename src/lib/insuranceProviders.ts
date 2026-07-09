// Major U.S. health-insurance payers surfaced as autocomplete suggestions in the
// insurance-verification form (see components/ProviderCombobox.tsx).
//
// This is a *suggestion* list, not an allow-list — the combobox is a free-text
// input, so any plan the caller types is accepted even if it's not here.
// Ordered roughly by prevalence among Bay Area / California PPO members, then
// national carriers. Add or reorder per site as needed.

export const INSURANCE_PROVIDERS = [
  "Aetna",
  "Anthem Blue Cross (of California)",
  "Blue Cross Blue Shield",
  "Blue Shield of California",
  "Cigna",
  "UnitedHealthcare",
  "UMR",
  "Optum",
  "Kaiser Permanente",
  "Health Net",
  "TRICARE",
  "First Health Network",
  "MultiPlan / PHCS",
  "Magellan Health",
  "CompPsych",
  "Beacon Health Options",
  "Carelon Behavioral Health",
  "Highmark",
  "AmeriHealth",
  "Humana",
  "Elevance Health",
  "Molina Healthcare",
  "Centene",
  "Ambetter",
  "Oscar Health",
  "GEHA",
  "MHN (Managed Health Network)",
  "HealthSmart",
  "Meritain Health",
  "Sierra Health and Life",
  "PacificSource",
  "Providence Health Plan",
  "Bright HealthCare",
  "EmblemHealth",
  "Independence Blue Cross",
  "Premera Blue Cross",
  "Regence",
  "WellCare",
  "Medicare",
  "Medi-Cal",
  "Other / Not sure",
] as const;
