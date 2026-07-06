const STORE_KEY = 'patchdoc_v1';

const DEFAULT_MODULES = [
  {
    "id": 1,
    "maker": "Mutable Instruments",
    "name": "Plaits",
    "hp": 12,
    "cat": "oscillator",
    "inputs": [
      "model",
      "freq",
      "harm",
      "timbre",
      "morph",
      "trigger",
      "level"
    ],
    "outputs": [
      "out",
      "aux"
    ],
    "paramDefs": [
      {
        "name": "pitch",
        "type": "knob",
        "min": -24,
        "max": 24,
        "default": 0
      },
      {
        "name": "harm",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 50
      },
      {
        "name": "timbre",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 50
      },
      {
        "name": "morph",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 50
      },
      {
        "name": "model",
        "type": "enum",
        "options": "chord,waveshaper,FM,grain,noise,string,modal,kick",
        "default": "chord"
      },
      {
        "name": "LPG",
        "type": "toggle",
        "default": false
      }
    ]
  },
  {
    "id": 2,
    "maker": "Mutable Instruments",
    "name": "Rings",
    "hp": 14,
    "cat": "filter",
    "power12p": 70,
    "power12n": 10,
    "inputs": [
      "in",
      "strum",
      "v/oct",
      "odd",
      "even"
    ],
    "outputs": [
      "odd",
      "even"
    ]
  },
  {
    "id": 3,
    "maker": "Make Noise",
    "name": "Maths",
    "hp": 20,
    "cat": "envelope",
    "power12p": 60,
    "power12n": 20,
    "inputs": [
      "1",
      "2",
      "3",
      "4",
      "unity",
      "sum"
    ],
    "outputs": [
      "1",
      "2",
      "sum",
      "inv",
      "eoc1",
      "eoc4"
    ]
  },
  {
    "maker": "Behringer",
    "name": "Waves",
    "hp": 14,
    "cat": "other",
    "inputs": [
      {
        "name": "Slope",
        "sigType": "cv"
      },
      {
        "name": "Freq",
        "sigType": "cv"
      },
      {
        "name": "Smoothness",
        "sigType": "cv"
      },
      {
        "name": "Shape",
        "sigType": "cv"
      },
      {
        "name": "Shift/Level",
        "sigType": "cv"
      },
      {
        "name": "V/Oct",
        "sigType": "cv"
      },
      {
        "name": "Trig",
        "sigType": "gate"
      },
      {
        "name": "Clock",
        "sigType": "gate"
      }
    ],
    "outputs": [
      {
        "name": "1",
        "sigType": "cv"
      },
      {
        "name": "2",
        "sigType": "cv"
      },
      {
        "name": "3",
        "sigType": "cv"
      },
      {
        "name": "4",
        "sigType": "cv"
      }
    ],
    "id": 4,
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
    "color": "#000000",
    "paramCols": 3,
    "power12p": 0,
    "power12n": 0,
    "power5": 0
  },
  {
    "maker": "Behringer",
    "name": "Brains",
    "hp": 16,
    "cat": "other",
    "inputs": [
      {
        "name": "Model",
        "sigType": "cv"
      },
      {
        "name": "Harmonics",
        "sigType": "cv"
      },
      {
        "name": "V/Oct",
        "sigType": "cv"
      },
      {
        "name": "FM",
        "sigType": "cv"
      },
      {
        "name": "Level",
        "sigType": "cv"
      },
      {
        "name": "Morph",
        "sigType": "cv"
      },
      {
        "name": "Trig",
        "sigType": "gate"
      }
    ],
    "outputs": [
      {
        "name": "1",
        "sigType": "audio"
      },
      {
        "name": "2",
        "sigType": "audio"
      }
    ],
    "id": 5,
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
    "color": "#000000",
    "paramCols": 2,
    "power12p": 0,
    "power12n": 0,
    "power5": 0
  },
  {
    "maker": "Behringer",
    "name": "Abacus",
    "hp": 20,
    "cat": "other",
    "inputs": [
      {
        "name": "In 1",
        "sigType": "audio"
      },
      {
        "name": "Trig 1",
        "sigType": "gate"
      },
      {
        "name": "Rise 1",
        "sigType": "cv"
      },
      {
        "name": "Both 1",
        "sigType": "cv"
      },
      {
        "name": "Fall 1",
        "sigType": "cv"
      },
      {
        "name": "Cycle 1",
        "sigType": "cv"
      },
      {
        "name": "In 2",
        "sigType": "audio"
      },
      {
        "name": "In 3",
        "sigType": "audio"
      },
      {
        "name": "In 4",
        "sigType": "audio"
      },
      {
        "name": "Trig 4",
        "sigType": "gate"
      },
      {
        "name": "Rise 4",
        "sigType": "cv"
      },
      {
        "name": "Both 4",
        "sigType": "cv"
      },
      {
        "name": "Fall 4",
        "sigType": "cv"
      },
      {
        "name": "Cycle 4",
        "sigType": "cv"
      }
    ],
    "outputs": [
      {
        "name": "Out 1",
        "sigType": "audio"
      },
      {
        "name": "Out 2",
        "sigType": "audio"
      },
      {
        "name": "Out 3",
        "sigType": "audio"
      },
      {
        "name": "Out 4",
        "sigType": "audio"
      },
      {
        "name": "EOR 1",
        "sigType": "gate"
      },
      {
        "name": "Func 1",
        "sigType": "audio"
      },
      {
        "name": "OR",
        "sigType": "audio"
      },
      {
        "name": "SUM",
        "sigType": "audio"
      },
      {
        "name": "INV",
        "sigType": "audio"
      },
      {
        "name": "Func 4",
        "sigType": "audio"
      },
      {
        "name": "EOC 4",
        "sigType": "gate"
      }
    ],
    "id": 6,
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
    "color": "#000000",
    "paramCols": 4,
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
      {
        "name": "Pitch",
        "sigType": "cv"
      },
      {
        "name": "Trig",
        "sigType": "gate"
      },
      {
        "name": "Velocity",
        "sigType": "cv"
      },
      {
        "name": "X",
        "sigType": "cv"
      },
      {
        "name": "Mod",
        "sigType": "cv"
      },
      {
        "name": "Decay",
        "sigType": "cv"
      },
      {
        "name": "Y",
        "sigType": "cv"
      }
    ],
    "outputs": [
      {
        "name": "Out",
        "sigType": "audio"
      }
    ],
    "id": 7,
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
    "color": "#000000",
    "paramCols": 2,
    "power12p": 0,
    "power12n": 0,
    "power5": 0
  },
  {
    "maker": "Unknown",
    "name": "PeaksCV",
    "hp": 8,
    "cat": "other",
    "inputs": [
      "cv",
      "gate",
      "v/oct"
    ],
    "outputs": [
      "out"
    ],
    "id": 8
  },
  {
    "maker": "Unknown",
    "name": "Swords",
    "hp": 18,
    "cat": "other",
    "inputs": [
      "cv",
      "gate",
      "v/oct"
    ],
    "outputs": [
      "out"
    ],
    "id": 9
  },
  {
    "maker": "Unknown",
    "name": "Cumulus",
    "hp": 18,
    "cat": "other",
    "inputs": [
      "cv",
      "gate",
      "v/oct"
    ],
    "outputs": [
      "out"
    ],
    "id": 10
  },
  {
    "maker": "Unknown",
    "name": "SURGES",
    "hp": 8,
    "cat": "other",
    "inputs": [
      "cv",
      "gate",
      "v/oct"
    ],
    "outputs": [
      "out"
    ],
    "id": 11
  },
  {
    "maker": "Unknown",
    "name": "CHAOS",
    "hp": 18,
    "cat": "other",
    "inputs": [
      "cv",
      "gate",
      "v/oct"
    ],
    "outputs": [
      "out"
    ],
    "id": 12
  },
  {
    "maker": "Zoom",
    "name": "LiveTrak L6",
    "hp": 54,
    "cat": "other",
    "inputs": [
      "cv",
      "gate",
      "v/oct"
    ],
    "outputs": [
      "out"
    ],
    "id": 13,
    "paramDefs": [],
    "color": "#000000",
    "power12p": 0,
    "power12n": 0,
    "power5": 0
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
    "id": 14,
    "paramDefs": [
      {
        "name": "Project name",
        "type": "text",
        "default": ""
      }
    ],
    "color": "#000000",
    "power12p": 0,
    "power12n": 0,
    "power5": 0,
    "paramCols": 2
  },
  {
    "maker": "Strymon",
    "name": "Magneto",
    "hp": 28,
    "cat": "other",
    "inputs": [
      "L",
      "R",
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
      "L",
      "R",
      "Return",
      "Clock 1",
      "Clock 2",
      "Clock 3",
      "Clock 4"
    ],
    "id": 15,
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
    "color": "#000000",
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
    "id": 16,
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
    "color": "#000000",
    "power12p": 0,
    "power12n": 0,
    "power5": 0,
    "paramCols": 3
  },
  {
    "maker": "Doepfer",
    "name": "A-135-2 Quad VCA",
    "hp": 8,
    "cat": "other",
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
      "Ch 4"
    ],
    "id": 17,
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
      }
    ],
    "color": "#000000",
    "power12p": 0,
    "power12n": 0,
    "power5": 0,
    "paramCols": 2
  },
  {
    "maker": "Expert Sleepers",
    "name": "Disting mk4",
    "hp": 4,
    "cat": "other",
    "inputs": [
      "Z",
      "X",
      "Y"
    ],
    "outputs": [
      "A",
      "B"
    ],
    "id": 18,
    "paramDefs": [
      {
        "name": "Program",
        "type": "enum",
        "options": "A1, A2, A3, A4, A5, A6, A7, A8, B1, B2, B3, B4, B5, B6, B7, B8, C1, C2, C3, C4, C5, C6, C7, C8, D1, D2, D3, D4, D5, D6, D7, D8, E1, E2, E3, E4, E5, E6, E7, E8, F1, F2, F3, F4, F5, F6, F7, F8, G1, G2, G3, G4, G5, G6, G7, G8, H1, H2, H3, H4, H5, H6, H7, H8, I1, I2, I3, I4, I5, I6, I7, I8, J1, J2, J3, J4, J5, J6, J7, J8, K1, K2, K3, K4, K5, K6, K7, K8, L1, L2, L3, L4, L5, L6, L7, L8, M1, M2, M3, M4, M5, M6, M7, M8, N1, N2, N3, N4, N5, N6, N7, N8",
        "default": "A1"
      }
    ],
    "color": "#000000",
    "power12p": 0,
    "power12n": 0,
    "power5": 0
  },
  {
    "maker": "Doepfer",
    "name": "A-180-3",
    "hp": 4,
    "cat": "other",
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
    "id": 19,
    "paramDefs": [],
    "color": "#000000",
    "power12p": 0,
    "power12n": 0,
    "power5": 0
  },
  {
    "maker": "Unknown",
    "name": "uRings",
    "hp": 8,
    "cat": "other",
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
    "id": 20,
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
    "color": "#000000",
    "power12p": 0,
    "power12n": 0,
    "power5": 0,
    "paramCols": 2
  },
  {
    "maker": "Doepfer",
    "name": "A-140-2 Dual ADSR",
    "hp": 8,
    "cat": "other",
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
    "id": 21,
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
    "color": "#000000",
    "paramCols": 4,
    "power12p": 0,
    "power12n": 0,
    "power5": 0
  },
  {
    "maker": "Doepfer",
    "name": "A-160-2",
    "hp": 4,
    "cat": "other",
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
    "id": 22,
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
    "color": "#000000",
    "power12p": 0,
    "power12n": 0,
    "power5": 0,
    "paramCols": 2
  },
  {
    "maker": "Ableton",
    "name": "Move",
    "hp": 8,
    "cat": "other",
    "inputs": [],
    "outputs": [
      "Midi"
    ],
    "paramDefs": [],
    "color": "#000000",
    "power12p": 0,
    "power12n": 0,
    "power5": 0,
    "id": 23
  }
];

function defaultState() {
  return {
    version: 2,
    modules: JSON.parse(JSON.stringify(DEFAULT_MODULES)),
    nextModuleId: 24,
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
