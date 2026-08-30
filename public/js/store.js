const STORE_KEY = 'patchdoc_v1';

const DEFAULT_MODULES = [
  {
    "maker": "Behringer",
    "name": "Waves (Tides)",
    "hp": 14,
    "cat": "envelope",
    "inputs": [
      {
        "name": "Slope"
      },
      {
        "name": "Freq"
      },
      {
        "name": "Smoothness"
      },
      {
        "name": "Shape"
      },
      {
        "name": "Shift/Level"
      },
      {
        "name": "V/Oct"
      },
      {
        "name": "Trig"
      },
      {
        "name": "Clock"
      }
    ],
    "outputs": [
      {
        "name": "Out 1"
      },
      {
        "name": "Out 2"
      },
      {
        "name": "Out 3"
      },
      {
        "name": "Out 4"
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
    "power5": 0,
    "panel": {
      "cols": 6,
      "rows": 6,
      "elements": [
        {
          "type": "enum",
          "ref": "Range",
          "col": 0,
          "row": 0,
          "w": 2,
          "h": 1
        },
        {
          "type": "enum",
          "ref": "Output Mode",
          "col": 4,
          "row": 0,
          "w": 2,
          "h": 1
        },
        {
          "type": "enum",
          "ref": "Ramp",
          "col": 2,
          "row": 1,
          "w": 2,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Freq",
          "col": 0,
          "row": 1,
          "w": 2,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Shift/Level",
          "col": 4,
          "row": 2,
          "w": 2,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Shape",
          "col": 4,
          "row": 1,
          "w": 2,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Slope",
          "col": 0,
          "row": 2,
          "w": 2,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Smoothness",
          "col": 2,
          "row": 2,
          "w": 2,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Slope Attn",
          "col": 0,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Freq Attn",
          "col": 1,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Smooth Attn",
          "col": 2,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Shape Attn",
          "col": 4,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Sh/Lvl Attn",
          "col": 5,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Slope",
          "col": 0,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Freq",
          "col": 1,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "V/Oct",
          "col": 2,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Smoothness",
          "col": 3,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Shape",
          "col": 4,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Shift/Level",
          "col": 5,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Trig",
          "col": 0,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Clock",
          "col": 5,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "Out 1",
          "col": 1,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "Out 2",
          "col": 2,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "Out 3",
          "col": 3,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "Out 4",
          "col": 4,
          "row": 5,
          "w": 1,
          "h": 1
        }
      ]
    }
  },
  {
    "maker": "Behringer",
    "name": "Brains (Plaits)",
    "hp": 16,
    "cat": "oscillator",
    "inputs": [
      {
        "name": "Model"
      },
      {
        "name": "Harmonics"
      },
      {
        "name": "V/Oct"
      },
      {
        "name": "FM"
      },
      {
        "name": "Level"
      },
      {
        "name": "Morph"
      },
      {
        "name": "Trig"
      },
      {
        "name": "Timbre"
      }
    ],
    "outputs": [
      {
        "name": "Out 1"
      },
      {
        "name": "Out 2"
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
        "name": "FM",
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
        "default": 0,
        "display": "clock"
      },
      {
        "name": "Morph",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0,
        "display": "clock"
      },
      {
        "name": "Freq",
        "type": "knob",
        "min": 0,
        "max": 20000,
        "default": 0,
        "display": "freq"
      }
    ],
    "color": "#3e29ff",
    "paramCols": 2,
    "power12p": 0,
    "power12n": 0,
    "power5": 0,
    "panel": {
      "cols": 4,
      "rows": 6,
      "elements": [
        {
          "type": "enum",
          "ref": "Bank",
          "col": 0,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "enum",
          "ref": "Model",
          "col": 3,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Timbre",
          "col": 0,
          "row": 1,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Harmonics",
          "col": 1,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Timbre Attn",
          "col": 0,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "FM",
          "col": 2,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Timbre",
          "col": 0,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Harmonics",
          "col": 1,
          "row": 1,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Model",
          "col": 0,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "V/Oct",
          "col": 1,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Level",
          "col": 2,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Trig",
          "col": 3,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "Out 1",
          "col": 0,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "Out 2",
          "col": 3,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Morph",
          "col": 3,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "FM",
          "col": 2,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Morph Attn",
          "col": 3,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Morph",
          "col": 3,
          "row": 1,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Freq",
          "col": 2,
          "row": 1,
          "w": 1,
          "h": 1
        }
      ]
    }
  },
  {
    "maker": "Behringer",
    "name": "Abacus (Maths)",
    "hp": 20,
    "cat": "utility",
    "inputs": [
      {
        "name": "In 1"
      },
      {
        "name": "Trig 1"
      },
      {
        "name": "Rise 1"
      },
      {
        "name": "Both 1"
      },
      {
        "name": "Fall 1"
      },
      {
        "name": "Cycle 1"
      },
      {
        "name": "In 2"
      },
      {
        "name": "In 3"
      },
      {
        "name": "In 4"
      },
      {
        "name": "Trig 4"
      },
      {
        "name": "Rise 4"
      },
      {
        "name": "Both 4"
      },
      {
        "name": "Fall 4"
      },
      {
        "name": "Cycle 4"
      }
    ],
    "outputs": [
      {
        "name": "Out 1"
      },
      {
        "name": "Out 2"
      },
      {
        "name": "Out 3"
      },
      {
        "name": "Out 4"
      },
      {
        "name": "EOR 1"
      },
      {
        "name": "Func 1"
      },
      {
        "name": "OR"
      },
      {
        "name": "SUM"
      },
      {
        "name": "INV"
      },
      {
        "name": "Func 4"
      },
      {
        "name": "EOC 4"
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
    "power5": 0,
    "panel": {
      "cols": 7,
      "rows": 8,
      "elements": [
        {
          "type": "input",
          "ref": "In 1",
          "col": 0,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Trig 1",
          "col": 1,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "In 2",
          "col": 2,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "In 3",
          "col": 4,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Trig 4",
          "col": 5,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "In 4",
          "col": 6,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Rise 1",
          "col": 0,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Both 1",
          "col": 0,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Fall 1",
          "col": 0,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Cycle 1",
          "col": 0,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "toggle",
          "ref": "Cycle 1",
          "col": 0,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "EOR 1",
          "col": 0,
          "row": 7,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "Func 1",
          "col": 1,
          "row": 7,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "OR",
          "col": 2,
          "row": 7,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "SUM",
          "col": 3,
          "row": 7,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "INV",
          "col": 4,
          "row": 7,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "Func 4",
          "col": 5,
          "row": 7,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "EOC 4",
          "col": 6,
          "row": 7,
          "w": 1,
          "h": 1
        },
        {
          "type": "toggle",
          "ref": "Cycle 4",
          "col": 6,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "Out 1",
          "col": 1,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "Out 2",
          "col": 2,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "Out 3",
          "col": 4,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "Out 4",
          "col": 5,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Rise 4",
          "col": 6,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Both 4",
          "col": 6,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Fall 4",
          "col": 6,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Cycle 4",
          "col": 6,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Rise 1",
          "col": 1,
          "row": 2,
          "w": 2,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Fall 1",
          "col": 1,
          "row": 3,
          "w": 2,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Freq 1",
          "col": 1,
          "row": 4,
          "w": 2,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Attn 1",
          "col": 1,
          "row": 1,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Attn 2",
          "col": 2,
          "row": 1,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Attn 3",
          "col": 4,
          "row": 1,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Attn 4",
          "col": 5,
          "row": 1,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Rise 4",
          "col": 4,
          "row": 2,
          "w": 2,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Fall 4",
          "col": 4,
          "row": 3,
          "w": 2,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Freq 4",
          "col": 4,
          "row": 4,
          "w": 2,
          "h": 1
        }
      ]
    }
  },
  {
    "maker": "Intellijel",
    "name": "Plonk",
    "hp": 12,
    "cat": "oscillator",
    "inputs": [
      {
        "name": "Pitch"
      },
      {
        "name": "Trig"
      },
      {
        "name": "Velocity"
      },
      {
        "name": "X"
      },
      {
        "name": "Mod"
      },
      {
        "name": "Decay"
      },
      {
        "name": "Y"
      }
    ],
    "outputs": [
      {
        "name": "Out"
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
    "power5": 0,
    "panel": {
      "cols": 4,
      "rows": 6,
      "elements": [
        {
          "type": "input",
          "ref": "Pitch",
          "col": 0,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Trig",
          "col": 1,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Velocity",
          "col": 2,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "Out",
          "col": 3,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Y",
          "col": 3,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Y Attn",
          "col": 3,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Y",
          "col": 3,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Decay",
          "col": 3,
          "row": 1,
          "w": 1,
          "h": 1
        },
        {
          "type": "text",
          "ref": "Preset",
          "col": 0,
          "row": 0,
          "w": 4,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Decay",
          "col": 2,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Mod",
          "col": 1,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "X",
          "col": 0,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "X Attn",
          "col": 0,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Mod Attn",
          "col": 1,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Decay Attn",
          "col": 2,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "X",
          "col": 0,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Pitch",
          "col": 0,
          "row": 1,
          "w": 1,
          "h": 1
        }
      ]
    }
  },
  {
    "maker": "Tunefish",
    "name": "PeaksCV",
    "hp": 8,
    "cat": "lfo",
    "inputs": [
      {
        "name": "Trig 1"
      },
      {
        "name": "Trig 2"
      },
      {
        "name": "1"
      },
      {
        "name": "2"
      },
      {
        "name": "3"
      },
      {
        "name": "4"
      }
    ],
    "outputs": [
      {
        "name": "1"
      },
      {
        "name": "2"
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
    "power5": 0,
    "panel": {
      "cols": 4,
      "rows": 7,
      "elements": [
        {
          "type": "knob",
          "ref": "1",
          "col": 0,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "2",
          "col": 0,
          "row": 1,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "3",
          "col": 0,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "4",
          "col": 0,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "1 Attn",
          "col": 3,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "2 Attn",
          "col": 3,
          "row": 1,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "3 Attn",
          "col": 3,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "4 Attn",
          "col": 3,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Out 2 Attn",
          "col": 3,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Trig 1",
          "col": 1,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Trig 2",
          "col": 2,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Out 1 Attn",
          "col": 0,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "1",
          "col": 0,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "2",
          "col": 3,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "1",
          "col": 0,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "2",
          "col": 1,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "3",
          "col": 2,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "4",
          "col": 3,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "toggle",
          "ref": "Split",
          "col": 1,
          "row": 2,
          "w": 2,
          "h": 1
        },
        {
          "type": "enum",
          "ref": "Mode",
          "col": 1,
          "row": 1,
          "w": 2,
          "h": 1
        }
      ]
    }
  },
  {
    "maker": "Behringer",
    "name": "Swords (Blades)",
    "hp": 18,
    "cat": "filter",
    "inputs": [
      {
        "name": "In 1"
      },
      {
        "name": "In 2"
      },
      {
        "name": "V/Oct 1"
      },
      {
        "name": "V/Oct 2"
      },
      {
        "name": "Drive 1"
      },
      {
        "name": "Drive 2"
      },
      {
        "name": "Mode 1"
      },
      {
        "name": "Mode 2"
      },
      {
        "name": "Freq 1"
      },
      {
        "name": "Reso 1"
      },
      {
        "name": "Routing"
      },
      {
        "name": "Freq 2"
      },
      {
        "name": "Reso 2"
      }
    ],
    "outputs": [
      {
        "name": "1"
      },
      {
        "name": "2"
      },
      {
        "name": "Main"
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
      },
      {
        "name": "Shift",
        "type": "toggle",
        "default": false
      }
    ],
    "color": "#2aaa7a",
    "paramCols": 2,
    "power12p": 0,
    "power12n": 0,
    "power5": 0,
    "panel": {
      "cols": 7,
      "rows": 6,
      "elements": [
        {
          "type": "input",
          "ref": "In 1",
          "col": 0,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "In 2",
          "col": 6,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "V/Oct 1",
          "col": 1,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "V/Oct 2",
          "col": 5,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "1",
          "col": 2,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "2",
          "col": 4,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "Main",
          "col": 3,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Drive 1",
          "col": 0,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Drive 2",
          "col": 6,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Freq 2",
          "col": 5,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Freq 1",
          "col": 1,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Reso 1",
          "col": 2,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Reso 2",
          "col": 4,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Routing",
          "col": 3,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Routing",
          "col": 3,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Drive 2 Waveform",
          "col": 6,
          "row": 1,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Drive 1 Waveform",
          "col": 0,
          "row": 1,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Drive 1",
          "col": 0,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Drive 2",
          "col": 6,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Mode 1",
          "col": 0,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Mode 2",
          "col": 6,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Mode 1",
          "col": 0,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Mode 2",
          "col": 6,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Reso 1",
          "col": 2,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Reso 2",
          "col": 4,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Freq 1",
          "col": 2,
          "row": 1,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Freq 2",
          "col": 4,
          "row": 1,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Freq 1 Attn",
          "col": 1,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Reso 1 Attn",
          "col": 2,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Freq 2 Attn",
          "col": 5,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Reso 2 Attn",
          "col": 4,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "toggle",
          "ref": "Shift",
          "col": 3,
          "row": 1,
          "w": 1,
          "h": 1
        }
      ]
    }
  },
  {
    "maker": "AfterLater",
    "name": "Cumulus (Clouds)",
    "hp": 18,
    "cat": "effects",
    "inputs": [
      {
        "name": "L"
      },
      {
        "name": "R"
      },
      {
        "name": "Freeze"
      },
      {
        "name": "Trig"
      },
      {
        "name": "Pos"
      },
      {
        "name": "Dens"
      },
      {
        "name": "Size"
      },
      {
        "name": "Texture"
      },
      {
        "name": "V/Oct"
      },
      {
        "name": "Blend"
      }
    ],
    "outputs": [
      {
        "name": "L"
      },
      {
        "name": "R"
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
    "power5": 0,
    "panel": {
      "cols": 6,
      "rows": 5,
      "elements": [
        {
          "type": "toggle",
          "ref": "Freeze",
          "col": 0,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "enum",
          "ref": "Mode",
          "col": 4,
          "row": 0,
          "w": 2,
          "h": 1
        },
        {
          "type": "output",
          "ref": "L",
          "col": 4,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "R",
          "col": 5,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "L",
          "col": 0,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "R",
          "col": 1,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Dens",
          "col": 2,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Texture",
          "col": 3,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Freeze",
          "col": 0,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Trig",
          "col": 1,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Pos",
          "col": 2,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Size",
          "col": 3,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "V/Oct",
          "col": 4,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Blend",
          "col": 5,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Blend",
          "col": 5,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Pitch",
          "col": 4,
          "row": 1,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "In Gain",
          "col": 0,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Density",
          "col": 2,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Texture",
          "col": 3,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Size",
          "col": 3,
          "row": 1,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Position",
          "col": 2,
          "row": 1,
          "w": 1,
          "h": 1
        }
      ]
    }
  },
  {
    "maker": "Behringer",
    "name": "Surges (Ripples)",
    "hp": 8,
    "cat": "filter",
    "inputs": [
      {
        "name": "In 1"
      },
      {
        "name": "In 2"
      },
      {
        "name": "Freq"
      },
      {
        "name": "Reso"
      },
      {
        "name": "V/Oct"
      },
      {
        "name": "Level"
      }
    ],
    "outputs": [
      {
        "name": "HP"
      },
      {
        "name": "BP"
      },
      {
        "name": "LP"
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
    "power5": 0,
    "panel": {
      "cols": 3,
      "rows": 6,
      "elements": [
        {
          "type": "knob",
          "ref": "Freq",
          "col": 0,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "enum",
          "ref": "Mode",
          "col": 1,
          "row": 0,
          "w": 2,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Reso",
          "col": 2,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "1 Gain",
          "col": 0,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "In 1",
          "col": 0,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "In 2",
          "col": 0,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "HP",
          "col": 0,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "BP",
          "col": 1,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "LP",
          "col": 2,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Freq",
          "col": 1,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Freq Attn",
          "col": 1,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Reso",
          "col": 2,
          "row": 1,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "V/Oct",
          "col": 1,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Level",
          "col": 2,
          "row": 4,
          "w": 1,
          "h": 1
        }
      ]
    }
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
        "name": "CV A"
      },
      {
        "name": "CV B"
      },
      {
        "name": "CV C"
      },
      {
        "name": "CV D"
      },
      {
        "name": "Midi In"
      }
    ],
    "outputs": [
      {
        "name": "Midi Out"
      },
      {
        "name": "Reset"
      },
      {
        "name": "Clock"
      },
      {
        "name": "1 Gate"
      },
      {
        "name": "1 CV"
      },
      {
        "name": "1 Gate"
      },
      {
        "name": "2 CV"
      },
      {
        "name": "2 Gate"
      },
      {
        "name": "3 CV"
      },
      {
        "name": "3 Gate"
      },
      {
        "name": "4 CV"
      },
      {
        "name": "4 Gate"
      },
      {
        "name": "5 CV"
      },
      {
        "name": "5 Gate"
      },
      {
        "name": "6 CV"
      },
      {
        "name": "6 Gate"
      },
      {
        "name": "7 CV"
      },
      {
        "name": "7 Gate"
      },
      {
        "name": "8 CV"
      },
      {
        "name": "8 Gate"
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
    "paramCols": 2,
    "panel": {
      "cols": 5,
      "rows": 8,
      "elements": [
        {
          "type": "output",
          "ref": "1 Gate",
          "col": 4,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "1 CV",
          "col": 3,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "2 CV",
          "col": 3,
          "row": 1,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "4 CV",
          "col": 3,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "3 CV",
          "col": 3,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "5 CV",
          "col": 3,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "6 CV",
          "col": 3,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "7 CV",
          "col": 3,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "8 CV",
          "col": 3,
          "row": 7,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "2 Gate",
          "col": 4,
          "row": 1,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "3 Gate",
          "col": 4,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "4 Gate",
          "col": 4,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "5 Gate",
          "col": 4,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "6 Gate",
          "col": 4,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "7 Gate",
          "col": 4,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "8 Gate",
          "col": 4,
          "row": 7,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "Clock",
          "col": 1,
          "row": 7,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "Reset",
          "col": 0,
          "row": 7,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "Midi Out",
          "col": 1,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Midi In",
          "col": 0,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "CV A",
          "col": 0,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "CV B",
          "col": 0,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "CV C",
          "col": 1,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "CV D",
          "col": 1,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "text",
          "ref": "Project name",
          "col": 0,
          "row": 0,
          "w": 3,
          "h": 1
        }
      ]
    }
  },
  {
    "maker": "Strymon",
    "name": "Magneto",
    "hp": 28,
    "cat": "effects",
    "inputs": [
      {
        "name": "In L"
      },
      {
        "name": "In R"
      },
      {
        "name": "Clock"
      },
      {
        "name": "Rec Gate"
      },
      {
        "name": "Shift"
      },
      {
        "name": "Infinite"
      },
      {
        "name": "Fwd/Bwd"
      },
      {
        "name": "Play"
      },
      {
        "name": "Pause"
      },
      {
        "name": "Tap"
      },
      {
        "name": "Spring"
      },
      {
        "name": "Speed"
      },
      {
        "name": "Wet"
      },
      {
        "name": "Repeats"
      },
      {
        "name": "Send"
      }
    ],
    "outputs": [
      {
        "name": "Out L"
      },
      {
        "name": "Out R"
      },
      {
        "name": "Return"
      },
      {
        "name": "Clock 1"
      },
      {
        "name": "Clock 2"
      },
      {
        "name": "Clock 3"
      },
      {
        "name": "Clock 4"
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
    "paramCols": 4,
    "panel": {
      "cols": 10,
      "rows": 7,
      "elements": [
        {
          "type": "input",
          "ref": "In L",
          "col": 0,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "In R",
          "col": 0,
          "row": 1,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "Out L",
          "col": 0,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "Out R",
          "col": 0,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Send",
          "col": 0,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "Return",
          "col": 0,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Clock",
          "col": 0,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Rec Gate",
          "col": 1,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Shift",
          "col": 2,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Infinite",
          "col": 3,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Fwd/Bwd",
          "col": 4,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Play",
          "col": 5,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Pause",
          "col": 6,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Tap",
          "col": 7,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Spring",
          "col": 8,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "Clock 4",
          "col": 9,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "Clock 3",
          "col": 9,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "Clock 2",
          "col": 9,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "Clock 1",
          "col": 9,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Repeats",
          "col": 9,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Wet",
          "col": 9,
          "row": 1,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Speed",
          "col": 9,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Dry",
          "col": 1,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Rec Level",
          "col": 1,
          "row": 1,
          "w": 1,
          "h": 1
        },
        {
          "type": "enum",
          "ref": "Heads",
          "col": 1,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Low Cut",
          "col": 2,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Tape Age",
          "col": 3,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "toggle",
          "ref": "Transport",
          "col": 4,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Crinkle",
          "col": 5,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Wow",
          "col": 6,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Spring",
          "col": 7,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "enum",
          "ref": "Pan",
          "col": 8,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Head 1",
          "col": 3,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Head 2",
          "col": 4,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Head 3",
          "col": 5,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Head 4",
          "col": 6,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Repeats",
          "col": 8,
          "row": 1,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Wet",
          "col": 8,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Speed/Pitch",
          "col": 4,
          "row": 0,
          "w": 2,
          "h": 2
        },
        {
          "type": "enum",
          "ref": "Modes",
          "col": 2,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "toggle",
          "ref": "Feedback 1",
          "col": 3,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "toggle",
          "ref": "Feedback 2",
          "col": 4,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "toggle",
          "ref": "Feedback 3",
          "col": 5,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "toggle",
          "ref": "Feedback 4",
          "col": 6,
          "row": 3,
          "w": 1,
          "h": 1
        }
      ]
    }
  },
  {
    "maker": "Knobula",
    "name": "Monumatic",
    "hp": 12,
    "cat": "oscillator",
    "inputs": [
      {
        "name": "Midi"
      },
      {
        "name": "Gate"
      },
      {
        "name": "V/Oct"
      },
      {
        "name": "Filter"
      },
      {
        "name": "CV A"
      },
      {
        "name": "CV B"
      }
    ],
    "outputs": [
      {
        "name": "L"
      },
      {
        "name": "R"
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
      },
      {
        "name": "Freq",
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
    "paramCols": 3,
    "panel": {
      "cols": 5,
      "rows": 9,
      "elements": [
        {
          "type": "knob",
          "ref": "Dec/Sus",
          "col": 2,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Release",
          "col": 4,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Attack",
          "col": 0,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Vol (S)",
          "col": 0,
          "row": 1,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Glide (s)",
          "col": 2,
          "row": 1,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Freq",
          "col": 0,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Voice Pan (S)",
          "col": 0,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Res",
          "col": 0,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Env",
          "col": 4,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Pitch Env (S)",
          "col": 4,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "enum",
          "ref": "Key Follow",
          "col": 4,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "enum",
          "ref": "Filter Type",
          "col": 3,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Osc Detune",
          "col": 0,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Pitch",
          "col": 1,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Fine Tune (S)",
          "col": 1,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Chord sel (s)",
          "col": 4,
          "row": 1,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Midi Ch (S)",
          "col": 1,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Midi",
          "col": 0,
          "row": 8,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Gate",
          "col": 0,
          "row": 7,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "V/Oct",
          "col": 1,
          "row": 7,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Filter",
          "col": 1,
          "row": 8,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "CV A",
          "col": 2,
          "row": 7,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "CV B",
          "col": 2,
          "row": 8,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "L",
          "col": 4,
          "row": 7,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "R",
          "col": 4,
          "row": 8,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Reverb",
          "col": 2,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Temperament (S)",
          "col": 0,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Reverb Time (S)",
          "col": 2,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "enum",
          "ref": "Mode",
          "col": 3,
          "row": 5,
          "w": 2,
          "h": 1
        }
      ]
    }
  },
  {
    "maker": "Doepfer",
    "name": "A-135-2 Quad VCA",
    "hp": 8,
    "cat": "vca",
    "inputs": [
      {
        "name": "Ch 1"
      },
      {
        "name": "Ch 2"
      },
      {
        "name": "Ch 3"
      },
      {
        "name": "Ch 4"
      },
      {
        "name": "CV 1"
      },
      {
        "name": "CV 2"
      },
      {
        "name": "CV 3"
      },
      {
        "name": "CV 4"
      }
    ],
    "outputs": [
      {
        "name": "Ch 1"
      },
      {
        "name": "Ch 2"
      },
      {
        "name": "Ch 3"
      },
      {
        "name": "Ch 4"
      },
      {
        "name": "Selected"
      },
      {
        "name": "All"
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
    "paramCols": 2,
    "panel": {
      "cols": 4,
      "rows": 8,
      "elements": [
        {
          "type": "output",
          "ref": "Selected",
          "col": 0,
          "row": 7,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "All",
          "col": 3,
          "row": 7,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "Ch 1",
          "col": 0,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "Ch 2",
          "col": 1,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "Ch 3",
          "col": 2,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "Ch 4",
          "col": 3,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Ch 1",
          "col": 0,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Ch 2",
          "col": 1,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Ch 3",
          "col": 2,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Ch 4",
          "col": 3,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "CV 1",
          "col": 0,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "CV 2",
          "col": 1,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "CV 3",
          "col": 2,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "CV 4",
          "col": 3,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "CV 1",
          "col": 0,
          "row": 2,
          "w": 2,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "CV 2",
          "col": 2,
          "row": 2,
          "w": 2,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "CV 3",
          "col": 0,
          "row": 3,
          "w": 2,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "CV 4",
          "col": 2,
          "row": 3,
          "w": 2,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Level 1",
          "col": 0,
          "row": 0,
          "w": 2,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "level 2",
          "col": 2,
          "row": 0,
          "w": 2,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Level 3",
          "col": 0,
          "row": 1,
          "w": 2,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Level 4",
          "col": 2,
          "row": 1,
          "w": 2,
          "h": 1
        }
      ]
    }
  },
  {
    "maker": "Expert Sleepers",
    "name": "Disting mk4",
    "hp": 4,
    "cat": "utility",
    "inputs": [
      {
        "name": "Z"
      },
      {
        "name": "X"
      },
      {
        "name": "Y"
      }
    ],
    "outputs": [
      {
        "name": "A"
      },
      {
        "name": "B"
      }
    ],
    "id": 20,
    "paramDefs": [
      {
        "name": "Program",
        "type": "enum",
        "options": "A1, A2, A3, A4, A5, A6, A7, A8, B1, B2, B3, B4, B5, B6, B7, B8, C1, C2, C3, C4, C5, C6, C7, C8, D1, D2, D3, D4, D5, D6, D7, D8, E1, E2, E3, E4, E5, E6, E7, E8, F1, F2, F3, F4, F5, F6, F7, F8, G1, G2, G3, G4, G5, G6, G7, G8, H1, H2, H3, H4, H5, H6, H7, H8, I1, I2, I3, I4, I5, I6, I7, I8, J1, J2, J3, J4, J5, J6, J7, J8, K1, K2, K3, K4, K5, K6, K7, K8, L1, L2, L3, L4, L5, L6, L7, L8, M1, M2, M3, M4, M5, M6, M7, M8, N1, N2, N3, N4, N5, N6, N7, N8",
        "default": "A1"
      },
      {
        "name": "Knob",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      }
    ],
    "color": "#ff6a00",
    "power12p": 0,
    "power12n": 0,
    "power5": 0,
    "paramCols": 3,
    "panel": {
      "cols": 2,
      "rows": 7,
      "elements": [
        {
          "type": "enum",
          "ref": "Program",
          "col": 0,
          "row": 0,
          "w": 2,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Knob",
          "col": 0,
          "row": 1,
          "w": 2,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Z",
          "col": 0,
          "row": 2,
          "w": 2,
          "h": 1
        },
        {
          "type": "input",
          "ref": "X",
          "col": 0,
          "row": 3,
          "w": 2,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Y",
          "col": 0,
          "row": 4,
          "w": 2,
          "h": 1
        },
        {
          "type": "output",
          "ref": "A",
          "col": 0,
          "row": 5,
          "w": 2,
          "h": 1
        },
        {
          "type": "output",
          "ref": "B",
          "col": 0,
          "row": 6,
          "w": 2,
          "h": 1
        }
      ]
    }
  },
  {
    "maker": "Doepfer",
    "name": "A-180-3 Multiple",
    "hp": 4,
    "cat": "utility",
    "inputs": [
      {
        "name": "1"
      },
      {
        "name": "2"
      }
    ],
    "outputs": [
      {
        "name": "1-1"
      },
      {
        "name": "1-2"
      },
      {
        "name": "1-3"
      },
      {
        "name": "2-1"
      },
      {
        "name": "2-2"
      },
      {
        "name": "2-3"
      }
    ],
    "id": 21,
    "paramDefs": [],
    "color": "#ff6a00",
    "power12p": 0,
    "power12n": 0,
    "power5": 0,
    "paramCols": 3,
    "panel": {
      "cols": 2,
      "rows": 8,
      "elements": [
        {
          "type": "input",
          "ref": "1",
          "col": 0,
          "row": 0,
          "w": 2,
          "h": 1
        },
        {
          "type": "output",
          "ref": "1-1",
          "col": 0,
          "row": 1,
          "w": 2,
          "h": 1
        },
        {
          "type": "output",
          "ref": "1-2",
          "col": 0,
          "row": 2,
          "w": 2,
          "h": 1
        },
        {
          "type": "output",
          "ref": "1-3",
          "col": 0,
          "row": 3,
          "w": 2,
          "h": 1
        },
        {
          "type": "input",
          "ref": "2",
          "col": 0,
          "row": 4,
          "w": 2,
          "h": 1
        },
        {
          "type": "output",
          "ref": "2-1",
          "col": 0,
          "row": 5,
          "w": 2,
          "h": 1
        },
        {
          "type": "output",
          "ref": "2-2",
          "col": 0,
          "row": 6,
          "w": 2,
          "h": 1
        },
        {
          "type": "output",
          "ref": "2-3",
          "col": 0,
          "row": 7,
          "w": 2,
          "h": 1
        }
      ]
    }
  },
  {
    "maker": "AfterLater Audio",
    "name": "uRings",
    "hp": 8,
    "cat": "oscillator",
    "inputs": [
      {
        "name": "Position"
      },
      {
        "name": "Brite"
      },
      {
        "name": "Shape"
      },
      {
        "name": "Damp"
      },
      {
        "name": "FM"
      },
      {
        "name": "V/Oct"
      },
      {
        "name": "Strum"
      },
      {
        "name": "Audio"
      }
    ],
    "outputs": [
      {
        "name": "Odd"
      },
      {
        "name": "Even"
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
    "paramCols": 2,
    "panel": {
      "cols": 4,
      "rows": 8,
      "elements": [
        {
          "type": "knob",
          "ref": "Attn Freq",
          "col": 0,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Freq",
          "col": 3,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Attn Shape",
          "col": 0,
          "row": 1,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Shape",
          "col": 3,
          "row": 1,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Attn Brite",
          "col": 0,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Brite",
          "col": 3,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Attn Damp",
          "col": 0,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Damp",
          "col": 3,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Attn Pos",
          "col": 0,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Pos",
          "col": 3,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "enum",
          "ref": "Poly",
          "col": 1,
          "row": 1,
          "w": 2,
          "h": 1
        },
        {
          "type": "enum",
          "ref": "Mode",
          "col": 1,
          "row": 2,
          "w": 2,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Position",
          "col": 0,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Audio",
          "col": 3,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Brite",
          "col": 0,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Damp",
          "col": 1,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Shape",
          "col": 0,
          "row": 7,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "FM",
          "col": 1,
          "row": 7,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "V/Oct",
          "col": 2,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Strum",
          "col": 3,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "Odd",
          "col": 2,
          "row": 7,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "Even",
          "col": 3,
          "row": 7,
          "w": 1,
          "h": 1
        }
      ]
    }
  },
  {
    "maker": "Doepfer",
    "name": "A-140-2 Dual ADSR",
    "hp": 8,
    "cat": "envelope",
    "inputs": [
      {
        "name": "Ch 1 Gate"
      },
      {
        "name": "Ch 1 Retr"
      },
      {
        "name": "Ch 1 CV"
      },
      {
        "name": "Ch 2 Gate"
      },
      {
        "name": "Ch 2 Retr"
      },
      {
        "name": "Ch 2 CV"
      }
    ],
    "outputs": [
      {
        "name": "Ch 1-1"
      },
      {
        "name": "Ch 1-2"
      },
      {
        "name": "Ch 2-1"
      },
      {
        "name": "Ch 2-2"
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
      },
      {
        "name": "CV 1 Attn",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "CV 2 Attn",
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
    "power5": 0,
    "panel": {
      "cols": 4,
      "rows": 7,
      "elements": [
        {
          "type": "knob",
          "ref": "Ch 1 A",
          "col": 0,
          "row": 0,
          "w": 2,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Ch 2 A",
          "col": 2,
          "row": 0,
          "w": 2,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Ch 1 D",
          "col": 0,
          "row": 1,
          "w": 2,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Ch 1 S",
          "col": 0,
          "row": 2,
          "w": 2,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Ch 1 R",
          "col": 0,
          "row": 3,
          "w": 2,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Ch 2 D",
          "col": 2,
          "row": 1,
          "w": 2,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Ch 2 S",
          "col": 2,
          "row": 2,
          "w": 2,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Ch 2 R",
          "col": 2,
          "row": 3,
          "w": 2,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Ch 1 Gate",
          "col": 1,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Ch 2 Gate",
          "col": 3,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Ch 1 Retr",
          "col": 1,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Ch 2 Retr",
          "col": 3,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Ch 1 CV",
          "col": 0,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Ch 2 CV",
          "col": 2,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "Ch 1-1",
          "col": 1,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "Ch 1-2",
          "col": 0,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "Ch 2-1",
          "col": 3,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "Ch 2-2",
          "col": 2,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "CV 1 Attn",
          "col": 0,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "CV 2 Attn",
          "col": 2,
          "row": 4,
          "w": 1,
          "h": 1
        }
      ]
    }
  },
  {
    "maker": "Doepfer",
    "name": "A-160-2 Divider",
    "hp": 4,
    "cat": "utility",
    "inputs": [
      {
        "name": "Clock"
      },
      {
        "name": "Reset"
      }
    ],
    "outputs": [
      {
        "name": "2/2/2"
      },
      {
        "name": "4/3/3"
      },
      {
        "name": "8/5/4"
      },
      {
        "name": "16/7/5"
      },
      {
        "name": "32/11/6"
      },
      {
        "name": "64/13/7"
      },
      {
        "name": "128/17/8"
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
    "paramCols": 2,
    "panel": {
      "cols": 2,
      "rows": 10,
      "elements": [
        {
          "type": "input",
          "ref": "Clock",
          "col": 1,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Reset",
          "col": 1,
          "row": 1,
          "w": 1,
          "h": 1
        },
        {
          "type": "enum",
          "ref": "Mode",
          "col": 0,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "enum",
          "ref": "Out",
          "col": 0,
          "row": 1,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "2/2/2",
          "col": 0,
          "row": 3,
          "w": 2,
          "h": 1
        },
        {
          "type": "output",
          "ref": "4/3/3",
          "col": 0,
          "row": 4,
          "w": 2,
          "h": 1
        },
        {
          "type": "output",
          "ref": "8/5/4",
          "col": 0,
          "row": 5,
          "w": 2,
          "h": 1
        },
        {
          "type": "output",
          "ref": "16/7/5",
          "col": 0,
          "row": 6,
          "w": 2,
          "h": 1
        },
        {
          "type": "output",
          "ref": "32/11/6",
          "col": 0,
          "row": 7,
          "w": 2,
          "h": 1
        },
        {
          "type": "output",
          "ref": "64/13/7",
          "col": 0,
          "row": 8,
          "w": 2,
          "h": 1
        },
        {
          "type": "output",
          "ref": "128/17/8",
          "col": 0,
          "row": 9,
          "w": 2,
          "h": 1
        },
        {
          "type": "divider-h",
          "ref": null,
          "col": 0,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "divider-h",
          "ref": null,
          "col": 1,
          "row": 2,
          "w": 1,
          "h": 1
        }
      ]
    }
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
        "name": "In 1",
        "sigType": "audio"
      },
      {
        "name": "In 2",
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
      },
      {
        "name": "comp",
        "sigType": "cv"
      },
      {
        "name": "dist",
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
      },
      {
        "name": "Delay",
        "type": "knob",
        "min": 1,
        "max": 9,
        "default": 1
      }
    ],
    "color": "#7aaa2a",
    "paramCols": 4,
    "power12p": 0,
    "power12n": 0,
    "power5": 0,
    "id": 28,
    "panel": {
      "cols": 5,
      "rows": 10,
      "elements": [
        {
          "type": "knob",
          "ref": "Tone",
          "col": 1,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "Envelope",
          "col": 2,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Volume",
          "col": 3,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Drive (s)",
          "col": 3,
          "row": 1,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Gain (S)",
          "col": 1,
          "row": 1,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Compressor",
          "col": 2,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "pre vca",
          "col": 1,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "comp",
          "col": 2,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Distortion",
          "col": 1,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "dist",
          "col": 0,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Sidechain",
          "col": 3,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "trig in",
          "col": 4,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "vcf",
          "col": 0,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Cutoff",
          "col": 0,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Frequency",
          "col": 1,
          "row": 4,
          "w": 3,
          "h": 2
        },
        {
          "type": "input",
          "ref": "resonance",
          "col": 4,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Resonance",
          "col": 4,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "delay dry/wet",
          "col": 0,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Delay",
          "col": 1,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "time / v/oct",
          "col": 2,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Reverb",
          "col": 3,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "reverb dry/wet",
          "col": 4,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Repeats",
          "col": 0,
          "row": 7,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "repeats",
          "col": 1,
          "row": 7,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Time/Div",
          "col": 2,
          "row": 7,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "tail",
          "col": 3,
          "row": 7,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Tail",
          "col": 4,
          "row": 7,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Tone (S)",
          "col": 0,
          "row": 8,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Predelay (S)",
          "col": 4,
          "row": 8,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Env depth (S)",
          "col": 4,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "clock",
          "col": 0,
          "row": 9,
          "w": 1,
          "h": 1
        },
        {
          "type": "toggle",
          "ref": "Bandbass",
          "col": 3,
          "row": 9,
          "w": 1,
          "h": 1
        },
        {
          "type": "toggle",
          "ref": "Freeze",
          "col": 2,
          "row": 9,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "distortion",
          "col": 0,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "post vca",
          "col": 3,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "freeze",
          "col": 1,
          "row": 9,
          "w": 1,
          "h": 1
        },
        {
          "type": "toggle",
          "ref": "Comb (S)",
          "col": 4,
          "row": 9,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "In 1",
          "col": 0,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "In 2",
          "col": 0,
          "row": 1,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "Out 1",
          "col": 4,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "Out 2",
          "col": 4,
          "row": 1,
          "w": 1,
          "h": 1
        }
      ]
    }
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
        "name": "OSC ON"
      },
      {
        "name": "OSC OFF"
      },
      {
        "name": "Step 1 In"
      },
      {
        "name": "Step 2 In"
      },
      {
        "name": "Step 3 In"
      },
      {
        "name": "Step 4 In"
      },
      {
        "name": "Step 5 In"
      },
      {
        "name": "Step 6 In"
      },
      {
        "name": "Step 7 In"
      },
      {
        "name": "Step 8 In"
      }
    ],
    "outputs": [
      {
        "name": "Step 1 Out"
      },
      {
        "name": "Step 2 Out"
      },
      {
        "name": "Step 3 Out"
      },
      {
        "name": "Step 4 Out"
      },
      {
        "name": "Step 5 Out"
      },
      {
        "name": "Step 6 Out"
      },
      {
        "name": "Step 7 Out"
      },
      {
        "name": "Step 8 Out"
      },
      {
        "name": "A 1 Out"
      },
      {
        "name": "A 2 Out"
      },
      {
        "name": "B 1 Out"
      },
      {
        "name": "B 2 Out"
      },
      {
        "name": "C 1 Out"
      },
      {
        "name": "C 2 Out"
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
    "color": "#4ac4c4",
    "paramCols": 8,
    "power12p": 0,
    "power12n": 0,
    "power5": 0,
    "id": 38,
    "panel": {
      "cols": 12,
      "rows": 7,
      "elements": [
        {
          "ref": "1-A",
          "type": "knob",
          "col": 1,
          "row": 0
        },
        {
          "ref": "2-A",
          "type": "knob",
          "col": 2,
          "row": 0
        },
        {
          "ref": "3-A",
          "type": "knob",
          "col": 3,
          "row": 0
        },
        {
          "ref": "4-A",
          "type": "knob",
          "col": 4,
          "row": 0
        },
        {
          "ref": "5-A",
          "type": "knob",
          "col": 5,
          "row": 0
        },
        {
          "ref": "6-A",
          "type": "knob",
          "col": 6,
          "row": 0
        },
        {
          "ref": "7-A",
          "type": "knob",
          "col": 7,
          "row": 0
        },
        {
          "ref": "8-A",
          "type": "knob",
          "col": 8,
          "row": 0
        },
        {
          "ref": "1-B",
          "type": "knob",
          "col": 1,
          "row": 1
        },
        {
          "ref": "2-B",
          "type": "knob",
          "col": 2,
          "row": 1
        },
        {
          "ref": "3-B",
          "type": "knob",
          "col": 3,
          "row": 1
        },
        {
          "ref": "4-B",
          "type": "knob",
          "col": 4,
          "row": 1
        },
        {
          "ref": "5-B",
          "type": "knob",
          "col": 5,
          "row": 1
        },
        {
          "ref": "6-B",
          "type": "knob",
          "col": 6,
          "row": 1
        },
        {
          "ref": "7-B",
          "type": "knob",
          "col": 7,
          "row": 1
        },
        {
          "ref": "8-B",
          "type": "knob",
          "col": 8,
          "row": 1
        },
        {
          "ref": "1-C",
          "type": "knob",
          "col": 1,
          "row": 2
        },
        {
          "ref": "2-C",
          "type": "knob",
          "col": 2,
          "row": 2
        },
        {
          "ref": "3-C",
          "type": "knob",
          "col": 3,
          "row": 2
        },
        {
          "ref": "4-C",
          "type": "knob",
          "col": 4,
          "row": 2
        },
        {
          "ref": "5-C",
          "type": "knob",
          "col": 5,
          "row": 2
        },
        {
          "ref": "6-C",
          "type": "knob",
          "col": 6,
          "row": 2
        },
        {
          "ref": "7-C",
          "type": "knob",
          "col": 7,
          "row": 2
        },
        {
          "ref": "8-C",
          "type": "knob",
          "col": 8,
          "row": 2
        },
        {
          "ref": null,
          "type": "divider",
          "col": 1,
          "row": 4,
          "w": 8
        },
        {
          "ref": "Step 1 In",
          "type": "input",
          "col": 1,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "ref": "Step 2 In",
          "type": "input",
          "col": 2,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "ref": "Step 3 In",
          "type": "input",
          "col": 3,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "ref": "Step 4 In",
          "type": "input",
          "col": 4,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "ref": "Step 6 In",
          "type": "input",
          "col": 6,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "ref": "Step 7 In",
          "type": "input",
          "col": 7,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "ref": "Step 8 In",
          "type": "input",
          "col": 8,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "ref": "Step 1 Out",
          "type": "output",
          "col": 1,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "ref": "Step 2 Out",
          "type": "output",
          "col": 2,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "ref": "Step 3 Out",
          "type": "output",
          "col": 3,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "ref": "Step 4 Out",
          "type": "output",
          "col": 4,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "ref": "Step 5 Out",
          "type": "output",
          "col": 5,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "ref": "Step 6 Out",
          "type": "output",
          "col": 6,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "ref": "Step 7 Out",
          "type": "output",
          "col": 7,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "ref": "Step 8 Out",
          "type": "output",
          "col": 8,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "enum",
          "ref": "Step 1",
          "col": 1,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "enum",
          "ref": "Step 2",
          "col": 2,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "enum",
          "ref": "Step 3",
          "col": 3,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "enum",
          "ref": "Step 4",
          "col": 4,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "enum",
          "ref": "Step 5",
          "col": 5,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "enum",
          "ref": "Step 6",
          "col": 6,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "enum",
          "ref": "Step 7",
          "col": 7,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "enum",
          "ref": "Step 8",
          "col": 8,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Fr Range",
          "col": 0,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Fr Vernier",
          "col": 0,
          "row": 1,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "OSC ON",
          "col": 0,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "OSC OFF",
          "col": 0,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Step 5 In",
          "col": 5,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "A 1 Out",
          "col": 9,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "A 2 Out",
          "col": 10,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "enum",
          "ref": "Range 1",
          "col": 11,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "enum",
          "ref": "Range 2",
          "col": 11,
          "row": 1,
          "w": 1,
          "h": 1
        },
        {
          "type": "enum",
          "ref": "Range 3",
          "col": 11,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "B 1 Out",
          "col": 9,
          "row": 1,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "B 2 Out",
          "col": 10,
          "row": 1,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "C 1 Out",
          "col": 9,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "C 2 Out",
          "col": 10,
          "row": 2,
          "w": 1,
          "h": 1
        }
      ]
    }
  },
  {
    "maker": "Behringer",
    "name": "962 Sequential Switch",
    "hp": 8,
    "cat": "utility",
    "inputs": [
      {
        "name": "TrigI 1"
      },
      {
        "name": "TrigIn 2"
      },
      {
        "name": "TrigIn 3"
      },
      {
        "name": "Shift"
      },
      {
        "name": "SigIn 1"
      },
      {
        "name": "SigIn 2"
      },
      {
        "name": "SigIn 3"
      }
    ],
    "outputs": [
      {
        "name": "out 1"
      },
      {
        "name": "out 2"
      },
      {
        "name": "TrigOut 1"
      },
      {
        "name": "TrigOut 2"
      },
      {
        "name": "TrigOut 3"
      }
    ],
    "paramDefs": [],
    "color": "#ff6a00",
    "paramCols": 3,
    "power12p": 0,
    "power12n": 0,
    "power5": 0,
    "id": 39,
    "panel": {
      "cols": 3,
      "rows": 6,
      "elements": [
        {
          "type": "input",
          "ref": "Shift",
          "col": 1,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "out 1",
          "col": 2,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "out 2",
          "col": 2,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "SigIn 1",
          "col": 0,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "SigIn 2",
          "col": 0,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "SigIn 3",
          "col": 0,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "TrigOut 1",
          "col": 0,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "TrigOut 2",
          "col": 1,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "TrigOut 3",
          "col": 2,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "TrigI 1",
          "col": 0,
          "row": 1,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "TrigIn 2",
          "col": 1,
          "row": 1,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "TrigIn 3",
          "col": 2,
          "row": 1,
          "w": 1,
          "h": 1
        }
      ]
    }
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
    "id": 40,
    "panel": {
      "cols": 3,
      "rows": 4,
      "elements": [
        {
          "ref": "In",
          "type": "input",
          "col": 0,
          "row": 0
        },
        {
          "ref": "Out",
          "type": "output",
          "col": 2,
          "row": 0
        },
        {
          "ref": "Brass Vol.",
          "type": "knob",
          "col": 0,
          "row": 1
        },
        {
          "ref": "Sens.",
          "type": "knob",
          "col": 1,
          "row": 1
        },
        {
          "ref": "Ball Vol.",
          "type": "knob",
          "col": 2,
          "row": 1
        },
        {
          "ref": "Brass",
          "type": "switch",
          "col": 0,
          "row": 3
        },
        {
          "ref": "Harmonic",
          "type": "switch",
          "col": 2,
          "row": 3
        },
        {
          "type": "divider",
          "ref": null,
          "col": 1,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "divider",
          "ref": null,
          "col": 0,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "divider",
          "ref": null,
          "col": 2,
          "row": 2,
          "w": 1,
          "h": 1
        }
      ]
    }
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
      },
      {
        "name": "Algorithm",
        "type": "knob",
        "min": 1,
        "max": 9,
        "default": 1
      }
    ],
    "color": null,
    "paramCols": 2,
    "power12p": 0,
    "power12n": 0,
    "power5": 0,
    "id": 41,
    "panel": {
      "cols": 4,
      "rows": 8,
      "elements": [
        {
          "type": "input",
          "ref": "Level 1",
          "col": 0,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Level 2",
          "col": 1,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Algo",
          "col": 2,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Timbre",
          "col": 3,
          "row": 6,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "In 1",
          "col": 0,
          "row": 7,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "In 2",
          "col": 1,
          "row": 7,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "Out 1 & 2",
          "col": 2,
          "row": 7,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "Aux",
          "col": 3,
          "row": 7,
          "w": 1,
          "h": 1
        },
        {
          "type": "toggle",
          "ref": "Int OSC",
          "col": 0,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Level 1",
          "col": 0,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Level 2",
          "col": 1,
          "row": 5,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Timbre",
          "col": 3,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "divider",
          "ref": null,
          "col": 0,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "divider",
          "ref": null,
          "col": 1,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "divider",
          "ref": null,
          "col": 2,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "divider",
          "ref": null,
          "col": 3,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Algorithm",
          "col": 1,
          "row": 0,
          "w": 2,
          "h": 2
        }
      ]
    }
  },
  {
    "maker": "Behringer",
    "name": "CHAOS (MI Marbles)",
    "hp": 18,
    "cat": "utility",
    "inputs": [
      {
        "name": "Bias t"
      },
      {
        "name": "Bias X"
      },
      {
        "name": "Jitter"
      },
      {
        "name": "Rate"
      },
      {
        "name": "Clock t"
      },
      {
        "name": "Feedback"
      },
      {
        "name": "Clock X"
      },
      {
        "name": "Spread"
      },
      {
        "name": "Steps"
      }
    ],
    "outputs": [
      {
        "name": "t1"
      },
      {
        "name": "t2"
      },
      {
        "name": "t3"
      },
      {
        "name": "Y"
      },
      {
        "name": "X1"
      },
      {
        "name": "X2"
      },
      {
        "name": "X3"
      }
    ],
    "paramDefs": [
      {
        "name": "Bias t",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Feedback",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Bias X",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Rate",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Spread",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Jitter",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Length",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Steps",
        "type": "knob",
        "min": 0,
        "max": 100,
        "default": 0
      },
      {
        "name": "Jitter",
        "type": "enum",
        "options": "Orange, Red, Green",
        "default": "Orange"
      },
      {
        "name": "Rate",
        "type": "enum",
        "options": "Orange, Red, Green",
        "default": "Orange"
      },
      {
        "name": "Spread",
        "type": "enum",
        "options": "Orange, Red, Green",
        "default": "Orange"
      },
      {
        "name": "Steps",
        "type": "enum",
        "options": "Orange, Red, Green",
        "default": "Orange"
      },
      {
        "name": "t",
        "type": "toggle",
        "default": false
      },
      {
        "name": "X",
        "type": "toggle",
        "default": false
      }
    ],
    "color": null,
    "paramCols": 4,
    "power12p": 0,
    "power12n": 0,
    "power5": 0,
    "panel": {
      "cols": 7,
      "rows": 6,
      "elements": [
        {
          "type": "knob",
          "ref": "Bias t",
          "col": 1,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Feedback",
          "col": 3,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Bias X",
          "col": 5,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "toggle",
          "ref": "t",
          "col": 2,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "toggle",
          "ref": "X",
          "col": 4,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Bias t",
          "col": 0,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Bias X",
          "col": 6,
          "row": 0,
          "w": 1,
          "h": 1
        },
        {
          "type": "enum",
          "ref": "Jitter",
          "col": 0,
          "row": 1,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Rate",
          "col": 2,
          "row": 1,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Spread",
          "col": 4,
          "row": 1,
          "w": 1,
          "h": 1
        },
        {
          "type": "enum",
          "ref": "Steps",
          "col": 6,
          "row": 1,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Jitter",
          "col": 0,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "enum",
          "ref": "Rate",
          "col": 2,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Length",
          "col": 3,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "enum",
          "ref": "Spread",
          "col": 4,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "knob",
          "ref": "Steps",
          "col": 6,
          "row": 2,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Jitter",
          "col": 0,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Rate",
          "col": 1,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Clock t",
          "col": 2,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Feedback",
          "col": 3,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Clock X",
          "col": 4,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Spread",
          "col": 5,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "input",
          "ref": "Steps",
          "col": 6,
          "row": 3,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "t1",
          "col": 0,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "t2",
          "col": 1,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "t3",
          "col": 2,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "Y",
          "col": 3,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "X1",
          "col": 4,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "X2",
          "col": 5,
          "row": 4,
          "w": 1,
          "h": 1
        },
        {
          "type": "output",
          "ref": "X3",
          "col": 6,
          "row": 4,
          "w": 1,
          "h": 1
        }
      ]
    },
    "id": 42
  }
];

function defaultState() {
  return {
    version: 2,
    modules: JSON.parse(JSON.stringify(DEFAULT_MODULES)),
    nextModuleId: 43,
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

  // True only in the Tauri desktop build, and only once NasSync has a
  // folder + username configured (see nassync.js) — reads/writes go
  // straight to that shared NAS folder instead of this device's own
  // localStorage, with no server involved on either end.
  _nasActive() {
    return typeof NasSync !== 'undefined' && NasSync.isEnabled();
  },

  // Load state — NAS sync, server mode, or localStorage (static/PWA mode)
  async loadFromServer() {
    if (this._nasActive()) {
      try {
        const statePart   = await NasSync.readState();
        const modulesPart = await NasSync.readModules();
        this._state = statePart || defaultState();
        if (modulesPart) {
          this._state.modules      = modulesPart.modules;
          this._state.nextModuleId = modulesPart.nextModuleId || 24;
        }
        this._username = NasSync.username();
      } catch(e) {
        console.warn('NAS sync load failed:', e);
        this._loadFailed = true;
        if (!this._state) this._state = defaultState();
      }
      return this._state;
    }
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
    if (this._nasActive()) {
      clearTimeout(this._saveTimer);
      this._saveTimer = setTimeout(() => this._saveToNas(), 600);
      return;
    }
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
    if (this._nasActive()) { clearTimeout(this._saveTimer); this._saveToNas(); return; }
    if (window.PATCHDOC_STATIC) { this.save(); return; }
    clearTimeout(this._saveTimer);
    // Cancel any pending debounced save — we're saving immediately
    if (this._saveAbort) { this._saveAbort.abort(); this._saveAbort = null; }
    this._saveToServer(false); // false = no abort, must complete
  },

  // Same payload shape as _saveToServer's userState — modules are saved
  // separately (_saveModules), same split as the server's own /api/state
  // vs /api/modules so the on-disk files stay byte-for-byte what the
  // server itself would produce.
  async _saveToNas() {
    const userState = {
      version:       this._state.version,
      patches:       this._state.patches,
      activePatchId: this._state.activePatchId,
      nextPatchNum:  this._state.nextPatchNum,
    };
    try {
      await NasSync.writeState(userState);
      this._showSaveIndicator(true);
    } catch(e) {
      console.error('NAS sync save failed:', e);
      this._showSaveIndicator(false);
    }
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
    if (this._nasActive()) {
      try {
        await NasSync.writeModules({ modules: this._state.modules, nextModuleId: this._state.nextModuleId });
      } catch(e) { console.error('NAS sync module save failed:', e); }
      return;
    }
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
    // sendBeacon is an HTTP-unload mechanism, meaningless for a Tauri fs
    // write — a plain best-effort save is the closest equivalent here.
    if (this._nasActive()) { this.saveNow(); return; }
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
