// All site content lives here. Edit name, email and links at the top.
window.PORTFOLIO = {
  name: "Hüseyin Talha Uysal",
  role: "Generative AI Engineer · HubX AI Lab",
  email: "you@example.com",
  cta: "get in touch →",
  links: [
    { t: "GitHub", href: "https://github.com/talhauysal26dsa" },
    { t: "LinkedIn", href: "https://www.linkedin.com/" }
  ],
  rotate: ["video models.", "LoRAs.", "interior AI.", "motion control.", "inference stacks."],
  intro: "I train, serve and ship diffusion models end to end: the image-editing features behind the HomeAI app on Qwen-Image-Edit, character replacement and motion control on MiniMax-H3, and 33B video models squeezed onto a single H100.",
  collage: [
    "media/replace/td_pet.mp4",
    "media/refstyle/0b72fa76_out.webp",
    "media/car/lamborghini-huracan-orange.mp4",
    "media/blueprint/21_17_out.webp",
    "media/latest/calm_out.mp4"
  ],
  marquee: [
    "media/refstyle/0b72fa76_out.webp",
    "media/view360/06_steady.mp4",
    "media/layout/281a94f4_out.webp",
    "media/replace/td_pet.mp4",
    "media/cleanup/11_out.webp",
    "media/car/lamborghini-huracan-orange.mp4",
    "media/refstyle/15c0b3c4_out.webp",
    "media/view360/03_steady.mp4",
    "media/remover/062_s250.webp",
    "media/layout/32a89716_out.webp",
    "media/latest/bulin_out.mp4"
  ],

  groups: [
    /* ======================= HOME AI ======================= */
    {
      id: "homeai", nav: "HomeAI", eyebrow: "Image editing · HomeAI app",
      title: "Rooms, <em>re-imagined.</em>",
      lead: "The editing features behind the HomeAI app. A user snaps a photo of their room; the model keeps the architecture and rearranges it, cleans it up, restyles it, or turns it into a moving camera shot.",
      projects: [
        {
          id: "layout-boost", kind: "LoRA · Qwen-Image-Edit-2511",
          title: "Layout Boost",
          tagline: "Same room, same furniture — a better layout.",
          desc: ["Recognises the furniture already in the room and moves it somewhere better — walls, windows and every piece stay the same."],
          stack: ["Qwen-Image-Edit-2511", "LoRA", "Lightning 8-step", "A/B eval"],
          tabs: [
            { name: "Lounge", thumb: "media/layout/281a94f4_out.webp", items: [{ type: "ba", before: "media/layout/281a94f4_in.webp", after: "media/layout/281a94f4_out.webp", caption: "Drag: <b>input</b> ↔ <b>Layout Boost</b>" }] },
            { name: "Living room", thumb: "media/layout/17a2d3e7_out.webp", items: [{ type: "ba", before: "media/layout/17a2d3e7_in.webp", after: "media/layout/17a2d3e7_out.webp" }] },
            { name: "Open plan", thumb: "media/layout/030a1b11_out.webp", items: [{ type: "ba", before: "media/layout/030a1b11_in.webp", after: "media/layout/030a1b11_out.webp" }] },
            { name: "Corner", thumb: "media/layout/34173784_out.webp", items: [{ type: "ba", before: "media/layout/34173784_in.webp", after: "media/layout/34173784_out.webp" }] },
            { name: "Portrait", thumb: "media/layout/32a89716_out.webp", items: [{ type: "ba", before: "media/layout/32a89716_in.webp", after: "media/layout/32a89716_out.webp" }] }
          ]
        },
        {
          id: "reference-style", kind: "LoRA · Qwen-Image-Edit-2511",
          title: "Reference Style",
          tagline: "Show it a mood board, get your room in that style.",
          desc: ["Room photo + an inspiration shot → your room, in that style. Geometry from the room, palette and materials from the reference."],
          stack: ["Qwen-Image-Edit-2511", "multi-image edit", "LoRA ckpt-8500", "Lightning"],
          tabs: [
            ["0b72fa76", "Classic"], ["15c0b3c4", "Bare shell"],
            ["08c22add", "Living"], ["1c6848dd", "Kitchen"], ["21d6f1b1", "Earthy"]
          ].map(([id, n]) => ({ name: n, thumb: `media/refstyle/${id}_out.webp`, items: [{ type: "grid", cols: 3, ar: "3/4", cells: [
            { src: `media/refstyle/${id}_in.webp`, label: "Room" },
            { src: `media/refstyle/${id}_ref.webp`, label: "Reference" },
            { src: `media/refstyle/${id}_out.webp`, label: "Result" }
          ]}]}))
        },
        {
          id: "cleanup", kind: "LoRA · model selection",
          title: "Cleanup",
          tagline: "Remove the mess, keep the room.",
          desc: ["Clears the clutter and leaves the room alone: wall art, shelves and lamps survive."],
          stack: ["Qwen-Image-Edit-2509", "LoRA", "preservation eval"],
          tabs: [
            ["11", "Hoarder room"], ["2", "Library"], ["7", "Kids' room"], ["1", "Kitchen"], ["6", "Kitchen II"], ["4", "Study"]
          ].map(([id, n]) => ({ name: n, thumb: `media/cleanup/${id}_out.webp`, items: [{ type: "ba", before: `media/cleanup/${id}_in.webp`, after: `media/cleanup/${id}_out.webp`, lb: "Before", la: "After" }] }))
        },
        {
          id: "view360", kind: "Image → Video · MiniMax-H3",
          title: "360° Room View",
          tagline: "The designed room becomes an orbiting camera shot.",
          desc: ["The designed room turned into a camera that orbits the main piece of furniture, through MiniMax-H3 image-to-video."],
          stack: ["MiniMax-H3", "i2v", "camera prompting", "sglang"],
          tabs: ["03", "06", "07", "10", "01", "08"].map((n, i) => ({
            name: ["Lounge", "Gaming room", "Outdoor kitchen", "Dining", "Bedroom", "Living"][i], thumb: `media/view360/${n}_out.webp`,
            items: [{ type: "vrow", cols: "1fr 1fr 1fr", ar: "3/4", cells: [
              { src: `media/view360/${n}_in.webp`, label: "Photo" },
              { src: `media/view360/${n}_out.webp`, label: "HomeAI" },
              { src: `media/view360/${n}_steady.mp4`, label: "H3 orbit", hot: true }
            ]}]
          }))
        },
        {
          id: "styles", kind: "Routed edit pipeline · Qwen-Image-Edit-2511",
          title: "One room, every style",
          tagline: "Same empty room, a whole style catalogue.",
          desc: ["A router reads the photo and request, a resolver maps them to room × style from the catalogue, and Qwen-Image-Edit-2511 + Lightning + the right LoRA renders it in seconds. Pick a style below."],
          stack: ["Qwen3-VL router", "Qwen-Image-Edit-2511", "Lightning 8-step", "style catalogue"],
          tabs: [
            ["Gaming_Room_Cyberpunk", "Cyberpunk"], ["Dining_Room_Ancient_Egyptian", "Egyptian"], ["Deck_Christmas", "Christmas"],
            ["Attic_Gothic", "Gothic"], ["Kitchen_Cartoon", "Cartoon"], ["Bedroom_Biophilic", "Biophilic"],
            ["Study_Room_Bohemian", "Bohemian"], ["Restaurant_Chocolate", "Chocolate"], ["Hall_Cyberpunk", "Neon hall"],
            ["Study_Room_Biophilic", "Green study"], ["Coffee_Shop_Coastal", "Coastal café"], ["Home_Office_Christmas", "Xmas office"]
          ].map(([f, n]) => ({ name: n, thumb: `media/styles/${f}.webp`, items: [{ type: "ba", before: "media/styles/input.webp", after: `media/styles/${f}.webp`, lb: "Empty room", la: n }] }))
        },
        {
          id: "blueprint", kind: "LoRA · Qwen-Image-Edit-2511",
          title: "Blueprint → 3D",
          tagline: "A flat floor plan becomes a furnished, styled top-down render.",
          desc: ["Feed it a 2D house plan and a style; it furnishes every room in place — walls, doors and the garage stay where the plan puts them."],
          stack: ["Qwen-Image-Edit-2511", "LoRA", "checkpoint sweep", "31 interior styles"],
          tabs: [
            ["21_17", "Rainbow"], ["0_13", "Rainbow II"], ["75_2", "Cyberpunk"], ["41_24", "Neon"], ["67_3", "Ski chalet"],
            ["71_9", "Pastel"], ["22_15", "Pink"], ["23_4", "Classic"], ["1_13", "Rustic"]
          ].map(([id, n]) => ({ name: n, thumb: `media/blueprint/${id}_out.webp`, items: [{ type: "ba", before: `media/blueprint/${id}_in.webp`, after: `media/blueprint/${id}_out.webp`, lb: "Floor plan", la: n }] }))
        }
      ]
    },

    /* ======================= VIDEO ======================= */
    {
      id: "video", nav: "Video", eyebrow: "Video generation · motion control",
      title: "Anyone, <em>in any shot.</em>",
      lead: "Character replacement, multi-reference video and object removal on MiniMax-H3 (33B). Training to sglang serving, SAM3 masking to prompt planning — end to end, on one H100. Drag across any video to compare.",
      projects: [
        {
          id: "h3-replace", kind: "LoRA training · MiniMax-H3 Ref2VA",
          title: "H3 Character Replace",
          tagline: "Same motion, camera and scene — a different person.",
          desc: ["Swaps a person in a video for the person in a photo. Motion, camera, scene and sound stay — no compositing, every pixel is the model's own render. SCAIL-2's recipe, ported to H3 and trained by me."],
          stack: ["MiniMax-H3 33B", "ai-toolkit", "LoRA r16", "SAM3", "sglang", "MotionPair-60K", "ArcFace"],
          items: [
            { type: "swap", ar: "9/16", sound: true, driving: "media/latest/calm_drv.mp4", options: [
              { name: "The calmest man", note: "touchline, crowd going wild", thumb: "media/latest/calm_thumb.webp", ref: "media/latest/me_cut.webp", driving: "media/latest/calm_drv.mp4", out: "media/latest/calm_out.mp4" },
              { name: "Street freestyle", note: "hand-held, crowd around", thumb: "media/latest/bulin_thumb.webp", ref: "media/latest/me_cut.webp", driving: "media/latest/bulin_drv.mp4", out: "media/latest/bulin_out.mp4" },
              { name: "Party", note: "eating, lip motion", thumb: "media/latest/party_thumb.webp", ref: "media/latest/me_cut.webp", driving: "media/latest/party_drv.mp4", out: "media/latest/party_out.mp4" }
            ], caption: "Me, from one selfie, in three viral clips — the delivered model. Pick a scene, drag across, turn the sound on." },
            { type: "swap", ar: "9/16", center: 28, amp: 24, driving: "media/replace/td_drv.mp4", options: [
              { name: "Dog", note: "replaces the keyboard player", ref: "media/replace/pet-1.webp", out: "media/replace/td_pet.mp4" },
              { name: "Kid", note: "same shot, new reference", ref: "media/replace/boy-1.webp", out: "media/replace/td_boy.mp4" }
            ], caption: "Pick a reference on the right, drag across the video. Singers, camera and sound stay untouched." }
          ]
        },
        {
          id: "ref2video", kind: "Inference system · MiniMax-H3",
          title: "Ref2Video & Object Swap",
          tagline: "1–9 reference images + a request → video.",
          desc: ["1–9 reference images + a request → video. Here the same stunt shot gets a different car each time."],
          stack: ["MiniMax-H3 Ref2VA", "fp8", "Turbo LoRA", "sglang", "SAM3", "two-pass"],
          items: [
            { type: "swap", ar: "1/1", lb: "Source", la: "Swapped", driving: "media/car/driving.mp4", options: [
              { name: "Lamborghini Huracán", note: "orange", ref: "media/car/lamborghini-huracan-orange.webp", out: "media/car/lamborghini-huracan-orange.mp4" },
              { name: "Tesla Model 3", note: "white", ref: "media/car/tesla-model3-white.webp", out: "media/car/tesla-model3-white.mp4" },
              { name: "Jeep Wrangler", note: "lime", ref: "media/car/jeep-wrangler-lime.webp", out: "media/car/jeep-wrangler-lime.mp4" }
            ], caption: "Same stunt, three different cars — pick one and drag across." }
          ]
        },
        {
          id: "person-remover", kind: "LoRA replication · MiniMax-H3",
          title: "Person Remover",
          tagline: "Mask a person out of a video, fill in what was behind.",
          desc: ["Mask a person out of a video and the model fills in what was behind them. A replication of akatz-ai's LoRA that beat the released weights."],
          stack: ["MiniMax-H3", "IC-LoRA guide", "LoRA r16", "AdamW8bit", "PSNR eval"],
          tabs: [["062", "Gallery"], ["064", "Metro"], ["067", "Living room"], ["057", "Space station"], ["048", "Store"], ["074", "Bakery"]].map(([g, n]) => ({
            name: n, thumb: `media/remover/${g}_s250.webp`, items: [{ type: "ba", before: `media/remover/${g}_ctrl.webp`, after: `media/remover/${g}_s250.webp`, lb: "Masked", la: "Removed" }]
          }))
        }
      ]
    },

    /* ======================= SYSTEMS ======================= */
    {
      id: "systems", nav: "Systems", eyebrow: "Routing · planning · eval",
      title: "The parts <em>you don't see.</em>",
      lead: "A model is not a product. Routers that send each request to the right pipeline, prompt planners, the work of fitting models onto GPUs, and the tools that measure the results.",
      projects: [
        {
          id: "planner", kind: "LLM routing · vLLM",
          title: "Prompt Planner & Router",
          tagline: "Turns a user request into the right model and the right prompt.",
          desc: ["Every request is routed to the right pipeline and rewritten into the prompt format the video model wants."],
          stack: ["Qwen3.8-27B-FP8", "Qwen3-VL-8B", "vLLM sleep mode", "sglang"],
          items: [
            { type: "flow", nodes: [
              { t: "Request", s: "text · 0–9 images · video" },
              { t: "Router", s: "plan(kind) → t2v / i2v / ref2va / replace", hot: true },
              { t: "Planner", s: "six-section prompt · speech budget · two-pass split" },
              { t: "MiniMax-H3", s: "sglang · fp8 · Turbo LoRA" }
            ]},
            { type: "routes", items: [
              { code: "t2v", p: "Text only → text-to-video planner" },
              { code: "i2v", p: "One image → used as the first frame" },
              { code: "ref2va", p: "1–9 references → identity / object kept" },
              { code: "replace", p: "Driving video + people → who becomes whom" },
              { code: "two_pass", p: "≥20 s → two passes + 39-frame pin" }
            ]}
          ]
        },
        {
          id: "routers", kind: "Routing · HomeAI & Reshoot",
          title: "Routers",
          tagline: "One entry point, many specialised LoRAs behind it.",
          desc: ["HomeAI: a Qwen3-VL router sends every photo + request to one of eight clusters, each with its own LoRA. Reshoot: the router stacks portrait LoRAs (nose, texture, retake, full body…) per request — and I distilled several of them into one CollectionLoRA."],
          stack: ["Qwen3-VL-4B", "vLLM", "LoRA stacking", "Qwen-Image-Edit 2509/2511", "distillation"],
          items: [
            { type: "flow", nodes: [
              { t: "Photo + request", s: "free text, any room" },
              { t: "Router", s: "Qwen3-VL picks the cluster", hot: true },
              { t: "Resolver", s: "room × style → prompt + LoRA" },
              { t: "Edit", s: "2511 + Lightning" }
            ]},
            { type: "routes", items: [
              { code: "interior", p: "style catalogue" }, { code: "exterior", p: "facades, seasonal" },
              { code: "garden", p: "outdoor spaces" }, { code: "cleanup", p: "declutter" },
              { code: "layout_boost", p: "rearrange furniture" }, { code: "reference", p: "style from a photo" },
              { code: "blueprint", p: "plan → 3D" }, { code: "custom", p: "anything else" }
            ]}
          ]
        }
      ]
    }
  ],

  stack: [
    { t: "Models", i: ["MiniMax-H3", "Qwen-Image-Edit 2509/2511", "Wan-Animate-2", "SCAIL-2", "LTX-2.5", "Qwen3-VL", "SAM3"] },
    { t: "Training", i: ["ai-toolkit", "LoRA / IC-LoRA", "AdamW8bit", "flow matching", "dataset curation"] },
    { t: "Inference", i: ["sglang", "vLLM", "fp8 / nvfp4", "FA3", "Lightning / Turbo", "H100"] },
    { t: "Eval & Tooling", i: ["ArcFace", "PSNR / ΔE", "SyncNet", "HTML A/B reports", "Gradio", "GCS"] }
  ]
};
