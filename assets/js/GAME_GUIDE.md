# DETERMINED - Game Development and Writing Guide

This guide provides information for both developers and writers who want to create, modify, or extend content for the Determined game.

## Table of Contents
- [DETERMINED - Game Development and Writing Guide](#determined---game-development-and-writing-guide)
  - [Table of Contents](#table-of-contents)
  - [For Writers](#for-writers)
    - [Journey Files](#journey-files)
      - [Journey File Structure](#journey-file-structure)
      - [Step-by-Step Journey Creation](#step-by-step-journey-creation)
      - [Common Pitfalls](#common-pitfalls)
    - [Metadata Structure](#metadata-structure)
      - [Metadata Properties](#metadata-properties)
      - [Metadata in Code](#metadata-in-code)
      - [Testing Metadata](#testing-metadata)
    - [Initial Values](#initial-values)
      - [Core Statistics](#core-statistics)
      - [Tool Configuration](#tool-configuration)
      - [Initial Value Calibration](#initial-value-calibration)
      - [Initial Values Loading](#initial-values-loading)
    - [Scenes Structure](#scenes-structure)
      - [Scene Creation Guide](#scene-creation-guide)
      - [Required Scene Properties](#required-scene-properties)
      - [Optional Scene Properties](#optional-scene-properties)
      - [Scene IDs and Navigation](#scene-ids-and-navigation)
      - [Scene Flow Implementation](#scene-flow-implementation)
      - [Scene Example](#scene-example)
    - [Choices Structure](#choices-structure)
      - [Choice Object Structure](#choice-object-structure)
      - [Required Choice Properties](#required-choice-properties)
      - [Optional Choice Properties](#optional-choice-properties)
      - [Choice Design Guidelines](#choice-design-guidelines)
      - [Choice Examples](#choice-examples)
      - [Choice Implementation](#choice-implementation)
    - [Resource Links](#resource-links)
      - [Resource Structure](#resource-structure)
      - [Required Resource Properties](#required-resource-properties)
      - [Resource Display Modes](#resource-display-modes)
      - [Resource Selection Guidelines](#resource-selection-guidelines)
      - [Resource Placement](#resource-placement)
      - [Resource Examples](#resource-examples)
      - [Resource Maintenance](#resource-maintenance)
    - [Toolkit Integration](#toolkit-integration)
      - [Master Toolkit System](#master-toolkit-system)
    - [Writing Guidelines](#writing-guidelines)
    - [Testing Content](#testing-content)
  - [For Developers](#for-developers)
    - [Game Architecture](#game-architecture)
    - [File Structure](#file-structure)
    - [HTML Structure](#html-structure)
    - [CSS Styling](#css-styling)
    - [JavaScript Implementation](#javascript-implementation)
    - [Customizing the Game](#customizing-the-game)
      - [Modifying game.html](#modifying-gamehtml)
      - [Modifying CSS](#modifying-css)
    - [Adding New Features](#adding-new-features)
    - [Toolkit System](#toolkit-system)
    - [Resource Display Modes](#resource-display-modes-1)
    - [Dark/Light Theme Support](#darklight-theme-support)
    - [Debugging](#debugging)
  - [Quick Reference](#quick-reference)
    - [Journey File Template](#journey-file-template)
    - [Master Toolkit JSON Template](#master-toolkit-json-template)

---

## For Writers

### Journey Files

#### Journey File Structure

Journey files are the foundation of content in the DETERMINED game. Each journey file is a self-contained narrative experience with its own scenes, choices, and potential ending states. 

The journey files use JSON format, which is a structured data format that's both human-readable and machine-parsable. Follow the structure carefully, including the use of curly braces `{}`, square brackets `[]`, commas, and quotation marks. Any syntax errors in the JSON structure will prevent the journey from loading.

Each journey file consists of three main sections:
1. **Metadata**: Information about the journey itself (title, description, image) - **REQUIRED at the top of the file**
2. **Initial Values**: Starting statistics and available tools for the player
3. **Scenes**: All the individual scenes that make up the journey, each with its own content and choices

> **IMPORTANT**: The metadata section must be the first section in your journey file. This is critical for dynamic journey card generation on the selection screen.

#### Step-by-Step Journey Creation

1. **Create a new file** in the `assets/js/journeys/` directory
   - Name it following the pattern: `journey_X.json` (where X is the next available number)
   - For example: `journey_5.json` if journeys 1-4 already exist

2. **Set up the basic structure** of your journey file:
   ```json
   {
     "metadata": {
       "title": "Your Journey Title",
       "description": "Brief description of your journey",
       "image": "../assets/images/your-image.jpg"
     },
     "initial_values": {
       "resist": 50,
       "use": 50,
       "unlocked_tools": []
     },
     "scene_001": {
       // Your first scene will go here
     }
   }
   ```

3. **Create your first scene**:
   ```json
   "scene_001": {
     "title": "Opening Scene Title",
     "narration": "Your opening narrative text explaining the situation to the player.",
     "choices": [
       {
         "label": "First choice option",
         "resist_change": 5,
         "use_change": 0,
         "time_advance": 1,
         "next_scene_id": "scene_002a"
       },
       {
         "label": "Second choice option",
         "resist_change": -5,
         "use_change": 10,
         "time_advance": 1,
         "next_scene_id": "scene_002b"
       }
     ]
   }
   ```

4. **Add subsequent scenes** following the same structure:
   ```json
   "scene_002": {
     "title": "Second Scene Title",
     "narration": "Narrative text for scene 002.",
     "choices": [
       // Choices for this scene
     ]
   },
   "scene_003": {
     "title": "Third Scene Title",
     "narration": "Narrative text for scene 003.",
     "choices": [
       // Choices for this scene
     ]
   }
   ```

5. **Create ending scenes** to conclude your journey:
   ```json
   "scene_win": {
     "title": "Success Ending",
     "narration": "Narrative describing the successful conclusion.",
     "choices": [],
     "end": "win"
   },
   "scene_relapse": {
     "title": "Relapse Ending",
     "narration": "Narrative describing the relapse conclusion.",
     "choices": [],
     "end": "relapse"
   }
   ```

#### Common Pitfalls

1. **Missing or misplaced commas**: 
   - Every property in a JSON object needs to be separated by a comma
   - The last property in an object should NOT have a trailing comma
   - Example: `"title": "Scene Title", "narration": "Text here"` (comma between properties)

2. **Quote marks**: 
   - All property names and string values must be enclosed in double quotes
   - Example: `"title": "Scene Title"` (both the property name and value have quotes)

3. **Scene ID references**:
   - Always ensure your `next_scene_id` values match existing scene IDs
   - A common error is referencing a scene that doesn't exist

4. **JSON syntax errors**:
   - Use a JSON validator (like [JSONLint](https://jsonlint.com/)) to check your file
   - Consider using a code editor with JSON syntax highlighting

### Metadata Structure

#### Metadata Properties

The `metadata` section contains information that helps players understand what the journey is about before they start playing. **This section must be at the top of your JSON file.**

```json
"metadata": {
  "title": "Journey Title",
  "description": "A brief description that will appear on the selection screen",
  "image": "../assets/images/journey-image.jpg"
}
```

Each property in the metadata has a direct impact on how your journey appears:

- **`title`** (required): 
  - The main title shown at the top of the journey card
  - Appears in the `<h3>` element of the story-info section
  - Should be concise but descriptive, ideally 2-5 words
  - Examples: "First Steps", "The Party", "Workplace Challenges"
  - If not provided, the game will default to "Journey X" where X is the number
  - **Technical impact**: This text is inserted directly into HTML: `<h3>${journey.title}</h3>`

- **`description`** (required):
  - A brief summary of what the journey is about
  - Appears in the `<p>` element of the story-info section
  - Appears below the title on the journey card
  - Should be 1-3 sentences (approximately 150 characters or less)
  - Examples: "Navigate your first day back at work after treatment.", "Learn to handle social pressure at a friend's party."
  - If not provided, the game will default to "Journey description X" where X is the number
  - **Technical impact**: This text is inserted directly into HTML: `<p>${journey.description}</p>`

- **`image`** (optional but recommended):
  - The path to an image that represents the journey
  - Displayed as the journey card's primary image
  - Image path is relative to the HTML file (game.html)
  - Recommended size: 16:9 aspect ratio, at least 600x338 pixels
  - If not provided, the game will use a default gradient image
  - Best practice: Place journey-specific images in `assets/images/journeys/` folder
  - Example path: `"../assets/images/journeys/workplace.jpg"`
  - **Technical impact**: This path is used in the image src attribute: `<img src="${journey.image}" alt="${journey.title}">`

#### Metadata in Code

The metadata is used by the `create_journey_cards` function in game.js to generate journey selection cards:

```javascript
// From game.js
card.innerHTML = `
    <div class="story-card-content">
        <div class="story-image">
            <img src="${journey.image}" alt="${journey.title}">
        </div>
        <div class="story-info">
            <h3>${journey.title}</h3>
            <p>${journey.description}</p>
            <button class="select-story-btn">Start Journey</button>
        </div>
    </div>
`;
```

#### Testing Metadata

To test how your metadata appears:
1. Save your journey file in the correct location
2. Open the game in a browser (`pages/game.html`)
3. The selection screen should automatically load your journey
4. Check that the title, description, and image appear correctly

### Initial Values

The `initial_values` section defines the starting state for the player when they begin the journey. These values set the foundation for gameplay.

```json
"initial_values": {
  "resist": 50,
  "use": 50,
  "unlocked_tools": ["meditation", "call_mentor"]
}
```

#### Core Statistics

- **`resist`** (required):
  - Represents the player's ability to resist urges and maintain recovery
  - Value range: 0-100
  - When this value reaches 0, the player experiences a relapse ending
  - Higher starting values (70-100) create an easier journey
  - Lower starting values (30-50) create a more challenging journey
  - Default if not specified: 100
  - Game UI: Appears as a green progress bar labeled "RESIST"
  - **Technical implementation**: This value is loaded into `game_state.resist` during game initialization

- **`use`** (required):
  - Represents the player's urge to use substances
  - Value range: 0-100
  - Higher values create more pressure on the player
  - When combined with low resist, creates high-risk scenarios
  - Default if not specified: 100
  - Game UI: Appears as a red progress bar labeled "USE"
  - **Technical implementation**: This value is loaded into `game_state.use` during game initialization

#### Tool Configuration

- **`unlocked_tools`** (optional):
  - An array of tool IDs that are available to the player from the beginning
  - Each ID must match a tool defined in the master toolkit file (`master_journey_toolkit.json`)
  - Default if not specified: [] (empty array, no tools available at start)
  - Example: `"unlocked_tools": ["meditation", "call_mentor"]`
  - Tools not listed here can be unlocked through choices during gameplay
  - **Technical implementation**: These values are loaded into `game_state.unlocked_tools` during game initialization

#### Initial Value Calibration

The initial values directly impact gameplay difficulty:

1. **For a beginner-friendly journey**:
   ```json
   "initial_values": {
     "resist": 80,
     "use": 30,
     "unlocked_tools": ["meditation", "call_mentor", "exercise"]
   }
   ```
   This creates a low-pressure experience with high resistance, low urge, and several tools available.

2. **For a challenging journey**:
   ```json
   "initial_values": {
     "resist": 40,
     "use": 70,
     "unlocked_tools": []
   }
   ```
   This creates a high-pressure experience with low resistance, high urge, and no tools available.

3. **For a mid-point journey**:
   ```json
   "initial_values": {
     "resist": 60,
     "use": 50,
     "unlocked_tools": ["meditation"]
   }
   ```
   This creates a balanced experience with moderate resistance, moderate urge, and one basic tool available.

#### Initial Values Loading

The `start_game` function in game.js reads these values during initialization:

```javascript
// From game.js
if (scene_data.initial_values) {
    game_state.resist = scene_data.initial_values.resist ?? 100;
    game_state.use = scene_data.initial_values.use ?? 100;
    
    // Initialize unlocked tools if specified
    if (Array.isArray(scene_data.initial_values.unlocked_tools)) {
        game_state.unlocked_tools = [...scene_data.initial_values.unlocked_tools];
    }
}
```

### Scenes Structure

Scenes are the fundamental building blocks of your journey. Each scene represents a moment in the story where the player receives narrative information and makes choices that affect the outcome.

#### Scene Creation Guide

Each scene is defined as a separate object in the journey file, identified by a unique scene ID:

```json
"scene_001": {
  "title": "Scene Title",
  "narration": "The narrative text that describes the scene in detail.",
  "toolkit": true,
  "choices": [
    {
      "label": "First choice option",
      "next_scene_id": "scene_002"
    },
    {
      "label": "Second choice option",
      "next_scene_id": "scene_003"
    }
  ]
}
```

#### Required Scene Properties

- **`title`** (required):
  - The title of the scene displayed at the top of the screen.
  - Will be prefixed with "Lorem Ipsum" if not already present.
  - Example: If you set "Morning Dilemma", it will display as "Lorem Ipsum Morning Dilemma"
  - If you want to include "Lorem Ipsum" in your title, simply add it: "Lorem Ipsum Breaking Point"
  - Should be concise (3-5 words) but descriptive of the situation.
  - **Technical implementation**: This value is processed by `format_scene_title` and displayed in the `#scene-title` element

- **`narration`** (required):
  - The main descriptive text for the scene.
  - This is where you tell your story and set up the choices.
  - Can be multiple paragraphs, but avoid excessive length (200-400 words recommended).
  - Should provide enough context for the player to make an informed choice.
  - Can include descriptive language, character thoughts, dialogue, etc.
  - **Technical implementation**: This text is displayed directly in the `#scene-narration` element
  - **Line breaks**: Use the `\n` character to create paragraph breaks in your narration text.
  - Example:
    ```json
    "narration": "You wake up feeling tired after a restless night.\n\nYour phone buzzes with a text from your sponsor: 'Big day today. Remember your strategies.'"
    ```

- **`choices`** (required):
  - An array of choice objects that the player can select from.
  - Each journey should have at least two choices per scene (except ending scenes).
  - Each choice must include a label and next_scene_id at minimum.
  - See the [Choices Structure](#choices-structure) section for detailed information.
  - **Technical implementation**: These choices are rendered as buttons in the `#choices` container
  - **Order matters**: Choices are displayed in the order they appear in the array.

#### Optional Scene Properties

- **`toolkit`** (optional):
  - Controls which tools are available to the player in this scene.
  - Three possible values:
    - `true`: All unlocked tools are available (default if not specified)
    - `false`: No tools are available
    - Array of tool IDs: Only specific tools are available
  - **Technical implementation**: This value is processed by `update_available_tools` to determine which tools appear in the toolkit popup.
  - **Strategic use**: Use this property to create narrative-appropriate tool availability.
  - **Examples**:
    ```json
    "toolkit": true                     // All unlocked tools available
    "toolkit": false                    // No tools available
    "toolkit": ["meditation", "exercise"] // Only these specific tools available
    ```

- **`end`** (optional):
  - If present, defines an ending type for the journey.
  - Two possible values:
    - `"win"`: A successful ending - triggers the win screen
    - `"relapse"`: An unsuccessful ending - triggers the relapse screen
  - **Technical implementation**: This value is checked in `process_pending_choice` to determine if the journey has ended.
  - **UI impact**: Different ending types show different messages to the player.
  - **Example**:
    ```json
    "scene_win": {
      "title": "Recovery Triumph",
      "narration": "You've successfully navigated this challenge.",
      "choices": [],
      "end": "win"
    }
    ```

#### Scene IDs and Navigation

Scene IDs are used to identify scenes and create the branching structure:

- **Format**: Scene IDs typically follow the pattern `scene_XXX` where XXX is a number.
- **The first scene must always be `scene_001`** - this is where the journey begins.
- **Standardized ending IDs**: Common practice is to use `scene_win` and `scene_relapse` for ending scenes.
- **Branch identification**: You can use descriptive IDs to help track branches:
  - Sequential: `scene_001`, `scene_002`, `scene_003`
  - Path-based: `scene_good_001`, `scene_bad_001`
  - Descriptive: `scene_work`, `scene_home`, `scene_party`
- Each scene ID must be unique within your journey file.
- **Technical implementation**: These IDs are used by `next_scene_id` to create navigation between scenes.

#### Scene Flow Implementation

1. **Plan your branching structure**:
   - Start with scene_001 as your entry point
   - Map out main decision points and branches
   - Identify where branches converge
   - Plan win and relapse ending points

2. **Create the opening scene**:
   ```json
   "scene_001": {
     "title": "Morning Start",
     "narration": "You wake up feeling anxious about your first day back at work.",
     "choices": [
       {
         "label": "Take time for a mindfulness exercise",
         "resist_change": 10,
         "use_change": -5,
         "time_advance": 0.5,
         "next_scene_id": "scene_002a"
       },
       {
         "label": "Skip breakfast and rush to work",
         "resist_change": -5,
         "use_change": 10,
         "time_advance": 0,
         "next_scene_id": "scene_002b"
       }
     ]
   }
   ```

3. **Create branch scenes**:
   ```json
   "scene_002a": {
     "title": "Calm Arrival",
     "narration": "You arrive at work feeling centered and prepared.",
     "choices": [
       // Choices leading to next scenes
     ]
   },
   "scene_002b": {
     "title": "Rushed Arrival",
     "narration": "You arrive at work feeling rushed and anxious.",
     "choices": [
       // Choices leading to next scenes
     ]
   }
   ```

4. **Create a convergence point** (if needed):
   ```json
   "scene_003": {
     "title": "Team Meeting",
     "narration": "Regardless of your morning, you now find yourself in the weekly team meeting.",
     "choices": [
       // Choices leading to next scenes
     ]
   }
   ```

5. **Create ending scenes**:
   ```json
   "scene_win": {
     "title": "Day Complete",
     "narration": "You've successfully navigated your first day back.",
     "choices": [],
     "end": "win"
   },
   "scene_relapse": {
     "title": "Overwhelming Pressure",
     "narration": "The pressure became too much to handle.",
     "choices": [],
     "end": "relapse"
   }
   ```

#### Scene Example

```json
"scene_workplace_meeting": {
  "title": "Team Meeting Tension",
  "narration": "The conference room fills quickly as your colleagues arrive for the weekly team meeting. You take a seat near the back, hoping to avoid too much attention. It's your third day back at work since treatment, and things have been going relatively well so far.\n\nAs the meeting progresses, your manager announces a new project with tight deadlines. 'We'll need someone to take point on this,' she says, her eyes scanning the room. Several people look down, avoiding eye contact.\n\n'What about you?' she asks, looking directly at you. 'This would be a good opportunity to jump back in fully.'\n\nYou feel all eyes turn to you. The pressure is immediate – this project would mean late nights, high stress, and proving yourself to everyone. Your palms begin to sweat as you consider your response.",
  "toolkit": ["meditation", "call_mentor"],
  "choices": [
    {
      "label": "Accept the project confidently: 'I'd be happy to lead this project.'",
      "resist_change": -15,
      "use_change": 20,
      "time_advance": 0,
      "next_scene_id": "scene_project_accepted",
      "resource_link": {
        "url": "https://www.samhsa.gov/find-help/national-helpline",
        "text": "Support resources for workplace stress",
        "description": "Information about managing work pressure during recovery."
      }
    },
    {
      "label": "Suggest a collaborative approach: 'I'd like to be involved, but perhaps as part of a team rather than the lead.'",
      "resist_change": 5,
      "use_change": -5,
      "time_advance": 0,
      "next_scene_id": "scene_collaborative_approach",
      "unlock_tool": "boundary_setting"
    },
    {
      "label": "Privately explain your concerns to your manager after the meeting",
      "resist_change": 10,
      "use_change": -10,
      "time_advance": 1,
      "next_scene_id": "scene_manager_discussion"
    }
  ]
}
```

This scene includes:
- Narrative context with environmental details and character interactions
- Three distinct choices with different gameplay implications
- Stat changes based on the psychological impact of each choice
- Additional features (resource link, tool unlock) on appropriate choices

### Choices Structure

Choices are the interactive elements of your journey that allow players to make decisions and influence the narrative. Each choice represents a possible action or response the player can take in a given scene.

#### Choice Object Structure

Each choice is defined as an object within the `choices` array of a scene:

```json
{
  "label": "Choice text shown to player",
  "resist_change": 10,
  "use_change": -5,
  "time_advance": 1,
  "next_scene_id": "scene_002",
  "resource_link": {...},
  "unlock_tool": "meditation"
}
```

#### Required Choice Properties

- **`label`** (required):
  - The text displayed on the choice button that players will click.
  - Should be concise but descriptive enough to convey the action or response.
  - Recommended length: 5-15 words.
  - **Technical implementation**: This text becomes the button text: `button.textContent = choice.label;`
  - **UI impact**: Appears as a clickable button in the choices container.
  - **Formatting options**:
    - Action statements: "Call your sponsor for support"
    - Dialogue: "'I need some time to think about this'"
    - Internal thoughts: "Remind yourself of your recovery goals"
  - **Best practice**: Start with a verb to indicate action.

- **`next_scene_id`** (required):
  - The ID of the scene to transition to when this choice is selected.
  - Must match an existing scene ID in your journey file.
  - Creates the connection between scenes that forms your narrative branches.
  - **Technical implementation**: When a choice is selected, the game uses this ID to load the next scene: `game_state.current_scene = choice.next_scene_id;`
  - **Common error**: Referencing a scene ID that doesn't exist will break the game flow.

#### Optional Choice Properties

- **`resist_change`** (optional):
  - How much the resistance stat changes when this choice is selected.
  - Positive values increase resistance (good for recovery).
  - Negative values decrease resistance (increasing risk of relapse).
  - **Technical implementation**: This value is added to the current resist stat: `update_resist_stat(choice.resist_change || 0);`
  - **Game impact**: Modifies the green RESIST bar in the UI.
  - **Default value**: 0 (no change)
  - **Recommended ranges**:
    - Minor choices: -5 to +5
    - Standard choices: -10 to +10
    - Critical choices: -20 to +20
    - Extreme choices: -30 to +50 (use sparingly for major turning points)
  - **Example**: `"resist_change": 15` (significant positive impact on recovery)

- **`use_change`** (optional):
  - How much the usage urge stat changes when this choice is selected.
  - Positive values increase urge (creating pressure).
  - Negative values decrease urge (relieving pressure).
  - **Technical implementation**: This value is added to the current use stat: `update_use_stat(choice.use_change || 0);`
  - **Game impact**: Modifies the red USE bar in the UI.
  - **Default value**: 0 (no change)
  - **Example**: `"use_change": -10` (reduces urge by 10 points)

- **`time_advance`** (optional):
  - How many hours to advance the game clock when this choice is selected.
  - Used to create a sense of time passing in the journey.
  - Can use decimals for shorter time periods: 0.5 = 30 minutes.
  - **Technical implementation**: This value is added to the time counter: `game_state.time += choice.time_advance || 0;`
  - **Game impact**: Updates the time display in the UI (e.g., "2d 5h").
  - **Default value**: 0 (no time advance)
  - **Common values**:
    - 0.5: Quick actions (30 minutes)
    - 1-2: Standard activities (1-2 hours)
    - 8: Major time jump (e.g., sleep, workday)
    - 24: Full day advance
  - **Example**: `"time_advance": 2` (advances time by 2 hours)

- **`resource_link`** (optional):
  - An object defining a resource to show with this choice.
  - Used to provide helpful real-world information related to the situation.
  - See the [Resource Links](#resource-links) section for detailed structure.
  - **Technical implementation**: When a choice with a resource_link is selected, the game either shows a popup or inline resource based on settings.
  - **Example**: 
    ```json
    "resource_link": {
      "url": "https://www.recovery.org/coping-skills/",
      "text": "Coping Skills Guide",
      "description": "Practical techniques for handling stressful situations."
    }
    ```

- **`unlock_tool`** (optional):
  - The ID of a tool from the master toolkit to unlock when this choice is selected.
  - Must match an existing tool ID in the master toolkit file.
  - Only specify one tool per choice.
  - **Technical implementation**: When a choice with unlock_tool is selected, the tool is added to the player's unlocked_tools array and a notification is shown.
  - **Game impact**: Makes the tool available for use in future scenes (subject to toolkit availability).
  - **UI effect**: Shows a tool unlock popup with tool details.
  - **Example**: `"unlock_tool": "journaling"`

#### Choice Design Guidelines

When designing choices, consider the following strategies to create meaningful gameplay:

1. **Statistical Balance: Using Resist/Use Changes Effectively**

   The `resist_change` and `use_change` properties create the gameplay mechanics of your journey:

   - **Psychologically realistic changes**: 
     - Healthy coping: +resist, -use (e.g., meditation, calling sponsor)
     - Risk-taking: -resist, +use (e.g., going to a bar, skipping therapy)
     - Self-care: +resist, -use (e.g., exercise, good sleep)
     - Stress/triggers: -resist, +use (e.g., conflict, seeing old friends who use)

   - **Risk vs. Reward tradeoffs**: 
     - Low-risk choice: Small positive changes (+5 resist, -5 use)
     - Balanced choice: Mixed effects (+10 resist, +5 use)
     - High-risk choice: Large potential downside (-15 resist, +20 use)
     - Strategic choice: Short-term cost for long-term gain (-5 resist, -15 use)

   - **Narrative significance**: 
     - Minor decision: ±5 points
     - Significant decision: ±10-15 points
     - Critical decision: ±20-30 points
     - Life-changing decision: ±30-50 points

2. **Choice Presentation Strategy: The Importance of Order**

   The order of choices matters! Players tend to read from top to bottom:

   - **Ordering principles**:
     - Put safer/healthier choices first to encourage positive decisions
     - Put riskier choices last to create tension
     - Group similar choices together for clarity

   - **Number of choices per scene**:
     - Minimum: 2 choices (binary decisions)
     - Optimal: 3 choices (positive, neutral, negative options)
     - Maximum: 5 choices (more becomes overwhelming)

   - **Choice variety**:
     - Include choices that affect different aspects (stats, time, tools, resources)
     - Mix short-term and long-term consequences
     - Provide both emotional and practical response options

#### Choice Examples

Here are examples of different choice sets for various scenarios:

```json
// Balanced choice set with varied impacts
"choices": [
  {
    "label": "Practice the mindfulness technique your therapist taught you",
    "resist_change": 15,
    "use_change": -10,
    "time_advance": 0.5,
    "next_scene_id": "scene_mindfulness_success"
  },
  {
    "label": "Call your sponsor for immediate support",
    "resist_change": 10,
    "use_change": -15,
    "time_advance": 1,
    "next_scene_id": "scene_sponsor_call",
    "resource_link": {
      "url": "https://www.aa.org/find-aa",
      "text": "Find Support Resources",
      "description": "Directory of support meetings and contacts."
    }
  },
  {
    "label": "Try to handle it on your own - you've got this",
    "resist_change": -5,
    "use_change": 15,
    "time_advance": 0,
    "next_scene_id": "scene_self_struggle"
  }
]

// Choice set that includes a tool unlock
"choices": [
  {
    "label": "Attend the workshop on journaling for recovery",
    "resist_change": 5,
    "use_change": 0,
    "time_advance": 3,
    "next_scene_id": "scene_workshop_complete",
    "unlock_tool": "journaling"
  },
  {
    "label": "Skip the workshop and go home early",
    "resist_change": 0,
    "use_change": 5,
    "time_advance": 1,
    "next_scene_id": "scene_home_early"
  }
]

// High-stakes choice set for a critical moment
"choices": [
  {
    "label": "Accept that you need help and call your emergency contact",
    "resist_change": 20,
    "use_change": -25,
    "time_advance": 2,
    "next_scene_id": "scene_emergency_support",
    "resource_link": {
      "url": "https://www.samhsa.gov/find-help/national-helpline",
      "text": "Crisis Support Line",
      "description": "24/7 treatment referral and information service."
    }
  },
  {
    "label": "Go to the bar 'just to be around people' - you won't drink",
    "resist_change": -30,
    "use_change": 40,
    "time_advance": 3,
    "next_scene_id": "scene_high_risk_situation"
  }
]
```

#### Choice Implementation

When a player selects a choice:

1. The `select_choice` function is called, storing the choice in `game_state.pending_choice`
2. The choice button is highlighted and other buttons are disabled
3. Resource links (if present) are displayed
4. The continue button appears
5. When the player clicks continue, `process_pending_choice` is called
6. This function:
   - Checks for tool unlocks
   - Updates resist and use stats
   - Advances time
   - Moves to the next scene
   - Checks for win/relapse conditions

```javascript
// From game.js - How choices are processed
function process_pending_choice() {
    if (!game_state.pending_choice || !game_state.pending_scene_data) {
        console.error('No pending choice to process');
        return;
    }

    const choice = game_state.pending_choice;
    const scene_data = game_state.pending_scene_data;

    check_for_unlocked_tools(choice);

    update_resist_stat(choice.resist_change || 0);
    update_use_stat(choice.use_change || 0);
    game_state.time += choice.time_advance || 0;

    // Update scene and path history
    game_state.current_scene = choice.next_scene_id;
    game_state.path.push(choice.next_scene_id);

    update_stats();
    close_resource_popup();

    // Check game state outcomes
    if (game_state.resist <= 0) {
        trigger_relapse();
    } else if (scene_data[choice.next_scene_id]?.end === 'win') {
        trigger_win();
    } else {
        game_state.pending_choice = null;
        game_state.pending_scene_data = null;
        elements.continue_btn.classList.add('hidden');
        render_scene(scene_data, choice.next_scene_id);
    }
}
```

### Resource Links

Resource links connect the narrative with real-world support and information. They provide players with practical tools they can use in their own lives.

#### Resource Structure

Resources are defined as objects within a choice and appear after the player makes that choice:

```json
"resource_link": {
  "url": "https://example.com/resource",
  "text": "Link text",
  "description": "Brief description of the resource"
}
```

#### Required Resource Properties

- **`url`** (required):
  - The URL the resource links to
  - Must be a valid, accessible web address
  - Should link to reputable, helpful content related to recovery
  - **Technical implementation**: This becomes the href attribute of the link
  - **Best practice**: Use https:// URLs from established organizations
  - **Example**: `"url": "https://www.nami.org/help"`

- **`text`** (required):
  - The clickable text for the resource link
  - Should be concise but descriptive
  - Typically 2-6 words
  - **Technical implementation**: This becomes the text content of the link
  - **Best practice**: Make the text action-oriented (e.g., "Find Support Now")
  - **Example**: `"text": "Substance Abuse Support Resources"`

- **`description`** (required):
  - A brief description of the resource
  - Explains what the player will find if they click the link
  - Recommended length: 1-2 sentences
  - **Technical implementation**: This is displayed above or alongside the link
  - **Best practice**: Clearly explain the value of the resource
  - **Example**: `"description": "A directory of local support groups and professional counseling services for substance use disorders."`

#### Resource Display Modes

Resources can be displayed in two ways, configurable at the game level:

1. **Popup Mode**:
   - Resources appear in a modal popup dialog
   - Requires player interaction to close
   - More noticeable but potentially disruptive
   - **Implementation**: Controlled by the `show_resource_popup` function
   - **HTML structure**:
     ```html
     <div id="resource-popup" class="resource-popup">
       <div class="resource-popup-header">
         <h3 class="resource-popup-title">Helpful Resource</h3>
         <button id="close-resource-popup" class="resource-popup-close">×</button>
       </div>
       <div class="resource-popup-content">
         <p id="resource-description"></p>
         <a id="resource-link" class="resource-popup-link" target="_blank"></a>
       </div>
     </div>
     ```

2. **Inline Mode**:
   - Resources appear directly under the choices
   - Integrated into the game flow
   - Less disruptive but might be overlooked
   - **Implementation**: Controlled by the `show_inline_resource` function
   - **HTML structure** (generated dynamically):
     ```html
     <div class="inline-resource">
       <h4>Helpful Resource:</h4>
       <p>Resource description text</p>
       <a class="inline-resource-link" target="_blank">Link text</a>
     </div>
     ```

The display mode is set in the game.html file with the `data-resource-display` attribute:
```html
<main id="game-container" data-resource-display="popup" data-dev-tools="off">
```

Change this to "inline" to switch display modes:
```html
<main id="game-container" data-resource-display="inline" data-dev-tools="off">
```

#### Resource Selection Guidelines

When selecting resources to include:

1. **Relevance**: The resource should directly relate to the choice or situation
   - **Best practice**: Match resources to the specific challenge in the scene
   - **Example**: For a scene about workplace stress, link to workplace boundary resources

2. **Quality and Reliability**: Only link to reputable sources
   - **Recommended sources**:
     - Government agencies (SAMHSA, NIH, CDC)
     - Established non-profits (NAMI, Recovery.org)
     - Medical institutions (Mayo Clinic, Cleveland Clinic)
     - Academic sources (.edu domains)
   - **Avoid**: Personal blogs, commercial sites, controversial sources

3. **Accessibility**: Resources should be readily usable
   - **Best practices**:
     - Free resources are preferred over paywalled content
     - Mobile-friendly websites (players might be on various devices)
     - Resources that don't require registration when possible
   - **Consider**: Adding a brief note if registration is required

4. **Specificity**: More specific resources are more helpful
   - **Better**: "Coping with Workplace Triggers" vs. "Addiction Resources"
   - **Best practice**: Choose resources that address the specific choice context

#### Resource Placement

Not every choice needs a resource link. Consider these guidelines:

- Include resources for approximately 25-33% of choices
- Prioritize resources for:
  - High-risk situations
  - Significant learning moments
  - Introduction of new coping skills
  - Major decision points

#### Resource Examples

```json
// For a high-risk situation
"resource_link": {
  "url": "https://www.samhsa.gov/find-help/national-helpline",
  "text": "24/7 Recovery Helpline",
  "description": "Free, confidential, 24/7/365 treatment referral and information service for individuals and families facing mental and/or substance use disorders."
}

// For a workplace challenge
"resource_link": {
  "url": "https://www.apa.org/topics/healthy-workplaces/work-stress",
  "text": "Managing Workplace Stress",
  "description": "Evidence-based strategies for managing stress and maintaining wellbeing in high-pressure work environments."
}

// For a family conflict situation
"resource_link": {
  "url": "https://al-anon.org/",
  "text": "Family Support Resources",
  "description": "Resources for family members affected by someone else's drinking or substance use, including local meeting information."
}

// For practicing a new coping skill
"resource_link": {
  "url": "https://www.mindful.org/a-five-minute-breathing-meditation/",
  "text": "5-Minute Breathing Exercise",
  "description": "A guided mindfulness breathing technique you can practice anywhere when feeling overwhelmed."
}
```

#### Resource Maintenance

1. **Verify URLs**: Always check that your URLs work before finalizing your journey
   - Load the URL in a browser to confirm it's active
   - Check that it doesn't redirect to a different page
   - Verify the content is still relevant and appropriate

2. **Review descriptions**: Ensure descriptions accurately reflect the linked content
   - Be specific about what the player will find
   - Avoid overpromising (e.g., "This will cure your addiction")
   - Keep descriptions concise but informative

3. **Update resources**: If maintaining a journey long-term, periodically check that links still work
   - URLs may change over time
   - Content may be updated or removed
   - Better resources may become available

### Toolkit Integration

The toolkit system provides tools that players can use to manage their stats:

1. Tools are defined in the master toolkit file (`master_journey_toolkit.json`)
2. To make a tool available in a scene, set `"toolkit": true` or list specific tool IDs: `"toolkit": ["meditation", "exercise"]`
3. To unlock a tool through a choice, add `"unlock_tool": "tool_id"` to the choice

Tools are identified by their ID in the master toolkit file. You should only reference existing tool IDs rather than creating custom tool properties in journey files.

#### Master Toolkit System

All tools must be defined in the master toolkit file before they can be referenced in journey files. To create journey-specific variations of tools, follow these steps:

1. Define each unique tool variant with its own ID in the master toolkit
2. Reference the specific tool ID in your journey when using the `unlock_tool` property
3. Example of creating a journey-specific tool variation:

```json
// In master_journey_toolkit.json
{
  "tools": {
    "meditation_basic": {
      "title": "Basic Meditation",
      "description": "A simple breathing exercise.",
      "default_resist_cost": 3,
      "default_use_benefit": 10
    },
    "meditation_advanced": {
      "title": "Advanced Meditation",
      "description": "A longer, more effective meditation practice.",
      "default_resist_cost": 5,
      "default_use_benefit": 20
    }
  }
}
```

### Writing Guidelines

1. **Narrative Structure**:
   - Start with an engaging introduction scene
   - Create branching paths based on choices
   - Include both positive and negative consequences
   - Create satisfying endings for both success and failure paths

2. **Choice Design**:
   - Offer meaningful choices with different risk/reward profiles
   - Balance stat changes (resist/use) based on the choice difficulty
   - Gradually increase stakes as the journey progresses
   - Make choices reflect realistic recovery situations

3. **Time Management**:
   - Use `time_advance` to create a sense of progression
   - Consider making later scenes advance more time
   - Use time to create narrative pacing

4. **Resource Links**:
   - Add relevant, helpful resources to critical choice points
   - Make descriptions concise but informative
   - Ensure URLs are valid and accessible

5. **Toolkit Usage**:
   - Design scenes with deliberate toolkit availability
   - Use the unlock_tool property to create a progression of tools
   - Consider restricting certain tools in specific scenes based on the narrative context

6. **Scene-Specific Toolkit Control**:
   - Use `"toolkit": true` for normal scenes where all tools should be available
   - Use `"toolkit": false` for scenes where tools would be inappropriate (e.g., during a crisis)
   - Use `"toolkit": ["tool_id1", "tool_id2"]` for scenes where only specific tools make narrative sense

7. **Strategic Toolkit Design**:
   - Tools should feel like meaningful choices, not just stat boosts
   - The cost/benefit ratio should make sense in the context of the tool
   - Consider the narrative implications of tool usage within your journey

### Testing Content

1. **Path Testing**:
   - Test all paths in your journey to ensure they lead to endpoints
   - Verify there are no broken paths or missing scenes
   - Test different decision branches for narrative consistency

2. **Stat Balance**:
   - Check that stat changes are balanced and create appropriate challenge
   - Ensure at least one path exists where players can win 
   - Test challenging paths to ensure they're difficult but not impossible

3. **Resource Verification**:
   - Check all resource URLs to ensure they're valid and appropriate
   - Test both popup and inline display modes for your resources
   - Verify resource descriptions are helpful and relevant

4. **Toolkit Integration**:
   - Test tool unlocking to ensure it works as expected
   - Verify that scene-specific toolkit restrictions work properly
   - Check that tools have appropriate effects on game stats

---

## For Developers

### Game Architecture

The game is built with vanilla JavaScript and follows a component-based architecture:

1. **State Management**: Game state is managed through the `game_state` object
2. **Scene Rendering**: Scenes are rendered by the `render_scene()` function
3. **Choice Processing**: Choices are processed by `process_pending_choice()`
4. **Toolkit System**: Tools are managed through various toolkit functions
5. **Resource Display**: Resources can be displayed as popups or inline
6. **Theme Support**: The game supports light and dark themes

### File Structure

- **HTML**: `pages/game.html` - Main game interface
- **CSS**: `assets/css/styles.css` - All styling for the game
- **JavaScript**: 
  - `assets/js/game.js` - Core game functionality
  - `assets/js/journey_X.json` - Individual journey files
  - `assets/js/journeys/` - Directory containing additional journey files
  - `assets/js/master_journey_toolkit.json` - Defines all available tools
  - `assets/js/theme_toggle.js` - Handles theme switching
- **Images**: 
  - `assets/images/` - Images for the game

### HTML Structure

The `game.html` file contains the structure for the game interface. Key sections include:

1. **Story Selection Screen**:
```html
<section id="story-select" class="active">
  <h1>Choose Your Journey</h1>
  <p class="story-intro">Select a recovery journey to begin...</p>
  <div class="story-grid">
    <!-- Journey cards will be generated here by JavaScript -->
  </div>
</section>
```

2. **Game Play Screen**:
```html
<section id="game-play" class="hidden">
  <div class="game-content-wrapper">
    <div id="game-header">
      <h1>DETERMINED</h1>
      <!-- Game stats -->
      <div class="game-stats">...</div>
    </div>
    
    <!-- Scene content -->
    <div id="scene-box">
      <h2 id="scene-title"></h2>
      <p id="scene-narration"></p>
      <div id="choices"></div>
      <div id="feedback-container"></div>
      <button id="continue-btn" class="hidden">Continue</button>
    </div>
    
    <!-- Outcome message -->
    <div id="outcome-message" class="hidden"></div>
    <button id="restart-btn" class="hidden">Try Again</button>
    
    <!-- Developer tools -->
    <div id="dev-tools">
      <p>Route ID: <span id="route-id"></span></p>
      <p>Path: <span id="scene-path"></span></p>
    </div>
  </div>
</section>
```

3. **Popups and Overlays**:
```html
<!-- Resource popup -->
<div id="resource-popup" class="resource-popup">...</div>

<!-- Toolkit popup -->
<div id="toolkit-popup" class="resource-popup toolkit-popup">...</div>

<!-- Tool unlock popup -->
<div id="tool-unlock-popup" class="resource-popup tool-unlock-popup">...</div>

<!-- Overlay for popups -->
<div id="popup-overlay" class="popup-overlay"></div>
```

4. **Footer**:
```html
<div class="game-footer">
  <div class="game-footer-left">
    <button id="exit-game-btn" class="exit-button hidden">Exit to Journey Selection</button>
  </div>
  <div class="game-footer-center">
    <button id="toolkit-btn" class="toolkit-button hidden">Recovery Toolkit</button>
  </div>
  <div class="game-footer-icons">...</div>
</div>
```

5. **Configuration**:
```html
<main id="game-container" data-resource-display="popup" data-dev-tools="off">
  <!-- Game content -->
</main>
```

### CSS Styling

The game uses a comprehensive CSS file with several important components:

1. **Variables and Theming**:
```css
:root {
  --accent-color: #dafc4d;
  --secondary-color: #e2b1fc;
  --bg-color: #ffffff;
  --text-color: #050505;
  /* Other variables */
}

html.dark-mode,
body.dark-mode {
  --bg-color: #222222;
  --text-color: #E0E0E0;
  /* Dark theme variables */
}
```

2. **Game Container**:
```css
#game-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  /* Other properties */
}
```

3. **Story Selection**:
```css
.story-card {
  background-color: var(--bg-color);
  border: 2px solid var(--secondary-color);
  /* Other properties */
}

body.dark-mode .story-card {
  border-color: var(--accent-color);
}
```

4. **Game Interface**:
```css
#scene-box {
  display: flex;
  flex-direction: column;
  /* Other properties */
}

#choices button {
  padding: var(--spacing-sm);
  background-color: transparent;
  border: 1px solid var(--accent-color);
  /* Other properties */
}
```

5. **Toolkit System**:
```css
.toolkit-button {
  padding: 8px 15px;
  background-color: var(--secondary-color);
  color: #000000;
  /* Other properties */
}

body.dark-mode .toolkit-button {
  background-color: var(--accent-color);
  color: #000000;
}
```

6. **Resource Display**:
```css
.resource-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  /* Other properties */
}

.inline-resource {
  margin-top: 0;
  padding: var(--spacing-md);
  /* Other properties */
}
```

### JavaScript Implementation

Key JavaScript functions and components include:

1. **Game State**:
```javascript
let game_state = {
  current_scene: 'scene_001',
  resist: 100,
  use: 100,
  time: 0,
  path: [],
  // Other properties
};
```

2. **Journey Loading**:
```javascript
async function load_available_journeys() {
  // Code to load journey files
}

async function load_scene_data() {
  // Code to load scenes from selected journey
}
```

3. **Scene Rendering**:
```javascript
function render_scene(scene_data, id) {
  // Update UI elements with scene content
  // Create choice buttons
  // Update toolkit availability
}
```

4. **Choice Processing**:
```javascript
function select_choice(choice, scene_data, button_element) {
  // Handle choice selection
}

function process_pending_choice() {
  // Process stat changes
  // Move to next scene
  // Check for game endings
}
```

5. **Toolkit System**:
```javascript
function update_available_tools(scene) {
  // Update available tools based on scene configuration
}

function use_tool(tool) {
  // Apply tool effects to game stats
}

async function load_master_toolkit() {
  // Load toolkit data from JSON file
}
```

6. **Game Configuration**:
```javascript
function read_config() {
  // Read configuration from HTML attributes
}

function apply_dev_tools_visibility() {
  // Toggle developer tools based on configuration
}
```

### Customizing the Game

#### Modifying game.html

Key configuration options in game.html:

1. **Resource Display Mode**:
```html
<main id="game-container" data-resource-display="popup" data-dev-tools="off">
```
Change `data-resource-display` to "popup" or "inline" to control how resources are displayed
   
2. **Developer Tools**:
Change `data-dev-tools` to "on" or "off" to show/hide developer tools

3. **Game Content**:
Modify the game-content-wrapper div to change the layout of game elements

4. **Footer**:
Customize the game-footer div to add or remove buttons and controls

#### Modifying CSS

The main CSS file `styles.css` contains all styling. Key sections:

1. **Theme Colors**: Variables in `:root {}` section control the color scheme
2. **Dark Mode**: Override colors in `html.dark-mode, body.dark-mode {}` section
3. **Game-specific Styles**: Styles prefixed with `#game-` control game elements
4. **Story Card Styling**: `.story-card` and related classes control journey cards
5. **Resource Display**: `.resource-popup` and `.inline-resource` control resource display
6. **Toolkit Styling**: `.toolkit-button`, `.toolkit-popup`, etc. control toolkit appearance

### Adding New Features

To add new features:

1. **Modify game.js**:
   - Add new functions for the feature
   - Update existing functions to integrate with the new feature
   - Add any new state properties to the `game_state` object

2. **Update the HTML**:
   - Add required DOM elements to game.html
   - Ensure proper class names and IDs for JavaScript interaction

3. **Add CSS Styling**:
   - Add appropriate styles to styles.css
   - Consider adding new CSS variables for theming
   - Include dark mode variations where needed

4. **Example: Adding a new stat**:
   - Add the stat to `game_state`
   - Add HTML to display the stat
   - Add CSS to style the stat display
   - Add functions to modify the stat value
   - Update JSON structure in journey files to include the stat

### Toolkit System

The toolkit system allows players to use tools to manage their stats:

1. **Master Toolkit File**:
   - Located at `assets/js/master_journey_toolkit.json`
   - Defines all available tools and their properties
   - Example structure:
   ```json
   {
     "tools": {
       "meditation": {
         "title": "Mindfulness Meditation",
         "description": "Take time to center yourself and reduce anxiety.",
         "default_resist_cost": 3,
         "default_use_benefit": 10,
         "category": "mental"
       },
       "exercise": {
         "title": "Physical Exercise",
         "description": "A brief workout to release stress and clear your mind.",
         "default_resist_cost": 8,
         "default_use_benefit": 20,
         "category": "physical"
       }
     }
   }
   ```

2. **Journey-Specific Tools**:
   - Each tool ID must be unique across all journeys
   - Tools are unlocked via the `unlock_tool` property in choices
   - Tools can be restricted to specific scenes using the `toolkit` property

3. **Technical Implementation**:
   - `load_master_toolkit()` loads all tool definitions
   - `update_available_tools(scene)` determines which tools are available in the current scene
   - `use_tool(tool)` applies tool effects to game stats
   - `check_for_unlocked_tools(choice)` checks if a choice unlocks a new tool
   - `show_tool_unlock_popup(tool)` displays the tool unlock notification

4. **UI Components**:
   - Toolkit button in the footer activates the toolkit popup
   - Toolkit popup displays all available tools
   - Tool unlock popup appears when a new tool is unlocked

### Resource Display Modes

The game supports two modes for displaying resources:

1. **Popup Mode**: Resources appear in a popup dialog
   - Set with `data-resource-display="popup"` in game.html
   - Styled with `.resource-popup` CSS class
   - Implemented with `show_resource_popup(resource)` function

2. **Inline Mode**: Resources appear underneath choices
   - Set with `data-resource-display="inline"` in game.html
   - Styled with `.inline-resource` CSS class
   - Implemented with `show_inline_resource(resource)` function

The display mode is stored in `game_state.use_popup_resources` and can be toggled programmatically by changing the `data-resource-display` attribute.

### Dark/Light Theme Support

The game supports both dark and light themes:

1. **CSS Implementation**:
   - Light theme variables defined in `:root {}`
   - Dark theme variables defined in `html.dark-mode, body.dark-mode {}`
   - Component-specific dark mode overrides with `body.dark-mode` selectors

2. **Key Components with Theme Support**:
   - Story cards: Different border colors in light/dark mode
   - Buttons: Different background and text colors in light/dark mode
   - Text elements: Different text colors in light/dark mode
   - Icons: Filtered in dark mode for visibility

3. **Theme Development Considerations**:
   - Always use CSS variables for colors
   - Provide dark mode overrides for all color properties
   - Ensure sufficient contrast in both themes
   - Test both themes for readability

### Debugging

1. **Developer Tools**:
   - Enable with `data-dev-tools="on"` in game.html
   - Shows scene IDs and path history
   - Useful for tracking player movement through scenes

2. **Console Logging**:
   - Key functions log information to the console
   - Check the browser console for error messages
   - Important logs include journey loading, scene rendering, and tool usage

3. **Common Issues**:
   - **Missing Scene**: Check journey file for the correct scene ID
   - **Stat Issues**: Check for incorrect stat changes in choices
   - **Styling Issues**: Check CSS classes and HTML structure
   - **Resource Display**: Check resource display mode configuration
   - **Journey Loading**: Check journey file format and placement
   - **Toolkit Issues**: Check master toolkit file for correct tool definitions

4. **Testing Strategies**:
   - Test all paths in each journey
   - Verify that stats change correctly
   - Test both resource display modes
   - Test toolkit functionality
   - Verify toolkit unlocking through choices
   - Test both light and dark themes

---

## Quick Reference

### Journey File Template

```json
{
  "metadata": {
    "title": "Journey Title",
    "description": "Brief journey description",
    "image": "../assets/images/journey-image.jpg"
  },
  "initial_values": {
    "resist": 50,
    "use": 50,
    "unlocked_tools": ["meditation"]
  },
  "scene_001": {
    "title": "First Scene",
    "narration": "Scene narrative text",
    "toolkit": true,
    "choices": [
      {
        "label": "Choice 1",
        "resist_change": 10,
        "use_change": -5,
        "time_advance": 1,
        "next_scene_id": "scene_002",
        "resource_link": {
          "url": "https://example.com",
          "text": "Resource link",
          "description": "Resource description"
        }
      },
      {
        "label": "Choice 2",
        "resist_change": -5,
        "use_change": 10,
        "time_advance": 1,
        "next_scene_id": "scene_003",
        "unlock_tool": "exercise"
      }
    ]
  },
  "scene_002": {
    "title": "Win Scene",
    "narration": "You succeeded!",
    "choices": [],
    "end": "win"
  },
  "scene_003": {
    "title": "Relapse Scene",
    "narration": "You relapsed.",
    "choices": [],
    "end": "relapse"
  }
}
```

### Master Toolkit JSON Template

```json
{
  "tools": {
    "meditation": {
      "title": "Mindfulness Meditation",
      "description": "Take time to center yourself and reduce anxiety.",
      "default_resist_cost": 3,
      "default_use_benefit": 10,
      "category": "mental"
    },
    "exercise": {
      "title": "Physical Exercise",
      "description": "A brief workout to release stress and clear your mind.",
      "default_resist_cost": 8,
      "default_use_benefit": 20,
      "category": "physical"
    },
    "meeting": {
      "title": "Attend Support Meeting",
      "description": "Connect with your recovery community for strength.",
      "default_resist_cost": 10,
      "default_use_benefit": 25,
      "category": "social"
    },
    "call_mentor": {
      "title": "Call Your Mentor",
      "description": "Reach out to your mentor for support and guidance.",
      "default_resist_cost": 5,
      "default_use_benefit": 15,
      "category": "social"
    }
  }
}
```

This guide contains information for both writers and developers to understand and extend the Determined game. Refer to the specific sections for detailed information on each aspect of the game system. 