const STORE_KEY = 'patchdoc_v1';

const DEFAULT_MODULES = [
  {
    "maker": "Behringer",
    "name": "Waves (Tides)",
    "hp": 14,
    "cat": "envelope",
    "inputs": [
      "Slope",
      "Freq",
      "Smoothness",
      "Shape",
      "Shift/Level",
      "V/Oct",
      "Trig",
      "Clock"
    ],
    "outputs": [
      "Out 1",
      "Out 2",
      "Out 3",
      "Out 4"
    ],
    "id": 6,
    "paramDefs": [
      {
        "name": "Range",
        "type": "enum",
        "options": "1/8, 2, C3",
        "default": "1/8"
      },
      {
        "name": "Ramp",
        "type": "enum",
        "options": "AD, Cycle, AR",
        "default": "AD"
      },
      {
        "name": "Output Mode",
        "type": "enum",
        "options": "Waveshapes, Crossfade, Timeshift, Ratio",
        "default": "Waveshapes"
      },
      {
        "name": "Freq",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Freq Attn",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Slope",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Slope Attn",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Smoothness",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Smooth Attn",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Shape",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Shape Attn",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Shift/Level",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Sh/Lvl Attn",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      }
    ],
    "color": "#d4963a",
    "paramCols": 3,
    "power12p": 0,
    "power12n": 0,
    "power5": 0
  },
  {
    "maker": "Behringer",
    "name": "Brains (Plaits)",
    "hp": 16,
    "cat": "oscillator",
    "inputs": [
      "Model",
      "Harmonics",
      "V/Oct",
      "FM",
      "Level",
      "Morph",
      "Trig"
    ],
    "outputs": [
      "Out 1",
      "Out 2"
    ],
    "id": 7,
    "paramDefs": [
      {
        "name": "Bank",
        "type": "enum",
        "options": "Red, Green, Yellow",
        "default": "Red"
      },
      {
        "name": "Model",
        "type": "enum",
        "options": "1,2,3,4,5,6,7,8,9,10",
        "default": "1"
      },
      {
        "name": "Timbre",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Timbre Attn",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Harmonics",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Freq",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "FM",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Morph",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Morph Attn",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      }
    ],
    "color": "#3e29ff",
    "paramCols": 2,
    "power12p": 0,
    "power12n": 0,
    "power5": 0
  },
  {
    "maker": "Behringer",
    "name": "Abacus (Maths)",
    "hp": 20,
    "cat": "utility",
    "inputs": [
      "In 1",
      "Trig 1",
      "Rise 1",
      "Both 1",
      "Fall 1",
      "Cycle 1",
      "In 2",
      "In 3",
      "In 4",
      "Trig 4",
      "Rise 4",
      "Both 4",
      "Fall 4",
      "Cycle 4"
    ],
    "outputs": [
      "Out 1",
      "Out 2",
      "Out 3",
      "Out 4",
      "EOR 1",
      "Func 1",
      "OR",
      "SUM",
      "INV",
      "Func 4",
      "EOC 4"
    ],
    "id": 8,
    "paramDefs": [
      {
        "name": "Rise 1",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Fall 1",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Freq 1",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Attn 1",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Attn 2",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Attn 3",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Attn 4",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Rise 4",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Fall 4",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Freq 4",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Cycle 1",
        "type": "toggle",
        "default": false
      },
      {
        "name": "Cycle 4",
        "type": "toggle",
        "default": false
      }
    ],
    "color": "#ff6a00",
    "paramCols": 3,
    "power12p": 0,
    "power12n": 0,
    "power5": 0
  },
  {
    "maker": "Intellijel",
    "name": "Plonk",
    "hp": 12,
    "cat": "oscillator",
    "inputs": [
      "Pitch",
      "Trig",
      "Velocity",
      "X",
      "Mod",
      "Decay",
      "Y"
    ],
    "outputs": [
      "Out"
    ],
    "id": 9,
    "paramDefs": [
      {
        "name": "Preset",
        "type": "text",
        "default": ""
      },
      {
        "name": "Pitch",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Decay",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "X",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Y",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "X Attn",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Mod Attn",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Decay Attn",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Y Attn",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      }
    ],
    "color": "#3e29ff",
    "paramCols": 2,
    "power12p": 0,
    "power12n": 0,
    "power5": 0
  },
  {
    "maker": "Tunefish",
    "name": "PeaksCV",
    "hp": 8,
    "cat": "lfo",
    "inputs": [
      "Trig 1",
      "Trig 2",
      "1",
      "2",
      "3",
      "4"
    ],
    "outputs": [
      "1",
      "2"
    ],
    "id": 10,
    "paramDefs": [
      {
        "name": "Split",
        "type": "toggle",
        "default": false
      },
      {
        "name": "Mode",
        "type": "enum",
        "options": "ENV, LFO, TAP, DRUM",
        "default": "ENV"
      },
      {
        "name": "1",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "2",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "3",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "4",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "1 Attn",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "2 Attn",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "3 Attn",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "4 Attn",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Out 1 Attn",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Out 2 Attn",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      }
    ],
    "color": "#4a9fd4",
    "paramCols": 2,
    "power12p": 0,
    "power12n": 0,
    "power5": 0
  },
  {
    "maker": "Behringer",
    "name": "Swords (Blades)",
    "hp": 18,
    "cat": "filter",
    "inputs": [
      "In 1",
      "In 2",
      "V/Oct 1",
      "V/Oct 2",
      "Drive 1",
      "Drive 2",
      "Mode 1",
      "Mode 2",
      "Freq 1",
      "Reso 1",
      "Routing",
      "Freq 2",
      "Reso 2"
    ],
    "outputs": [
      "1",
      "2",
      "Main"
    ],
    "id": 11,
    "paramDefs": [
      {
        "name": "Drive 1",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Drive 1 Waveform",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Drive 2",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Drive 2 Waveform",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Reso 1",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Reso 2",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Freq 1",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Freq 2",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Mode 1",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Mode 2",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Routing",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Freq 1 Attn",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Reso 1 Attn",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Freq 2 Attn",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Reso 2 Attn",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      }
    ],
    "color": "#2aaa7a",
    "paramCols": 2,
    "power12p": 0,
    "power12n": 0,
    "power5": 0
  },
  {
    "maker": "AfterLater",
    "name": "Cumulus (Clouds)",
    "hp": 18,
    "cat": "effects",
    "inputs": [
      "L",
      "R",
      "Freeze",
      "Trig",
      "Pos",
      "Dens",
      "Size",
      "Texture",
      "V/Oct",
      "Blend"
    ],
    "outputs": [
      "L",
      "R"
    ],
    "id": 12,
    "paramDefs": [
      {
        "name": "Freeze",
        "type": "toggle",
        "default": false
      },
      {
        "name": "Mode",
        "type": "enum",
        "options": "Clouds, Pitch / Time, Looping Delay, Spectral Madness, Mixverb",
        "default": "Clouds"
      },
      {
        "name": "Position",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "In Gain",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Density",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Texture",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Size",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Pitch",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Blend",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      }
    ],
    "color": "#7aaa2a",
    "paramCols": 2,
    "power12p": 0,
    "power12n": 0,
    "power5": 0
  },
  {
    "maker": "Behringer",
    "name": "Surges (Ripples)",
    "hp": 8,
    "cat": "filter",
    "inputs": [
      "In 1",
      "In 2",
      "Freq",
      "Reso",
      "V/Oct",
      "Level"
    ],
    "outputs": [
      "HP",
      "BP",
      "LP"
    ],
    "id": 13,
    "paramDefs": [
      {
        "name": "Freq",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Reso",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "1 Gain",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Freq Attn",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Mode",
        "type": "enum",
        "options": "4-pole, 2-pole",
        "default": "4-pole"
      }
    ],
    "color": "#2aaa7a",
    "paramCols": 2,
    "power12p": 0,
    "power12n": 0,
    "power5": 0
  },
  {
    "maker": "Behringer",
    "name": "CHAOS (Marbles)",
    "hp": 18,
    "cat": "utility",
    "inputs": [
      "Clock X",
      "Clock Y",
      "Feedback",
      "Jitter",
      "Rate",
      "Spread",
      "Steps"
    ],
    "outputs": [
      "t1",
      "t2",
      "t3",
      "x1",
      "x2",
      "x3"
    ],
    "id": 14,
    "paramDefs": [
      {
        "name": "Feedback",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      }
    ],
    "color": "#ff6a00",
    "paramCols": 3,
    "power12p": 0,
    "power12n": 0,
    "power5": 0
  },
  {
    "maker": "Zoom",
    "name": "LiveTrak L6",
    "hp": 54,
    "cat": "utility",
    "inputs": [
      "cv",
      "gate",
      "v/oct"
    ],
    "outputs": [
      "out"
    ],
    "id": 15,
    "paramDefs": [],
    "color": "#ff6a00",
    "power12p": 0,
    "power12n": 0,
    "power5": 0,
    "paramCols": 3
  },
  {
    "maker": "Squarp",
    "name": "Hermod+",
    "hp": 26,
    "cat": "sequencer",
    "inputs": [
      "CV A",
      "CV B",
      "CV C",
      "CV D",
      "Midi In"
    ],
    "outputs": [
      "Midi Out",
      "Reset",
      "Clock",
      "1 Gate",
      "1 CV",
      "1 Gate",
      "2 CV",
      "2 Gate",
      "3 CV",
      "3 Gate",
      "4 CV",
      "4 Gate",
      "5 CV",
      "5 Gate",
      "6 CV",
      "6 Gate",
      "7 CV",
      "7 Gate",
      "8 CV",
      "8 Gate"
    ],
    "id": 16,
    "paramDefs": [
      {
        "name": "Project name",
        "type": "text",
        "default": ""
      }
    ],
    "color": "#c8612a",
    "power12p": 0,
    "power12n": 0,
    "power5": 0,
    "paramCols": 2
  },
  {
    "maker": "Strymon",
    "name": "Magneto",
    "hp": 28,
    "cat": "effects",
    "inputs": [
      "In L",
      "In R",
      "Clock",
      "Rec Gate",
      "Shift",
      "Infinite",
      "Fwd/Bwd",
      "Play",
      "Pause",
      "Tap",
      "Spring",
      "Speed",
      "Wet",
      "Repeats",
      "Send"
    ],
    "outputs": [
      "Out L",
      "Out R",
      "Return",
      "Clock 1",
      "Clock 2",
      "Clock 3",
      "Clock 4"
    ],
    "id": 17,
    "paramDefs": [
      {
        "name": "Dry",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Rec Level",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Speed/Pitch",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Wet",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Repeats",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Head 1",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Head 2",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Head 3",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Head 4",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Low Cut",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Tape Age",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Crinkle",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Wow",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Spring",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Modes",
        "type": "enum",
        "options": "Echo, Loop, Sample",
        "default": "Echo"
      },
      {
        "name": "Heads",
        "type": "enum",
        "options": "Even, Triplet, Shift",
        "default": "Even"
      },
      {
        "name": "Pan",
        "type": "enum",
        "options": "LRLR, Center, LRRL",
        "default": "LRLR"
      },
      {
        "name": "Transport",
        "type": "toggle",
        "default": false
      },
      {
        "name": "Feedback 1",
        "type": "toggle",
        "default": false
      },
      {
        "name": "Feedback 2",
        "type": "toggle",
        "default": false
      },
      {
        "name": "Feedback 3",
        "type": "toggle",
        "default": false
      },
      {
        "name": "Feedback 4",
        "type": "toggle",
        "default": false
      }
    ],
    "color": "#7aaa2a",
    "power12p": 0,
    "power12n": 0,
    "power5": 0,
    "paramCols": 4
  },
  {
    "maker": "Knobula",
    "name": "Monumatic",
    "hp": 12,
    "cat": "oscillator",
    "inputs": [
      "Midi",
      "Gate",
      "V/Oct",
      "Filter",
      "CV A",
      "CV B"
    ],
    "outputs": [
      "L",
      "R"
    ],
    "id": 18,
    "paramDefs": [
      {
        "name": "Attack",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Dec/Sus",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Release",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Vol (S)",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Glide (s)",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Chord sel (s)",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Filter",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Res",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Env",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Filter Type",
        "type": "enum",
        "options": "LP24, Phase, Vowel, Low, Notch, High",
        "default": "LP24"
      },
      {
        "name": "Key Follow",
        "type": "enum",
        "options": "Off, Half, Full",
        "default": "Off"
      },
      {
        "name": "Voice Pan (S)",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Midi Ch (S)",
        "type": "knob",
        "min": 0,
        "max": 16,
        "default": 0
      },
      {
        "name": "Pitch Env (S)",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Osc Detune",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Pitch",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Mode",
        "type": "enum",
        "options": "Sync 1, Sync 2, CZ, PW",
        "default": "Sync 1"
      },
      {
        "name": "Reverb",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Temperament (S)",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Fine Tune (S)",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Reverb Time (S)",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      }
    ],
    "color": "#3e29ff",
    "power12p": 0,
    "power12n": 0,
    "power5": 0,
    "paramCols": 3
  },
  {
    "maker": "Doepfer",
    "name": "A-135-2 Quad VCA",
    "hp": 8,
    "cat": "vca",
    "inputs": [
      "Ch 1",
      "Ch 2",
      "Ch 3",
      "Ch 4",
      "CV 1",
      "CV 2",
      "CV 3",
      "CV 4"
    ],
    "outputs": [
      "Ch 1",
      "Ch 2",
      "Ch 3",
      "Ch 4",
      "Selected",
      "All"
    ],
    "id": 19,
    "paramDefs": [
      {
        "name": "CV 1",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "CV 2",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "CV 3",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "CV 4",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Level 1",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "level 2",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Level 3",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Level 4",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      }
    ],
    "color": "#c45c82",
    "power12p": 0,
    "power12n": 0,
    "power5": 0,
    "paramCols": 2
  },
  {
    "maker": "Expert Sleepers",
    "name": "Disting mk4",
    "hp": 4,
    "cat": "utility",
    "inputs": [
      "Z",
      "X",
      "Y"
    ],
    "outputs": [
      "A",
      "B"
    ],
    "id": 20,
    "paramDefs": [
      {
        "name": "Program",
        "type": "enum",
        "options": "A1, A2, A3, A4, A5, A6, A7, A8, B1, B2, B3, B4, B5, B6, B7, B8, C1, C2, C3, C4, C5, C6, C7, C8, D1, D2, D3, D4, D5, D6, D7, D8, E1, E2, E3, E4, E5, E6, E7, E8, F1, F2, F3, F4, F5, F6, F7, F8, G1, G2, G3, G4, G5, G6, G7, G8, H1, H2, H3, H4, H5, H6, H7, H8, I1, I2, I3, I4, I5, I6, I7, I8, J1, J2, J3, J4, J5, J6, J7, J8, K1, K2, K3, K4, K5, K6, K7, K8, L1, L2, L3, L4, L5, L6, L7, L8, M1, M2, M3, M4, M5, M6, M7, M8, N1, N2, N3, N4, N5, N6, N7, N8",
        "default": "A1"
      }
    ],
    "color": "#ff6a00",
    "power12p": 0,
    "power12n": 0,
    "power5": 0,
    "paramCols": 3
  },
  {
    "maker": "Doepfer",
    "name": "A-180-3 Multiple",
    "hp": 4,
    "cat": "utility",
    "inputs": [
      "1",
      "2"
    ],
    "outputs": [
      "1-1",
      "1-2",
      "1-3",
      "2-1",
      "2-2",
      "2-3"
    ],
    "id": 21,
    "paramDefs": [],
    "color": "#ff6a00",
    "power12p": 0,
    "power12n": 0,
    "power5": 0,
    "paramCols": 3
  },
  {
    "maker": "AfterLater Audio",
    "name": "uRings",
    "hp": 8,
    "cat": "oscillator",
    "inputs": [
      "Position",
      "Brite",
      "Shape",
      "Damp",
      "FM",
      "V/Oct",
      "Strum",
      "Audio"
    ],
    "outputs": [
      "Odd",
      "Even"
    ],
    "id": 22,
    "paramDefs": [
      {
        "name": "Poly",
        "type": "enum",
        "options": "Green, Yellow, Red",
        "default": "Green"
      },
      {
        "name": "Mode",
        "type": "enum",
        "options": "Green, Yellow, Red",
        "default": "Green"
      },
      {
        "name": "Attn Freq",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Freq",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Attn Shape",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Shape",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Attn Brite",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Brite",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Attn Damp",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Damp",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Attn Pos",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Pos",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      }
    ],
    "color": "#3e29ff",
    "power12p": 0,
    "power12n": 0,
    "power5": 0,
    "paramCols": 2
  },
  {
    "maker": "Doepfer",
    "name": "A-140-2 Dual ADSR",
    "hp": 8,
    "cat": "envelope",
    "inputs": [
      "Ch 1 Gate",
      "Ch 1 Retr",
      "Ch 1 CV",
      "Ch 2 Gate",
      "Ch 2 Retr",
      "Ch 2 CV"
    ],
    "outputs": [
      "Ch 1-1",
      "Ch 1-2",
      "Ch 2-1",
      "Ch 2-2"
    ],
    "id": 23,
    "paramDefs": [
      {
        "name": "Ch 1 A",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Ch 1 D",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Ch 1 S",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Ch 1 R",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Ch 2 A",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Ch 2 D",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Ch 2 S",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Ch 2 R",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      }
    ],
    "color": "#d4963a",
    "paramCols": 4,
    "power12p": 0,
    "power12n": 0,
    "power5": 0
  },
  {
    "maker": "Doepfer",
    "name": "A-160-2 Divider",
    "hp": 4,
    "cat": "utility",
    "inputs": [
      "Clock",
      "Reset"
    ],
    "outputs": [
      "2/2/2",
      "4/3/3",
      "8/5/4",
      "16/7/5",
      "32/11/6",
      "64/13/7",
      "128/17/8"
    ],
    "id": 24,
    "paramDefs": [
      {
        "name": "Mode",
        "type": "enum",
        "options": "Gate, Trigger",
        "default": "Gate"
      },
      {
        "name": "Out",
        "type": "enum",
        "options": "2^, Prime, Int",
        "default": "2^"
      }
    ],
    "color": "#ff6a00",
    "power12p": 0,
    "power12n": 0,
    "power5": 0,
    "paramCols": 2
  },
  {
    "maker": "Ableton",
    "name": "Move",
    "hp": 8,
    "cat": "sequencer",
    "inputs": [],
    "outputs": [
      "Midi  1",
      "Midi  2",
      "Midi  3",
      "Midi  4"
    ],
    "paramDefs": [
      {
        "name": "Set",
        "type": "text",
        "default": ""
      }
    ],
    "color": "#c8612a",
    "power12p": 0,
    "power12n": 0,
    "power5": 0,
    "id": 26,
    "paramCols": 2
  },
  {
    "maker": "vpme",
    "name": "Zeroscope",
    "hp": 8,
    "cat": "utility",
    "inputs": [
      "v/oct",
      "cv",
      "gate"
    ],
    "outputs": [
      "out",
      "aux"
    ],
    "paramDefs": [],
    "color": "#ff6a00",
    "paramCols": 3,
    "power12p": 0,
    "power12n": 0,
    "power5": 0,
    "id": 27
  },
  {
    "maker": "Endorphin.es",
    "name": "Ghost",
    "hp": 16,
    "cat": "effects",
    "inputs": [
      "1",
      "2",
      "distortion",
      "vcf",
      "pre vca",
      "post vca",
      "trig in",
      "resonance",
      "delay dry/wet",
      "time / v/oct",
      "repeats",
      "reverb dry/wet",
      "tail",
      "clock",
      "freeze"
    ],
    "outputs": [
      "1",
      "2",
      "Envelope"
    ],
    "paramDefs": [
      {
        "name": "Tone",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Gain (S)",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Volume",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Drive (s)",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Compressor",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Distortion",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Sidechain",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Env depth (S)",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Cutoff",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Frequency",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Resonance",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Reverb",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Repeats",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Tone (S)",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Time/Div",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Tail",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Predelay (S)",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Freeze",
        "type": "toggle",
        "default": false
      },
      {
        "name": "Bandbass",
        "type": "toggle",
        "default": false
      },
      {
        "name": "Comb (S)",
        "type": "toggle",
        "default": false
      }
    ],
    "color": "#7aaa2a",
    "paramCols": 4,
    "power12p": 0,
    "power12n": 0,
    "power5": 0,
    "id": 28
  },
  {
    "maker": "vpme",
    "name": "ZeroScope",
    "hp": 6,
    "cat": "utility",
    "inputs": [
      "In 1",
      "In 2",
      "In T"
    ],
    "outputs": [
      "Out 1",
      "Out 2",
      "Out T"
    ],
    "paramDefs": [],
    "color": "#ff6a00",
    "paramCols": 2,
    "power12p": 0,
    "power12n": 0,
    "power5": 0,
    "id": 29
  },
  {
    "maker": "Unknown",
    "name": "Kick",
    "hp": 8,
    "cat": "placeholder",
    "inputs": [],
    "outputs": [
      "out"
    ],
    "paramDefs": [],
    "color": "#bfbfbf",
    "paramCols": 2,
    "power12p": 0,
    "power12n": 0,
    "power5": 0,
    "id": 30
  },
  {
    "maker": "Unknown",
    "name": "Melody",
    "hp": 8,
    "cat": "placeholder",
    "inputs": [],
    "outputs": [
      "out"
    ],
    "paramDefs": [],
    "color": "#bfbfbf",
    "paramCols": 2,
    "power12p": 0,
    "power12n": 0,
    "power5": 0,
    "id": 31
  },
  {
    "maker": "Unknown",
    "name": "Clock Multiplier",
    "hp": 8,
    "cat": "placeholder",
    "inputs": [
      "gate"
    ],
    "outputs": [
      "x2",
      "x4"
    ],
    "paramDefs": [],
    "color": "#bfbfbf",
    "paramCols": 3,
    "power12p": 0,
    "power12n": 0,
    "power5": 0,
    "id": 32
  },
  {
    "maker": "Unknown",
    "name": "OSC",
    "hp": 8,
    "cat": "placeholder",
    "inputs": [],
    "outputs": [
      "out"
    ],
    "paramDefs": [],
    "color": "#bfbfbf",
    "paramCols": 2,
    "power12p": 0,
    "power12n": 0,
    "power5": 0,
    "id": 33
  },
  {
    "maker": "Unknown",
    "name": "AUDIO",
    "hp": 8,
    "cat": "placeholder",
    "inputs": [
      "1",
      "2"
    ],
    "outputs": [
      "1",
      "2"
    ],
    "paramDefs": [],
    "color": "#bfbfbf",
    "paramCols": 2,
    "power12p": 0,
    "power12n": 0,
    "power5": 0,
    "id": 34
  },
  {
    "maker": "Unknown",
    "name": "OUT",
    "hp": 8,
    "cat": "placeholder",
    "inputs": [
      "output"
    ],
    "outputs": [],
    "paramDefs": [],
    "color": "#bfbfbf",
    "paramCols": 2,
    "power12p": 0,
    "power12n": 0,
    "power5": 0,
    "id": 35
  },
  {
    "maker": "Unknown",
    "name": "IN",
    "hp": 8,
    "cat": "placeholder",
    "inputs": [],
    "outputs": [
      "out"
    ],
    "paramDefs": [],
    "color": "#bfbfbf",
    "paramCols": 2,
    "power12p": 0,
    "power12n": 0,
    "power5": 0,
    "id": 36
  },
  {
    "maker": "Unknown",
    "name": "TRIGGER",
    "hp": 8,
    "cat": "placeholder",
    "inputs": [],
    "outputs": [
      "1"
    ],
    "paramDefs": [],
    "color": "#bfbfbf",
    "paramCols": 2,
    "power12p": 0,
    "power12n": 0,
    "power5": 0,
    "id": 37
  },
  {
    "maker": "Behringer",
    "name": "960 Sequential Controller",
    "hp": 56,
    "cat": "sequencer",
    "inputs": [
      "OSC ON",
      "OSC OFF",
      "Step 1 In",
      "Step 2 In",
      "Step 3 In",
      "Step 4 In",
      "Step 5 In",
      "Step 6 In",
      "Step 7 In",
      "Step 8 In"
    ],
    "outputs": [
      "Step 1 Out",
      "Step 2 Out",
      "Step 3 Out",
      "Step 4 Out",
      "Step 5 Out",
      "Step 6 Out",
      "Step 7 Out",
      "Step 8 Out"
    ],
    "paramDefs": [
      {
        "name": "Step 1",
        "type": "enum",
        "options": "Normal, Skip, Stop",
        "default": "Normal"
      },
      {
        "name": "Step 2",
        "type": "enum",
        "options": "Normal, Skip, Stop",
        "default": "Normal"
      },
      {
        "name": "Step 3",
        "type": "enum",
        "options": "Normal, Skip, Stop",
        "default": "Normal"
      },
      {
        "name": "Step 4",
        "type": "enum",
        "options": "Normal, Skip, Stop",
        "default": "Normal"
      },
      {
        "name": "Step 5",
        "type": "enum",
        "options": "Normal, Skip, Stop",
        "default": "Normal"
      },
      {
        "name": "Step 6",
        "type": "enum",
        "options": "Normal, Skip, Stop",
        "default": "Normal"
      },
      {
        "name": "Step 7",
        "type": "enum",
        "options": "Normal, Skip, Stop",
        "default": "Normal"
      },
      {
        "name": "Step 8",
        "type": "enum",
        "options": "Normal, Skip, Stop",
        "default": "Normal"
      },
      {
        "name": "All",
        "type": "enum",
        "options": "Skip, Stop",
        "default": "Skip"
      },
      {
        "name": "Range 1",
        "type": "enum",
        "options": "X1, X2, X4",
        "default": "X1"
      },
      {
        "name": "Range 2",
        "type": "enum",
        "options": "X1, X2, X4",
        "default": "X1"
      },
      {
        "name": "Range 3",
        "type": "enum",
        "options": "X1, X2, X3",
        "default": "X1"
      },
      {
        "name": "Fr Range",
        "type": "knob",
        "min": 1,
        "max": 6,
        "default": 1
      },
      {
        "name": "Fr Vernier",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "type": "divider",
        "name": ""
      },
      {
        "name": "1-A",
        "type": "knob",
        "min": 0,
        "max": 20,
        "default": 0
      },
      {
        "name": "2-A",
        "type": "knob",
        "min": 0,
        "max": 20,
        "default": 0
      },
      {
        "name": "3-A",
        "type": "knob",
        "min": 0,
        "max": 20,
        "default": 0
      },
      {
        "name": "4-A",
        "type": "knob",
        "min": 0,
        "max": 20,
        "default": 0
      },
      {
        "name": "5-A",
        "type": "knob",
        "min": 0,
        "max": 20,
        "default": 0
      },
      {
        "name": "6-A",
        "type": "knob",
        "min": 0,
        "max": 20,
        "default": 0
      },
      {
        "name": "7-A",
        "type": "knob",
        "min": 0,
        "max": 20,
        "default": 0
      },
      {
        "name": "8-A",
        "type": "knob",
        "min": 0,
        "max": 20,
        "default": 0
      },
      {
        "name": "1-B",
        "type": "knob",
        "min": 0,
        "max": 20,
        "default": 0
      },
      {
        "name": "2-B",
        "type": "knob",
        "min": 0,
        "max": 20,
        "default": 0
      },
      {
        "name": "3-B",
        "type": "knob",
        "min": 0,
        "max": 20,
        "default": 0
      },
      {
        "name": "4-B",
        "type": "knob",
        "min": 0,
        "max": 20,
        "default": 0
      },
      {
        "name": "5-B",
        "type": "knob",
        "min": 0,
        "max": 20,
        "default": 0
      },
      {
        "name": "6-B",
        "type": "knob",
        "min": 0,
        "max": 20,
        "default": 0
      },
      {
        "name": "7-B",
        "type": "knob",
        "min": 0,
        "max": 20,
        "default": 0
      },
      {
        "name": "8-B",
        "type": "knob",
        "min": 0,
        "max": 20,
        "default": 0
      },
      {
        "name": "1-C",
        "type": "knob",
        "min": 0,
        "max": 20,
        "default": 0
      },
      {
        "name": "2-C",
        "type": "knob",
        "min": 0,
        "max": 20,
        "default": 0
      },
      {
        "name": "3-C",
        "type": "knob",
        "min": 0,
        "max": 20,
        "default": 0
      },
      {
        "name": "4-C",
        "type": "knob",
        "min": 0,
        "max": 20,
        "default": 0
      },
      {
        "name": "5-C",
        "type": "knob",
        "min": 0,
        "max": 20,
        "default": 0
      },
      {
        "name": "6-C",
        "type": "knob",
        "min": 0,
        "max": 20,
        "default": 0
      },
      {
        "name": "7-C",
        "type": "knob",
        "min": 0,
        "max": 20,
        "default": 0
      },
      {
        "name": "8-C",
        "type": "knob",
        "min": 0,
        "max": 20,
        "default": 0
      },
      {
        "name": "3rdRowTime",
        "type": "toggle",
        "default": false
      }
    ],
    "color": "#c8612a",
    "paramCols": 8,
    "power12p": 0,
    "power12n": 0,
    "power5": 0,
    "id": 38
  },
  {
    "maker": "Behringer",
    "name": "962 Sequential Switch",
    "hp": 8,
    "cat": "utility",
    "inputs": [
      "Trig 1",
      "Trig 2",
      "Trig 3",
      "Shift",
      "Sig In 1",
      "Sig In 2",
      "Sig In 3"
    ],
    "outputs": [
      "out 1",
      "out 2"
    ],
    "paramDefs": [],
    "color": "#ff6a00",
    "paramCols": 3,
    "power12p": 0,
    "power12n": 0,
    "power5": 0,
    "id": 39
  },
  {
    "maker": "Behringer",
    "name": "Brassmaster Fuzz",
    "hp": 8,
    "cat": "guitar pedal",
    "inputs": [
      "In"
    ],
    "outputs": [
      "Out"
    ],
    "paramDefs": [
      {
        "name": "Brass Vol.",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Sens.",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Ball Vol.",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Brass",
        "type": "toggle",
        "default": false
      },
      {
        "name": "Harmonic",
        "type": "toggle",
        "default": false
      }
    ],
    "color": null,
    "paramCols": 3,
    "power12p": 0,
    "power12n": 0,
    "power5": 0,
    "id": 40
  },
  {
    "maker": "Tunefish Modular",
    "name": "Warps",
    "hp": 10,
    "cat": "effects",
    "inputs": [
      "Level 1",
      "Level 2",
      "Algo",
      "Timbre",
      "In 1",
      "In 2"
    ],
    "outputs": [
      "Out 1 & 2",
      "Aux"
    ],
    "paramDefs": [
      {
        "name": "Algorithm",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Timbre",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Int OSC",
        "type": "toggle",
        "default": false
      },
      {
        "name": "Level 1",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Level 2",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      }
    ],
    "color": null,
    "paramCols": 2,
    "power12p": 0,
    "power12n": 0,
    "power5": 0,
    "id": 41
  }
];

function defaultState() {
  return {
    version: 2,
    modules: JSON.parse(JSON.stringify(DEFAULT_MODULES)),
    nextModuleId: 42,
    patches: [
      {
        id: 'patch_1',
        title: 'Generative Drone #1',
        notes: 'Plaits in chord mode → Rings → Maths envelope on VCA.\nQuadrax LFO modulating Rings decay.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        patchModules: [],
        cables: [],
        params: {},
        cableColorIdx: 0,
        tags: [],
        photo: null
      }
    ],
    activePatchId: 'patch_1',
    nextPatchNum: 2
  };
}

const Store = {
  _state: null,

  // Load state — server mode or localStorage (static/PWA mode)
  async loadFromServer() {
    if (window.PATCHDOC_STATIC) {
      try {
        const raw = localStorage.getItem('patchdoc_v1');
        this._state = raw ? JSON.parse(raw) : defaultState();
      } catch(e) { this._state = defaultState(); }
      return this._state;
    }
    try {
      const noCache = { cache: 'no-store' };

      // Load user patches — this is critical, must succeed
      const stateRes = await fetch('/api/state', noCache);
      if (!stateRes.ok) throw new Error('state HTTP ' + stateRes.status);
      const stateData = await stateRes.json();

      if (stateData && Array.isArray(stateData.patches) && stateData.patches.length > 0) {
        this._state = stateData;
      } else if (stateData === null) {
        // First run — no state yet on server
        this._state = defaultState();
        this._isFirstRun = true;
      } else {
        // Unexpected — keep defaults but don't overwrite server
        console.warn('Unexpected state response');
        if (!this._state) this._state = defaultState();
      }

      // Mark patches as loaded — saveImmediate may now beacon
      this._loadedFromServer = true;

      // Load user settings (category colors etc.) — non-fatal
      try {
        const settingsRes = await fetch('/api/settings', noCache);
        if (settingsRes.ok) {
          const settings = await settingsRes.json();
          this._settings = settings;
          // Apply category colors to global CAT_COLORS
          if (settings.catColors && typeof CAT_COLORS !== 'undefined') {
            Object.assign(CAT_COLORS, settings.catColors);
          }
        }
      } catch(e) { console.warn('Could not load settings:', e); }

      // Load shared modules separately — failure here is non-fatal
      try {
        const modulesRes = await fetch('/api/modules', noCache);
        if (modulesRes.ok) {
          const modulesData = await modulesRes.json();
          if (modulesData && Array.isArray(modulesData.modules)) {
            this._state.modules      = modulesData.modules;
            this._state.nextModuleId = modulesData.nextModuleId || 24;
          }
        }
      } catch(e) {
        console.warn('Could not load modules, using defaults:', e);
      }

      // Fetch username and admin status for display in topbar — non-fatal
      try {
        const meRes = await fetch('/api/me', noCache);
        if (meRes.ok) {
          const me = await meRes.json();
          this._username = me.username;
          this._isAdmin  = me.isAdmin;
        }
      } catch(e) {}

    } catch(e) {
      console.warn('Could not load state from server:', e);
      this._loadFailed = true;
      if (!this._state) this._state = defaultState();
    }
    return this._state;
  },

  get username() { return this._username || ''; },
  get isAdmin()  { return !!this._isAdmin; },

  load() {
    if (!this._state) this._state = defaultState();
    return this._state;
  },

  // Debounced save — 600ms after last call
  save() {
    if (window.PATCHDOC_STATIC) {
      try { localStorage.setItem('patchdoc_v1', JSON.stringify(this._state)); } catch(e) {}
      this._showSaveIndicator(true);
      return;
    }
    clearTimeout(this._saveTimer);
    this._saveTimer = setTimeout(() => this._saveToServer(), 600);
  },

  // Immediate save — bypass debounce for critical moments
  saveNow() {
    if (window.PATCHDOC_STATIC) { this.save(); return; }
    clearTimeout(this._saveTimer);
    // Cancel any pending debounced save — we're saving immediately
    if (this._saveAbort) { this._saveAbort.abort(); this._saveAbort = null; }
    this._saveToServer(false); // false = no abort, must complete
  },

  _saveAbort: null,

  async _saveToServer(useAbort = true) {
    if (this._loadFailed) {
      console.warn('Skipping save: initial load failed');
      this._showSaveIndicator(false);
      return;
    }
    // Only use abort for debounced saves — saveNow() must always complete
    if (useAbort) {
      if (this._saveAbort) this._saveAbort.abort();
      this._saveAbort = new AbortController();
    }
    const signal = useAbort ? this._saveAbort.signal : undefined;
    try {
      // Save user patches (without modules — those are shared)
      const userState = {
        version:       this._state.version,
        patches:       this._state.patches,
        activePatchId: this._state.activePatchId,
        nextPatchNum:  this._state.nextPatchNum,
      };
      const res = await fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userState),
        signal,
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      this._loadFailed = false;
      this._loadedFromServer = true;
      this._showSaveIndicator(true);
    } catch(e) {
      if (e.name === 'AbortError') return;
      console.error('Could not save to server:', e);
      this._showSaveIndicator(false);
    }
  },

  // Save shared modules — called after add/edit/delete module
  async _saveModules() {
    if (window.PATCHDOC_STATIC) return;
    try {
      await fetch('/api/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modules:      this._state.modules,
          nextModuleId: this._state.nextModuleId,
        }),
      });
    } catch(e) { console.error('Could not save modules:', e); }
  },

  // Synchronous save via sendBeacon — works during page unload.
  // Only sends user patches (modules are shared and saved separately).
  saveImmediate() {
    if (window.PATCHDOC_STATIC) { this.save(); return; }
    // Never beacon if the initial load failed — would overwrite real data with stale state
    if (this._loadFailed) return;
    // Never beacon if state was never successfully loaded from server
    if (!this._loadedFromServer) return;
    clearTimeout(this._saveTimer);
    const userState = {
      version:       this._state.version,
      patches:       this._state.patches,
      activePatchId: this._state.activePatchId,
      nextPatchNum:  this._state.nextPatchNum,
    };
    const blob = new Blob([JSON.stringify(userState)], { type: 'application/json' });
    navigator.sendBeacon('/api/state-beacon', blob);
  },

  _showSaveIndicator(success) {
    ['save-indicator', 'save-indicator-desktop'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.textContent = success ? '✓' : '✗';
      el.style.color  = success ? 'var(--success)' : 'var(--danger)';
      clearTimeout(el._t);
      el._t = setTimeout(() => { el.textContent = ''; }, 2000);
    });
  },

  get state() { return this._state; },

  getActivePatch() {
    return this._state.patches.find(p => p.id === this._state.activePatchId) || this._state.patches[0];
  },

  setActivePatch(id) {
    this._state.activePatchId = id;
    this.saveNow();
  },

  newPatch(title) {
    const id = 'patch_' + Date.now();
    const patch = {
      id,
      title: title || 'New Patch #' + this._state.nextPatchNum++,
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      patchModules: [],
      cables: [],
      params: {},
      cableColorIdx: 0,
      tags: [],
      photo: null
    };
    this._state.patches.push(patch);
    this._state.activePatchId = id;
    this.saveNow();
    return patch;
  },

  deletePatch(id) {
    if (this._state.patches.length <= 1) return false;
    this._state.patches = this._state.patches.filter(p => p.id !== id);
    if (this._state.activePatchId === id) {
      this._state.activePatchId = this._state.patches[0].id;
    }
    this.saveNow();
    return true;
  },

  duplicatePatch(id) {
    const src = this._state.patches.find(p => p.id === id);
    if (!src) return null;
    const copy = JSON.parse(JSON.stringify(src));
    copy.id = 'patch_' + Date.now();
    copy.title = src.title + ' (copy)';
    copy.createdAt = new Date().toISOString();
    copy.updatedAt = new Date().toISOString();
    this._state.patches.push(copy);
    this._state.activePatchId = copy.id;
    this.saveNow();
    return copy;
  },

  updatePatch(id, changes) {
    const p = this._state.patches.find(x => x.id === id);
    if (p) {
      Object.assign(p, changes);
      p.updatedAt = new Date().toISOString();
      this.save();
    }
  },

  // Silent update — saves to server but does not trigger re-render loop
  updatePatchSilent(id, changes) {
    const p = this._state.patches.find(x => x.id === id);
    if (p) {
      Object.assign(p, changes);
      p.updatedAt = new Date().toISOString();
      this._saveToServer(); // direct save, no debounce
    }
  },

  addModule(mod) {
    mod.id = this._state.nextModuleId++;
    this._state.modules.push(mod);
    this._saveModules();
    this.saveNow();
    return mod;
  },

  deleteModule(id) {
    this._state.modules = this._state.modules.filter(m => m.id !== id);
    this._state.patches.forEach(p => {
      p.patchModules = p.patchModules.filter(pm => pm.moduleId !== id);
      p.cables = p.cables.filter(c => {
        const fromPm = p.patchModules.find(pm => pm.id === c.fromPm);
        const toPm   = p.patchModules.find(pm => pm.id === c.toPm);
        return fromPm && toPm;
      });
    });
    this._saveModules();
    this.saveNow();
  },

  exportAll() {
    return JSON.stringify(this._state, null, 2);
  },

  exportPatch(id) {
    const patch = this._state.patches.find(p => p.id === id);
    const modules = this._state.modules;
    return JSON.stringify({ version: 2, type: 'single_patch', modules, patch }, null, 2);
  },

  importAll(json) {
    const data = JSON.parse(json);
    if (!data.version || !data.patches) throw new Error('Invalid format');
    this._state = data;
    this._saveModules();
    this.saveNow();
  },

  importPatch(json) {
    const data = JSON.parse(json);
    if (!data.patch) throw new Error('No patch data found');
    const patch = data.patch;
    patch.id = 'patch_' + Date.now();
    patch.title = (patch.title || 'Imported') + ' (imported)';
    patch.isTemplate = false; // never import as template
    this._state.patches.push(patch);
    if (data.modules) {
      data.modules.forEach(m => {
        if (!this._state.modules.find(x => x.name === m.name && x.maker === m.maker)) {
          m.id = this._state.nextModuleId++;
          this._state.modules.push(m);
        }
      });
    }
    this._state.activePatchId = patch.id;
    this._saveModules();
    this.save();
    return patch;
  }
};
