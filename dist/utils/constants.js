"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gadgetNames = exports.cookieOption = exports.cookieALlOptions = void 0;
const cookieALlOptions = () => {
    if (process.env.NODE_ENV === "development") {
        return {
            httpOnly: true,
            secure: false,
            sameSite: "none",
            domain: "localhost",
        };
    }
    else {
        return {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            // domain:"livetesting.tech"
        };
    }
};
exports.cookieALlOptions = cookieALlOptions;
exports.cookieOption = (0, exports.cookieALlOptions)();
exports.gadgetNames = [
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
