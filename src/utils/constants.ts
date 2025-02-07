import { CookieOptions } from "express";

export const cookieALlOptions: () => CookieOptions = () => {
  if (process.env.NODE_ENV === "development") {
    return {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      domain: "localhost",
    };
  } else {
    return {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      // domain:"livetesting.tech"
    };
  }
};

export const cookieOption = cookieALlOptions();


export const gadgetNames = [
  "EchoSphere",
  "QuantumLens",
  "NeonDrive",
  "HyperLinker",
  "CyberPad",
  "AeroSync",
  "NanoBot-X",
  "HoloView",
  "ShadowDrone",
  "SkyGlide",
  "TitanCore",
  "LumeTrack",
  "NeuraLinker",
  "GlitchPad",
  "InfiCharge",
  "XenoChip",
  "HorizonDex",
  "MetaScope",
  "AlphaBeats",
  "OmniSwitch"
];
