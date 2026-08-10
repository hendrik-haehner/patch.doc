const STORE_KEY = 'patchdoc_v1';

const DEFAULT_MODULES = [
  {
    "maker": "Behringer",
    "name": "Waves (Tides)",
    "hp": 14,
    "cat": "envelope",
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
        "name": "Out 1",
        "sigType": "cv"
      },
      {
        "name": "Out 2",
        "sigType": "cv"
      },
      {
        "name": "Out 3",
        "sigType": "cv"
      },
      {
        "name": "Out 4",
        "sigType": "cv"
      }
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
        "name": "Out 1",
        "sigType": "audio"
      },
      {
        "name": "Out 2",
        "sigType": "audio"
      }
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
      {
        "name": "Trig 1",
        "sigType": "gate"
      },
      {
        "name": "Trig 2",
        "sigType": "gate"
      },
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
      {
        "name": "In 1",
        "sigType": "audio"
      },
      {
        "name": "In 2",
        "sigType": "audio"
      },
      {
        "name": "V/Oct 1",
        "sigType": "cv"
      },
      {
        "name": "V/Oct 2",
        "sigType": "cv"
      },
      {
        "name": "Drive 1",
        "sigType": "cv"
      },
      {
        "name": "Drive 2",
        "sigType": "cv"
      },
      {
        "name": "Mode 1",
        "sigType": "cv"
      },
      {
        "name": "Mode 2",
        "sigType": "cv"
      },
      {
        "name": "Freq 1",
        "sigType": "cv"
      },
      {
        "name": "Reso 1",
        "sigType": "audio"
      },
      {
        "name": "Routing",
        "sigType": "cv"
      },
      {
        "name": "Freq 2",
        "sigType": "cv"
      },
      {
        "name": "Reso 2",
        "sigType": "cv"
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
      },
      {
        "name": "Main",
        "sigType": "audio"
      }
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
      {
        "name": "L",
        "sigType": "audio"
      },
      {
        "name": "R",
        "sigType": "audio"
      },
      {
        "name": "Freeze",
        "sigType": "cv"
      },
      {
        "name": "Trig",
        "sigType": "gate"
      },
      {
        "name": "Pos",
        "sigType": "cv"
      },
      {
        "name": "Dens",
        "sigType": "cv"
      },
      {
        "name": "Size",
        "sigType": "cv"
      },
      {
        "name": "Texture",
        "sigType": "cv"
      },
      {
        "name": "V/Oct",
        "sigType": "cv"
      },
      {
        "name": "Blend",
        "sigType": "cv"
      }
    ],
    "outputs": [
      {
        "name": "L",
        "sigType": "audio"
      },
      {
        "name": "R",
        "sigType": "audio"
      }
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
      {
        "name": "In 1",
        "sigType": "audio"
      },
      {
        "name": "In 2",
        "sigType": "audio"
      },
      {
        "name": "Freq",
        "sigType": "cv"
      },
      {
        "name": "Reso",
        "sigType": "cv"
      },
      {
        "name": "V/Oct",
        "sigType": "cv"
      },
      {
        "name": "Level",
        "sigType": "cv"
      }
    ],
    "outputs": [
      {
        "name": "HP",
        "sigType": "audio"
      },
      {
        "name": "BP",
        "sigType": "audio"
      },
      {
        "name": "LP",
        "sigType": "audio"
      }
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
      {
        "name": "Clock X",
        "sigType": "gate"
      },
      {
        "name": "Clock Y",
        "sigType": "gate"
      },
      {
        "name": "Feedback",
        "sigType": "cv"
      },
      {
        "name": "Jitter",
        "sigType": "cv"
      },
      {
        "name": "Rate",
        "sigType": "cv"
      },
      {
        "name": "Spread",
        "sigType": "cv"
      },
      {
        "name": "Steps",
        "sigType": "cv"
      }
    ],
    "outputs": [
      {
        "name": "t1",
        "sigType": "cv"
      },
      {
        "name": "t2",
        "sigType": "cv"
      },
      {
        "name": "t3",
        "sigType": "cv"
      },
      {
        "name": "x1",
        "sigType": "cv"
      },
      {
        "name": "x2",
        "sigType": "cv"
      },
      {
        "name": "x3",
        "sigType": "cv"
      }
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
      {
        "name": "cv",
        "sigType": "cv"
      },
      {
        "name": "gate",
        "sigType": "gate"
      },
      {
        "name": "v/oct",
        "sigType": "cv"
      }
    ],
    "outputs": [
      {
        "name": "out",
        "sigType": "audio"
      }
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
      {
        "name": "CV A",
        "sigType": "cv"
      },
      {
        "name": "CV B",
        "sigType": "cv"
      },
      {
        "name": "CV C",
        "sigType": "cv"
      },
      {
        "name": "CV D",
        "sigType": "cv"
      },
      {
        "name": "Midi In",
        "sigType": "audio"
      }
    ],
    "outputs": [
      {
        "name": "Midi Out",
        "sigType": "audio"
      },
      {
        "name": "Reset",
        "sigType": "audio"
      },
      {
        "name": "Clock",
        "sigType": "gate"
      },
      {
        "name": "1 Gate",
        "sigType": "gate"
      },
      {
        "name": "1 CV",
        "sigType": "cv"
      },
      {
        "name": "1 Gate",
        "sigType": "gate"
      },
      {
        "name": "2 CV",
        "sigType": "cv"
      },
      {
        "name": "2 Gate",
        "sigType": "gate"
      },
      {
        "name": "3 CV",
        "sigType": "cv"
      },
      {
        "name": "3 Gate",
        "sigType": "gate"
      },
      {
        "name": "4 CV",
        "sigType": "cv"
      },
      {
        "name": "4 Gate",
        "sigType": "gate"
      },
      {
        "name": "5 CV",
        "sigType": "cv"
      },
      {
        "name": "5 Gate",
        "sigType": "gate"
      },
      {
        "name": "6 CV",
        "sigType": "cv"
      },
      {
        "name": "6 Gate",
        "sigType": "gate"
      },
      {
        "name": "7 CV",
        "sigType": "cv"
      },
      {
        "name": "7 Gate",
        "sigType": "gate"
      },
      {
        "name": "8 CV",
        "sigType": "cv"
      },
      {
        "name": "8 Gate",
        "sigType": "gate"
      }
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
      {
        "name": "In L",
        "sigType": "audio"
      },
      {
        "name": "In R",
        "sigType": "audio"
      },
      {
        "name": "Clock",
        "sigType": "gate"
      },
      {
        "name": "Rec Gate",
        "sigType": "gate"
      },
      {
        "name": "Shift",
        "sigType": "audio"
      },
      {
        "name": "Infinite",
        "sigType": "audio"
      },
      {
        "name": "Fwd/Bwd",
        "sigType": "audio"
      },
      {
        "name": "Play",
        "sigType": "audio"
      },
      {
        "name": "Pause",
        "sigType": "audio"
      },
      {
        "name": "Tap",
        "sigType": "audio"
      },
      {
        "name": "Spring",
        "sigType": "audio"
      },
      {
        "name": "Speed",
        "sigType": "audio"
      },
      {
        "name": "Wet",
        "sigType": "audio"
      },
      {
        "name": "Repeats",
        "sigType": "audio"
      },
      {
        "name": "Send",
        "sigType": "audio"
      }
    ],
    "outputs": [
      {
        "name": "Out L",
        "sigType": "audio"
      },
      {
        "name": "Out R",
        "sigType": "audio"
      },
      {
        "name": "Return",
        "sigType": "audio"
      },
      {
        "name": "Clock 1",
        "sigType": "gate"
      },
      {
        "name": "Clock 2",
        "sigType": "gate"
      },
      {
        "name": "Clock 3",
        "sigType": "gate"
      },
      {
        "name": "Clock 4",
        "sigType": "gate"
      }
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
      {
        "name": "Midi",
        "sigType": "audio"
      },
      {
        "name": "Gate",
        "sigType": "gate"
      },
      {
        "name": "V/Oct",
        "sigType": "cv"
      },
      {
        "name": "Filter",
        "sigType": "audio"
      },
      {
        "name": "CV A",
        "sigType": "cv"
      },
      {
        "name": "CV B",
        "sigType": "cv"
      }
    ],
    "outputs": [
      {
        "name": "L",
        "sigType": "audio"
      },
      {
        "name": "R",
        "sigType": "audio"
      }
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
      {
        "name": "Ch 1",
        "sigType": "audio"
      },
      {
        "name": "Ch 2",
        "sigType": "audio"
      },
      {
        "name": "Ch 3",
        "sigType": "audio"
      },
      {
        "name": "Ch 4",
        "sigType": "audio"
      },
      {
        "name": "CV 1",
        "sigType": "cv"
      },
      {
        "name": "CV 2",
        "sigType": "cv"
      },
      {
        "name": "CV 3",
        "sigType": "cv"
      },
      {
        "name": "CV 4",
        "sigType": "cv"
      }
    ],
    "outputs": [
      {
        "name": "Ch 1",
        "sigType": "audio"
      },
      {
        "name": "Ch 2",
        "sigType": "audio"
      },
      {
        "name": "Ch 3",
        "sigType": "audio"
      },
      {
        "name": "Ch 4",
        "sigType": "audio"
      },
      {
        "name": "Selected",
        "sigType": "audio"
      },
      {
        "name": "All",
        "sigType": "audio"
      }
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
      {
        "name": "Z",
        "sigType": "audio"
      },
      {
        "name": "X",
        "sigType": "audio"
      },
      {
        "name": "Y",
        "sigType": "audio"
      }
    ],
    "outputs": [
      {
        "name": "A",
        "sigType": "audio"
      },
      {
        "name": "B",
        "sigType": "audio"
      }
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
      {
        "name": "1",
        "sigType": "audio"
      },
      {
        "name": "2",
        "sigType": "audio"
      }
    ],
    "outputs": [
      {
        "name": "1-1",
        "sigType": "audio"
      },
      {
        "name": "1-2",
        "sigType": "audio"
      },
      {
        "name": "1-3",
        "sigType": "audio"
      },
      {
        "name": "2-1",
        "sigType": "audio"
      },
      {
        "name": "2-2",
        "sigType": "audio"
      },
      {
        "name": "2-3",
        "sigType": "audio"
      }
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
      {
        "name": "Position",
        "sigType": "audio"
      },
      {
        "name": "Brite",
        "sigType": "audio"
      },
      {
        "name": "Shape",
        "sigType": "audio"
      },
      {
        "name": "Damp",
        "sigType": "cv"
      },
      {
        "name": "FM",
        "sigType": "cv"
      },
      {
        "name": "V/Oct",
        "sigType": "cv"
      },
      {
        "name": "Strum",
        "sigType": "audio"
      },
      {
        "name": "Audio",
        "sigType": "audio"
      }
    ],
    "outputs": [
      {
        "name": "Odd",
        "sigType": "audio"
      },
      {
        "name": "Even",
        "sigType": "audio"
      }
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
      {
        "name": "Ch 1 Gate",
        "sigType": "gate"
      },
      {
        "name": "Ch 1 Retr",
        "sigType": "gate"
      },
      {
        "name": "Ch 1 CV",
        "sigType": "cv"
      },
      {
        "name": "Ch 2 Gate",
        "sigType": "gate"
      },
      {
        "name": "Ch 2 Retr",
        "sigType": "gate"
      },
      {
        "name": "Ch 2 CV",
        "sigType": "cv"
      }
    ],
    "outputs": [
      {
        "name": "Ch 1-1",
        "sigType": "audio"
      },
      {
        "name": "Ch 1-2",
        "sigType": "audio"
      },
      {
        "name": "Ch 2-1",
        "sigType": "audio"
      },
      {
        "name": "Ch 2-2",
        "sigType": "audio"
      }
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
      {
        "name": "Clock",
        "sigType": "gate"
      },
      {
        "name": "Reset",
        "sigType": "audio"
      }
    ],
    "outputs": [
      {
        "name": "2/2/2",
        "sigType": "audio"
      },
      {
        "name": "4/3/3",
        "sigType": "audio"
      },
      {
        "name": "8/5/4",
        "sigType": "audio"
      },
      {
        "name": "16/7/5",
        "sigType": "audio"
      },
      {
        "name": "32/11/6",
        "sigType": "audio"
      },
      {
        "name": "64/13/7",
        "sigType": "audio"
      },
      {
        "name": "128/17/8",
        "sigType": "audio"
      }
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
      {
        "name": "Midi  1",
        "sigType": "audio"
      },
      {
        "name": "Midi  2",
        "sigType": "audio"
      },
      {
        "name": "Midi  3",
        "sigType": "audio"
      },
      {
        "name": "Midi  4",
        "sigType": "audio"
      }
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
      {
        "name": "v/oct",
        "sigType": "cv"
      },
      {
        "name": "cv",
        "sigType": "cv"
      },
      {
        "name": "gate",
        "sigType": "gate"
      }
    ],
    "outputs": [
      {
        "name": "out",
        "sigType": "audio"
      },
      {
        "name": "aux",
        "sigType": "audio"
      }
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
      {
        "name": "1",
        "sigType": "audio"
      },
      {
        "name": "2",
        "sigType": "audio"
      },
      {
        "name": "distortion",
        "sigType": "cv"
      },
      {
        "name": "vcf",
        "sigType": "cv"
      },
      {
        "name": "pre vca",
        "sigType": "cv"
      },
      {
        "name": "post vca",
        "sigType": "cv"
      },
      {
        "name": "trig in",
        "sigType": "gate"
      },
      {
        "name": "resonance",
        "sigType": "cv"
      },
      {
        "name": "delay dry/wet",
        "sigType": "cv"
      },
      {
        "name": "time / v/oct",
        "sigType": "cv"
      },
      {
        "name": "repeats",
        "sigType": "cv"
      },
      {
        "name": "reverb dry/wet",
        "sigType": "cv"
      },
      {
        "name": "tail",
        "sigType": "cv"
      },
      {
        "name": "clock",
        "sigType": "gate"
      },
      {
        "name": "freeze",
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
      },
      {
        "name": "Envelope",
        "sigType": "cv"
      }
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
      {
        "name": "In 1",
        "sigType": "cv"
      },
      {
        "name": "In 2",
        "sigType": "cv"
      },
      {
        "name": "In T",
        "sigType": "gate"
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
        "name": "Out T",
        "sigType": "audio"
      }
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
      {
        "name": "out",
        "sigType": "audio"
      }
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
      {
        "name": "out",
        "sigType": "audio"
      }
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
      {
        "name": "gate",
        "sigType": "gate"
      }
    ],
    "outputs": [
      {
        "name": "x2",
        "sigType": "gate"
      },
      {
        "name": "x4",
        "sigType": "gate"
      }
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
      {
        "name": "out",
        "sigType": "audio"
      }
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
      {
        "name": "1",
        "sigType": "audio"
      },
      {
        "name": "2",
        "sigType": "audio"
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
      {
        "name": "output",
        "sigType": "audio"
      }
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
      {
        "name": "out",
        "sigType": "audio"
      }
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
      {
        "name": "1",
        "sigType": "gate"
      }
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
      {
        "name": "OSC ON",
        "sigType": "gate"
      },
      {
        "name": "OSC OFF",
        "sigType": "gate"
      },
      {
        "name": "Step 1 In",
        "sigType": "gate"
      },
      {
        "name": "Step 2 In",
        "sigType": "gate"
      },
      {
        "name": "Step 3 In",
        "sigType": "gate"
      },
      {
        "name": "Step 4 In",
        "sigType": "gate"
      },
      {
        "name": "Step 5 In",
        "sigType": "gate"
      },
      {
        "name": "Step 6 In",
        "sigType": "gate"
      },
      {
        "name": "Step 7 In",
        "sigType": "gate"
      },
      {
        "name": "Step 8 In",
        "sigType": "gate"
      }
    ],
    "outputs": [
      {
        "name": "Step 1 Out",
        "sigType": "gate"
      },
      {
        "name": "Step 2 Out",
        "sigType": "gate"
      },
      {
        "name": "Step 3 Out",
        "sigType": "gate"
      },
      {
        "name": "Step 4 Out",
        "sigType": "gate"
      },
      {
        "name": "Step 5 Out",
        "sigType": "gate"
      },
      {
        "name": "Step 6 Out",
        "sigType": "gate"
      },
      {
        "name": "Step 7 Out",
        "sigType": "gate"
      },
      {
        "name": "Step 8 Out",
        "sigType": "gate"
      }
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
      {
        "name": "Trig 1",
        "sigType": "gate"
      },
      {
        "name": "Trig 2",
        "sigType": "gate"
      },
      {
        "name": "Trig 3",
        "sigType": "gate"
      },
      {
        "name": "Shift",
        "sigType": "gate"
      },
      {
        "name": "Sig In 1",
        "sigType": "audio"
      },
      {
        "name": "Sig In 2",
        "sigType": "audio"
      },
      {
        "name": "Sig In 3",
        "sigType": "audio"
      }
    ],
    "outputs": [
      {
        "name": "out 1",
        "sigType": "audio"
      },
      {
        "name": "out 2",
        "sigType": "audio"
      }
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
      {
        "name": "In",
        "sigType": "audio"
      }
    ],
    "outputs": [
      {
        "name": "Out",
        "sigType": "audio"
      }
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
      {
        "name": "Level 1",
        "sigType": "cv"
      },
      {
        "name": "Level 2",
        "sigType": "cv"
      },
      {
        "name": "Algo",
        "sigType": "cv"
      },
      {
        "name": "Timbre",
        "sigType": "cv"
      },
      {
        "name": "In 1",
        "sigType": "audio"
      },
      {
        "name": "In 2",
        "sigType": "audio"
      }
    ],
    "outputs": [
      {
        "name": "Out 1 & 2",
        "sigType": "audio"
      },
      {
        "name": "Aux",
        "sigType": "audio"
      }
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
