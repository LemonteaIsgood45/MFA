// Module Federation requires the real entry logic to load asynchronously
// so the shared dependency scope (react, react-dom, zustand...) can be
// negotiated with the host before this app's own code runs.
import("./bootstrap");
