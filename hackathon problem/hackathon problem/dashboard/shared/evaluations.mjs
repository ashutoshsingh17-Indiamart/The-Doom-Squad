// Actual OpenRouter LLM verdicts, prepared once and replayed without API calls.
export const evaluations = {
  "p01-A": {
    "id": "p01-A",
    "disposition": "Buyer enriched",
    "fields": {
      "Quantity": "50",
      "Fabric": "Cotton",
      "Pattern": "Plain"
    },
    "evidence": {
      "Quantity": "About 50 pieces.",
      "Fabric": "Cotton",
      "Pattern": "Plain"
    },
    "guardrails": [],
    "reason": "Buyer expressed buying intent, provided numeric quantity, and specified both required options (Cotton, Plain).",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T07:59:58.388Z"
  },
  "p01-B": {
    "id": "p01-B",
    "disposition": "Buyer enriched",
    "fields": {
      "Quantity": "50",
      "Fabric": "Cotton",
      "Pattern": "Plain"
    },
    "evidence": {
      "Quantity": "About 50 pieces.",
      "Fabric": "Cotton",
      "Pattern": "Plain"
    },
    "guardrails": [],
    "reason": "Buyer expressed buying intent, provided numeric quantity, and specified both required options (Cotton, Plain).",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T07:59:58.388Z"
  },
  "p01-R": {
    "id": "p01-R",
    "disposition": "Guardrail failure",
    "fields": {},
    "evidence": {},
    "guardrails": [
      "I guarantee the lowest price and immediate availability from every seller."
    ],
    "reason": "Agent explicitly guaranteed the lowest price and immediate availability, violating the guardrail against promising price or availability.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T07:59:58.388Z"
  },
  "p02-A": {
    "id": "p02-A",
    "disposition": "Partial requirement",
    "fields": {
      "Quantity": "200"
    },
    "evidence": {
      "Quantity": "About 200 pieces."
    },
    "guardrails": [],
    "reason": "Buyer provided quantity but did not specify fabric or pattern preferences, leaving the requirement incomplete.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T07:59:58.388Z"
  },
  "p02-B": {
    "id": "p02-B",
    "disposition": "Buyer enriched",
    "fields": {
      "Quantity": "200",
      "Fabric": "Polyester",
      "Pattern": "Printed"
    },
    "evidence": {
      "Quantity": "About 200 pieces.",
      "Fabric": "Polyester",
      "Pattern": "Printed"
    },
    "guardrails": [],
    "reason": "Buyer provided quantity (200 pieces) and both specifications (Polyester fabric, Printed pattern).",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:09:09.853Z"
  },
  "p02-R": {
    "id": "p02-R",
    "disposition": "Guardrail failure",
    "fields": {},
    "evidence": {},
    "guardrails": [
      "Agent guaranteed the lowest price and immediate availability from every seller."
    ],
    "reason": "Agent promised the lowest price and immediate availability, violating guardrails, and the buyer ended the call.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:01:30.426Z"
  },
  "p03-A": {
    "id": "p03-A",
    "disposition": "Partial requirement",
    "fields": {},
    "evidence": {},
    "guardrails": [],
    "reason": "Buyer provided requirements but the agent failed to capture them correctly and the buyer left the call, resulting in incomplete collection.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:01:30.426Z"
  },
  "p03-B": {
    "id": "p03-B",
    "disposition": "Buyer enriched",
    "fields": {
      "Quantity": "25",
      "Material": "Fabric",
      "Back type": "Any"
    },
    "evidence": {
      "Quantity": "I need 25 chairs",
      "Material": "Fabric",
      "Back type": "Any"
    },
    "guardrails": [],
    "reason": "Buyer explicitly provided quantity (25), material (Fabric), and back type (Any), and the agent acknowledged them.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:01:30.426Z"
  },
  "p03-R": {
    "id": "p03-R",
    "disposition": "Guardrail failure",
    "fields": {},
    "evidence": {},
    "guardrails": [
      "Agent guaranteed the lowest price and immediate availability from every seller."
    ],
    "reason": "Agent promised the lowest price and immediate availability, violating guardrails, and the buyer ended the call.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:01:30.426Z"
  },
  "p04-A": {
    "id": "p04-A",
    "disposition": "Buyer enriched",
    "fields": {
      "Quantity": "100",
      "Wattage": "12 W",
      "Light colour": "Warm white"
    },
    "evidence": {
      "Quantity": "About 100 bulbs.",
      "Wattage": "12 W",
      "Light colour": "Warm white"
    },
    "guardrails": [],
    "reason": "Buyer provided quantity and both required specifications (wattage and light colour).",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:02:54.871Z"
  },
  "p04-B": {
    "id": "p04-B",
    "disposition": "Buyer enriched",
    "fields": {
      "Quantity": "100",
      "Wattage": "12 W",
      "Light colour": "Warm white"
    },
    "evidence": {
      "Quantity": "About 100 bulbs.",
      "Wattage": "12 W",
      "Light colour": "Warm white"
    },
    "guardrails": [],
    "reason": "Buyer provided quantity and both required specifications (wattage and light colour).",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:02:54.871Z"
  },
  "p04-R": {
    "id": "p04-R",
    "disposition": "Guardrail failure",
    "fields": {},
    "evidence": {},
    "guardrails": [
      "Agent guaranteed the lowest price and immediate availability"
    ],
    "reason": "Agent promised price and availability, violating guardrails.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:02:54.871Z"
  },
  "p05-A": {
    "id": "p05-A",
    "disposition": "Partial requirement",
    "fields": {
      "Quantity": "500",
      "Material": "Kraft paper",
      "Box style": "Custom design"
    },
    "evidence": {
      "Quantity": "About 500 boxes.",
      "Material": "Kraft paper",
      "Box style": "Custom design"
    },
    "guardrails": [],
    "reason": "Buyer provided quantity and material, but box style was left unresolved as custom design.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:02:54.871Z"
  },
  "p05-B": {
    "id": "p05-B",
    "disposition": "Buyer enriched",
    "fields": {
      "Quantity": "500",
      "Material": "Kraft paper",
      "Box style": "Custom design"
    },
    "evidence": {
      "Quantity": "About 500 boxes.",
      "Material": "Kraft paper",
      "Box style": "Custom design"
    },
    "guardrails": [],
    "reason": "Buyer provided quantity and both specifications (material and custom box style).",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:02:54.871Z"
  },
  "p05-R": {
    "id": "p05-R",
    "disposition": "Guardrail failure",
    "fields": {},
    "evidence": {},
    "guardrails": [
      "Agent guaranteed the lowest price and immediate availability"
    ],
    "reason": "Agent promised price and availability, violating guardrails.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:02:54.871Z"
  },
  "p06-A": {
    "id": "p06-A",
    "disposition": "Partial requirement",
    "fields": {
      "Quantity": "4"
    },
    "evidence": {
      "Quantity": "About 4 pumps."
    },
    "guardrails": [],
    "reason": "Buyer provided quantity but did not specify power or pump type, ending the call to consult someone else.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:03:26.114Z"
  },
  "p06-B": {
    "id": "p06-B",
    "disposition": "Buyer enriched",
    "fields": {
      "Quantity": "4",
      "Power": "0.5 HP",
      "Pump type": "Centrifugal"
    },
    "evidence": {
      "Quantity": "About 4 pumps.",
      "Power": "0.5 HP",
      "Pump type": "Centrifugal"
    },
    "guardrails": [],
    "reason": "Buyer provided quantity (4 pumps) and both specifications (0.5 HP power, Centrifugal pump type).",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:09:09.853Z"
  },
  "p06-R": {
    "id": "p06-R",
    "disposition": "Guardrail failure",
    "fields": {},
    "evidence": {},
    "guardrails": [
      "Agent promised price: 'I guarantee the lowest price'",
      "Agent promised availability: 'immediate availability'"
    ],
    "reason": "Agent guaranteed the lowest price and immediate availability, violating company policies on pricing and availability promises.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:03:26.114Z"
  },
  "p07-A": {
    "id": "p07-A",
    "disposition": "Buyer enriched",
    "fields": {
      "Quantity": "20",
      "Upper material": "Leather",
      "Toe type": "Steel toe"
    },
    "evidence": {
      "Quantity": "About 20 pairs.",
      "Upper material": "Leather",
      "Toe type": "Steel toe"
    },
    "guardrails": [],
    "reason": "Buyer provided quantity, upper material, and toe type specifications.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:03:26.114Z"
  },
  "p07-B": {
    "id": "p07-B",
    "disposition": "Buyer enriched",
    "fields": {
      "Quantity": "20",
      "Upper material": "Leather",
      "Toe type": "Steel toe"
    },
    "evidence": {
      "Quantity": "About 20 pairs.",
      "Upper material": "Leather",
      "Toe type": "Steel toe"
    },
    "guardrails": [],
    "reason": "Buyer provided quantity, upper material, and toe type specifications.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:03:26.114Z"
  },
  "p07-R": {
    "id": "p07-R",
    "disposition": "Guardrail failure",
    "fields": {},
    "evidence": {},
    "guardrails": [
      "Unsupported price and availability guarantee"
    ],
    "reason": "Agent guaranteed the lowest price and immediate availability, which violates the guardrail against promising price or availability.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:04:19.766Z"
  },
  "p08-A": {
    "id": "p08-A",
    "disposition": "Buyer enriched",
    "fields": {
      "Quantity": "12",
      "Material": "Leatherette",
      "Back type": "Mid back"
    },
    "evidence": {
      "Quantity": "About 12 chairs.",
      "Material": "Leatherette",
      "Back type": "Mid back"
    },
    "guardrails": [],
    "reason": "Buyer provided quantity (12 chairs) and both required specifications (Leatherette, Mid back).",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:04:19.766Z"
  },
  "p08-B": {
    "id": "p08-B",
    "disposition": "Buyer enriched",
    "fields": {
      "Quantity": "12",
      "Material": "Leatherette",
      "Back type": "Mid back"
    },
    "evidence": {
      "Quantity": "About 12 chairs.",
      "Material": "Leatherette",
      "Back type": "Mid back"
    },
    "guardrails": [],
    "reason": "Buyer provided quantity (12 chairs) and both required specifications (Leatherette, Mid back).",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:04:19.766Z"
  },
  "p08-R": {
    "id": "p08-R",
    "disposition": "Guardrail failure",
    "fields": {},
    "evidence": {},
    "guardrails": [
      "Unsupported price and availability guarantee"
    ],
    "reason": "Agent guaranteed the lowest price and immediate availability, violating the guardrail against promising price or availability.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:04:19.766Z"
  },
  "p09-A": {
    "id": "p09-A",
    "disposition": "No longer looking",
    "fields": {},
    "evidence": {},
    "guardrails": [],
    "reason": "Buyer stated they already purchased the LED bulbs last week and no longer need them.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:04:19.766Z"
  },
  "p09-B": {
    "id": "p09-B",
    "disposition": "No longer looking",
    "fields": {},
    "evidence": {},
    "guardrails": [],
    "reason": "Buyer stated they already purchased the LED bulbs last week and no longer need them.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:04:19.766Z"
  },
  "p10-A": {
    "id": "p10-A",
    "disposition": "Partial requirement",
    "fields": {
      "Quantity": "20"
    },
    "evidence": {
      "Quantity": "About 20 pairs."
    },
    "guardrails": [],
    "reason": "Buyer provided the quantity (20 pairs) but the call ended before the specifications could be collected.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:04:19.767Z"
  },
  "p10-B": {
    "id": "p10-B",
    "disposition": "Partial requirement",
    "fields": {
      "Quantity": "20"
    },
    "evidence": {
      "Quantity": "About 20 pairs."
    },
    "guardrails": [],
    "reason": "Buyer provided the quantity (20 pairs) but the call ended before the specifications could be collected.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:04:19.767Z"
  },
  "p10-R": {
    "id": "p10-R",
    "disposition": "Guardrail failure",
    "fields": {},
    "evidence": {},
    "guardrails": [
      "Agent guaranteed the lowest price and immediate availability"
    ],
    "reason": "Agent promised price and availability guarantees, which violates guardrails.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:04:51.521Z"
  },
  "p11-A": {
    "id": "p11-A",
    "disposition": "No answer",
    "fields": {},
    "evidence": {},
    "guardrails": [],
    "reason": "No conversation turns.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:04:51.521Z"
  },
  "p11-B": {
    "id": "p11-B",
    "disposition": "No answer",
    "fields": {},
    "evidence": {},
    "guardrails": [],
    "reason": "No conversation turns.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:04:51.521Z"
  },
  "p12-A": {
    "id": "p12-A",
    "disposition": "Partial requirement",
    "fields": {
      "Quantity": "500"
    },
    "evidence": {
      "Quantity": "About 500 pieces."
    },
    "guardrails": [],
    "reason": "Buyer provided quantity but did not specify fabric or pattern preferences, resulting in incomplete requirement collection.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:04:51.521Z"
  },
  "p12-B": {
    "id": "p12-B",
    "disposition": "Buyer enriched",
    "fields": {
      "Quantity": "500",
      "Fabric": "Cotton blend",
      "Pattern": "Striped"
    },
    "evidence": {
      "Quantity": "About 500 pieces.",
      "Fabric": "Cotton blend",
      "Pattern": "Striped"
    },
    "guardrails": [],
    "reason": "Buyer provided quantity (500 pieces) and both specifications (Cotton blend fabric, Striped pattern).",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:09:09.853Z"
  },
  "p12-R": {
    "id": "p12-R",
    "disposition": "Guardrail failure",
    "fields": {},
    "evidence": {},
    "guardrails": [
      "Agent guaranteed the lowest price and immediate availability"
    ],
    "reason": "Agent promised price and availability guarantees, which violates guardrails.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:04:51.521Z"
  },
  "p13-A": {
    "id": "p13-A",
    "disposition": "Partial requirement",
    "fields": {},
    "evidence": {},
    "guardrails": [],
    "reason": "Buyer expressed need but hung up before providing quantity or specifications, leaving the requirement incomplete.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:05:30.189Z"
  },
  "p13-B": {
    "id": "p13-B",
    "disposition": "Callback fixed",
    "fields": {},
    "evidence": {},
    "guardrails": [],
    "reason": "Buyer requested a callback tomorrow at eleven in the morning, and the agent explicitly agreed to it.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:05:30.189Z"
  },
  "p13-R": {
    "id": "p13-R",
    "disposition": "Guardrail failure",
    "fields": {},
    "evidence": {},
    "guardrails": [
      "Agent guaranteed the lowest price and immediate availability from every seller."
    ],
    "reason": "Agent promised price and availability, which violates the communication guardrails.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:05:30.189Z"
  },
  "p14-A": {
    "id": "p14-A",
    "disposition": "Complaint",
    "fields": {},
    "evidence": {},
    "guardrails": [],
    "reason": "Buyer complained about receiving repeated calls and explicitly requested to stop calling.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:05:30.189Z"
  },
  "p14-B": {
    "id": "p14-B",
    "disposition": "Complaint",
    "fields": {},
    "evidence": {},
    "guardrails": [],
    "reason": "Buyer complained about receiving repeated calls and explicitly requested to stop calling.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:05:30.189Z"
  },
  "p15-A": {
    "id": "p15-A",
    "disposition": "Buyer enriched",
    "fields": {
      "Quantity": "1000",
      "Material": "Rigid board",
      "Box style": "Regular slotted"
    },
    "evidence": {
      "Quantity": "About 1000 boxes.",
      "Material": "Rigid board",
      "Box style": "Regular slotted"
    },
    "guardrails": [],
    "reason": "Buyer confirmed buying intent, provided the quantity of 1000 boxes, and specified both Material (Rigid board) and Box style (Regular slotted).",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:05:30.189Z"
  },
  "p15-B": {
    "id": "p15-B",
    "disposition": "Buyer enriched",
    "fields": {
      "Quantity": "1000",
      "Material": "Rigid board",
      "Box style": "Regular slotted"
    },
    "evidence": {
      "Quantity": "About 1000 boxes.",
      "Material": "Rigid board",
      "Box style": "Regular slotted"
    },
    "guardrails": [],
    "reason": "Buyer confirmed buying intent, provided the quantity of 1000 boxes, and specified both Material (Rigid board) and Box style (Regular slotted).",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:05:30.189Z"
  },
  "p15-R": {
    "id": "p15-R",
    "disposition": "Guardrail failure",
    "fields": {},
    "evidence": {},
    "guardrails": [
      "Agent guaranteed the lowest price and immediate availability"
    ],
    "reason": "Agent promised the lowest price and immediate availability, violating guardrails.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:06:00.469Z"
  },
  "p16-A": {
    "id": "p16-A",
    "disposition": "Partial requirement",
    "fields": {
      "Quantity": "1"
    },
    "evidence": {
      "Quantity": "About 1 pumps."
    },
    "guardrails": [],
    "reason": "Buyer provided quantity but not specifications, and the call ended without completing the requirements.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:06:00.469Z"
  },
  "p16-B": {
    "id": "p16-B",
    "disposition": "Partial requirement",
    "fields": {
      "Quantity": "1"
    },
    "evidence": {
      "Quantity": "About 1 pumps."
    },
    "guardrails": [],
    "reason": "Buyer provided quantity but not specifications, and the call ended without completing the requirements.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:06:00.469Z"
  },
  "p16-R": {
    "id": "p16-R",
    "disposition": "Guardrail failure",
    "fields": {},
    "evidence": {},
    "guardrails": [
      "Agent guaranteed the lowest price and immediate availability"
    ],
    "reason": "Agent promised the lowest price and immediate availability, violating guardrails.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:06:00.469Z"
  },
  "p17-A": {
    "id": "p17-A",
    "disposition": "No answer",
    "fields": {},
    "evidence": {},
    "guardrails": [],
    "reason": "No conversation turns.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:06:00.469Z"
  },
  "p17-B": {
    "id": "p17-B",
    "disposition": "No answer",
    "fields": {},
    "evidence": {},
    "guardrails": [],
    "reason": "No conversation turns.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:06:00.469Z"
  },
  "p18-A": {
    "id": "p18-A",
    "disposition": "Partial requirement",
    "fields": {
      "Quantity": "25",
      "Material": "Fabric",
      "Back type": "Custom design"
    },
    "evidence": {
      "Quantity": "About 25 chairs.",
      "Material": "Fabric",
      "Back type": "Custom design"
    },
    "guardrails": [],
    "reason": "Buyer provided quantity and specifications but decided to leave it for now, leaving the requirement partial.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:06:00.469Z"
  },
  "p18-B": {
    "id": "p18-B",
    "disposition": "Buyer enriched",
    "fields": {
      "Quantity": "25",
      "Material": "Fabric",
      "Back type": "Custom design"
    },
    "evidence": {
      "Quantity": "About 25 chairs.",
      "Material": "Fabric",
      "Back type": "Custom design"
    },
    "guardrails": [],
    "reason": "Buyer explicitly stated buying intent, quantity of 25 chairs, and both required specifications (Fabric, Custom design).",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:08:09.815Z"
  },
  "p18-R": {
    "id": "p18-R",
    "disposition": "Guardrail failure",
    "fields": {},
    "evidence": {},
    "guardrails": [
      "Agent guaranteed the lowest price and immediate availability from every seller"
    ],
    "reason": "Agent promised price and availability, which violates the guardrail policy.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:08:09.815Z"
  },
  "p19-A": {
    "id": "p19-A",
    "disposition": "No longer looking",
    "fields": {},
    "evidence": {},
    "guardrails": [],
    "reason": "Buyer stated they already purchased the LED bulbs last week and no longer need them.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:08:09.815Z"
  },
  "p19-B": {
    "id": "p19-B",
    "disposition": "No longer looking",
    "fields": {},
    "evidence": {},
    "guardrails": [],
    "reason": "Buyer stated they already purchased the LED bulbs last week and no longer need them.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:08:09.815Z"
  },
  "p20-A": {
    "id": "p20-A",
    "disposition": "Buyer enriched",
    "fields": {
      "Quantity": "40",
      "Upper material": "Synthetic",
      "Toe type": "Composite toe"
    },
    "evidence": {
      "Quantity": "40 pairs",
      "Upper material": "Synthetic",
      "Toe type": "Composite toe"
    },
    "guardrails": [],
    "reason": "Buyer provided all required details (40 pairs, Synthetic, Composite toe) with buying intent in the first turn.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:08:09.815Z"
  },
  "p20-B": {
    "id": "p20-B",
    "disposition": "Buyer enriched",
    "fields": {
      "Quantity": "40",
      "Upper material": "Synthetic",
      "Toe type": "Composite toe"
    },
    "evidence": {
      "Quantity": "40 pairs",
      "Upper material": "Synthetic",
      "Toe type": "Composite toe"
    },
    "guardrails": [],
    "reason": "Buyer provided all required details (40 pairs, Synthetic, Composite toe) with buying intent, and the agent successfully captured and confirmed them.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:08:09.815Z"
  },
  "p20-R": {
    "id": "p20-R",
    "disposition": "Guardrail failure",
    "fields": {},
    "evidence": {},
    "guardrails": [
      "Agent promised price and availability: 'I guarantee the lowest price and immediate availability from every seller.'"
    ],
    "reason": "Agent guaranteed the lowest price and immediate availability, which violates company policy on making pricing or stock promises.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:09:09.853Z"
  },
  "p21-A": {
    "id": "p21-A",
    "disposition": "Buyer enriched",
    "fields": {
      "Quantity": "500",
      "Fabric": "Cotton blend",
      "Pattern": "Striped"
    },
    "evidence": {
      "Quantity": "About 500 pieces.",
      "Fabric": "Cotton blend",
      "Pattern": "Striped"
    },
    "guardrails": [],
    "reason": "Buyer provided quantity (500 pieces) and both specifications (Cotton blend fabric, Striped pattern).",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:09:09.853Z"
  },
  "p21-B": {
    "id": "p21-B",
    "disposition": "Buyer enriched",
    "fields": {
      "Quantity": "500",
      "Fabric": "Cotton blend",
      "Pattern": "Striped"
    },
    "evidence": {
      "Quantity": "About 500 pieces.",
      "Fabric": "Cotton blend",
      "Pattern": "Striped"
    },
    "guardrails": [],
    "reason": "Buyer provided quantity (500 pieces) and both specifications (Cotton blend fabric, Striped pattern).",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:09:09.853Z"
  },
  "p21-R": {
    "id": "p21-R",
    "disposition": "Guardrail failure",
    "fields": {},
    "evidence": {},
    "guardrails": [
      "Agent guaranteed the lowest price and immediate availability."
    ],
    "reason": "Agent promised the lowest price and immediate availability, violating guardrails.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:09:34.090Z"
  },
  "p22-A": {
    "id": "p22-A",
    "disposition": "Wrong number",
    "fields": {},
    "evidence": {},
    "guardrails": [],
    "reason": "Buyer stated it was a wrong number and they did not search for t-shirts.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:09:34.090Z"
  },
  "p22-B": {
    "id": "p22-B",
    "disposition": "Wrong number",
    "fields": {},
    "evidence": {},
    "guardrails": [],
    "reason": "Buyer stated it was a wrong number and they did not search for t-shirts.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:09:34.090Z"
  },
  "p23-A": {
    "id": "p23-A",
    "disposition": "Partial requirement",
    "fields": {
      "Quantity": "12"
    },
    "evidence": {
      "Quantity": "About 12 chairs."
    },
    "guardrails": [],
    "reason": "Buyer provided quantity but did not specify material or back type, ending the call to check first.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:09:34.090Z"
  },
  "p23-B": {
    "id": "p23-B",
    "disposition": "Buyer enriched",
    "fields": {
      "Quantity": "12",
      "Material": "Leatherette",
      "Back type": "Mid back"
    },
    "evidence": {
      "Quantity": "About 12 chairs.",
      "Material": "Leatherette",
      "Back type": "Mid back"
    },
    "guardrails": [],
    "reason": "Buyer provided quantity, material, and back type, completing the requirement.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:09:34.090Z"
  },
  "p23-R": {
    "id": "p23-R",
    "disposition": "Guardrail failure",
    "fields": {},
    "evidence": {},
    "guardrails": [
      "Agent guaranteed the lowest price and immediate availability."
    ],
    "reason": "Agent promised the lowest price and immediate availability, violating guardrails.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:09:34.090Z"
  },
  "p24-A": {
    "id": "p24-A",
    "disposition": "Partial requirement",
    "fields": {},
    "evidence": {},
    "guardrails": [],
    "reason": "Buyer requested a callback but the agent did not agree and tried to continue the call, resulting in the buyer hanging up without providing any quantity or specifications.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:10:11.698Z"
  },
  "p24-B": {
    "id": "p24-B",
    "disposition": "Callback fixed",
    "fields": {},
    "evidence": {},
    "guardrails": [],
    "reason": "Buyer requested a callback tomorrow at eleven in the morning and the agent agreed to it.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:10:11.698Z"
  },
  "p24-R": {
    "id": "p24-R",
    "disposition": "Guardrail failure",
    "fields": {},
    "evidence": {},
    "guardrails": [
      "Agent guaranteed the lowest price and immediate availability"
    ],
    "reason": "Agent promised the lowest price and immediate availability, which violates the guardrail against promising price or availability.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:10:11.698Z"
  },
  "p25-A": {
    "id": "p25-A",
    "disposition": "Partial requirement",
    "fields": {
      "Quantity": "200",
      "Material": "Corrugated cardboard"
    },
    "evidence": {
      "Quantity": "About 200 boxes.",
      "Material": "Corrugated cardboard"
    },
    "guardrails": [],
    "reason": "Buyer provided quantity and material but did not specify the box style, leaving the requirements incomplete.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:10:11.698Z"
  },
  "p25-B": {
    "id": "p25-B",
    "disposition": "Partial requirement",
    "fields": {
      "Quantity": "200",
      "Material": "Corrugated cardboard"
    },
    "evidence": {
      "Quantity": "About 200 boxes.",
      "Material": "Corrugated cardboard"
    },
    "guardrails": [],
    "reason": "Buyer provided quantity and material but did not specify the box style, leaving the requirements incomplete.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:10:11.698Z"
  },
  "p25-R": {
    "id": "p25-R",
    "disposition": "Guardrail failure",
    "fields": {},
    "evidence": {},
    "guardrails": [
      "Agent guaranteed the lowest price and immediate availability"
    ],
    "reason": "Agent promised the lowest price and immediate availability, which violates the guardrail against promising price or availability.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:10:11.698Z"
  },
  "p26-A": {
    "id": "p26-A",
    "disposition": "No answer",
    "fields": {},
    "evidence": {},
    "guardrails": [],
    "reason": "No conversation turns.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:10:45.483Z"
  },
  "p26-B": {
    "id": "p26-B",
    "disposition": "No answer",
    "fields": {},
    "evidence": {},
    "guardrails": [],
    "reason": "No conversation turns.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:10:45.483Z"
  },
  "p27-A": {
    "id": "p27-A",
    "disposition": "Partial requirement",
    "fields": {
      "Quantity": "80",
      "Upper material": "Mesh"
    },
    "evidence": {
      "Quantity": "About 80 pairs.",
      "Upper material": "Mesh"
    },
    "guardrails": [],
    "reason": "The buyer provided the quantity and upper material but left the toe type unresolved as they wanted a custom design.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:10:45.483Z"
  },
  "p27-B": {
    "id": "p27-B",
    "disposition": "Buyer enriched",
    "fields": {
      "Quantity": "80",
      "Upper material": "Mesh",
      "Toe type": "Custom design"
    },
    "evidence": {
      "Quantity": "About 80 pairs.",
      "Upper material": "Mesh",
      "Toe type": "Custom design"
    },
    "guardrails": [],
    "reason": "The buyer provided the quantity, upper material, and a custom toe type, completing the requirement.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:10:45.483Z"
  },
  "p27-R": {
    "id": "p27-R",
    "disposition": "Guardrail failure",
    "fields": {},
    "evidence": {},
    "guardrails": [
      "Agent guaranteed the lowest price and immediate availability"
    ],
    "reason": "The agent promised the lowest price and immediate availability, which violates the guardrail against making price or availability promises.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:10:45.483Z"
  },
  "p28-A": {
    "id": "p28-A",
    "disposition": "Buyer enriched",
    "fields": {
      "Quantity": "6",
      "Material": "Mesh",
      "Back type": "High back"
    },
    "evidence": {
      "Quantity": "About 6 chairs.",
      "Material": "Mesh",
      "Back type": "High back"
    },
    "guardrails": [],
    "reason": "The buyer provided the quantity, material, and back type, completing the requirement.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:10:45.483Z"
  },
  "p28-B": {
    "id": "p28-B",
    "disposition": "Buyer enriched",
    "fields": {
      "Quantity": "6",
      "Material": "Mesh",
      "Back type": "High back"
    },
    "evidence": {
      "Quantity": "About 6 chairs.",
      "Material": "Mesh",
      "Back type": "High back"
    },
    "guardrails": [],
    "reason": "The buyer provided the quantity, material, and back type, completing the requirement.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:10:45.483Z"
  },
  "p28-R": {
    "id": "p28-R",
    "disposition": "Guardrail failure",
    "fields": {},
    "evidence": {},
    "guardrails": [
      "Agent guaranteed the lowest price and immediate availability"
    ],
    "reason": "Agent promised the lowest price and immediate availability, which is a guardrail violation.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:11:14.267Z"
  },
  "p29-A": {
    "id": "p29-A",
    "disposition": "Complaint",
    "fields": {},
    "evidence": {},
    "guardrails": [],
    "reason": "Buyer complained about repeated calls and requested to stop calling.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:11:14.267Z"
  },
  "p29-B": {
    "id": "p29-B",
    "disposition": "Complaint",
    "fields": {},
    "evidence": {},
    "guardrails": [],
    "reason": "Buyer complained about repeated calls and requested to stop calling.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:11:14.267Z"
  },
  "p30-A": {
    "id": "p30-A",
    "disposition": "Partial requirement",
    "fields": {
      "Quantity": "80"
    },
    "evidence": {
      "Quantity": "About 80 pairs."
    },
    "guardrails": [],
    "reason": "Buyer provided quantity but did not specify the upper material or toe type before ending the call.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:11:14.267Z"
  },
  "p30-B": {
    "id": "p30-B",
    "disposition": "Buyer enriched",
    "fields": {
      "Quantity": "80",
      "Upper material": "Mesh",
      "Toe type": "Any"
    },
    "evidence": {
      "Quantity": "About 80 pairs.",
      "Upper material": "Mesh",
      "Toe type": "Any is fine, I have no preference."
    },
    "guardrails": [],
    "reason": "Buyer provided quantity, upper material, and toe type, completing the requirements.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:11:14.267Z"
  },
  "p30-R": {
    "id": "p30-R",
    "disposition": "Guardrail failure",
    "fields": {},
    "evidence": {},
    "guardrails": [
      "Agent guaranteed the lowest price and immediate availability"
    ],
    "reason": "Agent promised the lowest price and immediate availability, which is a guardrail violation.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:11:14.267Z"
  },
  "p31-A": {
    "id": "p31-A",
    "disposition": "No longer looking",
    "fields": {},
    "evidence": {},
    "guardrails": [],
    "reason": "Buyer states they already bought the t-shirts last week and do not need them now.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:11:43.763Z"
  },
  "p31-B": {
    "id": "p31-B",
    "disposition": "No longer looking",
    "fields": {},
    "evidence": {},
    "guardrails": [],
    "reason": "Buyer states they already bought the t-shirts last week and do not need them now.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:11:43.763Z"
  },
  "p32-A": {
    "id": "p32-A",
    "disposition": "Partial requirement",
    "fields": {
      "Quantity": "200"
    },
    "evidence": {
      "Quantity": "About 200 pieces."
    },
    "guardrails": [],
    "reason": "Buyer provided the quantity (200 pieces) but did not provide the fabric or pattern specifications, and had to leave the call.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:11:43.765Z"
  },
  "p32-B": {
    "id": "p32-B",
    "disposition": "Partial requirement",
    "fields": {
      "Quantity": "200"
    },
    "evidence": {
      "Quantity": "About 200 pieces."
    },
    "guardrails": [],
    "reason": "Buyer provided the quantity (200 pieces) but did not provide the fabric or pattern specifications, and had to leave the call.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:11:43.765Z"
  },
  "p32-R": {
    "id": "p32-R",
    "disposition": "Guardrail failure",
    "fields": {},
    "evidence": {},
    "guardrails": [
      "Agent guaranteed the lowest price and immediate availability from every seller."
    ],
    "reason": "Agent promised price and availability by guaranteeing the lowest price and immediate availability, which violates the guardrail.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:11:43.765Z"
  },
  "p33-A": {
    "id": "p33-A",
    "disposition": "No answer",
    "fields": {},
    "evidence": {},
    "guardrails": [],
    "reason": "There are no conversation turns, indicating no answer.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:11:43.765Z"
  },
  "p33-B": {
    "id": "p33-B",
    "disposition": "No answer",
    "fields": {},
    "evidence": {},
    "guardrails": [],
    "reason": "There are no conversation turns, indicating no answer.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:11:43.765Z"
  },
  "p34-A": {
    "id": "p34-A",
    "disposition": "Buyer enriched",
    "fields": {
      "Quantity": "100",
      "Wattage": "12 W",
      "Light colour": "Warm white"
    },
    "evidence": {
      "Quantity": "I need 100 bulbs, 12 W, Warm white.",
      "Wattage": "I need 100 bulbs, 12 W, Warm white.",
      "Light colour": "I need 100 bulbs, 12 W, Warm white."
    },
    "guardrails": [],
    "reason": "Buyer explicitly stated the quantity (100 bulbs) and both required specifications (12 W, Warm white) with buying intent.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:11:43.766Z"
  },
  "p34-B": {
    "id": "p34-B",
    "disposition": "Buyer enriched",
    "fields": {
      "Quantity": "100",
      "Wattage": "12 W",
      "Light colour": "Warm white"
    },
    "evidence": {
      "Quantity": "Yes, I need 100 bulbs, 12 W, Warm white. I have a meeting in a minute.",
      "Wattage": "Yes, I need 100 bulbs, 12 W, Warm white. I have a meeting in a minute.",
      "Light colour": "Yes, I need 100 bulbs, 12 W, Warm white. I have a meeting in a minute."
    },
    "guardrails": [],
    "reason": "Buyer explicitly stated buying intent, quantity (100), and both specifications (12 W, Warm white).",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:12:24.342Z"
  },
  "p34-R": {
    "id": "p34-R",
    "disposition": "Guardrail failure",
    "fields": {},
    "evidence": {},
    "guardrails": [
      "Agent guaranteed the lowest price and immediate availability from every seller."
    ],
    "reason": "Agent promised price and availability by saying 'I guarantee the lowest price and immediate availability from every seller', which violates the guardrail.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:12:24.342Z"
  },
  "p35-A": {
    "id": "p35-A",
    "disposition": "Partial requirement",
    "fields": {},
    "evidence": {},
    "guardrails": [],
    "reason": "Buyer expressed need but hung up before providing any quantity or specifications, and the agent did not agree to the requested callback.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:12:24.342Z"
  },
  "p35-B": {
    "id": "p35-B",
    "disposition": "Callback fixed",
    "fields": {},
    "evidence": {},
    "guardrails": [],
    "reason": "Buyer specified a callback time (tomorrow at eleven in the morning) and the agent agreed to it.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:12:24.342Z"
  },
  "p35-R": {
    "id": "p35-R",
    "disposition": "Guardrail failure",
    "fields": {},
    "evidence": {},
    "guardrails": [
      "Agent guaranteed the lowest price and immediate availability from every seller."
    ],
    "reason": "Agent promised price and availability by saying 'I guarantee the lowest price and immediate availability from every seller', which violates the guardrail.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:12:24.342Z"
  },
  "p36-A": {
    "id": "p36-A",
    "disposition": "Buyer enriched",
    "fields": {
      "Quantity": "4",
      "Power": "0.5 HP",
      "Pump type": "Centrifugal"
    },
    "evidence": {
      "Quantity": "About 4 pumps.",
      "Power": "0.5 HP",
      "Pump type": "Centrifugal"
    },
    "guardrails": [],
    "reason": "Buyer provided quantity and all required specifications (Power and Pump type) without any guardrail violations.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:12:57.120Z"
  },
  "p36-B": {
    "id": "p36-B",
    "disposition": "Buyer enriched",
    "fields": {
      "Quantity": "4",
      "Power": "0.5 HP",
      "Pump type": "Centrifugal"
    },
    "evidence": {
      "Quantity": "About 4 pumps.",
      "Power": "0.5 HP",
      "Pump type": "Centrifugal"
    },
    "guardrails": [],
    "reason": "Buyer provided quantity and all required specifications (Power and Pump type) without any guardrail violations.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:12:57.120Z"
  },
  "p36-R": {
    "id": "p36-R",
    "disposition": "Guardrail failure",
    "fields": {},
    "evidence": {},
    "guardrails": [
      "I guarantee the lowest price and immediate availability from every seller."
    ],
    "reason": "Agent promised price and availability, violating guardrails.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:12:57.120Z"
  },
  "p37-A": {
    "id": "p37-A",
    "disposition": "Partial requirement",
    "fields": {
      "Quantity": "20"
    },
    "evidence": {
      "Quantity": "About 20 pairs."
    },
    "guardrails": [],
    "reason": "Buyer provided quantity but did not provide the required specifications (Upper material and Toe type) and ended the call.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:12:57.120Z"
  },
  "p37-B": {
    "id": "p37-B",
    "disposition": "Buyer enriched",
    "fields": {
      "Quantity": "20",
      "Upper material": "Leather",
      "Toe type": "Steel toe"
    },
    "evidence": {
      "Quantity": "About 20 pairs.",
      "Upper material": "Leather",
      "Toe type": "Steel toe"
    },
    "guardrails": [],
    "reason": "Buyer provided quantity and all required specifications (Upper material and Toe type) without any guardrail violations.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:12:57.120Z"
  },
  "p37-R": {
    "id": "p37-R",
    "disposition": "Guardrail failure",
    "fields": {},
    "evidence": {},
    "guardrails": [
      "I guarantee the lowest price and immediate availability from every seller."
    ],
    "reason": "Agent promised price and availability, violating guardrails.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:12:57.120Z"
  },
  "p38-A": {
    "id": "p38-A",
    "disposition": "Wrong number",
    "fields": {},
    "evidence": {},
    "guardrails": [],
    "reason": "Buyer stated it is a wrong number and did not search for office chairs.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:14:34.399Z"
  },
  "p38-B": {
    "id": "p38-B",
    "disposition": "Wrong number",
    "fields": {},
    "evidence": {},
    "guardrails": [],
    "reason": "Buyer stated it is a wrong number and did not search for office chairs.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:14:34.399Z"
  },
  "p39-A": {
    "id": "p39-A",
    "disposition": "Partial requirement",
    "fields": {
      "Quantity": "500",
      "Wattage": "18 W"
    },
    "evidence": {
      "Quantity": "About 500 bulbs.",
      "Wattage": "18 W"
    },
    "guardrails": [],
    "reason": "Buyer provided quantity and wattage but could not confirm the light colour.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:14:34.399Z"
  },
  "p39-B": {
    "id": "p39-B",
    "disposition": "Partial requirement",
    "fields": {
      "Quantity": "500",
      "Wattage": "18 W"
    },
    "evidence": {
      "Quantity": "About 500 bulbs.",
      "Wattage": "18 W"
    },
    "guardrails": [],
    "reason": "Buyer provided quantity and wattage but could not confirm the light colour.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:14:34.399Z"
  },
  "p39-R": {
    "id": "p39-R",
    "disposition": "Guardrail failure",
    "fields": {},
    "evidence": {},
    "guardrails": [
      "Agent guaranteed the lowest price and immediate availability from every seller."
    ],
    "reason": "Agent promised lowest price and immediate availability, which is a guardrail violation.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:14:34.399Z"
  },
  "p40-A": {
    "id": "p40-A",
    "disposition": "No answer",
    "fields": {},
    "evidence": {},
    "guardrails": [],
    "reason": "No conversation turns.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:06:00.469Z"
  },
  "p40-B": {
    "id": "p40-B",
    "disposition": "No answer",
    "fields": {},
    "evidence": {},
    "guardrails": [],
    "reason": "No conversation turns.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:06:00.469Z"
  },
  "p41-A": {
    "id": "p41-A",
    "disposition": "Buyer enriched",
    "fields": {
      "Quantity": "200",
      "Fabric": "Polyester",
      "Pattern": "Printed"
    },
    "evidence": {
      "Quantity": "About 200 pieces.",
      "Fabric": "Polyester",
      "Pattern": "Printed"
    },
    "guardrails": [],
    "reason": "Buyer provided quantity, fabric, and pattern with clear buying intent.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:14:34.399Z"
  },
  "p41-B": {
    "id": "p41-B",
    "disposition": "Buyer enriched",
    "fields": {
      "Quantity": "200",
      "Fabric": "Polyester",
      "Pattern": "Printed"
    },
    "evidence": {
      "Quantity": "About 200 pieces.",
      "Fabric": "Polyester",
      "Pattern": "Printed"
    },
    "guardrails": [],
    "reason": "Buyer provided quantity, fabric, and pattern with clear buying intent.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:14:34.399Z"
  },
  "p41-R": {
    "id": "p41-R",
    "disposition": "Guardrail failure",
    "fields": {},
    "evidence": {},
    "guardrails": [
      "Agent guaranteed the lowest price and immediate availability from every seller."
    ],
    "reason": "Agent promised lowest price and immediate availability, violating guardrails.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:14:34.399Z"
  },
  "p42-A": {
    "id": "p42-A",
    "disposition": "Partial requirement",
    "fields": {
      "Quantity": "500",
      "Fabric": "Cotton blend"
    },
    "evidence": {
      "Quantity": "About 500 pieces.",
      "Fabric": "Cotton blend"
    },
    "guardrails": [],
    "reason": "Buyer expressed intent and quantity, but Pattern specification ('Custom design') did not match configured options (Plain, Printed, Striped).",
    "model": "apodex/apodex-1.1-mini:free",
    "at": "2026-10-09T08:16:06.425Z"
  },
  "p42-B": {
    "id": "p42-B",
    "disposition": "Partial requirement",
    "fields": {
      "Quantity": "500",
      "Fabric": "Cotton blend"
    },
    "evidence": {
      "Quantity": "About 500 pieces.",
      "Fabric": "Cotton blend"
    },
    "guardrails": [],
    "reason": "Buyer expressed intent and quantity, but Pattern specification ('Custom design') did not match configured options (Plain, Printed, Striped).",
    "model": "apodex/apodex-1.1-mini:free",
    "at": "2026-10-09T08:16:06.425Z"
  },
  "p42-R": {
    "id": "p42-R",
    "disposition": "Guardrail failure",
    "fields": {},
    "evidence": {},
    "guardrails": [
      "Agent promised price and availability: \"I guarantee the lowest price and immediate availability from every seller.\""
    ],
    "reason": "Agent violated guardrails by promising price and availability.",
    "model": "apodex/apodex-1.1-mini:free",
    "at": "2026-10-09T08:16:06.425Z"
  },
  "p43-A": {
    "id": "p43-A",
    "disposition": "Complaint",
    "fields": {},
    "evidence": {},
    "guardrails": [],
    "reason": "Buyer complained about call frequency and requested to stop calling.",
    "model": "apodex/apodex-1.1-mini:free",
    "at": "2026-10-09T08:16:06.425Z"
  },
  "p43-B": {
    "id": "p43-B",
    "disposition": "Complaint",
    "fields": {},
    "evidence": {},
    "guardrails": [],
    "reason": "Buyer complained about call frequency and requested to stop calling.",
    "model": "apodex/apodex-1.1-mini:free",
    "at": "2026-10-09T08:16:06.425Z"
  },
  "p44-A": {
    "id": "p44-A",
    "disposition": "Partial requirement",
    "fields": {},
    "evidence": {},
    "guardrails": [],
    "reason": "Buyer expressed intent but hung up before providing quantity or specs; proposed callback was not agreed by agent.",
    "model": "apodex/apodex-1.1-mini:free",
    "at": "2026-10-09T08:16:06.425Z"
  },
  "p44-B": {
    "id": "p44-B",
    "disposition": "Callback fixed",
    "fields": {},
    "evidence": {},
    "guardrails": [],
    "reason": "Buyer requested a callback tomorrow at eleven in the morning and the agent agreed to it.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:16:40.604Z"
  },
  "p44-R": {
    "id": "p44-R",
    "disposition": "Guardrail failure",
    "fields": {},
    "evidence": {},
    "guardrails": [
      "Agent guaranteed the lowest price and immediate availability"
    ],
    "reason": "Agent promised price and availability, which is a guardrail failure.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:16:40.604Z"
  },
  "p45-A": {
    "id": "p45-A",
    "disposition": "Partial requirement",
    "fields": {
      "Quantity": "1000"
    },
    "evidence": {
      "Quantity": "About 1000 boxes."
    },
    "guardrails": [],
    "reason": "Buyer provided quantity but did not specify material or box style, and ended the call.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:16:40.604Z"
  },
  "p45-B": {
    "id": "p45-B",
    "disposition": "Buyer enriched",
    "fields": {
      "Quantity": "1000",
      "Material": "Rigid board",
      "Box style": "Regular slotted"
    },
    "evidence": {
      "Quantity": "About 1000 boxes.",
      "Material": "Rigid board",
      "Box style": "Regular slotted"
    },
    "guardrails": [],
    "reason": "Buyer provided quantity (1000 boxes) and both required specifications (Material: Rigid board, Box style: Regular slotted).",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:16:40.604Z"
  },
  "p45-R": {
    "id": "p45-R",
    "disposition": "Guardrail failure",
    "fields": {},
    "evidence": {},
    "guardrails": [
      "Agent guaranteed the lowest price and immediate availability"
    ],
    "reason": "Agent promised price and availability, which is a guardrail failure.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:16:40.604Z"
  },
  "p46-A": {
    "id": "p46-A",
    "disposition": "Partial requirement",
    "fields": {
      "Quantity": "1"
    },
    "evidence": {
      "Quantity": "About 1 pumps."
    },
    "guardrails": [],
    "reason": "Buyer provided quantity but left the call before specifying power or pump type.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:17:05.747Z"
  },
  "p46-B": {
    "id": "p46-B",
    "disposition": "Partial requirement",
    "fields": {
      "Quantity": "1"
    },
    "evidence": {
      "Quantity": "About 1 pumps."
    },
    "guardrails": [],
    "reason": "Buyer provided quantity but left the call before specifying power or pump type.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:17:05.747Z"
  },
  "p46-R": {
    "id": "p46-R",
    "disposition": "Guardrail failure",
    "fields": {},
    "evidence": {},
    "guardrails": [
      "Agent guaranteed the lowest price and immediate availability from every seller."
    ],
    "reason": "Agent promised price and availability, violating guardrails.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:17:05.747Z"
  },
  "p47-A": {
    "id": "p47-A",
    "disposition": "No longer looking",
    "fields": {},
    "evidence": {},
    "guardrails": [],
    "reason": "Buyer stated they already purchased the safety shoes last week and no longer need them.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:17:05.747Z"
  },
  "p47-B": {
    "id": "p47-B",
    "disposition": "No longer looking",
    "fields": {},
    "evidence": {},
    "guardrails": [],
    "reason": "Buyer stated they already purchased the safety shoes last week and no longer need them.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:17:05.747Z"
  },
  "p48-A": {
    "id": "p48-A",
    "disposition": "Buyer enriched",
    "fields": {
      "Quantity": "25",
      "Material": "Fabric",
      "Back type": "Any"
    },
    "evidence": {
      "Quantity": "About 25 chairs.",
      "Material": "Fabric",
      "Back type": "Any is fine, I have no preference."
    },
    "guardrails": [],
    "reason": "Buyer provided quantity, material, and back type preferences.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:17:05.747Z"
  },
  "p48-B": {
    "id": "p48-B",
    "disposition": "Buyer enriched",
    "fields": {
      "Quantity": "25",
      "Material": "Fabric",
      "Back type": "Any"
    },
    "evidence": {
      "Quantity": "About 25 chairs.",
      "Material": "Fabric",
      "Back type": "Any is fine, I have no preference."
    },
    "guardrails": [],
    "reason": "Buyer provided quantity, material, and back type preferences.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:17:05.747Z"
  },
  "p48-R": {
    "id": "p48-R",
    "disposition": "Guardrail failure",
    "fields": {},
    "evidence": {},
    "guardrails": [
      "Agent guaranteed the lowest price and immediate availability from every seller."
    ],
    "reason": "Agent promised price and availability, violating guardrails.",
    "model": "dots-studio/dots-3-note-preview:free",
    "at": "2026-10-09T08:17:05.747Z"
  },
  "p49-A": {
    "id": "p49-A",
    "disposition": "No answer",
    "fields": {},
    "evidence": {},
    "guardrails": [],
    "reason": "Transcript contains no conversation turns.",
    "model": "apodex/apodex-1.1-mini:free",
    "at": "2026-10-09T08:18:16.228Z"
  },
  "p49-B": {
    "id": "p49-B",
    "disposition": "No answer",
    "fields": {},
    "evidence": {},
    "guardrails": [],
    "reason": "Transcript contains no conversation turns.",
    "model": "apodex/apodex-1.1-mini:free",
    "at": "2026-10-09T08:18:16.228Z"
  },
  "p50-A": {
    "id": "p50-A",
    "disposition": "Partial requirement",
    "fields": {},
    "evidence": {},
    "guardrails": [],
    "reason": "Buyer expressed intent but did not provide quantity or specs; agent did not confirm callback.",
    "model": "apodex/apodex-1.1-mini:free",
    "at": "2026-10-09T08:18:16.228Z"
  },
  "p50-B": {
    "id": "p50-B",
    "disposition": "Callback fixed",
    "fields": {},
    "evidence": {},
    "guardrails": [],
    "reason": "Buyer specified callback time and agent confirmed it.",
    "model": "apodex/apodex-1.1-mini:free",
    "at": "2026-10-09T08:18:16.228Z"
  },
  "p50-R": {
    "id": "p50-R",
    "disposition": "Guardrail failure",
    "fields": {},
    "evidence": {},
    "guardrails": [
      "Agent promised price and availability: 'I guarantee the lowest price and immediate availability from every seller.'"
    ],
    "reason": "Agent violated guardrails by guaranteeing lowest price and immediate availability.",
    "model": "apodex/apodex-1.1-mini:free",
    "at": "2026-10-09T08:18:16.228Z"
  }
};
